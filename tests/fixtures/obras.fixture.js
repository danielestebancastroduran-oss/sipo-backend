export const obrasFixture = {
  validObra: {
    nombre: 'Edificio Residencial Torre Central',
    descripcion: 'Construcción de edificio de 20 pisos con 4 apartamentos por piso',
    cliente_id: '123e4567-e89b-12d3-a456-426614174000',
    usuario_id: '123e4567-e89b-12d3-a456-426614174001',
    tipo: 'residencial',
    estado: 'activo',
    direccion: 'Calle 100 #45-67',
    departamento_id: '05',
    municipio_id: '001',
    fecha_inicio: '2024-01-15',
    fecha_fin: '2025-12-31',
    presupuesto_total: 5000000000
  },

  obraComercial: {
    nombre: 'Centro Comercial Plaza Mayor',
    descripcion: 'Construcción de centro comercial con 200 locales',
    cliente_id: '123e4567-e89b-12d3-a456-426614174000',
    usuario_id: '123e4567-e89b-12d3-a456-426614174002',
    tipo: 'comercial',
    estado: 'activo',
    direccion: 'Avenida Principal #123-45',
    departamento_id: '11',
    municipio_id: '001',
    fecha_inicio: '2024-03-01',
    fecha_fin: '2026-06-30',
    presupuesto_total: 8000000000
  },

  obraIndustrial: {
    nombre: 'Planta de Procesamiento Industrial',
    descripcion: 'Construcción de planta para procesamiento de alimentos',
    cliente_id: '123e4567-e89b-12d3-a456-426614174000',
    usuario_id: '123e4567-e89b-12d3-a456-426614174003',
    tipo: 'industrial',
    estado: 'activo',
    direccion: 'Zona Industrial Km 5',
    departamento_id: '76',
    municipio_id: '073',
    fecha_inicio: '2024-02-01',
    fecha_fin: '2025-08-31',
    presupuesto_total: 12000000000
  },

  invalidObra: {
    nombre: '', // Vacío
    descripcion: '', // Vacío
    cliente_id: '', // Vacío
    usuario_id: '', // Vacío
    tipo: 'tipo_invalido', // No existe
    estado: 'estado_invalido', // No existe
    direccion: '', // Vacío
    departamento_id: '', // Vacío
    municipio_id: '', // Vacío
    fecha_inicio: '2024-13-45', // Fecha inválida
    fecha_fin: '2024-01-01', // Anterior a inicio
    presupuesto_total: -1000 // Negativo
  },

  incompleteObra: {
    nombre: 'Obra Incompleta',
    // Falta cliente_id, usuario_id, tipo, estado, etc.
  },

  duplicateNameObra: {
    nombre: 'Edificio Residencial Torre Central', // Mismo nombre que validObra
    descripcion: 'Otra obra con el mismo nombre',
    cliente_id: '123e4567-e89b-12d3-a456-426614174000',
    usuario_id: '123e4567-e89b-12d3-a456-426614174001',
    tipo: 'residencial',
    estado: 'activo',
    direccion: 'Calle 200 #89-12',
    departamento_id: '05',
    municipio_id: '001',
    fecha_inicio: '2024-05-01',
    fecha_fin: '2025-10-31',
    presupuesto_total: 3000000000
  },

  updateObra: {
    nombre: 'Edificio Residencial Torre Central - Actualizado',
    descripcion: 'Descripción actualizada del edificio',
    estado: 'suspendido',
    presupuesto_total: 5500000000
  },

  obraFinalizada: {
    nombre: 'Proyecto Finalizado',
    descripcion: 'Obra que ya está completada',
    cliente_id: '123e4567-e89b-12d3-a456-426614174000',
    usuario_id: '123e4567-e89b-12d3-a456-426614174001',
    tipo: 'residencial',
    estado: 'finalizado',
    direccion: 'Calle 300 #123-45',
    departamento_id: '05',
    municipio_id: '001',
    fecha_inicio: '2023-01-01',
    fecha_fin: '2024-01-01',
    presupuesto_total: 2000000000
  }
};

export const expectedResponses = {
  obraCreated: {
    success: true,
    message: 'Obra creada correctamente'
  },

  obraUpdated: {
    success: true,
    message: 'Obra actualizada correctamente'
  },

  obraDeleted: {
    success: true,
    message: 'Obra eliminada correctamente'
  },

  validationError: (message) => ({
    success: false,
    message
  }),

  obraNotFoundError: {
    success: false,
    message: 'Obra no encontrada'
  },

  duplicateNameError: {
    success: false,
    message: 'El nombre de la obra ya está en uso'
  },

  invalidDateError: {
    success: false,
    message: 'La fecha de fin debe ser posterior a la fecha de inicio'
  }
};

export const mockObra = {
  id: '123e4567-e89b-12d3-a456-426614174100',
  nombre: 'Edificio Residencial Torre Central',
  descripcion: 'Construcción de edificio de 20 pisos con 4 apartamentos por piso',
  cliente_id: '123e4567-e89b-12d3-a456-426614174000',
  usuario_id: '123e4567-e89b-12d3-a456-426614174001',
  tipo: 'residencial',
  estado: 'activo',
  direccion: 'Calle 100 #45-67',
  departamento_id: '05',
  municipio_id: '001',
  fecha_inicio: '2024-01-15',
  fecha_fin: '2025-12-31',
  presupuesto_total: 5000000000,
  created_at: new Date('2024-01-01T12:00:00Z'),
  updated_at: new Date('2024-01-01T12:00:00Z')
};

export const mockObraWithRelations = {
  ...mockObra,
  cliente: {
    id: '123e4567-e89b-12d3-a456-426614174000',
    nombre: 'Constructora XYZ',
    nit: '900123456-7',
    telefono: '3001234567',
    correo: 'contacto@constructora.com'
  },
  usuarios: {
    id: '123e4567-e89b-12d3-a456-426614174001',
    nombre: 'Juan',
    apellido: 'Pérez',
    correo: 'juan.perez@email.com',
    rol: 'ingeniero'
  },
  departamentos: {
    id: '05',
    nombre: 'Antioquia',
    codigo_dane: '05'
  },
  municipios: {
    id: '001',
    nombre: 'Medellín',
    codigo_dane: '05001'
  },
  partidas: [
    {
      id: '123e4567-e89b-12d3-a456-426614174200',
      nombre: 'Cimentación',
      descripcion: 'Construcción de cimentación',
      unidad: 'm3',
      cantidad: 500,
      created_at: new Date('2024-01-15T12:00:00Z')
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174201',
      nombre: 'Estructura',
      descripcion: 'Construcción de estructura',
      unidad: 'm2',
      cantidad: 2000,
      created_at: new Date('2024-01-20T12:00:00Z')
    }
  ]
};
