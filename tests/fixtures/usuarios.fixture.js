export const usuariosFixture = {
  validUser: {
    nombre: 'Juan',
    apellido: 'Pérez',
    correo: 'juan.perez@email.com',
    password: 'password123',
    rol: 'arquitecto'
  },

  ingeniero: {
    nombre: 'Carlos',
    apellido: 'García',
    correo: 'carlos.garcia@email.com',
    password: 'password123',
    rol: 'ingeniero'
  },

  residente: {
    nombre: 'Ana',
    apellido: 'Martínez',
    correo: 'ana.martinez@email.com',
    password: 'password123',
    rol: 'residente'
  },

  invalidUser: {
    nombre: '', // Vacío
    apellido: '', // Vacío
    correo: 'correo_invalido', // Formato inválido
    password: '', // Vacío
    rol: 'rol_invalido' // No existe
  },

  incompleteUser: {
    nombre: 'Test',
    // Falta apellido, correo, password, rol
  },

  duplicateEmailUser: {
    nombre: 'Test',
    apellido: 'Duplicate',
    correo: 'juan.perez@email.com', // Mismo correo que validUser
    password: 'password123',
    rol: 'ingeniero'
  },

  loginValid: {
    correo: 'juan.perez@email.com',
    password: 'password123'
  },

  loginInvalidEmail: {
    correo: 'noexiste@email.com',
    password: 'password123'
  },

  loginInvalidPassword: {
    correo: 'juan.perez@email.com',
    password: 'password_incorrecto'
  },

  loginIncomplete: {
    correo: 'juan.perez@email.com'
    // Falta password
  }
};

export const expectedResponses = {
  userCreated: {
    success: true,
    message: 'Usuario creado correctamente'
  },

  loginSuccess: {
    success: true,
    message: 'Login exitoso'
  },

  validationError: (message) => ({
    success: false,
    message
  }),

  duplicateEmailError: {
    success: false,
    message: 'duplicate key value violates unique constraint "usuarios_correo_key"'
  },

  userNotFoundError: {
    success: false,
    message: 'Usuario no encontrado'
  },

  incorrectPasswordError: {
    success: false,
    message: 'Contraseña incorrecta'
  }
};

export const mockUsuario = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  nombre: 'Juan',
  apellido: 'Pérez',
  correo: 'juan.perez@email.com',
  rol: 'arquitecto',
  created_at: new Date('2026-04-01T12:00:00Z'),
  password_hash: '$2b$10$mock_hash_for_testing',
  
  toPublic: function() {
    return {
      id: this.id,
      nombre: this.nombre,
      apellido: this.apellido,
      correo: this.correo,
      rol: this.rol,
      created_at: this.created_at
    };
  }
};

export const mockUsuarioWithToken = {
  ...mockUsuario,
  token: 'mock_jwt_token_for_testing',
  
  toPublic: function() {
    return {
      ...mockUsuario.toPublic(),
      token: this.token
    };
  }
};
