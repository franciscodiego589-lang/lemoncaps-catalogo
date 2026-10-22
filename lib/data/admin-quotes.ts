import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Enums, Tables } from "@/lib/supabase/database.types";
import { sanitizarTermoBusca } from "./postgrest-filtro";

// =============================================================================
// ORÇAMENTOS - /admin/orcamentos (exige can_manage_quotes, conferido na page).
// Extraído de lib/data/admin.ts (que já passava de 800 linhas) para manter
// arquivo focado por domínio - reexportado por admin.ts, então nada de fora
// deste diretório precisa saber que o código mora aqui.
// =============================================================================

export type QuoteStatus = Enums<"quote_status">;

// Única lista de valores válidos em tempo de execução (o type acima some na
// compilação) - usada para nunca repassar ao Postgres um "status" que não
// seja um destes 4, venha ele já validado pela tela ou direto da querystring
// da rota de exportação (item 4 da tarefa), que não passa pela validação da
// page.
const QUOTE_STATUS_VALUES: readonly QuoteStatus[] = ["aberto", "aprovado", "recusado", "expirado"];

function isQuoteStatus(value: string): value is QuoteStatus {
  return (QUOTE_STATUS_VALUES as readonly string[]).includes(value);
}

export interface AdminQuoteListItemDTO {
  id: string;
  quoteNumber: number;
  customerName: string;
  customerWhatsapp: string;
  createdAt: string;
  itemCount: number;
  totalCents: number;
  totalProfitCents: number | null;
  status: QuoteStatus;
}

// Todos os campos opcionais de propósito - a page monta isto a partir de
// searchParams (strings soltas da URL, nunca validadas na origem) e a rota de
// exportação (app/admin/(dashboard)/orcamentos/exportar/route.ts) monta o
// mesmo formato direto do querystring, sem passar pela page. Por isso quem
// valida de verdade é applyQuoteFilters, abaixo - as duas entradas confiam
// nela igualmente.
export interface QuoteFilters {
  busca?: string;
  status?: string;
  de?: string;
  ate?: string;
  pagina?: number;
}

export interface AdminQuotesPage {
  linhas: AdminQuoteListItemDTO[];
  total: number;
  pagina: number;
  totalPaginas: number;
}

const QUOTES_PAGE_SIZE = 50;
const QUOTES_EXPORT_MAX_ROWS = 5000; // teto defensivo - bem acima do volume real de orçamentos hoje

const QUOTE_SUMMARY_COLUMNS =
  "quote_id, quote_number, customer_name, customer_whatsapp, created_at, item_count, total_cents, total_profit_cents, status";

// QUOTE_SUMMARY_COLUMNS é um literal de string (const sem anotação de tipo) -
// o supabase-js lê esse literal e tipa o Row da consulta só com estas 9
// colunas, não com a view inteira. Pick<> deriva esse subconjunto do tipo
// gerado (Tables<"quote_summaries">) em vez de repetir os campos à mão, para
// nunca destoar da lista acima.
type QuoteSummaryRow = Pick<
  Tables<"quote_summaries">,
  | "quote_id"
  | "quote_number"
  | "customer_name"
  | "customer_whatsapp"
  | "created_at"
  | "item_count"
  | "total_cents"
  | "total_profit_cents"
  | "status"
>;

// "YYYY-MM-DD" (formato de <input type="date">) -> início do dia em UTC, ou
// null se não vier nesse formato - um parâmetro de URL malformado vira "sem
// filtro" neste campo, nunca um erro 500 nem uma consulta quebrada.
function dateOnlyToUtcIso(value: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

// "até" precisa incluir o dia inteiro - em vez de comparar com 23:59:59 (que
// corta o último instante do dia), usa "<" o início do dia SEGUINTE.
function dayAfterToUtcIso(value: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) return null;
  parsed.setUTCDate(parsed.getUTCDate() + 1);
  return parsed.toISOString();
}

function baseQuoteSummaryQuery(supabase: Awaited<ReturnType<typeof createClient>>) {
  return supabase.from("quote_summaries").select(QUOTE_SUMMARY_COLUMNS, { count: "exact" });
}

// Compartilhada entre a lista paginada e a exportação (mesmo filtro nas duas,
// para o CSV nunca divergir do que a tela mostra para aquele filtro). Nunca
// monta SQL por concatenação: só os builders do supabase-js (.or/.eq/.gte/.lt).
function applyQuoteFilters(query: ReturnType<typeof baseQuoteSummaryQuery>, filters: QuoteFilters) {
  let q = query;

  if (filters.busca && filters.busca.trim() !== "") {
    // Sanitiza ANTES de entrar no .or(): o termo vai para a linguagem de filtro
    // do PostgREST, onde vírgula e ponto são sintaxe, não conteúdo. Sem isso o
    // usuário acrescenta condições próprias à consulta — comprovado na varredura
    // de 13/09/2026 (ver lib/data/postgrest-filtro.ts).
    const term = sanitizarTermoBusca(filters.busca);
    if (term !== "") {
      const orParts = [`customer_name.ilike.%${term}%`, `customer_whatsapp.ilike.%${term}%`];
      if (/^\d+$/.test(term)) orParts.push(`quote_number.eq.${term}`); // número do orçamento só entra na busca quando o termo for numérico
      q = q.or(orParts.join(","));
    }
  }

  if (filters.status && filters.status !== "todos" && isQuoteStatus(filters.status)) {
    q = q.eq("status", filters.status);
  }

  if (filters.de) {
    const iso = dateOnlyToUtcIso(filters.de);
    if (iso) q = q.gte("created_at", iso);
  }

  if (filters.ate) {
    const iso = dayAfterToUtcIso(filters.ate);
    if (iso) q = q.lt("created_at", iso);
  }

  return q;
}

function mapQuoteSummaryRow(row: QuoteSummaryRow): AdminQuoteListItemDTO | null {
  if (row.quote_id === null || row.quote_number === null) return null;
  return {
    id: row.quote_id,
    quoteNumber: row.quote_number,
    customerName: row.customer_name ?? "",
    customerWhatsapp: row.customer_whatsapp ?? "",
    createdAt: row.created_at ?? "",
    itemCount: row.item_count ?? 0,
    totalCents: row.total_cents ?? 0,
    totalProfitCents: row.total_profit_cents,
    // status é NOT NULL em public.quotes; a view marca "| null" do jeito
    // conservador com que o gerador de tipos trata toda coluna de view.
    status: row.status ?? "aberto",
  };
}

export async function getAdminQuotes(filters: QuoteFilters = {}): Promise<AdminQuotesPage> {
  const supabase = await createClient();
  const pagina = filters.pagina && Number.isInteger(filters.pagina) && filters.pagina > 0 ? filters.pagina : 1;
  const from = (pagina - 1) * QUOTES_PAGE_SIZE;
  const to = from + QUOTES_PAGE_SIZE - 1;

  const query = applyQuoteFilters(baseQuoteSummaryQuery(supabase), filters)
    .order("created_at", { ascending: false })
    .range(from, to);

  const { data, error, count } = await query;
  if (error) throw new Error(`Falha ao carregar orçamentos: ${error.message}`);

  const total = count ?? 0;
  return {
    linhas: (data ?? []).map(mapQuoteSummaryRow).filter((row): row is AdminQuoteListItemDTO => row !== null),
    total,
    pagina,
    totalPaginas: Math.max(1, Math.ceil(total / QUOTES_PAGE_SIZE)),
  };
}

// Uma linha por ITEM do orçamento, não por orçamento inteiro - decisão
// explícita do pedido de enriquecer o CSV (2026-09-13): é o formato que dá
// para somar/filtrar numa planilha de verdade (potes e subtotal por
// fórmula), em vez de amontoar os itens numa única célula ilegível para o
// Excel agregar. Os campos do orçamento (número, data, cliente, WhatsApp,
// status, totais) por isso se repetem em cada linha de item do mesmo
// orçamento - é o preço de deixar a planilha somável.
export interface AdminQuoteExportRowDTO {
  quoteNumber: number;
  customerName: string;
  customerWhatsapp: string;
  createdAt: string;
  status: QuoteStatus;
  // Agregados do ORÇAMENTO inteiro (repetidos em toda linha de item dele).
  // quoteTotalCents/quoteTotalProfitCents vêm prontos de quote_summaries -
  // mesma soma que a tela já mostra, nunca recalculada aqui. quoteTotalPotes
  // não existe na view, por isso é somado abaixo a partir dos próprios itens
  // já carregados para o CSV.
  quoteTotalPotes: number;
  quoteTotalCents: number;
  quoteTotalProfitCents: number | null;
  // Do ITEM. Só ficam null na linha de segurança de um orçamento sem item
  // vivo (ver comentário mais abaixo) - hoje nunca visto em produção.
  itemFormulaName: string | null;
  itemPresentation: string | null;
  itemQuantityPotes: number | null;
  itemUnitPriceCents: number | null;
  itemLineTotalCents: number | null;
}

type QuoteExportItemRow = Pick<
  Tables<"quote_items">,
  "quote_id" | "formula_id" | "formula_name_snapshot" | "quantity_potes" | "unit_price_cents" | "line_total_cents"
>;

// Mesma técnica de QUOTE_SUMMARY_COLUMNS acima: literal de string sem
// anotação de tipo, para o supabase-js tipar a consulta só com estas colunas.
const QUOTE_EXPORT_ITEM_COLUMNS = "quote_id, formula_id, formula_name_snapshot, quantity_potes, unit_price_cents, line_total_cents";

// Só a apresentação/peso da fórmula, para o join manual em JS logo abaixo -
// nunca list_price_cents nem qualquer outra coluna que esta exportação não
// pediu.
type FormulaPresentationRow = Pick<Tables<"formulas">, "id" | "pote_contents_description">;

// Mesmo filtro da lista, sem paginação - para o botão "Exportar planilha"
// baixar TODAS as cotações do filtro atual (item 4 da tarefa original desta
// aba), não só a página visível.
//
// Três consultas (quote_summaries para o cabeçalho de cada orçamento,
// quote_items para os itens, formulas só pela apresentação) em vez de um
// select aninhado do PostgREST (`quote_items(*, formulas(...))`): nenhum
// outro lugar deste arquivo usa embed, o tipo que o supabase-js infere para
// select aninhado é frágil de anotar à mão, e Promise.all/junção em JS é o
// mesmo padrão já usado acima em getAdminQuoteById.
export async function getAdminQuotesForExport(
  filters: Omit<QuoteFilters, "pagina"> = {},
): Promise<AdminQuoteExportRowDTO[]> {
  const supabase = await createClient();
  const query = applyQuoteFilters(baseQuoteSummaryQuery(supabase), filters)
    .order("created_at", { ascending: false })
    .limit(QUOTES_EXPORT_MAX_ROWS);

  const { data, error } = await query;
  if (error) throw new Error(`Falha ao exportar orçamentos: ${error.message}`);

  const quotes = (data ?? []).map(mapQuoteSummaryRow).filter((row): row is AdminQuoteListItemDTO => row !== null);
  if (quotes.length === 0) return [];

  // .in() com todos os IDs filtrados de uma vez. QUOTES_EXPORT_MAX_ROWS (5000)
  // já era, antes desta função existir, uma defesa contra volume futuro - bem
  // acima da quantidade real de orçamentos hoje. Perto desse teto, esta
  // chamada .in() pode esbarrar em limite de tamanho de URL do PostgREST
  // antes de qualquer outro problema; não paginada em lotes aqui de
  // propósito (YAGNI - sem uso real hoje que justifique a complexidade).
  const quoteIds = quotes.map((quote) => quote.id);
  const { data: itemRows, error: itemsError } = await supabase
    .from("quote_items")
    .select(QUOTE_EXPORT_ITEM_COLUMNS)
    .in("quote_id", quoteIds)
    .is("deleted_at", null)
    .order("quote_id", { ascending: true })
    .order("sort_order", { ascending: true });
  if (itemsError) throw new Error(`Falha ao exportar itens dos orçamentos: ${itemsError.message}`);

  const items = itemRows ?? [];

  // Apresentação/peso NÃO é um dado "congelado" no item (ao contrário de
  // formula_name_snapshot) - vem AO VIVO da fórmula atual, porque
  // quote_items nunca guardou esse snapshot no schema. Se a fórmula for
  // editada depois do orçamento, o CSV mostra a apresentação de HOJE, não a
  // de quando o orçamento foi gerado - limitação do schema, não desta
  // função. pote_contents_description (não net_weight) é o campo certo aqui:
  // conferido linha a linha no seed real (supabase/migrations/20260909210002_seed_catalogo.sql)
  // - net_weight vem vazio em praticamente todo formula real (documentado no
  // próprio schema.sql), pote_contents_description é quem carrega "60
  // Cápsulas"/"150g"/etc.
  const formulaIds = Array.from(new Set(items.map((item) => item.formula_id)));
  const presentationByFormulaId = new Map<string, string | null>();
  if (formulaIds.length > 0) {
    const { data: formulaRows, error: formulaError } = await supabase
      .from("formulas")
      .select("id, pote_contents_description")
      .in("id", formulaIds);
    if (formulaError) throw new Error(`Falha ao exportar apresentação das fórmulas: ${formulaError.message}`);
    for (const formula of (formulaRows ?? []) as FormulaPresentationRow[]) {
      presentationByFormulaId.set(formula.id, formula.pote_contents_description);
    }
  }

  const itemsByQuoteId = new Map<string, QuoteExportItemRow[]>();
  for (const item of items) {
    const existing = itemsByQuoteId.get(item.quote_id);
    if (existing) existing.push(item);
    else itemsByQuoteId.set(item.quote_id, [item]);
  }

  const rows: AdminQuoteExportRowDTO[] = [];
  for (const quote of quotes) {
    const quoteItems = itemsByQuoteId.get(quote.id) ?? [];

    // fn_generate_quote (schema.sql) exige ao menos 1 item para criar o
    // orçamento, e não existe ação de remover item depois de criado (ver
    // lib/actions/quotes.ts: só updateQuoteItem e updateQuoteStatus) - este
    // ramo nunca deve disparar em produção hoje. Mesmo assim, um orçamento
    // sem item vivo continua indo para o CSV numa linha própria, em vez de
    // desaparecer em silêncio da exportação.
    if (quoteItems.length === 0) {
      rows.push({
        quoteNumber: quote.quoteNumber,
        customerName: quote.customerName,
        customerWhatsapp: quote.customerWhatsapp,
        createdAt: quote.createdAt,
        status: quote.status,
        quoteTotalPotes: 0,
        quoteTotalCents: quote.totalCents,
        quoteTotalProfitCents: quote.totalProfitCents,
        itemFormulaName: null,
        itemPresentation: null,
        itemQuantityPotes: null,
        itemUnitPriceCents: null,
        itemLineTotalCents: null,
      });
      continue;
    }

    const quoteTotalPotes = quoteItems.reduce((total, item) => total + item.quantity_potes, 0);

    for (const item of quoteItems) {
      rows.push({
        quoteNumber: quote.quoteNumber,
        customerName: quote.customerName,
        customerWhatsapp: quote.customerWhatsapp,
        createdAt: quote.createdAt,
        status: quote.status,
        quoteTotalPotes,
        quoteTotalCents: quote.totalCents,
        quoteTotalProfitCents: quote.totalProfitCents,
        itemFormulaName: item.formula_name_snapshot,
        itemPresentation: presentationByFormulaId.get(item.formula_id) ?? null,
        itemQuantityPotes: item.quantity_potes,
        itemUnitPriceCents: item.unit_price_cents,
        itemLineTotalCents: item.line_total_cents,
      });
    }
  }

  return rows;
}

export interface AdminQuoteItemDTO {
  id: string;
  formulaId: string;
  formulaNameSnapshot: string;
  quantityPotes: number;
  unitCostCents: number | null;
  /** null = preço sob consulta (fórmula sem preço na hora da cotação). */
  unitPriceCents: number | null;
  lineTotalCents: number | null;
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
  status: QuoteStatus;
  internalNote: string | null;
  items: AdminQuoteItemDTO[];
}

export async function getAdminQuoteById(id: string): Promise<AdminQuoteDetailDTO | null> {
  const supabase = await createClient();

  const [quoteResult, itemsResult] = await Promise.all([
    supabase
      .from("quotes")
      .select("id, quote_number, customer_name, customer_whatsapp, created_at, status, internal_note")
      .eq("id", id)
      .is("deleted_at", null)
      .maybeSingle(),
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
    status: q.status,
    internalNote: q.internal_note,
    items: (itemsResult.data ?? []).map((item) => ({
      id: item.id,
      formulaId: item.formula_id,
      formulaNameSnapshot: item.formula_name_snapshot,
      quantityPotes: item.quantity_potes,
      unitCostCents: item.unit_cost_cents,
      unitPriceCents: item.unit_price_cents,
      // line_total_cents é coluna GERADA como quantity_potes * unit_price_cents
      // (schema.sql). Desde 20261021170000_cotacao_sem_preco.sql o preço pode
      // ser nulo (sob consulta), e aí o total da linha também é nulo.
      lineTotalCents: item.line_total_cents,
      lineCostCents: item.line_cost_cents,
      profitCents: item.profit_cents,
      profitMarginPct: item.profit_margin_pct,
      sortOrder: item.sort_order,
    })),
  };
}
