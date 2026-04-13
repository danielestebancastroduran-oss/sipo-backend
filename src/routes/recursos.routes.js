import express from 'express';
import { RecursosController } from '../controllers/recursos.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();
const recursosController = new RecursosController();

// 🔒 Rutas específicas ANTES de /:id (ya estaban bien ordenadas)
router.get('/usuario/:usuario_id', authMiddleware, recursosController.getByUsuario);
router.get('/usuario/:usuario_id/tipo/:tipo', authMiddleware, recursosController.getByTipo);
router.get('/search/:searchTerm', authMiddleware, recursosController.searchByNombre);

// CRUD BÁSICO
router.get('/', authMiddleware, recursosController.getAll);
router.post('/', authMiddleware, recursosController.create);
router.get('/:id', authMiddleware, recursosController.getById);
router.put('/:id', authMiddleware, recursosController.update);
router.delete('/:id', authMiddleware, recursosController.delete);
router.get('/:id/usage', authMiddleware, recursosController.getWithUsage);

export default router;
