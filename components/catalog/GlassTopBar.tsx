"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { GlassSurface } from "@/components/glass/GlassSurface";
import { useCartStore } from "@/lib/store/cart";
import { SearchBar } from "./SearchBar";

interface GlassTopBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export function GlassTopBar({ searchValue, onSearchChange }: GlassTopBarProps) {
  const cartCount = useCartStore((state) => state.items.length);

  return (
    <header className="lc-topbar">
      <GlassSurface className="lc-topbar-inner">
        <div className="lc-brand">
          <span className="lc-brand-dot" aria-hidden="true" />
          <span translate="no">Lemon Caps</span>
        </div>
        <SearchBar value={searchValue} onChange={onSearchChange} />
        {/* A tela /carrinho completa vem em outra etapa — o link já aponta
            para lá; até ela existir, o próprio Next mostra a página padrão de
            não encontrado. */}
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
