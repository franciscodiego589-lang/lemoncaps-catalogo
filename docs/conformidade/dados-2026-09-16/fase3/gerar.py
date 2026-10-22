# -*- coding: utf-8 -*-
"""
Fase 3 — geradores a partir do modelo harmonizado (modelo.py):
  1. scratchpad/fase3/harmonizado/<slug>.json
  2. supabase/migrations/20260922000000_reformulacao_conforme_normas.sql  (EM DISCO, NÃO APLICAR)
  3. docs/conformidade/TABELAS-NUTRICIONAIS-2026-09-16.md
  4. scratchpad/fase3/_consolidado_dados.md (quadro dos 24, listas de laudos/insumos/decisões — insumo da consolidação)
  5. scratchpad/fase3/harmonizacao.md (parte gerada: correções do overlay + convenções)
Nada aqui grava no banco.
"""
import json, re, sys
from pathlib import Path
from collections import OrderedDict, defaultdict
sys.path.insert(0, str(Path(__file__).resolve().parent))
from modelo import (carregar_modelo, CORRECOES, CAT, NOVOS_INGREDIENTES, arred, br, pct_int, FONTE, DATA, F3, ART14, ANEXO_VI)
from verificar import SLUGS, G1, G2, G3, GRUPO_DE, sem_acento, unidade_norm, fmt

PROJ = Path("/Users/diegofrancisco/Downloads/lemoncaps-catalogo")
MIG = PROJ / "supabase" / "migrations" / "20260922000000_reformulacao_conforme_normas.sql"
DOC_TAB = PROJ / "docs" / "conformidade" / "TABELAS-NUTRICIONAIS-2026-09-16.md"
HARM_DIR = F3 / "harmonizado"; HARM_DIR.mkdir(exist_ok=True)

NOMES = {
    "multivitaminico": "Multivitamínico", "zma-zinco-magnesio-e-vitamina-d": "ZMA (Zinco, Magnésio e Vitamina B6)", "biotina-em-capsula": "Biotina em Cápsula",
    "dores-musculares": "Dores Musculares (Nuviart)", "focus-colina": "Focus Colina", "multi-vitta-gestante-e-lactante-em-capsula": "Multi Vitta — Gestante e Lactante em Cápsula",
    "melatonina-triptofanos-encapsulados": "Melatonina + Triptofanos (Encapsulados)", "serena": "Serena", "detox-matinal-lemon-shot-300g": "Detox Matinal (Lemon Shot) 300 g",
    "saude-intestinal": "Saúde Intestinal (Floravex)", "moro-slim": "Moro Slim", "pro-energy": "Pro Energy", "emagrecedor-em-capsula": "Emagrecedor em Cápsula",
    "slim-up-emagrecimento-em-gota": "Slim Up — Emagrecimento em Gota", "shot-colageno-300-gramas": "Shot + Colágeno 300 g", "omega-pro-tg": "Ômega Pró TG",
    "bella-gummy-biotina-em-gummy": "Bella Gummy (Biotina em Gummy)", "creatina-monohidratada-150g-soluvel": "Creatina Monoidratada 150 g Solúvel",
    "creatina-monohidratada-300g-soluvel": "Creatina Monoidratada 300 g Solúvel", "creatina-gummy-sabor-frutas-vermelhas": "Creatina Gummy sabor Frutas Vermelhas",
    "creatina-em-gummy-sabor-tutti-frutti": "Creatina em Gummy sabor Tutti-frutti", "melatonina-em-gummy-sabor-uva": "Melatonina em Gummy sabor Uva",
    "pre-treino-300-g": "Pré-treino 300 g", "pre-treino-creatina-sabor-limao-420g": "Pré-treino + Creatina sabor Limão 420 g (Césio 137)",
}
GUMMIES = {"bella-gummy-biotina-em-gummy", "melatonina-em-gummy-sabor-uva", "creatina-gummy-sabor-frutas-vermelhas", "creatina-em-gummy-sabor-tutti-frutti"}
SEM_COMPOSICAO = {"omega-pro-tg"}

def q(s):
    """literal SQL (aspas simples dobradas)."""
    if s is None: return "null"
    return "'" + str(s).replace("'", "''") + "'"

def _round_floats(o):
    if isinstance(o, float): return round(o, 4)
    if isinstance(o, dict): return OrderedDict((k, _round_floats(v)) for k, v in o.items())
    if isinstance(o, (list, tuple)): return [_round_floats(v) for v in o]
    return o

def jsonb(obj):
    return q(json.dumps(_round_floats(obj), ensure_ascii=False, separators=(",", ": "))) + "::jsonb"

# ------------------------------------------------------------------------------------------------------
# nomes das linhas de composição (quantity = massa do insumo pesado)
# ------------------------------------------------------------------------------------------------------
def ativo_txt(r):
    u = r["unidade_ativo"]
    if r["chave"] == "creatina":  # declara-se a massa nominal de creatina monoidratada
        return f"{br(arred(r['massa_insumo_mg'], u))} {u}"
    return f"{br(arred(r['ativo'], u))} {u}"

def nome_composicao(r):
    k = r["chave"]; info = CAT.get(k) or {}
    forma = info.get("forma") or r["forma_anexo_i"] or r["forma_insumo"]
    const = r["constituinte"] or ""
    cl = info.get("classe")
    if k == "d3":
        pot = r.get("potencia_ui_por_mg")
        return f"Colecalciferol (vitamina D3), pó {br(pot*1000,0)} UI/g — equivalente a {ativo_txt(r)} de vitamina D"
    if k == "vita":
        pot = r.get("potencia_ui_por_mg")
        return f"Acetato de retinol (vitamina A), pó {br(pot*1000,0)} UI/g — equivalente a {ativo_txt(r)} de vitamina A"
    if k == "b9":
        return f"Ácido fólico — {br(arred(r['acido_folico_ug'],'µg'))} µg de ácido fólico (equivalente a {ativo_txt(r)})"
    if k == "k2":
        return f"Menaquinona-7 (vitamina K2), pré-mistura {br(r['teor_laudo_pct'])} % — equivalente a {ativo_txt(r)} de vitamina K (massa PROVISÓRIA até laudo do lote)"
    if k == "vite":
        return f"Acetato de DL-alfa-tocoferol (vitamina E), pó {br(r['teor_laudo_pct'])} % — equivalente a {ativo_txt(r)} de α-tocoferol"
    if k == "b6":  return f"Cloridrato de piridoxina (vitamina B6) — equivalente a {ativo_txt(r)} de piridoxina"
    if k == "b1":  return f"Cloridrato de tiamina (vitamina B1) — equivalente a {ativo_txt(r)} de tiamina"
    if k == "b5":  return f"D-pantotenato de cálcio (vitamina B5) — equivalente a {ativo_txt(r)} de ácido pantotênico"
    if k == "b12-metil": return f"Metilcobalamina (vitamina B12) — equivalente a {ativo_txt(r)}"
    if k == "b3":  return f"Nicotinamida (vitamina B3) — equivalente a {ativo_txt(r)} de niacina"
    if k == "b2":  return "Riboflavina (vitamina B2)"
    if k == "vitc": return "Ácido ascórbico (vitamina C)"
    if k == "biotina": return "D-biotina (biotina)"
    if cl == "mineral" or k in ("silicio", "boro"):
        return f"{forma} (equivalente a {ativo_txt(r)} de {const.lower()})"
    if k == "arginina": return f"Cloridrato de L-arginina (equivalente a {ativo_txt(r)} de arginina)"
    if k == "cisteina": return f"Cloridrato de L-cisteína (equivalente a {ativo_txt(r)} de cisteína)"
    if k == "glucosamina": return f"Sulfato de glucosamina com cloreto de potássio (equivalente a {ativo_txt(r)} de glucosamina)"
    if k == "colina": return f"Bitartarato de colina (equivalente a {ativo_txt(r)} de colina)"
    if k == "hialuronato": return f"Hialuronato de sódio obtido pela fermentação de Streptococcus zooepidemicus (equivalente a {ativo_txt(r)} de ácido hialurônico)"
    if k == "cafe-verde": return f"Extrato de café verde ({br(r['teor_laudo_pct'])} % de ácido clorogênico — {ativo_txt(r)} por porção)"
    if k == "laranja-moro": return f"Extrato de laranja moro (Citrus sinensis (L.) Osbeck) ({br(r['teor_laudo_pct'])} % de antocianinas — {ativo_txt(r)} por porção)"
    if k == "guarana": return f"Guaraná em pó (Paullinia cupana) (metilxantinas {br(r['teor_laudo_pct'])} % — cafeína ≤ {ativo_txt(r)} por porção)"
    if k == "colageno-hidrolisado": return f"Colágeno hidrolisado (proteína {br(r['teor_laudo_pct'])} % — {br(arred(r['ativo_mg']/1000.0,'g'))} g de proteínas por porção, PROVISÓRIO)"
    if k == "colageno-ii": return "Colágeno de frango com colágeno tipo II não desnaturado"
    if k == "carnitina": return "L-carnitina"
    if k == "cafeina-anidra": return "Cafeína anidra"
    if k == "inositol": return "Mio-inositol"
    if k == "teanina": return "L-teanina de folhas de Camellia sinensis"
    if k == "creatina": return "Creatina monohidratada"
    if k == "oleo-peixe": return "Óleo de peixe"
    return forma

def quantidade_sql(massa_mg):
    """numeric(12,4): massas < 0,01 mg vão em mcg para não perder precisão."""
    if massa_mg < 0.01:
        return (round(massa_mg * 1000.0, 4), "mcg")
    return (round(massa_mg, 4), "mg")

def linhas_composicao(p):
    slug = p["slug"]
    rows = []
    if slug in SEM_COMPOSICAO: return rows
    n = 0
    for r in p["insumos"]:
        if r["retirado"] or r["componente"]: continue
        if r["massa_insumo_mg"] is None: continue
        qty, unit = quantidade_sql(r["massa_insumo_mg"])
        e_sal = bool(r.get("fator_conversao")) or r["classe"] == "mineral" or r["chave"] in ("silicio", "boro", "colina", "arginina", "cisteina", "glucosamina", "hialuronato", "d3", "vita", "k2", "b12-metil", "b9", "cafe-verde", "laranja-moro", "guarana", "colageno-hidrolisado")
        laudo = r["laudo"] or {}
        meta = OrderedDict([
            ("fonte", FONTE), ("papel", "constituinte"),
            ("constituinte", r["constituinte"]), ("forma_anexo_i", r["forma_anexo_i"]), ("forma_insumo", r["forma_insumo"]),
            ("massa_insumo_mg", r["massa_insumo_mg"]), ("teor_laudo_pct", r["teor_laudo_pct"]), ("potencia_ui_por_g", (r["potencia_ui_por_mg"] * 1000.0) if r.get("potencia_ui_por_mg") else None),
            ("fator_conversao", r["fator_conversao"]), ("teor_efetivo_pct", r["teor_efetivo_pct"]), ("teor_fonte", r["teor_fonte"]), ("conta", r["conta"]),
            ("ativo", r["ativo"]), ("unidade_ativo", r["unidade_ativo"]), ("ativo_mg", r["ativo_mg"]),
            ("minimo", r["minimo"]), ("maximo", r["maximo"]), ("unidade_limite", r["unidade_limite"] or unidade_norm(r["unidade_ativo"])), ("pct_do_maximo", r["pct_do_maximo"]),
            ("linha_anexo", r["linha_anexo"]), ("laudo_lote", laudo.get("lote")), ("laudo_validade", laudo.get("validade")), ("laudo_vencido", laudo.get("vencido")),
            ("status", r["status"]), ("e_sal", e_sal), ("elemento_equivalente", (f"{ativo_txt(r)} de {r['constituinte']}" if e_sal else None)),
        ])
        if r["chave"] == "b9": meta["acido_folico_ug"] = r["acido_folico_ug"]
        rows.append(OrderedDict(slug=slug, sort_order=n, ingredient_name=nome_composicao(r), quantity=qty, unit=unit, ingredient_slug=r["ingredient_slug"], metadata=meta)); n += 1
    if slug not in GUMMIES:
        for x in p["excipientes"]:
            if x["capsula"] or x["agregado"] or x["massa_mg"] is None: continue
            if not x["slug"]:
                raise SystemExit(f"{slug}: excipiente com massa e sem slug: {x['nome']}")
            qty, unit = quantidade_sql(x["massa_mg"])
            meta = OrderedDict([("fonte", FONTE), ("papel", x.get("papel") or ("veiculo" if "maltodextrina" in sem_acento(x["nome"]) or "agua" in sem_acento(x["nome"]) else "aditivo")),
                                ("ins", x.get("ins")), ("massa_mg", x["massa_mg"]), ("laudo_lote", x.get("laudo_lote")), ("observacao", x.get("obs")), ("nome_no_memorial", x["nome"])])
            rows.append(OrderedDict(slug=slug, sort_order=n, ingredient_name=x["nome_catalogo"], quantity=qty, unit=unit, ingredient_slug=x["slug"], metadata=meta)); n += 1
    return rows

# ------------------------------------------------------------------------------------------------------
# tabela nutricional em texto (formato canônico do gabarito)
# ------------------------------------------------------------------------------------------------------
GRUPO_ROTULO = {"adultos_19_anos_ou_mais": "adultos", "gestantes": "gestantes", "lactantes": "lactantes"}
def render_tabela(p):
    t = p["tabela"]; grupos = t["grupos"]
    L = ["INFORMAÇÃO NUTRICIONAL", f"Porções por embalagem: {t['porcoes_por_embalagem']}", f"Porção: {t['porcao']}"]
    if len(grupos) == 1:
        L.append("Quantidade por porção | %VD*")
    else:
        L.append("Quantidade por porção | %VD* gestantes | %VD* lactantes")
    for l in t["linhas"]:
        ind = "  " * l["nivel"]
        if l["quantidade"] is None:
            qtd = "PENDENTE"
        elif l["item"] == "Valor energético":
            qtd = f"{br(l['quantidade'])} kcal = {br(l['kj'])} kJ"
        else:
            qtd = f"{br(l['quantidade'])} {l['unidade']}"
        vd = l["vd_pct"]
        cols = []
        for g in grupos:
            v = vd.get(g) if isinstance(vd, dict) else None
            cols.append("" if v is None else (f"{v}%" if not isinstance(v, str) else v))
        L.append(f"{ind}{l['item']} {qtd} | " + " | ".join(cols))
    L.append(t["rodape"])
    return "\n".join(L)

def render_tabela_md(p):
    t = p["tabela"]; grupos = t["grupos"]
    head = "| | Quantidade por porção | " + " | ".join(("%VD*" if len(grupos) == 1 else f"%VD* {GRUPO_ROTULO[g]}") for g in grupos) + " |"
    sep = "|---|---|" + "---|" * len(grupos)
    L = ["**INFORMAÇÃO NUTRICIONAL**", "", f"Porções por embalagem: {t['porcoes_por_embalagem']}  ", f"Porção: {t['porcao']}", "", head, sep]
    for l in t["linhas"]:
        ind = "&nbsp;&nbsp;&nbsp;" * l["nivel"]
        if l["quantidade"] is None: qtd = "PENDENTE"
        elif l["item"] == "Valor energético": qtd = f"{br(l['quantidade'])} kcal = {br(l['kj'])} kJ"
        else: qtd = f"{br(l['quantidade'])} {l['unidade']}"
        vd = l["vd_pct"]
        cols = []
        for g in grupos:
            v = vd.get(g) if isinstance(vd, dict) else None
            cols.append("" if v is None else (f"{v}%" if not isinstance(v, str) else v))
        item = l["item"] + (" ⚠" if l.get("provisorio") else "")
        L.append(f"| {ind}{item} | {qtd} | " + " | ".join(cols) + " |")
    L.append("")
    L.append(t["rodape"])
    return "\n".join(L)

# ------------------------------------------------------------------------------------------------------
# advertências: ordem harmonizada — art. 14 (c, d, e) → público (a) → posologia/uso (b) → Anexo VI → alergênicos → conservação (II)
# ------------------------------------------------------------------------------------------------------
POSOLOGIA = {
    "multivitaminico": "Ingerir 2 cápsulas ao dia.", "zma-zinco-magnesio-e-vitamina-d": "Ingerir 2 cápsulas ao dia.", "biotina-em-capsula": "Ingerir 2 cápsulas ao dia.",
    "dores-musculares": "Ingerir 2 cápsulas ao dia.", "focus-colina": "Ingerir 2 cápsulas ao dia.", "multi-vitta-gestante-e-lactante-em-capsula": "Ingerir 2 cápsulas ao dia, sob orientação de médico ou nutricionista.",
    "melatonina-triptofanos-encapsulados": "Ingerir 2 cápsulas ao dia, preferencialmente à noite.", "serena": "Ingerir 20 gotas (1 mL) ao dia, preferencialmente à noite.",
    "detox-matinal-lemon-shot-300g": "Ingerir 1 dose (10 g) diluída em 200 mL de água, 1 vez ao dia.", "saude-intestinal": "Ingerir 2 cápsulas ao dia.", "moro-slim": "Ingerir 2 cápsulas ao dia.",
    "pro-energy": "Ingerir 2 cápsulas ao dia.", "emagrecedor-em-capsula": "Ingerir 2 cápsulas ao dia.", "slim-up-emagrecimento-em-gota": "Ingerir 30 gotas (1 mL) ao dia.",
    "shot-colageno-300-gramas": "Ingerir 1 dose (10 g) diluída em 200 mL de água, 1 vez ao dia.", "omega-pro-tg": "Ingerir 2 softgels ao dia.",
    "bella-gummy-biotina-em-gummy": "Ingerir 2 gomas ao dia.", "creatina-monohidratada-150g-soluvel": "Ingerir 1 dosador (4 g) diluído em água, 1 vez ao dia.",
    "creatina-monohidratada-300g-soluvel": "Ingerir 1 dosador (4 g) diluído em água, 1 vez ao dia.", "creatina-gummy-sabor-frutas-vermelhas": "Ingerir 2 gomas ao dia.",
    "creatina-em-gummy-sabor-tutti-frutti": "Ingerir 2 gomas ao dia.", "melatonina-em-gummy-sabor-uva": "Ingerir 2 gomas ao dia, preferencialmente à noite.",
    "pre-treino-300-g": "Ingerir 1 dosador (10 g) diluído em 200 mL de água, 1 vez ao dia.", "pre-treino-creatina-sabor-limao-420g": "Ingerir 1 dosador (14 g) diluído em 200 mL de água, 1 vez ao dia.",
}
CONSERVACAO_SOLIDO = "Conservar em local seco, fresco e arejado, ao abrigo da luz e do calor excessivo, em temperatura ambiente entre 15 °C e 30 °C. Após aberto, consumir em até 60 dias. Não consumir se o lacre de segurança estiver violado."
CONSERVACAO_LIQUIDO = "Conservar em local seco, fresco e ao abrigo da luz, em temperatura ambiente entre 15 °C e 30 °C. Após aberto, manter a embalagem bem fechada e consumir em até 60 dias. Não consumir se o lacre de segurança estiver violado."
ALERGENICOS = {
    "dores-musculares": "ALÉRGICOS: CONTÉM CRUSTÁCEOS (glucosamina). PODE CONTER LEITE E PEIXE (colágeno tipo II, conforme laudo do fornecedor). Lactose: declaração a confirmar com o RT.",
    "omega-pro-tg": "ALÉRGICOS: CONTÉM PEIXE.",
    "shot-colageno-300-gramas": "ALÉRGICOS: conforme a origem animal do colágeno do lote (peixe → 'Contém peixe') — PENDENTE.",
    "bella-gummy-biotina-em-gummy": "ALÉRGICOS: 'Contém peixe' se a gelatina for de peixe — espécie PENDENTE.",
    "melatonina-em-gummy-sabor-uva": "ALÉRGICOS: 'Contém peixe' se a gelatina for de peixe — espécie PENDENTE.",
    "creatina-gummy-sabor-frutas-vermelhas": "ALÉRGICOS: 'Contém peixe' se a gelatina for de peixe — espécie PENDENTE.",
    "creatina-em-gummy-sabor-tutti-frutti": "ALÉRGICOS: 'Contém peixe' se a gelatina for de peixe — espécie PENDENTE.",
    "detox-matinal-lemon-shot-300g": "Contém TARTRAZINA (INS 102) — se o corante se confirmar (identificação PENDENTE).",
    "shot-colageno-300-gramas_tartrazina": "Contém TARTRAZINA (INS 102) — se o corante se confirmar (identificação PENDENTE).",
    "pre-treino-creatina-sabor-limao-420g": "Contém TARTRAZINA (INS 102) — massa por porção PENDENTE.",
}
POLIOIS = "O consumo excessivo pode ter efeito laxativo (contém polióis). [base legal a confirmar pelo RT]"
CAFEINA_FRASE = {"pre-treino-300-g": "Contém cafeína (175 mg por porção).", "pre-treino-creatina-sabor-limao-420g": "Contém cafeína (163 mg por porção, incluindo a do guaraná — PROVISÓRIO até laudo de cafeína do guaraná).",
                 "pro-energy": "Contém cafeína (160 mg por porção, incluindo a do guaraná — PROVISÓRIO até laudo de cafeína do guaraná)."}

def advertencias(p):
    slug = p["slug"]
    frases = list(ART14)
    frases.append("Público indicado: gestantes e lactantes." if p["grupos_vd"] == ["gestantes", "lactantes"] else "Público indicado: adultos (19 anos ou mais).")
    frases.append(POSOLOGIA[slug])
    for rot, fr in p["advertencias_anexo_vi"]:
        frases.append(fr)
    if slug in CAFEINA_FRASE: frases.append(CAFEINA_FRASE[slug])
    if slug in GUMMIES or slug == "slim-up-emagrecimento-em-gota": frases.append(POLIOIS)
    if slug in ALERGENICOS: frases.append(ALERGENICOS[slug])
    if slug == "shot-colageno-300-gramas": frases.append(ALERGENICOS["shot-colageno-300-gramas_tartrazina"])
    liquido = slug in ("serena", "slim-up-emagrecimento-em-gota")
    frases.append(CONSERVACAO_LIQUIDO if liquido else CONSERVACAO_SOLIDO)
    return frases

# ------------------------------------------------------------------------------------------------------
def gerar():
    modelo, dados = carregar_modelo()
    comp = OrderedDict((s, linhas_composicao(p)) for s, p in modelo.items())
    for s, p in modelo.items():
        p["nome"] = NOMES[s]
        p["composicao"] = comp[s]
        p["nutritional_info_texto"] = render_tabela(p)
        p["warnings"] = advertencias(p)
        p["warnings_texto"] = "\n".join(p["warnings"])
    # 1. JSONs harmonizados
    for s, p in modelo.items():
        (HARM_DIR / f"{s}.json").write_text(json.dumps(p, ensure_ascii=False, indent=1, default=str), encoding="utf-8")
    # 2. migration
    MIG.write_text(gerar_migration(modelo, comp), encoding="utf-8")
    # 3. tabelas
    DOC_TAB.write_text(gerar_doc_tabelas(modelo), encoding="utf-8")
    # 4. dados do consolidado
    (F3 / "_consolidado_dados.md").write_text(gerar_dados_consolidado(modelo, comp), encoding="utf-8")
    # 5. harmonização (parte gerada)
    (F3 / "_harmonizacao_gerada.md").write_text(gerar_harmonizacao(modelo, comp), encoding="utf-8")
    tot = sum(len(v) for v in comp.values())
    print(f"migration: {MIG} — {sum(1 for v in comp.values() if v)} fórmulas com composição nova, {tot} linhas; insumos novos: {len(NOVOS_INGREDIENTES)}")
    for s, v in comp.items(): print(f"  {s}: {len(v)} linhas")
    return modelo, comp

# ------------------------------------------------------------------------------------------------------
def veredito_curto(v):
    v0 = sem_acento(v or "")
    if v0.startswith("nao resolvido"): return "NÃO RESOLVIDO"
    if "nao resolvido" in v0: return "CONFORME NOS LIMITES · NÃO RESOLVIDO NA PORÇÃO"
    if v0.startswith("conforme condicionado"): return "CONFORME CONDICIONADO"
    if v0.startswith("conforme"): return "CONFORME (condicionado a validação)"
    return v

def gerar_migration(modelo, comp):
    slugs23 = [s for s in SLUGS if s not in SEM_COMPOSICAO]
    total = sum(len(comp[s]) for s in slugs23)
    L = []
    A = L.append
    A("-- =====================================================================================")
    A("-- LEMON CAPS - CATALOGO PUBLICO")
    A("-- 20260922000000_reformulacao_conforme_normas.sql")
    A("--")
    A("-- Grava a FORMULACAO PROPOSTA pela reformulacao regulatoria de 16/09/2026 nos 24 produtos ativos do")
    A("-- catalogo, casando por SLUG (nunca por UUID).")
    A("--")
    A("-- CONTEXTO")
    A("-- Ordem do dono, 15/09/2026: \"altere os insumos para os permitidos, refaca as formulacoes para todas")
    A("-- estarem dentro das normas, pesquise os laudos antes\". Em 16/09/2026 tres frentes reformularam os 24")
    A("-- produtos (memorial por produto em docs/conformidade/reformulacao/<slug>.md) e a fase 3 verificou,")
    A("-- harmonizou e consolidou (docs/conformidade/REFORMULACAO-CONSOLIDADA-2026-09-16.md; tabelas em")
    A("-- docs/conformidade/TABELAS-NUTRICIONAIS-2026-09-16.md).")
    A("--")
    A("-- FONTES (todas em disco, lidas em 16/09/2026)")
    A("--   docs/conformidade/IN28-2018-ANEXO-I-LITERAL.md            constituintes e formas autorizadas (nome exato)")
    A("--   docs/conformidade/IN28-2018-ANEXO-III-LITERAL.md          minimos por grupo populacional")
    A("--   docs/conformidade/IN28-2018-ANEXOS-IV-V-VI-LITERAL.md     maximos, alegacoes e advertencias obrigatorias")
    A("--   docs/conformidade/LAUDOS-INVENTARIO-2026-09-16.md         laudos de insumo (lote, validade, teor)")
    A("--   docs/conformidade/MEMORIAIS-INVENTARIO-2026-09-16.md      o que a fabrica pesa hoje")
    A("--   docs/conformidade/PADRAO-ANVISA-TABELA-NUTRICIONAL-2026-09-16.md  gabarito RDC 429/2020 + IN 75/2020")
    A("--   docs/conformidade/reformulacao/<slug>.md                  memorial de reformulacao de cada produto")
    A("--")
    A("-- *****************************************************************************************")
    A("-- ADVERTENCIA: ESTA MIGRATION DESCREVE A FORMULACAO PROPOSTA. SO DEVE SER APLICADA QUANDO A")
    A("-- FABRICA CONFIRMAR QUE PASSA A PRODUZIR ASSIM (MEMORIAL REVISADO + LAUDOS + ARTE NOVA),")
    A("-- PORQUE O CATALOGO B2B DESCREVE O PRODUTO QUE SE VENDE.")
    A("-- Ela substitui as composicoes ativas atuais (sejam as do cadastro-teto ou as da")
    A("-- 20260920000000_composicoes_conforme_rotulo.sql, se esta tiver sido aplicada) e deixa os selos de")
    A("-- conformidade (20260921000000 / 20260921100000) sem lastro: o bloco final zera")
    A("-- compliance_verified_at das 24 formulas. O selo volta por migration propria, com auditoria")
    A("-- contra a formula efetivamente produzida.")
    A("-- *****************************************************************************************")
    A("--")
    A("-- OS 24 PRODUTOS E O VEREDITO ESPERADO DEPOIS DA REFORMULACAO (linhas de composicao gravadas):")
    for s in SLUGS:
        p = modelo[s]
        A(f"--   {s:44s} {len(comp[s]):2d} linha(s)  {veredito_curto(p['veredito'])}")
    A("--   (omega-pro-tg: NAO RESOLVIDO - sem laudo do oleo, memorial nem rotulo; a composicao atual NAO e tocada;")
    A("--    so entram as advertencias do art. 14 da RDC 243/2018, o alergenico peixe, a porcao e a tabela PROVISORIA em metadata.)")
    A("--")
    A("-- CONVENCOES DAS LINHAS DE COMPOSICAO (harmonizadas entre as tres frentes na fase 3):")
    A("--   quantity  = massa do INSUMO pesado por porcao (sal/forma comercial), como o dono decidiu em")
    A("--               20260915140000 (\"a quantidade exibida continua sendo a massa do sal\"); massas < 0,01 mg vao em mcg.")
    A("--   ingredient_name = forma do Anexo I + equivalencia em ativo (\"Bisglicinato de zinco (equivalente a 15 mg de zinco)\").")
    A("--   metadata  = procedencia completa: fonte, constituinte, forma_anexo_i, massa_insumo_mg, teor_laudo_pct,")
    A("--               fator_conversao (sal->base ou potencia), teor_efetivo_pct, ativo, minimo, maximo, pct_do_maximo,")
    A("--               linha_anexo, laudo_lote, laudo_validade, laudo_vencido, status, e_sal, elemento_equivalente.")
    A("--   excipientes com massa definida no memorial entram como linhas (papel veiculo/aditivo); capsula nao entra")
    A("--   (fora da porcao); nas 4 gomas a base (matriz) nao entra porque as massas individuais estao PENDENTES ou nao")
    A("--   cabem na porcao declarada - ficam so na lista de ingredientes.")
    A("--   nutritional_info e TEXT no banco (conferido ao vivo em 16/09/2026): recebe a tabela em texto no formato")
    A("--   do gabarito; a tabela estruturada vai em formulas.metadata->'reformulacao_2026_09_16'->'tabela_nutricional'.")
    A("--")
    A("-- O QUE FAZ, NESTA ORDEM:")
    A("--   0. Guarda: aborta se nao encontrar exatamente 24 formulas ATIVAS com esses slugs.")
    A("--   1. Backup em private.formula_compositions_backup_20260922 (linhas ativas das 24) e")
    A("--      private.formulas_backup_20260922 (campos de formulas que serao alterados).")
    A(f"--   2. Insumos novos em public.ingredients ({len(NOVOS_INGREDIENTES)}), on conflict (slug) do nothing.")
    A("--   3. Exclusao LOGICA das composicoes ativas das 23 formulas reformuladas (nao do Omega).")
    A(f"--   4. Insercao das {total} linhas harmonizadas, ingredient_id resolvido por slug.")
    A("--   5. Update de formulas (ingredients_list, warnings, nutritional_info, serving_description, metadata) nas 24.")
    A("--   6. Autocheck: contagem por formula, nenhuma linha antiga sobrevivente, nenhum ingredient_id nulo,")
    A(f"--      total = {total} nas 23; Omega intocado.")
    A("--   7. Zera compliance_verified_at / compliance_norms / compliance_source das 24 (selo a reavaliar).")
    A("--")
    A("-- IDEMPOTENTE: re-execucao nao duplica (exclusao so de linhas sem metadata.fonte = 'reformulacao_2026-09-16';")
    A("-- insercao so em formula sem linha ativa dessa fonte; backups pulam ids ja copiados; updates por valor).")
    A("--")
    A("-- REVERSAO (manual): reativar as linhas de private.formula_compositions_backup_20260922 pelo id e desativar as")
    A("-- linhas com metadata->>'fonte' = 'reformulacao_2026-09-16'; restaurar os campos de formulas pelo backup.")
    A("--")
    A("-- APLICACAO: arquivo criado em disco em 16/09/2026; NAO aplicado em nenhum banco. Sintaxe conferida com pglast")
    A("-- (libpg_query) sem execucao.")
    A("-- =====================================================================================")
    A("")
    lista = ",\n".join(f"          {q(s)}" for s in SLUGS)
    A("-- -------------------------------------------------------------------------------------")
    A("-- 0. GUARDA - as 24 formulas precisam existir, ativas, pelo slug")
    A("-- -------------------------------------------------------------------------------------")
    A("do $$")
    A("declare")
    A("    v_encontradas integer;")
    A("begin")
    A("    select count(*) into v_encontradas")
    A("    from public.formulas")
    A("    where deleted_at is null and active and slug in (")
    A(lista)
    A("      );")
    A("    if v_encontradas <> 24 then")
    A("        raise exception 'esperado 24 formulas ativas com os slugs desta migration, encontrado %', v_encontradas;")
    A("    end if;")
    A("end $$;")
    A("")
    A("-- -------------------------------------------------------------------------------------")
    A("-- 1. BACKUP (schema private, fora da API) - mesmo estilo da 20260920000000")
    A("-- -------------------------------------------------------------------------------------")
    A("create table if not exists private.formula_compositions_backup_20260922 as")
    A("select fc.*, now() as backed_up_at from public.formula_compositions fc where false;")
    A("comment on table private.formula_compositions_backup_20260922 is 'Copia das linhas ativas de public.formula_compositions das 24 formulas antes da migration 20260922000000_reformulacao_conforme_normas.sql. Serve para reverter. Nao exposta pela API.';")
    A("")
    A("insert into private.formula_compositions_backup_20260922")
    A("select fc.*, now()")
    A("from public.formula_compositions fc")
    A("join public.formulas f on f.id = fc.formula_id")
    A("where f.deleted_at is null and fc.deleted_at is null")
    A("  and f.slug in (")
    A(lista)
    A("      )")
    A(f"  and coalesce(fc.metadata->>'fonte', '') <> {q(FONTE)}")
    A("  and not exists (select 1 from private.formula_compositions_backup_20260922 b where b.id = fc.id);")
    A("")
    A("create table if not exists private.formulas_backup_20260922 as")
    A("select f.id, f.slug, f.ingredients_list, f.warnings, f.nutritional_info, f.serving_description, f.metadata,")
    A("       f.compliance_verified_at, f.compliance_norms, f.compliance_source, now() as backed_up_at")
    A("from public.formulas f where false;")
    A("comment on table private.formulas_backup_20260922 is 'Copia dos campos de public.formulas alterados pela migration 20260922000000 (dizeres, tabela nutricional, porcao, metadata e selo de conformidade) das 24 formulas, antes da alteracao.';")
    A("")
    A("insert into private.formulas_backup_20260922")
    A("select f.id, f.slug, f.ingredients_list, f.warnings, f.nutritional_info, f.serving_description, f.metadata,")
    A("       f.compliance_verified_at, f.compliance_norms, f.compliance_source, now()")
    A("from public.formulas f")
    A("where f.deleted_at is null and f.slug in (")
    A(lista)
    A("      )")
    A("  and not exists (select 1 from private.formulas_backup_20260922 b where b.id = f.id);")
    A("")
    A("-- -------------------------------------------------------------------------------------")
    A(f"-- 2. INSUMOS NOVOS em public.ingredients ({len(NOVOS_INGREDIENTES)}) - conferido contra os 70 ativos do banco em 16/09/2026")
    A("-- -------------------------------------------------------------------------------------")
    A("-- Todos sao excipientes de suplemento liquido (Serena e Slim Up), que hoje nao tem ficha por insumo.")
    A("-- Nomes e INS como na lista de ingredientes; categoria 'outro'; sort_order continua a sequencia (ultimo usado: 850).")
    vals = []
    for slug, (nome, cat, ordem) in NOVOS_INGREDIENTES.items():
        vals.append(f"    ({q(slug)}, {q(nome)}, ARRAY[{q(nome)}]::text[], {q(cat)}::public.ingredient_category, {ordem}, " + jsonb({"fonte": FONTE, "criado_por": "20260922000000_reformulacao_conforme_normas.sql"}) + ")")
    A("insert into public.ingredients (slug, name, synonyms, category, sort_order, metadata) values")
    A(",\n".join(vals))
    A("on conflict (slug) do nothing;")
    A("")
    lista23 = ",\n".join(f"          {q(s)}" for s in slugs23)
    A("-- -------------------------------------------------------------------------------------")
    A("-- 3. EXCLUSAO LOGICA das composicoes ativas atuais das 23 formulas reformuladas (Omega fica)")
    A("-- -------------------------------------------------------------------------------------")
    A("update public.formula_compositions fc")
    A("set active = false, deleted_at = now(), reason_deleted = 'reformulação regulatória 2026-09-16'")
    A("from public.formulas f")
    A("where f.id = fc.formula_id and f.deleted_at is null")
    A("  and f.slug in (")
    A(lista23)
    A("      )")
    A("  and fc.deleted_at is null")
    A(f"  and coalesce(fc.metadata->>'fonte', '') <> {q(FONTE)};")
    A("")
    A("-- -------------------------------------------------------------------------------------")
    A(f"-- 4. INSERCAO das {total} linhas harmonizadas (ingredient_id por slug; so em formula sem linha desta fonte)")
    A("-- -------------------------------------------------------------------------------------")
    A("insert into public.formula_compositions (formula_id, ingredient_name, quantity, unit, sort_order, ingredient_id, metadata)")
    A("select f.id, v.ingredient_name, v.quantity, v.unit::public.composition_unit, v.sort_order, i.id, v.metadata::jsonb")
    A("from (values")
    blocos = []
    for s in slugs23:
        p = modelo[s]
        blocos.append(f"    -- {s} ({len(comp[s])} linha(s)) - {veredito_curto(p['veredito'])}")
        for r in comp[s]:
            blocos.append(f"    ({q(r['slug'])}, {r['sort_order']}, {q(r['ingredient_name'])}, {r['quantity']}, {q(r['unit'])}, {q(r['ingredient_slug'])}, {q(json.dumps(_round_floats(r['metadata']), ensure_ascii=False, separators=(',', ': ')))}),")
    blocos[-1] = blocos[-1].rstrip(",")
    L.extend(blocos)
    A(") as v(slug, sort_order, ingredient_name, quantity, unit, ingredient_slug, metadata)")
    A("join public.formulas f on f.slug = v.slug and f.deleted_at is null")
    A("join public.ingredients i on i.slug = v.ingredient_slug and i.deleted_at is null")
    A("where not exists (")
    A("    select 1 from public.formula_compositions x")
    A(f"    where x.formula_id = f.id and x.deleted_at is null and x.metadata->>'fonte' = {q(FONTE)}")
    A(");")
    A("")
    A("-- -------------------------------------------------------------------------------------")
    A("-- 5. DIZERES, TABELA NUTRICIONAL (texto no formato do gabarito) E PORCAO - 24 formulas")
    A("--    metadata->'reformulacao_2026_09_16' = {data, veredito, porcao_mg, soma_porcao_mg, cabe, tabela_nutricional, pendencias, ...}")
    A("-- -------------------------------------------------------------------------------------")
    for s in SLUGS:
        p = modelo[s]
        meta = OrderedDict([
            ("data", DATA), ("fonte", "fase 3 - consolidacao de docs/conformidade/reformulacao/" + s + ".md"), ("veredito", p["veredito"]),
            ("grupo_populacional", p["grupo_populacional"]), ("porcao_mg", p["porcao_mg"]), ("porcao_descricao", p["porcao_descricao"]), ("formato", p["formato"]),
            ("soma_porcao_mg", p["soma_porcao_mg"]), ("cabe", p["cabe"]), ("linhas_composicao", len(comp[s])),
            ("tabela_nutricional", OrderedDict([("porcoes_por_embalagem", p["tabela"]["porcoes_por_embalagem"]), ("porcao", p["tabela"]["porcao"]), ("grupos_vd", p["tabela"]["grupos"]),
                                                  ("linhas", p["tabela"]["linhas"]), ("rodape", p["tabela"]["rodape"]), ("regras", p["tabela"]["regras"]),
                                                  ("provisoria", s == "omega-pro-tg" or any(l.get("provisorio") or l.get("pendente") for l in p["tabela"]["linhas"]))])),
            ("advertencias_anexo_vi", p["advertencias_anexo_vi"]), ("pendencias", p["pendencias"]), ("alternativas", p["alternativas"]), ("mudancas", p["mudancas"]), ("removidos", p["removidos"]),
        ])
        for k, v in p.get("metadata_extra", {}).items(): meta[k] = v
        A(f"-- {s}: {veredito_curto(p['veredito'])}")
        A("update public.formulas f set")
        if s in SEM_COMPOSICAO:
            A("    -- Omega: ingredients_list e nutritional_info NAO sao gravados (sem fonte); a tabela PROVISORIA fica em metadata")
            A("    ingredients_list    = f.ingredients_list,")
            A("    nutritional_info    = f.nutritional_info,")
        else:
            A(f"    ingredients_list    = {q(p['ingredients_list'])},")
            A(f"    nutritional_info    = {q(p['nutritional_info_texto'])},")
        A(f"    warnings            = {q(p['warnings_texto'])},")
        A(f"    serving_description = {q(p['tabela']['porcao'])},")
        A(f"    metadata            = coalesce(f.metadata, '{{}}'::jsonb) - 'tabela_nutricional_2026_09_16' - 'tabela_nutricional_20260916' - 'reformulacao' || jsonb_build_object('reformulacao_2026_09_16', {jsonb(meta)})")
        A(f"where f.slug = {q(s)} and f.deleted_at is null;")
        A("")
    A("-- -------------------------------------------------------------------------------------")
    A("-- 6. AUTOCHECK - aborta a transacao inteira se o estado final nao bater")
    A("-- -------------------------------------------------------------------------------------")
    A("do $$")
    A("declare")
    A("    v_encontrado  integer;")
    A("    v_sem_fonte   integer;")
    A("    v_sem_insumo  integer;")
    A("    v_total       integer;")
    A("    v_omega       integer;")
    A("    r             record;")
    A("begin")
    A("    for r in")
    A("        select * from (values")
    A(",\n".join(f"            ({q(s)}, {len(comp[s])})" for s in slugs23))
    A("        ) as e(slug, linhas)")
    A("    loop")
    A("        select count(*) into v_encontrado")
    A("        from public.formula_compositions fc")
    A("        join public.formulas f on f.id = fc.formula_id")
    A("        where f.slug = r.slug and f.deleted_at is null and fc.deleted_at is null and fc.active;")
    A("        if v_encontrado <> r.linhas then")
    A("            raise exception 'formula % deveria ter % linhas ativas de composicao depois da reformulacao, encontrado %', r.slug, r.linhas, v_encontrado;")
    A("        end if;")
    A("    end loop;")
    A("")
    A("    select")
    A(f"        count(*) filter (where coalesce(fc.metadata->>'fonte', '') <> {q(FONTE)}),")
    A("        count(*) filter (where fc.ingredient_id is null),")
    A("        count(*)")
    A("    into v_sem_fonte, v_sem_insumo, v_total")
    A("    from public.formula_compositions fc")
    A("    join public.formulas f on f.id = fc.formula_id")
    A("    where f.deleted_at is null and fc.deleted_at is null and fc.active")
    A("      and f.slug in (")
    A(lista23)
    A("      );")
    A("    if v_sem_fonte <> 0 then")
    A("        raise exception '% linha(s) ativa(s) das 23 formulas ainda sem metadata.fonte = reformulacao_2026-09-16 (linha antiga sobreviveu)', v_sem_fonte;")
    A("    end if;")
    A("    if v_sem_insumo <> 0 then")
    A("        raise exception '% linha(s) nova(s) sem ingredient_id (slug de insumo nao resolveu em public.ingredients)', v_sem_insumo;")
    A("    end if;")
    A(f"    if v_total <> {total} then")
    A(f"        raise exception 'esperado {total} linhas ativas de composicao nas 23 formulas reformuladas, encontrado %', v_total;")
    A("    end if;")
    A("")
    A("    -- Omega Pro TG: composicao intocada (nenhuma linha desta fonte, nenhuma linha excluida por esta migration)")
    A("    select count(*) into v_omega")
    A("    from public.formula_compositions fc")
    A("    join public.formulas f on f.id = fc.formula_id")
    A(f"    where f.slug = 'omega-pro-tg' and f.deleted_at is null and (fc.metadata->>'fonte' = {q(FONTE)} or fc.reason_deleted = 'reformulação regulatória 2026-09-16');")
    A("    if v_omega <> 0 then")
    A("        raise exception 'omega-pro-tg nao deveria ter composicao tocada por esta migration, encontrado % linha(s)', v_omega;")
    A("    end if;")
    A("")
    A("    select count(*) into v_encontrado from public.formulas f")
    A(f"    where f.deleted_at is null and f.slug in (\n{lista}\n      ) and coalesce(f.metadata->'reformulacao_2026_09_16'->>'data', '') = {q(DATA)};")
    A("    if v_encontrado <> 24 then")
    A("        raise exception 'esperado 24 formulas com metadata.reformulacao_2026_09_16.data = 2026-09-16, encontrado %', v_encontrado;")
    A("    end if;")
    A("end $$;")
    A("")
    A("-- -------------------------------------------------------------------------------------")
    A("-- 7. SELO DE CONFORMIDADE - zera nas 24 (a formula gravada e a PROPOSTA; o selo volta por migration propria,")
    A("--    com auditoria contra a formula efetivamente produzida, laudos e arte)")
    A("-- -------------------------------------------------------------------------------------")
    A("update public.formulas f set")
    A("    compliance_verified_at = null,")
    A("    compliance_norms       = null,")
    A("    compliance_source      = null")
    A("where f.deleted_at is null")
    A("  and f.slug in (")
    A(lista)
    A("      )")
    A("  and (f.compliance_verified_at is not null or f.compliance_norms is not null or f.compliance_source is not null);")
    A("")
    A("do $$")
    A("declare v_count integer;")
    A("begin")
    A("    select count(*) into v_count from public.formulas f")
    A(f"    where f.deleted_at is null and f.compliance_verified_at is not null and f.slug in (\n{lista}\n      );")
    A("    if v_count <> 0 then")
    A("        raise exception 'esperado 0 formulas com compliance_verified_at preenchido apos a reformulacao, encontrado %', v_count;")
    A("    end if;")
    A("end $$;")
    A("")
    return "\n".join(L)

# ------------------------------------------------------------------------------------------------------
def gerar_doc_tabelas(modelo):
    L = []
    A = L.append
    A("# Tabelas de Informação Nutricional — reformulação de 16/09/2026 (24 produtos)")
    A("")
    A("Documento gerado na fase 3 (consolidação) a partir dos memoriais de reformulação de `docs/conformidade/reformulacao/<slug>.md`, "
      "depois da verificação determinística e da harmonização entre as três frentes (ver `REFORMULACAO-CONSOLIDADA-2026-09-16.md`). "
      "Cada tabela está no padrão vigente do gabarito `PADRAO-ANVISA-TABELA-NUTRICIONAL-2026-09-16.md` (RDC 429/2020 e IN 75/2020, lidas em 16/09/2026) "
      "e é um bloco pronto para a arte: título, porções por embalagem, porção, coluna de quantidade por porção e coluna %VD*, itens na ordem do Anexo XI da IN 75, rodapé literal.")
    A("")
    A("**Regras aplicadas em todas as 24 tabelas** (as mesmas para os três grupos de trabalho):")
    A("")
    A("- Arredondamento das quantidades: Anexo III da IN 75/2020 (paráfrase do gabarito) — valores ≥ 10 em inteiro; de 1 a 10 com uma casa decimal; abaixo de 1 g com uma casa; abaixo de 1 mg/µg com duas casas.")
    A("- %VD: Anexo VIII da IN 75/2020 para o grupo populacional do rótulo (adultos; gestantes e lactantes em colunas separadas no Multi Vitta); macronutrientes pelo Anexo II. "
      "Calculado **sobre a quantidade declarada (já arredondada)**, para que o leitor reproduza o percentual a partir do número impresso; onde o memorial tinha calculado sobre o valor exato, a diferença é de até 3 pontos e está registrada em `harmonizacao.md`.")
    A("- Quantidade não significativa (Anexo IV da IN 75): %VD declarado como 0. Constituinte sem VDR: célula de %VD em branco (RDC 429/2020, art. 12, §1º) — sem asterisco duplo. Açúcares totais: sem VD, célula em branco.")
    A("- Valor energético: fatores em kcal/g do Anexo XXII da IN 75/2020 (lido no AnvisaLegis em 16/09/2026: carboidratos 4, proteínas 4, gorduras 9, ácidos orgânicos 3, sorbitol 2,6, maltitol 2,1, fibras solúveis 2). "
      "O anexo **não traz coluna em kJ/g**; por isso kJ = kcal × 4,184 em todas as tabelas (os fatores 17/37/13 kJ/g usados por dois memoriais são herança da RDC 360/2003, revogada). "
      "Aminoácidos livres, creatina, taurina, carnitina e glicerina não têm fator próprio no Anexo XXII: cada memorial registrou seu critério (mantido) e a decisão final é do RT — ver decisão 9 do consolidado.")
    A("- Creatina: declarada pela massa nominal de creatina monoidratada (o lote 217949 tem teor 100,5 % base seca; a base do limite — leitura A ou B — é decisão do RT).")
    A("- Cafeína: declarada como cafeína total (anidra + a do guaraná em pó pelo teor de metilxantinas totais, limite superior), marcada PROVISÓRIA até o laudo de cafeína específica do guaraná.")
    A("- Linhas marcadas **PENDENTE** não têm dado de fonte (massas de excipientes não registradas, laudo ausente); linhas marcadas ⚠ são PROVISÓRIAS (teor de laudo vencido, potência não conferida, critério aguardando o RT). Nada foi preenchido com valor plausível.")
    A("- Rodapé literal da RDC 429/2020, art. 12, §5º: \"*Percentual de valores diários fornecidos pela porção\".")
    A("")
    A("Os valores de referência (VD) usados estão em `scratchpad/padrao-anvisa/vd.json` (leitura do Anexo VIII em 16/09/2026): adultos ≥ 19 anos, gestantes e lactantes. O VD de niacina para gestantes e lactantes não foi extraído nessa leitura — por isso a célula fica PENDENTE no Multi Vitta.")
    A("")
    A("---")
    for s in SLUGS:
        p = modelo[s]
        A("")
        A(f"## {p['nome']} (`{s}`)")
        A("")
        A(f"- **Porção:** {p['porcao_descricao']}")
        A(f"- **Porções por embalagem:** {p['tabela']['porcoes_por_embalagem']}")
        A(f"- **Grupo populacional:** {p['grupo_populacional']}")
        A(f"- **Veredito esperado:** {p['veredito']}")
        if s == "omega-pro-tg":
            A("- **TABELA INTEIRA PROVISÓRIA** — montada sobre o cadastro do banco, sem laudo do óleo de peixe, memorial nem rótulo. Não vai para a arte antes do laudo do óleo (perfil de ácidos graxos, EPA/DHA em mg/g, saturadas, trans, colesterol).")
        A("")
        A(render_tabela_md(p))
        A("")
        A("Bloco de texto (como gravado em `formulas.nutritional_info`):")
        A("")
        A("```")
        A(p["nutritional_info_texto"])
        A("```")
        pend = [l for l in p["tabela"]["linhas"] if l.get("pendente") or l.get("provisorio")]
        A("")
        if pend or s == "omega-pro-tg":
            A("**Linhas PENDENTES / PROVISÓRIAS e o motivo:**")
            A("")
            for l in pend:
                rot = "PENDENTE" if l.get("pendente") else "PROVISÓRIA"
                A(f"- {l['item']} — {rot}: {l.get('nota') or 'ver memorial'}")
            if s == "omega-pro-tg" and not pend:
                A("- Toda a tabela — PROVISÓRIA: sem laudo do óleo de peixe.")
        else:
            A("Nenhuma linha pendente ou provisória.")
        em = p.get("energia_modelo") or {}
        if em.get("tot") is not None and (em.get("partes_fixas") or em.get("incluidos")):
            A("")
            A(f"Conta do valor energético (critério do memorial): {'; '.join(em.get('partes_fixas') or [])}" + (f"; a 4 kcal/g: {', '.join(em['incluidos'])}" if em.get("incluidos") else "")
              + (f"; não contados: {', '.join(em['excluidos'])}" if em.get("excluidos") else "") + f" = {br(round(em['tot'], 2))} kcal → {br(arred(em['tot'],'kcal'))} kcal = {br(arred(em['tot']*4.184,'kJ'))} kJ.")
        A("")
        A("---")
    return "\n".join(L)

# ------------------------------------------------------------------------------------------------------
def gerar_dados_consolidado(modelo, comp):
    L = []; A = L.append
    A("## Quadro dos 24 produtos (gerado)")
    A("")
    A("| Produto | Veredito esperado | Insumos antes → depois | Linhas de composição | Soma da porção | Mudanças-chave | O que condiciona |")
    A("|---|---|---|---|---|---|---|")
    ANTES = {}  # nº de insumos "antes" = ativos + retirados (constituintes do JSON)
    for s in SLUGS:
        p = modelo[s]
        ativos = [r for r in p["insumos"] if not r["retirado"] and not r["componente"]]
        retirados = [r for r in p["insumos"] if r["retirado"]]
        antes = len(p["insumos"]) - sum(1 for r in p["insumos"] if r["componente"]) + len([x for x in p["removidos"] if isinstance(x, dict)])
        depois = len(ativos)
        muds = []
        for r in p["insumos"]:
            st = sem_acento(r["status"] or "")
            if r["retirado"]: muds.append(f"retirado: {r['constituinte']}")
            elif "forma trocada" in st: muds.append(f"forma trocada: {r['constituinte']} → {r['forma_anexo_i']}")
            elif "dose ajustada" in st: muds.append(f"dose ajustada: {r['constituinte']} ({ativo_txt(r)})")
            elif "novo" in st: muds.append(f"novo: {r['constituinte']}")
        for x in p["removidos"]:
            if isinstance(x, dict): muds.append(f"retirado: {x.get('constituinte')}")
        cond = p["veredito"]
        m = re.search(r"CONDICIONADO A \((.*)\)", cond)
        cond_txt = m.group(1) if m else cond
        A(f"| {p['nome']} (`{s}`) | {veredito_curto(p['veredito'])} | {antes} → {depois} | {len(comp[s])} | {br(p['soma_porcao_mg'])} de {br(p['porcao_mg'])} mg{' — NÃO CABE' if p['cabe'] is False else ''} | {'; '.join(muds) or 'mantido'} | {cond_txt} |")
    # laudos a pedir
    A("")
    A("## Laudos a pedir (gerado dos JSONs — insumo · lote atual · problema · produtos)")
    A("")
    laudos = OrderedDict()
    for s in SLUGS:
        p = modelo[s]
        for r in p["insumos"]:
            if r["retirado"]: continue
            la = r["laudo"] or {}
            venc = la.get("vencido")
            lote = la.get("lote")
            prob = None
            st = sem_acento(r["status"] or "") + " " + sem_acento(r["teor_fonte"] or "")
            if venc is True: prob = "laudo VENCIDO"
            elif lote in (None, "") or "a adquirir" in sem_acento(r["forma_insumo"] or ""): prob = "insumo a adquirir — sem laudo na máquina"
            elif "pendente" in st and ("laudo" in st or "identidade" in st or "origem" in st or "declaracao" in st): prob = "laudo/declaração PENDENTE"
            elif venc is None and lote: prob = "validade não confirmada (digitalização não relida)"
            elif "nao serve" in sem_acento(str(lote)): prob = "laudo do lote em uso não serve (forma não autorizada)"
            if prob:
                key = (r["forma_anexo_i"], str(lote))
                laudos.setdefault(key, dict(problema=prob, produtos=[], const=r["constituinte"]))
                laudos[key]["produtos"].append(p["nome"])
        for x in p["excipientes"]:
            ll = sem_acento(str(x.get("laudo_lote") or "") + " " + str(x.get("obs") or ""))
            if "vencid" in ll or "venc." in ll:
                key = (x["nome"], str(x.get("laudo_lote")))
                laudos.setdefault(key, dict(problema="laudo VENCIDO (excipiente)", produtos=[], const=x["nome"]))
                laudos[key]["produtos"].append(p["nome"])
    A("| Insumo (forma do Anexo I) | Lote atual | Problema | Produtos |")
    A("|---|---|---|---|")
    for (forma, lote), v in laudos.items():
        A(f"| {forma} | {'—' if lote in ('None', '', None) else lote} | {v['problema']} | {', '.join(sorted(set(v['produtos'])))} |")
    # insumos a comprar/trocar
    A("")
    A("## Insumos a comprar ou trocar (gerado — forma exata do Anexo I · produtos · massa por porção)")
    A("")
    compra = OrderedDict()
    for s in SLUGS:
        p = modelo[s]
        for r in p["insumos"]:
            if r["retirado"]: continue
            t = sem_acento((r["forma_insumo"] or "") + " " + (r["status"] or ""))
            if "a adquirir" in t or "forma trocada" in t or "comprar" in t:
                compra.setdefault(r["forma_anexo_i"], []).append(f"{p['nome']}: {br(r['massa_insumo_mg'])} mg de insumo por porção (= {ativo_txt(r)} de {r['constituinte'].lower()})")
    A("| Forma exata do Anexo I | Produtos e massa por porção |")
    A("|---|---|")
    for forma, prods in compra.items():
        A(f"| {forma} | " + "; ".join(prods) + " |")
    # decisões do dono/RT (deduplicadas por tema)
    A("")
    A("## Pendências que só o dono/RT resolvem (gerado dos 24 memoriais, agrupadas por tema)")
    A("")
    temas = OrderedDict()
    for s in SLUGS:
        p = modelo[s]
        for pend in p["pendencias"]:
            t0 = sem_acento(pend)
            tema = ("L-teanina (origem Camellia sinensis)" if "teanina" in t0 else
                    "Melatonina (laudo vigente)" if "melatonina" in t0 and "laudo" in t0 else
                    "Bisglicinato de magnésio (laudo novo) / óxido de magnésio" if ("bisglicinato de magnesio" in t0 or "oxido de magnesio" in t0) else
                    "Fonte de boro" if "boro" in t0 else
                    "Selenito de sódio / bisglicinato de cobre / bisglicinato ferroso (compra com laudo)" if ("selenito" in t0 or "cobre" in t0 or "ferroso" in t0 or "ferro" in t0[:30]) else
                    "Café verde (lote/laudo/espécie) e exigência de fabricante do painel" if "cafe verde" in t0 or "fabricante" in t0 else
                    "Laranja moro (insumo em estoque)" if "laranja moro" in t0 else
                    "Vitamina A (validade/potência do lote 215230)" if "vitamina a" in t0 else
                    "Excipiente q.s.p. / cápsula / apresentação" if ("excipiente" in t0 or "capsula" in t0 or "apresentacao" in t0) else
                    "Porção (mudança de porção)" if "porcao" in t0 else
                    "Colágeno (proteína mínima 8,4 g; tipo II; origem)" if "colageno" in t0 else
                    "Creatina (leitura A/B; dosador; gomas)" if ("creatina" in t0 or "dosador" in t0 or "goma" in t0) else
                    "Cafeína (guaraná; insumo controlado)" if ("cafeina" in t0 or "guarana" in t0) else
                    "Beta-alanina (laudo novo)" if "beta-alanina" in t0 else
                    "Rótulo / arte / designação" if ("rotulo" in t0 or "arte" in t0 or "designacao" in t0) else
                    "Glúten (Lei 10.674/2003)" if "gluten" in t0 else
                    "Memorial de cálculo inexistente / a emitir pelo RT" if "memorial" in t0 else
                    "Aditivos / corantes / aromas (identificação, INS, laudo)" if ("corante" in t0 or "aroma" in t0 or "aditivo" in t0 or "sorbitol" in t0 or "goma xantana" in t0) else
                    "Gelatina / alergênicos" if ("gelatina" in t0 or "alergen" in t0 or "lactose" in t0) else
                    "Ômega Pró TG (laudo do óleo; interpretação do mínimo de lipídeos)" if ("oleo" in t0 or "omega" in t0) else
                    "Outros")
            temas.setdefault(tema, []).append((p["nome"], pend))
    for tema, itens in temas.items():
        A(f"### {tema}")
        A("")
        for nome, pend in itens:
            A(f"- **{nome}:** {pend}")
        A("")
    return "\n".join(L)

# ------------------------------------------------------------------------------------------------------
def gerar_harmonizacao(modelo, comp):
    L = []; A = L.append
    A("## Correções aplicadas pelo overlay da fase 3 (gerado — valores absolutos, idempotentes)")
    A("")
    A("| Produto | Insumo | Campo | Antes | Depois | Motivo |")
    A("|---|---|---|---|---|---|")
    esc = lambda s: str(s).replace("|", "\\|").replace("\n", " ")
    for c in CORRECOES:
        A(f"| {c['slug']} | {esc(c['insumo'])} | {c['campo']} | {esc(c['antes'])[:160]} | {esc(c['depois'])[:160]} | {esc(c['motivo'])} |")
    A("")
    A("## Convenção única das linhas de composição (gerado — como cada insumo fica na migration)")
    A("")
    A("| Produto | # | ingredient_name | quantity | unit | ingredient_slug |")
    A("|---|---|---|---|---|---|")
    for s in SLUGS:
        for r in comp[s]:
            A(f"| {s} | {r['sort_order']} | {esc(r['ingredient_name'])} | {br(r['quantity'], 4)} | {r['unit']} | {r['ingredient_slug']} |")
    return "\n".join(L)

if __name__ == "__main__":
    gerar()
