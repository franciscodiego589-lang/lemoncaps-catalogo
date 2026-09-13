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
        <Link href="/catalogo" className="lc-icon-btn" aria-label="Voltar ao catálogo">
          <ArrowLeft size={20} aria-hidden="true" />
        </Link>
        <div className="lc-brand">
          <span className="lc-brand-dot" aria-hidden="true" />
          <span translate="no">Lemon Caps</span>
        </div>
      </GlassSurface>
    </header>
  );
}
