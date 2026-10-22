-- =====================================================================================
-- LEMON CAPS - CATALOGO PUBLICO - REFORMULACAO REGULATORIA 2026-09-16
-- Fragmento para o slug: pre-treino-creatina-sabor-limao-420g
-- Fonte: docs/conformidade/reformulacao/pre-treino-creatina-sabor-limao-420g.md (memorial de reformulacao, 2026-09-16)
--        scratchpad/fase2/pre-treino-creatina-sabor-limao-420g.json (dados estruturados)
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
-- Veredito esperado: CONFORME (fórmula proposta: cafeína total 81 % do teto, beta-alanina 300 mg/dose, 13 constituintes com folga, soma 14.000 mg) — condicionado a laudo de cafeína do guaraná, laudo válido de bisglicinato de magnésio e laudo novo de beta-alanina
-- =====================================================================================

-- 1. Exclusao logica das composicoes ativas atuais
update public.formula_compositions fc
set active = false,
    deleted_at = now(),
    reason_deleted = 'reformulação regulatória 2026-09-16'
from public.formulas f
where f.id = fc.formula_id
  and f.deleted_at is null
  and f.slug = 'pre-treino-creatina-sabor-limao-420g'
  and fc.deleted_at is null
  and coalesce(fc.metadata->>'fonte', '') <> 'reformulacao_2026-09-16';

-- 3. Insercao das composicoes reformuladas
insert into public.formula_compositions (formula_id, ingredient_name, quantity, unit, sort_order, ingredient_id, metadata)
select f.id, v.ingredient_name, v.quantity, v.unit::public.composition_unit, v.sort_order, i.id, v.metadata::jsonb
from (values
    ('pre-treino-creatina-sabor-limao-420g', 0, 'Creatina monoidratada', 4000, 'mg', 'creatina-monoidratada', '{"fonte": "reformulacao_2026-09-16", "laudo_lote": "217949", "teor_pct": 100.5, "ativo_mg": 4020.0, "ativo_leitura_b_mg": 3557.7, "linha_anexo": "I·Creatina monohidratada; III/IV·Creatina", "e_sal": false}'),
    ('pre-treino-creatina-sabor-limao-420g', 1, 'Maltodextrina', 2275.3575, 'mg', 'maltodextrina', '{"fonte": "reformulacao_2026-09-16", "laudo_lote": "210170 (VENCIDO)", "teor_pct": null, "ativo_mg": null, "linha_anexo": "I·Maltodextrina (veículo)", "papel": "excipiente q.s.p.", "observacao": "q.s.p. recalculado na fase 3 (era 2.268,091) após as massas harmonizadas de bisglicinato de magnésio, vitamina D3 e metilcobalamina"}'),
    ('pre-treino-creatina-sabor-limao-420g', 2, 'Cloridrato de L-arginina', 1240, 'mg', 'cloridrato-de-l-arginina', '{"fonte": "reformulacao_2026-09-16", "laudo_lote": "AUTO035918", "teor_pct": 82.2, "ativo_mg": 1019.2, "unidade_ativo": "mg de L-arginina", "linha_anexo": "I·Cloridrato de L-arginina; IV·Arginina 3.810", "e_sal": true, "elemento_equivalente_mg": 1019.2}'),
    ('pre-treino-creatina-sabor-limao-420g', 3, 'Ácido cítrico (INS 330)', 1100, 'mg', 'acido-citrico', '{"fonte": "reformulacao_2026-09-16", "laudo_lote": "GE2844AFG", "teor_pct": 100.1, "ativo_mg": null, "linha_anexo": "aditivo — IN 211/2023", "papel": "acidulante"}'),
    ('pre-treino-creatina-sabor-limao-420g', 4, 'Taurina', 1000, 'mg', 'taurina', '{"fonte": "reformulacao_2026-09-16", "laudo_lote": "214586", "teor_pct": 99.46, "ativo_mg": 994.6, "linha_anexo": "I·Taurina; IV·Taurina 2.000", "e_sal": false}'),
    ('pre-treino-creatina-sabor-limao-420g', 5, 'L-tirosina', 1000, 'mg', 'l-tirosina', '{"fonte": "reformulacao_2026-09-16", "laudo_lote": "91382", "teor_pct": 99.9, "ativo_mg": 999.0, "linha_anexo": "I·L-Tirosina; III/IV·Tirosina", "e_sal": false}'),
    ('pre-treino-creatina-sabor-limao-420g', 6, 'L-carnitina', 1000, 'mg', 'l-carnitina', '{"fonte": "reformulacao_2026-09-16", "laudo_lote": "26H14-B025-226329", "teor_pct": 99.41, "ativo_mg": 994.1, "linha_anexo": "I·Levocarnitina/L-carnitina; IV·L-Carnitina 2.000", "e_sal": false}'),
    ('pre-treino-creatina-sabor-limao-420g', 7, 'Bisglicinato de magnésio', 992.72, 'mg', 'magnesio', '{"fonte": "reformulacao_2026-09-16", "laudo_lote": "90844 (VENCIDO em 21/06/2025 — teor 30,22 % t.q.; lote de referência harmonizado na fase 3, antes 088629 a 30,0 % e massa 1.000 mg)", "teor_pct": 30.22, "ativo_mg": 300.0, "unidade_ativo": "mg de magnésio", "linha_anexo": "I·Bisglicinato de magnésio; III·Magnésio 63; IV·Magnésio 350", "e_sal": true, "elemento_equivalente_mg": 300.0}'),
    ('pre-treino-creatina-sabor-limao-420g', 8, 'Aromatizante idêntico ao natural de limão', 350, 'mg', 'aromatizante-identico-ao-natural-de-limao', '{"fonte": "reformulacao_2026-09-16", "laudo_lote": "19504", "teor_pct": null, "ativo_mg": null, "linha_anexo": "aditivo — IN 211/2023", "papel": "aromatizante"}'),
    ('pre-treino-creatina-sabor-limao-420g', 9, 'Beta-alanina', 300, 'mg', 'beta-alanina', '{"fonte": "reformulacao_2026-09-16", "laudo_lote": "AUTO033847 (VENCIDO)", "teor_pct": 99.1, "ativo_mg": 297.3, "linha_anexo": "I·Beta-alanina; IV·2 g; VI·Beta-alanina", "e_sal": false}'),
    ('pre-treino-creatina-sabor-limao-420g', 10, 'Guaraná em pó (Paullinia cupana)', 250, 'mg', 'guarana-em-po', '{"fonte": "reformulacao_2026-09-16", "laudo_lote": "25H26-B028-213428", "teor_pct": 5.11, "ativo_mg": 12.78, "unidade_ativo": "mg de cafeína (máximo, por metilxantinas)", "linha_anexo": "I·Cafeína·Guaraná em pó (Paullinia cupana); IV·Cafeína 200 (total)", "e_sal": false, "observacao": "substitui \"extrato de guaraná\" 515 mg (forma não autorizada)"}'),
    ('pre-treino-creatina-sabor-limao-420g', 11, 'Cafeína anidra', 150, 'mg', 'cafeina-anidra', '{"fonte": "reformulacao_2026-09-16", "laudo_lote": "214171", "teor_pct": 99.88, "ativo_mg": 149.8, "linha_anexo": "I·Cafeína; III·75; IV·200 (total 162,6 mg = 81,3 %)", "e_sal": false}'),
    ('pre-treino-creatina-sabor-limao-420g', 12, 'Dióxido de silício (INS 551)', 118, 'mg', 'dioxido-de-silicio', '{"fonte": "reformulacao_2026-09-16", "laudo_lote": "876013", "teor_pct": null, "ativo_mg": null, "linha_anexo": "aditivo — IN 211/2023", "papel": "antiumectante"}'),
    ('pre-treino-creatina-sabor-limao-420g', 13, 'Vitamina B6 (cloridrato de piridoxina)', 90, 'mg', 'vitamina-b6', '{"fonte": "reformulacao_2026-09-16", "laudo_lote": "91188", "teor_pct": 82.19, "ativo_mg": 73.97, "unidade_ativo": "mg de piridoxina", "linha_anexo": "I·Cloridrato de piridoxina; III/IV·Vitamina B6", "e_sal": true, "elemento_equivalente_mg": 73.97}'),
    ('pre-treino-creatina-sabor-limao-420g', 14, 'Edulcorante sucralose (INS 955)', 90, 'mg', 'edulcorante-sucralose', '{"fonte": "reformulacao_2026-09-16", "laudo_lote": "91233", "teor_pct": 99.74, "ativo_mg": null, "linha_anexo": "aditivo — IN 211/2023", "papel": "edulcorante"}'),
    ('pre-treino-creatina-sabor-limao-420g', 15, 'Vitamina B3 (niacinamida)', 30, 'mg', 'vitamina-b3', '{"fonte": "reformulacao_2026-09-16", "laudo_lote": "872226", "teor_pct": 99.09, "ativo_mg": 29.73, "unidade_ativo": "mg NE", "linha_anexo": "I·Nicotinamida/Niacinamida; III/IV·Niacina", "e_sal": false, "observacao": "teor tal qual 99,09 % harmonizado na fase 3 (antes 99,5 % base seca, 29,85 mg)"}'),
    ('pre-treino-creatina-sabor-limao-420g', 16, 'Vitamina D3 (colecalciferol)', 40, 'mcg', 'vitamina-d', '{"fonte": "reformulacao_2026-09-16", "laudo_lote": "91408", "teor_pct": null, "potencia": "115.000 UI/g", "ativo_mg": 0.04, "unidade_ativo": "µg (40,0)", "massa_insumo_mg": 13.913, "linha_anexo": "I·Vitamina D3 (Colecalciferol); III/IV·Vitamina D", "e_sal": false, "observacao": "massa do pó 13,913 mg harmonizada na fase 3 (antes 13,9 mg = 39,96 µg)"}'),
    ('pre-treino-creatina-sabor-limao-420g', 17, 'Vitamina B12 (metilcobalamina)', 9.52, 'mcg', 'vitamina-b12', '{"fonte": "reformulacao_2026-09-16", "laudo_lote": "219376", "teor_pct": 89.27, "ativo_mg": 0.0085, "unidade_ativo": "µg (8,5)", "linha_anexo": "I·Metilcobalamina; III/IV·Vitamina B12", "e_sal": false, "observacao": "lote de referência 219376 (89,27 % t.q.) harmonizado na fase 3 — antes 90955 (94,54 %, 8,99 µg)"}')
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
    'pre-treino-creatina-sabor-limao-420g',
    'Creatina monoidratada, maltodextrina, cloridrato de L-arginina, acidulante ácido cítrico (INS 330), taurina, L-tirosina, L-carnitina, bisglicinato de magnésio, aromatizante idêntico ao natural de limão, beta-alanina, guaraná em pó (Paullinia cupana), cafeína anidra, antiumectante dióxido de silício (INS 551), vitamina B6 (cloridrato de piridoxina), edulcorante sucralose (INS 955), vitamina B3 (niacinamida), vitamina D3 (colecalciferol), vitamina B12 (metilcobalamina) e corante tartrazina (INS 102) [massa PENDENTE]. [PENDENTE — Lei 10.674/2003 obriga "Contém Glúten" ou "Não contém Glúten": só grafar "Não contém glúten" com laudo do produto acabado]',
    'Este produto não é um medicamento.
Não exceder a recomendação diária de consumo indicada na embalagem.
Mantenha fora do alcance de crianças.
Público indicado: adultos a partir de 19 anos.
Este produto não deve ser consumido por gestantes, lactantes e crianças.
Quantidade diária máxima de 2 g com doses divididas de, no máximo, 300 mg, com intervalo de duas horas entre as doses.
Contém cafeína (163 mg por porção, incluindo a do guaraná).
Conservar em local seco, fresco e arejado, ao abrigo da luz e do calor excessivo, entre 15 °C e 30 °C. Após aberto, consumir em até 60 dias. Não consumir se o lacre de segurança estiver violado.',
    'INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 14 g (1 dosador)
                                                  14 g   %VD*
Valor energético                               22 kcal = 91 kJ   1 %
Carboidratos                                             2,3 g   1 %
n Açúcares totais                                     PENDENTE   
nn Açúcares adicionados                               PENDENTE   
Proteínas                                                  0 g   0 %
n L-arginina                                          1.019 mg   
n L-tirosina                                            999 mg   
n Beta-alanina                                          297 mg   
Gorduras totais                                            0 g   0 %
n Gorduras saturadas                                       0 g   0 %
n Gorduras trans                                           0 g   0 %
Fibras alimentares                                         0 g   0 %
Sódio                                                     0 mg   0 %
Vitamina D                                               40 µg   267 %
Vitamina B3                                              30 mg   200 %
Vitamina B6                                              74 mg   5.692 %
Vitamina B12                                            8,5 µg   354 %
Magnésio                                                300 mg   71 %
Taurina                                                 995 mg   
L-carnitina                                             994 mg   
Cafeína                                                 163 mg   
Creatina                                              4.000 mg   
*Percentual de valores diários fornecidos pela porção',
    '14 g (1 dosador)',
    '{"tabela_nutricional_20260916": {"porcoes_por_embalagem": "30", "porcao": "14 g (1 dosador)", "porcao_coluna": "14 g", "linhas": [{"item": "Valor energético", "quantidade": "22", "unidade": "kcal", "kj": "91", "quantidade_num": 22.0, "vd_pct": 1, "nivel": 0, "nota": "maltodextrina 2,268 g × 4 + ácido cítrico 1,1 g × 3 + aminoácidos (arginina 1,019 + tirosina 0,999 + beta-alanina 0,297 g) × 4 = 21,63 kcal; taurina, carnitina e creatina sem fator no Anexo XXII → 0"}, {"item": "Carboidratos", "quantidade": "2,3", "quantidade_num": 2.3, "unidade": "g", "vd_pct": 1, "nivel": 0, "nota": "maltodextrina (veículo)"}, {"item": "Açúcares totais", "quantidade": "PENDENTE", "unidade": "g", "vd_pct": null, "nivel": 1, "nota": "fração de mono/dissacarídeos da maltodextrina não quantificada"}, {"item": "Açúcares adicionados", "quantidade": "PENDENTE", "unidade": "g", "vd_pct": null, "nivel": 2, "nota": null}, {"item": "Proteínas", "quantidade": "0", "quantidade_num": 0.0, "unidade": "g", "vd_pct": 0, "nivel": 0, "nota": null}, {"item": "L-arginina", "quantidade": "1.019", "quantidade_num": 1019.0, "unidade": "mg", "vd_pct": null, "nivel": 1, "nota": null}, {"item": "L-tirosina", "quantidade": "999", "quantidade_num": 999.0, "unidade": "mg", "vd_pct": null, "nivel": 1, "nota": null}, {"item": "Beta-alanina", "quantidade": "297", "quantidade_num": 297.0, "unidade": "mg", "vd_pct": null, "nivel": 1, "nota": null}, {"item": "Gorduras totais", "quantidade": "0", "quantidade_num": 0.0, "unidade": "g", "vd_pct": 0, "nivel": 0, "nota": null}, {"item": "Gorduras saturadas", "quantidade": "0", "quantidade_num": 0.0, "unidade": "g", "vd_pct": 0, "nivel": 1, "nota": null}, {"item": "Gorduras trans", "quantidade": "0", "quantidade_num": 0.0, "unidade": "g", "vd_pct": 0, "nivel": 1, "nota": null}, {"item": "Fibras alimentares", "quantidade": "0", "quantidade_num": 0.0, "unidade": "g", "vd_pct": 0, "nivel": 0, "nota": null}, {"item": "Sódio", "quantidade": "0", "quantidade_num": 0.0, "unidade": "mg", "vd_pct": 0, "nivel": 0, "nota": null}, {"item": "Vitamina D", "quantidade": "40", "quantidade_num": 40.0, "unidade": "µg", "vd_pct": 267, "nivel": 0, "nota": null}, {"item": "Vitamina B3", "quantidade": "30", "quantidade_num": 30.0, "unidade": "mg", "vd_pct": 200, "nivel": 0, "nota": "mg NE"}, {"item": "Vitamina B6", "quantidade": "74", "quantidade_num": 74.0, "unidade": "mg", "vd_pct": 5692, "nivel": 0, "nota": null}, {"item": "Vitamina B12", "quantidade": "8,5", "quantidade_num": 8.5, "unidade": "µg", "vd_pct": 354, "nivel": 0, "nota": null}, {"item": "Magnésio", "quantidade": "300", "quantidade_num": 300.0, "unidade": "mg", "vd_pct": 71, "nivel": 0, "nota": null}, {"item": "Taurina", "quantidade": "995", "quantidade_num": 995.0, "unidade": "mg", "vd_pct": null, "nivel": 0, "nota": null}, {"item": "L-carnitina", "quantidade": "994", "quantidade_num": 994.0, "unidade": "mg", "vd_pct": null, "nivel": 0, "nota": null}, {"item": "Cafeína", "quantidade": "163", "quantidade_num": 163.0, "unidade": "mg", "vd_pct": null, "nivel": 0, "nota": "cafeína anidra 149,8 mg + guaraná em pó 12,8 mg (máximo, por metilxantinas)"}, {"item": "Creatina", "quantidade": "4.000", "quantidade_num": 4000.0, "unidade": "mg", "vd_pct": null, "nivel": 0, "nota": "massa nominal de creatina monoidratada (lote 217949: 4.020 mg A / 3.558 mg B)"}], "rodape": "*Percentual de valores diários fornecidos pela porção", "regras": "IN 75/2020 Anexos III, IV, VIII, XI e XXII (lidos 16/09/2026)."}, "reformulacao": {"data": "2026-09-16", "fonte": "docs/conformidade/reformulacao/pre-treino-creatina-sabor-limao-420g.md", "veredito_esperado": "CONFORME (fórmula proposta: cafeína total 81 % do teto, beta-alanina 300 mg/dose, 13 constituintes com folga, soma 14.000 mg) — condicionado a laudo de cafeína do guaraná, laudo válido de bisglicinato de magnésio e laudo novo de beta-alanina", "porcao_mg": 14000, "soma_porcao_mg": 14000.0, "cabe": true}}'
)) as v(slug, ingredients_list, warnings, nutritional_info, serving_description, metadata)
where f.slug = v.slug
  and f.deleted_at is null
  and (f.ingredients_list is distinct from v.ingredients_list
       or f.warnings is distinct from v.warnings
       or f.nutritional_info is distinct from v.nutritional_info
       or f.serving_description is distinct from v.serving_description
       or coalesce(f.metadata->'reformulacao'->>'data', '') <> '2026-09-16');
