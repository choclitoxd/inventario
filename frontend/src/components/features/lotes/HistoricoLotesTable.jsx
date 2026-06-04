import React from 'react';
import { ListOrdered } from 'lucide-react';

function HistoricoLotesTable({ lotes, formatCOP }) {
  return (
    <div className="glass-panel p-6 space-y-4">
      <h3 className="text-base font-sports font-bold text-white flex items-center gap-2 border-b border-carbon-800 pb-3">
        <ListOrdered size={18} className="text-neonCyan" /> Lotes de Fondeo Registrados (Histórico)
      </h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-carbon-900 border-b border-carbon-800 text-[10px] font-bold text-carbon-500 tracking-wider">
              <th className="px-4 py-2">LOTE</th>
              <th className="px-4 py-2">FINANCIADOR</th>
              <th className="px-4 py-2 text-right">MONTO PRESTADO</th>
              <th className="px-4 py-2 text-right">SALDO ACTUAL</th>
              <th className="px-4 py-2 text-center">ESTADO</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-carbon-800/60 text-xs">
            {lotes.map((lote) => (
              <tr key={lote.id} className="hover:bg-carbon-850 transition-colors">
                <td className="px-4 py-3 font-semibold text-white">{lote.nombreLote}</td>
                <td className="px-4 py-3 text-carbon-500">
                  {lote.financiador === 'DUENO_A' ? 'Fondo Dueño A' :
                   lote.financiador === 'DUENO_B' ? 'Fondo Dueño B' :
                   `Inversionista: ${lote.nombreInversionista || 'Externo'}`}
                </td>
                <td className="px-4 py-3 text-right font-sports font-bold text-zinc-300">
                  {lote.montoPrestado > 0 ? formatCOP(lote.montoPrestado) : '-'}
                </td>
                <td className="px-4 py-3 text-right font-sports font-bold text-zinc-300">
                  {lote.montoPrestado > 0 ? formatCOP(lote.saldoPendiente) : '-'}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`text-[9px] font-bold tracking-widest px-2 py-0.5 rounded-full border ${
                    lote.estado === 'LIQUIDADO' 
                      ? 'bg-neonGreen/10 border-neonGreen/30 text-neonGreen' 
                      : 'bg-neonCyan/10 border-neonCyan/30 text-neonCyan'
                  }`}>
                    {lote.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HistoricoLotesTable;
