import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import type { Database } from "./database.types";

// Cliente de Supabase para o SERVIDOR (Server Components, Server Actions,
// Route Handlers). No Next 16 cookies() é assíncrono — por isso resolvemos a
// store antes de montar o cliente. Um cliente novo por request (nunca
// compartilhar entre requests), como pede o @supabase/ssr.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Chamado de dentro de um Server Component: gravar cookie ali não
            // é suportado pelo Next. A atualização real da sessão acontece no
            // proxy.ts, que roda em toda navegação. Ignorar aqui é o
            // comportamento que o próprio @supabase/ssr pede.
          }
        },
      },
    },
  );
}
