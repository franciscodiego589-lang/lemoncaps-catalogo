# -*- coding: utf-8 -*-
"""
Biblioteca de geração das entregas B (JSON) e C (SQL) da Fase 2 — reformulação regulatória
Lemon Caps, 16/09/2026. Todo limite abaixo foi copiado dos anexos literais em disco
(docs/conformidade/IN28-2018-ANEXO-III-LITERAL.md e IN28-2018-ANEXOS-IV-V-VI-LITERAL.md),
coluna "> 19 anos". Os VDs vêm de scratchpad/padrao-anvisa/vd.json (Anexo VIII da IN 75/2020,
grupo adultos_19_anos_ou_mais; macronutrientes só no Anexo II).
"""
import json, math, os

OUT_DIR = "/private/tmp/claude-501/-Users-diegofrancisco-Downloads-erp-espa-o/c5ed6b00-4553-4992-b469-c649af084651/scratchpad/fase2"
DATA = "2026-09-16"
REASON = "reformulação regulatória 2026-09-16"

# ---------------------------------------------------------------------------
# Limites (Anexo III mínimo / Anexo IV máximo), grupo "> 19 anos", unidade da norma.
# 'NE' = não estabelecido. Linha = nome exato do constituinte na tabela do anexo.
# ---------------------------------------------------------------------------
LIMITES = {
    "Vitamina C":            {"unidade": "mg",  "min": 13.5,  "max": 1916.02, "linha": "III·Vitamina C (13,5) / IV·Vitamina C (1.916,02)"},
    "Vitamina A":            {"unidade": "µg RAE", "min": 135, "max": 2623.61, "linha": "III·Vitamina A^ii (135) / IV·Vitamina A^i (2.623,61)"},
    "Vitamina B6":           {"unidade": "mg",  "min": 0.26,  "max": 98.60,  "linha": "III·Vitamina B_6 (0,26) / IV·Vitamina B_6 (98,60)"},
    "Vitamina B12":          {"unidade": "µg",  "min": 0.36,  "max": 9.94,   "linha": "III·Vitamina B_12 (0,36) / IV·Vitamina B_12 (9,94)"},
    "Vitamina D":            {"unidade": "µg",  "min": 3,     "max": 50.0,   "linha": "III·Vitamina D^iii (3) / IV·Vitamina D^ii (50,0)"},
    "Zinco":                 {"unidade": "mg",  "min": 1.65,  "max": 29.59,  "linha": "III·Zinco (1,65) / IV·Zinco (29,59)"},
    "Magnésio":              {"unidade": "mg",  "min": 63,    "max": 350,    "linha": "III·Magnésio (63) / IV·Magnésio (350)"},
    "Cromo":                 {"unidade": "µg",  "min": 5.25,  "max": 250,    "linha": "III·Cromo (5,25) / IV·Cromo (250)"},
    "Colina":                {"unidade": "mg",  "min": 82.5,  "max": 3235.15,"linha": "III·Colina (82,5) / IV·Colina (3.235,15)"},
    "Glutamina":             {"unidade": "mg",  "min": "NE",  "max": 5000,   "linha": "III·Glutamina (NE) / IV·Glutamina (5.000)"},
    "Taurina":               {"unidade": "mg",  "min": "NE",  "max": 2000,   "linha": "III·Taurina (NE) / IV·Taurina (2.000)"},
    "L-Carnitina":           {"unidade": "mg",  "min": "NE",  "max": 2000,   "linha": "III·L-Carnitina (NE) / IV·L-Carnitina (2.000)"},
    "Arginina":              {"unidade": "mg",  "min": "NE",  "max": 3810,   "linha": "III·Arginina (NE) / IV·Arginina (3.810)"},
    "Cafeína":               {"unidade": "mg",  "min": 75,    "max": 200,    "linha": "III·Cafeína (75) / IV·Cafeína (200^vi)"},
    "Ácido clorogênico":     {"unidade": "mg",  "min": "NE",  "max": 400,    "linha": "III·Ácido clorogênico (NE) / IV·Ácido clorogênico (400, redação IN 102/2021)"},
    "Antocianinas da laranja moro": {"unidade": "mg", "min": "NE", "max": 5, "linha": "III·Antocianinas da laranja moro (NE, IN 336/2024) / IV·Antocianinas da laranja moro (5)"},
    "Curcumina":             {"unidade": "mg",  "min": 80,    "max": 130,    "linha": "III·Curcumina (80^xv) / IV·Curcumina (130^x) — curcuminoides totais, IN 438/2026"},
    "Quercetina":            {"unidade": "mg",  "min": "NE",  "max": 280,    "linha": "III·Quercetina (NE) / IV·Quercetina (280), IN 418/2025"},
    "Proteínas":             {"unidade": "g",   "min": 8.4,   "max": "NE",   "linha": "III·Proteínas (8,4) / IV·Proteínas (NE)"},
    "Fibras alimentares":    {"unidade": "g",   "min": 5.7,   "max": "NE",   "linha": "III·Fibras alimentares (5,7) / IV·Fibras alimentares (NE)"},
    "Lipídeos totais":       {"unidade": "g",   "min": 5,     "max": "NE",   "linha": "III·Lipídeos totais (5) / IV·Lipídeos totais (NE)"},
    "EPA e DHA":             {"unidade": "mg",  "min": 37.5,  "max": 2000,   "linha": "III·EPA e DHA (37,5) / IV·EPA e DHA (2.000)"},
    "Saponinas de glicosídeos de furostanol": {"unidade": "mg", "min": "NE", "max": 450, "linha": "III·Saponinas de glicosídeos de furostanol (NE) / IV·(450), IN 304/2024"},
    "Carboidratos":          {"unidade": "g",   "min": 19.5,  "max": "NE",   "linha": "III·Carboidratos (19,5) / IV·Carboidratos (NE)"},
}

# VD adultos (Anexo VIII IN 75/2020 — vd.json grupo adultos_19_anos_ou_mais); macros: Anexo II (2.000 kcal)
VD = {
    "Valor energético": (2000, "kcal"), "Carboidratos": (300, "g"), "Açúcares adicionados": (50, "g"),
    "Proteínas": (50, "g"), "Gorduras totais": (65, "g"), "Gorduras saturadas": (20, "g"),
    "Gorduras trans": (2, "g"), "Fibras alimentares": (25, "g"), "Sódio": (2000, "mg"), "Ômega 3": (4000, "mg"),
    "Vitamina A": (800, "µg RAE"), "Vitamina D": (15, "µg"), "Vitamina E": (15, "mg"), "Vitamina K": (120, "µg"),
    "Vitamina C": (100, "mg"), "Tiamina": (1.2, "mg"), "Riboflavina": (1.2, "mg"), "Niacina": (15, "mg NE"),
    "Vitamina B6": (1.3, "mg"), "Biotina": (30, "µg"), "Ácido fólico": (400, "µg DFE"), "Ácido pantotênico": (5, "mg"),
    "Vitamina B12": (2.4, "µg"), "Cálcio": (1000, "mg"), "Cobre": (900, "µg"), "Cromo": (35, "µg"),
    "Ferro": (14, "mg"), "Fósforo": (700, "mg"), "Iodo": (150, "µg"), "Magnésio": (420, "mg"), "Manganês": (3, "mg"),
    "Molibdênio": (45, "µg"), "Potássio": (3500, "mg"), "Selênio": (60, "µg"), "Zinco": (11, "mg"), "Colina": (550, "mg"),
}

# Limiares de "quantidade não significativa" (Anexo IV IN 75/2020 — só os lidos no gabarito)
NAO_SIG = {"Valor energético": 4, "Carboidratos": 0.5, "Açúcares totais": 0.5, "Açúcares adicionados": 0.5,
           "Proteínas": 0.5, "Gorduras totais": 0.5, "Gorduras saturadas": 0.1, "Gorduras trans": 0.1, "Sódio": 5}

# Fatores de energia. kcal/g: Atwater (carboidrato 4, proteína 4, gordura 9; ácido orgânico 3; poliol 2,4).
# kJ/g: 17 / 17 / 37 / 13 / 10 — valores tradicionais da rotulagem brasileira; o texto literal do
# Anexo XXII da IN 75/2020 NÃO está em disco → marcados PROVISÓRIOS nos memoriais.
FATOR = {"carboidrato": (4, 17), "proteina": (4, 17), "gordura": (9, 37), "acido_organico": (3, 13), "poliol": (2.4, 10)}

def arred(v, unidade="mg"):
    """Arredondamento do Anexo III da IN 75/2020 (paráfrase do gabarito, não literal):
    >=10 → inteiro; 1<=v<10 → 1 decimal; <1 em g → 1 decimal; <1 em mg/µg → 2 decimais."""
    if v is None: return None
    if v >= 10: return int(math.floor(v + 0.5))
    if v >= 1:
        r = math.floor(v*10 + 0.5)/10
        return int(r) if r == int(r) else r
    if unidade == "g":
        return math.floor(v*10 + 0.5)/10
    r = math.floor(v*100 + 0.5)/100
    return r

def fmt(v):
    """número em formato brasileiro (vírgula decimal, ponto de milhar)"""
    if v is None: return "—"
    if isinstance(v, int) or (isinstance(v, float) and v == int(v) and abs(v) >= 10):
        s = f"{int(v):,}".replace(",", ".")
        return s
    s = f"{v:.4f}".rstrip("0").rstrip(".")
    if "." in s:
        i, d = s.split(".")
        i = f"{int(i):,}".replace(",", ".")
        return f"{i},{d}"
    return f"{int(s):,}".replace(",", ".")

def pct_vd(item, qtd):
    if item not in VD or qtd is None: return None
    ref = VD[item][0]
    return int(math.floor(qtd/ref*100 + 0.5))

def linha_nutri(item, qtd, unidade, sem_vd=False, nao_sig=False):
    """Uma linha da tabela: quantidade arredondada e %VD (inteiro) ou None (célula em branco)."""
    q = arred(qtd, unidade) if qtd is not None else None
    if sem_vd:
        vd = None
    elif nao_sig:
        vd = 0
    else:
        vd = pct_vd(item, qtd)
    return {"item": item, "quantidade": q, "unidade": unidade, "vd_pct": vd}

def pct_max(ativo, maximo):
    if maximo == "NE" or maximo is None or ativo is None: return None
    return round(ativo/maximo*100, 1)

def sql_str(s):
    if s is None: return "null"
    return "'" + str(s).replace("'", "''") + "'"

def slugify(s):
    import unicodedata, re
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    s = re.sub(r"[^a-zA-Z0-9]+", "-", s).strip("-").lower()
    return s

def tabela_texto(tn):
    """Texto da tabela nutricional para a coluna formulas.nutritional_info (text)."""
    L = ["INFORMAÇÃO NUTRICIONAL",
         f"Porções por embalagem: {tn['porcoes_por_embalagem']}",
         f"Porção: {tn['porcao']}",
         "Quantidade por porção | %VD*"]
    for r in tn["linhas"]:
        q = r["quantidade"]
        qs = fmt(q) if q is not None else "—"
        vd = "" if r["vd_pct"] is None else f"{r['vd_pct']}%"
        extra = f" = {r['kj']} kJ" if r.get("kj") is not None else ""
        L.append(f"{r['item']} {qs} {r['unidade']}{extra} | {vd}".rstrip())
    L.append(tn["rodape"])
    return "\n".join(L)

def gerar_sql(P):
    """Fragmento PL/pgSQL idempotente, casando por slug — estilo 20260920000000."""
    slug = P["slug"]
    linhas = []
    ordem = 0
    for ins in P["insumos"]:
        if ins.get("status") == "retirado": continue
        ordem += 1
        meta = {"fonte": "reformulacao_2026-09-16", "papel": "constituinte",
                "constituinte_anexo_i": ins["constituinte_anexo_i"],
                "laudo_lote": (ins.get("laudo") or {}).get("lote"),
                "laudo_validade": (ins.get("laudo") or {}).get("validade"),
                "laudo_vencido": (ins.get("laudo") or {}).get("vencido"),
                "teor_pct": ins.get("teor_pct"), "teor_fonte": ins.get("teor_fonte"),
                "ativo_mg": ins.get("ativo_mg"), "unidade_ativo": ins.get("unidade_ativo"),
                "minimo": ins.get("minimo"), "maximo": ins.get("maximo"), "pct_do_maximo": ins.get("pct_do_maximo"),
                "linha_anexo": ins.get("linha_anexo"), "status": ins.get("status"), "e_sal": ins.get("e_sal", False)}
        massa_sql = ins.get("massa_sql_valor", ins["massa_insumo_mg"]); un_sql = ins.get("massa_sql_unidade", ins.get("unidade_massa","mg"))
        if "massa_sql_valor" in ins: meta["massa_insumo_mg"] = ins["massa_insumo_mg"]; meta["observacao_sql"] = ins.get("massa_sql_obs")
        linhas.append((ordem, ins["nome_composicao"], massa_sql, un_sql, ins["ingredient_slug"], ins["ingredient_nome"], meta))
    for ex in P["excipientes"]:
        if ex.get("massa_mg") in (None, 0): continue
        ordem += 1
        meta = {"fonte": "reformulacao_2026-09-16", "papel": ex.get("papel", "aditivo"), "ins": ex.get("ins"),
                "laudo_lote": ex.get("laudo_lote"), "observacao": ex.get("observacao")}
        linhas.append((ordem, ex["nome"], ex["massa_mg"], "mg", ex["ingredient_slug"], ex["ingredient_nome"], meta))

    # insumos novos (insert se faltar)
    novos = {}
    for (_, _, _, _, islug, inome, _) in linhas:
        novos[islug] = inome
    for k, v in P.get("ingredientes_categoria", {}).items():
        pass

    S = []
    S.append(f"-- =====================================================================================")
    S.append(f"-- Fase 2 — reformulação regulatória 2026-09-16 — fragmento do produto {slug}")
    S.append(f"-- Gerado a partir de {slug}.json (mesmos números). Idempotente; casa por SLUG, nunca por UUID.")
    S.append(f"-- Veredito esperado: {P['veredito']}")
    S.append(f"-- A coluna public.formulas.nutritional_info é TEXT no banco (conferido ao vivo em 16/09/2026);")
    S.append(f"-- por isso a tabela vai como texto no padrão ANVISA e o JSON estruturado vai em formulas.metadata.")
    S.append(f"-- Sem guarda de contagem aqui (a consolidação põe).")
    S.append(f"-- =====================================================================================")
    S.append("")
    if P.get("sql_sem_composicao"):
        S.append("-- 1–3. SEM ALTERAÇÃO DE COMPOSIÇÃO: " + P.get("sql_sem_composicao_motivo", ""))
        S.append("-- As linhas ativas atuais de public.formula_compositions desta fórmula ficam como estão.")
        S.append("")
        linhas = []
        novos = {}
    S.append("-- 1. Insumos que faltarem em public.ingredients (nome como no Anexo I / rótulo). on conflict do nothing.")
    if not novos:
        S.append("-- (nenhum insumo novo)")
    else:
        S.append("insert into public.ingredients (slug, name, synonyms, category, sort_order, metadata) values")
    vals = []
    cats = P.get("ingredientes_categoria", {})
    so = P.get("ingredients_sort_base", 800)
    i = 0
    for islug, inome in novos.items():
        i += 10
        cat = cats.get(islug, "outro")
        vals.append(f"    ({sql_str(islug)}, {sql_str(inome)}, ARRAY[{sql_str(inome)}]::text[], {sql_str(cat)}::public.ingredient_category, {so+i}, '{{\"fonte\": \"reformulacao_2026-09-16\", \"criado_por\": \"fase2/{slug}.sql\"}}'::jsonb)")
    if novos:
        S.append(",\n".join(vals))
        S.append("on conflict (slug) do nothing;")
    S.append("")
    if not P.get("sql_sem_composicao"):
        S.append("-- 2. Exclusão LÓGICA das composições ativas atuais da fórmula (só as que não vieram desta reformulação).")
        S.append("update public.formula_compositions fc")
        S.append("set active = false, deleted_at = now(), reason_deleted = " + sql_str(REASON))
        S.append("from public.formulas f")
        S.append(f"where f.id = fc.formula_id and f.deleted_at is null and f.slug = {sql_str(slug)}")
        S.append("  and fc.deleted_at is null")
        S.append("  and coalesce(fc.metadata->>'fonte', '') <> 'reformulacao_2026-09-16';")
        S.append("")
    if linhas:
        S.append("-- 3. Inserção das composições reformuladas (ingredient_id resolvido por slug em public.ingredients).")
        S.append("insert into public.formula_compositions (formula_id, ingredient_name, quantity, unit, sort_order, ingredient_id, metadata)")
        S.append("select f.id, v.ingredient_name, v.quantity, v.unit::public.composition_unit, v.sort_order, i.id, v.metadata::jsonb")
        S.append("from (values")
        rows = []
        for (ordem, nome, massa, un, islug, inome, meta) in linhas:
            rows.append(f"    ({sql_str(slug)}, {ordem-1}, {sql_str(nome)}, {massa}, {sql_str(un)}, {sql_str(islug)}, {sql_str(json.dumps(meta, ensure_ascii=False))})")
        S.append(",\n".join(rows))
        S.append(") as v(slug, sort_order, ingredient_name, quantity, unit, ingredient_slug, metadata)")
        S.append("join public.formulas f on f.slug = v.slug and f.deleted_at is null")
        S.append("join public.ingredients i on i.slug = v.ingredient_slug and i.deleted_at is null")
        S.append("where not exists (")
        S.append("    select 1 from public.formula_compositions x")
        S.append("    where x.formula_id = f.id and x.deleted_at is null and x.metadata->>'fonte' = 'reformulacao_2026-09-16'")
        S.append(");")
    else:
        S.append("-- 3. (sem linhas novas de composição — ver cabeçalho)")
    S.append("")
    S.append("-- 4. Dizeres de rotulagem, tabela nutricional (texto) e porção; JSON da tabela em metadata.")
    tn_json = json.dumps(P["tabela_nutricional"], ensure_ascii=False)
    ref_json = json.dumps({"data": DATA, "veredito": P["veredito"], "porcao_mg": P["porcao_mg"], "soma_porcao_mg": P["soma_porcao_mg"], "cabe": P["cabe"], "pendencias": P["pendencias"]}, ensure_ascii=False)
    S.append("update public.formulas f set")
    if P.get('ingredients_list') is None:
        S.append("    ingredients_list    = f.ingredients_list,  -- sem fonte para a lista: fica como está")
    else:
        S.append(f"    ingredients_list    = {sql_str(P['ingredients_list'])},")
    S.append(f"    warnings            = {sql_str(P['warnings'])},")
    if P.get('sql_nao_gravar_nutritional_info'):
        S.append("    nutritional_info    = f.nutritional_info,  -- tabela PROVISÓRIA fica só em metadata; o campo público não muda")
    else:
        S.append(f"    nutritional_info    = {sql_str(tabela_texto(P['tabela_nutricional']))},")
    S.append(f"    serving_description = {sql_str(P['porcao_descricao'])},")
    S.append(f"    metadata            = f.metadata || jsonb_build_object('tabela_nutricional_2026_09_16', {sql_str(tn_json)}::jsonb, 'reformulacao_2026_09_16', {sql_str(ref_json)}::jsonb)")
    S.append(f"where f.slug = {sql_str(slug)} and f.deleted_at is null;")
    S.append("")
    return "\n".join(S)

def gravar(P):
    with open(os.path.join(OUT_DIR, P["slug"] + ".json"), "w", encoding="utf-8") as f:
        json.dump(P, f, ensure_ascii=False, indent=2)
    with open(os.path.join(OUT_DIR, P["slug"] + ".sql"), "w", encoding="utf-8") as f:
        f.write(gerar_sql(P))
    print("gravado:", P["slug"] + ".json", "e", P["slug"] + ".sql")
