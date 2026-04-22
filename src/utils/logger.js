import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import { fileURLToPath } from 'url';

const currentFileName = fileURLToPath(import.meta.url);
const currentDirName = path.dirname(currentFileName);

// Directorio de logs en la raíz del proyecto
const LOG_DIR = path.join(currentDirName, '..', '..', 'logs');

// Determinar si estamos en producción
const isProduction = process.env.NODE_ENV === 'production';

// Formato legible para desarrollo (con colores)
const devFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `${timestamp} ${level}: ${message}${metaStr}`;
  })
);

// Formato JSON para producción (parseable por herramientas de monitoreo)
const prodFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Transport de archivo rotativo (siempre activo)
const fileTransport = new DailyRotateFile({
  dirname: LOG_DIR,
  filename: 'app-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '10m',
  maxFiles: '14d', // Mantener logs de los últimos 14 días
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  )
});

// Transport de archivo para errores (separado para facilitar monitoreo)
const errorFileTransport = new DailyRotateFile({
  dirname: LOG_DIR,
  filename: 'error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '10m',
  maxFiles: '30d', // Mantener errores por 30 días
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  )
});

// Transport de consola
const consoleTransport = new winston.transports.Console({
  format: isProduction ? prodFormat : devFormat,
  level: isProduction ? 'info' : 'debug'
});

// Crear el logger
const logger = winston.createLogger({
  level: isProduction ? 'info' : 'debug',
  defaultMeta: { service: 'sipo-backend' },
  transports: [
    consoleTransport,
    fileTransport,
    errorFileTransport
  ],
  // No finalizar el proceso en errores de transports
  exitOnError: false
});

export default logger;
