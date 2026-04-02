export class PreferenciasPdfModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.usuario_id = data.usuario_id || null;
    this.mostrar_logo = data.mostrar_logo !== undefined ? data.mostrar_logo : true;
    this.nivel_detalle = data.nivel_detalle || 'resumen';
    this.incluir_apu = data.incluir_apu !== undefined ? data.incluir_apu : true;
    this.incluir_desglose_admin = data.incluir_desglose_admin !== undefined ? data.incluir_desglose_admin : false;
    this.mostrar_datos_cliente = data.mostrar_datos_cliente !== undefined ? data.mostrar_datos_cliente : true;
    this.incluir_retenciones = data.incluir_retenciones !== undefined ? data.incluir_retenciones : true;
    this.created_at = data.created_at || new Date();
  }

  static fromDatabase(data) {
    return new PreferenciasPdfModel(data);
  }

  static toDatabase(preferencias) {
    return {
      id: preferencias.id,
      usuario_id: preferencias.usuario_id,
      mostrar_logo: preferencias.mostrar_logo,
      nivel_detalle: preferencias.nivel_detalle,
      incluir_apu: preferencias.incluir_apu,
      incluir_desglose_admin: preferencias.incluir_desglose_admin,
      mostrar_datos_cliente: preferencias.mostrar_datos_cliente,
      incluir_retenciones: preferencias.incluir_retenciones,
      created_at: preferencias.created_at
    };
  }

  validate() {
    const errors = [];
    
    if (!this.usuario_id) {
      errors.push('El ID del usuario es requerido');
    }
    
    const nivelesValidos = ['resumen', 'detallado'];
    if (this.nivel_detalle && !nivelesValidos.includes(this.nivel_detalle)) {
      errors.push('El nivel de detalle debe ser: resumen o detallado');
    }
    
    return errors;
  }
}
