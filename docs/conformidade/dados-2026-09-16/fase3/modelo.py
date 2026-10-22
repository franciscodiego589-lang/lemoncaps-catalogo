# -*- coding: utf-8 -*-
"""
Fase 3 — modelo harmonizado dos 24 produtos.

Lê os JSONs da fase 2, aplica o OVERLAY de harmonização (valores absolutos, idempotente — cada item registra
antes/depois/motivo) e devolve um modelo único por produto: insumos normalizados (massa do insumo, teor do laudo,
fator de conversão, teor efetivo, ativo em mg e na unidade declarada, limites, laudo), excipientes, linhas de
composição para o catálogo (quantity = massa do insumo pesado; nome com a forma do Anexo I e a equivalência),
tabela nutricional recalculada (arredondamento do gabarito; %VD sobre a quantidade declarada; kJ = kcal × 4,184),
lista de ingredientes, advertências (frases literais do art. 14 da RDC 243 e do Anexo VI da IN 28), pendências.

Fontes: scratchpad/fase2/<slug>.json; padrao-anvisa/vd.json; anexos literais (docs/conformidade/); laudos.json
(fase 1) para os lotes de referência adotados.
"""
import json, re, sys, copy
from decimal import Decimal, ROUND_HALF_UP
from pathlib import Path
from collections import OrderedDict

sys.path.insert(0, str(Path(__file__).resolve().parent))
from verificar import (carregar, GRUPO_DE, G1, G2, G3, SLUGS, num, sem_acento, unidade_norm, para_mg, de_mg,
                       ativo_mg, teor_efetivo, potencia_ui_por_mg, retirado, eh_componente, nome_constituinte,
                       grupo_populacional, VD, VD_CHAVE, MACRO_VD, NAO_SIG, GRUPO_VD, fmt, energia_modelo)
import anexos

F3 = Path("/private/tmp/claude-501/-Users-diegofrancisco-Downloads-erp-espa-o/c5ed6b00-4553-4992-b469-c649af084651/scratchpad/fase3")
DATA = "2026-09-16"
FONTE = "reformulacao_2026-09-16"

# ======================================================================================================
# 1. OVERLAY DE HARMONIZAÇÃO — valores absolutos (idempotente). Cada entrada vira uma linha de harmonizacao.md.
#    Regra da fase 3: mesmo insumo → mesmo lote de referência, mesmo teor, mesma forma; adota-se o laudo válido
#    mais recente; corrige-se só erro de conta, inconsistência entre grupos ou desvio do gabarito.
# ======================================================================================================
CORRECOES = []  # registro (slug, insumo, campo, antes, depois, motivo)

def _reg(slug, insumo, campo, antes, depois, motivo):
    CORRECOES.append(dict(slug=slug, insumo=insumo, campo=campo, antes=antes, depois=depois, motivo=motivo))

def _set(slug, ins, campo, valor, motivo, insumo_nome=None):
    antes = ins.get(campo)
    if antes != valor:
        ins[campo] = valor
        _reg(slug, insumo_nome or (ins.get("constituinte_anexo_i") or ins.get("nome") or "?"), campo, antes, valor, motivo)

def _achar(d, pred):
    for ins in d["insumos"]:
        if pred(sem_acento((ins.get("constituinte_anexo_i") or "") + " " + (ins.get("forma_insumo") or ""))):
            return ins
    return None

def _excip(d, contem):
    for e in d.get("excipientes") or []:
        if contem in sem_acento(e.get("nome") or ""): return e
    return None

def aplicar_overlay(dados):
    # ---- Metilcobalamina: lote de referência 219376 (val. 14/11/2030, 98,17 % b.a. → 89,27 % t.q.), adotado por
    #      G1 (5 produtos) e G2 (Slim Up); G3 usava 90955 (val. 28/12/2026, "vence em 3 meses"). Dose (8,5 µg) mantida.
    for slug in ("pre-treino-300-g", "pre-treino-creatina-sabor-limao-420g"):
        d = dados[slug]; ins = _achar(d, lambda t: "metilcobalamina" in t)
        mot = ("harmonização entre grupos: mesmo insumo, mesmo lote de referência — metilcobalamina lote 219376 (Fagron/SM, val. 14/11/2030, "
               "98,17 % b.a. lido em texto → 89,27 % tal qual, umidade 9,07 % do memorial rev03) é o laudo válido mais recente e o usado por 6 produtos; "
               "o lote 90955 (val. 28/12/2026) era o do memorial do pré-treino. Dose de 8,5 µg mantida; massa recalculada = 8,5 ÷ 0,8927.")
        _set(slug, ins, "teor_pct", 89.27, mot)
        _set(slug, ins, "massa_insumo_mg", 0.009522, mot)
        _set(slug, ins, "teor_fonte", "laudo lote 219376 (Fagron/SM, 98,17 % base anidra, val. 14/11/2030; 89,27 % tal qual conforme memorial rev03 do Slim Up) — harmonizado na fase 3", mot)
        _set(slug, ins, "conta", "8,5 µg ÷ 0,8927 = 9,52 µg = 0,00952 mg de metilcobalamina", mot)
        ins["laudo"] = dict(lote="219376 (26B20-B032-219376, Fagron/SM, fabricante 032511057)", validade="14/11/2030", vencido=False)
        _reg(slug, "Vitamina B12 — Metilcobalamina", "laudo", "90955 (val. 28/12/2026)", "219376 (val. 14/11/2030)", mot)
    # ---- L-carnitina: lote de referência 26H14-B025-226329 (SM, 99,41 %, val. 20/05/2028, lido em texto) — G3;
    #      G1/G2 usavam 216523 (95,95 %, PDF em disco é digitalização; val. 18/08/2027 só no memorial).
    mot = ("harmonização entre grupos: L-carnitina base lote 26H14-B025-226329 (SM Empreendimentos, teor 99,41 %, val. 20/05/2028, laudo lido em texto no inventário) "
           "é o laudo válido mais recente; o lote 216523 (95,95 %, val. 18/08/2027) só existe em digitalização não relida.")
    d = dados["focus-colina"]; ins = _achar(d, lambda t: "carnitina" in t)
    _set("focus-colina", ins, "teor_pct", 99.41, mot); _set("focus-colina", ins, "massa_insumo_mg", 95.5638, mot)
    _set("focus-colina", ins, "conta", "95 mg / 0,9941 = 95,56 mg", mot)
    _set("focus-colina", ins, "teor_fonte", "laudo lote 26H14-B025-226329 (SM, 99,41 %) — harmonizado na fase 3", mot)
    ins["laudo"] = dict(lote="26H14-B025-226329 (SM Empreendimentos, fabricante A2605097)", validade="20/05/2028", vencido=False)
    _reg("focus-colina", "L-Carnitina", "laudo", "216523 (val. 18/08/2027)", "26H14-B025-226329 (val. 20/05/2028)", mot)
    e = _excip(d, "dioxido de silicio")
    _set("focus-colina", e, "massa_mg", 34.591, "q.s.p. recalculado: 1.000 − 965,409 (soma dos insumos após a troca do lote de L-carnitina)", "Dióxido de silício (q.s.p.)")
    d["soma_insumos_mg"] = 965.409; d["soma_excipientes_mg"] = 34.591
    d = dados["pro-energy"]; ins = _achar(d, lambda t: "carnitina" in t)
    _set("pro-energy", ins, "teor_pct", 99.41, mot); _set("pro-energy", ins, "ativo_mg", 89.47, mot)
    _set("pro-energy", ins, "teor_fonte", "laudo lote 26H14-B025-226329 (SM, 99,41 %, val. 20/05/2028) — harmonizado na fase 3 (massa de 90 mg do memorial mantida; 90 × 99,41 % = 89,47 mg)", mot)
    ins["laudo"] = dict(lote="26H14-B025-226329 (SM Empreendimentos, fabricante A2605097)", validade="20/05/2028", vencido=False)
    _reg("pro-energy", "L-Carnitina", "laudo", "216523 (validade não confirmada, scan)", "26H14-B025-226329 (val. 20/05/2028)", mot)
    _set("pro-energy", ins, "pct_do_maximo", 4.5, mot)
    # ---- Niacinamida lote 872226: teor tal qual 99,09 % (99,5 % b.s. do laudo × umidade do memorial), como G1;
    #      G3 usava 99,5 % (base seca). Massa (30 mg) mantida.
    d = dados["pre-treino-creatina-sabor-limao-420g"]; ins = _achar(d, lambda t: "niacina" in t)
    mot = "harmonização entre grupos: mesmo lote 872226 (INLAB) — teor tal qual 99,09 % (99,5 % base seca do laudo, descontada a umidade, conta do memorial rev02 usada nos 3 produtos do G1); G3 usava a base seca. Massa 30 mg mantida; ativo = 29,73 mg NE (84,9 % do teto)."
    _set("pre-treino-creatina-sabor-limao-420g", ins, "teor_pct", 99.09, mot); _set("pre-treino-creatina-sabor-limao-420g", ins, "ativo_mg", 29.73, mot)
    _set("pre-treino-creatina-sabor-limao-420g", ins, "pct_do_maximo", 84.94, mot); _set("pre-treino-creatina-sabor-limao-420g", ins, "conta", "30 × 99,09 % = 29,73 mg NE", mot)
    # ---- Bisglicinato de magnésio: lote de referência 90844 (30,38 % b.s. → 30,22 % t.q., val. 21/06/2025, VENCIDO — pedir novo),
    #      usado por 4 produtos; G3 usava 30,0 % (lote 088629, vencido em 12/01/2024). Dose de 300 mg mantida; massa recalculada.
    ins = _achar(d, lambda t: "bisglicinato de magnesio" in t)
    mot = ("harmonização entre grupos: bisglicinato de magnésio — lote de referência 90844 (Analitic, 30,38 % base seca × (1 − 0,53 %) = 30,22 % tal qual, val. 21/06/2025, vencido; "
           "é o mais recente dos dois laudos vencidos e o usado por ZMA, Multi Vitta, Melatonina + Triptofanos e Saúde Intestinal); G3 usava 30,0 % do lote 088629 (vencido em 12/01/2024). "
           "Dose de 300 mg de Mg mantida; massa = 300 ÷ 0,3022 = 992,72 mg; maltodextrina q.s.p. absorve a diferença (+7,28 mg).")
    _set("pre-treino-creatina-sabor-limao-420g", ins, "teor_pct", 30.22, mot); _set("pre-treino-creatina-sabor-limao-420g", ins, "massa_insumo_mg", 992.72, mot)
    _set("pre-treino-creatina-sabor-limao-420g", ins, "conta", "300 mg ÷ 0,3022 = 992,72 mg de bisglicinato de magnésio", mot)
    _set("pre-treino-creatina-sabor-limao-420g", ins, "teor_fonte", "laudo lote 90844 (Analitic, 30,38 % b.s. → 30,22 % t.q.) — VENCIDO em 21/06/2025: pedir laudo novo; harmonizado na fase 3", mot)
    ins["laudo"] = dict(lote="90844 (Analitic, fabricante 66342023062230)", validade="21/06/2025", vencido=True)
    _reg("pre-treino-creatina-sabor-limao-420g", "Magnésio — Bisglicinato de magnésio", "laudo", "088629 / 90844 (30,0 %)", "90844 (30,22 % t.q.)", mot)
    e = _excip(d, "maltodextrina"); _set("pre-treino-creatina-sabor-limao-420g", e, "massa_mg", 2275.3575, "q.s.p. recalculado após as massas harmonizadas de bisglicinato de magnésio (992,72 mg), vitamina D3 (13,913 mg) e metilcobalamina (0,009522 mg): 14.000 − 10.066,6425 (insumos) − 1.658 (demais excipientes)", "Maltodextrina (q.s.p.)")
    # ---- Vitamina D3 91408: massa 13,913 mg para 40 µg (13,9 arredondado no G3; mesmo insumo nos outros 6 produtos)
    ins = _achar(d, lambda t: "colecalciferol" in t)
    mot = "harmonização: mesma dose (40 µg) e mesma potência (115.000 UI/g, lote 91408) → mesma massa dos outros 6 produtos: 40 × 40 ÷ 115 = 13,913 mg (G3 arredondava 13,9 mg = 39,96 µg)."
    _set("pre-treino-creatina-sabor-limao-420g", ins, "massa_insumo_mg", 13.913, mot); _set("pre-treino-creatina-sabor-limao-420g", ins, "ativo_mg", 0.04, mot)
    _set("pre-treino-creatina-sabor-limao-420g", ins, "conta", "40 µg × 40 = 1.600 UI; 1.600 ÷ 115 UI/mg = 13,913 mg", mot); _set("pre-treino-creatina-sabor-limao-420g", ins, "pct_do_maximo", 80.0, mot)
    # ---- L-glutamina: lote de referência 950334 (INLAB, 99,6 %, val. 28/01/2027 — teor e validade lidos no memorial rev02 do
    #      Saúde Intestinal; PDF é digitalização); G1 usava AUTO039665 (Lepuge, 98,47 %, val. 08/11/2026).
    d = dados["melatonina-triptofanos-encapsulados"]; ins = _achar(d, lambda t: "glutamina" in t)
    mot = ("harmonização entre grupos: L-glutamina lote 950334 (INLAB, 99,6 %, val. 28/01/2027 — dados do memorial rev02 do Saúde Intestinal, produto que pesa esse lote) "
           "é o laudo válido mais recente; AUTO039665 (Lepuge) vence em 08/11/2026. Dose 95 mg mantida; massa = 95 ÷ 0,996 = 95,38 mg. PDF do laudo 950334 é digitalização não relida — conferir.")
    _set("melatonina-triptofanos-encapsulados", ins, "teor_pct", 99.6, mot); _set("melatonina-triptofanos-encapsulados", ins, "massa_insumo_mg", 95.3815, mot)
    _set("melatonina-triptofanos-encapsulados", ins, "conta", "95 mg / 0,996 = 95,38 mg", mot)
    _set("melatonina-triptofanos-encapsulados", ins, "teor_fonte", "laudo lote 950334 (INLAB, 99,6 %, lido no memorial rev02 do Saúde Intestinal; PDF é digitalização) — harmonizado na fase 3", mot)
    ins["laudo"] = dict(lote="950334 (INLAB ref. A100020)", validade="28/01/2027", vencido=False, obs="PDF em disco é digitalização não relida; teor e validade vêm do memorial rev02 do Saúde Intestinal")
    _reg("melatonina-triptofanos-encapsulados", "Glutamina", "laudo", "AUTO039665 (Lepuge, val. 08/11/2026)", "950334 (INLAB, val. 28/01/2027)", mot)
    e = _excip(d, "dioxido de silicio"); _set("melatonina-triptofanos-encapsulados", e, "massa_mg", 21.9853, "q.s.p. recalculado: 1.000 − 978,0147 (após a troca do lote de L-glutamina)", "Dióxido de silício (q.s.p.)")
    d["soma_insumos_mg"] = 978.0147; d["soma_excipientes_mg"] = 21.9853
    # ---- Ferro: mesma referência nos dois produtos (NaturalPRO NPT.0525/710, 20,1 %, val. 05/2027, identidade química PENDENTE) — o
    #      Multi Vitta usava 20,26 % de laudo vencido (2022/2023).
    d = dados["multi-vitta-gestante-e-lactante-em-capsula"]; ins = _achar(d, lambda t: "bisglicinato ferroso" in t)
    mot = ("harmonização entre grupos: ferro — a única referência não vencida na máquina é o 'Quelato Ferro Bios 20 %' NaturalPRO lote NPT.0525/710 (20,1 % de Fe, val. 05/2027), "
           "adotado pelo Dores Musculares com a identidade química (bisglicinato ferroso, CAS 20150-34-9) PENDENTE de declaração do fabricante; o Multi Vitta usava 20,26 % de laudo vencido. "
           "Dose 8,1 mg mantida; massa = 8,1 ÷ 0,201 = 40,30 mg (PROVISÓRIA até laudo).")
    _set("multi-vitta-gestante-e-lactante-em-capsula", ins, "teor_pct", 20.1, mot); _set("multi-vitta-gestante-e-lactante-em-capsula", ins, "massa_insumo_mg", 40.2985, mot)
    _set("multi-vitta-gestante-e-lactante-em-capsula", ins, "conta", "8,1 mg / 0,201 = 40,30 mg (PROVISÓRIO: massa válida só se o insumo for bisglicinato ferroso com esse teor)", mot)
    _set("multi-vitta-gestante-e-lactante-em-capsula", ins, "teor_fonte", "laudo NaturalPRO NPT.0525/710 (Fe 20,1 %; identidade química não declarada) — harmonizado na fase 3 com o Dores Musculares", mot)
    ins["laudo"] = dict(lote="NPT.0525/710 (NaturalPRO) — identidade química (bisglicinato ferroso) PENDENTE", validade="05/2027", vencido=False)
    _reg("multi-vitta-gestante-e-lactante-em-capsula", "Ferro", "laudo", "nenhum (último teor 20,26 % de laudo vencido)", "NPT.0525/710 (20,1 %, val. 05/2027, identidade PENDENTE)", mot)
    e = _excip(d, "dioxido de silicio"); _set("multi-vitta-gestante-e-lactante-em-capsula", e, "massa_mg", 108.975, "q.s.p. recalculado: 1.000 − 891,025 (após a massa do ferro 40,30 mg)", "Dióxido de silício (q.s.p.)")
    d["soma_insumos_mg"] = 891.025; d["soma_excipientes_mg"] = 108.975
    # ---- Validades lidas em memorial (G3) transportadas para o G2 (mesmos lotes)
    d = dados["pro-energy"]
    for chave, val, fonte in (("cafeina", "02/12/2029", "memorial MC-PRD-PRETREINO-001 rev.01 (lote 25I01-B062-214171)"), ("taurina", "10/05/2028", "memorial MC-PRD-PRETREINO-001 rev.01 (lote 25H04-B053-214586)")):
        ins = _achar(d, lambda t, c=chave: c in t and "guarana" not in t)
        if ins and (ins.get("laudo") or {}).get("vencido") is None:
            antes = dict(ins["laudo"]); ins["laudo"]["validade"] = val + " (lida no " + fonte + "; PDF em disco é digitalização)"; ins["laudo"]["vencido"] = False
            _reg("pro-energy", ins.get("constituinte_anexo_i"), "laudo.validade", antes.get("validade"), ins["laudo"]["validade"], "mesmo lote usado pelos pré-treinos, cuja frente leu a validade no memorial da fábrica")
    # ---- Slim Up: fator do sorbitol 2,4 (provisório) → 2,6 kcal/g (Anexo XXII da IN 75, lido em 16/09/2026)
    d = dados["slim-up-emagrecimento-em-gota"]
    tn = d["tabela_nutricional"]
    for l in tn["linhas"]:
        if l["item"] == "Valor energético":
            antes = l["quantidade"]; l["quantidade"] = 0.674; l["kj"] = round(0.674 * 4.184, 1)
            l["nota"] = "glicerina 0,1333 g × 4 + sorbitol 0,0467 g × 2,6 (Anexo XXII IN 75, lido 16/09/2026) + ácido cítrico 0,0067 g × 3 = 0,674 kcal; kJ = kcal × 4,184"
            _reg("slim-up-emagrecimento-em-gota", "Valor energético", "quantidade (kcal)", antes, 0.674, "fator do sorbitol corrigido de 2,4 (provisório no memorial) para 2,6 kcal/g, valor literal do Anexo XXII da IN 75/2020 lido no AnvisaLegis em 16/09/2026")
    return dados

# ======================================================================================================
# 2. CATÁLOGO DE INSUMOS — forma do Anexo I (literal), constituinte, classe, nome/unidade na tabela, ordem (Anexo XI IN 75)
# ======================================================================================================
# ordem: 100 vitaminas (A, D, E, K, C, B1, B2, niacina, B6, biotina, fólico, pantotênico, B12), 200 minerais (ordem Anexo XI),
# 300 colina, 310 taurina, 400 bioativos (ordem: creatina, carnitina, cafeína, melatonina, teanina, inositol, MSM, glucosamina, hialurônico,
# silício, boro, ácido clorogênico, antocianinas, quercetina, colágeno tipo II), 50 aminoácidos (sob Proteínas), 60 EPA/DHA (sob gorduras)
CAT = OrderedDict([
    ("vitc",   dict(forma="Ácido ascórbico", const="Vitamina C", classe="vitamina", tab="Vitamina C", unid="mg", ordem=105, slug="vitamina-c", vit="vitamina C")),
    ("vita",   dict(forma="Acetato de retinol", const="Vitamina A", classe="vitamina", tab="Vitamina A", unid="µg RAE", ordem=101, slug="vitamina-a", vit="vitamina A")),
    ("d3",     dict(forma="Colecalciferol (vitamina D3)", const="Vitamina D", classe="vitamina", tab="Vitamina D", unid="µg", ordem=102, slug="vitamina-d", vit=None)),
    ("vite",   dict(forma="Acetato de DL-alfa-tocoferol", const="Vitamina E", classe="vitamina", tab="Vitamina E", unid="mg", ordem=103, slug="vitamina-e", vit="vitamina E")),
    ("k2",     dict(forma="Menaquinona-7", const="Vitamina K", classe="vitamina", tab="Vitamina K", unid="µg", ordem=104, slug="vitamina-k", vit="vitamina K2")),
    ("b1",     dict(forma="Cloridrato de tiamina", const="Tiamina", classe="vitamina", tab="Tiamina", unid="mg", ordem=106, slug="vitamina-b1", vit="vitamina B1")),
    ("b2",     dict(forma="Riboflavina", const="Riboflavina", classe="vitamina", tab="Riboflavina", unid="mg", ordem=107, slug="vitamina-b2", vit="vitamina B2")),
    ("b3",     dict(forma="Nicotinamida", const="Niacina", classe="vitamina", tab="Niacina", unid="mg NE", ordem=108, slug="vitamina-b3", vit="vitamina B3")),
    ("b6",     dict(forma="Cloridrato de piridoxina", const="Vitamina B6", classe="vitamina", tab="Vitamina B6", unid="mg", ordem=109, slug="vitamina-b6", vit="vitamina B6")),
    ("biotina",dict(forma="D-biotina", const="Biotina", classe="vitamina", tab="Biotina", unid="µg", ordem=110, slug="biotina", vit="vitamina B7")),
    ("b9",     dict(forma="Ácido fólico", const="Ácido fólico", classe="vitamina", tab="Ácido fólico", unid="µg DFE", ordem=111, slug="vitamina-b9", vit="vitamina B9")),
    ("b5",     dict(forma="D-pantotenato de cálcio", const="Ácido pantotênico", classe="vitamina", tab="Ácido pantotênico", unid="mg", ordem=112, slug="vitamina-b5", vit="vitamina B5")),
    ("b12-metil", dict(forma="Metilcobalamina", const="Vitamina B12", classe="vitamina", tab="Vitamina B12", unid="µg", ordem=113, slug="vitamina-b12", vit="vitamina B12")),
    ("calcio", dict(forma="Carbonato de cálcio", const="Cálcio", classe="mineral", tab="Cálcio", unid="mg", ordem=201, slug="calcio-elementar", vit=None)),
    ("cobre",  dict(forma="Bisglicinato de cobre", const="Cobre", classe="mineral", tab="Cobre", unid="µg", ordem=203, slug="cobre", vit=None)),
    ("cromo",  dict(forma="Picolinato de cromo", const="Cromo", classe="mineral", tab="Cromo", unid="µg", ordem=204, slug="cromo", vit=None)),
    ("ferro",  dict(forma="Bisglicinato ferroso", const="Ferro", classe="mineral", tab="Ferro", unid="mg", ordem=205, slug="ferro", vit=None)),
    ("iodo",   dict(forma="Iodeto de potássio", const="Iodo", classe="mineral", tab="Iodo", unid="µg", ordem=208, slug="iodo", vit=None)),
    ("magnesio-bisglicinato", dict(forma="Bisglicinato de magnésio", const="Magnésio", classe="mineral", tab="Magnésio", unid="mg", ordem=209, slug="magnesio", vit=None)),
    ("magnesio-oxido", dict(forma="Óxido de magnésio", const="Magnésio", classe="mineral", tab="Magnésio", unid="mg", ordem=209, slug="magnesio", vit=None)),
    ("magnesio-cloreto", dict(forma="Cloreto de magnésio", const="Magnésio", classe="mineral", tab="Magnésio", unid="mg", ordem=209, slug="magnesio", vit=None)),
    ("selenio", dict(forma="Selenito de sódio", const="Selênio", classe="mineral", tab="Selênio", unid="µg", ordem=213, slug="selenio", vit=None)),
    ("zinco",  dict(forma="Bisglicinato de zinco", const="Zinco", classe="mineral", tab="Zinco", unid="mg", ordem=214, slug="zinco", vit=None)),
    ("colina", dict(forma="Bitartarato de colina", const="Colina", classe="outro", tab="Colina", unid="mg", ordem=300, slug="colina", vit=None)),
    ("taurina", dict(forma="Taurina", const="Taurina", classe="aminoacido", tab="Taurina", unid="mg", ordem=310, slug="taurina", vit=None)),
    ("creatina", dict(forma="Creatina monohidratada", const="Creatina", classe="outro", tab="Creatina", unid="mg", ordem=401, slug="creatina-monoidratada", vit=None)),
    ("carnitina", dict(forma="Levocarnitina", const="L-Carnitina", classe="aminoacido", tab="L-Carnitina", unid="mg", ordem=402, slug="l-carnitina", vit=None)),
    ("cafeina-anidra", dict(forma="Cafeína", const="Cafeína", classe="outro", tab="Cafeína", unid="mg", ordem=403, slug="cafeina-anidra", vit=None)),
    ("guarana", dict(forma="Guaraná em pó (Paullinia cupana)", const="Cafeína", classe="extrato_vegetal", tab="Cafeína", unid="mg", ordem=403, slug="guarana-em-po", vit=None)),
    ("melatonina", dict(forma="Melatonina", const="Melatonina", classe="outro", tab="Melatonina", unid="mg", ordem=404, slug="melatonina", vit=None)),
    ("teanina", dict(forma="L-teanina de folhas de Camellia sinensis", const="Teanina", classe="aminoacido", tab="Teanina", unid="mg", ordem=405, slug="l-teanina", vit=None)),
    ("inositol", dict(forma="Inositol (Mio-inositol/Meso-inositol)", const="Inositol", classe="outro", tab="Inositol", unid="mg", ordem=406, slug="inositol", vit=None)),
    ("msm",    dict(forma="Metilsulfonilmetano", const="Metilsulfonilmetano", classe="outro", tab="Metilsulfonilmetano", unid="mg", ordem=407, slug="metilsulfonilmetano", vit=None)),
    ("glucosamina", dict(forma="Sulfato de glucosamina com cloreto de potássio", const="Glucosamina", classe="outro", tab="Glucosamina", unid="mg", ordem=408, slug="sulfato-de-glucosamina-com-cloreto-de-potassio", vit=None)),
    ("hialuronato", dict(forma="Hialuronato de Sódio obtido pela fermentação de Streptococcus zooepidemicus", const="Ácido hialurônico", classe="outro", tab="Ácido hialurônico", unid="mg", ordem=409, slug="hialuronato-de-sodio", vit=None)),
    ("silicio", dict(forma="Ácido orto-silícico estabilizado com maltodextrina", const="Silício", classe="mineral", tab="Silício", unid="mg", ordem=410, slug="silicio-organico", vit=None)),
    ("boro",   dict(forma="Tetraborato de sódio decahidratado", const="Boro", classe="mineral", tab="Boro", unid="mg", ordem=411, slug="boro", vit=None)),
    ("cafe-verde", dict(forma="Extrato de café verde", const="Ácido clorogênico", classe="extrato_vegetal", tab="Ácido clorogênico", unid="mg", ordem=412, slug="extrato-de-cafe-verde", vit=None)),
    ("laranja-moro", dict(forma="Extrato de laranja moro (Citrus sinensis (L.) Osbeck)", const="Antocianinas da laranja moro", classe="extrato_vegetal", tab="Antocianinas da laranja moro", unid="mg", ordem=413, slug="extrato-de-laranja-moro", vit=None)),
    ("quercetina", dict(forma="Quercetina", const="Quercetina", classe="outro", tab="Quercetina", unid="mg", ordem=414, slug="quercetina", vit=None)),
    ("colageno-ii", dict(forma="Colágeno de frango com colágeno tipo II não desnaturado", const="Colágeno tipo II não desnaturado", classe="outro", tab="Colágeno tipo II não desnaturado", unid="mg", ordem=415, slug="colageno-tipo-ii-nao-desnaturado", vit=None)),
    ("colageno-hidrolisado", dict(forma="Colágeno hidrolisado", const="Proteínas", classe="outro", tab="Proteínas", unid="g", ordem=30, slug="colageno-hidrolisado", vit=None)),
    ("tirosina", dict(forma="L-Tirosina", const="Tirosina", classe="aminoacido", tab="Tirosina", unid="mg", ordem=51, slug="l-tirosina", vit=None)),
    ("triptofano", dict(forma="L-Triptofano", const="Triptofano", classe="aminoacido", tab="Triptofano", unid="mg", ordem=52, slug="l-triptofano", vit=None)),
    ("metionina", dict(forma="L-Metionina", const="Metionina", classe="aminoacido", tab="Metionina", unid="mg", ordem=53, slug="l-metionina", vit=None)),
    ("cisteina", dict(forma="Cloridrato de L-cisteína", const="Cisteína", classe="aminoacido", tab="Cisteína", unid="mg", ordem=54, slug="cloridrato-de-l-cisteina", vit=None)),
    ("arginina", dict(forma="Cloridrato de L-arginina", const="Arginina", classe="aminoacido", tab="Arginina", unid="mg", ordem=55, slug="cloridrato-de-l-arginina", vit=None)),
    ("glutamina", dict(forma="L-Glutamina", const="Glutamina", classe="aminoacido", tab="Glutamina", unid="mg", ordem=56, slug="l-glutamina", vit=None)),
    ("aspartico", dict(forma="Ácido L-aspártico", const="Aspartato", classe="aminoacido", tab="Aspartato", unid="mg", ordem=57, slug="acido-l-aspartico", vit=None)),
    ("beta-alanina", dict(forma="Beta-alanina", const="Beta-alanina", classe="aminoacido", tab="Beta-alanina", unid="mg", ordem=58, slug="beta-alanina", vit=None)),
    ("oleo-peixe", dict(forma="Óleo de peixe", const="Lipídeos totais", classe="outro", tab="Gorduras totais", unid="g", ordem=40, slug="oleo-de-peixe-tg", vit=None)),
])
# excipientes: slug/nome canônico por palavra-chave (slugs existentes no banco ou criados pela migration)
EXC = OrderedDict([
    ("maltodextrina", dict(slug="maltodextrina", nome="Maltodextrina", categoria="outro")),
    ("dioxido de silicio", dict(slug="dioxido-de-silicio", nome="Dióxido de silício (INS 551)", categoria="outro")),
    ("acido citrico", dict(slug="acido-citrico", nome="Ácido cítrico (INS 330)", categoria="outro")),
    ("aromatizante identico ao natural de limao", dict(slug="aromatizante-identico-ao-natural-de-limao", nome="Aromatizante idêntico ao natural de limão", categoria="outro")),
    ("aroma", dict(slug=None, nome=None, categoria="outro")),
    ("sucralose", dict(slug="edulcorante-sucralose", nome="Edulcorante sucralose (INS 955)", categoria="outro")),
    ("corantes tartrazina", dict(slug="corante-verde", nome="Corantes tartrazina (INS 102) e azul brilhante FCF (INS 133)", categoria="outro")),
    ("corante tartrazina", dict(slug=None, nome=None, categoria="outro")),
    ("agua purificada", dict(slug="agua-purificada", nome="Água purificada", categoria="outro", novo=True)),
    ("glicerina", dict(slug="glicerina-vegetal", nome="Glicerina vegetal (INS 422)", categoria="outro", novo=True)),
    ("sorbitol", dict(slug="sorbitol-liquido", nome="Sorbitol líquido 70 % (INS 420)", categoria="outro", novo=True)),
    ("benzoato de sodio", dict(slug="benzoato-de-sodio", nome="Benzoato de sódio (INS 211)", categoria="outro", novo=True)),
    ("sorbato de potassio", dict(slug="sorbato-de-potassio", nome="Sorbato de potássio (INS 202)", categoria="outro", novo=True)),
    ("goma xantana", dict(slug="goma-xantana", nome="Goma xantana (INS 415)", categoria="outro", novo=True)),
])
NOVOS_INGREDIENTES = OrderedDict([  # inseridos pela migration (on conflict do nothing)
    ("agua-purificada", ("Água purificada", "outro", 860)),
    ("glicerina-vegetal", ("Glicerina vegetal (INS 422)", "outro", 870)),
    ("sorbitol-liquido", ("Sorbitol líquido 70 % (INS 420)", "outro", 880)),
    ("benzoato-de-sodio", ("Benzoato de sódio (INS 211)", "outro", 890)),
    ("sorbato-de-potassio", ("Sorbato de potássio (INS 202)", "outro", 900)),
    ("goma-xantana", ("Goma xantana (INS 415)", "outro", 910)),
])

def chave_insumo(ins):
    f = sem_acento(ins.get("forma_insumo") or ""); c = sem_acento(ins.get("constituinte_anexo_i") or "")
    txt = f + " " + c
    regras = [("bisglicinato de zinco", "zinco"), ("oxido de magnesio", "magnesio-oxido"), ("bisglicinato de magnesio", "magnesio-bisglicinato"), ("glicinato 30", "magnesio-bisglicinato"),
              ("cloreto de magnesio", "magnesio-cloreto"), ("cloridrato de piridoxina", "b6"), ("metilcobalamina", "b12-metil"), ("colecalciferol", "d3"),
              ("acido ascorbico", "vitc"), ("retinol", "vita"), ("retinila", "vita"), ("tocoferol", "vite"), ("pantotenato", "b5"), ("nicotinamida", "b3"), ("niacinamida", "b3"),
              ("tiamina", "b1"), ("riboflavina", "b2"), ("acido folico", "b9"), ("biotina", "biotina"), ("menaquinona", "k2"), ("picolinato de cromo", "cromo"),
              ("selenito", "selenio"), ("bisglicinato de cobre", "cobre"), ("bisglicinato ferroso", "ferro"), ("tetraborato", "boro"), ("iodeto", "iodo"), ("carbonato de calcio", "calcio"),
              ("teanina", "teanina"), ("tirosina", "tirosina"), ("triptofano", "triptofano"), ("glutamina", "glutamina"), ("aspartico", "aspartico"), ("metionina", "metionina"), ("cisteina", "cisteina"),
              ("carnitina", "carnitina"), ("taurina", "taurina"), ("beta-alanina", "beta-alanina"), ("arginina", "arginina"), ("creatina", "creatina"), ("cafeina anidra", "cafeina-anidra"), ("cafeina/1,3,7", "cafeina-anidra"),
              ("guarana", "guarana"), ("melatonina", "melatonina"), ("inositol", "inositol"), ("colina", "colina"), ("metilsulfonilmetano", "msm"), ("hialuron", "hialuronato"), ("orto-silicico", "silicio"),
              ("glucosamina", "glucosamina"), ("colageno tipo ii", "colageno-ii"), ("colageno hidrolisado", "colageno-hidrolisado"), ("cafe verde", "cafe-verde"), ("laranja moro", "laranja-moro"),
              ("oleo de peixe", "oleo-peixe")]
    for k, v in regras:
        if k in txt: return v
    return None

# ======================================================================================================
# 3. formatação pt-BR e arredondamento do gabarito
# ======================================================================================================
def _q(x, casas):
    return float(Decimal(str(x)).quantize(Decimal(1) if casas == 0 else Decimal("1." + "0" * casas), rounding=ROUND_HALF_UP))

def arred(x, unidade):
    """Anexo III da IN 75/2020 (paráfrase do gabarito): ≥10 inteiro; 1–<10 uma casa (se ,0 → inteiro); <1 g uma casa; <1 mg/µg duas casas (se 2ª casa 0 → uma)."""
    if x is None: return None
    u = "g" if str(unidade) in ("kcal", "kJ") else unidade_norm(unidade)
    ax = abs(x)
    if ax >= 10: return _q(x, 0)
    if ax >= 1: return _q(x, 1)
    if u == "g": return _q(x, 1)
    return _q(x, 2)

def br(x, max_casas=2):
    """número em pt-BR: milhar com ponto, decimal com vírgula, sem zeros à direita."""
    if x is None: return "—"
    if isinstance(x, str): return x
    s = f"{x:,.{max_casas}f}".replace(",", "X").replace(".", ",").replace("X", ".")
    if "," in s:
        s = s.rstrip("0").rstrip(",")
    return s

def pct_int(x):
    if x is None: return None
    return int(_q(x, 0))

# ======================================================================================================
# 4. modelo por produto
# ======================================================================================================
UNID_VD = {"mg": "mg", "µg": "µg", "µg RAE": "µg", "µg DFE": "µg", "mg NE": "mg", "g": "g"}

def limites_texto(ins):
    mn, mx = ins.get("minimo"), ins.get("maximo")
    return (None if mn in (None, "NE", "NA") else num(mn)), (None if mx in (None, "NE", "NA") else num(mx))

def normalizar(slug, d):
    grupo = GRUPO_DE[slug]
    gp = grupo_populacional(d)
    prod = OrderedDict()
    prod["slug"] = slug
    prod["nome"] = d.get("nome") or slug
    prod["grupo_trabalho"] = grupo
    prod["porcao_mg"] = num(d.get("porcao_mg"))
    prod["porcao_descricao"] = d.get("porcao_descricao")
    prod["formato"] = d.get("formato")
    prod["grupo_populacional"] = d.get("grupo_populacional")
    prod["grupos_vd"] = ["gestantes", "lactantes"] if len(gp) == 2 else ["adultos_19_anos_ou_mais"]
    tn = d.get("tabela_nutricional") or {}
    prod["porcoes_por_embalagem"] = str(d.get("porcoes_por_embalagem") or tn.get("porcoes_por_embalagem") or "PENDENTE")
    prod["porcao_tabela"] = tn.get("porcao") or d.get("porcao_descricao")
    prod["veredito"] = d.get("veredito")
    prod["pendencias"] = list(d.get("pendencias") or [])
    prod["alternativas"] = list(d.get("alternativas") or [])
    prod["mudancas"] = list(d.get("mudancas") or [])
    prod["removidos"] = list(d.get("removidos") or [])
    prod["cabe"] = d.get("cabe")
    insumos = []
    for ins in d["insumos"]:
        k = chave_insumo(ins)
        info = CAT.get(k) if k else None
        massa = num(ins.get("massa_insumo_mg"))
        a_mg = ativo_mg(ins, grupo)
        tipo, fator = teor_efetivo(ins)
        teor_laudo = num(ins.get("teor_pct"))
        teor_ef = (a_mg / massa * 100.0) if (massa and a_mg is not None) else None
        unid_ativo = (info or {}).get("unid") or unidade_norm(ins.get("unidade_ativo")) or "mg"
        # ativo na unidade declarada
        if k == "b9":  # ácido fólico: ativo_mg do G1 é mg "DFE"; declarado em µg DFE
            ativo_decl = num(ins.get("ativo_declarado")) if grupo == "G1" else (a_mg * 1000.0 if a_mg is not None else None)
            acido_folico_ug = massa * teor_laudo / 100.0 * 1000.0 if (massa and teor_laudo) else None
        else:
            ativo_decl = de_mg(a_mg, UNID_VD.get(unid_ativo, unid_ativo)) if a_mg is not None else None
            acido_folico_ug = None
        mn, mx = limites_texto(ins)
        r = OrderedDict()
        r["chave"] = k
        r["status"] = ins.get("status")
        r["retirado"] = retirado(ins)
        r["componente"] = eh_componente(ins)
        r["constituinte"] = (info or {}).get("const") or nome_constituinte(ins) or ins.get("constituinte_anexo_i")
        r["forma_anexo_i"] = (info or {}).get("forma") or ins.get("forma_insumo")
        r["forma_insumo"] = ins.get("forma_insumo")
        r["classe"] = (info or {}).get("classe")
        r["ingredient_slug"] = (info or {}).get("slug") or ins.get("ingredient_slug")
        r["massa_insumo_mg"] = massa
        r["teor_laudo_pct"] = teor_laudo
        r["potencia_ui_por_mg"] = fator if tipo != "teor" else None
        r["teor_efetivo_pct"] = round(teor_ef, 4) if teor_ef is not None else None
        r["fator_conversao"] = (round(teor_ef / teor_laudo, 4) if (teor_ef and teor_laudo and abs(teor_ef / teor_laudo - 1) > 0.006 and k != "b9") else None)
        r["teor_fonte"] = ins.get("teor_fonte")
        r["conta"] = ins.get("conta")
        r["ativo_mg"] = a_mg
        r["ativo"] = ativo_decl
        r["unidade_ativo"] = unid_ativo
        r["acido_folico_ug"] = acido_folico_ug
        r["minimo"] = mn; r["maximo"] = mx
        r["unidade_limite"] = unidade_norm(ins.get("unidade_limite")) if grupo == "G1" else None
        r["pct_do_maximo"] = num(ins.get("pct_do_maximo"))
        r["linha_anexo"] = ins.get("linha_anexo")
        r["laudo"] = ins.get("laudo") or {}
        r["motivo"] = ins.get("motivo")
        r["tab"] = (info or {}).get("tab"); r["ordem"] = (info or {}).get("ordem", 999); r["vit"] = (info or {}).get("vit")
        insumos.append(r)
    prod["insumos"] = insumos
    # excipientes
    excs = []
    for e in d.get("excipientes") or []:
        n0 = sem_acento(e.get("nome") or "")
        m = num(e.get("massa_mg"))
        x = OrderedDict(nome=e.get("nome"), ins=e.get("ins"), massa_mg=m, obs=e.get("obs") or e.get("observacao"), papel=e.get("papel"), laudo_lote=e.get("laudo_lote"))
        x["capsula"] = ("capsula" in n0 or "softgel" in n0)
        x["agregado"] = ("soma" in n0 and "q.s.p" in n0) or "matriz de goma" in n0
        x["slug"] = None; x["nome_catalogo"] = None
        for kw, inf in EXC.items():
            if kw in n0:
                x["slug"] = inf["slug"]; x["nome_catalogo"] = inf["nome"]; break
        excs.append(x)
    # Serena: "Glicerina vegetal ... e água purificada — q.s.p. 1 mL" (608,3 mg) desmembrada pela observação (POPS: glicerina 133,33 mg)
    if slug == "serena":
        novos = []
        for x in excs:
            n0 = sem_acento(x["nome"] or "")
            if "glicerina" in n0 and "agua" in n0 and x["massa_mg"]:
                gl = 133.33
                novos.append(OrderedDict(nome="Glicerina vegetal (glicerol, umectante/veículo)", ins="422", massa_mg=gl, obs="massa PROVISÓRIA (documento POPS: 133,33 mg; o memorial rev02 registra 647,45 mg de veículo sem desmembrar)", papel="veiculo", laudo_lote=None, capsula=False, agregado=False, slug="glicerina-vegetal", nome_catalogo="Glicerina vegetal (INS 422)"))
                novos.append(OrderedDict(nome="Água purificada (q.s.p. 1 mL)", ins=None, massa_mg=round(x["massa_mg"] - gl, 3), obs="q.s.p. calculada: 608,315 − 133,33 mg (densidade 1 g/mL assumida)", papel="veiculo", laudo_lote=None, capsula=False, agregado=False, slug="agua-purificada", nome_catalogo="Água purificada"))
            else:
                novos.append(x)
        excs = novos
    prod["excipientes"] = excs
    # somas
    soma_ins = sum(r["massa_insumo_mg"] for r in insumos if not r["retirado"] and not r["componente"] and r["massa_insumo_mg"] is not None)
    soma_exc = sum(x["massa_mg"] for x in excs if x["massa_mg"] is not None and not x["capsula"])
    prod["soma_insumos_mg"] = round(soma_ins, 4); prod["soma_excipientes_mg"] = round(soma_exc, 4); prod["soma_porcao_mg"] = round(soma_ins + soma_exc, 4)
    # tabela nutricional (linhas macro do memorial + linhas de constituintes regeneradas)
    prod["tabela"] = montar_tabela(slug, d, prod)
    prod["ingredients_list"] = d.get("ingredients_list")
    prod["warnings_memorial"] = d.get("warnings")
    prod["warnings"] = montar_advertencias(slug, d, prod)
    prod["metadata_extra"] = {k: d.get(k) for k in ("sql_sem_composicao", "sql_nao_gravar_nutritional_info", "sql_sem_composicao_motivo", "cafeina_total_pior_caso_mg", "solidos_por_ml_mg", "alternativa_porcao_12g", "laudos_encontrados_incompativeis", "_procedencia", "fonte_antes") if d.get(k) is not None}
    return prod

# ------------------------------------------------------------------------------------------------------
MACRO_ORDEM = ["Valor energético", "Carboidratos", "Açúcares totais", "Açúcares adicionados", "Polióis totais", "Sorbitol", "Maltitol", "Proteínas",
               "Gorduras totais", "Gorduras saturadas", "Gorduras trans", "Ômega 3", "EPA", "DHA", "Colesterol", "Fibras alimentares", "Sódio"]
MACRO_NIVEL = {"Açúcares totais": 1, "Açúcares adicionados": 2, "Polióis totais": 1, "Sorbitol": 2, "Maltitol": 2, "Gorduras saturadas": 1, "Gorduras trans": 1, "Ômega 3": 1, "EPA": 2, "DHA": 2, "Colesterol": 1}
MACRO_UNID = {"Valor energético": "kcal", "Carboidratos": "g", "Açúcares totais": "g", "Açúcares adicionados": "g", "Polióis totais": "g", "Sorbitol": "g", "Maltitol": "g", "Proteínas": "g",
              "Gorduras totais": "g", "Gorduras saturadas": "g", "Gorduras trans": "g", "Ômega 3": "mg", "EPA": "mg", "DHA": "mg", "Colesterol": "mg", "Fibras alimentares": "g", "Sódio": "mg"}
MACRO_VD_CHAVE = {"Valor energético": "valor_energetico_kcal", "Carboidratos": "carboidratos_g", "Açúcares adicionados": "acucares_adicionados_g", "Proteínas": "proteinas_g",
                  "Gorduras totais": "gorduras_totais_g", "Gorduras saturadas": "gorduras_saturadas_g", "Gorduras trans": "gorduras_trans_g", "Fibras alimentares": "fibras_alimentares_g",
                  "Sódio": "sodio_mg", "Ômega 3": "omega_3_mg", "Colesterol": "colesterol_mg"}
NAO_SIG_MACRO = {"Valor energético": 4, "Carboidratos": 0.5, "Açúcares adicionados": 0.5, "Proteínas": 0.5, "Gorduras totais": 0.5, "Gorduras saturadas": 0.1, "Gorduras trans": 0.1, "Sódio": 5, "Colesterol": 5}

def _linha(item, quantidade, unidade, vd, nivel=0, nota=None, pendente=False, provisorio=False):
    return OrderedDict(item=item, quantidade=quantidade, unidade=unidade, vd_pct=vd, nivel=nivel, nota=nota, pendente=pendente, provisorio=provisorio)

def montar_tabela(slug, d, prod):
    tn = d.get("tabela_nutricional") or {}
    grupos = prod["grupos_vd"]
    linhas_mem = {l.get("item"): l for l in tn.get("linhas", [])}
    # normaliza nomes de macro vindos do memorial
    alias = {"Polióis totais": "Polióis totais", "Ômega 3": "Ômega 3"}
    out = []
    kcal_exato = None
    for item in MACRO_ORDEM:
        l = linhas_mem.get(item)
        if l is None:
            continue
        q = l.get("quantidade_num", l.get("quantidade"))
        nota = l.get("nota")
        pend = (isinstance(q, str) and "PENDENTE" in q) or q is None
        prov = bool(nota and ("PROVIS" in nota.upper()))
        if item == "Valor energético":
            if pend:
                out.append(_linha(item, None, "kcal", None, 0, nota, True)); out[-1]["kj"] = None; continue
            if isinstance(q, str) and "kcal" in q:
                m = re.search(r"([\d\.,]+)\s*kcal", q); kcal = num(m.group(1))
            else:
                kcal = num(q)
            # valor exato reconstruído das massas (critério do próprio memorial); se não reproduzível, usa o declarado
            em = energia_modelo(slug, d, prod["grupo_trabalho"])
            kcal_exato = em["tot"] if (em and not em.get("pendente") and em.get("tot") is not None) else kcal
            prod["energia_modelo"] = {k: v for k, v in (em or {}).items() if k in ("fixos", "partes_fixas", "incluidos", "excluidos", "tot", "kcal_decl")}
            kj = kcal_exato * 4.184
            vd = {g: (0 if kcal_exato <= 4 else pct_int(kcal_exato / 2000 * 100)) for g in grupos}
            ln = _linha(item, arred(kcal_exato, "kcal"), "kcal", vd, 0, nota, False, prov)
            ln["kj"] = arred(kj, "kJ"); ln["kcal_exato"] = kcal_exato
            out.append(ln); continue
        qv = None if pend else num(q)
        unid = MACRO_UNID[item]
        if qv is None:
            out.append(_linha(item, None, unid, None, MACRO_NIVEL.get(item, 0), nota, True, prov)); continue
        chave = MACRO_VD_CHAVE.get(item)
        vd = None
        if chave:
            ref = VD["adultos_geral_anexo_ii_in75_base_2000kcal"].get(chave)
            if ref:
                qq = qv
                lim = NAO_SIG_MACRO.get(item)
                vv = 0 if (lim is not None and qq <= lim) else pct_int(qq / ref * 100)
                vd = {g: vv for g in grupos}
        out.append(_linha(item, arred(qv, unid), unid, vd, MACRO_NIVEL.get(item, 0), nota, False, prov))
    # aminoácidos declarados (sob Proteínas): do modelo
    ativos = [r for r in prod["insumos"] if not r["retirado"] and not r["componente"] and r["ativo"] is not None and r["tab"]]
    # somar por nome da tabela (cafeína anidra + guaraná; magnésio)
    por_tab = OrderedDict()
    for r in sorted(ativos, key=lambda r: r["ordem"]):
        if r["tab"] in ("Proteínas", "Gorduras totais"): continue
        por_tab.setdefault(r["tab"], []).append(r)
    def linha_const(tab, rs):
        r0 = rs[0]
        unid = r0["unidade_ativo"]
        # creatina: declara-se a massa nominal de creatina monoidratada (decisão do memorial; leitura A/B é do RT)
        total = sum((r["massa_insumo_mg"] if r["chave"] == "creatina" else r["ativo"]) for r in rs)
        q = arred(total, unid)
        vd = None
        k = sem_acento(tab).strip()
        chave = VD_CHAVE.get(k)
        nota = None
        if chave:
            vd = {}
            for g in grupos:
                ref = VD["grupos_populacionais_anexo_viii_in75"]["grupos"][g].get(chave)
                if ref is None: vd[g] = "PENDENTE"; nota = "VD de niacina para este grupo não extraído do Anexo VIII (pendência do gabarito)"
                else:
                    u_vd = "µg" if chave.endswith("_mcg") or chave.endswith("_mcg_rae") or chave.endswith("_mcg_dfe") else "mg"
                    qq = q if UNID_VD.get(unid, unid) == u_vd else (q / 1000.0 if u_vd == "mg" else q * 1000.0)
                    vd[g] = pct_int(qq / ref * 100)
        prov = False; motivos = []
        for r in rs:
            la = r["laudo"] or {}
            if la.get("vencido"):
                prov = True; motivos.append(f"teor de laudo VENCIDO (lote {la.get('lote')}, validade {la.get('validade')}) — pedir laudo novo e recalcular a massa pelo teor")
            elif "PROVIS" in (r["teor_fonte"] or "").upper() or "PROVIS" in (r["conta"] or "").upper():
                prov = True; motivos.append("teor PROVISÓRIO: " + (r["teor_fonte"] or r["conta"] or "")[:200])
            elif "PENDENTE" in (r["status"] or "").upper() and ("laudo" in (r["status"] or "").lower() or "identidade" in (r["status"] or "").lower()):
                prov = True; motivos.append(f"{r['status']}: {(r['motivo'] or '')[:200]}")
        if prov: nota = "; ".join(motivos)
        if tab == "Cafeína" and len(rs) > 1:
            nota = "PROVISÓRIO — cafeína anidra " + br(rs[0]["ativo"]) + " mg + guaraná em pó " + br(rs[1]["ativo"]) + " mg (metilxantinas totais do laudo, limite superior; o laudo de cafeína específica do guaraná fixa o valor final)"
            prov = True
        if tab == "Creatina":
            nota = "massa nominal de creatina monoidratada (lote 217949: teor 100,5 % b.s.; leitura A/B é decisão do RT)"
        return _linha(tab, q, unid, vd, 0, nota, False, prov)
    aminos = [(t, rs) for t, rs in por_tab.items() if rs[0]["ordem"] < 100]
    micro = [(t, rs) for t, rs in por_tab.items() if rs[0]["ordem"] >= 100]
    # inserir aminoácidos logo após "Proteínas"
    final = []
    for ln in out:
        final.append(ln)
        if ln["item"] == "Proteínas":
            for t, rs in sorted(aminos, key=lambda x: x[1][0]["ordem"]):
                la = linha_const(t, rs); la["nivel"] = 1; final.append(la)
    if not any(l["item"] == "Proteínas" for l in out):
        for t, rs in sorted(aminos, key=lambda x: x[1][0]["ordem"]):
            final.append(linha_const(t, rs))
    for t, rs in sorted(micro, key=lambda x: x[1][0]["ordem"]):
        final.append(linha_const(t, rs))
    return dict(porcoes_por_embalagem=prod["porcoes_por_embalagem"], porcao=prod["porcao_tabela"], grupos=grupos, linhas=final,
                rodape="*Percentual de valores diários fornecidos pela porção",
                regras="Arredondamento: Anexo III da IN 75/2020 (paráfrase do gabarito de 16/09/2026). %VD: Anexo VIII da IN 75/2020 para o grupo do rótulo (macronutrientes: Anexo II), calculado sobre a quantidade declarada. Quantidade não significativa (Anexo IV): %VD 0. Sem VDR: célula em branco (RDC 429/2020, art. 12, §1º). Energia: fatores do Anexo XXII da IN 75 (kcal/g); kJ = kcal × 4,184.")

# ------------------------------------------------------------------------------------------------------
ART14 = ["Este produto não é um medicamento.", "Não exceder a recomendação diária de consumo indicada na embalagem.", "Mantenha fora do alcance de crianças."]
ANEXO_VI = {
    "generica": "Este produto não deve ser consumido por gestantes, lactantes e crianças.",
    "melatonina": "Este produto não deve ser consumido por gestantes, lactantes, crianças e pessoas envolvidas em atividades que requerem atenção constante. Pessoas com enfermidades e/ou sob o uso de medicamentos, consulte seu médico.",
    "glucosamina": "Este produto não deve ser consumido por gestantes, lactantes e crianças. Pessoas com enfermidades e/ou sob o uso de medicamentos, consulte seu médico.",
    "beta-alanina": "Quantidade diária máxima de 2 g com doses divididas de, no máximo, 300 mg, com intervalo de duas horas entre as doses.",
}
# constituintes que exigem a advertência genérica do Anexo VI (linhas: Aminoácidos, Carnitina, Creatina, Taurina, Ácido clorogênico, Cafeína;
# Ácido hialurônico, Boro, Colágeno tipo II não desnaturado, Metilsulfonilmetano, Silício; Ácido orto-silícico…, Inositol; Antocianinas; Quercetina)
GENERICA = {"tirosina", "triptofano", "metionina", "cisteina", "arginina", "glutamina", "aspartico", "beta-alanina", "teanina", "carnitina", "creatina", "taurina",
            "cafe-verde", "cafeina-anidra", "guarana", "hialuronato", "boro", "colageno-ii", "msm", "silicio", "inositol", "laranja-moro", "quercetina"}
GENERICA_LINHA = {"tirosina": "Aminoácidos", "triptofano": "Aminoácidos", "metionina": "Aminoácidos", "cisteina": "Aminoácidos", "arginina": "Aminoácidos", "glutamina": "Aminoácidos",
                  "aspartico": "Aminoácidos", "beta-alanina": "Aminoácidos", "teanina": "Aminoácidos", "carnitina": "Carnitina", "creatina": "Creatina", "taurina": "Taurina",
                  "cafe-verde": "Ácido clorogênico", "cafeina-anidra": "Cafeína", "guarana": "Cafeína", "hialuronato": "Ácido hialurônico", "boro": "Boro", "colageno-ii": "Colágeno tipo II não desnaturado",
                  "msm": "Metilsulfonilmetano", "silicio": "Ácido orto-silícico estabilizado com maltodextrina / Silício", "inositol": "Inositol", "laranja-moro": "Antocianinas", "quercetina": "Quercetina"}

def montar_advertencias(slug, d, prod):
    chaves = {r["chave"] for r in prod["insumos"] if not r["retirado"]}
    frases = list(ART14)
    gp = prod["grupos_vd"]
    if gp == ["gestantes", "lactantes"]:
        publico = "Público indicado: gestantes e lactantes."
    else:
        publico = "Público indicado: adultos (19 anos ou mais)."
    # posologia (alínea b): extraída da porção
    porc = prod["porcao_descricao"] or ""
    frases.append(publico)
    frases.append(f"Consumir {prod['posologia']}." if prod.get("posologia") else None)
    frases = [f for f in frases if f]
    anexo = []
    if "melatonina" in chaves: anexo.append(("Melatonina", ANEXO_VI["melatonina"]))
    if "glucosamina" in chaves: anexo.append(("Glucosamina", ANEXO_VI["glucosamina"]))
    gen = sorted({GENERICA_LINHA[c] for c in chaves if c in GENERICA})
    if gen and "glucosamina" not in chaves:
        anexo.append(("; ".join(gen), ANEXO_VI["generica"]))
    if "beta-alanina" in chaves: anexo.append(("Beta-alanina", ANEXO_VI["beta-alanina"]))
    prod["advertencias_anexo_vi"] = anexo
    return frases + [a[1] for a in anexo]

def carregar_modelo():
    dados = carregar()
    dados = aplicar_overlay(copy.deepcopy(dados))
    modelo = OrderedDict()
    for slug in SLUGS:
        modelo[slug] = normalizar(slug, dados[slug])
    return modelo, dados

if __name__ == "__main__":
    modelo, dados = carregar_modelo()
    print(len(CORRECOES), "correções do overlay")
    for c in CORRECOES: print(f"- {c['slug']} · {c['insumo']} · {c['campo']}: {c['antes']} → {c['depois']}")
    for slug, p in modelo.items():
        print(f"\n== {slug}: soma {p['soma_porcao_mg']} / porção {p['porcao_mg']} | insumos {sum(1 for r in p['insumos'] if not r['retirado'])} | excipientes com massa {sum(1 for x in p['excipientes'] if x['massa_mg'] and not x['capsula'])}")
        for l in p["tabela"]["linhas"]:
            print("   ", "  " * l["nivel"], l["item"], br(l["quantidade"]) if l["quantidade"] is not None else "PENDENTE", l["unidade"], l.get("kj", ""), l["vd_pct"])
