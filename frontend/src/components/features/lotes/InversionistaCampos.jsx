import React from 'react';

function InversionistaCampos({
  nombreInversionista,
  setNombreInversionista,
  deudaInicial,
  setDeudaInicial,
  porcentajeAmortizacion,
  setPorcentajeAmortizacion
}) {
  return (
    <div className="bg-carbon-950 p-3 rounded-xl border border-carbon-800 space-y-3 animate-fadeIn">
      <div className="flex flex-col gap-1">
        <label className="text-[9px] font-bold text-carbon-500">NOMBRE INVERSIONISTA</label>
        <input
          type="text"
          placeholder="Ej. Juan Perez"
          value={nombreInversionista}
          onChange={(e) => setNombreInversionista(e.target.value)}
          className="bg-carbon-800 border border-carbon-700 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[9px] font-bold text-carbon-500">MONTO DEUDA PRESTADA</label>
        <input
          type="number"
          placeholder="COP"
          value={deudaInicial}
          onChange={(e) => setDeudaInicial(e.target.value)}
          className="bg-carbon-800 border border-carbon-700 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[9px] font-bold text-carbon-500">% GANANCIAS PARA AMORTIZACIÓN</label>
        <input
          type="number"
          placeholder="%"
          min="1"
          max="100"
          value={porcentajeAmortizacion}
          onChange={(e) => setPorcentajeAmortizacion(e.target.value)}
          className="bg-carbon-800 border border-carbon-700 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none"
        />
      </div>
    </div>
  );
}

export default InversionistaCampos;
