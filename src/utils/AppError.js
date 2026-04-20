/**
 * Clase de error personalizada para la aplicación.
 * Permite diferenciar errores operacionales (esperados) de errores de programación.
 *
 * @example
 *   throw new AppError('Cliente no encontrado', 404);
 *   throw new AppError('Datos de entrada inválidos', 400);
 */
export class AppError extends Error {
  /**
   * @param {string} message - Mensaje descriptivo del error
   * @param {number} statusCode - Código HTTP (400, 401, 403, 404, 409, 500…)
   * @param {boolean} isOperational - true = error esperado, false = bug
   */
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.name = 'AppError';

    // Captura el stack trace sin incluir el constructor en la traza
    Error.captureStackTrace(this, this.constructor);
  }
}
