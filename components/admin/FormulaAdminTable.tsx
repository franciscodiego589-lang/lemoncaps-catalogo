import Link from "next/link";

import { ActiveToggle } from "@/components/admin/ActiveToggle";
import { PRODUCT_FORMAT_LABELS, PRODUCT_LINE_LABELS } from "@/components/admin/enum-labels";
import type { AdminFormulaListItemDTO } from "@/lib/data/admin";
import { centsToBRL } from "@/lib/money";

interface FormulaAdminTableProps {
  formulas: AdminFormulaListItemDTO[];
}

export function FormulaAdminTable({ formulas }: FormulaAdminTableProps) {
  if (formulas.length === 0) {
    return <p className="lc-admin-empty">Nenhuma fórmula encontrada para este filtro.</p>;
  }

  return (
    <div className="lc-admin-table-wrap">
      <table className="lc-admin-table">
        <thead>
          <tr>
            <th scope="col">Nome</th>
            <th scope="col">Segmento</th>
            <th scope="col">Linha</th>
            <th scope="col">Formato</th>
            <th scope="col">Preço</th>
            <th scope="col">Situação</th>
          </tr>
        </thead>
        <tbody>
          {formulas.map((formula) => (
            <tr key={formula.id}>
              <td>
                <Link href={`/admin/catalogo/${formula.id}`} className="lc-admin-row-link">
                  {formula.name}
                </Link>
              </td>
              <td>{formula.segmentName}</td>
              <td>{PRODUCT_LINE_LABELS[formula.line]}</td>
              <td>{PRODUCT_FORMAT_LABELS[formula.format]}</td>
              <td className="lc-admin-col-num">{formula.listPriceCents !== null ? centsToBRL(formula.listPriceCents) : "-"}</td>
              <td>
                <ActiveToggle formulaId={formula.id} initialActive={formula.active} hasPrice={formula.listPriceCents !== null} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
