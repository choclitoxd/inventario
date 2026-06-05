import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

function InventarioRow({ inv, onEdit, onDelete, formatCOP }) {
  const isComplejo = inv.producto?.tipo === 'FRACCIONADO_COMPLEJO';

  return (
    <tr className="hover:bg-carbon-850/10 transition-colors">
      <td className="px-6 py-3">
        <div className="font-sports font-bold text-white text-sm">{inv.producto?.nombre}</div>
        <div className="text-[9px] text-carbon-500 font-semibold mt-0.5">CÓD: {inv.producto?.codigoBarras || 'N/A'}</div>
      </td>
      <td className="px-6 py-3 text-zinc-300 font-semibold">{inv.producto?.edicionColeccion || 'N/A'}</td>
      <td className="px-6 py-3 font-sports font-bold text-neonCyan">{inv.loteInversionista?.negocio?.nombre || 'General'}</td>
      
      <td className="px-6 py-3 text-center font-mono text-zinc-300">
        {isComplejo ? (
          <span>
            P: <span className="text-white font-bold">{inv.cantActualPacas || 0}</span> |{' '}
            C: <span className="text-neonGreen font-bold">{inv.cantActualCajas || 0}</span> |{' '}
            S: <span className="text-white font-bold">{inv.cantActualUnidades || 0}</span>
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-neonGreen/10 text-neonGreen">
            {inv.cantActualUnidades || 0} U
          </span>
        )}
      </td>

      <td className="px-6 py-3 text-right text-zinc-400 font-mono">
        {isComplejo ? (
          <>
            <div>C: {inv.costoCompraCaja ? formatCOP(inv.costoCompraCaja) : '-'}</div>
            <div className="mt-0.5">U: {inv.costoCompraUnidad ? formatCOP(inv.costoCompraUnidad) : '-'}</div>
          </>
        ) : (
          <div>U: {inv.costoCompraUnidad ? formatCOP(inv.costoCompraUnidad) : '-'}</div>
        )}
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
  );
}

export default InventarioRow;
