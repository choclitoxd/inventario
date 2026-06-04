import React, { useState } from 'react';
import { Activity, User, Filter, RefreshCw, Calendar } from 'lucide-react';

function AuditLogsTable({
  auditLogs,
  auditLoading,
  auditError,
  onRefresh
}) {
  const [filterUser, setFilterUser] = useState('');
  const [filterAction, setFilterAction] = useState('');

  const filteredLogs = (auditLogs || []).filter(log => {
    const matchUser = !filterUser || log.usuario?.toLowerCase().includes(filterUser.toLowerCase());
    const matchAction = !filterAction || log.accion?.toLowerCase().includes(filterAction.toLowerCase());
    return matchUser && matchAction;
  });

  return (
    <div className="glass-panel p-6 border border-carbon-800 space-y-4 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-carbon-800">
        <div className="flex items-center gap-2">
          <Activity className="text-neonCyan" size={20} />
          <h2 className="text-base font-sports font-bold text-white uppercase tracking-wider">Bitácora de Auditoría General</h2>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <span className="absolute left-2.5 top-2.5 text-carbon-500">
              <User size={14} />
            </span>
            <input
              type="text"
              placeholder="Filtrar usuario"
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
              className="bg-carbon-900 border border-carbon-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-neonCyan font-semibold placeholder:text-carbon-600"
            />
          </div>

          <div className="relative flex-1 sm:flex-initial">
            <span className="absolute left-2.5 top-2.5 text-carbon-500">
              <Filter size={14} />
            </span>
            <input
              type="text"
              placeholder="Filtrar acción (Ej: VENTA)"
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="bg-carbon-900 border border-carbon-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-neonCyan font-semibold placeholder:text-carbon-600"
            />
          </div>

          <button
            onClick={onRefresh}
            disabled={auditLoading}
            className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-carbon-800 border border-carbon-700/60 rounded-lg hover:border-neonCyan transition-all duration-300"
            title="Refrescar bitácora"
          >
            <RefreshCw size={12} className={auditLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {auditLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-8 h-8 border-4 border-neonCyan border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-carbon-500 font-semibold tracking-wider">CARGANDO BITÁCORA...</p>
        </div>
      ) : auditError ? (
        <div className="text-center py-12">
          <p className="text-red-400 text-xs font-semibold">{auditError}</p>
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="text-center py-16 text-carbon-500 text-xs font-semibold uppercase tracking-wider">
          No se encontraron registros de auditoría que coincidan con la búsqueda.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="max-h-[500px] overflow-y-auto pr-2">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-carbon-800 text-[10px] font-bold text-carbon-500 tracking-wider uppercase font-sports">
                  <th className="py-3 px-4">Fecha y Hora</th>
                  <th className="py-3 px-4">Usuario</th>
                  <th className="py-3 px-4">Sede</th>
                  <th className="py-3 px-4">Acción / Evento</th>
                  <th className="py-3 px-4">Detalle (Payload JSON o Texto)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-carbon-800/50">
                {filteredLogs.map((log) => {
                  // Color action tags
                  const actionTagColor = 
                    log.accion?.includes('VENTA') ? 'bg-neonGreen/10 text-neonGreen border-neonGreen/20' :
                    log.accion?.includes('GASTO') ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                    log.accion?.includes('LOTE') ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                    log.accion?.includes('CAJA') || log.accion?.includes('PACA') ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                    'bg-neonCyan/10 text-neonCyan border-neonCyan/20';

                  return (
                    <tr key={log.id} className="hover:bg-carbon-800/20 transition-colors">
                      <td className="py-3 px-4 text-carbon-400 whitespace-nowrap">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={12} className="text-carbon-600" />
                          {new Date(log.fecha).toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-white">@{log.usuario}</td>
                      <td className="py-3 px-4 text-neonCyan font-semibold">
                        {log.negocio ? log.negocio.nombre : 'GLOBAL'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wider whitespace-nowrap ${actionTagColor}`}>
                          {log.accion}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-zinc-300 leading-relaxed min-w-[200px]">{log.detalle}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AuditLogsTable;
