import { supabase } from '../config/db.js';
import { ClienteModel } from '../models/cliente.model.js';

export class ClienteService {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('cliente')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al obtener clientes: ${error.message}`);
    }
  }

  async getById(id) {
    try {
      const { data, error } = await supabase
        .from('cliente')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al obtener cliente: ${error.message}`);
    }
  }

  async create(clienteData) {
    try {
      const cliente = new ClienteModel(clienteData);
      const validationErrors = cliente.validate();
      
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      const { data, error } = await supabase
        .from('cliente')
        .insert([ClienteModel.toDatabase(cliente)])
        .select('*')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al crear cliente: ${error.message}`);
    }
  }

  async update(id, clienteData) {
    try {
      const cliente = new ClienteModel({ ...clienteData, id });
      const validationErrors = cliente.validate();
      
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      const { data, error } = await supabase
        .from('cliente')
        .update(ClienteModel.toDatabase(cliente))
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al actualizar cliente: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      const { error } = await supabase
        .from('cliente')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      throw new Error(`Error al eliminar cliente: ${error.message}`);
    }
  }

  async getByUsuario(usuario_id) {
    try {
      const { data, error } = await supabase
        .from('cliente')
        .select('*')
        .eq('usuario_id', usuario_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al obtener clientes del usuario: ${error.message}`);
    }
  }

  async getByNit(nit) {
    try {
      const { data, error } = await supabase
        .from('cliente')
        .select('*')
        .eq('nit', nit)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al obtener cliente por NIT: ${error.message}`);
    }
  }

  async searchByNombre(usuario_id, searchTerm) {
    try {
      const { data, error } = await supabase
        .from('cliente')
        .select('*')
        .eq('usuario_id', usuario_id)
        .ilike('nombre', `%${searchTerm}%`)
        .order('nombre', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al buscar clientes: ${error.message}`);
    }
  }
}
