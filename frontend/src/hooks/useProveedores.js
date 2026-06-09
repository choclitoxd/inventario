import { useState, useEffect } from 'react';
import { proveedorService } from '../services/proveedorService';
import { authService } from '../services/authService';

function useProveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [tarifas, setTarifas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [userRole, setUserRole] = useState(() => {
    try {
      const sessionStr = localStorage.getItem('panini_session');
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        return session ? session.rol : '';
      }
    } catch (_) {}
    return '';
  });

  // Modal registrar proveedor states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalNombre, setModalNombre] = useState('');
  const [modalTelefono, setModalTelefono] = useState('');

  // Formulario de tarifas states
  const [tariffProveedorId, setTariffProveedorId] = useState('');
  const [tariffProductoId, setTariffProductoId] = useState('');
  const [tariffCosto, setTariffCosto] = useState(0);
  const [editingTarifaId, setEditingTarifaId] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [provs, prods, tfs] = await Promise.all([
        proveedorService.listarProveedores(),
        authService.listarProductos(),
        proveedorService.listarTarifas()
      ]);
      setProveedores(provs || []);
      setProductos(prods || []);
      setTarifas(tfs || []);
    } catch (err) {
      console.error(err);
      setError('Error al obtener datos de proveedores, productos y tarifas pactadas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveProveedor = async (nombre, telefono) => {
    setError(null);
    setSuccess(null);
    if (!nombre || !nombre.trim()) {
      setError('Por favor, ingresa el nombre del proveedor.');
      return;
    }
    setLoading(true);
    try {
      await proveedorService.registrarProveedor({
        nombre: nombre.trim(),
        telefono: telefono ? telefono.trim() : ''
      });
      setSuccess('¡Proveedor registrado con éxito!');
      await loadData();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al registrar el proveedor.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTarifa = async (proveedorId, productoId, costoPactado) => {
    setError(null);
    setSuccess(null);
    if (!proveedorId) {
      setError('Por favor, selecciona un proveedor.');
      return;
    }
    if (!productoId) {
      setError('Por favor, selecciona un producto.');
      return;
    }
    if (costoPactado <= 0) {
      setError('Por favor, ingresa un costo unitario pactado mayor a cero.');
      return;
    }
    setLoading(true);
    try {
      await proveedorService.guardarTarifa({
        proveedorId: Number(proveedorId),
        productoId: Number(productoId),
        costoPactado: Number(costoPactado)
      });
      setSuccess(editingTarifaId ? '¡Tarifa pactada actualizada con éxito!' : '¡Tarifa vinculada con éxito!');
      await loadData();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al registrar la tarifa pactada.');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarTarifa = async (id) => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      await proveedorService.eliminarTarifa(id);
      setSuccess('¡Tarifa eliminada con éxito!');
      await loadData();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al eliminar la tarifa.');
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
    proveedores,
    productos,
    tarifas,
    loading,
    error,
    setError,
    success,
    setSuccess,
    userRole,
    handleSaveProveedor,
    handleSaveTarifa,
    handleEliminarTarifa,
    formatCOP,
    loadData,

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
  };
}

export default useProveedores;
