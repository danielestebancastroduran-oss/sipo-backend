const { UsuarioController } = require('../../src/controllers/usuario.controller.js');
const { UsuarioService } = require('../../src/services/usuario.service.js');
const bcrypt = require('bcrypt');

// Mock del UsuarioService completo
jest.mock('../../src/services/usuario.service.js');

describe('UsuarioController', () => {
  let usuarioController;
  let mockReq;
  let mockRes;
  let mockUsuarioService;

  beforeEach(() => {
    // Restaurar todos los mocks
    jest.restoreAllMocks();
    
    // Crear mocks limpios para cada test
    mockUsuarioService = {
      create: jest.fn(),
      login: jest.fn(),
      getAll: jest.fn(),
      getById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    };

    // Mock del constructor para que devuelva nuestro mock
    UsuarioService.mockImplementation(() => mockUsuarioService);
    
    // Mock de request y response
    mockReq = {
      body: {},
      params: {}
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    
    // Crear instancia del controller DESPUÉS del mock
    usuarioController = new UsuarioController();
  });

  describe('register', () => {
    const validUserData = {
      nombre: 'Juan',
      apellido: 'Pérez',
      correo: 'juan.perez@email.com',
      password: 'password123',
      rol: 'arquitecto'
    };

    it('debería crear un usuario exitosamente', async () => {
      // Arrange
      mockReq.body = validUserData;
      
      const mockUsuario = {
        id: '123',
        nombre: 'Juan',
        apellido: 'Pérez',
        correo: 'juan.perez@email.com',
        rol: 'arquitecto',
        created_at: new Date(),
        toPublic: jest.fn().mockReturnValue({
          id: '123',
          nombre: 'Juan',
          apellido: 'Pérez',
          correo: 'juan.perez@email.com',
          rol: 'arquitecto',
          created_at: new Date()
        })
      };

      mockUsuarioService.create.mockResolvedValue(mockUsuario);

      // Act
      await usuarioController.register(mockReq, mockRes);

      // Assert
      expect(mockUsuarioService.create).toHaveBeenCalledWith({
        nombre: 'Juan',
        apellido: 'Pérez',
        correo: 'juan.perez@email.com',
        password: 'password123',
        rol: 'arquitecto'
      });

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Usuario creado correctamente',
        data: mockUsuario.toPublic()
      });
    });

    it('debería retornar error 400 si faltan datos requeridos', async () => {
      // Arrange
      mockReq.body = {
        nombre: 'Juan',
        // Falta apellido, correo, password, rol
      };

      const errorMessage = 'El apellido es requerido, El correo es requerido, La contraseña es requerida';
      mockUsuarioService.create.mockRejectedValue(new Error(errorMessage));

      // Act
      await usuarioController.register(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });

    it('debería retornar error 400 si el correo ya existe', async () => {
      // Arrange
      mockReq.body = validUserData;
      
      const duplicateError = new Error('duplicate key value violates unique constraint "usuarios_correo_key"');
      mockUsuarioService.create.mockRejectedValue(duplicateError);

      // Act
      await usuarioController.register(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'duplicate key value violates unique constraint "usuarios_correo_key"'
      });
    });

    it('debería manejar errores inesperados', async () => {
      // Arrange
      mockReq.body = validUserData;
      
      const unexpectedError = new Error('Error inesperado en la base de datos');
      mockUsuarioService.create.mockRejectedValue(unexpectedError);

      // Act
      await usuarioController.register(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error inesperado en la base de datos'
      });
    });

    it('debería validar formato de correo electrónico', async () => {
      // Arrange
      mockReq.body = {
        ...validUserData,
        correo: 'correo_invalido'
      };

      const emailError = new Error('El formato del correo es inválido');
      mockUsuarioService.create.mockRejectedValue(emailError);

      // Act
      await usuarioController.register(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'El formato del correo es inválido'
      });
    });

    it('debería validar rol válido', async () => {
      // Arrange
      mockReq.body = {
        ...validUserData,
        rol: 'rol_invalido'
      };

      const roleError = new Error('El rol debe ser: arquitecto, ingeniero o residente');
      mockUsuarioService.create.mockRejectedValue(roleError);

      // Act
      await usuarioController.register(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'El rol debe ser: arquitecto, ingeniero o residente'
      });
    });
  });

  describe('login', () => {
    const validLoginData = {
      correo: 'juan.perez@email.com',
      password: 'password123'
    };

    it('debería hacer login exitosamente', async () => {
      // Arrange
      mockReq.body = validLoginData;
      
      const mockUsuario = {
        id: '123',
        nombre: 'Juan',
        apellido: 'Pérez',
        correo: 'juan.perez@email.com',
        rol: 'arquitecto',
        created_at: new Date(),
        token: 'mock_jwt_token',
        toPublic: jest.fn().mockReturnValue({
          id: '123',
          nombre: 'Juan',
          apellido: 'Pérez',
          correo: 'juan.perez@email.com',
          rol: 'arquitecto',
          created_at: new Date(),
          token: 'mock_jwt_token'
        })
      };

      mockUsuarioService.login.mockResolvedValue(mockUsuario);

      // Act
      await usuarioController.login(mockReq, mockRes);

      // Assert
      expect(mockUsuarioService.login).toHaveBeenCalledWith(
        'juan.perez@email.com',
        'password123'
      );

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Login exitoso',
        data: mockUsuario
      });
    });

    it('debería retornar error 401 si el usuario no existe', async () => {
      // Arrange
      mockReq.body = validLoginData;
      
      const userNotFoundError = new Error('Usuario no encontrado');
      mockUsuarioService.login.mockRejectedValue(userNotFoundError);

      // Act
      await usuarioController.login(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Usuario no encontrado'
      });
    });

    it('debería retornar error 401 si la contraseña es incorrecta', async () => {
      // Arrange
      mockReq.body = validLoginData;
      
      const passwordError = new Error('Contraseña incorrecta');
      mockUsuarioService.login.mockRejectedValue(passwordError);

      // Act
      await usuarioController.login(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Contraseña incorrecta'
      });
    });

    it('debería retornar error 401 si hay problemas con bcrypt', async () => {
      // Arrange
      mockReq.body = validLoginData;
      
      const bcryptError = new Error('data and hash arguments required');
      mockUsuarioService.login.mockRejectedValue(bcryptError);

      // Act
      await usuarioController.login(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'data and hash arguments required'
      });
    });
  });
});