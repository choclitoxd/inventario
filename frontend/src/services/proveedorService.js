import { request } from './api';

export const proveedorService = {
  listarLotes: () => request('/api/lotes'),
  listarDeudasInversionistas: () => request('/api/lotes/inversionistas/deudas'),
  registrarEntradaLote: (dto) => request('/api/lotes', { method: 'POST', body: JSON.stringify(dto) }),
  registrarAbonoManual: (id, monto, notas) => request(`/api/lotes/${id}/amortizar`, { 
    method: 'POST', 
    body: JSON.stringify({ monto, notas }) 
  }),
  actualizarLote: (id, dto) => request(`/api/lotes/${id}`, { method: 'PUT', body: JSON.stringify(dto) }),
  eliminarLote: (id) => request(`/api/lotes/${id}`, { method: 'DELETE' }),
  listarProveedores: () => request('/api/proveedores'),
  registrarProveedor: (dto) => request('/api/proveedores', { method: 'POST', body: JSON.stringify(dto) }),
  listarTarifas: () => request('/api/proveedores/tarifas'),
  listarTarifasPorProveedor: (proveedorId) => request(`/api/proveedores/tarifas/proveedor/${proveedorId}`),
  guardarTarifa: (dto) => request('/api/proveedores/tarifas', { method: 'POST', body: JSON.stringify(dto) }),
  eliminarTarifa: (id) => request(`/api/proveedores/tarifas/${id}`, { method: 'DELETE' }),
};
