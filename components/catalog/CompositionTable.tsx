import { formatQuantity, unitLabel } from "@/lib/catalog/format-catalog";
import type { FormulaCompositionDTO } from "@/lib/data/formulas";

// Tabela de composição — SEMPRE sólida (nunca vidro, nunca backdrop-filter).
// É texto pequeno e denso: exatamente o caso em que o próprio material Liquid
// Glass nativo perde contraste (ver liquid-glass-guia.md, seção 4). Insumo,
// quantidade e unidade vêm exatos do banco — nada aqui arredonda ou completa.
interface CompositionTableProps {
  compositions: FormulaCompositionDTO[];
  maxHeightPx?: number;
}

export function CompositionTable({ compositions, maxHeightPx = 212 }: CompositionTableProps) {
  if (compositions.length === 0) {
    return (
      <div className="lc-comp-table-wrap">
        <p className="lc-comp-empty">Composição não cadastrada.</p>
      </div>
    );
  }

  return (
    <div className="lc-comp-table-wrap" style={{ maxHeight: maxHeightPx }}>
      <table className="lc-comp-table">
        <thead>
          <tr>
            <th>Insumo</th>
            <th>Dose</th>
          </tr>
        </thead>
        <tbody>
          {compositions.map((item) => (
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
  );
}
