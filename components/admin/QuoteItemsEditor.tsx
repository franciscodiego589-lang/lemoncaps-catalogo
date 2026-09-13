import { QuoteItemRow } from "@/components/admin/QuoteItemRow";
import type { AdminQuoteItemDTO } from "@/lib/data/admin";

interface QuoteItemsEditorProps {
  items: AdminQuoteItemDTO[];
}

export function QuoteItemsEditor({ items }: QuoteItemsEditorProps) {
  if (items.length === 0) return <p className="lc-admin-empty">Este orçamento não tem itens.</p>;

  return (
    <div className="lc-admin-table-wrap">
      <table className="lc-admin-table">
        <thead>
          <tr>
            <th scope="col">Fórmula</th>
            <th scope="col">Potes</th>
            <th scope="col">Preço/pote</th>
            <th scope="col">Total</th>
            <th scope="col">Margem</th>
            <th scope="col" className="lc-admin-col-actions">
              Ação
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <QuoteItemRow key={item.id} item={item} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
