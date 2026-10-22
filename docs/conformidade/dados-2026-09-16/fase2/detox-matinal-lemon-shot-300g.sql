-- =====================================================================================
-- Fase 2 — reformulação regulatória 2026-09-16 — fragmento do produto detox-matinal-lemon-shot-300g
-- Gerado a partir de detox-matinal-lemon-shot-300g.json (mesmos números). Idempotente; casa por SLUG, nunca por UUID.
-- Veredito esperado: CONFORME CONDICIONADO A (laudo válido do lote de café verde efetivamente usado; laudo novo da maltodextrina; identificação do corante; posição do RT sobre a exigência de fabricante do painel para café verde e laranja moro)
-- A coluna public.formulas.nutritional_info é TEXT no banco (conferido ao vivo em 16/09/2026);
-- por isso a tabela vai como texto no padrão ANVISA e o JSON estruturado vai em formulas.metadata.
-- Sem guarda de contagem aqui (a consolidação põe).
-- =====================================================================================

-- 1. Insumos que faltarem em public.ingredients (nome como no Anexo I / rótulo). on conflict do nothing.
insert into public.ingredients (slug, name, synonyms, category, sort_order, metadata) values
    ('vitamina-c', 'Vitamina C', ARRAY['Vitamina C']::text[], 'vitamina'::public.ingredient_category, 810, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/detox-matinal-lemon-shot-300g.sql"}'::jsonb),
    ('extrato-de-cafe-verde', 'Extrato de café verde', ARRAY['Extrato de café verde']::text[], 'extrato_vegetal'::public.ingredient_category, 820, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/detox-matinal-lemon-shot-300g.sql"}'::jsonb),
    ('extrato-de-laranja-moro', 'Extrato de laranja moro', ARRAY['Extrato de laranja moro']::text[], 'extrato_vegetal'::public.ingredient_category, 830, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/detox-matinal-lemon-shot-300g.sql"}'::jsonb),
    ('zinco', 'Zinco', ARRAY['Zinco']::text[], 'mineral'::public.ingredient_category, 840, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/detox-matinal-lemon-shot-300g.sql"}'::jsonb),
    ('maltodextrina', 'Maltodextrina', ARRAY['Maltodextrina']::text[], 'outro'::public.ingredient_category, 850, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/detox-matinal-lemon-shot-300g.sql"}'::jsonb),
    ('acido-citrico', 'Ácido cítrico', ARRAY['Ácido cítrico']::text[], 'outro'::public.ingredient_category, 860, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/detox-matinal-lemon-shot-300g.sql"}'::jsonb),
    ('aromatizante-identico-ao-natural-de-limao', 'Aromatizante idêntico ao natural de limão', ARRAY['Aromatizante idêntico ao natural de limão']::text[], 'outro'::public.ingredient_category, 870, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/detox-matinal-lemon-shot-300g.sql"}'::jsonb),
    ('dioxido-de-silicio', 'Dióxido de silício', ARRAY['Dióxido de silício']::text[], 'outro'::public.ingredient_category, 880, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/detox-matinal-lemon-shot-300g.sql"}'::jsonb),
    ('edulcorante-sucralose', 'Edulcorante sucralose', ARRAY['Edulcorante sucralose']::text[], 'outro'::public.ingredient_category, 890, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/detox-matinal-lemon-shot-300g.sql"}'::jsonb),
    ('corante-verde', 'Corante verde', ARRAY['Corante verde']::text[], 'outro'::public.ingredient_category, 900, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/detox-matinal-lemon-shot-300g.sql"}'::jsonb)
on conflict (slug) do nothing;

-- 2. Exclusão LÓGICA das composições ativas atuais da fórmula (só as que não vieram desta reformulação).
update public.formula_compositions fc
set active = false, deleted_at = now(), reason_deleted = 'reformulação regulatória 2026-09-16'
from public.formulas f
where f.id = fc.formula_id and f.deleted_at is null and f.slug = 'detox-matinal-lemon-shot-300g'
  and fc.deleted_at is null
  and coalesce(fc.metadata->>'fonte', '') <> 'reformulacao_2026-09-16';

-- 3. Inserção das composições reformuladas (ingredient_id resolvido por slug em public.ingredients).
insert into public.formula_compositions (formula_id, ingredient_name, quantity, unit, sort_order, ingredient_id, metadata)
select f.id, v.ingredient_name, v.quantity, v.unit::public.composition_unit, v.sort_order, i.id, v.metadata::jsonb
from (values
    ('detox-matinal-lemon-shot-300g', 0, 'Ácido ascórbico (vitamina C)', 1608.04, 'mg', 'vitamina-c', '{"fonte": "reformulacao_2026-09-16", "papel": "constituinte", "constituinte_anexo_i": "Vitamina C — Ácido ascórbico/Ácido L-ascórbico (CAS 50-81-7)", "laudo_lote": "950467 (fabricante 250306-C01)", "laudo_validade": "05/03/2029", "laudo_vencido": false, "teor_pct": 99.5, "teor_fonte": "laudo lote 950467 (teor 99,5%, lido no inventário de laudos; memorial rev02 usa o mesmo)", "ativo_mg": 1600.0, "unidade_ativo": "mg", "minimo": 13.5, "maximo": 1916.02, "pct_do_maximo": 83.5, "linha_anexo": "III·Vitamina C (13,5) / IV·Vitamina C (1.916,02)", "status": "mantido", "e_sal": false}'),
    ('detox-matinal-lemon-shot-300g', 1, 'Extrato de café verde', 400.0, 'mg', 'extrato-de-cafe-verde', '{"fonte": "reformulacao_2026-09-16", "papel": "constituinte", "constituinte_anexo_i": "Ácido clorogênico — Extrato de café verde (IN 102/2021)", "laudo_lote": "10269 (IDNLABS)", "laudo_validade": "08/2027", "laudo_vencido": false, "teor_pct": 64.05, "teor_fonte": "laudo lote 10269 (ácido clorogênico 64,05% calc. ác. cafeoilquínicos; metilxantinas 1,56% informativo) — lido no inventário de laudos", "ativo_mg": 256.2, "unidade_ativo": "mg de ácido clorogênico", "minimo": "NE", "maximo": 400, "pct_do_maximo": 64.0, "linha_anexo": "III·Ácido clorogênico (NE) / IV·Ácido clorogênico (400, redação IN 102/2021)", "status": "mantido (laudo regularizado)", "e_sal": false}'),
    ('detox-matinal-lemon-shot-300g', 2, 'Extrato de laranja moro (Citrus sinensis (L.) Osbeck)', 100.0, 'mg', 'extrato-de-laranja-moro', '{"fonte": "reformulacao_2026-09-16", "papel": "constituinte", "constituinte_anexo_i": "Antocianinas da laranja moro — Extrato de laranja moro (Citrus sinensis (L.) Osbeck) (IN 336/2024)", "laudo_lote": "17624 (AllPremium; original 1289)", "laudo_validade": "09/04/2027", "laudo_vencido": false, "teor_pct": 1.47, "teor_fonte": "laudo lote 17624 (antocianinas como cianidina-3-glucosídeos 1,47%) — lido no inventário de laudos e no memorial rev02", "ativo_mg": 1.47, "unidade_ativo": "mg de antocianinas", "minimo": "NE", "maximo": 5, "pct_do_maximo": 29.4, "linha_anexo": "III·Antocianinas da laranja moro (NE, IN 336/2024) / IV·Antocianinas da laranja moro (5)", "status": "mantido", "e_sal": false}'),
    ('detox-matinal-lemon-shot-300g', 3, 'Bisglicinato de zinco (equivalente a 2,2 mg de zinco)', 11.06, 'mg', 'zinco', '{"fonte": "reformulacao_2026-09-16", "papel": "constituinte", "constituinte_anexo_i": "Zinco — Bisglicinato de zinco (CAS 14281-83-5)", "laudo_lote": "055-ZN/25 (Galena CIQ 2505027507)", "laudo_validade": "06/05/2027", "laudo_vencido": false, "teor_pct": 19.89, "teor_fonte": "laudo lote 055-ZN/25: 20,00% de zinco base seca × (100 − 0,54% umidade) = 19,89% tal qual (conta do memorial rev02, reconferida)", "ativo_mg": 2.2, "unidade_ativo": "mg de zinco", "minimo": 1.65, "maximo": 29.59, "pct_do_maximo": 7.4, "linha_anexo": "III·Zinco (1,65) / IV·Zinco (29,59)", "status": "dose ajustada", "e_sal": true}'),
    ('detox-matinal-lemon-shot-300g', 4, 'Maltodextrina (veículo, q.s.p.)', 6713.9, 'mg', 'maltodextrina', '{"fonte": "reformulacao_2026-09-16", "papel": "veiculo", "ins": null, "laudo_lote": "210170 (Fagron) — VENCIDO em 26/07/2026", "observacao": "Ingrediente do Art. 6, § único, da RDC 243/2018 (veículo) — não recebe alegação de fonte de carboidrato. Recalculada para fechar 10.000 mg. Pedir laudo novo."}'),
    ('detox-matinal-lemon-shot-300g', 5, 'Acidulante ácido cítrico', 670.0, 'mg', 'acido-citrico', '{"fonte": "reformulacao_2026-09-16", "papel": "aditivo", "ins": "INS 330", "laudo_lote": "GE2844AFG (100,10%, memorial rev02)", "observacao": "IN 211/2023, cat. 14.2: quantum satis."}'),
    ('detox-matinal-lemon-shot-300g', 6, 'Aromatizante idêntico ao natural de limão', 330.0, 'mg', 'aromatizante-identico-ao-natural-de-limao', '{"fonte": "reformulacao_2026-09-16", "papel": "aditivo", "ins": null, "laudo_lote": "19934 (Alphataste/AllPremium, validade 12/01/2027 segundo o memorial)", "observacao": "quantum satis (idêntico ao natural); composição do aroma não conhecida — não contabilizado na energia."}'),
    ('detox-matinal-lemon-shot-300g', 7, 'Antiumectante dióxido de silício', 100.0, 'mg', 'dioxido-de-silicio', '{"fonte": "reformulacao_2026-09-16", "papel": "aditivo", "ins": "INS 551", "laudo_lote": "sem lote individualizado no memorial", "observacao": "quantum satis."}'),
    ('detox-matinal-lemon-shot-300g', 8, 'Edulcorante sucralose', 50.0, 'mg', 'edulcorante-sucralose', '{"fonte": "reformulacao_2026-09-16", "papel": "aditivo", "ins": "INS 955", "laudo_lote": "91233 (99,74%, memorial rev02)", "observacao": "50 mg em 210 g de produto pronto = 238,1 mg/kg (limite 2.400 mg/kg, IN 211/2023 cat. 14.2)."}'),
    ('detox-matinal-lemon-shot-300g', 9, 'Corantes tartrazina e azul brilhante FCF', 17.0, 'mg', 'corante-verde', '{"fonte": "reformulacao_2026-09-16", "papel": "aditivo", "ins": "INS 102, INS 133", "laudo_lote": "250301 (''corante verde folha'', Adicel) — sem INS nem doseamento", "observacao": "17 mg em 210 g = 81,0 mg/kg somados (limite 300 mg/kg cada). PENDENTE: o laudo não identifica os corantes; se a tartrazina se confirmar, exige a frase ''Contém TARTRAZINA (INS 102)''."}')
) as v(slug, sort_order, ingredient_name, quantity, unit, ingredient_slug, metadata)
join public.formulas f on f.slug = v.slug and f.deleted_at is null
join public.ingredients i on i.slug = v.ingredient_slug and i.deleted_at is null
where not exists (
    select 1 from public.formula_compositions x
    where x.formula_id = f.id and x.deleted_at is null and x.metadata->>'fonte' = 'reformulacao_2026-09-16'
);

-- 4. Dizeres de rotulagem, tabela nutricional (texto) e porção; JSON da tabela em metadata.
update public.formulas f set
    ingredients_list    = 'Maltodextrina, ácido ascórbico (vitamina C), acidulante ácido cítrico (INS 330), extrato de café verde (Coffea canephora — espécie conforme laudo do lote; conferir antes de imprimir), aromatizante idêntico ao natural de limão, extrato de laranja moro (Citrus sinensis (L.) Osbeck), antiumectante dióxido de silício (INS 551), edulcorante sucralose (INS 955), corantes tartrazina (INS 102) e azul brilhante FCF (INS 133), bisglicinato de zinco.',
    warnings            = 'Este produto não é um medicamento.
Público indicado: adultos (19 anos ou mais).
Não exceder a recomendação diária de consumo indicada na embalagem.
Mantenha fora do alcance de crianças.
Este produto não deve ser consumido por gestantes, lactantes e crianças.
Contém TARTRAZINA (INS 102).
Conservar o produto em local seco, fresco e arejado, ao abrigo da luz e do calor excessivo, em temperatura ambiente entre 15 °C e 30 °C.
Após aberto, consumir em até 60 dias.
Não consumir se o lacre de segurança estiver violado.',
    nutritional_info    = 'INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 10 g (1 dose = 1 medida rasa, diluída em 200 mL de água)
Quantidade por porção | %VD*
Valor energético 29 kcal = 123 kJ | 1%
Carboidratos 6,7 g | 2%
Açúcares totais 0 g | 0%
Açúcares adicionados 0 g | 0%
Proteínas 0 g | 0%
Gorduras totais 0 g | 0%
Gorduras saturadas 0 g | 0%
Gorduras trans 0 g | 0%
Fibras alimentares 0 g | 0%
Sódio 0 mg | 0%
Vitamina C 1.600 mg | 1600%
Zinco 2,2 mg | 20%
Ácido clorogênico 256 mg |
Antocianinas da laranja moro 1,5 mg |
*Percentual de valores diários fornecidos pela porção',
    serving_description = '10 g (1 dose) diluída em 200 mL de água, 1 vez ao dia',
    metadata            = f.metadata || jsonb_build_object('tabela_nutricional_2026_09_16', '{"porcoes_por_embalagem": 30, "porcao": "10 g (1 dose = 1 medida rasa, diluída em 200 mL de água)", "linhas": [{"item": "Valor energético", "quantidade": 29, "unidade": "kcal", "vd_pct": 1, "kj": 123}, {"item": "Carboidratos", "quantidade": 6.7, "unidade": "g", "vd_pct": 2}, {"item": "Açúcares totais", "quantidade": 0.0, "unidade": "g", "vd_pct": 0, "nota": "PROVISÓRIO — depende do laudo da maltodextrina (teor de mono e dissacarídeos)"}, {"item": "Açúcares adicionados", "quantidade": 0.0, "unidade": "g", "vd_pct": 0}, {"item": "Proteínas", "quantidade": 0.0, "unidade": "g", "vd_pct": 0}, {"item": "Gorduras totais", "quantidade": 0.0, "unidade": "g", "vd_pct": 0}, {"item": "Gorduras saturadas", "quantidade": 0.0, "unidade": "g", "vd_pct": 0}, {"item": "Gorduras trans", "quantidade": 0.0, "unidade": "g", "vd_pct": 0}, {"item": "Fibras alimentares", "quantidade": 0.0, "unidade": "g", "vd_pct": 0}, {"item": "Sódio", "quantidade": 0.0, "unidade": "mg", "vd_pct": 0}, {"item": "Vitamina C", "quantidade": 1600, "unidade": "mg", "vd_pct": 1600}, {"item": "Zinco", "quantidade": 2.2, "unidade": "mg", "vd_pct": 20}, {"item": "Ácido clorogênico", "quantidade": 256, "unidade": "mg", "vd_pct": null}, {"item": "Antocianinas da laranja moro", "quantidade": 1.5, "unidade": "mg", "vd_pct": null}], "rodape": "*Percentual de valores diários fornecidos pela porção", "regras": "Arredondamento: Anexo III da IN 75/2020 (≥10 inteiro; 1–10 uma casa; <1 g uma casa; <1 mg/µg duas casas). %VD: Anexo VIII da IN 75/2020, coluna adultos (macronutrientes pelo Anexo II). Quantidade não significativa (Anexo IV): %VD = 0. Constituinte sem VDR: célula em branco (RDC 429/2020, art. 12, §1º). Energia: Atwater 4 kcal/g (carboidrato), 3 kcal/g (ácido orgânico); kJ com 17 e 13 kJ/g — fatores kJ PROVISÓRIOS (Anexo XXII não relido em disco)."}'::jsonb, 'reformulacao_2026_09_16', '{"data": "2026-09-16", "veredito": "CONFORME CONDICIONADO A (laudo válido do lote de café verde efetivamente usado; laudo novo da maltodextrina; identificação do corante; posição do RT sobre a exigência de fabricante do painel para café verde e laranja moro)", "porcao_mg": 10000.0, "soma_porcao_mg": 10000.0, "cabe": true, "pendencias": ["Café verde: decidir o lote — o laudo válido e legível em disco é do café verde solúvel IDNLABS 10269 (64,05%); o lote em uso no memorial (HERBALTEC 10841, 53,86%) está em scan não lido, sem validade confirmada, espécie Coffea robusta (rótulo diz arabica), irradiado a 10 kGy e microbiologia ''ND''. Qualquer que seja o lote, a espécie do rótulo tem de ser a do laudo.", "RT: confirmar se a ''especificação do fabricante'' que o painel da ANVISA associa a café verde e laranja moro é exigível — o Anexo I literal (IN 28/2018 consolidada até a IN 450/2026) não condiciona essas formas a fabricante.", "Maltodextrina: laudo do lote 210170 vencido em 26/07/2026 — pedir laudo novo (e, nele, o teor de açúcares para fechar a linha ''açúcares totais'').", "Corante: o único certificado (lote 250301, ''corante verde folha'') não identifica os corantes nem os INS; confirmar tartrazina + azul brilhante FCF e, se confirmado, manter a frase ''Contém TARTRAZINA (INS 102)'' (RDC 340/2002 — norma não relida em disco nesta tarefa, PROVISÓRIO).", "Rótulo: retirar toda menção a RESVERATROL e a cúrcuma do texto de apresentação (resveratrol nunca esteve na composição; cúrcuma sai).", "Excluir a cúrcuma do texto de apresentação até haver extrato padronizado com laudo (ver linha ''retirado'')."]}'::jsonb)
where f.slug = 'detox-matinal-lemon-shot-300g' and f.deleted_at is null;
