"use server";

import { z } from "zod";

import { requireStaffAction, StaffAuthError } from "@/lib/data/admin";
import { createClient } from "@/lib/supabase/server";
import type { TablesUpdate } from "@/lib/supabase/database.types";
import { actionError, actionOk, friendlyDbError, zodIssuesToFieldErrors, type ActionResult } from "@/lib/actions/types";
import { revalidateCatalogCache } from "@/lib/data/formulas";

// Editor de composição (item 4 da tarefa): cada linha é insumo (texto do
// rótulo, sempre obrigatório) + quantidade numérica + unidade, com ligação
// OPCIONAL ao insumo canônico de public.ingredients. Regra do dono
// (AGENTS.md): "composição guarda quantidade numérica e unidade em campos
// separados. Nunca texto solto" - por isso quantity é number aqui, nunca
// string livre.

const unitEnum = z.enum(["g", "mg", "mcg", "ml", "l", "ui", "kg"], { message: "Selecione uma unidade válida." });

const compositionLineSchema = z.object({
  ingredientName: z.string().trim().min(1, "Informe o nome do insumo.").max(300),
  quantity: z.number().positive("Quantidade deve ser maior que zero."),
  unit: unitEnum,
  ingredientId: z.string().uuid().nullable(),
});

async function assertStaff(): Promise<ActionResult<never> | null> {
  try {
    await requireStaffAction();
    return null;
  } catch (error) {
    if (error instanceof StaffAuthError) return actionError(error.message);
    throw error;
  }
}

export async function addCompositionLine(
  formulaId: string,
  input: z.infer<typeof compositionLineSchema>,
): Promise<ActionResult<{ id: string; sortOrder: number }>> {
  const authError = await assertStaff();
  if (authError) return authError;

  const formulaIdParsed = z.string().uuid().safeParse(formulaId);
  if (!formulaIdParsed.success) return actionError("Fórmula inválida.");
  const parsed = compositionLineSchema.safeParse(input);
  if (!parsed.success) return actionError("Corrija os campos destacados.", zodIssuesToFieldErrors(parsed.error));

  const supabase = await createClient();

  // Confirma que a fórmula existe (nunca aceita o formulaId do cliente sem
  // checar) e calcula o próximo sort_order a partir do estado real no banco,
  // nunca de um número que o cliente alegue ser o próximo.
  const { data: formula } = await supabase.from("formulas").select("id").eq("id", formulaIdParsed.data).is("deleted_at", null).maybeSingle();
  if (!formula) return actionError("Fórmula não encontrada.");

  const { count } = await supabase
    .from("formula_compositions")
    .select("id", { count: "exact", head: true })
    .eq("formula_id", formulaIdParsed.data)
    .is("deleted_at", null);
  const nextSortOrder = count ?? 0;

  const { data, error } = await supabase
    .from("formula_compositions")
    .insert({
      formula_id: formulaIdParsed.data,
      ingredient_name: parsed.data.ingredientName,
      quantity: parsed.data.quantity,
      unit: parsed.data.unit,
      ingredient_id: parsed.data.ingredientId,
      sort_order: nextSortOrder,
    })
    .select("id, sort_order")
    .single();

  if (error || !data) return actionError(friendlyDbError(error));

  revalidateCatalogCache();
  return actionOk({ id: data.id, sortOrder: data.sort_order });
}

export async function updateCompositionLine(
  lineId: string,
  patch: Partial<z.infer<typeof compositionLineSchema>>,
): Promise<ActionResult<{ id: string }>> {
  const authError = await assertStaff();
  if (authError) return authError;

  const lineIdParsed = z.string().uuid().safeParse(lineId);
  if (!lineIdParsed.success) return actionError("Linha de composição inválida.");
  const parsed = compositionLineSchema.partial().safeParse(patch);
  if (!parsed.success) return actionError("Corrija os campos destacados.", zodIssuesToFieldErrors(parsed.error));
  if (Object.keys(parsed.data).length === 0) return actionError("Nenhuma alteração para salvar.");

  const row: TablesUpdate<"formula_compositions"> = {};
  if (parsed.data.ingredientName !== undefined) row.ingredient_name = parsed.data.ingredientName;
  if (parsed.data.quantity !== undefined) row.quantity = parsed.data.quantity;
  if (parsed.data.unit !== undefined) row.unit = parsed.data.unit;
  if (parsed.data.ingredientId !== undefined) row.ingredient_id = parsed.data.ingredientId;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("formula_compositions")
    .update(row)
    .eq("id", lineIdParsed.data)
    .is("deleted_at", null)
    .select("id")
    .maybeSingle();

  if (error) return actionError(friendlyDbError(error));
  if (!data) return actionError("Linha de composição não encontrada.");

  revalidateCatalogCache();
  return actionOk({ id: data.id });
}

// Soft delete - AGENTS.md do projeto: "Exclusão é lógica (deleted_at), não
// física." A listagem em lib/data/admin.ts já filtra deleted_at is null.
export async function removeCompositionLine(lineId: string): Promise<ActionResult<{ id: string }>> {
  const authError = await assertStaff();
  if (authError) return authError;

  const lineIdParsed = z.string().uuid().safeParse(lineId);
  if (!lineIdParsed.success) return actionError("Linha de composição inválida.");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("formula_compositions")
    .update({ deleted_at: new Date().toISOString(), reason_deleted: "Removido pelo admin do catálogo." })
    .eq("id", lineIdParsed.data)
    .is("deleted_at", null)
    .select("id")
    .maybeSingle();

  if (error) return actionError(friendlyDbError(error));
  if (!data) return actionError("Linha de composição não encontrada.");

  revalidateCatalogCache();
  return actionOk({ id: data.id });
}

// Reordena as linhas de UMA fórmula. orderedLineIds é a lista completa, na
// ordem final desejada - o índice de cada id vira o novo sort_order. Os ids
// são reconferidos contra o banco (nunca fica assumido que pertencem à
// fórmula só porque o cliente diz que sim).
export async function reorderCompositionLines(formulaId: string, orderedLineIds: string[]): Promise<ActionResult<undefined>> {
  const authError = await assertStaff();
  if (authError) return authError;

  const formulaIdParsed = z.string().uuid().safeParse(formulaId);
  if (!formulaIdParsed.success) return actionError("Fórmula inválida.");
  const idsParsed = z.array(z.string().uuid()).min(1).safeParse(orderedLineIds);
  if (!idsParsed.success) return actionError("Lista de reordenação inválida.");

  const supabase = await createClient();
  const { data: existing, error: fetchError } = await supabase
    .from("formula_compositions")
    .select("id")
    .eq("formula_id", formulaIdParsed.data)
    .is("deleted_at", null);
  if (fetchError) return actionError(friendlyDbError(fetchError));

  const existingIds = new Set((existing ?? []).map((r) => r.id));
  const requestedIds = new Set(idsParsed.data);
  const sameSet = existingIds.size === requestedIds.size && [...existingIds].every((id) => requestedIds.has(id));
  if (!sameSet) return actionError("A lista de reordenação não confere com as linhas atuais desta fórmula.");

  for (const [index, lineId] of idsParsed.data.entries()) {
    const { error } = await supabase
      .from("formula_compositions")
      .update({ sort_order: index })
      .eq("id", lineId)
      .eq("formula_id", formulaIdParsed.data);
    if (error) return actionError(friendlyDbError(error));
  }

  revalidateCatalogCache();
  return actionOk(undefined);
}
