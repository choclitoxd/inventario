import React, { useState } from 'react';
import useInventario from '../hooks/useInventario';
import ConversionGuide from '../components/features/inventario/ConversionGuide';
import InventarioGrid from '../components/features/inventario/InventarioGrid';
import LotesDesgloseModal from '../components/features/inventario/LotesDesgloseModal';
import ErrorMessage from '../components/common/ErrorMessage';
import { Package, Sparkles } from 'lucide-react';

function InventarioPage() {
  const {
    productosAgrupados,
    loading,
    error,
    successMsg,
    handleAbrirCaja,
    handleAbrirPacaLaminas,
    handleAbrirPacaAlbumes,
    formatCOP
  } = useInventario();

  const [selectedProductId, setSelectedProductId] = useState(null);

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
        </div>
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
        onAbrirCaja={handleAbrirCaja}
        onSelectProduct={(p) => setSelectedProductId(p.producto.id)}
      />

      {/* Lot Breakdown Modal */}
      {activeProduct && (
        <LotesDesgloseModal
          groupedProduct={activeProduct}
          onClose={() => setSelectedProductId(null)}
          onAbrirCaja={handleAbrirCaja}
          onAbrirPacaLaminas={handleAbrirPacaLaminas}
          onAbrirPacaAlbumes={handleAbrirPacaAlbumes}
          formatCOP={formatCOP}
        />
      )}
    </div>
  );
}

export default InventarioPage;
