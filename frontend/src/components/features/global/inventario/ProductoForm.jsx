import React, { useState } from 'react';
import { Sparkles, Plus } from 'lucide-react';

function ProductoForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    nombre: '',
    edicionColeccion: '',
    tipo: 'FRACCIONADO_LAMINAS',
    factorConversion: '26',
    codigoBarras: '',
    precioSugeridoDefecto: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) return;
    onSubmit({
      ...formData,
      precioSugeridoDefecto: formData.precioSugeridoDefecto ? parseFloat(formData.precioSugeridoDefecto) : null,
      factorConversion: formData.tipo === 'FRACCIONADO_ALBUMES' && formData.factorConversion ? parseInt(formData.factorConversion) : null
    });
    setFormData({ nombre: '', edicionColeccion: '', tipo: 'FRACCIONADO_LAMINAS', factorConversion: '26', codigoBarras: '', precioSugeridoDefecto: '' });
  };

  return (
    <div className="glass-panel p-5 border border-carbon-800 shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-neonGreen/10 p-2 rounded-xl text-neonGreen"><Plus size={18} /></div>
        <div>
          <h3 className="font-sports font-bold text-white text-base">Crear Producto Maestro</h3>
          <p className="text-[10px] text-carbon-500 font-semibold uppercase">Catálogo Global Heredado a Sedes</p>
        </div>
      </div>
 
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        <div>
          <label className="text-[10px] text-carbon-450 font-bold uppercase block mb-1">Nombre</label>
          <input
            required
            type="text"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            placeholder="Ej: Caja de Sobres Qatar 2022"
            className="w-full bg-carbon-950 border border-carbon-850 hover:border-carbon-700 focus:border-neonGreen/50 px-3 py-2 rounded-xl text-xs text-white focus:outline-none transition-all"
          />
        </div>
        <div>
          <label className="text-[10px] text-carbon-450 font-bold uppercase block mb-1">Edición / Colección</label>
          <input
            type="text"
            value={formData.edicionColeccion}
            onChange={(e) => setFormData({ ...formData, edicionColeccion: e.target.value })}
            placeholder="Ej: Qatar 2022"
            className="w-full bg-carbon-950 border border-carbon-850 hover:border-carbon-700 focus:border-neonGreen/50 px-3 py-2 rounded-xl text-xs text-white focus:outline-none transition-all"
          />
        </div>
        <div>
          <label className="text-[10px] text-carbon-450 font-bold uppercase block mb-1">Tipo de Stock</label>
          <select
            value={formData.tipo}
            onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
            className="w-full bg-carbon-950 border border-carbon-850 hover:border-carbon-700 focus:border-neonGreen/50 px-3 py-2 rounded-xl text-xs text-white focus:outline-none transition-all"
          >
            <option value="FRACCIONADO_LAMINAS">Láminas (Paca / Caja / Sobre)</option>
            <option value="FRACCIONADO_ALBUMES">Álbumes (Caja / Unidad)</option>
            <option value="UNIDAD_SIMPLE">Mercancía General (Unidades Sueltas)</option>
          </select>
        </div>
        {formData.tipo === 'FRACCIONADO_ALBUMES' && (
          <div>
            <label className="text-[10px] text-carbon-450 font-bold uppercase block mb-1">Factor (Álbumes/Caja)</label>
            <input
              required
              type="number"
              value={formData.factorConversion}
              onChange={(e) => setFormData({ ...formData, factorConversion: e.target.value })}
              placeholder="Ej: 26 o 24"
              className="w-full bg-carbon-950 border border-carbon-850 hover:border-carbon-700 focus:border-neonGreen/50 px-3 py-2 rounded-xl text-xs text-white focus:outline-none transition-all"
            />
          </div>
        )}
        <div>
          <label className="text-[10px] text-carbon-450 font-bold uppercase block mb-1">Código de Barras / ID</label>
          <input
            type="text"
            value={formData.codigoBarras}
            onChange={(e) => setFormData({ ...formData, codigoBarras: e.target.value })}
            placeholder="Ej: 770123456789"
            className="w-full bg-carbon-950 border border-carbon-850 hover:border-carbon-700 focus:border-neonGreen/50 px-3 py-2 rounded-xl text-xs text-white focus:outline-none transition-all"
          />
        </div>
        <div>
          <label className="text-[10px] text-carbon-450 font-bold uppercase block mb-1">Precio Sugerido Defecto</label>
          <input
            type="number"
            value={formData.precioSugeridoDefecto}
            onChange={(e) => setFormData({ ...formData, precioSugeridoDefecto: e.target.value })}
            placeholder="Ej: 350000"
            className="w-full bg-carbon-950 border border-carbon-850 hover:border-carbon-700 focus:border-neonGreen/50 px-3 py-2 rounded-xl text-xs text-white focus:outline-none transition-all"
          />
        </div>
        <div className="md:col-span-5 flex justify-end mt-2">
          <button
            type="submit"
            disabled={loading || !formData.nombre.trim()}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-neonGreen text-black font-sports font-bold text-xs rounded-xl hover:bg-neonGreen/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-neon-green/10"
          >
            <Sparkles size={14} />
            {loading ? 'Creando...' : 'Crear Producto Maestro'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductoForm;
