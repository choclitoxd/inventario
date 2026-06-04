import React from 'react';
import { Card, Title, BarChart } from '@tremor/react';
import { AlertTriangle } from 'lucide-react';

function PriceFluctuationChart({ fluctuacionData, loading, formatCOP }) {
  // Mapear y limitar a los últimos 8 registros para evitar saturar el gráfico
  const mappedFluctuacion = (fluctuacionData || []).map(item => ({
    name: `${item.productoNombre} (${item.nivelStock})`,
    "Costo Compra": Number(item.costoCompra || 0),
    "Precio Venta": Number(item.precioVenta || 0),
    "Diferencia": Number(item.precioVenta || 0) - Number(item.costoCompra || 0)
  })).slice(-8);

  return (
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
  );
}

export default PriceFluctuationChart;
