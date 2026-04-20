import express from 'express';
import { RecursosController } from '../controllers/recursos.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import {
  validateBody,
  validateParams,
  IdParamSchema,
  UsuarioIdParamSchema,
  RecursoCreateSchema,
  RecursoUpdateSchema
} from '../middleware/validation.js';

const router = express.Router();
const recursosController = new RecursosController();

// 🔒 Rutas específicas ANTES de /:id
router.get('/usuario/:usuario_id', authMiddleware, validateParams(UsuarioIdParamSchema), recursosController.getByUsuario);
router.get('/usuario/:usuario_id/tipo/:tipo', authMiddleware, recursosController.getByTipo);
router.get('/search/:searchTerm', authMiddleware, recursosController.searchByNombre);

// CRUD BÁSICO
router.get('/', authMiddleware, recursosController.getAll);
router.post('/', authMiddleware, validateBody(RecursoCreateSchema), recursosController.create);
router.get('/:id', authMiddleware, validateParams(IdParamSchema), recursosController.getById);
router.put('/:id', authMiddleware, validateParams(IdParamSchema), validateBody(RecursoUpdateSchema), recursosController.update);
router.delete('/:id', authMiddleware, validateParams(IdParamSchema), recursosController.delete);
router.get('/:id/usage', authMiddleware, validateParams(IdParamSchema), recursosController.getWithUsage);

export default router;
