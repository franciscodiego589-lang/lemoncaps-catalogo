# Memorial de reformulação — CREATINA EM GUMMY SABOR TUTTI-FRUTTI

**Data:** 16/09/2026. **Slug:** `creatina-em-gummy-sabor-tutti-frutti`. **Para:** dono e RT (Anderson C. Barbosa, CRF/MT 5526).

**Fontes lidas:** cadastro do banco ao vivo em 16/09/2026 (1 linha: creatina monoidratada 3.000 mg; `ingredients_list` e `warnings` **vazios**; `nutritional_info` = "3 g de creatina / Base da Gummy", sem massa de porção); auditoria de 15/09/2026, Parte II, item II.1 (100 % conforme **pelo cadastro**); `INGREDIENTES-E-ADVERTENCIAS-FALTANTES-2026-09-15.md`, seção 1 — Ordem de Produção "Creatina Astryx Tutti Frutti Gummy" (OP de 130 potes) e Ficha Técnica Resumida (150 potes), com a receita em percentuais do lote; memorial MEM-CALC-CREATGUMMY-rev02 (13/08/2026), que documenta **só o sabor frutas vermelhas** (a palavra "tutti" não aparece nele — confirmado no XML do `.docx` na fase 1); laudo da creatina lote 217949; IN 28/2018 Anexos I, III, IV, VI literais; IN 75/2020 e RDC 429/2020 (AnvisaLegis, 16/09/2026).

**Este produto não tem rótulo, memorial, ficha técnica Lemon Caps nem análise de produto acabado próprios.** O que existe é a mesma base de goma do sabor frutas vermelhas (`creatina-gummy-sabor-frutas-vermelhas`), com aroma e corante diferentes. Tudo que está no memorial de reformulação daquele slug — a inconsistência entre a receita e a porção de 6 g, as leituras A e B do teor, a tabela nutricional por 2 gomas, as advertências — vale aqui, e não é repetido linha a linha; abaixo está só o que é específico deste sabor e as decisões.

## 1. Identificação

| campo | atual | proposta |
|---|---|---|
| Nome | CREATINA EM GUMMY SABOR TUTTI-FRUTTI ("Suplemento Alimentar em goma") | mantido |
| Formato | goma mastigável | mantido |
| Porção | "2 gomas" (massa não declarada no cadastro; a irmã declara 6 g) | **2 gomas — massa PENDENTE de pesagem** |
| Porções por embalagem | 30 (60 gomas) | 30 (peso líquido a confirmar) |
| Grupo populacional | adultos, "> 19 anos" | mantido |

## 2. Antes

Fonte: **cadastro** (o dono é a fonte) e, para a base, a **OP do tutti-frutti** (percentuais do lote, marca de cliente "Astryx"): creatina monoidratada 34,703 %; sorbitol líquido 70 % 26,031 %; maltitol cristal 18,742 %; gelatina em pó 10,412 %; água purificada 4,810 %; glicerina vegetal 3,644 %; aroma tutti-frutti 0,783 %; ácido cítrico anidro 0,250 %; pectina cítrica ATM 0,208 %; citrato de sódio 0,208 %; sorbato de potássio 0,104 %; "corante rosa" 0,064 %; sucralose 0,040 % (soma 99,999 %).

| insumo | cadastro | ativo | mín | máx | auditoria 15/09 |
|---|---|---|---|---|---|
| creatina monoidratada | 3.000 mg | 3.000 mg | 3.000 mg | 5.000 mg | conforme pelo cadastro — **igual ao mínimo** |

**O mesmo problema de massa da irmã, visto pela OP** (calculado nesta reformulação): água do lote = 26,031 × 0,30 + 4,810 = 12,62 %; sólidos = 87,38 %; creatina = 34,703 ÷ 87,38 = **39,7 % dos sólidos**. Se a porção for de 2 gomas de 3,00 g totalmente secas (6.000 mg), a creatina seria no máximo **≈ 2.383 mg — abaixo do mínimo de 3.000 mg**; com 10 % de umidade residual, ≈ 2.144 mg. Para que 2 gomas tenham 3.000 mg de creatina com essa receita, elas precisam pesar cerca de 7,6 g secas (≈ 8,4 g com 10 % de umidade). Ou seja: a massa da porção e a creatina por porção não são conhecidas de verdade para este produto.

## 3. Depois

| # | constituinte (Anexo I) | insumo | massa por porção | teor e fonte | ativo (conta) | mín | máx | % do máx | linha do anexo | laudo | status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Creatina — "Creatina monohidratada" (CAS 6020-87-7) | creatina monoidratada | **3.500 mg** | 100,5 % b.s.; LOD 11,5 % — laudo lote 217949 (**replicado da irmã**: não há laudo ligado ao tutti-frutti) | A: 3.500 × 1,005 = **3.517,5 mg** · B: 3.500 × 0,885 × 1,005 = **3.112,9 mg** | 3.000 mg | 5.000 mg (IN 373/2025) | A 70,4 % · B 62,3 % | I·Creatina·Creatina monohidratada; III·Creatina; IV·Creatina | 217949 · 22/09/2028 · não | **dose ajustada** (3.000 → 3.500 mg) |

Excipientes (massas da irmã, **assumidas** para os itens estruturais; os itens de sabor ficam PENDENTES): sorbitol líquido 70 % (INS 420) 1.750 mg; maltitol (INS 965) 1.260 mg; gelatina 700 mg; água purificada 323,3 mg; glicerina vegetal (INS 422) 245 mg; ácido cítrico (INS 330) 168 mg; pectina cítrica (INS 440) 140 mg; citrato de sódio (INS 331) 14 mg; sorbato de potássio (INS 202) 7 mg; sucralose (INS 955) 2,67 mg; **aroma de tutti-frutti — massa PENDENTE** (OP: 0,783 % do lote); **corante "rosa" — nome técnico, INS, massa e laudo PENDENTES** (OP: 0,064 % do lote).

**Soma da porção:** 3.500 + 4.609,97 (sem aroma e corante) = **8.109,97 mg** de receita úmida; sólidos ≈ 7.262 mg + aroma + corante. **Não cabe em 6.000 mg** (`cabe = false`) — mesma situação da irmã.

## 4. Mudanças e motivos

1. **Creatina 3.000 → 3.500 mg** — acima do mínimo nas duas leituras do teor (ver memorial da irmã).
2. **`ingredients_list` e `warnings` preenchidos** — estavam vazios; o corante fica marcado entre colchetes porque "corante rosa" não é dizer de rotulagem (pode ser carmim, vermelho 40, ponceau ou mistura) e a lista não pode ir com lacuna para a arte.
3. **Massa da porção e peso líquido postos como PENDENTES** — o cadastro nem sequer declara a massa da porção.

## 5. Tabela nutricional (por 2 gomas)

Idêntica à da irmã (mesma base, mesmas massas assumidas), calculada com os fatores do Anexo XXII da IN 75/2020; o aroma e o corante do tutti-frutti, sem massa, não alteram energia nem macronutrientes de forma mensurável (na irmã somam 52 mg em 7.662 mg), mas a tabela só pode ir para a arte depois da receita própria.

```
INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 6 g (2 gomas)  [massa a confirmar por pesagem]
                                   6 g              %VD*
Valor energético                   9 kcal = 39 kJ   0 %
Carboidratos                       2,5 g            1 %
n Açúcares totais                  0 g
nn Açúcares adicionados            0 g              0 %
n Polióis totais                   2,5 g
nn Sorbitol                        1,2 g
nn Maltitol                        1,3 g
Proteínas                          0,7 g            1 %
Gorduras totais                    0 g              0 %
n Gorduras saturadas               0 g              0 %
n Gorduras trans                   0 g              0 %
Fibras alimentares                 0 g              0 %
Sódio                              0 mg             0 %
Creatina                           3.500 mg
*Percentual de valores diários fornecidos pela porção
```

Contas e regras: as mesmas do memorial de `creatina-gummy-sabor-frutas-vermelhas`, seção 5 (sorbitol 1,225 g × 2,6; maltitol 1,256 g × 2,1; proteína da gelatina 0,656 g × 4; ácido cítrico 0,168 g × 3; pectina 0,126 g × 2 = 9,20 kcal → 9 kcal = 39 kJ; glicerina não contada — decisão do RT).

## 6. Lista de ingredientes proposta

> Creatina monoidratada, sorbitol líquido, maltitol, gelatina (agente de textura), água purificada, glicerina vegetal (umectante), ácido cítrico (INS 330), pectina cítrica (espessante), aroma de tutti-frutti, citrato de sódio (INS 331), corante [nome técnico e INS PENDENTES — "corante rosa" na OP], conservador sorbato de potássio (INS 202) e edulcorante sucralose (INS 955).

Glúten: o ensaio MGW < 10 ppm existente é da amostra "Lemoncaps Creatina em Gummy" (lote G20/1556) **sem indicação de sabor** — para o tutti-frutti a frase "Não contém glúten" fica PENDENTE (Lei 10.674/2003 obriga uma das duas frases). Alergênicos: "Contém: peixe" só se a gelatina for de peixe (espécie PENDENTE).

## 7. Advertências (hoje vazias)

Art. 14 da RDC 243/2018 (literal): **"Este produto não é um medicamento."** · **"Não exceder a recomendação diária de consumo indicada na embalagem."** · **"Mantenha fora do alcance de crianças."** Grupo e uso: "Público indicado: adultos a partir de 19 anos" · "Consumir 2 gomas ao dia". Conservação.

Anexo VI da IN 28/2018 (Creatina): **"Este produto não deve ser consumido por gestantes, lactantes e crianças."** — faltava.

Polióis: "O consumo excessivo pode ter efeito laxativo (contém polióis)" — frase da fábrica; base legal a confirmar pelo RT.

## 8. Pendências e decisões

1. **Documentação própria do sabor**: memorial de cálculo, ficha técnica Lemon Caps e arte de rótulo do tutti-frutti (hoje só existem OP e ficha resumida de cliente).
2. **Aroma tutti-frutti e corante**: nome técnico, INS, massa por porção e laudos — sem isso a lista de ingredientes não pode ir para a arte.
3. **Pesar a goma acabada e dosear creatina/creatinina no produto acabado** deste sabor; **estudo de estabilidade**.
4. **Decisão do dono sobre a porção** (a receita não cabe em 6 g; ver irmã).
5. Decisão do RT: leitura A/B do teor.
6. Sorbato de potássio grau PA → alimentício; sorbitol: laudo do insumo líquido; gelatina: espécie.
7. `nutritional_info` do banco ("3 g de creatina / Base da Gummy") — substituído pela tabela acima, com a porção marcada como a confirmar.

## 9. Veredito esperado

**CONFORME NOS LIMITES (fórmula proposta) · NÃO RESOLVIDO na porção — CONDICIONADO A** pesagem da goma acabada, doseamento de creatina/creatinina no produto acabado, estudo de estabilidade **e** documentação própria do sabor tutti-frutti (aroma, corante, laudos, memorial). Sem a documentação do sabor, os números deste memorial são os da irmã, assumidos, e não podem ser tratados como definitivos.
