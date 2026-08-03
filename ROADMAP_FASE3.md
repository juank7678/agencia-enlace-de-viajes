# 🗺️ ROADMAP FASE 3: FUNCIONALIDAD COMPLETA

**Objetivo:** Convertir la plataforma de landing/admin en un sistema completo de reservas

**Duración estimada:** 4-6 horas de desarrollo  
**Complejidad:** Media-Alta  
**Prioridad:** CRÍTICA para MVP

---

## 📊 VISIÓN GENERAL

```
USUARIO VIAJERO FLOW:
1. Navega destinos/promociones
2. Selecciona paquete
3. Ve disponibilidad con calendario
4. Selecciona fechas
5. Completa formulario de reserva
6. Ingresa datos de pago
7. Realiza pago
8. Recibe confirmación por email
9. Dashboard con estado de reserva

ADMIN FLOW:
1. Ve todas las reservas pendientes
2. Confirma/rechaza reservas
3. Envía documentos requeridos
4. Seguimiento pre-viaje
5. Reporte de ingresos
```

---

## 🏗️ ARQUITECTURA NECESARIA

### Base de Datos (Supabase)

Nuevas tablas:

```sql
-- Tabla de reservas
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  promotion_id INT NOT NULL REFERENCES promotions(id),
  status VARCHAR(50) NOT NULL, -- pending, confirmed, completed, cancelled
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  passengers INT NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  payment_status VARCHAR(50) NOT NULL, -- pending, paid, refunded
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de documentos
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id UUID NOT NULL REFERENCES reservations(id),
  type VARCHAR(50) NOT NULL, -- passport, visa, insurance, etc
  file_url VARCHAR(500) NOT NULL,
  uploaded_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de pagos
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id UUID NOT NULL REFERENCES reservations(id),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'COP',
  provider VARCHAR(50) NOT NULL, -- stripe, mercadopago, etc
  provider_id VARCHAR(200) NOT NULL, -- transaction ID
  status VARCHAR(50) NOT NULL, -- pending, completed, failed
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de notificaciones
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id UUID NOT NULL REFERENCES reservations(id),
  type VARCHAR(50) NOT NULL, -- confirmation, reminder, document_required
  sent_at TIMESTAMP DEFAULT NOW()
);
```

### RLS Policies

```sql
-- Reservations: Usuarios ven su propias reservas, admin ve todas
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_see_own_reservations" 
  ON reservations FOR SELECT 
  USING (auth.uid() = user_id OR auth.role() = 'service_role');

CREATE POLICY "users_create_reservations" 
  ON reservations FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "admin_manage_reservations" 
  ON reservations FOR UPDATE 
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Similar para payments, documents, notifications
```

---

## 💼 FUNCIONALIDADES

### 1. RESERVA DE PAQUETES (6 horas)

#### Backend:
- [ ] Tabla `reservations` con campos necesarios
- [ ] RLS policies para reservas
- [ ] API endpoints:
  - `POST /reservations` - Crear reserva
  - `GET /reservations/:id` - Ver detalles
  - `PUT /reservations/:id` - Actualizar estado
- [ ] Validaciones:
  - Fechas válidas
  - Pasajeros > 0
  - Disponibilidad no excedida

#### Frontend:
- [ ] Componente: `ReservationForm.tsx`
  - Selector de fechas con calendario
  - Número de pasajeros
  - Datos personales (nombre, email, teléfono)
  - Términos y condiciones
- [ ] Componente: `ReservationModal.tsx`
  - Resumen de reserva
  - Precio total calculado
  - Botón "Proceder al pago"
- [ ] Estado: Loading, success, error
- [ ] Confirmación visual

**Archivo:** `src/components/ReservationFlow/`

---

### 2. COTIZADOR AUTOMÁTICO (4 horas)

#### Lógica:
```javascript
calculatePrice(promotion, travelers, startDate, endDate) {
  let basePrice = promotion.price;
  let duration = daysBetween(startDate, endDate);
  let discount = 0;

  // Ajustar por número de viajeros
  if (travelers > 4) discount += 0.05; // 5% descuento grupos
  if (travelers > 8) discount += 0.10; // 10% descuento grupos grandes

  // Ajustar por temporada
  let season = getSeason(startDate);
  if (season === "lowSeason") discount += 0.10;
  if (season === "highSeason") basePrice *= 1.15;

  // Aplicar cupones (si existen)
  if (coupon) discount += coupon.percentage;

  let total = (basePrice * duration * travelers) * (1 - discount);
  return {
    subtotal: basePrice * duration * travelers,
    discount: discount * 100,
    total: total,
    breakdown: { ... }
  };
}
```

#### Frontend:
- [ ] Componente: `PriceCalculator.tsx`
  - Mostrar desglose de precios
  - Mostrar descuentos aplicados
  - Mostrar total final
  - Actualizar en tiempo real
- [ ] Integrar en ReservationForm

**Archivo:** `src/lib/pricing.ts`

---

### 3. PAGOS EN LÍNEA (8 horas)

#### Opciones:
1. **Mercado Pago** (Recomendado para Latam)
   - Fácil integración
   - Soporta múltiples métodos
   - Webhook para confirmación

2. **Stripe** (Internacional)
   - Más robusta
   - Mejor para tarjetas internacionales

#### Implementación (Mercado Pago):

**Backend:**
- [ ] Crear orden de pago en Mercado Pago
- [ ] Webhook endpoint para confirmación
- [ ] Actualizar estado de reserva cuando pago confirmado

**Frontend:**
- [ ] Componente: `PaymentCheckout.tsx`
  - Resumen de monto
  - Botón "Pagar con Mercado Pago"
  - Redireccionar a MP
- [ ] Página de retorno:
  - Success: Mostrar confirmación
  - Failure: Permitir reintentar

**Archivos:**
- `src/services/payment.ts` - Lógica de pagos
- `server/routes/payment-webhook.ts` - Webhook

---

### 4. EMAILS AUTOMÁTICOS (6 horas)

#### Opciones:
1. **Resend.io** (Recomendado, gratis 100 emails/día)
2. **SendGrid** (Pagado pero robusto)
3. **Nodemailer** (SMTP propio)

#### Templates necesarios:

1. **Confirmación de Reserva**
   ```
   Asunto: Tu reserva está confirmada
   Body: Detalles de viaje, itinerario, documentos necesarios
   ```

2. **Recordatorio Pre-Viaje (7 días antes)**
   ```
   Asunto: Falta 1 semana para tu viaje
   Body: Checklist de lo que llevar, documentos, contactos
   ```

3. **Confirmación de Pago**
   ```
   Asunto: Pago recibido
   Body: Recibo, detalles de la transacción
   ```

4. **Documento Requerido**
   ```
   Asunto: Necesitamos tu pasaporte
   Body: Link para subir documento, fecha límite
   ```

#### Implementación:

**Backend:**
- [ ] Servicio de emails: `src/services/email.ts`
- [ ] Templates en HTML
- [ ] Trigger automático con webhooks/cron

**Workflow:**
```
Reserva creada → Email confirmación
Pago confirmado → Email recibo
7 días antes → Email recordatorio
Admin pide documento → Email solicitud
```

**Archivo:** `src/lib/email-templates.ts`

---

### 5. DASHBOARD CLIENTE (8 horas)

#### Funcionalidades:

**Login Cliente:**
- [ ] Usar Supabase Auth (igual que admin)
- [ ] Registro de cliente
- [ ] Email verification

**Dashboard:**
- [ ] Lista de mis reservas
  - Estado (pendiente, confirmada, completada)
  - Fechas de viaje
  - Monto pagado
- [ ] Detalles de reserva:
  - Itinerario completo
  - Documentos requeridos
  - Opción para subir documentos
  - Chat/tickets de soporte
- [ ] Perfil:
  - Datos personales
  - Historial de viajes
  - Preferencias

**Componentes:**
- [ ] `ClientDashboard.tsx`
- [ ] `ReservationDetails.tsx`
- [ ] `DocumentUpload.tsx`
- [ ] `ClientProfile.tsx`

**Archivo:** `src/components/ClientDashboard/`

---

### 6. PANEL ADMIN MEJORADO (6 horas)

#### Nuevas funcionalidades:

**Gestión de Reservas:**
- [ ] Tabla con todas las reservas
- [ ] Filtros: estado, fecha, cliente
- [ ] Acciones: confirmar, rechazar, cancelar
- [ ] Ver documentos de cliente
- [ ] Enviar mensajes

**Reportes:**
- [ ] Ingresos por período
- [ ] Destinos populares
- [ ] Tasa de conversión
- [ ] Clientes recurrentes

**Automatización:**
- [ ] Programar envío de emails
- [ ] Recordatorios pendientes
- [ ] Backups automáticos

**Componentes:**
- [ ] `AdminReservations.tsx`
- [ ] `AdminReports.tsx`
- [ ] `AdminAutomation.tsx`

**Archivo:** `src/components/AdminDashboard/`

---

## 🗂️ ESTRUCTURA DE CARPETAS NUEVA

```
src/
├── components/
│   ├── ReservationFlow/
│   │   ├── ReservationForm.tsx
│   │   ├── ReservationModal.tsx
│   │   └── PriceCalculator.tsx
│   ├── PaymentCheckout/
│   │   ├── PaymentCheckout.tsx
│   │   ├── PaymentSuccess.tsx
│   │   └── PaymentFailure.tsx
│   ├── ClientDashboard/
│   │   ├── ClientDashboard.tsx
│   │   ├── ReservationDetails.tsx
│   │   └── DocumentUpload.tsx
│   └── AdminDashboard/
│       ├── AdminReservations.tsx
│       └── AdminReports.tsx
├── services/
│   ├── payment.ts         (Mercado Pago API)
│   ├── email.ts          (Email service)
│   ├── reservation.ts    (Reservations CRUD)
│   └── documents.ts      (Document upload)
├── lib/
│   ├── pricing.ts        (Cotizador)
│   ├── email-templates.ts (Email HTML)
│   └── validators.ts     (Ya existe)
├── pages/
│   ├── ReservationPage.tsx
│   ├── PaymentPage.tsx
│   ├── ClientDashboard.tsx
│   └── AdminDashboard.tsx
└── types.ts              (Agregar tipos nuevos)
```

---

## 📅 TIMELINE SUGERIDO

### Día 1 (4 horas)
- [ ] Crear tablas en Supabase
- [ ] RLS policies
- [ ] Login de cliente

### Día 2 (4 horas)
- [ ] ReservationForm + PriceCalculator
- [ ] ReservationModal

### Día 3 (3 horas)
- [ ] Mercado Pago integration
- [ ] Payment checkout

### Día 4 (2 horas)
- [ ] Email templates
- [ ] Automated emails

### Día 5 (4 horas)
- [ ] ClientDashboard
- [ ] Document upload

### Día 6 (2 horas)
- [ ] AdminDashboard mejorado
- [ ] Reports

### Día 7 (2 horas)
- [ ] Testing completo
- [ ] Fix bugs
- [ ] Deploy a Vercel

---

## 🧪 TESTING PHASE 3

### Manual Testing:
- [ ] Crear reserva completa
- [ ] Realizar pago
- [ ] Recibir emails
- [ ] Ver en dashboard
- [ ] Admin confirma
- [ ] Subir documentos

### Automated Testing:
- [ ] Unit tests para pricing
- [ ] E2E tests para flujo reserva
- [ ] Payment webhook tests
- [ ] Email template rendering

---

## 📊 DEFINICIÓN DE ÉXITO FASE 3

✅ Criterios de aceptación:

- [ ] Cliente puede crear reserva en 2 minutos
- [ ] Pago en línea funciona en staging
- [ ] Emails se envían automáticamente
- [ ] Admin ve todas las reservas
- [ ] Cliente ve sus reservas
- [ ] Documentos se pueden subir
- [ ] Reportes disponibles para admin
- [ ] 95% uptime
- [ ] < 2 segundo response time
- [ ] Todas las RLS policies funcionan

---

## 🚀 POST FASE 3

Una vez completada Fase 3:

- [ ] Deploy a producción
- [ ] Monitoreo en vivo
- [ ] Feedback de usuarios
- [ ] Iteraciones rápidas
- [ ] Fase 4: Escalabilidad & Optimización

---

## 💡 TIPS IMPLEMENTACIÓN

1. **Test pagos primero** en modo sandbox
2. **Emails en template** antes de integrar
3. **RLS policies antes de crear** componentes
4. **Mockear Mercado Pago** para testing
5. **Usar Supabase Functions** para webhooks si es posible
6. **Database transactions** para reservas + pagos

---

**Fase 3 es CRÍTICA para MVP.**

Sin ella: Landing bonito pero no vende.  
Con ella: Plataforma completa y generadora de ingresos.

Ready para empezar cuando termines de consolidar Fase 1-2. 🚀

