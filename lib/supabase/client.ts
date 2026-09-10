import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "./database.types";

// Cliente de Supabase para o BROWSER (Client Components).
// Usa só a chave publicável — nunca a secreta. A sessão vive em cookie,
// para o servidor conseguir ler a mesma sessão que o browser escreveu.
// createBrowserClient já vira singleton sozinho quando detecta o browser.
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
