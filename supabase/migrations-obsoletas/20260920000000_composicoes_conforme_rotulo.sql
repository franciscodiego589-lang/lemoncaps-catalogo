-- =====================================================================================
-- LEMON CAPS - CATALOGO PUBLICO
-- 20260920000000_composicoes_conforme_rotulo.sql
--
-- Substitui a composicao cadastrada (public.formula_compositions) pela composicao
-- IMPRESSA NO ROTULO, formula por formula, casando por SLUG - nunca por UUID, porque
-- os UUIDs do projeto Supabase novo (zjryrmqtumvaxdytvbbv) nao sao os do projeto
-- antigo (yyiykuffhuxaqiysgekv) de onde vieram as migrations anteriores.
--
-- POR QUE ESTA MIGRATION EXISTE
-- Em 13/09/2026 ficou provado, cruzando o banco com 15 artes-finais de rotulo (PDF em
-- curvas, lidas visualmente entre 462 e 1237 DPI), que o cadastro de composicoes foi
-- preenchido na origem (plataforma Lovable) com os TETOS MAXIMOS da ANVISA no lugar
-- da formulacao real - vitamina B6 98,60 mg, zinco 29,59 mg, magnesio 350 mg, cromo
-- 250 mcg, vitamina A 1.500 mcg, vitamina D 50 mcg repetidos onde o rotulo traz
-- outra coisa. Levantamento em docs/conformidade/divergencias.md; extracao dos
-- rotulos em docs/conformidade/composicoes_rotulo.json (data_extracao 2026-09-13).
-- Os PDFs nao estao mais nesta maquina: o JSON e a fonte. Diff atualizado contra o
-- banco novo ao vivo em docs/conformidade/COMPOSICOES-ROTULO-VS-CADASTRO-2026-09-15.md.
--
-- REGRA QUE GOVERNA ESTE ARQUIVO: NENHUM VALOR INFERIDO.
-- Toda quantidade, unidade, marcacao de sal (e_sal), elemento equivalente, %VD e
-- observacao abaixo foi copiada do JSON dos rotulos. O que o rotulo nao declara fica
-- NULL no metadata (ex.: elemento do boro no ZMA). A UNICA coisa acrescentada e a
-- acentuacao dos nomes de insumo: o JSON foi gravado sem acento nenhum (ate o _meta
-- diz "Renderizacao", "Composicao"), e o nome entra aqui com a ortografia normal do
-- portugues ("Dioxido de silicio" recebe os acentos de dioxido e silicio). Isso e
-- ortografia, nao dado - mas como o PDF nao esta mais disponivel para conferir a
-- grafia impressa, o texto original do JSON fica guardado, sem alteracao, em
-- metadata.insumo_json de cada linha. Se o dono preferir o texto do JSON, basta
-- trocar ingredient_name pelo proprio metadata->>'insumo_json'.
--
-- CONVENCAO SAL x ELEMENTO (a mesma do JSON e a mesma que o catalogo ja segue):
-- a coluna quantity recebe o numero que o rotulo imprime na linha "Composicao por
-- porcao". Quando esse numero e massa do SAL (ex.: "bisglicinato de zinco 20 mg"),
-- metadata.e_sal = true e metadata.elemento_equivalente_mg traz o elemento declarado
-- na tabela nutricional do mesmo rotulo (ex.: 4). Quando o rotulo declara o ELEMENTO
-- (ex.: "Magnesio (de bisglicinato de magnesio) 260 mg"), e_sal = false. A decisao
-- do dono registrada em 20260915140000_conformidade_laudos.sql ("a quantidade exibida
-- continua sendo a massa do sal") continua valendo: nada aqui converte sal em elemento.
--
-- FORMULAS AFETADAS - 12 (92 linhas novas), pelo slug real do banco novo:
--   bella-gummy-biotina-em-gummy                5 linha(s)  BioGummy.pdf           BELLA GUMMY (Biotina em Gummy) - ja batia em quantidade (5 de 5)
--   creatina-monohidratada-150g-soluvel         1 linha(s)  CreatinaPo.pdf         CREATINA MONOIDRATADA 150 g SOLUVEL - ja batia (1 de 1)
--   creatina-gummy-sabor-frutas-vermelhas       1 linha(s)  creatina gummy.pdf     CREATINA GUMMY SABOR FRUTAS VERMELHAS - ja batia (1 de 1)
--   melatonina-em-gummy-sabor-uva               2 linha(s)  DreamGummy.pdf         Melatonina em Gummy Sabor Uva - ja batia (2 de 2)
--   serena                                      5 linha(s)  Serena.pdf             Serena - ja batia (5 de 5)
--   detox-matinal-lemon-shot-300g              11 linha(s)  Detox.pdf              Detox Matinal (Lemon Shot) - 300g - 5 linhas viram 11; zinco 8,3 mg vira 1,45 mg de sal
--   saude-intestinal                           11 linha(s)  Floravex-intestino.pdf Saude Intestinal - 7 linhas viram 11; B6 98,6 mg vira 1,26 mg
--   focus-colina                                9 linha(s)  FocusColina.pdf        FOCUS COLINA - 9 linhas, 5 quantidades mudam; B12 vira cianocobalamina 2,4 mcg
--   moro-slim                                  11 linha(s)  MoroSlim.pdf           MORO SLIM - 6 linhas viram 11; feno-grego em po sai, extrato seco entra
--   multivitaminico                            20 linha(s)  multivitaminico.pdf    Multivitaminico - 19 linhas viram 20; vitamina C 533,685 mg vira 100 mg; cromo 250 mcg vira 35 mcg
--   pro-energy                                  9 linha(s)  ProEnergy.pdf          Pro Energy - 8 linhas viram 9; cafeina anidra 150 mg; aspartato de L-arginina
--   zma-zinco-magnesio-e-vitamina-d             7 linha(s)  ZmaComplex.pdf         ZMA (Zinco, Magnesio e Vitamina B6) - 6 linhas viram 7; magnesio glicinato 500 mg; zinco 75 mg; vitamina D 25 mcg
--
-- Cinco dessas 12 ja batiam em quantidade com o rotulo (BELLA GUMMY, as duas creatinas
-- com rotulo, Melatonina em Gummy e Serena). Entram mesmo assim, por dois motivos:
-- (1) o nome do insumo passa a ser o texto do rotulo (ex.: "Vitamina E
-- (DL-alfa-tocoferol)" no lugar de "vitamina E (acetato de DL-alfa-tocoferol)", que e
-- outra forma quimica); (2) toda linha ganha procedencia em metadata (fonte, arquivo,
-- e_sal). Cada formula e um bloco separado no VALUES abaixo: para deixar alguma de fora,
-- apagar o bloco dela E o slug dela nas duas listas de guarda (secoes 0 e 5).
--
-- PENDENTES - FICAM FORA DESTA MIGRATION, DE PROPOSITO:
--   biotina-em-capsula (BioPrincess.pdf): o JSON marca item nao_legivel (o fim da lista
--     de ingredientes esta coberto pela caixa da tabela nutricional na propria arte).
--     Alem disso o cadastro ja bate com o rotulo em 20 de 20 linhas presentes; a unica
--     diferenca e o "colageno hidrolisado 120 mg", que o rotulo traz e que foi REMOVIDO
--     do cadastro em 14/09/2026 por estar abaixo do minimo da ANVISA (8,4 g por dia, valor
--     da auditoria de 14/09, nao relido no painel nesta sessao). Regravar
--     o rotulo aqui desfaria essa decisao sem ordem do dono.
--   dores-musculares (Nuviart.pdf): o proprio rotulo se contradiz - a composicao declara
--     "bisglicinato de zinco 10 mg" e "bisglicinato de ferro 8 mg" (sal) e a tabela
--     nutricional declara "Zinco 10 mg" e "Ferro 8 mg" (elemento). O mesmo numero nao
--     pode ser sal e elemento. Carbonato de calcio 100 mg e bisglicinato de magnesio
--     100 mg sao sal sem elemento declarado em lugar nenhum. Depende de ficha tecnica.
--   lidema (Lidema.pdf): rotulo sem formula no catalogo (produto descartado).
--   pre-treino-creatina-sabor-limao-420g ("Cesio 137"): tem rotulo real da grafica
--     (~/Downloads/PRE TREINO_CESIO 137_420g.pdf, lido em 15/09/2026) e o cadastro ja
--     e igual a ele nos 13 itens - nao ha o que trocar. Fica fora porque a fonte e
--     outro PDF (nao o JSON que esta migration declara como origem) e porque a ficha
--     tecnica de producao da fabrica (Rev.02, 20/08/2026) diverge do rotulo em tres
--     insumos; qual formula esta em producao e PENDENTE da fabrica. Ver
--     docs/conformidade/PARECER-PRE-TREINO-CESIO-137-2026-09-15.md.
--   As 9 formulas ativas sem arte de rotulo (creatina 300 g, creatina gummy
--     tutti-frutti, Emagrecedor, Melatonina + Triptofanos, Multi Vitta, Omega Pro TG,
--     Pre Treino 300 g, Shot + Colageno, Slim Up): nada a gravar sem fonte.
--
-- O QUE ESTA MIGRATION FAZ, NESTA ORDEM:
--   0. Guarda: aborta se nao encontrar exatamente 12 formulas ATIVAS com esses slugs.
--   1. Backup: copia as linhas ativas atuais dessas 12 formulas para
--      private.formula_compositions_backup_20260920 (schema private, fora da API).
--   2. Insumos novos em public.ingredients (5): so os que o rotulo traz e o cadastro
--      nao tem, com nome exatamente como no rotulo. on conflict (slug) do nothing.
--   3. Exclusao LOGICA das linhas antigas (active = false, deleted_at, reason_deleted).
--   4. Insercao das linhas do rotulo, com ingredient_id resolvido por slug em
--      public.ingredients e metadata de procedencia.
--   5. Autocheck: por formula, contagem exata de linhas ativas, todas com
--      metadata.fonte = 'rotulo' e ingredient_id preenchido; total 92.
--
-- O QUE NAO FAZ: nao toca em public.formulas (compliance_verified_at, compliance_norms,
-- technical_sheet_version, nutritional_info, ingredients_list ficam como estao), nao
-- apaga nada fisicamente, nao converte sal em elemento, nao mexe nas 12 formulas fora
-- da lista (as 2 pendentes com rotulo, o Cesio 137 e as 9 sem rotulo) e nao desativa
-- insumo nenhum em public.ingredients - mesmo os tres que
-- ficam sem composicao ativa depois da troca (feno-grego-em-po, cafeina e
-- cloridrato-de-l-arginina, hoje usados so por Moro Slim e Pro Energy); o que fazer
-- com eles e decisao do dono, como ja e o caso dos cinco insumos que hoje nao tem
-- composicao ativa nenhuma (cloridrato-de-l-cisteina, espirulina, hialuronato-de-sodio,
-- psyllium, siliciumax - espirulina e psyllium voltam a ter uso com esta migration). ATENCAO: 4 das 12 formulas aqui tem selo "Composicao conferida" calculado
-- sobre o cadastro antigo (FOCUS COLINA, Multivitaminico, ZMA e - fora desta migration
-- mas no mesmo caso - DORES MUSCULARES). Gravar o rotulo nao remove o selo, mas deixa
-- o selo sem lastro ate a auditoria ser refeita sobre os numeros novos. Ver secao
-- "Selos de conformidade" do documento de diff.
--
-- IDEMPOTENTE: rodar de novo nao duplica nada. A guarda continua passando (as 12
-- formulas continuam ativas), o backup pula linhas ja copiadas, a exclusao logica so
-- pega linhas sem metadata.fonte = 'rotulo', e a insercao so acontece em formula que
-- ainda nao tem linha ativa com metadata.fonte = 'rotulo'.
--
-- REVERSAO (manual, pelo dono do banco):
--   update public.formula_compositions set active = false, deleted_at = now(),
--          reason_deleted = 'reversao da 20260920' where metadata->>'fonte' = 'rotulo';
--   update public.formula_compositions fc set active = true, deleted_at = null,
--          reason_deleted = null from private.formula_compositions_backup_20260920 b
--          where b.id = fc.id;
--   (o trigger private.tg_touch_row limpa deleted_by/reason_deleted na restauracao.)
--
-- APLICACAO: este arquivo so foi criado em disco. NAO foi aplicado em nenhum banco. A
-- sintaxe foi conferida com o parser do PostgreSQL (libpg_query, via pglast), sem
-- execucao - nao havia Postgres local nem Docker em execucao nesta maquina em
-- 15/09/2026. Quem aplica e o dono, depois de revisar as decisoes listadas no
-- documento de diff.
-- =====================================================================================


-- -------------------------------------------------------------------------------------
-- 0. GUARDA - as 12 formulas precisam existir, ativas, pelo slug
-- -------------------------------------------------------------------------------------
-- Slugs lidos ao vivo no banco novo em 15/09/2026 (nao supostos). Se a contagem nao
-- bater, a transacao inteira aborta antes de qualquer escrita.

do $$
declare
    v_encontradas integer;
begin
    select count(*) into v_encontradas
    from public.formulas
    where deleted_at is null
      and active
      and slug in (
          'bella-gummy-biotina-em-gummy',
          'creatina-monohidratada-150g-soluvel',
          'creatina-gummy-sabor-frutas-vermelhas',
          'melatonina-em-gummy-sabor-uva',
          'serena',
          'detox-matinal-lemon-shot-300g',
          'saude-intestinal',
          'focus-colina',
          'moro-slim',
          'multivitaminico',
          'pro-energy',
          'zma-zinco-magnesio-e-vitamina-d'
      );

    if v_encontradas <> 12 then
        raise exception 'esperado 12 formulas ativas com os slugs desta migration, encontrado %', v_encontradas;
    end if;
end $$;


-- -------------------------------------------------------------------------------------
-- 1. BACKUP - copia fiel das linhas ativas atuais, no schema private (fora da API)
-- -------------------------------------------------------------------------------------
-- Mesmas colunas e tipos de public.formula_compositions (create table ... as select
-- ... where false cria a estrutura vazia), mais backed_up_at. Sem constraints nem
-- triggers, de proposito: e uma copia para reversao, nao uma tabela de negocio.

create table if not exists private.formula_compositions_backup_20260920 as
select fc.*, now() as backed_up_at
from public.formula_compositions fc
where false;

comment on table private.formula_compositions_backup_20260920 is 'Copia das linhas ativas de public.formula_compositions das 12 formulas trocadas pela migration 20260920000000_composicoes_conforme_rotulo.sql, gravada imediatamente antes da troca. Serve para reverter (ver cabecalho da migration). Nao exposta pela API (schema private).';

insert into private.formula_compositions_backup_20260920
select fc.*, now()
from public.formula_compositions fc
join public.formulas f on f.id = fc.formula_id
where f.deleted_at is null
  and f.slug in (
      'bella-gummy-biotina-em-gummy',
      'creatina-monohidratada-150g-soluvel',
      'creatina-gummy-sabor-frutas-vermelhas',
      'melatonina-em-gummy-sabor-uva',
      'serena',
      'detox-matinal-lemon-shot-300g',
      'saude-intestinal',
      'focus-colina',
      'moro-slim',
      'multivitaminico',
      'pro-energy',
      'zma-zinco-magnesio-e-vitamina-d'
  )
  and fc.deleted_at is null
  and coalesce(fc.metadata->>'fonte', '') <> 'rotulo'
  and not exists (
      select 1 from private.formula_compositions_backup_20260920 b where b.id = fc.id
  );


-- -------------------------------------------------------------------------------------
-- 2. INSUMOS NOVOS - so os que o rotulo traz e public.ingredients nao tem
-- -------------------------------------------------------------------------------------
-- Conferido ao vivo contra os 70 insumos ativos do banco novo em 15/09/2026. Nome
-- exatamente como no rotulo que o traz; quando dois rotulos grafam o mesmo insumo de
-- forma diferente (inulina: Floravex e Moro Slim), o nome e o do primeiro rotulo do
-- JSON e as duas grafias ficam em synonyms. Categoria pela mesma regra de nome da
-- migration 20260913220056_ingredientes.sql (na duvida, 'outro'). sort_order continua
-- a sequencia existente (ultimo era 700). Idempotente: on conflict (slug) do nothing.
--
-- Por que "extrato seco de semente de feno-grego" e insumo NOVO e nao o
-- "feno-grego-em-po" que ja existe: po de semente e extrato seco nao sao o mesmo
-- insumo nem tem a mesma concentracao (docs/conformidade/divergencias.md, item 3.4), e
-- a IN 28/2018 so autoriza o EXTRATO de semente (docs/conformidade/LIMITES-ANVISA-POR-
-- INSUMO.md). O "extrato-fluido-de-semente-de-feno-grego" do Slim Up tambem e outra
-- coisa (fluido x seco). Por que "L-Aspartato de L-arginina" e novo e nao vira
-- "l-arginina": segue o precedente do proprio cadastro, que mantem
-- "cloridrato-de-l-arginina" separado de "l-arginina" (sal diferente, ficha diferente).

insert into public.ingredients (slug, name, synonyms, category, sort_order, metadata) values
    ('inulina-de-cichorium-intybus', 'Inulina de Cichorium intybus', ARRAY['Inulina de Cichorium intybus','Inulina de raiz de chicória (Cichorium intybus L.)']::text[], 'outro'::public.ingredient_category, 710, '{"fonte": "rotulo", "criado_por": "20260920000000_composicoes_conforme_rotulo.sql"}'::jsonb),
    ('frutooligossacarideos', 'Frutooligossacarídeos (FOS)', ARRAY['Frutooligossacarídeos (FOS)']::text[], 'outro'::public.ingredient_category, 720, '{"fonte": "rotulo", "criado_por": "20260920000000_composicoes_conforme_rotulo.sql"}'::jsonb),
    ('extrato-seco-de-semente-de-feno-grego', 'Extrato seco de semente de feno-grego (Trigonella foenum-graecum L.)', ARRAY['Extrato seco de semente de feno-grego (Trigonella foenum-graecum L.)']::text[], 'extrato_vegetal'::public.ingredient_category, 730, '{"fonte": "rotulo", "criado_por": "20260920000000_composicoes_conforme_rotulo.sql"}'::jsonb),
    ('quitosana', 'Quitosana', ARRAY['Quitosana']::text[], 'outro'::public.ingredient_category, 740, '{"fonte": "rotulo", "criado_por": "20260920000000_composicoes_conforme_rotulo.sql"}'::jsonb),
    ('l-aspartato-de-l-arginina', 'L-Aspartato de L-arginina', ARRAY['L-Aspartato de L-arginina']::text[], 'aminoacido'::public.ingredient_category, 750, '{"fonte": "rotulo", "criado_por": "20260920000000_composicoes_conforme_rotulo.sql"}'::jsonb)
on conflict (slug) do nothing;


-- -------------------------------------------------------------------------------------
-- 3. EXCLUSAO LOGICA DAS LINHAS ANTIGAS DAS 12 FORMULAS
-- -------------------------------------------------------------------------------------
-- active = false junto com deleted_at, pelo mesmo motivo registrado em
-- 20260918000000_linha_unica_e_duplicatas.sql (formulas tem trava contra "excluida mas
-- ativa"; formula_compositions nao tem hoje, mas o estado fica coerente e a policy de
-- leitura publica ja filtra deleted_at). O trigger private.tg_touch_row preenche
-- deleted_by/updated_at; private.tg_write_audit grava SOFT_DELETE em audit_logs.

update public.formula_compositions fc
set
    active         = false,
    deleted_at     = now(),
    reason_deleted = 'substituída pela composição do rótulo em 2026-09-20'
from public.formulas f
where f.id = fc.formula_id
  and f.deleted_at is null
  and f.slug in (
      'bella-gummy-biotina-em-gummy',
      'creatina-monohidratada-150g-soluvel',
      'creatina-gummy-sabor-frutas-vermelhas',
      'melatonina-em-gummy-sabor-uva',
      'serena',
      'detox-matinal-lemon-shot-300g',
      'saude-intestinal',
      'focus-colina',
      'moro-slim',
      'multivitaminico',
      'pro-energy',
      'zma-zinco-magnesio-e-vitamina-d'
  )
  and fc.deleted_at is null
  and coalesce(fc.metadata->>'fonte', '') <> 'rotulo';


-- -------------------------------------------------------------------------------------
-- 4. INSERCAO DAS LINHAS DO ROTULO
-- -------------------------------------------------------------------------------------
-- Uma linha por item de "Composicao por porcao" do rotulo, na ordem impressa
-- (sort_order). ingredient_id resolvido por slug em public.ingredients (inner join: se
-- algum slug faltar, a linha nao entra e o autocheck da secao 5 aborta a transacao).
-- Colunas de controle (created_at, created_by, version, active) ficam com o default e
-- os triggers. Unidade e cast para o enum public.composition_unit (g, mg, mcg).

insert into public.formula_compositions (formula_id, ingredient_name, quantity, unit, sort_order, ingredient_id, metadata)
select f.id, v.ingredient_name, v.quantity, v.unit::public.composition_unit, v.sort_order, i.id, v.metadata::jsonb
from (values

    -- bella-gummy-biotina-em-gummy (5 linha(s), BioGummy.pdf)
    ('bella-gummy-biotina-em-gummy', 0, 'Vitamina C (ácido ascórbico)', 45, 'mg', 'vitamina-c', '{"fonte": "rotulo", "arquivo": "BioGummy.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": 45, "insumo_json": "Vitamina C (acido ascorbico)"}'),
    ('bella-gummy-biotina-em-gummy', 1, 'Vitamina E (DL-alfa-tocoferol)', 16.7, 'mg', 'vitamina-e', '{"fonte": "rotulo", "arquivo": "BioGummy.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": 111, "insumo_json": "Vitamina E (DL-alfa-tocoferol)"}'),
    ('bella-gummy-biotina-em-gummy', 2, 'Zinco (bisglicinato de zinco)', 12, 'mg', 'zinco', '{"fonte": "rotulo", "arquivo": "BioGummy.pdf", "extraido_em": "2026-09-13", "e_sal": true, "elemento_equivalente_mg": 2.4, "vd_pct": 22, "insumo_json": "Zinco (bisglicinato de zinco)", "observacao": "O rotulo escreve textualmente: ''zinco (bisglicinato de zinco - equivalente a 2,4 mg de zinco) 12 mg''. Os 12 mg sao massa do SAL; a tabela nutricional declara Zinco 2,4 mg (22% VD), que e o ELEMENTO."}'),
    ('bella-gummy-biotina-em-gummy', 3, 'Vitamina A (acetato de retinol)', 1020, 'mcg', 'vitamina-a', '{"fonte": "rotulo", "arquivo": "BioGummy.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": 170, "insumo_json": "Vitamina A (acetato de retinol)"}'),
    ('bella-gummy-biotina-em-gummy', 4, 'Biotina (D-biotina)', 45, 'mcg', 'biotina', '{"fonte": "rotulo", "arquivo": "BioGummy.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": 150, "insumo_json": "Biotina (D-biotina)"}'),
    -- creatina-monohidratada-150g-soluvel (1 linha(s), CreatinaPo.pdf)
    ('creatina-monohidratada-150g-soluvel', 0, 'Creatina monohidratada', 5000, 'mg', 'creatina-monoidratada', '{"fonte": "rotulo", "arquivo": "CreatinaPo.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": null, "insumo_json": "Creatina monohidratada", "observacao": "Tabela traz ''Creatina (mg) 5000 mg'' com %VD marcado apenas com asterisco (VD nao estabelecido)"}'),
    -- creatina-gummy-sabor-frutas-vermelhas (1 linha(s), creatina gummy.pdf)
    ('creatina-gummy-sabor-frutas-vermelhas', 0, 'Creatina monohidratada', 3000, 'mg', 'creatina-monoidratada', '{"fonte": "rotulo", "arquivo": "creatina gummy.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": null, "insumo_json": "Creatina monohidratada", "observacao": "Tabela marca (**) = Valor Diario nao estabelecido"}'),
    -- melatonina-em-gummy-sabor-uva (2 linha(s), DreamGummy.pdf)
    ('melatonina-em-gummy-sabor-uva', 0, 'L-triptofano', 800, 'mg', 'l-triptofano', '{"fonte": "rotulo", "arquivo": "DreamGummy.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": null, "insumo_json": "L-triptofano", "observacao": "Consta da tabela nutricional como ''L-triptofano 800 mg'', sem %VD impresso"}'),
    ('melatonina-em-gummy-sabor-uva', 1, 'Melatonina', 0.21, 'mg', 'melatonina', '{"fonte": "rotulo", "arquivo": "DreamGummy.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": null, "insumo_json": "Melatonina", "observacao": "Tabela marca (**) = Valor Diario nao estabelecido"}'),
    -- serena (5 linha(s), Serena.pdf)
    ('serena', 0, 'Magnésio (de cloreto de magnésio)', 63, 'mg', 'magnesio', '{"fonte": "rotulo", "arquivo": "Serena.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": 15, "insumo_json": "Magnesio (de cloreto de magnesio)", "observacao": "Valor do ELEMENTO magnesio; a tabela declara Magnesio 63 mg (15% VD)"}'),
    ('serena', 1, 'L-teanina', 50, 'mg', 'l-teanina', '{"fonte": "rotulo", "arquivo": "Serena.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": null, "insumo_json": "L-teanina", "observacao": "Nao consta da tabela nutricional"}'),
    ('serena', 2, 'Mio-inositol', 50, 'mg', 'inositol', '{"fonte": "rotulo", "arquivo": "Serena.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": null, "insumo_json": "Mio-inositol", "observacao": "Nao consta da tabela nutricional"}'),
    ('serena', 3, 'Vitamina B6 (cloridrato de piridoxina)', 1.3, 'mg', 'vitamina-b6', '{"fonte": "rotulo", "arquivo": "Serena.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": 100, "insumo_json": "Vitamina B6 (cloridrato de piridoxina)"}'),
    ('serena', 4, 'Melatonina', 0.21, 'mg', 'melatonina', '{"fonte": "rotulo", "arquivo": "Serena.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": null, "insumo_json": "Melatonina", "observacao": "Tabela marca (**) = Valor Diario nao estabelecido"}'),
    -- detox-matinal-lemon-shot-300g (11 linha(s), Detox.pdf)
    ('detox-matinal-lemon-shot-300g', 0, 'Maltodextrina', 6.603, 'g', 'maltodextrina', '{"fonte": "rotulo", "arquivo": "Detox.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": null, "insumo_json": "Maltodextrina", "observacao": "Nao consta da tabela nutricional"}'),
    ('detox-matinal-lemon-shot-300g', 1, 'Ácido ascórbico (vitamina C)', 1.6, 'g', 'vitamina-c', '{"fonte": "rotulo", "arquivo": "Detox.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": 1600, "insumo_json": "Acido ascorbico (vitamina C)", "observacao": "Equivale a 1600 mg; a tabela declara Vitamina C 1600 mg (1600% VD)"}'),
    ('detox-matinal-lemon-shot-300g', 2, 'Ácido cítrico (INS 330)', 0.67, 'g', 'acido-citrico', '{"fonte": "rotulo", "arquivo": "Detox.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": null, "insumo_json": "Acido citrico (INS 330)", "observacao": "Nao consta da tabela nutricional"}'),
    ('detox-matinal-lemon-shot-300g', 3, 'Extrato de café verde (Coffea arabica L.)', 0.4, 'g', 'extrato-de-cafe-verde', '{"fonte": "rotulo", "arquivo": "Detox.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": null, "insumo_json": "Extrato de cafe verde (Coffea arabica L.)", "observacao": "Nao consta da tabela nutricional"}'),
    ('detox-matinal-lemon-shot-300g', 4, 'Aromatizante idêntico ao natural de limão', 0.33, 'g', 'aromatizante-identico-ao-natural-de-limao', '{"fonte": "rotulo", "arquivo": "Detox.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": null, "insumo_json": "Aromatizante identico ao natural de limao", "observacao": "Nao consta da tabela nutricional"}'),
    ('detox-matinal-lemon-shot-300g', 5, 'Extrato de rizomas de Curcuma longa L.', 0.13, 'g', 'extrato-de-rizomas-de-curcuma', '{"fonte": "rotulo", "arquivo": "Detox.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": null, "insumo_json": "Extrato de rizomas de Curcuma longa L.", "observacao": "Nao consta da tabela nutricional"}'),
    ('detox-matinal-lemon-shot-300g', 6, 'Extrato de laranja Moro (Citrus sinensis L. Osbeck)', 0.1, 'g', 'extrato-de-laranja-moro', '{"fonte": "rotulo", "arquivo": "Detox.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": null, "insumo_json": "Extrato de laranja Moro (Citrus sinensis L. Osbeck)", "observacao": "Nao consta da tabela nutricional"}'),
    ('detox-matinal-lemon-shot-300g', 7, 'Dióxido de silício (INS 551)', 0.1, 'g', 'dioxido-de-silicio', '{"fonte": "rotulo", "arquivo": "Detox.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": null, "insumo_json": "Dioxido de silicio (INS 551)", "observacao": "Nao consta da tabela nutricional"}'),
    ('detox-matinal-lemon-shot-300g', 8, 'Edulcorante sucralose (INS 955)', 0.05, 'g', 'edulcorante-sucralose', '{"fonte": "rotulo", "arquivo": "Detox.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": null, "insumo_json": "Edulcorante sucralose (INS 955)", "observacao": "Nao consta da tabela nutricional"}'),
    ('detox-matinal-lemon-shot-300g', 9, 'Corantes tartrazina (INS 102) e azul brilhante FCF (INS 133)', 0.017, 'g', 'corante-verde', '{"fonte": "rotulo", "arquivo": "Detox.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": null, "insumo_json": "Corantes tartrazina (INS 102) e azul brilhante FCF (INS 133)", "observacao": "Valor conjunto dos dois corantes, como escrito no rotulo"}'),
    ('detox-matinal-lemon-shot-300g', 10, 'Bisglicinato de zinco', 1.45, 'mg', 'zinco', '{"fonte": "rotulo", "arquivo": "Detox.pdf", "extraido_em": "2026-09-13", "e_sal": true, "elemento_equivalente_mg": 0.29, "vd_pct": 3, "insumo_json": "Bisglicinato de zinco", "observacao": "O rotulo escreve: ''bisglicinato de zinco 1,45 mg (equivalente a 0,29 mg de zinco)''. A tabela nutricional declara Zinco 0,29 mg (3% VD), que e o ELEMENTO."}'),
    -- saude-intestinal (11 linha(s), Floravex-intestino.pdf)
    ('saude-intestinal', 0, 'Psyllium (Plantago ovata, casca da semente)', 342, 'mg', 'psyllium', '{"fonte": "rotulo", "arquivo": "Floravex-intestino.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": null, "insumo_json": "Psyllium (Plantago ovata, casca da semente)", "observacao": "Nao consta da tabela nutricional"}'),
    ('saude-intestinal', 1, 'Inulina de Cichorium intybus', 135, 'mg', 'inulina-de-cichorium-intybus', '{"fonte": "rotulo", "arquivo": "Floravex-intestino.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": null, "insumo_json": "Inulina de Cichorium intybus", "observacao": "Nao consta da tabela nutricional"}'),
    ('saude-intestinal', 2, 'L-glutamina', 135, 'mg', 'l-glutamina', '{"fonte": "rotulo", "arquivo": "Floravex-intestino.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": null, "insumo_json": "L-glutamina", "observacao": "Nao consta da tabela nutricional"}'),
    ('saude-intestinal', 3, 'Extrato de rizomas de Curcuma longa L.', 117, 'mg', 'extrato-de-rizomas-de-curcuma', '{"fonte": "rotulo", "arquivo": "Floravex-intestino.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": null, "insumo_json": "Extrato de rizomas de Curcuma longa L.", "observacao": "Nao consta da tabela nutricional"}'),
    ('saude-intestinal', 4, 'Frutooligossacarídeos (FOS)', 90, 'mg', 'frutooligossacarideos', '{"fonte": "rotulo", "arquivo": "Floravex-intestino.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": null, "insumo_json": "Frutooligossacarideos (FOS)", "observacao": "Nao consta da tabela nutricional"}'),
    ('saude-intestinal', 5, 'Magnésio (de bisglicinato de magnésio)', 90, 'mg', 'magnesio', '{"fonte": "rotulo", "arquivo": "Floravex-intestino.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": 21, "insumo_json": "Magnesio (de bisglicinato de magnesio)", "observacao": "Valor do ELEMENTO magnesio; a tabela declara Magnesio 90 mg (21% VD)"}'),
    ('saude-intestinal', 6, 'Quercetina', 72, 'mg', 'quercetina', '{"fonte": "rotulo", "arquivo": "Floravex-intestino.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": null, "insumo_json": "Quercetina", "observacao": "Nao consta da tabela nutricional"}'),
    ('saude-intestinal', 7, 'Zinco (de bisglicinato de zinco)', 13.5, 'mg', 'zinco', '{"fonte": "rotulo", "arquivo": "Floravex-intestino.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": 123, "insumo_json": "Zinco (de bisglicinato de zinco)", "observacao": "Valor do ELEMENTO zinco; a tabela declara Zinco 13,5 mg (123% VD)"}'),
    ('saude-intestinal', 8, 'Dióxido de silício (INS 551)', 4.7, 'mg', 'dioxido-de-silicio', '{"fonte": "rotulo", "arquivo": "Floravex-intestino.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": null, "insumo_json": "Dioxido de silicio (INS 551)", "observacao": "Nao consta da tabela nutricional"}'),
    ('saude-intestinal', 9, 'Vitamina B6 (cloridrato de piridoxina)', 1.26, 'mg', 'vitamina-b6', '{"fonte": "rotulo", "arquivo": "Floravex-intestino.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": 97, "insumo_json": "Vitamina B6 (cloridrato de piridoxina)"}'),
    ('saude-intestinal', 10, 'Vitamina A (acetato de retinila)', 540, 'mcg', 'vitamina-a', '{"fonte": "rotulo", "arquivo": "Floravex-intestino.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": 90, "insumo_json": "Vitamina A (acetato de retinila)"}'),
    -- focus-colina (9 linha(s), FocusColina.pdf)
    ('focus-colina', 0, 'Colina (bitartarato de colina)', 470, 'mg', 'colina', '{"fonte": "rotulo", "arquivo": "FocusColina.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": null, "insumo_json": "Colina (bitartarato de colina)", "observacao": "Nao consta da tabela nutricional"}'),
    ('focus-colina', 1, 'L-tirosina', 220, 'mg', 'l-tirosina', '{"fonte": "rotulo", "arquivo": "FocusColina.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": null, "insumo_json": "L-tirosina", "observacao": "Nao consta da tabela nutricional"}'),
    ('focus-colina', 2, 'L-teanina', 115, 'mg', 'l-teanina', '{"fonte": "rotulo", "arquivo": "FocusColina.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": null, "insumo_json": "L-teanina", "observacao": "Nao consta da tabela nutricional"}'),
    ('focus-colina', 3, 'L-carnitina', 95, 'mg', 'l-carnitina', '{"fonte": "rotulo", "arquivo": "FocusColina.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": null, "insumo_json": "L-carnitina", "observacao": "Nao consta da tabela nutricional"}'),
    ('focus-colina', 4, 'Magnésio (bisglicinato de magnésio)', 60, 'mg', 'magnesio', '{"fonte": "rotulo", "arquivo": "FocusColina.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": 14, "insumo_json": "Magnesio (bisglicinato de magnesio)", "observacao": "Valor do ELEMENTO magnesio; a tabela declara Magnesio 60 mg (14% VD)"}'),
    ('focus-colina', 5, 'Inositol (mio-inositol)', 25, 'mg', 'inositol', '{"fonte": "rotulo", "arquivo": "FocusColina.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": null, "insumo_json": "Inositol (mio-inositol)", "observacao": "Nao consta da tabela nutricional"}'),
    ('focus-colina', 6, 'Vitamina B6 (cloridrato de piridoxina)', 1.3, 'mg', 'vitamina-b6', '{"fonte": "rotulo", "arquivo": "FocusColina.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": 100, "insumo_json": "Vitamina B6 (cloridrato de piridoxina)"}'),
    ('focus-colina', 7, 'Vitamina D3 (colecalciferol)', 5, 'mcg', 'vitamina-d', '{"fonte": "rotulo", "arquivo": "FocusColina.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": 33, "insumo_json": "Vitamina D3 (colecalciferol)"}'),
    ('focus-colina', 8, 'Vitamina B12 (cianocobalamina)', 2.4, 'mcg', 'vitamina-b12', '{"fonte": "rotulo", "arquivo": "FocusColina.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": 100, "insumo_json": "Vitamina B12 (cianocobalamina)"}'),
    -- moro-slim (11 linha(s), MoroSlim.pdf)
    ('moro-slim', 0, 'Extrato seco de semente de feno-grego (Trigonella foenum-graecum L.)', 220, 'mg', 'extrato-seco-de-semente-de-feno-grego', '{"fonte": "rotulo", "arquivo": "MoroSlim.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": null, "insumo_json": "Extrato seco de semente de feno-grego (Trigonella foenum-graecum L.)", "observacao": "Nao consta da tabela nutricional"}'),
    ('moro-slim', 1, 'Extrato seco de laranja Moro (Citrus sinensis (L.) Osbeck)', 175, 'mg', 'extrato-de-laranja-moro', '{"fonte": "rotulo", "arquivo": "MoroSlim.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": null, "insumo_json": "Extrato seco de laranja Moro (Citrus sinensis (L.) Osbeck)", "observacao": "Nao consta da tabela nutricional"}'),
    ('moro-slim', 2, 'Extrato seco de rizoma de cúrcuma (Curcuma longa L.)', 135, 'mg', 'extrato-de-rizomas-de-curcuma', '{"fonte": "rotulo", "arquivo": "MoroSlim.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": null, "insumo_json": "Extrato seco de rizoma de curcuma (Curcuma longa L.)", "observacao": "Nao consta da tabela nutricional"}'),
    ('moro-slim', 3, 'Espirulina (Arthrospira platensis)', 122, 'mg', 'espirulina', '{"fonte": "rotulo", "arquivo": "MoroSlim.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": null, "insumo_json": "Espirulina (Arthrospira platensis)", "observacao": "Nao consta da tabela nutricional"}'),
    ('moro-slim', 4, 'Quitosana', 122, 'mg', 'quitosana', '{"fonte": "rotulo", "arquivo": "MoroSlim.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": null, "insumo_json": "Quitosana", "observacao": "Nao consta da tabela nutricional"}'),
    ('moro-slim', 5, 'Extrato seco de semente de café verde (Coffea arabica L.)', 110, 'mg', 'extrato-de-cafe-verde', '{"fonte": "rotulo", "arquivo": "MoroSlim.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": null, "insumo_json": "Extrato seco de semente de cafe verde (Coffea arabica L.)", "observacao": "Nao consta da tabela nutricional"}'),
    ('moro-slim', 6, 'Psyllium (Plantago ovata Forssk.)', 66, 'mg', 'psyllium', '{"fonte": "rotulo", "arquivo": "MoroSlim.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": null, "insumo_json": "Psyllium (Plantago ovata Forssk.)", "observacao": "Nao consta da tabela nutricional"}'),
    ('moro-slim', 7, 'Inulina de raiz de chicória (Cichorium intybus L.)', 44, 'mg', 'inulina-de-cichorium-intybus', '{"fonte": "rotulo", "arquivo": "MoroSlim.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": null, "insumo_json": "Inulina de raiz de chicoria (Cichorium intybus L.)", "observacao": "Nao consta da tabela nutricional"}'),
    ('moro-slim', 8, 'Dióxido de silício (INS 551)', 2.474, 'mg', 'dioxido-de-silicio', '{"fonte": "rotulo", "arquivo": "MoroSlim.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": null, "insumo_json": "Dioxido de silicio (INS 551)", "observacao": "Nao consta da tabela nutricional"}'),
    ('moro-slim', 9, 'Vitamina A (acetato de retinol)', 1500, 'mcg', 'vitamina-a', '{"fonte": "rotulo", "arquivo": "MoroSlim.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": 250, "insumo_json": "Vitamina A (acetato de retinol)"}'),
    ('moro-slim', 10, 'Cromo (picolinato de cromo)', 250, 'mcg', 'cromo', '{"fonte": "rotulo", "arquivo": "MoroSlim.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": 714, "insumo_json": "Cromo (picolinato de cromo)", "observacao": "Valor do ELEMENTO cromo; a tabela declara Cromo 250 mcg (714% VD)"}'),
    -- multivitaminico (20 linha(s), multivitaminico.pdf)
    ('multivitaminico', 0, 'Magnésio (de bisglicinato de magnésio)', 260, 'mg', 'magnesio', '{"fonte": "rotulo", "arquivo": "multivitaminico.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": 62, "insumo_json": "Magnesio (de bisglicinato de magnesio)", "observacao": "Valor do ELEMENTO magnesio; a tabela declara Magnesio 260 mg (62% VD)"}'),
    ('multivitaminico', 1, 'L-teanina', 150, 'mg', 'l-teanina', '{"fonte": "rotulo", "arquivo": "multivitaminico.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": null, "insumo_json": "L-teanina", "observacao": "Consta da tabela como ''L-teanina 150 mg ()'', com o campo de %VD impresso vazio"}'),
    ('multivitaminico', 2, 'Vitamina C (ácido ascórbico)', 100, 'mg', 'vitamina-c', '{"fonte": "rotulo", "arquivo": "multivitaminico.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": 100, "insumo_json": "Vitamina C (acido ascorbico)"}'),
    ('multivitaminico', 3, 'Zinco (de bisglicinato de zinco)', 15, 'mg', 'zinco', '{"fonte": "rotulo", "arquivo": "multivitaminico.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": 136, "insumo_json": "Zinco (de bisglicinato de zinco)", "observacao": "Valor do ELEMENTO zinco; a tabela declara Zinco 15 mg (136% VD)"}'),
    ('multivitaminico', 4, 'Vitamina B3 (nicotinamida)', 16, 'mg', 'vitamina-b3', '{"fonte": "rotulo", "arquivo": "multivitaminico.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": 100, "insumo_json": "Vitamina B3 (nicotinamida)"}'),
    ('multivitaminico', 5, 'Vitamina E (acetato de tocoferol)', 10, 'mg', 'vitamina-e', '{"fonte": "rotulo", "arquivo": "multivitaminico.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": 67, "insumo_json": "Vitamina E (acetato de tocoferol)"}'),
    ('multivitaminico', 6, 'Vitamina B5 (pantotenato de cálcio)', 5, 'mg', 'vitamina-b5', '{"fonte": "rotulo", "arquivo": "multivitaminico.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": 100, "insumo_json": "Vitamina B5 (pantotenato de calcio)"}'),
    ('multivitaminico', 7, 'Boro (de quelato de boro)', 3, 'mg', 'boro', '{"fonte": "rotulo", "arquivo": "multivitaminico.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": null, "insumo_json": "Boro (de quelato de boro)", "observacao": "Tabela marca (**) = Valor Diario nao estabelecido"}'),
    ('multivitaminico', 8, 'Vitamina B6 (cloridrato de piridoxina)', 1.3, 'mg', 'vitamina-b6', '{"fonte": "rotulo", "arquivo": "multivitaminico.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": 100, "insumo_json": "Vitamina B6 (cloridrato de piridoxina)"}'),
    ('multivitaminico', 9, 'Vitamina B1 (cloridrato de tiamina)', 1.2, 'mg', 'vitamina-b1', '{"fonte": "rotulo", "arquivo": "multivitaminico.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": 100, "insumo_json": "Vitamina B1 (cloridrato de tiamina)"}'),
    ('multivitaminico', 10, 'Vitamina B2 (riboflavina)', 1.3, 'mg', 'vitamina-b2', '{"fonte": "rotulo", "arquivo": "multivitaminico.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": 100, "insumo_json": "Vitamina B2 (riboflavina)"}'),
    ('multivitaminico', 11, 'Vitamina A (acetato de retinol)', 1300, 'mcg', 'vitamina-a', '{"fonte": "rotulo", "arquivo": "multivitaminico.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": 217, "insumo_json": "Vitamina A (acetato de retinol)"}'),
    ('multivitaminico', 12, 'Vitamina B9 (ácido fólico)', 800, 'mcg', 'vitamina-b9', '{"fonte": "rotulo", "arquivo": "multivitaminico.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": 200, "insumo_json": "Vitamina B9 (acido folico)"}'),
    ('multivitaminico', 13, 'Cobre (de bisglicinato de cobre)', 0.9, 'mg', 'cobre', '{"fonte": "rotulo", "arquivo": "multivitaminico.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": 100, "insumo_json": "Cobre (de bisglicinato de cobre)", "observacao": "Composicao escreve 0,9 mg; a tabela declara Cobre 0,9 mg (100% VD). Equivale a 900 mcg."}'),
    ('multivitaminico', 14, 'Selênio (de selenito de sódio)', 100, 'mcg', 'selenio', '{"fonte": "rotulo", "arquivo": "multivitaminico.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": 167, "insumo_json": "Selenio (de selenito de sodio)"}'),
    ('multivitaminico', 15, 'Vitamina K2 (menaquinona-7)', 149, 'mcg', 'vitamina-k', '{"fonte": "rotulo", "arquivo": "multivitaminico.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": null, "insumo_json": "Vitamina K2 (menaquinona-7)", "observacao": "Tabela marca (**) = Valor Diario nao estabelecido"}'),
    ('multivitaminico', 16, 'Vitamina D3 (colecalciferol)', 50, 'mcg', 'vitamina-d', '{"fonte": "rotulo", "arquivo": "multivitaminico.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": 333, "insumo_json": "Vitamina D3 (colecalciferol)"}'),
    ('multivitaminico', 17, 'Cromo (de picolinato de cromo)', 35, 'mcg', 'cromo', '{"fonte": "rotulo", "arquivo": "multivitaminico.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": 100, "insumo_json": "Cromo (de picolinato de cromo)", "observacao": "Valor do ELEMENTO cromo; a tabela declara Cromo 35 mcg (100% VD)"}'),
    ('multivitaminico', 18, 'Vitamina B12 (cianocobalamina)', 9.94, 'mcg', 'vitamina-b12', '{"fonte": "rotulo", "arquivo": "multivitaminico.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": 414, "insumo_json": "Vitamina B12 (cianocobalamina)"}'),
    ('multivitaminico', 19, 'Dióxido de silício (INS 551)', 10, 'mg', 'dioxido-de-silicio', '{"fonte": "rotulo", "arquivo": "multivitaminico.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": null, "insumo_json": "Dioxido de silicio (INS 551)", "observacao": "Nao consta da tabela nutricional"}'),
    -- pro-energy (9 linha(s), ProEnergy.pdf)
    ('pro-energy', 0, 'Extrato seco de semente de feno-grego (Trigonella foenum-graecum L.)', 250, 'mg', 'extrato-seco-de-semente-de-feno-grego', '{"fonte": "rotulo", "arquivo": "ProEnergy.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": null, "insumo_json": "Extrato seco de semente de feno-grego (Trigonella foenum-graecum L.)", "observacao": "Nao consta da tabela nutricional"}'),
    ('pro-energy', 1, 'L-taurina', 200, 'mg', 'taurina', '{"fonte": "rotulo", "arquivo": "ProEnergy.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": null, "insumo_json": "L-taurina", "observacao": "Nao consta da tabela nutricional"}'),
    ('pro-energy', 2, 'Guaraná em pó (Paullinia cupana Kunth, semente)', 200, 'mg', 'guarana-em-po', '{"fonte": "rotulo", "arquivo": "ProEnergy.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": null, "insumo_json": "Guarana em po (Paullinia cupana Kunth, semente)", "observacao": "Nao consta da tabela nutricional"}'),
    ('pro-energy', 3, 'Cafeína anidra', 150, 'mg', 'cafeina-anidra', '{"fonte": "rotulo", "arquivo": "ProEnergy.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": null, "insumo_json": "Cafeina anidra", "observacao": "Nao consta da tabela nutricional"}'),
    ('pro-energy', 4, 'L-carnitina base', 90, 'mg', 'l-carnitina', '{"fonte": "rotulo", "arquivo": "ProEnergy.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": null, "insumo_json": "L-carnitina base", "observacao": "Nao consta da tabela nutricional"}'),
    ('pro-energy', 5, 'L-Aspartato de L-arginina', 75, 'mg', 'l-aspartato-de-l-arginina', '{"fonte": "rotulo", "arquivo": "ProEnergy.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": null, "insumo_json": "L-Aspartato de L-arginina", "observacao": "Nao consta da tabela nutricional"}'),
    ('pro-energy', 6, 'Bisglicinato de zinco', 20, 'mg', 'zinco', '{"fonte": "rotulo", "arquivo": "ProEnergy.pdf", "extraido_em": "2026-09-13", "e_sal": true, "elemento_equivalente_mg": 4, "vd_pct": 36, "insumo_json": "Bisglicinato de zinco", "observacao": "Os 20 mg sao massa do SAL. A tabela nutricional declara Zinco 4 mg (36% VD), que e o ELEMENTO. O restante e massa do bisglicinato."}'),
    ('pro-energy', 7, 'Vitamina B6 (cloridrato de piridoxina)', 10, 'mg', 'vitamina-b6', '{"fonte": "rotulo", "arquivo": "ProEnergy.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": 769, "insumo_json": "Vitamina B6 (cloridrato de piridoxina)"}'),
    ('pro-energy', 8, 'Dióxido de silício (INS 551)', 5, 'mg', 'dioxido-de-silicio', '{"fonte": "rotulo", "arquivo": "ProEnergy.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": null, "insumo_json": "Dioxido de silicio (INS 551)", "observacao": "Nao consta da tabela nutricional"}'),
    -- zma-zinco-magnesio-e-vitamina-d (7 linha(s), ZmaComplex.pdf)
    ('zma-zinco-magnesio-e-vitamina-d', 0, 'Magnésio glicinato', 500, 'mg', 'magnesio', '{"fonte": "rotulo", "arquivo": "ZmaComplex.pdf", "extraido_em": "2026-09-13", "e_sal": true, "elemento_equivalente_mg": 152, "vd_pct": 36, "insumo_json": "Magnesio glicinato", "observacao": "Os 500 mg sao massa do SAL. A tabela nutricional declara Magnesio 152 mg (36% VD), que e o ELEMENTO."}'),
    ('zma-zinco-magnesio-e-vitamina-d', 1, 'Dióxido de silício (INS 551)', 217.1, 'mg', 'dioxido-de-silicio', '{"fonte": "rotulo", "arquivo": "ZmaComplex.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": null, "insumo_json": "Dioxido de silicio (INS 551)", "observacao": "Nao consta da tabela nutricional"}'),
    ('zma-zinco-magnesio-e-vitamina-d', 2, 'L-teanina', 150, 'mg', 'l-teanina', '{"fonte": "rotulo", "arquivo": "ZmaComplex.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": null, "insumo_json": "L-teanina", "observacao": "Nao consta da tabela nutricional"}'),
    ('zma-zinco-magnesio-e-vitamina-d', 3, 'Bisglicinato de zinco', 75, 'mg', 'zinco', '{"fonte": "rotulo", "arquivo": "ZmaComplex.pdf", "extraido_em": "2026-09-13", "e_sal": true, "elemento_equivalente_mg": 15, "vd_pct": 136, "insumo_json": "Bisglicinato de zinco", "observacao": "Os 75 mg sao massa do SAL. A tabela nutricional declara Zinco 15 mg (136% VD), que e o ELEMENTO."}'),
    ('zma-zinco-magnesio-e-vitamina-d', 4, 'Quelato de boro (glicinato de boro)', 56.6, 'mg', 'boro', '{"fonte": "rotulo", "arquivo": "ZmaComplex.pdf", "extraido_em": "2026-09-13", "e_sal": true, "elemento_equivalente_mg": null, "vd_pct": null, "insumo_json": "Quelato de boro (glicinato de boro)", "observacao": "SAL. O boro elemento NAO e declarado na tabela nutricional deste rotulo."}'),
    ('zma-zinco-magnesio-e-vitamina-d', 5, 'Vitamina B6 (cloridrato de piridoxina)', 1.3, 'mg', 'vitamina-b6', '{"fonte": "rotulo", "arquivo": "ZmaComplex.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": 100, "insumo_json": "Vitamina B6 (cloridrato de piridoxina)"}'),
    ('zma-zinco-magnesio-e-vitamina-d', 6, 'Vitamina D3 (colecalciferol)', 25, 'mcg', 'vitamina-d', '{"fonte": "rotulo", "arquivo": "ZmaComplex.pdf", "extraido_em": "2026-09-13", "e_sal": false, "elemento_equivalente_mg": null, "vd_pct": 167, "insumo_json": "Vitamina D3 (colecalciferol)", "observacao": "A tabela declara Vitamina D 25 mcg (167% VD)"}')
) as v(slug, sort_order, ingredient_name, quantity, unit, ingredient_slug, metadata)
join public.formulas f
  on f.slug = v.slug
 and f.deleted_at is null
join public.ingredients i
  on i.slug = v.ingredient_slug
 and i.deleted_at is null
where not exists (
    select 1
    from public.formula_compositions x
    where x.formula_id = f.id
      and x.deleted_at is null
      and x.metadata->>'fonte' = 'rotulo'
);


-- -------------------------------------------------------------------------------------
-- 5. AUTOCHECK - aborta a transacao inteira se o estado final nao bater
-- -------------------------------------------------------------------------------------
-- Mesmo padrao das migrations de conformidade: conferir em vez de supor.
--   a) cada uma das 12 formulas tem EXATAMENTE o numero de linhas ativas do rotulo;
--   b) nenhuma linha ativa dessas formulas ficou sem metadata.fonte = 'rotulo' (ou seja,
--      nenhuma linha antiga sobreviveu) nem sem ingredient_id (nenhum slug de insumo
--      deixou de resolver);
--   c) total de linhas ativas nas 12 = 92.

do $$
declare
    v_encontrado  integer;
    v_sem_fonte   integer;
    v_sem_insumo  integer;
    v_total       integer;
    r             record;
begin
    for r in
        select *
        from (values
            ('bella-gummy-biotina-em-gummy', 5),
            ('creatina-monohidratada-150g-soluvel', 1),
            ('creatina-gummy-sabor-frutas-vermelhas', 1),
            ('melatonina-em-gummy-sabor-uva', 2),
            ('serena', 5),
            ('detox-matinal-lemon-shot-300g', 11),
            ('saude-intestinal', 11),
            ('focus-colina', 9),
            ('moro-slim', 11),
            ('multivitaminico', 20),
            ('pro-energy', 9),
            ('zma-zinco-magnesio-e-vitamina-d', 7)
        ) as e(slug, linhas)
    loop
        select count(*) into v_encontrado
        from public.formula_compositions fc
        join public.formulas f on f.id = fc.formula_id
        where f.slug = r.slug
          and f.deleted_at is null
          and fc.deleted_at is null
          and fc.active;

        if v_encontrado <> r.linhas then
            raise exception 'formula % deveria ter % linhas ativas de composicao depois da troca, encontrado %', r.slug, r.linhas, v_encontrado;
        end if;
    end loop;

    select
        count(*) filter (where coalesce(fc.metadata->>'fonte', '') <> 'rotulo'),
        count(*) filter (where fc.ingredient_id is null),
        count(*)
    into v_sem_fonte, v_sem_insumo, v_total
    from public.formula_compositions fc
    join public.formulas f on f.id = fc.formula_id
    where f.deleted_at is null
      and fc.deleted_at is null
      and f.slug in (
          'bella-gummy-biotina-em-gummy',
          'creatina-monohidratada-150g-soluvel',
          'creatina-gummy-sabor-frutas-vermelhas',
          'melatonina-em-gummy-sabor-uva',
          'serena',
          'detox-matinal-lemon-shot-300g',
          'saude-intestinal',
          'focus-colina',
          'moro-slim',
          'multivitaminico',
          'pro-energy',
          'zma-zinco-magnesio-e-vitamina-d'
      );

    if v_sem_fonte <> 0 then
        raise exception '% linha(s) ativa(s) das 12 formulas ainda sem metadata.fonte = rotulo (linha antiga sobreviveu)', v_sem_fonte;
    end if;

    if v_sem_insumo <> 0 then
        raise exception '% linha(s) nova(s) sem ingredient_id (slug de insumo nao resolveu em public.ingredients)', v_sem_insumo;
    end if;

    if v_total <> 92 then
        raise exception 'esperado 92 linhas ativas de composicao nas 12 formulas, encontrado %', v_total;
    end if;
end $$;
