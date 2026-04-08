import { supabase } from '../config/db.js';
import { ConfiguracionFiscalModel } from '../models/configuracion_fiscal.model.js';
import { v4 as uuidv4 } from 'uuid';

export class ConfiguracionFiscalService {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('configuracion_fiscal')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al obtener configuraciones fiscales: ${error.message}`);
    }
  }

  async getById(id) {
    try {
      const { data, error } = await supabase
        .from('configuracion_fiscal')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al obtener configuración fiscal: ${error.message}`);
    }
  }

  async create(configuracionData) {
    try {
      const configuracion = new ConfiguracionFiscalModel(configuracionData);
      const validationErrors = configuracion.validate();
      
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      // Generar UUID si no existe
      if (!configuracion.id) {
        configuracion.id = uuidv4();
      }

      const { data, error } = await supabase
        .from('configuracion_fiscal')
        .insert([ConfiguracionFiscalModel.toDatabase(configuracion)])
        .select('*')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al crear configuración fiscal: ${error.message}`);
    }
  }

  async update(id, configuracionData) {
    try {
      const configuracion = new ConfiguracionFiscalModel({ ...configuracionData, id });
      const validationErrors = configuracion.validate();
      
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      const { data, error } = await supabase
        .from('configuracion_fiscal')
        .update(ConfiguracionFiscalModel.toDatabase(configuracion))
        .eq('id', id)
        .select('*');

      if (error) throw error;
      return data[0];
    } catch (error) {
      throw new Error(`Error al actualizar configuración fiscal: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      const { error } = await supabase
        .from('configuracion_fiscal')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      throw new Error(`Error al eliminar configuración fiscal: ${error.message}`);
    }
  }

  async getByUsuario(usuario_id) {
    try {
      const { data, error } = await supabase
        .from('configuracion_fiscal')
        .select('*')
        .eq('usuario_id', usuario_id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al obtener configuración fiscal del usuario: ${error.message}`);
    }
  }

  async upsertByUsuario(usuario_id, configuracionData) {
    try {
      // Primero intentar obtener la configuración existente
      const existingConfig = await this.getByUsuario(usuario_id);
      
      if (existingConfig) {
        // Si existe, actualizar
        return await this.update(existingConfig.id, { ...configuracionData, usuario_id });
      } else {
        // Si no existe, crear
        return await this.create({ ...configuracionData, usuario_id });
      }
    } catch (error) {
      throw new Error(`Error al guardar configuración fiscal: ${error.message}`);
    }
  }

  async calculateRetenciones(usuario_id, baseGravable) {
    try {
      const config = await this.getByUsuario(usuario_id);
      
      if (!config) {
        // Usar valores por defecto si no hay configuración
        const defaultConfig = new ConfiguracionFiscalModel();
        return defaultConfig.calcularRetenciones(baseGravable);
      }
      
      const configuracion = new ConfiguracionFiscalModel(config);
      return configuracion.calcularRetenciones(baseGravable);
    } catch (error) {
      throw new Error(`Error al calcular retenciones: ${error.message}`);
    }
  }

  async getDefaultConfig() {
    try {
      return new ConfiguracionFiscalModel();
    } catch (error) {
      throw new Error(`Error al obtener configuración fiscal por defecto: ${error.message}`);
    }
  }

  async validateNit(usuario_id, nit) {
    try {
      const config = await this.getByUsuario(usuario_id);
      
      if (config && config.nit === nit) {
        return { valid: true, message: 'NIT válido' };
      }
      
      // Aquí podrías implementar validación con servicio externo
      // Por ahora, solo validación básica de formato
      const nitRegex = /^[0-9]{9,}$/;
      const isValidFormat = nitRegex.test(nit.replace(/[^0-9]/g, ''));
      
      return {
        valid: isValidFormat,
        message: isValidFormat ? 'Formato de NIT válido' : 'Formato de NIT inválido'
      };
    } catch (error) {
      throw new Error(`Error al validar NIT: ${error.message}`);
    }
  }
}
