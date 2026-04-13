import express from 'express';
import { ObrasController } from '../controllers/obras.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();
const obrasController = new ObrasController();

// 🔒 Rutas específicas ANTES de /:id
router.get('/usuario/:usuario_id', authMiddleware, obrasController.getByUsuario);
router.get('/estado/:estado', authMiddleware, obrasController.getByEstado);
router.get('/cliente/:cliente_id', authMiddleware, obrasController.getByCliente);
router.get('/tipo/:tipo', authMiddleware, obrasController.getByTipo);

// CRUD BÁSICO
router.get('/', authMiddleware, obrasController.getAll);
router.post('/', authMiddleware, obrasController.create);
router.get('/:id', authMiddleware, obrasController.getById);
router.put('/:id', authMiddleware, obrasController.update);
router.delete('/:id', authMiddleware, obrasController.delete);
router.get('/:id/partidas', authMiddleware, obrasController.getWithPartidas);

export default router;
