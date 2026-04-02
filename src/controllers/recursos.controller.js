import { RecursosService } from '../services/recursos.service.js';

export class RecursosController {
  constructor() {
    this.recursosService = new RecursosService();
  }

  // GET /api/recursos
  getAll = async (req, res) => {
    try {
      const recursos = await this.recursosService.getAll();
      res.json({
        success: true,
        data: recursos,
        message: 'Recursos obtenidos correctamente'
      });
    } catch (error) {
      console.error('Error en getAll recursos:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener los recursos'
      });
    }
  };

  // GET /api/recursos/:id
  getById = async (req, res) => {
    try {
      const { id } = req.params;
      const recurso = await this.recursosService.getById(id);
      
      if (!recurso) {
        return res.status(404).json({
          success: false,
          message: 'Recurso no encontrado'
        });
      }

      res.json({
        success: true,
        data: recurso,
        message: 'Recurso obtenido correctamente'
      });
    } catch (error) {
      console.error('Error en getById recurso:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener el recurso'
      });
    }
  };

  // POST /api/recursos
  create = async (req, res) => {
    try {
      const recurso = await this.recursosService.create(req.body);
      res.status(201).json({
        success: true,
        data: recurso,
        message: 'Recurso creado correctamente'
      });
    } catch (error) {
      console.error('Error en create recurso:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error al crear el recurso'
      });
    }
  };

  // PUT /api/recursos/:id
  update = async (req, res) => {
    try {
      const { id } = req.params;
      const recurso = await this.recursosService.update(id, req.body);
      
      if (!recurso) {
        return res.status(404).json({
          success: false,
          message: 'Recurso no encontrado'
        });
      }

      res.json({
        success: true,
        data: recurso,
        message: 'Recurso actualizado correctamente'
      });
    } catch (error) {
      console.error('Error en update recurso:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error al actualizar el recurso'
      });
    }
  };

  // DELETE /api/recursos/:id
  delete = async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await this.recursosService.delete(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Recurso no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Recurso eliminado correctamente'
      });
    } catch (error) {
      console.error('Error en delete recurso:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al eliminar el recurso'
      });
    }
  };

  // GET /api/recursos/usuario/:usuario_id
  getByUsuario = async (req, res) => {
    try {
      const { usuario_id } = req.params;
      const recursos = await this.recursosService.getByUsuario(usuario_id);
      
      res.json({
        success: true,
        data: recursos,
        message: 'Recursos del usuario obtenidos correctamente'
      });
    } catch (error) {
      console.error('Error en getByUsuario recursos:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener los recursos del usuario'
      });
    }
  };

  // GET /api/recursos/usuario/:usuario_id/tipo/:tipo
  getByTipo = async (req, res) => {
    try {
      const { usuario_id, tipo } = req.params;
      const recursos = await this.recursosService.getByTipo(usuario_id, tipo);
      
      res.json({
        success: true,
        data: recursos,
        message: 'Recursos por tipo obtenidos correctamente'
      });
    } catch (error) {
      console.error('Error en getByTipo recursos:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener los recursos por tipo'
      });
    }
  };

  // GET /api/recursos/search/:searchTerm
  searchByNombre = async (req, res) => {
    try {
      const { usuario_id } = req.query;
      const { searchTerm } = req.params;
      
      if (!usuario_id) {
        return res.status(400).json({
          success: false,
          message: 'El ID del usuario es requerido para la búsqueda'
        });
      }

      const recursos = await this.recursosService.searchByNombre(usuario_id, searchTerm);
      
      res.json({
        success: true,
        data: recursos,
        message: 'Búsqueda de recursos completada correctamente'
      });
    } catch (error) {
      console.error('Error en searchByNombre recursos:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al buscar recursos'
      });
    }
  };

  // GET /api/recursos/:id/usage
  getWithUsage = async (req, res) => {
    try {
      const { id } = req.params;
      const recurso = await this.recursosService.getWithUsage(id);
      
      if (!recurso) {
        return res.status(404).json({
          success: false,
          message: 'Recurso no encontrado'
        });
      }

      res.json({
        success: true,
        data: recurso,
        message: 'Recurso con estadísticas de uso obtenido correctamente'
      });
    } catch (error) {
      console.error('Error en getWithUsage recurso:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener el recurso con uso'
      });
    }
  };
}
