"use server";

import { z } from "zod";

import { requireStaffAction, StaffAuthError } from "@/lib/data/admin";
import { createClient } from "@/lib/supabase/server";
import type { TablesInsert } from "@/lib/supabase/database.types";
import { actionError, actionOk, friendlyDbError, zodIssuesToFieldErrors, type ActionResult } from "@/lib/actions/types";

// public.formula_costs - tabela 100% privada (nunca lida pelo público, ver
// RLS em supabase/migrations/20260909210001_rls_policies.sql, seção 4). Um
// campo a mais aqui não pode nunca vazar para o catálogo público: por isso
// esta action nunca chama revalidateCatalogCache() - a alteração de custo
// não muda nada do que o visitante vê.

const costPatchSchema = z.object({
  unitCostCents: z.number().int("Custo deve ser um valor inteiro em centavos.").min(0, "Custo não pode ser negativo.").nullable().optional(),
  internalNotes: z
    .string()
    .trim()
    .max(5000)
    .nullable()
    .optional()
    .transform((v) => (v === "" ? null : v)),
});

export async function updateFormulaCost(
  formulaId: string,
  patch: z.infer<typeof costPatchSchema>,
): Promise<ActionResult<{ formulaId: string }>> {
  try {
    await requireStaffAction();
  } catch (error) {
    if (error instanceof StaffAuthError) return actionError(error.message);
    throw error;
  }

  const formulaIdParsed = z.string().uuid().safeParse(formulaId);
  if (!formulaIdParsed.success) return actionError("Fórmula inválida.");
  const parsed = costPatchSchema.safeParse(patch);
  if (!parsed.success) return actionError("Corrija os campos destacados.", zodIssuesToFieldErrors(parsed.error));
  if (parsed.data.unitCostCents === undefined && parsed.data.internalNotes === undefined) {
    return actionError("Nenhuma alteração para salvar.");
  }

  const supabase = await createClient();

  // Fórmula precisa existir de verdade (nunca aceita formulaId só porque o
  // cliente diz que existe).
  const { data: formula } = await supabase.from("formulas").select("id").eq("id", formulaIdParsed.data).is("deleted_at", null).maybeSingle();
  if (!formula) return actionError("Fórmula não encontrada.");

  // upsert por formula_id: a maioria das fórmulas já nasce com uma linha em
  // formula_costs (seed), mas uma fórmula criada pelo admin sempre ganha
  // linha companheira em createFormula (lib/actions/formulas.ts) - upsert
  // aqui é só defesa extra, nunca depende de uma das duas já ter rodado.
  const row: TablesInsert<"formula_costs"> = { formula_id: formulaIdParsed.data };
  if (parsed.data.unitCostCents !== undefined) row.unit_cost_cents = parsed.data.unitCostCents;
  if (parsed.data.internalNotes !== undefined) row.internal_notes = parsed.data.internalNotes;

  const { error } = await supabase.from("formula_costs").upsert(row, { onConflict: "formula_id" });
  if (error) return actionError(friendlyDbError(error));

  return actionOk({ formulaId: formulaIdParsed.data });
}

// =============================================================================
// EDIÇÃO EM LOTE - tela /admin/custos (CostsBatchTable). A tabela tinha 28
// linhas e nenhuma preenchida: editar uma-a-uma (updateFormulaCost acima)
// exige abrir 28 telas separadas e voltar 28 vezes, então na prática ninguém
// preenchia - todo orçamento saía com "lucro estimado: desconhecido". Esta
// action grava várias linhas de uma vez, numa única viagem ao banco - mas
// cada linha passa pela MESMA validação e pela MESMA checagem de existência
// da fórmula que a edição individual já fazia; só o volume muda, a segurança
// não relaxa (nunca confia em id/valor vindo do cliente sem reconferir).
// =============================================================================

const costBatchRowSchema = z.object({
  formulaId: z.string().uuid("Fórmula inválida."),
  unitCostCents: z.number().int("Custo deve ser um valor inteiro em centavos.").min(0, "Custo não pode ser negativo.").nullable(),
  internalNotes: z.string().trim().max(5000).nullable(),
});

// Teto defensivo, sem relação com o número real de fórmulas cadastradas (28
// hoje) - só para a action nunca engolir um payload absurdo vindo de um
// cliente malicioso ou de um bug de loop infinito no formulário.
const costBatchSchema = z.array(costBatchRowSchema).min(1, "Nenhuma alteração para salvar.").max(500, "Lote grande demais.");

export interface CostBatchRowInput {
  formulaId: string;
  unitCostCents: number | null;
  internalNotes: string | null;
}

export async function updateFormulaCostsBatch(rows: CostBatchRowInput[]): Promise<ActionResult<{ savedCount: number }>> {
  try {
    await requireStaffAction();
  } catch (error) {
    if (error instanceof StaffAuthError) return actionError(error.message);
    throw error;
  }

  const parsed = costBatchSchema.safeParse(rows);
  if (!parsed.success) {
    // Sem UI para apontar "linha 14" aqui de propósito: o cliente (CostsBatchTable)
    // já valida cada linha e desabilita o botão Salvar antes de chamar esta
    // action. Chegar aqui com erro só acontece contornando a tela.
    const first = parsed.error.issues[0];
    return actionError(first ? first.message : "Corrija os valores antes de salvar.");
  }

  // Nunca confia que os ids do cliente pertencem a fórmulas reais e ativas -
  // mesma régra da edição individual (bloco acima), só que para o lote
  // inteiro numa consulta só, em vez de uma verificação por linha.
  const formulaIds = [...new Set(parsed.data.map((row) => row.formulaId))];
  const supabase = await createClient();
  const { data: existingFormulas, error: formulasError } = await supabase
    .from("formulas")
    .select("id")
    .in("id", formulaIds)
    .is("deleted_at", null);
  if (formulasError) return actionError(friendlyDbError(formulasError));

  const existingIds = new Set((existingFormulas ?? []).map((f) => f.id));
  const missingIds = formulaIds.filter((id) => !existingIds.has(id));
  if (missingIds.length > 0) return actionError("Uma ou mais fórmulas não foram encontradas. Recarregue a página e tente de novo.");

  // De-duplica por formula_id (mantém a última ocorrência) antes do upsert em
  // lote: um INSERT ... ON CONFLICT só, do jeito que o Supabase monta um
  // upsert de array, não aceita o mesmo alvo de conflito duas vezes na mesma
  // instrução (Postgres recusa com erro 21000). Nunca deveria acontecer vindo
  // da tela real (cada linha da tabela é uma fórmula única) - é defesa contra
  // payload malicioso ou bug futuro, não caminho esperado.
  const rowsById = new Map<string, TablesInsert<"formula_costs">>();
  for (const row of parsed.data) {
    rowsById.set(row.formulaId, {
      formula_id: row.formulaId,
      unit_cost_cents: row.unitCostCents,
      internal_notes: row.internalNotes,
    });
  }

  const { data, error } = await supabase
    .from("formula_costs")
    .upsert([...rowsById.values()], { onConflict: "formula_id" })
    .select("formula_id");

  if (error) return actionError(friendlyDbError(error));

  return actionOk({ savedCount: data?.length ?? rowsById.size });
}
