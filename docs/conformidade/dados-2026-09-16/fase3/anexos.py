# -*- coding: utf-8 -*-
"""Leitura dos Anexos I, III e IV literais da IN 28/2018 (arquivos em disco, transcrição do portal).
Uso pelo verificar.py e pelo consolidador. Nenhum valor é digitado aqui: tudo vem dos arquivos."""
import re, unicodedata
from pathlib import Path

DOCS = Path("/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade")
ANEXO_I   = DOCS / "IN28-2018-ANEXO-I-LITERAL.md"
ANEXO_III = DOCS / "IN28-2018-ANEXO-III-LITERAL.md"
ANEXO_IV  = DOCS / "IN28-2018-ANEXOS-IV-V-VI-LITERAL.md"

GRUPOS = ["0 a 6 meses", "7 a 11 meses", "1 a 3 anos", "4 a 8 anos", "9 a 18 anos", "> 19 anos", "Gestantes", "Lactantes"]

_PAREN_ANOT = re.compile(r"\(\s*(Nutriente|Redação|Incluíd|Suplement|Excluíd)[^)]*\)")
def limpar_nome(cel: str) -> str:
    """Remove anotações de consolidação do portal e chamadas de nota; mantém o nome literal."""
    s = cel
    s = s.replace("<br>Redações Anteriores", "").replace("Redações Anteriores", "")
    s = _PAREN_ANOT.sub("", s)
    s = re.sub(r"RET\., \d\d/\d\d/\d{4} - Seção \d", "", s)
    s = re.sub(r"\^[ivx]+", "", s)          # chamadas de nota ^ii etc.
    s = s.replace("_", "")                   # Vitamina B_6 -> Vitamina B6
    s = re.sub(r"\s+", " ", s).strip(" ,")
    return s

def limpar_valor(cel: str):
    """Devolve (valor_float_ou_None, texto_literal). 'NA'/'NE' -> None com texto."""
    t = cel.replace("<br>Redações Anteriores", "")
    t = _PAREN_ANOT.sub("", t)
    t = re.sub(r"RET\., \d\d/\d\d/\d{4} - Seção \d", "", t)
    t = re.sub(r"\^[ivx]+", "", t).strip()
    lit = t
    if t in ("NA", "NE", ""):
        return None, t
    m = re.match(r"^([\d\.]+,\d+|[\d\.]+)", t)
    if not m:
        return None, lit
    num = m.group(1)
    # formato brasileiro: 1.916,02 ; 2.000 ; 0,26 ; 3.000
    if "," in num:
        num = num.replace(".", "").replace(",", ".")
    else:
        # ponto como separador de milhar quando seguido de 3 dígitos (2.000, 3.000, 1.281); "1000" sem ponto fica
        if re.fullmatch(r"\d{1,3}(\.\d{3})+", num):
            num = num.replace(".", "")
    try:
        return float(num), lit
    except ValueError:
        return None, lit

def _linhas_tabela(path: Path, titulo_inicio: str, titulo_fim: str):
    txt = path.read_text(encoding="utf-8")
    ini = txt.index(titulo_inicio)
    fim = txt.index(titulo_fim, ini) if titulo_fim else len(txt)
    bloco = txt[ini:fim]
    for ln in bloco.splitlines():
        if ln.startswith("|") and not ln.startswith("|---") and "coluna 1" not in ln:
            cels = [c.strip() for c in ln.strip().strip("|").split("|")]
            yield cels

def carregar_limites(path: Path, titulo_inicio: str, titulo_fim: str):
    """Dicionário nome_limpo -> {'unidade':..., 'grupos': {grupo: (valor, literal)}, 'literal_nome':...}."""
    out = {}
    for cels in _linhas_tabela(path, titulo_inicio, titulo_fim):
        if len(cels) != 10:
            continue
        nome = limpar_nome(cels[0])
        if not nome or "mesclada" in cels[0] or cels[0] in ("Nutrientes", "Substâncias bioativas", "Enzimas") or cels[0].startswith("Probióticos"):
            continue
        unidade = re.sub(r"\(.*?\)", "", cels[1]).replace("<br>Redações Anteriores", "").strip()
        grupos = {}
        for g, cel in zip(GRUPOS, cels[2:10]):
            grupos[g] = limpar_valor(cel)
        out[nome] = {"unidade": unidade, "grupos": grupos, "literal_nome": cels[0]}
    return out

def anexo_iii():
    return carregar_limites(ANEXO_III, "## ANEXO III", "**Notas de rodapé do Anexo III")

def anexo_iv():
    return carregar_limites(ANEXO_IV, "## ANEXO IV", "**Notas de rodapé do Anexo IV")

def anexo_i_texto():
    return ANEXO_I.read_text(encoding="utf-8")

def anexo_i_nomes():
    """Lista dos nomes de constituinte (coluna 1) do Anexo I, limpos e literais."""
    nomes = []
    for cels in _linhas_tabela(ANEXO_I, "## ANEXO I", "## ANEXO II"):
        if len(cels) >= 2 and "mesclada" not in cels[0]:
            nomes.append((limpar_nome(cels[0]), cels[0]))
    return nomes

def sem_acento(s):
    return "".join(c for c in unicodedata.normalize("NFD", s) if unicodedata.category(c) != "Mn").lower()

if __name__ == "__main__":
    a3 = anexo_iii(); a4 = anexo_iv()
    print(len(a3), "linhas no Anexo III;", len(a4), "linhas no Anexo IV")
    for n in ["Vitamina B6", "Ácido Fólico", "Ácido fólico", "Vitamina A", "Vitamina D", "Niacina", "Vitamina E", "Creatina", "Inositol", "Beta-alanina", "Cafeína", "Boro", "Melatonina", "Teanina", "Colina", "Cálcio", "Fibras alimentares", "Proteínas", "Lipídeos totais", "EPA e DHA", "Curcumina", "Silício", "Ácido hialurônico", "Glucosamina", "Metilsulfonilmetano", "Quercetina", "Antocianinas da laranja moro", "Ácido clorogênico", "Saponinas de glicosídeos de furostanol", "Colágeno tipo II não desnaturado", "Vitamina B12", "Vitamina K", "Tirosina", "Metionina", "Cisteína", "Triptofano", "Arginina", "Aspartato", "Glutamina", "Taurina", "L-Carnitina", "Cromo", "Magnésio", "Ferro", "Iodo", "Zinco", "Selênio", "Cobre", "Biotina", "Riboflavina", "Tiamina", "Ácido pantotênico", "Vitamina C"]:
        r3 = a3.get(n); r4 = a4.get(n)
        print(f"{n:42s} III: {r3['unidade'] if r3 else '—':4s} {r3['grupos']['> 19 anos'] if r3 else '—'} | IV: {r4['unidade'] if r4 else '—':4s} {r4['grupos']['> 19 anos'] if r4 else '—'} | gest III/IV: {r3['grupos']['Gestantes'][0] if r3 else '—'} / {r4['grupos']['Gestantes'][0] if r4 else '—'} | lact: {r3['grupos']['Lactantes'][0] if r3 else '—'} / {r4['grupos']['Lactantes'][0] if r4 else '—'}")
