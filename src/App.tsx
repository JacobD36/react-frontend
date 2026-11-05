import { useState } from "react";
import LoginForm from "./components/LoginForm";
import MatrixInput from "./components/MatrixInput";
import MatrixViewer from "./components/MatrixViewer";
import StatsDashboard from "./components/StatsDashboard";
import { ApiError, login, processMatrix, type MatrixValues, type ProcessResponse } from "./services/apiService";

const MAX_DIMENSION = 10;

function createEmptyValues(rows: number, columns: number): MatrixValues {
  return Array.from({ length: rows }, () => Array.from({ length: columns }, () => 0));
}

// Conserva los valores existentes al cambiar el tamaño de la matriz.
function resizeValues(values: MatrixValues, rows: number, columns: number): MatrixValues {
  return Array.from({ length: rows }, (_, rowIndex) =>
    Array.from({ length: columns }, (_, columnIndex) => values[rowIndex]?.[columnIndex] ?? 0),
  );
}

function clampDimension(value: number): number {
  return Number.isFinite(value) ? Math.min(MAX_DIMENSION, Math.max(1, Math.trunc(value))) : 1;
}

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [rows, setRows] = useState(2);
  const [columns, setColumns] = useState(3);
  const [values, setValues] = useState<MatrixValues>(() => createEmptyValues(2, 3));
  const [result, setResult] = useState<ProcessResponse | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(user: string, password: string) {
    setLoginLoading(true);
    setError(null);
    try {
      setToken(await login(user, password));
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "Error inesperado al iniciar sesión.");
    } finally {
      setLoginLoading(false);
    }
  }

  function handleResize(nextRows: number, nextColumns: number) {
    const safeRows = clampDimension(nextRows);
    const safeColumns = clampDimension(nextColumns);
    setRows(safeRows);
    setColumns(safeColumns);
    setValues((current) => resizeValues(current, safeRows, safeColumns));
  }

  function handleCellChange(rowIndex: number, columnIndex: number, value: number) {
    setValues((current) =>
      current.map((row, currentRow) =>
        currentRow === rowIndex ? row.map((cell, currentColumn) => (currentColumn === columnIndex ? value : cell)) : row,
      ),
    );
  }

  async function handleProcess() {
    if (!token) return;
    setProcessing(true);
    setError(null);
    try {
      setResult(await processMatrix(token, values));
    } catch (caught) {
      setResult(null);
      setError(caught instanceof ApiError ? caught.message : "Error inesperado al procesar la matriz.");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Rotación y factorización QR</h1>
        <p className="text-sm text-slate-600">Ingresa una matriz rectangular para rotarla, factorizarla y obtener estadísticas.</p>
      </header>

      {!token ? (
        <LoginForm onLogin={handleLogin} disabled={loginLoading} />
      ) : (
        <MatrixInput
          rows={rows}
          columns={columns}
          values={values}
          onResize={handleResize}
          onCellChange={handleCellChange}
          onSubmit={handleProcess}
          disabled={processing}
        />
      )}

      {error && (
        <div role="alert" className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {processing && (
        <div className="grid animate-pulse gap-4 md:grid-cols-2" aria-busy="true" aria-label="Procesando">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="h-40 rounded-xl bg-slate-200" />
          ))}
        </div>
      )}

      {result && !processing && (
        <>
          <StatsDashboard stats={result.estadisticas} />
          <div className="grid gap-4 md:grid-cols-2">
            <MatrixViewer title="Matriz original" values={result.matriz_original} />
            <MatrixViewer title="Matriz rotada" values={result.matriz_rotada} />
            <MatrixViewer title="Matriz Q" values={result.qr.q} />
            <MatrixViewer title="Matriz R" values={result.qr.r} />
          </div>
        </>
      )}
    </main>
  );
}
