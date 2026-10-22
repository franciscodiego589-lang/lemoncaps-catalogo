-- =====================================================================================
-- LEMON CAPS - CATÁLOGO PÚBLICO
-- 20260916000000_pacote_tecnico_e_assinatura_ficha.sql
--
-- Duas coisas que um comprador profissional pede antes de fechar e que o catálogo
-- ainda não tinha:
--
--   PARTE 1 - PACOTE TÉCNICO. Código de barras, validade, peso e dimensões da unidade
--   e da caixa de despacho. Sem esses números o revendedor não calcula frete, não monta
--   palete e não dimensiona estoque - é o dado que trava uma cotação grande. Todas as
--   colunas nascem NULLABLE e VAZIAS: nenhuma das 28 fórmulas tem esse levantamento
--   feito hoje, e inventar medida de caixa seria pior que não ter (regra de exatidão do
--   projeto, AGENTS.md). A tela e os PDFs só mostram a linha que estiver preenchida -
--   campo vazio nunca vira "não informado".
--
--   PARTE 2 - ASSINATURA DA FICHA PELO RESPONSÁVEL TÉCNICO. Hoje as três colunas de
--   conformidade (compliance_verified_at/norms/source, migrations 20260914000000 e
--   20260915140000) dizem QUANDO a composição foi conferida contra a ANVISA, mas não
--   dizem QUEM assinou, com qual registro profissional, nem guardam histórico. Uma
--   auditoria de fornecedor pede exatamente isso. A tabela nova
--   public.formula_sheet_approvals guarda cada aprovação como registro histórico
--   próprio, e public.formulas ganha technical_sheet_version para dizer em que versão a
--   ficha está.
--
-- APROVAÇÃO NÃO SE EDITA NEM SE APAGA. Aprovar de novo é criar uma linha nova, nunca
-- corrigir a anterior - assinatura de responsável técnico é ato com valor legal e o
-- histórico é o produto, não um efeito colateral. Isso NÃO é só uma instrução na tela:
-- é trava no banco. O papel `authenticated` recebe apenas SELECT e INSERT (por coluna)
-- nesta tabela, e existem policies só de SELECT e INSERT - sem policy de UPDATE e sem
-- policy de DELETE, a RLS nega os dois por padrão. Retratar uma linha lançada por
-- engano só é possível de fora da aplicação (migration ou console, com o papel dono do
-- banco), e mesmo assim fica registrada em public.audit_logs pelos triggers padrão.
--
-- O QUE ESTA MIGRATION NÃO DUPLICA: histórico de EDIÇÃO. public.audit_logs (já com mais
-- de mil registros) grava quem alterou o quê, com actor_email, valor anterior e valor
-- novo, disparado pelo trigger private.tg_write_audit em toda tabela de negócio - e
-- passa a gravar também as duas coisas criadas aqui. A tabela nova existe porque a
-- aprovação do responsável técnico é um ATO DELIBERADO (o RT declara que confere a
-- ficha naquela versão), não a consequência de alguém ter salvo um formulário.
--
-- SOBRE O DÍGITO VERIFICADOR (decisão desta tarefa, com o porquê):
-- EAN-13 e DUN-14 carregam dígito verificador calculado (padrão GTIN da GS1 - soma
-- ponderada 3/1 da direita para a esquerda, complemento de 10). Um código com
-- verificador errado é objetivamente inválido: nenhum leitor de loja lê, e no catálogo
-- ele viraria erro no cliente. Por isso a escolha aqui é BLOQUEAR, não avisar - em duas
-- camadas, banco e formulário. Não é opinião nem fonte que possa estar desatualizada: é
-- aritmética fechada, dá para conferir no ato. E bloquear não atrapalha o cadastro
-- parcial, porque o campo é opcional: quem ainda não tem o código deixa em branco.
--
-- ORDEM DE EXECUÇÃO: depois de 20260909210000_schema.sql, 20260909210001_rls_policies.sql
-- e das migrations de conformidade (só acrescenta colunas e uma tabela nova).
-- =====================================================================================


-- ---------------------------------------------------------------------------------
-- 1. VALIDAÇÃO DE GTIN (EAN-13 e DUN-14) - private.is_valid_gtin
-- ---------------------------------------------------------------------------------
-- Algoritmo GTIN padrão, o mesmo para GTIN-13 (EAN-13) e GTIN-14 (DUN-14): percorre os
-- dígitos da direita para a esquerda a partir do que fica ao lado do verificador,
-- multiplicando alternadamente por 3 e por 1; o verificador é o que falta para o
-- próximo múltiplo de 10.
--
-- IMMUTABLE porque é exigência do PostgreSQL para função usada em CHECK constraint - e
-- é verdade aqui: mesma entrada, sempre a mesma saída, sem tocar em tabela nenhuma.
--
-- Vive no schema `private` (não exposto na API REST), como as demais funções internas
-- do projeto. O GRANT EXECUTE ao papel `authenticated` no fim desta seção é
-- OBRIGATÓRIO, não decorativo: conferido ao vivo neste projeto em 13/09/2026, um CHECK
-- que chama função sem esse grant faz o INSERT do papel `authenticated` falhar com
-- "permission denied for function" - a constraint viraria uma trava contra o próprio
-- admin. O grant de EXECUTE basta sozinho; USAGE no schema `private` continua negado
-- para anon e authenticated, como já era antes desta migration.
create or replace function private.is_valid_gtin(p_code text, p_length integer)
returns boolean
language plpgsql
immutable
as $$
declare
    v_soma  integer := 0;
    v_peso  integer;
    v_digito integer;
    i integer;
begin
    -- NULL é ausência de dado, não código inválido: quem ainda não levantou o EAN
    -- deixa em branco e a coluna fica NULL (o CHECK precisa passar nesse caso).
    if p_code is null then
        return true;
    end if;

    -- Só dígitos, e exatamente o comprimento pedido. Espaço, hífen e prefixo de
    -- unidade de medida não entram: o que é gravado é o código puro.
    if p_code !~ ('^[0-9]{' || p_length::text || '}$') then
        return false;
    end if;

    for i in 1 .. (p_length - 1) loop
        v_digito := substr(p_code, p_length - i, 1)::integer;
        v_peso := case when i % 2 = 1 then 3 else 1 end;
        v_soma := v_soma + v_digito * v_peso;
    end loop;

    return ((10 - (v_soma % 10)) % 10) = substr(p_code, p_length, 1)::integer;
end;
$$;

comment on function private.is_valid_gtin(text, integer) is 'Valida um código GTIN (EAN-13 com p_length=13, DUN-14 com p_length=14): exige só dígitos, o comprimento exato e o dígito verificador correto pelo algoritmo da GS1. NULL devolve true (ausência de dado não é código inválido). Usada nos CHECK de public.formulas.ean13 e .dun14 e espelhada na validação do formulário (lib/actions/formulas.ts) para a mensagem de erro sair no campo certo.';

-- Toda função nova nasce com EXECUTE para PUBLIC no PostgreSQL (conferido ao vivo logo
-- depois da primeira aplicação desta migration: o papel `anon` aparecia podendo
-- executá-la). Quem escreve em public.formulas é só o staff autenticado, então o
-- privilégio é revogado de PUBLIC e concedido nominalmente - mesma linha de conduta das
-- migrations 20260913170000 e 20260913230000, que existem justamente por grant largo
-- demais ter passado despercebido antes.
revoke all on function private.is_valid_gtin(text, integer) from public;
grant execute on function private.is_valid_gtin(text, integer) to authenticated;


-- ---------------------------------------------------------------------------------
-- 2. PACOTE TÉCNICO - colunas novas em public.formulas
-- ---------------------------------------------------------------------------------
-- Todas opcionais. numeric(10,2) em peso e dimensão: guarda o valor exato medido, sem
-- ponto flutuante binário (mesma regra do dinheiro neste projeto) e com casa decimal
-- suficiente para milímetro e grama fracionados.

alter table public.formulas
    add column if not exists ean13                   text,
    add column if not exists dun14                   text,
    add column if not exists shelf_life_months       integer,
    add column if not exists gross_weight_g          numeric(10,2),
    add column if not exists package_height_mm       numeric(10,2),
    add column if not exists package_width_mm        numeric(10,2),
    add column if not exists package_depth_mm        numeric(10,2),
    add column if not exists units_per_box           integer,
    add column if not exists box_height_mm           numeric(10,2),
    add column if not exists box_width_mm            numeric(10,2),
    add column if not exists box_depth_mm            numeric(10,2),
    add column if not exists box_gross_weight_g      numeric(10,2),
    add column if not exists technical_sheet_version integer not null default 1;

comment on column public.formulas.ean13 is 'Código de barras EAN-13 da unidade de venda (o pote), só dígitos, com dígito verificador conferido pelo CHECK formulas_ean13_valido. NULL = ainda não levantado; a tela e os PDFs simplesmente não mostram a linha (nunca "não informado").';
comment on column public.formulas.dun14 is 'Código DUN-14 (GTIN-14) da caixa de despacho, só dígitos, com dígito verificador conferido pelo CHECK formulas_dun14_valido. NULL = ainda não levantado.';
comment on column public.formulas.shelf_life_months is 'Prazo de validade do produto em MESES a partir da fabricação (o que vai no rótulo como "validade: X meses"). NULL = não informado.';
comment on column public.formulas.gross_weight_g is 'Peso BRUTO da unidade de venda em gramas (produto + pote + tampa + rótulo). O peso LÍQUIDO continua em net_weight, que é texto de rótulo ("300 g") e não serve para cálculo de frete.';
comment on column public.formulas.package_height_mm is 'Altura da unidade de venda em milímetros.';
comment on column public.formulas.package_width_mm is 'Largura da unidade de venda em milímetros.';
comment on column public.formulas.package_depth_mm is 'Profundidade da unidade de venda em milímetros.';
comment on column public.formulas.units_per_box is 'Quantas unidades de venda cabem em uma caixa de despacho.';
comment on column public.formulas.box_height_mm is 'Altura da caixa de despacho em milímetros.';
comment on column public.formulas.box_width_mm is 'Largura da caixa de despacho em milímetros.';
comment on column public.formulas.box_depth_mm is 'Profundidade da caixa de despacho em milímetros.';
comment on column public.formulas.box_gross_weight_g is 'Peso bruto da caixa de despacho fechada, em gramas.';
comment on column public.formulas.technical_sheet_version is 'Versão da ficha técnica desta fórmula. Começa em 1 e é incrementada DELIBERADAMENTE por quem edita, quando a mudança é grande a ponto de exigir nova aprovação do responsável técnico - nunca automaticamente a cada UPDATE (um ajuste de preço não é ficha nova). É esta versão que a aprovação em public.formula_sheet_approvals.sheet_version carimba.';

-- Constraints em bloco DO para a migration continuar idempotente: ALTER TABLE ... ADD
-- CONSTRAINT não aceita IF NOT EXISTS no PostgreSQL.
do $$
begin
    alter table public.formulas
        add constraint formulas_ean13_valido check (private.is_valid_gtin(ean13, 13));
exception when duplicate_object then null;
end $$;

do $$
begin
    alter table public.formulas
        add constraint formulas_dun14_valido check (private.is_valid_gtin(dun14, 14));
exception when duplicate_object then null;
end $$;

do $$
begin
    alter table public.formulas
        add constraint formulas_pacote_tecnico_positivo check (
            (shelf_life_months  is null or shelf_life_months  > 0)
        and (units_per_box      is null or units_per_box      > 0)
        and (gross_weight_g     is null or gross_weight_g     > 0)
        and (package_height_mm  is null or package_height_mm  > 0)
        and (package_width_mm   is null or package_width_mm   > 0)
        and (package_depth_mm   is null or package_depth_mm   > 0)
        and (box_height_mm      is null or box_height_mm      > 0)
        and (box_width_mm       is null or box_width_mm       > 0)
        and (box_depth_mm       is null or box_depth_mm       > 0)
        and (box_gross_weight_g is null or box_gross_weight_g > 0)
        );
exception when duplicate_object then null;
end $$;

do $$
begin
    alter table public.formulas
        add constraint formulas_technical_sheet_version_positivo check (technical_sheet_version >= 1);
exception when duplicate_object then null;
end $$;

-- Dois produtos diferentes com o mesmo código de barras é erro de cadastro, não uma
-- possibilidade do negócio: o leitor do cliente devolveria o produto errado. Índice
-- único PARCIAL (só linhas preenchidas e não excluídas) - as 28 fórmulas de hoje têm
-- ean13/dun14 NULL e NULL não conflita com NULL, então nada quebra ao aplicar.
create unique index if not exists uq_formulas_ean13
    on public.formulas (ean13)
    where ean13 is not null and deleted_at is null;

create unique index if not exists uq_formulas_dun14
    on public.formulas (dun14)
    where dun14 is not null and deleted_at is null;


-- ---------------------------------------------------------------------------------
-- 3. ASSINATURA DA FICHA - tabela public.formula_sheet_approvals
-- ---------------------------------------------------------------------------------
-- Uma linha por ato de aprovação. Mesmas colunas de controle das outras tabelas ricas
-- do projeto (formulas, ingredients) e os mesmos dois triggers padrão.

create table if not exists public.formula_sheet_approvals (
    id                  uuid primary key default gen_random_uuid(),
    formula_id          uuid not null references public.formulas(id) on delete restrict,
    sheet_version       integer not null,
    approved_by_name    text not null,
    approved_by_license text not null,
    approved_at         timestamptz not null default now(),
    notes               text,
    active              boolean not null default true,
    version             integer not null default 1,
    metadata            jsonb not null default '{}'::jsonb,
    created_at          timestamptz not null default now(),
    updated_at          timestamptz not null default now(),
    deleted_at          timestamptz,
    deleted_by          uuid references auth.users(id),
    reason_deleted      text,
    created_by          uuid references auth.users(id),
    updated_by          uuid references auth.users(id),
    constraint formula_sheet_approvals_sheet_version_positivo check (sheet_version >= 1),
    constraint formula_sheet_approvals_nome_preenchido       check (btrim(approved_by_name) <> ''),
    constraint formula_sheet_approvals_registro_preenchido   check (btrim(approved_by_license) <> '')
);

comment on table public.formula_sheet_approvals is 'Histórico de aprovações da ficha técnica pelo responsável técnico. Registro HISTÓRICO: uma aprovação nunca é editada nem apagada - aprovar de novo cria linha nova. A trava é de banco, não de tela: o papel authenticated só tem SELECT e INSERT aqui, e não existe policy de UPDATE nem de DELETE.';
comment on column public.formula_sheet_approvals.formula_id is 'Fórmula cuja ficha foi aprovada. ON DELETE RESTRICT: fórmula com aprovação registrada não some do banco por acidente (a exclusão do projeto é lógica, via deleted_at, de qualquer forma).';
comment on column public.formula_sheet_approvals.sheet_version is 'Versão da ficha (public.formulas.technical_sheet_version) que estava valendo no momento desta aprovação. É o que amarra a assinatura a um conteúdo específico: mudou a ficha, a assinatura anterior continua valendo para a versão anterior, nunca para a nova.';
comment on column public.formula_sheet_approvals.approved_by_name is 'Nome do responsável técnico que assinou. Digitado por quem registra - nunca preenchido pelo sistema a partir do usuário logado, porque quem opera o admin não é necessariamente o RT.';
comment on column public.formula_sheet_approvals.approved_by_license is 'Registro profissional do responsável técnico, como ele mesmo assina (ex.: "CRF/MT 5526"). Texto livre de propósito: o formato varia por conselho e por estado, e normalizar isso aqui só criaria dado errado.';
comment on column public.formula_sheet_approvals.approved_at is 'Data e hora da aprovação. Default now(), mas pode ser informada para registrar aprovação que aconteceu antes do lançamento no sistema (caso real: ficha assinada em papel e só depois digitada).';
comment on column public.formula_sheet_approvals.notes is 'Observação livre da aprovação (ex.: o que mudou desde a versão anterior). NÃO é exposta ao público: o papel anon não tem SELECT nesta coluna (ver os grants por coluna abaixo).';
comment on column public.formula_sheet_approvals.deleted_at is 'Existe pelo padrão de colunas do projeto, mas a aplicação NUNCA preenche: não há policy de UPDATE nesta tabela. Só o dono do banco consegue retratar uma linha lançada por engano, por migration, e isso fica em public.audit_logs.';

create or replace trigger trg_formula_sheet_approvals_touch before insert or update on public.formula_sheet_approvals
    for each row execute function private.tg_touch_row();
create or replace trigger trg_formula_sheet_approvals_audit after insert or update or delete on public.formula_sheet_approvals
    for each row execute function private.tg_write_audit();

-- FK indexada (regra do projeto) e já na ordem de leitura da tela: as aprovações de uma
-- fórmula, da mais recente para a mais antiga.
create index if not exists idx_formula_sheet_approvals_formula
    on public.formula_sheet_approvals (formula_id, approved_at desc)
    where deleted_at is null;


-- ---------------------------------------------------------------------------------
-- 4. RLS de public.formula_sheet_approvals - leitura pública, escrita só staff,
--    alteração e exclusão NEGADAS a todo mundo pela aplicação
-- ---------------------------------------------------------------------------------
-- Ver o incidente de grant largo demais registrado em
-- 20260913230000_revogar_grants_anon.sql e 20260913170000_revogar_authenticated.sql: no
-- schema public do Supabase, tabela nova pode nascer com privilégio para anon. Aqui os
-- privilégios são declarados um a um, começando por revogar tudo.

alter table public.formula_sheet_approvals enable row level security;

revoke all on public.formula_sheet_approvals from anon, authenticated;

-- Público (anon): só as colunas que respondem "quem assinou esta ficha, quando e em
-- que versão". `notes` fica FORA de propósito - é campo de observação interna e pode
-- carregar contexto que não é do comprador. `active` e `deleted_at` entram porque o
-- cliente do catálogo filtra por elas, e o PostgreSQL exige privilégio de SELECT em
-- toda coluna citada na consulta, inclusive as do WHERE.
grant select (id, formula_id, sheet_version, approved_by_name, approved_by_license, approved_at, active, deleted_at)
    on public.formula_sheet_approvals to anon;

-- Staff autenticado lê a linha inteira (inclusive notes, que a tela do admin mostra).
grant select on public.formula_sheet_approvals to authenticated;

-- Escrita: só INSERT, e só nas colunas de conteúdo. Sem UPDATE e sem DELETE (nem por
-- grant, nem por policy). created_by/created_at/version e as colunas de exclusão ficam
-- fora do grant: quem preenche são os triggers padrão, não o cliente - assim nem um
-- staff logado consegue lançar uma aprovação já marcada como excluída ou forjar autoria.
grant insert (formula_id, sheet_version, approved_by_name, approved_by_license, approved_at, notes)
    on public.formula_sheet_approvals to authenticated;

drop policy if exists formula_sheet_approvals_select on public.formula_sheet_approvals;
create policy formula_sheet_approvals_select on public.formula_sheet_approvals
    for select
    to anon, authenticated
    using ((active and deleted_at is null) or private.is_active_staff());

drop policy if exists formula_sheet_approvals_insert on public.formula_sheet_approvals;
create policy formula_sheet_approvals_insert on public.formula_sheet_approvals
    for insert
    to authenticated
    with check (private.is_active_staff());

-- NÃO existe policy de UPDATE nem de DELETE aqui, e isso é deliberado: com RLS ligada,
-- comando sem policy correspondente é negado. É a trava que faz "aprovação não se edita
-- nem se apaga" valer no banco, e não só no texto da tela.

-- Mesmo reforço defensivo de 20260913220056_ingredientes.sql: a policy de leitura
-- pública avalia private.is_active_staff() no predicado, e o anon só consegue rodar essa
-- função com GRANT EXECUTE nela. Já foi concedido em rls-policies.sql; repetir é barato
-- e evita que toda leitura pública desta tabela quebre se aquele grant cair.
grant execute on function private.is_active_staff() to anon, authenticated;


-- ---------------------------------------------------------------------------------
-- 5. CONFERÊNCIA DE GUARDA - nunca falhar calado
-- ---------------------------------------------------------------------------------
-- Migration que reporta sucesso sem ter aplicado nada já aconteceu neste projeto. As
-- checagens abaixo abortam a transação inteira se qualquer peça faltar.

do $$
declare
    v_colunas integer;
    v_constraints integer;
    v_policies integer;
    v_indices integer;
    v_gtin_ok boolean;
begin
    select count(*) into v_colunas
      from information_schema.columns
     where table_schema = 'public' and table_name = 'formulas'
       and column_name in ('ean13','dun14','shelf_life_months','gross_weight_g',
                           'package_height_mm','package_width_mm','package_depth_mm',
                           'units_per_box','box_height_mm','box_width_mm','box_depth_mm',
                           'box_gross_weight_g','technical_sheet_version');
    if v_colunas <> 13 then
        raise exception 'esperadas 13 colunas novas em public.formulas, encontradas %', v_colunas;
    end if;

    select count(*) into v_constraints
      from pg_constraint
     where conrelid = 'public.formulas'::regclass
       and conname in ('formulas_ean13_valido','formulas_dun14_valido',
                       'formulas_pacote_tecnico_positivo','formulas_technical_sheet_version_positivo');
    if v_constraints <> 4 then
        raise exception 'esperadas 4 constraints novas em public.formulas, encontradas %', v_constraints;
    end if;

    if to_regclass('public.formula_sheet_approvals') is null then
        raise exception 'tabela public.formula_sheet_approvals nao foi criada';
    end if;

    if not (select relrowsecurity from pg_class where oid = 'public.formula_sheet_approvals'::regclass) then
        raise exception 'RLS nao ficou habilitada em public.formula_sheet_approvals';
    end if;

    select count(*) into v_policies
      from pg_policies
     where schemaname = 'public' and tablename = 'formula_sheet_approvals';
    if v_policies <> 2 then
        raise exception 'esperadas exatamente 2 policies (select e insert) em formula_sheet_approvals, encontradas %', v_policies;
    end if;

    -- Nem por grant nem por default privilege pode ter sobrado UPDATE/DELETE/TRUNCATE.
    if has_table_privilege('authenticated', 'public.formula_sheet_approvals', 'UPDATE')
       or has_table_privilege('authenticated', 'public.formula_sheet_approvals', 'DELETE')
       or has_table_privilege('authenticated', 'public.formula_sheet_approvals', 'TRUNCATE')
       or has_table_privilege('anon', 'public.formula_sheet_approvals', 'INSERT')
       or has_table_privilege('anon', 'public.formula_sheet_approvals', 'UPDATE')
       or has_table_privilege('anon', 'public.formula_sheet_approvals', 'DELETE') then
        raise exception 'privilegio largo demais sobrou em formula_sheet_approvals';
    end if;

    -- notes é a única coluna que o público não pode ler.
    if has_column_privilege('anon', 'public.formula_sheet_approvals', 'notes', 'SELECT') then
        raise exception 'anon nao deveria ler formula_sheet_approvals.notes';
    end if;
    if not has_column_privilege('anon', 'public.formula_sheet_approvals', 'approved_by_name', 'SELECT') then
        raise exception 'anon precisa ler formula_sheet_approvals.approved_by_name (leitura publica da assinatura)';
    end if;

    select count(*) into v_indices
      from pg_indexes
     where schemaname = 'public'
       and indexname in ('uq_formulas_ean13','uq_formulas_dun14','idx_formula_sheet_approvals_formula');
    if v_indices <> 3 then
        raise exception 'esperados 3 indices novos, encontrados %', v_indices;
    end if;

    -- O validador de GTIN conferido contra códigos de verificador conhecido, calculados
    -- à mão na revisão desta migration: 4006381333931 é o EAN-13 de exemplo clássico da
    -- GS1; 7891234567895 e 17891234567892 (o mesmo número em DUN-14) foram calculados
    -- pelo algoritmo e conferidos dígito a dígito.
    select private.is_valid_gtin('4006381333931', 13)
       and private.is_valid_gtin('7891234567895', 13)
       and private.is_valid_gtin('17891234567892', 14)
       and not private.is_valid_gtin('4006381333930', 13)   -- verificador errado
       and not private.is_valid_gtin('789123456789', 13)    -- 12 dígitos
       and not private.is_valid_gtin('789123456789X', 13)   -- letra no meio
       and not private.is_valid_gtin('7891234567895', 14)   -- EAN-13 no campo de DUN-14
       and private.is_valid_gtin(null, 13)                  -- ausência de dado passa
      into v_gtin_ok;
    if not coalesce(v_gtin_ok, false) then
        raise exception 'private.is_valid_gtin reprovou na bateria de casos conhecidos';
    end if;

    if has_function_privilege('anon', 'private.is_valid_gtin(text,integer)', 'EXECUTE') then
        raise exception 'anon nao deveria poder executar private.is_valid_gtin';
    end if;
    if not has_function_privilege('authenticated', 'private.is_valid_gtin(text,integer)', 'EXECUTE') then
        raise exception 'authenticated PRECISA poder executar private.is_valid_gtin, senao o CHECK trava o admin';
    end if;
end $$;
