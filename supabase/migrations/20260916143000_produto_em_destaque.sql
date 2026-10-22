-- =====================================================================================
-- LEMON CAPS - CATALOGO PUBLICO
-- 20260916143000_produto_em_destaque.sql - marcar uma formula como DESTAQUE do catalogo.
--
-- Pedido do dono: um botao por produto na lista do admin (/admin/catalogo) que marque a
-- formula como destaque, e esse destaque aparecer para o cliente em /catalogo - o
-- produto vem antes dos demais na grade e ganha um selo discreto no card.
--
-- POR QUE timestamptz E NAO boolean
-- ---------------------------------------------------------------------------------
-- Um boolean responde "e destaque?" e nada mais. O carimbo de tempo responde tambem
-- "desde quando?", e essa segunda resposta e' a que faz o recurso funcionar:
--   1. Ordem entre os proprios destaques: o destacado mais recente sobe primeiro, sem
--      precisar de um segundo campo de ordenacao so para eles.
--   2. Auditoria legivel: com boolean, saber quando o produto virou destaque exige
--      caçar o UPDATE em public.audit_logs; com o carimbo, o dado esta na propria linha.
--   3. Mesma convencao ja adotada neste banco para "fato datado" em vez de bandeira -
--      compliance_verified_at (20260914000000) e claim_verified_at seguem exatamente
--      esta ideia.
-- Custo: NULL passa a significar "nao e destaque". Nenhum lugar do codigo escreve o
-- valor vindo do cliente - a Server Action grava now() no servidor ou NULL, e so.
--
-- COMO featured_at E sort_order CONVIVEM (eles nao competem)
-- ---------------------------------------------------------------------------------
-- Sao dois eixos diferentes, aplicados em cascata, nunca alternativos:
--
--     order by featured_at desc nulls last,  -- 1o eixo: destaque (grupo)
--              sort_order    asc,            -- 2o eixo: ordenacao manual (dentro do grupo)
--              name          asc             -- 3o eixo: desempate estavel
--
-- Ou seja: o destaque PROMOVE o produto para o bloco da frente; quem manda DENTRO de
-- cada bloco continua sendo o sort_order que ja existia. Trocar o destaque nunca
-- reescreve sort_order, e reordenar manualmente nunca apaga destaque - por isso nao ha
-- como um brigar com o outro.
--
-- O terceiro criterio (name) nao e enfeite: HOJE as 27 formulas vivas tem sort_order = 0
-- (conferido no banco em 13/09/2026, select count(distinct sort_order) = 1). Com empate
-- total e sem desempate declarado, o Postgres devolve as linhas na ordem FISICA da heap
-- - que muda quando uma linha e atualizada. Sem o desempate por nome, marcar um destaque
-- embaralharia sozinho a ordem do resto do catalogo, e o proprio recurso seria a causa.
--
-- RLS E PRIVILEGIOS - nada novo a criar, e o porque
-- ---------------------------------------------------------------------------------
-- public.formulas ja tem RLS ligada e as tres policies de que este campo precisa
-- (20260909210001_rls_policies.sql):
--   formulas_select  -> anon e authenticated leem as formulas ativas e nao excluidas;
--                       staff ativo le todas. Leitura publica do destaque: coberta.
--   formulas_update  -> so authenticated E private.is_active_staff(). Escrita do
--                       destaque: coberta, e so por staff.
-- Os GRANTs sao de TABELA INTEIRA (grant select on public.formulas to anon), nao por
-- coluna - conferido ao vivo em information_schema.table_privileges antes de escrever
-- esta migration. Coluna nova em tabela com grant de tabela ja nasce coberta pelo grant;
-- a checagem no fim deste arquivo confirma isso em vez de supor.
--
-- IDEMPOTENTE: add column if not exists / create index if not exists / grant repetido
-- nao e erro. Pode rodar duas vezes.
--
-- ORDEM DE EXECUCAO: depois de schema.sql e rls_policies.sql. So acrescenta coluna e
-- indice em tabela ja existente - os triggers trg_formulas_touch e trg_formulas_audit
-- continuam valendo (todo UPDATE de destaque entra na trilha de auditoria).
-- =====================================================================================


-- ---------------------------------------------------------------------------------
-- 1. COLUNA NOVA EM public.formulas
-- ---------------------------------------------------------------------------------

alter table public.formulas
    add column if not exists featured_at timestamptz;

comment on column public.formulas.featured_at is
    'Momento em que esta formula foi marcada como DESTAQUE do catalogo publico. NULL = nao e destaque (a UI simplesmente nao mostra o selo; nunca escreve aviso negativo no lugar). Ordenacao da vitrine: featured_at desc nulls last, depois sort_order asc, depois name asc - o destaque promove o produto para a frente da grade, o sort_order continua mandando dentro de cada bloco. Gravado SEMPRE pelo servidor (Server Action setFormulaFeatured, lib/actions/formulas.ts): o cliente envia apenas um booleano, nunca a data.';


-- ---------------------------------------------------------------------------------
-- 2. INDICE PARCIAL - so as linhas que sao destaque
-- ---------------------------------------------------------------------------------
-- Duas consultas reais o usam: a ordenacao da vitrine (/catalogo) e a contagem de
-- destaques do aviso do admin. Parcial porque a esmagadora maioria das linhas tem
-- featured_at NULL e indexa-las seria gastar espaco com o que nunca e' procurado -
-- mesmo padrao do idx_formula_sheet_approvals_formula (20260916000000).

create index if not exists idx_formulas_featured
    on public.formulas (featured_at desc)
    where featured_at is not null and deleted_at is null;


-- ---------------------------------------------------------------------------------
-- 3. CHECAGEM - confirmar, nao supor
-- ---------------------------------------------------------------------------------
-- Este projeto ja teve migration dada como aplicada sem estar. A checagem abaixo
-- levanta excecao (e desfaz a transacao inteira) se qualquer uma das tres condicoes
-- que o recurso exige nao estiver de pe depois do que rodou acima.

do $$
begin
    if not exists (
        select 1 from information_schema.columns
        where table_schema = 'public' and table_name = 'formulas' and column_name = 'featured_at'
    ) then
        raise exception 'featured_at nao existe em public.formulas depois do ALTER TABLE';
    end if;

    if not exists (
        select 1 from pg_indexes
        where schemaname = 'public' and tablename = 'formulas' and indexname = 'idx_formulas_featured'
    ) then
        raise exception 'idx_formulas_featured nao foi criado';
    end if;

    -- O grant de tabela precisa mesmo ter alcancado a coluna nova: sem isto o catalogo
    -- publico (papel anon) quebraria inteiro ao pedir featured_at - o Postgres recusa a
    -- consulta toda, nao so a coluna.
    if not exists (
        select 1 from information_schema.column_privileges
        where table_schema = 'public' and table_name = 'formulas'
          and column_name = 'featured_at' and grantee = 'anon' and privilege_type = 'SELECT'
    ) then
        raise exception 'papel anon nao tem SELECT em formulas.featured_at - o catalogo publico nao conseguiria ler o destaque';
    end if;
end;
$$;
