import { useState, useEffect } from 'react';
import { api } from '../services/api';

function useNegocioSelect(onSelectNegocio) {
  const [negocios, setNegocios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadNegocios = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.listarNegocios();
      setNegocios(data || []);
    } catch (err) {
      console.error(err);
      setError('Error al cargar la lista de negocios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNegocios();
  }, []);

  const handleSelect = (negocio) => {
    localStorage.setItem('active_negocio_id', negocio.id);
    localStorage.setItem('active_negocio_nombre', negocio.nombre);
    onSelectNegocio(negocio);
  };

  return {
    negocios,
    loading,
    error,
    handleSelect,
    loadNegocios
  };
}

export default useNegocioSelect;
