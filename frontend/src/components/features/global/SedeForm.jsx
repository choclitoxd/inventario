import React from 'react';
import { Layers, PlusCircle } from 'lucide-react';

function SedeForm({
  negocioNombre,
  setNegocioNombre,
  negocioLoading,
  negocioSuccess,
  negocioError,
  onCreateNegocio,
  negociosList
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateNegocio(negocioNombre);
  };

  return (
    <div className="glass-panel p-6 border border-carbon-800 space-y-6">
      <div className="flex items-center gap-2 pb-4 border-b border-carbon-800">
        <Layers className="text-neonCyan" size={20} />
        <h2 className="text-base font-sports font-bold text-white uppercase tracking-wider">CREAR NUEVO NEGOCIO / SEDE</h2>
      </div>

      {negocioSuccess && (
        <div className="bg-neonGreen/10 border border-neonGreen/45 text-neonGreen p-3.5 rounded-xl text-xs font-semibold">
          ¡Negocio creado con éxito! Ya está disponible para asignación.
        </div>
      )}
      
      {negocioError && (
        <div className="bg-red-950/40 border border-red-500/50 text-red-200 p-3.5 rounded-xl text-xs font-semibold">
          {negocioError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-carbon-400 tracking-wider">NOMBRE DEL NEGOCIO / SEDE</label>
          <input
            type="text"
            placeholder="Ej: Panini Cali, Panini Barranquilla"
            value={negocioNombre}
            onChange={(e) => setNegocioNombre(e.target.value)}
            className="bg-carbon-900 border border-carbon-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-neonCyan w-full font-semibold"
            required
          />
        </div>

        <button
          type="submit"
          disabled={negocioLoading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-sports font-bold text-xs tracking-wider transition-all duration-300 neon-btn-cyan shadow-neon-cyan"
        >
          {negocioLoading ? (
            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <PlusCircle size={16} />
              <span>REGISTRAR SEDE</span>
            </>
          )}
        </button>
      </form>

      {/* List of existing businesses */}
      <div className="pt-4 border-t border-carbon-800">
        <span className="text-[10px] font-bold text-carbon-500 tracking-wider block mb-3 uppercase">Sedes Registradas</span>
        <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
          {negociosList.map((n) => (
            <div key={n.id} className="flex justify-between items-center p-2.5 bg-carbon-900/60 border border-carbon-800/80 rounded-xl text-xs">
              <span className="font-semibold text-white">{n.nombre}</span>
              <span className="text-[10px] text-carbon-500 font-bold">ID: {n.id}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SedeForm;
