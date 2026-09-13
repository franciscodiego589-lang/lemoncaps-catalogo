import Link from "next/link";

interface QuotesPaginationProps {
  pagina: number;
  totalPaginas: number;
  total: number;
  searchParams: Record<string, string | string[] | undefined>;
}

// Monta o link preservando todo filtro já na URL (busca/status/de/ate) e só
// troca "pagina" - assim o link de paginação nunca reseta um filtro que a
// cliente já tinha aplicado. pagina=1 sai da querystring de propósito (é o
// valor padrão de getAdminQuotes), para o link da primeira página ficar limpo.
function buildPageHref(searchParams: Record<string, string | string[] | undefined>, pagina: number): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (key === "pagina" || typeof value !== "string" || value === "") continue;
    params.set(key, value);
  }
  if (pagina > 1) params.set("pagina", String(pagina));
  const query = params.toString();
  return query ? `/admin/orcamentos?${query}` : "/admin/orcamentos";
}

// Server Component puro (só <Link>/<button disabled>, sem estado) - dispensa
// "use client" e funciona mesmo com JS desabilitado.
export function QuotesPagination({ pagina, totalPaginas, total, searchParams }: QuotesPaginationProps) {
  return (
    <div className="lc-admin-pagination">
      <span>
        {total} {total === 1 ? "cotação encontrada" : "cotações encontradas"} · página {pagina} de {totalPaginas}
      </span>
      <div className="lc-admin-pagination-controls">
        {pagina > 1 ? (
          <Link href={buildPageHref(searchParams, pagina - 1)} className="lc-btn lc-btn-ghost">
            Anterior
          </Link>
        ) : (
          <button type="button" className="lc-btn lc-btn-ghost" disabled>
            Anterior
          </button>
        )}
        {pagina < totalPaginas ? (
          <Link href={buildPageHref(searchParams, pagina + 1)} className="lc-btn lc-btn-ghost">
            Próxima
          </Link>
        ) : (
          <button type="button" className="lc-btn lc-btn-ghost" disabled>
            Próxima
          </button>
        )}
      </div>
    </div>
  );
}
