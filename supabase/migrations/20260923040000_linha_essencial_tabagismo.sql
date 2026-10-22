-- Linha ESSENCIAL — gerado por anvisa/catalogo-lemon/novos_produtos_essencial.py em 2026-09-23
-- Não editar à mão: rodar o script de novo.
begin;

do $$ begin
  if exists (select 1 from public.formulas where slug in ('tabagismo-em-capsulas')) then
    raise exception 'Algum slug da linha Essencial já existe — nada aplicado.';
  end if;
end $$;

insert into public.segments (slug, name, sort_order, active) select 'diabetes', 'Diabetes', 110, true where not exists (select 1 from public.segments where slug = 'diabetes');
insert into public.segments (slug, name, sort_order, active) select 'saude-da-prostata', 'Saúde da próstata', 120, true where not exists (select 1 from public.segments where slug = 'saude-da-prostata');
insert into public.segments (slug, name, sort_order, active) select 'antioxidantes-e-longevidade', 'Antioxidantes e longevidade', 130, true where not exists (select 1 from public.segments where slug = 'antioxidantes-e-longevidade');
insert into public.segments (slug, name, sort_order, active) select 'eletrolitos', 'Eletrólitos', 140, true where not exists (select 1 from public.segments where slug = 'eletrolitos');
insert into public.segments (slug, name, sort_order, active) select 'linha-de-gotas', 'Linha de gotas', 150, true where not exists (select 1 from public.segments where slug = 'linha-de-gotas');
insert into public.segments (slug, name, sort_order, active) select 'linha-de-capsulas', 'Linha de cápsulas', 160, true where not exists (select 1 from public.segments where slug = 'linha-de-capsulas');
insert into public.segments (slug, name, sort_order, active) select 'tabagismo', 'Tabagismo', 170, true where not exists (select 1 from public.segments where slug = 'tabagismo');





insert into public.formulas (slug, name, segment_id, line, format, regulatory_product_type, pote_contents_description, net_weight, serving_description, ingredients_list, usage_instructions, benefits, general_benefits_summary, warnings, target_audience, storage_instructions, technical_sheet_title, list_price_cents, minimum_order_potes, sort_order, active, metadata, compliance_verified_at, compliance_norms, compliance_source) values (
  'tabagismo-em-capsulas', 'Tabagismo em Cápsulas', (select id from public.segments where slug = 'tabagismo'), 'essencial', 'capsula', 'SUPLEMENTO ALIMENTAR EM CÁPSULA', '60 Cápsulas', '30 g', '1 g (2 cápsulas)',
  'Cloridrato de L-cisteína, ácido ascórbico (vitamina C), antiumectante dióxido de silício (INS 551), acetato de DL-alfa-tocoferol (vitamina E), bisglicinato de zinco, cloridrato de piridoxina (vitamina B6), ácido fólico, L-selenometionina, metilcobalamina (vitamina B12) e cápsula: gelatina, água purificada e corante dióxido de titânio (INS 171).',
  'Ingerir 2 cápsulas ao dia, ou conforme orientação de profissional de saúde.',
  array['A vitamina C é um antioxidante que auxilia na proteção dos danos causados pelos radicais livres.', 'A vitamina E é um antioxidante que auxilia na proteção dos danos causados pelos radicais livres.', 'O zinco é um antioxidante que auxilia na proteção dos danos causados pelos radicais livres.', 'O selênio é um antioxidante que auxilia na proteção dos danos causados pelos radicais livres.', 'A vitamina B6 auxilia na síntese de cisteína.', 'A vitamina B6 auxilia no metabolismo de homocisteína.', 'O ácido fólico auxilia no metabolismo da homocisteína.', 'A vitamina B12 auxilia no metabolismo da homocisteína.', 'A vitamina C auxilia no funcionamento do sistema imune.', 'A vitamina C auxilia na formação do colágeno.', 'A L-cisteína é um aminoácido que contém enxofre e é um dos três aminoácidos que formam a glutationa.', 'A vitamina C está presente como ácido L-ascórbico.', 'A vitamina E está presente como acetato de DL-alfa-tocoferol, forma sintética estável ao ar.', 'O zinco está presente como bisglicinato, quelato em que o mineral se liga a duas moléculas de glicina.', 'A vitamina B6 está presente como cloridrato de piridoxina.', 'O ácido fólico é a forma sintética do folato (ácido pteroil-L-glutâmico).', 'O selênio está presente como L-selenometionina, aminoácido em que o selênio ocupa o lugar do enxofre da metionina.', 'A vitamina B12 está presente como metilcobalamina, uma das formas coenzimáticas da vitamina.']::text[],
  'Fórmula em cápsulas que combina 500 mg de cloridrato de L-cisteína com vitamina C, vitamina E, zinco e selênio, que têm a alegação aprovada pela ANVISA de antioxidantes que auxiliam na proteção dos danos causados pelos radicais livres, e com vitamina B6, vitamina B12 e ácido fólico, que auxiliam no metabolismo da homocisteína. Sem extratos vegetais. Destina-se a adultos, com ingestão de duas cápsulas ao dia.',
  'Este produto não é um medicamento.
Não exceder a recomendação diária de consumo indicada na embalagem.
Mantenha fora do alcance de crianças.
Público indicado: adultos (19 anos ou mais).
Ingerir 2 cápsulas ao dia.
Este produto não deve ser consumido por gestantes, lactantes e crianças.
Pessoas com enfermidades e/ou sob uso de medicamentos, consulte seu médico.
Conservar em local seco, fresco e arejado, ao abrigo da luz e do calor excessivo, em temperatura ambiente entre 15 °C e 30 °C. Após aberto, consumir em até 60 dias. Não consumir se o lacre de segurança estiver violado.',
  'Adultos (19 anos ou mais).',
  'Conservar o produto em local seco, fresco e arejado, ao abrigo da luz e do calor excessivo, em temperatura ambiente entre 15 °C e 30 °C.
Após aberto, consumir em até 60 dias.
Não consumir se o lacre de segurança estiver violado.',
  'L-cisteína, Vitaminas C, E, B6 e B12, Ácido Fólico, Zinco e Selênio — 60 Cápsulas', null, 100, 50, false, '{"fonte": "linha_essencial_2026-09-23", "gerador": "anvisa/catalogo-lemon/novos_produtos_essencial.py", "linha": "essencial", "criado_em": "2026-09-23", "pendencias": ["tabela nutricional não calculada (depende de laudos e do RT)", "preço não definido — fórmula gravada como rascunho (active = false) até o dono passar o preço", "sem foto do pote (card mostra o ícone do formato)"]}'::jsonb,
  now(), array['IN 28/2018 (atualizada até a IN 470/2026)', 'RDC 243/2018']::text[], 'Massa bruta e ativo de cada insumo conferidos contra o painel oficial da ANVISA de 23/09/2026 (script novos_produtos_essencial.py)');
insert into public.formula_compositions (formula_id, ingredient_name, quantity, unit, sort_order, ingredient_id, metadata) values ((select id from public.formulas where slug = 'tabagismo-em-capsulas'), 'L-cisteína', 500, 'mg', 0, '37f65a36-396d-4ab8-a7a6-11fe9da3d1dc', '{"papel": "constituinte", "constituinte": "L-cisteína", "forma_insumo": "cloridrato de L-cisteína", "forma_anexo_i": "Cloridrato de L-cisteína", "linha_anexo": "I·Cloridrato de L-cisteína; III/IV·L-cisteína", "limite_painel_19": "Mínimo: 42 mg Máximo: 830 mg", "minimo_mg": 42.0, "maximo_mg": 830.0, "ativo_mg": 382.4164916666138, "bruto_mg": 500.0, "conta": "500 mg × 0,995 (teor) × 0,7687 (cisteína no cloridrato anidro) = 382,416 mg", "teor_fonte": "laudo", "laudo_lote": "Pharma Nostra lote NC260410065 (PN 26070064-A) — 99,5% base anidra (val. 09/04/2028)", "status": "conforme", "insumo_a_adquirir": false, "fonte": "linha_essencial_2026-09-23", "verificado_em": "2026-09-23", "pct_do_maximo_bruto": 60.2, "pct_do_maximo_ativo": 46.1}'::jsonb);
insert into public.formula_compositions (formula_id, ingredient_name, quantity, unit, sort_order, ingredient_id, metadata) values ((select id from public.formulas where slug = 'tabagismo-em-capsulas'), 'Vitamina C', 256.1475, 'mg', 1, '21d155a8-3b57-4097-844f-f54efbc3a532', '{"papel": "constituinte", "constituinte": "Vitamina C", "forma_insumo": "ácido ascórbico (vitamina C)", "forma_anexo_i": "Ácido ascórbico/Ácido L-ascórbico", "linha_anexo": "I·Ácido ascórbico/Ácido L-ascórbico; III/IV·Vitamina C", "limite_painel_19": "Mínimo: 13,5 mg Máximo: 1.916,02 mg", "minimo_mg": 13.5, "maximo_mg": 1916.02, "ativo_mg": 249.99996, "bruto_mg": 256.1475, "conta": "256,1475 mg × 0,976 (teor) = 250 mg", "teor_fonte": "laudo", "laudo_lote": "Analitic lote 950466 — ácido ascórbico revestido, 97,6% (val. 24/08/2027)", "status": "conforme", "insumo_a_adquirir": false, "fonte": "linha_essencial_2026-09-23", "verificado_em": "2026-09-23", "pct_do_maximo_bruto": 13.4, "pct_do_maximo_ativo": 13.0}'::jsonb);
insert into public.formula_compositions (formula_id, ingredient_name, quantity, unit, sort_order, ingredient_id, metadata) values ((select id from public.formulas where slug = 'tabagismo-em-capsulas'), 'Vitamina E', 44.1579, 'mg', 2, '50ae4e0c-d18d-4fb6-9fc3-cee89ce37ef7', '{"papel": "constituinte", "constituinte": "Vitamina E", "forma_insumo": "acetato de DL-alfa-tocoferol (vitamina E)", "forma_anexo_i": "Acetato de DL-alfa-tocoferol/Acetato de racealfatocoferol/Acetato de DL-alfatocoferila", "linha_anexo": "I·Acetato de DL-alfa-tocoferol/Acetato de racealfatocoferol/Acetato de DL-alfatocoferila; III/IV·Vitamina E", "limite_painel_19": "Mínimo: 2,25 mg Máximo: 1000 mg", "minimo_mg": 2.25, "maximo_mg": 1000.0, "ativo_mg": 14.999997051000001, "bruto_mg": 44.1579, "conta": "44,1579 mg × 0,507 (teor do pó) × 0,67 (nota v do Anexo III da IN 28) = 15 mg", "teor_fonte": "laudo", "laudo_lote": "Analitic lote 91320 — acetato de DL-α-tocoferol 50,7% (val. 05/04/2028)", "status": "conforme", "insumo_a_adquirir": false, "fonte": "linha_essencial_2026-09-23", "verificado_em": "2026-09-23", "pct_do_maximo_bruto": 4.4, "pct_do_maximo_ativo": 1.5}'::jsonb);
insert into public.formula_compositions (formula_id, ingredient_name, quantity, unit, sort_order, ingredient_id, metadata) values ((select id from public.formulas where slug = 'tabagismo-em-capsulas'), 'Zinco', 25.1383, 'mg', 3, 'bfd267cb-9d3c-4616-ac77-65face92037c', '{"papel": "constituinte", "constituinte": "Zinco", "forma_insumo": "bisglicinato de zinco", "forma_anexo_i": "Bisglicinato de zinco", "linha_anexo": "I·Bisglicinato de zinco; III/IV·Zinco", "limite_painel_19": "Mínimo: 1,65 mg Máximo: 29,59 mg", "minimo_mg": 1.65, "maximo_mg": 29.59, "ativo_mg": 5.00000787, "bruto_mg": 25.1383, "conta": "25,1383 mg × 0,1989 (Zn no bisglicinato, valor dos memoriais da fábrica) = 5 mg", "teor_fonte": "laudo", "laudo_lote": "Galena lote 055-ZN/25 (CIQ 2505027507) — Zn 20,00% base seca; 19,89% nos memoriais (val. 06/05/2027)", "status": "conforme", "insumo_a_adquirir": false, "fonte": "linha_essencial_2026-09-23", "verificado_em": "2026-09-23", "pct_do_maximo_bruto": 85.0, "pct_do_maximo_ativo": 16.9}'::jsonb);
insert into public.formula_compositions (formula_id, ingredient_name, quantity, unit, sort_order, ingredient_id, metadata) values ((select id from public.formulas where slug = 'tabagismo-em-capsulas'), 'Vitamina B6', 1.5817, 'mg', 4, '657f37a0-77f1-4234-89f1-da7278175946', '{"papel": "constituinte", "constituinte": "Vitamina B6", "forma_insumo": "cloridrato de piridoxina (vitamina B6)", "forma_anexo_i": "Cloridrato de piridoxina", "linha_anexo": "I·Cloridrato de piridoxina; III/IV·Vitamina B6", "limite_painel_19": "Mínimo: 0,26 mg Máximo: 98,60 mg", "minimo_mg": 0.26, "maximo_mg": 98.6, "ativo_mg": 1.29996332541, "bruto_mg": 1.5817, "conta": "1,5817 mg × 0,999 (teor) × 0,8227 (piridoxina no cloridrato) = 1,3 mg", "teor_fonte": "laudo", "laudo_lote": "Analitic lote 91188 — 99,9% (val. 28/12/2027)", "status": "conforme", "insumo_a_adquirir": false, "fonte": "linha_essencial_2026-09-23", "verificado_em": "2026-09-23", "pct_do_maximo_bruto": 1.6, "pct_do_maximo_ativo": 1.3}'::jsonb);
insert into public.formula_compositions (formula_id, ingredient_name, quantity, unit, sort_order, ingredient_id, metadata) values ((select id from public.formulas where slug = 'tabagismo-em-capsulas'), 'Ácido Fólico', 202.1223, 'mcg', 5, '93d25b39-c8a0-42d3-9e4c-d49fb7dfdfe7', '{"papel": "constituinte", "constituinte": "Ácido fólico", "forma_insumo": "ácido fólico", "forma_anexo_i": "Ácido fólico/Ácido N-pteroil-L-glutâmico", "linha_anexo": "I·Ácido fólico/Ácido N-pteroil-L-glutâmico; III/IV·Ácido fólico", "limite_painel_19": "Mínimo: 60 μg Máximo: 1281,5 μg", "minimo_mg": 0.06, "maximo_mg": 1.2815, "ativo_mg": 0.20000001585000002, "bruto_mg": 0.2021223, "conta": "202,1223 mcg × 0,9895 (teor) = 200 µg", "teor_fonte": "laudo", "laudo_lote": "Lepuge interno AUTO039613 (fabricante 202406008) — 98,95% (val. 02/06/2027)", "status": "conforme", "insumo_a_adquirir": false, "fonte": "linha_essencial_2026-09-23", "verificado_em": "2026-09-23", "pct_do_maximo_bruto": 15.8, "pct_do_maximo_ativo": 15.6}'::jsonb);
insert into public.formula_compositions (formula_id, ingredient_name, quantity, unit, sort_order, ingredient_id, metadata) values ((select id from public.formulas where slug = 'tabagismo-em-capsulas'), 'Selênio', 136.5796, 'mcg', 6, 'e0d06485-1f78-4ff8-9223-29a75d5419da', '{"papel": "constituinte", "constituinte": "Selênio", "forma_insumo": "L-selenometionina", "forma_anexo_i": "L-Selenometionina", "linha_anexo": "I·L-Selenometionina; III/IV·Selênio", "limite_painel_19": "Mínimo: 8,25 μg Máximo: 319,75 μg", "minimo_mg": 0.00825, "maximo_mg": 0.31975000000000003, "ativo_mg": 0.05499998771888673, "bruto_mg": 0.1365796, "conta": "136,5796 mcg × 0,4027 (Se na L-selenometionina, conta estequiométrica) = 55 µg", "teor_fonte": "teórico", "laudo_lote": null, "status": "conforme", "insumo_a_adquirir": true, "fonte": "linha_essencial_2026-09-23", "verificado_em": "2026-09-23", "pct_do_maximo_bruto": 42.7, "pct_do_maximo_ativo": 17.2}'::jsonb);
insert into public.formula_compositions (formula_id, ingredient_name, quantity, unit, sort_order, ingredient_id, metadata) values ((select id from public.formulas where slug = 'tabagismo-em-capsulas'), 'Vitamina B12', 2.4218, 'mcg', 7, '6c3d1585-a0ee-4f59-95dc-d433c81c8180', '{"papel": "constituinte", "constituinte": "Vitamina B12", "forma_insumo": "metilcobalamina (vitamina B12)", "forma_anexo_i": "Metilcobalamina", "linha_anexo": "I·Metilcobalamina; III/IV·Vitamina B12", "limite_painel_19": "Mínimo: 0,36 μg Máximo: 9,94 μg", "minimo_mg": 0.00035999999999999997, "maximo_mg": 0.00994, "ativo_mg": 0.0024000038000000002, "bruto_mg": 0.0024218000000000004, "conta": "2,4218 mcg × 0,991 (teor base anidra) = 2,4 µg", "teor_fonte": "laudo", "laudo_lote": "IDNLABS lote M250321B (interno 20334) — 99,1% base anidra (val. 24/03/2028)", "status": "conforme", "insumo_a_adquirir": false, "fonte": "linha_essencial_2026-09-23", "verificado_em": "2026-09-23", "pct_do_maximo_bruto": 24.4, "pct_do_maximo_ativo": 24.1}'::jsonb);
insert into public.formula_compositions (formula_id, ingredient_name, quantity, unit, sort_order, ingredient_id, metadata) values ((select id from public.formulas where slug = 'tabagismo-em-capsulas'), 'Dióxido de Silício', 172.6335, 'mg', 8, '09ef545c-fca9-4f07-88fe-3a939e33831a', '{"papel": "aditivo", "ins": "551", "massa_mg": 172.6335, "fonte": "linha_essencial_2026-09-23", "observacao": "q.s.p. 1000 mg"}'::jsonb);






















do $$ declare n int; begin
  select count(*) into n from public.formulas where line = 'essencial' and deleted_at is null;
  if n <> 26 then raise exception 'esperava 26 fórmulas essenciais, achei %', n; end if;
end $$;

commit;
