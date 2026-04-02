import { ConfiguracionFiscalService } from '../services/configuracion_fiscal.service.js';

export class ConfiguracionFiscalController {
  constructor() {
    this.configuracionFiscalService = new ConfiguracionFiscalService();
  }

  // GET /api/configuracion-fiscal
  getAll = async (req, res) => {
    try {
      const configs = await this.configuracionFiscalService.getAll();
      res.json({
        success: true,
        data: configs,
        message: 'Configuraciones fiscales obtenidas correctamente'
      });
    } catch (error) {
      console.error('Error en getAll configuracion-fiscal:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener las configuraciones fiscales'
      });
    }
  };

  // GET /api/configuracion-fiscal/:id
  getById = async (req, res) => {
    try {
      const { id } = req.params;
      const config = await this.configuracionFiscalService.getById(id);
      
      if (!config) {
        return res.status(404).json({
          success: false,
          message: 'Configuración fiscal no encontrada'
        });
      }

      res.json({
        success: true,
        data: config,
        message: 'Configuración fiscal obtenida correctamente'
      });
    } catch (error) {
      console.error('Error en getById configuracion-fiscal:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener la configuración fiscal'
      });
    }
  };

  // POST /api/configuracion-fiscal
  create = async (req, res) => {
    try {
      const config = await this.configuracionFiscalService.create(req.body);
      res.status(201).json({
        success: true,
        data: config,
        message: 'Configuración fiscal creada correctamente'
      });
    } catch (error) {
      console.error('Error en create configuracion-fiscal:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error al crear la configuración fiscal'
      });
    }
  };

  // PUT /api/configuracion-fiscal/:id
  update = async (req, res) => {
    try {
      const { id } = req.params;
      const config = await this.configuracionFiscalService.update(id, req.body);
      
      if (!config) {
        return res.status(404).json({
          success: false,
          message: 'Configuración fiscal no encontrada'
        });
      }

      res.json({
        success: true,
        data: config,
        message: 'Configuración fiscal actualizada correctamente'
      });
    } catch (error) {
      console.error('Error en update configuracion-fiscal:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error al actualizar la configuración fiscal'
      });
    }
  };

  // DELETE /api/configuracion-fiscal/:id
  delete = async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await this.configuracionFiscalService.delete(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Configuración fiscal no encontrada'
        });
      }

      res.json({
        success: true,
        message: 'Configuración fiscal eliminada correctamente'
      });
    } catch (error) {
      console.error('Error en delete configuracion-fiscal:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al eliminar la configuración fiscal'
      });
    }
  };

  // GET /api/configuracion-fiscal/usuario/:usuario_id
  getByUsuario = async (req, res) => {
    try {
      const { usuario_id } = req.params;
      const config = await this.configuracionFiscalService.getByUsuario(usuario_id);
      
      res.json({
        success: true,
        data: config,
        message: 'Configuración fiscal del usuario obtenida correctamente'
      });
    } catch (error) {
      console.error('Error en getByUsuario configuracion-fiscal:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener la configuración fiscal del usuario'
      });
    }
  };

  // PUT /api/configuracion-fiscal/usuario/:usuario_id
  upsertByUsuario = async (req, res) => {
    try {
      const { usuario_id } = req.params;
      const config = await this.configuracionFiscalService.upsertByUsuario(usuario_id, req.body);
      
      res.json({
        success: true,
        data: config,
        message: 'Configuración fiscal guardada correctamente'
      });
    } catch (error) {
      console.error('Error en upsertByUsuario configuracion-fiscal:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error al guardar la configuración fiscal'
      });
    }
  };

  // POST /api/configuracion-fiscal/calculate-retenciones/:usuario_id
  calculateRetenciones = async (req, res) => {
    try {
      const { usuario_id } = req.params;
      const { baseGravable } = req.body;
      
      if (!baseGravable || baseGravable < 0) {
        return res.status(400).json({
          success: false,
          message: 'La base gravable es requerida y debe ser mayor o igual a cero'
        });
      }

      const calculation = await this.configuracionFiscalService.calculateRetenciones(usuario_id, baseGravable);
      
      res.json({
        success: true,
        data: calculation,
        message: 'Cálculo de retenciones realizado correctamente'
      });
    } catch (error) {
      console.error('Error en calculateRetenciones configuracion-fiscal:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al calcular retenciones'
      });
    }
  };

  // GET /api/configuracion-fiscal/default
  getDefaultConfig = async (req, res) => {
    try {
      const config = await this.configuracionFiscalService.getDefaultConfig();
      
      res.json({
        success: true,
        data: config,
        message: 'Configuración fiscal por defecto obtenida correctamente'
      });
    } catch (error) {
      console.error('Error en getDefaultConfig configuracion-fiscal:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener la configuración fiscal por defecto'
      });
    }
  };

  // POST /api/configuracion-fiscal/validate-nit/:usuario_id
  validateNit = async (req, res) => {
    try {
      const { usuario_id } = req.params;
      const { nit } = req.body;
      
      if (!nit) {
        return res.status(400).json({
          success: false,
          message: 'El NIT es requerido para la validación'
        });
      }

      const validation = await this.configuracionFiscalService.validateNit(usuario_id, nit);
      
      res.json({
        success: true,
        data: validation,
        message: 'Validación de NIT completada'
      });
    } catch (error) {
      console.error('Error en validateNit configuracion-fiscal:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al validar NIT'
      });
    }
  };
}
