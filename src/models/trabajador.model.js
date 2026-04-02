export class TrabajadorModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.usuario_id = data.usuario_id || null;
    this.nombre = data.nombre || '';
    this.identificacion = data.identificacion || '';
    this.cargo = data.cargo || '';
    this.salario_diario = data.salario_diario || 0;
    this.created_at = data.created_at || new Date();
  }

  static fromDatabase(data) {
    return new TrabajadorModel(data);
  }

  static toDatabase(trabajador) {
    return {
      id: trabajador.id,
      usuario_id: trabajador.usuario_id,
      nombre: trabajador.nombre,
      identificacion: trabajador.identificacion,
      cargo: trabajador.cargo,
      salario_diario: trabajador.salario_diario,
      created_at: trabajador.created_at
    };
  }

  validate() {
    const errors = [];
    
    if (!this.nombre || this.nombre.trim() === '') {
      errors.push('El nombre del trabajador es requerido');
    }
    
    if (!this.usuario_id) {
      errors.push('El ID del usuario es requerido');
    }
    
    if (!this.identificacion || this.identificacion.trim() === '') {
      errors.push('La identificación es requerida');
    }
    
    if (this.salario_diario < 0) {
      errors.push('El salario diario no puede ser negativo');
    }
    
    return errors;
  }
}
