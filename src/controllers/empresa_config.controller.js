import { EmpresaConfigService } from '../services/empresa_config.service.js';

export class EmpresaConfigController {
  constructor() {
    this.empresaConfigService = new EmpresaConfigService();
  }

  // GET /api/empresa-config
  getAll = async (req, res) => {
    try {
      const configs = await this.empresaConfigService.getAll();
      res.json({
        success: true,
        data: configs,
        message: 'Configuraciones de empresa obtenidas correctamente'
      });
    } catch (error) {
      console.error('Error en getAll empresa-config:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener las configuraciones de empresa'
      });
    }
  };

  // GET /api/empresa-config/:id
  getById = async (req, res) => {
    try {
      const { id } = req.params;
      const config = await this.empresaConfigService.getById(id);

      if (!config) {
        return res.status(404).json({
          success: false,
          message: 'Configuración de empresa no encontrada'
        });
      }

      res.json({
        success: true,
        data: config,
        message: 'Configuración de empresa obtenida correctamente'
      });
    } catch (error) {
      console.error('Error en getById empresa-config:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener la configuración de empresa'
      });
    }
  };

  // GET /api/empresa-config/usuario/:usuario_id
  getByUsuario = async (req, res) => {
    try {
      const { usuario_id } = req.params;
      const config = await this.empresaConfigService.getByUsuario(usuario_id);

      res.json({
        success: true,
        data: config,
        message: config
          ? 'Configuración de empresa obtenida correctamente'
          : 'El usuario aún no tiene configuración de empresa'
      });
    } catch (error) {
      console.error('Error en getByUsuario empresa-config:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener la configuración de empresa'
      });
    }
  };

  // POST /api/empresa-config
  create = async (req, res) => {
    try {
      const config = await this.empresaConfigService.create(req.body);
      res.status(201).json({
        success: true,
        data: config,
        message: 'Configuración de empresa creada correctamente'
      });
    } catch (error) {
      console.error('Error en create empresa-config:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error al crear la configuración de empresa'
      });
    }
  };

  // PUT /api/empresa-config/:id
  update = async (req, res) => {
    try {
      const { id } = req.params;
      const config = await this.empresaConfigService.update(id, req.body);

      if (!config) {
        return res.status(404).json({
          success: false,
          message: 'Configuración de empresa no encontrada'
        });
      }

      res.json({
        success: true,
        data: config,
        message: 'Configuración de empresa actualizada correctamente'
      });
    } catch (error) {
      console.error('Error en update empresa-config:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error al actualizar la configuración de empresa'
      });
    }
  };

  // DELETE /api/empresa-config/:id
  delete = async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await this.empresaConfigService.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Configuración de empresa no encontrada'
        });
      }

      res.json({
        success: true,
        message: 'Configuración de empresa eliminada correctamente'
      });
    } catch (error) {
      console.error('Error en delete empresa-config:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al eliminar la configuración de empresa'
      });
    }
  };

  // PUT /api/empresa-config/usuario/:usuario_id
  upsertByUsuario = async (req, res) => {
    try {
      const { usuario_id } = req.params;
      const config = await this.empresaConfigService.upsertByUsuario(usuario_id, req.body);

      res.json({
        success: true,
        data: config,
        message: 'Configuración de empresa guardada correctamente'
      });
    } catch (error) {
      console.error('Error en upsertByUsuario empresa-config:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error al guardar la configuración de empresa'
      });
    }
  };
}
