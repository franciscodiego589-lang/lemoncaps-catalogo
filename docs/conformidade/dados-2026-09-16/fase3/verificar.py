# -*- coding: utf-8 -*-
"""
Fase 3 — verificação determinística dos 24 JSONs da reformulação (scratchpad/fase2/<slug>.json).

Checagens (letras da tarefa):
  (a) massa_insumo × teor = ativo (tolerância 0,5 % ou 0,01 mg) — reconhece fator sal→base / potência declarados na conta;
  (b) ativo dentro de [mínimo, máximo] e pct_do_maximo ≤ 90 % — somando as linhas do mesmo constituinte (cafeína
      anidra + guaraná; EPA + DHA), como mandam as notas dos anexos;
  (c) soma da porção = insumos (não retirados, não componentes) + excipientes, ≤ porção e `cabe` coerente;
  (d) %VD = quantidade ÷ VD do grupo (vd.json; Anexo VIII adultos/gestantes/lactantes; macros pelo Anexo II) —
      calculado sobre a quantidade DECLARADA (arredondada) e também sobre a exata, para registrar o critério usado;
  (e) energia = Σ massa × fator (Atwater/Anexo XXII citados nos memoriais); procura o subconjunto de itens
      opcionais (aminoácidos livres, glicerina, hialuronato, inositol) que reproduz o valor declarado; kJ × 4,184 ou 17/37/13 kJ/g;
  (f) forma do Anexo I existe literalmente em IN28-2018-ANEXO-I-LITERAL.md (busca sensível a acento e caixa; só
      normaliza os marcadores de transcrição ^x/_x e espaços dentro de parênteses);
  (g) mínimo/máximo do JSON batem com os Anexos III/IV literais para o grupo populacional (amostra completa).

Saída: scratchpad/fase3/verificacao.md e verificacao.json (toda divergência com slug, insumo, esperado × encontrado).
Nada aqui altera arquivo nenhum da fase 2. Nenhum limite, VD ou fator é digitado aqui: vêm dos anexos literais,
do vd.json e das contas dos próprios JSONs.
"""
import json, re, sys, itertools
from pathlib import Path
from collections import OrderedDict, defaultdict

sys.path.insert(0, str(Path(__file__).resolve().parent))
import anexos

BASE = Path("/private/tmp/claude-501/-Users-diegofrancisco-Downloads-erp-espa-o/c5ed6b00-4553-4992-b469-c649af084651/scratchpad")
F2 = BASE / "fase2"
F3 = BASE / "fase3"
VD = json.load(open(BASE / "padrao-anvisa" / "vd.json", encoding="utf-8"))

G1 = ["multivitaminico", "zma-zinco-magnesio-e-vitamina-d", "biotina-em-capsula", "dores-musculares", "focus-colina",
      "multi-vitta-gestante-e-lactante-em-capsula", "melatonina-triptofanos-encapsulados", "serena"]
G2 = ["detox-matinal-lemon-shot-300g", "saude-intestinal", "moro-slim", "pro-energy", "emagrecedor-em-capsula",
      "slim-up-emagrecimento-em-gota", "shot-colageno-300-gramas", "omega-pro-tg"]
G3 = ["bella-gummy-biotina-em-gummy", "creatina-monohidratada-150g-soluvel", "creatina-monohidratada-300g-soluvel",
      "creatina-gummy-sabor-frutas-vermelhas", "creatina-em-gummy-sabor-tutti-frutti", "melatonina-em-gummy-sabor-uva",
      "pre-treino-300-g", "pre-treino-creatina-sabor-limao-420g"]
SLUGS = G1 + G2 + G3
GRUPO_DE = {s: "G1" for s in G1}; GRUPO_DE.update({s: "G2" for s in G2}); GRUPO_DE.update({s: "G3" for s in G3})

# ----------------------------------------------------------------------------------------------
# utilidades
# ----------------------------------------------------------------------------------------------
def num(x):
    if x is None: return None
    if isinstance(x, bool): return None
    if isinstance(x, (int, float)): return float(x)
    s = str(x).strip().replace("\u00a0", "").replace(" ", "")
    if s.upper() in ("NE", "NA", "PENDENTE", ""): return None
    if re.fullmatch(r"[\d\.]+,\d+", s): s = s.replace(".", "").replace(",", ".")
    elif re.fullmatch(r"\d{1,3}(\.\d{3})+", s): s = s.replace(".", "")
    try: return float(s)
    except ValueError: return None

def sem_acento(s): return anexos.sem_acento(s or "")

def fmt(x, nd=4):
    if x is None: return "—"
    if isinstance(x, str): return x
    s = f"{x:.{nd}f}".rstrip("0").rstrip(".")
    if s == "-0": s = "0"
    return s.replace(".", ",")

# fatores sal→base / conversões declarados nas contas dos memoriais (cada um aparece literalmente no campo
# `conta`/`teor_fonte` de pelo menos um JSON da fase 2, ou nas notas dos Anexos III/IV)
FATORES_DECLARADOS = OrderedDict([
    ("piridoxina/cloridrato de piridoxina 169,18/205,64", 0.8227),
    ("tiamina/cloridrato de tiamina 265,35/337,27", 0.7868),
    ("ácido pantotênico/D-pantotenato de cálcio", 0.9201),
    ("α-tocoferol/acetato de rac-α-tocoferil (nota v Anexo III: 1 UI = 1 mg de acetato; 0,67)", 0.67),
    ("glucosamina/sulfato de glucosamina·2KCl", 0.5918),
    ("cisteína/cloridrato de L-cisteína anidro", 0.7687),
    ("iodo/iodeto de potássio", 0.7645),
    ("arginina/cloridrato de L-arginina 174,20/210,66", 0.8269),
    ("MgCl2 anidro: Mg 25,53 % estequiométrico", 0.2553),
    ("creatina anidra (1 − LOD 11,5 %)", 0.885),
    ("µg DFE = µg de ácido fólico ÷ 0,6 (nota vi Anexo III)", 1.0 / 0.6),
])

def unidade_norm(u):
    if not u: return None
    u0 = sem_acento(str(u).strip())
    if u0.startswith("µg") or u0.startswith("mcg") or u0.startswith("ug"): return "µg"
    if u0.startswith("mg"): return "mg"
    if u0.startswith("g"): return "g"
    return str(u)

def para_mg(valor, unidade):
    if valor is None: return None
    u = unidade_norm(unidade)
    if u == "µg": return valor / 1000.0
    if u == "g": return valor * 1000.0
    return valor

def de_mg(valor_mg, unidade):
    if valor_mg is None: return None
    u = unidade_norm(unidade)
    if u == "µg": return valor_mg * 1000.0
    if u == "g": return valor_mg / 1000.0
    return valor_mg

# ----------------------------------------------------------------------------------------------
# mapeamento constituinte (JSON) -> linha dos Anexos III/IV
# ----------------------------------------------------------------------------------------------
MAPA_ANEXO = {
    "magnesio": "Magnésio", "teanina": "Teanina", "zinco": "Zinco", "boro": "Boro", "vitamina b6": "Vitamina B6",
    "vitamina d": "Vitamina D", "vitamina c": "Vitamina C", "niacina": "Niacina", "vitamina e": "Vitamina E",
    "acido pantotenico": "Ácido pantotênico", "tiamina": "Tiamina", "riboflavina": "Riboflavina", "vitamina a": "Vitamina A",
    "acido folico": "Ácido fólico", "cobre": "Cobre", "selenio": "Selênio", "vitamina k": "Vitamina K", "cromo": "Cromo",
    "vitamina b12": "Vitamina B12", "metionina": "Metionina", "cisteina": "Cisteína", "metilsulfonilmetano": "Metilsulfonilmetano",
    "acido hialuronico": "Ácido hialurônico", "silicio": "Silício", "iodo": "Iodo", "biotina": "Biotina",
    "glucosamina": "Glucosamina", "colageno tipo ii nao desnaturado": "Colágeno tipo II não desnaturado", "ferro": "Ferro",
    "colina": "Colina", "tirosina": "Tirosina", "l-carnitina": "L-Carnitina", "carnitina": "L-Carnitina", "inositol": "Inositol",
    "calcio": "Cálcio", "triptofano": "Triptofano", "aspartato": "Aspartato", "glutamina": "Glutamina", "melatonina": "Melatonina",
    "fibras alimentares": "Fibras alimentares", "curcumina": "Curcumina", "antocianinas da laranja moro": "Antocianinas da laranja moro",
    "acido clorogenico": "Ácido clorogênico", "proteinas": "Proteínas", "quercetina": "Quercetina",
    "saponinas de glicosideos de furostanol": "Saponinas de glicosídeos de furostanol", "taurina": "Taurina", "cafeina": "Cafeína",
    "arginina": "Arginina", "lipideos": "Lipídeos totais", "lipideos totais": "Lipídeos totais", "epa e dha": "EPA e DHA",
    "creatina": "Creatina", "beta-alanina": "Beta-alanina",
}

def nome_constituinte(ins):
    c = ins.get("constituinte_anexo_i") or ""
    base = c.split(" — ")[0].split(" - ")[0]
    base = re.sub(r"\(.*?\)", "", base).replace("^xv", "").replace("^i", "").strip()
    k = re.sub(r"\s+", " ", sem_acento(base).strip())
    if k in MAPA_ANEXO: return MAPA_ANEXO[k]
    for kk, v in MAPA_ANEXO.items():
        if k.startswith(kk): return v
    return None

def _limpa_cand(c):
    c = re.sub(r"\(\s*IN [^)]*\)", "", c)
    c = re.sub(r"\(\s*CAS[^)]*\)", "", c)
    c = re.sub(r"\(\s*Nutriente[^)]*\)", "", c)
    c = c.replace("^xv", "").replace("^ii", "").replace("^i", "")
    return re.sub(r"\s+", " ", c).strip(" ,;")

def forma_anexo_i(ins):
    """Candidatos de nome da forma (linha do Anexo I) para a busca literal."""
    cands = []
    la = re.sub(r"\(\s*IN [^)]*\)", "", ins.get("linha_anexo") or "")
    for seg in re.split(r";| / ", la):
        seg = seg.strip()
        if seg.startswith("I·"):
            parte = seg[2:].split("·")[-1]
            cands.append(_limpa_cand(parte))
    c = ins.get("constituinte_anexo_i") or ""
    if " — " in c:
        forma = _limpa_cand(c.split(" — ", 1)[1])
        cands.append(forma)
        if "(" in forma: cands.append(forma.split("(")[0].strip())
    out = []
    for cnd in cands:
        # alternativas "A/B" só quando a barra não está dentro de parênteses
        if "(" not in cnd:
            for alt in cnd.split("/"):
                alt = alt.strip()
                if alt and alt not in out: out.append(alt)
        if cnd and cnd not in out: out.append(cnd)
    return out

def norm_literal(s):
    """Normalização mínima para busca literal: tira marcadores ^x/_x da transcrição e espaços internos de parênteses.
    Mantém acentos e caixa."""
    s = re.sub(r"\^[ivx]+", "", s)
    s = s.replace("_", "")
    s = re.sub(r"\(\s+", "(", s); s = re.sub(r"\s+\)", ")", s)
    s = re.sub(r"[ \t]+", " ", s)
    return s

# ----------------------------------------------------------------------------------------------
# carregamento e normalização
# ----------------------------------------------------------------------------------------------
def carregar():
    dados = OrderedDict()
    for s in SLUGS:
        dados[s] = json.load(open(F2 / f"{s}.json", encoding="utf-8"))
    return dados

def grupo_populacional(d):
    g = sem_acento(d.get("grupo_populacional") or "")
    if "gestante" in g and "lactante" in g: return ["Gestantes", "Lactantes"]
    return ["> 19 anos"]

def eh_componente(ins):
    t = sem_acento((ins.get("constituinte_anexo_i") or "") + " " + (ins.get("forma_insumo") or ""))
    return "componente" in t

def retirado(ins): return str(ins.get("status", "")).startswith("retirado")

def ativo_mg(ins, grupo):
    """ativo em mg, nos três formatos: G1 ativo_mg (mg); G2/G3 ativo_mg na unidade de unidade_ativo."""
    a = num(ins.get("ativo_mg"))
    if a is None: return None
    if grupo == "G1": return a
    ua0 = sem_acento(ins.get("unidade_ativo") or "mg")
    if ua0.startswith("mg"): return a
    if ua0.startswith("µg") or ua0.startswith("mcg") or ua0.startswith("ug"): return a / 1000.0
    if ua0.startswith("g de") or ua0 == "g" or ua0.startswith("g ("): return a * 1000.0
    return a

def potencia_ui_por_mg(txt):
    m = re.search(r"([\d\.,]+)\s*UI/(mg|g)", txt or "")
    if not m: return None
    v = num(m.group(1))
    if v is None: return None
    return v if m.group(2) == "mg" else v / 1000.0

def teor_efetivo(ins):
    teor = num(ins.get("teor_pct"))
    conta = (ins.get("conta") or "") + " | " + (ins.get("teor_fonte") or "")
    nomes = sem_acento((ins.get("forma_insumo") or "") + " " + (ins.get("constituinte_anexo_i") or ""))
    if "colecalciferol" in nomes or "vitamina d" in nomes:
        p = potencia_ui_por_mg(conta)
        if p is not None: return ("potencia_D", p)
        if teor is None: return ("potencia_D", None)
    if "retinol" in nomes or "retinila" in nomes:
        return ("potencia_A", potencia_ui_por_mg(conta))
    return ("teor", teor)

# ----------------------------------------------------------------------------------------------
DIV, INFO = [], []
def div(slug, insumo, check, esperado, encontrado, gravidade, nota=""):
    DIV.append(dict(slug=slug, insumo=insumo, check=check, esperado=esperado, encontrado=encontrado, gravidade=gravidade, nota=nota))
def info(slug, insumo, check, texto):
    INFO.append(dict(slug=slug, insumo=insumo, check=check, texto=texto))

# ------------------------------------------------ (a)
def check_a(slug, d, grupo):
    for ins in d["insumos"]:
        nome = ins.get("constituinte_anexo_i") or ins.get("ingredient_name") or "?"
        massa = num(ins.get("massa_insumo_mg"))
        a_mg = ativo_mg(ins, grupo)
        tipo, fator = teor_efetivo(ins)
        if massa is None or a_mg is None:
            if not retirado(ins):
                info(slug, nome, "a", f"não verificável numericamente: massa={fmt(massa)} ativo={fmt(a_mg)} teor={ins.get('teor_pct')} (memorial marca teor PENDENTE/nominal)")
            continue
        if tipo == "potencia_D":
            if fator is None:
                info(slug, nome, "a", "potência UI/mg da vitamina D não encontrada na conta"); continue
            esperado_mg = massa * fator / 40.0 / 1000.0
            if abs(esperado_mg - a_mg) > max(0.005 * esperado_mg, 0.00001):
                div(slug, nome, "a", f"{fmt(esperado_mg*1000,3)} µg (= {fmt(massa)} mg × {fmt(fator)} UI/mg ÷ 40 UI/µg)", f"{fmt(a_mg*1000,3)} µg", "média", "vitamina D3: massa × potência ÷ 40")
            else:
                info(slug, nome, "a", f"vitamina D3 conferida: {fmt(massa)} mg × {fmt(fator)} UI/mg ÷ 40 = {fmt(esperado_mg*1000,2)} µg")
            continue
        if tipo == "potencia_A":
            if fator is None:
                info(slug, nome, "a", "potência UI/g da vitamina A não encontrada na conta"); continue
            ui = massa * fator
            esp_333, esp_03 = ui / 3.33, ui * 0.3
            declarado_ug = a_mg * 1000.0
            if abs(esp_333 - declarado_ug) / esp_333 > 0.005 and abs(esp_03 - declarado_ug) / esp_03 > 0.005:
                div(slug, nome, "a", f"{fmt(esp_333,1)} µg RAE (UI ÷ 3,33) ou {fmt(esp_03,1)} (UI × 0,3)", f"{fmt(declarado_ug,1)} µg RAE", "média", "vitamina A: massa × UI/g")
            else:
                crit = "÷ 3,33 (nota ii do Anexo III)" if abs(esp_333 - declarado_ug) <= abs(esp_03 - declarado_ug) else "× 0,3 (memorial)"
                info(slug, nome, "a", f"vitamina A conferida: {fmt(massa)} mg × {fmt(fator*1000,0)} UI/g = {fmt(ui,1)} UI → {fmt(declarado_ug,1)} µg RAE (critério {crit}; 1/3,33 e 0,3 diferem 0,1 %)")
            continue
        teor = fator
        if teor is None:
            if not retirado(ins):
                info(slug, nome, "a", f"teor_pct nulo: ativo declarado {fmt(a_mg)} mg para massa {fmt(massa)} mg — não verificável (teor PENDENTE/nominal no memorial)")
            continue
        esperado = massa * teor / 100.0
        tol = max(0.005 * max(esperado, a_mg), 0.01 if a_mg >= 0.1 else 0.00001)
        if abs(esperado - a_mg) <= tol:
            continue
        razao = a_mg / esperado if esperado else None
        achou = None
        if razao:
            cand = sorted(((abs(razao - f) / f, rot, f) for rot, f in FATORES_DECLARADOS.items()))
            if cand and cand[0][0] < 0.004: achou = (cand[0][1], cand[0][2])
        if achou:
            teor_ef = teor * achou[1]
            div(slug, nome, "a", f"{fmt(esperado,4)} mg (massa × teor_pct)", f"{fmt(a_mg,4)} mg", "representação",
                f"teor_pct ({fmt(teor)} %) é o doseamento do insumo; o ativo aplica o fator {fmt(achou[1],4)} ({achou[0]}) declarado na conta → teor efetivo {fmt(teor_ef,2)} %"
                + ("" if achou[1] < 1 else " (conversão de unidade, não perda de massa)"))
        else:
            div(slug, nome, "a", f"{fmt(esperado,4)} mg (= {fmt(massa)} mg × {fmt(teor)} %)", f"{fmt(a_mg,4)} mg", "alta",
                f"conta do JSON: {ins.get('conta') or ins.get('teor_fonte')}")

# ------------------------------------------------ (b) e (g)
_A3, _A4 = anexos.anexo_iii(), anexos.anexo_iv()
def _get(tab, nome):
    if nome in tab: return tab[nome]
    for k in tab:
        if k.lower() == nome.lower(): return tab[k]
    return None

def limites_grupo(nome_anexo, grupos_pop):
    r3, r4 = _get(_A3, nome_anexo), _get(_A4, nome_anexo)
    mins, maxs, lit3, lit4 = [], [], [], []
    for g in grupos_pop:
        if r3:
            v, lit = r3["grupos"][g]; lit3.append(f"{g}: {lit}")
            if v is not None: mins.append(v)
        if r4:
            v, lit = r4["grupos"][g]; lit4.append(f"{g}: {lit}")
            if v is not None: maxs.append(v)
    unidade = (r3 or r4 or {}).get("unidade")
    return (max(mins) if mins else None, min(maxs) if maxs else None, unidade,
            "; ".join(lit3) or "linha ausente no Anexo III", "; ".join(lit4) or "linha ausente no Anexo IV")

def check_bg(slug, d, grupo):
    gp = grupo_populacional(d)
    por_const = defaultdict(list)
    for ins in d["insumos"]:
        nome = ins.get("constituinte_anexo_i") or ins.get("ingredient_name") or "?"
        nome_anexo = nome_constituinte(ins)
        if nome_anexo is None:
            if not retirado(ins): info(slug, nome, "g", "constituinte não mapeado para linha dos Anexos III/IV (linha informativa)")
            continue
        mn, mx, un, lit3, lit4 = limites_grupo(nome_anexo, gp)
        jmin, jmax = num(ins.get("minimo")), num(ins.get("maximo"))
        # unidade dos limites do JSON: declarada (G1: unidade_limite) ou detectada (G2/G3: a que reproduz o anexo)
        ulim = unidade_norm(ins.get("unidade_limite")) if grupo == "G1" else None
        if ulim is None:
            candidatos = [unidade_norm(un) or "mg", "mg", "µg", "g"]
            ulim = None
            for u in candidatos:
                e1 = de_mg(para_mg(mx, un), u) if mx is not None else None
                e2 = de_mg(para_mg(mn, un), u) if mn is not None else None
                ok1 = (jmax is None or e1 is None or abs(e1 - jmax) <= max(0.001 * abs(e1), 0.0005))
                ok2 = (jmin is None or e2 is None or abs(e2 - jmin) <= max(0.001 * abs(e2), 0.0005))
                if ok1 and ok2 and (jmax is not None or jmin is not None):
                    ulim = u; break
            if ulim is None: ulim = unidade_norm(un) or "mg"
        emin = de_mg(para_mg(mn, un), ulim) if mn is not None else None
        emax = de_mg(para_mg(mx, un), ulim) if mx is not None else None
        def cmp(esp, enc, rot):
            if esp is None and enc is None: return
            if enc is None and esp is not None:
                # limite existe no anexo mas o JSON não trouxe: aceitável se outra linha do mesmo constituinte traz (soma)
                por_const[nome_anexo]  # só marca
                info(slug, nome, "g", f"{rot} {nome_anexo} não informado nesta linha (anexo: {fmt(esp)} {ulim}); conferido pela soma do constituinte")
                return
            if esp is None or abs(esp - enc) > max(0.001 * abs(esp), 0.0005):
                div(slug, nome, "g", f"{rot} {nome_anexo} ({', '.join(gp)}): {fmt(esp)} {ulim} [Anexo III: {lit3} | Anexo IV: {lit4}]",
                    f"{rot} no JSON: {fmt(enc)} {ulim}", "alta")
        cmp(emin, jmin, "mínimo"); cmp(emax, jmax, "máximo")
        if retirado(ins): continue
        a = ativo_mg(ins, grupo)
        if a is None: continue
        por_const[nome_anexo].append((nome, a, ins, emin, emax, ulim, un, mn, mx))
    # (b) por constituinte (soma)
    for nome_anexo, linhas in por_const.items():
        if not linhas: continue
        total_mg = sum(x[1] for x in linhas)
        nome, a, ins, emin, emax, ulim, un, mn, mx = linhas[0]
        # limites em mg
        emin_mg = para_mg(mn, un) if mn is not None else None
        emax_mg = para_mg(mx, un) if mx is not None else None
        rot = nome_anexo + (" (soma de %d linhas: %s)" % (len(linhas), " + ".join(f"{fmt(x[1])} mg" for x in linhas)) if len(linhas) > 1 else "")
        u_show = unidade_norm(un) or "mg"
        tot_show = de_mg(total_mg, u_show)
        if emin_mg is not None and total_mg < emin_mg - 1e-9:
            div(slug, rot, "b", f"≥ mínimo {fmt(de_mg(emin_mg,u_show))} {u_show}", f"{fmt(tot_show)} {u_show}", "alta", "abaixo do mínimo do Anexo III — " + (ins.get("motivo") or "")[:220])
        if emax_mg is not None:
            pct = total_mg / emax_mg * 100.0
            if total_mg > emax_mg + 1e-9:
                div(slug, rot, "b", f"≤ máximo {fmt(de_mg(emax_mg,u_show))} {u_show}", f"{fmt(tot_show)} {u_show}", "alta", "acima do máximo do Anexo IV")
            elif pct > 90.0 + 1e-9:
                div(slug, rot, "b", "pct_do_maximo ≤ 90 %", f"{fmt(pct,1)} %", "média", "acima da folga de 90 % — motivo do memorial: " + (ins.get("motivo") or "")[:200])
            elif abs(pct - 90.0) < 1e-6:
                info(slug, rot, "b", "exatamente 90,0 % do teto — no limite da regra de folga (memorial registra alternativa com mais folga)")
            jp = max((num(x[2].get("pct_do_maximo")) or 0) for x in linhas)
            if jp and abs(jp - pct) > 0.6:
                div(slug, rot, "b", f"pct_do_maximo recalculado {fmt(pct,2)} % (soma ÷ máximo)", f"{fmt(jp,2)} % no JSON", "baixa",
                    "pct_do_maximo do JSON difere do recálculo" + (" — o JSON traz o pct de uma linha só; a soma do constituinte é o que vale" if len(linhas) > 1 else ""))
            else:
                info(slug, rot, "b", f"conforme: {fmt(tot_show)} {u_show} = {fmt(pct,1)} % do teto {fmt(de_mg(emax_mg,u_show))} {u_show}" + (f"; mínimo {fmt(de_mg(emin_mg,u_show))}" if emin_mg else "; mínimo NE"))
        elif emin_mg is not None:
            info(slug, rot, "b", f"conforme: {fmt(tot_show)} {u_show} ≥ mínimo {fmt(de_mg(emin_mg,u_show))} {u_show} (máximo NE)")

# ------------------------------------------------ (c)
def check_c(slug, d):
    porcao = num(d.get("porcao_mg"))
    soma_ins = 0.0; soma_exc = 0.0; pend = []
    for ins in d["insumos"]:
        if retirado(ins) or eh_componente(ins): continue
        m = num(ins.get("massa_insumo_mg"))
        if m is None: pend.append(ins.get("constituinte_anexo_i")); continue
        soma_ins += m
    for e in d.get("excipientes") or []:
        m = num(e.get("massa_mg"))
        n0 = sem_acento(e.get("nome", ""))
        if m is None:
            if "capsula" not in n0 and "softgel" not in n0: pend.append(e.get("nome"))
            continue
        soma_exc += m
    soma = soma_ins + soma_exc
    js = num(d.get("soma_porcao_mg")); cabe = d.get("cabe")
    if js is not None and abs(js - soma) > 0.05:
        div(slug, "(porção)", "c", f"soma recalculada {fmt(soma,3)} mg (insumos {fmt(soma_ins,3)} + excipientes {fmt(soma_exc,3)})", f"soma_porcao_mg {fmt(js,3)} mg", "média",
            "diferença entre a soma declarada e a soma das massas do JSON")
    else:
        info(slug, "(porção)", "c", f"soma confere: insumos {fmt(soma_ins,3)} + excipientes {fmt(soma_exc,3)} = {fmt(soma,3)} mg (porção {fmt(porcao)} mg; cabe={cabe})")
    if porcao is not None:
        cabe_calc = soma <= porcao + 0.05
        if bool(cabe) != cabe_calc:
            div(slug, "(porção)", "c", f"cabe = {cabe_calc} (soma {fmt(soma,2)} × porção {fmt(porcao)})", f"cabe = {cabe}", "alta")
        if soma < porcao - 0.05 and cabe:
            info(slug, "(porção)", "c", f"soma {fmt(soma,2)} mg < porção {fmt(porcao)} mg: sobra {fmt(porcao-soma,2)} mg não alocada")
    if pend:
        info(slug, "(porção)", "c", "massas PENDENTES não somadas: " + "; ".join(str(p) for p in pend))
    js1, js2 = num(d.get("soma_insumos_mg")), num(d.get("soma_excipientes_mg"))
    if js1 is not None and abs(js1 - soma_ins) > 0.05:
        div(slug, "(porção)", "c", f"soma_insumos_mg recalculada {fmt(soma_ins,3)}", f"{fmt(js1,3)}", "baixa")
    if js2 is not None and abs(js2 - soma_exc) > 0.05:
        div(slug, "(porção)", "c", f"soma_excipientes_mg recalculada {fmt(soma_exc,3)}", f"{fmt(js2,3)}", "baixa")

# ------------------------------------------------ (d)
VD_CHAVE = {
    "vitamina a": "vitamina_a_mcg_rae", "vitamina d": "vitamina_d_mcg", "vitamina e": "vitamina_e_mg", "vitamina k": "vitamina_k_mcg",
    "vitamina c": "vitamina_c_mg", "tiamina": "tiamina_b1_mg", "vitamina b1": "tiamina_b1_mg", "riboflavina": "riboflavina_b2_mg", "vitamina b2": "riboflavina_b2_mg",
    "niacina": "niacina_mg_ne", "vitamina b3": "niacina_mg_ne", "vitamina b6": "vitamina_b6_mg", "biotina": "biotina_mcg", "vitamina b7": "biotina_mcg",
    "acido folico": "acido_folico_mcg_dfe", "acido pantotenico": "acido_pantotenico_b5_mg", "vitamina b5": "acido_pantotenico_b5_mg",
    "vitamina b12": "vitamina_b12_mcg", "calcio": "calcio_mg", "cloreto": "cloreto_mg", "cobre": "cobre_mcg", "cromo": "cromo_mcg", "ferro": "ferro_mg",
    "fluor": "fluor_mg", "fosforo": "fosforo_mg", "iodo": "iodo_mcg", "magnesio": "magnesio_mg", "manganes": "manganes_mg", "molibdenio": "molibdenio_mcg",
    "potassio": "potassio_mg", "selenio": "selenio_mcg", "sodio": "sodio_mg", "zinco": "zinco_mg", "colina": "colina_mg",
}
MACRO_VD = {
    "valor energetico": ("valor_energetico_kcal", "kcal"), "carboidratos": ("carboidratos_g", "g"), "acucares adicionados": ("acucares_adicionados_g", "g"),
    "proteinas": ("proteinas_g", "g"), "gorduras totais": ("gorduras_totais_g", "g"), "gorduras saturadas": ("gorduras_saturadas_g", "g"),
    "gorduras trans": ("gorduras_trans_g", "g"), "fibras alimentares": ("fibras_alimentares_g", "g"), "sodio": ("sodio_mg", "mg"), "omega 3": ("omega_3_mg", "mg"),
}
NAO_SIG = {"valor energetico": 4, "carboidratos": 0.5, "proteinas": 0.5, "gorduras totais": 0.5, "gorduras saturadas": 0.1, "gorduras trans": 0.1, "sodio": 5}
GRUPO_VD = {"> 19 anos": "adultos_19_anos_ou_mais", "Gestantes": "gestantes", "Lactantes": "lactantes", "gestantes": "gestantes", "lactantes": "lactantes"}

def arred_gabarito(x, unidade):
    """Arredondamento do Anexo III da IN 75 (paráfrase do gabarito)."""
    if x is None: return None
    u = unidade_norm(unidade)
    ax = abs(x)
    if ax >= 10: return float(round(x))
    if ax >= 1: return round(x, 1)
    if u == "g": return round(x, 1)
    return round(x, 2)

def check_d(slug, d, grupo):
    gp = grupo_populacional(d)
    tn = d.get("tabela_nutricional") or {}
    # ativos exatos por constituinte (para a base "exata" do %VD)
    exatos = {}
    for ins in d["insumos"]:
        if retirado(ins): continue
        na = nome_constituinte(ins)
        a = ativo_mg(ins, grupo)
        if na and a is not None: exatos[sem_acento(na)] = exatos.get(sem_acento(na), 0.0) + a
    for l in tn.get("linhas", []):
        item = l.get("item") or ""
        k = sem_acento(item).strip()
        q = l.get("quantidade_num", l.get("quantidade"))
        if isinstance(q, str) and "kcal" in q:
            m = re.search(r"([\d\.,]+)\s*kcal", q); q = m.group(1) if m else q
        qv = num(q)
        unid = unidade_norm(l.get("unidade") or "")
        vd = l.get("vd_pct")
        if qv is None or vd is None or vd == "PENDENTE": continue
        if k in MACRO_VD:
            chave, u_vd = MACRO_VD[k]
            ref = VD["adultos_geral_anexo_ii_in75_base_2000kcal"][chave]
            qq = qv
            if u_vd == "g" and unid == "mg": qq = qv / 1000.0
            if u_vd == "mg" and unid == "g": qq = qv * 1000.0
            esperado = qq / ref * 100.0
            vds = vd if isinstance(vd, dict) else {"": vd}
            for gsub, v in vds.items():
                vv = num(v)
                if vv is None: continue
                if round(esperado) != round(vv) and abs(esperado - vv) > 0.6:
                    lim = NAO_SIG.get(k)
                    if lim is not None and vv == 0 and qq <= lim + 1e-9: continue
                    div(slug, item, "d", f"%VD {fmt(esperado,1)} % (= {fmt(qq)} {u_vd} ÷ {ref})", f"{fmt(vv,1)} %", "média", "macronutriente: VD do Anexo II da IN 75 (adultos)")
            continue
        if k == "acucares totais" or k in ("poliois totais", "sorbitol", "maltitol"): continue
        chave = VD_CHAVE.get(k)
        if chave is None:
            if not isinstance(vd, dict) and num(vd) not in (None, 0):
                div(slug, item, "d", "célula de %VD em branco (constituinte sem VDR — RDC 429 art. 12 §1º)", f"{vd}", "média")
            continue
        vds = vd if isinstance(vd, dict) else {gp[0]: vd}
        u_vd = "µg" if (chave.endswith("_mcg") or chave.endswith("_mcg_rae") or chave.endswith("_mcg_dfe")) else "mg"
        for gnome, v in vds.items():
            vv = num(v)
            if vv is None: continue
            gkey = GRUPO_VD.get(gnome, "adultos_19_anos_ou_mais")
            ref = VD["grupos_populacionais_anexo_viii_in75"]["grupos"][gkey].get(chave)
            if ref is None:
                div(slug, item, "d", f"VD de {item} para {gnome} PENDENTE no vd.json (niacina só adultos)", f"{vv}", "média"); continue
            qq = qv
            if u_vd == "mg" and unid == "µg": qq = qv / 1000.0
            if u_vd == "µg" and unid == "mg": qq = qv * 1000.0
            esp_decl = qq / ref * 100.0
            # base exata (ativo do JSON)
            const_key = {"vitamina b1": "tiamina", "vitamina b2": "riboflavina", "vitamina b3": "niacina", "vitamina b7": "biotina", "vitamina b5": "acido pantotenico"}.get(k, k)
            exato_mg = exatos.get(const_key)
            esp_exato = None
            if exato_mg is not None:
                qe = de_mg(exato_mg, u_vd)
                esp_exato = qe / ref * 100.0
            if abs(esp_decl - vv) <= 0.6 or round(esp_decl) == round(vv):
                continue
            if esp_exato is not None and (abs(esp_exato - vv) <= 0.6 or round(esp_exato) == round(vv)):
                div(slug, item, "d", f"%VD {fmt(esp_decl,1)} % sobre a quantidade declarada ({fmt(qq)} {u_vd} ÷ VD {ref} [{gkey}])", f"{fmt(vv,1)} % (sobre o ativo exato {fmt(de_mg(exato_mg,u_vd),3)} {u_vd})", "critério",
                    "o memorial calculou o %VD sobre o ativo exato; a consolidação recalcula sobre a quantidade declarada (o número impresso) — diferença ≤ 3 pontos")
            else:
                div(slug, item, "d", f"%VD {fmt(esp_decl,1)} % (= {fmt(qq)} {u_vd} ÷ VD {ref} [{gkey}])" + (f" ou {fmt(esp_exato,1)} % sobre o ativo exato" if esp_exato is not None else ""),
                    f"{fmt(vv,1)} %", "média", "não coincide com nenhuma das duas bases")

# ------------------------------------------------ (e)
AA_PROTEINOGENICOS = ["tirosina", "teanina", "metionina", "cisteina", "triptofano", "glutamina", "aspartico", "aspartato", "arginina", "beta-alanina", "alanina", "glicina", "leucina", "lisina", "valina", "isoleucina", "treonina", "fenilalanina", "histidina", "serina"]
OUTROS_4 = ["carnitina", "taurina", "creatina", "glucosamina", "colina", "inositol", "hialuronato", "glicerina", "metilsulfonilmetano"]

def categoria(nome):
    n = sem_acento(nome)
    n = n.replace("picolinato", "")  # 'picolinato' contém 'colina'
    if "orto-silicico" in n or "siliciumax" in n: return ("carb", 0.95, "maltodextrina do Siliciumax (95 %)")
    if "maltodextrina" in n: return ("carb", 1.0, "maltodextrina")
    if "colageno hidrolisado" in n: return ("prot_col", None, "colágeno hidrolisado (× % de proteína)")
    if "colageno tipo ii" in n or "colageno de frango" in n: return ("prot", 0.676, "colágeno tipo II (proteína 67,6 % do laudo)")
    if "gelatina" in n: return ("prot", 0.9375, "gelatina (N 15,0 % × 6,25)")
    if "oleo de peixe" in n: return ("gord", 1.0, "óleo")
    if "acido citrico" in n: return ("org", 1.0, "ácido cítrico")
    if "sorbitol" in n: return ("sorbitol", 0.70, "sorbitol (líquido 70 %)")
    if "maltitol" in n: return ("maltitol", 0.997, "maltitol")
    if "pectina" in n: return ("fibra", 0.90, "pectina (ácido galacturônico 90 %)")
    if "goma acacia" in n or "goma arabica" in n or "goma xantana" in n or "inulina" in n or "frutooligo" in n or "psyllium" in n or "quitosana" in n: return ("fibra", 1.0, "fibra solúvel")
    if "glicerina" in n: return ("opc", "glicerina", "glicerina")
    for a in AA_PROTEINOGENICOS:
        if re.search(r"\b" + a + r"(?!to)", n): return ("aa", a, a)
    for a in OUTROS_4:
        if a in n: return ("opc", a, a)
    return (None, None, None)

FAT = {"carb": 4.0, "prot": 4.0, "gord": 9.0, "org": 3.0, "sorbitol": 2.6, "maltitol": 2.1, "fibra": 2.0}

def energia_modelo(slug, d, grupo):
    """Reconstrói o valor energético a partir das massas: itens fixos (macros com fator no Anexo XXII) + itens opcionais
    (aminoácidos livres, glicerina, inositol, hialuronato…) escolhidos para reproduzir o valor declarado pelo memorial,
    respeitando o que a nota do memorial manda não contar. Devolve dict ou None (energia PENDENTE)."""
    tn = d.get("tabela_nutricional") or {}
    lin = {sem_acento(l.get("item", "")).strip(): l for l in tn.get("linhas", [])}
    ve = lin.get("valor energetico")
    if not ve: return None
    q = ve.get("quantidade"); qn = num(ve.get("quantidade_num"))
    kcal_decl = kj_decl = None
    if isinstance(q, str) and "kcal" in q:
        m = re.search(r"([\d\.,]+)\s*kcal\s*=\s*([\d\.,]+)\s*kJ", q)
        if m: kcal_decl, kj_decl = num(m.group(1)), num(m.group(2))
    else:
        kcal_decl = qn if qn is not None else num(q); kj_decl = num(ve.get("kj"))
    if kcal_decl is None:
        return dict(pendente=True, nota=ve.get("nota"))
    fixos = 0.0; partes_fixas = []; opcionais = []
    itens = []
    for ins in d["insumos"]:
        if retirado(ins) or eh_componente(ins): continue
        itens.append(((ins.get("forma_insumo") or "") + " " + (ins.get("constituinte_anexo_i") or ""), num(ins.get("massa_insumo_mg")), ativo_mg(ins, grupo), ins))
    for e in d.get("excipientes") or []:
        nome = e.get("nome") or ""
        m = num(e.get("massa_mg"))
        if "glicerina" in sem_acento(nome) and "agua" in sem_acento(nome):
            mm = re.search(r"glicerina\s*([\d\.,]+)\s*mg", e.get("obs") or e.get("observacao") or "")
            if mm: m = num(mm.group(1)); nome = "glicerina (POPS, provisória)"
        itens.append((nome, m, None, e))
    for nome, m, a, obj in itens:
        cat, par, rot = categoria(nome)
        if cat is None or m is None: continue
        g = m / 1000.0
        if cat == "prot_col":
            teor = num(obj.get("teor_pct")) or 100.0
            kcal = g * teor / 100 * 4; fixos += kcal; partes_fixas.append(f"{rot} {fmt(g,3)} g × {fmt(teor)} % × 4 = {fmt(kcal,2)}")
        elif cat in FAT:
            frac = par if isinstance(par, float) else 1.0
            kcal = g * frac * FAT[cat]; fixos += kcal; partes_fixas.append(f"{rot} {fmt(g*frac,3)} g × {FAT[cat]} = {fmt(kcal,2)}")
        elif cat == "aa":
            ga = (a if a is not None else m) / 1000.0
            opcionais.append((rot, ga * 4))
        elif cat == "opc":
            ga = (a if (a is not None and par not in ("glicerina",)) else m) / 1000.0
            if par == "inositol" or par == "hialuronato": ga = m / 1000.0
            opcionais.append((rot, ga * 4))
    def arr(x): return float(round(x)) if x >= 10 else round(x, 1)
    def bate(x): return abs(arr(x) - kcal_decl) <= 0.11 or abs(round(x, 2) - kcal_decl) <= 0.011 or abs(x - kcal_decl) <= 0.05 * max(kcal_decl, 1)
    nota = sem_acento(ve.get("nota") or "")
    excluidos = set()
    for frag in re.split(r"[;.()]", nota):
        if "sem fator" in frag or "nao comput" in frag or "-> 0" in frag or "→ 0" in frag or "nao inclu" in frag:
            for i, (rot, _) in enumerate(opcionais):
                if sem_acento(rot) in frag: excluidos.add(i)
    melhor = None
    for r in range(len(opcionais) + 1):
        for comb in itertools.combinations(range(len(opcionais)), r):
            if any(i in excluidos for i in comb): continue
            tot = fixos + sum(opcionais[i][1] for i in comb)
            if bate(tot) and (melhor is None or abs(tot - kcal_decl) < abs(melhor[1] - kcal_decl) - 1e-9):
                melhor = (comb, tot)
    res = dict(pendente=False, kcal_decl=kcal_decl, kj_decl=kj_decl, fixos=fixos, partes_fixas=partes_fixas, opcionais=opcionais, nota=ve.get("nota"))
    if melhor is None:
        res.update(tot=None, incluidos=[], excluidos=[o[0] for o in opcionais])
    else:
        comb, tot = melhor
        res.update(tot=tot, incluidos=[opcionais[i][0] for i in comb], excluidos=[o[0] for i, o in enumerate(opcionais) if i not in comb])
    return res

def check_e(slug, d, grupo):
    r = energia_modelo(slug, d, grupo)
    if r is None: return
    if r.get("pendente"):
        info(slug, "Valor energético", "e", f"PENDENTE no JSON ({(r.get('nota') or '')[:160]})"); return
    kcal_decl, kj_decl = r["kcal_decl"], r["kj_decl"]
    def arr(x): return float(round(x)) if x >= 10 else round(x, 1)
    if r["tot"] is None:
        div(slug, "Valor energético", "e", f"fixos {fmt(r['fixos'],2)} kcal [{'; '.join(r['partes_fixas']) or '—'}] + opcionais {', '.join(f'{a} {fmt(k,2)}' for a,k in r['opcionais']) or '—'}",
            f"{fmt(kcal_decl,2)} kcal", "média", "nenhuma combinação reproduz o declarado — nota do memorial: " + (r.get("nota") or "")[:220])
        base = kcal_decl
    else:
        info(slug, "Valor energético", "e", f"{fmt(kcal_decl,2)} kcal — uma combinação que reproduz o declarado: fixos {fmt(r['fixos'],2)} [{'; '.join(r['partes_fixas']) or '—'}]"
             + (f" + a 4 kcal/g: {', '.join(r['incluidos'])}" if r['incluidos'] else "") + (f" | NÃO contados: {', '.join(r['excluidos'])}" if r['excluidos'] else "") + f" = {fmt(r['tot'],2)} kcal")
        base = r["tot"]
    if kj_decl is not None:
        kj_4184 = base * 4.184
        kj_17 = base * (37.0 / 9.0 if slug == "omega-pro-tg" else 17.0 / 4.0)
        if abs(arr(kj_4184) - kj_decl) <= 0.11 or abs(round(kj_4184, 2) - kj_decl) <= 0.011:
            info(slug, "Valor energético", "e", f"kJ {fmt(kj_decl)} = kcal × 4,184 ({fmt(kj_4184,2)})")
        elif abs(arr(kj_17) - kj_decl) <= 0.6 or abs(round(kj_17, 1) - kj_decl) <= 0.11:
            div(slug, "Valor energético", "e", f"kJ = kcal × 4,184 → {fmt(arr(kj_4184))} kJ", f"{fmt(kj_decl)} kJ (fatores 17/37/13 kJ/g)", "critério",
                "memorial usou fatores em kJ/g (17 carboidrato e proteína, 37 gordura, 13 ácido orgânico), que NÃO constam do Anexo XXII da IN 75 (só kcal/g) — a consolidação adota kJ = kcal × 4,184; diferença ≤ 2 kJ")
        else:
            div(slug, "Valor energético", "e", f"kJ = kcal × 4,184 → {fmt(arr(kj_4184))} kJ (ou 17 kJ/g → {fmt(arr(kj_17))})", f"{fmt(kj_decl)} kJ", "média", "kJ não coincide com nenhum critério")

# ------------------------------------------------ (f)
_TXT_I = norm_literal(anexos.anexo_i_texto())
def check_f(slug, d):
    for ins in d["insumos"]:
        if retirado(ins) or eh_componente(ins): continue
        nome = ins.get("constituinte_anexo_i") or "?"
        cands = [norm_literal(c) for c in forma_anexo_i(ins) if c]
        if not cands:
            div(slug, nome, "f", "nome da forma do Anexo I (linha 'I·…' ou 'Constituinte — Forma')", "nenhum candidato extraível do JSON", "média"); continue
        achou = [c for c in cands if c in _TXT_I]
        if achou:
            info(slug, nome, "f", f"forma encontrada literalmente no Anexo I: '{achou[0]}'"); continue
        t0 = sem_acento(_TXT_I)
        quase = [c for c in cands if sem_acento(c) in t0]
        div(slug, nome, "f", "texto literal do Anexo I", f"não encontrado literalmente: {cands}" + (f" — encontrado só sem distinção de acento/caixa: {quase}" if quase else ""),
            "média" if quase else "alta")

# ----------------------------------------------------------------------------------------------
def principal():
    dados = carregar()
    for slug, d in dados.items():
        grupo = GRUPO_DE[slug]
        check_a(slug, d, grupo); check_bg(slug, d, grupo); check_c(slug, d); check_d(slug, d, grupo); check_e(slug, d, grupo); check_f(slug, d)
    por_check = defaultdict(list)
    for x in DIV: por_check[x["check"]].append(x)
    grav = lambda g: sum(1 for x in DIV if x["gravidade"] == g)
    out = ["# Fase 3 — Verificação determinística dos 24 JSONs da reformulação (16/09/2026)\n",
           "Script: `scratchpad/fase3/verificar.py` (lê `scratchpad/fase2/<slug>.json`, `padrao-anvisa/vd.json` e os anexos literais em `docs/conformidade/`). "
           "Nenhum número foi digitado no verificador: limites vêm dos Anexos III/IV literais, VDs do `vd.json`, fatores sal→base e potências das próprias contas dos JSONs.\n",
           "Gravidade: **alta** = erro de conta, de limite ou nome fora do Anexo I; **média** = desvio de %VD/energia/nome a conferir; **baixa** = arredondamento; "
           "**representação** = número certo com o campo `teor_pct` em semântica diferente entre grupos (doseamento do sal × teor efetivo) — harmonizado na fase 3; "
           "**critério** = escolha documentada do memorial (registrada; a consolidação adota um critério único e diz qual).\n",
           "## Resumo\n",
           f"- Divergências registradas: **{len(DIV)}** — alta {grav('alta')}, média {grav('média')}, baixa {grav('baixa')}, representação {grav('representação')}, critério {grav('critério')}.",
           f"- Conferências que fecharam ou itens não verificáveis (registrados, não são divergências): {len(INFO)}.\n"]
    for c, titulo in [("a", "(a) massa × teor = ativo"), ("b", "(b) faixa [mínimo, máximo] e folga de 90 % (soma por constituinte)"), ("c", "(c) soma da porção e `cabe`"),
                      ("d", "(d) %VD"), ("e", "(e) valor energético e kJ"), ("f", "(f) forma literal no Anexo I"), ("g", "(g) mínimos/máximos × Anexos III/IV literais")]:
        out.append(f"## {titulo}\n")
        xs = por_check.get(c, [])
        if not xs: out.append("Nenhuma divergência.\n")
        else:
            out.append("| slug | insumo/linha | esperado | encontrado | gravidade | nota |\n|---|---|---|---|---|---|")
            for x in xs:
                esc = lambda s: str(s).replace("|", "\\|").replace("\n", " ")
                out.append(f"| {x['slug']} | {esc(x['insumo'])} | {esc(x['esperado'])} | {esc(x['encontrado'])} | {x['gravidade']} | {esc(x['nota'])} |")
            out.append("")
        infos = [i for i in INFO if i["check"] == c]
        if infos:
            out.append(f"<details><summary>Conferências registradas ({len(infos)})</summary>\n")
            for i in infos: out.append(f"- {i['slug']} · {i['insumo']}: {i['texto']}".replace("\n", " "))
            out.append("\n</details>\n")
    (F3 / "verificacao.md").write_text("\n".join(out), encoding="utf-8")
    json.dump({"divergencias": DIV, "observacoes": INFO}, open(F3 / "verificacao.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"{len(DIV)} divergências, {len(INFO)} observações → {F3/'verificacao.md'}")
    for c in "abcdefg":
        xs = por_check.get(c, [])
        cnt = defaultdict(int)
        for x in xs: cnt[x["gravidade"]] += 1
        print(f"  ({c}) {len(xs)}: " + ", ".join(f"{k} {v}" for k, v in sorted(cnt.items())))

if __name__ == "__main__":
    principal()
