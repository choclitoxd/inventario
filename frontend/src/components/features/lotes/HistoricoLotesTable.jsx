import React, { useState } from 'react';
import { ListOrdered, Edit, Trash2, Check, X } from 'lucide-react';

function HistoricoLotesTable({ lotes, formatCOP, userRole, onEdit, onDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [editNombre, setEditNombre] = useState('');
  const [editMonto, setEditMonto] = useState('');
  const [editSaldo, setEditSaldo] = useState('');

  const isDueno = userRole === 'DUENO';

  const handleStartEdit = (lote) => {
    setEditingId(lote.id);
    setEditNombre(lote.nombreLote);
    setEditMonto(lote.montoPrestado || 0);
    setEditSaldo(lote.saldoPendiente || 0);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSave = async (lote) => {
    if (!editNombre.trim()) return;
    try {
      await onEdit(lote.id, editNombre.trim(), Number(editMonto) || 0, Number(editSaldo) || 0);
      setEditingId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteClick = async (lote) => {
    const confirm = window.confirm(`¿Está seguro de que desea eliminar el lote "${lote.nombreLote}"? Esta acción eliminará el stock asociado y no se puede deshacer.`);
    if (confirm) {
      try {
        await onDelete(lote.id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="glass-panel p-6 space-y-4">
      <h3 className="text-base font-sports font-bold text-white flex items-center gap-2 border-b border-carbon-800 pb-3">
        <ListOrdered size={18} className="text-neonCyan" /> Lotes de Fondeo Registrados (Histórico)
      </h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-carbon-900 border-b border-carbon-800 text-[10px] font-bold text-carbon-500 tracking-wider">
              <th className="px-4 py-2">LOTE/IDENTIFICADOR</th>
              <th className="px-4 py-2">PROVEEDOR</th>
              <th className="px-4 py-2 text-right">MONTO INICIAL</th>
              <th className="px-4 py-2 text-right">SALDO PENDIENTE</th>
              <th className="px-4 py-2 text-center">ESTADO</th>
              {isDueno && <th className="px-4 py-2 text-center w-24">ACCIONES</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-carbon-800/60 text-xs">
            {lotes.map((lote) => {
              const isEditing = editingId === lote.id;
              const isExterno = lote.financiador === 'INVERSIONISTA_EXTERNO';

              return (
                <tr key={lote.id} className="hover:bg-carbon-850 transition-colors">
                  <td className="px-4 py-3 font-semibold text-white">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editNombre}
                        onChange={(e) => setEditNombre(e.target.value)}
                        className="bg-zinc-950 border border-zinc-800 text-white font-mono text-xs px-2 py-1 rounded w-full focus:outline-none focus:border-neonCyan font-semibold"
                      />
                    ) : (
                      lote.nombreLote
                    )}
                  </td>
                  <td className="px-4 py-3 text-carbon-500">
                    {lote.financiador === 'DUENO_A' ? 'Fondo Dueño A' :
                     lote.financiador === 'DUENO_B' ? 'Fondo Dueño B' :
                     `Proveedor: ${lote.nombreProveedor || 'Externo'}`}
                  </td>
                  <td className="px-4 py-3 text-right font-sports font-bold text-zinc-300">
                    {isEditing && isExterno ? (
                      <input
                        type="number"
                        value={editMonto}
                        onChange={(e) => setEditMonto(e.target.value)}
                        className="bg-zinc-950 border border-zinc-800 text-white font-mono text-xs px-2 py-1 rounded w-28 text-right focus:outline-none focus:border-neonCyan font-bold"
                      />
                    ) : lote.montoPrestado > 0 ? (
                      formatCOP(lote.montoPrestado)
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-sports font-bold text-zinc-300">
                    {isEditing && isExterno ? (
                      <input
                        type="number"
                        value={editSaldo}
                        onChange={(e) => setEditSaldo(e.target.value)}
                        className="bg-zinc-950 border border-zinc-800 text-white font-mono text-xs px-2 py-1 rounded w-28 text-right focus:outline-none focus:border-neonCyan font-bold"
                      />
                    ) : lote.montoPrestado > 0 ? (
                      formatCOP(lote.saldoPendiente)
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-[9px] font-bold tracking-widest px-2 py-0.5 rounded-full border ${
                      lote.estado === 'LIQUIDADO' 
                        ? 'bg-neonGreen/10 border-neonGreen/30 text-neonGreen' 
                        : 'bg-neonCyan/10 border-neonCyan/30 text-neonCyan'
                    }`}>
                      {lote.estado}
                    </span>
                  </td>
                  {isDueno && (
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => handleSave(lote)}
                              className="text-neonGreen hover:text-emerald-400 transition-colors p-1"
                              title="Guardar cambios"
                            >
                              <Check size={15} />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="text-zinc-500 hover:text-white transition-colors p-1"
                              title="Cancelar edición"
                            >
                              <X size={15} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleStartEdit(lote)}
                              className="text-neonCyan hover:text-cyan-400 transition-colors p-1"
                              title="Editar lote"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(lote)}
                              className="text-zinc-500 hover:text-red-500 transition-colors p-1"
                              title="Eliminar lote"
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HistoricoLotesTable;
