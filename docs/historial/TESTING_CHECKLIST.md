# ✅ TESTING CHECKLIST - FASE 1-2

**Objetivo:** Verificar que todas las funcionalidades funcionan correctamente  
**Duración estimada:** 30-45 minutos  
**Responsable:** QA / Propietario

---

## 🔍 PRE-TESTING

### Ambiente
- [ ] App corriendo en `http://localhost:3000`
- [ ] Supabase proyecto activo
- [ ] RLS habilitado en Supabase
- [ ] Usuario admin existe en Supabase Auth
- [ ] Browser console limpia (F12)

### Credenciales Listas
- [ ] Email: `jcguerrero500@gmail.com`
- [ ] Contraseña: `EnlaceAdmin2026Seguro!`
- [ ] WhatsApp: `+573226136377`

---

## 🌐 TESTING: LANDING PAGE (Pública)

### Navigation
- [ ] Logo clickeable → scrollea a inicio
- [ ] Menu desktop visible en 1024px+
- [ ] Menu mobile visible en <1024px
- [ ] Links de navegación funcionan:
  - [ ] Inicio
  - [ ] Destinos
  - [ ] Promociones
  - [ ] Publicaciones
  - [ ] Experiencias
  - [ ] Contacto

### Hero Section
- [ ] Background image carga
- [ ] Textos visibles (title, subtitle)
- [ ] CTA "Explorar Destinos" funciona
- [ ] CTA "Hablemos por WhatsApp" abre WhatsApp con +573226136377

### Destinos
- [ ] Se cargan 10 destinos
- [ ] Filtros funcionan (Cultural, Naturaleza, Ciudad, etc)
- [ ] Click en card abre modal
- [ ] Modal cierra con X o click afuera
- [ ] Información visible: título, descripción, precio, duración

### Promociones
- [ ] Se cargan desde Supabase
- [ ] Loading spinner mostrado mientras carga
- [ ] Cards visibles con:
  - [ ] Imagen
  - [ ] Título
  - [ ] Descripción
  - [ ] Precio
  - [ ] Badge (-20% DESC, NUEVO, etc)

### Publicaciones
- [ ] Se cargan posters desde Supabase
- [ ] Click abre lightbox con imagen grande
- [ ] Lightbox se cierra con X o ESC

### Experiencias
- [ ] Carga sin errores
- [ ] Grid responsive

### CTAs
- [ ] "Cotizar viaje" visible y clickeable
- [ ] WhatsApp links funcionan
- [ ] Contacto form visible

### Footer
- [ ] Teléfono real: +573226136377
- [ ] Email: info@enlacedeviajes.com
- [ ] Dirección: Cra. 48A #39A Sur 46
- [ ] RNT: 42508

### Responsiva
- [ ] Mobile (375px): Todo funciona
- [ ] Tablet (768px): Todo funciona
- [ ] Desktop (1280px): Todo funciona
- [ ] Orientación landscape/portrait: OK

---

## 📱 MOBILE-SPECIFIC

### Sticky Bar (Bottom)
- [ ] Visible solo en mobile (<1024px)
- [ ] Botón WhatsApp: +573226136377
- [ ] Botón Llamada: +573226136377
- [ ] No interfiere con contenido

### Touch Targets
- [ ] Botones son clickeables (>48x48px)
- [ ] Espaciado adecuado entre elementos
- [ ] Links no son muy pequeños

---

## 🔐 TESTING: SEGURIDAD

### Variables de Entorno
- [ ] `.env.local` existe (local only)
- [ ] `.env.local` NO aparece en git
- [ ] `.env.example` en git
- [ ] URLs correctas cargadas

### XSS Prevention
- [ ] Banner no ejecuta scripts
- [ ] Intentar inyectar `<script>alert('xss')</script>` → se muestra como texto
- [ ] No hay errores en console

### Validaciones
- [ ] Formulario contacto valida email:
  - [ ] Email vacío → error
  - [ ] Email inválido (ej: "test") → error
  - [ ] Email válido → OK
- [ ] Nombre requerido (3+ chars)
- [ ] Mensaje requerido (10+ chars)

---

## 👤 TESTING: AUTENTICACIÓN ADMIN

### Login
- [ ] Click ⚙️ abre AdminModal
- [ ] Campos visibles: email, password
- [ ] Toggle show/hide password funciona

### Credenciales Incorrectas
- [ ] Email vacío → error "Email requerido"
- [ ] Password vacío → error "Contraseña requerida"
- [ ] Email inválido → error específico de Supabase
- [ ] Password incorrecta → error "Email o contraseña incorrectos"
- [ ] Toast error mostrado

### Credenciales Correctas
- [ ] Email: jcguerrero500@gmail.com
- [ ] Contraseña: EnlaceAdmin2026Seguro!
- [ ] Click "Iniciar Sesión"
- [ ] Loader mostrado
- [ ] Toast "Acceso Concedido"
- [ ] Modal cambia a panel admin

### Panel Admin Desbloqueado
- [ ] Tabs visibles:
  - [ ] Agregar Promoción
  - [ ] Agregar Poster
  - [ ] Editar Banner
- [ ] Botón logout visible (icono ⬅️)
- [ ] Email del usuario mostrado

### Logout
- [ ] Click logout
- [ ] Toast "Sesión cerrada"
- [ ] Panel vuelve a login form
- [ ] Estado se sincroniza

---

## ➕ TESTING: CREAR PROMOCIÓN

### Form Validation
- [ ] Título vacío → error
- [ ] Descripción vacía → error
- [ ] Precio vacío → error
- [ ] Todos campos llenos → OK

### Crear Promotion
- [ ] Título: "Test Promo"
- [ ] Descripción: "This is a test promotion for quality assurance"
- [ ] Precio: "$1.000.000 COP"
- [ ] Badge: "TEST"
- [ ] Categoría: "caribe"
- [ ] Imagen: URL o upload
- [ ] Click "Guardar Promoción"
- [ ] Toast "Promoción guardada"
- [ ] Aparece en lista de promotions

### Verificar en Supabase
- [ ] Ir a Supabase Dashboard
- [ ] Tabla `promotions`
- [ ] Nueva row con título "Test Promo"
- [ ] Timestamp correcto

---

## 🗑️ TESTING: ELIMINAR PROMOCIÓN

### Delete Promotion
- [ ] En lista de promotions, click icono trash
- [ ] Confirmación: "¿Estás seguro?"
- [ ] Click "Sí"
- [ ] Toast "Promoción eliminada"
- [ ] Desaparece de lista
- [ ] Verificar en Supabase que se eliminó

### Delete Sin Confirmar
- [ ] Click delete
- [ ] Click "No" o X
- [ ] Promotion sigue en lista

---

## 📸 TESTING: AGREGAR POSTER

### Form
- [ ] Título requerido
- [ ] Folder selector funciona
- [ ] Image upload o URL

### Crear Poster
- [ ] Título: "Test Poster"
- [ ] Folder: "caribe"
- [ ] Click "Guardar Poster"
- [ ] Aparece en publicaciones

### Verificar en Supabase
- [ ] Tabla `posters` tiene nuevo row

---

## 💬 TESTING: FORMULARIO CONTACTO

### Validación
- [ ] Nombre vacío → error
- [ ] Email vacío → error
- [ ] Email inválido → error "Email no es válido"
- [ ] Mensaje vacío → error
- [ ] Mensaje corto (< 10 chars) → error

### Envío
- [ ] Datos válidos:
  - [ ] Nombre: "Test User"
  - [ ] Email: "test@example.com"
  - [ ] Destino: "Colombia"
  - [ ] Mensaje: "Quiero información sobre el paquete al Caribe"
- [ ] Click "Enviar"
- [ ] Loader mostrado
- [ ] Toast "Solicitud enviada"
- [ ] Form se limpia

### Verificar en Supabase
- [ ] Tabla `contacts` tiene nuevo row
- [ ] Datos coinciden con lo ingresado

---

## 🌐 TESTING: INTEGRACIONES

### WhatsApp
- [ ] Todos los links de WhatsApp van a: +573226136377
- [ ] Link abre WhatsApp (o dialogo de apps)
- [ ] Número no es fake (573001234567)

### Dirección
- [ ] Mostrada correctamente en footer
- [ ] Mostrada en contacto section
- [ ] Formato: Cra. 48A #39A Sur 46, Medellín

### Certificación RNT
- [ ] "RNT 42508" visible en navbar
- [ ] "RNT 42508" visible en footer
- [ ] "RNT 42508" visible en hero

---

## ⚡ PERFORMANCE

### Tiempos
- [ ] Landing page carga en < 2 segundos
- [ ] Admin modal abre en < 500ms
- [ ] Promotions cargan desde Supabase sin delay perceptible
- [ ] Login responde en < 1 segundo

### Bundle Size
- [ ] `npm run build` completa
- [ ] Revisar tamaño dist/:
  - [ ] JS bundle < 500KB (gzipped)
  - [ ] No hay errores de warning

---

## 🐛 CONSOLE ERRORS

### Limpieza
- [ ] F12 → Console
- [ ] NO hay red errors (404, 500)
- [ ] NO hay JavaScript errors
- [ ] NO hay warnings sobre propTypes
- [ ] NO hay CORS errors

---

## 🔄 TESTING: ESTADO SINCRONIZADO

### Auth State
- [ ] Login → ⚙️ muestra verde (isAdmin)
- [ ] Reload página → auth state persiste
- [ ] Logout → ⚙️ vuelve a gris
- [ ] Reload página → logout persiste
- [ ] Abrir en otra pestaña → auth state sincronizado

---

## 📊 TESTING: RLS FUNCIONA

### Lectura Pública
- [ ] Usuario NO autenticado:
  - [ ] Puede ver promotions ✅
  - [ ] Puede ver posters ✅
  - [ ] Puede enviar contacto ✅

### Lectura Privada
- [ ] Usuario autenticado como admin:
  - [ ] Puede leer contactos ✅
- [ ] Usuario NO autenticado:
  - [ ] NO puede leer contactos ❌ (Permission denied)

### Escritura Protegida
- [ ] Admin autenticado:
  - [ ] Puede crear promotion ✅
  - [ ] Puede crear poster ✅
- [ ] Usuario NO autenticado:
  - [ ] NO puede crear promotion ❌
  - [ ] NO puede crear poster ❌

---

## 🧪 EDGE CASES

### Inputs Extremos
- [ ] Nombre muy largo (100+ chars)
- [ ] Email muy largo
- [ ] Mensaje muy largo
- [ ] Caracteres especiales: ñáéíóú
- [ ] Emojis en campos

### Network Issues
- [ ] Simulado: Abrir DevTools → Network → Slow 3G
- [ ] Intentar crear promoción
- [ ] Debería mostrar loading y manejar gracefully

### Concurrent Operations
- [ ] Admin A crea promotion
- [ ] Al mismo tiempo, Admin B crea promotion
- [ ] Ambas aparecen en lista

---

## 📋 FINAL CHECKLIST

### Sumarizando:
- [ ] Landing page: 100% funcional
- [ ] Admin panel: 100% funcional
- [ ] Autenticación: 100% funcional
- [ ] Validaciones: 100% funcional
- [ ] RLS: 100% funcional
- [ ] Responsiva: 100% funcional
- [ ] Performance: OK
- [ ] Console: Clean
- [ ] No regressions detectadas

### Bloqueadores para Producción
- [ ] ❌ Ninguno encontrado
- [ ] ✅ Ready para deployment

---

## 📝 NOTAS

Cualquier bug encontrado durante testing:
1. Anota descripción exacta
2. Pasos para reproducir
3. Browser/device usado
4. Screenshot si aplica
5. Crea issue en GitHub

---

**Testing Status:** ✅ LISTO PARA FASE 3

Cuando termines testing, puedes proceder con Deployment o Fase 3.

