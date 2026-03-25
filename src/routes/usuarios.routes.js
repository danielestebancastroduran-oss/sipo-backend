import express from "express";
import { supabase } from "../config/db.js";
import bcrypt from "bcrypt";

const router = express.Router();


// 🔹 REGISTRAR USUARIO
router.post("/", async (req, res) => {
  try {
    const { nombre, apellido, correo, password, rol } = req.body;

    // 1️⃣ Encriptar contraseña
    const password_hash = await bcrypt.hash(password, 10);
console.log("HASH GENERADO:", password_hash);

    // 2️⃣ Guardar en Supabase
    const { data, error } = await supabase
      .from("usuarios")
      .insert([
        {
          nombre,
          apellido,
          correo,
          password_hash,
          rol,
        },
      ]);

    if (error) {
      console.log(error);
      return res.status(500).json(error);
    }

    res.status(201).json({
      message: "Usuario creado correctamente",
      data,
    });

  } catch (error) {
    res.status(500).json({ error: "Error en el servidor" });
  }
});


// � LOGIN (verificar contraseña)
router.post("/login", async (req, res) => {
  try {
    const { correo, password } = req.body;

    // 1️⃣ Buscar usuario por correo
    const { data: usuarios, error: selectError } = await supabase
      .from("usuarios")
      .select("*")
      .eq("correo", correo)
      .limit(1)
      .single();

    if (selectError) {
      console.log(selectError);
      return res.status(500).json({ error: "Error al buscar usuario" });
    }

    if (!usuarios) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // 2️⃣ Verificar contraseña
    const coincide = await bcrypt.compare(password, usuarios.password_hash);
    if (!coincide) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    return res.json({ message: "Login exitoso", usuario: { id: usuarios.id, correo: usuarios.correo, nombre: usuarios.nombre, apellido: usuarios.apellido, rol: usuarios.rol } });
  } catch (error) {
    res.status(500).json({ error: "Error en el servidor" });
  }
});


// �🔹 OBTENER USUARIOS
router.get("/", async (req, res) => {
  const { data, error } = await supabase
    .from("usuarios")
    .select("*");

  if (error) return res.status(500).json(error);

  res.json(data);
});

export default router;