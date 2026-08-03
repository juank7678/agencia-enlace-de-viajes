# 🚀 GUÍA DE DEPLOYMENT A VERCEL

**Para:** Agencia Enlace de Viajes  
**Status:** Listo para producción  
**Tiempo estimado:** 15-20 minutos

---

## 📋 PRE-REQUISITOS

Antes de desplegar, asegúrate de tener:

### GitHub
- [ ] Repositorio público o privado en GitHub
- [ ] Acceso como propietario o colaborador

### Vercel
- [ ] Cuenta en https://vercel.com (gratis)
- [ ] Email verificado

### Supabase
- [ ] Proyecto Supabase activo
- [ ] RLS habilitado en todas las tablas
- [ ] Usuario admin creado
- [ ] URLs y keys anotadas

### Variables de Entorno
- [ ] `VITE_SUPABASE_URL`
- [ ] `VITE_SUPABASE_ANON_KEY`
- [ ] `VITE_ADMIN_WHATSAPP`
- [ ] `VITE_ADMIN_PASSCODE` (opcional, no usada en Fase 2+)

---

## 🔧 PASO 1: Preparar Repositorio

### 1.1 Crear/Actualizar `.env.example`

Archivo debe estar en git:
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_ADMIN_WHATSAPP=+57322XXXXXXX
```

### 1.2 Verificar `.gitignore`

Asegúrate de que `.env.local` NO se puede commitear:
```bash
.env.local
.env.*.local
```

### 1.3 Build local

Verifica que la app compila:
```bash
npm run build
npm run lint
```

Resultado esperado:
```
✅ vite build successful
✅ dist/ creado
✅ TypeScript lint pasando
```

### 1.4 Último commit

Si hay cambios pendientes:
```bash
git add .
git commit -m "chore: preparar para deployment a Vercel"
git push origin main
```

---

## 🌐 PASO 2: Conectar Vercel

### 2.1 Crear proyecto en Vercel

1. Ve a: https://vercel.com/new
2. Click en: **Import Git Repository**
3. Busca: `agencia-enlace-de-viajes`
4. Click: **Import**

### 2.2 Configurar proyecto

**Project Name:**
```
agencia-enlace-de-viajes
```

**Framework:** 
```
Vite (detectado automáticamente)
```

**Root Directory:**
```
./ (root del repositorio)
```

**Build Command:**
```
npm run build
```

**Output Directory:**
```
dist
```

**Install Command:**
```
npm install
```

---

## 🔐 PASO 3: Variables de Entorno en Vercel

### 3.1 Agregar variables

En la página de configuración del proyecto, click en: **Environment Variables**

Agregar cada una:

**VITE_SUPABASE_URL**
```
https://eveyqelysnkjipbqaweg.supabase.co
```
- Scope: Production, Preview, Development

**VITE_SUPABASE_ANON_KEY**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...icYrCVPo...
```
- Scope: Production, Preview, Development

**VITE_ADMIN_WHATSAPP**
```
+573226136377
```
- Scope: Production, Preview, Development

### 3.2 Verificar variables

Después de agregar, deberías ver:
```
✅ VITE_SUPABASE_URL
✅ VITE_SUPABASE_ANON_KEY
✅ VITE_ADMIN_WHATSAPP
```

⚠️ **NO expongas SUPABASE_SERVICE_ROLE_KEY en Vercel** (es solo local)

---

## 🚀 PASO 4: Deploy

### 4.1 Trigger deploy

Una vez configuradas las variables:

1. Click en: **Deploy**
2. Vercel comenzará a construir
3. Espera 2-3 minutos

Verás progreso:
```
✓ Installing dependencies
✓ Building application
✓ Analyzing bundle size
✓ Deploying to Vercel
```

### 4.2 Esperar a que termine

Cuando termina:
```
✅ Production Deployment
URL: https://agencia-enlace-de-viajes.vercel.app
```

---

## ✅ PASO 5: Verificar Deployment

### 5.1 Abrir la URL

La app debería estar en vivo:
```
https://agencia-enlace-de-viajes.vercel.app
```

### 5.2 Testing básico

- [ ] Página carga sin errores
- [ ] Hero section visible
- [ ] Destinos cargados
- [ ] Promotions desde Supabase
- [ ] Click ⚙️ abre AdminModal
- [ ] Email field visible
- [ ] Password field visible

### 5.3 Testing admin login

- [ ] Click en ⚙️
- [ ] Escribe: `jcguerrero500@gmail.com`
- [ ] Escribe: `EnlaceAdmin2026Seguro!`
- [ ] Click "Iniciar Sesión"
- [ ] ✅ Debería loguear y mostrar panel

### 5.4 Testing de operación admin

- [ ] Crear una promotion (click "Agregar Promoción")
- [ ] Verificar que aparece en la lista
- [ ] Verificar que se guardó en Supabase

### 5.5 Verificar integración Supabase

- [ ] Ir a Supabase Dashboard
- [ ] Verificar que la promotion aparece en tabla `promotions`
- [ ] Verificar timestamp de creación

---

## 🔍 TROUBLESHOOTING

### Error: "Failed to load Supabase"
**Causa:** Variables de entorno no configuradas  
**Solución:** Ve a Project Settings → Environment Variables y agrega todas

### Error: "CORS policy"
**Causa:** Supabase CORS no configurado  
**Solución:** 
1. Ve a Supabase Project Settings → API
2. Agrega tu URL de Vercel en CORS allowed origins:
   ```
   https://agencia-enlace-de-viajes.vercel.app
   ```

### Login no funciona
**Causa:** Usuario admin no existe  
**Solución:** Ve a Supabase Auth → Users y verifica que `jcguerrero500@gmail.com` existe

### Promotions no cargan
**Causa:** RLS bloqueando acceso  
**Solución:** 
1. Ve a SQL Editor de Supabase
2. Ejecuta:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'promotions';
   ```
3. Verifica que existe `promotions_public_read`

---

## 📊 MONITOREO POST-DEPLOY

### Vercel Dashboard

Acceso a:
- Build logs (qué se construyó)
- Deployment history (historial de deploys)
- Performance metrics (velocidad)
- Error logs (errores en runtime)

### Supabase Dashboard

Monitorar:
- Conexiones activas
- Queries ejecutadas
- Errores de RLS
- Storage usage

---

## 🔄 UPDATES FUTUROS

Cuando hagas cambios:

### Local
```bash
git add .
git commit -m "feat: nuevo cambio"
git push origin main
```

### Vercel
- Detecta automáticamente el push
- Trigger nuevo deploy
- Espera a que termine

No necesitas hacer nada manual.

---

## 🌍 DOMINIO PERSONALIZADO (Opcional)

Si quieres usar tu propio dominio:

### Opción 1: Dominio gratis de Vercel
```
agencia-enlace-de-viajes.vercel.app
```
(Ya está incluido)

### Opción 2: Dominio personalizado

1. Ve a: Project Settings → Domains
2. Click: **Add Domain**
3. Escribe: `enlacedeviajes.com` (si tienes)
4. Sigue instrucciones de Vercel

Requiere:
- Tener dominio registrado
- Cambiar DNS settings

---

## 📝 CHECKLIST FINAL

Antes de considerar "listo para producción":

- [ ] ✅ Build compila sin errores
- [ ] ✅ Variables de entorno en Vercel
- [ ] ✅ RLS habilitado en Supabase
- [ ] ✅ Usuario admin creado
- [ ] ✅ Deploy a Vercel completado
- [ ] ✅ URL en vivo y funciona
- [ ] ✅ Login funciona
- [ ] ✅ Crear promotion funciona
- [ ] ✅ Promotions visibles en Supabase
- [ ] ✅ No hay errores en console (F12)
- [ ] ✅ No hay errores en Supabase logs
- [ ] ✅ Respuesta rápida (<2s)

**Cuando todos ✅:** Listo para Fase 3

---

## 📞 SOPORTE

Si algo falla:

1. Revisa console del navegador (F12)
2. Revisa logs en Vercel Dashboard
3. Revisa logs en Supabase
4. Verifica variables de entorno

---

**Status:** Ready for Production ✅

