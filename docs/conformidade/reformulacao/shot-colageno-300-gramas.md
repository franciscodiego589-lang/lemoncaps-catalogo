# Memorial de reformulação — Shot + Colágeno 300 g

**Slug:** `shot-colageno-300-gramas` · **Data:** 16/09/2026 · **Fase 2 — reformulação regulatória do catálogo Lemon Caps**
**Fontes lidas:** Anexos I, III, IV, V, VI e VII da IN 28/2018 (transcrições literais, consolidação até a IN 450/2026); auditoria de 15/09/2026 (Parte II, seção II.8); ficha `FOR-SHOT-COLAG-001_Formula_Shot_Matinal_Colageno_3_medidas.docx` (19/08/2026, Desktop/POPS, via `memoriais-formulacoes.json`, que também registra a ficha "pote 210 g" e o dossiê gerado de 12/09/2026); inventário de laudos de 16/09/2026 (Peptan, Verisol); gabarito da tabela nutricional; cadastro do banco lido ao vivo em 16/09/2026.

Em cada número está dito se foi **lido**, **calculado** (com a conta), **assumido** ou **PROVISÓRIO**.

---

## 1. Identificação

| campo | valor |
|---|---|
| Nome | SHOT + COLÁGENO 300 GRAMAS |
| Formato | pó para diluição (suplemento alimentar em pó) |
| Porção | 10 g (1 dose) diluída em 200 mL de água — **mantida na proposta principal**; alternativa de 12 g registrada (§4 e §8) |
| Porções por embalagem | 30 (300 g ÷ 10 g); na alternativa, 25 |
| Grupo populacional | adultos, coluna "> 19 anos" |

## 2. Antes — composição atual e veredito da auditoria

Existem **três documentos com três fórmulas** para este produto. Usei como "antes" a **ficha FOR-SHOT-COLAG-001 "3 medidas", coluna "Pote 300 g / dose 10 g" (19/08/2026)**, por ser a mais recente **com procedência da fábrica** (timbre e data Lemoncaps) e com o tamanho de pote do slug. Os outros dois: a ficha "pote 210 g" (mesma data) é de outro SKU (7 g, com colágeno genérico 2 g + Verisol 500 mg + maltodextrina); e o dossiê técnico de 12/09/2026 é gerado (jsPDF) a partir do **cadastro**, que traz colágeno 8.400 mg e zinco 1,65 mg — exatamente os mínimos legais, padrão do cadastro-teto — e por isso não vale como fonte de formulação. Nenhum dos três tem laudo, lote ou teor.

| # | insumo (ficha 19/08, coluna 300 g) | massa | observação | veredito |
|---|---|---|---|---|
| 1 | Colágeno Verisol | 7.548 mg | a 91 % de proteína (único teor em disco, laudo vencido): 6,87 g | **ABAIXO DO MÍNIMO** de proteínas (8,4 g) |
| 2 | Vitamina C (ácido ascórbico 99 %) | 1.100 mg | 1.089 mg a 99 % | CONFORME (57 % do teto) |
| 3 | Ácido cítrico | 670 mg | acidulante | CONFORME |
| 4 | "Fresh Drink Limão" | 330 mg | base de sabor/aroma | CONFORME (confirmar identidade) |
| 5 | Cúrcuma | 130 mg | sem teor | NÃO VERIFICADO |
| 6 | Dióxido de silício | 100 mg | antiumectante | CONFORME |
| 7 | Café verde 35 % | 50 mg | teor nominal | NÃO VERIFICADO |
| 8 | Sucralose | 50 mg | edulcorante | CONFORME |
| 9 | Corante verde folha | 17 mg | sem INS/doseamento | identificação pendente |
| 10 | Laranja Moro 08 % | 5 mg | teor nominal | NÃO VERIFICADO |
| 11 | Bisglicinato de zinco | 0,29 mg | se sal a 19,89 %: 0,058 mg de zinco | **ABAIXO DO MÍNIMO** (3,5 % de 1,65 mg) |

Soma: 10.000,29 mg. Cadastro atual do banco: 9 linhas (colágeno hidrolisado 8.400 mg, vitamina C 800, ácido cítrico 400, aroma 200, SiO2 100, sucralose 50, maltodextrina 31,35, corante 17, zinco 1,65) e `ingredients_list` com cúrcuma, café verde e laranja moro que não estão na composição. Veredito da auditoria: **NÃO VERIFICÁVEL** (teor proteico do colágeno; zinco no mínimo exato; cadastro contraditório).

## 3. Depois — composição proposta (porção de 10 g)

| constituinte (nome exato do Anexo I) | forma / insumo comercial | massa por porção | teor e fonte | ativo por porção | mín. | máx. (> 19) | % do máx. | linha do anexo | laudo | status |
|---|---|---|---|---|---|---|---|---|---|---|
| Proteínas — "Gelatina hidrolisada/Colágeno hidrolisado" | colágeno hidrolisado (Peptan, Lepuge AUTO040177, ou Verisol, Gelita 10.236 — lote em uso a confirmar) | **9.450 mg** | **PROVISÓRIO**: 91,0 % de proteína (Kjeldahl) é o último teor conhecido, de laudo **vencido** (Verisol); o Peptan válido não tem doseamento | 9.450 × 0,91 = **8.599,5 mg = 8,60 g** (PROVISÓRIO) | 8,4 g | NE | — (102,4 % do mínimo) | III·Proteínas (8,4) / IV·Proteínas (NE) | Peptan · 23/04/2030 · não (sem teor) / Verisol · 15/05/2026 · sim | **dose ajustada** (7.548 → 9.450) |
| Vitamina C — "Ácido ascórbico/Ácido L-ascórbico" (CAS 50-81-7) | ácido ascórbico 99 %, Analitic, lote 950467 | **201,01 mg** | 99,5 % — **lido** | 201,01 × 0,995 = **200,00 mg** | 13,5 mg | 1.916,02 mg | 10,4 % | III·Vitamina C / IV·Vitamina C | 950467 · 05/03/2029 · não | **dose ajustada** (1.100 → 200) |
| Zinco — "Bisglicinato de zinco" (CAS 14281-83-5) | zinco quelato 20 %, Galena, lote 055-ZN/25 | **11,06 mg** | 19,89 % t.q. (20,00 % b.s. − 0,54 % umidade) | 11,06 × 0,1989 = **2,20 mg** | 1,65 mg | 29,59 mg | 7,4 % | III·Zinco / IV·Zinco | 055-ZN/25 · 06/05/2027 · não | **dose ajustada** (0,058 → 2,2 mg) |
| Curcumina — "Extrato de rizomas de cúrcuma" | — | (era 130 mg) | sem laudo | — | 80 mg | 130 mg | — | III/IV·Curcumina | — | **retirado** |
| Ácido clorogênico — "Extrato de café verde" | — | (era 50 mg) | nominal | — | NE | 400 mg | — | III/IV·Ácido clorogênico | — | **retirado** (secundário; volta na alternativa de 12 g com o laudo 10269) |
| Antocianinas — "Extrato de laranja moro" | — | (era 5 mg) | nominal | — | NE | 5 mg | — | III/IV·Antocianinas da laranja moro | — | **retirado** (secundário; volta na alternativa de 12 g com o laudo 17624) |

Ingredientes não constituintes:

| ingrediente | massa | papel | observação |
|---|---|---|---|
| Ácido cítrico (INS 330) | 150 mg (era 670) | acidulante | quantum satis |
| Aromatizante idêntico ao natural de limão | 100 mg (era 330) | aroma | confirmar que "Fresh Drink Limão" é este insumo |
| Maltodextrina (q.s.p.) | **47,93 mg** (calculado: 10.000 − 9.952,07) | veículo | laudo 210170 vencido |
| Dióxido de silício (INS 551) | 20 mg (era 100) | antiumectante | quantum satis |
| Sucralose (INS 955) | 15 mg (era 50) | edulcorante | 15 ÷ 0,210 kg = 71,4 mg/kg (limite 2.400) |
| Corantes tartrazina (INS 102) e azul brilhante FCF (INS 133) | 5 mg (era 17) | corantes | 23,8 mg/kg (limite 300 cada); identificação pendente |

**Soma da porção:** 9.450 + 201,01 + 11,06 + 150 + 100 + 20 + 15 + 5 = 9.952,07 mg; maltodextrina 47,93 mg; **total 10.000,00 mg (100,0 %) — cabe.**

**Alternativa registrada (porção de 12 g, 25 doses por pote):** colágeno 9.900 mg (a 91 %: 9,01 g = 107 % do mínimo), vitamina C 800 mg (804,02 mg de insumo), zinco 2,2 mg (11,06 mg), ácido cítrico 400, aroma 200, SiO2 100, sucralose 50, corante 17, maltodextrina q.s.p. 517,92 mg → 12.000 mg. É a versão com folga real de proteína e com a vitamina C do cadastro; a mudança de porção é decisão do dono.

## 4. Mudanças e motivos

1. **Colágeno hidrolisado: 7.548 → 9.450 mg.** O colágeno hidrolisado só existe no Anexo I como fonte de **Proteínas** ("Gelatina hidrolisada/Colágeno hidrolisado"), com mínimo de 8,4 g/dia no Anexo III; o "Colágeno" de 11,5 mg (IN 102/2021) é outro constituinte, cuja fonte é membrana de casca de ovo. Com o único teor proteico em disco (91,0 %), 7.548 mg entregam 6,87 g (abaixo) e 8.400 mg (cadastro) só atingem 8,4 g se o colágeno fosse 100 % proteína. 9.450 mg → 8,60 g = 102,4 % do mínimo. **A folga é estreita**: um lote com proteína abaixo de 88,9 % fica abaixo do mínimo — por isso a alternativa de 12 g. Tudo depende do **laudo de proteína do lote em uso**, que não existe em disco (o certificado Lepuge do Peptan não doseia proteína; o do Verisol está vencido). Observação sobre alegação: "fonte de proteínas" (Anexo V) exige o perfil de aminoácidos essenciais do Anexo VII (triptofano 6 mg/g de proteína) — o colágeno não atende; cumprir o mínimo de quantidade não autoriza a alegação.
2. **Vitamina C: 1.100 → 200 mg** (200 % do VD, 10,4 % do teto) — redução dentro da faixa para abrir espaço ao colágeno (princípio 5: reduzir dose antes de mudar porção). Na alternativa de 12 g volta a 800 mg.
3. **Zinco: 0,29 mg de sal → 2,2 mg de zinco (11,06 mg de bisglicinato)** — a ficha entregava 0,058 mg (3,5 % do mínimo); o cadastro cravava o mínimo exato. 2,2 mg = 133 % do mínimo, 7,4 % do teto, 20 % do VD.
4. **Cúrcuma, café verde e laranja moro retirados** — cúrcuma sem laudo (princípio 7); café verde e laranja moro são secundários e não cabem com o colágeno em 10 g (princípio 5); nenhum dos três está na composição do cadastro (só na lista de ingredientes, que é a contradição apontada pela auditoria). Na alternativa de 12 g, café verde (50 mg = 32 mg de ácido clorogênico com o laudo IDNLABS 10269) e laranja moro (5 mg = 0,07 mg de antocianinas com o laudo 17624) podem voltar.
5. **Aditivos reduzidos** (ácido cítrico 150, aroma 100, SiO2 20, sucralose 15, corante 5) — todos quantum satis ou muito abaixo do limite; a fábrica valida o sabor.

## 5. Tabela nutricional (padrão RDC 429/2020 + IN 75/2020)

Energia (Atwater; kJ com 17/17/13 kJ/g — **PROVISÓRIOS**): proteína 8,5995 g × 4 = 34,40 kcal (× 17 = 146,19 kJ); maltodextrina 0,04793 g × 4 = 0,19 kcal (× 17 = 0,81); ácido cítrico 0,150 g × 3 = 0,45 kcal (× 13 = 1,95); total 35,04 → **35 kcal**; 148,96 → **149 kJ**; 35 ÷ 2.000 = 1,75 % → 2 %. Proteínas 8,5995 → **8,6 g** (8,5995 ÷ 50 = 17,2 % → 17 %) — **PROVISÓRIO** (depende do laudo). Carboidratos 0,048 g → 0 g (não significativo). Sódio: o colágeno hidrolisado pode conter sódio — **PENDENTE** de laudo; declarado 0 até lá. Vitamina C 200 ÷ 100 = 200 %. Zinco 2,20 ÷ 11 = 20 %.

```
INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 10 g (1 dose = 1 medida rasa, diluída em 200 mL de água)
                                 Quantidade por porção     %VD*
Valor energético                 35 kcal = 149 kJ          2 %
Carboidratos                     0 g                       0 %
  Açúcares totais                0 g                       0 %
  Açúcares adicionados           0 g                       0 %
Proteínas                        8,6 g                     17 %
Gorduras totais                  0 g                       0 %
  Gorduras saturadas             0 g                       0 %
  Gorduras trans                 0 g                       0 %
Fibras alimentares               0 g                       0 %
Sódio                            0 mg                      0 %
Vitamina C                       200 mg                    200 %
Zinco                            2,2 mg                    20 %
*Percentual de valores diários fornecidos pela porção
```

O colágeno hidrolisado é declarado na linha "Proteínas" (é o grupo do Anexo I em que está); não vai em linha de bioativo.

## 6. Lista de ingredientes proposta (ordem decrescente de massa)

Colágeno hidrolisado, ácido ascórbico (vitamina C), acidulante ácido cítrico (INS 330), aromatizante idêntico ao natural de limão, maltodextrina, antiumectante dióxido de silício (INS 551), edulcorante sucralose (INS 955), bisglicinato de zinco, corantes tartrazina (INS 102) e azul brilhante FCF (INS 133).

Alergênicos (RDC 26/2015): dependem da origem do colágeno do lote — bovino ou suíno: nenhum dos 17 alergênicos; peixe: **"Contém peixe"**. PENDENTE até a fábrica dizer qual colágeno está em produção. Glúten: não declarar "não contém" sem laudo da maltodextrina.

## 7. Advertências obrigatórias propostas

1. "Este produto não é um medicamento." (RDC 243/2018, art. 14, I, c)
2. "Público indicado: adultos (19 anos ou mais)." (art. 14, I, a)
3. "Não exceder a recomendação diária de consumo indicada na embalagem." (art. 14, I, d)
4. "Mantenha fora do alcance de crianças." (art. 14, I, e)
5. "Contém TARTRAZINA (INS 102)." — condicionada à confirmação do corante (base citada nos memoriais: RDC 340/2002, não relida nesta tarefa — PROVISÓRIO).
6. Conservação (art. 14, II): texto já gravado.

O Anexo VI **não exige** advertência para colágeno hidrolisado, vitamina C nem zinco. A frase "não deve ser consumido por gestantes, lactantes e crianças", que o banco traz hoje, deixa de ter base com a saída de café verde e laranja moro — retirar (ela só seria exigida se eles voltassem). Se o colágeno for de peixe, entra "Contém peixe" na lista de ingredientes.

## 8. Pendências e decisões do dono / RT

1. **Laudo de proteína do colágeno** do lote em uso (Kjeldahl ou N × 6,25) e origem animal. Sem ele, a linha "Proteínas" é PROVISÓRIA e o veredito não fecha.
2. **Porção:** 10 g (folga de 2,4 % sobre o mínimo, dependente do teor) ou 12 g (alternativa robusta, 25 doses, vitamina C 800 mg).
3. **Qual colágeno** está em produção (Verisol da ficha × Peptan do Nuviart) e laudo válido dele.
4. **Vitamina C:** aceitar 200 mg em 10 g ou 800 mg em 12 g.
5. **Corante e aroma:** identificação (INS) e confirmação do "Fresh Drink Limão".
6. **Maltodextrina:** laudo novo.
7. **Rótulo/cadastro:** alinhar a lista de ingredientes à composição; retirar a advertência de gestantes (sem base após a retirada dos extratos); não alegar "fonte de proteínas".

## 9. Veredito esperado após a reformulação

**CONFORME CONDICIONADO A** laudo de proteína do lote de colágeno em uso (e sua origem animal), decisão do dono sobre a porção (10 g com folga estreita ou 12 g), identificação do corante e laudo novo da maltodextrina. Fechados esses pontos, os três constituintes ficam em forma do Anexo I, dentro de [mínimo, máximo], a porção fecha em 10.000 mg e os dizeres obrigatórios estão no texto. Se o laudo mostrar proteína abaixo de 88,9 %, a porção de 10 g não sustenta o mínimo e a alternativa de 12 g passa a ser a única.

Arquivos gerados: `scratchpad/fase2/shot-colageno-300-gramas.json` (inclui a alternativa de 12 g) e `.sql` (SQL conferido com pglast, sem execução).
