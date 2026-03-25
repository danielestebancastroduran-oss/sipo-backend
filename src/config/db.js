import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://umjdjcnfveylmbcamtgc.supabase.co";
const supabaseKey = "sb_publishable_QEFc-D1Ip1uvvf7sKLIzNw_zDJChSgj";

export const supabase = createClient(supabaseUrl, supabaseKey);