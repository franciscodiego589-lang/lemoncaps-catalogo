import Link from "next/link";
import { notFound } from "next/navigation";

import { CompositionEditor } from "@/components/admin/CompositionEditor";
import { DeleteFormulaButton } from "@/components/admin/DeleteFormulaButton";
import { FormulaForm } from "@/components/admin/FormulaForm";
import { NutritionTableEditor } from "@/components/admin/NutritionTableEditor";
import { SheetApprovalPanel } from "@/components/admin/SheetApprovalPanel";
import { getAdminFormulaById, getAdminSegments, getFormulaSheetApprovals, getIngredientsForPicker } from "@/lib/data/admin";

export const metadata = { title: "Editar fórmula · Lemon Caps Admin" };

export default async function EditarFormulaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [formula, segments, ingredientOptions, sheetApprovals] = await Promise.all([
    getAdminFormulaById(id),
    getAdminSegments(),
    getIngredientsForPicker(),
    getFormulaSheetApprovals(id),
  ]);

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

      {/* Tabela de Informação Nutricional estruturada (RDC 429/2020 + IN
          75/2020) - item 1 da ampliação de escopo de 16/09/2026. Editor
          próprio (não faz parte do <FormulaForm> de cima): grava direto em
          formulas.metadata->tabela_nutricional + regenera nutritional_info,
          via updateNutritionTable (lib/actions/formulas.ts) - mesmo motivo
          de CompositionEditor logo acima ter a própria seção. */}
      <fieldset className="lc-admin-form-section">
        <h2>Informação nutricional</h2>
        <NutritionTableEditor formulaId={formula.id} initialTable={formula.nutritionTable} />
      </fieldset>

      {/* Assinatura da ficha: dado REGULATÓRIO, e o único bloco desta página em que
          o que se grava não pode mais ser alterado nem apagado depois - por isso vem
          separado, com o aviso dentro do próprio painel. */}
      <fieldset className="lc-admin-form-section">
        <h2>Assinatura da ficha técnica</h2>
        {/* key pela versão da ficha, de propósito: quem sobe a versão no formulário
            acima e salva dispara router.refresh(), e esta página reexecuta com o
            número novo. Sem a key, o painel manteria o estado antigo e o campo
            "Versão da ficha aprovada" continuaria oferecendo a versão ANTERIOR - a
            assinatura carimbaria a versão errada. Achado num teste ponta a ponta
            real desta tarefa: subi a ficha para 2, registrei a aprovação e ela saiu
            no PDF como "versão 1". Trocar a key remonta o painel já com o número
            certo e com o histórico recém-recarregado do banco. */}
        <SheetApprovalPanel
          key={formula.technicalSheetVersion}
          formulaId={formula.id}
          currentSheetVersion={formula.technicalSheetVersion}
          initialApprovals={sheetApprovals}
        />
      </fieldset>

      <fieldset className="lc-admin-form-section">
        <h2>Zona de risco</h2>
        <DeleteFormulaButton formulaId={formula.id} formulaName={formula.name} />
      </fieldset>
    </>
  );
}
