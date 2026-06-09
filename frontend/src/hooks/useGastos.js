import { useState, useEffect } from 'react';
import { gastosService } from '../services/gastosService';
import { proveedorService } from '../services/proveedorService';

function useGastos() {
  const [gastos, setGastos] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form State
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [categoria, setCategoria] = useState('FLETE');
  const [loteInversionistaId, setLoteInversionistaId] = useState('');

  const loadData = async () => {
    setError(null);
    try {
      const [allGastos, allLotes] = await Promise.all([
        gastosService.listarGastos(),
        proveedorService.listarLotes()
      ]);
      setGastos(allGastos || []);
      setLotes(allLotes || []);
    } catch (err) {
      console.error(err);
      setError('Error al obtener la lista de gastos y lotes del servidor.');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCrearGasto = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    setError(null);
    setSuccess(null);

    if (!descripcion.trim() || !monto || Number(monto) <= 0) {
      setError('Por favor, ingresa una descripción y un monto válido.');
      return;
    }

    setLoading(true);

    const payload = {
      descripcion: descripcion.trim(),
      monto: Number(monto),
      categoria: categoria,
      loteInversionistaId: loteInversionistaId ? Number(loteInversionistaId) : null
    };

    try {
      await gastosService.registrarGasto(payload);
      setSuccess('¡Gasto hormiga registrado con éxito!');
      
      // Reset form
      setDescripcion('');
      setMonto('');
      setCategoria('FLETE');
      setLoteInversionistaId('');

      // Reload data
      await loadData();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al registrar the expense.');
    } finally {
      setLoading(false);
    }
  };

  // Formateador COP
  const formatCOP = (val) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(val || 0);
  };

  // Cálculos consolidados
  const totalMonto = gastos.reduce((sum, g) => sum + (g.monto || 0), 0);
  const totalFletes = gastos.filter(g => g.categoria === 'FLETE').reduce((sum, g) => sum + (g.monto || 0), 0);
  const totalTransporte = gastos.filter(g => g.categoria === 'TRANSPORTE').reduce((sum, g) => sum + (g.monto || 0), 0);
  const totalAlimentacion = gastos.filter(g => g.categoria === 'ALIMENTACION').reduce((sum, g) => sum + (g.monto || 0), 0);
  const totalOtro = gastos.filter(g => g.categoria === 'OTRO').reduce((sum, g) => sum + (g.monto || 0), 0);

  const getPercentage = (val) => {
    if (totalMonto === 0) return 0;
    return (val / totalMonto) * 100;
  };

  return {
    gastos,
    lotes,
    loading,
    error,
    setError,
    success,
    setSuccess,
    descripcion,
    setDescripcion,
    monto,
    setMonto,
    categoria,
    setCategoria,
    loteInversionistaId,
    setLoteInversionistaId,
    handleCrearGasto,
    formatCOP,
    totalMonto,
    totalFletes,
    totalTransporte,
    totalAlimentacion,
    totalOtro,
    getPercentage,
    loadData
  };
}

export default useGastos;
