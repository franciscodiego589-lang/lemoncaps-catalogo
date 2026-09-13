import Link from "next/link";

import { formatQuantity, unitLabel } from "@/lib/catalog/format-catalog";
import type { FormulaCompositionDTO } from "@/lib/data/formulas";

// Tabela de composição — SEMPRE sólida (nunca vidro, nunca backdrop-filter).
// É texto pequeno e denso: exatamente o caso em que o próprio material Liquid
// Glass nativo perde contraste (ver liquid-glass-guia.md, seção 4). Insumo,
// quantidade e unidade vêm exatos do banco — nada aqui arredonda ou completa.
interface CompositionTableProps {
  compositions: FormulaCompositionDTO[];
  // null = sem caixa de rolagem própria (dossiê completo: a tabela flui na
  // página inteira, sem cortar por altura — importante também para impressão,
  // que já força max-height:none via @media print, mas aqui já nasce sem
  // limite). Omitido = 212px com rolagem própria (card).
  maxHeightPx?: number | null;
  // Corta a lista visível no card (sem limite -> mostra tudo). Nunca esconde
  // dado sem caminho: quando corta, mostra abaixo um link com o total real,
  // que leva à página onde a lista aparece inteira.
  limit?: number;
  // Navegação de verdade (diretrizes de interface: <Link> pra ir a outro
  // lugar, nunca onClick numa "ação" que na prática só troca de página) —
  // sempre a página de dossiê completo da própria fórmula. Omitido = sem
  // truncar nada, o botão "ver todos" nunca aparece (caso do dossiê).
  viewAllHref?: string;
}

export function CompositionTable({ compositions, maxHeightPx = 212, limit, viewAllHref }: CompositionTableProps) {
  if (compositions.length === 0) {
    return (
      <div className="lc-comp-table-wrap">
        <p className="lc-comp-empty">Composição não cadastrada.</p>
      </div>
    );
  }

  const isTruncated = typeof limit === "number" && compositions.length > limit;
  const visibleCompositions = isTruncated ? compositions.slice(0, limit) : compositions;
  const isBoxed = maxHeightPx != null;

  return (
    <div className="lc-comp-wrap">
      {/* Sem role="region" de propósito: a página tem uma tabela dessas por
          card (22 no catálogo hoje) e todas teriam o mesmo nome acessível —
          22 landmarks iguais falham "landmark-unique". tabIndex + aria-label
          já bastam pra corrigir o achado (foco por teclado + nome ao
          anunciar), sem criar um landmark novo por card. Na variante "flat"
          (dossiê completo) não há rolagem própria — nada a anunciar, nada de
          tabIndex morto sem função. */}
      <div
        className={isBoxed ? "lc-comp-table-wrap" : "lc-comp-table-wrap lc-comp-table-wrap--flat"}
        style={isBoxed ? { maxHeight: maxHeightPx } : undefined}
        {...(isBoxed ? { tabIndex: 0, "aria-label": "Composição, role para ver mais" } : {})}
      >
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
      {isTruncated && viewAllHref && (
        <Link href={viewAllHref} className="lc-comp-more">
          Ver todos os {compositions.length} insumos
        </Link>
      )}
    </div>
  );
}
