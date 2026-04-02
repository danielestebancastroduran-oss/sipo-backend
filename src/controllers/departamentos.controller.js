import { DepartamentosService } from '../services/departamentos.service.js';

export class DepartamentosController {
  constructor() {
    this.departamentosService = new DepartamentosService();
  }

  // GET /api/departamentos
  getAll = async (req, res) => {
    try {
      const departamentos = await this.departamentosService.getAll();
      res.json({
        success: true,
        data: departamentos,
        message: 'Departamentos obtenidos correctamente'
      });
    } catch (error) {
      console.error('Error en getAll departamentos:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener los departamentos'
      });
    }
  };

  // GET /api/departamentos/:id
  getById = async (req, res) => {
    try {
      const { id } = req.params;
      const departamento = await this.departamentosService.getById(id);
      
      if (!departamento) {
        return res.status(404).json({
          success: false,
          message: 'Departamento no encontrado'
        });
      }

      res.json({
        success: true,
        data: departamento,
        message: 'Departamento obtenido correctamente'
      });
    } catch (error) {
      console.error('Error en getById departamento:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener el departamento'
      });
    }
  };

  // POST /api/departamentos
  create = async (req, res) => {
    try {
      const departamento = await this.departamentosService.create(req.body);
      res.status(201).json({
        success: true,
        data: departamento,
        message: 'Departamento creado correctamente'
      });
    } catch (error) {
      console.error('Error en create departamento:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error al crear el departamento'
      });
    }
  };

  // PUT /api/departamentos/:id
  update = async (req, res) => {
    try {
      const { id } = req.params;
      const departamento = await this.departamentosService.update(id, req.body);
      
      if (!departamento) {
        return res.status(404).json({
          success: false,
          message: 'Departamento no encontrado'
        });
      }

      res.json({
        success: true,
        data: departamento,
        message: 'Departamento actualizado correctamente'
      });
    } catch (error) {
      console.error('Error en update departamento:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error al actualizar el departamento'
      });
    }
  };

  // DELETE /api/departamentos/:id
  delete = async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await this.departamentosService.delete(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Departamento no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Departamento eliminado correctamente'
      });
    } catch (error) {
      console.error('Error en delete departamento:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al eliminar el departamento'
      });
    }
  };

  // GET /api/departamentos/dane/:codigo_dane
  getByCodigoDane = async (req, res) => {
    try {
      const { codigo_dane } = req.params;
      const departamento = await this.departamentosService.getByCodigoDane(codigo_dane);
      
      res.json({
        success: true,
        data: departamento,
        message: 'Departamento por código DANE obtenido correctamente'
      });
    } catch (error) {
      console.error('Error en getByCodigoDane departamento:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener el departamento por código DANE'
      });
    }
  };

  // GET /api/departamentos/:id/municipios
  getWithMunicipios = async (req, res) => {
    try {
      const { id } = req.params;
      const departamento = await this.departamentosService.getWithMunicipios(id);
      
      if (!departamento) {
        return res.status(404).json({
          success: false,
          message: 'Departamento no encontrado'
        });
      }

      res.json({
        success: true,
        data: departamento,
        message: 'Departamento con municipios obtenido correctamente'
      });
    } catch (error) {
      console.error('Error en getWithMunicipios departamento:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener el departamento con municipios'
      });
    }
  };

  // GET /api/departamentos/search/:searchTerm
  searchByNombre = async (req, res) => {
    try {
      const { searchTerm } = req.params;
      const departamentos = await this.departamentosService.searchByNombre(searchTerm);
      
      res.json({
        success: true,
        data: departamentos,
        message: 'Búsqueda de departamentos completada correctamente'
      });
    } catch (error) {
      console.error('Error en searchByNombre departamentos:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al buscar departamentos'
      });
    }
  };
}
