import Link from "next/link";
import { ArrowRight, FlaskConical, PackageCheck } from "lucide-react";

import { INGREDIENT_CATEGORY_LABELS } from "@/components/manufacturing/ingredient-category-labels";
import type { IngredientBankStats } from "@/lib/data/ingredient-bank";
import { centsToBRL } from "@/lib/money";

interface StartingPointProps {
  ingredientBank: IngredientBankStats;
  /** Faixa de preço por pote do catálogo; null quando nenhuma fórmula tem preço publicado. */
  priceMinCents: number | null;
  priceMaxCents: number | null;
}

// DECISÃO DO DONO em 14/09/2026 — os botões de WhatsApp saíram do site inteiro,
// este incluído. Motivo dele: "o cliente já entra direto no catálogo depois de
// entrar em contato com o comercial". Isto reverte a correção do mesmo dia que
// havia trocado o e-mail pelo WhatsApp neste cartão.
//
// No lugar do botão, o cartão de fórmula nova leva à seção de contato no fim
// desta mesma página (ManufacturingContact), que é onde o canal real — o e-mail
// oficial da fábrica — está publicado. Assim o cartão continua tendo para onde
// mandar a pessoa, sem abrir um segundo canal de contato.

// Os dois caminhos de entrada, lado a lado — é a seção que dá forma ao pedido
// do dono de que a página sirva os dois públicos: quem compra do catálogo
// pronto e quem quer fabricar a própria marca. Cada cartão termina em uma ação,
// e as duas têm peso diferente de propósito: o do catálogo é o botão sólido
// (é para lá que a página empurra), o de fórmula nova é o secundário.
//
// Nenhum dos dois repete um número que a faixa do herói (KeyFigures) já deu:
// aqui o valor novo é a FAIXA DE PREÇO por pote — a única informação exclusiva
// da landing antiga que valia a pena salvar — e a DIVISÃO do banco de insumos
// por categoria, que prova diversidade sem entregar a lista de matérias-primas
// (informação comercial da fábrica, ver lib/data/ingredient-bank.ts).
//
// O que NÃO aparece, porque não está confirmado (ver pendências em
// app/page.tsx): custo e prazo de desenvolvimento de fórmula nova, política de
// exclusividade e qualquer promessa de amostra ou piloto.
export function StartingPoint({ ingredientBank, priceMinCents, priceMaxCents }: StartingPointProps) {
  // Sem preço publicado a frase inteira desaparece — nunca vira "sob consulta"
  // ao lado de um número que não existe. Com um preço só (mín. = máx.), sai o
  // valor cravado em vez de uma faixa que iria de X a X.
  const priceSentence =
    priceMinCents != null && priceMaxCents != null
      ? priceMinCents === priceMaxCents
        ? `Os preços por pote publicados hoje no catálogo são de ${centsToBRL(priceMinCents)}.`
        : `Os preços por pote publicados hoje no catálogo vão de ${centsToBRL(priceMinCents)} a ${centsToBRL(priceMaxCents)}.`
      : null;

  return (
    <section className="lc-home-section" aria-labelledby="lc-fab-start-title">
      <div className="lc-home-section-head">
        <h2 id="lc-fab-start-title">Por onde começar</h2>
        <p>Dois caminhos, e os dois terminam num lote com a sua marca no rótulo.</p>
      </div>

      <div className="lc-fab-paths">
        <article className="lc-fab-path">
          <span className="lc-fab-path-icon" aria-hidden="true">
            <PackageCheck size={22} />
          </span>
          <h3>Adotar uma fórmula do catálogo</h3>
          <p>
            Fórmulas já desenvolvidas e em produção, prontas para sair com o seu rótulo. Cada uma publica composição
            por dose, modo de uso e dossiê técnico. {priceSentence}
          </p>
          <p>Monte a cotação no carrinho e saia com o orçamento para copiar ou baixar em PDF.</p>
          <Link href="/catalogo" className="lc-btn lc-btn-primary lc-btn-icon-inline lc-fab-path-cta">
            Ver o catálogo de fórmulas
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </article>

        <article className="lc-fab-path">
          <span className="lc-fab-path-icon" aria-hidden="true">
            <FlaskConical size={22} />
          </span>
          <h3>Desenvolver a sua fórmula</h3>
          <p>
            Se o produto que você quer não está no catálogo, ele é desenhado a partir do banco de matérias-primas com
            que a fábrica trabalha hoje, dividido assim:
          </p>
          <ul className="lc-fab-ingredient-list">
            {ingredientBank.byCategory.map(({ category, count }) => (
              <li key={category}>
                <strong>{count}</strong> {INGREDIENT_CATEGORY_LABELS[category](count)}
              </li>
            ))}
          </ul>
          <a
            href="#lc-fab-contact-title"
            className="lc-btn lc-btn-ghost lc-btn-icon-inline lc-fab-path-cta lc-fab-path-cta--ghost"
          >
            Falar com a fábrica
            <ArrowRight size={16} aria-hidden="true" />
          </a>
        </article>
      </div>
    </section>
  );
}
