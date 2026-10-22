# -*- coding: utf-8 -*-
from _gerador_base import *
from _laudos_ref import L

# --- massas calculadas -------------------------------------------------------------
msm = 250 / 0.9993                                    # 250,18 (lote 950413)
glu_sal = 200.0; glu_massa = glu_sal / 1.0130         # 197,43 mg de insumo (101,30% t.q.)
glu_ativo = glu_sal * FRAC["glucosamina/sulfKCl"]     # 118,4 mg de glucosamina base
vitc = 140 / 0.995                                    # 140,70
mgo = 70 / FRAC["MgO"]                                # 116,08
e_po = 60.0; e_ativo = e_po * 0.507 * 0.67            # 20,39
zn = 10 / 0.1989                                      # 50,28
fe = 8 / 0.201                                        # 39,80 (laudo NaturalPRO 20,1% — forma pendente)
col2 = 40.0                                           # nominal
d3 = 40 * 40 / 115000 * 1000                          # 13,91
b6_ativo = 1.3; b6 = b6_ativo / (0.999 * FRAC["piridoxina/HCl"])   # 1,58
se = 0.100 / FRAC["Na2SeO3"]                          # 0,219
b12 = 0.008 / 0.8927                                  # 0,00896

INSUMOS = [
    I("Metilsulfonilmetano", "Metilsulfonilmetano (CAS 67-71-0)", msm, 99.93, "99,93% — laudo lote 950413 (o memorial pesa o lote 222159, 99,19% — conferir estoque)", "laudo",
      250, "mg", "I·Metilsulfonilmetano (IN 76/2020); III·NE; IV·900 mg", L["MSM"], "mantido (dose do rótulo)",
      "o rótulo imprime 250 mg; o memorial rev02 pesa 352,86 mg (350 mg) e o cadastro traz 480,5 mg — três números para o mesmo produto. Fixa-se o do rótulo (27,8% do teto), que também libera massa para o magnésio.",
      "Metilsulfonilmetano (MSM)", f"250 mg / 0,9993 = {fmt(msm,2)} mg"),
    I("Glucosamina", "Sulfato de glucosamina com cloreto de potássio (CAS 1296149-08-0; fórmula (C6H14NO5)2SO4·2KCl)", glu_massa, 101.30,
      "101,30% tal qual — laudo lote 25G03-B055-212517 (101,71% b.s., HPLC × (1 − 0,40%)), lido por imagem em 16/09; ativo = 59,18% de glucosamina no sal (estequiométrico)", "laudo",
      glu_ativo, "mg", "I·Sulfato de glucosamina com cloreto de potássio (IN 418/2025); III·Glucosamina NE; IV·750 mg", L["GLU"], "mantido (declaração corrigida)",
      "200 mg de sal (rótulo) = 118,4 mg de glucosamina (15,8% do teto). O rótulo dizia só 'sulfato de glucosamina'; passa a nomear a forma completa do Anexo I e a declarar a glucosamina. Alergênico: fonte de crustáceos (memorial rev02, Tabela 16/31) — declarar; se o fabricante TSM comprovar origem fermentativa, a declaração cai.",
      "Glucosamina (sulfato de glucosamina com cloreto de potássio)", f"200 mg de sal / 1,0130 = {fmt(glu_massa,2)} mg de insumo; 200 × 0,5918 = {fmt(glu_ativo,1)} mg de glucosamina"),
    I("Vitamina C", "Ácido ascórbico (CAS 50-81-7)", vitc, 99.5, "99,5% — laudo lote 950467", "laudo",
      140, "mg", "I·Ácido ascórbico/Ácido L-ascórbico; III/IV·Vitamina C", L["VITC"], "mantido", "dose do rótulo (7,3% do teto).",
      "Vitamina C (ácido ascórbico)", f"140 mg / 0,995 = {fmt(vitc,2)} mg"),
    I("Magnésio", "Óxido de magnésio (MgO, CAS 1309-48-4) — insumo a adquirir", mgo, 60.30,
      "60,30% Mg — assumido (estequiométrico); sem laudo", "assumido",
      70, "mg", "I·Óxido de magnésio; III/IV·Magnésio", L["NENHUM"], "forma trocada + dose ajustada",
      "100 mg de bisglicinato (laudo vencido) entregam 30,22 mg de Mg — 48% do mínimo de 63 mg. Para atingir o mínimo com folga (70 mg = 111% do mínimo; 20% do teto) o bisglicinato exigiria 231,6 mg, que não cabem; o óxido entrega 70 mg em 116,08 mg. Mesmo insumo novo proposto para Multivitamínico e Focus Colina.",
      "Magnésio (óxido de magnésio)", f"70 mg / 0,6030 = {fmt(mgo,2)} mg (assumido)"),
    I("Vitamina E", "Acetato de DL-alfa-tocoferol, pó 50% (CAS 7695-91-2)", e_po, 50.7,
      "50,7% de acetato — laudo lote 91320; × 0,67", "laudo",
      e_ativo, "mg", "I·Acetato de DL-alfa-tocoferol; III/IV·Vitamina E (como α-tocoferol)", L["E"], "mantido (nome corrigido)",
      "massa do memorial rev02 (60 mg de pó → 20,39 mg de α-tocoferol, 2,0% do teto). O rótulo nomeia 'DL-alfa-tocoferol'; o insumo real é o acetato — corrigir o nome.",
      "Vitamina E (acetato de DL-alfa-tocoferol)", f"60,00 mg × 0,507 × 0,67 = {fmt(e_ativo,2)} mg de α-tocoferol"),
    I("Zinco", "Bisglicinato de zinco (CAS 14281-83-5)", zn, 19.89, "19,89% Zn tal qual — laudo lote 055-ZN/25", "laudo",
      10, "mg", "I·Bisglicinato de zinco; III/IV·Zinco", L["ZN"], "mantido (declaração corrigida)",
      "10 mg de zinco elemento (33,8% do teto), como a tabela nutricional do rótulo; a linha de composição dizia 'bisglicinato de zinco 10 mg' (contradição sal × elemento). Memorial rev02 pesa 50,28 mg de sal — confirma o elemento.",
      "Zinco (bisglicinato de zinco)", f"10 mg / 0,1989 = {fmt(zn,2)} mg"),
    I("Colágeno tipo II não desnaturado", "Colágeno de frango com colágeno tipo II não desnaturado — PENDENTE ficha do fabricante (laudo Lepuge AUTO040251: 'COLAGENO T II', fermentação biológica, proteína 67,60%, sem doseamento)", col2, None,
      "nominal 1:1 — o laudo não traz doseamento de colágeno tipo II nem declara 'não desnaturado' nem 'frango'", "memorial",
      40, "mg", "I·Colágeno de frango com colágeno tipo II não desnaturado (IN 76/2020); III·1,2 mg; IV·NE", L["COL2"], "mantido — PENDENTE identidade",
      "40 mg (33× o mínimo). O Anexo I autoriza duas coisas distintas: 'Colágeno Tipo II' em Proteínas (mín. 8,4 g) e 'colágeno de frango com colágeno tipo II não desnaturado' (mín. 1,2 mg). O produto só é conforme no segundo enquadramento, e o laudo AUTO040251 (CAS 9007-34-5, 'fermentação biológica', sem fabricante) não prova nem a origem em frango nem a forma não desnaturada. Sem a ficha do fabricante, retirar.",
      "Colágeno tipo II não desnaturado", "40 mg nominais (sem doseamento no laudo)", prot_mg=40 * 0.676),
    I("Ferro", "Bisglicinato ferroso (CAS 20150-34-9) — PENDENTE: o insumo pesado é 'Quelato Ferro Bios 20%' (NaturalPRO NPT.0525/710), sem identidade química declarada", fe, 20.1,
      "20,1% Fe — laudo lote NPT.0525/710 (lido por imagem em 16/09: teor de ferro 20,1%, umidade 1,0%, val. 05/2027) — PROVISÓRIO quanto à forma", "laudo",
      8, "mg", "I·Bisglicinato ferroso; III/IV·Ferro", L["FE"], "mantido — PENDENTE identidade",
      "8 mg de ferro elemento (23,3% do teto), como a tabela nutricional do rótulo (a composição dizia 'bisglicinato de ferro 8 mg', ambíguo). O laudo NaturalPRO chama o produto de 'Quelato Ferro Bios 20%' e cita a Farmacopeia Brasileira 6ª ed., mas não diz que é bisglicinato ferroso nem traz CAS; os únicos laudos de bisglicinato ferroso da máquina estão vencidos (2022 e 2023). Sem declaração do fabricante, comprar bisglicinato ferroso com laudo.",
      "Ferro (bisglicinato ferroso)", f"8 mg / 0,201 = {fmt(fe,2)} mg (PROVISÓRIO: massa válida só se o insumo for bisglicinato ferroso)"),
    I("Vitamina D", "Vitamina D3 (colecalciferol), pó 100.000 UI/g (CAS 67-97-0)", d3, None, "115.000 UI/g — laudo lote 91408; 1 µg = 40 UI", "laudo",
      40, "µg", "I·Vitamina D3 (Colecalciferol); III/IV·Vitamina D", L["D3"], "dose ajustada",
      "50 µg era o teto exato; nova dose 40 µg (80,0%; 267% do VD). O rótulo vigente imprime '50 mg' na tabela nutricional (erro de mil vezes) e %VD 1000% pelo VDR revogado — corrigir.",
      "Vitamina D3 (colecalciferol)", f"40 µg × 40 = 1.600 UI; 1.600 / 115 UI/mg = {fmt(d3,2)} mg"),
    I("Vitamina B6", "Cloridrato de piridoxina (CAS 58-56-0)", b6, 99.9, "99,9% — laudo lote 91188; × 82,27%", "laudo",
      1.3, "mg", "I·Cloridrato de piridoxina; III/IV·Vitamina B6", L["B6"], "mantido", "dose do rótulo (1,3% do teto).",
      "Vitamina B6 (cloridrato de piridoxina)", f"1,3 mg / (0,999 × 0,8227) = {fmt(b6,3)} mg"),
    I("Selênio", "Selenito de sódio (CAS 10102-18-8) — insumo a adquirir", se, 45.66, "45,66% Se — assumido (estequiométrico); sem laudo", "assumido",
      100, "µg", "I·Selenito de sódio; III/IV·Selênio", L["NENHUM"], "forma trocada",
      "'selênio quelado' (glicinato de selênio, lote 044152 — laudo lido por imagem) não é forma do Anexo I. Dose do rótulo (31,3% do teto).",
      "Selênio (selenito de sódio)", f"0,1 mg / 0,4566 = {fmt(se,3)} mg (assumido) — microdose: pré-mistura definida pela fábrica",
      na_mg=se * (2 * M["Na"] / mw(Na=2, Se=1, O=3))),
    I("Vitamina B12", "Metilcobalamina (CAS 13422-55-4)", b12, 89.27, "89,27% tal qual — laudo lote 219376", "laudo",
      8, "µg", "I·Metilcobalamina; III/IV·Vitamina B12", L["B12"], "dose ajustada",
      "9,94 µg era o teto exato; nova dose 8 µg (80,5%; 333% do VD).", "Vitamina B12 (metilcobalamina)", f"8 µg / 0,8927 = {fmt(b12*1000,2)} µg = {fmt(b12,5)} mg"),
]

ANTES = [
    ("Metilsulfonilmetano (MSM)", "250 mg", "CONFORME (27,8% do teto). Memorial rev02 pesa 352,86 mg (350 mg); cadastro: 480,5 mg."),
    ("Sulfato de glucosamina", "200 mg", "NÃO VERIFICADO (forma incompleta no rótulo). Memorial e laudo 212517: 'sulfato de glucosamina com cloreto de potássio' — forma do Anexo I (IN 418/2025); alergênico crustáceo não declarado."),
    ("Ácido ascórbico", "140 mg (140% VD)", "CONFORME. Memorial: 140,70 mg."),
    ("Colágeno hidrolisado", "100 mg", "ABAIXO DO MÍNIMO (8,4 g de proteínas; 1,2% do mínimo)."),
    ("Carbonato de cálcio (sal)", "100 mg", "ABAIXO DO MÍNIMO: 40 mg de Ca no melhor caso (37,92% pelo laudo 950403 = 37,9 mg) contra 180 mg. Cálcio não declarado na tabela."),
    ("Bisglicinato de magnésio (sal)", "100 mg", "ABAIXO DO MÍNIMO: 30,22 mg de Mg (memorial) contra 63 mg; laudo 90844 vencido."),
    ("Colágeno tipo II não desnaturado", "40 mg", "CONFORME (≥ 1,2 mg) se for 'colágeno de frango… não desnaturado'; o laudo AUTO040251 não prova a identidade (bifurcação regulatória do próprio memorial) e declara 'pode conter leite, lactose e peixe'."),
    ("DL-alfa-tocoferol", "20 mg (133% VD)", "CONFORME. Memorial: 60 mg de pó de acetato a 50,7% × 0,67 = 20,39 mg — nome do insumo errado no rótulo."),
    ("Bisglicinato de zinco 10 mg (composição) × Zinco 10 mg (tabela)", "10 mg", "CONFORME nas duas leituras; contradição sal × elemento. Memorial: 50,28 mg de sal = 10 mg de Zn."),
    ("Bisglicinato de ferro 8 mg (composição) × Ferro 8 mg (tabela)", "8 mg", "NÃO VERIFICADO (sal × elemento). Memorial: 39,80 mg de 'Quelato Ferro Bios 20%' = 8 mg de Fe; laudo sem identidade química."),
    ("Cloridrato de piridoxina", "1,3 mg (100% VD)", "CONFORME. Memorial: 1,58 mg."),
    ("Selênio quelado", "100 mcg (167% VD)", "FORMA NÃO AUTORIZADA (glicinato de selênio, lote 044152)."),
    ("Colecalciferol", "50 mcg (1000% VD na tabela, impressa como '50 mg')", "CONFORME — igual ao máximo; erro de unidade (mg × mcg) e %VD pelo VDR revogado na tabela do rótulo."),
    ("Metilcobalamina", "9,94 mcg (414% VD)", "CONFORME — igual ao máximo."),
]

soma_ins = sum(i["massa"] for i in INSUMOS)
sio2 = 1000 - soma_ins

P = dict(
    slug="dores-musculares", nome="DORES MUSCULARES", nome_rotulo="Nuviart (arte Nuviart.pdf)",
    formato="cápsula gelatinosa dura, tamanho 0 (memorial rev02)", porcao_mg=1000.0, porcao_desc="1 g (2 cápsulas)",
    porcoes=30, grupo="adulto", publico="adultos, coluna \"> 19 anos\" dos Anexos III e IV",
    porcao_obs=" (500 mg de pó por cápsula; cápsula vazia de 98,45 mg fora da porção)",
    insumos=INSUMOS, antes=ANTES,
    excipientes=[dict(nome="Dióxido de silício (antiumectante)", ins="551", massa=sio2, sql_slug="dioxido-de-silicio", nome_cadastro="Dióxido de silício (INS 551)",
                      obs="q.s.p. 1.000 mg — quantum satis (IN 211/2023, 14.2). O memorial rev02 tinha 0,00 mg de espaço para excipiente (fórmula em 123,6% da porção)."),
                 dict(nome="Cápsula: gelatina, água purificada e corante dióxido de titânio", ins="171", massa=None,
                      obs="invólucro de 98,45 mg (Qualicaps/Genix, lote 2505380SA); não conta na porção")],
    removidos=["**Colágeno hidrolisado (Peptan) 100 mg — retirado.** Única entrada do Anexo I é 'Gelatina hidrolisada/Colágeno hidrolisado' em Proteínas, mínimo 8,4 g (1,2% do mínimo); inviável em cápsula (princípio 6).",
              "**Carbonato de cálcio 100 mg — retirado.** Entrega 37,9 mg de Ca (laudo 950403: 37,92%), 21% do mínimo de 180 mg; para atingir o mínimo com folga (200 mg de Ca) seriam necessários 527 mg de carbonato — não cabem ao lado dos demais ativos. Retirado como insumo secundário (princípio 5); alternativa na seção 8.",
              "**Glicinato de selênio 35,79 mg** → selenito de sódio; **bisglicinato de magnésio 100 mg** (laudo vencido, abaixo do mínimo) → óxido de magnésio 70 mg de Mg."],
    removidos_json=[{"constituinte": "Proteínas (colágeno hidrolisado)", "quantidade_mg": 100, "motivo": "abaixo do mínimo de 8,4 g"},
                    {"constituinte": "Cálcio (carbonato de cálcio)", "quantidade_mg": 100, "motivo": "37,9 mg de Ca contra mínimo de 180 mg; 527 mg de carbonato não cabem na porção"}],
    mudancas=[
        "Colágeno hidrolisado 100 mg: retirado — mínimo de 8,4 g (Anexo III, Proteínas).",
        "Carbonato de cálcio 100 mg: retirado — 37,9 mg de Ca contra 180 mg de mínimo; a massa para o mínimo (≥ 475 mg de carbonato) não cabe em 1 g.",
        "Magnésio: bisglicinato 100 mg (30,22 mg de Mg, laudo vencido) → óxido de magnésio 116,08 mg (70 mg de Mg) — motivo: mínimo de 63 mg (Anexo III) com folga de 11%; o bisglicinato para 70 mg pesaria 231,6 mg e não caberia. Insumo a adquirir.",
        "Selênio: 'selênio quelado' (glicinato) → selenito de sódio, 100 µg — forma do Anexo I. Insumo a adquirir.",
        "Glucosamina: nome completo do Anexo I ('sulfato de glucosamina com cloreto de potássio') e declaração do ativo (118 mg de glucosamina); alergênico crustáceo declarado.",
        "Colágeno tipo II: mantido a 40 mg, condicionado à ficha do fabricante (origem frango, forma não desnaturada) — sem ela, retirar; alergênicos do laudo ('pode conter leite, lactose e peixe') declarados.",
        "Ferro: 8 mg de ferro elemento (declaração corrigida); insumo condicionado à declaração de identidade (bisglicinato ferroso) do fabricante NaturalPRO ou à compra de bisglicinato ferroso com laudo.",
        "Zinco: declarado como elemento (10 mg) — a composição dizia 'bisglicinato de zinco 10 mg'.",
        "MSM: fixado no valor do rótulo (250 mg) — o memorial pesa 350 e o cadastro diz 480,5.",
        "Vitamina D3 50 → 40 µg e vitamina B12 9,94 → 8 µg — teto exato sem folga; corrigir '50 mg'/'1000%' da tabela do rótulo.",
        "Vitamina E: nome do insumo corrigido para acetato de DL-alfa-tocoferol (20 mg de α-tocoferol).",
        "Vitamina C e B6: mantidas.",
    ],
    ingredients_list="Metilsulfonilmetano (MSM), antiumectante dióxido de silício (INS 551), sulfato de glucosamina com cloreto de potássio, ácido ascórbico (vitamina C), óxido de magnésio, acetato de DL-alfa-tocoferol (vitamina E), bisglicinato de zinco, colágeno de frango com colágeno tipo II não desnaturado, bisglicinato ferroso, colecalciferol (vitamina D3), cloridrato de piridoxina (vitamina B6), selenito de sódio, metilcobalamina (vitamina B12) e cápsula: gelatina, água purificada e corante dióxido de titânio (INS 171). ALÉRGICOS: CONTÉM CRUSTÁCEOS (glucosamina). PODE CONTER LEITE E PEIXE (colágeno tipo II, conforme laudo do fornecedor). CONTÉM LACTOSE (a confirmar — ver alergênicos).",
    alergenicos_obs="Alergênicos (RDC 26/2015): a glucosamina é de crustáceos segundo o memorial rev02 (o laudo SM não declara a origem; o dossiê IDNLABS de outro lote declara 'origem animal') — declarar \"CONTÉM CRUSTÁCEOS\" até prova de origem fermentativa. O laudo do colágeno tipo II (AUTO040251) diz literalmente \"ALERGICOS, PODE CONTER LEITE, LACTOSE E PEIXE\" — declarar \"PODE CONTER LEITE E PEIXE\"; a declaração de lactose (RDC 135/2017) depende do teor e não foi conferida nesta etapa — PENDENTE.",
    warnings="\n".join(RDC243 + ["Público indicado: adultos (19 anos ou mais). Ingerir 2 cápsulas ao dia.", ADV_GLUCOSAMINA, CONSERVACAO]),
    advertencias_base=[
        "Três frases do art. 14, I, c/d/e da RDC 243/2018 (texto literal); grupo e frequência — art. 14, I, a/b; conservação — art. 14, II.",
        f"\"{ADV_GLUCOSAMINA}\" — IN 28/2018, Anexo VI, linha \"Glucosamina\" (IN 304/2024). A primeira oração é a mesma exigida pelas linhas \"… Colágeno tipo II não desnaturado / … / Metilsulfonilmetano …\" (IN 76/2020); a segunda oração (\"Pessoas com enfermidades…\") é exclusiva da glucosamina.",
    ],
    advertencias_faltam="a segunda oração da advertência da glucosamina (\"Pessoas com enfermidades e/ou sob o uso de medicamentos, consulte seu médico.\") não está no campo `warnings` nem no rótulo; os alergênicos (crustáceos; leite/lactose/peixe) não estão declarados em lugar nenhum — o memorial rev02 classifica isso como a não conformidade mais grave do produto.",
    pendencias=[
        "**Colágeno tipo II — ficha do fabricante (via Lepuge):** origem (frango, esterno), forma não desnaturada, nome do fabricante e doseamento. Sem isso o constituinte não pode ser afirmado como 'colágeno de frango com colágeno tipo II não desnaturado' e deve sair. O laudo vence em 06/11/2026.",
        "**Ferro — identidade química:** obter da NaturalPRO a declaração de que 'Quelato Ferro Bios 20%' é bisglicinato ferroso (CAS 20150-34-9); senão comprar bisglicinato ferroso com laudo (os da máquina venceram em 2022/2023).",
        "**Comprar óxido de magnésio e selenito de sódio** com laudo; recalcular massas pelo teor.",
        "**Cálcio — decisão do dono:** retirado nesta proposta. Alternativa: manter cálcio só se a porção subir para 3 cápsulas (ver alternativas).",
        "**Glucosamina — origem:** pedir ao fabricante (TSM, via SM Empreendimentos) a declaração de origem (crustáceo ou fermentação); enquanto não vier, declarar 'contém crustáceos'.",
        "**Lactose:** conferir com o RT a obrigação de declaração (RDC 135/2017) diante do 'pode conter lactose' do laudo do colágeno tipo II.",
        "**MSM:** conferir lote em estoque (950413 ou 222159) — massa muda 1,9 mg.",
        "**Rótulo:** corrigir 'colecalciferol 50 mg / 1000%' na tabela (correto: 40 µg / 267%); declarar magnésio (70 mg) e retirar cálcio e colágeno hidrolisado; nomear 'acetato de DL-alfa-tocoferol'; declarar glucosamina (118 mg) e a forma completa; declarar zinco e ferro como elementos; alergênicos; advertência completa da glucosamina.",
    ],
    alternativas=[
        "**3 cápsulas por porção (1,5 g):** permitiria manter cálcio a 200 mg (527,4 mg de carbonato de cálcio a 37,92%, laudo válido 950403) com o óxido de magnésio — soma ≈ 1.438 mg + 62 mg de excipiente (4,2%). Com bisglicinato de magnésio no lugar do óxido (231,6 mg) a soma iria a ≈ 1.553 mg e não caberia nem em 3 cápsulas. Mudança de porção é decisão do dono.",
        "**Magnésio via bisglicinato em 2 cápsulas:** só cabe se o MSM cair para ~150 mg; não proposto porque muda o ativo principal.",
        "**L-selenometionina** em vez de selenito (forma também autorizada) — exige compra com laudo que declare a forma.",
    ],
    veredito="CONFORME CONDICIONADO A (ficha do fabricante do colágeno tipo II; identidade do ferro; laudos de óxido de magnésio e selenito de sódio; declaração de origem da glucosamina)",
    veredito_texto="Com a composição da seção 3 (12 constituintes), nenhum fica abaixo do mínimo (o magnésio passou de 48% para 111% do mínimo; cálcio e colágeno hidrolisado, que nunca chegariam ao mínimo em cápsula, saíram), nenhum crava o teto (o mais alto é a vitamina B12, 80,5%), o selênio ganhou forma autorizada e a porção fecha em 1.000 mg com " + fmt(sio2/10,1) + "% de excipiente. Três identidades químicas dependem do fornecedor (colágeno tipo II, ferro, glucosamina-origem) e dois insumos precisam ser comprados com laudo (óxido de magnésio, selenito). Rotulagem: alergênicos e advertência da glucosamina são obrigatórios e hoje faltam.",
    fontes=[
        "/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/IN28-2018-ANEXO-I-LITERAL.md",
        "/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/IN28-2018-ANEXO-III-LITERAL.md",
        "/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/IN28-2018-ANEXOS-IV-V-VI-LITERAL.md",
        "/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/AUDITORIA-ROTULO-VS-ANVISA-2026-09-15.md (seção 4.14)",
        "/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/composicoes_rotulo.json (chave nuviart)",
        "/private/tmp/claude-501/-Users-diegofrancisco-Downloads-erp-espa-o/c5ed6b00-4553-4992-b469-c649af084651/scratchpad/fase1/memoriais-formulacoes.json (chave dores-musculares — MEMORIAL-CALCULO-NUVIART-rev02.docx)",
        "/private/tmp/claude-501/-Users-diegofrancisco-Downloads-erp-espa-o/c5ed6b00-4553-4992-b469-c649af084651/scratchpad/fase1/laudos.json (índices 8, 11, 36, 52, 134, 154, 189, 190, 197, 201, 203, 204, 210, 213)",
        "/Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/08_NUVIART/ARQUIVOS-PDF/09_laudo_quelato-ferro-bios-20_lote-NPT0525-710.pdf (lido por imagem em 16/09/2026: 'Quelato Ferro Bios 20%', teor de ferro 20,1%, val. 05/2027)",
        "/Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/08_NUVIART/ARQUIVOS-PDF/02_laudo_glucosamina-sulf-potassio_lote-212517.pdf (lido por imagem em 16/09/2026: SM Empreendimentos, CAS 1296149-08-0, teor 101,71% b.s., val. 16/04/2028)",
        "/Users/diegofrancisco/Desktop/LAUDOS/VITAMINA D3 COLECALCIFEROL.pdf (compilação Lepuge; bloco COLAGENO T II lote AUTO040251: fermentação biológica, proteína 67,60%, 'PODE CONTER LEITE, LACTOSE E PEIXE')",
        "/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/PADRAO-ANVISA-TABELA-NUTRICIONAL-2026-09-16.md e scratchpad/padrao-anvisa/vd.json",
        "cadastro vivo: formulas?slug=eq.dores-musculares e formula_compositions (12 linhas ativas, lidas em 16/09/2026)",
    ],
    prosa=dict(
        identificacao_extra="O rótulo vigente (Nuviart.pdf) se contradiz em sal × elemento (zinco e ferro), omite o cálcio da tabela, imprime a vitamina D como '50 mg' e não declara alergênicos. O memorial rev02 soma 1.235,84 mg para uma porção de 1.000 mg (123,6%) e pesa 350 mg de MSM onde o rótulo diz 250. Esta reformulação parte do rótulo para as doses declaradas e do memorial para massas e laudos.",
        antes_intro="Fonte da tabela: composição impressa no rótulo (`composicoes_rotulo.json`, chave `nuviart`, 14 itens), com o veredito da auditoria de 15/09/2026 (seção 4.14) e a observação do memorial rev02.",
        antes_extra="Soma impressa 969,46 mg; memorial rev02 1.235,84 mg (não cabe). Três constituintes abaixo do mínimo (colágeno hidrolisado, cálcio, magnésio), uma forma não autorizada (selênio), duas identidades não provadas (colágeno tipo II, ferro) e dois no teto exato (D3, B12).",
        depois_intro="Grupo \"> 19 anos\". Doses do rótulo mantidas onde já estão na faixa; magnésio levado ao mínimo com folga; cálcio e colágeno hidrolisado retirados por não chegarem ao mínimo em cápsula; D3 e B12 tiradas do teto.",
        soma_comentario="Cabe, com " + fmt(sio2/10,1) + "% de excipiente — o memorial rev02 estava em 123,6% da porção.",
        tabela_intro="Coluna \"> 19 anos\" do Anexo VIII da IN 75/2020. MSM, glucosamina e colágeno tipo II sem VDR (células vazias).",
        tabela_energia_obs="Proteínas: colágeno tipo II 40 mg × 67,60% de proteína (laudo) = 27,0 mg — 0,1 kcal; glucosamina não contada como carboidrato (aminoaçúcar; assunção registrada). Sódio: só do selenito (0,06 mg).",
    ),
)
