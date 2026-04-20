import logger from '../utils/logger.js';

/**
 * Módulo centralizado para gestión de secretos y variables sensibles.
 *
 * Encapsula el acceso a variables de entorno sensibles, facilitando
 * una futura migración a un secret manager (Azure Key Vault, AWS SM, etc.)
 * sin necesidad de cambiar el código consumidor.
 */

/**
 * Obtiene una variable de entorno requerida.
 * Lanza un error descriptivo si no está definida.
 *
 * @param {string} name - Nombre de la variable de entorno
 * @returns {string} Valor de la variable
 */
function getRequired(name) {
  const value = process.env[name];
  if (!value) {
    const msg = `⚠️ Variable de entorno requerida no encontrada: ${name}. Revisa tu archivo .env`;
    logger.error(msg);
    throw new Error(msg);
  }
  return value;
}

/**
 * Obtiene una variable de entorno opcional con valor por defecto.
 *
 * @param {string} name - Nombre de la variable de entorno
 * @param {string} defaultValue - Valor por defecto
 * @returns {string} Valor de la variable o el default
 */
function getOptional(name, defaultValue = '') {
  return process.env[name] || defaultValue;
}

// ============================================================
// Exportaciones de secretos específicos
// ============================================================

export const secrets = {
  /** URL del proyecto Supabase */
  getSupabaseUrl: () => getRequired('SUPABASE_URL'),

  /** Service Role Key de Supabase (privilegios completos) */
  getSupabaseKey: () => getRequired('SUPABASE_SERVICE_ROLE_KEY'),

  /** Secreto para firmar/verificar JWT */
  getJwtSecret: () => getRequired('JWT_SECRET'),

  /** Puerto del servidor (con fallback a 3000) */
  getPort: () => getOptional('PORT', '3000'),

  /** Orígenes CORS permitidos (separados por coma) */
  getCorsOrigin: () => getOptional('CORS_ORIGIN', 'http://localhost:5173'),

  /** Entorno actual */
  getNodeEnv: () => getOptional('NODE_ENV', 'development'),

  /**
   * Valida que todas las variables críticas estén presentes.
   * Llamar al arranque de la aplicación.
   */
  validateAll: () => {
    const required = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'JWT_SECRET'];
    const missing = required.filter(name => !process.env[name]);

    if (missing.length > 0) {
      const msg = `⚠️ Variables de entorno faltantes: ${missing.join(', ')}. Revisa tu archivo .env`;
      logger.error(msg);
      throw new Error(msg);
    }

    logger.info('✅ Todas las variables de entorno requeridas están configuradas');
  }
};
