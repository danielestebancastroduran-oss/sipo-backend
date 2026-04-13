import { supabase } from '../config/db.js';
import { UsuarioModel } from '../models/usuario.model.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

// Campos que un usuario puede actualizar sobre sí mismo
const CAMPOS_ACTUALIZABLES = ['nombre', 'apellido', 'correo'];

// Función para sanitizar input de búsquedas ilike
function sanitizeSearchTerm(term) {
  if (!term || typeof term !== 'string') return '';
  // Escapar caracteres especiales de pattern matching en PostgreSQL
  return term.replace(/[%_\\]/g, '\\$&');
}

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

      if (error && error.code === 'PGRST116') return null;
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
      // Solo permitir campos seguros para actualización
      const updateData = {};
      for (const campo of CAMPOS_ACTUALIZABLES) {
        if (usuarioData[campo] !== undefined) {
          updateData[campo] = usuarioData[campo];
        }
      }

      // Si se proporciona nueva contraseña, encriptarla
      if (usuarioData.password) {
        updateData.password_hash = await bcrypt.hash(usuarioData.password, 10);
      }

      // Si no hay campos para actualizar
      if (Object.keys(updateData).length === 0) {
        throw new Error('No se proporcionaron campos válidos para actualizar');
      }

      const { data, error } = await supabase
        .from('usuarios')
        .update(updateData)
        .eq('id', id)
        .select('*')
        .single();

      if (error && error.code === 'PGRST116') return null;
      if (error) throw error;
      return UsuarioModel.fromDatabase(data);
    } catch (error) {
      throw new Error(`Error al actualizar usuario: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      // Verificar que el usuario existe antes de eliminar
      const existing = await this.getById(id);
      if (!existing) return false;

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
    const payload = {
      id: usuario.id,
      correo: usuario.correo,
      rol: usuario.rol
    };

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET no está configurado en las variables de entorno');
    }

    const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
    return jwt.sign(payload, secret, { expiresIn });
  }

  verifyToken(token) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET no está configurado en las variables de entorno');
    }
    return jwt.verify(token, secret);
  }

  async updateUltimoAcceso(id) {
    try {
      const usuario = await this.getById(id);
      if (!usuario) return null;

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
      const sanitized = sanitizeSearchTerm(searchTerm);
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .or(`nombre.ilike.%${sanitized}%,apellido.ilike.%${sanitized}%`)
        .order('nombre', { ascending: true });

      if (error) throw error;
      return data.map(usuario => UsuarioModel.fromDatabase(usuario));
    } catch (error) {
      throw new Error(`Error al buscar usuarios: ${error.message}`);
    }
  }
}
