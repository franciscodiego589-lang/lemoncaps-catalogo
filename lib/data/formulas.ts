import "server-only";

// Camada de acesso a dados do catálogo PÚBLICO. Só roda no servidor (nunca
// entra no bundle do cliente, por causa do "server-only" acima). Devolve DTOs
// já tipados, só com campos que o visitante pode ver — NUNCA consulta
// `formula_costs` (bloqueada por RLS de qualquer forma, mas a regra vale
// também aqui: nem tentamos).
import { createClient } from "@/lib/supabase/server";
import type { Enums } from "@/lib/supabase/database.types";

export type ProductLine = Enums<"product_line">;
export type ProductFormat = Enums<"product_format">;
export type CompositionUnit = Enums<"composition_unit">;

export interface FormulaCompositionDTO {
  id: string;
  ingredientName: string;
  quantity: number;
  unit: CompositionUnit;
  sortOrder: number;
}

export interface FormulaDTO {
  id: string;
  slug: string;
  name: string;
  segmentId: string;
  line: ProductLine;
  format: ProductFormat;
  regulatoryProductType: string | null;
  poteContentsDescription: string | null;
  description: string | null;
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
  compositions: FormulaCompositionDTO[];
}

export interface SegmentDTO {
  id: string;
  slug: string;
  name: string;
  sortOrder: number;
}

export interface CatalogData {
  segments: SegmentDTO[];
  formulas: FormulaDTO[];
}

// Vazio -> undefined/null nunca vira "" fantasma na tela; normaliza aqui, uma
// vez só, em vez de repetir a checagem em cada componente.
function emptyToNull(value: string | null): string | null {
  return value && value.trim().length > 0 ? value : null;
}

const FORMULA_COLUMNS =
  "id, slug, name, segment_id, line, format, regulatory_product_type, pote_contents_description, description, nutritional_info, ingredients_list, usage_instructions, benefits, general_benefits_summary, warnings, target_audience, storage_instructions, technical_sheet_title, list_price_cents, minimum_order_potes, sort_order";

const COMPOSITION_COLUMNS = "id, formula_id, ingredient_name, quantity, unit, sort_order";

const SEGMENT_COLUMNS = "id, slug, name, sort_order";

// Busca as 28 fórmulas, TODAS as composições (uma query só) e os segmentos,
// em paralelo. Composições são agrupadas por formula_id em memória — nada de
// N+1 (uma query por fórmula). Fonte única: as tabelas públicas do catálogo.
export async function getCatalogData(): Promise<CatalogData> {
  const supabase = await createClient();

  const [segmentsResult, formulasResult, compositionsResult] = await Promise.all([
    supabase
      .from("segments")
      .select(SEGMENT_COLUMNS)
      .eq("active", true)
      .is("deleted_at", null)
      .order("sort_order", { ascending: true }),
    supabase
      .from("formulas")
      .select(FORMULA_COLUMNS)
      .eq("active", true)
      .is("deleted_at", null)
      .order("sort_order", { ascending: true }),
    supabase
      .from("formula_compositions")
      .select(COMPOSITION_COLUMNS)
      .eq("active", true)
      .is("deleted_at", null)
      .order("sort_order", { ascending: true }),
  ]);

  if (segmentsResult.error) {
    throw new Error(`Falha ao carregar segmentos do catálogo: ${segmentsResult.error.message}`);
  }
  if (formulasResult.error) {
    throw new Error(`Falha ao carregar fórmulas do catálogo: ${formulasResult.error.message}`);
  }
  if (compositionsResult.error) {
    throw new Error(`Falha ao carregar composições do catálogo: ${compositionsResult.error.message}`);
  }

  const compositionsByFormula = new Map<string, FormulaCompositionDTO[]>();
  for (const row of compositionsResult.data) {
    const list = compositionsByFormula.get(row.formula_id) ?? [];
    compositionsByFormula.set(row.formula_id, [
      ...list,
      {
        id: row.id,
        ingredientName: row.ingredient_name,
        quantity: row.quantity,
        unit: row.unit,
        sortOrder: row.sort_order,
      },
    ]);
  }

  const formulas: FormulaDTO[] = formulasResult.data.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    segmentId: row.segment_id,
    line: row.line,
    format: row.format,
    regulatoryProductType: emptyToNull(row.regulatory_product_type),
    poteContentsDescription: emptyToNull(row.pote_contents_description),
    description: emptyToNull(row.description),
    nutritionalInfo: emptyToNull(row.nutritional_info),
    ingredientsList: emptyToNull(row.ingredients_list),
    usageInstructions: emptyToNull(row.usage_instructions),
    benefits: row.benefits ?? [],
    generalBenefitsSummary: emptyToNull(row.general_benefits_summary),
    warnings: emptyToNull(row.warnings),
    targetAudience: emptyToNull(row.target_audience),
    storageInstructions: emptyToNull(row.storage_instructions),
    technicalSheetTitle: emptyToNull(row.technical_sheet_title),
    listPriceCents: row.list_price_cents,
    minimumOrderPotes: row.minimum_order_potes,
    sortOrder: row.sort_order,
    compositions: compositionsByFormula.get(row.id) ?? [],
  }));

  const segments: SegmentDTO[] = segmentsResult.data.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    sortOrder: row.sort_order,
  }));

  return { segments, formulas };
}
