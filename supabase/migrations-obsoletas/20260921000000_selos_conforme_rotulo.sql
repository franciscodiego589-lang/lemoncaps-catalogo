-- =====================================================================================
-- LEMON CAPS - CATALOGO PUBLICO
-- 20260921000000_selos_conforme_rotulo.sql - selo "Composicao conferida" refeito sobre a
-- COMPOSICAO DO ROTULO, conferida insumo a insumo contra o texto consolidado vigente da
-- IN 28/2018 (ANVISA), lido na fonte primaria em 15/09/2026.
--
-- ORDEM OBRIGATORIA: esta migration PRESSUPOE a 20260920000000_composicoes_conforme_rotulo.sql
-- aplicada ANTES. E ela que troca o cadastro-teto pela composicao impressa no rotulo (92
-- linhas, metadata.fonte = 'rotulo'). O selo concedido aqui afirma conformidade DESSA
-- composicao - nao do cadastro antigo. A guarda 0 abaixo confere isso e aborta se a
-- 20260920000000 nao tiver sido aplicada (ou tiver sido aplicada sem os blocos das 4
-- formulas aprovadas).
--
-- POR QUE ESTA MIGRATION EXISTE
-- Em 15/09/2026 ficou provado (docs/conformidade/COMPOSICOES-ROTULO-VS-CADASTRO-2026-09-15.md)
-- que o cadastro de composicoes era, em varias formulas, o TETO da ANVISA e nao a formula
-- impressa - e que 4 dos 12 selos existentes tinham sido dados a esse cadastro-teto. O dono
-- pediu selo em todos os produtos; carimbar todos continua RECUSADO (cabecalho da
-- 20260914000000_conformidade.sql: selo so em formula 100% conforme, porque o selo afirma
-- ao comprador que a composicao foi conferida). A alternativa: refazer a conferencia de
-- verdade, sobre os numeros do rotulo, contra a norma lida hoje, e dar selo so a quem passa.
--
-- FONTES PRIMARIAS DESTA AUDITORIA (todas lidas em 15/09/2026, entre 18:26 e 18:50, UTC-4):
--   [F1] IN 28/2018, texto consolidado "Vigente com Alteracoes" (ultima alteracao IN 450/2026,
--        de 10/06/2026), AnvisaLegis, HTTP 200, com os Anexos I, III, IV e VI completos:
--        https://anvisalegis.datalegis.net/action/ActionDatalegis.php?acao=abrirTextoAto&tipo=INM&numeroAto=00000028&seqAto=000&valorAno=2018&orgao=DC%2FANVISA%2FMS&codTipo=&desItem=&desItemFim=&cod_menu=9434&cod_modulo=310&pesquisa=true
--   [F2] RDC 243/2018, texto consolidado (Art. 4, 6, 9 e 14), AnvisaLegis, HTTP 200.
--   [F3] IN 211/2023 (aditivos), texto consolidado ate a IN 466/2026, categoria 14.2,
--        AnvisaLegis, HTTP 200 - usada so para os aditivos que aparecem na linha de composicao.
--   [F4] Painel oficial "Constituintes Autorizados" (Power BI, atualizado em 15/09/2026
--        05:07), aberto via Playwright - so como contraprova de creatina, triptofano,
--        L-teanina e bisglicinato de zinco; o proprio painel avisa que nao substitui o texto legal.
--   [R]  Composicoes: as 92 linhas da 20260920000000 (conferidas iguais ao
--        docs/conformidade/composicoes_rotulo.json, extraido das artes-finais em 13/09/2026).
-- Analise completa, insumo a insumo, com minimo, maximo, forma autorizada, conta de
-- conversao e veredito: docs/conformidade/AUDITORIA-ROTULO-VS-ANVISA-2026-09-15.md.
--
-- RESULTADO DA AUDITORIA (15 formulas com rotulo):
--   100% CONFORME (4): bella-gummy-biotina-em-gummy; creatina-monohidratada-150g-soluvel;
--                      creatina-gummy-sabor-frutas-vermelhas; melatonina-em-gummy-sabor-uva.
--   NAO CONFORME (9):  biotina-em-capsula; detox-matinal-lemon-shot-300g; saude-intestinal;
--                      focus-colina; moro-slim; multivitaminico; zma-zinco-magnesio-e-vitamina-d;
--                      dores-musculares; pre-treino-creatina-sabor-limao-420g.
--   NAO VERIFICAVEL (2): serena; pro-energy.
--   Sem rotulo, nao auditaveis (9): creatina-em-gummy-sabor-tutti-frutti,
--                      creatina-monohidratada-300g-soluvel, emagrecedor-em-capsula,
--                      melatonina-triptofanos-encapsulados, multi-vitta-gestante-e-lactante-em-capsula,
--                      omega-pro-tg, pre-treino-300-g, shot-colageno-300-gramas,
--                      slim-up-emagrecimento-em-gota.
--
-- CRITERIO DO SELO (o mesmo das migrations 20260914000000, 20260915140000 e 20260917000000):
-- todo insumo da composicao (a) em forma listada no Anexo I, (b) verificado (sem depender de
-- laudo que nao existe) e (c) dentro do minimo e do maximo do grupo "> 19 anos" dos Anexos
-- III e IV. Advertencias do Anexo VI e o campo warnings sao pendencia de cadastro/rotulagem,
-- registradas no documento de auditoria, nao criterio do selo.
--
-- O QUE ESTA MIGRATION FAZ, NESTA ORDEM:
--   0. Guarda: as 4 formulas aprovadas existem, ativas, e ja estao com a composicao do
--      rotulo (linhas ativas com metadata.fonte = 'rotulo' na contagem exata auditada:
--      5, 1, 1 e 2). Se nao, aborta - a 20260920000000 nao foi aplicada.
--   1. Remove o selo (3 colunas = NULL) das 8 formulas que tem selo hoje e nao passaram,
--      cada uma com o motivo em comentario.
--   2. Varredura por exclusao: qualquer outra formula com selo fora das 4 aprovadas perde o
--      selo (garante o estado final mesmo que outra sessao tenha carimbado algo depois
--      desta auditoria - mesma defesa usada na 20260917000000).
--   3. Concede o selo as 4 formulas 100% conformes: compliance_verified_at = now(),
--      compliance_norms so com as normas que tocam os insumos daquela formula,
--      compliance_source = URL da fonte primaria [F1].
--   4. Guarda final: exatamente 4 formulas com selo, exatamente essas 4, nenhuma com
--      normas ou fonte nulas.
--
-- O QUE NAO FAZ: nao toca em formula_compositions, warnings, target_audience nem em
-- nenhuma outra coluna de public.formulas; nao apaga nada; nao cria coluna, tabela ou trigger.
-- Os triggers trg_formulas_touch/trg_formulas_audit ja existentes disparam nos UPDATE abaixo.
--
-- IDEMPOTENTE: rodar de novo repete o mesmo estado final (as 4 ganham novo carimbo de
-- now(), o que e aceitavel - a data do selo passa a ser a da ultima execucao).
--
-- ESTADO DO BANCO LIDO EM 15/09/2026 18:31 (chave publica, PostgREST): 12 formulas com
-- compliance_verified_at preenchido - bella-gummy-biotina-em-gummy, biotina-em-capsula,
-- creatina-em-gummy-sabor-tutti-frutti, creatina-gummy-sabor-frutas-vermelhas,
-- creatina-monohidratada-150g-soluvel, creatina-monohidratada-300g-soluvel, dores-musculares,
-- focus-colina, melatonina-em-gummy-sabor-uva, multivitaminico, serena,
-- zma-zinco-magnesio-e-vitamina-d. Depois desta migration: 4.
--
-- APLICACAO: este arquivo so foi criado em disco. NAO foi aplicado em nenhum banco. Quem
-- aplica e o dono, depois de revisar, e SEMPRE depois da 20260920000000.
-- =====================================================================================


-- -------------------------------------------------------------------------------------
-- 0. GUARDA - a 20260920000000 precisa ter sido aplicada (composicao do rotulo no lugar)
-- -------------------------------------------------------------------------------------
-- Contagens exatas das linhas ativas do rotulo, por formula, como auditadas: BELLA GUMMY 5
-- (vitamina C, vitamina E, zinco, vitamina A, biotina); Creatina 150 g 1; Creatina Gummy
-- Frutas Vermelhas 1; Melatonina em Gummy 2 (L-triptofano, melatonina). Se a contagem ou o
-- metadata.fonte nao baterem, o selo seria dado a uma composicao que nao foi auditada -
-- por isso aborta.

do $$
declare
    v_ativas     integer;
    v_do_rotulo  integer;
    r            record;
begin
    for r in
        select *
        from (values
            ('bella-gummy-biotina-em-gummy', 5),
            ('creatina-monohidratada-150g-soluvel', 1),
            ('creatina-gummy-sabor-frutas-vermelhas', 1),
            ('melatonina-em-gummy-sabor-uva', 2)
        ) as e(slug, linhas)
    loop
        select count(*) into v_ativas
        from public.formulas f
        where f.slug = r.slug
          and f.deleted_at is null;

        if v_ativas <> 1 then
            raise exception 'esperada exatamente 1 formula ativa com slug %, encontrado %', r.slug, v_ativas;
        end if;

        select
            count(*),
            count(*) filter (where fc.metadata->>'fonte' = 'rotulo')
        into v_ativas, v_do_rotulo
        from public.formula_compositions fc
        join public.formulas f on f.id = fc.formula_id
        where f.slug = r.slug
          and f.deleted_at is null
          and fc.deleted_at is null
          and fc.active;

        if v_ativas <> r.linhas or v_do_rotulo <> r.linhas then
            raise exception 'formula %: esperadas % linhas ativas de composicao, todas com metadata.fonte = rotulo (migration 20260920000000 aplicada antes); encontradas % ativas, % do rotulo', r.slug, r.linhas, v_ativas, v_do_rotulo;
        end if;
    end loop;
end $$;


-- -------------------------------------------------------------------------------------
-- 1. REMOVE O SELO DAS 8 FORMULAS QUE O TEM HOJE E NAO PASSARAM NA AUDITORIA DO ROTULO
-- -------------------------------------------------------------------------------------
-- Motivo de cada uma (detalhe e conta em AUDITORIA-ROTULO-VS-ANVISA-2026-09-15.md, secao 4):
--
--   serena                         NAO VERIFICAVEL. Todos os 5 insumos dentro da faixa, mas o
--                                  Anexo I so autoriza "L-teanina de folhas de Camellia
--                                  sinensis" (IN 318/2024) e o rotulo declara so "L-teanina",
--                                  sem origem. Volta ao selo com a ficha tecnica do insumo.
--   biotina-em-capsula             NAO CONFORME. Colageno hidrolisado 120 mg: fonte de
--                                  Proteinas no Anexo I, minimo 8,4 g (Anexo III). "Selenio
--                                  quelado" nao e nenhuma das 5 formas de selenio autorizadas.
--                                  Cobre "quelado" e hialuronato de sodio sem forma/origem.
--   focus-colina                   NAO CONFORME. Magnesio 60 mg < minimo 63 mg; L-tirosina
--                                  220 mg < minimo 262,5 mg (nota viii do Anexo III: soma de
--                                  fenilalanina e tirosina). L-teanina sem origem. O selo de
--                                  12/09 foi dado ao cadastro-teto (magnesio 350 mg), nao ao rotulo.
--   multivitaminico                NAO CONFORME. Boro "de quelato de boro": forma nao
--                                  autorizada (Anexo I so lista frutoborato de calcio e
--                                  tetraborato de sodio decahidratado). Acido folico 800 mcg =
--                                  1.333,3 mcg DFE (1 DFE = 0,6 mcg de acido folico, nota iv) >
--                                  maximo 1.281,5 na leitura literal do rotulo. L-teanina sem origem.
--   zma-zinco-magnesio-e-vitamina-d NAO CONFORME. "Quelato de boro (glicinato de boro)"
--                                  56,6 mg: forma nao autorizada, elemento nao declarado no
--                                  rotulo. L-teanina sem origem.
--   dores-musculares               NAO CONFORME. Rotulo Nuviart: colageno hidrolisado 100 mg
--                                  (minimo 8,4 g), carbonato de calcio 100 mg = no maximo 40,0 mg
--                                  de calcio (minimo 180 mg), bisglicinato de magnesio 100 mg
--                                  (14,1 a 30,4 mg de magnesio; minimo 63 mg), "selenio quelado"
--                                  (forma nao autorizada); zinco e ferro com o mesmo numero
--                                  para sal e elemento. O selo de 12/09 foi dado ao cadastro-teto.
--   creatina-em-gummy-sabor-tutti-frutti  SEM ROTULO. Nenhum documento de composicao com
--                                  procedencia; "mesma formula da irma" e inferencia. Volta
--                                  ao selo com a arte de rotulo desta variante.
--   creatina-monohidratada-300g-soluvel   SEM ROTULO. Idem (arte do pote de 300 g).

update public.formulas
set
    compliance_verified_at = null,
    compliance_norms       = null,
    compliance_source      = null
where slug in (
    'serena',
    'biotina-em-capsula',
    'focus-colina',
    'multivitaminico',
    'zma-zinco-magnesio-e-vitamina-d',
    'dores-musculares',
    'creatina-em-gummy-sabor-tutti-frutti',
    'creatina-monohidratada-300g-soluvel'
)
  and compliance_verified_at is not null;


-- -------------------------------------------------------------------------------------
-- 2. VARREDURA POR EXCLUSAO - nenhuma formula fora das 4 aprovadas fica com selo
-- -------------------------------------------------------------------------------------
-- As 8 acima sao as que tinham selo em 15/09/2026 18:31. Se qualquer outra formula tiver
-- ganhado selo depois disso (como aconteceu em 13/09, ver 20260917000000), ela tambem perde
-- aqui: selo so existe com auditoria documentada, e a unica auditoria sobre a composicao do
-- rotulo e a de 15/09/2026, que aprovou exatamente 4.

update public.formulas
set
    compliance_verified_at = null,
    compliance_norms       = null,
    compliance_source      = null
where compliance_verified_at is not null
  and slug not in (
    'bella-gummy-biotina-em-gummy',
    'creatina-monohidratada-150g-soluvel',
    'creatina-gummy-sabor-frutas-vermelhas',
    'melatonina-em-gummy-sabor-uva'
);


-- -------------------------------------------------------------------------------------
-- 3. CONCEDE O SELO AS 4 FORMULAS 100% CONFORMES (composicao do rotulo, norma lida hoje)
-- -------------------------------------------------------------------------------------
-- compliance_norms lista so as normas que tocam os insumos daquela formula (mesma regra das
-- migrations anteriores): a IN 28/2018 sempre, mais a IN alteradora que deu a redacao do
-- limite usado. compliance_source e a URL do texto consolidado [F1], a mesma das migrations
-- anteriores (e a fonte dos LIMITES; o restante das fontes fica documentado no cabecalho e
-- no documento de auditoria). Data = now(): o momento em que o selo foi gravado, depois da
-- auditoria de 15/09/2026.

update public.formulas as f
set
    compliance_verified_at = now(),
    compliance_norms       = v.norms,
    compliance_source      = 'https://anvisalegis.datalegis.net/action/ActionDatalegis.php?acao=abrirTextoAto&tipo=INM&numeroAto=00000028&seqAto=000&valorAno=2018&orgao=DC%2FANVISA%2FMS&codTipo=&desItem=&desItemFim=&cod_menu=9434&cod_modulo=310&pesquisa=true'
from (values
    -- BELLA GUMMY (Biotina em Gummy), rotulo BioGummy.pdf, 5 insumos: vitamina C 45 mg
    -- (13,5-1.916,02), vitamina E DL-alfa-tocoferol 16,7 mg (2,25-1000 mg de alfa-tocoferol,
    -- conforme mesmo a 0,67), zinco 2,4 mg de elemento declarado no rotulo (1,65-29,59),
    -- vitamina A 1.020 mcg RAE (135-2.623,61), biotina 45 mcg (4,5-45, igual ao teto).
    -- Formas: acido ascorbico, DL-alfa-tocoferol, bisglicinato de zinco, acetato de retinol,
    -- D-biotina - todas no Anexo I. Limites originais da IN 28/2018, sem alteracao posterior.
    ('bella-gummy-biotina-em-gummy', array['IN 28/2018']),

    -- CREATINA MONOIDRATADA 150 g SOLUVEL, rotulo CreatinaPo.pdf: creatina monohidratada
    -- 5.000 mg por dose de 5 g. Anexo III minimo 3.000 mg; Anexo IV maximo 5.000 mg com
    -- redacao dada pela IN 373/2025 - igual ao teto, conforme. Advertencia do Anexo VI
    -- presente em warnings.
    ('creatina-monohidratada-150g-soluvel', array['IN 28/2018', 'IN 373/2025']),

    -- CREATINA GUMMY SABOR FRUTAS VERMELHAS, rotulo creatina gummy.pdf: creatina
    -- monohidratada 3.000 mg em 2 gomas - igual ao minimo (3.000), abaixo do teto (5.000,
    -- IN 373/2025). warnings esta vazio no banco (pendencia de cadastro, migration
    -- 20260920100000 em disco) - nao e criterio do selo.
    ('creatina-gummy-sabor-frutas-vermelhas', array['IN 28/2018', 'IN 373/2025']),

    -- MELATONINA EM GUMMY SABOR UVA, rotulo DreamGummy.pdf: L-triptofano 800 mg (42-860) e
    -- melatonina 0,21 mg (maximo 0,21, IN 102/2021; uso restrito a maiores de 19 anos).
    -- Ressalva registrada: documentos da fabrica divergem sobre este slug levar ou nao o
    -- L-triptofano (INGREDIENTES-E-ADVERTENCIAS-FALTANTES-2026-09-15.md, secao 4); nas
    -- duas hipoteses a composicao esta dentro dos limites, por isso o selo se sustenta em
    -- ambas. warnings e target_audience vazios no banco - pendencia de cadastro.
    ('melatonina-em-gummy-sabor-uva', array['IN 28/2018', 'IN 102/2021'])
) as v(slug, norms)
where f.slug = v.slug
  and f.deleted_at is null;


-- -------------------------------------------------------------------------------------
-- 4. GUARDA FINAL - exatamente 4, exatamente estas, nenhuma com normas ou fonte nulas
-- -------------------------------------------------------------------------------------

do $$
declare
    v_total       integer;
    v_aprovadas   integer;
    v_incompletas integer;
begin
    select count(*) into v_total
    from public.formulas
    where compliance_verified_at is not null;

    if v_total <> 4 then
        raise exception 'esperado exatamente 4 formulas com compliance_verified_at preenchido (as 4 aprovadas na auditoria do rotulo de 15/09/2026), encontrado %', v_total;
    end if;

    select
        count(*) filter (where compliance_verified_at is not null),
        count(*) filter (where compliance_verified_at is not null
                           and (compliance_norms is null or compliance_source is null))
    into v_aprovadas, v_incompletas
    from public.formulas
    where deleted_at is null
      and slug in (
        'bella-gummy-biotina-em-gummy',
        'creatina-monohidratada-150g-soluvel',
        'creatina-gummy-sabor-frutas-vermelhas',
        'melatonina-em-gummy-sabor-uva'
      );

    if v_aprovadas <> 4 then
        raise exception 'esperadas as 4 formulas aprovadas com selo, encontradas % (alguma nao recebeu o UPDATE do passo 3)', v_aprovadas;
    end if;

    if v_incompletas <> 0 then
        raise exception 'encontrada(s) % formula(s) aprovada(s) com compliance_norms ou compliance_source nulo (deveria ser 0)', v_incompletas;
    end if;
end $$;
