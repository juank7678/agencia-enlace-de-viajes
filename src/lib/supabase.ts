import { createClient, type PostgrestError } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

if (!isSupabaseConfigured) {
  console.error('Supabase no está configurado: define VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY (ver .env.example).');
}

// URL de relleno para que createClient no lance si faltan variables; las consultas fallarán y se mostrará la caché.
export const supabase = createClient(
  SUPABASE_URL || 'https://not-configured.supabase.co',
  SUPABASE_ANON_KEY || 'not-configured'
);

// Tabla/función inexistente (la migración aún no se ha ejecutado).
export function isMissingRelation(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  return ['42P01', 'PGRST205', 'PGRST202', '42883'].includes(error.code ?? '') ||
    /does not exist|could not find/i.test(error.message ?? '');
}

// Traduce errores técnicos de Supabase a mensajes accionables para el administrador.
export function describeError(error: Partial<PostgrestError> & { status?: number; statusCode?: string } | null): string {
  if (!error) return 'Error desconocido';
  const code = error.code ?? '';
  const msg = error.message ?? '';
  if (code === '42501' || /row-level security|permission denied/i.test(msg)) {
    return 'Tu usuario no tiene permisos de administrador en Supabase.';
  }
  if (code === 'PGRST301' || /jwt expired|invalid jwt/i.test(msg)) {
    return 'Tu sesión expiró. Cierra sesión y vuelve a ingresar.';
  }
  if (code === 'PGRST204' || /column .* (does not exist|could not find)/i.test(msg)) {
    return `La tabla en Supabase no tiene una columna esperada: ${msg}`;
  }
  if (error.status === 413 || error.statusCode === '413' || /payload too large|entity too large/i.test(msg)) {
    return 'La imagen es demasiado pesada. Usa una más liviana.';
  }
  if (/failed to fetch|network/i.test(msg)) {
    return 'Sin conexión con el servidor. Revisa tu internet e intenta de nuevo.';
  }
  return msg || 'Error desconocido';
}
