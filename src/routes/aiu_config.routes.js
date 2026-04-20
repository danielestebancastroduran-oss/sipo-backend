import express from 'express';
import { AiuConfigController } from '../controllers/aiu_config.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import {
  validateBody,
  validateParams,
  IdParamSchema,
  UsuarioIdParamSchema,
  AiuConfigCreateSchema,
  AiuConfigUpdateSchema
} from '../middleware/validation.js';

const router = express.Router();
const aiuConfigController = new AiuConfigController();

// 🔒 Rutas específicas ANTES de /:id
router.get('/default', authMiddleware, aiuConfigController.getDefaultConfig);
router.get('/usuario/:usuario_id', authMiddleware, validateParams(UsuarioIdParamSchema), aiuConfigController.getByUsuario);
router.put('/usuario/:usuario_id', authMiddleware, validateParams(UsuarioIdParamSchema), aiuConfigController.upsertByUsuario);
router.post('/calculate/:usuario_id', authMiddleware, validateParams(UsuarioIdParamSchema), aiuConfigController.calculateAiu);

// CRUD BÁSICO
router.get('/', authMiddleware, aiuConfigController.getAll);
router.post('/', authMiddleware, validateBody(AiuConfigCreateSchema), aiuConfigController.create);
router.get('/:id', authMiddleware, validateParams(IdParamSchema), aiuConfigController.getById);
router.put('/:id', authMiddleware, validateParams(IdParamSchema), validateBody(AiuConfigUpdateSchema), aiuConfigController.update);
router.delete('/:id', authMiddleware, validateParams(IdParamSchema), aiuConfigController.delete);

export default router;
