export class CostosIndirectosModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.obra_id = data.obra_id || null;
    this.tipo = data.tipo || 'administracion';
    this.descripcion = data.descripcion || '';
    this.porcentaje = data.porcentaje || 0;
    this.valor = data.valor || 0;
    this.created_at = data.created_at || new Date();
  }

  static fromDatabase(data) {
    return new CostosIndirectosModel(data);
  }

  static toDatabase(costo) {
    return {
      id: costo.id,
      obra_id: costo.obra_id,
      tipo: costo.tipo,
      descripcion: costo.descripcion,
      porcentaje: costo.porcentaje,
      valor: costo.valor,
      created_at: costo.created_at
    };
  }

  validate() {
    const errors = [];
    
    if (!this.obra_id) {
      errors.push('El ID de la obra es requerido');
    }
    
    if (!this.descripcion || this.descripcion.trim() === '') {
      errors.push('La descripción es requerida');
    }
    
    const tiposValidos = ['administracion', 'imprevisto', 'utilidad', 'otro'];
    if (this.tipo && !tiposValidos.includes(this.tipo)) {
      errors.push('El tipo debe ser: administracion, imprevisto, utilidad u otro');
    }
    
    if (this.porcentaje < 0 || this.porcentaje > 100) {
      errors.push('El porcentaje debe estar entre 0 y 100');
    }
    
    if (this.valor < 0) {
      errors.push('El valor no puede ser negativo');
    }
    
    return errors;
  }

  calcularCosto(baseCalculo) {
    if (this.porcentaje > 0) {
      return baseCalculo * (this.porcentaje / 100);
    }
    return this.valor;
  }
}
