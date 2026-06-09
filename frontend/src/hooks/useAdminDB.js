import { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { ventasService } from '../services/ventasService';
import { proveedorService } from '../services/proveedorService';
import { gastosService } from '../services/gastosService';

function useAdminDB() {
  const [stats, setStats] = useState({
    clientes: 0,
    productos: 0,
    ventas: 0,
    lotes: 0,
    gastos: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);
  
  // Sede / Negocio creation state
  const [negocioNombre, setNegocioNombre] = useState('');
  const [negocioLoading, setNegocioLoading] = useState(false);
  const [negocioSuccess, setNegocioSuccess] = useState(false);
  const [negocioError, setNegocioError] = useState(null);

  // User creation state
  const [userForm, setUserForm] = useState({
    username: '',
    password: '',
    nombre: '',
    rol: 'ORGANIZADOR'
  });
  const [userLoading, setUserLoading] = useState(false);
  const [userSuccess, setUserSuccess] = useState(false);
  const [userError, setUserError] = useState(null);

  // Lists for management
  const [negociosList, setNegociosList] = useState([]);
  const [usuariosList, setUsuariosList] = useState([]);

  // Audit state
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditLoading, setAuditLoading] = useState(true);
  const [auditError, setAuditError] = useState(null);

  // DB Health, SQL Playground y Backup/Restore
  const [dbHealth, setDbHealth] = useState(null);
  const [dbHealthLoading, setDbHealthLoading] = useState(true);
  const [dbHealthError, setDbHealthError] = useState(null);

  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM productos LIMIT 10;');
  const [queryResult, setQueryResult] = useState(null);
  const [queryLoading, setQueryLoading] = useState(false);
  const [queryError, setQueryError] = useState(null);

  const [restoreFile, setRestoreFile] = useState(null);
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [restoreSuccess, setRestoreSuccess] = useState(false);
  const [restoreError, setRestoreError] = useState(null);

  const fetchStatsAndLists = async () => {
    setStatsLoading(true);
    try {
      const [clientes, productos, ventas, lotes, gastos, negocios, usuarios] = await Promise.all([
        ventasService.listarClientes().catch(() => []),
        authService.listarProductos().catch(() => []),
        ventasService.listarVentas().catch(() => []),
        proveedorService.listarLotes().catch(() => []),
        gastosService.listarGastos().catch(() => []),
        authService.listarNegocios().catch(() => []),
        authService.listarUsuarios().catch(() => [])
      ]);

      setStats({
        clientes: clientes.length,
        productos: productos.length,
        ventas: ventas.length,
        lotes: lotes.length,
        gastos: gastos.length
      });

      setNegociosList(negocios || []);
      setUsuariosList(usuarios || []);
    } catch (err) {
      console.error(err);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchDbHealth = async () => {
    setDbHealthLoading(true);
    setDbHealthError(null);
    try {
      const data = await authService.obtenerDbSalud();
      setDbHealth(data);
    } catch (err) {
      console.error(err);
      setDbHealthError('Error al cargar métricas de la base de datos.');
    } finally {
      setDbHealthLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    setAuditLoading(true);
    setAuditError(null);
    try {
      const logs = await authService.listarAuditoria();
      setAuditLogs(logs || []);
    } catch (err) {
      console.error(err);
      setAuditError('Error al cargar la bitácora de auditoría.');
    } finally {
      setAuditLoading(false);
    }
  };

  const handleExecuteSql = async (queryToExecute) => {
    const query = queryToExecute || sqlQuery;
    if (!query.trim()) return;

    setQueryLoading(true);
    setQueryError(null);
    setQueryResult(null);
    try {
      const res = await authService.ejecutarSql(query.trim());
      setQueryResult(res);
      // Si fue una consulta de actualización o alteró algo, refrescar
      if (res.updateCount > 0 || !query.trim().toLowerCase().startsWith('select')) {
        fetchStatsAndLists();
        fetchDbHealth();
        fetchAuditLogs();
      }
    } catch (err) {
      setQueryError(err.message || 'Error al ejecutar consulta SQL.');
    } finally {
      setQueryLoading(false);
    }
  };

  const handleDownloadBackup = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const response = await fetch(`${API_BASE_URL}/api/admin/db/backup`);
      if (!response.ok) throw new Error('Error al generar el archivo SQL.');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      const timestamp = new Date().toISOString().replace(/\D/g, '').substring(0, 14);
      a.download = `backup_panini_${timestamp}.sql`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Error en descarga: ' + err.message);
    }
  };

  const handleRestoreBackup = async (fileToRestore) => {
    const file = fileToRestore || restoreFile;
    if (!file) return;

    setRestoreLoading(true);
    setRestoreError(null);
    setRestoreSuccess(false);

    const formData = new FormData();
    formData.append('file', file);

    try {
      await authService.restaurarBackup(formData);
      setRestoreSuccess(true);
      setRestoreFile(null);
      
      fetchStatsAndLists();
      fetchDbHealth();
      fetchAuditLogs();
    } catch (err) {
      setRestoreError(err.message || 'Error al restaurar base de datos.');
    } finally {
      setRestoreLoading(false);
    }
  };

  const handleCreateNegocio = async (nombre) => {
    const name = nombre || negocioNombre;
    if (!name.trim()) return;
    
    setNegocioLoading(true);
    setNegocioError(null);
    setNegocioSuccess(false);
    try {
      await authService.crearNegocio({ nombre: name.trim() });
      setNegocioSuccess(true);
      setNegocioNombre('');
      fetchStatsAndLists();
      fetchAuditLogs();
    } catch (err) {
      setNegocioError(err.message || 'Error al crear el negocio.');
    } finally {
      setNegocioLoading(false);
    }
  };

  const handleCreateUser = async (userFormToCreate) => {
    const form = userFormToCreate || userForm;
    if (!form.username.trim() || !form.password || !form.nombre.trim()) return;

    setUserLoading(true);
    setUserError(null);
    setUserSuccess(false);
    try {
      await authService.crearUsuario({
        username: form.username.trim(),
        password: form.password,
        nombre: form.nombre.trim(),
        rol: form.rol
      });
      setUserSuccess(true);
      setUserForm({ username: '', password: '', nombre: '', rol: 'ORGANIZADOR' });
      fetchStatsAndLists();
      fetchAuditLogs();
    } catch (err) {
      setUserError(err.message || 'Error al crear el usuario.');
    } finally {
      setUserLoading(false);
    }
  };

  return {
    stats,
    statsLoading,
    negocioNombre,
    setNegocioNombre,
    negocioLoading,
    negocioSuccess,
    setNegocioSuccess,
    negocioError,
    setNegocioError,
    userForm,
    setUserForm,
    userLoading,
    userSuccess,
    setUserSuccess,
    userError,
    setUserError,
    negociosList,
    usuariosList,
    auditLogs,
    auditLoading,
    auditError,
    dbHealth,
    dbHealthLoading,
    dbHealthError,
    sqlQuery,
    setSqlQuery,
    queryResult,
    setQueryResult,
    queryLoading,
    queryError,
    setQueryError,
    restoreFile,
    setRestoreFile,
    restoreLoading,
    restoreSuccess,
    setRestoreSuccess,
    restoreError,
    setRestoreError,
    fetchStatsAndLists,
    fetchDbHealth,
    fetchAuditLogs,
    handleExecuteSql,
    handleDownloadBackup,
    handleRestoreBackup,
    handleCreateNegocio,
    handleCreateUser
  };
}

export default useAdminDB;
