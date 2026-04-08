export class UsuarioModel {

  constructor(data = {}) {

    this.id = data.id || null;

    this.nombre = data.nombre || '';

    this.apellido = data.apellido || '';

    this.correo = data.correo || '';

    this.password_hash = data.password_hash || '';

    this.rol = data.rol || 'usuario';

    this.created_at = data.fecha_creacion || new Date();

    

    // Guardar password temporal si viene en texto plano

    this._password = data.password || null;

  }



  // Método para crear instancia desde datos de la base de datos

  static fromDatabase(data) {

    if (!data) {

      throw new Error('Datos de usuario no proporcionados');

    }

    

    return new UsuarioModel({

      id: data.id,

      nombre: data.nombre || '',

      apellido: data.apellido || '',

      correo: data.correo || '',

      password_hash: data.password_hash || '',

      rol: data.rol || 'usuario',

      created_at: data.created_at || data.fecha_creacion

    });

  }



  // Método para convertir a formato de base de datos

  static toDatabase(usuario) {

    return {

      id: usuario.id,

      nombre: usuario.nombre,

      apellido: usuario.apellido,

      correo: usuario.correo,

      password_hash: usuario.password_hash,

      rol: usuario.rol,

     

      created_at: usuario.created_at

    };

  }



  // Método para validar datos del usuario

  validate() {

    const errors = [];

    

    if (!this.nombre || this.nombre.trim() === '') {

      errors.push('El nombre es requerido');

    }

    

    if (!this.apellido || this.apellido.trim() === '') {

      errors.push('El apellido es requerido');

    }

    

    if (!this.correo || this.correo.trim() === '') {

      errors.push('El correo es requerido');

    } else if (!this.isValidEmail(this.correo)) {

      errors.push('El formato del correo es inválido');

    }

    

    // No validar contraseña aquí, el service se encarga de encriptarla

    

    const rolesValidos = ['arquitecto', 'ingeniero', 'residente'];

    if (this.rol && !rolesValidos.includes(this.rol)) {

      errors.push('El rol debe ser: arquitecto, ingeniero o residente');

    }

    

    return errors;

  }



  // Método para validar formato de email

  isValidEmail(email) {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);

  }



  // Método para obtener información pública (sin contraseña)

  toPublic() {

    return {

      id: this.id,

      nombre: this.nombre,

      apellido: this.apellido,

      correo: this.correo,

      rol: this.rol,

      created_at: this.created_at

    };

  }



  // Método para actualizar último acceso

  updateUltimoAcceso() {

    this.ultimo_acceso = new Date();

  }



  // Método para verificar si es arquitecto

  isArquitecto() {

    return this.rol === 'arquitecto';

  }



  // Método para verificar si es ingeniero

  isIngeniero() {

    return this.rol === 'ingeniero';

  }



  // Método para verificar si es residente

  isResidente() {

    return this.rol === 'residente';

  }

}

