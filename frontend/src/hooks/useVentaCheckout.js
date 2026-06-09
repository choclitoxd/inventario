import { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { inventarioService } from '../services/inventarioService';
import { ventasService } from '../services/ventasService';

function useVentaCheckout() {
  const [productos, setProductos] = useState([]);
  const [inventarios, setInventarios] = useState([]);
  
  // Client search state
  const [telefono, setTelefono] = useState('');
  const [nombre, setNombre] = useState('');
  const [clienteEncontrado, setClienteEncontrado] = useState(false);
  const [clienteId, setClienteId] = useState(null);
  
  // Sale details
  const [metodoPago, setMetodoPago] = useState('EFECTIVO');
  const [nroReferencia, setNroReferencia] = useState('');
  const [detalles, setDetalles] = useState([]); // Cart items
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Suggested prices cache: { [productId]: { preciosPaca: [], preciosCaja: [], preciosUnidad: [] } }
  const [preciosSugeridos, setPreciosSugeridos] = useState({});

  const loadInitialData = async () => {
    try {
      const [prods, invs] = await Promise.all([
        authService.listarProductos(),
        inventarioService.listarInventario()
      ]);
      setProductos(prods || []);
      setInventarios(invs || []);
    } catch (err) {
      console.error(err);
      setError('Error al conectar con la API. Inicie el servidor backend.');
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleBuscarCliente = async () => {
    if (!telefono.trim()) return;
    setError(null);
    setClienteEncontrado(false);
    setClienteId(null);
    setNombre('');
    try {
      const cliente = await ventasService.buscarClientePorTelefono(telefono);
      if (cliente) {
        setNombre(cliente.nombre);
        setClienteId(cliente.id);
        setClienteEncontrado(true);
      }
    } catch (err) {
      // If not found (404), proceed as new client "al vuelo"
      setClienteEncontrado(false);
    }
  };

  const handleAgregarFila = () => {
    setDetalles([
      ...detalles,
      {
        uid: Date.now() + Math.random(), // Unique ID local para la UI
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
        const sugerencias = await ventasService.obtenerPreciosSugeridos(prodId);
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
        const componentes = await authService.obtenerComposicionCombo(item.productoId);
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
    if (e && e.preventDefault) {
      e.preventDefault();
    }
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
          precioVentaPaca: 0,
          precioVentaCaja: 0,
          precioVentaUnidad: 0
        })) : null
      }))
    };

    try {
      await ventasService.registrarVenta(payload);
      setSuccess(true);
      // Reset
      setTelefono('');
      setNombre('');
      setClienteEncontrado(false);
      setClienteId(null);
      setNroReferencia('');
      setDetalles([]);
      // Reload stocks
      const invs = await inventarioService.listarInventario();
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

  return {
    productos,
    inventarios,
    telefono,
    setTelefono,
    nombre,
    setNombre,
    clienteEncontrado,
    setClienteEncontrado,
    clienteId,
    setClienteId,
    metodoPago,
    setMetodoPago,
    detalles,
    loading,
    error,
    setError,
    success,
    setSuccess,
    preciosSugeridos,
    handleBuscarCliente,
    handleAgregarFila,
    handleCambiarProducto,
    handleUpdateItem,
    handleUpdateComboComponent,
    handleRemoverFila,
    calcularTotal,
    handleRealizarVenta,
    formatCOP,
    nroReferencia,
    setNroReferencia
  };
}

export default useVentaCheckout;
