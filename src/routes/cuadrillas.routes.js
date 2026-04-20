import express from 'express';
import { CuadrillasController } from '../controllers/cuadrillas.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import {
  validateBody,
  validateParams,
  IdParamSchema,
  UsuarioIdParamSchema,
  CuadrillaCreateSchema,
  CuadrillaUpdateSchema
} from '../middleware/validation.js';

const router = express.Router();
const cuadrillasController = new CuadrillasController();

// 🔒 Rutas específicas ANTES de /:id
router.get('/usuario/:usuario_id', authMiddleware, validateParams(UsuarioIdParamSchema), cuadrillasController.getByUsuario);
router.get('/search/:searchTerm', authMiddleware, cuadrillasController.searchByNombre);

// CRUD BÁSICO
router.get('/', authMiddleware, cuadrillasController.getAll);
router.post('/', authMiddleware, validateBody(CuadrillaCreateSchema), cuadrillasController.create);
router.get('/:id', authMiddleware, validateParams(IdParamSchema), cuadrillasController.getById);
router.put('/:id', authMiddleware, validateParams(IdParamSchema), validateBody(CuadrillaUpdateSchema), cuadrillasController.update);
router.delete('/:id', authMiddleware, validateParams(IdParamSchema), cuadrillasController.delete);
router.get('/:id/trabajadores', authMiddleware, validateParams(IdParamSchema), cuadrillasController.getWithTrabajadores);
router.get('/:id/usage', authMiddleware, validateParams(IdParamSchema), cuadrillasController.getWithUsage);

export default router;
