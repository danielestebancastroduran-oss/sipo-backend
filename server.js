import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import usuariosRoutes from "./src/routes/usuarios.routes.js";

dotenv.config();

const app = express();

// 🔥 ESTO ES CLAVE (sin esto da error 500)
app.use(express.json());

app.use(cors());

// 🔹 RUTAS
app.use("/api/usuarios", usuariosRoutes);

// 🔹 PRUEBA RÁPIDA
app.get("/", (req, res) => {
  res.send("API funcionando");
});

// 🔹 PUERTO
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto", PORT);
});