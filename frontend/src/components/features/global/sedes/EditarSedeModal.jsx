import React, { useState, useEffect } from 'react';
import { X, Users, Save } from 'lucide-react';

function EditarSedeModal({
  isOpen,
  sede,
  onClose,
  onSave,
  jefesOnly,
  loading
}) {
  const [nombre, setNombre] = useState('');
  const [selectedJefesIds, setSelectedJefesIds] = useState([]);

  useEffect(() => {
    if (sede) {
      setNombre(sede.nombre || '');
      setSelectedJefesIds(sede.duenoIds || []);
    }
  }, [sede]);

  if (!isOpen || !sede) return null;

  const toggleJefe = (id) => {
    if (selectedJefesIds.includes(id)) {
      setSelectedJefesIds(selectedJefesIds.filter(u => u !== id));
    } else {
      setSelectedJefesIds([...selectedJefesIds, id]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(sede.id, nombre, selectedJefesIds);
  };

  return (
    <div className="fixed inset-0 bg-carbon-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-md p-6 border border-carbon-800 space-y-4 relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-carbon-500 hover:text-white transition-colors"
          type="button"
        >
          <X size={18} />
        </button>

        <h3 className="text-base font-sports font-bold text-white flex items-center gap-2 border-b border-carbon-800 pb-3">
          <Users size={18} className="text-neonCyan" /> Editar Sede: {sede.nombre}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-carbon-500 uppercase tracking-wider">Nombre de la Sede</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-neonCyan w-full font-semibold"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-carbon-500 uppercase tracking-wider flex items-center gap-1.5">
              <Users size={12} /> Socios / Dueños Asignados
            </label>
            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {jefesOnly.map(u => {
                const isSelected = selectedJefesIds.includes(u.id);
                return (
                  <label
                    key={u.id}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'bg-neonCyan/10 border-neonCyan/50 text-white'
                        : 'bg-carbon-800 border-carbon-700 text-carbon-400 hover:text-zinc-100 hover:border-carbon-600'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleJefe(u.id)}
                      className="rounded bg-carbon-900 border-carbon-700 text-neonCyan focus:ring-neonCyan focus:ring-offset-0 focus:outline-none w-4 h-4"
                    />
                    <div className="flex-1 flex justify-between items-center min-w-0">
                      <span className="truncate">{u.nombre} <span className="text-carbon-500 font-normal">(@{u.username})</span></span>
                      <span className="text-[9px] uppercase font-bold text-carbon-500 font-mono tracking-widest">{u.rol}</span>
                    </div>
                  </label>
                );
              })}
              {jefesOnly.length === 0 && (
                <span className="text-[10px] text-carbon-600 font-semibold italic">No hay jefes registrados en el sistema.</span>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-carbon-800 hover:bg-carbon-700 border border-carbon-700 text-zinc-300 font-sports font-bold text-xs py-2.5 rounded-xl transition-all duration-300"
            >
              CANCELAR
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 text-center py-2.5 rounded-xl font-sports font-bold text-xs tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 ${
                loading
                  ? 'bg-carbon-800 text-carbon-600 border-carbon-700 cursor-not-allowed'
                  : 'neon-btn-cyan shadow-neon-cyan'
              }`}
            >
              <Save size={14} />
              {loading ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditarSedeModal;
