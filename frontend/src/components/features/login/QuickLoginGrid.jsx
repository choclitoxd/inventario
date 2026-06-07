import React from 'react';

const quickUsers = [
  { username: 'donato', nombre: 'Donato', rol: 'ADMIN', color: 'border-neonGreen text-neonGreen bg-neonGreen/10' },
  { username: 'giank', nombre: 'Giank', rol: 'DUENO', color: 'border-neonCyan text-neonCyan bg-neonCyan/10' },
  { username: 'vector', nombre: 'Vector', rol: 'ORGANIZADOR', color: 'border-purple-500 text-purple-400 bg-purple-500/10' },
  { username: 'chefcito', nombre: 'Chefcito', rol: 'ORGANIZADOR', color: 'border-amber-500 text-amber-400 bg-amber-500/10' }
];

function QuickLoginGrid({ onSelectQuickUser }) {
  return (
    <div className="mt-8 border-t border-carbon-800 pt-6">
      <span className="text-[10px] font-bold text-carbon-500 tracking-wider block text-center mb-3.5 uppercase">
        Acceso Rápido (Usuarios de Prueba)
      </span>
      <div className="grid grid-cols-2 gap-2">
        {quickUsers.map((u) => (
          <button
            key={u.username}
            type="button"
            onClick={() => onSelectQuickUser(u)}
            className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all duration-200 ${u.color} hover:scale-105 hover:shadow-md text-center`}
          >
            <span className="text-xs font-sports font-bold">{u.nombre}</span>
            <span className="text-[8px] opacity-75 font-semibold tracking-wider mt-0.5">{u.rol}</span>
          </button>
        ))}
      </div>
      <span className="text-[9px] text-carbon-500 text-center block mt-3 font-medium">
        Contraseña por defecto: <span className="text-zinc-400 font-bold">123456</span>
      </span>
    </div>
  );
}

export default QuickLoginGrid;
