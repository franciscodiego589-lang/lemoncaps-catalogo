# -*- coding: utf-8 -*-
from lib import *
slug="slim-up-emagrecimento-em-gota"; PORCAO=1000.0   # 1 mL, densidade 1 g/mL assumida (rev03 fecha 1,000000 g)
d3_ins=15.652; d3_ui=d3_ins/1000*115000; d3_ativo=round(d3_ui/40,2)                 # 45,00 µg
b12_alvo=8.0; b12_teor=89.27; b12_ins_ug=round(b12_alvo/(b12_teor/100),2); b12_ins_mg=round(b12_ins_ug/1000,5); b12_ativo=round(b12_ins_ug*b12_teor/100,2)
cr_ins=0.25; cr_ativo=round(cr_ins*12.34/100*1000,2)                                 # 30,85 µg
cafe_ins=50.0; cafe_ativo=round(cafe_ins*64.05/100,2); cafe_metilx=round(cafe_ins*1.56/100,2)
col_alvo=90.0; col_teor=40.61; col_ins=round(col_alvo/(col_teor/100),2); col_ativo=round(col_ins*col_teor/100,2)
glic=133.3; sorb=66.7; acit=6.7; benz=1.67; sorbk=1.67; xant=0.67
na_mg=round(benz*0.9977*0.1595,3)
solidos=round(d3_ins+b12_ins_mg+cr_ins+cafe_ins+col_ins+glic+sorb+acit+benz+sorbk+xant,3)
agua=round(PORCAO-solidos,3); soma=round(solidos+agua,3)
kcal=glic/1000*4 + sorb*0.70/1000*2.4 + acit/1000*3
kj  =glic/1000*17 + sorb*0.70/1000*10 + acit/1000*13
print("D3:",round(d3_ui,1),"UI ->",d3_ativo,"µg | B12 insumo µg:",b12_ins_ug,"mg:",b12_ins_mg,"-> ativo",b12_ativo,"| Cr:",cr_ativo,"| ác.clorog:",cafe_ativo,"| colina insumo:",col_ins,"-> ativo",col_ativo)
print("sólidos:",solidos,"| água q.s.p.:",agua,"| soma:",soma,"| Na:",na_mg,"| energia",round(kcal,3),"kcal",round(kj,2),"kJ")

insumos=[
 {"constituinte_anexo_i":"Vitamina D — Vitamina D_3 (Colecalciferol) (CAS 67-97-0)","forma_insumo":"vitamina D3 pó 100.000 UI/g, Analitic, lote 91408","nome_composicao":"Vitamina D3 (colecalciferol)","ingredient_slug":"vitamina-d","ingredient_nome":"Vitamina D",
  "massa_insumo_mg":d3_ins,"teor_pct":None,"teor_fonte":"potência 115.000 UI/g — lida no laudo 91408; 15,652 mg × 115.000 UI/g = 1.800 UI ÷ 40 UI/µg = 45,0 µg (nota iii do Anexo III: 1 µg = 40 UI)","ativo_mg":d3_ativo,"unidade_ativo":"µg","minimo":3,"maximo":50.0,"pct_do_maximo":pct_max(d3_ativo,50.0),
  "linha_anexo":LIMITES["Vitamina D"]["linha"],"laudo":{"lote":"91408 (fabricante 2025111601)","validade":"15/11/2028","vencido":False},
  "status":"mantido","motivo":"45 µg = 90,0 % do teto (limite do princípio 3 — o rev03 já baixou de 50 para 45) e 300 % do VD. Alternativa com mais folga: 40 µg (80 %) = 13,913 mg do pó."},
 {"constituinte_anexo_i":"Vitamina B12 — Metilcobalamina (CAS 13422-55-4)","forma_insumo":"metilcobalamina, SM/Fagron, lote 219376","nome_composicao":"Metilcobalamina (vitamina B12)","ingredient_slug":"vitamina-b12","ingredient_nome":"Vitamina B12",
  "massa_insumo_mg":b12_ins_mg,"massa_sql_valor":b12_ins_ug,"massa_sql_unidade":"mcg","massa_sql_obs":"gravado em mcg porque quantity é numeric(12,4) e 0,00896 mg perderia precisão","teor_pct":b12_teor,"teor_fonte":"teor tal qual 89,27 % — lido no memorial rev03 (o inventário de laudos registra 98,17 % em BASE ANIDRA para o mesmo lote; a diferença é a umidade descontada — divergência registrada, usado o t.q. do rev03)","ativo_mg":b12_ativo,"unidade_ativo":"µg","minimo":0.36,"maximo":9.94,"pct_do_maximo":pct_max(b12_ativo,9.94),
  "linha_anexo":LIMITES["Vitamina B12"]["linha"],"laudo":{"lote":"219376 (interno 26B20-B032-219376)","validade":"14/11/2030","vencido":False},
  "status":"dose ajustada","motivo":"rev02: 9,94 µg (teto exato); rev03: 9,0 µg (90,5 % do teto — acima dos 90 % do princípio 3). Proposta: 8,0 µg = 80,5 % do teto, 333 % do VD. Massa: 8,0 ÷ 0,8927 = 8,96 µg = 0,00896 mg de metilcobalamina. Qualquer valor ≤ 8,9 µg atende."},
 {"constituinte_anexo_i":"Cromo — Picolinato de cromo (CAS 14639-25-9)","forma_insumo":"picolinato de cromo, Analitic, lote 91190","nome_composicao":"Picolinato de cromo (equivalente a 30,85 µg de cromo)","ingredient_slug":"cromo","ingredient_nome":"Cromo","e_sal":True,
  "massa_insumo_mg":cr_ins,"teor_pct":12.34,"teor_fonte":"laudo lote 91190 (Cr 12,34 %); 0,25 × 12,34 % = 30,85 µg","ativo_mg":cr_ativo,"unidade_ativo":"µg de cromo","minimo":5.25,"maximo":250,"pct_do_maximo":pct_max(cr_ativo,250),
  "linha_anexo":LIMITES["Cromo"]["linha"],"laudo":{"lote":"91190","validade":"24/12/2027","vencido":False},"status":"mantido","motivo":"30,85 µg = 12,3 % do teto, 88 % do VD. O cadastro declara '250 mcg' — é a massa do sal (0,25 mg), não o elemento; corrigir."},
 {"constituinte_anexo_i":"Ácido clorogênico — Extrato de café verde (IN 102/2021)","forma_insumo":"café verde solúvel IDNLABS, lote 10269 (laudo válido legível); em uso: HERBALTEC 10841 (53,86 %, Coffea robusta, irradiado, microbiologia ND, validade não confirmada)","nome_composicao":"Extrato de café verde","ingredient_slug":"extrato-de-cafe-verde","ingredient_nome":"Extrato de café verde",
  "massa_insumo_mg":cafe_ins,"teor_pct":64.05,"teor_fonte":"laudo lote 10269 (64,05 %; metilxantinas 1,56 %) — lido no inventário","ativo_mg":cafe_ativo,"unidade_ativo":"mg de ácido clorogênico","minimo":"NE","maximo":400,"pct_do_maximo":pct_max(cafe_ativo,400),
  "linha_anexo":LIMITES["Ácido clorogênico"]["linha"],"laudo":{"lote":"10269 (IDNLABS)","validade":"08/2027","vencido":False},
  "status":"mantido (laudo regularizado)","motivo":"50 × 64,05 % = 32,03 mg (8 % do teto). O rev03 diz 'abaixo do mínimo de 50 mg' citando o painel; o Anexo III literal diz NE — pelo texto da norma não há mínimo. Com o lote 10841 (53,86 %) seriam 26,93 mg. Cafeína ≤ 0,78 mg: não é fonte de cafeína. Solubilidade: 'solúvel' é adequado a gotas."},
 {"constituinte_anexo_i":"Colina — Bitartarato de colina/Hidrogênio tartarato de colina (CAS 87-67-2)","forma_insumo":"DL-bitartarato de colina, Analitic, lote 91442","nome_composicao":"Bitartarato de colina (equivalente a 90 mg de colina)","ingredient_slug":"colina","ingredient_nome":"Colina","e_sal":True,
  "massa_insumo_mg":col_ins,"teor_pct":col_teor,"teor_fonte":"laudo lote 91442: colina 40,61 % (lido no inventário); 90 ÷ 0,4061 = 221,62 mg; 221,62 × 0,4061 = 90,00 mg","ativo_mg":col_ativo,"unidade_ativo":"mg de colina","minimo":82.5,"maximo":3235.15,"pct_do_maximo":pct_max(col_ativo,3235.15),
  "linha_anexo":LIMITES["Colina"]["linha"],"laudo":{"lote":"91442 (fabricante CA26010402USPS)","validade":"03/01/2029","vencido":False},
  "status":"dose ajustada","motivo":"rev03: 33,3 mg de bitartarato = 13,52 mg de colina (16 % do mínimo de 82,5 mg — ABAIXO DO MÍNIMO). Proposta: 90 mg de colina (109 % do mínimo, 2,8 % do teto, 16 % do VD) = 221,62 mg de bitartarato por mL. PENDÊNCIA DE FÁBRICA: confirmar solubilidade/estabilidade de 221,62 mg de bitartarato em 1 mL (os sólidos por mL sobem de 444,6 para 498,2 mg). Alternativa: retirar a colina."},
 {"constituinte_anexo_i":"Curcumina — Extrato de rizomas de cúrcuma (Curcuma longa L.)","forma_insumo":"extrato NaturalPRO NPT.0425/580 (0,42 %)","nome_composicao":"Extrato seco de rizoma de cúrcuma (Curcuma longa L.)","ingredient_slug":"extrato-de-rizomas-de-curcuma","ingredient_nome":"Extrato de rizomas de cúrcuma",
  "massa_insumo_mg":80.0,"teor_pct":0.42,"teor_fonte":"laudo lote NPT.0425/580 (0,42 %), lido no rev03","ativo_mg":0.336,"unidade_ativo":"mg de curcuminoides","minimo":80,"maximo":130,"pct_do_maximo":0.3,
  "linha_anexo":LIMITES["Curcumina"]["linha"],"laudo":{"lote":"NPT.0425/580","validade":"não confirmada","vencido":None},"status":"retirado","motivo":"0,336 mg = 0,4 % do mínimo. Volta com extrato padronizado e laudo (105,3 mg a 95 % = 100 mg) — e, em gotas, com solubilidade a validar."},
 {"constituinte_anexo_i":"Saponinas de glicosídeos de furostanol — Extrato de semente de feno-grego (Trigonella foenum-graecum L.)","forma_insumo":"rótulo/rev03 dizem 'extrato fluido'; o laudo do lote AUTO9IVT é de feno-grego PÓ (Santosflora), sem doseamento","nome_composicao":"Extrato fluido de semente de feno-grego","ingredient_slug":"extrato-fluido-de-semente-de-feno-grego","ingredient_nome":"Extrato fluido de semente de feno-grego",
  "massa_insumo_mg":33.0,"teor_pct":None,"teor_fonte":"laudo sem doseamento de ativo (rev03, lido diretamente pela frente dos memoriais)","ativo_mg":None,"unidade_ativo":"mg de saponinas","minimo":"NE","maximo":450,"pct_do_maximo":None,
  "linha_anexo":LIMITES["Saponinas de glicosídeos de furostanol"]["linha"],"laudo":{"lote":"AUTO9IVT","validade":"não confirmada","vencido":None},"status":"retirado","motivo":"Sem laudo de saponinas e nomenclatura incoerente (laudo de pó para um 'extrato fluido'). Volta com extrato + laudo + fornecedor aceito pelo RT; dose conforme: ≤ 405 mg de saponinas."},
 {"constituinte_anexo_i":"Fibras alimentares — Inulina (CAS 9005-80-5)","forma_insumo":"inulina SM/Fagron lote 206486 (91,0 %)","nome_composicao":"Inulina","ingredient_slug":"inulina-de-cichorium-intybus","ingredient_nome":"Inulina de Cichorium intybus",
  "massa_insumo_mg":21.7,"teor_pct":91.0,"teor_fonte":"laudo lote 206486 (rev03)","ativo_mg":19.75,"unidade_ativo":"mg","minimo":5700,"maximo":"NE","pct_do_maximo":None,
  "linha_anexo":LIMITES["Fibras alimentares"]["linha"],"laudo":{"lote":"206486","validade":"não confirmada (scan)","vencido":None},"status":"retirado","motivo":"Fibras: mínimo 5,7 g; 19,75 mg em 1 mL — princípio 6; sem função tecnológica declarada que a enquadre no Art. 6, § único."},
]
excipientes=[
 {"nome":"Água purificada (q.s.p. 1 mL)","ins":None,"massa_mg":agua,"ingredient_slug":"agua-purificada","ingredient_nome":"Água purificada","papel":"veiculo","laudo_lote":"sem certificado no dossiê","observacao":"calculada: 1.000 − 498,24 mg de sólidos (densidade 1 g/mL assumida, como no rev03)."},
 {"nome":"Umectante glicerina","ins":"INS 422","massa_mg":glic,"ingredient_slug":"glicerina-vegetal","ingredient_nome":"Glicerina vegetal","papel":"aditivo","laudo_lote":"não informado","observacao":"igual ao rev03 e ao rótulo. Limites da IN 211/2023 para suplemento LÍQUIDO não conferidos nesta tarefa (a auditoria de 15/09 só conferiu a categoria 14.2, sólidos) — PENDENTE."},
 {"nome":"Umectante sorbitol líquido 70 %","ins":"INS 420","massa_mg":sorb,"ingredient_slug":"sorbitol-liquido","ingredient_nome":"Sorbitol líquido","papel":"aditivo","laudo_lote":"106371 (Adicel) — laudo é de sorbitol EM PÓ, fórmula usa líquido 70 %: divergência aberta","observacao":"46,69 mg de sorbitol (poliol) por porção."},
 {"nome":"Acidulante ácido cítrico","ins":"INS 330","massa_mg":acit,"ingredient_slug":"acido-citrico","ingredient_nome":"Ácido cítrico","papel":"aditivo","laudo_lote":"GE2844AFG","observacao":"igual ao rev03."},
 {"nome":"Conservador benzoato de sódio","ins":"INS 211","massa_mg":benz,"ingredient_slug":"benzoato-de-sodio","ingredient_nome":"Benzoato de sódio","papel":"aditivo","laudo_lote":"950430 (99,77 %, validade 25/04/2028)","observacao":f"sódio: 1,67 × 99,77 % × 15,95 % = {na_mg} mg (estequiometria 22,99/144,1)."},
 {"nome":"Conservador sorbato de potássio","ins":"INS 202","massa_mg":sorbk,"ingredient_slug":"sorbato-de-potassio","ingredient_nome":"Sorbato de potássio","papel":"aditivo","laudo_lote":"91202 (100,30 %, validade 05/01/2028)","observacao":"igual ao rev03."},
 {"nome":"Espessante goma xantana","ins":"INS 415","massa_mg":xant,"ingredient_slug":"goma-xantana","ingredient_nome":"Goma xantana","papel":"aditivo","laudo_lote":"sem certificado no dossiê","observacao":"rev03 = 0,67 mg (rótulo); rev02 usava 0,070 mg; a ficha técnica antiga chama de 'goma arábica' (INS 414) — identidade a confirmar."},
]
tn={"porcoes_por_embalagem":30,"porcao":"1 mL (30 gotas)",
 "linhas":[dict(linha_nutri("Valor energético",kcal,"kcal",nao_sig=True),kj=arred(kj),nota="glicerina 4 kcal/g e sorbitol 2,4 kcal/g — fatores PROVISÓRIOS (Anexo XXII não relido)"),
  dict(linha_nutri("Carboidratos",sorb*0.70/1000,"g",nao_sig=True),nota="sorbitol (poliol) 0,047 g → 0 g; ≤ 0,5 g"),
  linha_nutri("Açúcares totais",0.0,"g",nao_sig=True), linha_nutri("Açúcares adicionados",0.0,"g",nao_sig=True),
  linha_nutri("Proteínas",0.0,"g",nao_sig=True), linha_nutri("Gorduras totais",0.0,"g",nao_sig=True), linha_nutri("Gorduras saturadas",0.0,"g",nao_sig=True), linha_nutri("Gorduras trans",0.0,"g",nao_sig=True),
  linha_nutri("Fibras alimentares",0.0,"g",nao_sig=True),
  dict(linha_nutri("Sódio",na_mg,"mg",nao_sig=True),nota="0,27 mg do benzoato de sódio; ≤ 5 mg → %VD 0"),
  linha_nutri("Vitamina D",d3_ativo,"µg"), linha_nutri("Vitamina B12",b12_ativo,"µg"), linha_nutri("Cromo",cr_ativo,"µg"),
  linha_nutri("Colina",col_ativo,"mg"), linha_nutri("Ácido clorogênico",cafe_ativo,"mg",sem_vd=True)],
 "rodape":"*Percentual de valores diários fornecidos pela porção",
 "regras":"Arredondamento: Anexo III IN 75/2020 (paráfrase). %VD: Anexo VIII (adultos); macros: Anexo II. Não significativo: %VD 0. Sem VDR: em branco. Colina em linha própria (Anexo XI, item 9)."}
P={"slug":slug,"nome":"Slim Up - EMAGRECIMENTO EM GOTA","porcao_mg":PORCAO,"porcao_descricao":"1 mL (30 gotas), 1 vez ao dia — porção do memorial rev03; o cadastro diz 2 mL (decisão do dono, ver pendências)","porcoes_por_embalagem":30,
 "formato":"líquido — solução oral em gotas, frasco de 30 mL","grupo_populacional":"adultos (> 19 anos)",
 "fonte_antes":"memorial de cálculo rev03 (14/09/2026, rascunho não assinado, MEM-CALC-SLIMUP-rev03 .xlsx) — porção 1 mL, 30 porções por frasco; o cadastro do banco (5 linhas, 'Ingerir 2 mL ao dia') e a ficha técnica antiga divergem",
 "insumos":insumos,"excipientes":excipientes,"soma_porcao_mg":soma,"cabe":soma<=PORCAO,"solidos_por_ml_mg":solidos,"tabela_nutricional":tn,
 "ingredients_list":"Água purificada, bitartarato de colina, umectante glicerina (INS 422), umectante sorbitol (INS 420), extrato de café verde (Coffea canephora — espécie conforme laudo do lote), vitamina D3 (colecalciferol), acidulante ácido cítrico (INS 330), conservadores benzoato de sódio (INS 211) e sorbato de potássio (INS 202), espessante goma xantana (INS 415), picolinato de cromo, metilcobalamina (vitamina B12).",
 "warnings":"Este produto não é um medicamento.\nPúblico indicado: adultos (19 anos ou mais).\nNão exceder a recomendação diária de consumo indicada na embalagem.\nMantenha fora do alcance de crianças.\nEste produto não deve ser consumido por gestantes, lactantes e crianças.\nConservar em local seco, fresco e ao abrigo da luz. Após aberto, manter a embalagem bem fechada e seguir as orientações do rótulo.",
 "pendencias":[
  "Dono: porção — o rev03 (14/09) define 1 mL = 30 gotas (30 porções/frasco de 30 mL); o cadastro diz 2 mL. A proposta é por dose diária de 1 mL; se a porção ficar em 2 mL, as concentrações por mL caem pela metade (mesma dose diária) e o frasco rende 15 porções.",
  "Fábrica: viabilidade de 221,62 mg de bitartarato de colina em 1 mL (solubilidade, estabilidade, sabor); sólidos por mL sobem para 498,24 mg. Se inviável, alternativa é retirar a colina (não há como atingir 82,5 mg com menos massa).",
  "Café verde: lote com laudo válido (IDNLABS 10269 — 'solúvel', adequado a gotas) ou laudo completo do HERBALTEC 10841; espécie do rótulo = espécie do laudo.",
  "Sorbitol: o laudo em disco (lote 106371) é de sorbitol em pó; a fórmula usa líquido 70 % — obter laudo do insumo real.",
  "Goma xantana (INS 415) × goma arábica (INS 414): confirmar a identidade do espessante e obter certificado.",
  "Aditivos em suplemento LÍQUIDO: limites da IN 211/2023 para a categoria de líquidos não foram conferidos nesta tarefa (a auditoria de 15/09 só cobriu a 14.2, sólidos) — conferir glicerina, sorbitol, benzoato, sorbato e goma xantana.",
  "Vitamina B12: divergência de teor entre rev03 (89,27 % tal qual) e inventário de laudos (98,17 % base anidra) para o mesmo lote 219376 — a fábrica confirma qual base usa na pesagem.",
  "Vitamina D3: manter 45 µg (90 % do teto) ou baixar para 40 µg (13,913 mg do pó) para folga maior — decisão do RT.",
  "Assinar o memorial rev03 (hoje rascunho) e atualizar a ficha técnica (ainda com D 50 µg, B12 9,94 µg e 'goma arábica')."
 ],
 "veredito":"CONFORME CONDICIONADO A (definição da porção pelo dono — 1 mL × 2 mL; viabilidade técnica da colina a 221,62 mg/mL confirmada pela fábrica; laudo válido do lote de café verde; laudo do sorbitol líquido e identidade do espessante; conferência dos aditivos para suplemento líquido)",
 "ingredientes_categoria":{"vitamina-d":"vitamina","vitamina-b12":"vitamina","cromo":"mineral","extrato-de-cafe-verde":"extrato_vegetal","colina":"outro"},
}
gravar(P)
for r in tn["linhas"]: print(r)
