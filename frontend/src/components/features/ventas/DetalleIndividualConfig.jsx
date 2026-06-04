import React from 'react';
import PrecioSugeridoButtons from './PrecioSugeridoButtons';

function DetalleIndividualConfig({
  idx,
  item,
  sugerencias,
  handleUpdateItem,
  formatCOP
}) {
  const fields = [
    { label: 'CANT. PACAS', qField: 'cantidadPacas', pLabel: 'PRECIO PACA', pField: 'precioVentaPaca', suggestions: sugerencias?.preciosPaca },
    { label: 'CANT. CAJAS', qField: 'cantidadCajas', pLabel: 'PRECIO CAJA', pField: 'precioVentaCaja', suggestions: sugerencias?.preciosCaja },
    { label: 'CANT. UNIDADES / SOBRES', qField: 'cantidadUnidades', pLabel: 'PRECIO UNIDAD', pField: 'precioVentaUnidad', suggestions: sugerencias?.preciosUnidad }
  ];

  return (
    <div className="grid grid-cols-3 gap-3 border-t border-carbon-800/60 pt-3">
      {fields.map(({ label, qField, pLabel, pField, suggestions }) => (
        <div key={qField} className="space-y-1">
          <label className="text-[9px] font-bold text-carbon-500">{label}</label>
          <input
            type="number"
            min="0"
            value={item[qField] || 0}
            onChange={(e) => handleUpdateItem(idx, qField, Number(e.target.value))}
            className="w-full bg-carbon-800 border border-carbon-700 rounded-xl px-2 py-1.5 text-xs text-zinc-100 focus:outline-none"
          />
          <label className="text-[9px] font-bold text-carbon-500 block mt-2">{pLabel}</label>
          <input
            type="number"
            min="0"
            value={item[pField] || 0}
            onChange={(e) => handleUpdateItem(idx, pField, Number(e.target.value))}
            className="w-full bg-carbon-800 border border-carbon-700 rounded-xl px-2 py-1.5 text-xs text-zinc-100 focus:outline-none"
          />
          <PrecioSugeridoButtons
            precios={suggestions}
            onSelect={(val) => handleUpdateItem(idx, pField, val)}
            formatCOP={formatCOP}
          />
        </div>
      ))}
    </div>
  );
}

export default DetalleIndividualConfig;
