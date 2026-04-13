import express from "express";
import { UsuarioController } from "../controllers/usuario.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();
const usuarioController = new UsuarioController();

// 🔓 RUTAS PÚBLICAS (sin autenticación)
router.post("/", usuarioController.register);
router.post("/login", usuarioController.login);

// 🔒 RUTAS PROTEGIDAS (requieren autenticación)
// Rutas específicas ANTES de /:id para evitar conflictos
router.get("/rol/:rol", authMiddleware, usuarioController.getByRol);
router.get("/activos", authMiddleware, usuarioController.getActivos);
router.get("/search/:searchTerm", authMiddleware, usuarioController.searchByNombre);

// CRUD general
router.get("/", authMiddleware, usuarioController.getAll);
router.get("/:id", authMiddleware, usuarioController.getById);
router.put("/:id", authMiddleware, usuarioController.update);
router.delete("/:id", authMiddleware, usuarioController.delete);
router.put("/:id/ultimo-acceso", authMiddleware, usuarioController.updateUltimoAcceso);

export default router;