import { ObrasService } from '../services/obras.service.js';
import logger from '../utils/logger.js';
import { formatPaginatedResponse } from '../utils/pagination.helper.js';

export class ObrasController {
  constructor() {
    this.obrasService = new ObrasService();
  }

  // GET /api/obras
  getAll = async (req, res) => {
    try {
      const { limit, offset, order } = req.query;
      const { data, count } = await this.obrasService.getAll({ limit, offset, order });

      res.json(formatPaginatedResponse(
        data,
        count,
        limit,
        offset
      ));
    } catch (error) {
      logger.error('Error en getAll obras:', { error: error.message });
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener las obras'
      });
    }
  };

  // GET /api/obras/:id
  getById = async (req, res) => {
    try {
      const { id } = req.params;
      const obra = await this.obrasService.getById(id);
      
      if (!obra) {
        return res.status(404).json({
          success: false,
          message: 'Obra no encontrada'
        });
      }

      res.json({
        success: true,
        data: obra,
        message: 'Obra obtenida correctamente'
      });
    } catch (error) {
      logger.error('Error en getById obra:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener la obra'
      });
    }
  };

  // POST /api/obras
  create = async (req, res) => {
    try {
      const obra = await this.obrasService.create(req.body);
      res.status(201).json({
        success: true,
        data: obra,
        message: 'Obra creada correctamente'
      });
    } catch (error) {
      logger.error('Error en create obra:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error al crear la obra'
      });
    }
  };

  // PUT /api/obras/:id
  update = async (req, res) => {
    try {
      const { id } = req.params;
      const obra = await this.obrasService.update(id, req.body);
      
      if (!obra) {
        return res.status(404).json({
          success: false,
          message: 'Obra no encontrada'
        });
      }

      res.json({
        success: true,
        data: obra,
        message: 'Obra actualizada correctamente'
      });
    } catch (error) {
      logger.error('Error en update obra:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error al actualizar la obra'
      });
    }
  };

  // DELETE /api/obras/:id
  delete = async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await this.obrasService.delete(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Obra no encontrada'
        });
      }

      res.json({
        success: true,
        message: 'Obra eliminada correctamente'
      });
    } catch (error) {
      logger.error('Error en delete obra:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al eliminar la obra'
      });
    }
  };

  // GET /api/obras/usuario/:usuario_id
  getByUsuario = async (req, res) => {
    try {
      const { usuario_id } = req.params;
      const { limit, offset, order } = req.query;
      const { data, count } = await this.obrasService.getByUsuario(usuario_id, { limit, offset, order });
      
      res.json(formatPaginatedResponse(
        data,
        count,
        limit,
        offset
      ));
    } catch (error) {
      logger.error('Error en getByUsuario obras:', { error: error.message });
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener las obras del usuario'
      });
    }
  };

  // GET /api/obras/estado/:estado
  getByEstado = async (req, res) => {
    try {
      const { estado } = req.params;
      const obras = await this.obrasService.getByEstado(estado);
      
      res.json({
        success: true,
        data: obras,
        message: 'Obras por estado obtenidas correctamente'
      });
    } catch (error) {
      logger.error('Error en getByEstado obras:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener las obras por estado'
      });
    }
  };

  // GET /api/obras/cliente/:cliente_id
  getByCliente = async (req, res) => {
    try {
      const { cliente_id } = req.params;
      const obras = await this.obrasService.getByCliente(cliente_id);
      
      res.json({
        success: true,
        data: obras,
        message: 'Obras del cliente obtenidas correctamente'
      });
    } catch (error) {
      logger.error('Error en getByCliente obras:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener las obras del cliente'
      });
    }
  };

  // GET /api/obras/tipo/:tipo
  getByTipo = async (req, res) => {
    try {
      const { tipo } = req.params;
      const obras = await this.obrasService.getByTipo(tipo);
      
      res.json({
        success: true,
        data: obras,
        message: 'Obras por tipo obtenidas correctamente'
      });
    } catch (error) {
      logger.error('Error en getByTipo obras:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener las obras por tipo'
      });
    }
  };

  // GET /api/obras/:id/partidas
  getWithPartidas = async (req, res) => {
    try {
      const { id } = req.params;
      const obra = await this.obrasService.getWithPartidas(id);
      
      if (!obra) {
        return res.status(404).json({
          success: false,
          message: 'Obra no encontrada'
        });
      }

      res.json({
        success: true,
        data: obra,
        message: 'Obra con partidas obtenida correctamente'
      });
    } catch (error) {
      logger.error('Error en getWithPartidas obra:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener la obra con partidas'
      });
    }
  };
}
