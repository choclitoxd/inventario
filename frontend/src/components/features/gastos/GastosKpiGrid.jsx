import React from 'react';
import { Truck, Car, Coffee, HelpCircle } from 'lucide-react';

function GastosKpiGrid({
  totalMonto,
  totalFletes,
  totalTransporte,
  totalAlimentacion,
  totalOtro,
  getPercentage,
  formatCOP
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {/* Total General Card */}
      <div className="col-span-2 md:col-span-1 glass-panel p-4 flex flex-col justify-between border-l-4 border-l-red-500">
        <div>
          <span className="text-[9px] font-bold text-carbon-500 tracking-wider">TOTAL EGRESOS</span>
          <h4 className="text-lg font-sports font-bold text-white mt-1">{formatCOP(totalMonto)}</h4>
        </div>
        <span className="text-[10px] text-red-500 font-semibold mt-2">100% Acumulado</span>
      </div>

      {/* Fletes Card */}
      <div className="glass-panel p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-bold text-carbon-500 tracking-wider">FLETES</span>
          <Truck size={14} className="text-blue-400" />
        </div>
        <div className="mt-2">
          <h4 className="text-base font-sports font-bold text-white">{formatCOP(totalFletes)}</h4>
          <span className="text-[10px] text-blue-400 font-bold">{getPercentage(totalFletes).toFixed(1)}%</span>
        </div>
      </div>

      {/* Transporte Card */}
      <div className="glass-panel p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-bold text-carbon-500 tracking-wider">TRANSPORTE</span>
          <Car size={14} className="text-purple-400" />
        </div>
        <div className="mt-2">
          <h4 className="text-base font-sports font-bold text-white">{formatCOP(totalTransporte)}</h4>
          <span className="text-[10px] text-purple-400 font-bold">{getPercentage(totalTransporte).toFixed(1)}%</span>
        </div>
      </div>

      {/* Alimentacion Card */}
      <div className="glass-panel p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-bold text-carbon-500 tracking-wider">ALIMENTACIÓN</span>
          <Coffee size={14} className="text-amber-400" />
        </div>
        <div className="mt-2">
          <h4 className="text-base font-sports font-bold text-white">{formatCOP(totalAlimentacion)}</h4>
          <span className="text-[10px] text-amber-400 font-bold">{getPercentage(totalAlimentacion).toFixed(1)}%</span>
        </div>
      </div>

      {/* Otro Card */}
      <div className="glass-panel p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-bold text-carbon-500 tracking-wider">OTROS</span>
          <HelpCircle size={14} className="text-zinc-400" />
        </div>
        <div className="mt-2">
          <h4 className="text-base font-sports font-bold text-white">{formatCOP(totalOtro)}</h4>
          <span className="text-[10px] text-zinc-400 font-bold">{getPercentage(totalOtro).toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
}

export default GastosKpiGrid;
