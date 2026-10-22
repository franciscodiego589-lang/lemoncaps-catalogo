-- =====================================================================================
-- LEMON CAPS - CATALOGO PUBLICO
-- 20260918000000_linha_unica_e_duplicatas.sql
--
-- Duas decisoes do dono, tomadas em 14/09/2026, que so fazem sentido juntas.
--
-- 1) A DIVISAO PREMIUM x BASICA DEIXA DE EXISTIR.
--    O catalogo mostrava duas abas. A divisao nunca sustentou preco: a Creatina
--    300 g era BASICA e custava R$ 27,99, mais que 14 das 21 premium; tirando as
--    duplicatas, a media da linha basica (R$ 19,96) ficava ACIMA da mediana da
--    premium (R$ 19,50). Ou seja, o rotulo nao separava faixa de preco nem faixa
--    de qualidade - separava nada. Some da interface e o dado passa a ser uniforme.
--
-- 2) AS TRES DUPLICATAS SAEM DO AR.
--    Este e o motivo pelo qual as duas decisoes andam juntas: eram as ABAS que
--    escondiam o problema. Cada par tinha um registro de cada lado, entao o
--    cliente nunca via os dois na mesma tela. Numa aba unica eles apareceriam
--    lado a lado - MESMA FOTO, precos diferentes (de +20% a +56%). O que era
--    defeito de cadastro viraria defeito visivel de vitrine.
--
--    Os tres pares foram confirmados insumo a insumo na auditoria
--    (lemoncaps-catalogo-planejamento/conformidade-anvisa.md e
--    docs/conformidade/divergencias.md): sao o MESMO produto cadastrado duas
--    vezes, nao dois produtos parecidos.
--
-- QUAL REGISTRO FICOU EM CADA PAR, E POR QUE:
--
--   BIOTINA - fica "Biotina em Capsula" (R$ 8,90), sai "BIOPRINCESS" (R$ 13,90).
--     Unico caso com resposta tecnica, nao comercial: a auditoria ja apontava que
--     o registro CARO era o errado (as tres divergencias dele sao valores-TETO da
--     ANVISA, nao formulacao real, enquanto o barato bate 21 de 21 com o rotulo
--     impresso). Conferido de novo agora no banco: o BIOPRINCESS esta com
--     ingredients_list VAZIO - lacuna regulatoria. Sai o caro.
--
--   ZMA - fica "ZMA" (R$ 16,50), sai "ZMA Night" (R$ 13,80).
--     Decisao do dono. O que fica tem lista de ingredientes e advertencias mais
--     completas (238 contra 148 caracteres). PENDENCIA HERDADA: o registro que
--     ficou esta sem net_weight preenchido.
--
--   SLIM UP - fica "Slim Up - EMAGRECIMENTO EM GOTA" (R$ 12,80), sai
--     "Slim Up - Emagrecedor em Gota" (R$ 16,10).
--     Decisao do dono. O que saiu era mais completo em texto, mas carregava o
--     net_weight impossivel de "0,45g" num frasco de 30 mL. PENDENCIA HERDADA: o
--     registro que ficou tem lista de ingredientes menor (229 contra 526
--     caracteres) e merece ser completado contra o rotulo.
--
-- EFEITO NO SELO DE CONFORMIDADE - registrar para nao assustar depois:
--   Dois dos tres que saem (ZMA Night e BIOPRINCESS) estao entre as 14 formulas
--   com selo "Composicao conferida" autorizado em 20260917_corrige_selo_conformidade.
--   A exclusao aqui e LOGICA: nao mexe em compliance_verified_at, entao o
--   autocheck daquela migration (que exige exatamente 14) continua valendo e
--   nao conflita. O que muda e so o que o visitante ve: o catalogo publico passa
--   a exibir 12 selos em vez de 14, porque dois dos selados sairam da vitrine.
--   Nenhuma afirmacao de conformidade foi criada nem removida.
--
-- NADA E APAGADO FISICAMENTE. deleted_at + reason_deleted, reversivel com um
-- UPDATE ... SET deleted_at = null. Os registros seguem no banco, com historico.
-- =====================================================================================


-- -------------------------------------------------------------------------------------
-- 1. AS TRES DUPLICATAS SAEM DO CATALOGO (exclusao logica)
-- -------------------------------------------------------------------------------------
-- IDs conferidos ao vivo no banco de producao antes de escrever esta migration,
-- cruzando nome, slug, preco e mockup_path - nao supostos.

-- `active = false` junto com o deleted_at NAO e redundancia: o banco tem a
-- constraint `formulas_excluida_nao_ativa`, que proibe registro excluido
-- logicamente continuar marcado como ativo. A primeira versao desta migration
-- setava so o deleted_at e foi REJEITADA por ela - a trava fez o trabalho dela
-- e impediu um estado inconsistente. Para reverter, limpar os dois campos.
update public.formulas
set
    deleted_at     = now(),
    active         = false,
    reason_deleted = 'Duplicata confirmada insumo a insumo: e o mesmo produto de outro registro que permanece ativo, com a mesma foto e preco diferente. Decisao do dono em 14/09/2026, ao unificar as linhas premium e basica numa aba unica. Reversivel: basta limpar deleted_at e voltar active.'
where id in (
    '0adc783d-202d-4f6c-8501-3b77f8b47761'::uuid, -- BIOPRINCESS (fica Biotina em Capsula)
    '3519aa71-676e-49f6-8cd4-edb65baa458a'::uuid, -- ZMA Night (fica ZMA)
    '261d5ecf-545e-493f-a6c2-7721ff772f6f'::uuid  -- Slim Up - Emagrecedor em Gota (fica EMAGRECIMENTO EM GOTA)
)
and deleted_at is null;


-- -------------------------------------------------------------------------------------
-- 2. TODA FORMULA ATIVA PASSA A SER 'premium'
-- -------------------------------------------------------------------------------------
-- Por abrangencia (todas as ativas), nao listando as cinco que hoje sao 'basica':
-- assim o estado final fica correto mesmo que outra formula seja cadastrada como
-- basica antes desta migration rodar. A coluna `line` CONTINUA existindo, com o
-- enum intacto - o campo segue no admin e no historico. O que acabou foi a
-- divisao como fato de negocio, nao a coluna.

update public.formulas
set line = 'premium'
where deleted_at is null
  and line is distinct from 'premium';


-- -------------------------------------------------------------------------------------
-- 3. AUTOCHECK - aborta a transacao inteira se o estado final nao bater
-- -------------------------------------------------------------------------------------
-- Mesmo padrao das migrations de conformidade: conferir em vez de supor. Se
-- qualquer uma destas tres falhar, nada acima e aplicado.

do $$
declare
    v_ativas       integer;
    v_nao_premium  integer;
    v_fotos_repetidas integer;
begin
    select count(*) into v_ativas
    from public.formulas
    where deleted_at is null and active;

    if v_ativas <> 24 then
        raise exception 'esperado 24 formulas ativas depois de tirar as 3 duplicatas (eram 27), encontrado %', v_ativas;
    end if;

    select count(*) into v_nao_premium
    from public.formulas
    where deleted_at is null and line is distinct from 'premium';

    if v_nao_premium <> 0 then
        raise exception 'esperado 0 formulas ativas fora da linha premium, encontrado %', v_nao_premium;
    end if;

    -- O sintoma que originou a decisao: duas formulas ATIVAS apontando para o
    -- mesmo arquivo de foto. Se sobrar alguma, a vitrine volta a mostrar o mesmo
    -- pote com dois precos e a unificacao nao resolveu o que se propos.
    select count(*) into v_fotos_repetidas
    from (
        select mockup_path
        from public.formulas
        where deleted_at is null and mockup_path is not null
        group by mockup_path
        having count(*) > 1
    ) as repetidas;

    if v_fotos_repetidas <> 0 then
        raise exception 'ainda existem % foto(s) compartilhada(s) por mais de uma formula ativa', v_fotos_repetidas;
    end if;
end $$;
