export class CuadrillaModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.usuario_id = data.usuario_id || null;
    this.nombre = data.nombre || '';
    this.rendimiento_base = data.rendimiento_base || null;
    this.created_at = data.created_at || new Date();
  }

  static fromDatabase(data) {
    return new CuadrillaModel(data);
  }

  static toDatabase(cuadrilla) {
    return {
      id: cuadrilla.id,
      usuario_id: cuadrilla.usuario_id,
      nombre: cuadrilla.nombre,
      rendimiento_base: cuadrilla.rendimiento_base,
      created_at: cuadrilla.created_at
    };
  }

  validate() {
    const errors = [];
    
    if (!this.nombre || this.nombre.trim() === '') {
      errors.push('El nombre de la cuadrilla es requerido');
    }
    
    if (!this.usuario_id) {
      errors.push('El ID del usuario es requerido');
    }
    
    if (this.rendimiento_base !== null && this.rendimiento_base <= 0) {
      errors.push('El rendimiento base debe ser mayor a cero');
    }
    
    return errors;
  }
}
