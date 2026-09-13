"use client";

import { useState, useSyncExternalStore } from "react";

import { AnimatedBackground } from "@/components/catalog/AnimatedBackground";
import { DEFAULT_BACKGROUND } from "@/lib/catalog/segment-visuals";
import { cartTotalCents, useCartStore } from "@/lib/store/cart";
import type { QuoteSuccessData } from "@/lib/cart/types";
import { CartEmptyState } from "./CartEmptyState";
import { CartItemRow } from "./CartItemRow";
import { CartSkeleton } from "./CartSkeleton";
import { CartSummary } from "./CartSummary";
import { CartTopBar } from "./CartTopBar";
import { CustomerForm } from "./CustomerForm";
import { QuoteSuccess } from "./QuoteSuccess";

type CartPhase = "cart" | "success";

function subscribeNoop() {
  return () => {};
}

// "Já montou no navegador?" sem cair no anti-padrão de setState dentro de
// useEffect (regra react-hooks/set-state-in-effect): useSyncExternalStore é o
// jeito que o próprio React recomenda para um valor que precisa nascer igual
// no servidor e na primeira pintura do cliente (aqui sempre "false", via
// getServerSnapshot) e só divergir depois que o navegador assume de vez
// (getSnapshot, "true") — exatamente o caso do carrinho, que só existe em
// localStorage.
function useHasMounted(): boolean {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
}

// Orquestrador da rota /carrinho. O carrinho só existe em localStorage
// (useCartStore, zustand/persist) — não existe durante a renderização no
// servidor, então esta tela nunca pode mostrar o carrinho de verdade antes de
// montar no navegador: até lá, um esqueleto igual nos dois lados (ver
// CartSkeleton), para nunca divergir na hidratação. `phase` decide entre o
// carrinho normal e a tela de sucesso pós-orçamento; ao entrar em "success" o
// carrinho é esvaziado (o pedido já foi registrado no banco), mas o retrato
// dos itens/valores usados naquele orçamento continua disponível via
// successData, para "Copiar pedido"/"Baixar PDF"/"Falar no WhatsApp".
export function CartView() {
  const hasMounted = useHasMounted();

  const items = useCartStore((state) => state.items);
  const clear = useCartStore((state) => state.clear);

  const [phase, setPhase] = useState<CartPhase>("cart");
  const [successData, setSuccessData] = useState<QuoteSuccessData | null>(null);

  function handleQuoteSuccess(data: QuoteSuccessData) {
    setSuccessData(data);
    clear();
    setPhase("success");
  }

  const totalPotes = items.reduce((sum, item) => sum + item.quantityPotes, 0);
  const totalCents = cartTotalCents(items);

  return (
    <>
      {phase !== "success" && <AnimatedBackground colors={DEFAULT_BACKGROUND} />}
      <CartTopBar />

      <main>
        {!hasMounted ? (
          <CartSkeleton />
        ) : phase === "success" && successData ? (
          <QuoteSuccess data={successData} />
        ) : (
          <>
            <div className="lc-page-head">
              <h1>Carrinho de cotação</h1>
              <p>Revise os itens, ajuste as quantidades e informe seus dados para gerar o orçamento.</p>
            </div>

            {items.length === 0 ? (
              <CartEmptyState />
            ) : (
              <div className="lc-container">
                <div className="lc-cart-layout">
                  <section aria-labelledby="cart-items-heading">
                    <h2 id="cart-items-heading" className="lc-sr-only">
                      Itens do carrinho
                    </h2>
                    <ul className="lc-cart-list">
                      {items.map((item) => (
                        <CartItemRow key={item.formulaId} item={item} />
                      ))}
                    </ul>
                  </section>

                  <aside aria-labelledby="cart-checkout-heading" className="lc-checkout-panel">
                    <h2 id="cart-checkout-heading" className="lc-sr-only">
                      Resumo e dados para o orçamento
                    </h2>
                    <CartSummary items={items} />
                    <CustomerForm
                      items={items}
                      totalPotes={totalPotes}
                      totalCents={totalCents}
                      onSuccess={handleQuoteSuccess}
                    />
                  </aside>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="lc-footer">
        © 2026 <span translate="no">Lemon Caps</span> - Indústria de Suplementos e Nutracêuticos
      </footer>
    </>
  );
}
