import type { MatrixStats } from "../services/apiService";

interface StatsDashboardProps {
  stats: MatrixStats;
}

export default function StatsDashboard({ stats }: StatsDashboardProps) {
  const tiles = [
    { label: "Máximo", value: stats.maximo.toFixed(4) },
    { label: "Mínimo", value: stats.minimo.toFixed(4) },
    { label: "Promedio", value: stats.promedio.toFixed(4) },
    { label: "Suma total", value: stats.suma_total.toFixed(4) },
    { label: "¿Alguna diagonal?", value: stats.es_diagonal ? "Sí" : "No" },
  ];

  return (
    <section className="grid grid-cols-2 gap-3 md:grid-cols-5">
      {tiles.map((tile) => (
        <div key={tile.label} className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-500">{tile.label}</p>
          <p className="mt-1 text-xl font-semibold tabular-nums">{tile.value}</p>
        </div>
      ))}
    </section>
  );
}
