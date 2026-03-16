import { Search } from 'lucide-react';

/**
 * Búsqueda por nombre, idProyecto, filtro estado, orden.
 * Estado: '' | '1' | '2' | 'sin' (sin estado)
 * Orden: nombre | fechaInicio | fechaFin
 */
export default function ProyectoFilters({
  searchNombre,
  setSearchNombre,
  searchId,
  setSearchId,
  filtroEstado,
  setFiltroEstado,
  ordenCampo,
  setOrdenCampo,
  ordenDir,
  setOrdenDir,
}) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Buscar por nombre..."
            value={searchNombre}
            onChange={(e) => setSearchNombre(e.target.value)}
            className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Buscar por ID proyecto..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos los estados</option>
          <option value="1">Abierto</option>
          <option value="2">Cerrado</option>
          <option value="sin">Sin estado</option>
        </select>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-slate-600">Ordenar por:</span>
        <select
          value={ordenCampo}
          onChange={(e) => setOrdenCampo(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
        >
          <option value="nombre">Nombre</option>
          <option value="fechaInicio">Fecha inicio</option>
          <option value="fechaFin">Fecha fin</option>
        </select>
        <button
          type="button"
          onClick={() => setOrdenDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium hover:bg-slate-50"
        >
          {ordenDir === 'asc' ? 'Ascendente ↑' : 'Descendente ↓'}
        </button>
      </div>
    </div>
  );
}
