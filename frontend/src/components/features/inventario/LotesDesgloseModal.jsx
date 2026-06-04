import React from 'react';
import { X, Coins } from 'lucide-react';

function LotesDesgloseModal({ groupedProduct, onClose, onAbrirCaja, onAbrirPacaLaminas, onAbrirPacaAlbumes, formatCOP }) {
  if (!groupedProduct) return null;
  const { producto, lotes } = groupedProduct;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-carbon-900 border border-carbon-800 rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-carbon-800 bg-carbon-950/40">
          <div>
            <h3 className="text-lg font-sports font-bold text-white flex items-center gap-2">
              <Coins className="text-neonGreen" size={20} /> Desglose por Lote/Socio
            </h3>
            <p className="text-xs text-carbon-500 font-semibold">{producto.nombre} ({producto.tipo})</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-carbon-850 rounded-lg text-carbon-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="overflow-auto p-6">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-carbon-950/60 border-b border-carbon-800 text-[10px] font-bold text-carbon-500 tracking-wider font-sports">
                <th className="px-4 py-3">LOTE / FINANCIADOR</th>
                <th className="px-4 py-3 text-center">STOCK (P / C / S)</th>
                <th className="px-4 py-3 text-right">COSTOS DE COMPRA</th>
                <th className="px-4 py-3 text-center">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-carbon-800/60">
              {lotes.map((lote) => {
                const label = lote.loteInversionista.financiador === 'DUENO_A' ? 'Dueño A' :
                              lote.loteInversionista.financiador === 'DUENO_B' ? 'Dueño B' :
                              `Externo (${lote.loteInversionista.nombreInversionista || 'Inversionista'})`;
                const badgeColor = lote.loteInversionista.financiador === 'DUENO_A' ? 'text-neonGreen bg-neonGreen/10 border-neonGreen/20' :
                                   lote.loteInversionista.financiador === 'DUENO_B' ? 'text-neonCyan bg-neonCyan/10 border-neonCyan/20' :
                                   'text-purple-400 bg-purple-500/10 border-purple-500/20';

                return (
                  <tr key={lote.id} className="hover:bg-carbon-850/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-sports font-bold text-white text-sm">{lote.loteInversionista.nombreLote}</div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border mt-1 inline-block ${badgeColor}`}>{label}</span>
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-zinc-300">
                      P: <span className="text-white font-bold">{lote.cantActualPacas || 0}</span> | 
                      C: <span className="text-neonGreen font-bold"> {lote.cantActualCajas || 0}</span> | 
                      S: <span className="text-white font-bold"> {lote.cantActualUnidades || 0}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-carbon-500">
                      <div>Paca: <span className="text-zinc-300 font-semibold">{lote.costoCompraPaca ? formatCOP(lote.costoCompraPaca) : '-'}</span></div>
                      <div>Caja: <span className="text-zinc-300 font-semibold">{lote.costoCompraCaja ? formatCOP(lote.costoCompraCaja) : '-'}</span></div>
                      <div>Unidad: <span className="text-zinc-300 font-semibold">{lote.costoCompraUnidad ? formatCOP(lote.costoCompraUnidad) : '-'}</span></div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-1.5">
                        {producto.tipo === 'LAMINAS' && (
                          <>
                            <button
                              onClick={() => onAbrirPacaLaminas(lote.id)}
                              disabled={!lote.cantActualPacas || lote.cantActualPacas < 1}
                              className={`text-[9px] font-sports font-bold px-2.5 py-1 rounded border ${lote.cantActualPacas >= 1 ? 'bg-carbon-800 border-neonGreen/40 text-neonGreen hover:bg-neonGreen hover:text-black' : 'border-carbon-800 text-carbon-600 bg-carbon-900/20 cursor-not-allowed'}`}
                            >
                              Abrir Paca
                            </button>
                            <button
                              onClick={() => onAbrirCaja(producto.id)}
                              disabled={!lote.cantActualCajas || lote.cantActualCajas < 1}
                              className={`text-[9px] font-sports font-bold px-2.5 py-1 rounded border ${lote.cantActualCajas >= 1 ? 'bg-carbon-800 border-neonGreen/40 text-neonGreen hover:bg-neonGreen hover:text-black' : 'border-carbon-800 text-carbon-600 bg-carbon-900/20 cursor-not-allowed'}`}
                            >
                              Abrir Caja
                            </button>
                          </>
                        )}
                        {producto.tipo === 'ALBUM' && (
                          <button
                            onClick={() => onAbrirPacaAlbumes(lote.id)}
                            disabled={!lote.cantActualPacas || lote.cantActualPacas < 1}
                            className={`text-[9px] font-sports font-bold px-2.5 py-1 rounded border ${lote.cantActualPacas >= 1 ? 'bg-carbon-800 border-neonCyan/40 text-neonCyan hover:bg-neonCyan hover:text-black' : 'border-carbon-800 text-carbon-600 bg-carbon-900/20 cursor-not-allowed'}`}
                          >
                            Abrir Paca
                          </button>
                        )}
                        {producto.tipo === 'COMBO' && <span className="text-[10px] text-carbon-500 font-semibold italic">Plantilla de Combo</span>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default LotesDesgloseModal;
