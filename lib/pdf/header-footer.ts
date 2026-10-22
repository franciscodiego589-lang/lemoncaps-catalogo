// Cabeçalho e rodapé corridos (toda página) + bloco de abertura ("capa") da
// primeira página. Os dois documentos gerados no navegador (dossiê técnico e
// orçamento) chamam as mesmas duas funções deste arquivo para saírem com a
// mesma identidade visual.
//
// stampRunningHeaderAndFooter roda numa SEGUNDA passada, depois que todo o
// conteúdo já foi desenhado: só nesse momento dá para saber o total de
// páginas ("Página X de Y" - o jsPDF não sabe quantas páginas vai ter durante
// a primeira passada). Funciona igual não importa quem tenha criado a
// página - addPage() manual (ensureSpace, lib/pdf/layout.ts) ou addPage()
// automático do jspdf-autotable no meio de uma tabela longa.
import type { jsPDF } from "jspdf";

import { getContentWidth, truncateToWidth } from "./layout";
import {
  BRAND_NAME,
  COLOR_INK,
  COLOR_LIME_DEEP,
  COLOR_INK_SOFT,
  COLOR_MUTED,
  COLOR_RULE,
  FONT_SIZE_COVER_SUBTITLE,
  FONT_SIZE_COVER_TITLE,
  FONT_SIZE_DOC_TYPE_LABEL,
  FONT_SIZE_CAPTION,
  FONT_SIZE_FOOTER,
  FONT_SIZE_RUNNING_HEADER,
  HEADER_RULE_Y,
  HEADER_TOP_Y,
  FOOTER_RULE_Y_FROM_BOTTOM,
  FOOTER_TEXT_Y_FROM_BOTTOM,
  PAGE_MARGIN_X,
  SECTION_GAP_BEFORE,
} from "./theme";

export interface DocumentIdentity {
  docType: string; // "Dossiê técnico" | "Orçamento de cotação"
  documentTitle: string; // nome do produto | "Orçamento nº <id>"
}

const HEADER_FOOTER_GAP = 6; // respiro entre o rótulo fixo (marca / paginação) e o rótulo variável (documento/produto)

export function stampRunningHeaderAndFooter(doc: jsPDF, identity: DocumentIdentity): void {
  const totalPages = doc.getNumberOfPages();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = getContentWidth(doc);
  const label = `${identity.docType} - ${identity.documentTitle}`;

  for (let page = 1; page <= totalPages; page += 1) {
    doc.setPage(page);

    // Cabeçalho corrido: marca à esquerda, documento/produto à direita.
    doc.setFont("helvetica", "bold");
    doc.setFontSize(FONT_SIZE_RUNNING_HEADER);
    doc.setTextColor(...COLOR_INK);
    doc.text(BRAND_NAME.toUpperCase(), PAGE_MARGIN_X, HEADER_TOP_Y);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLOR_MUTED);
    const brandWidth = doc.getTextWidth(BRAND_NAME.toUpperCase());
    const headerLabelMaxWidth = contentWidth - brandWidth - HEADER_FOOTER_GAP;
    doc.text(truncateToWidth(doc, label, headerLabelMaxWidth), PAGE_MARGIN_X + contentWidth, HEADER_TOP_Y, {
      align: "right",
    });

    doc.setDrawColor(...COLOR_RULE);
    doc.setLineWidth(0.3);
    doc.line(PAGE_MARGIN_X, HEADER_RULE_Y, PAGE_MARGIN_X + contentWidth, HEADER_RULE_Y);

    // Rodapé corrido: documento/produto à esquerda, paginação à direita.
    const footerRuleY = pageHeight - FOOTER_RULE_Y_FROM_BOTTOM;
    const footerTextY = pageHeight - FOOTER_TEXT_Y_FROM_BOTTOM;
    doc.line(PAGE_MARGIN_X, footerRuleY, PAGE_MARGIN_X + contentWidth, footerRuleY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(FONT_SIZE_FOOTER);
    doc.setTextColor(...COLOR_MUTED);
    const paginationLabel = `Página ${page} de ${totalPages}`;
    const paginationWidth = doc.getTextWidth(paginationLabel);
    const footerLabelMaxWidth = contentWidth - paginationWidth - HEADER_FOOTER_GAP;
    doc.text(truncateToWidth(doc, label, footerLabelMaxWidth), PAGE_MARGIN_X, footerTextY);
    doc.text(paginationLabel, PAGE_MARGIN_X + contentWidth, footerTextY, { align: "right" });
  }

  doc.setPage(totalPages);
  doc.setTextColor(...COLOR_INK);
}

export interface CoverBlockOptions {
  // Opcional: quando ausente, o bloco vira um título "leve" - sem rótulo de
  // tipo de documento nem linha de emissão, só título + subtítulo + filete de
  // fechamento. Caso de uso real: a ficha técnica de cada item dentro do
  // orçamento (lib/cart/quote-pdf.ts) - a capa/emissão do documento inteiro já
  // apareceu uma vez só, na primeira página; repetir "Emitido em" a cada
  // produto cotado seria ruído, não informação nova.
  docTypeLabel?: string;
  title: string;
  subtitle?: string | null;
  // Idem docTypeLabel: omitido, a linha "Emitido em ..." simplesmente não
  // aparece.
  issuedAtLabel?: string;
}

// Bloco de abertura de página: identidade do documento (ou de uma seção dele)
// em destaque - rótulo do tipo de documento opcional, título grande,
// subtítulo opcional, data de emissão opcional - fechado por um filete grosso
// na cor de acento da marca. Na primeira página de cada documento funciona
// como "capa" sem gastar uma página inteira em branco (o cabeçalho/rodapé
// corridos, acima, já cobrem a identidade em toda página); dentro do
// orçamento também abre cada ficha técnica de item cotado, só com
// título+subtítulo (docTypeLabel e issuedAtLabel de fora, ver interface acima).
export function drawCoverBlock(doc: jsPDF, startY: number, options: CoverBlockOptions): number {
  let cursorY = startY;
  const contentWidth = getContentWidth(doc);

  if (options.docTypeLabel) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(FONT_SIZE_DOC_TYPE_LABEL);
    doc.setTextColor(...COLOR_LIME_DEEP);
    doc.text(options.docTypeLabel.toUpperCase(), PAGE_MARGIN_X, cursorY);
    cursorY += 8.5;
  }

  // setFont explícito (nunca depende do que a linha do docTypeLabel deixou
  // configurado): docTypeLabel é opcional agora, então o título precisa
  // garantir sozinho que sai em negrito nos dois casos.
  doc.setFont("helvetica", "bold");
  doc.setFontSize(FONT_SIZE_COVER_TITLE);
  doc.setTextColor(...COLOR_INK);
  const titleLines = doc.splitTextToSize(options.title, contentWidth) as string[];
  for (const line of titleLines) {
    doc.text(line, PAGE_MARGIN_X, cursorY);
    cursorY += 8;
  }

  if (options.subtitle) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(FONT_SIZE_COVER_SUBTITLE);
    doc.setTextColor(...COLOR_INK_SOFT);
    doc.text(options.subtitle, PAGE_MARGIN_X, cursorY);
    cursorY += 6.5;
  }

  if (options.issuedAtLabel) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(FONT_SIZE_CAPTION);
    doc.setTextColor(...COLOR_MUTED);
    doc.text(`Emitido em ${options.issuedAtLabel}`, PAGE_MARGIN_X, cursorY);
    cursorY += 5.5;
  }

  doc.setDrawColor(...COLOR_LIME_DEEP);
  doc.setLineWidth(0.9);
  doc.line(PAGE_MARGIN_X, cursorY, PAGE_MARGIN_X + contentWidth, cursorY);
  cursorY += SECTION_GAP_BEFORE;

  doc.setTextColor(...COLOR_INK);
  doc.setLineWidth(0.3);
  return cursorY;
}
