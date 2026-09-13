import Link from "next/link";
import { Suspense } from "react";

import { AdminFilterBar } from "@/components/admin/AdminFilterBar";
import { QUOTE_STATUS_LABELS, toSelectOptions } from "@/components/admin/enum-labels";
import { QuotesPagination } from "@/components/admin/QuotesPagination";
import { QuotesTable } from "@/components/admin/QuotesTable";
import { getAdminQuotes } from "@/lib/data/admin";

export const metadata = { title: "Orçamentos · Lemon Caps Admin" };

interface OrcamentosPageProps {
  searchParams: Promise<{ busca?: string; status?: string; de?: string; ate?: string; pagina?: string }>;
}

const STATUS_SELECT_OPTIONS = [{ value: "todos", label: "Todos" }, ...toSelectOptions(QUOTE_STATUS_LABELS)];

// Repete os mesmos 4 filtros (busca/status/de/ate) na querystring da rota de
// exportação - o botão baixa exatamente o que a tela está mostrando, nunca a
// base inteira (item 4 da tarefa).
function buildExportHref(params: Awaited<OrcamentosPageProps["searchParams"]>): string {
  const query = new URLSearchParams();
  if (params.busca) query.set("busca", params.busca);
  if (params.status) query.set("status", params.status);
  if (params.de) query.set("de", params.de);
  if (params.ate) query.set("ate", params.ate);
  const queryString = query.toString();
  return queryString ? `/admin/orcamentos/exportar?${queryString}` : "/admin/orcamentos/exportar";
}

export default async function AdminOrcamentosPage({ searchParams }: OrcamentosPageProps) {
  const params = await searchParams;
  const pagina = params.pagina ? Number(params.pagina) : undefined;

  const { linhas, total, pagina: paginaAtual, totalPaginas } = await getAdminQuotes({
    busca: params.busca,
    status: params.status,
    de: params.de,
    ate: params.ate,
    pagina,
  });

  const hasActiveFilters = Boolean(params.busca || (params.status && params.status !== "todos") || params.de || params.ate);

  return (
    <>
      <div className="lc-admin-page-head">
        <div>
          <h1>Orçamentos</h1>
          <p>Todas as cotações geradas a partir do carrinho público. Margem e lucro são calculados pelo banco.</p>
        </div>
        <Link href={buildExportHref(params)} className="lc-btn lc-btn-ghost">
          Exportar planilha
        </Link>
      </div>

      <Suspense fallback={null}>
        <AdminFilterBar
          searchParam="busca"
          searchLabel="Buscar por cliente, WhatsApp ou nº do orçamento"
          searchPlaceholder="Ex.: Maria, 65999990000 ou 42"
          selects={[{ param: "status", label: "Status", options: STATUS_SELECT_OPTIONS }]}
          dateRange={{ fromParam: "de", toParam: "ate", label: "Período" }}
        />
      </Suspense>

      <QuotesTable
        quotes={linhas}
        emptyMessage={hasActiveFilters ? "Nenhuma cotação encontrada para este filtro." : "Nenhum orçamento gerado ainda."}
      />

      {total > 0 ? <QuotesPagination pagina={paginaAtual} totalPaginas={totalPaginas} total={total} searchParams={params} /> : null}
    </>
  );
}
