import { supabase } from '../config/db.js';
import { RecursoModel } from '../models/recursos.model.js';
import { v4 as uuidv4 } from 'uuid';
import { getPaginationRange } from '../utils/pagination.helper.js';

// Función para sanitizar input de búsquedas ilike
function sanitizeSearchTerm(term) {
  if (!term || typeof term !== 'string') return '';
  return term.replace(/[%_\\]/g, '\\$&');
}

export class RecursosService {
  async getAll(options = {}) {
    try {
      const { limit = 50, offset = 0, order = 'desc' } = options;
      const { from, to } = getPaginationRange(limit, offset);

      const { data, error, count } = await supabase
        .from('recursos')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: order === 'asc' })
        .range(from, to);

      if (error) throw error;
      return { data, count };
    } catch (error) {
      throw new Error(`Error al obtener recursos: ${error.message}`);
    }
  }

  async getById(id) {
    try {
      const { data, error } = await supabase
        .from('recursos')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al obtener recurso: ${error.message}`);
    }
  }

  async create(recursoData) {
    try {
      const recurso = new RecursoModel(recursoData);
      const validationErrors = recurso.validate();
      
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      // Generar UUID si no existe
      if (!recurso.id) {
        recurso.id = uuidv4();
      }

      const { data, error } = await supabase
        .from('recursos')
        .insert([RecursoModel.toDatabase(recurso)])
        .select('*')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al crear recurso: ${error.message}`);
    }
  }

  async update(id, recursoData) {
    try {
      const recurso = new RecursoModel({ ...recursoData, id });
      const validationErrors = recurso.validate();
      
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      const { data, error } = await supabase
        .from('recursos')
        .update(RecursoModel.toDatabase(recurso))
        .eq('id', id)
        .select('*');

      if (error) throw error;
      return data[0]; // Devolver el primer elemento del array
    } catch (error) {
      throw new Error(`Error al actualizar recurso: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      // Verificar que el recurso existe antes de eliminar
      const existing = await this.getById(id);
      if (!existing) return false;

      const { error } = await supabase
        .from('recursos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      throw new Error(`Error al eliminar recurso: ${error.message}`);
    }
  }

  async getByUsuario(usuario_id, options = {}) {
    try {
      const { limit = 50, offset = 0, order = 'desc' } = options;
      const { from, to } = getPaginationRange(limit, offset);

      const { data, error, count } = await supabase
        .from('recursos')
        .select('*', { count: 'exact' })
        .eq('usuario_id', usuario_id)
        .order('nombre', { ascending: order === 'asc' })
        .range(from, to);

      if (error) throw error;
      return { data, count };
    } catch (error) {
      throw new Error(`Error al obtener recursos del usuario: ${error.message}`);
    }
  }

  async getByTipo(usuario_id, tipo) {
    try {
      const { data, error } = await supabase
        .from('recursos')
        .select('*')
        .eq('usuario_id', usuario_id)
        .eq('tipo', tipo)
        .order('nombre', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al obtener recursos por tipo: ${error.message}`);
    }
  }

  async searchByNombre(usuario_id, searchTerm) {
    try {
      const sanitized = sanitizeSearchTerm(searchTerm);
      const { data, error } = await supabase
        .from('recursos')
        .select('*')
        .eq('usuario_id', usuario_id)
        .ilike('nombre', `%${sanitized}%`)
        .order('nombre', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al buscar recursos: ${error.message}`);
    }
  }

  async getWithUsage(id) {
    try {
      const { data, error } = await supabase
        .from('recursos')
        .select(`
          *,
          apu_detalle (
            id,
            cantidad,
            precio_unitario,
            rendimiento,
            partidas (nombre, obra_id),
            cuadrillas (nombre)
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      
      // Calcular estadísticas de uso
      if (data && data.apu_detalle) {
        data.total_usos = data.apu_detalle.length;
        data.total_cantidad = data.apu_detalle.reduce((sum, detalle) => sum + detalle.cantidad, 0);
        data.total_valor = data.apu_detalle.reduce((sum, detalle) => 
          sum + (detalle.cantidad * detalle.precio_unitario), 0);
      }
      
      return data;
    } catch (error) {
      throw new Error(`Error al obtener recurso con uso: ${error.message}`);
    }
  }
}
