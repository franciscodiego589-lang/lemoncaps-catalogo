// Primitivas de desenho compartilhadas pelos PDFs gerados no navegador
// (lib/catalog/dossie-pdf.ts e lib/cart/quote-pdf.ts). API imperativa de
// cursor, própria do modelo de desenho do jsPDF: cada helper recebe a posição
// Y atual e devolve a próxima - não existe "documento imutável" aqui, é como
// o jsPDF funciona (escreve e avança). O que nunca é mutado é o dado de
// entrada (fórmula, orçamento): estas funções só recebem strings/números já
// prontos para exibição e devolvem números (a próxima posição Y).
import type { jsPDF } from "jspdf";
import type { UserOptions } from "jspdf-autotable";

import {
  COLOR_ACCENT_TINT,
  COLOR_INK,
  COLOR_LIME,
  COLOR_LIME_DEEP,
  COLOR_LIME_INK,
  COLOR_MUTED,
  COLOR_RULE,
  COLOR_ZEBRA,
  CONTENT_BOTTOM_MARGIN,
  CONTENT_START_Y,
  FONT_SIZE_BODY,
  FONT_SIZE_CAPTION,
  FONT_SIZE_HIGHLIGHT_VALUE,
  FONT_SIZE_SECTION,
  FONT_SIZE_TABLE,
  LINE_HEIGHT,
  PAGE_MARGIN_X,
  PARAGRAPH_GAP,
  SECTION_GAP_AFTER,
  SECTION_GAP_BEFORE,
  type RgbColor,
} from "./theme";

// jspdf-autotable anexa `lastAutoTable` na própria instância do documento em
// tempo de execução (documentado no README do pacote, seção "API": "you can
// use doc.lastAutoTable... doc.lastAutoTable.finalY"); não faz parte do tipo
// público de nenhum dos dois pacotes, então o acesso tipado exige esta
// extensão local (mesma solução já usada antes desta tarefa).
export interface JsPdfWithAutoTable extends jsPDF {
  lastAutoTable?: { finalY: number };
}

export function readFinalY(doc: jsPDF, fallback: number): number {
  return (doc as JsPdfWithAutoTable).lastAutoTable?.finalY ?? fallback;
}

export function getContentWidth(doc: jsPDF): number {
  return doc.internal.pageSize.getWidth() - PAGE_MARGIN_X * 2;
}

// Quebra de página "consciente": usada por quem desenha texto solto (nunca
// pelo jspdf-autotable, que já gerencia as próprias páginas via
// margin.top/bottom - ver tableTheme() abaixo). Ao virar a página, o cursor
// volta para CONTENT_START_Y, nunca para a margem superior crua - é ali,
// abaixo da faixa reservada, que stampRunningHeaderAndFooter (header-footer.ts)
// vai carimbar o cabeçalho corrido, numa segunda passada, no fim.
export function ensureSpace(doc: jsPDF, cursorY: number, neededHeight: number): number {
  const pageHeight = doc.internal.pageSize.getHeight();
  if (cursorY + neededHeight > pageHeight - CONTENT_BOTTOM_MARGIN) {
    doc.addPage();
    return CONTENT_START_Y;
  }
  return cursorY;
}

// Reserva espaço para o título da seção MAIS um começo de corpo (duas linhas)
// antes de abrir a seção - evita título "órfão" colado no rodapé da página,
// sem precisar saber de antemão o tamanho do conteúdo inteiro (pode ser
// parágrafo, tabela, lista ou moldura).
const SECTION_TITLE_HEIGHT = LINE_HEIGHT + SECTION_GAP_AFTER;
const SECTION_MIN_BODY_PREVIEW = LINE_HEIGHT * 2;

export function ensureSectionSpace(doc: jsPDF, cursorY: number): number {
  return ensureSpace(doc, cursorY, SECTION_GAP_BEFORE + SECTION_TITLE_HEIGHT + SECTION_MIN_BODY_PREVIEW);
}

// Encurta um rótulo de chrome (cabeçalho/rodapé corridos) para caber na
// largura disponível, com reticências ASCII (nunca o caractere "…", fora da
// WinAnsiEncoding padrão do jsPDF). Nunca usado no CONTEÚDO do documento -
// só no rótulo decorativo repetido em toda página, onde o nome completo já
// apareceu por extenso na capa/corpo.
export function truncateToWidth(doc: jsPDF, text: string, maxWidth: number): string {
  if (doc.getTextWidth(text) <= maxWidth) return text;
  const ellipsis = "...";
  let truncated = text;
  while (truncated.length > 0 && doc.getTextWidth(`${truncated}${ellipsis}`) > maxWidth) {
    truncated = truncated.slice(0, -1);
  }
  return `${truncated.trimEnd()}${ellipsis}`;
}

// Título de seção: marcador quadrado colorido (verde-limão como acento,
// nunca como fundo de bloco de texto) + texto em versalete + filete neutro
// dividindo da próxima seção. accentColor muda por seção (advertência em
// vermelho, conformidade em verde, marco regulatório/fabricante em cinza) -
// mesma separação visual que a página /catalogo/[slug] já usa.
export function addSectionTitle(
  doc: jsPDF,
  startY: number,
  title: string,
  accentColor: RgbColor = COLOR_LIME_DEEP,
): number {
  let cursorY = ensureSectionSpace(doc, startY);
  cursorY += SECTION_GAP_BEFORE;

  const markerSize = 2.6;
  doc.setFillColor(...accentColor);
  doc.rect(PAGE_MARGIN_X, cursorY - markerSize + 0.7, markerSize, markerSize, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(FONT_SIZE_SECTION);
  doc.setTextColor(...COLOR_INK);
  doc.text(title.toUpperCase(), PAGE_MARGIN_X + markerSize + 3, cursorY);

  const ruleY = cursorY + 2.4;
  doc.setDrawColor(...COLOR_RULE);
  doc.setLineWidth(0.3);
  doc.line(PAGE_MARGIN_X, ruleY, PAGE_MARGIN_X + getContentWidth(doc), ruleY);

  doc.setTextColor(...COLOR_INK);
  return ruleY + SECTION_GAP_AFTER + LINE_HEIGHT * 0.6;
}

export interface ParagraphOptions {
  prefix?: string;
  color?: RgbColor;
  fontSize?: number;
  bold?: boolean;
}

// Quebra por linha original ("\n" do banco) primeiro, depois por largura -
// não depende de o jsPDF tratar "\n" sozinho dentro de splitTextToSize;
// quebrar antes é seguro e exato de qualquer forma, sem arriscar linha
// grudada num documento que publica advertência de rótulo de suplemento.
export function addParagraph(doc: jsPDF, startY: number, text: string, options: ParagraphOptions = {}): number {
  const { prefix = "", color = COLOR_INK, fontSize = FONT_SIZE_BODY, bold = false } = options;
  let cursorY = startY;
  doc.setFont("helvetica", bold ? "bold" : "normal");
  doc.setFontSize(fontSize);
  doc.setTextColor(...color);

  const contentWidth = getContentWidth(doc) - (prefix ? doc.getTextWidth(prefix) : 0);
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
  doc.setTextColor(...COLOR_INK);
  return cursorY + PARAGRAPH_GAP;
}

export interface FactRow {
  label: string;
  value: string;
}

// Lista de fatos label/valor (equivalente em PDF do <dl> da página web:
// rótulo pequeno em versalete e cor discreta, valor no corpo normal). Largura
// da coluna de rótulo é medida a partir dos rótulos reais recebidos (nunca um
// número mágico fixo): cabe qualquer rótulo em português sem sobra exagerada.
export function addFactRows(doc: jsPDF, startY: number, facts: readonly FactRow[]): number {
  if (facts.length === 0) return startY;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(FONT_SIZE_CAPTION);
  const labelGutter = 4;
  const maxLabelWidth = Math.max(...facts.map((fact) => doc.getTextWidth(fact.label.toUpperCase())));
  const labelColumnWidth = Math.min(maxLabelWidth + labelGutter, 62);
  const valueWidth = getContentWidth(doc) - labelColumnWidth;

  let cursorY = startY;
  for (const fact of facts) {
    cursorY = ensureSpace(doc, cursorY, LINE_HEIGHT);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(FONT_SIZE_CAPTION);
    doc.setTextColor(...COLOR_MUTED);
    doc.text(fact.label.toUpperCase(), PAGE_MARGIN_X, cursorY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(FONT_SIZE_BODY);
    doc.setTextColor(...COLOR_INK);
    const wrapped = doc.splitTextToSize(fact.value, valueWidth) as string[];
    doc.text(wrapped[0] ?? "", PAGE_MARGIN_X + labelColumnWidth, cursorY);
    cursorY += LINE_HEIGHT;

    for (const extraLine of wrapped.slice(1)) {
      cursorY = ensureSpace(doc, cursorY, LINE_HEIGHT);
      doc.text(extraLine, PAGE_MARGIN_X + labelColumnWidth, cursorY);
      cursorY += LINE_HEIGHT;
    }
  }
  doc.setTextColor(...COLOR_INK);
  return cursorY + SECTION_GAP_AFTER;
}

export interface CalloutStyle {
  borderColor: RgbColor;
  fillColor: RgbColor;
  textColor?: RgbColor;
}

const CALLOUT_PADDING = 5;

// Moldura com fundo suave (nunca lima puro como fundo de bloco de texto -
// regra do dono) para informação de segurança (advertências) e para a
// afirmação de conformidade verificada. Mede o texto quebrado ANTES de
// desenhar (para saber a altura da moldura) e reserva a moldura inteira numa
// página só, via ensureSpace - evita cortar a caixa no meio.
export function addCallout(doc: jsPDF, startY: number, paragraphs: readonly string[], style: CalloutStyle): number {
  const textColor = style.textColor ?? COLOR_INK;
  const contentWidth = getContentWidth(doc) - CALLOUT_PADDING * 2;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(FONT_SIZE_BODY);
  const wrappedParagraphs = paragraphs.map((paragraph) =>
    paragraph
      .split("\n")
      .flatMap((rawLine) => (rawLine.length === 0 ? [""] : (doc.splitTextToSize(rawLine, contentWidth) as string[]))),
  );
  const totalLines = wrappedParagraphs.reduce((sum, lines) => sum + lines.length, 0);
  const paragraphGaps = Math.max(0, wrappedParagraphs.length - 1) * (PARAGRAPH_GAP / 2);
  const boxHeight = CALLOUT_PADDING * 2 + totalLines * LINE_HEIGHT + paragraphGaps;

  const boxY = ensureSpace(doc, startY, boxHeight);
  const boxWidth = getContentWidth(doc);

  doc.setDrawColor(...style.borderColor);
  doc.setFillColor(...style.fillColor);
  doc.setLineWidth(0.4);
  doc.roundedRect(PAGE_MARGIN_X, boxY, boxWidth, boxHeight, 2, 2, "FD");

  let textY = boxY + CALLOUT_PADDING + LINE_HEIGHT * 0.7;
  doc.setTextColor(...textColor);
  for (const lines of wrappedParagraphs) {
    for (const line of lines) {
      doc.text(line, PAGE_MARGIN_X + CALLOUT_PADDING, textY);
      textY += LINE_HEIGHT;
    }
    textY += PARAGRAPH_GAP / 2;
  }
  doc.setTextColor(...COLOR_INK);
  return boxY + boxHeight + SECTION_GAP_AFTER + PARAGRAPH_GAP / 2;
}

export interface HighlightBoxOptions {
  label: string;
  value: string;
  meta?: string;
  fillColor?: RgbColor;
  borderColor?: RgbColor;
  valueColor?: RgbColor;
}

const HIGHLIGHT_BOX_HEIGHT = 21;
const HIGHLIGHT_BOX_PADDING = 6;

// Caixa de destaque para um número-síntese (hoje só o total geral do
// orçamento - lib/cart/quote-pdf.ts). Rótulo pequeno em cima, valor grande
// embaixo, metadado opcional alinhado à direita (ex.: total de potes).
export function addHighlightBox(doc: jsPDF, startY: number, options: HighlightBoxOptions): number {
  const fillColor = options.fillColor ?? COLOR_ACCENT_TINT;
  const borderColor = options.borderColor ?? COLOR_LIME_DEEP;
  const valueColor = options.valueColor ?? COLOR_INK;
  const boxWidth = getContentWidth(doc);

  const boxY = ensureSpace(doc, startY, HIGHLIGHT_BOX_HEIGHT);

  doc.setDrawColor(...borderColor);
  doc.setFillColor(...fillColor);
  doc.setLineWidth(0.5);
  doc.roundedRect(PAGE_MARGIN_X, boxY, boxWidth, HIGHLIGHT_BOX_HEIGHT, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(FONT_SIZE_CAPTION);
  doc.setTextColor(...COLOR_MUTED);
  doc.text(options.label.toUpperCase(), PAGE_MARGIN_X + HIGHLIGHT_BOX_PADDING, boxY + 7.5);

  doc.setFontSize(FONT_SIZE_HIGHLIGHT_VALUE);
  doc.setTextColor(...valueColor);
  doc.text(options.value, PAGE_MARGIN_X + HIGHLIGHT_BOX_PADDING, boxY + 16.5);

  if (options.meta) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(FONT_SIZE_CAPTION);
    doc.setTextColor(...COLOR_MUTED);
    doc.text(options.meta, PAGE_MARGIN_X + boxWidth - HIGHLIGHT_BOX_PADDING, boxY + 16.5, { align: "right" });
  }

  doc.setTextColor(...COLOR_INK);
  return boxY + HIGHLIGHT_BOX_HEIGHT + SECTION_GAP_AFTER + PARAGRAPH_GAP / 2;
}

// Defaults de tabela compartilhados pelos dois documentos: zebra discreta
// (nunca lima - lima é só o cabeçalho), cabeçalho lima repetido em toda
// página da tabela (showHead), linha nunca cortada no meio por uma quebra de
// página (rowPageBreak: "avoid" - evita "linha órfã"), margem igual à faixa
// reservada para o cabeçalho/rodapé corridos, para a tabela nunca desenhar
// por baixo deles quando ela mesma decide quebrar de página.
export function tableTheme(): Partial<UserOptions> {
  return {
    theme: "striped",
    showHead: "everyPage",
    rowPageBreak: "avoid",
    margin: { left: PAGE_MARGIN_X, right: PAGE_MARGIN_X, top: CONTENT_START_Y, bottom: CONTENT_BOTTOM_MARGIN },
    styles: {
      font: "helvetica",
      fontSize: FONT_SIZE_TABLE,
      cellPadding: 3,
      textColor: COLOR_INK,
      lineColor: COLOR_RULE,
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: COLOR_LIME,
      textColor: COLOR_LIME_INK,
      fontStyle: "bold",
      lineWidth: 0,
    },
    alternateRowStyles: { fillColor: COLOR_ZEBRA },
  };
}
