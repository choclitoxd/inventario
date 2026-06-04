const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const activeNegocioId = localStorage.getItem('active_negocio_id');
  if (activeNegocioId) {
    headers['X-Negocio-Id'] = activeNegocioId;
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

  // Clientes
  listarClientes: () => request('/api/clientes'),
  buscarClientePorTelefono: (telefono) => request(`/api/clientes/buscar?telefono=${encodeURIComponent(telefono)}`),
  registrarCliente: (cliente) => request('/api/clientes', { method: 'POST', body: JSON.stringify(cliente) }),

  // Productos
  listarProductos: () => request('/api/productos'),
  crearProducto: (producto) => request('/api/productos', { method: 'POST', body: JSON.stringify(producto) }),
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
  abrirCaja: (id) => request(`/api/inventario/${id}/abrir-caja`, { method: 'POST' }),
  abrirPacaLaminas: (id) => request(`/api/inventario/${id}/abrir-paca-laminas`, { method: 'POST' }),
  abrirPacaAlbumes: (id) => request(`/api/inventario/${id}/abrir-paca-albumes`, { method: 'POST' }),

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
