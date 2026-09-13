import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/LoginForm";
import { getStaffSession } from "@/lib/data/admin";

// A tela de login de VERDADE mora aqui, e não em /admin/login - restrição do
// proxy.ts (fora do escopo desta tarefa, outros agentes trabalham nele
// agora): ele protege TODO prefixo que comece com "/admin", incluindo
// "/admin/login" (`pathname.startsWith("/admin")` é true também para essa
// rota). Um visitante sem sessão que tentasse abrir /admin/login seria
// interceptado pelo próprio proxy e mandado para cá de qualquer forma -
// então colocar o formulário lá e fazer esta rota redirecionar para lá
// (como a primeira versão fazia) cria um loop infinito de redirecionamento
// (confirmado ao vivo com Playwright: net::ERR_TOO_MANY_REDIRECTS). "/login"
// é o único caminho fora do prefixo protegido, por isso é aqui que o
// formulário precisa estar. /admin/login continua existindo (nome pedido
// pela tarefa) como uma ponte simples para cá - ver esse arquivo.
export const metadata = { title: "Entrar · Lemon Caps Admin" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ redirect?: string }> }) {
  const session = await getStaffSession();
  if (session) redirect("/admin");

  const params = await searchParams;

  return (
    <main className="lc-admin-auth-page">
      <div className="lc-admin-auth-card">
        <div className="lc-admin-auth-brand">
          <span className="lc-brand-dot" aria-hidden="true" />
          Lemon Caps
        </div>
        <h1 className="lc-admin-auth-title">Área administrativa</h1>
        <p className="lc-admin-auth-subtitle">Entre com seu e-mail e senha para gerenciar o catálogo.</p>
        <LoginForm redirectTo={params.redirect} />
      </div>
    </main>
  );
}
