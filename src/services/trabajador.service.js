import { supabase } from '../config/db.js';
import { TrabajadorModel } from '../models/trabajador.model.js';

export class TrabajadorService {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('trabajador')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al obtener trabajadores: ${error.message}`);
    }
  }

  async getById(id) {
    try {
      const { data, error } = await supabase
        .from('trabajador')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al obtener trabajador: ${error.message}`);
    }
  }

  async create(trabajadorData) {
    try {
      const trabajador = new TrabajadorModel(trabajadorData);
      const validationErrors = trabajador.validate();
      
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      const { data, error } = await supabase
        .from('trabajador')
        .insert([TrabajadorModel.toDatabase(trabajador)])
        .select('*')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al crear trabajador: ${error.message}`);
    }
  }

  async update(id, trabajadorData) {
    try {
      const trabajador = new TrabajadorModel({ ...trabajadorData, id });
      const validationErrors = trabajador.validate();
      
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      const { data, error } = await supabase
        .from('trabajador')
        .update(TrabajadorModel.toDatabase(trabajador))
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al actualizar trabajador: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      const { error } = await supabase
        .from('trabajador')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      throw new Error(`Error al eliminar trabajador: ${error.message}`);
    }
  }

  async getByUsuario(usuario_id) {
    try {
      const { data, error } = await supabase
        .from('trabajador')
        .select('*')
        .eq('usuario_id', usuario_id)
        .order('nombre', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al obtener trabajadores del usuario: ${error.message}`);
    }
  }

  async getByIdentificacion(usuario_id, identificacion) {
    try {
      const { data, error } = await supabase
        .from('trabajador')
        .select('*')
        .eq('usuario_id', usuario_id)
        .eq('identificacion', identificacion)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al obtener trabajador por identificación: ${error.message}`);
    }
  }

  async getByCargo(usuario_id, cargo) {
    try {
      const { data, error } = await supabase
        .from('trabajador')
        .select('*')
        .eq('usuario_id', usuario_id)
        .eq('cargo', cargo)
        .order('nombre', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al obtener trabajadores por cargo: ${error.message}`);
    }
  }

  async searchByNombre(usuario_id, searchTerm) {
    try {
      const { data, error } = await supabase
        .from('trabajador')
        .select('*')
        .eq('usuario_id', usuario_id)
        .ilike('nombre', `%${searchTerm}%`)
        .order('nombre', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al buscar trabajadores: ${error.message}`);
    }
  }

  async getWithCuadrillas(id) {
    try {
      const { data, error } = await supabase
        .from('trabajador')
        .select(`
          *,
          cuadrilla_trabajadores (
            id,
            cantidad,
            cuadrilla (
              id,
              nombre,
              rendimiento_base
            )
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      
      // Calcular estadísticas
      if (data && data.cuadrilla_trabajadores) {
        data.total_cuadrillas = data.cuadrilla_trabajadores.length;
        data.total_asignaciones = data.cuadrilla_trabajadores.reduce((sum, ct) => sum + ct.cantidad, 0);
      }
      
      return data;
    } catch (error) {
      throw new Error(`Error al obtener trabajador con cuadrillas: ${error.message}`);
    }
  }
}
