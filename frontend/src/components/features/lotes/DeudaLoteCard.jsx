import React from 'react';
import { Plus } from 'lucide-react';

function DeudaLoteCard({
  lote,
  showAbonoForm,
  setShowAbonoForm,
  abonoMonto,
  setAbonoMonto,
  abonoNotas,
  setAbonoNotas,
  handleRegistrarAbono,
  formatCOP,
  loading
}) {
  const pagado = (lote.montoPrestado || 0) - (lote.saldoPendiente || 0);
  const pct = lote.montoPrestado > 0 ? (pagado / lote.montoPrestado) * 100 : 0;

  return (
    <div className="bg-carbon-900 border border-carbon-800 p-4 rounded-xl space-y-3 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-neonCyan bg-neonCyan/10 px-2 py-0.5 rounded-full border border-neonCyan/30">
            DEUDA ACTIVA - {lote.porcentajeGananciaAmortizacion}% AMORTIZACIÓN
          </span>
          <h4 className="text-base font-sports font-bold text-white mt-1.5">{lote.nombreLote}</h4>
          <span className="text-xs text-carbon-500 font-medium">Proveedor: {lote.nombreProveedor || 'Externo'}</span>
        </div>

        <div className="text-right flex items-center gap-2 sm:self-start">
          <button
            onClick={() => setShowAbonoForm(showAbonoForm === lote.id ? null : lote.id)}
            className="bg-carbon-800 border border-carbon-700 hover:border-carbon-600 text-zinc-100 font-bold px-3 py-1.5 rounded-lg text-xs transition-all"
          >
            {showAbonoForm === lote.id ? 'Cancelar' : 'Abono Manual'}
          </button>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-carbon-500 font-medium">
          <span>Progreso de Amortización</span>
          <span className="text-neonCyan font-bold">{pct.toFixed(1)}%</span>
        </div>
        <div className="w-full h-2.5 bg-carbon-800 rounded-full overflow-hidden border border-carbon-700">
          <div 
            className="h-full bg-neonCyan transition-all duration-500" 
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] font-bold text-carbon-500 mt-1">
          <span>Abonado: <span className="text-white">{formatCOP(pagado)}</span></span>
          <span>Saldo Pendiente: <span className="text-red-400">{formatCOP(lote.saldoPendiente)}</span></span>
        </div>
      </div>

      {showAbonoForm === lote.id && (
        <form onSubmit={handleRegistrarAbono} className="bg-carbon-950 p-4 rounded-xl border border-carbon-800 mt-4 space-y-3 animate-fadeIn">
          <h5 className="text-xs font-sports font-bold text-white flex items-center gap-1.5">
            <Plus size={12} /> Registrar Abono Manual a la Deuda
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-carbon-500">MONTO DEL ABONO (COP)</label>
              <input
                type="number"
                placeholder="COP"
                value={abonoMonto}
                onChange={(e) => setAbonoMonto(e.target.value)}
                className="bg-carbon-800 border border-carbon-700 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-carbon-500">NOTAS / CONCEPTO</label>
              <input
                type="text"
                placeholder="Concepto del abono manual"
                value={abonoNotas}
                onChange={(e) => setAbonoNotas(e.target.value)}
                className="bg-carbon-800 border border-carbon-700 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-neonCyan text-black hover:bg-black hover:text-neonCyan border border-neonCyan font-sports font-bold text-xs px-4 py-2 rounded-lg transition-all"
          >
            {loading ? 'Procesando abono...' : 'ABONAR A LA DEUDA'}
          </button>
        </form>
      )}
    </div>
  );
}

export default DeudaLoteCard;
