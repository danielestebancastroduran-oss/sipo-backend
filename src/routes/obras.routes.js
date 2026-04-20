import express from 'express';
import { ObrasController } from '../controllers/obras.controller.js';

const router = express.Router();
const obrasController = new ObrasController();

// 🔹 CRUD BÁSICO
router.get('/', obrasController.getAll);
router.get('/:id', obrasController.getById);
router.post('/', obrasController.create);
router.put('/:id', obrasController.update);
router.delete('/:id', obrasController.delete);

// 🔹 RUTAS ADICIONALES
router.get('/usuario/:usuario_id', obrasController.getByUsuario);
router.get('/estado/:estado', obrasController.getByEstado);
router.get('/cliente/:cliente_id', obrasController.getByCliente);
router.get('/tipo/:tipo', obrasController.getByTipo);
router.get('/:id/partidas', obrasController.getWithPartidas);

// 🔹 DASHBOARD / RESUMEN
router.get('/dashboard/resumen', obrasController.getResumen);

// 🔹 JERARQUÍA SOLICITADA (Auditoría/Corrección)
router.post('/:id/partidas/:pid/apu/materiales', obrasController.addApuMaterial);
router.post('/:id/partidas/:pid/apu/herramienta', obrasController.addApuHerramienta);
router.post('/:id/partidas/:pid/apu/equipos', obrasController.addApuEquipo);
router.delete('/:id/partidas/:pid/apu/recurso/:recursoId', obrasController.removeApuRecurso);
router.put('/:id/partidas/:pid/apu', obrasController.saveApu);

router.post('/:id/costos/admin', obrasController.addCostosAdmin);
router.delete('/:id/costos/admin/:itemId', obrasController.removeCostosAdmin);
router.get('/:id/costos', obrasController.getCostos);
router.put('/:id/costos', obrasController.updateAiuConfig);

export default router;
