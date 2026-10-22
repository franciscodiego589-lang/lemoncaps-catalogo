# -*- coding: utf-8 -*-
"""
Correção cirúrgica da migration 20260922000000_reformulacao_conforme_normas.sql (17/09/2026).

Aplica, produto a produto, as correções levantadas em
docs/conformidade/VERIFICACAO-SQL-VS-MEMORIAIS-2026-09-17.md, tendo como fonte de verdade o memorial
de cada produto em docs/conformidade/reformulacao/<slug>.md.

Como funciona:
  1. Lê a migration inteira e localiza, por slug, o bloco `update public.formulas f set ... where f.slug = '<slug>'`
     da seção 5, separando os literais SQL (ingredients_list, nutritional_info, warnings, serving_description)
     e o JSON de metadata->'reformulacao_2026_09_16'.
  2. Faz o parse do JSON (depois de desfazer o escape SQL `''`), aplica as correções no dicionário e
     re-serializa exatamente como o gerador da fase 3 (json.dumps ensure_ascii=False, separators=(",", ": "))
     + re-escape SQL.
  3. Regrava a tabela nutricional em texto (nutritional_info) a partir do JSON corrigido, com o mesmo
     renderizador do gerador (render_tabela), para que texto e JSON nunca divirjam.
  4. Regrava só os blocos alterados; o restante do arquivo fica byte a byte igual.
  5. Antes de qualquer correção, prova que parse + re-serialização SEM alteração reproduz o arquivo original
     byte a byte (round-trip); se não reproduzir, aborta.

Nada aqui toca no banco. Uso:
    python3 corrigir_2026-09-17.py            # aplica as correções na migration
    python3 corrigir_2026-09-17.py --dump     # só extrai o estado atual por produto para scratchpad (inspeção)
    python3 corrigir_2026-09-17.py --check    # só faz o round-trip e sai
"""
import json
import re
import sys
from collections import OrderedDict
from decimal import Decimal, ROUND_HALF_UP
from pathlib import Path

PROJ = Path("/Users/diegofrancisco/Downloads/lemoncaps-catalogo")
MIG = PROJ / "supabase" / "migrations" / "20260922000000_reformulacao_conforme_normas.sql"
BACKUP = PROJ / "docs" / "conformidade" / "dados-2026-09-16" / "fase3" / "20260922000000_ANTES-CORRECAO-2026-09-17.sql"
META_KEY = "reformulacao_2026_09_16"
NOTA_CORRECAO_KEY = "correcao_2026_09_17"

# ======================================================================================================
# 1. literais SQL e JSON embutido
# ======================================================================================================
def q(s):
    """literal SQL (aspas simples dobradas) — igual ao gerador."""
    if s is None:
        return "null"
    return "'" + str(s).replace("'", "''") + "'"


def read_literal(text, pos):
    """text[pos] deve ser a aspa de abertura; devolve (valor, pos_depois_da_aspa_de_fechamento)."""
    assert text[pos] == "'", f"esperava aspa em {pos}, achei {text[pos]!r}"
    i = pos + 1
    out = []
    n = len(text)
    while i < n:
        c = text[i]
        if c == "'":
            if i + 1 < n and text[i + 1] == "'":
                out.append("'")
                i += 2
                continue
            return "".join(out), i + 1
        out.append(c)
        i += 1
    raise ValueError("literal SQL sem fechamento")


def dumps_json(obj):
    return json.dumps(obj, ensure_ascii=False, separators=(",", ": "))


# ======================================================================================================
# 2. blocos da seção 5 (um update por slug)
# ======================================================================================================
BLOCO_RE = re.compile(r"^-- (?P<slug>[a-z0-9-]+): (?P<veredito_curto>.*)\nupdate public\.formulas f set\n", re.M)
CAMPO_RE = re.compile(r"^    (?P<campo>ingredients_list|nutritional_info|warnings|serving_description) += ", re.M)
META_PREFIX = "    metadata            = coalesce(f.metadata, '{}'::jsonb) - 'tabela_nutricional_2026_09_16' - 'tabela_nutricional_20260916' - 'reformulacao' || jsonb_build_object('reformulacao_2026_09_16', "
META_SUFFIX = "::jsonb)\n"


class Bloco:
    """Um `update public.formulas` da seção 5, com os campos separados para edição."""

    def __init__(self, slug, ini, fim, campos, meta, meta_raw, texto_original):
        self.slug = slug
        self.ini = ini              # início do bloco no arquivo (a linha de comentário `-- slug: ...`)
        self.fim = fim              # fim do bloco (depois de `where ... ;\n`)
        self.campos = campos        # OrderedDict campo -> valor (str) ou None quando é referência (Omega)
        self.meta = meta            # dict do JSON
        self.meta_raw = meta_raw    # string JSON original (para round-trip)
        self.texto_original = texto_original

    def render(self):
        L = []
        cab = self.texto_original.split("\n", 2)
        L.append(cab[0])            # -- slug: veredito
        L.append("update public.formulas f set")
        for campo, valor in self.campos.items():
            if valor is None:
                if campo == "ingredients_list":
                    L.append("    -- Omega: ingredients_list e nutritional_info NAO sao gravados (sem fonte); a tabela PROVISORIA fica em metadata")
                L.append(f"    {campo:19s} = f.{campo},")
            else:
                L.append(f"    {campo:19s} = {q(valor)},")
        L.append(META_PREFIX.rstrip() + " " + q(dumps_json(self.meta)) + "::jsonb)")
        L.append(f"where f.slug = {q(self.slug)} and f.deleted_at is null;")
        L.append("")
        return "\n".join(L) + "\n"


def parse_blocos(sql):
    ini5 = sql.index("-- 5. DIZERES, TABELA NUTRICIONAL")
    ini6 = sql.index("-- 6. AUTOCHECK")
    blocos = OrderedDict()
    starts = [m for m in BLOCO_RE.finditer(sql, ini5, ini6)]
    for k, m in enumerate(starts):
        slug = m.group("slug")
        bloco_ini = m.start()
        pos = m.end()
        campos = OrderedDict()
        while True:
            if sql.startswith("    -- Omega:", pos):
                pos = sql.index("\n", pos) + 1
                continue
            cm = CAMPO_RE.match(sql, pos)
            if not cm:
                break
            campo = cm.group("campo")
            pos = cm.end()
            if sql.startswith(f"f.{campo},\n", pos):
                campos[campo] = None
                pos += len(f"f.{campo},\n")
            else:
                valor, pos = read_literal(sql, pos)
                assert sql.startswith(",\n", pos), f"{slug}: esperava ',\\n' depois de {campo}"
                campos[campo] = valor
                pos += 2
        assert sql.startswith(META_PREFIX, pos), f"{slug}: prefixo de metadata não bate em {pos}"
        pos += len(META_PREFIX)
        meta_raw, pos = read_literal(sql, pos)
        assert sql.startswith(META_SUFFIX, pos), f"{slug}: sufixo de metadata não bate"
        pos += len(META_SUFFIX)
        where = f"where f.slug = {q(slug)} and f.deleted_at is null;\n"
        assert sql.startswith(where, pos), f"{slug}: where não bate"
        pos += len(where)
        assert sql.startswith("\n", pos), f"{slug}: esperava linha em branco depois do bloco"
        pos += 1
        bloco_fim = pos
        meta = json.loads(meta_raw, object_pairs_hook=OrderedDict)
        blocos[slug] = Bloco(slug, bloco_ini, bloco_fim, campos, meta, meta_raw, sql[bloco_ini:bloco_fim])
    return blocos


def montar(sql, blocos):
    """Reconstrói o arquivo substituindo cada bloco pelo render() dele (na ordem, sem sobreposição)."""
    out = []
    cursor = 0
    for b in blocos.values():
        out.append(sql[cursor:b.ini])
        out.append(b.render())
        cursor = b.fim
    out.append(sql[cursor:])
    return "".join(out)


# ======================================================================================================
# 3. linhas de composição da seção 4 (só para a correção pontual da quercetina)
# ======================================================================================================
COMP_LINHA_RE = re.compile(r"^    \('(?P<slug>[a-z0-9-]+)', (?P<ordem>\d+), ", re.M)


def localizar_linha_composicao(sql, slug, predicado):
    """Devolve (ini, fim, ingredient_name, meta_dict, meta_raw) da linha de composição de `slug` que satisfaz o predicado."""
    ini4 = sql.index("-- 4. INSERCAO")
    ini5 = sql.index("-- 5. DIZERES")
    achadas = []
    for m in COMP_LINHA_RE.finditer(sql, ini4, ini5):
        if m.group("slug") != slug:
            continue
        pos = m.end()
        nome, pos = read_literal(sql, pos)
        # ", <qty>, '<unit>', '<ingredient_slug>', '<json>')"
        m2 = re.compile(r", (?P<qty>[0-9.]+), '(?P<unit>[a-z]+)', '(?P<islug>[a-z0-9-]+)', ").match(sql, pos)
        assert m2, f"{slug}: linha de composição fora do formato em {pos}"
        pos = m2.end()
        meta_raw, pos = read_literal(sql, pos)
        assert sql[pos] == ")", f"{slug}: esperava ')' depois do JSON da composição"
        meta = json.loads(meta_raw, object_pairs_hook=OrderedDict)
        if predicado(nome, meta):
            achadas.append((m.start(), pos, nome, meta, meta_raw, m2))
    assert len(achadas) == 1, f"{slug}: esperava 1 linha de composição para o predicado, achei {len(achadas)}"
    return achadas[0]


# ======================================================================================================
# 4. renderizador da tabela em texto (cópia fiel de gerar.py::render_tabela / modelo.py::br)
# ======================================================================================================
def br(x, max_casas=2):
    if x is None:
        return "—"
    if isinstance(x, str):
        return x
    s = f"{x:,.{max_casas}f}".replace(",", "X").replace(".", ",").replace("X", ".")
    if "," in s:
        s = s.rstrip("0").rstrip(",")
    return s


def _q(x, casas):
    return float(Decimal(str(x)).quantize(Decimal(1) if casas == 0 else Decimal("1." + "0" * casas), rounding=ROUND_HALF_UP))


def pct_int(x):
    return int(_q(x, 0))


def render_tabela(t):
    grupos = t["grupos_vd"]
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


# ======================================================================================================
# 5. utilidades de edição
# ======================================================================================================
def linha_tabela(bloco, item):
    achadas = [l for l in bloco.meta["tabela_nutricional"]["linhas"] if l["item"] == item]
    assert len(achadas) == 1, f"{bloco.slug}: esperava 1 linha '{item}' na tabela, achei {len(achadas)}"
    return achadas[0]


def set_vd(bloco, item, grupo, valor):
    l = linha_tabela(bloco, item)
    antes = l["vd_pct"][grupo]
    assert antes != valor, f"{bloco.slug}: {item} %VD já é {valor}"
    l["vd_pct"][grupo] = valor
    return antes


def set_energia(bloco, kcal_declarado, kj, kcal_exato):
    l = linha_tabela(bloco, "Valor energético")
    antes = (l["quantidade"], l["kj"], l.get("kcal_exato"))
    l["quantidade"] = kcal_declarado
    l["kj"] = kj
    l["kcal_exato"] = kcal_exato
    return antes


def sincronizar_texto(bloco):
    """nutritional_info (texto) = render da tabela JSON corrigida; confere que só a tabela muda."""
    bloco.campos["nutritional_info"] = render_tabela(bloco.meta["tabela_nutricional"])


def substituir_exato(texto, antes, depois, slug, campo):
    n = texto.count(antes)
    assert n == 1, f"{slug}.{campo}: esperava 1 ocorrência de {antes!r}, achei {n}"
    return texto.replace(antes, depois)


def remover_frase_warnings(bloco, frase):
    linhas = bloco.campos["warnings"].split("\n")
    n = linhas.count(frase)
    assert n == 1, f"{bloco.slug}.warnings: esperava 1 linha igual a {frase!r}, achei {n}"
    linhas.remove(frase)
    bloco.campos["warnings"] = "\n".join(linhas)


def trocar_frase_warnings(bloco, antes, depois):
    linhas = bloco.campos["warnings"].split("\n")
    n = linhas.count(antes)
    assert n == 1, f"{bloco.slug}.warnings: esperava 1 linha igual a {antes!r}, achei {n}"
    linhas[linhas.index(antes)] = depois
    bloco.campos["warnings"] = "\n".join(linhas)


def registrar_correcao(bloco, nota):
    """Anota, dentro de metadata.reformulacao_2026_09_16, o que esta passada corrigiu (rastreabilidade)."""
    notas = bloco.meta.setdefault(NOTA_CORRECAO_KEY, [])
    notas.append(nota)


def substituir_pendencia(bloco, contem, nova):
    p = bloco.meta["pendencias"]
    idx = [i for i, x in enumerate(p) if contem in x]
    assert len(idx) == 1, f"{bloco.slug}.pendencias: esperava 1 item contendo {contem!r}, achei {len(idx)}"
    antes = p[idx[0]]
    p[idx[0]] = nova
    return antes


def remover_pendencia(bloco, contem):
    p = bloco.meta["pendencias"]
    idx = [i for i, x in enumerate(p) if contem in x]
    assert len(idx) == 1, f"{bloco.slug}.pendencias: esperava 1 item contendo {contem!r}, achei {len(idx)}"
    return p.pop(idx[0])


# ======================================================================================================
# 6. correções por produto (fonte: docs/conformidade/reformulacao/<slug>.md, lidos em 17/09/2026)
# ======================================================================================================
REGRAS_MEMORIAL = ("Arredondamento: Anexo III da IN 75/2020 (paráfrase do gabarito de 16/09/2026). "
                   "%VD: Anexo VIII da IN 75/2020 para o grupo do rótulo (macronutrientes: Anexo II), calculado sobre o ativo exato "
                   "entregue pela massa pesada e só então arredondado (método do memorial). Quantidade não significativa (Anexo IV): %VD 0. "
                   "Sem VDR: célula em branco (RDC 429/2020, art. 12, §1º). Energia: kJ somado por macronutriente com os fatores do "
                   "Anexo XXII da IN 75 (17 kJ/g carboidrato e proteína, 37 kJ/g gordura, 10 kJ/g poliol, 13 kJ/g ácido orgânico, "
                   "8 kJ/g fibra) e kcal com os fatores em kcal/g, como o memorial faz; energia declarada em número inteiro (RDC 429/2020, art. 7º, § 1º) "
                   "quando o memorial assim o faz.")

CORRECOES = OrderedDict()  # slug -> função(bloco)


def correcao(slug):
    def deco(fn):
        CORRECOES[slug] = fn
        return fn
    return deco


# --- as correções por produto vivem no módulo irmão correcoes_2026_09_17.py (importado só na execução) ---


# ======================================================================================================
# 7. execução
# ======================================================================================================
def dump(blocos, destino):
    destino.mkdir(parents=True, exist_ok=True)
    for slug, b in blocos.items():
        d = OrderedDict()
        d["campos"] = b.campos
        d["meta"] = b.meta
        (destino / f"{slug}.json").write_text(json.dumps(d, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"dump: {len(blocos)} blocos em {destino}")


def main(argv):
    original = MIG.read_text(encoding="utf-8")
    blocos = parse_blocos(original)
    assert len(blocos) == 24, f"esperava 24 blocos na seção 5, achei {len(blocos)}"
    # round-trip: sem alteração, o arquivo tem de sair byte a byte igual
    reconstruido = montar(original, blocos)
    if reconstruido != original:
        # localiza a primeira diferença para depuração
        i = next(i for i, (a, b) in enumerate(zip(original, reconstruido)) if a != b) if len(original) == len(reconstruido) or True else 0
        raise SystemExit(f"round-trip falhou: primeira diferença perto do byte {i}: {original[i-80:i+80]!r} × {reconstruido[i-80:i+80]!r}")
    print("round-trip OK: parse + re-serialização reproduz o arquivo original byte a byte")
    if "--check" in argv:
        return
    if "--dump" in argv:
        dump(blocos, Path(argv[argv.index("--dump") + 1]))
        return
    # backup precisa existir e ser idêntico ao original antes da correção
    assert BACKUP.exists(), f"backup ausente: {BACKUP}"
    assert BACKUP.read_text(encoding="utf-8") == original, "o backup difere do arquivo atual — abortando (rode a correção só uma vez, a partir do original)"
    sys.path.insert(0, str(Path(__file__).resolve().parent))
    from correcoes_2026_09_17 import registrar  # módulo irmão com o conteúdo por produto
    registrar(CORRECOES, correcao)
    relatorio = []
    sql = original
    for slug, fn in CORRECOES.items():
        b = blocos[slug]
        antes = b.render()
        mudancas = fn(b, sql)
        if isinstance(mudancas, tuple):
            # correções que também alteram a seção 4 devolvem (lista, sql_novo)
            mudancas, sql = mudancas
        depois = b.render()
        assert depois != antes or mudancas == [], f"{slug}: função de correção não mudou nada"
        relatorio.append((slug, mudancas))
    # como a seção 4 pode ter mudado de tamanho, reparseia as posições dos blocos no sql novo
    blocos_novos = parse_blocos(sql)
    for slug, b in blocos.items():
        blocos_novos[slug].campos = b.campos
        blocos_novos[slug].meta = b.meta
    novo = montar(sql, blocos_novos)
    MIG.write_text(novo, encoding="utf-8")
    print(f"gravado: {MIG}")
    for slug, m in relatorio:
        print(f"\n{slug}:")
        for x in m:
            print(f"  - {x}")


if __name__ == "__main__":
    main(sys.argv[1:])
