import { PdfService } from '../services/pdf.service.js';
import logger from '../utils/logger.js';

const pdfService = new PdfService();

// GET /api/obras/:id/pdf
export const generateObraPdf = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario_id = req.user?.id;

    if (!usuario_id) {
      return res.status(401).json({ success: false, message: 'No autenticado' });
    }

    // Generar el PDF
    const doc = await pdfService.generatePresupuestoPdf(id, usuario_id);

    // Configurar headers de respuesta para descarga
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="presupuesto-obra-${id}.pdf"`);

    // Pipe el documento al response
    doc.pipe(res);
  } catch (error) {
    logger.error('Error al generar PDF:', error);

    // Si ya se enviaron headers, no podemos cambiar a JSON
    if (res.headersSent) return;

    if (error.message.includes('no encontrada')) {
      return res.status(404).json({ success: false, message: error.message });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Error al generar el PDF'
    });
  }
};
