import React from 'react';

function PrecioSugeridoButtons({ precios, onSelect, formatCOP }) {
  if (!precios || precios.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {precios.map((p, idx) => (
        <button
          key={idx}
          type="button"
          onClick={() => onSelect(Number(p))}
          className="text-[8px] bg-carbon-800 hover:bg-neonGreen hover:text-black border border-carbon-700 rounded px-1 text-carbon-400 font-semibold transition-all"
        >
          {formatCOP(p)}
        </button>
      ))}
    </div>
  );
}

export default PrecioSugeridoButtons;
