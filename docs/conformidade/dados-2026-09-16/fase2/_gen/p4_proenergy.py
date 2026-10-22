# -*- coding: utf-8 -*-
from lib import *
slug="pro-energy"; PORCAO=1000.0
tau_ins=200.0; tau_ativo=round(tau_ins*99.46/100,2)          # 198,92
gua_ins=200.0; gua_metilx=round(gua_ins*5.11/100,2)          # 10,22 (limite superior de cafeína)
caf_ins=150.0; caf_ativo=round(caf_ins*99.88/100,2)          # 149,82
caf_total_max=round(caf_ativo+gua_metilx,2)                  # 160,04
car_ins=90.0; car_ativo=round(car_ins*95.95/100,2)           # 86,36
arg_ins=75.0; arg_ativo=round(arg_ins*0.8268*0.994,2)        # 61,63
zn_ins=20.0; zn_ativo=round(zn_ins*19.89/100,2)              # 3,98
b6_ins=10.0; b6_ativo=round(b6_ins*0.999*0.8227,2)           # 8,22
sio2=5.0
soma_ins=tau_ins+gua_ins+caf_ins+car_ins+arg_ins+zn_ins+b6_ins+sio2; malto=round(PORCAO-soma_ins,2); soma=round(soma_ins+malto,2)
kcal=malto/1000*4; kj=malto/1000*17
print("insumos:",soma_ins,"| malto:",malto,"| soma:",soma,"| cafeína anidra:",caf_ativo,"| metilx guaraná ≤",gua_metilx,"| cafeína total máx:",caf_total_max,f"({caf_total_max/200*100:.1f}% do teto)")
print("arginina:",arg_ativo,"| carnitina:",car_ativo,"| Zn:",zn_ativo,"| B6:",b6_ativo,"| energia",round(kcal,2))

insumos=[
 {"constituinte_anexo_i":"Saponinas de glicosídeos de furostanol — Extrato de semente de feno-grego (Trigonella foenum-graecum L.)","forma_insumo":"em uso: feno-grego PÓ de semente (Santosflora, lote AUTO9IVT) — não é a forma do Anexo I","nome_composicao":"Extrato seco de semente de feno-grego","ingredient_slug":"extrato-seco-de-semente-de-feno-grego","ingredient_nome":"Extrato seco de semente de feno-grego (Trigonella foenum-graecum L.)",
  "massa_insumo_mg":250.0,"teor_pct":None,"teor_fonte":"laudo do lote 'sem doseamento de ativos/saponinas' (memorial rev02)","ativo_mg":None,"unidade_ativo":"mg de saponinas","minimo":"NE","maximo":450,"pct_do_maximo":None,
  "linha_anexo":LIMITES["Saponinas de glicosídeos de furostanol"]["linha"],"laudo":{"lote":"AUTO9IVT (Santosflora, pó)","validade":"não confirmada (scan)","vencido":None},
  "status":"retirado","motivo":"Forma em uso (pó) não é a do Anexo I e não há laudo de saponinas (princípio 7). Extratos com laudo em disco foram rejeitados pelo parecer PAR-LAU-2026-001 (fabricante ≠ Indus Biotech — exigência que não consta do Anexo I literal; RT decide). Volta com extrato + laudo + fornecedor aceito; dose conforme: ≤ 405 mg de saponinas (ex.: 250 mg a 50 % = 125 mg, 28 % do teto), com a advertência do Anexo VI (IN 304/2024)."},
 {"constituinte_anexo_i":"Taurina — Taurina (CAS 107-35-7)","forma_insumo":"L-taurina, lote 214586","nome_composicao":"Taurina","ingredient_slug":"taurina","ingredient_nome":"Taurina",
  "massa_insumo_mg":tau_ins,"teor_pct":99.46,"teor_fonte":"laudo lote 214586: 99,5 % b.s. × (1 − 0,04 % umidade) = 99,46 % t.q. (memorial rev02; PDF é scan no inventário — lotes alternativos válidos: INLAB 875699 99,4 % até 10/2027; Lepuge AUTO032878 99,4 % até 01/07/2027)","ativo_mg":tau_ativo,"unidade_ativo":"mg","minimo":"NE","maximo":2000,"pct_do_maximo":pct_max(tau_ativo,2000),
  "linha_anexo":LIMITES["Taurina"]["linha"],"laudo":{"lote":"214586","validade":"não confirmada no inventário (scan)","vencido":None},"status":"mantido","motivo":"198,92 mg = 9,9 % do teto — mantido."},
 {"constituinte_anexo_i":"Cafeína — Guaraná em pó (Paullinia cupana)","forma_insumo":"Guaraná em pó (semente), Paullinia cupana Kunth, lote interno 25H26-B028-213428 / fabricante AUTO9J0E (fornecedor não identificado no documento) — TROCA: em uso hoje é 'extrato seco 22 %' (lote AUTO9J1Q), forma que não consta do Anexo I","nome_composicao":"Guaraná em pó (Paullinia cupana Kunth, semente)","ingredient_slug":"guarana-em-po","ingredient_nome":"Guaraná em pó",
  "massa_insumo_mg":gua_ins,"teor_pct":5.11,"teor_fonte":"laudo lote 25H26-B028-213428: metilxantinas 5,11 % (lido no inventário) — metilxantinas totais, não cafeína isolada; usado só como LIMITE SUPERIOR da cafeína","ativo_mg":gua_metilx,"unidade_ativo":"mg de metilxantinas (cafeína ≤ este valor)","minimo":75,"maximo":200,"pct_do_maximo":None,
  "linha_anexo":LIMITES["Cafeína"]["linha"]+" — soma com a cafeína anidra","laudo":{"lote":"25H26-B028-213428 (fabricante AUTO9J0E)","validade":"28/04/2028","vencido":False},
  "status":"forma trocada","motivo":"O Anexo I (grupo Cafeína) lista 'Guaraná em pó (Paullinia cupana)' e 'Extrato fluido de guaraná' (IN 450/2026) — não 'extrato seco'. A fábrica pesa extrato seco 22,35 % (memorial rev02), que ainda por cima levava a cafeína total a 194,52 mg (97 % do teto). Troca para guaraná em pó com laudo válido: no pior caso (todas as metilxantinas como cafeína) 200 × 5,11 % = 10,22 mg. Pendência: laudo com cafeína específica para declarar a cafeína total exata."},
 {"constituinte_anexo_i":"Cafeína — Cafeína/1,3,7-Trimethylxanthine (CAS 58-08-2)","forma_insumo":"cafeína anidra, lote 214171","nome_composicao":"Cafeína anidra","ingredient_slug":"cafeina-anidra","ingredient_nome":"Cafeína anidra",
  "massa_insumo_mg":caf_ins,"teor_pct":99.88,"teor_fonte":"laudo lote 214171: 100,11 % base anidra; 99,88 % tal qual (memorial rev02, sem demonstrar a umidade) — PDF é scan; alternativos válidos: Lepuge AUTO039045 99,20 % até 31/10/2027","ativo_mg":caf_ativo,"unidade_ativo":"mg de cafeína","minimo":75,"maximo":200,"pct_do_maximo":pct_max(caf_ativo,200),
  "linha_anexo":LIMITES["Cafeína"]["linha"],"laudo":{"lote":"214171","validade":"não confirmada no inventário (scan)","vencido":None},
  "status":"mantido","motivo":f"149,82 mg = 74,9 % do teto sozinha; cafeína total no pior caso 149,82 + 10,22 = {caf_total_max} mg = 80,0 % do teto (≤ 90 %) e 213 % do mínimo de 75 mg. O memorial recomendava baixar para 140 mg por causa do extrato seco; com o guaraná em pó a folga volta sem mexer na anidra."},
 {"constituinte_anexo_i":"L-Carnitina — Levocarnitina/L-carnitina (CAS 541-15-1)","forma_insumo":"L-carnitina base, lote 216523","nome_composicao":"L-carnitina","ingredient_slug":"l-carnitina","ingredient_nome":"L-carnitina",
  "massa_insumo_mg":car_ins,"teor_pct":95.95,"teor_fonte":"laudo lote 216523: 99,3 % b.a., umidade 3,37 % → 95,95 % t.q. (memorial rev02; scan no inventário; alternativo válido SM 26H14-B025-226329 99,41 % até 20/05/2028)","ativo_mg":car_ativo,"unidade_ativo":"mg","minimo":"NE","maximo":2000,"pct_do_maximo":pct_max(car_ativo,2000),
  "linha_anexo":LIMITES["L-Carnitina"]["linha"],"laudo":{"lote":"216523","validade":"não confirmada (scan)","vencido":None},"status":"mantido","motivo":"86,36 mg = 4,3 % do teto."},
 {"constituinte_anexo_i":"Arginina — Cloridrato de L-arginina (CAS 1119-34-2)","forma_insumo":"L-arginina HCl, Lepuge, lote AUTO035918 (o rótulo imprime 'L-Aspartato de L-arginina' — insumo real é o cloridrato)","nome_composicao":"Cloridrato de L-arginina (equivalente a 61,6 mg de L-arginina)","ingredient_slug":"cloridrato-de-l-arginina","ingredient_nome":"Cloridrato de L-arginina","e_sal":True,
  "massa_insumo_mg":arg_ins,"teor_pct":99.4,"teor_fonte":"laudo lote AUTO035918 (99,4 %) × fator sal→base 174,20/210,70 = 82,68 % (memorial rev02, reconferido)","ativo_mg":arg_ativo,"unidade_ativo":"mg de arginina","minimo":"NE","maximo":3810,"pct_do_maximo":pct_max(arg_ativo,3810),
  "linha_anexo":LIMITES["Arginina"]["linha"],"laudo":{"lote":"AUTO035918 (Lepuge, fabricante H24111301)","validade":"12/11/2026","vencido":False},"status":"mantido (nome corrigido)","motivo":"61,63 mg = 1,6 % do teto. O nome no rótulo/cadastro passa a ser o do insumo real (cloridrato de L-arginina, forma autorizada), não 'aspartato'."},
 {"constituinte_anexo_i":"Zinco — Bisglicinato de zinco (CAS 14281-83-5)","forma_insumo":"zinco quelato 20 %, Galena, lote 055-ZN/25","nome_composicao":"Bisglicinato de zinco (equivalente a 3,98 mg de zinco)","ingredient_slug":"zinco","ingredient_nome":"Zinco","e_sal":True,
  "massa_insumo_mg":zn_ins,"teor_pct":19.89,"teor_fonte":"laudo lote 055-ZN/25: 20,00 % b.s. × (1 − 0,54 %) = 19,89 % t.q.","ativo_mg":zn_ativo,"unidade_ativo":"mg de zinco","minimo":1.65,"maximo":29.59,"pct_do_maximo":pct_max(zn_ativo,29.59),
  "linha_anexo":LIMITES["Zinco"]["linha"],"laudo":{"lote":"055-ZN/25","validade":"06/05/2027","vencido":False},"status":"mantido","motivo":"3,98 mg = 13,4 % do teto, 36 % do VD."},
 {"constituinte_anexo_i":"Vitamina B6 — Cloridrato de piridoxina (CAS 58-56-0)","forma_insumo":"piridoxina HCl, Analitic, lote 91188","nome_composicao":"Cloridrato de piridoxina (vitamina B6)","ingredient_slug":"vitamina-b6","ingredient_nome":"Vitamina B6",
  "massa_insumo_mg":b6_ins,"teor_pct":99.9,"teor_fonte":"laudo lote 91188 (99,9 %) × 82,27 % (169,18/205,64)","ativo_mg":b6_ativo,"unidade_ativo":"mg de vitamina B6","minimo":0.26,"maximo":98.60,"pct_do_maximo":pct_max(b6_ativo,98.60),
  "linha_anexo":LIMITES["Vitamina B6"]["linha"],"laudo":{"lote":"91188","validade":"28/12/2027","vencido":False},"status":"mantido (declaração corrigida)","motivo":"8,22 mg = 8,3 % do teto, 632 % do VD. O rótulo/ficha declaram '10 mg (769 % VD)' tratando o sal como vitamina — corrigir para 8,22 mg."},
]
excipientes=[
 {"nome":"Maltodextrina (excipiente, q.s.p.)","ins":None,"massa_mg":malto,"ingredient_slug":"maltodextrina","ingredient_nome":"Maltodextrina","papel":"veiculo","laudo_lote":"a definir pela fábrica","observacao":"PROPOSTA: 250 mg para manter 2 cápsulas tamanho 0 depois da saída do feno-grego; alternativa da fábrica: ajustar a cápsula. Decisão do dono."},
 {"nome":"Antiumectante dióxido de silício","ins":"INS 551","massa_mg":sio2,"ingredient_slug":"dioxido-de-silicio","ingredient_nome":"Dióxido de silício","papel":"aditivo","laudo_lote":"—","observacao":"quantum satis; igual ao memorial rev02."},
]
tn={"porcoes_por_embalagem":30,"porcao":"1 g (2 cápsulas)",
 "linhas":[
  dict(linha_nutri("Valor energético",kcal,"kcal",nao_sig=True),kj=arred(kj),nota="só a maltodextrina foi contabilizada; guaraná em pó sem composição centesimal em disco; taurina, carnitina e arginina livres não computadas como proteína (PROVISÓRIO)"),
  linha_nutri("Carboidratos",malto/1000,"g",nao_sig=True), linha_nutri("Açúcares totais",0.0,"g",nao_sig=True), linha_nutri("Açúcares adicionados",0.0,"g",nao_sig=True),
  linha_nutri("Proteínas",0.0,"g",nao_sig=True), linha_nutri("Gorduras totais",0.0,"g",nao_sig=True), linha_nutri("Gorduras saturadas",0.0,"g",nao_sig=True), linha_nutri("Gorduras trans",0.0,"g",nao_sig=True),
  linha_nutri("Fibras alimentares",0.0,"g",nao_sig=True), linha_nutri("Sódio",0.0,"mg",nao_sig=True),
  linha_nutri("Vitamina B6",b6_ativo,"mg"), linha_nutri("Zinco",zn_ativo,"mg"),
  linha_nutri("Taurina",tau_ativo,"mg",sem_vd=True),
  dict(linha_nutri("Cafeína",caf_ativo,"mg",sem_vd=True),nota="cafeína da cafeína anidra; a do guaraná em pó (≤ 10,22 mg) só entra na declaração quando houver laudo de cafeína específica — PENDENTE"),
  linha_nutri("L-carnitina",car_ativo,"mg",sem_vd=True), linha_nutri("Arginina",arg_ativo,"mg",sem_vd=True)],
 "rodape":"*Percentual de valores diários fornecidos pela porção",
 "regras":"Arredondamento: Anexo III IN 75/2020 (paráfrase). %VD: Anexo VIII (adultos); macros: Anexo II. Não significativo: %VD 0. Sem VDR: em branco. Taurina em linha própria (Anexo XI, item 10). Energia: Atwater; kJ 17 kJ/g PROVISÓRIO."}
P={"slug":slug,"nome":"Pro Energy","porcao_mg":PORCAO,"porcao_descricao":"2 cápsulas (1 g), 1 vez ao dia","porcoes_por_embalagem":30,
 "formato":"cápsula gelatinosa dura tamanho 0 (98,45 mg vazia — memorial rev02)","grupo_populacional":"adultos (> 19 anos)",
 "fonte_antes":"memorial de cálculo rev02 (13/08/2026, MEM-CALC-PROENERGY-rev02) — as massas coincidem com a arte do rótulo (ProEnergy.pdf), mas o rótulo troca os nomes (imprime 'extrato seco de feno-grego' e 'guaraná em pó'; a fábrica pesa pó de feno-grego e extrato seco de guaraná) e declara 'L-Aspartato de L-arginina' onde o insumo é cloridrato",
 "insumos":insumos,"excipientes":excipientes,"soma_porcao_mg":soma,"cabe":soma<=PORCAO,"tabela_nutricional":tn,
 "cafeina_total_pior_caso_mg":caf_total_max,
 "ingredients_list":"Maltodextrina, guaraná em pó (Paullinia cupana Kunth, semente), taurina, cafeína anidra, L-carnitina, cloridrato de L-arginina, bisglicinato de zinco, cloridrato de piridoxina, antiumectante dióxido de silício (INS 551); cápsula: gelatina, água purificada e corante dióxido de titânio (INS 171).",
 "warnings":"Este produto não é um medicamento.\nPúblico indicado: adultos (19 anos ou mais).\nNão exceder a recomendação diária de consumo indicada na embalagem.\nMantenha fora do alcance de crianças.\nEste produto não deve ser consumido por gestantes, lactantes e crianças.\nConservar o produto em local seco, fresco e arejado, ao abrigo da luz e do calor excessivo, em temperatura ambiente entre 15 °C e 30 °C.\nApós aberto, consumir em até 60 dias.\nNão consumir se o lacre de segurança estiver violado.",
 "pendencias":[
  "Guaraná em pó (lote 25H26-B028-213428): laudo com CAFEÍNA específica (o atual traz metilxantinas totais 5,11 %) para declarar a cafeína total exata; identificar o fornecedor (o documento não traz razão social); confirmar compra deste insumo no lugar do extrato seco 22 %.",
  "Cafeína anidra (214171), taurina (214586) e L-carnitina (216523): os PDFs em disco são digitalizações não lidas no inventário — obter cópia legível com validade (há lotes alternativos válidos listados no JSON).",
  "Fábrica: excipiente q.s.p. 250 mg (maltodextrina) ou ajuste de cápsula — decisão do dono; refazer o memorial (a soma antes era 1.000 mg com o feno-grego).",
  "Rótulo: 'cloridrato de L-arginina' no lugar de 'L-Aspartato de L-arginina'; vitamina B6 8,22 mg (não 10 mg / 769 % VD); frase do Anexo VI no texto literal ('não deve ser consumido…', hoje 'NÃO RECOMENDADO…'); componentes da cápsula conforme o memorial (gelatina, dióxido de titânio, lauril sulfato de sódio — confirmar).",
  "Feno-grego: só volta com extrato de semente + laudo de saponinas + fornecedor aceito pelo RT (posição do RT sobre a exigência de fabricante do painel, ausente do Anexo I literal)."
 ],
 "veredito":"CONFORME CONDICIONADO A (laudo de cafeína específica e identificação do fornecedor do guaraná em pó; cópias legíveis/válidas dos laudos de cafeína anidra, taurina e L-carnitina; definição do excipiente)",
 "ingredientes_categoria":{"taurina":"aminoacido","guarana-em-po":"extrato_vegetal","cafeina-anidra":"outro","l-carnitina":"aminoacido","cloridrato-de-l-arginina":"aminoacido","zinco":"mineral","vitamina-b6":"vitamina"},
}
gravar(P)
for r in tn["linhas"]: print(r)
