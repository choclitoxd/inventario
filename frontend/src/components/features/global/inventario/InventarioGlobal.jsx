import React, { useState } from 'react';
import InventarioTotales from './InventarioTotales';
import ProductoForm from './ProductoForm';
import InventarioMaestroTable from './InventarioMaestroTable';
import EditarProductoModal from './EditarProductoModal';
import ErrorMessage from '../../../common/ErrorMessage';
import { Sparkles } from 'lucide-react';

function InventarioGlobal({
  inventarioGlobal,
  totales,
  loading,
  error,
  successMsg,
  submitting,
  onCrearProducto,
  onEditarProducto,
  onEliminarProducto,
  formatCOP
}) {
  const [editingProduct, setEditingProduct] = useState(null);

  return (
    <div className="space-y-6">
      {successMsg && (
        <div className="bg-neonGreen/10 border border-neonGreen/30 text-neonGreen p-4 rounded-xl flex items-center gap-3 animate-fadeIn shadow-neon-green/10">
          <Sparkles className="flex-shrink-0 animate-bounce" />
          <span className="text-sm font-semibold">{successMsg}</span>
        </div>
      )}

      <ErrorMessage message={error} />

      {/* Panel Superior de Totales Consolidados */}
      <InventarioTotales totales={totales} />

      {/* Formulario de Alta de Producto */}
      <ProductoForm onSubmit={onCrearProducto} loading={submitting} />

      {/* Tabla de Stock Consolidado Multisede */}
      <InventarioMaestroTable
        inventarioGlobal={inventarioGlobal}
        loading={loading}
        onEdit={setEditingProduct}
        onDelete={onEliminarProducto}
        formatCOP={formatCOP}
      />

      {/* Modal de Edición de Producto */}
      {editingProduct && (
        <EditarProductoModal
          producto={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={onEditarProducto}
          loading={submitting}
        />
      )}
    </div>
  );
}

export default InventarioGlobal;
