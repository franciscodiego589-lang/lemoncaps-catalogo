import Link from "next/link";
import { ArrowRight, ScrollText } from "lucide-react";

import { GlassSurface } from "@/components/glass/GlassSurface";

// Topo da porta de entrada (/): mesmo cromo de vidro do resto do site
// (lc-topbar/lc-glass, ver GlassTopBar, DossieTopBar e CartTopBar), sem busca e
// sem carrinho — quem chega aqui está avaliando a fábrica, não montando pedido.
//
// Até 13/09/2026 esta barra levava um botão "Fabricação" apontando para
// /fabricacao; com a fabricação virando o conteúdo desta mesma página, esse
// botão passaria a apontar para o endereço em que o visitante já está. Sumiu
// por isso, não por falta de espaço — o critério nunca foi a contagem de itens,
// e sim se o item leva a algum lugar novo.
//
// Por esse mesmo critério, "Documentação" ENTROU no mesmo dia (ordem do dono):
// leva a /documentacao, que é outra página e o único lugar do site onde as
// normas da Anvisa aparecem reunidas. Ele fica na pílula translúcida discreta
// (.lc-nav-btn) justamente para não disputar atenção com o CTA do catálogo,
// que continua sendo a ação primária desta barra.
//
// A marca é texto, não link: linkar / para / dentro da própria / é um caminho
// que não leva a lugar nenhum. Nas outras rotas (catálogo, dossiê, carrinho) é
// o contrário — lá a marca É o link de volta para cá.
//
// A barra é `position: sticky` (.lc-topbar), então o botão do catálogo
// acompanha a rolagem: o caminho que o dono pediu para ficar óbvio está na tela
// o tempo todo, e não só na primeira dobra e no rodapé.
//
// Server Component: nada aqui depende de estado do cliente.
export function HomeTopBar() {
  return (
    <header className="lc-topbar">
      <GlassSurface as="nav" className="lc-topbar-inner" aria-label="Principal">
        <div className="lc-brand">
          <span className="lc-brand-dot" aria-hidden="true" />
          <span translate="no">Lemon Caps</span>
        </div>
        {/* Documentação regulatória (pedido do dono, 13/09/2026: "coloca um
            botão de documentação, por exemplo, de todas as normas que seguimos
            da ANVISA e vigilância sanitária"). Vem ANTES do CTA porque não
            compete com ele: o "Ver catálogo" continua sendo a ação primária,
            em botão sólido; este é navegação, na pílula translúcida discreta
            que a barra do catálogo já usa (.lc-nav-btn).

            aria-label explícito, e não só o `title`: no celular o <span> sai
            do layout com display:none e o link viraria um ícone sem nome para
            leitor de tela. O rótulo CONTÉM a palavra visível "Documentação",
            como exige o critério WCAG 2.5.3 (Label in Name). */}
        <Link
          href="/documentacao"
          className="lc-admin-btn lc-nav-btn"
          aria-label="Documentação regulatória"
          title="Documentação regulatória"
        >
          <ScrollText size={15} aria-hidden="true" />
          <span>Documentação</span>
        </Link>
        <Link href="/catalogo" className="lc-btn lc-btn-primary lc-btn-icon-inline lc-home-topbar-cta">
          Ver catálogo
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </GlassSurface>
    </header>
  );
}
