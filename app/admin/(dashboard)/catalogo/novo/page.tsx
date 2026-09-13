import { FormulaForm } from "@/components/admin/FormulaForm";
import { getAdminSegments } from "@/lib/data/admin";

export const metadata = { title: "Nova fórmula · Lemon Caps Admin" };

export default async function NovaFormulaPage() {
  const segments = await getAdminSegments();

  return (
    <>
      <div className="lc-admin-page-head">
        <div>
          <h1>Nova fórmula</h1>
          <p>Depois de criar, a composição por dose é adicionada na própria tela de edição.</p>
        </div>
      </div>
      <FormulaForm segments={segments} />
    </>
  );
}
