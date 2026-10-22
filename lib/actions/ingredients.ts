"use server";

import { z } from "zod";

import { requireStaffAction, StaffAuthError } from "@/lib/data/admin";
import { createClient } from "@/lib/supabase/server";
import type { TablesInsert, TablesUpdate } from "@/lib/supabase/database.types";
import { actionError, actionOk, friendlyDbError, zodIssuesToFieldErrors, type ActionResult } from "@/lib/actions/types";
import { revalidateCatalogCache } from "@/lib/data/formulas";

// public.ingredients (supabase/migrations/20260913220056_ingredientes.sql):
// ficha por insumo - nome, categoria, descrição, imagem e os 4 campos de
// alegação ANVISA (item 5 da tarefa). claim_* nascem NULL até o dono conferir
// a norma vigente para aquele insumo - nunca preenchidos com texto plausível
// (mesma regra de exatidão do AGENTS.md do projeto).

const slugRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;

const nullableString = z
  .string()
  .trim()
  .nullable()
  .transform((v) => (v === null || v === "" ? null : v));

// Mesmo afrouxamento consciente de lib/actions/formulas.ts (ordem do dono,
// 17/09/2026): vazio não trava o salvamento. ingredients.name é NOT NULL sem
// default -> vira "PENDENTE". ingredients.slug é NOT NULL + UNIQUE + CHECK de
// formato (ingredients_slug_format) -> nunca "", nunca um literal fixo (ia
// colidir no segundo insumo salvo em branco); o sufixo de timestamp resolve os
// dois problemas de uma vez. Ver o comentário mais extenso em formulas.ts.
const nameOrPendente = z
  .string()
  .trim()
  .max(200)
  .transform((v) => (v === "" ? "PENDENTE" : v));

const slugOrRascunho = z.preprocess(
  (v) => {
    if (typeof v !== "string") return v;
    const normalizado = v.trim().toLowerCase();
    return normalizado === "" ? `rascunho-${Date.now()}` : normalizado;
  },
  z.string().max(150).regex(slugRegex, "Use só letras minúsculas, números e hífen."),
);

const ingredientFieldsShape = {
  name: nameOrPendente,
  slug: slugOrRascunho,
  category: z.enum(["vitamina", "mineral", "aminoacido", "extrato_vegetal", "outro"], { message: "Selecione a categoria." }),
  description: nullableString,
  imagePath: nullableString,
  claimText: nullableString,
  claimSource: nullableString,
  claimMinAmount: z.number().nonnegative("Não pode ser negativo.").nullable(),
  claimVerifiedAt: z
    .string()
    .regex(dateOnlyRegex, "Use o formato AAAA-MM-DD.")
    .nullable()
    .transform((v) => (v ? new Date(`${v}T00:00:00Z`).toISOString() : null)),
  active: z.boolean(),
};

const createIngredientSchema = z.object(ingredientFieldsShape);
const updateIngredientSchema = z.object(ingredientFieldsShape).partial();

export type IngredientWritableInput = z.infer<typeof createIngredientSchema>;
export type IngredientWritablePatch = z.infer<typeof updateIngredientSchema>;

function toRow(input: Partial<IngredientWritableInput>): TablesUpdate<"ingredients"> {
  const row: TablesUpdate<"ingredients"> = {};
  if (input.name !== undefined) row.name = input.name;
  if (input.slug !== undefined) row.slug = input.slug;
  if (input.category !== undefined) row.category = input.category;
  if (input.description !== undefined) row.description = input.description;
  if (input.imagePath !== undefined) row.image_path = input.imagePath;
  if (input.claimText !== undefined) row.claim_text = input.claimText;
  if (input.claimSource !== undefined) row.claim_source = input.claimSource;
  if (input.claimMinAmount !== undefined) row.claim_min_amount = input.claimMinAmount;
  if (input.claimVerifiedAt !== undefined) row.claim_verified_at = input.claimVerifiedAt;
  if (input.active !== undefined) row.active = input.active;
  return row;
}

async function assertStaff(): Promise<ActionResult<never> | null> {
  try {
    await requireStaffAction();
    return null;
  } catch (error) {
    if (error instanceof StaffAuthError) return actionError(error.message);
    throw error;
  }
}

export async function createIngredient(input: IngredientWritableInput): Promise<ActionResult<{ id: string; slug: string }>> {
  const authError = await assertStaff();
  if (authError) return authError;

  const parsed = createIngredientSchema.safeParse(input);
  if (!parsed.success) return actionError("Corrija os campos destacados.", zodIssuesToFieldErrors(parsed.error));

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ingredients")
    .insert(toRow(parsed.data) as TablesInsert<"ingredients">)
    .select("id, slug")
    .single();

  if (error || !data) {
    if (error?.code === "23505") return actionError("Já existe um insumo com este slug. Escolha outro.", { slug: "Slug já em uso." });
    return actionError(friendlyDbError(error));
  }

  revalidateCatalogCache();
  return actionOk({ id: data.id, slug: data.slug });
}

export async function updateIngredient(id: string, patch: IngredientWritablePatch): Promise<ActionResult<{ id: string }>> {
  const authError = await assertStaff();
  if (authError) return authError;

  const idParsed = z.string().uuid().safeParse(id);
  if (!idParsed.success) return actionError("Identificador de insumo inválido.");
  const parsed = updateIngredientSchema.safeParse(patch);
  if (!parsed.success) return actionError("Corrija os campos destacados.", zodIssuesToFieldErrors(parsed.error));
  if (Object.keys(parsed.data).length === 0) return actionError("Nenhuma alteração para salvar.");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ingredients")
    .update(toRow(parsed.data))
    .eq("id", idParsed.data)
    .is("deleted_at", null)
    .select("id")
    .maybeSingle();

  if (error) {
    if (error.code === "23505") return actionError("Já existe um insumo com este slug. Escolha outro.", { slug: "Slug já em uso." });
    return actionError(friendlyDbError(error));
  }
  if (!data) return actionError("Insumo não encontrado.");

  revalidateCatalogCache();
  return actionOk({ id: data.id });
}
