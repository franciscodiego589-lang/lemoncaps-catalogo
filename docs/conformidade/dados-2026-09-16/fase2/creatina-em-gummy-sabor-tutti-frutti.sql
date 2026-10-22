-- =====================================================================================
-- LEMON CAPS - CATALOGO PUBLICO - REFORMULACAO REGULATORIA 2026-09-16
-- Fragmento para o slug: creatina-em-gummy-sabor-tutti-frutti
-- Fonte: docs/conformidade/reformulacao/creatina-em-gummy-sabor-tutti-frutti.md (memorial de reformulacao, 2026-09-16)
--        scratchpad/fase2/creatina-em-gummy-sabor-tutti-frutti.json (dados estruturados)
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
-- Veredito esperado: CONFORME NOS LIMITES (fórmula proposta) · NÃO RESOLVIDO na porção: CONDICIONADO A pesagem da goma acabada, doseamento de creatina/creatinina no produto acabado e estudo de estabilidade; e a documentação própria do sabor tutti-frutti (aroma, corante, laudos)
-- =====================================================================================

-- 1. Exclusao logica das composicoes ativas atuais
update public.formula_compositions fc
set active = false,
    deleted_at = now(),
    reason_deleted = 'reformulação regulatória 2026-09-16'
from public.formulas f
where f.id = fc.formula_id
  and f.deleted_at is null
  and f.slug = 'creatina-em-gummy-sabor-tutti-frutti'
  and fc.deleted_at is null
  and coalesce(fc.metadata->>'fonte', '') <> 'reformulacao_2026-09-16';

-- 3. Insercao das composicoes reformuladas
insert into public.formula_compositions (formula_id, ingredient_name, quantity, unit, sort_order, ingredient_id, metadata)
select f.id, v.ingredient_name, v.quantity, v.unit::public.composition_unit, v.sort_order, i.id, v.metadata::jsonb
from (values
    ('creatina-em-gummy-sabor-tutti-frutti', 0, 'Creatina monoidratada', 3500, 'mg', 'creatina-monoidratada', '{"fonte": "reformulacao_2026-09-16", "laudo_lote": "217949 (26A05-B023-217949)", "teor_pct": 100.5, "ativo_mg": 3517.5, "ativo_leitura_b_mg": 3112.9, "massa_insumo_mg": 3500, "linha_anexo": "I·Creatina monohidratada; III·Creatina 3.000; IV·Creatina 5.000", "e_sal": false, "observacao": "3.000 → 3.500 mg: folga sobre o mínimo (degradação a creatinina na goma)"}')
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
    'creatina-em-gummy-sabor-tutti-frutti',
    'Creatina monoidratada, sorbitol líquido, maltitol, gelatina (agente de textura), água purificada, glicerina vegetal (umectante), ácido cítrico (INS 330), pectina cítrica (espessante), aroma de tutti-frutti, citrato de sódio (INS 331), corante [nome técnico e INS PENDENTES — "corante rosa" na OP], conservador sorbato de potássio (INS 202) e edulcorante sucralose (INS 955). [PENDENTE — Lei 10.674/2003 obriga "Contém Glúten" ou "Não contém Glúten": só grafar "Não contém glúten" com laudo do produto acabado] [Alergênicos: "Contém: peixe" se a gelatina for de peixe — espécie PENDENTE]',
    'Este produto não é um medicamento.
Não exceder a recomendação diária de consumo indicada na embalagem.
Mantenha fora do alcance de crianças.
Público indicado: adultos a partir de 19 anos.
Este produto não deve ser consumido por gestantes, lactantes e crianças.
O consumo excessivo pode ter efeito laxativo (contém polióis). [base legal a confirmar pelo RT]
Conservar em local seco, fresco e arejado, ao abrigo da luz e do calor excessivo, entre 15 °C e 30 °C. Após aberto, consumir em até 60 dias. Não consumir se o lacre de segurança estiver violado.',
    'INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 6 g (2 gomas)
                                                   6 g   %VD*
Valor energético                                9 kcal = 39 kJ   0 %
Carboidratos                                             2,5 g   1 %
n Açúcares totais                                          0 g   
nn Açúcares adicionados                                    0 g   0 %
n Polióis totais                                         2,5 g   
nn Sorbitol                                              1,2 g   
nn Maltitol                                              1,3 g   
Proteínas                                                0,7 g   1 %
Gorduras totais                                            0 g   0 %
n Gorduras saturadas                                       0 g   0 %
n Gorduras trans                                           0 g   0 %
Fibras alimentares                                         0 g   0 %
Sódio                                                     0 mg   0 %
Creatina                                              3.500 mg   
*Percentual de valores diários fornecidos pela porção',
    '6 g (2 gomas) — massa da porção a confirmar por pesagem',
    '{"tabela_nutricional_20260916": {"porcoes_por_embalagem": "30", "porcao": "6 g (2 gomas)", "porcao_coluna": "6 g", "linhas": [{"item": "Valor energético", "quantidade": "9", "unidade": "kcal", "kj": "39", "quantidade_num": 9.0, "vd_pct": 0, "nivel": 0, "nota": "sorbitol 1,225 g × 2,6 + maltitol 1,256 g × 2,1 + proteína 0,656 g × 4 + ácido cítrico 0,168 g × 3 + pectina 0,126 g × 2 = 9,20 kcal (glicerina 0,245 g sem fator no Anexo XXII: se contada a 4 kcal/g → 10,18 kcal — decisão do RT)"}, {"item": "Carboidratos", "quantidade": "2,5", "quantidade_num": 2.5, "unidade": "g", "vd_pct": 1, "nivel": 0, "nota": "= polióis 2,481 g; sem açúcares. Glicerina (0,245 g) NÃO incluída: sem fator no Anexo XXII da IN 75 nem enquadramento como carboidrato na RDC 429 Art. 3 VIII — se o RT a contar como carboidrato a 4 kcal/g, carboidratos = 2,7 g e energia = 10 kcal"}, {"item": "Açúcares totais", "quantidade": "0", "quantidade_num": 0.0, "unidade": "g", "vd_pct": null, "nivel": 1, "nota": "sem açúcares na receita (polióis excluídos por definição, RDC 429 Art. 3 II)"}, {"item": "Açúcares adicionados", "quantidade": "0", "quantidade_num": 0.0, "unidade": "g", "vd_pct": 0, "nivel": 2, "nota": null}, {"item": "Polióis totais", "quantidade": "2,5", "quantidade_num": 2.5, "unidade": "g", "vd_pct": null, "nivel": 1, "nota": "sorbitol 1,225 g + maltitol 1,256 g = 2,481 g (rótulo atual diz 2,7 g)"}, {"item": "Sorbitol", "quantidade": "1,2", "quantidade_num": 1.2, "unidade": "g", "vd_pct": null, "nivel": 2, "nota": null}, {"item": "Maltitol", "quantidade": "1,3", "quantidade_num": 1.3, "unidade": "g", "vd_pct": null, "nivel": 2, "nota": null}, {"item": "Proteínas", "quantidade": "0,7", "quantidade_num": 0.7, "unidade": "g", "vd_pct": 1, "nivel": 0, "nota": "gelatina 700 mg × N 15,0 % × 6,25 = 0,656 g (com fator 5,55 da gelatina: 0,58 g — critério do RT); rótulo atual diz 0,4 g"}, {"item": "Gorduras totais", "quantidade": "0", "quantidade_num": 0.0, "unidade": "g", "vd_pct": 0, "nivel": 0, "nota": null}, {"item": "Gorduras saturadas", "quantidade": "0", "quantidade_num": 0.0, "unidade": "g", "vd_pct": 0, "nivel": 1, "nota": null}, {"item": "Gorduras trans", "quantidade": "0", "quantidade_num": 0.0, "unidade": "g", "vd_pct": 0, "nivel": 1, "nota": null}, {"item": "Fibras alimentares", "quantidade": "0", "quantidade_num": 0.0, "unidade": "g", "vd_pct": 0, "nivel": 0, "nota": "pectina 140 mg × 90 % = 0,126 g ≤ 0,5 g → não significativa → 0"}, {"item": "Sódio", "quantidade": "0", "quantidade_num": 0.0, "unidade": "mg", "vd_pct": 0, "nivel": 0, "nota": "citrato de sódio 14 mg → 3,3–3,7 mg de Na (≤ 5 mg → 0); rótulo atual diz 10 mg — sem lastro no memorial; PENDENTE análise de sódio no produto acabado"}, {"item": "Creatina", "quantidade": "3.500", "quantidade_num": 3500.0, "unidade": "mg", "vd_pct": null, "nivel": 0, "nota": "sem VDR: %VD em branco. Massa nominal de creatina monoidratada; lote 217949: 3.517,5 mg (leitura A) ou 3.113 mg de creatina anidra (leitura B)"}], "rodape": "*Percentual de valores diários fornecidos pela porção", "regras": "Arredondamento: IN 75/2020 Anexo III. Não significativo: Anexo IV. Ordem/indentação: Anexo XI. Energia: Anexo XXII (sorbitol 2,6; maltitol 2,1; proteínas 4; ácidos orgânicos 3; fibras solúveis 2)."}, "reformulacao": {"data": "2026-09-16", "fonte": "docs/conformidade/reformulacao/creatina-em-gummy-sabor-tutti-frutti.md", "veredito_esperado": "CONFORME NOS LIMITES (fórmula proposta) · NÃO RESOLVIDO na porção: CONDICIONADO A pesagem da goma acabada, doseamento de creatina/creatinina no produto acabado e estudo de estabilidade; e a documentação própria do sabor tutti-frutti (aroma, corante, laudos)", "porcao_mg": 6000, "soma_porcao_mg": 8109.97, "cabe": false}}'
)) as v(slug, ingredients_list, warnings, nutritional_info, serving_description, metadata)
where f.slug = v.slug
  and f.deleted_at is null
  and (f.ingredients_list is distinct from v.ingredients_list
       or f.warnings is distinct from v.warnings
       or f.nutritional_info is distinct from v.nutritional_info
       or f.serving_description is distinct from v.serving_description
       or coalesce(f.metadata->'reformulacao'->>'data', '') <> '2026-09-16');
