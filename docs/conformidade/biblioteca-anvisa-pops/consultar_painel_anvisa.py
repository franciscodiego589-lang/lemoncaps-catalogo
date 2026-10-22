"""
CONSULTA AO PAINEL OFICIAL DA ANVISA — Constituintes Autorizados para Suplementos

Baixa os dados direto da API do Power BI que alimenta o painel oficial, sem depender de
PDF consolidado (que fica desatualizado) nem de busca na web.

    python3 _geradores/consultar_painel_anvisa.py                 # baixa e salva o JSON
    python3 _geradores/consultar_painel_anvisa.py creatina        # consulta um termo
    python3 _geradores/consultar_painel_anvisa.py "ácido fólico" biotina zinco
    python3 _geradores/consultar_painel_anvisa.py --atualizar     # rebaixa da API e regrava

O link do painel sai da página oficial da ANVISA:
https://www.gov.br/anvisa/pt-br/assuntos/alimentos/suplementos-alimentares/consulte-a-lista-de-ingredientes-autorizados

O JSON local é apenas cache. A fonte é a API; use --atualizar sempre que o dado for
sustentar decisão de fabricação, porque o painel muda sem aviso.

Validado em 20/08/2026 — 558 constituintes. Conferências que bateram com a fonte:
creatina 3.000–5.000 mg · L-teanina de Camellia sinensis 50–250 mg.

Histórico das releituras:
  13/08/2026 — 559 constituintes (primeira carga da API).
  20/08/2026 — 558 constituintes. Três diferenças, 555 linhas idênticas:
    · "Café verde em pó" (Sorocaps, 75–200 mg) passou a ter duas alegações de cafeína,
      onde antes constava "não autorizada alegação";
    · as duas linhas de Bifidobacterium lactis NCC 2818 viraram uma só, e a ANVISA
      quebrou o nome do constituinte, que hoje consta no painel como "ana";
    · "Óleo de semente de abóbora (famíliaCurcubitaceae)" ganhou o espaço que faltava.
"""
import datetime
import gzip
import json
import os
import re
import sys
import urllib.request

# resourceKey extraído do parâmetro r= do link do painel (base64 -> {"k": ..., "t": ...})
RESOURCE_KEY = "458ce16a-f74b-4e92-977a-e12e2927d746"
DATASET_ID = "1ea16037-e72d-4950-bdf2-11f2035c6340"
MODEL_ID = 2075532
ENTITY = "Contituintes IN 28"          # o typo é do próprio painel
API = "https://wabi-brazil-south-api.analysis.windows.net/public/reports/querydata?synchronous=true"

COLUNAS_API = [
    "Constituintes Autorizados", "CAS", "Categoria",
    "Nutriente/Substância Bioativa/Enzima", "Função", "Especificações",
    "0 a 6 meses", "7 a 11 meses", "1 a 3 anos", "4 a 8 anos ", "9 a 18 anos",
    "Maiores 19 anos ", "Lactantes", "Gestantes ",
    "Alegações autorizadas e requisitos para uso da alegação",
    "Requisitos de Rotulagem Complementar e outros", "Outras Informações",
]
COLUNAS = [
    "Constituinte", "CAS", "Categoria", "Tipo", "Funcao", "Especificacoes",
    "0_6m", "7_11m", "1_3a", "4_8a", "9_18a", "MAIORES_19", "Lactantes", "Gestantes",
    "Alegacoes", "Rotulagem", "Outras",
]
DESTINO = os.path.join(os.path.dirname(os.path.abspath(__file__)), "PAINEL-ANVISA-CONSTITUINTES.json")


def baixar():
    """Consulta a API do Power BI e devolve a lista de linhas decodificada."""
    sel = [{"Column": {"Expression": {"SourceRef": {"Source": "c"}}, "Property": p},
            "Name": f"c.{p}"} for p in COLUNAS_API]
    payload = {
        "version": "1.0.0",
        "queries": [{
            "Query": {"Commands": [{"SemanticQueryDataShapeCommand": {
                "Query": {"Version": 2,
                          "From": [{"Name": "c", "Entity": ENTITY, "Type": 0}],
                          "Select": sel},
                "Binding": {"Primary": {"Groupings": [{"Projections": list(range(len(COLUNAS_API)))}]},
                            "DataReduction": {"DataVolume": 3,
                                              "Primary": {"Window": {"Count": 50000}}},
                            "Version": 1},
            }}]},
            "QueryId": "",
            "ApplicationContext": {"DatasetId": DATASET_ID,
                                   "Sources": [{"ReportId": "x", "VisualId": "y"}]},
        }],
        "cancelQueries": [],
        "modelId": MODEL_ID,
    }
    req = urllib.request.Request(
        API, data=json.dumps(payload).encode(),
        headers={"Content-Type": "application/json;charset=UTF-8",
                 "X-PowerBI-ResourceKey": RESOURCE_KEY,
                 "Accept": "application/json, text/plain, */*",
                 "Accept-Encoding": "gzip"})
    raw = urllib.request.urlopen(req, timeout=90).read()
    if raw[:2] == b"\x1f\x8b":
        raw = gzip.decompress(raw)
    return decodificar(json.loads(raw))


def decodificar(resposta):
    """Decodifica a resposta comprimida do Power BI (formato DSR).

    São TRÊS estruturas por linha, e ignorar qualquer uma corrompe a linha inteira:
      C  — a lista de valores efetivamente transmitidos;
      R  — bitmask "repeat": bit ligado = o valor é igual ao da linha anterior;
      Ø  — bitmask "null":   bit ligado = o valor é nulo.

    Em R e em Ø o valor NÃO é consumido de C. Ignorar o Ø faz cada campo nulo puxar o
    valor seguinte de C e deslocar todas as colunas à direita — foi assim que o limite da
    niacina (2,4–35 mg) apareceu na espirulina, na caseína e nas farinhas proteicas, e que
    63 linhas ficaram com o índice numérico da categoria em vez do nome. Corrigido em
    14/08/2026, depois de o absurdo de "35 mg de proteína" denunciar o deslocamento.
    """
    ds = resposta["results"][0]["result"]["data"]["dsr"]["DS"][0]
    dicts = ds.get("ValueDicts", {})
    n = len(COLUNAS)
    linhas, anterior = [], [None] * n
    for ph in ds["PH"]:
        for item in list(ph.values())[0]:
            if "C" not in item:            # linha de schema
                continue
            valores = item["C"]
            repete = item.get("R", 0)
            nulos = item.get("Ø", 0)
            atual, i_valor = [], 0
            for i in range(n):
                if nulos & (1 << i):       # nulo: não consome valor de C
                    atual.append(None)
                    continue
                if repete & (1 << i):      # repete a linha anterior: também não consome
                    atual.append(anterior[i])
                    continue
                v = valores[i_valor] if i_valor < len(valores) else None
                i_valor += 1
                d = dicts.get(f"D{i}")
                if d is not None and isinstance(v, int) and 0 <= v < len(d):
                    v = d[v]
                atual.append(v)
            anterior = atual[:]
            linhas.append(atual)
    return linhas


def carregar(forcar=False):
    """Devolve as linhas do painel. Com forcar=True, ignora o cache e rebaixa da API."""
    if os.path.exists(DESTINO) and not forcar:
        return json.load(open(DESTINO, encoding="utf-8"))["linhas"]
    linhas = baixar()
    salvar(linhas)
    return linhas


def salvar(linhas):
    json.dump({"colunas": COLUNAS, "linhas": linhas, "fonte": "painel ANVISA via Power BI API",
               "consultado_em": datetime.date.today().isoformat()},
              open(DESTINO, "w"), ensure_ascii=False, indent=1)


def limpar(v):
    return re.sub(r"\s+", " ", str(v or "—")).strip()


def consultar(termo, linhas):
    achados = [l for l in linhas if termo.lower() in str(l[0] or "").lower()]
    if not achados:
        print(f"\n### {termo}: NADA ENCONTRADO no painel")
        return
    print(f"\n{'=' * 78}\n### {termo.upper()} — {len(achados)} entrada(s)")
    for l in achados:
        print(f"\n  • {limpar(l[0])}")
        print(f"      CAS ............ {limpar(l[1])}")
        print(f"      Função ......... {limpar(l[4])}")
        print(f"      Especificações . {limpar(l[5])[:150]}")
        print(f"      >19 ANOS ....... {limpar(l[11])}")
        print(f"      Gestantes ...... {limpar(l[13])}")
        alg = limpar(l[14])
        if alg != "—":
            print(f"      Alegações ...... {alg[:180]}")
        rot = limpar(l[15])
        if rot != "—" and "não há" not in rot.lower():
            print(f"      Rotulagem ...... {rot[:180]}")


if __name__ == "__main__":
    termos = [t for t in sys.argv[1:] if t != "--atualizar"]
    forcar = "--atualizar" in sys.argv[1:]
    linhas = carregar(forcar)
    data = "—"
    if os.path.exists(DESTINO):
        data = json.load(open(DESTINO, encoding="utf-8")).get("consultado_em", "—")
    print(f"Painel ANVISA — {len(linhas)} constituintes · consultado em {data} · {DESTINO}")
    for termo in termos:
        consultar(termo, linhas)
    if not termos and not forcar:
        print("\nUso: python3 consultar_painel_anvisa.py <termo> [termo...] [--atualizar]")
