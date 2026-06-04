import React from 'react';
import { Package, Layers, ChevronRight } from 'lucide-react';

function ProductoCard({ groupedProduct, onAbrirCaja, onClickCard }) {
  const { producto, totalPacas, totalCajas, totalUnidades } = groupedProduct;

  const isLaminas = producto.tipo === 'LAMINAS';
  const hasCajas = totalCajas >= 1;

  return (
    <div
      onClick={onClickCard}
      className="group relative bg-carbon-900/60 hover:bg-carbon-900 border border-carbon-800 hover:border-neonGreen/30 p-5 rounded-2xl shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between h-48 overflow-hidden hover:shadow-neon-green/5"
    >
      {/* Background Micro-glow */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-neonGreen/5 rounded-full filter blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl border ${
              producto.tipo === 'LAMINAS' ? 'bg-neonGreen/10 border-neonGreen/20 text-neonGreen' :
              producto.tipo === 'ALBUM' ? 'bg-neonCyan/10 border-neonCyan/20 text-neonCyan' :
              'bg-purple-500/10 border-purple-500/20 text-purple-400'
            }`}>
              <Package size={18} />
            </div>
            <div>
              <h3 className="font-sports font-bold text-white text-base leading-tight group-hover:text-neonGreen transition-colors duration-300">
                {producto.nombre}
              </h3>
              <span className="text-[10px] text-carbon-500 font-semibold tracking-widest uppercase mt-0.5 inline-block">
                {producto.tipo}
              </span>
            </div>
          </div>
          <ChevronRight size={16} className="text-carbon-600 group-hover:text-neonGreen group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>

      {/* Stock Levels */}
      <div className="my-3">
        <div className="text-xs text-carbon-400 font-medium mb-1">Existencias Totales:</div>
        <div className="flex items-center gap-4">
          {/* Pacas */}
          <div className="flex flex-col">
            <span className="text-[10px] text-carbon-500 font-bold uppercase tracking-wider">Pacas</span>
            <span className="text-base font-sports font-bold text-white mt-0.5">
              {totalPacas}
            </span>
          </div>
          <div className="h-6 w-px bg-carbon-800" />
          {/* Cajas */}
          <div className="flex flex-col">
            <span className="text-[10px] text-carbon-500 font-bold uppercase tracking-wider">Cajas</span>
            <span className={`text-base font-sports font-bold mt-0.5 ${totalCajas > 0 ? 'text-neonGreen font-extrabold' : 'text-white'}`}>
              {totalCajas}
            </span>
          </div>
          <div className="h-6 w-px bg-carbon-800" />
          {/* Unidades/Sobres */}
          <div className="flex flex-col">
            <span className="text-[10px] text-carbon-500 font-bold uppercase tracking-wider">
              {isLaminas ? 'Sobres' : 'Unidades'}
            </span>
            <span className="text-base font-sports font-bold text-white mt-0.5">
              {totalUnidades}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex justify-between items-center pt-2 border-t border-carbon-800/60">
        <span className="text-[10px] text-carbon-500 font-semibold hover:text-carbon-300 transition-colors">
          Ver desglose por lotes
        </span>
        {isLaminas && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAbrirCaja(producto.id);
            }}
            disabled={!hasCajas}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-sports font-bold text-[10px] tracking-wide transition-all duration-300 ${
              hasCajas
                ? 'bg-carbon-800 hover:bg-neonGreen hover:text-black border-neonGreen/40 hover:border-neonGreen hover:shadow-neon-green/20'
                : 'bg-carbon-900/40 border-carbon-800 text-carbon-600 cursor-not-allowed'
            }`}
          >
            <Layers size={12} />
            Abrir Caja
          </button>
        )}
      </div>
    </div>
  );
}

export default ProductoCard;
