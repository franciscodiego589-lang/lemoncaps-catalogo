import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import type { Enums } from "@/lib/supabase/database.types";

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
    .select("id, slug, name, segment_id, line, format, active, list_price_cents, sort_order, updated_at, segments(name)")
    .is("deleted_at", null)
    .order("sort_order", { ascending: true });

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
  }));
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
export interface AdminFormulaDetailDTO {
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
  compositions: AdminCompositionLineDTO[];
  cost: { unitCostCents: number | null; internalNotes: string | null } | null;
}

const ADMIN_FORMULA_COLUMNS =
  "id, slug, name, segment_id, line, format, regulatory_product_type, pote_contents_description, net_weight, description, nutritional_info, ingredients_list, usage_instructions, benefits, general_benefits_summary, warnings, target_audience, storage_instructions, technical_sheet_title, list_price_cents, minimum_order_potes, sort_order, active, version";

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
    compositions: (compositionsResult.data ?? []).map((c) => ({
      id: c.id,
      ingredientName: c.ingredient_name,
      quantity: c.quantity,
      unit: c.unit,
      sortOrder: c.sort_order,
      ingredientId: c.ingredient_id,
    })),
    cost: costResult.data ? { unitCostCents: costResult.data.unit_cost_cents, internalNotes: costResult.data.internal_notes } : null,
  };
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
}

export async function getAdminFormulaCostsList(): Promise<AdminFormulaCostListItemDTO[]> {
  const supabase = await createClient();
  const [formulasResult, costsResult] = await Promise.all([
    supabase.from("formulas").select("id, name, list_price_cents").is("deleted_at", null).order("sort_order", { ascending: true }),
    supabase.from("formula_costs").select("formula_id, unit_cost_cents").is("deleted_at", null),
  ]);

  if (formulasResult.error) throw new Error(`Falha ao carregar fórmulas: ${formulasResult.error.message}`);
  if (costsResult.error) throw new Error(`Falha ao carregar custos: ${costsResult.error.message}`);

  const costByFormula = new Map((costsResult.data ?? []).map((row) => [row.formula_id, row.unit_cost_cents]));

  return (formulasResult.data ?? []).map((row) => ({
    formulaId: row.id,
    formulaName: row.name,
    listPriceCents: row.list_price_cents,
    unitCostCents: costByFormula.get(row.id) ?? null,
  }));
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
  unitPriceCents: number;
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
      typeof item.unit_price_cents === "number"
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
    const term = search.trim();
    query = query.or(`name.ilike.%${term}%,whatsapp.ilike.%${term}%`);
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
// =============================================================================

export interface AdminQuoteListItemDTO {
  id: string;
  quoteNumber: number;
  customerName: string;
  customerWhatsapp: string;
  createdAt: string;
  itemCount: number;
  totalCents: number;
  totalProfitCents: number | null;
}

export async function getAdminQuotes(): Promise<AdminQuoteListItemDTO[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("quote_summaries")
    .select("quote_id, quote_number, customer_name, customer_whatsapp, created_at, item_count, total_cents, total_profit_cents")
    .order("created_at", { ascending: false })
    .limit(200); // teto defensivo - sem paginação nesta primeira versão da tela

  if (error) throw new Error(`Falha ao carregar orçamentos: ${error.message}`);

  return (data ?? [])
    .filter((row): row is typeof row & { quote_id: string; quote_number: number } => row.quote_id !== null && row.quote_number !== null)
    .map((row) => ({
      id: row.quote_id,
      quoteNumber: row.quote_number,
      customerName: row.customer_name ?? "",
      customerWhatsapp: row.customer_whatsapp ?? "",
      createdAt: row.created_at ?? "",
      itemCount: row.item_count ?? 0,
      totalCents: row.total_cents ?? 0,
      totalProfitCents: row.total_profit_cents,
    }));
}

export interface AdminQuoteItemDTO {
  id: string;
  formulaId: string;
  formulaNameSnapshot: string;
  quantityPotes: number;
  unitCostCents: number | null;
  unitPriceCents: number;
  lineTotalCents: number;
  lineCostCents: number | null;
  profitCents: number | null;
  profitMarginPct: number | null;
  sortOrder: number;
}

export interface AdminQuoteDetailDTO {
  id: string;
  quoteNumber: number;
  customerName: string;
  customerWhatsapp: string;
  createdAt: string;
  items: AdminQuoteItemDTO[];
}

export async function getAdminQuoteById(id: string): Promise<AdminQuoteDetailDTO | null> {
  const supabase = await createClient();

  const [quoteResult, itemsResult] = await Promise.all([
    supabase.from("quotes").select("id, quote_number, customer_name, customer_whatsapp, created_at").eq("id", id).is("deleted_at", null).maybeSingle(),
    supabase
      .from("quote_items")
      .select(
        "id, formula_id, formula_name_snapshot, quantity_potes, unit_cost_cents, unit_price_cents, line_total_cents, line_cost_cents, profit_cents, profit_margin_pct, sort_order",
      )
      .eq("quote_id", id)
      .is("deleted_at", null)
      .order("sort_order", { ascending: true }),
  ]);

  if (quoteResult.error) throw new Error(`Falha ao carregar orçamento: ${quoteResult.error.message}`);
  if (!quoteResult.data) return null;
  if (itemsResult.error) throw new Error(`Falha ao carregar itens do orçamento: ${itemsResult.error.message}`);

  const q = quoteResult.data;
  return {
    id: q.id,
    quoteNumber: q.quote_number,
    customerName: q.customer_name,
    customerWhatsapp: q.customer_whatsapp,
    createdAt: q.created_at,
    items: (itemsResult.data ?? []).map((item) => ({
      id: item.id,
      formulaId: item.formula_id,
      formulaNameSnapshot: item.formula_name_snapshot,
      quantityPotes: item.quantity_potes,
      unitCostCents: item.unit_cost_cents,
      unitPriceCents: item.unit_price_cents,
      // line_total_cents é coluna GERADA como quantity_potes * unit_price_cents
      // (schema.sql) - as duas entradas são NOT NULL, então o produto nunca é
      // nulo de verdade; o tipo gerado marca "number | null" de forma
      // conservadora (é bigint). ?? 0 nunca é alcançado na prática.
      lineTotalCents: item.line_total_cents ?? 0,
      lineCostCents: item.line_cost_cents,
      profitCents: item.profit_cents,
      profitMarginPct: item.profit_margin_pct,
      sortOrder: item.sort_order,
    })),
  };
}

// =============================================================================
// DASHBOARD - /admin.
// =============================================================================

export interface AdminDashboardDTO {
  activeFormulasCount: number;
  inactiveFormulasCount: number;
  recentLeads: Array<{ id: string; name: string; whatsapp: string; createdAt: string }>;
  recentQuotes: Array<{ id: string; quoteNumber: number; customerName: string; totalCents: number; createdAt: string }> | null;
}

export async function getAdminDashboard(session: StaffSession): Promise<AdminDashboardDTO> {
  const supabase = await createClient();

  const [activeCount, inactiveCount, recentLeadsResult, recentQuotesResult] = await Promise.all([
    supabase.from("formulas").select("id", { count: "exact", head: true }).eq("active", true).is("deleted_at", null),
    supabase.from("formulas").select("id", { count: "exact", head: true }).eq("active", false).is("deleted_at", null),
    supabase.from("leads").select("id, name, whatsapp, created_at").is("deleted_at", null).order("created_at", { ascending: false }).limit(5),
    session.canManageQuotes
      ? supabase
          .from("quote_summaries")
          .select("quote_id, quote_number, customer_name, total_cents, created_at")
          .order("created_at", { ascending: false })
          .limit(5)
      : Promise.resolve({ data: null, error: null }),
  ]);

  if (activeCount.error) throw new Error(`Falha ao contar fórmulas ativas: ${activeCount.error.message}`);
  if (inactiveCount.error) throw new Error(`Falha ao contar fórmulas inativas: ${inactiveCount.error.message}`);
  if (recentLeadsResult.error) throw new Error(`Falha ao carregar leads recentes: ${recentLeadsResult.error.message}`);
  if (recentQuotesResult.error) throw new Error(`Falha ao carregar orçamentos recentes: ${recentQuotesResult.error.message}`);

  return {
    activeFormulasCount: activeCount.count ?? 0,
    inactiveFormulasCount: inactiveCount.count ?? 0,
    recentLeads: (recentLeadsResult.data ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      whatsapp: row.whatsapp,
      createdAt: row.created_at,
    })),
    recentQuotes: recentQuotesResult.data
      ? recentQuotesResult.data
          .filter((row): row is typeof row & { quote_id: string; quote_number: number } => row.quote_id !== null && row.quote_number !== null)
          .map((row) => ({
            id: row.quote_id,
            quoteNumber: row.quote_number,
            customerName: row.customer_name ?? "",
            totalCents: row.total_cents ?? 0,
            createdAt: row.created_at ?? "",
          }))
      : null,
  };
}
