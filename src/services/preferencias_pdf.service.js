import { supabase } from '../config/db.js';
import { PreferenciasPdfModel } from '../models/preferencias_pdf.model.js';
import { v4 as uuidv4 } from 'uuid';

export class PreferenciasPdfService {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('preferencias_pdf')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al obtener preferencias PDF: ${error.message}`);
    }
  }

  async getById(id) {
    try {
      const { data, error } = await supabase
        .from('preferencias_pdf')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code === 'PGRST116') return null;
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al obtener preferencias PDF: ${error.message}`);
    }
  }

  async getByUsuario(usuario_id) {
    try {
      const { data, error } = await supabase
        .from('preferencias_pdf')
        .select('*')
        .eq('usuario_id', usuario_id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    } catch (error) {
      throw new Error(`Error al obtener preferencias PDF del usuario: ${error.message}`);
    }
  }

  async create(prefsData) {
    try {
      const prefs = new PreferenciasPdfModel(prefsData);
      const validationErrors = prefs.validate();

      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      if (!prefs.id) {
        prefs.id = uuidv4();
      }

      const { data, error } = await supabase
        .from('preferencias_pdf')
        .insert([PreferenciasPdfModel.toDatabase(prefs)])
        .select('*')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al crear preferencias PDF: ${error.message}`);
    }
  }

  async update(id, prefsData) {
    try {
      const { data, error } = await supabase
        .from('preferencias_pdf')
        .update(prefsData)
        .eq('id', id)
        .select('*')
        .single();

      if (error && error.code === 'PGRST116') return null;
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al actualizar preferencias PDF: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      const existing = await this.getById(id);
      if (!existing) return false;

      const { error } = await supabase
        .from('preferencias_pdf')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      throw new Error(`Error al eliminar preferencias PDF: ${error.message}`);
    }
  }

  async upsertByUsuario(usuario_id, prefsData) {
    try {
      const existing = await this.getByUsuario(usuario_id);

      if (existing) {
        return await this.update(existing.id, { ...prefsData, usuario_id });
      } else {
        return await this.create({ ...prefsData, usuario_id });
      }
    } catch (error) {
      throw new Error(`Error al guardar preferencias PDF: ${error.message}`);
    }
  }

  // Retorna preferencias del usuario o las predeterminadas si no tiene
  async getOrDefault(usuario_id) {
    try {
      const prefs = await this.getByUsuario(usuario_id);
      if (prefs) return prefs;
      return new PreferenciasPdfModel({ usuario_id });
    } catch (error) {
      throw new Error(`Error al obtener preferencias PDF: ${error.message}`);
    }
  }
}
