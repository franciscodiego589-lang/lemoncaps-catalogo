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

export default async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
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
