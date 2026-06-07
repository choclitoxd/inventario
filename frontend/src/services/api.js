const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    ...options.headers,
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const activeNegocioId = localStorage.getItem('active_negocio_id');
  if (activeNegocioId) {
    headers['X-Negocio-Id'] = activeNegocioId;
  }

  const sessionStr = localStorage.getItem('panini_session');
  if (sessionStr) {
    try {
      const session = JSON.parse(sessionStr);
      if (session && session.username) {
        headers['X-User-Username'] = session.username;
      }
    } catch (_) {}
  }

  const response = await fetch(url, { ...options, headers });
  
  if (!response.ok) {
    let errorMessage = `API Error: ${response.status} ${response.statusText}`;
    try {
      const errBody = await response.json();
      if (errBody && errBody.message) errorMessage = errBody.message;
    } catch (_) {}
    throw new Error(errorMessage);
  }

  if (response.status === 204) return null;
  
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export const api = {
  // Autenticación
  login: (username, password) => request('/api/usuarios/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  listarNegocios: () => request('/api/negocios'),
  crearNegocio: (negocio) => request('/api/negocios', { method: 'POST', body: JSON.stringify(negocio) }),
  actualizarNegocio: (id, negocio) => request(`/api/negocios/${id}`, { method: 'PUT', body: JSON.stringify(negocio) }),
  eliminarNegocio: (id) => request(`/api/negocios/${id}`, { method: 'DELETE' }),
  listarUsuarios: () => request('/api/usuarios'),
  crearUsuario: (usuario) => request('/api/usuarios', { method: 'POST', body: JSON.stringify(usuario) }),
  actualizarUsuario: (id, usuario) => request(`/api/usuarios/${id}`, { method: 'PUT', body: JSON.stringify(usuario) }),
  eliminarUsuario: (id) => request(`/api/usuarios/${id}`, { method: 'DELETE' }),
  listarAuditoria: () => request('/api/auditoria'),

  // Consola de base de datos avanzada
  obtenerDbSalud: () => request('/api/admin/db/health'),
  ejecutarSql: (query) => request('/api/admin/db/query', { method: 'POST', body: JSON.stringify({ query }) }),
  restaurarBackup: (formData) => request('/api/admin/db/restore', { method: 'POST', body: formData }),

  // Clientes
  listarClientes: () => request('/api/clientes'),
  buscarClientePorTelefono: (telefono) => request(`/api/clientes/buscar?telefono=${encodeURIComponent(telefono)}`),
  registrarCliente: (cliente) => request('/api/clientes', { method: 'POST', body: JSON.stringify(cliente) }),

  // Productos
  listarProductos: () => request('/api/productos'),
  crearProducto: (producto) => request('/api/productos', { method: 'POST', body: JSON.stringify(producto) }),
  actualizarProductoAdmin: (id, producto) => request(`/api/admin/productos/${id}`, { method: 'PUT', body: JSON.stringify(producto) }),
  eliminarProductoAdmin: (id) => request(`/api/admin/productos/${id}`, { method: 'DELETE' }),
  crearCombo: (dto) => request('/api/productos/combos', { method: 'POST', body: JSON.stringify(dto) }),
  obtenerComposicionCombo: (id) => request(`/api/productos/${id}/composicion`),

  // Lotes e Inversionistas
  listarLotes: () => request('/api/lotes'),
  listarDeudasInversionistas: () => request('/api/lotes/inversionistas/deudas'),
  registrarEntradaLote: (dto) => request('/api/lotes', { method: 'POST', body: JSON.stringify(dto) }),
  registrarAbonoManual: (id, monto, notas) => request(`/api/lotes/${id}/amortizar`, { 
    method: 'POST', 
    body: JSON.stringify({ monto, notas }) 
  }),

  // Inventario
  listarInventario: () => request('/api/inventario'),
  obtenerInventarioGlobal: () => request('/api/inventario/global'),
  abrirCaja: (id, options = {}) => request(`/api/inventario/${id}/abrir-caja`, { method: 'POST', ...options }),
  abrirPacaLaminas: (id) => request(`/api/inventario/${id}/abrir-paca-laminas`, { method: 'POST' }),
  abrirPacaAlbumes: (id) => request(`/api/inventario/${id}/abrir-paca-albumes`, { method: 'POST' }),
  desglosarInventario: (productoId, loteId, accion) => request(`/api/inventario/desglosar?productoId=${productoId}&loteId=${loteId}&accion=${accion}`, { method: 'POST' }),
  vincularProductoInventario: (dto) => request('/api/sedes/inventario', { method: 'POST', body: JSON.stringify(dto) }),
  actualizarInventarioSede: (id, dto) => request(`/api/sedes/inventario/${id}`, { method: 'PUT', body: JSON.stringify(dto) }),
  eliminarInventarioSede: (id) => request(`/api/sedes/inventario/${id}`, { method: 'DELETE' }),

  // Ventas
  listarVentas: () => request('/api/ventas'),
  registrarVenta: (dto) => request('/api/ventas', { method: 'POST', body: JSON.stringify(dto) }),
  obtenerPreciosSugeridos: (productoId) => request(`/api/ventas/sugerencia-precios?productoId=${productoId}`),

  // Gastos
  listarGastos: () => request('/api/gastos'),
  registrarGasto: (dto) => request('/api/gastos', { method: 'POST', body: JSON.stringify(dto) }),

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
