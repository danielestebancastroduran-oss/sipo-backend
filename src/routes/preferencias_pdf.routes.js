import express from 'express';
import { PreferenciasPdfController } from '../controllers/preferencias_pdf.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();
const preferenciasPdfController = new PreferenciasPdfController();

// 🔒 Rutas específicas ANTES de /:id
router.get('/usuario/:usuario_id', authMiddleware, preferenciasPdfController.getByUsuario);
router.put('/usuario/:usuario_id', authMiddleware, preferenciasPdfController.upsertByUsuario);

// CRUD BÁSICO
router.get('/', authMiddleware, preferenciasPdfController.getAll);
router.post('/', authMiddleware, preferenciasPdfController.create);
router.get('/:id', authMiddleware, preferenciasPdfController.getById);
router.put('/:id', authMiddleware, preferenciasPdfController.update);
router.delete('/:id', authMiddleware, preferenciasPdfController.delete);

export default router;
