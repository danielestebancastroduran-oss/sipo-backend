import { supabase } from '../config/db.js';
import { ApuDetalleModel } from '../models/apu_detalle.model.js';

export class ApuDetalleService {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('apu_detalles')
        .select(`
          *,
          partidas (nombre, descripcion),
          recursos (nombre, unidad, tipo, precio_unitario),
          cuadrillas (nombre, descripcion)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al obtener detalles APU: ${error.message}`);
    }
  }

  async getById(id) {
    try {
      const { data, error } = await supabase
        .from('apu_detalles')
        .select(`
          *,
          partidas (nombre, descripcion, obra_id),
          recursos (nombre, unidad, tipo, precio_unitario),
          cuadrillas (nombre, descripcion)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al obtener detalle APU: ${error.message}`);
    }
  }

  async create(detalleData) {
    try {
      const detalle = new ApuDetalleModel(detalleData);
      const validationErrors = detalle.validate();
      
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      const { data, error } = await supabase
        .from('apu_detalles')
        .insert([ApuDetalleModel.toDatabase(detalle)])
        .select(`
          *,
          partidas (nombre, descripcion),
          recursos (nombre, unidad, tipo, precio_unitario),
          cuadrillas (nombre, descripcion)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al crear detalle APU: ${error.message}`);
    }
  }

  async update(id, detalleData) {
    try {
      const detalle = new ApuDetalleModel({ ...detalleData, id });
      const validationErrors = detalle.validate();
      
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      const { data, error } = await supabase
        .from('apu_detalles')
        .update(ApuDetalleModel.toDatabase(detalle))
        .eq('id', id)
        .select(`
          *,
          partidas (nombre, descripcion),
          recursos (nombre, unidad, tipo, precio_unitario),
          cuadrillas (nombre, descripcion)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al actualizar detalle APU: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      const { error } = await supabase
        .from('apu_detalles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      throw new Error(`Error al eliminar detalle APU: ${error.message}`);
    }
  }

  async getByPartida(partida_id) {
    try {
      const { data, error } = await supabase
        .from('apu_detalles')
        .select(`
          *,
          recursos (nombre, unidad, tipo, precio_unitario),
          cuadrillas (nombre, descripcion)
        `)
        .eq('partida_id', partida_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al obtener detalles de la partida: ${error.message}`);
    }
  }

  async getByRecurso(recurso_id) {
    try {
      const { data, error } = await supabase
        .from('apu_detalles')
        .select(`
          *,
          partidas (nombre, descripcion, obra_id),
          cuadrillas (nombre, descripcion)
        `)
        .eq('recurso_id', recurso_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al obtener detalles por recurso: ${error.message}`);
    }
  }

  async getByCuadrilla(cuadrilla_id) {
    try {
      const { data, error } = await supabase
        .from('apu_detalles')
        .select(`
          *,
          partidas (nombre, descripcion, obra_id),
          recursos (nombre, unidad, tipo, precio_unitario)
        `)
        .eq('cuadrilla_id', cuadrilla_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al obtener detalles por cuadrilla: ${error.message}`);
    }
  }

  async createBatch(detallesData) {
    try {
      const detalles = detallesData.map(detalleData => {
        const detalle = new ApuDetalleModel(detalleData);
        const validationErrors = detalle.validate();
        
        if (validationErrors.length > 0) {
          throw new Error(`Error en detalle: ${validationErrors.join(', ')}`);
        }
        
        return ApuDetalleModel.toDatabase(detalle);
      });

      const { data, error } = await supabase
        .from('apu_detalles')
        .insert(detalles)
        .select(`
          *,
          partidas (nombre, descripcion),
          recursos (nombre, unidad, tipo, precio_unitario),
          cuadrillas (nombre, descripcion)
        `);

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al crear detalles APU en lote: ${error.message}`);
    }
  }

  async getAnalysisByPartida(partida_id) {
    try {
      const detalles = await this.getByPartida(partida_id);
      
      const analysis = {
        total_materiales: 0,
        total_herramientas: 0,
        total_equipos: 0,
        total_general: 0,
        detalles_por_tipo: {
          materiales: [],
          herramientas: [],
          equipos: []
        }
      };

      detalles.forEach(detalle => {
        const subtotal = detalle.getSubtotal ? detalle.getSubtotal() : (detalle.cantidad * detalle.precio_unitario);
        
        if (detalle.recursos?.tipo === 'material') {
          analysis.total_materiales += subtotal;
          analysis.detalles_por_tipo.materiales.push({ ...detalle, subtotal });
        } else if (detalle.recursos?.tipo === 'herramienta') {
          analysis.total_herramientas += subtotal;
          analysis.detalles_por_tipo.herramientas.push({ ...detalle, subtotal });
        } else if (detalle.recursos?.tipo === 'equipo') {
          analysis.total_equipos += subtotal;
          analysis.detalles_por_tipo.equipos.push({ ...detalle, subtotal });
        }
      });

      analysis.total_general = analysis.total_materiales + analysis.total_herramientas + analysis.total_equipos;

      return analysis;
    } catch (error) {
      throw new Error(`Error al generar análisis de partida: ${error.message}`);
    }
  }

  async getByObra(obra_id) {
    try {
      const { data, error } = await supabase
        .from('apu_detalles')
        .select(`
          *,
          partidas (nombre, descripcion),
          recursos (nombre, unidad, tipo, precio_unitario),
          cuadrillas (nombre, descripcion)
        `)
        .eq('partidas.obra_id', obra_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al obtener detalles de la obra: ${error.message}`);
    }
  }

  async getAnalysisByObra(obra_id) {
    try {
      const detalles = await this.getByObra(obra_id);
      
      const analysis = {
        total_materiales: 0,
        total_herramientas: 0,
        total_equipos: 0,
        total_general: 0,
        resumen_por_partida: {},
        detalles_por_tipo: {
          materiales: [],
          herramientas: [],
          equipos: []
        }
      };

      detalles.forEach(detalle => {
        const subtotal = detalle.getSubtotal ? detalle.getSubtotal() : (detalle.cantidad * detalle.precio_unitario);
        
        // Agrupar por partida
        if (!analysis.resumen_por_partida[detalle.partida_id]) {
          analysis.resumen_por_partida[detalle.partida_id] = {
            partida_nombre: detalle.partidas?.nombre || 'Sin nombre',
            subtotal: 0,
            detalles: []
          };
        }
        analysis.resumen_por_partida[detalle.partida_id].subtotal += subtotal;
        analysis.resumen_por_partida[detalle.partida_id].detalles.push({ ...detalle, subtotal });
        
        // Agrupar por tipo
        if (detalle.recursos?.tipo === 'material') {
          analysis.total_materiales += subtotal;
          analysis.detalles_por_tipo.materiales.push({ ...detalle, subtotal });
        } else if (detalle.recursos?.tipo === 'herramienta') {
          analysis.total_herramientas += subtotal;
          analysis.detalles_por_tipo.herramientas.push({ ...detalle, subtotal });
        } else if (detalle.recursos?.tipo === 'equipo') {
          analysis.total_equipos += subtotal;
          analysis.detalles_por_tipo.equipos.push({ ...detalle, subtotal });
        }
      });

      analysis.total_general = analysis.total_materiales + analysis.total_herramientas + analysis.total_equipos;

      return analysis;
    } catch (error) {
      throw new Error(`Error al generar análisis de obra: ${error.message}`);
    }
  }
}
