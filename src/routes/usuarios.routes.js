import express from "express";
import { UsuarioController } from "../controllers/usuario.controller.js";

const router = express.Router();
const usuarioController = new UsuarioController();

// 🔹 REGISTRAR USUARIO
router.post("/", usuarioController.register);

// 🔹 LOGIN (verificar contraseña)
router.post("/login", usuarioController.login);

// 🔹 OBTENER USUARIOS
router.get("/", usuarioController.getAll);

// 🔹 RUTAS ADICIONALES
router.get("/:id", usuarioController.getById);
router.put("/:id", usuarioController.update);
router.delete("/:id", usuarioController.delete);
router.get("/rol/:rol", usuarioController.getByRol);
router.get("/activos", usuarioController.getActivos);
router.get("/search/:searchTerm", usuarioController.searchByNombre);
router.put("/:id/ultimo-acceso", usuarioController.updateUltimoAcceso);

export default router;