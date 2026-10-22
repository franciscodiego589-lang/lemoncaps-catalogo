-- =====================================================================================
-- LEMON CAPS - CATALOGO PUBLICO
-- 20260921300000_staff_integracao.sql - provisiona o usuário de integração (outro
-- sistema interno do dono, que vai ler e editar dados deste catálogo pela API REST
-- do Supabase/PostgREST) como staff ativo, com o "papel extra" de orçamentos.
--
-- CONTEXTO
-- O dono decidiu que o outro sistema nunca recebe a chave service_role (ela ignora
-- RLS por completo e não carimba autor em created_by/updated_by/audit_logs). Em
-- 13/09/2026 um UPDATE em massa feito por fora do aplicativo, com o papel de
-- service_role, carimbou compliance_verified_at de 19 fórmulas de uma vez (9 delas
-- sem nenhum lastro documentado) e o log de auditoria ficou com actor_id/actor_email
-- nulos - não dá para saber quem fez, porque SECURITY DEFINER + service_role não
-- passa por private.tg_write_audit() do jeito que passaria um usuário autenticado
-- normal (ver 20260917000000_corrige_selo_conformidade.sql para o relato completo
-- do incidente). A alternativa adotada: o outro sistema autentica como um USUÁRIO
-- normal do Supabase Auth, com uma linha em staff_profiles - a mesma trilha de RLS
-- e de auditoria que vale para qualquer humano do admin vale para ele também.
--
-- PASSO MANUAL DO DONO ANTES DE APLICAR ESTA MIGRATION (não dá para automatizar por
-- SQL - criar usuário em auth.users é ação do painel/Admin API, não uma migration):
--   1. Painel do Supabase -> Authentication -> Users -> Add user
--        e-mail: integracao@lemoncaps.com.br
--        senha:  definida pelo dono, forte, exclusiva desta integração
--        marcar "Auto Confirm User" (sem isso o usuário nasce com e-mail não
--        confirmado, e POST /auth/v1/token?grant_type=password recusa o login até
--        alguém confirmar)
--   2. Copiar o UUID do usuário criado (coluna "UID" na lista de usuários do painel,
--      ou o campo "id" devolvido pela Admin API)
--   3. Nesta migration, substituir TODAS as ocorrências do marcador
--      '<<UUID_DO_USUARIO_INTEGRACAO>>' por esse UUID real
--   4. Só então aplicar (supabase db push, ou colar o conteúdo já substituído no
--      SQL Editor do painel) - a guarda da seção 1 aborta com erro legível se o
--      UUID ainda for o marcador ou não existir em auth.users, em vez de deixar o
--      Postgres estourar num erro cru de foreign key.
--
-- O QUE ESTA MIGRATION FAZ
-- Insere (ou reativa, se a linha já existir) uma linha em public.staff_profiles
-- para esse usuário, com active = true e can_manage_quotes = true. A partir daí a
-- RLS trata o token desse usuário exatamente como trataria qualquer funcionário
-- autenticado do admin - não existe papel especial "integração" no banco, é o
-- mesmo private.is_active_staff() / private.can_manage_quotes() de sempre
-- (20260909210001_rls_policies.sql), só aplicado a mais um usuário.
--
-- POR QUE can_manage_quotes = true
-- O pedido do dono foi "ver e editar todos os dados". Sem esta flag, o usuário de
-- integração ficaria com RLS negando por completo public.quotes, public.quote_items
-- e a view public.quote_summaries (essas três exigem private.can_manage_quotes(),
-- não só private.is_active_staff() - ver rls-policies.sql, seções 7/8). Se o dono
-- decidir depois que a integração NÃO deve enxergar preço de venda/margem/lucro de
-- orçamento, o jeito é um UPDATE separado (ver "COMO REVOGAR OU REDUZIR" no fim
-- deste arquivo) - não reescrever nem reaplicar esta migration.
--
-- IDEMPOTENTE: rodar de novo com o mesmo UUID não duplica (on conflict on user_id,
-- a chave primária da tabela) e não desliga o que já estiver ligado - só garante
-- de novo active=true e can_manage_quotes=true. Os triggers padrão já existentes
-- (trg_staff_profiles_touch e trg_staff_profiles_audit, schema.sql) continuam
-- valendo sem nenhuma alteração - inclusive o fix de 20260915000000, que faz os
-- dois funcionarem nesta tabela mesmo ela não tendo coluna "id" nem colunas de
-- soft delete.
--
-- ORDEM DE EXECUÇÃO: depois de 20260909210000_schema.sql e
-- 20260909210001_rls_policies.sql (só usa a tabela e a constraint que já existem
-- desde o schema inicial). Independente de qualquer outra migration pendente no
-- repositório (ex.: 20260922000000_reformulacao_conforme_normas.sql, que o próprio
-- cabeçalho marca como não aplicada) - esta migration não lê nem altera fórmula,
-- composição ou selo nenhum.
-- =====================================================================================


-- ---------------------------------------------------------------------------------
-- 0. GUARDA - o UUID precisa ter sido substituído E precisa existir em auth.users
-- ---------------------------------------------------------------------------------
-- staff_profiles.user_id referencia auth.users(id) - um INSERT com UUID inexistente
-- já falharia sozinho por violação de foreign key, mas a mensagem seria críptica
-- ("violates foreign key constraint"). Esta guarda dá o motivo em português, com a
-- instrução de como corrigir, antes de deixar o Postgres tentar o INSERT.

do $$
begin
    -- Checagem 1: o marcador precisa ter sido trocado por algo no FORMATO de UUID
    -- antes de qualquer tentativa de cast (::uuid) - sem isto, quem esquecer de
    -- substituir o marcador veria um erro cru do Postgres ("invalid input syntax
    -- for type uuid"), em vez de uma instrução legível do que fazer.
    if '<<UUID_DO_USUARIO_INTEGRACAO>>' !~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$' then
        raise exception 'Substitua o marcador ''<<UUID_DO_USUARIO_INTEGRACAO>>'' (nesta migration, TODAS as ocorrências) pelo UUID real do usuário criado em Authentication > Users antes de aplicar. Veja o cabeçalho deste arquivo para o passo a passo completo.';
    end if;

    -- Checagem 2: o UUID (já no formato certo) precisa existir de fato em
    -- auth.users - staff_profiles.user_id é FK para lá, então um INSERT com UUID
    -- inexistente falharia de qualquer jeito; esta guarda só troca o erro cru de
    -- foreign key por uma instrução de como corrigir.
    if not exists (
        select 1 from auth.users where id = '<<UUID_DO_USUARIO_INTEGRACAO>>'::uuid
    ) then
        raise exception 'UUID % não existe em auth.users. Crie o usuário no painel primeiro: Authentication > Users > Add user, e-mail integracao@lemoncaps.com.br, com "Auto Confirm User" marcado - depois copie o UUID dele para o marcador desta migration.',
            '<<UUID_DO_USUARIO_INTEGRACAO>>';
    end if;
end $$;


-- ---------------------------------------------------------------------------------
-- 1. PROVISIONA O STAFF DE INTEGRAÇÃO
-- ---------------------------------------------------------------------------------
-- Colunas reais de public.staff_profiles (20260909210000_schema.sql): user_id (PK,
-- FK para auth.users), full_name, can_manage_quotes, active, created_at, updated_at,
-- created_by, updated_by - as quatro últimas ficam a cargo do trigger padrão
-- (trg_staff_profiles_touch), nunca preenchidas à mão aqui.
--
-- full_name é só um rótulo interno (aparece em telas do admin que listam staff,
-- nunca é exibido ao público) - troque o texto abaixo se o dono preferir outro,
-- antes de aplicar.

insert into public.staff_profiles (user_id, full_name, can_manage_quotes, active)
values (
    '<<UUID_DO_USUARIO_INTEGRACAO>>'::uuid,
    'Integração - sistema interno',
    true,
    true
)
on conflict (user_id) do update
    set active            = true,
        can_manage_quotes = true;


-- ---------------------------------------------------------------------------------
-- 2. CONFERÊNCIA DE GUARDA - nunca falhar calado (mesmo padrão do resto do projeto)
-- ---------------------------------------------------------------------------------

do $$
declare
    v_ok boolean;
begin
    select (active and can_manage_quotes) into v_ok
    from public.staff_profiles
    where user_id = '<<UUID_DO_USUARIO_INTEGRACAO>>'::uuid;

    if not coalesce(v_ok, false) then
        raise exception 'public.staff_profiles do usuário de integração não ficou com active=true e can_manage_quotes=true depois do INSERT/UPDATE acima - aborta em vez de seguir com o provisionamento pela metade.';
    end if;
end $$;


-- ---------------------------------------------------------------------------------
-- COMO REVOGAR OU REDUZIR O ACESSO (o dono, nunca a própria integração - não existe
-- GRANT de UPDATE/DELETE para authenticated em staff_profiles, de propósito, ver
-- 20260909210001_rls_policies.sql seção 5: "Escrita fora da API de propósito").
-- Rodar como o dono, via SQL Editor do painel (ou Table Editor) - nunca pela API
-- pública com o token da própria integração, que não tem privilégio para isto.
-- ---------------------------------------------------------------------------------
--
-- Desativar por completo (a integração passa a cair em 401/403 em toda chamada,
-- mesmo com token ainda válido - private.is_active_staff() passa a devolver false):
--   update public.staff_profiles set active = false
--     where user_id = '<<UUID_DO_USUARIO_INTEGRACAO>>';
--
-- Tirar só o acesso a Orçamentos (quotes/quote_items/quote_summaries), mantendo o
-- resto do catálogo (fórmulas, composições, insumos, leads) visível/editável:
--   update public.staff_profiles set can_manage_quotes = false
--     where user_id = '<<UUID_DO_USUARIO_INTEGRACAO>>';
--
-- Reativar depois de desativado: repetir esta própria migration (idempotente), ou
--   update public.staff_profiles set active = true
--     where user_id = '<<UUID_DO_USUARIO_INTEGRACAO>>';
--
-- Trocar a senha da integração: painel -> Authentication -> Users -> (usuário) ->
-- "Send password recovery" (o próprio outro sistema define a senha nova pelo link),
-- ou "Reset password" para o dono definir uma senha nova diretamente. Nenhuma das
-- duas exige mexer em staff_profiles - o vínculo é pelo user_id (UUID), que não muda.
-- =====================================================================================
