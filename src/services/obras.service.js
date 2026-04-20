import { supabase } from '../config/db.js';
import { ObraModel } from '../models/obras.model.js';
import { v4 as uuidv4 } from 'uuid';

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

  async getResumen(usuario_id) {
    try {
      const { data, error } = await supabase
        .from('obras')
        .select('estado, presupuesto_total')
        .eq('usuario_id', usuario_id);

      if (error) throw error;

      return {
        obras_activas: data.filter(o => o.estado === 'activo').length,
        presupuesto_total: data
          .filter(o => o.estado === 'activo')
          .reduce((sum, o) => sum + (Number(o.presupuesto_total) || 0), 0),
        pendientes: data.filter(o => o.estado === 'borrador' || o.estado === 'pendiente').length,
        finalizadas: data.filter(o => o.estado === 'finalizado').length
      };
    } catch (error) {
      throw new Error(`Error al obtener resumen: ${error.message}`);
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
          ),
          costos_indirectos (*)
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

  // 🔹 SOLUCIONES JERÁRQUICAS (Auditoría/Corrección)

  async addApuResource(partida_id, resourceData) {
    try {
      // 1. Verificar/Crear Recurso
      let recursoId = resourceData.id;
      if (!recursoId) {
        const { data: newRec, error: recErr } = await supabase
          .from('recursos')
          .insert([{
            nombre: resourceData.nombre,
            unidad: resourceData.unidad,
            tipo: resourceData.tipo,
            precio_unitario: resourceData.precio_unitario,
            usuario_id: resourceData.usuario_id || null
          }])
          .select()
          .single();
        if (recErr) throw recErr;
        recursoId = newRec.id;
      }

      // 2. Agregar a apu_detalles
      const { data, error } = await supabase
        .from('apu_detalles')
        .insert([{
          partida_id,
          recurso_id: recursoId,
          cantidad: resourceData.cantidad || 0,
          precio_unitario: resourceData.precio_unitario || 0,
          rendimiento: resourceData.rendimiento || 1
        }])
        .select()
        .single();

      if (error) throw error;

      // 3. Obtener obra_id para recalcular
      const { data: partida } = await supabase
        .from('partidas')
        .select('obra_id')
        .eq('id', partida_id)
        .single();
      
      if (partida?.obra_id) {
        await this.recalculateObraBudget(partida.obra_id);
      }

      return data;
    } catch (error) {
      throw new Error(`Error agregando recurso al APU: ${error.message}`);
    }
  }

  async removeApuRecurso(partida_id, recurso_id) {
    try {
      // 1. Obtener obra_id antes de borrar
      const { data: partida } = await supabase
        .from('partidas')
        .select('obra_id')
        .eq('id', partida_id)
        .single();

      // 2. Borrar recurso
      const { error } = await supabase
        .from('apu_detalles')
        .delete()
        .eq('partida_id', partida_id)
        .eq('recurso_id', recurso_id);
      if (error) throw error;

      // 3. Recalcular
      if (partida?.obra_id) {
        await this.recalculateObraBudget(partida.obra_id);
      }

      return true;
    } catch (error) {
      throw new Error(`Error eliminando recurso del APU: ${error.message}`);
    }
  }

  async saveApu(partida_id, data) {
    try {
      // 1. Actualizar rendimiento y cuadrilla
      const { error } = await supabase
        .from('apu_detalles')
        .update({ cuadrilla_id: data.cuadrilla_id, rendimiento: data.rendimiento })
        .eq('partida_id', partida_id)
        .not('cuadrilla_id', 'is', null);
      if (error) throw error;
      
      // 2. Actualizar estado de la partida
      const { data: partida } = await supabase
        .from('partidas')
        .update({ estado: 'listo' })
        .eq('id', partida_id)
        .select('obra_id')
        .single();
      
      // 3. Recalcular
      if (partida?.obra_id) {
        await this.recalculateObraBudget(partida.obra_id);
      }
      
      return true;
    } catch (error) {
      throw new Error(`Error guardando APU: ${error.message}`);
    }
  }

  async addCostosAdmin(obra_id, item) {
    try {
      const { data, error } = await supabase
        .from('costos_indirectos')
        .insert([{
          obra_id,
          tipo: 'administracion',
          descripcion: item.descripcion || item.concepto,
          valor: item.valor || 0
        }])
        .select()
        .single();
      if (error) throw error;

      // Recalcular
      await this.recalculateObraBudget(obra_id);

      return data;
    } catch (error) {
      throw new Error(`Error agregando costo administrativo: ${error.message}`);
    }
  }

  async removeCostosAdmin(itemId) {
    try {
      // 1. Obtener obra_id antes de borrar
      const { data: item } = await supabase
        .from('costos_indirectos')
        .select('obra_id')
        .eq('id', itemId)
        .single();

      // 2. Borrar registro
      const { error } = await supabase
        .from('costos_indirectos')
        .delete()
        .eq('id', itemId);
      if (error) throw error;

      // 3. Recalcular
      if (item?.obra_id) {
        await this.recalculateObraBudget(item.obra_id);
      }

      return true;
    } catch (error) {
      throw new Error(`Error eliminando costo administrativo: ${error.message}`);
    }
  }

  async updateAiuConfig(obra_id, stats) {
    try {
      // Upsert en costos_indirectos para imprevistos y utilidad
      const items = [
        { obra_id, tipo: 'imprevisto', porcentaje: stats.imprevistos, descripcion: 'Imprevistos' },
        { obra_id, tipo: 'utilidad', porcentaje: stats.utilidad, descripcion: 'Utilidad' }
      ];

      for (const item of items) {
        const { error } = await supabase
          .from('costos_indirectos')
          .upsert(item, { onConflict: 'obra_id,tipo' });
        if (error) throw error;
      }
      
      // Recalcular presupuesto total de la obra
      await this.recalculateObraBudget(obra_id);
      
      return true;
    } catch (error) {
      throw new Error(`Error actualizando AIU: ${error.message}`);
    }
  }

  async recalculateObraBudget(obra_id) {
    try {
      // 1. Obtener la obra con todas sus partidas y detalles de APU
      const { data: obra, error: obraErr } = await supabase
        .from('obras')
        .select(`
          *,
          partidas (
            id,
            cantidad,
            apu_detalles (
              cantidad,
              precio_unitario,
              rendimiento,
              cuadrillas (costo_diario)
            )
          ),
          costos_indirectos (*)
        `)
        .eq('id', obra_id)
        .single();

      if (obraErr) throw obraErr;

      let totalDirecto = 0;

      // 2. Recalcular valor unitario de cada partida
      for (const partida of obra.partidas || []) {
        let valorUnitarioPartida = 0;
        
        if (partida.apu_detalles && partida.apu_detalles.length > 0) {
          // Sumar recursos (materiales, equipos, herramienta)
          const totalRecursos = partida.apu_detalles
            .filter(d => !d.cuadrillas)
            .reduce((sum, d) => sum + (Number(d.cantidad) * Number(d.precio_unitario)), 0);
          
          // Sumar cuadrilla (costo_diario / rendimiento)
          const detalleCuadrilla = partida.apu_detalles.find(d => d.cuadrillas);
          const costoCuadrilla = detalleCuadrilla 
            ? (Number(detalleCuadrilla.cuadrillas.costo_diario) / Number(detalleCuadrilla.rendimiento || 1)) 
            : 0;
            
          valorUnitarioPartida = totalRecursos + costoCuadrilla;
        }

        // Actualizar partida en DB si cambió
        await supabase
          .from('partidas')
          .update({ valor_unitario: valorUnitarioPartida })
          .eq('id', partida.id);

        totalDirecto += (valorUnitarioPartida * Number(partida.cantidad || 0));
      }

      // 3. Calcular Indirectos (AIU)
      const adminItems = obra.costos_indirectos.filter(i => i.tipo === 'administracion');
      const totalAdmin = adminItems.reduce((sum, i) => sum + Number(i.valor || 0), 0);
      
      const imprevistoObj = obra.costos_indirectos.find(i => i.tipo === 'imprevisto');
      const utilidadObj = obra.costos_indirectos.find(i => i.tipo === 'utilidad');
      
      const porcImprevisto = Number(imprevistoObj?.porcentaje || 0) / 100;
      const porcUtilidad = Number(utilidadObj?.porcentaje || 0) / 100;
      
      const totalImprevistos = totalDirecto * porcImprevisto;
      const totalUtilidad = totalDirecto * porcUtilidad;
      
      const presupuestoTotal = totalDirecto + totalAdmin + totalImprevistos + totalUtilidad;

      // 4. Persistir totales en la obra
      const { error: updateErr } = await supabase
        .from('obras')
        .update({ 
          presupuesto_total: presupuestoTotal,
          costo_directo: totalDirecto,
          costo_indirecto: totalAdmin + totalImprevistos + totalUtilidad
        })
        .eq('id', obra_id);

      if (updateErr) throw updateErr;

      return { totalDirecto, presupuestoTotal };
    } catch (error) {
      console.error('Error recalculando presupuesto:', error);
      throw error;
    }
  }

  async getCostos(obra_id) {
    try {
      const { data, error } = await supabase
        .from('costos_indirectos')
        .select('*')
        .eq('obra_id', obra_id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al obtener costos indirectos: ${error.message}`);
    }
  }
}
