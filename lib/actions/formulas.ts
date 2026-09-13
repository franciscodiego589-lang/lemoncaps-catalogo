"use server";

import { z } from "zod";

import { requireStaffAction, StaffAuthError } from "@/lib/data/admin";
import { createClient } from "@/lib/supabase/server";
import type { TablesInsert, TablesUpdate } from "@/lib/supabase/database.types";
import { actionError, actionOk, zodIssuesToFieldErrors, type ActionResult } from "@/lib/actions/types";
import { revalidateCatalogCache } from "@/lib/data/formulas";

// -----------------------------------------------------------------------------
// Validação - espelha exatamente as colunas/constraints de public.formulas
// (supabase/migrations/20260909210000_schema.sql). Nunca aceitamos o objeto
// inteiro do cliente como verdade: cada campo é validado aqui, e os campos de
// controle (id, version, created_by/at, updated_by/at, deleted_*, e as 3
// colunas de conformidade ANVISA) NUNCA fazem parte deste schema - não tem
// como o cliente alterá-los por aqui, mesmo que tente enviá-los.
// -----------------------------------------------------------------------------

const slugRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const nullableString = z
  .string()
  .trim()
  .nullable()
  .transform((v) => (v === null || v === "" ? null : v));

const formulaFieldsShape = {
  name: z.string().trim().min(1, "Informe o nome.").max(300, "Nome muito longo."),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Informe o slug.")
    .max(150)
    .regex(slugRegex, "Use só letras minúsculas, números e hífen (ex.: minha-formula)."),
  segmentId: z.string().uuid("Selecione um segmento."),
  line: z.enum(["premium", "basica"], { message: "Selecione a linha." }),
  format: z.enum(["capsula", "soluvel", "gummy", "liquido"], { message: "Selecione o formato." }),
  regulatoryProductType: nullableString,
  poteContentsDescription: nullableString,
  netWeight: nullableString,
  description: z.string().trim().max(20000).default(""),
  nutritionalInfo: nullableString,
  ingredientsList: nullableString,
  usageInstructions: nullableString,
  benefits: z.array(z.string().trim().min(1)).default([]),
  generalBenefitsSummary: nullableString,
  warnings: nullableString,
  targetAudience: nullableString,
  storageInstructions: nullableString,
  technicalSheetTitle: nullableString,
  listPriceCents: z.number().int("Preço deve ser um valor inteiro em centavos.").min(0, "Preço não pode ser negativo.").nullable(),
  minimumOrderPotes: z.number().int().min(1, "Pedido mínimo precisa ser de ao menos 1 pote."),
  sortOrder: z.number().int().min(0),
  active: z.boolean(),
};

const createFormulaSchema = z.object(formulaFieldsShape);
const updateFormulaSchema = z.object(formulaFieldsShape).partial();

export type FormulaWritableInput = z.infer<typeof createFormulaSchema>;
export type FormulaWritablePatch = z.infer<typeof updateFormulaSchema>;

// camelCase -> snake_case, só para as chaves que este schema conhece.
// Tipado como TablesUpdate (todas as colunas opcionais) - é o formato certo
// para .update(); em createFormula (abaixo) o resultado é convertido para
// TablesInsert com um cast estreito, seguro porque createFormulaSchema (não
// parcial) já garante em tempo de execução que os campos obrigatórios do
// insert (name/slug/segmentId/line/format) estão todos presentes.
function toRow(input: Partial<FormulaWritableInput>): TablesUpdate<"formulas"> {
  const row: TablesUpdate<"formulas"> = {};
  if (input.name !== undefined) row.name = input.name;
  if (input.slug !== undefined) row.slug = input.slug;
  if (input.segmentId !== undefined) row.segment_id = input.segmentId;
  if (input.line !== undefined) row.line = input.line;
  if (input.format !== undefined) row.format = input.format;
  if (input.regulatoryProductType !== undefined) row.regulatory_product_type = input.regulatoryProductType;
  if (input.poteContentsDescription !== undefined) row.pote_contents_description = input.poteContentsDescription;
  if (input.netWeight !== undefined) row.net_weight = input.netWeight;
  if (input.description !== undefined) row.description = input.description;
  if (input.nutritionalInfo !== undefined) row.nutritional_info = input.nutritionalInfo;
  if (input.ingredientsList !== undefined) row.ingredients_list = input.ingredientsList;
  if (input.usageInstructions !== undefined) row.usage_instructions = input.usageInstructions;
  if (input.benefits !== undefined) row.benefits = input.benefits;
  if (input.generalBenefitsSummary !== undefined) row.general_benefits_summary = input.generalBenefitsSummary;
  if (input.warnings !== undefined) row.warnings = input.warnings;
  if (input.targetAudience !== undefined) row.target_audience = input.targetAudience;
  if (input.storageInstructions !== undefined) row.storage_instructions = input.storageInstructions;
  if (input.technicalSheetTitle !== undefined) row.technical_sheet_title = input.technicalSheetTitle;
  if (input.listPriceCents !== undefined) row.list_price_cents = input.listPriceCents;
  if (input.minimumOrderPotes !== undefined) row.minimum_order_potes = input.minimumOrderPotes;
  if (input.sortOrder !== undefined) row.sort_order = input.sortOrder;
  if (input.active !== undefined) row.active = input.active;
  return row;
}

// Mesma trava de public.formulas_active_requires_price, checada aqui ANTES de
// ir ao banco para devolver erro no campo certo - a constraint do banco
// continua sendo o backstop final (defesa em profundidade), esta checagem é
// só para uma mensagem melhor.
function violatesActiveRequiresPrice(patch: Partial<FormulaWritableInput>, currentListPriceCents: number | null | undefined): boolean {
  const willBeActive = patch.active ?? undefined;
  if (willBeActive !== true) return false;
  const effectivePrice = patch.listPriceCents !== undefined ? patch.listPriceCents : currentListPriceCents;
  return effectivePrice === null || effectivePrice === undefined;
}

function mapWriteError(error: { code?: string; message?: string }): ActionResult<never> {
  if (error.code === "23505") return actionError("Já existe uma fórmula com este slug. Escolha outro.", { slug: "Slug já em uso." });
  if (error.code === "23514" && error.message?.includes("formulas_active_requires_price")) {
    return actionError("Não é possível ativar uma fórmula sem preço definido.", { active: "Defina o preço por pote antes de ativar." });
  }
  console.error("[formulas action] erro de escrita:", error);
  return actionError("Não foi possível salvar a fórmula agora. Tente novamente em instantes.");
}

export async function createFormula(input: FormulaWritableInput): Promise<ActionResult<{ id: string; slug: string }>> {
  try {
    await requireStaffAction();
  } catch (error) {
    if (error instanceof StaffAuthError) return actionError(error.message);
    throw error;
  }

  const parsed = createFormulaSchema.safeParse(input);
  if (!parsed.success) return actionError("Corrija os campos destacados.", zodIssuesToFieldErrors(parsed.error));

  if (violatesActiveRequiresPrice(parsed.data, null)) {
    return actionError("Não é possível criar uma fórmula ativa sem preço definido.", {
      active: "Defina o preço por pote antes de ativar, ou crie como inativa.",
    });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("formulas")
    .insert(toRow(parsed.data) as TablesInsert<"formulas">)
    .select("id, slug")
    .single();

  if (error || !data) return mapWriteError(error ?? {});

  // Companheira 1:1 em formula_costs (mesma consistência das 28 fórmulas
  // seedadas, ver supabase/migrations/20260909210002_seed_catalogo.sql) -
  // nasce com custo NULL, para a tela /admin/custos sempre achar uma linha
  // por fórmula. Falha aqui não desfaz a criação da fórmula (a action de
  // custo faz upsert e cria a linha sob demanda se preciso) - só registrada.
  const { error: costError } = await supabase.from("formula_costs").insert({ formula_id: data.id, unit_cost_cents: null });
  if (costError) console.error("[createFormula] falha ao criar linha companheira em formula_costs:", costError);

  revalidateCatalogCache();
  return actionOk({ id: data.id, slug: data.slug });
}

export async function updateFormula(id: string, patch: FormulaWritablePatch): Promise<ActionResult<{ id: string; updatedAt: string }>> {
  try {
    await requireStaffAction();
  } catch (error) {
    if (error instanceof StaffAuthError) return actionError(error.message);
    throw error;
  }

  const idParsed = z.string().uuid().safeParse(id);
  if (!idParsed.success) return actionError("Identificador de fórmula inválido.");

  const parsed = updateFormulaSchema.safeParse(patch);
  if (!parsed.success) return actionError("Corrija os campos destacados.", zodIssuesToFieldErrors(parsed.error));
  if (Object.keys(parsed.data).length === 0) return actionError("Nenhuma alteração para salvar.");

  const supabase = await createClient();

  // Cobre os dois casos: ativar sem mexer no preço (usa o preço já gravado)
  // e ativar zerando o preço na mesma chamada (usa o preço vindo no patch,
  // nunca consulta o banco à toa quando já sabe a resposta).
  if (parsed.data.active === true) {
    const effectivePrice =
      parsed.data.listPriceCents !== undefined
        ? parsed.data.listPriceCents
        : (await supabase.from("formulas").select("list_price_cents").eq("id", idParsed.data).maybeSingle()).data?.list_price_cents ?? null;

    if (effectivePrice === null) {
      return actionError("Não é possível ativar uma fórmula sem preço definido.", { active: "Defina o preço por pote antes de ativar." });
    }
  }

  const { data, error } = await supabase
    .from("formulas")
    .update(toRow(parsed.data))
    .eq("id", idParsed.data)
    .is("deleted_at", null)
    .select("id, updated_at")
    .maybeSingle();

  if (error) return mapWriteError(error);
  if (!data) return actionError("Fórmula não encontrada.");

  revalidateCatalogCache();
  return actionOk({ id: data.id, updatedAt: data.updated_at });
}

// Exclusão lógica (soft delete) - nunca DELETE físico via API, conforme
// AGENTS.md do projeto. "Desativar" (active=false) já cobre a maior parte do
// caso de uso do item 3 da tarefa; isto aqui é para quando o pedido é
// realmente remover da lista de administração (mantém histórico/auditoria).
export async function softDeleteFormula(id: string, reason: string): Promise<ActionResult<{ id: string }>> {
  try {
    await requireStaffAction();
  } catch (error) {
    if (error instanceof StaffAuthError) return actionError(error.message);
    throw error;
  }

  const idParsed = z.string().uuid().safeParse(id);
  if (!idParsed.success) return actionError("Identificador de fórmula inválido.");
  const reasonParsed = z.string().trim().min(1, "Informe o motivo da exclusão.").max(500).safeParse(reason);
  if (!reasonParsed.success) return actionError(reasonParsed.error.issues[0]?.message ?? "Informe o motivo da exclusão.");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("formulas")
    .update({ deleted_at: new Date().toISOString(), reason_deleted: reasonParsed.data, active: false })
    .eq("id", idParsed.data)
    .is("deleted_at", null)
    .select("id")
    .maybeSingle();

  if (error) return mapWriteError(error);
  if (!data) return actionError("Fórmula não encontrada.");

  revalidateCatalogCache();
  return actionOk({ id: data.id });
}
