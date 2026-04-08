import express from 'express';
import { RecursosController } from '../controllers/recursos.controller.js';

const router = express.Router();
const recursosController = new RecursosController();

// RUTAS ESPECÍFICAS PRIMERO
router.get('/usuario/:usuario_id', recursosController.getByUsuario);
router.get('/usuario/:usuario_id/tipo/:tipo', recursosController.getByTipo);
router.get('/search/:searchTerm', recursosController.searchByNombre);
router.get('/:id/usage', recursosController.getWithUsage);

// CRUD BÁSICO
router.get('/', recursosController.getAll);
router.get('/:id', recursosController.getById);
router.post('/', recursosController.create);
router.put('/:id', recursosController.update);
router.delete('/:id', recursosController.delete);

export default router;
