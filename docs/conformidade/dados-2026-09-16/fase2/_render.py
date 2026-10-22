# -*- coding: utf-8 -*-
"""Renderização das três entregas (memorial .md, .json, .sql) a partir do dicionário de produto."""
import json, re, unicodedata
from _gerador_base import *
from _gerador_base import _hu

OUT_MD = "/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/reformulacao"
OUT_SCR = "/private/tmp/claude-501/-Users-diegofrancisco-Downloads-erp-espa-o/c5ed6b00-4553-4992-b469-c649af084651/scratchpad/fase2"

# slugs de public.ingredients lidos ao vivo em 16/09/2026 (70 insumos) — mapeamento constituinte -> slug
ING_SLUG = {
    "Magnésio": "magnesio", "Zinco": "zinco", "Boro": "boro", "Teanina": "l-teanina",
    "Vitamina B6": "vitamina-b6", "Vitamina D": "vitamina-d", "Vitamina C": "vitamina-c",
    "Niacina": "vitamina-b3", "Vitamina E": "vitamina-e", "Ácido pantotênico": "vitamina-b5",
    "Tiamina": "vitamina-b1", "Riboflavina": "vitamina-b2", "Vitamina A": "vitamina-a",
    "Ácido fólico": "vitamina-b9", "Cobre": "cobre", "Selênio": "selenio", "Vitamina K": "vitamina-k",
    "Cromo": "cromo", "Vitamina B12": "vitamina-b12", "Biotina": "biotina", "Metionina": "l-metionina",
    "Cisteína": "cloridrato-de-l-cisteina", "Metilsulfonilmetano": "metilsulfonilmetano",
    "Ácido hialurônico": "hialuronato-de-sodio", "Silício": "silicio-organico", "Iodo": "iodo",
    "Glucosamina": "sulfato-de-glucosamina-com-cloreto-de-potassio",
    "Colágeno tipo II não desnaturado": "colageno-tipo-ii-nao-desnaturado", "Ferro": "ferro",
    "Colina": "colina", "Tirosina": "l-tirosina", "L-Carnitina": "l-carnitina", "Inositol": "inositol",
    "Triptofano": "l-triptofano", "Aspartato": "acido-l-aspartico", "Glutamina": "l-glutamina",
    "Melatonina": "melatonina", "Cálcio": "calcio-elementar",
}
EXC_SLUG = {"Dióxido de silício": "dioxido-de-silicio"}

def slugify(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    s = re.sub(r"[^a-zA-Z0-9]+", "-", s).strip("-").lower()
    return s

def limites(P, const):
    if P["grupo"] == "gest_lact":
        g, l = LIM_GEST.get(const), LIM_LACT.get(const)
        if g is None or l is None:
            return None
        mn = max(g[0], l[0])
        mx = min([x for x in (g[1], l[1]) if x is not None], default=None)
        return (mn, mx, g[2], f"gest. {fmt(g[0], 2)} / lact. {fmt(l[0], 2)}", f"gest. {fmt(g[1], 2)} / lact. {fmt(l[1], 2)}")
    t = LIM_ADULTO[const]
    return (t[0], t[1], t[2], "NE" if t[0] is None else fmt(t[0], 2), "NE" if t[1] is None else fmt(t[1], 2))

def energia(P):
    prot = sum(i.get("prot_mg", 0) for i in P["insumos"]) + sum(e.get("prot_mg", 0) for e in P["excipientes"])
    carb = sum(i.get("carb_mg", 0) for i in P["insumos"]) + sum(e.get("carb_mg", 0) for e in P["excipientes"])
    gord = sum(i.get("gord_mg", 0) for i in P["insumos"]) + sum(e.get("gord_mg", 0) for e in P["excipientes"])
    kcal = 4 * prot / 1000 + 4 * carb / 1000 + 9 * gord / 1000
    kj = 17 * prot / 1000 + 17 * carb / 1000 + 37 * gord / 1000
    return prot / 1000, carb / 1000, gord / 1000, kcal, kj

def sodio(P):
    return sum(i.get("na_mg", 0) for i in P["insumos"]) + sum(e.get("na_mg", 0) for e in P["excipientes"])

def vd_pct(P, const, ativo, unid):
    """% VD; devolve dict grupo -> valor (float ou None)."""
    if P["grupo"] == "gest_lact":
        out = {}
        for nome, tab in (("gestantes", VD_GEST), ("lactantes", VD_LACT)):
            v = tab.get(const)
            out[nome] = None if v is None else ativo / v * 100
        return out
    v = VD_ADULTO.get(const)
    return {"adultos": None if v is None else ativo / v * 100}

def vd_txt(v):
    if v is None:
        return ""
    if isinstance(v, str):
        return v
    return f"{int(_hu(v, 0))}%"

def tabela_nutricional(P):
    """Monta as linhas da tabela (lista de dicts) e o texto markdown."""
    prot, carb, gord, kcal, kj = energia(P)
    na = sodio(P)
    grupos = ["gestantes", "lactantes"] if P["grupo"] == "gest_lact" else ["adultos"]
    linhas = []
    def add(item, q, unid, vd, obs=None):
        linhas.append({"item": item, "quantidade": q, "unidade": unid, "vd_pct": vd, "obs": obs})
    # valor energético — %VD 0 quando não significativo (≤ 4 kcal, Anexo IV IN 75)
    kcal_r, kcal_t = arred(kcal, "kcal"); kj_r, kj_t = arred(kj, "kJ")
    vd_e = {g: (0 if kcal <= 4 else kcal / 2000 * 100) for g in grupos}
    add("Valor energético", f"{kcal_t} kcal = {kj_t} kJ", "kcal/kJ", vd_e)
    def macro(nome, g_val, limiar, vdkey):
        r, t = arred(g_val, "g")
        vd = {g: (0 if g_val <= limiar else g_val / VD_ADULTO[vdkey] * 100) for g in grupos}
        add(nome, t, "g", vd)
    macro("Carboidratos", carb, 0.5, "Carboidratos")
    macro("Açúcares totais", 0.0, 0.5, "Carboidratos")
    macro("Açúcares adicionados", 0.0, 0.5, "Açúcares adicionados")
    macro("Proteínas", prot, 0.5, "Proteínas")
    macro("Gorduras totais", gord, 0.5, "Gorduras totais")
    macro("Gorduras saturadas", 0.0, 0.1, "Gorduras saturadas")
    r, t = arred(0.0, "g"); add("Gorduras trans", t, "g", {g: 0 for g in grupos})
    macro("Fibras alimentares", 0.0, 0.5, "Fibras alimentares")
    r, t = arred(na, "mg"); add("Sódio", t, "mg", {g: (0 if na <= 5 else na / 2000 * 100) for g in grupos})
    # vitaminas e minerais na ordem do Anexo XI
    ativos = {i["const"]: i for i in P["insumos"]}
    for const in ORDEM_VIT + ORDEM_MIN:
        if const in ativos:
            i = ativos[const]
            r, t = arred(i["ativo"], i["unid"])
            vd = vd_pct(P, const, i["ativo"], i["unid"])
            if i.get("vd_pendente"):
                vd = {g: "PENDENTE" for g in vd}
            add(i.get("tabela_nome", const), t, i["unid"], vd)
    if "Colina" in ativos:
        i = ativos["Colina"]; r, t = arred(i["ativo"], i["unid"])
        add("Colina", t, i["unid"], vd_pct(P, "Colina", i["ativo"], i["unid"]))
    for i in P["insumos"]:
        if i["const"] in ORDEM_VIT + ORDEM_MIN + ["Colina"]:
            continue
        r, t = arred(i["ativo"], i["unid"])
        add(i.get("tabela_nome", i["const"]), t, i["unid"], {g: None for g in grupos})
    # markdown
    cab = "| Quantidade por porção | " + " | ".join(f"%VD* ({g})" for g in grupos) + " |"
    md = ["**INFORMAÇÃO NUTRICIONAL**", "",
          f"Porções por embalagem: {P['porcoes']}", f"Porção: {P['porcao_desc']}", "",
          "| Item | " + cab[2:], "|---|---|" + "---|" * len(grupos)]
    for l in linhas:
        vds = " | ".join(vd_txt(l["vd_pct"].get(g)) for g in grupos)
        md.append(f"| {l['item']} | {l['quantidade']} {l['unidade'] if l['unidade'] not in ('kcal/kJ',) else ''} | {vds} |")
    md.append("")
    md.append(RODAPE_VD)
    texto_plano = [f"Porções por embalagem: {P['porcoes']}", f"Porção: {P['porcao_desc']}"]
    for l in linhas:
        vds = "; ".join(f"{vd_txt(l['vd_pct'].get(g)) or '—'} {g}" for g in grupos) if len(grupos) > 1 else vd_txt(l["vd_pct"].get(grupos[0]))
        u = "" if l["unidade"] == "kcal/kJ" else f" {l['unidade']}"
        texto_plano.append(f"{l['item']}: {l['quantidade']}{u}" + (f" ({vds})" if vds else " ( )"))
    texto_plano.append(RODAPE_VD)
    conta = (f"Valor energético calculado (fatores de Atwater da IN 75/2020, Anexo XXII: proteínas e carboidratos "
             f"4 kcal/g = 17 kJ/g; gorduras 9 kcal/g = 37 kJ/g): proteínas {fmt(prot*1000,1)} mg → {fmt(4*prot,2)} kcal; "
             f"carboidratos {fmt(carb*1000,1)} mg → {fmt(4*carb,2)} kcal; gorduras {fmt(gord*1000,1)} mg → {fmt(9*gord,2)} kcal; "
             f"total {fmt(kcal,2)} kcal = {fmt(kj,2)} kJ. Sódio calculado: {fmt(na,2)} mg.")
    return linhas, "\n".join(md), "\n".join(texto_plano), conta, dict(prot=prot, carb=carb, gord=gord, kcal=kcal, kj=kj, na=na)

def tabela_depois(P):
    """Tabela insumo a insumo do 'Depois' (markdown) + soma."""
    hdr = ("| # | Constituinte (Anexo I) | Forma / insumo comercial | Massa do insumo (mg/porção) | Teor (% e fonte) | "
           "Ativo por porção | Mín. | Máx. | % do máx. | Linha do anexo | Laudo (lote · validade · vencido?) | Status |")
    sep = "|---|---|---|---|---|---|---|---|---|---|---|---|"
    rows = [hdr, sep]
    soma = 0.0
    for n, i in enumerate(P["insumos"], 1):
        lim = limites(P, i["const"])
        mn, mx = lim[0], lim[1]
        pm = pct(i["ativo"], mx)
        pm_t = "—" if pm is None else f"{fmt(pm,1)}%"
        la = i.get("laudo") or {}
        if not la or not la.get("lote"):
            laudo_t = "sem laudo — insumo a adquirir"
        else:
            venc = la.get("vencido")
            venc_t = "VENCIDO" if venc else ("em dia" if venc is False else "validade não relida")
            laudo_t = f"{la.get('lote','—')} · {la.get('validade','—')} · {venc_t}"
        if la.get("obs"):
            laudo_t += f" — {la['obs']}"
        teor_t = i["teor_txt"]
        soma += i["massa"]
        mn_t = lim[3] if lim[3] == "NE" else f"{lim[3]} {lim[2]}"
        mx_t = lim[4] if lim[4] == "NE" else f"{lim[4]} {lim[2]}"
        rows.append(f"| {n} | {i['const']} | {i['forma']} | {fmt(i['massa'],3)} | {teor_t} | {fmt(i['ativo'],3)} {i['unid']} | {mn_t} | {mx_t} | {pm_t} | {i['linha']} | {laudo_t} | {i['status']} |")
    exc = sum(e["massa"] for e in P["excipientes"] if e["massa"] is not None)
    return "\n".join(rows), soma, exc

def memorial_md(P):
    linhas, tab_md, tab_txt, conta_en, en = tabela_nutricional(P)
    dep_md, soma_ins, soma_exc = tabela_depois(P)
    total = soma_ins + soma_exc
    pr = P["prosa"]
    out = []
    out.append(f"# Reformulação regulatória — {P['nome']} (`{P['slug']}`)")
    out.append("")
    out.append(f"**Data:** {DATA}. **Fase 2 da conformidade do catálogo Lemon Caps** (ordem do dono: \"altere os insumos para os permitidos; pode refazer as formulações para todas estarem dentro das normas\"). Documento para o dono e para o RT (Anderson C. Barbosa, CRF/MT 5526). Nada foi gravado no banco; as três entregas deste produto são este memorial, o JSON `scratchpad/fase2/{P['slug']}.json` e o fragmento SQL `scratchpad/fase2/{P['slug']}.sql`, todos criados em disco e não aplicados.")
    out.append("")
    out.append("**Fontes usadas (todas lidas nesta data, caminhos absolutos no rodapé):** IN 28/2018 nos anexos literais I, III, IV e VI (texto consolidado vigente até a IN 450/2026, lido em 16/09/2026); auditoria de 15/09/2026; composição do rótulo (`composicoes_rotulo.json`, extração de 13/09/2026); memorial de cálculo da fábrica (`memoriais-formulacoes.json`, 16/09/2026); inventário de laudos (`laudos.json`, 308 certificados, 16/09/2026); gabarito da tabela nutricional (RDC 429/2020 + IN 75/2020, 16/09/2026) e `vd.json`; cadastro vivo do catálogo (chave pública, lido em 16/09/2026).")
    out.append("")
    out.append("**Convenção de procedência, em todo número deste documento:** *lido* = copiado da fonte nomeada; *calculado* = conta aritmética mostrada; *assumido* = marcado como tal ao lado do número (teor estequiométrico do sal puro quando não há laudo). Dado não confirmado fica marcado **PROVISÓRIO** ou **PENDENTE**.")
    out.append("")
    out.append("## 1. Identificação")
    out.append("")
    out.append(f"- **Nome:** {P['nome']} (nome no rótulo/mercado: {P['nome_rotulo']}).")
    out.append(f"- **Slug:** `{P['slug']}`.")
    out.append(f"- **Formato:** {P['formato']}.")
    out.append(f"- **Porção declarada:** {P['porcao_desc']} — {fmt(P['porcao_mg'],0)} mg de conteúdo por porção{P.get('porcao_obs','')}. {P.get('porcao_proposta','Sem mudança de porção proposta.')}")
    out.append(f"- **Público-alvo / grupo populacional dos Anexos III e IV:** {P['publico']}.")
    out.append(f"- **Porções por embalagem:** {P['porcoes']}.")
    out.append("")
    out.append(pr["identificacao_extra"])
    out.append("")
    out.append("## 2. Antes — composição atual e veredito da auditoria por insumo")
    out.append("")
    out.append(pr["antes_intro"])
    out.append("")
    out.append("| # | Insumo (como está na fonte) | Quantidade | Veredito da auditoria (15/09/2026) e observação do memorial da fábrica |")
    out.append("|---|---|---|---|")
    for n, (ins, q, v) in enumerate(P["antes"], 1):
        out.append(f"| {n} | {ins} | {q} | {v} |")
    out.append("")
    out.append(pr.get("antes_extra", ""))
    out.append("")
    out.append("## 3. Depois — composição proposta, insumo a insumo")
    out.append("")
    out.append(pr["depois_intro"])
    out.append("")
    out.append(dep_md)
    out.append("")
    out.append("**Excipientes e veículo (não são constituintes; conferidos contra a IN 211/2023 na auditoria de 15/09 apenas para o dióxido de silício, ácido cítrico, sucralose e corantes — os demais estão marcados como pendência de conferência):**")
    out.append("")
    for e in P["excipientes"]:
        m = "q.s.p." if e["massa"] is None else f"{fmt(e['massa'],2)} mg"
        out.append(f"- {e['nome']}" + (f" (INS {e['ins']})" if e.get("ins") else "") + f" — {m}" + (f" — {e['obs']}" if e.get("obs") else ""))
    out.append("")
    out.append(f"**Soma da porção:** insumos {fmt(soma_ins,2)} mg + excipientes {fmt(soma_exc,2)} mg = **{fmt(total,2)} mg de {fmt(P['porcao_mg'],0)} mg ({fmt(total/P['porcao_mg']*100,1)}%)**. {pr['soma_comentario']}")
    out.append("")
    if P.get("removidos"):
        out.append("**Retirados da fórmula:**")
        out.append("")
        for r in P["removidos"]:
            out.append(f"- {r}")
        out.append("")
    out.append("## 4. Mudanças e motivos")
    out.append("")
    for m in P["mudancas"]:
        out.append(f"- {m}")
    out.append("")
    out.append("## 5. Tabela nutricional no padrão ANVISA vigente (RDC 429/2020 + IN 75/2020)")
    out.append("")
    out.append(pr.get("tabela_intro", ""))
    out.append("")
    out.append(tab_md)
    out.append("")
    out.append(f"**Conta do valor energético e do sódio (calculado):** {conta_en} {pr.get('tabela_energia_obs','')}")
    out.append("")
    out.append("**Regras aplicadas (gabarito de 16/09/2026):** título \"INFORMAÇÃO NUTRICIONAL\"; porção = recomendação diária (RDC 429/2020, art. 9º, VI); %VD pelo Anexo VIII da IN 75/2020 para o grupo do rótulo (art. 12, §4º); constituinte sem VDR fica com a célula de %VD vazia (art. 12, §1º); quantidade não significativa (Anexo IV da IN 75: ≤ 4 kcal, ≤ 0,5 g de carboidratos/açúcares/proteínas/gorduras totais, ≤ 0,1 g de saturadas/trans, ≤ 5 mg de sódio) recebe %VD zero (art. 12, §2º); arredondamento pelo Anexo III da IN 75 na paráfrase do gabarito — ≥ 10: inteiro; 1 a 10: uma casa (inteiro se a casa for 0); < 1 em g: uma casa; < 1 em mg/µg: duas casas (uma se a segunda for 0) — regra não confirmada literalmente, ver pendência do gabarito; %VD arredondado ao inteiro (convenção; a regra literal de arredondamento do %VD não consta do gabarito). O valor energético seguiu as mesmas faixas (o gabarito diz não haver linha própria, sem confirmação literal). Rodapé literal do art. 12, §5º da RDC 429/2020.")
    out.append("")
    out.append("## 6. Lista de ingredientes proposta")
    out.append("")
    out.append(pr.get("ingredientes_intro", "Ordem decrescente de massa por porção (massa do insumo comercial, não do elemento), nomes técnicos e INS dos aditivos, seguida da declaração de alergênicos (RDC 26/2015)."))
    out.append("")
    out.append(f"> {P['ingredients_list']}")
    out.append("")
    if P.get("alergenicos_obs"):
        out.append(P["alergenicos_obs"])
        out.append("")
    out.append("## 7. Advertências obrigatórias")
    out.append("")
    out.append("**Texto proposto para o rótulo e para o campo `warnings` (as frases do art. 14, I, c/d/e da RDC 243/2018 vão em destaque e negrito):**")
    out.append("")
    out.append("> " + P["warnings"].replace("\n", "\n> "))
    out.append("")
    out.append("**Base de cada frase:**")
    out.append("")
    for b in P["advertencias_base"]:
        out.append(f"- {b}")
    out.append("")
    out.append("**O que falta hoje no cadastro/rótulo:** " + P["advertencias_faltam"])
    out.append("")
    out.append("## 8. Pendências e decisões do dono/RT")
    out.append("")
    for n, p in enumerate(P["pendencias"], 1):
        out.append(f"{n}. {p}")
    out.append("")
    if P.get("alternativas"):
        out.append("**Alternativas registradas (não são a proposta principal):**")
        out.append("")
        for a in P["alternativas"]:
            out.append(f"- {a}")
        out.append("")
    out.append("## 9. Veredito esperado após a reformulação")
    out.append("")
    out.append(f"**{P['veredito']}**")
    out.append("")
    out.append(P["veredito_texto"])
    out.append("")
    out.append("---")
    out.append("")
    out.append("**Arquivos-fonte (caminhos absolutos):**")
    out.append("")
    for f in P["fontes"]:
        out.append(f"- `{f}`")
    out.append("")
    return "\n".join(out), linhas, tab_txt, en, soma_ins, soma_exc

def _vd_json(d):
    """%VD para o JSON: escalar quando há um só grupo (adultos); dicionário quando há dois (gestantes/lactantes)."""
    conv = {k: (None if v is None else (v if isinstance(v, str) else round(v, 1))) for k, v in d.items()}
    if list(conv.keys()) == ["adultos"]:
        return conv["adultos"]
    return conv

def json_out(P, linhas, tab_txt, soma_ins, soma_exc):
    ins = []
    for i in P["insumos"]:
        lim = limites(P, i["const"])
        ins.append({
            "constituinte_anexo_i": i["const"],
            "forma_insumo": i["forma"],
            "massa_insumo_mg": round(i["massa"], 4),
            "teor_pct": i["teor"],
            "teor_fonte": i["teor_fonte"],
            "ativo_mg": round(i["ativo"] / 1000, 6) if i["unid"].startswith("µg") else round(i["ativo"], 4),
            "ativo_declarado": round(i["ativo"], 4),
            "unidade_ativo": i["unid"],
            "minimo": lim[0], "maximo": lim[1], "unidade_limite": lim[2],
            "minimo_txt": lim[3], "maximo_txt": lim[4],
            "pct_do_maximo": None if lim[1] is None else round(i["ativo"] / lim[1] * 100, 2),
            "linha_anexo": i["linha"],
            "laudo": i.get("laudo") or {"lote": None, "validade": None, "vencido": None},
            "status": i["status"], "motivo": i["motivo"],
            "conta": i.get("conta", ""),
            "ingredient_slug": i.get("ing_slug") or ING_SLUG[i["const"]],
            "ingredient_name": i["nome_cadastro"],
            "cadastro_quantidade": i.get("cadastro_qtd"), "cadastro_unidade": i.get("cadastro_unid"),
        })
    total = soma_ins + soma_exc
    return {
        "slug": P["slug"], "nome": P["nome"], "data": DATA,
        "porcao_mg": P["porcao_mg"], "porcao_descricao": P["porcao_desc"], "formato": P["formato"],
        "grupo_populacional": P["publico"], "porcoes_por_embalagem": P["porcoes"],
        "insumos": ins,
        "excipientes": [{"nome": e["nome"], "ins": e.get("ins"), "massa_mg": e["massa"], "obs": e.get("obs")} for e in P["excipientes"]],
        "removidos": P.get("removidos_json", []),
        "soma_insumos_mg": round(soma_ins, 3), "soma_excipientes_mg": round(soma_exc, 3),
        "soma_porcao_mg": round(total, 3), "cabe": total <= P["porcao_mg"] + 1e-6,
        "tabela_nutricional": {"porcoes_por_embalagem": P["porcoes"], "porcao": P["porcao_desc"],
                               "linhas": [{"item": l["item"], "quantidade": l["quantidade"], "unidade": l["unidade"],
                                           "vd_pct": _vd_json(l["vd_pct"])} for l in linhas],
                               "rodape": RODAPE_VD, "texto": tab_txt},
        "ingredients_list": P["ingredients_list"], "warnings": P["warnings"],
        "pendencias": P["pendencias"], "alternativas": P.get("alternativas", []),
        "mudancas": P["mudancas"], "veredito": P["veredito"],
    }

def sql_out(P, J):
    slug = P["slug"]
    lines = []
    lines.append(f"-- =====================================================================================")
    lines.append(f"-- Reformulação regulatória 2026-09-16 — {P['nome']} ({slug})")
    lines.append(f"-- Fragmento PL/pgSQL idempotente, casando por SLUG (nunca UUID), no estilo de")
    lines.append(f"-- supabase/migrations/20260920000000_composicoes_conforme_rotulo.sql.")
    lines.append(f"-- Fonte: docs/conformidade/reformulacao/{slug}.md e scratchpad/fase2/{slug}.json.")
    lines.append(f"-- Sem guarda de contagem aqui (a consolidação põe); só o bloco deste produto.")
    lines.append(f"-- NÃO APLICADO em nenhum banco. Veredito esperado: {P['veredito']}")
    lines.append(f"-- =====================================================================================")
    lines.append("")
    # insumos novos em ingredients (on conflict do nothing) — só os slugs usados que não existem
    novos = P.get("ingredients_novos", [])
    if novos:
        lines.append("-- insumos que public.ingredients (70 ativos lidos ao vivo em 16/09/2026) não tem — nome como no Anexo I")
        lines.append("insert into public.ingredients (slug, name, synonyms, category, sort_order, metadata) values")
        vals = []
        for k, (s, nome, cat, so) in enumerate(novos):
            vals.append(f"    ('{s}', '{nome}', ARRAY['{nome}']::text[], '{cat}'::public.ingredient_category, {so}, '{{\"fonte\": \"reformulacao_2026-09-16\", \"criado_por\": \"fase2/{slug}.sql\"}}'::jsonb)")
        lines.append(",\n".join(vals))
        lines.append("on conflict (slug) do nothing;")
        lines.append("")
    lines.append("-- 1. exclusão lógica das composições ativas atuais desta fórmula")
    lines.append("update public.formula_compositions fc")
    lines.append("set active = false, deleted_at = now(), reason_deleted = 'reformulação regulatória 2026-09-16'")
    lines.append("from public.formulas f")
    lines.append(f"where f.id = fc.formula_id and f.deleted_at is null and f.slug = '{slug}'")
    lines.append("  and fc.deleted_at is null")
    lines.append("  and coalesce(fc.metadata->>'fonte', '') <> 'reformulacao_2026-09-16';")
    lines.append("")
    lines.append("-- 2. inserção das composições reformuladas (ingredient_id resolvido por slug; só se ainda não houver linha desta fonte)")
    lines.append("insert into public.formula_compositions (formula_id, ingredient_name, quantity, unit, sort_order, ingredient_id, metadata)")
    lines.append("select f.id, v.ingredient_name, v.quantity, v.unit::public.composition_unit, v.sort_order, i.id, v.metadata::jsonb")
    lines.append("from (values")
    vals = []
    n = 0
    for i in J["insumos"]:
        unit = "mcg" if i["unidade_ativo"].startswith("µg") else "mg"
        q = i["ativo_declarado"]
        if i.get("cadastro_quantidade") is not None:
            q, unit = i["cadastro_quantidade"], i["cadastro_unidade"]
        meta = {"fonte": "reformulacao_2026-09-16", "constituinte_anexo_i": i["constituinte_anexo_i"],
                "forma_insumo": i["forma_insumo"], "massa_insumo_mg": i["massa_insumo_mg"],
                "laudo_lote": i["laudo"].get("lote"), "laudo_validade": i["laudo"].get("validade"),
                "laudo_vencido": i["laudo"].get("vencido"), "teor_pct": i["teor_pct"], "teor_fonte": i["teor_fonte"],
                "ativo_mg": i["ativo_mg"], "unidade_ativo": i["unidade_ativo"], "minimo": i["minimo"], "maximo": i["maximo"],
                "pct_do_maximo": i["pct_do_maximo"], "linha_anexo": i["linha_anexo"], "status": i["status"],
                "e_sal": False, "observacao": i["motivo"]}
        m = json.dumps(meta, ensure_ascii=False).replace("'", "''")
        vals.append(f"    ('{slug}', {n}, '{i['ingredient_name'].replace(chr(39), chr(39)*2)}', {q}, '{unit}', '{i['ingredient_slug']}', '{m}')")
        n += 1
    for e in P["excipientes"]:
        if e.get("sql_slug") and e["massa"] is not None:
            meta = {"fonte": "reformulacao_2026-09-16", "excipiente": True, "ins": e.get("ins"), "observacao": e.get("obs")}
            m = json.dumps(meta, ensure_ascii=False).replace("'", "''")
            vals.append(f"    ('{slug}', {n}, '{e['nome_cadastro']}', {round(e['massa'],3)}, 'mg', '{e['sql_slug']}', '{m}')")
            n += 1
    lines.append(",\n".join(vals))
    lines.append(") as v(slug, sort_order, ingredient_name, quantity, unit, ingredient_slug, metadata)")
    lines.append("join public.formulas f on f.slug = v.slug and f.deleted_at is null")
    lines.append("join public.ingredients i on i.slug = v.ingredient_slug and i.deleted_at is null")
    lines.append("where not exists (")
    lines.append("    select 1 from public.formula_compositions x")
    lines.append("    where x.formula_id = f.id and x.deleted_at is null and x.metadata->>'fonte' = 'reformulacao_2026-09-16'")
    lines.append(");")
    lines.append("")
    lines.append("-- 3. campos de rotulagem da fórmula (nutritional_info é TEXT no banco vivo; o JSON da tabela vai em metadata)")
    tab_json = json.dumps(J["tabela_nutricional"], ensure_ascii=False).replace("'", "''")
    ni = J["tabela_nutricional"]["texto"].replace("'", "''").replace("\n", "\\n")
    il = J["ingredients_list"].replace("'", "''")
    wn = J["warnings"].replace("'", "''").replace("\n", "\\n")
    sd = P["porcao_desc"].replace("'", "''")
    lines.append("update public.formulas set")
    lines.append(f"    ingredients_list = '{il}',")
    lines.append(f"    warnings = E'{wn}',")
    lines.append(f"    nutritional_info = E'{ni}',")
    lines.append(f"    serving_description = 'Porção: {sd}',")
    if P.get("target_audience_sql"):
        lines.append(f"    target_audience = '{P['target_audience_sql']}',")
    lines.append(f"    metadata = coalesce(metadata, '{{}}'::jsonb) || jsonb_build_object('reformulacao_2026_09_16', '{tab_json}'::jsonb)")
    lines.append(f"where slug = '{slug}' and deleted_at is null;")
    lines.append("")
    return "\n".join(lines)

def gerar(P):
    md, linhas, tab_txt, en, soma_ins, soma_exc = memorial_md(P)
    J = json_out(P, linhas, tab_txt, soma_ins, soma_exc)
    sql = sql_out(P, J)
    open(f"{OUT_MD}/{P['slug']}.md", "w").write(md)
    json.dump(J, open(f"{OUT_SCR}/{P['slug']}.json", "w"), ensure_ascii=False, indent=1)
    open(f"{OUT_SCR}/{P['slug']}.sql", "w").write(sql)
    print(f"{P['slug']}: insumos {len(P['insumos'])} · soma {soma_ins+soma_exc:.2f} mg · cabe {J['cabe']} · kcal {en['kcal']:.2f} · Na {en['na']:.2f} mg")
    return J
