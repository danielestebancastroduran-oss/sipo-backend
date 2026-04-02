import express from 'express';
import { DepartamentosController } from '../controllers/departamentos.controller.js';

const router = express.Router();
const departamentosController = new DepartamentosController();

// 🔹 CRUD BÁSICO
router.get('/', departamentosController.getAll);
router.get('/:id', departamentosController.getById);
router.post('/', departamentosController.create);
router.put('/:id', departamentosController.update);
router.delete('/:id', departamentosController.delete);

// 🔹 RUTAS ADICIONALES
router.get('/dane/:codigo_dane', departamentosController.getByCodigoDane);
router.get('/:id/municipios', departamentosController.getWithMunicipios);
router.get('/search/:searchTerm', departamentosController.searchByNombre);

export default router;
