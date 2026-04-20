import express from 'express';
import { TrabajadorController } from '../controllers/trabajador.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import {
  validateBody,
  validateParams,
  IdParamSchema,
  UsuarioIdParamSchema,
  TrabajadorCreateSchema,
  TrabajadorUpdateSchema
} from '../middleware/validation.js';

const router = express.Router();
const trabajadorController = new TrabajadorController();

// 🔒 Rutas específicas ANTES de /:id
router.get('/usuario/:usuario_id', authMiddleware, validateParams(UsuarioIdParamSchema), trabajadorController.getByUsuario);
router.get('/cargo/:cargo', authMiddleware, trabajadorController.getByCargo);
router.get('/identificacion/:identificacion', authMiddleware, trabajadorController.getByIdentificacion);
router.get('/search/:searchTerm', authMiddleware, trabajadorController.searchByNombre);

// CRUD BÁSICO
router.get('/', authMiddleware, trabajadorController.getAll);
router.post('/', authMiddleware, validateBody(TrabajadorCreateSchema), trabajadorController.create);
router.get('/:id', authMiddleware, validateParams(IdParamSchema), trabajadorController.getById);
router.put('/:id', authMiddleware, validateParams(IdParamSchema), validateBody(TrabajadorUpdateSchema), trabajadorController.update);
router.delete('/:id', authMiddleware, validateParams(IdParamSchema), trabajadorController.delete);
router.get('/:id/cuadrillas', authMiddleware, validateParams(IdParamSchema), trabajadorController.getWithCuadrillas);

export default router;
