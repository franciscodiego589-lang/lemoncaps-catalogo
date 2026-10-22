-- =====================================================================================
-- LEMON CAPS - CATALOGO PUBLICO
-- 20260921100000_selos_conforme_cadastro_sem_rotulo.sql - selo "Composicao conferida"
-- para as 2 formulas SEM ROTULO cujo CADASTRO ficou 100% conforme na auditoria de
-- 15/09/2026 (Parte II de docs/conformidade/AUDITORIA-ROTULO-VS-ANVISA-2026-09-15.md).
--
-- *****************************************************************************************
-- *  CONDICAO DE APLICACAO - LER ANTES DE RODAR                                            *
-- *                                                                                       *
-- *  ESTA MIGRATION SO PODE SER APLICADA DEPOIS QUE O DONO CONFIRMAR, POR ESCRITO, QUE O  *
-- *  CADASTRO DESTAS DUAS FORMULAS E A FORMULACAO REAL DO PRODUTO.                        *
-- *                                                                                       *
-- *  Nenhuma das duas tem arte de rotulo nem ficha tecnica lida. A unica declaracao de     *
-- *  composicao que existe e o cadastro do catalogo (public.formula_compositions), e o     *
-- *  cadastro de outras formulas ja foi provado como "teto da ANVISA" em vez de formula    *
-- *  real. Aqui o selo NAO se apoia em rotulo: se apoia na palavra escrita do dono de que  *
-- *  o produto fisico e exatamente o que o cadastro diz. Sem essa confirmacao, o selo      *
-- *  seria uma afirmacao ao comprador sem lastro documental. Guardar a confirmacao junto   *
-- *  com este arquivo (data, quem confirmou, texto).                                       *
-- *****************************************************************************************
--
-- ORDEM OBRIGATORIA: 20260920000000_composicoes_conforme_rotulo.sql ->
-- 20260921000000_selos_conforme_rotulo.sql -> ESTA. A 20260921000000 deixa exatamente 4
-- formulas com selo (as 4 conformes pelo rotulo) e REMOVE o selo destas duas, porque sem
-- rotulo nao eram auditaveis pela Parte I; esta migration devolve o selo as duas, agora
-- com a auditoria da Parte II (cadastro contra a norma) e a confirmacao do dono. A guarda 0
-- confere que o estado de partida e o da 20260921000000 (4 selos, exatamente aqueles).
--
-- O QUE FOI AUDITADO (Parte II, 15/09/2026, 19:36-19:40 UTC-4, cadastro lido ao vivo pela
-- chave publica; limites lidos na fonte primaria [F1] IN 28/2018 texto consolidado
-- "Vigente com Alteracoes", AnvisaLegis, Anexos I, III e IV, coluna "> 19 anos"; contraprova
-- no painel oficial da ANVISA):
--
--   creatina-monohidratada-300g-soluvel  - 1 linha: creatina monoidratada 5.000 mg por dose
--                                          de 5 g (diluida em 200 mL, 1 vez ao dia). Forma:
--                                          Anexo I "Creatina monohidratada" (CAS 6020-87-7).
--                                          Anexo III minimo 3.000 mg; Anexo IV maximo 5.000 mg
--                                          (redacao IN 373/2025). CONFORME, igual ao maximo.
--                                          Soma 5.000 mg em 5.000 mg (100,0%).
--   creatina-em-gummy-sabor-tutti-frutti - 1 linha: creatina monoidratada 3.000 mg por porcao
--                                          (2 gomas ao dia). Mesma forma e mesmos limites.
--                                          CONFORME, igual ao minimo. A massa da porcao nao esta
--                                          declarada no cadastro (nutritional_info diz so "3 g de
--                                          creatina / Base da Gummy") - pendencia de cadastro
--                                          que nao muda o veredito de limites.
--
-- As outras 7 formulas sem rotulo NAO entram: Emagrecedor (cadastro incompleto: 1 linha de
-- 0,25 mg em 1 g, 11 ingredientes sem quantidade), Melatonina + Triptofanos (composicao
-- impossivel na porcao: 126,3% com os sais), Multi Vitta Gestante e Lactante (acido folico e
-- B12 acima do maximo; 144,9% a 161,0% da porcao), Omega Pro TG (minimo de 5 g de lipideos
-- totais: interpretacao pendente), Pre Treino 300 g (lista de ingredientes declara L-citrulina
-- malato, que nao consta do Anexo I, e a composicao nao a tem), Shot + Colageno (teor proteico
-- do colageno hidrolisado desconhecido; extratos declarados sem quantidade), Slim Up (dois
-- extratos sem laudo; cadastro contraditorio). Detalhe e conta em cada tabela da Parte II.
--
-- PENDENCIAS DE CADASTRO das duas aprovadas (nao sao criterio do selo, que e sobre limites de
-- composicao; ficam registradas): warnings vazio nas duas - o Anexo VI exige, para creatina,
-- "Este produto nao deve ser consumido por gestantes, lactantes e criancas"; ingredients_list
-- vazio nas duas; porcao em massa nao declarada na gummy.
--
-- O QUE ESTA MIGRATION FAZ:
--   0. Guarda: estado de partida = exatamente 4 formulas com selo, e sao as 4 da
--      20260921000000; as 2 desta migration existem, ativas, sem selo, com exatamente 1
--      linha ativa de composicao cada, sendo creatina monoidratada na quantidade auditada
--      (5.000 mg e 3.000 mg). Se algo diferir, aborta - o selo seria dado a um cadastro que
--      nao e o auditado.
--   1. Concede o selo as 2: compliance_verified_at = now(), compliance_norms =
--      {IN 28/2018, IN 373/2025} (o teto de 5.000 mg vem da IN 373/2025), compliance_source
--      = URL do texto consolidado [F1].
--   2. Guarda final: exatamente 6 formulas com selo (4 + 2), nenhuma das 2 com normas ou
--      fonte nulas.
--
-- O QUE NAO FAZ: nao toca em formula_compositions, warnings, nutritional_info nem em nenhuma
-- outra coluna; nao apaga nada; nao cria coluna, tabela ou trigger.
--
-- IDEMPOTENTE: se o estado final (6 selos, as 2 creatinas entre eles) ja existir, a guarda 0
-- reconhece, avisa com RAISE NOTICE e nao faz nada - o UPDATE nao encontra linha (filtra
-- compliance_verified_at is null) e a guarda final continua valendo. Qualquer OUTRO estado
-- de partida (nem o inicial da 20260921000000, nem o final desta) aborta: nunca recarimbar
-- por cima de um estado que esta migration nao reconhece.
--
-- APLICACAO: este arquivo so foi criado em disco. NAO foi aplicado em nenhum banco.
-- =====================================================================================


-- -------------------------------------------------------------------------------------
-- 0. GUARDA - estado de partida e composicao auditada
-- -------------------------------------------------------------------------------------

do $$
declare
    v_total      integer;
    v_quatro     integer;
    v_duas       integer;
    v_formulas   integer;
    v_linhas     integer;
    v_creatina   integer;
    r            record;
begin
    select count(*) into v_total
    from public.formulas
    where compliance_verified_at is not null;

    select count(*) into v_quatro
    from public.formulas
    where compliance_verified_at is not null
      and slug in (
        'bella-gummy-biotina-em-gummy',
        'creatina-monohidratada-150g-soluvel',
        'creatina-gummy-sabor-frutas-vermelhas',
        'melatonina-em-gummy-sabor-uva'
      );

    select count(*) into v_duas
    from public.formulas
    where compliance_verified_at is not null
      and slug in (
        'creatina-monohidratada-300g-soluvel',
        'creatina-em-gummy-sabor-tutti-frutti'
      );

    -- Ja aplicada: estado final presente (6 selos = as 4 da 20260921000000 + estas 2).
    -- Nao faz nada; o UPDATE abaixo nao encontra linha e a guarda final confere os 6.
    if v_total = 6 and v_quatro = 4 and v_duas = 2 then
        raise notice 'migration 20260921100000 ja aplicada: 6 formulas com selo, as 2 creatinas sem rotulo entre elas; nada a fazer';
        return;
    end if;

    -- Estado de partida: exatamente 4 selos, e exatamente os 4 da 20260921000000.
    if v_total <> 4 or v_quatro <> 4 then
        raise exception 'estado de partida esperado: exatamente 4 formulas com selo (as 4 da migration 20260921000000); encontrado % com selo, % delas entre as 4 esperadas. Aplicar a 20260921000000 antes.', v_total, v_quatro;
    end if;

    -- As 2 desta migration: ativas, sem selo, 1 linha ativa de composicao, creatina na
    -- quantidade auditada.
    for r in
        select *
        from (values
            ('creatina-monohidratada-300g-soluvel', 5000::numeric),
            ('creatina-em-gummy-sabor-tutti-frutti', 3000::numeric)
        ) as e(slug, quantidade_mg)
    loop
        select count(*) into v_formulas
        from public.formulas f
        where f.slug = r.slug
          and f.deleted_at is null
          and f.compliance_verified_at is null;

        if v_formulas <> 1 then
            raise exception 'esperada exatamente 1 formula ativa e sem selo com slug %, encontrado %', r.slug, v_formulas;
        end if;

        select
            count(*),
            count(*) filter (where fc.unit = 'mg' and fc.quantity = r.quantidade_mg
                               and fc.ingredient_name ilike 'creatina mono%')
        into v_linhas, v_creatina
        from public.formula_compositions fc
        join public.formulas f on f.id = fc.formula_id
        where f.slug = r.slug
          and f.deleted_at is null
          and fc.deleted_at is null
          and fc.active;

        if v_linhas <> 1 or v_creatina <> 1 then
            raise exception 'formula %: esperada exatamente 1 linha ativa de composicao, creatina monoidratada % mg (cadastro auditado em 15/09/2026); encontradas % linhas, % com essa creatina', r.slug, r.quantidade_mg, v_linhas, v_creatina;
        end if;
    end loop;
end $$;


-- -------------------------------------------------------------------------------------
-- 1. CONCEDE O SELO AS 2 CREATINAS SEM ROTULO (cadastro 100% conforme; confirmacao do dono)
-- -------------------------------------------------------------------------------------

update public.formulas as f
set
    compliance_verified_at = now(),
    compliance_norms       = array['IN 28/2018', 'IN 373/2025'],
    compliance_source      = 'https://anvisalegis.datalegis.net/action/ActionDatalegis.php?acao=abrirTextoAto&tipo=INM&numeroAto=00000028&seqAto=000&valorAno=2018&orgao=DC%2FANVISA%2FMS&codTipo=&desItem=&desItemFim=&cod_menu=9434&cod_modulo=310&pesquisa=true'
where f.slug in (
    'creatina-monohidratada-300g-soluvel',
    'creatina-em-gummy-sabor-tutti-frutti'
)
  and f.deleted_at is null
  and f.compliance_verified_at is null;


-- -------------------------------------------------------------------------------------
-- 2. GUARDA FINAL - exatamente 6 selos; as 2 novas com normas e fonte preenchidas
-- -------------------------------------------------------------------------------------

do $$
declare
    v_total       integer;
    v_novas       integer;
    v_incompletas integer;
begin
    select count(*) into v_total
    from public.formulas
    where compliance_verified_at is not null;

    if v_total <> 6 then
        raise exception 'esperado exatamente 6 formulas com selo (4 da 20260921000000 + 2 desta), encontrado %', v_total;
    end if;

    select
        count(*) filter (where compliance_verified_at is not null),
        count(*) filter (where compliance_verified_at is not null
                           and (compliance_norms is null or compliance_source is null))
    into v_novas, v_incompletas
    from public.formulas
    where deleted_at is null
      and slug in (
        'creatina-monohidratada-300g-soluvel',
        'creatina-em-gummy-sabor-tutti-frutti'
      );

    if v_novas <> 2 then
        raise exception 'esperadas as 2 creatinas sem rotulo com selo, encontradas %', v_novas;
    end if;

    if v_incompletas <> 0 then
        raise exception 'encontrada(s) % formula(s) com compliance_norms ou compliance_source nulo (deveria ser 0)', v_incompletas;
    end if;
end $$;
