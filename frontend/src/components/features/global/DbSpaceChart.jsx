import React from 'react';
import { Database } from 'lucide-react';
import { DonutChart } from '@tremor/react';

const tableColors = [
  "cyan", "emerald", "indigo", "violet", "amber", "rose", "fuchsia", "teal", "yellow", "orange", "sky", "red", "purple"
];

function DbSpaceChart({ dbHealth, dbHealthLoading, dbHealthError }) {
  const chartData = dbHealth?.tables?.map(t => ({
    name: t.tableName,
    size: Number(t.totalSizeMb.toFixed(4))
  })) || [];

  return (
    <div className="glass-panel p-6 border border-carbon-800 flex flex-col justify-between">
      <div>
        <h3 className="text-xs font-sports font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-2">
          <Database size={14} className="text-neonCyan" />
          Distribución de Espacio
        </h3>
        <p className="text-[10px] text-carbon-500 font-semibold mb-4 uppercase">
          Consumo en disco por tabla del sistema
        </p>
      </div>
      {dbHealthLoading ? (
        <div className="h-48 flex items-center justify-center text-xs text-carbon-500 font-bold uppercase">Cargando gráfico...</div>
      ) : dbHealthError ? (
        <div className="h-48 flex items-center justify-center text-xs text-red-400 font-bold uppercase">{dbHealthError}</div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <DonutChart
            className="h-48 w-48"
            data={chartData}
            category="size"
            index="name"
            valueFormatter={(val) => `${val.toFixed(3)} MB`}
            colors={tableColors}
          />
          <span className="text-[9px] text-carbon-500 font-bold mt-4 uppercase">Valores en Megabytes (MB)</span>
        </div>
      )}
    </div>
  );
}

export default DbSpaceChart;
