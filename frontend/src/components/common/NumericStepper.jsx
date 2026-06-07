import React from 'react';
import { Minus, Plus } from 'lucide-react';

function NumericStepper({ 
  value, 
  onChange, 
  min = 0, 
  max = 999999, 
  className = '' 
}) {
  const handleDecrement = () => {
    onChange(Math.max(min, value - 1));
  };

  const handleIncrement = () => {
    onChange(Math.min(max, value + 1));
  };

  const handleInputChange = (e) => {
    const val = parseInt(e.target.value) || 0;
    onChange(Math.max(min, Math.min(max, val)));
  };

  return (
    <div className={`flex items-center bg-carbon-950 border border-carbon-800 rounded-xl overflow-hidden focus-within:border-neonGreen/50 transition-all ${className}`}>
      <button
        type="button"
        onClick={handleDecrement}
        className="px-3 py-2 text-zinc-500 hover:text-white hover:bg-carbon-850 active:bg-carbon-800 transition-colors flex items-center justify-center border-r border-carbon-850 select-none"
      >
        <Minus size={12} />
      </button>
      <input
        type="number"
        value={value}
        onChange={handleInputChange}
        className="w-full text-center bg-transparent text-zinc-300 text-xs font-semibold focus:outline-none py-2 px-1 focus:ring-0 select-all"
        style={{ appearance: 'textfield', MozAppearance: 'textfield' }}
      />
      <button
        type="button"
        onClick={handleIncrement}
        className="px-3 py-2 text-zinc-500 hover:text-white hover:bg-carbon-850 active:bg-carbon-800 transition-colors flex items-center justify-center border-l border-carbon-850 select-none"
      >
        <Plus size={12} />
      </button>
    </div>
  );
}

export default NumericStepper;
