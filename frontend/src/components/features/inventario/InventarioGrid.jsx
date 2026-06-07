import React from 'react';
import ProductoCard from './ProductoCard';
import { Package } from 'lucide-react';

function InventarioGrid({ productosAgrupados, onSelectProduct, loading }) {
  if (loading) {
    return (
      <div className="p-12 text-center text-carbon-500 font-semibold flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-4 border-neonGreen border-t-transparent rounded-full animate-spin shadow-neon-green" />
        Cargando inventarios...
      </div>
    );
  }

  if (productosAgrupados.length === 0) {
    return (
      <div className="glass-panel p-12 text-center text-carbon-600 font-semibold flex flex-col items-center gap-3 border border-carbon-800 shadow-xl">
        <Package size={48} className="text-carbon-700 font-medium animate-pulse" />
        <span>No hay stock registrado en el sistema. Ingresa un nuevo lote para ver existencias.</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {productosAgrupados.map((groupedProduct) => (
        <ProductoCard
          key={groupedProduct.producto.id}
          groupedProduct={groupedProduct}
          onClickCard={() => onSelectProduct(groupedProduct)}
        />
      ))}
    </div>
  );
}

export default InventarioGrid;
