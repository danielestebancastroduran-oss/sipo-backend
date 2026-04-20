import express from 'express';
import { PreferenciasPdfController } from '../controllers/preferencias_pdf.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import {
  validateBody,
  validateParams,
  IdParamSchema,
  UsuarioIdParamSchema,
  PreferenciasPdfCreateSchema,
  PreferenciasPdfUpdateSchema
} from '../middleware/validation.js';

const router = express.Router();
const preferenciasPdfController = new PreferenciasPdfController();

// 🔒 Rutas específicas ANTES de /:id
router.get('/usuario/:usuario_id', authMiddleware, validateParams(UsuarioIdParamSchema), preferenciasPdfController.getByUsuario);
router.put('/usuario/:usuario_id', authMiddleware, validateParams(UsuarioIdParamSchema), preferenciasPdfController.upsertByUsuario);

// CRUD BÁSICO
router.get('/', authMiddleware, preferenciasPdfController.getAll);
router.post('/', authMiddleware, validateBody(PreferenciasPdfCreateSchema), preferenciasPdfController.create);
router.get('/:id', authMiddleware, validateParams(IdParamSchema), preferenciasPdfController.getById);
router.put('/:id', authMiddleware, validateParams(IdParamSchema), validateBody(PreferenciasPdfUpdateSchema), preferenciasPdfController.update);
router.delete('/:id', authMiddleware, validateParams(IdParamSchema), preferenciasPdfController.delete);

export default router;
