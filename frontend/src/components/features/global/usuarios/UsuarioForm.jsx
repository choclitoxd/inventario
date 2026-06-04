import React from 'react';
import { UserPlus } from 'lucide-react';

function UsuarioForm({
  userForm,
  setUserForm,
  userLoading,
  handleCreateUser
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    handleCreateUser(e);
  };

  return (
    <div className="glass-panel p-6 border border-carbon-800 space-y-4">
      <div className="flex items-center gap-2 pb-4 border-b border-carbon-800">
        <UserPlus className="text-neonGreen" size={20} />
        <h2 className="text-base font-sports font-bold text-white uppercase tracking-wider">CREAR NUEVO USUARIO</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-carbon-400 tracking-wider">NOMBRE COMPLETO</label>
            <input
              type="text"
              placeholder="Ej: Pedro Pérez"
              value={userForm.nombre}
              onChange={(e) => setUserForm({ ...userForm, nombre: e.target.value })}
              className="bg-carbon-900 border border-carbon-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-neonGreen w-full font-semibold"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-carbon-400 tracking-wider">USER NAME</label>
            <input
              type="text"
              placeholder="Ej: pedrito"
              value={userForm.username}
              onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
              className="bg-carbon-900 border border-carbon-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-neonGreen w-full font-semibold"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-carbon-400 tracking-wider">CONTRASEÑA</label>
            <input
              type="password"
              placeholder="••••••••"
              value={userForm.password}
              onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
              className="bg-carbon-900 border border-carbon-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-neonGreen w-full font-semibold"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-carbon-400 tracking-wider">ROL DEL USUARIO</label>
            <select
              value={userForm.rol}
              onChange={(e) => setUserForm({ ...userForm, rol: e.target.value })}
              className="bg-carbon-900 border border-carbon-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-neonGreen w-full font-semibold"
            >
              <option value="VENDEDOR">VENDEDOR (Operativo)</option>
              <option value="JEFE">JEFE (Administración local)</option>
              <option value="ADMIN">ADMIN (Control global)</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={userLoading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-sports font-bold text-xs tracking-wider transition-all duration-300 neon-btn-green shadow-neon-green"
        >
          {userLoading ? (
            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <UserPlus size={16} />
              <span>REGISTRAR USUARIO</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default UsuarioForm;
