import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, Briefcase } from 'lucide-react';
import KpiCard from '../../common/KpiCard';

function KpiGrid({ resumen, formatCOP }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Ventas */}
      <KpiCard 
        title="VENTAS BRUTAS"
        value={formatCOP(resumen.totalVentas)}
        subtext="Ingreso bruto de caja"
        icon={DollarSign}
        accentColor="green"
      />

      {/* Utilidad Bruta */}
      <KpiCard 
        title="UTILIDAD BRUTA"
        value={formatCOP(resumen.utilidadBruta)}
        subtext="Margen de ventas sin fletes"
        icon={TrendingUp}
        accentColor="cyan"
      />

      {/* Gastos Hormiga */}
      <KpiCard 
        title="GASTOS HORMIGA"
        value={formatCOP(resumen.totalGastos)}
        subtext="Fugas cotidianas restadas"
        icon={TrendingDown}
        accentColor="red"
      />

      {/* Utilidad Neta */}
      <KpiCard 
        title="UTILIDAD NETA REAL"
        value={formatCOP(resumen.utilidadNeta)}
        subtext="Ganancia limpia consolidada"
        icon={Briefcase}
        accentColor="green"
      />
    </div>
  );
}

export default KpiGrid;
