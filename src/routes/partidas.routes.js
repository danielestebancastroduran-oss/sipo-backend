import express from 'express';
import { PartidasController } from '../controllers/partidas.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();
const partidasController = new PartidasController();

// 🔒 Rutas específicas ANTES de /:id
router.get('/obra/:obra_id', authMiddleware, partidasController.getByObra);
router.get('/obra/:obra_id/analysis', authMiddleware, partidasController.getAnalysisByObra);

// CRUD BÁSICO
router.get('/', authMiddleware, partidasController.getAll);
router.post('/', authMiddleware, partidasController.create);
router.get('/:id', authMiddleware, partidasController.getById);
router.put('/:id', authMiddleware, partidasController.update);
router.delete('/:id', authMiddleware, partidasController.delete);
router.get('/:id/details', authMiddleware, partidasController.getWithDetails);

export default router;
