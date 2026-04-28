import { CostosIndirectosService } from '../services/costos_indirectos.service.js';
import logger from '../utils/logger.js';

export class CostosIndirectosController {
  constructor() {
    this.costosService = new CostosIndirectosService();
  }

  getByObra = async (req, res) => {
    try {
      const { id } = req.params;
      const costos = await this.costosService.getByObra(id);
      res.json({
        success: true,
        data: costos
      });
    } catch (error) {
      logger.error('Error en getByObra costos:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  };

  createAdminItem = async (req, res) => {
    try {
      const { id } = req.params; // obra_id
      const item = await this.costosService.create({
        ...req.body,
        obra_id: id,
        tipo: 'administracion'
      });
      res.status(201).json({
        success: true,
        data: item
      });
    } catch (error) {
      logger.error('Error en createAdminItem:', error);
      res.status(400).json({ success: false, message: error.message });
    }
  };

  deleteAdminItem = async (req, res) => {
    try {
      const { itemId } = req.params;
      await this.costosService.delete(itemId);
      res.json({
        success: true,
        message: 'Ítem eliminado correctamente'
      });
    } catch (error) {
      logger.error('Error en deleteAdminItem:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  };

  updateAIU = async (req, res) => {
    try {
      const { id } = req.params;
      const { imprevistos, utilidad, retefuente, ica, iva } = req.body;
      const result = await this.costosService.upsertAIU(id, { imprevistos, utilidad, retefuente, ica, iva });
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      logger.error('Error en updateAIU:', error);
      res.status(400).json({ success: false, message: error.message });
    }
  };
}
