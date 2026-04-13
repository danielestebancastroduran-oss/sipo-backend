import express from 'express';
import { MunicipiosController } from '../controllers/municipios.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();
const municipiosController = new MunicipiosController();

// 🔒 Rutas específicas ANTES de /:id (ya estaban bien ordenadas)
router.get('/departamento/:departamento_id', authMiddleware, municipiosController.getByDepartamento);
router.get('/capitales', authMiddleware, municipiosController.getCapitales);
router.get('/dane/:codigo_dane', authMiddleware, municipiosController.getByCodigoDane);
router.get('/search/:searchTerm', authMiddleware, municipiosController.searchByNombre);

// CRUD BÁSICO
router.get('/', authMiddleware, municipiosController.getAll);
router.post('/', authMiddleware, municipiosController.create);
router.put('/:id', authMiddleware, municipiosController.update);
router.delete('/:id', authMiddleware, municipiosController.delete);

// RUTA POR ID (al final)
router.get('/:id', authMiddleware, municipiosController.getById);

export default router;
