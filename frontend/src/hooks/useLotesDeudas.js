import { useState, useEffect } from 'react';
import { api } from '../services/api';

function useLotesDeudas() {
  const [deudas, setDeudas] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [tarifas, setTarifas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [userRole, setUserRole] = useState(() => {
    try {
      const sessionStr = localStorage.getItem('panini_session');
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        return session ? session.rol : '';
      }
    } catch (_) {}
    return '';
  });

  // New Lot Form State (kept for DTO compatibility if lot creation is still triggered programmatically)
  const [nombreLote, setNombreLote] = useState('');
  const [financiador, setFinanciador] = useState('DUENO_A'); // DUENO_A, DUENO_B, INVERSIONISTA_EXTERNO
  const [proveedorId, setProveedorId] = useState('');
  const [deudaInicial, setDeudaInicial] = useState('');
  const [porcentajeAmortizacion, setPorcentajeAmortizacion] = useState('');

  // Provider Modal State
  const [isProvModalOpen, setIsProvModalOpen] = useState(false);
  const [newProvNombre, setNewProvNombre] = useState('');
  const [newProvTelefono, setNewProvTelefono] = useState('');

  // Manual Amortization Modal/Inline State
  const [showAbonoForm, setShowAbonoForm] = useState(null); // stores loteId if open
  const [abonoMonto, setAbonoMonto] = useState('');
  const [abonoNotas, setAbonoNotas] = useState('');

  const loadData = async () => {
    setError(null);
    try {
      const [provs, deuds, allLotes, prodList, tariffList] = await Promise.all([
        api.listarProveedores(),
        api.listarDeudasInversionistas(), // Endpoint retains name on backend but fetches suppliers' debt
        api.listarLotes(),
        api.listarProductos(),
        api.listarTarifas()
      ]);
      setProveedores(provs || []);
      setDeudas(deuds || []);
      setLotes(allLotes || []);
      setProductos(prodList || []);
      setTarifas(tariffList || []);
    } catch (err) {
      console.error(err);
      setError('Error al obtener datos de lotes, proveedores y catálogo de tarifas.');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveProveedor = async (nombre, telefono) => {
    setError(null);
    setSuccess(null);
    if (!nombre || !nombre.trim()) {
      setError('Por favor, ingresa el nombre del proveedor.');
      return;
    }
    setLoading(true);
    try {
      const saved = await api.registrarProveedor({
        nombre: nombre.trim(),
        telefono: telefono ? telefono.trim() : ''
      });
      setSuccess('¡Proveedor registrado con éxito!');
      
      // Reload list of suppliers
      const provs = await api.listarProveedores();
      setProveedores(provs || []);
      
      // Auto-select newly created supplier
      if (saved && saved.id) {
        setFinanciador('INVERSIONISTA_EXTERNO');
        setProveedorId(saved.id.toString());
      }
      
      // Reset modal inputs
      setNewProvNombre('');
      setNewProvTelefono('');
      setIsProvModalOpen(false);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al registrar el proveedor.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTarifa = async (proveedorId, productoId, costoPactado) => {
    setError(null);
    setSuccess(null);
    if (!proveedorId) {
      setError('Por favor, selecciona un proveedor.');
      return;
    }
    if (!productoId) {
      setError('Por favor, selecciona un producto.');
      return;
    }
    if (costoPactado <= 0) {
      setError('Por favor, ingresa un costo unitario pactado mayor a cero.');
      return;
    }
    setLoading(true);
    try {
      await api.guardarTarifa({
        proveedorId: Number(proveedorId),
        productoId: Number(productoId),
        costoPactado: Number(costoPactado)
      });
      setSuccess('¡Tarifa vinculada con éxito!');
      await loadData();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al vincular el producto al proveedor.');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarTarifa = async (id) => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      await api.eliminarTarifa(id);
      setSuccess('¡Tarifa eliminada con éxito!');
      await loadData();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al eliminar la tarifa.');
    } finally {
      setLoading(false);
    }
  };

  const handleCrearLote = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    setError(null);
    setSuccess(null);

    if (!nombreLote.trim()) {
      setError('Por favor, ingresa el nombre del lote.');
      return;
    }

    if (financiador === 'INVERSIONISTA_EXTERNO' && !proveedorId) {
      setError('Por favor, selecciona un proveedor.');
      return;
    }

    setLoading(true);

    const payload = {
      nombreLote: nombreLote.trim(),
      financiador,
      proveedorId: financiador === 'INVERSIONISTA_EXTERNO' && proveedorId ? Number(proveedorId) : null,
      montoPrestado: Number(deudaInicial) || 0,
      porcentajeGananciaAmortizacion: financiador === 'INVERSIONISTA_EXTERNO' ? Number(porcentajeAmortizacion) : 0
    };

    try {
      await api.registrarEntradaLote(payload);
      setSuccess('¡Lote registrado con éxito!');
      
      // Reset form
      setNombreLote('');
      setFinanciador('DUENO_A');
      setProveedorId('');
      setDeudaInicial('');
      setPorcentajeAmortizacion('');

      await loadData();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al registrar el lote.');
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

  const handleEditarLote = async (id, nombre, monto, saldo) => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      await api.actualizarLote(id, { nombreLote: nombre, montoPrestado: monto, saldoPendiente: saldo });
      setSuccess('¡Lote actualizado con éxito!');
      await loadData();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al actualizar el lote.');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarLote = async (id) => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      await api.eliminarLote(id);
      setSuccess('¡Lote eliminado con éxito!');
      await loadData();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al eliminar el lote.');
    } finally {
      setLoading(false);
    }
  };

  return {
    deudas,
    lotes,
    proveedores,
    productos,
    tarifas,
    loading,
    error,
    setError,
    success,
    setSuccess,
    nombreLote,
    setNombreLote,
    financiador,
    setFinanciador,
    proveedorId,
    setProveedorId,
    deudaInicial,
    setDeudaInicial,
    porcentajeAmortizacion,
    setPorcentajeAmortizacion,
    isProvModalOpen,
    setIsProvModalOpen,
    newProvNombre,
    setNewProvNombre,
    newProvTelefono,
    setNewProvTelefono,
    handleSaveProveedor,
    handleSaveTarifa,
    handleEliminarTarifa,
    showAbonoForm,
    setShowAbonoForm,
    abonoMonto,
    setAbonoMonto,
    abonoNotas,
    setAbonoNotas,
    handleCrearLote,
    handleRegistrarAbono,
    formatCOP,
    loadData,
    userRole,
    handleEditarLote,
    handleEliminarLote
  };
}

export default useLotesDeudas;
