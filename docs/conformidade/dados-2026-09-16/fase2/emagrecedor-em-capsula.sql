-- =====================================================================================
-- Fase 2 — reformulação regulatória 2026-09-16 — fragmento do produto emagrecedor-em-capsula
-- Gerado a partir de emagrecedor-em-capsula.json (mesmos números). Idempotente; casa por SLUG, nunca por UUID.
-- Veredito esperado: CONFORME CONDICIONADO A (aprovação pelo dono/RT da fórmula reconstruída e emissão de memorial de cálculo pela fábrica; laudo válido do lote de café verde; validade do laudo da vitamina A; posição do RT sobre exigência de fabricante do painel)
-- A coluna public.formulas.nutritional_info é TEXT no banco (conferido ao vivo em 16/09/2026);
-- por isso a tabela vai como texto no padrão ANVISA e o JSON estruturado vai em formulas.metadata.
-- Sem guarda de contagem aqui (a consolidação põe).
-- =====================================================================================

-- 1. Insumos que faltarem em public.ingredients (nome como no Anexo I / rótulo). on conflict do nothing.
insert into public.ingredients (slug, name, synonyms, category, sort_order, metadata) values
    ('extrato-de-cafe-verde', 'Extrato de café verde', ARRAY['Extrato de café verde']::text[], 'extrato_vegetal'::public.ingredient_category, 810, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/emagrecedor-em-capsula.sql"}'::jsonb),
    ('extrato-de-laranja-moro', 'Extrato de laranja moro', ARRAY['Extrato de laranja moro']::text[], 'extrato_vegetal'::public.ingredient_category, 820, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/emagrecedor-em-capsula.sql"}'::jsonb),
    ('cromo', 'Cromo', ARRAY['Cromo']::text[], 'mineral'::public.ingredient_category, 830, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/emagrecedor-em-capsula.sql"}'::jsonb),
    ('vitamina-a', 'Vitamina A', ARRAY['Vitamina A']::text[], 'vitamina'::public.ingredient_category, 840, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/emagrecedor-em-capsula.sql"}'::jsonb),
    ('maltodextrina', 'Maltodextrina', ARRAY['Maltodextrina']::text[], 'outro'::public.ingredient_category, 850, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/emagrecedor-em-capsula.sql"}'::jsonb),
    ('dioxido-de-silicio', 'Dióxido de silício', ARRAY['Dióxido de silício']::text[], 'outro'::public.ingredient_category, 860, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/emagrecedor-em-capsula.sql"}'::jsonb)
on conflict (slug) do nothing;

-- 2. Exclusão LÓGICA das composições ativas atuais da fórmula (só as que não vieram desta reformulação).
update public.formula_compositions fc
set active = false, deleted_at = now(), reason_deleted = 'reformulação regulatória 2026-09-16'
from public.formulas f
where f.id = fc.formula_id and f.deleted_at is null and f.slug = 'emagrecedor-em-capsula'
  and fc.deleted_at is null
  and coalesce(fc.metadata->>'fonte', '') <> 'reformulacao_2026-09-16';

-- 3. Inserção das composições reformuladas (ingredient_id resolvido por slug em public.ingredients).
insert into public.formula_compositions (formula_id, ingredient_name, quantity, unit, sort_order, ingredient_id, metadata)
select f.id, v.ingredient_name, v.quantity, v.unit::public.composition_unit, v.sort_order, i.id, v.metadata::jsonb
from (values
    ('emagrecedor-em-capsula', 0, 'Extrato de café verde', 100.0, 'mg', 'extrato-de-cafe-verde', '{"fonte": "reformulacao_2026-09-16", "papel": "constituinte", "constituinte_anexo_i": "Ácido clorogênico — Extrato de café verde (IN 102/2021)", "laudo_lote": "10269 (IDNLABS)", "laudo_validade": "08/2027", "laudo_vencido": false, "teor_pct": 64.05, "teor_fonte": "laudo lote 10269 (ácido clorogênico 64,05 %; metilxantinas 1,56 %) — lido no inventário", "ativo_mg": 64.05, "unidade_ativo": "mg de ácido clorogênico", "minimo": "NE", "maximo": 400, "pct_do_maximo": 16.0, "linha_anexo": "III·Ácido clorogênico (NE) / IV·Ácido clorogênico (400, redação IN 102/2021)", "status": "mantido (com laudo)", "e_sal": false}'),
    ('emagrecedor-em-capsula', 1, 'Extrato de laranja moro (Citrus sinensis (L.) Osbeck)', 5.0, 'mg', 'extrato-de-laranja-moro', '{"fonte": "reformulacao_2026-09-16", "papel": "constituinte", "constituinte_anexo_i": "Antocianinas da laranja moro — Extrato de laranja moro (Citrus sinensis (L.) Osbeck) (IN 336/2024)", "laudo_lote": "17624 (AllPremium)", "laudo_validade": "09/04/2027", "laudo_vencido": false, "teor_pct": 1.47, "teor_fonte": "laudo lote 17624 (1,47 %)", "ativo_mg": 0.0735, "unidade_ativo": "mg de antocianinas", "minimo": "NE", "maximo": 5, "pct_do_maximo": 1.5, "linha_anexo": "III·Antocianinas da laranja moro (NE, IN 336/2024) / IV·Antocianinas da laranja moro (5)", "status": "mantido (com laudo)", "e_sal": false}'),
    ('emagrecedor-em-capsula', 2, 'Picolinato de cromo (equivalente a 200 µg de cromo)', 1.62, 'mg', 'cromo', '{"fonte": "reformulacao_2026-09-16", "papel": "constituinte", "constituinte_anexo_i": "Cromo — Picolinato de cromo (CAS 14639-25-9)", "laudo_lote": "91190", "laudo_validade": "24/12/2027", "laudo_vencido": false, "teor_pct": 12.34, "teor_fonte": "laudo lote 91190 (Cr 12,34 %); 200 ÷ 0,1234 = 1,62 mg; 1,62 × 12,34 % = 199,9 µg", "ativo_mg": 199.9, "unidade_ativo": "µg de cromo", "minimo": 5.25, "maximo": 250, "pct_do_maximo": 80.0, "linha_anexo": "III·Cromo (5,25) / IV·Cromo (250)", "status": "dose ajustada", "e_sal": true}'),
    ('emagrecedor-em-capsula', 3, 'Acetato de retinila (vitamina A)', 8.8, 'mg', 'vitamina-a', '{"fonte": "reformulacao_2026-09-16", "papel": "constituinte", "constituinte_anexo_i": "Vitamina A — Acetato de retinol/Acetato de retinila (CAS 127-47-9)", "laudo_lote": "215230", "laudo_validade": "não confirmada em disco (scan)", "laudo_vencido": null, "teor_pct": null, "teor_fonte": "568.116 UI/g lido no memorial do Moro Slim/Floravex; 8,80 mg × 568.116 UI/g = 4.999,4 UI × 0,3 = 1.499,8 µg RAE. A ficha pesava ''1,5 mg'', o que entregaria ~256 µg RAE", "ativo_mg": 1499.8, "unidade_ativo": "µg RAE", "minimo": 135, "maximo": 2623.61, "pct_do_maximo": 57.2, "linha_anexo": "III·Vitamina A^ii (135) / IV·Vitamina A^i (2.623,61)", "status": "mantido (massa do insumo corrigida)", "e_sal": false}'),
    ('emagrecedor-em-capsula', 4, 'Maltodextrina (excipiente, q.s.p.)', 879.58, 'mg', 'maltodextrina', '{"fonte": "reformulacao_2026-09-16", "papel": "veiculo", "ins": null, "laudo_lote": "a definir", "observacao": "PROPOSTA para manter 2 cápsulas (1 g); com só 120 mg de insumos, a fábrica pode preferir 1 cápsula pequena por dia — decisão do dono."}'),
    ('emagrecedor-em-capsula', 5, 'Antiumectante dióxido de silício', 5.0, 'mg', 'dioxido-de-silicio', '{"fonte": "reformulacao_2026-09-16", "papel": "aditivo", "ins": "INS 551", "laudo_lote": "—", "observacao": "quantum satis; a ficha o cita sem massa."}')
) as v(slug, sort_order, ingredient_name, quantity, unit, ingredient_slug, metadata)
join public.formulas f on f.slug = v.slug and f.deleted_at is null
join public.ingredients i on i.slug = v.ingredient_slug and i.deleted_at is null
where not exists (
    select 1 from public.formula_compositions x
    where x.formula_id = f.id and x.deleted_at is null and x.metadata->>'fonte' = 'reformulacao_2026-09-16'
);

-- 4. Dizeres de rotulagem, tabela nutricional (texto) e porção; JSON da tabela em metadata.
update public.formulas f set
    ingredients_list    = 'Maltodextrina, extrato de café verde (Coffea canephora — espécie conforme laudo do lote; conferir antes de imprimir), acetato de retinila, antiumectante dióxido de silício (INS 551), extrato de laranja moro (Citrus sinensis (L.) Osbeck), picolinato de cromo; cápsula: gelatina (composição da cápsula a confirmar com a fábrica).',
    warnings            = 'Este produto não é um medicamento.
Público indicado: adultos (19 anos ou mais).
Não exceder a recomendação diária de consumo indicada na embalagem.
Mantenha fora do alcance de crianças.
Este produto não deve ser consumido por gestantes, lactantes e crianças.
Conservar o produto em local seco, fresco e arejado, ao abrigo da luz e do calor excessivo, em temperatura ambiente entre 15 °C e 30 °C.
Após aberto, consumir em até 60 dias.
Não consumir se o lacre de segurança estiver violado.',
    nutritional_info    = 'INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 1 g (2 cápsulas)
Quantidade por porção | %VD*
Valor energético 3,5 kcal = 15 kJ | 0%
Carboidratos 0,9 g | 0%
Açúcares totais 0 g | 0%
Açúcares adicionados 0 g | 0%
Proteínas 0 g | 0%
Gorduras totais 0 g | 0%
Gorduras saturadas 0 g | 0%
Gorduras trans 0 g | 0%
Fibras alimentares 0 g | 0%
Sódio 0 mg | 0%
Vitamina A 1.500 µg RAE | 187%
Cromo 200 µg | 571%
Ácido clorogênico 64 mg |
Antocianinas da laranja moro 0,07 mg |
*Percentual de valores diários fornecidos pela porção',
    serving_description = '2 cápsulas (1 g), 1 vez ao dia',
    metadata            = f.metadata || jsonb_build_object('tabela_nutricional_2026_09_16', '{"porcoes_por_embalagem": 30, "porcao": "1 g (2 cápsulas)", "linhas": [{"item": "Valor energético", "quantidade": 3.5, "unidade": "kcal", "vd_pct": 0, "kj": 15}, {"item": "Carboidratos", "quantidade": 0.9, "unidade": "g", "vd_pct": 0, "nota": "0,88 g > 0,5 g; 0,88 ÷ 300 = 0,3 % → 0 %"}, {"item": "Açúcares totais", "quantidade": 0.0, "unidade": "g", "vd_pct": 0}, {"item": "Açúcares adicionados", "quantidade": 0.0, "unidade": "g", "vd_pct": 0}, {"item": "Proteínas", "quantidade": 0.0, "unidade": "g", "vd_pct": 0}, {"item": "Gorduras totais", "quantidade": 0.0, "unidade": "g", "vd_pct": 0}, {"item": "Gorduras saturadas", "quantidade": 0.0, "unidade": "g", "vd_pct": 0}, {"item": "Gorduras trans", "quantidade": 0.0, "unidade": "g", "vd_pct": 0}, {"item": "Fibras alimentares", "quantidade": 0.0, "unidade": "g", "vd_pct": 0}, {"item": "Sódio", "quantidade": 0.0, "unidade": "mg", "vd_pct": 0}, {"item": "Vitamina A", "quantidade": 1500, "unidade": "µg RAE", "vd_pct": 187}, {"item": "Cromo", "quantidade": 200, "unidade": "µg", "vd_pct": 571}, {"item": "Ácido clorogênico", "quantidade": 64, "unidade": "mg", "vd_pct": null}, {"item": "Antocianinas da laranja moro", "quantidade": 0.07, "unidade": "mg", "vd_pct": null}], "rodape": "*Percentual de valores diários fornecidos pela porção", "regras": "Arredondamento: Anexo III IN 75/2020 (paráfrase). %VD: Anexo VIII (adultos); macros: Anexo II. Não significativo: %VD 0. Sem VDR: em branco. Energia: só a maltodextrina; kJ 17 kJ/g PROVISÓRIO."}'::jsonb, 'reformulacao_2026_09_16', '{"data": "2026-09-16", "veredito": "CONFORME CONDICIONADO A (aprovação pelo dono/RT da fórmula reconstruída e emissão de memorial de cálculo pela fábrica; laudo válido do lote de café verde; validade do laudo da vitamina A; posição do RT sobre exigência de fabricante do painel)", "porcao_mg": 1000.0, "soma_porcao_mg": 1000.0, "cabe": true, "pendencias": ["Dono/RT: aprovar a fórmula RECONSTRUÍDA (café verde, laranja moro, cromo, vitamina A) — não existe memorial de cálculo deste produto; a fábrica precisa emitir um, com lotes e laudos.", "Vitamina C: consta da lista de ingredientes do cadastro mas de nenhuma ficha com dose — não foi incluída para não inventar dose; se o dono quiser, o lote 950467 (99,5 %, válido) permite qualquer dose entre 13,5 e 1.724 mg (ex.: 100 mg = 100 % do VD, 5 % do teto).", "Café verde: comprar/usar lote com laudo válido (IDNLABS 10269 é o disponível legível) e declarar a espécie do laudo.", "Vitamina A: validade do laudo 215230 (scan) e massa pesada 8,80 mg (a ficha pesava 1,5 mg).", "RT: posição sobre a ''especificação do fabricante'' do painel (café verde, laranja moro), ausente do Anexo I literal.", "Fábrica: tamanho e composição da cápsula; excipiente q.s.p. 879,58 mg ou apresentação menor.", "Rótulo/cadastro: retirar espirulina, psyllium, cúrcuma, quitosana, inulina, guaraná, feno-grego e vitamina C da lista; retirar ''contém derivados de crustáceos''."]}'::jsonb)
where f.slug = 'emagrecedor-em-capsula' and f.deleted_at is null;
