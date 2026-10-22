import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// No Next 16 o antigo middleware.ts virou proxy.ts (mesmo papel, nome novo;
// runtime sempre nodejs). Este proxy tem duas funções:
//   1. Renovar a sessão do Supabase a cada navegação (obrigatório — sem isso a
//      sessão do admin expira de forma difícil de depurar).
//   2. Checagem OTIMISTA de /admin: só olha se existe sessão no cookie, nunca
//      bate no banco (o proxy roda até em prefetch). A autorização de verdade
//      — se o usuário é staff, se pode ver margem — mora na RLS do banco e é
//      reconferida dentro de cada Server Action / camada de acesso a dados.
//      Esconder rota aqui não é controle de acesso.

const PROTECTED_PREFIXES = ["/admin"];

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

export default async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
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
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // getClaims/getUser cedo, antes de gerar resposta — renova a sessão.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isProtected = PROTECTED_PREFIXES.some((p) =>
    request.nextUrl.pathname.startsWith(p),
  );
  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  // Roda em tudo menos assets estáticos e imagens. Importante: um matcher que
  // exclua a rota de uma Server Action deixa de protegê-la silenciosamente —
  // por isso a autorização real fica na action, não só aqui.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
