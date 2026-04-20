import logger from '../utils/logger.js';
import { AppError } from '../utils/AppError.js';

// Middleware global de manejo de errores
export const errorHandler = (err, req, res, next) => {
  // Si es un AppError operacional, loguear como warning; si no, como error crítico
  if (err instanceof AppError && err.isOperational) {
    logger.warn(`${req.method} ${req.originalUrl} — ${err.message}`, {
      statusCode: err.statusCode,
      ip: req.ip
    });
  } else {
    logger.error('Error no manejado:', {
      message: err.message,
      stack: err.stack,
      method: req.method,
      url: req.originalUrl,
      ip: req.ip
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.isOperational
    ? err.message
    : 'Error interno del servidor';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Middleware para rutas no encontradas
export const notFoundHandler = (req, res) => {
  logger.warn(`Ruta no encontrada: ${req.method} ${req.originalUrl}`, { ip: req.ip });

  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  });
};
