import React from 'react';
import { Truck, Car, Coffee, HelpCircle, Briefcase, Calendar, DollarSign } from 'lucide-react';

const getCategoryIcon = (cat) => {
  switch (cat) {
    case 'FLETE':
      return <Truck size={12} />;
    case 'TRANSPORTE':
      return <Car size={12} />;
    case 'ALIMENTACION':
      return <Coffee size={12} />;
    default:
      return <HelpCircle size={12} />;
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

function HistorialGastosTable({ gastos, formatCOP }) {
  return (
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
              <tr className="bg-carbon-900 border-b border-carbon-800 text-[10px] font-bold text-carbon-500 tracking-wider font-sports">
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
  );
}

export default HistorialGastosTable;
