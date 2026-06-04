import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  TrendingDown, 
  Plus, 
  Truck, 
  Car, 
  Coffee, 
  HelpCircle, 
  Briefcase, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  DollarSign
} from 'lucide-react';

function GastosHormigaView() {
  const [gastos, setGastos] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form State
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [categoria, setCategoria] = useState('FLETE');
  const [loteInversionistaId, setLoteInversionistaId] = useState('');

  const loadData = async () => {
    setError(null);
    try {
      const allGastos = await api.listarGastos();
      const allLotes = await api.listarLotes();
      setGastos(allGastos || []);
      setLotes(allLotes || []);
    } catch (err) {
      console.error(err);
      setError('Error al obtener la lista de gastos y lotes del servidor.');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCrearGasto = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!descripcion.trim() || !monto || Number(monto) <= 0) {
      setError('Por favor, ingresa una descripción y un monto válido.');
      return;
    }

    setLoading(true);

    const payload = {
      descripcion: descripcion.trim(),
      monto: Number(monto),
      categoria: categoria,
      loteInversionistaId: loteInversionistaId ? Number(loteInversionistaId) : null
    };

    try {
      await api.registrarGasto(payload);
      setSuccess('¡Gasto hormiga registrado con éxito!');
      
      // Reset form
      setDescripcion('');
      setMonto('');
      setCategoria('FLETE');
      setLoteInversionistaId('');

      // Reload data
      loadData();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al registrar el gasto.');
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const formatCOP = (val) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(val || 0);
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'FLETE':
        return <Truck size={16} />;
      case 'TRANSPORTE':
        return <Car size={16} />;
      case 'ALIMENTACION':
        return <Coffee size={16} />;
      default:
        return <HelpCircle size={16} />;
    }
  };

  const getCategoryStyle = (cat) => {
    switch (cat) {
      case 'FLETE':
        return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
      case 'TRANSPORTE':
        return 'bg-purple-500/10 border-purple-500/30 text-purple-400';
      case 'ALIMENTACION':
        return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
      default:
        return 'bg-zinc-500/10 border-zinc-500/30 text-zinc-400';
    }
  };

  const getCategoryLabel = (cat) => {
    switch (cat) {
      case 'FLETE': return 'Flete';
      case 'TRANSPORTE': return 'Transporte';
      case 'ALIMENTACION': return 'Alimentación';
      case 'OTRO': return 'Otro';
      default: return cat;
    }
  };

  // Calculations
  const totalMonto = gastos.reduce((sum, g) => sum + (g.monto || 0), 0);
  const totalFletes = gastos.filter(g => g.categoria === 'FLETE').reduce((sum, g) => sum + (g.monto || 0), 0);
  const totalTransporte = gastos.filter(g => g.categoria === 'TRANSPORTE').reduce((sum, g) => sum + (g.monto || 0), 0);
  const totalAlimentacion = gastos.filter(g => g.categoria === 'ALIMENTACION').reduce((sum, g) => sum + (g.monto || 0), 0);
  const totalOtro = gastos.filter(g => g.categoria === 'OTRO').reduce((sum, g) => sum + (g.monto || 0), 0);

  const getPercentage = (val) => {
    if (totalMonto === 0) return 0;
    return (val / totalMonto) * 100;
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-carbon-900 border border-carbon-800 p-4 rounded-2xl shadow-lg">
        <div>
          <h2 className="text-2xl font-sports font-bold text-white flex items-center gap-3">
            <TrendingDown className="text-red-500 animate-bounce" /> Gastos Hormiga y Fugas de Dinero
          </h2>
          <p className="text-xs text-carbon-500 font-medium">Registro ágil de egresos cotidianos para deducir de la utilidad bruta real</p>
        </div>
      </div>

      {success && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-center gap-3 shadow-red-500/20 animate-fadeIn">
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

      {/* KPI Cards section */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        
        {/* Total General Card */}
        <div className="col-span-2 md:col-span-1 glass-panel p-4 flex flex-col justify-between border-l-4 border-l-red-500">
          <div>
            <span className="text-[9px] font-bold text-carbon-500 tracking-wider">TOTAL EGRESOS</span>
            <h4 className="text-lg font-sports font-bold text-white mt-1">{formatCOP(totalMonto)}</h4>
          </div>
          <span className="text-[10px] text-red-500 font-semibold mt-2">100% Acumulado</span>
        </div>

        {/* Fletes Card */}
        <div className="glass-panel p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold text-carbon-500 tracking-wider">FLETES</span>
            <Truck size={14} className="text-blue-400" />
          </div>
          <div className="mt-2">
            <h4 className="text-base font-sports font-bold text-white">{formatCOP(totalFletes)}</h4>
            <span className="text-[10px] text-blue-400 font-bold">{getPercentage(totalFletes).toFixed(1)}%</span>
          </div>
        </div>

        {/* Transporte Card */}
        <div className="glass-panel p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold text-carbon-500 tracking-wider">TRANSPORTE</span>
            <Car size={14} className="text-purple-400" />
          </div>
          <div className="mt-2">
            <h4 className="text-base font-sports font-bold text-white">{formatCOP(totalTransporte)}</h4>
            <span className="text-[10px] text-purple-400 font-bold">{getPercentage(totalTransporte).toFixed(1)}%</span>
          </div>
        </div>

        {/* Alimentacion Card */}
        <div className="glass-panel p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold text-carbon-500 tracking-wider">ALIMENTACIÓN</span>
            <Coffee size={14} className="text-amber-400" />
          </div>
          <div className="mt-2">
            <h4 className="text-base font-sports font-bold text-white">{formatCOP(totalAlimentacion)}</h4>
            <span className="text-[10px] text-amber-400 font-bold">{getPercentage(totalAlimentacion).toFixed(1)}%</span>
          </div>
        </div>

        {/* Otro Card */}
        <div className="glass-panel p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold text-carbon-500 tracking-wider">OTROS</span>
            <HelpCircle size={14} className="text-zinc-400" />
          </div>
          <div className="mt-2">
            <h4 className="text-base font-sports font-bold text-white">{formatCOP(totalOtro)}</h4>
            <span className="text-[10px] text-zinc-400 font-bold">{getPercentage(totalOtro).toFixed(1)}%</span>
          </div>
        </div>

      </div>

      {/* Main Grid: Form Left, List Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Form to Register Gasto */}
        <div className="lg:col-span-1 glass-panel p-6 space-y-4">
          <h3 className="text-base font-sports font-bold text-white flex items-center gap-2 border-b border-carbon-800 pb-3">
            <Plus size={18} className="text-red-500" /> Registrar Gasto Rápido
          </h3>

          <form onSubmit={handleCrearGasto} className="space-y-4">
            
            {/* Monto del Gasto */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-carbon-500">VALOR DEL GASTO (COP)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-zinc-500 font-bold text-xs">COP</span>
                <input
                  type="number"
                  placeholder="Ej. 15000"
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  className="bg-carbon-800 border border-carbon-700 rounded-xl pl-12 pr-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-red-500 w-full"
                  required
                />
              </div>
            </div>

            {/* Categoría */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-carbon-500">CATEGORÍA DE EGRESO</label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-red-500 w-full"
              >
                <option value="FLETE">Flete / Envíos</option>
                <option value="TRANSPORTE">Transporte / Gasolina</option>
                <option value="ALIMENTACION">Alimentación / Refrigerios</option>
                <option value="OTRO">Otro / Imprevistos</option>
              </select>
            </div>

            {/* Lote Inversionista (opcional) */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-carbon-500">ASOCIAR A UN LOTE (OPCIONAL)</label>
              <select
                value={loteInversionistaId}
                onChange={(e) => setLoteInversionistaId(e.target.value)}
                className="bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-red-500 w-full"
              >
                <option value="">Gasto General (Ningún lote)</option>
                {lotes.map(lote => (
                  <option key={lote.id} value={lote.id}>
                    {lote.nombreLote} ({lote.financiador === 'DUENO_A' ? 'Fondo A' : lote.financiador === 'DUENO_B' ? 'Fondo B' : 'Externo'})
                  </option>
                ))}
              </select>
              <span className="text-[9px] text-carbon-500 font-medium mt-1 leading-normal">
                Asociar a un lote permite rastrear este egreso directamente contra la utilidad de esa financiación específica.
              </span>
            </div>

            {/* Descripción */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-carbon-500">DESCRIPCIÓN / DETALLE</label>
              <textarea
                placeholder="Ej. Peajes e hidratación entrega lote Qatar"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-red-500 h-20 resize-none w-full"
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full text-center py-2.5 rounded-xl font-sports font-bold text-xs tracking-wider transition-all duration-300 ${
                loading
                  ? 'bg-carbon-800 text-carbon-600 border-carbon-700 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-black hover:text-red-500 border border-red-600 text-white shadow-md shadow-red-600/20'
              }`}
            >
              {loading ? 'REGISTRANDO...' : 'REGISTRAR GASTO HORMIGA'}
            </button>

          </form>
        </div>

        {/* List of Recent Gastos */}
        <div className="lg:col-span-2 glass-panel p-6 space-y-4">
          <h3 className="text-base font-sports font-bold text-white flex items-center gap-2 border-b border-carbon-800 pb-3">
            <DollarSign size={18} className="text-red-500" /> Historial de Egresos Registrados
          </h3>

          {gastos.length === 0 ? (
            <div className="p-12 text-center text-carbon-600 font-semibold border-2 border-dashed border-carbon-800 rounded-xl">
              No hay egresos registrados. Tus gastos hormiga aparecerán aquí.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-carbon-900 border-b border-carbon-800 text-[10px] font-bold text-carbon-500 tracking-wider">
                    <th className="px-4 py-3">FECHA</th>
                    <th className="px-4 py-3">DESCRIPCIÓN</th>
                    <th className="px-4 py-3">CATEGORÍA</th>
                    <th className="px-4 py-3">LOTE ASOCIADO</th>
                    <th className="px-4 py-3 text-right">MONTO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-carbon-800/60 text-xs">
                  {[...gastos].reverse().map((g) => {
                    const fecha = new Date(g.fechaGasto);
                    const formattedFecha = fecha.toLocaleDateString('es-CO', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    });

                    return (
                      <tr key={g.id} className="hover:bg-carbon-850 transition-colors">
                        {/* Fecha */}
                        <td className="px-4 py-3 text-carbon-400 flex items-center gap-1.5 whitespace-nowrap">
                          <Calendar size={12} className="text-carbon-500" />
                          {formattedFecha}
                        </td>

                        {/* Descripción */}
                        <td className="px-4 py-3 font-semibold text-white max-w-[200px] truncate" title={g.descripcion}>
                          {g.descripcion}
                        </td>

                        {/* Categoría */}
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[9px] font-bold tracking-wider ${getCategoryStyle(g.categoria)}`}>
                            {getCategoryIcon(g.categoria)}
                            {getCategoryLabel(g.categoria)}
                          </span>
                        </td>

                        {/* Lote */}
                        <td className="px-4 py-3 text-carbon-400">
                          {g.loteInversionista ? (
                            <div className="flex items-center gap-1.5">
                              <Briefcase size={12} className="text-neonCyan flex-shrink-0" />
                              <span className="truncate max-w-[120px]" title={g.loteInversionista.nombreLote}>
                                {g.loteInversionista.nombreLote}
                              </span>
                            </div>
                          ) : (
                            <span className="text-carbon-600 italic">General</span>
                          )}
                        </td>

                        {/* Monto */}
                        <td className="px-4 py-3 text-right font-sports font-bold text-red-400 whitespace-nowrap">
                          {formatCOP(g.monto)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

export default GastosHormigaView;
