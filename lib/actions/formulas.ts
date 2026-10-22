"use server";

import { z } from "zod";

import { requireStaffAction, StaffAuthError } from "@/lib/data/admin";
import { DUN14_LENGTH, EAN13_LENGTH, isValidGtin } from "@/lib/catalog/gtin";
import { mergeNutritionTableMetadata, rawNutritionTableSchema, renderNutritionTableText, toNutritionTable, type NutritionTableInput } from "@/lib/catalog/nutrition-table";
import { violatesActiveRequiresPrice } from "@/lib/catalog/price-rule";
import { createClient } from "@/lib/supabase/server";
import type { Json, TablesInsert, TablesUpdate } from "@/lib/supabase/database.types";
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

// --- Pacote técnico (embalagem e logística) -----------------------------------
// Todos opcionais: vazio vira null, e null nunca aparece na tela nem no PDF.
//
// Código de barras: aceito mesmo com dígito verificador errado (ordem do dono,
// 18/09/2026, mesmo espírito do afrouxamento de 17/09/2026) - um código provisório
// NUNCA pode travar o salvamento dos outros ~30 campos da fórmula. O CHECK do banco
// (formulas_ean13_valido / formulas_dun14_valido, migration 20260916000000,
// private.is_valid_gtin) continua de pé - ninguém pediu para mexer nele, e ele só
// aceita um código com dígito verificador correto OU null. Como null já é o estado
// que esta coluna usa para "ainda não levantado", um código inválido vira null aqui
// em vez de recusar a gravação inteira - o aviso de "PENDENTE" sai por fora deste
// transform (gtinPendingWarning, logo abaixo, chamado em createFormula/updateFormula
// sobre o dado CRU, antes de ele ser zerado), porque um transform só devolve o valor,
// nunca um aviso não-bloqueante junto.
function nullableGtin(length: number) {
  return z
    .string()
    .trim()
    .nullable()
    .transform((v) => (v === null || v === "" ? null : v))
    .transform((v) => (v === null || isValidGtin(v, length) ? v : null));
}

// Aviso NÃO-bloqueante para a mesma checagem de nullableGtin acima, calculado sobre o
// dado cru (antes do transform zerar o valor inválido). createFormula/updateFormula
// devolvem isto em `warnings` no resultado de SUCESSO (a fórmula salvou; só o código
// de barras não) - é o que sinaliza "PENDENTE — dígito verificador não confere" sem
// impedir o salvamento dos demais campos.
function gtinPendingWarning(raw: unknown, length: number, rotulo: string): string | undefined {
  const trimmed = typeof raw === "string" ? raw.trim() : "";
  if (trimmed === "" || isValidGtin(trimmed, length)) return undefined;
  return `${rotulo}: PENDENTE — dígito verificador não confere. O código digitado não foi salvo (o campo ficou vazio); confira e informe de novo.`;
}

const nullablePositiveInt = z
  .number()
  .int("Use um número inteiro.")
  .positive("Use um número maior que zero.")
  .nullable();

// numeric(10,2) no banco: acima de duas casas o Postgres ARREDONDARIA em silêncio, e
// medida arredondada sem ninguém saber é exatamente o tipo de erro que este catálogo
// não pode ter. Melhor recusar e deixar quem cadastra decidir o valor.
const CASAS_DECIMAIS_MEDIDA = 2;
const FATOR_CASAS_DECIMAIS = 10 ** CASAS_DECIMAIS_MEDIDA;

const nullableMeasure = z
  .number()
  .positive("Use um número maior que zero.")
  .nullable()
  .refine((v) => v === null || Number.isInteger(Number((v * FATOR_CASAS_DECIMAIS).toFixed(6))), {
    message: `Use no máximo ${CASAS_DECIMAIS_MEDIDA} casas decimais.`,
  });

// Vazio é aceito por pedido do dono (17/09/2026: "deixe desbloqueado qualquer
// alteração que eu queira fazer no admin e salvar" — temporário e consciente,
// mesmo padrão já usado em lib/actions/sheet-approvals.ts). formulas.name é
// NOT NULL sem default (supabase/migrations/20260909210000_schema.sql) - nunca
// grava string vazia, vira "PENDENTE" para ficar óbvio na listagem que falta
// preencher.
const nameOrPendente = z
  .string()
  .trim()
  .max(300, "Nome muito longo.")
  .transform((v) => (v === "" ? "PENDENTE" : v));

// slug é NOT NULL + UNIQUE + CHECK de formato no banco (formulas_slug_format) -
// diferente de "name", "" quebraria o CHECK na hora (regex não aceita vazio) e
// um literal fixo tipo "pendente" quebraria o UNIQUE já na segunda fórmula
// salva em branco. Por isso o fallback carrega um sufixo variável (timestamp
// em ms): sempre bate o formato exigido e a chance de colidir com outra
// fórmula é desprezível; se colidir mesmo assim, mapWriteError (abaixo) já
// devolve "Já existe uma fórmula com este slug" em vez de travar sem explicar.
const slugOrRascunho = z.preprocess(
  (v) => {
    if (typeof v !== "string") return v;
    const normalizado = v.trim().toLowerCase();
    return normalizado === "" ? `rascunho-${Date.now()}` : normalizado;
  },
  z.string().max(150).regex(slugRegex, "Use só letras minúsculas, números e hífen (ex.: minha-formula)."),
);

const formulaFieldsShape = {
  name: nameOrPendente,
  slug: slugOrRascunho,
  segmentId: z.string().uuid("Selecione um segmento."),
  line: z.enum(["premium", "basica", "essencial", "lemon_caps"], { message: "Selecione a linha." }),
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
  // Pacote técnico - o que o comprador profissional precisa para calcular frete,
  // palete e espaço de estoque (migration 20260916000000).
  ean13: nullableGtin(EAN13_LENGTH),
  dun14: nullableGtin(DUN14_LENGTH),
  shelfLifeMonths: nullablePositiveInt,
  grossWeightG: nullableMeasure,
  packageHeightMm: nullableMeasure,
  packageWidthMm: nullableMeasure,
  packageDepthMm: nullableMeasure,
  unitsPerBox: nullablePositiveInt,
  boxHeightMm: nullableMeasure,
  boxWidthMm: nullableMeasure,
  boxDepthMm: nullableMeasure,
  boxGrossWeightG: nullableMeasure,
  // Versão da ficha técnica: sobe por decisão de quem edita, quando a mudança é
  // grande a ponto de exigir nova aprovação do responsável técnico. Nunca sobe
  // sozinha a cada salvamento - um ajuste de preço não é ficha nova.
  technicalSheetVersion: z.number().int("Use um número inteiro.").min(1, "A versão da ficha começa em 1."),
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
  if (input.ean13 !== undefined) row.ean13 = input.ean13;
  if (input.dun14 !== undefined) row.dun14 = input.dun14;
  if (input.shelfLifeMonths !== undefined) row.shelf_life_months = input.shelfLifeMonths;
  if (input.grossWeightG !== undefined) row.gross_weight_g = input.grossWeightG;
  if (input.packageHeightMm !== undefined) row.package_height_mm = input.packageHeightMm;
  if (input.packageWidthMm !== undefined) row.package_width_mm = input.packageWidthMm;
  if (input.packageDepthMm !== undefined) row.package_depth_mm = input.packageDepthMm;
  if (input.unitsPerBox !== undefined) row.units_per_box = input.unitsPerBox;
  if (input.boxHeightMm !== undefined) row.box_height_mm = input.boxHeightMm;
  if (input.boxWidthMm !== undefined) row.box_width_mm = input.boxWidthMm;
  if (input.boxDepthMm !== undefined) row.box_depth_mm = input.boxDepthMm;
  if (input.boxGrossWeightG !== undefined) row.box_gross_weight_g = input.boxGrossWeightG;
  if (input.technicalSheetVersion !== undefined) row.technical_sheet_version = input.technicalSheetVersion;
  return row;
}

// Trava "fórmula ativa precisa de preço" (com a exceção da linha Essencial)
// mora em lib/catalog/price-rule.ts: função pura, testada, que este arquivo
// "use server" não pode exportar (aqui só entram server actions assíncronas).

function mapWriteError(error: { code?: string; message?: string }): ActionResult<never> {
  // 23505 (unique_violation) agora tem três origens possíveis: o slug e os dois
  // índices únicos parciais de código de barras criados em 20260916000000. Ler a
  // mensagem do Postgres para dizer QUAL foi - mandar o usuário caçar um slug
  // duplicado quando o problema é o EAN é pior do que não dizer nada.
  if (error.code === "23505") {
    if (error.message?.includes("uq_formulas_ean13")) {
      return actionError("Este EAN-13 já está cadastrado em outra fórmula.", { ean13: "Código de barras já em uso." });
    }
    if (error.message?.includes("uq_formulas_dun14")) {
      return actionError("Este DUN-14 já está cadastrado em outra fórmula.", { dun14: "Código da caixa já em uso." });
    }
    return actionError("Já existe uma fórmula com este slug. Escolha outro.", { slug: "Slug já em uso." });
  }
  if (error.code === "23514" && error.message?.includes("formulas_ean13_valido")) {
    return actionError("EAN-13 inválido: confira os 13 dígitos e o dígito verificador.", { ean13: "Código de barras inválido." });
  }
  if (error.code === "23514" && error.message?.includes("formulas_dun14_valido")) {
    return actionError("DUN-14 inválido: confira os 14 dígitos e o dígito verificador.", { dun14: "Código da caixa inválido." });
  }
  if (error.code === "23514" && error.message?.includes("formulas_active_requires_price")) {
    // Chega aqui também quando uma fórmula ativa sem preço sai da linha
    // Essencial (troca de linha), por isso a mensagem fala das duas coisas.
    return actionError("Fora da linha Econômica, fórmula ativa precisa de preço por pote.", {
      active: "Defina o preço por pote antes de ativar.",
      line: "Só a linha Econômica pode ficar no ar sem preço.",
    });
  }
  console.error("[formulas action] erro de escrita:", error);
  return actionError("Não foi possível salvar a fórmula agora. Tente novamente em instantes.");
}

export async function createFormula(
  input: FormulaWritableInput,
): Promise<ActionResult<{ id: string; slug: string; warnings?: Partial<Record<string, string>> }>> {
  try {
    await requireStaffAction();
  } catch (error) {
    if (error instanceof StaffAuthError) return actionError(error.message);
    throw error;
  }

  const parsed = createFormulaSchema.safeParse(input);
  if (!parsed.success) return actionError("Corrija os campos destacados.", zodIssuesToFieldErrors(parsed.error));

  if (violatesActiveRequiresPrice(parsed.data, null, null)) {
    return actionError("Fora da linha Econômica, não é possível criar uma fórmula ativa sem preço definido.", {
      active: "Defina o preço por pote antes de ativar, ou crie como inativa.",
    });
  }

  // Calculado sobre o dado CRU (input), antes de nullableGtin zerar um código com
  // dígito verificador errado - ver comentário de gtinPendingWarning acima.
  const warnings: Partial<Record<string, string>> = {};
  const ean13Warning = gtinPendingWarning(input.ean13, EAN13_LENGTH, "EAN-13");
  if (ean13Warning) warnings.ean13 = ean13Warning;
  const dun14Warning = gtinPendingWarning(input.dun14, DUN14_LENGTH, "DUN-14");
  if (dun14Warning) warnings.dun14 = dun14Warning;

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
  return actionOk({ id: data.id, slug: data.slug, ...(Object.keys(warnings).length > 0 ? { warnings } : {}) });
}

export async function updateFormula(
  id: string,
  patch: FormulaWritablePatch,
): Promise<ActionResult<{ id: string; updatedAt: string; warnings?: Partial<Record<string, string>> }>> {
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

  // Calculado sobre o dado CRU (patch), antes de nullableGtin zerar um código com
  // dígito verificador errado - ver comentário de gtinPendingWarning acima.
  const warnings: Partial<Record<string, string>> = {};
  const ean13Warning = gtinPendingWarning(patch.ean13, EAN13_LENGTH, "EAN-13");
  if (ean13Warning) warnings.ean13 = ean13Warning;
  const dun14Warning = gtinPendingWarning(patch.dun14, DUN14_LENGTH, "DUN-14");
  if (dun14Warning) warnings.dun14 = dun14Warning;

  const supabase = await createClient();

  // Cobre os dois casos: ativar sem mexer no preço (usa o preço já gravado)
  // e ativar zerando o preço na mesma chamada (usa o preço vindo no patch,
  // nunca consulta o banco à toa quando já sabe a resposta).
  // A linha entra na conta pela exceção da Essencial: só se consulta o banco
  // quando o patch não traz preço ou linha e a resposta depende do gravado.
  if (parsed.data.active === true) {
    const precisaDoGravado = parsed.data.listPriceCents === undefined || parsed.data.line === undefined;
    const gravado = precisaDoGravado
      ? (await supabase.from("formulas").select("list_price_cents, line").eq("id", idParsed.data).maybeSingle()).data
      : null;

    if (violatesActiveRequiresPrice(parsed.data, gravado?.list_price_cents ?? null, gravado?.line ?? null)) {
      return actionError("Fora da linha Econômica, não é possível ativar uma fórmula sem preço definido.", {
        active: "Defina o preço por pote antes de ativar.",
      });
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
  return actionOk({ id: data.id, updatedAt: data.updated_at, ...(Object.keys(warnings).length > 0 ? { warnings } : {}) });
}

// -----------------------------------------------------------------------------
// DESTAQUE DO CATÁLOGO (formulas.featured_at, migration 20260916143000)
// -----------------------------------------------------------------------------
// Action própria, e não mais um campo dentro de updateFormula, por dois motivos:
//
//   1. Segurança: o cliente manda um BOOLEANO, nunca uma data. Quem grava o
//      instante é o servidor (new Date() aqui embaixo). Se featured_at entrasse
//      no schema Zod compartilhado do formulário, qualquer POST à Server Action
//      poderia escolher a data - e a data é o que decide a ORDEM dos destaques
//      na vitrine. Antedatar viraria "furar a fila do catálogo".
//   2. Propósito único: o botão da lista alterna uma coisa só. Não precisa
//      carregar consigo os 30 campos do editor de fórmula.
//
// A trava de sessão é a mesma das demais actions deste arquivo (requireStaffAction),
// e a policy formulas_update do banco continua sendo o backstop: mesmo com sessão
// válida, quem não for staff ATIVO não escreve.
export async function setFormulaFeatured(id: string, featured: boolean): Promise<ActionResult<{ id: string; featuredAt: string | null }>> {
  try {
    await requireStaffAction();
  } catch (error) {
    if (error instanceof StaffAuthError) return actionError(error.message);
    throw error;
  }

  const idParsed = z.string().uuid().safeParse(id);
  if (!idParsed.success) return actionError("Identificador de fórmula inválido.");

  const featuredParsed = z.boolean().safeParse(featured);
  if (!featuredParsed.success) return actionError("Valor de destaque inválido.");

  // Remarcar um destaque que já é destaque REESCREVE o carimbo, e isso é
  // intencional: é como o dono reordena a fila da vitrine sem mexer em
  // sort_order (o mais recém-destacado vai para a frente).
  const featuredAt = featuredParsed.data ? new Date().toISOString() : null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("formulas")
    .update({ featured_at: featuredAt })
    .eq("id", idParsed.data)
    .is("deleted_at", null)
    .select("id, featured_at")
    .maybeSingle();

  if (error) return mapWriteError(error);
  if (!data) return actionError("Fórmula não encontrada.");

  revalidateCatalogCache();
  return actionOk({ id: data.id, featuredAt: data.featured_at });
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
  // Vazio é aceito por pedido do dono (18/09/2026, mesmo afrouxamento consciente de
  // 17/09/2026): a exclusão é lógica e reversível (reason_deleted é só texto livre de
  // auditoria, sem CHECK de formato no banco) - motivo em branco não trava a exclusão,
  // vira "PENDENTE" para ficar óbvio na trilha de auditoria que falta preencher.
  const reasonParsed = z
    .string()
    .trim()
    .max(500, "Motivo muito longo.")
    .transform((v) => (v === "" ? "PENDENTE" : v))
    .safeParse(reason);
  if (!reasonParsed.success) return actionError(reasonParsed.error.issues[0]?.message ?? "Corrija o motivo da exclusão.");

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

// -----------------------------------------------------------------------------
// TABELA DE INFORMAÇÃO NUTRICIONAL (formulas.metadata->tabela_nutricional +
// formulas.nutritional_info) - editor estruturado do admin (ampliação de
// escopo, ordem do dono, 16/09/2026). Ação própria (e não mais um campo de
// updateFormulaSchema) por dois motivos, no mesmo espírito de
// setFormulaFeatured acima:
//
//   1. O dado é um blob jsonb inteiro, validado por um schema PRÓPRIO
//      (rawNutritionTableSchema, em lib/catalog/nutrition-table.ts - "o tipo
//      é a verdade", mesmo módulo que o dossiê web e o PDF já usam para
//      NUNCA lerem a tabela de um jeito e escreverem de outro).
//   2. Grava DOIS campos numa única operação atômica - metadata (merge, nunca
//      sobrescrita do jsonb inteiro: mergeNutritionTableMetadata preserva
//      qualquer outra chave que já exista, ex.:
//      "nutritional_info_anterior_2026_09_16", presente nas 24 fórmulas
//      reais) e nutritional_info (texto TEXT, regenerado a partir do MESMO
//      JSON validado por renderNutritionTableText - os dois campos nunca
//      podem divergir um do outro, porque um é sempre derivado do outro
//      nesta mesma chamada).
//
// Sessão/permissão: requireStaffAction(), a MESMA trava de toda ação deste
// arquivo (createFormula/updateFormula/setFormulaFeatured/softDeleteFormula) -
// este projeto não tem um "can_manage" por recurso separado de
// requireStaffAction; RLS (public.formulas_update, policy do banco) continua
// sendo o backstop final, como em updateFormula acima.
export async function updateNutritionTable(
  formulaId: string,
  input: NutritionTableInput,
): Promise<ActionResult<{ id: string; nutritionalInfo: string }>> {
  try {
    await requireStaffAction();
  } catch (error) {
    if (error instanceof StaffAuthError) return actionError(error.message);
    throw error;
  }

  const idParsed = z.string().uuid().safeParse(formulaId);
  if (!idParsed.success) return actionError("Identificador de fórmula inválido.");

  const parsed = rawNutritionTableSchema.safeParse(input);
  if (!parsed.success) return actionError("Corrija os campos destacados na tabela nutricional.", zodIssuesToFieldErrors(parsed.error));

  const supabase = await createClient();

  // Lê o metadata ATUAL antes de escrever - nunca assume que a única coisa
  // que existe ali é a tabela nutricional (ver comentário de
  // mergeNutritionTableMetadata).
  const { data: atual, error: readError } = await supabase
    .from("formulas")
    .select("metadata")
    .eq("id", idParsed.data)
    .is("deleted_at", null)
    .maybeSingle();

  if (readError) return mapWriteError(readError);
  if (!atual) return actionError("Fórmula não encontrada.");

  const proximoMetadata = mergeNutritionTableMetadata(atual.metadata, parsed.data);
  const nutritionalInfo = renderNutritionTableText(toNutritionTable(parsed.data));

  const { data, error } = await supabase
    .from("formulas")
    .update({ metadata: proximoMetadata as Json, nutritional_info: nutritionalInfo })
    .eq("id", idParsed.data)
    .is("deleted_at", null)
    .select("id")
    .maybeSingle();

  if (error) return mapWriteError(error);
  if (!data) return actionError("Fórmula não encontrada.");

  revalidateCatalogCache();
  return actionOk({ id: data.id, nutritionalInfo });
}
