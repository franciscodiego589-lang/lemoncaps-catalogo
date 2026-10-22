# -*- coding: utf-8 -*-
from _gerador_base import *
from _laudos_ref import L

# --- massas calculadas -------------------------------------------------------------
vitc = 250 / 0.995                                       # 251,26
met = 110 / 0.993                                        # 110,78
cis_sal = 100.0; cis_ativo = cis_sal * 0.994383 * FRAC["cisteina/HCl"]   # 76,44 mg de cisteína
e_po = 45.0; e_ativo = e_po * 0.507 * 0.67               # 15,29 mg alfa-TE (massa do memorial mantida)
msm = 50 / 0.9993                                        # 50,04 (lote 950413)
ha = 50 / 0.957                                          # 52,25
si_po = 50.0; si_ativo = si_po * 0.0143                  # 0,715 mg Si
b3 = 31 / 0.9909                                         # 31,28
zn = 15 / 0.1989                                         # 75,41
b6_sal = 10.0; b6_ativo = b6_sal * 0.999 * FRAC["piridoxina/HCl"]   # 8,22
vita = 1500 * 3.33 / 568.116                             # 8,79
b5_ativo = 5.0; b5 = b5_ativo / (0.982 * FRAC["pantotenico/Ca"])    # 5,53
cu = 0.9 / FRAC["Cu-bisglicinato"]                       # 3,00
b2 = 2.4 / 1.001                                         # 2,40
b9 = 0.400 / 0.9067                                      # 0,441
ki = 0.150 / (0.9961 * FRAC["I/KI"])                     # 0,197
bio = 0.040 / 1.000                                      # 0,040 (laudo 91457: 100,0%)
se = 0.060 / FRAC["Na2SeO3"]                             # 0,131
d3 = 40 * 40 / 115000 * 1000                             # 13,91
b12 = 0.008 / 0.8927                                     # 0,00896

INSUMOS = [
    I("Vitamina C", "Ácido ascórbico (CAS 50-81-7)", vitc, 99.5, "99,5% — laudo lote 950467", "laudo",
      250, "mg", "I·Ácido ascórbico/Ácido L-ascórbico; III/IV·Vitamina C", L["VITC"], "mantido",
      "dose do rótulo (13,0% do teto).", "Vitamina C (ácido ascórbico)", f"250 mg / 0,995 = {fmt(vitc,2)} mg"),
    I("Metionina", "L-Metionina (CAS 63-68-3)", met, 99.3, "99,3% — laudo lote 950347", "laudo",
      110, "mg", "I·L-Metionina; III·Metionina 105 (nota ix: metionina + cisteína ≥ 157,5); IV·Metionina 1.530", L["MET"], "mantido",
      "dose do rótulo (7,2% do teto); 110 + 76,4 de cisteína = 186,4 mg ≥ 157,5 (nota ix).", "L-metionina", f"110 mg / 0,993 = {fmt(met,2)} mg", prot_mg=110),
    I("Cisteína", "Cloridrato de L-cisteína, anidro (CAS 52-89-1)", cis_sal, 76.44,
      "76,44% de cisteína tal qual — laudo lote 218167 (100,22% b.s. × (1 − 0,78%) = 99,44%, conforme memorial rev02) × 76,87% (cisteína/cloridrato, estequiométrico)", "memorial",
      cis_ativo, "mg", "I·Cloridrato de L-cisteína; III·Cisteína 42 (nota ix); IV·Cisteína 830", L["CIS"], "mantido (declaração corrigida)",
      "massa pesada mantida (100 mg de sal); o rótulo declara 'L-cisteína 100 mg' tratando o sal como aminoácido livre — passa a declarar 76 mg de cisteína (9,2% do teto), como o memorial rev02 calcula.",
      "L-cisteína (cloridrato de L-cisteína)", f"100,00 mg × 0,99438 × 0,7687 = {fmt(cis_ativo,2)} mg de cisteína", prot_mg=cis_ativo),
    I("Vitamina E", "Acetato de DL-alfa-tocoferol, pó 50% (CAS 7695-91-2)", e_po, 50.7,
      "50,7% de acetato — laudo lote 91320; × 0,67 (1 UI = 1 mg de acetato de rac-α-tocoferil; 1 mg de α-tocoferol = 1,49 UI)", "laudo",
      e_ativo, "mg", "I·Acetato de DL-alfa-tocoferol; III/IV·Vitamina E (como α-tocoferol)", L["E"], "mantido (declaração corrigida)",
      "massa pesada mantida (45 mg de pó). O rótulo declara '45 mg (450% VD)' tratando o pó a 50% como vitamina pura; a entrega real é 15,3 mg de α-tocoferol (1,5% do teto) — correção já apontada no memorial rev02 e nunca aplicada na arte.",
      "Vitamina E (acetato de DL-alfa-tocoferol)", f"45,00 mg × 0,507 × 0,67 = {fmt(e_ativo,2)} mg de α-tocoferol"),
    I("Metilsulfonilmetano", "Metilsulfonilmetano (CAS 67-71-0)", msm, 99.93, "99,93% — laudo lote 950413 (o memorial cita também o lote 222159, 99,19%; conferir qual está em estoque)", "laudo",
      50, "mg", "I·Metilsulfonilmetano (IN 76/2020); III·NE; IV·900 mg", L["MSM"], "mantido",
      "dose do rótulo (5,6% do teto).", "Metilsulfonilmetano (MSM)", f"50 mg / 0,9993 = {fmt(msm,2)} mg"),
    I("Ácido hialurônico", "Hialuronato de sódio (CAS 9067-32-7) — forma do Anexo I: 'Hialuronato de Sódio obtido pela fermentação de Streptococcus zooepidemicus'", ha, 95.7,
      "95,7% — laudo lote HA2026022540X", "laudo",
      50, "mg", "I·Hialuronato de Sódio obtido pela fermentação de Streptococcus zooepidemicus (IN 76/2020); III·3,5 mg; IV·157,7 mg", L["HA"], "mantido — PENDENTE declaração de origem",
      "dose do rótulo (31,7% do teto). O laudo não declara processo de obtenção nem cepa; a Lemon Caps já reprovou outro lote (225412, parecer PAR-LAU-2026-003) pela mesma lacuna. Fica condicionado à declaração do fabricante.",
      "Ácido hialurônico (hialuronato de sódio)", f"50 mg / 0,957 = {fmt(ha,2)} mg", carb_mg=50, na_mg=50 * FRAC["Na/hialuronato"]),
    I("Silício", "Ácido orto-silícico estabilizado com maltodextrina (Siliciumax, Fagron: maltodextrina 95% + gel de ácido silícico 5%)", si_po, 1.43,
      "1,43% de Si — laudo lote 216957 (lido em 15/09 na auditoria, [F5]; especificação 1,5% ± 10%)", "laudo",
      si_ativo, "mg", "I·Ácido orto-silícico estabilizado com maltodextrina (IN 102/2021); III·NE; IV·Silício 15,67 mg", L["SI"], "mantido (declaração corrigida)",
      "o rótulo escreve 'silício orgânico (ácido ortossilícico) 50 mg' — os 50 mg são massa do insumo; o constituinte é o silício: 0,715 mg (4,6% do teto). Passa a declarar o elemento e a nomear a forma estabilizada do Anexo I.",
      "Silício (ácido orto-silícico estabilizado com maltodextrina)", f"50,00 mg × 0,0143 = {fmt(si_ativo,3)} mg de silício", carb_mg=47.5),
    I("Niacina", "Nicotinamida/Niacinamida (CAS 98-92-0)", b3, 99.09, "99,09% tal qual — laudo lote 872226", "laudo",
      31, "mg NE", "I·Nicotinamida/Niacinamida; III/IV·Niacina", L["B3"], "dose ajustada",
      "35 mg era o teto exato (35 mg NE); nova dose 31 mg (88,6% do teto; 207% do VD).", "Vitamina B3 (nicotinamida)", f"31 mg / 0,9909 = {fmt(b3,2)} mg"),
    I("Zinco", "Bisglicinato de zinco (CAS 14281-83-5)", zn, 19.89, "19,89% Zn tal qual — laudo lote 055-ZN/25", "laudo",
      15, "mg", "I·Bisglicinato de zinco; III/IV·Zinco", L["ZN"], "mantido", "dose do rótulo (50,7% do teto).",
      "Zinco (bisglicinato de zinco)", f"15 mg / 0,1989 = {fmt(zn,2)} mg"),
    I("Vitamina B6", "Cloridrato de piridoxina (CAS 58-56-0)", b6_sal, 99.9, "99,9% — laudo lote 91188; × 82,27% (piridoxina/cloridrato)", "laudo",
      b6_ativo, "mg", "I·Cloridrato de piridoxina; III/IV·Vitamina B6", L["B6"], "mantido (declaração corrigida)",
      "massa pesada mantida (10 mg de sal); o rótulo declara '10 mg (769% VD)' tratando o sal como vitamina; entrega real 8,22 mg (8,3% do teto), como o memorial rev02 calcula.",
      "Vitamina B6 (cloridrato de piridoxina)", f"10,00 mg × 0,999 × 0,8227 = {fmt(b6_ativo,2)} mg de piridoxina"),
    I("Vitamina A", "Acetato de retinol, pó (CAS 127-47-9)", vita, None,
      "568.116 UI/g — potência conforme memorial rev02 (laudo lote 215230, digitalização não relida); 1 µg RAE = 3,33 UI", "memorial",
      1500, "µg RAE", "I·Acetato de retinol/Acetato de retinila; III/IV·Vitamina A", L["A"], "mantido",
      "dose do rótulo (57,2% do teto).", "Vitamina A (acetato de retinol)", f"1.500 µg RAE × 3,33 = 4.995 UI; 4.995 / 568,116 UI/mg = {fmt(vita,2)} mg"),
    I("Ácido pantotênico", "D-pantotenato de cálcio (CAS 137-08-6)", b5, 98.2, "98,2% — laudo lote 91186; × 92,01% (ácido pantotênico/sal de cálcio)", "laudo",
      5.0, "mg", "I·D-pantotenato de cálcio; III/IV·Ácido pantotênico", L["B5"], "dose ajustada",
      "5,64 mg era o teto exato; nova dose 5,0 mg (88,7% do teto; 100% do VD).", "Vitamina B5 (D-pantotenato de cálcio)",
      f"5,0 mg / (0,982 × 0,9201) = {fmt(b5,3)} mg"),
    I("Cobre", "Bisglicinato de cobre (CAS 13479-54-4) — insumo a adquirir", cu, 30.02, "30,02% Cu — assumido (estequiométrico); sem laudo", "assumido",
      900, "µg", "I·Bisglicinato de cobre; III/IV·Cobre", L["NENHUM"], "forma trocada",
      "o rótulo diz 'cobre quelado' e a fábrica pesa 'Cobre Quelato 24% – Cobre Aminoácido quelato' (NaturalPRO NPT.0325/404, laudo lido por imagem em 16/09: sem CAS, sem forma) — não identificável entre as 5 formas do Anexo I. O memorial rev01 já usara bisglicinato de cobre 20% e o rev02 regrediu.",
      "Cobre (bisglicinato de cobre)", f"0,9 mg / 0,3002 = {fmt(cu,3)} mg (assumido)"),
    I("Riboflavina", "Riboflavina (CAS 83-88-5)", b2, 100.1, "100,1% — laudo lote 91068", "laudo",
      2.4, "mg", "I·Riboflavina; III/IV·Riboflavina", L["B2"], "dose ajustada",
      "2,74 mg era o teto exato; nova dose 2,4 mg (87,6% do teto; 200% do VD).", "Vitamina B2 (riboflavina)", f"2,4 mg / 1,001 = {fmt(b2,3)} mg"),
    I("Ácido fólico", "Ácido fólico/Ácido N-pteroil-L-glutâmico (CAS 59-30-3)", b9, 90.67, "90,67% tal qual — laudo lote AUTO039613", "laudo",
      666.67, "µg DFE", "I·Ácido fólico; III/IV·Ácido fólico (1 DFE = 0,6 µg de ácido fólico)", L["B9"], "mantido",
      "400 µg de ácido fólico = 666,7 µg DFE (52,0% do teto; 167% do VD) — dose do rótulo.", "Vitamina B9 (ácido fólico)",
      f"400 µg / 0,9067 = {fmt(b9*1000,1)} µg = {fmt(b9,3)} mg de insumo; 400 / 0,6 = 666,7 µg DFE", cadastro_qtd=400, cadastro_unid="mcg"),
    I("Iodo", "Iodeto de potássio (CAS 7681-11-0)", ki, 76.15, "76,15% de I tal qual — laudo lote 210468 (99,77% b.s. × (1 − 0,16%) = 99,61%, conforme memorial) × 76,45% (I/KI, estequiométrico)", "memorial",
      150, "µg", "I·Iodeto de potássio; III/IV·Iodo", L["KI"], "mantido", "dose do rótulo (16,3% do teto).",
      "Iodo (iodeto de potássio)", f"150 µg / (0,9961 × 0,7645) = {fmt(ki*1000,1)} µg = {fmt(ki,3)} mg"),
    I("Biotina", "D-biotina (CAS 58-85-5)", bio, 100.0, "100,0% — laudo lote 91457 (Analitic, val. 19/12/2028; lote 25030042 do memorial rev02 é o nome do arquivo)", "laudo",
      40, "µg", "I·D-biotina; III/IV·Biotina", L["BIO"], "dose ajustada",
      "45 µg era o teto exato; nova dose 40 µg (88,9% do teto; 133% do VD).", "Biotina (D-biotina)", f"40 µg / 1,000 = {fmt(bio*1000,1)} µg = {fmt(bio,3)} mg"),
    I("Selênio", "Selenito de sódio (CAS 10102-18-8) — insumo a adquirir", se, 45.66, "45,66% Se — assumido (estequiométrico); sem laudo", "assumido",
      60, "µg", "I·Selenito de sódio; III/IV·Selênio", L["NENHUM"], "forma trocada",
      "'selênio quelado' (glicinato de selênio, lote 044152) não é forma do Anexo I; o próprio memorial rev02 (Tabela 17) recomenda selenito de sódio. Dose do rótulo (18,8% do teto). EXSELEN PLUS não serve (sem forma declarada, vencido).",
      "Selênio (selenito de sódio)", f"0,06 mg / 0,4566 = {fmt(se,3)} mg (assumido) — microdose: pré-mistura definida pela fábrica",
      na_mg=se * (2 * M["Na"] / mw(Na=2, Se=1, O=3))),
    I("Vitamina D", "Vitamina D3 (colecalciferol), pó 100.000 UI/g (CAS 67-97-0)", d3, None, "115.000 UI/g — laudo lote 91408; 1 µg = 40 UI", "laudo",
      40, "µg", "I·Vitamina D3 (Colecalciferol); III/IV·Vitamina D", L["D3"], "dose ajustada",
      "50 µg era o teto exato; nova dose 40 µg (80,0% do teto; 267% do VD).", "Vitamina D3 (colecalciferol)", f"40 µg × 40 = 1.600 UI; 1.600 / 115 UI/mg = {fmt(d3,2)} mg"),
    I("Vitamina B12", "Metilcobalamina (CAS 13422-55-4)", b12, 89.27, "89,27% tal qual — laudo lote 219376 (98,17% b.a.; umidade 9,07% conforme memorial)", "laudo",
      8, "µg", "I·Metilcobalamina; III/IV·Vitamina B12", L["B12"], "dose ajustada",
      "9,94 µg era o teto exato; nova dose 8 µg (80,5% do teto; 333% do VD). O memorial rev02 traz dois teores para o mesmo lote (98,17% e 99,2%); usado o da Tabela 18, que bate com o laudo lido em texto (98,17% b.a.).",
      "Vitamina B12 (metilcobalamina)", f"8 µg / 0,8927 = {fmt(b12*1000,2)} µg = {fmt(b12,5)} mg"),
]

ANTES = [
    ("Vitamina C (ácido ascórbico)", "250 mg (556% VD)", "CONFORME. Memorial: 251,26 mg a 99,5%."),
    ("Colágeno hidrolisado (Peptan)", "120 mg", "ABAIXO DO MÍNIMO: única entrada do Anexo I é 'Gelatina hidrolisada/Colágeno hidrolisado' em Proteínas, mínimo 8,4 g (1,4% do mínimo). Já removido do cadastro em 14/09; o rótulo ainda imprime."),
    ("L-metionina", "110 mg", "CONFORME. Memorial: 110,78 mg a 99,3% (lote 950347)."),
    ("L-cisteína", "100 mg", "CONFORME pelo número; MAS os 100 mg são massa do cloridrato anidro — entrega 76,44 mg de cisteína (memorial rev02); rótulo declara o sal como aminoácido."),
    ("Vitamina E (DL-α-tocoferol acetato)", "45 mg (450% VD)", "CONFORME; MAS o rótulo declara os 45 mg de pó a 50% como vitamina pura — entrega real 15,29 mg de α-tocoferol (memorial rev02: 'o rótulo anuncia 4,4× o real')."),
    ("Metilsulfonilmetano (MSM)", "50 mg", "CONFORME. Memorial: 50,41 mg a 99,19% (lote 222159) ou 950413 (99,93%)."),
    ("Ácido hialurônico (hialuronato de sódio)", "50 mg", "NÃO VERIFICADO (origem: fermentação por S. zooepidemicus não declarada no laudo HA2026022540X)."),
    ("Silício orgânico (ácido ortossilícico)", "50 mg", "CONFORME (0,715 mg de Si pelo laudo, 4,6% do teto); ressalva: rótulo deveria nomear a forma estabilizada e o elemento."),
    ("Vitamina B3 (nicotinamida)", "35 mg (219% VD)", "CONFORME — igual ao máximo (35 mg NE)."),
    ("Zinco (bisglicinato de zinco)", "15 mg (136% VD)", "CONFORME. Memorial: 75,41 mg a 19,89%."),
    ("Vitamina B6 (cloridrato de piridoxina)", "10 mg (769% VD)", "CONFORME pelo número; MAS 10 mg são massa do sal — entrega 8,22 mg (memorial rev02)."),
    ("Vitamina B5 (D-pantotenato de cálcio)", "5,64 mg (113% VD)", "CONFORME — igual ao máximo; o memorial rev02 já reduziu a massa (entrega 5,08 mg)."),
    ("Vitamina B2 (riboflavina)", "2,74 mg (211% VD)", "CONFORME — igual ao máximo."),
    ("Vitamina A (acetato de retinol)", "1.500 mcg (250% VD)", "CONFORME. Memorial: 8,80 mg a 568.116 UI/g (rev00 pesava 1,5 mg — subdose de 5,86×, corrigida no rev01)."),
    ("Cobre (cobre quelado)", "900 mcg (100% VD)", "NÃO VERIFICADO (forma). Memorial: 'cobre aminoácido quelato 24%' (NaturalPRO) — não identificável no Anexo I; rev01 usara bisglicinato e rev02 regrediu."),
    ("Vitamina B9 (ácido fólico)", "400 mcg (167% VD)", "CONFORME (666,7 µg DFE)."),
    ("Iodo (iodeto de potássio)", "150 mcg (100% VD)", "CONFORME. Memorial: 0,197 mg."),
    ("Selênio (selênio quelado)", "60 mcg (100% VD)", "FORMA NÃO AUTORIZADA (glicinato de selênio, lote 044152). Rev01 usara L-selenometionina; rev02 regrediu."),
    ("Vitamina D3 (colecalciferol)", "50 mcg (333% VD)", "CONFORME — igual ao máximo."),
    ("Biotina (D-biotina)", "45 mcg (150% VD)", "CONFORME — igual ao máximo."),
    ("Vitamina B12 (metilcobalamina)", "9,94 mcg (414% VD)", "CONFORME — igual ao máximo; memorial rev02 traz dois teores para o lote 219376."),
]

soma_ins = sum(i["massa"] for i in INSUMOS)
sio2 = 1000 - soma_ins

P = dict(
    slug="biotina-em-capsula", nome="Biotina em Cápsula", nome_rotulo="BioPrincess (arte BioPrincess.pdf); dossiê técnico 'Biotina em Cápsula'; memorial 'BIO PRINCESS rev02'",
    formato="cápsula gelatinosa dura, tamanho 0 (memorial rev02; o rev01 dizia 00)", porcao_mg=1000.0, porcao_desc="1 g (2 cápsulas)",
    porcoes=30, grupo="adulto", publico="adultos, coluna \"> 19 anos\" dos Anexos III e IV",
    porcao_obs=" (500 mg de pó por cápsula; cápsula vazia de 98,45 mg fora da porção)",
    insumos=INSUMOS, antes=ANTES,
    excipientes=[dict(nome="Dióxido de silício (antiumectante)", ins="551", massa=sio2, sql_slug="dioxido-de-silicio", nome_cadastro="Dióxido de silício (INS 551)",
                      obs="q.s.p. 1.000 mg — quantum satis (IN 211/2023, 14.2). A maltodextrina da lista de ingredientes do rótulo é o carreador do Siliciumax (47,5 mg dos 50 mg), não um excipiente à parte."),
                 dict(nome="Cápsula: gelatina, água purificada, corante dióxido de titânio e lauril sulfato de sódio", ins="171", massa=None,
                      obs="invólucro de 98,45 mg (Qualicaps/Genix, lote 2505380SA); o lauril sulfato de sódio consta do memorial rev02, item 13, 'a confirmar com o fabricante'; a arte vigente está truncada nesse trecho")],
    removidos=["**Colágeno hidrolisado (Peptan) 120 mg — retirado.** Única entrada do Anexo I é 'Gelatina hidrolisada/Colágeno hidrolisado' na categoria Proteínas, mínimo 8,4 g/dia (Anexo III); 120 mg são 1,4% do mínimo e 8,4 g não cabem em cápsula (princípio 6). O cadastro já o havia removido em 14/09; a arte ainda imprime. Se o dono quiser mantê-lo, só em pó/sachê a 8,4 g por porção (alternativa, seção 8).",
              "**Glicinato de selênio 21,47 mg** → selenito de sódio; **cobre aminoácido quelato 3,82 mg** → bisglicinato de cobre (formas não autorizadas — ver tabela)."],
    removidos_json=[{"constituinte": "Proteínas (colágeno hidrolisado)", "quantidade_mg": 120, "motivo": "abaixo do mínimo de 8,4 g (Anexo III); inviável em cápsula"}],
    mudancas=[
        "Colágeno hidrolisado 120 mg: retirado — motivo: mínimo de 8,4 g de proteínas (Anexo III), impossível em 1 g.",
        "Selênio: 'selênio quelado' (glicinato) → selenito de sódio, 60 µg — motivo: forma não listada no Anexo I. Insumo a adquirir.",
        "Cobre: 'cobre quelado' (aminoácido quelato NaturalPRO) → bisglicinato de cobre, 900 µg — motivo: forma não identificada entre as 5 do Anexo I. Insumo a adquirir.",
        "Ácido hialurônico: mantido a 50 mg, condicionado à declaração do fabricante de que é obtido por fermentação de Streptococcus zooepidemicus (nome exato do Anexo I).",
        "Silício: passa a ser declarado pelo elemento (0,715 mg) com a forma do Anexo I 'ácido orto-silícico estabilizado com maltodextrina' — motivo: o limite (15,67 mg) é do silício, não da massa do Siliciumax.",
        "Seis doses no teto exato reduzidas para ≤ 90%: niacina 35 → 31 mg NE; ácido pantotênico 5,64 → 5,0 mg; riboflavina 2,74 → 2,4 mg; vitamina D3 50 → 40 µg; biotina 45 → 40 µg; vitamina B12 9,94 → 8 µg — motivo: teto exato é impressão digital de cadastro fictício e não tem folga de fabricação.",
        "Três declarações do rótulo corrigidas sem mudar a pesagem: vitamina E 45 → 15 mg de α-tocoferol; vitamina B6 10 → 8,2 mg; L-cisteína 100 → 76 mg — motivo: o rótulo declarava massa do pó/sal como ativo (memorial rev02 e planilha PROPOSTA de 14/09 já apontavam).",
        "Vitamina C, metionina, MSM, zinco, vitamina A, ácido fólico e iodo: mantidos.",
    ],
    ingredients_list="Ácido ascórbico (vitamina C), antiumectante dióxido de silício (INS 551), L-metionina, cloridrato de L-cisteína, bisglicinato de zinco, hialuronato de sódio, ácido orto-silícico estabilizado com maltodextrina (silício), metilsulfonilmetano (MSM), acetato de DL-alfa-tocoferol (vitamina E), nicotinamida (vitamina B3), colecalciferol (vitamina D3), cloridrato de piridoxina (vitamina B6), acetato de retinol (vitamina A), D-pantotenato de cálcio (vitamina B5), bisglicinato de cobre, riboflavina (vitamina B2), ácido fólico, iodeto de potássio, selenito de sódio, D-biotina, metilcobalamina (vitamina B12) e cápsula: gelatina, água purificada e corante dióxido de titânio (INS 171).",
    alergenicos_obs="Nenhum insumo proposto deriva dos alergênicos da RDC 26/2015 (com a saída do colágeno hidrolisado, que é de origem animal mas não alergênico listado, e sem hialuronato de origem animal — a forma do Anexo I é fermentativa). Sem declaração de glúten até laudo do produto acabado.",
    warnings="\n".join(RDC243 + ["Público indicado: adultos (19 anos ou mais). Ingerir 2 cápsulas ao dia.", ADV_GENERICA, CONSERVACAO]),
    advertencias_base=[
        "Três frases do art. 14, I, c/d/e da RDC 243/2018 (texto literal); grupo e frequência — art. 14, I, a/b; conservação — art. 14, II.",
        f"\"{ADV_GENERICA}\" — IN 28/2018, Anexo VI, exigida por três linhas: \"Aminoácidos\" (metionina, cisteína), \"Ácido hialurônico / … / Metilsulfonilmetano / … / Silício\" (IN 76/2020) e \"Ácido orto-silícico estabilizado com maltodextrina\" (IN 102/2021). Texto idêntico nas três.",
    ],
    advertencias_faltam="nada falta em texto (o campo `warnings` já traz as frases). O rótulo impresso traz a frase de abertura 'Biohair reúne nutrientes…' — nome de outro produto — e a lista de ingredientes truncada pela caixa da tabela: refazer a arte.",
    pendencias=[
        "**Colágeno hidrolisado — decisão do dono:** retirado nesta proposta. Se quiser mantê-lo, só como produto em pó/sachê com 8,4 g por porção (não cabe em cápsula).",
        "**Comprar selenito de sódio e bisglicinato de cobre** com laudo (o cobre NaturalPRO só serviria se o fabricante declarasse, por escrito, que é bisglicinato de cobre CAS 13479-54-4).",
        "**Hialuronato de sódio:** obter do fabricante a declaração de obtenção por fermentação de Streptococcus zooepidemicus para o lote HA2026022540X (o laudo não diz; outro lote, 225412, já foi reprovado pela mesma falta em 28/08/2026). Sem isso, retirar.",
        "**Vitamina A:** confirmar com o fornecedor a potência de 568.116 UI/g do lote 215230 (13,6% acima do nominal; laudo é digitalização).",
        "**Vitamina B12:** o memorial rev02 traz dois teores para o lote 219376 (98,17% e 99,2% b.a.); o laudo lido em texto confirma 98,17% b.a. — usar 89,27% tal qual e conferir a umidade (9,07%) no corpo do laudo.",
        "**MSM:** conferir qual lote está em estoque (950413 a 99,93% ou 222159 a 99,19%); a massa muda 0,4 mg.",
        "**Rótulo:** retirar colágeno hidrolisado; corrigir vitamina E (15 mg), B6 (8,2 mg), L-cisteína (76 mg); trocar 'selênio quelado' por 'selenito de sódio' e 'cobre quelado' por 'bisglicinato de cobre'; declarar silício pelo elemento (0,72 mg) com a forma estabilizada; atualizar B3, B5, B2, D3, biotina e B12; corrigir o texto de abertura ('Biohair'); completar a lista de ingredientes truncada; definir se a cápsula tem lauril sulfato de sódio.",
        "\"Não contém glúten\": só com laudo do produto acabado.",
    ],
    alternativas=[
        "**Colágeno hidrolisado em pó (sachê):** 8,4 g/dia de Peptan (lote AUTO040177, proteína 91,51%, val. 23/04/2030 → 9,18 g de insumo para 8,4 g de proteína) como produto separado — única forma de manter o colágeno dentro da norma.",
        "**L-selenometionina** em vez de selenito de sódio (forma também autorizada): exige compra com laudo que declare a forma; o EXSELEN PLUS da máquina não declara.",
        "**Cianocobalamina** em vez de metilcobalamina: há laudos válidos em texto (Galena 2608027404, 99,20%, val. 30/05/2031; Analitic 91515, 98,9%, val. 21/05/2031) — troca possível se a fábrica preferir alinhar a outros produtos.",
    ],
    veredito="CONFORME CONDICIONADO A (laudos de selenito de sódio e bisglicinato de cobre; declaração de origem fermentativa do hialuronato de sódio; confirmação da potência da vitamina A)",
    veredito_texto="Com a composição da seção 3 (20 constituintes), todas as formas são do Anexo I, nenhuma dose crava o teto (a mais alta é a biotina, 88,9%), o colágeno hidrolisado deixou de puxar a fórmula para baixo do mínimo de proteínas, e a porção fecha em 1.000 mg com 18,9% de excipiente. O CONFORME pleno depende de dois insumos a comprar com laudo (selenito, bisglicinato de cobre), da declaração de origem do hialuronato e da confirmação da potência da vitamina A.",
    fontes=[
        "/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/IN28-2018-ANEXO-I-LITERAL.md",
        "/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/IN28-2018-ANEXO-III-LITERAL.md",
        "/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/IN28-2018-ANEXOS-IV-V-VI-LITERAL.md",
        "/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/AUDITORIA-ROTULO-VS-ANVISA-2026-09-15.md (seção 4.6 e fonte [F5])",
        "/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/composicoes_rotulo.json (chave bioprincess)",
        "/private/tmp/claude-501/-Users-diegofrancisco-Downloads-erp-espa-o/c5ed6b00-4553-4992-b469-c649af084651/scratchpad/fase1/memoriais-formulacoes.json (chave biotina-em-capsula — MEMORIAL-CALCULO-BIO-PRINCESS-rev02.docx)",
        "/private/tmp/claude-501/-Users-diegofrancisco-Downloads-erp-espa-o/c5ed6b00-4553-4992-b469-c649af084651/scratchpad/fase1/laudos.json (índices 29, 50, 83, 86, 188, 189, 190, 191, 193, 197, 201, 203, 204, 205, 210, 213, 215, 176)",
        "/Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/04_MULTIVITAMINICO/ARQUIVOS-PDF/13_laudo_cobre-quelato-24_lote-NPT0325-404.pdf (lido por imagem em 16/09/2026)",
        "/Users/diegofrancisco/Documents/LAUDOS/SELENIOMETIONINA.pdf (texto extraído em 16/09/2026)",
        "/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/PADRAO-ANVISA-TABELA-NUTRICIONAL-2026-09-16.md e scratchpad/padrao-anvisa/vd.json",
        "cadastro vivo: formulas?slug=eq.biotina-em-capsula e formula_compositions (20 linhas ativas, lidas em 16/09/2026)",
    ],
    prosa=dict(
        identificacao_extra="O slug `biotina-em-capsula` corresponde, pelo dossiê técnico de 14/09/2026 e pela planilha PROPOSTA, à fórmula multiativo 'cabelo, pele e unhas' do memorial BIO PRINCESS rev02 (21 constituintes) — não é biotina isolada. Há outro slug, `bioprincess`, fora deste grupo. A arte vigente (BioPrincess.pdf) ainda traz os valores anteriores às correções do rev02 (vitamina E 45 mg, B6 10 mg, cisteína 100 mg, B5 5,64 mg).",
        antes_intro="Fonte da tabela: composição impressa no rótulo (`composicoes_rotulo.json`, chave `bioprincess`, 21 itens), com o veredito da auditoria de 15/09/2026 (seção 4.6) e a observação do memorial rev02.",
        antes_extra="Soma impressa 846,49 mg; o memorial rev02 fecha em 999,995 mg com 39,01 mg de dióxido de silício. Seis constituintes cravados no teto (B3, B5, B2, D3, biotina, B12), um abaixo do mínimo (colágeno), duas formas não autorizadas/não identificadas (selênio, cobre), uma origem não declarada (hialuronato) e três declarações que tratam massa de sal/pó como ativo (vitamina E, B6, cisteína).",
        depois_intro="Grupo \"> 19 anos\". Doses do rótulo mantidas onde já estão na faixa com folga; as seis do teto reduzidas para ≤ 90%; três declarações corrigidas pelo teor real do insumo pesado. Massas do memorial rev02 mantidas quando a dose não muda.",
        soma_comentario="Cabe, com 18,9% de excipiente (a saída do colágeno liberou 120 mg; o selenito e o bisglicinato de cobre são muito menores que os quelatos que substituem).",
        tabela_intro="Coluna \"> 19 anos\" do Anexo VIII da IN 75/2020. Ácido hialurônico, MSM e silício sem VDR (células vazias). Metionina e cisteína aparecem como proteínas (soma dos aminoácidos livres) e como linhas próprias, sem VDR.",
        tabela_energia_obs="Proteínas: metionina 110 mg + cisteína 76,4 mg = 186,4 mg (aminoácidos livres contados pelo fator das proteínas — assunção registrada; o rótulo vigente já declarava 0,3 g). Carboidratos: maltodextrina do Siliciumax (47,5 mg) e hialuronato de sódio (polissacarídeo, 50 mg) — 97,5 mg. Total 1,1 kcal, abaixo de 4 kcal (não significativo). Sódio: hialuronato de sódio (5,73% de Na) e selenito: 3,0 mg, abaixo de 5 mg.",
    ),
)
