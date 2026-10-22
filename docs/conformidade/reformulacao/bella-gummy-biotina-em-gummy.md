# Memorial de reformulação — BELLA GUMMY (Biotina em Gummy)

**Data:** 16/09/2026. **Slug:** `bella-gummy-biotina-em-gummy`. **Para:** dono e RT (Anderson C. Barbosa, CRF/MT 5526).

**Fontes lidas nesta reformulação (todas em disco, com data):** memorial de cálculo da fábrica MEM-CALC-BIOGUMMY-rev02 (13/08/2026), extraído do `.docx` original em 16/09/2026; rótulo lido em `composicoes_rotulo.json`, chave `biogummy` (BioGummy.pdf, extração de 13/09/2026); cadastro do banco lido ao vivo pela chave pública em 16/09/2026 (5 linhas ativas); auditoria de 15/09/2026 (seção 4.1, 100 % conforme); IN 28/2018 consolidada até a IN 450/2026, Anexos I, III, IV e VI, nos arquivos literais `IN28-2018-ANEXO-*-LITERAL.md` (lidos 16/09/2026); IN 75/2020 e RDC 429/2020 consolidadas, baixadas do AnvisaLegis em 16/09/2026 às 08:40 (UTC−4) para os Anexos III (arredondamento), IV (não significativo), VIII (VDR por grupo), XI (ordem) e XXII (energia); laudos em `laudos.json` (16/09/2026). Convenção: **lido** = copiado da fonte; **calculado** = conta mostrada; **assumido** = marcado.

## 1. Identificação

| campo | valor | procedência |
|---|---|---|
| Nome | BELLA GUMMY (Biotina em Gummy) — no memorial da fábrica, "BIOGUMMY" | banco / memorial |
| Formato | goma mastigável ("Suplemento Alimentar em goma", RDC 243 Art. 12) | memorial |
| Porção | 6 g (2 gomas de 3,00 g) — mantida | rótulo e memorial (180 g ÷ 60 gomas) |
| Porções por embalagem | 30 (60 gomas, 180 g) | rótulo e memorial |
| Público / grupo populacional | adultos, coluna "> 19 anos" dos Anexos III e IV | banco (`target_audience`) e memorial |

## 2. Antes — composição atual e veredito da auditoria

Fonte da composição: **rótulo** (= cadastro do banco, 5 de 5 linhas iguais). Veredito da auditoria de 15/09/2026: 100 % CONFORME, com a observação "biotina exatamente no teto".

| insumo (como no rótulo) | declarado | ativo considerado | mín | máx | auditoria 15/09 |
|---|---|---|---|---|---|
| Vitamina C (ácido ascórbico) | 45 mg | 45 mg | 13,5 mg | 1.916,02 mg | conforme |
| Vitamina E (DL-alfa-tocoferol) | 16,7 mg (111 % VD) | **o rótulo trata 16,7 mg como ativo; o memorial mostra que 16,70 mg é a massa do insumo "vitamina E pó 50 %", que entrega 5,68 mg de α-TE** | 2,25 mg | 1.000 mg | conforme nas duas leituras |
| Zinco (bisglicinato de zinco) 12 mg | 12 mg de sal = 2,4 mg de zinco | 2,4 mg | 1,65 mg | 29,59 mg | conforme |
| Vitamina A (acetato de retinol) | 1.020 mcg | 1.020 µg RAE | 135 µg | 2.623,61 µg | conforme |
| Biotina (D-biotina) | 45 mcg | 45 µg | 4,5 µg | 45 µg | conforme — **igual ao máximo** |

O que o memorial da fábrica acrescenta ao que o rótulo mostra (lido em 16/09/2026 no `.docx`): a Tabela 4 do próprio memorial aponta que "vitamina A (acetato de retinol) 1.020 mcg" e "vitamina E (DL-alfa-tocoferol) 16,7 mg" estão declaradas na composição como valores de nutriente, quando 16,70 mg é massa de insumo e o %VD da vitamina E "precisa ser recalculado de 111 % para 38 %". A Tabela 15 recomenda reduzir a biotina de 45 para 40 µg para criar margem de 11 %. A Tabela 8 fecha a porção como 79,97 mg de ativos + 5.920,03 mg de "matriz de goma (polióis, gelatina, água, pectina e goma acácia) — q.s.p." = 6.000,00 mg — **sem massa individual de nenhum excipiente**.

## 3. Depois — composição proposta, insumo a insumo

Grupo populacional: "> 19 anos". Todos os limites lidos nos Anexos III e IV literais (16/09/2026).

| # | constituinte (nome exato do Anexo I) | insumo comercial | massa do insumo por porção | teor e fonte | ativo por porção (conta) | mín | máx | % do máx | linha do anexo | laudo (lote · validade · vencido?) | status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Vitamina C — "Ácido ascórbico/Ácido L-ascórbico" (CAS 50-81-7) | ácido ascórbico 99 % | 45,23 mg | 99,5 % — laudo | 45,23 × 0,995 = **45,00 mg** | 13,5 mg | 1.916,02 mg | 2,3 % | I·Vitamina C; III·Vitamina C; IV·Vitamina C | 950467 · 05/03/2029 · não | mantido |
| 2 | Vitamina E — "Acetato de DL-alfa-tocoferol/Acetato de racealfatocoferol/Acetato de DL-alfatocoferila" (CAS 7695-91-2) | vitamina E pó 50 % (acetato de DL-alfa-tocoferila) | 16,70 mg | 50,7 % de acetato — laudo | 16,70 × 0,507 = 8,467 mg de acetato; × 0,67 = **5,673 mg de α-TE** (nota v do Anexo III da IN 28: "1 UI de vitamina E como 1 mg de acetato de rac-α-tocoferil", com atividade 0,67 × RRR; a IN 75, Anexo XXIII, dá o mesmo resultado por outro caminho: 1 mg de α-tocoferol = 1,49 UI → 8,467 ÷ 1,49 = 5,68 mg) | 2,25 mg | 1.000 mg | 0,6 % | I·Vitamina E; III·Vitamina E^v; IV·Vitamina E^iii | 91320 · 05/04/2028 · não | mantido; **declaração corrigida** (o rótulo dizia 16,7 mg) |
| 3 | Zinco — "Bisglicinato de zinco" (CAS 14281-83-5) | bisglicinato de zinco 20 % | 12,00 mg | 20,00 % de Zn em base seca — laudo; 19,89 % tal qual pelo critério do RT (umidade descontada, seção 6 do memorial) | 12,00 × 0,1989 = **2,387 mg de zinco** | 1,65 mg | 29,59 mg | 8,1 % | I·Zinco; III·Zinco; IV·Zinco | 055-ZN/25 (Galena) · 06/05/2027 · não — resultado 20,00 % está no piso da especificação 20–23 % | mantido |
| 4 | Vitamina A — "Acetato de retinol/Acetato de retinila" (CAS 127-47-9) | acetato de retinol pó | 5,99 mg | 568.116 UI/g — **lido no memorial; o laudo do lote 215230 existe só em digitalização e não foi conferido nesta rodada** | 5,99 mg × 568.116 UI/g ÷ 1.000 = 3.403 UI; ÷ 3,33 UI/µg RAE (IN 75, Anexo XXIII) = **1.022 µg RAE** (o memorial usa × 0,3 e chega a 1.020,9 µg) | 135 µg | 2.623,61 µg | 39,0 % | I·Vitamina A; III·Vitamina A^ii; IV·Vitamina A^i (vitamina A pré-formada) | 215230 · PENDENTE · ? | mantido |
| 5 | Biotina — "D-biotina" (CAS 58-85-5) | D-biotina | **0,040 mg** (era 0,046 mg) | 100,0 % — laudo do lote fisicamente anexado (Analitic, lote interno 91457, lote do fabricante BN25121020). O memorial usava 97,69 % e citava o lote 25030042 — nenhum dos dois consta desse laudo | 0,040 × 1,000 = **0,0400 mg = 40,0 µg** | 4,5 µg | 45 µg | **88,9 %** | I·Biotina; III·Biotina; IV·Biotina | 91457 · 19/12/2028 · não | **dose ajustada** (45 → 40 µg) |

**Soma da porção:** ativos 45,23 + 16,70 + 12,00 + 5,99 + 0,040 = **79,96 mg**; matriz de goma q.s.p. = 6.000,00 − 79,96 = **5.920,04 mg**; total **6.000,00 mg de 6.000 mg (100 %)** — a matriz cabe por definição (q.s.p.), mas suas massas individuais (sorbitol líquido 70 %, maltitol, gelatina, água, glicerina, maltodextrina, pectina, goma acácia, ácido cítrico, citrato de sódio, aroma, corante, sorbato, sucralose) **não constam do memorial** e ficam PENDENTES.

## 4. Mudanças e motivos

1. **Biotina 45 → 40 µg** (massa do insumo 0,046 → 0,040 mg). Motivo: 45 µg é o teto exato do Anexo IV ("limites máximos que não podem ser ultrapassados"); qualquer variação de lote ou pesagem ultrapassa. 40 µg = 88,9 % do teto e 133 % do VD. O memorial rev02 (Tabela 15) já propunha isso.
2. **Biotina — laudo de referência trocado para o que está anexado** (91457/BN25121020, 100,0 %, válido até 19/12/2028). O memorial cita lote e teor que não existem no documento anexado; a conta passa a usar o laudo real.
3. **Vitamina E — só a declaração muda**: a massa pesada (16,70 mg do pó 50 %) continua; o rótulo e a linha de composição passam a declarar o ativo, 5,68 mg de α-tocoferol (38 % VD), e não "16,7 mg (111 % VD)". Sem isso o rótulo declara quase três vezes a vitamina E que a goma tem.
4. **Vitamina A — declaração mantida em µg RAE** (1.020–1.022 µg conforme o fator usado; os dois arredondam para 128 % VD). O laudo do lote precisa ser conferido visualmente (é digitalização).
5. Nada mais muda: vitamina C, zinco e a matriz ficam como a fábrica pesa hoje. Nenhum insumo tinha forma fora do Anexo I.

## 5. Tabela nutricional (padrão RDC 429/2020 + IN 75/2020)

Regras aplicadas: ordem e indentação do Anexo XI da IN 75 (vitaminas na ordem A, D, E, K, C, B1…B12; biotina com o nome "Vitamina B7", alternativo "Biotina"); arredondamento do Anexo III; quantidade não significativa do Anexo IV (por porção, para suplementos); %VD pela coluna "≥ 19 anos" do Anexo VIII (vitamina A 800 µg; E 15 mg; C 100 mg; B7 30 µg; zinco 11 mg), calculado sobre a quantidade arredondada (RDC 429, Art. 12) e em número inteiro (Art. 7 § 1º); nutriente sem VDR com célula vazia (Art. 12 § 1º). Cabeçalhos de coluna conforme o Anexo XII: a coluna de quantidade leva a massa da porção ("6 g"), não "Quantidade por porção".

```
INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 6 g (2 gomas)
                                   6 g        %VD*
Valor energético                   PENDENTE
Carboidratos                       PENDENTE
n Açúcares totais                  PENDENTE
nn Açúcares adicionados            PENDENTE
n Polióis totais                   PENDENTE
Proteínas                          PENDENTE
Gorduras totais                    0 g        0 %
n Gorduras saturadas               0 g        0 %
n Gorduras trans                   0 g        0 %
Fibras alimentares                 PENDENTE
Sódio                              PENDENTE
Vitamina A                         1.022 µg   128 %
Vitamina E                         5,7 mg     38 %
Vitamina C                         45 mg      45 %
Vitamina B7                        40 µg      133 %
Zinco                              2,4 mg     22 %
*Percentual de valores diários fornecidos pela porção
```

Contas: vitamina A 1.021,9 → 1.022 (≥ 10: inteiro); 1.022 ÷ 800 = 127,75 → 128 %. Vitamina E 5,673 → 5,7 (entre 1 e 10: uma casa; 2ª casa 7 ≥ 5 arredonda para cima); 5,7 ÷ 15 = 38,0 → 38 %. Vitamina C 45,00 → 45; 45 %. Biotina 40,0 → 40; 40 ÷ 30 = 133,3 → 133 %. Zinco 2,387 → 2,4; 2,4 ÷ 11 = 21,8 → 22 %.

**Por que as linhas de energia e macronutrientes ficam PENDENTES, e não com os números do rótulo:** o memorial não traz a massa de nenhum excipiente — só o q.s.p. da matriz. Sem sorbitol, maltitol (polióis, 2,6 e 2,1 kcal/g pelo Anexo XXII), gelatina (proteína) e citrato de sódio (sódio), o valor energético, os carboidratos, os polióis, as proteínas, as fibras (pectina e goma acácia) e o sódio não são recalculáveis. O rótulo atual imprime 12 kcal = 50 kJ, 4,8 g de carboidratos (3,4 g de polióis), 0,6 g de proteínas, 0 g de gorduras e 8 mg de sódio; esses números **não puderam ser verificados** e não devem ser copiados como se tivessem sido. A maltodextrina da base ainda cria uma linha de açúcares adicionados a calcular (RDC 429, Art. 3º, I: a fração de mono e dissacarídeos das maltodextrinas conta como açúcar adicionado).

## 6. Lista de ingredientes proposta

Ordem decrescente de massa **conforme o memorial e o rótulo atual** (as massas dos excipientes não foram fornecidas, então a ordem entre eles é a do rótulo, não recalculada):

> Sorbitol líquido 70 %, maltitol, gelatina, água purificada, glicerina vegetal, maltodextrina, pectina cítrica, goma acácia, ácido cítrico (INS 330), citrato de sódio (INS 331), aroma de frutas vermelhas, vitamina C (ácido ascórbico), vitamina E (acetato de DL-alfa-tocoferila), zinco (bisglicinato de zinco), vitamina A (acetato de retinol), biotina (D-biotina), corante vermelho ponceau 4R (INS 124), conservador sorbato de potássio (INS 202) e edulcorante sucralose (INS 955).

Correções em relação ao rótulo: "vitamina E (DL-alfa-tocoferol)" vira "vitamina E (acetato de DL-alfa-tocoferila)" — é o insumo que a fábrica pesa e a forma do Anexo I; "corante vermelho ponceau" ganha o "4R" do laudo.

Alergênicos e glúten: "Contém: peixe" **só se** a gelatina (lote 214196) for de peixe — o laudo diz "Origem: Brasil", que é país, não espécie (PENDENTE). Sulfitos: a maltodextrina traz 6,27 ppm de SO2; a declaração é obrigatória se o produto final atingir 10 mg/kg — o cálculo depende da massa da maltodextrina (PENDENTE). Glúten: a Lei 10.674/2003, Art. 1º (texto lido no Planalto em 16/09/2026), obriga "Contém Glúten" ou "Não contém Glúten" em todo alimento industrializado; não há ensaio de glúten deste produto (os ensaios MGW < 10 ppm são da Creatina Gummy e da Melatonina Gummy) — "Não contém glúten" só com laudo ou declaração formal do RT.

## 7. Advertências obrigatórias propostas

Do Art. 14, I, "c", "d" e "e" da RDC 243/2018 (literal, em destaque e negrito): **"Este produto não é um medicamento."** · **"Não exceder a recomendação diária de consumo indicada na embalagem."** · **"Mantenha fora do alcance de crianças."** Do Art. 14, I, "a" e "b": grupo populacional ("adultos a partir de 19 anos") e quantidade/frequência ("2 gomas ao dia"). Do inciso II: conservação, inclusive depois de aberta.

Do Anexo VI da IN 28/2018: **nenhuma advertência é exigida** — vitaminas e minerais não constam da lista do Anexo VI. A frase "Não deve ser consumido por gestantes, lactantes e crianças", que está hoje no cadastro e no memorial, não é obrigatória para este produto; manter ou retirar é decisão do RT.

Frase dos polióis ("O consumo excessivo pode ter efeito laxativo (contém polióis)"): a fábrica a usa nas fichas da linha; a base legal não foi conferida nesta sessão — PENDENTE de confirmação pelo RT.

O que falta hoje no cadastro: nada obrigatório falta; o que existe a mais (gestantes/lactantes) fica registrado acima.

## 8. Pendências e decisões do dono/RT

1. **Massas dos excipientes da matriz** (a fábrica tem, o memorial não mostra) — sem elas a tabela nutricional não fecha.
2. **Laudo do acetato de retinol lote 215230** — conferir visualmente (potência 568.116 UI/g lida só do memorial).
3. **Corrigir o memorial da biotina** para o laudo real (91457/BN25121020, 100,0 %) e apagar a referência ao lote 25030042.
4. **Nova arte de rótulo**: vitamina E 5,7 mg (38 % VD), biotina 40 µg (133 % VD), designação "Suplemento Alimentar em goma", retirar "PELE · CABELO · UNHA" (não é redação do Anexo V, como o memorial já apontou).
5. **Laudos da base a renovar ou trocar**: aroma de frutas vermelhas (lote 25051287 vencido em 21/05/2026 e laudo de pó para insumo líquido); maltodextrina (lote 210170 vencido em 26/07/2026); sorbitol (laudo de pó, insumo líquido 70 %); goma acácia (lote 105226, pH 2,84 fora de 4–5, sem conclusão); sorbato de potássio grau PA (há laudo válido de grau alimentício em disco: Analitic lote 91202, 100,30 %, válido até 05/01/2028).
6. **Gelatina** — espécie animal (alergênico se peixe; certificado BSE se bovina).
7. **Glúten** — ensaio do produto ou declaração do RT.
8. Decisão do RT sobre a frase de gestantes/lactantes (não exigida) e sobre a frase dos polióis.

## 9. Veredito esperado

**CONFORME CONDICIONADO A**: laudo da vitamina A (lote 215230) conferido; massas da matriz de goma fornecidas para fechar energia, carboidratos, polióis, proteínas, fibras e sódio; laudos vencidos/errados da base renovados. Nos limites da IN 28/2018 a fórmula proposta está conforme em todos os cinco constituintes, todos abaixo de 90 % do teto (o maior é a biotina, 88,9 %).
