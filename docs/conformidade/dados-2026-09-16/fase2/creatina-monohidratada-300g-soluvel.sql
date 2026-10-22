-- =====================================================================================
-- LEMON CAPS - CATALOGO PUBLICO - REFORMULACAO REGULATORIA 2026-09-16
-- Fragmento para o slug: creatina-monohidratada-300g-soluvel
-- Fonte: docs/conformidade/reformulacao/creatina-monohidratada-300g-soluvel.md (memorial de reformulacao, 2026-09-16)
--        scratchpad/fase2/creatina-monohidratada-300g-soluvel.json (dados estruturados)
--
-- O que faz, nesta ordem, SEMPRE casando por slug (nunca por UUID):
--   1. exclusao logica das composicoes ativas atuais da formula
--      (active=false, deleted_at=now(), reason_deleted='reformulação regulatória 2026-09-16');
--   2. insumo(s) novo(s) em public.ingredients, se faltar (on conflict do nothing);
--   3. insercao das composicoes reformuladas, com ingredient_id resolvido por slug e
--      metadata de procedencia (fonte, laudo_lote, teor_pct, ativo_mg, linha_anexo);
--   4. update de public.formulas: ingredients_list, warnings, nutritional_info (TEXT —
--      tipo conferido ao vivo em 2026-09-16: a coluna e texto, nao jsonb; por isso a tabela
--      vai renderizada em texto em nutritional_info e, estruturada, em metadata->
--      'tabela_nutricional_20260916'), serving_description e metadata.
-- Idempotente: a exclusao so pega linhas sem metadata.fonte = 'reformulacao_2026-09-16';
-- a insercao so acontece se a formula ainda nao tem linha ativa com essa fonte; o
-- update de formulas so grava se algum campo estiver diferente.
-- Sem guarda de contagem aqui (a consolidacao poe). NAO aplicado em banco nenhum.
-- Veredito esperado: CONFORME (com folga) — condicionado à validação gravimétrica do dosador e à documentação própria da apresentação de 300 g
-- =====================================================================================

-- 1. Exclusao logica das composicoes ativas atuais
update public.formula_compositions fc
set active = false,
    deleted_at = now(),
    reason_deleted = 'reformulação regulatória 2026-09-16'
from public.formulas f
where f.id = fc.formula_id
  and f.deleted_at is null
  and f.slug = 'creatina-monohidratada-300g-soluvel'
  and fc.deleted_at is null
  and coalesce(fc.metadata->>'fonte', '') <> 'reformulacao_2026-09-16';

-- 3. Insercao das composicoes reformuladas
insert into public.formula_compositions (formula_id, ingredient_name, quantity, unit, sort_order, ingredient_id, metadata)
select f.id, v.ingredient_name, v.quantity, v.unit::public.composition_unit, v.sort_order, i.id, v.metadata::jsonb
from (values
    ('creatina-monohidratada-300g-soluvel', 0, 'Creatina monoidratada', 4000, 'mg', 'creatina-monoidratada', '{"fonte": "reformulacao_2026-09-16", "laudo_lote": "217949 (26A05-B023-217949)", "teor_pct": 100.5, "ativo_mg": 4020.0, "ativo_leitura_b_mg": 3557.7, "massa_insumo_mg": 4000, "linha_anexo": "I·Creatina monohidratada; III·Creatina 3.000; IV·Creatina 5.000 (IN 373/2025)", "e_sal": false, "observacao": "5.000 → 4.000 mg: folga de fabricação (nunca cravar no teto)"}')
) as v(slug, sort_order, ingredient_name, quantity, unit, ingredient_slug, metadata)
join public.formulas f on f.slug = v.slug and f.deleted_at is null
join public.ingredients i on i.slug = v.ingredient_slug and i.deleted_at is null
where not exists (
    select 1 from public.formula_compositions x
    where x.formula_id = f.id and x.deleted_at is null
      and x.metadata->>'fonte' = 'reformulacao_2026-09-16'
);

-- 4. Dizeres e tabela nutricional
update public.formulas f
set ingredients_list    = v.ingredients_list,
    warnings            = v.warnings,
    nutritional_info    = v.nutritional_info,
    serving_description = v.serving_description,
    metadata            = coalesce(f.metadata, '{}'::jsonb) || v.metadata::jsonb
from (values (
    'creatina-monohidratada-300g-soluvel',
    'Creatina monoidratada. [PENDENTE — Lei 10.674/2003 obriga "Contém Glúten" ou "Não contém Glúten": só grafar "Não contém glúten" com laudo do produto acabado]',
    'Este produto não é um medicamento.
Não exceder a recomendação diária de consumo indicada na embalagem.
Mantenha fora do alcance de crianças.
Público indicado: adultos a partir de 19 anos.
Este produto não deve ser consumido por gestantes, lactantes e crianças.
Conservar em local seco, fresco e arejado, ao abrigo da luz e do calor excessivo, entre 15 °C e 30 °C. Após aberto, consumir em até 60 dias. Não consumir se o lacre de segurança estiver violado.',
    'INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 75
Porção: 4 g (1 dosador)
                                                   4 g   %VD*
Valor energético                                 0 kcal = 0 kJ   0 %
Carboidratos                                               0 g   0 %
n Açúcares totais                                          0 g   
nn Açúcares adicionados                                    0 g   0 %
Proteínas                                                  0 g   0 %
Gorduras totais                                            0 g   0 %
n Gorduras saturadas                                       0 g   0 %
n Gorduras trans                                           0 g   0 %
Fibras alimentares                                         0 g   0 %
Sódio                                                     0 mg   0 %
Creatina                                              4.000 mg   
*Percentual de valores diários fornecidos pela porção',
    '4 g (1 dosador)',
    '{"tabela_nutricional_20260916": {"porcoes_por_embalagem": "75", "porcao": "4 g (1 dosador)", "porcao_coluna": "4 g", "linhas": [{"item": "Valor energético", "quantidade": "0", "unidade": "kcal", "kj": "0", "vd_pct": 0, "nivel": 0, "nota": "creatina não tem fator no Anexo XXII da IN 75 → 0 kcal; ≤ 4 kcal declara-se 0 (Anexo IV)"}, {"item": "Carboidratos", "quantidade": "0", "quantidade_num": 0.0, "unidade": "g", "vd_pct": 0, "nivel": 0, "nota": null}, {"item": "Açúcares totais", "quantidade": "0", "quantidade_num": 0.0, "unidade": "g", "vd_pct": null, "nivel": 1, "nota": null}, {"item": "Açúcares adicionados", "quantidade": "0", "quantidade_num": 0.0, "unidade": "g", "vd_pct": 0, "nivel": 2, "nota": null}, {"item": "Proteínas", "quantidade": "0", "quantidade_num": 0.0, "unidade": "g", "vd_pct": 0, "nivel": 0, "nota": "creatina não é proteína (por formulação); Kjeldahl no produto leria o nitrogênio da creatina — critério do RT"}, {"item": "Gorduras totais", "quantidade": "0", "quantidade_num": 0.0, "unidade": "g", "vd_pct": 0, "nivel": 0, "nota": null}, {"item": "Gorduras saturadas", "quantidade": "0", "quantidade_num": 0.0, "unidade": "g", "vd_pct": 0, "nivel": 1, "nota": null}, {"item": "Gorduras trans", "quantidade": "0", "quantidade_num": 0.0, "unidade": "g", "vd_pct": 0, "nivel": 1, "nota": null}, {"item": "Fibras alimentares", "quantidade": "0", "quantidade_num": 0.0, "unidade": "g", "vd_pct": 0, "nivel": 0, "nota": null}, {"item": "Sódio", "quantidade": "0", "quantidade_num": 0.0, "unidade": "mg", "vd_pct": 0, "nivel": 0, "nota": null}, {"item": "Creatina", "quantidade": "4.000", "quantidade_num": 4000.0, "unidade": "mg", "vd_pct": null, "nivel": 0, "nota": "sem VDR: célula de %VD em branco (RDC 429 Art. 12 §1). Declarada a massa nominal de creatina monoidratada; lote 217949 entrega 4.020 mg (leitura A) ou 3.558 mg de creatina anidra (leitura B)"}], "rodape": "*Percentual de valores diários fornecidos pela porção", "regras": "Arredondamento: IN 75/2020 Anexo III. Quantidade não significativa: IN 75/2020 Anexo IV (suplementos, por porção). Porções por embalagem: IN 75/2020 Anexo VI."}, "reformulacao": {"data": "2026-09-16", "fonte": "docs/conformidade/reformulacao/creatina-monohidratada-300g-soluvel.md", "veredito_esperado": "CONFORME (com folga) — condicionado à validação gravimétrica do dosador e à documentação própria da apresentação de 300 g", "porcao_mg": 4000, "soma_porcao_mg": 4000.0, "cabe": true}}'
)) as v(slug, ingredients_list, warnings, nutritional_info, serving_description, metadata)
where f.slug = v.slug
  and f.deleted_at is null
  and (f.ingredients_list is distinct from v.ingredients_list
       or f.warnings is distinct from v.warnings
       or f.nutritional_info is distinct from v.nutritional_info
       or f.serving_description is distinct from v.serving_description
       or coalesce(f.metadata->'reformulacao'->>'data', '') <> '2026-09-16');
