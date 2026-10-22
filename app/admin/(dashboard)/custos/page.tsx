import { CostsBatchTable } from "@/components/admin/CostsBatchTable";
import { getAdminFormulaCostsList } from "@/lib/data/admin";

export const metadata = { title: "Custos (interno) · Lemon Caps Admin" };

// Tela em lote (antes era só uma listagem com "Editar" linha a linha, que
// mandava abrir uma tela por fórmula para digitar um número e voltar - com 28
// linhas e nenhuma preenchida, ninguém fazia isso 28 vezes). Toda a edição
// mora em CostsBatchTable (client component); esta page.tsx só busca os dados
// e mantém o cabeçalho/aviso que já existiam. A edição individual
// continua em custos/[id]/page.tsx, para quem preferir focar numa fórmula só.
export default async function AdminCustosPage() {
  const rows = await getAdminFormulaCostsList();

  return (
    <>
      <div className="lc-admin-page-head">
        <div>
          <h1>Custos</h1>
          <p>Custo real de produção por pote. Nunca aparece no catálogo público.</p>
        </div>
      </div>

      <div className="lc-admin-internal-banner" role="note">
        Informação 100% interna - a tabela de custos não tem nenhuma permissão de leitura para o público, nem para visitantes anônimos.
      </div>

      <CostsBatchTable rows={rows} />
    </>
  );
}
