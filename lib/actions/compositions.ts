"use server";

import { z } from "zod";

import { requireStaffAction, StaffAuthError } from "@/lib/data/admin";
import { createClient } from "@/lib/supabase/server";
import type { TablesInsert, TablesUpdate } from "@/lib/supabase/database.types";
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
  // Vazio é aceito por pedido do dono (17/09/2026, mesmo afrouxamento
  // consciente de formulas.ts/sheet-approvals.ts): ingredient_name é NOT NULL
  // sem default (formula_compositions), então "" nunca é gravado - vira
  // "PENDENTE", mesmo quando a linha aparece no dossiê público (é dado
  // temporário e visível de propósito, para ficar óbvio que falta preencher).
  ingredientName: z
    .string()
    .trim()
    .max(300)
    .transform((v) => (v === "" ? "PENDENTE" : v)),
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
// Achado A4 (auditoria de 14/09/2026): a versão anterior fazia N updates em
// sequência, um por linha - se falhasse no meio, a ordem ficava pela metade
// (algumas linhas com sort_order novo, outras com o antigo), podendo gerar
// posição duplicada ou faltando, sem ninguém perceber. Trocado por UM upsert
// em lote: uma só chamada ao PostgREST vira um único
// "INSERT ... ON CONFLICT (id) DO UPDATE" no Postgres - uma única instrução
// SQL, portanto atômica por natureza (ou grava tudo, ou - rede caiu, RLS
// negou - não grava nada). Preferido a criar uma RPC nova: regra do projeto
// é não criar migration/RPC sem autorização do dono, e aqui não precisou -
// conferido no schema real (supabase/migrations/20260909210000_schema.sql,
// linha 352) que formula_compositions só tem um ÍNDICE não-único em
// (formula_id, sort_order) para leitura, nunca uma constraint UNIQUE, então
// o upsert não esbarra em violação de unicidade ao trocar duas posições
// entre si.
//
// ingredient_name/quantity/unit/ingredient_id do payload de upsert vêm do
// SELECT feito abaixo (o mesmo que já confere se o conjunto de ids bate),
// nunca do que o cliente mandou: o upsert do PostgREST monta o INSERT
// inteiro mesmo quando vai cair no conflito (colunas NOT NULL sem default
// têm de vir preenchidas para a instrução ser válida), e usar o dado que
// acabou de sair do banco evita gravar por cima um valor desatualizado que o
// cliente porventura tivesse em cache - só sort_order muda de verdade.
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
    .select("id, formula_id, ingredient_name, quantity, unit, ingredient_id")
    .eq("formula_id", formulaIdParsed.data)
    .is("deleted_at", null);
  if (fetchError) return actionError(friendlyDbError(fetchError));

  const existingById = new Map((existing ?? []).map((row) => [row.id, row]));
  const requestedIds = new Set(idsParsed.data);
  const sameSet = existingById.size === requestedIds.size && [...existingById.keys()].every((id) => requestedIds.has(id));
  if (!sameSet) return actionError("A lista de reordenação não confere com as linhas atuais desta fórmula.");

  const rows: TablesInsert<"formula_compositions">[] = idsParsed.data.map((id, index) => {
    const current = existingById.get(id)!;
    return {
      id: current.id,
      formula_id: current.formula_id,
      ingredient_name: current.ingredient_name,
      quantity: current.quantity,
      unit: current.unit,
      ingredient_id: current.ingredient_id,
      sort_order: index,
    };
  });

  const { error } = await supabase.from("formula_compositions").upsert(rows, { onConflict: "id" });
  if (error) return actionError(friendlyDbError(error));

  revalidateCatalogCache();
  return actionOk(undefined);
}
