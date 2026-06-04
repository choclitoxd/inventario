import React from 'react';
import { Terminal, AlertCircle, Play, CheckCircle2 } from 'lucide-react';

const quickQueries = [
  { label: 'Listar productos del catálogo', value: 'SELECT * FROM productos;' },
  { label: 'Ver inventario físico por producto', value: 'SELECT p.nombre AS producto, i.cant_actual_pacas AS pacas, i.cant_actual_cajas AS cajas, i.cant_actual_unidades AS unidades, i.costo_compra_unidad AS costo FROM inventario i JOIN productos p ON i.producto_id = p.id;' },
  { label: 'Ver últimas ventas con clientes', value: 'SELECT v.id, c.nombre AS cliente, v.total, v.tipo_pago, v.fecha_creacion FROM ventas v JOIN clientes c ON v.cliente_id = c.id ORDER BY v.fecha_creacion DESC;' },
  { label: 'Ver lotes de inversión y saldos', value: 'SELECT nombre_lote, financiador, monto_prestado, saldo_pendiente, estado FROM lotes_inversionistas;' },
  { label: 'Listar gastos hormiga recientes', value: 'SELECT descripcion, monto, categoria, fecha FROM gastos_hormiga ORDER BY fecha DESC;' },
  { label: 'Ver tamaño de tablas en DB', value: "SELECT table_name AS tabla, table_rows AS registros FROM information_schema.tables WHERE table_schema = DATABASE();" }
];

function SqlPlayground({
  sqlQuery,
  setSqlQuery,
  queryResult,
  queryLoading,
  queryError,
  onExecuteSql
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onExecuteSql(sqlQuery);
  };

  return (
    <div className="glass-panel p-6 border border-carbon-800 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-carbon-800">
        <div className="flex items-center gap-2">
          <Terminal size={18} className="text-neonCyan animate-pulse" />
          <div>
            <h3 className="text-sm font-sports font-bold text-white uppercase tracking-wider">SQL Playground (Terminal)</h3>
            <p className="text-[10px] text-carbon-500 font-semibold uppercase">Ejecución de consultas directas y macros SQL</p>
          </div>
        </div>
        
        {/* Consultas Rápidas */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-[9px] font-bold text-carbon-500 uppercase whitespace-nowrap">Macro SQL:</span>
          <select 
            onChange={(e) => {
              if (e.target.value) setSqlQuery(e.target.value);
            }}
            className="bg-carbon-900 border border-carbon-800 rounded-lg px-2.5 py-1.5 text-[11px] text-zinc-300 focus:outline-none focus:border-neonCyan font-semibold w-full sm:w-64"
            defaultValue=""
          >
            <option value="" disabled>-- Selecciona una consulta rápida --</option>
            {quickQueries.map((q, idx) => (
              <option key={idx} value={q.value}>{q.label}</option>
            ))}
          </select>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative border border-carbon-800 rounded-xl overflow-hidden focus-within:border-neonCyan">
          <textarea
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
            className="w-full h-32 bg-black/90 p-4 text-xs font-mono text-emerald-400 focus:outline-none placeholder:text-carbon-700 leading-relaxed resize-y"
            placeholder="Escribe tu consulta SQL aquí... Ej: SELECT * FROM productos;"
            required
          />
        </div>

        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold text-carbon-600 uppercase font-mono">
            Presiona el botón para ejecutar de forma transaccional.
          </span>
          
          <button
            type="submit"
            disabled={queryLoading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-sports font-bold text-xs tracking-wider transition-all duration-300 neon-btn-cyan shadow-neon-cyan"
          >
            {queryLoading ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Play size={14} />
                <span>EJECUTAR SQL</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Visor de errores */}
      {queryError && (
        <div className="bg-red-950/30 border border-red-500/50 p-4 rounded-xl flex items-start gap-3 text-xs text-red-200">
          <AlertCircle size={18} className="flex-shrink-0 text-red-500 mt-0.5" />
          <div>
            <span className="font-bold block mb-1">Error de Base de Datos:</span>
            <p className="font-mono text-[11px] leading-relaxed break-all">{queryError}</p>
          </div>
        </div>
      )}

      {/* Resultados del Playground */}
      {queryResult && (
        <div className="bg-black/40 border border-carbon-800 rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center text-[10px] font-bold text-carbon-500 uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <CheckCircle2 size={12} className="text-neonGreen" />
              {queryResult.message}
            </span>
            {queryResult.rows && (
              <span>Registros: {queryResult.rows.length}</span>
            )}
          </div>

          {/* Mostrar tabla si hay columnas y registros */}
          {queryResult.columns && queryResult.columns.length > 0 ? (
            <div className="overflow-x-auto border border-carbon-800 rounded-lg">
              <div className="max-h-72 overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-carbon-900 border-b border-carbon-800 text-[10px] font-bold text-carbon-400 uppercase tracking-wider font-mono">
                      {queryResult.columns.map((col, idx) => (
                        <th key={idx} className="py-2.5 px-3 whitespace-nowrap">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-carbon-800/40">
                    {queryResult.rows.length === 0 ? (
                      <tr>
                        <td colSpan={queryResult.columns.length} className="py-8 text-center text-carbon-500 font-semibold uppercase tracking-wider">
                          Sin registros retornados por la consulta
                        </td>
                      </tr>
                    ) : (
                      queryResult.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-carbon-800/10">
                          {queryResult.columns.map((col, cIdx) => {
                            const cellValue = row[col];
                            return (
                              <td key={cIdx} className="py-2 px-3 font-mono text-zinc-300 font-medium whitespace-nowrap">
                                {cellValue === null ? (
                                  <span className="text-carbon-600 font-bold italic">NULL</span>
                                ) : typeof cellValue === 'object' ? (
                                  JSON.stringify(cellValue)
                                ) : (
                                  String(cellValue)
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default SqlPlayground;
