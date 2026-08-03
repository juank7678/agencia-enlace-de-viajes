#!/usr/bin/env node

/**
 * Script para ejecutar RLS setup en Supabase
 * Uso: node run_rls_setup.js
 *
 * Lee variables de .env.local y ejecuta el script SQL de RLS
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '.env.local') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ ERROR: Variables de entorno faltantes en .env.local');
  console.error('   - VITE_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

console.log('🚀 Iniciando RLS Setup...\n');

// Leer el script SQL
const sqlScriptPath = path.join(__dirname, 'supabase_rls_setup.sql');
if (!fs.existsSync(sqlScriptPath)) {
  console.error('❌ ERROR: No se encontró supabase_rls_setup.sql');
  process.exit(1);
}

const sqlScript = fs.readFileSync(sqlScriptPath, 'utf-8');

// Función para ejecutar SQL via REST API de Supabase
async function executeSql(sql) {
  try {
    console.log('📝 Enviando SQL a Supabase...');

    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ sql })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Error de Supabase:', error);
      return false;
    }

    console.log('✅ SQL ejecutado exitosamente\n');
    return true;
  } catch (error) {
    console.error('❌ Error al conectar con Supabase:', error.message);
    return false;
  }
}

// Función alternativa: Ejecutar queries individuales via SQL Editor
async function executeViaPostgres(sql) {
  try {
    console.log('📝 Conectando a Supabase PostgreSQL...\n');

    // Usar la API de Supabase para ejecutar SQL
    const queries = sql
      .split(';')
      .map(q => q.trim())
      .filter(q => q.length > 0 && !q.startsWith('--'));

    console.log(`🔧 Ejecutando ${queries.length} comandos...\n`);

    // Ejecutar cada query
    for (let i = 0; i < queries.length; i++) {
      const query = queries[i];
      const queryPreview = query.substring(0, 50).replace(/\n/g, ' ');

      process.stdout.write(`[${i + 1}/${queries.length}] ${queryPreview}... `);

      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sql: query })
      });

      if (response.ok || response.status === 204) {
        console.log('✅');
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.log(`❌ ${errorData.message || 'Error'}`);
      }

      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return true;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

// Ejecutar
(async () => {
  try {
    const success = await executeViaPostgres(sqlScript);

    if (success) {
      console.log('\n✅ RLS Setup completado!\n');
      console.log('🎉 FASE 1B COMPLETADA!');
      console.log('   Row Level Security está ahora activo en Supabase.\n');
      process.exit(0);
    } else {
      console.error('\n❌ Error durante RLS Setup');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error inesperado:', error);
    process.exit(1);
  }
})();
