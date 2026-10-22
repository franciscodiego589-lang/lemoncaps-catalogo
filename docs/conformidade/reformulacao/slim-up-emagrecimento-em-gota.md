# Memorial de reformulação — Slim Up (Emagrecimento em Gotas)

**Slug:** `slim-up-emagrecimento-em-gota` · **Data:** 16/09/2026 · **Fase 2 — reformulação regulatória do catálogo Lemon Caps**
**Fontes lidas:** Anexos I, III, IV, V e VI da IN 28/2018 (transcrições literais, consolidação até a IN 450/2026); auditoria de 15/09/2026 (Parte II, seção II.9); memorial de cálculo rev03 da fábrica (14/09/2026, rascunho não assinado, `MEM-CALC-SLIMUP-rev03_Memorial_de_Calculo_PREENCHIDO.xlsx`, via `memoriais-formulacoes.json`, que também compara com o rev02 de 13/08 e com a ficha técnica); inventário de laudos de 16/09/2026; gabarito da tabela nutricional; cadastro do banco lido ao vivo em 16/09/2026.

Em cada número está dito se foi **lido**, **calculado** (com a conta) ou **assumido**.

---

## 1. Identificação

| campo | valor |
|---|---|
| Nome | Slim Up — Emagrecimento em Gota (ficha: "Inibidor de apetite em gotas") |
| Formato | suplemento alimentar líquido — solução oral em gotas, frasco de 30 mL |
| Porção | **1 mL (30 gotas)** por dia, conforme o memorial rev03 — **o cadastro do banco diz "Ingerir 2 mL ao dia"**: divergência que só o dono resolve (§8). A proposta abaixo é por dose diária de 1 mL; se a porção ficar em 2 mL, as concentrações por mL caem pela metade com a mesma dose diária e o frasco rende 15 porções |
| Porções por embalagem | 30 (frasco de 30 mL ÷ 1 mL) |
| Grupo populacional | adultos, coluna "> 19 anos" |
| Densidade | 1 g/mL **assumida** (o rev03 fecha a porção em exatamente 1,000000 g por mL) |

## 2. Antes — composição atual e veredito da auditoria

Fonte: **memorial rev03 (14/09/2026)** — o documento mais recente da fábrica, que corrige o erro de lote da B12 do rev02 e reduz D3 e B12 do teto exato. O cadastro do banco tem 5 linhas (café verde 92,9 mg, feno-grego fluido 33 mg, cromo 250 mcg, D 50 mcg, B12 9,94 mcg) e a `ingredients_list` inclui cúrcuma, bitartarato de colina e inulina que não estão na composição — cadastro contraditório, como a auditoria apontou.

| # | insumo (rev03, por 1 mL) | massa | ativo (rev03) | veredito |
|---|---|---|---|---|
| 1 | Vitamina D3 pó 100.000 UI/g (Analitic, lote 91408, 115.000 UI/g) | 15,652 mg | 45,0 µg | CONFORME (90 % do teto de 50 µg) |
| 2 | Metilcobalamina (lote 219376, 89,27 % t.q.) | 0,010082 mg | 9,0 µg | CONFORME, mas 90,5 % do teto de 9,94 µg |
| 3 | Picolinato de cromo (lote 91190, 12,34 %) | 0,25 mg | 30,85 µg | CONFORME (12 % do teto) |
| 4 | Extrato de café verde (HERBALTEC, lote 10841, 53,86 %) | 50 mg | 26,93 mg de ácido clorogênico | NÃO VERIFICADO na auditoria; o rev03 diz "abaixo do mínimo de 50 mg" (painel) — **o Anexo III literal diz NE** |
| 5 | DL-bitartarato de colina (lote 91442, 40,61 %) | 33,3 mg | 13,52 mg de colina | **ABAIXO DO MÍNIMO** (16 % de 82,5 mg) |
| 6 | Extrato de cúrcuma (NaturalPRO, NPT.0425/580, 0,42 %) | 80 mg | 0,336 mg | **0,4 % do mínimo** de 80 mg |
| 7 | "Extrato fluido" de feno-grego (lote AUTO9IVT — o laudo é de pó) | 33 mg | sem doseamento | NÃO VERIFICADO; nomenclatura incoerente |
| — | Água (q.s.p.), glicerina 133,3, sorbitol líquido 70 % 66,7, inulina 21,7, ácido cítrico 6,7, benzoato de sódio 1,67, sorbato de potássio 1,67, goma xantana 0,67 | — | excipientes | sorbitol com laudo de pó; goma xantana × goma arábica |

O próprio rev03 conclui: "dos 7 constituintes ativos, 4 estão abaixo do mínimo (ácido clorogênico, colina, curcumina) ou sem doseamento (feno-grego)". Veredito da auditoria de 15/09: **NÃO VERIFICÁVEL** (extratos sem laudo; cadastro contraditório).

## 3. Depois — composição proposta (por dose diária de 1 mL)

| constituinte (nome exato do Anexo I) | forma / insumo comercial | massa por porção | teor e fonte | ativo por porção | mín. | máx. (> 19) | % do máx. | linha do anexo | laudo | status |
|---|---|---|---|---|---|---|---|---|---|---|
| Vitamina D — "Vitamina D_3 (Colecalciferol)" (CAS 67-97-0) | vitamina D3 pó 100.000 UI/g, Analitic, lote 91408 | 15,652 mg | 115.000 UI/g — **lido** no laudo | 15,652 mg × 115.000 UI/g = 1.800 UI ÷ 40 = **45,0 µg** | 3 µg | 50,0 µg | 90,0 % | III·Vitamina D^iii / IV·Vitamina D^ii | 91408 · 15/11/2028 · não | **mantido** |
| Vitamina B12 — "Metilcobalamina" (CAS 13422-55-4) | metilcobalamina, SM/Fagron, lote 219376 | **0,00896 mg** (8,96 µg) | 89,27 % tal qual — **lido** no rev03 (o inventário registra 98,17 % em base anidra para o mesmo lote; divergência registrada, usado o t.q.) | 8,96 × 0,8927 = **8,0 µg** | 0,36 µg | 9,94 µg | 80,5 % | III·Vitamina B_12 / IV·Vitamina B_12 | 219376 · 14/11/2030 · não | **dose ajustada** (9,0 → 8,0 µg) |
| Cromo — "Picolinato de cromo" (CAS 14639-25-9) | picolinato de cromo, Analitic, lote 91190 | 0,25 mg | 12,34 % de Cr — **lido** | 0,25 × 0,1234 = **30,85 µg** | 5,25 µg | 250 µg | 12,3 % | III·Cromo / IV·Cromo | 91190 · 24/12/2027 · não | **mantido** |
| Ácido clorogênico — "Extrato de café verde" (IN 102/2021) | café verde solúvel IDNLABS, lote 10269 (laudo válido legível); em uso HERBALTEC 10841 (ver §4) | 50 mg | 64,05 % — **lido** no laudo 10269; metilxantinas 1,56 % | 50 × 0,6405 = **32,02 mg** | NE | 400 mg | 8,0 % | III·Ácido clorogênico (NE) / IV·(400) | 10269 · 08/2027 · não | **mantido; laudo regularizado** |
| Colina — "Bitartarato de colina/Hidrogênio tartarato de colina" (CAS 87-67-2) | DL-bitartarato de colina, Analitic, lote 91442 | **221,62 mg** | colina 40,61 % — **lido** no laudo 91442 | 90 ÷ 0,4061 = 221,62 mg; 221,62 × 0,4061 = **90,00 mg de colina** | 82,5 mg | 3.235,15 mg | 2,8 % | III·Colina / IV·Colina | 91442 · 03/01/2029 · não | **dose ajustada** (13,52 → 90 mg) |
| Curcumina — "Extrato de rizomas de cúrcuma" | extrato NaturalPRO NPT.0425/580 | (era 80 mg) | 0,42 % | 0,336 mg | 80 mg | 130 mg | 0,3 % | III/IV·Curcumina | não confirmada | **retirado** |
| Saponinas — "Extrato de semente de feno-grego" | (laudo é de pó) | (era 33 mg) | sem doseamento | — | NE | 450 mg | — | III/IV·Saponinas de glicosídeos de furostanol | scan | **retirado** |
| Fibras alimentares — "Inulina" | inulina lote 206486 | (era 21,7 mg) | 91,0 % | 19,75 mg | 5,7 g | NE | — | III·Fibras alimentares | scan | **retirado** |

Ingredientes não constituintes (por 1 mL):

| ingrediente | massa | papel | observação |
|---|---|---|---|
| Água purificada (q.s.p. 1 mL) | **501,76 mg** (calculado: 1.000 − 498,24) | veículo | sem certificado no dossiê |
| Glicerina (INS 422) | 133,3 mg | umectante | igual ao rev03 |
| Sorbitol líquido 70 % (INS 420) | 66,7 mg (46,69 mg de sorbitol) | umectante | laudo em disco (106371) é de sorbitol **em pó** — divergência aberta |
| Ácido cítrico (INS 330) | 6,7 mg | acidulante | lote GE2844AFG |
| Benzoato de sódio (INS 211) | 1,67 mg | conservador | lote 950430 (99,77 %); sódio = 1,67 × 0,9977 × 0,1595 = 0,266 mg |
| Sorbato de potássio (INS 202) | 1,67 mg | conservador | lote 91202 (100,30 %) |
| Goma xantana (INS 415) | 0,67 mg | espessante | sem certificado; a ficha antiga chama de "goma arábica" (INS 414) |

**Sólidos por mL:** 15,652 + 0,00896 + 0,25 + 50 + 221,62 + 133,3 + 66,7 + 6,7 + 1,67 + 1,67 + 0,67 = **498,24 mg** (o rev03 tinha 444,62 mg); água q.s.p. 501,76 mg; **total 1.000,00 mg por mL (100,0 %)** — fecha, com a ressalva de viabilidade da colina (§8).

## 4. Mudanças e motivos

1. **Colina: 13,52 → 90 mg (33,3 → 221,62 mg de bitartarato).** Anexo III, linha "Colina", mínimo 82,5 mg; a dose do rev03 era 16 % disso. 90 mg = 109 % do mínimo, 2,8 % do teto (3.235,15 mg), 16 % do VD. É a única forma de manter a colina (princípio 3: dose dentro da faixa); a alternativa é retirá-la. **Pendência de fábrica:** confirmar que 221,62 mg de bitartarato de colina se mantêm dissolvidos e estáveis em 1 mL (os sólidos por mL sobem de 444,6 para 498,2 mg) e aceitável no sabor.
2. **Vitamina B12: 9,0 → 8,0 µg.** O rev02 cravava o teto (9,94 µg) e o rev03 ficou em 90,5 % dele — acima dos 90 % do princípio 3. 8,0 µg = 80,5 % do teto e 333 % do VD; qualquer valor ≤ 8,9 µg atende. Conta: 8,0 ÷ 0,8927 = 8,96 µg de metilcobalamina. Divergência de teor para o mesmo lote (89,27 % t.q. no rev03; 98,17 % base anidra no inventário) — a fábrica confirma a base que usa na pesagem.
3. **Cúrcuma retirada** (0,336 mg contra mínimo de 80 mg de curcuminoides; volta com extrato padronizado — 105,3 mg a 95 % — e, em gotas, com solubilidade a validar).
4. **Feno-grego retirado**: sem laudo de saponinas e nomenclatura incoerente (rótulo "extrato fluido", laudo de pó). Extratos com laudo em disco foram rejeitados pelo parecer PAR-LAU-2026-001 por fabricante — exigência ausente do Anexo I literal; RT decide. Dose conforme se voltar: ≤ 405 mg de saponinas.
5. **Inulina retirada**: fibra (mínimo 5,7 g) sem função tecnológica que a enquadre no Art. 6, § único — princípio 6.
6. **Café verde mantido (50 mg), laudo trocado**: dose demonstrada com o laudo válido legível (IDNLABS 10269, 64,05 %) = 32,02 mg de ácido clorogênico (8 % do teto). O rev03 escreve "abaixo do mínimo de 50 mg" com base no painel; o **Anexo III literal diz NE** — pelo texto da norma não há mínimo, e a linha fica conforme com qualquer dos dois lotes (com o 10841, 26,93 mg). Cafeína no máximo 0,78 mg: não é fonte de cafeína.
7. **Vitamina D3 mantida em 45 µg** (90,0 % do teto — no limite do princípio 3; 300 % do VD). Se o RT quiser folga maior: 40 µg = 13,913 mg do pó (80 %).
8. **Cromo mantido (30,85 µg)** — e o cadastro passa a declarar o elemento (o "250 mcg" do cadastro era a massa do sal).

## 5. Tabela nutricional (padrão RDC 429/2020 + IN 75/2020)

Energia (conta refeita na fase 3, 16/09/2026, com o Anexo XXII da IN 75/2020 lido no AnvisaLegis: sorbitol 2,6 kcal/g e ácido cítrico 3 kcal/g são valores literais do anexo; o anexo só traz kcal/g, por isso kJ = kcal × 4,184; a glicerina não tem fator no anexo — 4 kcal/g é critério do memorial, a confirmar pelo RT): glicerina 0,1333 g × 4 = 0,53 kcal; sorbitol 0,04669 g × 2,6 = 0,12; ácido cítrico 0,0067 × 3 = 0,02; total 0,674 kcal → **0,7 kcal** (arredondamento do gabarito: uma casa abaixo de 10; ≤ 4 kcal: não significativo, %VD 0); 0,674 × 4,184 = 2,82 → **2,8 kJ**. (A fase 2 usava sorbitol 2,4 kcal/g e fatores 17/10/13 kJ/g, provisórios, e declarava 0,67 kcal.) Carboidratos: só o sorbitol (poliol), 0,047 g → **0 g** (≤ 0,5 g). Sódio 0,266 → **0,27 mg** (≤ 5 mg → 0 %). Vitamina D 45 ÷ 15 = 300 %. B12 8,0 ÷ 2,4 = 333 %. Cromo 30,85 → **31 µg**; 30,85 ÷ 35 = 88 %. Colina 90 ÷ 550 = 16 %. Ácido clorogênico 32,02 → 32 mg.

```
INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 1 mL (30 gotas)
                                 Quantidade por porção     %VD*
Valor energético                 0,7 kcal = 2,8 kJ         0 %
Carboidratos                     0 g                       0 %
  Açúcares totais                0 g                       0 %
  Açúcares adicionados           0 g                       0 %
Proteínas                        0 g                       0 %
Gorduras totais                  0 g                       0 %
  Gorduras saturadas             0 g                       0 %
  Gorduras trans                 0 g                       0 %
Fibras alimentares               0 g                       0 %
Sódio                            0,27 mg                   0 %
Vitamina D                       45 µg                     300 %
Vitamina B12                     8,0 µg                    333 %
Cromo                            31 µg                     88 %
Colina                           90 mg                     16 %
Ácido clorogênico                32 mg
*Percentual de valores diários fornecidos pela porção
```

## 6. Lista de ingredientes proposta (ordem decrescente de massa)

Água purificada, bitartarato de colina, umectante glicerina (INS 422), umectante sorbitol (INS 420), extrato de café verde (*Coffea canephora* — a espécie impressa tem de ser a do laudo do lote), vitamina D3 (colecalciferol), acidulante ácido cítrico (INS 330), conservadores benzoato de sódio (INS 211) e sorbato de potássio (INS 202), espessante goma xantana (INS 415), picolinato de cromo, metilcobalamina (vitamina B12).

Alergênicos (RDC 26/2015): nenhum. Os limites da IN 211/2023 para suplemento **líquido** não foram conferidos nesta tarefa (a auditoria de 15/09 só cobriu a categoria 14.2, sólidos) — pendência.

## 7. Advertências obrigatórias propostas

1. "Este produto não é um medicamento." (RDC 243/2018, art. 14, I, c)
2. "Público indicado: adultos (19 anos ou mais)." (art. 14, I, a)
3. "Não exceder a recomendação diária de consumo indicada na embalagem." (art. 14, I, d)
4. "Mantenha fora do alcance de crianças." (art. 14, I, e)
5. "Este produto não deve ser consumido por gestantes, lactantes e crianças." — Anexo VI da IN 28/2018, linha "Ácido clorogênico". **Hoje o banco diz "Gestantes, lactantes e crianças somente devem consumir este produto sob orientação de médico ou nutricionista" — texto diferente do exigido; substituir pelo literal.**
6. Conservação (art. 14, II): mantido o texto atual do banco ("Conservar em local seco, fresco e ao abrigo da luz. Após aberto, manter a embalagem bem fechada e seguir as orientações do rótulo.") — a fábrica define o prazo após aberto.

Deixa de ser exigida a advertência das saponinas (feno-grego sai).

## 8. Pendências e decisões do dono / RT

1. **Porção:** 1 mL (rev03) ou 2 mL (cadastro) — decisão do dono; a concentração por mL depende dela.
2. **Fábrica:** viabilidade da colina a 221,62 mg/mL; se inviável, retirar a colina.
3. **Café verde:** lote com laudo válido (IDNLABS 10269, "solúvel", adequado a gotas) ou laudo completo do 10841; espécie do rótulo = espécie do laudo.
4. **Sorbitol líquido:** laudo do insumo real (o de disco é de pó).
5. **Espessante:** goma xantana (INS 415) ou goma arábica (INS 414)? Certificado.
6. **Aditivos em líquido:** conferir limites da IN 211/2023 para a categoria de suplementos líquidos.
7. **B12:** base do teor usada na pesagem (t.q. 89,27 % × base anidra 98,17 %).
8. **RT:** vitamina D3 em 45 ou 40 µg; posição sobre a exigência de fabricante do painel (café verde, feno-grego).
9. **Documentos:** assinar o rev03 (rascunho) e atualizar a ficha técnica e o cadastro (5 linhas antigas, cromo como sal, 2 mL).

## 9. Veredito esperado após a reformulação

**CONFORME CONDICIONADO A** definição da porção pelo dono (1 mL × 2 mL), viabilidade técnica da colina a 221,62 mg/mL confirmada pela fábrica, laudo válido do lote de café verde, laudo do sorbitol líquido e identidade do espessante, e conferência dos aditivos para suplemento líquido. Com isso, os cinco constituintes ficam em forma do Anexo I, dentro de [mínimo, máximo] (maior uso do teto: vitamina D, 90 %; B12 80,5 %), a porção fecha em 1.000 mg por mL e a advertência do Anexo VI passa ao texto literal.

Arquivos gerados: `scratchpad/fase2/slim-up-emagrecimento-em-gota.json` e `.sql` (SQL conferido com pglast, sem execução).
