// Cargar variables de entorno ANTES que cualquier otro import
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import logger from "./src/utils/logger.js";
import { secrets } from "./src/config/secrets.js";
import { setupSwagger } from "./src/docs/swagger.js";

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
import empresaConfigRoutes from "./src/routes/empresa_config.routes.js";
import preferenciasPdfRoutes from "./src/routes/preferencias_pdf.routes.js";
import { errorHandler, notFoundHandler } from "./src/middleware/errorHandler.js";

// Validar que todas las variables de entorno críticas existen
secrets.validateAll();

const app = express();

// 🔒 Helmet — headers de seguridad HTTP
app.use(helmet());

// Parsear JSON en el body de las peticiones
app.use(express.json());

// 🔒 Configuración de CORS — soporta múltiples orígenes separados por coma
const corsOptions = {
  origin: true, // Permitir cualquier origen temporalmente para debug
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));

// 🔒 Rate Limiting global — máximo 100 peticiones por minuto por IP
const globalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Demasiadas peticiones, intenta de nuevo más tarde'
  }
});
app.use(globalLimiter);

// 🔒 Rate Limiting estricto para autenticación — máximo 10 intentos por 15 min
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Demasiados intentos de autenticación, intenta de nuevo en 15 minutos'
  }
});

// 🩺 HEALTH CHECK (antes de las rutas protegidas)
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 📄 SWAGGER / OPENAPI DOCS
setupSwagger(app);

// 🔹 RUTAS
app.use("/api/usuarios", authLimiter, usuariosRoutes);
app.use("/api/obras", obrasRoutes);
app.use("/api/partidas", partidasRoutes);
app.use("/api/apu-detalle", apuDetalleRoutes);
app.use("/api/clientes", clienteRoutes);
app.use("/api/recursos", recursosRoutes);
app.use("/api/cuadrillas", cuadrillasRoutes);
app.use("/api/trabajadores", trabajadorRoutes);
app.use("/api/departamentos", departamentosRoutes);
app.use("/api/municipios", municipiosRoutes);
app.use("/api/aiu-config", aiuConfigRoutes);
app.use("/api/configuracion-fiscal", configuracionFiscalRoutes);
app.use("/api/empresa-config", empresaConfigRoutes);
app.use("/api/preferencias-pdf", preferenciasPdfRoutes);

// 🔹 PRUEBA RÁPIDA
app.get("/", (req, res) => {
  res.send("API funcionando");
});

// 🔹 MIDDLEWARES DE ERROR (deben ir después de las rutas)
app.use(notFoundHandler);
app.use(errorHandler);

// 🔹 PUERTO
const PORT = secrets.getPort();

// Exportar app para tests
export { app };

// Solo iniciar servidor si no estamos en tests
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info(`🚀 Servidor corriendo en puerto ${PORT}`);
    logger.info(`📄 Documentación API disponible en http://localhost:${PORT}/api/docs`);
    logger.info(`🩺 Health check en http://localhost:${PORT}/health`);
  });
}