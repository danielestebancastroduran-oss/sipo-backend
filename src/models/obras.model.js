export class ObraModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.usuario_id = data.usuario_id || null;
    this.cliente_id = data.cliente_id || null;
    this.departamento_id = data.departamento_id || null;
    this.municipio_id = data.municipio_id || null;
    this.nombre = data.nombre || '';
    this.descripcion = data.descripcion || '';
    this.tipo = data.tipo || 'residencial';
    this.estado = data.estado || 'borrador';
    this.fecha_inicio = data.fecha_inicio || null;
    this.created_at = data.created_at || new Date();
  }

  static fromDatabase(data) {
    return new ObraModel(data);
  }

  static toDatabase(obra) {
    return {
      id: obra.id,
      usuario_id: obra.usuario_id,
      cliente_id: obra.cliente_id,
      departamento_id: obra.departamento_id,
      municipio_id: obra.municipio_id,
      nombre: obra.nombre,
      descripcion: obra.descripcion,
      tipo: obra.tipo,
      estado: obra.estado,
      fecha_inicio: obra.fecha_inicio,
      created_at: obra.created_at
    };
  }

  validate() {
    const errors = [];
    
    if (!this.nombre || this.nombre.trim() === '') {
      errors.push('El nombre de la obra es requerido');
    }
    
    if (!this.usuario_id) {
      errors.push('El ID del usuario es requerido');
    }
    
    if (!this.departamento_id) {
      errors.push('El ID del departamento es requerido');
    }
    
    if (!this.municipio_id) {
      errors.push('El ID del municipio es requerido');
    }
    
    if (!this.tipo || this.tipo.trim() === '') {
      errors.push('El tipo de obra es requerido');
    }
    
    const tiposValidos = ['residencial', 'comercial', 'industrial'];
    if (this.tipo && !tiposValidos.includes(this.tipo)) {
      errors.push('El tipo de obra debe ser: residencial, comercial o industrial');
    }
    
    const estadosValidos = ['borrador', 'activo', 'finalizado'];
    if (this.estado && !estadosValidos.includes(this.estado)) {
      errors.push('El estado debe ser: borrador, activo o finalizado');
    }
    
    return errors;
  }
}
