# -*- coding: utf-8 -*-
"""
Correções por produto da migration 20260922000000 (17/09/2026). Cada função recebe o Bloco parseado por
corrigir_2026-09-17.py e o texto SQL inteiro, altera o bloco no lugar e devolve a lista do que mudou
(ou uma tupla (lista, sql_novo) quando também mexe na seção 4). Fonte de cada correção: o memorial do
produto em docs/conformidade/reformulacao/<slug>.md e o JSON gêmeo da fase 2 (notas truncadas).

Método de %VD e kJ (decisão registrada no relatório de 17/09/2026): mantido o da migration — %VD sobre a
quantidade arredondada declarada (RDC 429/2020, art. 12) e kJ = kcal × 4,184 (o Anexo XXII da IN 75/2020 só
traz fatores em kcal/g; o modelo de tabela vigente nem exige kJ). Onde o memorial calculou de outro modo, a
diferença fica anotada em metadata.reformulacao_2026_09_16.correcao_2026_09_17 para decisão do RT.
"""
import json
from collections import OrderedDict

from correcoes_2026_09_17_textos import MUDANCAS, REMOVIDOS, ALTERNATIVAS

FRASE_GENERICA = "Este produto não deve ser consumido por gestantes, lactantes e crianças."
NOTA_VD = ("%VD mantido sobre a quantidade arredondada declarada (RDC 429/2020, art. 12, lido no texto consolidado em 17/09/2026); "
           "o memorial calculou sobre o ativo exato: {detalhe}. Decisão do RT sobre qual vai ao rótulo.")
NOTA_KJ = ("kJ mantido = kcal × 4,184 ({kj} kJ); o memorial somou {mem} kJ com fatores de 17/13 kJ/g que ele próprio marca como "
           "PROVISÓRIOS e que não constam do Anexo XXII da IN 75/2020 (só kcal/g, lido em 16/09/2026).")
NOTAS_TRUNCADAS = {
    # slug: (item da tabela, texto completo da nota — JSON da fase 2, campo `motivo`, gêmeo estruturado do memorial)
    "zma-zinco-magnesio-e-vitamina-d": ("Teanina", "forma trocada (origem) — PENDENTE laudo: o rótulo destaca a L-teanina na chamada principal ('a união de zinco, magnésio, vitamina D3 e L-teanina'); mantém-se a dose (60% do teto) trocando a origem: só a de folhas de Camellia sinensis é autorizada (especificação aprovada: Blue California, painel ANVISA lido em 15/09). Rota A (retirar) registrada na seção 8."),
    "dores-musculares": ("Colágeno tipo II não desnaturado", "mantido — PENDENTE identidade: 40 mg (33× o mínimo). O Anexo I autoriza duas coisas distintas: 'Colágeno Tipo II' em Proteínas (mín. 8,4 g) e 'colágeno de frango com colágeno tipo II não desnaturado' (mín. 1,2 mg). O produto só é conforme no segundo enquadramento, e o laudo AUTO040251 (CAS 9007-34-5, 'fermentação biológica', sem fabricante) não prova nem a origem em frango nem a forma não desnaturada. Sem a ficha do fabricante, retirar."),
    "multi-vitta-gestante-e-lactante-em-capsula": ("Cobre", "mantido — PENDENTE laudo: dose do cadastro (13,0% do teto). O cadastro já nomeia bisglicinato de cobre; não há laudo dessa forma na máquina (só 'cobre aminoácido quelato' NaturalPRO, forma não identificada, e gluconato de cobre vencido)."),
    "serena": ("Teanina", "forma trocada (origem) + dose ajustada — PENDENTE laudo: 50 mg era o mínimo exato; 60 mg = 120% do mínimo (24% do teto), como o memorial rev02 recomenda. Origem: só a de folhas de Camellia sinensis é autorizada; a fábrica registra que o fornecedor atual (INLAB) não comercializa L-teanina — comprar de distribuidor com especificação Blue California. Rota A (retirar) na seção 8."),
}
GRUPO_MAIOR_IGUAL = ["bella-gummy-biotina-em-gummy", "creatina-em-gummy-sabor-tutti-frutti", "creatina-gummy-sabor-frutas-vermelhas",
                     "creatina-monohidratada-150g-soluvel", "creatina-monohidratada-300g-soluvel", "melatonina-em-gummy-sabor-uva",
                     "pre-treino-300-g", "pre-treino-creatina-sabor-limao-420g"]


# ------------------------------------------------------------------------------------------------------
# utilidades locais (as gerais vivem em corrigir_2026-09-17.py e chegam pelo objeto `u`)
# ------------------------------------------------------------------------------------------------------
def preencher_listas(b, m):
    n = []
    for chave, fonte in (("mudancas", MUDANCAS), ("removidos", REMOVIDOS), ("alternativas", ALTERNATIVAS)):
        if b.slug in fonte:
            assert b.meta[chave] == [], f"{b.slug}.{chave} não estava vazio"
            b.meta[chave] = list(fonte[b.slug])
            n.append(f"{chave}: {len(fonte[b.slug])} item(ns) transcritos da seção 4 / 'Retirados' / 'Alternativas' do memorial")
    return n


def completar_nota(b, u):
    item, texto = NOTAS_TRUNCADAS[b.slug]
    l = u.linha_tabela(b, item)
    assert texto.startswith(l["nota"]) and len(l["nota"]) < len(texto), f"{b.slug}: nota de {item} não é prefixo do texto completo"
    l["nota"] = texto
    return [f"nota da linha '{item}' completada (estava truncada em 200 caracteres pelo gerador; texto integral do JSON da fase 2)"]


def grupo_maior(b):
    antes = b.meta["grupo_populacional"]
    assert "≥ 19" in antes, f"{b.slug}: grupo sem '≥ 19'"
    b.meta["grupo_populacional"] = antes.replace("≥ 19", "> 19")
    return ["grupo_populacional: '≥ 19 anos' → '> 19 anos' (padrão dos demais produtos e do memorial, seção 1)"]


def nota_correcao(b, u, texto):
    u.registrar_correcao(b, texto)


# ------------------------------------------------------------------------------------------------------
def registrar(CORRECOES, correcao):
    import importlib.util, sys
    from pathlib import Path
    spec = importlib.util.spec_from_file_location("u", Path(__file__).resolve().parent / "corrigir_2026-09-17.py")
    u = importlib.util.module_from_spec(spec); spec.loader.exec_module(u)

    @correcao("zma-zinco-magnesio-e-vitamina-d")
    def zma(b, sql):
        n = completar_nota(b, u); u.sincronizar_texto(b)
        nota_correcao(b, u, "17/09/2026: nota da teanina completada (JSON da fase 2).")
        return n

    @correcao("multi-vitta-gestante-e-lactante-em-capsula")
    def multivitta(b, sql):
        n = completar_nota(b, u); u.sincronizar_texto(b)
        nota_correcao(b, u, "17/09/2026: nota do cobre completada (JSON da fase 2).")
        return n

    @correcao("dores-musculares")
    def dores(b, sql):
        n = completar_nota(b, u)
        adv = b.meta["advertencias_anexo_vi"]
        assert adv == [["Glucosamina", "Este produto não deve ser consumido por gestantes, lactantes e crianças. Pessoas com enfermidades e/ou sob o uso de medicamentos, consulte seu médico."]]
        adv[0][0] = "Glucosamina; Colágeno tipo II não desnaturado; Metilsulfonilmetano (a primeira oração é exigida pelas três linhas do Anexo VI — glucosamina, IN 304/2024; colágeno tipo II não desnaturado e MSM, IN 76/2020; a segunda oração é exclusiva da linha da glucosamina)"
        n.append("advertencias_anexo_vi: advertência atribuída também a 'Colágeno tipo II não desnaturado' e 'Metilsulfonilmetano' (memorial, seção 7)")
        nota_correcao(b, u, "17/09/2026: " + NOTA_VD.format(detalhe="vitamina E 136 % (60 mg de acetato de DL-alfa-tocoferol a 50,7 % × 0,671 ≈ 20,41 mg de α-tocoferol ÷ 15 mg); aqui 20 mg declarados ÷ 15 mg = 133 %") + " Nota do colágeno tipo II completada (JSON da fase 2); advertências do Anexo VI atribuídas às três linhas.")
        u.sincronizar_texto(b)
        return n

    @correcao("detox-matinal-lemon-shot-300g")
    def detox(b, sql):
        n = preencher_listas(b, MUDANCAS)
        antes = u.substituir_pendencia(b, "Excluir a cúrcuma do texto de apresentação", "Cúrcuma: só volta com extrato de rizoma padronizado e laudo de curcuminoides totais; o RT decide se o lote Pharma Nostra (95,15 %) atende à especificação.")
        n.append("pendência 6 alinhada ao memorial (seção 8, item 6: decisão do RT sobre o lote Pharma Nostra)")
        nota_correcao(b, u, "17/09/2026: " + NOTA_KJ.format(kj="121", mem="123") + " Listas mudancas/removidos/alternativas preenchidas; pendência 6 alinhada ao memorial.")
        u.sincronizar_texto(b)
        return n

    @correcao("saude-intestinal")
    def saude(b, sql):
        n = preencher_listas(b, MUDANCAS)
        l = u.linha_tabela(b, "Glutamina"); l["item"] = "L-glutamina"; n.append("tabela: 'Glutamina' → 'L-glutamina' (memorial, seção 5)")
        linhas = b.meta["tabela_nutricional"]["linhas"]
        assert not any(x["item"] == "Quercetina" for x in linhas)
        linhas.append(OrderedDict([("item", "Quercetina"), ("quantidade", 69.0), ("unidade", "mg"), ("vd_pct", None), ("nivel", 0),
                                   ("nota", "quercetina di-hidratada 72 mg × 96,05 % = 69,16 mg (24,7 % do teto de 280 mg, IN 418/2025); teor de laudo VENCIDO (lote 873635 INLAB, validade 06/2026) — pedir laudo novo e recalcular a massa pelo teor"),
                                   ("pendente", False), ("provisorio", True)]))
        n.append("tabela: linha 'Quercetina 69 mg' reincluída (texto e JSON), sem VDR (célula vazia), marcada provisória pelo laudo vencido")
        adv = b.meta["advertencias_anexo_vi"]
        assert adv == [["Aminoácidos", FRASE_GENERICA]]
        adv[0][0] = "Aminoácidos; Quercetina"
        n.append("advertencias_anexo_vi: linha 'Quercetina' (IN 418/2025) acrescentada à justificativa (memorial, seção 7)")
        nota_correcao(b, u, "17/09/2026: " + NOTA_VD.format(detalhe="vitamina B6 97 % (1,26 mg ÷ 1,3) e zinco 123 % (13,50 mg ÷ 11); aqui 1,3 mg ÷ 1,3 = 100 % e 14 mg ÷ 11 = 127 % — o próprio memorial (seção 5) prevê 127 % 'se a norma mandar calcular sobre o valor arredondado'") + " " + NOTA_KJ.format(kj="9,2", mem="9,4") + " Quercetina reincluída na tabela e na advertência; 'Glutamina' → 'L-glutamina'; forma_anexo_i da quercetina corrigida para 'Quercetina'; listas preenchidas.")
        u.sincronizar_texto(b)
        # seção 4: forma_anexo_i da linha da quercetina
        ini, fim, nome, meta, meta_raw, m2 = u.localizar_linha_composicao(sql, "saude-intestinal", lambda nome, meta: meta.get("constituinte") == "Quercetina")
        assert meta["forma_anexo_i"] == "quercetina di-hidratada, INLAB cód. 5781, lote 873635"
        meta["forma_anexo_i"] = "Quercetina"
        novo_json = u.dumps_json(meta)
        # substitui só o literal JSON dessa linha
        pos_json = m2.end()
        assert sql[pos_json] == "'"
        _, pos_fim = u.read_literal(sql, pos_json)
        sql = sql[:pos_json] + u.q(novo_json) + sql[pos_fim:]
        n.append("composição (seção 4): forma_anexo_i da quercetina 'quercetina di-hidratada, INLAB cód. 5781, lote 873635' → 'Quercetina' (nome comercial e lote permanecem em forma_insumo/laudo_lote)")
        return n, sql

    @correcao("moro-slim")
    def moro(b, sql):
        n = preencher_listas(b, MUDANCAS)
        u.substituir_pendencia(b, "Rótulo: nome do produto", "Rótulo: definir o nome ('MORO SLIM' × 'MORO SLIM COMPLEX'); retirar espirulina, quitosana, psyllium, inulina, feno-grego e cúrcuma da lista e do texto; remover crustáceos da lista de alergênicos (quitosana sai); corrigir '2.474 mg' de dióxido de silício.")
        n.append("pendência 7 alinhada ao memorial (seção 8, item 7: retirar os seis insumos da lista e do texto)")
        nota_correcao(b, u, "17/09/2026: " + NOTA_VD.format(detalhe="vitamina A 187 % (1.499,8 µg ÷ 800); aqui 1.500 µg ÷ 800 = 187,5 → 188 %") + " Listas preenchidas; pendência 7 alinhada. Resíduo não alterado (regra: linhas de composição intocadas): metadata.ativo do café verde grava 70,45 mg por arredondamento binário de 110 × 0,6405 = 70,455; o memorial escreve 70,46 mg — a tabela declara 70 mg nos dois casos.")
        u.sincronizar_texto(b)
        return n

    @correcao("pro-energy")
    def proenergy(b, sql):
        n = preencher_listas(b, MUDANCAS)
        l = u.linha_tabela(b, "Cafeína")
        antes = l["nota"]
        assert antes.startswith("PROVISÓRIO — cafeína anidra 10,22 mg + guaraná em pó 149,82 mg")
        l["nota"] = "PROVISÓRIO — cafeína anidra 149,82 mg + guaraná em pó ≤ 10,22 mg (metilxantinas totais do laudo, limite superior; o laudo de cafeína específica do guaraná fixa o valor final)"
        n.append("nota da cafeína: valores trocados corrigidos (anidra 149,82 mg; guaraná ≤ 10,22 mg — memorial, seção 3)")
        u.remover_frase_warnings(b, "Contém cafeína (160 mg por porção, incluindo a do guaraná — PROVISÓRIO até laudo de cafeína do guaraná).")
        n.append("warnings: frase 'Contém cafeína (160 mg...)' removida — não consta da seção 7 do memorial (a cafeína total fica declarada na tabela)")
        nota_correcao(b, u, "17/09/2026: " + NOTA_VD.format(detalhe="vitamina B6 632 % (8,22 mg ÷ 1,3); aqui 8,2 mg ÷ 1,3 = 631 %") + " " + NOTA_KJ.format(kj="4,2", mem="4,3") + " Nota da cafeína corrigida; frase informativa de cafeína retirada dos warnings; listas preenchidas.")
        u.sincronizar_texto(b)
        return n

    @correcao("emagrecedor-em-capsula")
    def emagrecedor(b, sql):
        n = preencher_listas(b, MUDANCAS)
        nota_correcao(b, u, "17/09/2026: " + NOTA_VD.format(detalhe="vitamina A 187 % (1.499,8 µg ÷ 800); aqui 1.500 µg ÷ 800 = 187,5 → 188 %") + " Listas preenchidas.")
        u.sincronizar_texto(b)
        return n

    @correcao("slim-up-emagrecimento-em-gota")
    def slimup(b, sql):
        n = preencher_listas(b, MUDANCAS)
        u.trocar_frase_warnings(b, "Conservar em local seco, fresco e ao abrigo da luz, em temperatura ambiente entre 15 °C e 30 °C. Após aberto, manter a embalagem bem fechada e consumir em até 60 dias. Não consumir se o lacre de segurança estiver violado.",
                                "Conservar em local seco, fresco e ao abrigo da luz. Após aberto, manter a embalagem bem fechada e seguir as orientações do rótulo.")
        n.append("warnings: conservação restaurada ao texto atual do banco, sem prazo após aberto (memorial, seção 7, item 6 — a fábrica define o prazo)")
        u.remover_frase_warnings(b, "O consumo excessivo pode ter efeito laxativo (contém polióis). [base legal a confirmar pelo RT]")
        n.append("warnings: frase dos polióis removida — não consta da seção 7 do memorial deste produto (só os memoriais das 4 gomas a registram)")
        u.substituir_pendencia(b, "Vitamina D3: manter 45 µg", "RT: vitamina D3 em 45 µg (90 % do teto) ou 40 µg (13,913 mg do pó) para folga maior; posição sobre a exigência de fabricante do painel (café verde, feno-grego), que não consta do Anexo I literal.")
        u.substituir_pendencia(b, "Assinar o memorial rev03", "Documentos: assinar o memorial rev03 (hoje rascunho) e atualizar a ficha técnica (ainda com D 50 µg, B12 9,94 µg e 'goma arábica') e o cadastro (5 linhas antigas, cromo como sal, 2 mL).")
        n.append("pendências 8 e 9 completadas conforme o memorial (posição do RT sobre fabricante do painel; atualização do cadastro)")
        nota_correcao(b, u, "17/09/2026: " + NOTA_VD.format(detalhe="cromo 88 % (30,85 µg ÷ 35); aqui 31 µg ÷ 35 = 89 %") + " Conservação restaurada; frase dos polióis retirada; pendências 8 e 9 completadas; listas preenchidas.")
        u.sincronizar_texto(b)
        return n

    @correcao("shot-colageno-300-gramas")
    def shot(b, sql):
        n = preencher_listas(b, MUDANCAS)
        l = u.linha_tabela(b, "Valor energético")
        l["nota"] = l["nota"].replace("kJ 17/17/13 kJ/g PROVISÓRIOS", "kJ = kcal × 4,184 (o Anexo XXII da IN 75/2020 só traz fatores em kcal/g)")
        n.append("nota do valor energético: fatores '17/17/13 kJ/g PROVISÓRIOS' substituídos pela convenção efetivamente usada (kcal × 4,184)")
        u.substituir_pendencia(b, "Rótulo/cadastro: retirar cúrcuma", "Rótulo/cadastro: alinhar a lista de ingredientes à composição (retirar cúrcuma, café verde e laranja moro, que não estão na composição); retirar a advertência de gestantes (sem base após a retirada dos extratos); não usar a alegação 'fonte de proteínas' (Anexo V/VII).")
        n.append("pendência 7 completada (retirar a advertência de gestantes — memorial, seção 8, item 7)")
        nota_correcao(b, u, "17/09/2026: " + NOTA_KJ.format(kj="147", mem="149") + " Listas preenchidas; pendência 7 completada.")
        u.sincronizar_texto(b)
        return n

    @correcao("bella-gummy-biotina-em-gummy")
    def bella(b, sql):
        n = preencher_listas(b, MUDANCAS) + grupo_maior(b)
        l = u.linha_tabela(b, "Biotina"); l["item"] = "Vitamina B7"; n.append("tabela: 'Biotina' → 'Vitamina B7' (memorial, seção 5: nome principal do Anexo XI, alternativo 'Biotina')")
        u.substituir_pendencia(b, "Rótulo declara \"vitamina E (DL-alfa-tocoferol) 16,7 mg", "Nova arte de rótulo: vitamina E 5,7 mg (38 % VD) no lugar de \"16,7 mg (111 % VD)\" — o ativo entregue é 5,68 mg de α-TE; corrigir a arte e a linha de composição (o insumo é o acetato); biotina 40 µg (133 % VD); designação \"Suplemento Alimentar em goma\"; retirar \"PELE · CABELO · UNHA\" (não é redação do Anexo V, como o memorial já apontou).")
        u.remover_pendencia(b, "PELE · CABELO · UNHA\" do rótulo não é redação")
        u.substituir_pendencia(b, "NÃO é exigida pelo Anexo VI para vitaminas e minerais", "Decisão do RT sobre a frase de gestantes/lactantes (\"Não deve ser consumido por gestantes, lactantes e crianças\", presente hoje no cadastro, NÃO é exigida pelo Anexo VI para vitaminas e minerais — manter ou retirar) e sobre a frase dos polióis (\"O consumo excessivo pode ter efeito laxativo (contém polióis)\": frase da fábrica, base legal não conferida).")
        n.append("pendências alinhadas ao memorial (seção 8: nova arte com os quatro itens; decisão do RT sobre gestantes e polióis)")
        nota_correcao(b, u, "17/09/2026: 'Biotina' → 'Vitamina B7' na tabela; grupo '> 19 anos'; pendências alinhadas; listas preenchidas.")
        u.sincronizar_texto(b)
        return n

    @correcao("creatina-monohidratada-150g-soluvel")
    def creat150(b, sql):
        n = preencher_listas(b, MUDANCAS) + grupo_maior(b)
        b.meta["veredito"] = "CONFORME (com folga) — condicionado à validação gravimétrica do dosador e à decisão do dono sobre a dose"
        n.append("veredito completado: '... e à decisão do dono sobre a dose' (memorial, seção 9)")
        u.trocar_frase_warnings(b, "Ingerir 1 dosador (4 g) diluído em água, 1 vez ao dia.", "Ingerir 1 dosador (4 g) diluído em 200 mL de água, 1 vez ao dia.")
        n.append("warnings: modo de uso com '200 mL de água' (memorial, seção 7)")
        p = b.meta["pendencias"]
        p.insert(1, "Decisão do dono sobre a dose: 4,0 g (recomendada) ou 4,5 g (memorial da fábrica; 90,45 % do teto na leitura A).")
        p.append("Insumo, laudo e embalagem (pote PEAD 600 mL B93, tampa rosca 93 mm) — nada a comprar; laudo válido até 22/09/2028.")
        n.append("pendências: repostos os itens 2 (decisão do dono sobre a dose) e 6 (insumo, laudo e embalagem) do memorial")
        nota_correcao(b, u, "17/09/2026: veredito completado; modo de uso com 200 mL; pendências 2 e 6 repostas; grupo '> 19 anos'; listas preenchidas.")
        return n

    @correcao("creatina-monohidratada-300g-soluvel")
    def creat300(b, sql):
        n = preencher_listas(b, MUDANCAS) + grupo_maior(b)
        b.meta["veredito"] = "CONFORME (com folga) — condicionado à validação gravimétrica do dosador e à documentação própria da apresentação de 300 g (memorial, arte e embalagem)"
        n.append("veredito completado: '(memorial, arte e embalagem)' (memorial, seção 9)")
        u.trocar_frase_warnings(b, "Ingerir 1 dosador (4 g) diluído em água, 1 vez ao dia.", "Ingerir 1 dosador (4 g) diluído em 200 mL de água, 1 vez ao dia.")
        n.append("warnings: modo de uso com '200 mL de água' (memorial, seção 7)")
        b.meta["pendencias"] = [
            "Confirmar com a fábrica a apresentação de 300 g: dose (4 g proposta × 75 porções) e pote (PEAD 600 mL comporta 300 g só com o pó assentado — 491 g/L solto ocupam ~611 mL, 737 g/L assentado ~407 mL; se for outro pote, laudo de embalagem próprio); descartar ou atualizar o SVG de arte com 'Porção: 3.000 mg (1 dosador) / 100 porções' e a proposta comercial de 14/02/2026 com '5 g × 60 doses' — qual arte vale é pergunta para a fábrica.",
            "Memorial de cálculo e arte de rótulo próprios para 300 g — não existem (o único memorial, MEM-CALC-CREATINAPO-rev02, trata só da apresentação de 150 g).",
            "Decisão do RT sobre a base do limite de creatina: leitura A (massa de creatina monoidratada, praticada pelo memorial e pela auditoria de 15/09) ou leitura B (creatina anidra, descontando a perda por dessecação de 11,5 % do laudo). A dose de 4.000 mg fica conforme e com folga nas duas.",
            "Validação gravimétrica do dosador: o certificado do dosador (Part Number 3.41.001.548) é de 8 mL de volume, não de massa; pela densidade aparente do laudo (491–737 g/L) 8 mL pesam 3,9–5,9 g. Definir o dosador/nível que entrega 4,0 g e registrar o ensaio.",
            "net_weight = '300 g' e conservação padronizada no cadastro (o cadastro traz 'Conservar em temperatura média entre 20 °C e 28 °C', redação diferente do pote de 150 g) — fora do SQL desta fase.",
            "Glúten: Lei 10.674/2003 obriga a frase; não há ensaio deste produto — só grafar \"Não contém glúten\" com laudo (ou declaração formal do RT).",
        ]
        n.append("pendências reescritas conforme o memorial do 300 g (seção 8: apresentação com o SVG de 3 g × 100 e a proposta comercial de 14/02/2026 de 5 g × 60 doses; memorial e arte próprios; net_weight e conservação)")
        nota_correcao(b, u, "17/09/2026: veredito completado; modo de uso com 200 mL; pendências alinhadas ao memorial do 300 g; grupo '> 19 anos'; listas preenchidas.")
        return n

    def _gummy_creatina(b, n):
        l = u.linha_tabela(b, "Valor energético")
        assert l["kcal_exato"] == 9.2041 and l["kj"] == 39.0
        antes = u.set_energia(b, 9.0, 39.0, 9.2041)
        n.append(f"valor energético: {u.br(antes[0])} kcal → 9 kcal (RDC 429/2020, art. 7º, § 1º, citado pelo memorial; kcal_exato 9,2041 e 39 kJ mantidos)")
        u.substituir_pendencia(b, "polióis totais mudam conforme a hipótese (2,46–2,98 g)", "Sorbitol: laudo anexado é de pó (98,5 %), o insumo é líquido 70 % — pedir laudo do insumo real; polióis totais mudam conforme a hipótese (2,48 g com o líquido a 70 %; 2,98 g se o insumo real for pó).")
        n.append("pendência do sorbitol: polióis '2,46' → '2,48 g' (memorial: 1.225 + 1.256 = 2.481 mg)")
        u.sincronizar_texto(b)

    @correcao("creatina-gummy-sabor-frutas-vermelhas")
    def gummyfv(b, sql):
        n = preencher_listas(b, MUDANCAS) + grupo_maior(b)
        _gummy_creatina(b, n)
        u.substituir_pendencia(b, "Decisão do RT sobre a base do limite (leitura A × leitura B)", "Decisão do RT: leitura A × leitura B do teor (a dose proposta atende às duas); fator de proteína da gelatina (N × 6,25 ou 5,55); glicerina na energia (sem fator no Anexo XXII — se contada a 4 kcal/g, energia 10 kcal e carboidratos 2,7 g).")
        u.substituir_pendencia(b, "Gelatina lote 214196 sem espécie declarada", "Gelatina lote 214196 sem espécie declarada (alergênico se peixe; BSE se bovina). Aroma de frutas vermelhas: laudo vencido em 21/05/2026 e da forma errada (laudo de pó para insumo líquido).")
        b.meta["pendencias"].append("nutritional_info do banco diz \"3 g (2 gomas)\" — corrigir junto com a decisão da porção.")
        n.append("pendências: decisões do RT completadas (fator da gelatina, glicerina na energia); aroma com laudo vencido em 21/05/2026 reposto; nutritional_info do banco ('3 g (2 gomas)') reposta")
        nota_correcao(b, u, "17/09/2026: energia 9 kcal (inteiro); polióis 2,48 g; pendências repostas; grupo '> 19 anos'; listas preenchidas.")
        return n

    @correcao("creatina-em-gummy-sabor-tutti-frutti")
    def gummytf(b, sql):
        n = preencher_listas(b, MUDANCAS) + grupo_maior(b)
        _gummy_creatina(b, n)
        u.remover_pendencia(b, "Designação de venda: \"Suplemento Alimentar em goma\"")
        n.append("pendência de designação de venda removida — herdada do frutas vermelhas; o memorial do tutti-frutti diz que o nome ('Suplemento Alimentar em goma') está mantido")
        b.meta["porcao_descricao"] = "2 gomas (rótulo: 6 g; massa real da porção PENDENTE de pesagem — os sólidos da receita somam ≈ 7.262 mg + aroma + corante, cujas massas estão PENDENTES)"
        u.substituir_pendencia(b, "sólidos por porção = 7.262 mg (creatina 3.500 + excipientes secos 3.762 mg)", "A porção declarada (6 g = 2 gomas de 3,00 g) NÃO comporta a receita: sólidos por porção ≈ 7.262 mg (creatina 3.500 + excipientes estruturais secos 3.762 mg, massas assumidas da irmã) + aroma + corante (massas PENDENTES). Pela OP do tutti-frutti (creatina 34,703 % do lote úmido; água 12,62 %; sólidos 87,38 % → creatina = 39,7 % dos sólidos), 2 gomas de 3,00 g totalmente secas teriam no máximo ≈ 2.383 mg de creatina — ABAIXO do mínimo de 3.000 mg (≈ 2.144 mg com 10 % de umidade residual); para 3.000 mg em 2 gomas, elas precisariam pesar ≈ 7,6 g secas (≈ 8,4 g com 10 % de umidade). Só a balança e o doseamento resolvem: pesar a goma acabada deste sabor e dosear creatina e creatinina no produto acabado (não há análise de produto acabado própria do tutti-frutti).")
        b.meta["pendencias"].append("nutritional_info do banco (\"3 g de creatina / Base da Gummy\") — substituído pela tabela da proposta, com a porção marcada como a confirmar.")
        n.append("sólidos de 7.262 mg anotados como 'sem aroma e corante' (porcao_descricao e pendência 1, reescrita a partir do memorial do tutti-frutti, seções 2–3); pendência do nutritional_info do banco reposta")
        assert b.meta["veredito"].endswith("(aroma, corante, laudos)")
        b.meta["veredito"] = b.meta["veredito"][:-len("(aroma, corante, laudos)")] + "(aroma, corante, laudos, memorial)"
        n.append("veredito: 'memorial' incluído na lista de documentos próprios pendentes (memorial, seção 9)")
        nota_correcao(b, u, "17/09/2026: energia 9 kcal; polióis 2,48 g; pendência de designação de venda removida; sólidos 7.262 mg excluem aroma e corante; veredito com 'memorial'; grupo '> 19 anos'; listas preenchidas.")
        return n

    @correcao("melatonina-em-gummy-sabor-uva")
    def melgummy(b, sql):
        n = preencher_listas(b, MUDANCAS) + grupo_maior(b)
        u.substituir_pendencia(b, "podem ser lidas como alegação implícita", "Doseamento de melatonina e triptofano no produto acabado (a análise MGW RG 005706/03/2026 não os dosa).")
        b.meta["observacoes"] = ["Frases \"preferencialmente antes de dormir\" / \"rotina noturna\" no rótulo podem ser lidas como alegação implícita (memorial, seção 7) — o RT decide; não é pendência de conformidade."]
        n.append("pendência 7: nota sobre frases do rótulo (que o memorial traz na seção 7 como observação, não como pendência) substituída pela pendência real 'doseamento de melatonina e triptofano no produto acabado'; a observação fica em metadata.observacoes")
        nota_correcao(b, u, "17/09/2026: pendência do doseamento reposta; observação das frases do rótulo movida para 'observacoes'; grupo '> 19 anos'; listas preenchidas.")
        return n

    @correcao("pre-treino-300-g")
    def pre300(b, sql):
        n = preencher_listas(b, MUDANCAS) + grupo_maior(b)
        u.substituir_pendencia(b, "(memorial, seção 16)", "Cafeína anidra é insumo controlado pela Polícia Federal (\"Controlado P.F.\" no laudo do lote 214171) — situação da licença da Lemoncaps não esclarecida em nenhum documento (memorial de cálculo da fábrica MEMORIAL-CALCULO-PRE-TREINO.docx, MC-PRD-PRETREINO-001 Rev. 01 de 14/08/2026, seção 16 \"Pendências — itens que impedem a aprovação deste memorial\", conferida em 17/09/2026).")
        n.append("pendência 2: 'memorial, seção 16' explicitada — é a seção 16 do memorial de cálculo da fábrica (docx lido em 17/09/2026), não do memorial de reformulação")
        u.substituir_pendencia(b, "B12 lote 90955 vence em 28/12/2026", "Maltodextrina lote 210170 vencido (26/07/2026); aroma de limão lote 19504 vence em 25/09/2026; cloridrato de L-arginina AUTO035918 vence em 12/11/2026. (B12: a fase 3 trocou a referência do lote 90955, que vence em 28/12/2026, pelo lote 219376, válido até 14/11/2030 — o mesmo dos outros produtos.)")
        u.substituir_pendencia(b, "Nova arte de rótulo (não existe rótulo deste produto em disco)", "Nova arte de rótulo (não existe rótulo deste produto em disco) e memorial de cálculo Rev.02 com esta fórmula.")
        n.append("pendências 3 e 7 alinhadas ao memorial (B12 lote 219376 harmonizado na fase 3; memorial de cálculo Rev.02)")
        nota_correcao(b, u, "17/09/2026: citação da seção 16 explicitada (memorial da fábrica); pendências 3 e 7 alinhadas; grupo '> 19 anos'; listas preenchidas.")
        return n

    @correcao("pre-treino-creatina-sabor-limao-420g")
    def pre420(b, sql):
        n = preencher_listas(b, MUDANCAS) + grupo_maior(b)
        u.substituir_pendencia(b, "B12 90955 28/12/2026", "Laudos a vencer: aroma de limão 25/09/2026; arginina HCl 12/11/2026; maltodextrina 210170 já vencida. (B12: a fase 3 trocou a referência do lote 90955, que vence em 28/12/2026, pelo lote 219376, válido até 14/11/2030 — o mesmo dos outros produtos.)")
        u.substituir_pendencia(b, "a versão sabor Maracujá precisa da mesma correção", "Nova arte (Limão e Maracujá): composição, B6 corrigida, guaraná em pó, advertências literais, soma 14 g (a atual imprime 15.000 mg de ativos em 14 g, B6 \"6.923 % VD\", \"extrato de guaraná\" e advertência mais fraca que o Anexo VI); e memorial de cálculo assinado pelo RT com os excipientes quantificados.")
        u.substituir_pendencia(b, "critério de energia dos aminoácidos livres; perfil de açúcares", "Decisões do RT: leitura A/B da creatina; energia dos aminoácidos livres; perfil de açúcares da maltodextrina; se o %VD de B6 (5.692 %) é desejado como conceito.")
        n.append("pendências 7, 8 e 9 alinhadas ao memorial (B12 lote 219376; memorial assinado pelo RT com excipientes quantificados; %VD de B6 como conceito)")
        u.substituir_pendencia(b, "pedir laudo com doseamento de cafeína e razão social;", "Guaraná: laudo do lote 25H26-B028-213428 dá metilxantinas totais (5,11 %), não cafeína isolada, e não identifica o fornecedor — pedir laudo com doseamento de cafeína (não só metilxantinas), razão social/CNPJ e denominação 'guaraná em pó, semente' (texto pronto na seção 5.1 do parecer de 15/09); até lá a cafeína do guaraná foi computada pelo teto (12,8 mg).")
        l = u.linha_tabela(b, "Valor energético")
        assert l["nota"].startswith("maltodextrina 2,268 g × 4") and "= 21,63 kcal" in l["nota"] and l["kcal_exato"] == 21.6634
        l["nota"] = l["nota"].replace("maltodextrina 2,268 g × 4", "maltodextrina 2,275 g × 4").replace("= 21,63 kcal", "= 21,66 kcal")
        n.append("pendência 2 completada (CNPJ e denominação 'guaraná em pó, semente' — memorial, seção 8, item 2); nota do valor energético com a massa harmonizada de maltodextrina (2,275 g → 21,66 kcal, que é o kcal_exato gravado), no lugar da massa da fase 2 (2,268 g)")
        # seção 4: status da arginina
        ini, fim, nome, meta, meta_raw, m2 = u.localizar_linha_composicao(sql, "pre-treino-creatina-sabor-limao-420g", lambda nome, meta: meta.get("constituinte") == "Arginina")
        assert meta["status"] == "forma trocada / dose ajustada"
        meta["status"] = "forma definida (a FRM não dizia) / dose ajustada"
        pos_json = m2.end(); _, pos_fim = u.read_literal(sql, pos_json)
        sql = sql[:pos_json] + u.q(u.dumps_json(meta)) + sql[pos_fim:]
        n.append("composição (seção 4): status da arginina 'forma trocada / dose ajustada' → 'forma definida (a FRM não dizia) / dose ajustada' (memorial, seção 3)")
        nota_correcao(b, u, "17/09/2026: status da arginina corrigido; pendências 7–9 alinhadas; grupo '> 19 anos'; listas preenchidas.")
        return n, sql

    @correcao("focus-colina")
    def focus(b, sql):
        antes = u.set_energia(b, 1.7, 7.2, 1.72)
        nota_correcao(b, u, "17/09/2026: kcal_exato 1,68 → 1,72 (conta do memorial, seção 5: proteínas 405 mg × 4 = 1,62 kcal + inositol 25 mg × 4 = 0,10 kcal); kJ 7,0 → 7,2 (1,72 × 4,184 = 7,196); o memorial escreve 7,31 kJ com 17 kJ/g, fator que não consta do Anexo XXII da IN 75/2020.")
        u.sincronizar_texto(b)
        return [f"valor energético: kcal_exato {antes[2]} → 1,72 e kJ {u.br(antes[1])} → 7,2 (texto '1,7 kcal = 7,2 kJ'); o memorial imprime 7,3 kJ pelo fator 17 kJ/g"]

    @correcao("melatonina-triptofanos-encapsulados")
    def meltrip(b, sql):
        n = []
        u.remover_frase_warnings(b, FRASE_GENERICA)
        adv = b.meta["advertencias_anexo_vi"]
        assert adv[1] == ["Aminoácidos", FRASE_GENERICA]
        adv[0][0] = "Melatonina; Aminoácidos (triptofano, aspartato, glutamina — a primeira oração da frase da melatonina cobre a exigência da linha 'Aminoácidos')"
        del adv[1]
        n.append("warnings: frase genérica duplicada removida — a frase da melatonina cobre a exigência dos aminoácidos (memorial, seção 7); advertencias_anexo_vi consolidada em uma entrada")
        m = b.meta["mudancas"]
        i = [k for k, x in enumerate(m) if x.startswith("L-glutamina: 94,77 → 95 mg")]
        assert len(i) == 1 and "laudo Lepuge válido" in m[i[0]]
        m[i[0]] = "L-glutamina: 94,77 → 95 mg (arredondamento; laudo do lote 950334, INLAB, 99,6 % — harmonizado na fase 3, 16/09/2026; o AUTO039665 da Lepuge, 98,47 % t.q., vence em 08/11/2026)."
        n.append("mudancas: glutamina cita o lote 950334 INLAB (99,6 %), o gravado na composição, em vez de 'laudo Lepuge válido' (memorial, seção 3)")
        nota_correcao(b, u, "17/09/2026: frase genérica duplicada retirada dos warnings; mudança da glutamina alinhada ao lote 950334 INLAB.")
        return n

    @correcao("serena")
    def serena(b, sql):
        n = completar_nota(b, u)
        u.remover_frase_warnings(b, FRASE_GENERICA)
        adv = b.meta["advertencias_anexo_vi"]
        assert adv[1] == ["Aminoácidos; Inositol", FRASE_GENERICA]
        adv[0][0] = "Melatonina; Aminoácidos; Inositol (a primeira oração da frase da melatonina cobre as linhas 'Aminoácidos' e 'Inositol')"
        del adv[1]
        n.append("warnings: frase genérica duplicada removida — a frase da melatonina cobre as linhas Aminoácidos e Inositol (memorial, seção 7)")
        u.trocar_frase_warnings(b, "Conservar em local seco, fresco e ao abrigo da luz, em temperatura ambiente entre 15 °C e 30 °C. Após aberto, manter a embalagem bem fechada e consumir em até 60 dias. Não consumir se o lacre de segurança estiver violado.",
                                "Conservar em local seco, fresco e arejado, ao abrigo da luz e do calor excessivo, em temperatura ambiente entre 15 °C e 30 °C. Após aberto, consumir em até 60 dias. Não consumir se o lacre de segurança estiver violado.")
        n.append("warnings: conservação como o memorial (seção 7): 'seco, fresco e arejado, ao abrigo da luz e do calor excessivo...', sem 'manter a embalagem bem fechada'")
        nota_correcao(b, u, "17/09/2026: nota da teanina completada (JSON da fase 2); frase genérica duplicada retirada; conservação conforme o memorial.")
        u.sincronizar_texto(b)
        return n

    @correcao("omega-pro-tg")
    def omega(b, sql):
        l = u.linha_tabela(b, "Valor energético")
        assert l["nota"].endswith("kJ 37 kJ/g PROVISÓRIO") and l["kj"] == 38.0
        l["nota"] = l["nota"].replace("kJ 37 kJ/g PROVISÓRIO", "kJ = kcal × 4,184 (38 kJ; o Anexo XXII da IN 75/2020 só traz fatores em kcal/g)")
        return ["nota do valor energético (só metadata; composição e campos não tocados): '37 kJ/g PROVISÓRIO' substituído pela convenção usada (9 × 4,184 = 37,7 → 38 kJ)"]
