import Link from "next/link";
import { notFound } from "next/navigation";

import { CompositionEditor } from "@/components/admin/CompositionEditor";
import { DeleteFormulaButton } from "@/components/admin/DeleteFormulaButton";
import { FormulaForm } from "@/components/admin/FormulaForm";
import { getAdminFormulaById, getAdminSegments, getIngredientsForPicker } from "@/lib/data/admin";

export const metadata = { title: "Editar fórmula · Lemon Caps Admin" };

export default async function EditarFormulaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [formula, segments, ingredientOptions] = await Promise.all([getAdminFormulaById(id), getAdminSegments(), getIngredientsForPicker()]);

  if (!formula) notFound();

  return (
    <>
      <div className="lc-admin-page-head">
        <div>
          <h1>{formula.name}</h1>
          <p>Editar fórmula, composição por dose e ver o custo real associado.</p>
        </div>
        <Link href={`/admin/custos/${formula.id}`} className="lc-btn lc-btn-ghost">
          Ver custo (interno)
        </Link>
      </div>

      <FormulaForm segments={segments} initial={formula} />

      <fieldset className="lc-admin-form-section">
        <h2>Composição por dose</h2>
        <CompositionEditor formulaId={formula.id} initialLines={formula.compositions} ingredientOptions={ingredientOptions} />
      </fieldset>

      <fieldset className="lc-admin-form-section">
        <h2>Zona de risco</h2>
        <DeleteFormulaButton formulaId={formula.id} formulaName={formula.name} />
      </fieldset>
    </>
  );
}
