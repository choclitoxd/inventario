import { useState, useEffect } from 'react';
import { api } from '../services/api';

function useInventario() {
  const [inventarios, setInventarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchInventario = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.listarInventario();
      setInventarios(data || []);
    } catch (err) {
      console.error(err);
      setError('Error al obtener los niveles de inventario. Verifique el backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventario();
  }, []);

  const handleAbrirCaja = async (id) => {
    try {
      setSuccessMsg('');
      setError(null);
      await api.abrirCaja(id);
      setSuccessMsg('¡Caja abierta con éxito! Se descontó 1 caja de láminas y se sumaron 104 sobres al stock.');
      await fetchInventario();
    } catch (err) {
      setError(err.message || 'Error al ejecutar la acción de abrir caja.');
    }
  };

  const handleAbrirPacaLaminas = async (id) => {
    try {
      setSuccessMsg('');
      setError(null);
      await api.abrirPacaLaminas(id);
      setSuccessMsg('¡Paca de láminas desempacada con éxito! Se descontó 1 paca y se sumaron 10 cajas al stock.');
      await fetchInventario();
    } catch (err) {
      setError(err.message || 'Error al abrir paca de láminas.');
    }
  };

  const handleAbrirPacaAlbumes = async (id) => {
    try {
      setSuccessMsg('');
      setError(null);
      await api.abrirPacaAlbumes(id);
      setSuccessMsg('¡Paca de álbumes desempacada con éxito! Se descontó 1 paca y se sumaron 26 álbumes sueltos al stock.');
      await fetchInventario();
    } catch (err) {
      setError(err.message || 'Error al abrir paca de álbumes.');
    }
  };

  const formatCOP = (val) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(val || 0);
  };

  return {
    inventarios,
    loading,
    error,
    setError,
    successMsg,
    setSuccessMsg,
    handleAbrirCaja,
    handleAbrirPacaLaminas,
    handleAbrirPacaAlbumes,
    formatCOP,
    fetchInventario
  };
}

export default useInventario;
