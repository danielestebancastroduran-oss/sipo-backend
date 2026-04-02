import { supabase } from '../config/db.js';
import { ObraModel } from '../models/obras.model.js';

export class ObrasService {
  async getAll() {
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
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
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
      const obra = new ObraModel({ ...obraData, id });
      const validationErrors = obra.validate();
      
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      const { data, error } = await supabase
        .from('obras')
        .update(ObraModel.toDatabase(obra))
        .eq('id', id)
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
      throw new Error(`Error al actualizar obra: ${error.message}`);
    }
  }

  async delete(id) {
    try {
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

  async getByUsuario(usuario_id) {
    try {
      const { data, error } = await supabase
        .from('obras')
        .select(`
          *,
          cliente (nombre, nit, telefono, correo),
          departamentos (nombre, codigo_dane),
          municipios (nombre, codigo_dane)
        `)
        .eq('usuario_id', usuario_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
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
