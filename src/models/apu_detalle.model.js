export class ApuDetalleModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.partida_id = data.partida_id || null;
    this.recurso_id = data.recurso_id || null;
    this.cuadrilla_id = data.cuadrilla_id || null;
    this.cantidad = data.cantidad || 0;
    this.precio_unitario = data.precio_unitario || 0;
    this.rendimiento = data.rendimiento || null;
    this.created_at = data.created_at || new Date();
  }

  static fromDatabase(data) {
    return new ApuDetalleModel(data);
  }

  static toDatabase(detalle) {
    return {
      id: detalle.id,
      partida_id: detalle.partida_id,
      recurso_id: detalle.recurso_id,
      cuadrilla_id: detalle.cuadrilla_id,
      cantidad: detalle.cantidad,
      precio_unitario: detalle.precio_unitario,
      rendimiento: detalle.rendimiento,
      created_at: detalle.created_at
    };
  }

  validate() {
    const errors = [];
    
    if (!this.partida_id) {
      errors.push('El ID de la partida es requerido');
    }
    
    if (!this.recurso_id) {
      errors.push('El ID del recurso es requerido');
    }
    
    if (!this.cuadrilla_id) {
      errors.push('El ID de la cuadrilla es requerido');
    }
    
    if (this.cantidad <= 0) {
      errors.push('La cantidad debe ser mayor a cero');
    }
    
    if (this.precio_unitario <= 0) {
      errors.push('El precio unitario debe ser mayor a cero');
    }
    
    return errors;
  }

  getSubtotal() {
    return this.cantidad * this.precio_unitario;
  }
}
