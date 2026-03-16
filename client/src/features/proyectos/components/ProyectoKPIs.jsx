import { FolderOpen, FolderCheck, Clock } from 'lucide-react';

/**
 * Fila de KPIs calculados a partir del array de proyectos cargado.
 * No realiza consultas; recibe totales ya calculados.
 */
export default function ProyectoKPIs({ abiertos, cerrados, porVencer }) {
  const cards = [
    {
      label: 'Proyectos Abiertos',
      value: abiertos ?? 0,
      icon: FolderOpen,
      className: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      iconClassName: 'text-emerald-600',
    },
    {
      label: 'Proyectos Cerrados',
      value: cerrados ?? 0,
      icon: FolderCheck,
      className: 'bg-slate-50 border-slate-200 text-slate-800',
      iconClassName: 'text-slate-600',
    },
    {
      label: 'Proyectos por vencer',
      value: porVencer ?? 0,
      icon: Clock,
      className: 'bg-amber-50 border-amber-200 text-amber-800',
      iconClassName: 'text-amber-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map(({ label, value, icon: Icon, className, iconClassName }) => (
        <div
          key={label}
          className={`flex items-center gap-4 rounded-xl border p-4 shadow-sm ${className}`}
        >
          <div className={`rounded-lg bg-white/80 p-2.5 ${iconClassName}`}>
            <Icon className="size-6" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium opacity-90">{label}</p>
            <p className="text-2xl font-bold tabular-nums">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
