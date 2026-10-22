# -*- coding: utf-8 -*-
from _gerador_base import *
from _laudos_ref import L

# --- massas calculadas -------------------------------------------------------------
mg_sal = 500.0; mg_ativo = mg_sal * 0.3022            # 151,1 mg de Mg (teor tal qual do laudo vencido 90844)
zn = 15 / 0.1989                                     # 75,41
borax = 3 / FRAC["Borax"]                            # 26,46
tea = 150.0                                          # assumido 100% (insumo a adquirir)
b6_ativo = 1.3; b6 = b6_ativo / (0.999 * FRAC["piridoxina/HCl"])   # 1,58
d3 = 25 * 40 / 115000 * 1000                         # 8,70 mg

INSUMOS = [
    I("Magnésio", "Bisglicinato de magnésio (laudo: 'Magnésio Glicinato 30%', CAS 14783-68-7)", mg_sal, 30.22,
      "30,22% Mg tal qual — laudo lote 90844 (30,38% base seca × (1 − 0,54%)), VENCIDO em 21/06/2025 — último teor conhecido", "laudo vencido",
      mg_ativo, "mg", "I·Bisglicinato de magnésio; III/IV·Magnésio", L["MG30"], "mantido",
      "dose do rótulo (500 mg de sal = 152 mg de Mg declarados; 43,2% do teto); forma autorizada; os dois laudos de bisglicinato 30% da máquina (90844 e 088629) estão vencidos — pedir laudo novo do lote em estoque ou lote novo e recalcular a massa pelo teor.",
      "Magnésio (bisglicinato de magnésio)", f"500,00 mg × 0,3022 = {fmt(mg_ativo,2)} mg de Mg (o rótulo declara 152 mg; a diferença é arredondamento do rótulo)"),
    I("Teanina", "L-teanina de folhas de Camellia sinensis — insumo a adquirir (rota B)", tea, 100.0,
      "100% — assumido; o laudo do lote em estoque (AUTO039250) não serve: 'SÍNTESE QUÍMICA'", "assumido",
      150, "mg", "I·L-teanina de folhas de Camellia sinensis (IN 318/2024); III/IV·Teanina", L["TEA"], "forma trocada (origem) — PENDENTE laudo",
      "o rótulo destaca a L-teanina na chamada principal ('a união de zinco, magnésio, vitamina D3 e L-teanina'); mantém-se a dose (60% do teto) trocando a origem: só a de folhas de Camellia sinensis é autorizada (especificação aprovada: Blue California, painel ANVISA lido em 15/09). Rota A (retirar) registrada na seção 8.",
      "L-teanina de folhas de Camellia sinensis", "150 mg / 1,00 = 150,00 mg (assumido; recalcular pelo doseamento do laudo do insumo novo)",
      prot_mg=150.0),
    I("Zinco", "Bisglicinato de zinco (CAS 14281-83-5)", zn, 19.89,
      "19,89% Zn tal qual — laudo lote 055-ZN/25 (20,00% b.s. × (1 − 0,54%))", "laudo",
      15, "mg", "I·Bisglicinato de zinco; III/IV·Zinco", L["ZN"], "mantido",
      "dose do rótulo (50,7% do teto); laudo válido.", "Zinco (bisglicinato de zinco)", f"15 mg / 0,1989 = {fmt(zn,2)} mg"),
    I("Boro", "Tetraborato de sódio decahidratado (CAS 1303-96-4) — insumo a adquirir", borax, 11.34,
      "11,34% B — assumido (estequiométrico, Na2B4O7·10H2O puro); sem laudo", "assumido",
      3, "mg", "I·Tetraborato de sódio decahidratado (IN 76/2020); III·Boro NE; IV·Boro 8,866 mg", L["NENHUM"], "forma trocada",
      "'quelato de boro (glicinato de boro)' 56,6 mg não é forma do Anexo I; os dois laudos de boro da máquina (044951 e 91125) são do mesmo glicinato sintético. Dose mantida em 3 mg (33,8% do teto) — o rótulo não declara o elemento; passa a declarar.",
      "Boro (tetraborato de sódio decahidratado)", f"3 mg / 0,1134 = {fmt(borax,2)} mg (assumido)", na_mg=borax * FRAC["Na_em_Borax"]),
    I("Vitamina B6", "Cloridrato de piridoxina (CAS 58-56-0)", b6, 99.9,
      "99,9% — laudo lote 91188; × 82,27% (piridoxina/cloridrato, estequiométrico)", "laudo",
      1.3, "mg", "I·Cloridrato de piridoxina; III/IV·Vitamina B6", L["B6"], "mantido",
      "1,3 mg de vitamina B6 (1,3% do teto). O rótulo hoje trata 1,3 mg de cloridrato como se fosse B6 pura (o memorial rev02 já marca como correção obrigatória: entrega real 1,07 mg); a massa sobe para 1,58 mg para entregar 1,3 mg de piridoxina.",
      "Vitamina B6 (cloridrato de piridoxina)", f"1,3 mg / (0,999 × 0,8227) = {fmt(b6,3)} mg de cloridrato de piridoxina"),
    I("Vitamina D", "Vitamina D3 (colecalciferol), pó 100.000 UI/g (CAS 67-97-0)", d3, None,
      "115.000 UI/g — laudo lote 91408 (potência ensaiada); 1 µg = 40 UI", "laudo",
      25, "µg", "I·Vitamina D3 (Colecalciferol); III/IV·Vitamina D", L["D3"], "mantido",
      "dose do rótulo (50,0% do teto; 167% do VD); laudo válido.", "Vitamina D3 (colecalciferol)",
      f"25 µg × 40 = 1.000 UI; 1.000 / 115 UI/mg = {fmt(d3,2)} mg"),
]

ANTES = [
    ("Magnésio glicinato (sal) 500 mg — tabela: magnésio 152 mg (36% VD)", "500 mg de sal", "CONFORME (152 mg; 63–350). Memorial: 500 mg × 30,22% = 151,1 mg; laudo lote 90844 VENCIDO (21/06/2025); segundo laudo (088629) também vencido."),
    ("Dióxido de silício (INS 551)", "217,1 mg", "aditivo, quantum satis; a auditoria observou que 21,7% de antiumectante é 'dose de enchimento'. Memorial rev02: 207,47 mg q.s.p."),
    ("L-teanina", "150 mg", "NÃO VERIFICADO (origem). Memorial: lote AUTO039250 (Lepuge), laudo lido em 16/09: 'SÍNTESE QUÍMICA' — forma não autorizada."),
    ("Bisglicinato de zinco (sal) 75 mg — tabela: zinco 15 mg (136% VD)", "75 mg de sal", "CONFORME. Memorial: 75,41 mg a 19,89% (lote 055-ZN/25, válido)."),
    ("Quelato de boro (glicinato de boro) 56,6 mg — elemento não declarado", "56,6 mg de sal", "FORMA NÃO AUTORIZADA. Memorial: 57,36 mg a 5,23% = 3,0 mg de B (lote 044951, laudo lido por imagem: glicinato sintético)."),
    ("Vitamina B6 (cloridrato de piridoxina)", "1,3 mg (100% VD)", "CONFORME pelo número; MAS o rótulo declara a massa do sal como vitamina — entrega real 1,07 mg (82% VD), correção já apontada pelo memorial rev02."),
    ("Vitamina D3 (colecalciferol)", "25 mcg (167% VD)", "CONFORME. Memorial: 8,70 mg de pó a 115.000 UI/g (lote 91408)."),
]

soma_ins = sum(i["massa"] for i in INSUMOS)
sio2 = 1000 - soma_ins

P = dict(
    slug="zma-zinco-magnesio-e-vitamina-d", nome="ZMA (Zinco, Magnésio e Vitamina B6)", nome_rotulo="ZMA complex (arte ZmaComplex.pdf)",
    formato="cápsula gelatinosa dura, tamanho 0 (memorial rev02)", porcao_mg=1000.0, porcao_desc="1 g (2 cápsulas)",
    porcoes=30, grupo="adulto", publico="adultos, coluna \"> 19 anos\" dos Anexos III e IV",
    porcao_obs=" (500 mg de pó por cápsula; cápsula vazia de 98,45 mg fora da porção)",
    insumos=INSUMOS, antes=ANTES,
    excipientes=[dict(nome="Dióxido de silício (antiumectante)", ins="551", massa=sio2, sql_slug="dioxido-de-silicio", nome_cadastro="Dióxido de silício (INS 551)",
                      obs="q.s.p. 1.000 mg — quantum satis (IN 211/2023, 14.2, auditoria de 15/09). Continua sendo fração alta (a auditoria já apontou 21,7% como 'enchimento'); ver pendência 5."),
                 dict(nome="Cápsula: gelatina, água purificada, corante dióxido de titânio e lauril sulfato de sódio", ins="171", massa=None,
                      obs="invólucro de 98,45 mg (Qualicaps/Genix, lote 2505380SA, val. 02/04/2030, memorial rev02); o rótulo omite o lauril sulfato de sódio que o memorial atribui à cápsula — confirmar com o fabricante da cápsula")],
    removidos=["**Glicinato de boro 56,6 mg** — substituído por tetraborato de sódio decahidratado (forma não autorizada; ver tabela). **L-teanina sintética (lote AUTO039250)** — substituída pela de folhas de Camellia sinensis (rota B); o lote em estoque não pode ser usado."],
    removidos_json=[],
    mudancas=[
        "Boro: 'quelato de boro (glicinato de boro)' 56,6 mg → tetraborato de sódio decahidratado 26,46 mg (3 mg de boro) — motivo: Anexo I só lista frutoborato de cálcio e tetraborato de sódio decahidratado; o rótulo passa a declarar o elemento (3 mg) na tabela.",
        "L-teanina: origem sintética (Lepuge, AUTO039250) → \"L-teanina de folhas de Camellia sinensis\", mesma dose de 150 mg — motivo: Anexo I (IN 318/2024) só autoriza a de folhas de Camellia sinensis; o laudo do lote em uso diz 'SÍNTESE QUÍMICA'. Insumo a adquirir (rota B, ver seção 8).",
        "Vitamina B6: massa 1,30 → 1,58 mg de cloridrato para entregar 1,3 mg de piridoxina — motivo: o rótulo tratava a massa do sal como vitamina (entrega real 1,07 mg), erro já apontado no memorial rev02.",
        "Magnésio: mantido (500 mg de bisglicinato = 151,1 mg de Mg) — condição: laudo novo, pois o lote 90844 venceu em 21/06/2025; a massa deve ser recalculada pelo teor do laudo novo.",
        "Zinco e vitamina D3: mantidos (laudos válidos; 50,7% e 50,0% dos tetos).",
        "Tabela nutricional: passa a declarar boro (3 mg, %VD vazio) e teanina (150 mg, %VD vazio), que o rótulo vigente omite embora o memorial rev02 já pedisse.",
    ],
    ingredients_list="Bisglicinato de magnésio, antiumectante dióxido de silício (INS 551), L-teanina de folhas de Camellia sinensis, bisglicinato de zinco, tetraborato de sódio decahidratado, colecalciferol (vitamina D3), cloridrato de piridoxina (vitamina B6) e cápsula: gelatina, água purificada e corante dióxido de titânio (INS 171).",
    alergenicos_obs="Nenhum insumo deriva dos alergênicos da RDC 26/2015. Sem declaração de glúten até haver laudo do produto acabado.",
    warnings="\n".join(RDC243 + ["Público indicado: adultos (19 anos ou mais). Ingerir 2 cápsulas ao dia.", ADV_GENERICA, CONSERVACAO]),
    advertencias_base=[
        "Três frases do art. 14, I, c/d/e da RDC 243/2018 (texto literal); grupo e frequência — art. 14, I, a/b; conservação — art. 14, II.",
        f"\"{ADV_GENERICA}\" — IN 28/2018, Anexo VI: exigida duas vezes, pela linha \"Aminoácidos\" (L-teanina) e pela linha \"Boro\" (IN 76/2020). O texto é o mesmo nas duas linhas.",
    ],
    advertencias_faltam="nada falta em texto: o campo `warnings` já traz as três frases do art. 14 e a frase genérica do Anexo VI.",
    pendencias=[
        "**Laudo novo de bisglicinato de magnésio** (lote em estoque 90844 venceu em 21/06/2025; o alternativo 088629 venceu em 12/01/2024). Sem laudo vigente, o insumo de maior massa da fórmula não pode ser pesado com teor confirmado. Recalcular 500 mg pelo teor do laudo novo (se o teor for 30,0%, a entrega cai para 150,0 mg — ainda conforme).",
        "**L-teanina — decisão do dono:** rota B (proposta principal: comprar \"L-teanina de folhas de Camellia sinensis\", especificação Blue California, e obter laudo que declare a origem botânica) ou rota A (retirar; a chamada do rótulo perderia a L-teanina e sobrariam 388 mg de excipiente — ver alternativa). Em nenhuma rota o lote AUTO039250 pode ser usado.",
        "**Fonte de boro:** comprar tetraborato de sódio decahidratado (26,46 mg para 3 mg de B, estequiométrico) ou frutoborato de cálcio (massa pelo laudo do fabricante). Alternativa: retirar o boro (o ZMA não depende dele; a advertência genérica continuaria exigida pela teanina).",
        "**Rótulo:** declarar boro (3 mg) e L-teanina (150 mg) na tabela; corrigir vitamina B6 (o rótulo trata 1,3 mg de sal como vitamina); trocar 'quelato de boro (glicinato de boro)' por 'tetraborato de sódio decahidratado'; trocar 'L-teanina' por 'L-teanina de folhas de Camellia sinensis'; 'magnésio glicinato' pode permanecer como sinônimo comercial, mas a lista de ingredientes deve usar o nome do Anexo I (bisglicinato de magnésio); confirmar se a cápsula tem lauril sulfato de sódio.",
        "**Excipiente:** 238 mg de dióxido de silício (23,8%) — decisão do RT entre manter (quantum satis) e usar agente de massa; ou subir o magnésio (alternativa abaixo).",
    ],
    alternativas=[
        "**Rota A da L-teanina (retirar):** a fórmula fica com 5 constituintes (Mg, Zn, B, B6, D3) somando ~612 mg + 388 mg de excipiente; veredito condicionado só ao laudo de magnésio e à fonte de boro; a chamada do rótulo teria de mudar.",
        "**Subir o magnésio para 200 mg** (661,8 mg de bisglicinato a 30,22%): 57,1% do teto, reduz o excipiente a ~76 mg. A planilha PROPOSTA rev01 da própria fábrica (14–15/09/2026, não assinada) e o dossiê 'ZMA Night' já trazem 673,055 mg de sal (≈203 mg de Mg) — mas a regra desta fase é manter dose que já está na faixa com folga; fica como opção do dono.",
        "**Retirar o boro** em vez de comprar a fonte autorizada.",
    ],
    veredito="CONFORME CONDICIONADO A (laudo de origem Camellia sinensis da L-teanina nova; laudo novo do bisglicinato de magnésio; aquisição de tetraborato de sódio decahidratado ou frutoborato de cálcio com laudo)",
    veredito_texto="Com a composição da seção 3, todas as formas são do Anexo I, todas as doses ficam entre o mínimo e 60% do teto (a mais alta é a teanina, 60,0%), e a porção fecha em 1.000 mg. Três condições impedem o CONFORME pleno hoje: a L-teanina autorizada ainda não foi comprada (todos os 5 laudos de L-teanina da máquina são sintéticos ou sem origem), o magnésio não tem laudo vigente e a fonte de boro autorizada não existe na máquina. Se o dono optar pela rota A (retirar a teanina), restam duas condições.",
    fontes=[
        "/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/IN28-2018-ANEXO-I-LITERAL.md",
        "/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/IN28-2018-ANEXO-III-LITERAL.md",
        "/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/IN28-2018-ANEXOS-IV-V-VI-LITERAL.md",
        "/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/AUDITORIA-ROTULO-VS-ANVISA-2026-09-15.md (seção 4.13)",
        "/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/composicoes_rotulo.json (chave zma_complex)",
        "/private/tmp/claude-501/-Users-diegofrancisco-Downloads-erp-espa-o/c5ed6b00-4553-4992-b469-c649af084651/scratchpad/fase1/memoriais-formulacoes.json (chave zma-zinco-magnesio-e-vitamina-d — MEMORIAL-CALCULO-ZMA-COMPLEX-rev02.docx)",
        "/private/tmp/claude-501/-Users-diegofrancisco-Downloads-erp-espa-o/c5ed6b00-4553-4992-b469-c649af084651/scratchpad/fase1/laudos.json (índices 19, 21, 37, 185, 197, 203, 210, 212)",
        "/Users/diegofrancisco/Desktop/LAUDOS/VITAMINA D3 COLECALCIFEROL.pdf (compilação Lepuge; bloco L-TEANINA lote AUTO039250: 'Forma de Obtenção: SÍNTESE QUÍMICA')",
        "/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/PADRAO-ANVISA-TABELA-NUTRICIONAL-2026-09-16.md e scratchpad/padrao-anvisa/vd.json",
        "cadastro vivo: formulas?slug=eq.zma-zinco-magnesio-e-vitamina-d e formula_compositions (6 linhas ativas, lidas em 16/09/2026 — cadastro já reflete a PROPOSTA rev01: 673,055 mg de bisglicinato, 119,02 mg de zinco, 50 µg de D3)",
    ],
    prosa=dict(
        identificacao_extra="O nome do catálogo cita vitamina B6 e o slug cita vitamina D; a fórmula real tem as duas (memorial rev02). O cadastro vivo já reflete a planilha PROPOSTA rev01 (não assinada) — 673,055 mg de bisglicinato de magnésio, 119,02 mg de bisglicinato de zinco e 50 µg de D3 — que diverge do rótulo impresso (500 mg, 75 mg, 25 µg) e do memorial rev02. Esta reformulação parte do rótulo e do memorial rev02, que é o que a fábrica pesa.",
        antes_intro="Fonte da tabela: composição impressa no rótulo (`composicoes_rotulo.json`, chave `zma_complex`, 7 itens), com o veredito da auditoria de 15/09/2026 (seção 4.13) e a observação do memorial rev02.",
        antes_extra="Soma impressa: 1.000,025 mg (arredondamento do rótulo). O memorial rev02 fecha em 1.000,00 mg com 207,47 mg de dióxido de silício. Dois problemas de forma (boro e L-teanina), um de laudo (magnésio vencido) e um de rótulo (B6 declarada como massa do sal).",
        depois_intro="Grupo \"> 19 anos\". Mesmas doses do rótulo para magnésio, zinco, B6 e D3 (todas na faixa e com folga), formas trocadas para boro e L-teanina. Massas derivadas do teor do laudo do lote nomeado; onde não há laudo, teor estequiométrico assumido.",
        soma_comentario="Cabe; o excipiente continua alto (23,8%) porque a fórmula de 5 ativos pequenos mais o magnésio não preenche 1 g — o mesmo desenho do rótulo vigente (21,7% de antiumectante).",
        tabela_intro="Coluna \"> 19 anos\" (adultos) do Anexo VIII da IN 75/2020. Boro e teanina não têm VDR — células de %VD vazias (RDC 429/2020, art. 12, §1º).",
        tabela_energia_obs="A L-teanina (150 mg, aminoácido) é contada como proteína pelo fator 4 kcal/g — 0,6 kcal, abaixo de 4 kcal (não significativo, %VD zero). O sódio vem só do tetraborato (12,06% de Na): 3,19 mg, abaixo de 5 mg.",
    ),
)
