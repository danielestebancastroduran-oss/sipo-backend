import { supabase } from '../config/db.js';
import { PartidaModel } from '../models/partidas.model.js';
import { v4 as uuidv4 } from 'uuid';
import { getPaginationRange } from '../utils/pagination.helper.js';

export class PartidasService {
  async getAll(options = {}) {
    try {
      const { limit = 50, offset = 0, order = 'desc' } = options;
      const { from, to } = getPaginationRange(limit, offset);

      const { data, error, count } = await supabase
        .from('partidas')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: order === 'asc' })
        .range(from, to);

      if (error) throw error;
      return { data, count };
    } catch (error) {
      throw new Error(`Error al obtener partidas: ${error.message}`);
    }
  }

  async getById(id) {
    try {
      const { data, error } = await supabase
        .from('partidas')
        .select(`
          *,
          obras (nombre, descripcion, estado, usuario_id)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al obtener partida: ${error.message}`);
    }
  }

  async create(partidaData) {
    try {
      const partida = new PartidaModel(partidaData);
      const validationErrors = partida.validate();
      
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      // Generar UUID si no existe
      if (!partida.id) {
        partida.id = uuidv4();
      }

      const { data, error } = await supabase
        .from('partidas')
        .insert([PartidaModel.toDatabase(partida)])
        .select(`
          *,
          obras (nombre, descripcion, estado)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al crear partida: ${error.message}`);
    }
  }

  async update(id, partidaData) {
    try {
      const partida = new PartidaModel({ ...partidaData, id });
      const validationErrors = partida.validate();
      
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      const { data, error } = await supabase
        .from('partidas')
        .update(PartidaModel.toDatabase(partida))
        .eq('id', id)
        .select(`
          *,
          obras (nombre, descripcion, estado)
        `);

      if (error) throw error;
      return data[0];
    } catch (error) {
      throw new Error(`Error al actualizar partida: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      // Verificar que la partida existe antes de eliminar
      const existing = await this.getById(id);
      if (!existing) return false;

      const { error } = await supabase
        .from('partidas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      throw new Error(`Error al eliminar partida: ${error.message}`);
    }
  }

  async getByObra(obra_id) {
    try {
      const { data, error } = await supabase
        .from('partidas')
        .select(`
          *,
          obras (nombre, descripcion, estado)
        `)
        .eq('obra_id', obra_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data;
    } catch (error) {
      throw new Error(`Error al obtener partidas de la obra: ${error.message}`);
    }
  }

  async getWithDetails(id) {
    try {
      const { data, error } = await supabase
        .from('partidas')
        .select(`
          *,
          obras (nombre, descripcion, estado)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      
      return data;
    } catch (error) {
      throw new Error(`Error al obtener partida con detalles: ${error.message}`);
    }
  }

  async getAnalysisByObra(obra_id) {
    try {
      const partidas = await this.getByObra(obra_id);
      
      const analysis = {
        total_directo: 0,
        total_materiales: 0,
        total_herramientas: 0,
        total_equipos: 0,
        resumen_por_tipo: {
          materiales: [],
          herramientas: [],
          equipos: []
        },
        partidas_analizadas: []
      };

      partidas.forEach(partida => {
        const partidaAnalysis = {
          id: partida.id,
          nombre: partida.nombre,
          subtotal: partida.subtotal || 0,
          detalles_por_tipo: {
            materiales: [],
            herramientas: [],
            equipos: []
          }
        };

        const apuList = partida.apu_detalle || [];
        apuList.forEach(detalle => {
            const subtotal = detalle.cantidad * detalle.precio_unitario;
            const detalleInfo = {
              ...detalle,
              subtotal
            };

            if (detalle.recursos?.tipo === 'material') {
              analysis.total_materiales += subtotal;
              partidaAnalysis.detalles_por_tipo.materiales.push(detalleInfo);
            } else if (detalle.recursos?.tipo === 'herramienta') {
              analysis.total_herramientas += subtotal;
              partidaAnalysis.detalles_por_tipo.herramientas.push(detalleInfo);
            } else if (detalle.recursos?.tipo === 'equipo') {
              analysis.total_equipos += subtotal;
              partidaAnalysis.detalles_por_tipo.equipos.push(detalleInfo);
            }
          });
        analysis.partidas_analizadas.push(partidaAnalysis);
        analysis.total_directo += partidaAnalysis.subtotal;
      });

      return analysis;
    } catch (error) {
      throw new Error(`Error al generar análisis de obra: ${error.message}`);
    }
  }
}
