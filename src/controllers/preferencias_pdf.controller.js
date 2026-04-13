import { PreferenciasPdfService } from '../services/preferencias_pdf.service.js';

export class PreferenciasPdfController {
  constructor() {
    this.preferenciasPdfService = new PreferenciasPdfService();
  }

  // GET /api/preferencias-pdf
  getAll = async (req, res) => {
    try {
      const prefs = await this.preferenciasPdfService.getAll();
      res.json({
        success: true,
        data: prefs,
        message: 'Preferencias PDF obtenidas correctamente'
      });
    } catch (error) {
      console.error('Error en getAll preferencias-pdf:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener las preferencias PDF'
      });
    }
  };

  // GET /api/preferencias-pdf/:id
  getById = async (req, res) => {
    try {
      const { id } = req.params;
      const prefs = await this.preferenciasPdfService.getById(id);

      if (!prefs) {
        return res.status(404).json({
          success: false,
          message: 'Preferencias PDF no encontradas'
        });
      }

      res.json({
        success: true,
        data: prefs,
        message: 'Preferencias PDF obtenidas correctamente'
      });
    } catch (error) {
      console.error('Error en getById preferencias-pdf:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener las preferencias PDF'
      });
    }
  };

  // GET /api/preferencias-pdf/usuario/:usuario_id
  getByUsuario = async (req, res) => {
    try {
      const { usuario_id } = req.params;
      const prefs = await this.preferenciasPdfService.getOrDefault(usuario_id);

      res.json({
        success: true,
        data: prefs,
        message: 'Preferencias PDF del usuario obtenidas correctamente'
      });
    } catch (error) {
      console.error('Error en getByUsuario preferencias-pdf:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener las preferencias PDF del usuario'
      });
    }
  };

  // POST /api/preferencias-pdf
  create = async (req, res) => {
    try {
      const prefs = await this.preferenciasPdfService.create(req.body);
      res.status(201).json({
        success: true,
        data: prefs,
        message: 'Preferencias PDF creadas correctamente'
      });
    } catch (error) {
      console.error('Error en create preferencias-pdf:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error al crear las preferencias PDF'
      });
    }
  };

  // PUT /api/preferencias-pdf/:id
  update = async (req, res) => {
    try {
      const { id } = req.params;
      const prefs = await this.preferenciasPdfService.update(id, req.body);

      if (!prefs) {
        return res.status(404).json({
          success: false,
          message: 'Preferencias PDF no encontradas'
        });
      }

      res.json({
        success: true,
        data: prefs,
        message: 'Preferencias PDF actualizadas correctamente'
      });
    } catch (error) {
      console.error('Error en update preferencias-pdf:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error al actualizar las preferencias PDF'
      });
    }
  };

  // DELETE /api/preferencias-pdf/:id
  delete = async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await this.preferenciasPdfService.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Preferencias PDF no encontradas'
        });
      }

      res.json({
        success: true,
        message: 'Preferencias PDF eliminadas correctamente'
      });
    } catch (error) {
      console.error('Error en delete preferencias-pdf:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al eliminar las preferencias PDF'
      });
    }
  };

  // PUT /api/preferencias-pdf/usuario/:usuario_id
  upsertByUsuario = async (req, res) => {
    try {
      const { usuario_id } = req.params;
      const prefs = await this.preferenciasPdfService.upsertByUsuario(usuario_id, req.body);

      res.json({
        success: true,
        data: prefs,
        message: 'Preferencias PDF guardadas correctamente'
      });
    } catch (error) {
      console.error('Error en upsertByUsuario preferencias-pdf:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error al guardar las preferencias PDF'
      });
    }
  };
}
