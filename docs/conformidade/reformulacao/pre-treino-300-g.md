# Memorial de reformulação — PRÉ TREINO 300 G

**Data:** 16/09/2026. **Slug:** `pre-treino-300-g`. **Para:** dono e RT (Anderson C. Barbosa, CRF/MT 5526).

**Fontes lidas:** memorial de cálculo da fábrica MEMORIAL-CALCULO-PRE-TREINO.docx, código MC-PRD-PRETREINO-001, Revisão 01 de 14/08/2026 (extraído na fase 1 de 16/09/2026 — é o único documento da família com pote de exatamente 300 g, e o único com laudo por lote e conversão sal→base); cadastro do banco ao vivo em 16/09/2026 (10 linhas de composição; `ingredients_list` declara "L-citrulina malato" e "corante artificial (INS)" que não estão na composição); auditoria de 15/09/2026, Parte II, item II.7 (NÃO VERIFICÁVEL — cadastro contraditório); `laudos.json` (16/09/2026); IN 28/2018 Anexos I, III, IV, VI literais; IN 75/2020 e RDC 429/2020 (AnvisaLegis, 16/09/2026).

**Não existe rótulo deste produto em disco.** Há duas descrições da composição que não coincidem: o **cadastro** (10 linhas, com creatina 5.000, taurina 2.000, tirosina 500, beta-alanina 300, cafeína 200, sem arginina, B6 ou B12) e o **memorial da fábrica** (13 itens: creatina 3.000, beta-alanina 2.000, cloridrato de L-arginina 1.240, taurina 900, tirosina 400, cafeína 200, B6 2 mg, B12 9,94 µg + excipientes). O memorial é o que a fábrica pesa, com laudo por lote; a reformulação parte dele.

## 1. Identificação

| campo | atual | proposta |
|---|---|---|
| Nome | PRÉ TREINO 300 G ("Suplemento Alimentar em pó") | mantido |
| Formato | pó solúvel, sabor limão, pote com dosador | mantido |
| Porção | 10 g (1 dosador) em 200 mL de água, 1 vez ao dia, antes do treino | mantida |
| Porções por embalagem | 30 | mantido (300 ÷ 10 = 30, inteiro) |
| Grupo populacional | adultos, "> 19 anos" | mantido |

## 2. Antes

| insumo | cadastro (banco) | memorial Rev.01 (massa pesada × teor = entrega) | mín | máx | situação |
|---|---|---|---|---|---|
| Creatina monoidratada | 5.000 mg | 3.000 mg × 100,5 % = 3.015 mg | 3.000 | 5.000 | cadastro no **teto**; memorial no **piso** (0,5 % de folga) |
| Beta-alanina | 300 mg | 2.000 mg (**sem laudo** no dossiê) | — | 2 g | memorial: 2.000 mg em dose única **contraria o Anexo VI** (doses de no máximo 300 mg, 2 h de intervalo) |
| L-citrulina malato | só na `ingredients_list` (sem massa) | **ausente** — retirada na Rev.01 (a versão anterior tinha 1.400 mg) | — | — | **não consta do Anexo I** (só "L-citrulinilarginina", de alga *Chondrus crispus*) — forma não autorizada |
| Cloridrato de L-arginina | ausente | 1.240 mg × 99,40 % × 82,68 % = 1.019 mg de arginina | NE | 3.810 | conforme (memorial) |
| Taurina | 2.000 mg | 900 mg × 99,46 % = 895 mg | NE | 2.000 | cadastro no **teto** |
| L-tirosina | 500 mg | 400 mg × 99,9 % = 399,6 mg | 262,5 | 2.750 | conforme |
| Cafeína anidra | 200 mg | 200 mg × 99,88 % = 199,76 mg | 75 | 200 | no **teto** (99,9 %); insumo controlado pela Polícia Federal |
| Vitamina B6 (cloridrato de piridoxina) | ausente | 2 mg × 99,9 % × 82,27 % = 1,64 mg | 0,26 | 98,60 | conforme |
| Vitamina B12 (metilcobalamina) | ausente | 0,00994 mg × 94,54 % = 9,40 µg | 0,36 µg | 9,94 µg | 94,6 % do teto |
| Ácido cítrico / aroma limão / SiO2 / sucralose | 1.100 / 350 / 118 / 90 mg | idem | aditivos (IN 211/2023) | | conformes |
| Maltodextrina | 342 mg | 600 mg (laudo **vencido** 26/07/2026) | veículo | | |
| Corante | "corante artificial (INS)" só na lista, sem massa | **ausente** | | | lacuna do cadastro |
| **soma** | 10.000 mg | 10.000,01 mg | | | |

## 3. Depois

| # | constituinte (Anexo I) | insumo | massa por porção | teor e fonte | ativo (conta) | mín | máx | % do máx | linha do anexo | laudo (lote · validade · vencido?) | status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Creatina — "Creatina monohidratada" (CAS 6020-87-7) | creatina monoidratada | **3.500 mg** | 100,5 % b.s.; LOD 11,5 % | A: 3.500 × 1,005 = **3.517,5 mg** · B: × 0,885 = **3.112,9 mg** | 3.000 | 5.000 | A 70,4 % · B 62,3 % | I·Creatina monohidratada; III·Creatina; IV·Creatina (IN 373/2025) | 217949 · 22/09/2028 · não | dose ajustada (memorial 3.000; cadastro 5.000) |
| 2 | "Beta-alanina" (CAS 107-95-9, IN 102/2021) | beta-alanina | **300 mg** | 99,1 % — laudo Lepuge **vencido** (03/08/2026): último teor conhecido | 300 × 0,991 = **297,3 mg** | — | 2 g | 14,9 % | I·Beta-alanina; IV·Beta-alanina; VI·Beta-alanina | AUTO033847 · 03/08/2026 · **VENCIDO** | dose ajustada (memorial 2.000 → 300) |
| 3 | Arginina — "Cloridrato de L-arginina" (CAS 1119-34-2) | cloridrato de L-arginina | 1.240 mg | doseamento 99,40 % (laudo Lepuge); sal→base 174,20 ÷ 210,66 = 82,69 % | 1.240 × 0,994 × 0,8269 = **1.019 mg de arginina** | NE | 3.810 | 26,7 % | I·Arginina·Cloridrato de L-arginina; III·Arginina (NE); IV·Arginina | AUTO035918 · 12/11/2026 · não | mantido (memorial); novo no cadastro |
| 4 | "Taurina" (CAS 107-35-7) | taurina | 900 mg | 99,46 % (99,5 % b.s. × 0,9996) — laudo | 900 × 0,9946 = **895 mg** | NE | 2.000 | 44,8 % | I·Taurina; III·Taurina (NE); IV·Taurina | 214586 · 10/05/2028 · não | mantido (memorial); cadastro 2.000 → 900 |
| 5 | Tirosina — "L-Tirosina" (CAS 60-18-4) | L-tirosina | 400 mg | 99,9 % — laudo | 400 × 0,999 = **399,6 mg** | 262,5 | 2.750 | 14,5 % | I·L-Tirosina; III·Tirosina^viii; IV·Tirosina | 91382 · 07/05/2028 · não | mantido (memorial); cadastro 500 → 400 |
| 6 | Cafeína — "Cafeína/1,3,7-Trimethylxanthine" (CAS 58-08-2) | cafeína anidra | **175 mg** | 99,88 % (100,11 % anidra × 0,9977) — laudo | 175 × 0,9988 = **174,8 mg** | 75 | 200 | **87,4 %** | I·Cafeína; III·Cafeína; IV·Cafeína^vi | 214171 · 02/12/2029 · não | dose ajustada (200 → 175) |
| 7 | Vitamina B6 — "Cloridrato de piridoxina" (CAS 58-56-0) | cloridrato de piridoxina | 2,00 mg | 99,9 % — laudo; sal→base 169,18 ÷ 205,64 = 82,27 % | 2,00 × 0,999 × 0,8227 = **1,644 mg** | 0,26 | 98,60 | 1,7 % | I·Vitamina B6·Cloridrato de piridoxina; III·Vitamina B6; IV·Vitamina B6 | 91188 · 28/12/2027 · não | mantido (memorial); novo no cadastro |
| 8 | Vitamina B12 — "Metilcobalamina" (CAS 13422-55-4) | metilcobalamina | **0,009522 mg** (era 0,00994; a fase 2 propôs 0,00899 com o lote 90955) | 98,17 % base anidra → 89,27 % tal qual — laudo lote 219376 (**harmonizado na fase 3**, 16/09/2026: mesmo lote de referência dos outros 6 produtos com metilcobalamina; o 90955, 94,54 %, vence em 28/12/2026) | 0,009522 × 0,8927 = **0,0085 mg = 8,5 µg** | 0,36 µg | 9,94 µg | **85,5 %** | I·Vitamina B12·Metilcobalamina; III·Vitamina B12; IV·Vitamina B12 | 219376 · 14/11/2030 · não | dose ajustada (9,4 → 8,5 µg) |

Excipientes: ácido cítrico (INS 330) 1.100 mg; aromatizante idêntico ao natural de limão 350 mg; dióxido de silício (INS 551) 118 mg; sucralose (INS 955) 90 mg; **maltodextrina q.s.p. 1.824,99 mg** (era 600 no memorial: absorve a redução da beta-alanina e da creatina). Sem corante (o memorial não tem; se a fábrica usar, informar nome, INS e massa).

**Soma da porção:** 3.500 + 300 + 1.240 + 900 + 400 + 175 + 2,00 + 0,009 + 1.100 + 350 + 118 + 90 + 1.824,99 = **10.000,00 mg de 10.000 mg (100 %)** — cabe.

## 4. Mudanças e motivos

1. **L-citrulina malato retirada da lista de ingredientes** — não consta do Anexo I (a única entrada com citrulina é "L-citrulinilarginina", autorizada só como alga *Chondrus crispus* invernal, com máximo de 52,8 mg e advertência "Contém citrulina."; não é o mesmo constituinte). O memorial da fábrica já a retirou em 14/08/2026 e recompôs a via do óxido nítrico com **cloridrato de L-arginina** (forma do Anexo I, laudo válido) — a proposta segue o memorial.
2. **Beta-alanina 2.000 → 300 mg por dose.** Anexo VI: "Quantidade diária máxima de 2 g com doses divididas de, no máximo, 300 mg, com intervalo de duas horas entre as doses." Com 1 dose por dia de 300 mg o produto atende à condição e mantém o conceito de dose única. (O cadastro já trazia 300 mg; a fábrica pesava 2.000.)
3. **Cafeína 200 → 175 mg** — 200 mg é o teto exato do Anexo IV (199,76 mg com o teor); 175 mg = 87,4 %. Segue insumo controlado pela Polícia Federal: a licença da Lemoncaps é PENDENTE (o próprio memorial marca isso como pendência crítica).
4. **Creatina 3.000 → 3.500 mg** — 3.000 mg crava o mínimo (e fica abaixo na leitura B); 3.500 mg fica acima nas duas leituras (ver memorial da creatina em pó). O cadastro tinha 5.000 (teto).
5. **Vitamina B12 9,4 → 8,5 µg** — 94,6 % do teto vira 85,5 %.
6. **Taurina 2.000 → 900 mg e tirosina 500 → 400 mg no cadastro** — o cadastro cravava a taurina no teto; a fábrica pesa 900 e 400 (memorial).
7. **Arginina, B6 e B12 entram no cadastro** — a fábrica pesa e o cadastro não tinha.
8. **Corante sem nome retirado da lista** — não está no memorial; se existir, precisa de nome, INS, massa e laudo.
9. **Maltodextrina 600 → 1.825 mg** (q.s.p.) — laudo do lote 210170 vencido; lote novo antes de fabricar.

## 5. Tabela nutricional

Regras: IN 75/2020 Anexo XXII (carboidratos 4; proteínas 4; ácidos orgânicos 3); aminoácidos livres (arginina, tirosina, beta-alanina) contados a 4 kcal/g como proteínas — **critério assumido, a confirmar pelo RT**; taurina e creatina sem fator → 0; Anexo XI (aminoácidos específicos no 1º nível sob Proteínas, em mg; taurina em linha própria; cafeína e creatina como substâncias específicas ao final); Anexo VIII (VDR ≥ 19 anos: B6 1,3 mg; B12 2,4 µg; carboidratos 300 g; energia 2.000 kcal); Anexo III e IV; RDC 429 Art. 3º I (a fração de mono e dissacarídeos da maltodextrina conta como açúcar adicionado — o perfil da maltodextrina DE 17,72 % não está em disco → PENDENTE).

Contas: energia = maltodextrina 1,825 g × 4 (7,30) + ácido cítrico 1,1 g × 3 (3,30) + aminoácidos (1,019 + 0,400 + 0,297 = 1,716 g) × 4 (6,86) = **17,46 kcal → 17 kcal**; 17,46 × 4,184 = 73,05 → **73 kJ**; 17 ÷ 2.000 = 0,85 → 1 %. Carboidratos 1,825 → **1,8 g**; 1,8 ÷ 300 = 0,6 → 1 %. B6 1,644 → 1,6 mg; 1,6 ÷ 1,3 = 123 %. B12 8,5 µg ÷ 2,4 = 354 %. Sódio: sem fonte → 0.

```
INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 10 g (1 dosador)
                                   10 g             %VD*
Valor energético                   17 kcal = 73 kJ  1 %
Carboidratos                       1,8 g            1 %
n Açúcares totais                  PENDENTE
nn Açúcares adicionados            PENDENTE
Proteínas                          0 g              0 %
n L-arginina                       1.019 mg
n L-tirosina                       400 mg
n Beta-alanina                     297 mg
Gorduras totais                    0 g              0 %
n Gorduras saturadas               0 g              0 %
n Gorduras trans                   0 g              0 %
Fibras alimentares                 0 g              0 %
Sódio                              0 mg             0 %
Vitamina B6                        1,6 mg           123 %
Vitamina B12                       8,5 µg           354 %
Taurina                            895 mg
Cafeína                            175 mg
Creatina                           3.500 mg
*Percentual de valores diários fornecidos pela porção
```

## 6. Lista de ingredientes proposta (ordem decrescente de massa)

> Creatina monoidratada, maltodextrina, cloridrato de L-arginina, acidulante ácido cítrico (INS 330), taurina, L-tirosina, aromatizante idêntico ao natural de limão, beta-alanina, cafeína anidra, antiumectante dióxido de silício (INS 551), edulcorante sucralose (INS 955), vitamina B6 (cloridrato de piridoxina) e vitamina B12 (metilcobalamina).

Glúten: Lei 10.674/2003 obriga a frase; sem ensaio deste produto — "Não contém glúten" só com laudo ou declaração do RT. Sem alergênicos declaráveis (sulfitos: 0,38 mg/kg pela maltodextrina, abaixo de 10 mg/kg, conta do memorial — refazer com a nova massa de maltodextrina: 1,825 g × 6,27 ppm = 0,0114 mg/dose = 1,14 mg/kg, ainda abaixo).

## 7. Advertências

Art. 14 da RDC 243/2018 (literal, em destaque e negrito): **"Este produto não é um medicamento."** · **"Não exceder a recomendação diária de consumo indicada na embalagem."** · **"Mantenha fora do alcance de crianças."** Grupo e uso: "Público indicado: adultos a partir de 19 anos" · "Diluir 10 g (1 dosador) em 200 mL de água e consumir 1 vez ao dia".

Anexo VI da IN 28/2018, linha "Aminoácidos, …, Creatina, Taurina, …, Cafeína, …": **"Este produto não deve ser consumido por gestantes, lactantes e crianças."** — o cadastro traz "não é recomendado para crianças, gestantes, lactantes e pessoas sensíveis à cafeína", redação mais fraca que a exigida; corrigir.

Anexo VI, linha "Beta-alanina" (literal, IN 102/2021): **"Quantidade diária máxima de 2 g com doses divididas de, no máximo, 300 mg, com intervalo de duas horas entre as doses."** — **faltava**.

Informação de cafeína ("Contém cafeína (175 mg por porção)") — mantida a prática do rótulo atual ("CONTÉM CAFEÍNA"); não é frase do Anexo VI.

## 8. Pendências e decisões

1. **Laudo novo de beta-alanina** (o único em disco venceu em 03/08/2026; o memorial não tinha nenhum).
2. **Cafeína anidra — insumo controlado (Polícia Federal)**: esclarecer a licença antes de fabricar.
3. Laudos a renovar: maltodextrina 210170 (vencido); aroma de limão 19504 (vence 25/09/2026); cloridrato de L-arginina AUTO035918 (vence 12/11/2026). (B12: a fase 3 trocou a referência do lote 90955, que vence em 28/12/2026, pelo lote 219376, válido até 14/11/2030 — o mesmo dos outros produtos.)
4. **Perfil de açúcares da maltodextrina** (açúcares totais e adicionados).
5. Decisões do RT: leitura A/B da creatina; critério de energia dos aminoácidos livres; corante (se houver).
6. **Arte de rótulo** (não existe) e memorial de cálculo Rev.02 com esta fórmula.

## 9. Veredito esperado

**CONFORME (fórmula proposta, com folga em todos os oito constituintes — o maior é a cafeína, 87,4 % do teto; soma 10.000 mg)** — condicionado a laudo novo de beta-alanina e à regularização do insumo controlado (cafeína). A L-citrulina malato, que tornava o cadastro não verificável, sai; a arginina em forma autorizada entra.
