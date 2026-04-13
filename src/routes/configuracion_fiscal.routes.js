import express from 'express';
import { ConfiguracionFiscalController } from '../controllers/configuracion_fiscal.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();
const configuracionFiscalController = new ConfiguracionFiscalController();

// 🔒 Rutas específicas ANTES de /:id
router.get('/default', authMiddleware, configuracionFiscalController.getDefaultConfig);
router.get('/usuario/:usuario_id', authMiddleware, configuracionFiscalController.getByUsuario);
router.put('/usuario/:usuario_id', authMiddleware, configuracionFiscalController.upsertByUsuario);
router.post('/calculate-retenciones/:usuario_id', authMiddleware, configuracionFiscalController.calculateRetenciones);
router.post('/validate-nit/:usuario_id', authMiddleware, configuracionFiscalController.validateNit);

// CRUD BÁSICO
router.get('/', authMiddleware, configuracionFiscalController.getAll);
router.post('/', authMiddleware, configuracionFiscalController.create);
router.get('/:id', authMiddleware, configuracionFiscalController.getById);
router.put('/:id', authMiddleware, configuracionFiscalController.update);
router.delete('/:id', authMiddleware, configuracionFiscalController.delete);

export default router;
