import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FolderOpen } from 'lucide-react';
import { useProyectos } from '../hooks/useProyectos';
import ProyectoFilters from '../components/ProyectoFilters';
import ProyectosList from '../components/ProyectosList';
import ProyectoModal from '../components/ProyectoModal';
import ProyectoKPIs from '../components/ProyectoKPIs';
import { isBetweenTodayAndDaysAhead } from '../utils/dateHelpers';

function filterAndSort(proyectos, searchNombre, searchId, filtroEstado, ordenCampo, ordenDir) {
  let list = [...proyectos];

  if (searchNombre.trim()) {
    const q = searchNombre.trim().toLowerCase();
    list = list.filter((p) => (p.nombre || '').toLowerCase().includes(q));
  }
  if (searchId.trim()) {
    const q = searchId.trim().toLowerCase();
    list = list.filter((p) => (p.idProyecto || '').toLowerCase().includes(q));
  }
  if (filtroEstado === '1') list = list.filter((p) => p.estado === 1 || p.estado === '1');
  else if (filtroEstado === '2') list = list.filter((p) => p.estado === 2 || p.estado === '2');
  else if (filtroEstado === 'sin') {
    list = list.filter((p) => p.estado !== 1 && p.estado !== '1' && p.estado !== 2 && p.estado !== '2');
  }

  const mul = ordenDir === 'asc' ? 1 : -1;
  list.sort((a, b) => {
    let va = a[ordenCampo] ?? '';
    let vb = b[ordenCampo] ?? '';
    if (ordenCampo === 'fechaInicio' || ordenCampo === 'fechaFin') {
      va = va || '';
      vb = vb || '';
    }
    if (va < vb) return -1 * mul;
    if (va > vb) return 1 * mul;
    return 0;
  });

  return list;
}

/**
 * Calcula KPIs a partir del array de proyectos ya cargado (sin nuevas consultas).
 * Para futuros KPIs (ej. vencidos): usar isPast(fechaFin) de utils/dateHelpers.
 */
function computeProyectoKPIs(proyectos) {
  if (!Array.isArray(proyectos) || proyectos.length === 0) {
    return { abiertos: 0, cerrados: 0, porVencer: 0 };
  }
  let abiertos = 0;
  let cerrados = 0;
  let porVencer = 0;
  for (const p of proyectos) {
    const esAbierto = p.estado === 1 || p.estado === '1';
    const esCerrado = p.estado === 2 || p.estado === '2';
    if (esAbierto) abiertos += 1;
    if (esCerrado) cerrados += 1;
    if (esAbierto && p.fechaFin && isBetweenTodayAndDaysAhead(p.fechaFin, 30)) {
      porVencer += 1;
    }
  }
  return { abiertos, cerrados, porVencer };
}

export default function ProyectosPage() {
  const navigate = useNavigate();
  const { proyectos, loading, error, refetch } = useProyectos();
  const [modalOpen, setModalOpen] = useState(false);
  const [searchNombre, setSearchNombre] = useState('');
  const [searchId, setSearchId] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [ordenCampo, setOrdenCampo] = useState('nombre');
  const [ordenDir, setOrdenDir] = useState('asc');

  const filtered = useMemo(
    () => filterAndSort(proyectos, searchNombre, searchId, filtroEstado, ordenCampo, ordenDir),
    [proyectos, searchNombre, searchId, filtroEstado, ordenCampo, ordenDir]
  );

  const kpis = useMemo(() => computeProyectoKPIs(proyectos), [proyectos]);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Proyectos</h1>
          <p className="mt-1 text-sm text-slate-500">Listado y gestión de proyectos SmartOne 3.0</p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          <Plus className="size-5" />
          Nuevo Proyecto
        </button>
      </div>

      {!loading && !error && (
        <ProyectoKPIs
          abiertos={kpis.abiertos}
          cerrados={kpis.cerrados}
          porVencer={kpis.porVencer}
        />
      )}

      <ProyectoFilters
        searchNombre={searchNombre}
        setSearchNombre={setSearchNombre}
        searchId={searchId}
        setSearchId={setSearchId}
        filtroEstado={filtroEstado}
        setFiltroEstado={setFiltroEstado}
        ordenCampo={ordenCampo}
        setOrdenCampo={setOrdenCampo}
        ordenDir={ordenDir}
        setOrdenDir={setOrdenDir}
      />

      {loading && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-16">
          <div className="size-10 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <p className="mt-4 text-sm font-medium text-slate-600">Cargando proyectos...</p>
        </div>
      )}

      {error && !loading && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center">
          <p className="font-medium text-red-800">Error al cargar proyectos</p>
          <p className="mt-1 text-sm text-red-600">{error}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-800 hover:bg-red-200"
          >
            Reintentar
          </button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && proyectos.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-16">
          <FolderOpen className="size-12 text-slate-300" />
          <p className="mt-4 font-medium text-slate-700">No hay proyectos aún</p>
          <p className="mt-1 text-sm text-slate-500">Crea el primero con el botón Nuevo Proyecto</p>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && proyectos.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-6 py-8 text-center">
          <p className="font-medium text-amber-900">Sin resultados con los filtros actuales</p>
          <button
            type="button"
            className="mt-3 text-sm font-medium text-amber-800 underline"
            onClick={() => {
              setSearchNombre('');
              setSearchId('');
              setFiltroEstado('');
            }}
          >
            Limpiar filtros
          </button>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <ProyectosList
          proyectos={filtered}
          onEditar={(p) => navigate(`/proyectos/${p.id}/editar`)}
        />
      )}

      <ProyectoModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
