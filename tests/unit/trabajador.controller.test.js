const { TrabajadorController } = require('../../src/controllers/trabajador.controller.js');
const { TrabajadorService } = require('../../src/services/trabajador.service.js');

// Mock del TrabajadorService completo
jest.mock('../../src/services/trabajador.service.js');

describe('TrabajadorController', () => {
  let trabajadorController;
  let mockReq;
  let mockRes;
  let mockTrabajadorService;

  beforeEach(() => {
    // Restaurar todos los mocks
    jest.restoreAllMocks();
    
    // Crear mocks limpios para cada test
    mockTrabajadorService = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getByCuadrilla: jest.fn(),
      searchByNombre: jest.fn()
    };

    // Mock del constructor para que devuelva nuestro mock
    TrabajadorService.mockImplementation(() => mockTrabajadorService);
    
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
    trabajadorController = new TrabajadorController();
  });

  describe('getAll', () => {
    it('debe obtener todos los trabajadores exitosamente', async () => {
      // Arrange
      const mockTrabajadores = [
        { id: '1', nombre: 'Trabajador 1', salario_diario: 50000 },
        { id: '2', nombre: 'Trabajador 2', salario_diario: 60000 }
      ];
      mockTrabajadorService.getAll.mockResolvedValue(mockTrabajadores);

      // Act
      await trabajadorController.getAll(mockReq, mockRes);

      // Assert
      expect(mockTrabajadorService.getAll).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockTrabajadores,
        message: 'Trabajadores obtenidos correctamente'
      });
    });

    it('debe manejar errores al obtener trabajadores', async () => {
      // Arrange
      const errorMessage = 'Error al obtener trabajadores';
      mockTrabajadorService.getAll.mockRejectedValue(new Error(errorMessage));

      // Act
      await trabajadorController.getAll(mockReq, mockRes);

      // Assert
      expect(mockTrabajadorService.getAll).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });

  describe('getById', () => {
    it('debe obtener un trabajador por ID exitosamente', async () => {
      // Arrange
      const mockTrabajador = { id: '1', nombre: 'Trabajador 1', salario_diario: 50000 };
      mockReq.params = { id: '1' };
      mockTrabajadorService.getById.mockResolvedValue(mockTrabajador);

      // Act
      await trabajadorController.getById(mockReq, mockRes);

      // Assert
      expect(mockTrabajadorService.getById).toHaveBeenCalledWith('1');
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockTrabajador,
        message: 'Trabajador obtenido correctamente'
      });
    });

    it('debe retornar 404 si el trabajador no existe', async () => {
      // Arrange
      mockReq.params = { id: '1' };
      mockTrabajadorService.getById.mockResolvedValue(null);

      // Act
      await trabajadorController.getById(mockReq, mockRes);

      // Assert
      expect(mockTrabajadorService.getById).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Trabajador no encontrado'
      });
    });

    it('debe manejar errores al obtener trabajador por ID', async () => {
      // Arrange
      const errorMessage = 'Error al obtener trabajador';
      mockReq.params = { id: '1' };
      mockTrabajadorService.getById.mockRejectedValue(new Error(errorMessage));

      // Act
      await trabajadorController.getById(mockReq, mockRes);

      // Assert
      expect(mockTrabajadorService.getById).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });

  describe('create', () => {
    const validTrabajadorData = {
      nombre: 'Nuevo Trabajador',
      documento: '123456789',
      telefono: '3001234567',
      salario_diario: 55000,
      especialidad: 'albañil'
    };

    it('debe crear un trabajador exitosamente', async () => {
      // Arrange
      const mockTrabajador = { id: '1', ...validTrabajadorData };
      mockReq.body = validTrabajadorData;
      mockTrabajadorService.create.mockResolvedValue(mockTrabajador);

      // Act
      await trabajadorController.create(mockReq, mockRes);

      // Assert
      expect(mockTrabajadorService.create).toHaveBeenCalledWith(validTrabajadorData);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockTrabajador,
        message: 'Trabajador creado correctamente'
      });
    });

    it('debe manejar errores al crear trabajador', async () => {
      // Arrange
      const errorMessage = 'Error al crear trabajador';
      mockReq.body = validTrabajadorData;
      mockTrabajadorService.create.mockRejectedValue(new Error(errorMessage));

      // Act
      await trabajadorController.create(mockReq, mockRes);

      // Assert
      expect(mockTrabajadorService.create).toHaveBeenCalledWith(validTrabajadorData);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });

  describe('update', () => {
    const updateData = {
      nombre: 'Trabajador Actualizado',
      salario_diario: 60000,
      especialidad: 'electricista'
    };

    it('debe actualizar un trabajador exitosamente', async () => {
      // Arrange
      const mockTrabajador = { id: '1', ...updateData };
      mockReq.params = { id: '1' };
      mockReq.body = updateData;
      mockTrabajadorService.update.mockResolvedValue(mockTrabajador);

      // Act
      await trabajadorController.update(mockReq, mockRes);

      // Assert
      expect(mockTrabajadorService.update).toHaveBeenCalledWith('1', updateData);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockTrabajador,
        message: 'Trabajador actualizado correctamente'
      });
    });

    it('debe retornar 404 si el trabajador a actualizar no existe', async () => {
      // Arrange
      mockReq.params = { id: '1' };
      mockReq.body = updateData;
      mockTrabajadorService.update.mockResolvedValue(null);

      // Act
      await trabajadorController.update(mockReq, mockRes);

      // Assert
      expect(mockTrabajadorService.update).toHaveBeenCalledWith('1', updateData);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Trabajador no encontrado'
      });
    });

    it('debe manejar errores al actualizar trabajador', async () => {
      // Arrange
      const errorMessage = 'Error al actualizar trabajador';
      mockReq.params = { id: '1' };
      mockReq.body = updateData;
      mockTrabajadorService.update.mockRejectedValue(new Error(errorMessage));

      // Act
      await trabajadorController.update(mockReq, mockRes);

      // Assert
      expect(mockTrabajadorService.update).toHaveBeenCalledWith('1', updateData);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });

  describe('delete', () => {
    it('debe eliminar un trabajador exitosamente', async () => {
      // Arrange
      mockReq.params = { id: '1' };
      mockTrabajadorService.delete.mockResolvedValue(true);

      // Act
      await trabajadorController.delete(mockReq, mockRes);

      // Assert
      expect(mockTrabajadorService.delete).toHaveBeenCalledWith('1');
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Trabajador eliminado correctamente'
      });
    });

    it('debe retornar 404 si el trabajador a eliminar no existe', async () => {
      // Arrange
      mockReq.params = { id: '1' };
      mockTrabajadorService.delete.mockResolvedValue(false);

      // Act
      await trabajadorController.delete(mockReq, mockRes);

      // Assert
      expect(mockTrabajadorService.delete).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Trabajador no encontrado'
      });
    });

    it('debe manejar errores al eliminar trabajador', async () => {
      // Arrange
      const errorMessage = 'Error al eliminar trabajador';
      mockReq.params = { id: '1' };
      mockTrabajadorService.delete.mockRejectedValue(new Error(errorMessage));

      // Act
      await trabajadorController.delete(mockReq, mockRes);

      // Assert
      expect(mockTrabajadorService.delete).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });

  describe('getByCuadrilla', () => {
    it('debe obtener trabajadores por cuadrilla exitosamente', async () => {
      // Arrange
      const mockTrabajadores = [
        { id: '1', nombre: 'Trabajador 1', cuadrilla_id: '1' },
        { id: '2', nombre: 'Trabajador 2', cuadrilla_id: '1' }
      ];
      mockReq.params = { cuadrilla_id: '1' };
      mockTrabajadorService.getByCuadrilla.mockResolvedValue(mockTrabajadores);

      // Act
      await trabajadorController.getByCuadrilla(mockReq, mockRes);

      // Assert
      expect(mockTrabajadorService.getByCuadrilla).toHaveBeenCalledWith('1');
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockTrabajadores,
        message: 'Trabajadores por cuadrilla obtenidos correctamente'
      });
    });

    it('debe manejar errores al obtener trabajadores por cuadrilla', async () => {
      // Arrange
      const errorMessage = 'Error al obtener trabajadores por cuadrilla';
      mockReq.params = { cuadrilla_id: '1' };
      mockTrabajadorService.getByCuadrilla.mockRejectedValue(new Error(errorMessage));

      // Act
      await trabajadorController.getByCuadrilla(mockReq, mockRes);

      // Assert
      expect(mockTrabajadorService.getByCuadrilla).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });

  describe('searchByNombre', () => {
    it('debe buscar trabajadores por nombre exitosamente', async () => {
      // Arrange
      const mockTrabajadores = [
        { id: '1', nombre: 'Juan Pérez', cuadrilla_id: '1' },
        { id: '2', nombre: 'Juan García', cuadrilla_id: '1' }
      ];
      mockReq.params = { searchTerm: 'Juan' };
      mockReq.query = { cuadrilla_id: '1' };
      mockTrabajadorService.searchByNombre.mockResolvedValue(mockTrabajadores);

      // Act
      await trabajadorController.searchByNombre(mockReq, mockRes);

      // Assert
      expect(mockTrabajadorService.searchByNombre).toHaveBeenCalledWith('1', 'Juan');
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockTrabajadores,
        message: 'Búsqueda de trabajadores completada correctamente'
      });
    });

    it('debe retornar 400 si no se proporciona cuadrilla_id', async () => {
      // Arrange
      mockReq.params = { searchTerm: 'Juan' };
      mockReq.query = {};
      mockTrabajadorService.searchByNombre.mockResolvedValue([]);

      // Act
      await trabajadorController.searchByNombre(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'El ID de la cuadrilla es requerido para la búsqueda'
      });
    });

    it('debe manejar errores al buscar trabajadores', async () => {
      // Arrange
      const errorMessage = 'Error al buscar trabajadores';
      mockReq.params = { searchTerm: 'Juan' };
      mockReq.query = { cuadrilla_id: '1' };
      mockTrabajadorService.searchByNombre.mockRejectedValue(new Error(errorMessage));

      // Act
      await trabajadorController.searchByNombre(mockReq, mockRes);

      // Assert
      expect(mockTrabajadorService.searchByNombre).toHaveBeenCalledWith('1', 'Juan');
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });
});
