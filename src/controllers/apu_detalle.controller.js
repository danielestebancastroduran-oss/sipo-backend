import { ApuDetalleService } from '../services/apu_detalle.service.js';

export class ApuDetalleController {
  constructor() {
    this.apuDetalleService = new ApuDetalleService();
  }

  // GET /api/apu-detalles
  getAll = async (req, res) => {
    try {
      const detalles = await this.apuDetalleService.getAll();
      res.json({
        success: true,
        data: detalles,
        message: 'Detalles APU obtenidos correctamente'
      });
    } catch (error) {
      console.error('Error en getAll detalles APU:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener los detalles APU'
      });
    }
  };

  // GET /api/apu-detalles/:id
  getById = async (req, res) => {
    try {
      const { id } = req.params;
      const detalle = await this.apuDetalleService.getById(id);
      
      if (!detalle) {
        return res.status(404).json({
          success: false,
          message: 'Detalle APU no encontrado'
        });
      }

      res.json({
        success: true,
        data: detalle,
        message: 'Detalle APU obtenido correctamente'
      });
    } catch (error) {
      console.error('Error en getById detalle APU:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener el detalle APU'
      });
    }
  };

  // POST /api/apu-detalles
  create = async (req, res) => {
    try {
      const detalle = await this.apuDetalleService.create(req.body);
      res.status(201).json({
        success: true,
        data: detalle,
        message: 'Detalle APU creado correctamente'
      });
    } catch (error) {
      console.error('Error en create detalle APU:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error al crear el detalle APU'
      });
    }
  };

  // PUT /api/apu-detalles/:id
  update = async (req, res) => {
    try {
      const { id } = req.params;
      const detalle = await this.apuDetalleService.update(id, req.body);
      
      if (!detalle) {
        return res.status(404).json({
          success: false,
          message: 'Detalle APU no encontrado'
        });
      }

      res.json({
        success: true,
        data: detalle,
        message: 'Detalle APU actualizado correctamente'
      });
    } catch (error) {
      console.error('Error en update detalle APU:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error al actualizar el detalle APU'
      });
    }
  };

  // DELETE /api/apu-detalles/:id
  delete = async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await this.apuDetalleService.delete(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Detalle APU no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Detalle APU eliminado correctamente'
      });
    } catch (error) {
      console.error('Error en delete detalle APU:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al eliminar el detalle APU'
      });
    }
  };

  // GET /api/apu-detalles/partida/:partida_id
  getByPartida = async (req, res) => {
    try {
      const { partida_id } = req.params;
      const detalles = await this.apuDetalleService.getByPartida(partida_id);
      
      res.json({
        success: true,
        data: detalles,
        message: 'Detalles de la partida obtenidos correctamente'
      });
    } catch (error) {
      console.error('Error en getByPartida detalles APU:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener los detalles de la partida'
      });
    }
  };

  // GET /api/apu-detalles/recurso/:recurso_id
  getByRecurso = async (req, res) => {
    try {
      const { recurso_id } = req.params;
      const detalles = await this.apuDetalleService.getByRecurso(recurso_id);
      
      res.json({
        success: true,
        data: detalles,
        message: 'Detalles por recurso obtenidos correctamente'
      });
    } catch (error) {
      console.error('Error en getByRecurso detalles APU:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener los detalles por recurso'
      });
    }
  };

  // GET /api/apu-detalles/cuadrilla/:cuadrilla_id
  getByCuadrilla = async (req, res) => {
    try {
      const { cuadrilla_id } = req.params;
      const detalles = await this.apuDetalleService.getByCuadrilla(cuadrilla_id);
      
      res.json({
        success: true,
        data: detalles,
        message: 'Detalles por cuadrilla obtenidos correctamente'
      });
    } catch (error) {
      console.error('Error en getByCuadrilla detalles APU:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener los detalles por cuadrilla'
      });
    }
  };

  // POST /api/apu-detalles/batch
  createBatch = async (req, res) => {
    try {
      const { detalles } = req.body;
      
      if (!detalles || !Array.isArray(detalles)) {
        return res.status(400).json({
          success: false,
          message: 'Se requiere un array de detalles para crear en lote'
        });
      }

      const detallesCreados = await this.apuDetalleService.createBatch(detalles);
      res.status(201).json({
        success: true,
        data: detallesCreados,
        message: 'Detalles APU creados correctamente en lote'
      });
    } catch (error) {
      console.error('Error en createBatch detalles APU:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error al crear los detalles APU en lote'
      });
    }
  };

  // GET /api/apu-detalles/partida/:partida_id/analysis
  getAnalysisByPartida = async (req, res) => {
    try {
      const { partida_id } = req.params;
      const analysis = await this.apuDetalleService.getAnalysisByPartida(partida_id);
      
      res.json({
        success: true,
        data: analysis,
        message: 'Análisis de partida obtenido correctamente'
      });
    } catch (error) {
      console.error('Error en getAnalysisByPartida detalles APU:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al generar el análisis de la partida'
      });
    }
  };

  // GET /api/apu-detalles/obra/:obra_id
  getByObra = async (req, res) => {
    try {
      const { obra_id } = req.params;
      const detalles = await this.apuDetalleService.getByObra(obra_id);
      
      res.json({
        success: true,
        data: detalles,
        message: 'Detalles de la obra obtenidos correctamente'
      });
    } catch (error) {
      console.error('Error en getByObra detalles APU:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener los detalles de la obra'
      });
    }
  };

  // GET /api/apu-detalles/obra/:obra_id/analysis
  getAnalysisByObra = async (req, res) => {
    try {
      const { obra_id } = req.params;
      const analysis = await this.apuDetalleService.getAnalysisByObra(obra_id);
      
      res.json({
        success: true,
        data: analysis,
        message: 'Análisis de obra obtenido correctamente'
      });
    } catch (error) {
      console.error('Error en getAnalysisByObra detalles APU:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al generar el análisis de la obra'
      });
    }
  };
}
