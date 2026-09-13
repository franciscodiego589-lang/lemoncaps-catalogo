// Tokens visuais compartilhados pelos PDFs gerados no navegador (dossiê
// técnico em lib/catalog/dossie-pdf.ts e orçamento em lib/cart/quote-pdf.ts) -
// mesma identidade visual nos dois documentos. Cores tiradas dos tokens reais
// de app/globals.css (nunca inventadas aqui): --lime / --lime-ink / --lime-deep,
// --ink / --ink-soft / --text-muted, e a cor de aviso usada em
// .lc-dossie-warning e nos campos de erro do formulário (#b31f2e). Os tons de
// "tinta" (tint) das molduras são a mesma cor de aviso/conformidade só que
// clareada sobre fundo branco (o CSS usa rgba translúcido sobre um cartão
// branco; aqui não há transparência real no jsPDF sem GState, então o valor
// já vem pré-misturado com branco para o mesmo efeito visual).
//
// Tupla mutável (não `readonly`) de propósito: jspdf-autotable tipa
// `Styles.fillColor`/`textColor` como `[number, number, number] | ...`, sem
// `readonly` - uma tupla `readonly` não é atribuível a essa posição em modo
// strict. Nenhum destes valores é mutado em lugar nenhum deste módulo.
export type RgbColor = [number, number, number];

export const BRAND_NAME = "Lemon Caps";

export const COLOR_LIME: RgbColor = [166, 225, 0]; // --lime
export const COLOR_LIME_INK: RgbColor = [21, 36, 0]; // --lime-ink
export const COLOR_LIME_DEEP: RgbColor = [111, 163, 0]; // --lime-deep
export const COLOR_INK: RgbColor = [20, 22, 27]; // --ink
export const COLOR_INK_SOFT: RgbColor = [86, 91, 102]; // --ink-soft
export const COLOR_MUTED: RgbColor = [107, 114, 128]; // --text-muted
export const COLOR_RULE: RgbColor = [223, 226, 231]; // filete neutro discreto (divisor de seção)
export const COLOR_ZEBRA: RgbColor = [246, 247, 248]; // zebra discreta das tabelas

// Advertências (.lc-dossie-warning / cor de erro de formulário, #b31f2e).
export const COLOR_WARNING: RgbColor = [179, 31, 46];
export const COLOR_WARNING_TINT: RgbColor = [253, 240, 241]; // rgba(179,31,46,.07) sobre branco
export const COLOR_WARNING_BORDER: RgbColor = [231, 189, 194]; // rgba(179,31,46,.32) sobre branco

// Acento positivo/verificado (conformidade e destaque de total) - mesmo verde
// (.lc-dossie-compliance) clareado sobre branco.
export const COLOR_ACCENT_TINT: RgbColor = [237, 246, 219]; // rgba(111,163,0,.08) sobre branco
export const COLOR_ACCENT_BORDER: RgbColor = [199, 224, 158]; // rgba(111,163,0,.3) sobre branco

// ---------------------------------------------------------------------------
// Métrica de página (mm, papel A4 padrão do jsPDF)
// ---------------------------------------------------------------------------
// Margens generosas e consistentes (regra do dono: "nada de conteúdo colado
// na borda"). PAGE_MARGIN_X vale para os dois lados; o topo e o rodapé têm
// constantes próprias porque reservam espaço para o cabeçalho/rodapé corridos
// carimbados por stampRunningHeaderAndFooter (lib/pdf/header-footer.ts).
export const PAGE_MARGIN_X = 18;

export const HEADER_TOP_Y = 13; // linha de base do texto do cabeçalho corrido
export const HEADER_RULE_Y = 17; // filete horizontal abaixo do cabeçalho corrido
export const CONTENT_START_Y = 30; // onde o conteúdo de cada página começa (inclusive após quebra)

export const FOOTER_RULE_Y_FROM_BOTTOM = 17; // filete horizontal acima do rodapé corrido
export const FOOTER_TEXT_Y_FROM_BOTTOM = 11; // linha de base do texto do rodapé corrido
export const CONTENT_BOTTOM_MARGIN = 24; // limite inferior seguro do conteúdo (reserva o rodapé)

// ---------------------------------------------------------------------------
// Tipografia (pt) - hierarquia real: capa > seção > corpo > legenda
// ---------------------------------------------------------------------------
export const FONT_SIZE_RUNNING_HEADER = 8.5;
export const FONT_SIZE_FOOTER = 8;
export const FONT_SIZE_DOC_TYPE_LABEL = 10.5;
export const FONT_SIZE_COVER_TITLE = 19;
export const FONT_SIZE_COVER_SUBTITLE = 11;
export const FONT_SIZE_SECTION = 12;
export const FONT_SIZE_BODY = 10;
export const FONT_SIZE_CAPTION = 8.5;
export const FONT_SIZE_TABLE = 9.5;
export const FONT_SIZE_HIGHLIGHT_VALUE = 17;

// ---------------------------------------------------------------------------
// Espaçamento vertical (mm)
// ---------------------------------------------------------------------------
export const LINE_HEIGHT = 5;
export const PARAGRAPH_GAP = 4;
export const SECTION_GAP_BEFORE = 7;
export const SECTION_GAP_AFTER = 2;

// Data por extenso em português, como pedido (Intl.DateTimeFormat("pt-BR")).
// Sem timeZone fixo de propósito: é o instante real de geração no navegador
// de quem baixou o PDF, não um timestamp gravado no banco - esse outro caso
// (compliance_verified_at) usa formatComplianceDate, com fuso fixo de Cuiabá,
// em lib/catalog/regulatory-info.ts (arquivo que este módulo não altera).
export const LONG_DATE_FORMATTER = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "long",
});

// Data + hora por extenso, usada só onde o horário exato importa (validade do
// orçamento: "2 dias corridos a partir da emissão" é um prazo, não só uma
// data-calendário - ver lib/cart/quote-pdf.ts).
export const LONG_DATETIME_FORMATTER = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "long",
  timeStyle: "short",
});
