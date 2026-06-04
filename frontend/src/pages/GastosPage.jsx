import React from 'react';
import useGastos from '../hooks/useGastos';
import GastosKpiGrid from '../components/features/gastos/GastosKpiGrid';
import CrearGastoForm from '../components/features/gastos/CrearGastoForm';
import HistorialGastosTable from '../components/features/gastos/HistorialGastosTable';
import ErrorMessage from '../components/common/ErrorMessage';
import { TrendingDown, CheckCircle } from 'lucide-react';

function GastosPage() {
  const {
    gastos,
    lotes,
    loading,
    error,
    success,
    descripcion,
    setDescripcion,
    monto,
    setMonto,
    categoria,
    setCategoria,
    loteInversionistaId,
    setLoteInversionistaId,
    handleCrearGasto,
    formatCOP,
    totalMonto,
    totalFletes,
    totalTransporte,
    totalAlimentacion,
    totalOtro,
    getPercentage
  } = useGastos();

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

      <ErrorMessage message={error} />

      <GastosKpiGrid
        totalMonto={totalMonto}
        totalFletes={totalFletes}
        totalTransporte={totalTransporte}
        totalAlimentacion={totalAlimentacion}
        totalOtro={totalOtro}
        getPercentage={getPercentage}
        formatCOP={formatCOP}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CrearGastoForm
          descripcion={descripcion}
          setDescripcion={setDescripcion}
          monto={monto}
          setMonto={setMonto}
          categoria={categoria}
          setCategoria={setCategoria}
          loteInversionistaId={loteInversionistaId}
          setLoteInversionistaId={setLoteInversionistaId}
          lotes={lotes}
          loading={loading}
          onSubmit={handleCrearGasto}
        />

        <HistorialGastosTable
          gastos={gastos}
          formatCOP={formatCOP}
        />
      </div>
    </div>
  );
}

export default GastosPage;
