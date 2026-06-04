import React from 'react';
import { ShoppingCart, Plus } from 'lucide-react';
import VentaDetalleRow from './VentaDetalleRow';

function LineasVenta({
  detalles,
  productos,
  inventarios,
  preciosSugeridos,
  handleBuscarCliente,
  handleAgregarFila,
  handleCambiarProducto,
  handleUpdateItem,
  handleUpdateComboComponent,
  handleRemoverFila,
  formatCOP
}) {
  return (
    <div className="glass-panel p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-carbon-800 pb-3">
        <h3 className="text-base font-sports font-bold text-white flex items-center gap-2">
          <ShoppingCart size={18} className="text-neonGreen" /> Líneas de Venta
        </h3>
        <button
          type="button"
          onClick={handleAgregarFila}
          className="neon-btn-green flex items-center gap-1 text-xs py-1.5"
        >
          <Plus size={14} /> Añadir Producto
        </button>
      </div>

      {detalles.length === 0 ? (
        <div className="p-8 text-center text-carbon-600 font-semibold border-2 border-dashed border-carbon-800 rounded-xl">
          No hay productos agregados. Haz clic en "Añadir Producto" para comenzar.
        </div>
      ) : (
        <div className="space-y-4">
          {detalles.map((item, idx) => (
            <VentaDetalleRow
              key={item.uid}
              idx={idx}
              item={item}
              productos={productos}
              inventarios={inventarios}
              preciosSugeridos={preciosSugeridos}
              handleCambiarProducto={handleCambiarProducto}
              handleUpdateItem={handleUpdateItem}
              handleUpdateComboComponent={handleUpdateComboComponent}
              handleRemoverFila={handleRemoverFila}
              formatCOP={formatCOP}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default LineasVenta;
