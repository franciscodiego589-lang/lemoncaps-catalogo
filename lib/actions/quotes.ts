"use server";

import { z } from "zod";

import { requireQuoteManagerAction, StaffAuthError } from "@/lib/data/admin";
import { createClient } from "@/lib/supabase/server";
import type { TablesUpdate } from "@/lib/supabase/database.types";
import { actionError, actionOk, friendlyDbError, zodIssuesToFieldErrors, type ActionResult } from "@/lib/actions/types";

// public.quote_items - item 8 da tarefa: só quem tem can_manage_quotes edita
// quantidade e preço. Margem/lucro (profit_cents, profit_margin_pct) são
// colunas GERADAS pelo Postgres (supabase/migrations/20260909210000_schema.sql,
// tabela quote_items) - nunca calculadas nem enviadas por esta action; o
// SELECT seguinte, feito pela própria tela, é que traz o valor recalculado.
// requireQuoteManagerAction() é a MESMA trava de public.can_manage_quotes(),
// checada aqui de novo por dentro da action (defesa em profundidade: a página
// já barra quem não tem a permissão, mas a action nunca confia só nisso).

const quoteItemPatchSchema = z.object({
  quantityPotes: z.number().int("Quantidade deve ser um número inteiro de potes.").positive("Quantidade deve ser maior que zero.").optional(),
  unitPriceCents: z.number().int("Preço deve ser um valor inteiro em centavos.").min(0, "Preço não pode ser negativo.").optional(),
});

export async function updateQuoteItem(
  itemId: string,
  patch: z.infer<typeof quoteItemPatchSchema>,
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireQuoteManagerAction();
  } catch (error) {
    if (error instanceof StaffAuthError) return actionError(error.message);
    throw error;
  }

  const idParsed = z.string().uuid().safeParse(itemId);
  if (!idParsed.success) return actionError("Item de orçamento inválido.");
  const parsed = quoteItemPatchSchema.safeParse(patch);
  if (!parsed.success) return actionError("Corrija os campos destacados.", zodIssuesToFieldErrors(parsed.error));
  if (parsed.data.quantityPotes === undefined && parsed.data.unitPriceCents === undefined) {
    return actionError("Nenhuma alteração para salvar.");
  }

  const row: TablesUpdate<"quote_items"> = {};
  if (parsed.data.quantityPotes !== undefined) row.quantity_potes = parsed.data.quantityPotes;
  if (parsed.data.unitPriceCents !== undefined) row.unit_price_cents = parsed.data.unitPriceCents;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("quote_items")
    .update(row)
    .eq("id", idParsed.data)
    .is("deleted_at", null)
    .select("id")
    .maybeSingle();

  // O trigger private.tg_enforce_minimum_order (mínimo de potes por fórmula)
  // levanta 23514 com mensagem pronta em português - friendlyDbError já
  // repassa essa mensagem como está.
  if (error) return actionError(friendlyDbError(error));
  if (!data) return actionError("Item de orçamento não encontrado.");

  return actionOk({ id: data.id });
}
