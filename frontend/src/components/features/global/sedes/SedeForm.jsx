import React from 'react';
import { Plus, Users } from 'lucide-react';

function SedeForm({
  nombreSede,
  setNombreSede,
  selectedJefesIds,
  setSelectedJefesIds,
  jefesOnly,
  handleCreateSede,
  loading
}) {
  const toggleJefe = (id) => {
    if (selectedJefesIds.includes(id)) {
      setSelectedJefesIds(selectedJefesIds.filter(u => u !== id));
    } else {
      setSelectedJefesIds([...selectedJefesIds, id]);
    }
  };

  return (
    <div className="glass-panel p-6 border border-carbon-800 space-y-4">
      <h3 className="text-base font-sports font-bold text-white flex items-center gap-2 border-b border-carbon-800 pb-3">
        <Plus size={18} className="text-neonCyan" /> Registrar Nueva Sede
      </h3>

      <form onSubmit={handleCreateSede} className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-carbon-500 uppercase tracking-wider">Nombre de la Sede</label>
          <input
            type="text"
            placeholder="Ej. Panini Cali"
            value={nombreSede}
            onChange={(e) => setNombreSede(e.target.value)}
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

        <button
          type="submit"
          disabled={loading}
          className={`w-full text-center py-2.5 rounded-xl font-sports font-bold text-xs tracking-wider transition-all duration-300 ${
            loading
              ? 'bg-carbon-800 text-carbon-600 border-carbon-700 cursor-not-allowed'
              : 'neon-btn-cyan shadow-neon-cyan'
          }`}
        >
          {loading ? 'REGISTRANDO...' : 'INGRESAR NUEVA SEDE'}
        </button>
      </form>
    </div>
  );
}

export default SedeForm;
