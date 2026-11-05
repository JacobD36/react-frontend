interface MatrixInputProps {
  rows: number;
  columns: number;
  values: number[][];
  onResize: (rows: number, columns: number) => void;
  onCellChange: (row: number, column: number, value: number) => void;
  onSubmit: () => void;
  disabled: boolean;
}

const MAX_DIMENSION = 10;

export default function MatrixInput({
  rows,
  columns,
  values,
  onResize,
  onCellChange,
  onSubmit,
  disabled,
}: MatrixInputProps) {
  return (
    <section className="space-y-4 rounded-xl bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col text-sm">
          Filas
          <input
            type="number"
            min={1}
            max={MAX_DIMENSION}
            value={rows}
            onChange={(event) => onResize(Number(event.target.value), columns)}
            className="mt-1 w-24 rounded-md border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="flex flex-col text-sm">
          Columnas
          <input
            type="number"
            min={1}
            max={MAX_DIMENSION}
            value={columns}
            onChange={(event) => onResize(rows, Number(event.target.value))}
            className="mt-1 w-24 rounded-md border border-slate-300 px-3 py-2"
          />
        </label>
        <button
          type="button"
          onClick={onSubmit}
          disabled={disabled}
          className="rounded-md bg-blue-700 px-4 py-2 text-white disabled:opacity-50"
        >
          Procesar matriz
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="border-separate border-spacing-1">
          <tbody>
            {values.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, columnIndex) => (
                  <td key={columnIndex}>
                    <input
                      type="number"
                      step="any"
                      aria-label={`Elemento ${rowIndex + 1},${columnIndex + 1}`}
                      value={cell}
                      onChange={(event) => onCellChange(rowIndex, columnIndex, Number(event.target.value))}
                      className="w-20 rounded-md border border-slate-300 px-2 py-1 text-right"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
