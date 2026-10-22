-- =====================================================================================
-- Fase 2 — reformulação regulatória 2026-09-16 — fragmento do produto pro-energy
-- Gerado a partir de pro-energy.json (mesmos números). Idempotente; casa por SLUG, nunca por UUID.
-- Veredito esperado: CONFORME CONDICIONADO A (laudo de cafeína específica e identificação do fornecedor do guaraná em pó; cópias legíveis/válidas dos laudos de cafeína anidra, taurina e L-carnitina; definição do excipiente)
-- A coluna public.formulas.nutritional_info é TEXT no banco (conferido ao vivo em 16/09/2026);
-- por isso a tabela vai como texto no padrão ANVISA e o JSON estruturado vai em formulas.metadata.
-- Sem guarda de contagem aqui (a consolidação põe).
-- =====================================================================================

-- 1. Insumos que faltarem em public.ingredients (nome como no Anexo I / rótulo). on conflict do nothing.
insert into public.ingredients (slug, name, synonyms, category, sort_order, metadata) values
    ('taurina', 'Taurina', ARRAY['Taurina']::text[], 'aminoacido'::public.ingredient_category, 810, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/pro-energy.sql"}'::jsonb),
    ('guarana-em-po', 'Guaraná em pó', ARRAY['Guaraná em pó']::text[], 'extrato_vegetal'::public.ingredient_category, 820, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/pro-energy.sql"}'::jsonb),
    ('cafeina-anidra', 'Cafeína anidra', ARRAY['Cafeína anidra']::text[], 'outro'::public.ingredient_category, 830, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/pro-energy.sql"}'::jsonb),
    ('l-carnitina', 'L-carnitina', ARRAY['L-carnitina']::text[], 'aminoacido'::public.ingredient_category, 840, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/pro-energy.sql"}'::jsonb),
    ('cloridrato-de-l-arginina', 'Cloridrato de L-arginina', ARRAY['Cloridrato de L-arginina']::text[], 'aminoacido'::public.ingredient_category, 850, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/pro-energy.sql"}'::jsonb),
    ('zinco', 'Zinco', ARRAY['Zinco']::text[], 'mineral'::public.ingredient_category, 860, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/pro-energy.sql"}'::jsonb),
    ('vitamina-b6', 'Vitamina B6', ARRAY['Vitamina B6']::text[], 'vitamina'::public.ingredient_category, 870, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/pro-energy.sql"}'::jsonb),
    ('maltodextrina', 'Maltodextrina', ARRAY['Maltodextrina']::text[], 'outro'::public.ingredient_category, 880, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/pro-energy.sql"}'::jsonb),
    ('dioxido-de-silicio', 'Dióxido de silício', ARRAY['Dióxido de silício']::text[], 'outro'::public.ingredient_category, 890, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/pro-energy.sql"}'::jsonb)
on conflict (slug) do nothing;

-- 2. Exclusão LÓGICA das composições ativas atuais da fórmula (só as que não vieram desta reformulação).
update public.formula_compositions fc
set active = false, deleted_at = now(), reason_deleted = 'reformulação regulatória 2026-09-16'
from public.formulas f
where f.id = fc.formula_id and f.deleted_at is null and f.slug = 'pro-energy'
  and fc.deleted_at is null
  and coalesce(fc.metadata->>'fonte', '') <> 'reformulacao_2026-09-16';

-- 3. Inserção das composições reformuladas (ingredient_id resolvido por slug em public.ingredients).
insert into public.formula_compositions (formula_id, ingredient_name, quantity, unit, sort_order, ingredient_id, metadata)
select f.id, v.ingredient_name, v.quantity, v.unit::public.composition_unit, v.sort_order, i.id, v.metadata::jsonb
from (values
    ('pro-energy', 0, 'Taurina', 200.0, 'mg', 'taurina', '{"fonte": "reformulacao_2026-09-16", "papel": "constituinte", "constituinte_anexo_i": "Taurina — Taurina (CAS 107-35-7)", "laudo_lote": "214586", "laudo_validade": "não confirmada no inventário (scan)", "laudo_vencido": null, "teor_pct": 99.46, "teor_fonte": "laudo lote 214586: 99,5 % b.s. × (1 − 0,04 % umidade) = 99,46 % t.q. (memorial rev02; PDF é scan no inventário — lotes alternativos válidos: INLAB 875699 99,4 % até 10/2027; Lepuge AUTO032878 99,4 % até 01/07/2027)", "ativo_mg": 198.92, "unidade_ativo": "mg", "minimo": "NE", "maximo": 2000, "pct_do_maximo": 9.9, "linha_anexo": "III·Taurina (NE) / IV·Taurina (2.000)", "status": "mantido", "e_sal": false}'),
    ('pro-energy', 1, 'Guaraná em pó (Paullinia cupana Kunth, semente)', 200.0, 'mg', 'guarana-em-po', '{"fonte": "reformulacao_2026-09-16", "papel": "constituinte", "constituinte_anexo_i": "Cafeína — Guaraná em pó (Paullinia cupana)", "laudo_lote": "25H26-B028-213428 (fabricante AUTO9J0E)", "laudo_validade": "28/04/2028", "laudo_vencido": false, "teor_pct": 5.11, "teor_fonte": "laudo lote 25H26-B028-213428: metilxantinas 5,11 % (lido no inventário) — metilxantinas totais, não cafeína isolada; usado só como LIMITE SUPERIOR da cafeína", "ativo_mg": 10.22, "unidade_ativo": "mg de metilxantinas (cafeína ≤ este valor)", "minimo": 75, "maximo": 200, "pct_do_maximo": null, "linha_anexo": "III·Cafeína (75) / IV·Cafeína (200^vi) — soma com a cafeína anidra", "status": "forma trocada", "e_sal": false}'),
    ('pro-energy', 2, 'Cafeína anidra', 150.0, 'mg', 'cafeina-anidra', '{"fonte": "reformulacao_2026-09-16", "papel": "constituinte", "constituinte_anexo_i": "Cafeína — Cafeína/1,3,7-Trimethylxanthine (CAS 58-08-2)", "laudo_lote": "214171", "laudo_validade": "não confirmada no inventário (scan)", "laudo_vencido": null, "teor_pct": 99.88, "teor_fonte": "laudo lote 214171: 100,11 % base anidra; 99,88 % tal qual (memorial rev02, sem demonstrar a umidade) — PDF é scan; alternativos válidos: Lepuge AUTO039045 99,20 % até 31/10/2027", "ativo_mg": 149.82, "unidade_ativo": "mg de cafeína", "minimo": 75, "maximo": 200, "pct_do_maximo": 74.9, "linha_anexo": "III·Cafeína (75) / IV·Cafeína (200^vi)", "status": "mantido", "e_sal": false}'),
    ('pro-energy', 3, 'L-carnitina', 90.0, 'mg', 'l-carnitina', '{"fonte": "reformulacao_2026-09-16", "papel": "constituinte", "constituinte_anexo_i": "L-Carnitina — Levocarnitina/L-carnitina (CAS 541-15-1)", "laudo_lote": "216523", "laudo_validade": "não confirmada (scan)", "laudo_vencido": null, "teor_pct": 95.95, "teor_fonte": "laudo lote 216523: 99,3 % b.a., umidade 3,37 % → 95,95 % t.q. (memorial rev02; scan no inventário; alternativo válido SM 26H14-B025-226329 99,41 % até 20/05/2028)", "ativo_mg": 86.36, "unidade_ativo": "mg", "minimo": "NE", "maximo": 2000, "pct_do_maximo": 4.3, "linha_anexo": "III·L-Carnitina (NE) / IV·L-Carnitina (2.000)", "status": "mantido", "e_sal": false}'),
    ('pro-energy', 4, 'Cloridrato de L-arginina (equivalente a 61,6 mg de L-arginina)', 75.0, 'mg', 'cloridrato-de-l-arginina', '{"fonte": "reformulacao_2026-09-16", "papel": "constituinte", "constituinte_anexo_i": "Arginina — Cloridrato de L-arginina (CAS 1119-34-2)", "laudo_lote": "AUTO035918 (Lepuge, fabricante H24111301)", "laudo_validade": "12/11/2026", "laudo_vencido": false, "teor_pct": 99.4, "teor_fonte": "laudo lote AUTO035918 (99,4 %) × fator sal→base 174,20/210,70 = 82,68 % (memorial rev02, reconferido)", "ativo_mg": 61.64, "unidade_ativo": "mg de arginina", "minimo": "NE", "maximo": 3810, "pct_do_maximo": 1.6, "linha_anexo": "III·Arginina (NE) / IV·Arginina (3.810)", "status": "mantido (nome corrigido)", "e_sal": true}'),
    ('pro-energy', 5, 'Bisglicinato de zinco (equivalente a 3,98 mg de zinco)', 20.0, 'mg', 'zinco', '{"fonte": "reformulacao_2026-09-16", "papel": "constituinte", "constituinte_anexo_i": "Zinco — Bisglicinato de zinco (CAS 14281-83-5)", "laudo_lote": "055-ZN/25", "laudo_validade": "06/05/2027", "laudo_vencido": false, "teor_pct": 19.89, "teor_fonte": "laudo lote 055-ZN/25: 20,00 % b.s. × (1 − 0,54 %) = 19,89 % t.q.", "ativo_mg": 3.98, "unidade_ativo": "mg de zinco", "minimo": 1.65, "maximo": 29.59, "pct_do_maximo": 13.5, "linha_anexo": "III·Zinco (1,65) / IV·Zinco (29,59)", "status": "mantido", "e_sal": true}'),
    ('pro-energy', 6, 'Cloridrato de piridoxina (vitamina B6)', 10.0, 'mg', 'vitamina-b6', '{"fonte": "reformulacao_2026-09-16", "papel": "constituinte", "constituinte_anexo_i": "Vitamina B6 — Cloridrato de piridoxina (CAS 58-56-0)", "laudo_lote": "91188", "laudo_validade": "28/12/2027", "laudo_vencido": false, "teor_pct": 99.9, "teor_fonte": "laudo lote 91188 (99,9 %) × 82,27 % (169,18/205,64)", "ativo_mg": 8.22, "unidade_ativo": "mg de vitamina B6", "minimo": 0.26, "maximo": 98.6, "pct_do_maximo": 8.3, "linha_anexo": "III·Vitamina B_6 (0,26) / IV·Vitamina B_6 (98,60)", "status": "mantido (declaração corrigida)", "e_sal": false}'),
    ('pro-energy', 7, 'Maltodextrina (excipiente, q.s.p.)', 250.0, 'mg', 'maltodextrina', '{"fonte": "reformulacao_2026-09-16", "papel": "veiculo", "ins": null, "laudo_lote": "a definir pela fábrica", "observacao": "PROPOSTA: 250 mg para manter 2 cápsulas tamanho 0 depois da saída do feno-grego; alternativa da fábrica: ajustar a cápsula. Decisão do dono."}'),
    ('pro-energy', 8, 'Antiumectante dióxido de silício', 5.0, 'mg', 'dioxido-de-silicio', '{"fonte": "reformulacao_2026-09-16", "papel": "aditivo", "ins": "INS 551", "laudo_lote": "—", "observacao": "quantum satis; igual ao memorial rev02."}')
) as v(slug, sort_order, ingredient_name, quantity, unit, ingredient_slug, metadata)
join public.formulas f on f.slug = v.slug and f.deleted_at is null
join public.ingredients i on i.slug = v.ingredient_slug and i.deleted_at is null
where not exists (
    select 1 from public.formula_compositions x
    where x.formula_id = f.id and x.deleted_at is null and x.metadata->>'fonte' = 'reformulacao_2026-09-16'
);

-- 4. Dizeres de rotulagem, tabela nutricional (texto) e porção; JSON da tabela em metadata.
update public.formulas f set
    ingredients_list    = 'Maltodextrina, guaraná em pó (Paullinia cupana Kunth, semente), taurina, cafeína anidra, L-carnitina, cloridrato de L-arginina, bisglicinato de zinco, cloridrato de piridoxina, antiumectante dióxido de silício (INS 551); cápsula: gelatina, água purificada e corante dióxido de titânio (INS 171).',
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
Valor energético 1 kcal = 4.3 kJ | 0%
Carboidratos 0,3 g | 0%
Açúcares totais 0 g | 0%
Açúcares adicionados 0 g | 0%
Proteínas 0 g | 0%
Gorduras totais 0 g | 0%
Gorduras saturadas 0 g | 0%
Gorduras trans 0 g | 0%
Fibras alimentares 0 g | 0%
Sódio 0 mg | 0%
Vitamina B6 8,2 mg | 632%
Zinco 4 mg | 36%
Taurina 199 mg |
Cafeína 150 mg |
L-carnitina 86 mg |
Arginina 62 mg |
*Percentual de valores diários fornecidos pela porção',
    serving_description = '2 cápsulas (1 g), 1 vez ao dia',
    metadata            = f.metadata || jsonb_build_object('tabela_nutricional_2026_09_16', '{"porcoes_por_embalagem": 30, "porcao": "1 g (2 cápsulas)", "linhas": [{"item": "Valor energético", "quantidade": 1, "unidade": "kcal", "vd_pct": 0, "kj": 4.3, "nota": "só a maltodextrina foi contabilizada; guaraná em pó sem composição centesimal em disco; taurina, carnitina e arginina livres não computadas como proteína (PROVISÓRIO)"}, {"item": "Carboidratos", "quantidade": 0.3, "unidade": "g", "vd_pct": 0}, {"item": "Açúcares totais", "quantidade": 0.0, "unidade": "g", "vd_pct": 0}, {"item": "Açúcares adicionados", "quantidade": 0.0, "unidade": "g", "vd_pct": 0}, {"item": "Proteínas", "quantidade": 0.0, "unidade": "g", "vd_pct": 0}, {"item": "Gorduras totais", "quantidade": 0.0, "unidade": "g", "vd_pct": 0}, {"item": "Gorduras saturadas", "quantidade": 0.0, "unidade": "g", "vd_pct": 0}, {"item": "Gorduras trans", "quantidade": 0.0, "unidade": "g", "vd_pct": 0}, {"item": "Fibras alimentares", "quantidade": 0.0, "unidade": "g", "vd_pct": 0}, {"item": "Sódio", "quantidade": 0.0, "unidade": "mg", "vd_pct": 0}, {"item": "Vitamina B6", "quantidade": 8.2, "unidade": "mg", "vd_pct": 632}, {"item": "Zinco", "quantidade": 4, "unidade": "mg", "vd_pct": 36}, {"item": "Taurina", "quantidade": 199, "unidade": "mg", "vd_pct": null}, {"item": "Cafeína", "quantidade": 150, "unidade": "mg", "vd_pct": null, "nota": "cafeína da cafeína anidra; a do guaraná em pó (≤ 10,22 mg) só entra na declaração quando houver laudo de cafeína específica — PENDENTE"}, {"item": "L-carnitina", "quantidade": 86, "unidade": "mg", "vd_pct": null}, {"item": "Arginina", "quantidade": 62, "unidade": "mg", "vd_pct": null}], "rodape": "*Percentual de valores diários fornecidos pela porção", "regras": "Arredondamento: Anexo III IN 75/2020 (paráfrase). %VD: Anexo VIII (adultos); macros: Anexo II. Não significativo: %VD 0. Sem VDR: em branco. Taurina em linha própria (Anexo XI, item 10). Energia: Atwater; kJ 17 kJ/g PROVISÓRIO."}'::jsonb, 'reformulacao_2026_09_16', '{"data": "2026-09-16", "veredito": "CONFORME CONDICIONADO A (laudo de cafeína específica e identificação do fornecedor do guaraná em pó; cópias legíveis/válidas dos laudos de cafeína anidra, taurina e L-carnitina; definição do excipiente)", "porcao_mg": 1000.0, "soma_porcao_mg": 1000.0, "cabe": true, "pendencias": ["Guaraná em pó (lote 25H26-B028-213428): laudo com CAFEÍNA específica (o atual traz metilxantinas totais 5,11 %) para declarar a cafeína total exata; identificar o fornecedor (o documento não traz razão social); confirmar compra deste insumo no lugar do extrato seco 22 %.", "Cafeína anidra (214171), taurina (214586) e L-carnitina (216523): os PDFs em disco são digitalizações não lidas no inventário — obter cópia legível com validade (há lotes alternativos válidos listados no JSON).", "Fábrica: excipiente q.s.p. 250 mg (maltodextrina) ou ajuste de cápsula — decisão do dono; refazer o memorial (a soma antes era 1.000 mg com o feno-grego).", "Rótulo: ''cloridrato de L-arginina'' no lugar de ''L-Aspartato de L-arginina''; vitamina B6 8,22 mg (não 10 mg / 769 % VD); frase do Anexo VI no texto literal (''não deve ser consumido…'', hoje ''NÃO RECOMENDADO…''); componentes da cápsula conforme o memorial (gelatina, dióxido de titânio, lauril sulfato de sódio — confirmar).", "Feno-grego: só volta com extrato de semente + laudo de saponinas + fornecedor aceito pelo RT (posição do RT sobre a exigência de fabricante do painel, ausente do Anexo I literal)."]}'::jsonb)
where f.slug = 'pro-energy' and f.deleted_at is null;
