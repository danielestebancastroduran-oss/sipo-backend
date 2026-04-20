import { UsuarioService } from '../services/usuario.service.js';
import logger from '../utils/logger.js';
import { formatPaginatedResponse } from '../utils/pagination.helper.js';

export class UsuarioController {
  constructor() {
    this.usuarioService = new UsuarioService();
  }

  // POST /api/usuarios - REGISTRAR USUARIO
  register = async (req, res) => {
    try {
      const { nombre, apellido, correo, password, rol } = req.body;
      
      // Enviar datos directamente al service
      const userData = {
        nombre,
        apellido,
        correo,
        password, // Enviar password, el service se encargará de encriptarlo
        rol
      };
      
      const usuario = await this.usuarioService.create(userData);

      res.status(201).json({
        success: true,
        message: 'Usuario creado correctamente',
        data: usuario.toPublic()
      });
    } catch (error) {
      logger.error('Error en register usuario:', { error: error.message, stack: error.stack });
      res.status(400).json({
        success: false,
        message: error.message || 'Error al crear el usuario'
      });
    }
  };

  // POST /api/usuarios/login - LOGIN
  login = async (req, res) => {
    try {
      const { correo, password } = req.body;
      
      const usuario = await this.usuarioService.login(correo, password);
      
      res.json({
        success: true,
        message: 'Login exitoso',
        data: usuario // usuario ya incluye el token
      });
    } catch (error) {
      logger.warn('Error en login usuario:', { error: error.message, ip: req.ip });
      res.status(401).json({
        success: false,
        message: error.message || 'Error en el login'
      });
    }
  };

  // GET /api/usuarios - OBTENER USUARIOS
  getAll = async (req, res) => {
    try {
      const { limit, offset, order } = req.query;
      const { data, count } = await this.usuarioService.getAll({ limit, offset, order });
      
      res.json(formatPaginatedResponse(
        data.map(usuario => usuario.toPublic()),
        count,
        limit,
        offset
      ));
    } catch (error) {
      logger.error('Error en getAll usuarios:', { error: error.message });
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener los usuarios'
      });
    }
  };

  // GET /api/usuarios/:id
  getById = async (req, res) => {
    try {
      const { id } = req.params;
      const usuario = await this.usuarioService.getById(id);
      
      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      res.json({
        success: true,
        data: usuario.toPublic(),
        message: 'Usuario obtenido correctamente'
      });
    } catch (error) {
      logger.error('Error en getById usuario:', { error: error.message });
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener el usuario'
      });
    }
  };

  // PUT /api/usuarios/:id
  update = async (req, res) => {
    try {
      const { id } = req.params;
      const usuario = await this.usuarioService.update(id, req.body);
      
      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      res.json({
        success: true,
        data: usuario.toPublic(),
        message: 'Usuario actualizado correctamente'
      });
    } catch (error) {
      logger.error('Error en update usuario:', { error: error.message });
      res.status(400).json({
        success: false,
        message: error.message || 'Error al actualizar el usuario'
      });
    }
  };

  // DELETE /api/usuarios/:id
  delete = async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await this.usuarioService.delete(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Usuario eliminado correctamente'
      });
    } catch (error) {
      logger.error('Error en delete usuario:', { error: error.message });
      res.status(500).json({
        success: false,
        message: error.message || 'Error al eliminar el usuario'
      });
    }
  };

  // GET /api/usuarios/rol/:rol
  getByRol = async (req, res) => {
    try {
      const { rol } = req.params;
      const usuarios = await this.usuarioService.getByRol(rol);
      
      res.json({
        success: true,
        data: usuarios.map(usuario => usuario.toPublic()),
        message: 'Usuarios por rol obtenidos correctamente'
      });
    } catch (error) {
      logger.error('Error en getByRol usuarios:', { error: error.message });
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener usuarios por rol'
      });
    }
  };

  // GET /api/usuarios/activos
  getActivos = async (req, res) => {
    try {
      const usuarios = await this.usuarioService.getActivos();
      
      res.json({
        success: true,
        data: usuarios.map(usuario => usuario.toPublic()),
        message: 'Usuarios activos obtenidos correctamente'
      });
    } catch (error) {
      logger.error('Error en getActivos usuarios:', { error: error.message });
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener usuarios activos'
      });
    }
  };

  // GET /api/usuarios/search/:searchTerm
  searchByNombre = async (req, res) => {
    try {
      const { searchTerm } = req.params;
      const usuarios = await this.usuarioService.searchByNombre(searchTerm);
      
      res.json({
        success: true,
        data: usuarios.map(usuario => usuario.toPublic()),
        message: 'Búsqueda de usuarios completada correctamente'
      });
    } catch (error) {
      logger.error('Error en searchByNombre usuarios:', { error: error.message });
      res.status(500).json({
        success: false,
        message: error.message || 'Error al buscar usuarios'
      });
    }
  };

  // PUT /api/usuarios/:id/ultimo-acceso
  updateUltimoAcceso = async (req, res) => {
    try {
      const { id } = req.params;
      const usuario = await this.usuarioService.updateUltimoAcceso(id);
      
      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      res.json({
        success: true,
        data: usuario.toPublic(),
        message: 'Último acceso actualizado correctamente'
      });
    } catch (error) {
      logger.error('Error en updateUltimoAcceso usuario:', { error: error.message });
      res.status(500).json({
        success: false,
        message: error.message || 'Error al actualizar último acceso'
      });
    }
  };
}
