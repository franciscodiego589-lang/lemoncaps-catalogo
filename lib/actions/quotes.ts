"use server";

import { revalidatePath } from "next/cache";
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

// Vazio na tela (QuoteItemRow) chega aqui como 0 - pedido do dono
// (17/09/2026: "desbloqueie qualquer alteração no admin", mesmo padrão já
// usado em lib/actions/sheet-approvals.ts e lib/actions/formulas.ts): 0
// nunca é um "número que parece real", é o jeito mais honesto de dizer
// "ainda não preenchido". O trigger private.tg_enforce_minimum_order
// (mínimo de potes por fórmula) continua como backstop do banco - 0 (ou
// qualquer quantidade abaixo do mínimo da fórmula) ainda é recusado lá, com
// mensagem em português repassada por friendlyDbError; esta validação aqui
// só impede negativo e fração de pote.
const quoteItemPatchSchema = z.object({
  quantityPotes: z.number().int("Quantidade deve ser um número inteiro de potes.").min(0, "Quantidade não pode ser negativa.").optional(),
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

// public.quotes.status/internal_note (item 5 da tarefa) - mesma trava de
// can_manage_quotes de updateQuoteItem acima. Diferente daquela action, esta
// aqui precisa de revalidatePath: status/observação aparecem tanto na tela de
// detalhe quanto na coluna Status da listagem (/admin/orcamentos), e
// router.refresh() (o que QuoteItemRow.tsx usa) só atualiza a rota atual -
// nunca a lista, que é uma página diferente. revalidatePath(path) aceita só
// caminho literal aqui (nunca "/admin/orcamentos/[id]"), então dispensa o
// segundo argumento "type" - ele só é exigido para padrão de rota dinâmica
// (node_modules/next/dist/docs/.../revalidatePath.md, conferido para esta
// tarefa: diferente de revalidateTag, que no Next 16 passou a exigir um
// segundo argumento sempre - ver revalidateCatalogCache em lib/data/formulas.ts).
// "" (sem seleção) vira "aberto" - o estado inicial de todo orçamento antes
// de qualquer decisão, o mais neutro dos quatro valores do enum (mesmo
// pedido do dono de 17/09/2026: nenhum campo trava o salvar por estar
// incompleto). Na prática o <select> de QuoteStatusEditor.tsx sempre chega
// com um valor - STATUS_OPTIONS cobre o enum inteiro e não recebe
// `placeholder`, então não existe opção em branco na tela; isto é defesa
// para qualquer chamada futura que monte o patch de outro jeito.
const quoteStatusPatchSchema = z.object({
  status: z.preprocess(
    (v) => (v === "" ? "aberto" : v),
    z.enum(["aberto", "aprovado", "recusado", "expirado"], { message: "Selecione um status válido." }).optional(),
  ),
  internalNote: z.string().max(2000, "Observação muito longa (máximo 2000 caracteres).").optional(),
});

export async function updateQuoteStatus(
  quoteId: string,
  patch: z.infer<typeof quoteStatusPatchSchema>,
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireQuoteManagerAction();
  } catch (error) {
    if (error instanceof StaffAuthError) return actionError(error.message);
    throw error;
  }

  const idParsed = z.string().uuid().safeParse(quoteId);
  if (!idParsed.success) return actionError("Orçamento inválido.");
  const parsed = quoteStatusPatchSchema.safeParse(patch);
  if (!parsed.success) return actionError("Corrija os campos destacados.", zodIssuesToFieldErrors(parsed.error));
  if (parsed.data.status === undefined && parsed.data.internalNote === undefined) {
    return actionError("Nenhuma alteração para salvar.");
  }

  const row: TablesUpdate<"quotes"> = {};
  if (parsed.data.status !== undefined) row.status = parsed.data.status;
  if (parsed.data.internalNote !== undefined) {
    const trimmed = parsed.data.internalNote.trim();
    row.internal_note = trimmed === "" ? null : trimmed;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("quotes")
    .update(row)
    .eq("id", idParsed.data)
    .is("deleted_at", null)
    .select("id")
    .maybeSingle();

  if (error) return actionError(friendlyDbError(error));
  if (!data) return actionError("Orçamento não encontrado.");

  revalidatePath("/admin/orcamentos");
  revalidatePath(`/admin/orcamentos/${idParsed.data}`);

  return actionOk({ id: data.id });
}
