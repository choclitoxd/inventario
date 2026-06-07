import React, { useState } from 'react';
import useInventario from '../hooks/useInventario';
import ConversionGuide from '../components/features/inventario/ConversionGuide';
import InventarioGrid from '../components/features/inventario/InventarioGrid';
import LotesDesgloseModal from '../components/features/inventario/LotesDesgloseModal';
import VincularProductoModal from '../components/features/inventario/VincularProductoModal';
import EditarInventarioModal from '../components/features/inventario/EditarInventarioModal';
import ErrorMessage from '../components/common/ErrorMessage';
import KpiCard from '../components/common/KpiCard';
import { Package, Sparkles, Plus } from 'lucide-react';

function InventarioPage({ currentUser }) {
  const {
    productosAgrupados,
    productos,
    lotes,
    loading,
    error,
    successMsg,
    handleDesglosar,
    handleVincularProducto,
    handleActualizarInventario,
    handleEliminarInventario,
    fetchProductosAndLotes,
    formatCOP,
    inversionTotalVal
  } = useInventario();

  const [selectedProductId, setSelectedProductId] = useState(null);
  const [showVincularModal, setShowVincularModal] = useState(false);
  const [editingInventario, setEditingInventario] = useState(null);

  // Buscar el producto activo de la lista actualizada para refrescar existencias al operar dentro del modal
  const activeProduct = productosAgrupados.find(
    (p) => p.producto.id === selectedProductId
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-carbon-900 border border-carbon-800 p-4 rounded-2xl shadow-lg">
        <div>
          <h2 className="text-2xl font-sports font-bold text-white flex items-center gap-3">
            <Package className="text-neonGreen" /> Inventario de Mercancía Físico
          </h2>
          <p className="text-xs text-carbon-500 font-medium">
            Gestión flexible de stock real por niveles (Pacas, Cajas, Sobres/Unidades)
          </p>
          {currentUser?.rol === 'DUENO' && (
            <p className="text-sm font-mono text-emerald-400 font-bold mt-1.5 animate-fadeIn">
              Valor Total Stock: {formatCOP(inversionTotalVal)}
            </p>
          )}
        </div>
        {currentUser?.rol === 'DUENO' && (
          <button
            onClick={() => setShowVincularModal(true)}
            className="flex items-center gap-2 bg-neonGreen hover:bg-neonGreen/80 text-black px-4 py-2 rounded-xl text-xs font-sports font-bold tracking-wider transition-all shadow-md shadow-neonGreen/10"
          >
            <Plus size={16} />
            Agregar Producto a Sede
          </button>
        )}
      </div>

      {/* Info Boxes: Conversion Rules */}
      <ConversionGuide />

      {successMsg && (
        <div className="bg-neonGreen/10 border border-neonGreen/30 text-neonGreen p-4 rounded-xl flex items-center gap-3 animate-fadeIn shadow-neon-green">
          <Sparkles className="flex-shrink-0 animate-bounce" />
          <span className="text-sm font-semibold">{successMsg}</span>
        </div>
      )}

      <ErrorMessage message={error} />

      {/* Main Stock Cards Grid */}
      <InventarioGrid
        productosAgrupados={productosAgrupados}
        loading={loading}
        onSelectProduct={(p) => setSelectedProductId(p.producto.id)}
      />

      {/* Lot Breakdown Modal */}
      {activeProduct && (
        <LotesDesgloseModal
          groupedProduct={activeProduct}
          currentUser={currentUser}
          onClose={() => setSelectedProductId(null)}
          onDesglosar={handleDesglosar}
          onEditClick={(inv) => setEditingInventario(inv)}
          onDeleteClick={async (id) => {
            if (window.confirm("¿Estás seguro de que deseas desvincular este producto de la sede? Se perderán las existencias locales.")) {
              try {
                await handleEliminarInventario(id);
                setSelectedProductId(null); // Close modal
              } catch (err) {
                // error is handled by hooks
              }
            }
          }}
          formatCOP={formatCOP}
        />
      )}

      {/* Vincular Producto Modal */}
      <VincularProductoModal
        isOpen={showVincularModal}
        onClose={() => setShowVincularModal(false)}
        onVincular={handleVincularProducto}
        productos={productos}
        lotes={lotes}
        fetchProductosAndLotes={fetchProductosAndLotes}
      />

      {/* Editar Inventario Modal */}
      <EditarInventarioModal
        isOpen={!!editingInventario}
        onClose={() => setEditingInventario(null)}
        onSave={handleActualizarInventario}
        inventario={editingInventario}
      />
    </div>
  );
}

export default InventarioPage;
