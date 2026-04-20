import express from 'express';
import { PartidasController } from '../controllers/partidas.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import {
  validateBody,
  validateParams,
  IdParamSchema,
  PartidaCreateSchema,
  PartidaUpdateSchema
} from '../middleware/validation.js';

const router = express.Router();
const partidasController = new PartidasController();

// 🔒 Rutas específicas ANTES de /:id
router.get('/obra/:obra_id', authMiddleware, partidasController.getByObra);
router.get('/obra/:obra_id/analysis', authMiddleware, partidasController.getAnalysisByObra);

// CRUD BÁSICO
router.get('/', authMiddleware, partidasController.getAll);
router.post('/', authMiddleware, validateBody(PartidaCreateSchema), partidasController.create);
router.get('/:id', authMiddleware, validateParams(IdParamSchema), partidasController.getById);
router.put('/:id', authMiddleware, validateParams(IdParamSchema), validateBody(PartidaUpdateSchema), partidasController.update);
router.delete('/:id', authMiddleware, validateParams(IdParamSchema), partidasController.delete);
router.get('/:id/details', authMiddleware, validateParams(IdParamSchema), partidasController.getWithDetails);

export default router;
