import React, { useState, useEffect } from 'react';
import { X, Edit, AlertCircle } from 'lucide-react';
import NumericStepper from '../../common/NumericStepper';

function EditarInventarioModal({ 
  isOpen, 
  onClose, 
  onSave, 
  inventario
}) {
  const [cantActualPacas, setCantActualPacas] = useState(0);
  const [cantActualCajas, setCantActualCajas] = useState(0);
  const [cantActualUnidades, setCantActualUnidades] = useState(0);
  
  const [costoCompraPaca, setCostoCompraPaca] = useState(0);
  const [costoCompraCaja, setCostoCompraCaja] = useState(0);
  const [costoCompraUnidad, setCostoCompraUnidad] = useState(0);
  
  const [formError, setFormError] = useState('');
  const [loadingForm, setLoadingForm] = useState(false);

  useEffect(() => {
    if (isOpen && inventario) {
      setCantActualPacas(inventario.cantActualPacas || 0);
      setCantActualCajas(inventario.cantActualCajas || 0);
      setCantActualUnidades(inventario.cantActualUnidades || 0);
      
      setCostoCompraPaca(inventario.costoCompraPaca || 0);
      setCostoCompraCaja(inventario.costoCompraCaja || 0);
      setCostoCompraUnidad(inventario.costoCompraUnidad || 0);
      
      setFormError('');
    }
  }, [isOpen, inventario]);

  if (!isOpen || !inventario) return null;

  const { producto, loteInversionista } = inventario;
  const isLaminas = producto.tipo === 'FRACCIONADO_LAMINAS' || producto.tipo === 'LAMINAS';
  const isAlbumes = producto.tipo === 'FRACCIONADO_ALBUMES' || producto.tipo === 'ALBUM';
  const isUnidadSimple = producto.tipo === 'UNIDAD_SIMPLE' || (!isLaminas && !isAlbumes);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingForm(true);
    setFormError('');
    try {
      await onSave(inventario.id, {
        cantActualPacas: isUnidadSimple ? 0 : parseInt(cantActualPacas || 0),
        cantActualCajas: isLaminas ? parseInt(cantActualCajas || 0) : 0,
        cantActualUnidades: parseInt(cantActualUnidades || 0),
        costoCompraPaca: isUnidadSimple ? 0 : parseFloat(costoCompraPaca || 0),
        costoCompraCaja: isLaminas ? parseFloat(costoCompraCaja || 0) : 0,
        costoCompraUnidad: parseFloat(costoCompraUnidad || 0)
      });
      onClose();
    } catch (err) {
      setFormError(err.message || 'Error al guardar los ajustes del inventario.');
    } finally {
      setLoadingForm(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-carbon-900 border border-carbon-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-carbon-800 bg-carbon-950/40">
          <div>
            <h3 className="text-base font-sports font-bold text-white flex items-center gap-2">
              <Edit className="text-neonCyan animate-pulse" size={18} /> Ajustar Inventario de Sede
            </h3>
            <p className="text-[10px] text-carbon-500 font-semibold tracking-wider mt-0.5 uppercase">
              Modificar existencias reales e historiales de costos por auditoría
            </p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-carbon-850 rounded-lg text-carbon-400 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="overflow-auto p-6 space-y-4 text-xs">
          {formError && (
            <div className="bg-red-950/40 border border-red-500/50 text-red-200 p-3 rounded-xl flex items-center gap-2 font-semibold">
              <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Product and Lote info */}
          <div className="bg-carbon-950/40 border border-carbon-800 p-3 rounded-xl flex flex-col gap-1.5">
            <div>
              <span className="text-[9px] text-carbon-500 font-bold uppercase tracking-wider">Producto</span>
              <p className="text-white font-sports font-bold text-sm leading-tight">{producto.nombre}</p>
            </div>
            <div className="h-px bg-carbon-850" />
            <div>
              <span className="text-[9px] text-carbon-500 font-bold uppercase tracking-wider">Lote / Origen</span>
              <p className="text-neonCyan font-semibold">{loteInversionista.nombreLote}</p>
            </div>
          </div>

          {/* Quantities Form Fields */}
          <div className="border border-carbon-850 bg-carbon-950/20 p-4 rounded-xl space-y-4">
            <h4 className="text-[10px] font-bold text-neonGreen uppercase tracking-wider">Ajuste de Stock Físico Real</h4>
            <div className="grid grid-cols-3 gap-3">
              {!isUnidadSimple && (
                <div className="flex flex-col gap-1">
                  <label className="text-carbon-400 font-semibold uppercase text-[9px]">Pacas Actuales</label>
                  <NumericStepper
                    value={cantActualPacas}
                    onChange={(val) => setCantActualPacas(val)}
                  />
                </div>
              )}
              {isLaminas && (
                <div className="flex flex-col gap-1">
                  <label className="text-carbon-400 font-semibold uppercase text-[9px]">Cajas Actuales</label>
                  <NumericStepper
                    value={cantActualCajas}
                    onChange={(val) => setCantActualCajas(val)}
                  />
                </div>
              )}
              <div className="flex flex-col gap-1">
                <label className="text-carbon-400 font-semibold uppercase text-[9px]">
                  {isLaminas ? 'Sobres Actuales' : isAlbumes ? 'Álbumes Sueltos' : 'Unidades Sueltas'}
                </label>
                <NumericStepper
                  value={cantActualUnidades}
                  onChange={(val) => setCantActualUnidades(val)}
                />
              </div>
            </div>
          </div>

          {/* Cost Prices Form Fields */}
          <div className="border border-carbon-850 bg-carbon-950/20 p-4 rounded-xl space-y-4">
            <h4 className="text-[10px] font-bold text-neonCyan uppercase tracking-wider">Historial de Costos de Compra</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {!isUnidadSimple && (
                <div className="flex flex-col gap-1">
                  <label className="text-carbon-500 font-medium text-[9px]">Costo Compra Paca ($)</label>
                  <NumericStepper
                    value={costoCompraPaca}
                    onChange={(val) => setCostoCompraPaca(val)}
                  />
                </div>
              )}
              {isLaminas && (
                <div className="flex flex-col gap-1">
                  <label className="text-carbon-500 font-medium text-[9px]">Costo Compra Caja ($)</label>
                  <NumericStepper
                    value={costoCompraCaja}
                    onChange={(val) => setCostoCompraCaja(val)}
                  />
                </div>
              )}
              <div className="flex flex-col gap-1">
                <label className="text-carbon-500 font-medium text-[9px]">Costo Compra Unidad ($)</label>
                <NumericStepper
                  value={costoCompraUnidad}
                  onChange={(val) => setCostoCompraUnidad(val)}
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-carbon-800 bg-carbon-950/20 -mx-6 -mb-6 p-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-carbon-850 bg-carbon-900/60 hover:bg-carbon-850 rounded-xl text-zinc-300 font-semibold transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loadingForm}
              className="px-5 py-2 bg-neonCyan hover:bg-neonCyan/80 disabled:bg-carbon-850 disabled:text-carbon-600 disabled:cursor-not-allowed text-black font-sports font-bold rounded-xl tracking-wider transition-all flex items-center gap-1.5 shadow-md shadow-neonCyan/5"
            >
              {loadingForm ? 'Guardando...' : 'Guardar Ajustes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditarInventarioModal;
