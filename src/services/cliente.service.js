import { supabase } from '../config/db.js';
import { ClienteModel } from '../models/cliente.model.js';
import { v4 as uuidv4 } from 'uuid';

import { getPaginationRange } from '../utils/pagination.helper.js';

// Función para sanitizar input de búsquedas ilike
function sanitizeSearchTerm(term) {
  if (!term || typeof term !== 'string') return '';
  return term.replace(/[%_\\]/g, '\\$&');
}

export class ClienteService {
  async getAll(options = {}) {
    try {
      const { limit = 50, offset = 0, order = 'desc' } = options;
      const { from, to } = getPaginationRange(limit, offset);

      const { data, error, count } = await supabase
        .from('cliente')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: order === 'asc' })
        .range(from, to);

      if (error) throw error;
      return { data, count };
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

       if (!cliente.id) {
        cliente.id = uuidv4();
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
      const cliente = new ClienteModel(clienteData);
      const validationErrors = cliente.validate();
      
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      const { data, error } = await supabase
        .from('cliente')
        .update(ClienteModel.toDatabase(cliente))
        .eq('id', id)
        .select('*');

      if (error) throw error;
      return data[0]; // Devolver el primer elemento del array
    } catch (error) {
      throw new Error(`Error al actualizar cliente: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      // Verificar que el cliente existe antes de eliminar
      const existing = await this.getById(id);
      if (!existing) return false;

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

  async getByUsuario(usuario_id, options = {}) {
    try {
      const { limit = 50, offset = 0, order = 'desc' } = options;
      const { from, to } = getPaginationRange(limit, offset);

      const { data, error, count } = await supabase
        .from('cliente')
        .select('*', { count: 'exact' })
        .eq('usuario_id', usuario_id)
        .order('created_at', { ascending: order === 'asc' })
        .range(from, to);

      if (error) throw error;
      return { data, count };
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
      const sanitized = sanitizeSearchTerm(searchTerm);
      const { data, error } = await supabase
        .from('cliente')
        .select('*')
        .eq('usuario_id', usuario_id)
        .ilike('nombre', `%${sanitized}%`)
        .order('nombre', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al buscar clientes: ${error.message}`);
    }
  }
}
