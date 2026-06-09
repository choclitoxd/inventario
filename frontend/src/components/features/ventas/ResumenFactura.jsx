import React from 'react';

function ResumenFactura({
  metodoPago,
  setMetodoPago,
  detalles,
  calcularTotal,
  formatCOP,
  loading,
  nroReferencia,
  setNroReferencia
}) {
  const total = calcularTotal();
  const isButtonDisabled = loading || detalles.length === 0 || (metodoPago === 'TRANSFERENCIA' && (!nroReferencia || !nroReferencia.trim()));

  return (
    <div className="glass-panel p-6 space-y-6 border-l-4 border-l-neonGreen">
      <h3 className="text-base font-sports font-bold text-white border-b border-carbon-800 pb-3">
        Resumen de Factura
      </h3>

      <div className="space-y-2">
        <label className="text-xs font-bold text-carbon-500 block">MÉTODO DE PAGO</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setMetodoPago('EFECTIVO')}
            className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all ${
              metodoPago === 'EFECTIVO'
                ? 'bg-neonGreen/10 border-neonGreen text-neonGreen shadow-neon-green'
                : 'bg-carbon-800 border-carbon-700 text-carbon-500 hover:text-zinc-100'
            }`}
          >
            Efectivo (Contado)
          </button>
          <button
            type="button"
            onClick={() => setMetodoPago('TRANSFERENCIA')}
            className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all ${
              metodoPago === 'TRANSFERENCIA'
                ? 'bg-neonGreen/10 border-neonGreen text-neonGreen shadow-neon-green'
                : 'bg-carbon-800 border-carbon-700 text-carbon-500 hover:text-zinc-100'
            }`}
          >
            Transferencia
          </button>
        </div>
        {metodoPago === 'TRANSFERENCIA' && (
          <div className="animate-fadeIn">
            <input
              type="text"
              placeholder="NRO. REFERENCIA / COMPROBANTE"
              value={nroReferencia || ''}
              onChange={(e) => setNroReferencia(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 text-xs text-white p-2.5 rounded-lg w-full placeholder-zinc-600 mt-2 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        )}
      </div>

      <div className="space-y-3 bg-carbon-950 p-4 rounded-xl border border-carbon-800">
        <div className="flex items-center justify-between text-xs text-carbon-500">
          <span>Total Items</span>
          <span className="font-semibold text-zinc-300">{detalles.length}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-carbon-500">
          <span>Método</span>
          <span className="font-semibold text-zinc-300 capitalize">{metodoPago.toLowerCase()}</span>
        </div>
        <div className="border-t border-carbon-800 pt-3 flex items-center justify-between">
          <span className="text-sm font-sports font-bold text-white">TOTAL A COBRAR</span>
          <span className="text-xl font-sports font-extrabold text-neonGreen">
            {formatCOP(total)}
          </span>
        </div>
      </div>

      <button
        type="submit"
        disabled={isButtonDisabled}
        className={`w-full text-center py-3 rounded-xl font-sports font-extrabold text-sm tracking-wider transition-all duration-300 ${
          isButtonDisabled
            ? 'bg-carbon-800 border border-carbon-700 text-carbon-600 cursor-not-allowed'
            : 'neon-btn-green glow-green-intense'
        }`}
      >
        {loading ? 'Procesando checkout...' : 'REGISTRAR VENTA DE CONTADO'}
      </button>
    </div>
  );
}

export default ResumenFactura;
