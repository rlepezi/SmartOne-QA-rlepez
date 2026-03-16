import { useMemo } from 'react';
import { useProyectoForm } from '../hooks/useProyectoForm';
import DatePicker from './DatePicker';
import { REGIONES_Y_COMUNAS } from '../data/regionesComunas';

/**
 * Formulario unificado create | edit.
 * - create: no muestra idProyecto; backend lo genera.
 * - edit: muestra idProyecto solo lectura.
 */
export default function ProyectoForm({ mode = 'create', initialData = null, onSuccess, onCancel }) {
  const { formData, handleChange, handleSubmit, loading, error, isEdit } = useProyectoForm(
    mode === 'edit' ? initialData : null,
    onSuccess
  );

  const comunasDeLaRegion = useMemo(() => {
    if (!formData.region) return [];
    const item = REGIONES_Y_COMUNAS.find((r) => r.region === formData.region);
    return item ? item.comunas : [];
  }, [formData.region]);

  const onRegionChange = (e) => {
    handleChange(e);
    handleChange({ target: { name: 'comuna', value: '' } });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {isEdit && initialData?.idProyecto && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">ID Proyecto (no editable)</p>
          <p className="font-mono text-lg font-semibold text-slate-800">{initialData.idProyecto}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Nombre del proyecto <span className="text-red-500">*</span>
          </label>
          <input
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: Ampliación Planta Talca"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Descripción</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows={4}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Descripción del proyecto..."
          />
        </div>

        <DatePicker
          name="fechaInicio"
          label="Fecha inicio"
          value={formData.fechaInicio}
          onChange={(ymd) => handleChange({ target: { name: 'fechaInicio', value: ymd } })}
          required
          placeholder="DD-MM-AAAA"
        />
        <DatePicker
          name="fechaFin"
          label="Fecha fin"
          value={formData.fechaFin}
          onChange={(ymd) => handleChange({ target: { name: 'fechaFin', value: ymd } })}
          required
          placeholder="DD-MM-AAAA"
        />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Región</label>
          <select
            name="region"
            value={formData.region}
            onChange={onRegionChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccione una región</option>
            {REGIONES_Y_COMUNAS.map((r) => (
              <option key={r.region} value={r.region}>
                {r.region}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Comuna</label>
          <select
            name="comuna"
            value={formData.comuna}
            onChange={handleChange}
            disabled={!formData.region}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-500"
          >
            <option value="">Seleccione una comuna</option>
            {comunasDeLaRegion.map((comuna) => (
              <option key={comuna} value={comuna}>
                {comuna}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Estado <span className="text-red-500">*</span>
          </label>
          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1">Abierto</option>
            <option value="2">Cerrado</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-6">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear proyecto'}
        </button>
      </div>
    </form>
  );
}
