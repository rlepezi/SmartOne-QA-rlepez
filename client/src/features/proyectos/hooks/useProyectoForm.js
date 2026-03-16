import { useState, useEffect } from 'react';
import { callSmartOneApi } from '../../../services/api';

const emptyForm = {
  nombre: '',
  descripcion: '',
  fechaInicio: '',
  fechaFin: '',
  estado: '1',
  region: '',
  comuna: '',
};

function normalizeInitial(initialData) {
  if (!initialData) return { ...emptyForm };
  const e = initialData.estado;
  const estadoStr = e === '2' || e === 2 ? '2' : '1';
  return {
    nombre: initialData.nombre ?? '',
    descripcion: initialData.descripcion ?? '',
    fechaInicio: initialData.fechaInicio ?? '',
    fechaFin: initialData.fechaFin ?? '',
    estado: estadoStr,
    region: initialData.region ?? '',
    comuna: initialData.comuna ?? '',
  };
}

/**
 * @param {object|null} initialData - si tiene id, modo edición (PUT). Sin id, creación (POST). idProyecto nunca se envía para generar.
 * @param {function} onSuccess - callback con respuesta del backend
 */
export const useProyectoForm = (initialData = null, onSuccess) => {
  const [formData, setFormData] = useState(() => normalizeInitial(initialData));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setFormData(normalizeInitial(initialData));
  }, [initialData?.id, initialData?.updatedAt]);

  const isEdit = Boolean(initialData?.id);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) {
      setError('El nombre es obligatorio');
      return;
    }
    if (!formData.fechaInicio) {
      setError('La fecha de inicio es obligatoria');
      return;
    }
    if (!formData.fechaFin) {
      setError('La fecha de fin es obligatoria');
      return;
    }
    if (formData.fechaFin < formData.fechaInicio) {
      setError('La fecha de fin no puede ser anterior a la de inicio');
      return;
    }
    const estado = formData.estado === '2' ? '2' : '1';

    setLoading(true);
    setError(null);
    try {
      const body = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion ?? '',
        fechaInicio: formData.fechaInicio,
        fechaFin: formData.fechaFin,
        estado,
        region: (formData.region || '').trim(),
        comuna: (formData.comuna || '').trim(),
      };
      // En edición no enviamos idProyecto; el backend no lo regenera.
      const method = isEdit ? 'PUT' : 'POST';
      const endpoint = isEdit ? `/proyectos/${initialData.id}` : '/proyectos';
      const result = await callSmartOneApi(endpoint, {
        method,
        body: JSON.stringify(body),
      });
      if (onSuccess) onSuccess(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    loading,
    error,
    setError,
    isEdit,
  };
};
