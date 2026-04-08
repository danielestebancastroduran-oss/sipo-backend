import express from 'express';
import { MunicipiosController } from '../controllers/municipios.controller.js';

const router = express.Router();
const municipiosController = new MunicipiosController();

// RUTAS BÁSICAS
router.get('/', municipiosController.getAll);
router.post('/', municipiosController.create);
router.put('/:id', municipiosController.update);
router.delete('/:id', municipiosController.delete);

// RUTAS ADICIONALES (ordenadas para evitar conflictos)
router.get('/departamento/:departamento_id', municipiosController.getByDepartamento);
router.get('/capitales', municipiosController.getCapitales);
router.get('/dane/:codigo_dane', municipiosController.getByCodigoDane);
router.get('/search/:searchTerm', municipiosController.searchByNombre);

// RUTA POR ID (debe ir al final)
router.get('/:id', municipiosController.getById);

export default router;
