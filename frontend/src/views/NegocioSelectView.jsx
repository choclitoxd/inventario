import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Store, LogOut, ArrowRight, Layers, Database } from 'lucide-react';

function NegocioSelectView({ onSelectNegocio, onLogout, currentUser, onBypassAdminDB }) {
  const [negocios, setNegocios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadNegocios() {
      try {
        const data = await api.listarNegocios();
        setNegocios(data || []);
      } catch (err) {
        console.error(err);
        setError('Error al cargar la lista de negocios.');
      } finally {
        setLoading(false);
      }
    }
    loadNegocios();
  }, []);

  const handleSelect = (negocio) => {
    localStorage.setItem('active_negocio_id', negocio.id);
    localStorage.setItem('active_negocio_nombre', negocio.nombre);
    onSelectNegocio(negocio);
  };

  return (
    <div className="min-h-screen bg-carbon-950 flex flex-col justify-center items-center p-4 relative overflow-hidden text-zinc-100 font-body">
      
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neonGreen/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neonCyan/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-xl w-full space-y-6 z-10">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex bg-neonCyan p-3 rounded-2xl text-black shadow-lg shadow-neon-cyan/20 animate-pulse">
            <Store size={32} />
          </div>
          <h1 className="text-3xl font-sports font-bold tracking-widest text-white mt-3">
            SELECCIONAR <span className="text-neonCyan font-extrabold">NEGOCIO</span>
          </h1>
          <p className="text-xs text-carbon-500 font-medium uppercase tracking-widest">
            Selecciona la sede o negocio a gestionar
          </p>
        </div>

        {/* Panel Container */}
        <div className="glass-panel p-8 border border-carbon-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neonCyan to-neonGreen" />

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="w-10 h-10 border-4 border-neonCyan border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-carbon-500 font-semibold tracking-wider">CARGANDO NEGOCIOS...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-400 text-sm font-semibold mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="neon-btn-cyan shadow-neon-cyan text-xs"
              >
                Reintentar
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {negocios.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => handleSelect(n)}
                    className="glass-card p-6 flex flex-col justify-between items-start text-left hover:scale-[1.03] hover:shadow-neon-cyan/10 hover:shadow-xl group transition-all duration-300 relative overflow-hidden"
                  >
                    {/* Glowing effect inside card */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-neonCyan/5 rounded-full blur-xl pointer-events-none group-hover:bg-neonCyan/10 transition-all duration-300" />
                    
                    <div className="w-full flex justify-between items-center mb-4">
                      <div className="p-2.5 bg-carbon-900 border border-carbon-700/60 rounded-xl group-hover:border-neonCyan/50 transition-colors">
                        <Layers size={18} className="text-neonCyan" />
                      </div>
                      <ArrowRight size={16} className="text-carbon-500 group-hover:text-neonCyan group-hover:translate-x-1 transition-all duration-300" />
                    </div>

                    <div>
                      <h3 className="text-lg font-sports font-bold text-white group-hover:text-neonCyan transition-colors">
                        {n.nombre}
                      </h3>
                      <span className="text-[9px] font-bold text-carbon-500 tracking-wider uppercase mt-1 block">
                        Sede ID: {n.id}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              
              {currentUser && currentUser.rol === 'ADMIN' && (
                <div className="pt-4 border-t border-carbon-800 flex justify-center">
                  <button
                    onClick={onBypassAdminDB}
                    className="flex items-center gap-2 text-xs font-semibold text-neonCyan hover:underline transition-all duration-200"
                  >
                    <Database size={14} />
                    <span>Administrar Base de Datos Directamente</span>
                  </button>
                </div>
              )}

              <div className="pt-4 border-t border-carbon-800 flex justify-center">
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 text-xs font-semibold text-carbon-400 hover:text-red-400 transition-colors"
                >
                  <LogOut size={14} />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default NegocioSelectView;
