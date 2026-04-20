const { ObrasController } = require('../../src/controllers/obras.controller.js');
const { ObrasService } = require('../../src/services/obras.service.js');

// Mock del ObrasService completo
jest.mock('../../src/services/obras.service.js');

describe('ObrasController', () => {
  let obrasController;
  let mockReq;
  let mockRes;
  let mockObrasService;

  beforeEach(() => {
    // Restaurar todos los mocks
    jest.restoreAllMocks();
    
    // Crear mocks limpios para cada test
    mockObrasService = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getByEstado: jest.fn(),
      getByCliente: jest.fn(),
      getByTipo: jest.fn(),
      getWithPartidas: jest.fn()
    };

    // Mock del constructor para que devuelva nuestro mock
    ObrasService.mockImplementation(() => mockObrasService);
    
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
    obrasController = new ObrasController();
  });

  describe('getAll', () => {
    it('debe obtener todas las obras exitosamente', async () => {
      // Arrange
      const mockObras = [
        { id: '1', nombre: 'Obra 1', estado: 'activo' },
        { id: '2', nombre: 'Obra 2', estado: 'activo' }
      ];
      mockObrasService.getAll.mockResolvedValue(mockObras);

      // Act
      await obrasController.getAll(mockReq, mockRes);

      // Assert
      expect(mockObrasService.getAll).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockObras,
        message: 'Obras obtenidas correctamente'
      });
    });

    it('debe manejar errores al obtener obras', async () => {
      // Arrange
      const errorMessage = 'Error al obtener obras';
      mockObrasService.getAll.mockRejectedValue(new Error(errorMessage));

      // Act
      await obrasController.getAll(mockReq, mockRes);

      // Assert
      expect(mockObrasService.getAll).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });

  describe('getById', () => {
    it('debe obtener una obra por ID exitosamente', async () => {
      // Arrange
      const mockObra = { id: '1', nombre: 'Obra 1', estado: 'activo' };
      mockReq.params = { id: '1' };
      mockObrasService.getById.mockResolvedValue(mockObra);

      // Act
      await obrasController.getById(mockReq, mockRes);

      // Assert
      expect(mockObrasService.getById).toHaveBeenCalledWith('1');
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockObra,
        message: 'Obra obtenida correctamente'
      });
    });

    it('debe retornar 404 si la obra no existe', async () => {
      // Arrange
      mockReq.params = { id: '1' };
      mockObrasService.getById.mockResolvedValue(null);

      // Act
      await obrasController.getById(mockReq, mockRes);

      // Assert
      expect(mockObrasService.getById).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Obra no encontrada'
      });
    });

    it('debe manejar errores al obtener obra por ID', async () => {
      // Arrange
      const errorMessage = 'Error al obtener obra';
      mockReq.params = { id: '1' };
      mockObrasService.getById.mockRejectedValue(new Error(errorMessage));

      // Act
      await obrasController.getById(mockReq, mockRes);

      // Assert
      expect(mockObrasService.getById).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });

  describe('create', () => {
    const validObraData = {
      nombre: 'Nueva Obra',
      descripcion: 'Descripción de la obra',
      cliente_id: '1',
      usuario_id: '1',
      estado: 'activo'
    };

    it('debe crear una obra exitosamente', async () => {
      // Arrange
      const mockObra = { id: '1', ...validObraData };
      mockReq.body = validObraData;
      mockObrasService.create.mockResolvedValue(mockObra);

      // Act
      await obrasController.create(mockReq, mockRes);

      // Assert
      expect(mockObrasService.create).toHaveBeenCalledWith(validObraData);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockObra,
        message: 'Obra creada correctamente'
      });
    });

    it('debe manejar errores al crear obra', async () => {
      // Arrange
      const errorMessage = 'Error al crear obra';
      mockReq.body = validObraData;
      mockObrasService.create.mockRejectedValue(new Error(errorMessage));

      // Act
      await obrasController.create(mockReq, mockRes);

      // Assert
      expect(mockObrasService.create).toHaveBeenCalledWith(validObraData);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });

  describe('update', () => {
    const updateData = {
      nombre: 'Obra Actualizada',
      descripcion: 'Descripción actualizada'
    };

    it('debe actualizar una obra exitosamente', async () => {
      // Arrange
      const mockObra = { id: '1', ...updateData };
      mockReq.params = { id: '1' };
      mockReq.body = updateData;
      mockObrasService.update.mockResolvedValue(mockObra);

      // Act
      await obrasController.update(mockReq, mockRes);

      // Assert
      expect(mockObrasService.update).toHaveBeenCalledWith('1', updateData);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockObra,
        message: 'Obra actualizada correctamente'
      });
    });

    it('debe retornar 404 si la obra a actualizar no existe', async () => {
      // Arrange
      mockReq.params = { id: '1' };
      mockReq.body = updateData;
      mockObrasService.update.mockResolvedValue(null);

      // Act
      await obrasController.update(mockReq, mockRes);

      // Assert
      expect(mockObrasService.update).toHaveBeenCalledWith('1', updateData);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Obra no encontrada'
      });
    });

    it('debe manejar errores al actualizar obra', async () => {
      // Arrange
      const errorMessage = 'Error al actualizar obra';
      mockReq.params = { id: '1' };
      mockReq.body = updateData;
      mockObrasService.update.mockRejectedValue(new Error(errorMessage));

      // Act
      await obrasController.update(mockReq, mockRes);

      // Assert
      expect(mockObrasService.update).toHaveBeenCalledWith('1', updateData);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });

  describe('delete', () => {
    it('debe eliminar una obra exitosamente', async () => {
      // Arrange
      mockReq.params = { id: '1' };
      mockObrasService.delete.mockResolvedValue(true);

      // Act
      await obrasController.delete(mockReq, mockRes);

      // Assert
      expect(mockObrasService.delete).toHaveBeenCalledWith('1');
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Obra eliminada correctamente'
      });
    });

    it('debe retornar 404 si la obra a eliminar no existe', async () => {
      // Arrange
      mockReq.params = { id: '1' };
      mockObrasService.delete.mockResolvedValue(false);

      // Act
      await obrasController.delete(mockReq, mockRes);

      // Assert
      expect(mockObrasService.delete).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Obra no encontrada'
      });
    });

    it('debe manejar errores al eliminar obra', async () => {
      // Arrange
      const errorMessage = 'Error al eliminar obra';
      mockReq.params = { id: '1' };
      mockObrasService.delete.mockRejectedValue(new Error(errorMessage));

      // Act
      await obrasController.delete(mockReq, mockRes);

      // Assert
      expect(mockObrasService.delete).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });

  describe('getByEstado', () => {
    it('debe obtener obras por estado exitosamente', async () => {
      // Arrange
      const mockObras = [
        { id: '1', nombre: 'Obra 1', estado: 'activo' },
        { id: '2', nombre: 'Obra 2', estado: 'activo' }
      ];
      mockReq.params = { estado: 'activo' };
      mockObrasService.getByEstado.mockResolvedValue(mockObras);

      // Act
      await obrasController.getByEstado(mockReq, mockRes);

      // Assert
      expect(mockObrasService.getByEstado).toHaveBeenCalledWith('activo');
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockObras,
        message: 'Obras por estado obtenidas correctamente'
      });
    });

    it('debe manejar errores al obtener obras por estado', async () => {
      // Arrange
      const errorMessage = 'Error al obtener obras por estado';
      mockReq.params = { estado: 'activo' };
      mockObrasService.getByEstado.mockRejectedValue(new Error(errorMessage));

      // Act
      await obrasController.getByEstado(mockReq, mockRes);

      // Assert
      expect(mockObrasService.getByEstado).toHaveBeenCalledWith('activo');
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });

  describe('getWithPartidas', () => {
    it('debe obtener obra con partidas exitosamente', async () => {
      // Arrange
      const mockObra = {
        id: '1',
        nombre: 'Obra 1',
        partidas: [
          { id: '1', nombre: 'Partida 1' },
          { id: '2', nombre: 'Partida 2' }
        ]
      };
      mockReq.params = { id: '1' };
      mockObrasService.getWithPartidas.mockResolvedValue(mockObra);

      // Act
      await obrasController.getWithPartidas(mockReq, mockRes);

      // Assert
      expect(mockObrasService.getWithPartidas).toHaveBeenCalledWith('1');
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockObra,
        message: 'Obra con partidas obtenida correctamente'
      });
    });

    it('debe retornar 404 si la obra con partidas no existe', async () => {
      // Arrange
      mockReq.params = { id: '1' };
      mockObrasService.getWithPartidas.mockResolvedValue(null);

      // Act
      await obrasController.getWithPartidas(mockReq, mockRes);

      // Assert
      expect(mockObrasService.getWithPartidas).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Obra no encontrada'
      });
    });

    it('debe manejar errores al obtener obra con partidas', async () => {
      // Arrange
      const errorMessage = 'Error al obtener obra con partidas';
      mockReq.params = { id: '1' };
      mockObrasService.getWithPartidas.mockRejectedValue(new Error(errorMessage));

      // Act
      await obrasController.getWithPartidas(mockReq, mockRes);

      // Assert
      expect(mockObrasService.getWithPartidas).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });
});
