import { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';

function useNegocioSelect() {
  const { selectNegocio } = useAuth();
  const [negocios, setNegocios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadNegocios = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.listarNegocios();
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
    selectNegocio(negocio);
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
