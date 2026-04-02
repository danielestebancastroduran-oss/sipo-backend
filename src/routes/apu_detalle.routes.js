import express from 'express';
import { ApuDetalleController } from '../controllers/apu_detalle.controller.js';

const router = express.Router();
const apuDetalleController = new ApuDetalleController();

// 🔹 CRUD BÁSICO
router.get('/', apuDetalleController.getAll);
router.get('/:id', apuDetalleController.getById);
router.post('/', apuDetalleController.create);
router.put('/:id', apuDetalleController.update);
router.delete('/:id', apuDetalleController.delete);

// 🔹 RUTAS ADICIONALES
router.get('/partida/:partida_id', apuDetalleController.getByPartida);
router.get('/recurso/:recurso_id', apuDetalleController.getByRecurso);
router.get('/cuadrilla/:cuadrilla_id', apuDetalleController.getByCuadrilla);

// 🔹 RUTAS ESPECIALES
router.post('/batch', apuDetalleController.createBatch);
router.get('/partida/:partida_id/analysis', apuDetalleController.getAnalysisByPartida);
router.get('/obra/:obra_id', apuDetalleController.getByObra);
router.get('/obra/:obra_id/analysis', apuDetalleController.getAnalysisByObra);

export default router;
