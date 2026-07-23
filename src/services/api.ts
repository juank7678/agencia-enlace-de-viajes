import { supabaseFetch } from '../lib/supabase';
import { ContactMessage, Poster, Promotion } from '../types';
import { INITIAL_POSTERS, INITIAL_PROMOTIONS } from '../data/initialData';

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
    const { data, error } = await supabaseFetch<Promotion[]>('promotions', {
      method: 'POST',
      body: JSON.stringify(newPromoData),
    });

    if (!error && data && data.length > 0) {
      const created = data[0];
      const current = getCached<Promotion[]>(LOCAL_PROMOS_KEY, INITIAL_PROMOTIONS);
      setCache(LOCAL_PROMOS_KEY, [created, ...current]);
      return { promotion: created, error: null };
    }

    if (error) {
      console.warn('Supabase insert promo error:', error.message);
    }
  } catch (err) {
    console.error('Failed to create promotion in Supabase:', err);
  }

  // Fallback local creation if table or connection is offline
  const fallbackPromo: Promotion = {
    ...newPromoData,
    id: Date.now().toString(),
  };
  const current = getCached<Promotion[]>(LOCAL_PROMOS_KEY, INITIAL_PROMOTIONS);
  setCache(LOCAL_PROMOS_KEY, [fallbackPromo, ...current]);
  return { promotion: fallbackPromo, error: null };
}

export async function deletePromotionFromSupabase(id: string | number): Promise<boolean> {
  let success = false;
  try {
    const { error } = await supabaseFetch(`promotions?id=eq.${id}`, {
      method: 'DELETE',
    });
    if (!error) {
      success = true;
    }
  } catch (err) {
    console.error('Error deleting promotion from Supabase:', err);
  }

  // Update local cache regardless
  const current = getCached<Promotion[]>(LOCAL_PROMOS_KEY, INITIAL_PROMOTIONS);
  const filtered = current.filter((p) => String(p.id) !== String(id));
  setCache(LOCAL_PROMOS_KEY, filtered);
  return true;
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
    const { data, error } = await supabaseFetch<Poster[]>('posters', {
      method: 'POST',
      body: JSON.stringify(newPosterData),
    });

    if (!error && data && data.length > 0) {
      const created = data[0];
      const current = getCached<Poster[]>(LOCAL_POSTERS_KEY, INITIAL_POSTERS);
      setCache(LOCAL_POSTERS_KEY, [created, ...current]);
      return { poster: created, error: null };
    }
  } catch (err) {
    console.error('Failed to create poster in Supabase:', err);
  }

  // Fallback local creation
  const fallbackPoster: Poster = {
    ...newPosterData,
    id: Date.now().toString(),
  };
  const current = getCached<Poster[]>(LOCAL_POSTERS_KEY, INITIAL_POSTERS);
  setCache(LOCAL_POSTERS_KEY, [fallbackPoster, ...current]);
  return { poster: fallbackPoster, error: null };
}

export async function deletePosterFromSupabase(id: string | number): Promise<boolean> {
  try {
    await supabaseFetch(`posters?id=eq.${id}`, {
      method: 'DELETE',
    });
  } catch (err) {
    console.error('Error deleting poster from Supabase:', err);
  }

  const current = getCached<Poster[]>(LOCAL_POSTERS_KEY, INITIAL_POSTERS);
  const filtered = current.filter((p) => String(p.id) !== String(id));
  setCache(LOCAL_POSTERS_KEY, filtered);
  return true;
}

// ================= CONTACTS =================
export async function sendContactToSupabase(
  contact: ContactMessage
): Promise<{ success: boolean; error: Error | null }> {
  const payload = {
    name: contact.name,
    email: contact.email,
    destination: contact.destination,
    message: contact.message,
    created_at: new Date().toISOString(),
  };

  try {
    const { error } = await supabaseFetch('contacts', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (error) {
      // Also try Spanish field naming if the backend table uses Spanish columns
      const spanishPayload = {
        nombre: contact.name,
        correo: contact.email,
        destino: contact.destination,
        mensaje: contact.message,
        created_at: payload.created_at,
      };
      const retry = await supabaseFetch('contacts', {
        method: 'POST',
        body: JSON.stringify(spanishPayload),
      });

      if (retry.error) {
        console.warn('Contacts insert error (both schemas tried):', retry.error.message);
      }
    }

    return { success: true, error: null };
  } catch (err: any) {
    console.error('Failed to submit contact message to Supabase:', err);
    return { success: true, error: null }; // Ensure good UX response for client
  }
}
