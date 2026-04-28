import { CuadrillasService } from '../services/cuadrillas.service.js';
import { CuadrillaModel } from '../models/cuadrillas.model.js';
import logger from '../utils/logger.js';
import { formatPaginatedResponse } from '../utils/pagination.helper.js';

export class CuadrillasController {
  constructor() {
    this.cuadrillasService = new CuadrillasService();
  }

  // GET /api/cuadrillas
  getAll = async (req, res) => {
    try {
      const { limit, offset, order } = req.query;
      const { data, count } = await this.cuadrillasService.getAll({ limit, offset, order });

      res.json(formatPaginatedResponse(
        data.map(c => CuadrillaModel.fromDatabase(c)),
        count,
        limit,
        offset
      ));
    } catch (error) {
      logger.error('Error en getAll cuadrillas:', { error: error.message });
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener las cuadrillas'
      });
    }
  };

  // GET /api/cuadrillas/:id
  getById = async (req, res) => {
    try {
      const { id } = req.params;
      const cuadrilla = await this.cuadrillasService.getById(id);
      
      if (!cuadrilla) {
        return res.status(404).json({
          success: false,
          message: 'Cuadrilla no encontrada'
        });
      }

      res.json({
        success: true,
        data: CuadrillaModel.fromDatabase(cuadrilla),
        message: 'Cuadrilla obtenida correctamente'
      });
    } catch (error) {
      logger.error('Error en getById cuadrilla:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener la cuadrilla'
      });
    }
  };

  // POST /api/cuadrillas
  create = async (req, res) => {
    try {
      const cuadrilla = await this.cuadrillasService.create(req.body);
      res.status(201).json({
        success: true,
        data: CuadrillaModel.fromDatabase(cuadrilla),
        message: 'Cuadrilla creada correctamente'
      });
    } catch (error) {
      logger.error('Error en create cuadrilla:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error al crear la cuadrilla'
      });
    }
  };

  // PUT /api/cuadrillas/:id
  update = async (req, res) => {
    try {
      const { id } = req.params;
      const cuadrilla = await this.cuadrillasService.update(id, req.body);
      
      if (!cuadrilla) {
        return res.status(404).json({
          success: false,
          message: 'Cuadrilla no encontrada'
        });
      }

      res.json({
        success: true,
        data: CuadrillaModel.fromDatabase(cuadrilla),
        message: 'Cuadrilla actualizada correctamente'
      });
    } catch (error) {
      logger.error('Error en update cuadrilla:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error al actualizar la cuadrilla'
      });
    }
  };

  // DELETE /api/cuadrillas/:id
  delete = async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await this.cuadrillasService.delete(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Cuadrilla no encontrada'
        });
      }

      res.json({
        success: true,
        message: 'Cuadrilla eliminada correctamente'
      });
    } catch (error) {
      logger.error('Error en delete cuadrilla:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al eliminar la cuadrilla'
      });
    }
  };

  // GET /api/cuadrillas/usuario/:usuario_id
  getByUsuario = async (req, res) => {
    try {
      const { usuario_id } = req.params;
      const { limit, offset, order } = req.query;
      const { data, count } = await this.cuadrillasService.getByUsuario(usuario_id, { limit, offset, order });
      
      res.json(formatPaginatedResponse(
        data.map(c => CuadrillaModel.fromDatabase(c)),
        count,
        limit,
        offset
      ));
    } catch (error) {
      logger.error('Error en getByUsuario cuadrillas:', { error: error.message });
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener las cuadrillas del usuario'
      });
    }
  };

  // GET /api/cuadrillas/:id/trabajadores
  getWithTrabajadores = async (req, res) => {
    try {
      const { id } = req.params;
      const cuadrillaRaw = await this.cuadrillasService.getWithTrabajadores(id);
      
      if (!cuadrillaRaw) {
        return res.status(404).json({
          success: false,
          message: 'Cuadrilla no encontrada'
        });
      }

      const cuadrilla = CuadrillaModel.fromDatabase(cuadrillaRaw);
      // Mantener los trabajadores en el objeto transformado
      cuadrilla.cuadrilla_trabajadores = cuadrillaRaw.cuadrilla_trabajadores;
      cuadrilla.total_trabajadores = cuadrillaRaw.total_trabajadores;
      cuadrilla.total_salario_diario = cuadrillaRaw.total_salario_diario;

      res.json({
        success: true,
        data: cuadrilla,
        message: 'Cuadrilla con trabajadores obtenida correctamente'
      });
    } catch (error) {
      logger.error('Error en getWithTrabajadores cuadrilla:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener la cuadrilla con trabajadores'
      });
    }
  };

  // GET /api/cuadrillas/:id/usage
  getWithUsage = async (req, res) => {
    try {
      const { id } = req.params;
      const cuadrillaRaw = await this.cuadrillasService.getWithUsage(id);
      
      if (!cuadrillaRaw) {
        return res.status(404).json({
          success: false,
          message: 'Cuadrilla no encontrada'
        });
      }

      const cuadrilla = CuadrillaModel.fromDatabase(cuadrillaRaw);
      cuadrilla.apu_detalle = cuadrillaRaw.apu_detalle;
      cuadrilla.total_usos = cuadrillaRaw.total_usos;
      cuadrilla.total_valor = cuadrillaRaw.total_valor;

      res.json({
        success: true,
        data: cuadrilla,
        message: 'Cuadrilla con estadísticas de uso obtenida correctamente'
      });
    } catch (error) {
      logger.error('Error en getWithUsage cuadrilla:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener la cuadrilla con uso'
      });
    }
  };

  // GET /api/cuadrillas/search/:searchTerm
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

      const data = await this.cuadrillasService.searchByNombre(usuario_id, searchTerm);
      
      res.json({
        success: true,
        data: data.map(c => CuadrillaModel.fromDatabase(c)),
        message: 'Búsqueda de cuadrillas completada correctamente'
      });
    } catch (error) {
      logger.error('Error en searchByNombre cuadrillas:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al buscar cuadrillas'
      });
    }
  };
}
