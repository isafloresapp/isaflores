import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://xbjjyntjivgskzojugfo.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhiamp5bnRqaXZnc2t6b2p1Z2ZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwNjgzMjcsImV4cCI6MjEwMTY0NDMyN30.6il2qALkVzQeYvHPHYt9yR1vPQXk2uh5wRMAyJE-auE');

async function test() {
  const { data, error } = await supabase.storage.listBuckets();
  console.log('Buckets:', data);
  console.log('Error:', error);
}
test();
