import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import type { Database } from "./database.types";

// Cliente de Supabase para o SERVIDOR (Server Components, Server Actions,
// Route Handlers). No Next 16 cookies() é assíncrono — por isso resolvemos a
// store antes de montar o cliente. Um cliente novo por request (nunca
// compartilhar entre requests), como pede o @supabase/ssr.
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

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    envObrigatoria("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL),
    envObrigatoria("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY),
    {
      // Atributos do cookie de sessão fixados de propósito (14/09/2026). O
      // @supabase/ssr aplica um padrão que NÃO inclui `secure`, e o site roda só em
      // HTTPS — sem isso, uma configuração errada em qualquer camada faria o cookie
      // trafegar em claro. `sameSite: lax` é o mesmo padrão da biblioteca, escrito
      // aqui para ficar explícito em vez de herdado.
      //
      // `httpOnly` continua FALSE, e isso é uma pendência consciente, não esquecimento:
      // o carrinho público usa createBrowserClient (lib/cart/submit-quote.ts), que
      // precisa ler a própria sessão por document.cookie. Ligar httpOnly aqui quebra
      // esse fluxo. A saída é migrar submit-quote para Server Action primeiro — aí o
      // cliente de navegador deixa de ser necessário e o cookie pode fechar de vez.
      cookieOptions: { secure: true, sameSite: "lax" },
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
