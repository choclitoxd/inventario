import { useState, useEffect } from 'react';
import { api } from '../services/api';

function useDashboard() {
  const [resumen, setResumen] = useState({ totalVentas: 0, utilidadBruta: 0, totalGastos: 0, utilidadNeta: 0 });
  const [capitalData, setCapitalData] = useState([]);
  const [fluctuacionData, setFluctuacionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filtros de fecha
  const [filterType, setFilterType] = useState('mes'); // hoy, semana, mes, todos, personalizado
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      let desde = null;
      let hasta = null;

      if (filterType !== 'todos') {
        const now = new Date();
        if (filterType === 'hoy') {
          const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          desde = todayStart.toISOString();
        } else if (filterType === 'semana') {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          desde = weekAgo.toISOString();
        } else if (filterType === 'mes') {
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          desde = monthAgo.toISOString();
        } else if (filterType === 'personalizado') {
          if (fechaDesde) desde = new Date(fechaDesde).toISOString();
          if (fechaHasta) hasta = new Date(fechaHasta).toISOString();
        }
      }

      const [resResumen, resCapital, resFluct] = await Promise.all([
        api.obtenerResumen(desde, hasta),
        api.obtenerCapitalSegmentado(),
        api.obtenerFluctuacionPrecios()
      ]);

      setResumen(resResumen || { totalVentas: 0, utilidadBruta: 0, totalGastos: 0, utilidadNeta: 0 });
      setCapitalData(resCapital || []);
      setFluctuacionData(resFluct || []);
    } catch (err) {
      console.error(err);
      setError('Error al cargar datos del panel financiero. Asegúrese de que el backend esté ejecutándose.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [filterType, fechaDesde, fechaHasta]);

  // Formateador de moneda en pesos colombianos
  const formatCOP = (val) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(val || 0);
  };

  return {
    resumen,
    capitalData,
    fluctuacionData,
    loading,
    error,
    filterType,
    setFilterType,
    fechaDesde,
    setFechaDesde,
    fechaHasta,
    setFechaHasta,
    fetchDashboardData,
    formatCOP
  };
}

export default useDashboard;
