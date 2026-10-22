import { centsToBRL } from "@/lib/money";
import { cartTotalCents, hasPriceOnRequest, type CartItem } from "@/lib/store/cart";

interface CartSummaryProps {
  items: readonly CartItem[];
}

// Só apresentação: o total em dinheiro vem de cartTotalCents (lib/store/cart.ts,
// soma inteira em centavos), nunca recalculado com float solto aqui. A região
// aria-live avisa leitor de tela a cada mudança de quantidade/remoção sem
// precisar duplicar o aviso em cada ação isolada.
export function CartSummary({ items }: CartSummaryProps) {
  const totalPotes = items.reduce((sum, item) => sum + item.quantityPotes, 0);
  const totalCents = cartTotalCents(items);
  const potesLabel = totalPotes === 1 ? "pote" : "potes";
  // Tudo sob consulta: "R$ 0,00" pareceria preço, então o total também fica sob consulta.
  const allOnRequest = items.length > 0 && items.every((item) => item.unitPriceCents === null);

  return (
    <div>
      <p className="lc-sr-only" role="status" aria-live="polite">
        {`Carrinho atualizado: ${totalPotes} ${potesLabel}, total ${centsToBRL(totalCents)}.`}
      </p>
      <div className="lc-summary-row">
        <span>Total de potes</span>
        <span>{totalPotes}</span>
      </div>
      <div className="lc-summary-row lc-summary-total">
        <span>Total</span>
        <span>{allOnRequest ? "Sob consulta" : centsToBRL(totalCents)}</span>
      </div>
      {hasPriceOnRequest(items) && !allOnRequest && (
        <p className="lc-min-note">+ itens com preço sob consulta, fora deste total.</p>
      )}
    </div>
  );
}
