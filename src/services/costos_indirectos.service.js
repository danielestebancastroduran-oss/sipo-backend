import { supabase } from '../config/db.js';
import { CostosIndirectosModel } from '../models/costos_indirectos.model.js';
import { v4 as uuidv4 } from 'uuid';

export class CostosIndirectosService {
  async getByObra(obra_id) {
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

  async create(costoData) {
    try {
      const costo = new CostosIndirectosModel(costoData);
      const validationErrors = costo.validate();
      
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      if (!costo.id) {
        costo.id = uuidv4();
      }

      const { data, error } = await supabase
        .from('costos_indirectos')
        .insert([CostosIndirectosModel.toDatabase(costo)])
        .select('*')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error al crear costo indirecto: ${error.message}`);
    }
  }

  async update(id, costoData) {
    try {
      const { data, error } = await supabase
        .from('costos_indirectos')
        .update(costoData)
        .eq('id', id)
        .select('*');

      if (error) throw error;
      return data[0];
    } catch (error) {
      throw new Error(`Error al actualizar costo indirecto: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      const { error } = await supabase
        .from('costos_indirectos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      throw new Error(`Error al eliminar costo indirecto: ${error.message}`);
    }
  }

  async upsertAIU(obra_id, { imprevistos, utilidad, retefuente, ica, iva }) {
    try {
      // Buscar si ya existen registros de imprevistos, utilidad y retenciones para esta obra
      const { data: existing } = await supabase
        .from('costos_indirectos')
        .select('*')
        .eq('obra_id', obra_id)
        .in('tipo', ['imprevisto', 'utilidad', 'otro']);

      const imp = existing?.find(c => c.tipo === 'imprevisto');
      const util = existing?.find(c => c.tipo === 'utilidad');
      const rete = existing?.find(c => c.tipo === 'otro' && c.descripcion === 'retefuente');
      const ic = existing?.find(c => c.tipo === 'otro' && c.descripcion === 'ica');
      const iv = existing?.find(c => c.tipo === 'otro' && c.descripcion === 'iva');

      const operations = [];

      if (imprevistos !== undefined) {
        if (imp) operations.push(this.update(imp.id, { porcentaje: imprevistos }));
        else operations.push(this.create({ obra_id, tipo: 'imprevisto', descripcion: 'Imprevistos', porcentaje: imprevistos }));
      }

      if (utilidad !== undefined) {
        if (util) operations.push(this.update(util.id, { porcentaje: utilidad }));
        else operations.push(this.create({ obra_id, tipo: 'utilidad', descripcion: 'Utilidad', porcentaje: utilidad }));
      }

      if (retefuente !== undefined) {
        if (rete) operations.push(this.update(rete.id, { porcentaje: retefuente }));
        else operations.push(this.create({ obra_id, tipo: 'otro', descripcion: 'retefuente', porcentaje: retefuente }));
      }

      if (ica !== undefined) {
        if (ic) operations.push(this.update(ic.id, { porcentaje: ica }));
        else operations.push(this.create({ obra_id, tipo: 'otro', descripcion: 'ica', porcentaje: ica }));
      }

      if (iva !== undefined) {
        if (iv) operations.push(this.update(iv.id, { porcentaje: iva }));
        else operations.push(this.create({ obra_id, tipo: 'otro', descripcion: 'iva', porcentaje: iva }));
      }

      return await Promise.all(operations);
    } catch (error) {
      throw new Error(`Error al guardar porcentajes AIU: ${error.message}`);
    }
  }
}
