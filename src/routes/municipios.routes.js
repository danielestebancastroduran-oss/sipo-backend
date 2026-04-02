import express from 'express';
import { MunicipiosController } from '../controllers/municipios.controller.js';

const router = express.Router();
const municipiosController = new MunicipiosController();

// 🔹 CRUD BÁSICO
router.get('/', municipiosController.getAll);
router.get('/:id', municipiosController.getById);
router.post('/', municipiosController.create);
router.put('/:id', municipiosController.update);
router.delete('/:id', municipiosController.delete);

// 🔹 RUTAS ADICIONALES
router.get('/departamento/:departamento_id', municipiosController.getByDepartamento);
router.get('/capitales', municipiosController.getCapitales);
router.get('/dane/:codigo_dane', municipiosController.getByCodigoDane);
router.get('/search/:searchTerm', municipiosController.searchByNombre);

export default router;
