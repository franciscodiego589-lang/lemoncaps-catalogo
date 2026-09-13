import Link from "next/link";
import { ShoppingCart } from "lucide-react";

// Estado vazio do carrinho: quem abre /carrinho direto, sem nunca ter cotado
// nada, precisa ver isto (e não uma lista quebrada ou uma tela em branco).
// Mais robusto que o EmptyState de filtro do catálogo (que é só um aviso
// discreto) porque aqui é o único conteúdo possível da tela — ganha ícone,
// texto e um caminho claro de volta.
export function CartEmptyState() {
  return (
    <div className="lc-container">
      <div className="lc-cart-empty">
        <ShoppingCart size={40} aria-hidden="true" />
        <h2>Seu carrinho de cotação está vazio</h2>
        <p>Volte ao catálogo e adicione as fórmulas que quiser cotar.</p>
        <Link href="/catalogo" className="lc-btn lc-btn-primary">
          Ver catálogo
        </Link>
      </div>
    </div>
  );
}
