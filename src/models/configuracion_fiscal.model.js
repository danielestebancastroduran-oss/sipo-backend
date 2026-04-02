export class ConfiguracionFiscalModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.usuario_id = data.usuario_id || null;
    this.nit = data.nit || '';
    this.responsabilidad_juridica = data.responsabilidad_juridica || '';
    this.rut_url = data.rut_url || '';
    this.regimen_tributario = data.regimen_tributario || '';
    this.retencion_fuente = data.retencion_fuente || 0;
    this.ica_porcentaje = data.ica_porcentaje || 0;
    this.reteica_porcentaje = data.reteica_porcentaje || 0;
    this.iva_porcentaje = data.iva_porcentaje || 19;
    this.created_at = data.created_at || new Date();
  }

  static fromDatabase(data) {
    return new ConfiguracionFiscalModel(data);
  }

  static toDatabase(configuracion) {
    return {
      id: configuracion.id,
      usuario_id: configuracion.usuario_id,
      nit: configuracion.nit,
      responsabilidad_juridica: configuracion.responsabilidad_juridica,
      rut_url: configuracion.rut_url,
      regimen_tributario: configuracion.regimen_tributario,
      retencion_fuente: configuracion.retencion_fuente,
      ica_porcentaje: configuracion.ica_porcentaje,
      reteica_porcentaje: configuracion.reteica_porcentaje,
      iva_porcentaje: configuracion.iva_porcentaje,
      created_at: configuracion.created_at
    };
  }

  validate() {
    const errors = [];
    
    if (!this.usuario_id) {
      errors.push('El ID del usuario es requerido');
    }
    
    if (this.retencion_fuente < 0 || this.retencion_fuente > 100) {
      errors.push('El porcentaje de retención en la fuente debe estar entre 0 y 100');
    }
    
    if (this.ica_porcentaje < 0 || this.ica_porcentaje > 100) {
      errors.push('El porcentaje de ICA debe estar entre 0 y 100');
    }
    
    if (this.reteica_porcentaje < 0 || this.reteica_porcentaje > 100) {
      errors.push('El porcentaje de reteICA debe estar entre 0 y 100');
    }
    
    if (this.iva_porcentaje < 0 || this.iva_porcentaje > 100) {
      errors.push('El porcentaje de IVA debe estar entre 0 y 100');
    }
    
    return errors;
  }

  calcularRetenciones(baseGravable) {
    const retencionFuente = baseGravable * (this.retencion_fuente / 100);
    const ica = baseGravable * (this.ica_porcentaje / 100);
    const reteica = ica * (this.reteica_porcentaje / 100);
    const iva = baseGravable * (this.iva_porcentaje / 100);
    
    return {
      base_gravable: baseGravable,
      retencion_fuente: retencionFuente,
      ica: ica,
      reteica: reteica,
      iva: iva,
      total_retenciones: retencionFuente + ica + reteica,
      total_con_iva: baseGravable + iva
    };
  }
}
