import { formatQuantity, unitLabel } from "@/lib/catalog/format-catalog";
import type { FormulaCompositionDTO } from "@/lib/data/formulas";

// Tabela de composição — SEMPRE sólida (nunca vidro, nunca backdrop-filter).
// É texto pequeno e denso: exatamente o caso em que o próprio material Liquid
// Glass nativo perde contraste (ver liquid-glass-guia.md, seção 4). Insumo,
// quantidade e unidade vêm exatos do banco — nada aqui arredonda ou completa.
interface CompositionTableProps {
  compositions: FormulaCompositionDTO[];
  maxHeightPx?: number;
  // Corta a lista visível no card (sem limite -> mostra tudo, é o caso do
  // Dossiê Técnico). Nunca esconde dado sem caminho: quando corta, mostra o
  // botão abaixo com o total real e um jeito de ver a lista inteira.
  limit?: number;
  onViewAll?: () => void;
}

export function CompositionTable({ compositions, maxHeightPx = 212, limit, onViewAll }: CompositionTableProps) {
  if (compositions.length === 0) {
    return (
      <div className="lc-comp-table-wrap">
        <p className="lc-comp-empty">Composição não cadastrada.</p>
      </div>
    );
  }

  const isTruncated = typeof limit === "number" && compositions.length > limit;
  const visibleCompositions = isTruncated ? compositions.slice(0, limit) : compositions;

  return (
    <div className="lc-comp-wrap">
      <div className="lc-comp-table-wrap" style={{ maxHeight: maxHeightPx }}>
        <table className="lc-comp-table">
          <thead>
            <tr>
              <th>Insumo</th>
              <th>Dose</th>
            </tr>
          </thead>
          <tbody>
            {visibleCompositions.map((item) => (
              <tr key={item.id}>
                <td>{item.ingredientName}</td>
                <td className="lc-qty">
                  {formatQuantity(item.quantity)} {unitLabel(item.unit)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isTruncated && onViewAll && (
        <button type="button" className="lc-comp-more" onClick={onViewAll}>
          Ver todos os {compositions.length} insumos
        </button>
      )}
    </div>
  );
}
