import express from 'express';
import { DepartamentosController } from '../controllers/departamentos.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();
const departamentosController = new DepartamentosController();

// 🔒 Rutas específicas ANTES de /:id
router.get('/dane/:codigo_dane', authMiddleware, departamentosController.getByCodigoDane);
router.get('/search/:searchTerm', authMiddleware, departamentosController.searchByNombre);

// CRUD BÁSICO
router.get('/', authMiddleware, departamentosController.getAll);
router.post('/', authMiddleware, departamentosController.create);
router.get('/:id', authMiddleware, departamentosController.getById);
router.put('/:id', authMiddleware, departamentosController.update);
router.delete('/:id', authMiddleware, departamentosController.delete);
router.get('/:id/municipios', authMiddleware, departamentosController.getWithMunicipios);

export default router;
