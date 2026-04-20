import { jest } from '@jest/globals';

// Mock de variables de entorno
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = '976b960f7c7184d657b45b843fa968b23e1b5bb4b8719a727e19acb83ecacc23939ab766c7bc09c4d40bb56bf9fc123afac30bcd2f4a3524779a5b5bb58538bb';
process.env.JWT_EXPIRES_IN = '1h';
process.env.SUPABASE_URL = 'https://example.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';

// Mock global de console para limpiar la salida de los tests
global.console = {
  ...console,
  log: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock del cliente de Supabase
jest.unstable_mockModule('../src/config/db.js', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      range: jest.fn().mockReturnThis(),
      ilike: jest.fn().mockReturnThis(),
    })),
  },
}));

// Aumentar timeout para tests de integración
jest.setTimeout(20000);
