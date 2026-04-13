import express from 'express';
import { EmpresaConfigController } from '../controllers/empresa_config.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();
const empresaConfigController = new EmpresaConfigController();

// 🔒 Rutas específicas ANTES de /:id
router.get('/usuario/:usuario_id', authMiddleware, empresaConfigController.getByUsuario);
router.put('/usuario/:usuario_id', authMiddleware, empresaConfigController.upsertByUsuario);

// CRUD BÁSICO
router.get('/', authMiddleware, empresaConfigController.getAll);
router.post('/', authMiddleware, empresaConfigController.create);
router.get('/:id', authMiddleware, empresaConfigController.getById);
router.put('/:id', authMiddleware, empresaConfigController.update);
router.delete('/:id', authMiddleware, empresaConfigController.delete);

export default router;
