"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { GlassSurface } from "@/components/glass/GlassSurface";

// Topo do carrinho: mesma receita de vidro da barra do catálogo (GlassTopBar,
// classes .lc-topbar/.lc-glass em app/globals.css) — é cromo, não conteúdo,
// então continua vidro de verdade. Sem busca aqui; o botão de ação é "voltar
// ao catálogo", que o item 6 do pedido exige sempre acessível nesta rota.
export function CartTopBar() {
  return (
    <header className="lc-topbar">
      <GlassSurface className="lc-topbar-inner">
        {/* Era só a seta, com o texto apenas no <span> visual: abaixo de
            560px (.lc-voltar-btn em globals.css) esse <span> vira
            display:none e, como a seta é aria-hidden, não sobrava nome
            acessível nenhum — o link ficava mudo pro leitor de tela (achado
            do axe-core, link-name, SERIOUS, confirmado em /carrinho a
            375px). aria-label no próprio <a> garante o nome sempre, esteja o
            <span> visível ou escondido. */}
        <Link href="/catalogo" className="lc-voltar-btn" aria-label="Voltar ao catálogo">
          <ArrowLeft size={18} aria-hidden="true" />
          <span>Voltar ao catálogo</span>
        </Link>
        <div className="lc-brand">
          <span className="lc-brand-dot" aria-hidden="true" />
          <span translate="no">Lemon Caps</span>
        </div>
      </GlassSurface>
    </header>
  );
}
