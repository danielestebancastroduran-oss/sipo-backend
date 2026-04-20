export const trabajadorFixture = {
  validTrabajador: {
    nombre: 'Carlos Rodríguez',
    documento: '123456789',
    telefono: '3001234567',
    correo: 'carlos.rodriguez@email.com',
    salario_diario: 85000,
    especialidad: 'albañil',
    estado: 'activo'
  },

  trabajadorElectricista: {
    nombre: 'Luis Martínez',
    documento: '987654321',
    telefono: '3109876543',
    correo: 'luis.martinez@email.com',
    salario_diario: 95000,
    especialidad: 'electricista',
    estado: 'activo'
  },

  trabajadorPlomero: {
    nombre: 'Pedro González',
    documento: '456789123',
    telefono: '3155555555',
    correo: 'pedro.gonzalez@email.com',
    salario_diario: 90000,
    especialidad: 'plomero',
    estado: 'activo'
  },

  trabajadorCarpintero: {
    nombre: 'Juan Carlos López',
    documento: '789123456',
    telefono: '3201111111',
    correo: 'juan.lopez@email.com',
    salario_diario: 88000,
    especialidad: 'carpintero',
    estado: 'activo'
  },

  trabajadorAyudante: {
    nombre: 'Miguel Ángel Torres',
    documento: '321654987',
    telefono: '3222222222',
    correo: 'miguel.torres@email.com',
    salario_diario: 65000,
    especialidad: 'ayudante',
    estado: 'activo'
  },

  trabajadorSoldador: {
    nombre: 'Andrés Felipe Castro',
    documento: '654987321',
    telefono: '3183333333',
    correo: 'andres.castro@email.com',
    salario_diario: 92000,
    especialidad: 'soldador',
    estado: 'activo'
  },

  trabajadorPintor: {
    nombre: 'Diego Alejandro Ruiz',
    documento: '147258369',
    telefono: '3194444444',
    correo: 'diego.ruiz@email.com',
    salario_diario: 75000,
    especialidad: 'pintor',
    estado: 'activo'
  },

  invalidTrabajador: {
    nombre: '', // Vacío
    documento: '', // Vacío
    telefono: 'telefono_invalido', // Formato inválido
    correo: 'correo_invalido', // Formato inválido
    salario_diario: -50000, // Negativo
    especialidad: 'especialidad_invalida', // No existe
    estado: 'estado_invalido' // No existe
  },

  incompleteTrabajador: {
    nombre: 'Trabajador Incompleto',
    // Falta documento, telefono, correo, etc.
  },

  duplicateDocumentoTrabajador: {
    nombre: 'Carlos Rodríguez - Duplicado',
    documento: '123456789', // Mismo documento que validTrabajador
    telefono: '3009999999',
    correo: 'carlos.duplicado@email.com',
    salario_diario: 86000,
    especialidad: 'albañil',
    estado: 'activo'
  },

  duplicateEmailTrabajador: {
    nombre: 'Carlos Rodríguez - Email Duplicado',
    documento: '1234567890',
    telefono: '3008888888',
    correo: 'carlos.rodriguez@email.com', // Mismo correo que validTrabajador
    salario_diario: 87000,
    especialidad: 'albañil',
    estado: 'activo'
  },

  updateTrabajador: {
    nombre: 'Carlos Rodríguez - Actualizado',
    telefono: '3001234568',
    correo: 'carlos.actualizado@email.com',
    salario_diario: 90000,
    especialidad: 'albañil_principal',
    estado: 'activo'
  },

  trabajadorInactivo: {
    nombre: 'Trabajador Inactivo',
    documento: '111222333',
    telefono: '3007777777',
    correo: 'inactivo@email.com',
    salario_diario: 70000,
    especialidad: 'ayudante',
    estado: 'inactivo'
  },

  trabajadorVacaciones: {
    nombre: 'Trabajador en Vacaciones',
    documento: '444555666',
    telefono: '3006666666',
    correo: 'vacaciones@email.com',
    salario_diario: 80000,
    especialidad: 'albañil',
    estado: 'vacaciones'
  },

  trabajadorEnfermo: {
    nombre: 'Trabajador Enfermo',
    documento: '777888999',
    telefono: '3005555555',
    correo: 'enfermo@email.com',
    salario_diario: 85000,
    especialidad: 'electricista',
    estado: 'incapacidad'
  }
};

export const expectedResponses = {
  trabajadorCreated: {
    success: true,
    message: 'Trabajador creado correctamente'
  },

  trabajadorUpdated: {
    success: true,
    message: 'Trabajador actualizado correctamente'
  },

  trabajadorDeleted: {
    success: true,
    message: 'Trabajador eliminado correctamente'
  },

  validationError: (message) => ({
    success: false,
    message
  }),

  trabajadorNotFoundError: {
    success: false,
    message: 'Trabajador no encontrado'
  },

  duplicateDocumentoError: {
    success: false,
    message: 'El documento del trabajador ya está en uso'
  },

  duplicateEmailError: {
    success: false,
    message: 'El correo del trabajador ya está en uso'
  },

  invalidDocumentoError: {
    success: false,
    message: 'El documento no es válido'
  },

  invalidEmailError: {
    success: false,
    message: 'El correo electrónico no es válido'
  }
};

export const mockTrabajador = {
  id: '123e4567-e89b-12d3-a456-426614174600',
  nombre: 'Carlos Rodríguez',
  documento: '123456789',
  telefono: '3001234567',
  correo: 'carlos.rodriguez@email.com',
  salario_diario: 85000,
  especialidad: 'albañil',
  estado: 'activo',
  created_at: new Date('2024-01-01T12:00:00Z'),
  updated_at: new Date('2024-01-01T12:00:00Z')
};

export const mockTrabajadorWithRelations = {
  ...mockTrabajador,
  cuadrilla_trabajadores: [
    {
      id: '123e4567-e89b-12d3-a456-426614174700',
      cuadrilla_id: '123e4567-e89b-12d3-a456-426614174500',
      trabajador_id: '123e4567-e89b-12d3-a456-426614174600',
      rol: 'jefe_cuadrilla',
      fecha_inicio: '2024-01-01',
      estado: 'activo'
    }
  ],
  cuadrillas: [
    {
      id: '123e4567-e89b-12d3-a456-426614174500',
      nombre: 'Cuadrilla Cimentación',
      descripcion: 'Cuadrilla especializada en trabajos de cimentación',
      rendimiento_base: 1.2,
      estado: 'activo'
    }
  ]
};

export const mockTrabajadorConAsignaciones = {
  ...mockTrabajador,
  total_cuadrillas: 1,
  cuadrillas_activas: 1,
  cuadrilla_principal: {
    id: '123e4567-e89b-12d3-a456-426614174500',
    nombre: 'Cuadrilla Cimentación',
    rol: 'jefe_cuadrilla',
    fecha_asignacion: '2024-01-01'
  },
  historial_cuadrillas: [
    {
      id: '123e4567-e89b-12d3-a456-426614174701',
      cuadrilla_id: '123e4567-e89b-12d3-a456-426614174501',
      trabajador_id: '123e4567-e89b-12d3-a456-426614174600',
      rol: 'ayudante',
      fecha_inicio: '2023-06-01',
      fecha_fin: '2023-12-31',
      estado: 'finalizado'
    }
  ]
};
