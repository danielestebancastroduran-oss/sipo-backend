import express from 'express';
import { TrabajadorController } from '../controllers/trabajador.controller.js';

const router = express.Router();
const trabajadorController = new TrabajadorController();

// 🔹 CRUD BÁSICO
router.get('/', trabajadorController.getAll);
router.get('/:id', trabajadorController.getById);
router.post('/', trabajadorController.create);
router.put('/:id', trabajadorController.update);
router.delete('/:id', trabajadorController.delete);

// 🔹 RUTAS ADICIONALES
router.get('/usuario/:usuario_id', trabajadorController.getByUsuario);
router.get('/cargo/:cargo', trabajadorController.getByCargo);
router.get('/identificacion/:identificacion', trabajadorController.getByIdentificacion);
router.get('/usuario/:usuario_id/cargo/:cargo', trabajadorController.getByCargo);
router.get('/search/:searchTerm', trabajadorController.searchByNombre);
router.get('/:id/cuadrillas', trabajadorController.getWithCuadrillas);

export default router;
