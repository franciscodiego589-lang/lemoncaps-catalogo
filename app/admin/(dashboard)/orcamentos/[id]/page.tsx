import { notFound } from "next/navigation";

import { QuoteItemsEditor } from "@/components/admin/QuoteItemsEditor";
import { QuoteStatusEditor } from "@/components/admin/QuoteStatusEditor";
import { getAdminQuoteById } from "@/lib/data/admin";

export const metadata = { title: "Orçamento · Lemon Caps Admin" };

export default async function EditarOrcamentoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const quote = await getAdminQuoteById(id);
  if (!quote) notFound();

  return (
    <>
      <div className="lc-admin-page-head">
        <div>
          <h1>Orçamento #{quote.quoteNumber}</h1>
          <p>
            {quote.customerName} · {quote.customerWhatsapp} · gerado em {new Date(quote.createdAt).toLocaleString("pt-BR")}
          </p>
        </div>
      </div>
      <QuoteStatusEditor quoteId={quote.id} status={quote.status} internalNote={quote.internalNote} />
      <QuoteItemsEditor items={quote.items} />
    </>
  );
}
