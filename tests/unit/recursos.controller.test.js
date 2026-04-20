const { RecursosController } = require('../../src/controllers/recursos.controller.js');
const { RecursosService } = require('../../src/services/recursos.service.js');

// Mock del RecursosService completo
jest.mock('../../src/services/recursos.service.js');

describe('RecursosController', () => {
  let recursosController;
  let mockReq;
  let mockRes;
  let mockRecursosService;

  beforeEach(() => {
    // Restaurar todos los mocks
    jest.restoreAllMocks();
    
    // Crear mocks limpios para cada test
    mockRecursosService = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getByUsuario: jest.fn(),
      getByTipo: jest.fn(),
      searchByNombre: jest.fn(),
      getWithUsage: jest.fn()
    };

    // Mock del constructor para que devuelva nuestro mock
    RecursosService.mockImplementation(() => mockRecursosService);
    
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
    recursosController = new RecursosController();
  });

  describe('getAll', () => {
    it('debe obtener todos los recursos exitosamente', async () => {
      // Arrange
      const mockRecursos = [
        { id: '1', nombre: 'Cemento', unidad: 'saco', tipo: 'material' },
        { id: '2', nombre: 'Arena', unidad: 'm3', tipo: 'material' }
      ];
      mockRecursosService.getAll.mockResolvedValue(mockRecursos);

      // Act
      await recursosController.getAll(mockReq, mockRes);

      // Assert
      expect(mockRecursosService.getAll).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockRecursos,
        message: 'Recursos obtenidos correctamente'
      });
    });

    it('debe manejar errores al obtener recursos', async () => {
      // Arrange
      const errorMessage = 'Error al obtener recursos';
      mockRecursosService.getAll.mockRejectedValue(new Error(errorMessage));

      // Act
      await recursosController.getAll(mockReq, mockRes);

      // Assert
      expect(mockRecursosService.getAll).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });

  describe('getById', () => {
    it('debe obtener un recurso por ID exitosamente', async () => {
      // Arrange
      const mockRecurso = { id: '1', nombre: 'Cemento', unidad: 'saco', tipo: 'material' };
      mockReq.params = { id: '1' };
      mockRecursosService.getById.mockResolvedValue(mockRecurso);

      // Act
      await recursosController.getById(mockReq, mockRes);

      // Assert
      expect(mockRecursosService.getById).toHaveBeenCalledWith('1');
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockRecurso,
        message: 'Recurso obtenido correctamente'
      });
    });

    it('debe retornar 404 si el recurso no existe', async () => {
      // Arrange
      mockReq.params = { id: '1' };
      mockRecursosService.getById.mockResolvedValue(null);

      // Act
      await recursosController.getById(mockReq, mockRes);

      // Assert
      expect(mockRecursosService.getById).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Recurso no encontrado'
      });
    });

    it('debe manejar errores al obtener recurso por ID', async () => {
      // Arrange
      const errorMessage = 'Error al obtener recurso';
      mockReq.params = { id: '1' };
      mockRecursosService.getById.mockRejectedValue(new Error(errorMessage));

      // Act
      await recursosController.getById(mockReq, mockRes);

      // Assert
      expect(mockRecursosService.getById).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });

  describe('create', () => {
    const validRecursoData = {
      nombre: 'Nuevo Recurso',
      unidad: 'kg',
      tipo: 'material',
      precio_unitario: 50000
    };

    it('debe crear un recurso exitosamente', async () => {
      // Arrange
      const mockRecurso = { id: '1', ...validRecursoData };
      mockReq.body = validRecursoData;
      mockRecursosService.create.mockResolvedValue(mockRecurso);

      // Act
      await recursosController.create(mockReq, mockRes);

      // Assert
      expect(mockRecursosService.create).toHaveBeenCalledWith(validRecursoData);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockRecurso,
        message: 'Recurso creado correctamente'
      });
    });

    it('debe manejar errores al crear recurso', async () => {
      // Arrange
      const errorMessage = 'Error al crear recurso';
      mockReq.body = validRecursoData;
      mockRecursosService.create.mockRejectedValue(new Error(errorMessage));

      // Act
      await recursosController.create(mockReq, mockRes);

      // Assert
      expect(mockRecursosService.create).toHaveBeenCalledWith(validRecursoData);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });

  describe('update', () => {
    const updateData = {
      nombre: 'Recurso Actualizado',
      unidad: 'm3',
      precio_unitario: 75000
    };

    it('debe actualizar un recurso exitosamente', async () => {
      // Arrange
      const mockRecurso = { id: '1', ...updateData };
      mockReq.params = { id: '1' };
      mockReq.body = updateData;
      mockRecursosService.update.mockResolvedValue(mockRecurso);

      // Act
      await recursosController.update(mockReq, mockRes);

      // Assert
      expect(mockRecursosService.update).toHaveBeenCalledWith('1', updateData);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockRecurso,
        message: 'Recurso actualizado correctamente'
      });
    });

    it('debe retornar 404 si el recurso a actualizar no existe', async () => {
      // Arrange
      mockReq.params = { id: '1' };
      mockReq.body = updateData;
      mockRecursosService.update.mockResolvedValue(null);

      // Act
      await recursosController.update(mockReq, mockRes);

      // Assert
      expect(mockRecursosService.update).toHaveBeenCalledWith('1', updateData);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Recurso no encontrado'
      });
    });

    it('debe manejar errores al actualizar recurso', async () => {
      // Arrange
      const errorMessage = 'Error al actualizar recurso';
      mockReq.params = { id: '1' };
      mockReq.body = updateData;
      mockRecursosService.update.mockRejectedValue(new Error(errorMessage));

      // Act
      await recursosController.update(mockReq, mockRes);

      // Assert
      expect(mockRecursosService.update).toHaveBeenCalledWith('1', updateData);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });

  describe('delete', () => {
    it('debe eliminar un recurso exitosamente', async () => {
      // Arrange
      mockReq.params = { id: '1' };
      mockRecursosService.delete.mockResolvedValue(true);

      // Act
      await recursosController.delete(mockReq, mockRes);

      // Assert
      expect(mockRecursosService.delete).toHaveBeenCalledWith('1');
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Recurso eliminado correctamente'
      });
    });

    it('debe retornar 404 si el recurso a eliminar no existe', async () => {
      // Arrange
      mockReq.params = { id: '1' };
      mockRecursosService.delete.mockResolvedValue(false);

      // Act
      await recursosController.delete(mockReq, mockRes);

      // Assert
      expect(mockRecursosService.delete).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Recurso no encontrado'
      });
    });

    it('debe manejar errores al eliminar recurso', async () => {
      // Arrange
      const errorMessage = 'Error al eliminar recurso';
      mockReq.params = { id: '1' };
      mockRecursosService.delete.mockRejectedValue(new Error(errorMessage));

      // Act
      await recursosController.delete(mockReq, mockRes);

      // Assert
      expect(mockRecursosService.delete).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });

  describe('getByUsuario', () => {
    it('debe obtener recursos por usuario exitosamente', async () => {
      // Arrange
      const mockRecursos = [
        { id: '1', nombre: 'Cemento', usuario_id: '1' },
        { id: '2', nombre: 'Arena', usuario_id: '1' }
      ];
      mockReq.params = { usuario_id: '1' };
      mockRecursosService.getByUsuario.mockResolvedValue(mockRecursos);

      // Act
      await recursosController.getByUsuario(mockReq, mockRes);

      // Assert
      expect(mockRecursosService.getByUsuario).toHaveBeenCalledWith('1');
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockRecursos,
        message: 'Recursos del usuario obtenidos correctamente'
      });
    });

    it('debe manejar errores al obtener recursos por usuario', async () => {
      // Arrange
      const errorMessage = 'Error al obtener recursos del usuario';
      mockReq.params = { usuario_id: '1' };
      mockRecursosService.getByUsuario.mockRejectedValue(new Error(errorMessage));

      // Act
      await recursosController.getByUsuario(mockReq, mockRes);

      // Assert
      expect(mockRecursosService.getByUsuario).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });

  describe('getByTipo', () => {
    it('debe obtener recursos por tipo exitosamente', async () => {
      // Arrange
      const mockRecursos = [
        { id: '1', nombre: 'Cemento', tipo: 'material' },
        { id: '2', nombre: 'Grava', tipo: 'material' }
      ];
      mockReq.params = { usuario_id: '1', tipo: 'material' };
      mockRecursosService.getByTipo.mockResolvedValue(mockRecursos);

      // Act
      await recursosController.getByTipo(mockReq, mockRes);

      // Assert
      expect(mockRecursosService.getByTipo).toHaveBeenCalledWith('1', 'material');
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockRecursos,
        message: 'Recursos por tipo obtenidos correctamente'
      });
    });

    it('debe manejar errores al obtener recursos por tipo', async () => {
      // Arrange
      const errorMessage = 'Error al obtener recursos por tipo';
      mockReq.params = { usuario_id: '1', tipo: 'material' };
      mockRecursosService.getByTipo.mockRejectedValue(new Error(errorMessage));

      // Act
      await recursosController.getByTipo(mockReq, mockRes);

      // Assert
      expect(mockRecursosService.getByTipo).toHaveBeenCalledWith('1', 'material');
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });

  describe('searchByNombre', () => {
    it('debe buscar recursos por nombre exitosamente', async () => {
      // Arrange
      const mockRecursos = [
        { id: '1', nombre: 'Cemento Portland', usuario_id: '1' },
        { id: '2', nombre: 'Cemento Gris', usuario_id: '1' }
      ];
      mockReq.params = { searchTerm: 'Cemento' };
      mockReq.query = { usuario_id: '1' };
      mockRecursosService.searchByNombre.mockResolvedValue(mockRecursos);

      // Act
      await recursosController.searchByNombre(mockReq, mockRes);

      // Assert
      expect(mockRecursosService.searchByNombre).toHaveBeenCalledWith('1', 'Cemento');
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockRecursos,
        message: 'Búsqueda de recursos completada correctamente'
      });
    });

    it('debe retornar 400 si no se proporciona usuario_id', async () => {
      // Arrange
      mockReq.params = { searchTerm: 'Cemento' };
      mockReq.query = {};
      mockRecursosService.searchByNombre.mockResolvedValue([]);

      // Act
      await recursosController.searchByNombre(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'El ID del usuario es requerido para la búsqueda'
      });
    });

    it('debe manejar errores al buscar recursos', async () => {
      // Arrange
      const errorMessage = 'Error al buscar recursos';
      mockReq.params = { searchTerm: 'Cemento' };
      mockReq.query = { usuario_id: '1' };
      mockRecursosService.searchByNombre.mockRejectedValue(new Error(errorMessage));

      // Act
      await recursosController.searchByNombre(mockReq, mockRes);

      // Assert
      expect(mockRecursosService.searchByNombre).toHaveBeenCalledWith('1', 'Cemento');
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });

  describe('getWithUsage', () => {
    it('debe obtener recurso con estadísticas de uso exitosamente', async () => {
      // Arrange
      const mockRecurso = {
        id: '1',
        nombre: 'Cemento',
        unidad: 'saco',
        total_usos: 25,
        total_cantidad: 500,
        total_valor: 12500000,
        apu_detalles: [
          { id: '1', cantidad: 20, precio_unitario: 25000 },
          { id: '2', cantidad: 5, precio_unitario: 25000 }
        ]
      };
      mockReq.params = { id: '1' };
      mockRecursosService.getWithUsage.mockResolvedValue(mockRecurso);

      // Act
      await recursosController.getWithUsage(mockReq, mockRes);

      // Assert
      expect(mockRecursosService.getWithUsage).toHaveBeenCalledWith('1');
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockRecurso,
        message: 'Recurso con estadísticas de uso obtenido correctamente'
      });
    });

    it('debe retornar 404 si el recurso con uso no existe', async () => {
      // Arrange
      mockReq.params = { id: '1' };
      mockRecursosService.getWithUsage.mockResolvedValue(null);

      // Act
      await recursosController.getWithUsage(mockReq, mockRes);

      // Assert
      expect(mockRecursosService.getWithUsage).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Recurso no encontrado'
      });
    });

    it('debe manejar errores al obtener recurso con uso', async () => {
      // Arrange
      const errorMessage = 'Error al obtener recurso con uso';
      mockReq.params = { id: '1' };
      mockRecursosService.getWithUsage.mockRejectedValue(new Error(errorMessage));

      // Act
      await recursosController.getWithUsage(mockReq, mockRes);

      // Assert
      expect(mockRecursosService.getWithUsage).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });
});
