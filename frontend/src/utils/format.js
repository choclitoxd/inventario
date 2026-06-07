/**
 * Formatea un valor numérico a moneda COP estándar para Colombia (Ej: $ 798.000)
 * @param {number|string} val - El valor a formatear
 * @returns {string} El valor formateado
 */
export const formatCurrency = (val) => {
  const num = typeof val === 'number' ? val : parseFloat(val) || 0;
  const formatted = new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num);
  return `$ ${formatted}`;
};
