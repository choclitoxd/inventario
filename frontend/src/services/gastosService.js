import { request } from './api';

export const gastosService = {
  listarGastos: () => request('/api/gastos'),
  registrarGasto: (dto) => request('/api/gastos', { method: 'POST', body: JSON.stringify(dto) }),
};
