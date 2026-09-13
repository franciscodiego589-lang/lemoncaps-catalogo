import { notFound } from "next/navigation";

import { CostForm } from "@/components/admin/CostForm";
import { getAdminFormulaById } from "@/lib/data/admin";
import { centsToBRL } from "@/lib/money";

export const metadata = { title: "Custo (interno) · Lemon Caps Admin" };

export default async function EditarCustoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const formula = await getAdminFormulaById(id);
  if (!formula) notFound();

  return (
    <>
      <div className="lc-admin-page-head">
        <div>
          <h1>{formula.name}</h1>
          <p>Preço público atual: {formula.listPriceCents !== null ? centsToBRL(formula.listPriceCents) : "não definido"}.</p>
        </div>
      </div>

      <div className="lc-admin-internal-banner" role="note">
        Informação 100% interna - nunca aparece no catálogo público, nem é lida pela chave anônima do site.
      </div>

      <CostForm formulaId={formula.id} initialUnitCostCents={formula.cost?.unitCostCents ?? null} initialInternalNotes={formula.cost?.internalNotes ?? null} />
    </>
  );
}
