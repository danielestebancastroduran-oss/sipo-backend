import { supabase } from '../config/db.js';
import { UsuarioModel } from '../models/usuario.model.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

export class UsuarioService {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*');

      if (error) throw error;
      return data.map(usuario => UsuarioModel.fromDatabase(usuario));
    } catch (error) {
      throw new Error(`Error al obtener usuarios: ${error.message}`);
    }
  }

  async getById(id) {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data ? UsuarioModel.fromDatabase(data) : null;
    } catch (error) {
      throw new Error(`Error al obtener usuario: ${error.message}`);
    }
  }

  async getByCorreo(correo) {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('correo', correo)
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data ? UsuarioModel.fromDatabase(data) : null;
    } catch (error) {
      throw new Error(`Error al obtener usuario por correo: ${error.message}`);
    }
  }

  async create(usuarioData) {
    try {
      // Si viene password_hash, lo usamos directamente
      // Si viene password, lo encriptamos
      let passwordHashFinal = '';
      
      if (usuarioData.password) {
        passwordHashFinal = await bcrypt.hash(usuarioData.password, 10);
      } else if (usuarioData.password_hash) {
        passwordHashFinal = usuarioData.password_hash;
      } else {
        throw new Error('La contraseña es requerida');
      }
      
      // Crear usuario con el password_hash final
      const usuarioFinal = {
        ...usuarioData,
        password_hash: passwordHashFinal
      };
      
      const usuario = new UsuarioModel(usuarioFinal);
      const validationErrors = usuario.validate();
      
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      // Asignar UUID si no tiene
      if (!usuario.id) {
        usuario.id = uuidv4();
      }

      const { data, error } = await supabase
        .from('usuarios')   
        .insert([UsuarioModel.toDatabase(usuario)])
        .select('*')
        .single();

      if (error) throw error;
      return UsuarioModel.fromDatabase(data);
    } catch (error) {
      throw new Error(`Error al crear usuario: ${error.message}`);
    }
  }

  async update(id, usuarioData) {
    try {
      // Crear objeto solo con los campos proporcionados
      const updateData = { ...usuarioData };
      
      // Si se proporciona nueva contraseña, encriptarla
      if (usuarioData.password && !usuarioData.password_hash) {
        updateData.password_hash = await bcrypt.hash(usuarioData.password, 10);
        delete updateData.password; // Eliminar password plano
      }

      
      const { data, error } = await supabase
        .from('usuarios')
        .update(updateData) // Solo enviar los campos que se quieren actualizar
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;
      return UsuarioModel.fromDatabase(data);
    } catch (error) {
      throw new Error(`Error al actualizar usuario: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      const { error } = await supabase
        .from('usuarios')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      throw new Error(`Error al eliminar usuario: ${error.message}`);
    }
  }

  async login(correo, password) {
    try {
      // Buscar usuario por correo
      const usuario = await this.getByCorreo(correo);
      
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      // Verificar contraseña
      const coincide = await bcrypt.compare(password, usuario.password_hash);
      
      if (!coincide) {
        throw new Error('Contraseña incorrecta');
      }

      // Generar JWT
      const token = this.generateToken(usuario);

      // Retornar información pública con token
      return {
        ...usuario.toPublic(),
        token
      };
    } catch (error) {
      throw new Error(`Error en login: ${error.message}`);
    }
  }

  generateToken(usuario) {
    try {
      const payload = {
        id: usuario.id,
        correo: usuario.correo,
        rol: usuario.rol
      };

      const secret = process.env.JWT_SECRET || 'tu_secreto_default_aqui';
      const expiresIn = process.env.JWT_EXPIRES_IN || '24h';

      return jwt.sign(payload, secret, { expiresIn });
    } catch (error) {
      throw new Error(`Error al generar token: ${error.message}`);
    }
  }

  verifyToken(token) {
    try {
      const secret = process.env.JWT_SECRET || 'tu_secreto_default_aqui';
      return jwt.verify(token, secret);
    } catch (error) {
      throw new Error('Token inválido o expirado');
    }
  }

  async updateUltimoAcceso(id) {
    try {
      const usuario = await this.getById(id);
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      usuario.updateUltimoAcceso();
      const { data, error } = await supabase
        .from('usuarios')
        .update({ ultimo_acceso: usuario.ultimo_acceso })
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;
      return UsuarioModel.fromDatabase(data);
    } catch (error) {
      throw new Error(`Error al actualizar último acceso: ${error.message}`);
    }
  }

  async getByRol(rol) {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('rol', rol)
        .order('nombre', { ascending: true });

      if (error) throw error;
      return data.map(usuario => UsuarioModel.fromDatabase(usuario));
    } catch (error) {
      throw new Error(`Error al obtener usuarios por rol: ${error.message}`);
    }
  }

  async getActivos() {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('estado', 'activo')
        .order('nombre', { ascending: true });

      if (error) throw error;
      return data.map(usuario => UsuarioModel.fromDatabase(usuario));
    } catch (error) {
      throw new Error(`Error al obtener usuarios activos: ${error.message}`);
    }
  }

  async searchByNombre(searchTerm) {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .or(`nombre.ilike.%${searchTerm}%,apellido.ilike.%${searchTerm}%`)
        .order('nombre', { ascending: true });

      if (error) throw error;
      return data.map(usuario => UsuarioModel.fromDatabase(usuario));
    } catch (error) {
      throw new Error(`Error al buscar usuarios: ${error.message}`);
    }
  }
}
