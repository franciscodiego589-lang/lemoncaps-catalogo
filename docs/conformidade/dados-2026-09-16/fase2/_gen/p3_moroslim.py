# -*- coding: utf-8 -*-
from lib import *
slug = "moro-slim"; PORCAO = 1000.0
moro_ins=175.0; moro_ativo=round(moro_ins*1.47/100,2)                     # 2,57
cafe_ins=110.0; cafe_ativo=round(cafe_ins*64.05/100,2)                    # 70,46
cafe_metilx=round(cafe_ins*1.56/100,2)                                    # 1,72
va_ins=8.80; va_rae=round(va_ins/1000*568116*0.3,1)                        # 1.499,8
cr_alvo=200.0; cr_ins=round(cr_alvo/1000/(12.34/100),2)                   # 1,62 mg
cr_ativo=round(cr_ins*12.34/100*1000,1)                                    # 199,9 µg
sio2=5.0
soma_ins=moro_ins+cafe_ins+va_ins+cr_ins+sio2; malto=round(PORCAO-soma_ins,2); soma=round(soma_ins+malto,2)
kcal=malto/1000*4; kj=malto/1000*17
print("insumos:",round(soma_ins,2),"| malto q.s.p.:",malto,"| soma:",soma,"| vitA µg RAE:",va_rae,"| Cr µg:",cr_ativo,"| energia",round(kcal,2),"kcal",round(kj,2),"kJ")

insumos=[
 {"constituinte_anexo_i":"Saponinas de glicosídeos de furostanol — Extrato de semente de feno-grego (Trigonella foenum-graecum L.) (IN 304/2024)","forma_insumo":"o insumo em uso é feno-grego PÓ de semente (Santosflora, lote AUTO9IVT), sem doseamento — não é a forma do Anexo I","nome_composicao":"Extrato seco de semente de feno-grego","ingredient_slug":"extrato-seco-de-semente-de-feno-grego","ingredient_nome":"Extrato seco de semente de feno-grego (Trigonella foenum-graecum L.)",
  "massa_insumo_mg":220.0,"teor_pct":None,"teor_fonte":"laudo do lote AUTO9IVT 'sem doseamento de ativos' (memorial rev02); nenhum laudo de saponinas para o insumo em uso","ativo_mg":None,"unidade_ativo":"mg de saponinas","minimo":"NE","maximo":450,"pct_do_maximo":None,
  "linha_anexo":LIMITES["Saponinas de glicosídeos de furostanol"]["linha"],"laudo":{"lote":"AUTO9IVT (Santosflora, pó)","validade":"não confirmada (scan)","vencido":None},
  "status":"retirado","motivo":"Duas razões: (1) FORMA — o Anexo I autoriza só 'Extrato de semente de feno-grego'; a fábrica pesa PÓ de semente; (2) sem laudo de saponinas (princípio 7). Existem em disco extratos com laudo válido de fenosídeos/saponinas (KTF 53,42 %; Quimer 72,82 %, 70,78 %, 75,92 %), todos rejeitados pelo parecer interno PAR-LAU-2026-001 (28/08/2026) por fabricante diferente do exigido pelo painel (Indus Biotech) — essa exigência NÃO consta do Anexo I literal nem das notas i–xv; RT decide. Volta quando houver extrato com laudo de saponinas e fornecedor aceito; dose que seria conforme: ≤ 405 mg de saponinas (90 % do teto), ex.: 220 mg de extrato a 50 % = 110 mg (24 % do teto)."},
 {"constituinte_anexo_i":"Antocianinas da laranja moro — Extrato de laranja moro (Citrus sinensis (L.) Osbeck) (IN 336/2024)","forma_insumo":"extrato de laranja Moro, AllPremium, lote interno 17624 (original 1289)","nome_composicao":"Extrato de laranja moro (Citrus sinensis (L.) Osbeck)","ingredient_slug":"extrato-de-laranja-moro","ingredient_nome":"Extrato de laranja moro",
  "massa_insumo_mg":moro_ins,"teor_pct":1.47,"teor_fonte":"laudo lote 17624 (antocianinas 1,47 %) — lido no inventário e no memorial rev02","ativo_mg":moro_ativo,"unidade_ativo":"mg de antocianinas","minimo":"NE","maximo":5,"pct_do_maximo":pct_max(moro_ativo,5),
  "linha_anexo":LIMITES["Antocianinas da laranja moro"]["linha"],"laudo":{"lote":"17624 (AllPremium)","validade":"09/04/2027","vencido":False},
  "status":"mantido","motivo":"175 × 1,47 % = 2,57 mg (51 % do teto). Divergência a registrar: o inventário de laudos anota que o parecer PAR-LAU-2026-001 associa o Moro Slim a uma 'Laranja Vermelha Nacional em Pó' (T&T, sem doseamento); o memorial rev02 — fonte primária do que a fábrica pesa — usa o lote 17624. Confirmar na fábrica qual insumo está no estoque."},
 {"constituinte_anexo_i":"Curcumina — Extrato de rizomas de cúrcuma (Curcuma longa L.)^xv","forma_insumo":"extrato NaturalPRO, lote NPT.0425/580 (0,42 %)","nome_composicao":"Extrato seco de rizoma de cúrcuma (Curcuma longa L.)","ingredient_slug":"extrato-de-rizomas-de-curcuma","ingredient_nome":"Extrato de rizomas de cúrcuma",
  "massa_insumo_mg":135.0,"teor_pct":0.42,"teor_fonte":"laudo lote NPT.0425/580 (0,42 %), lido no memorial rev02","ativo_mg":0.57,"unidade_ativo":"mg de curcuminoides","minimo":80,"maximo":130,"pct_do_maximo":0.4,
  "linha_anexo":LIMITES["Curcumina"]["linha"],"laudo":{"lote":"NPT.0425/580","validade":"não confirmada","vencido":None},
  "status":"retirado","motivo":"0,57 mg = 0,7 % do mínimo de 80 mg. Volta com extrato padronizado e laudo (100 mg de curcuminoides = 105,3 mg a 95 %)."},
 {"constituinte_anexo_i":"Proteínas — Espirulina (Arthrospira platensis)","forma_insumo":"Spirulina, Santosflora, lote AUTO9JRN","nome_composicao":"Espirulina (Arthrospira platensis)","ingredient_slug":"espirulina","ingredient_nome":"Espirulina",
  "massa_insumo_mg":122.0,"teor_pct":None,"teor_fonte":"laudo sem doseamento de proteína (lido integralmente pela frente dos memoriais)","ativo_mg":None,"unidade_ativo":"g de proteínas","minimo":8.4,"maximo":"NE","pct_do_maximo":None,
  "linha_anexo":LIMITES["Proteínas"]["linha"],"laudo":{"lote":"AUTO9JRN (Santosflora)","validade":"não confirmada; laudo sem microcistinas, metais nem microbiologia","vencido":None},
  "status":"retirado","motivo":"A única entrada da espirulina no Anexo I é como fonte de Proteínas (mínimo 8,4 g/dia); 122 mg são 1,5 % do mínimo mesmo se fosse 100 % proteína — princípio 6."},
 {"constituinte_anexo_i":"Fibras alimentares — Quitosana (CAS 9012-76-4)","forma_insumo":"Quitosana HDP, Quimer/Embrafarma, lote 20464","nome_composicao":"Quitosana","ingredient_slug":"quitosana","ingredient_nome":"Quitosana",
  "massa_insumo_mg":122.0,"teor_pct":21.26,"teor_fonte":"laudo lote 20464: fibra alimentar total 21,26 % (lido no inventário); o 'grau de desacetilação 90,66 %' NÃO é pureza","ativo_mg":25.94,"unidade_ativo":"mg de fibra alimentar","minimo":5700,"maximo":"NE","pct_do_maximo":None,
  "linha_anexo":LIMITES["Fibras alimentares"]["linha"],"laudo":{"lote":"20464 (Quimer)","validade":"09/03/2031","vencido":False},
  "status":"retirado","motivo":"Fibras: mínimo 5,7 g; quitosana + psyllium + inulina = 232 mg de insumo (fibra real ainda menor). Sai; com ela sai a declaração de alergênico de crustáceos."},
 {"constituinte_anexo_i":"Ácido clorogênico — Extrato de café verde (IN 102/2021)","forma_insumo":"café verde solúvel IDNLABS, lote 10269 (laudo válido legível); em uso: HERBALTEC 10841 (53,86 %, scan, validade não confirmada, Coffea robusta, irradiado, microbiologia ND)","nome_composicao":"Extrato de café verde","ingredient_slug":"extrato-de-cafe-verde","ingredient_nome":"Extrato de café verde",
  "massa_insumo_mg":cafe_ins,"teor_pct":64.05,"teor_fonte":"laudo lote 10269 (ácido clorogênico 64,05 %; metilxantinas 1,56 %) — lido no inventário","ativo_mg":cafe_ativo,"unidade_ativo":"mg de ácido clorogênico","minimo":"NE","maximo":400,"pct_do_maximo":pct_max(cafe_ativo,400),
  "linha_anexo":LIMITES["Ácido clorogênico"]["linha"],"laudo":{"lote":"10269 (IDNLABS)","validade":"08/2027","vencido":False},
  "status":"mantido (laudo regularizado)","motivo":"110 × 64,05 % = 70,46 mg (18 % do teto; mínimo NE). Com o lote 10841 (53,86 %): 59,25 mg — também na faixa. Cafeína no máximo 1,72 mg (metilxantinas 1,56 %): não é fonte de cafeína. O memorial cita 'faixa 50–400 mg' do painel; o Anexo III literal diz NE."},
 {"constituinte_anexo_i":"Fibras alimentares — Psyllium (Plantago ovatae)","forma_insumo":"psyllium pó, lote AUTO9JPE","nome_composicao":"Psyllium","ingredient_slug":"psyllium","ingredient_nome":"Psyllium",
  "massa_insumo_mg":66.0,"teor_pct":None,"teor_fonte":"laudo só com índice de intumescimento","ativo_mg":66.0,"unidade_ativo":"mg (máx., como fibra)","minimo":5700,"maximo":"NE","pct_do_maximo":None,
  "linha_anexo":LIMITES["Fibras alimentares"]["linha"],"laudo":{"lote":"AUTO9JPE","validade":"não confirmada (scan)","vencido":None},"status":"retirado","motivo":"Fibras, mínimo 5,7 g — princípio 6."},
 {"constituinte_anexo_i":"Fibras alimentares — Inulina (CAS 9005-80-5)","forma_insumo":"inulina, lote 206486 (91,0 %)","nome_composicao":"Inulina","ingredient_slug":"inulina-de-cichorium-intybus","ingredient_nome":"Inulina de Cichorium intybus",
  "massa_insumo_mg":44.0,"teor_pct":91.0,"teor_fonte":"laudo lote 206486 (memorial rev02)","ativo_mg":40.04,"unidade_ativo":"mg","minimo":5700,"maximo":"NE","pct_do_maximo":None,
  "linha_anexo":LIMITES["Fibras alimentares"]["linha"],"laudo":{"lote":"206486","validade":"não confirmada (scan)","vencido":None},"status":"retirado","motivo":"Fibras, mínimo 5,7 g — princípio 6."},
 {"constituinte_anexo_i":"Vitamina A — Acetato de retinol/Acetato de retinila (CAS 127-47-9)","forma_insumo":"vitamina A acetato pó 568.116 UI/g, lote 215230","nome_composicao":"Acetato de retinol (vitamina A)","ingredient_slug":"vitamina-a","ingredient_nome":"Vitamina A",
  "massa_insumo_mg":va_ins,"teor_pct":None,"teor_fonte":"568.116 UI/g lido no memorial rev02; conta: 8,80 mg × 568.116 UI/g = 4.999,4 UI × 0,3 µg RAE/UI = 1.499,8 µg RAE","ativo_mg":va_rae,"unidade_ativo":"µg RAE","minimo":135,"maximo":2623.61,"pct_do_maximo":pct_max(va_rae,2623.61),
  "linha_anexo":LIMITES["Vitamina A"]["linha"],"laudo":{"lote":"215230","validade":"não confirmada em disco (scan)","vencido":None},
  "status":"mantido","motivo":"1.500 µg RAE = 57 % do teto (≤ 90 %) e 188 % do VD — mantido. ATENÇÃO: o memorial antigo (rev00, 30/07/2026) pesava 1,5 mg do mesmo insumo para a mesma entrega (subdose de 5,9×); confirmar com o RT que a produção usa 8,80 mg."},
 {"constituinte_anexo_i":"Cromo — Picolinato de cromo (CAS 14639-25-9)","forma_insumo":"picolinato de cromo, Analitic, lote 91190","nome_composicao":"Picolinato de cromo (equivalente a 200 µg de cromo)","ingredient_slug":"cromo","ingredient_nome":"Cromo","e_sal":True,
  "massa_insumo_mg":cr_ins,"teor_pct":12.34,"teor_fonte":"laudo lote 91190: Cr elementar 12,34 % (lido no inventário). Conta: 200 µg ÷ 0,1234 = 1,62 mg de picolinato; 1,62 × 12,34 % = 199,9 µg","ativo_mg":cr_ativo,"unidade_ativo":"µg de cromo","minimo":5.25,"maximo":250,"pct_do_maximo":pct_max(cr_ativo,250),
  "linha_anexo":LIMITES["Cromo"]["linha"],"laudo":{"lote":"91190 (fabricante 2024122501)","validade":"24/12/2027","vencido":False},
  "status":"dose ajustada","motivo":"Antes: 250 µg = teto exato (100 %, sem margem — impressão digital de cadastro-teto). Depois: 200 µg (80 % do teto, 571 % do VD), como o próprio memorial rev02 recomenda."},
]
excipientes=[
 {"nome":"Maltodextrina (excipiente, q.s.p.)","ins":None,"massa_mg":malto,"ingredient_slug":"maltodextrina","ingredient_nome":"Maltodextrina","papel":"veiculo","laudo_lote":"a definir pela fábrica","observacao":"PROPOSTA para manter 2 cápsulas tamanho 0 (1 g) depois da retirada de 709 mg de insumos; alternativa: 1 cápsula de ~300 mg por dia (muda a apresentação — decisão do dono)."},
 {"nome":"Antiumectante dióxido de silício","ins":"INS 551","massa_mg":sio2,"ingredient_slug":"dioxido-de-silicio","ingredient_nome":"Dióxido de silício","papel":"aditivo","laudo_lote":"certificado anexado ao memorial (doc. 11), sem lote","observacao":"quantum satis; o rótulo vigente imprime '2.474 mg' (erro de ponto decimal, = 2,474 mg); proposta 5 mg."},
]
tn={"porcoes_por_embalagem":30,"porcao":"1 g (2 cápsulas)",
 "linhas":[
  dict(linha_nutri("Valor energético",kcal,"kcal",nao_sig=True),kj=arred(kj)),
  dict(linha_nutri("Carboidratos",malto/1000,"g"),nota="0,70 g > 0,5 g (significativo); 0,7 ÷ 300 = 0,2 % → 0 %"),
  linha_nutri("Açúcares totais",0.0,"g",nao_sig=True), linha_nutri("Açúcares adicionados",0.0,"g",nao_sig=True),
  linha_nutri("Proteínas",0.0,"g",nao_sig=True), linha_nutri("Gorduras totais",0.0,"g",nao_sig=True),
  linha_nutri("Gorduras saturadas",0.0,"g",nao_sig=True), linha_nutri("Gorduras trans",0.0,"g",nao_sig=True),
  linha_nutri("Fibras alimentares",0.0,"g",nao_sig=True), linha_nutri("Sódio",0.0,"mg",nao_sig=True),
  linha_nutri("Vitamina A",va_rae,"µg RAE"), linha_nutri("Cromo",cr_ativo,"µg"),
  linha_nutri("Ácido clorogênico",cafe_ativo,"mg",sem_vd=True), linha_nutri("Antocianinas da laranja moro",moro_ativo,"mg",sem_vd=True)],
 "rodape":"*Percentual de valores diários fornecidos pela porção",
 "regras":"Arredondamento: Anexo III IN 75/2020 (paráfrase). %VD: Anexo VIII (adultos); macros: Anexo II. Não significativo: %VD 0. Sem VDR: em branco. Energia: só a maltodextrina (extratos sem composição centesimal em disco); kJ 17 kJ/g PROVISÓRIO."}
P={"slug":slug,"nome":"MORO SLIM (memorial rev02: 'MORO SLIM COMPLEX')","porcao_mg":PORCAO,"porcao_descricao":"2 cápsulas (1 g), 1 vez ao dia","porcoes_por_embalagem":30,
 "formato":"cápsula gelatinosa dura tamanho 0 (98,45 mg vazia — memorial rev02; o memorial antigo dizia tamanho 00)","grupo_populacional":"adultos (> 19 anos)",
 "fonte_antes":"memorial de cálculo rev02 (13/08/2026), que coincide com a arte do rótulo (MoroSlim.pdf) nas massas; soma 1.007,30 mg",
 "insumos":insumos,"excipientes":excipientes,"soma_porcao_mg":soma,"cabe":soma<=PORCAO,"tabela_nutricional":tn,
 "ingredients_list":"Maltodextrina, extrato de laranja moro (Citrus sinensis (L.) Osbeck), extrato de café verde (Coffea canephora — espécie conforme laudo do lote; conferir antes de imprimir), acetato de retinol, antiumectante dióxido de silício (INS 551), picolinato de cromo; cápsula: gelatina, água purificada e corante dióxido de titânio (INS 171).",
 "warnings":"Este produto não é um medicamento.\nPúblico indicado: adultos (19 anos ou mais).\nNão exceder a recomendação diária de consumo indicada na embalagem.\nMantenha fora do alcance de crianças.\nEste produto não deve ser consumido por gestantes, lactantes e crianças.\nConservar o produto em local seco, fresco e arejado, ao abrigo da luz e do calor excessivo, em temperatura ambiente entre 15 °C e 30 °C.\nApós aberto, consumir em até 60 dias.\nNão consumir se o lacre de segurança estiver violado.",
 "pendencias":[
  "Café verde: decidir o lote (IDNLABS 10269 com laudo válido legível, ou HERBALTEC 10841 com laudo completo a obter); declarar no rótulo a espécie do laudo.",
  "Laranja moro: confirmar na fábrica que o insumo em estoque é o extrato AllPremium lote 17624 (memorial rev02) e não a 'Laranja Vermelha Nacional em Pó' citada no parecer PAR-LAU-2026-001.",
  "RT: posição sobre a 'especificação do fabricante' do painel (feno-grego = Indus Biotech; laranja moro = BIONAP; café verde) — não consta do Anexo I literal.",
  "Vitamina A: validade do laudo do lote 215230 (scan); confirmar que a produção pesa 8,80 mg (o memorial rev00 pesava 1,5 mg).",
  "Fábrica: excipiente q.s.p. 699,58 mg (maltodextrina) ou cápsula/apresentação menor — decisão do dono; refazer o memorial.",
  "Feno-grego: só volta com extrato de semente + laudo de saponinas + fornecedor aceito pelo RT.",
  "Rótulo: nome do produto ('MORO SLIM' × 'MORO SLIM COMPLEX'), remover crustáceos da lista de alergênicos (quitosana sai) e corrigir '2.474 mg' de dióxido de silício."
 ],
 "veredito":"CONFORME CONDICIONADO A (laudo válido do lote de café verde efetivamente usado; confirmação do insumo de laranja moro em estoque; validade do laudo da vitamina A; posição do RT sobre exigência de fabricante do painel; definição do excipiente)",
 "ingredientes_categoria":{"extrato-de-laranja-moro":"extrato_vegetal","extrato-de-cafe-verde":"extrato_vegetal","vitamina-a":"vitamina","cromo":"mineral"},
}
gravar(P)
for r in tn["linhas"]: print(r)
