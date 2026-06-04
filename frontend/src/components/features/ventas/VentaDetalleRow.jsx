import React from 'react';
import { Trash2 } from 'lucide-react';
import DetalleIndividualConfig from './DetalleIndividualConfig';
import DetalleComboConfig from './DetalleComboConfig';

function VentaDetalleRow({
  idx,
  item,
  productos,
  inventarios,
  preciosSugeridos,
  handleCambiarProducto,
  handleUpdateItem,
  handleUpdateComboComponent,
  handleRemoverFila,
  formatCOP
}) {
  const s = preciosSugeridos[item.productoId] || { preciosPaca: [], preciosCaja: [], preciosUnidad: [] };

  return (
    <div className="bg-carbon-900 border border-carbon-800 p-4 rounded-xl space-y-3 relative">
      <button
        type="button"
        onClick={() => handleRemoverFila(idx)}
        className="absolute top-3 right-3 text-carbon-500 hover:text-red-500 transition-colors"
      >
        <Trash2 size={16} />
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 sm:pt-0">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-carbon-500">PRODUCTO</label>
          <select
            value={item.productoId}
            onChange={(e) => handleCambiarProducto(idx, e.target.value)}
            className="bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-neonGreen"
          >
            <option value="">Selecciona un producto</option>
            {productos.map(p => (
              <option key={p.id} value={p.id}>{p.nombre} ({p.tipo})</option>
            ))}
          </select>
        </div>

        {!item.esCombo && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-carbon-500">LOTE / STOCK ORIGEN</label>
            <select
              value={item.inventarioId}
              onChange={(e) => handleUpdateItem(idx, 'inventarioId', Number(e.target.value))}
              className="bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-neonGreen"
            >
              <option value="">Selecciona Lote (Stock)</option>
              {inventarios
                .filter(inv => inv.producto.id === item.productoId)
                .map(inv => (
                  <option key={inv.id} value={inv.id}>
                    {inv.loteInversionista.nombreLote} (Stock: P:{inv.cantActualPacas || 0} C:{inv.cantActualCajas || 0} U:{inv.cantActualUnidades || 0})
                  </option>
                ))}
            </select>
          </div>
        )}
      </div>

      {!item.esCombo && item.productoId > 0 && (
        <DetalleIndividualConfig
          idx={idx}
          item={item}
          sugerencias={s}
          handleUpdateItem={handleUpdateItem}
          formatCOP={formatCOP}
        />
      )}

      {item.esCombo && (
        <DetalleComboConfig
          idx={idx}
          item={item}
          inventarios={inventarios}
          handleUpdateItem={handleUpdateItem}
          handleUpdateComboComponent={handleUpdateComboComponent}
        />
      )}
    </div>
  );
}

export default VentaDetalleRow;
