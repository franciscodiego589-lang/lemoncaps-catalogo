-- =====================================================================================
-- Fase 2 — reformulação regulatória 2026-09-16 — fragmento do produto moro-slim
-- Gerado a partir de moro-slim.json (mesmos números). Idempotente; casa por SLUG, nunca por UUID.
-- Veredito esperado: CONFORME CONDICIONADO A (laudo válido do lote de café verde efetivamente usado; confirmação do insumo de laranja moro em estoque; validade do laudo da vitamina A; posição do RT sobre exigência de fabricante do painel; definição do excipiente)
-- A coluna public.formulas.nutritional_info é TEXT no banco (conferido ao vivo em 16/09/2026);
-- por isso a tabela vai como texto no padrão ANVISA e o JSON estruturado vai em formulas.metadata.
-- Sem guarda de contagem aqui (a consolidação põe).
-- =====================================================================================

-- 1. Insumos que faltarem em public.ingredients (nome como no Anexo I / rótulo). on conflict do nothing.
insert into public.ingredients (slug, name, synonyms, category, sort_order, metadata) values
    ('extrato-de-laranja-moro', 'Extrato de laranja moro', ARRAY['Extrato de laranja moro']::text[], 'extrato_vegetal'::public.ingredient_category, 810, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/moro-slim.sql"}'::jsonb),
    ('extrato-de-cafe-verde', 'Extrato de café verde', ARRAY['Extrato de café verde']::text[], 'extrato_vegetal'::public.ingredient_category, 820, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/moro-slim.sql"}'::jsonb),
    ('vitamina-a', 'Vitamina A', ARRAY['Vitamina A']::text[], 'vitamina'::public.ingredient_category, 830, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/moro-slim.sql"}'::jsonb),
    ('cromo', 'Cromo', ARRAY['Cromo']::text[], 'mineral'::public.ingredient_category, 840, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/moro-slim.sql"}'::jsonb),
    ('maltodextrina', 'Maltodextrina', ARRAY['Maltodextrina']::text[], 'outro'::public.ingredient_category, 850, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/moro-slim.sql"}'::jsonb),
    ('dioxido-de-silicio', 'Dióxido de silício', ARRAY['Dióxido de silício']::text[], 'outro'::public.ingredient_category, 860, '{"fonte": "reformulacao_2026-09-16", "criado_por": "fase2/moro-slim.sql"}'::jsonb)
on conflict (slug) do nothing;

-- 2. Exclusão LÓGICA das composições ativas atuais da fórmula (só as que não vieram desta reformulação).
update public.formula_compositions fc
set active = false, deleted_at = now(), reason_deleted = 'reformulação regulatória 2026-09-16'
from public.formulas f
where f.id = fc.formula_id and f.deleted_at is null and f.slug = 'moro-slim'
  and fc.deleted_at is null
  and coalesce(fc.metadata->>'fonte', '') <> 'reformulacao_2026-09-16';

-- 3. Inserção das composições reformuladas (ingredient_id resolvido por slug em public.ingredients).
insert into public.formula_compositions (formula_id, ingredient_name, quantity, unit, sort_order, ingredient_id, metadata)
select f.id, v.ingredient_name, v.quantity, v.unit::public.composition_unit, v.sort_order, i.id, v.metadata::jsonb
from (values
    ('moro-slim', 0, 'Extrato de laranja moro (Citrus sinensis (L.) Osbeck)', 175.0, 'mg', 'extrato-de-laranja-moro', '{"fonte": "reformulacao_2026-09-16", "papel": "constituinte", "constituinte_anexo_i": "Antocianinas da laranja moro — Extrato de laranja moro (Citrus sinensis (L.) Osbeck) (IN 336/2024)", "laudo_lote": "17624 (AllPremium)", "laudo_validade": "09/04/2027", "laudo_vencido": false, "teor_pct": 1.47, "teor_fonte": "laudo lote 17624 (antocianinas 1,47 %) — lido no inventário e no memorial rev02", "ativo_mg": 2.57, "unidade_ativo": "mg de antocianinas", "minimo": "NE", "maximo": 5, "pct_do_maximo": 51.4, "linha_anexo": "III·Antocianinas da laranja moro (NE, IN 336/2024) / IV·Antocianinas da laranja moro (5)", "status": "mantido", "e_sal": false}'),
    ('moro-slim', 1, 'Extrato de café verde', 110.0, 'mg', 'extrato-de-cafe-verde', '{"fonte": "reformulacao_2026-09-16", "papel": "constituinte", "constituinte_anexo_i": "Ácido clorogênico — Extrato de café verde (IN 102/2021)", "laudo_lote": "10269 (IDNLABS)", "laudo_validade": "08/2027", "laudo_vencido": false, "teor_pct": 64.05, "teor_fonte": "laudo lote 10269 (ácido clorogênico 64,05 %; metilxantinas 1,56 %) — lido no inventário", "ativo_mg": 70.45, "unidade_ativo": "mg de ácido clorogênico", "minimo": "NE", "maximo": 400, "pct_do_maximo": 17.6, "linha_anexo": "III·Ácido clorogênico (NE) / IV·Ácido clorogênico (400, redação IN 102/2021)", "status": "mantido (laudo regularizado)", "e_sal": false}'),
    ('moro-slim', 2, 'Acetato de retinol (vitamina A)', 8.8, 'mg', 'vitamina-a', '{"fonte": "reformulacao_2026-09-16", "papel": "constituinte", "constituinte_anexo_i": "Vitamina A — Acetato de retinol/Acetato de retinila (CAS 127-47-9)", "laudo_lote": "215230", "laudo_validade": "não confirmada em disco (scan)", "laudo_vencido": null, "teor_pct": null, "teor_fonte": "568.116 UI/g lido no memorial rev02; conta: 8,80 mg × 568.116 UI/g = 4.999,4 UI × 0,3 µg RAE/UI = 1.499,8 µg RAE", "ativo_mg": 1499.8, "unidade_ativo": "µg RAE", "minimo": 135, "maximo": 2623.61, "pct_do_maximo": 57.2, "linha_anexo": "III·Vitamina A^ii (135) / IV·Vitamina A^i (2.623,61)", "status": "mantido", "e_sal": false}'),
    ('moro-slim', 3, 'Picolinato de cromo (equivalente a 200 µg de cromo)', 1.62, 'mg', 'cromo', '{"fonte": "reformulacao_2026-09-16", "papel": "constituinte", "constituinte_anexo_i": "Cromo — Picolinato de cromo (CAS 14639-25-9)", "laudo_lote": "91190 (fabricante 2024122501)", "laudo_validade": "24/12/2027", "laudo_vencido": false, "teor_pct": 12.34, "teor_fonte": "laudo lote 91190: Cr elementar 12,34 % (lido no inventário). Conta: 200 µg ÷ 0,1234 = 1,62 mg de picolinato; 1,62 × 12,34 % = 199,9 µg", "ativo_mg": 199.9, "unidade_ativo": "µg de cromo", "minimo": 5.25, "maximo": 250, "pct_do_maximo": 80.0, "linha_anexo": "III·Cromo (5,25) / IV·Cromo (250)", "status": "dose ajustada", "e_sal": true}'),
    ('moro-slim', 4, 'Maltodextrina (excipiente, q.s.p.)', 699.58, 'mg', 'maltodextrina', '{"fonte": "reformulacao_2026-09-16", "papel": "veiculo", "ins": null, "laudo_lote": "a definir pela fábrica", "observacao": "PROPOSTA para manter 2 cápsulas tamanho 0 (1 g) depois da retirada de 709 mg de insumos; alternativa: 1 cápsula de ~300 mg por dia (muda a apresentação — decisão do dono)."}'),
    ('moro-slim', 5, 'Antiumectante dióxido de silício', 5.0, 'mg', 'dioxido-de-silicio', '{"fonte": "reformulacao_2026-09-16", "papel": "aditivo", "ins": "INS 551", "laudo_lote": "certificado anexado ao memorial (doc. 11), sem lote", "observacao": "quantum satis; o rótulo vigente imprime ''2.474 mg'' (erro de ponto decimal, = 2,474 mg); proposta 5 mg."}')
) as v(slug, sort_order, ingredient_name, quantity, unit, ingredient_slug, metadata)
join public.formulas f on f.slug = v.slug and f.deleted_at is null
join public.ingredients i on i.slug = v.ingredient_slug and i.deleted_at is null
where not exists (
    select 1 from public.formula_compositions x
    where x.formula_id = f.id and x.deleted_at is null and x.metadata->>'fonte' = 'reformulacao_2026-09-16'
);

-- 4. Dizeres de rotulagem, tabela nutricional (texto) e porção; JSON da tabela em metadata.
update public.formulas f set
    ingredients_list    = 'Maltodextrina, extrato de laranja moro (Citrus sinensis (L.) Osbeck), extrato de café verde (Coffea canephora — espécie conforme laudo do lote; conferir antes de imprimir), acetato de retinol, antiumectante dióxido de silício (INS 551), picolinato de cromo; cápsula: gelatina, água purificada e corante dióxido de titânio (INS 171).',
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
Valor energético 2,8 kcal = 12 kJ | 0%
Carboidratos 0,7 g | 0%
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
Ácido clorogênico 70 mg |
Antocianinas da laranja moro 2,6 mg |
*Percentual de valores diários fornecidos pela porção',
    serving_description = '2 cápsulas (1 g), 1 vez ao dia',
    metadata            = f.metadata || jsonb_build_object('tabela_nutricional_2026_09_16', '{"porcoes_por_embalagem": 30, "porcao": "1 g (2 cápsulas)", "linhas": [{"item": "Valor energético", "quantidade": 2.8, "unidade": "kcal", "vd_pct": 0, "kj": 12}, {"item": "Carboidratos", "quantidade": 0.7, "unidade": "g", "vd_pct": 0, "nota": "0,70 g > 0,5 g (significativo); 0,7 ÷ 300 = 0,2 % → 0 %"}, {"item": "Açúcares totais", "quantidade": 0.0, "unidade": "g", "vd_pct": 0}, {"item": "Açúcares adicionados", "quantidade": 0.0, "unidade": "g", "vd_pct": 0}, {"item": "Proteínas", "quantidade": 0.0, "unidade": "g", "vd_pct": 0}, {"item": "Gorduras totais", "quantidade": 0.0, "unidade": "g", "vd_pct": 0}, {"item": "Gorduras saturadas", "quantidade": 0.0, "unidade": "g", "vd_pct": 0}, {"item": "Gorduras trans", "quantidade": 0.0, "unidade": "g", "vd_pct": 0}, {"item": "Fibras alimentares", "quantidade": 0.0, "unidade": "g", "vd_pct": 0}, {"item": "Sódio", "quantidade": 0.0, "unidade": "mg", "vd_pct": 0}, {"item": "Vitamina A", "quantidade": 1500, "unidade": "µg RAE", "vd_pct": 187}, {"item": "Cromo", "quantidade": 200, "unidade": "µg", "vd_pct": 571}, {"item": "Ácido clorogênico", "quantidade": 70, "unidade": "mg", "vd_pct": null}, {"item": "Antocianinas da laranja moro", "quantidade": 2.6, "unidade": "mg", "vd_pct": null}], "rodape": "*Percentual de valores diários fornecidos pela porção", "regras": "Arredondamento: Anexo III IN 75/2020 (paráfrase). %VD: Anexo VIII (adultos); macros: Anexo II. Não significativo: %VD 0. Sem VDR: em branco. Energia: só a maltodextrina (extratos sem composição centesimal em disco); kJ 17 kJ/g PROVISÓRIO."}'::jsonb, 'reformulacao_2026_09_16', '{"data": "2026-09-16", "veredito": "CONFORME CONDICIONADO A (laudo válido do lote de café verde efetivamente usado; confirmação do insumo de laranja moro em estoque; validade do laudo da vitamina A; posição do RT sobre exigência de fabricante do painel; definição do excipiente)", "porcao_mg": 1000.0, "soma_porcao_mg": 1000.0, "cabe": true, "pendencias": ["Café verde: decidir o lote (IDNLABS 10269 com laudo válido legível, ou HERBALTEC 10841 com laudo completo a obter); declarar no rótulo a espécie do laudo.", "Laranja moro: confirmar na fábrica que o insumo em estoque é o extrato AllPremium lote 17624 (memorial rev02) e não a ''Laranja Vermelha Nacional em Pó'' citada no parecer PAR-LAU-2026-001.", "RT: posição sobre a ''especificação do fabricante'' do painel (feno-grego = Indus Biotech; laranja moro = BIONAP; café verde) — não consta do Anexo I literal.", "Vitamina A: validade do laudo do lote 215230 (scan); confirmar que a produção pesa 8,80 mg (o memorial rev00 pesava 1,5 mg).", "Fábrica: excipiente q.s.p. 699,58 mg (maltodextrina) ou cápsula/apresentação menor — decisão do dono; refazer o memorial.", "Feno-grego: só volta com extrato de semente + laudo de saponinas + fornecedor aceito pelo RT.", "Rótulo: nome do produto (''MORO SLIM'' × ''MORO SLIM COMPLEX''), remover crustáceos da lista de alergênicos (quitosana sai) e corrigir ''2.474 mg'' de dióxido de silício."]}'::jsonb)
where f.slug = 'moro-slim' and f.deleted_at is null;
