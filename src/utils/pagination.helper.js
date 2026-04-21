/**
 * Utilidad para manejar la paginación de Supabase de forma estandarizada.
 */

/**
 * Calcula el rango 'from' y 'to' para Supabase basado en limit y offset.
 * 
 * @param {number} limit - Cantidad de registros por página
 * @param {number} offset - Cantidad de registros a saltar
 * @returns {{from: number, to: number}} Rango para .range(from, to)
 */
export const getPaginationRange = (limit = 50, offset = 0) => {
  const from = offset;
  const to = offset + limit - 1;
  return { from, to };
};

/**
 * Estandariza la respuesta paginada.
 * 
 * @param {Array} data - Registros obtenidos
 * @param {number} count - Total de registros en la base de datos
 * @param {number} limit - Límite aplicado
 * @param {number} offset - Offset aplicado
 * @returns {Object} Objeto con data y metadata de paginación
 */
export const formatPaginatedResponse = (data, count, limit, offset) => {
  return {
    success: true,
    data,
    pagination: {
      total: count || 0,
      limit: Number(limit),
      offset: Number(offset)
    }
  };
};
