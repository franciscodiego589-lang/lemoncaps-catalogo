"use client";

import { useState, useSyncExternalStore } from "react";

import { AnimatedBackground } from "@/components/catalog/AnimatedBackground";
import { DEFAULT_BACKGROUND } from "@/lib/catalog/segment-visuals";
import { cartTotalCents, useCartStore } from "@/lib/store/cart";
import { clearQuoteSnapshot, rememberQuoteSuccess, restoreQuoteSuccessFromUrl } from "@/lib/cart/quote-snapshot";
import type { QuoteSuccessData } from "@/lib/cart/types";
import { CartEmptyState } from "./CartEmptyState";
import { CartItemRow } from "./CartItemRow";
import { CartSkeleton } from "./CartSkeleton";
import { CartSummary } from "./CartSummary";
import { CartTopBar } from "./CartTopBar";
import { CustomerForm } from "./CustomerForm";
import { QuoteSuccess } from "./QuoteSuccess";
import { DeveloperCredit } from "@/components/common/DeveloperCredit";

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
// CartSkeleton), para nunca divergir na hidratação. `successData` decide entre
// o carrinho normal e a tela de sucesso pós-orçamento: quando ele existe, o
// pedido já foi registrado no banco e o carrinho foi esvaziado, mas o retrato
// dos itens/valores continua disponível para "Copiar orçamento" e "Baixar PDF".
// (O botão "Falar no WhatsApp" existiu aqui até 14/09/2026, quando o dono tirou
// os botões de WhatsApp do site: quem chega ao catálogo já falou com o comercial.)
//
// O retrato NÃO vive só aqui: `rememberQuoteSuccess` o guarda no
// sessionStorage e marca `?orcamento=<numero>` na URL, e o estado abaixo nasce
// de `restoreQuoteSuccessFromUrl`, que remonta a tela no F5. Antes da
// auditoria de 13/09/2026 tudo isso morava só no useState — recarregar a
// página na tela de sucesso jogava o cliente num carrinho vazio, sem o número
// do orçamento e sem os três botões. O porquê inteiro e o que foi decidido
// sobre nome/WhatsApp guardados no navegador estão em lib/cart/quote-snapshot.ts.
export function CartView() {
  const hasMounted = useHasMounted();

  const items = useCartStore((state) => state.items);
  const clear = useCartStore((state) => state.clear);

  // Inicialização preguiçosa (a função é chamada uma vez, no primeiro render):
  // no servidor devolve null, porque não há URL nem sessionStorage; no
  // navegador é o que ressuscita a tela de sucesso depois do F5. Nada é
  // pintado a partir daqui antes de `hasMounted` virar true, então isto não
  // pode divergir na hidratação.
  const [successData, setSuccessData] = useState<QuoteSuccessData | null>(restoreQuoteSuccessFromUrl);

  function handleQuoteSuccess(data: QuoteSuccessData) {
    // Guardar ANTES de trocar de tela: se o navegador recarregar entre uma
    // coisa e outra, o retrato já está salvo e a tela volta sozinha.
    rememberQuoteSuccess(data);
    clear();
    setSuccessData(data);
  }

  // Saída deliberada da tela de sucesso: o retrato (que carrega nome e
  // WhatsApp do cliente) some do navegador na hora, sem esperar o prazo de
  // validade. Só o armazenamento é limpo — o estado do React morre junto com
  // a navegação, e zerá-lo aqui só faria a tela piscar no caminho.
  function handleLeaveSuccess() {
    clearQuoteSnapshot();
  }

  const isShowingSuccess = hasMounted && successData !== null;
  const totalPotes = items.reduce((sum, item) => sum + item.quantityPotes, 0);
  const totalCents = cartTotalCents(items);

  return (
    <>
      {/* `hasMounted &&` no meio da condição não é enfeite: no primeiro render
          do cliente (ainda hidratando) ele é false, então o fundo animado
          aparece exatamente como apareceu no HTML do servidor. Sem isso, um F5
          com orçamento guardado tiraria o fundo já no primeiro render e a
          hidratação divergiria. */}
      {!isShowingSuccess && <AnimatedBackground colors={DEFAULT_BACKGROUND} />}
      <CartTopBar />

      <main id="main-content">
        {!hasMounted ? (
          <CartSkeleton />
        ) : successData ? (
          <QuoteSuccess data={successData} onLeave={handleLeaveSuccess} />
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

      {/* `Lemon&nbsp;Caps`: espaço não separável para a marca nunca quebrar em
          duas linhas no rodapé (achado da auditoria de 13/09/2026 — em tela
          estreita "Lemon" ficava numa linha e "Caps" na seguinte). O
          `translate="no"` já existente segue o mesmo princípio: nome próprio
          não se traduz nem se parte. */}
      <footer className="lc-footer">
        <p>
          © 2026 <span translate="no">Lemon&nbsp;Caps</span> - Indústria de Suplementos e
          Nutracêuticos
        </p>
        <DeveloperCredit />
      </footer>
    </>
  );
}
