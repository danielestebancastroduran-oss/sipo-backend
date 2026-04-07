// Configuración global para tests
global.console = {
  ...console,
  // Silenciar logs en tests
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock de variables de entorno
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_jwt_secret';
process.env.JWT_EXPIRES_IN = '1h';

// Configuración de timeout para tests asíncronos
jest.setTimeout(10000);
