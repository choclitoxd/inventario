import React from 'react';
import PrecioSugeridoButtons from './PrecioSugeridoButtons';
import NumericStepper from '../../common/NumericStepper';

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
          <NumericStepper
            value={Number(item[qField]) || 0}
            onChange={(val) => handleUpdateItem(idx, qField, val)}
          />
          <label className="text-[9px] font-bold text-carbon-500 block mt-2">{pLabel}</label>
          <NumericStepper
            value={Number(item[pField]) || 0}
            onChange={(val) => handleUpdateItem(idx, pField, val)}
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
