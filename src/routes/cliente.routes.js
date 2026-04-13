import express from 'express';
import { ClienteController } from '../controllers/cliente.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();
const clienteController = new ClienteController();

// 🔒 Rutas específicas ANTES de /:id
router.get('/usuario/:usuario_id', authMiddleware, clienteController.getByUsuario);
router.get('/nit/:nit', authMiddleware, clienteController.getByNit);
router.get('/search/:searchTerm', authMiddleware, clienteController.searchByNombre);

// CRUD BÁSICO
router.get('/', authMiddleware, clienteController.getAll);
router.post('/', authMiddleware, clienteController.create);
router.get('/:id', authMiddleware, clienteController.getById);
router.put('/:id', authMiddleware, clienteController.update);
router.delete('/:id', authMiddleware, clienteController.delete);

export default router;
