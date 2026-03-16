import { useState, useEffect, useCallback } from 'react';
import { callSmartOneApi } from '../../../services/api';

/**
 * Carga un proyecto por id vía API (sin Firestore en cliente).
 */
export function useProyectoDetail(proyectoId) {
  const [proyecto, setProyecto] = useState(null);
  const [loading, setLoading] = useState(Boolean(proyectoId));
  const [error, setError] = useState(null);

  const fetchProyecto = useCallback(async () => {
    if (!proyectoId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await callSmartOneApi(`/proyectos/${proyectoId}`);
      setProyecto(data);
    } catch (e) {
      setError(e.message);
      setProyecto(null);
    } finally {
      setLoading(false);
    }
  }, [proyectoId]);

  useEffect(() => {
    fetchProyecto();
  }, [fetchProyecto]);

  return { proyecto, loading, error, refetch: fetchProyecto };
}
