import express from 'express';
import { ClienteController } from '../controllers/cliente.controller.js';

const router = express.Router();
const clienteController = new ClienteController();

// 🔹 CRUD BÁSICO
router.get('/', clienteController.getAll);
router.get('/:id', clienteController.getById);
router.post('/', clienteController.create);
router.put('/:id', clienteController.update);
router.delete('/:id', clienteController.delete);

// 🔹 RUTAS ADICIONALES
router.get('/usuario/:usuario_id', clienteController.getByUsuario);
router.get('/nit/:nit', clienteController.getByNit);
router.get('/search/:searchTerm', clienteController.searchByNombre);

export default router;
