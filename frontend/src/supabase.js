import { createClient } from "@supabase/supabase-js";

const supabaseURL = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
const supabaseAnonkey = import.meta.env.VITE_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(supabaseURL, supabaseAnonkey);