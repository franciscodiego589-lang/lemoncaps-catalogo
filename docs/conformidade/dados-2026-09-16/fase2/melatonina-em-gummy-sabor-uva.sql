-- =====================================================================================
-- LEMON CAPS - CATALOGO PUBLICO - REFORMULACAO REGULATORIA 2026-09-16
-- Fragmento para o slug: melatonina-em-gummy-sabor-uva
-- Fonte: docs/conformidade/reformulacao/melatonina-em-gummy-sabor-uva.md (memorial de reformulacao, 2026-09-16)
--        scratchpad/fase2/melatonina-em-gummy-sabor-uva.json (dados estruturados)
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
-- Veredito esperado: CONFORME CONDICIONADO A (laudo novo de melatonina; laudo completo/novo de L-triptofano; decisão versão A/B)
-- =====================================================================================

-- 1. Exclusao logica das composicoes ativas atuais
update public.formula_compositions fc
set active = false,
    deleted_at = now(),
    reason_deleted = 'reformulação regulatória 2026-09-16'
from public.formulas f
where f.id = fc.formula_id
  and f.deleted_at is null
  and f.slug = 'melatonina-em-gummy-sabor-uva'
  and fc.deleted_at is null
  and coalesce(fc.metadata->>'fonte', '') <> 'reformulacao_2026-09-16';

-- 3. Insercao das composicoes reformuladas
insert into public.formula_compositions (formula_id, ingredient_name, quantity, unit, sort_order, ingredient_id, metadata)
select f.id, v.ingredient_name, v.quantity, v.unit::public.composition_unit, v.sort_order, i.id, v.metadata::jsonb
from (values
    ('melatonina-em-gummy-sabor-uva', 0, 'L-triptofano', 750, 'mg', 'l-triptofano', '{"fonte": "reformulacao_2026-09-16", "laudo_lote": "950388", "teor_pct": 99.9, "ativo_mg": 750.0, "massa_insumo_mg": 750.75, "linha_anexo": "I·L-Triptofano; III·Triptofano 42; IV·Triptofano 860", "e_sal": false, "observacao": "800 → 750 mg (87,2 % do teto)"}'),
    ('melatonina-em-gummy-sabor-uva', 1, 'Melatonina', 0.18, 'mg', 'melatonina', '{"fonte": "reformulacao_2026-09-16", "laudo_lote": "950151 (VENCIDO 09/12/2024 — último teor conhecido)", "teor_pct": 99.33, "ativo_mg": 0.18, "massa_insumo_mg": 0.1812, "linha_anexo": "I·Melatonina; IV·Melatonina 0,21", "e_sal": false, "observacao": "0,21 → 0,18 mg (85,7 % do teto)"}')
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
    'melatonina-em-gummy-sabor-uva',
    'Sorbitol líquido, maltitol, gelatina, L-triptofano, água purificada, glicerina vegetal, maltodextrina, pectina cítrica, goma acácia, ácido cítrico (INS 330), aroma de uva, citrato de sódio (INS 331), conservador sorbato de potássio (INS 202), edulcorante sucralose (INS 955), corante vermelho 40 (INS 129), corante azul brilhante FCF (INS 133) e melatonina. Não contém glúten [ensaio MGW RG 005706/03/2026, < 10 ppm, lote G20/1550]. [Alergênicos: "Contém: peixe" se a gelatina for de peixe — espécie PENDENTE]',
    'Este produto não é um medicamento.
Não exceder a recomendação diária de consumo indicada na embalagem.
Mantenha fora do alcance de crianças.
Público indicado: adultos a partir de 19 anos.
Este produto não deve ser consumido por gestantes, lactantes, crianças e pessoas envolvidas em atividades que requerem atenção constante. Pessoas com enfermidades e/ou sob o uso de medicamentos, consulte seu médico.
Este produto não deve ser consumido por gestantes, lactantes e crianças.
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
n L-triptofano                                          750 mg   
Gorduras totais                                            0 g   0 %
n Gorduras saturadas                                       0 g   0 %
n Gorduras trans                                           0 g   0 %
Fibras alimentares                                    PENDENTE   
Sódio                                                 PENDENTE   
Melatonina                                             0,18 mg   
*Percentual de valores diários fornecidos pela porção',
    '6 g (2 gomas)',
    '{"tabela_nutricional_20260916": {"porcoes_por_embalagem": "30", "porcao": "6 g (2 gomas)", "porcao_coluna": "6 g", "linhas": [{"item": "Valor energético", "quantidade": "PENDENTE", "unidade": "kcal", "vd_pct": null, "nivel": 0, "nota": "memorial sem massa dos excipientes; rótulo/memorial: 11 kcal = 46 kJ (não recalculável)"}, {"item": "Carboidratos", "quantidade": "PENDENTE", "unidade": "g", "vd_pct": null, "nivel": 0, "nota": "rótulo/memorial: 4,5 g"}, {"item": "Açúcares totais", "quantidade": "PENDENTE", "unidade": "g", "vd_pct": null, "nivel": 1, "nota": "maltodextrina na base — fração de mono/dissacarídeos não quantificada"}, {"item": "Açúcares adicionados", "quantidade": "PENDENTE", "unidade": "g", "vd_pct": null, "nivel": 2, "nota": null}, {"item": "Polióis totais", "quantidade": "PENDENTE", "unidade": "g", "vd_pct": null, "nivel": 1, "nota": "rótulo/memorial: 3,4 g"}, {"item": "Proteínas", "quantidade": "PENDENTE", "unidade": "g", "vd_pct": null, "nivel": 0, "nota": "rótulo/memorial: 0,8 g (gelatina; massa não disponível)"}, {"item": "L-triptofano", "quantidade": "750", "quantidade_num": 750.0, "unidade": "mg", "vd_pct": null, "nivel": 1, "nota": "aminoácido específico, 1º nível sob Proteínas (Anexo XI); sem VDR"}, {"item": "Gorduras totais", "quantidade": "0", "quantidade_num": 0.0, "unidade": "g", "vd_pct": 0, "nivel": 0, "nota": null}, {"item": "Gorduras saturadas", "quantidade": "0", "quantidade_num": 0.0, "unidade": "g", "vd_pct": 0, "nivel": 1, "nota": null}, {"item": "Gorduras trans", "quantidade": "0", "quantidade_num": 0.0, "unidade": "g", "vd_pct": 0, "nivel": 1, "nota": null}, {"item": "Fibras alimentares", "quantidade": "PENDENTE", "unidade": "g", "vd_pct": null, "nivel": 0, "nota": "pectina/goma acácia; massas não disponíveis"}, {"item": "Sódio", "quantidade": "PENDENTE", "unidade": "mg", "vd_pct": null, "nivel": 0, "nota": "rótulo/memorial: 8 mg"}, {"item": "Melatonina", "quantidade": "0,18", "quantidade_num": 0.18, "unidade": "mg", "vd_pct": null, "nivel": 0, "nota": "substância bioativa; sem VDR → %VD em branco"}], "rodape": "*Percentual de valores diários fornecidos pela porção", "regras": "Arredondamento: IN 75/2020 Anexo III (0,180 mg → \"0,18\"). Ordem: Anexo XI."}, "reformulacao": {"data": "2026-09-16", "fonte": "docs/conformidade/reformulacao/melatonina-em-gummy-sabor-uva.md", "veredito_esperado": "CONFORME CONDICIONADO A (laudo novo de melatonina; laudo completo/novo de L-triptofano; decisão versão A/B)", "porcao_mg": 6000, "soma_porcao_mg": 6000.0, "cabe": true}}'
)) as v(slug, ingredients_list, warnings, nutritional_info, serving_description, metadata)
where f.slug = v.slug
  and f.deleted_at is null
  and (f.ingredients_list is distinct from v.ingredients_list
       or f.warnings is distinct from v.warnings
       or f.nutritional_info is distinct from v.nutritional_info
       or f.serving_description is distinct from v.serving_description
       or coalesce(f.metadata->'reformulacao'->>'data', '') <> '2026-09-16');
