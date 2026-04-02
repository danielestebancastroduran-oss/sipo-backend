export class CuadrillaTrabajadorModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.cuadrilla_id = data.cuadrilla_id || null;
    this.trabajador_id = data.trabajador_id || null;
    this.cantidad = data.cantidad || 1;
    this.created_at = data.created_at || new Date();
  }

  static fromDatabase(data) {
    return new CuadrillaTrabajadorModel(data);
  }

  static toDatabase(cuadrillaTrabajador) {
    return {
      id: cuadrillaTrabajador.id,
      cuadrilla_id: cuadrillaTrabajador.cuadrilla_id,
      trabajador_id: cuadrillaTrabajador.trabajador_id,
      cantidad: cuadrillaTrabajador.cantidad,
      created_at: cuadrillaTrabajador.created_at
    };
  }

  validate() {
    const errors = [];
    
    if (!this.cuadrilla_id) {
      errors.push('El ID de la cuadrilla es requerido');
    }
    
    if (!this.trabajador_id) {
      errors.push('El ID del trabajador es requerido');
    }
    
    if (!this.cantidad || this.cantidad <= 0) {
      errors.push('La cantidad debe ser mayor a cero');
    }
    
    return errors;
  }
}
