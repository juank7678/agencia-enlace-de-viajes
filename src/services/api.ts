import { supabase, supabaseFetch } from '../lib/supabase';
import { ContactMessage, Poster, Promotion } from '../types';
import { INITIAL_POSTERS, INITIAL_PROMOTIONS } from '../data/initialData';
import { validateContactForm, validatePromotion, validateEmail } from '../lib/validators';

const LOCAL_PROMOS_KEY = 'enlace_promos_cache';
const LOCAL_POSTERS_KEY = 'enlace_posters_cache';

// Load initial cached items for instant client-side rendering
function getCached<T>(key: string, fallback: T): T {
  try {
    const cached = localStorage.getItem(key);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed as T;
    }
  } catch (err) {
    console.warn(`Error reading local cache for ${key}`, err);
  }
  return fallback;
}

function setCache<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn(`Error updating local cache for ${key}`, err);
  }
}

// ================= PROMOTIONS =================
export async function getPromotionsFromSupabase(): Promise<Promotion[]> {
  const localCache = getCached<Promotion[]>(LOCAL_PROMOS_KEY, INITIAL_PROMOTIONS);

  try {
    // REST API query: GET /promotions?select=*&order=created_at.desc
    const { data, error } = await supabaseFetch<Promotion[]>('promotions?select=*&order=created_at.desc');

    if (!error && Array.isArray(data) && data.length > 0) {
      setCache(LOCAL_PROMOS_KEY, data);
      return data;
    }
  } catch (err) {
    console.warn('Falling back to local cache/default for promotions', err);
  }

  return localCache;
}

export async function createPromotionInSupabase(
  promo: Omit<Promotion, 'id' | 'created_at'>
): Promise<{ promotion: Promotion | null; error: Error | null }> {
  const newPromoData = {
    ...promo,
    created_at: new Date().toISOString(),
  };

  try {
    // Use Supabase client (automatically includes JWT if user is authenticated)
    const { data, error } = await supabase
      .from('promotions')
      .insert([newPromoData])
      .select();

    if (error) {
      console.error('Supabase error creating promotion:', error.message);
      return { promotion: null, error: new Error(error.message) };
    }

    if (data && data.length > 0) {
      const created = data[0] as Promotion;
      const current = getCached<Promotion[]>(LOCAL_PROMOS_KEY, INITIAL_PROMOTIONS);
      setCache(LOCAL_PROMOS_KEY, [created, ...current]);
      return { promotion: created, error: null };
    }
  } catch (err) {
    console.error('Failed to create promotion in Supabase:', err);
    return { promotion: null, error: err instanceof Error ? err : new Error(String(err)) };
  }

  return { promotion: null, error: new Error('No data returned') };
}

export async function deletePromotionFromSupabase(id: string | number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('promotions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting promotion:', error.message);
      return false;
    }

    // Update local cache
    const current = getCached<Promotion[]>(LOCAL_PROMOS_KEY, INITIAL_PROMOTIONS);
    const filtered = current.filter((p) => String(p.id) !== String(id));
    setCache(LOCAL_PROMOS_KEY, filtered);
    return true;
  } catch (err) {
    console.error('Error deleting promotion from Supabase:', err);
    return false;
  }
}

// ================= POSTERS =================
export async function getPostersFromSupabase(): Promise<Poster[]> {
  const localCache = getCached<Poster[]>(LOCAL_POSTERS_KEY, INITIAL_POSTERS);

  try {
    // REST API query: GET /posters?select=*&order=created_at.desc
    const { data, error } = await supabaseFetch<Poster[]>('posters?select=*&order=created_at.desc');

    if (!error && Array.isArray(data) && data.length > 0) {
      setCache(LOCAL_POSTERS_KEY, data);
      return data;
    }
  } catch (err) {
    console.warn('Falling back to local cache/default for posters', err);
  }

  return localCache;
}

export async function createPosterInSupabase(
  poster: Omit<Poster, 'id' | 'created_at'>
): Promise<{ poster: Poster | null; error: Error | null }> {
  const newPosterData = {
    ...poster,
    created_at: new Date().toISOString(),
  };

  try {
    const { data, error } = await supabase
      .from('posters')
      .insert([newPosterData])
      .select();

    if (error) {
      console.error('Supabase error creating poster:', error.message);
      return { poster: null, error: new Error(error.message) };
    }

    if (data && data.length > 0) {
      const created = data[0] as Poster;
      const current = getCached<Poster[]>(LOCAL_POSTERS_KEY, INITIAL_POSTERS);
      setCache(LOCAL_POSTERS_KEY, [created, ...current]);
      return { poster: created, error: null };
    }
  } catch (err) {
    console.error('Failed to create poster in Supabase:', err);
    return { poster: null, error: err instanceof Error ? err : new Error(String(err)) };
  }

  return { poster: null, error: new Error('No data returned') };
}

export async function deletePosterFromSupabase(id: string | number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('posters')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting poster:', error.message);
      return false;
    }

    const current = getCached<Poster[]>(LOCAL_POSTERS_KEY, INITIAL_POSTERS);
    const filtered = current.filter((p) => String(p.id) !== String(id));
    setCache(LOCAL_POSTERS_KEY, filtered);
    return true;
  } catch (err) {
    console.error('Error deleting poster from Supabase:', err);
    return false;
  }
}

// ================= CONTACTS =================
export async function sendContactToSupabase(
  contact: ContactMessage
): Promise<{ success: boolean; error: Error | null; validationErrors?: Record<string, string> }> {
  // Validate before sending
  const validation = validateContactForm(contact);
  if (!validation.valid) {
    return {
      success: false,
      error: new Error('Validation failed'),
      validationErrors: validation.errors,
    };
  }

  const payload = {
    name: contact.name.trim(),
    email: contact.email.trim().toLowerCase(),
    destination: contact.destination.trim(),
    message: contact.message.trim(),
    created_at: new Date().toISOString(),
  };

  try {
    const { error } = await supabaseFetch('contacts', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (error) {
      console.warn('Contacts insert error (English schema):', error.message);

      // Fallback: try Spanish field naming if the backend table uses Spanish columns
      const spanishPayload = {
        nombre: payload.name,
        correo: payload.email,
        destino: payload.destination,
        mensaje: payload.message,
        created_at: payload.created_at,
      };
      const retry = await supabaseFetch('contacts', {
        method: 'POST',
        body: JSON.stringify(spanishPayload),
      });

      if (retry.error) {
        console.warn('Contacts insert error (both schemas tried):', retry.error.message);
        return { success: false, error: retry.error };
      }
    }

    return { success: true, error: null };
  } catch (err: any) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('Failed to submit contact message to Supabase:', errorMsg);
    return {
      success: false,
      error: new Error(errorMsg),
    };
  }
}
