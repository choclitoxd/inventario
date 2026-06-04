import React from 'react';
import { Plus } from 'lucide-react';
import InversionistaCampos from './InversionistaCampos';
import CostoCantidadCampos from './CostoCantidadCampos';

function CrearLoteForm({
  productos,
  loading,
  nombreLote,
  setNombreLote,
  financiador,
  setFinanciador,
  nombreInversionista,
  setNombreInversionista,
  deudaInicial,
  setDeudaInicial,
  porcentajeAmortizacion,
  setPorcentajeAmortizacion,
  productoId,
  setProductoId,
  cantPacas,
  setCantPacas,
  cantCajas,
  setCantCajas,
  cantUnidades,
  setCantUnidades,
  costoPaca,
  setCostoPaca,
  costoCaja,
  setCostoCaja,
  costoUnidad,
  setCostoUnidad,
  handleCrearLote
}) {
  return (
    <div className="glass-panel p-6 space-y-4">
      <h3 className="text-base font-sports font-bold text-white flex items-center gap-2 border-b border-carbon-800 pb-3">
        <Plus size={18} className="text-neonCyan" /> Registrar Nuevo Lote
      </h3>

      <form onSubmit={handleCrearLote} className="space-y-4">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-carbon-500">IDENTIFICADOR / NOMBRE DE LOTE</label>
          <input
            type="text"
            placeholder="Ej. Importacion Albumes Qatar Mayo 2026"
            value={nombreLote}
            onChange={(e) => setNombreLote(e.target.value)}
            className="bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-neonCyan"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-carbon-500">ORIGEN DE CAPITAL (FINANCIADOR)</label>
          <select
            value={financiador}
            onChange={(e) => setFinanciador(e.target.value)}
            className="bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-neonCyan"
          >
            <option value="DUENO_A">Dueño A (Fondo A)</option>
            <option value="DUENO_B">Dueño B (Fondo B)</option>
            <option value="INVERSIONISTA_EXTERNO">Inversionista Externo / Deuda</option>
          </select>
        </div>

        {financiador === 'INVERSIONISTA_EXTERNO' && (
          <InversionistaCampos
            nombreInversionista={nombreInversionista}
            setNombreInversionista={setNombreInversionista}
            deudaInicial={deudaInicial}
            setDeudaInicial={setDeudaInicial}
            porcentajeAmortizacion={porcentajeAmortizacion}
            setPorcentajeAmortizacion={setPorcentajeAmortizacion}
          />
        )}

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-carbon-500">PRODUCTO A INGRESAR</label>
          <select
            value={productoId}
            onChange={(e) => setProductoId(e.target.value)}
            className="bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-neonCyan"
            required
          >
            <option value="">Selecciona un producto</option>
            {productos.filter(p => p.tipo !== 'COMBO').map(p => (
              <option key={p.id} value={p.id}>{p.nombre} ({p.tipo})</option>
            ))}
          </select>
        </div>

        <CostoCantidadCampos
          cantPacas={cantPacas}
          setCantPacas={setCantPacas}
          cantCajas={cantCajas}
          setCantCajas={setCantCajas}
          cantUnidades={cantUnidades}
          setCantUnidades={setCantUnidades}
          costoPaca={costoPaca}
          setCostoPaca={setCostoPaca}
          costoCaja={costoCaja}
          setCostoCaja={setCostoCaja}
          costoUnidad={costoUnidad}
          setCostoUnidad={setCostoUnidad}
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full text-center py-2.5 rounded-xl font-sports font-bold text-xs tracking-wider transition-all duration-300 ${
            loading
              ? 'bg-carbon-800 text-carbon-600 border-carbon-700 cursor-not-allowed'
              : 'neon-btn-cyan shadow-neon-cyan'
          }`}
        >
          {loading ? 'Registrando entrada...' : 'INGRESAR NUEVO LOTE'}
        </button>
      </form>
    </div>
  );
}

export default CrearLoteForm;
