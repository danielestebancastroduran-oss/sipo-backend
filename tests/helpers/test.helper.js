import { supabase } from '../../src/config/db.js';

export class TestHelper {
  static async limpiarUsuariosTest() {
    try {
      await supabase
        .from('usuarios')
        .delete()
        .in('correo', [
          'juan.perez@email.com',
          'carlos.garcia@email.com',
          'ana.martinez@email.com',
          'test.integration@email.com',
          'test.login@email.com',
          'test.nopassword@email.com',
          'test.invalid.role@email.com',
          'noexiste@email.com'
        ]);
    } catch (error) {
      console.log('Error limpiando usuarios de test:', error);
    }
  }

  static async crearUsuarioTest(userData) {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .insert(userData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.log('Error creando usuario de test:', error);
      throw error;
    }
  }

  static async eliminarUsuario(id) {
    try {
      await supabase
        .from('usuarios')
        .delete()
        .eq('id', id);
    } catch (error) {
      console.log('Error eliminando usuario de test:', error);
    }
  }

  static async obtenerUsuarioPorCorreo(correo) {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('correo', correo)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.log('Error obteniendo usuario de test:', error);
      return null;
    }
  }

  static generarUsuarioAleatorio() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    
    return {
      nombre: `Test${timestamp}`,
      apellido: `User${random}`,
      correo: `test.${timestamp}.${random}@email.com`,
      password: 'password123',
      rol: 'arquitecto'
    };
  }

  static mockResponse() {
    return {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };
  }

  static mockRequest(overrides = {}) {
    return {
      body: {},
      params: {},
      query: {},
      headers: {},
      ...overrides
    };
  }
}

// Helper para esperar un tiempo (útil para tests asíncronos)
export const esperar = (ms) => new Promise(resolve => setTimeout(resolve, ms));
