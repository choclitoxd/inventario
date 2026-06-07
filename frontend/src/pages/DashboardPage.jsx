import React, { useState } from 'react';
import useDashboard from '../hooks/useDashboard';
import DashboardFilters from '../components/features/dashboard/DashboardFilters';
import KpiGrid from '../components/features/dashboard/KpiGrid';
import ChartsSection from '../components/features/dashboard/ChartsSection';
import PriceFluctuationChart from '../components/features/dashboard/PriceFluctuationChart';
import ErrorMessage from '../components/common/ErrorMessage';
import { api } from '../services/api';
import { exportToExcel } from '../utils/excelExport';

function DashboardPage() {
  const [exporting, setExporting] = useState(false);
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
    formatCOP
  } = useDashboard();

  const handleExportExcel = async () => {
    setExporting(true);
    try {
      const [ventas, gastos, inventario] = await Promise.all([
        api.listarVentas(),
        api.listarGastos(),
        api.listarInventario()
      ]);

      let filteredVentas = [...ventas];
      let filteredGastos = [...gastos];

      if (filterType !== 'todos') {
        const now = new Date();
        let desde = null;
        let hasta = null;

        if (filterType === 'hoy') {
          desde = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        } else if (filterType === 'semana') {
          desde = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        } else if (filterType === 'mes') {
          desde = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        } else if (filterType === 'personalizado') {
          if (fechaDesde) desde = new Date(fechaDesde);
          if (fechaHasta) hasta = new Date(fechaHasta);
        }

        if (desde) {
          filteredVentas = filteredVentas.filter(v => new Date(v.fechaVenta) >= desde);
          filteredGastos = filteredGastos.filter(g => new Date(g.fechaGasto) >= desde);
        }
        if (hasta) {
          filteredVentas = filteredVentas.filter(v => new Date(v.fechaVenta) <= hasta);
          filteredGastos = filteredGastos.filter(g => new Date(g.fechaGasto) <= hasta);
        }
      }

      const desc = filterType === 'personalizado' 
        ? `${fechaDesde || 'inicio'}_a_${fechaHasta || 'fin'}`
        : filterType;

      exportToExcel(filteredVentas, filteredGastos, inventario, desc);
    } catch (err) {
      console.error(err);
      alert('Error al exportar el informe contable. Intente de nuevo.');
    } finally {
      setExporting(false);
    }
  };

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
