import { QUOTE_STATUS_LABELS } from "@/components/admin/enum-labels";
import type { AdminQuoteListItemDTO } from "@/lib/data/admin";
import { centsToBRL } from "@/lib/money";

// BOM UTF-8 + separador ";" - sem isso o Excel em português abre o CSV com
// acento quebrado e tudo numa coluna só (lê "," como decimal, não como
// separador de campo).
const CSV_SEPARATOR = ";";
// Caractere invisível (BOM) montado por código de ponto, nunca colado como
// literal no fonte - um caractere sem largura no meio do arquivo-fonte é
// fácil de corromper sem querer num editor/copiar-colar futuro.
const CSV_BOM = String.fromCharCode(0xfeff);
const CSV_HEADER = ["Número", "Cliente", "WhatsApp", "Status", "Itens", "Total", "Lucro estimado", "Data"];

function csvField(value: string): string {
  if (/[;"\n\r]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function quoteToCsvRow(quote: AdminQuoteListItemDTO): string {
  return [
    String(quote.quoteNumber),
    quote.customerName,
    quote.customerWhatsapp,
    QUOTE_STATUS_LABELS[quote.status],
    String(quote.itemCount),
    centsToBRL(quote.totalCents),
    quote.totalProfitCents !== null ? centsToBRL(quote.totalProfitCents) : "desconhecido",
    new Date(quote.createdAt).toLocaleString("pt-BR"),
  ]
    .map(csvField)
    .join(CSV_SEPARATOR);
}

// \r\n (não só \n) porque é o que o Excel espera de verdade num CSV, mesmo
// fora do Windows.
export function buildQuotesCsv(quotes: AdminQuoteListItemDTO[]): string {
  const lines = [CSV_HEADER.join(CSV_SEPARATOR), ...quotes.map(quoteToCsvRow)];
  return CSV_BOM + lines.join("\r\n") + "\r\n";
}
