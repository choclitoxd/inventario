import React from 'react';
import { Layers, Box, FileText, ShoppingBag } from 'lucide-react';

function InventarioTotales({ totales }) {
  const { totalPacas, totalCajas, totalSobres, totalCatalogo } = totales;

  const cards = [
    {
      label: 'Pacas en Sistema',
      value: totalPacas,
      icon: Layers,
      color: 'text-neonGreen',
      bgColor: 'bg-neonGreen/10',
      borderColor: 'border-neonGreen/20'
    },
    {
      label: 'Cajas en Sistema',
      value: totalCajas,
      icon: Box,
      color: 'text-neonCyan',
      bgColor: 'bg-neonCyan/10',
      borderColor: 'border-neonCyan/20'
    },
    {
      label: 'Sobres en Sistema',
      value: totalSobres,
      icon: FileText,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20'
    },
    {
      label: 'Catálogo Maestro',
      value: totalCatalogo,
      icon: ShoppingBag,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`glass-panel p-4 border ${card.borderColor} flex items-center justify-between shadow-md`}
          >
            <div>
              <p className="text-[10px] text-carbon-500 font-bold uppercase tracking-wider">
                {card.label}
              </p>
              <h4 className="text-2xl font-sports font-bold text-white mt-1">
                {card.value}
              </h4>
            </div>
            <div className={`p-2.5 rounded-xl ${card.bgColor} ${card.color}`}>
              <Icon size={20} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default InventarioTotales;
