# -*- coding: utf-8 -*-
from lib import *
slug="omega-pro-tg"; PORCAO=1000.0
oleo=1000.0; epa=185.34; dha=123.56; outros=7.6; total_o3=316.5
epa_dha=round(epa+dha,2)
kcal=oleo/1000*9; kj=oleo/1000*37
print("EPA+DHA:",epa_dha,"mg =",round(epa_dha/2000*100,1),"% do teto;",round(epa_dha/37.5*100,0),"% do mín | lipídeos 1 g vs mín 5 g =",round(1/5*100),"% | energia",kcal,"kcal",kj,"kJ")

insumos=[
 {"constituinte_anexo_i":"Lipídeos — Óleo de peixe (grupo 'Lipídeos' do Anexo I, redação IN 431/2026; linha 'Óleo de peixe', CAS '-')","forma_insumo":"óleo de peixe TG (triglicerídeo) — segundo o cadastro; NENHUM laudo de óleo de peixe em disco","nome_composicao":"Óleo de peixe TG","ingredient_slug":"oleo-de-peixe-tg","ingredient_nome":"Óleo de peixe TG",
  "massa_insumo_mg":oleo,"teor_pct":None,"teor_fonte":"cadastro do banco (sem memorial, sem rótulo, sem laudo) — PROCEDÊNCIA NÃO CONFIRMADA","ativo_mg":oleo,"unidade_ativo":"mg de lipídeos totais","minimo":5000,"maximo":"NE","pct_do_maximo":None,
  "linha_anexo":LIMITES["Lipídeos totais"]["linha"],"laudo":{"lote":None,"validade":None,"vencido":None},
  "status":"mantido — sem procedência","motivo":"LEITURA LITERAL: o Anexo I põe 'Óleo de peixe' no grupo Lipídeos; o Anexo III fixa 'Lipídeos totais' mínimo 5 g para > 19 anos (máximo NE no Anexo IV). INTERPRETAÇÃO 1 (por grupo): o mínimo de 5 g se aplica a qualquer constituinte do grupo Lipídeos → 1 g de óleo = 20 % do mínimo, ABAIXO; para cumprir seriam 5 g de óleo por dia (5 softgels de 1 g, ou porção de 5 g). INTERPRETAÇÃO 2 (por função): o óleo de peixe é a fonte de EPA e DHA, constituintes com linha própria nos Anexos III/IV (37,5–2.000 mg), e o mínimo de 'Lipídeos totais' se aplica ao produto apresentado como fonte de lipídeos/gorduras; nesse caso a linha fica conforme. A auditoria de 15/09 registrou que o painel oficial mostra, para 'Óleo de peixe', tanto a função 'Fonte de EPA / Fonte de DHA' quanto 'Lipídeos: mínimo 5 g'. Não decido: cabe ao RT (ou consulta à ANVISA)."},
 {"constituinte_anexo_i":"EPA e DHA — (componentes do óleo de peixe; linha 'EPA e DHA' dos Anexos III e IV)","forma_insumo":"EPA (ácido eicosapentaenoico) do óleo de peixe","nome_composicao":"EPA (ácido eicosapentaenoico)","ingredient_slug":"epa","ingredient_nome":"EPA",
  "massa_insumo_mg":epa,"teor_pct":None,"teor_fonte":"cadastro (sem laudo)","ativo_mg":epa,"unidade_ativo":"mg","minimo":37.5,"maximo":2000,"pct_do_maximo":None,
  "linha_anexo":LIMITES["EPA e DHA"]["linha"],"laudo":{"lote":None,"validade":None,"vencido":None},"status":"mantido — sem procedência","motivo":"Componente do óleo, não massa adicional. Soma EPA + DHA = 308,90 mg = 15,4 % do teto de 2.000 mg e 824 % do mínimo de 37,5 mg — CONFORME pelos números do cadastro, sem laudo que os confirme."},
 {"constituinte_anexo_i":"EPA e DHA — DHA (componente do óleo de peixe)","forma_insumo":"DHA (ácido docosaexaenoico) do óleo de peixe","nome_composicao":"DHA (ácido docosaexaenoico)","ingredient_slug":"dha","ingredient_nome":"DHA",
  "massa_insumo_mg":dha,"teor_pct":None,"teor_fonte":"cadastro (sem laudo)","ativo_mg":dha,"unidade_ativo":"mg","minimo":37.5,"maximo":2000,"pct_do_maximo":pct_max(epa_dha,2000),
  "linha_anexo":LIMITES["EPA e DHA"]["linha"],"laudo":{"lote":None,"validade":None,"vencido":None},"status":"mantido — sem procedência","motivo":"Idem (na soma). A nota i do Anexo III (≥ 30 mg de DHA) está nas colunas Gestantes/Lactantes, não na de > 19 anos."},
 {"constituinte_anexo_i":"(componente) outros ácidos graxos ômega-3","forma_insumo":"componente do óleo","nome_composicao":"Outros ácidos graxos ômega-3","ingredient_slug":"outros-acidos-graxos-omega-3","ingredient_nome":"Outros ácidos graxos ômega-3","massa_insumo_mg":outros,"teor_pct":None,"teor_fonte":"cadastro","ativo_mg":outros,"unidade_ativo":"mg","minimo":None,"maximo":None,"pct_do_maximo":None,"linha_anexo":"— (não é constituinte listado; informativo)","laudo":{"lote":None,"validade":None,"vencido":None},"status":"mantido — sem procedência","motivo":"185,34 + 123,56 + 7,6 = 316,5 mg = 'ômega-3 total' do cadastro (fecha)."},
]
excipientes=[
 {"nome":"Cápsula mole (softgel) — composição desconhecida","ins":None,"massa_mg":None,"ingredient_slug":None,"ingredient_nome":None,"papel":"envoltorio","laudo_lote":None,"observacao":"Nenhum documento informa gelatina/glicerina/água/antioxidante da cápsula."},
]
tn={"porcoes_por_embalagem":30,"porcao":"1 g (2 softgels)",
 "linhas":[dict(linha_nutri("Valor energético",kcal,"kcal"),kj=arred(kj),nota="PROVISÓRIO — 1 g de óleo × 9 kcal/g (Atwater); kJ 37 kJ/g PROVISÓRIO"),
  linha_nutri("Carboidratos",0.0,"g",nao_sig=True), linha_nutri("Açúcares totais",0.0,"g",nao_sig=True), linha_nutri("Açúcares adicionados",0.0,"g",nao_sig=True),
  linha_nutri("Proteínas",0.0,"g",nao_sig=True),
  dict(linha_nutri("Gorduras totais",oleo/1000,"g"),nota="PROVISÓRIO — óleo declarado no cadastro, sem laudo"),
  dict({"item":"Gorduras saturadas","quantidade":None,"unidade":"g","vd_pct":None},nota="PENDENTE — depende do laudo do óleo (perfil de ácidos graxos)"),
  dict({"item":"Gorduras trans","quantidade":None,"unidade":"g","vd_pct":None},nota="PENDENTE — laudo do óleo"),
  dict({"item":"Ômega 3","quantidade":arred(total_o3),"unidade":"mg","vd_pct":pct_vd("Ômega 3",total_o3)},nota="316,5 mg (cadastro); VD 4.000 mg do Anexo II — PROVISÓRIO"),
  dict(linha_nutri("EPA",epa,"mg",sem_vd=True),nota="sub-item de ômega 3"), dict(linha_nutri("DHA",dha,"mg",sem_vd=True),nota="sub-item de ômega 3"),
  dict({"item":"Colesterol","quantidade":None,"unidade":"mg","vd_pct":None},nota="PENDENTE — laudo do óleo"),
  linha_nutri("Fibras alimentares",0.0,"g",nao_sig=True), linha_nutri("Sódio",0.0,"mg",nao_sig=True)],
 "rodape":"*Percentual de valores diários fornecidos pela porção",
 "regras":"TABELA INTEIRA PROVISÓRIA: montada sobre o cadastro, sem laudo do óleo nem memorial. Arredondamento: Anexo III IN 75/2020 (paráfrase). %VD: Anexo II (gorduras 65 g; ômega 3 4.000 mg). Gorduras saturadas, trans e colesterol só com o laudo."}
P={"slug":slug,"nome":"Ômega Pró TG","porcao_mg":PORCAO,"porcao_descricao":"2 softgels (1 g de óleo), 1 vez ao dia","porcoes_por_embalagem":30,
 "formato":"softgel (cápsula mole) — 'TG' indica triglicerídeo, segundo o nome; nenhum documento confirma","grupo_populacional":"adultos (> 19 anos)",
 "fonte_antes":"SOMENTE o cadastro do banco (5 linhas: óleo de peixe TG 1.000 mg; ômega-3 total 316,5; EPA 185,34; DHA 123,56; outros 7,6). Não existe memorial de cálculo, ficha técnica, rótulo nem laudo do óleo de peixe em disco (busca da frente dos memoriais em MEMORIAIS_2026 2, Desktop/POPS e Downloads).",
 "insumos":insumos,"excipientes":excipientes,"soma_porcao_mg":oleo,"cabe":True,"tabela_nutricional":tn,
 "laudos_encontrados_incompativeis":[
   "NPT-0226141 'Nanomega 3' (NaturalPRO, lote NPT.0226/141, val. 02/2028): nanoemulsão em PÓ, ômega-3 15,3 % p/p, insolúvel em água — incompatível com softgel de óleo TG; não é o insumo deste produto.",
   "'OMEGA 3 PÓ.pdf' (Florien, lote NPT.0222/175): ômega-3 vegetal (ácido alfa-linolênico) em pó, 15,2 %, VENCIDO em 28/02/2024 — não é EPA/DHA de peixe.",
   "'BIO ATIVOS-OMEGA 3 Po.pdf' (Documents/LAUDOS): digitalização não lida; pelo nome, também pó.",
   "'DHA Ultra-V 20 %' (SM, lote 26C27-B024-221282, val. 23/12/2028): DHA de Schizochytrium sp. em pó — fonte de alga, não óleo de peixe."],
 "ingredients_list":None,
 "warnings":"Este produto não é um medicamento.\nPúblico indicado: adultos (19 anos ou mais).\nNão exceder a recomendação diária de consumo indicada na embalagem.\nMantenha fora do alcance de crianças.\nALÉRGICOS: CONTÉM PEIXE.\nConservar o produto em local seco, fresco e arejado, ao abrigo da luz e do calor excessivo, em temperatura ambiente entre 15 °C e 30 °C.\nNão consumir se o lacre de segurança estiver violado.",
 "pendencias":[
  "LAUDO DO ÓLEO DE PEIXE do lote em uso: forma (triglicerídeo / éster etílico / rTG), EPA e DHA em mg/g, perfil de ácidos graxos (saturados, trans), colesterol, oxidação (índice de peróxidos, anisidina, TOTOX), metais pesados (Hg, Pb, Cd, As), dioxinas/PCB, fornecedor e validade. Sem ele não há como confirmar 185,34 mg de EPA e 123,56 mg de DHA nem montar a tabela nutricional.",
  "MEMORIAL DE CÁLCULO: massa de óleo por softgel, composição da cápsula (gelatina, glicerina, água, antioxidante) e rendimento — não existe.",
  "RÓTULO/ARTE: não existe; ingredients_list e warnings estão vazios no banco.",
  "RT: posição escrita sobre o mínimo de 5 g de 'Lipídeos totais' (Anexo III) — se aplicável ao óleo de peixe como constituinte do grupo Lipídeos (interpretação 1: 1 g fica abaixo; seriam 5 g/dia) ou só a produtos apresentados como fonte de lipídeos (interpretação 2: conforme, EPA + DHA 308,9 mg dentro de 37,5–2.000 mg). O painel oficial mostra as duas informações para 'Óleo de peixe'.",
  "Os quatro laudos de 'ômega' em disco são pós (nanoemulsão, ALA vegetal vencido, DHA de alga, scan) — nenhum serve para este softgel."
 ],
 "veredito":"NÃO RESOLVIDO (não existe laudo do óleo de peixe, memorial nem rótulo — a composição do cadastro não tem procedência; e a aplicação do mínimo de 5 g de lipídeos totais ao óleo de peixe depende de posição do RT). Se o laudo confirmar EPA 185,34 + DHA 123,56 mg por 2 softgels e o RT adotar a interpretação 2, a fórmula fica CONFORME (EPA + DHA = 308,9 mg, 15 % do teto)",
 "sql_sem_composicao":True,
 "sql_nao_gravar_nutritional_info":True,
 "sql_sem_composicao_motivo":"NÃO RESOLVIDO — sem laudo do óleo, memorial ou rótulo não há fonte para gravar composição nova; o SQL só grava os dizeres obrigatórios do art. 14 da RDC 243/2018 (hoje vazios), o alergênico 'peixe' (decorre do único insumo do cadastro) e a porção, e marca a tabela como PROVISÓRIA no metadata.",
}
gravar(P)
for r in tn["linhas"]: print(r)
