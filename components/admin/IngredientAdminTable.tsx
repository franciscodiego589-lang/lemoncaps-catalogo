import Link from "next/link";

import { INGREDIENT_CATEGORY_LABELS } from "@/components/admin/enum-labels";
import type { AdminIngredientListItemDTO } from "@/lib/data/admin";

interface IngredientAdminTableProps {
  ingredients: AdminIngredientListItemDTO[];
}

export function IngredientAdminTable({ ingredients }: IngredientAdminTableProps) {
  if (ingredients.length === 0) {
    return <p className="lc-admin-empty">Nenhum insumo encontrado para este filtro.</p>;
  }

  return (
    <div className="lc-admin-table-wrap">
      <table className="lc-admin-table">
        <thead>
          <tr>
            <th scope="col">Nome</th>
            <th scope="col">Categoria</th>
            <th scope="col">Alegação ANVISA</th>
            <th scope="col">Situação</th>
          </tr>
        </thead>
        <tbody>
          {ingredients.map((ingredient) => (
            <tr key={ingredient.id}>
              <td>
                <Link href={`/admin/insumos/${ingredient.id}`} className="lc-admin-row-link">
                  {ingredient.name}
                </Link>
              </td>
              <td>{INGREDIENT_CATEGORY_LABELS[ingredient.category]}</td>
              <td>
                {ingredient.hasClaim ? (
                  <span className="lc-admin-badge lc-admin-badge--active">Conferida</span>
                ) : (
                  <span className="lc-admin-badge lc-admin-badge--inactive">Pendente</span>
                )}
              </td>
              <td>
                <span className={`lc-admin-badge lc-admin-badge--${ingredient.active ? "active" : "inactive"}`}>
                  {ingredient.active ? "Ativo" : "Inativo"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
