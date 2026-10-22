"use client";

import Link from "next/link";
import { ArrowLeft, ShoppingCart } from "lucide-react";

import { GlassSurface } from "@/components/glass/GlassSurface";
import { useCartStore } from "@/lib/store/cart";

// Topo compartilhado pelas duas páginas de produto (dossiê completo em
// /catalogo/[slug] e benefícios em /catalogo/[slug]/beneficios): mesmo cromo
// de vidro do catálogo (lc-topbar/lc-glass, ver GlassTopBar), sem busca —
// aqui o lugar dela é um link explícito de volta para /catalogo. O carrinho
// continua acessível a partir de qualquer uma delas. Client Component só por
// causa da contagem do carrinho (Zustand); o resto de cada página é Server
// Component.
export function DossieTopBar() {
  const cartCount = useCartStore((state) => state.items.length);

  return (
    <header className="lc-topbar lc-dossie-topbar">
      <GlassSurface className="lc-topbar-inner">
        {/* Marca clicável = caminho para a página inicial, que desde 13/09/2026
            é a apresentação da fábrica (ver app/page.tsx). Convive com o
            "Voltar ao catálogo" logo ao lado sem ambiguidade: um volta um
            passo na navegação, o outro sai para o começo do site. */}
        <Link href="/" className="lc-brand lc-brand-link" title="Lemon Caps - página inicial">
          <span className="lc-brand-dot" aria-hidden="true" />
          <span translate="no">Lemon Caps</span>
        </Link>
        <Link href="/catalogo" className="lc-dossie-back">
          <ArrowLeft size={16} aria-hidden="true" />
          Voltar ao catálogo
        </Link>
        <Link
          href="/carrinho"
          className="lc-icon-btn lc-cart-btn"
          aria-label={
            cartCount > 0
              ? `Abrir carrinho de cotação, ${cartCount} ${cartCount === 1 ? "item" : "itens"}`
              : "Abrir carrinho de cotação"
          }
        >
          <ShoppingCart size={20} aria-hidden="true" />
          {cartCount > 0 && (
            <span className="lc-badge" aria-hidden="true">
              {cartCount}
            </span>
          )}
        </Link>
      </GlassSurface>
    </header>
  );
}
