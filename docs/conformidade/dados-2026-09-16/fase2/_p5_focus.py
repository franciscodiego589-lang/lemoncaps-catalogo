# -*- coding: utf-8 -*-
from _gerador_base import *
from _laudos_ref import L

# --- massas calculadas -------------------------------------------------------------
col_ativo = 130.0; col = col_ativo / 0.4061            # 320,12 mg de bitartarato (40,61% de colina, laudo 91442)
tir = 290 / 0.999                                      # 290,29
tea = 115.0                                            # assumido 100% (a adquirir)
carn = 95 / 0.9595                                     # 99,01 (99,30% b.a. × (1 − 3,37%))
mgo = 70 / FRAC["MgO"]                                 # 116,08
ino = 25 / 0.9986                                      # 25,04
d3 = 5 * 40 / 115000 * 1000                            # 1,74
b6_ativo = 1.3; b6 = b6_ativo / (0.999 * FRAC["piridoxina/HCl"])   # 1,58
b12 = 0.0024 / 0.8927                                  # 0,00269

INSUMOS = [
    I("Colina", "Bitartarato de colina/Hidrogênio tartarato de colina (CAS 87-67-2)", col, 40.61,
      "40,61% de colina — laudo lote 91442 (teor do sal 99,60%; colina 40,61%)", "laudo",
      col_ativo, "mg", "I·Bitartarato de colina/Hidrogênio tartarato de colina; III·Colina 82,5 mg; IV·3.235,15 mg", L["COL"], "dose ajustada",
      "470 mg de colina exigem 1.157,35 mg de bitartarato — mais que a porção inteira (memorial rev02: 1.818,30 mg de insumos, 181,8% da porção). Em 2 cápsulas cabem 130 mg de colina (158% do mínimo; 4,0% do teto; 24% do VD). Alternativas com 3 ou 4 cápsulas na seção 8.",
      "Colina (bitartarato de colina)", f"130 mg / 0,4061 = {fmt(col,2)} mg de bitartarato de colina", carb_mg=0),
    I("Tirosina", "L-Tirosina (CAS 60-18-4)", tir, 99.9, "99,9% — laudo lote 91382 (L-tirosina vegetal)", "laudo",
      290, "mg", "I·L-Tirosina; III·Tirosina 262,5 (nota viii: fenilalanina + tirosina ≥ 262,5 mg); IV·2.750 mg", L["TIR"], "dose ajustada",
      "220 mg estavam abaixo do mínimo de 262,5 mg (nota viii; não há fenilalanina na fórmula). Nova dose 290 mg = 110% do mínimo, 10,5% do teto. (A fórmula em pó solúvel da própria fábrica já usa 262,76 mg.)",
      "L-tirosina", f"290 mg / 0,999 = {fmt(tir,2)} mg", prot_mg=290),
    I("Teanina", "L-teanina de folhas de Camellia sinensis — insumo a adquirir (rota B)", tea, 100.0,
      "100% — assumido; o laudo do lote em uso (AUTO039250, Lepuge) não serve: 'SÍNTESE QUÍMICA'", "assumido",
      115, "mg", "I·L-teanina de folhas de Camellia sinensis (IN 318/2024); III/IV·Teanina", L["TEA"], "forma trocada (origem) — PENDENTE laudo",
      "dose do rótulo (46% do teto) mantida; a origem tem de ser a de folhas de Camellia sinensis (única do Anexo I). Rota A (retirar) na seção 8 — para um produto de 'foco', a teanina é parte do conceito.",
      "L-teanina de folhas de Camellia sinensis", "115 mg / 1,00 = 115,00 mg (assumido; recalcular pelo laudo do insumo novo)", prot_mg=115),
    I("L-Carnitina", "Levocarnitina/L-carnitina (CAS 541-15-1)", carn, 95.95,
      "95,95% tal qual — laudo lote 216523 (99,30% b.a. × (1 − 3,37% de umidade))", "laudo",
      95, "mg", "I·Levocarnitina/L-carnitina; III·NE; IV·2.000 mg", L["CARN"], "mantido", "dose do rótulo (4,8% do teto).",
      "L-carnitina", f"95 mg / 0,9595 = {fmt(carn,2)} mg", prot_mg=0),
    I("Magnésio", "Óxido de magnésio (MgO, CAS 1309-48-4) — insumo a adquirir", mgo, 60.30, "60,30% Mg — assumido (estequiométrico); sem laudo", "assumido",
      70, "mg", "I·Óxido de magnésio; III/IV·Magnésio", L["NENHUM"], "forma trocada + dose ajustada",
      "60 mg estavam abaixo do mínimo de 63 mg; 70 mg = 111% do mínimo (20% do teto). O bisglicinato (laudo 90844 vencido) pesaria 231,6 mg para 70 mg e roubaria 115 mg da colina; o óxido pesa 116,08 mg. Mesmo insumo novo do Multivitamínico e do Nuviart.",
      "Magnésio (óxido de magnésio)", f"70 mg / 0,6030 = {fmt(mgo,2)} mg (assumido)"),
    I("Inositol", "Inositol (Mio-inositol/Meso-inositol) (CAS 87-89-8)", ino, 99.86, "99,86% — laudo lote 950479 (conforme memorial; digitalização)", "memorial",
      25, "mg", "I·Inositol (Mio-inositol/Meso-inositol) (IN 76/2020); III·NE; IV·2 g", L["INO"], "mantido", "dose do rótulo (1,3% do teto).",
      "Inositol (mio-inositol)", f"25 mg / 0,9986 = {fmt(ino,2)} mg", carb_mg=25),
    I("Vitamina D", "Vitamina D3 (colecalciferol), pó 100.000 UI/g (CAS 67-97-0)", d3, None, "115.000 UI/g — laudo lote 91408; 1 µg = 40 UI", "laudo",
      5, "µg", "I·Vitamina D3 (Colecalciferol); III/IV·Vitamina D", L["D3"], "mantido", "dose do rótulo (10,0% do teto; 33% do VD).",
      "Vitamina D3 (colecalciferol)", f"5 µg × 40 = 200 UI; 200 / 115 UI/mg = {fmt(d3,2)} mg"),
    I("Vitamina B6", "Cloridrato de piridoxina (CAS 58-56-0)", b6, 99.9, "99,9% — laudo lote 91188; × 82,27%", "laudo",
      1.3, "mg", "I·Cloridrato de piridoxina; III/IV·Vitamina B6", L["B6"], "mantido", "dose do rótulo (1,3% do teto).",
      "Vitamina B6 (cloridrato de piridoxina)", f"1,3 mg / (0,999 × 0,8227) = {fmt(b6,3)} mg"),
    I("Vitamina B12", "Metilcobalamina (CAS 13422-55-4)", b12, 89.27, "89,27% tal qual — laudo lote 219376 (98,17% b.a.; umidade 9,07%)", "laudo",
      2.4, "µg", "I·Metilcobalamina; III/IV·Vitamina B12", L["B12"], "mantido (nome corrigido)",
      "dose do rótulo (24,1% do teto; 100% do VD). O rótulo imprime 'cianocobalamina', mas o lote adotado no memorial é metilcobalamina; o §6.1 do memorial usou 94,54% (teor de outro lote) — massa recalculada com 89,27%, como a fórmula solúvel da fábrica já faz (0,0027 mg).",
      "Vitamina B12 (metilcobalamina)", f"2,4 µg / 0,8927 = {fmt(b12*1000,2)} µg = {fmt(b12,5)} mg"),
]

ANTES = [
    ("Colina (bitartarato de colina)", "470 mg", "CONFORME (82,5–3.235). Memorial: 1.157,35 mg de bitartarato a 40,61% — sozinho ultrapassa a porção; fórmula em 1.818,30 mg (181,8%)."),
    ("L-tirosina", "220 mg", "ABAIXO DO MÍNIMO (262,5 mg, nota viii; 83,8% do mínimo). Memorial: 220,22 mg a 99,9% (lote 91382); versão solúvel já usa 262,76 mg."),
    ("L-teanina", "115 mg", "NÃO VERIFICADO (origem). Memorial: lote AUTO039250, laudo lido em 16/09: 'SÍNTESE QUÍMICA'."),
    ("L-carnitina", "95 mg", "CONFORME. Memorial: 99,01 mg a 95,95% (lote 216523)."),
    ("Magnésio (bisglicinato de magnésio)", "60 mg (14% VD)", "ABAIXO DO MÍNIMO (63 mg; 95,2%). Memorial: 198,54 mg de sal a 30,22%; laudo 90844 VENCIDO."),
    ("Inositol (mio-inositol)", "25 mg", "CONFORME. Memorial: 25,04 mg (lote 950479)."),
    ("Vitamina B6 (cloridrato de piridoxina)", "1,3 mg (100% VD)", "CONFORME. Memorial: 1,58 mg."),
    ("Vitamina D3 (colecalciferol)", "5 mcg (33% VD)", "CONFORME. Memorial: 1,74 mg de pó a 115.000 UI/g."),
    ("Vitamina B12 (cianocobalamina)", "2,4 mcg (100% VD)", "CONFORME; MAS o insumo do memorial é metilcobalamina (lote 219376) e o §6.1 usa teor de outro lote (94,54%) — inconsistência interna."),
]

soma_ins = sum(i["massa"] for i in INSUMOS)
sio2 = 1000 - soma_ins

P = dict(
    slug="focus-colina", nome="FOCUS COLINA", nome_rotulo="Focus Colina (arte FocusColina.pdf)",
    formato="cápsula gelatinosa dura, tamanho 0 (memorial rev02)", porcao_mg=1000.0, porcao_desc="1 g (2 cápsulas)",
    porcoes=30, grupo="adulto", publico="adultos, coluna \"> 19 anos\" dos Anexos III e IV",
    porcao_obs=" (500 mg de pó por cápsula; cápsula vazia de 98,45 mg fora da porção)",
    porcao_proposta="Proposta principal mantém 2 cápsulas; alternativas de 3 e 4 cápsulas na seção 8 (mudança de porção é decisão do dono).",
    insumos=INSUMOS, antes=ANTES,
    excipientes=[dict(nome="Dióxido de silício (antiumectante)", ins="551", massa=sio2, sql_slug="dioxido-de-silicio", nome_cadastro="Dióxido de silício (INS 551)",
                      obs="q.s.p. 1.000 mg — quantum satis (IN 211/2023, 14.2). O rótulo vigente declara também 'agente de massa celulose microcristalina', sem massa possível na fórmula atual (181,8%); com esta reformulação o agente de massa não é necessário."),
                 dict(nome="Cápsula: gelatina, água purificada e corante dióxido de titânio", ins="171", massa=None,
                      obs="invólucro de 98,45 mg (Qualicaps/Genix, lote 2505380SA); o memorial atribui lauril sulfato de sódio à cápsula e o rótulo omite — confirmar")],
    removidos=["**L-teanina sintética (lote AUTO039250)** — substituída pela de folhas de Camellia sinensis (rota B); **bisglicinato de magnésio** (laudo vencido, abaixo do mínimo) → óxido de magnésio; **celulose microcristalina** (agente de massa do rótulo) — desnecessária, sai."],
    removidos_json=[],
    mudancas=[
        "Colina: 470 → 130 mg (bitartarato 1.157,35 → 320,12 mg) — motivo: a fórmula do memorial soma 1.818,30 mg para uma porção de 1.000 mg; só a colina em bitartarato já ultrapassa a porção. 130 mg é o máximo que cabe em 2 cápsulas com os demais ativos e 3% de excipiente; continua acima do mínimo de 82,5 mg (Anexo III).",
        "L-tirosina: 220 → 290 mg — motivo: mínimo de 262,5 mg (Anexo III, nota viii), com folga de 10%.",
        "Magnésio: bisglicinato 198,54 mg (60 mg de Mg, laudo vencido) → óxido de magnésio 116,08 mg (70 mg de Mg) — motivo: mínimo de 63 mg com folga; o bisglicinato não cabe. Insumo a adquirir.",
        "L-teanina: origem sintética → \"L-teanina de folhas de Camellia sinensis\", 115 mg — motivo: Anexo I (IN 318/2024). Insumo a adquirir (rota B).",
        "Vitamina B12: nome corrigido para metilcobalamina (insumo pesado) e massa recalculada com o teor do lote 219376 (89,27%) — motivo: o §6.1 do memorial usou 94,54%, de outro lote.",
        "L-carnitina, inositol, B6 e D3: mantidos.",
        "Celulose microcristalina (agente de massa do rótulo): retirada — sem função com a fórmula em 96,9% da porção.",
    ],
    ingredients_list="Bitartarato de colina, L-tirosina, óxido de magnésio, L-teanina de folhas de Camellia sinensis, L-carnitina, antiumectante dióxido de silício (INS 551), mio-inositol, colecalciferol (vitamina D3), cloridrato de piridoxina (vitamina B6), metilcobalamina (vitamina B12) e cápsula: gelatina, água purificada e corante dióxido de titânio (INS 171).",
    alergenicos_obs="Nenhum insumo deriva dos alergênicos da RDC 26/2015 (a L-tirosina em uso é declarada 'vegetal' no laudo 91382; a L-tirosina alternativa da Lepuge, AUTO039445, é de 'extração animal' — se for usada, verificar a fonte). Sem declaração de glúten até laudo do produto acabado.",
    warnings="\n".join(RDC243 + ["Público indicado: adultos (19 anos ou mais). Ingerir 2 cápsulas ao dia.", ADV_GENERICA, CONSERVACAO]),
    advertencias_base=[
        "Três frases do art. 14, I, c/d/e da RDC 243/2018 (texto literal); grupo e frequência — art. 14, I, a/b; conservação — art. 14, II.",
        f"\"{ADV_GENERICA}\" — IN 28/2018, Anexo VI, exigida pelas linhas \"Aminoácidos\" (tirosina, teanina), \"Carnitina\" e \"Inositol\" (IN 102/2021). Texto idêntico.",
    ],
    advertencias_faltam="nada falta em texto; o campo `warnings` do banco traz a frase genérica e as três do art. 14, mais uma frase não obrigatória ('O consumo deste produto deve ser acompanhado da ingestão de hábitos alimentares saudáveis') que pode ficar.",
    pendencias=[
        "**Porção — decisão do dono:** com 2 cápsulas, a colina cai de 470 para 130 mg (o nome do produto é 'Focus Colina'). Alternativas: 3 cápsulas (colina ≈ 290 mg) ou 4 cápsulas (colina 470 mg, como o rótulo) — ver alternativas. A fábrica já desenhou uma versão em pó solúvel (5 g e 10 g por dose) com tirosina e magnésio nos mínimos exatos — outra saída.",
        "**L-teanina — decisão do dono:** rota B (proposta: comprar a de folhas de Camellia sinensis, especificação Blue California, com laudo de origem) ou rota A (retirar; libera 115 mg para a colina, que subiria para ~180 mg).",
        "**Comprar óxido de magnésio** com laudo (recalcular 116,08 mg pelo teor).",
        "**Vitamina B12:** confirmar no corpo do laudo 219376 a umidade (9,07%) que o memorial usa; o rótulo deve passar de 'cianocobalamina' para 'metilcobalamina'.",
        "**Rótulo:** atualizar colina (130 mg), tirosina (290 mg), magnésio (70 mg, óxido); nomear 'L-teanina de folhas de Camellia sinensis'; retirar 'celulose microcristalina'; declarar colina, tirosina, teanina, carnitina e inositol na tabela nutricional (o rótulo vigente só lista Mg, B6, B12 e D); confirmar lauril sulfato de sódio na cápsula.",
    ],
    alternativas=[
        "**3 cápsulas por porção (1,5 g):** mesmos ativos com colina 290 mg (714,1 mg de bitartarato); soma ≈ 1.363 mg + 137 mg de excipiente. Mudança de porção é decisão do dono.",
        "**4 cápsulas por porção (2 g):** colina 470 mg como no rótulo (1.157,35 mg de bitartarato); soma ≈ 1.806 mg + 194 mg de excipiente — a única forma de manter os 470 mg em cápsula.",
        "**Magnésio via bisglicinato de magnésio** (231,6 mg a 30,22%, laudo novo) em vez do óxido: cabe só se a colina cair para ~90 mg em 2 cápsulas.",
        "**Rota A da L-teanina (retirar):** colina sobe para ~180 mg em 2 cápsulas (446 mg de bitartarato); veredito condicionado só ao óxido de magnésio.",
    ],
    veredito="CONFORME CONDICIONADO A (laudo de origem Camellia sinensis da L-teanina nova; laudo de óxido de magnésio) — com a decisão do dono sobre a dose de colina (130 mg em 2 cápsulas)",
    veredito_texto="Com a composição da seção 3, tirosina e magnésio saem de baixo do mínimo (290 mg e 70 mg, 110% e 111% dos mínimos), nenhuma dose crava o teto (a mais alta é a teanina, 46%), e a porção — que no memorial estava em 181,8% — fecha em 1.000 mg com 3,1% de excipiente, ao custo de reduzir a colina para 130 mg. Duas condições de laudo restam (teanina de origem vegetal, óxido de magnésio). A dose de colina é decisão do dono, com as alternativas de 3 e 4 cápsulas registradas.",
    fontes=[
        "/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/IN28-2018-ANEXO-I-LITERAL.md",
        "/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/IN28-2018-ANEXO-III-LITERAL.md",
        "/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/IN28-2018-ANEXOS-IV-V-VI-LITERAL.md",
        "/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/AUDITORIA-ROTULO-VS-ANVISA-2026-09-15.md (seção 4.9)",
        "/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/composicoes_rotulo.json (chave focus_colina)",
        "/private/tmp/claude-501/-Users-diegofrancisco-Downloads-erp-espa-o/c5ed6b00-4553-4992-b469-c649af084651/scratchpad/fase1/memoriais-formulacoes.json (chave focus-colina — MEMORIAL-CALCULO-FOCUS-COLINA-rev02.docx)",
        "/private/tmp/claude-501/-Users-diegofrancisco-Downloads-erp-espa-o/c5ed6b00-4553-4992-b469-c649af084651/scratchpad/fase1/laudos.json (índices 6, 17, 30, 37, 49, 190, 197, 203)",
        "/Users/diegofrancisco/Desktop/LAUDOS/VITAMINA D3 COLECALCIFEROL.pdf (compilação Lepuge; bloco L-TEANINA lote AUTO039250: 'SÍNTESE QUÍMICA')",
        "/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/PADRAO-ANVISA-TABELA-NUTRICIONAL-2026-09-16.md e scratchpad/padrao-anvisa/vd.json",
        "cadastro vivo: formulas?slug=eq.focus-colina e formula_compositions (9 linhas ativas, lidas em 16/09/2026 — cadastro-teto: tirosina 262,5, Mg 63, D3 50, B12 9,94)",
    ],
    prosa=dict(
        identificacao_extra="O memorial rev02 admite que a fórmula da cápsula soma 1.818,30 mg para uma porção de 1.000 mg (181,8%): o bitartarato de colina necessário para 470 mg de colina (1.157,35 mg) sozinho ultrapassa as duas cápsulas. Não há como manter 470 mg de colina em 2 cápsulas; a proposta principal reduz a colina, e as alternativas mudam a porção.",
        antes_intro="Fonte da tabela: composição impressa no rótulo (`composicoes_rotulo.json`, chave `focus_colina`, 9 itens), com o veredito da auditoria de 15/09/2026 (seção 4.9) e a observação do memorial rev02.",
        antes_extra="Soma impressa 986,31 mg (98,6%), mas com o magnésio como sal e a colina como bitartarato a fórmula real é de 1.818,30 mg. Dois constituintes abaixo do mínimo (tirosina, magnésio), uma origem não autorizada (teanina) e um nome de insumo errado (B12).",
        depois_intro="Grupo \"> 19 anos\". Tirosina e magnésio levados a 110% do mínimo; colina reduzida ao que cabe; teanina com origem trocada (rota B); demais doses do rótulo mantidas.",
        soma_comentario="Cabe, com 3,1% de excipiente — o limite prático de 2 cápsulas com estes ativos.",
        tabela_intro="Coluna \"> 19 anos\" do Anexo VIII da IN 75/2020. Colina tem VDR (550 mg); tirosina, teanina, carnitina e inositol não têm (células vazias).",
        tabela_energia_obs="Proteínas: aminoácidos livres (tirosina 290 + teanina 115 = 405 mg; a L-carnitina não é aminoácido proteico e não foi contada) — 1,6 kcal. Carboidratos: inositol (25 mg, poliol contado como carboidrato — assunção) — 0,1 kcal. Total 1,7 kcal, abaixo de 4 kcal.",
    ),
)
