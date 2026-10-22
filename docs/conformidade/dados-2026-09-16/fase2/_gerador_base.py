# -*- coding: utf-8 -*-
"""Base de dados e funções de cálculo compartilhadas pelos 8 memoriais de reformulação
(grupo: multivitaminico, zma, biotina-em-capsula, dores-musculares, focus-colina,
multi-vitta, melatonina-triptofanos, serena). Fase 2 — 16/09/2026.

Toda constante abaixo tem procedência anotada no comentário ao lado. Nada é estimado."""

from decimal import Decimal, ROUND_HALF_UP

DATA = "16/09/2026"

# ---------------------------------------------------------------------------------
# Massas atômicas IUPAC (mesmas usadas na auditoria de 15/09, seção 2, método 3)
# ---------------------------------------------------------------------------------
M = dict(Mg=24.305, Zn=65.38, Ca=40.078, Fe=55.845, Cu=63.546, Se=78.971, B=10.81,
         Cr=51.996, I=126.904, K=39.098, Cl=35.45, C=12.011, H=1.008, N=14.007,
         O=15.999, Na=22.990, S=32.06)

def mw(**atoms):
    return sum(M[k] * v for k, v in atoms.items())

# frações estequiométricas do elemento/ativo no sal puro (CALCULADO, mostrado nos memoriais)
FRAC = {
    "MgO":            M["Mg"] / mw(Mg=1, O=1),                              # 60,30 %
    "MgCl2":          M["Mg"] / mw(Mg=1, Cl=2),                             # 25,53 %
    "Mg-bisglicinato": M["Mg"] / mw(C=4, H=8, Mg=1, N=2, O=4),               # 14,10 %
    "Zn-bisglicinato": M["Zn"] / mw(C=4, H=8, Zn=1, N=2, O=4),               # 30,62 %
    "CaCO3":          M["Ca"] / mw(Ca=1, C=1, O=3),                         # 40,04 %
    "Fe-bisglicinato": M["Fe"] / mw(C=4, H=8, Fe=1, N=2, O=4),               # 27,38 %
    "Cu-bisglicinato": M["Cu"] / mw(C=4, H=8, Cu=1, N=2, O=4),               # 30,02 %
    "Na2SeO3":        M["Se"] / mw(Na=2, Se=1, O=3),                        # 45,66 %
    "Borax":          4 * M["B"] / mw(Na=2, B=4, O=17, H=20),               # 11,34 % (Na2B4O7·10H2O = Na2B4O17H20)
    "Na_em_Borax":    2 * M["Na"] / mw(Na=2, B=4, O=17, H=20),              # 12,06 %
    "tiamina/HCl":    mw(C=12, H=17, N=4, O=1, S=1) / mw(C=12, H=18, Cl=2, N=4, O=1, S=1),  # 78,68 %
    "piridoxina/HCl": mw(C=8, H=11, N=1, O=3) / mw(C=8, H=12, Cl=1, N=1, O=3),             # 82,27 %
    "cisteina/HCl":   mw(C=3, H=7, N=1, O=2, S=1) / mw(C=3, H=8, Cl=1, N=1, O=2, S=1),      # 76,87 %
    "pantotenico/Ca": 2 * mw(C=9, H=17, N=1, O=5) / mw(C=18, H=32, Ca=1, N=2, O=10),        # 92,01 %
    "glucosamina/sulfKCl": 2 * mw(C=6, H=13, N=1, O=5) / (2 * mw(C=6, H=13, N=1, O=5) + mw(H=2, S=1, O=4) + 2 * mw(K=1, Cl=1)),  # 59,18 %
    "I/KI":           M["I"] / mw(K=1, I=1),                                # 76,45 %
    "Na/hialuronato": M["Na"] / mw(C=14, H=20, N=1, Na=1, O=11),            # 5,73 % por unidade
    "Na/benzoato":    M["Na"] / mw(C=7, H=5, Na=1, O=2),                    # 15,96 %
}

# ---------------------------------------------------------------------------------
# LIMITES — IN 28/2018, Anexo III (mínimo) e Anexo IV (máximo), lidos em 16/09/2026 nos
# arquivos literais docs/conformidade/IN28-2018-ANEXO-III-LITERAL.md e
# IN28-2018-ANEXOS-IV-V-VI-LITERAL.md. Coluna "> 19 anos". None = NE (não estabelecido).
# ---------------------------------------------------------------------------------
LIM_ADULTO = {
    "Magnésio":            (63,     350,      "mg"),
    "Zinco":               (1.65,   29.59,    "mg"),
    "Boro":                (None,   8.866,    "mg"),
    "Teanina":             (50,     250,      "mg"),
    "Vitamina B6":         (0.26,   98.60,    "mg"),
    "Vitamina D":          (3,      50.0,     "µg"),
    "Vitamina C":          (13.5,   1916.02,  "mg"),
    "Niacina":             (2.4,    35,       "mg NE"),
    "Vitamina E":          (2.25,   1000,     "mg"),
    "Ácido pantotênico":   (0.75,   5.64,     "mg"),
    "Tiamina":             (0.18,   2.02,     "mg"),
    "Riboflavina":         (0.20,   2.74,     "mg"),
    "Vitamina A":          (135,    2623.61,  "µg RAE"),
    "Ácido fólico":        (60,     1281.5,   "µg DFE"),
    "Cobre":               (135,    8975.52,  "µg"),
    "Selênio":             (8.25,   319.75,   "µg"),
    "Vitamina K":          (18,     149.06,   "µg"),
    "Cromo":               (5.25,   250,      "µg"),
    "Vitamina B12":        (0.36,   9.94,     "µg"),
    "Biotina":             (4.5,    45,       "µg"),
    "Metionina":           (105,    1530,     "mg"),
    "Cisteína":            (42,     830,      "mg"),
    "Metilsulfonilmetano": (None,   900,      "mg"),
    "Ácido hialurônico":   (3.5,    157.7,    "mg"),
    "Silício":             (None,   15.67,    "mg"),
    "Iodo":                (22.5,   919.02,   "µg"),
    "Glucosamina":         (None,   750,      "mg"),
    "Colágeno tipo II não desnaturado": (1.2, None, "mg"),
    "Ferro":               (2.7,    34.31,    "mg"),
    "Colina":              (82.5,   3235.15,  "mg"),
    "Tirosina":            (262.5,  2750,     "mg"),
    "L-Carnitina":         (None,   2000,     "mg"),
    "Inositol":            (None,   2000,     "mg"),   # Anexo IV: 2 g
    "Triptofano":          (42,     860,      "mg"),
    "Aspartato":           (None,   5320,     "mg"),
    "Glutamina":           (None,   5000,     "mg"),
    "Melatonina":          (None,   0.21,     "mg"),
    "Cálcio":              (180,    1534.67,  "mg"),
    "Fosfatidilserina":    (None,   400,      "mg"),
    "Proteínas":           (8400,   None,     "mg"),   # 8,4 g
}

# colunas Gestantes / Lactantes (mesma fonte) — só os constituintes do Multi Vitta
LIM_GEST = {
    "Cálcio":            (195,   2015.51, "mg"),
    "Magnésio":          (60,    350,     "mg"),
    "Vitamina C":        (12.75, 1723.43, "mg"),
    "Ferro":             (4.05,  34.71,   "mg"),
    "Niacina":           (2.7,   30,      "mg NE"),
    "Ácido pantotênico": (0.9,   5.83,    "mg"),
    "Vitamina E":        (2.25,  800,     "mg"),
    "Cobre":             (150,   6935.01, "µg"),
    "Ácido fólico":      (666.6, 1138.3,  "µg DFE"),
    "Vitamina D":        (2.25,  50.0,    "µg"),
    "Vitamina B12":      (0.39,  10.46,   "µg"),
}
LIM_LACT = {
    "Cálcio":            (195,   2082.58, "mg"),
    "Magnésio":          (54,    350,     "mg"),
    "Vitamina C":        (18,    1726.73, "mg"),
    "Ferro":             (1.5,   34.96,   "mg"),
    "Niacina":           (2.55,  30,      "mg NE"),
    "Ácido pantotênico": (1.05,  5.49,    "mg"),
    "Vitamina E":        (2.85,  800,     "mg"),
    "Cobre":             (195,   7036.33, "µg"),
    "Ácido fólico":      (75,    1162.3,  "µg DFE"),
    "Vitamina D":        (2.25,  50.0,    "µg"),
    "Vitamina B12":      (0.42,  10.07,   "µg"),
}

# ---------------------------------------------------------------------------------
# VDR — IN 75/2020, Anexo VIII (por grupo), lidos em 16/09/2026 (scratchpad/padrao-anvisa/vd.json)
# ---------------------------------------------------------------------------------
VD_ADULTO = {
    "Vitamina A": 800, "Vitamina D": 15, "Vitamina E": 15, "Vitamina K": 120, "Vitamina C": 100,
    "Tiamina": 1.2, "Riboflavina": 1.2, "Niacina": 15, "Vitamina B6": 1.3, "Biotina": 30,
    "Ácido fólico": 400, "Ácido pantotênico": 5, "Vitamina B12": 2.4, "Cálcio": 1000,
    "Cobre": 900, "Cromo": 35, "Ferro": 14, "Iodo": 150, "Magnésio": 420, "Selênio": 60,
    "Zinco": 11, "Colina": 550, "Sódio": 2000, "Proteínas": 50, "Carboidratos": 300,
    "Gorduras totais": 65, "Gorduras saturadas": 20, "Fibras alimentares": 25,
    "Valor energético": 2000, "Açúcares adicionados": 50,
}
VD_GEST = {"Vitamina D": 15, "Vitamina E": 15, "Vitamina C": 85, "Niacina": None,
           "Ácido fólico": 600, "Ácido pantotênico": 6, "Vitamina B12": 2.6, "Cálcio": 1300,
           "Cobre": 1000, "Ferro": 27, "Magnésio": 400}
VD_LACT = {"Vitamina D": 15, "Vitamina E": 15, "Vitamina C": 120, "Niacina": None,
           "Ácido fólico": 500, "Ácido pantotênico": 7, "Vitamina B12": 2.8, "Cálcio": 1300,
           "Cobre": 1300, "Ferro": 10, "Magnésio": 360}

# ordem do Anexo XI da IN 75 (gabarito, paráfrase): vitaminas A, D, E, K, C, B1..B12; minerais
# Ca, Cl, Cu, Cr, Fe, F, P, I, Mg, Mn, Mo, K, Se, Zn; colina; taurina; bioativos.
ORDEM_VIT = ["Vitamina A", "Vitamina D", "Vitamina E", "Vitamina K", "Vitamina C", "Tiamina",
             "Riboflavina", "Niacina", "Vitamina B6", "Biotina", "Ácido fólico",
             "Ácido pantotênico", "Vitamina B12"]
ORDEM_MIN = ["Cálcio", "Cobre", "Cromo", "Ferro", "Iodo", "Magnésio", "Selênio", "Zinco"]

# ---------------------------------------------------------------------------------
# Texto literal das advertências (IN 28/2018, Anexo VI, lido em 16/09/2026) e RDC 243 art. 14
# ---------------------------------------------------------------------------------
ADV_GENERICA = "Este produto não deve ser consumido por gestantes, lactantes e crianças."
ADV_MELATONINA = ("Este produto não deve ser consumido por gestantes, lactantes, crianças e pessoas "
                  "envolvidas em atividades que requerem atenção constante. Pessoas com enfermidades "
                  "e/ou sob o uso de medicamentos, consulte seu médico.")
ADV_GLUCOSAMINA = ("Este produto não deve ser consumido por gestantes, lactantes e crianças. Pessoas "
                   "com enfermidades e/ou sob o uso de medicamentos, consulte seu médico.")
RDC243 = ["Este produto não é um medicamento.",
          "Não exceder a recomendação diária de consumo indicada na embalagem.",
          "Mantenha fora do alcance de crianças."]
CONSERVACAO = ("Conservar o produto em local seco, fresco e arejado, ao abrigo da luz e do calor "
               "excessivo, em temperatura ambiente entre 15 °C e 30 °C. Após aberto, consumir em até "
               "60 dias. Não consumir se o lacre de segurança estiver violado.")

RODAPE_VD = "*Percentual de valores diários fornecidos pela porção"

# ---------------------------------------------------------------------------------
# Arredondamento — IN 75/2020, Anexo III (paráfrase do gabarito de 16/09/2026; não literal)
# ---------------------------------------------------------------------------------
def _hu(x, nd):
    q = Decimal(1).scaleb(-nd)
    return float(Decimal(str(x)).quantize(q, rounding=ROUND_HALF_UP))

def arred(v, unidade):
    """Devolve (valor_arredondado, texto) pela regra do gabarito."""
    if v is None:
        return None, "—"
    u = unidade.split()[0]
    if abs(v) < 1e-12:
        return 0.0, "0"
    if v >= 10:
        r = _hu(v, 0); return r, f"{int(r):,}".replace(",", ".")
    if v >= 1:
        r = _hu(v, 1)
        if abs(r - round(r)) < 1e-9:
            return r, f"{int(round(r))}"
        return r, f"{r:.1f}".replace(".", ",")
    if u in ("g", "kcal", "kJ"):
        r = _hu(v, 1)
        return r, ("0" if r == 0 else f"{r:.1f}".replace(".", ","))
    # mg / µg abaixo de 1
    r = _hu(v, 2)
    if r == 0:
        return r, "0"
    if abs(r * 10 - round(r * 10)) < 1e-9:
        return r, f"{r:.1f}".replace(".", ",")
    return r, f"{r:.2f}".replace(".", ",")

def fmt(v, nd=2):
    """Número em português (vírgula decimal, ponto de milhar), nd casas."""
    if v is None:
        return "—"
    s = f"{v:,.{nd}f}"
    return s.replace(",", "X").replace(".", ",").replace("X", ".")

def pct(a, b):
    return None if (a is None or not b) else a / b * 100


def I(const, forma, massa, teor, teor_txt, teor_fonte, ativo, unid, linha, laudo, status, motivo, nome_cadastro, conta, **k):
    """Construtor de linha de insumo do 'Depois'."""
    d = dict(const=const, forma=forma, massa=massa, teor=teor, teor_txt=teor_txt, teor_fonte=teor_fonte,
             ativo=ativo, unid=unid, linha=linha, laudo=laudo, status=status, motivo=motivo,
             nome_cadastro=nome_cadastro, conta=conta)
    d.update(k)
    return d
