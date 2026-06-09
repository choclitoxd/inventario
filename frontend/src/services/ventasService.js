import { request } from './api';

export const ventasService = {
  listarVentas: () => request('/api/ventas'),
  registrarVenta: (dto) => request('/api/ventas', { method: 'POST', body: JSON.stringify(dto) }),
  obtenerPreciosSugeridos: (productoId) => request(`/api/ventas/sugerencia-precios?productoId=${productoId}`),
  listarClientes: () => request('/api/clientes'),
  buscarClientePorTelefono: (telefono) => request(`/api/clientes/buscar?telefono=${encodeURIComponent(telefono)}`),
  buscarClientesPredictivo: (query) => request(`/api/clientes/search?query=${encodeURIComponent(query)}`),
  registrarCliente: (cliente) => request('/api/clientes', { method: 'POST', body: JSON.stringify(cliente) }),
};
