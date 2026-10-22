# Memorial de reformulação — Emagrecedor em Cápsula

**Slug:** `emagrecedor-em-capsula` · **Data:** 16/09/2026 · **Fase 2 — reformulação regulatória do catálogo Lemon Caps**
**Fontes lidas:** Anexos I, III, IV, V e VI da IN 28/2018 (transcrições literais, consolidação até a IN 450/2026); auditoria de 15/09/2026 (Parte II, seção II.3); ficha técnica simples da fábrica (`FICHA TÉCINICA EMAGRECIMENTO EM CÁPSULAS LEMON CAPS .docx`, sem data nem revisão, modificada em 01/04/2026, via `memoriais-formulacoes.json`); inventário de laudos de 16/09/2026; gabarito da tabela nutricional; cadastro do banco lido ao vivo em 16/09/2026.

Em cada número está dito se foi **lido**, **calculado** (com a conta) ou **assumido**. Este produto **não tem memorial de cálculo**: o que existe é uma ficha nominal sem lote, laudo ou teor. Por isso a proposta abaixo é uma **reconstrução** feita só com insumos que (a) têm forma nomeada no Anexo I, (b) têm laudo válido em disco e (c) cabem em 1 g — exatamente como a ordem pedia, com a alternativa "NÃO RESOLVIDO" descartada porque a reconstrução fecha.

---

## 1. Identificação

| campo | valor |
|---|---|
| Nome | Emagrecedor Em Cápsula (ficha técnica: "Emagrecimento em Cápsula") |
| Formato | suplemento alimentar em cápsula — tamanho e composição da cápsula **não constam** de nenhum documento |
| Porção | 1 g (2 cápsulas) — **mantida** |
| Porções por embalagem | 30 (60 cápsulas) |
| Grupo populacional | adultos, coluna "> 19 anos" |
| Modo de uso (banco) | "Ingerir 1 dose ao dia, aproximadamente 30 minutos antes das principais refeições" |

## 2. Antes — composição atual e veredito da auditoria

Duas fontes, contraditórias entre si:

- **Cadastro do banco**: **1 linha** — "picolinato de Cromo 250 mcg" — para uma porção de 1 g; a `ingredients_list` do mesmo cadastro declara 12 ingredientes (spirulina, psyllium, cúrcuma, quitosana, inulina, vitamina C, vitamina A, guaraná em pó, picolinato de cromo, laranja moro, extrato seco de feno-grego, extrato de café verde), 11 deles sem quantidade.
- **Ficha técnica** (única com timbre e RT da Lemoncaps): 11 insumos nominais, 846,75 mg, sem lote, laudo nem teor — e **sem vitamina C**.

| # | insumo (ficha técnica) | massa nominal | veredito |
|---|---|---|---|
| 1 | Spirulina (*Arthrospira platensis*) | 110 mg | Proteínas: 1,3 % do mínimo de 8,4 g — inviável em cápsula |
| 2 | Psyllium (*Plantago ovata*) | 60 mg | Fibras: 1,1 % do mínimo de 5,7 g |
| 3 | Cúrcuma (extrato seco do rizoma) | 120 mg | sem teor de curcuminoides; os extratos com laudo em disco entregam 0,4–0,6 % |
| 4 | Vitamina A (acetato de retinila) "1500 mcg" | 1,5 mg de insumo | massa do insumo incompatível com a dose declarada (1,5 mg de acetato a 568.116 UI/g entregam ~256 µg RAE) |
| 5 | Guaraná (*Paullinia cupana*, pó da semente) | 100 mg | forma autorizada; como única fonte de cafeína fica abaixo do mínimo de 75 mg |
| 6 | Quitosana | 110 mg | Fibras: abaixo do mínimo; alergênico de crustáceos |
| 7 | Inulina | 40 mg | Fibras: abaixo do mínimo |
| 8 | Cromo (picolinato) "250 mcg" | 0,25 mg | ambíguo (se massa do sal: 31 µg de Cr; se elemento: teto exato de 250 µg) |
| 9 | Laranja moro (extrato padronizado) | 5 mg | sem teor; laudo válido em disco (17624: 1,47 %) |
| 10 | Feno-grego (extrato seco da semente) | 200 mg | sem laudo de saponinas; extratos com laudo rejeitados pelo parecer interno |
| 11 | Café verde (extrato "35 %") | 100 mg | teor nominal do nome comercial, não de laudo; laudo válido em disco (10269: 64,05 %) |

Veredito da auditoria de 15/09: **NÃO VERIFICÁVEL — o cadastro não descreve a composição.** A memória do projeto registra que o dono já havia removido psyllium, espirulina e cúrcuma deste produto por não atingirem o mínimo.

## 3. Depois — composição proposta (reconstruída)

| constituinte (nome exato do Anexo I) | forma / insumo comercial | massa por porção | teor e fonte | ativo por porção | mín. | máx. (> 19) | % do máx. | linha do anexo | laudo | status |
|---|---|---|---|---|---|---|---|---|---|---|
| Ácido clorogênico — "Extrato de café verde" (IN 102/2021) | café verde solúvel IDNLABS, lote 10269 | 100 mg | 64,05 % — **lido** no laudo 10269; metilxantinas 1,56 % | 100 × 0,6405 = **64,05 mg** | NE | 400 mg | 16,0 % | III·Ácido clorogênico (NE) / IV·(400) | 10269 · 08/2027 · não | **mantido, com laudo** |
| Antocianinas da laranja moro — "Extrato de laranja moro (Citrus sinensis (L.) Osbeck)" | extrato de laranja Moro, AllPremium, lote 17624 | 5 mg | 1,47 % — **lido** no laudo 17624 | 5 × 0,0147 = **0,07 mg** | NE | 5 mg | 1,5 % | III/IV·Antocianinas da laranja moro | 17624 · 09/04/2027 · não | **mantido, com laudo** |
| Cromo — "Picolinato de cromo" (CAS 14639-25-9) | picolinato de cromo, Analitic, lote 91190 | **1,62 mg** | 12,34 % de Cr — **lido** | 200 ÷ 0,1234 = 1,62 mg; 1,62 × 0,1234 = **199,9 µg** | 5,25 µg | 250 µg | 80,0 % | III·Cromo / IV·Cromo | 91190 · 24/12/2027 · não | **dose ajustada** (250 → 200 µg) |
| Vitamina A — "Acetato de retinol/Acetato de retinila" (CAS 127-47-9) | vitamina A acetato pó 568.116 UI/g, lote 215230 | **8,80 mg** | 568.116 UI/g — **lido** no memorial do Moro Slim/Floravex (mesmo lote) | 8,80 mg × 568.116 UI/g = 4.999,4 UI × 0,3 = **1.499,8 µg RAE** | 135 µg | 2.623,61 µg | 57,2 % | III·Vitamina A^ii / IV·Vitamina A^i | 215230 · validade não confirmada (scan) | **mantido; massa do insumo corrigida** (1,5 → 8,80 mg) |
| Proteínas — "Espirulina" | — | (era 110 mg) | — | — | 8,4 g | NE | — | III·Proteínas | — | **retirado** |
| Fibras — "Psyllium", "Quitosana", "Inulina" | — | (eram 60 + 110 + 40 mg) | — | — | 5,7 g | NE | — | III·Fibras alimentares | — | **retirados** |
| Curcumina — "Extrato de rizomas de cúrcuma" | — | (era 120 mg) | sem laudo | — | 80 mg | 130 mg | — | III/IV·Curcumina | — | **retirado** |
| Cafeína — "Guaraná em pó (Paullinia cupana)" | guaraná em pó, lote 25H26-B028-213428 (laudo válido) | (era 100 mg) | metilxantinas 5,11 % (**lido**) | cafeína ≤ 5,11 mg | 75 mg | 200 mg | — | III·Cafeína / IV·Cafeína | 28/04/2028 · não | **retirado** (abaixo do mínimo como única fonte de cafeína) |
| Saponinas — "Extrato de semente de feno-grego" | — | (era 200 mg) | sem laudo | — | NE | 450 mg | — | III/IV·Saponinas de glicosídeos de furostanol | — | **retirado** |

Ingredientes não constituintes:

| ingrediente | massa | papel | observação |
|---|---|---|---|
| Maltodextrina (q.s.p.) | **879,58 mg** (calculado: 1.000 − 120,42) | excipiente | **proposta** para manter 2 cápsulas de 1 g; com 120 mg de insumos, a fábrica pode preferir uma cápsula pequena por dia (decisão do dono) |
| Dióxido de silício (INS 551) | 5 mg | antiumectante | quantum satis (a ficha o cita sem massa) |
| Cápsula | fora da porção | envoltório | composição a confirmar com a fábrica |

**Soma da porção:** 100 + 5 + 1,62 + 8,80 + 5 = 120,42 mg; maltodextrina 879,58 mg; **total 1.000,00 mg (100,0 %) — cabe.**

## 4. Mudanças e motivos

1. **Espirulina, psyllium, quitosana e inulina retirados** — Anexo III: proteínas 8,4 g e fibras 5,7 g; nenhum chega perto em cápsula (princípio 6; o dono já havia removido três deles). Com a quitosana sai a declaração "contém derivados de crustáceos".
2. **Cúrcuma retirada** — sem laudo de curcuminoides (princípio 7); os extratos com laudo em disco ou entregam 0,4–0,6 % (inatingível) ou foram rejeitados pelo parecer interno. Volta com extrato padronizado (105,3 mg a 95 % = 100 mg, 77 % do teto) e a advertência da IN 438/2026.
3. **Feno-grego retirado** — sem laudo de saponinas; os extratos com laudo em disco foram rejeitados pelo parecer PAR-LAU-2026-001 por fabricante (exigência que **não consta do Anexo I literal** — o RT decide). Dose conforme se voltar: ≤ 405 mg de saponinas.
4. **Guaraná em pó retirado** — a forma é autorizada e há laudo válido, mas o guaraná está no Anexo I como fonte de **Cafeína**, cujo mínimo é 75 mg (Anexo III); 100 mg de pó entregam no máximo 5,11 mg (metilxantinas). Só volta se o produto ganhar cafeína anidra (cafeína total entre 75 e 180 mg) — isso muda o conceito e é decisão do dono.
5. **Café verde mantido, agora com laudo** — 64,05 mg de ácido clorogênico (16 % do teto); a ficha citava "35 %" só no nome comercial.
6. **Laranja moro mantida em 5 mg, com laudo** — 0,07 mg de antocianinas (1,5 % do teto; mínimo NE). A dose da ficha foi mantida por ser conforme; 100 mg (1,47 mg, como no Detox) fica como alternativa para o dono.
7. **Cromo: 200 µg** (80 % do teto) — o cadastro cravava o teto e a ficha era ambígua (0,25 mg do sal).
8. **Vitamina A: dose mantida (1.500 µg RAE), massa do insumo corrigida** — a ficha pesava 1,5 mg do acetato, que a 568.116 UI/g entregam cerca de 256 µg RAE (17 % do declarado); para 1.500 µg RAE são 8,80 mg (mesma conta do Moro Slim).
9. **Vitamina C não incluída** — consta da lista de ingredientes do cadastro, mas nenhuma fonte dá a dose; não se inventa dose. Se o dono quiser, o lote 950467 (99,5 %, válido até 05/03/2029) permite qualquer valor entre 13,5 mg e 1.724 mg (90 % do teto).

## 5. Tabela nutricional (padrão RDC 429/2020 + IN 75/2020)

Energia: só a maltodextrina é contabilizável: 0,87958 g × 4 = 3,52 kcal (≤ 4 kcal → não significativo, %VD 0); × 17 = 14,95 → **15 kJ** (fator kJ PROVISÓRIO). Carboidratos 0,88 g → **0,9 g** (0,88 ÷ 300 = 0,3 % → 0 %). Vitamina A 1.499,8 → **1.500 µg RAE** (187 %). Cromo 199,9 → **200 µg** (571 %). Ácido clorogênico 64,05 → 64 mg. Antocianinas 0,0735 → **0,07 mg** (duas casas, < 1 mg).

```
INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 1 g (2 cápsulas)
                                 Quantidade por porção     %VD*
Valor energético                 3,5 kcal = 15 kJ          0 %
Carboidratos                     0,9 g                     0 %
  Açúcares totais                0 g                       0 %
  Açúcares adicionados           0 g                       0 %
Proteínas                        0 g                       0 %
Gorduras totais                  0 g                       0 %
  Gorduras saturadas             0 g                       0 %
  Gorduras trans                 0 g                       0 %
Fibras alimentares               0 g                       0 %
Sódio                            0 mg                      0 %
Vitamina A                       1.500 µg RAE              187 %
Cromo                            200 µg                    571 %
Ácido clorogênico                64 mg
Antocianinas da laranja moro     0,07 mg
*Percentual de valores diários fornecidos pela porção
```

## 6. Lista de ingredientes proposta (ordem decrescente de massa)

Maltodextrina, extrato de café verde (*Coffea canephora* — a espécie impressa tem de ser a do laudo do lote), acetato de retinila, antiumectante dióxido de silício (INS 551), extrato de laranja moro (*Citrus sinensis* (L.) Osbeck), picolinato de cromo; cápsula: gelatina (composição da cápsula a confirmar com a fábrica).

Alergênicos (RDC 26/2015): nenhum (a quitosana sai). Glúten: não declarar "não contém" sem laudo da maltodextrina.

## 7. Advertências obrigatórias propostas

1. "Este produto não é um medicamento." (RDC 243/2018, art. 14, I, c)
2. "Público indicado: adultos (19 anos ou mais)." (art. 14, I, a)
3. "Não exceder a recomendação diária de consumo indicada na embalagem." (art. 14, I, d)
4. "Mantenha fora do alcance de crianças." (art. 14, I, e)
5. "Este produto não deve ser consumido por gestantes, lactantes e crianças." — Anexo VI: linhas "Ácido clorogênico" e "Antocianinas".
6. Conservação (art. 14, II): texto já gravado.

Hoje o banco já tem essas frases; a ficha técnica ainda traz "ALÉRGICOS: CONTÉM DERIVADOS DE CRUSTÁCEOS", que deixa de valer.

## 8. Pendências e decisões do dono / RT

1. **Aprovar a fórmula reconstruída** (café verde, laranja moro, cromo, vitamina A) e mandar a fábrica emitir memorial de cálculo com lotes e laudos — hoje não existe.
2. **Vitamina C:** decidir se entra e com que dose.
3. **Café verde:** lote com laudo válido (IDNLABS 10269 é o disponível legível); espécie do rótulo = espécie do laudo.
4. **Vitamina A:** validade do laudo 215230 (digitalização não lida); pesar 8,80 mg, não 1,5 mg.
5. **RT:** posição sobre a exigência de fabricante do painel (café verde, laranja moro).
6. **Fábrica:** tamanho/composição da cápsula e excipiente q.s.p. (ou apresentação menor).
7. **Cadastro e rótulo:** substituir a lista de 12 ingredientes pela proposta; retirar o alergênico de crustáceos.

## 9. Veredito esperado após a reformulação

**CONFORME CONDICIONADO A** aprovação pelo dono/RT da fórmula reconstruída e emissão de memorial de cálculo pela fábrica, laudo válido do lote de café verde, validade do laudo da vitamina A e posição do RT sobre a exigência de fabricante do painel. Com isso, os quatro constituintes ficam em forma do Anexo I, dentro de [mínimo, máximo] com folga (maior uso do teto: cromo, 80 %), a porção fecha em 1.000 mg e as advertências do Anexo VI estão no texto.

Arquivos gerados: `scratchpad/fase2/emagrecedor-em-capsula.json` e `.sql` (SQL conferido com pglast, sem execução).
