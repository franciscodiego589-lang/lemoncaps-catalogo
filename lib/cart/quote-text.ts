// Texto do pedido pronto para colar no WhatsApp (ação "Copiar pedido") e
// mensagem curta para o link "Falar no WhatsApp". Os dois só usam dado que já
// existe no retrato do orçamento (QuoteSuccessData) — preço e nome de fórmula
// vêm do carrinho (que por sua vez veio do banco), nada calculado além de
// soma simples de campos que já chegaram prontos.
import { centsToBRL } from "@/lib/money";
import type { QuoteSuccessData } from "./types";

export function buildQuoteOrderText(data: QuoteSuccessData): string {
  const itemLines = data.items.map((item) => {
    const subtotalCents = item.unitPriceCents * item.quantityPotes;
    return `- ${item.name}: ${item.quantityPotes} potes x ${centsToBRL(item.unitPriceCents)} = ${centsToBRL(subtotalCents)}`;
  });

  return [
    "Pedido - Lemon Caps",
    `Cliente: ${data.customerName}`,
    `WhatsApp: ${data.customerWhatsapp}`,
    `Identificação do pedido: ${data.quoteId}`,
    "",
    "Itens:",
    ...itemLines,
    "",
    `Total de potes: ${data.totalPotes}`,
    `Total: ${centsToBRL(data.totalCents)}`,
  ].join("\n");
}

// Mensagem enviada ao abrir o WhatsApp: um resumo curto (não o pedido inteiro
// item a item) para não estourar limite de tamanho de URL de links wa.me em
// carrinhos com muitos itens. O detalhamento completo já está disponível via
// "Copiar pedido" e "Baixar PDF", que o cliente pode colar/anexar na conversa.
export function buildWhatsappMessage(data: Pick<QuoteSuccessData, "quoteId" | "totalPotes" | "totalCents">): string {
  const potesLabel = data.totalPotes === 1 ? "pote" : "potes";
  return `Olá! Gerei o orçamento ${data.quoteId} no catálogo Lemon Caps (${data.totalPotes} ${potesLabel}, total ${centsToBRL(data.totalCents)}). Podemos conversar sobre ele?`;
}
