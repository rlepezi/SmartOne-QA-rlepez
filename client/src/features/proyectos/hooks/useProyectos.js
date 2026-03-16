import { useState, useEffect, useCallback } from 'react';
import { callSmartOneApi } from '../../../services/api';

export const useProyectos = () => {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProyectos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await callSmartOneApi('/proyectos');
      const list = Array.isArray(data) ? data : data?.proyectos ?? [];
      setProyectos(list);
    } catch (e) {
      setError(e.message);
      setProyectos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProyectos();
  }, [fetchProyectos]);

  return { proyectos, loading, error, refetch: fetchProyectos };
};
