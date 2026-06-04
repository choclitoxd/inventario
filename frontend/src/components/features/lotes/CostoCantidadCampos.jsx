import React from 'react';

function CostoCantidadCampos({
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
  setCostoUnidad
}) {
  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-bold text-carbon-500">PACAS</label>
          <input
            type="number"
            placeholder="0"
            value={cantPacas}
            onChange={(e) => setCantPacas(e.target.value)}
            className="bg-carbon-800 border border-carbon-700 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-bold text-carbon-500">CAJAS</label>
          <input
            type="number"
            placeholder="0"
            value={cantCajas}
            onChange={(e) => setCantCajas(e.target.value)}
            className="bg-carbon-800 border border-carbon-700 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-bold text-carbon-500">UNIDADES</label>
          <input
            type="number"
            placeholder="0"
            value={cantUnidades}
            onChange={(e) => setCantUnidades(e.target.value)}
            className="bg-carbon-800 border border-carbon-700 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-bold text-carbon-500">COSTO PACA</label>
          <input
            type="number"
            placeholder="COP"
            value={costoPaca}
            onChange={(e) => setCostoPaca(e.target.value)}
            className="bg-carbon-800 border border-carbon-700 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-bold text-carbon-500">COSTO CAJA</label>
          <input
            type="number"
            placeholder="COP"
            value={costoCaja}
            onChange={(e) => setCostoCaja(e.target.value)}
            className="bg-carbon-800 border border-carbon-700 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-bold text-carbon-500">COSTO UNID</label>
          <input
            type="number"
            placeholder="COP"
            value={costoUnidad}
            onChange={(e) => setCostoUnidad(e.target.value)}
            className="bg-carbon-800 border border-carbon-700 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none"
          />
        </div>
      </div>
    </>
  );
}

export default CostoCantidadCampos;
