import React from 'react';
import { AreaChart, BarChart, Card, Title } from '@tremor/react';

function ChartsSection({ resumen, capitalData, loading, formatCOP }) {
  // Datos simulados de tendencia de ventas (para mantener la estética original)
  const salesTrendData = [
    { Date: 'Semana 1', Ventas: (resumen?.totalVentas || 0) * 0.2, Utilidad: (resumen?.utilidadNeta || 0) * 0.2 },
    { Date: 'Semana 2', Ventas: (resumen?.totalVentas || 0) * 0.5, Utilidad: (resumen?.utilidadNeta || 0) * 0.45 },
    { Date: 'Semana 3', Ventas: (resumen?.totalVentas || 0) * 0.7, Utilidad: (resumen?.utilidadNeta || 0) * 0.65 },
    { Date: 'Semana 4', Ventas: resumen?.totalVentas || 0, Utilidad: resumen?.utilidadNeta || 0 }
  ];

  // Mapear los datos de segmentación de capital
  const mappedCapital = (capitalData || []).map(item => ({
    name: item.origenCapital === 'DUENO_A' ? 'Dueño A' : item.origenCapital === 'DUENO_B' ? 'Dueño B' : 'Externos/Deuda',
    "Ventas": Number(item.totalVentas || 0),
    "Ganancia Lote": Number(item.utilidadBruta || 0),
    "Deuda Amortizada": Number(item.amortizadoTotal || 0),
    "Deuda Pendiente": Number(item.saldoPendienteTotal || 0)
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Tendencia de Ventas y Utilidades */}
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

      {/* Segmentación de Capital e Inversionistas */}
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
  );
}

export default ChartsSection;
