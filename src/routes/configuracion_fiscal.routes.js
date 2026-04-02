import express from 'express';
import { ConfiguracionFiscalController } from '../controllers/configuracion_fiscal.controller.js';

const router = express.Router();
const configuracionFiscalController = new ConfiguracionFiscalController();

// 🔹 CRUD BÁSICO
router.get('/', configuracionFiscalController.getAll);
router.get('/:id', configuracionFiscalController.getById);
router.post('/', configuracionFiscalController.create);
router.put('/:id', configuracionFiscalController.update);
router.delete('/:id', configuracionFiscalController.delete);

// 🔹 RUTAS ADICIONALES
router.get('/usuario/:usuario_id', configuracionFiscalController.getByUsuario);
router.put('/usuario/:usuario_id', configuracionFiscalController.upsertByUsuario);
router.post('/calculate-retenciones/:usuario_id', configuracionFiscalController.calculateRetenciones);
router.get('/default', configuracionFiscalController.getDefaultConfig);
router.post('/validate-nit/:usuario_id', configuracionFiscalController.validateNit);

export default router;
