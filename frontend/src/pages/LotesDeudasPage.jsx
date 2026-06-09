import React from 'react';
import { Coins, CheckCircle, AlertTriangle, UserCheck } from 'lucide-react';
import useLotesDeudas from '../hooks/useLotesDeudas';
import DeudasTracker from '../components/features/lotes/DeudasTracker';
import HistoricoLotesTable from '../components/features/lotes/HistoricoLotesTable';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function LotesDeudasPage() {
  const {
    deudas,
    lotes,
    loading,
    error,
    success,
    showAbonoForm,
    setShowAbonoForm,
    abonoMonto,
    setAbonoMonto,
    abonoNotas,
    setAbonoNotas,
    handleRegistrarAbono,
    formatCOP,
    userRole,
    handleEditarLote,
    handleEliminarLote
  } = useLotesDeudas();

  const totalDeudaAcumulada = deudas.reduce((sum, d) => sum + (d.saldoPendiente || 0), 0);
  const totalAmortizado = deudas.reduce((sum, d) => sum + ((d.montoPrestado || 0) - (d.saldoPendiente || 0)), 0);

  const deudasPorInversionista = deudas.reduce((acc, current) => {
    const name = current.nombreProveedor || (current.proveedor ? current.proveedor.nombre : 'Proveedor Externo');
    acc[name] = (acc[name] || 0) + (current.saldoPendiente || 0);
    return acc;
  }, {});

  const chartData = Object.entries(deudasPorInversionista).map(([name, deuda]) => ({
    name,
    deuda
  }));

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-carbon-900 border border-carbon-800 p-4 rounded-2xl shadow-lg">
        <div>
          <h2 className="text-2xl font-sports font-bold text-white flex items-center gap-3">
            <Coins className="text-neonCyan" /> Control de Deudas y Abonos
          </h2>
          <p className="text-xs text-carbon-500 font-medium">Monitoreo de capital financiado, amortizaciones y pasivos por proveedor.</p>
        </div>
      </div>

      {success && (
        <div className="bg-neonCyan/10 border border-neonCyan/30 text-neonCyan p-4 rounded-xl flex items-center gap-3 shadow-neon-cyan animate-fadeIn">
          <CheckCircle className="flex-shrink-0" size={16} />
          <span className="text-sm font-semibold">{success}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-950/40 border border-red-500/50 text-red-200 p-4 rounded-xl flex items-center gap-3 animate-fadeIn">
          <AlertTriangle className="text-red-500 flex-shrink-0" size={16} />
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      <div className="space-y-8 animate-fadeIn">
        {/* SECCIÓN A: PANEL DE PROVEEDORES Y GRÁFICAS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            {/* Saldos Generales de Deuda */}
            <div className="glass-panel p-5 space-y-5">
              <h4 className="text-xs font-sports font-bold text-white tracking-wider uppercase flex items-center gap-1.5 border-b border-carbon-800 pb-2">
                <Coins size={14} className="text-neonCyan" /> Resumen de Pasivos
              </h4>

              {/* Mini KPI Cards Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-carbon-900 border border-carbon-800 p-3.5 rounded-xl">
                  <span className="text-[9px] font-bold tracking-wider text-carbon-500 uppercase block mb-1">Deuda a Proveedores</span>
                  <span className="text-lg font-sports font-bold text-red-400 block">{formatCOP(totalDeudaAcumulada)}</span>
                </div>
                <div className="bg-carbon-900 border border-carbon-800 p-3.5 rounded-xl">
                  <span className="text-[9px] font-bold tracking-wider text-carbon-500 uppercase block mb-1">Total Abonado</span>
                  <span className="text-lg font-sports font-bold text-emerald-400 block">{formatCOP(totalAmortizado)}</span>
                </div>
              </div>

              {/* Gráfica de Distribución */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold tracking-wider text-carbon-500 uppercase block">Distribución de Deuda</span>
                <div className="bg-carbon-900/40 border border-carbon-800/60 p-2.5 rounded-xl h-44 flex items-center justify-center">
                  {chartData.length === 0 ? (
                    <span className="text-xs text-carbon-600 font-semibold">No hay datos de distribución</span>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                        <XAxis dataKey="name" stroke="#71717a" fontSize={9} tickLine={false} />
                        <YAxis stroke="#71717a" fontSize={9} tickLine={false} tickFormatter={(val) => `$${(val / 1e6).toFixed(1)}M`} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                          labelStyle={{ color: '#fff', fontSize: '10px', fontWeight: 'bold' }}
                          itemStyle={{ color: '#10b981', fontSize: '10px' }}
                          formatter={(val) => [formatCOP(val), 'Deuda']}
                        />
                        <Bar dataKey="deuda" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Resumen por Proveedor list */}
              <div className="space-y-2.5 pt-1">
                <span className="text-[10px] font-bold tracking-wider text-carbon-500 uppercase block flex items-center gap-1">
                  <UserCheck size={11} className="text-neonCyan" /> Resumen por Proveedor
                </span>
                {Object.keys(deudasPorInversionista).length === 0 ? (
                  <div className="text-center text-xs text-carbon-600 py-3 border border-dashed border-carbon-800 rounded-lg">
                    No hay proveedores con deuda activa.
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {Object.entries(deudasPorInversionista).map(([nombre, deuda]) => (
                      <div key={nombre} className="flex items-center justify-between text-xs bg-carbon-900 border border-carbon-800/40 p-2.5 rounded-lg">
                        <span className="font-semibold text-zinc-300 truncate max-w-[120px]">{nombre}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-carbon-500">➡️</span>
                          <span className={`font-mono px-2 py-0.5 rounded text-[10px] font-bold ${
                            deuda > 0 ? 'bg-red-950/40 border border-red-500/20 text-red-400' : 'bg-neonGreen/10 border border-neonGreen/30 text-neonGreen'
                          }`}>
                            Deuda: {formatCOP(deuda)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <DeudasTracker
              deudas={deudas}
              showAbonoForm={showAbonoForm}
              setShowAbonoForm={setShowAbonoForm}
              abonoMonto={abonoMonto}
              setAbonoMonto={setAbonoMonto}
              abonoNotas={abonoNotas}
              setAbonoNotas={setAbonoNotas}
              handleRegistrarAbono={handleRegistrarAbono}
              formatCOP={formatCOP}
              loading={loading}
            />
          </div>
        </div>

        {/* SECCIÓN B: HISTÓRICO DE LOTES */}
        <div className="w-full">
          <HistoricoLotesTable
            lotes={lotes}
            formatCOP={formatCOP}
            userRole={userRole}
            onEdit={handleEditarLote}
            onDelete={handleEliminarLote}
          />
        </div>
      </div>

    </div>
  );
}

export default LotesDeudasPage;
