import React from 'react';
import { Search, Edit2, Trash2, Filter } from 'lucide-react';

function UsuariosTable({
  filteredUsuarios,
  searchText,
  setSearchText,
  filterRol,
  setFilterRol,
  activeUser,
  onEditClick,
  onDeleteClick
}) {
  const handleDeleteConfirm = (id, username) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar al usuario @${username}? Esta acción no se puede deshacer.`)) {
      onDeleteClick(id);
    }
  };

  return (
    <div className="glass-panel p-6 border border-carbon-800 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-carbon-800 pb-4">
        <h3 className="text-base font-sports font-bold text-white uppercase tracking-wider self-center">
          Usuarios Registrados
        </h3>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <span className="absolute left-2.5 top-2.5 text-carbon-500">
              <Search size={14} />
            </span>
            <input
              type="text"
              placeholder="Buscar por nombre/username..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full bg-carbon-900 border border-carbon-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-neonCyan font-semibold placeholder:text-carbon-600 w-full"
            />
          </div>

          <div className="relative flex-1 sm:flex-initial">
            <span className="absolute left-2.5 top-2.5 text-carbon-500">
              <Filter size={14} />
            </span>
            <select
              value={filterRol}
              onChange={(e) => setFilterRol(e.target.value)}
              className="w-full bg-carbon-900 border border-carbon-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-neonCyan font-semibold"
            >
              <option value="">Todos los roles</option>
              <option value="ADMIN">ADMIN</option>
              <option value="DUENO">JEFE/DUEÑO</option>
              <option value="ORGANIZADOR">ORGANIZADOR</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-carbon-800 text-[10px] font-bold text-carbon-500 tracking-wider uppercase font-sports">
              <th className="py-3 px-4">Nombre Completo</th>
              <th className="py-3 px-4">Username</th>
              <th className="py-3 px-4">Rol</th>
              <th className="py-3 px-4 text-center w-28">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-carbon-800/50">
            {filteredUsuarios.map(user => {
              const isSelf = activeUser && activeUser.id === user.id;
              return (
                <tr key={user.id} className="hover:bg-carbon-800/20 transition-colors">
                  <td className="py-3 px-4 font-bold text-white text-sm">{user.nombre}</td>
                  <td className="py-3 px-4 font-mono text-neonCyan font-semibold">@{user.username}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded border text-[9px] font-bold ${
                      user.rol === 'ADMIN' ? 'bg-neonCyan/10 border-neonCyan/20 text-neonCyan' :
                      user.rol === 'DUENO' ? 'bg-neonGreen/10 border-neonGreen/20 text-neonGreen' :
                      'bg-purple-500/10 border-purple-500/20 text-purple-400'
                    }`}>
                      {user.rol}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => onEditClick(user)}
                        className="text-neonCyan hover:text-white p-1 rounded transition-colors"
                        title="Editar Usuario"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => !isSelf && handleDeleteConfirm(user.id, user.username)}
                        disabled={isSelf}
                        className={`p-1 rounded transition-colors ${
                          isSelf 
                            ? 'text-carbon-700 cursor-not-allowed opacity-30' 
                            : 'text-red-500 hover:text-white'
                        }`}
                        title={isSelf ? 'No puedes auto-eliminarte' : 'Eliminar Usuario'}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredUsuarios.length === 0 && (
              <tr>
                <td colSpan="4" className="py-8 text-center text-carbon-600 font-semibold uppercase tracking-wider">
                  No se encontraron usuarios.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UsuariosTable;
