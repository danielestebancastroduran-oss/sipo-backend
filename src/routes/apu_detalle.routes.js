import express from 'express';
import { ApuDetalleController } from '../controllers/apu_detalle.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();
const apuDetalleController = new ApuDetalleController();

// 🔒 Rutas específicas ANTES de /:id
router.get('/partida/:partida_id', authMiddleware, apuDetalleController.getByPartida);
router.get('/partida/:partida_id/analysis', authMiddleware, apuDetalleController.getAnalysisByPartida);
router.get('/recurso/:recurso_id', authMiddleware, apuDetalleController.getByRecurso);
router.get('/cuadrilla/:cuadrilla_id', authMiddleware, apuDetalleController.getByCuadrilla);
router.get('/obra/:obra_id', authMiddleware, apuDetalleController.getByObra);
router.get('/obra/:obra_id/analysis', authMiddleware, apuDetalleController.getAnalysisByObra);
router.post('/batch', authMiddleware, apuDetalleController.createBatch);

// CRUD BÁSICO
router.get('/', authMiddleware, apuDetalleController.getAll);
router.post('/', authMiddleware, apuDetalleController.create);
router.get('/:id', authMiddleware, apuDetalleController.getById);
router.put('/:id', authMiddleware, apuDetalleController.update);
router.delete('/:id', authMiddleware, apuDetalleController.delete);

export default router;
