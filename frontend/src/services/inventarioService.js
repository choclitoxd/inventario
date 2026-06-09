import { request } from './api';

export const inventarioService = {
  listarInventario: () => request('/api/inventario'),
  obtenerInventarioGlobal: () => request('/api/inventario/global'),
  abrirCaja: (id, options = {}) => request(`/api/inventario/${id}/abrir-caja`, { method: 'POST', ...options }),
  abrirPacaLaminas: (id) => request(`/api/inventario/${id}/abrir-paca-laminas`, { method: 'POST' }),
  abrirPacaAlbumes: (id) => request(`/api/inventario/${id}/abrir-paca-albumes`, { method: 'POST' }),
  desglosarInventario: (productoId, loteId, accion) => request(`/api/inventario/desglosar?productoId=${productoId}&loteId=${loteId}&accion=${accion}`, { method: 'POST' }),
  vincularProductoInventario: (dto) => request('/api/sedes/inventario', { method: 'POST', body: JSON.stringify(dto) }),
  actualizarInventarioSede: (id, dto) => request(`/api/sedes/inventario/${id}`, { method: 'PUT', body: JSON.stringify(dto) }),
  eliminarInventarioSede: (id) => request(`/api/sedes/inventario/${id}`, { method: 'DELETE' }),
};
