const { ApuDetalleController } = require('../../src/controllers/apu_detalle.controller.js');
const { ApuDetalleService } = require('../../src/services/apu_detalle.service.js');

// Mock del ApuDetalleService completo
jest.mock('../../src/services/apu_detalle.service.js');

describe('ApuDetalleController', () => {
  let apuDetalleController;
  let mockReq;
  let mockRes;
  let mockApuDetalleService;

  beforeEach(() => {
    // Restaurar todos los mocks
    jest.restoreAllMocks();
    
    // Crear mocks limpios para cada test
    mockApuDetalleService = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getByPartida: jest.fn(),
      getByRecurso: jest.fn(),
      getByCuadrilla: jest.fn()
    };

    // Mock del constructor para que devuelva nuestro mock
    ApuDetalleService.mockImplementation(() => mockApuDetalleService);
    
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
    apuDetalleController = new ApuDetalleController();
  });

  describe('getAll', () => {
    it('debe obtener todos los detalles APU exitosamente', async () => {
      // Arrange
      const mockDetalles = [
        { id: '1', cantidad: 10, precio_unitario: 150000 },
        { id: '2', cantidad: 5, precio_unitario: 200000 }
      ];
      mockApuDetalleService.getAll.mockResolvedValue(mockDetalles);

      // Act
      await apuDetalleController.getAll(mockReq, mockRes);

      // Assert
      expect(mockApuDetalleService.getAll).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockDetalles,
        message: 'Detalles APU obtenidos correctamente'
      });
    });

    it('debe manejar errores al obtener detalles APU', async () => {
      // Arrange
      const errorMessage = 'Error al obtener detalles APU';
      mockApuDetalleService.getAll.mockRejectedValue(new Error(errorMessage));

      // Act
      await apuDetalleController.getAll(mockReq, mockRes);

      // Assert
      expect(mockApuDetalleService.getAll).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });

  describe('getById', () => {
    it('debe obtener un detalle APU por ID exitosamente', async () => {
      // Arrange
      const mockDetalle = { id: '1', cantidad: 10, precio_unitario: 150000 };
      mockReq.params = { id: '1' };
      mockApuDetalleService.getById.mockResolvedValue(mockDetalle);

      // Act
      await apuDetalleController.getById(mockReq, mockRes);

      // Assert
      expect(mockApuDetalleService.getById).toHaveBeenCalledWith('1');
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockDetalle,
        message: 'Detalle APU obtenido correctamente'
      });
    });

    it('debe retornar 404 si el detalle APU no existe', async () => {
      // Arrange
      mockReq.params = { id: '1' };
      mockApuDetalleService.getById.mockResolvedValue(null);

      // Act
      await apuDetalleController.getById(mockReq, mockRes);

      // Assert
      expect(mockApuDetalleService.getById).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Detalle APU no encontrado'
      });
    });

    it('debe manejar errores al obtener detalle APU por ID', async () => {
      // Arrange
      const errorMessage = 'Error al obtener detalle APU';
      mockReq.params = { id: '1' };
      mockApuDetalleService.getById.mockRejectedValue(new Error(errorMessage));

      // Act
      await apuDetalleController.getById(mockReq, mockRes);

      // Assert
      expect(mockApuDetalleService.getById).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });

  describe('create', () => {
    const validDetalleData = {
      partida_id: '1',
      recurso_id: '1',
      cuadrilla_id: '1',
      cantidad: 10,
      precio_unitario: 150000,
      rendimiento: 1.2
    };

    it('debe crear un detalle APU exitosamente', async () => {
      // Arrange
      const mockDetalle = { id: '1', ...validDetalleData };
      mockReq.body = validDetalleData;
      mockApuDetalleService.create.mockResolvedValue(mockDetalle);

      // Act
      await apuDetalleController.create(mockReq, mockRes);

      // Assert
      expect(mockApuDetalleService.create).toHaveBeenCalledWith(validDetalleData);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockDetalle,
        message: 'Detalle APU creado correctamente'
      });
    });

    it('debe manejar errores al crear detalle APU', async () => {
      // Arrange
      const errorMessage = 'Error al crear detalle APU';
      mockReq.body = validDetalleData;
      mockApuDetalleService.create.mockRejectedValue(new Error(errorMessage));

      // Act
      await apuDetalleController.create(mockReq, mockRes);

      // Assert
      expect(mockApuDetalleService.create).toHaveBeenCalledWith(validDetalleData);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });

  describe('update', () => {
    const updateData = {
      cantidad: 15,
      precio_unitario: 180000,
      rendimiento: 1.5
    };

    it('debe actualizar un detalle APU exitosamente', async () => {
      // Arrange
      const mockDetalle = { id: '1', ...updateData };
      mockReq.params = { id: '1' };
      mockReq.body = updateData;
      mockApuDetalleService.update.mockResolvedValue(mockDetalle);

      // Act
      await apuDetalleController.update(mockReq, mockRes);

      // Assert
      expect(mockApuDetalleService.update).toHaveBeenCalledWith('1', updateData);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockDetalle,
        message: 'Detalle APU actualizado correctamente'
      });
    });

    it('debe retornar 404 si el detalle APU a actualizar no existe', async () => {
      // Arrange
      mockReq.params = { id: '1' };
      mockReq.body = updateData;
      mockApuDetalleService.update.mockResolvedValue(null);

      // Act
      await apuDetalleController.update(mockReq, mockRes);

      // Assert
      expect(mockApuDetalleService.update).toHaveBeenCalledWith('1', updateData);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Detalle APU no encontrado'
      });
    });

    it('debe manejar errores al actualizar detalle APU', async () => {
      // Arrange
      const errorMessage = 'Error al actualizar detalle APU';
      mockReq.params = { id: '1' };
      mockReq.body = updateData;
      mockApuDetalleService.update.mockRejectedValue(new Error(errorMessage));

      // Act
      await apuDetalleController.update(mockReq, mockRes);

      // Assert
      expect(mockApuDetalleService.update).toHaveBeenCalledWith('1', updateData);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });

  describe('delete', () => {
    it('debe eliminar un detalle APU exitosamente', async () => {
      // Arrange
      mockReq.params = { id: '1' };
      mockApuDetalleService.delete.mockResolvedValue(true);

      // Act
      await apuDetalleController.delete(mockReq, mockRes);

      // Assert
      expect(mockApuDetalleService.delete).toHaveBeenCalledWith('1');
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Detalle APU eliminado correctamente'
      });
    });

    it('debe retornar 404 si el detalle APU a eliminar no existe', async () => {
      // Arrange
      mockReq.params = { id: '1' };
      mockApuDetalleService.delete.mockResolvedValue(false);

      // Act
      await apuDetalleController.delete(mockReq, mockRes);

      // Assert
      expect(mockApuDetalleService.delete).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Detalle APU no encontrado'
      });
    });

    it('debe manejar errores al eliminar detalle APU', async () => {
      // Arrange
      const errorMessage = 'Error al eliminar detalle APU';
      mockReq.params = { id: '1' };
      mockApuDetalleService.delete.mockRejectedValue(new Error(errorMessage));

      // Act
      await apuDetalleController.delete(mockReq, mockRes);

      // Assert
      expect(mockApuDetalleService.delete).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });

  describe('getByPartida', () => {
    it('debe obtener detalles APU por partida exitosamente', async () => {
      // Arrange
      const mockDetalles = [
        { id: '1', partida_id: '1', cantidad: 10 },
        { id: '2', partida_id: '1', cantidad: 5 }
      ];
      mockReq.params = { partida_id: '1' };
      mockApuDetalleService.getByPartida.mockResolvedValue(mockDetalles);

      // Act
      await apuDetalleController.getByPartida(mockReq, mockRes);

      // Assert
      expect(mockApuDetalleService.getByPartida).toHaveBeenCalledWith('1');
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockDetalles,
        message: 'Detalles APU por partida obtenidos correctamente'
      });
    });

    it('debe manejar errores al obtener detalles APU por partida', async () => {
      // Arrange
      const errorMessage = 'Error al obtener detalles APU por partida';
      mockReq.params = { partida_id: '1' };
      mockApuDetalleService.getByPartida.mockRejectedValue(new Error(errorMessage));

      // Act
      await apuDetalleController.getByPartida(mockReq, mockRes);

      // Assert
      expect(mockApuDetalleService.getByPartida).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });

  describe('getByRecurso', () => {
    it('debe obtener detalles APU por recurso exitosamente', async () => {
      // Arrange
      const mockDetalles = [
        { id: '1', recurso_id: '1', cantidad: 10 },
        { id: '2', recurso_id: '1', cantidad: 5 }
      ];
      mockReq.params = { recurso_id: '1' };
      mockApuDetalleService.getByRecurso.mockResolvedValue(mockDetalles);

      // Act
      await apuDetalleController.getByRecurso(mockReq, mockRes);

      // Assert
      expect(mockApuDetalleService.getByRecurso).toHaveBeenCalledWith('1');
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockDetalles,
        message: 'Detalles APU por recurso obtenidos correctamente'
      });
    });

    it('debe manejar errores al obtener detalles APU por recurso', async () => {
      // Arrange
      const errorMessage = 'Error al obtener detalles APU por recurso';
      mockReq.params = { recurso_id: '1' };
      mockApuDetalleService.getByRecurso.mockRejectedValue(new Error(errorMessage));

      // Act
      await apuDetalleController.getByRecurso(mockReq, mockRes);

      // Assert
      expect(mockApuDetalleService.getByRecurso).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });

  describe('getByCuadrilla', () => {
    it('debe obtener detalles APU por cuadrilla exitosamente', async () => {
      // Arrange
      const mockDetalles = [
        { id: '1', cuadrilla_id: '1', cantidad: 10 },
        { id: '2', cuadrilla_id: '1', cantidad: 5 }
      ];
      mockReq.params = { cuadrilla_id: '1' };
      mockApuDetalleService.getByCuadrilla.mockResolvedValue(mockDetalles);

      // Act
      await apuDetalleController.getByCuadrilla(mockReq, mockRes);

      // Assert
      expect(mockApuDetalleService.getByCuadrilla).toHaveBeenCalledWith('1');
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockDetalles,
        message: 'Detalles APU por cuadrilla obtenidos correctamente'
      });
    });

    it('debe manejar errores al obtener detalles APU por cuadrilla', async () => {
      // Arrange
      const errorMessage = 'Error al obtener detalles APU por cuadrilla';
      mockReq.params = { cuadrilla_id: '1' };
      mockApuDetalleService.getByCuadrilla.mockRejectedValue(new Error(errorMessage));

      // Act
      await apuDetalleController.getByCuadrilla(mockReq, mockRes);

      // Assert
      expect(mockApuDetalleService.getByCuadrilla).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });
});
