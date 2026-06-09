import React from 'react';
import { Plus } from 'lucide-react';
import CustomSelect from '../../common/CustomSelect';
import NumericStepper from '../../common/NumericStepper';

function CrearLoteForm({
  inversionistas,
  loading,
  nombreLote,
  setNombreLote,
  financiador,
  setFinanciador,
  inversionistaId,
  setInversionistaId,
  deudaInicial,
  setDeudaInicial,
  porcentajeAmortizacion,
  setPorcentajeAmortizacion,
  isInvModalOpen,
  setIsInvModalOpen,
  newInvNombre,
  setNewInvNombre,
  newInvTelefono,
  setNewInvTelefono,
  handleSaveInversionista,
  handleCrearLote,
  formatCOP
}) {
  const selectOptions = [
    { value: 'DUENO_A', label: 'Dueño A' },
    { value: 'DUENO_B', label: 'Dueño B' },
    ...inversionistas.map(inv => ({
      value: `INV_${inv.id}`,
      label: `Inversionista: ${inv.nombre}`
    }))
  ];

  const currentSelectValue = financiador === 'INVERSIONISTA_EXTERNO'
    ? (inversionistaId ? `INV_${inversionistaId}` : '')
    : financiador;

  const handleSelectChange = (val) => {
    if (val === 'DUENO_A' || val === 'DUENO_B') {
      setFinanciador(val);
      setInversionistaId('');
    } else if (val.startsWith('INV_')) {
      setFinanciador('INVERSIONISTA_EXTERNO');
      setInversionistaId(val.replace('INV_', ''));
    }
  };

  return (
    <div className="glass-panel p-6 space-y-4">
      <h3 className="text-base font-sports font-bold text-white flex items-center gap-2 border-b border-carbon-800 pb-3">
        <Plus size={18} className="text-neonCyan" /> Registrar Nuevo Lote
      </h3>

      <form onSubmit={handleCrearLote} className="space-y-4">
        {/* Nombre Lote */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-carbon-500">IDENTIFICADOR / NOMBRE DE LOTE</label>
          <input
            type="text"
            placeholder="Ej. Inversion Qatar Mayo 2026"
            value={nombreLote}
            onChange={(e) => setNombreLote(e.target.value)}
            className="bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-neonCyan font-semibold"
            required
          />
        </div>

        {/* Origen de Capital / Financiador */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-carbon-500">ORIGEN DE CAPITAL (FINANCIADOR)</label>
          <div className="flex gap-2 items-center">
            <div className="flex-1">
              <CustomSelect
                options={selectOptions}
                value={currentSelectValue}
                onChange={handleSelectChange}
                placeholder="Seleccionar Origen"
              />
            </div>
            <button
              type="button"
              onClick={() => setIsInvModalOpen(true)}
              className="bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 px-3 py-2 rounded-lg text-xs font-medium transition-colors shrink-0 flex items-center gap-1"
            >
              <span>[+ Agregar Inversionista]</span>
            </button>
          </div>
        </div>

        {/* Monto Financiado / Deuda Inicial */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-carbon-500">MONTO FINANCIADO / DEUDA INICIAL</label>
          <NumericStepper
            value={parseFloat(deudaInicial) || 0}
            onChange={(val) => setDeudaInicial(val.toString())}
            max={999999999}
          />
        </div>

        {/* Porcentaje Amortización (Only visible for external investors) */}
        {financiador === 'INVERSIONISTA_EXTERNO' && (
          <div className="flex flex-col gap-1 animate-fadeIn">
            <label className="text-[10px] font-bold text-carbon-500">% GANANCIAS PARA AMORTIZACIÓN</label>
            <NumericStepper
              value={parseFloat(porcentajeAmortizacion) || 0}
              onChange={(val) => setPorcentajeAmortizacion(val.toString())}
              min={1}
              max={100}
            />
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full text-center py-2.5 rounded-xl font-sports font-bold text-xs tracking-wider transition-all duration-300 ${
            loading
              ? 'bg-carbon-800 text-carbon-600 border-carbon-700 cursor-not-allowed'
              : 'neon-btn-cyan shadow-neon-cyan'
          }`}
        >
          {loading ? 'Registrando lote...' : 'INGRESAR NUEVO LOTE'}
        </button>
      </form>

      {/* Modal Agregar Inversionista */}
      {isInvModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-sm space-y-4 shadow-2xl animate-fadeIn">
            <h4 className="text-sm font-sports font-bold text-white border-b border-zinc-800 pb-2">
              Agregar Nuevo Inversionista
            </h4>
            
            <div className="space-y-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase">Nombre Completo</label>
                <input
                  type="text"
                  placeholder="Ej. Carlos Mendoza"
                  value={newInvNombre}
                  onChange={(e) => setNewInvNombre(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 focus:border-emerald-500/80 text-xs font-mono text-white placeholder-zinc-600 px-3 py-2.5 rounded-lg focus:outline-none w-full"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase">Contacto / Teléfono</label>
                <input
                  type="text"
                  placeholder="Ej. 3001234567"
                  value={newInvTelefono}
                  onChange={(e) => setNewInvTelefono(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 focus:border-emerald-500/80 text-xs font-mono text-white placeholder-zinc-600 px-3 py-2.5 rounded-lg focus:outline-none w-full"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setIsInvModalOpen(false);
                  setNewInvNombre('');
                  setNewInvTelefono('');
                }}
                className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 font-sans text-xs px-4 py-2 rounded-lg transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleSaveInversionista(newInvNombre, newInvTelefono)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-sans text-xs px-4 py-2 rounded-lg transition-all shadow-md shadow-emerald-900/30 font-medium"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CrearLoteForm;
