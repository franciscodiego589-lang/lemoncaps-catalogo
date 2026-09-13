import { QuotesTable } from "@/components/admin/QuotesTable";
import { getAdminQuotes } from "@/lib/data/admin";

export const metadata = { title: "Orçamentos · Lemon Caps Admin" };

export default async function AdminOrcamentosPage() {
  const quotes = await getAdminQuotes();

  return (
    <>
      <div className="lc-admin-page-head">
        <div>
          <h1>Orçamentos</h1>
          <p>Orçamentos gerados a partir do carrinho público. Margem e lucro são calculados pelo banco.</p>
        </div>
      </div>
      <QuotesTable quotes={quotes} />
    </>
  );
}
