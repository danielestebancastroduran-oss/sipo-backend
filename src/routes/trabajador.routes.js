import express from 'express';
import { TrabajadorController } from '../controllers/trabajador.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();
const trabajadorController = new TrabajadorController();

// 🔒 Rutas específicas ANTES de /:id
router.get('/usuario/:usuario_id', authMiddleware, trabajadorController.getByUsuario);
router.get('/cargo/:cargo', authMiddleware, trabajadorController.getByCargo);
router.get('/identificacion/:identificacion', authMiddleware, trabajadorController.getByIdentificacion);
router.get('/search/:searchTerm', authMiddleware, trabajadorController.searchByNombre);

// CRUD BÁSICO
router.get('/', authMiddleware, trabajadorController.getAll);
router.post('/', authMiddleware, trabajadorController.create);
router.get('/:id', authMiddleware, trabajadorController.getById);
router.put('/:id', authMiddleware, trabajadorController.update);
router.delete('/:id', authMiddleware, trabajadorController.delete);
router.get('/:id/cuadrillas', authMiddleware, trabajadorController.getWithCuadrillas);

export default router;
