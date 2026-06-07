import React from 'react';
import { X, Coins, Edit2, Trash2 } from 'lucide-react';

function LotesDesgloseModal({ 
  groupedProduct, 
  currentUser, 
  onClose, 
  onDesglosar, 
  onEditClick, 
  onDeleteClick, 
  formatCOP 
}) {
  if (!groupedProduct) return null;
  const { producto, lotes } = groupedProduct;

  // Calcular el costo total general del producto en todos los lotes
  const totalGeneralProducto = lotes.reduce((sum, lote) => {
    const costPaca = (lote.cantActualPacas || 0) * (lote.costoCompraPaca || 0);
    const costCaja = (lote.cantActualCajas || 0) * (lote.costoCompraCaja || 0);
    const costUnidad = (lote.cantActualUnidades || 0) * (lote.costoCompraUnidad || 0);
    return sum + costPaca + costCaja + costUnidad;
  }, 0);

  const isLaminas = producto.tipo === 'FRACCIONADO_LAMINAS' || producto.tipo === 'LAMINAS';
  const isAlbumes = producto.tipo === 'FRACCIONADO_ALBUMES' || producto.tipo === 'ALBUM';
  const isUnidadSimple = producto.tipo === 'UNIDAD_SIMPLE' || (!isLaminas && !isAlbumes);
  const isDueno = currentUser?.rol === 'DUENO';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-carbon-900 border border-carbon-800 rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-carbon-800 bg-carbon-950/40">
          <div>
            <h3 className="text-lg font-sports font-bold text-white flex items-center gap-2">
              <Coins className="text-neonGreen" size={20} /> Desglose por Lote/Socio
            </h3>
            <p className="text-xs text-carbon-500 font-semibold">{producto.nombre} ({isLaminas ? 'LÁMINAS' : isAlbumes ? 'ÁLBUMES' : 'MERCANCÍA'})</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-carbon-850 rounded-lg text-carbon-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="overflow-auto p-6">
          {isAlbumes ? (
            <div className="space-y-4">
              {lotes.map((lote) => {
                const label = lote.loteInversionista.financiador === 'DUENO_A' ? 'Dueño A' :
                              lote.loteInversionista.financiador === 'DUENO_B' ? 'Dueño B' :
                              `Externo (${lote.loteInversionista.nombreInversionista || 'Inversionista'})`;
                const badgeColor = lote.loteInversionista.financiador === 'DUENO_A' ? 'text-neonGreen bg-neonGreen/10 border-neonGreen/20' :
                                   lote.loteInversionista.financiador === 'DUENO_B' ? 'text-neonCyan bg-neonCyan/10 border-neonCyan/20' :
                                   'text-purple-400 bg-purple-500/10 border-purple-500/20';

                // Costo total del lote para Álbumes (sin considerar cajas)
                const totalCostoLote = 
                  (lote.cantActualPacas || 0) * (lote.costoCompraPaca || 0) +
                  (lote.cantActualUnidades || 0) * (lote.costoCompraUnidad || 0);

                return (
                  <div key={lote.id} className="border-b border-carbon-800/60 py-4 space-y-3">
                    {/* Encabezado del Lote */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-white">{lote.loteInversionista.nombreLote}</h4>
                        <span className={`px-2 py-0.5 text-[9px] font-bold rounded border inline-block ${badgeColor}`}>
                          {label}
                        </span>
                      </div>
                      <span className="text-xs text-zinc-400 font-semibold font-mono">
                        Valor Lote: <span className="text-emerald-400 font-bold">{formatCOP(totalCostoLote)}</span>
                      </span>
                    </div>

                    {/* Fila Superior (Pacas) */}
                    <div className="flex items-center justify-between bg-carbon-950/30 p-2.5 rounded-xl border border-carbon-800/40 text-xs">
                      <div className="flex space-x-6">
                        <span className="font-mono text-white flex items-center">
                          <strong className="text-zinc-500 font-sports mr-2">STOCK:</strong>
                          <span className="bg-neonCyan/10 text-neonCyan border border-neonCyan/20 px-2 py-0.5 rounded font-bold">
                            {lote.cantActualPacas || 0} Pacas
                          </span>
                        </span>
                        <span className="font-mono text-zinc-400 flex items-center">
                          Costo Paca: <span className="text-zinc-300 font-semibold ml-1">{lote.costoCompraPaca ? formatCOP(lote.costoCompraPaca) : '-'}</span>
                        </span>
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={() => onDesglosar(producto.id, lote.loteInversionista.id, 'PACA')}
                          disabled={!lote.cantActualPacas || lote.cantActualPacas < 1}
                          className={`px-3 py-1 text-xs font-bold border rounded transition-colors ${
                            lote.cantActualPacas >= 1 
                              ? 'border-neonCyan/30 text-neonCyan hover:bg-neonCyan/10' 
                              : 'border-carbon-800 text-carbon-600 bg-carbon-900/20 cursor-not-allowed'
                          }`}
                        >
                          Abrir Paca
                        </button>
                      </div>
                    </div>

                    {/* Fila Inferior (Álbumes/Unidades) */}
                    <div className="flex items-center justify-between bg-carbon-950/10 p-2.5 rounded-xl text-xs">
                      <div className="flex space-x-6">
                        <span className="font-mono text-white flex items-center">
                          <strong className="text-zinc-500 font-sports mr-2">STOCK:</strong>
                          <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded font-bold">
                            {lote.cantActualUnidades || 0} Álbumes
                          </span>
                        </span>
                        <span className="font-mono text-zinc-400 flex items-center">
                          Costo Unidad: <span className="text-zinc-300 font-semibold ml-1">{lote.costoCompraUnidad ? formatCOP(lote.costoCompraUnidad) : '-'}</span>
                        </span>
                      </div>
                      {isDueno && (
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => onEditClick(lote)}
                            className="text-zinc-500 hover:text-neonCyan p-1 rounded hover:bg-carbon-800 transition-colors"
                            title="Editar Stock y Costos"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteClick(lote.id)}
                            className="text-zinc-500 hover:text-red-500 p-1 rounded hover:bg-carbon-800 transition-colors"
                            title="Eliminar de Sede"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Totalizador General de la Sede para este Producto */}
              <div className="flex items-center justify-between bg-carbon-950/60 p-4 border border-carbon-800 rounded-2xl shadow-lg mt-4 font-sports">
                <span className="text-xs text-carbon-400 font-bold uppercase tracking-wider">TOTAL VALORIZACIÓN PRODUCTO</span>
                <span className="text-sm font-mono text-emerald-400 font-bold">
                  {formatCOP(totalGeneralProducto)}
                </span>
              </div>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-carbon-950/60 border-b border-carbon-800 text-[10px] font-bold text-carbon-500 tracking-wider font-sports">
                  <th className="px-4 py-3">LOTE / FINANCIADOR</th>
                  {!isUnidadSimple && <th className="px-4 py-3 text-center">PACAS</th>}
                  {isLaminas && <th className="px-4 py-3 text-center">CAJAS</th>}
                  <th className="px-4 py-3 text-center">
                    {isLaminas ? 'SOBRES' : isAlbumes ? 'ÁLBUMES SUELTOS' : 'UNIDADES'}
                  </th>
                  <th className="px-4 py-3 text-right">COSTOS UNITARIOS</th>
                  <th className="px-4 py-3 text-right">COSTO TOTAL STOCK</th>
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

                  // Calcular el costo total valorizado del stock del lote
                  const totalCostoLote = 
                    (lote.cantActualPacas || 0) * (lote.costoCompraPaca || 0) +
                    (lote.cantActualCajas || 0) * (lote.costoCompraCaja || 0) +
                    (lote.cantActualUnidades || 0) * (lote.costoCompraUnidad || 0);

                  return (
                    <tr key={lote.id} className="hover:bg-carbon-850/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-sports font-bold text-white text-sm">{lote.loteInversionista.nombreLote}</div>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border inline-block ${badgeColor}`}>{label}</span>
                          <span className="text-[10px] text-zinc-400 font-semibold font-mono">
                            Valor del Lote: <span className="text-emerald-400 font-bold">{formatCOP(totalCostoLote)}</span>
                          </span>
                        </div>
                      </td>
                      
                      {!isUnidadSimple && (
                        <td className="px-4 py-3 text-center font-mono text-zinc-300">
                          <span className="text-white font-bold">{lote.cantActualPacas || 0}</span>
                        </td>
                      )}

                      {isLaminas && (
                        <td className="px-4 py-3 text-center font-mono text-zinc-300">
                          <span className="text-neonGreen font-bold">{lote.cantActualCajas || 0}</span>
                        </td>
                      )}

                      <td className="px-4 py-3 text-center font-mono text-zinc-300">
                        <span className="text-white font-bold">{lote.cantActualUnidades || 0}</span>
                      </td>

                      <td className="px-4 py-3 text-right font-medium text-carbon-500 space-y-0.5">
                        {!isUnidadSimple && (
                          <div>
                            <span className="text-[10px] text-zinc-500 mr-1">Paca:</span>
                            <span className="text-zinc-300 font-semibold">{lote.costoCompraPaca ? formatCOP(lote.costoCompraPaca) : '-'}</span>
                          </div>
                        )}
                        {isLaminas && (
                          <div>
                            <span className="text-[10px] text-zinc-500 mr-1">Caja:</span>
                            <span className="text-zinc-300 font-semibold">{lote.costoCompraCaja ? formatCOP(lote.costoCompraCaja) : '-'}</span>
                          </div>
                        )}
                        <div>
                          <span className="text-[10px] text-zinc-500 mr-1">
                            {isLaminas ? 'Sobre:' : isAlbumes ? 'Álbum:' : 'Unidad:'}
                          </span>
                          <span className="text-zinc-300 font-semibold">{lote.costoCompraUnidad ? formatCOP(lote.costoCompraUnidad) : '-'}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-right font-mono text-emerald-400 font-bold text-xs">
                        {formatCOP(totalCostoLote)}
                      </td>

                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center items-center gap-1.5">
                          {isLaminas && (
                            <>
                              <button
                                type="button"
                                onClick={() => onDesglosar(producto.id, lote.loteInversionista.id, 'PACA')}
                                disabled={!lote.cantActualPacas || lote.cantActualPacas < 1}
                                className={`text-[9px] font-sports font-bold px-2.5 py-1 rounded border transition-all ${
                                  lote.cantActualPacas >= 1 
                                    ? 'bg-carbon-800 border-neonGreen/40 text-neonGreen hover:bg-neonGreen hover:text-black' 
                                    : 'border-carbon-800 text-carbon-600 bg-carbon-900/20 cursor-not-allowed'
                                }`}
                              >
                                Abrir Paca
                              </button>
                              <button
                                type="button"
                                onClick={() => onDesglosar(producto.id, lote.loteInversionista.id, 'CAJA')}
                                disabled={!lote.cantActualCajas || lote.cantActualCajas < 1}
                                className={`text-[9px] font-sports font-bold px-2.5 py-1 rounded border transition-all ${
                                  lote.cantActualCajas >= 1 
                                    ? 'bg-carbon-800 border-neonGreen/40 text-neonGreen hover:bg-neonGreen hover:text-black' 
                                    : 'border-carbon-800 text-carbon-600 bg-carbon-900/20 cursor-not-allowed'
                                }`}
                              >
                                Abrir Caja
                              </button>
                            </>
                          )}
                          {isAlbumes && (
                            <button
                              type="button"
                              onClick={() => onDesglosar(producto.id, lote.loteInversionista.id, 'PACA')}
                              disabled={!lote.cantActualPacas || lote.cantActualPacas < 1}
                              className={`text-[9px] font-sports font-bold px-2.5 py-1 rounded border transition-all ${
                                lote.cantActualPacas >= 1 
                                  ? 'bg-carbon-800 border-neonCyan/40 text-neonCyan hover:bg-neonCyan hover:text-black' 
                                  : 'border-carbon-800 text-carbon-600 bg-carbon-900/20 cursor-not-allowed'
                              }`}
                            >
                              Abrir Paca
                            </button>
                          )}
                          {isUnidadSimple && !isDueno && (
                            <span className="text-[10px] text-carbon-500 font-semibold italic">Mercancía Simple</span>
                          )}
                          {isDueno && (
                            <>
                              <button
                                type="button"
                                onClick={() => onEditClick(lote)}
                                className="p-1 text-neonCyan hover:bg-neonCyan/10 border border-neonCyan/20 rounded-lg hover:text-white transition-all"
                                title="Editar Stock y Costos"
                              >
                                <Edit2 size={12} />
                              </button>
                              <button
                                type="button"
                                onClick={() => onDeleteClick(lote.id)}
                                className="p-1 text-red-500 hover:bg-red-500/10 border border-red-500/20 rounded-lg hover:text-white transition-all"
                                title="Eliminar de Sede"
                              >
                                <Trash2 size={12} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-carbon-950/40 font-bold border-t border-carbon-800 text-white font-sports">
                  <td className="px-4 py-3 text-carbon-400 uppercase text-[10px] tracking-wider">TOTAL VALORIZACIÓN</td>
                  {!isUnidadSimple && <td></td>}
                  {isLaminas && <td></td>}
                  <td></td>
                  <td></td>
                  <td className="px-4 py-3 text-right text-emerald-400 font-mono font-bold text-sm">
                    {formatCOP(totalGeneralProducto)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default LotesDesgloseModal;
