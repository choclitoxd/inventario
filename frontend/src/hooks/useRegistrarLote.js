import { useState } from 'react';
import { proveedorService } from '../services/proveedorService';

/**
 * Hook de lógica para el formulario de registro de nuevo lote/deuda.
 * Se separa completamente de la UI (RegisterDeudaModal) y de la página padre.
 *
 * @param {Function} onSuccess - Callback ejecutado tras guardar exitosamente (para refrescar datos).
 */
function useRegistrarLote(onSuccess) {
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // ── Campos del formulario ──────────────────────────────────
  const [nombreLote, setNombreLote] = useState('');
  const [financiador, setFinanciador] = useState('');
  const [inversionistaId, setInversionistaId] = useState('');
  const [deudaInicial, setDeudaInicial] = useState(0);
  const [porcentajeAmortizacion, setPorcentajeAmortizacion] = useState(10);

  const resetForm = () => {
    setNombreLote('');
    setFinanciador('');
    setInversionistaId('');
    setDeudaInicial(0);
    setPorcentajeAmortizacion(10);
    setFormError('');
  };

  /**
   * Maneja el cambio del CustomSelect de origen de capital.
   * Distingue entre DUENO_A, DUENO_B e INVERSIONISTA_EXTERNO (prefijado con "INV_").
   */
  const handleSelectFinanciador = (val) => {
    if (val === 'DUENO_A' || val === 'DUENO_B') {
      setFinanciador(val);
      setInversionistaId('');
    } else if (val && val.startsWith('INV_')) {
      setFinanciador('INVERSIONISTA_EXTERNO');
      setInversionistaId(val.replace('INV_', ''));
    }
  };

  /** Calcula el value actual del CustomSelect a partir del estado interno */
  const selectValue = financiador === 'INVERSIONISTA_EXTERNO'
    ? (inversionistaId ? `INV_${inversionistaId}` : '')
    : financiador;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!nombreLote.trim()) {
      setFormError('El nombre/identificador del lote es obligatorio.');
      return;
    }
    if (!financiador) {
      setFormError('Debes seleccionar un origen de capital.');
      return;
    }
    if (deudaInicial <= 0) {
      setFormError('El monto inicial debe ser mayor a cero.');
      return;
    }

    setLoading(true);
    try {
      const dto = {
        nombreLote: nombreLote.trim(),
        financiador,
        ...(financiador === 'INVERSIONISTA_EXTERNO' && { inversionistaId: Number(inversionistaId) }),
        montoPrestado: deudaInicial,
        ...(financiador === 'INVERSIONISTA_EXTERNO' && { porcentajeAmortizacion }),
      };
      await proveedorService.registrarEntradaLote(dto);
      resetForm();
      if (onSuccess) onSuccess();
    } catch (err) {
      setFormError(err.message || 'Error al registrar el lote. Revisa los datos e intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return {
    // Estado del form
    loading,
    formError,
    nombreLote, setNombreLote,
    financiador,
    deudaInicial, setDeudaInicial,
    porcentajeAmortizacion, setPorcentajeAmortizacion,
    selectValue,
    // Handlers
    handleSelectFinanciador,
    handleSubmit,
    resetForm,
  };
}

export default useRegistrarLote;
