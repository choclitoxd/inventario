import React from 'react';
import NumericStepper from '../../common/NumericStepper';

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
          <NumericStepper
            value={parseInt(cantPacas) || 0}
            onChange={(val) => setCantPacas(val.toString())}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-bold text-carbon-500">CAJAS</label>
          <NumericStepper
            value={parseInt(cantCajas) || 0}
            onChange={(val) => setCantCajas(val.toString())}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-bold text-carbon-500">UNIDADES</label>
          <NumericStepper
            value={parseInt(cantUnidades) || 0}
            onChange={(val) => setCantUnidades(val.toString())}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-bold text-carbon-500">COSTO PACA</label>
          <NumericStepper
            value={parseFloat(costoPaca) || 0}
            onChange={(val) => setCostoPaca(val.toString())}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-bold text-carbon-500">COSTO CAJA</label>
          <NumericStepper
            value={parseFloat(costoCaja) || 0}
            onChange={(val) => setCostoCaja(val.toString())}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-bold text-carbon-500">COSTO UNID</label>
          <NumericStepper
            value={parseFloat(costoUnidad) || 0}
            onChange={(val) => setCostoUnidad(val.toString())}
          />
        </div>
      </div>
    </>
  );
}

export default CostoCantidadCampos;
