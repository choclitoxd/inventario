import { request } from './api';

export const authService = {
  // Autenticación
  login: (username, password) => request('/api/usuarios/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  
  // Negocios/Sedes
  listarNegocios: () => request('/api/negocios'),
  crearNegocio: (negocio) => request('/api/negocios', { method: 'POST', body: JSON.stringify(negocio) }),
  actualizarNegocio: (id, negocio) => request(`/api/negocios/${id}`, { method: 'PUT', body: JSON.stringify(negocio) }),
  eliminarNegocio: (id) => request(`/api/negocios/${id}`, { method: 'DELETE' }),
  
  // Usuarios
  listarUsuarios: () => request('/api/usuarios'),
  crearUsuario: (usuario) => request('/api/usuarios', { method: 'POST', body: JSON.stringify(usuario) }),
  actualizarUsuario: (id, usuario) => request(`/api/usuarios/${id}`, { method: 'PUT', body: JSON.stringify(usuario) }),
  eliminarUsuario: (id) => request(`/api/usuarios/${id}`, { method: 'DELETE' }),
  
  // Auditoria
  listarAuditoria: () => request('/api/auditoria'),

  // Consola de base de datos avanzada
  obtenerDbSalud: () => request('/api/admin/db/health'),
  ejecutarSql: (query) => request('/api/admin/db/query', { method: 'POST', body: JSON.stringify({ query }) }),
  restaurarBackup: (formData) => request('/api/admin/db/restore', { method: 'POST', body: formData }),

  // Catálogo Maestro de Productos
  listarProductos: () => request('/api/productos'),
  crearProducto: (producto) => request('/api/productos', { method: 'POST', body: JSON.stringify(producto) }),
  actualizarProductoAdmin: (id, producto) => request(`/api/admin/productos/${id}`, { method: 'PUT', body: JSON.stringify(producto) }),
  eliminarProductoAdmin: (id) => request(`/api/admin/productos/${id}`, { method: 'DELETE' }),
  crearCombo: (dto) => request('/api/productos/combos', { method: 'POST', body: JSON.stringify(dto) }),
  obtenerComposicionCombo: (id) => request(`/api/productos/${id}/composicion`),

  // Reportes y Analítica
  obtenerResumen: (desde, hasta) => {
    let query = '';
    if (desde && hasta) {
      query = `?desde=${encodeURIComponent(desde)}&hasta=${encodeURIComponent(hasta)}`;
    } else if (desde) {
      query = `?desde=${encodeURIComponent(desde)}`;
    } else if (hasta) {
      query = `?hasta=${encodeURIComponent(hasta)}`;
    }
    return request(`/api/reportes/resumen${query}`);
  },
  obtenerCapitalSegmentado: () => request('/api/reportes/capital-segmentado'),
  obtenerFluctuacionPrecios: () => request('/api/reportes/fluctuacion-precios'),
};
