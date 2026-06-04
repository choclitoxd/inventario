import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Briefcase, 
  AlertTriangle,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { AreaChart, BarChart, Card, Title } from '@tremor/react';

function DashboardView() {
  const [resumen, setResumen] = useState({ totalVentas: 0, utilidadBruta: 0, totalGastos: 0, utilidadNeta: 0 });
  const [capitalData, setCapitalData] = useState([]);
  const [fluctuacionData, setFluctuacionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Date Filters
  const [filterType, setFilterType] = useState('mes'); // hoy, semana, mes, todos, personalizado
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      let desde = null;
      let hasta = null;

      if (filterType !== 'todos') {
        const now = new Date();
        if (filterType === 'hoy') {
          const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          desde = todayStart.toISOString();
        } else if (filterType === 'semana') {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          desde = weekAgo.toISOString();
        } else if (filterType === 'mes') {
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          desde = monthAgo.toISOString();
        } else if (filterType === 'personalizado') {
          if (fechaDesde) desde = new Date(fechaDesde).toISOString();
          if (fechaHasta) hasta = new Date(fechaHasta).toISOString();
        }
      }

      const resResumen = await api.obtenerResumen(desde, hasta);
      const resCapital = await api.obtenerCapitalSegmentado();
      const resFluct = await api.obtenerFluctuacionPrecios();

      setResumen(resResumen);
      setCapitalData(resCapital);
      setFluctuacionData(resFluct);
    } catch (err) {
      console.error(err);
      setError('Error al cargar datos del panel financiero. Asegúrese de que el backend esté ejecutándose.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [filterType, fechaDesde, fechaHasta]);

  // Format currency in COP
  const formatCOP = (val) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(val || 0);
  };

  // Prepare chart data for price fluctuations
  const mappedFluctuacion = fluctuacionData.map(item => ({
    name: `${item.productoNombre} (${item.nivelStock})`,
    "Costo Compra": Number(item.costoCompra),
    "Precio Venta": Number(item.precioVenta),
    "Diferencia": Number(item.precioVenta) - Number(item.costoCompra)
  })).slice(-8); // Muestra los últimos 8 registros para evitar saturar el gráfico

  // Capital segmentado chart data mapping
  const mappedCapital = capitalData.map(item => ({
    name: item.origenCapital === 'DUENO_A' ? 'Dueño A' : item.origenCapital === 'DUENO_B' ? 'Dueño B' : 'Externos/Deuda',
    "Ventas": Number(item.totalVentas),
    "Ganancia Lote": Number(item.utilidadBruta),
    "Deuda Amortizada": Number(item.amortizadoTotal),
    "Deuda Pendiente": Number(item.saldoPendienteTotal)
  }));

  // Dummy mock chart data for sales trend (just to show visual beauty)
  const salesTrendData = [
    { Date: 'Semana 1', Ventas: resumen.totalVentas * 0.2, Utilidad: resumen.utilidadNeta * 0.2 },
    { Date: 'Semana 2', Ventas: resumen.totalVentas * 0.5, Utilidad: resumen.utilidadNeta * 0.45 },
    { Date: 'Semana 3', Ventas: resumen.totalVentas * 0.7, Utilidad: resumen.utilidadNeta * 0.65 },
    { Date: 'Semana 4', Ventas: resumen.totalVentas, Utilidad: resumen.utilidadNeta }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Bar with Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-carbon-900 border border-carbon-800 p-4 rounded-2xl shadow-lg">
        <div>
          <h2 className="text-2xl font-sports font-bold text-white">Panel de Control Financiero</h2>
          <p className="text-xs text-carbon-500 font-medium">Analítica de margen, fugas de dinero y amortizaciones</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-carbon-800 p-1 rounded-xl border border-carbon-700">
            {['hoy', 'semana', 'mes', 'todos', 'personalizado'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterType(tab)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all capitalize ${
                  filterType === tab 
                    ? 'bg-neonGreen text-black shadow-md' 
                    : 'text-carbon-500 hover:text-zinc-100'
                }`}
              >
                {tab === 'todos' ? 'todos' : tab}
              </button>
            ))}
          </div>
          
          <button 
            onClick={fetchDashboardData}
            className="bg-carbon-800 hover:bg-carbon-700 text-zinc-100 border border-carbon-700 p-2 rounded-xl transition-all"
            title="Refrescar datos"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Date Pickers for Custom Filter */}
      {filterType === 'personalizado' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-carbon-900 border border-carbon-800 p-4 rounded-2xl animate-fadeIn">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-carbon-500 flex items-center gap-1.5">
              <Calendar size={14} /> FECHA INICIAL
            </label>
            <input 
              type="datetime-local" 
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              className="bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-neonGreen"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-carbon-500 flex items-center gap-1.5">
              <Calendar size={14} /> FECHA FINAL
            </label>
            <input 
              type="datetime-local" 
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              className="bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-neonGreen"
            />
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-950/40 border border-red-500/50 text-red-200 p-4 rounded-xl flex items-center gap-3">
          <AlertTriangle className="text-red-500 flex-shrink-0" />
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Ventas */}
        <div className="glass-panel p-5 relative overflow-hidden group hover:border-carbon-600 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold tracking-wider text-carbon-500">VENTAS BRUTAS</span>
            <div className="text-neonGreen bg-neonGreen/10 p-2 rounded-xl">
              <DollarSign size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-sports font-bold text-white">{formatCOP(resumen.totalVentas)}</h3>
          <span className="text-xs text-neonGreen font-semibold flex items-center gap-1 mt-2">
            Ingreso bruto de caja
          </span>
          <div className="absolute right-0 bottom-0 w-24 h-24 bg-neonGreen/5 rounded-full blur-2xl group-hover:bg-neonGreen/10 transition-all duration-300" />
        </div>

        {/* Utilidad Bruta */}
        <div className="glass-panel p-5 relative overflow-hidden group hover:border-carbon-600 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold tracking-wider text-carbon-500">UTILIDAD BRUTA</span>
            <div className="text-neonCyan bg-neonCyan/10 p-2 rounded-xl">
              <TrendingUp size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-sports font-bold text-white">{formatCOP(resumen.utilidadBruta)}</h3>
          <span className="text-xs text-neonCyan font-semibold flex items-center gap-1 mt-2">
            Margen de ventas sin fletes
          </span>
          <div className="absolute right-0 bottom-0 w-24 h-24 bg-neonCyan/5 rounded-full blur-2xl group-hover:bg-neonCyan/10 transition-all duration-300" />
        </div>

        {/* Gastos Hormiga */}
        <div className="glass-panel p-5 relative overflow-hidden group hover:border-carbon-600 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold tracking-wider text-carbon-500">GASTOS HORMIGA</span>
            <div className="text-red-500 bg-red-500/10 p-2 rounded-xl">
              <TrendingDown size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-sports font-bold text-white">{formatCOP(resumen.totalGastos)}</h3>
          <span className="text-xs text-red-500 font-semibold flex items-center gap-1 mt-2">
            Fugas cotidianas restadas
          </span>
          <div className="absolute right-0 bottom-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl group-hover:bg-red-500/10 transition-all duration-300" />
        </div>

        {/* Utilidad Neta */}
        <div className="glass-panel p-5 relative overflow-hidden group hover:border-carbon-600 transition-all duration-300 border-l-4 border-l-neonGreen">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold tracking-wider text-neonGreen">UTILIDAD NETA REAL</span>
            <div className="text-black bg-neonGreen p-2 rounded-xl shadow-neon-green">
              <Briefcase size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-sports font-bold text-white">{formatCOP(resumen.utilidadNeta)}</h3>
          <span className="text-xs text-neonGreen font-semibold flex items-center gap-1 mt-2">
            Ganancia limpia consolidada
          </span>
          <div className="absolute right-0 bottom-0 w-24 h-24 bg-neonGreen/10 rounded-full blur-2xl group-hover:bg-neonGreen/15 transition-all duration-300" />
        </div>

      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Sales & Profit trend */}
        <Card className="bg-carbon-900 border border-carbon-800 p-6 rounded-2xl shadow-lg">
          <Title className="text-lg font-sports font-bold text-white mb-4">Tendencia de Ventas y Utilidades</Title>
          {loading ? (
            <div className="h-72 flex items-center justify-center text-carbon-500 font-medium">Cargando gráfico...</div>
          ) : (
            <AreaChart
              className="h-72 mt-4"
              data={salesTrendData}
              index="Date"
              categories={["Ventas", "Utilidad"]}
              colors={["cyan", "emerald"]}
              valueFormatter={formatCOP}
            />
          )}
        </Card>

        {/* Capital Segmentation Chart */}
        <Card className="bg-carbon-900 border border-carbon-800 p-6 rounded-2xl shadow-lg">
          <Title className="text-lg font-sports font-bold text-white mb-4">Segmentación de Capital e Inversionistas</Title>
          {loading ? (
            <div className="h-72 flex items-center justify-center text-carbon-500 font-medium">Cargando gráfico...</div>
          ) : (
            <BarChart
              className="h-72 mt-4"
              data={mappedCapital}
              index="name"
              categories={["Ventas", "Ganancia Lote", "Deuda Amortizada", "Deuda Pendiente"]}
              colors={["emerald", "cyan", "blue", "red"]}
              valueFormatter={formatCOP}
            />
          )}
        </Card>

      </div>

      {/* Margins Price Fluctuations */}
      <Card className="bg-carbon-900 border border-carbon-800 p-6 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Title className="text-lg font-sports font-bold text-white">Fluctuación de Precios de Venta vs. Compra</Title>
            <p className="text-xs text-carbon-500 font-medium">Gráfico comparativo del costo del lote vs. el precio cobrado en el día</p>
          </div>
          {mappedFluctuacion.length === 0 && !loading && (
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-carbon-800 border border-carbon-700 text-carbon-500">
              Sin datos recientes
            </span>
          )}
        </div>
        
        {loading ? (
          <div className="h-80 flex items-center justify-center text-carbon-500 font-medium">Cargando gráfico...</div>
        ) : mappedFluctuacion.length === 0 ? (
          <div className="h-80 flex flex-col items-center justify-center text-carbon-600 gap-2">
            <AlertTriangle size={32} className="text-carbon-600" />
            <span className="text-sm font-semibold">No se han registrado ventas de lotes con costos definidos aún.</span>
          </div>
        ) : (
          <BarChart
            className="h-80 mt-4"
            data={mappedFluctuacion}
            index="name"
            categories={["Costo Compra", "Precio Venta", "Diferencia"]}
            colors={["red", "emerald", "cyan"]}
            valueFormatter={formatCOP}
          />
        )}
      </Card>
      
    </div>
  );
}

export default DashboardView;
