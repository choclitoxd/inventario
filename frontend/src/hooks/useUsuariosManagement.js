import { useState, useEffect } from 'react';
import { api } from '../services/api';

function useUsuariosManagement() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Active Session User
  const [activeUser, setActiveUser] = useState(null);

  // Creation form state
  const [userForm, setUserForm] = useState({
    username: '',
    password: '',
    nombre: '',
    rol: 'ORGANIZADOR'
  });

  // Filters state
  const [searchText, setSearchText] = useState('');
  const [filterRol, setFilterRol] = useState('');

  // Editing state
  const [editingUsuario, setEditingUsuario] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const users = await api.listarUsuarios();
      setUsuarios(users || []);
    } catch (err) {
      console.error(err);
      setError('Error al cargar el listado de usuarios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const sessionStr = localStorage.getItem('panini_session');
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        setActiveUser(session);
      } catch (_) {}
    }
  }, []);

  const handleCreateUser = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError(null);
    setSuccess(null);

    const { username, password, nombre, rol } = userForm;
    if (!username.trim() || !password.trim() || !nombre.trim() || !rol) {
      setError('Todos los campos son obligatorios para crear un usuario.');
      return;
    }

    setLoading(true);
    try {
      await api.crearUsuario({
        username: username.trim().toLowerCase(),
        password: password.trim(),
        nombre: nombre.trim(),
        rol
      });
      setSuccess('Usuario creado exitosamente.');
      setUserForm({
        username: '',
        password: '',
        nombre: '',
        rol: 'ORGANIZADOR'
      });
      await loadData();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al crear el usuario.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (id, nombre, rol, password) => {
    setError(null);
    setSuccess(null);

    if (!nombre.trim() || !rol) {
      setError('El nombre completo y el rol son obligatorios.');
      return;
    }

    setLoading(true);
    try {
      const payload = { nombre: nombre.trim(), rol };
      if (password && password.trim()) {
        payload.password = password.trim();
      }
      await api.actualizarUsuario(id, payload);
      setSuccess('Usuario actualizado exitosamente.');
      setEditingUsuario(null);
      setShowEditModal(false);
      await loadData();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al actualizar el usuario.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    setError(null);
    setSuccess(null);

    if (activeUser && activeUser.id === id) {
      setError('No puedes auto-eliminar tu propia cuenta de usuario activa.');
      return;
    }

    setLoading(true);
    try {
      await api.eliminarUsuario(id);
      setSuccess('Usuario eliminado exitosamente.');
      await loadData();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al eliminar el usuario.');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsuarios = usuarios.filter(user => {
    const matchText = !searchText || 
      user.nombre?.toLowerCase().includes(searchText.toLowerCase()) || 
      user.username?.toLowerCase().includes(searchText.toLowerCase());

    const matchRol = !filterRol || user.rol === filterRol;

    return matchText && matchRol;
  });

  return {
    usuarios,
    loading,
    error,
    setError,
    success,
    setSuccess,
    activeUser,
    userForm,
    setUserForm,
    searchText,
    setSearchText,
    filterRol,
    setFilterRol,
    editingUsuario,
    setEditingUsuario,
    showEditModal,
    setShowEditModal,
    filteredUsuarios,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
    loadData
  };
}

export default useUsuariosManagement;
