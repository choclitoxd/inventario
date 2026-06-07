import { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { formatCurrency } from '../utils/format';

function useInventario() {
  const [inventarios, setInventarios] = useState([]);
  const [productos, setProductos] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchProductosAndLotes = async () => {
    try {
      const [prods, lts] = await Promise.all([
        api.listarProductos(),
        api.listarLotes()
      ]);
      setProductos(prods || []);
      setLotes(lts || []);
    } catch (err) {
      console.error(err);
      setError('Error al obtener la lista de productos o lotes del catálogo.');
    }
  };

  const fetchInventario = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.listarInventario();
      setInventarios(data || []);
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

  const handleDesglosar = async (productoId, loteId, accion) => {
    try {
      setSuccessMsg('');
      setError(null);
      await api.desglosarInventario(productoId, loteId, accion);
      setSuccessMsg(`¡Desglose de ${accion.toLowerCase()} ejecutado con éxito para este lote!`);
      await fetchInventario();
    } catch (err) {
      setError(err.message || 'Error al ejecutar el desglose de stock.');
    }
  };

  const handleVincularProducto = async (dto) => {
    try {
      setSuccessMsg('');
      setError(null);
      await api.vincularProductoInventario(dto);
      setSuccessMsg('¡Producto vinculado con éxito a la sede!');
      await fetchInventario();
    } catch (err) {
      setError(err.message || 'Error al vincular el producto a la sede.');
      throw err;
    }
  };

  const handleActualizarInventario = async (id, dto) => {
    try {
      setSuccessMsg('');
      setError(null);
      await api.actualizarInventarioSede(id, dto);
      setSuccessMsg('¡Inventario y costos actualizados con éxito!');
      await fetchInventario();
    } catch (err) {
      setError(err.message || 'Error al actualizar el inventario.');
      throw err;
    }
  };

  const handleEliminarInventario = async (id) => {
    try {
      setSuccessMsg('');
      setError(null);
      await api.eliminarInventarioSede(id);
      setSuccessMsg('¡Producto desvinculado de la sede con éxito!');
      await fetchInventario();
    } catch (err) {
      setError(err.message || 'Error al eliminar el producto de la sede.');
      throw err;
    }
  };

  const formatCOP = (val) => {
    return formatCurrency(val);
  };

  // Agrupar inventario por producto
  const productosAgrupados = useMemo(() => {
    const map = {};
    inventarios.forEach((inv) => {
      const prod = inv.producto;
      if (!prod) return;
      if (!map[prod.id]) {
        map[prod.id] = {
          producto: prod,
          totalPacas: 0,
          totalCajas: 0,
          totalUnidades: 0,
          lotes: []
        };
      }
      map[prod.id].totalPacas += inv.cantActualPacas || 0;
      map[prod.id].totalCajas += inv.cantActualCajas || 0;
      map[prod.id].totalUnidades += inv.cantActualUnidades || 0;
      map[prod.id].lotes.push(inv);
    });
    return Object.values(map);
  }, [inventarios]);

  // Calcular valorización total de inventario de la sede
  const inversionTotalVal = useMemo(() => {
    return inventarios.reduce((sum, inv) => {
      const p = inv.producto;
      const isAlbumes = p?.tipo === 'FRACCIONADO_ALBUMES' || p?.tipo === 'ALBUM';
      const pacaCost = (inv.cantActualPacas || 0) * (inv.costoCompraPaca || 0);
      const cajaCost = isAlbumes ? 0 : (inv.cantActualCajas || 0) * (inv.costoCompraCaja || 0);
      const unidadCost = (inv.cantActualUnidades || 0) * (inv.costoCompraUnidad || 0);
      return sum + pacaCost + cajaCost + unidadCost;
    }, 0);
  }, [inventarios]);

  return {
    inventarios,
    productosAgrupados,
    productos,
    lotes,
    loading,
    error,
    setError,
    successMsg,
    setSuccessMsg,
    handleDesglosar,
    handleVincularProducto,
    handleActualizarInventario,
    handleEliminarInventario,
    fetchProductosAndLotes,
    formatCOP,
    fetchInventario,
    inversionTotalVal
  };
}

export default useInventario;
