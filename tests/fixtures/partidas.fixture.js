export const partidasFixture = {
  validPartida: {
    nombre: 'Cimentación',
    descripcion: 'Construcción de cimentación en concreto reforzado',
    obra_id: '123e4567-e89b-12d3-a456-426614174100',
    unidad: 'm3',
    cantidad: 500,
    precio_unitario: 350000,
    estado: 'activo'
  },

  partidaEstructura: {
    nombre: 'Estructura de Concreto',
    descripcion: 'Construcción de columnas y vigas en concreto',
    obra_id: '123e4567-e89b-12d3-a456-426614174100',
    unidad: 'm2',
    cantidad: 2000,
    precio_unitario: 450000,
    estado: 'activo'
  },

  partidaAcabados: {
    nombre: 'Acabados Interiores',
    descripcion: 'Instalación de pisos y pintura',
    obra_id: '123e4567-e89b-12d3-a456-426614174100',
    unidad: 'm2',
    cantidad: 1500,
    precio_unitario: 120000,
    estado: 'activo'
  },

  partidaElectrica: {
    nombre: 'Instalación Eléctrica',
    descripcion: 'Instalación completa de sistema eléctrico',
    obra_id: '123e4567-e89b-12d3-a456-426614174100',
    unidad: 'global',
    cantidad: 1,
    precio_unitario: 250000000,
    estado: 'activo'
  },

  partidaHidraulica: {
    nombre: 'Instalación Hidráulica',
    descripcion: 'Instalación completa de sistema hidráulico',
    obra_id: '123e4567-e89b-12d3-a456-426614174100',
    unidad: 'global',
    cantidad: 1,
    precio_unitario: 180000000,
    estado: 'activo'
  },

  invalidPartida: {
    nombre: '', // Vacío
    descripcion: '', // Vacío
    obra_id: '', // Vacío
    unidad: 'unidad_invalida', // No existe
    cantidad: -100, // Negativo
    precio_unitario: -50000, // Negativo
    estado: 'estado_invalido' // No existe
  },

  incompletePartida: {
    nombre: 'Partida Incompleta',
    // Falta obra_id, unidad, cantidad, etc.
  },

  duplicateNamePartida: {
    nombre: 'Cimentación', // Mismo nombre que validPartida
    descripcion: 'Otra cimentación con el mismo nombre',
    obra_id: '123e4567-e89b-12d3-a456-426614174100',
    unidad: 'm3',
    cantidad: 300,
    precio_unitario: 350000,
    estado: 'activo'
  },

  updatePartida: {
    nombre: 'Cimentación - Actualizada',
    descripcion: 'Descripción actualizada de la cimentación',
    cantidad: 600,
    precio_unitario: 380000,
    estado: 'suspendido'
  },

  partidaFinalizada: {
    nombre: 'Partida Finalizada',
    descripcion: 'Partida que ya está completada',
    obra_id: '123e4567-e89b-12d3-a456-426614174100',
    unidad: 'm2',
    cantidad: 1000,
    precio_unitario: 200000,
    estado: 'finalizado'
  },

  partidaCancelada: {
    nombre: 'Partida Cancelada',
    descripcion: 'Partida que fue cancelada',
    obra_id: '123e4567-e89b-12d3-a456-426614174100',
    unidad: 'm2',
    cantidad: 500,
    precio_unitario: 150000,
    estado: 'cancelado'
  }
};

export const expectedResponses = {
  partidaCreated: {
    success: true,
    message: 'Partida creada correctamente'
  },

  partidaUpdated: {
    success: true,
    message: 'Partida actualizada correctamente'
  },

  partidaDeleted: {
    success: true,
    message: 'Partida eliminada correctamente'
  },

  validationError: (message) => ({
    success: false,
    message
  }),

  partidaNotFoundError: {
    success: false,
    message: 'Partida no encontrada'
  },

  duplicateNameError: {
    success: false,
    message: 'El nombre de la partida ya está en uso para esta obra'
  },

  obraNotFoundError: {
    success: false,
    message: 'Obra no encontrada'
  }
};

export const mockPartida = {
  id: '123e4567-e89b-12d3-a456-426614174200',
  nombre: 'Cimentación',
  descripcion: 'Construcción de cimentación en concreto reforzado',
  obra_id: '123e4567-e89b-12d3-a456-426614174100',
  unidad: 'm3',
  cantidad: 500,
  precio_unitario: 350000,
  estado: 'activo',
  created_at: new Date('2024-01-15T12:00:00Z'),
  updated_at: new Date('2024-01-15T12:00:00Z')
};

export const mockPartidaWithRelations = {
  ...mockPartida,
  obra: {
    id: '123e4567-e89b-12d3-a456-426614174100',
    nombre: 'Edificio Residencial Torre Central',
    tipo: 'residencial',
    estado: 'activo'
  },
  apu_detalles: [
    {
      id: '123e4567-e89b-12d3-a456-426614174300',
      cantidad: 500,
      precio_unitario: 350000,
      rendimiento: 1.2,
      recursos: {
        id: '123e4567-e89b-12d3-a456-426614174400',
        nombre: 'Cemento',
        unidad: 'saco',
        tipo: 'material'
      },
      cuadrillas: {
        id: '123e4567-e89b-12d3-a456-426614174500',
        nombre: 'Cuadrilla Cimentación'
      }
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174301',
      cantidad: 1000,
      precio_unitario: 50000,
      rendimiento: 1.5,
      recursos: {
        id: '123e4567-e89b-12d3-a456-426614174401',
        nombre: 'Arena',
        unidad: 'm3',
        tipo: 'material'
      },
      cuadrillas: {
        id: '123e4567-e89b-12d3-a456-426614174500',
        nombre: 'Cuadrilla Cimentación'
      }
    }
  ]
};
