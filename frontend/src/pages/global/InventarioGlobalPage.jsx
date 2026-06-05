import React from 'react';
import useInventarioGlobal from '../../hooks/useInventarioGlobal';
import InventarioGlobal from '../../components/features/global/inventario/InventarioGlobal';
import { Boxes } from 'lucide-react';

function InventarioGlobalPage() {
  const {
    inventarioGlobal,
    totales,
    loading,
    error,
    successMsg,
    submitting,
    handleCrearProducto,
    handleEditarProducto,
    handleEliminarProducto,
    formatCOP
  } = useInventarioGlobal();

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-carbon-900 border border-carbon-800 p-4 rounded-2xl shadow-lg">
        <div>
          <h2 className="text-2xl font-sports font-bold text-white flex items-center gap-3">
            <Boxes className="text-neonCyan animate-pulse" /> Catálogo & Inventario Global
          </h2>
          <p className="text-xs text-carbon-500 font-medium">
            Gestión centralizada del catálogo maestro de productos y visualización del stock consolidado de todas las sedes
          </p>
        </div>
      </div>

      <InventarioGlobal
        inventarioGlobal={inventarioGlobal}
        totales={totales}
        loading={loading}
        error={error}
        successMsg={successMsg}
        submitting={submitting}
        onCrearProducto={handleCrearProducto}
        onEditarProducto={handleEditarProducto}
        onEliminarProducto={handleEliminarProducto}
        formatCOP={formatCOP}
      />
    </div>
  );
}

export default InventarioGlobalPage;
