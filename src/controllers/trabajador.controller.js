import { TrabajadorService } from '../services/trabajador.service.js';

export class TrabajadorController {
  constructor() {
    this.trabajadorService = new TrabajadorService();
  }

  // GET /api/trabajadores
  getAll = async (req, res) => {
    try {
      const trabajadores = await this.trabajadorService.getAll();
      res.json({
        success: true,
        data: trabajadores,
        message: 'Trabajadores obtenidos correctamente'
      });
    } catch (error) {
      console.error('Error en getAll trabajadores:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener los trabajadores'
      });
    }
  };

  // GET /api/trabajadores/:id
  getById = async (req, res) => {
    try {
      const { id } = req.params;
      const trabajador = await this.trabajadorService.getById(id);
      
      if (!trabajador) {
        return res.status(404).json({
          success: false,
          message: 'Trabajador no encontrado'
        });
      }

      res.json({
        success: true,
        data: trabajador,
        message: 'Trabajador obtenido correctamente'
      });
    } catch (error) {
      console.error('Error en getById trabajador:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener el trabajador'
      });
    }
  };

  // POST /api/trabajadores
  create = async (req, res) => {
    try {
      const trabajador = await this.trabajadorService.create(req.body);
      res.status(201).json({
        success: true,
        data: trabajador,
        message: 'Trabajador creado correctamente'
      });
    } catch (error) {
      console.error('Error en create trabajador:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error al crear el trabajador'
      });
    }
  };

  // PUT /api/trabajadores/:id
  update = async (req, res) => {
    try {
      const { id } = req.params;
      const trabajador = await this.trabajadorService.update(id, req.body);
      
      if (!trabajador) {
        return res.status(404).json({
          success: false,
          message: 'Trabajador no encontrado'
        });
      }

      res.json({
        success: true,
        data: trabajador,
        message: 'Trabajador actualizado correctamente'
      });
    } catch (error) {
      console.error('Error en update trabajador:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error al actualizar el trabajador'
      });
    }
  };

  // DELETE /api/trabajadores/:id
  delete = async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await this.trabajadorService.delete(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Trabajador no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Trabajador eliminado correctamente'
      });
    } catch (error) {
      console.error('Error en delete trabajador:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al eliminar el trabajador'
      });
    }
  };

  // GET /api/trabajadores/usuario/:usuario_id
  getByUsuario = async (req, res) => {
    try {
      const { usuario_id } = req.params;
      const trabajadores = await this.trabajadorService.getByUsuario(usuario_id);
      
      res.json({
        success: true,
        data: trabajadores,
        message: 'Trabajadores del usuario obtenidos correctamente'
      });
    } catch (error) {
      console.error('Error en getByUsuario trabajadores:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener los trabajadores del usuario'
      });
    }
  };

  // GET /api/trabajadores/cargo/:cargo
  getByCargo = async (req, res) => {
    try {
      const { cargo } = req.params;
      const trabajadores = await this.trabajadorService.getByCargo(cargo);
      
      res.json({
        success: true,
        data: trabajadores,
        message: 'Trabajadores por cargo obtenidos correctamente'
      });
    } catch (error) {
      console.error('Error en getByCargo trabajadores:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener los trabajadores por cargo'
      });
    }
  };

  // GET /api/trabajadores/identificacion/:identificacion
  getByIdentificacion = async (req, res) => {
    try {
      const { usuario_id } = req.query;
      const { identificacion } = req.params;
      
      if (!usuario_id) {
        return res.status(400).json({
          success: false,
          message: 'El ID del usuario es requerido'
        });
      }

      const trabajador = await this.trabajadorService.getByIdentificacion(usuario_id, identificacion);
      
      res.json({
        success: true,
        data: trabajador,
        message: 'Trabajador por identificación obtenido correctamente'
      });
    } catch (error) {
      console.error('Error en getByIdentificacion trabajador:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener el trabajador por identificación'
      });
    }
  };

  // GET /api/trabajadores/usuario/:usuario_id/cargo/:cargo
  getByCargo = async (req, res) => {
    try {
      const { usuario_id, cargo } = req.params;
      const trabajadores = await this.trabajadorService.getByCargo(usuario_id, cargo);
      
      res.json({
        success: true,
        data: trabajadores,
        message: 'Trabajadores por cargo obtenidos correctamente'
      });
    } catch (error) {
      console.error('Error en getByCargo trabajadores:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener los trabajadores por cargo'
      });
    }
  };

  // GET /api/trabajadores/search/:searchTerm
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

      const trabajadores = await this.trabajadorService.searchByNombre(usuario_id, searchTerm);
      
      res.json({
        success: true,
        data: trabajadores,
        message: 'Búsqueda de trabajadores completada correctamente'
      });
    } catch (error) {
      console.error('Error en searchByNombre trabajadores:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al buscar trabajadores'
      });
    }
  };

  // GET /api/trabajadores/:id/cuadrillas
  getWithCuadrillas = async (req, res) => {
    try {
      const { id } = req.params;
      const trabajador = await this.trabajadorService.getWithCuadrillas(id);
      
      if (!trabajador) {
        return res.status(404).json({
          success: false,
          message: 'Trabajador no encontrado'
        });
      }

      res.json({
        success: true,
        data: trabajador,
        message: 'Trabajador con cuadrillas obtenido correctamente'
      });
    } catch (error) {
      console.error('Error en getWithCuadrillas trabajador:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener el trabajador con cuadrillas'
      });
    }
  };
}
