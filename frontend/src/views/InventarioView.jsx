import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Package, 
  HelpCircle, 
  ArrowRightLeft,
  Unlock,
  AlertTriangle,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';

function InventarioView() {
  const [inventarios, setInventarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchInventario = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.listarInventario();
      setInventarios(data);
    } catch (err) {
      console.error(err);
      setError('Error al obtener los niveles de inventario. Verifique el backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventario();
  }, []);

  const handleAbrirCaja = async (id) => {
    try {
      setSuccessMsg('');
      setError(null);
      await api.abrirCaja(id);
      setSuccessMsg('¡Caja abierta con éxito! Se descontó 1 caja de láminas y se sumaron 104 sobres al stock.');
      fetchInventario();
    } catch (err) {
      setError(err.message || 'Error al ejecutar la acción de abrir caja.');
    }
  };

  const handleAbrirPacaLaminas = async (id) => {
    try {
      setSuccessMsg('');
      setError(null);
      await api.abrirPacaLaminas(id);
      setSuccessMsg('¡Paca de láminas desempacada con éxito! Se descontó 1 paca y se sumaron 10 cajas al stock.');
      fetchInventario();
    } catch (err) {
      setError(err.message || 'Error al abrir paca de láminas.');
    }
  };

  const handleAbrirPacaAlbumes = async (id) => {
    try {
      setSuccessMsg('');
      setError(null);
      await api.abrirPacaAlbumes(id);
      setSuccessMsg('¡Paca de álbumes desempacada con éxito! Se descontó 1 paca y se sumaron 26 álbumes sueltos al stock.');
      fetchInventario();
    } catch (err) {
      setError(err.message || 'Error al abrir paca de álbumes.');
    }
  };

  const formatCOP = (val) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(val || 0);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-carbon-900 border border-carbon-800 p-4 rounded-2xl shadow-lg">
        <div>
          <h2 className="text-2xl font-sports font-bold text-white flex items-center gap-3">
            <Package className="text-neonGreen" /> Inventario de Mercancía Físico
          </h2>
          <p className="text-xs text-carbon-500 font-medium">Gestión flexible de stock real por niveles (Pacas, Cajas, Sobres/Unidades)</p>
        </div>
      </div>

      {/* Info Boxes: Conversion Rules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Laminas Conversions */}
        <div className="glass-panel p-4 border-l-4 border-l-neonGreen flex items-start gap-4">
          <div className="bg-neonGreen/10 p-2 rounded-xl text-neonGreen">
            <ArrowRightLeft size={20} />
          </div>
          <div>
            <h4 className="text-sm font-sports font-bold text-white">Desglose de Láminas / Sobres</h4>
            <ul className="text-xs text-carbon-500 font-medium mt-1.5 space-y-1 list-disc list-inside">
              <li>1 Paca = 10 Cajas</li>
              <li>1 Caja = 104 Sobres</li>
            </ul>
          </div>
        </div>

        {/* Album Conversions */}
        <div className="glass-panel p-4 border-l-4 border-l-neonCyan flex items-start gap-4">
          <div className="bg-neonCyan/10 p-2 rounded-xl text-neonCyan">
            <Layers size={20} />
          </div>
          <div>
            <h4 className="text-sm font-sports font-bold text-white">Desglose de Álbumes</h4>
            <ul className="text-xs text-carbon-500 font-medium mt-1.5 space-y-1 list-disc list-inside">
              <li>1 Paca = 26 Álbumes sueltos</li>
            </ul>
          </div>
        </div>

        {/* Inventory flexible warning */}
        <div className="glass-panel p-4 border-l-4 border-l-yellow-500 flex items-start gap-4">
          <div className="bg-yellow-500/10 p-2 rounded-xl text-yellow-500">
            <Info size={20} />
          </div>
          <div>
            <h4 className="text-sm font-sports font-bold text-white">Gestión de Stock Físico</h4>
            <p className="text-xs text-carbon-500 font-medium mt-1.5 leading-relaxed">
              Las unidades físicas no se auto-desglosan solas al vender. Usa la acción de abrir caja o paca para cambiar la forma física del producto.
            </p>
          </div>
        </div>

      </div>

      {successMsg && (
        <div className="bg-neonGreen/10 border border-neonGreen/30 text-neonGreen p-4 rounded-xl flex items-center gap-3 animate-fadeIn shadow-neon-green">
          <Sparkles className="flex-shrink-0" />
          <span className="text-sm font-semibold">{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-950/40 border border-red-500/50 text-red-200 p-4 rounded-xl flex items-center gap-3 animate-fadeIn">
          <AlertTriangle className="text-red-500 flex-shrink-0" />
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      {/* Main Stock Table */}
      <div className="glass-panel overflow-hidden border border-carbon-800 shadow-xl">
        <div className="px-6 py-4 border-b border-carbon-800 bg-carbon-900/60 flex items-center justify-between">
          <h3 className="font-sports font-bold text-white text-base">Niveles de Existencias Actuales</h3>
          <span className="text-xs text-carbon-500 font-medium">Registrado por Lote y Origen</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-carbon-500 font-semibold flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-neonGreen border-t-transparent rounded-full animate-spin" />
            Cargando inventarios...
          </div>
        ) : inventarios.length === 0 ? (
          <div className="p-12 text-center text-carbon-600 font-semibold flex flex-col items-center gap-3">
            <Package size={48} className="text-carbon-700" />
            <span>No hay stock registrado en el sistema. Ingresa un nuevo lote para ver existencias.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-carbon-900 border-b border-carbon-800 text-[10px] font-bold text-carbon-500 tracking-wider">
                  <th className="px-6 py-3">PRODUCTO / TIPO</th>
                  <th className="px-6 py-3">LOTE / FINANCIADOR</th>
                  <th className="px-6 py-3 text-center">CANT. PACAS</th>
                  <th className="px-6 py-3 text-center">CANT. CAJAS</th>
                  <th className="px-6 py-3 text-center">SOBRES / UNIDADES</th>
                  <th className="px-6 py-3 text-right">COSTOS COMPRA (UNITARIO)</th>
                  <th className="px-6 py-3 text-center">DESEMPACAR / ACCIONES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-carbon-800/60 text-sm">
                {inventarios.map((inv) => {
                  const prod = inv.producto;
                  const lote = inv.loteInversionista;
                  
                  return (
                    <tr key={inv.id} className="hover:bg-carbon-800/20 transition-colors">
                      {/* Producto */}
                      <td className="px-6 py-4">
                        <div className="font-sports font-bold text-white">{prod.nombre}</div>
                        <span className={`text-[9px] font-bold tracking-widest px-2 py-0.5 rounded-full border mt-1 inline-block ${
                          prod.tipo === 'LAMINAS' ? 'bg-neonGreen/10 border-neonGreen/30 text-neonGreen' :
                          prod.tipo === 'ALBUM' ? 'bg-neonCyan/10 border-neonCyan/30 text-neonCyan' :
                          'bg-purple-500/10 border-purple-500/30 text-purple-400'
                        }`}>
                          {prod.tipo}
                        </span>
                      </td>

                      {/* Lote */}
                      <td className="px-6 py-4">
                        <div className="font-semibold text-zinc-300">{lote.nombreLote}</div>
                        <span className="text-[10px] text-carbon-500 font-medium">
                          {lote.financiador === 'DUENO_A' ? 'Fondo Dueño A' :
                           lote.financiador === 'DUENO_B' ? 'Fondo Dueño B' :
                           `Externo (${lote.nombreInversionista || 'Inversionista'})`}
                        </span>
                      </td>

                      {/* Stock Pacas */}
                      <td className="px-6 py-4 text-center font-sports font-bold text-white">
                        {inv.cantActualPacas || 0}
                      </td>

                      {/* Stock Cajas */}
                      <td className="px-6 py-4 text-center font-sports font-bold text-white">
                        {inv.cantActualCajas || 0}
                      </td>

                      {/* Stock Unidades */}
                      <td className="px-6 py-4 text-center font-sports font-bold text-white">
                        {inv.cantActualUnidades || 0}
                      </td>

                      {/* Costos compra congelados */}
                      <td className="px-6 py-4 text-right">
                        <div className="text-xs text-carbon-500 font-medium">
                          Paca: <span className="text-zinc-300 font-semibold">{inv.costoCompraPaca ? formatCOP(inv.costoCompraPaca) : '-'}</span>
                        </div>
                        <div className="text-xs text-carbon-500 font-medium mt-0.5">
                          Caja: <span className="text-zinc-300 font-semibold">{inv.costoCompraCaja ? formatCOP(inv.costoCompraCaja) : '-'}</span>
                        </div>
                        <div className="text-xs text-carbon-500 font-medium mt-0.5">
                          Unidad: <span className="text-zinc-300 font-semibold">{inv.costoCompraUnidad ? formatCOP(inv.costoCompraUnidad) : '-'}</span>
                        </div>
                      </td>

                      {/* Acciones */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center items-center gap-2">
                          
                          {/* Botones para LAMINAS */}
                          {prod.tipo === 'LAMINAS' && (
                            <>
                              <button
                                onClick={() => handleAbrirPacaLaminas(inv.id)}
                                disabled={!inv.cantActualPacas || inv.cantActualPacas < 1}
                                className={`text-[10px] font-sports font-bold px-2.5 py-1.5 rounded-lg border transition-all ${
                                  inv.cantActualPacas && inv.cantActualPacas >= 1
                                    ? 'bg-carbon-800 border-neonGreen/50 text-neonGreen hover:bg-neonGreen hover:text-black shadow-md'
                                    : 'border-carbon-800 text-carbon-600 bg-carbon-900/40 cursor-not-allowed'
                                }`}
                              >
                                Abrir Paca (1 → 10 Cajas)
                              </button>
                              <button
                                onClick={() => handleAbrirCaja(inv.id)}
                                disabled={!inv.cantActualCajas || inv.cantActualCajas < 1}
                                className={`text-[10px] font-sports font-bold px-2.5 py-1.5 rounded-lg border transition-all ${
                                  inv.cantActualCajas && inv.cantActualCajas >= 1
                                    ? 'bg-carbon-800 border-neonGreen/50 text-neonGreen hover:bg-neonGreen hover:text-black shadow-md'
                                    : 'border-carbon-800 text-carbon-600 bg-carbon-900/40 cursor-not-allowed'
                                }`}
                              >
                                Abrir Caja (1 → 104 Sobres)
                              </button>
                            </>
                          )}

                          {/* Botones para ALBUM */}
                          {prod.tipo === 'ALBUM' && (
                            <button
                              onClick={() => handleAbrirPacaAlbumes(inv.id)}
                              disabled={!inv.cantActualPacas || inv.cantActualPacas < 1}
                              className={`text-[10px] font-sports font-bold px-2.5 py-1.5 rounded-lg border transition-all ${
                                inv.cantActualPacas && inv.cantActualPacas >= 1
                                  ? 'bg-carbon-800 border-neonCyan/50 text-neonCyan hover:bg-neonCyan hover:text-black shadow-md'
                                  : 'border-carbon-800 text-carbon-600 bg-carbon-900/40 cursor-not-allowed'
                              }`}
                            >
                              Abrir Paca (1 → 26 Álbumes)
                            </button>
                          )}

                          {prod.tipo === 'COMBO' && (
                            <span className="text-xs text-carbon-500 font-semibold italic">Plantilla de Combo</span>
                          )}

                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

export default InventarioView;
