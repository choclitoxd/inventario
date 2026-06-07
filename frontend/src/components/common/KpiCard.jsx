import React from 'react';

function KpiCard({ title, value, subtext, icon: Icon, accentColor = 'green', glowColor = 'rgba(57, 255, 20, 0.05)', valueClass = 'font-sports font-bold text-white' }) {
  // Configurar clases dinámicas de neón y colores
  const colorMap = {
    green: {
      text: 'text-neonGreen',
      bgIcon: 'bg-neonGreen/10 text-neonGreen',
      badge: 'text-neonGreen',
      border: 'hover:border-neonGreen/30',
      glow: 'rgba(57, 255, 20, 0.05)'
    },
    cyan: {
      text: 'text-neonCyan',
      bgIcon: 'bg-neonCyan/10 text-neonCyan',
      badge: 'text-neonCyan',
      border: 'hover:border-neonCyan/30',
      glow: 'rgba(0, 229, 255, 0.05)'
    },
    red: {
      text: 'text-red-500',
      bgIcon: 'bg-red-500/10 text-red-500',
      badge: 'text-red-500',
      border: 'hover:border-red-500/30',
      glow: 'rgba(239, 68, 68, 0.05)'
    }
  };

  const selectedColor = colorMap[accentColor] || colorMap.green;

  return (
    <div 
      className={`glass-panel p-5 relative overflow-hidden group border border-carbon-800 transition-all duration-300 ${selectedColor.border}`}
      style={{ boxShadow: `0 4px 30px rgba(0, 0, 0, 0.1), inset 0 0 10px ${selectedColor.glow}` }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold tracking-wider text-carbon-500 uppercase">{title}</span>
        <div className={`p-2 rounded-xl transition-all duration-300 ${selectedColor.bgIcon}`}>
          <Icon size={18} />
        </div>
      </div>
      <h3 className={`text-2xl ${valueClass}`}>{value}</h3>
      <span className={`text-xs font-semibold flex items-center gap-1 mt-2 ${selectedColor.text}`}>
        {subtext}
      </span>
      <div 
        className="absolute right-0 bottom-0 w-24 h-24 rounded-full blur-2xl transition-all duration-300 opacity-20 group-hover:opacity-30"
        style={{ 
          background: accentColor === 'green' ? '#39FF14' : accentColor === 'cyan' ? '#00E5FF' : '#EF4444' 
        }}
      />
    </div>
  );
}

export default KpiCard;
