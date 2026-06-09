import React from 'react';
import { UserCheck, DollarSign, ListOrdered, Trash2, Edit2, CheckCircle, AlertTriangle } from 'lucide-react';
import useProveedores from '../hooks/useProveedores';
import CustomSelect from '../components/common/CustomSelect';
import NumericStepper from '../components/common/NumericStepper';

function ProveedoresPage() {
  const {
    proveedores,
    productos,
    tarifas,
    loading,
    error,
    success,
    userRole,
    handleSaveProveedor,
    handleSaveTarifa,
    handleEliminarTarifa,
    formatCOP,

    // Modal state
    isModalOpen,
    setIsModalOpen,
    modalNombre,
    setModalNombre,
    modalTelefono,
    setModalTelefono,

    // Form state
    tariffProveedorId,
    setTariffProveedorId,
    tariffProductoId,
    setTariffProductoId,
    tariffCosto,
    setTariffCosto,
    editingTarifaId,
    setEditingTarifaId
  } = useProveedores();

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (!modalNombre.trim()) return;
    await handleSaveProveedor(modalNombre, modalTelefono);
    setModalNombre('');
    setModalTelefono('');
    setIsModalOpen(false);
  };

  const handleTariffSubmit = async (e) => {
    e.preventDefault();
    if (!tariffProveedorId || !tariffProductoId) return;
    await handleSaveTarifa(tariffProveedorId, tariffProductoId, tariffCosto);
    
    // Clear and reset edit state if editing
    setTariffProveedorId('');
    setTariffProductoId('');
    setTariffCosto(0);
    setEditingTarifaId(null);
  };

  const startEditTarifa = (tarifa) => {
    if (!tarifa || !tarifa.proveedor || !tarifa.producto) return;
    setTariffProveedorId(tarifa.proveedor.id.toString());
    setTariffProductoId(tarifa.producto.id.toString());
    setTariffCosto(tarifa.costoPactado || 0);
    setEditingTarifaId(tarifa.id);
  };

  const cancelEdit = () => {
    setTariffProveedorId('');
    setTariffProductoId('');
    setTariffCosto(0);
    setEditingTarifaId(null);
  };

  const selectedTariffProduct = productos.find(p => p.id === Number(tariffProductoId));
  let tariffHelpText = '';
  if (selectedTariffProduct) {
    if (selectedTariffProduct.tipo === 'FRACCIONADO_ALBUMES') {
      tariffHelpText = 'Defina el costo por Paca de Álbumes';
    } else if (selectedTariffProduct.tipo === 'FRACCIONADO_LAMINAS') {
      tariffHelpText = 'Defina el costo por Caja de Sobres';
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-carbon-900 border border-carbon-800 p-4 rounded-2xl shadow-lg">
        <div>
          <h2 className="text-2xl font-sports font-bold text-white flex items-center gap-3">
            <UserCheck className="text-neonCyan" /> Proveedores y Tarifas Pactadas
          </h2>
          <p className="text-xs text-carbon-500 font-medium">Gestión del catálogo de proveedores y configuración de convenios logísticos de tarifas de compra.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-500 text-black hover:bg-emerald-400 font-sports font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all shadow-md active:scale-95"
          >
            <span>[+ Crear Proveedor]</span>
          </button>
        </div>
      </div>

      {success && (
        <div className="bg-neonCyan/10 border border-neonCyan/30 text-neonCyan p-4 rounded-xl flex items-center gap-3 shadow-neon-cyan animate-fadeIn">
          <CheckCircle className="flex-shrink-0" size={16} />
          <span className="text-sm font-semibold">{success}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-950/40 border border-red-500/50 text-red-200 p-4 rounded-xl flex items-center gap-3 animate-fadeIn">
          <AlertTriangle className="text-red-500 flex-shrink-0" size={16} />
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Formulario de Asociación de Tarifas */}
        <div className="lg:col-span-1">
          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-base font-sports font-bold text-white flex items-center gap-2 border-b border-carbon-800 pb-3">
              <DollarSign size={18} className="text-neonGreen" /> 
              {editingTarifaId ? 'Editar Tarifa Pactada' : 'Asociar Tarifas de Compra'}
            </h3>

            <form onSubmit={handleTariffSubmit} className="space-y-4 text-xs">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-carbon-500 uppercase">Seleccionar Proveedor</label>
                <CustomSelect
                  options={proveedores.map(p => ({
                    value: p.id,
                    label: `${p.nombre} (${p.telefono || 'Sin Teléfono'})`
                  }))}
                  value={tariffProveedorId}
                  onChange={(val) => setTariffProveedorId(val)}
                  placeholder="-- Seleccionar Proveedor --"
                  disabled={editingTarifaId !== null}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-carbon-500 uppercase">Seleccionar Producto</label>
                <CustomSelect
                  options={productos.map(p => ({
                    value: p.id,
                    label: p.nombre
                  }))}
                  value={tariffProductoId}
                  onChange={(val) => setTariffProductoId(val)}
                  placeholder="-- Seleccionar Producto --"
                  disabled={editingTarifaId !== null}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-carbon-500 uppercase">Costo Unitario Pactado (COP)</label>
                <NumericStepper
                  value={tariffCosto}
                  onChange={(val) => setTariffCosto(val)}
                  min={0}
                />
                {tariffHelpText && (
                  <p className="text-[10px] text-neonGreen font-semibold mt-1">
                    💡 {tariffHelpText}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="submit"
                  disabled={loading || !tariffProveedorId || !tariffProductoId}
                  className="w-full bg-neonGreen text-black hover:bg-black hover:text-neonGreen border border-neonGreen font-sports font-bold text-xs px-4 py-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Procesando...' : (editingTarifaId ? 'ACTUALIZAR TARIFA' : 'VINCULAR TARIFA')}
                </button>
                {editingTarifaId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="w-full bg-transparent text-carbon-400 hover:text-white border border-carbon-800 font-sports font-bold text-xs px-4 py-2.5 rounded-lg transition-all"
                  >
                    CANCELAR EDICIÓN
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Tabla de Convenios Activos */}
        <div className="lg:col-span-2">
          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-base font-sports font-bold text-white flex items-center gap-2 border-b border-carbon-800 pb-3">
              <ListOrdered size={18} className="text-neonCyan" /> Lista de Convenios Activos
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-carbon-900 border-b border-carbon-800 text-[10px] font-bold text-carbon-500 tracking-wider">
                    <th className="px-4 py-2">PROVEEDOR</th>
                    <th className="px-4 py-2">PRODUCTO</th>
                    <th className="px-4 py-2 text-center">UNIDAD BASE (PACA/CAJA)</th>
                    <th className="px-4 py-2 text-right">COSTO UNITARIO PACTADO</th>
                    <th className="px-4 py-2 text-center w-28">ACCIONES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-carbon-800/60 text-xs">
                  {tarifas.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-carbon-600 font-semibold">
                        No hay convenios ni tarifas pactadas en este momento.
                      </td>
                    </tr>
                  ) : (
                    tarifas.map((t) => {
                      const unitBase = t.producto?.tipo === 'FRACCIONADO_ALBUMES' ? 'Paca' : t.producto?.tipo === 'FRACCIONADO_LAMINAS' ? 'Caja' : 'Unidad';
                      return (
                        <tr key={t.id} className="hover:bg-carbon-850 transition-colors">
                          <td className="px-4 py-3 font-semibold text-white">
                            {t.proveedor?.nombre || 'Externo'}
                          </td>
                          <td className="px-4 py-3 text-carbon-400">
                            {t.producto?.nombre}
                          </td>
                          <td className="px-4 py-3 text-center text-carbon-500 font-semibold">
                            {unitBase}
                          </td>
                          <td className="px-4 py-3 text-right font-sports font-bold text-zinc-300">
                            {formatCOP(t.costoPactado)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {userRole === 'DUENO' ? (
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => startEditTarifa(t)}
                                  className="text-zinc-500 hover:text-neonCyan transition-colors p-1"
                                  title="Editar Tarifa"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button
                                  onClick={async () => {
                                    const confirm = window.confirm(`¿Seguro que desea eliminar la tarifa pactada de "${t.producto?.nombre}" para "${t.proveedor?.nombre}"?`);
                                    if (confirm) {
                                      await handleEliminarTarifa(t.id);
                                    }
                                  }}
                                  className="text-zinc-500 hover:text-red-500 transition-colors p-1"
                                  title="Eliminar Tarifa"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ) : (
                              <span className="text-[10px] text-carbon-600 italic">No permitido</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      {/* Modal Agregar Proveedor */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-sports font-bold text-white">REGISTRAR NUEVO PROVEEDOR</h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-zinc-500 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase">Nombre Completo</label>
                <input 
                  type="text" 
                  required
                  placeholder="Nombre del proveedor"
                  value={modalNombre}
                  onChange={(e) => setModalNombre(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 focus:border-emerald-500/80 text-xs font-mono text-white placeholder-zinc-600 px-3 py-2.5 rounded-lg focus:outline-none w-full"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase">Teléfono / Identificador</label>
                <input 
                  type="text" 
                  placeholder="Teléfono de contacto"
                  value={modalTelefono}
                  onChange={(e) => setModalTelefono(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 focus:border-emerald-500/80 text-xs font-mono text-white placeholder-zinc-600 px-3 py-2.5 rounded-lg focus:outline-none w-full"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="bg-transparent hover:bg-zinc-850 border border-zinc-800 text-zinc-400 hover:text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="bg-emerald-500 text-black hover:bg-emerald-400 border border-emerald-500 font-sports font-bold text-xs px-4 py-2 rounded-lg transition-all"
                >
                  GUARDAR PROVEEDOR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default ProveedoresPage;
