# -*- coding: utf-8 -*-
from _gerador_base import *
from _laudos_ref import L

# --- massas calculadas -------------------------------------------------------------
trp = 500 / 0.999                                     # 500,50 (laudo 950388, 99,9%)
asp = 100.0                                           # assumido 100% (sem laudo)
gln_ativo = 95.0; gln = gln_ativo / (0.9873 * (1 - 0.0026))   # 96,47 (98,73% b.a. × (1 − 0,26%))
mg_ativo = 70.0; mg_sal = mg_ativo / 0.3022           # 231,63 (laudo vencido 90844)
zn = 10 / 0.1989                                      # 50,28
mel = 0.18 / 0.9933                                   # 0,1812 (laudo vencido 950151: 99,5% b.s. × (1 − 0,17%))
bio = 0.040 / 1.000                                   # 0,040 (laudo 91457)

INSUMOS = [
    I("Triptofano", "L-Triptofano (CAS 73-22-3)", trp, 99.9, "99,9% — laudo lote 950388 (val. 03/10/2026 — vence em ~2,5 semanas)", "laudo",
      500, "mg", "I·L-Triptofano; III·Triptofano 42 mg; IV·860 mg", L["TRP"], "dose ajustada",
      "572,38 mg (66,6% do teto) → 500 mg (58,1% do teto): libera 72 mg para o magnésio chegar ao mínimo com folga. Sem laudo no cadastro (dossiê gerado); usado o laudo do lote 950388 do memorial DREAM-GUMMY — pedir laudo novo antes de pesar (validade em 03/10/2026).",
      "L-triptofano", f"500 mg / 0,999 = {fmt(trp,2)} mg", prot_mg=500),
    I("Aspartato", "Ácido L-aspártico (CAS 56-84-8) — insumo sem laudo na máquina", asp, 100.0, "100% — assumido; nenhum laudo de ácido L-aspártico existe nas 308 fontes lidas", "assumido",
      100, "mg", "I·Ácido L-aspártico; III·Aspartato NE; IV·5.320 mg", L["NENHUM"], "dose ajustada — PENDENTE laudo",
      "150 mg (2,8% do teto) → 100 mg (1,9%): libera 50 mg. O cadastro é a única fonte da dose; sem laudo, sem lote. Comprar/obter laudo ou retirar (não há mínimo).",
      "Ácido L-aspártico", "100 mg / 1,00 = 100,00 mg (assumido)", prot_mg=100),
    I("Glutamina", "L-Glutamina (CAS 56-85-9)", gln, 98.47, "98,47% tal qual — laudo lote AUTO039665 (Lepuge; 98,73% b.a., HPLC/USP × (1 − 0,26%)); val. 08/11/2026", "laudo",
      95, "mg", "I·L-Glutamina; III·Glutamina NE; IV·5.000 mg", L["GLN"], "mantido (dose arredondada)",
      "94,77 mg (1,9% do teto) → 95 mg. O cadastro não tem lote; o laudo Lepuge AUTO039665 é o único válido em texto (vence em 7 semanas).",
      "L-glutamina", f"95 mg / (0,9873 × 0,9974) = {fmt(gln,2)} mg", prot_mg=95),
    I("Magnésio", "Bisglicinato de magnésio (CAS 14783-68-7)", mg_sal, 30.22, "30,22% Mg tal qual — laudo lote 90844, VENCIDO — último teor conhecido", "laudo vencido",
      70, "mg", "I·Bisglicinato de magnésio; III/IV·Magnésio", L["MG30"], "dose ajustada — PENDENTE laudo",
      "63 mg era o mínimo exato (e, se os 63 mg do cadastro fossem massa de sal, 19,1 mg de Mg); 70 mg = 111% do mínimo (20% do teto). Massa de sal 231,63 mg — a maior mudança de massa da fórmula. Laudo novo obrigatório; alternativa: óxido de magnésio (116,08 mg).",
      "Magnésio (bisglicinato de magnésio)", f"70 mg / 0,3022 = {fmt(mg_sal,2)} mg de bisglicinato"),
    I("Zinco", "Bisglicinato de zinco (CAS 14281-83-5)", zn, 19.89, "19,89% Zn tal qual — laudo lote 055-ZN/25", "laudo",
      10, "mg", "I·Bisglicinato de zinco; III/IV·Zinco", L["ZN"], "dose ajustada",
      "29,59 mg era o teto exato (e exigiria 148,8 mg de sal); nova dose 10 mg (33,8% do teto; 91% do VD) — dose típica dos outros produtos da linha.",
      "Zinco (bisglicinato de zinco)", f"10 mg / 0,1989 = {fmt(zn,2)} mg"),
    I("Melatonina", "Melatonina (CAS 73-31-4)", mel, 99.33, "99,33% tal qual — laudo lote 950151 (99,5% b.s. × (1 − 0,17%)), VENCIDO em 09/12/2024 — último teor conhecido", "laudo vencido",
      0.18, "mg", "I·Melatonina (IN 102/2021); III·NE; IV·0,21 mg", L["MEL"], "dose ajustada — PENDENTE laudo",
      "0,21 mg era o teto exato; nova dose 0,18 mg (85,7% do teto). Os cinco laudos de melatonina da máquina estão vencidos — laudo do lote em uso é obrigatório (ultrapassar 0,21 mg é infração de segurança).",
      "Melatonina", f"0,18 mg / 0,9933 = {fmt(mel,4)} mg — microdose: pré-mistura definida pela fábrica"),
    I("Biotina", "D-biotina (CAS 58-85-5)", bio, 100.0, "100,0% — laudo lote 91457", "laudo",
      40, "µg", "I·D-biotina; III/IV·Biotina", L["BIO"], "dose ajustada",
      "45 µg era o teto exato; nova dose 40 µg (88,9%; 133% do VD).", "Biotina (D-biotina)", f"40 µg / 1,000 = {fmt(bio*1000,1)} µg = {fmt(bio,3)} mg"),
]

ANTES = [
    ("L-triptofano", "572,38 mg", "CONFORME (42–860). Sem laudo/lote no cadastro; laudo disponível: 950388 (99,9%, vence 03/10/2026)."),
    ("Ácido L-aspártico", "150 mg", "CONFORME (NE–5.320). Nenhum laudo na máquina."),
    ("L-glutamina", "94,77 mg", "CONFORME (NE–5.000). Laudo Lepuge AUTO039665 (98,73% b.a.) válido até 08/11/2026."),
    ("Fosfatidilserina", "70 mg", "NÃO VERIFICADO (Anexo I: 'Fosfatidilserina de lecitina de soja' / 'Lecitina de soja com alto teor de fosfatidilserina' — origem não declarada; nenhum laudo na máquina; massa real do insumo comercial desconhecida)."),
    ("Magnésio (bisglicinato de magnésio)", "63 mg", "leitura A (elemento): CONFORME no mínimo exato, sem margem; leitura B (sal): 19,1 mg, ABAIXO DO MÍNIMO. Laudo do bisglicinato vencido."),
    ("Zinco (bisglicinato de zinco)", "29,59 mg", "CONFORME — igual ao máximo (teto exato); como sal seriam 147,9 mg."),
    ("Dióxido de silício (INS 551)", "20,01 mg", "aditivo, quantum satis."),
    ("Melatonina", "0,21 mg", "CONFORME — igual ao máximo; todos os laudos de melatonina vencidos."),
    ("Biotina (D-biotina)", "45 mcg", "CONFORME — igual ao máximo."),
]

soma_ins = sum(i["massa"] for i in INSUMOS)
sio2 = 1000 - soma_ins

P = dict(
    slug="melatonina-triptofanos-encapsulados", nome="Melatonina + Triptofanos (Encapsulados)", nome_rotulo="Sonus (nome comercial candidato — layout 'sonus' com tabela placeholder; sem arte final, sem memorial)",
    formato="cápsula (sem memorial: tamanho e capacidade não registrados; assumida a cápsula 0 de 500 mg da linha)", porcao_mg=1000.0, porcao_desc="1 g (2 cápsulas)",
    porcoes=30, grupo="adulto", publico="adultos, coluna \"> 19 anos\" dos Anexos III e IV (a melatonina é 'NA' em todos os outros grupos)",
    porcao_obs=" (o cadastro diz 'Porção: 1g (2 Cápsulas)', 60 cápsulas)",
    insumos=INSUMOS, antes=ANTES,
    excipientes=[dict(nome="Dióxido de silício (antiumectante)", ins="551", massa=sio2, sql_slug="dioxido-de-silicio", nome_cadastro="Dióxido de silício (INS 551)",
                      obs="q.s.p. 1.000 mg — quantum satis (IN 211/2023, 14.2). Folga de 2,1%, no limite mínimo de 2%: qualquer aumento de massa (ex.: teor menor do magnésio no laudo novo) exige recompor."),
                 dict(nome="Cápsula: gelatina, água purificada e corante dióxido de titânio", ins="171", massa=None,
                      obs="assumida a cápsula dos demais produtos (Qualicaps/Genix, 98,45 mg) — não há memorial deste produto")],
    removidos=["**Fosfatidilserina 70 mg — retirada.** O Anexo I autoriza 'Fosfatidilserina de lecitina de soja' (CAS 84776-79-4) e 'Lecitina de soja com alto teor de fosfatidilserina'; o cadastro não declara a origem, não há nenhum laudo de fosfatidilserina nas 308 fontes lidas, e os insumos comerciais de fosfatidilserina são padronizados a 20–50% em carreador — a massa real seria 2 a 5 vezes os 70 mg, o que não cabe na porção junto com o magnésio no mínimo. Volta quando houver laudo (registrado como alternativa). Traria ainda a declaração de alergênico soja."],
    removidos_json=[{"constituinte": "Fosfatidilserina", "quantidade_mg": 70, "motivo": "origem (lecitina de soja) não declarada; sem laudo; massa real do insumo comercial desconhecida; não cabe com o magnésio no mínimo"}],
    mudancas=[
        "Magnésio: 63 → 70 mg de Mg (231,63 mg de bisglicinato) — motivo: mínimo exato sem folga (Anexo III: 63 mg); e, na leitura como sal, abaixo do mínimo. Laudo novo obrigatório.",
        "Zinco: 29,59 → 10 mg — motivo: teto exato; e 29,59 mg de Zn exigiriam 148,8 mg de sal.",
        "Melatonina: 0,21 → 0,18 mg — motivo: teto exato (Anexo IV: 0,21 mg); laudo do lote em uso obrigatório (todos vencidos).",
        "Biotina: 45 → 40 µg — teto exato.",
        "L-triptofano: 572,38 → 500 mg — motivo: liberar massa para o magnésio; continua a 58% do teto.",
        "Ácido L-aspártico: 150 → 100 mg — motivo: liberar massa; sem laudo (a adquirir ou retirar).",
        "L-glutamina: 94,77 → 95 mg (arredondamento; laudo Lepuge válido).",
        "Fosfatidilserina: retirada — origem e laudo inexistentes; massa real desconhecida.",
        "Dióxido de silício: 20,01 → q.s.p. (20,9 mg).",
    ],
    ingredients_list="L-triptofano, bisglicinato de magnésio, ácido L-aspártico, L-glutamina, bisglicinato de zinco, antiumectante dióxido de silício (INS 551), D-biotina, melatonina e cápsula: gelatina, água purificada e corante dióxido de titânio (INS 171).",
    alergenicos_obs="Nenhum insumo deriva dos alergênicos da RDC 26/2015 (com a saída da fosfatidilserina de soja). Sem declaração de glúten até laudo do produto acabado.",
    warnings="\n".join(RDC243 + ["Público indicado: adultos (19 anos ou mais). Ingerir 2 cápsulas ao dia, preferencialmente à noite.", ADV_MELATONINA, CONSERVACAO]),
    advertencias_base=[
        "Três frases do art. 14, I, c/d/e da RDC 243/2018 (texto literal); grupo e frequência — art. 14, I, a/b; conservação — art. 14, II.",
        f"\"{ADV_MELATONINA}\" — IN 28/2018, Anexo VI, linha \"Melatonina\" (IN 102/2021), texto literal. A primeira oração cobre também a exigência da linha \"Aminoácidos\" (triptofano, aspartato, glutamina).",
    ],
    advertencias_faltam="tudo: os campos `warnings` e `ingredients_list` do banco estão vazios (auditoria de 15/09, 'Ingredientes e advertências faltantes'). A frase específica da melatonina é obrigatória e não existe em nenhum documento do produto.",
    pendencias=[
        "**Laudo vigente de melatonina** do lote que a fábrica vai pesar — os cinco laudos da máquina venceram (o mais recente em 27/05/2026). Sem ele, o produto não pode ser fabricado: 0,18 mg é 85,7% do teto e qualquer teor acima do calculado aproxima do limite.",
        "**Laudo novo de bisglicinato de magnésio** (90844 vencido) ou troca por óxido de magnésio (116,08 mg, a adquirir).",
        "**L-triptofano:** laudo 950388 vence em 03/10/2026 — pedir laudo do lote que será usado.",
        "**Ácido L-aspártico:** obter laudo (nenhum na máquina) ou retirar — decisão do dono; sem mínimo no Anexo III.",
        "**Fosfatidilserina — decisão do dono:** retirada. Para voltar, precisa de insumo 'Fosfatidilserina de lecitina de soja' com laudo de teor e origem, e de espaço na porção (ver alternativa).",
        "**Memorial de cálculo inexistente:** o único documento é um dossiê gerado a partir do banco; o RT precisa emitir memorial com lotes antes de produzir. Confirmar cápsula (tamanho/capacidade).",
        "**Rótulo (a criar):** designação, tabela nutricional da seção 5, lista de ingredientes, advertência específica da melatonina, 'preferencialmente à noite'.",
        "**Folga de excipiente de 2,1%:** se o laudo novo do magnésio vier com teor abaixo de 30,22%, a massa de sal sobe e a fórmula deixa de fechar — recompor (reduzir triptofano ou trocar por óxido).",
    ],
    alternativas=[
        "**Óxido de magnésio** (116,08 mg para 70 mg de Mg; a adquirir) no lugar do bisglicinato: libera 115 mg, o que permitiria manter o triptofano em 572 mg ou reincluir 50 mg de fosfatidilserina de lecitina de soja quando houver laudo.",
        "**Retirar o ácido L-aspártico** (sem laudo, sem mínimo): libera 100 mg e uma pendência.",
        "**Fórmula simples da OP nº 586** (triptofano 800 mg + melatonina 0,21 mg), já produzida para outro cliente — é outro produto, não a fórmula do catálogo; fica só como referência de que a linha tem variantes.",
    ],
    veredito="CONFORME CONDICIONADO A (laudo vigente de melatonina; laudo novo de bisglicinato de magnésio; laudo de ácido L-aspártico ou sua retirada; laudo de L-triptofano do lote a usar; emissão do memorial de cálculo pelo RT)",
    veredito_texto="Com a composição da seção 3 (7 constituintes), os quatro números cravados em limites (magnésio no mínimo; zinco, melatonina e biotina no máximo) ganham folga (o mais alto é a biotina, 88,9% do teto), a fosfatidilserina sem origem sai, e a porção — que na leitura como elementos ficava em 126,3% — fecha em 1.000 mg com 2,1% de excipiente. O CONFORME pleno depende de quatro laudos (melatonina, magnésio, aspártico, triptofano) e de o RT documentar o produto, que hoje não tem memorial.",
    fontes=[
        "/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/IN28-2018-ANEXO-I-LITERAL.md",
        "/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/IN28-2018-ANEXO-III-LITERAL.md",
        "/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/IN28-2018-ANEXOS-IV-V-VI-LITERAL.md",
        "/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/AUDITORIA-ROTULO-VS-ANVISA-2026-09-15.md (seção II.4)",
        "/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/INGREDIENTES-E-ADVERTENCIAS-FALTANTES-2026-09-15.md (seção 5)",
        "/private/tmp/claude-501/-Users-diegofrancisco-Downloads-erp-espa-o/c5ed6b00-4553-4992-b469-c649af084651/scratchpad/fase1/memoriais-formulacoes.json (chave melatonina-triptofanos-encapsulados — dossiê técnico gerado, sem laudos)",
        "/private/tmp/claude-501/-Users-diegofrancisco-Downloads-erp-espa-o/c5ed6b00-4553-4992-b469-c649af084651/scratchpad/fase1/laudos.json (índices 19, 40, 41, 60, 161, 163, 205, 206, 207, 210)",
        "/Users/diegofrancisco/Desktop/LAUDOS/VITAMINA D3 COLECALCIFEROL.pdf (compilação Lepuge; bloco L-GLUTAMINA lote AUTO039665: doseamento 98,73% b.a., perda por secagem 0,26%, val. 08/11/26)",
        "/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/PADRAO-ANVISA-TABELA-NUTRICIONAL-2026-09-16.md e scratchpad/padrao-anvisa/vd.json",
        "cadastro vivo: formulas?slug=eq.melatonina-triptofanos-encapsulados e formula_compositions (9 linhas ativas, lidas em 16/09/2026)",
    ],
    prosa=dict(
        identificacao_extra="Não há rótulo nem memorial: a composição de 9 linhas do cadastro (confirmada como deliberada pelo documento PROMPT-LOVABLE-CATALOGO-6-PRODUTOS.md de 08/09/2026, segundo a auditoria de ingredientes) foi 'ajustada aos limites' cravando quatro números exatamente nos limites — e é impossível na porção se os minerais forem elementos (126,3%). Os laudos usados aqui são os disponíveis na máquina para os mesmos insumos em outros produtos, não laudos deste produto.",
        antes_intro="Fonte da tabela: cadastro vivo (`formula_compositions`, 9 linhas, lidas em 16/09/2026), com o veredito da auditoria de 15/09/2026 (Parte II, seção II.4).",
        antes_extra="Soma como escrita 1.000,005 mg; com os sais que entregam os elementos, 1.262,7 mg (126,3%). Quatro limites cravados, uma origem não declarada (fosfatidilserina) e nenhum laudo de melatonina válido na empresa.",
        depois_intro="Grupo \"> 19 anos\". Magnésio levado a 110% do mínimo; zinco, melatonina e biotina tiradas do teto; triptofano e aspartato reduzidos para caber; fosfatidilserina retirada.",
        soma_comentario="Cabe, com 2,1% de excipiente — folga mínima; ver pendência 8.",
        tabela_intro="Coluna \"> 19 anos\" do Anexo VIII da IN 75/2020. Triptofano, aspartato, glutamina e melatonina sem VDR (células vazias).",
        tabela_energia_obs="Proteínas: aminoácidos livres (triptofano 500 + aspártico 100 + glutamina 95 = 695 mg) contados pelo fator das proteínas — 2,8 kcal, abaixo de 4 kcal (não significativo). Sem carboidratos, gorduras ou sódio.",
    ),
)
