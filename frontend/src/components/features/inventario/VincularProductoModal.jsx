import React, { useState, useEffect } from 'react';
import { X, Plus, AlertCircle } from 'lucide-react';
import CustomSelect from '../../common/CustomSelect';
import NumericStepper from '../../common/NumericStepper';

function VincularProductoModal({ 
  isOpen, 
  onClose, 
  onVincular, 
  productos, 
  lotes,
  fetchProductosAndLotes
}) {
  const [productoId, setProductoId] = useState('');
  const [loteId, setLoteId] = useState('');
  
  // Stock inputs
  const [cantPacas, setCantPacas] = useState(0);
  const [cantCajas, setCantCajas] = useState(0);
  const [cantUnidades, setCantUnidades] = useState(0);
  
  // Costs inputs
  const [costoCompraPaca, setCostoCompraPaca] = useState(0);
  const [costoCompraCaja, setCostoCompraCaja] = useState(0);
  const [costoCompraUnidad, setCostoCompraUnidad] = useState(0);
  
  const [formError, setFormError] = useState('');
  const [loadingForm, setLoadingForm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchProductosAndLotes();
      // Reset fields
      setProductoId('');
      setLoteId('');
      setCantPacas(0);
      setCantCajas(0);
      setCantUnidades(0);
      setCostoCompraPaca(0);
      setCostoCompraCaja(0);
      setCostoCompraUnidad(0);
      setFormError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const selectedProduct = productos.find(p => p.id === parseInt(productoId));
  const isLaminas = selectedProduct?.tipo === 'FRACCIONADO_LAMINAS' || selectedProduct?.tipo === 'LAMINAS';
  const isAlbumes = selectedProduct?.tipo === 'FRACCIONADO_ALBUMES' || selectedProduct?.tipo === 'ALBUM';
  const isUnidadSimple = selectedProduct?.tipo === 'UNIDAD_SIMPLE' || (selectedProduct && !isLaminas && !isAlbumes);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productoId || !loteId) {
      setFormError('Por favor seleccione un producto y un lote.');
      return;
    }

    setLoadingForm(true);
    setFormError('');
    try {
      await onVincular({
        productoId: parseInt(productoId),
        loteId: parseInt(loteId),
        cantPacas: isUnidadSimple ? 0 : parseInt(cantPacas || 0),
        cantCajas: isLaminas ? parseInt(cantCajas || 0) : 0,
        cantUnidades: parseInt(cantUnidades || 0),
        costoCompraPaca: isUnidadSimple ? 0 : parseFloat(costoCompraPaca || 0),
        costoCompraCaja: isLaminas ? parseFloat(costoCompraCaja || 0) : 0,
        costoCompraUnidad: parseFloat(costoCompraUnidad || 0)
      });
      onClose();
    } catch (err) {
      setFormError(err.message || 'Error al vincular el producto a la sede.');
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
              <Plus className="text-neonGreen animate-pulse" size={18} /> Vincular Producto a Sede
            </h3>
            <p className="text-[10px] text-carbon-500 font-semibold tracking-wider mt-0.5 uppercase">
              Asociar producto del catálogo maestro con existencias y costos
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

          {/* Catalog Product Selection */}
          <div className="flex flex-col gap-1">
            <label className="text-carbon-400 font-semibold uppercase tracking-wider text-[10px]">Producto del Catálogo</label>
            <CustomSelect
              options={productos.map(p => ({
                value: p.id,
                label: `${p.nombre} (${p.tipo === 'FRACCIONADO_LAMINAS' ? 'Láminas' : p.tipo === 'FRACCIONADO_ALBUMES' ? 'Álbumes' : 'Mercancía'})`
              }))}
              value={productoId}
              onChange={(val) => setProductoId(val)}
              placeholder="-- Seleccionar Producto --"
            />
          </div>

          {/* Lote Selection */}
          <div className="flex flex-col gap-1">
            <label className="text-carbon-400 font-semibold uppercase tracking-wider text-[10px]">Lote / Financiador de Sede</label>
            <CustomSelect
              options={lotes.map(l => ({
                value: l.id,
                label: `${l.nombreLote} (${l.financiador === 'DUENO_A' ? 'Dueño A' : l.financiador === 'DUENO_B' ? 'Dueño B' : 'Externo'})`
              }))}
              value={loteId}
              onChange={(val) => setLoteId(val)}
              placeholder="-- Seleccionar Lote/Socio --"
            />
            {lotes.length === 0 && (
              <p className="text-[10px] text-amber-500 font-semibold mt-1">
                ⚠️ No hay lotes registrados en esta sede. Debes crear un lote primero en la vista "Lotes/Deudas".
              </p>
            )}
          </div>

          {/* Dynamic Stock and Costs Fields */}
          {selectedProduct && (
            <div className="border border-carbon-850 bg-carbon-950/40 p-4 rounded-xl space-y-4">
              <h4 className="text-[10px] font-bold text-neonGreen uppercase tracking-wider">Detalles de Inventario Inicial</h4>

              {/* Stock Inputs */}
              <div className="grid grid-cols-3 gap-3">
                {!isUnidadSimple && (
                  <div className="flex flex-col gap-1">
                    <label className="text-carbon-500 font-semibold uppercase text-[9px]">Pacas</label>
                    <NumericStepper
                      value={cantPacas}
                      onChange={(val) => setCantPacas(val)}
                    />
                  </div>
                )}
                {isLaminas && (
                  <div className="flex flex-col gap-1">
                    <label className="text-carbon-500 font-semibold uppercase text-[9px]">Cajas</label>
                    <NumericStepper
                      value={cantCajas}
                      onChange={(val) => setCantCajas(val)}
                    />
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  <label className="text-carbon-500 font-semibold uppercase text-[9px]">
                    {isLaminas ? 'Sobres' : isAlbumes ? 'Álbumes Sueltos' : 'Existencias'}
                  </label>
                  <NumericStepper
                    value={cantUnidades}
                    onChange={(val) => setCantUnidades(val)}
                  />
                </div>
              </div>

              {/* Costs Inputs */}
              <div className="space-y-2.5">
                <h5 className="text-[9px] font-bold text-carbon-500 uppercase tracking-wider">Costos de Compra Unitarios</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {!isUnidadSimple && (
                    <div className="flex flex-col gap-1">
                      <label className="text-carbon-500 font-medium text-[9px]">Costo Paca ($)</label>
                      <NumericStepper
                        value={costoCompraPaca}
                        onChange={(val) => setCostoCompraPaca(val)}
                      />
                    </div>
                  )}
                  {isLaminas && (
                    <div className="flex flex-col gap-1">
                      <label className="text-carbon-500 font-medium text-[9px]">Costo Caja ($)</label>
                      <NumericStepper
                        value={costoCompraCaja}
                        onChange={(val) => setCostoCompraCaja(val)}
                      />
                    </div>
                  )}
                  <div className="flex flex-col gap-1">
                    <label className="text-carbon-500 font-medium text-[9px]">Costo Unidad/Sobre ($)</label>
                    <NumericStepper
                      value={costoCompraUnidad}
                      onChange={(val) => setCostoCompraUnidad(val)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

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
              disabled={loadingForm || !productoId || !loteId}
              className="px-5 py-2 bg-neonGreen hover:bg-neonGreen/80 disabled:bg-carbon-850 disabled:text-carbon-600 disabled:cursor-not-allowed text-black font-sports font-bold rounded-xl tracking-wider transition-all flex items-center gap-1.5 shadow-md shadow-neonGreen/5"
            >
              {loadingForm ? 'Vinculando...' : 'Vincular Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VincularProductoModal;
