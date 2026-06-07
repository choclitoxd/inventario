import React from 'react';
import { Edit2, Trash2, Tag } from 'lucide-react';

function UnidadesTable({ data, loading, onEdit, onDelete, formatCOP, showSede }) {
  if (loading) {
    return (
      <div className="p-12 text-center text-carbon-500 font-semibold flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-4 border-neonGreen border-t-transparent rounded-full animate-spin shadow-neon-green" />
        Cargando unidades...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="p-12 text-center text-carbon-600 font-semibold flex flex-col items-center gap-3">
        <Tag size={48} className="text-carbon-700 font-medium" />
        <span>No se encontraron otros productos en el stock.</span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="bg-carbon-900 border-b border-carbon-800 text-[10px] font-bold text-carbon-500 tracking-wider font-sports">
            <th className="px-6 py-3">PRODUCTO</th>
            {showSede && <th className="px-6 py-3">SEDE</th>}
            <th className="px-6 py-3 text-center">STOCK GENERAL [U]</th>
            <th className="px-6 py-3 text-right">COSTO COMPRA</th>
            <th className="px-6 py-3 text-right">PRECIO SUGERIDO</th>
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
              {showSede && (
                <td className="px-6 py-3 font-sports font-bold text-neonCyan">
                  {inv.loteInversionista?.negocio?.nombre || 'General'}
                </td>
              )}
              <td className="px-6 py-3 text-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-neonCyan/10 text-neonCyan">
                  {inv.cantActualUnidades ?? 0} U
                </span>
              </td>
              <td className="px-6 py-3 text-right text-zinc-400 font-mono">
                {inv.costoCompraUnidad ? formatCOP(inv.costoCompraUnidad) : '-'}
              </td>
              <td className="px-6 py-3 text-right text-zinc-400 font-mono">
                {inv.producto?.precioSugeridoDefecto ? formatCOP(inv.producto.precioSugeridoDefecto) : '-'}
              </td>
              <td className="px-6 py-3 text-center">
                <div className="flex justify-center gap-2">
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

export default UnidadesTable;

