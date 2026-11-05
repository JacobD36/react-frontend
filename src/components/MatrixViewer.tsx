import type { MatrixValues } from "../services/apiService";

interface MatrixViewerProps {
  title: string;
  values: MatrixValues;
}

export default function MatrixViewer({ title, values }: MatrixViewerProps) {
  return (
    <figure className="rounded-xl bg-white p-4 shadow-sm">
      <figcaption className="mb-2 text-sm font-semibold text-slate-600">
        {title} ({values.length}×{values[0]?.length ?? 0})
      </figcaption>
      <div className="overflow-x-auto">
        <table className="font-mono text-sm">
          <tbody>
            {values.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, columnIndex) => (
                  <td key={columnIndex} className="px-2 py-1 text-right tabular-nums">
                    {cell.toFixed(4)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
