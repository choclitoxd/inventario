import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Coins, 
  Plus, 
  UserPlus, 
  DollarSign, 
  ListOrdered,
  Calendar,
  AlertTriangle,
  CheckCircle,
  FileText
} from 'lucide-react';

function LotesDeudasView() {
  const [productos, setProductos] = useState([]);
  const [deudas, setDeudas] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // New Lot Form State
  const [nombreLote, setNombreLote] = useState('');
  const [financiador, setFinanciador] = useState('DUENO_A');
  const [nombreInversionista, setNombreInversionista] = useState('');
  const [deudaInicial, setDeudaInicial] = useState('');
  const [porcentajeAmortizacion, setPorcentajeAmortizacion] = useState('');
  const [productoId, setProductoId] = useState('');
  const [cantPacas, setCantPacas] = useState('');
  const [cantCajas, setCantCajas] = useState('');
  const [cantUnidades, setCantUnidades] = useState('');
  const [costoPaca, setCostoPaca] = useState('');
  const [costoCaja, setCostoCaja] = useState('');
  const [costoUnidad, setCostoUnidad] = useState('');

  // Manual Amortization Modal/Inline State
  const [showAbonoForm, setShowAbonoForm] = useState(null); // stores loteId if open
  const [abonoMonto, setAbonoMonto] = useState('');
  const [abonoNotas, setAbonoNotas] = useState('');

  const loadData = async () => {
    setError(null);
    try {
      const prods = await api.listarProductos();
      const deuds = await api.listarDeudasInversionistas();
      const allLotes = await api.listarLotes();
      setProductos(prods);
      setDeudas(deuds);
      setLotes(allLotes);
    } catch (err) {
      console.error(err);
      setError('Error al obtener datos de lotes y financiamiento.');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCrearLote = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!nombreLote.trim() || !productoId) {
      setError('Por favor, ingresa el nombre del lote y selecciona un producto.');
      return;
    }

    setLoading(true);

    const payload = {
      nombreLote,
      financiador,
      porcentajeGananciaAmortizacion: financiador === 'INVERSIONISTA_EXTERNO' ? Number(porcentajeAmortizacion) : 0,
      deudaInicial: financiador === 'INVERSIONISTA_EXTERNO' ? Number(deudaInicial) : 0,
      productoId: Number(productoId),
      cantPacas: Number(cantPacas) || 0,
      cantCajas: Number(cantCajas) || 0,
      cantUnidades: Number(cantUnidades) || 0,
      costoCompraPaca: Number(costoPaca) || 0,
      costoCompraCaja: Number(costoCaja) || 0,
      costoCompraUnidad: Number(costoUnidad) || 0
    };

    try {
      await api.registrarEntradaLote(payload);
      setSuccess('¡Entrada de lote registrada con éxito! El inventario ha sido incrementado.');
      
      // Reset form
      setNombreLote('');
      setFinanciador('DUENO_A');
      setNombreInversionista('');
      setDeudaInicial('');
      setPorcentajeAmortizacion('');
      setProductoId('');
      setCantPacas('');
      setCantCajas('');
      setCantUnidades('');
      setCostoPaca('');
      setCostoCaja('');
      setCostoUnidad('');

      loadData();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al registrar el lote de mercancía.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrarAbono = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!abonoMonto || Number(abonoMonto) <= 0) {
      setError('Por favor, ingresa un monto válido mayor a cero.');
      return;
    }

    setLoading(true);

    try {
      await api.registrarAbonoManual(showAbonoForm, Number(abonoMonto), abonoNotas);
      setSuccess('Abono manual registrado con éxito. Se actualizó el saldo pendiente del lote.');
      
      // Reset
      setShowAbonoForm(null);
      setAbonoMonto('');
      setAbonoNotas('');

      loadData();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al registrar la amortización manual de deuda.');
    } finally {
      setLoading(false);
    }
  };

  const formatCOP = (val) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(val || 0);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-carbon-900 border border-carbon-800 p-4 rounded-2xl shadow-lg">
        <div>
          <h2 className="text-2xl font-sports font-bold text-white flex items-center gap-3">
            <Coins className="text-neonCyan" /> Lotes de Mercancía e Inversionistas
          </h2>
          <p className="text-xs text-carbon-500 font-medium">Trazabilidad por origen de capital, control de amortizaciones y abonos</p>
        </div>
      </div>

      {success && (
        <div className="bg-neonCyan/10 border border-neonCyan/30 text-neonCyan p-4 rounded-xl flex items-center gap-3 shadow-neon-cyan animate-fadeIn">
          <CheckCircle className="flex-shrink-0" />
          <span className="text-sm font-semibold">{success}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-950/40 border border-red-500/50 text-red-200 p-4 rounded-xl flex items-center gap-3 animate-fadeIn">
          <AlertTriangle className="text-red-500 flex-shrink-0" />
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      {/* Main Grid: Form Left, Deudas Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Create New Lot Form */}
        <div className="lg:col-span-1 glass-panel p-6 space-y-4">
          <h3 className="text-base font-sports font-bold text-white flex items-center gap-2 border-b border-carbon-800 pb-3">
            <Plus size={18} className="text-neonCyan" /> Registrar Nuevo Lote
          </h3>

          <form onSubmit={handleCrearLote} className="space-y-4">
            
            {/* Nombre Lote */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-carbon-500">IDENTIFICADOR / NOMBRE DE LOTE</label>
              <input
                type="text"
                placeholder="Ej. Importacion Albumes Qatar Mayo 2026"
                value={nombreLote}
                onChange={(e) => setNombreLote(e.target.value)}
                className="bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-neonCyan"
                required
              />
            </div>

            {/* Financiador */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-carbon-500">ORIGEN DE CAPITAL (FINANCIADOR)</label>
              <select
                value={financiador}
                onChange={(e) => setFinanciador(e.target.value)}
                className="bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-neonCyan"
              >
                <option value="DUENO_A">Dueño A (Fondo A)</option>
                <option value="DUENO_B">Dueño B (Fondo B)</option>
                <option value="INVERSIONISTA_EXTERNO">Inversionista Externo / Deuda</option>
              </select>
            </div>

            {/* Inversionista Fields (conditional) */}
            {financiador === 'INVERSIONISTA_EXTERNO' && (
              <div className="bg-carbon-950 p-3 rounded-xl border border-carbon-800 space-y-3 animate-fadeIn">
                
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-carbon-500">NOMBRE INVERSIONISTA</label>
                  <input
                    type="text"
                    placeholder="Ej. Juan Perez"
                    value={nombreInversionista}
                    onChange={(e) => setNombreInversionista(e.target.value)}
                    className="bg-carbon-800 border border-carbon-700 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-carbon-500">MONTO DEUDA PRESTADA</label>
                  <input
                    type="number"
                    placeholder="COP"
                    value={deudaInicial}
                    onChange={(e) => setDeudaInicial(e.target.value)}
                    className="bg-carbon-800 border border-carbon-700 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-carbon-500">% GANANCIAS PARA AMORTIZACIÓN</label>
                  <input
                    type="number"
                    placeholder="%"
                    min="1"
                    max="100"
                    value={porcentajeAmortizacion}
                    onChange={(e) => setPorcentajeAmortizacion(e.target.value)}
                    className="bg-carbon-800 border border-carbon-700 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none"
                  />
                </div>

              </div>
            )}

            {/* Producto */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-carbon-500">PRODUCTO A INGRESAR</label>
              <select
                value={productoId}
                onChange={(e) => setProductoId(e.target.value)}
                className="bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-neonCyan"
                required
              >
                <option value="">Selecciona un producto</option>
                {productos.filter(p => p.tipo !== 'COMBO').map(p => (
                  <option key={p.id} value={p.id}>{p.nombre} ({p.tipo})</option>
                ))}
              </select>
            </div>

            {/* Cantidades Iniciales */}
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-carbon-500">PACAS</label>
                <input
                  type="number"
                  placeholder="0"
                  value={cantPacas}
                  onChange={(e) => setCantPacas(e.target.value)}
                  className="bg-carbon-800 border border-carbon-700 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-carbon-500">CAJAS</label>
                <input
                  type="number"
                  placeholder="0"
                  value={cantCajas}
                  onChange={(e) => setCantCajas(e.target.value)}
                  className="bg-carbon-800 border border-carbon-700 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-carbon-500">UNIDADES</label>
                <input
                  type="number"
                  placeholder="0"
                  value={cantUnidades}
                  onChange={(e) => setCantUnidades(e.target.value)}
                  className="bg-carbon-800 border border-carbon-700 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none"
                />
              </div>
            </div>

            {/* Costos Compra Congelados */}
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-carbon-500">COSTO PACA</label>
                <input
                  type="number"
                  placeholder="COP"
                  value={costoPaca}
                  onChange={(e) => setCostoPaca(e.target.value)}
                  className="bg-carbon-800 border border-carbon-700 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-carbon-500">COSTO CAJA</label>
                <input
                  type="number"
                  placeholder="COP"
                  value={costoCaja}
                  onChange={(e) => setCostoCaja(e.target.value)}
                  className="bg-carbon-800 border border-carbon-700 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-carbon-500">COSTO UNID</label>
                <input
                  type="number"
                  placeholder="COP"
                  value={costoUnidad}
                  onChange={(e) => setCostoUnidad(e.target.value)}
                  className="bg-carbon-800 border border-carbon-700 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full text-center py-2.5 rounded-xl font-sports font-bold text-xs tracking-wider transition-all duration-300 ${
                loading
                  ? 'bg-carbon-800 text-carbon-600 border-carbon-700 cursor-not-allowed'
                  : 'neon-btn-cyan shadow-neon-cyan'
              }`}
            >
              {loading ? 'Registrando entrada...' : 'INGRESAR NUEVO LOTE'}
            </button>

          </form>
        </div>

        {/* Right Side: List of Lotes & Debt control */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Debts Tracker */}
          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-base font-sports font-bold text-white flex items-center gap-2 border-b border-carbon-800 pb-3">
              <DollarSign size={18} className="text-red-500" /> Amortizaciones y Saldos Pendientes (Inversionistas)
            </h3>

            {deudas.length === 0 ? (
              <div className="p-8 text-center text-carbon-600 font-semibold border-2 border-dashed border-carbon-800 rounded-xl">
                No hay deudas activas registradas con inversionistas externos en este momento.
              </div>
            ) : (
              <div className="space-y-4">
                {deudas.map((lote) => {
                  const pagado = (lote.montoPrestado || 0) - (lote.saldoPendiente || 0);
                  const pct = lote.montoPrestado > 0 ? (pagado / lote.montoPrestado) * 100 : 0;
                  
                  return (
                    <div key={lote.id} className="bg-carbon-900 border border-carbon-800 p-4 rounded-xl space-y-3 relative overflow-hidden">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-bold tracking-widest text-neonCyan bg-neonCyan/10 px-2 py-0.5 rounded-full border border-neonCyan/30">
                            DEUDA ACTIVA - {lote.porcentajeGananciaAmortizacion}% AMORTIZACIÓN
                          </span>
                          <h4 className="text-base font-sports font-bold text-white mt-1.5">{lote.nombreLote}</h4>
                          <span className="text-xs text-carbon-500 font-medium">Inversionista: {lote.nombreInversionista || 'Externo'}</span>
                        </div>

                        {/* Actions: pay debt manually */}
                        <div className="text-right flex items-center gap-2 sm:self-start">
                          <button
                            onClick={() => setShowAbonoForm(showAbonoForm === lote.id ? null : lote.id)}
                            className="bg-carbon-800 border border-carbon-700 hover:border-carbon-600 text-zinc-100 font-bold px-3 py-1.5 rounded-lg text-xs transition-all"
                          >
                            {showAbonoForm === lote.id ? 'Cancelar' : 'Abono Manual'}
                          </button>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-carbon-500 font-medium">
                          <span>Progreso de Amortización</span>
                          <span className="text-neonCyan font-bold">{pct.toFixed(1)}%</span>
                        </div>
                        <div className="w-full h-2.5 bg-carbon-800 rounded-full overflow-hidden border border-carbon-700">
                          <div 
                            className="h-full bg-neonCyan transition-all duration-500" 
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[11px] font-bold text-carbon-500 mt-1">
                          <span>Abonado: <span className="text-white">{formatCOP(pagado)}</span></span>
                          <span>Saldo Pendiente: <span className="text-red-400">{formatCOP(lote.saldoPendiente)}</span></span>
                        </div>
                      </div>

                      {/* Inline Manual Abono Form */}
                      {showAbonoForm === lote.id && (
                        <form onSubmit={handleRegistrarAbono} className="bg-carbon-950 p-4 rounded-xl border border-carbon-800 mt-4 space-y-3 animate-fadeIn">
                          <h5 className="text-xs font-sports font-bold text-white flex items-center gap-1.5">
                            <Plus size={12} /> Registrar Abono Manual a la Deuda
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1">
                              <label className="text-[9px] font-bold text-carbon-500">MONTO DEL ABONO (COP)</label>
                              <input
                                type="number"
                                placeholder="COP"
                                value={abonoMonto}
                                onChange={(e) => setAbonoMonto(e.target.value)}
                                className="bg-carbon-800 border border-carbon-700 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none"
                                required
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-[9px] font-bold text-carbon-500">NOTAS / CONCEPTO</label>
                              <input
                                type="text"
                                placeholder="Concepto del abono manual"
                                value={abonoNotas}
                                onChange={(e) => setAbonoNotas(e.target.value)}
                                className="bg-carbon-800 border border-carbon-700 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none"
                              />
                            </div>
                          </div>
                          <button
                            type="submit"
                            disabled={loading}
                            className="bg-neonCyan text-black hover:bg-black hover:text-neonCyan border border-neonCyan font-sports font-bold text-xs px-4 py-2 rounded-lg transition-all"
                          >
                            {loading ? 'Procesando abono...' : 'ABONAR A LA DEUDA'}
                          </button>
                        </form>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* List of all registered Lotes */}
          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-base font-sports font-bold text-white flex items-center gap-2 border-b border-carbon-800 pb-3">
              <ListOrdered size={18} className="text-neonCyan" /> Lotes de Fondeo Registrados (Histórico)
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-carbon-900 border-b border-carbon-800 text-[10px] font-bold text-carbon-500 tracking-wider">
                    <th className="px-4 py-2">LOTE</th>
                    <th className="px-4 py-2">FINANCIADOR</th>
                    <th className="px-4 py-2 text-right">MONTO PRESTADO</th>
                    <th className="px-4 py-2 text-right">SALDO ACTUAL</th>
                    <th className="px-4 py-2 text-center">ESTADO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-carbon-800/60 text-xs">
                  {lotes.map((lote) => (
                    <tr key={lote.id} className="hover:bg-carbon-850 transition-colors">
                      <td className="px-4 py-3 font-semibold text-white">{lote.nombreLote}</td>
                      <td className="px-4 py-3 text-carbon-500">
                        {lote.financiador === 'DUENO_A' ? 'Fondo Dueño A' :
                         lote.financiador === 'DUENO_B' ? 'Fondo Dueño B' :
                         `Inversionista: ${lote.nombreInversionista || 'Externo'}`}
                      </td>
                      <td className="px-4 py-3 text-right font-sports font-bold text-zinc-300">
                        {lote.montoPrestado > 0 ? formatCOP(lote.montoPrestado) : '-'}
                      </td>
                      <td className="px-4 py-3 text-right font-sports font-bold text-zinc-300">
                        {lote.montoPrestado > 0 ? formatCOP(lote.saldoPendiente) : '-'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-[9px] font-bold tracking-widest px-2 py-0.5 rounded-full border ${
                          lote.estado === 'LIQUIDADO' 
                            ? 'bg-neonGreen/10 border-neonGreen/30 text-neonGreen' 
                            : 'bg-neonCyan/10 border-neonCyan/30 text-neonCyan'
                        }`}>
                          {lote.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default LotesDeudasView;
