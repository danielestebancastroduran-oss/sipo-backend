export class EmpresaConfigModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.usuario_id = data.usuario_id || null;
    this.nombre_empresa = data.nombre_empresa || '';
    this.nit = data.nit || '';
    this.correo = data.correo || '';
    this.telefono = data.telefono || '';
    this.direccion = data.direccion || '';
    this.departamento_id = data.departamento_id || null;
    this.municipio_id = data.municipio_id || null;
    this.logo_url = data.logo_url || '';
    this.created_at = data.created_at || new Date();
  }

  static fromDatabase(data) {
    return new EmpresaConfigModel(data);
  }

  static toDatabase(empresaConfig) {
    return {
      id: empresaConfig.id,
      usuario_id: empresaConfig.usuario_id,
      nombre_empresa: empresaConfig.nombre_empresa,
      nit: empresaConfig.nit,
      correo: empresaConfig.correo,
      telefono: empresaConfig.telefono,
      direccion: empresaConfig.direccion,
      departamento_id: empresaConfig.departamento_id,
      municipio_id: empresaConfig.municipio_id,
      logo_url: empresaConfig.logo_url,
      created_at: empresaConfig.created_at
    };
  }

  validate() {
    const errors = [];
    
    if (!this.usuario_id) {
      errors.push('El ID del usuario es requerido');
    }
    
    if (this.correo && !this.isValidEmail(this.correo)) {
      errors.push('El correo electrónico no es válido');
    }
    
    if (this.departamento_id && !this.municipio_id) {
      errors.push('Si especifica un departamento, debe especificar también un municipio');
    }
    
    if (!this.departamento_id && this.municipio_id) {
      errors.push('Si especifica un municipio, debe especificar también un departamento');
    }
    
    return errors;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
