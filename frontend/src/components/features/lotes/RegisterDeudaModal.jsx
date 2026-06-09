import React from 'react';
import { X, Coins, AlertCircle, Loader2 } from 'lucide-react';
import CustomSelect from '../../common/CustomSelect';
import NumericStepper from '../../common/NumericStepper';
import useRegistrarLote from '../../../hooks/useRegistrarLote';

/**
 * Modal de captura para registrar un nuevo Lote / Deuda de inversionista.
 *
 * Props:
 *  - isOpen       {boolean}   — Controla visibilidad
 *  - onClose      {Function}  — Cierra el modal
 *  - proveedores  {Array}     — Lista de inversionistas/proveedores del sistema
 *  - onSaved      {Function}  — Callback post-guardado (refresca datos de la página)
 */
function RegisterDeudaModal({ isOpen, onClose, proveedores = [], onSaved }) {
  const {
    loading,
    formError,
    nombreLote, setNombreLote,
    financiador,
    deudaInicial, setDeudaInicial,
    porcentajeAmortizacion, setPorcentajeAmortizacion,
    selectValue,
    handleSelectFinanciador,
    handleSubmit,
    resetForm,
  } = useRegistrarLote(() => {
    onSaved();
    onClose();
  });

  if (!isOpen) return null;

  // Opciones del selector de origen de capital
  const selectOptions = [
    { value: 'DUENO_A', label: '💼 Dueño A' },
    { value: 'DUENO_B', label: '💼 Dueño B' },
    ...proveedores.map((p) => ({
      value: `INV_${p.id}`,
      label: `🤝 ${p.nombre}`,
    })),
  ];

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden">

        {/* ── Header ──────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/50">
          <div>
            <h3 className="text-base font-sports font-bold text-white flex items-center gap-2">
              <Coins size={16} className="text-emerald-400" />
              Registrar Lote / Deuda
            </h3>
            <p className="text-[10px] text-zinc-500 font-semibold tracking-wider mt-0.5 uppercase">
              Nuevo capital o préstamo de inversionista
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-white transition-colors"
            title="Cerrar"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Formulario ──────────────────────────────── */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">

          {/* Error inline */}
          {formError && (
            <div className="bg-red-950/40 border border-red-500/40 text-red-300 p-3 rounded-lg flex items-center gap-2 text-xs font-semibold animate-fadeIn">
              <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
              {formError}
            </div>
          )}

          {/* Campo: Nombre de Lote */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">
              Identificador / Nombre de Lote
            </label>
            <input
              id="lote-nombre"
              type="text"
              placeholder="Ej. Inversión Qatar Mayo 2026"
              value={nombreLote}
              onChange={(e) => setNombreLote(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 focus:border-emerald-500/70 rounded-lg px-3 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none font-semibold transition-colors"
              required
            />
          </div>

          {/* Campo: Origen de Capital */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">
              Origen de Capital (Financiador)
            </label>
            <CustomSelect
              options={selectOptions}
              value={selectValue}
              onChange={handleSelectFinanciador}
              placeholder="Seleccionar origen de capital..."
            />
            {proveedores.length === 0 && (
              <span className="text-[9px] text-amber-500/80 font-semibold mt-0.5">
                ⚠ No hay inversionistas registrados. Agrega uno en la pestaña Proveedores.
              </span>
            )}
          </div>

          {/* Campo: Monto Inicial */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">
              Monto Inicial / Prestado (COP)
            </label>
            <NumericStepper
              value={deudaInicial}
              onChange={(val) => setDeudaInicial(val)}
              min={0}
              max={999999999}
            />
          </div>

          {/* Campo condicional: % Amortización (solo inversionistas externos) */}
          {financiador === 'INVERSIONISTA_EXTERNO' && (
            <div className="flex flex-col gap-1.5 animate-fadeIn">
              <label className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">
                % de Ganancias para Amortización
              </label>
              <NumericStepper
                value={porcentajeAmortizacion}
                onChange={(val) => setPorcentajeAmortizacion(val)}
                min={1}
                max={100}
              />
              <span className="text-[9px] text-zinc-600 font-medium">
                Porcentaje de cada venta asociada a este lote que abona la deuda automáticamente.
              </span>
            </div>
          )}
        </form>

        {/* ── Footer ──────────────────────────────────── */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-zinc-800 bg-zinc-950/30">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2 border border-zinc-700 bg-transparent hover:bg-zinc-800 text-zinc-300 font-semibold text-xs rounded-lg transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form=""
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed text-zinc-950 font-sports font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-900/30"
          >
            {loading ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                Guardando...
              </>
            ) : (
              'Guardar Capital'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterDeudaModal;
