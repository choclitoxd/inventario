import { useState, useEffect } from 'react';
import { proveedorService } from '../services/proveedorService';
import { authService } from '../services/authService';

function useLotesDeudas() {
  const [deudas, setDeudas] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [proveedores, setProveedores] = useState([]);
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

  // Manual Amortization Form State
  const [showAbonoForm, setShowAbonoForm] = useState(null); // stores loteId if open
  const [abonoMonto, setAbonoMonto] = useState('');
  const [abonoNotas, setAbonoNotas] = useState('');

  const loadData = async () => {
    setError(null);
    try {
      const [provs, deuds, allLotes] = await Promise.all([
        proveedorService.listarProveedores(),
        proveedorService.listarDeudasInversionistas(),
        proveedorService.listarLotes()
      ]);
      setProveedores(provs || []);
      setDeudas(deuds || []);
      setLotes(allLotes || []);
    } catch (err) {
      console.error(err);
      setError('Error al obtener datos de lotes y proveedores.');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
      await proveedorService.registrarAbonoManual(showAbonoForm, Number(abonoMonto), abonoNotas);
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
      await proveedorService.actualizarLote(id, { nombreLote: nombre, montoPrestado: monto, saldoPendiente: saldo });
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
      await proveedorService.eliminarLote(id);
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
    loading,
    error,
    setError,
    success,
    setSuccess,
    showAbonoForm,
    setShowAbonoForm,
    abonoMonto,
    setAbonoMonto,
    abonoNotas,
    setAbonoNotas,
    handleRegistrarAbono,
    formatCOP,
    loadData,
    userRole,
    handleEditarLote,
    handleEliminarLote
  };
}

export default useLotesDeudas;
