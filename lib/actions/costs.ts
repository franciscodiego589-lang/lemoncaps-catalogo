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
