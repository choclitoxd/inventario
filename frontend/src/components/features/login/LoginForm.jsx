import React from 'react';
import { User, Lock, LogIn, AlertTriangle } from 'lucide-react';

function LoginForm({
  username,
  setUsername,
  password,
  setPassword,
  loading,
  error,
  onSubmit
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-950/40 border border-red-500/50 text-red-200 p-3.5 rounded-xl flex items-center gap-2.5 mb-5 animate-fadeIn text-xs font-semibold">
          <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

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
  );
}

export default LoginForm;
