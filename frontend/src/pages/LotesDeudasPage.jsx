import React, { useState } from 'react';
import { Coins, CheckCircle, AlertTriangle, TrendingUp, UserCheck, Trash2, ListOrdered, DollarSign, Eye } from 'lucide-react';
import useLotesDeudas from '../hooks/useLotesDeudas';
import DeudasTracker from '../components/features/lotes/DeudasTracker';
import HistoricoLotesTable from '../components/features/lotes/HistoricoLotesTable';
import CustomSelect from '../components/common/CustomSelect';
import NumericStepper from '../components/common/NumericStepper';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function LotesDeudasPage() {
  const {
    deudas,
    lotes,
    proveedores,
    productos,
    tarifas,
    loading,
    error,
    success,
    showAbonoForm,
    setShowAbonoForm,
    abonoMonto,
    setAbonoMonto,
    abonoNotas,
    setAbonoNotas,
    handleSaveProveedor,
    handleSaveTarifa,
    handleEliminarTarifa,
    handleRegistrarAbono,
    formatCOP,
    userRole,
    handleEditarLote,
    handleEliminarLote
  } = useLotesDeudas();

  const [activeTab, setActiveTab] = useState('deudas'); // 'deudas' | 'tarifas'

  // Modal registrar proveedor
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalNombre, setModalNombre] = useState('');
  const [modalTelefono, setModalTelefono] = useState('');

  // Formulario de tarifas
  const [tariffProveedorId, setTariffProveedorId] = useState('');
  const [tariffProductoId, setTariffProductoId] = useState('');
  const [tariffCosto, setTariffCosto] = useState(0);

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

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (!modalNombre.trim()) return;
    await handleSaveProveedor(modalNombre, modalTelefono);
    setModalNombre('');
    setModalTelefono('');
    setIsModalOpen(false);
  };

  const handleTariffSubmit = async (e) => {
    e.preventDefault();
    if (!tariffProveedorId || !tariffProductoId) return;
    await handleSaveTarifa(tariffProveedorId, tariffProductoId, tariffCosto);
    setTariffProductoId('');
    setTariffCosto(0);
  };

  const selectedTariffProduct = productos.find(p => p.id === Number(tariffProductoId));
  let tariffHelpText = '';
  if (selectedTariffProduct) {
    if (selectedTariffProduct.tipo === 'FRACCIONADO_ALBUMES') {
      tariffHelpText = 'Defina el costo por Paca de Álbumes';
    } else if (selectedTariffProduct.tipo === 'FRACCIONADO_LAMINAS') {
      tariffHelpText = 'Defina el costo por Caja de Sobres';
    } else {
      tariffHelpText = 'Defina el costo por Unidad';
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-carbon-900 border border-carbon-800 p-4 rounded-2xl shadow-lg">
        <div>
          <h2 className="text-2xl font-sports font-bold text-white flex items-center gap-3">
            <Coins className="text-neonCyan" /> Proveedores y Control de Deudas
          </h2>
          <p className="text-xs text-carbon-500 font-medium">Monitoreo de capital financiado, tarifas pactadas, amortizaciones y pasivos por proveedor.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-850 px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
          >
            <span>+ Agregar Proveedor</span>
          </button>
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

      {/* Tabs Selector */}
      <div className="flex border-b border-carbon-800 gap-6">
        <button
          onClick={() => setActiveTab('deudas')}
          className={`pb-3 text-sm font-sports font-bold tracking-wider uppercase transition-all relative ${
            activeTab === 'deudas' 
              ? 'text-neonCyan border-b-2 border-neonCyan' 
              : 'text-carbon-500 hover:text-zinc-300'
          }`}
        >
          Control de Deudas y Abonos
        </button>
        <button
          onClick={() => setActiveTab('tarifas')}
          className={`pb-3 text-sm font-sports font-bold tracking-wider uppercase transition-all relative ${
            activeTab === 'tarifas' 
              ? 'text-neonCyan border-b-2 border-neonCyan' 
              : 'text-carbon-500 hover:text-zinc-300'
          }`}
        >
          Catálogo de Proveedores y Tarifas
        </button>
      </div>

      {/* TAB 1: CONTROL DE DEUDAS Y ABONOS */}
      {activeTab === 'deudas' && (
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
      )}

      {/* TAB 2: CATÁLOGO DE PROVEEDORES Y TARIFAS */}
      {activeTab === 'tarifas' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Formulario de Asociación de Tarifas */}
            <div className="lg:col-span-1">
              <div className="glass-panel p-6 space-y-4">
                <h3 className="text-base font-sports font-bold text-white flex items-center gap-2 border-b border-carbon-800 pb-3">
                  <DollarSign size={18} className="text-neonGreen" /> Asociar Tarifas de Compra
                </h3>

                <form onSubmit={handleTariffSubmit} className="space-y-4 text-xs">
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-carbon-500 uppercase">Seleccionar Proveedor</label>
                    <CustomSelect
                      options={proveedores.map(p => ({
                        value: p.id,
                        label: `${p.nombre} (${p.telefono || 'Sin Teléfono'})`
                      }))}
                      value={tariffProveedorId}
                      onChange={(val) => setTariffProveedorId(val)}
                      placeholder="-- Seleccionar Proveedor --"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-carbon-500 uppercase">Seleccionar Producto</label>
                    <CustomSelect
                      options={productos.map(p => ({
                        value: p.id,
                        label: p.nombre
                      }))}
                      value={tariffProductoId}
                      onChange={(val) => setTariffProductoId(val)}
                      placeholder="-- Seleccionar Producto --"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-carbon-500 uppercase">Costo Unitario Pactado (COP)</label>
                    <NumericStepper
                      value={tariffCosto}
                      onChange={(val) => setTariffCosto(val)}
                      min={0}
                    />
                    {tariffHelpText && (
                      <p className="text-[10px] text-neonGreen font-semibold mt-1">
                        💡 {tariffHelpText}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !tariffProveedorId || !tariffProductoId}
                    className="w-full bg-neonGreen text-black hover:bg-black hover:text-neonGreen border border-neonGreen font-sports font-bold text-xs px-4 py-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Vinculando...' : 'VINCULAR PRODUCTO A PROVEEDOR'}
                  </button>
                </form>
              </div>
            </div>

            {/* Tabla de Lista de Precios */}
            <div className="lg:col-span-2">
              <div className="glass-panel p-6 space-y-4">
                <h3 className="text-base font-sports font-bold text-white flex items-center gap-2 border-b border-carbon-800 pb-3">
                  <ListOrdered size={18} className="text-neonCyan" /> Lista de Tarifas Acordadas
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-carbon-900 border-b border-carbon-800 text-[10px] font-bold text-carbon-500 tracking-wider">
                        <th className="px-4 py-2">PROVEEDOR</th>
                        <th className="px-4 py-2">PRODUCTO</th>
                        <th className="px-4 py-2 text-center">UNIDAD BASE</th>
                        <th className="px-4 py-2 text-right">COSTO PACTADO</th>
                        <th className="px-4 py-2 text-center w-20">ACCIONES</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-carbon-800/60 text-xs">
                      {tarifas.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-carbon-600 font-semibold">
                            No hay tarifas pactadas con proveedores en este momento.
                          </td>
                        </tr>
                      ) : (
                        tarifas.map((t) => {
                          const unitBase = t.producto?.tipo === 'FRACCIONADO_ALBUMES' ? 'Paca' : t.producto?.tipo === 'FRACCIONADO_LAMINAS' ? 'Caja' : 'Unidad';
                          return (
                            <tr key={t.id} className="hover:bg-carbon-850 transition-colors">
                              <td className="px-4 py-3 font-semibold text-white">
                                {t.proveedor?.nombre || 'Externo'}
                              </td>
                              <td className="px-4 py-3 text-carbon-400">
                                {t.producto?.nombre}
                              </td>
                              <td className="px-4 py-3 text-center text-carbon-500 font-semibold">
                                {unitBase}
                              </td>
                              <td className="px-4 py-3 text-right font-sports font-bold text-zinc-300">
                                {formatCOP(t.costoPactado)}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <button
                                  onClick={async () => {
                                    const confirm = window.confirm(`¿Seguro que desea eliminar la tarifa pactada de "${t.producto?.nombre}" para "${t.proveedor?.nombre}"?`);
                                    if (confirm) {
                                      await handleEliminarTarifa(t.id);
                                    }
                                  }}
                                  className="text-zinc-500 hover:text-red-500 transition-colors p-1"
                                  title="Eliminar Tarifa"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Modal Agregar Proveedor */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-sports font-bold text-white">REGISTRAR NUEVO PROVEEDOR</h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-zinc-500 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase">Nombre Completo</label>
                <input 
                  type="text" 
                  required
                  placeholder="Nombre del proveedor"
                  value={modalNombre}
                  onChange={(e) => setModalNombre(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 focus:border-emerald-500/80 text-xs font-mono text-white placeholder-zinc-600 px-3 py-2.5 rounded-lg focus:outline-none w-full"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase">Teléfono / Identificador</label>
                <input 
                  type="text" 
                  placeholder="Teléfono de contacto"
                  value={modalTelefono}
                  onChange={(e) => setModalTelefono(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 focus:border-emerald-500/80 text-xs font-mono text-white placeholder-zinc-600 px-3 py-2.5 rounded-lg focus:outline-none w-full"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="bg-transparent hover:bg-zinc-850 border border-zinc-800 text-zinc-400 hover:text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="bg-emerald-500 text-black hover:bg-emerald-400 border border-emerald-500 font-sports font-bold text-xs px-4 py-2 rounded-lg transition-all"
                >
                  GUARDAR PROVEEDOR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default LotesDeudasPage;
