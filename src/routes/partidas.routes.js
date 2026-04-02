import express from 'express';
import { PartidasController } from '../controllers/partidas.controller.js';

const router = express.Router();
const partidasController = new PartidasController();

// 🔹 CRUD BÁSICO
router.get('/', partidasController.getAll);
router.get('/:id', partidasController.getById);
router.post('/', partidasController.create);
router.put('/:id', partidasController.update);
router.delete('/:id', partidasController.delete);

// 🔹 RUTAS ADICIONALES
router.get('/obra/:obra_id', partidasController.getByObra);
router.get('/:id/details', partidasController.getWithDetails);
router.get('/obra/:obra_id/analysis', partidasController.getAnalysisByObra);

export default router;
