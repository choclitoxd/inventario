import React, { useState, useMemo } from 'react';
import { Search, Package } from 'lucide-react';
import InventarioRow from './InventarioRow';

function InventarioMaestroTable({ inventarioGlobal, loading, onEdit, onDelete, formatCOP }) {
  const [search, setSearch] = useState('');

  const filteredData = useMemo(() => {
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
          <p className="text-[10px] text-carbon-500 font-semibold uppercase">Gestión de Catálogo y Visualización de Stock</p>
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
      ) : filteredData.length === 0 ? (
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
                <th className="px-6 py-3 text-center">P / C / S</th>
                <th className="px-6 py-3 text-right">COSTOS DE COMPRA</th>
                <th className="px-6 py-3 text-center">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-carbon-800/60">
              {filteredData.map((inv) => (
                <InventarioRow
                  key={inv.id}
                  inv={inv}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  formatCOP={formatCOP}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default InventarioMaestroTable;
