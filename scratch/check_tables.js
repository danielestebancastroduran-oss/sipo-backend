import { supabase } from '../src/config/db.js';

async function listTables() {
  // En Supabase/PostgREST no hay una forma directa de listar tablas fácilmente sin rpc, 
  // pero podemos intentar consultar algunas comunes para ver si fallan.
  const tables = ['recursos', 'cuadrillas', 'recurso', 'cuadrilla'];
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      console.log(`❌ Table [${table}] error:`, error.message);
    } else {
      console.log(`✅ Table [${table}] exists.`);
    }
  }
}

listTables();
