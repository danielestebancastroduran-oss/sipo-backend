const request = require('supertest');
const { supabase } = require('../../src/config/db.js');
const { app } = require('../../server.js');
const { obrasFixture, expectedResponses } = require('../fixtures/obras.fixture.js');

describe('Obras Integration Tests', () => {
  let testObraId;
  let testClienteId;
  let testUsuarioId;

  beforeAll(async () => {
    // Crear datos de prueba necesarios
    // Crear cliente de prueba
    const { data: clienteData } = await supabase
      .from('cliente')
      .insert([{
        nombre: 'Cliente Test Integration',
        nit: '900999999-9',
        telefono: '3009999999',
        correo: 'test.cliente@integration.com',
        direccion: 'Calle Test #123-45',
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
        apellido: 'Integration',
        correo: 'test.obras@integration.com',
        password_hash: '$2b$10$mock_hash_for_testing',
        rol: 'ingeniero'
      }])
      .select()
      .single();
    
    testUsuarioId = userData?.id;

    // Limpiar obras de prueba existentes
    await supabase
      .from('obras')
      .delete()
      .ilike('nombre', '%Test Integration%');
  });

  afterAll(async () => {
    // Limpiar datos de prueba
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

  describe('POST /api/obras', () => {
    it('debería crear una obra exitosamente', async () => {
      const obraData = {
        ...obrasFixture.validObra,
        cliente_id: testClienteId,
        usuario_id: testUsuarioId
      };

      const response = await request(app)
        .post('/api/obras')
        .send(obraData)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Obra creada correctamente');
      expect(response.body).toHaveProperty('data');
      
      const { data } = response.body;
      expect(data).toHaveProperty('id');
      expect(data).toHaveProperty('nombre', obraData.nombre);
      expect(data).toHaveProperty('cliente_id', obraData.cliente_id);
      expect(data).toHaveProperty('usuario_id', obraData.usuario_id);
      expect(data).toHaveProperty('tipo', obraData.tipo);
      expect(data).toHaveProperty('estado', obraData.estado);
      
      testObraId = data.id;
    });

    it('debería retornar error con datos inválidos', async () => {
      const response = await request(app)
        .post('/api/obras')
        .send(obrasFixture.invalidObra)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    it('debería retornar error sin cliente_id', async () => {
      const invalidData = {
        ...obrasFixture.validObra,
        cliente_id: undefined
      };

      const response = await request(app)
        .post('/api/obras')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('GET /api/obras', () => {
    it('debería obtener todas las obras', async () => {
      const response = await request(app)
        .get('/api/obras')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('message', 'Obras obtenidas correctamente');
      
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/obras/:id', () => {
    it('debería obtener una obra por ID', async () => {
      const response = await request(app)
        .get(`/api/obras/${testObraId}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('message', 'Obra obtenida correctamente');
      
      const { data } = response.body;
      expect(data).toHaveProperty('id', testObraId);
      expect(data).toHaveProperty('nombre');
    });

    it('debería retornar 404 si la obra no existe', async () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174999';
      
      const response = await request(app)
        .get(`/api/obras/${fakeId}`)
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Obra no encontrada');
    });
  });

  describe('PUT /api/obras/:id', () => {
    it('debería actualizar una obra exitosamente', async () => {
      const updateData = obrasFixture.updateObra;

      const response = await request(app)
        .put(`/api/obras/${testObraId}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Obra actualizada correctamente');
      expect(response.body).toHaveProperty('data');
      
      const { data } = response.body;
      expect(data).toHaveProperty('nombre', updateData.nombre);
      expect(data).toHaveProperty('estado', updateData.estado);
    });

    it('debería retornar 404 al actualizar obra inexistente', async () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174999';
      const updateData = obrasFixture.updateObra;

      const response = await request(app)
        .put(`/api/obras/${fakeId}`)
        .send(updateData)
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Obra no encontrada');
    });
  });

  describe('GET /api/obras/estado/:estado', () => {
    it('debería obtener obras por estado', async () => {
      const response = await request(app)
        .get('/api/obras/estado/activo')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('message', 'Obras por estado obtenidas correctamente');
      
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/obras/cliente/:id', () => {
    it('debería obtener obras por cliente', async () => {
      const response = await request(app)
        .get(`/api/obras/cliente/${testClienteId}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('message', 'Obras por cliente obtenidas correctamente');
      
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/obras/tipo/:tipo', () => {
    it('debería obtener obras por tipo', async () => {
      const response = await request(app)
        .get('/api/obras/tipo/residencial')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('message', 'Obras por tipo obtenidas correctamente');
      
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/obras/:id/partidas', () => {
    it('debería obtener obra con partidas', async () => {
      const response = await request(app)
        .get(`/api/obras/${testObraId}/partidas`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('message', 'Obra con partidas obtenida correctamente');
      
      const { data } = response.body;
      expect(data).toHaveProperty('id', testObraId);
      expect(data).toHaveProperty('partidas');
      expect(Array.isArray(data.partidas)).toBe(true);
    });
  });

  describe('DELETE /api/obras/:id', () => {
    it('debería eliminar una obra exitosamente', async () => {
      // Crear una obra para eliminar
      const { data: obraToDelete } = await supabase
        .from('obras')
        .insert([{
          ...obrasFixture.obraFinalizada,
          cliente_id: testClienteId,
          usuario_id: testUsuarioId
        }])
        .select()
        .single();

      const response = await request(app)
        .delete(`/api/obras/${obraToDelete.id}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Obra eliminada correctamente');
    });

    it('debería retornar 404 al eliminar obra inexistente', async () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174999';
      
      const response = await request(app)
        .delete(`/api/obras/${fakeId}`)
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Obra no encontrada');
    });
  });
});
