-- =====================================================================================
-- LEMON CAPS — CATÁLOGO PÚBLICO (reconstrução fora do Lovable)
-- schema.sql — DDL completo: extensões, tipos, tabelas, constraints, índices, triggers.
--
-- ORDEM DE EXECUÇÃO: 1) este arquivo   2) rls-policies.sql
-- Este arquivo só cria estrutura (SEM RLS ainda) — as políticas ficam no outro arquivo
-- de propósito, para deixar "o que existe" separado de "quem pode acessar o quê".
--
-- Empresa única (Lemon Caps). NÃO há tenant_id/company_id — decisão explícita do dono,
-- este não é o padrão multi-tenant usado em outros projetos do mesmo dono.
--
-- Este schema foi conferido contra a fonte primária real (banco de produção do
-- catálogo atual, lido em 2026-09-09 via chave anon pública — ver dados-catalogo-atual
-- .json/.md nesta mesma pasta) e não só contra a descrição do organograma. Onde os
-- dois divergiram, o dado real do banco venceu. Decisões inferidas (não confirmadas
-- pelo dono) estão marcadas "DECISÃO MINHA" em comentário, ao lado.
-- =====================================================================================


-- ---------------------------------------------------------------------------------
-- 0. EXTENSÕES
-- ---------------------------------------------------------------------------------

create extension if not exists pgcrypto;   -- gen_random_uuid() — nativo desde PG13, mantido por compatibilidade
create extension if not exists hstore;     -- diff genérico OLD/NEW dentro do trigger de auditoria
create extension if not exists pg_trgm;    -- busca por nome (ILIKE) em fórmulas e leads, ver seção "busca" no organograma


-- ---------------------------------------------------------------------------------
-- 1. SCHEMA INTERNO — não exposto pela Data API do Supabase
-- ---------------------------------------------------------------------------------
-- Por padrão o Supabase só expõe o schema "public" (e "graphql_public") via PostgREST.
-- Qualquer outro schema, como este "private", fica automaticamente inacessível pela
-- API — não precisa de configuração extra, só não adicionar "private" na lista de
-- "Exposed schemas" do Dashboard. É aqui que moram os triggers estruturais (esta
-- seção). Os PREDICADOS de RLS (quem é staff, quem pode ver orçamento) ficam no
-- mesmo schema "private", mas são criados em rls-policies.sql — de propósito, para
-- manter a lógica de acesso toda num arquivo só.

create schema if not exists private;
comment on schema private is 'Funções internas (triggers estruturais + predicados de RLS). Nunca exposto via PostgREST.';


-- ---------------------------------------------------------------------------------
-- 2. ENUMS
-- ---------------------------------------------------------------------------------

do $$ begin
    create type public.product_line as enum ('premium', 'basica');
exception when duplicate_object then null;
end $$;
comment on type public.product_line is 'Linha comercial da fórmula — vira as abas Premium/Básicas no catálogo. Hoje é binário (confirmado nos 29 registros reais: 22 premium / 7 basica); se um dia existir 3ª linha, dá para ALTER TYPE ADD VALUE.';

do $$ begin
    create type public.product_format as enum ('capsula', 'soluvel', 'gummy', 'liquido');
exception when duplicate_object then null;
end $$;
comment on type public.product_format is 'Classificação limpa do formato físico, para filtro/UI. É uma NORMALIZAÇÃO do texto regulatório real (ex.: "SUPLEMENTO ALIMENTAR EM GOMA" -> gummy) — o texto original fica preservado em formulas.regulatory_product_type. DECISÃO MINHA: mapeamento a conferir na migração.';

do $$ begin
    create type public.composition_unit as enum ('g', 'mg', 'mcg', 'ml', 'l', 'ui', 'kg');
exception when duplicate_object then null;
end $$;
comment on type public.composition_unit is 'Unidades aceitas na composição por dose, exatamente as pedidas: g, mg, mcg, ml, L, UI, kg. "ui" = Unidades Internacionais; "l" = litro (maiúsculo é só exibição no front).';


-- ---------------------------------------------------------------------------------
-- 3. AUDITORIA — tabela + função genérica de trigger
-- ---------------------------------------------------------------------------------
-- Criada antes das tabelas de negócio porque os triggers de todas elas apontam
-- para cá. É um livro-razão (ledger): nunca tem UPDATE nem DELETE nem soft delete
-- próprio — só INSERT, feito pelo próprio trigger.

create table if not exists public.audit_logs (
    id           bigint generated always as identity primary key,
    table_name   text        not null,
    record_id    uuid        not null,
    action       text        not null check (action in ('INSERT','UPDATE','SOFT_DELETE','RESTORE','DELETE')),
    changed_fields text[],                       -- nomes das colunas que mudaram (diff via hstore)
    old_data     jsonb,
    new_data     jsonb,
    actor_id     uuid references auth.users(id),
    actor_email  text,                           -- snapshot do e-mail no momento (auth.users pode mudar/sumir depois)
    created_at   timestamptz not null default now()
);

comment on table public.audit_logs is 'Trilha de auditoria genérica de todas as tabelas de negócio. Alimenta o "histórico das alterações salvas" da tela de Orçamentos, e serve para qualquer outra tabela. Nunca é editado nem apagado pela aplicação.';
comment on column public.audit_logs.action is 'INSERT/UPDATE/DELETE = TG_OP puro. SOFT_DELETE/RESTORE = refinamento feito pelo trigger quando detecta transição de deleted_at (null->preenchido ou preenchido->null).';

create index if not exists idx_audit_logs_table_record on public.audit_logs (table_name, record_id, created_at desc);
create index if not exists idx_audit_logs_actor on public.audit_logs (actor_id);
create index if not exists idx_audit_logs_created_at on public.audit_logs (created_at desc);


-- Função de trigger: preenche created_at/updated_at/created_by/updated_by/deleted_by
-- sozinha. A aplicação só precisa fazer UPDATE ... SET deleted_at = now(),
-- reason_deleted = '...' para soft-deletar — o "quem" (deleted_by) o trigger resolve
-- via auth.uid().
create or replace function private.tg_touch_row()
returns trigger
language plpgsql
security invoker
set search_path = pg_catalog, public
as $$
begin
    if TG_OP = 'INSERT' then
        new.created_at := coalesce(new.created_at, now());
        new.updated_at := now();
        new.created_by := coalesce(new.created_by, auth.uid());
        new.updated_by := auth.uid();
        return new;
    end if;

    -- UPDATE
    new.updated_at := now();
    new.updated_by := auth.uid();

    -- transição para soft-deletado agora: registra quem apagou
    if old.deleted_at is null and new.deleted_at is not null then
        new.deleted_by := auth.uid();
    end if;

    -- restauração (deleted_at voltou a null): limpa a autoria do delete anterior
    if old.deleted_at is not null and new.deleted_at is null then
        new.deleted_by := null;
        new.reason_deleted := null;
    end if;

    return new;
end;
$$;

comment on function private.tg_touch_row() is 'BEFORE INSERT OR UPDATE em toda tabela de negócio. Preenche created_at/updated_at/created_by/updated_by/deleted_by automaticamente a partir de auth.uid() — a aplicação nunca precisa passar esses campos.';


-- Função de trigger: grava uma linha em audit_logs a cada INSERT/UPDATE/DELETE.
-- SECURITY DEFINER de propósito: assim funciona mesmo que o papel "authenticated"
-- não tenha GRANT direto de INSERT em audit_logs (e não tem — ver rls-policies.sql).
-- search_path fixo é obrigatório em toda função SECURITY DEFINER (proteção contra
-- sequestro de search_path).
create or replace function private.tg_write_audit()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
    v_action text;
    v_old jsonb;
    v_new jsonb;
    v_changed text[];
    v_record_id uuid;
    v_actor_email text;
begin
    if TG_OP = 'DELETE' then
        v_action := 'DELETE';                 -- só acontece se alguém rodar DELETE físico via service_role
        v_old := to_jsonb(old);
        v_new := null;
        v_record_id := old.id;
    elsif TG_OP = 'INSERT' then
        v_action := 'INSERT';
        v_old := null;
        v_new := to_jsonb(new);
        v_record_id := new.id;
    else -- UPDATE
        v_old := to_jsonb(old);
        v_new := to_jsonb(new);
        v_record_id := new.id;
        v_changed := akeys(hstore(new) - hstore(old));

        if old.deleted_at is null and new.deleted_at is not null then
            v_action := 'SOFT_DELETE';
        elsif old.deleted_at is not null and new.deleted_at is null then
            v_action := 'RESTORE';
        else
            v_action := 'UPDATE';
        end if;
    end if;

    select email into v_actor_email from auth.users where id = auth.uid();

    insert into public.audit_logs
        (table_name, record_id, action, changed_fields, old_data, new_data, actor_id, actor_email)
    values
        (TG_TABLE_NAME, v_record_id, v_action, v_changed, v_old, v_new, auth.uid(), v_actor_email);

    return coalesce(new, old);
end;
$$;

comment on function private.tg_write_audit() is 'AFTER INSERT OR UPDATE OR DELETE em toda tabela de negócio. Grava old/new (jsonb) + colunas alteradas (via hstore) em public.audit_logs. SECURITY DEFINER porque authenticated não tem GRANT direto em audit_logs.';

revoke all on function private.tg_write_audit() from public;


-- ---------------------------------------------------------------------------------
-- 4. SEGMENTS — taxonomia de segmentos (Libido, Energia, Beleza, ...)
-- ---------------------------------------------------------------------------------
-- Tabela, não enum: os nomes reais são frases ("Beleza e bem-estar", "Energia e
-- disposição" — confirmado no banco de produção, mais longos que o resumo do
-- organograma) e o catálogo precisa listar TODOS os segmentos como chips de filtro
-- mesmo quando 0 fórmulas pertencem a ele hoje (confirmado: Libido e Pele existem
-- no filtro do site com 0 produtos agora). Enum exigiria migração para reordenar/
-- renomear; tabela não.

create table if not exists public.segments (
    id              uuid primary key default gen_random_uuid(),
    slug            text not null unique,
    name            text not null,
    sort_order      integer not null default 0,
    active          boolean not null default true,
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now(),
    deleted_at      timestamptz,
    deleted_by      uuid references auth.users(id),
    reason_deleted  text,
    created_by      uuid references auth.users(id),
    updated_by      uuid references auth.users(id),
    constraint segments_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

comment on table public.segments is 'Segmentos do catálogo (chips de filtro). Tabela, não enum — nomes reais confirmados no banco de produção são frases, não palavras únicas.';

create or replace trigger trg_segments_touch before insert or update on public.segments
    for each row execute function private.tg_touch_row();
create or replace trigger trg_segments_audit after insert or update or delete on public.segments
    for each row execute function private.tg_write_audit();

create index if not exists idx_segments_active_sort on public.segments (sort_order) where deleted_at is null;

-- Seed dos 10 segmentos conhecidos hoje (nomes conferidos no banco real onde havia
-- produto; Libido e Pele não têm produto hoje mas aparecem no filtro do site — nomes
-- desses dois são DECISÃO MINHA/aproximação, confirmar texto exato com o dono).
insert into public.segments (slug, name, sort_order) values
    ('libido',          'Libido',                    10),
    ('energia',         'Energia e disposição',       20),
    ('foco',            'Foco e concentração',        30),
    ('beleza',          'Beleza e bem-estar',         40),
    ('sono',            'Qualidade do sono',          50),
    ('emagrecimento',   'Emagrecimento',              60),
    ('digestivo',       'Sistema digestivo',          70),
    ('articulacoes',    'Dores articulares',          80),
    ('pele',            'Pele',                       90),
    ('imunidade',       'Imunidade',                  100)
on conflict (slug) do nothing;


-- ---------------------------------------------------------------------------------
-- 5. FORMULAS — o núcleo do catálogo (produto/fórmula)
-- ---------------------------------------------------------------------------------
-- Só campos PÚBLICOS ficam aqui. Custo real de produção e qualquer nota financeira
-- vivem em formula_costs (tabela separada, nunca lida pelo anon) — ver seção 7 e a
-- nota de segurança no topo de schema-notas.md: a coluna "notes" do banco ATUAL usa
-- essa mesma tabela pública para guardar % de margem em texto livre, e hoje vaza para
-- a role anon (achado real, 9 de 29 fórmulas, ver schema-notas.md). Esta tabela nova
-- não tem NENHUM campo financeiro, de propósito — para esse tipo de vazamento não
-- poder se repetir por engano de RLS.

create table if not exists public.formulas (
    id                      uuid primary key default gen_random_uuid(),
    slug                    text not null unique,               -- NOVO: não existe no sistema atual, para URL amigável (DECISÃO MINHA)
    name                    text not null,
    segment_id              uuid not null references public.segments(id) on delete restrict,
    line                    public.product_line not null,
    format                  public.product_format not null,
    regulatory_product_type text,                                -- texto regulatório cru (ex.: "SUPLEMENTO ALIMENTAR EM GOMA"), para rótulo/dossiê
    pote_contents_description text,                               -- ex.: "60 Gummys", "150g" — mantido como texto: formato de origem é inconsistente demais para separar quantidade+unidade sem revisão manual
    net_weight              text,                                 -- peso líquido; hoje vazio em 28 dos 29 registros reais, mantido por paridade
    capsule_count           integer,                              -- contagem de cápsulas/unidades por pote, quando aplicável (coluna real, hoje esparsa)
    description             text not null default '',
    serving_description     text,                                 -- o que é "1 dose" fisicamente (ex.: "2 cápsulas") — DECISÃO MINHA: inferido de "composição por dose", não nomeado explicitamente no organograma
    nutritional_info        text,
    ingredients_list        text,                                 -- declaração completa de ingredientes (INCI), diferente da composição por dose ativa
    usage_instructions      text,
    benefits                text[] not null default '{}',
    general_benefits_summary text,
    warnings                text,
    target_audience         text,
    storage_instructions    text,
    technical_sheet_title   text,
    list_price_cents        integer check (list_price_cents >= 0),  -- preço público por pote, em centavos — ver schema-notas.md sobre a escolha de centavos
    minimum_order_potes     integer not null default 100 check (minimum_order_potes > 0),
    sort_order              integer not null default 0,
    active                  boolean not null default true,
    version                 integer not null default 1,
    metadata                jsonb not null default '{}'::jsonb,
    created_at              timestamptz not null default now(),
    updated_at              timestamptz not null default now(),
    deleted_at              timestamptz,
    deleted_by              uuid references auth.users(id),
    reason_deleted          text,
    created_by              uuid references auth.users(id),
    updated_by              uuid references auth.users(id),
    constraint formulas_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
    constraint formulas_active_requires_price check (not active or list_price_cents is not null)
);

comment on table public.formulas is 'Catálogo público de fórmulas. Só dados públicos — nenhum campo de custo/margem/nota financeira mora aqui (isso é de propósito, ver formula_costs).';
comment on column public.formulas.list_price_cents is 'Preço público por pote, em centavos (BRL). Confirmado na fonte primária (dados-catalogo-atual.json) que a coluna atual "unit_cost" é, na prática, este preço público — não um custo interno de produção.';
comment on column public.formulas.minimum_order_potes is 'Mínimo de potes por pedido. Hoje sempre 100 nos 29 registros reais, mas é coluna por fórmula (não uma constante fixa) — mantido assim para caso o mínimo varie por fórmula no futuro.';
comment on column public.formulas.slug is 'Não existe no banco atual — campo novo para URL amigável (/catalogo/produto-slug). Gerar via slugify(name) na migração, tratando colisão.';
comment on constraint formulas_active_requires_price on public.formulas is 'Trava de integridade: uma fórmula não pode ficar pública (active=true) sem preço definido — evita publicar rascunho sem preço (caso real observado: registro "LIDEMA" na base atual, ver schema-notas.md).';

create or replace trigger trg_formulas_touch before insert or update on public.formulas
    for each row execute function private.tg_touch_row();
create or replace trigger trg_formulas_audit after insert or update or delete on public.formulas
    for each row execute function private.tg_write_audit();

create index if not exists idx_formulas_segment on public.formulas (segment_id) where deleted_at is null;
create index if not exists idx_formulas_line on public.formulas (line) where deleted_at is null;
create index if not exists idx_formulas_format on public.formulas (format) where deleted_at is null;
create index if not exists idx_formulas_public_listing on public.formulas (sort_order) where active and deleted_at is null;
create index if not exists idx_formulas_name_trgm on public.formulas using gin (name gin_trgm_ops);


-- ---------------------------------------------------------------------------------
-- 6. FORMULA_COMPOSITIONS — composição por dose (Insumo + Quantidade NUMÉRICA + Unidade)
-- ---------------------------------------------------------------------------------
-- Requisito explícito do dono: "quantidade NUMÉRICA com unidade separada (nada de
-- texto solto), porque o sistema converte e soma". O banco ATUAL guarda isso como UM
-- texto só (ex.: "Vitamina C (ácido ascórbico) 45 mg; vitamina E ... 16,7 mg; ...") —
-- corrigido aqui. Ver schema-notas.md para o plano de migração/parsing desse texto.

create table if not exists public.formula_compositions (
    id              uuid primary key default gen_random_uuid(),
    formula_id      uuid not null references public.formulas(id) on delete cascade,
    ingredient_name text not null,
    quantity        numeric(12,4) not null check (quantity > 0),
    unit            public.composition_unit not null,
    sort_order      integer not null default 0,
    active          boolean not null default true,
    version         integer not null default 1,
    metadata        jsonb not null default '{}'::jsonb,
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now(),
    deleted_at      timestamptz,
    deleted_by      uuid references auth.users(id),
    reason_deleted  text,
    created_by      uuid references auth.users(id),
    updated_by      uuid references auth.users(id)
);

comment on table public.formula_compositions is 'Linhas da tabela de composição por dose de cada fórmula. Substitui o texto livre único do sistema atual por linha estruturada (insumo, quantidade numérica, unidade).';
comment on column public.formula_compositions.ingredient_name is 'Nome do insumo tal como deve aparecer na tabela de composição (ex.: "Vitamina C (ácido ascórbico)"). Não normalizado contra um catálogo de insumos — DECISÃO MINHA/YAGNI: normalizar em tabela própria só se a Lemon Caps precisar analisar uso de insumo entre fórmulas.';
comment on column public.formula_compositions.quantity is 'Quantidade NUMÉRICA por dose. Na migração, texto como "16,7 mg" (vírgula decimal) precisa virar 16.7 — ver schema-notas.md, é um passo manual/revisado, não 100% automatizável com segurança.';

create or replace trigger trg_formula_compositions_touch before insert or update on public.formula_compositions
    for each row execute function private.tg_touch_row();
create or replace trigger trg_formula_compositions_audit after insert or update or delete on public.formula_compositions
    for each row execute function private.tg_write_audit();

create index if not exists idx_formula_compositions_formula on public.formula_compositions (formula_id, sort_order) where deleted_at is null;


-- ---------------------------------------------------------------------------------
-- 7. FORMULA_COSTS — custo real de produção por pote (NUNCA público)
-- ---------------------------------------------------------------------------------
-- Tabela nova, separada de "formulas" de propósito: RLS por tabela é mais simples e
-- mais difícil de errar do que RLS por coluna. anon não tem GRANT nenhum aqui (nem
-- SELECT) — ver rls-policies.sql. Existe hoje: NENHUM dado de custo real migrável
-- diretamente (o banco atual só tem o preço público "unit_cost" + 9 anotações de
-- margem em texto livre na coluna "notes", que hoje VAZAM para anon — achado de
-- segurança real, ver schema-notas.md). unit_cost_cents nasce NULL para a maioria e
-- precisa ser preenchido manualmente pelo dono após a migração.

create table if not exists public.formula_costs (
    id              uuid primary key default gen_random_uuid(),
    formula_id      uuid not null unique references public.formulas(id) on delete cascade,
    unit_cost_cents integer check (unit_cost_cents >= 0),    -- NULL = custo real ainda não cadastrado
    internal_notes  text,                                     -- substitui o uso indevido da antiga coluna pública "notes"
    version         integer not null default 1,
    metadata        jsonb not null default '{}'::jsonb,
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now(),
    deleted_at      timestamptz,
    deleted_by      uuid references auth.users(id),
    reason_deleted  text,
    created_by      uuid references auth.users(id),
    updated_by      uuid references auth.users(id)
);

comment on table public.formula_costs is 'Custo real de produção por pote + notas internas. Tabela 100% privada (staff only) — nunca deve ganhar GRANT para anon. Existe separada de "formulas" especificamente para tornar estruturalmente impossível repetir o vazamento encontrado no sistema atual (coluna "notes" pública com % de margem, legível por anon).';
comment on column public.formula_costs.unit_cost_cents is 'Custo real de produção por pote, em centavos. Sem dado de origem confiável na migração (ver schema-notas.md) — permanece NULL até o dono preencher.';

create or replace trigger trg_formula_costs_touch before insert or update on public.formula_costs
    for each row execute function private.tg_touch_row();
create or replace trigger trg_formula_costs_audit after insert or update or delete on public.formula_costs
    for each row execute function private.tg_write_audit();


-- ---------------------------------------------------------------------------------
-- 8. STAFF_PROFILES — quem é admin, e quem tem o "papel extra" de orçamento/margem
-- ---------------------------------------------------------------------------------
-- Substitui a senha fixa "0212" (cliente) por Supabase Auth de verdade. Extensão 1:1
-- de auth.users. Não existe uma tela de "gestão de equipe" descrita no organograma —
-- provisionamento de novo staff é manual (dono, via SQL/Dashboard), de propósito,
-- para não abrir uma porta de auto-escalação de privilégio (ver rls-policies.sql:
-- não há política de INSERT/UPDATE para authenticated nesta tabela).

create table if not exists public.staff_profiles (
    user_id             uuid primary key references auth.users(id) on delete cascade,
    full_name           text not null,
    can_manage_quotes   boolean not null default false,   -- o "papel extra"/"senha extra" da aba Orçamentos
    active              boolean not null default true,
    created_at          timestamptz not null default now(),
    updated_at          timestamptz not null default now(),
    created_by          uuid references auth.users(id),
    updated_by          uuid references auth.users(id)
);

comment on table public.staff_profiles is 'Quem é admin (presença nesta tabela + active=true) e quem enxerga/edita orçamento e margem (can_manage_quotes). Provisionamento é manual/fora do app — decisão minha, para não existir rota de auto-promoção de privilégio.';
comment on column public.staff_profiles.can_manage_quotes is 'Substitui a "senha extra" da aba Orçamentos gerados. Quem não tiver esta flag não vê a aba nem os dados de preço de venda/margem/lucro.';

create or replace trigger trg_staff_profiles_touch before insert or update on public.staff_profiles
    for each row execute function private.tg_touch_row();
create or replace trigger trg_staff_profiles_audit after insert or update or delete on public.staff_profiles
    for each row execute function private.tg_write_audit();


-- ---------------------------------------------------------------------------------
-- 9. LEADS — nome + WhatsApp + retrato do carrinho no momento da conversão
-- ---------------------------------------------------------------------------------
-- O carrinho "vivo" mora em localStorage no navegador do visitante (ver
-- schema-notas.md) — aqui só entra uma FOTO do carrinho no momento em que o
-- visitante informa nome+WhatsApp (ex.: antes de copiar o pedido/baixar o PDF).
-- Dado pessoal real (LGPD) — sem política de INSERT direto para anon: toda
-- criação passa pela função public.fn_capture_lead (ver seção 12), nunca INSERT
-- direto na tabela. Isso mantém leitura e escrita da tabela 100% staff-only.

create table if not exists public.leads (
    id              uuid primary key default gen_random_uuid(),
    name            text not null,
    whatsapp        text not null check (whatsapp ~ '^\+?[0-9]{10,15}$'),
    cart_snapshot   jsonb not null default '[]'::jsonb,
    version         integer not null default 1,
    metadata        jsonb not null default '{}'::jsonb,
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now(),
    deleted_at      timestamptz,
    deleted_by      uuid references auth.users(id),
    reason_deleted  text,
    created_by      uuid references auth.users(id),
    updated_by      uuid references auth.users(id)
);

comment on table public.leads is 'Nome + WhatsApp + retrato do carrinho de quem converteu no site. Dado pessoal real (LGPD) — ver schema-notas.md para retenção/acesso, que ficou PENDENTE de definição com o dono. Criação só via public.fn_capture_lead, nunca INSERT direto (nem para anon nem para authenticated).';
comment on column public.leads.cart_snapshot is 'Retrato (não referência viva) dos itens do carrinho no momento da conversão: [{formula_id, formula_name, quantity_potes, unit_price_cents}, ...]. Congelado de propósito — se a fórmula mudar de nome/preço depois, o retrato do lead não deve mudar.';

create or replace trigger trg_leads_touch before insert or update on public.leads
    for each row execute function private.tg_touch_row();
create or replace trigger trg_leads_audit after insert or update or delete on public.leads
    for each row execute function private.tg_write_audit();

create index if not exists idx_leads_created_at on public.leads (created_at desc) where deleted_at is null;
create index if not exists idx_leads_name_trgm on public.leads using gin (name gin_trgm_ops);
create index if not exists idx_leads_whatsapp on public.leads (whatsapp);


-- ---------------------------------------------------------------------------------
-- 10. QUOTES — orçamento gerado (cabeçalho)
-- ---------------------------------------------------------------------------------
-- "Gerados" = criados a partir do fluxo público (carrinho -> baixar PDF), via
-- public.fn_generate_quote (seção 12) — nunca INSERT direto por anon. Toda a aba
-- (ver+editar quantidade/preço+margem+histórico) exige can_manage_quotes.

create table if not exists public.quotes (
    id                  uuid primary key default gen_random_uuid(),
    quote_number        bigint generated always as identity,
    lead_id             uuid references public.leads(id) on delete set null,
    customer_name       text not null,
    customer_whatsapp   text not null check (customer_whatsapp ~ '^\+?[0-9]{10,15}$'),
    version             integer not null default 1,
    metadata            jsonb not null default '{}'::jsonb,
    created_at          timestamptz not null default now(),
    updated_at          timestamptz not null default now(),
    deleted_at          timestamptz,
    deleted_by          uuid references auth.users(id),
    reason_deleted      text,
    created_by          uuid references auth.users(id),
    updated_by          uuid references auth.users(id)
);

comment on table public.quotes is 'Cabeçalho de orçamento gerado a partir do carrinho público. quote_number é o número amigável (sequencial) para referenciar em conversa/WhatsApp — não existe no sistema atual, DECISÃO MINHA inspirada no padrão de protocolo que o dono já usa em outro projeto, confirmar se quer manter.';

create unique index if not exists uq_quotes_quote_number on public.quotes (quote_number);

create or replace trigger trg_quotes_touch before insert or update on public.quotes
    for each row execute function private.tg_touch_row();
create or replace trigger trg_quotes_audit after insert or update or delete on public.quotes
    for each row execute function private.tg_write_audit();

create index if not exists idx_quotes_lead on public.quotes (lead_id);
create index if not exists idx_quotes_created_at on public.quotes (created_at desc) where deleted_at is null;


-- ---------------------------------------------------------------------------------
-- 11. QUOTE_ITEMS — linhas do orçamento (quantidade, custo e preço "congelados")
-- ---------------------------------------------------------------------------------
-- Margem/lucro em "tempo real" = colunas GERADAS pelo Postgres (recalculadas a cada
-- UPDATE, nunca ficam desatualizadas, nunca dependem de o front acertar a conta em
-- ponto flutuante). unit_cost_cents é o custo "congelado" no momento do orçamento
-- (cópia de formula_costs.unit_cost_cents) — se o custo real mudar depois, o
-- orçamento antigo não muda sozinho (senão o histórico perderia sentido).

create table if not exists public.quote_items (
    id                  uuid primary key default gen_random_uuid(),
    quote_id            uuid not null references public.quotes(id) on delete cascade,
    formula_id          uuid not null references public.formulas(id) on delete restrict,
    formula_name_snapshot text not null,
    quantity_potes      integer not null check (quantity_potes > 0),
    unit_cost_cents     integer check (unit_cost_cents >= 0),   -- NULL = custo real desconhecido no momento (ver formula_costs)
    unit_price_cents    integer not null check (unit_price_cents >= 0),

    -- colunas geradas: nunca gravadas pela aplicação, sempre coerentes com as 3 acima
    line_total_cents    bigint generated always as (quantity_potes::bigint * unit_price_cents) stored,
    line_cost_cents     bigint generated always as (
                            case when unit_cost_cents is null then null
                                 else quantity_potes::bigint * unit_cost_cents
                            end
                         ) stored,
    profit_cents        bigint generated always as (
                            case when unit_cost_cents is null then null
                                 else quantity_potes::bigint * (unit_price_cents - unit_cost_cents)
                            end
                         ) stored,
    profit_margin_pct   numeric(7,4) generated always as (
                            case when unit_cost_cents is null or unit_price_cents = 0 then null
                                 else round(((unit_price_cents - unit_cost_cents)::numeric / unit_price_cents::numeric) * 100, 4)
                            end
                         ) stored,

    sort_order          integer not null default 0,
    version             integer not null default 1,
    metadata            jsonb not null default '{}'::jsonb,
    created_at          timestamptz not null default now(),
    updated_at          timestamptz not null default now(),
    deleted_at          timestamptz,
    deleted_by          uuid references auth.users(id),
    reason_deleted      text,
    created_by          uuid references auth.users(id),
    updated_by          uuid references auth.users(id)
);

comment on table public.quote_items is 'Linhas do orçamento. quantity_potes/unit_cost_cents/unit_price_cents são editáveis (aba Orçamentos, exige can_manage_quotes); as 4 colunas seguintes são GERADAS pelo Postgres — "margem e lucro em tempo real" do organograma é literal aqui: recalculado a cada UPDATE, nunca cai fora de sincronia.';
comment on column public.quote_items.unit_cost_cents is 'Custo "congelado" no momento do orçamento (cópia de formula_costs.unit_cost_cents). Fica NULL se a fórmula ainda não tinha custo real cadastrado — nesse caso profit_cents/profit_margin_pct também ficam NULL (não é para exibir 0% nem estimar).';
comment on column public.quote_items.profit_margin_pct is 'Margem sobre o preço de venda: (preço - custo) / preço * 100. NULL quando o custo é desconhecido ou o preço é 0 — nunca aproximado.';

create or replace trigger trg_quote_items_touch before insert or update on public.quote_items
    for each row execute function private.tg_touch_row();
create or replace trigger trg_quote_items_audit after insert or update or delete on public.quote_items
    for each row execute function private.tg_write_audit();

create index if not exists idx_quote_items_quote on public.quote_items (quote_id, sort_order) where deleted_at is null;
create index if not exists idx_quote_items_formula on public.quote_items (formula_id);


-- Trigger de validação: mínimo de potes é POR FÓRMULA (formulas.minimum_order_potes),
-- não uma constante fixa — por isso não dá para ser um CHECK simples (CHECK não
-- pode consultar outra tabela). Vale tanto para o fluxo público (fn_generate_quote)
-- quanto para edição manual do item pelo admin.
create or replace function private.tg_enforce_minimum_order()
returns trigger
language plpgsql
security invoker
set search_path = pg_catalog, public
as $$
declare
    v_minimo integer;
begin
    select minimum_order_potes into v_minimo
    from public.formulas
    where id = new.formula_id;

    if v_minimo is not null and new.quantity_potes < v_minimo then
        raise exception 'quantidade % abaixo do mínimo de % potes para esta fórmula', new.quantity_potes, v_minimo
            using errcode = '23514'; -- check_violation
    end if;

    return new;
end;
$$;

comment on function private.tg_enforce_minimum_order() is 'Trava o mínimo de potes por fórmula (hoje sempre 100, mas lido de formulas.minimum_order_potes, não fixo). Backstop de banco para a regra "MÍNIMO DE 100 POTES" do organograma — o front já deve impedir isso antes, isto é defesa em profundidade.';

create or replace trigger trg_quote_items_min_order before insert or update of formula_id, quantity_potes on public.quote_items
    for each row execute function private.tg_enforce_minimum_order();


-- ---------------------------------------------------------------------------------
-- 12. FUNÇÕES DE ESCRITA PÚBLICA (RPC) — únicos pontos de entrada do anon
-- ---------------------------------------------------------------------------------
-- anon NUNCA tem GRANT de INSERT direto em leads/quotes/quote_items (ver
-- rls-policies.sql). Toda criação a partir do site público passa por uma destas
-- duas funções SECURITY DEFINER — validação central, e nenhuma tabela sensível
-- fica um INSERT distante de ficar gravável por qualquer um.

create or replace function public.fn_capture_lead(
    p_name text,
    p_whatsapp text,
    p_cart_snapshot jsonb default '[]'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
    v_lead_id uuid;
begin
    if p_name is null or btrim(p_name) = '' then
        raise exception 'nome é obrigatório';
    end if;
    if p_whatsapp is null or p_whatsapp !~ '^\+?[0-9]{10,15}$' then
        raise exception 'whatsapp inválido';
    end if;

    insert into public.leads (name, whatsapp, cart_snapshot)
    values (btrim(p_name), p_whatsapp, coalesce(p_cart_snapshot, '[]'::jsonb))
    returning id into v_lead_id;

    return v_lead_id;
end;
$$;

comment on function public.fn_capture_lead is 'Único ponto de entrada para criar um lead a partir do site público (anon). Valida nome/whatsapp antes de gravar. Não expõe a tabela leads para escrita direta.';

revoke all on function public.fn_capture_lead(text, text, jsonb) from public;


create or replace function public.fn_generate_quote(
    p_customer_name text,
    p_customer_whatsapp text,
    p_items jsonb,                    -- [{"formula_id": "...", "quantity_potes": 100}, ...]
    p_lead_id uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
    v_quote_id uuid;
    v_item jsonb;
    v_formula record;
    v_cost integer;
begin
    if p_customer_name is null or btrim(p_customer_name) = '' then
        raise exception 'nome do cliente é obrigatório';
    end if;
    if p_customer_whatsapp is null or p_customer_whatsapp !~ '^\+?[0-9]{10,15}$' then
        raise exception 'whatsapp inválido';
    end if;
    if p_items is null or jsonb_array_length(p_items) = 0 then
        raise exception 'orçamento precisa de ao menos um item';
    end if;

    insert into public.quotes (lead_id, customer_name, customer_whatsapp)
    values (p_lead_id, btrim(p_customer_name), p_customer_whatsapp)
    returning id into v_quote_id;

    for v_item in select * from jsonb_array_elements(p_items)
    loop
        select f.id, f.name, f.list_price_cents, f.minimum_order_potes, f.active
        into v_formula
        from public.formulas f
        where f.id = (v_item->>'formula_id')::uuid
          and f.deleted_at is null;

        if v_formula.id is null then
            raise exception 'fórmula % não encontrada', v_item->>'formula_id';
        end if;
        if not v_formula.active then
            raise exception 'fórmula % não está ativa', v_formula.name;
        end if;
        if v_formula.list_price_cents is null then
            raise exception 'fórmula % não tem preço público definido', v_formula.name;
        end if;

        -- custo real é lido aqui com privilégio elevado (SECURITY DEFINER) mesmo que
        -- anon não tenha nenhum GRANT em formula_costs — é exatamente para isso que
        -- esta função existe.
        select fc.unit_cost_cents into v_cost
        from public.formula_costs fc
        where fc.formula_id = v_formula.id
          and fc.deleted_at is null;

        insert into public.quote_items
            (quote_id, formula_id, formula_name_snapshot, quantity_potes, unit_cost_cents, unit_price_cents)
        values
            (v_quote_id, v_formula.id, v_formula.name,
             (v_item->>'quantity_potes')::integer, v_cost, v_formula.list_price_cents);
    end loop;

    return v_quote_id;
end;
$$;

comment on function public.fn_generate_quote is 'Único ponto de entrada para gerar orçamento a partir do carrinho público (anon). unit_price_cents nasce igual ao preço público (formulas.list_price_cents); unit_cost_cents nasce do custo real privado (formula_costs), lido com privilégio elevado sem nunca expor a tabela de custo ao chamador. A validação de mínimo de potes roda no trigger trg_quote_items_min_order.';

revoke all on function public.fn_generate_quote(text, text, jsonb, uuid) from public;


-- ---------------------------------------------------------------------------------
-- 13. VIEW DE CONVENIÊNCIA — total do orçamento
-- ---------------------------------------------------------------------------------
-- security_invoker = true é OBRIGATÓRIO aqui: sem isso, uma view em Postgres/Supabase
-- roda com os privilégios de quem CRIOU a view, não de quem consulta — e isso
-- ignora silenciosamente a RLS de quotes/quote_items. É um erro comum e perigoso
-- em projetos Supabase; marcado explicitamente para não escorregar.

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
    sum(qi.profit_cents) as total_profit_cents
from public.quotes q
left join public.quote_items qi on qi.quote_id = q.id and qi.deleted_at is null
where q.deleted_at is null
group by q.id, q.quote_number, q.customer_name, q.customer_whatsapp, q.created_at;

comment on view public.quote_summaries is 'Totais agregados por orçamento (conveniência para a lista da aba Orçamentos). security_invoker=true: respeita a RLS de quotes/quote_items de quem consulta, não do dono da view.';
