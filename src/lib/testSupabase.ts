/**
 * Quick Supabase connection test.
 * Run: npx tsx src/lib/testSupabase.ts
 */
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing env vars: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function test() {
  // Test 1: Basic connectivity
  const { data, error } = await supabase.from('conversations').select('id').limit(1);
  if (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  }
  console.log('✅ Supabase connected successfully!');
  console.log(`   conversations table accessible (${data?.length ?? 0} rows)`);

  // Test 2: Check all tables exist
  const tables = ['conversations', 'messages', 'user_preferences'];
  const tableKeys: Record<string, string> = {
    conversations: 'id',
    messages: 'id',
    user_preferences: 'user_id',
  };
  for (const table of tables) {
    const key = tableKeys[table];
    const { error } = await supabase.from(table).select(key).limit(1);
    if (error) {
      console.error(`❌ Table "${table}" not accessible:`, error.message);
    } else {
      console.log(`✅ Table "${table}" accessible`);
    }
  }
}

test();
