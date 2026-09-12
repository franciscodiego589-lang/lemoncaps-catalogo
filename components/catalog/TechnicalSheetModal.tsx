import { ModalShell } from "@/components/glass/ModalShell";
import { hasContent, lineLabel } from "@/lib/catalog/format-catalog";
import type { FormulaDTO, SegmentDTO } from "@/lib/data/formulas";
import { CompositionTable } from "./CompositionTable";

interface TechnicalSheetModalProps {
  formula: FormulaDTO | null;
  segment: SegmentDTO | undefined;
  isOpen: boolean;
  onClose: () => void;
}

// "Dossiê Técnico" — painel SÓLIDO (nunca vidro): é a mesma razão da tabela de
// composição, só que em modal. Cada seção só aparece se o campo correspondente
// tiver conteúdo no banco; nada aqui é gerado ou completado por suposição.
export function TechnicalSheetModal({ formula, segment, isOpen, onClose }: TechnicalSheetModalProps) {
  if (!formula) return null;

  const sections: Array<{ title: string; content: string }> = [
    { title: "Modo de uso", content: formula.usageInstructions ?? "" },
    { title: "Informação nutricional", content: formula.nutritionalInfo ?? "" },
    { title: "Ingredientes", content: formula.ingredientsList ?? "" },
    { title: "Público-alvo", content: formula.targetAudience ?? "" },
    { title: "Conservação", content: formula.storageInstructions ?? "" },
    { title: "Advertências", content: formula.warnings ?? "" },
  ].filter((section) => hasContent(section.content));

  const subtitle = segment ? `${segment.name} · ${lineLabel(formula.line)}` : lineLabel(formula.line);

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      variant="solid"
      title={formula.technicalSheetTitle ?? formula.name}
      subtitle={subtitle}
    >
      <div className="lc-dossie-section">
        <h3>Composição por dose</h3>
        <CompositionTable compositions={formula.compositions} maxHeightPx={260} />
      </div>
      {sections.map((section) => (
        <div className="lc-dossie-section" key={section.title}>
          <h3>{section.title}</h3>
          <p className="lc-dossie-text">{section.content}</p>
        </div>
      ))}
    </ModalShell>
  );
}
