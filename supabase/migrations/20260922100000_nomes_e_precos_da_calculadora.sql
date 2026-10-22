-- =====================================================================================
-- LEMON CAPS - CATALOGO PUBLICO
-- 20260922100000_nomes_e_precos_da_calculadora.sql
--
-- Atualiza em public.formulas o NOME (name) e/ou o PRECO PUBLICO POR POTE
-- (list_price_cents) dos produtos do catalogo, adotando os valores da Calculadora Lemon
-- Caps, seguindo as regras que o dono decidiu em 17/09/2026 a partir do inventario
-- docs/conformidade/INVENTARIO-CALCULADORA-VS-CATALOGO-2026-09-17.md - e a correcao que o
-- dono fez, na mesma sessao, depois de revisar a primeira versao desta migration.
--
-- POR QUE ESTA MIGRATION EXISTE
-- O inventario de 17/09/2026 comparou as 24 formulas ativas do catalogo com os 104
-- registros de formula da calculadora rotulados como "catalogo" e escolheu, para cada
-- uma, o melhor candidato (nome, formato, composicao e preco). Na primeira leitura, o
-- criterio de nome foi "adota o nome da calculadora, literal, exceto alegacao/ambiguo/
-- gramatura". O dono revisou essa primeira versao e apertou o criterio: nome da
-- calculadora que e claramente TEXTO DE FICHA INTERNA (linha de custo, abreviacao de
-- producao, referencia tecnica) tambem fica de fora, mesmo sem ser alegacao de saude -
-- porque nao e nome pronto para card publico. Ficaram só 8 nomes "limpos". O preco publico
-- continua sincronizado com o preco de venda da calculadora onde ha mudanca real, mesmo
-- nos produtos que nao mudam de nome.
--
-- REGRAS DO DONO (17/09/2026), literais, ja com a correcao:
--   NOMES: adotar o nome da calculadora, literalmente como esta la (sem "melhorar"
--   capitalizacao nem pontuacao), EXCETO quando (1) o nome da calculadora contem termo de
--   alegacao de saude -> mantem o nome atual do catalogo, lista para o RT (e, ao contrario,
--   se o nome ATUAL tem alegacao e o da calculadora e neutro, adota o da calculadora, e
--   melhoria); (2) mapeamento AMBIGUO no inventario (Bella Gummy, Saude Intestinal) -> nao
--   renomeia, lista para o dono; (3) nome da calculadora com gramatura/tamanho DIFERENTE
--   (numero conflitante, nao mera omissao) do produto do catalogo -> nao renomeia, lista
--   como divergencia de fato; (4) nomes identicos -> nada a fazer; (5) [ACRESCENTADO NA
--   CORRECAO] nome da calculadora e texto de ficha interna, nao nome comercial - sinais:
--   "LINHA ECONÔMICA FINAL" (linha de custo), abreviacao de producao tipo "TUTFRUT",
--   referencia tipo "60 CÁPSULAS - LEMON CAPS  PREMIUM", caixa alta sem acento em nome que
--   deveria ter (ex.: "MULTIVITAMINICO", "OMEGA 3"), ou omissao de gramatura relevante -> nao
--   renomeia, mantem o nome atual do catalogo. So passaram no crivo final 8 nomes: ArtFlex
--   (dores-musculares), Bio Princess (Cabelo, pele e unha) (biotina-em-capsula), ZMA
--   (zma-zinco-magnesio-e-vitamina-d), SHOT + COLÁGENO (shot-colageno-300-gramas), Shot
--   Matinal 300 gramas (detox-matinal-lemon-shot-300g), Creatina Monohidratada Solúvel -
--   Pote com 150/300 gramas (as duas creatinas soluveis), CREATINA EM GUMMY FRUTAS
--   VERMELHAS (creatina-gummy-sabor-frutas-vermelhas).
--   PRECOS: list_price_cents = preco de venda da calculadora (em centavos, sem arredondar
--   alem do centavo) em todos os produtos mapeados, INCLUSIVE nos que nao mudam de nome
--   (regra 5 acima nao dispensa a sincronizacao de preco) e nos que ja batem ao centavo
--   (linha gerada mesmo assim, idempotente, para o arquivo documentar a origem). Excecoes:
--   sem preco cadastrado na calculadora (Emagrecedor Em Capsula, Pre-treino + Creatina
--   420 g); mapeamento AMBIGUO (Bella Gummy, Saude Intestinal). Confirmado que os dois
--   sistemas usam a MESMA BASE de preco (por pote/unidade, nao por dose) - ver ACHADO E
--   DECISAO abaixo sobre o Shot + Colageno, o unico caso que parecia contradizer isso e que
--   se explicou por registro duplicado errado, nao por base de preco diferente.
--
-- FONTES (lidas em 17/09/2026, reconfirmando o inventario na origem - nunca copiado do
-- markdown):
--   [C] Calculadora Lemon Caps - Supabase ref njfwoguvfozuaghufcgw, projeto "CALCULADORA
--       LEMON JOAO" (us-west-2), lida via Management API (POST .../database/query, so
--       SELECT) com o PAT de .env.local (nunca impresso). Tabelas formulas (coluna de nome
--       e nome_formula) e precificacoes (coluna de preco e preco_venda), casadas por
--       formula_id.
--   [D] Catalogo (site) - Supabase ref zjryrmqtumvaxdytvbbv, lido via PostgREST com a
--       chave publica de .env.production.local: GET .../rest/v1/formulas?select=id,slug,
--       name,list_price_cents,active,deleted_at&active=eq.true&order=slug - 24 linhas, e
--       a fonte da guarda de estado de partida (secao 0) abaixo.
--   [I] docs/conformidade/INVENTARIO-CALCULADORA-VS-CATALOGO-2026-09-17.md - mapeamento
--       (CONFIRMADO/PROPOSTO/AMBIGUO) e a escolha de qual registro da calculadora
--       representa cada produto do catalogo. Os NOMES e PRECOS em si foram relidos direto
--       nas fontes [C]/[D], nao copiados do texto do inventario.
--
-- ACHADO E DECISAO - PRECO DO SHOT + COLAGENO (shot-colageno-300-gramas):
-- O inventario ([I], secao 5.22) afirma que o registro "SHOT + COLAGENO" de 19/08 15:27
-- (calc id d2e0ff25-7d9c-4f80-a5ee-35a17a742b81, cliente LEMON CAPS - CATALOGO - a copia
-- de COMPOSICAO CORRETA, usada para comparar insumos) tem preco identico ao catalogo,
-- R$ 41,90 = R$ 41,90. A releitura direta em [C] mostrou o contrario: esse registro
-- (d2e0ff25) tem preco_venda R$ 53,42 (criado 14/05, precificacao recalculada em 27/07,
-- preco_anterior_recalculo R$ 53,50). Quem tem preco_venda R$ 41,90 e a OUTRA copia da
-- mesma formula, criada 1 minuto depois (calc id 98ea8413-ad3a-4e6e-94e1-6386d5c22661,
-- updated_at 19/08 15:28:23, com precificacao criada no mesmo instante) - exatamente a
-- copia que o proprio inventario descreve como CORROMPIDA (itens trocados: "Maltodextrina"
-- com 2,547 mg em vez de 2.547 mg, "Acido alfa-lipoico" e "Crambery" no lugar de vitamina C
-- e colageno) e que diz explicitamente "nao foi usada". Ou seja: o inventario cruzou a
-- composicao de um registro com o preco do outro. Cada formula_id tem exatamente 1 linha
-- em precificacoes (conferido, sem ambiguidade de linha-duplicada dentro do mesmo
-- formula_id) - o erro era de qual dos dois FORMULA_ID e o certo, nao de leitura de
-- precificacoes. DECISAO DO DONO: usar o preco do registro de composicao correta
-- (d2e0ff25, `precificacoes.preco_venda` = R$ 53,42) - e o que esta migration grava. O
-- nome muda para "SHOT + COLÁGENO" (sem alegacao, sem conflito de gramatura, ja estava
-- aprovado desde a primeira versao) e agora o preco tambem muda, junto: R$ 41,90 -> R$ 53,42.
--
-- MAPA COMPLETO - 24 PRODUTOS (nome: A=adota calc, M=mantem atual, I=identico/nada a
-- fazer; preco: A=atualiza p/ calc, M=mantem, sempre com o motivo):
--   bella-gummy-biotina-em-gummy                nome M (AMBIGUO) | preco M (AMBIGUO) -- SEM UPDATE
--   biotina-em-capsula                          nome A "Bio Princess (Cabelo, pele e unha)" | preco A R$ 14,90
--   creatina-gummy-sabor-frutas-vermelhas       nome A "CREATINA EM GUMMY FRUTAS VERMELHAS" | preco A (idempotente) R$ 34,90
--   creatina-em-gummy-sabor-tutti-frutti        nome M (texto de ficha: "TUTFRUT") | preco M (ja bate, R$ 34,90) -- SEM UPDATE
--   creatina-monohidratada-150g-soluvel         nome A "Creatina Monohidratada Solúvel - Pote com 150 gramas" | preco A (idempotente) R$ 20,00
--   creatina-monohidratada-300g-soluvel         nome A "Creatina Monohidratada Solúvel - Pote com 300 gramas" | preco A (idempotente) R$ 27,99
--   detox-matinal-lemon-shot-300g               nome A "Shot Matinal 300 gramas" | preco A (idempotente) R$ 23,00
--   dores-musculares                            nome A "ArtFlex" (melhoria: tira alegacao) | preco A R$ 13,80
--   emagrecedor-em-capsula                      nome M (alegacao nos 2 lados) | preco M (sem preco na calc) -- SEM UPDATE
--   focus-colina                                nome M (texto de ficha: "60 CÁPSULAS - LEMON CAPS  PREMIUM") | preco A R$ 16,88
--   melatonina-em-gummy-sabor-uva                nome I (identico) | preco A (idempotente) R$ 31,90
--   melatonina-triptofanos-encapsulados         nome M (alegacao "Sono/Ansiedade" na calc) | preco A (idempotente) R$ 14,90
--   moro-slim                                   nome M (alegacao "Emagrecimento" na calc) | preco A (idempotente) R$ 19,50
--   multi-vitta-gestante-e-lactante-em-capsula  nome M (texto de ficha: "LINHA ECONÔMICA FINAL") | preco A R$ 12,32
--   multivitaminico                             nome M (texto de ficha: caixa alta sem acento) | preco A R$ 16,38
--   omega-pro-tg                                nome M (texto de ficha: caixa alta sem acento) | preco M (ja bate, R$ 25,90) -- SEM UPDATE
--   pre-treino-creatina-sabor-limao-420g        nome M (gramatura: calc diz 300 G, produto e 420 g) | preco M (sem preco na calc) -- SEM UPDATE
--   pre-treino-300-g                            nome M (texto de ficha: omite gramatura) | preco A R$ 44,00
--   pro-energy                                  nome M (alegacao "ESTIMULANTE SEXUAL" na calc) | preco A R$ 11,20
--   saude-intestinal                            nome M (AMBIGUO) | preco M (AMBIGUO) -- SEM UPDATE
--   serena                                      nome M (alegacao "Sono" na calc) | preco A R$ 8,06 (registro "SERENA (30/06)", nao o de "SONO EM LIQUIDO...")
--   shot-colageno-300-gramas                    nome A "SHOT + COLAGENO" | preco A R$ 53,42 (ver ACHADO E DECISAO acima)
--   slim-up-emagrecimento-em-gota               nome M (alegacao "Emagrecimento" nos 2 lados) | preco A R$ 9,01
--   zma-zinco-magnesio-e-vitamina-d              nome A "ZMA" | preco A R$ 14,80
--
-- O QUE FICA DE FORA DESTA MIGRATION (SEM UPDATE nenhum), E POR QUE - 6 produtos:
--   bella-gummy-biotina-em-gummy e saude-intestinal: mapeamento AMBIGUO no inventario -
--     nome e preco ficam como estao ate o dono decidir qual composicao/registro e o real.
--   emagrecedor-em-capsula: nome tem alegacao ("Emagrecedor") nos dois lados - nao
--     renomeio; e a calculadora nao tem precificacao cadastrada para esta formula.
--   pre-treino-creatina-sabor-limao-420g: a calculadora chama o produto de "300 G" e o
--     catalogo vende como "420 g" - divergencia de fato, nao decido; tambem sem
--     precificacao na calculadora.
--   creatina-em-gummy-sabor-tutti-frutti: nome da calculadora e "CREATINA EM GUMMY SABOR
--     TUTFRUT" - abreviacao de ficha interna (regra 5), nao renomeio; e o preco ja bate ao
--     centavo (R$ 34,90 = R$ 34,90) - nada a gravar, nem preco nem nome.
--   omega-pro-tg: nome da calculadora e "OMEGA 3 (Softgel)" - caixa alta sem acento, texto
--     de ficha (regra 5), nao renomeio; e o preco ja bate ao centavo (R$ 25,90 = R$ 25,90) -
--     nada a gravar.
--
-- OUTROS 4 QUE NAO RENOMEIAM MAS TEM PRECO ATUALIZADO (regra 5 barra o nome, nao o preco):
--   focus-colina, multi-vitta-gestante-e-lactante-em-capsula, multivitaminico,
--   pre-treino-300-g - nestes, so o UPDATE de list_price_cents e gravado; o nome nao entra
--   no SET porque continua o mesmo do catalogo hoje.
--
-- Nomes de alegacao descartados que NUNCA usei (registro, nao sao produtos desta lista):
--   "TIRZ" (candidato descartado do Slim Up, evoca tirzepatida) nao entrou em campo nenhum
--   desta migration.
--
-- O QUE NAO FAZ: nao toca em formula_compositions, ingredients, warnings, compliance_*,
-- target_audience, metadata nem em nenhuma outra coluna de public.formulas; nao apaga
-- nada; nao cria coluna, tabela de negocio ou trigger; nao mexe em nenhuma outra migration
-- (em especial NAO toca em 20260922000000_reformulacao_conforme_normas.sql, que trata de
-- outro assunto - composicao/normas - e estava sendo editada por outro processo enquanto
-- esta migration foi escrita). Os triggers ja existentes trg_formulas_touch/
-- trg_formulas_audit cuidam de updated_at/updated_by/version/audit_logs nos UPDATE abaixo.
--
-- BACKUP: private.formulas_backup_20260922100000 guarda id, slug, name, list_price_cents e
-- updated_at das 18 formulas efetivamente alteradas por esta migration (as outras 6 nao
-- tem o que reverter, porque nada muda nelas). Schema private ja existe desde
-- 20260909210000_schema.sql (linha 40, "create schema if not exists private"); o "create
-- schema if not exists" abaixo e so defensivo.
--
-- REVERSAO (manual, pelo dono do banco, depois de aplicar):
--   update public.formulas f
--   set name = b.name, list_price_cents = b.list_price_cents
--   from private.formulas_backup_20260922100000 b
--   where b.id = f.id;
--
-- IDEMPOTENTE: rodar de novo repete o mesmo resultado (os UPDATE sao absolutos, nao
-- incrementais; o backup so insere linhas que ainda nao tem copia, pelo id; a guarda de
-- partida aceita tanto o estado original quanto o estado final ja aplicado - ver secao 0).
--
-- APLICACAO: este arquivo so foi criado em disco. NAO foi aplicado em nenhum banco (sem
-- `supabase db push`, sem commit). A sintaxe foi conferida com o parser do PostgreSQL
-- (libpg_query, via pglast), sem conexao a banco nenhum. Quem aplica e o dono, depois de
-- revisar a lista do RT (nomes com alegacao) e a lista de ambiguos/gramatura.
-- =====================================================================================


-- -------------------------------------------------------------------------------------
-- 0. GUARDA - estado de partida das 24 formulas precisa ser exatamente o lido em 17/09
--    2026 (PostgREST, chave publica) em public.formulas do catalogo
--    (zjryrmqtumvaxdytvbbv), OU ja o estado final que esta migration produz (para poder
--    ser reaplicada em producao sem erro, caso ja tenha sido aplicada antes - reaplicar so
--    reafirma o mesmo UPDATE, que e absoluto). Qualquer estado que nao seja nem um nem
--    outro e desvio real (alguem mudou algo no meio) e aborta a transacao inteira.
--    Em focus-colina, multi-vitta-gestante-e-lactante-em-capsula, multivitaminico e
--    pre-treino-300-g o dono pediu guarda SO NO PRECO (nome_original/nome_final = null
--    nesses 4 linhas): o nome nao muda nesta migration, entao nao ha por que travar a
--    atualizacao de preco a uma foto exata do nome atual - só o preco importa aqui.
-- -------------------------------------------------------------------------------------

do $$
declare
    r         record;
    v_count   integer;
    v_name    text;
    v_price   integer;
    v_active  boolean;
    v_deleted timestamptz;
begin
    for r in
        select * from (values
            -- slug, nome_original, preco_original, nome_final, preco_final
            -- (nome_original/nome_final NULL = guarda so no preco, pedido do dono)
            ('bella-gummy-biotina-em-gummy',               'BELLA GUMMY (Biotina em Gummy)'::text,               3290, 'BELLA GUMMY (Biotina em Gummy)'::text,                              3290),
            ('biotina-em-capsula',                          'Biotina em Cápsula'::text,                            890, 'Bio Princess (Cabelo, pele e unha)'::text,                          1490),
            ('creatina-em-gummy-sabor-tutti-frutti',        'CREATINA EM GUMMY SABOR TUTTI-FRUTTI'::text,         3490, 'CREATINA EM GUMMY SABOR TUTTI-FRUTTI'::text,                        3490),
            ('creatina-gummy-sabor-frutas-vermelhas',       'CREATINA GUMMY SABOR FRUTAS VERMELHAS'::text,        3490, 'CREATINA EM GUMMY FRUTAS VERMELHAS'::text,                          3490),
            ('creatina-monohidratada-150g-soluvel',         'CREATINA MONOIDRATADA 150 g SOLÚVEL'::text,          2000, 'Creatina Monohidratada Solúvel - Pote com 150 gramas'::text,        2000),
            ('creatina-monohidratada-300g-soluvel',         'CREATINA MONOIDRATADA 300 g SOLÚVEL'::text,          2799, 'Creatina Monohidratada Solúvel - Pote com 300 gramas'::text,        2799),
            ('detox-matinal-lemon-shot-300g',               'Detox Matinal (Lemon Shot) - 300g'::text,            2300, 'Shot Matinal 300 gramas'::text,                                     2300),
            ('dores-musculares',                            'DORES MUSCULARES'::text,                             1400, 'ArtFlex'::text,                                                     1380),
            ('emagrecedor-em-capsula',                      'Emagrecedor Em Cápsula'::text,                       1190, 'Emagrecedor Em Cápsula'::text,                                      1190),
            ('focus-colina',                                null::text,                                           1890, null::text,                                                          1688),
            ('melatonina-em-gummy-sabor-uva',               'Melatonina em Gummy Sabor Uva'::text,                3190, 'Melatonina em Gummy Sabor Uva'::text,                               3190),
            ('melatonina-triptofanos-encapsulados',         'Melatonina + Triptofanos (Encapsulados)'::text,      1490, 'Melatonina + Triptofanos (Encapsulados)'::text,                     1490),
            ('moro-slim',                                   'MORO SLIM'::text,                                    1950, 'MORO SLIM'::text,                                                   1950),
            ('multi-vitta-gestante-e-lactante-em-capsula',  null::text,                                           1380, null::text,                                                          1232),
            ('multivitaminico',                             null::text,                                          1820, null::text,                                                           1638),
            ('omega-pro-tg',                                'Ômega Pró TG'::text,                                 2590, 'Ômega Pró TG'::text,                                                2590),
            ('pre-treino-300-g',                            null::text,                                          4300, null::text,                                                           4400),
            ('pre-treino-creatina-sabor-limao-420g',        'Pré-treino + Creatina Sabor Limão (420 g)'::text,    4000, 'Pré-treino + Creatina Sabor Limão (420 g)'::text,                   4000),
            ('pro-energy',                                  'Pro Energy'::text,                                   1690, 'Pro Energy'::text,                                                  1120),
            ('saude-intestinal',                            'Saúde Intestinal'::text,                             2290, 'Saúde Intestinal'::text,                                            2290),
            ('serena',                                      'Serena'::text,                                       1700, 'Serena'::text,                                                       806),
            ('shot-colageno-300-gramas',                    'SHOT + COLÁGENO 300 GRAMAS'::text,                   4190, 'SHOT + COLÁGENO'::text,                                             5342),
            ('slim-up-emagrecimento-em-gota',               'Slim Up - EMAGRECIMENTO EM GOTA'::text,              1280, 'Slim Up - EMAGRECIMENTO EM GOTA'::text,                              901),
            ('zma-zinco-magnesio-e-vitamina-d',             'ZMA (Zinco, Magnésio e Vitamina B6)'::text,          1650, 'ZMA'::text,                                                          1480)
        ) as e(slug, nome_original, preco_original, nome_final, preco_final)
    loop
        select count(*) into v_count
        from public.formulas f
        where f.slug = r.slug;

        if v_count <> 1 then
            raise exception 'esperada exatamente 1 formula com slug %, encontrada(s) %', r.slug, v_count;
        end if;

        select f.name, f.list_price_cents, f.active, f.deleted_at
          into v_name, v_price, v_active, v_deleted
        from public.formulas f
        where f.slug = r.slug;

        if v_deleted is not null or not v_active then
            raise exception 'formula % deveria estar ativa e nao excluida (active=%, deleted_at=%)',
                r.slug, v_active, v_deleted;
        end if;

        if r.nome_original is null then
            -- guarda so no preco (pedido do dono para os 4 que nao mudam de nome)
            if v_price is distinct from r.preco_original and v_price is distinct from r.preco_final then
                raise exception 'preco de % nao bate nem com o ponto de partida (%) nem com o estado final desta migration (%); encontrado % - ha desvio real, abortando',
                    r.slug, r.preco_original, r.preco_final, v_price;
            end if;
        else
            if not (
                (v_name is not distinct from r.nome_original and v_price is not distinct from r.preco_original)
                or
                (v_name is not distinct from r.nome_final and v_price is not distinct from r.preco_final)
            ) then
                raise exception 'estado de % nao bate nem com o ponto de partida (name=% / list_price_cents=%) nem com o estado final desta migration (name=% / list_price_cents=%); encontrado name=% / list_price_cents=% - ha desvio real, abortando',
                    r.slug, r.nome_original, r.preco_original, r.nome_final, r.preco_final, v_name, v_price;
            end if;
        end if;
    end loop;
end $$;


-- -------------------------------------------------------------------------------------
-- 1. BACKUP - copia fiel das 18 linhas que esta migration altera, no schema private
-- -------------------------------------------------------------------------------------

create schema if not exists private;

create table if not exists private.formulas_backup_20260922100000 as
select f.id, f.slug, f.name, f.list_price_cents, f.updated_at, now() as backed_up_at
from public.formulas f
where false;

comment on table private.formulas_backup_20260922100000 is 'Copia de id/slug/name/list_price_cents/updated_at das 18 formulas alteradas pela migration 20260922100000_nomes_e_precos_da_calculadora.sql, gravada imediatamente antes da troca. Serve para reverter (ver cabecalho da migration). Nao exposta pela API (schema private).';

insert into private.formulas_backup_20260922100000
select f.id, f.slug, f.name, f.list_price_cents, f.updated_at, now()
from public.formulas f
where f.slug in (
    'biotina-em-capsula',
    'creatina-gummy-sabor-frutas-vermelhas',
    'creatina-monohidratada-150g-soluvel',
    'creatina-monohidratada-300g-soluvel',
    'detox-matinal-lemon-shot-300g',
    'dores-musculares',
    'focus-colina',
    'melatonina-em-gummy-sabor-uva',
    'melatonina-triptofanos-encapsulados',
    'moro-slim',
    'multi-vitta-gestante-e-lactante-em-capsula',
    'multivitaminico',
    'pre-treino-300-g',
    'pro-energy',
    'serena',
    'shot-colageno-300-gramas',
    'slim-up-emagrecimento-em-gota',
    'zma-zinco-magnesio-e-vitamina-d'
)
  and f.deleted_at is null
  and not exists (
      select 1 from private.formulas_backup_20260922100000 b where b.id = f.id
  );


-- -------------------------------------------------------------------------------------
-- 2. ATUALIZACOES - uma por produto que realmente muda, na ordem da tabela-mestre do
--    inventario (secao 4). 18 UPDATE ao todo; os outros 6 produtos ficam so em comentario.
-- -------------------------------------------------------------------------------------

-- 1) bella-gummy-biotina-em-gummy: SEM UPDATE. Mapeamento AMBIGUO (inventario secao 5.1) -
-- os dois candidatos da calculadora sao rascunhos-esqueleto com so 1 insumo real cada;
-- nome e preco ficam como estao ate o dono/RT decidirem.

-- 2) biotina-em-capsula: nome CONFIRMADO pelo dono (calc "Bio Princess (Cabelo, pele e
-- unha)", neutro - nao promete tratar nada, so descreve categoria cosmetica); registro
-- calc id 54328370-0605-4d10-a068-6890e9ba4c31, cliente "Catálogo Lemon", atualizado
-- 14/09/2026; preco de venda R$ 14,90.
update public.formulas
set name = 'Bio Princess (Cabelo, pele e unha)',
    list_price_cents = 1490
where slug = 'biotina-em-capsula'
  and deleted_at is null;

-- 3) creatina-gummy-sabor-frutas-vermelhas: nome da calculadora, PROPOSTO forte, sem
-- alegacao; registro calc id 48748c87-8d97-44dd-973f-8b4f1e3e539f, cliente LEMON CAPS -
-- CATÁLOGO; preco ja batia (R$ 34,90) - linha gerada para documentar a origem.
update public.formulas
set name = 'CREATINA EM GUMMY FRUTAS VERMELHAS',
    list_price_cents = 3490
where slug = 'creatina-gummy-sabor-frutas-vermelhas'
  and deleted_at is null;

-- 4) creatina-em-gummy-sabor-tutti-frutti: SEM UPDATE (correcao do dono). Nome da
-- calculadora e "CREATINA EM GUMMY SABOR TUTFRUT" - abreviacao de ficha interna, nao nome
-- comercial (regra 5) - mantem "CREATINA EM GUMMY SABOR TUTTI-FRUTTI"; preco ja bate ao
-- centavo (R$ 34,90 = R$ 34,90) - nada a gravar. Registro calc id
-- 3f84ff9a-fe19-4fae-9f9d-acad892719da, cliente LEMON CAPS - CATÁLOGO.

-- 5) creatina-monohidratada-150g-soluvel: nome da calculadora; registro calc id
-- 1d2cba0a-7df8-497a-ae93-0124fdfe3ee2, cliente LEMON CAPS - FÓRMULAS DO CATÁLOGO.; preco
-- ja batia (R$ 20,00) - linha gerada para documentar a origem.
update public.formulas
set name = 'Creatina Monohidratada Solúvel - Pote com 150 gramas',
    list_price_cents = 2000
where slug = 'creatina-monohidratada-150g-soluvel'
  and deleted_at is null;

-- 6) creatina-monohidratada-300g-soluvel: nome da calculadora; registro calc id
-- 36d481b8-6c8d-4d3b-ab91-50dfd63f099a, cliente LEMON CAPS - CATÁLOGO; preco ja batia
-- (R$ 27,99) - linha gerada para documentar a origem.
update public.formulas
set name = 'Creatina Monohidratada Solúvel - Pote com 300 gramas',
    list_price_cents = 2799
where slug = 'creatina-monohidratada-300g-soluvel'
  and deleted_at is null;

-- 7) detox-matinal-lemon-shot-300g: nome da calculadora; gramatura bate (300g = 300g, ao
-- contrario do rascunho descartado "Detox (Shot Matinal) - 150g" citado no inventario);
-- registro calc id 1fc783cc-9681-4d91-8526-67a28fa69d59, cliente LEMON CAPS - CATÁLOGO,
-- atualizado 28/08/2026 (o mais recente); preco ja batia (R$ 23,00) - linha gerada para
-- documentar a origem.
update public.formulas
set name = 'Shot Matinal 300 gramas',
    list_price_cents = 2300
where slug = 'detox-matinal-lemon-shot-300g'
  and deleted_at is null;

-- 8) dores-musculares: nome ATUAL tem alegacao de saude ("Dores Musculares"); nome da
-- calculadora e neutro ("ArtFlex", CONFIRMADO pelo dono) - troca e melhoria, regra (1) do
-- dono; registro calc id a54ab6c3-aeac-4a0b-afdf-7ee5f5c39a13, cliente LEMON CAPS -
-- CATÁLOGO, atualizado 12/08/2026; preco de venda R$ 13,80.
update public.formulas
set name = 'ArtFlex',
    list_price_cents = 1380
where slug = 'dores-musculares'
  and deleted_at is null;

-- 9) emagrecedor-em-capsula: SEM UPDATE. Nome tem alegacao ("Emagrecedor") nos dois lados
-- (atual "Emagrecedor Em Cápsula" e calc "Emagrecedor em Cápsula (Linha Standart -
-- 18/05)") - regra do dono manda manter e listar para o RT; a calculadora nao tem
-- precificacao cadastrada para esta formula (registro calc id
-- da3738cb-7c87-4292-843e-0c0fa3add910).

-- 10) focus-colina: SO PRECO (correcao do dono). Nome da calculadora e "FOCO 60 CÁPSULAS -
-- LEMON CAPS  PREMIUM" - texto de ficha interna (regra 5), mantem "FOCUS COLINA"; preco da
-- calculadora R$ 16,88 (era R$ 18,90) - este continua mudando, so o nome nao. Registro
-- calc id d2d3277f-adb5-43a5-adf0-c41e3e4c1d13, cliente LEMON CAPS - CATÁLOGO.
update public.formulas
set list_price_cents = 1688
where slug = 'focus-colina'
  and deleted_at is null;

-- 11) melatonina-triptofanos-encapsulados: nome MANTIDO - a calculadora traz "Sono/
-- Ansiedade - Melatonina+Triptofanos" (alegacao de saude no nome, achado ja conhecido -
-- este card tambem foi bloqueado na conferencia ANVISA de 17/09/2026 por outros motivos,
-- ver AUDITORIA-ROTULO-VS-ANVISA); decisao do dono/RT, nao renomeio; registro calc id
-- 3c0a17d8-cae1-49f6-b507-3c2ff41795c6, cliente CATÁLOGO - LEMON CAPS, atualizado hoje
-- 17/09/2026; preco ja batia (R$ 14,90) - linha gerada para documentar a origem.
update public.formulas
set list_price_cents = 1490
where slug = 'melatonina-triptofanos-encapsulados'
  and deleted_at is null;

-- 12) melatonina-em-gummy-sabor-uva: nome ja e IDENTICO ao da calculadora - nada a mudar
-- no nome; registro calc id 4fb741c2-f34b-4ff5-a132-9b5b0dd01448, cliente LEMON CAPS -
-- CATÁLOGO, atualizado hoje 17/09/2026; preco ja batia (R$ 31,90) - linha gerada para
-- documentar a origem.
update public.formulas
set list_price_cents = 3190
where slug = 'melatonina-em-gummy-sabor-uva'
  and deleted_at is null;

-- 13) moro-slim: nome MANTIDO - a calculadora traz "Moro Slim (Emagrecimento em Cápsula -
-- Premium)" (alegacao "Emagrecimento"); decisao do dono/RT, nao renomeio; registro calc id
-- f2a3ae7f-443a-4eaf-a9d8-8c5c92218444, cliente LEMON CAPS - CATÁLOGO; preco ja batia
-- (R$ 19,50) - linha gerada para documentar a origem.
update public.formulas
set list_price_cents = 1950
where slug = 'moro-slim'
  and deleted_at is null;

-- 14) multi-vitta-gestante-e-lactante-em-capsula: SO PRECO (correcao do dono). Nome da
-- calculadora e "Multi Vita - GESTANTE E LACTANTE EM CÁPSULA LINHA ECONÔMICA FINAL" - "LINHA
-- ECONÔMICA FINAL" e texto de ficha/linha de custo interna (regra 5), mantem "Multi Vitta -
-- Gestante e Lactante em Cápsula"; preco da calculadora R$ 12,32 (era R$ 13,80) - este
-- continua mudando. Registro calc id e5d23dcd-bc5f-4614-96fb-b88d786a8923, cliente LEMON
-- CAPS - CATÁLOGO.
update public.formulas
set list_price_cents = 1232
where slug = 'multi-vitta-gestante-e-lactante-em-capsula'
  and deleted_at is null;

-- 15) multivitaminico: SO PRECO (correcao do dono). Nome da calculadora e
-- "MULTIVITAMINICO" - caixa alta sem acento, grafia de ficha interna, nao pronta para card
-- publico (regra 5), mantem "Multivitamínico"; preco da calculadora R$ 16,38 (era
-- R$ 18,20) - este continua mudando. Registro calc id
-- 5a60d852-6cd3-4ed8-89ea-28ad14c74f96, cliente LEMON CAPS - CATÁLOGO.
update public.formulas
set list_price_cents = 1638
where slug = 'multivitaminico'
  and deleted_at is null;

-- 16) omega-pro-tg: SEM UPDATE (correcao do dono). Nome da calculadora e "OMEGA 3
-- (Softgel)" - caixa alta sem acento, texto de ficha interna (regra 5), mantem "Ômega Pró
-- TG"; preco ja bate ao centavo (R$ 25,90 = R$ 25,90) - nada a gravar, nem preco nem nome.
-- Registro calc id 9a2f0c78-34cb-4889-90a4-71e22680e657, cliente LEMON CAPS - CATÁLOGO.

-- 17) pre-treino-creatina-sabor-limao-420g: SEM UPDATE. A calculadora chama o produto de
-- "FICHA TÉCNICA PRÉ TREINO + CREATINA 300 G SABOR LIMÃO   - LEMONCAPS PREMIUM" (registro
-- calc id 04d2dcae-050b-4231-abb2-bcdd7d9f59f9, cliente LEMON CAPS - CATÁLOGO) - "300 G"
-- diverge do "420 g" do produto do catalogo - divergencia de fato, nao de nome; regra (3)
-- do dono, nao renomeio, listo para o dono. Tambem sem precificacao cadastrada na
-- calculadora para esta formula.

-- 18) pre-treino-300-g: SO PRECO (correcao do dono). Nome da calculadora e so "PRÉ
-- TREINO", sem o "300 G" que o catalogo tem hoje - omissao de gramatura relevante, texto
-- de ficha (regra 5), mantem "PRÉ TREINO 300 G"; preco da calculadora R$ 44,00 (era
-- R$ 43,00) - este continua mudando. Registro calc id
-- 679683e9-4d17-44d0-a967-2aa61d271017, cliente LEMON CAPS - CATÁLOGO (existem 3 outras
-- formulas chamadas "PRÉ TREINO" na calculadora, de outros clientes - Kilson, GRA, LEMON -
-- com precos diferentes; nao sao este produto).
update public.formulas
set list_price_cents = 4400
where slug = 'pre-treino-300-g'
  and deleted_at is null;

-- 19) pro-energy: nome MANTIDO - a calculadora traz "PRO ENERGY (ESTIMULANTE SEXUAL -
-- Encapsulado - PREMIUM)" (alegacao "ESTIMULANTE SEXUAL"); decisao do dono/RT, nao
-- renomeio; registro calc id aa254d22-0c09-496a-81cb-7c4fe7531795, cliente LEMON CAPS -
-- CATÁLOGO; preco de venda R$ 11,20, confirmado pelo dono.
update public.formulas
set list_price_cents = 1120
where slug = 'pro-energy'
  and deleted_at is null;

-- 20) saude-intestinal: SEM UPDATE. Mapeamento AMBIGUO (inventario secao 5.20) - o
-- candidato mais parecido por nome ("INTESTINO", calc id 95d4f2aa-25fa-4d14-b11f-
-- 2978cd1b0e91) tem perfil de insumo dominante completamente diferente do que o catalogo
-- declara - risco real de troca de composicao, nao decido; nome e preco ficam como estao
-- ate o dono confirmar qual composicao e a real.

-- 21) serena: nome MANTIDO - o registro-referencia da calculadora para a COMPOSICAO e
-- "SONO EM LÍQUIDO FRASCO COM 30 MLS" (calc id 68f203fd-3ef2-4f5f-a9f8-7e4933163843,
-- cliente LEMON CAPS - CATÁLOGO), que traz "SONO" no nome (alegacao); decisao do dono/RT,
-- nao renomeio. PRECO = R$ 8,06, confirmado pelo dono - esse valor pertence a variante
-- "SERENA (30/06)" (calc id 814b5dc6-9425-41ba-b735-f8a436b4072f, mesmo cliente, mesmos 5
-- insumos e mesmas doses da escolhida para composicao), NAO ao preco proprio do registro
-- "SONO EM LÍQUIDO..." (que e R$ 12,84).
update public.formulas
set list_price_cents = 806
where slug = 'serena'
  and deleted_at is null;

-- 22) shot-colageno-300-gramas: nome da calculadora, sem o "300 GRAMAS" que o catalogo tem
-- hoje (omissao, nao conflito de gramatura); registro calc id d2e0ff25-7d9c-4f80-a5ee-
-- 35a17a742b81, cliente LEMON CAPS - CATÁLOGO, atualizado 19/08/2026 15:27 (a copia de
-- COMPOSICAO CORRETA). PRECO: decisao do dono apos o ACHADO no cabecalho - usa
-- `precificacoes.preco_venda` deste MESMO registro (d2e0ff25), R$ 53,42, e nao o R$ 41,90
-- que pertence a outra copia (corrompida) da mesma formula.
update public.formulas
set name = 'SHOT + COLÁGENO',
    list_price_cents = 5342
where slug = 'shot-colageno-300-gramas'
  and deleted_at is null;

-- 23) slim-up-emagrecimento-em-gota: nome MANTIDO - alegacao "Emagrecimento" nos dois
-- lados (atual "Slim Up - EMAGRECIMENTO EM GOTA" e calc "Slim Up - EMAGRECIMENTO EM GOTAS
-- LINHA ECONÔMICA FINAL"); decisao do dono/RT, nao renomeio; registro calc id
-- 5da54ed6-d75e-4d72-a556-d04212984918, cliente LEMON CAPS - CATÁLOGO; preco de venda
-- R$ 9,01, confirmado pelo dono. (Candidato "TIRZ" descartado para este mesmo card no
-- inventario nunca foi usado em campo nenhum desta migration - evoca tirzepatida.)
update public.formulas
set list_price_cents = 901
where slug = 'slim-up-emagrecimento-em-gota'
  and deleted_at is null;

-- 24) zma-zinco-magnesio-e-vitamina-d: nome da calculadora, so "ZMA"; registro calc id
-- 361db703-011c-4521-9704-0f215d9e22fd, cliente LEMON CAPS - CATÁLOGO (existe 2a copia
-- identica em outro cliente, sem precificacao - nao usada); preco de venda R$ 14,80.
update public.formulas
set name = 'ZMA',
    list_price_cents = 1480
where slug = 'zma-zinco-magnesio-e-vitamina-d'
  and deleted_at is null;


-- -------------------------------------------------------------------------------------
-- 3. GUARDA FINAL
--    3a. As 18 formulas com UPDATE tem que estar exatamente no estado esperado - linhas
--        afetadas esperadas = numero de produtos com algum UPDATE = 18.
--    3b. As 6 formulas que ficaram de fora tem que continuar exatamente como estavam
--        (prova complementar de que a migration nao tocou nelas por engano - contagem
--        separada, nao entra nas "linhas afetadas" de 3a).
-- -------------------------------------------------------------------------------------

do $$
declare
    r          record;
    v_name     text;
    v_price    integer;
    v_ok_count integer := 0;
    v_esperado constant integer := 18;
begin
    for r in
        select * from (values
            ('biotina-em-capsula',                          'Bio Princess (Cabelo, pele e unha)',                                1490),
            ('creatina-gummy-sabor-frutas-vermelhas',       'CREATINA EM GUMMY FRUTAS VERMELHAS',                                3490),
            ('creatina-monohidratada-150g-soluvel',         'Creatina Monohidratada Solúvel - Pote com 150 gramas',              2000),
            ('creatina-monohidratada-300g-soluvel',         'Creatina Monohidratada Solúvel - Pote com 300 gramas',              2799),
            ('detox-matinal-lemon-shot-300g',               'Shot Matinal 300 gramas',                                           2300),
            ('dores-musculares',                            'ArtFlex',                                                           1380),
            ('focus-colina',                                'FOCUS COLINA',                                                      1688),
            ('melatonina-em-gummy-sabor-uva',               'Melatonina em Gummy Sabor Uva',                                     3190),
            ('melatonina-triptofanos-encapsulados',         'Melatonina + Triptofanos (Encapsulados)',                           1490),
            ('moro-slim',                                   'MORO SLIM',                                                         1950),
            ('multi-vitta-gestante-e-lactante-em-capsula',  'Multi Vitta - Gestante e Lactante em Cápsula',                      1232),
            ('multivitaminico',                             'Multivitamínico',                                                   1638),
            ('pre-treino-300-g',                            'PRÉ TREINO 300 G',                                                  4400),
            ('pro-energy',                                  'Pro Energy',                                                        1120),
            ('serena',                                      'Serena',                                                             806),
            ('shot-colageno-300-gramas',                    'SHOT + COLÁGENO',                                                   5342),
            ('slim-up-emagrecimento-em-gota',               'Slim Up - EMAGRECIMENTO EM GOTA',                                    901),
            ('zma-zinco-magnesio-e-vitamina-d',             'ZMA',                                                               1480)
        ) as e(slug, nome_final_esperado, preco_final_esperado)
    loop
        select f.name, f.list_price_cents
          into v_name, v_price
        from public.formulas f
        where f.slug = r.slug
          and f.deleted_at is null;

        if not found then
            raise exception 'formula % nao encontrada (ativa) apos a migration', r.slug;
        end if;

        if v_name is distinct from r.nome_final_esperado or v_price is distinct from r.preco_final_esperado then
            raise exception 'estado final incorreto para % - esperado name=% / list_price_cents=%; encontrado name=% / list_price_cents=%',
                r.slug, r.nome_final_esperado, r.preco_final_esperado, v_name, v_price;
        end if;

        v_ok_count := v_ok_count + 1;
    end loop;

    if v_ok_count <> v_esperado then
        raise exception 'guarda final (3a): esperadas % formulas com UPDATE conferidas, conferidas %', v_esperado, v_ok_count;
    end if;
end $$;

do $$
declare
    r          record;
    v_name     text;
    v_price    integer;
    v_ok_count integer := 0;
    v_esperado constant integer := 6;
begin
    for r in
        select * from (values
            ('bella-gummy-biotina-em-gummy',                'BELLA GUMMY (Biotina em Gummy)',   3290),
            ('creatina-em-gummy-sabor-tutti-frutti',        'CREATINA EM GUMMY SABOR TUTTI-FRUTTI', 3490),
            ('emagrecedor-em-capsula',                      'Emagrecedor Em Cápsula',            1190),
            ('omega-pro-tg',                                'Ômega Pró TG',                       2590),
            ('pre-treino-creatina-sabor-limao-420g',        'Pré-treino + Creatina Sabor Limão (420 g)', 4000),
            ('saude-intestinal',                            'Saúde Intestinal',                  2290)
        ) as e(slug, nome_esperado, preco_esperado)
    loop
        select f.name, f.list_price_cents
          into v_name, v_price
        from public.formulas f
        where f.slug = r.slug
          and f.deleted_at is null;

        if not found then
            raise exception 'formula % (fora desta migration) nao encontrada (ativa) apos a migration', r.slug;
        end if;

        if v_name is distinct from r.nome_esperado or v_price is distinct from r.preco_esperado then
            raise exception 'formula % deveria continuar intocada - esperado name=% / list_price_cents=%; encontrado name=% / list_price_cents=%',
                r.slug, r.nome_esperado, r.preco_esperado, v_name, v_price;
        end if;

        v_ok_count := v_ok_count + 1;
    end loop;

    if v_ok_count <> v_esperado then
        raise exception 'guarda final (3b): esperadas % formulas intocadas conferidas, conferidas %', v_esperado, v_ok_count;
    end if;
end $$;
