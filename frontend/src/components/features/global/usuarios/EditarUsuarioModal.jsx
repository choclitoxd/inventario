import React, { useState, useEffect } from 'react';
import { X, UserCheck, Save } from 'lucide-react';

function EditarUsuarioModal({
  isOpen,
  usuario,
  onClose,
  onSave,
  loading
}) {
  const [nombre, setNombre] = useState('');
  const [rol, setRol] = useState('VENDEDOR');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (usuario) {
      setNombre(usuario.nombre || '');
      setRol(usuario.rol || 'VENDEDOR');
      setPassword('');
    }
  }, [usuario]);

  if (!isOpen || !usuario) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(usuario.id, nombre, rol, password);
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
          <UserCheck size={18} className="text-neonCyan" /> Editar Usuario: @{usuario.username}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-carbon-500 uppercase tracking-wider">Nombre Completo</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-neonCyan w-full font-semibold"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-carbon-500 uppercase tracking-wider">Rol de Usuario</label>
            <select
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              className="bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-neonCyan w-full font-semibold"
            >
              <option value="VENDEDOR">VENDEDOR (Operativo)</option>
              <option value="JEFE">JEFE (Administración local)</option>
              <option value="ADMIN">ADMIN (Control global)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-carbon-500 uppercase tracking-wider">Nueva Contraseña</label>
              <span className="text-[8px] text-carbon-500 font-semibold uppercase font-mono">Opcional</span>
            </div>
            <input
              type="password"
              placeholder="•••••••• (dejar vacío para no cambiar)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-neonCyan w-full font-semibold"
            />
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

export default EditarUsuarioModal;
