# 📋 Comandos cURL para probar la API SIPO

## 🔐 USUARIOS (/api/usuarios)

### Registrar usuario
```bash
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "apellido": "Pérez",
    "correo": "juan.perez@email.com",
    "password": "password123",
    "rol": "usuario"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{
    "correo": "maria.garcia@email.com",
    "password": "password123"
  }'
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "id": "ac103bc6-0fc8-47b0-9ea3-0e4e30046941",
    "nombre": "Maria",
    "apellido": "Garcia",
    "correo": "maria.garcia@email.com",
    "rol": "ingeniero",
    "created_at": "2026-04-01T16:41:02.816Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Ejemplo de uso del token en rutas protegidas
```bash
# Usar el token en el header Authorization
curl -X GET http://localhost:3000/api/obras \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Obtener todos los usuarios
```bash
curl -X GET http://localhost:3000/api/usuarios
```

### Obtener usuario por ID
```bash
curl -X GET http://localhost:3000/api/usuarios/1
```

### Actualizar usuario
```bash
curl -X PUT http://localhost:3000/api/usuarios/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Carlos",
    "apellido": "Pérez García",
    "rol": "supervisor"
  }'
```

### Eliminar usuario
```bash
curl -X DELETE http://localhost:3000/api/usuarios/1
```

### Obtener usuarios por rol
```bash
curl -X GET http://localhost:3000/api/usuarios/rol/admin
```

### Obtener usuarios activos
```bash
curl -X GET http://localhost:3000/api/usuarios/activos
```

### Buscar usuarios por nombre
```bash
curl -X GET http://localhost:3000/api/usuarios/search/Juan
```

### Actualizar último acceso
```bash
curl -X PUT http://localhost:3000/api/usuarios/1/ultimo-acceso
```

---

## 🏗️ OBRAS (/api/obras)

### Crear obra
```bash
curl -X POST http://localhost:3000/api/obras \
  -H "Content-Type: application/json" \
  -d '{
    "usuario_id": 1,
    "cliente_id": 1,
    "departamento_id": 1,
    "municipio_id": 1,
    "nombre": "Edificio Residencial Los Pinos",
    "descripcion": "Construcción de edificio de 5 pisos",
    "tipo": "residencial",
    "estado": "borrador"
  }'
```

### Obtener todas las obras
```bash
curl -X GET http://localhost:3000/api/obras
```

### Obtener obra por ID
```bash
curl -X GET http://localhost:3000/api/obras/1
```

### Obtener obras por usuario
```bash
curl -X GET http://localhost:3000/api/obras/usuario/1
```

### Obtener obras por estado
```bash
curl -X GET http://localhost:3000/api/obras/estado/activo
```

### Obtener obras por cliente
```bash
curl -X GET http://localhost:3000/api/obras/cliente/1
```

### Obtener obras por tipo
```bash
curl -X GET http://localhost:3000/api/obras/tipo/residencial
```

### Obtener obra con partidas
```bash
curl -X GET http://localhost:3000/api/obras/1/partidas
```

### Actualizar obra
```bash
curl -X PUT http://localhost:3000/api/obras/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Edificio Residencial Los Pinos (Actualizado)",
    "estado": "activo"
  }'
```

### Eliminar obra
```bash
curl -X DELETE http://localhost:3000/api/obras/1
```

---

## 📋 PARTIDAS (/api/partidas)

### Crear partida
```bash
curl -X POST http://localhost:3000/api/partidas \
  -H "Content-Type: application/json" \
  -d '{
    "obra_id": 1,
    "nombre": "Cimentación",
    "descripcion": "Construcción de cimentación en concreto armado",
    "unidad": "m3",
    "cantidad": 150.5,
    "precio_unitario": 250000.00
  }'
```

### Obtener todas las partidas
```bash
curl -X GET http://localhost:3000/api/partidas
```

### Obtener partida por ID
```bash
curl -X GET http://localhost:3000/api/partidas/1
```

### Obtener partidas por obra
```bash
curl -X GET http://localhost:3000/api/partidas/obra/1
```

### Obtener partida con detalles
```bash
curl -X GET http://localhost:3000/api/partidas/1/details
```

### Obtener análisis por obra
```bash
curl -X GET http://localhost:3000/api/partidas/obra/1/analysis
```

### Actualizar partida
```bash
curl -X PUT http://localhost:3000/api/partidas/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Cimentación (Actualizado)",
    "precio_unitario": 260000.00
  }'
```

### Eliminar partida
```bash
curl -X DELETE http://localhost:3000/api/partidas/1
```

---

## 📊 DETALLES APU (/api/apu-detalles)

### Crear detalle APU
```bash
curl -X POST http://localhost:3000/api/apu-detalles \
  -H "Content-Type: application/json" \
  -d '{
    "partida_id": 1,
    "recurso_id": 1,
    "cuadrilla_id": 1,
    "cantidad": 10.5,
    "precio_unitario": 50000.00,
    "rendimiento": 2.5
  }'
```

### Crear detalles en lote
```bash
curl -X POST http://localhost:3000/api/apu-detalles/batch \
  -H "Content-Type: application/json" \
  -d '{
    "detalles": [
      {
        "partida_id": 1,
        "recurso_id": 1,
        "cuadrilla_id": 1,
        "cantidad": 10.5,
        "precio_unitario": 50000.00
      },
      {
        "partida_id": 1,
        "recurso_id": 2,
        "cuadrilla_id": 1,
        "cantidad": 5.0,
        "precio_unitario": 75000.00
      }
    ]
  }'
```

### Obtener todos los detalles APU
```bash
curl -X GET http://localhost:3000/api/apu-detalles
```

### Obtener detalle por ID
```bash
curl -X GET http://localhost:3000/api/apu-detalles/1
```

### Obtener detalles por partida
```bash
curl -X GET http://localhost:3000/api/apu-detalles/partida/1
```

### Obtener detalles por recurso
```bash
curl -X GET http://localhost:3000/api/apu-detalles/recurso/1
```

### Obtener detalles por cuadrilla
```bash
curl -X GET http://localhost:3000/api/apu-detalles/cuadrilla/1
```

### Obtener detalles por obra
```bash
curl -X GET http://localhost:3000/api/apu-detalles/obra/1
```

### Obtener análisis por partida
```bash
curl -X GET http://localhost:3000/api/apu-detalles/partida/1/analysis
```

### Obtener análisis por obra
```bash
curl -X GET http://localhost:3000/api/apu-detalles/obra/1/analysis
```

### Actualizar detalle APU
```bash
curl -X PUT http://localhost:3000/api/apu-detalles/1 \
  -H "Content-Type: application/json" \
  -d '{
    "cantidad": 12.0,
    "precio_unitario": 52000.00
  }'
```

### Eliminar detalle APU
```bash
curl -X DELETE http://localhost:3000/api/apu-detalles/1
```

---

## 👥 CLIENTES (/api/clientes)

### Crear cliente
```bash
curl -X POST http://localhost:3000/api/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "usuario_id": 1,
    "nombre": "Constructora ABC S.A.",
    "nit": "900123456-7",
    "direccion": "Calle 123 #45-67",
    "telefono": "3001234567",
    "correo": "info@constructoraabc.com"
  }'
```

### Obtener todos los clientes
```bash
curl -X GET http://localhost:3000/api/clientes
```

### Obtener cliente por ID
```bash
curl -X GET http://localhost:3000/api/clientes/1
```

### Obtener clientes por usuario
```bash
curl -X GET http://localhost:3000/api/clientes/usuario/1
```

### Obtener cliente por NIT
```bash
curl -X GET http://localhost:3000/api/clientes/nit/900123456-7
```

### Buscar clientes por nombre
```bash
curl -X GET "http://localhost:3000/api/clientes/search/Constructora?usuario_id=1"
```

### Actualizar cliente
```bash
curl -X PUT http://localhost:3000/api/clientes/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Constructora ABC S.A. (Actualizado)",
    "telefono": "3007654321"
  }'
```

### Eliminar cliente
```bash
curl -X DELETE http://localhost:3000/api/clientes/1
```

---

## 🔧 RECURSOS (/api/recursos)

### Crear recurso
```bash
curl -X POST http://localhost:3000/api/recursos \
  -H "Content-Type: application/json" \
  -d '{
    "usuario_id": 1,
    "nombre": "Cemento Gris 50kg",
    "tipo": "material",
    "unidad": "saco",
    "precio_unitario": 25000.00,
    "descripcion": "Cemento Portland gris presentación 50kg"
  }'
```

### Obtener todos los recursos
```bash
curl -X GET http://localhost:3000/api/recursos
```

### Obtener recurso por ID
```bash
curl -X GET http://localhost:3000/api/recursos/1
```

### Obtener recursos por usuario
```bash
curl -X GET http://localhost:3000/api/recursos/usuario/1
```

### Obtener recursos por tipo
```bash
curl -X GET http://localhost:3000/api/recursos/usuario/1/tipo/material
```

### Buscar recursos por nombre
```bash
curl -X GET "http://localhost:3000/api/recursos/search/Cemento?usuario_id=1"
```

### Obtener recurso con estadísticas de uso
```bash
curl -X GET http://localhost:3000/api/recursos/1/usage
```

### Actualizar recurso
```bash
curl -X PUT http://localhost:3000/api/recursos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "precio_unitario": 27000.00
  }'
```

### Eliminar recurso
```bash
curl -X DELETE http://localhost:3000/api/recursos/1
```

---

## 👷 CUADRILLAS (/api/cuadrillas)

### Crear cuadrilla
```bash
curl -X POST http://localhost:3000/api/cuadrillas \
  -H "Content-Type: application/json" \
  -d '{
    "usuario_id": 1,
    "nombre": "Cuadrilla de Albañilería",
    "descripcion": "Cuadrilla especializada en construcción en mampostería",
    "rendimiento_base": 8.5
  }'
```

### Obtener todas las cuadrillas
```bash
curl -X GET http://localhost:3000/api/cuadrillas
```

### Obtener cuadrilla por ID
```bash
curl -X GET http://localhost:3000/api/cuadrillas/1
```

### Obtener cuadrillas por usuario
```bash
curl -X GET http://localhost:3000/api/cuadrillas/usuario/1
```

### Obtener cuadrilla con trabajadores
```bash
curl -X GET http://localhost:3000/api/cuadrillas/1/trabajadores
```

### Obtener cuadrilla con estadísticas de uso
```bash
curl -X GET http://localhost:3000/api/cuadrillas/1/usage
```

### Buscar cuadrillas por nombre
```bash
curl -X GET "http://localhost:3000/api/cuadrillas/search/Albañilería?usuario_id=1"
```

### Actualizar cuadrilla
```bash
curl -X PUT http://localhost:3000/api/cuadrillas/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Cuadrilla de Albañilería (Actualizado)",
    "rendimiento_base": 9.0
  }'
```

### Eliminar cuadrilla
```bash
curl -X DELETE http://localhost:3000/api/cuadrillas/1
```

---

## 👷 TRABAJADORES (/api/trabajadores)

### Crear trabajador
```bash
curl -X POST http://localhost:3000/api/trabajadores \
  -H "Content-Type: application/json" \
  -d '{
    "usuario_id": 1,
    "nombre": "Carlos Rodríguez",
    "identificacion": "801234567",
    "cargo": "Maestro de Obra",
    "salario_diario": 120000.00,
    "telefono": "3009876543"
  }'
```

### Obtener todos los trabajadores
```bash
curl -X GET http://localhost:3000/api/trabajadores
```

### Obtener trabajador por ID
```bash
curl -X GET http://localhost:3000/api/trabajadores/1
```

### Obtener trabajadores por usuario
```bash
curl -X GET http://localhost:3000/api/trabajadores/usuario/1
```

### Obtener trabajador por identificación
```bash
curl -X GET "http://localhost:3000/api/trabajadores/identificacion/801234567?usuario_id=1"
```

### Obtener trabajadores por cargo
```bash
curl -X GET http://localhost:3000/api/trabajadores/usuario/1/cargo/Maestro%20de%20Obra
```

### Buscar trabajadores por nombre
```bash
curl -X GET "http://localhost:3000/api/trabajadores/search/Carlos?usuario_id=1"
```

### Obtener trabajador con cuadrillas
```bash
curl -X GET http://localhost:3000/api/trabajadores/1/cuadrillas
```

### Actualizar trabajador
```bash
curl -X PUT http://localhost:3000/api/trabajadores/1 \
  -H "Content-Type: application/json" \
  -d '{
    "salario_diario": 130000.00,
    "cargo": "Maestro Principal"
  }'
```

### Eliminar trabajador
```bash
curl -X DELETE http://localhost:3000/api/trabajadores/1
```

---

## 🌍 DEPARTAMENTOS (/api/departamentos)

### Crear departamento
```bash
curl -X POST http://localhost:3000/api/departamentos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Valle del Cauca",
    "codigo_dane": "76"
  }'
```

### Obtener todos los departamentos
```bash
curl -X GET http://localhost:3000/api/departamentos
```

### Obtener departamento por ID
```bash
curl -X GET http://localhost:3000/api/departamentos/1
```

### Obtener departamento por código DANE
```bash
curl -X GET http://localhost:3000/api/departamentos/dane/76
```

### Obtener departamento con municipios
```bash
curl -X GET http://localhost:3000/api/departamentos/1/municipios
```

### Buscar departamentos por nombre
```bash
curl -X GET http://localhost:3000/api/departamentos/search/Cauca
```

### Actualizar departamento
```bash
curl -X PUT http://localhost:3000/api/departamentos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Valle del Cauca (Actualizado)"
  }'
```

### Eliminar departamento
```bash
curl -X DELETE http://localhost:3000/api/departamentos/1
```

---

## 🏙️ MUNICIPIOS (/api/municipios)

### Crear municipio
```bash
curl -X POST http://localhost:3000/api/municipios \
  -H "Content-Type: application/json" \
  -d '{
    "departamento_id": 1,
    "nombre": "Cali",
    "codigo_dane": "76001",
    "es_capital": true
  }'
```

### Obtener todos los municipios
```bash
curl -X GET http://localhost:3000/api/municipios
```

### Obtener municipio por ID
```bash
curl -X GET http://localhost:3000/api/municipios/1
```

### Obtener municipios por departamento
```bash
curl -X GET http://localhost:3000/api/municipios/departamento/1
```

### Obtener capitales de departamento
```bash
curl -X GET http://localhost:3000/api/municipios/capitales
```

### Obtener municipio por código DANE
```bash
curl -X GET http://localhost:3000/api/municipios/dane/76001
```

### Buscar municipios por nombre
```bash
curl -X GET "http://localhost:3000/api/municipios/search/Cali?departamento_id=1"
```

### Actualizar municipio
```bash
curl -X PUT http://localhost:3000/api/municipios/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Santiago de Cali (Actualizado)"
  }'
```

### Eliminar municipio
```bash
curl -X DELETE http://localhost:3000/api/municipios/1
```

---

## 📊 CONFIGURACIÓN AIU (/api/aiu-config)

### Crear configuración AIU
```bash
curl -X POST http://localhost:3000/api/aiu-config \
  -H "Content-Type: application/json" \
  -d '{
    "usuario_id": 1,
    "administracion_porcentaje": 10.0,
    "imprevistos_porcentaje": 5.0,
    "utilidad_porcentaje": 15.0
  }'
```

### Obtener todas las configuraciones AIU
```bash
curl -X GET http://localhost:3000/api/aiu-config
```

### Obtener configuración AIU por ID
```bash
curl -X GET http://localhost:3000/api/aiu-config/1
```

### Obtener configuración AIU por usuario
```bash
curl -X GET http://localhost:3000/api/aiu-config/usuario/1
```

### Guardar configuración AIU por usuario (crear o actualizar)
```bash
curl -X PUT http://localhost:3000/api/aiu-config/usuario/1 \
  -H "Content-Type: application/json" \
  -d '{
    "administracion_porcentaje": 12.0,
    "imprevistos_porcentaje": 6.0,
    "utilidad_porcentaje": 18.0
  }'
```

### Calcular AIU
```bash
curl -X POST http://localhost:3000/api/aiu-config/calculate/1 \
  -H "Content-Type: application/json" \
  -d '{
    "subtotal": 1000000.00
  }'
```

### Obtener configuración AIU por defecto
```bash
curl -X GET http://localhost:3000/api/aiu-config/default
```

### Actualizar configuración AIU
```bash
curl -X PUT http://localhost:3000/api/aiu-config/1 \
  -H "Content-Type: application/json" \
  -d '{
    "administracion_porcentaje": 11.0
  }'
```

### Eliminar configuración AIU
```bash
curl -X DELETE http://localhost:3000/api/aiu-config/1
```

---

## 💰 CONFIGURACIÓN FISCAL (/api/configuracion-fiscal)

### Crear configuración fiscal
```bash
curl -X POST http://localhost:3000/api/configuracion-fiscal \
  -H "Content-Type: application/json" \
  -d '{
    "usuario_id": 1,
    "nit": "900123456-7",
    "nombre_empresa": "Constructora ABC S.A.",
    "direccion": "Calle 123 #45-67",
    "regimen_tributario": "comun",
    "auto_retenedor_ica": true,
    "auto_retenedor_iva": true,
    "porcentaje_reteica": 4.0,
    "porcentaje_reteiva": 15.0
  }'
```

### Obtener todas las configuraciones fiscales
```bash
curl -X GET http://localhost:3000/api/configuracion-fiscal
```

### Obtener configuración fiscal por ID
```bash
curl -X GET http://localhost:3000/api/configuracion-fiscal/1
```

### Obtener configuración fiscal por usuario
```bash
curl -X GET http://localhost:3000/api/configuracion-fiscal/usuario/1
```

### Guardar configuración fiscal por usuario (crear o actualizar)
```bash
curl -X PUT http://localhost:3000/api/configuracion-fiscal/usuario/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nit": "900123456-7",
    "nombre_empresa": "Constructora ABC S.A. (Actualizado)",
    "regimen_tributario": "simplificado"
  }'
```

### Calcular retenciones
```bash
curl -X POST http://localhost:3000/api/configuracion-fiscal/calculate-retenciones/1 \
  -H "Content-Type: application/json" \
  -d '{
    "baseGravable": 5000000.00
  }'
```

### Obtener configuración fiscal por defecto
```bash
curl -X GET http://localhost:3000/api/configuracion-fiscal/default
```

### Validar NIT
```bash
curl -X POST http://localhost:3000/api/configuracion-fiscal/validate-nit/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nit": "900123456-7"
  }'
```

### Actualizar configuración fiscal
```bash
curl -X PUT http://localhost:3000/api/configuracion-fiscal/1 \
  -H "Content-Type: application/json" \
  -d '{
    "porcentaje_reteica": 4.5
  }'
```

### Eliminar configuración fiscal
```bash
curl -X DELETE http://localhost:3000/api/configuracion-fiscal/1
```

---

## 📝 NOTAS IMPORTANTES

1. **URL Base**: `http://localhost:3000` (ajustar si usas otro puerto)
2. **Headers**: Todos los POST/PUT necesitan `Content-Type: application/json`
3. **IDs**: Reemplaza `1` con los IDs reales de tu base de datos
4. **Query Params**: Para búsquedas con parámetros adicionales, usa comillas dobles
5. **Autenticación**: Actualmente no hay middleware de autenticación implementado
6. **Errores**: Los endpoints devuelven JSON con `success: false` y `message` en caso de error

## 🚀 Prueba Rápida

Para probar que el servidor está funcionando:
```bash
curl -X GET http://localhost:3000/
```

Debería responder: `API funcionando`
