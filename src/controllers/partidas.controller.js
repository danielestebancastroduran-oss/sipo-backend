import { PartidasService } from '../services/partidas.service.js';

export class PartidasController {
  constructor() {
    this.partidasService = new PartidasService();
  }

  // GET /api/partidas
  getAll = async (req, res) => {
    try {
      const partidas = await this.partidasService.getAll();
      res.json({
        success: true,
        data: partidas,
        message: 'Partidas obtenidas correctamente'
      });
    } catch (error) {
      console.error('Error en getAll partidas:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener las partidas'
      });
    }
  };

  // GET /api/partidas/:id
  getById = async (req, res) => {
    try {
      const { id } = req.params;
      const partida = await this.partidasService.getById(id);
      
      if (!partida) {
        return res.status(404).json({
          success: false,
          message: 'Partida no encontrada'
        });
      }

      res.json({
        success: true,
        data: partida,
        message: 'Partida obtenida correctamente'
      });
    } catch (error) {
      console.error('Error en getById partida:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener la partida'
      });
    }
  };

  // POST /api/partidas
  create = async (req, res) => {
    try {
      const partida = await this.partidasService.create(req.body);
      res.status(201).json({
        success: true,
        data: partida,
        message: 'Partida creada correctamente'
      });
    } catch (error) {
      console.error('Error en create partida:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error al crear la partida'
      });
    }
  };

  // PUT /api/partidas/:id
  update = async (req, res) => {
    try {
      const { id } = req.params;
      const partida = await this.partidasService.update(id, req.body);
      
      if (!partida) {
        return res.status(404).json({
          success: false,
          message: 'Partida no encontrada'
        });
      }

      res.json({
        success: true,
        data: partida,
        message: 'Partida actualizada correctamente'
      });
    } catch (error) {
      console.error('Error en update partida:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error al actualizar la partida'
      });
    }
  };

  // DELETE /api/partidas/:id
  delete = async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await this.partidasService.delete(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Partida no encontrada'
        });
      }

      res.json({
        success: true,
        message: 'Partida eliminada correctamente'
      });
    } catch (error) {
      console.error('Error en delete partida:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al eliminar la partida'
      });
    }
  };

  // GET /api/partidas/obra/:obra_id
  getByObra = async (req, res) => {
    try {
      const { obra_id } = req.params;
      const partidas = await this.partidasService.getByObra(obra_id);
      
      res.json({
        success: true,
        data: partidas,
        message: 'Partidas de la obra obtenidas correctamente'
      });
    } catch (error) {
      console.error('Error en getByObra partidas:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener las partidas de la obra'
      });
    }
  };

  // GET /api/partidas/:id/details
  getWithDetails = async (req, res) => {
    try {
      const { id } = req.params;
      const partida = await this.partidasService.getWithDetails(id);
      
      if (!partida) {
        return res.status(404).json({
          success: false,
          message: 'Partida no encontrada'
        });
      }

      res.json({
        success: true,
        data: partida,
        message: 'Partida con detalles obtenida correctamente'
      });
    } catch (error) {
      console.error('Error en getWithDetails partida:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener la partida con detalles'
      });
    }
  };

  // GET /api/partidas/obra/:obra_id/analysis
  getAnalysisByObra = async (req, res) => {
    try {
      const { obra_id } = req.params;
      const analysis = await this.partidasService.getAnalysisByObra(obra_id);
      
      res.json({
        success: true,
        data: analysis,
        message: 'Análisis de obra obtenido correctamente'
      });
    } catch (error) {
      console.error('Error en getAnalysisByObra partidas:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al generar el análisis de la obra'
      });
    }
  };
}
