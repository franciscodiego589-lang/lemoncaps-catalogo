-- =====================================================================================
-- Fase 2 — reformulação regulatória 2026-09-16 — fragmento do produto saude-intestinal
-- Gerado a partir de saude-intestinal.json (mesmos números). Idempotente; casa por SLUG, nunca por UUID.
-- Veredito esperado: CONFORME CONDICIONADO A (laudos novos de bisglicinato de magnésio e de quercetina; validade do laudo da vitamina A; definição do excipiente/cápsula pela fábrica)
-- A coluna public.formulas.nutritional_info é TEXT no banco (conferido ao vivo em 16/09/2026);
-- por isso a tabela vai como texto no padrão ANVISA e o JSON estruturado vai em formulas.metadata.
-- Sem guarda de contagem aqui (a consolidação põe).
-- =====================================================================================

-- 1. Insumos que faltarem em public.ingredients (nome como no Anexo I / rótulo). on conflict do nothing.
insert into public.ingredients (slug, name, synonyms, category, sort_order, metadata) values
    ('l-glutamina', 'L-glutamina', ARRAY['L-glutamina']::text[], 'aminoacido'::public.ingredient_category, 810, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/saude-intestinal.sql"}'::jsonb),
    ('magnesio', 'Magnésio', ARRAY['Magnésio']::text[], 'mineral'::public.ingredient_category, 820, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/saude-intestinal.sql"}'::jsonb),
    ('quercetina', 'Quercetina', ARRAY['Quercetina']::text[], 'outro'::public.ingredient_category, 830, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/saude-intestinal.sql"}'::jsonb),
    ('zinco', 'Zinco', ARRAY['Zinco']::text[], 'mineral'::public.ingredient_category, 840, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/saude-intestinal.sql"}'::jsonb),
    ('vitamina-a', 'Vitamina A', ARRAY['Vitamina A']::text[], 'vitamina'::public.ingredient_category, 850, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/saude-intestinal.sql"}'::jsonb),
    ('vitamina-b6', 'Vitamina B6', ARRAY['Vitamina B6']::text[], 'vitamina'::public.ingredient_category, 860, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/saude-intestinal.sql"}'::jsonb),
    ('maltodextrina', 'Maltodextrina', ARRAY['Maltodextrina']::text[], 'outro'::public.ingredient_category, 870, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/saude-intestinal.sql"}'::jsonb),
    ('dioxido-de-silicio', 'Dióxido de silício', ARRAY['Dióxido de silício']::text[], 'outro'::public.ingredient_category, 880, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/saude-intestinal.sql"}'::jsonb)
on conflict (slug) do nothing;

-- 2. Exclusão LÓGICA das composições ativas atuais da fórmula (só as que não vieram desta reformulação).
update public.formula_compositions fc
set active = false, deleted_at = now(), reason_deleted = 'reformulação regulatória 2026-09-16'
from public.formulas f
where f.id = fc.formula_id and f.deleted_at is null and f.slug = 'saude-intestinal'
  and fc.deleted_at is null
  and coalesce(fc.metadata->>'fonte', '') <> 'reformulacao_2026-09-16';

-- 3. Inserção das composições reformuladas (ingredient_id resolvido por slug em public.ingredients).
insert into public.formula_compositions (formula_id, ingredient_name, quantity, unit, sort_order, ingredient_id, metadata)
select f.id, v.ingredient_name, v.quantity, v.unit::public.composition_unit, v.sort_order, i.id, v.metadata::jsonb
from (values
    ('saude-intestinal', 0, 'L-glutamina', 135.54, 'mg', 'l-glutamina', '{"fonte": "reformulacao_2026-09-16", "papel": "constituinte", "constituinte_anexo_i": "Glutamina — L-Glutamina (CAS 56-85-9)", "laudo_lote": "950334", "laudo_validade": "28/01/2027 (memorial rev02); no inventário o PDF é scan não lido — lote alternativo Lepuge AUTO039665 válido até 08/11/2026", "laudo_vencido": false, "teor_pct": 99.6, "teor_fonte": "laudo lote 950334 (99,6 %), lido no memorial rev02 (laudo INLAB, validade 28/01/2027)", "ativo_mg": 135.0, "unidade_ativo": "mg", "minimo": "NE", "maximo": 5000, "pct_do_maximo": 2.7, "linha_anexo": "III·Glutamina (NE) / IV·Glutamina (5.000)", "status": "mantido", "e_sal": false}'),
    ('saude-intestinal', 1, 'Bisglicinato de magnésio (equivalente a 90 mg de magnésio)', 297.81, 'mg', 'magnesio', '{"fonte": "reformulacao_2026-09-16", "papel": "constituinte", "constituinte_anexo_i": "Magnésio — Bisglicinato de magnésio (CAS 14783-68-7)", "laudo_lote": "90844 (fabricante 66342023062230)", "laudo_validade": "21/06/2025", "laudo_vencido": true, "teor_pct": 30.22, "teor_fonte": "laudo lote 90844: 30,38 % base seca (lido) × (1 − 0,53 % umidade) = 30,22 % tal qual (conta do memorial rev02, reconferida) — LAUDO VENCIDO", "ativo_mg": 90.0, "unidade_ativo": "mg de magnésio", "minimo": 63, "maximo": 350, "pct_do_maximo": 25.7, "linha_anexo": "III·Magnésio (63) / IV·Magnésio (350)", "status": "mantido (laudo a renovar)", "e_sal": true}'),
    ('saude-intestinal', 2, 'Quercetina', 72.0, 'mg', 'quercetina', '{"fonte": "reformulacao_2026-09-16", "papel": "constituinte", "constituinte_anexo_i": "Quercetina — Quercetina (IN 418/2025; linha do Anexo I sem CAS)", "laudo_lote": "873635 (INLAB)", "laudo_validade": "06/2026", "laudo_vencido": true, "teor_pct": 96.05, "teor_fonte": "laudo lote 873635 (96,05 %), lido no memorial rev02 — LAUDO VENCIDO (06/2026)", "ativo_mg": 69.16, "unidade_ativo": "mg de quercetina", "minimo": "NE", "maximo": 280, "pct_do_maximo": 24.7, "linha_anexo": "III·Quercetina (NE) / IV·Quercetina (280), IN 418/2025", "status": "mantido (laudo a renovar)", "e_sal": false}'),
    ('saude-intestinal', 3, 'Bisglicinato de zinco (equivalente a 13,5 mg de zinco)', 67.87, 'mg', 'zinco', '{"fonte": "reformulacao_2026-09-16", "papel": "constituinte", "constituinte_anexo_i": "Zinco — Bisglicinato de zinco (CAS 14281-83-5)", "laudo_lote": "055-ZN/25 (Galena)", "laudo_validade": "06/05/2027", "laudo_vencido": false, "teor_pct": 19.89, "teor_fonte": "laudo lote 055-ZN/25: 20,00 % b.s. × (1 − 0,54 %) = 19,89 % t.q.", "ativo_mg": 13.5, "unidade_ativo": "mg de zinco", "minimo": 1.65, "maximo": 29.59, "pct_do_maximo": 45.6, "linha_anexo": "III·Zinco (1,65) / IV·Zinco (29,59)", "status": "mantido", "e_sal": true}'),
    ('saude-intestinal', 4, 'Acetato de retinila (vitamina A)', 3.17, 'mg', 'vitamina-a', '{"fonte": "reformulacao_2026-09-16", "papel": "constituinte", "constituinte_anexo_i": "Vitamina A — Acetato de retinol/Acetato de retinila (CAS 127-47-9)", "laudo_lote": "215230", "laudo_validade": "não confirmada em disco (scan)", "laudo_vencido": null, "teor_pct": null, "teor_fonte": "potência 568.116 UI/g lida no memorial rev02 (laudo lote 215230 é scan não lido no inventário; validade NÃO confirmada). Conta: 3,17 mg × 568.116 UI/g = 1.800,9 UI × 0,3 µg RAE/UI = 540,3 µg RAE", "ativo_mg": 540.3, "unidade_ativo": "µg RAE", "minimo": 135, "maximo": 2623.61, "pct_do_maximo": 20.6, "linha_anexo": "III·Vitamina A^ii (135) / IV·Vitamina A^i (2.623,61)", "status": "mantido", "e_sal": false}'),
    ('saude-intestinal', 5, 'Cloridrato de piridoxina (vitamina B6)', 1.53, 'mg', 'vitamina-b6', '{"fonte": "reformulacao_2026-09-16", "papel": "constituinte", "constituinte_anexo_i": "Vitamina B6 — Cloridrato de piridoxina (CAS 58-56-0)", "laudo_lote": "91188 (fabricante 241229T092)", "laudo_validade": "28/12/2027", "laudo_vencido": false, "teor_pct": 99.9, "teor_fonte": "laudo lote 91188 (99,9 %) × fator sal→base 169,18/205,64 = 82,27 % (estequiométrico, conta do memorial reconferida)", "ativo_mg": 1.26, "unidade_ativo": "mg de vitamina B6", "minimo": 0.26, "maximo": 98.6, "pct_do_maximo": 1.3, "linha_anexo": "III·Vitamina B_6 (0,26) / IV·Vitamina B_6 (98,60)", "status": "mantido", "e_sal": false}'),
    ('saude-intestinal', 6, 'Maltodextrina (excipiente, q.s.p.)', 417.08, 'mg', 'maltodextrina', '{"fonte": "reformulacao_2026-09-16", "papel": "veiculo", "ins": null, "laudo_lote": "a definir pela fábrica", "observacao": "PROPOSTA para completar 1.000 mg (2 cápsulas tamanho 0) depois da retirada de 684 mg de fibras e cúrcuma; a fábrica pode preferir cápsula menor sem excipiente — decisão do dono."}'),
    ('saude-intestinal', 7, 'Antiumectante dióxido de silício', 5.0, 'mg', 'dioxido-de-silicio', '{"fonte": "reformulacao_2026-09-16", "papel": "aditivo", "ins": "INS 551", "laudo_lote": "certificado anexado ao memorial, sem lote", "observacao": "quantum satis; o memorial rev02 alocava 0 mg por falta de espaço — agora há espaço (5 mg = 0,5 %)."}')
) as v(slug, sort_order, ingredient_name, quantity, unit, ingredient_slug, metadata)
join public.formulas f on f.slug = v.slug and f.deleted_at is null
join public.ingredients i on i.slug = v.ingredient_slug and i.deleted_at is null
where not exists (
    select 1 from public.formula_compositions x
    where x.formula_id = f.id and x.deleted_at is null and x.metadata->>'fonte' = 'reformulacao_2026-09-16'
);

-- 4. Dizeres de rotulagem, tabela nutricional (texto) e porção; JSON da tabela em metadata.
update public.formulas f set
    ingredients_list    = 'Maltodextrina, bisglicinato de magnésio, L-glutamina, quercetina, bisglicinato de zinco, antiumectante dióxido de silício (INS 551), acetato de retinila, cloridrato de piridoxina; cápsula: gelatina, água purificada e corante dióxido de titânio (INS 171).',
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
Valor energético 2,2 kcal = 9.4 kJ | 0%
Carboidratos 0,4 g | 0%
Açúcares totais 0 g | 0%
Açúcares adicionados 0 g | 0%
Proteínas 0 g | 0%
Gorduras totais 0 g | 0%
Gorduras saturadas 0 g | 0%
Gorduras trans 0 g | 0%
Fibras alimentares 0 g | 0%
Sódio 0 mg | 0%
Vitamina A 540 µg RAE | 68%
Vitamina B6 1,3 mg | 97%
Magnésio 90 mg | 21%
Zinco 14 mg | 123%
L-glutamina 135 mg |
Quercetina 69 mg |
*Percentual de valores diários fornecidos pela porção',
    serving_description = '2 cápsulas (1 g), 1 vez ao dia',
    metadata            = f.metadata || jsonb_build_object('tabela_nutricional_2026_09_16', '{"porcoes_por_embalagem": 30, "porcao": "1 g (2 cápsulas)", "linhas": [{"item": "Valor energético", "quantidade": 2.2, "unidade": "kcal", "vd_pct": 0, "kj": 9.4}, {"item": "Carboidratos", "quantidade": 0.4, "unidade": "g", "vd_pct": 0}, {"item": "Açúcares totais", "quantidade": 0.0, "unidade": "g", "vd_pct": 0}, {"item": "Açúcares adicionados", "quantidade": 0.0, "unidade": "g", "vd_pct": 0}, {"item": "Proteínas", "quantidade": 0.0, "unidade": "g", "vd_pct": 0, "nota": "L-glutamina é aminoácido livre, declarada em linha própria; não computada como proteína (PROVISÓRIO)"}, {"item": "Gorduras totais", "quantidade": 0.0, "unidade": "g", "vd_pct": 0}, {"item": "Gorduras saturadas", "quantidade": 0.0, "unidade": "g", "vd_pct": 0}, {"item": "Gorduras trans", "quantidade": 0.0, "unidade": "g", "vd_pct": 0}, {"item": "Fibras alimentares", "quantidade": 0.0, "unidade": "g", "vd_pct": 0}, {"item": "Sódio", "quantidade": 0.0, "unidade": "mg", "vd_pct": 0}, {"item": "Vitamina A", "quantidade": 540, "unidade": "µg RAE", "vd_pct": 68}, {"item": "Vitamina B6", "quantidade": 1.3, "unidade": "mg", "vd_pct": 97}, {"item": "Magnésio", "quantidade": 90, "unidade": "mg", "vd_pct": 21}, {"item": "Zinco", "quantidade": 14, "unidade": "mg", "vd_pct": 123, "nota": "13,50 mg arredonda para 14 mg (regra ≥10); %VD calculado sobre 13,50 mg"}, {"item": "L-glutamina", "quantidade": 135, "unidade": "mg", "vd_pct": null}, {"item": "Quercetina", "quantidade": 69, "unidade": "mg", "vd_pct": null}], "rodape": "*Percentual de valores diários fornecidos pela porção", "regras": "Arredondamento: Anexo III da IN 75/2020 (paráfrase do gabarito). %VD: Anexo VIII da IN 75/2020, coluna adultos (macros: Anexo II). Não significativo (Anexo IV): %VD = 0. Sem VDR: célula em branco. Energia: Atwater 4 kcal/g (maltodextrina e glutamina), kJ 17 kJ/g — fatores kJ PROVISÓRIOS."}'::jsonb, 'reformulacao_2026_09_16', '{"data": "2026-09-16", "veredito": "CONFORME CONDICIONADO A (laudos novos de bisglicinato de magnésio e de quercetina; validade do laudo da vitamina A; definição do excipiente/cápsula pela fábrica)", "porcao_mg": 1000.0, "soma_porcao_mg": 1000.0, "cabe": true, "pendencias": ["Bisglicinato de magnésio: laudo do lote 90844 vencido em 21/06/2025 (mesmo lote vencido do Nuviart) — laudo novo do lote em uso, com teor de magnésio.", "Quercetina: laudo do lote 873635 vencido em 06/2026 — laudo novo; RT confirma se a forma di-hidratada atende (o Anexo I diz só ''Quercetina'', sem CAS).", "Vitamina A: validade do laudo do lote 215230 não confirmada em disco (PDF digitalizado não lido) — conferir; o lote alternativo em disco (90494) venceu em 21/10/2024.", "Fábrica: definir o excipiente q.s.p. (proposta: maltodextrina 417,08 mg) ou trocar para cápsula menor sem excipiente; atualizar o memorial (porção passa a fechar em 1.000 mg, antes estourava 26,2 %).", "Dono: o conceito ''fibras'' sai do produto em cápsula (mínimo 5,7 g inatingível). Se quiser manter fibras, só em versão pó/sachê com psyllium + inulina + FOS ≥ 5,7 g por porção — registrada como alternativa, não como proposta.", "Rótulo: remover o texto de apresentação que anuncia ''fibras alimentares'' e a cúrcuma; a contradição rodapé/tabela sobre fibras desaparece com a retirada."]}'::jsonb)
where f.slug = 'saude-intestinal' and f.deleted_at is null;
