import React from 'react';
import useDashboard from '../hooks/useDashboard';
import DashboardFilters from '../components/features/dashboard/DashboardFilters';
import KpiGrid from '../components/features/dashboard/KpiGrid';
import ChartsSection from '../components/features/dashboard/ChartsSection';
import PriceFluctuationChart from '../components/features/dashboard/PriceFluctuationChart';
import ErrorMessage from '../components/common/ErrorMessage';

function DashboardPage() {
  const {
    resumen,
    capitalData,
    fluctuacionData,
    loading,
    error,
    filterType,
    setFilterType,
    fechaDesde,
    setFechaDesde,
    fechaHasta,
    setFechaHasta,
    fetchDashboardData,
    formatCOP,
    exporting,
    handleExportExcel
  } = useDashboard();

  return (
    <div className="space-y-6">
      <DashboardFilters
        filterType={filterType}
        setFilterType={setFilterType}
        fechaDesde={fechaDesde}
        setFechaDesde={setFechaDesde}
        fechaHasta={fechaHasta}
        setFechaHasta={setFechaHasta}
        onRefresh={fetchDashboardData}
        onExport={handleExportExcel}
        exporting={exporting}
      />

      <ErrorMessage message={error} />

      <KpiGrid
        resumen={resumen}
        formatCOP={formatCOP}
      />

      <ChartsSection
        resumen={resumen}
        capitalData={capitalData}
        loading={loading}
        formatCOP={formatCOP}
      />

      <PriceFluctuationChart
        fluctuacionData={fluctuacionData}
        loading={loading}
        formatCOP={formatCOP}
      />
    </div>
  );
}

export default DashboardPage;
