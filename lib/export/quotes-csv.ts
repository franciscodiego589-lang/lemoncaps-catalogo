import { QUOTE_STATUS_LABELS } from "@/components/admin/enum-labels";
import type { AdminQuoteExportRowDTO } from "@/lib/data/admin";
import { centsToBRL } from "@/lib/money";

// BOM UTF-8 + separador ";" - sem isso o Excel em português abre o CSV com
// acento quebrado e tudo numa coluna só (lê "," como decimal, não como
// separador de campo).
const CSV_SEPARATOR = ";";
// Caractere invisível (BOM) montado por código de ponto, nunca colado como
// literal no fonte - um caractere sem largura no meio do arquivo-fonte é
// fácil de corromper sem querer num editor/copiar-colar futuro.
const CSV_BOM = String.fromCharCode(0xfeff);

// Uma linha por ITEM do orçamento, não uma linha por orçamento: pedido
// explícito para o CSV servir de registro comercial completo (enriquecimento
// de 2026-09-13). Uma linha por orçamento exigiria amontoar os itens numa
// única célula (ex.: "2x Fórmula A, 1x Fórmula B"), ilegível para o Excel
// somar ou filtrar - justamente a razão de existir um CSV em vez de um PDF.
// Por isso os campos do próprio orçamento (número, data/hora, cliente,
// WhatsApp, status, totais) se repetem em cada linha de item dele - ver
// AdminQuoteExportRowDTO em lib/data/admin-quotes.ts.
const CSV_HEADER = [
  "Número do orçamento",
  "Data",
  "Hora",
  "Status",
  "Cliente",
  "WhatsApp",
  "Fórmula",
  "Apresentação",
  "Quantidade de potes (item)",
  "Preço por pote",
  "Subtotal do item",
  "Total de potes (orçamento)",
  "Total geral (orçamento)",
  "Lucro estimado (orçamento)",
];

// Caracteres com que o Excel e o LibreOffice começam uma FÓRMULA. Um nome de
// cliente gravado como `=cmd|'/c calc'!A1` ou `=HYPERLINK(...)` vira código
// executado na máquina de quem abre a planilha — e o nome vem do formulário
// público do carrinho, onde qualquer visitante digita o que quiser
// (isValidCustomerName só exige que não seja vazio). Escapar aspas e ";",
// como já era feito, resolve o FORMATO do CSV, não isto.
const CSV_FORMULA_PREFIXES = ["=", "+", "-", "@", "\t", "\r"];

function csvField(value: string): string {
  // O apóstrofo à frente faz a planilha tratar a célula como texto. Ele não
  // aparece na tela do Excel, e o valor continua legível para quem lê o CSV
  // cru. Mantido dentro das aspas quando o campo também precisa ser citado.
  const safe = CSV_FORMULA_PREFIXES.some((prefix) => value.startsWith(prefix)) ? `'${value}` : value;
  if (/[;"\n\r]/.test(safe)) return `"${safe.replace(/"/g, '""')}"`;
  return safe;
}

// Campo ausente vira string vazia ANTES do csvField (nunca um texto como
// "não informado" no lugar) - regra do projeto: célula vazia no banco é
// célula vazia no CSV. Cobre tanto o dado null de verdade (ex.: fórmula sem
// pote_contents_description cadastrado) quanto a linha de segurança de um
// orçamento sem item vivo (ver getAdminQuotesForExport).
function orBlank(value: string | null): string {
  return value ?? "";
}

function quoteExportRowToCsvRow(row: AdminQuoteExportRowDTO): string {
  const createdAt = new Date(row.createdAt);
  return [
    String(row.quoteNumber),
    // Data e hora em colunas separadas (em vez do datetime único de antes) -
    // "Data" sozinha dá para ordenar/filtrar por dia numa planilha; grudado
    // num datetime só isso exigiria a fórmula do usuário separar de novo.
    createdAt.toLocaleDateString("pt-BR"),
    createdAt.toLocaleTimeString("pt-BR"),
    QUOTE_STATUS_LABELS[row.status],
    row.customerName,
    row.customerWhatsapp,
    orBlank(row.itemFormulaName),
    orBlank(row.itemPresentation),
    row.itemQuantityPotes !== null ? String(row.itemQuantityPotes) : "",
    row.itemUnitPriceCents !== null ? centsToBRL(row.itemUnitPriceCents) : "",
    row.itemLineTotalCents !== null ? centsToBRL(row.itemLineTotalCents) : "",
    String(row.quoteTotalPotes),
    centsToBRL(row.quoteTotalCents),
    row.quoteTotalProfitCents !== null ? centsToBRL(row.quoteTotalProfitCents) : "desconhecido",
  ]
    .map(csvField)
    .join(CSV_SEPARATOR);
}

// \r\n (não só \n) porque é o que o Excel espera de verdade num CSV, mesmo
// fora do Windows.
export function buildQuotesCsv(rows: AdminQuoteExportRowDTO[]): string {
  const lines = [CSV_HEADER.join(CSV_SEPARATOR), ...rows.map(quoteExportRowToCsvRow)];
  return CSV_BOM + lines.join("\r\n") + "\r\n";
}
