import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

function EditarProductoModal({ producto, onClose, onSave, loading }) {
  const [formData, setFormData] = useState({
    nombre: producto.nombre || '',
    edicionColeccion: producto.edicionColeccion || '',
    codigoBarras: producto.codigoBarras || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) return;
    onSave(producto.id, formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-carbon-900 border border-carbon-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col animate-scaleIn">
        <div className="flex items-center justify-between px-6 py-4 border-b border-carbon-800 bg-carbon-950/40">
          <div>
            <h3 className="text-base font-sports font-bold text-white">Editar Producto</h3>
            <p className="text-[10px] text-carbon-500 font-semibold uppercase">Catálogo Maestro</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-carbon-850 rounded-lg text-carbon-400 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-[10px] text-carbon-450 font-bold uppercase block mb-1">Nombre</label>
            <input
              required
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full bg-carbon-950 border border-carbon-850 focus:border-neonCyan/50 px-3 py-2 rounded-xl text-xs text-white focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-[10px] text-carbon-450 font-bold uppercase block mb-1">Edición / Colección</label>
            <input
              type="text"
              value={formData.edicionColeccion}
              onChange={(e) => setFormData({ ...formData, edicionColeccion: e.target.value })}
              className="w-full bg-carbon-950 border border-carbon-850 focus:border-neonCyan/50 px-3 py-2 rounded-xl text-xs text-white focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-[10px] text-carbon-450 font-bold uppercase block mb-1">Código de Barras / ID</label>
            <input
              type="text"
              value={formData.codigoBarras}
              onChange={(e) => setFormData({ ...formData, codigoBarras: e.target.value })}
              className="w-full bg-carbon-950 border border-carbon-850 focus:border-neonCyan/50 px-3 py-2 rounded-xl text-xs text-white focus:outline-none transition-all"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-carbon-800/60">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-carbon-800 hover:bg-carbon-700 text-white font-sports font-bold text-xs rounded-xl transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !formData.nombre.trim()}
              className="flex items-center gap-1.5 px-4 py-2 bg-neonCyan text-black font-sports font-bold text-xs rounded-xl hover:bg-neonCyan/90 disabled:opacity-50 transition-all shadow-lg shadow-neonCyan/10"
            >
              <Save size={14} />
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditarProductoModal;
