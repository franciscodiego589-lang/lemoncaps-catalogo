import "server-only";

// Camada de acesso a dados do catálogo PÚBLICO. Só roda no servidor (nunca
// entra no bundle do cliente, por causa do "server-only" acima). Devolve DTOs
// já tipados, só com campos que o visitante pode ver — NUNCA consulta
// `formula_costs` (bloqueada por RLS de qualquer forma, mas a regra vale
// também aqui: nem tentamos).
import { revalidateTag, unstable_cache } from "next/cache";

import { getAnonCatalogClient } from "@/lib/supabase/anon-catalog-client";
import type { Enums, Json } from "@/lib/supabase/database.types";
import type { PackagingSpec } from "@/lib/catalog/packaging";
import { readNutritionTable, type NutritionTable } from "@/lib/catalog/nutrition-table";
import { disabledLinesFromRows, withoutDisabledLines } from "@/lib/catalog/catalog-lines";

export type ProductLine = Enums<"product_line">;
export type ProductFormat = Enums<"product_format">;
export type CompositionUnit = Enums<"composition_unit">;

export interface FormulaCompositionDTO {
  id: string;
  ingredientName: string;
  quantity: number;
  unit: CompositionUnit;
  sortOrder: number;
  // Detalhe do insumo (imagem, descrição, alegação autorizada pela ANVISA):
  // vem do LEFT JOIN com public.ingredients via ingredient_id (ver
  // COMPOSITION_COLUMNS e fetchCatalogDataFromDatabase, abaixo). A ligação
  // (tabela + FK) e os 70 insumos canônicos entraram no banco em 13/09/2026 -
  // description/image_path/claim_text/claim_source nascem NULL na migration e
  // são preenchidos depois, num processo à parte (levantamento das alegações
  // junto à ANVISA). Por isso continuam podendo vir null aqui: o cartão do
  // insumo (components/catalog/IngredientCard.tsx) esconde cada bloco quando
  // o campo correspondente é null - nunca inventa texto no lugar dele.
  ingredientImagePath: string | null;
  // Texto alternativo descritivo da foto do insumo (ex.: "Frutas cítricas,
  // fonte de vitamina C"), gravado em ingredients.metadata->>'image_alt' no
  // mesmo levantamento que baixou a foto (ver public/insumos/CREDITOS.md para
  // a procedência de cada imagem: fonte, autor, licença e data). Nunca cai
  // para texto genérico tipo "imagem do insumo" - sem alt confirmado, o
  // componente usa ingredientName (nome real, nunca texto inventado).
  ingredientImageAlt: string | null;
  ingredientDescription: string | null;
  ingredientClaimText: string | null;
  ingredientClaimSource: string | null;
}

// Assinatura da ficha técnica pelo responsável técnico (public.formula_sheet_approvals,
// migration 20260916000000). O que o visitante vê é só quem assinou, com qual registro
// profissional, quando e em que versão da ficha — a coluna `notes` da tabela é
// observação interna e o papel `anon` nem tem privilégio de leitura nela (grant por
// coluna, ver a migration). Registro histórico: nunca é editado nem apagado, aprovar de
// novo cria linha nova.
export interface FormulaSheetApprovalDTO {
  id: string;
  sheetVersion: number;
  approvedByName: string;
  approvedByLicense: string;
  approvedAt: string;
}

// PackagingSpec traz os 12 campos de embalagem e logística (EAN-13, DUN-14, validade,
// peso e dimensões da unidade e da caixa) — todos opcionais e todos VAZIOS hoje nas 28
// fórmulas: o levantamento é do dono. Vive em lib/catalog/packaging.ts junto da função
// que os transforma em linhas de exibição, para a página web e os dois PDFs mostrarem
// exatamente as mesmas linhas.
export interface FormulaDTO extends PackagingSpec {
  id: string;
  slug: string;
  name: string;
  segmentId: string;
  line: ProductLine;
  format: ProductFormat;
  regulatoryProductType: string | null;
  poteContentsDescription: string | null;
  netWeight: string | null;
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
  // Destaque escolhido pelo dono no admin (migration 20260916143000). Guarda QUANDO
  // foi destacado, não um sim/não: é o carimbo que ordena os destaques entre si (o
  // mais recente na frente). null = produto comum - o card simplesmente não ganha o
  // selo, nunca um "sem destaque" escrito na tela.
  featuredAt: string | null;
  // Mockup real do pote (ver supabase/migrations/20260914120000_mockups.sql):
  // caminho público em public/produtos, gravado SÓ quando o nome ou o
  // conteúdo do rótulo confirmaram a fórmula com certeza razoável (13 das 28
  // hoje). NULL = sem foto pareada - a tela cai para a faixa colorida do
  // segmento, nunca um buraco (regra de exatidão: nunca supor qual pote e
  // qual produto).
  mockupPath: string | null;
  compositions: FormulaCompositionDTO[];
  // Selo de conformidade ANVISA (ver supabase/migrations/20260914000000_conformidade.sql
  // e lemoncaps-catalogo-planejamento/conformidade-anvisa.md). complianceVerifiedAt nulo
  // = fórmula NÃO verificada - a UI nunca deve afirmar nem sugerir conformidade nesse
  // caso, só omitir o selo (nunca mostrar aviso negativo nem espaço vazio no lugar).
  complianceVerifiedAt: string | null;
  complianceNorms: string[];
  complianceSource: string | null;
  // Versão em que a ficha técnica está hoje. Sobe por decisão de quem edita (nunca
  // sozinha a cada UPDATE) e é o número que a próxima aprovação do RT carimba.
  technicalSheetVersion: number;
  // Da mais recente para a mais antiga. Lista vazia = ficha ainda não assinada por
  // ninguém: a UI omite o bloco inteiro, nunca escreve "sem responsável técnico".
  sheetApprovals: FormulaSheetApprovalDTO[];
  // Tabela de Informação Nutricional estruturada (RDC 429/2020 + IN 75/2020),
  // lida de metadata->'tabela_nutricional' (ver lib/catalog/nutrition-table.ts
  // para o formato exato e a procedência). null = fórmula ainda sem a tabela
  // estruturada (ou metadata fora do formato esperado) - quem renderiza usa
  // nutritionalInfo (texto livre) como alternativa nesse caso, nunca uma
  // tabela vazia ou inventada.
  nutritionTable: NutritionTable | null;
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

// Prévia local dos mockups "SUA MARCA EM …" (pedido do dono, 26/10/2026: "não é
// pra publicar, somente subir as imagens e abrir"). Só com MOCKUP_PREVIA=1 no
// ambiente do `next dev` - variável que a VPS nunca recebe -, a fórmula sem
// mockup gravado no banco mostra a imagem do seu formato. Sem a variável, nada
// muda: vale o mockup_path do banco, como sempre.
const MOCKUP_PREVIA_POR_FORMATO: Record<ProductFormat, string> = {
  capsula: "/produtos/sua-marca-capsulas.webp",
  liquido: "/produtos/sua-marca-gotas.webp",
  soluvel: "/produtos/sua-marca-po.webp",
  gummy: "/produtos/sua-marca-gummy.webp",
};

function mockupDaFormula(mockupPath: string | null, format: ProductFormat): string | null {
  const gravado = emptyToNull(mockupPath);
  if (gravado || process.env.MOCKUP_PREVIA !== "1") return gravado;
  return MOCKUP_PREVIA_POR_FORMATO[format] ?? null;
}

// ingredients.metadata é jsonb livre (procedência da imagem: fonte, autor,
// licença, data - ver public/insumos/CREDITOS.md). Aqui só interessa o campo
// image_alt, lido com o mesmo cuidado de nunca confiar em formato de dado
// externo: sem checar tipo, um metadata mal formado quebraria a página
// inteira do catálogo (regra de validação nas bordas, coding-style do
// projeto). Qualquer coisa fora do formato esperado devolve null - o
// componente já sabe usar ingredientName como alternativa nesse caso.
function readImageAlt(metadata: Json | null | undefined): string | null {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) return null;
  const value = (metadata as Record<string, Json | undefined>).image_alt;
  return typeof value === "string" ? emptyToNull(value) : null;
}

const FORMULA_COLUMNS =
  "id, slug, name, segment_id, line, format, regulatory_product_type, pote_contents_description, net_weight, description, nutritional_info, ingredients_list, usage_instructions, benefits, general_benefits_summary, warnings, target_audience, storage_instructions, technical_sheet_title, list_price_cents, minimum_order_potes, sort_order, featured_at, mockup_path, compliance_verified_at, compliance_norms, compliance_source, technical_sheet_version, ean13, dun14, shelf_life_months, gross_weight_g, package_height_mm, package_width_mm, package_depth_mm, units_per_box, box_height_mm, box_width_mm, box_depth_mm, box_gross_weight_g, metadata";

// Exatamente as colunas que o papel `anon` tem privilégio de ler em
// public.formula_sheet_approvals (grant POR COLUNA na migration 20260916000000 —
// `notes` fica de fora de propósito, é observação interna). Pedir uma coluna a mais
// aqui não vazaria nada: o Postgres recusaria a consulta inteira, e o dossiê pararia de
// carregar. Ordem e conteúdo desta lista têm de espelhar aquele grant.
const SHEET_APPROVAL_COLUMNS = "id, formula_id, sheet_version, approved_by_name, approved_by_license, approved_at";

// ingredients(...) é embed de leitura via a FK formula_compositions_ingredient_id_fkey
// (ingredient_id é nullable — linha sem ligação ainda devolve ingredients: null,
// tratado abaixo). Nunca troca nem completa ingredient_name: o texto exato do
// rótulo daquela fórmula continua vindo direto da própria formula_compositions.
const COMPOSITION_COLUMNS =
  "id, formula_id, ingredient_name, quantity, unit, sort_order, ingredient_id, ingredients(description, image_path, claim_text, claim_source, metadata)";

const SEGMENT_COLUMNS = "id, slug, name, sort_order";

// O cliente Supabase anônimo desta leitura mora em
// lib/supabase/anon-catalog-client.ts desde 13/09/2026 — o banco de insumos
// (a raiz do site, ver lib/data/ingredient-bank.ts) precisava exatamente do mesmo
// client, com a mesma justificativa de não usar cookies dentro de
// unstable_cache. O porquê completo está lá, junto da função.

// ---------------------------------------------------------------------------
// Busca real no banco (sem cache) — cada query loga o próprio erro antes de
// propagar, com contexto suficiente para achar a causa no log do servidor sem
// expor nada disso ao visitante (quem decide o que aparece na tela é
// app/catalogo/error.tsx).
// ---------------------------------------------------------------------------
async function fetchCatalogDataFromDatabase(): Promise<CatalogData> {
  const supabase = getAnonCatalogClient();

  const [segmentsResult, formulasResult, compositionsResult, approvalsResult] = await Promise.all([
    supabase
      .from("segments")
      .select(SEGMENT_COLUMNS)
      .eq("active", true)
      .is("deleted_at", null)
      .order("sort_order", { ascending: true }),
    // Ordem da vitrine, em três eixos encadeados (migration 20260916143000
    // explica a decisão por inteiro):
    //   1. featured_at desc, nulos por último -> os destaques abrem a grade, o
    //      destacado mais recentemente primeiro;
    //   2. sort_order asc -> a ordenação manual continua mandando DENTRO de cada
    //      bloco (destaque não substitui sort_order, empilha em cima dele);
    //   3. name asc -> desempate estável. Hoje as 27 fórmulas têm sort_order = 0
    //      (conferido no banco): sem este terceiro critério o Postgres devolveria
    //      a ordem física da heap, que muda a cada UPDATE - e aí marcar UM destaque
    //      embaralharia a ordem de todo o resto do catálogo.
    supabase
      .from("formulas")
      .select(FORMULA_COLUMNS)
      .eq("active", true)
      .is("deleted_at", null)
      .order("featured_at", { ascending: false, nullsFirst: false })
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true }),
    supabase
      .from("formula_compositions")
      .select(COMPOSITION_COLUMNS)
      .eq("active", true)
      .is("deleted_at", null)
      .order("sort_order", { ascending: true }),
    // TODAS as aprovações de TODAS as fórmulas numa consulta só, agrupadas por
    // formula_id em memória logo abaixo — mesmo tratamento das composições, nunca uma
    // consulta por fórmula (N+1). Já vêm da mais recente para a mais antiga, que é a
    // ordem em que a tela e o PDF as mostram, e é a ordem do índice parcial
    // idx_formula_sheet_approvals_formula.
    supabase
      .from("formula_sheet_approvals")
      .select(SHEET_APPROVAL_COLUMNS)
      .eq("active", true)
      .is("deleted_at", null)
      .order("approved_at", { ascending: false }),
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
  if (approvalsResult.error) {
    console.error("[getCatalogData] falha ao consultar public.formula_sheet_approvals:", {
      message: approvalsResult.error.message,
      code: approvalsResult.error.code,
      details: approvalsResult.error.details,
      hint: approvalsResult.error.hint,
    });
    throw new Error(`Falha ao carregar aprovações de ficha técnica: ${approvalsResult.error.message}`);
  }

  const approvalsByFormula = new Map<string, FormulaSheetApprovalDTO[]>();
  for (const row of approvalsResult.data) {
    const list = approvalsByFormula.get(row.formula_id) ?? [];
    approvalsByFormula.set(row.formula_id, [
      ...list,
      {
        id: row.id,
        sheetVersion: row.sheet_version,
        approvedByName: row.approved_by_name,
        approvedByLicense: row.approved_by_license,
        approvedAt: row.approved_at,
      },
    ]);
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
        // ingredients vem do embed (COMPOSITION_COLUMNS, acima) via
        // ingredient_id - null quando a linha ainda não foi ligada a um
        // insumo canônico, ou quando os 4 campos individuais ainda não
        // foram preenchidos (ambos casos reais hoje: a ligação já existe
        // para as 213 linhas atuais, mas description/image_path/claim_text/
        // claim_source nascem NULL na migration, ver comentário na
        // FormulaCompositionDTO acima). emptyToNull evita "" fantasma nos
        // que um dia vierem preenchidos com string vazia.
        ingredientImagePath: emptyToNull(row.ingredients?.image_path ?? null),
        ingredientImageAlt: readImageAlt(row.ingredients?.metadata),
        ingredientDescription: emptyToNull(row.ingredients?.description ?? null),
        ingredientClaimText: emptyToNull(row.ingredients?.claim_text ?? null),
        ingredientClaimSource: emptyToNull(row.ingredients?.claim_source ?? null),
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
    netWeight: emptyToNull(row.net_weight),
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
    featuredAt: row.featured_at,
    mockupPath: mockupDaFormula(row.mockup_path, row.format),
    compositions: compositionsByFormula.get(row.id) ?? [],
    complianceVerifiedAt: row.compliance_verified_at,
    complianceNorms: row.compliance_norms ?? [],
    complianceSource: emptyToNull(row.compliance_source),
    technicalSheetVersion: row.technical_sheet_version,
    sheetApprovals: approvalsByFormula.get(row.id) ?? [],
    // Pacote técnico (embalagem e logística). Os 12 campos nascem NULL na migration
    // 20260916000000 e continuam NULL até o dono levantar cada medida — chegam aqui
    // como null e a UI omite a linha. emptyToNull nos dois códigos de barras evita ""
    // fantasma virar linha em branco caso alguém grave string vazia por fora do admin
    // (o formulário já converte vazio em null antes de enviar).
    ean13: emptyToNull(row.ean13),
    dun14: emptyToNull(row.dun14),
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
    nutritionTable: readNutritionTable(row.metadata),
  }));

  const segments: SegmentDTO[] = segmentsResult.data.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    sortOrder: row.sort_order,
  }));

  // Abas que o dono desligou no admin (public.catalog_lines): as fórmulas delas
  // saem do catálogo, do dossiê e dos benefícios, todos alimentados por esta
  // função. Falha ao ler (ou tabela ainda inexistente) NÃO derruba o catálogo:
  // registra e segue como se nenhuma aba estivesse desligada.
  const linesResult = await supabase.from("catalog_lines").select("line, enabled");
  if (linesResult.error) {
    console.error("[getCatalogData] falha ao consultar public.catalog_lines (seguindo com todas as linhas ligadas):", {
      message: linesResult.error.message,
      code: linesResult.error.code,
    });
  }
  const visibleFormulas = withoutDisabledLines(formulas, disabledLinesFromRows(linesResult.data));

  // Catálogo genuinamente vazio (zero fórmulas ativas) não é erro: devolve
  // normalmente. Quem decide mostrar o EmptyState é o CatalogView.
  return { segments, formulas: visibleFormulas };
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

// `{ expire: 0 }` em vez de "max", e isto foi MEDIDO, não escolhido por estilo.
//
// Com o profile "max", o teste ponta a ponta do destaque (13/09/2026, servidor de
// produção real, `npm start`) mostrou o seguinte: a rota /catalogo até era marcada
// stale (a resposta seguinte vinha com x-nextjs-cache: STALE), mas a entrada do
// unstable_cache NÃO expirava - a re-renderização em segundo plano relia o MESMO
// dado velho, e as oito requisições seguintes voltavam a HIT sem o produto
// destacado. Efeito prático: o dono marcava o destaque, o banco gravava, e o
// cliente continuava vendo o catálogo antigo por até 5 minutos.
//
// "max" significa "pode servir conteúdo velho por até um ano enquanto revalida" -
// é a escolha certa para quem tolera atraso, e errada aqui: quem acabou de mexer
// no catálogo precisa ver o resultado. `{ expire: 0 }` é a mesma API (a doc do
// Next 16 aceita um objeto com `expire` como segundo argumento, ver
// node_modules/next/dist/docs/01-app/03-api-reference/04-functions/revalidateTag.md)
// pedindo expiração imediata: a próxima requisição espera o dado novo em vez de
// receber o velho.
//
// updateTag() seria o sucessor indicado pela doc, mas só vale para tags de `fetch`
// e de funções com a diretiva `use cache` - este projeto usa unstable_cache, que
// não está nessa lista.
const EXPIRAR_AGORA = { expire: 0 } as const;

export function revalidateCatalogCache(): void {
  revalidateTag(CATALOG_CACHE_TAG, EXPIRAR_AGORA);
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

// ---------------------------------------------------------------------------
// Dossiê técnico completo (/catalogo/[slug])
// ---------------------------------------------------------------------------

export interface FormulaDetailDTO extends FormulaDTO {
  segment: SegmentDTO | null;
}

// Busca uma fórmula por slug para a página de dossiê completo. Reaproveita
// getCatalogData() (já cacheado 5 min, já filtra active/deleted_at, já nunca
// toca formula_costs) em vez de repetir a consulta ao banco — mesma fonte de
// dados do card e do modal "Dossiê Técnico", sem risco de os três canais
// divergirem entre si. Devolve null quando o slug não existe (quem chama
// decide chamar notFound()).
export async function getFormulaBySlug(slug: string): Promise<FormulaDetailDTO | null> {
  const { formulas, segments } = await getCatalogData();
  const formula = formulas.find((item) => item.slug === slug);
  if (!formula) return null;

  const segment = segments.find((item) => item.id === formula.segmentId) ?? null;
  return { ...formula, segment };
}
