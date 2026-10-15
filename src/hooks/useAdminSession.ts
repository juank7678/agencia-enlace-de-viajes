import { useCallback, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { isCurrentUserAdmin } from '../services/api';

/**
 * Un usuario autenticado solo es administrador si figura en la tabla `admins`
 * (función `is_admin()`). Mientras la migración no se haya aplicado se mantiene
 * el comportamiento anterior (cualquier sesión) para no bloquear al dueño.
 */
export function useAdminSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const evaluate = useCallback(async (next: Session | null) => {
    setSession(next);
    if (!next) {
      setIsAdmin(false);
      return;
    }
    const allowed = await isCurrentUserAdmin();
    setIsAdmin(allowed ?? true);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => evaluate(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      // Diferido: llamar a Supabase dentro del callback puede bloquear el cliente de auth.
      setTimeout(() => evaluate(next), 0);
    });
    return () => data.subscription.unsubscribe();
  }, [evaluate]);

  const login = useCallback(async (email: string, password: string): Promise<string | null> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) return error.message === 'Invalid login credentials' ? 'Email o contraseña incorrectos.' : error.message;

    const allowed = await isCurrentUserAdmin();
    if (allowed === false) {
      await supabase.auth.signOut();
      return 'Este usuario no está autorizado como administrador.';
    }
    await evaluate(data.session);
    return null;
  }, [evaluate]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setIsAdmin(false);
  }, []);

  return { session, isAdmin, email: session?.user.email ?? '', login, logout };
}
