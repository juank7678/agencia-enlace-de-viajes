import { supabase, describeError, isMissingRelation } from '../lib/supabase';
import { ContactMessage, Poster, PosterInput, Promotion, PromotionInput } from '../types';
import { validateContactForm } from '../lib/validators';

export interface Result<T> {
  data: T | null;
  error: string | null;
}

const READ_TIMEOUT_MS = 10_000;
const CACHE_KEYS = {
  promotions: 'enlace_promos_cache',
  posters: 'enlace_posters_cache',
  banner: 'enlace_banner_text',
} as const;

// ================= CACHE LOCAL =================
// Solo se usa para pintar al instante y como respaldo si Supabase no responde;
// la fuente de verdad siempre es la base de datos.
export function readCache<T>(key: keyof typeof CACHE_KEYS): T | null {
  try {
    const raw = localStorage.getItem(CACHE_KEYS[key]);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeCache(key: keyof typeof CACHE_KEYS, value: unknown): void {
  try {
    localStorage.setItem(CACHE_KEYS[key], JSON.stringify(value));
  } catch {
    // Cuota llena o almacenamiento bloqueado: la caché es opcional.
  }
}

const ok = <T>(data: T): Result<T> => ({ data, error: null });
const fail = <T>(error: Parameters<typeof describeError>[0]): Result<T> => ({ data: null, error: describeError(error) });

function clean<T extends Record<string, unknown>>(input: T): T {
  return Object.fromEntries(
    Object.entries(input).map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v])
  ) as T;
}

// ================= LECTURAS =================
async function fetchList<T>(table: 'promotions' | 'posters'): Promise<Result<T[]>> {
  try {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .order('created_at', { ascending: false })
      .abortSignal(AbortSignal.timeout(READ_TIMEOUT_MS));
    if (error) return fail(error);
    writeCache(table, data);
    return ok(data as T[]);
  } catch (err) {
    return fail({ message: err instanceof Error ? err.message : String(err) });
  }
}

export const fetchPromotions = () => fetchList<Promotion>('promotions');
export const fetchPosters = () => fetchList<Poster>('posters');

export async function fetchBanner(): Promise<Result<string>> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'banner_text')
    .maybeSingle();
  if (error) return fail(error);
  if (data?.value) writeCache('banner', data.value);
  return ok(data?.value ?? '');
}

// ================= ESCRITURAS (ADMIN) =================
// Con RLS, un UPDATE/DELETE sin permisos no da error: afecta 0 filas.
// Por eso se pide la fila de vuelta y se valida que exista.
const NO_ROWS = 'No se guardó ningún cambio: tu usuario no tiene permisos o el registro ya no existe.';

async function insertRow<T>(table: 'promotions' | 'posters', input: Record<string, unknown>): Promise<Result<T>> {
  const { data, error } = await supabase
    .from(table)
    .insert({ ...clean(input), created_at: new Date().toISOString() })
    .select()
    .single();
  if (error) return fail(error);
  return ok(data as T);
}

async function updateRow<T>(table: 'promotions' | 'posters', id: Promotion['id'], input: Record<string, unknown>): Promise<Result<T>> {
  const { data, error } = await supabase.from(table).update(clean(input)).eq('id', id).select();
  if (error) return fail(error);
  if (!data?.length) return { data: null, error: NO_ROWS };
  return ok(data[0] as T);
}

async function deleteRow(table: 'promotions' | 'posters', id: Promotion['id']): Promise<Result<true>> {
  const { data, error } = await supabase.from(table).delete().eq('id', id).select('id');
  if (error) return fail(error);
  if (!data?.length) return { data: null, error: NO_ROWS };
  return ok(true);
}

export const createPromotion = (input: PromotionInput) => insertRow<Promotion>('promotions', { ...input });
export const updatePromotion = (id: Promotion['id'], input: PromotionInput) => updateRow<Promotion>('promotions', id, { ...input });
export const deletePromotion = (id: Promotion['id']) => deleteRow('promotions', id);

export const createPoster = (input: PosterInput) => insertRow<Poster>('posters', { ...input });
export const updatePoster = (id: Poster['id'], input: PosterInput) => updateRow<Poster>('posters', id, { ...input });
export const deletePoster = (id: Poster['id']) => deleteRow('posters', id);

export async function saveBanner(text: string): Promise<Result<string>> {
  const value = text.trim();
  const { error } = await supabase
    .from('site_settings')
    .upsert({ key: 'banner_text', value, updated_at: new Date().toISOString() });
  if (error) {
    if (isMissingRelation(error)) {
      return { data: null, error: 'Falta la tabla site_settings en Supabase. Ejecuta la migración de supabase/migrations.' };
    }
    return fail(error);
  }
  writeCache('banner', value);
  return ok(value);
}

export async function isCurrentUserAdmin(): Promise<boolean | null> {
  const { data, error } = await supabase.rpc('is_admin');
  if (error) return isMissingRelation(error) ? null : false; // null = migración pendiente
  return data === true;
}

// ================= CONTACTOS =================
export async function sendContact(
  contact: ContactMessage
): Promise<{ success: boolean; error: string | null; validationErrors?: Record<string, string> }> {
  const validation = validateContactForm(contact);
  if (!validation.valid) {
    return { success: false, error: 'Revisa los campos del formulario.', validationErrors: validation.errors };
  }

  const payload = {
    name: contact.name.trim(),
    email: contact.email.trim().toLowerCase(),
    destination: contact.destination.trim(),
    message: contact.message.trim(),
    created_at: new Date().toISOString(),
  };

  // Sin .select(): el público puede insertar pero no leer contactos.
  const { error } = await supabase.from('contacts').insert(payload);
  if (!error) return { success: true, error: null };

  // Compatibilidad con tablas creadas con columnas en español.
  if (error.code === 'PGRST204') {
    const retry = await supabase.from('contacts').insert({
      nombre: payload.name,
      correo: payload.email,
      destino: payload.destination,
      mensaje: payload.message,
      created_at: payload.created_at,
    });
    if (!retry.error) return { success: true, error: null };
    return { success: false, error: describeError(retry.error) };
  }

  return { success: false, error: describeError(error) };
}
