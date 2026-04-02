import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://umjdjcnfveylmbcamtgc.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtamRqY25mdmV5bG1iY2FtdGdjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzY5NTk2NSwiZXhwIjoyMDg5MjcxOTY1fQ.mUrRA6rO9RCDQVe2wEnlD2e41dh-pUedegA8oh5S_9E";

export const supabase = createClient(supabaseUrl, supabaseKey);