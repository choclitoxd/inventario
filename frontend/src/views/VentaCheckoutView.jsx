import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  ShoppingCart, 
  User, 
  Phone, 
  Plus, 
  Trash2, 
  Check, 
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Tag,
  DollarSign
} from 'lucide-react';

function VentaCheckoutView() {
  const [productos, setProductos] = useState([]);
  const [inventarios, setInventarios] = useState([]);
  
  // Client search state
  const [telefono, setTelefono] = useState('');
  const [nombre, setNombre] = useState('');
  const [clienteEncontrado, setClienteEncontrado] = useState(false);
  const [clienteId, setClienteId] = useState(null);
  
  // Sale details
  const [metodoPago, setMetodoPago] = useState('EFECTIVO');
  const [detalles, setDetalles] = useState([]); // Cart items
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Suggested prices cache: { [productId]: { preciosPaca: [], preciosCaja: [], preciosUnidad: [] } }
  const [preciosSugeridos, setPreciosSugeridos] = useState({});

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const prods = await api.listarProductos();
        const invs = await api.listarInventario();
        setProductos(prods);
        setInventarios(invs);
      } catch (err) {
        console.error(err);
        setError('Error al conectar con la API. Inicie el servidor backend.');
      }
    };
    loadInitialData();
  }, []);

  const handleBuscarCliente = async () => {
    if (!telefono.trim()) return;
    setError(null);
    setClienteEncontrado(false);
    setClienteId(null);
    setNombre('');
    try {
      const cliente = await api.buscarClientePorTelefono(telefono);
      if (cliente) {
        setNombre(cliente.nombre);
        setClienteId(cliente.id);
        setClienteEncontrado(true);
      }
    } catch (err) {
      // Si no se encuentra (404), procedemos como nuevo cliente "al vuelo"
      setClienteEncontrado(false);
    }
  };

  const handleAgregarFila = () => {
    setDetalles([
      ...detalles,
      {
        uid: Date.now(), // Unique ID local para la UI
        productoId: '',
        inventarioId: '',
        cantidadPacas: 0,
        cantidadCajas: 0,
        cantidadUnidades: 0,
        precioVentaPaca: 0,
        precioVentaCaja: 0,
        precioVentaUnidad: 0,
        esCombo: false,
        componentesCombo: [] // Para combos
      }
    ]);
  };

  const handleCambiarProducto = async (index, prodId) => {
    const updated = [...detalles];
    const item = updated[index];
    item.productoId = Number(prodId);
    
    const producto = productos.find(p => p.id === item.productoId);
    item.esCombo = producto?.tipo === 'COMBO';
    item.inventarioId = ''; // Reset Lote
    
    // Reset quantities and default suggested prices
    item.cantidadPacas = 0;
    item.cantidadCajas = 0;
    item.cantidadUnidades = 0;
    item.precioVentaPaca = producto?.precioSugeridoDefecto && producto.tipo === 'PACA' ? producto.precioSugeridoDefecto : 0;
    item.precioVentaCaja = producto?.precioSugeridoDefecto && producto.tipo === 'CAJA' ? producto.precioSugeridoDefecto : 0;
    item.precioVentaUnidad = producto?.precioSugeridoDefecto && (producto.tipo === 'ALBUM' || producto.tipo === 'LAMINAS') ? producto.precioSugeridoDefecto : 0;

    // Fetch suggested prices from historical sales
    if (prodId && !preciosSugeridos[prodId]) {
      try {
        const sugerencias = await api.obtenerPreciosSugeridos(prodId);
        setPreciosSugeridos(prev => ({
          ...prev,
          [prodId]: sugerencias
        }));
      } catch (err) {
        console.error(err);
      }
    }

    // Si es un combo, cargar los componentes del combo
    if (item.esCombo) {
      try {
        const componentes = await api.obtenerComposicionCombo(item.productoId);
        item.componentesCombo = componentes.map(c => ({
          productoId: c.productoComponenteId,
          productoNombre: c.productoComponenteNombre,
          cantidadPacas: c.cantidadPacas,
          cantidadCajas: c.cantidadCajas,
          cantidadUnidades: c.cantidadUnidades,
          inventarioId: '', // Se elegirá el lote para cada sub-componente
          precioVentaPaca: 0,
          precioVentaCaja: 0,
          precioVentaUnidad: 0
        }));
      } catch (err) {
        console.error(err);
        setError('Error al obtener la composición del combo.');
      }
    } else {
      item.componentesCombo = [];
    }

    setDetalles(updated);
  };

  const handleUpdateItem = (index, field, value) => {
    const updated = [...detalles];
    updated[index][field] = value;
    setDetalles(updated);
  };

  const handleUpdateComboComponent = (itemIndex, compIndex, field, value) => {
    const updated = [...detalles];
    updated[itemIndex].componentesCombo[compIndex][field] = value;
    setDetalles(updated);
  };

  const handleRemoverFila = (index) => {
    setDetalles(detalles.filter((_, i) => i !== index));
  };

  const calcularTotal = () => {
    return detalles.reduce((total, item) => {
      let sub = 0;
      sub += (item.cantidadPacas || 0) * (item.precioVentaPaca || 0);
      sub += (item.cantidadCajas || 0) * (item.precioVentaCaja || 0);
      sub += (item.cantidadUnidades || 0) * (item.precioVentaUnidad || 0);
      return total + sub;
    }, 0);
  };

  const handleRealizarVenta = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (detalles.length === 0) {
      setError('Debes agregar al menos un producto a la venta.');
      return;
    }

    // Validations
    for (const item of detalles) {
      if (!item.productoId) {
        setError('Por favor, selecciona un producto para todas las líneas.');
        return;
      }
      if (!item.esCombo && !item.inventarioId) {
        setError('Por favor, selecciona un lote/inventario de origen para cada producto.');
        return;
      }
      if (item.esCombo) {
        for (const comp of item.componentesCombo) {
          if (!comp.inventarioId) {
            setError(`Por favor, selecciona el lote origen para el componente "${comp.productoNombre}" del combo.`);
            return;
          }
        }
      }
    }

    setLoading(true);

    // Build Payload
    const payload = {
      clienteId: clienteId || null,
      clienteNombre: clienteEncontrado ? null : nombre,
      clienteTelefono: clienteEncontrado ? null : telefono,
      metodoPago,
      detalles: detalles.map(item => ({
        inventarioId: item.esCombo ? null : item.inventarioId,
        productoId: item.productoId,
        cantidadPacas: item.cantidadPacas || 0,
        cantidadCajas: item.cantidadCajas || 0,
        cantidadUnidades: item.cantidadUnidades || 0,
        precioVentaPaca: item.precioVentaPaca || 0,
        precioVentaCaja: item.precioVentaCaja || 0,
        precioVentaUnidad: item.precioVentaUnidad || 0,
        componentesCombo: item.esCombo ? item.componentesCombo.map(c => ({
          inventarioId: c.inventarioId,
          productoId: c.productoId,
          cantidadPacas: c.cantidadPacas || 0,
          cantidadCajas: c.cantidadCajas || 0,
          cantidadUnidades: c.cantidadUnidades || 0,
          precioVentaPaca: 0, // El precio se cobra en la cabecera del combo
          precioVentaCaja: 0,
          precioVentaUnidad: 0
        })) : null
      }))
    };

    try {
      await api.registrarVenta(payload);
      setSuccess(true);
      // Reset
      setTelefono('');
      setNombre('');
      setClienteEncontrado(false);
      setClienteId(null);
      setDetalles([]);
      // Reload stocks
      const invs = await api.listarInventario();
      setInventarios(invs);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al procesar la venta. Verifique los stocks disponibles.');
    } finally {
      setLoading(false);
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
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-carbon-900 border border-carbon-800 p-4 rounded-2xl shadow-lg">
        <div>
          <h2 className="text-2xl font-sports font-bold text-white flex items-center gap-3">
            <ShoppingCart className="text-neonGreen" /> Registrar Venta de Contado
          </h2>
          <p className="text-xs text-carbon-500 font-medium">Checkout rápido para clientes mayoristas con precios editables al instante</p>
        </div>
      </div>

      {success && (
        <div className="bg-neonGreen/10 border border-neonGreen/30 text-neonGreen p-4 rounded-xl flex items-center gap-3 shadow-neon-green">
          <Check className="flex-shrink-0" />
          <span className="text-sm font-semibold">¡Venta registrada con éxito! El inventario ha sido descontado y las ganancias se asignaron a los inversionistas automáticamente.</span>
        </div>
      )}

      {error && (
        <div className="bg-red-950/40 border border-red-500/50 text-red-200 p-4 rounded-xl flex items-center gap-3">
          <AlertTriangle className="text-red-500 flex-shrink-0" />
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      <form onSubmit={handleRealizarVenta} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns - Client & Items */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Client Selection (Al Vuelo) */}
          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-base font-sports font-bold text-white flex items-center gap-2 border-b border-carbon-800 pb-3">
              <User size={18} className="text-neonGreen" /> Información del Cliente
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-carbon-500">TELÉFONO (ID ÚNICO)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ej. 3123456789"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-neonGreen flex-1"
                  />
                  <button
                    type="button"
                    onClick={handleBuscarCliente}
                    className="bg-carbon-700 hover:bg-carbon-600 text-zinc-100 px-4 rounded-xl text-xs font-semibold border border-carbon-600 transition-all"
                  >
                    Buscar
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-carbon-500">NOMBRE DEL CLIENTE</label>
                <input
                  type="text"
                  placeholder="Nombre completo"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  disabled={clienteEncontrado}
                  className={`bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-neonGreen ${
                    clienteEncontrado ? 'opacity-60 cursor-not-allowed bg-carbon-900 border-carbon-800' : ''
                  }`}
                />
              </div>
            </div>
            
            {clienteEncontrado && (
              <span className="text-xs text-neonGreen font-semibold block">
                ✓ Cliente encontrado en la base de datos (se vinculará a la venta).
              </span>
            )}
            {!clienteEncontrado && telefono.trim() && (
              <span className="text-xs text-yellow-500 font-semibold block">
                ⚠ Cliente nuevo. Se registrará "al vuelo" con el nombre proporcionado.
              </span>
            )}
          </div>

          {/* Cart Items (Detalles) */}
          <div className="glass-panel p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-carbon-800 pb-3">
              <h3 className="text-base font-sports font-bold text-white flex items-center gap-2">
                <ShoppingCart size={18} className="text-neonGreen" /> Líneas de Venta
              </h3>
              <button
                type="button"
                onClick={handleAgregarFila}
                className="neon-btn-green flex items-center gap-1 text-xs py-1.5"
              >
                <Plus size={14} /> Añadir Producto
              </button>
            </div>

            {detalles.length === 0 ? (
              <div className="p-8 text-center text-carbon-600 font-semibold border-2 border-dashed border-carbon-800 rounded-xl">
                No hay productos agregados. Haz clic en "Añadir Producto" para comenzar.
              </div>
            ) : (
              <div className="space-y-4">
                {detalles.map((item, idx) => {
                  const s = preciosSugeridos[item.productoId] || { preciosPaca: [], preciosCaja: [], preciosUnidad: [] };
                  
                  return (
                    <div key={item.uid} className="bg-carbon-900 border border-carbon-800 p-4 rounded-xl space-y-3 relative">
                      
                      {/* Close button */}
                      <button
                        type="button"
                        onClick={() => handleRemoverFila(idx)}
                        className="absolute top-3 right-3 text-carbon-500 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 sm:pt-0">
                        {/* Selector de Producto */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-carbon-500">PRODUCTO</label>
                          <select
                            value={item.productoId}
                            onChange={(e) => handleCambiarProducto(idx, e.target.value)}
                            className="bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-neonGreen"
                          >
                            <option value="">Selecciona un producto</option>
                            {productos.map(p => (
                              <option key={p.id} value={p.id}>{p.nombre} ({p.tipo})</option>
                            ))}
                          </select>
                        </div>

                        {/* Selector de Lote/Origen (si no es combo) */}
                        {!item.esCombo && (
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-carbon-500">LOTE / STOCK ORIGEN</label>
                            <select
                              value={item.inventarioId}
                              onChange={(e) => handleUpdateItem(idx, 'inventarioId', Number(e.target.value))}
                              className="bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-neonGreen"
                            >
                              <option value="">Selecciona Lote (Stock)</option>
                              {inventarios
                                .filter(inv => inv.producto.id === item.productoId)
                                .map(inv => (
                                  <option key={inv.id} value={inv.id}>
                                    {inv.loteInversionista.nombreLote} (Stock: P:{inv.cantActualPacas || 0} C:{inv.cantActualCajas || 0} U:{inv.cantActualUnidades || 0})
                                  </option>
                                ))}
                            </select>
                          </div>
                        )}
                      </div>

                      {/* Configuración de cantidades y precios si es producto individual */}
                      {!item.esCombo && item.productoId > 0 && (
                        <div className="grid grid-cols-3 gap-3 border-t border-carbon-800/60 pt-3">
                          
                          {/* Pacas */}
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-carbon-500">CANT. PACAS</label>
                            <input
                              type="number"
                              min="0"
                              value={item.cantidadPacas}
                              onChange={(e) => handleUpdateItem(idx, 'cantidadPacas', Number(e.target.value))}
                              className="w-full bg-carbon-800 border border-carbon-700 rounded-xl px-2 py-1.5 text-xs text-zinc-100 focus:outline-none"
                            />
                            <label className="text-[9px] font-bold text-carbon-500 block mt-2">PRECIO PACA</label>
                            <input
                              type="number"
                              min="0"
                              value={item.precioVentaPaca}
                              onChange={(e) => handleUpdateItem(idx, 'precioVentaPaca', Number(e.target.value))}
                              className="w-full bg-carbon-800 border border-carbon-700 rounded-xl px-2 py-1.5 text-xs text-zinc-100 focus:outline-none"
                            />
                            {/* Sugerencias de precios */}
                            {s.preciosPaca && s.preciosPaca.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {s.preciosPaca.map((p, pIdx) => (
                                  <button
                                    key={pIdx}
                                    type="button"
                                    onClick={() => handleUpdateItem(idx, 'precioVentaPaca', Number(p))}
                                    className="text-[8px] bg-carbon-800 hover:bg-neonGreen hover:text-black border border-carbon-700 rounded px-1 text-carbon-400 font-semibold"
                                  >
                                    {formatCOP(p)}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Cajas */}
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-carbon-500">CANT. CAJAS</label>
                            <input
                              type="number"
                              min="0"
                              value={item.cantidadCajas}
                              onChange={(e) => handleUpdateItem(idx, 'cantidadCajas', Number(e.target.value))}
                              className="w-full bg-carbon-800 border border-carbon-700 rounded-xl px-2 py-1.5 text-xs text-zinc-100 focus:outline-none"
                            />
                            <label className="text-[9px] font-bold text-carbon-500 block mt-2">PRECIO CAJA</label>
                            <input
                              type="number"
                              min="0"
                              value={item.precioVentaCaja}
                              onChange={(e) => handleUpdateItem(idx, 'precioVentaCaja', Number(e.target.value))}
                              className="w-full bg-carbon-800 border border-carbon-700 rounded-xl px-2 py-1.5 text-xs text-zinc-100 focus:outline-none"
                            />
                            {/* Sugerencias de precios */}
                            {s.preciosCaja && s.preciosCaja.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {s.preciosCaja.map((p, pIdx) => (
                                  <button
                                    key={pIdx}
                                    type="button"
                                    onClick={() => handleUpdateItem(idx, 'precioVentaCaja', Number(p))}
                                    className="text-[8px] bg-carbon-800 hover:bg-neonGreen hover:text-black border border-carbon-700 rounded px-1 text-carbon-400 font-semibold"
                                  >
                                    {formatCOP(p)}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Unidades */}
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-carbon-500">CANT. UNIDADES / SOBRES</label>
                            <input
                              type="number"
                              min="0"
                              value={item.cantidadUnidades}
                              onChange={(e) => handleUpdateItem(idx, 'cantidadUnidades', Number(e.target.value))}
                              className="w-full bg-carbon-800 border border-carbon-700 rounded-xl px-2 py-1.5 text-xs text-zinc-100 focus:outline-none"
                            />
                            <label className="text-[9px] font-bold text-carbon-500 block mt-2">PRECIO UNIDAD</label>
                            <input
                              type="number"
                              min="0"
                              value={item.precioVentaUnidad}
                              onChange={(e) => handleUpdateItem(idx, 'precioVentaUnidad', Number(e.target.value))}
                              className="w-full bg-carbon-800 border border-carbon-700 rounded-xl px-2 py-1.5 text-xs text-zinc-100 focus:outline-none"
                            />
                            {/* Sugerencias de precios */}
                            {s.preciosUnidad && s.preciosUnidad.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {s.preciosUnidad.map((p, pIdx) => (
                                  <button
                                    key={pIdx}
                                    type="button"
                                    onClick={() => handleUpdateItem(idx, 'precioVentaUnidad', Number(p))}
                                    className="text-[8px] bg-carbon-800 hover:bg-neonGreen hover:text-black border border-carbon-700 rounded px-1 text-carbon-400 font-semibold"
                                  >
                                    {formatCOP(p)}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                        </div>
                      )}

                      {/* Configuración de combo si es un combo template */}
                      {item.esCombo && (
                        <div className="bg-carbon-950 p-4 rounded-xl space-y-3 border border-carbon-800">
                          <h4 className="text-xs font-sports font-bold text-neonCyan flex items-center gap-1.5">
                            <Tag size={12} /> Componentes del Combo & Origen de Lote
                          </h4>
                          
                          {/* El precio de venta total del combo se configura en la cabecera */}
                          <div className="grid grid-cols-2 gap-3 border-b border-carbon-800 pb-3">
                            <div className="flex flex-col gap-1">
                              <label className="text-[9px] font-bold text-carbon-500">CANTIDAD DE COMBOS A VENDER</label>
                              <input
                                type="number"
                                min="1"
                                value={item.cantidadUnidades}
                                onChange={(e) => {
                                  const cant = Number(e.target.value);
                                  handleUpdateItem(idx, 'cantidadUnidades', cant);
                                }}
                                className="bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-1.5 text-xs text-zinc-100 focus:outline-none"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-[9px] font-bold text-carbon-500">PRECIO DE VENTA TOTAL DEL COMBO</label>
                              <input
                                type="number"
                                min="0"
                                value={item.precioVentaUnidad}
                                onChange={(e) => handleUpdateItem(idx, 'precioVentaUnidad', Number(e.target.value))}
                                className="bg-carbon-800 border border-carbon-700 rounded-xl px-3 py-1.5 text-xs text-zinc-100 focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="space-y-2 mt-2">
                            {item.componentesCombo.map((comp, compIdx) => (
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

                                {/* Selección de lote para este sub-producto del combo */}
                                <div className="w-full sm:w-56">
                                  <select
                                    value={comp.inventarioId}
                                    onChange={(e) => handleUpdateComboComponent(idx, compIdx, 'inventarioId', Number(e.target.value))}
                                    className="w-full bg-carbon-800 border border-carbon-700 rounded-lg px-2 py-1 text-xs text-zinc-100 focus:outline-none focus:border-neonGreen"
                                  >
                                    <option value="">Lote Origen Componente</option>
                                    {inventarios
                                      .filter(inv => inv.producto.id === comp.productoId)
                                      .map(inv => (
                                        <option key={inv.id} value={inv.id}>
                                          {inv.loteInversionista.nombreLote} (Stock: P:{inv.cantActualPacas || 0} C:{inv.cantActualCajas || 0} U:{inv.cantActualUnidades || 0})
                                        </option>
                                      ))}
                                  </select>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Right Sidebar - Checkout Summary */}
        <div className="space-y-6">
          
          {/* Checkout Panel */}
          <div className="glass-panel p-6 space-y-6 border-l-4 border-l-neonGreen">
            <h3 className="text-base font-sports font-bold text-white border-b border-carbon-800 pb-3">
              Resumen de Factura
            </h3>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-carbon-500 block">MÉTODO DE PAGO</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMetodoPago('EFECTIVO')}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all ${
                    metodoPago === 'EFECTIVO'
                      ? 'bg-neonGreen/10 border-neonGreen text-neonGreen shadow-neon-green'
                      : 'bg-carbon-800 border-carbon-700 text-carbon-500 hover:text-zinc-100'
                  }`}
                >
                  Efectivo (Contado)
                </button>
                <button
                  type="button"
                  onClick={() => setMetodoPago('TRANSFERENCIA')}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all ${
                    metodoPago === 'TRANSFERENCIA'
                      ? 'bg-neonGreen/10 border-neonGreen text-neonGreen shadow-neon-green'
                      : 'bg-carbon-800 border-carbon-700 text-carbon-500 hover:text-zinc-100'
                  }`}
                >
                  Transferencia
                </button>
              </div>
            </div>

            {/* Price Calculations */}
            <div className="space-y-3 bg-carbon-950 p-4 rounded-xl border border-carbon-800">
              <div className="flex items-center justify-between text-xs text-carbon-500">
                <span>Total Items</span>
                <span className="font-semibold text-zinc-300">{detalles.length}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-carbon-500">
                <span>Método</span>
                <span className="font-semibold text-zinc-300 capitalize">{metodoPago.toLowerCase()}</span>
              </div>
              <div className="border-t border-carbon-800 pt-3 flex items-center justify-between">
                <span className="text-sm font-sports font-bold text-white">TOTAL A COBRAR</span>
                <span className="text-xl font-sports font-extrabold text-neonGreen">
                  {formatCOP(calcularTotal())}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || detalles.length === 0}
              className={`w-full text-center py-3 rounded-xl font-sports font-extrabold text-sm tracking-wider transition-all duration-300 ${
                loading || detalles.length === 0
                  ? 'bg-carbon-800 border border-carbon-700 text-carbon-600 cursor-not-allowed'
                  : 'neon-btn-green glow-green-intense'
              }`}
            >
              {loading ? 'Procesando checkout...' : 'REGISTRAR VENTA DE CONTADO'}
            </button>
          </div>

        </div>

      </form>
      
    </div>
  );
}

export default VentaCheckoutView;
