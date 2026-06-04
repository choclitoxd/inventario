import React from 'react';
import { Tag } from 'lucide-react';

function DetalleComboConfig({
  idx,
  item,
  inventarios,
  handleUpdateItem,
  handleUpdateComboComponent
}) {
  return (
    <div className="bg-carbon-950 p-4 rounded-xl space-y-3 border border-carbon-800">
      <h4 className="text-xs font-sports font-bold text-neonCyan flex items-center gap-1.5">
        <Tag size={12} /> Componentes del Combo & Origen de Lote
      </h4>
      
      <div className="grid grid-cols-2 gap-3 border-b border-carbon-800 pb-3">
        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-bold text-carbon-500">CANTIDAD DE COMBOS A VENDER</label>
          <input
            type="number"
            min="1"
            value={item.cantidadUnidades || 0}
            onChange={(e) => handleUpdateItem(idx, 'cantidadUnidades', Number(e.target.value))}
            className="bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-1.5 text-xs text-zinc-100 focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-bold text-carbon-500">PRECIO DE VENTA TOTAL DEL COMBO</label>
          <input
            type="number"
            min="0"
            value={item.precioVentaUnidad || 0}
            onChange={(e) => handleUpdateItem(idx, 'precioVentaUnidad', Number(e.target.value))}
            className="bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-1.5 text-xs text-zinc-100 focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-2 mt-2">
        {item.componentesCombo?.map((comp, compIdx) => (
          <div key={compIdx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs p-2 bg-carbon-900 rounded-lg">
            <div>
              <span className="font-semibold text-white">{comp.productoNombre}</span>
              <span className="text-[10px] text-carbon-500 font-medium block">
                Requiere: {comp.cantidadPacas ? `${comp.cantidadPacas} Pacas ` : ''}
                {comp.cantidadCajas ? `${comp.cantidadCajas} Cajas ` : ''}
                {comp.cantidadUnidades ? `${comp.cantidadUnidades} Unids ` : ''}
                (por combo)
              </span>
            </div>

            <div className="w-full sm:w-56">
              <select
                value={comp.inventarioId}
                onChange={(e) => handleUpdateComboComponent(idx, compIdx, 'inventarioId', Number(e.target.value))}
                className="w-full bg-carbon-800 border border-carbon-700 rounded-lg px-2 py-1 text-xs text-zinc-100 focus:outline-none focus:border-neonGreen"
              >
                <option value="">Lote Origen Componente</option>
                {inventarios
                  .filter(inv => inv.producto.id === comp.productoId)
                  .map(inv => (
                    <option key={inv.id} value={inv.id}>
                      {inv.loteInversionista.nombreLote} (Stock: P:{inv.cantActualPacas || 0} C:{inv.cantActualCajas || 0} U:{inv.cantActualUnidades || 0})
                    </option>
                  ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DetalleComboConfig;
