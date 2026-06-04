import React from 'react';
import { Search, Edit2, Trash2, Filter } from 'lucide-react';

function SedesTable({
  filteredSedes,
  searchText,
  setSearchText,
  filterOwner,
  setFilterOwner,
  jefesOnly,
  onEditClick,
  onDeleteClick,
  SedeOwnersArray
}) {
  const handleDeleteConfirm = (id, nombre) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar la sede "${nombre}"? Esta acción no se puede deshacer.`)) {
      onDeleteClick(id);
    }
  };

  return (
    <div className="glass-panel p-6 border border-carbon-800 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-carbon-800 pb-4">
        <h3 className="text-base font-sports font-bold text-white uppercase tracking-wider self-center">
          Sedes Registradas
        </h3>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <span className="absolute left-2.5 top-2.5 text-carbon-500">
              <Search size={14} />
            </span>
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full bg-carbon-900 border border-carbon-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-neonCyan font-semibold placeholder:text-carbon-600"
            />
          </div>

          <div className="relative flex-1 sm:flex-initial">
            <span className="absolute left-2.5 top-2.5 text-carbon-500">
              <Filter size={14} />
            </span>
            <select
              value={filterOwner}
              onChange={(e) => setFilterOwner(e.target.value)}
              className="w-full bg-carbon-900 border border-carbon-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-neonCyan font-semibold"
            >
              <option value="">Filtrar por dueño</option>
              {jefesOnly.map(u => (
                <option key={u.username} value={u.username}>{u.nombre} (@{u.username})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-carbon-800 text-[10px] font-bold text-carbon-500 tracking-wider uppercase font-sports">
              <th className="py-3 px-4 w-16">ID</th>
              <th className="py-3 px-4">Nombre de la Sede</th>
              <th className="py-3 px-4">Dueños / Responsables</th>
              <th className="py-3 px-4 text-center w-28">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-carbon-800/50">
            {filteredSedes.map(sede => {
              const owners = SedeOwnersArray(sede.duenos);
              return (
                <tr key={sede.id} className="hover:bg-carbon-800/20 transition-colors">
                  <td className="py-3 px-4 font-mono text-carbon-500">#{sede.id}</td>
                  <td className="py-3 px-4 font-bold text-white text-sm">{sede.nombre}</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {owners.map(username => (
                        <span key={username} className="px-2 py-0.5 rounded border border-neonCyan/20 bg-neonCyan/10 text-neonCyan text-[9px] font-bold">
                          @{username}
                        </span>
                      ))}
                      {owners.length === 0 && (
                        <span className="text-[10px] text-carbon-600 font-semibold italic">Sin dueños</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => onEditClick(sede)}
                        className="text-neonCyan hover:text-white p-1 rounded transition-colors"
                        title="Editar Sede"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteConfirm(sede.id, sede.nombre)}
                        className="text-red-500 hover:text-white p-1 rounded transition-colors"
                        title="Eliminar Sede"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredSedes.length === 0 && (
              <tr>
                <td colSpan="4" className="py-8 text-center text-carbon-600 font-semibold uppercase tracking-wider">
                  No se encontraron sedes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SedesTable;
