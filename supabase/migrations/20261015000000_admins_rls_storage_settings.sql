-- ============================================================================
-- Enlace de Viajes · Seguridad y contenido administrable
-- ============================================================================
-- Qué hace:
--   1. Crea la tabla `admins` y la función `is_admin()`. Solo los usuarios de
--      esa tabla pueden crear, editar o borrar contenido (antes bastaba con
--      cualquier cuenta registrada).
--   2. Reemplaza TODAS las políticas RLS de promotions, posters y contacts.
--   3. Crea `site_settings` para que el banner sea el mismo para todos los visitantes.
--   4. Crea el bucket público `media` para las imágenes (en lugar de base64 en la BD).
--   5. Activa Realtime en promotions, posters y site_settings.
--
-- Cómo ejecutarlo (Supabase → SQL Editor → New query):
--   a) Cambia el correo en ADMIN_EMAIL por el de tu cuenta de administrador
--      (debe existir en Authentication → Users).
--   b) Pega y ejecuta todo el archivo. Es idempotente: puedes volver a ejecutarlo.
--   c) Desactiva el registro público: Authentication → Sign In / Providers →
--      "Allow new users to sign up" = OFF.
-- ============================================================================

begin;

-- 1. ADMINISTRADORES ---------------------------------------------------------
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;

drop policy if exists admins_self_read on public.admins;
create policy admins_self_read on public.admins
  for select to authenticated using (user_id = auth.uid());

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

do $$
declare
  admin_email constant text := 'CAMBIA_ESTE_CORREO@ejemplo.com';  -- <== ADMIN_EMAIL
  admin_id uuid;
begin
  select id into admin_id from auth.users where lower(email) = lower(admin_email);
  if admin_id is null then
    raise exception 'No existe un usuario con el correo "%". Edita ADMIN_EMAIL en esta migración.', admin_email;
  end if;
  insert into public.admins (user_id) values (admin_id) on conflict do nothing;
end $$;

-- 2. RLS DE CONTENIDO --------------------------------------------------------
-- Se eliminan todas las políticas previas: una sola política permisiva antigua
-- (p. ej. "allow all") anularía las nuevas.
do $$
declare
  pol record;
begin
  for pol in
    select policyname, tablename from pg_policies
    where schemaname = 'public' and tablename in ('promotions', 'posters', 'contacts')
  loop
    execute format('drop policy %I on public.%I', pol.policyname, pol.tablename);
  end loop;
end $$;

alter table public.promotions enable row level security;
alter table public.posters    enable row level security;
alter table public.contacts   enable row level security;

create policy promotions_public_read  on public.promotions for select using (true);
create policy promotions_admin_insert on public.promotions for insert to authenticated with check (public.is_admin());
create policy promotions_admin_update on public.promotions for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy promotions_admin_delete on public.promotions for delete to authenticated using (public.is_admin());

create policy posters_public_read  on public.posters for select using (true);
create policy posters_admin_insert on public.posters for insert to authenticated with check (public.is_admin());
create policy posters_admin_update on public.posters for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy posters_admin_delete on public.posters for delete to authenticated using (public.is_admin());

create policy contacts_public_insert on public.contacts for insert with check (true);
create policy contacts_admin_read    on public.contacts for select to authenticated using (public.is_admin());
create policy contacts_admin_update  on public.contacts for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy contacts_admin_delete  on public.contacts for delete to authenticated using (public.is_admin());

-- Valores por defecto y límites (solo si las columnas existen).
do $$
begin
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'promotions' and column_name = 'created_at') then
    alter table public.promotions alter column created_at set default now();
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'posters' and column_name = 'created_at') then
    alter table public.posters alter column created_at set default now();
  end if;
  -- Frena spam/abuso del formulario público. NOT VALID: no revisa filas antiguas.
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'contacts' and column_name = 'message')
     and not exists (select 1 from pg_constraint where conname = 'contacts_length_limits') then
    alter table public.contacts add constraint contacts_length_limits check (
      char_length(name) <= 120 and char_length(email) <= 254 and
      char_length(coalesce(destination, '')) <= 120 and char_length(message) <= 2000
    ) not valid;
  end if;
end $$;

-- 3. AJUSTES DEL SITIO (BANNER) ---------------------------------------------
create table if not exists public.site_settings (
  key        text primary key,
  value      text not null check (char_length(value) <= 1000),
  updated_at timestamptz not null default now()
);
alter table public.site_settings enable row level security;

drop policy if exists site_settings_public_read  on public.site_settings;
drop policy if exists site_settings_admin_insert on public.site_settings;
drop policy if exists site_settings_admin_update on public.site_settings;
drop policy if exists site_settings_admin_delete on public.site_settings;
create policy site_settings_public_read  on public.site_settings for select using (true);
create policy site_settings_admin_insert on public.site_settings for insert to authenticated with check (public.is_admin());
create policy site_settings_admin_update on public.site_settings for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy site_settings_admin_delete on public.site_settings for delete to authenticated using (public.is_admin());

insert into public.site_settings (key, value)
values ('banner_text', '🌟 <strong>OFERTA ESPECIAL:</strong> 20% de descuento en paquetes al Caribe Colombiano · Código: <strong>CARIBE2026</strong>')
on conflict (key) do nothing;

-- 4. IMÁGENES (STORAGE) -----------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists media_public_read  on storage.objects;
drop policy if exists media_admin_insert on storage.objects;
drop policy if exists media_admin_update on storage.objects;
drop policy if exists media_admin_delete on storage.objects;
create policy media_public_read  on storage.objects for select using (bucket_id = 'media');
create policy media_admin_insert on storage.objects for insert to authenticated with check (bucket_id = 'media' and public.is_admin());
create policy media_admin_update on storage.objects for update to authenticated using (bucket_id = 'media' and public.is_admin());
create policy media_admin_delete on storage.objects for delete to authenticated using (bucket_id = 'media' and public.is_admin());

-- 5. REALTIME ---------------------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array['promotions', 'posters', 'site_settings'] loop
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t
    ) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end $$;

commit;

-- Verificación rápida:
--   select tablename, rowsecurity from pg_tables where schemaname = 'public';
--   select * from public.admins;
