import React from 'react';
import { Edit2, Trash2, BookOpen } from 'lucide-react';

function AlbumesTable({ data, loading, onEdit, onDelete, onAbrirCaja, formatCOP, showSede }) {
  if (loading) {
    return (
      <div className="p-12 text-center text-carbon-500 font-semibold flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-4 border-neonGreen border-t-transparent rounded-full animate-spin shadow-neon-green" />
        Cargando álbumes...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="p-12 text-center text-carbon-600 font-semibold flex flex-col items-center gap-3">
        <BookOpen size={48} className="text-carbon-700 font-medium" />
        <span>No se encontraron álbumes en el stock.</span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="bg-carbon-900 border-b border-carbon-800 text-[10px] font-bold text-carbon-500 tracking-wider font-sports">
            <th className="px-6 py-3">PRODUCTO</th>
            <th className="px-6 py-3">COLECCIÓN / EDICIÓN</th>
            {showSede && <th className="px-6 py-3">SEDE</th>}
            <th className="px-6 py-3 text-center">CAJAS / UNIDADES</th>
            <th className="px-6 py-3 text-right">COSTO UNITARIO</th>
            <th className="px-6 py-3 text-center">ACCIONES</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-carbon-800/60">
          {data.map((inv) => (
            <tr key={inv.id} className="hover:bg-carbon-850/10 transition-colors">
              <td className="px-6 py-3">
                <div className="font-sports font-bold text-white text-sm">{inv.producto?.nombre}</div>
                <div className="text-[9px] text-carbon-500 font-semibold mt-0.5">CÓD: {inv.producto?.codigoBarras || 'N/A'}</div>
              </td>
              <td className="px-6 py-3 text-zinc-300 font-semibold">{inv.producto?.edicionColeccion || 'N/A'}</td>
              {showSede && (
                <td className="px-6 py-3 font-sports font-bold text-neonCyan">
                  {inv.loteInversionista?.negocio?.nombre || 'General'}
                </td>
              )}
              <td className="px-6 py-3 text-center font-mono text-zinc-300">
                C: <span className="text-neonGreen font-bold">{inv.cantActualCajas ?? 0}</span> |{' '}
                U: <span className="text-white font-bold">{inv.cantActualUnidades ?? 0}</span>
              </td>
              <td className="px-6 py-3 text-right text-zinc-400 font-mono">
                {inv.costoCompraUnidad ? formatCOP(inv.costoCompraUnidad) : '-'}
              </td>
              <td className="px-6 py-3 text-center">
                <div className="flex justify-center items-center gap-2">
                  {onAbrirCaja && inv.cantActualCajas > 0 && (
                    <button
                      onClick={() => onAbrirCaja(inv.producto.id, inv.loteInversionista?.negocio?.id)}
                      title="Abrir Caja de Álbumes"
                      className="px-2 py-1 bg-neonGreen/10 hover:bg-neonGreen/20 text-neonGreen text-[10px] font-bold font-sports rounded-lg border border-neonGreen/20 transition-colors"
                    >
                      Abrir Caja
                    </button>
                  )}
                  <button
                    onClick={() => onEdit(inv.producto)}
                    className="p-1.5 hover:bg-carbon-800 rounded-lg text-neonCyan hover:text-neonCyan/80 transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => onDelete(inv.producto?.id)}
                    className="p-1.5 hover:bg-carbon-800 rounded-lg text-red-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AlbumesTable;
