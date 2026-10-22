# -*- coding: utf-8 -*-
from lib import *
slug="shot-colageno-300-gramas"; PORCAO=10000.0
col_ins=9450.0; col_teor_ref=91.0; col_prot=round(col_ins*col_teor_ref/100,1)          # 8.599,5 mg — PROVISÓRIO (Verisol 91,0 %, laudo vencido)
vitc_alvo=200.0; vitc_ins=round(vitc_alvo/0.995,2); vitc_ativo=round(vitc_ins*0.995,2)   # 201,01 → 200,00
zn_ins=11.06; zn_ativo=round(zn_ins*19.89/100,2)                                         # 2,20
acit=150.0; aroma=100.0; sio2=20.0; sucr=15.0; cor=5.0
soma_ins=col_ins+vitc_ins+zn_ins+acit+aroma+sio2+sucr+cor; malto=round(PORCAO-soma_ins,2); soma=round(soma_ins+malto,2)
kcal=col_prot/1000*4 + malto/1000*4 + acit/1000*3; kj=col_prot/1000*17 + malto/1000*17 + acit/1000*13
print("colágeno prot (91%):",col_prot,"mg =",round(col_prot/8400*100,1),"% do mín | vitC insumo:",vitc_ins,"| soma sem malto:",round(soma_ins,2),"| malto:",malto,"| soma:",soma)
print("energia:",round(kcal,2),"kcal",round(kj,2),"kJ | proteínas g:",col_prot/1000)
# alternativa 12 g
alt = {"porcao_mg":12000,"colageno":9900.0,"proteina_91pct":round(9900*0.91,1),"vitc_ins":round(800/0.995,2),"acido_citrico":400,"aroma":200,"sio2":100,"sucralose":50,"corante":17,"zinco_bisglicinato":11.06}
alt["maltodextrina_qsp"]=round(12000-(alt["colageno"]+alt["vitc_ins"]+alt["acido_citrico"]+alt["aroma"]+alt["sio2"]+alt["sucralose"]+alt["corante"]+alt["zinco_bisglicinato"]),2)
alt["porcoes"]=25
print("alternativa 12 g:",alt)

insumos=[
 {"constituinte_anexo_i":"Proteínas — Gelatina hidrolisada/Colágeno hidrolisado","forma_insumo":"colágeno hidrolisado — lote a definir: Peptan (Lepuge, AUTO040177, válido até 23/04/2030, SEM doseamento de proteína no certificado) ou Verisol (Iberoquímica/Gelita, lote 10.236, proteína Kjeldahl 91,0 %, laudo aparentemente VENCIDO em 15/05/2026)","nome_composicao":"Colágeno hidrolisado","ingredient_slug":"colageno-hidrolisado","ingredient_nome":"Colágeno hidrolisado",
  "massa_insumo_mg":col_ins,"teor_pct":col_teor_ref,"teor_fonte":"PROVISÓRIO — 91,0 % de proteína (Kjeldahl) é o ÚLTIMO TEOR CONHECIDO, de laudo vencido (Verisol); o Peptan válido não tem doseamento. O teor real do lote em uso é PENDENTE de laudo (proteína por N × 6,25 ou Kjeldahl)","ativo_mg":col_prot,"unidade_ativo":"mg de proteínas (PROVISÓRIO)","minimo":8400,"maximo":"NE","pct_do_maximo":None,
  "linha_anexo":LIMITES["Proteínas"]["linha"],"laudo":{"lote":"Peptan AUTO040177 (sem doseamento) / Verisol 10.236 (91,0 %, vencido)","validade":"23/04/2030 (Peptan) / 15/05/2026 (Verisol)","vencido":None},
  "status":"dose ajustada","motivo":"O colágeno hidrolisado só existe no Anexo I como fonte de PROTEÍNAS (mínimo 8,4 g/dia, Anexo III). A ficha de 19/08 pesava 7.548 mg (a 91 %: 6,87 g — abaixo do mínimo) e o cadastro 8.400 mg (só atinge o mínimo se o colágeno for 100 % proteína). Proposta: 9.450 mg → a 91 %, 8,60 g = 102,4 % do mínimo. A folga é ESTREITA (um lote com proteína < 88,9 % ficaria abaixo); por isso a alternativa de porção de 12 g (colágeno 9.900 mg = 9,01 g, 107 %) fica registrada para o dono. Nota do Anexo V: a alegação 'fonte de proteínas' exige o perfil de aminoácidos do Anexo VII (triptofano 6 mg/g) — colágeno não atende; cumprir o mínimo NÃO autoriza a alegação."},
 {"constituinte_anexo_i":"Vitamina C — Ácido ascórbico/Ácido L-ascórbico (CAS 50-81-7)","forma_insumo":"ácido ascórbico 99 %, Analitic, lote 950467","nome_composicao":"Ácido ascórbico (vitamina C)","ingredient_slug":"vitamina-c","ingredient_nome":"Vitamina C",
  "massa_insumo_mg":vitc_ins,"teor_pct":99.5,"teor_fonte":"laudo lote 950467 (99,5 %)","ativo_mg":vitc_ativo,"unidade_ativo":"mg","minimo":13.5,"maximo":1916.02,"pct_do_maximo":pct_max(vitc_ativo,1916.02),
  "linha_anexo":LIMITES["Vitamina C"]["linha"],"laudo":{"lote":"950467","validade":"05/03/2029","vencido":False},
  "status":"dose ajustada","motivo":"1.100 mg (ficha) / 800 mg (cadastro) → 200 mg (200 % do VD; 10,4 % do teto) para abrir espaço ao colágeno na porção de 10 g (princípio 5: reduzir dose dentro da faixa antes de mudar a porção). Na alternativa de 12 g volta a 800 mg."},
 {"constituinte_anexo_i":"Zinco — Bisglicinato de zinco (CAS 14281-83-5)","forma_insumo":"zinco quelato 20 %, Galena, lote 055-ZN/25","nome_composicao":"Bisglicinato de zinco (equivalente a 2,2 mg de zinco)","ingredient_slug":"zinco","ingredient_nome":"Zinco","e_sal":True,
  "massa_insumo_mg":zn_ins,"teor_pct":19.89,"teor_fonte":"laudo lote 055-ZN/25: 20,00 % b.s. × (1 − 0,54 %) = 19,89 % t.q.; 2,2 ÷ 0,1989 = 11,06 mg","ativo_mg":zn_ativo,"unidade_ativo":"mg de zinco","minimo":1.65,"maximo":29.59,"pct_do_maximo":pct_max(zn_ativo,29.59),
  "linha_anexo":LIMITES["Zinco"]["linha"],"laudo":{"lote":"055-ZN/25","validade":"06/05/2027","vencido":False},
  "status":"dose ajustada","motivo":"A ficha pesava 0,29 mg de bisglicinato (0,058 mg de zinco: 3,5 % do mínimo) e o cadastro declarava 1,65 mg (mínimo exato, sem dizer se sal ou elemento). Proposta: 2,2 mg de zinco (133 % do mínimo, 7,4 % do teto, 20 % do VD)."},
 {"constituinte_anexo_i":"Curcumina — Extrato de rizomas de cúrcuma (Curcuma longa L.)","forma_insumo":"'Cúrcuma' (ficha, sem teor)","nome_composicao":"Extrato de rizomas de cúrcuma (Curcuma longa L.)","ingredient_slug":"extrato-de-rizomas-de-curcuma","ingredient_nome":"Extrato de rizomas de cúrcuma","massa_insumo_mg":130.0,"teor_pct":None,"teor_fonte":"sem laudo (mesma massa do Detox, cujo lote tem 0,42 %)","ativo_mg":None,"unidade_ativo":"mg de curcuminoides","minimo":80,"maximo":130,"pct_do_maximo":None,"linha_anexo":LIMITES["Curcumina"]["linha"],"laudo":{"lote":None,"validade":None,"vencido":None},"status":"retirado","motivo":"Sem laudo de curcuminoides (princípio 7) e sem espaço na porção; já não está na composição do cadastro. Volta com extrato padronizado (105,3 mg a 95 %)."},
 {"constituinte_anexo_i":"Ácido clorogênico — Extrato de café verde","forma_insumo":"café verde 35 % (ficha, teor nominal)","nome_composicao":"Extrato de café verde","ingredient_slug":"extrato-de-cafe-verde","ingredient_nome":"Extrato de café verde","massa_insumo_mg":50.0,"teor_pct":None,"teor_fonte":"teor nominal do nome comercial, sem laudo","ativo_mg":None,"unidade_ativo":"mg de ácido clorogênico","minimo":"NE","maximo":400,"pct_do_maximo":None,"linha_anexo":LIMITES["Ácido clorogênico"]["linha"],"laudo":{"lote":None,"validade":None,"vencido":None},"status":"retirado","motivo":"Insumo secundário retirado para caber o colágeno em 10 g (princípio 5); já não está na composição do cadastro. Na alternativa de 12 g pode voltar com o laudo IDNLABS 10269 (50 mg = 32 mg de ácido clorogênico)."},
 {"constituinte_anexo_i":"Antocianinas da laranja moro — Extrato de laranja moro","forma_insumo":"laranja moro 08 % (ficha, teor nominal)","nome_composicao":"Extrato de laranja moro (Citrus sinensis (L.) Osbeck)","ingredient_slug":"extrato-de-laranja-moro","ingredient_nome":"Extrato de laranja moro","massa_insumo_mg":5.0,"teor_pct":None,"teor_fonte":"nominal, sem laudo","ativo_mg":None,"unidade_ativo":"mg de antocianinas","minimo":"NE","maximo":5,"pct_do_maximo":None,"linha_anexo":LIMITES["Antocianinas da laranja moro"]["linha"],"laudo":{"lote":None,"validade":None,"vencido":None},"status":"retirado","motivo":"Secundário; retirado para caber o colágeno (princípio 5); já não está na composição do cadastro. Pode voltar na alternativa de 12 g com o laudo 17624 (5 mg = 0,07 mg de antocianinas)."},
]
excipientes=[
 {"nome":"Acidulante ácido cítrico","ins":"INS 330","massa_mg":acit,"ingredient_slug":"acido-citrico","ingredient_nome":"Ácido cítrico","papel":"aditivo","laudo_lote":"GE2844AFG","observacao":"670 (ficha) / 400 (cadastro) → 150 mg para caber; quantum satis."},
 {"nome":"Aromatizante idêntico ao natural de limão","ins":None,"massa_mg":aroma,"ingredient_slug":"aromatizante-identico-ao-natural-de-limao","ingredient_nome":"Aromatizante idêntico ao natural de limão","papel":"aditivo","laudo_lote":"19934/19504 (Alphataste)","observacao":"330 ('Fresh Drink Limão', ficha) / 200 (cadastro) → 100 mg; quantum satis (idêntico ao natural); a ficha chama de 'Fresh Drink Limão' — confirmar que é o mesmo insumo."},
 {"nome":"Maltodextrina (veículo, q.s.p.)","ins":None,"massa_mg":malto,"ingredient_slug":"maltodextrina","ingredient_nome":"Maltodextrina","papel":"veiculo","laudo_lote":"210170 — VENCIDO (26/07/2026)","observacao":"q.s.p. calculado: 10.000 − 9.952,07."},
 {"nome":"Antiumectante dióxido de silício","ins":"INS 551","massa_mg":sio2,"ingredient_slug":"dioxido-de-silicio","ingredient_nome":"Dióxido de silício","papel":"aditivo","laudo_lote":"—","observacao":"100 → 20 mg (0,2 %); quantum satis."},
 {"nome":"Edulcorante sucralose","ins":"INS 955","massa_mg":sucr,"ingredient_slug":"edulcorante-sucralose","ingredient_nome":"Edulcorante sucralose","papel":"aditivo","laudo_lote":"91233","observacao":"50 → 15 mg; 15 mg ÷ 0,210 kg = 71,4 mg/kg no produto pronto (limite 2.400 mg/kg)."},
 {"nome":"Corantes tartrazina e azul brilhante FCF","ins":"INS 102, INS 133","massa_mg":cor,"ingredient_slug":"corante-verde","ingredient_nome":"Corante verde","papel":"aditivo","laudo_lote":"250301 ('verde folha') — sem INS nem doseamento","observacao":"17 → 5 mg; 5 ÷ 0,210 kg = 23,8 mg/kg (limite 300 mg/kg cada). Identificação dos corantes PENDENTE."},
]
tn={"porcoes_por_embalagem":30,"porcao":"10 g (1 dose = 1 medida rasa, diluída em 200 mL de água)",
 "linhas":[dict(linha_nutri("Valor energético",kcal,"kcal"),kj=arred(kj),nota="proteína do colágeno a 91 % (PROVISÓRIO); maltodextrina 4 kcal/g; ácido cítrico 3 kcal/g; kJ 17/17/13 kJ/g PROVISÓRIOS"),
  linha_nutri("Carboidratos",malto/1000,"g",nao_sig=True), linha_nutri("Açúcares totais",0.0,"g",nao_sig=True), linha_nutri("Açúcares adicionados",0.0,"g",nao_sig=True),
  dict(linha_nutri("Proteínas",col_prot/1000,"g"),nota="PROVISÓRIO — depende do laudo de proteína do lote de colágeno"),
  linha_nutri("Gorduras totais",0.0,"g",nao_sig=True), linha_nutri("Gorduras saturadas",0.0,"g",nao_sig=True), linha_nutri("Gorduras trans",0.0,"g",nao_sig=True),
  linha_nutri("Fibras alimentares",0.0,"g",nao_sig=True),
  dict(linha_nutri("Sódio",0.0,"mg",nao_sig=True),nota="sódio do colágeno hidrolisado desconhecido — PENDENTE laudo"),
  linha_nutri("Vitamina C",vitc_ativo,"mg"), linha_nutri("Zinco",zn_ativo,"mg")],
 "rodape":"*Percentual de valores diários fornecidos pela porção",
 "regras":"Arredondamento: Anexo III IN 75/2020 (paráfrase). %VD: Anexo VIII (adultos); macros: Anexo II (proteínas 50 g). Não significativo: %VD 0. Colágeno hidrolisado declarado como Proteínas (grupo do Anexo I), não como bioativo."}
P={"slug":slug,"nome":"SHOT + COLÁGENO 300 GRAMAS","porcao_mg":PORCAO,"porcao_descricao":"10 g (1 dose) diluída em 200 mL de água, 1 vez ao dia","porcoes_por_embalagem":30,
 "formato":"pó para diluição (suplemento alimentar em pó)","grupo_populacional":"adultos (> 19 anos)",
 "fonte_antes":"ficha FOR-SHOT-COLAG-001 'Fórmula Shot Matinal Colágeno 3 medidas', coluna 'Pote 300 g / dose 10 g' (19/08/2026, timbre Lemoncaps) — a mais recente COM procedência da fábrica; o dossiê técnico de 12/09/2026 é gerado a partir do cadastro (colágeno 8.400 mg = mínimo exato, zinco 1,65 mg = mínimo exato: padrão cadastro-teto) e a ficha 'pote 210 g' (mesma data) é de outro SKU",
 "insumos":insumos,"excipientes":excipientes,"soma_porcao_mg":soma,"cabe":soma<=PORCAO,"tabela_nutricional":tn,
 "alternativa_porcao_12g":alt,
 "ingredients_list":"Colágeno hidrolisado, ácido ascórbico (vitamina C), acidulante ácido cítrico (INS 330), aromatizante idêntico ao natural de limão, maltodextrina, antiumectante dióxido de silício (INS 551), edulcorante sucralose (INS 955), bisglicinato de zinco, corantes tartrazina (INS 102) e azul brilhante FCF (INS 133). ALERGÊNICOS: conforme a origem do colágeno do lote (bovino/suíno: sem alergênico da RDC 26/2015; peixe: 'Contém peixe') — PENDENTE.",
 "warnings":"Este produto não é um medicamento.\nPúblico indicado: adultos (19 anos ou mais).\nNão exceder a recomendação diária de consumo indicada na embalagem.\nMantenha fora do alcance de crianças.\nContém TARTRAZINA (INS 102).\nConservar o produto em local seco, fresco e arejado, ao abrigo da luz e do calor excessivo, em temperatura ambiente entre 15 °C e 30 °C.\nApós aberto, consumir em até 60 dias.\nNão consumir se o lacre de segurança estiver violado.",
 "pendencias":[
  "Colágeno: laudo de PROTEÍNA (N × 6,25 ou Kjeldahl) do lote em uso — o Peptan AUTO040177 (válido) não traz doseamento; o Verisol 10.236 (91,0 %) aparenta vencido. A conta de 9.450 mg foi feita com 91,0 % (PROVISÓRIO): se o teor real for menor que 88,9 %, a proteína cai abaixo de 8,4 g e a massa tem de subir (ou a porção mudar).",
  "Dono: porção 10 g (proposta principal, folga de 2,4 % sobre o mínimo) ou 12 g (alternativa: colágeno 9.900 mg = 9,01 g a 91 %, vitamina C 800 mg, 25 porções por pote) — a de 12 g é a robusta.",
  "Colágeno: qual insumo está em produção (Verisol da ficha ou Peptan do Nuviart) e origem animal (para o alergênico).",
  "Vitamina C: confirmar a redução para 200 mg (ou aceitar a porção de 12 g com 800 mg).",
  "Corante: identificar os corantes e os INS (certificado 250301 não traz) e confirmar a frase da tartrazina; aroma: confirmar que 'Fresh Drink Limão' é o aromatizante idêntico ao natural de limão.",
  "Maltodextrina: laudo novo (lote 210170 vencido).",
  "Rótulo/cadastro: retirar cúrcuma, café verde e laranja moro da lista de ingredientes (não estão na composição); não usar a alegação 'fonte de proteínas' (Anexo V/VII)."
 ],
 "veredito":"CONFORME CONDICIONADO A (laudo de proteína do lote de colágeno em uso e origem animal; decisão do dono sobre a porção — 10 g com folga estreita ou 12 g; identificação do corante; laudo novo da maltodextrina)",
 "ingredientes_categoria":{"colageno-hidrolisado":"outro","vitamina-c":"vitamina","zinco":"mineral"},
}
gravar(P)
for r in tn["linhas"]: print(r)
