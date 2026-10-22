# -*- coding: utf-8 -*-
from lib import *
slug = "saude-intestinal"; PORCAO = 1000.0

glu_ins=135.54; glu_teor=99.6; glu_ativo=round(glu_ins*glu_teor/100,2)                 # 135,00
mg_ins=297.81; mg_teor=30.22; mg_ativo=round(mg_ins*mg_teor/100,2)                      # 90,00
que_ins=72.0; que_teor=96.05; que_ativo=round(que_ins*que_teor/100,2)                   # 69,16
zn_ins=67.87; zn_teor=19.89; zn_ativo=round(zn_ins*zn_teor/100,2)                       # 13,50
va_ins=3.17; va_ui_g=568116; va_ui=va_ins/1000*va_ui_g; va_rae=round(va_ui*0.3,1)      # 540,3
b6_ins=1.53; b6_ativo=round(b6_ins*0.999*0.8227,2)                                      # 1,26
sio2=5.0
soma_ins = glu_ins+mg_ins+que_ins+zn_ins+va_ins+b6_ins+sio2
malto = round(PORCAO-soma_ins,2)
soma = round(soma_ins+malto,2)
print("insumos+SiO2:", round(soma_ins,2), "| maltodextrina q.s.p.:", malto, "| soma:", soma)
print("vitA:", round(va_ui,1), "UI ->", va_rae, "µg RAE | B6:", b6_ativo)
kcal = glu_ins/1000*4 + malto/1000*4; kj = glu_ins/1000*17 + malto/1000*17
print(f"energia {kcal:.3f} kcal / {kj:.2f} kJ; carboidratos {malto/1000:.4f} g")

insumos = [
 {"constituinte_anexo_i": "Fibras alimentares — Psyllium (Plantago ovatae)", "forma_insumo": "psyllium pó (tegumento), lote AUTO9JPE", "nome_composicao": "Psyllium", "ingredient_slug": "psyllium", "ingredient_nome": "Psyllium",
  "massa_insumo_mg": 342.0, "teor_pct": None, "teor_fonte": "laudo só traz índice de intumescimento (não há % de fibra); massa = entrega 1:1 (memorial rev02)", "ativo_mg": 342.0, "unidade_ativo": "mg (no máximo, como fibra)", "minimo": 5700, "maximo": "NE", "pct_do_maximo": None,
  "linha_anexo": LIMITES["Fibras alimentares"]["linha"], "laudo": {"lote": "AUTO9JPE (Santosflora) — scan não lido; outro lote em Documents/LAUDOS vencido em 01/11/2023", "validade": "não confirmada", "vencido": None},
  "status": "retirado", "motivo": "Fibras alimentares: mínimo 5,7 g/dia (Anexo III). Psyllium + inulina + FOS somam 567 mg (9,9 % do mínimo) e em cápsula nunca chegam a 5,7 g — princípio 6 (o dono já retirou psyllium de outro produto pelo mesmo motivo). Alternativa registrada, não principal: versão em pó/sachê com ≥ 5,7 g de fibras."},
 {"constituinte_anexo_i": "Fibras alimentares — Inulina (CAS 9005-80-5)", "forma_insumo": "inulina de raiz de chicória, lote 206486 (91,0 %)", "nome_composicao": "Inulina", "ingredient_slug": "inulina-de-cichorium-intybus", "ingredient_nome": "Inulina de Cichorium intybus",
  "massa_insumo_mg": 135.0, "teor_pct": 91.0, "teor_fonte": "laudo lote 206486 (91,0 %), lido no memorial rev02", "ativo_mg": 122.85, "unidade_ativo": "mg de inulina", "minimo": 5700, "maximo": "NE", "pct_do_maximo": None,
  "linha_anexo": LIMITES["Fibras alimentares"]["linha"], "laudo": {"lote": "206486 (SM/Fagron)", "validade": "não confirmada no inventário (scan); lotes alternativos válidos: Lepuge AUTO039704 (90,12 %, 30/11/2028) e SM 26C20-B044-220687 (93,0 %, 18/09/2030)", "vencido": None},
  "status": "retirado", "motivo": "Mesmo motivo do psyllium (fibras, mínimo 5,7 g)."},
 {"constituinte_anexo_i": "Fibras alimentares — Frutooligossacarídeos (FOS)", "forma_insumo": "FOS, Fagron, lote 212448 (96,3 %)", "nome_composicao": "Frutooligossacarídeos (FOS)", "ingredient_slug": "frutooligossacarideos", "ingredient_nome": "Frutooligossacarídeos (FOS)",
  "massa_insumo_mg": 90.0, "teor_pct": 96.3, "teor_fonte": "laudo lote 212448 (96,30 %), lido no memorial rev02", "ativo_mg": 86.67, "unidade_ativo": "mg de FOS", "minimo": 5700, "maximo": "NE", "pct_do_maximo": None,
  "linha_anexo": LIMITES["Fibras alimentares"]["linha"], "laudo": {"lote": "212448 (Fagron)", "validade": "04/09/2028 (lida no memorial rev02)", "vencido": False},
  "status": "retirado", "motivo": "Mesmo motivo do psyllium (fibras, mínimo 5,7 g)."},
 {"constituinte_anexo_i": "Curcumina — Extrato de rizomas de cúrcuma (Curcuma longa L.)^xv", "forma_insumo": "extrato NaturalPRO, lote NPT.0425/580 (0,42 %)", "nome_composicao": "Extrato de rizomas de cúrcuma (Curcuma longa L.)", "ingredient_slug": "extrato-de-rizomas-de-curcuma", "ingredient_nome": "Extrato de rizomas de cúrcuma",
  "massa_insumo_mg": 117.0, "teor_pct": 0.42, "teor_fonte": "laudo lote NPT.0425/580 (0,42 % de curcumina), lido no memorial rev02", "ativo_mg": 0.49, "unidade_ativo": "mg de curcuminoides", "minimo": 80, "maximo": 130, "pct_do_maximo": 0.4,
  "linha_anexo": LIMITES["Curcumina"]["linha"], "laudo": {"lote": "NPT.0425/580 (NaturalPRO)", "validade": "não confirmada em disco", "vencido": None},
  "status": "retirado", "motivo": "117 × 0,42 % = 0,49 mg = 0,6 % do mínimo de 80 mg de curcuminoides; inatingível com este extrato (19.048 mg para 80 mg). Volta com extrato de rizoma padronizado e laudo: dose conforme 100 mg de curcuminoides (77 % do teto) = 105,3 mg a 95 %; nesse caso entra a advertência específica da IN 438/2026."},
 {"constituinte_anexo_i": "Glutamina — L-Glutamina (CAS 56-85-9)", "forma_insumo": "L-glutamina, INLAB ref. A100020, lote interno 950334", "nome_composicao": "L-glutamina", "ingredient_slug": "l-glutamina", "ingredient_nome": "L-glutamina",
  "massa_insumo_mg": glu_ins, "teor_pct": glu_teor, "teor_fonte": "laudo lote 950334 (99,6 %), lido no memorial rev02 (laudo INLAB, validade 28/01/2027)", "ativo_mg": glu_ativo, "unidade_ativo": "mg", "minimo": "NE", "maximo": 5000, "pct_do_maximo": pct_max(glu_ativo,5000),
  "linha_anexo": LIMITES["Glutamina"]["linha"], "laudo": {"lote": "950334", "validade": "28/01/2027 (memorial rev02); no inventário o PDF é scan não lido — lote alternativo Lepuge AUTO039665 válido até 08/11/2026", "vencido": False},
  "status": "mantido", "motivo": "Dentro da faixa (2,7 % do teto; mínimo NE)."},
 {"constituinte_anexo_i": "Magnésio — Bisglicinato de magnésio (CAS 14783-68-7)", "forma_insumo": "magnésio glicinato 30 %, Analitic, lote 90844", "nome_composicao": "Bisglicinato de magnésio (equivalente a 90 mg de magnésio)", "ingredient_slug": "magnesio", "ingredient_nome": "Magnésio", "e_sal": True,
  "massa_insumo_mg": mg_ins, "teor_pct": mg_teor, "teor_fonte": "laudo lote 90844: 30,38 % base seca (lido) × (1 − 0,53 % umidade) = 30,22 % tal qual (conta do memorial rev02, reconferida) — LAUDO VENCIDO", "ativo_mg": mg_ativo, "unidade_ativo": "mg de magnésio", "minimo": 63, "maximo": 350, "pct_do_maximo": pct_max(mg_ativo,350),
  "linha_anexo": LIMITES["Magnésio"]["linha"], "laudo": {"lote": "90844 (fabricante 66342023062230)", "validade": "21/06/2025", "vencido": True},
  "status": "mantido (laudo a renovar)", "motivo": "90 mg de magnésio = 143 % do mínimo e 25,7 % do teto — mantido. Com as fibras e a cúrcuma fora, os 297,81 mg do sal cabem na porção. Último teor conhecido é de laudo vencido: pedir laudo novo do lote em uso antes de fabricar."},
 {"constituinte_anexo_i": "Quercetina — Quercetina (IN 418/2025; linha do Anexo I sem CAS)", "forma_insumo": "quercetina di-hidratada, INLAB cód. 5781, lote 873635", "nome_composicao": "Quercetina", "ingredient_slug": "quercetina", "ingredient_nome": "Quercetina",
  "massa_insumo_mg": que_ins, "teor_pct": que_teor, "teor_fonte": "laudo lote 873635 (96,05 %), lido no memorial rev02 — LAUDO VENCIDO (06/2026)", "ativo_mg": que_ativo, "unidade_ativo": "mg de quercetina", "minimo": "NE", "maximo": 280, "pct_do_maximo": pct_max(que_ativo,280),
  "linha_anexo": LIMITES["Quercetina"]["linha"], "laudo": {"lote": "873635 (INLAB)", "validade": "06/2026", "vencido": True},
  "status": "mantido (laudo a renovar)", "motivo": "69,16 mg = 24,7 % do teto; mínimo NE. A linha 'Quercetina' do Anexo I não traz CAS nem restringe forma anidra/di-hidratada; a dúvida levantada no memorial vem do painel — RT decide. Laudo novo obrigatório."},
 {"constituinte_anexo_i": "Zinco — Bisglicinato de zinco (CAS 14281-83-5)", "forma_insumo": "zinco quelato 20 % (bisglicinato), Galena, lote 055-ZN/25", "nome_composicao": "Bisglicinato de zinco (equivalente a 13,5 mg de zinco)", "ingredient_slug": "zinco", "ingredient_nome": "Zinco", "e_sal": True,
  "massa_insumo_mg": zn_ins, "teor_pct": zn_teor, "teor_fonte": "laudo lote 055-ZN/25: 20,00 % b.s. × (1 − 0,54 %) = 19,89 % t.q.", "ativo_mg": zn_ativo, "unidade_ativo": "mg de zinco", "minimo": 1.65, "maximo": 29.59, "pct_do_maximo": pct_max(zn_ativo,29.59),
  "linha_anexo": LIMITES["Zinco"]["linha"], "laudo": {"lote": "055-ZN/25 (Galena)", "validade": "06/05/2027", "vencido": False},
  "status": "mantido", "motivo": "13,50 mg = 45,6 % do teto — mantido."},
 {"constituinte_anexo_i": "Vitamina A — Acetato de retinol/Acetato de retinila (CAS 127-47-9)", "forma_insumo": "vitamina A acetato pó 568.116 UI/g, lote 215230", "nome_composicao": "Acetato de retinila (vitamina A)", "ingredient_slug": "vitamina-a", "ingredient_nome": "Vitamina A",
  "massa_insumo_mg": va_ins, "teor_pct": None, "teor_fonte": "potência 568.116 UI/g lida no memorial rev02 (laudo lote 215230 é scan não lido no inventário; validade NÃO confirmada). Conta: 3,17 mg × 568.116 UI/g = 1.800,9 UI × 0,3 µg RAE/UI = 540,3 µg RAE", "ativo_mg": va_rae, "unidade_ativo": "µg RAE", "minimo": 135, "maximo": 2623.61, "pct_do_maximo": pct_max(va_rae,2623.61),
  "linha_anexo": LIMITES["Vitamina A"]["linha"], "laudo": {"lote": "215230", "validade": "não confirmada em disco (scan)", "vencido": None},
  "status": "mantido", "motivo": "540 µg RAE = 20,6 % do teto e 68 % do VD — mantido. Pendência: validade do laudo."},
 {"constituinte_anexo_i": "Vitamina B6 — Cloridrato de piridoxina (CAS 58-56-0)", "forma_insumo": "piridoxina cloridrato, Analitic, lote 91188", "nome_composicao": "Cloridrato de piridoxina (vitamina B6)", "ingredient_slug": "vitamina-b6", "ingredient_nome": "Vitamina B6",
  "massa_insumo_mg": b6_ins, "teor_pct": 99.9, "teor_fonte": "laudo lote 91188 (99,9 %) × fator sal→base 169,18/205,64 = 82,27 % (estequiométrico, conta do memorial reconferida)", "ativo_mg": b6_ativo, "unidade_ativo": "mg de vitamina B6", "minimo": 0.26, "maximo": 98.60, "pct_do_maximo": pct_max(b6_ativo,98.60),
  "linha_anexo": LIMITES["Vitamina B6"]["linha"], "laudo": {"lote": "91188 (fabricante 241229T092)", "validade": "28/12/2027", "vencido": False},
  "status": "mantido", "motivo": "1,26 mg = 1,3 % do teto, 97 % do VD — mantido."},
]
excipientes = [
 {"nome": "Maltodextrina (excipiente, q.s.p.)", "ins": None, "massa_mg": malto, "ingredient_slug": "maltodextrina", "ingredient_nome": "Maltodextrina", "papel": "veiculo", "laudo_lote": "a definir pela fábrica", "observacao": "PROPOSTA para completar 1.000 mg (2 cápsulas tamanho 0) depois da retirada de 684 mg de fibras e cúrcuma; a fábrica pode preferir cápsula menor sem excipiente — decisão do dono."},
 {"nome": "Antiumectante dióxido de silício", "ins": "INS 551", "massa_mg": sio2, "ingredient_slug": "dioxido-de-silicio", "ingredient_nome": "Dióxido de silício", "papel": "aditivo", "laudo_lote": "certificado anexado ao memorial, sem lote", "observacao": "quantum satis; o memorial rev02 alocava 0 mg por falta de espaço — agora há espaço (5 mg = 0,5 %)."},
]
tn = {"porcoes_por_embalagem": 30, "porcao": "1 g (2 cápsulas)",
      "linhas": [
        dict(linha_nutri("Valor energético", kcal, "kcal", nao_sig=True), kj=arred(kj)),
        linha_nutri("Carboidratos", malto/1000, "g", nao_sig=True),
        linha_nutri("Açúcares totais", 0.0, "g", nao_sig=True),
        linha_nutri("Açúcares adicionados", 0.0, "g", nao_sig=True),
        dict(linha_nutri("Proteínas", 0.0, "g", nao_sig=True), nota="L-glutamina é aminoácido livre, declarada em linha própria; não computada como proteína (PROVISÓRIO)"),
        linha_nutri("Gorduras totais", 0.0, "g", nao_sig=True),
        linha_nutri("Gorduras saturadas", 0.0, "g", nao_sig=True),
        linha_nutri("Gorduras trans", 0.0, "g", nao_sig=True),
        linha_nutri("Fibras alimentares", 0.0, "g", nao_sig=True),
        linha_nutri("Sódio", 0.0, "mg", nao_sig=True),
        linha_nutri("Vitamina A", va_rae, "µg RAE"),
        linha_nutri("Vitamina B6", b6_ativo, "mg"),
        linha_nutri("Magnésio", mg_ativo, "mg"),
        dict(linha_nutri("Zinco", zn_ativo, "mg"), nota="13,50 mg arredonda para 14 mg (regra ≥10); %VD calculado sobre 13,50 mg"),
        linha_nutri("L-glutamina", glu_ativo, "mg", sem_vd=True),
        linha_nutri("Quercetina", que_ativo, "mg", sem_vd=True),
      ],
      "rodape": "*Percentual de valores diários fornecidos pela porção",
      "regras": "Arredondamento: Anexo III da IN 75/2020 (paráfrase do gabarito). %VD: Anexo VIII da IN 75/2020, coluna adultos (macros: Anexo II). Não significativo (Anexo IV): %VD = 0. Sem VDR: célula em branco. Energia: Atwater 4 kcal/g (maltodextrina e glutamina), kJ 17 kJ/g — fatores kJ PROVISÓRIOS."}
P = {"slug": slug, "nome": "Saúde Intestinal", "porcao_mg": PORCAO, "porcao_descricao": "2 cápsulas (1 g), 1 vez ao dia", "porcoes_por_embalagem": 30,
 "formato": "cápsula gelatinosa dura tamanho 0 (vazia 98,45 mg, Qualicaps/Genix lote 2505380SA; cheia 598,45 mg — memorial rev02)", "grupo_populacional": "adultos (> 19 anos)",
 "fonte_antes": "memorial de cálculo rev02 (13/08/2026) — as massas batem com a arte do rótulo (Floravex-intestino.pdf); o memorial soma 1.261,92 mg (126,2 % da porção)",
 "insumos": insumos, "excipientes": excipientes, "soma_porcao_mg": soma, "cabe": soma <= PORCAO, "tabela_nutricional": tn,
 "ingredients_list": "Maltodextrina, bisglicinato de magnésio, L-glutamina, quercetina, bisglicinato de zinco, antiumectante dióxido de silício (INS 551), acetato de retinila, cloridrato de piridoxina; cápsula: gelatina, água purificada e corante dióxido de titânio (INS 171).",
 "warnings": "Este produto não é um medicamento.\nPúblico indicado: adultos (19 anos ou mais).\nNão exceder a recomendação diária de consumo indicada na embalagem.\nMantenha fora do alcance de crianças.\nEste produto não deve ser consumido por gestantes, lactantes e crianças.\nConservar o produto em local seco, fresco e arejado, ao abrigo da luz e do calor excessivo, em temperatura ambiente entre 15 °C e 30 °C.\nApós aberto, consumir em até 60 dias.\nNão consumir se o lacre de segurança estiver violado.",
 "pendencias": [
   "Bisglicinato de magnésio: laudo do lote 90844 vencido em 21/06/2025 (mesmo lote vencido do Nuviart) — laudo novo do lote em uso, com teor de magnésio.",
   "Quercetina: laudo do lote 873635 vencido em 06/2026 — laudo novo; RT confirma se a forma di-hidratada atende (o Anexo I diz só 'Quercetina', sem CAS).",
   "Vitamina A: validade do laudo do lote 215230 não confirmada em disco (PDF digitalizado não lido) — conferir; o lote alternativo em disco (90494) venceu em 21/10/2024.",
   "Fábrica: definir o excipiente q.s.p. (proposta: maltodextrina 417,08 mg) ou trocar para cápsula menor sem excipiente; atualizar o memorial (porção passa a fechar em 1.000 mg, antes estourava 26,2 %).",
   "Dono: o conceito 'fibras' sai do produto em cápsula (mínimo 5,7 g inatingível). Se quiser manter fibras, só em versão pó/sachê com psyllium + inulina + FOS ≥ 5,7 g por porção — registrada como alternativa, não como proposta.",
   "Rótulo: remover o texto de apresentação que anuncia 'fibras alimentares' e a cúrcuma; a contradição rodapé/tabela sobre fibras desaparece com a retirada."
 ],
 "veredito": "CONFORME CONDICIONADO A (laudos novos de bisglicinato de magnésio e de quercetina; validade do laudo da vitamina A; definição do excipiente/cápsula pela fábrica)",
 "ingredientes_categoria": {"l-glutamina": "aminoacido", "magnesio": "mineral", "quercetina": "outro", "zinco": "mineral", "vitamina-a": "vitamina", "vitamina-b6": "vitamina"},
}
gravar(P)
for r in tn["linhas"]: print(r)
