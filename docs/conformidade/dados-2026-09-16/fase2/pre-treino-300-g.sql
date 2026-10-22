-- =====================================================================================
-- LEMON CAPS - CATALOGO PUBLICO - REFORMULACAO REGULATORIA 2026-09-16
-- Fragmento para o slug: pre-treino-300-g
-- Fonte: docs/conformidade/reformulacao/pre-treino-300-g.md (memorial de reformulacao, 2026-09-16)
--        scratchpad/fase2/pre-treino-300-g.json (dados estruturados)
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
-- Veredito esperado: CONFORME (fórmula proposta, com folga em todos os constituintes) — condicionado a laudo novo de beta-alanina e à regularização do insumo controlado (cafeína)
-- =====================================================================================

-- 1. Exclusao logica das composicoes ativas atuais
update public.formula_compositions fc
set active = false,
    deleted_at = now(),
    reason_deleted = 'reformulação regulatória 2026-09-16'
from public.formulas f
where f.id = fc.formula_id
  and f.deleted_at is null
  and f.slug = 'pre-treino-300-g'
  and fc.deleted_at is null
  and coalesce(fc.metadata->>'fonte', '') <> 'reformulacao_2026-09-16';

-- 3. Insercao das composicoes reformuladas
insert into public.formula_compositions (formula_id, ingredient_name, quantity, unit, sort_order, ingredient_id, metadata)
select f.id, v.ingredient_name, v.quantity, v.unit::public.composition_unit, v.sort_order, i.id, v.metadata::jsonb
from (values
    ('pre-treino-300-g', 0, 'Creatina monoidratada', 3500, 'mg', 'creatina-monoidratada', '{"fonte": "reformulacao_2026-09-16", "laudo_lote": "217949", "teor_pct": 100.5, "ativo_mg": 3517.5, "ativo_leitura_b_mg": 3112.9, "linha_anexo": "I·Creatina monohidratada; III/IV·Creatina", "e_sal": false}'),
    ('pre-treino-300-g', 1, 'Maltodextrina', 1824.991, 'mg', 'maltodextrina', '{"fonte": "reformulacao_2026-09-16", "laudo_lote": "210170 (VENCIDO 26/07/2026)", "teor_pct": null, "ativo_mg": null, "linha_anexo": "I·Carboidratos·Maltodextrina (veículo, Art. 6 § único RDC 243)", "e_sal": false, "papel": "excipiente q.s.p."}'),
    ('pre-treino-300-g', 2, 'Cloridrato de L-arginina', 1240, 'mg', 'cloridrato-de-l-arginina', '{"fonte": "reformulacao_2026-09-16", "laudo_lote": "AUTO035918", "teor_pct": 82.2, "ativo_mg": 1019.2, "unidade_ativo": "mg de L-arginina", "linha_anexo": "I·Cloridrato de L-arginina; IV·Arginina 3.810", "e_sal": true, "elemento_equivalente_mg": 1019.2}'),
    ('pre-treino-300-g', 3, 'Ácido cítrico (INS 330)', 1100, 'mg', 'acido-citrico', '{"fonte": "reformulacao_2026-09-16", "laudo_lote": "GE2844AFG", "teor_pct": 100.1, "ativo_mg": null, "linha_anexo": "aditivo — IN 211/2023 cat. 14.2 (quantum satis)", "papel": "acidulante"}'),
    ('pre-treino-300-g', 4, 'Taurina', 900, 'mg', 'taurina', '{"fonte": "reformulacao_2026-09-16", "laudo_lote": "214586", "teor_pct": 99.46, "ativo_mg": 895.1, "linha_anexo": "I·Taurina; IV·Taurina 2.000", "e_sal": false}'),
    ('pre-treino-300-g', 5, 'L-tirosina', 400, 'mg', 'l-tirosina', '{"fonte": "reformulacao_2026-09-16", "laudo_lote": "91382", "teor_pct": 99.9, "ativo_mg": 399.6, "linha_anexo": "I·L-Tirosina; III·Tirosina 262,5; IV·Tirosina 2.750", "e_sal": false}'),
    ('pre-treino-300-g', 6, 'Aromatizante idêntico ao natural de limão', 350, 'mg', 'aromatizante-identico-ao-natural-de-limao', '{"fonte": "reformulacao_2026-09-16", "laudo_lote": "19504 (vence 25/09/2026)", "teor_pct": null, "ativo_mg": null, "linha_anexo": "aditivo — IN 211/2023 cat. 14.2", "papel": "aromatizante"}'),
    ('pre-treino-300-g', 7, 'Beta-alanina', 300, 'mg', 'beta-alanina', '{"fonte": "reformulacao_2026-09-16", "laudo_lote": "AUTO033847 (VENCIDO 03/08/2026 — último teor conhecido)", "teor_pct": 99.1, "ativo_mg": 297.3, "linha_anexo": "I·Beta-alanina; IV·Beta-alanina 2 g; VI·Beta-alanina", "e_sal": false}'),
    ('pre-treino-300-g', 8, 'Cafeína anidra', 175, 'mg', 'cafeina-anidra', '{"fonte": "reformulacao_2026-09-16", "laudo_lote": "214171", "teor_pct": 99.88, "ativo_mg": 174.8, "linha_anexo": "I·Cafeína; III·Cafeína 75; IV·Cafeína 200", "e_sal": false, "observacao": "200 → 175 mg (87,4 % do teto)"}'),
    ('pre-treino-300-g', 9, 'Dióxido de silício (INS 551)', 118, 'mg', 'dioxido-de-silicio', '{"fonte": "reformulacao_2026-09-16", "laudo_lote": "876013", "teor_pct": null, "ativo_mg": null, "linha_anexo": "aditivo — IN 211/2023 cat. 14.2 (quantum satis)", "papel": "antiumectante"}'),
    ('pre-treino-300-g', 10, 'Edulcorante sucralose (INS 955)', 90, 'mg', 'edulcorante-sucralose', '{"fonte": "reformulacao_2026-09-16", "laudo_lote": "91233", "teor_pct": 99.74, "ativo_mg": null, "linha_anexo": "aditivo — IN 211/2023 cat. 14.2 (2.400 mg/kg no produto pronto)", "papel": "edulcorante"}'),
    ('pre-treino-300-g', 11, 'Vitamina B6 (cloridrato de piridoxina)', 2, 'mg', 'vitamina-b6', '{"fonte": "reformulacao_2026-09-16", "laudo_lote": "91188", "teor_pct": 82.19, "ativo_mg": 1.644, "unidade_ativo": "mg de piridoxina", "linha_anexo": "I·Cloridrato de piridoxina; III/IV·Vitamina B6", "e_sal": true, "elemento_equivalente_mg": 1.644}'),
    ('pre-treino-300-g', 12, 'Vitamina B12 (metilcobalamina)', 9.52, 'mcg', 'vitamina-b12', '{"fonte": "reformulacao_2026-09-16", "laudo_lote": "219376", "teor_pct": 89.27, "ativo_mg": 0.0085, "unidade_ativo": "µg (8,5)", "linha_anexo": "I·Metilcobalamina; III/IV·Vitamina B12", "e_sal": false, "observacao": "9,94 µg pesados → 9,52 µg pesados (entrega 8,5 µg = 85,5 % do teto); lote de referência 219376 (89,27 % t.q.) harmonizado na fase 3 — antes 90955 (94,54 %, 8,99 µg)"}')
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
    'pre-treino-300-g',
    'Creatina monoidratada, maltodextrina, cloridrato de L-arginina, acidulante ácido cítrico (INS 330), taurina, L-tirosina, aromatizante idêntico ao natural de limão, beta-alanina, cafeína anidra, antiumectante dióxido de silício (INS 551), edulcorante sucralose (INS 955), vitamina B6 (cloridrato de piridoxina) e vitamina B12 (metilcobalamina). [PENDENTE — Lei 10.674/2003 obriga "Contém Glúten" ou "Não contém Glúten": só grafar "Não contém glúten" com laudo do produto acabado]',
    'Este produto não é um medicamento.
Não exceder a recomendação diária de consumo indicada na embalagem.
Mantenha fora do alcance de crianças.
Público indicado: adultos a partir de 19 anos.
Este produto não deve ser consumido por gestantes, lactantes e crianças.
Quantidade diária máxima de 2 g com doses divididas de, no máximo, 300 mg, com intervalo de duas horas entre as doses.
Contém cafeína (175 mg por porção).
Conservar em local seco, fresco e arejado, ao abrigo da luz e do calor excessivo, entre 15 °C e 30 °C. Após aberto, consumir em até 60 dias. Não consumir se o lacre de segurança estiver violado.',
    'INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 10 g (1 dosador)
                                                  10 g   %VD*
Valor energético                               17 kcal = 73 kJ   1 %
Carboidratos                                             1,8 g   1 %
n Açúcares totais                                     PENDENTE   
nn Açúcares adicionados                               PENDENTE   
Proteínas                                                  0 g   0 %
n L-arginina                                          1.019 mg   
n L-tirosina                                            400 mg   
n Beta-alanina                                          297 mg   
Gorduras totais                                            0 g   0 %
n Gorduras saturadas                                       0 g   0 %
n Gorduras trans                                           0 g   0 %
Fibras alimentares                                         0 g   0 %
Sódio                                                     0 mg   0 %
Vitamina B6                                             1,6 mg   123 %
Vitamina B12                                            8,5 µg   354 %
Taurina                                                 895 mg   
Cafeína                                                 175 mg   
Creatina                                              3.500 mg   
*Percentual de valores diários fornecidos pela porção',
    '10 g (1 dosador)',
    '{"tabela_nutricional_20260916": {"porcoes_por_embalagem": "30", "porcao": "10 g (1 dosador)", "porcao_coluna": "10 g", "linhas": [{"item": "Valor energético", "quantidade": "17", "unidade": "kcal", "kj": "73", "quantidade_num": 17.0, "vd_pct": 1, "nivel": 0, "nota": "maltodextrina 1,825 g × 4 + ácido cítrico 1,1 g × 3 + aminoácidos (arginina 1,019 + tirosina 0,400 + beta-alanina 0,297 g) × 4 = 17,46 kcal; taurina e creatina sem fator no Anexo XXII → 0 (critério do RT)"}, {"item": "Carboidratos", "quantidade": "1,8", "quantidade_num": 1.8, "unidade": "g", "vd_pct": 1, "nivel": 0, "nota": "maltodextrina (veículo)"}, {"item": "Açúcares totais", "quantidade": "PENDENTE", "unidade": "g", "vd_pct": null, "nivel": 1, "nota": "fração de mono/dissacarídeos da maltodextrina (DE 17,72 %) não quantificada — RDC 429 Art. 3 I/II"}, {"item": "Açúcares adicionados", "quantidade": "PENDENTE", "unidade": "g", "vd_pct": null, "nivel": 2, "nota": "idem (maltodextrina conta como açúcar adicionado na fração de mono/dissacarídeos)"}, {"item": "Proteínas", "quantidade": "0", "quantidade_num": 0.0, "unidade": "g", "vd_pct": 0, "nivel": 0, "nota": "sem fonte proteica; aminoácidos livres declarados abaixo"}, {"item": "L-arginina", "quantidade": "1.019", "quantidade_num": 1019.0, "unidade": "mg", "vd_pct": null, "nivel": 1, "nota": null}, {"item": "L-tirosina", "quantidade": "400", "quantidade_num": 400.0, "unidade": "mg", "vd_pct": null, "nivel": 1, "nota": null}, {"item": "Beta-alanina", "quantidade": "297", "quantidade_num": 297.0, "unidade": "mg", "vd_pct": null, "nivel": 1, "nota": null}, {"item": "Gorduras totais", "quantidade": "0", "quantidade_num": 0.0, "unidade": "g", "vd_pct": 0, "nivel": 0, "nota": null}, {"item": "Gorduras saturadas", "quantidade": "0", "quantidade_num": 0.0, "unidade": "g", "vd_pct": 0, "nivel": 1, "nota": null}, {"item": "Gorduras trans", "quantidade": "0", "quantidade_num": 0.0, "unidade": "g", "vd_pct": 0, "nivel": 1, "nota": null}, {"item": "Fibras alimentares", "quantidade": "0", "quantidade_num": 0.0, "unidade": "g", "vd_pct": 0, "nivel": 0, "nota": null}, {"item": "Sódio", "quantidade": "0", "quantidade_num": 0.0, "unidade": "mg", "vd_pct": 0, "nivel": 0, "nota": "sem fonte de sódio na receita"}, {"item": "Vitamina B6", "quantidade": "1,6", "quantidade_num": 1.6, "unidade": "mg", "vd_pct": 123, "nivel": 0, "nota": null}, {"item": "Vitamina B12", "quantidade": "8,5", "quantidade_num": 8.5, "unidade": "µg", "vd_pct": 354, "nivel": 0, "nota": null}, {"item": "Taurina", "quantidade": "895", "quantidade_num": 895.0, "unidade": "mg", "vd_pct": null, "nivel": 0, "nota": null}, {"item": "Cafeína", "quantidade": "175", "quantidade_num": 175.0, "unidade": "mg", "vd_pct": null, "nivel": 0, "nota": null}, {"item": "Creatina", "quantidade": "3.500", "quantidade_num": 3500.0, "unidade": "mg", "vd_pct": null, "nivel": 0, "nota": "massa nominal de creatina monoidratada (lote 217949: 3.517,5 mg A / 3.113 mg B)"}], "rodape": "*Percentual de valores diários fornecidos pela porção", "regras": "IN 75/2020 Anexos III, IV, VIII, XI e XXII (lidos 16/09/2026)."}, "reformulacao": {"data": "2026-09-16", "fonte": "docs/conformidade/reformulacao/pre-treino-300-g.md", "veredito_esperado": "CONFORME (fórmula proposta, com folga em todos os constituintes) — condicionado a laudo novo de beta-alanina e à regularização do insumo controlado (cafeína)", "porcao_mg": 10000, "soma_porcao_mg": 10000.0, "cabe": true}}'
)) as v(slug, ingredients_list, warnings, nutritional_info, serving_description, metadata)
where f.slug = v.slug
  and f.deleted_at is null
  and (f.ingredients_list is distinct from v.ingredients_list
       or f.warnings is distinct from v.warnings
       or f.nutritional_info is distinct from v.nutritional_info
       or f.serving_description is distinct from v.serving_description
       or coalesce(f.metadata->'reformulacao'->>'data', '') <> '2026-09-16');
