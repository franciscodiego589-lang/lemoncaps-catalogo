interface EmptyStateProps {
  // Só aparece o botão quando existe filtro para limpar de fato (chamador
  // decide com base em segmento/formato/busca ativos) — catálogo genuinamente
  // vazio não ganha um botão que não resolveria nada.
  onClear?: () => void;
}

export function EmptyState({ onClear }: EmptyStateProps) {
  return (
    <div className="lc-empty-state">
      Nenhuma fórmula encontrada para este filtro.
      <br />
      Tente outro segmento, outra aba ou limpe a busca.
      {onClear && (
        <div className="lc-empty-state-actions">
          <button type="button" className="lc-btn lc-btn-ghost" onClick={onClear}>
            Limpar filtros
          </button>
        </div>
      )}
    </div>
  );
}
