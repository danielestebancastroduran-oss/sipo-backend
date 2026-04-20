# 📋 Tests del Backend SIPO

## 📁 Estructura de Tests

```
tests/
├── unit/                    # Tests unitarios
│   └── usuario.controller.test.js
├── integration/             # Tests de integración
│   └── usuarios.integration.test.js
├── fixtures/                # Datos de prueba
│   └── usuarios.fixture.js
├── helpers/                 # Utilidades para tests
│   └── test.helper.js
├── setup.js                 # Configuración global
└── README.md               # Este archivo
```

## 🚀 Comandos para Ejecutar Tests

### Ejecutar todos los tests
```bash
npm test
```

### Ejecutar tests en modo watch
```bash
npm run test:watch
```

### Ejecutar solo tests unitarios
```bash
npm run test:unit
```

### Ejecutar solo tests de integración
```bash
npm run test:integration
```

### Generar reporte de cobertura
```bash
npm run test:coverage
```

## 🧪 Tipos de Tests

### 1. Tests Unitarios (`unit/`)
- Prueban componentes individuales en aislamiento
- Usan mocks para dependencias externas
- Rápidos y determinísticos
- Ejemplo: `UsuarioController.register()`

### 2. Tests de Integración (`integration/`)
- Prueban la interacción entre componentes
- Usan la base de datos real (de prueba)
- Más lentos pero más realistas
- Ejemplo: `POST /api/usuarios` completo

## 📊 Fixtures

Los archivos en `fixtures/` contienen datos de prueba reutilizables:

```javascript
import { usuariosFixture } from '../fixtures/usuarios.fixture.js';

const validUser = usuariosFixture.validUser;
```

## 🛠️ Helpers

Clases y funciones utilitarias en `helpers/`:

```javascript
import { TestHelper } from '../helpers/test.helper.js';

// Limpiar usuarios de prueba
await TestHelper.limpiarUsuariosTest();

// Crear usuario de prueba
const usuario = await TestHelper.crearUsuarioTest(userData);
```

## 🔧 Configuración

### Variables de Entorno para Tests
- `NODE_ENV=test`
- `JWT_SECRET=test_jwt_secret`
- `JWT_EXPIRES_IN=1h`

### Configuración Jest
- Archivo: `jest.config.js`
- Setup: `tests/setup.js`
- Timeout: 10 segundos para tests asíncronos

## 📝 Escribiendo Nuevos Tests

### Test Unitario Ejemplo
```javascript
describe('MiController', () => {
  it('debería hacer X', async () => {
    // Arrange
    const mockReq = TestHelper.mockRequest({ body: {...} });
    const mockRes = TestHelper.mockResponse();
    
    // Act
    await controller.metodo(mockReq, mockRes);
    
    // Assert
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(expectedResponse);
  });
});
```

### Test de Integración Ejemplo
```javascript
describe('POST /api/endpoint', () => {
  it('debería crear recurso', async () => {
    const response = await request(app)
      .post('/api/endpoint')
      .send(validData)
      .expect(201);
      
    expect(response.body).toHaveProperty('success', true);
  });
});
```

## 🧹 Limpieza de Datos

Los tests de integración usan la base de datos real. Para evitar contaminar los datos:

1. **Before/After All**: Limpiar datos antes y después de los tests
2. **Fixtures**: Usar correos únicos con timestamps
3. **Helpers**: Usar `TestHelper.limpiarUsuariosTest()`

## 🔍 Debugging

### Ver Logs en Tests
Los tests silencian logs por defecto. Para activarlos:

```javascript
// En el test específico
global.console.log = console.log;

// O comentar en setup.js
// global.console = { ...console, log: jest.fn() };
```

### Debug con Breakpoints
```javascript
// Agrega en el test
debugger;
```

## 📈 Cobertura

Para ver el reporte de cobertura:
```bash
npm run test:coverage
```

Se genera en la carpeta `coverage/`:
- `coverage/lcov-report/index.html` - Reporte HTML
- `coverage/lcov.info` - Para integración CI/CD

## 🚨 Buenas Prácticas

1. **Tests Descriptivos**: Nombres claros que digan qué se prueba
2. **Arrange-Act-Assert**: Estructura clara en cada test
3. **Datos Independientes**: Cada test debe funcionar solo
4. **Limpieza**: Dejar la BD como estaba después de cada test
5. **Mocks Realistas**: Simular comportamiento real de dependencias

## 🐛 Problemas Comunes

### 1. Error: "Cannot find module"
- **Solución**: Usar extensión `.js` en imports
- **Ejemplo**: `import { Controller } from './controller.js'`

### 2. Error: "Jest encountered an unexpected token"
- **Solución**: Configurar ES modules en `jest.config.js`
- **Verificar**: `type: "module"` en `package.json`

### 3. Tests lentos
- **Solución**: Usar mocks en lugar de BD real cuando sea posible
- **Optimizar**: Limpiar solo datos necesarios

### 4. Tests intermitentes (flaky)
- **Solución**: Agregar `jest.setTimeout()` para operaciones asíncronas
- **Evitar**: Dependencia de tiempo real

## 🔄 Integración CI/CD

Para GitHub Actions:
```yaml
- name: Run tests
  run: npm test
- name: Generate coverage
  run: npm run test:coverage
- name: Upload coverage
  uses: codecov/codecov-action@v1
```

## 📚 Recursos Adicionales

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
