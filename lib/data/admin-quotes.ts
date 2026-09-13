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

// Mesmo filtro da lista, sem paginação - para o botão "Exportar planilha"
// baixar TODAS as cotações do filtro atual (item 4 da tarefa), não só a
// página visível.
export async function getAdminQuotesForExport(filters: Omit<QuoteFilters, "pagina"> = {}): Promise<AdminQuoteListItemDTO[]> {
  const supabase = await createClient();
  const query = applyQuoteFilters(baseQuoteSummaryQuery(supabase), filters)
    .order("created_at", { ascending: false })
    .limit(QUOTES_EXPORT_MAX_ROWS);

  const { data, error } = await query;
  if (error) throw new Error(`Falha ao exportar orçamentos: ${error.message}`);

  return (data ?? []).map(mapQuoteSummaryRow).filter((row): row is AdminQuoteListItemDTO => row !== null);
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
