"use client";

import { useState } from "react";
import { Trash } from "lucide-react";
import { toast } from "sonner";

import { centsToBRL } from "@/lib/money";
import { useCartStore, type CartItem } from "@/lib/store/cart";

const QUANTITY_STEP = 50;

interface CartItemRowProps {
  item: CartItem;
}

// Uma linha do carrinho é sempre CONTEÚDO sólido (nunca vidro — regra central
// em app/globals.css). O rascunho de quantidade fica livre para digitar
// (mesmo padrão de QuoteModal.tsx: aviso reativo, sem travar o campo), mas o
// que efetivamente fica salvo nunca cai abaixo do mínimo.
export function CartItemRow({ item }: CartItemRowProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const addItem = useCartStore((state) => state.addItem);

  const [draft, setDraft] = useState(item.quantityPotes);

  const isBelowMinimum = draft < item.minimumOrderPotes;
  const previewSubtotalCents = Math.max(draft, 0) * item.unitPriceCents;

  // Aplica o mesmo piso que lib/store/cart.ts (clampQuantity, função interna,
  // não exportada) já impõe no estado global — replicado aqui para corrigir o
  // CAMPO na hora certa (blur do input ou clique nos +/-). Achado real ao
  // testar: se o valor digitado clampeia de volta para o MESMO número que já
  // estava salvo (ex.: já em 100, digita 50, clamp devolve 100 de novo), o
  // store não muda de estado — então esperar por uma prop "diferente" para
  // ressincronizar o campo nunca dispara, e o campo fica mostrando "50" com o
  // valor real salvo sendo 100. Corrigir o rascunho aqui, sempre, resolve isso
  // sem depender de o valor global ter mudado ou não.
  function commitQuantity(rawValue: number) {
    const corrected = Math.max(Math.trunc(rawValue) || 0, item.minimumOrderPotes);
    setDraft(corrected);
    updateQuantity(item.formulaId, corrected);
  }

  function handleRemove() {
    removeItem(item.formulaId);
    toast(`"${item.name}" removido do carrinho.`, {
      action: {
        label: "Desfazer",
        onClick: () =>
          addItem({
            formulaId: item.formulaId,
            slug: item.slug,
            name: item.name,
            unitPriceCents: item.unitPriceCents,
            quantityPotes: item.quantityPotes,
            minimumOrderPotes: item.minimumOrderPotes,
          }),
      },
    });
  }

  return (
    <li className="lc-cart-item">
      <div className="lc-cart-item-info">
        <div className="lc-cart-item-name">{item.name}</div>
        <div className="lc-cart-item-unit">
          {centsToBRL(item.unitPriceCents)} / pote · Pedido mínimo: {item.minimumOrderPotes} potes
        </div>
      </div>

      <div className="lc-cart-item-qty">
        <button
          type="button"
          className="lc-stepper-btn"
          aria-label={`Diminuir quantidade de ${item.name}`}
          onClick={() => commitQuantity(draft - QUANTITY_STEP)}
        >
          −
        </button>
        <input
          type="number"
          inputMode="numeric"
          min={item.minimumOrderPotes}
          step={QUANTITY_STEP}
          value={draft}
          aria-label={`Quantidade de potes de ${item.name}`}
          aria-invalid={isBelowMinimum}
          onChange={(event) => setDraft(Number(event.target.value) || 0)}
          onBlur={() => commitQuantity(draft)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              event.currentTarget.blur();
            }
          }}
        />
        <button
          type="button"
          className="lc-stepper-btn"
          aria-label={`Aumentar quantidade de ${item.name}`}
          onClick={() => commitQuantity(draft + QUANTITY_STEP)}
        >
          +
        </button>
      </div>

      <div className="lc-cart-item-subtotal">{centsToBRL(previewSubtotalCents)}</div>

      <button type="button" className="lc-cart-item-remove" onClick={handleRemove}>
        <Trash size={15} aria-hidden="true" />
        Remover
      </button>

      <p className="lc-cart-item-warning" role="status">
        {isBelowMinimum ? `Pedido mínimo: ${item.minimumOrderPotes} potes.` : ""}
      </p>
    </li>
  );
}
