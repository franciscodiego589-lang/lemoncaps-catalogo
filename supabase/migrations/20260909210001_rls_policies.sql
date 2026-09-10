-- =====================================================================================
-- LEMON CAPS — CATÁLOGO PÚBLICO
-- rls-policies.sql — quem pode acessar o quê: predicados de RLS, RLS por tabela,
-- GRANTs de tabela, GRANTs de EXECUTE nas funções públicas, e a publicação Realtime.
--
-- ORDEM DE EXECUÇÃO: rodar DEPOIS de schema.sql (as tabelas/funções precisam existir).
--
-- Dois papéis de acesso neste sistema (não é RBAC genérico — é só o que o organograma
-- pede):
--   private.is_active_staff()   -> "admin comum": Catálogo + Leads e Carrinhos
--   private.can_manage_quotes() -> o "papel extra"/"senha extra": também Orçamentos
--                                   gerados (preço de venda, margem, lucro, histórico)
-- Todo authenticated neste projeto É staff (não existe login de cliente/produtor no
-- organograma — o visitante nunca autentica). Mesmo assim as políticas checam os
-- predicados explicitamente, não só "authenticated", por defesa em profundidade.
-- =====================================================================================


-- ---------------------------------------------------------------------------------
-- 0. PREDICADOS DE RLS
-- ---------------------------------------------------------------------------------
-- SECURITY DEFINER + search_path fixo: evita o problema clássico de RLS recursiva
-- (uma policy em staff_profiles que consultasse staff_profiles via RLS normal
-- entraria em loop/negaria a si mesma). Rodar como definer também não vaza dado:
-- a função só devolve true/false, nunca uma linha inteira.

create or replace function private.is_active_staff()
returns boolean
language sql
security definer
stable
set search_path = pg_catalog, public
as $$
    select exists (
        select 1 from public.staff_profiles sp
        where sp.user_id = auth.uid() and sp.active
    );
$$;

comment on function private.is_active_staff() is 'true se o usuário autenticado é staff ativo (substitui a antiga senha fixa "0212"). Usado em toda policy de admin comum (Catálogo, Leads e Carrinhos).';

revoke all on function private.is_active_staff() from public;
-- anon também precisa de EXECUTE: as policies de segments/formulas/formula_compositions
-- (leitura pública) avaliam is_active_staff() no predicado. Sem este grant, toda leitura
-- do anon falha com "permission denied for function is_active_staff". A função retorna
-- false para o anon (auth.uid() é null), então concedê-la é seguro.
grant execute on function private.is_active_staff() to anon, authenticated;


create or replace function private.can_manage_quotes()
returns boolean
language sql
security definer
stable
set search_path = pg_catalog, public
as $$
    select exists (
        select 1 from public.staff_profiles sp
        where sp.user_id = auth.uid() and sp.active and sp.can_manage_quotes
    );
$$;

comment on function private.can_manage_quotes() is 'true se o staff tem o "papel extra" (a antiga "senha extra") — controla a aba Orçamentos gerados inteira: ver, editar quantidade/preço, ver margem/lucro, ver histórico.';

revoke all on function private.can_manage_quotes() from public;
grant execute on function private.can_manage_quotes() to authenticated;


-- ---------------------------------------------------------------------------------
-- 1. SEGMENTS — leitura pública dos ativos, escrita só staff
-- ---------------------------------------------------------------------------------

alter table public.segments enable row level security;

grant select on public.segments to anon, authenticated;
grant insert, update on public.segments to authenticated;
-- sem GRANT de delete para ninguém via API — soft delete via UPDATE, físico só via
-- service_role (SQL editor/Dashboard), fora da API.

drop policy if exists segments_select on public.segments;
create policy segments_select on public.segments
    for select
    to anon, authenticated
    using (active or private.is_active_staff());

drop policy if exists segments_insert on public.segments;
create policy segments_insert on public.segments
    for insert
    to authenticated
    with check (private.is_active_staff());

drop policy if exists segments_update on public.segments;
create policy segments_update on public.segments
    for update
    to authenticated
    using (private.is_active_staff())
    with check (private.is_active_staff());


-- ---------------------------------------------------------------------------------
-- 2. FORMULAS — catálogo público (só fórmulas ativas para anon), escrita só staff
-- ---------------------------------------------------------------------------------

alter table public.formulas enable row level security;

grant select on public.formulas to anon, authenticated;
grant insert, update on public.formulas to authenticated;

drop policy if exists formulas_select on public.formulas;
create policy formulas_select on public.formulas
    for select
    to anon, authenticated
    using ((active and deleted_at is null) or private.is_active_staff());

drop policy if exists formulas_insert on public.formulas;
create policy formulas_insert on public.formulas
    for insert
    to authenticated
    with check (private.is_active_staff());

drop policy if exists formulas_update on public.formulas;
create policy formulas_update on public.formulas
    for update
    to authenticated
    using (private.is_active_staff())
    with check (private.is_active_staff());


-- ---------------------------------------------------------------------------------
-- 3. FORMULA_COMPOSITIONS — segue a visibilidade da fórmula-mãe
-- ---------------------------------------------------------------------------------

alter table public.formula_compositions enable row level security;

grant select on public.formula_compositions to anon, authenticated;
grant insert, update on public.formula_compositions to authenticated;

drop policy if exists formula_compositions_select on public.formula_compositions;
create policy formula_compositions_select on public.formula_compositions
    for select
    to anon, authenticated
    using (
        private.is_active_staff()
        or (
            deleted_at is null
            and exists (
                select 1 from public.formulas f
                where f.id = formula_id and f.active and f.deleted_at is null
            )
        )
    );

drop policy if exists formula_compositions_insert on public.formula_compositions;
create policy formula_compositions_insert on public.formula_compositions
    for insert
    to authenticated
    with check (private.is_active_staff());

drop policy if exists formula_compositions_update on public.formula_compositions;
create policy formula_compositions_update on public.formula_compositions
    for update
    to authenticated
    using (private.is_active_staff())
    with check (private.is_active_staff());


-- ---------------------------------------------------------------------------------
-- 4. FORMULA_COSTS — NUNCA público. Nem SELECT para anon.
-- ---------------------------------------------------------------------------------
-- Esta é a tabela que existe especificamente para não repetir o vazamento achado no
-- sistema atual (custo/margem hoje mora numa coluna da tabela pública "formulas" e
-- vaza para anon — ver schema-notas.md). anon não recebe grant NENHUM aqui — nem
-- select, nem insert, nem update. Só uma leitura possível fora do staff: dentro da
-- função SECURITY DEFINER public.fn_generate_quote (schema.sql), que lê com
-- privilégio próprio, sem depender de GRANT do chamador.

alter table public.formula_costs enable row level security;

grant select, insert, update on public.formula_costs to authenticated;

drop policy if exists formula_costs_select on public.formula_costs;
create policy formula_costs_select on public.formula_costs
    for select
    to authenticated
    using (private.is_active_staff());

drop policy if exists formula_costs_insert on public.formula_costs;
create policy formula_costs_insert on public.formula_costs
    for insert
    to authenticated
    with check (private.is_active_staff());

drop policy if exists formula_costs_update on public.formula_costs;
create policy formula_costs_update on public.formula_costs
    for update
    to authenticated
    using (private.is_active_staff())
    with check (private.is_active_staff());


-- ---------------------------------------------------------------------------------
-- 5. STAFF_PROFILES — só leitura pelo próprio staff. Escrita fora da API de propósito.
-- ---------------------------------------------------------------------------------
-- Não existe tela de "gestão de equipe" no organograma. Provisionar/promover staff
-- (inclusive marcar can_manage_quotes) é ação manual do dono via SQL/Dashboard —
-- de propósito, para nenhum staff conseguir se auto-promover via API.

alter table public.staff_profiles enable row level security;

grant select on public.staff_profiles to authenticated;
-- sem GRANT de insert/update/delete para authenticated — só service_role (bypassa RLS).

drop policy if exists staff_profiles_select on public.staff_profiles;
create policy staff_profiles_select on public.staff_profiles
    for select
    to authenticated
    using (private.is_active_staff());


-- ---------------------------------------------------------------------------------
-- 6. LEADS — dado pessoal (LGPD). anon não toca a tabela — só via fn_capture_lead.
-- ---------------------------------------------------------------------------------

alter table public.leads enable row level security;

grant select, update on public.leads to authenticated;
-- sem INSERT para ninguém via API direta (nem anon nem authenticated) — a única
-- porta de entrada é public.fn_capture_lead (SECURITY DEFINER, schema.sql), que
-- roda com privilégio próprio e não depende deste GRANT.

drop policy if exists leads_select on public.leads;
create policy leads_select on public.leads
    for select
    to authenticated
    using (private.is_active_staff());

drop policy if exists leads_update on public.leads;
create policy leads_update on public.leads
    for update
    to authenticated
    using (private.is_active_staff())
    with check (private.is_active_staff());


-- ---------------------------------------------------------------------------------
-- 7. QUOTES e 8. QUOTE_ITEMS — a aba inteira exige can_manage_quotes (a "senha extra")
-- ---------------------------------------------------------------------------------
-- anon não toca estas tabelas — só via fn_generate_quote. Staff comum (sem
-- can_manage_quotes) não vê nada aqui: nem a lista de orçamentos, nem preço de
-- venda, nem margem — exatamente como a aba "Orçamentos gerados, com senha extra"
-- do organograma.

alter table public.quotes enable row level security;
alter table public.quote_items enable row level security;

grant select, insert, update on public.quotes to authenticated;
grant select, insert, update on public.quote_items to authenticated;

drop policy if exists quotes_select on public.quotes;
create policy quotes_select on public.quotes
    for select
    to authenticated
    using (private.can_manage_quotes());

drop policy if exists quotes_insert on public.quotes;
create policy quotes_insert on public.quotes
    for insert
    to authenticated
    with check (private.can_manage_quotes());

drop policy if exists quotes_update on public.quotes;
create policy quotes_update on public.quotes
    for update
    to authenticated
    using (private.can_manage_quotes())
    with check (private.can_manage_quotes());

drop policy if exists quote_items_select on public.quote_items;
create policy quote_items_select on public.quote_items
    for select
    to authenticated
    using (private.can_manage_quotes());

drop policy if exists quote_items_insert on public.quote_items;
create policy quote_items_insert on public.quote_items
    for insert
    to authenticated
    with check (private.can_manage_quotes());

drop policy if exists quote_items_update on public.quote_items;
create policy quote_items_update on public.quote_items
    for update
    to authenticated
    using (private.can_manage_quotes())
    with check (private.can_manage_quotes());


-- ---------------------------------------------------------------------------------
-- 9. AUDIT_LOGS — só leitura, só staff. Nunca INSERT/UPDATE/DELETE via API.
-- ---------------------------------------------------------------------------------
-- A única escrita é o trigger private.tg_write_audit() (SECURITY DEFINER, roda
-- independente de GRANT). Nenhuma policy de insert/update/delete é criada de
-- propósito — RLS nega por padrão o que não tem policy.

alter table public.audit_logs enable row level security;

grant select on public.audit_logs to authenticated;

drop policy if exists audit_logs_select on public.audit_logs;
create policy audit_logs_select on public.audit_logs
    for select
    to authenticated
    using (private.is_active_staff());


-- ---------------------------------------------------------------------------------
-- 10. GRANT DE EXECUÇÃO NAS FUNÇÕES PÚBLICAS (RPC)
-- ---------------------------------------------------------------------------------
-- schema.sql já revogou o EXECUTE default de PUBLIC nestas duas funções — aqui
-- devolvemos só para quem deve chamar: o visitante anônimo do catálogo (carrinho
-- -> lead / orçamento) e, por conveniência, staff autenticado também (ex.: se um
-- dia o admin quiser gerar um orçamento manual usando a mesma função).

grant execute on function public.fn_capture_lead(text, text, jsonb) to anon, authenticated;
grant execute on function public.fn_generate_quote(text, text, jsonb, uuid) to anon, authenticated;


-- ---------------------------------------------------------------------------------
-- 11. REALTIME — só formulas e formula_compositions entram na publicação
-- ---------------------------------------------------------------------------------
-- Tabelas COM realtime: formulas, formula_compositions — o catálogo público reflete
-- ao vivo uma edição do admin (é o que "recarregando todos os navegadores" do
-- organograma já faz hoje, de forma mais bruta).
--
-- Tabelas DE PROPÓSITO FORA da publicação:
--   formula_costs   -> dado financeiro privado, nenhuma tela precisa disso ao vivo.
--   staff_profiles  -> define quem é admin; não deve transmitir.
--   leads           -> dado pessoal (LGPD) — minimizar canais de propagação.
--   quotes/quote_items -> dado financeiro + pessoal (nome/whatsapp do cliente).
--   audit_logs      -> ledger de auditoria, alto volume, sem uso de tela ao vivo.
-- Ver schema-notas.md para o raciocínio completo, inclusive a alternativa (RLS já
-- filtra o realtime por linha nas versões atuais do Supabase) e por que optei pela
-- posição mais conservadora mesmo assim.

do $$
begin
    if not exists (
        select 1 from pg_publication_tables
        where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'formulas'
    ) then
        alter publication supabase_realtime add table public.formulas;
    end if;
end $$;

do $$
begin
    if not exists (
        select 1 from pg_publication_tables
        where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'formula_compositions'
    ) then
        alter publication supabase_realtime add table public.formula_compositions;
    end if;
end $$;
