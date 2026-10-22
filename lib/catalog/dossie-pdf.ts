// PDF do dossiê técnico, gerado inteiro no navegador (jsPDF + jspdf-autotable
// - mesmo par usado em lib/cart/quote-pdf.ts, mesma identidade visual, feita
// junto com o layout compartilhado em lib/pdf/). Todo conteúdo vem exato do
// FormulaDetailDTO (que por sua vez veio do banco via getFormulaBySlug) -
// nada aqui é estimado, arredondado ou completado com valor plausível. Campo
// vazio/nulo no DTO nunca vira seção no PDF, mesma regra da página web
// (app/catalogo/[slug]/page.tsx) - as 13 seções abaixo seguem a MESMA ordem e
// as MESMAS condições de exibição daquela página, para os dois canais nunca
// divergirem entre si.
//
// As seções sobre a fórmula (Identificação até Conformidade) e os dois blocos
// institucionais do fim (Marco regulatório e Fabricante) vivem em
// lib/pdf/formula-sections.ts - o MESMO módulo que a ficha técnica de cada
// item do orçamento (lib/cart/quote-pdf.ts) usa. Extraídas nesta tarefa para
// os dois documentos nunca divergirem: um ajuste de texto, cor ou condição de
// exibição feito ali vale para os dois PDFs ao mesmo tempo. "Condições
// comerciais" (a única seção abaixo que não mora naquele módulo) é exclusiva
// do dossiê - o orçamento já mostra preço/quantidade cotados de outra forma,
// ligados à proposta, não ao preço de tabela da fórmula.
import { jsPDF } from "jspdf";

import { centsToBRL } from "@/lib/money";
import type { FormulaDetailDTO } from "@/lib/data/formulas";
import { lineLabel } from "./format-catalog";
import {
  addBenefitsSection,
  addComplianceSection,
  addCompositionSection,
  addIdentitySection,
  addIngredientsSection,
  addManufacturerSection,
  addNutritionalSection,
  addPackagingSection,
  addRegulatoryFrameworkSection,
  addSheetApprovalSection,
  addStorageSection,
  addTargetAudienceSection,
  addUsageSection,
  addWarningsSection,
} from "@/lib/pdf/formula-sections";
import { addFactRows, addSectionTitle } from "@/lib/pdf/layout";
import { drawCoverBlock, stampRunningHeaderAndFooter } from "@/lib/pdf/header-footer";
import { CONTENT_START_Y, LONG_DATE_FORMATTER } from "@/lib/pdf/theme";

const DOC_TYPE_LABEL = "Dossiê técnico";

export function downloadDossiePdf(formula: FormulaDetailDTO): void {
  const doc = new jsPDF();
  const documentTitle = formula.technicalSheetTitle ?? formula.name;
  const subtitle = formula.segment ? `${formula.segment.name} · ${lineLabel(formula.line)}` : lineLabel(formula.line);

  let cursorY = drawCoverBlock(doc, CONTENT_START_Y, {
    docTypeLabel: DOC_TYPE_LABEL,
    title: documentTitle,
    subtitle,
    issuedAtLabel: LONG_DATE_FORMATTER.format(new Date()),
  });

  // ---- 1. Identificação -------------------------------------------------
  cursorY = addIdentitySection(doc, cursorY, formula);

  // ---- 2. Composição por dose (tabela completa) --------------------------
  cursorY = addCompositionSection(doc, cursorY, formula);

  // ---- 3 a 5. Informação nutricional, Ingredientes, Modo de uso ----------
  cursorY = addNutritionalSection(doc, cursorY, formula);
  cursorY = addIngredientsSection(doc, cursorY, formula);
  cursorY = addUsageSection(doc, cursorY, formula);

  // ---- 6. Benefícios (resumo + lista) -------------------------------------
  cursorY = addBenefitsSection(doc, cursorY, formula);

  // ---- 7. Público-alvo -----------------------------------------------------
  cursorY = addTargetAudienceSection(doc, cursorY, formula);

  // ---- 8. Advertências e restrições (moldura de destaque - informação de
  // segurança, mesma cor de aviso da página web) ----------------------------
  cursorY = addWarningsSection(doc, cursorY, formula);

  // ---- 9. Conservação -------------------------------------------------------
  cursorY = addStorageSection(doc, cursorY, formula);

  // ---- 9.1. Especificação de embalagem e logística (só quando houver algum
  // campo do pacote técnico preenchido) -----------------------------------------
  // Vem logo antes das condições comerciais de propósito: quem lê preço e
  // pedido mínimo é a mesma pessoa que precisa de peso, dimensão e unidades
  // por caixa para fechar o frete.
  cursorY = addPackagingSection(doc, cursorY, formula);

  // ---- 10. Condições comerciais (exclusiva do dossiê - ver comentário do
  // topo do arquivo) -----------------------------------------------------------
  cursorY = addSectionTitle(doc, cursorY, "Condições comerciais");
  cursorY = addFactRows(doc, cursorY, [
    {
      label: "Preço por pote",
      value: formula.listPriceCents != null ? centsToBRL(formula.listPriceCents) : "Sob consulta",
    },
    { label: "Pedido mínimo", value: `${formula.minimumOrderPotes} potes` },
  ]);

  // ---- 11. Conformidade (só quando complianceVerifiedAt não é nulo) --------
  cursorY = addComplianceSection(doc, cursorY, formula);

  // ---- 11.1. Assinatura da ficha técnica (só quando houver aprovação de
  // responsável técnico registrada) ---------------------------------------------
  cursorY = addSheetApprovalSection(doc, cursorY, formula);

  // ---- 12. Marco regulatório aplicável (sempre, igual em todo PDF) ---------
  cursorY = addRegulatoryFrameworkSection(doc, cursorY);

  // ---- 13. Fabricante e responsabilidade técnica (sempre, igual em todo PDF)
  addManufacturerSection(doc, cursorY);

  stampRunningHeaderAndFooter(doc, { docType: DOC_TYPE_LABEL, documentTitle });

  doc.save(`dossie-tecnico-${formula.slug}.pdf`);
}
