import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Cargar variables de entorno
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("⚠️ Faltan variables de entorno: SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY");
  console.error("Asegúrate de tener un archivo .env con estas variables configuradas.");
  process.exit(1);
}

export const supabase = createClient(supabaseUrl, supabaseKey);