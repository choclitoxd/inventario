import React from 'react';
import { ArrowRightLeft, Layers, Info } from 'lucide-react';

function ConversionGuide() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Laminas Conversions */}
      <div className="glass-panel p-4 border-l-4 border-l-neonGreen flex items-start gap-4">
        <div className="bg-neonGreen/10 p-2 rounded-xl text-neonGreen">
          <ArrowRightLeft size={20} />
        </div>
        <div>
          <h4 className="text-sm font-sports font-bold text-white">Desglose de Láminas / Sobres</h4>
          <ul className="text-xs text-carbon-500 font-medium mt-1.5 space-y-1 list-disc list-inside">
            <li>1 Paca = 10 Cajas</li>
            <li>1 Caja = 104 Sobres</li>
          </ul>
        </div>
      </div>

      {/* Album Conversions */}
      <div className="glass-panel p-4 border-l-4 border-l-neonCyan flex items-start gap-4">
        <div className="bg-neonCyan/10 p-2 rounded-xl text-neonCyan">
          <Layers size={20} />
        </div>
        <div>
          <h4 className="text-sm font-sports font-bold text-white">Desglose de Álbumes</h4>
          <ul className="text-xs text-carbon-500 font-medium mt-1.5 space-y-1 list-disc list-inside">
            <li>1 Paca = 26 Álbumes sueltos</li>
          </ul>
        </div>
      </div>

      {/* Inventory flexible warning */}
      <div className="glass-panel p-4 border-l-4 border-l-yellow-500 flex items-start gap-4">
        <div className="bg-yellow-500/10 p-2 rounded-xl text-yellow-500">
          <Info size={20} />
        </div>
        <div>
          <h4 className="text-sm font-sports font-bold text-white">Gestión de Stock Físico</h4>
          <p className="text-xs text-carbon-500 font-medium mt-1.5 leading-relaxed">
            Las unidades físicas no se auto-desglosan solas al vender. Usa la acción de abrir caja o paca para cambiar la forma física del producto.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ConversionGuide;
