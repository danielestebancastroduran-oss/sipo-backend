const request = require('supertest');
const { supabase } = require('../../src/config/db.js');
const { app } = require('../../server.js');
const { recursosFixture, expectedResponses } = require('../fixtures/recursos.fixture.js');

describe('Recursos Integration Tests', () => {
  let testRecursoId;
  let testUsuarioId;

  beforeAll(async () => {
    // Crear usuario de prueba
    const { data: userData } = await supabase
      .from('usuarios')
      .insert([{
        nombre: 'Test',
        apellido: 'Recursos',
        correo: 'test.recursos@integration.com',
        password_hash: '$2b$10$mock_hash_for_testing',
        rol: 'ingeniero'
      }])
      .select()
      .single();
    
    testUsuarioId = userData?.id;

    // Limpiar recursos de prueba existentes
    await supabase
      .from('recursos')
      .delete()
      .ilike('nombre', '%Test Integration%');
  });

  afterAll(async () => {
    // Limpiar datos de prueba
    if (testRecursoId) {
      await supabase
        .from('recursos')
        .delete()
        .eq('id', testRecursoId);
    }
    
    if (testUsuarioId) {
      await supabase
        .from('usuarios')
        .delete()
        .eq('id', testUsuarioId);
    }
  });

  describe('POST /api/recursos', () => {
    it('debería crear un recurso exitosamente', async () => {
      const recursoData = {
        ...recursosFixture.validMaterial,
        usuario_id: testUsuarioId
      };

      const response = await request(app)
        .post('/api/recursos')
        .send(recursoData)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Recurso creado correctamente');
      expect(response.body).toHaveProperty('data');
      
      const { data } = response.body;
      expect(data).toHaveProperty('id');
      expect(data).toHaveProperty('nombre', recursoData.nombre);
      expect(data).toHaveProperty('usuario_id', recursoData.usuario_id);
      expect(data).toHaveProperty('tipo', recursoData.tipo);
      expect(data).toHaveProperty('unidad', recursoData.unidad);
      
      testRecursoId = data.id;
    });

    it('debería crear un recurso de tipo equipo', async () => {
      const recursoData = {
        ...recursosFixture.validEquipo,
        usuario_id: testUsuarioId
      };

      const response = await request(app)
        .post('/api/recursos')
        .send(recursoData)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Recurso creado correctamente');
      
      const { data } = response.body;
      expect(data).toHaveProperty('tipo', 'equipo');
    });

    it('debería crear un recurso de tipo mano_obra', async () => {
      const recursoData = {
        ...recursosFixture.validManoObra,
        usuario_id: testUsuarioId
      };

      const response = await request(app)
        .post('/api/recursos')
        .send(recursoData)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Recurso creado correctamente');
      
      const { data } = response.body;
      expect(data).toHaveProperty('tipo', 'mano_obra');
    });

    it('debería retornar error con datos inválidos', async () => {
      const response = await request(app)
        .post('/api/recursos')
        .send(recursosFixture.invalidRecurso)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    it('debería retornar error sin usuario_id', async () => {
      const invalidData = {
        ...recursosFixture.validMaterial,
        usuario_id: undefined
      };

      const response = await request(app)
        .post('/api/recursos')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('GET /api/recursos', () => {
    it('debería obtener todos los recursos', async () => {
      const response = await request(app)
        .get('/api/recursos')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('message', 'Recursos obtenidos correctamente');
      
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/recursos/:id', () => {
    it('debería obtener un recurso por ID', async () => {
      const response = await request(app)
        .get(`/api/recursos/${testRecursoId}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('message', 'Recurso obtenido correctamente');
      
      const { data } = response.body;
      expect(data).toHaveProperty('id', testRecursoId);
      expect(data).toHaveProperty('nombre');
    });

    it('debería retornar 404 si el recurso no existe', async () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174999';
      
      const response = await request(app)
        .get(`/api/recursos/${fakeId}`)
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Recurso no encontrado');
    });
  });

  describe('PUT /api/recursos/:id', () => {
    it('debería actualizar un recurso exitosamente', async () => {
      const updateData = recursosFixture.updateRecurso;

      const response = await request(app)
        .put(`/api/recursos/${testRecursoId}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Recurso actualizado correctamente');
      expect(response.body).toHaveProperty('data');
      
      const { data } = response.body;
      expect(data).toHaveProperty('nombre', updateData.nombre);
      expect(data).toHaveProperty('precio_unitario', updateData.precio_unitario);
    });

    it('debería retornar 404 al actualizar recurso inexistente', async () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174999';
      const updateData = recursosFixture.updateRecurso;

      const response = await request(app)
        .put(`/api/recursos/${fakeId}`)
        .send(updateData)
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Recurso no encontrado');
    });
  });

  describe('GET /api/recursos/usuario/:id', () => {
    it('debería obtener recursos por usuario', async () => {
      const response = await request(app)
        .get(`/api/recursos/usuario/${testUsuarioId}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('message', 'Recursos del usuario obtenidos correctamente');
      
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/recursos/tipo/:usuario_id/:tipo', () => {
    it('debería obtener recursos por tipo', async () => {
      const response = await request(app)
        .get(`/api/recursos/tipo/${testUsuarioId}/material`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('message', 'Recursos por tipo obtenidos correctamente');
      
      expect(Array.isArray(response.body.data)).toBe(true);
      
      // Verificar que todos los recursos devueltos son del tipo correcto
      response.body.data.forEach(recurso => {
        expect(recurso.tipo).toBe('material');
      });
    });
  });

  describe('GET /api/recursos/search/:searchTerm', () => {
    it('debería buscar recursos por nombre', async () => {
      const response = await request(app)
        .get(`/api/recursos/search/Cemento?usuario_id=${testUsuarioId}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('message', 'Búsqueda de recursos completada correctamente');
      
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('debería retornar 400 sin usuario_id en búsqueda', async () => {
      const response = await request(app)
        .get('/api/recursos/search/Cemento')
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'El ID del usuario es requerido para la búsqueda');
    });
  });

  describe('GET /api/recursos/:id/usage', () => {
    it('debería obtener recurso con estadísticas de uso', async () => {
      const response = await request(app)
        .get(`/api/recursos/${testRecursoId}/usage`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('message', 'Recurso con estadísticas de uso obtenido correctamente');
      
      const { data } = response.body;
      expect(data).toHaveProperty('id', testRecursoId);
      expect(data).toHaveProperty('total_usos');
      expect(data).toHaveProperty('total_cantidad');
      expect(data).toHaveProperty('total_valor');
      expect(data).toHaveProperty('apu_detalles');
      expect(Array.isArray(data.apu_detalles)).toBe(true);
    });

    it('debería retornar 404 si el recurso con uso no existe', async () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174999';
      
      const response = await request(app)
        .get(`/api/recursos/${fakeId}/usage`)
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Recurso no encontrado');
    });
  });

  describe('DELETE /api/recursos/:id', () => {
    it('debería eliminar un recurso exitosamente', async () => {
      // Crear un recurso para eliminar
      const { data: recursoToDelete } = await supabase
        .from('recursos')
        .insert([{
          ...recursosFixture.recursoInactivo,
          usuario_id: testUsuarioId
        }])
        .select()
        .single();

      const response = await request(app)
        .delete(`/api/recursos/${recursoToDelete.id}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Recurso eliminado correctamente');
    });

    it('debería retornar 404 al eliminar recurso inexistente', async () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174999';
      
      const response = await request(app)
        .delete(`/api/recursos/${fakeId}`)
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Recurso no encontrado');
    });
  });
});
