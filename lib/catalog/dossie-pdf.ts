// PDF do dossiê técnico, gerado inteiro no navegador (jsPDF + jspdf-autotable
// — mesmo par usado em lib/cart/quote-pdf.ts, mesmo estilo visual: cabeçalho
// "Lemon Caps", tabela com cabeçalho lima). Todo conteúdo vem exato do
// FormulaDetailDTO (que por sua vez veio do banco via getFormulaBySlug) —
// nada aqui é estimado, arredondado ou completado com valor plausível. Campo
// vazio/nulo no DTO nunca vira seção no PDF, mesma regra da página.
// Data no formato brasileiro via Intl.DateTimeFormat("pt-BR"), como pedido.
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import { centsToBRL } from "@/lib/money";
import type { FormulaDetailDTO } from "@/lib/data/formulas";
import { formatQuantity, hasContent, lineLabel, unitLabel } from "./format-catalog";

const DATE_FORMATTER = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

// Cores tiradas dos tokens reais de app/globals.css (nunca inventadas aqui):
// --lime / --lime-ink para o cabeçalho da tabela (igual ao PDF de orçamento),
// --ink para o corpo do texto e a mesma cor de aviso usada em .lc-min-warning
// / .lc-field-error (#b31f2e) para a seção de Advertências.
const LIME_FILL: [number, number, number] = [166, 225, 0];
const LIME_INK: [number, number, number] = [21, 36, 0];
const INK: [number, number, number] = [20, 22, 27];
const WARNING_COLOR: [number, number, number] = [179, 31, 46];

const PAGE_MARGIN_X = 14;
const BOTTOM_MARGIN = 18;
const LINE_HEIGHT = 5;
const PARAGRAPH_GAP = 4;
const SECTION_GAP = 3;

// jspdf-autotable anexa `lastAutoTable` na própria instância do documento em
// tempo de execução (documentado no README do pacote, seção "API": "you can
// use doc.lastAutoTable... doc.lastAutoTable.finalY"); não faz parte do tipo
// público de nenhum dos dois pacotes (jsPDFDocument é `any` no lado do
// plugin), então o acesso tipado exige esta extensão local.
interface JsPdfWithAutoTable extends jsPDF {
  lastAutoTable?: { finalY: number };
}

// API imperativa de cursor (própria do jsPDF): cada helper recebe a posição Y
// atual e devolve a próxima — não existe "objeto de documento imutável" aqui,
// é o próprio modelo de desenho do jsPDF (escreve e avança). O que evitamos
// mutar é o array/objeto de dados de entrada (formula), nunca tocado.
function getContentWidth(doc: jsPDF): number {
  return doc.internal.pageSize.getWidth() - PAGE_MARGIN_X * 2;
}

function ensureSpace(doc: jsPDF, cursorY: number, neededHeight: number): number {
  const pageHeight = doc.internal.pageSize.getHeight();
  if (cursorY + neededHeight > pageHeight - BOTTOM_MARGIN) {
    doc.addPage();
    return PAGE_MARGIN_X;
  }
  return cursorY;
}

function addSectionTitle(doc: jsPDF, startY: number, title: string, color: [number, number, number] = INK): number {
  let cursorY = ensureSpace(doc, startY, LINE_HEIGHT + SECTION_GAP);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...color);
  doc.text(title.toUpperCase(), PAGE_MARGIN_X, cursorY);
  doc.setTextColor(...INK);
  cursorY += LINE_HEIGHT + 1;
  return cursorY;
}

// Quebra por linha original ("\n" do banco) primeiro, depois por largura —
// não depende de o jsPDF tratar "\n" sozinho dentro de splitTextToSize
// (comportamento não conferido na doc instalada; quebrar antes é seguro e
// exato de qualquer forma, sem arriscar linha grudada num documento que
// publica advertência de rótulo de suplemento).
function addParagraph(doc: jsPDF, startY: number, text: string, prefix = ""): number {
  let cursorY = startY;
  const contentWidth = getContentWidth(doc) - (prefix ? doc.getTextWidth(prefix) : 0);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const rawLines = text.split("\n");
  for (const rawLine of rawLines) {
    const wrapped = rawLine.length === 0 ? [""] : (doc.splitTextToSize(rawLine, contentWidth) as string[]);
    for (const [index, line] of wrapped.entries()) {
      cursorY = ensureSpace(doc, cursorY, LINE_HEIGHT);
      const lineText = index === 0 ? `${prefix}${line}` : line;
      doc.text(lineText, PAGE_MARGIN_X, cursorY);
      cursorY += LINE_HEIGHT;
    }
  }
  return cursorY + PARAGRAPH_GAP;
}

function addTextSection(doc: jsPDF, startY: number, title: string, content: string | null): number {
  if (!hasContent(content)) return startY;
  let cursorY = addSectionTitle(doc, startY, title);
  cursorY = addParagraph(doc, cursorY, content);
  return cursorY;
}

export function downloadDossiePdf(formula: FormulaDetailDTO): void {
  const doc = new jsPDF();
  let cursorY = 18;

  // Cabeçalho: marca + tipo de documento + data (mesmo padrão do PDF de
  // orçamento, para os dois documentos saírem com a mesma identidade visual).
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Lemon Caps", PAGE_MARGIN_X, cursorY);

  cursorY += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("Dossiê técnico", PAGE_MARGIN_X, cursorY);
  cursorY += 6;
  doc.text(`Data: ${DATE_FORMATTER.format(new Date())}`, PAGE_MARGIN_X, cursorY);
  cursorY += 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  cursorY = ensureSpace(doc, cursorY, 8);
  doc.text(formula.technicalSheetTitle ?? formula.name, PAGE_MARGIN_X, cursorY);
  cursorY += 9;

  // ---- 1. Identificação -----------------------------------------------
  cursorY = addSectionTitle(doc, cursorY, "Identificação");
  const identityLines = [
    `Nome: ${formula.name}`,
    formula.segment ? `Segmento: ${formula.segment.name}` : null,
    `Linha: ${lineLabel(formula.line)}`,
    formula.regulatoryProductType ? `Tipo regulatório: ${formula.regulatoryProductType}` : null,
    formula.poteContentsDescription ? `Apresentação: ${formula.poteContentsDescription}` : null,
    formula.netWeight ? `Peso líquido: ${formula.netWeight}` : null,
  ].filter((line): line is string => line !== null);
  for (const line of identityLines) {
    cursorY = addParagraph(doc, cursorY, line);
  }
  cursorY += SECTION_GAP;

  // ---- 2. Composição por dose (tabela completa) ------------------------
  cursorY = addSectionTitle(doc, cursorY, "Composição por dose");
  if (formula.compositions.length > 0) {
    autoTable(doc, {
      startY: cursorY,
      margin: { left: PAGE_MARGIN_X, right: PAGE_MARGIN_X },
      head: [["Insumo", "Quantidade", "Unidade"]],
      body: formula.compositions.map((item) => [
        item.ingredientName,
        formatQuantity(item.quantity),
        unitLabel(item.unit),
      ]),
      headStyles: { fillColor: LIME_FILL, textColor: LIME_INK },
      styles: { fontSize: 9, cellPadding: 2.5, textColor: INK },
      columnStyles: {
        1: { halign: "right", cellWidth: 30 },
        2: { halign: "left", cellWidth: 25 },
      },
    });
    const finalY = (doc as JsPdfWithAutoTable).lastAutoTable?.finalY ?? cursorY;
    cursorY = finalY + 8;
  } else {
    cursorY = addParagraph(doc, cursorY, "Composição não cadastrada.");
  }

  // ---- 3 a 5. Informação nutricional, Ingredientes, Modo de uso --------
  cursorY = addTextSection(doc, cursorY, "Informação nutricional", formula.nutritionalInfo);
  cursorY = addTextSection(doc, cursorY, "Ingredientes", formula.ingredientsList);
  cursorY = addTextSection(doc, cursorY, "Modo de uso", formula.usageInstructions);

  // ---- 6. Benefícios (resumo + lista) -----------------------------------
  if (hasContent(formula.generalBenefitsSummary) || formula.benefits.length > 0) {
    cursorY = addSectionTitle(doc, cursorY, "Benefícios");
    if (hasContent(formula.generalBenefitsSummary)) {
      cursorY = addParagraph(doc, cursorY, formula.generalBenefitsSummary);
    }
    for (const benefit of formula.benefits) {
      cursorY = addParagraph(doc, cursorY, benefit, "- ");
    }
  }

  // ---- 7. Público-alvo ---------------------------------------------------
  cursorY = addTextSection(doc, cursorY, "Público-alvo", formula.targetAudience);

  // ---- 8. Advertências e restrições (destaque de cor, mesma da UI) ------
  if (hasContent(formula.warnings)) {
    cursorY = addSectionTitle(doc, cursorY, "Advertências e restrições", WARNING_COLOR);
    cursorY = addParagraph(doc, cursorY, formula.warnings);
  }

  // ---- 9. Conservação -----------------------------------------------------
  cursorY = addTextSection(doc, cursorY, "Conservação", formula.storageInstructions);

  // ---- 10. Condições comerciais ------------------------------------------
  cursorY = addSectionTitle(doc, cursorY, "Condições comerciais");
  if (formula.listPriceCents != null) {
    cursorY = addParagraph(doc, cursorY, `Preço por pote: ${centsToBRL(formula.listPriceCents)}`);
  } else {
    cursorY = addParagraph(doc, cursorY, "Preço por pote: sob consulta.");
  }
  cursorY = addParagraph(doc, cursorY, `Pedido mínimo: ${formula.minimumOrderPotes} potes.`);

  doc.save(`dossie-tecnico-${formula.slug}.pdf`);
}
