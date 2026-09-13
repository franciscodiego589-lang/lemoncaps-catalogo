"use client";

import Link from "next/link";
import { Lock, ShoppingCart } from "lucide-react";

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
        {/* Acesso à área administrativa, discreto e no canto (pedido do dono:
            "pode ficar na mesma página do catálogo em um canto como botão").
            Fica aqui e não numa página externa porque, sem nenhum caminho
            visível, o dono não achava o painel — o /login existia mas nada
            no site levava até ele.

            Não é porta dos fundos: o /admin já exige sessão do Supabase Auth
            e registro ativo em staff_profiles. Mostrar o caminho não afrouxa
            nada — só deixa de esconder de quem tem a senha. Por isso também
            é discreto: não compete com o carrinho, que é a ação do cliente. */}
        <Link href="/login" className="lc-admin-btn" title="Entrar na área administrativa">
          <Lock size={15} aria-hidden="true" />
          <span>Admin</span>
        </Link>
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
