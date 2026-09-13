import type { Metadata } from "next";

import { CartView } from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "Carrinho - Lemon Caps",
  description: "Revise os itens da sua cotação, informe seus dados e gere o orçamento Lemon Caps.",
};

// Server Component só para expor metadata. Todo o conteúdo depende do
// carrinho salvo no navegador (localStorage), então vive inteiro no client
// component abaixo — ver components/cart/CartView.tsx sobre a guarda de
// hidratação (esqueleto até montar).
export default function CarrinhoPage() {
  return <CartView />;
}
