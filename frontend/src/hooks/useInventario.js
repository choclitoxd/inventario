import { useState, useEffect, useMemo } from 'react';
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

  const handleAbrirCaja = async (productoId) => {
    try {
      setSuccessMsg('');
      setError(null);
      await api.abrirCaja(productoId);
      setSuccessMsg('¡Caja abierta con éxito! Se descontó 1 caja de láminas y se sumaron 104 sobres al stock.');
      await fetchInventario();
    } catch (err) {
      setError(err.message || 'Error al ejecutar la acción de abrir caja.');
    }
  };

  const handleAbrirPacaLaminas = async (inventarioId) => {
    try {
      setSuccessMsg('');
      setError(null);
      await api.abrirPacaLaminas(inventarioId);
      setSuccessMsg('¡Paca de láminas desempacada con éxito! Se descontó 1 paca y se sumaron 10 cajas al stock.');
      await fetchInventario();
    } catch (err) {
      setError(err.message || 'Error al abrir paca de láminas.');
    }
  };

  const handleAbrirPacaAlbumes = async (inventarioId) => {
    try {
      setSuccessMsg('');
      setError(null);
      await api.abrirPacaAlbumes(inventarioId);
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

  // Agrupar inventario por producto
  const productosAgrupados = useMemo(() => {
    const map = {};
    inventarios.forEach((inv) => {
      const prod = inv.producto;
      if (!prod) return;
      if (!map[prod.id]) {
        map[prod.id] = {
          producto: prod,
          totalPacas: 0,
          totalCajas: 0,
          totalUnidades: 0,
          lotes: []
        };
      }
      map[prod.id].totalPacas += inv.cantActualPacas || 0;
      map[prod.id].totalCajas += inv.cantActualCajas || 0;
      map[prod.id].totalUnidades += inv.cantActualUnidades || 0;
      map[prod.id].lotes.push(inv);
    });
    return Object.values(map);
  }, [inventarios]);

  return {
    inventarios,
    productosAgrupados,
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
