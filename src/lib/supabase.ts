import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
export const SUPABASE_REST_URL = `${SUPABASE_URL}/rest/v1`;
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validation on load
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    '❌ ERROR: Supabase credentials not configured. Check your .env.local file. See .env.example for required variables.'
  );
}

// Create Supabase JS client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Standard fetch helper for Supabase REST API endpoints
export async function supabaseFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data: T | null; error: Error | null }> {
  const url = `${SUPABASE_REST_URL}/${endpoint}`;
  const headers = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation',
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMsg = `HTTP Error ${response.status}: ${response.statusText}`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMsg = errorJson.message || errorJson.hint || errorMsg;
      } catch {
        // ignore parse error
      }
      return { data: null, error: new Error(errorMsg) };
    }

    // 204 No Content
    if (response.status === 204) {
      return { data: [] as unknown as T, error: null };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    console.error(`Supabase REST fetch error [${endpoint}]:`, err);
    return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
  }
}
