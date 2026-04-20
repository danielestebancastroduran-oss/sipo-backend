export const recursosFixture = {
  validMaterial: {
    nombre: 'Cemento Portland',
    unidad: 'saco',
    tipo: 'material',
    precio_unitario: 45000,
    usuario_id: '123e4567-e89b-12d3-a456-426614174001'
  },

  validEquipo: {
    nombre: 'Excavadora CAT 320',
    unidad: 'hora',
    tipo: 'equipo',
    precio_unitario: 250000,
    usuario_id: '123e4567-e89b-12d3-a456-426614174001'
  },

  validManoObra: {
    nombre: 'Albañil Oficial',
    unidad: 'jornal',
    tipo: 'mano_obra',
    precio_unitario: 85000,
    usuario_id: '123e4567-e89b-12d3-a456-426614174001'
  },

  validTransporte: {
    nombre: 'Camión Volteo',
    unidad: 'viaje',
    tipo: 'transporte',
    precio_unitario: 180000,
    usuario_id: '123e4567-e89b-12d3-a456-426614174001'
  },

  validServicio: {
    nombre: 'Arrendamiento de Andamios',
    unidad: 'mes',
    tipo: 'servicio',
    precio_unitario: 500000,
    usuario_id: '123e4567-e89b-12d3-a456-426614174001'
  },

  arenaMaterial: {
    nombre: 'Arena Gruesa',
    unidad: 'm3',
    tipo: 'material',
    precio_unitario: 35000,
    usuario_id: '123e4567-e89b-12d3-a456-426614174001'
  },

  gravaMaterial: {
    nombre: 'Grava 3/4"',
    unidad: 'm3',
    tipo: 'material',
    precio_unitario: 42000,
    usuario_id: '123e4567-e89b-12d3-a456-426614174001'
  },

  aceroMaterial: {
    nombre: 'Acero de Refuerzo',
    unidad: 'kg',
    tipo: 'material',
    precio_unitario: 6500,
    usuario_id: '123e4567-e89b-12d3-a456-426614174001'
  },

  invalidRecurso: {
    nombre: '', // Vacío
    unidad: 'unidad_invalida', // No existe
    tipo: 'tipo_invalido', // No existe
    precio_unitario: -1000, // Negativo
    usuario_id: '' // Vacío
  },

  incompleteRecurso: {
    nombre: 'Recurso Incompleto',
    // Falta unidad, tipo, precio_unitario, usuario_id
  },

  duplicateNameRecurso: {
    nombre: 'Cemento Portland', // Mismo nombre que validMaterial
    unidad: 'saco',
    tipo: 'material',
    precio_unitario: 46000,
    usuario_id: '123e4567-e89b-12d3-a456-426614174001'
  },

  updateRecurso: {
    nombre: 'Cemento Portland - Actualizado',
    unidad: 'saco',
    tipo: 'material',
    precio_unitario: 48000
  },

  recursoInactivo: {
    nombre: 'Recurso Inactivo',
    unidad: 'unidad',
    tipo: 'material',
    precio_unitario: 10000,
    usuario_id: '123e4567-e89b-12d3-a456-426614174001',
    estado: 'inactivo'
  }
};

export const expectedResponses = {
  recursoCreated: {
    success: true,
    message: 'Recurso creado correctamente'
  },

  recursoUpdated: {
    success: true,
    message: 'Recurso actualizado correctamente'
  },

  recursoDeleted: {
    success: true,
    message: 'Recurso eliminado correctamente'
  },

  validationError: (message) => ({
    success: false,
    message
  }),

  recursoNotFoundError: {
    success: false,
    message: 'Recurso no encontrado'
  },

  duplicateNameError: {
    success: false,
    message: 'El nombre del recurso ya está en uso'
  },

  usuarioNotFoundError: {
    success: false,
    message: 'Usuario no encontrado'
  }
};

export const mockRecurso = {
  id: '123e4567-e89b-12d3-a456-426614174400',
  nombre: 'Cemento Portland',
  unidad: 'saco',
  tipo: 'material',
  precio_unitario: 45000,
  usuario_id: '123e4567-e89b-12d3-a456-426614174001',
  created_at: new Date('2024-01-01T12:00:00Z'),
  updated_at: new Date('2024-01-01T12:00:00Z')
};

export const mockRecursoWithUsage = {
  ...mockRecurso,
  total_usos: 25,
  total_cantidad: 500,
  total_valor: 22500000,
  apu_detalles: [
    {
      id: '123e4567-e89b-12d3-a456-426614174300',
      cantidad: 20,
      precio_unitario: 45000,
      rendimiento: 1.2,
      partidas: {
        id: '123e4567-e89b-12d3-a456-426614174200',
        nombre: 'Cimentación',
        obra_id: '123e4567-e89b-12d3-a456-426614174100'
      },
      cuadrillas: {
        id: '123e4567-e89b-12d3-a456-426614174500',
        nombre: 'Cuadrilla Cimentación'
      }
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174301',
      cantidad: 15,
      precio_unitario: 45000,
      rendimiento: 1.5,
      partidas: {
        id: '123e4567-e89b-12d3-a456-426614174201',
        nombre: 'Estructura',
        obra_id: '123e4567-e89b-12d3-a456-426614174100'
      },
      cuadrillas: {
        id: '123e4567-e89b-12d3-a456-426614174501',
        nombre: 'Cuadrilla Estructura'
      }
    }
  ]
};
