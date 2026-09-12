"use client";

import { ShoppingCart } from "lucide-react";

import { GlassFab } from "@/components/glass/GlassFab";
import { useCartStore } from "@/lib/store/cart";

// Botão flutuante do carrinho de cotação. A tela /carrinho completa é de
// outra etapa; o link já aponta para lá.
export function CartFab() {
  const count = useCartStore((state) => state.items.length);

  return (
    <GlassFab href="/carrinho" ariaLabel="Abrir carrinho de cotação" count={count}>
      <ShoppingCart size={22} aria-hidden="true" />
    </GlassFab>
  );
}
