import React from 'react';
import { Package } from 'lucide-react';

function InventarioTable({
  inventarios,
  loading,
  onAbrirCaja,
  onAbrirPacaLaminas,
  onAbrirPacaAlbumes,
  formatCOP
}) {
  return (
    <div className="glass-panel overflow-hidden border border-carbon-800 shadow-xl">
      <div className="px-6 py-4 border-b border-carbon-800 bg-carbon-900/60 flex items-center justify-between">
        <h3 className="font-sports font-bold text-white text-base">Niveles de Existencias Actuales</h3>
        <span className="text-xs text-carbon-500 font-medium">Registrado por Lote y Origen</span>
      </div>

      {loading ? (
        <div className="p-12 text-center text-carbon-500 font-semibold flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-neonGreen border-t-transparent rounded-full animate-spin shadow-neon-green" />
          Cargando inventarios...
        </div>
      ) : inventarios.length === 0 ? (
        <div className="p-12 text-center text-carbon-600 font-semibold flex flex-col items-center gap-3">
          <Package size={48} className="text-carbon-700 font-medium" />
          <span>No hay stock registrado en el sistema. Ingresa un nuevo lote para ver existencias.</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-carbon-900 border-b border-carbon-800 text-[10px] font-bold text-carbon-500 tracking-wider font-sports">
                <th className="px-6 py-3">PRODUCTO / TIPO</th>
                <th className="px-6 py-3">LOTE / FINANCIADOR</th>
                <th className="px-6 py-3 text-center">CANT. PACAS</th>
                <th className="px-6 py-3 text-center">CANT. CAJAS</th>
                <th className="px-6 py-3 text-center">SOBRES / UNIDADES</th>
                <th className="px-6 py-3 text-right">COSTOS COMPRA (UNITARIO)</th>
                <th className="px-6 py-3 text-center">DESEMPACAR / ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-carbon-800/60 text-xs">
              {inventarios.map((inv) => {
                const prod = inv.producto;
                const lote = inv.loteInversionista;
                
                return (
                  <tr key={inv.id} className="hover:bg-carbon-800/20 transition-colors">
                    {/* Producto */}
                    <td className="px-6 py-4">
                      <div className="font-sports font-bold text-white text-sm">{prod.nombre}</div>
                      <span className={`text-[9px] font-bold tracking-widest px-2 py-0.5 rounded-full border mt-1 inline-block ${
                        prod.tipo === 'LAMINAS' ? 'bg-neonGreen/10 border-neonGreen/30 text-neonGreen' :
                        prod.tipo === 'ALBUM' ? 'bg-neonCyan/10 border-neonCyan/30 text-neonCyan' :
                        'bg-purple-500/10 border-purple-500/30 text-purple-400'
                      }`}>
                        {prod.tipo}
                      </span>
                    </td>

                    {/* Lote */}
                    <td className="px-6 py-4">
                      <div className="font-semibold text-zinc-300">{lote.nombreLote}</div>
                      <span className="text-[10px] text-carbon-500 font-medium">
                        {lote.financiador === 'DUENO_A' ? 'Fondo Dueño A' :
                         lote.financiador === 'DUENO_B' ? 'Fondo Dueño B' :
                         `Externo (${lote.nombreInversionista || 'Inversionista'})`}
                      </span>
                    </td>

                    {/* Stock Pacas */}
                    <td className="px-6 py-4 text-center font-sports font-bold text-white text-sm">
                      {inv.cantActualPacas || 0}
                    </td>

                    {/* Stock Cajas */}
                    <td className="px-6 py-4 text-center font-sports font-bold text-white text-sm">
                      {inv.cantActualCajas || 0}
                    </td>

                    {/* Stock Unidades */}
                    <td className="px-6 py-4 text-center font-sports font-bold text-white text-sm">
                      {inv.cantActualUnidades || 0}
                    </td>

                    {/* Costos compra congelados */}
                    <td className="px-6 py-4 text-right">
                      <div className="text-xs text-carbon-500 font-medium">
                        Paca: <span className="text-zinc-300 font-semibold">{inv.costoCompraPaca ? formatCOP(inv.costoCompraPaca) : '-'}</span>
                      </div>
                      <div className="text-xs text-carbon-500 font-medium mt-0.5">
                        Caja: <span className="text-zinc-300 font-semibold">{inv.costoCompraCaja ? formatCOP(inv.costoCompraCaja) : '-'}</span>
                      </div>
                      <div className="text-xs text-carbon-500 font-medium mt-0.5">
                        Unidad: <span className="text-zinc-300 font-semibold">{inv.costoCompraUnidad ? formatCOP(inv.costoCompraUnidad) : '-'}</span>
                      </div>
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center items-center gap-2">
                        
                        {/* Botones para LAMINAS */}
                        {prod.tipo === 'LAMINAS' && (
                          <>
                            <button
                              onClick={() => onAbrirPacaLaminas(inv.id)}
                              disabled={!inv.cantActualPacas || inv.cantActualPacas < 1}
                              className={`text-[10px] font-sports font-bold px-2.5 py-1.5 rounded-lg border transition-all ${
                                inv.cantActualPacas && inv.cantActualPacas >= 1
                                  ? 'bg-carbon-800 border-neonGreen/50 text-neonGreen hover:bg-neonGreen hover:text-black shadow-md'
                                  : 'border-carbon-800 text-carbon-600 bg-carbon-900/40 cursor-not-allowed'
                              }`}
                            >
                              Abrir Paca (1 → 10 Cajas)
                            </button>
                            <button
                              onClick={() => onAbrirCaja(inv.id)}
                              disabled={!inv.cantActualCajas || inv.cantActualCajas < 1}
                              className={`text-[10px] font-sports font-bold px-2.5 py-1.5 rounded-lg border transition-all ${
                                inv.cantActualCajas && inv.cantActualCajas >= 1
                                  ? 'bg-carbon-800 border-neonGreen/50 text-neonGreen hover:bg-neonGreen hover:text-black shadow-md'
                                  : 'border-carbon-800 text-carbon-600 bg-carbon-900/40 cursor-not-allowed'
                              }`}
                            >
                              Abrir Caja (1 → 104 Sobres)
                            </button>
                          </>
                        )}

                        {/* Botones para ALBUM */}
                        {prod.tipo === 'ALBUM' && (
                          <button
                            onClick={() => onAbrirPacaAlbumes(inv.id)}
                            disabled={!inv.cantActualPacas || inv.cantActualPacas < 1}
                            className={`text-[10px] font-sports font-bold px-2.5 py-1.5 rounded-lg border transition-all ${
                              inv.cantActualPacas && inv.cantActualPacas >= 1
                                ? 'bg-carbon-800 border-neonCyan/50 text-neonCyan hover:bg-neonCyan hover:text-black shadow-md'
                                : 'border-carbon-800 text-carbon-600 bg-carbon-900/40 cursor-not-allowed'
                            }`}
                          >
                            Abrir Paca (1 → 26 Álbumes)
                          </button>
                        )}

                        {prod.tipo === 'COMBO' && (
                          <span className="text-xs text-carbon-500 font-semibold italic">Plantilla de Combo</span>
                        )}

                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default InventarioTable;
