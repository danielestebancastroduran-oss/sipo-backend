const { ClienteController } = require('../../src/controllers/cliente.controller.js');
const { ClienteService } = require('../../src/services/cliente.service.js');

// Mock del ClienteService completo
jest.mock('../../src/services/cliente.service.js');

describe('ClienteController', () => {
  let clienteController;
  let mockReq;
  let mockRes;
  let mockClienteService;

  beforeEach(() => {
    // Restaurar todos los mocks
    jest.restoreAllMocks();
    
    // Crear mocks limpios para cada test
    mockClienteService = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    };

    // Mock del constructor para que devuelva nuestro mock
    ClienteService.mockImplementation(() => mockClienteService);
    
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
    clienteController = new ClienteController();
  });

  describe('getAll', () => {
    it('debe obtener todos los clientes exitosamente', async () => {
      // Arrange
      const mockClientes = [
        { id: '1', nombre: 'Cliente 1', nit: '123456789' },
        { id: '2', nombre: 'Cliente 2', nit: '987654321' }
      ];
      mockClienteService.getAll.mockResolvedValue(mockClientes);

      // Act
      await clienteController.getAll(mockReq, mockRes);

      // Assert
      expect(mockClienteService.getAll).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockClientes,
        message: 'Clientes obtenidos correctamente'
      });
    });

    it('debe manejar errores al obtener clientes', async () => {
      // Arrange
      const errorMessage = 'Error al obtener clientes';
      mockClienteService.getAll.mockRejectedValue(new Error(errorMessage));

      // Act
      await clienteController.getAll(mockReq, mockRes);

      // Assert
      expect(mockClienteService.getAll).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });

  describe('getById', () => {
    it('debe obtener un cliente por ID exitosamente', async () => {
      // Arrange
      const mockCliente = { id: '1', nombre: 'Cliente 1', nit: '123456789' };
      mockReq.params = { id: '1' };
      mockClienteService.getById.mockResolvedValue(mockCliente);

      // Act
      await clienteController.getById(mockReq, mockRes);

      // Assert
      expect(mockClienteService.getById).toHaveBeenCalledWith('1');
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockCliente,
        message: 'Cliente obtenido correctamente'
      });
    });

    it('debe retornar 404 si el cliente no existe', async () => {
      // Arrange
      mockReq.params = { id: '1' };
      mockClienteService.getById.mockResolvedValue(null);

      // Act
      await clienteController.getById(mockReq, mockRes);

      // Assert
      expect(mockClienteService.getById).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Cliente no encontrado'
      });
    });

    it('debe manejar errores al obtener cliente por ID', async () => {
      // Arrange
      const errorMessage = 'Error al obtener cliente';
      mockReq.params = { id: '1' };
      mockClienteService.getById.mockRejectedValue(new Error(errorMessage));

      // Act
      await clienteController.getById(mockReq, mockRes);

      // Assert
      expect(mockClienteService.getById).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });

  describe('create', () => {
    const validClienteData = {
      nombre: 'Nuevo Cliente',
      nit: '123456789',
      telefono: '3001234567',
      correo: 'cliente@email.com',
      direccion: 'Calle 123 #45-67'
    };

    it('debe crear un cliente exitosamente', async () => {
      // Arrange
      const mockCliente = { id: '1', ...validClienteData };
      mockReq.body = validClienteData;
      mockClienteService.create.mockResolvedValue(mockCliente);

      // Act
      await clienteController.create(mockReq, mockRes);

      // Assert
      expect(mockClienteService.create).toHaveBeenCalledWith(validClienteData);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockCliente,
        message: 'Cliente creado correctamente'
      });
    });

    it('debe manejar errores al crear cliente', async () => {
      // Arrange
      const errorMessage = 'Error al crear cliente';
      mockReq.body = validClienteData;
      mockClienteService.create.mockRejectedValue(new Error(errorMessage));

      // Act
      await clienteController.create(mockReq, mockRes);

      // Assert
      expect(mockClienteService.create).toHaveBeenCalledWith(validClienteData);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });

  describe('update', () => {
    const updateData = {
      nombre: 'Cliente Actualizado',
      telefono: '3009876543'
    };

    it('debe actualizar un cliente exitosamente', async () => {
      // Arrange
      const mockCliente = { id: '1', ...updateData };
      mockReq.params = { id: '1' };
      mockReq.body = updateData;
      mockClienteService.update.mockResolvedValue(mockCliente);

      // Act
      await clienteController.update(mockReq, mockRes);

      // Assert
      expect(mockClienteService.update).toHaveBeenCalledWith('1', updateData);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockCliente,
        message: 'Cliente actualizado correctamente'
      });
    });

    it('debe retornar 404 si el cliente a actualizar no existe', async () => {
      // Arrange
      mockReq.params = { id: '1' };
      mockReq.body = updateData;
      mockClienteService.update.mockResolvedValue(null);

      // Act
      await clienteController.update(mockReq, mockRes);

      // Assert
      expect(mockClienteService.update).toHaveBeenCalledWith('1', updateData);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Cliente no encontrado'
      });
    });

    it('debe manejar errores al actualizar cliente', async () => {
      // Arrange
      const errorMessage = 'Error al actualizar cliente';
      mockReq.params = { id: '1' };
      mockReq.body = updateData;
      mockClienteService.update.mockRejectedValue(new Error(errorMessage));

      // Act
      await clienteController.update(mockReq, mockRes);

      // Assert
      expect(mockClienteService.update).toHaveBeenCalledWith('1', updateData);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });

  describe('delete', () => {
    it('debe eliminar un cliente exitosamente', async () => {
      // Arrange
      mockReq.params = { id: '1' };
      mockClienteService.delete.mockResolvedValue(true);

      // Act
      await clienteController.delete(mockReq, mockRes);

      // Assert
      expect(mockClienteService.delete).toHaveBeenCalledWith('1');
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Cliente eliminado correctamente'
      });
    });

    it('debe retornar 404 si el cliente a eliminar no existe', async () => {
      // Arrange
      mockReq.params = { id: '1' };
      mockClienteService.delete.mockResolvedValue(false);

      // Act
      await clienteController.delete(mockReq, mockRes);

      // Assert
      expect(mockClienteService.delete).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Cliente no encontrado'
      });
    });

    it('debe manejar errores al eliminar cliente', async () => {
      // Arrange
      const errorMessage = 'Error al eliminar cliente';
      mockReq.params = { id: '1' };
      mockClienteService.delete.mockRejectedValue(new Error(errorMessage));

      // Act
      await clienteController.delete(mockReq, mockRes);

      // Assert
      expect(mockClienteService.delete).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });
});
