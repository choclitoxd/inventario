import React, { useState, useMemo } from 'react';
import { Package, Search } from 'lucide-react';

function StockConsolidadoTable({ inventarioGlobal, loading, formatCOP }) {
  const [search, setSearch] = useState('');

  const filteredInventarios = useMemo(() => {
    return inventarioGlobal.filter((inv) => {
      const pName = (inv.producto?.nombre || '').toLowerCase();
      const pEd = (inv.producto?.edicionColeccion || '').toLowerCase();
      const sName = (inv.loteInversionista?.negocio?.nombre || '').toLowerCase();
      const q = search.toLowerCase();
      return pName.includes(q) || pEd.includes(q) || sName.includes(q);
    });
  }, [inventarioGlobal, search]);

  return (
    <div className="glass-panel overflow-hidden border border-carbon-800 shadow-xl flex flex-col">
      <div className="px-6 py-4 border-b border-carbon-800 bg-carbon-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-sports font-bold text-white text-base">Inventario Consolidado de Sedes</h3>
          <p className="text-[10px] text-carbon-500 font-semibold uppercase">Vista Global Sin Acciones Operativas (Solo Lectura)</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 text-carbon-500" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por producto, colección o sede..."
            className="w-full bg-carbon-950 border border-carbon-850 hover:border-carbon-700 focus:border-neonGreen/50 pl-9 pr-3 py-1.5 rounded-xl text-xs text-white focus:outline-none transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-carbon-500 font-semibold flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-neonGreen border-t-transparent rounded-full animate-spin shadow-neon-green" />
          Cargando inventarios...
        </div>
      ) : filteredInventarios.length === 0 ? (
        <div className="p-12 text-center text-carbon-600 font-semibold flex flex-col items-center gap-3">
          <Package size={48} className="text-carbon-700 font-medium" />
          <span>No se encontraron niveles de stock registrados en las sedes.</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-carbon-900 border-b border-carbon-800 text-[10px] font-bold text-carbon-500 tracking-wider font-sports">
                <th className="px-6 py-3">PRODUCTO</th>
                <th className="px-6 py-3">COLECCIÓN / EDICIÓN</th>
                <th className="px-6 py-3">SEDE</th>
                <th className="px-6 py-3 text-center">PACAS</th>
                <th className="px-6 py-3 text-center">CAJAS</th>
                <th className="px-6 py-3 text-center">SOBRES / UNIDADES</th>
                <th className="px-6 py-3 text-right">PRECIO COMPRA (CAJA/UNIDAD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-carbon-800/60">
              {filteredInventarios.map((inv) => (
                <tr key={inv.id} className="hover:bg-carbon-850/10 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-sports font-bold text-white text-sm">{inv.producto?.nombre}</div>
                    <div className="text-[9px] text-carbon-500 font-semibold mt-0.5">CÓD: {inv.producto?.codigoBarras || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 text-zinc-300 font-semibold">{inv.producto?.edicionColeccion || 'N/A'}</td>
                  <td className="px-6 py-4 font-sports font-bold text-neonCyan">{inv.loteInversionista?.negocio?.nombre || 'General'}</td>
                  <td className="px-6 py-4 text-center font-bold text-white">{inv.cantActualPacas || 0}</td>
                  <td className="px-6 py-4 text-center font-bold text-neonGreen">{inv.cantActualCajas || 0}</td>
                  <td className="px-6 py-4 text-center font-bold text-white">{inv.cantActualUnidades || 0}</td>
                  <td className="px-6 py-4 text-right text-zinc-400 font-mono">
                    <div>C: {inv.costoCompraCaja ? formatCOP(inv.costoCompraCaja) : '-'}</div>
                    <div className="mt-0.5">U: {inv.costoCompraUnidad ? formatCOP(inv.costoCompraUnidad) : '-'}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default StockConsolidadoTable;
