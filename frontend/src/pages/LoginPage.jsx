import React from 'react';
import useLogin from '../hooks/useLogin';
import LoginForm from '../components/features/login/LoginForm';
import QuickLoginGrid from '../components/features/login/QuickLoginGrid';
import { Shield, Layers } from 'lucide-react';

function LoginPage({ onLoginSuccess }) {
  const {
    username,
    setUsername,
    password,
    setPassword,
    loading,
    error,
    handleSelectQuickUser,
    handleLogin
  } = useLogin(onLoginSuccess);

  return (
    <div className="min-h-screen bg-carbon-950 flex flex-col justify-center items-center p-4 relative overflow-hidden text-zinc-100 font-body">
      
      {/* Decorative soccer-field background glows */}
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

          <LoginForm
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            loading={loading}
            error={error}
            onSubmit={handleLogin}
          />

          <QuickLoginGrid
            onSelectQuickUser={handleSelectQuickUser}
          />
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

export default LoginPage;
