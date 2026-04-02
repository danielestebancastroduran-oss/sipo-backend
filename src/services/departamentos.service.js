import { supabase } from '../config/db.js';
import { DepartamentoModel } from '../models/departamentos.model.js';

export class DepartamentosService {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('departamentos')
        .select('*')
        .order('nombre', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al obtener departamentos: ${error.message}`);
    }
  }

  async getById(id) {
    try {
      const { data, error } = await supabase
        .from('departamentos')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al obtener departamento: ${error.message}`);
    }
  }

  async create(departamentoData) {
    try {
      const departamento = new DepartamentoModel(departamentoData);
      const validationErrors = departamento.validate();
      
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      const { data, error } = await supabase
        .from('departamentos')
        .insert([DepartamentoModel.toDatabase(departamento)])
        .select('*')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al crear departamento: ${error.message}`);
    }
  }

  async update(id, departamentoData) {
    try {
      const departamento = new DepartamentoModel({ ...departamentoData, id });
      const validationErrors = departamento.validate();
      
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      const { data, error } = await supabase
        .from('departamentos')
        .update(DepartamentoModel.toDatabase(departamento))
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al actualizar departamento: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      const { error } = await supabase
        .from('departamentos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      throw new Error(`Error al eliminar departamento: ${error.message}`);
    }
  }

  async getByCodigoDane(codigo_dane) {
    try {
      const { data, error } = await supabase
        .from('departamentos')
        .select('*')
        .eq('codigo_dane', codigo_dane)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al obtener departamento por código DANE: ${error.message}`);
    }
  }

  async getWithMunicipios(id) {
    try {
      const { data, error } = await supabase
        .from('departamentos')
        .select(`
          *,
          municipios (
            id,
            nombre,
            es_capital,
            codigo_dane
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      
      // Ordenar municipios
      if (data && data.municipios) {
        data.municipios.sort((a, b) => {
          if (a.es_capital && !b.es_capital) return -1;
          if (!a.es_capital && b.es_capital) return 1;
          return a.nombre.localeCompare(b.nombre);
        });
      }
      
      return data;
    } catch (error) {
      throw new Error(`Error al obtener departamento con municipios: ${error.message}`);
    }
  }

  async searchByNombre(searchTerm) {
    try {
      const { data, error } = await supabase
        .from('departamentos')
        .select('*')
        .ilike('nombre', `%${searchTerm}%`)
        .order('nombre', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al buscar departamentos: ${error.message}`);
    }
  }
}
