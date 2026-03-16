import { Pencil, Trash2 } from 'lucide-react';

function estadoLabel(estado) {
  if (estado === 1 || estado === '1') return { text: 'Abierto', className: 'bg-emerald-500/10 text-emerald-700' };
  if (estado === 2 || estado === '2') return { text: 'Cerrado', className: 'bg-slate-200/80 text-slate-600' };
  return { text: 'Sin estado', className: 'bg-amber-500/10 text-amber-700' };
}

export default function ProyectosList({ proyectos, onEditar, onEliminarVisual }) {
  if (!proyectos.length) return null;

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.05)]">
      <div className="overflow-x-auto">
        <table className="w-full table-fixed text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70">
              <th className="w-[18%] px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-slate-500">
                Nombre
              </th>
              <th className="w-[10%] px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-slate-500">
                ID Proyecto
              </th>
              <th className="w-[8%] px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-slate-500">
                Estado
              </th>
              <th className="w-[12%] px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-slate-500">
                Fecha inicio
              </th>
              <th className="w-[12%] px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-slate-500">
                Fecha fin
              </th>
              <th className="w-[8%] px-2 py-2.5 text-center text-[11px] font-medium uppercase tracking-wider text-slate-500">
                Empresas
              </th>
              <th className="w-[8%] px-2 py-2.5 text-center text-[11px] font-medium uppercase tracking-wider text-slate-500">
                Personas
              </th>
              <th className="w-[8%] px-2 py-2.5 text-center text-[11px] font-medium uppercase tracking-wider text-slate-500">
                Maquinarias
              </th>
              <th className="w-[20%] px-3 py-2.5 text-right text-[11px] font-medium uppercase tracking-wider text-slate-500">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {proyectos.map((p) => {
              const badge = estadoLabel(p.estado);
              return (
                <tr
                  key={p.id}
                  className="transition-colors duration-100 hover:bg-slate-50/60"
                >
                  <td className="px-3 py-2">
                    <span className="block truncate text-xs font-medium text-slate-800">
                      {p.nombre || '—'}
                    </span>
                  </td>
                  <td className="px-3 py-2 font-mono text-xs text-slate-600">
                    {p.idProyecto || '—'}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-medium ${badge.className}`}
                    >
                      {badge.text}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-xs text-slate-600">
                    {p.fechaInicio || '—'}
                  </td>
                  <td className="px-3 py-2 text-xs text-slate-600">
                    {p.fechaFin || '—'}
                  </td>
                  <td className="px-2 py-2 text-center text-xs tabular-nums text-slate-600">
                    {p.nEmpresas ?? 0}
                  </td>
                  <td className="px-2 py-2 text-center text-xs tabular-nums text-slate-600">
                    {p.nPersonas ?? 0}
                  </td>
                  <td className="px-2 py-2 text-center text-xs tabular-nums text-slate-600">
                    {p.nMaquinarias ?? 0}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onEditar(p)}
                        className="inline-flex items-center gap-1 rounded-md border border-slate-200/80 bg-white px-2 py-1.5 text-[11px] font-medium text-slate-600 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
                      >
                        <Pencil className="size-3" />
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => onEliminarVisual?.(p)}
                        className="inline-flex items-center gap-1 rounded-md border border-slate-200/80 bg-white px-2 py-1.5 text-[11px] font-medium text-slate-400 opacity-70 shadow-sm cursor-not-allowed"
                        title="Eliminar (próximamente)"
                        disabled
                      >
                        <Trash2 className="size-3" />
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
