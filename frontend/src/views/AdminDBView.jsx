import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Database, ExternalLink, RefreshCw, Terminal, AlertCircle } from 'lucide-react';

function AdminDBView() {
  const [stats, setStats] = useState({
    clientes: 0,
    productos: 0,
    ventas: 0,
    lotes: 0,
    gastos: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch data to calculate basic system stats
      const [clientes, productos, ventas, lotes, gastos] = await Promise.all([
        api.listarClientes().catch(() => []),
        api.listarProductos().catch(() => []),
        api.listarVentas().catch(() => []),
        api.listarLotes().catch(() => []),
        api.listarGastos().catch(() => [])
      ]);

      setStats({
        clientes: clientes.length,
        productos: productos.length,
        ventas: ventas.length,
        lotes: lotes.length,
        gastos: gastos.length
      });
    } catch (err) {
      console.error(err);
      setError('Error al cargar estadísticas de la base de datos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-sports text-white flex items-center gap-2">
            <Database className="text-neonCyan animate-pulse" size={24} />
            PANEL DE BASE DE DATOS
          </h1>
          <p className="text-xs text-carbon-500 font-semibold tracking-wider mt-1 uppercase">
            Área exclusiva para Administradores de TI
          </p>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-2 text-xs font-semibold px-4 py-2 bg-carbon-800 border border-carbon-700/60 rounded-xl hover:border-neonCyan transition-all duration-300"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refrescar Stats</span>
        </button>
      </div>

      {/* Grid of Database Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Clientes Registrados', value: stats.clientes, color: 'text-neonCyan border-neonCyan/20' },
          { label: 'Productos Catálogo', value: stats.productos, color: 'text-neonGreen border-neonGreen/20' },
          { label: 'Ventas Realizadas', value: stats.ventas, color: 'text-purple-400 border-purple-500/20' },
          { label: 'Lotes / Inversiones', value: stats.lotes, color: 'text-amber-400 border-amber-500/20' },
          { label: 'Gastos Hormiga', value: stats.gastos, color: 'text-red-400 border-red-500/20' }
        ].map((item, idx) => (
          <div key={idx} className={`glass-card p-4 border border-carbon-700/50 flex flex-col justify-center items-center text-center ${item.color}`}>
            <span className="text-2xl font-sports font-bold text-white mb-1">{loading ? '...' : item.value}</span>
            <span className="text-[9px] font-bold text-carbon-500 uppercase tracking-wider">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Main interactive panel */}
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Info Column */}
        <div className="space-y-4">
          <div className="glass-panel p-6 border border-carbon-800 space-y-4">
            <h2 className="text-sm font-sports font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Terminal size={16} className="text-neonCyan" />
              Acceso a Adminer
            </h2>
            <p className="text-xs text-carbon-400 leading-relaxed">
              Adminer es una herramienta de gestión de bases de datos de un solo archivo que te permite administrar tablas, ejecutar consultas SQL directas y editar esquemas.
            </p>
            <div className="bg-neonCyan/10 border border-neonCyan/30 p-3.5 rounded-xl flex items-start gap-2.5 text-xs text-neonCyan">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-1">Información de Conexión:</span>
                <p className="font-semibold text-[10px] space-y-0.5">
                  • Servidor: <span className="text-white">db</span> (o localhost)<br />
                  • Usuario: <span className="text-white">panini_user</span><br />
                  • Base de Datos: <span className="text-white">panini_db</span>
                </p>
              </div>
            </div>
            <a
              href="http://localhost:8081"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-sports font-bold text-xs tracking-wider transition-all duration-300 neon-btn-cyan shadow-neon-cyan"
            >
              <ExternalLink size={16} />
              <span>ABRIR EN NUEVA PESTAÑA</span>
            </a>
          </div>
        </div>

        {/* Embedded Iframe Column */}
        <div className="md:col-span-2">
          <div className="glass-panel border border-carbon-800 overflow-hidden flex flex-col h-[480px]">
            <div className="bg-carbon-900 px-4 py-3 border-b border-carbon-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="text-[10px] font-bold text-carbon-400 ml-2 tracking-wider">ADMINER CONSOLE • http://localhost:8081</span>
              </div>
            </div>
            <div className="flex-1 bg-white relative">
              <iframe
                src="http://localhost:8081"
                className="w-full h-full border-0"
                title="Adminer Database Management"
              />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

export default AdminDBView;
