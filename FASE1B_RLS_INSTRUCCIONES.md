# 🔐 FASE 1B: INSTRUCCIONES RLS PASO A PASO

## 📍 UBICACIÓN DEL SCRIPT

Archivo: `supabase_rls_setup.sql`

---

## 🚀 CÓMO EJECUTAR EN SUPABASE.IO

### PASO 1: Abrir Supabase Console

1. Ve a: https://app.supabase.com
2. Inicia sesión con tu cuenta
3. Selecciona tu proyecto (Enlace de Viajes)
4. En el menú izquierdo, click en **SQL Editor**

---

### PASO 2: Crear Nueva Query

1. Click en botón azul **+ New Query**
2. Dale un nombre: `RLS Setup Fase 1B`
3. Se abrirá un editor en blanco

---

### PASO 3: Copiar y Pegar el Script

1. Abre el archivo `supabase_rls_setup.sql`
2. Copia **TODO** el contenido (Ctrl+A, Ctrl+C)
3. Pega en el editor de Supabase (Ctrl+V)

---

### PASO 4: Ejecutar el Script

1. Click en botón **Run** (⏵ verde en la esquina superior derecha)
2. **ESPERA** a que termine (puede tardar 5-10 segundos)
3. Deberías ver: `Query executed successfully`

---

### PASO 5: Verificar que RLS Está Habilitado

1. Click en **+ New Query**
2. Copia y pega esto:

```sql
SELECT tablename, rowsecurity FROM pg_tables
WHERE tablename IN ('promotions', 'posters', 'contacts')
ORDER BY tablename;
```

3. Click en **Run**
4. Resultado esperado:
```
tablename  | rowsecurity
-----------+----------
contacts   | true
posters    | true
promotions | true
```

Si ves `true` en las 3 filas = ✅ RLS habilitado correctamente

---

## ⚠️ PROBLEMAS COMUNES

### Problema 1: "Permission denied"
**Causa:** No tienes permisos en el proyecto
**Solución:** Asegúrate de ser el propietario del proyecto o tener rol de admin

### Problema 2: "Table does not exist"
**Causa:** Las tablas `promotions`, `posters`, o `contacts` no existen
**Solución:** Crea las tablas primero (debería haberlas del Supabase inicial)

### Problema 3: "Policy already exists"
**Causa:** Ya ejecutaste el script antes
**Solución:** Primero elimina las policies antiguas:

```sql
DROP POLICY IF EXISTS "promotions_public_read" ON promotions;
DROP POLICY IF EXISTS "promotions_admin_insert" ON promotions;
-- ... etc (elimina todas las policies)
```

Luego vuelve a ejecutar el script

---

## 🔐 QUÉ HACE EL SCRIPT

### Tabla: promotions
- ✅ **SELECT (Leer):** Público - Todos pueden ver
- 🔒 **INSERT (Crear):** Admin - Solo usuarios autenticados
- 🔒 **UPDATE (Editar):** Admin - Solo usuarios autenticados
- 🔒 **DELETE (Eliminar):** Admin - Solo usuarios autenticados

### Tabla: posters
- ✅ **SELECT (Leer):** Público - Todos pueden ver
- 🔒 **INSERT (Crear):** Admin - Solo usuarios autenticados
- 🔒 **UPDATE (Editar):** Admin - Solo usuarios autenticados
- 🔒 **DELETE (Eliminar):** Admin - Solo usuarios autenticados

### Tabla: contacts
- 🔒 **SELECT (Leer):** Admin - Solo usuarios autenticados
- ✅ **INSERT (Crear):** Público - Todos pueden enviar
- 🔒 **UPDATE (Editar):** Admin - Solo usuarios autenticados
- 🔒 **DELETE (Eliminar):** Admin - Solo usuarios autenticados

---

## 📊 ANTES vs DESPUÉS

### ANTES (Sin RLS)
```
GET /promotions          → ✅ Funciona (devuelve todos)
DELETE /promotions?id=1  → ✅ Funciona (elimina sin validar!)
POST /contacts           → ✅ Funciona (guarda cualquier cosa)
```

### DESPUÉS (Con RLS)
```
GET /promotions          → ✅ Funciona (público)
DELETE /promotions?id=1  → 🔒 Bloqueado (sin autenticación)
POST /contacts           → ✅ Funciona (público puede enviar)
GET /contacts            → 🔒 Bloqueado (solo admin puede leer)
```

---

## ⏭️ PRÓXIMO PASO: Implementar Supabase Auth

**Ahora que RLS está habilitado, el frontend NO puede hacer:**
- ❌ DELETE de promotions (bloqueado por RLS)
- ❌ INSERT de promotions (bloqueado por RLS)
- ❌ UPDATE de promotions (bloqueado por RLS)

**Para que admin pueda hacer esto, necesitamos:**
1. Implementar Supabase Auth (login con email/password)
2. Actualizar `src/App.tsx` para usar Supabase Auth en lugar de localStorage
3. Pasar JWT token en headers de requests

**Esto será Fase 2 (Autenticación Real)**

---

## ✅ CHECKLIST

- [ ] Abierto Supabase.io
- [ ] Navegado a SQL Editor
- [ ] Copiado contenido de `supabase_rls_setup.sql`
- [ ] Pegado en editor Supabase
- [ ] Clickeado Run
- [ ] Visto "Query executed successfully"
- [ ] Verificado RLS con script de verificación
- [ ] Visto 3 filas con `true` en rowsecurity

**Si todos están checked:** ✅ FASE 1B COMPLETADA

---

## 🎯 Status Después de Fase 1B

✅ Seguridad Frontend (Fase 1)
✅ Seguridad Backend RLS (Fase 1B)
⏳ Autenticación Real (Fase 2 - próximo)
⏳ Funcionalidad Completa (Fase 2-3)
⏳ Optimización (Fase 3)
⏳ Escalabilidad (Fase 4)

---

**¿Problemas? Reply con el mensaje de error exacto**
