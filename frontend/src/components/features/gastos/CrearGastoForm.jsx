import React from 'react';
import { Plus } from 'lucide-react';

function CrearGastoForm({
  descripcion,
  setDescripcion,
  monto,
  setMonto,
  categoria,
  setCategoria,
  loteInversionistaId,
  setLoteInversionistaId,
  lotes,
  loading,
  onSubmit
}) {
  return (
    <div className="lg:col-span-1 glass-panel p-6 space-y-4">
      <h3 className="text-base font-sports font-bold text-white flex items-center gap-2 border-b border-carbon-800 pb-3">
        <Plus size={18} className="text-red-500" /> Registrar Gasto Rápido
      </h3>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Monto del Gasto */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-carbon-500">VALOR DEL GASTO (COP)</label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-zinc-500 font-bold text-xs">COP</span>
            <input
              type="number"
              placeholder="Ej. 15000"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              className="bg-carbon-800 border border-carbon-700 rounded-xl pl-12 pr-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-red-500 w-full font-semibold"
              required
            />
          </div>
        </div>

        {/* Categoría */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-carbon-500">CATEGORÍA DE EGRESO</label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-red-500 w-full font-semibold"
          >
            <option value="FLETE">Flete / Envíos</option>
            <option value="TRANSPORTE">Transporte / Gasolina</option>
            <option value="ALIMENTACION">Alimentación / Refrigerios</option>
            <option value="OTRO">Otro / Imprevistos</option>
          </select>
        </div>

        {/* Lote Inversionista (opcional) */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-carbon-500">ASOCIAR A UN LOTE (OPCIONAL)</label>
          <select
            value={loteInversionistaId}
            onChange={(e) => setLoteInversionistaId(e.target.value)}
            className="bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-red-500 w-full font-semibold"
          >
            <option value="">Gasto General (Ningún lote)</option>
            {lotes.map(lote => (
              <option key={lote.id} value={lote.id}>
                {lote.nombreLote} ({lote.financiador === 'DUENO_A' ? 'Fondo A' : lote.financiador === 'DUENO_B' ? 'Fondo B' : 'Externo'})
              </option>
            ))}
          </select>
          <span className="text-[9px] text-carbon-500 font-medium mt-1 leading-normal">
            Asociar a un lote permite rastrear este egreso directamente contra la utilidad de esa financiación específica.
          </span>
        </div>

        {/* Descripción */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-carbon-500">DESCRIPCIÓN / DETALLE</label>
          <textarea
            placeholder="Ej. Peajes e hidratación entrega lote Qatar"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-red-500 h-20 resize-none w-full font-semibold"
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full text-center py-2.5 rounded-xl font-sports font-bold text-xs tracking-wider transition-all duration-300 ${
            loading
              ? 'bg-carbon-800 text-carbon-600 border-carbon-700 cursor-not-allowed'
              : 'bg-red-600 hover:bg-black hover:text-red-500 border border-red-600 text-white shadow-md shadow-red-600/20'
          }`}
        >
          {loading ? 'REGISTRANDO...' : 'REGISTRAR GASTO HORMIGA'}
        </button>
      </form>
    </div>
  );
}

export default CrearGastoForm;
