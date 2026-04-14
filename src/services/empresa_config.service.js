import { supabase } from '../config/db.js';
import { EmpresaConfigModel } from '../models/empresa_config.model.js';
import { v4 as uuidv4 } from 'uuid';

export class EmpresaConfigService {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('empresa_config')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al obtener configuraciones de empresa: ${error.message}`);
    }
  }

  async getById(id) {
    try {
      const { data, error } = await supabase
        .from('empresa_config')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code === 'PGRST116') return null;
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al obtener configuración de empresa: ${error.message}`);
    }
  }

  async getByUsuario(usuario_id) {
    try {
      const { data, error } = await supabase
        .from('empresa_config')
        .select('*')
        .eq('usuario_id', usuario_id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    } catch (error) {
      throw new Error(`Error al obtener configuración de empresa del usuario: ${error.message}`);
    }
  }

  async create(configData) {
    try {
      const config = new EmpresaConfigModel(configData);
      const validationErrors = config.validate();

      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      if (!config.id) {
        config.id = uuidv4();
      }

      const { data, error } = await supabase
        .from('empresa_config')
        .insert([EmpresaConfigModel.toDatabase(config)])
        .select('*')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al crear configuración de empresa: ${error.message}`);
    }
  }

  async update(id, configData) {
    try {
      const { data, error } = await supabase
        .from('empresa_config')
        .update(configData)
        .eq('id', id)
        .select('*')
        .single();

      if (error && error.code === 'PGRST116') return null;
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al actualizar configuración de empresa: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      const existing = await this.getById(id);
      if (!existing) return false;

      const { error } = await supabase
        .from('empresa_config')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      throw new Error(`Error al eliminar configuración de empresa: ${error.message}`);
    }
  }

  async upsertByUsuario(usuario_id, configData) {
    try {
      const existing = await this.getByUsuario(usuario_id);

      if (existing) {
        return await this.update(existing.id, { ...configData, usuario_id });
      } else {
        return await this.create({ ...configData, usuario_id });
      }
    } catch (error) {
      throw new Error(`Error al guardar configuración de empresa: ${error.message}`);
    }
  }
}
