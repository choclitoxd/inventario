import React from 'react';
import { Layers, ArrowRight } from 'lucide-react';

function NegocioGrid({ negocios, onSelect }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {negocios.map((n) => (
        <button
          key={n.id}
          onClick={() => onSelect(n)}
          className="glass-card p-6 flex flex-col justify-between items-start text-left hover:scale-[1.03] hover:shadow-neon-cyan/10 hover:shadow-xl group transition-all duration-300 relative overflow-hidden"
        >
          {/* Efecto de resplandor neón dentro de la tarjeta */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-neonCyan/5 rounded-full blur-xl pointer-events-none group-hover:bg-neonCyan/10 transition-all duration-300" />
          
          <div className="w-full flex justify-between items-center mb-4">
            <div className="p-2.5 bg-carbon-900 border border-carbon-700/60 rounded-xl group-hover:border-neonCyan/50 transition-colors">
              <Layers size={18} className="text-neonCyan" />
            </div>
            <ArrowRight size={16} className="text-carbon-500 group-hover:text-neonCyan group-hover:translate-x-1 transition-all duration-300" />
          </div>

          <div>
            <h3 className="text-lg font-sports font-bold text-white group-hover:text-neonCyan transition-colors">
              {n.nombre}
            </h3>
            <span className="text-[9px] font-bold text-carbon-500 tracking-wider uppercase mt-1 block">
              Sede ID: {n.id}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}

export default NegocioGrid;
