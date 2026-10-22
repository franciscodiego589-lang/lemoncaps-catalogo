import "server-only";

import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database.types";

// Cliente Supabase dedicado às leituras PÚBLICAS do site (catálogo em
// lib/data/formulas.ts e banco de insumos em lib/data/ingredient-bank.ts).
// Sem sessão, sem cookie.
//
// Por que não reaproveitar createClient() de lib/supabase/server.ts aqui: aquele
// client lê cookies() (Next 16, assíncrono) para manter sessão de staff. O Next
// não permite acessar cookies()/headers() dentro do escopo de uma função
// envolvida por unstable_cache — "Accessing uncached data sources such as
// headers or cookies inside a cache scope is not supported"
// (node_modules/next/dist/docs/01-app/03-api-reference/04-functions/unstable_cache.md).
// Confirmado na prática: essa combinação quebra o cache.
//
// Isso não muda o resultado para ninguém: quem chama sempre filtra
// "active and deleted_at is null" explicitamente (não depende da RLS liberar
// linhas extras para staff autenticado — ver
// supabase/migrations/20260909210001_rls_policies.sql, políticas *_select),
// então um client anônimo simples devolve exatamente os mesmos dados que o
// client com cookie devolveria para estes casos de uso.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export function getAnonCatalogClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
      "Configuração do Supabase ausente: defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    );
  }
  return createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
  });
}
