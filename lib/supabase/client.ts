import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "./database.types";

// Cliente de Supabase para o BROWSER (Client Components).
// Usa só a chave publicável — nunca a secreta. A sessão vive em cookie,
// para o servidor conseguir ler a mesma sessão que o browser escreveu.
// createBrowserClient já vira singleton sozinho quando detecta o browser.
// Falha cedo e com nome: sem isto, `process.env.X!` entrega `undefined` ao Supabase
// num deploy que esqueceu a variável, e o erro que aparece é o genérico da
// biblioteca. O valor precisa ser lido de forma ESTÁTICA e passado como argumento:
// o Next só substitui `process.env.NEXT_PUBLIC_X` escrito por extenso no build, e
// ler por índice dinâmico devolve undefined — foi assim que a primeira versão desta
// guarda derrubou o site inteiro com 500 em 14/09/2026.
function envObrigatoria(nome: string, valor: string | undefined): string {
  if (!valor) {
    throw new Error(
      `Configuração do Supabase ausente: defina ${nome} no ambiente do deploy.`,
    );
  }
  return valor;
}

export function createClient() {
  return createBrowserClient<Database>(
    envObrigatoria("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL),
    envObrigatoria("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY),
  );
}
