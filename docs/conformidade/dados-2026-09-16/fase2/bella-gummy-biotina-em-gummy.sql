-- =====================================================================================
-- LEMON CAPS - CATALOGO PUBLICO - REFORMULACAO REGULATORIA 2026-09-16
-- Fragmento para o slug: bella-gummy-biotina-em-gummy
-- Fonte: docs/conformidade/reformulacao/bella-gummy-biotina-em-gummy.md (memorial de reformulacao, 2026-09-16)
--        scratchpad/fase2/bella-gummy-biotina-em-gummy.json (dados estruturados)
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
-- Veredito esperado: CONFORME CONDICIONADO A (laudo da vitamina A lote 215230 conferido; massas da matriz de goma para fechar a tabela nutricional; laudos vencidos/errados da base renovados)
-- =====================================================================================

-- 1. Exclusao logica das composicoes ativas atuais
update public.formula_compositions fc
set active = false,
    deleted_at = now(),
    reason_deleted = 'reformulação regulatória 2026-09-16'
from public.formulas f
where f.id = fc.formula_id
  and f.deleted_at is null
  and f.slug = 'bella-gummy-biotina-em-gummy'
  and fc.deleted_at is null
  and coalesce(fc.metadata->>'fonte', '') <> 'reformulacao_2026-09-16';

-- 3. Insercao das composicoes reformuladas
insert into public.formula_compositions (formula_id, ingredient_name, quantity, unit, sort_order, ingredient_id, metadata)
select f.id, v.ingredient_name, v.quantity, v.unit::public.composition_unit, v.sort_order, i.id, v.metadata::jsonb
from (values
    ('bella-gummy-biotina-em-gummy', 0, 'Vitamina C (ácido ascórbico)', 45, 'mg', 'vitamina-c', '{"fonte": "reformulacao_2026-09-16", "laudo_lote": "950467", "teor_pct": 99.5, "ativo_mg": 45.0, "massa_insumo_mg": 45.23, "linha_anexo": "I·Ácido ascórbico; III/IV·Vitamina C", "e_sal": false}'),
    ('bella-gummy-biotina-em-gummy', 1, 'Vitamina E (acetato de DL-alfa-tocoferila)', 5.68, 'mg', 'vitamina-e', '{"fonte": "reformulacao_2026-09-16", "laudo_lote": "91320", "teor_pct": 50.7, "ativo_mg": 5.68, "massa_insumo_mg": 16.7, "unidade_ativo": "mg alfa-TE", "linha_anexo": "I·Acetato de DL-alfa-tocoferol; III/IV·Vitamina E", "e_sal": false, "observacao": "quantity = ativo (α-TE); massa do insumo 16,70 mg"}'),
    ('bella-gummy-biotina-em-gummy', 2, 'Zinco (bisglicinato de zinco)', 12, 'mg', 'zinco', '{"fonte": "reformulacao_2026-09-16", "laudo_lote": "055-ZN/25", "teor_pct": 19.89, "ativo_mg": 2.39, "massa_insumo_mg": 12.0, "linha_anexo": "I·Bisglicinato de zinco; III/IV·Zinco", "e_sal": true, "elemento_equivalente_mg": 2.39}'),
    ('bella-gummy-biotina-em-gummy', 3, 'Vitamina A (acetato de retinol)', 1020, 'mcg', 'vitamina-a', '{"fonte": "reformulacao_2026-09-16", "laudo_lote": "215230 (laudo não conferido)", "teor_pct": null, "potencia": "568.116 UI/g", "ativo_mg": 1.02, "unidade_ativo": "µg RAE (1.020)", "massa_insumo_mg": 5.99, "linha_anexo": "I·Acetato de retinol; III/IV·Vitamina A", "e_sal": false}'),
    ('bella-gummy-biotina-em-gummy', 4, 'Biotina (D-biotina)', 40, 'mcg', 'biotina', '{"fonte": "reformulacao_2026-09-16", "laudo_lote": "91457 (BN25121020)", "teor_pct": 100.0, "ativo_mg": 0.04, "massa_insumo_mg": 0.04, "linha_anexo": "I·D-biotina; III/IV·Biotina", "e_sal": false, "observacao": "45 → 40 µg (folga 11 % do teto)"}')
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
    'bella-gummy-biotina-em-gummy',
    'Sorbitol líquido 70 %, maltitol, gelatina, água purificada, glicerina vegetal, maltodextrina, pectina cítrica, goma acácia, ácido cítrico (INS 330), citrato de sódio (INS 331), aroma de frutas vermelhas, vitamina C (ácido ascórbico), vitamina E (acetato de DL-alfa-tocoferila), zinco (bisglicinato de zinco), vitamina A (acetato de retinol), biotina (D-biotina), corante vermelho ponceau 4R (INS 124), conservador sorbato de potássio (INS 202) e edulcorante sucralose (INS 955). [PENDENTE — Lei 10.674/2003 obriga "Contém Glúten" ou "Não contém Glúten": só grafar "Não contém glúten" com laudo do produto acabado] [Alergênicos: "Contém: peixe" se a gelatina for de peixe — espécie PENDENTE; sulfitos se o produto atingir 10 mg/kg de SO2 — PENDENTE de cálculo com a massa da maltodextrina]',
    'Este produto não é um medicamento.
Não exceder a recomendação diária de consumo indicada na embalagem.
Mantenha fora do alcance de crianças.
Público indicado: adultos a partir de 19 anos.
O consumo excessivo pode ter efeito laxativo (contém polióis). [base legal a confirmar pelo RT]
Conservar em local seco, fresco e arejado, ao abrigo da luz e do calor excessivo, entre 15 °C e 30 °C. Após aberto, consumir em até 60 dias. Não consumir se o lacre de segurança estiver violado.',
    'INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 6 g (2 gomas)
                                                   6 g   %VD*
Valor energético                                      PENDENTE   
Carboidratos                                          PENDENTE   
n Açúcares totais                                     PENDENTE   
nn Açúcares adicionados                               PENDENTE   
n Polióis totais                                      PENDENTE   
Proteínas                                             PENDENTE   
Gorduras totais                                            0 g   0 %
n Gorduras saturadas                                       0 g   0 %
n Gorduras trans                                           0 g   0 %
Fibras alimentares                                    PENDENTE   
Sódio                                                 PENDENTE   
Vitamina A                                            1.022 µg   128 %
Vitamina E                                              5,7 mg   38 %
Vitamina C                                               45 mg   45 %
Vitamina B7                                              40 µg   133 %
Zinco                                                   2,4 mg   22 %
*Percentual de valores diários fornecidos pela porção',
    '6 g (2 gomas)',
    '{"tabela_nutricional_20260916": {"porcoes_por_embalagem": "30", "porcao": "6 g (2 gomas)", "porcao_coluna": "6 g", "linhas": [{"item": "Valor energético", "quantidade": "PENDENTE", "unidade": "kcal", "vd_pct": null, "nivel": 0, "nota": "memorial não traz massa dos excipientes; rótulo/memorial imprimem 12 kcal = 50 kJ (não recalculável)"}, {"item": "Carboidratos", "quantidade": "PENDENTE", "unidade": "g", "vd_pct": null, "nivel": 0, "nota": "rótulo/memorial: 4,8 g (não recalculável)"}, {"item": "Açúcares totais", "quantidade": "PENDENTE", "unidade": "g", "vd_pct": null, "nivel": 1, "nota": "maltodextrina na base: fração de mono/dissacarídeos não quantificada"}, {"item": "Açúcares adicionados", "quantidade": "PENDENTE", "unidade": "g", "vd_pct": null, "nivel": 2, "nota": "RDC 429 Art. 3 I inclui a fração de mono/dissacarídeos da maltodextrina"}, {"item": "Polióis totais", "quantidade": "PENDENTE", "unidade": "g", "vd_pct": null, "nivel": 1, "nota": "rótulo/memorial: 3,4 g (sorbitol + maltitol; massas não disponíveis)"}, {"item": "Proteínas", "quantidade": "PENDENTE", "unidade": "g", "vd_pct": null, "nivel": 0, "nota": "rótulo/memorial: 0,6 g (gelatina; massa não disponível)"}, {"item": "Gorduras totais", "quantidade": "0", "quantidade_num": 0.0, "unidade": "g", "vd_pct": 0, "nivel": 0, "nota": null}, {"item": "Gorduras saturadas", "quantidade": "0", "quantidade_num": 0.0, "unidade": "g", "vd_pct": 0, "nivel": 1, "nota": null}, {"item": "Gorduras trans", "quantidade": "0", "quantidade_num": 0.0, "unidade": "g", "vd_pct": 0, "nivel": 1, "nota": null}, {"item": "Fibras alimentares", "quantidade": "PENDENTE", "unidade": "g", "vd_pct": null, "nivel": 0, "nota": "pectina e goma acácia são fibras; massas não disponíveis"}, {"item": "Sódio", "quantidade": "PENDENTE", "unidade": "mg", "vd_pct": null, "nivel": 0, "nota": "rótulo/memorial: 8 mg (citrato de sódio; massa não disponível)"}, {"item": "Vitamina A", "quantidade": "1.022", "quantidade_num": 1022.0, "unidade": "µg", "vd_pct": 128, "nivel": 0, "nota": "µg RAE; 1.022 µg calculado, memorial declara 1.020 µg"}, {"item": "Vitamina E", "quantidade": "5,7", "quantidade_num": 5.7, "unidade": "mg", "vd_pct": 38, "nivel": 0, "nota": null}, {"item": "Vitamina C", "quantidade": "45", "quantidade_num": 45.0, "unidade": "mg", "vd_pct": 45, "nivel": 0, "nota": null}, {"item": "Vitamina B7", "quantidade": "40", "quantidade_num": 40.0, "unidade": "µg", "vd_pct": 133, "nivel": 0, "nota": "nome do Anexo XI da IN 75 (\"Vitamina B7\", alternativo \"Biotina\")"}, {"item": "Zinco", "quantidade": "2,4", "quantidade_num": 2.4, "unidade": "mg", "vd_pct": 22, "nivel": 0, "nota": null}], "rodape": "*Percentual de valores diários fornecidos pela porção", "regras": "Arredondamento: IN 75/2020 Anexo III (lido 16/09/2026). %VD: IN 75/2020 Anexo VIII, coluna ≥ 19 anos, sobre a quantidade arredondada (RDC 429 Art. 12). Ordem: IN 75/2020 Anexo XI."}, "reformulacao": {"data": "2026-09-16", "fonte": "docs/conformidade/reformulacao/bella-gummy-biotina-em-gummy.md", "veredito_esperado": "CONFORME CONDICIONADO A (laudo da vitamina A lote 215230 conferido; massas da matriz de goma para fechar a tabela nutricional; laudos vencidos/errados da base renovados)", "porcao_mg": 6000, "soma_porcao_mg": 6000.0, "cabe": true}}'
)) as v(slug, ingredients_list, warnings, nutritional_info, serving_description, metadata)
where f.slug = v.slug
  and f.deleted_at is null
  and (f.ingredients_list is distinct from v.ingredients_list
       or f.warnings is distinct from v.warnings
       or f.nutritional_info is distinct from v.nutritional_info
       or f.serving_description is distinct from v.serving_description
       or coalesce(f.metadata->'reformulacao'->>'data', '') <> '2026-09-16');
