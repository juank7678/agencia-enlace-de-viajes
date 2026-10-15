# Agencia Enlace de Viajes

Sitio web de la agencia (React 19 + Vite + Tailwind 4) con promociones, posters y banner administrables desde el propio sitio. Los datos viven en Supabase. Producción: <https://agencia-enlace-de-viajes.vercel.app>.

## Desarrollo local

```bash
npm install
cp .env.example .env.local   # completa VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY
npm run dev                  # http://localhost:3000
npm run lint && npm run build
```

En Vercel deben existir las mismas variables `VITE_*` (Project → Settings → Environment Variables).

## Base de datos (una sola vez)

1. Supabase → **SQL Editor** → pega `supabase/migrations/20261015000000_admins_rls_storage_settings.sql`.
2. Cambia `CAMBIA_ESTE_CORREO@ejemplo.com` por el correo de la cuenta administradora (debe existir en *Authentication → Users*) y ejecuta.
3. *Authentication → Sign In / Providers*: desactiva **Allow new users to sign up**.

La migración:

- Solo los usuarios de la tabla `admins` pueden crear, editar o borrar contenido y leer los contactos. El público solo lee promociones y posters y envía el formulario de contacto.
- Crea `site_settings`, para que el banner sea el mismo para todos los visitantes.
- Crea el bucket público `media`, donde se guardan las imágenes subidas (comprimidas a un máximo de 1600px).
- Activa Realtime: los cambios del panel aparecen en los navegadores abiertos sin recargar.

Mientras no se ejecute, el sitio sigue funcionando: las imágenes se guardan comprimidas en la fila y el banner no se puede cambiar.

## Panel de administración

Ícono ⚙️ en la barra superior → iniciar sesión. Con la sesión activa:

- Las tarjetas de promociones y posters muestran botones para **editar** ✏️ y **eliminar** 🗑️.
- El banner superior tiene un lápiz para editarlo. Admite `<strong>` para resaltar.
- Cada acción confirma el resultado real. Si Supabase rechaza el cambio, se muestra el motivo, por ejemplo falta de permisos o sesión expirada.

## Estructura

```
src/
  config.ts               WhatsApp/teléfono y textos por defecto
  hooks/useSiteContent.ts carga, caché, realtime y mutaciones de contenido
  hooks/useAdminSession.ts sesión y verificación de rol admin (is_admin)
  services/api.ts         acceso a Supabase con errores legibles
  lib/images.ts           compresión y subida de imágenes
  lib/html.ts             HTML seguro para el banner
supabase/migrations/      SQL versionado
docs/historial/           documentación de fases anteriores
```
