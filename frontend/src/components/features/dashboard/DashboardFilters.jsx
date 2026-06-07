import React from 'react';
import { Calendar, RefreshCw, Download } from 'lucide-react';

function DashboardFilters({ 
  filterType, 
  setFilterType, 
  fechaDesde, 
  setFechaDesde, 
  fechaHasta, 
  setFechaHasta, 
  onRefresh,
  onExport,
  exporting
}) {
  return (
    <div className="space-y-4">
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
            onClick={onExport}
            disabled={exporting}
            className="bg-neonGreen hover:bg-neonGreen/80 disabled:bg-carbon-800 disabled:text-carbon-600 text-black font-sports font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-neon-green/20"
            title="Exportar Informe Contable (.XLSX)"
          >
            {exporting ? (
              <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download size={14} />
            )}
            <span>Exportar Excel</span>
          </button>

          <button 
            onClick={onRefresh}
            className="bg-carbon-800 hover:bg-carbon-700 text-zinc-100 border border-carbon-700 p-2.5 rounded-xl transition-all"
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
    </div>
  );
}

export default DashboardFilters;
