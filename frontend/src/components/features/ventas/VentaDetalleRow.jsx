import React from 'react';
import { Trash2 } from 'lucide-react';
import DetalleIndividualConfig from './DetalleIndividualConfig';
import DetalleComboConfig from './DetalleComboConfig';
import CustomSelect from '../../common/CustomSelect';

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

  const productOptions = productos.map(p => ({
    value: p.id.toString(),
    label: `${p.nombre} (${p.tipo})`
  }));

  const inventarioOptions = inventarios
    .filter(inv => inv.producto.id === item.productoId)
    .map(inv => ({
      value: inv.id.toString(),
      label: `${inv.loteInversionista.nombreLote} (P:${inv.cantActualPacas || 0} C:${inv.cantActualCajas || 0} U:${inv.cantActualUnidades || 0})`
    }));

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
          <CustomSelect
            options={productOptions}
            value={item.productoId ? item.productoId.toString() : ''}
            onChange={(val) => handleCambiarProducto(idx, val)}
            placeholder="Selecciona un producto"
          />
        </div>

        {!item.esCombo && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-carbon-500">LOTE / STOCK ORIGEN</label>
            <CustomSelect
              options={inventarioOptions}
              value={item.inventarioId ? item.inventarioId.toString() : ''}
              onChange={(val) => handleUpdateItem(idx, 'inventarioId', Number(val))}
              placeholder="Selecciona Lote (Stock)"
            />
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
