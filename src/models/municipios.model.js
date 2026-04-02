export class MunicipioModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.departamento_id = data.departamento_id || null;
    this.nombre = data.nombre || '';
    this.es_capital = data.es_capital || false;
    this.codigo_dane = data.codigo_dane || '';
  }

  static fromDatabase(data) {
    return new MunicipioModel(data);
  }

  static toDatabase(municipio) {
    return {
      id: municipio.id,
      departamento_id: municipio.departamento_id,
      nombre: municipio.nombre,
      es_capital: municipio.es_capital,
      codigo_dane: municipio.codigo_dane
    };
  }

  validate() {
    const errors = [];
    
    if (!this.nombre || this.nombre.trim() === '') {
      errors.push('El nombre del municipio es requerido');
    }
    
    if (!this.departamento_id) {
      errors.push('El ID del departamento es requerido');
    }
    
    if (!this.codigo_dane || this.codigo_dane.trim() === '') {
      errors.push('El código DANE es requerido');
    }
    
    return errors;
  }
}
