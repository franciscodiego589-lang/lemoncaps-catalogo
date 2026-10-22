-- =====================================================================================
-- Fase 2 — reformulação regulatória 2026-09-16 — fragmento do produto omega-pro-tg
-- Gerado a partir de omega-pro-tg.json (mesmos números). Idempotente; casa por SLUG, nunca por UUID.
-- Veredito esperado: NÃO RESOLVIDO (não existe laudo do óleo de peixe, memorial nem rótulo — a composição do cadastro não tem procedência; e a aplicação do mínimo de 5 g de lipídeos totais ao óleo de peixe depende de posição do RT). Se o laudo confirmar EPA 185,34 + DHA 123,56 mg por 2 softgels e o RT adotar a interpretação 2, a fórmula fica CONFORME (EPA + DHA = 308,9 mg, 15 % do teto)
-- A coluna public.formulas.nutritional_info é TEXT no banco (conferido ao vivo em 16/09/2026);
-- por isso a tabela vai como texto no padrão ANVISA e o JSON estruturado vai em formulas.metadata.
-- Sem guarda de contagem aqui (a consolidação põe).
-- =====================================================================================

-- 1–3. SEM ALTERAÇÃO DE COMPOSIÇÃO: NÃO RESOLVIDO — sem laudo do óleo, memorial ou rótulo não há fonte para gravar composição nova; o SQL só grava os dizeres obrigatórios do art. 14 da RDC 243/2018 (hoje vazios), o alergênico 'peixe' (decorre do único insumo do cadastro) e a porção, e marca a tabela como PROVISÓRIA no metadata.
-- As linhas ativas atuais de public.formula_compositions desta fórmula ficam como estão.

-- 1. Insumos que faltarem em public.ingredients (nome como no Anexo I / rótulo). on conflict do nothing.
-- (nenhum insumo novo)

-- 3. (sem linhas novas de composição — ver cabeçalho)

-- 4. Dizeres de rotulagem, tabela nutricional (texto) e porção; JSON da tabela em metadata.
update public.formulas f set
    ingredients_list    = f.ingredients_list,  -- sem fonte para a lista: fica como está
    warnings            = 'Este produto não é um medicamento.
Público indicado: adultos (19 anos ou mais).
Não exceder a recomendação diária de consumo indicada na embalagem.
Mantenha fora do alcance de crianças.
ALÉRGICOS: CONTÉM PEIXE.
Conservar o produto em local seco, fresco e arejado, ao abrigo da luz e do calor excessivo, em temperatura ambiente entre 15 °C e 30 °C.
Não consumir se o lacre de segurança estiver violado.',
    nutritional_info    = f.nutritional_info,  -- tabela PROVISÓRIA fica só em metadata; o campo público não muda
    serving_description = '2 softgels (1 g de óleo), 1 vez ao dia',
    metadata            = f.metadata || jsonb_build_object('tabela_nutricional_2026_09_16', '{"porcoes_por_embalagem": 30, "porcao": "1 g (2 softgels)", "linhas": [{"item": "Valor energético", "quantidade": 9, "unidade": "kcal", "vd_pct": 0, "kj": 37, "nota": "PROVISÓRIO — 1 g de óleo × 9 kcal/g (Atwater); kJ 37 kJ/g PROVISÓRIO"}, {"item": "Carboidratos", "quantidade": 0.0, "unidade": "g", "vd_pct": 0}, {"item": "Açúcares totais", "quantidade": 0.0, "unidade": "g", "vd_pct": 0}, {"item": "Açúcares adicionados", "quantidade": 0.0, "unidade": "g", "vd_pct": 0}, {"item": "Proteínas", "quantidade": 0.0, "unidade": "g", "vd_pct": 0}, {"item": "Gorduras totais", "quantidade": 1, "unidade": "g", "vd_pct": 2, "nota": "PROVISÓRIO — óleo declarado no cadastro, sem laudo"}, {"item": "Gorduras saturadas", "quantidade": null, "unidade": "g", "vd_pct": null, "nota": "PENDENTE — depende do laudo do óleo (perfil de ácidos graxos)"}, {"item": "Gorduras trans", "quantidade": null, "unidade": "g", "vd_pct": null, "nota": "PENDENTE — laudo do óleo"}, {"item": "Ômega 3", "quantidade": 317, "unidade": "mg", "vd_pct": 8, "nota": "316,5 mg (cadastro); VD 4.000 mg do Anexo II — PROVISÓRIO"}, {"item": "EPA", "quantidade": 185, "unidade": "mg", "vd_pct": null, "nota": "sub-item de ômega 3"}, {"item": "DHA", "quantidade": 124, "unidade": "mg", "vd_pct": null, "nota": "sub-item de ômega 3"}, {"item": "Colesterol", "quantidade": null, "unidade": "mg", "vd_pct": null, "nota": "PENDENTE — laudo do óleo"}, {"item": "Fibras alimentares", "quantidade": 0.0, "unidade": "g", "vd_pct": 0}, {"item": "Sódio", "quantidade": 0.0, "unidade": "mg", "vd_pct": 0}], "rodape": "*Percentual de valores diários fornecidos pela porção", "regras": "TABELA INTEIRA PROVISÓRIA: montada sobre o cadastro, sem laudo do óleo nem memorial. Arredondamento: Anexo III IN 75/2020 (paráfrase). %VD: Anexo II (gorduras 65 g; ômega 3 4.000 mg). Gorduras saturadas, trans e colesterol só com o laudo."}'::jsonb, 'reformulacao_2026_09_16', '{"data": "2026-09-16", "veredito": "NÃO RESOLVIDO (não existe laudo do óleo de peixe, memorial nem rótulo — a composição do cadastro não tem procedência; e a aplicação do mínimo de 5 g de lipídeos totais ao óleo de peixe depende de posição do RT). Se o laudo confirmar EPA 185,34 + DHA 123,56 mg por 2 softgels e o RT adotar a interpretação 2, a fórmula fica CONFORME (EPA + DHA = 308,9 mg, 15 % do teto)", "porcao_mg": 1000.0, "soma_porcao_mg": 1000.0, "cabe": true, "pendencias": ["LAUDO DO ÓLEO DE PEIXE do lote em uso: forma (triglicerídeo / éster etílico / rTG), EPA e DHA em mg/g, perfil de ácidos graxos (saturados, trans), colesterol, oxidação (índice de peróxidos, anisidina, TOTOX), metais pesados (Hg, Pb, Cd, As), dioxinas/PCB, fornecedor e validade. Sem ele não há como confirmar 185,34 mg de EPA e 123,56 mg de DHA nem montar a tabela nutricional.", "MEMORIAL DE CÁLCULO: massa de óleo por softgel, composição da cápsula (gelatina, glicerina, água, antioxidante) e rendimento — não existe.", "RÓTULO/ARTE: não existe; ingredients_list e warnings estão vazios no banco.", "RT: posição escrita sobre o mínimo de 5 g de ''Lipídeos totais'' (Anexo III) — se aplicável ao óleo de peixe como constituinte do grupo Lipídeos (interpretação 1: 1 g fica abaixo; seriam 5 g/dia) ou só a produtos apresentados como fonte de lipídeos (interpretação 2: conforme, EPA + DHA 308,9 mg dentro de 37,5–2.000 mg). O painel oficial mostra as duas informações para ''Óleo de peixe''.", "Os quatro laudos de ''ômega'' em disco são pós (nanoemulsão, ALA vegetal vencido, DHA de alga, scan) — nenhum serve para este softgel."]}'::jsonb)
where f.slug = 'omega-pro-tg' and f.deleted_at is null;
