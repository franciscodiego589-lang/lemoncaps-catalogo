import { centsToBRL } from "@/lib/money";
import { cartTotalCents, type CartItem } from "@/lib/store/cart";

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
        <span>{centsToBRL(totalCents)}</span>
      </div>
    </div>
  );
}
