import React from 'react';
import { Layers, RefreshCw } from 'lucide-react';

const tableColors = [
  "cyan", "emerald", "indigo", "violet", "amber", "rose", "fuchsia", "teal", "yellow", "orange", "sky", "red", "purple"
];

const getTailwindBgClass = (colorName) => {
  const bgClasses = {
    cyan: "bg-cyan-500",
    emerald: "bg-emerald-500",
    indigo: "bg-indigo-500",
    violet: "bg-violet-500",
    amber: "bg-amber-500",
    rose: "bg-rose-500",
    fuchsia: "bg-fuchsia-500",
    teal: "bg-teal-500",
    yellow: "bg-yellow-500",
    orange: "bg-orange-500",
    sky: "bg-sky-500",
    red: "bg-red-500",
    purple: "bg-purple-500"
  };
  return bgClasses[colorName] || "bg-zinc-500";
};

function DbTablesMeta({ dbHealth, dbHealthLoading, onRefresh }) {
  return (
    <div className="glass-panel p-6 border border-carbon-800 lg:col-span-2 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xs font-sports font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="text-neonGreen" size={14} />
              Metadatos y Auditoría Física de Tablas
            </h3>
          </div>
          <button 
            onClick={onRefresh}
            disabled={dbHealthLoading}
            className="p-1.5 bg-carbon-800 border border-carbon-700/60 rounded-lg hover:border-neonCyan transition-all"
            title="Actualizar metadatos"
          >
            <RefreshCw size={12} className={dbHealthLoading ? 'animate-spin' : ''} />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <div className="max-h-56 overflow-y-auto pr-2">
            <table className="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr className="border-b border-carbon-800 text-[9px] font-bold text-carbon-500 uppercase tracking-wider">
                  <th className="py-2 px-3">Tabla</th>
                  <th className="py-2 px-3 text-right">Filas</th>
                  <th className="py-2 px-3 text-right">Datos</th>
                  <th className="py-2 px-3 text-right">Índices</th>
                  <th className="py-2 px-3 text-right">Total (MB)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-carbon-800/40">
                {dbHealth?.tables?.map((table, idx) => (
                  <tr key={table.tableName} className="hover:bg-carbon-800/10">
                    <td className="py-2 px-3 font-semibold text-white font-mono flex items-center">
                      <span className={`inline-block w-2.5 h-2.5 rounded-full mr-2.5 ${getTailwindBgClass(tableColors[idx % tableColors.length])}`}></span>
                      {table.tableName}
                    </td>
                    <td className="py-2 px-3 text-right font-medium text-zinc-300">{table.rowCount.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right text-carbon-400 font-mono">{table.dataSizeMb.toFixed(3)} MB</td>
                    <td className="py-2 px-3 text-right text-carbon-400 font-mono">{table.indexSizeMb.toFixed(3)} MB</td>
                    <td className="py-2 px-3 text-right text-neonCyan font-bold font-mono">{table.totalSizeMb.toFixed(3)} MB</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DbTablesMeta;
