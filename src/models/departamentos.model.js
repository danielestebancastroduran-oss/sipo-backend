export class DepartamentoModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.nombre = data.nombre || '';
    this.codigo_dane = data.codigo_dane || '';
  }

  static fromDatabase(data) {
    return new DepartamentoModel(data);
  }

  static toDatabase(departamento) {
    return {
      id: departamento.id,
      nombre: departamento.nombre,
      codigo_dane: departamento.codigo_dane
    };
  }

  validate() {
    const errors = [];
    
    if (!this.nombre || this.nombre.trim() === '') {
      errors.push('El nombre del departamento es requerido');
    }
    
    if (!this.codigo_dane || this.codigo_dane.trim() === '') {
      errors.push('El código DANE es requerido');
    }
    
    return errors;
  }
}
