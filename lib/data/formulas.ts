import "server-only";

// Camada de acesso a dados do catálogo PÚBLICO. Só roda no servidor (nunca
// entra no bundle do cliente, por causa do "server-only" acima). Devolve DTOs
// já tipados, só com campos que o visitante pode ver — NUNCA consulta
// `formula_costs` (bloqueada por RLS de qualquer forma, mas a regra vale
// também aqui: nem tentamos).
import { createClient } from "@supabase/supabase-js";
import { revalidateTag, unstable_cache } from "next/cache";

import type { Database, Enums } from "@/lib/supabase/database.types";

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

// ---------------------------------------------------------------------------
// Cliente Supabase dedicado a esta leitura (público, sem sessão)
// ---------------------------------------------------------------------------
// Por que não reaproveitar createClient() de lib/supabase/server.ts aqui: aquele
// client lê cookies() (Next 16, assíncrono) para manter sessão de staff. O Next
// não permite acessar cookies()/headers() dentro do escopo de uma função
// envolvida por unstable_cache — "Accessing uncached data sources such as
// headers or cookies inside a cache scope is not supported"
// (node_modules/next/dist/docs/01-app/03-api-reference/04-functions/unstable_cache.md).
// Confirmado na prática: essa combinação quebra o cache.
//
// Isso não muda o resultado para ninguém: as três queries abaixo já filtram
// "active and deleted_at is null" explicitamente (não dependem da RLS liberar
// linhas extras para staff autenticado — ver supabase/migrations/20260909210001_rls_policies.sql,
// políticas *_select), então um client anônimo simples devolve exatamente os
// mesmos dados que o client com cookie devolveria para este caso de uso.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

function getAnonCatalogClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
      "Configuração do Supabase ausente: defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    );
  }
  return createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
  });
}

// ---------------------------------------------------------------------------
// Busca real no banco (sem cache) — cada query loga o próprio erro antes de
// propagar, com contexto suficiente para achar a causa no log do servidor sem
// expor nada disso ao visitante (quem decide o que aparece na tela é
// app/catalogo/error.tsx).
// ---------------------------------------------------------------------------
async function fetchCatalogDataFromDatabase(): Promise<CatalogData> {
  const supabase = getAnonCatalogClient();

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
    console.error("[getCatalogData] falha ao consultar public.segments:", {
      message: segmentsResult.error.message,
      code: segmentsResult.error.code,
      details: segmentsResult.error.details,
      hint: segmentsResult.error.hint,
    });
    throw new Error(`Falha ao carregar segmentos do catálogo: ${segmentsResult.error.message}`);
  }
  if (formulasResult.error) {
    console.error("[getCatalogData] falha ao consultar public.formulas:", {
      message: formulasResult.error.message,
      code: formulasResult.error.code,
      details: formulasResult.error.details,
      hint: formulasResult.error.hint,
    });
    throw new Error(`Falha ao carregar fórmulas do catálogo: ${formulasResult.error.message}`);
  }
  if (compositionsResult.error) {
    console.error("[getCatalogData] falha ao consultar public.formula_compositions:", {
      message: compositionsResult.error.message,
      code: compositionsResult.error.code,
      details: compositionsResult.error.details,
      hint: compositionsResult.error.hint,
    });
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

  // Catálogo genuinamente vazio (zero fórmulas ativas) não é erro: devolve
  // normalmente. Quem decide mostrar o EmptyState é o CatalogView.
  return { segments, formulas };
}

// ---------------------------------------------------------------------------
// Cache dos dados do catálogo
// ---------------------------------------------------------------------------
// Modelo "Previous Model" do Next 16 — este projeto não liga `cacheComponents`
// em next.config.ts (confirmado no arquivo real e em
// lemoncaps-catalogo-planejamento/next16-o-que-muda.md, seção 3). Nesse modelo
// `unstable_cache` continua sendo o caminho certo para cachear uma função que
// não usa `fetch` (aqui é query direta ao Postgres via @supabase/supabase-js) —
// node_modules/next/dist/docs/01-app/02-guides/caching-without-cache-components.md,
// seção "`unstable_cache` for non-`fetch` functions".
//
// Revalidação por tempo: 5 minutos. O catálogo muda só quando o admin edita
// (raro) — não faz sentido consultar o banco a cada visita.
//
// Tag para invalidação sob demanda: exportada como CATALOG_CACHE_TAG e com o
// helper revalidateCatalogCache() abaixo, prontos para quando existir uma
// Server Function de admin que grave em formulas/segments/formula_compositions
// (fora do escopo desta tarefa) — ela deve chamar revalidateCatalogCache() logo
// após o INSERT/UPDATE. O Next 16 passou a exigir o segundo argumento de
// revalidateTag (o "profile" de cacheLife); "max" é o recomendado pela doc para
// conteúdo tipo catálogo, onde servir uma versão levemente desatualizada por
// instantes enquanto revalida em segundo plano é aceitável
// (node_modules/next/dist/docs/01-app/03-api-reference/04-functions/revalidateTag.md).
export const CATALOG_CACHE_TAG = "catalog";
const CATALOG_REVALIDATE_SECONDS = 300;

const getCachedCatalogData = unstable_cache(fetchCatalogDataFromDatabase, ["lemoncaps", "catalog-data"], {
  tags: [CATALOG_CACHE_TAG],
  revalidate: CATALOG_REVALIDATE_SECONDS,
});

export function revalidateCatalogCache(): void {
  revalidateTag(CATALOG_CACHE_TAG, "max");
}

// Busca as 28 fórmulas, TODAS as composições (uma query só) e os segmentos, em
// paralelo (dentro de fetchCatalogDataFromDatabase, cacheada por 5 minutos —
// ver acima). Composições são agrupadas por formula_id em memória — nada de
// N+1 (uma query por fórmula). Fonte única: as tabelas públicas do catálogo.
//
// Resiliência: qualquer falha (consulta ao banco, configuração ausente, rede)
// é registrada aqui com console.error e relançada como erro de mensagem sóbria
// — quem decide o que o visitante vê é app/catalogo/error.tsx (error boundary
// da rota, convenção do Next App Router). Nunca deixa a mensagem/stack técnica
// vazar para além do log do servidor.
export async function getCatalogData(): Promise<CatalogData> {
  try {
    return await getCachedCatalogData();
  } catch (error) {
    console.error("[getCatalogData] catálogo indisponível:", error);
    throw new Error("Catálogo temporariamente indisponível.");
  }
}
