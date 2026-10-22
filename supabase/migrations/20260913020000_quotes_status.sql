-- =====================================================================================
-- LEMON CAPS - CATALOGO PUBLICO
-- 20260913020000_quotes_status.sql - status comercial + observacao interna por
-- orcamento, para a aba /admin/orcamentos virar uma lista geral (todas as
-- cotacoes, com busca/filtro/exportacao) em vez de só uma lista crua.
--
-- ORDEM DE EXECUCAO: depois de schema.sql (cria public.quotes e a view
-- public.quote_summaries que esta migration recria) - repete o mesmo padrao de
-- enum idempotente e o mesmo cuidado de security_invoker/grants ja usados no
-- restante do projeto.
--
-- JA APLICADA AO BANCO. Conferido no banco vivo em 13/09/2026: public.quotes
-- responde com as colunas status e internal_note, e os orcamentos 1, 2 e 5
-- ja estao com status 'aberto'. O cabecalho anterior dizia "ESCRITA MAS NAO
-- APLICADA" e ficou para tras depois que o dono aplicou - e aviso errado e
-- pior que aviso nenhum, porque convida a rodar de novo o que ja passou.
-- O corpo abaixo e idempotente (o enum nasce num bloco que engole
-- duplicate_object), entao reaplicar nao quebraria; ainda assim, o registro
-- passa a dizer a verdade.
-- =====================================================================================


-- ---------------------------------------------------------------------------------
-- 1. ENUM quote_status
-- ---------------------------------------------------------------------------------

do $$ begin
    create type public.quote_status as enum ('aberto', 'aprovado', 'recusado', 'expirado');
exception when duplicate_object then null;
end $$;
comment on type public.quote_status is 'Situação comercial do orçamento, controlada manualmente pelo staff (can_manage_quotes) na tela de detalhe - nunca inferida sozinha pelo sistema. "expirado" não vira sozinho com o tempo nesta versão: é o staff quem marca.';


-- ---------------------------------------------------------------------------------
-- 2. COLUNAS NOVAS em public.quotes
-- ---------------------------------------------------------------------------------
-- ADD COLUMN ... NOT NULL DEFAULT é metadata-only no Postgres moderno (não
-- reescreve as linhas existentes) - seguro para rodar numa tabela com dado real.

alter table public.quotes add column if not exists status public.quote_status not null default 'aberto';
alter table public.quotes add column if not exists internal_note text;

comment on column public.quotes.status is 'Situação comercial do orçamento (aberto/aprovado/recusado/expirado). Ver comentário do tipo public.quote_status.';
comment on column public.quotes.internal_note is 'Anotação livre do staff sobre o orçamento - só para uso interno, nunca exibida ao cliente nem no PDF/texto gerado para o carrinho público.';


-- ---------------------------------------------------------------------------------
-- 3. ÍNDICES para os filtros da lista
-- ---------------------------------------------------------------------------------

create index if not exists idx_quotes_status on public.quotes (status) where deleted_at is null;

-- O filtro por período usa created_at, que já tem índice desde schema.sql
-- (idx_quotes_created_at, na mesma forma "(created_at desc) where deleted_at is
-- null" que o filtro de período precisa) - criar outro aqui seria duplicar
-- índice à toa. Checado no arquivo antes de escrever esta migration, para não
-- repetir trabalho que já existe.


-- ---------------------------------------------------------------------------------
-- 4. VIEW quote_summaries - recriada para incluir lead_id, status, internal_note
-- ---------------------------------------------------------------------------------
-- CREATE OR REPLACE VIEW exige que as colunas já existentes continuem com o
-- mesmo nome, ordem e tipo - só é permitido ACRESCENTAR coluna no final da
-- lista. Por isso as 8 colunas originais (schema.sql) vêm primeiro, exatamente
-- na mesma ordem, e as 3 novas (lead_id, status, internal_note) só depois.
-- security_invoker=true continua obrigatório pelo mesmo motivo do original:
-- sem isso a view rodaria com o privilégio de quem a criou, ignorando a RLS
-- de quotes/quote_items de quem está consultando.

create or replace view public.quote_summaries
with (security_invoker = true) as
select
    q.id as quote_id,
    q.quote_number,
    q.customer_name,
    q.customer_whatsapp,
    q.created_at,
    count(qi.id) as item_count,
    sum(qi.line_total_cents) as total_cents,
    sum(qi.profit_cents) as total_profit_cents,
    q.lead_id,
    q.status,
    q.internal_note
from public.quotes q
left join public.quote_items qi on qi.quote_id = q.id and qi.deleted_at is null
where q.deleted_at is null
group by q.id, q.quote_number, q.customer_name, q.customer_whatsapp, q.created_at, q.lead_id, q.status, q.internal_note;

comment on view public.quote_summaries is 'Totais agregados por orçamento (conveniência para a lista da aba Orçamentos), agora com lead_id, status e internal_note para a listagem geral com filtro/exportação. security_invoker=true: respeita a RLS de quotes/quote_items de quem consulta, não do dono da view.';


-- ---------------------------------------------------------------------------------
-- 5. GRANTS - reaplica o revoke do anon (defesa em profundidade, idempotente)
-- ---------------------------------------------------------------------------------
-- CREATE OR REPLACE VIEW substitui só a query da view, não recria o objeto do
-- zero - os grants existentes no relation (o revoke de
-- 20260913230000_revogar_grants_anon.sql) já continuariam de pé mesmo sem esta
-- linha. Repetido aqui mesmo assim, mesmo padrão defensivo já usado em
-- 20260913220056_ingredientes.sql: barato, idempotente, e garante que esta
-- migration nunca reabra sozinha o vazamento de margem (nome do cliente,
-- WhatsApp e lucro) que este projeto inteiro existe para evitar - mesmo que a
-- migration de revoke seja reordenada ou reaplicada fora de ordem no futuro.

revoke all on public.quote_summaries from anon;
