import express from 'express';
import { EmpresaConfigController } from '../controllers/empresa_config.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import {
  validateBody,
  validateParams,
  IdParamSchema,
  UsuarioIdParamSchema,
  EmpresaConfigCreateSchema,
  EmpresaConfigUpdateSchema
} from '../middleware/validation.js';

const router = express.Router();
const empresaConfigController = new EmpresaConfigController();

// 🔒 Rutas específicas ANTES de /:id
router.get('/usuario/:usuario_id', authMiddleware, validateParams(UsuarioIdParamSchema), empresaConfigController.getByUsuario);
router.put('/usuario/:usuario_id', authMiddleware, validateParams(UsuarioIdParamSchema), empresaConfigController.upsertByUsuario);

// CRUD BÁSICO
router.get('/', authMiddleware, empresaConfigController.getAll);
router.post('/', authMiddleware, validateBody(EmpresaConfigCreateSchema), empresaConfigController.create);
router.get('/:id', authMiddleware, validateParams(IdParamSchema), empresaConfigController.getById);
router.put('/:id', authMiddleware, validateParams(IdParamSchema), validateBody(EmpresaConfigUpdateSchema), empresaConfigController.update);
router.delete('/:id', authMiddleware, validateParams(IdParamSchema), empresaConfigController.delete);

export default router;
