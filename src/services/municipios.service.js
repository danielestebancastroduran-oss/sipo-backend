import { supabase } from '../config/db.js';
import { MunicipioModel } from '../models/municipios.model.js';
import { v4 as uuidv4 } from 'uuid';
import { getPaginationRange } from '../utils/pagination.helper.js';

// Función para sanitizar input de búsquedas ilike
function sanitizeSearchTerm(term) {
  if (!term || typeof term !== 'string') return '';
  return term.replace(/[%_\\]/g, '\\$&');
}

export class MunicipiosService {
  async getAll(options = {}) {
    try {
      const { limit = 50, offset = 0, order = 'asc' } = options;
      const { from, to } = getPaginationRange(limit, offset);

      const { data, error, count } = await supabase
        .from('municipios')
        .select('*', { count: 'exact' })
        .order('nombre', { ascending: order === 'asc' })
        .range(from, to);

      if (error) throw error;
      return { data, count };
    } catch (error) {
      throw new Error(`Error al obtener municipios: ${error.message}`);
    }
  }

  async getById(id) {
    try {
      const { data, error } = await supabase
        .from('municipios')
        .select(`
          *,
          departamentos (nombre, codigo_dane)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al obtener municipio: ${error.message}`);
    }
  }

  async create(municipioData) {
    try {
      const municipio = new MunicipioModel(municipioData);
      const validationErrors = municipio.validate();
      
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      // Generar UUID si no existe
      if (!municipio.id) {
        municipio.id = uuidv4();
      }

      const { data, error } = await supabase
        .from('municipios')
        .insert([MunicipioModel.toDatabase(municipio)])
        .select(`
          *,
          departamentos (nombre, codigo_dane)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al crear municipio: ${error.message}`);
    }
  }

  async update(id, municipioData) {
    try {
      const municipio = new MunicipioModel({ ...municipioData, id });
      const validationErrors = municipio.validate();
      
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      const { data, error } = await supabase
        .from('municipios')
        .update(MunicipioModel.toDatabase(municipio))
        .eq('id', id)
        .select(`
          *,
          departamentos (nombre, codigo_dane)
        `);

      if (error) throw error;
      return data[0];
    } catch (error) {
      throw new Error(`Error al actualizar municipio: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      // Verificar que el municipio existe antes de eliminar
      const existing = await this.getById(id);
      if (!existing) return false;

      const { error } = await supabase
        .from('municipios')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      throw new Error(`Error al eliminar municipio: ${error.message}`);
    }
  }

  async getByDepartamento(departamento_id, options = {}) {
    try {
      const { limit = 100, offset = 0, order = 'asc' } = options;
      const { from, to } = getPaginationRange(limit, offset);

      const { data, error, count } = await supabase
        .from('municipios')
        .select('*', { count: 'exact' })
        .eq('departamento_id', departamento_id)
        .order('nombre', { ascending: order === 'asc' })
        .range(from, to);

      if (error) throw error;
      return { data, count };
    } catch (error) {
      throw new Error(`Error al obtener municipios del departamento: ${error.message}`);
    }
  }

  async getCapitales() {
    try {
      const { data, error } = await supabase
        .from('municipios')
        .select(`
          *,
          departamentos (nombre, codigo_dane)
        `)
        .eq('es_capital', true)
        .order('nombre', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al obtener capitales: ${error.message}`);
    }
  }

  async getByCodigoDane(codigo_dane) {
    try {
      const { data, error } = await supabase
        .from('municipios')
        .select(`
          *,
          departamentos (nombre, codigo_dane)
        `)
        .eq('codigo_dane', codigo_dane)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al obtener municipio por código DANE: ${error.message}`);
    }
  }

  async searchByNombre(searchTerm, departamento_id = null) {
    try {
      const sanitized = sanitizeSearchTerm(searchTerm);
      let query = supabase
        .from('municipios')
        .select(`
          *,
          departamentos (nombre, codigo_dane)
        `)
        .ilike('nombre', `%${sanitized}%`);

      if (departamento_id) {
        query = query.eq('departamento_id', departamento_id);
      }

      const { data, error } = await query.order('nombre', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al buscar municipios: ${error.message}`);
    }
  }
}
