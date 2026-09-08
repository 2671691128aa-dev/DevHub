/**
 * Supabase client initialization.
 * Works in both browser (Vite) and Node.js (Serverless Functions / tests).
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

function getEnv(name: string): string | undefined {
  // Vite browser env
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[name];
  }
  // Node.js env
  if (typeof process !== 'undefined' && process.env) {
    return process.env[name];
  }
  return undefined;
}

const supabaseUrl = getEnv('VITE_SUPABASE_URL') ?? getEnv('SUPABASE_URL');
const supabaseKey = getEnv('VITE_SUPABASE_ANON_KEY') ?? getEnv('SUPABASE_ANON_KEY');
const serviceRoleKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');

let _client: SupabaseClient | null = null;
let _serviceClient: SupabaseClient | null = null;

/** Browser client — uses anon key, respects RLS */
export function getSupabase(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseKey) {
    return null;
  }
  if (!_client) {
    _client = createClient(supabaseUrl, supabaseKey);
  }
  return _client;
}

/** Service client — uses service_role key, bypasses RLS (server-side only) */
export function getSupabaseService(): SupabaseClient | null {
  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }
  if (!_serviceClient) {
    _serviceClient = createClient(supabaseUrl, serviceRoleKey);
  }
  return _serviceClient;
}

// Export default client for convenience (browser)
export const supabase = getSupabase();

if (!supabase) {
  // Only warn in dev
  if (typeof window !== 'undefined') {
    console.warn('Supabase env vars not set — chat sync to server disabled.');
  }
}
