import express from 'express';
import { ObrasController } from '../controllers/obras.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { generateObraPdf } from '../controllers/pdf.controller.js';
import {
  validateBody,
  validateParams,
  IdParamSchema,
  UsuarioIdParamSchema,
  ObraCreateSchema,
  ObraUpdateSchema
} from '../middleware/validation.js';

const router = express.Router();
const obrasController = new ObrasController();

// 🔒 Rutas específicas ANTES de /:id
router.get('/usuario/:usuario_id', authMiddleware, validateParams(UsuarioIdParamSchema), obrasController.getByUsuario);
router.get('/estado/:estado', authMiddleware, obrasController.getByEstado);
router.get('/cliente/:cliente_id', authMiddleware, obrasController.getByCliente);
router.get('/tipo/:tipo', authMiddleware, obrasController.getByTipo);

// CRUD BÁSICO
router.get('/', authMiddleware, obrasController.getAll);
router.post('/', authMiddleware, validateBody(ObraCreateSchema), obrasController.create);
router.get('/:id', authMiddleware, validateParams(IdParamSchema), obrasController.getById);
router.put('/:id', authMiddleware, validateParams(IdParamSchema), validateBody(ObraUpdateSchema), obrasController.update);
router.delete('/:id', authMiddleware, validateParams(IdParamSchema), obrasController.delete);
router.get('/:id/partidas', authMiddleware, validateParams(IdParamSchema), obrasController.getWithPartidas);

// 📄 Generación de PDF
router.get('/:id/pdf', authMiddleware, validateParams(IdParamSchema), generateObraPdf);

export default router;
