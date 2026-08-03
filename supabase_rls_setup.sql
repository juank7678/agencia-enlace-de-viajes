-- ============================================================================
-- FASE 1B: ROW LEVEL SECURITY (RLS) - ENLACE DE VIAJES
-- ============================================================================
-- Script para ejecutar en Supabase.io SQL Editor
-- Habilita RLS en todas las tablas y crea políticas de seguridad
-- ============================================================================

-- PASO 1: Habilitar RLS en tabla PROMOTIONS
-- ============================================================================
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

-- Policy: PUBLIC - Todos pueden LEER promotions
CREATE POLICY "promotions_public_read"
  ON promotions
  FOR SELECT
  USING (true);

-- Policy: ADMIN - Solo admin puede CREAR promotions
CREATE POLICY "promotions_admin_insert"
  ON promotions
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role' OR auth.uid() IS NOT NULL);

-- Policy: ADMIN - Solo admin puede ACTUALIZAR promotions
CREATE POLICY "promotions_admin_update"
  ON promotions
  FOR UPDATE
  USING (auth.role() = 'service_role' OR auth.uid() IS NOT NULL)
  WITH CHECK (auth.role() = 'service_role' OR auth.uid() IS NOT NULL);

-- Policy: ADMIN - Solo admin puede ELIMINAR promotions
CREATE POLICY "promotions_admin_delete"
  ON promotions
  FOR DELETE
  USING (auth.role() = 'service_role' OR auth.uid() IS NOT NULL);


-- PASO 2: Habilitar RLS en tabla POSTERS
-- ============================================================================
ALTER TABLE posters ENABLE ROW LEVEL SECURITY;

-- Policy: PUBLIC - Todos pueden LEER posters
CREATE POLICY "posters_public_read"
  ON posters
  FOR SELECT
  USING (true);

-- Policy: ADMIN - Solo admin puede CREAR posters
CREATE POLICY "posters_admin_insert"
  ON posters
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role' OR auth.uid() IS NOT NULL);

-- Policy: ADMIN - Solo admin puede ACTUALIZAR posters
CREATE POLICY "posters_admin_update"
  ON posters
  FOR UPDATE
  USING (auth.role() = 'service_role' OR auth.uid() IS NOT NULL)
  WITH CHECK (auth.role() = 'service_role' OR auth.uid() IS NOT NULL);

-- Policy: ADMIN - Solo admin puede ELIMINAR posters
CREATE POLICY "posters_admin_delete"
  ON posters
  FOR DELETE
  USING (auth.role() = 'service_role' OR auth.uid() IS NOT NULL);


-- PASO 3: Habilitar RLS en tabla CONTACTS
-- ============================================================================
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Policy: PUBLIC - Todos pueden ENVIAR contactos (INSERT)
CREATE POLICY "contacts_public_insert"
  ON contacts
  FOR INSERT
  WITH CHECK (true);

-- Policy: ADMIN - Solo admin puede LEER contactos
CREATE POLICY "contacts_admin_read"
  ON contacts
  FOR SELECT
  USING (auth.role() = 'service_role' OR auth.uid() IS NOT NULL);

-- Policy: ADMIN - Solo admin puede ACTUALIZAR contactos
CREATE POLICY "contacts_admin_update"
  ON contacts
  FOR UPDATE
  USING (auth.role() = 'service_role' OR auth.uid() IS NOT NULL)
  WITH CHECK (auth.role() = 'service_role' OR auth.uid() IS NOT NULL);

-- Policy: ADMIN - Solo admin puede ELIMINAR contactos
CREATE POLICY "contacts_admin_delete"
  ON contacts
  FOR DELETE
  USING (auth.role() = 'service_role' OR auth.uid() IS NOT NULL);


-- PASO 4: Verificar RLS está habilitado
-- ============================================================================
-- Ejecuta esto para verificar:
-- SELECT tablename, rowsecurity FROM pg_tables
-- WHERE tablename IN ('promotions', 'posters', 'contacts');

-- Resultado esperado:
-- tablename  | rowsecurity
-- -----------+------------
-- promotions | t
-- posters    | t
-- contacts   | t
-- (3 rows)


-- ============================================================================
-- NOTAS IMPORTANTES
-- ============================================================================
-- 1. Las policies usan: auth.role() = 'service_role' OR auth.uid() IS NOT NULL
--    Esto significa: Solo si hay usuario autenticado O es service role
--
-- 2. Por ahora el frontend NO usa Supabase Auth (es TODO para Fase 2)
--    Entonces las operaciones admin FALLARÁN hasta que implementemos login
--
-- 3. Las lecturas públicas (SELECT) funcionarán inmediatamente
--
-- 4. Los DELETEs/UPDATEs/INSERTs de admin necesitarán:
--    - Implementar Supabase Auth en frontend
--    - O usar admin API key (solo en servidor)
--
-- ============================================================================
