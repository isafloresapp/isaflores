import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://xbjjyntjivgskzojugfo.supabase.co';
const DEFAULT_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhiamp5bnRqaXZnc2t6b2p1Z2ZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwNjgzMjcsImV4cCI6MjEwMTY0NDMyN30.6il2qALkVzQeYvHPHYt9yR1vPQXk2uh5wRMAyJE-auE';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);