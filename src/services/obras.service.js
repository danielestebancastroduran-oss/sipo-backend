import { supabase } from '../config/db.js';
import { ObraModel } from '../models/obras.model.js';
import { v4 as uuidv4 } from 'uuid';
import { getPaginationRange } from '../utils/pagination.helper.js';

export class ObrasService {
  async getAll(options = {}) {
    try {
      const { limit = 50, offset = 0, order = 'desc' } = options;
      const { from, to } = getPaginationRange(limit, offset);

      const { data, error, count } = await supabase
        .from('obras')
        .select(`
          *,
          usuarios (nombre, apellido, correo),
          cliente (nombre, nit, telefono, correo),
          departamentos (nombre, codigo_dane),
          municipios (nombre, codigo_dane)
        `, { count: 'exact' })
        .order('created_at', { ascending: order === 'asc' })
        .range(from, to);

      if (error) throw error;
      return { data, count };
    } catch (error) {
      throw new Error(`Error al obtener obras: ${error.message}`);
    }
  }

  async getById(id) {
    try {
      const { data, error } = await supabase
        .from('obras')
        .select(`
          *,
          usuarios (nombre, apellido, correo),
          cliente (nombre, nit, telefono, correo, direccion),
          departamentos (nombre, codigo_dane),
          municipios (nombre, codigo_dane)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al obtener obra: ${error.message}`);
    }
  }

  async create(obraData) {
    try {
      const obra = new ObraModel(obraData);
      const validationErrors = obra.validate();
      
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      if(!obra.id) {
        obra.id = uuidv4();
      }
      const { data, error } = await supabase
        .from('obras')
        .insert([ObraModel.toDatabase(obra)])
        .select(`
          *,
          usuarios (nombre, apellido, correo),
          cliente (nombre, nit, telefono, correo),
          departamentos (nombre, codigo_dane),
          municipios (nombre, codigo_dane)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al crear obra: ${error.message}`);
    }
  }

  async update(id, obraData) {
    try {
      const obra = ({ ...obraData, id });

      const { data, error } = await supabase
        .from('obras')
        .update(obra)
        .eq('id', id)
        .select(`
          *,
          usuarios (nombre, apellido, correo),
          cliente (nombre, nit, telefono, correo),
          departamentos (nombre, codigo_dane),
          municipios (nombre, codigo_dane)
        `);

      if (error) throw error;
      return data[0];
    } catch (error) {
      throw new Error(`Error al actualizar obra: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      // Verificar que la obra existe antes de eliminar
      const existing = await this.getById(id);
      if (!existing) return false;

      const { error } = await supabase
        .from('obras')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      throw new Error(`Error al eliminar obra: ${error.message}`);
    }
  }

  async getByUsuario(usuario_id, options = {}) {
    try {
      const { limit = 50, offset = 0, order = 'desc' } = options;
      const { from, to } = getPaginationRange(limit, offset);

      const { data, error, count } = await supabase
        .from('obras')
        .select(`
          *,
          cliente (nombre, nit, telefono, correo),
          departamentos (nombre, codigo_dane),
          municipios (nombre, codigo_dane)
        `, { count: 'exact' })
        .eq('usuario_id', usuario_id)
        .order('created_at', { ascending: order === 'asc' })
        .range(from, to);

      if (error) throw error;
      return { data, count };
    } catch (error) {
      throw new Error(`Error al obtener obras del usuario: ${error.message}`);
    }
  }

  async getByEstado(estado) {
    try {
      const { data, error } = await supabase
        .from('obras')
        .select(`
          *,
          usuarios (nombre, apellido, correo),
          cliente (nombre, nit, telefono, correo),
          departamentos (nombre, codigo_dane),
          municipios (nombre, codigo_dane)
        `)
        .eq('estado', estado)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al obtener obras por estado: ${error.message}`);
    }
  }

  async getByCliente(cliente_id) {
    try {
      const { data, error } = await supabase
        .from('obras')
        .select(`
          *,
          usuarios (nombre, apellido, correo),
          departamentos (nombre, codigo_dane),
          municipios (nombre, codigo_dane)
        `)
        .eq('cliente_id', cliente_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al obtener obras del cliente: ${error.message}`);
    }
  }

  async getByTipo(tipo) {
    try {
      const { data, error } = await supabase
        .from('obras')
        .select(`
          *,
          usuarios (nombre, apellido, correo),
          cliente (nombre, nit, telefono, correo),
          departamentos (nombre, codigo_dane),
          municipios (nombre, codigo_dane)
        `)
        .eq('tipo', tipo)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al obtener obras por tipo: ${error.message}`);
    }
  }

  async getWithPartidas(id) {
    try {
      const { data, error } = await supabase
        .from('obras')
        .select(`
          *,
          usuarios (nombre, apellido, correo),
          cliente (nombre, nit, telefono, correo, direccion),
          departamentos (nombre, codigo_dane),
          municipios (nombre, codigo_dane),
          partidas (
            id,
            nombre,
            descripcion,
            unidad,
            cantidad,
            created_at,
            apu_detalles (
              id,
              cantidad,
              precio_unitario,
              rendimiento,
              recursos (nombre, unidad, tipo),
              cuadrillas (nombre)
            )
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      
      // Calcular totales de la obra
      if (data && data.partidas) {
        let totalDirecto = 0;
        data.partidas.forEach(partida => {
          if (partida.apu_detalles) {
            const subtotalPartida = partida.apu_detalles.reduce((sum, detalle) => 
              sum + (detalle.cantidad * detalle.precio_unitario), 0);
            partida.subtotal = subtotalPartida;
            totalDirecto += subtotalPartida;
          }
        });
        data.total_directo = totalDirecto;
      }
      
      return data;
    } catch (error) {
      throw new Error(`Error al obtener obra con partidas: ${error.message}`);
    }
  }
}
