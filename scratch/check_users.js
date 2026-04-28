import { supabase } from '../src/config/db.js';

async function checkUsers() {
  const { data, error } = await supabase.from('usuarios').select('id, correo, nombre, rol');
  if (error) {
    console.error('Error fetching users:', error);
  } else {
    console.log('Usuarios registrados:', data);
  }
}

checkUsers();
