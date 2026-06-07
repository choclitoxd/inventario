import React from 'react';
import { Tag } from 'lucide-react';
import NumericStepper from '../../common/NumericStepper';
import CustomSelect from '../../common/CustomSelect';

function DetalleComboConfig({
  idx,
  item,
  inventarios,
  handleUpdateItem,
  handleUpdateComboComponent
}) {
  return (
    <div className="bg-carbon-950 p-4 rounded-xl space-y-3 border border-carbon-800">
      <h4 className="text-xs font-sports font-bold text-neonCyan flex items-center gap-1.5">
        <Tag size={12} /> Componentes del Combo & Origen de Lote
      </h4>
      
      <div className="grid grid-cols-2 gap-3 border-b border-carbon-800 pb-3">
        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-bold text-carbon-500">CANTIDAD DE COMBOS A VENDER</label>
          <NumericStepper
            value={Number(item.cantidadUnidades) || 0}
            onChange={(val) => handleUpdateItem(idx, 'cantidadUnidades', val)}
            min={1}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-bold text-carbon-500">PRECIO DE VENTA TOTAL DEL COMBO</label>
          <NumericStepper
            value={Number(item.precioVentaUnidad) || 0}
            onChange={(val) => handleUpdateItem(idx, 'precioVentaUnidad', val)}
          />
        </div>
      </div>

      <div className="space-y-2 mt-2">
        {item.componentesCombo?.map((comp, compIdx) => {
          const compOptions = inventarios
            .filter(inv => inv.producto.id === comp.productoId)
            .map(inv => ({
              value: inv.id.toString(),
              label: `${inv.loteInversionista.nombreLote} (P:${inv.cantActualPacas || 0} C:${inv.cantActualCajas || 0} U:${inv.cantActualUnidades || 0})`
            }));

          return (
            <div key={compIdx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs p-2 bg-carbon-900 rounded-lg">
              <div>
                <span className="font-semibold text-white">{comp.productoNombre}</span>
                <span className="text-[10px] text-carbon-500 font-medium block">
                  Requiere: {comp.cantidadPacas ? `${comp.cantidadPacas} Pacas ` : ''}
                  {comp.cantidadCajas ? `${comp.cantidadCajas} Cajas ` : ''}
                  {comp.cantidadUnidades ? `${comp.cantidadUnidades} Unids ` : ''}
                  (por combo)
                </span>
              </div>

              <div className="w-full sm:w-56">
                <CustomSelect
                  options={compOptions}
                  value={comp.inventarioId ? comp.inventarioId.toString() : ''}
                  onChange={(val) => handleUpdateComboComponent(idx, compIdx, 'inventarioId', Number(val))}
                  placeholder="Lote Origen Componente"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DetalleComboConfig;
