import React, { useState } from 'react';
import { api } from '../services/api';
import { Lock, User, LogIn, AlertTriangle, Shield, Layers } from 'lucide-react';

function LoginView({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Suggested quick login users
  const quickUsers = [
    { username: 'donato', nombre: 'Donato', rol: 'ADMIN', color: 'border-neonGreen text-neonGreen bg-neonGreen/10' },
    { username: 'giank', nombre: 'Giank', rol: 'JEFE', color: 'border-neonCyan text-neonCyan bg-neonCyan/10' },
    { username: 'vector', nombre: 'Vector', rol: 'VENDEDOR', color: 'border-purple-500 text-purple-400 bg-purple-500/10' },
    { username: 'chefcito', nombre: 'Chefcito', rol: 'VENDEDOR', color: 'border-amber-500 text-amber-400 bg-amber-500/10' }
  ];

  const handleSelectQuickUser = (user) => {
    setUsername(user.username);
    setPassword('123456'); // Default seeded password
    setError(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userSession = await api.login(username.trim(), password);
      if (userSession) {
        onLoginSuccess(userSession);
      } else {
        setError('Error al iniciar sesión. Verifica las credenciales.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Credenciales inválidas o error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-carbon-950 flex flex-col justify-center items-center p-4 relative overflow-hidden text-zinc-100 font-body">
      
      {/* Decorative soccer-field grid lines or blur circles in background */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neonGreen/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neonCyan/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-md w-full space-y-6 z-10">
        
        {/* Header Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex bg-neonGreen p-3 rounded-2xl text-black shadow-lg shadow-neon-green/20 animate-bounce">
            <Layers size={32} />
          </div>
          <h1 className="text-3xl font-sports font-bold tracking-widest text-white mt-3">
            PANINI <span className="text-neonGreen font-extrabold">INV</span>
          </h1>
          <p className="text-xs text-carbon-500 font-medium uppercase tracking-widest">Carbon Edition • Sistema de Gestión</p>
        </div>

        {/* Login Panel */}
        <div className="glass-panel p-8 border border-carbon-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neonGreen via-neonCyan to-purple-500" />
          
          <h2 className="text-lg font-sports font-bold text-white text-center mb-6">INICIAR SESIÓN</h2>

          {error && (
            <div className="bg-red-950/40 border border-red-500/50 text-red-200 p-3.5 rounded-xl flex items-center gap-2.5 mb-5 animate-fadeIn text-xs font-semibold">
              <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Username Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-carbon-400 tracking-wider">USUARIO</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-carbon-500">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  placeholder="Ingresa tu usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-carbon-900 border border-carbon-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-neonGreen w-full font-semibold"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-carbon-400 tracking-wider">CONTRASEÑA</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-carbon-500">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-carbon-900 border border-carbon-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-neonGreen w-full font-semibold"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-sports font-bold text-xs tracking-wider transition-all duration-300 mt-6 ${
                loading
                  ? 'bg-carbon-800 text-carbon-600 border-carbon-700 cursor-not-allowed'
                  : 'neon-btn-green shadow-neon-green'
              }`}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={16} />
                  <span>ENTRAR AL SISTEMA</span>
                </>
              )}
            </button>

          </form>

          {/* Quick Login Section */}
          <div className="mt-8 border-t border-carbon-800 pt-6">
            <span className="text-[10px] font-bold text-carbon-500 tracking-wider block text-center mb-3.5 uppercase">
              Acceso Rápido (Usuarios de Prueba)
            </span>
            <div className="grid grid-cols-2 gap-2">
              {quickUsers.map((u) => (
                <button
                  key={u.username}
                  type="button"
                  onClick={() => handleSelectQuickUser(u)}
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

        </div>

        {/* Footer info */}
        <div className="text-center text-[10px] text-carbon-600 font-medium">
          <p className="flex items-center justify-center gap-1.5">
            <Shield size={10} /> Sistema Seguro de Control de Inventario
          </p>
          <p className="mt-1">Panini wholesale manager v1.0.0</p>
        </div>

      </div>

    </div>
  );
}

export default LoginView;
