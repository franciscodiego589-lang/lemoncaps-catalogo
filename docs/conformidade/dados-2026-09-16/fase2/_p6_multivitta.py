# -*- coding: utf-8 -*-
from _gerador_base import *
from _laudos_ref import L

# --- massas calculadas (limites: coluna mais restritiva entre Gestantes e Lactantes) --------
ca = 215 / 0.3792                                     # 567,0 mg de carbonato de cálcio (37,92% Ca, laudo 950403)
mg_ativo = 66.0; mg_sal = mg_ativo / 0.3022           # 218,40 mg de bisglicinato (laudo vencido 90844)
vitc = 20 / 0.995                                     # 20,10
fe = 8.1 / 0.2026                                     # 39,98 (último teor conhecido: SM 337-FE/21, 20,26%, VENCIDO)
b3 = 8 / 0.9909                                       # 8,07
b5_ativo = 4.5; b5 = b5_ativo / (0.982 * FRAC["pantotenico/Ca"])   # 4,98
e_ativo = 5.0; e_po = e_ativo / (0.507 * 0.67)        # 14,72
cu = 0.9 / FRAC["Cu-bisglicinato"]                    # 3,00
b9 = 0.500 / 0.9067                                   # 0,551 -> 500 µg = 833,3 µg DFE
d3 = 40 * 40 / 115000 * 1000                          # 13,91
b12 = 0.008 / 0.8927                                  # 0,00896

INSUMOS = [
    I("Cálcio", "Carbonato de cálcio, grau DC (CAS 471-34-1)", ca, 37.92, "37,92% Ca — laudo lote 950403 (carbonato de cálcio 94,80%)", "laudo",
      215, "mg", "I·Carbonato de cálcio; III·Cálcio gest. 195 / lact. 195; IV·gest. 2.015,51 / lact. 2.082,58", L["CA"], "dose ajustada",
      "300 mg de Ca exigem 791 mg de carbonato (37,92%) — não cabem em 1 g com o resto. 215 mg = 110% do mínimo dos dois grupos (10,7% do teto de gestantes). O cadastro dizia 'cálcio elementar 300 mg'.",
      "Cálcio (carbonato de cálcio)", f"215 mg / 0,3792 = {fmt(ca,2)} mg de carbonato de cálcio"),
    I("Magnésio", "Bisglicinato de magnésio (CAS 14783-68-7)", mg_sal, 30.22, "30,22% Mg tal qual — laudo lote 90844, VENCIDO (21/06/2025) — último teor conhecido", "laudo vencido",
      66, "mg", "I·Bisglicinato de magnésio; III·Magnésio gest. 60 / lact. 54; IV·350 / 350", L["MG30"], "dose ajustada",
      "60 mg cravavam o mínimo de gestantes; 66 mg = 110% desse mínimo (18,9% do teto). Forma do cadastro mantida; exige laudo novo (os dois laudos de bisglicinato 30% da máquina estão vencidos). O óxido de magnésio (109,5 mg para 66 mg) é alternativa se o bisglicinato não tiver laudo.",
      "Magnésio (bisglicinato de magnésio)", f"66 mg / 0,3022 = {fmt(mg_sal,2)} mg de bisglicinato de magnésio"),
    I("Vitamina C", "Ácido ascórbico (CAS 50-81-7)", vitc, 99.5, "99,5% — laudo lote 950467", "laudo",
      20, "mg", "I·Ácido ascórbico/Ácido L-ascórbico; III·Vitamina C gest. 12,75 / lact. 18; IV·1.723,43 / 1.726,73", L["VITC"], "mantido",
      "20 mg = 111% do mínimo de lactantes (18 mg), 1,2% do teto — dose do cadastro.", "Vitamina C (ácido ascórbico)", f"20 mg / 0,995 = {fmt(vitc,2)} mg"),
    I("Ferro", "Bisglicinato ferroso (CAS 20150-34-9) — insumo a adquirir com laudo (todos os laudos da máquina estão vencidos)", fe, 20.26,
      "20,26% Fe — último teor conhecido (laudo SM 22A19-B061-087921, fabricante 337-FE/21, VENCIDO em 18/11/2023); estequiométrico do sal puro seria 27,38% — PROVISÓRIO", "laudo vencido",
      8.1, "mg", "I·Bisglicinato ferroso; III·Ferro gest. 4,05 / lact. 1,5; IV·34,71 / 34,96", L["NENHUM"], "mantido — PENDENTE laudo",
      "8,1 mg = 200% do mínimo de gestantes (23,3% do teto) — dose do cadastro (30% do VD de gestantes, 27 mg). Nenhum laudo vigente de bisglicinato ferroso existe na máquina; o 'Quelato Ferro Bios 20%' (NaturalPRO) do Nuviart não declara identidade química.",
      "Ferro (bisglicinato ferroso)", f"8,1 mg / 0,2026 = {fmt(fe,2)} mg (PROVISÓRIO; recalcular pelo laudo do lote comprado)"),
    I("Niacina", "Nicotinamida/Niacinamida (CAS 98-92-0)", b3, 99.09, "99,09% tal qual — laudo lote 872226", "laudo",
      8, "mg NE", "I·Nicotinamida/Niacinamida; III·Niacina gest. 2,7 / lact. 2,55; IV·30 / 30", L["B3"], "mantido",
      "8 mg NE = 26,7% do teto — dose do cadastro. VDR de niacina para gestantes e lactantes não foi extraído do Anexo VIII (pendência do gabarito) — %VD PENDENTE.",
      "Vitamina B3 (nicotinamida)", f"8 mg / 0,9909 = {fmt(b3,2)} mg", vd_pendente=True),
    I("Ácido pantotênico", "D-pantotenato de cálcio (CAS 137-08-6)", b5, 98.2, "98,2% — laudo lote 91186; × 92,01%", "laudo",
      4.5, "mg", "I·D-pantotenato de cálcio; III·gest. 0,9 / lact. 1,05; IV·gest. 5,83 / lact. 5,49", L["B5"], "dose ajustada",
      "5,0 mg eram 91,1% do teto de lactantes (5,49); nova dose 4,5 mg (82,0% do teto mais restritivo).", "Vitamina B5 (D-pantotenato de cálcio)",
      f"4,5 mg / (0,982 × 0,9201) = {fmt(b5,3)} mg"),
    I("Vitamina E", "Acetato de DL-alfa-tocoferol, pó 50% (CAS 7695-91-2)", e_po, 50.7, "50,7% de acetato — laudo lote 91320; × 0,67", "laudo",
      5.0, "mg", "I·Acetato de DL-alfa-tocoferol; III·Vitamina E gest. 2,25 / lact. 2,85; IV·800 / 800", L["E"], "dose ajustada",
      "o cadastro tinha 5 mg de acetato = 3,35 mg de α-tocoferol, a 0,5 mg do mínimo de lactantes (2,85). Nova dose: 5,0 mg de α-tocoferol (175% do mínimo; 0,6% do teto).",
      "Vitamina E (acetato de DL-alfa-tocoferol)", f"5 mg / (0,507 × 0,67) = {fmt(e_po,2)} mg de pó"),
    I("Cobre", "Bisglicinato de cobre (CAS 13479-54-4) — insumo a adquirir", cu, 30.02, "30,02% Cu — assumido (estequiométrico); sem laudo", "assumido",
      900, "µg", "I·Bisglicinato de cobre; III·Cobre gest. 150 / lact. 195; IV·6.935,01 / 7.036,33", L["NENHUM"], "mantido — PENDENTE laudo",
      "dose do cadastro (13,0% do teto). O cadastro já nomeia bisglicinato de cobre; não há laudo dessa forma na máquina (só 'cobre aminoácido quelato' NaturalPRO, forma não identificada, e gluconato de cobre vencido).",
      "Cobre (bisglicinato de cobre)", f"0,9 mg / 0,3002 = {fmt(cu,3)} mg (assumido)"),
    I("Ácido fólico", "Ácido fólico/Ácido N-pteroil-L-glutâmico (CAS 59-30-3)", b9, 90.67, "90,67% tal qual — laudo lote AUTO039613", "laudo",
      833.33, "µg DFE", "I·Ácido fólico; III·gest. 666,6 / lact. 75 µg DFE; IV·gest. 1.138,3 / lact. 1.162,3 µg DFE (nota iv)", L["B9"], "dose ajustada",
      "800 µg de ácido fólico = 1.333,3 µg DFE, acima dos dois tetos (1.138,3 e 1.162,3). Nova dose 500 µg de ácido fólico = 833,3 µg DFE: 125% do mínimo de gestantes (666,6), 73,2% do teto de gestantes; 139% do VD de gestantes (600) e 167% do VD de lactantes (500).",
      "Ácido fólico", f"500 µg / 0,9067 = {fmt(b9*1000,1)} µg = {fmt(b9,3)} mg de insumo; 500 / 0,6 = 833,3 µg DFE", cadastro_qtd=500, cadastro_unid="mcg"),
    I("Vitamina D", "Vitamina D3 (colecalciferol), pó 100.000 UI/g (CAS 67-97-0)", d3, None, "115.000 UI/g — laudo lote 91408; 1 µg = 40 UI", "laudo",
      40, "µg", "I·Vitamina D3 (Colecalciferol); III·Vitamina D 2,25 / 2,25; IV·50 / 50", L["D3"], "dose ajustada",
      "50 µg era o teto exato; nova dose 40 µg (80,0%; 267% do VD).", "Vitamina D3 (colecalciferol)", f"40 µg × 40 = 1.600 UI; 1.600 / 115 UI/mg = {fmt(d3,2)} mg"),
    I("Vitamina B12", "Metilcobalamina (CAS 13422-55-4)", b12, 89.27, "89,27% tal qual — laudo lote 219376", "laudo",
      8, "µg", "I·Metilcobalamina; III·Vitamina B12 gest. 0,39 / lact. 0,42; IV·gest. 10,46 / lact. 10,07", L["B12"], "dose ajustada",
      "10,46 µg era o teto exato de gestantes e ultrapassava o de lactantes (10,07); nova dose 8 µg (79,4% do teto de lactantes; 308% e 286% dos VDs).",
      "Vitamina B12 (metilcobalamina)", f"8 µg / 0,8927 = {fmt(b12*1000,2)} µg = {fmt(b12,5)} mg"),
]

ANTES = [
    ("Dióxido de silício (INS 551)", "592,14 mg", "aditivo, quantum satis — 59,2% da cápsula, implausível como antiumectante (auditoria)."),
    ("Cálcio elementar (carbonato de cálcio)", "300 mg", "CONFORME (195–2.015); MAS 300 mg de Ca são 791 mg de carbonato (37,92%) — impossível na porção (auditoria: 144,9% a 161,0%)."),
    ("Magnésio (bisglicinato de magnésio)", "60 mg", "CONFORME — igual ao mínimo de gestantes (leitura como elemento); laudo do bisglicinato vencido."),
    ("Vitamina C (ácido ascórbico)", "20 mg", "CONFORME (12,75/18 – 1.723/1.727)."),
    ("Ferro (bisglicinato ferroso)", "8,1 mg", "CONFORME como elemento; nenhum laudo vigente de bisglicinato ferroso na máquina."),
    ("Vitamina B3 (nicotinamida)", "8 mg", "CONFORME (2,7/2,55 – 30)."),
    ("Vitamina B5 (D-pantotenato de cálcio)", "5 mg", "CONFORME, mas 91,1% do teto de lactantes (5,49) — acima da folga de 90%."),
    ("Vitamina E (acetato de DL-alfa-tocoferol)", "5 mg", "CONFORME por 0,5 mg: 5 × 0,67 = 3,35 mg de α-tocoferol contra mínimo de 2,85 (lactantes)."),
    ("Cobre (bisglicinato de cobre)", "900 mcg", "CONFORME; sem laudo da forma."),
    ("Ácido fólico", "800 mcg", "ACIMA DO MÁXIMO nos dois grupos: 1.333,3 µg DFE > 1.138,3 (gest.) e 1.162,3 (lact.)."),
    ("Vitamina D (colecalciferol)", "50 mcg", "CONFORME — igual ao máximo."),
    ("Vitamina B12 (metilcobalamina)", "10,46 mcg", "gestantes: igual ao máximo; LACTANTES: ACIMA DO MÁXIMO (10,07)."),
]

soma_ins = sum(i["massa"] for i in INSUMOS)
sio2 = 1000 - soma_ins

P = dict(
    slug="multi-vitta-gestante-e-lactante-em-capsula", nome="Multi Vitta — Gestante e Lactante em Cápsula", nome_rotulo="Multi Vitta (sem arte de rótulo; sem memorial; sem ficha técnica — a única composição é o cadastro)",
    formato="cápsula (sem memorial: tamanho e capacidade não registrados; assumida a mesma cápsula tamanho 0 de 500 mg de pó dos demais produtos da linha)", porcao_mg=1000.0, porcao_desc="1 g (2 cápsulas)",
    porcoes=30, grupo="gest_lact", publico="gestantes e lactantes — colunas \"Gestantes\" e \"Lactantes\" dos Anexos III e IV, aplicada a mais restritiva das duas a cada constituinte (mínimo = maior dos mínimos; máximo = menor dos máximos)",
    porcao_obs=" (o cadastro diz 'Porção: 1 g (2 cápsulas)', 'Peso líquido: 30 g', '60 cápsulas')",
    target_audience_sql="Gestantes e lactantes.",
    insumos=INSUMOS, antes=ANTES,
    excipientes=[dict(nome="Dióxido de silício (antiumectante)", ins="551", massa=sio2, sql_slug="dioxido-de-silicio", nome_cadastro="Dióxido de silício (INS 551)",
                      obs="q.s.p. 1.000 mg — quantum satis (IN 211/2023, 14.2). O cadastro trazia 592,14 mg (59% da cápsula), valor sem fonte."),
                 dict(nome="Cápsula: gelatina, água purificada e corante dióxido de titânio", ins="171", massa=None,
                      obs="assumida a mesma cápsula dos demais produtos (Qualicaps/Genix, 98,45 mg) — não há memorial deste produto")],
    removidos=["Nenhum constituinte retirado. **Não foram acrescentados** os nutrientes que a lista de ingredientes do cadastro cita sem quantidade (vitamina A, vitamina K2, 'complexo B' além de B3/B5/B12, biotina, cromo, selênio): não há fonte para as doses e inventá-las seria preencher lacuna com valor plausível — ver pendência 1."],
    removidos_json=[],
    mudancas=[
        "Grupo populacional: o cadastro dizia 'Adultos com 19 anos ou mais'; passa a 'Gestantes e lactantes', com limites e %VD das colunas próprias (nome do produto, RDC 243/2018, art. 14, I, a).",
        "Cálcio: 300 → 215 mg (carbonato 791 → 567,0 mg) — motivo: a porção não comporta 791 mg de carbonato; 215 mg = 110% do mínimo (195 mg nos dois grupos).",
        "Magnésio: 60 → 66 mg (218,40 mg de bisglicinato a 30,22%) — motivo: 60 mg cravava o mínimo de gestantes; laudo novo obrigatório.",
        "Ácido fólico: 800 → 500 µg (1.333,3 → 833,3 µg DFE) — motivo: acima dos dois tetos (1.138,3 / 1.162,3 µg DFE) e mínimo de gestantes de 666,6 µg DFE.",
        "Vitamina B12: 10,46 → 8 µg — motivo: acima do teto de lactantes (10,07) e no teto de gestantes.",
        "Vitamina D3: 50 → 40 µg — teto exato.",
        "Ácido pantotênico: 5 → 4,5 mg — 91% do teto de lactantes (5,49).",
        "Vitamina E: 3,35 → 5,0 mg de α-tocoferol (14,72 mg de pó) — margem de 0,5 mg sobre o mínimo de lactantes era insuficiente.",
        "Dióxido de silício: 592,14 mg (sem fonte) → q.s.p.",
        "Vitamina C, ferro, niacina, cobre: mantidos (ferro e cobre condicionados a laudo).",
    ],
    ingredients_list="Carbonato de cálcio, bisglicinato de magnésio, antiumectante dióxido de silício (INS 551), bisglicinato ferroso, ácido ascórbico (vitamina C), acetato de DL-alfa-tocoferol (vitamina E), colecalciferol (vitamina D3), nicotinamida (vitamina B3), D-pantotenato de cálcio (vitamina B5), bisglicinato de cobre, ácido fólico, metilcobalamina (vitamina B12) e cápsula: gelatina, água purificada e corante dióxido de titânio (INS 171).",
    alergenicos_obs="Nenhum insumo deriva dos alergênicos da RDC 26/2015. Sem declaração de glúten até laudo do produto acabado.",
    warnings="\n".join(RDC243 + ["Público indicado: gestantes e lactantes. Ingerir 2 cápsulas ao dia, sob orientação de médico ou nutricionista.", CONSERVACAO]),
    advertencias_base=[
        "Três frases do art. 14, I, c/d/e da RDC 243/2018 (texto literal); grupo populacional (gestantes e lactantes) e frequência — art. 14, I, a/b; conservação — art. 14, II.",
        "Nenhum constituinte desta fórmula consta do Anexo VI da IN 28/2018 — não há frase complementar exigida. A frase 'Este produto não deve ser consumido por gestantes, lactantes e crianças' NÃO pode aparecer (o produto é para gestantes e lactantes). A orientação 'sob orientação de médico ou nutricionista' já constava do cadastro e é mantida como boa prática, não como exigência normativa.",
    ],
    advertencias_faltam="o campo `warnings` do banco já traz as três frases do art. 14; o campo `target_audience` está errado ('Adultos com 19 anos ou mais') e o SQL o corrige para 'Gestantes e lactantes.'; a lista de ingredientes cita nutrientes sem quantidade e sem fonte — corrigida para o que a composição realmente tem.",
    pendencias=[
        "**Composição — decisão do dono:** a lista de ingredientes do cadastro cita vitamina A, K2, complexo B, biotina, cromo e selênio que não têm quantidade em lugar nenhum (nem memorial, nem ficha, nem rótulo existem). Esta proposta só formula o que está cadastrado com quantidade. Se o dono quiser completar o multivitamínico pré-natal, as faixas a respeitar (mais restritiva entre gestantes e lactantes, Anexos III/IV) são: vitamina A 195–2.414,35 µg RAE (só pré-formada; o iodo, importante para o grupo, teria faixa 43,5–717,56 µg); vitamina K 13,5–126,02 µg; tiamina 0,21–1,93 mg; riboflavina 0,24–2,66 mg; B6 0,3–78,59 mg; biotina 5,25–45 µg; cromo 6,75–45 µg; selênio 10,5–309,65 µg; zinco 1,95–23,50 mg; iodo 43,5–717,56 µg. Manganês e boro são 'NA' para os dois grupos — não podem entrar.",
        "**Laudo novo de bisglicinato de magnésio** (ou trocar por óxido de magnésio, 109,5 mg para 66 mg, insumo a adquirir).",
        "**Comprar bisglicinato ferroso e bisglicinato de cobre com laudo** — nenhum laudo vigente dessas formas existe na máquina; a massa do ferro (39,98 mg) usa o último teor conhecido de um laudo vencido.",
        "**Memorial de cálculo e ficha técnica inexistentes** — este produto é vendido sem nenhum documento de fabricação (achado do inventário de 16/09). O RT precisa emitir o memorial a partir desta proposta antes de qualquer produção.",
        "**Cápsula:** confirmar tamanho e capacidade (assumida a cápsula 0 de 500 mg dos outros produtos).",
        "**VDR de niacina para gestantes e lactantes** não foi extraído do Anexo VIII (pendência do gabarito) — a célula de %VD da niacina fica PENDENTE, não vazia por falta de VDR.",
        "**Rótulo (a criar):** designação 'Suplemento alimentar em cápsulas', público 'gestantes e lactantes', tabela com as duas colunas de %VD, sem a frase genérica de gestantes.",
    ],
    alternativas=[
        "**Óxido de magnésio** no lugar do bisglicinato (109,5 mg para 66 mg; a adquirir) — reduz a dependência do laudo vencido e libera 109 mg.",
        "**Cálcio a 300 mg com 3 cápsulas por porção** (791 mg de carbonato) — só com mudança de porção, decisão do dono.",
    ],
    veredito="CONFORME CONDICIONADO A (laudo novo do bisglicinato de magnésio; laudos de bisglicinato ferroso e bisglicinato de cobre; emissão do memorial de cálculo pelo RT) — e à decisão do dono sobre completar ou não os nutrientes citados sem dose",
    veredito_texto="Com a composição da seção 3 (11 constituintes), o ácido fólico e a B12 saem de cima dos tetos, cálcio, magnésio e vitamina E ganham folga sobre os mínimos, nenhuma dose crava teto (a mais alta é o ácido pantotênico, 82,0% do teto de lactantes) e a porção — que no cadastro estava entre 144,9% e 161,0% — fecha em 1.000 mg com " + fmt(sio2/10,1) + "% de excipiente. Três insumos precisam de laudo (magnésio, ferro, cobre) e o produto precisa nascer documentalmente (memorial). Este é o único produto do grupo cuja composição não tem nenhuma fonte de fábrica: tudo aqui parte do cadastro.",
    fontes=[
        "/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/IN28-2018-ANEXO-I-LITERAL.md",
        "/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/IN28-2018-ANEXO-III-LITERAL.md (colunas Gestantes e Lactantes)",
        "/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/IN28-2018-ANEXOS-IV-V-VI-LITERAL.md (colunas Gestantes e Lactantes)",
        "/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/AUDITORIA-ROTULO-VS-ANVISA-2026-09-15.md (seção II.5)",
        "/private/tmp/claude-501/-Users-diegofrancisco-Downloads-erp-espa-o/c5ed6b00-4553-4992-b469-c649af084651/scratchpad/fase1/memoriais-formulacoes.json (chave multi-vitta-gestante-e-lactante-em-capsula — NÃO ENCONTRADO: sem memorial, ficha ou dossiê)",
        "/private/tmp/claude-501/-Users-diegofrancisco-Downloads-erp-espa-o/c5ed6b00-4553-4992-b469-c649af084651/scratchpad/fase1/laudos.json (índices 8, 19, 50, 134, 154, 190, 193, 197, 201, 204)",
        "/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/PADRAO-ANVISA-TABELA-NUTRICIONAL-2026-09-16.md e scratchpad/padrao-anvisa/vd.json (colunas gestantes e lactantes)",
        "cadastro vivo: formulas?slug=eq.multi-vitta-gestante-e-lactante-em-capsula e formula_compositions (12 linhas ativas, lidas em 16/09/2026)",
    ],
    prosa=dict(
        identificacao_extra="Não existe rótulo, memorial de cálculo, ficha técnica nem dossiê deste produto em nenhuma das pastas varridas em 16/09 — a composição de 12 linhas do cadastro (com 592 mg de dióxido de silício) é a única fonte, e ela é impossível na porção (o carbonato de cálcio para 300 mg de Ca pesa sozinho 791 mg). Público real: gestantes e lactantes (nome do produto), embora o cadastro diga 'adultos'.",
        antes_intro="Fonte da tabela: cadastro vivo do catálogo (`formula_compositions`, 12 linhas, lidas em 16/09/2026), com o veredito da auditoria de 15/09/2026 (Parte II, seção II.5), que já usou as colunas Gestantes e Lactantes.",
        antes_extra="Soma como escrita: 1.000,0 mg; soma com os sais que entregam os elementos: 1.449 a 1.610 mg (144,9% a 161,0%). Dois constituintes acima do máximo (ácido fólico nos dois grupos; B12 em lactantes), dois no limite (magnésio no mínimo de gestantes; D3 no teto), um por 0,5 mg (vitamina E) e três sem laudo válido (magnésio, ferro, cobre).",
        depois_intro="Limites: para cada constituinte, o maior dos mínimos e o menor dos máximos entre Gestantes e Lactantes (Anexos III e IV). %VD nas duas colunas do Anexo VIII da IN 75/2020. Só os 11 constituintes que o cadastro quantifica entram.",
        soma_comentario="Cabe, com " + fmt(sio2/10,1) + "% de excipiente — o cálcio precisou cair de 300 para 215 mg para isso.",
        tabela_intro="Duas colunas de %VD (gestantes e lactantes — Anexo VIII da IN 75/2020, RDC 429/2020, art. 12, §4º). Niacina: VDR dos dois grupos não extraído (pendência do gabarito) — célula marcada como PENDENTE no texto, não vazia. Vitamina E em α-tocoferol; ácido fólico em µg DFE.",
        tabela_energia_obs="Nenhum insumo aporta proteína, carboidrato ou gordura (a glicina dos bisglicinatos não foi contada — assunção). Sódio zero.",
    ),
)
