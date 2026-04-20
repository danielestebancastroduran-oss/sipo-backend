export const clienteFixture = {
  validCliente: {
    nombre: 'Constructora XYZ S.A.',
    nit: '900123456-7',
    telefono: '3001234567',
    correo: 'contacto@constructoraxyz.com',
    direccion: 'Carrera 45 #78-90, Bogotá',
    departamento_id: '11',
    municipio_id: '001'
  },

  clientePersona: {
    nombre: 'Juan Carlos Rodríguez',
    nit: '801234567-8',
    telefono: '3109876543',
    correo: 'juan.rodriguez@email.com',
    direccion: 'Calle 123 #45-67, Medellín',
    departamento_id: '05',
    municipio_id: '001'
  },

  clienteCorporativo: {
    nombre: 'Inversiones ABC Ltda.',
    nit: '890987654-3',
    telefono: '3155555555',
    correo: 'informes@inversionesabc.com',
    direccion: 'Avenida El Dorado #90-45, Bogotá',
    departamento_id: '11',
    municipio_id: '001'
  },

  clienteInternacional: {
    nombre: 'Global Construction Corp',
    nit: '800123456-9',
    telefono: '3201111111',
    correo: 'colombia@globalconstruction.com',
    direccion: 'Calle 100 #50-30, Cali',
    departamento_id: '76',
    municipio_id: '001'
  },

  clienteGobierno: {
    nombre: 'Alcaldía Municipal',
    nit: '800000000-1',
    telefono: '3222222222',
    correo: 'contratacion@alcaldia.gov.co',
    direccion: 'Parque Principal #1-1, Bucaramanga',
    departamento_id: '68',
    municipio_id: '001'
  },

  invalidCliente: {
    nombre: '', // Vacío
    nit: '', // Vacío
    telefono: 'telefono_invalido', // Formato inválido
    correo: 'correo_invalido', // Formato inválido
    direccion: '', // Vacío
    departamento_id: 'depto_invalido', // No existe
    municipio_id: 'municipio_invalido' // No existe
  },

  incompleteCliente: {
    nombre: 'Cliente Incompleto',
    // Falta nit, telefono, correo, direccion, etc.
  },

  duplicateNitCliente: {
    nombre: 'Constructora XYZ S.A. - Duplicado',
    nit: '900123456-7', // Mismo NIT que validCliente
    telefono: '3009999999',
    correo: 'duplicado@constructora.com',
    direccion: 'Carrera 50 #25-30, Bogotá',
    departamento_id: '11',
    municipio_id: '001'
  },

  duplicateEmailCliente: {
    nombre: 'Constructora XYZ S.A. - Email Duplicado',
    nit: '900123456-8',
    telefono: '3008888888',
    correo: 'contacto@constructoraxyz.com', // Mismo correo que validCliente
    direccion: 'Carrera 55 #30-40, Bogotá',
    departamento_id: '11',
    municipio_id: '001'
  },

  updateCliente: {
    nombre: 'Constructora XYZ S.A. - Actualizada',
    telefono: '3001234568',
    correo: 'contacto.actualizado@constructoraxyz.com',
    direccion: 'Carrera 45 #78-91, Bogotá'
  },

  clienteInactivo: {
    nombre: 'Cliente Inactivo',
    nit: '800555555-5',
    telefono: '3007777777',
    correo: 'inactivo@email.com',
    direccion: 'Calle 200 #100-200, Pereira',
    departamento_id: '66',
    municipio_id: '001',
    estado: 'inactivo'
  }
};

export const expectedResponses = {
  clienteCreated: {
    success: true,
    message: 'Cliente creado correctamente'
  },

  clienteUpdated: {
    success: true,
    message: 'Cliente actualizado correctamente'
  },

  clienteDeleted: {
    success: true,
    message: 'Cliente eliminado correctamente'
  },

  validationError: (message) => ({
    success: false,
    message
  }),

  clienteNotFoundError: {
    success: false,
    message: 'Cliente no encontrado'
  },

  duplicateNitError: {
    success: false,
    message: 'El NIT del cliente ya está en uso'
  },

  duplicateEmailError: {
    success: false,
    message: 'El correo del cliente ya está en uso'
  },

  invalidNitError: {
    success: false,
    message: 'El NIT no es válido'
  },

  invalidEmailError: {
    success: false,
    message: 'El correo electrónico no es válido'
  }
};

export const mockCliente = {
  id: '123e4567-e89b-12d3-a456-426614174800',
  nombre: 'Constructora XYZ S.A.',
  nit: '900123456-7',
  telefono: '3001234567',
  correo: 'contacto@constructoraxyz.com',
  direccion: 'Carrera 45 #78-90, Bogotá',
  departamento_id: '11',
  municipio_id: '001',
  created_at: new Date('2024-01-01T12:00:00Z'),
  updated_at: new Date('2024-01-01T12:00:00Z')
};

export const mockClienteWithRelations = {
  ...mockCliente,
  departamentos: {
    id: '11',
    nombre: 'Bogotá D.C.',
    codigo_dane: '11'
  },
  municipios: {
    id: '001',
    nombre: 'Bogotá D.C.',
    codigo_dane: '11001'
  },
  obras: [
    {
      id: '123e4567-e89b-12d3-a456-426614174100',
      nombre: 'Edificio Residencial Torre Central',
      tipo: 'residencial',
      estado: 'activo',
      presupuesto_total: 5000000000,
      created_at: new Date('2024-01-15T12:00:00Z')
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174101',
      nombre: 'Centro Comercial Plaza Mayor',
      tipo: 'comercial',
      estado: 'activo',
      presupuesto_total: 8000000000,
      created_at: new Date('2024-03-01T12:00:00Z')
    }
  ]
};
