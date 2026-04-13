import express from 'express';
import { CuadrillasController } from '../controllers/cuadrillas.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();
const cuadrillasController = new CuadrillasController();

// 🔒 Rutas específicas ANTES de /:id
router.get('/usuario/:usuario_id', authMiddleware, cuadrillasController.getByUsuario);
router.get('/search/:searchTerm', authMiddleware, cuadrillasController.searchByNombre);

// CRUD BÁSICO
router.get('/', authMiddleware, cuadrillasController.getAll);
router.post('/', authMiddleware, cuadrillasController.create);
router.get('/:id', authMiddleware, cuadrillasController.getById);
router.put('/:id', authMiddleware, cuadrillasController.update);
router.delete('/:id', authMiddleware, cuadrillasController.delete);
router.get('/:id/trabajadores', authMiddleware, cuadrillasController.getWithTrabajadores);
router.get('/:id/usage', authMiddleware, cuadrillasController.getWithUsage);

export default router;
