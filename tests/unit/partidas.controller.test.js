const { PartidasController } = require('../../src/controllers/partidas.controller.js');
const { PartidasService } = require('../../src/services/partidas.service.js');

// Mock del PartidasService completo
jest.mock('../../src/services/partidas.service.js');

describe('PartidasController', () => {
  let partidasController;
  let mockReq;
  let mockRes;
  let mockPartidasService;

  beforeEach(() => {
    // Restaurar todos los mocks
    jest.restoreAllMocks();
    
    // Crear mocks limpios para cada test
    mockPartidasService = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getByObra: jest.fn(),
      getWithDetails: jest.fn()
    };

    // Mock del constructor para que devuelva nuestro mock
    PartidasService.mockImplementation(() => mockPartidasService);
    
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
    partidasController = new PartidasController();
  });

  describe('getAll', () => {
    it('debe obtener todas las partidas exitosamente', async () => {
      // Arrange
      const mockPartidas = [
        { id: '1', nombre: 'Partida 1', obra_id: '1' },
        { id: '2', nombre: 'Partida 2', obra_id: '2' }
      ];
      mockPartidasService.getAll.mockResolvedValue(mockPartidas);

      // Act
      await partidasController.getAll(mockReq, mockRes);

      // Assert
      expect(mockPartidasService.getAll).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockPartidas,
        message: 'Partidas obtenidas correctamente'
      });
    });

    it('debe manejar errores al obtener partidas', async () => {
      // Arrange
      const errorMessage = 'Error al obtener partidas';
      mockPartidasService.getAll.mockRejectedValue(new Error(errorMessage));

      // Act
      await partidasController.getAll(mockReq, mockRes);

      // Assert
      expect(mockPartidasService.getAll).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });

  describe('getById', () => {
    it('debe obtener una partida por ID exitosamente', async () => {
      // Arrange
      const mockPartida = { id: '1', nombre: 'Partida 1', obra_id: '1' };
      mockReq.params = { id: '1' };
      mockPartidasService.getById.mockResolvedValue(mockPartida);

      // Act
      await partidasController.getById(mockReq, mockRes);

      // Assert
      expect(mockPartidasService.getById).toHaveBeenCalledWith('1');
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockPartida,
        message: 'Partida obtenida correctamente'
      });
    });

    it('debe retornar 404 si la partida no existe', async () => {
      // Arrange
      mockReq.params = { id: '1' };
      mockPartidasService.getById.mockResolvedValue(null);

      // Act
      await partidasController.getById(mockReq, mockRes);

      // Assert
      expect(mockPartidasService.getById).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Partida no encontrada'
      });
    });

    it('debe manejar errores al obtener partida por ID', async () => {
      // Arrange
      const errorMessage = 'Error al obtener partida';
      mockReq.params = { id: '1' };
      mockPartidasService.getById.mockRejectedValue(new Error(errorMessage));

      // Act
      await partidasController.getById(mockReq, mockRes);

      // Assert
      expect(mockPartidasService.getById).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });

  describe('create', () => {
    const validPartidaData = {
      nombre: 'Nueva Partida',
      descripcion: 'Descripción de la partida',
      obra_id: '1',
      unidad: 'm3',
      cantidad: 100
    };

    it('debe crear una partida exitosamente', async () => {
      // Arrange
      const mockPartida = { id: '1', ...validPartidaData };
      mockReq.body = validPartidaData;
      mockPartidasService.create.mockResolvedValue(mockPartida);

      // Act
      await partidasController.create(mockReq, mockRes);

      // Assert
      expect(mockPartidasService.create).toHaveBeenCalledWith(validPartidaData);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockPartida,
        message: 'Partida creada correctamente'
      });
    });

    it('debe manejar errores al crear partida', async () => {
      // Arrange
      const errorMessage = 'Error al crear partida';
      mockReq.body = validPartidaData;
      mockPartidasService.create.mockRejectedValue(new Error(errorMessage));

      // Act
      await partidasController.create(mockReq, mockRes);

      // Assert
      expect(mockPartidasService.create).toHaveBeenCalledWith(validPartidaData);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });

  describe('update', () => {
    const updateData = {
      nombre: 'Partida Actualizada',
      descripcion: 'Descripción actualizada'
    };

    it('debe actualizar una partida exitosamente', async () => {
      // Arrange
      const mockPartida = { id: '1', ...updateData };
      mockReq.params = { id: '1' };
      mockReq.body = updateData;
      mockPartidasService.update.mockResolvedValue(mockPartida);

      // Act
      await partidasController.update(mockReq, mockRes);

      // Assert
      expect(mockPartidasService.update).toHaveBeenCalledWith('1', updateData);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockPartida,
        message: 'Partida actualizada correctamente'
      });
    });

    it('debe retornar 404 si la partida a actualizar no existe', async () => {
      // Arrange
      mockReq.params = { id: '1' };
      mockReq.body = updateData;
      mockPartidasService.update.mockResolvedValue(null);

      // Act
      await partidasController.update(mockReq, mockRes);

      // Assert
      expect(mockPartidasService.update).toHaveBeenCalledWith('1', updateData);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Partida no encontrada'
      });
    });

    it('debe manejar errores al actualizar partida', async () => {
      // Arrange
      const errorMessage = 'Error al actualizar partida';
      mockReq.params = { id: '1' };
      mockReq.body = updateData;
      mockPartidasService.update.mockRejectedValue(new Error(errorMessage));

      // Act
      await partidasController.update(mockReq, mockRes);

      // Assert
      expect(mockPartidasService.update).toHaveBeenCalledWith('1', updateData);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });

  describe('delete', () => {
    it('debe eliminar una partida exitosamente', async () => {
      // Arrange
      mockReq.params = { id: '1' };
      mockPartidasService.delete.mockResolvedValue(true);

      // Act
      await partidasController.delete(mockReq, mockRes);

      // Assert
      expect(mockPartidasService.delete).toHaveBeenCalledWith('1');
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Partida eliminada correctamente'
      });
    });

    it('debe retornar 404 si la partida a eliminar no existe', async () => {
      // Arrange
      mockReq.params = { id: '1' };
      mockPartidasService.delete.mockResolvedValue(false);

      // Act
      await partidasController.delete(mockReq, mockRes);

      // Assert
      expect(mockPartidasService.delete).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Partida no encontrada'
      });
    });

    it('debe manejar errores al eliminar partida', async () => {
      // Arrange
      const errorMessage = 'Error al eliminar partida';
      mockReq.params = { id: '1' };
      mockPartidasService.delete.mockRejectedValue(new Error(errorMessage));

      // Act
      await partidasController.delete(mockReq, mockRes);

      // Assert
      expect(mockPartidasService.delete).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });

  describe('getByObra', () => {
    it('debe obtener partidas por obra exitosamente', async () => {
      // Arrange
      const mockPartidas = [
        { id: '1', nombre: 'Partida 1', obra_id: '1' },
        { id: '2', nombre: 'Partida 2', obra_id: '1' }
      ];
      mockReq.params = { obra_id: '1' };
      mockPartidasService.getByObra.mockResolvedValue(mockPartidas);

      // Act
      await partidasController.getByObra(mockReq, mockRes);

      // Assert
      expect(mockPartidasService.getByObra).toHaveBeenCalledWith('1');
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockPartidas,
        message: 'Partidas por obra obtenidas correctamente'
      });
    });

    it('debe manejar errores al obtener partidas por obra', async () => {
      // Arrange
      const errorMessage = 'Error al obtener partidas por obra';
      mockReq.params = { obra_id: '1' };
      mockPartidasService.getByObra.mockRejectedValue(new Error(errorMessage));

      // Act
      await partidasController.getByObra(mockReq, mockRes);

      // Assert
      expect(mockPartidasService.getByObra).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });

  describe('getWithDetails', () => {
    it('debe obtener partida con detalles exitosamente', async () => {
      // Arrange
      const mockPartida = {
        id: '1',
        nombre: 'Partida 1',
        apu_detalles: [
          { id: '1', cantidad: 10, precio_unitario: 150000 },
          { id: '2', cantidad: 5, precio_unitario: 200000 }
        ]
      };
      mockReq.params = { id: '1' };
      mockPartidasService.getWithDetails.mockResolvedValue(mockPartida);

      // Act
      await partidasController.getWithDetails(mockReq, mockRes);

      // Assert
      expect(mockPartidasService.getWithDetails).toHaveBeenCalledWith('1');
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockPartida,
        message: 'Partida con detalles obtenida correctamente'
      });
    });

    it('debe retornar 404 si la partida con detalles no existe', async () => {
      // Arrange
      mockReq.params = { id: '1' };
      mockPartidasService.getWithDetails.mockResolvedValue(null);

      // Act
      await partidasController.getWithDetails(mockReq, mockRes);

      // Assert
      expect(mockPartidasService.getWithDetails).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Partida no encontrada'
      });
    });

    it('debe manejar errores al obtener partida con detalles', async () => {
      // Arrange
      const errorMessage = 'Error al obtener partida con detalles';
      mockReq.params = { id: '1' };
      mockPartidasService.getWithDetails.mockRejectedValue(new Error(errorMessage));

      // Act
      await partidasController.getWithDetails(mockReq, mockRes);

      // Assert
      expect(mockPartidasService.getWithDetails).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });
});
