import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import type { Enums } from "@/lib/supabase/database.types";
import type { PackagingSpec } from "@/lib/catalog/packaging";
import { readNutritionTable, type NutritionTable } from "@/lib/catalog/nutrition-table";
import { TOGGLEABLE_LINES, type ToggleableLine } from "@/lib/catalog/catalog-lines";
import { sanitizarTermoBusca } from "./postgrest-filtro";

// =============================================================================
// SESSÃO E AUTORIZAÇÃO - usado por toda página e toda Server Action do /admin.
// =============================================================================
// Fica neste arquivo (e não em lib/supabase/server.ts) de propósito: aqui é a
// Data Access Layer do admin, o lugar recomendado pela própria doc do Next 16
// para concentrar auth + autorização + acesso a banco (ver
// lemoncaps-catalogo-planejamento/next16-o-que-muda.md, seção 4, item 5).

export interface StaffSession {
  userId: string;
  email: string | null;
  fullName: string;
  canManageQuotes: boolean;
}

// Erro esperado (sessão ausente/expirada ou sem permissão). As Server Actions
// capturam especificamente este tipo para devolver mensagem amigável ao
// formulário - nunca o stack técnico.
export class StaffAuthError extends Error {}

// cache() do React deduplica dentro do MESMO ciclo de renderização (ex.:
// layout.tsx e page.tsx chamando isto na mesma navegação não disparam duas
// consultas ao banco). Cada Server Action é uma requisição POST separada e
// reexecuta esta função do zero - nunca reaproveita sessão de outra
// requisição, que é exatamente o comportamento exigido pela regra de
// segurança do projeto: reautenticar e reautorizar sempre, por dentro.
export const getStaffSession = cache(async (): Promise<StaffSession | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile, error } = await supabase
    .from("staff_profiles")
    .select("full_name, can_manage_quotes, active")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("[getStaffSession] falha ao consultar staff_profiles:", {
      message: error.message,
      code: error.code,
    });
    return null;
  }
  if (!profile || !profile.active) return null;

  return {
    userId: user.id,
    email: user.email ?? null,
    fullName: profile.full_name,
    canManageQuotes: profile.can_manage_quotes,
  };
});

// --- Para Server Components de página (app/admin/**/page.tsx, layout.tsx) ---
// Redireciona (nunca lança) - comportamento certo numa renderização de
// página. Continua sendo defesa em profundidade: o proxy.ts já barra quem não
// tem cookie de sessão nenhum (checagem otimista); aqui confirma-se contra o
// banco que a sessão pertence a um staff ATIVO de verdade.
export async function requireStaffPage(): Promise<StaffSession> {
  const session = await getStaffSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function requireQuoteManagerPage(): Promise<StaffSession> {
  const session = await requireStaffPage();
  if (!session.canManageQuotes) redirect("/admin");
  return session;
}

// --- Para Server Actions (lib/actions/**) ---
// Uma Server Action é um endpoint POST público (next16-o-que-muda.md, seção
// 4): nunca redireciona sozinha - sempre lança StaffAuthError, capturado pela
// própria action e traduzido em ActionResult (lib/actions/types.ts).
export async function requireStaffAction(): Promise<StaffSession> {
  const session = await getStaffSession();
  if (!session) {
    throw new StaffAuthError("Sessão inválida ou expirada. Faça login novamente.");
  }
  return session;
}

export async function requireQuoteManagerAction(): Promise<StaffSession> {
  const session = await requireStaffAction();
  if (!session.canManageQuotes) {
    throw new StaffAuthError("Você não tem permissão para gerenciar orçamentos.");
  }
  return session;
}

// =============================================================================
// SEGMENTOS - usado no seletor do formulário de fórmula.
// =============================================================================

export interface AdminSegmentDTO {
  id: string;
  slug: string;
  name: string;
  sortOrder: number;
  active: boolean;
}

export async function getAdminSegments(): Promise<AdminSegmentDTO[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("segments")
    .select("id, slug, name, sort_order, active")
    .is("deleted_at", null)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(`Falha ao carregar segmentos: ${error.message}`);

  return (data ?? []).map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    sortOrder: row.sort_order,
    active: row.active,
  }));
}

// =============================================================================
// LINHAS DO CATÁLOGO - liga/desliga das abas Premium, Econômica e Lemon Caps.
// =============================================================================

export interface AdminCatalogLineDTO {
  line: ToggleableLine;
  enabled: boolean;
  /** Fórmulas ativas da linha (as que aparecem quando a linha está ligada). */
  activeCount: number;
}

export async function getAdminCatalogLines(): Promise<AdminCatalogLineDTO[]> {
  const supabase = await createClient();
  const [linesResult, formulasResult] = await Promise.all([
    supabase.from("catalog_lines").select("line, enabled"),
    supabase.from("formulas").select("line").eq("active", true).is("deleted_at", null),
  ]);

  // Tabela ainda inexistente ou leitura falhou: o painel mostra as duas linhas
  // como ligadas (o que o site público também faz nesse caso) em vez de quebrar a
  // página inteira do Catálogo.
  if (linesResult.error) {
    console.error("[getAdminCatalogLines] falha ao consultar public.catalog_lines:", {
      message: linesResult.error.message,
      code: linesResult.error.code,
    });
  }
  if (formulasResult.error) throw new Error(`Falha ao contar fórmulas por linha: ${formulasResult.error.message}`);

  const enabledByLine = new Map((linesResult.data ?? []).map((row) => [row.line, row.enabled] as const));
  const countByLine = new Map<string, number>();
  for (const row of formulasResult.data ?? []) countByLine.set(row.line, (countByLine.get(row.line) ?? 0) + 1);

  return TOGGLEABLE_LINES.map((line) => ({
    line,
    enabled: enabledByLine.get(line) ?? true,
    activeCount: countByLine.get(line) ?? 0,
  }));
}

// =============================================================================
// FÓRMULAS - lista e detalhe (para /admin/catalogo).
// =============================================================================

export type ProductLine = Enums<"product_line">;
export type ProductFormat = Enums<"product_format">;
export type CompositionUnit = Enums<"composition_unit">;

export interface AdminFormulaListItemDTO {
  id: string;
  slug: string;
  name: string;
  segmentId: string;
  segmentName: string;
  line: ProductLine;
  format: ProductFormat;
  active: boolean;
  listPriceCents: number | null;
  sortOrder: number;
  updatedAt: string;
  /** Destaque do catálogo (migration 20260916143000). null = não é destaque. */
  featuredAt: string | null;
  /** Foto real do pote. null = a vitrine cai para a faixa colorida do segmento. */
  mockupPath: string | null;
  /** Selo de conformidade Anvisa. null = composição ainda não conferida. */
  complianceVerifiedAt: string | null;
  // Os dois campos de rótulo entram na lista como SIM/NÃO, e não como texto: a
  // tela só precisa saber se a pendência existe, e trafegar o texto inteiro das
  // advertências e da lista de ingredientes de 27 fórmulas para depois jogá-lo
  // fora seria carregar quilobytes à toa. Texto em branco conta como ausente
  // tanto quanto NULL - é a mesma régua do painel de visão geral
  // (lib/data/admin-dashboard.ts), para as duas telas nunca discordarem sobre
  // o que é uma pendência.
  hasIngredientsList: boolean;
  hasWarnings: boolean;
}

/** Texto de banco só conta como preenchido quando tem conteúdo de verdade. */
function isFilled(value: string | null): boolean {
  return value !== null && value.trim() !== "";
}

export interface AdminFormulaFilters {
  search?: string;
  activeFilter?: "all" | "active" | "inactive";
  segmentId?: string;
}

export async function getAdminFormulas(filters: AdminFormulaFilters = {}): Promise<AdminFormulaListItemDTO[]> {
  const supabase = await createClient();
  let query = supabase
    .from("formulas")
    .select(
      "id, slug, name, segment_id, line, format, active, list_price_cents, sort_order, updated_at, featured_at, mockup_path, compliance_verified_at, ingredients_list, warnings, segments(name)",
    )
    .is("deleted_at", null)
    // Exatamente a mesma cascata da vitrine (ver lib/data/formulas.ts): destaque
    // primeiro, mais recente na frente; depois a ordenação manual; e o nome como
    // desempate estável. A lista do admin mostrar uma ordem e o cliente ver outra
    // seria a receita para "mas eu destaquei e não subiu".
    .order("featured_at", { ascending: false, nullsFirst: false })
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (filters.activeFilter === "active") query = query.eq("active", true);
  if (filters.activeFilter === "inactive") query = query.eq("active", false);
  if (filters.segmentId) query = query.eq("segment_id", filters.segmentId);
  if (filters.search && filters.search.trim() !== "") {
    query = query.ilike("name", `%${filters.search.trim()}%`);
  }

  const { data, error } = await query;
  if (error) throw new Error(`Falha ao carregar fórmulas: ${error.message}`);

  return (data ?? []).map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    segmentId: row.segment_id,
    segmentName: row.segments?.name ?? "(segmento removido)",
    line: row.line,
    format: row.format,
    active: row.active,
    listPriceCents: row.list_price_cents,
    sortOrder: row.sort_order,
    updatedAt: row.updated_at,
    featuredAt: row.featured_at,
    mockupPath: row.mockup_path,
    complianceVerifiedAt: row.compliance_verified_at,
    hasIngredientsList: isFilled(row.ingredients_list),
    hasWarnings: isFilled(row.warnings),
  }));
}

// Quantos destaques existem hoje, e sobre que universo. Consulta separada de
// getAdminFormulas de propósito: o aviso de "destaque demais" fala do CATÁLOGO
// inteiro, não da página filtrada. Contar as linhas que o filtro deixou na tela
// diria "1 destaque" logo depois de buscar por um nome - e o dono acharia que
// apagou os outros.
export interface AdminFeaturedSummaryDTO {
  /** Fórmulas ativas marcadas como destaque - as que o cliente realmente vê na frente. */
  featuredCount: number;
  /** Universo em que isso é medido: fórmulas ativas. */
  activeCount: number;
}

export async function getAdminFeaturedSummary(): Promise<AdminFeaturedSummaryDTO> {
  const supabase = await createClient();
  // head: true - o PostgREST devolve só o Content-Range, sem trafegar linha
  // nenhuma (mesma técnica das contagens do painel de visão geral).
  const [featuredResult, activeResult] = await Promise.all([
    supabase
      .from("formulas")
      .select("id", { count: "exact", head: true })
      .eq("active", true)
      .is("deleted_at", null)
      .not("featured_at", "is", null),
    supabase.from("formulas").select("id", { count: "exact", head: true }).eq("active", true).is("deleted_at", null),
  ]);

  if (featuredResult.error) throw new Error(`Falha ao contar destaques: ${featuredResult.error.message}`);
  if (activeResult.error) throw new Error(`Falha ao contar fórmulas ativas: ${activeResult.error.message}`);

  return { featuredCount: featuredResult.count ?? 0, activeCount: activeResult.count ?? 0 };
}

export interface AdminCompositionLineDTO {
  id: string;
  ingredientName: string;
  quantity: number;
  unit: CompositionUnit;
  sortOrder: number;
  ingredientId: string | null;
}

// Todos os campos que o editor de fórmula cobre (ver CLAUDE.md da tarefa,
// item 3) - mapeados 1:1 para as colunas reais de public.formulas
// (supabase/migrations/20260909210000_schema.sql). Os 3 campos de
// conformidade ANVISA (compliance_verified_at/norms/source, adicionados em
// 20260914000000_conformidade.sql) ficam FORA deste editor de propósito: são
// geridos por auditoria documentada à parte (ver comentário da migration) e
// nunca são reescritos por esta camada - nenhuma função abaixo lê nem grava
// essas 3 colunas, então uma edição feita aqui nunca as apaga por acidente.
//
// Os 12 campos de embalagem e logística vêm de PackagingSpec
// (lib/catalog/packaging.ts) - o MESMO tipo que o catálogo público usa, para o
// editor e a vitrine nunca divergirem sobre quais campos existem.
export interface AdminFormulaDetailDTO extends PackagingSpec {
  id: string;
  slug: string;
  name: string;
  segmentId: string;
  line: ProductLine;
  format: ProductFormat;
  regulatoryProductType: string | null;
  poteContentsDescription: string | null;
  netWeight: string | null;
  description: string;
  nutritionalInfo: string | null;
  ingredientsList: string | null;
  usageInstructions: string | null;
  benefits: string[];
  generalBenefitsSummary: string | null;
  warnings: string | null;
  targetAudience: string | null;
  storageInstructions: string | null;
  technicalSheetTitle: string | null;
  listPriceCents: number | null;
  minimumOrderPotes: number;
  sortOrder: number;
  active: boolean;
  version: number;
  technicalSheetVersion: number;
  compositions: AdminCompositionLineDTO[];
  cost: { unitCostCents: number | null; internalNotes: string | null } | null;
  // Tabela de Informação Nutricional estruturada (formulas.metadata->tabela_nutricional),
  // lida com a MESMA função que o dossiê público usa (readNutritionTable, em
  // lib/catalog/nutrition-table.ts) - null quando a fórmula ainda não tem a
  // tabela estruturada (só o texto livre em nutritionalInfo, acima). O editor
  // (NutritionTableEditor) usa isto para semear o formulário; a Server Action
  // que grava (updateNutritionTable, lib/actions/formulas.ts) é quem decide o
  // que entra em metadata a partir daqui em diante.
  nutritionTable: NutritionTable | null;
}

const ADMIN_FORMULA_COLUMNS =
  "id, slug, name, segment_id, line, format, regulatory_product_type, pote_contents_description, net_weight, description, nutritional_info, ingredients_list, usage_instructions, benefits, general_benefits_summary, warnings, target_audience, storage_instructions, technical_sheet_title, list_price_cents, minimum_order_potes, sort_order, active, version, technical_sheet_version, ean13, dun14, shelf_life_months, gross_weight_g, package_height_mm, package_width_mm, package_depth_mm, units_per_box, box_height_mm, box_width_mm, box_depth_mm, box_gross_weight_g, metadata";

export async function getAdminFormulaById(id: string): Promise<AdminFormulaDetailDTO | null> {
  const supabase = await createClient();

  const [formulaResult, compositionsResult, costResult] = await Promise.all([
    supabase.from("formulas").select(ADMIN_FORMULA_COLUMNS).eq("id", id).is("deleted_at", null).maybeSingle(),
    supabase
      .from("formula_compositions")
      .select("id, ingredient_name, quantity, unit, sort_order, ingredient_id")
      .eq("formula_id", id)
      .is("deleted_at", null)
      .order("sort_order", { ascending: true }),
    supabase.from("formula_costs").select("unit_cost_cents, internal_notes").eq("formula_id", id).is("deleted_at", null).maybeSingle(),
  ]);

  if (formulaResult.error) throw new Error(`Falha ao carregar fórmula: ${formulaResult.error.message}`);
  if (!formulaResult.data) return null;
  if (compositionsResult.error) throw new Error(`Falha ao carregar composição: ${compositionsResult.error.message}`);

  const row = formulaResult.data;
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    segmentId: row.segment_id,
    line: row.line,
    format: row.format,
    regulatoryProductType: row.regulatory_product_type,
    poteContentsDescription: row.pote_contents_description,
    netWeight: row.net_weight,
    description: row.description,
    nutritionalInfo: row.nutritional_info,
    ingredientsList: row.ingredients_list,
    usageInstructions: row.usage_instructions,
    benefits: row.benefits ?? [],
    generalBenefitsSummary: row.general_benefits_summary,
    warnings: row.warnings,
    targetAudience: row.target_audience,
    storageInstructions: row.storage_instructions,
    technicalSheetTitle: row.technical_sheet_title,
    listPriceCents: row.list_price_cents,
    minimumOrderPotes: row.minimum_order_potes,
    sortOrder: row.sort_order,
    active: row.active,
    version: row.version,
    technicalSheetVersion: row.technical_sheet_version,
    ean13: row.ean13,
    dun14: row.dun14,
    shelfLifeMonths: row.shelf_life_months,
    grossWeightG: row.gross_weight_g,
    packageHeightMm: row.package_height_mm,
    packageWidthMm: row.package_width_mm,
    packageDepthMm: row.package_depth_mm,
    unitsPerBox: row.units_per_box,
    boxHeightMm: row.box_height_mm,
    boxWidthMm: row.box_width_mm,
    boxDepthMm: row.box_depth_mm,
    boxGrossWeightG: row.box_gross_weight_g,
    compositions: (compositionsResult.data ?? []).map((c) => ({
      id: c.id,
      ingredientName: c.ingredient_name,
      quantity: c.quantity,
      unit: c.unit,
      sortOrder: c.sort_order,
      ingredientId: c.ingredient_id,
    })),
    cost: costResult.data ? { unitCostCents: costResult.data.unit_cost_cents, internalNotes: costResult.data.internal_notes } : null,
    nutritionTable: readNutritionTable(row.metadata),
  };
}

// =============================================================================
// ASSINATURA DA FICHA TÉCNICA - histórico de aprovações do responsável técnico
// (public.formula_sheet_approvals, migration 20260916000000).
// =============================================================================

export interface AdminSheetApprovalDTO {
  id: string;
  sheetVersion: number;
  approvedByName: string;
  approvedByLicense: string;
  approvedAt: string;
  // Observação interna da aprovação: o staff logado lê, o público NÃO (o papel
  // anon não tem privilégio de SELECT nesta coluna - grant por coluna na migration).
  notes: string | null;
}

// Histórico completo de uma fórmula, da aprovação mais recente para a mais antiga.
// Não há função de editar nem de apagar aprovação nesta camada, e isso é o desenho:
// aprovação é registro histórico, aprovar de novo cria linha nova. A trava não é a
// ausência de código - é o banco (o papel authenticated só tem SELECT e INSERT nesta
// tabela, e não existe policy de UPDATE nem de DELETE).
export async function getFormulaSheetApprovals(formulaId: string): Promise<AdminSheetApprovalDTO[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("formula_sheet_approvals")
    .select("id, sheet_version, approved_by_name, approved_by_license, approved_at, notes")
    .eq("formula_id", formulaId)
    .is("deleted_at", null)
    .order("approved_at", { ascending: false });

  if (error) throw new Error(`Falha ao carregar aprovações da ficha: ${error.message}`);

  return (data ?? []).map((row) => ({
    id: row.id,
    sheetVersion: row.sheet_version,
    approvedByName: row.approved_by_name,
    approvedByLicense: row.approved_by_license,
    approvedAt: row.approved_at,
    notes: row.notes,
  }));
}

// =============================================================================
// CUSTOS - /admin/custos. Tabela 100% privada (public.formula_costs); esta
// função só é chamada por telas atrás de requireStaffPage/requireStaffAction.
// =============================================================================

export interface AdminFormulaCostListItemDTO {
  formulaId: string;
  formulaName: string;
  listPriceCents: number | null;
  unitCostCents: number | null;
  internalNotes: string | null;
}

// internalNotes entrou aqui (26/09) para a tela em lote (custos/page.tsx +
// CostsBatchTable) poder editar a nota interna linha a linha sem precisar
// abrir o formulário individual - antes só getAdminFormulaById trazia esse
// campo. Mesma tabela 100% privada de sempre (formula_costs); nenhuma
// exposição nova, só mais uma coluna da MESMA consulta que já existia.
export async function getAdminFormulaCostsList(): Promise<AdminFormulaCostListItemDTO[]> {
  const supabase = await createClient();
  const [formulasResult, costsResult] = await Promise.all([
    supabase.from("formulas").select("id, name, list_price_cents").is("deleted_at", null).order("sort_order", { ascending: true }),
    supabase.from("formula_costs").select("formula_id, unit_cost_cents, internal_notes").is("deleted_at", null),
  ]);

  if (formulasResult.error) throw new Error(`Falha ao carregar fórmulas: ${formulasResult.error.message}`);
  if (costsResult.error) throw new Error(`Falha ao carregar custos: ${costsResult.error.message}`);

  const costByFormula = new Map(
    (costsResult.data ?? []).map((row) => [row.formula_id, { unitCostCents: row.unit_cost_cents, internalNotes: row.internal_notes }]),
  );

  return (formulasResult.data ?? []).map((row) => {
    const cost = costByFormula.get(row.id);
    return {
      formulaId: row.id,
      formulaName: row.name,
      listPriceCents: row.list_price_cents,
      unitCostCents: cost?.unitCostCents ?? null,
      internalNotes: cost?.internalNotes ?? null,
    };
  });
}

// =============================================================================
// INSUMOS (ingredients) - lista, detalhe e seletor para o editor de composição.
// =============================================================================

export type IngredientCategory = Enums<"ingredient_category">;

export interface AdminIngredientListItemDTO {
  id: string;
  slug: string;
  name: string;
  category: IngredientCategory;
  active: boolean;
  hasClaim: boolean;
  sortOrder: number;
}

export interface AdminIngredientFilters {
  search?: string;
  category?: IngredientCategory;
}

export async function getAdminIngredients(filters: AdminIngredientFilters = {}): Promise<AdminIngredientListItemDTO[]> {
  const supabase = await createClient();
  let query = supabase
    .from("ingredients")
    .select("id, slug, name, category, active, claim_text, sort_order")
    .is("deleted_at", null)
    .order("sort_order", { ascending: true });

  if (filters.category) query = query.eq("category", filters.category);
  if (filters.search && filters.search.trim() !== "") {
    query = query.ilike("name", `%${filters.search.trim()}%`);
  }

  const { data, error } = await query;
  if (error) throw new Error(`Falha ao carregar insumos: ${error.message}`);

  return (data ?? []).map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    active: row.active,
    hasClaim: Boolean(row.claim_text && row.claim_text.trim() !== ""),
    sortOrder: row.sort_order,
  }));
}

export interface AdminIngredientDetailDTO {
  id: string;
  slug: string;
  name: string;
  category: IngredientCategory;
  description: string | null;
  imagePath: string | null;
  synonyms: string[];
  claimText: string | null;
  claimSource: string | null;
  claimMinAmount: number | null;
  claimVerifiedAt: string | null;
  active: boolean;
  sortOrder: number;
}

export async function getAdminIngredientById(id: string): Promise<AdminIngredientDetailDTO | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ingredients")
    .select(
      "id, slug, name, category, description, image_path, synonyms, claim_text, claim_source, claim_min_amount, claim_verified_at, active, sort_order",
    )
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) throw new Error(`Falha ao carregar insumo: ${error.message}`);
  if (!data) return null;

  return {
    id: data.id,
    slug: data.slug,
    name: data.name,
    category: data.category,
    description: data.description,
    imagePath: data.image_path,
    synonyms: data.synonyms ?? [],
    claimText: data.claim_text,
    claimSource: data.claim_source,
    claimMinAmount: data.claim_min_amount,
    claimVerifiedAt: data.claim_verified_at,
    active: data.active,
    sortOrder: data.sort_order,
  };
}

export interface IngredientPickerOptionDTO {
  id: string;
  name: string;
}

// Lista enxuta (só id + nome) para o <select> do editor de composição - nunca
// os 70 insumos completos com todos os campos de alegação.
export async function getIngredientsForPicker(): Promise<IngredientPickerOptionDTO[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ingredients")
    .select("id, name")
    .eq("active", true)
    .is("deleted_at", null)
    .order("name", { ascending: true });

  if (error) throw new Error(`Falha ao carregar lista de insumos: ${error.message}`);
  return data ?? [];
}

// =============================================================================
// LEADS - /admin/leads.
// =============================================================================

export interface AdminLeadCartItemSnapshot {
  formulaId: string;
  name: string;
  quantityPotes: number;
  /** null = preço sob consulta. */
  unitPriceCents: number | null;
}

export interface AdminLeadDTO {
  id: string;
  name: string;
  whatsapp: string;
  cartSnapshot: AdminLeadCartItemSnapshot[];
  createdAt: string;
}

// cart_snapshot é jsonb livre (gravado por lib/cart/submit-quote.ts, formato
// [{formula_id, name, quantity_potes, unit_price_cents}, ...]) - lido aqui
// sem confiar no formato (regra de validação nas bordas): qualquer item fora
// do esperado é descartado da lista em vez de quebrar a tela inteira.
function parseCartSnapshot(raw: unknown): AdminLeadCartItemSnapshot[] {
  if (!Array.isArray(raw)) return [];
  const items: AdminLeadCartItemSnapshot[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const item = entry as Record<string, unknown>;
    if (
      typeof item.formula_id === "string" &&
      typeof item.name === "string" &&
      typeof item.quantity_potes === "number" &&
      (typeof item.unit_price_cents === "number" || item.unit_price_cents === null)
    ) {
      items.push({
        formulaId: item.formula_id,
        name: item.name,
        quantityPotes: item.quantity_potes,
        unitPriceCents: item.unit_price_cents,
      });
    }
  }
  return items;
}

export async function getAdminLeads(search?: string): Promise<AdminLeadDTO[]> {
  const supabase = await createClient();
  let query = supabase
    .from("leads")
    .select("id, name, whatsapp, cart_snapshot, created_at")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(200); // teto defensivo - sem paginação nesta primeira versão da tela

  if (search && search.trim() !== "") {
    // Mesma sanitização da busca de orçamentos: o termo entra na linguagem de
    // filtro do PostgREST, não em SQL, e ali vírgula e ponto são sintaxe.
    const term = sanitizarTermoBusca(search);
    if (term !== "") {
      query = query.or(`name.ilike.%${term}%,whatsapp.ilike.%${term}%`);
    }
  }

  const { data, error } = await query;
  if (error) throw new Error(`Falha ao carregar leads: ${error.message}`);

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    whatsapp: row.whatsapp,
    cartSnapshot: parseCartSnapshot(row.cart_snapshot),
    createdAt: row.created_at,
  }));
}

// =============================================================================
// ORÇAMENTOS - /admin/orcamentos (exige can_manage_quotes, conferido na page).
// Extraído para lib/data/admin-quotes.ts (este arquivo passava de 800 linhas
// com a listagem geral + filtros + exportação do item 1-5 da tarefa) -
// reexportado aqui para nenhum import existente (`@/lib/data/admin`) precisar
// mudar.
// =============================================================================

export type {
  AdminQuoteDetailDTO,
  AdminQuoteExportRowDTO,
  AdminQuoteItemDTO,
  AdminQuoteListItemDTO,
  AdminQuotesPage,
  QuoteFilters,
  QuoteStatus,
} from "@/lib/data/admin-quotes";
export { getAdminQuoteById, getAdminQuotes, getAdminQuotesForExport } from "@/lib/data/admin-quotes";

// =============================================================================
// DASHBOARD - /admin. Extraído para lib/data/admin-dashboard.ts quando deixou
// de ser "duas contagens" e virou métricas + pendências do catálogo - mesma
// razão e mesmo padrão do bloco de orçamentos acima. Reexportado aqui para
// nenhum import existente (`@/lib/data/admin`) precisar mudar.
// =============================================================================

export type { AdminDashboardDTO, AdminDashboardPendenciaDTO, PendenciaSeveridade } from "@/lib/data/admin-dashboard";
export { getAdminDashboard } from "@/lib/data/admin-dashboard";
