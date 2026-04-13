import express from 'express';
import { AiuConfigController } from '../controllers/aiu_config.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();
const aiuConfigController = new AiuConfigController();

// 🔒 Rutas específicas ANTES de /:id
router.get('/default', authMiddleware, aiuConfigController.getDefaultConfig);
router.get('/usuario/:usuario_id', authMiddleware, aiuConfigController.getByUsuario);
router.put('/usuario/:usuario_id', authMiddleware, aiuConfigController.upsertByUsuario);
router.post('/calculate/:usuario_id', authMiddleware, aiuConfigController.calculateAiu);

// CRUD BÁSICO
router.get('/', authMiddleware, aiuConfigController.getAll);
router.post('/', authMiddleware, aiuConfigController.create);
router.get('/:id', authMiddleware, aiuConfigController.getById);
router.put('/:id', authMiddleware, aiuConfigController.update);
router.delete('/:id', authMiddleware, aiuConfigController.delete);

export default router;
