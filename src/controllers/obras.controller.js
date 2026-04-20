import { ObrasService } from '../services/obras.service.js';

export class ObrasController {
  constructor() {
    this.obrasService = new ObrasService();
    // Bind methods to ensure this context in Express
    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.getByUsuario = this.getByUsuario.bind(this);
    this.getByEstado = this.getByEstado.bind(this);
    this.getByCliente = this.getByCliente.bind(this);
    this.getByTipo = this.getByTipo.bind(this);
    this.getWithPartidas = this.getWithPartidas.bind(this);
    this.getResumen = this.getResumen.bind(this);
    this.addApuMaterial = this.addApuMaterial.bind(this);
    this.addApuHerramienta = this.addApuHerramienta.bind(this);
    this.addApuEquipo = this.addApuEquipo.bind(this);
    this.removeApuRecurso = this.removeApuRecurso.bind(this);
    this.saveApu = this.saveApu.bind(this);
    this.addCostosAdmin = this.addCostosAdmin.bind(this);
    this.removeCostosAdmin = this.removeCostosAdmin.bind(this);
    this.updateAiuConfig = this.updateAiuConfig.bind(this);
    this.getCostos = this.getCostos.bind(this);
  }

  // GET /api/obras
  getAll = async (req, res) => {
    try {
      const obras = await this.obrasService.getAll();
      res.json({
        success: true,
        data: obras,
        message: 'Obras obtenidas correctamente'
      });
    } catch (error) {
      console.error('Error en getAll obras:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener las obras'
      });
    }
  };

  // GET /api/obras/:id
  getById = async (req, res) => {
    try {
      const { id } = req.params;
      const obra = await this.obrasService.getById(id);
      
      if (!obra) {
        return res.status(404).json({
          success: false,
          message: 'Obra no encontrada'
        });
      }

      res.json({
        success: true,
        data: obra,
        message: 'Obra obtenida correctamente'
      });
    } catch (error) {
      console.error('Error en getById obra:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener la obra'
      });
    }
  };

  // POST /api/obras
  create = async (req, res) => {
    try {
      const obra = await this.obrasService.create(req.body);
      res.status(201).json({
        success: true,
        data: obra,
        message: 'Obra creada correctamente'
      });
    } catch (error) {
      console.error('Error en create obra:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error al crear la obra'
      });
    }
  };

  // PUT /api/obras/:id
  update = async (req, res) => {
    try {
      const { id } = req.params;
      const obra = await this.obrasService.update(id, req.body);
      
      if (!obra) {
        return res.status(404).json({
          success: false,
          message: 'Obra no encontrada'
        });
      }

      res.json({
        success: true,
        data: obra,
        message: 'Obra actualizada correctamente'
      });
    } catch (error) {
      console.error('Error en update obra:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error al actualizar la obra'
      });
    }
  };

  // DELETE /api/obras/:id
  delete = async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await this.obrasService.delete(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Obra no encontrada'
        });
      }

      res.json({
        success: true,
        message: 'Obra eliminada correctamente'
      });
    } catch (error) {
      console.error('Error en delete obra:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al eliminar la obra'
      });
    }
  };

  // GET /api/obras/usuario/:usuario_id
  getByUsuario = async (req, res) => {
    try {
      const { usuario_id } = req.params;
      const obras = await this.obrasService.getByUsuario(usuario_id);
      
      res.json({
        success: true,
        data: obras,
        message: 'Obras del usuario obtenidas correctamente'
      });
    } catch (error) {
      console.error('Error en getByUsuario obras:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener las obras del usuario'
      });
    }
  };

  // GET /api/obras/estado/:estado
  getByEstado = async (req, res) => {
    try {
      const { estado } = req.params;
      const obras = await this.obrasService.getByEstado(estado);
      
      res.json({
        success: true,
        data: obras,
        message: 'Obras por estado obtenidas correctamente'
      });
    } catch (error) {
      console.error('Error en getByEstado obras:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener las obras por estado'
      });
    }
  };

  // GET /api/obras/cliente/:cliente_id
  getByCliente = async (req, res) => {
    try {
      const { cliente_id } = req.params;
      const obras = await this.obrasService.getByCliente(cliente_id);
      
      res.json({
        success: true,
        data: obras,
        message: 'Obras del cliente obtenidas correctamente'
      });
    } catch (error) {
      console.error('Error en getByCliente obras:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener las obras del cliente'
      });
    }
  };

  // GET /api/obras/tipo/:tipo
  getByTipo = async (req, res) => {
    try {
      const { tipo } = req.params;
      const obras = await this.obrasService.getByTipo(tipo);
      
      res.json({
        success: true,
        data: obras,
        message: 'Obras por tipo obtenidas correctamente'
      });
    } catch (error) {
      console.error('Error en getByTipo obras:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener las obras por tipo'
      });
    }
  };

  // GET /api/obras/:id/partidas
  getWithPartidas = async (req, res) => {
    try {
      const { id } = req.params;
      const obra = await this.obrasService.getWithPartidas(id);
      
      if (!obra) {
        return res.status(404).json({
          success: false,
          message: 'Obra no encontrada'
        });
      }

      res.json({
        success: true,
        data: obra,
        message: 'Obra con partidas obtenida correctamente'
      });
    } catch (error) {
      console.error('Error en getWithPartidas obra:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener la obra con partidas'
      });
    }
  };

  // GET /api/dashboard/resumen
  async getResumen(req, res) {
    try {
      const { usuario_id } = req.query;
      
      if (!usuario_id) {
        return res.status(400).json({
          success: false,
          message: 'El ID de usuario es requerido'
        });
      }

      const resumen = await this.obrasService.getResumen(usuario_id);
      
      res.json({
        success: true,
        data: resumen,
        message: 'Resumen obtenido correctamente'
      });
    } catch (error) {
      console.error('Error en getResumen dashboard:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener el resumen del dashboard'
      });
    }
  }

  // 🔹 SOLUCIONES JERÁRQUICAS (Auditoría/Corrección)

  async addApuMaterial(req, res) {
    try {
      const { id, pid } = req.params;
      const result = await this.obrasService.addApuResource(pid, { ...req.body, tipo: 'material' });
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async addApuHerramienta(req, res) {
    try {
      const { id, pid } = req.params;
      const result = await this.obrasService.addApuResource(pid, { ...req.body, tipo: 'herramienta' });
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async addApuEquipo(req, res) {
    try {
      const { id, pid } = req.params;
      const result = await this.obrasService.addApuResource(pid, { ...req.body, tipo: 'equipo' });
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async removeApuRecurso(req, res) {
    try {
      const { pid, recursoId } = req.params;
      await this.obrasService.removeApuRecurso(pid, recursoId);
      res.json({ success: true, message: 'Recurso eliminado del APU' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async saveApu(req, res) {
    try {
      const { pid } = req.params;
      const result = await this.obrasService.saveApu(pid, req.body);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async addCostosAdmin(req, res) {
    try {
      const { id } = req.params;
      const result = await this.obrasService.addCostosAdmin(id, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async removeCostosAdmin(req, res) {
    try {
      const { itemId } = req.params;
      await this.obrasService.removeCostosAdmin(itemId);
      res.json({ success: true, message: 'Ítem de administración eliminado' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async updateAiuConfig(req, res) {
    try {
      const { id } = req.params;
      const result = await this.obrasService.updateAiuConfig(id, req.body);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
  async getCostos(req, res) {
    try {
      const { id } = req.params;
      const costos = await this.obrasService.getCostos(id);
      res.json({ success: true, data: costos });
    } catch (error) {
      console.error('Error en getCostos:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
