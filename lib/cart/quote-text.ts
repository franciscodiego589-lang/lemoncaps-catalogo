// Texto do pedido pronto para colar no WhatsApp (ação "Copiar pedido") e
// mensagem curta para o link "Falar no WhatsApp". Os dois só usam dado que já
// existe no retrato do orçamento (QuoteSuccessData) — preço e nome de fórmula
// vêm do carrinho (que por sua vez veio do banco), nada calculado além de
// soma simples de campos que já chegaram prontos.
import { centsToBRL } from "@/lib/money";
import type { FormulaDetailDTO } from "@/lib/data/formulas";
import { PRICE_ON_REQUEST_LABEL } from "@/lib/store/cart";
import type { QuoteSuccessData } from "./types";

// `formulas` é OPCIONAL: quem chama sem fichas carregadas (ou quando a busca
// delas falhou) continua recebendo um texto correto, só sem a apresentação
// de cada item — nunca "não informado" no lugar dela (mesma regra de exatidão
// do PDF). Indexado por slug, igual ao PDF do orçamento (lib/cart/quote-pdf.ts).
export function buildQuoteOrderText(data: QuoteSuccessData, formulas?: readonly FormulaDetailDTO[]): string {
  const formulaBySlug = new Map((formulas ?? []).map((formula) => [formula.slug, formula] as const));

  const itemLines = data.items.map((item) => {
    const formula = formulaBySlug.get(item.slug);
    const presentation = formula ? (formula.poteContentsDescription ?? formula.netWeight ?? null) : null;
    const presentationSuffix = presentation ? ` (${presentation})` : "";
    if (item.unitPriceCents === null) {
      return `- ${item.name}${presentationSuffix}: ${item.quantityPotes} potes, ${PRICE_ON_REQUEST_LABEL.toLowerCase()}`;
    }
    const subtotalCents = item.unitPriceCents * item.quantityPotes;
    return `- ${item.name}${presentationSuffix}: ${item.quantityPotes} potes x ${centsToBRL(item.unitPriceCents)} = ${centsToBRL(subtotalCents)}`;
  });
  const totalLine = data.items.every((item) => item.unitPriceCents === null)
    ? "Total: sob consulta"
    : data.items.some((item) => item.unitPriceCents === null)
      ? `Total: ${centsToBRL(data.totalCents)} + itens com preço sob consulta`
      : `Total: ${centsToBRL(data.totalCents)}`;

  return [
    "Orçamento - Lemon Caps",
    `Cliente: ${data.customerName}`,
    `WhatsApp: ${data.customerWhatsapp}`,
    `Orçamento nº ${data.quoteNumber}`,
    "",
    "Itens:",
    ...itemLines,
    "",
    `Total de potes: ${data.totalPotes}`,
    totalLine,
    "",
    // Item 4 da tarefa: nunca encher esta mensagem com a composição inteira
    // (é texto de WhatsApp, não o documento técnico) — só aponta onde ela
    // está para quem quiser o detalhe completo de cada fórmula.
    "Dossiê técnico completo de cada fórmula cotada: veja o PDF do orçamento.",
  ].join("\n");
}
