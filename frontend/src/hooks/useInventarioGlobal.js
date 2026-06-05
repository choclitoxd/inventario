import { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';

function useInventarioGlobal() {
  const [inventarioGlobal, setInventarioGlobal] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchGlobalData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [invData, prodData] = await Promise.all([
        api.obtenerInventarioGlobal(),
        api.listarProductos()
      ]);
      setInventarioGlobal(invData || []);
      setProductos(prodData || []);
    } catch (err) {
      console.error(err);
      setError('Error al cargar el inventario consolidado y catálogo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGlobalData();
  }, []);

  const handleCrearProducto = async (productoDto) => {
    setSubmitting(true);
    setError(null);
    setSuccessMsg('');
    try {
      await api.crearProducto(productoDto);
      setSuccessMsg(`¡Producto "${productoDto.nombre}" creado exitosamente en el catálogo maestro!`);
      await fetchGlobalData();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al registrar el nuevo producto maestro.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditarProducto = async (id, productoDetails) => {
    setSubmitting(true);
    setError(null);
    setSuccessMsg('');
    try {
      await api.actualizarProductoAdmin(id, productoDetails);
      setSuccessMsg(`¡Producto "${productoDetails.nombre}" actualizado con éxito!`);
      await fetchGlobalData();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al actualizar el producto.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEliminarProducto = async (id) => {
    setSubmitting(true);
    setError(null);
    setSuccessMsg('');
    try {
      await api.eliminarProductoAdmin(id);
      setSuccessMsg('¡Producto eliminado exitosamente del catálogo maestro!');
      await fetchGlobalData();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al eliminar el producto.');
    } finally {
      setSubmitting(false);
    }
  };

  // Calcular totales dinámicos globales
  const totales = useMemo(() => {
    const totalPacas = inventarioGlobal.reduce((acc, curr) => acc + (curr.cantActualPacas || 0), 0);
    const totalCajas = inventarioGlobal.reduce((acc, curr) => acc + (curr.cantActualCajas || 0), 0);
    const totalSobres = inventarioGlobal.reduce((acc, curr) => acc + (curr.cantActualUnidades || 0), 0);
    const totalCatalogo = productos.length;

    return { totalPacas, totalCajas, totalSobres, totalCatalogo };
  }, [inventarioGlobal, productos]);

  const formatCOP = (val) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(val || 0);
  };

  return {
    inventarioGlobal,
    productos,
    totales,
    loading,
    error,
    setError,
    successMsg,
    setSuccessMsg,
    submitting,
    handleCrearProducto,
    handleEditarProducto,
    handleEliminarProducto,
    formatCOP,
    refresh: fetchGlobalData
  };
}

export default useInventarioGlobal;
