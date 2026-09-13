import type { CartItem } from "@/lib/store/cart";

// Retrato do orçamento já gerado (RPC fn_generate_quote já respondeu). Usado
// pela tela de sucesso e pelos geradores de texto/PDF — todos os campos vêm
// de dado real (retorno da RPC ou do próprio carrinho no momento do envio),
// nunca inventados aqui.
export interface QuoteSuccessData {
  quoteId: string;
  customerName: string;
  customerWhatsapp: string;
  items: readonly CartItem[];
  totalPotes: number;
  totalCents: number;
}
