// PDF do dossiê técnico, gerado inteiro no navegador (jsPDF + jspdf-autotable
// - mesmo par usado em lib/cart/quote-pdf.ts, mesma identidade visual, feita
// junto com o layout compartilhado em lib/pdf/). Todo conteúdo vem exato do
// FormulaDetailDTO (que por sua vez veio do banco via getFormulaBySlug) -
// nada aqui é estimado, arredondado ou completado com valor plausível. Campo
// vazio/nulo no DTO nunca vira seção no PDF, mesma regra da página web
// (app/catalogo/[slug]/page.tsx) - as 13 seções abaixo seguem a MESMA ordem e
// as MESMAS condições de exibição daquela página, para os dois canais nunca
// divergirem entre si.
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import { centsToBRL } from "@/lib/money";
import type { FormulaDetailDTO } from "@/lib/data/formulas";
import { formatQuantity, hasContent, lineLabel, stripLeadingBulletMarker, unitLabel } from "./format-catalog";
import {
  formatComplianceDate,
  MANUFACTURER_INFO,
  REGULATORY_FRAMEWORK,
  REGULATORY_SOURCE,
} from "./regulatory-info";
import {
  addCallout,
  addFactRows,
  addParagraph,
  addSectionTitle,
  readFinalY,
  tableTheme,
  type FactRow,
} from "@/lib/pdf/layout";
import { drawCoverBlock, stampRunningHeaderAndFooter } from "@/lib/pdf/header-footer";
import {
  COLOR_ACCENT_BORDER,
  COLOR_ACCENT_TINT,
  COLOR_INK,
  COLOR_LIME_DEEP,
  COLOR_MUTED,
  COLOR_WARNING,
  COLOR_WARNING_BORDER,
  COLOR_WARNING_TINT,
  CONTENT_START_Y,
  FONT_SIZE_CAPTION,
  LONG_DATE_FORMATTER,
} from "@/lib/pdf/theme";

const DOC_TYPE_LABEL = "Dossiê técnico";

// Seção de texto simples (título + parágrafo): só entra se o campo tiver
// conteúdo real (hasContent) - campo vazio nunca vira seção em branco.
function addTextSection(doc: jsPDF, startY: number, title: string, content: string | null): number {
  if (!hasContent(content)) return startY;
  const cursorY = addSectionTitle(doc, startY, title);
  return addParagraph(doc, cursorY, content);
}

function buildIdentityFacts(formula: FormulaDetailDTO): FactRow[] {
  return [
    { label: "Nome", value: formula.name },
    formula.segment ? { label: "Segmento", value: formula.segment.name } : null,
    { label: "Linha", value: lineLabel(formula.line) },
    formula.regulatoryProductType ? { label: "Tipo regulatório", value: formula.regulatoryProductType } : null,
    formula.poteContentsDescription ? { label: "Apresentação", value: formula.poteContentsDescription } : null,
    formula.netWeight ? { label: "Peso líquido", value: formula.netWeight } : null,
  ].filter((fact): fact is FactRow => fact !== null);
}

export function downloadDossiePdf(formula: FormulaDetailDTO): void {
  const doc = new jsPDF();
  const documentTitle = formula.technicalSheetTitle ?? formula.name;
  const subtitle = formula.segment ? `${formula.segment.name} - ${lineLabel(formula.line)}` : lineLabel(formula.line);

  let cursorY = drawCoverBlock(doc, CONTENT_START_Y, {
    docTypeLabel: DOC_TYPE_LABEL,
    title: documentTitle,
    subtitle,
    issuedAtLabel: LONG_DATE_FORMATTER.format(new Date()),
  });

  // ---- 1. Identificação -------------------------------------------------
  cursorY = addSectionTitle(doc, cursorY, "Identificação");
  cursorY = addFactRows(doc, cursorY, buildIdentityFacts(formula));

  // ---- 2. Composição por dose (tabela completa) --------------------------
  // Exibe a massa do insumo exatamente como está gravada (formatQuantity só
  // troca "." por "," - nunca converte para elemento nem soma percentual).
  cursorY = addSectionTitle(doc, cursorY, "Composição por dose");
  if (formula.compositions.length > 0) {
    autoTable(doc, {
      ...tableTheme(),
      startY: cursorY,
      head: [["Insumo", "Quantidade", "Unidade"]],
      body: formula.compositions.map((item) => [item.ingredientName, formatQuantity(item.quantity), unitLabel(item.unit)]),
      columnStyles: {
        0: { halign: "left" },
        1: { halign: "right", cellWidth: 32 },
        2: { halign: "left", cellWidth: 26 },
      },
    });
    cursorY = readFinalY(doc, cursorY) + 9;
  } else {
    cursorY = addParagraph(doc, cursorY, "Composição não cadastrada.");
  }

  // ---- 3 a 5. Informação nutricional, Ingredientes, Modo de uso ----------
  cursorY = addTextSection(doc, cursorY, "Informação nutricional", formula.nutritionalInfo);
  cursorY = addTextSection(doc, cursorY, "Ingredientes", formula.ingredientsList);
  cursorY = addTextSection(doc, cursorY, "Modo de uso", formula.usageInstructions);

  // ---- 6. Benefícios (resumo + lista) -------------------------------------
  if (hasContent(formula.generalBenefitsSummary) || formula.benefits.length > 0) {
    cursorY = addSectionTitle(doc, cursorY, "Benefícios");
    if (hasContent(formula.generalBenefitsSummary)) {
      cursorY = addParagraph(doc, cursorY, formula.generalBenefitsSummary);
    }
    for (const benefit of formula.benefits) {
      // Mesma limpeza da página web (stripLeadingBulletMarker): alguns
      // benefícios já vêm do banco com marcador embutido no texto - sem isso
      // o PDF mostraria marcador duplicado ("- - Contribui..." / "- • Contribui...").
      cursorY = addParagraph(doc, cursorY, stripLeadingBulletMarker(benefit), { prefix: "- " });
    }
  }

  // ---- 7. Público-alvo -----------------------------------------------------
  cursorY = addTextSection(doc, cursorY, "Público-alvo", formula.targetAudience);

  // ---- 8. Advertências e restrições (moldura de destaque - informação de
  // segurança, mesma cor de aviso da página web) ----------------------------
  if (hasContent(formula.warnings)) {
    cursorY = addSectionTitle(doc, cursorY, "Advertências e restrições", COLOR_WARNING);
    cursorY = addCallout(doc, cursorY, [formula.warnings], {
      borderColor: COLOR_WARNING_BORDER,
      fillColor: COLOR_WARNING_TINT,
      textColor: COLOR_WARNING,
    });
  }

  // ---- 9. Conservação -------------------------------------------------------
  cursorY = addTextSection(doc, cursorY, "Conservação", formula.storageInstructions);

  // ---- 10. Condições comerciais ---------------------------------------------
  cursorY = addSectionTitle(doc, cursorY, "Condições comerciais");
  cursorY = addFactRows(doc, cursorY, [
    {
      label: "Preço por pote",
      value: formula.listPriceCents != null ? centsToBRL(formula.listPriceCents) : "Sob consulta",
    },
    { label: "Pedido mínimo", value: `${formula.minimumOrderPotes} potes` },
  ]);

  // ---- 11. Conformidade (só quando complianceVerifiedAt não é nulo) --------
  // AFIRMAÇÃO sobre ESTA fórmula específica - nunca confundir com o bloco de
  // Marco regulatório logo abaixo, que é igual em todo PDF e não afirma
  // conformidade de ninguém (mesma separação da página /catalogo/[slug]:
  // moldura verde de "verificado" aqui, texto neutro sem moldura lá embaixo).
  if (formula.complianceVerifiedAt) {
    cursorY = addSectionTitle(doc, cursorY, "Conformidade", COLOR_LIME_DEEP);
    const complianceParagraphs = [
      `Composição conferida contra os limites vigentes da ANVISA em ${formatComplianceDate(formula.complianceVerifiedAt)}.`,
      `Normas conferidas: ${formula.complianceNorms.join(", ")}.`,
      ...(formula.complianceSource ? [`Fonte consultada: ${formula.complianceSource}`] : []),
    ];
    cursorY = addCallout(doc, cursorY, complianceParagraphs, {
      borderColor: COLOR_ACCENT_BORDER,
      fillColor: COLOR_ACCENT_TINT,
      textColor: COLOR_INK,
    });
  }

  // ---- 12. Marco regulatório aplicável (sempre, igual em todo PDF) ---------
  // Conteúdo fixo institucional (lib/catalog/regulatory-info.ts) - citar a
  // norma que rege esta categoria de produto não é o mesmo que afirmar que
  // esta fórmula a cumpre; essa afirmação só existe no bloco 11 acima.
  cursorY = addSectionTitle(doc, cursorY, "Marco regulatório aplicável", COLOR_MUTED);
  cursorY = addParagraph(
    doc,
    cursorY,
    "Suplementos alimentares da Lemon Caps são fabricados sob o seguinte marco regulatório da ANVISA:",
  );
  for (const item of REGULATORY_FRAMEWORK) {
    cursorY = addParagraph(doc, cursorY, `${item.norm} - ${item.description}`, { prefix: "- " });
  }
  cursorY = addParagraph(
    doc,
    cursorY,
    `Fonte consultada: ${REGULATORY_SOURCE.label}, conferida em ${REGULATORY_SOURCE.consultedAtLabel}.`,
    { fontSize: FONT_SIZE_CAPTION, color: COLOR_MUTED },
  );

  // ---- 13. Fabricante e responsabilidade técnica (sempre, igual em todo PDF)
  cursorY = addSectionTitle(doc, cursorY, "Fabricante e responsabilidade técnica", COLOR_MUTED);
  addParagraph(
    doc,
    cursorY,
    `Fabricado e envasado por ${MANUFACTURER_INFO.companyName}, CNPJ ${MANUFACTURER_INFO.cnpj}.\n${MANUFACTURER_INFO.address}.\nFarmacêutico responsável: ${MANUFACTURER_INFO.pharmacist}.\n${MANUFACTURER_INFO.registrationExemption}\nSAC: ${MANUFACTURER_INFO.sac}`,
    { fontSize: FONT_SIZE_CAPTION, color: COLOR_MUTED },
  );

  stampRunningHeaderAndFooter(doc, { docType: DOC_TYPE_LABEL, documentTitle });

  doc.save(`dossie-tecnico-${formula.slug}.pdf`);
}
