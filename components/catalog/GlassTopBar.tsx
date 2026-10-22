"use client";

import Link from "next/link";
import { Lock, ScrollText, ShoppingCart } from "lucide-react";

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
        {/* A marca é o caminho de volta para a página inicial — que desde
            13/09/2026 É a apresentação da fábrica (ver app/page.tsx).
            Até essa data havia aqui um botão "Fabricação" apontando para
            /fabricacao; com a fabricação virando a raiz, ele e a marca
            passariam a levar ao mesmo endereço. Dois itens de menu para o mesmo
            lugar confundem, então ficou o padrão que todo site usa: o
            logotipo leva ao início. Ordem do dono, 13/09/2026. */}
        <Link href="/" className="lc-brand lc-brand-link" title="Lemon Caps - página inicial">
          <span className="lc-brand-dot" aria-hidden="true" />
          <span translate="no">Lemon Caps</span>
        </Link>
        <SearchBar value={searchValue} onChange={onSearchChange} />
        {/* Documentação regulatória (pedido do dono, 13/09/2026: "coloca um
            botão de documentação, por exemplo, de todas as normas que seguimos
            da ANVISA e vigilância sanitária"). Leva a /documentacao.

            Reaproveita .lc-nav-btn, que tinha ficado sem uso quando o botão
            "Fabricação" saiu desta barra e que já está calibrado para
            exatamente este papel: mesma pílula translúcida do Admin, mesmas
            regras de `order`, o `margin-left: auto` do bloco da direita (o
            Admin abre mão dele pela regra `.lc-nav-btn ~ .lc-admin-btn`) e o
            alvo de toque de 44px.

            aria-label explícito, e não só o `title`: no celular o <span> sai
            do layout com display:none, o que também o tira do nome acessível —
            o link viraria um ícone sem nome para leitor de tela. O rótulo aqui
            CONTÉM a palavra visível "Documentação", como exige o critério WCAG
            2.5.3 (Label in Name). */}
        <Link
          href="/documentacao"
          className="lc-admin-btn lc-nav-btn"
          aria-label="Documentação regulatória"
          title="Documentação regulatória"
        >
          <ScrollText size={15} aria-hidden="true" />
          <span>Documentação</span>
        </Link>
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
