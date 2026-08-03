#!/usr/bin/env node

/**
 * Ejecutar RLS setup directamente via PostgreSQL
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env.local') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🚀 FASE 1B: RLS Setup Iniciando\n');

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Variables de entorno faltantes');
  process.exit(1);
}

// Crear cliente Supabase con service role
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

console.log('📍 URL:', SUPABASE_URL);
console.log('🔑 Service Role Key:', SUPABASE_SERVICE_ROLE_KEY.substring(0, 30) + '...\n');

// Leer script SQL
const sqlFile = path.join(__dirname, 'supabase_rls_setup.sql');
const sqlContent = fs.readFileSync(sqlFile, 'utf-8');

// Dividir en comandos
const commands = sqlContent
  .split(';')
  .map(cmd => cmd.trim())
  .filter(cmd => cmd && !cmd.startsWith('--'));

console.log(`📝 Script contiene ${commands.length} comandos\n`);

// Ejecutar cada comando
(async () => {
  let success = 0;
  let failed = 0;

  for (let i = 0; i < commands.length; i++) {
    const cmd = commands[i];
    const preview = cmd.substring(0, 60).replace(/\n/g, ' ');

    process.stdout.write(`[${i + 1}/${commands.length}] ${preview}... `);

    try {
      // Usar RPC para ejecutar SQL
      const { data, error } = await supabase.rpc('exec_sql', {
        sql: cmd
      });

      if (error) {
        console.log(`❌ ${error.message.substring(0, 40)}`);
        failed++;
      } else {
        console.log('✅');
        success++;
      }
    } catch (err) {
      // Intentar con fetch directo a REST API
      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            'apikey': SUPABASE_SERVICE_ROLE_KEY,
            'Content-Type': 'application/json',
            'X-Client-Info': 'postgrest-js/1.0'
          },
          body: JSON.stringify({ sql: cmd })
        });

        if (res.ok) {
          console.log('✅');
          success++;
        } else {
          console.log(`❌ HTTP ${res.status}`);
          failed++;
        }
      } catch (e) {
        console.log(`❌ ${e.message.substring(0, 30)}`);
        failed++;
      }
    }
  }

  console.log(`\n📊 Resultado: ${success} exitosas, ${failed} fallidas\n`);

  if (failed === 0) {
    console.log('✅ ¡RLS Setup completado exitosamente!\n');
    console.log('🎉 FASE 1B COMPLETADA\n');
    process.exit(0);
  } else {
    console.log('⚠️  Algunas queries fallaron');
    console.log('   Intenta manualmente en: https://app.supabase.com/project/eveyqelysnkjipbqaweg/sql\n');
    process.exit(1);
  }
})();
