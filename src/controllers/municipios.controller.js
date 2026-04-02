import { MunicipiosService } from '../services/municipios.service.js';

export class MunicipiosController {
  constructor() {
    this.municipiosService = new MunicipiosService();
  }

  // GET /api/municipios
  getAll = async (req, res) => {
    try {
      const municipios = await this.municipiosService.getAll();
      res.json({
        success: true,
        data: municipios,
        message: 'Municipios obtenidos correctamente'
      });
    } catch (error) {
      console.error('Error en getAll municipios:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener los municipios'
      });
    }
  };

  // GET /api/municipios/:id
  getById = async (req, res) => {
    try {
      const { id } = req.params;
      const municipio = await this.municipiosService.getById(id);
      
      if (!municipio) {
        return res.status(404).json({
          success: false,
          message: 'Municipio no encontrado'
        });
      }

      res.json({
        success: true,
        data: municipio,
        message: 'Municipio obtenido correctamente'
      });
    } catch (error) {
      console.error('Error en getById municipio:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener el municipio'
      });
    }
  };

  // POST /api/municipios
  create = async (req, res) => {
    try {
      const municipio = await this.municipiosService.create(req.body);
      res.status(201).json({
        success: true,
        data: municipio,
        message: 'Municipio creado correctamente'
      });
    } catch (error) {
      console.error('Error en create municipio:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error al crear el municipio'
      });
    }
  };

  // PUT /api/municipios/:id
  update = async (req, res) => {
    try {
      const { id } = req.params;
      const municipio = await this.municipiosService.update(id, req.body);
      
      if (!municipio) {
        return res.status(404).json({
          success: false,
          message: 'Municipio no encontrado'
        });
      }

      res.json({
        success: true,
        data: municipio,
        message: 'Municipio actualizado correctamente'
      });
    } catch (error) {
      console.error('Error en update municipio:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error al actualizar el municipio'
      });
    }
  };

  // DELETE /api/municipios/:id
  delete = async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await this.municipiosService.delete(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Municipio no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Municipio eliminado correctamente'
      });
    } catch (error) {
      console.error('Error en delete municipio:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al eliminar el municipio'
      });
    }
  };

  // GET /api/municipios/departamento/:departamento_id
  getByDepartamento = async (req, res) => {
    try {
      const { departamento_id } = req.params;
      const municipios = await this.municipiosService.getByDepartamento(departamento_id);
      
      res.json({
        success: true,
        data: municipios,
        message: 'Municipios del departamento obtenidos correctamente'
      });
    } catch (error) {
      console.error('Error en getByDepartamento municipios:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener los municipios del departamento'
      });
    }
  };

  // GET /api/municipios/capitales
  getCapitales = async (req, res) => {
    try {
      const municipios = await this.municipiosService.getCapitales();
      
      res.json({
        success: true,
        data: municipios,
        message: 'Capitales de departamento obtenidas correctamente'
      });
    } catch (error) {
      console.error('Error en getCapitales municipios:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener las capitales'
      });
    }
  };

  // GET /api/municipios/dane/:codigo_dane
  getByCodigoDane = async (req, res) => {
    try {
      const { codigo_dane } = req.params;
      const municipio = await this.municipiosService.getByCodigoDane(codigo_dane);
      
      res.json({
        success: true,
        data: municipio,
        message: 'Municipio por código DANE obtenido correctamente'
      });
    } catch (error) {
      console.error('Error en getByCodigoDane municipio:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener el municipio por código DANE'
      });
    }
  };

  // GET /api/municipios/search/:searchTerm
  searchByNombre = async (req, res) => {
    try {
      const { searchTerm } = req.params;
      const { departamento_id } = req.query;
      const municipios = await this.municipiosService.searchByNombre(searchTerm, departamento_id);
      
      res.json({
        success: true,
        data: municipios,
        message: 'Búsqueda de municipios completada correctamente'
      });
    } catch (error) {
      console.error('Error en searchByNombre municipios:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al buscar municipios'
      });
    }
  };
}
