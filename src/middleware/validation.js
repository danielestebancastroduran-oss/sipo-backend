import { z } from 'zod';

// ============================================================
// HELPERS DE VALIDACIÓN (middleware factories)
// ============================================================

/**
 * Middleware que valida req.body contra un esquema Zod.
 * Devuelve 400 con mensajes claros si falla.
 *
 * @param {z.ZodSchema} schema - Esquema Zod para validar
 * @returns {Function} middleware de Express
 */
export const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.issues.map(e => e.message);
    console.log('❌ VALIDATION ERROR:', errors, 'BODY:', req.body);
    return res.status(400).json({
      success: false,
      message: 'Datos de entrada inválidos',
      errors
    });
  }
  // Reemplazar body con datos parseados (coerción de tipos aplicada)
  req.body = result.data;
  next();
};

/**
 * Middleware que valida req.params contra un esquema Zod.
 */
export const validateParams = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.params);
  if (!result.success) {
    const errors = result.error.issues.map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Parámetros de ruta inválidos',
      errors
    });
  }
  req.params = result.data;
  next();
};

/**
 * Middleware que valida req.query contra un esquema Zod.
 */
export const validateQuery = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.query);
  if (!result.success) {
    const errors = result.error.issues.map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Parámetros de consulta inválidos',
      errors
    });
  }
  req.query = result.data;
  next();
};

// ============================================================
// ESQUEMAS REUTILIZABLES
// ============================================================

/** UUID v4 válido */
const uuidSchema = z.string().uuid({ message: 'ID debe ser un UUID válido' });

/** Parámetro :id en la URL */
export const IdParamSchema = z.object({
  id: uuidSchema
});

/** Parámetro :usuario_id en la URL */
export const UsuarioIdParamSchema = z.object({
  usuario_id: uuidSchema
});

/** Query de paginación (compartido por todos los GET /list) */
export const PaginationQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
  order: z.enum(['asc', 'desc']).default('desc')
}).partial();

// ============================================================
// ESQUEMAS POR RECURSO
// ============================================================

// --- Usuario ---
export const UsuarioRegisterSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido').max(100),
  apellido: z.string().min(1, 'El apellido es requerido').max(100),
  correo: z.string().email('El correo no es válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  rol: z.enum(['admin', 'arquitecto', 'ingeniero', 'residente', 'usuario']).default('usuario')
});

export const UsuarioLoginSchema = z.object({
  correo: z.string().email('El correo no es válido'),
  password: z.string().min(1, 'La contraseña es requerida')
});

export const UsuarioUpdateSchema = z.object({
  nombre: z.string().min(1).max(100).optional(),
  apellido: z.string().min(1).max(100).optional(),
  correo: z.string().email('El correo no es válido').optional(),
  password: z.string().min(6).optional(),
  rol: z.enum(['admin', 'arquitecto', 'ingeniero', 'residente', 'usuario']).optional()
});

// --- Cliente ---
export const ClienteCreateSchema = z.object({
  usuario_id: uuidSchema,
  nombre: z.string().min(1, 'El nombre del cliente es requerido').max(200),
  nit: z.string().max(50).default(''),
  telefono: z.string().max(30).default(''),
  direccion: z.string().max(300).default(''),
  correo: z.string().email('El correo no es válido').or(z.literal('')).default('')
});

export const ClienteUpdateSchema = ClienteCreateSchema.partial();

// --- Obra ---
export const ObraCreateSchema = z.object({
  usuario_id: uuidSchema,
  cliente_id: uuidSchema.optional().nullable(),
  departamento_id: uuidSchema,
  municipio_id: uuidSchema,
  nombre: z.string().min(1, 'El nombre de la obra es requerido').max(200),
  descripcion: z.string().max(1000).default(''),
  tipo: z.enum(['residencial', 'comercial', 'industrial', 'remodelacion']).default('residencial'),
  estado: z.enum(['borrador', 'activo', 'finalizado']).default('borrador'),
  fecha_inicio: z.string().datetime().optional().nullable()
});

export const ObraUpdateSchema = ObraCreateSchema.partial();

// --- Partida ---
export const PartidaCreateSchema = z.object({
  obra_id: uuidSchema,
  nombre: z.string().min(1, 'El nombre de la partida es requerido').max(200),
  descripcion: z.string().max(1000).default(''),
  unidad: z.string().min(1, 'La unidad es requerida').max(50),
  cantidad: z.number().positive('La cantidad debe ser mayor a cero'),
  valor_unitario: z.number().min(0, 'El valor unitario no puede ser negativo').default(0)
});

export const PartidaUpdateSchema = PartidaCreateSchema.partial();

// --- Recurso ---
export const RecursoCreateSchema = z.object({
  usuario_id: uuidSchema,
  nombre: z.string().min(1, 'El nombre del recurso es requerido').max(200),
  tipo: z.enum(['material', 'herramienta', 'equipo']).default('material'),
  unidad: z.string().min(1, 'La unidad es requerida').max(50),
  precio_unitario: z.number().min(0, 'El precio unitario no puede ser negativo')
});

export const RecursoUpdateSchema = RecursoCreateSchema.partial();

export const CuadrillaCreateSchema = z.object({
  usuario_id: uuidSchema,
  nombre: z.string().min(1, 'El nombre de la cuadrilla es requerido').max(200),
  descripcion: z.string().max(1000).optional().nullable(),
  costo_diario: z.coerce.number().min(0, 'El costo diario no puede ser negativo').default(0),
  rendimiento_base: z.coerce.number().positive('El rendimiento base debe ser mayor a cero').optional().nullable()
});

export const CuadrillaUpdateSchema = CuadrillaCreateSchema.partial();

// --- Trabajador ---
export const TrabajadorCreateSchema = z.object({
  usuario_id: uuidSchema,
  nombre: z.string().min(1, 'El nombre del trabajador es requerido').max(200),
  identificacion: z.string().min(1, 'La identificación es requerida').max(50),
  cargo: z.string().max(100).default(''),
  salario_diario: z.number().min(0, 'El salario diario no puede ser negativo')
});

export const TrabajadorUpdateSchema = TrabajadorCreateSchema.partial();

// --- APU Detalle ---
export const ApuDetalleCreateSchema = z.object({
  partida_id: uuidSchema,
  recurso_id: uuidSchema.optional().nullable(),
  cuadrilla_id: uuidSchema.optional().nullable(),
  cantidad: z.number().min(0, 'La cantidad no puede ser negativa'),
  precio_unitario: z.number().min(0, 'El precio unitario no puede ser negativo'),
  rendimiento: z.number().min(0).optional().nullable()
}).refine(
  (data) => data.recurso_id || data.cuadrilla_id,
  { message: 'Debe especificar un recurso_id o un cuadrilla_id' }
).refine(
  (data) => !(data.recurso_id && data.cuadrilla_id),
  { message: 'No puede especificar ambos: recurso_id y cuadrilla_id' }
);

export const ApuDetalleUpdateSchema = z.object({
  partida_id: uuidSchema.optional(),
  recurso_id: uuidSchema.optional().nullable(),
  cuadrilla_id: uuidSchema.optional().nullable(),
  cantidad: z.number().min(0).optional(),
  precio_unitario: z.number().min(0).optional(),
  rendimiento: z.number().min(0).optional().nullable()
});

// --- AIU Config ---
const porcentaje = z.number().min(0).max(100);

export const AiuConfigCreateSchema = z.object({
  usuario_id: uuidSchema,
  imprevistos: porcentaje.default(5),
  utilidad: porcentaje.default(5),
  iva_sobre_utilidad: porcentaje.default(19)
});

export const AiuConfigUpdateSchema = AiuConfigCreateSchema.partial();

// --- Configuración Fiscal ---
export const ConfiguracionFiscalCreateSchema = z.object({
  usuario_id: uuidSchema,
  nit: z.string().max(50).default(''),
  responsabilidad_juridica: z.string().max(200).default(''),
  rut_url: z.string().max(500).default(''),
  regimen_tributario: z.string().max(200).default(''),
  retencion_fuente: porcentaje.default(0),
  ica_porcentaje: porcentaje.default(0),
  reteica_porcentaje: porcentaje.default(0),
  iva_porcentaje: porcentaje.default(19)
});

export const ConfiguracionFiscalUpdateSchema = ConfiguracionFiscalCreateSchema.partial();

// --- Empresa Config ---
export const EmpresaConfigCreateSchema = z.object({
  usuario_id: uuidSchema,
  nombre_empresa: z.string().max(200).default(''),
  nit: z.string().max(50).default(''),
  correo: z.string().email('El correo no es válido').or(z.literal('')).default(''),
  telefono: z.string().max(30).default(''),
  direccion: z.string().max(300).default(''),
  departamento_id: uuidSchema.optional().nullable(),
  municipio_id: uuidSchema.optional().nullable(),
  logo_url: z.string().default('')
});

export const EmpresaConfigUpdateSchema = EmpresaConfigCreateSchema.partial();

// --- Preferencias PDF ---
export const PreferenciasPdfCreateSchema = z.object({
  usuario_id: uuidSchema,
  mostrar_logo: z.boolean().default(true),
  nivel_detalle: z.enum(['resumen', 'detallado']).default('resumen'),
  incluir_apu: z.boolean().default(true),
  incluir_desglose_admin: z.boolean().default(false),
  mostrar_datos_cliente: z.boolean().default(true),
  incluir_retenciones: z.boolean().default(true)
});

export const PreferenciasPdfUpdateSchema = PreferenciasPdfCreateSchema.partial();

// --- Departamento ---
export const DepartamentoCreateSchema = z.object({
  nombre: z.string().min(1, 'El nombre del departamento es requerido').max(100),
  codigo_dane: z.string().max(10).default('')
});

export const DepartamentoUpdateSchema = DepartamentoCreateSchema.partial();

// --- Municipio ---
export const MunicipioCreateSchema = z.object({
  departamento_id: uuidSchema,
  nombre: z.string().min(1, 'El nombre del municipio es requerido').max(100),
  codigo_dane: z.string().max(10).default(''),
  es_capital: z.boolean().default(false)
});

export const MunicipioUpdateSchema = MunicipioCreateSchema.partial();
