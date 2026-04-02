import { supabase } from '../config/db.js';
import { CuadrillaModel } from '../models/cuadrillas.model.js';

export class CuadrillasService {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('cuadrillas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al obtener cuadrillas: ${error.message}`);
    }
  }

  async getById(id) {
    try {
      const { data, error } = await supabase
        .from('cuadrillas')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al obtener cuadrilla: ${error.message}`);
    }
  }

  async create(cuadrillaData) {
    try {
      const cuadrilla = new CuadrillaModel(cuadrillaData);
      const validationErrors = cuadrilla.validate();
      
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      const { data, error } = await supabase
        .from('cuadrillas')
        .insert([CuadrillaModel.toDatabase(cuadrilla)])
        .select('*')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al crear cuadrilla: ${error.message}`);
    }
  }

  async update(id, cuadrillaData) {
    try {
      const cuadrilla = new CuadrillaModel({ ...cuadrillaData, id });
      const validationErrors = cuadrilla.validate();
      
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      const { data, error } = await supabase
        .from('cuadrillas')
        .update(CuadrillaModel.toDatabase(cuadrilla))
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al actualizar cuadrilla: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      const { error } = await supabase
        .from('cuadrillas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      throw new Error(`Error al eliminar cuadrilla: ${error.message}`);
    }
  }

  async getByUsuario(usuario_id) {
    try {
      const { data, error } = await supabase
        .from('cuadrillas')
        .select('*')
        .eq('usuario_id', usuario_id)
        .order('nombre', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al obtener cuadrillas del usuario: ${error.message}`);
    }
  }

  async getWithTrabajadores(id) {
    try {
      const { data, error } = await supabase
        .from('cuadrillas')
        .select(`
          *,
          cuadrilla_trabajadores (
            id,
            cantidad,
            trabajador (
              id,
              nombre,
              identificacion,
              cargo,
              salario_diario
            )
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      
      // Calcular estadísticas de la cuadrilla
      if (data && data.cuadrilla_trabajadores) {
        data.total_trabajadores = data.cuadrilla_trabajadores.reduce((sum, ct) => sum + ct.cantidad, 0);
        data.total_salario_diario = data.cuadrilla_trabajadores.reduce((sum, ct) => 
          sum + (ct.cantidad * ct.trabajador.salario_diario), 0);
      }
      
      return data;
    } catch (error) {
      throw new Error(`Error al obtener cuadrilla con trabajadores: ${error.message}`);
    }
  }

  async getWithUsage(id) {
    try {
      const { data, error } = await supabase
        .from('cuadrillas')
        .select(`
          *,
          apu_detalles (
            id,
            cantidad,
            precio_unitario,
            rendimiento,
            partidas (nombre, obra_id),
            recursos (nombre, unidad)
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      
      // Calcular estadísticas de uso
      if (data && data.apu_detalles) {
        data.total_usos = data.apu_detalles.length;
        data.total_valor = data.apu_detalles.reduce((sum, detalle) => 
          sum + (detalle.cantidad * detalle.precio_unitario), 0);
      }
      
      return data;
    } catch (error) {
      throw new Error(`Error al obtener cuadrilla con uso: ${error.message}`);
    }
  }

  async searchByNombre(usuario_id, searchTerm) {
    try {
      const { data, error } = await supabase
        .from('cuadrillas')
        .select('*')
        .eq('usuario_id', usuario_id)
        .ilike('nombre', `%${searchTerm}%`)
        .order('nombre', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al buscar cuadrillas: ${error.message}`);
    }
  }
}
