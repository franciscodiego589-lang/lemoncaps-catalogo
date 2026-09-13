-- Tira do papel `anon` (o visitante anônimo do site) todo privilégio nas tabelas
-- que ele nunca deve tocar.
--
-- Por que isto existe: o schema `public` do Supabase concede privilégios ao
-- `anon` por padrão em tabela nova. As policies de RLS que escrevemos já
-- barravam o acesso, e nenhum dado vazava, mas a proteção estava apoiada numa
-- camada só. A migration de RLS afirmava em comentário que o `anon` não tinha
-- "GRANT nenhum" em formula_costs; a checagem em pg_catalog mostrou o
-- contrário. Aqui a afirmação passa a ser verdade.
--
-- Um privilégio merece atenção especial: TRUNCATE NÃO é filtrado por RLS. Não
-- há endpoint REST que o exponha, então não era alcançável pela API, mas é
-- justamente o tipo de brecha que não se deixa aberta esperando a próxima
-- mudança de configuração.
--
-- As funções públicas de escrita (fn_capture_lead, fn_generate_quote) são
-- SECURITY DEFINER: rodam com o privilégio de quem as criou, não do chamador.
-- Revogar aqui não afeta o fluxo do carrinho.
--
-- Idempotente: REVOKE de privilégio inexistente não é erro.

revoke all on public.formula_costs  from anon;
revoke all on public.leads          from anon;
revoke all on public.quotes         from anon;
revoke all on public.quote_items    from anon;
revoke all on public.staff_profiles from anon;
revoke all on public.audit_logs     from anon;

-- O catálogo é público: aqui o anon precisa mesmo de leitura, e só dela.
revoke all    on public.formulas             from anon;
revoke all    on public.formula_compositions from anon;
revoke all    on public.segments             from anon;
revoke all    on public.ingredients          from anon;
grant  select on public.formulas             to   anon;
grant  select on public.formula_compositions to   anon;
grant  select on public.segments             to   anon;
grant  select on public.ingredients          to   anon;

-- Impede que a próxima tabela criada no schema nasça com o mesmo problema.
alter default privileges in schema public revoke all on tables from anon;

-- A view de totais de orçamento carrega nome e WhatsApp do cliente e valores.
-- Ela usa security_invoker (respeita a RLS de quem consulta), mas o grant em si
-- não tinha razão de existir para o público.
revoke all on public.quote_summaries from anon;
