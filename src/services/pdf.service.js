import PDFDocument from 'pdfkit';
import { supabase } from '../config/db.js';

// Colores de la paleta
const COLORS = {
  primary: '#1E3A5F',
  secondary: '#2E86AB',
  accent: '#F4A261',
  light: '#F8F9FA',
  gray: '#6C757D',
  dark: '#212529',
  border: '#DEE2E6',
  white: '#FFFFFF',
};

export class PdfService {

  // ─── Obtener todos los datos necesarios de la obra ───────────────────────
  async getObraData(obra_id, usuario_id) {
    // 1. Datos de la obra
    const { data: obra, error: obraError } = await supabase
      .from('obras')
      .select('*')
      .eq('id', obra_id)
      .single();
    if (obraError) throw new Error(`Obra no encontrada: ${obraError.message}`);

    // 2. Datos del cliente (si tiene)
    let cliente = null;
    if (obra.cliente_id) {
      const { data } = await supabase
        .from('cliente')
        .select('*')
        .eq('id', obra.cliente_id)
        .single();
      cliente = data;
    }

    // 3. Partidas de la obra
    const { data: partidas, error: partidasError } = await supabase
      .from('partidas')
      .select('*')
      .eq('obra_id', obra_id)
      .order('created_at', { ascending: true });
    if (partidasError) throw new Error(`Error al obtener partidas: ${partidasError.message}`);

    // 4. APU detalle de cada partida
    const partidasConApu = await Promise.all(
      (partidas || []).map(async (partida) => {
        const { data: apu } = await supabase
          .from('apu_detalle')
          .select(`
            *,
            recursos (nombre, unidad, tipo),
            cuadrillas (nombre)
          `)
          .eq('partida_id', partida.id);
        return { ...partida, apu_detalle: apu || [] };
      })
    );

    // 5. Configuración AIU del usuario
    const { data: aiuConfig } = await supabase
      .from('aiu_config')
      .select('*')
      .eq('usuario_id', usuario_id)
      .single();

    // 6. Configuración de empresa del usuario
    const { data: empresa } = await supabase
      .from('empresa_config')
      .select('*')
      .eq('usuario_id', usuario_id)
      .single();

    // 7. Preferencias PDF del usuario
    const { data: prefsData } = await supabase
      .from('preferencias_pdf')
      .select('*')
      .eq('usuario_id', usuario_id)
      .single();

    const preferencias = prefsData || {
      mostrar_logo: true,
      nivel_detalle: 'resumen',
      incluir_apu: true,
      incluir_desglose_admin: false,
      mostrar_datos_cliente: true,
      incluir_retenciones: false,
    };

    return { obra, cliente, partidas: partidasConApu, aiuConfig, empresa, preferencias };
  }

  // ─── Calcular totales ─────────────────────────────────────────────────────
  calcularTotales(partidas, aiuConfig) {
    const costoDirecto = partidas.reduce((sum, p) => {
      const subtotalPartida = (p.apu_detalle || []).reduce(
        (s, d) => s + (d.cantidad * d.precio_unitario),
        0
      );
      return sum + subtotalPartida;
    }, 0);

    const aiu = aiuConfig || { imprevistos: 5, utilidad: 5, iva_sobre_utilidad: 19 };
    const administracion = costoDirecto * ((aiu.administracion ?? 5) / 100);
    const imprevistos = costoDirecto * ((aiu.imprevistos ?? 5) / 100);
    const utilidad = costoDirecto * ((aiu.utilidad ?? 5) / 100);
    const ivaSobreUtilidad = utilidad * ((aiu.iva_sobre_utilidad ?? 19) / 100);
    const total = costoDirecto + administracion + imprevistos + utilidad + ivaSobreUtilidad;

    return { costoDirecto, administracion, imprevistos, utilidad, ivaSobreUtilidad, total };
  }

  // ─── Formatear moneda ─────────────────────────────────────────────────────
  formatCurrency(value) {
    return `$ ${Number(value || 0).toLocaleString('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })}`;
  }

  formatDate(date) {
    return new Date(date || Date.now()).toLocaleDateString('es-CO', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  // ─── GENERAR PDF ──────────────────────────────────────────────────────────
  async generatePresupuestoPdf(obra_id, usuario_id) {
    const { obra, cliente, partidas, aiuConfig, empresa, preferencias } =
      await this.getObraData(obra_id, usuario_id);

    const totales = this.calcularTotales(partidas, aiuConfig);

    const doc = new PDFDocument({
      size: 'A4',
      margin: 40,
      info: {
        Title: `Presupuesto - ${obra.nombre}`,
        Author: empresa?.nombre_empresa || 'SIPO',
        Subject: 'Presupuesto de Obra',
      }
    });

    // ── ENCABEZADO ──────────────────────────────────────────────────────────
    this._drawHeader(doc, empresa, obra, preferencias);

    // ── DATOS DEL CLIENTE ───────────────────────────────────────────────────
    if (preferencias.mostrar_datos_cliente && cliente) {
      this._drawClienteSection(doc, cliente);
    }

    // ── INFORMACIÓN DE LA OBRA ──────────────────────────────────────────────
    this._drawObraSection(doc, obra);

    // ── TABLA DE PARTIDAS ───────────────────────────────────────────────────
    this._drawPartidasTable(doc, partidas, preferencias);

    // ── RESUMEN DE COSTOS ───────────────────────────────────────────────────
    this._drawResumen(doc, totales, aiuConfig, preferencias);

    // ── PIE DE PÁGINA ────────────────────────────────────────────────────────
    this._drawFooter(doc, empresa);

    doc.end();
    return doc;
  }

  // ─── SECCIÓN: ENCABEZADO ─────────────────────────────────────────────────
  _drawHeader(doc, empresa, obra, preferencias) {
    const pageWidth = doc.page.width - 80;

    // Fondo azul del header
    doc.rect(40, 40, pageWidth, 80).fill(COLORS.primary);

    // Nombre de empresa
    const nombreEmpresa = empresa?.nombre_empresa || 'SIPO - Sistema de Presupuestación';
    doc.fillColor(COLORS.white)
       .fontSize(18)
       .font('Helvetica-Bold')
       .text(nombreEmpresa, 55, 55, { width: pageWidth * 0.65 });

    // NIT
    if (empresa?.nit) {
      doc.fontSize(9)
         .font('Helvetica')
         .text(`NIT: ${empresa.nit}`, 55, 78);
    }

    // Fecha y título
    doc.fontSize(9)
       .text(`Fecha: ${this.formatDate(new Date())}`, pageWidth - 90, 55, { align: 'right', width: 120 })
       .fontSize(11)
       .font('Helvetica-Bold')
       .text('PRESUPUESTO DE OBRA', pageWidth - 90, 72, { align: 'right', width: 120 });

    doc.moveDown(4);
  }

  // ─── SECCIÓN: CLIENTE ─────────────────────────────────────────────────────
  _drawClienteSection(doc, cliente) {
    doc.moveDown(0.5);
    doc.fillColor(COLORS.secondary)
       .fontSize(11)
       .font('Helvetica-Bold')
       .text('INFORMACIÓN DEL CLIENTE', 40);

    doc.moveTo(40, doc.y + 3).lineTo(555, doc.y + 3).strokeColor(COLORS.secondary).lineWidth(1).stroke();
    doc.moveDown(0.5);

    doc.fillColor(COLORS.dark).fontSize(10).font('Helvetica');
    const nombreCliente = `${cliente.nombre || ''} ${cliente.apellido || ''}`.trim();
    doc.text(`Nombre: ${nombreCliente}`, 40);
    if (cliente.correo) doc.text(`Correo: ${cliente.correo}`, 40);
    if (cliente.telefono) doc.text(`Teléfono: ${cliente.telefono}`, 40);
    doc.moveDown(0.5);
  }

  // ─── SECCIÓN: OBRA ────────────────────────────────────────────────────────
  _drawObraSection(doc, obra) {
    doc.moveDown(0.5);
    doc.fillColor(COLORS.secondary)
       .fontSize(11)
       .font('Helvetica-Bold')
       .text('INFORMACIÓN DE LA OBRA', 40);

    doc.moveTo(40, doc.y + 3).lineTo(555, doc.y + 3).strokeColor(COLORS.secondary).lineWidth(1).stroke();
    doc.moveDown(0.5);

    // Cuadro de datos de la obra en 2 columnas
    const col1 = 40, col2 = 310;
    const y = doc.y;

    doc.fillColor(COLORS.dark).fontSize(10).font('Helvetica-Bold');
    doc.text('Nombre:', col1, y);
    doc.font('Helvetica').text(obra.nombre || '-', col1 + 65, y);

    doc.font('Helvetica-Bold').text('Tipo:', col2, y);
    doc.font('Helvetica').text(obra.tipo || '-', col2 + 35, y);

    doc.moveDown(0.4);
    const y2 = doc.y;
    doc.font('Helvetica-Bold').text('Estado:', col1, y2);
    doc.font('Helvetica').text(obra.estado || '-', col1 + 50, y2);

    if (obra.descripcion) {
      doc.moveDown(0.4);
      doc.font('Helvetica-Bold').text('Descripción:', col1);
      doc.font('Helvetica').text(obra.descripcion, col1 + 80, doc.y - 12);
    }

    doc.moveDown(1);
  }

  // ─── SECCIÓN: TABLA DE PARTIDAS ──────────────────────────────────────────
  _drawPartidasTable(doc, partidas, preferencias) {
    doc.fillColor(COLORS.secondary)
       .fontSize(11)
       .font('Helvetica-Bold')
       .text('PARTIDAS Y ANÁLISIS DE PRECIOS', 40);

    doc.moveTo(40, doc.y + 3).lineTo(555, doc.y + 3).strokeColor(COLORS.secondary).lineWidth(1).stroke();
    doc.moveDown(0.5);

    // Encabezados de la tabla
    const colWidths = { desc: 220, und: 55, cant: 70, pu: 90, subtotal: 90 };
    const startX = 40;
    let y = doc.y;

    // Fondo encabezado tabla
    doc.rect(startX, y, 515, 18).fill(COLORS.primary);

    doc.fillColor(COLORS.white).fontSize(9).font('Helvetica-Bold');
    doc.text('DESCRIPCIÓN', startX + 4, y + 4, { width: colWidths.desc });
    doc.text('UND', startX + colWidths.desc + 4, y + 4, { width: colWidths.und });
    doc.text('CANTIDAD', startX + colWidths.desc + colWidths.und + 4, y + 4, { width: colWidths.cant });
    doc.text('P. UNITARIO', startX + colWidths.desc + colWidths.und + colWidths.cant + 4, y + 4, { width: colWidths.pu });
    doc.text('SUBTOTAL', startX + colWidths.desc + colWidths.und + colWidths.cant + colWidths.pu + 4, y + 4, { width: colWidths.subtotal });

    y += 18;
    let totalGeneral = 0;
    let rowAlt = false;

    for (const partida of partidas) {
      // Calcular subtotal de la partida
      const subtotalPartida = (partida.apu_detalle || []).reduce(
        (s, d) => s + (d.cantidad * d.precio_unitario), 0
      );
      const costoUnitario = partida.cantidad > 0 ? subtotalPartida / partida.cantidad : 0;
      totalGeneral += subtotalPartida;

      // Verificar si necesita nueva página
      if (y > 720) {
        doc.addPage();
        y = 40;
      }

      // Fila alternada
      if (rowAlt) {
        doc.rect(startX, y, 515, 16).fill('#F0F4F8');
      }
      rowAlt = !rowAlt;

      doc.fillColor(COLORS.dark).fontSize(9).font('Helvetica');
      doc.text(partida.nombre || '-', startX + 4, y + 2, { width: colWidths.desc - 8 });
      doc.text(partida.unidad || '-', startX + colWidths.desc + 4, y + 2, { width: colWidths.und });
      doc.text(String(partida.cantidad ?? 0), startX + colWidths.desc + colWidths.und + 4, y + 2, { width: colWidths.cant });
      doc.text(this.formatCurrency(costoUnitario), startX + colWidths.desc + colWidths.und + colWidths.cant + 4, y + 2, { width: colWidths.pu });
      doc.text(this.formatCurrency(subtotalPartida), startX + colWidths.desc + colWidths.und + colWidths.cant + colWidths.pu + 4, y + 2, { width: colWidths.subtotal });
      y += 16;

      // ── APU Detalle (modo detallado) ───────────────────────────────────
      if (preferencias.nivel_detalle === 'detallado' && preferencias.incluir_apu) {
        for (const detalle of (partida.apu_detalle || [])) {
          if (y > 720) { doc.addPage(); y = 40; }

          doc.rect(startX, y, 515, 14).fill('#E8EEF4');
          const nombreItem = detalle.recursos
            ? `  └ ${detalle.recursos.nombre} (${detalle.recursos.tipo})`
            : `  └ ${detalle.cuadrillas?.nombre || 'Item'}`;

          doc.fillColor(COLORS.gray).fontSize(8).font('Helvetica');
          doc.text(nombreItem, startX + 4, y + 2, { width: colWidths.desc - 8 });
          doc.text(detalle.recursos?.unidad || '-', startX + colWidths.desc + 4, y + 2, { width: colWidths.und });
          doc.text(String(detalle.cantidad ?? 0), startX + colWidths.desc + colWidths.und + 4, y + 2, { width: colWidths.cant });
          doc.text(this.formatCurrency(detalle.precio_unitario), startX + colWidths.desc + colWidths.und + colWidths.cant + 4, y + 2, { width: colWidths.pu });
          doc.text(this.formatCurrency(detalle.cantidad * detalle.precio_unitario), startX + colWidths.desc + colWidths.und + colWidths.cant + colWidths.pu + 4, y + 2, { width: colWidths.subtotal });
          y += 14;
        }
      }
    }

    // Borde tabla
    doc.rect(startX, doc.y - (y - doc.y) + 18, 515, y - doc.y + (y - doc.y))
       .strokeColor(COLORS.border).lineWidth(0.5).stroke();

    doc.y = y;
    doc.moveDown(1);
  }

  // ─── SECCIÓN: RESUMEN COSTOS ─────────────────────────────────────────────
  _drawResumen(doc, totales, aiuConfig, preferencias) {
    if (doc.y > 600) doc.addPage();

    const aiu = aiuConfig || { administracion: 5, imprevistos: 5, utilidad: 5, iva_sobre_utilidad: 19 };
    const tableWidth = 300;
    const startX = doc.page.width - 40 - tableWidth;

    doc.moveDown(0.5);
    doc.fillColor(COLORS.secondary)
       .fontSize(11)
       .font('Helvetica-Bold')
       .text('RESUMEN DE COSTOS', 40);

    doc.moveTo(40, doc.y + 3).lineTo(555, doc.y + 3).strokeColor(COLORS.secondary).lineWidth(1).stroke();
    doc.moveDown(0.5);

    const rowY = doc.y;
    const rows = [
      { label: 'COSTO DIRECTO', value: totales.costoDirecto, bold: false },
    ];

    if (preferencias.incluir_desglose_admin) {
      rows.push(
        { label: `Administración (${aiu.administracion ?? 5}%)`, value: totales.administracion, bold: false },
        { label: `Imprevistos (${aiu.imprevistos ?? 5}%)`, value: totales.imprevistos, bold: false },
        { label: `Utilidad (${aiu.utilidad ?? 5}%)`, value: totales.utilidad, bold: false },
        { label: `IVA sobre Utilidad (${aiu.iva_sobre_utilidad ?? 19}%)`, value: totales.ivaSobreUtilidad, bold: false },
      );
    } else {
      const aiuTotal = totales.administracion + totales.imprevistos + totales.utilidad + totales.ivaSobreUtilidad;
      rows.push({ label: 'A.I.U.', value: aiuTotal, bold: false });
    }

    rows.push({ label: 'VALOR TOTAL DEL PRESUPUESTO', value: totales.total, bold: true });

    let rY = rowY;
    for (const row of rows) {
      if (row.bold) {
        doc.rect(startX, rY - 2, tableWidth, 20).fill(COLORS.primary);
        doc.fillColor(COLORS.white);
      } else {
        doc.fillColor(COLORS.dark);
      }

      doc.fontSize(10)
         .font(row.bold ? 'Helvetica-Bold' : 'Helvetica')
         .text(row.label, startX + 8, rY + 2, { width: tableWidth * 0.65 })
         .text(this.formatCurrency(row.value), startX + tableWidth * 0.65, rY + 2, {
           width: tableWidth * 0.35 - 8,
           align: 'right'
         });

      doc.moveTo(startX, rY + 18)
         .lineTo(startX + tableWidth, rY + 18)
         .strokeColor(COLORS.border).lineWidth(0.5).stroke();

      rY += 20;
    }

    doc.y = rY + 20;
  }

  // ─── PIE DE PÁGINA ────────────────────────────────────────────────────────
  _drawFooter(doc, empresa) {
    const bottom = doc.page.height - 60;

    doc.moveTo(40, bottom).lineTo(555, bottom).strokeColor(COLORS.border).lineWidth(0.5).stroke();

    doc.fillColor(COLORS.gray)
       .fontSize(8)
       .font('Helvetica')
       .text(
         empresa?.nombre_empresa
           ? `${empresa.nombre_empresa} | NIT: ${empresa.nit || '-'} | ${empresa.correo || ''} | ${empresa.telefono || ''}`
           : 'Generado por SIPO - Sistema de Información para Presupuestación de Obras',
         40, bottom + 8,
         { align: 'center', width: 515 }
       );

    doc.text(
      `Documento generado el ${this.formatDate(new Date())} — SIPO V.1`,
      40, bottom + 20,
      { align: 'center', width: 515 }
    );
  }
}
