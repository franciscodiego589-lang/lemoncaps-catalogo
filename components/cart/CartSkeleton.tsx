// Esqueleto mostrado até o carrinho terminar de montar no navegador. O
// carrinho vive inteiro em localStorage (useCartStore, zustand/persist), que
// não existe durante a renderização no servidor — mostrar isto primeiro, igual
// nos dois lados (servidor e primeira pintura do cliente), evita divergência
// de hidratação. Só depois de montado (ver CartView) é que o conteúdo real
// (vazio, com itens, ou sucesso) aparece.
export function CartSkeleton() {
  return (
    <div className="lc-container">
      <div className="lc-page-head">
        <h1>Carrinho de cotação</h1>
      </div>
      <div className="lc-cart-skeleton" aria-hidden="true">
        <div className="lc-skeleton-bar" />
        <div className="lc-skeleton-bar" />
        <div className="lc-skeleton-bar" />
      </div>
    </div>
  );
}
