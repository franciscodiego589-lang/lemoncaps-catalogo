-- =====================================================================================
-- LEMON CAPS - CATALOGO PUBLICO
-- 20260914000000_conformidade.sql - selo de conformidade ANVISA por formula.
--
-- Contexto: o dono pediu para publicar no catalogo "todos os produtos estao dentro dos
-- limites da ANVISA". Isso foi RECUSADO por ser falso - auditoria completa contra a
-- norma vigente (IN 28/2018 e alteracoes) esta em
-- lemoncaps-catalogo-planejamento/conformidade-anvisa.md (consulta em 12/09/2026, fontes
-- AnvisaLegis + LegisWeb, cruzadas). Das 28 formulas ativas: 10 sao 100% CONFORMES
-- (todo insumo com limite localizado e dentro da faixa), 4 tem insumo ACIMA do limite,
-- 14 dependem de insumo NAO VERIFICADO (extrato botanico sem laudo de padronizacao, ou
-- aditivo fora do escopo da IN 28/2018). A alternativa acordada: selo por produto so nos
-- 100% conformes, mais nota geral honesta no catalogo (ver Task 2, fora desta migration).
--
-- Esta migration so ACRESCENTA 3 colunas nullable em public.formulas (nenhuma tabela
-- nova, nenhum trigger novo - os triggers trg_formulas_touch/trg_formulas_audit ja
-- existem e ja disparam nos UPDATE abaixo) e marca APENAS as 10 formulas aprovadas.
-- Nenhuma outra formula e alterada por conta propria (ver achado da Biotina em Capsula
-- abaixo).
--
-- ACHADO ESPECIAL - "Biotina em Capsula": a auditoria (secao 2) datada de 12/09/2026
-- flagrou iodo (150 mg) e selenio (60 mg) desta formula ACIMA do limite em 163x/188x,
-- por erro de digitacao de unidade (mg em vez de mcg) - mesma leitura confirmada pela
-- formula-irma BIOPRINCESS, que declara os MESMOS numeros (150/60) corretamente em mcg.
-- Esse erro de unidade FOI CORRIGIDO no banco depois da auditoria. Reconferido ao vivo
-- via Management API nesta migration (13/09/2026... a mesma consulta que gerou esta
-- migration): iodo agora e 150 mcg e selenio 60 mcg, ambos CONFORMES (dentro de
-- 22,5-919,02 mcg e 8,25-319,75 mcg). Isso tira a Biotina em Capsula do grupo "ACIMA do
-- limite" - mas ela AINDA NAO entra no selo, porque continua tendo o insumo "silicio
-- organico (acido ortossilicico) 50 mg" como NAO VERIFICADO: a ANVISA limita silicio
-- ELEMENTAR (max. 15,67 mg/dia), nao o peso do composto, e o teor de silicio elementar
-- deste insumo nao consta no banco (mesmo caso, com o mesmo insumo, do "Siliciumax" da
-- BIOPRINCESS - por isso BIOPRINCESS tambem NAO esta entre os 10 conformes). Resultado:
-- Biotina em Capsula sai do grupo "acima do limite" e entra no grupo "sem violacao
-- confirmada, mas com insumo nao verificado" (mesmo grupo da BIOPRINCESS) - nao no grupo
-- "100% conforme". NAO recebe selo nesta migration.
--
-- NOTA SOBRE NORMA CITADA NO PEDIDO ORIGINAL: o pedido mencionava "RDC 243/2018" como
-- exemplo de norma a citar. Conferido: essa referencia NAO aparece em nenhum lugar do
-- arquivo de auditoria (grep -i "RDC" = zero ocorrencias). Por regra de exatidao (nunca
-- inventar numero de norma), esta migration cita SOMENTE o que o arquivo de auditoria
-- realmente traz: IN 28/2018 e as Instrucoes Normativas que a alteraram por insumo,
-- conforme a Tabela 1 do arquivo.
--
-- ORDEM DE EXECUCAO: depois de schema.sql, rls-policies.sql e ingredientes.sql (so
-- acrescenta coluna em tabela ja existente).
-- =====================================================================================


-- ---------------------------------------------------------------------------------
-- 1. COLUNAS NOVAS EM public.formulas
-- ---------------------------------------------------------------------------------

alter table public.formulas
    add column if not exists compliance_verified_at timestamptz,
    add column if not exists compliance_norms        text[],
    add column if not exists compliance_source        text;

comment on column public.formulas.compliance_verified_at is 'Data em que a composicao desta formula foi conferida contra os limites vigentes da ANVISA (IN 28/2018 e alteracoes) e considerada 100% conforme. NULL = nao verificada (nao afirmar nem sugerir conformidade na UI). Nunca preenchido por suposicao - so via auditoria documentada, ver lemoncaps-catalogo-planejamento/conformidade-anvisa.md.';
comment on column public.formulas.compliance_norms is 'Normas (numero/ano) que sustentam a conferencia desta formula especifica, copiadas literalmente da coluna "Norma" da Tabela 1 do arquivo de auditoria - so as que se aplicam aos insumos REAIS desta formula, nunca a lista inteira do catalogo. NULL enquanto compliance_verified_at for NULL.';
comment on column public.formulas.compliance_source is 'URL da fonte primaria consultada na auditoria (AnvisaLegis, texto consolidado da IN 28/2018). NULL enquanto compliance_verified_at for NULL.';


-- ---------------------------------------------------------------------------------
-- 2. MARCA AS 10 FORMULAS 100% CONFORMES (Tabela 2 / secao 6 do arquivo de auditoria)
-- ---------------------------------------------------------------------------------
-- Data e URL identicas para as 10 (mesma auditoria, mesma fonte primaria - Tabela 1).
-- compliance_norms varia por formula: só as normas que tocam os insumos que ela
-- realmente declara (nunca a lista cheia). IDs conferidos ao vivo no banco de producao
-- via Management API (select id, slug, name from public.formulas), nao supostos.

update public.formulas as f
set
    compliance_verified_at = timestamptz '2026-09-12 00:00:00-04:00',
    compliance_norms       = v.norms,
    compliance_source      = 'https://anvisalegis.datalegis.net/action/ActionDatalegis.php?acao=abrirTextoAto&tipo=INM&numeroAto=00000028&seqAto=000&valorAno=2018&orgao=DC%2FANVISA%2FMS&codTipo=&desItem=&desItemFim=&cod_menu=9434&cod_modulo=310&pesquisa=true'
from (values
    -- BELLA GUMMY (Biotina em Gummy): vitamina C, E, zinco, vitamina A, biotina - todos
    -- "IN 28/2018, Anexo III/IV (original)" na Tabela 1.
    ('49c6fc44-ccdc-4c56-9e9b-81be4f509403'::uuid, array['IN 28/2018']),

    -- CREATINA EM GUMMY SABOR TUTTI-FRUTTI: creatina monoidratada 3000 mg - maximo so
    -- fica dentro da faixa (3.000-5.000 mg) por causa da IN 373/2025, que elevou o teto
    -- de 3.000 para 5.000 mg.
    ('dc17b5db-4f49-496b-b0e9-4cefe93f3058'::uuid, array['IN 28/2018', 'IN 373/2025']),

    -- CREATINA GUMMY SABOR FRUTAS VERMELHAS: mesmo caso (creatina 3000 mg).
    ('bffe9877-1bf6-4733-b627-a75de04e63c9'::uuid, array['IN 28/2018', 'IN 373/2025']),

    -- CREATINA MONOHIDRATADA 150g SOLUVEL: creatina 5000 mg - so conforme por causa do
    -- teto novo (5.000 mg) da IN 373/2025; no teto antigo (3.000 mg) estaria acima.
    ('cf7a74c7-9585-4c29-9c82-c9f7b81831a5'::uuid, array['IN 28/2018', 'IN 373/2025']),

    -- CREATINA MONOHIDRATADA 300g SOLUVEL: mesmo caso.
    ('8e8b8937-8aa1-4929-8b34-5b484bb3412c'::uuid, array['IN 28/2018', 'IN 373/2025']),

    -- DORES MUSCULARES: MSM e colageno tipo II nao desnaturado (incluidos pela IN
    -- 76/2020); sulfato de glucosamina+KCl (limite de "Glucosamina" incluido pela IN
    -- 304/2024); demais insumos (vitamina C, magnesio, vitamina E, zinco, ferro,
    -- vitamina B6, selenio, vitamina D, vitamina B12) sao IN 28/2018 original.
    ('a93b61c5-babe-476e-b272-1b576324d8b9'::uuid, array['IN 28/2018', 'IN 76/2020', 'IN 304/2024']),

    -- FOCUS COLINA: L-teanina (IN 318/2024); L-carnitina e inositol (IN 76/2020);
    -- colina, L-tirosina, magnesio, vitamina B6, vitamina D, vitamina B12 sao originais.
    ('5e159209-e227-4ee8-911b-3262f8beffc9'::uuid, array['IN 28/2018', 'IN 76/2020', 'IN 318/2024']),

    -- Melatonina em Gumy Sabor Uva: melatonina (incluida pela IN 102/2021, uso restrito
    -- a maiores de 19 anos); L-triptofano e original.
    ('f32a62b6-4089-4995-b241-4607114860d3'::uuid, array['IN 28/2018', 'IN 102/2021']),

    -- Multivitaminico: L-teanina (IN 318/2024); niacina, teto atual pela IN 418/2025;
    -- boro e o teto do acido folico pela IN 76/2020; nomenclatura do minimo do acido
    -- folico pela IN 102/2021; demais insumos sao originais.
    ('32e66012-fb3d-4d99-b425-a2b850b755a8'::uuid, array['IN 28/2018', 'IN 76/2020', 'IN 102/2021', 'IN 318/2024', 'IN 418/2025']),

    -- Serena: inositol (IN 76/2020); L-teanina (IN 318/2024); melatonina (IN 102/2021);
    -- magnesio e vitamina B6 sao originais.
    ('07e1ee0c-c314-4c33-a440-0aa47bd4fdb1'::uuid, array['IN 28/2018', 'IN 76/2020', 'IN 102/2021', 'IN 318/2024'])
) as v(id, norms)
where f.id = v.id
  and f.deleted_at is null;

-- Conferencia de guarda: se este numero nao for 10, algo mudou na tabela (fórmula
-- apagada/reativada) e a migration para em vez de seguir com contagem errada em
-- silencio - regra de exatidao, nunca falhar calado.
do $$
declare
    v_count integer;
begin
    select count(*) into v_count
    from public.formulas
    where compliance_verified_at is not null;

    if v_count <> 10 then
        raise exception 'esperado exatamente 10 formulas com compliance_verified_at preenchido, encontrado %', v_count;
    end if;
end $$;
