import express from "express";
import { UsuarioController } from "../controllers/usuario.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  validateBody,
  validateParams,
  IdParamSchema,
  UsuarioRegisterSchema,
  UsuarioLoginSchema,
  UsuarioUpdateSchema
} from "../middleware/validation.js";

const router = express.Router();
const usuarioController = new UsuarioController();

/**
 * @openapi
 * /usuarios:
 *   post:
 *     summary: Registrar nuevo usuario
 *     tags: [Usuarios]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioRegister'
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *       400:
 *         description: Datos inválidos
 */
router.post("/", validateBody(UsuarioRegisterSchema), usuarioController.register);

/**
 * @openapi
 * /usuarios/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Usuarios]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioLogin'
 *     responses:
 *       200:
 *         description: Login exitoso, retorna token JWT
 *       401:
 *         description: Credenciales inválidas
 */
router.post("/login", validateBody(UsuarioLoginSchema), usuarioController.login);

// 🔒 RUTAS PROTEGIDAS (requieren autenticación)
// Rutas específicas ANTES de /:id para evitar conflictos
router.get("/rol/:rol", authMiddleware, usuarioController.getByRol);
router.get("/activos", authMiddleware, usuarioController.getActivos);
router.get("/search/:searchTerm", authMiddleware, usuarioController.searchByNombre);

// CRUD general
router.get("/", authMiddleware, usuarioController.getAll);
router.get("/:id", authMiddleware, validateParams(IdParamSchema), usuarioController.getById);
router.put("/:id", authMiddleware, validateParams(IdParamSchema), validateBody(UsuarioUpdateSchema), usuarioController.update);
router.delete("/:id", authMiddleware, validateParams(IdParamSchema), usuarioController.delete);
router.put("/:id/ultimo-acceso", authMiddleware, usuarioController.updateUltimoAcceso);

export default router;