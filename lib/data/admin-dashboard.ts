import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { QuoteStatus } from "@/lib/data/admin-quotes";
import type { StaffSession } from "@/lib/data/admin";

// =============================================================================
// DASHBOARD - /admin (visão geral).
//
// Extraído de lib/data/admin.ts pelo mesmo motivo que os orçamentos já haviam
// sido: aquele arquivo é a Data Access Layer inteira do admin e cresce a cada
// tela. O bloco do dashboard deixou de ser "duas contagens" e virou um domínio
// próprio (métricas + pendências), então mora aqui e é reexportado por
// admin.ts - nenhum import de fora precisou mudar.
// =============================================================================

// Teto defensivo para a soma do valor cotado. Ver o comentário longo em
// getAdminDashboard sobre por que a soma acontece em JS.
const QUOTES_SOMA_MAX_LINHAS = 5000;

// A partir de que fatia do universo uma pendência passa a ser tratada como
// urgente. Meia base afetada é o corte: abaixo disso é fila de trabalho, acima
// disso é o cadastro inteiro fora do ar para aquele campo. Está aqui em cima,
// como constante nomeada, porque é decisão de negócio - não número mágico
// enterrado numa comparação.
const FATIA_PARA_URGENTE = 0.5;

export type PendenciaSeveridade = "urgente" | "atencao";

export interface AdminDashboardPendenciaDTO {
  /** Identificador estável - vira a chave do React e o sufixo do ícone. */
  id: "sem-foto" | "sem-selo" | "sem-advertencia" | "sem-ingredientes" | "sem-custo" | "sem-preco";
  label: string;
  /** Explica o efeito prático da falta, em uma linha. */
  hint: string;
  count: number;
  /** Universo em que a pendência foi medida (ex.: total de fórmulas ativas). */
  total: number;
  severity: PendenciaSeveridade;
  /** Tela onde a pendência se resolve. */
  href: string;
  hrefLabel: string;
}

export interface AdminDashboardDTO {
  activeFormulasCount: number;
  inactiveFormulasCount: number;
  ingredientsCount: number;
  leadsCount: number;
  /** null quando o staff não pode ver orçamentos (mesma regra de recentQuotes). */
  quotesCount: number | null;
  quotesByStatus: Array<{ status: QuoteStatus; count: number }> | null;
  /** Soma de todos os orçamentos vivos, em centavos. null = não pôde ser somado por inteiro. */
  quotedTotalCents: number | null;
  /** Valor cotado dividido pelo número de orçamentos, arredondado ao centavo. */
  averageQuoteCents: number | null;
  pendencias: AdminDashboardPendenciaDTO[];
  recentLeads: Array<{ id: string; name: string; whatsapp: string; createdAt: string }>;
  recentQuotes: Array<{
    id: string;
    quoteNumber: number;
    customerName: string;
    totalCents: number;
    createdAt: string;
    status: QuoteStatus;
  }> | null;
}

// Monta uma pendência já com a gravidade calculada. A gravidade sai da FATIA
// do universo afetada, não de uma ordem fixa escrita no código: "27 de 27
// fórmulas sem custo" é outro problema que "4 de 27 sem selo", e é o dado que
// decide isso - se amanhã 26 custos forem lançados, a linha desce de urgente
// para atenção sozinha.
function montarPendencia(
  base: Omit<AdminDashboardPendenciaDTO, "severity">,
): AdminDashboardPendenciaDTO {
  const fatia = base.total > 0 ? base.count / base.total : 0;
  return { ...base, severity: fatia >= FATIA_PARA_URGENTE ? "urgente" : "atencao" };
}

export async function getAdminDashboard(session: StaffSession): Promise<AdminDashboardDTO> {
  const supabase = await createClient();

  // Tudo em paralelo, e toda contagem com head: true - o PostgREST devolve só
  // o cabeçalho Content-Range, sem trafegar uma linha sequer. Contar em JS
  // exigiria puxar as 27 fórmulas (hoje) ou as 27 mil (um dia) para descobrir
  // um número que o Postgres já sabe.
  const [
    activeCount,
    inactiveCount,
    ingredientsCount,
    leadsCount,
    semFotoCount,
    semSeloCount,
    semAdvertenciaCount,
    semIngredientesCount,
    semPrecoCount,
    custosTotalCount,
    custosVaziosCount,
    recentLeadsResult,
    quotesAgregado,
    recentQuotesResult,
  ] = await Promise.all([
    supabase.from("formulas").select("id", { count: "exact", head: true }).eq("active", true).is("deleted_at", null),
    supabase.from("formulas").select("id", { count: "exact", head: true }).eq("active", false).is("deleted_at", null),
    supabase.from("ingredients").select("id", { count: "exact", head: true }).is("deleted_at", null),
    supabase.from("leads").select("id", { count: "exact", head: true }).is("deleted_at", null),

    // --- pendências do catálogo (sempre sobre fórmulas ATIVAS: uma fórmula
    // inativa incompleta não atrapalha ninguém, ela não está no ar) ---
    supabase.from("formulas").select("id", { count: "exact", head: true }).eq("active", true).is("deleted_at", null).is("mockup_path", null),
    supabase
      .from("formulas")
      .select("id", { count: "exact", head: true })
      .eq("active", true)
      .is("deleted_at", null)
      .is("compliance_verified_at", null),
    // Campo de texto vazio conta como ausente tanto quanto NULL - salvar o
    // formulário sem preencher grava string vazia, e para quem lê o rótulo do
    // produto os dois casos são a mesma falta.
    supabase
      .from("formulas")
      .select("id", { count: "exact", head: true })
      .eq("active", true)
      .is("deleted_at", null)
      .or("warnings.is.null,warnings.eq."),
    supabase
      .from("formulas")
      .select("id", { count: "exact", head: true })
      .eq("active", true)
      .is("deleted_at", null)
      .or("ingredients_list.is.null,ingredients_list.eq."),
    // Fórmula ativa sem preço só existe na linha Essencial (exceção da trava
    // desde 23/09/2026, migration 20260923050000). No ar, ela aparece como
    // "Preço sob consulta" e não pode ser cotada — por isso é pendência.
    supabase
      .from("formulas")
      .select("id", { count: "exact", head: true })
      .eq("active", true)
      .is("deleted_at", null)
      .is("list_price_cents", null),

    // Custo é medido sobre as LINHAS de formula_costs já cadastradas, não
    // sobre as fórmulas: a linha existir com unit_cost_cents nulo é
    // exatamente o estado que impede o cálculo de margem do orçamento (ver
    // quote_items.unit_cost_cents no schema).
    supabase.from("formula_costs").select("formula_id", { count: "exact", head: true }).is("deleted_at", null),
    supabase
      .from("formula_costs")
      .select("formula_id", { count: "exact", head: true })
      .is("deleted_at", null)
      .is("unit_cost_cents", null),

    supabase.from("leads").select("id, name, whatsapp, created_at").is("deleted_at", null).order("created_at", { ascending: false }).limit(5),

    // O valor cotado e a contagem por status saem da MESMA leitura, de
    // propósito. Este projeto tem as funções de agregação do PostgREST
    // desligadas (`select=total_cents.sum()` responde PGRST123, "Use of
    // aggregate functions is not allowed" - conferido no banco em 13/09/2026),
    // então a soma tem de acontecer em JS de qualquer jeito. Já que as linhas
    // vêm, o status vem junto e economiza quatro idas ao banco só para contar
    // "aberto/aprovado/recusado/expirado". São duas colunas pequenas por
    // orçamento, nada de cliente, telefone ou itens.
    //
    // quote_summaries já filtra q.deleted_at is null e junta só itens vivos
    // (ver a view em 20260909210000_schema.sql) - somar quote_items direto
    // daria um total inflado, contando itens de orçamento apagado.
    session.canManageQuotes
      ? supabase.from("quote_summaries").select("total_cents, status", { count: "exact" }).limit(QUOTES_SOMA_MAX_LINHAS)
      : Promise.resolve({ data: null, error: null, count: null }),

    session.canManageQuotes
      ? supabase
          .from("quote_summaries")
          .select("quote_id, quote_number, customer_name, total_cents, created_at, status")
          .order("created_at", { ascending: false })
          .limit(5)
      : Promise.resolve({ data: null, error: null }),
  ]);

  // Erro de qualquer uma derruba a tela inteira, com o motivo: métrica de
  // gestão pela metade é pior que tela de erro - quem lê "0 pendências"
  // porque a consulta falhou não vai atrás do que não foi feito.
  const falhas: Array<[string, { error: { message: string } | null }]> = [
    ["contar fórmulas ativas", activeCount],
    ["contar fórmulas inativas", inactiveCount],
    ["contar insumos", ingredientsCount],
    ["contar leads", leadsCount],
    ["contar fórmulas sem foto", semFotoCount],
    ["contar fórmulas sem selo de conformidade", semSeloCount],
    ["contar fórmulas sem advertências", semAdvertenciaCount],
    ["contar fórmulas sem lista de ingredientes", semIngredientesCount],
    ["contar fórmulas ativas sem preço", semPrecoCount],
    ["contar linhas de custo", custosTotalCount],
    ["contar custos sem valor", custosVaziosCount],
    ["carregar leads recentes", recentLeadsResult],
    ["somar o valor cotado", quotesAgregado],
    ["carregar orçamentos recentes", recentQuotesResult],
  ];
  for (const [oQue, resultado] of falhas) {
    if (resultado.error) throw new Error(`Falha ao ${oQue}: ${resultado.error.message}`);
  }

  const ativas = activeCount.count ?? 0;
  const linhasDeCusto = custosTotalCount.count ?? 0;

  const pendencias = [
    montarPendencia({
      id: "sem-custo",
      label: "Custo de produção não lançado",
      hint: "Sem custo, o orçamento não calcula margem nenhuma.",
      count: custosVaziosCount.count ?? 0,
      total: linhasDeCusto,
      href: "/admin/custos",
      hrefLabel: "Lançar custos",
    }),
    montarPendencia({
      id: "sem-preco",
      label: "Fórmulas ativas sem preço",
      hint: "Aparecem como Preço sob consulta e o cliente não consegue cotar.",
      count: semPrecoCount.count ?? 0,
      total: ativas,
      href: "/admin/catalogo",
      hrefLabel: "Definir preços",
    }),
    montarPendencia({
      id: "sem-foto",
      label: "Fórmulas ativas sem foto do pote",
      hint: "O catálogo mostra a faixa colorida do segmento no lugar do produto.",
      count: semFotoCount.count ?? 0,
      total: ativas,
      href: "/admin/catalogo",
      hrefLabel: "Abrir catálogo",
    }),
    montarPendencia({
      id: "sem-ingredientes",
      label: "Fórmulas ativas sem lista de ingredientes",
      hint: "Campo obrigatório de rótulo: sem ele o dossiê sai incompleto.",
      count: semIngredientesCount.count ?? 0,
      total: ativas,
      href: "/admin/catalogo",
      hrefLabel: "Abrir catálogo",
    }),
    montarPendencia({
      id: "sem-advertencia",
      label: "Fórmulas ativas sem advertências",
      hint: "Advertência de rótulo é exigência sanitária, não texto opcional.",
      count: semAdvertenciaCount.count ?? 0,
      total: ativas,
      href: "/admin/catalogo",
      hrefLabel: "Abrir catálogo",
    }),
    montarPendencia({
      id: "sem-selo",
      label: "Fórmulas ativas sem selo de conformidade",
      hint: "A composição ainda não foi conferida contra os limites da Anvisa.",
      count: semSeloCount.count ?? 0,
      total: ativas,
      href: "/admin/catalogo",
      hrefLabel: "Abrir catálogo",
    }),
  ]
    // Pendência zerada some da lista: painel de gestão mostra o que falta, e
    // linha com "0 de 27" só ocupa espaço e ensina o olho a ignorar o bloco.
    .filter((p) => p.count > 0)
    // Ordena pela fatia afetada, do pior para o menos pior - é a mesma régua
    // que decidiu a gravidade, então a ordem da lista e a cor nunca discordam.
    .sort((a, b) => b.count / (b.total || 1) - a.count / (a.total || 1) || b.count - a.count);

  // Soma do valor cotado. Se o teto de linhas foi atingido, a soma seria
  // PARCIAL - e valor parcial exibido como total é número errado na tela.
  // Nesse caso devolve null e a peça de interface simplesmente não aparece.
  const linhasQuotes = quotesAgregado.data ?? null;
  const quotesCount = session.canManageQuotes ? quotesAgregado.count ?? 0 : null;
  const somaCompleta = linhasQuotes !== null && (quotesAgregado.count ?? 0) <= linhasQuotes.length;
  const quotedTotalCents = somaCompleta && linhasQuotes ? linhasQuotes.reduce((total, linha) => total + (linha.total_cents ?? 0), 0) : null;

  // Contagem por status a partir das mesmas linhas. Só entram os status que
  // realmente existem hoje - inventar "0 recusados" seria informação que o
  // banco não deu.
  const quotesByStatus =
    linhasQuotes === null
      ? null
      : Object.entries(
          linhasQuotes.reduce<Record<string, number>>((mapa, linha) => {
            if (!linha.status) return mapa;
            return { ...mapa, [linha.status]: (mapa[linha.status] ?? 0) + 1 };
          }, {}),
        )
          .map(([status, count]) => ({ status: status as QuoteStatus, count }))
          .sort((a, b) => b.count - a.count);

  return {
    activeFormulasCount: ativas,
    inactiveFormulasCount: inactiveCount.count ?? 0,
    ingredientsCount: ingredientsCount.count ?? 0,
    leadsCount: leadsCount.count ?? 0,
    quotesCount,
    quotesByStatus,
    quotedTotalCents,
    // Ticket médio é valor CALCULADO (não lido do banco): total dividido pelo
    // número de orçamentos, arredondado ao centavo inteiro - dinheiro nunca
    // sai daqui como fração de centavo.
    averageQuoteCents:
      quotedTotalCents !== null && quotesCount !== null && quotesCount > 0 ? Math.round(quotedTotalCents / quotesCount) : null,
    pendencias,
    recentLeads: (recentLeadsResult.data ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      whatsapp: row.whatsapp,
      createdAt: row.created_at,
    })),
    // quotes.status é NOT NULL DEFAULT 'aberto' no banco (migration
    // 20260913020000) - só o tipo gerado para a VIEW o marca como opcional,
    // como acontece com toda coluna vinda de view. A linha sem status é
    // descartada em vez de exibida com um valor inventado: selo de situação
    // comercial errado faz o dono cobrar o cliente errado.
    recentQuotes: recentQuotesResult.data
      ? recentQuotesResult.data
          .filter(
            (row): row is typeof row & { quote_id: string; quote_number: number; status: QuoteStatus } =>
              row.quote_id !== null && row.quote_number !== null && row.status !== null,
          )
          .map((row) => ({
            id: row.quote_id,
            quoteNumber: row.quote_number,
            customerName: row.customer_name ?? "",
            totalCents: row.total_cents ?? 0,
            createdAt: row.created_at ?? "",
            status: row.status,
          }))
      : null,
  };
}
