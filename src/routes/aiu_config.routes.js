import express from 'express';
import { AiuConfigController } from '../controllers/aiu_config.controller.js';

const router = express.Router();
const aiuConfigController = new AiuConfigController();

// 🔹 CRUD BÁSICO
router.get('/', aiuConfigController.getAll);
router.get('/:id', aiuConfigController.getById);
router.post('/', aiuConfigController.create);
router.put('/:id', aiuConfigController.update);
router.delete('/:id', aiuConfigController.delete);

// 🔹 RUTAS ADICIONALES
router.get('/usuario/:usuario_id', aiuConfigController.getByUsuario);
router.put('/usuario/:usuario_id', aiuConfigController.upsertByUsuario);
router.post('/calculate/:usuario_id', aiuConfigController.calculateAiu);
router.get('/default', aiuConfigController.getDefaultConfig);

export default router;
