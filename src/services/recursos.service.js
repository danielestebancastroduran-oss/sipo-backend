import { supabase } from '../config/db.js';
import { RecursoModel } from '../models/recursos.model.js';

export class RecursosService {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('recursos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
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
        .select('*')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al actualizar recurso: ${error.message}`);
    }
  }

  async delete(id) {
    try {
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

  async getByUsuario(usuario_id) {
    try {
      const { data, error } = await supabase
        .from('recursos')
        .select('*')
        .eq('usuario_id', usuario_id)
        .order('nombre', { ascending: true });

      if (error) throw error;
      return data;
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
      const { data, error } = await supabase
        .from('recursos')
        .select('*')
        .eq('usuario_id', usuario_id)
        .ilike('nombre', `%${searchTerm}%`)
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
          apu_detalles (
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
      if (data && data.apu_detalles) {
        data.total_usos = data.apu_detalles.length;
        data.total_cantidad = data.apu_detalles.reduce((sum, detalle) => sum + detalle.cantidad, 0);
        data.total_valor = data.apu_detalles.reduce((sum, detalle) => 
          sum + (detalle.cantidad * detalle.precio_unitario), 0);
      }
      
      return data;
    } catch (error) {
      throw new Error(`Error al obtener recurso con uso: ${error.message}`);
    }
  }
}
