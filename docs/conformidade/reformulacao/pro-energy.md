# Memorial de reformulação — Pro Energy

**Slug:** `pro-energy` · **Data:** 16/09/2026 · **Fase 2 — reformulação regulatória do catálogo Lemon Caps**
**Fontes lidas:** Anexos I, III, IV, V e VI da IN 28/2018 (transcrições literais, consolidação até a IN 450/2026); auditoria de 15/09/2026 (seção 4.12); memorial de cálculo rev02 da fábrica (13/08/2026, `MEMORIAIS_2026 2/03_PRO-ENERGY/MEMORIAL-CALCULO-PRO-ENERGY-rev02.docx`, via `memoriais-formulacoes.json`, com a comparação contra a ficha técnica e as revisões de 27, 29 e 30/07); inventário de laudos de 16/09/2026; gabarito da tabela nutricional; cadastro do banco lido ao vivo em 16/09/2026.

Em cada número está dito se foi **lido**, **calculado** (com a conta) ou **assumido**.

---

## 1. Identificação

| campo | valor |
|---|---|
| Nome | Pro Energy (ficha técnica: "ESTIMULANTE SEXUAL 60 CÁPSULAS") |
| Formato | suplemento alimentar em cápsula gelatinosa dura tamanho 0 (98,45 mg vazia, memorial rev02) |
| Porção | 1 g (2 cápsulas) — **mantida** |
| Porções por embalagem | 30 (60 cápsulas; peso líquido 30 g) |
| Grupo populacional | adultos, coluna "> 19 anos" |
| Modo de uso (banco) | "Ingerir 2 cápsulas ao dia" |

## 2. Antes — composição atual e veredito da auditoria

Fonte: **memorial rev02 (13/08/2026)**. As massas coincidem com a arte do rótulo (ProEnergy.pdf), mas o memorial registra que o rótulo **troca os nomes** de dois insumos (imprime "extrato seco de semente de feno-grego" e "guaraná em pó", quando a fábrica pesa **pó** de feno-grego e **extrato seco** de guaraná a 22,35 %) e chama de "L-Aspartato de L-arginina" o que é cloridrato de L-arginina. O cadastro do banco tem as 8 linhas antigas (feno-grego em pó 250 mg, taurina 215 mg, guaraná em pó 200 mg, cafeína 140 mg, L-carnitina 90 mg, cloridrato de L-arginina 75 mg, zinco 20 mg, B6 10 mg); a migration 20260920000000 não foi aplicada (conferido ao vivo).

| # | insumo (memorial rev02) | massa | ativo (memorial) | veredito da auditoria de 15/09 |
|---|---|---|---|---|
| 1 | Feno-grego **pó** de semente (Santosflora, lote AUTO9IVT) | 250 mg | sem doseamento | NÃO VERIFICADO; **forma em uso não é a do Anexo I** |
| 2 | L-taurina (lote 214586, 99,46 %) | 200 mg | 198,92 mg | CONFORME (9,9 % do teto de 2.000 mg) |
| 3 | Guaraná **extrato seco 22 %** (Santosflora, lote AUTO9J1Q, 22,35 % de cafeína) | 200 mg | 44,70 mg de cafeína | NÃO VERIFICADO na auditoria (rótulo sem laudo); pelo memorial, **forma não listada no Anexo I** |
| 4 | Cafeína anidra (lote 214171, 99,88 %) | 150 mg | 149,82 mg | na faixa sozinha; **cafeína total 194,52 mg = 97 % do teto** (memorial), sem folga |
| 5 | L-carnitina base (lote 216523, 95,95 %) | 90 mg | 86,36 mg | CONFORME (4,3 % do teto) |
| 6 | L-arginina cloridrato (Lepuge, lote AUTO035918, 99,4 %) | 75 mg | 61,63 mg de arginina | CONFORME (1,6 % do teto) |
| 7 | Bisglicinato de zinco 20 % (Galena, lote 055-ZN/25) | 20 mg | 3,98 mg de zinco | CONFORME (13,4 % do teto) |
| 8 | Cloridrato de piridoxina (lote 91188) | 10 mg | 8,22 mg de B6 | CONFORME (8,3 % do teto); o rótulo declara "10 mg / 769 % VD" tratando o sal como vitamina |
| 9 | Dióxido de silício (INS 551) | 5 mg | antiumectante | CONFORME |

Soma do memorial: 1.000,00 mg (fecha). Veredito da auditoria: **NÃO VERIFICÁVEL** (cafeína total e feno-grego dependem de laudo); `warnings` com texto diferente do exigido pelo Anexo VI.

## 3. Depois — composição proposta

| constituinte (nome exato do Anexo I) | forma / insumo comercial | massa por porção | teor e fonte | ativo por porção | mín. | máx. (> 19) | % do máx. | linha do anexo | laudo | status |
|---|---|---|---|---|---|---|---|---|---|---|
| Taurina — "Taurina" (CAS 107-35-7) | L-taurina, lote 214586 | 200 mg | 99,5 % b.s. × (1 − 0,0004) = 99,46 % t.q. (**lido** no memorial) | 200 × 0,9946 = **198,92 mg** | NE | 2.000 mg | 9,9 % | III·Taurina / IV·Taurina | 214586 · validade não confirmada (scan) | **mantido** |
| Cafeína — "Guaraná em pó (Paullinia cupana)" | guaraná em pó (semente), *Paullinia cupana* Kunth, lote interno 25H26-B028-213428 (fabricante AUTO9J0E) | 200 mg | metilxantinas 5,11 % — **lido** no laudo (metilxantinas totais, não cafeína isolada) | cafeína **≤ 200 × 0,0511 = 10,22 mg** (limite superior, calculado) | (soma) | (soma) | — | III·Cafeína / IV·Cafeína | 25H26-B028-213428 · 28/04/2028 · não | **forma trocada** (extrato seco → pó) |
| Cafeína — "Cafeína/1,3,7-Trimethylxanthine" (CAS 58-08-2) | cafeína anidra, lote 214171 | 150 mg | 100,11 % b.a.; 99,88 % t.q. (**lido** no memorial) | 150 × 0,9988 = **149,82 mg** | 75 mg | 200 mg | 74,9 % (sozinha); **80,0 % no pior caso com o guaraná** (149,82 + 10,22 = 160,04 mg) | III·Cafeína / IV·Cafeína^vi | 214171 · 02/12/2029 (validade lida no memorial MC-PRD-PRETREINO-001 rev.01 da fábrica, mesmo lote; o PDF em disco é digitalização — fase 3) | **mantido** |
| L-Carnitina — "Levocarnitina/L-carnitina" (CAS 541-15-1) | L-carnitina base, lote 26H14-B025-226329 (a fase 2 citava o 216523 do memorial) | 90 mg | 99,41 % — laudo SM lido em texto; **harmonizado na fase 3** (16/09/2026): laudo válido mais recente, o mesmo do Focus Colina e do Pré-treino 420 g; o 216523 (95,95 % t.q.) só existe em digitalização não relida | 90 × 0,9941 = **89,47 mg** (fase 2: 86,36 mg) | NE | 2.000 mg | 4,5 % | III·L-Carnitina / IV·L-Carnitina | 26H14-B025-226329 · 20/05/2028 · não | **mantido** |
| Arginina — "Cloridrato de L-arginina" (CAS 1119-34-2) | L-arginina HCl, Lepuge, lote AUTO035918 | 75 mg | 99,4 % (**lido**) × 82,68 % (174,20 ÷ 210,70, estequiométrico) | 75 × 0,8268 × 0,994 = **61,64 mg de arginina** (o memorial escreve 61,63 por arredondamento intermediário) | NE | 3.810 mg | 1,6 % | III·Arginina / IV·Arginina | AUTO035918 · 12/11/2026 · não | **mantido; nome corrigido** |
| Zinco — "Bisglicinato de zinco" (CAS 14281-83-5) | zinco quelato 20 %, Galena, lote 055-ZN/25 | 20 mg | 20,00 % b.s. × (1 − 0,0054) = 19,89 % t.q. | 20 × 0,1989 = **3,98 mg** | 1,65 mg | 29,59 mg | 13,4 % | III·Zinco / IV·Zinco | 055-ZN/25 · 06/05/2027 · não | **mantido** |
| Vitamina B6 — "Cloridrato de piridoxina" (CAS 58-56-0) | piridoxina HCl, lote 91188 | 10 mg | 99,9 % (**lido**) × 82,27 % (169,18 ÷ 205,64) | 10 × 0,999 × 0,8227 = **8,22 mg** | 0,26 mg | 98,60 mg | 8,3 % | III·Vitamina B_6 / IV·Vitamina B_6 | 91188 · 28/12/2027 · não | **mantido; declaração corrigida** |
| Saponinas de glicosídeos de furostanol — "Extrato de semente de feno-grego (Trigonella foenum-graecum L.)" | (em uso: pó de semente) | (era 250 mg) | sem doseamento | — | NE | 450 mg | — | III·Saponinas… (NE) / IV·(450) | scan | **retirado** |

Ingredientes não constituintes:

| ingrediente | massa | papel | observação |
|---|---|---|---|
| Maltodextrina (q.s.p.) | **250 mg** (calculado: 1.000 − 750) | excipiente | **proposta** para manter as duas cápsulas tamanho 0 após a saída do feno-grego; a fábrica pode preferir ajustar a cápsula (decisão do dono) |
| Dióxido de silício (INS 551) | 5 mg | antiumectante | quantum satis, como no memorial |
| Cápsula: gelatina, água purificada, dióxido de titânio (INS 171) — o memorial cita também lauril sulfato de sódio | fora da porção | envoltório | confirmar a composição da cápsula com a fábrica |

**Soma da porção:** 200 + 200 + 150 + 90 + 75 + 20 + 10 + 5 = 750 mg; maltodextrina 250 mg; **total 1.000,00 mg (100,0 %) — cabe.**

**Cafeína total (Anexo IV, nota vi: dose individual até 200 mg):** 149,82 mg (cafeína anidra) + no máximo 10,22 mg (todas as metilxantinas do guaraná contadas como cafeína) = **160,04 mg = 80,0 % do teto**, e 213 % do mínimo de 75 mg. Com o extrato seco em uso hoje (22,35 %), o memorial chegava a 194,52 mg (97 % do teto).

## 4. Mudanças e motivos

1. **Guaraná: extrato seco → "Guaraná em pó (Paullinia cupana)".** O grupo Cafeína do Anexo I lista "Cafeína/1,3,7-Trimethylxanthine", "Café verde em pó", "Extrato fluido de guaraná" (IN 450/2026) e "Guaraná em pó (Paullinia cupana)". **"Extrato seco de guaraná" não consta** — e é o que a fábrica pesa (lote AUTO9J1Q, 22,35 % de cafeína). Existe em disco laudo válido de guaraná em pó de semente (lote interno 25H26-B028-213428, validade 28/04/2028, metilxantinas 5,11 %, taninos 4,12 %). A troca (i) põe o insumo numa forma do Anexo I, (ii) devolve folga à cafeína total (80 % do teto no pior caso, contra 97 %) e (iii) preserva o nome que o rótulo já imprime. Pendências: o laudo doseia metilxantinas totais, não cafeína — pedir laudo com cafeína específica para declarar a cafeína total exata; o documento não traz a razão social do fornecedor.
2. **Feno-grego retirado — por forma e por laudo.** A fábrica pesa pó de semente (o Anexo I só autoriza o extrato) e não há laudo de saponinas (princípio 7). Os extratos com laudo em disco foram rejeitados pelo parecer PAR-LAU-2026-001 por fabricante (exigência do painel que **não consta do Anexo I literal**; o RT decide). Volta com extrato + laudo + fornecedor aceito; dose que seria conforme: ≤ 405 mg de saponinas (ex.: 250 mg a 50 % = 125 mg, 28 % do teto), com a advertência do Anexo VI (IN 304/2024).
3. **Cafeína anidra mantida em 150 mg.** Sozinha fica em 74,9 % do teto; com o guaraná em pó, 80 % no pior caso — dentro do princípio "no máximo 90 % do teto". A redução para 140 mg que o memorial sugeria era resposta ao extrato seco; com a troca do guaraná não é mais necessária (mudar só o necessário).
4. **Arginina: nome corrigido** para "cloridrato de L-arginina" (insumo real, forma autorizada, CAS 1119-34-2). O rótulo imprime "L-Aspartato de L-arginina" (também autorizado, mas não é o que está na cápsula).
5. **Vitamina B6: declaração corrigida** para 8,22 mg (632 % do VD); o rótulo declara 10 mg / 769 % tratando a massa do cloridrato como vitamina.
6. **Taurina, L-carnitina e zinco mantidos** (todos longe do teto).
7. **Maltodextrina q.s.p. 250 mg** — decisão de excipiente da fábrica.

## 5. Tabela nutricional (padrão RDC 429/2020 + IN 75/2020)

Energia: só a maltodextrina é contabilizável (0,25 g × 4 = 1,0 kcal; × 17 = 4,25 → 4,3 kJ — fator kJ PROVISÓRIO); o guaraná em pó não tem composição centesimal em disco; taurina, carnitina e arginina livres não foram computadas como proteína (PROVISÓRIO — o RT confirma). 1,0 kcal ≤ 4 kcal → quantidade não significativa → %VD 0. Carboidratos 0,25 g → **0,3 g** (≤ 0,5 g → %VD 0). Vitamina B6 8,22 → **8,2 mg** (8,22 ÷ 1,3 = 632 %). Zinco 3,98 → **4,0 mg** (3,98 ÷ 11 = 36 %). Taurina 198,92 → 199 mg; cafeína 149,82 → 150 mg; L-carnitina 86,36 → 86 mg; arginina 61,64 → 62 mg. Taurina vai em linha própria (Anexo XI, item 10).

```
INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 1 g (2 cápsulas)
                                 Quantidade por porção     %VD*
Valor energético                 1 kcal = 4,3 kJ           0 %
Carboidratos                     0,3 g                     0 %
  Açúcares totais                0 g                       0 %
  Açúcares adicionados           0 g                       0 %
Proteínas                        0 g                       0 %
Gorduras totais                  0 g                       0 %
  Gorduras saturadas             0 g                       0 %
  Gorduras trans                 0 g                       0 %
Fibras alimentares               0 g                       0 %
Sódio                            0 mg                      0 %
Vitamina B6                      8,2 mg                    632 %
Zinco                            4,0 mg                    36 %
Taurina                          199 mg
Cafeína                          160 mg   (fase 3: cafeína TOTAL, anidra 149,82 + guaraná ≤ 10,22 mg — PROVISÓRIO até o laudo de cafeína do guaraná; a fase 2 declarava só a anidra, 150 mg)
L-carnitina                      89 mg    (fase 3: 89,47 mg com o lote 26H14-B025-226329; a fase 2 declarava 86 mg)
Arginina                         62 mg
*Percentual de valores diários fornecidos pela porção
```

A linha "Cafeína" declara a cafeína da cafeína anidra; a parcela do guaraná (≤ 10,22 mg) entra quando houver laudo de cafeína específica — até lá, a declaração é a do insumo doseado e a pendência fica registrada.

## 6. Lista de ingredientes proposta (ordem decrescente de massa)

Maltodextrina, guaraná em pó (*Paullinia cupana* Kunth, semente), taurina, cafeína anidra, L-carnitina, cloridrato de L-arginina, bisglicinato de zinco, cloridrato de piridoxina, antiumectante dióxido de silício (INS 551); cápsula: gelatina, água purificada e corante dióxido de titânio (INS 171).

Alergênicos (RDC 26/2015): nenhum. Glúten: não declarar "não contém" sem laudo da maltodextrina.

## 7. Advertências obrigatórias propostas

1. "Este produto não é um medicamento." (RDC 243/2018, art. 14, I, c)
2. "Público indicado: adultos (19 anos ou mais)." (art. 14, I, a)
3. "Não exceder a recomendação diária de consumo indicada na embalagem." (art. 14, I, d)
4. "Mantenha fora do alcance de crianças." (art. 14, I, e)
5. "Este produto não deve ser consumido por gestantes, lactantes e crianças." — Anexo VI da IN 28/2018, primeira linha da tabela: Aminoácidos (taurina, arginina), Carnitina e Cafeína. **Hoje o banco traz "CONTÉM CAFEÍNA. NÃO RECOMENDADO PARA GESTANTES, LACTANTES, CRIANÇAS E PESSOAS SENSÍVEIS À CAFEÍNA." — texto diferente do exigido; substituir pelo literal.**
6. Conservação (art. 14, II): texto já gravado.

Deixa de ser exigida a advertência das saponinas (IN 304/2024), porque o feno-grego sai.

## 8. Pendências e decisões do dono / RT

1. **Guaraná em pó:** confirmar a compra do lote 25H26-B028-213428 (ou outro guaraná em pó de semente com laudo), pedir laudo com cafeína específica e identificar o fornecedor.
2. **Laudos em digitalização não lida** (cafeína anidra 214171, taurina 214586, L-carnitina 216523): obter cópia legível com validade, ou usar os lotes alternativos válidos listados no JSON.
3. **Fábrica:** excipiente q.s.p. 250 mg ou ajuste de cápsula; confirmar a composição da cápsula (o memorial cita lauril sulfato de sódio); refazer o memorial.
4. **Rótulo:** nome do insumo de arginina, vitamina B6 8,22 mg, frase do Anexo VI no texto literal.
5. **Feno-grego:** só volta com extrato de semente + laudo de saponinas + fornecedor aceito pelo RT.

## 9. Veredito esperado após a reformulação

**CONFORME CONDICIONADO A** laudo de cafeína específica e identificação do fornecedor do guaraná em pó, cópias legíveis/válidas dos laudos de cafeína anidra, taurina e L-carnitina, e definição do excipiente. Com isso, todos os constituintes ficam em forma do Anexo I, dentro de [mínimo, máximo] com folga (cafeína total no pior caso 80 % do teto; os demais abaixo de 14 %), a porção fecha em 1.000 mg e a advertência do Anexo VI passa ao texto literal.

Arquivos gerados: `scratchpad/fase2/pro-energy.json` e `.sql` (SQL conferido com pglast, sem execução).
