import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import {
  createPoster,
  createPromotion,
  deletePoster,
  deletePromotion,
  fetchBanner,
  fetchPosters,
  fetchPromotions,
  readCache,
  saveBanner,
  updatePoster,
  updatePromotion,
} from '../services/api';
import { INITIAL_POSTERS, INITIAL_PROMOTIONS } from '../data/initialData';
import { DEFAULT_BANNER } from '../config';
import { Poster, PosterInput, Promotion, PromotionInput } from '../types';

const REFRESH_ON_FOCUS_AFTER_MS = 30_000;

type Id = Promotion['id'];
// null = OK; string = mensaje de error para el administrador.
export type MutationResult = Promise<string | null>;

export function useSiteContent() {
  // null = todavía sin datos (ni caché ni red) → se muestra el indicador de carga.
  const [promotions, setPromotions] = useState<Promotion[] | null>(() => readCache<Promotion[]>('promotions'));
  const [posters, setPosters] = useState<Poster[] | null>(() => readCache<Poster[]>('posters'));
  const [bannerText, setBannerText] = useState<string>(() => readCache<string>('banner') || DEFAULT_BANNER);
  const [offline, setOffline] = useState(false);
  const lastFetch = useRef(0);

  const reload = useCallback(async () => {
    lastFetch.current = Date.now();
    const [promos, postersRes, banner] = await Promise.all([fetchPromotions(), fetchPosters(), fetchBanner()]);

    // Con éxito se muestra exactamente lo que hay en la base de datos (aunque esté vacía).
    // Solo si falla se recurre a la caché y, sin caché, al contenido de ejemplo.
    setPromotions((prev) => promos.data ?? prev ?? INITIAL_PROMOTIONS);
    setPosters((prev) => postersRes.data ?? prev ?? INITIAL_POSTERS);

    if (banner.data) setBannerText(banner.data);

    setOffline(Boolean(promos.error || postersRes.error));
    if (promos.error) console.warn('Promociones desde caché:', promos.error);
    if (postersRes.error) console.warn('Posters desde caché:', postersRes.error);
  }, []);

  useEffect(() => {
    reload();

    // Cambios hechos desde otro dispositivo aparecen sin recargar (requiere Realtime en las tablas).
    let timer: ReturnType<typeof setTimeout> | undefined;
    const scheduleReload = () => {
      clearTimeout(timer);
      timer = setTimeout(reload, 400);
    };
    const channel = supabase
      .channel('site-content')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'promotions' }, scheduleReload)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posters' }, scheduleReload)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, scheduleReload)
      .subscribe();

    const onVisible = () => {
      if (document.visibilityState === 'visible' && Date.now() - lastFetch.current > REFRESH_ON_FOCUS_AFTER_MS) {
        reload();
      }
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisible);
      supabase.removeChannel(channel);
    };
  }, [reload]);

  const savePromotion = useCallback(async (input: PromotionInput, id?: Id): MutationResult => {
    const res = id === undefined ? await createPromotion(input) : await updatePromotion(id, input);
    if (!res.data) return res.error;
    const saved = res.data;
    setPromotions((prev) =>
      id === undefined ? [saved, ...(prev ?? [])] : (prev ?? []).map((p) => (String(p.id) === String(id) ? saved : p))
    );
    return null;
  }, []);

  const removePromotion = useCallback(async (id: Id): MutationResult => {
    const res = await deletePromotion(id);
    if (!res.data) return res.error;
    setPromotions((prev) => (prev ?? []).filter((p) => String(p.id) !== String(id)));
    return null;
  }, []);

  const savePoster = useCallback(async (input: PosterInput, id?: Id): MutationResult => {
    const res = id === undefined ? await createPoster(input) : await updatePoster(id, input);
    if (!res.data) return res.error;
    const saved = res.data;
    setPosters((prev) =>
      id === undefined ? [saved, ...(prev ?? [])] : (prev ?? []).map((p) => (String(p.id) === String(id) ? saved : p))
    );
    return null;
  }, []);

  const removePoster = useCallback(async (id: Id): MutationResult => {
    const res = await deletePoster(id);
    if (!res.data) return res.error;
    setPosters((prev) => (prev ?? []).filter((p) => String(p.id) !== String(id)));
    return null;
  }, []);

  const updateBanner = useCallback(async (text: string): MutationResult => {
    const res = await saveBanner(text);
    if (res.error) return res.error;
    setBannerText(text.trim());
    return null;
  }, []);

  return {
    promotions: promotions ?? [],
    posters: posters ?? [],
    bannerText,
    promosLoading: promotions === null,
    postersLoading: posters === null,
    offline,
    reload,
    savePromotion,
    removePromotion,
    savePoster,
    removePoster,
    updateBanner,
  };
}
