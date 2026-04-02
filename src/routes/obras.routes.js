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

export default router;
