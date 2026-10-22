-- =====================================================================================
-- LEMON CAPS - CATALOGO PUBLICO
-- 20260919000000_padroniza_modo_de_uso.sql
--
-- Ordem do dono em 14/09/2026: "verifique o modo de uso dos mesmos produtos, estao
-- diferentes... leia todos e deixe padrao". O caso que ele apontou: as duas
-- creatinas soluveis tem a MESMA dose (5 g), mas uma dizia "Diluir 5 g (1 scoop)
-- em 200 mL de agua, consumir uma vez ao dia" e a outra "Ingerir 1 scoop
-- (5 gramas) ao dia" - a segunda nem mencionava diluir, num po soluvel.
--
-- ===========================================================================
-- A REGRA QUE GOVERNOU ESTA MIGRATION: NENHUMA DOSE MUDOU
-- ===========================================================================
-- Modo de uso e dizer de rotulagem, nao texto de marketing. Padronizar aqui e
-- uniformizar a REDACAO - o verbo, a ordem da frase, a unidade e o fecho.
-- Quantidade, frequencia e momento de consumo sao dado de rotulo e foram
-- preservados um a um, conferidos contra o valor que ja estava no banco:
--   - 2 capsulas ao dia continua 2 capsulas ao dia;
--   - 5 g de creatina continua 5 g, nos dois potes (150 g e 300 g);
--   - os 10 g do Detox, do Shot e do Pre Treino 300 g continuam 10 g;
--   - os 14 g do Pre-treino + Creatina continuam 14 g;
--   - o "30 minutos antes do treino" e o "preferencialmente a noite" do Serena
--     continuam onde estavam, porque sao instrucao de uso real, nao redacao.
--
-- NOTA sobre os slugs das creatinas: eles usam "monoHidratada" (com H), enquanto
-- o NOME do produto usa "monoidratada" (sem H). A primeira versao desta migration
-- errou por assumir que o slug seguia o nome, e o autocheck a REJEITOU inteira em
-- vez de aplicar 21 de 24 em silencio. Os slugs aqui sao os reais, lidos no banco.
-- A divergencia de grafia em si e pendencia aberta do dono (o cadastro usa uma, o
-- rotulo impresso usa a outra) e NAO se resolve aqui.
--
-- O QUE FOI UNIFORMIZADO:
--   1. Fecho unico: ", ou conforme orientacao de profissional de saude."
--      Substitui "profissional habilitado" (2 casos) e ENTRA onde nao existia
--      (5 casos). Este acrescimo e deliberado e e o unico ponto em que o texto
--      passa a dizer mais do que dizia: a ressalva e protetiva, alinha o
--      catalogo inteiro e nao contradiz nenhum rotulo - mas se algum rotulo
--      impresso NAO a trouxer, quem decide e o dono com o responsavel tecnico.
--   2. Unidade "mL" (maiusculo, como manda o SI) no lugar de "ml".
--   3. Ponto final em todas (3 nao tinham).
--   4. Verbo em todas (a Melatonina em Gummy era so "2 gomas ao dia").
--   5. Verbo por formato: capsula/softgel "Ingerir", goma "Consumir",
--      soluvel "Diluir ... e consumir", liquido "Ingerir".
--   6. "(1 dose)" no lugar de "(1 scoop)" nas creatinas soluveis, que e o
--      vocabulario ja usado pelas outras quatro formulas soluveis do catalogo.
--
-- O QUE NAO FOI UNIFORMIZADO, de proposito:
--   - Omega Pro TG continua "softgels", nao "capsulas": softgel e a apresentacao
--     real do produto, e trocar seria descrever errado o que esta no pote.
--   - O Emagrecedor Em Capsula mantem a instrucao propria (30 minutos antes das
--     principais refeicoes, com agua) - isso e instrucao de uso de verdade, nao
--     variacao de redacao. So o fecho foi alinhado.
-- =====================================================================================

update public.formulas as f
set usage_instructions = v.texto
from (values
    -- ---------------- CAPSULA ----------------
    -- Oito ja estavam no padrao e sao reescritas identicas (a virgula antes do
    -- "ou" e a unica diferenca): ficam aqui para a migration ser a fonte unica
    -- do texto de todas, e nao so das que estavam erradas.
    ('biotina-em-capsula', 'Ingerir 2 cápsulas ao dia, ou conforme orientação de profissional de saúde.'),
    ('dores-musculares', 'Ingerir 2 cápsulas ao dia, ou conforme orientação de profissional de saúde.'),
    ('focus-colina', 'Ingerir 2 cápsulas ao dia, ou conforme orientação de profissional de saúde.'),
    ('moro-slim', 'Ingerir 2 cápsulas ao dia, ou conforme orientação de profissional de saúde.'),
    ('multivitaminico', 'Ingerir 2 cápsulas ao dia, ou conforme orientação de profissional de saúde.'),
    ('pro-energy', 'Ingerir 2 cápsulas ao dia, ou conforme orientação de profissional de saúde.'),
    ('saude-intestinal', 'Ingerir 2 cápsulas ao dia, ou conforme orientação de profissional de saúde.'),
    ('zma-zinco-magnesio-e-vitamina-d', 'Ingerir 2 cápsulas ao dia, ou conforme orientação de profissional de saúde.'),

    -- "profissional habilitado" -> "profissional de saude".
    ('multi-vitta-gestante-e-lactante-em-capsula', 'Ingerir 2 cápsulas ao dia, ou conforme orientação de profissional de saúde.'),

    -- Nao tinha o fecho.
    ('melatonina-triptofanos-encapsulados', 'Ingerir 2 cápsulas ao dia, ou conforme orientação de profissional de saúde.'),

    -- Softgel preservado; "por dia" -> "ao dia" e fecho acrescentado.
    ('omega-pro-tg', 'Ingerir 2 softgels ao dia, ou conforme orientação de profissional de saúde.'),

    -- Instrucao propria preservada; so o fecho foi alinhado.
    ('emagrecedor-em-capsula', 'Ingerir 1 dose ao dia, aproximadamente 30 minutos antes das principais refeições, acompanhada de água, ou conforme orientação de profissional de saúde.'),

    -- ---------------- SOLUVEL ----------------
    -- As duas creatinas passam a dizer a mesma coisa, porque a dose e a mesma.
    ('creatina-monohidratada-150g-soluvel', 'Diluir 5 g (1 dose) em 200 mL de água e consumir 1 vez ao dia, ou conforme orientação de profissional de saúde.'),
    ('creatina-monohidratada-300g-soluvel', 'Diluir 5 g (1 dose) em 200 mL de água e consumir 1 vez ao dia, ou conforme orientação de profissional de saúde.'),

    -- "ml" -> "mL".
    ('detox-matinal-lemon-shot-300g', 'Diluir 10 g (1 dose) em 200 mL de água e consumir 1 vez ao dia, ou conforme orientação de profissional de saúde.'),
    ('shot-colageno-300-gramas', 'Diluir 10 g (1 dose) em 200 mL de água e consumir 1 vez ao dia, ou conforme orientação de profissional de saúde.'),

    -- Momento de consumo preservado nos dois pre-treinos.
    ('pre-treino-300-g', 'Diluir 10 g (1 dose) em 200 mL de água e consumir 1 vez ao dia, preferencialmente 30 minutos antes do treino, ou conforme orientação de profissional de saúde.'),
    ('pre-treino-creatina-sabor-limao-420g', 'Diluir 14 g (1 dose) em 200 mL de água e consumir 1 vez ao dia, preferencialmente antes do treino, ou conforme orientação de profissional de saúde.'),

    -- ---------------- GUMMY ----------------
    ('bella-gummy-biotina-em-gummy', 'Consumir 2 gomas ao dia, ou conforme orientação de profissional de saúde.'),
    ('creatina-em-gummy-sabor-tutti-frutti', 'Consumir 2 gomas ao dia, ou conforme orientação de profissional de saúde.'),
    ('creatina-gummy-sabor-frutas-vermelhas', 'Consumir 2 gomas ao dia, ou conforme orientação de profissional de saúde.'),
    ('melatonina-em-gummy-sabor-uva', 'Consumir 2 gomas ao dia, ou conforme orientação de profissional de saúde.'),

    -- ---------------- LIQUIDO ----------------
    -- "a noite" preservado: instrucao de uso, nao redacao.
    ('serena', 'Ingerir 20 gotas (1 mL) ao dia, preferencialmente à noite, ou conforme orientação de profissional de saúde.'),
    ('slim-up-emagrecimento-em-gota', 'Ingerir 2 mL ao dia, ou conforme orientação de profissional de saúde.')
) as v(slug, texto)
where f.slug = v.slug
  and f.deleted_at is null
  and f.usage_instructions is distinct from v.texto;


-- -------------------------------------------------------------------------------------
-- AUTOCHECK
-- -------------------------------------------------------------------------------------
do $$
declare
    v_sem_fecho   integer;
    v_sem_ponto   integer;
    v_ml_minusculo integer;
    v_vazio       integer;
    v_creatinas   integer;
begin
    -- Toda formula ativa precisa terminar com a mesma ressalva.
    select count(*) into v_sem_fecho
    from public.formulas
    where deleted_at is null
      and usage_instructions not like '%conforme orientação de profissional de saúde.';

    if v_sem_fecho <> 0 then
        raise exception '% formula(s) ativa(s) sem o fecho padrao de orientacao profissional', v_sem_fecho;
    end if;

    select count(*) into v_sem_ponto
    from public.formulas
    where deleted_at is null and usage_instructions not like '%.';

    if v_sem_ponto <> 0 then
        raise exception '% formula(s) ativa(s) com modo de uso sem ponto final', v_sem_ponto;
    end if;

    -- "ml" minusculo isolado nao pode sobrar: a unidade do SI e mL.
    select count(*) into v_ml_minusculo
    from public.formulas
    where deleted_at is null and usage_instructions like '% ml %';

    if v_ml_minusculo <> 0 then
        raise exception '% formula(s) ainda usando "ml" em vez de "mL"', v_ml_minusculo;
    end if;

    select count(*) into v_vazio
    from public.formulas
    where deleted_at is null
      and (usage_instructions is null or btrim(usage_instructions) = '');

    if v_vazio <> 0 then
        raise exception '% formula(s) ativa(s) com modo de uso vazio', v_vazio;
    end if;

    -- O caso que originou o pedido: mesma dose, mesmo texto.
    select count(distinct usage_instructions) into v_creatinas
    from public.formulas
    where deleted_at is null and slug like 'creatina-monohidratada-%soluvel';

    if v_creatinas <> 1 then
        raise exception 'as creatinas soluveis deveriam ter modo de uso identico, encontrei % textos diferentes', v_creatinas;
    end if;
end $$;
