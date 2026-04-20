import { supabase } from '../config/db.js';
import { getPaginationRange } from '../utils/pagination.helper.js';
import { DepartamentoModel } from '../models/departamentos.model.js';
import { v4 as uuidv4 } from 'uuid';

// Función para sanitizar input de búsquedas ilike
function sanitizeSearchTerm(term) {
  if (!term || typeof term !== 'string') return '';
  return term.replace(/[%_\\]/g, '\\$&');
}

export class DepartamentosService {
  async getAll(options = {}) {
    try {
      const { limit = 50, offset = 0, order = 'asc' } = options;
      const { from, to } = getPaginationRange(limit, offset);

      const { data, error, count } = await supabase
        .from('departamentos')
        .select('*', { count: 'exact' })
        .order('nombre', { ascending: order === 'asc' })
        .range(from, to);

      if (error) throw error;
      return { data, count };
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

      // Generar UUID si no existe
      if (!departamento.id) {
        departamento.id = uuidv4();
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
        .select('*');

      if (error) throw error;
      return data[0];
    } catch (error) {
      throw new Error(`Error al actualizar departamento: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      // Verificar que el departamento existe antes de eliminar
      const existing = await this.getById(id);
      if (!existing) return false;

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
      const sanitized = sanitizeSearchTerm(searchTerm);
      const { data, error } = await supabase
        .from('departamentos')
        .select('*')
        .ilike('nombre', `%${sanitized}%`)
        .order('nombre', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al buscar departamentos: ${error.message}`);
    }
  }
}
