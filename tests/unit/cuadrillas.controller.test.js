const { CuadrillasController } = require('../../src/controllers/cuadrillas.controller.js');
const { CuadrillasService } = require('../../src/services/cuadrillas.service.js');

// Mock del CuadrillasService completo
jest.mock('../../src/services/cuadrillas.service.js');

describe('CuadrillasController', () => {
  let cuadrillasController;
  let mockReq;
  let mockRes;
  let mockCuadrillasService;

  beforeEach(() => {
    // Restaurar todos los mocks
    jest.restoreAllMocks();
    
    // Crear mocks limpios para cada test
    mockCuadrillasService = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getByUsuario: jest.fn(),
      getWithTrabajadores: jest.fn(),
      getWithUsage: jest.fn(),
      searchByNombre: jest.fn()
    };

    // Mock del constructor para que devuelva nuestro mock
    CuadrillasService.mockImplementation(() => mockCuadrillasService);
    
    // Mock de request y response
    mockReq = {
      body: {},
      params: {},
      query: {}
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    
    // Crear instancia del controller DESPUÉS del mock
    cuadrillasController = new CuadrillasController();
  });

  describe('getAll', () => {
    it('debe obtener todas las cuadrillas exitosamente', async () => {
      // Arrange
      const mockCuadrillas = [
        { id: '1', nombre: 'Cuadrilla 1', usuario_id: '1' },
        { id: '2', nombre: 'Cuadrilla 2', usuario_id: '1' }
      ];
      mockCuadrillasService.getAll.mockResolvedValue(mockCuadrillas);

      // Act
      await cuadrillasController.getAll(mockReq, mockRes);

      // Assert
      expect(mockCuadrillasService.getAll).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockCuadrillas,
        message: 'Cuadrillas obtenidas correctamente'
      });
    });

    it('debe manejar errores al obtener cuadrillas', async () => {
      // Arrange
      const errorMessage = 'Error al obtener cuadrillas';
      mockCuadrillasService.getAll.mockRejectedValue(new Error(errorMessage));

      // Act
      await cuadrillasController.getAll(mockReq, mockRes);

      // Assert
      expect(mockCuadrillasService.getAll).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });

  describe('getById', () => {
    it('debe obtener una cuadrilla por ID exitosamente', async () => {
      // Arrange
      const mockCuadrilla = { id: '1', nombre: 'Cuadrilla 1', usuario_id: '1' };
      mockReq.params = { id: '1' };
      mockCuadrillasService.getById.mockResolvedValue(mockCuadrilla);

      // Act
      await cuadrillasController.getById(mockReq, mockRes);

      // Assert
      expect(mockCuadrillasService.getById).toHaveBeenCalledWith('1');
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockCuadrilla,
        message: 'Cuadrilla obtenida correctamente'
      });
    });

    it('debe retornar 404 si la cuadrilla no existe', async () => {
      // Arrange
      mockReq.params = { id: '1' };
      mockCuadrillasService.getById.mockResolvedValue(null);

      // Act
      await cuadrillasController.getById(mockReq, mockRes);

      // Assert
      expect(mockCuadrillasService.getById).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Cuadrilla no encontrada'
      });
    });

    it('debe manejar errores al obtener cuadrilla por ID', async () => {
      // Arrange
      const errorMessage = 'Error al obtener cuadrilla';
      mockReq.params = { id: '1' };
      mockCuadrillasService.getById.mockRejectedValue(new Error(errorMessage));

      // Act
      await cuadrillasController.getById(mockReq, mockRes);

      // Assert
      expect(mockCuadrillasService.getById).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });

  describe('create', () => {
    const validCuadrillaData = {
      nombre: 'Nueva Cuadrilla',
      descripcion: 'Descripción de la cuadrilla',
      usuario_id: '1',
      rendimiento_base: 1.2
    };

    it('debe crear una cuadrilla exitosamente', async () => {
      // Arrange
      const mockCuadrilla = { id: '1', ...validCuadrillaData };
      mockReq.body = validCuadrillaData;
      mockCuadrillasService.create.mockResolvedValue(mockCuadrilla);

      // Act
      await cuadrillasController.create(mockReq, mockRes);

      // Assert
      expect(mockCuadrillasService.create).toHaveBeenCalledWith(validCuadrillaData);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockCuadrilla,
        message: 'Cuadrilla creada correctamente'
      });
    });

    it('debe manejar errores al crear cuadrilla', async () => {
      // Arrange
      const errorMessage = 'Error al crear cuadrilla';
      mockReq.body = validCuadrillaData;
      mockCuadrillasService.create.mockRejectedValue(new Error(errorMessage));

      // Act
      await cuadrillasController.create(mockReq, mockRes);

      // Assert
      expect(mockCuadrillasService.create).toHaveBeenCalledWith(validCuadrillaData);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });

  describe('update', () => {
    const updateData = {
      nombre: 'Cuadrilla Actualizada',
      descripcion: 'Descripción actualizada'
    };

    it('debe actualizar una cuadrilla exitosamente', async () => {
      // Arrange
      const mockCuadrilla = { id: '1', ...updateData };
      mockReq.params = { id: '1' };
      mockReq.body = updateData;
      mockCuadrillasService.update.mockResolvedValue(mockCuadrilla);

      // Act
      await cuadrillasController.update(mockReq, mockRes);

      // Assert
      expect(mockCuadrillasService.update).toHaveBeenCalledWith('1', updateData);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockCuadrilla,
        message: 'Cuadrilla actualizada correctamente'
      });
    });

    it('debe retornar 404 si la cuadrilla a actualizar no existe', async () => {
      // Arrange
      mockReq.params = { id: '1' };
      mockReq.body = updateData;
      mockCuadrillasService.update.mockResolvedValue(null);

      // Act
      await cuadrillasController.update(mockReq, mockRes);

      // Assert
      expect(mockCuadrillasService.update).toHaveBeenCalledWith('1', updateData);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Cuadrilla no encontrada'
      });
    });

    it('debe manejar errores al actualizar cuadrilla', async () => {
      // Arrange
      const errorMessage = 'Error al actualizar cuadrilla';
      mockReq.params = { id: '1' };
      mockReq.body = updateData;
      mockCuadrillasService.update.mockRejectedValue(new Error(errorMessage));

      // Act
      await cuadrillasController.update(mockReq, mockRes);

      // Assert
      expect(mockCuadrillasService.update).toHaveBeenCalledWith('1', updateData);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });

  describe('delete', () => {
    it('debe eliminar una cuadrilla exitosamente', async () => {
      // Arrange
      mockReq.params = { id: '1' };
      mockCuadrillasService.delete.mockResolvedValue(true);

      // Act
      await cuadrillasController.delete(mockReq, mockRes);

      // Assert
      expect(mockCuadrillasService.delete).toHaveBeenCalledWith('1');
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Cuadrilla eliminada correctamente'
      });
    });

    it('debe retornar 404 si la cuadrilla a eliminar no existe', async () => {
      // Arrange
      mockReq.params = { id: '1' };
      mockCuadrillasService.delete.mockResolvedValue(false);

      // Act
      await cuadrillasController.delete(mockReq, mockRes);

      // Assert
      expect(mockCuadrillasService.delete).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Cuadrilla no encontrada'
      });
    });

    it('debe manejar errores al eliminar cuadrilla', async () => {
      // Arrange
      const errorMessage = 'Error al eliminar cuadrilla';
      mockReq.params = { id: '1' };
      mockCuadrillasService.delete.mockRejectedValue(new Error(errorMessage));

      // Act
      await cuadrillasController.delete(mockReq, mockRes);

      // Assert
      expect(mockCuadrillasService.delete).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });

  describe('getByUsuario', () => {
    it('debe obtener cuadrillas por usuario exitosamente', async () => {
      // Arrange
      const mockCuadrillas = [
        { id: '1', nombre: 'Cuadrilla 1', usuario_id: '1' },
        { id: '2', nombre: 'Cuadrilla 2', usuario_id: '1' }
      ];
      mockReq.params = { usuario_id: '1' };
      mockCuadrillasService.getByUsuario.mockResolvedValue(mockCuadrillas);

      // Act
      await cuadrillasController.getByUsuario(mockReq, mockRes);

      // Assert
      expect(mockCuadrillasService.getByUsuario).toHaveBeenCalledWith('1');
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockCuadrillas,
        message: 'Cuadrillas del usuario obtenidas correctamente'
      });
    });

    it('debe manejar errores al obtener cuadrillas por usuario', async () => {
      // Arrange
      const errorMessage = 'Error al obtener cuadrillas del usuario';
      mockReq.params = { usuario_id: '1' };
      mockCuadrillasService.getByUsuario.mockRejectedValue(new Error(errorMessage));

      // Act
      await cuadrillasController.getByUsuario(mockReq, mockRes);

      // Assert
      expect(mockCuadrillasService.getByUsuario).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });

  describe('getWithTrabajadores', () => {
    it('debe obtener cuadrilla con trabajadores exitosamente', async () => {
      // Arrange
      const mockCuadrilla = {
        id: '1',
        nombre: 'Cuadrilla 1',
        trabajadores: [
          { id: '1', nombre: 'Trabajador 1' },
          { id: '2', nombre: 'Trabajador 2' }
        ]
      };
      mockReq.params = { id: '1' };
      mockCuadrillasService.getWithTrabajadores.mockResolvedValue(mockCuadrilla);

      // Act
      await cuadrillasController.getWithTrabajadores(mockReq, mockRes);

      // Assert
      expect(mockCuadrillasService.getWithTrabajadores).toHaveBeenCalledWith('1');
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockCuadrilla,
        message: 'Cuadrilla con trabajadores obtenida correctamente'
      });
    });

    it('debe retornar 404 si la cuadrilla con trabajadores no existe', async () => {
      // Arrange
      mockReq.params = { id: '1' };
      mockCuadrillasService.getWithTrabajadores.mockResolvedValue(null);

      // Act
      await cuadrillasController.getWithTrabajadores(mockReq, mockRes);

      // Assert
      expect(mockCuadrillasService.getWithTrabajadores).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Cuadrilla no encontrada'
      });
    });

    it('debe manejar errores al obtener cuadrilla con trabajadores', async () => {
      // Arrange
      const errorMessage = 'Error al obtener cuadrilla con trabajadores';
      mockReq.params = { id: '1' };
      mockCuadrillasService.getWithTrabajadores.mockRejectedValue(new Error(errorMessage));

      // Act
      await cuadrillasController.getWithTrabajadores(mockReq, mockRes);

      // Assert
      expect(mockCuadrillasService.getWithTrabajadores).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });

  describe('getWithUsage', () => {
    it('debe obtener cuadrilla con estadísticas de uso exitosamente', async () => {
      // Arrange
      const mockCuadrilla = {
        id: '1',
        nombre: 'Cuadrilla 1',
        total_usos: 15,
        total_valor: 4500000,
        apu_detalle: [
          { id: '1', cantidad: 10, precio_unitario: 150000 },
          { id: '2', cantidad: 5, precio_unitario: 200000 }
        ]
      };
      mockReq.params = { id: '1' };
      mockCuadrillasService.getWithUsage.mockResolvedValue(mockCuadrilla);

      // Act
      await cuadrillasController.getWithUsage(mockReq, mockRes);

      // Assert
      expect(mockCuadrillasService.getWithUsage).toHaveBeenCalledWith('1');
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockCuadrilla,
        message: 'Cuadrilla con estadísticas de uso obtenida correctamente'
      });
    });

    it('debe retornar 404 si la cuadrilla con uso no existe', async () => {
      // Arrange
      mockReq.params = { id: '1' };
      mockCuadrillasService.getWithUsage.mockResolvedValue(null);

      // Act
      await cuadrillasController.getWithUsage(mockReq, mockRes);

      // Assert
      expect(mockCuadrillasService.getWithUsage).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Cuadrilla no encontrada'
      });
    });

    it('debe manejar errores al obtener cuadrilla con uso', async () => {
      // Arrange
      const errorMessage = 'Error al obtener cuadrilla con uso';
      mockReq.params = { id: '1' };
      mockCuadrillasService.getWithUsage.mockRejectedValue(new Error(errorMessage));

      // Act
      await cuadrillasController.getWithUsage(mockReq, mockRes);

      // Assert
      expect(mockCuadrillasService.getWithUsage).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });

  describe('searchByNombre', () => {
    it('debe buscar cuadrillas por nombre exitosamente', async () => {
      // Arrange
      const mockCuadrillas = [
        { id: '1', nombre: 'Cuadrilla Albañilería', usuario_id: '1' },
        { id: '2', nombre: 'Cuadrilla Electricidad', usuario_id: '1' }
      ];
      mockReq.params = { searchTerm: 'Albañilería' };
      mockReq.query = { usuario_id: '1' };
      mockCuadrillasService.searchByNombre.mockResolvedValue(mockCuadrillas);

      // Act
      await cuadrillasController.searchByNombre(mockReq, mockRes);

      // Assert
      expect(mockCuadrillasService.searchByNombre).toHaveBeenCalledWith('1', 'Albañilería');
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockCuadrillas,
        message: 'Búsqueda de cuadrillas completada correctamente'
      });
    });

    it('debe retornar 400 si no se proporciona usuario_id', async () => {
      // Arrange
      mockReq.params = { searchTerm: 'Albañilería' };
      mockReq.query = {};
      mockCuadrillasService.searchByNombre.mockResolvedValue([]);

      // Act
      await cuadrillasController.searchByNombre(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'El ID del usuario es requerido para la búsqueda'
      });
    });

    it('debe manejar errores al buscar cuadrillas', async () => {
      // Arrange
      const errorMessage = 'Error al buscar cuadrillas';
      mockReq.params = { searchTerm: 'Albañilería' };
      mockReq.query = { usuario_id: '1' };
      mockCuadrillasService.searchByNombre.mockRejectedValue(new Error(errorMessage));

      // Act
      await cuadrillasController.searchByNombre(mockReq, mockRes);

      // Assert
      expect(mockCuadrillasService.searchByNombre).toHaveBeenCalledWith('1', 'Albañilería');
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });
});
