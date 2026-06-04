import { useState, useEffect } from 'react';
import { api } from '../services/api';

function useSedesManagement() {
  const [sedes, setSedes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Creation form state
  const [nombreSede, setNombreSede] = useState('');
  const [selectedJefesIds, setSelectedJefesIds] = useState([]); // array of user IDs

  // Filters state
  const [searchText, setSearchText] = useState('');
  const [filterOwner, setFilterOwner] = useState('');

  // Editing state
  const [editingSede, setEditingSede] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [negocios, users] = await Promise.all([
        api.listarNegocios(),
        api.listarUsuarios()
      ]);
      setSedes(negocios || []);
      setUsuarios(users || []);
    } catch (err) {
      console.error(err);
      setError('Error al cargar la información de sedes y usuarios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateSede = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!nombreSede.trim()) {
      setError('El nombre de la sede es requerido.');
      return;
    }

    setLoading(true);
    try {
      await api.crearNegocio({
        nombre: nombreSede.trim(),
        duenoIds: selectedJefesIds
      });
      setSuccess('Sede creada exitosamente.');
      setNombreSede('');
      setSelectedJefesIds([]);
      await loadData();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al crear la sede.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSede = async (id, nombre, jefesIds) => {
    setError(null);
    setSuccess(null);
    if (!nombre.trim()) {
      setError('El nombre de la sede es requerido.');
      return;
    }

    setLoading(true);
    try {
      await api.actualizarNegocio(id, {
        nombre: nombre.trim(),
        duenoIds: jefesIds
      });
      setSuccess('Sede actualizada exitosamente.');
      setEditingSede(null);
      setShowEditModal(false);
      await loadData();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al actualizar la sede.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSede = async (id) => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      await api.eliminarNegocio(id);
      setSuccess('Sede eliminada exitosamente.');
      await loadData();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al eliminar la sede.');
    } finally {
      setLoading(false);
    }
  };

  // Filter lists of users to get JEFEs only (excluding ADMIN role)
  const jefesOnly = usuarios.filter(u => u.rol === 'JEFE');

  // Filter sedes list based on search and owner
  const filteredSedes = sedes.filter(sede => {
    const matchName = !searchText || sede.nombre?.toLowerCase().includes(searchText.toLowerCase());
    
    let matchOwner = true;
    if (filterOwner) {
      const ownersList = sede.duenos ? SedeOwnersArray(sede.duenos) : [];
      matchOwner = ownersList.includes(filterOwner);
    }
    
    return matchName && matchOwner;
  });

  function SedeOwnersArray(duenosStr) {
    if (!duenosStr) return [];
    return duenosStr.split(',').map(s => s.trim()).filter(Boolean);
  }

  return {
    sedes,
    usuarios,
    loading,
    error,
    setError,
    success,
    setSuccess,
    nombreSede,
    setNombreSede,
    selectedJefesIds,
    setSelectedJefesIds,
    searchText,
    setSearchText,
    filterOwner,
    setFilterOwner,
    editingSede,
    setEditingSede,
    showEditModal,
    setShowEditModal,
    jefesOnly,
    filteredSedes,
    SedeOwnersArray,
    handleCreateSede,
    handleUpdateSede,
    handleDeleteSede,
    loadData
  };
}

export default useSedesManagement;
