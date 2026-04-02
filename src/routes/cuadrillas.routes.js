import express from 'express';
import { CuadrillasController } from '../controllers/cuadrillas.controller.js';

const router = express.Router();
const cuadrillasController = new CuadrillasController();

// 🔹 CRUD BÁSICO
router.get('/', cuadrillasController.getAll);
router.get('/:id', cuadrillasController.getById);
router.post('/', cuadrillasController.create);
router.put('/:id', cuadrillasController.update);
router.delete('/:id', cuadrillasController.delete);

// 🔹 RUTAS ADICIONALES
router.get('/usuario/:usuario_id', cuadrillasController.getByUsuario);
router.get('/:id/trabajadores', cuadrillasController.getWithTrabajadores);
router.get('/:id/usage', cuadrillasController.getWithUsage);
router.get('/search/:searchTerm', cuadrillasController.searchByNombre);

export default router;
