const { UsuarioController } = require('../../src/controllers/usuario.controller.js');
const { UsuarioService } = require('../../src/services/usuario.service.js');
const bcrypt = require('bcrypt');

// Mock del UsuarioService
jest.mock('../../src/services/usuario.service.js');

describe('UsuarioController', () => {
  let usuarioController;
  let mockReq;
  let mockRes;

  beforeEach(() => {
    // Limpiar todos los mocks antes de cada test
    jest.clearAllMocks();
    
    // Crear instancia del controller
    usuarioController = new UsuarioController();
    
    // Mock de request y response
    mockReq = {
      body: {},
      params: {}
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
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

      UsuarioService.prototype.create = jest.fn().mockResolvedValue(mockUsuario);

      // Act
      await usuarioController.register(mockReq, mockRes);

      // Assert
      expect(UsuarioService.prototype.create).toHaveBeenCalledWith({
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
      UsuarioService.prototype.create = jest.fn().mockRejectedValue(new Error(errorMessage));

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
      UsuarioService.prototype.create = jest.fn().mockRejectedValue(duplicateError);

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
      UsuarioService.prototype.create = jest.fn().mockRejectedValue(unexpectedError);

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
      UsuarioService.prototype.create = jest.fn().mockRejectedValue(emailError);

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
      UsuarioService.prototype.create = jest.fn().mockRejectedValue(roleError);

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

      UsuarioService.prototype.login = jest.fn().mockResolvedValue(mockUsuario);

      // Act
      await usuarioController.login(mockReq, mockRes);

      // Assert
      expect(UsuarioService.prototype.login).toHaveBeenCalledWith(
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
      UsuarioService.prototype.login = jest.fn().mockRejectedValue(userNotFoundError);

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
      UsuarioService.prototype.login = jest.fn().mockRejectedValue(passwordError);

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
      UsuarioService.prototype.login = jest.fn().mockRejectedValue(bcryptError);

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
