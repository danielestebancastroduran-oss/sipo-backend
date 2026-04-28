import { ObrasService } from '../services/obras.service.js';
import logger from '../utils/logger.js';
import { formatPaginatedResponse } from '../utils/pagination.helper.js';

export class ObrasController {
  constructor() {
    this.obrasService = new ObrasService();
  }

  // GET /api/obras
  getAll = async (req, res) => {
    try {
      const { limit, offset, order } = req.query;
      const { data, count } = await this.obrasService.getAll({ limit, offset, order });

      res.json(formatPaginatedResponse(
        data,
        count,
        limit,
        offset
      ));
    } catch (error) {
      logger.error('Error en getAll obras:', { error: error.message });
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener las obras'
      });
    }
  };

  // GET /api/obras/:id
  getById = async (req, res) => {
    try {
      const { id } = req.params;
      const obra = await this.obrasService.getById(id);
      
      if (!obra) {
        return res.status(404).json({
          success: false,
          message: 'Obra no encontrada'
        });
      }

      res.json({
        success: true,
        data: obra,
        message: 'Obra obtenida correctamente'
      });
    } catch (error) {
      logger.error('Error en getById obra:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener la obra'
      });
    }
  };

  // POST /api/obras
  create = async (req, res) => {
    try {
      const obra = await this.obrasService.create(req.body);
      res.status(201).json({
        success: true,
        data: obra,
        message: 'Obra creada correctamente'
      });
    } catch (error) {
      logger.error('Error en create obra:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error al crear la obra'
      });
    }
  };

  // PUT /api/obras/:id
  update = async (req, res) => {
    try {
      const { id } = req.params;
      const obra = await this.obrasService.update(id, req.body);
      
      if (!obra) {
        return res.status(404).json({
          success: false,
          message: 'Obra no encontrada'
        });
      }

      res.json({
        success: true,
        data: obra,
        message: 'Obra actualizada correctamente'
      });
    } catch (error) {
      logger.error('Error en update obra:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error al actualizar la obra'
      });
    }
  };

  // DELETE /api/obras/:id
  delete = async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await this.obrasService.delete(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Obra no encontrada'
        });
      }

      res.json({
        success: true,
        message: 'Obra eliminada correctamente'
      });
    } catch (error) {
      logger.error('Error en delete obra:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al eliminar la obra'
      });
    }
  };

  // GET /api/obras/usuario/:usuario_id
  getByUsuario = async (req, res) => {
    try {
      const { usuario_id } = req.params;
      const { limit, offset, order } = req.query;
      const { data, count } = await this.obrasService.getByUsuario(usuario_id, { limit, offset, order });
      
      // Calcular el presupuesto total para cada obra sumando sus partidas
      const obrasConTotal = await Promise.all((data || []).map(async (obra) => {
        const obraCompleta = await this.obrasService.getWithPartidas(obra.id);
        let total = 0;
        if (obraCompleta && obraCompleta.partidas) {
          obraCompleta.partidas.forEach(p => {
            const subtotal = (p.apu_detalle || []).reduce((acc, d) => acc + (d.cantidad * d.precio_unitario), 0);
            total += (subtotal * p.cantidad);
          });
        }
        return { ...obra, presupuesto_total: total };
      }));
      
      res.json(formatPaginatedResponse(
        obrasConTotal,
        count,
        limit,
        offset
      ));
    } catch (error) {
      logger.error('Error en getByUsuario obras:', { error: error.message });
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener las obras del usuario'
      });
    }
  };

  // GET /api/obras/estado/:estado
  getByEstado = async (req, res) => {
    try {
      const { estado } = req.params;
      const obras = await this.obrasService.getByEstado(estado);
      
      res.json({
        success: true,
        data: obras,
        message: 'Obras por estado obtenidas correctamente'
      });
    } catch (error) {
      logger.error('Error en getByEstado obras:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener las obras por estado'
      });
    }
  };

  // GET /api/obras/cliente/:cliente_id
  getByCliente = async (req, res) => {
    try {
      const { cliente_id } = req.params;
      const obras = await this.obrasService.getByCliente(cliente_id);
      
      res.json({
        success: true,
        data: obras,
        message: 'Obras del cliente obtenidas correctamente'
      });
    } catch (error) {
      logger.error('Error en getByCliente obras:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener las obras del cliente'
      });
    }
  };

  // GET /api/obras/tipo/:tipo
  getByTipo = async (req, res) => {
    try {
      const { tipo } = req.params;
      const obras = await this.obrasService.getByTipo(tipo);
      
      res.json({
        success: true,
        data: obras,
        message: 'Obras por tipo obtenidas correctamente'
      });
    } catch (error) {
      logger.error('Error en getByTipo obras:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener las obras por tipo'
      });
    }
  };

  // GET /api/obras/:id/partidas
  getWithPartidas = async (req, res) => {
    try {
      const { id } = req.params;
      const obra = await this.obrasService.getWithPartidas(id);
      
      if (!obra) {
        return res.status(404).json({
          success: false,
          message: 'Obra no encontrada'
        });
      }

      res.json({
        success: true,
        data: obra,
        message: 'Obra con partidas obtenida correctamente'
      });
    } catch (error) {
      logger.error('Error en getWithPartidas obra:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener la obra con partidas'
      });
    }
  };

  // POST /api/obras/:id/send-email
  sendBudgetByEmail = async (req, res) => {
    try {
      const { id } = req.params;
      const { detailLevel } = req.body;
      const usuario_id = req.user?.id;
      
      const { MailService } = await import('../services/mail.service.js');
      const { PdfService } = await import('../services/pdf.service.js');
      
      const mailService = new MailService();
      const pdfService = new PdfService();
      
      const obra = await this.obrasService.getWithPartidas(id);
      if (!obra || !obra.cliente?.correo) {
        return res.status(400).json({ 
          success: false, 
          message: 'La obra no existe o el cliente no tiene un correo válido.' 
        });
      }

      // Generar el PDF para enviarlo como adjunto
      const doc = await pdfService.generatePresupuestoPdf(id, usuario_id, detailLevel);
      
      // Convertir el stream del PDF a Buffer
      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', async () => {
        const pdfBuffer = Buffer.concat(chunks);
        try {
          await mailService.sendBudgetEmail(
            obra.cliente.correo,
            obra.nombre,
            detailLevel || 'estándar',
            pdfBuffer
          );
          res.json({ success: true, message: 'Correo enviado correctamente' });
        } catch (mailError) {
          logger.error('Error al enviar correo:', mailError);
          const msg = mailError.message.includes('SMTP') || mailError.message.includes('auth') 
            ? 'Error de autenticación de correo. Verifica la configuración SMTP en el servidor.'
            : 'Error al enviar el correo.';
          res.status(500).json({ success: false, message: msg });
        }
      });
      
    } catch (error) {
      logger.error('Error en sendBudgetByEmail:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al procesar la solicitud'
      });
    }
  };
}
