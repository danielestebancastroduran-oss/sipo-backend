import { ClienteService } from '../services/cliente.service.js';
import logger from '../utils/logger.js';
import { formatPaginatedResponse } from '../utils/pagination.helper.js';

export class ClienteController {
  constructor() {
    this.clienteService = new ClienteService();
  }

  // GET /api/clientes
  getAll = async (req, res) => {
    try {
      const { limit, offset, order } = req.query;
      const { data, count } = await this.clienteService.getAll({ limit, offset, order });

      res.json(formatPaginatedResponse(
        data,
        count,
        limit,
        offset
      ));
    } catch (error) {
      logger.error('Error en getAll clientes:', { error: error.message });
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener los clientes'
      });
    }
  };

  // GET /api/clientes/:id
  getById = async (req, res) => {
    try {
      const { id } = req.params;
      const cliente = await this.clienteService.getById(id);
      
      if (!cliente) {
        return res.status(404).json({
          success: false,
          message: 'Cliente no encontrado'
        });
      }

      res.json({
        success: true,
        data: cliente,
        message: 'Cliente obtenido correctamente'
      });
    } catch (error) {
      logger.error('Error en getById cliente:', { error: error.message });
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener el cliente'
      });
    }
  };

  // POST /api/clientes
  create = async (req, res) => {
    try {
      const cliente = await this.clienteService.create(req.body);
      res.status(201).json({
        success: true,
        data: cliente,
        message: 'Cliente creado correctamente'
      });
    } catch (error) {
      logger.error('Error en create cliente:', { error: error.message });
      res.status(400).json({
        success: false,
        message: error.message || 'Error al crear el cliente'
      });
    }
  };

  // PUT /api/clientes/:id
  update = async (req, res) => {
    try {
      const { id } = req.params;
      const cliente = await this.clienteService.update(id, req.body);
      
      if (!cliente) {
        return res.status(404).json({
          success: false,
          message: 'Cliente no encontrado'
        });
      }

      res.json({
        success: true,
        data: cliente,
        message: 'Cliente actualizado correctamente'
      });
    } catch (error) {
      logger.error('Error en update cliente:', { error: error.message });
      res.status(400).json({
        success: false,
        message: error.message || 'Error al actualizar el cliente'
      });
    }
  };

  // DELETE /api/clientes/:id
  delete = async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await this.clienteService.delete(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Cliente no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Cliente eliminado correctamente'
      });
    } catch (error) {
      logger.error('Error en delete cliente:', { error: error.message });
      res.status(500).json({
        success: false,
        message: error.message || 'Error al eliminar el cliente'
      });
    }
  };

  // GET /api/clientes/usuario/:usuario_id
  getByUsuario = async (req, res) => {
    try {
      const { usuario_id } = req.params;
      const { limit, offset, order } = req.query;
      const { data, count } = await this.clienteService.getByUsuario(usuario_id, { limit, offset, order });
      
      res.json(formatPaginatedResponse(
        data,
        count,
        limit,
        offset
      ));
    } catch (error) {
      logger.error('Error en getByUsuario clientes:', { error: error.message });
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener los clientes del usuario'
      });
    }
  };

  // GET /api/clientes/nit/:nit
  getByNit = async (req, res) => {
    try {
      const { nit } = req.params;
      const cliente = await this.clienteService.getByNit(nit);
      
      res.json({
        success: true,
        data: cliente,
        message: 'Cliente por NIT obtenido correctamente'
      });
    } catch (error) {
      logger.error('Error en getByNit cliente:', { error: error.message });
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener el cliente por NIT'
      });
    }
  };

  // GET /api/clientes/search/:searchTerm
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

      const clientes = await this.clienteService.searchByNombre(usuario_id, searchTerm);
      
      res.json({
        success: true,
        data: clientes,
        message: 'Búsqueda de clientes completada correctamente'
      });
    } catch (error) {
      logger.error('Error en searchByNombre clientes:', { error: error.message });
      res.status(500).json({
        success: false,
        message: error.message || 'Error al buscar clientes'
      });
    }
  };
}
