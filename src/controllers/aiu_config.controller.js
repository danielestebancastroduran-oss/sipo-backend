import { AiuConfigService } from '../services/aiu_config.service.js';

export class AiuConfigController {
  constructor() {
    this.aiuConfigService = new AiuConfigService();
  }

  // GET /api/aiu-config
  getAll = async (req, res) => {
    try {
      const configs = await this.aiuConfigService.getAll();
      res.json({
        success: true,
        data: configs,
        message: 'Configuraciones AIU obtenidas correctamente'
      });
    } catch (error) {
      console.error('Error en getAll aiu-config:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener las configuraciones AIU'
      });
    }
  };

  // GET /api/aiu-config/:id
  getById = async (req, res) => {
    try {
      const { id } = req.params;
      const config = await this.aiuConfigService.getById(id);
      
      if (!config) {
        return res.status(404).json({
          success: false,
          message: 'Configuración AIU no encontrada'
        });
      }

      res.json({
        success: true,
        data: config,
        message: 'Configuración AIU obtenida correctamente'
      });
    } catch (error) {
      console.error('Error en getById aiu-config:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener la configuración AIU'
      });
    }
  };

  // POST /api/aiu-config
  create = async (req, res) => {
    try {
      const config = await this.aiuConfigService.create(req.body);
      res.status(201).json({
        success: true,
        data: config,
        message: 'Configuración AIU creada correctamente'
      });
    } catch (error) {
      console.error('Error en create aiu-config:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error al crear la configuración AIU'
      });
    }
  };

  // PUT /api/aiu-config/:id
  update = async (req, res) => {
    try {
      const { id } = req.params;
      const config = await this.aiuConfigService.update(id, req.body);
      
      if (!config) {
        return res.status(404).json({
          success: false,
          message: 'Configuración AIU no encontrada'
        });
      }

      res.json({
        success: true,
        data: config,
        message: 'Configuración AIU actualizada correctamente'
      });
    } catch (error) {
      console.error('Error en update aiu-config:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error al actualizar la configuración AIU'
      });
    }
  };

  // DELETE /api/aiu-config/:id
  delete = async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await this.aiuConfigService.delete(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Configuración AIU no encontrada'
        });
      }

      res.json({
        success: true,
        message: 'Configuración AIU eliminada correctamente'
      });
    } catch (error) {
      console.error('Error en delete aiu-config:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al eliminar la configuración AIU'
      });
    }
  };

  // GET /api/aiu-config/usuario/:usuario_id
  getByUsuario = async (req, res) => {
    try {
      const { usuario_id } = req.params;
      const config = await this.aiuConfigService.getByUsuario(usuario_id);
      
      res.json({
        success: true,
        data: config,
        message: 'Configuración AIU del usuario obtenida correctamente'
      });
    } catch (error) {
      console.error('Error en getByUsuario aiu-config:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener la configuración AIU del usuario'
      });
    }
  };

  // PUT /api/aiu-config/usuario/:usuario_id
  upsertByUsuario = async (req, res) => {
    try {
      const { usuario_id } = req.params;
      const config = await this.aiuConfigService.upsertByUsuario(usuario_id, req.body);
      
      res.json({
        success: true,
        data: config,
        message: 'Configuración AIU guardada correctamente'
      });
    } catch (error) {
      console.error('Error en upsertByUsuario aiu-config:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error al guardar la configuración AIU'
      });
    }
  };

  // POST /api/aiu-config/calculate/:usuario_id
  calculateAiu = async (req, res) => {
    try {
      const { usuario_id } = req.params;
      const { subtotal } = req.body;
      
      if (!subtotal || subtotal < 0) {
        return res.status(400).json({
          success: false,
          message: 'El subtotal es requerido y debe ser mayor o igual a cero'
        });
      }

      const calculation = await this.aiuConfigService.calculateAiu(usuario_id, subtotal);
      
      res.json({
        success: true,
        data: calculation,
        message: 'Cálculo AIU realizado correctamente'
      });
    } catch (error) {
      console.error('Error en calculateAiu aiu-config:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al calcular AIU'
      });
    }
  };

  // GET /api/aiu-config/default
  getDefaultConfig = async (req, res) => {
    try {
      const config = await this.aiuConfigService.getDefaultConfig();
      
      res.json({
        success: true,
        data: config,
        message: 'Configuración AIU por defecto obtenida correctamente'
      });
    } catch (error) {
      console.error('Error en getDefaultConfig aiu-config:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener la configuración AIU por defecto'
      });
    }
  };
}
