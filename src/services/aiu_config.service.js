import { supabase } from '../config/db.js';
import { AiuConfigModel } from '../models/aiu_config.model.js';
import { v4 as uuidv4 } from 'uuid';

export class AiuConfigService {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('aiu_config')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al obtener configuraciones AIU: ${error.message}`);
    }
  }

  async getById(id) {
    try {
      const { data, error } = await supabase
        .from('aiu_config')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al obtener configuración AIU: ${error.message}`);
    }
  }

  async create(aiuConfigData) {
    try {
      const aiuConfig = new AiuConfigModel(aiuConfigData);
      const validationErrors = aiuConfig.validate();
      
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      // Generar UUID si no existe
      if (!aiuConfig.id) {
        aiuConfig.id = uuidv4();
      }

      const { data, error } = await supabase
        .from('aiu_config')
        .insert([AiuConfigModel.toDatabase(aiuConfig)])
        .select('*')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al crear configuración AIU: ${error.message}`);
    }
  }

  async update(id, aiuConfigData) {
    try {
      const aiuConfig = new AiuConfigModel({ ...aiuConfigData, id });
      const validationErrors = aiuConfig.validate();
      
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      const { data, error } = await supabase
        .from('aiu_config')
        .update(AiuConfigModel.toDatabase(aiuConfig))
        .eq('id', id)
        .select('*');

      if (error) throw error;
      return data[0];
    } catch (error) {
      throw new Error(`Error al actualizar configuración AIU: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      const { error } = await supabase
        .from('aiu_config')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      throw new Error(`Error al eliminar configuración AIU: ${error.message}`);
    }
  }

  async getByUsuario(usuario_id) {
    try {
      const { data, error } = await supabase
        .from('aiu_config')
        .select('*')
        .eq('usuario_id', usuario_id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al obtener configuración AIU del usuario: ${error.message}`);
    }
  }

  async upsertByUsuario(usuario_id, aiuConfigData) {
    try {
      // Primero intentar obtener la configuración existente
      const existingConfig = await this.getByUsuario(usuario_id);
      
      if (existingConfig) {
        // Si existe, actualizar
        return await this.update(existingConfig.id, { ...aiuConfigData, usuario_id });
      } else {
        // Si no existe, crear
        return await this.create({ ...aiuConfigData, usuario_id });
      }
    } catch (error) {
      throw new Error(`Error al guardar configuración AIU: ${error.message}`);
    }
  }

  async calculateAiu(usuario_id, subtotal) {
    try {
      const config = await this.getByUsuario(usuario_id);
      
      if (!config) {
        // Usar valores por defecto si no hay configuración
        const defaultConfig = new AiuConfigModel();
        return defaultConfig.calcularAiu(subtotal);
      }
      
      const aiuConfig = new AiuConfigModel(config);
      return aiuConfig.calcularAiu(subtotal);
    } catch (error) {
      throw new Error(`Error al calcular AIU: ${error.message}`);
    }
  }

  async getDefaultConfig() {
    try {
      return new AiuConfigModel();
    } catch (error) {
      throw new Error(`Error al obtener configuración AIU por defecto: ${error.message}`);
    }
  }
}
