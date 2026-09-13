// Único ponto do front que fala com fn_capture_lead/fn_generate_quote — as
// duas únicas portas de escrita públicas do catálogo (nenhuma tabela recebe
// INSERT direto de anon). Nome e WhatsApp já devem chegar validados e
// normalizados por quem chama (ver lib/cart/validation.ts); esta função só
// orquestra as duas chamadas, na ordem exigida pela regra de negócio (lead
// antes do orçamento), e devolve o id do orçamento ou propaga o erro.
import { createClient } from "@/lib/supabase/client";
import type { Json } from "@/lib/supabase/database.types";
import type { CartItem } from "@/lib/store/cart";

export interface SubmitQuoteInput {
  name: string;
  whatsapp: string;
  items: readonly CartItem[];
}

export interface SubmitQuoteResult {
  quoteId: string;
}

export async function submitQuote({ name, whatsapp, items }: SubmitQuoteInput): Promise<SubmitQuoteResult> {
  const supabase = createClient();

  // Retrato do carrinho no momento do lead — só informativo (a tabela leads
  // não valida o formato), mas mantém preço e nome tal como foram cotados.
  const cartSnapshot: Json = items.map((item) => ({
    formula_id: item.formulaId,
    name: item.name,
    quantity_potes: item.quantityPotes,
    unit_price_cents: item.unitPriceCents,
  }));

  const { data: leadId, error: leadError } = await supabase.rpc("fn_capture_lead", {
    p_name: name,
    p_whatsapp: whatsapp,
    p_cart_snapshot: cartSnapshot,
  });
  if (leadError) throw leadError;

  const quoteItems: Json = items.map((item) => ({
    formula_id: item.formulaId,
    quantity_potes: item.quantityPotes,
  }));

  const { data: quoteId, error: quoteError } = await supabase.rpc("fn_generate_quote", {
    p_customer_name: name,
    p_customer_whatsapp: whatsapp,
    p_items: quoteItems,
    p_lead_id: leadId ?? undefined,
  });
  if (quoteError) throw quoteError;
  if (!quoteId) throw new Error("O orçamento não retornou identificação.");

  return { quoteId };
}

// As duas RPCs levantam RAISE EXCEPTION com mensagem já em português, escrita
// para quem está na tela ("whatsapp inválido", "limite de 5 tentativas em 10
// minutos atingido para este WhatsApp. Aguarde e tente novamente." etc. — ver
// supabase/migrations/20260912225011_rate_limit_rpc.sql). Um RAISE EXCEPTION
// sem SQLSTATE explícito sempre chega ao cliente com code "P0001": é o sinal
// de que a mensagem é regra de negócio, segura para mostrar como está.
// Qualquer outro código (rede, PostgREST, etc.) é falha técnica e nunca deve
// chegar crua à tela.
export function getFriendlyQuoteErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "code" in error && "message" in error) {
    const code = (error as { code?: unknown }).code;
    const message = (error as { message?: unknown }).message;
    if (code === "P0001" && typeof message === "string" && message.trim() !== "") {
      const trimmed = message.trim();
      return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    }
  }
  return "Não foi possível concluir agora. Aguarde um instante e tente novamente.";
}
