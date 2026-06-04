import React from 'react';
import { Cpu, Activity, Database, Layers3 } from 'lucide-react';

function DbHealthStats({ dbHealth, dbHealthLoading }) {
  const totalSizeMb = dbHealth?.tables?.reduce((acc, t) => acc + t.totalSizeMb, 0) ?? 0;
  const totalRows = dbHealth?.tables?.reduce((acc, t) => acc + t.rowCount, 0) ?? 0;
  const latency = dbHealth?.latencyMs ?? 0;
  const activeConns = dbHealth?.pool?.activeConnections ?? 0;
  const totalConns = dbHealth?.pool?.totalConnections || 10;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Ping / Latencia */}
      <div className="glass-panel p-5 relative overflow-hidden group hover:border-carbon-600 transition-all duration-300">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold tracking-wider text-carbon-500 uppercase">Latencia DB (Ping)</span>
          <Cpu size={16} className="text-neonCyan" />
        </div>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-sports font-bold text-white">
            {dbHealthLoading ? '...' : `${latency} ms`}
          </h3>
          {!dbHealthLoading && (
            <span className="flex h-2.5 w-2.5 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                latency < 10 ? 'bg-neonGreen' : latency < 50 ? 'bg-amber-400' : 'bg-red-500'
              }`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                latency < 10 ? 'bg-neonGreen' : latency < 50 ? 'bg-amber-400' : 'bg-red-500'
              }`}></span>
            </span>
          )}
        </div>
        <span className="text-[10px] text-carbon-500 font-semibold block mt-2">
          Tiempo de respuesta del motor SQL
        </span>
      </div>

      {/* Conexiones Activas */}
      <div className="glass-panel p-5 relative overflow-hidden group hover:border-carbon-600 transition-all duration-300">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold tracking-wider text-carbon-500 uppercase">Conexiones Activas</span>
          <Activity size={16} className="text-neonGreen" />
        </div>
        <h3 className="text-2xl font-sports font-bold text-white">
          {dbHealthLoading ? '...' : `${activeConns}`}
        </h3>
        <div className="w-full bg-carbon-800 rounded-full h-1.5 mt-3 overflow-hidden">
          <div 
            className="bg-neonGreen h-1.5 rounded-full transition-all duration-500" 
            style={{ width: `${Math.min(100, (activeConns / totalConns) * 100)}%` }}
          />
        </div>
        <span className="text-[10px] text-carbon-500 font-semibold block mt-2">
          Consultas ejecutándose en paralelo
        </span>
      </div>

      {/* Tamaño Total DB */}
      <div className="glass-panel p-5 relative overflow-hidden group hover:border-carbon-600 transition-all duration-300">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold tracking-wider text-carbon-500 uppercase">Tamaño Total DB</span>
          <Database size={16} className="text-purple-400" />
        </div>
        <h3 className="text-2xl font-sports font-bold text-white">
          {dbHealthLoading ? '...' : `${totalSizeMb.toFixed(3)} MB`}
        </h3>
        <span className="text-[10px] text-carbon-500 font-semibold block mt-2">
          Suma física de datos e índices
        </span>
      </div>

      {/* Total Registros */}
      <div className="glass-panel p-5 relative overflow-hidden group hover:border-carbon-600 transition-all duration-300">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold tracking-wider text-carbon-500 uppercase">Registros Totales</span>
          <Layers3 size={16} className="text-amber-400" />
        </div>
        <h3 className="text-2xl font-sports font-bold text-white">
          {dbHealthLoading ? '...' : `${totalRows.toLocaleString()} filas`}
        </h3>
        <span className="text-[10px] text-carbon-500 font-semibold block mt-2">
          Filas guardadas en todas las tablas
        </span>
      </div>
    </div>
  );
}

export default DbHealthStats;
