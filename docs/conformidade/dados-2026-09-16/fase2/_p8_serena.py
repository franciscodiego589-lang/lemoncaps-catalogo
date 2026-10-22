# -*- coding: utf-8 -*-
from _gerador_base import *
from _laudos_ref import L

# --- massas calculadas -------------------------------------------------------------
mgcl_teor = FRAC["MgCl2"] * 0.994                     # 25,38% Mg tal qual (25,53% estequiométrico × 99,4% de MgCl2 do laudo)
mg_ativo = 70.0; mgcl = mg_ativo / mgcl_teor          # 275,8 mg
tea = 60.0                                            # assumido 100% (a adquirir)
ino = 50 / 0.9986                                     # 50,07
b6_ativo = 1.3; b6 = b6_ativo / (0.999 * FRAC["piridoxina/HCl"])   # 1,58
mel = 0.18 / 0.9933                                   # 0,1812 (laudo vencido)

INSUMOS = [
    I("Magnésio", "Cloreto de magnésio, anidro (CAS 7786-30-3)", mgcl, round(mgcl_teor * 100, 2),
      f"{fmt(mgcl_teor*100,2)}% Mg tal qual — laudo lote 950301 (teor de MgCl2 99,4%) × 25,53% (Mg/MgCl2, estequiométrico); o memorial rev02 usou 25,53% sem descontar os 99,4%", "laudo",
      70, "mg", "I·Cloreto de magnésio; III/IV·Magnésio", L["MGCL"], "dose ajustada",
      "63 mg era o mínimo exato — o próprio memorial recomenda 70 mg (111% do mínimo; 20% do teto). Com o teor do laudo aplicado (25,38%), os 246,77 mg do memorial entregariam 62,6 mg, abaixo do mínimo: a massa sobe para 275,8 mg. Laudo vence em 08/11/2026 — pedir novo.",
      "Magnésio (cloreto de magnésio)", f"70 mg / ({fmt(FRAC['MgCl2']*100,2)}% × 0,994) = {fmt(mgcl,2)} mg de cloreto de magnésio anidro"),
    I("Teanina", "L-teanina de folhas de Camellia sinensis — insumo a adquirir (rota B)", tea, 100.0,
      "100% — assumido; o laudo do lote em uso (AUTO039250, Lepuge) não serve: 'SÍNTESE QUÍMICA'", "assumido",
      60, "mg", "I·L-teanina de folhas de Camellia sinensis (IN 318/2024); III·Teanina 50 mg; IV·250 mg", L["TEA"], "forma trocada (origem) + dose ajustada — PENDENTE laudo",
      "50 mg era o mínimo exato; 60 mg = 120% do mínimo (24% do teto), como o memorial rev02 recomenda. Origem: só a de folhas de Camellia sinensis é autorizada; a fábrica registra que o fornecedor atual (INLAB) não comercializa L-teanina — comprar de distribuidor com especificação Blue California. Rota A (retirar) na seção 8.",
      "L-teanina de folhas de Camellia sinensis", "60 mg / 1,00 = 60,00 mg (assumido; recalcular pelo laudo do insumo novo)", prot_mg=60),
    I("Inositol", "Inositol (Mio-inositol/Meso-inositol) (CAS 87-89-8)", ino, 99.86, "99,86% — laudo lote 950479 (conforme memorial; alternativa IDNLABS YW20241103, 99,61%, val. 11/2028)", "memorial",
      50, "mg", "I·Inositol (Mio-inositol/Meso-inositol) (IN 76/2020); III·NE; IV·2 g", L["INO"], "mantido", "dose do rótulo (2,5% do teto).",
      "Mio-inositol", f"50 mg / 0,9986 = {fmt(ino,2)} mg", carb_mg=50),
    I("Vitamina B6", "Cloridrato de piridoxina (CAS 58-56-0)", b6, 99.9, "99,9% — laudo lote 91188; × 82,27%", "laudo",
      1.3, "mg", "I·Cloridrato de piridoxina; III/IV·Vitamina B6", L["B6"], "mantido", "dose do rótulo (1,3% do teto).",
      "Vitamina B6 (cloridrato de piridoxina)", f"1,3 mg / (0,999 × 0,8227) = {fmt(b6,3)} mg"),
    I("Melatonina", "Melatonina (CAS 73-31-4)", mel, 99.33, "99,33% tal qual — laudo lote 950151 (99,5% b.s. × (1 − 0,17%)), VENCIDO em 09/12/2024 — último teor conhecido", "laudo vencido",
      0.18, "mg", "I·Melatonina (IN 102/2021); III·NE; IV·0,21 mg", L["MEL"], "dose ajustada — PENDENTE laudo",
      "0,21 mg era o teto exato; nova dose 0,18 mg (85,7% do teto). O memorial recomenda 0,19 (90,5%); 0,18 fica dentro da regra de ≤ 90%. O laudo em uso é o mais antigo da linha (lote de dezembro de 2021) e venceu há 21 meses — laudo do lote em uso obrigatório.",
      "Melatonina", f"0,18 mg / 0,9933 = {fmt(mel,4)} mg"),
]

ANTES = [
    ("Magnésio (de cloreto de magnésio)", "63 mg (15% VD)", "CONFORME — igual ao mínimo. Memorial: 246,77 mg de cloreto anidro a 25,53% (sem descontar 99,4% do laudo → 62,6 mg reais); laudo 950301 vence 08/11/2026."),
    ("L-teanina", "50 mg", "NÃO VERIFICADO (origem) — igual ao mínimo. Memorial: lote AUTO039250, laudo lido em 16/09: 'SÍNTESE QUÍMICA'; INLAB não comercializa L-teanina."),
    ("Mio-inositol", "50 mg", "CONFORME. Memorial: 50,07 mg (lote 950479)."),
    ("Vitamina B6 (cloridrato de piridoxina)", "1,3 mg (100% VD)", "CONFORME. Memorial: 1,58 mg (lote 91188)."),
    ("Melatonina", "0,21 mg", "CONFORME — igual ao máximo. Laudo lote 950151 VENCIDO em 09/12/2024 (lote de 12/2021); todos os laudos de melatonina da máquina vencidos."),
]

soma_ins = sum(i["massa"] for i in INSUMOS)
conserv = 4.0
veic = 1000 - soma_ins - conserv

P = dict(
    slug="serena", nome="Serena", nome_rotulo="Serena (arte Serena.pdf)",
    formato="solução oral em gotas (frasco conta-gotas de 30 mL)", porcao_mg=1000.0, porcao_desc="1 mL (20 gotas)",
    porcoes=30, grupo="adulto", publico="adultos, coluna \"> 19 anos\" dos Anexos III e IV (a melatonina é 'NA' nos demais grupos)",
    porcao_obs=" (1 mL tratado como 1.000 mg, como faz o memorial rev02 — a densidade da solução glicerina/água não foi medida)",
    insumos=INSUMOS, antes=ANTES,
    excipientes=[dict(nome="Glicerina vegetal (glicerol, umectante/veículo) e água purificada — q.s.p. 1 mL", ins="422", massa=veic, sql_slug=None,
                      obs="o memorial rev02 registra 647,45 mg de veículo sem desmembrar; o documento POPS desmembra em glicerina 133,33 mg + água q.s.p. — a massa de glicerina (que entra no valor energético) é PROVISÓRIA", carb_mg=133.33),
                 dict(nome="Sorbato de potássio (conservador)", ins="202", massa=2.0, sql_slug=None, obs="laudo lote 91202 (100,30%, val. 05/01/2028)"),
                 dict(nome="Benzoato de sódio (conservador)", ins="211", massa=2.0, sql_slug=None, obs="laudo lote 950430 (99,77%, val. 25/04/2028)", na_mg=2.0 * FRAC["Na/benzoato"]),
                 dict(nome="Citrato de sódio (regulador de acidez) e ácido cítrico (acidulante)", ins="331 / 330", massa=None, sql_slug=None,
                      obs="constam do rótulo; massas não registradas no memorial rev02 — PENDENTE (o citrato de sódio também aporta sódio, não contado)"),
                 dict(nome="Aromatizante idêntico ao natural", ins=None, massa=None, sql_slug=None, obs="consta do rótulo; massa não registrada — PENDENTE")],
    removidos=["**L-teanina sintética (lote AUTO039250)** — substituída pela de folhas de Camellia sinensis (rota B); o lote em estoque não pode ser usado."],
    removidos_json=[],
    mudancas=[
        "Magnésio: 63 → 70 mg (cloreto anidro 246,77 → 275,8 mg) — motivo: mínimo exato sem folga; e a massa do memorial, com o teor real do laudo (99,4% de MgCl2), entrega 62,6 mg. Pedir laudo novo antes de 08/11/2026.",
        "L-teanina: 50 → 60 mg e origem sintética → \"L-teanina de folhas de Camellia sinensis\" — motivos: mínimo exato sem folga; e só a de Camellia sinensis é autorizada (Anexo I, IN 318/2024). Insumo a adquirir (rota B).",
        "Melatonina: 0,21 → 0,18 mg — motivo: teto exato (Anexo IV: 0,21 mg); laudo vigente obrigatório.",
        "Mio-inositol e vitamina B6: mantidos.",
        "Advertência específica da melatonina (Anexo VI) acrescentada — hoje falta no cadastro e no rótulo.",
        "Valor energético refeito a partir dos insumos (o memorial já apontava que '1 kcal com 0,5 g de carboidratos' não fechava).",
    ],
    ingredients_list="Glicerina vegetal (glicerol – INS 422), água purificada, cloreto de magnésio, L-teanina de folhas de Camellia sinensis, mio-inositol, citrato de sódio (INS 331), ácido cítrico (INS 330), conservador sorbato de potássio (INS 202), conservador benzoato de sódio (INS 211), cloridrato de piridoxina (vitamina B6), melatonina e aromatizante idêntico ao natural.",
    ingredientes_intro="Ordem decrescente de massa por porção. Citrato de sódio, ácido cítrico e aromatizante ficam na posição do rótulo vigente porque suas massas não estão registradas no memorial (PENDENTE) — a ordem entre eles e os conservantes só pode ser fechada com essas massas.",
    alergenicos_obs="Nenhum insumo deriva dos alergênicos da RDC 26/2015. Sem declaração de glúten até laudo do produto acabado. Conferência dos aditivos (sorbato, benzoato, citrato, ácido cítrico, aromatizante) na IN 211/2023 para a categoria de suplementos LÍQUIDOS não foi feita nesta etapa — a auditoria de 15/09 conferiu só a categoria 14.2 (sólidos) — PENDENTE.",
    warnings="\n".join(RDC243 + ["Público indicado: adultos (19 anos ou mais). Ingerir 20 gotas (1 mL) ao dia, preferencialmente à noite.", ADV_MELATONINA, CONSERVACAO]),
    advertencias_base=[
        "Três frases do art. 14, I, c/d/e da RDC 243/2018 (texto literal); grupo e frequência — art. 14, I, a/b; conservação — art. 14, II.",
        f"\"{ADV_MELATONINA}\" — IN 28/2018, Anexo VI, linha \"Melatonina\" (IN 102/2021), texto literal. A primeira oração cobre também as linhas \"Aminoácidos\" (L-teanina) e \"Inositol\" (IN 102/2021), que exigem a frase genérica.",
    ],
    advertencias_faltam="a segunda oração da advertência da melatonina (\"…pessoas envolvidas em atividades que requerem atenção constante. Pessoas com enfermidades e/ou sob o uso de medicamentos, consulte seu médico.\") não está no campo `warnings` nem no rótulo (auditoria de 15/09, seção 4.5).",
    pendencias=[
        "**Laudo vigente de melatonina** do lote a pesar — o laudo em uso (950151) venceu em 09/12/2024 e é o mais antigo da linha; os outros quatro laudos de melatonina da máquina também venceram.",
        "**L-teanina — decisão do dono:** rota B (proposta principal: comprar \"L-teanina de folhas de Camellia sinensis\", especificação Blue California, com laudo de origem — o fornecedor atual não a tem) ou rota A (retirar; Serena ficaria com magnésio, inositol, B6 e melatonina — ainda um produto de sono, mas com a chamada do rótulo alterada).",
        "**Laudo novo de cloreto de magnésio anidro** antes de 08/11/2026 (o lote 950301 vence em ~7 semanas); recalcular 275,8 mg pelo teor.",
        "**Massas do veículo e dos aditivos:** registrar no memorial a glicerina (POPS: 133,33 mg — provisória), o citrato de sódio, o ácido cítrico e o aromatizante; o valor energético e o sódio da tabela dependem disso.",
        "**Aditivos em suplemento líquido:** conferir sorbato de potássio, benzoato de sódio, citrato de sódio, ácido cítrico e aromatizante na categoria de suplementos líquidos da IN 211/2023 (não conferida; a auditoria só leu a 14.2).",
        "**Conta-gotas:** o memorial aponta que Serena declara 1 mL = 20 gotas e o Slim Up 1 mL = 30 gotas para o mesmo tipo de frasco — confirmar com o fornecedor da embalagem; e o laudo do frasco de 30 mL não foi localizado.",
        "**Rótulo:** atualizar magnésio (70 mg), L-teanina (60 mg, com a origem no nome), melatonina (0,18 mg); acrescentar a advertência específica da melatonina; refazer a tabela (o rótulo declara 1 kcal / 0,3 g de carboidratos sem conta).",
    ],
    alternativas=[
        "**Rota A da L-teanina (retirar):** 4 constituintes; veredito condicionado só aos laudos de melatonina e cloreto de magnésio.",
        "**Melatonina a 0,19 mg** (90,5% do teto), como o memorial rev02 recomenda — ligeiramente acima da folga de 10% desta fase; fica como opção do RT.",
        "**Cloreto de magnésio hexaidratado** (laudo SM 26D28-B047-221936, 99,9%, val. 07/12/2028): entregaria 70 mg de Mg em 586 mg/mL (11,955% de Mg estequiométrico × 99,9%) — o memorial considera inviável para a solução; registrado apenas porque é a única fonte de magnésio com laudo longo.",
    ],
    veredito="CONFORME CONDICIONADO A (laudo de origem Camellia sinensis da L-teanina nova; laudo vigente de melatonina; laudo novo de cloreto de magnésio; massas do veículo e dos aditivos registradas)",
    veredito_texto="Com a composição da seção 3, os três constituintes cravados em limites (magnésio e teanina no mínimo; melatonina no máximo) ganham folga (magnésio 111% do mínimo, teanina 120%, melatonina 85,7% do teto), a L-teanina passa à única origem autorizada, e a porção de 1 mL comporta os " + fmt(soma_ins+conserv,1) + " mg de sólidos com veículo q.s.p. Restam três laudos (teanina de origem vegetal, melatonina, cloreto de magnésio) e o registro das massas do veículo — sem eles, o veredito não passa de condicionado.",
    fontes=[
        "/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/IN28-2018-ANEXO-I-LITERAL.md",
        "/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/IN28-2018-ANEXO-III-LITERAL.md",
        "/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/IN28-2018-ANEXOS-IV-V-VI-LITERAL.md",
        "/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/AUDITORIA-ROTULO-VS-ANVISA-2026-09-15.md (seção 4.5)",
        "/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/composicoes_rotulo.json (chave serena)",
        "/private/tmp/claude-501/-Users-diegofrancisco-Downloads-erp-espa-o/c5ed6b00-4553-4992-b469-c649af084651/scratchpad/fase1/memoriais-formulacoes.json (chave serena — MEMORIAL-CALCULO-SERENA-rev02.docx)",
        "/private/tmp/claude-501/-Users-diegofrancisco-Downloads-erp-espa-o/c5ed6b00-4553-4992-b469-c649af084651/scratchpad/fase1/laudos.json (índices 6, 37, 82, 194, 199, 200, 203, 207, 40, 41, 163)",
        "/Users/diegofrancisco/Desktop/LAUDOS/VITAMINA D3 COLECALCIFEROL.pdf (compilação Lepuge; bloco L-TEANINA lote AUTO039250: 'Forma de Obtenção: SÍNTESE QUÍMICA', doseamento 100,16% b.a., perda por secagem 0,37%, val. 13/08/27)",
        "/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/PADRAO-ANVISA-TABELA-NUTRICIONAL-2026-09-16.md e scratchpad/padrao-anvisa/vd.json",
        "cadastro vivo: formulas?slug=eq.serena e formula_compositions (5 linhas ativas, lidas em 16/09/2026)",
    ],
    prosa=dict(
        identificacao_extra="Único produto líquido do grupo. O memorial rev02 fecha 1 mL em 1.000 mg (352,55 mg de sólidos + 647,45 mg de veículo) e já recomenda subir magnésio para 70 mg, teanina para 60 mg e baixar melatonina para 0,19 mg — esta reformulação adota os dois primeiros e leva a melatonina a 0,18 mg (≤ 90% do teto).",
        antes_intro="Fonte da tabela: composição impressa no rótulo (`composicoes_rotulo.json`, chave `serena`, 5 itens), com o veredito da auditoria de 15/09/2026 (seção 4.5) e a observação do memorial rev02.",
        antes_extra="Nenhum constituinte fora da faixa, mas três cravados em limites, uma origem não autorizada (teanina) e o laudo de melatonina vencido há 21 meses. A auditoria classificou como NÃO VERIFICÁVEL só pela teanina.",
        depois_intro="Grupo \"> 19 anos\". Folga criada nos três limites cravados; origem da teanina corrigida (rota B); demais doses mantidas.",
        soma_comentario="Os sólidos somam " + fmt(soma_ins+conserv,1) + " mg (constituintes + conservantes); o veículo (glicerina + água) completa 1 mL — cabe com folga. O memorial rev02 observa que, se o cloreto fosse o hexaidratado, seriam ~530 mg/mL só de sal (inviável); a forma anidra (laudo 950301) é a que viabiliza a solução.",
        tabela_intro="Coluna \"> 19 anos\" do Anexo VIII da IN 75/2020. Teanina, inositol e melatonina sem VDR (células vazias).",
        tabela_energia_obs="Carboidratos: glicerina 133,33 mg (massa PROVISÓRIA, do documento POPS; contada como carboidrato a 4 kcal/g — assunção, pois o Anexo XXII lido no gabarito não traz fator próprio para glicerol) + inositol 50 mg. Proteínas: L-teanina 60 mg. Total 1,0 kcal, abaixo de 4 kcal (não significativo). Sódio: benzoato de sódio 2 mg (15,95% de Na) = 0,32 mg — o citrato de sódio não foi contado (massa PENDENTE); se ultrapassar 5 mg, o %VD deixa de ser zero.",
    ),
)
