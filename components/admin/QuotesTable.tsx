import Link from "next/link";

import { QUOTE_STATUS_BADGE_VARIANT, QUOTE_STATUS_LABELS } from "@/components/admin/enum-labels";
import type { AdminQuoteListItemDTO } from "@/lib/data/admin";
import { centsToBRL } from "@/lib/money";

interface QuotesTableProps {
  quotes: AdminQuoteListItemDTO[];
  emptyMessage?: string;
}

export function QuotesTable({ quotes, emptyMessage = "Nenhum orçamento gerado ainda." }: QuotesTableProps) {
  if (quotes.length === 0) {
    return <p className="lc-admin-empty">{emptyMessage}</p>;
  }

  return (
    <div className="lc-admin-table-wrap">
      <table className="lc-admin-table">
        <thead>
          <tr>
            <th scope="col">Nº</th>
            <th scope="col">Cliente</th>
            <th scope="col">Status</th>
            <th scope="col">Itens</th>
            <th scope="col">Total</th>
            <th scope="col">Lucro estimado</th>
            <th scope="col">Data</th>
          </tr>
        </thead>
        <tbody>
          {quotes.map((quote) => (
            <tr key={quote.id}>
              <td>
                <Link href={`/admin/orcamentos/${quote.id}`} className="lc-admin-row-link">
                  #{quote.quoteNumber}
                </Link>
              </td>
              <td>
                {quote.customerName}
                <div className="lc-admin-panel-row-meta">{quote.customerWhatsapp}</div>
              </td>
              <td>
                <span className={`lc-admin-badge lc-admin-badge--${QUOTE_STATUS_BADGE_VARIANT[quote.status]}`}>
                  {QUOTE_STATUS_LABELS[quote.status]}
                </span>
              </td>
              <td className="lc-admin-col-num">{quote.itemCount}</td>
              <td className="lc-admin-col-num">{centsToBRL(quote.totalCents)}</td>
              <td className="lc-admin-col-num">
                {quote.totalProfitCents !== null ? (
                  <span className={quote.totalProfitCents >= 0 ? "lc-admin-margin-positive" : "lc-admin-margin-negative"}>
                    {centsToBRL(quote.totalProfitCents)}
                  </span>
                ) : (
                  <span className="lc-admin-margin-unknown">desconhecido</span>
                )}
              </td>
              <td className="lc-admin-col-num">{new Date(quote.createdAt).toLocaleDateString("pt-BR")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
