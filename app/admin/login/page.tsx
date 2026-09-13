import { redirect } from "next/navigation";

// Ponte só de nome (a tarefa pede a tela em /admin/login) - o formulário de
// verdade mora em /login (ver esse arquivo para a explicação completa do
// porquê: proxy.ts protege todo o prefixo "/admin", inclusive esta própria
// rota, então um visitante sem sessão nunca chega a renderizar este
// componente - o proxy já o manda para /login antes disso). Esta página só
// executa quando JÁ existe sessão (proxy deixa passar) ou em navegação
// client-side direta; em ambos os casos, só repassa para /login, que decide
// (sessão válida -> /admin; sem sessão -> mostra o formulário).
export default async function AdminLoginBridgePage({ searchParams }: { searchParams: Promise<{ redirect?: string }> }) {
  const params = await searchParams;
  const target = params.redirect ? `/login?redirect=${encodeURIComponent(params.redirect)}` : "/login";
  redirect(target);
}
