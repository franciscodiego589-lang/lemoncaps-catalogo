-- =====================================================================================
-- Fase 2 — reformulação regulatória 2026-09-16 — fragmento do produto shot-colageno-300-gramas
-- Gerado a partir de shot-colageno-300-gramas.json (mesmos números). Idempotente; casa por SLUG, nunca por UUID.
-- Veredito esperado: CONFORME CONDICIONADO A (laudo de proteína do lote de colágeno em uso e origem animal; decisão do dono sobre a porção — 10 g com folga estreita ou 12 g; identificação do corante; laudo novo da maltodextrina)
-- A coluna public.formulas.nutritional_info é TEXT no banco (conferido ao vivo em 16/09/2026);
-- por isso a tabela vai como texto no padrão ANVISA e o JSON estruturado vai em formulas.metadata.
-- Sem guarda de contagem aqui (a consolidação põe).
-- =====================================================================================

-- 1. Insumos que faltarem em public.ingredients (nome como no Anexo I / rótulo). on conflict do nothing.
insert into public.ingredients (slug, name, synonyms, category, sort_order, metadata) values
    ('colageno-hidrolisado', 'Colágeno hidrolisado', ARRAY['Colágeno hidrolisado']::text[], 'outro'::public.ingredient_category, 810, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/shot-colageno-300-gramas.sql"}'::jsonb),
    ('vitamina-c', 'Vitamina C', ARRAY['Vitamina C']::text[], 'vitamina'::public.ingredient_category, 820, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/shot-colageno-300-gramas.sql"}'::jsonb),
    ('zinco', 'Zinco', ARRAY['Zinco']::text[], 'mineral'::public.ingredient_category, 830, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/shot-colageno-300-gramas.sql"}'::jsonb),
    ('acido-citrico', 'Ácido cítrico', ARRAY['Ácido cítrico']::text[], 'outro'::public.ingredient_category, 840, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/shot-colageno-300-gramas.sql"}'::jsonb),
    ('aromatizante-identico-ao-natural-de-limao', 'Aromatizante idêntico ao natural de limão', ARRAY['Aromatizante idêntico ao natural de limão']::text[], 'outro'::public.ingredient_category, 850, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/shot-colageno-300-gramas.sql"}'::jsonb),
    ('maltodextrina', 'Maltodextrina', ARRAY['Maltodextrina']::text[], 'outro'::public.ingredient_category, 860, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/shot-colageno-300-gramas.sql"}'::jsonb),
    ('dioxido-de-silicio', 'Dióxido de silício', ARRAY['Dióxido de silício']::text[], 'outro'::public.ingredient_category, 870, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/shot-colageno-300-gramas.sql"}'::jsonb),
    ('edulcorante-sucralose', 'Edulcorante sucralose', ARRAY['Edulcorante sucralose']::text[], 'outro'::public.ingredient_category, 880, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/shot-colageno-300-gramas.sql"}'::jsonb),
    ('corante-verde', 'Corante verde', ARRAY['Corante verde']::text[], 'outro'::public.ingredient_category, 890, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/shot-colageno-300-gramas.sql"}'::jsonb)
on conflict (slug) do nothing;

-- 2. Exclusão LÓGICA das composições ativas atuais da fórmula (só as que não vieram desta reformulação).
update public.formula_compositions fc
set active = false, deleted_at = now(), reason_deleted = 'reformulação regulatória 2026-09-16'
from public.formulas f
where f.id = fc.formula_id and f.deleted_at is null and f.slug = 'shot-colageno-300-gramas'
  and fc.deleted_at is null
  and coalesce(fc.metadata->>'fonte', '') <> 'reformulacao_2026-09-16';

-- 3. Inserção das composições reformuladas (ingredient_id resolvido por slug em public.ingredients).
insert into public.formula_compositions (formula_id, ingredient_name, quantity, unit, sort_order, ingredient_id, metadata)
select f.id, v.ingredient_name, v.quantity, v.unit::public.composition_unit, v.sort_order, i.id, v.metadata::jsonb
from (values
    ('shot-colageno-300-gramas', 0, 'Colágeno hidrolisado', 9450.0, 'mg', 'colageno-hidrolisado', '{"fonte": "reformulacao_2026-09-16", "papel": "constituinte", "constituinte_anexo_i": "Proteínas — Gelatina hidrolisada/Colágeno hidrolisado", "laudo_lote": "Peptan AUTO040177 (sem doseamento) / Verisol 10.236 (91,0 %, vencido)", "laudo_validade": "23/04/2030 (Peptan) / 15/05/2026 (Verisol)", "laudo_vencido": null, "teor_pct": 91.0, "teor_fonte": "PROVISÓRIO — 91,0 % de proteína (Kjeldahl) é o ÚLTIMO TEOR CONHECIDO, de laudo vencido (Verisol); o Peptan válido não tem doseamento. O teor real do lote em uso é PENDENTE de laudo (proteína por N × 6,25 ou Kjeldahl)", "ativo_mg": 8599.5, "unidade_ativo": "mg de proteínas (PROVISÓRIO)", "minimo": 8400, "maximo": "NE", "pct_do_maximo": null, "linha_anexo": "III·Proteínas (8,4) / IV·Proteínas (NE)", "status": "dose ajustada", "e_sal": false}'),
    ('shot-colageno-300-gramas', 1, 'Ácido ascórbico (vitamina C)', 201.01, 'mg', 'vitamina-c', '{"fonte": "reformulacao_2026-09-16", "papel": "constituinte", "constituinte_anexo_i": "Vitamina C — Ácido ascórbico/Ácido L-ascórbico (CAS 50-81-7)", "laudo_lote": "950467", "laudo_validade": "05/03/2029", "laudo_vencido": false, "teor_pct": 99.5, "teor_fonte": "laudo lote 950467 (99,5 %)", "ativo_mg": 200.0, "unidade_ativo": "mg", "minimo": 13.5, "maximo": 1916.02, "pct_do_maximo": 10.4, "linha_anexo": "III·Vitamina C (13,5) / IV·Vitamina C (1.916,02)", "status": "dose ajustada", "e_sal": false}'),
    ('shot-colageno-300-gramas', 2, 'Bisglicinato de zinco (equivalente a 2,2 mg de zinco)', 11.06, 'mg', 'zinco', '{"fonte": "reformulacao_2026-09-16", "papel": "constituinte", "constituinte_anexo_i": "Zinco — Bisglicinato de zinco (CAS 14281-83-5)", "laudo_lote": "055-ZN/25", "laudo_validade": "06/05/2027", "laudo_vencido": false, "teor_pct": 19.89, "teor_fonte": "laudo lote 055-ZN/25: 20,00 % b.s. × (1 − 0,54 %) = 19,89 % t.q.; 2,2 ÷ 0,1989 = 11,06 mg", "ativo_mg": 2.2, "unidade_ativo": "mg de zinco", "minimo": 1.65, "maximo": 29.59, "pct_do_maximo": 7.4, "linha_anexo": "III·Zinco (1,65) / IV·Zinco (29,59)", "status": "dose ajustada", "e_sal": true}'),
    ('shot-colageno-300-gramas', 3, 'Acidulante ácido cítrico', 150.0, 'mg', 'acido-citrico', '{"fonte": "reformulacao_2026-09-16", "papel": "aditivo", "ins": "INS 330", "laudo_lote": "GE2844AFG", "observacao": "670 (ficha) / 400 (cadastro) → 150 mg para caber; quantum satis."}'),
    ('shot-colageno-300-gramas', 4, 'Aromatizante idêntico ao natural de limão', 100.0, 'mg', 'aromatizante-identico-ao-natural-de-limao', '{"fonte": "reformulacao_2026-09-16", "papel": "aditivo", "ins": null, "laudo_lote": "19934/19504 (Alphataste)", "observacao": "330 (''Fresh Drink Limão'', ficha) / 200 (cadastro) → 100 mg; quantum satis (idêntico ao natural); a ficha chama de ''Fresh Drink Limão'' — confirmar que é o mesmo insumo."}'),
    ('shot-colageno-300-gramas', 5, 'Maltodextrina (veículo, q.s.p.)', 47.93, 'mg', 'maltodextrina', '{"fonte": "reformulacao_2026-09-16", "papel": "veiculo", "ins": null, "laudo_lote": "210170 — VENCIDO (26/07/2026)", "observacao": "q.s.p. calculado: 10.000 − 9.952,07."}'),
    ('shot-colageno-300-gramas', 6, 'Antiumectante dióxido de silício', 20.0, 'mg', 'dioxido-de-silicio', '{"fonte": "reformulacao_2026-09-16", "papel": "aditivo", "ins": "INS 551", "laudo_lote": "—", "observacao": "100 → 20 mg (0,2 %); quantum satis."}'),
    ('shot-colageno-300-gramas', 7, 'Edulcorante sucralose', 15.0, 'mg', 'edulcorante-sucralose', '{"fonte": "reformulacao_2026-09-16", "papel": "aditivo", "ins": "INS 955", "laudo_lote": "91233", "observacao": "50 → 15 mg; 15 mg ÷ 0,210 kg = 71,4 mg/kg no produto pronto (limite 2.400 mg/kg)."}'),
    ('shot-colageno-300-gramas', 8, 'Corantes tartrazina e azul brilhante FCF', 5.0, 'mg', 'corante-verde', '{"fonte": "reformulacao_2026-09-16", "papel": "aditivo", "ins": "INS 102, INS 133", "laudo_lote": "250301 (''verde folha'') — sem INS nem doseamento", "observacao": "17 → 5 mg; 5 ÷ 0,210 kg = 23,8 mg/kg (limite 300 mg/kg cada). Identificação dos corantes PENDENTE."}')
) as v(slug, sort_order, ingredient_name, quantity, unit, ingredient_slug, metadata)
join public.formulas f on f.slug = v.slug and f.deleted_at is null
join public.ingredients i on i.slug = v.ingredient_slug and i.deleted_at is null
where not exists (
    select 1 from public.formula_compositions x
    where x.formula_id = f.id and x.deleted_at is null and x.metadata->>'fonte' = 'reformulacao_2026-09-16'
);

-- 4. Dizeres de rotulagem, tabela nutricional (texto) e porção; JSON da tabela em metadata.
update public.formulas f set
    ingredients_list    = 'Colágeno hidrolisado, ácido ascórbico (vitamina C), acidulante ácido cítrico (INS 330), aromatizante idêntico ao natural de limão, maltodextrina, antiumectante dióxido de silício (INS 551), edulcorante sucralose (INS 955), bisglicinato de zinco, corantes tartrazina (INS 102) e azul brilhante FCF (INS 133). ALERGÊNICOS: conforme a origem do colágeno do lote (bovino/suíno: sem alergênico da RDC 26/2015; peixe: ''Contém peixe'') — PENDENTE.',
    warnings            = 'Este produto não é um medicamento.
Público indicado: adultos (19 anos ou mais).
Não exceder a recomendação diária de consumo indicada na embalagem.
Mantenha fora do alcance de crianças.
Contém TARTRAZINA (INS 102).
Conservar o produto em local seco, fresco e arejado, ao abrigo da luz e do calor excessivo, em temperatura ambiente entre 15 °C e 30 °C.
Após aberto, consumir em até 60 dias.
Não consumir se o lacre de segurança estiver violado.',
    nutritional_info    = 'INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 10 g (1 dose = 1 medida rasa, diluída em 200 mL de água)
Quantidade por porção | %VD*
Valor energético 35 kcal = 149 kJ | 2%
Carboidratos 0 g | 0%
Açúcares totais 0 g | 0%
Açúcares adicionados 0 g | 0%
Proteínas 8,6 g | 17%
Gorduras totais 0 g | 0%
Gorduras saturadas 0 g | 0%
Gorduras trans 0 g | 0%
Fibras alimentares 0 g | 0%
Sódio 0 mg | 0%
Vitamina C 200 mg | 200%
Zinco 2,2 mg | 20%
*Percentual de valores diários fornecidos pela porção',
    serving_description = '10 g (1 dose) diluída em 200 mL de água, 1 vez ao dia',
    metadata            = f.metadata || jsonb_build_object('tabela_nutricional_2026_09_16', '{"porcoes_por_embalagem": 30, "porcao": "10 g (1 dose = 1 medida rasa, diluída em 200 mL de água)", "linhas": [{"item": "Valor energético", "quantidade": 35, "unidade": "kcal", "vd_pct": 2, "kj": 149, "nota": "proteína do colágeno a 91 % (PROVISÓRIO); maltodextrina 4 kcal/g; ácido cítrico 3 kcal/g; kJ 17/17/13 kJ/g PROVISÓRIOS"}, {"item": "Carboidratos", "quantidade": 0.0, "unidade": "g", "vd_pct": 0}, {"item": "Açúcares totais", "quantidade": 0.0, "unidade": "g", "vd_pct": 0}, {"item": "Açúcares adicionados", "quantidade": 0.0, "unidade": "g", "vd_pct": 0}, {"item": "Proteínas", "quantidade": 8.6, "unidade": "g", "vd_pct": 17, "nota": "PROVISÓRIO — depende do laudo de proteína do lote de colágeno"}, {"item": "Gorduras totais", "quantidade": 0.0, "unidade": "g", "vd_pct": 0}, {"item": "Gorduras saturadas", "quantidade": 0.0, "unidade": "g", "vd_pct": 0}, {"item": "Gorduras trans", "quantidade": 0.0, "unidade": "g", "vd_pct": 0}, {"item": "Fibras alimentares", "quantidade": 0.0, "unidade": "g", "vd_pct": 0}, {"item": "Sódio", "quantidade": 0.0, "unidade": "mg", "vd_pct": 0, "nota": "sódio do colágeno hidrolisado desconhecido — PENDENTE laudo"}, {"item": "Vitamina C", "quantidade": 200, "unidade": "mg", "vd_pct": 200}, {"item": "Zinco", "quantidade": 2.2, "unidade": "mg", "vd_pct": 20}], "rodape": "*Percentual de valores diários fornecidos pela porção", "regras": "Arredondamento: Anexo III IN 75/2020 (paráfrase). %VD: Anexo VIII (adultos); macros: Anexo II (proteínas 50 g). Não significativo: %VD 0. Colágeno hidrolisado declarado como Proteínas (grupo do Anexo I), não como bioativo."}'::jsonb, 'reformulacao_2026_09_16', '{"data": "2026-09-16", "veredito": "CONFORME CONDICIONADO A (laudo de proteína do lote de colágeno em uso e origem animal; decisão do dono sobre a porção — 10 g com folga estreita ou 12 g; identificação do corante; laudo novo da maltodextrina)", "porcao_mg": 10000.0, "soma_porcao_mg": 10000.0, "cabe": true, "pendencias": ["Colágeno: laudo de PROTEÍNA (N × 6,25 ou Kjeldahl) do lote em uso — o Peptan AUTO040177 (válido) não traz doseamento; o Verisol 10.236 (91,0 %) aparenta vencido. A conta de 9.450 mg foi feita com 91,0 % (PROVISÓRIO): se o teor real for menor que 88,9 %, a proteína cai abaixo de 8,4 g e a massa tem de subir (ou a porção mudar).", "Dono: porção 10 g (proposta principal, folga de 2,4 % sobre o mínimo) ou 12 g (alternativa: colágeno 9.900 mg = 9,01 g a 91 %, vitamina C 800 mg, 25 porções por pote) — a de 12 g é a robusta.", "Colágeno: qual insumo está em produção (Verisol da ficha ou Peptan do Nuviart) e origem animal (para o alergênico).", "Vitamina C: confirmar a redução para 200 mg (ou aceitar a porção de 12 g com 800 mg).", "Corante: identificar os corantes e os INS (certificado 250301 não traz) e confirmar a frase da tartrazina; aroma: confirmar que ''Fresh Drink Limão'' é o aromatizante idêntico ao natural de limão.", "Maltodextrina: laudo novo (lote 210170 vencido).", "Rótulo/cadastro: retirar cúrcuma, café verde e laranja moro da lista de ingredientes (não estão na composição); não usar a alegação ''fonte de proteínas'' (Anexo V/VII)."]}'::jsonb)
where f.slug = 'shot-colageno-300-gramas' and f.deleted_at is null;
