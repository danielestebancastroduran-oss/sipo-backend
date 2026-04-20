import express from 'express';
import { ConfiguracionFiscalController } from '../controllers/configuracion_fiscal.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import {
  validateBody,
  validateParams,
  IdParamSchema,
  UsuarioIdParamSchema,
  ConfiguracionFiscalCreateSchema,
  ConfiguracionFiscalUpdateSchema
} from '../middleware/validation.js';

const router = express.Router();
const configuracionFiscalController = new ConfiguracionFiscalController();

// 🔒 Rutas específicas ANTES de /:id
router.get('/default', authMiddleware, configuracionFiscalController.getDefaultConfig);
router.get('/usuario/:usuario_id', authMiddleware, validateParams(UsuarioIdParamSchema), configuracionFiscalController.getByUsuario);
router.put('/usuario/:usuario_id', authMiddleware, validateParams(UsuarioIdParamSchema), configuracionFiscalController.upsertByUsuario);
router.post('/calculate-retenciones/:usuario_id', authMiddleware, validateParams(UsuarioIdParamSchema), configuracionFiscalController.calculateRetenciones);
router.post('/validate-nit/:usuario_id', authMiddleware, validateParams(UsuarioIdParamSchema), configuracionFiscalController.validateNit);

// CRUD BÁSICO
router.get('/', authMiddleware, configuracionFiscalController.getAll);
router.post('/', authMiddleware, validateBody(ConfiguracionFiscalCreateSchema), configuracionFiscalController.create);
router.get('/:id', authMiddleware, validateParams(IdParamSchema), configuracionFiscalController.getById);
router.put('/:id', authMiddleware, validateParams(IdParamSchema), validateBody(ConfiguracionFiscalUpdateSchema), configuracionFiscalController.update);
router.delete('/:id', authMiddleware, validateParams(IdParamSchema), configuracionFiscalController.delete);

export default router;
