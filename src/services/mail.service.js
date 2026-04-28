import nodemailer from 'nodemailer';
import logger from '../utils/logger.js';

export class MailService {
  constructor() {
    this.isConfigured = !!(process.env.SMTP_USER && process.env.SMTP_PASS);
    
    if (this.isConfigured) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      logger.warn('SMTP_USER y SMTP_PASS no configurados en .env. Los correos se simularán en consola.');
    }
  }

  async sendBudgetEmail(to, obraNombre, detailLevel, pdfBuffer = null) {
    try {
      const mailOptions = {
        from: `"SIPO - Gestión de Obras" <${process.env.SMTP_USER}>`,
        to: to,
        subject: `Presupuesto Final: ${obraNombre}`,
        text: `Hola, adjuntamos el presupuesto final para la obra: ${obraNombre}.\nNivel de detalle: ${detailLevel}`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #FF5722;">Presupuesto Final</h2>
            <p>Hola, adjuntamos el presupuesto final para la obra: <strong>${obraNombre}</strong>.</p>
            <p><strong>Nivel de detalle solicitado:</strong> ${detailLevel}</p>
            <br />
            <p>Atentamente,<br />Equipo de SIPO</p>
          </div>
        `,
      };

      if (pdfBuffer) {
        mailOptions.attachments = [
          {
            filename: `presupuesto-${obraNombre}.pdf`,
            content: pdfBuffer,
          },
        ];
      }

      if (!this.isConfigured) {
        logger.info('📧 [SIMULACIÓN DE CORREO] Para: %s | Asunto: %s', to, mailOptions.subject);
        logger.info('PDF generado de %s bytes adjunto.', pdfBuffer ? pdfBuffer.length : 0);
        return { messageId: 'simulated-email-id-12345' };
      }

      const info = await this.transporter.sendMail(mailOptions);
      logger.info('Correo enviado: %s', info.messageId);
      return info;
    } catch (error) {
      logger.error('Error enviando correo:', error);
      throw error;
    }
  }
}
