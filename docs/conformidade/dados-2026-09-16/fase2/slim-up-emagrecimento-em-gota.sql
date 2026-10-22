-- =====================================================================================
-- Fase 2 — reformulação regulatória 2026-09-16 — fragmento do produto slim-up-emagrecimento-em-gota
-- Gerado a partir de slim-up-emagrecimento-em-gota.json (mesmos números). Idempotente; casa por SLUG, nunca por UUID.
-- Veredito esperado: CONFORME CONDICIONADO A (definição da porção pelo dono — 1 mL × 2 mL; viabilidade técnica da colina a 221,62 mg/mL confirmada pela fábrica; laudo válido do lote de café verde; laudo do sorbitol líquido e identidade do espessante; conferência dos aditivos para suplemento líquido)
-- A coluna public.formulas.nutritional_info é TEXT no banco (conferido ao vivo em 16/09/2026);
-- por isso a tabela vai como texto no padrão ANVISA e o JSON estruturado vai em formulas.metadata.
-- Sem guarda de contagem aqui (a consolidação põe).
-- =====================================================================================

-- 1. Insumos que faltarem em public.ingredients (nome como no Anexo I / rótulo). on conflict do nothing.
insert into public.ingredients (slug, name, synonyms, category, sort_order, metadata) values
    ('vitamina-d', 'Vitamina D', ARRAY['Vitamina D']::text[], 'vitamina'::public.ingredient_category, 810, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/slim-up-emagrecimento-em-gota.sql"}'::jsonb),
    ('vitamina-b12', 'Vitamina B12', ARRAY['Vitamina B12']::text[], 'vitamina'::public.ingredient_category, 820, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/slim-up-emagrecimento-em-gota.sql"}'::jsonb),
    ('cromo', 'Cromo', ARRAY['Cromo']::text[], 'mineral'::public.ingredient_category, 830, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/slim-up-emagrecimento-em-gota.sql"}'::jsonb),
    ('extrato-de-cafe-verde', 'Extrato de café verde', ARRAY['Extrato de café verde']::text[], 'extrato_vegetal'::public.ingredient_category, 840, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/slim-up-emagrecimento-em-gota.sql"}'::jsonb),
    ('colina', 'Colina', ARRAY['Colina']::text[], 'outro'::public.ingredient_category, 850, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/slim-up-emagrecimento-em-gota.sql"}'::jsonb),
    ('agua-purificada', 'Água purificada', ARRAY['Água purificada']::text[], 'outro'::public.ingredient_category, 860, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/slim-up-emagrecimento-em-gota.sql"}'::jsonb),
    ('glicerina-vegetal', 'Glicerina vegetal', ARRAY['Glicerina vegetal']::text[], 'outro'::public.ingredient_category, 870, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/slim-up-emagrecimento-em-gota.sql"}'::jsonb),
    ('sorbitol-liquido', 'Sorbitol líquido', ARRAY['Sorbitol líquido']::text[], 'outro'::public.ingredient_category, 880, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/slim-up-emagrecimento-em-gota.sql"}'::jsonb),
    ('acido-citrico', 'Ácido cítrico', ARRAY['Ácido cítrico']::text[], 'outro'::public.ingredient_category, 890, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/slim-up-emagrecimento-em-gota.sql"}'::jsonb),
    ('benzoato-de-sodio', 'Benzoato de sódio', ARRAY['Benzoato de sódio']::text[], 'outro'::public.ingredient_category, 900, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/slim-up-emagrecimento-em-gota.sql"}'::jsonb),
    ('sorbato-de-potassio', 'Sorbato de potássio', ARRAY['Sorbato de potássio']::text[], 'outro'::public.ingredient_category, 910, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/slim-up-emagrecimento-em-gota.sql"}'::jsonb),
    ('goma-xantana', 'Goma xantana', ARRAY['Goma xantana']::text[], 'outro'::public.ingredient_category, 920, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/slim-up-emagrecimento-em-gota.sql"}'::jsonb)
on conflict (slug) do nothing;

-- 2. Exclusão LÓGICA das composições ativas atuais da fórmula (só as que não vieram desta reformulação).
update public.formula_compositions fc
set active = false, deleted_at = now(), reason_deleted = 'reformulação regulatória 2026-09-16'
from public.formulas f
where f.id = fc.formula_id and f.deleted_at is null and f.slug = 'slim-up-emagrecimento-em-gota'
  and fc.deleted_at is null
  and coalesce(fc.metadata->>'fonte', '') <> 'reformulacao_2026-09-16';

-- 3. Inserção das composições reformuladas (ingredient_id resolvido por slug em public.ingredients).
insert into public.formula_compositions (formula_id, ingredient_name, quantity, unit, sort_order, ingredient_id, metadata)
select f.id, v.ingredient_name, v.quantity, v.unit::public.composition_unit, v.sort_order, i.id, v.metadata::jsonb
from (values
    ('slim-up-emagrecimento-em-gota', 0, 'Vitamina D3 (colecalciferol)', 15.652, 'mg', 'vitamina-d', '{"fonte": "reformulacao_2026-09-16", "papel": "constituinte", "constituinte_anexo_i": "Vitamina D — Vitamina D_3 (Colecalciferol) (CAS 67-97-0)", "laudo_lote": "91408 (fabricante 2025111601)", "laudo_validade": "15/11/2028", "laudo_vencido": false, "teor_pct": null, "teor_fonte": "potência 115.000 UI/g — lida no laudo 91408; 15,652 mg × 115.000 UI/g = 1.800 UI ÷ 40 UI/µg = 45,0 µg (nota iii do Anexo III: 1 µg = 40 UI)", "ativo_mg": 45.0, "unidade_ativo": "µg", "minimo": 3, "maximo": 50.0, "pct_do_maximo": 90.0, "linha_anexo": "III·Vitamina D^iii (3) / IV·Vitamina D^ii (50,0)", "status": "mantido", "e_sal": false}'),
    ('slim-up-emagrecimento-em-gota', 1, 'Metilcobalamina (vitamina B12)', 8.96, 'mcg', 'vitamina-b12', '{"fonte": "reformulacao_2026-09-16", "papel": "constituinte", "constituinte_anexo_i": "Vitamina B12 — Metilcobalamina (CAS 13422-55-4)", "laudo_lote": "219376 (interno 26B20-B032-219376)", "laudo_validade": "14/11/2030", "laudo_vencido": false, "teor_pct": 89.27, "teor_fonte": "teor tal qual 89,27 % — lido no memorial rev03 (o inventário de laudos registra 98,17 % em BASE ANIDRA para o mesmo lote; a diferença é a umidade descontada — divergência registrada, usado o t.q. do rev03)", "ativo_mg": 8.0, "unidade_ativo": "µg", "minimo": 0.36, "maximo": 9.94, "pct_do_maximo": 80.5, "linha_anexo": "III·Vitamina B_12 (0,36) / IV·Vitamina B_12 (9,94)", "status": "dose ajustada", "e_sal": false, "massa_insumo_mg": 0.00896, "observacao_sql": "gravado em mcg porque quantity é numeric(12,4) e 0,00896 mg perderia precisão"}'),
    ('slim-up-emagrecimento-em-gota', 2, 'Picolinato de cromo (equivalente a 30,85 µg de cromo)', 0.25, 'mg', 'cromo', '{"fonte": "reformulacao_2026-09-16", "papel": "constituinte", "constituinte_anexo_i": "Cromo — Picolinato de cromo (CAS 14639-25-9)", "laudo_lote": "91190", "laudo_validade": "24/12/2027", "laudo_vencido": false, "teor_pct": 12.34, "teor_fonte": "laudo lote 91190 (Cr 12,34 %); 0,25 × 12,34 % = 30,85 µg", "ativo_mg": 30.85, "unidade_ativo": "µg de cromo", "minimo": 5.25, "maximo": 250, "pct_do_maximo": 12.3, "linha_anexo": "III·Cromo (5,25) / IV·Cromo (250)", "status": "mantido", "e_sal": true}'),
    ('slim-up-emagrecimento-em-gota', 3, 'Extrato de café verde', 50.0, 'mg', 'extrato-de-cafe-verde', '{"fonte": "reformulacao_2026-09-16", "papel": "constituinte", "constituinte_anexo_i": "Ácido clorogênico — Extrato de café verde (IN 102/2021)", "laudo_lote": "10269 (IDNLABS)", "laudo_validade": "08/2027", "laudo_vencido": false, "teor_pct": 64.05, "teor_fonte": "laudo lote 10269 (64,05 %; metilxantinas 1,56 %) — lido no inventário", "ativo_mg": 32.02, "unidade_ativo": "mg de ácido clorogênico", "minimo": "NE", "maximo": 400, "pct_do_maximo": 8.0, "linha_anexo": "III·Ácido clorogênico (NE) / IV·Ácido clorogênico (400, redação IN 102/2021)", "status": "mantido (laudo regularizado)", "e_sal": false}'),
    ('slim-up-emagrecimento-em-gota', 4, 'Bitartarato de colina (equivalente a 90 mg de colina)', 221.62, 'mg', 'colina', '{"fonte": "reformulacao_2026-09-16", "papel": "constituinte", "constituinte_anexo_i": "Colina — Bitartarato de colina/Hidrogênio tartarato de colina (CAS 87-67-2)", "laudo_lote": "91442 (fabricante CA26010402USPS)", "laudo_validade": "03/01/2029", "laudo_vencido": false, "teor_pct": 40.61, "teor_fonte": "laudo lote 91442: colina 40,61 % (lido no inventário); 90 ÷ 0,4061 = 221,62 mg; 221,62 × 0,4061 = 90,00 mg", "ativo_mg": 90.0, "unidade_ativo": "mg de colina", "minimo": 82.5, "maximo": 3235.15, "pct_do_maximo": 2.8, "linha_anexo": "III·Colina (82,5) / IV·Colina (3.235,15)", "status": "dose ajustada", "e_sal": true}'),
    ('slim-up-emagrecimento-em-gota', 5, 'Água purificada (q.s.p. 1 mL)', 501.759, 'mg', 'agua-purificada', '{"fonte": "reformulacao_2026-09-16", "papel": "veiculo", "ins": null, "laudo_lote": "sem certificado no dossiê", "observacao": "calculada: 1.000 − 498,24 mg de sólidos (densidade 1 g/mL assumida, como no rev03)."}'),
    ('slim-up-emagrecimento-em-gota', 6, 'Umectante glicerina', 133.3, 'mg', 'glicerina-vegetal', '{"fonte": "reformulacao_2026-09-16", "papel": "aditivo", "ins": "INS 422", "laudo_lote": "não informado", "observacao": "igual ao rev03 e ao rótulo. Limites da IN 211/2023 para suplemento LÍQUIDO não conferidos nesta tarefa (a auditoria de 15/09 só conferiu a categoria 14.2, sólidos) — PENDENTE."}'),
    ('slim-up-emagrecimento-em-gota', 7, 'Umectante sorbitol líquido 70 %', 66.7, 'mg', 'sorbitol-liquido', '{"fonte": "reformulacao_2026-09-16", "papel": "aditivo", "ins": "INS 420", "laudo_lote": "106371 (Adicel) — laudo é de sorbitol EM PÓ, fórmula usa líquido 70 %: divergência aberta", "observacao": "46,69 mg de sorbitol (poliol) por porção."}'),
    ('slim-up-emagrecimento-em-gota', 8, 'Acidulante ácido cítrico', 6.7, 'mg', 'acido-citrico', '{"fonte": "reformulacao_2026-09-16", "papel": "aditivo", "ins": "INS 330", "laudo_lote": "GE2844AFG", "observacao": "igual ao rev03."}'),
    ('slim-up-emagrecimento-em-gota', 9, 'Conservador benzoato de sódio', 1.67, 'mg', 'benzoato-de-sodio', '{"fonte": "reformulacao_2026-09-16", "papel": "aditivo", "ins": "INS 211", "laudo_lote": "950430 (99,77 %, validade 25/04/2028)", "observacao": "sódio: 1,67 × 99,77 % × 15,95 % = 0.266 mg (estequiometria 22,99/144,1)."}'),
    ('slim-up-emagrecimento-em-gota', 10, 'Conservador sorbato de potássio', 1.67, 'mg', 'sorbato-de-potassio', '{"fonte": "reformulacao_2026-09-16", "papel": "aditivo", "ins": "INS 202", "laudo_lote": "91202 (100,30 %, validade 05/01/2028)", "observacao": "igual ao rev03."}'),
    ('slim-up-emagrecimento-em-gota', 11, 'Espessante goma xantana', 0.67, 'mg', 'goma-xantana', '{"fonte": "reformulacao_2026-09-16", "papel": "aditivo", "ins": "INS 415", "laudo_lote": "sem certificado no dossiê", "observacao": "rev03 = 0,67 mg (rótulo); rev02 usava 0,070 mg; a ficha técnica antiga chama de ''goma arábica'' (INS 414) — identidade a confirmar."}')
) as v(slug, sort_order, ingredient_name, quantity, unit, ingredient_slug, metadata)
join public.formulas f on f.slug = v.slug and f.deleted_at is null
join public.ingredients i on i.slug = v.ingredient_slug and i.deleted_at is null
where not exists (
    select 1 from public.formula_compositions x
    where x.formula_id = f.id and x.deleted_at is null and x.metadata->>'fonte' = 'reformulacao_2026-09-16'
);

-- 4. Dizeres de rotulagem, tabela nutricional (texto) e porção; JSON da tabela em metadata.
update public.formulas f set
    ingredients_list    = 'Água purificada, bitartarato de colina, umectante glicerina (INS 422), umectante sorbitol (INS 420), extrato de café verde (Coffea canephora — espécie conforme laudo do lote), vitamina D3 (colecalciferol), acidulante ácido cítrico (INS 330), conservadores benzoato de sódio (INS 211) e sorbato de potássio (INS 202), espessante goma xantana (INS 415), picolinato de cromo, metilcobalamina (vitamina B12).',
    warnings            = 'Este produto não é um medicamento.
Público indicado: adultos (19 anos ou mais).
Não exceder a recomendação diária de consumo indicada na embalagem.
Mantenha fora do alcance de crianças.
Este produto não deve ser consumido por gestantes, lactantes e crianças.
Conservar em local seco, fresco e ao abrigo da luz. Após aberto, manter a embalagem bem fechada e seguir as orientações do rótulo.',
    nutritional_info    = 'INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 1 mL (30 gotas)
Quantidade por porção | %VD*
Valor energético 0,67 kcal = 2.8 kJ | 0%
Carboidratos 0 g | 0%
Açúcares totais 0 g | 0%
Açúcares adicionados 0 g | 0%
Proteínas 0 g | 0%
Gorduras totais 0 g | 0%
Gorduras saturadas 0 g | 0%
Gorduras trans 0 g | 0%
Fibras alimentares 0 g | 0%
Sódio 0,27 mg | 0%
Vitamina D 45 µg | 300%
Vitamina B12 8 µg | 333%
Cromo 31 µg | 88%
Colina 90 mg | 16%
Ácido clorogênico 32 mg |
*Percentual de valores diários fornecidos pela porção',
    serving_description = '1 mL (30 gotas), 1 vez ao dia — porção do memorial rev03; o cadastro diz 2 mL (decisão do dono, ver pendências)',
    metadata            = f.metadata || jsonb_build_object('tabela_nutricional_2026_09_16', '{"porcoes_por_embalagem": 30, "porcao": "1 mL (30 gotas)", "linhas": [{"item": "Valor energético", "quantidade": 0.67, "unidade": "kcal", "vd_pct": 0, "kj": 2.8, "nota": "glicerina 4 kcal/g e sorbitol 2,4 kcal/g — fatores PROVISÓRIOS (Anexo XXII não relido)"}, {"item": "Carboidratos", "quantidade": 0.0, "unidade": "g", "vd_pct": 0, "nota": "sorbitol (poliol) 0,047 g → 0 g; ≤ 0,5 g"}, {"item": "Açúcares totais", "quantidade": 0.0, "unidade": "g", "vd_pct": 0}, {"item": "Açúcares adicionados", "quantidade": 0.0, "unidade": "g", "vd_pct": 0}, {"item": "Proteínas", "quantidade": 0.0, "unidade": "g", "vd_pct": 0}, {"item": "Gorduras totais", "quantidade": 0.0, "unidade": "g", "vd_pct": 0}, {"item": "Gorduras saturadas", "quantidade": 0.0, "unidade": "g", "vd_pct": 0}, {"item": "Gorduras trans", "quantidade": 0.0, "unidade": "g", "vd_pct": 0}, {"item": "Fibras alimentares", "quantidade": 0.0, "unidade": "g", "vd_pct": 0}, {"item": "Sódio", "quantidade": 0.27, "unidade": "mg", "vd_pct": 0, "nota": "0,27 mg do benzoato de sódio; ≤ 5 mg → %VD 0"}, {"item": "Vitamina D", "quantidade": 45, "unidade": "µg", "vd_pct": 300}, {"item": "Vitamina B12", "quantidade": 8, "unidade": "µg", "vd_pct": 333}, {"item": "Cromo", "quantidade": 31, "unidade": "µg", "vd_pct": 88}, {"item": "Colina", "quantidade": 90, "unidade": "mg", "vd_pct": 16}, {"item": "Ácido clorogênico", "quantidade": 32, "unidade": "mg", "vd_pct": null}], "rodape": "*Percentual de valores diários fornecidos pela porção", "regras": "Arredondamento: Anexo III IN 75/2020 (paráfrase). %VD: Anexo VIII (adultos); macros: Anexo II. Não significativo: %VD 0. Sem VDR: em branco. Colina em linha própria (Anexo XI, item 9)."}'::jsonb, 'reformulacao_2026_09_16', '{"data": "2026-09-16", "veredito": "CONFORME CONDICIONADO A (definição da porção pelo dono — 1 mL × 2 mL; viabilidade técnica da colina a 221,62 mg/mL confirmada pela fábrica; laudo válido do lote de café verde; laudo do sorbitol líquido e identidade do espessante; conferência dos aditivos para suplemento líquido)", "porcao_mg": 1000.0, "soma_porcao_mg": 1000.0, "cabe": true, "pendencias": ["Dono: porção — o rev03 (14/09) define 1 mL = 30 gotas (30 porções/frasco de 30 mL); o cadastro diz 2 mL. A proposta é por dose diária de 1 mL; se a porção ficar em 2 mL, as concentrações por mL caem pela metade (mesma dose diária) e o frasco rende 15 porções.", "Fábrica: viabilidade de 221,62 mg de bitartarato de colina em 1 mL (solubilidade, estabilidade, sabor); sólidos por mL sobem para 498,24 mg. Se inviável, alternativa é retirar a colina (não há como atingir 82,5 mg com menos massa).", "Café verde: lote com laudo válido (IDNLABS 10269 — ''solúvel'', adequado a gotas) ou laudo completo do HERBALTEC 10841; espécie do rótulo = espécie do laudo.", "Sorbitol: o laudo em disco (lote 106371) é de sorbitol em pó; a fórmula usa líquido 70 % — obter laudo do insumo real.", "Goma xantana (INS 415) × goma arábica (INS 414): confirmar a identidade do espessante e obter certificado.", "Aditivos em suplemento LÍQUIDO: limites da IN 211/2023 para a categoria de líquidos não foram conferidos nesta tarefa (a auditoria de 15/09 só cobriu a 14.2, sólidos) — conferir glicerina, sorbitol, benzoato, sorbato e goma xantana.", "Vitamina B12: divergência de teor entre rev03 (89,27 % tal qual) e inventário de laudos (98,17 % base anidra) para o mesmo lote 219376 — a fábrica confirma qual base usa na pesagem.", "Vitamina D3: manter 45 µg (90 % do teto) ou baixar para 40 µg (13,913 mg do pó) para folga maior — decisão do RT.", "Assinar o memorial rev03 (hoje rascunho) e atualizar a ficha técnica (ainda com D 50 µg, B12 9,94 µg e ''goma arábica'')."]}'::jsonb)
where f.slug = 'slim-up-emagrecimento-em-gota' and f.deleted_at is null;
