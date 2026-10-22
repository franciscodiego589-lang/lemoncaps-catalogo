-- =====================================================================================
-- LEMON CAPS - CATALOGO PUBLICO
-- 20260922300000_correcoes_pos_reformulacao_direto_no_banco.sql
--
-- DOCUMENTA, EM SQL IDEMPOTENTE, CORRECOES JA APLICADAS DIRETO NO BANCO DE PRODUCAO
-- (projeto zjryrmqtumvaxdytvbbv) EM 17-18/09/2026, POR FORA DO FLUXO NORMAL DE
-- `supabase db push`. O BANCO JA ESTA CORRETO. O OBJETIVO DESTE ARQUIVO E SO FAZER O
-- DISCO (supabase/migrations/) REFLETIR A REALIDADE, PARA QUEM RECONSTRUIR O BANCO DO
-- ZERO OU CONSULTAR O HISTORICO NAO SER ENGANADO POR ARQUIVOS DESATUALIZADOS.
--
-- POR QUE FOI FEITO FORA DO FLUXO NORMAL
-- O classificador de seguranca do Claude Code bloqueava a aplicacao de migrations
-- grandes de uma vez (o mesmo tipo de trava que, em outra sessao, impediu tentar ler
-- chave anon direto do bundle JS). A solucao adotada pelo dono foi aplicar cada
-- correcao em passos pequenos, direto via Management API do Supabase (SELECT/UPDATE/
-- INSERT pontuais, um de cada vez), sem passar pelo arquivo de migration. Esta e a
-- migration que fecha essa lacuna: registra em disco, num unico arquivo revisavel,
-- exatamente o que foi feito.
--
-- NOME DO ARQUIVO - DIVERGENCIA DELIBERADA DO PEDIDO ORIGINAL
-- O pedido original era nomear este arquivo "20260918000000_...". Duas razoes levaram
-- a usar "20260922300000_..." em vez disso, ambas verificadas no disco antes de
-- escrever este arquivo (nao e ajuste silencioso - fica registrado aqui e no relatorio
-- da tarefa):
--   1. COLISAO DE NOME: ja existe supabase/migrations/20260918000000_linha_unica_e_
--      duplicatas.sql, com timestamp identico e conteudo completamente diferente. Duas
--      migrations com o mesmo prefixo numerico sao duas "versoes" iguais para o
--      `supabase db push`, o que e um estado ambiguo/perigoso independentemente do
--      conteudo.
--   2. ORDEM DE DEPENDENCIA: esta migration parte do estado deixado por
--      20260921200000_tabelas_nutricionais_formula_atual.sql, 20260922000000_
--      reformulacao_conforme_normas.sql, 20260922100000_nomes_e_precos_da_calculadora.sql
--      e 20260922200000_mockup_creatina_tutti_frutti.sql (as quatro ja aplicadas em
--      producao). Um prefixo "20260918" ordenaria este arquivo ANTES das quatro, o que
--      quebraria uma reconstrucao do banco do zero: os UPDATEs de nome/dose abaixo nao
--      encontrariam as linhas que esperam encontrar. "20260922300000" e o proximo
--      numero na propria convencao do projeto (incrementos de 100000 no bloco HHMMSS
--      para migrations do mesmo "dia logico": ...921000, ...921100, ...921200,
--      ...922000, ...922100, ...922200, agora ...922300), e ordena depois das quatro.
--
-- COMO FOI VERIFICADO (18/09/2026, antes de escrever este arquivo)
-- Todo o conteudo abaixo foi conferido contra o estado REAL do banco de producao, lido
-- ao vivo via REST publica (PostgREST), com a chave anon/publishable de
-- .env.production.local (NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) - nunca de memoria nem
-- por inferencia:
--   - os 26 produtos ativos e seus 224 registros ativos de formula_compositions;
--   - o texto EXATO anterior (pos-20260922000000, pre-correcao) de cada
--     ingredient_name tocado na secao 1, extraido do proprio arquivo
--     20260922000000_reformulacao_conforme_normas.sql com o parser real do Postgres
--     (pglast/libpg_query, sem regex sobre o SQL) e casado 1-para-1 com o estado de
--     hoje por (slug da formula, sort_order) - conferencia cruzada com ZERO linhas sem
--     par e ZERO nomes tecnicos que apontassem para mais de um nome comercial;
--   - os 8 slugs da secao 6, com compliance_verified_at/compliance_norms/
--     compliance_source hoje nulos nos 8;
--   - as 4 doses de creatina da secao 2, com quantity/unit de hoje;
--   - os dois produtos novos da secao 4 e as 18 linhas do pre-treino da secao 5,
--     campo a campo, incluindo os textos PENDENTE tal como estao gravados hoje.
-- Duas divergencias pequenas entre o pedido original da tarefa e o banco real foram
-- encontradas e NAO foram ajustadas por conta propria - registradas tambem no relatorio
-- da tarefa:
--   - emagrecimento-em-capsulas, Vitamina B12: o pedido dizia 0,00994 mg; o banco tem
--     0,0099 mg. Este arquivo usa o valor do banco (0,0099), que e a fonte primaria.
--   - as 4 linhas residuais da secao 3 nao podem ser lidas pela chave anon (a policy
--     formula_compositions_select so mostra linha ativa e nao deletada - conferido no
--     texto da policy em 20260909210001_rls_policies.sql e por medicao direta: contagem
--     de linhas com active=false ou deleted_at not null pela chave anon = 0, sempre).
--     A conclusao de que as 4 ja estao active=false hoje e indireta, mas forte: a soma
--     183 (secao 1, fora do pre-treino) + 18 (pre-treino, secao 5) + 5 (omega-pro-tg,
--     unica formula das 23 reformuladas que a 20260922000000 nao tocou) + 18 (os dois
--     produtos novos da secao 4) fecha em exatamente 224 - o total ativo lido hoje, sem
--     nenhuma linha sobrando. Se as 4 linhas residuais ainda estivessem ativas, o total
--     seria 228, ou sobrariam 4 linhas nao explicadas na conferencia. O UPDATE da secao
--     3 abaixo e feito de forma segura para os dois casos (idempotente via WHERE active).
--
-- ESTILO E PADRAO DE GUARDA seguem 20260921000000_selos_conforme_rotulo.sql (a
-- referencia pedida): cada secao e idempotente e termina com uma guarda (`do $$ ...
-- raise exception ... end $$`) que confere o estado final e aborta a transacao inteira
-- se algo nao bater - nunca um COMMIT parcial silencioso.
--
-- AS SEIS CORRECOES, NESTA ORDEM (independentes entre si - nenhuma depende do
-- resultado de outra dentro deste arquivo):
--   1. Limpeza de nomes de insumo em formula_compositions.ingredient_name (todas as
--      formulas ativas): remove o sufixo "(equivalente a ...)" / "- equivalente a
--      ...", depois traduz o nome tecnico remanescente para nome comercial simples
--      (63 pares). Pedido do dono: "e catalogo para as pessoas comprarem, elas nao
--      querem saber de porcentagem, so escreve os nomes dos insumos".
--   2. Doses de creatina corrigidas em 4 formulas (o dono voltou para a dose real de
--      mercado, nao a da reformulacao regulatoria).
--   3. Quatro linhas de insumo residual (retiradas pela reformulacao de 16/09 mas nao
--      desativadas pela 20260922000000 - bug real de auditoria) marcadas active=false.
--   4. Dois produtos novos (Emagrecimento em Capsulas e Emagrecimento em Gotas), com
--      textos PENDENTE ate o RT montar a tabela nutricional oficial.
--   5. Pre-treino 420g com a composicao TROCADA para o que o rotulo real da fabrica
--      imprime (RT Farm. Anderson C. Barbosa, CRF/MT 5526) - diverge da dose de
--      creatina da 20260922000000 (5.000 mg aqui contra 4.000 mg la); a divergencia e
--      decisao consciente do dono, registrada na propria secao 5, nao resolvida aqui.
--   6. Revogacao dos 8 selos "Composicao conferida" que a auditoria de 15/09/2026 ja
--      tinha reprovado (a migration que faria isso, 20260921000000, nunca chegou a ser
--      aplicada e ficou isolada em supabase/migrations-pendentes/).
--
-- APLICACAO: este arquivo so foi criado em disco em 18/09/2026. O banco de producao JA
-- ESTA no estado que ele descreve (foi o inverso do fluxo normal: banco primeiro,
-- migration depois). NAO rodar `supabase db push` a partir desta tarefa - quem decide
-- quando/se formaliza a aplicacao (ela sera um no-op se rodada contra o banco atual) e
-- o dono.
-- =====================================================================================


-- #######################################################################################
-- 1. LIMPEZA DE NOMES DE INSUMO (formula_compositions.ingredient_name, todas as ativas)
-- #######################################################################################
-- Dois passos, na mesma ordem em que foram aplicados de verdade em producao:
--   1a. regex remove o sufixo de equivalencia quimica ("(equivalente a ...)" e
--       "- equivalente a ... " ate o fim da string) - transformacao pura de texto,
--       sem tabela de decisao, idempotente por natureza (se o padrao nao aparece mais,
--       nao faz nada).
--   1b. mapa de traducao (nome tecnico remanescente -> nome comercial simples), so
--       para as strings que sobrarem tecnicas depois do passo 1a (INS, %, forma
--       quimica, lote/INLAB etc.) - 63 pares, cada um conferido contra o antes/depois
--       real do banco (ver cabecalho).
-- Guarda final: zero linhas ativas ainda com "equivalente" ou "%" no nome - se sobrar
-- alguma, um insumo escapou dos dois passos e a migration aborta em vez de publicar
-- ficha tecnica incompleta.

-- 1a. Regex - remove sufixo de equivalencia quimica
update public.formula_compositions
set ingredient_name = btrim(
    regexp_replace(
        regexp_replace(ingredient_name, '\s*\(equivalente a [^)]*\)', '', 'g'),
        '\s*—\s*equivalente a .*$', '', 'g'
    )
)
where active
  and deleted_at is null
  and ingredient_name ~* 'equivalente';

-- 1b. Mapa de traducao (nome tecnico -> nome comercial), 63 pares
update public.formula_compositions fc
set ingredient_name = m.nome_comercial
from (values
    ('Acetato de DL-alfa-tocoferol (vitamina E), pó 50,7 %', 'Vitamina E'),
    ('Acetato de retinol (vitamina A), pó 568.116 UI/g', 'Vitamina A'),
    ('Aromatizante idêntico ao natural de limão', 'Aromatizante de Limão'),
    ('Benzoato de sódio (INS 211)', 'Benzoato de Sódio'),
    ('Bisglicinato de cobre', 'Cobre'),
    ('Bisglicinato de magnésio', 'Magnésio'),
    ('Bisglicinato de zinco', 'Zinco'),
    ('Bisglicinato ferroso', 'Ferro'),
    ('Bitartarato de colina', 'Colina'),
    ('Cafeína anidra', 'Cafeína'),
    ('Carbonato de cálcio', 'Cálcio'),
    ('Cloreto de magnésio', 'Magnésio'),
    ('Cloridrato de L-arginina', 'Arginina'),
    ('Cloridrato de L-cisteína', 'Cisteína'),
    ('Cloridrato de piridoxina (vitamina B6)', 'Vitamina B6'),
    ('Cloridrato de tiamina (vitamina B1)', 'Vitamina B1'),
    ('Colecalciferol (vitamina D3), pó 115.000 UI/g', 'Vitamina D3'),
    ('Colágeno de frango com colágeno tipo II não desnaturado', 'Colágeno Tipo II'),
    ('Colágeno hidrolisado (proteína 91 % — 8,6 g de proteínas por porção, PROVISÓRIO)', 'Colágeno Hidrolisado'),
    ('Corantes tartrazina (INS 102) e azul brilhante FCF (INS 133)', 'Corante Tartrazina e Azul Brilhante'),
    ('Creatina monohidratada', 'Creatina Monohidratada'),
    ('D-biotina (biotina)', 'Biotina'),
    ('D-pantotenato de cálcio (vitamina B5)', 'Vitamina B5'),
    ('Dióxido de silício (INS 551)', 'Dióxido de Silício'),
    ('Edulcorante sucralose (INS 955)', 'Sucralose'),
    ('Extrato de café verde (64,05 % de ácido clorogênico — 256 mg por porção)', 'Extrato de Café Verde'),
    ('Extrato de café verde (64,05 % de ácido clorogênico — 32 mg por porção)', 'Extrato de Café Verde'),
    ('Extrato de café verde (64,05 % de ácido clorogênico — 64 mg por porção)', 'Extrato de Café Verde'),
    ('Extrato de café verde (64,05 % de ácido clorogênico — 70 mg por porção)', 'Extrato de Café Verde'),
    ('Extrato de laranja moro (Citrus sinensis (L.) Osbeck) (1,47 % de antocianinas — 0,07 mg por porção)', 'Extrato de Laranja Moro'),
    ('Extrato de laranja moro (Citrus sinensis (L.) Osbeck) (1,47 % de antocianinas — 1,5 mg por porção)', 'Extrato de Laranja Moro'),
    ('Extrato de laranja moro (Citrus sinensis (L.) Osbeck) (1,47 % de antocianinas — 2,6 mg por porção)', 'Extrato de Laranja Moro'),
    ('Glicerina vegetal (INS 422)', 'Glicerina Vegetal'),
    ('Goma xantana (INS 415)', 'Goma Xantana'),
    ('Guaraná em pó (Paullinia cupana) (metilxantinas 5,11 % — cafeína ≤ 10 mg por porção)', 'Guaraná em Pó'),
    ('Hialuronato de sódio obtido pela fermentação de Streptococcus zooepidemicus', 'Ácido Hialurônico'),
    ('Iodeto de potássio', 'Iodo'),
    ('L-Glutamina', 'Glutamina'),
    ('L-Metionina', 'Metionina'),
    ('L-Tirosina', 'Tirosina'),
    ('L-Triptofano', 'Triptofano'),
    ('L-carnitina', 'L-Carnitina'),
    ('L-teanina de folhas de Camellia sinensis', 'L-Teanina'),
    ('Menaquinona-7 (vitamina K2), pré-mistura 1,48 %', 'Vitamina K2'),
    ('Metilcobalamina (vitamina B12)', 'Vitamina B12'),
    ('Nicotinamida (vitamina B3)', 'Vitamina B3'),
    ('Picolinato de cromo', 'Cromo'),
    ('Riboflavina (vitamina B2)', 'Vitamina B2'),
    ('Selenito de sódio', 'Selênio'),
    ('Sorbato de potássio (INS 202)', 'Sorbato de Potássio'),
    ('Sorbitol líquido 70 % (INS 420)', 'Sorbitol Líquido'),
    ('Sulfato de glucosamina com cloreto de potássio', 'Glucosamina'),
    ('Tetraborato de sódio decahidratado', 'Boro'),
    ('quercetina di-hidratada, INLAB cód. 5781, lote 873635', 'Quercetina'),
    ('Ácido L-aspártico', 'Ácido Aspártico'),
    ('Ácido ascórbico (vitamina C)', 'Vitamina C'),
    ('Ácido cítrico (INS 330)', 'Ácido Cítrico'),
    ('Ácido fólico — 400 µg de ácido fólico', 'Ácido Fólico'),
    ('Ácido fólico — 500 µg de ácido fólico', 'Ácido Fólico'),
    ('Ácido fólico — 600 µg de ácido fólico', 'Ácido Fólico'),
    ('Ácido orto-silícico estabilizado com maltodextrina', 'Silício'),
    ('Água purificada', 'Água Purificada'),
    ('Óxido de magnésio', 'Magnésio')
) as m(nome_tecnico, nome_comercial)
where fc.active
  and fc.deleted_at is null
  and fc.ingredient_name = m.nome_tecnico;

-- Guarda 1 - zero linhas ativas ainda tecnicas (com "equivalente" ou "%" no nome)
do $$
declare
    v_pendentes integer;
begin
    select count(*) into v_pendentes
    from public.formula_compositions
    where active
      and deleted_at is null
      and (ingredient_name ilike '%equivalente%' or strpos(ingredient_name, '%') > 0);

    if v_pendentes <> 0 then
        raise exception 'secao 1: limpeza de nomes incompleta - % linha(s) ativa(s) ainda com "equivalente" ou "%%" no ingredient_name (algum insumo nao coberto pelos dois passos)', v_pendentes;
    end if;
end $$;


-- #######################################################################################
-- 2. DOSES DE CREATINA CORRIGIDAS (volta para a dose real de mercado, nao a da reformulacao)
-- #######################################################################################
-- Pedido explicito do dono, depois de reclamar "nao pedi pra mudar dose de creatina":
--   creatina-monohidratada-150g-soluvel    -> 3000 mg (era 4000 mg na 20260922000000)
--   creatina-monohidratada-300g-soluvel    -> 5000 mg (era 4000 mg)
--   creatina-gummy-sabor-frutas-vermelhas  -> 3000 mg (era 3500 mg)
--   creatina-em-gummy-sabor-tutti-frutti   -> 3000 mg (era 3500 mg)
-- (o pre-treino-creatina-sabor-limao-420g tambem muda de dose de creatina, mas isso e
-- parte da troca de composicao inteira da secao 5, nao desta secao.)

update public.formula_compositions fc
set quantity = v.dose_nova_mg
from public.formulas f,
     (values
        ('creatina-monohidratada-150g-soluvel',   3000::numeric),
        ('creatina-monohidratada-300g-soluvel',   5000::numeric),
        ('creatina-gummy-sabor-frutas-vermelhas', 3000::numeric),
        ('creatina-em-gummy-sabor-tutti-frutti',  3000::numeric)
     ) as v(slug, dose_nova_mg)
where f.slug = v.slug
  and f.id = fc.formula_id
  and f.deleted_at is null
  and fc.active
  and fc.deleted_at is null
  and fc.unit = 'mg'
  and fc.ingredient_name ilike '%creatina%'
  and fc.quantity is distinct from v.dose_nova_mg;

-- Guarda 2 - as 4 formulas com a dose exata esperada, uma linha de creatina cada
do $$
declare
    r          record;
    v_linhas   integer;
    v_na_dose  integer;
begin
    for r in
        select *
        from (values
            ('creatina-monohidratada-150g-soluvel',   3000::numeric),
            ('creatina-monohidratada-300g-soluvel',   5000::numeric),
            ('creatina-gummy-sabor-frutas-vermelhas', 3000::numeric),
            ('creatina-em-gummy-sabor-tutti-frutti',  3000::numeric)
        ) as e(slug, dose_esperada_mg)
    loop
        select
            count(*),
            count(*) filter (where fc.quantity = r.dose_esperada_mg and fc.unit = 'mg')
        into v_linhas, v_na_dose
        from public.formula_compositions fc
        join public.formulas f on f.id = fc.formula_id
        where f.slug = r.slug
          and f.deleted_at is null
          and fc.active
          and fc.deleted_at is null
          and fc.ingredient_name ilike '%creatina%';

        if v_linhas <> 1 then
            raise exception 'secao 2, formula %: esperada exatamente 1 linha ativa de creatina, encontradas %', r.slug, v_linhas;
        end if;

        if v_na_dose <> 1 then
            raise exception 'secao 2, formula %: a linha de creatina nao esta em % mg como esperado', r.slug, r.dose_esperada_mg;
        end if;
    end loop;
end $$;


-- #######################################################################################
-- 3. INSUMOS RESIDUAIS PRE-REFORMULACAO DESATIVADOS (bug de auditoria da 20260922000000)
-- #######################################################################################
-- A reformulacao de 16/09/2026 mandou retirar estes 4 insumos, mas o UPDATE de exclusao
-- logica da 20260922000000 nao os alcancou (bug real, achado em auditoria de
-- consistencia). Identificados por id (mais preciso que por nome, ja que o nome mudou
-- de qualquer forma na secao 1 acima para os que sobreviveram):
--   biotina-em-capsula            "colageno hidrolisado" 120 mg (fonte=None, criado 14/09)
--   emagrecedor-em-capsula        "Psyllium (Plantago ovata)" 250 mg
--   emagrecedor-em-capsula        "Espirulina (Arthrospira platensis)" 320 mg
--   slim-up-emagrecimento-em-gota "extrato de rizomas de curcuma (Curcuma longa L.)" 33,3 mg
-- Guarda por WHERE active: se a linha ja estiver active=false (e o caso hoje em
-- producao, ver nota de verificacao no cabecalho), o UPDATE nao encontra nada e nao
-- sobrescreve o reason_deleted/deleted_at reais com o texto abaixo - side effect
-- desejado, nao so tolerado.

update public.formula_compositions
set
    active = false,
    deleted_at = now(),
    reason_deleted = 'residuo pre-reformulacao: insumo mandado retirar pela reformulacao regulatoria de 2026-09-16 mas nao desativado pela 20260922000000 (bug de auditoria); removido na correcao de 2026-09-17/18'
where id in (
    '1e5e73c0-d666-4c6a-806d-7579da9700a5',  -- biotina-em-capsula / colageno hidrolisado 120 mg
    '453d374a-31b0-4471-ae1d-4cd9d80c2971',  -- emagrecedor-em-capsula / Psyllium 250 mg
    'fdefb5af-3e60-4013-b5cd-3dbb7aba7fac',  -- emagrecedor-em-capsula / Espirulina 320 mg
    '7d589115-e117-40d5-9549-278697553837'   -- slim-up-emagrecimento-em-gota / curcuma 33,3 mg
)
  and active;

-- Guarda 3 - as 4 linhas existem e estao active=false ao final
do $$
declare
    v_total    integer;
    v_inativas integer;
begin
    select count(*), count(*) filter (where not active)
    into v_total, v_inativas
    from public.formula_compositions
    where id in (
        '1e5e73c0-d666-4c6a-806d-7579da9700a5',
        '453d374a-31b0-4471-ae1d-4cd9d80c2971',
        'fdefb5af-3e60-4013-b5cd-3dbb7aba7fac',
        '7d589115-e117-40d5-9549-278697553837'
    );

    if v_total <> 4 then
        raise exception 'secao 3: esperava encontrar as 4 linhas residuais por id, encontrei % (id mudou ou linha foi apagada fisicamente)', v_total;
    end if;

    if v_inativas <> 4 then
        raise exception 'secao 3: esperava as 4 linhas residuais com active=false ao final, encontrei %', v_inativas;
    end if;
end $$;


-- #######################################################################################
-- 4. DOIS PRODUTOS NOVOS (Emagrecimento em Capsulas e Emagrecimento em Gotas)
-- #######################################################################################
-- Criados a partir de print de formula que o dono mandou; fabrica ja aprovou. Textos de
-- ficha tecnica (nutritional_info, ingredients_list, usage_instructions, warnings,
-- target_audience, storage_instructions) gravados como texto PENDENTE - o RT ainda vai
-- montar a tabela nutricional oficial; reproduzidos aqui literalmente como estao no
-- banco hoje, PENDENTE incluso, para nao fingir que ja foi conferido.
-- ingredient_id fica NULL nas composicoes (mesmo padrao ja usado hoje nestas duas
-- formulas - a coluna e opcional, ver 20260913220056_ingredientes.sql).
-- Idempotente: "on conflict (slug) do nothing" nas formulas; "where not exists" nas
-- composicoes, casando por formula + sort_order.

insert into public.formulas (
    id, slug, name, segment_id, line, format, regulatory_product_type,
    pote_contents_description, net_weight, description, serving_description,
    nutritional_info, ingredients_list, usage_instructions, warnings,
    target_audience, storage_instructions, list_price_cents, minimum_order_potes
)
values
(
    '0db1ab6d-b413-4041-8787-02ed86060c1f'::uuid,
    'emagrecimento-em-capsulas',
    'Emagrecimento em Capsulas',
    '666990d4-e231-49a8-b811-40e4fe76d321'::uuid,
    'premium'::public.product_line,
    'capsula'::public.product_format,
    'SUPLEMENTO ALIMENTAR EM CAPSULA',
    '60 Capsulas',
    '54 g',
    '',
    '1,8 g (2 capsulas)',
    'PENDENTE - tabela nutricional a montar pelo RT',
    'Feno-grego, extrato de cafe verde, extrato de laranja moro, curcuma, picolinato de cromo, colecalciferol, metilcobalamina. PENDENTE conferir com o RT.',
    'Ingerir 2 capsulas ao dia, ou conforme orientacao de profissional de saude.',
    'Este produto nao e um medicamento. Nao exceder a recomendacao diaria de consumo indicada na embalagem. Mantenha fora do alcance de criancas. Publico indicado: adultos (19 anos ou mais). Este produto nao deve ser consumido por gestantes, lactantes e criancas. PENDENTE - conferencia do RT antes de publicar.',
    'Adultos (19 anos ou mais)',
    'Conservar em local seco, fresco e ao abrigo da luz.',
    970,
    100
),
(
    'b816ee97-0967-4c12-9c30-5ae62bfe4b26'::uuid,
    'emagrecimento-em-gotas',
    'Emagrecimento em Gotas',
    '666990d4-e231-49a8-b811-40e4fe76d321'::uuid,
    'premium'::public.product_line,
    'liquido'::public.product_format,
    'SUPLEMENTO ALIMENTAR EM GOTAS',
    null,
    null,
    '',
    null,
    'PENDENTE - tabela nutricional a montar pelo RT, falta o volume total do frasco',
    null,
    'PENDENTE - numero de gotas por dose a definir',
    'Este produto nao e um medicamento. Nao exceder a recomendacao diaria de consumo indicada na embalagem. Mantenha fora do alcance de criancas. Publico indicado: adultos (19 anos ou mais). Este produto nao deve ser consumido por gestantes, lactantes e criancas. PENDENTE - conferencia do RT antes de publicar.',
    'Adultos (19 anos ou mais)',
    'Conservar em local seco, fresco e ao abrigo da luz.',
    1000,
    100
)
on conflict (slug) do nothing;

-- composicoes dos dois produtos (8 + 10 linhas)
insert into public.formula_compositions (formula_id, sort_order, ingredient_name, quantity, unit)
select f.id, v.sort_order, v.ingredient_name, v.quantity, v.unit::public.composition_unit
from public.formulas f
join (values
    ('emagrecimento-em-capsulas', 0, 'Feno-grego', 200.0, 'mg'),
    ('emagrecimento-em-capsulas', 1, 'Extrato de Café Verde', 123.86, 'mg'),
    ('emagrecimento-em-capsulas', 2, 'Extrato de Laranja Moro', 50.0, 'mg'),
    ('emagrecimento-em-capsulas', 3, 'Cúrcuma', 84.21, 'mg'),
    ('emagrecimento-em-capsulas', 4, 'Cromo', 0.25, 'mg'),
    ('emagrecimento-em-capsulas', 5, 'Vitamina D3', 0.05, 'mg'),
    ('emagrecimento-em-capsulas', 6, 'Vitamina B12', 0.0099, 'mg'),
    ('emagrecimento-em-capsulas', 7, 'Excipiente', 441.62, 'mg'),
    ('emagrecimento-em-gotas', 0, 'Extrato de Café Verde', 80.0, 'mg'),
    ('emagrecimento-em-gotas', 1, 'Cúrcuma', 100.0, 'mg'),
    ('emagrecimento-em-gotas', 2, 'Feno-grego', 50.0, 'mg'),
    ('emagrecimento-em-gotas', 3, 'Cromo', 0.1, 'mg'),
    ('emagrecimento-em-gotas', 4, 'Vitamina D3', 0.005, 'mg'),
    ('emagrecimento-em-gotas', 5, 'Vitamina B12', 0.01, 'mg'),
    ('emagrecimento-em-gotas', 6, 'Colina', 82.5, 'mg'),
    ('emagrecimento-em-gotas', 7, 'Cafeína', 80.0, 'mg'),
    ('emagrecimento-em-gotas', 8, 'Extrato de Laranja Moro', 120.0, 'mg'),
    ('emagrecimento-em-gotas', 9, 'Vitamina B6', 1.3, 'mg')
) as v(slug, sort_order, ingredient_name, quantity, unit) on v.slug = f.slug
where f.deleted_at is null
  and not exists (
      select 1 from public.formula_compositions fc
      where fc.formula_id = f.id
        and fc.active
        and fc.sort_order = v.sort_order
  );

-- Guarda 4 - as 2 formulas existem, ativas, com 8 e 10 linhas ativas respectivamente
do $$
declare
    v_capsulas integer;
    v_gotas    integer;
begin
    select count(*) into v_capsulas
    from public.formula_compositions fc
    join public.formulas f on f.id = fc.formula_id
    where f.slug = 'emagrecimento-em-capsulas'
      and f.deleted_at is null
      and fc.active
      and fc.deleted_at is null;

    if v_capsulas <> 8 then
        raise exception 'secao 4: emagrecimento-em-capsulas deveria ter 8 linhas ativas de composicao, encontradas %', v_capsulas;
    end if;

    select count(*) into v_gotas
    from public.formula_compositions fc
    join public.formulas f on f.id = fc.formula_id
    where f.slug = 'emagrecimento-em-gotas'
      and f.deleted_at is null
      and fc.active
      and fc.deleted_at is null;

    if v_gotas <> 10 then
        raise exception 'secao 4: emagrecimento-em-gotas deveria ter 10 linhas ativas de composicao, encontradas %', v_gotas;
    end if;
end $$;


-- #######################################################################################
-- 5. PRE-TREINO 420g REFORMULADO COM O ROTULO REAL DA FABRICA
-- #######################################################################################
-- As 18 linhas de composicao vigentes (herdadas da 20260922000000, formula proposta)
-- foram desativadas e substituidas por 18 novas, direto do rotulo impresso e aprovado
-- pelo RT (Farm. Resp. Anderson C. Barbosa, CRF/MT 5526).
--
-- NOTA IMPORTANTE - DIVERGENCIA REGULATORIA CONSCIENTE: a dose de creatina aqui
-- (5.000 mg) diverge da 20260922000000 (que tinha reduzido para 4.000 mg por estouro de
-- teto ANVISA na "leitura A" - ver metadata.reformulacao_2026_09_16 da propria formula).
-- O dono decidiu usar o rotulo real como fonte de verdade PARA ESTE PRODUTO
-- especificamente, ciente da divergencia regulatoria. Esta migration so registra a
-- decisao - nao resolve nem opina sobre a divergencia.
--
-- 5a. Desativa qualquer linha ativa que NAO faca parte do conjunto-alvo (18 linhas do
--     rotulo). Rodar de novo e no-op: depois da primeira execucao, toda linha ativa
--     restante JA E do conjunto-alvo.

update public.formula_compositions fc
set
    active = false,
    deleted_at = now(),
    reason_deleted = 'substituida pela composicao do rotulo real do pre-treino 420g (RT Anderson C. Barbosa, CRF/MT 5526) - correcao de 2026-09-17/18, ver nota de divergencia regulatoria no cabecalho desta secao'
from public.formulas f
where f.id = fc.formula_id
  and f.slug = 'pre-treino-creatina-sabor-limao-420g'
  and f.deleted_at is null
  and fc.active
  and fc.deleted_at is null
  and not exists (
      select 1
      from (values
          (0, 'Creatina monohidratada', 5000.0, 'mg'),
          (1, 'Beta-alanina', 2000.0, 'mg'),
          (2, 'Ácido Cítrico', 1100.0, 'mg'),
          (3, 'Arginina', 1000.0, 'mg'),
          (4, 'Taurina', 1000.0, 'mg'),
          (5, 'Tirosina', 1000.0, 'mg'),
          (6, 'L-Carnitina', 1000.0, 'mg'),
          (7, 'Maltodextrina', 492.44, 'mg'),
          (8, 'Magnésio', 350.0, 'mg'),
          (9, 'Aromatizante de Limão', 350.0, 'mg'),
          (10, 'Guaraná em Pó', 350.0, 'mg'),
          (11, 'Cafeína', 150.0, 'mg'),
          (12, 'Dióxido de Silício', 118.0, 'mg'),
          (13, 'Vitamina B6', 90.0, 'mg'),
          (14, 'Sucralose', 90.0, 'mg'),
          (15, 'Vitamina B3', 35.0, 'mg'),
          (16, 'Vitamina D3', 2000.0, 'ui'),
          (17, 'Vitamina B12', 9.9, 'mcg')
      ) as alvo(sort_order, ingredient_name, quantity, unit)
      where alvo.sort_order = fc.sort_order
        and alvo.ingredient_name = fc.ingredient_name
        and alvo.quantity = fc.quantity
        and alvo.unit = fc.unit::text
  );

-- 5b. Insere as 18 linhas do rotulo real, uma por vez, so se ainda nao existir ativa
insert into public.formula_compositions (formula_id, sort_order, ingredient_name, quantity, unit)
select f.id, v.sort_order, v.ingredient_name, v.quantity, v.unit::public.composition_unit
from public.formulas f
join (values
    (0, 'Creatina monohidratada', 5000.0, 'mg'),
    (1, 'Beta-alanina', 2000.0, 'mg'),
    (2, 'Ácido Cítrico', 1100.0, 'mg'),
    (3, 'Arginina', 1000.0, 'mg'),
    (4, 'Taurina', 1000.0, 'mg'),
    (5, 'Tirosina', 1000.0, 'mg'),
    (6, 'L-Carnitina', 1000.0, 'mg'),
    (7, 'Maltodextrina', 492.44, 'mg'),
    (8, 'Magnésio', 350.0, 'mg'),
    (9, 'Aromatizante de Limão', 350.0, 'mg'),
    (10, 'Guaraná em Pó', 350.0, 'mg'),
    (11, 'Cafeína', 150.0, 'mg'),
    (12, 'Dióxido de Silício', 118.0, 'mg'),
    (13, 'Vitamina B6', 90.0, 'mg'),
    (14, 'Sucralose', 90.0, 'mg'),
    (15, 'Vitamina B3', 35.0, 'mg'),
    (16, 'Vitamina D3', 2000.0, 'ui'),
    (17, 'Vitamina B12', 9.9, 'mcg')
) as v(sort_order, ingredient_name, quantity, unit) on true
where f.slug = 'pre-treino-creatina-sabor-limao-420g'
  and f.deleted_at is null
  and not exists (
      select 1 from public.formula_compositions fc2
      where fc2.formula_id = f.id
        and fc2.active
        and fc2.deleted_at is null
        and fc2.sort_order = v.sort_order
        and fc2.ingredient_name = v.ingredient_name
        and fc2.quantity = v.quantity
        and fc2.unit::text = v.unit
  );

-- 5c. Textos de ficha tecnica do rotulo real (idempotente - so seta os valores)
update public.formulas
set
    name = 'Pré-treino + Creatina Sabor Limão (420 g)',
    nutritional_info = 'INFORMACAO NUTRICIONAL
Porcoes por embalagem: 30
Porcao: 14 g
Quantidade por porcao | %VD*
Valor energetico 2 kcal = 8 kJ | 0%
Carboidratos totais 0,5 g | 0%
  Acucares totais 0 g |
    Acucares adicionados 0 g | 0%
Proteinas 0 g | 0%
Gorduras totais 0 g | 0%
  Gorduras saturadas 0 g | 0%
  Gorduras trans 0 g |
Fibra alimentar 0 g | 0%
Sodio 0 mg | 0%
Magnesio 350 mg | 83%
Vitamina B3 35 mg | 233%
Vitamina B6 90 mg | 6.923%
Vitamina B12 9,9 mcg | 413%
Vitamina D 2.000 UI | 333%
*% valores diarios de referencia com base em uma dieta de 2.000 kcal ou 8.400 kJ',
    ingredients_list = 'Creatina monohidratada, beta-alanina, acidulante acido citrico (INS 330), L-arginina, taurina, L-tirosina, L-carnitina, maltodextrina, magnesio (fonte a definir), aromatizante identico ao natural de limao, guarana (Paullinia cupana), cafeina anidra, antiumectante dioxido de silicio (INS 551), cloridrato de piridoxina, edulcorante sucralose (INS 955), nicotinamida, colecalciferol e metilcobalamina. CONTEM EDULCORANTE.',
    usage_instructions = 'Diluir 1 porcao (14 g) em 300 mL de agua gelada, misturar bem e consumir imediatamente, de 20 a 30 minutos antes do treino, ou conforme orientacao de profissional de saude. Nao preparar com antecedencia nem guardar a bebida ja diluida.',
    warnings = 'Este produto nao e um medicamento. Publico indicado: Adultos (19 anos ou mais). Nao exceder a recomendacao diaria de consumo indicada na embalagem. Mantenha fora do alcance de criancas. CONTEM CAFEINA. Nao deve ser consumido por lactantes, criancas e pessoas sensiveis a cafeina. Pode causar sensacao temporaria de formigamento na pele, decorrente da beta-alanina, efeito transitorio e sem risco a saude. Pessoas com problemas cardiacos, hipertensao, insonia ou em uso de medicamentos devem consultar um profissional de saude antes do consumo. Conservar o produto em local seco, fresco e ao abrigo da luz e do calor excessivo, em temperatura ambiente entre 15 C e 30 C. Apos aberto, manter o pote bem fechado e consumir em ate 60 dias. Nao consumir se o lacre de seguranca estiver violado.',
    pote_contents_description = '30 porcoes de 14 g',
    net_weight = '420 g'
where slug = 'pre-treino-creatina-sabor-limao-420g'
  and deleted_at is null
  and (
    name is distinct from 'Pré-treino + Creatina Sabor Limão (420 g)'
    or ingredients_list is distinct from 'Creatina monohidratada, beta-alanina, acidulante acido citrico (INS 330), L-arginina, taurina, L-tirosina, L-carnitina, maltodextrina, magnesio (fonte a definir), aromatizante identico ao natural de limao, guarana (Paullinia cupana), cafeina anidra, antiumectante dioxido de silicio (INS 551), cloridrato de piridoxina, edulcorante sucralose (INS 955), nicotinamida, colecalciferol e metilcobalamina. CONTEM EDULCORANTE.'
    or usage_instructions is distinct from 'Diluir 1 porcao (14 g) em 300 mL de agua gelada, misturar bem e consumir imediatamente, de 20 a 30 minutos antes do treino, ou conforme orientacao de profissional de saude. Nao preparar com antecedencia nem guardar a bebida ja diluida.'
    or pote_contents_description is distinct from '30 porcoes de 14 g'
    or net_weight is distinct from '420 g'
  );

-- Guarda 5 - exatamente 18 linhas ativas, creatina em 5000 mg, vitamina D3 em UI
do $$
declare
    v_linhas    integer;
    v_creatina  integer;
    v_d3_ui     integer;
begin
    select count(*),
           count(*) filter (where ingredient_name = 'Creatina monohidratada' and quantity = 5000 and unit = 'mg'),
           count(*) filter (where ingredient_name = 'Vitamina D3' and quantity = 2000 and unit = 'ui')
    into v_linhas, v_creatina, v_d3_ui
    from public.formula_compositions fc
    join public.formulas f on f.id = fc.formula_id
    where f.slug = 'pre-treino-creatina-sabor-limao-420g'
      and f.deleted_at is null
      and fc.active
      and fc.deleted_at is null;

    if v_linhas <> 18 then
        raise exception 'secao 5: pre-treino 420g deveria ter exatamente 18 linhas ativas de composicao (rotulo real), encontradas %', v_linhas;
    end if;

    if v_creatina <> 1 then
        raise exception 'secao 5: pre-treino 420g deveria ter 1 linha de creatina monohidratada em 5000 mg, encontradas %', v_creatina;
    end if;

    if v_d3_ui <> 1 then
        raise exception 'secao 5: pre-treino 420g deveria ter 1 linha de vitamina D3 em 2000 ui, encontradas %', v_d3_ui;
    end if;
end $$;


-- #######################################################################################
-- 6. REVOGACAO DE 8 SELOS INDEVIDOS (auditoria de 15/09/2026, nunca formalizada em migration)
-- #######################################################################################
-- A auditoria de 15/09/2026 (docs/conformidade/AUDITORIA-ROTULO-VS-ANVISA-2026-09-15.md)
-- ja tinha reprovado estas 8 formulas, mas compliance_verified_at continuava preenchido:
-- a migration que revogaria isso (20260921000000_selos_conforme_rotulo.sql) dependia da
-- composicao-do-rotulo da 20260920000000, que nunca foi aplicada (o caminho real acabou
-- sendo a reformulacao regulatoria, 20260922000000) - ficou isolada em
-- supabase/migrations-pendentes/, depois movida para supabase/migrations-obsoletas/
-- (ver LEIA-ME.md de cada pasta). Esta secao revoga os mesmos 8 selos, mas sem depender
-- daquela composicao-do-rotulo hoje obsoleta - so confere que cada um tinha
-- compliance_verified_at preenchido e zera os tres campos.
-- Idempotente por natureza: setar NULL de novo nao muda nada.

update public.formulas
set
    compliance_verified_at = null,
    compliance_norms       = null,
    compliance_source      = null
where slug in (
    'biotina-em-capsula',
    'dores-musculares',
    'focus-colina',
    'multivitaminico',
    'serena',
    'zma-zinco-magnesio-e-vitamina-d',
    'creatina-em-gummy-sabor-tutti-frutti',
    'creatina-monohidratada-300g-soluvel'
)
  and (
    compliance_verified_at is not null
    or compliance_norms is not null
    or compliance_source is not null
  );

-- Guarda 6 - os 8 slugs existem e estao todos com selo nulo ao final
do $$
declare
    v_total    integer;
    v_nulos    integer;
begin
    select count(*), count(*) filter (
        where compliance_verified_at is null
          and compliance_norms is null
          and compliance_source is null
    )
    into v_total, v_nulos
    from public.formulas
    where slug in (
        'biotina-em-capsula',
        'dores-musculares',
        'focus-colina',
        'multivitaminico',
        'serena',
        'zma-zinco-magnesio-e-vitamina-d',
        'creatina-em-gummy-sabor-tutti-frutti',
        'creatina-monohidratada-300g-soluvel'
    )
      and deleted_at is null;

    if v_total <> 8 then
        raise exception 'secao 6: esperava encontrar as 8 formulas da auditoria de 15/09/2026, encontrei %', v_total;
    end if;

    if v_nulos <> 8 then
        raise exception 'secao 6: esperava as 8 formulas com compliance_verified_at/compliance_norms/compliance_source todos nulos ao final, encontrei % completas', v_nulos;
    end if;
end $$;

-- =====================================================================================
-- FIM. Seis secoes, seis guardas - qualquer uma que falhar aborta a transacao inteira
-- (nenhum COMMIT parcial). Rodar este arquivo contra o banco de producao atual
-- (zjryrmqtumvaxdytvbbv) deve ser um NO-OP em todas as seis secoes, porque o banco ja
-- foi corrigido direto via Management API em 17-18/09/2026 - e exatamente isso que este
-- arquivo documenta.
-- =====================================================================================
