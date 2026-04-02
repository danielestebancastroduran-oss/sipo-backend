export class RecursoModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.usuario_id = data.usuario_id || null;
    this.nombre = data.nombre || '';
    this.tipo = data.tipo || 'material';
    this.unidad = data.unidad || '';
    this.precio_unitario = data.precio_unitario || 0;
    this.created_at = data.created_at || new Date();
  }

  static fromDatabase(data) {
    return new RecursoModel(data);
  }

  static toDatabase(recurso) {
    return {
      id: recurso.id,
      usuario_id: recurso.usuario_id,
      nombre: recurso.nombre,
      tipo: recurso.tipo,
      unidad: recurso.unidad,
      precio_unitario: recurso.precio_unitario,
      created_at: recurso.created_at
    };
  }

  validate() {
    const errors = [];
    
    if (!this.nombre || this.nombre.trim() === '') {
      errors.push('El nombre del recurso es requerido');
    }
    
    if (!this.usuario_id) {
      errors.push('El ID del usuario es requerido');
    }
    
    if (!this.unidad || this.unidad.trim() === '') {
      errors.push('La unidad es requerida');
    }
    
    const tiposValidos = ['material', 'herramienta', 'equipo'];
    if (this.tipo && !tiposValidos.includes(this.tipo)) {
      errors.push('El tipo de recurso debe ser: material, herramienta o equipo');
    }
    
    if (this.precio_unitario < 0) {
      errors.push('El precio unitario no puede ser negativo');
    }
    
    return errors;
  }
}
