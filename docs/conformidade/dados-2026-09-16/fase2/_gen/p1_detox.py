# -*- coding: utf-8 -*-
from lib import *

slug = "detox-matinal-lemon-shot-300g"
PORCAO = 10000.0

# --- cálculos (lido × calculado × assumido marcados no campo teor_fonte) ---
vitc_insumo = 1608.04; vitc_teor = 99.5; vitc_ativo = round(vitc_insumo*vitc_teor/100, 2)            # 1.600,00
cafe_insumo = 400.0; cafe_teor = 64.05; cafe_ativo = round(cafe_insumo*cafe_teor/100, 2)              # 256,20
cafe_metilx = round(cafe_insumo*1.56/100, 2)                                                           # 6,24 (limite superior de cafeína)
moro_insumo = 100.0; moro_teor = 1.47; moro_ativo = round(moro_insumo*moro_teor/100, 2)                # 1,47
zn_alvo = 2.2; zn_teor = 19.89; zn_insumo = round(zn_alvo/(zn_teor/100), 2)                            # 11,06
zn_ativo = round(zn_insumo*zn_teor/100, 2)                                                             # 2,20
excip = {"acido_citrico": 670.0, "aroma": 330.0, "sio2": 100.0, "sucralose": 50.0, "corante": 17.0}
soma_sem_malto = vitc_insumo + cafe_insumo + moro_insumo + zn_insumo + sum(excip.values())
malto = round(PORCAO - soma_sem_malto, 2)
soma = round(soma_sem_malto + malto, 2)
print("soma sem maltodextrina:", soma_sem_malto, "| maltodextrina q.s.p.:", malto, "| soma:", soma)

# energia (Atwater; kJ com fatores 17/13 — PROVISÓRIO quanto ao Anexo XXII)
kcal = malto/1000*4 + excip["acido_citrico"]/1000*3
kj   = malto/1000*17 + excip["acido_citrico"]/1000*13
carb = malto/1000
print(f"energia: {kcal:.3f} kcal / {kj:.3f} kJ | carboidratos {carb:.4f} g")

insumos = [
 {"constituinte_anexo_i": "Vitamina C — Ácido ascórbico/Ácido L-ascórbico (CAS 50-81-7)", "forma_insumo": "Ácido ascórbico 99% (Analitic, lote interno 950467)",
  "nome_composicao": "Ácido ascórbico (vitamina C)", "ingredient_slug": "vitamina-c", "ingredient_nome": "Vitamina C",
  "massa_insumo_mg": vitc_insumo, "teor_pct": vitc_teor, "teor_fonte": "laudo lote 950467 (teor 99,5%, lido no inventário de laudos; memorial rev02 usa o mesmo)",
  "ativo_mg": vitc_ativo, "unidade_ativo": "mg", "minimo": 13.5, "maximo": 1916.02, "pct_do_maximo": pct_max(vitc_ativo, 1916.02),
  "linha_anexo": LIMITES["Vitamina C"]["linha"], "laudo": {"lote": "950467 (fabricante 250306-C01)", "validade": "05/03/2029", "vencido": False},
  "status": "mantido", "motivo": "Dentro da faixa (83,5% do teto), forma autorizada, laudo válido — mantido como está no memorial rev02."},
 {"constituinte_anexo_i": "Ácido clorogênico — Extrato de café verde (IN 102/2021)", "forma_insumo": "Café verde solúvel (extrato solúvel em pó), IDNLABS lote 10269 — laudo válido legível; o lote em uso no memorial (HERBALTEC 10841, 53,86%) tem laudo em scan não lido, validade não confirmada, espécie Coffea robusta e microbiologia 'ND'",
  "nome_composicao": "Extrato de café verde", "ingredient_slug": "extrato-de-cafe-verde", "ingredient_nome": "Extrato de café verde",
  "massa_insumo_mg": cafe_insumo, "teor_pct": cafe_teor, "teor_fonte": "laudo lote 10269 (ácido clorogênico 64,05% calc. ác. cafeoilquínicos; metilxantinas 1,56% informativo) — lido no inventário de laudos",
  "ativo_mg": cafe_ativo, "unidade_ativo": "mg de ácido clorogênico", "minimo": "NE", "maximo": 400, "pct_do_maximo": pct_max(cafe_ativo, 400),
  "linha_anexo": LIMITES["Ácido clorogênico"]["linha"], "laudo": {"lote": "10269 (IDNLABS)", "validade": "08/2027", "vencido": False},
  "status": "mantido (laudo regularizado)", "motivo": "Massa mantida (400 mg). Dose passa a ser demonstrada pelo marcador com laudo válido: 400 × 64,05% = 256,20 mg de ácido clorogênico (64% do teto de 400 mg; mínimo NE). Metilxantinas do laudo (1,56%) dão no máximo 6,24 mg de cafeína — o produto não é fonte de cafeína. Se a fábrica mantiver o lote 10841, pedir laudo completo (validade, cafeína, microbiologia) e corrigir a espécie no rótulo."},
 {"constituinte_anexo_i": "Antocianinas da laranja moro — Extrato de laranja moro (Citrus sinensis (L.) Osbeck) (IN 336/2024)", "forma_insumo": "Laranja Moro extrato (AllPremium, lote interno 17624 / original 1289)",
  "nome_composicao": "Extrato de laranja moro (Citrus sinensis (L.) Osbeck)", "ingredient_slug": "extrato-de-laranja-moro", "ingredient_nome": "Extrato de laranja moro",
  "massa_insumo_mg": moro_insumo, "teor_pct": moro_teor, "teor_fonte": "laudo lote 17624 (antocianinas como cianidina-3-glucosídeos 1,47%) — lido no inventário de laudos e no memorial rev02",
  "ativo_mg": moro_ativo, "unidade_ativo": "mg de antocianinas", "minimo": "NE", "maximo": 5, "pct_do_maximo": pct_max(moro_ativo, 5),
  "linha_anexo": LIMITES["Antocianinas da laranja moro"]["linha"], "laudo": {"lote": "17624 (AllPremium; original 1289)", "validade": "09/04/2027", "vencido": False},
  "status": "mantido", "motivo": "100 × 1,47% = 1,47 mg de antocianinas (29% do teto de 5 mg). Forma e dose conformes pelo Anexo I/IV literal. A exigência de fabricante (BIONAP) citada no memorial vem do painel, não do texto do Anexo I — confirmar com o RT."},
 {"constituinte_anexo_i": "Curcumina — Extrato de rizomas de cúrcuma (Curcuma longa L.)^xv", "forma_insumo": "Extrato de cúrcuma NaturalPRO lote NPT.0425/580 (0,42% de curcumina)",
  "nome_composicao": "Extrato de rizomas de cúrcuma (Curcuma longa L.)", "ingredient_slug": "extrato-de-rizomas-de-curcuma", "ingredient_nome": "Extrato de rizomas de cúrcuma",
  "massa_insumo_mg": 130.0, "teor_pct": 0.42, "teor_fonte": "laudo lote NPT.0425/580 citado no memorial rev02 (0,42% de curcumina); o PDF do laudo é scan não lido no inventário",
  "ativo_mg": 0.55, "unidade_ativo": "mg de curcuminoides", "minimo": 80, "maximo": 130, "pct_do_maximo": 0.4,
  "linha_anexo": LIMITES["Curcumina"]["linha"], "laudo": {"lote": "NPT.0425/580 (NaturalPRO)", "validade": "não confirmada em disco", "vencido": None},
  "status": "retirado", "motivo": "130 × 0,42% = 0,55 mg de curcuminoides = 0,7% do mínimo de 80 mg; atingir o mínimo com esse extrato exigiria 19.048 mg — impossível na porção. Volta quando houver extrato de RIZOMA padronizado com laudo de curcuminoides totais: dose conforme = 100 mg de curcuminoides (77% do teto de 130 mg), ou seja, 105,3 mg de um extrato a 95%. Com a cúrcuma fora, a advertência específica da IN 438/2026 deixa de ser exigida."},
 {"constituinte_anexo_i": "Zinco — Bisglicinato de zinco (CAS 14281-83-5)", "forma_insumo": "Zinco quelato 20% (bisglicinato), Galena lote 055-ZN/25",
  "nome_composicao": "Bisglicinato de zinco (equivalente a 2,2 mg de zinco)", "ingredient_slug": "zinco", "ingredient_nome": "Zinco", "e_sal": True,
  "massa_insumo_mg": zn_insumo, "teor_pct": zn_teor, "teor_fonte": "laudo lote 055-ZN/25: 20,00% de zinco base seca × (100 − 0,54% umidade) = 19,89% tal qual (conta do memorial rev02, reconferida)",
  "ativo_mg": zn_ativo, "unidade_ativo": "mg de zinco", "minimo": 1.65, "maximo": 29.59, "pct_do_maximo": pct_max(zn_ativo, 29.59),
  "linha_anexo": LIMITES["Zinco"]["linha"], "laudo": {"lote": "055-ZN/25 (Galena CIQ 2505027507)", "validade": "06/05/2027", "vencido": False},
  "status": "dose ajustada", "motivo": "Antes: 1,45 mg de sal = 0,29 mg de zinco (17,6% do mínimo de 1,65 mg — ABAIXO DO MÍNIMO). Depois: 2,2 mg de zinco (133% do mínimo, 7,4% do teto, 20% do VD) = 2,2 ÷ 0,1989 = 11,06 mg de bisglicinato."},
]
excipientes = [
 {"nome": "Maltodextrina (veículo, q.s.p.)", "ins": None, "massa_mg": malto, "ingredient_slug": "maltodextrina", "ingredient_nome": "Maltodextrina", "papel": "veiculo", "laudo_lote": "210170 (Fagron) — VENCIDO em 26/07/2026", "observacao": "Ingrediente do Art. 6, § único, da RDC 243/2018 (veículo) — não recebe alegação de fonte de carboidrato. Recalculada para fechar 10.000 mg. Pedir laudo novo."},
 {"nome": "Acidulante ácido cítrico", "ins": "INS 330", "massa_mg": 670.0, "ingredient_slug": "acido-citrico", "ingredient_nome": "Ácido cítrico", "papel": "aditivo", "laudo_lote": "GE2844AFG (100,10%, memorial rev02)", "observacao": "IN 211/2023, cat. 14.2: quantum satis."},
 {"nome": "Aromatizante idêntico ao natural de limão", "ins": None, "massa_mg": 330.0, "ingredient_slug": "aromatizante-identico-ao-natural-de-limao", "ingredient_nome": "Aromatizante idêntico ao natural de limão", "papel": "aditivo", "laudo_lote": "19934 (Alphataste/AllPremium, validade 12/01/2027 segundo o memorial)", "observacao": "quantum satis (idêntico ao natural); composição do aroma não conhecida — não contabilizado na energia."},
 {"nome": "Antiumectante dióxido de silício", "ins": "INS 551", "massa_mg": 100.0, "ingredient_slug": "dioxido-de-silicio", "ingredient_nome": "Dióxido de silício", "papel": "aditivo", "laudo_lote": "sem lote individualizado no memorial", "observacao": "quantum satis."},
 {"nome": "Edulcorante sucralose", "ins": "INS 955", "massa_mg": 50.0, "ingredient_slug": "edulcorante-sucralose", "ingredient_nome": "Edulcorante sucralose", "papel": "aditivo", "laudo_lote": "91233 (99,74%, memorial rev02)", "observacao": "50 mg em 210 g de produto pronto = 238,1 mg/kg (limite 2.400 mg/kg, IN 211/2023 cat. 14.2)."},
 {"nome": "Corantes tartrazina e azul brilhante FCF", "ins": "INS 102, INS 133", "massa_mg": 17.0, "ingredient_slug": "corante-verde", "ingredient_nome": "Corante verde", "papel": "aditivo", "laudo_lote": "250301 ('corante verde folha', Adicel) — sem INS nem doseamento", "observacao": "17 mg em 210 g = 81,0 mg/kg somados (limite 300 mg/kg cada). PENDENTE: o laudo não identifica os corantes; se a tartrazina se confirmar, exige a frase 'Contém TARTRAZINA (INS 102)'."},
]

tn = {"porcoes_por_embalagem": 30, "porcao": "10 g (1 dose = 1 medida rasa, diluída em 200 mL de água)",
      "linhas": [
        dict(linha_nutri("Valor energético", kcal, "kcal"), kj=arred(kj)),
        linha_nutri("Carboidratos", carb, "g"),
        dict(linha_nutri("Açúcares totais", 0.0, "g", nao_sig=True), nota="PROVISÓRIO — depende do laudo da maltodextrina (teor de mono e dissacarídeos)"),
        linha_nutri("Açúcares adicionados", 0.0, "g", nao_sig=True),
        linha_nutri("Proteínas", 0.0, "g", nao_sig=True),
        linha_nutri("Gorduras totais", 0.0, "g", nao_sig=True),
        linha_nutri("Gorduras saturadas", 0.0, "g", nao_sig=True),
        linha_nutri("Gorduras trans", 0.0, "g", nao_sig=True),
        linha_nutri("Fibras alimentares", 0.0, "g", nao_sig=True),
        linha_nutri("Sódio", 0.0, "mg", nao_sig=True),
        linha_nutri("Vitamina C", vitc_ativo, "mg"),
        linha_nutri("Zinco", zn_ativo, "mg"),
        linha_nutri("Ácido clorogênico", cafe_ativo, "mg", sem_vd=True),
        linha_nutri("Antocianinas da laranja moro", moro_ativo, "mg", sem_vd=True),
      ],
      "rodape": "*Percentual de valores diários fornecidos pela porção",
      "regras": "Arredondamento: Anexo III da IN 75/2020 (≥10 inteiro; 1–10 uma casa; <1 g uma casa; <1 mg/µg duas casas). %VD: Anexo VIII da IN 75/2020, coluna adultos (macronutrientes pelo Anexo II). Quantidade não significativa (Anexo IV): %VD = 0. Constituinte sem VDR: célula em branco (RDC 429/2020, art. 12, §1º). Energia: Atwater 4 kcal/g (carboidrato), 3 kcal/g (ácido orgânico); kJ com 17 e 13 kJ/g — fatores kJ PROVISÓRIOS (Anexo XXII não relido em disco)."}

P = {
 "slug": slug, "nome": "Detox Matinal (Lemon Shot) - 300g", "porcao_mg": PORCAO, "porcao_descricao": "10 g (1 dose) diluída em 200 mL de água, 1 vez ao dia",
 "porcoes_por_embalagem": 30, "formato": "pó para diluição (solúvel)", "grupo_populacional": "adultos (> 19 anos)",
 "fonte_antes": "memorial de cálculo rev02 (13/08/2026) — coincide com a arte do rótulo (composicoes_rotulo.json, Detox.pdf), exceto maltodextrina 6.593,51 (memorial) × 6.603 (rótulo)",
 "insumos": insumos, "excipientes": excipientes,
 "soma_porcao_mg": soma, "cabe": soma <= PORCAO,
 "tabela_nutricional": tn,
 "ingredients_list": "Maltodextrina, ácido ascórbico (vitamina C), acidulante ácido cítrico (INS 330), extrato de café verde (Coffea canephora — espécie conforme laudo do lote; conferir antes de imprimir), aromatizante idêntico ao natural de limão, extrato de laranja moro (Citrus sinensis (L.) Osbeck), antiumectante dióxido de silício (INS 551), edulcorante sucralose (INS 955), corantes tartrazina (INS 102) e azul brilhante FCF (INS 133), bisglicinato de zinco.",
 "warnings": "Este produto não é um medicamento.\nPúblico indicado: adultos (19 anos ou mais).\nNão exceder a recomendação diária de consumo indicada na embalagem.\nMantenha fora do alcance de crianças.\nEste produto não deve ser consumido por gestantes, lactantes e crianças.\nContém TARTRAZINA (INS 102).\nConservar o produto em local seco, fresco e arejado, ao abrigo da luz e do calor excessivo, em temperatura ambiente entre 15 °C e 30 °C.\nApós aberto, consumir em até 60 dias.\nNão consumir se o lacre de segurança estiver violado.",
 "pendencias": [
   "Café verde: decidir o lote — o laudo válido e legível em disco é do café verde solúvel IDNLABS 10269 (64,05%); o lote em uso no memorial (HERBALTEC 10841, 53,86%) está em scan não lido, sem validade confirmada, espécie Coffea robusta (rótulo diz arabica), irradiado a 10 kGy e microbiologia 'ND'. Qualquer que seja o lote, a espécie do rótulo tem de ser a do laudo.",
   "RT: confirmar se a 'especificação do fabricante' que o painel da ANVISA associa a café verde e laranja moro é exigível — o Anexo I literal (IN 28/2018 consolidada até a IN 450/2026) não condiciona essas formas a fabricante.",
   "Maltodextrina: laudo do lote 210170 vencido em 26/07/2026 — pedir laudo novo (e, nele, o teor de açúcares para fechar a linha 'açúcares totais').",
   "Corante: o único certificado (lote 250301, 'corante verde folha') não identifica os corantes nem os INS; confirmar tartrazina + azul brilhante FCF e, se confirmado, manter a frase 'Contém TARTRAZINA (INS 102)' (RDC 340/2002 — norma não relida em disco nesta tarefa, PROVISÓRIO).",
   "Rótulo: retirar toda menção a RESVERATROL e a cúrcuma do texto de apresentação (resveratrol nunca esteve na composição; cúrcuma sai).",
   "Excluir a cúrcuma do texto de apresentação até haver extrato padronizado com laudo (ver linha 'retirado')."
 ],
 "veredito": "CONFORME CONDICIONADO A (laudo válido do lote de café verde efetivamente usado; laudo novo da maltodextrina; identificação do corante; posição do RT sobre a exigência de fabricante do painel para café verde e laranja moro)",
 "ingredientes_categoria": {"vitamina-c": "vitamina", "zinco": "mineral", "extrato-de-cafe-verde": "extrato_vegetal", "extrato-de-laranja-moro": "extrato_vegetal"},
}
gravar(P)
print(json.dumps(tn["linhas"], ensure_ascii=False, indent=0))
for i in insumos: print(i["constituinte_anexo_i"][:40], "|", i["massa_insumo_mg"], "|", i["ativo_mg"], "|", i["pct_do_maximo"], "|", i["status"])
