export const cuadrillasFixture = {
  validCuadrilla: {
    nombre: 'Cuadrilla Cimentación',
    descripcion: 'Cuadrilla especializada en trabajos de cimentación',
    usuario_id: '123e4567-e89b-12d3-a456-426614174001',
    rendimiento_base: 1.2,
    estado: 'activo'
  },

  cuadrillaEstructura: {
    nombre: 'Cuadrilla Estructura',
    descripcion: 'Cuadrilla especializada en construcción de estructura',
    usuario_id: '123e4567-e89b-12d3-a456-426614174001',
    rendimiento_base: 1.5,
    estado: 'activo'
  },

  cuadrillaAcabados: {
    nombre: 'Cuadrilla Acabados',
    descripcion: 'Cuadrilla especializada en acabados interiores',
    usuario_id: '123e4567-e89b-12d3-a456-426614174002',
    rendimiento_base: 1.0,
    estado: 'activo'
  },

  cuadrillaElectricidad: {
    nombre: 'Cuadrilla Electricidad',
    descripcion: 'Cuadrilla especializada en instalaciones eléctricas',
    usuario_id: '123e4567-e89b-12d3-a456-426614174003',
    rendimiento_base: 1.3,
    estado: 'activo'
  },

  cuadrillaHidraulica: {
    nombre: 'Cuadrilla Hidráulica',
    descripcion: 'Cuadrilla especializada en instalaciones hidráulicas',
    usuario_id: '123e4567-e89b-12d3-a456-426614174003',
    rendimiento_base: 1.1,
    estado: 'activo'
  },

  invalidCuadrilla: {
    nombre: '', // Vacío
    descripcion: '', // Vacío
    usuario_id: '', // Vacío
    rendimiento_base: -1.5, // Negativo
    estado: 'estado_invalido' // No existe
  },

  incompleteCuadrilla: {
    nombre: 'Cuadrilla Incompleta',
    // Falta usuario_id, rendimiento_base, estado
  },

  duplicateNameCuadrilla: {
    nombre: 'Cuadrilla Cimentación', // Mismo nombre que validCuadrilla
    descripcion: 'Otra cuadrilla con el mismo nombre',
    usuario_id: '123e4567-e89b-12d3-a456-426614174001',
    rendimiento_base: 1.2,
    estado: 'activo'
  },

  updateCuadrilla: {
    nombre: 'Cuadrilla Cimentación - Actualizada',
    descripcion: 'Descripción actualizada de la cuadrilla',
    rendimiento_base: 1.4,
    estado: 'suspendido'
  },

  cuadrillaInactiva: {
    nombre: 'Cuadrilla Inactiva',
    descripcion: 'Cuadrilla que no está activa',
    usuario_id: '123e4567-e89b-12d3-a456-426614174001',
    rendimiento_base: 1.0,
    estado: 'inactivo'
  },

  cuadrillaFinalizada: {
    nombre: 'Cuadrilla Finalizada',
    descripcion: 'Cuadrilla que completó su trabajo',
    usuario_id: '123e4567-e89b-12d3-a456-426614174001',
    rendimiento_base: 1.2,
    estado: 'finalizado'
  }
};

export const expectedResponses = {
  cuadrillaCreated: {
    success: true,
    message: 'Cuadrilla creada correctamente'
  },

  cuadrillaUpdated: {
    success: true,
    message: 'Cuadrilla actualizada correctamente'
  },

  cuadrillaDeleted: {
    success: true,
    message: 'Cuadrilla eliminada correctamente'
  },

  validationError: (message) => ({
    success: false,
    message
  }),

  cuadrillaNotFoundError: {
    success: false,
    message: 'Cuadrilla no encontrada'
  },

  duplicateNameError: {
    success: false,
    message: 'El nombre de la cuadrilla ya está en uso'
  },

  usuarioNotFoundError: {
    success: false,
    message: 'Usuario no encontrado'
  }
};

export const mockCuadrilla = {
  id: '123e4567-e89b-12d3-a456-426614174500',
  nombre: 'Cuadrilla Cimentación',
  descripcion: 'Cuadrilla especializada en trabajos de cimentación',
  usuario_id: '123e4567-e89b-12d3-a456-426614174001',
  rendimiento_base: 1.2,
  estado: 'activo',
  created_at: new Date('2024-01-01T12:00:00Z'),
  updated_at: new Date('2024-01-01T12:00:00Z')
};

export const mockCuadrillaWithRelations = {
  ...mockCuadrilla,
  usuarios: {
    id: '123e4567-e89b-12d3-a456-426614174001',
    nombre: 'Juan',
    apellido: 'Pérez',
    correo: 'juan.perez@email.com',
    rol: 'ingeniero'
  },
  trabajadores: [
    {
      id: '123e4567-e89b-12d3-a456-426614174600',
      nombre: 'Carlos Rodríguez',
      documento: '123456789',
      telefono: '3001234567',
      salario_diario: 85000,
      especialidad: 'albañil',
      cuadrilla_trabajadores: {
        id: '123e4567-e89b-12d3-a456-426614174700',
        cuadrilla_id: '123e4567-e89b-12d3-a456-426614174500',
        trabajador_id: '123e4567-e89b-12d3-a456-426614174600',
        rol: 'jefe_cuadrilla'
      }
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174601',
      nombre: 'Luis Martínez',
      documento: '987654321',
      telefono: '3009876543',
      salario_diario: 75000,
      especialidad: 'ayudante',
      cuadrilla_trabajadores: {
        id: '123e4567-e89b-12d3-a456-426614174701',
        cuadrilla_id: '123e4567-e89b-12d3-a456-426614174500',
        trabajador_id: '123e4567-e89b-12d3-a456-426614174601',
        rol: 'ayudante'
      }
    }
  ]
};

export const mockCuadrillaWithUsage = {
  ...mockCuadrilla,
  total_usos: 15,
  total_valor: 4500000,
  apu_detalle: [
    {
      id: '123e4567-e89b-12d3-a456-426614174300',
      cantidad: 20,
      precio_unitario: 150000,
      rendimiento: 1.2,
      partidas: {
        id: '123e4567-e89b-12d3-a456-426614174200',
        nombre: 'Cimentación',
        obra_id: '123e4567-e89b-12d3-a456-426614174100'
      },
      recursos: {
        id: '123e4567-e89b-12d3-a456-426614174400',
        nombre: 'Cemento',
        unidad: 'saco'
      }
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174301',
      cantidad: 10,
      precio_unitario: 200000,
      rendimiento: 1.5,
      partidas: {
        id: '123e4567-e89b-12d3-a456-426614174201',
        nombre: 'Estructura',
        obra_id: '123e4567-e89b-12d3-a456-426614174100'
      },
      recursos: {
        id: '123e4567-e89b-12d3-a456-426614174401',
        nombre: 'Arena',
        unidad: 'm3'
      }
    }
  ]
};
