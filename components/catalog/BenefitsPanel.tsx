import { hasContent } from "@/lib/catalog/format-catalog";

interface BenefitsPanelProps {
  isOpen: boolean;
  summary: string | null;
  benefits: string[];
}

// Painel sólido (nunca vidro) com o resumo e a lista de benefícios. Some por
// completo quando não há nem resumo nem lista — quem decide mostrar o botão
// que abre este painel é o FormulaCard, checando o mesmo par de campos.
export function BenefitsPanel({ isOpen, summary, benefits }: BenefitsPanelProps) {
  return (
    <div className={`lc-benefits-panel ${isOpen ? "is-open" : ""}`.trim()}>
      {/* Um wrapper só: é a altura dele que o grid-template-rows (0fr/1fr, em
          globals.css) mede pra animar sem mexer em max-height. */}
      <div className="lc-benefits-panel-inner">
        {hasContent(summary) && <p className="lc-benefits-summary">{summary}</p>}
        {benefits.length > 0 && (
          <ul>
            {benefits.map((benefit, index) => (
              <li key={`${index}-${benefit}`}>{benefit}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
