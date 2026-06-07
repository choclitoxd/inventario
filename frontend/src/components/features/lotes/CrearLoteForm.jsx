import React from 'react';
import { Plus } from 'lucide-react';
import InversionistaCampos from './InversionistaCampos';
import CostoCantidadCampos from './CostoCantidadCampos';
import CustomSelect from '../../common/CustomSelect';

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
  const financiadorOptions = [
    { value: 'DUENO_A', label: 'DUENO_A' },
    { value: 'DUENO_B', label: 'DUENO_B' },
    { value: 'INVERSIONISTA_EXTERNO', label: 'INVERSIONISTA_EXTERNO' }
  ];

  const productoOptions = productos
    .filter(p => p.tipo !== 'COMBO')
    .map(p => ({
      value: p.id.toString(),
      label: `${p.nombre} (${p.tipo})`
    }));

  return (
    <div className="glass-panel p-6 space-y-4">
      <h3 className="text-base font-sports font-bold text-white flex items-center gap-2 border-b border-carbon-800 pb-3">
        <Plus size={18} className="text-neonCyan" /> Registrar Nuevo Lote
      </h3>

      <form onSubmit={handleCrearLote} className="space-y-4">
        {/* Nombre Lote */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-carbon-500">IDENTIFICADOR / NOMBRE DE LOTE</label>
          <input
            type="text"
            placeholder="Ej. Importacion Albumes Qatar Mayo 2026"
            value={nombreLote}
            onChange={(e) => setNombreLote(e.target.value)}
            className="bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-neonCyan font-semibold"
            required
          />
        </div>

        {/* Financiador */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-carbon-500">ORIGEN DE CAPITAL (FINANCIADOR)</label>
          <CustomSelect
            options={financiadorOptions}
            value={financiador}
            onChange={(val) => setFinanciador(val)}
            placeholder="Seleccionar Origen"
          />
        </div>

        {/* Inversionista Campos */}
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

        {/* Producto */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-carbon-500">PRODUCTO A INGRESAR</label>
          <CustomSelect
            options={productoOptions}
            value={productoId}
            onChange={(val) => setProductoId(val)}
            placeholder="Selecciona un producto"
          />
        </div>

        {/* Costos y Cantidades */}
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

        {/* Submit */}
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
