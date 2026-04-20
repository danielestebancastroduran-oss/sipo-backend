import express from 'express';
import { ClienteController } from '../controllers/cliente.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import {
  validateBody,
  validateParams,
  IdParamSchema,
  UsuarioIdParamSchema,
  ClienteCreateSchema,
  ClienteUpdateSchema
} from '../middleware/validation.js';

const router = express.Router();
const clienteController = new ClienteController();

// 🔒 Rutas específicas ANTES de /:id
router.get('/usuario/:usuario_id', authMiddleware, validateParams(UsuarioIdParamSchema), clienteController.getByUsuario);
router.get('/nit/:nit', authMiddleware, clienteController.getByNit);
router.get('/search/:searchTerm', authMiddleware, clienteController.searchByNombre);

// CRUD BÁSICO
router.get('/', authMiddleware, clienteController.getAll);
router.post('/', authMiddleware, validateBody(ClienteCreateSchema), clienteController.create);
router.get('/:id', authMiddleware, validateParams(IdParamSchema), clienteController.getById);
router.put('/:id', authMiddleware, validateParams(IdParamSchema), validateBody(ClienteUpdateSchema), clienteController.update);
router.delete('/:id', authMiddleware, validateParams(IdParamSchema), clienteController.delete);

export default router;
