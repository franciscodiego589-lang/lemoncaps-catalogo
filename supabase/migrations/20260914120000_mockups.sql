-- =====================================================================================
-- LEMON CAPS - CATALOGO PUBLICO
-- 20260914120000_mockups.sql - foto real do pote (mockup) por formula.
--
-- Contexto: o dono forneceu os mockups reais dos potes numa pasta publica do Google
-- Drive (https://drive.google.com/drive/folders/1rtaBvmqGxE-TB1yQXfhi24_qvxB8ZEFT), 16
-- arquivos PNG. Todos foram baixados, identificados e otimizados para WebP (maximo 900px
-- no lado maior, abaixo de ~150 KB cada) em public/produtos/ deste repositorio.
--
-- PAREAMENTO - regra seguida: so grava mockup_path quando o nome do produto no rotulo do
-- pote bate com o nome real no banco, OU quando o conteudo (ingrediente/sabor/peso
-- impresso no rotulo) confirma sem duvida razoavel qual fórmula é aquela. Na duvida, a
-- coluna fica NULL - errar o pote de um produto num catalogo tecnico é pior que nao ter
-- foto (ordem do dono). Cada arquivo de origem e a evidencia que sustentou o pareamento
-- estao documentados a seguir; a lista completa com nome de arquivo original, motivo e
-- print do rotulo lido fica no relatorio da tarefa.
--
-- Dos 16 mockups baixados, 13 foram pareados com certeza razoavel (13 das 28 formulas
-- ativas ganham mockup_path). 3 mockups baixados NAO foram usados, por ambiguidade real:
--   - "Zma complex.png": existem DUAS formulas ZMA ativas ("ZMA (Zinco, Magnesio e
--     Vitamina B6)", premium, e "ZMA Night", basica) e o rotulo do pote nao traz nenhuma
--     palavra que distinga uma da outra (nao aparece "Night" nem "sono").
--   - "Slym up.png": existem DUAS versoes de "Slim Up" ativas (premium "Emagrecedor em
--     Gota" e basica "EMAGRECIMENTO EM GOTA"), ambas em gotas de 30 ml (tamanho padrao
--     do formato, nao é discriminador). O rotulo nao indica linha nem traz lista de
--     ingredientes legivel que permita distinguir uma da outra.
--   - "lidema.png": nome do produto no rotulo ("Lidema") nao corresponde a nenhuma das
--     28 formulas ativas, e o texto do rotulo é generico (sem ingrediente, publico-alvo
--     ou sabor citado) - nao ha evidencia de conteudo que ligue este mockup a nenhuma
--     formula real. Pode ser um produto descontinuado ou nunca lancado.
--
-- 12 das 28 formulas ativas nao tem NENHUM mockup candidato entre os 16 baixados
-- (CREATINA MONOHIDRATADA 300g SOLUVEL, CREATINA EM GUMMY SABOR TUTTI-FRUTTI, Pre treino
-- + Creatina Sabor Limao 300g, PRE TREINO 300 G, Multi Vitta - Gestante e Lactante em
-- Capsula, Omega Pro TG, Biotina em Capsula, Melatonina + Triptofanos Encapsulados,
-- Emagrecedor Em Capsula, SHOT + COLAGENO 300 GRAMAS, Detox Shot Matinal 150g) mais as
-- duas formulas ZMA e as duas formulas Slim Up citadas acima (ambiguidade, nao falta de
-- candidato). Todas ficam com mockup_path NULL e mantem o visual atual (faixa colorida
-- por segmento) - sem buraco na tela.
--
-- IDs conferidos ao vivo no banco de producao via Management API (select id, slug, name
-- from public.formulas where deleted_at is null), nao supostos.
--
-- ORDEM DE EXECUCAO: depois de schema.sql, rls-policies.sql e conformidade.sql (so
-- acrescenta coluna em tabela ja existente - os triggers trg_formulas_touch/
-- trg_formulas_audit ja existem e ja disparam nos UPDATE abaixo).
-- =====================================================================================


-- ---------------------------------------------------------------------------------
-- 1. COLUNA NOVA EM public.formulas
-- ---------------------------------------------------------------------------------

alter table public.formulas
    add column if not exists mockup_path text;

comment on column public.formulas.mockup_path is 'Caminho publico (em public/, ex.: /produtos/moro-slim.webp) do mockup real do pote desta formula, gerado a partir dos PNGs fornecidos pelo dono via Google Drive e otimizados para WebP. NULL = sem mockup pareado com certeza razoavel (a tela usa a faixa colorida do segmento como hoje, nunca um buraco). Nunca preenchido por suposicao - so quando nome ou conteudo do rotulo confirmam a formula, ver nota completa no cabecalho desta migration.';


-- ---------------------------------------------------------------------------------
-- 2. GRAVA mockup_path NAS 13 FORMULAS PAREADAS COM CERTEZA RAZOAVEL
-- ---------------------------------------------------------------------------------

update public.formulas as f
set mockup_path = v.caminho
from (values
    -- BIOPRINCESS: nome e descricao do rotulo ("BioPrincess", "CABELO - PELE - UNHA")
    -- identicos ao nome e a descricao da formula no banco.
    ('0adc783d-202d-4f6c-8501-3b77f8b47761'::uuid, '/produtos/bioprincess.webp'),

    -- Saude Intestinal: arquivo "Floravex.png" - nome do rotulo nao bate, mas o texto do
    -- rotulo cita "L-glutamina, curcuma, quercetina... magnesio", exatamente os mesmos
    -- insumos e na mesma ordem do ingredients_list desta formula.
    ('9093900b-c709-4d85-9efd-fc04bf0f11ef'::uuid, '/produtos/saude-intestinal.webp'),

    -- DORES MUSCULARES: arquivo "ArtFlex.png" - nome do rotulo nao bate, mas o texto do
    -- rotulo cita "...desnaturado, colageno tipo...", e "colageno tipo II nao
    -- desnaturado" e um termo que aparece no ingredients_list de UNICA formula entre as
    -- 28 ativas: esta. "Art" (articulacao) + "Flex" tambem batem com o segmento "Dores
    -- articulares" e com o technical_sheet_title "DORES ARTICULARES 60 CAPSULAS".
    ('a93b61c5-babe-476e-b272-1b576324d8b9'::uuid, '/produtos/dores-musculares.webp'),

    -- BELLA GUMMY (Biotina em Gummy): arquivo "bio gummy.png" com rotulo "Biogummy",
    -- "PELE - CABELO - UNHA" e "SABOR FRUTAS VERMELHAS" - mesmo publico (cabelo/pele/
    -- unha, technical_sheet_title "GUMMY CABELO PELE E UNHA") e mesmo aroma (aroma
    -- frutas vermelhas no ingredients_list) desta formula, unica gummy de beleza ativa.
    ('49c6fc44-ccdc-4c56-9e9b-81be4f509403'::uuid, '/produtos/bella-gummy-biotina-em-gummy.webp'),

    -- CREATINA GUMMY SABOR FRUTAS VERMELHAS: rotulo do pote traz "SABOR FRUTAS
    -- VERMELHAS" por extenso, batendo exatamente com o nome desta formula (nao a
    -- versao tutti-frutti, que nao tem mockup nesta pasta).
    ('bffe9877-1bf6-4733-b627-a75de04e63c9'::uuid, '/produtos/creatina-gummy-sabor-frutas-vermelhas.webp'),

    -- CREATINA MONOHIDRATADA 150g SOLUVEL: rotulo do pote ("mockup creatina.png") traz
    -- "150G" e "SEM SABOR" por extenso - bate com esta formula, nao com a de 300g.
    ('cf7a74c7-9585-4c29-9c82-c9f7b81831a5'::uuid, '/produtos/creatina-monohidratada-150g-soluvel.webp'),

    -- Detox Matinal (Lemon Shot) - 300g: rotulo ("detox.png") traz "300G" e "SABOR
    -- LIMAO" por extenso - bate com esta formula (aroma limao no ingredients_list),
    -- nao com a versao de 150g (sem sabor registrado no banco).
    ('82cfc046-a2ff-440d-9e42-7cd1f6cd8f0d'::uuid, '/produtos/detox-matinal-lemon-shot-300g.webp'),

    -- Melatonina em Gumy Sabor Uva: rotulo ("dream gummy.png") traz "MELATONINA +
    -- TRIPTOFANO" e "SABOR UVA" - unica formula gummy de sono ativa, sabor uva exato.
    ('f32a62b6-4089-4995-b241-4607114860d3'::uuid, '/produtos/melatonina-em-gumy-sabor-uva.webp'),

    -- FOCUS COLINA: nome do rotulo identico ao nome da formula.
    ('5e159209-e227-4ee8-911b-3262f8beffc9'::uuid, '/produtos/focus-colina.webp'),

    -- MORO SLIM: rotulo "Moro Slim Complex" - nome bate (Complex e so subtitulo de
    -- marca no pote, nao muda a formula).
    ('d7658180-9d93-4c48-9c37-f7ec9ea3055a'::uuid, '/produtos/moro-slim.webp'),

    -- Multivitaminico: rotulo cita "L-teanina" no texto de descricao - ingrediente
    -- presente no ingredients_list desta formula e AUSENTE do ingredients_list de
    -- "Multi Vitta - Gestante e Lactante" (a outra formula multivitaminica ativa),
    -- o que resolve a ambiguidade entre as duas.
    ('32e66012-fb3d-4d99-b425-a2b850b755a8'::uuid, '/produtos/multivitaminico.webp'),

    -- Pro Energy: rotulo "PRO ENERGY" com simbolo (masculino) + texto citando cafeina
    -- e feno-grego - bate com o technical_sheet_title "ESTIMULANTE SEXUAL" e o
    -- ingredients_list desta formula (unica do segmento Libido).
    ('2b485606-8cdf-4f4d-bd3c-930740e11463'::uuid, '/produtos/pro-energy.webp'),

    -- Serena: nome do rotulo identico ao nome da formula, mesmo formato (liquido/gotas,
    -- frasco de 30 ml).
    ('07e1ee0c-c314-4c33-a440-0aa47bd4fdb1'::uuid, '/produtos/serena.webp')
) as v(id, caminho)
where f.id = v.id
  and f.deleted_at is null;

-- Conferencia de guarda: se este numero nao for 13, algo mudou na tabela (formula
-- apagada/reativada) e a migration para em vez de seguir com contagem errada em
-- silencio - regra de exatidao, nunca falhar calado (mesmo padrao de
-- 20260914000000_conformidade.sql).
do $$
declare
    v_count integer;
begin
    select count(*) into v_count
    from public.formulas
    where mockup_path is not null;

    if v_count <> 13 then
        raise exception 'esperado exatamente 13 formulas com mockup_path preenchido, encontrado %', v_count;
    end if;
end $$;
