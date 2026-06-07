import React from 'react';
import { Package, Layers, ChevronRight } from 'lucide-react';
import { formatCurrency } from '../../../utils/format';

function ProductoCard({ groupedProduct, onAbrirCaja, onClickCard }) {
  const { producto, totalPacas, totalCajas, totalUnidades, lotes } = groupedProduct;

  // Determine product type based on exact backend enum values
  const isLaminas = producto.tipo === 'FRACCIONADO_LAMINAS';
  const isAlbumes = producto.tipo === 'FRACCIONADO_ALBUMES';
  const isUnidadSimple = producto.tipo === 'UNIDAD_SIMPLE';
  const hasCajas = totalCajas >= 1;

  // Calcular el impacto económico de su stock local actual
  const inversionTotalProducto = (lotes || []).reduce((sum, inv) => {
    const pacaCost = (inv.cantActualPacas || 0) * (inv.costoCompraPaca || 0);
    const cajaCost = isLaminas ? (inv.cantActualCajas || 0) * (inv.costoCompraCaja || 0) : 0;
    const unidadCost = (inv.cantActualUnidades || 0) * (inv.costoCompraUnidad || 0);
    return sum + pacaCost + cajaCost + unidadCost;
  }, 0);

  return (
    <div
      onClick={onClickCard}
      className="group relative bg-carbon-900/60 hover:bg-carbon-900 border border-carbon-800 hover:border-neonGreen/30 p-5 rounded-2xl shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between h-[13.5rem] overflow-hidden hover:shadow-neon-green/5"
    >
      {/* Background Micro-glow */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-neonGreen/5 rounded-full filter blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl border ${
              isLaminas ? 'bg-neonGreen/10 border-neonGreen/20 text-neonGreen' :
              isAlbumes ? 'bg-neonCyan/10 border-neonCyan/20 text-neonCyan' :
              'bg-purple-500/10 border-purple-500/20 text-purple-400'
            }`}>
              <Package size={18} />
            </div>
            <div>
              <h3 className="font-sports font-bold text-white text-base leading-tight group-hover:text-neonGreen transition-colors duration-300">
                {producto.nombre}
              </h3>
              <span className="text-[10px] text-carbon-500 font-semibold tracking-widest uppercase mt-0.5 inline-block">
                {isLaminas ? 'LÁMINAS' : isAlbumes ? 'ÁLBUMES' : 'MERCANCÍA'}
              </span>
            </div>
          </div>
          <ChevronRight size={16} className="text-carbon-600 group-hover:text-neonGreen group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>

      {/* Stock Levels */}
      <div className="my-3 flex-grow flex flex-col justify-center">
        <div className="text-xs text-carbon-400 font-medium mb-2">Existencias Totales:</div>
        
        {isLaminas && (
          <div className="grid grid-cols-5 items-center text-center">
            <div className="flex flex-col items-center">
              <span className="text-[9px] text-carbon-500 font-bold uppercase tracking-wider">Pacas</span>
              <span className="text-base font-mono font-bold text-white mt-0.5">{totalPacas}</span>
            </div>
            <div className="h-5 w-px bg-carbon-800 justify-self-center" />
            <div className="flex flex-col items-center">
              <span className="text-[9px] text-carbon-500 font-bold uppercase tracking-wider">Cajas</span>
              <span className={`text-base font-mono font-bold mt-0.5 ${totalCajas > 0 ? 'text-neonGreen font-extrabold' : 'text-white'}`}>{totalCajas}</span>
            </div>
            <div className="h-5 w-px bg-carbon-800 justify-self-center" />
            <div className="flex flex-col items-center">
              <span className="text-[9px] text-carbon-500 font-bold uppercase tracking-wider">Sobres</span>
              <span className="text-base font-mono font-bold text-white mt-0.5">{totalUnidades}</span>
            </div>
          </div>
        )}

        {isAlbumes && (
          <div className="grid grid-cols-3 items-center text-center">
            <div className="flex flex-col items-center">
              <span className="text-[9px] text-carbon-500 font-bold uppercase tracking-wider">Pacas</span>
              <span className="text-base font-mono font-bold text-white mt-0.5">{totalPacas}</span>
            </div>
            <div className="h-5 w-px bg-carbon-800 justify-self-center" />
            <div className="flex flex-col items-center">
                <span className="text-[9px] text-carbon-500 font-bold uppercase tracking-wider">ÁLBUMES</span>
                <span className="text-base font-mono font-bold text-white mt-0.5">{totalUnidades}</span>
            </div>
          </div>
        )}

        {isUnidadSimple && (
          <div className="flex items-center justify-between bg-carbon-950/40 border border-carbon-850/60 p-2.5 rounded-xl">
            <span className="text-[10px] text-carbon-500 font-bold uppercase tracking-wider">Existencias</span>
            <span className="text-sm font-mono font-bold text-neonGreen">
              {totalUnidades} <span className="text-[9px] text-carbon-450 font-sports uppercase">Unidades</span>
            </span>
          </div>
        )}
      </div>

      {/* Impacto Económico */}
      <div className="flex items-center justify-between text-[10px] font-semibold bg-carbon-950/40 border border-carbon-850/40 px-3 py-1.5 rounded-xl font-mono mb-2">
        <span className="text-carbon-500 uppercase font-sports">Inversión:</span>
        <span className="text-emerald-400 font-bold">{formatCurrency(inversionTotalProducto)}</span>
      </div>

      {/* Action Footer */}
      <div className="flex justify-between items-center pt-2 border-t border-carbon-800/60">
        <span className="text-[10px] text-carbon-550 font-bold uppercase tracking-wider group-hover:text-neonGreen transition-colors duration-300">
          Ver desglose por lotes
        </span>
        <ChevronRight size={14} className="text-carbon-600 group-hover:text-neonGreen group-hover:translate-x-0.5 transition-all" />
      </div>
    </div>
  );
}

export default ProductoCard;
