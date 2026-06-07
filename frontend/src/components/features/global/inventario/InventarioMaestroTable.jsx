import React, { useState, useMemo } from 'react';
import { Search, Layers, Book, Tag } from 'lucide-react';
import LaminasTable from './LaminasTable';
import AlbumesTable from './AlbumesTable';
import UnidadesTable from './UnidadesTable';

function InventarioMaestroTable({ inventarioGlobal, sedes = [], loading, onEdit, onDelete, onAbrirCaja, formatCOP }) {
  const [search, setSearch] = useState('');
  const [selectedSedeId, setSelectedSedeId] = useState('all');
  const [activeTab, setActiveTab] = useState('laminas'); // 'laminas', 'albumes', 'unidades'

  // Filtered by Sede & Search Query
  const filteredData = useMemo(() => {
    return inventarioGlobal.filter((inv) => {
      // 1. Sede filter
      if (selectedSedeId !== 'all' && inv.loteInversionista?.negocio?.id !== Number(selectedSedeId)) {
        return false;
      }
      // 2. Search query filter
      const pName = (inv.producto?.nombre || '').toLowerCase();
      const pEd = (inv.producto?.edicionColeccion || '').toLowerCase();
      const sName = (inv.loteInversionista?.negocio?.nombre || '').toLowerCase();
      const q = search.toLowerCase();
      return pName.includes(q) || pEd.includes(q) || sName.includes(q);
    });
  }, [inventarioGlobal, search, selectedSedeId]);

  // Segment by product categories
  const segmentedData = useMemo(() => {
    const laminas = [];
    const albumes = [];
    const unidades = [];

    filteredData.forEach((inv) => {
      const type = inv.producto?.tipo;

      if (type === 'FRACCIONADO_LAMINAS') {
        laminas.push(inv);
      } else if (type === 'FRACCIONADO_ALBUMES') {
        albumes.push(inv);
      } else if (type === 'UNIDAD_SIMPLE') {
        unidades.push(inv);
      }
    });

    return { laminas, albumes, unidades };
  }, [filteredData]);

  const showSede = selectedSedeId === 'all';

  return (
    <div className="glass-panel overflow-hidden border border-carbon-800 shadow-xl flex flex-col">
      {/* Header and Filter Toolbar */}
      <div className="px-6 py-4 border-b border-carbon-800 bg-carbon-900/60 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h3 className="font-sports font-bold text-white text-base">Inventario Consolidado de Sedes</h3>
          <p className="text-[10px] text-carbon-500 font-semibold uppercase">Gestión de Catálogo y Visualización de Stock</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          {/* Dropdown de Sedes */}
          <div className="relative w-full sm:w-48">
            <select
              value={selectedSedeId}
              onChange={(e) => setSelectedSedeId(e.target.value)}
              className="w-full bg-carbon-950 border border-carbon-850 hover:border-carbon-700 focus:border-neonGreen/50 px-3 py-1.5 rounded-xl text-xs text-white focus:outline-none transition-all cursor-pointer"
            >
              <option value="all">Todas las Sedes</option>
              {sedes.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre}
                </option>
              ))}
            </select>
          </div>
          {/* Buscador */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2 text-carbon-500" size={14} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar producto, colección..."
              className="w-full bg-carbon-950 border border-carbon-850 hover:border-carbon-700 focus:border-neonGreen/50 pl-9 pr-3 py-1.5 rounded-xl text-xs text-white focus:outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Tabs segment */}
      <div className="flex border-b border-carbon-800 bg-carbon-950/40 px-4">
        <button
          onClick={() => setActiveTab('laminas')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-sports font-bold border-b-2 transition-all ${
            activeTab === 'laminas'
              ? 'border-neonGreen text-neonGreen bg-carbon-900/40'
              : 'border-transparent text-carbon-400 hover:text-white'
          }`}
        >
          <Layers size={14} />
          CAJAS Y LÁMINAS ({segmentedData.laminas.length})
        </button>
        <button
          onClick={() => setActiveTab('albumes')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-sports font-bold border-b-2 transition-all ${
            activeTab === 'albumes'
              ? 'border-neonCyan text-neonCyan bg-carbon-900/40'
              : 'border-transparent text-carbon-400 hover:text-white'
          }`}
        >
          <Book size={14} />
          ÁLBUMES ({segmentedData.albumes.length})
        </button>
        <button
          onClick={() => setActiveTab('unidades')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-sports font-bold border-b-2 transition-all ${
            activeTab === 'unidades'
              ? 'border-neonPurple text-neonPurple bg-carbon-900/40'
              : 'border-transparent text-carbon-400 hover:text-white'
          }`}
        >
          <Tag size={14} />
          OTROS PRODUCTOS (UNIDADES) ({segmentedData.unidades.length})
        </button>
      </div>

      {/* Active Tab View */}
      <div className="p-1">
        {activeTab === 'laminas' && (
          <LaminasTable
            data={segmentedData.laminas}
            loading={loading}
            onEdit={onEdit}
            onDelete={onDelete}
            formatCOP={formatCOP}
            showSede={showSede}
          />
        )}
        {activeTab === 'albumes' && (
          <AlbumesTable
            data={segmentedData.albumes}
            loading={loading}
            onEdit={onEdit}
            onDelete={onDelete}
            onAbrirCaja={onAbrirCaja}
            formatCOP={formatCOP}
            showSede={showSede}
          />
        )}
        {activeTab === 'unidades' && (
          <UnidadesTable
            data={segmentedData.unidades}
            loading={loading}
            onEdit={onEdit}
            onDelete={onDelete}
            formatCOP={formatCOP}
            showSede={showSede}
          />
        )}
      </div>
    </div>
  );
}

export default InventarioMaestroTable;
