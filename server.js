import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import usuariosRoutes from "./src/routes/usuarios.routes.js";
import obrasRoutes from "./src/routes/obras.routes.js";
import partidasRoutes from "./src/routes/partidas.routes.js";
import apuDetalleRoutes from "./src/routes/apu_detalle.routes.js";
import clienteRoutes from "./src/routes/cliente.routes.js";
import recursosRoutes from "./src/routes/recursos.routes.js";
import cuadrillasRoutes from "./src/routes/cuadrillas.routes.js";
import trabajadorRoutes from "./src/routes/trabajador.routes.js";
import departamentosRoutes from "./src/routes/departamentos.routes.js";
import municipiosRoutes from "./src/routes/municipios.routes.js";
import aiuConfigRoutes from "./src/routes/aiu_config.routes.js";
import configuracionFiscalRoutes from "./src/routes/configuracion_fiscal.routes.js";

dotenv.config();

const app = express();

// ESTO ES CLAVE (sin esto da error 500)
// 🔥 ESTO ES CLAVE (sin esto da error 500)
app.use(express.json());

app.use(cors());

// 🔹 RUTAS
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/obras", obrasRoutes);
app.use("/api/partidas", partidasRoutes);
app.use("/api/apu-detalles", apuDetalleRoutes);
app.use("/api/clientes", clienteRoutes);
app.use("/api/recursos", recursosRoutes);
app.use("/api/cuadrillas", cuadrillasRoutes);
app.use("/api/trabajadores", trabajadorRoutes);
app.use("/api/departamentos", departamentosRoutes);
app.use("/api/municipios", municipiosRoutes);
app.use("/api/aiu-config", aiuConfigRoutes);
app.use("/api/configuracion-fiscal", configuracionFiscalRoutes);

// 🔹 PRUEBA RÁPIDA
app.get("/", (req, res) => {
  res.send("API funcionando");
});

// 🔹 PUERTO
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto", PORT);
});