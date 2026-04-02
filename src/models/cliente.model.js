export class ClienteModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.usuario_id = data.usuario_id || null;
    this.nombre = data.nombre || '';
    this.nit = data.nit || '';
    this.telefono = data.telefono || '';
    this.direccion = data.direccion || '';
    this.correo = data.correo || '';
    this.created_at = data.created_at || new Date();
  }

  static fromDatabase(data) {
    return new ClienteModel(data);
  }

  static toDatabase(cliente) {
    return {
      id: cliente.id,
      usuario_id: cliente.usuario_id,
      nombre: cliente.nombre,
      nit: cliente.nit,
      telefono: cliente.telefono,
      direccion: cliente.direccion,
      correo: cliente.correo,
      created_at: cliente.created_at
    };
  }

  validate() {
    const errors = [];
    
    if (!this.nombre || this.nombre.trim() === '') {
      errors.push('El nombre del cliente es requerido');
    }
    
    if (!this.usuario_id) {
      errors.push('El ID del usuario es requerido');
    }
    
    if (this.correo && !this.isValidEmail(this.correo)) {
      errors.push('El correo electrónico no es válido');
    }
    
    return errors;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
