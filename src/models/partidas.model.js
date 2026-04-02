export class PartidaModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.obra_id = data.obra_id || null;
    this.nombre = data.nombre || '';
    this.descripcion = data.descripcion || '';
    this.unidad = data.unidad || '';
    this.cantidad = data.cantidad || 0;
    this.created_at = data.created_at || new Date();
  }

  static fromDatabase(data) {
    return new PartidaModel(data);
  }

  static toDatabase(partida) {
    return {
      id: partida.id,
      obra_id: partida.obra_id,
      nombre: partida.nombre,
      descripcion: partida.descripcion,
      unidad: partida.unidad,
      cantidad: partida.cantidad,
      created_at: partida.created_at
    };
  }

  validate() {
    const errors = [];
    
    if (!this.nombre || this.nombre.trim() === '') {
      errors.push('El nombre de la partida es requerido');
    }
    
    if (!this.obra_id) {
      errors.push('El ID de la obra es requerido');
    }
    
    if (!this.unidad || this.unidad.trim() === '') {
      errors.push('La unidad es requerida');
    }
    
    if (this.cantidad <= 0) {
      errors.push('La cantidad debe ser mayor a cero');
    }
    
    return errors;
  }
}
