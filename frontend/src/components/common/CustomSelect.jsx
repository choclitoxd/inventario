import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

function CustomSelect({ 
  options, 
  value, 
  onChange, 
  placeholder = 'Seleccionar...', 
  className = '' 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedOption = options.find(opt => opt.value?.toString() === value?.toString());

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  // Helper para traducir y renderizar los enums técnicos del backend en badges estilizados
  const renderBadgeOrText = (text) => {
    if (typeof text !== 'string') return text;

    const lower = text.toLowerCase();
    
    // Mapeo e inyección de badges estilizados
    if (text.includes('FRACCIONADO_ALBUMES') || text === 'FRACCIONADO_ALBUMES') {
      const clean = text.replace('FRACCIONADO_ALBUMES', '').replace(/\(\s*\)/, '').trim();
      return (
        <span className="flex items-center gap-1.5">
          {clean && <span>{clean}</span>}
          <span className="bg-neonCyan/10 text-neonCyan border border-neonCyan/20 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase font-sports">Álbumes</span>
        </span>
      );
    }
    if (text.includes('FRACCIONADO_LAMINAS') || text === 'FRACCIONADO_LAMINAS') {
      const clean = text.replace('FRACCIONADO_LAMINAS', '').replace(/\(\s*\)/, '').trim();
      return (
        <span className="flex items-center gap-1.5">
          {clean && <span>{clean}</span>}
          <span className="bg-neonGreen/10 text-neonGreen border border-neonGreen/20 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase font-sports">Láminas</span>
        </span>
      );
    }
    if (text.includes('UNIDAD_SIMPLE') || text === 'UNIDAD_SIMPLE') {
      const clean = text.replace('UNIDAD_SIMPLE', '').replace(/\(\s*\)/, '').trim();
      return (
        <span className="flex items-center gap-1.5">
          {clean && <span>{clean}</span>}
          <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase font-sports">Simple</span>
        </span>
      );
    }
    if (text.includes('DUENO_A') || text === 'DUENO_A') {
      const clean = text.replace('DUENO_A', '').replace(/\(\s*\)/, '').trim();
      return (
        <span className="flex items-center gap-1.5">
          {clean && <span>{clean}</span>}
          <span className="bg-neonGreen/10 text-neonGreen border border-neonGreen/20 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase font-sports">Dueño A</span>
        </span>
      );
    }
    if (text.includes('DUENO_B') || text === 'DUENO_B') {
      const clean = text.replace('DUENO_B', '').replace(/\(\s*\)/, '').trim();
      return (
        <span className="flex items-center gap-1.5">
          {clean && <span>{clean}</span>}
          <span className="bg-neonCyan/10 text-neonCyan border border-neonCyan/20 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase font-sports">Dueño B</span>
        </span>
      );
    }
    if (text.includes('INVERSIONISTA_EXTERNO') || text === 'INVERSIONISTA_EXTERNO') {
      const clean = text.replace('INVERSIONISTA_EXTERNO', '').replace(/\(\s*\)/, '').trim();
      return (
        <span className="flex items-center gap-1.5">
          {clean && <span>{clean}</span>}
          <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase font-sports">Externo</span>
        </span>
      );
    }

    // Mapeos planos sencillos para textos exactos
    if (text === 'FLETE') return 'Flete / Envío';
    if (text === 'ALIMENTACION') return 'Alimentación';
    if (text === 'TRANSPORTE') return 'Transporte';
    if (text === 'OTROS') return 'Otros Gastos';

    return text;
  };

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      {/* Trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-carbon-950 border border-carbon-800 focus-within:border-neonGreen/80 hover:border-carbon-700 rounded-xl px-3 py-2.5 text-xs font-medium text-zinc-300 cursor-pointer transition-all select-none"
      >
        <span className={selectedOption ? 'text-zinc-200' : 'text-zinc-500'}>
          {selectedOption ? renderBadgeOrText(selectedOption.label) : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`text-zinc-500 transition-transform duration-200 ${isOpen ? 'rotate-180 text-neonGreen' : ''}`}
        />
      </div>

      {/* Popover / Options List */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-1 w-full z-50 bg-carbon-900 border border-carbon-800/80 rounded-xl shadow-2xl backdrop-blur-md overflow-hidden max-h-60 overflow-y-auto animate-fadeIn select-none">
          <div className="py-1">
            {options.length === 0 ? (
              <div className="px-3 py-2 text-xs text-zinc-500 italic">No hay opciones disponibles</div>
            ) : (
              options.map((option) => {
                const isSelected = option.value?.toString() === value?.toString();
                return (
                  <div
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={`px-3 py-2 text-xs cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-carbon-800/80 text-white font-medium'
                        : 'text-zinc-400 hover:bg-carbon-800/60 hover:text-white'
                    }`}
                  >
                    {renderBadgeOrText(option.label)}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomSelect;
