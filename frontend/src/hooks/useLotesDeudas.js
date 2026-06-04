import { useState, useEffect } from 'react';
import { api } from '../services/api';

function useLotesDeudas() {
  const [productos, setProductos] = useState([]);
  const [deudas, setDeudas] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // New Lot Form State
  const [nombreLote, setNombreLote] = useState('');
  const [financiador, setFinanciador] = useState('DUENO_A');
  const [nombreInversionista, setNombreInversionista] = useState('');
  const [deudaInicial, setDeudaInicial] = useState('');
  const [porcentajeAmortizacion, setPorcentajeAmortizacion] = useState('');
  const [productoId, setProductoId] = useState('');
  const [cantPacas, setCantPacas] = useState('');
  const [cantCajas, setCantCajas] = useState('');
  const [cantUnidades, setCantUnidades] = useState('');
  const [costoPaca, setCostoPaca] = useState('');
  const [costoCaja, setCostoCaja] = useState('');
  const [costoUnidad, setCostoUnidad] = useState('');

  // Manual Amortization Modal/Inline State
  const [showAbonoForm, setShowAbonoForm] = useState(null); // stores loteId if open
  const [abonoMonto, setAbonoMonto] = useState('');
  const [abonoNotas, setAbonoNotas] = useState('');

  const loadData = async () => {
    setError(null);
    try {
      const [prods, deuds, allLotes] = await Promise.all([
        api.listarProductos(),
        api.listarDeudasInversionistas(),
        api.listarLotes()
      ]);
      setProductos(prods || []);
      setDeudas(deuds || []);
      setLotes(allLotes || []);
    } catch (err) {
      console.error(err);
      setError('Error al obtener datos de lotes y financiamiento.');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCrearLote = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    setError(null);
    setSuccess(null);

    if (!nombreLote.trim() || !productoId) {
      setError('Por favor, ingresa el nombre del lote y selecciona un producto.');
      return;
    }

    setLoading(true);

    const payload = {
      nombreLote: nombreLote.trim(),
      financiador,
      porcentajeGananciaAmortizacion: financiador === 'INVERSIONISTA_EXTERNO' ? Number(porcentajeAmortizacion) : 0,
      deudaInicial: financiador === 'INVERSIONISTA_EXTERNO' ? Number(deudaInicial) : 0,
      productoId: Number(productoId),
      cantPacas: Number(cantPacas) || 0,
      cantCajas: Number(cantCajas) || 0,
      cantUnidades: Number(cantUnidades) || 0,
      costoCompraPaca: Number(costoPaca) || 0,
      costoCompraCaja: Number(costoCaja) || 0,
      costoCompraUnidad: Number(costoUnidad) || 0,
      nombreInversionista: financiador === 'INVERSIONISTA_EXTERNO' ? nombreInversionista.trim() : null
    };

    try {
      await api.registrarEntradaLote(payload);
      setSuccess('¡Entrada de lote registrada con éxito! El inventario ha sido incrementado.');
      
      // Reset form
      setNombreLote('');
      setFinanciador('DUENO_A');
      setNombreInversionista('');
      setDeudaInicial('');
      setPorcentajeAmortizacion('');
      setProductoId('');
      setCantPacas('');
      setCantCajas('');
      setCantUnidades('');
      setCostoPaca('');
      setCostoCaja('');
      setCostoUnidad('');

      await loadData();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al registrar el lote de mercancía.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrarAbono = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    setError(null);
    setSuccess(null);

    if (!abonoMonto || Number(abonoMonto) <= 0) {
      setError('Por favor, ingresa un monto válido mayor a cero.');
      return;
    }

    setLoading(true);

    try {
      await api.registrarAbonoManual(showAbonoForm, Number(abonoMonto), abonoNotas);
      setSuccess('Abono manual registrado con éxito. Se actualizó el saldo pendiente del lote.');
      
      // Reset
      setShowAbonoForm(null);
      setAbonoMonto('');
      setAbonoNotas('');

      await loadData();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al registrar la amortización manual de deuda.');
    } finally {
      setLoading(false);
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
    productos,
    deudas,
    lotes,
    loading,
    error,
    setError,
    success,
    setSuccess,
    nombreLote,
    setNombreLote,
    financiador,
    setFinanciador,
    nombreInversionista,
    setNombreInversionista,
    deudaInicial,
    setDeudaInicial,
    porcentajeAmortizacion,
    setPorcentajeAmortizacion,
    productoId,
    setProductoId,
    cantPacas,
    setCantPacas,
    cantCajas,
    setCantCajas,
    cantUnidades,
    setCantUnidades,
    costoPaca,
    setCostoPaca,
    costoCaja,
    setCostoCaja,
    costoUnidad,
    setCostoUnidad,
    showAbonoForm,
    setShowAbonoForm,
    abonoMonto,
    setAbonoMonto,
    abonoNotas,
    setAbonoNotas,
    handleCrearLote,
    handleRegistrarAbono,
    formatCOP,
    loadData
  };
}

export default useLotesDeudas;
