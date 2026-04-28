export class CuadrillaModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.usuario_id = data.usuario_id || null;
    this.nombre = data.nombre || '';
    this.descripcion = data.descripcion || '';
    this.costo_diario = data.costo_diario ?? 0;
    this.rendimiento_base = data.rendimiento_base || null;
    this.created_at = data.created_at || new Date();
  }

  static fromDatabase(data) {
    const model = new CuadrillaModel(data);
    // Recuperamos el costo del "escondite"
    if (data.rendimiento_base && !data.costo_diario) {
      model.costo_diario = data.rendimiento_base;
    }
    return model;
  }

  static toDatabase(cuadrilla) {
    return {
      id: cuadrilla.id,
      usuario_id: cuadrilla.usuario_id,
      nombre: cuadrilla.nombre,
      // Usamos rendimiento_base como "escondite" para costo_diario ya que la columna no existe en DB
      rendimiento_base: Number(cuadrilla.costo_diario) || 0
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
