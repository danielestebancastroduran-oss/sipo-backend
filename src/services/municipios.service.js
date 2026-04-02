import { supabase } from '../config/db.js';
import { MunicipioModel } from '../models/municipios.model.js';

export class MunicipiosService {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('municipios')
        .select(`
          *,
          departamentos (nombre, codigo_dane)
        `)
        .order('nombre', { ascending: true });

      if (error) throw error;
      return data;
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
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al actualizar municipio: ${error.message}`);
    }
  }

  async delete(id) {
    try {
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

  async getByDepartamento(departamento_id) {
    try {
      const { data, error } = await supabase
        .from('municipios')
        .select('*')
        .eq('departamento_id', departamento_id)
        .order('es_capital', { ascending: false })
        .order('nombre', { ascending: true });

      if (error) throw error;
      return data;
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
      let query = supabase
        .from('municipios')
        .select(`
          *,
          departamentos (nombre, codigo_dane)
        `)
        .ilike('nombre', `%${searchTerm}%`);

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
