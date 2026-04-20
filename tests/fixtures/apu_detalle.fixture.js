export const apuDetalleFixture = {
  validDetalle: {
    partida_id: '123e4567-e89b-12d3-a456-426614174200',
    recurso_id: '123e4567-e89b-12d3-a456-426614174400',
    cuadrilla_id: '123e4567-e89b-12d3-a456-426614174500',
    cantidad: 500,
    precio_unitario: 45000,
    rendimiento: 1.2,
    estado: 'activo'
  },

  detalleEstructura: {
    partida_id: '123e4567-e89b-12d3-a456-426614174201',
    recurso_id: '123e4567-e89b-12d3-a456-426614174401',
    cuadrilla_id: '123e4567-e89b-12d3-a456-426614174501',
    cantidad: 1000,
    precio_unitario: 35000,
    rendimiento: 1.5,
    estado: 'activo'
  },

  detalleAcabados: {
    partida_id: '123e4567-e89b-12d3-a456-426614174202',
    recurso_id: '123e4567-e89b-12d3-a456-426614174402',
    cuadrilla_id: '123e4567-e89b-12d3-a456-426614174502',
    cantidad: 1500,
    precio_unitario: 120000,
    rendimiento: 1.0,
    estado: 'activo'
  },

  detalleElectricidad: {
    partida_id: '123e4567-e89b-12d3-a456-426614174203',
    recurso_id: '123e4567-e89b-12d3-a456-426614174403',
    cuadrilla_id: '123e4567-e89b-12d3-a456-426614174503',
    cantidad: 2000,
    precio_unitario: 85000,
    rendimiento: 1.3,
    estado: 'activo'
  },

  detalleHidraulica: {
    partida_id: '123e4567-e89b-12d3-a456-426614174204',
    recurso_id: '123e4567-e89b-12d3-a456-426614174404',
    cuadrilla_id: '123e4567-e89b-12d3-a456-426614174504',
    cantidad: 800,
    precio_unitario: 65000,
    rendimiento: 1.1,
    estado: 'activo'
  },

  detalleEquipo: {
    partida_id: '123e4567-e89b-12d3-a456-426614174200',
    recurso_id: '123e4567-e89b-12d3-a456-426614174405',
    cuadrilla_id: '123e4567-e89b-12d3-a456-426614174500',
    cantidad: 100,
    precio_unitario: 250000,
    rendimiento: 0.8,
    estado: 'activo'
  },

  detalleManoObra: {
    partida_id: '123e4567-e89b-12d3-a456-426614174200',
    recurso_id: '123e4567-e89b-12d3-a456-426614174406',
    cuadrilla_id: '123e4567-e89b-12d3-a456-426614174500',
    cantidad: 50,
    precio_unitario: 85000,
    rendimiento: 1.0,
    estado: 'activo'
  },

  invalidDetalle: {
    partida_id: '', // Vacío
    recurso_id: '', // Vacío
    cuadrilla_id: '', // Vacío
    cantidad: -100, // Negativo
    precio_unitario: -50000, // Negativo
    rendimiento: -1.5, // Negativo
    estado: 'estado_invalido' // No existe
  },

  incompleteDetalle: {
    partida_id: '123e4567-e89b-12d3-a456-426614174200',
    // Falta recurso_id, cuadrilla_id, cantidad, etc.
  },

  duplicateDetalle: {
    partida_id: '123e4567-e89b-12d3-a456-426614174200',
    recurso_id: '123e4567-e89b-12d3-a456-426614174400',
    cuadrilla_id: '123e4567-e89b-12d3-a456-426614174500',
    cantidad: 600, // Diferente cantidad
    precio_unitario: 45000,
    rendimiento: 1.2,
    estado: 'activo'
  },

  updateDetalle: {
    cantidad: 600,
    precio_unitario: 48000,
    rendimiento: 1.4,
    estado: 'suspendido'
  },

  detalleInactivo: {
    partida_id: '123e4567-e89b-12d3-a456-426614174205',
    recurso_id: '123e4567-e89b-12d3-a456-426614174407',
    cuadrilla_id: '123e4567-e89b-12d3-a456-426614174505',
    cantidad: 300,
    precio_unitario: 55000,
    rendimiento: 1.2,
    estado: 'inactivo'
  },

  detalleFinalizado: {
    partida_id: '123e4567-e89b-12d3-a456-426614174206',
    recurso_id: '123e4567-e89b-12d3-a456-426614174408',
    cuadrilla_id: '123e4567-e89b-12d3-a456-426614174506',
    cantidad: 400,
    precio_unitario: 60000,
    rendimiento: 1.3,
    estado: 'finalizado'
  }
};

export const expectedResponses = {
  detalleCreated: {
    success: true,
    message: 'Detalle APU creado correctamente'
  },

  detalleUpdated: {
    success: true,
    message: 'Detalle APU actualizado correctamente'
  },

  detalleDeleted: {
    success: true,
    message: 'Detalle APU eliminado correctamente'
  },

  validationError: (message) => ({
    success: false,
    message
  }),

  detalleNotFoundError: {
    success: false,
    message: 'Detalle APU no encontrado'
  },

  partidaNotFoundError: {
    success: false,
    message: 'Partida no encontrada'
  },

  recursoNotFoundError: {
    success: false,
    message: 'Recurso no encontrado'
  },

  cuadrillaNotFoundError: {
    success: false,
    message: 'Cuadrilla no encontrada'
  },

  duplicateError: {
    success: false,
    message: 'Ya existe un detalle APU con esta combinación de partida, recurso y cuadrilla'
  }
};

export const mockApuDetalle = {
  id: '123e4567-e89b-12d3-a456-426614174300',
  partida_id: '123e4567-e89b-12d3-a456-426614174200',
  recurso_id: '123e4567-e89b-12d3-a456-426614174400',
  cuadrilla_id: '123e4567-e89b-12d3-a456-426614174500',
  cantidad: 500,
  precio_unitario: 45000,
  rendimiento: 1.2,
  estado: 'activo',
  created_at: new Date('2024-01-15T12:00:00Z'),
  updated_at: new Date('2024-01-15T12:00:00Z')
};

export const mockApuDetalleWithRelations = {
  ...mockApuDetalle,
  partidas: {
    id: '123e4567-e89b-12d3-a456-426614174200',
    nombre: 'Cimentación',
    descripcion: 'Construcción de cimentación en concreto reforzado',
    unidad: 'm3',
    cantidad: 500,
    obra_id: '123e4567-e89b-12d3-a456-426614174100'
  },
  recursos: {
    id: '123e4567-e89b-12d3-a456-426614174400',
    nombre: 'Cemento Portland',
    unidad: 'saco',
    tipo: 'material',
    precio_unitario: 45000
  },
  cuadrillas: {
    id: '123e4567-e89b-12d3-a456-426614174500',
    nombre: 'Cuadrilla Cimentación',
    descripcion: 'Cuadrilla especializada en trabajos de cimentación',
    rendimiento_base: 1.2,
    estado: 'activo'
  }
};

export const mockApuDetalleCalculado = {
  ...mockApuDetalleWithRelations,
  valor_total: 22500000, // cantidad * precio_unitario
  rendimiento_real: 1.2,
  costo_unitario_real: 45000,
  desperdicio: 0.2 // 20% de desperdicio
};
