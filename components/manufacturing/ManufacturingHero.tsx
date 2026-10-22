import Link from "next/link";
import { ArrowRight } from "lucide-react";

// DECISÃO DO DONO em 14/09/2026 — os botões de WhatsApp saíram do site inteiro,
// este inclusive. Motivo dele: "o cliente já entra direto no catálogo depois de
// entrar em contato com o comercial", ou seja, o botão não abria canal novo,
// repetia um contato que já aconteceu. Isto reverte a correção do mesmo dia que
// havia transformado o botão secundário deste herói em WhatsApp.
//
// Com a saída, o herói fica com uma ação só: ir para o catálogo. Isso está de
// acordo com a ordem anterior do dono sobre esta página — "o cliente entra na
// página de apresentação e dela parte pro catálogo" — e o contato por e-mail
// continua existindo no fim da página, em ManufacturingContact.
//
// NEXT_PUBLIC_WHATSAPP_NUMBER deixa de ser usada aqui.

// Abertura do site: é a primeira coisa que um comprador vê ao abrir o link que
// a fábrica divulga, então tem três obrigações e nenhuma a mais — dizer que
// empresa é esta, o que ela faz, e o que a pessoa faz em seguida.
//
// A ORDEM DAS DUAS AÇÕES é decisão do dono, dita com estas palavras: "o cliente
// entra na página de apresentação e dela parte pro catálogo". Por isso o botão
// principal (sólido, verde, o de maior peso visual) é o do catálogo, e falar
// com a fábrica é o caminho secundário — que reaparece com destaque próprio no
// fim da página, em ManufacturingContact, onde a pessoa já leu o que precisava
// para decidir escrever.
//
// "Cuiabá-MT" não é dado novo: é a cidade do endereço oficial da fábrica em
// lib/catalog/regulatory-info.ts ("... Santa Cruz, Cuiabá - MT, CEP 78068-190"),
// que o rodapé desta mesma página exibe por extenso. Fica escrito aqui em vez
// de recortado da string por código porque recortar endereço por posição quebra
// no dia em que o endereço muda de forma — e a cidade é o que menos muda.
//
// Não existe aqui: tempo de mercado, capacidade produtiva, prazo, certificação
// nem número de marcas atendidas. Nada disso está confirmado em fonte primária
// (ver o bloco de pendências em app/page.tsx).
export function ManufacturingHero() {
  return (
    <section className="lc-home-hero lc-fab-hero" aria-labelledby="lc-fab-hero-title">
      <p className="lc-fab-eyebrow">Indústria de suplementos &middot; Cuiabá-MT</p>
      <h1 id="lc-fab-hero-title" className="lc-home-hero-title">
        A Lemon Caps fabrica a sua linha de suplementos em marca própria
      </h1>
      <p className="lc-home-hero-lead">
        Private label do começo ao fim: você traz a marca, a indústria entrega o produto pronto para vender. Comece
        por uma fórmula que já existe no nosso catálogo ou desenvolva a sua a partir do nosso banco de
        matérias-primas.
      </p>
      <div className="lc-fab-hero-actions">
        <Link href="/catalogo" className="lc-btn lc-btn-primary lc-btn-icon-inline lc-home-hero-cta">
          Ver o catálogo de fórmulas
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
