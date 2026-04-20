const request = require('supertest');
const { supabase } = require('../../src/config/db.js');
const { app } = require('../../server.js');
const { partidasFixture, expectedResponses } = require('../fixtures/partidas.fixture.js');

describe('Partidas Integration Tests', () => {
  let testPartidaId;
  let testObraId;
  let testClienteId;
  let testUsuarioId;

  beforeAll(async () => {
    // Crear datos de prueba necesarios
    // Crear cliente de prueba
    const { data: clienteData } = await supabase
      .from('cliente')
      .insert([{
        nombre: 'Cliente Test Partidas',
        nit: '900888888-8',
        telefono: '3008888888',
        correo: 'test.partidas@integration.com',
        direccion: 'Calle Partidas #123-45',
        departamento_id: '11',
        municipio_id: '001'
      }])
      .select()
      .single();
    
    testClienteId = clienteData?.id;

    // Crear usuario de prueba
    const { data: userData } = await supabase
      .from('usuarios')
      .insert([{
        nombre: 'Test',
        apellido: 'Partidas',
        correo: 'test.partidas@integration.com',
        password_hash: '$2b$10$mock_hash_for_testing',
        rol: 'ingeniero'
      }])
      .select()
      .single();
    
    testUsuarioId = userData?.id;

    // Crear obra de prueba
    const { data: obraData } = await supabase
      .from('obras')
      .insert([{
        nombre: 'Obra Test Partidas',
        descripcion: 'Obra para pruebas de partidas',
        cliente_id: testClienteId,
        usuario_id: testUsuarioId,
        tipo: 'residencial',
        estado: 'activo',
        direccion: 'Calle Test #123-45',
        departamento_id: '11',
        municipio_id: '001',
        fecha_inicio: '2024-01-15',
        fecha_fin: '2025-12-31',
        presupuesto_total: 5000000000
      }])
      .select()
      .single();
    
    testObraId = obraData?.id;

    // Limpiar partidas de prueba existentes
    await supabase
      .from('partidas')
      .delete()
      .ilike('nombre', '%Test Integration%');
  });

  afterAll(async () => {
    // Limpiar datos de prueba
    if (testPartidaId) {
      await supabase
        .from('partidas')
        .delete()
        .eq('id', testPartidaId);
    }
    
    if (testObraId) {
      await supabase
        .from('obras')
        .delete()
        .eq('id', testObraId);
    }
    
    if (testUsuarioId) {
      await supabase
        .from('usuarios')
        .delete()
        .eq('id', testUsuarioId);
    }
    
    if (testClienteId) {
      await supabase
        .from('cliente')
        .delete()
        .eq('id', testClienteId);
    }
  });

  describe('POST /api/partidas', () => {
    it('debería crear una partida exitosamente', async () => {
      const partidaData = {
        ...partidasFixture.validPartida,
        obra_id: testObraId
      };

      const response = await request(app)
        .post('/api/partidas')
        .send(partidaData)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Partida creada correctamente');
      expect(response.body).toHaveProperty('data');
      
      const { data } = response.body;
      expect(data).toHaveProperty('id');
      expect(data).toHaveProperty('nombre', partidaData.nombre);
      expect(data).toHaveProperty('obra_id', partidaData.obra_id);
      expect(data).toHaveProperty('unidad', partidaData.unidad);
      expect(data).toHaveProperty('cantidad', partidaData.cantidad);
      
      testPartidaId = data.id;
    });

    it('debería retornar error con datos inválidos', async () => {
      const response = await request(app)
        .post('/api/partidas')
        .send(partidasFixture.invalidPartida)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    it('debería retornar error sin obra_id', async () => {
      const invalidData = {
        ...partidasFixture.validPartida,
        obra_id: undefined
      };

      const response = await request(app)
        .post('/api/partidas')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('GET /api/partidas', () => {
    it('debería obtener todas las partidas', async () => {
      const response = await request(app)
        .get('/api/partidas')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('message', 'Partidas obtenidas correctamente');
      
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/partidas/:id', () => {
    it('debería obtener una partida por ID', async () => {
      const response = await request(app)
        .get(`/api/partidas/${testPartidaId}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('message', 'Partida obtenida correctamente');
      
      const { data } = response.body;
      expect(data).toHaveProperty('id', testPartidaId);
      expect(data).toHaveProperty('nombre');
    });

    it('debería retornar 404 si la partida no existe', async () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174999';
      
      const response = await request(app)
        .get(`/api/partidas/${fakeId}`)
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Partida no encontrada');
    });
  });

  describe('PUT /api/partidas/:id', () => {
    it('debería actualizar una partida exitosamente', async () => {
      const updateData = partidasFixture.updatePartida;

      const response = await request(app)
        .put(`/api/partidas/${testPartidaId}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Partida actualizada correctamente');
      expect(response.body).toHaveProperty('data');
      
      const { data } = response.body;
      expect(data).toHaveProperty('nombre', updateData.nombre);
      expect(data).toHaveProperty('estado', updateData.estado);
    });

    it('debería retornar 404 al actualizar partida inexistente', async () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174999';
      const updateData = partidasFixture.updatePartida;

      const response = await request(app)
        .put(`/api/partidas/${fakeId}`)
        .send(updateData)
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Partida no encontrada');
    });
  });

  describe('GET /api/partidas/obra/:id', () => {
    it('debería obtener partidas por obra', async () => {
      const response = await request(app)
        .get(`/api/partidas/obra/${testObraId}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('message', 'Partidas por obra obtenidas correctamente');
      
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/partidas/:id/detalles', () => {
    it('debería obtener partida con detalles', async () => {
      const response = await request(app)
        .get(`/api/partidas/${testPartidaId}/detalles`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('message', 'Partida con detalles obtenida correctamente');
      
      const { data } = response.body;
      expect(data).toHaveProperty('id', testPartidaId);
      expect(data).toHaveProperty('apu_detalles');
      expect(Array.isArray(data.apu_detalles)).toBe(true);
    });
  });

  describe('DELETE /api/partidas/:id', () => {
    it('debería eliminar una partida exitosamente', async () => {
      // Crear una partida para eliminar
      const { data: partidaToDelete } = await supabase
        .from('partidas')
        .insert([{
          ...partidasFixture.partidaFinalizada,
          obra_id: testObraId
        }])
        .select()
        .single();

      const response = await request(app)
        .delete(`/api/partidas/${partidaToDelete.id}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Partida eliminada correctamente');
    });

    it('debería retornar 404 al eliminar partida inexistente', async () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174999';
      
      const response = await request(app)
        .delete(`/api/partidas/${fakeId}`)
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Partida no encontrada');
    });
  });
});
