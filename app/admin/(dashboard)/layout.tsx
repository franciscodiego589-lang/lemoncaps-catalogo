import type { ReactNode } from "react";

import { AdminNav } from "@/components/admin/AdminNav";
import { requireStaffPage } from "@/lib/data/admin";

// Casca de TODA página administrativa, exceto /admin/login (que fica FORA
// deste grupo de rotas de propósito - ver comentário em app/admin/login não
// pertencer a "(dashboard)": senão, quem não está logado seria redirecionado
// para /admin/login, que por sua vez tentaria montar este mesmo layout com
// guarda, criando um loop de redirecionamento).
//
// requireStaffPage() é a SEGUNDA barreira (a primeira é a checagem otimista
// do proxy.ts, que só olha se existe cookie de sessão) - aqui confirma-se
// contra o banco que a sessão pertence a um staff ATIVO de verdade. Cada
// Server Action chamada a partir das páginas abaixo faz a SUA PRÓPRIA
// checagem, de novo, independente desta (ver lib/data/admin.ts,
// requireStaffAction/requireQuoteManagerAction) - nunca confia só no layout.
export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const session = await requireStaffPage();

  return (
    <div className="lc-admin-shell">
      <AdminNav fullName={session.fullName} canManageQuotes={session.canManageQuotes} />
      {/* id="main-content" é o destino do link "Pular para o conteúdo" do layout
          raiz, que aparece em toda página. Sem ele, quem opera o admin por
          teclado aciona o atalho e não sai do lugar — e o admin é justamente
          onde mais se navega por teclado, preenchendo formulário atrás de
          formulário. */}
      <main id="main-content" className="lc-admin-content">
        <div className="lc-admin-content-inner">{children}</div>
      </main>
    </div>
  );
}
