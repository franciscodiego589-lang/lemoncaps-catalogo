# -*- coding: utf-8 -*-
"""Compara o mesmo insumo entre os 24 JSONs da fase 2: forma, teor efetivo, lote, validade, slug, nome do constituinte."""
import json, re, sys
from collections import defaultdict
sys.path.insert(0, ".")
from verificar import carregar, GRUPO_DE, nome_constituinte, ativo_mg, num, teor_efetivo, sem_acento, retirado, fmt

dados = carregar()
por_insumo = defaultdict(list)
def chave_insumo(ins):
    f = sem_acento(ins.get("forma_insumo") or "")
    c = sem_acento(ins.get("constituinte_anexo_i") or "")
    txt = f + " " + c
    regras = [("bisglicinato de zinco", "zinco"), ("oxido de magnesio", "magnesio-oxido"), ("bisglicinato de magnesio", "magnesio-bisglicinato"), ("glicinato 30", "magnesio-bisglicinato"),
              ("cloreto de magnesio", "magnesio-cloreto"), ("cloridrato de piridoxina", "b6"), ("piridoxina", "b6"), ("metilcobalamina", "b12-metil"), ("colecalciferol", "d3"), ("vitamina d", "d3"),
              ("acido ascorbico", "vitc"), ("retinol", "vita"), ("retinila", "vita"), ("tocoferol", "vite"), ("pantotenato", "b5"), ("nicotinamida", "b3"), ("niacinamida", "b3"),
              ("tiamina", "b1"), ("riboflavina", "b2"), ("acido folico", "b9"), ("d-biotina", "biotina"), ("biotina", "biotina"), ("menaquinona", "k2"), ("picolinato de cromo", "cromo"),
              ("selenito", "selenio"), ("bisglicinato de cobre", "cobre"), ("bisglicinato ferroso", "ferro"), ("tetraborato", "boro"), ("iodeto", "iodo"), ("carbonato de calcio", "calcio"),
              ("teanina", "teanina"), ("tirosina", "tirosina"), ("triptofano", "triptofano"), ("glutamina", "glutamina"), ("aspartico", "aspartico"), ("metionina", "metionina"), ("cisteina", "cisteina"),
              ("carnitina", "carnitina"), ("taurina", "taurina"), ("beta-alanina", "beta-alanina"), ("arginina", "arginina"), ("creatina", "creatina"), ("cafeina anidra", "cafeina-anidra"), ("cafeina/1,3,7", "cafeina-anidra"),
              ("guarana", "guarana"), ("melatonina", "melatonina"), ("inositol", "inositol"), ("colina", "colina"), ("metilsulfonilmetano", "msm"), ("hialuron", "hialuronato"), ("orto-silicico", "silicio"),
              ("glucosamina", "glucosamina"), ("colageno tipo ii", "colageno-ii"), ("colageno hidrolisado", "colageno-hidrolisado"), ("cafe verde", "cafe-verde"), ("laranja moro", "laranja-moro"),
              ("curcuma", "curcuma"), ("feno-grego", "feno-grego"), ("quercetina", "quercetina"), ("psyllium", "psyllium"), ("inulina", "inulina"), ("frutooligo", "fos"), ("quitosana", "quitosana"), ("espirulina", "espirulina"), ("oleo de peixe", "oleo-peixe"), ("epa", "epa-dha"), ("dha", "epa-dha")]
    for k, v in regras:
        if k in txt: return v
    return "?" + txt[:30]

for slug, d in dados.items():
    for ins in d["insumos"]:
        if retirado(ins): continue
        k = chave_insumo(ins)
        m = num(ins.get("massa_insumo_mg")); a = ativo_mg(ins, GRUPO_DE[slug])
        tipo, fator = teor_efetivo(ins)
        teor_ef = (a / m * 100.0) if (m and a is not None) else None
        por_insumo[k].append(dict(slug=slug, grupo=GRUPO_DE[slug], forma=ins.get("forma_insumo"), constituinte=ins.get("constituinte_anexo_i"),
                                  teor_pct=ins.get("teor_pct"), teor_ef=teor_ef, tipo=tipo, potencia=fator if tipo != "teor" else None,
                                  lote=(ins.get("laudo") or {}).get("lote"), validade=(ins.get("laudo") or {}).get("validade"), vencido=(ins.get("laudo") or {}).get("vencido"),
                                  ingredient_slug=ins.get("ingredient_slug"), nome_cat=ins.get("ingredient_name") or ins.get("nome_composicao"), status=ins.get("status")))
out = []
for k in sorted(por_insumo):
    linhas = por_insumo[k]
    if len(linhas) < 2: continue
    lotes = {re.sub(r"\s*\(.*", "", str(x["lote"] or "—")).strip() for x in linhas}
    teores = {round(x["teor_ef"], 2) if x["teor_ef"] is not None else (f"pot {x['potencia']}" if x["potencia"] else None) for x in linhas}
    slugs_i = {x["ingredient_slug"] for x in linhas}
    grupos = {x["grupo"] for x in linhas}
    flag = ("LOTE≠" if len(lotes) > 1 else "") + (" TEOR≠" if len({t for t in teores if t is not None}) > 1 else "") + (" SLUG≠" if len(slugs_i) > 1 else "")
    out.append(f"\n=== {k}  [{', '.join(sorted(grupos))}] {flag}")
    for x in linhas:
        out.append(f"   {x['grupo']} {x['slug']:44s} teor_pct={x['teor_pct']} teor_ef={fmt(x['teor_ef'],2) if x['teor_ef'] else '—'} pot={x['potencia']} lote={str(x['lote'])[:45]} val={x['validade']} venc={x['vencido']} slug={x['ingredient_slug']} nome={str(x['nome_cat'])[:50]}")
print("\n".join(out))
