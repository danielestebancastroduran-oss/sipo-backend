import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SIPO API',
      version: '1.0.0',
      description: 'API de gestión de presupuestos de obra — Sistema Integral de Presupuestos de Obra (SIPO)',
      contact: {
        name: 'Equipo SIPO'
      }
    },
    servers: [
      {
        url: '/api',
        description: 'Servidor principal'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingresa tu token JWT'
        }
      },
      schemas: {
        // --- Respuesta estándar ---
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { type: 'object' },
            message: { type: 'string' }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: {
              type: 'array',
              items: { type: 'string' }
            }
          }
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { type: 'array', items: { type: 'object' } },
            pagination: {
              type: 'object',
              properties: {
                total: { type: 'integer' },
                limit: { type: 'integer' },
                offset: { type: 'integer' }
              }
            },
            message: { type: 'string' }
          }
        },
        // --- Usuario ---
        Usuario: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            nombre: { type: 'string' },
            apellido: { type: 'string' },
            correo: { type: 'string', format: 'email' },
            rol: { type: 'string', enum: ['admin', 'arquitecto', 'ingeniero', 'residente', 'usuario'] },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        UsuarioRegister: {
          type: 'object',
          required: ['nombre', 'apellido', 'correo', 'password'],
          properties: {
            nombre: { type: 'string', maxLength: 100 },
            apellido: { type: 'string', maxLength: 100 },
            correo: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
            rol: { type: 'string', enum: ['admin', 'arquitecto', 'ingeniero', 'residente', 'usuario'], default: 'usuario' }
          }
        },
        UsuarioLogin: {
          type: 'object',
          required: ['correo', 'password'],
          properties: {
            correo: { type: 'string', format: 'email' },
            password: { type: 'string' }
          }
        },
        // --- Cliente ---
        Cliente: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            usuario_id: { type: 'string', format: 'uuid' },
            nombre: { type: 'string' },
            nit: { type: 'string' },
            telefono: { type: 'string' },
            direccion: { type: 'string' },
            correo: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        // --- Obra ---
        Obra: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            usuario_id: { type: 'string', format: 'uuid' },
            cliente_id: { type: 'string', format: 'uuid', nullable: true },
            departamento_id: { type: 'string', format: 'uuid' },
            municipio_id: { type: 'string', format: 'uuid' },
            nombre: { type: 'string' },
            descripcion: { type: 'string' },
            tipo: { type: 'string', enum: ['residencial', 'comercial', 'industrial'] },
            estado: { type: 'string', enum: ['borrador', 'activo', 'finalizado'] },
            fecha_inicio: { type: 'string', format: 'date-time', nullable: true },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        // --- Partida ---
        Partida: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            obra_id: { type: 'string', format: 'uuid' },
            nombre: { type: 'string' },
            descripcion: { type: 'string' },
            unidad: { type: 'string' },
            cantidad: { type: 'number' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        // --- Recurso ---
        Recurso: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            usuario_id: { type: 'string', format: 'uuid' },
            nombre: { type: 'string' },
            tipo: { type: 'string', enum: ['material', 'herramienta', 'equipo'] },
            unidad: { type: 'string' },
            precio_unitario: { type: 'number' },
            created_at: { type: 'string', format: 'date-time' }
          }
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  // Escanear archivos de rutas para JSDoc
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

/**
 * Monta Swagger UI en la aplicación Express.
 * @param {import('express').Application} app
 */
export function setupSwagger(app) {
  app.use(
    '/api/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'SIPO API — Documentación'
    })
  );

  // Endpoint para obtener la spec en JSON
  app.get('/api/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
}
