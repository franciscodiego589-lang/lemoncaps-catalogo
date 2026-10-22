-- =====================================================================================
-- LEMON CAPS - CATALOGO PUBLICO
-- 20260917000000_corrige_selo_conformidade.sql - corrige o selo de conformidade ANVISA
-- em public.formulas depois de um UPDATE indevido, restaurando o estado documentado nas
-- duas migrations anteriores.
--
-- CONTEXTO - o que estava certo ate 12/09/2026:
-- A migration 20260914000000_conformidade.sql criou as 3 colunas (compliance_verified_at,
-- compliance_norms, compliance_source) e marcou 10 formulas 100% conformes, data
-- 2026-09-12 00:00:00-04:00. A migration 20260915140000_conformidade_laudos.sql marcou
-- mais 4 formulas (ZMA, ZMA Night, BIOPRINCESS, Biotina em Capsula), data
-- 2026-09-12 20:00:00-04:00, depois de localizar laudo de teor para converter sal/quelato
-- em elemento. TOTAL DOCUMENTADO E AUTORIZADO A TER SELO: 14 formulas, nem uma a mais.
--
-- O QUE ACONTECEU DEPOIS (relatado para esta correcao, nao reconferido ao vivo por esta
-- migration - este arquivo so corrige dados, nao consulta o banco):
-- Em 13/09/2026 as 15:54:28 UTC, um UPDATE em massa executado por fora do aplicativo
-- (service role, autor nulo no log de auditoria) carimbou compliance_verified_at de 19
-- formulas de uma vez so. Efeito duplo:
--   (A) 9 formulas GANHARAM selo sem nenhum lastro documentado. O documento
--       lemoncaps-catalogo-planejamento/conformidade-anvisa.md (secao 6) classifica essas
--       9 como "sem nenhuma violacao confirmada, mas com pelo menos um insumo NAO
--       VERIFICADO" - nunca como conformes. Nomes (aqui so para registro/auditoria; a
--       correcao abaixo NAO lista essas 9 nominalmente, ver decisao mais adiante):
--         Emagrecedor Em Capsula
--         Melatonina + Triptofanos (Encapsulados)
--         PRE TREINO 300 G
--         Pro Energy
--         SHOT + COLAGENO 300 GRAMAS
--         Saude Intestinal
--         Slim Up - EMAGRECIMENTO EM GOTA
--         Slim Up - Emagrecedor em Gota
--         Omega Pro TG
--   (B) as 10 formulas legitimas da primeira migration tiveram compliance_verified_at e
--       compliance_source SOBRESCRITOS pelo mesmo carimbo - perderam a data e a fonte
--       originais e documentadas (2026-09-12 00:00:00-04:00 e a URL do AnvisaLegis).
-- As 4 formulas da segunda migration NAO foram tocadas por esse UPDATE e continuam
-- corretas - mesmo assim, esta migration as reafirma (idempotente) para fechar as 14 num
-- unico lugar auditavel.
--
-- ESTADO DO BANCO ANTES DESTA MIGRATION (relatado, idem acima - nao reconferido ao vivo
-- por esta migration): 23 formulas com compliance_verified_at preenchido. Deveriam ser 14.
--
-- DECISAO (nao alterar sem ordem expressa do dono): o selo publico "Composicao conferida"
-- so pode existir nas 14 formulas com auditoria documentada nas duas migrations acima.
-- Qualquer formula fora dessas 14 perde o selo, mesmo que o motivo do carimbo indevido
-- nao seja exatamente o incidente de 13/09 descrito aqui - por isso o passo 1 abaixo zera
-- por EXCLUSAO (id not in <14 autorizadas>) e nao cita as 9 nominalmente: o resultado
-- final fica correto mesmo que alguma outra formula (nao so essas 9) tenha sido carimbada
-- indevidamente depois desta auditoria.
--
-- O QUE ESTA MIGRATION FAZ, NESTA ORDEM:
--   1. Zera as 3 colunas (NULL) em toda formula fora da lista das 14 autorizadas.
--   2. Restaura as 10 formulas da migration 20260914000000_conformidade.sql para os
--      valores exatos documentados la - mesma data, mesma URL, e o array de normas
--      PROPRIO de cada formula (copiado um a um da migration original).
--   3. Restaura as 4 formulas da migration 20260915140000_conformidade_laudos.sql para os
--      valores documentados la - idempotente, tanto faz se ja estavam certas.
--   4. Confere no final: exatamente 14 formulas com selo, e nenhuma das 14 com normas ou
--      fonte nulas.
--
-- FONTE DOS DADOS: os 14 UUIDs, as 2 datas, a URL de compliance_source e os arrays de
-- compliance_norms usados abaixo foram copiados literalmente das migrations
-- 20260914000000_conformidade.sql e 20260915140000_conformidade_laudos.sql - nenhum dado
-- foi suposto ou inventado nesta migration. Esta migration so corrige dados (UPDATE), nao
-- cria nem remove coluna, tabela ou trigger.
--
-- APLICACAO: este arquivo so foi criado. A aplicacao no banco de producao e feita
-- manualmente pelo dono, depois de revisar.
-- =====================================================================================


-- ---------------------------------------------------------------------------------
-- 1. ZERA O SELO DE TODA FORMULA FORA DAS 14 AUTORIZADAS
-- ---------------------------------------------------------------------------------
-- Por exclusao, nao lista as 9 formulas carimbadas indevidamente - assim o resultado
-- fica correto mesmo que outra formula (alem dessas 9) tenha ganhado selo por engano
-- depois desta auditoria. A mesma lista de 14 UUIDs reaparece nos passos 2, 3 e 4 -
-- conferida uma a uma contra as duas migrations de origem.

update public.formulas
set
    compliance_verified_at = null,
    compliance_norms       = null,
    compliance_source      = null
where id not in (
    -- as 10 da migration 20260914000000_conformidade.sql
    '49c6fc44-ccdc-4c56-9e9b-81be4f509403'::uuid, -- BELLA GUMMY (Biotina em Gummy)
    'dc17b5db-4f49-496b-b0e9-4cefe93f3058'::uuid, -- CREATINA EM GUMMY SABOR TUTTI-FRUTTI
    'bffe9877-1bf6-4733-b627-a75de04e63c9'::uuid, -- CREATINA GUMMY SABOR FRUTAS VERMELHAS
    'cf7a74c7-9585-4c29-9c82-c9f7b81831a5'::uuid, -- CREATINA MONOHIDRATADA 150g SOLUVEL
    '8e8b8937-8aa1-4929-8b34-5b484bb3412c'::uuid, -- CREATINA MONOHIDRATADA 300g SOLUVEL
    'a93b61c5-babe-476e-b272-1b576324d8b9'::uuid, -- DORES MUSCULARES
    '5e159209-e227-4ee8-911b-3262f8beffc9'::uuid, -- FOCUS COLINA
    'f32a62b6-4089-4995-b241-4607114860d3'::uuid, -- Melatonina em Gumy Sabor Uva
    '32e66012-fb3d-4d99-b425-a2b850b755a8'::uuid, -- Multivitaminico
    '07e1ee0c-c314-4c33-a440-0aa47bd4fdb1'::uuid, -- Serena

    -- as 4 da migration 20260915140000_conformidade_laudos.sql
    'b72df9a1-d603-477b-be24-2686121929ea'::uuid, -- ZMA (Zinco, Magnesio e Vitamina B6)
    '3519aa71-676e-49f6-8cd4-edb65baa458a'::uuid, -- ZMA Night
    '0adc783d-202d-4f6c-8501-3b77f8b47761'::uuid, -- BIOPRINCESS
    'f0b96d75-b18f-4c77-846c-3cb905273f64'::uuid -- Biotina em Capsula
);


-- ---------------------------------------------------------------------------------
-- 2. RESTAURA AS 10 FORMULAS DE 20260914000000_conformidade.sql
-- ---------------------------------------------------------------------------------
-- Data, URL e compliance_norms identicos aos da migration original (copiados literalmente
-- de la, norms por formula, nao uma lista unica para todas).

update public.formulas as f
set
    compliance_verified_at = timestamptz '2026-09-12 00:00:00-04:00',
    compliance_norms       = v.norms,
    compliance_source      = 'https://anvisalegis.datalegis.net/action/ActionDatalegis.php?acao=abrirTextoAto&tipo=INM&numeroAto=00000028&seqAto=000&valorAno=2018&orgao=DC%2FANVISA%2FMS&codTipo=&desItem=&desItemFim=&cod_menu=9434&cod_modulo=310&pesquisa=true'
from (values
    -- BELLA GUMMY (Biotina em Gummy): vitamina C, E, zinco, vitamina A, biotina - todos
    -- IN 28/2018, Anexo III/IV (original), na Tabela 1.
    ('49c6fc44-ccdc-4c56-9e9b-81be4f509403'::uuid, array['IN 28/2018']),

    -- CREATINA EM GUMMY SABOR TUTTI-FRUTTI: creatina monoidratada 3000 mg - so fica
    -- dentro da faixa (3.000-5.000 mg) por causa da IN 373/2025.
    ('dc17b5db-4f49-496b-b0e9-4cefe93f3058'::uuid, array['IN 28/2018', 'IN 373/2025']),

    -- CREATINA GUMMY SABOR FRUTAS VERMELHAS: mesmo caso (creatina 3000 mg).
    ('bffe9877-1bf6-4733-b627-a75de04e63c9'::uuid, array['IN 28/2018', 'IN 373/2025']),

    -- CREATINA MONOHIDRATADA 150g SOLUVEL: creatina 5000 mg - so conforme por causa do
    -- teto novo (5.000 mg) da IN 373/2025.
    ('cf7a74c7-9585-4c29-9c82-c9f7b81831a5'::uuid, array['IN 28/2018', 'IN 373/2025']),

    -- CREATINA MONOHIDRATADA 300g SOLUVEL: mesmo caso.
    ('8e8b8937-8aa1-4929-8b34-5b484bb3412c'::uuid, array['IN 28/2018', 'IN 373/2025']),

    -- DORES MUSCULARES: MSM e colageno tipo II nao desnaturado (IN 76/2020); sulfato de
    -- glucosamina+KCl (IN 304/2024); demais insumos IN 28/2018 original.
    ('a93b61c5-babe-476e-b272-1b576324d8b9'::uuid, array['IN 28/2018', 'IN 76/2020', 'IN 304/2024']),

    -- FOCUS COLINA: L-teanina (IN 318/2024); L-carnitina e inositol (IN 76/2020); demais
    -- insumos originais.
    ('5e159209-e227-4ee8-911b-3262f8beffc9'::uuid, array['IN 28/2018', 'IN 76/2020', 'IN 318/2024']),

    -- Melatonina em Gumy Sabor Uva: melatonina (IN 102/2021, uso restrito a maiores de 19
    -- anos); L-triptofano original.
    ('f32a62b6-4089-4995-b241-4607114860d3'::uuid, array['IN 28/2018', 'IN 102/2021']),

    -- Multivitaminico: L-teanina (IN 318/2024); niacina no teto atual (IN 418/2025); boro
    -- e nomenclatura do minimo do acido folico (IN 76/2020 e IN 102/2021); demais insumos
    -- originais.
    ('32e66012-fb3d-4d99-b425-a2b850b755a8'::uuid, array['IN 28/2018', 'IN 76/2020', 'IN 102/2021', 'IN 318/2024', 'IN 418/2025']),

    -- Serena: inositol (IN 76/2020); L-teanina (IN 318/2024); melatonina (IN 102/2021);
    -- magnesio e vitamina B6 originais.
    ('07e1ee0c-c314-4c33-a440-0aa47bd4fdb1'::uuid, array['IN 28/2018', 'IN 76/2020', 'IN 102/2021', 'IN 318/2024'])
) as v(id, norms)
where f.id = v.id
  and f.deleted_at is null;


-- ---------------------------------------------------------------------------------
-- 3. RESTAURA AS 4 FORMULAS DE 20260915140000_conformidade_laudos.sql
-- ---------------------------------------------------------------------------------
-- Data (20h, nao 00h - segunda leva, mesmo dia), URL e compliance_norms identicos aos da
-- migration original. Idempotente: estas 4 nao foram tocadas pelo UPDATE indevido de
-- 13/09, entao rodar isto de novo so reafirma o que ja deveria estar certo.

update public.formulas as f
set
    compliance_verified_at = timestamptz '2026-09-12 20:00:00-04:00',
    compliance_norms       = v.norms,
    compliance_source      = 'https://anvisalegis.datalegis.net/action/ActionDatalegis.php?acao=abrirTextoAto&tipo=INM&numeroAto=00000028&seqAto=000&valorAno=2018&orgao=DC%2FANVISA%2FMS&codTipo=&desItem=&desItemFim=&cod_menu=9434&cod_modulo=310&pesquisa=true'
from (values
    -- ZMA (Zinco, Magnesio e Vitamina B6): magnesio (IN 28/2018), L-teanina (IN
    -- 318/2024), zinco (IN 28/2018), boro (IN 76/2020), vitamina B6 e vitamina D (IN
    -- 28/2018).
    ('b72df9a1-d603-477b-be24-2686121929ea'::uuid, array['IN 28/2018', 'IN 76/2020', 'IN 318/2024']),

    -- ZMA Night (Zinco + Magnesio + Vitamina B6): mesma composicao do ZMA, mesmas normas.
    ('3519aa71-676e-49f6-8cd4-edb65baa458a'::uuid, array['IN 28/2018', 'IN 76/2020', 'IN 318/2024']),

    -- BIOPRINCESS: silicio (IN 76/2020 inclusao + IN 102/2021 redacao do maximo), acido
    -- hialuronico (IN 76/2020 + IN 102/2021), niacina/B3 no teto atual (IN 418/2025),
    -- acido folico com nomenclatura do minimo pela IN 102/2021; demais insumos IN 28/2018
    -- original.
    ('0adc783d-202d-4f6c-8501-3b77f8b47761'::uuid, array['IN 28/2018', 'IN 76/2020', 'IN 102/2021', 'IN 418/2025']),

    -- Biotina em Capsula: mesma base da BIOPRINCESS, mais colageno hidrolisado (IN
    -- 102/2021).
    ('f0b96d75-b18f-4c77-846c-3cb905273f64'::uuid, array['IN 28/2018', 'IN 76/2020', 'IN 102/2021', 'IN 418/2025'])
) as v(id, norms)
where f.id = v.id
  and f.deleted_at is null;


-- ---------------------------------------------------------------------------------
-- 4. CONFERENCIA DE GUARDA FINAL
-- ---------------------------------------------------------------------------------
-- Duas checagens - regra de exatidao, nunca falhar calado:
--   a) exatamente 14 formulas com compliance_verified_at preenchido;
--   b) nenhuma das 14 autorizadas com compliance_norms ou compliance_source nulo.

do $$
declare
    v_count integer;
begin
    select count(*) into v_count
    from public.formulas
    where compliance_verified_at is not null;

    if v_count <> 14 then
        raise exception 'esperado exatamente 14 formulas com compliance_verified_at preenchido (10 de 20260914000000_conformidade.sql + 4 de 20260915140000_conformidade_laudos.sql), encontrado %', v_count;
    end if;
end $$;

do $$
declare
    v_count integer;
begin
    select count(*) into v_count
    from public.formulas
    where id in (
        '49c6fc44-ccdc-4c56-9e9b-81be4f509403'::uuid,
        'dc17b5db-4f49-496b-b0e9-4cefe93f3058'::uuid,
        'bffe9877-1bf6-4733-b627-a75de04e63c9'::uuid,
        'cf7a74c7-9585-4c29-9c82-c9f7b81831a5'::uuid,
        '8e8b8937-8aa1-4929-8b34-5b484bb3412c'::uuid,
        'a93b61c5-babe-476e-b272-1b576324d8b9'::uuid,
        '5e159209-e227-4ee8-911b-3262f8beffc9'::uuid,
        'f32a62b6-4089-4995-b241-4607114860d3'::uuid,
        '32e66012-fb3d-4d99-b425-a2b850b755a8'::uuid,
        '07e1ee0c-c314-4c33-a440-0aa47bd4fdb1'::uuid,
        'b72df9a1-d603-477b-be24-2686121929ea'::uuid,
        '3519aa71-676e-49f6-8cd4-edb65baa458a'::uuid,
        '0adc783d-202d-4f6c-8501-3b77f8b47761'::uuid,
        'f0b96d75-b18f-4c77-846c-3cb905273f64'::uuid
    )
    and (compliance_norms is null or compliance_source is null);

    if v_count <> 0 then
        raise exception 'encontrado % das 14 formulas autorizadas com compliance_norms ou compliance_source nulo (deveria ser 0)', v_count;
    end if;
end $$;
