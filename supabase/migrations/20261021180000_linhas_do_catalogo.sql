-- =====================================================================================
-- LEMON CAPS - CATALOGO PUBLICO
-- 20261021180000_linhas_do_catalogo.sql
--
-- Pedido do dono em 21/10/2026: "ativar ou desativar essas duas categorias quando eu
-- quiser" (as abas Premium e Economica do catalogo). Uma linha por aba; enabled = false
-- esconde a aba inteira do site publico (catalogo, dossie e beneficios), sem mexer em
-- nenhuma formula: o "ativo" de cada formula continua valendo por si, e ao religar a
-- linha tudo volta como estava.
--
-- A tabela guarda so o estado das duas linhas em uso. A antiga 'basica' (encerrada em
-- 14/09/2026) nao entra: nao tem formula nem aba.
--
-- Leitura publica (anon): o catalogo precisa saber quais abas mostrar. Escrita so de
-- staff ativo, a mesma regra das demais tabelas de catalogo.
-- =====================================================================================

create table if not exists public.catalog_lines (
    line        public.product_line primary key,
    enabled     boolean not null default true,
    updated_at  timestamptz not null default now(),
    updated_by  uuid references auth.users (id)
);

comment on table public.catalog_lines is
  'Liga/desliga cada aba de linha do catalogo publico (premium, essencial = "Economica"). enabled=false esconde a aba e as formulas dela do site, sem alterar as formulas.';

insert into public.catalog_lines (line, enabled)
values ('premium', true), ('essencial', true)
on conflict (line) do nothing;

alter table public.catalog_lines enable row level security;

grant select on public.catalog_lines to anon, authenticated;
grant insert, update on public.catalog_lines to authenticated;

drop policy if exists catalog_lines_select on public.catalog_lines;
create policy catalog_lines_select on public.catalog_lines
    for select
    to anon, authenticated
    using (true);

drop policy if exists catalog_lines_insert on public.catalog_lines;
create policy catalog_lines_insert on public.catalog_lines
    for insert
    to authenticated
    with check (private.is_active_staff());

drop policy if exists catalog_lines_update on public.catalog_lines;
create policy catalog_lines_update on public.catalog_lines
    for update
    to authenticated
    using (private.is_active_staff())
    with check (private.is_active_staff());
