import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useProyectoDetail } from '../hooks/useProyectoDetail';
import ProyectoForm from '../components/ProyectoForm';

export default function ProyectoEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { proyecto, loading, error, refetch } = useProyectoDetail(id);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl flex flex-col items-center justify-center py-20">
        <div className="size-10 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
        <p className="mt-4 text-sm text-slate-600">Cargando proyecto...</p>
      </div>
    );
  }

  if (error || !proyecto) {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-red-200 bg-red-50 p-8 text-center">
        <p className="font-medium text-red-800">{error || 'Proyecto no encontrado'}</p>
        <Link to="/proyectos" className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline">
          Volver al listado
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        to="/proyectos"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="size-4" />
        Volver a proyectos
      </Link>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900">Editar proyecto</h1>
        <p className="mt-1 text-sm text-slate-500">Modifica los datos y guarda los cambios</p>
        <div className="mt-6">
          <ProyectoForm
            mode="edit"
            initialData={proyecto}
            onSuccess={() => {
              refetch();
              navigate('/proyectos', { replace: false });
            }}
            onCancel={() => navigate('/proyectos')}
          />
        </div>
      </div>
    </div>
  );
}
