export class AiuConfigModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.usuario_id = data.usuario_id || null;
    this.imprevistos = data.imprevistos || 5;
    this.utilidad = data.utilidad || 5;
    this.iva_sobre_utilidad = data.iva_sobre_utilidad || 19;
    this.created_at = data.created_at || new Date();
  }

  static fromDatabase(data) {
    return new AiuConfigModel(data);
  }

  static toDatabase(aiuConfig) {
    return {
      id: aiuConfig.id,
      usuario_id: aiuConfig.usuario_id,
      imprevistos: aiuConfig.imprevistos,
      utilidad: aiuConfig.utilidad,
      iva_sobre_utilidad: aiuConfig.iva_sobre_utilidad,
      created_at: aiuConfig.created_at
    };
  }

  validate() {
    const errors = [];
    
    if (!this.usuario_id) {
      errors.push('El ID del usuario es requerido');
    }
    
    if (this.imprevistos < 0 || this.imprevistos > 100) {
      errors.push('El porcentaje de imprevistos debe estar entre 0 y 100');
    }
    
    if (this.utilidad < 0 || this.utilidad > 100) {
      errors.push('El porcentaje de utilidad debe estar entre 0 y 100');
    }
    
    if (this.iva_sobre_utilidad < 0 || this.iva_sobre_utilidad > 100) {
      errors.push('El porcentaje de IVA sobre utilidad debe estar entre 0 y 100');
    }
    
    return errors;
  }

  calcularAiu(subtotal) {
    const imprevistos = subtotal * (this.imprevistos / 100);
    const utilidad = subtotal * (this.utilidad / 100);
    const ivaSobreUtilidad = utilidad * (this.iva_sobre_utilidad / 100);
    
    return {
      subtotal,
      imprevistos,
      utilidad,
      iva_sobre_utilidad: ivaSobreUtilidad,
      total: subtotal + imprevistos + utilidad + ivaSobreUtilidad
    };
  }
}
