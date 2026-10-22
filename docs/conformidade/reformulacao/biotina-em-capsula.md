# Reformulação regulatória — Biotina em Cápsula (`biotina-em-capsula`)

> **Nota de consolidação (fase 3, 16/09/2026).** Este memorial foi verificado (script `scratchpad/fase3/verificar.py`, resultado em `scratchpad/fase3/verificacao.md`) e harmonizado com os outros 23 produtos. O que vale para o catálogo é a versão consolidada: `docs/conformidade/REFORMULACAO-CONSOLIDADA-2026-09-16.md` (decisões, laudos e insumos), `docs/conformidade/TABELAS-NUTRICIONAIS-2026-09-16.md` (tabela pronta para a arte) e a migration `supabase/migrations/20260922000000_reformulacao_conforme_normas.sql` (não aplicada). As decisões técnicas deste memorial foram mantidas; a fase 3 corrigiu só o que segue.
>
> **Correções neste produto:**
> - **Vitamina E (%VD)** — 101,9 % → 100 %: %VD calculado sobre a quantidade declarada (arredondada), critério único das 24 tabelas.
> - **Vitamina B6 (%VD)** — 632,2 % → 630,8 % (631 % na tabela): %VD calculado sobre a quantidade declarada (arredondada), critério único das 24 tabelas.
>
> **Convenções harmonizadas (valem para os 24):**
> - kJ = kcal × 4,184 (o memorial usava 17 kJ/g; o Anexo XXII da IN 75/2020, lido no AnvisaLegis em 16/09/2026, só traz fatores em kcal/g).
> - %VD calculado sobre a quantidade declarada (arredondada), não sobre o ativo exato; célula de açúcares totais em branco (sem VDR).
> - Nomes na tabela: os do gabarito/Anexo XI (Tiamina, Riboflavina, Niacina, Biotina, Ácido fólico, Ácido pantotênico; aminoácidos com o nome do Anexo III, sob Proteínas).
> - Linhas de composição do catálogo: quantity = massa do insumo pesado (sal/forma comercial), como o dono decidiu em 20260915140000; o nome traz a forma do Anexo I e a equivalência em ativo ("Bisglicinato de zinco (equivalente a 15 mg de zinco)"); o fragmento SQL deste memorial gravava o elemento — a conta é a mesma, muda só a convenção da linha.
> - Campo `teor_pct` do JSON = doseamento do laudo; o teor efetivo (ativo ÷ massa, com o fator sal→base ou potência) é registrado à parte (`teor_efetivo_pct`) na migration.
> - Advertências gravadas na mesma ordem e com as mesmas frases literais em todos os produtos: art. 14 da RDC 243/2018 (c, d, e) → público (a) → modo de uso (b) → frases do Anexo VI da IN 28/2018 exigidas pelos constituintes presentes → alergênicos → conservação (inciso II).

**Data:** 16/09/2026. **Fase 2 da conformidade do catálogo Lemon Caps** (ordem do dono: "altere os insumos para os permitidos; pode refazer as formulações para todas estarem dentro das normas"). Documento para o dono e para o RT (Anderson C. Barbosa, CRF/MT 5526). Nada foi gravado no banco; as três entregas deste produto são este memorial, o JSON `scratchpad/fase2/biotina-em-capsula.json` e o fragmento SQL `scratchpad/fase2/biotina-em-capsula.sql`, todos criados em disco e não aplicados.

**Fontes usadas (todas lidas nesta data, caminhos absolutos no rodapé):** IN 28/2018 nos anexos literais I, III, IV e VI (texto consolidado vigente até a IN 450/2026, lido em 16/09/2026); auditoria de 15/09/2026; composição do rótulo (`composicoes_rotulo.json`, extração de 13/09/2026); memorial de cálculo da fábrica (`memoriais-formulacoes.json`, 16/09/2026); inventário de laudos (`laudos.json`, 308 certificados, 16/09/2026); gabarito da tabela nutricional (RDC 429/2020 + IN 75/2020, 16/09/2026) e `vd.json`; cadastro vivo do catálogo (chave pública, lido em 16/09/2026).

**Convenção de procedência, em todo número deste documento:** *lido* = copiado da fonte nomeada; *calculado* = conta aritmética mostrada; *assumido* = marcado como tal ao lado do número (teor estequiométrico do sal puro quando não há laudo). Dado não confirmado fica marcado **PROVISÓRIO** ou **PENDENTE**.

## 1. Identificação

- **Nome:** Biotina em Cápsula (nome no rótulo/mercado: BioPrincess (arte BioPrincess.pdf); dossiê técnico 'Biotina em Cápsula'; memorial 'BIO PRINCESS rev02').
- **Slug:** `biotina-em-capsula`.
- **Formato:** cápsula gelatinosa dura, tamanho 0 (memorial rev02; o rev01 dizia 00).
- **Porção declarada:** 1 g (2 cápsulas) — 1.000 mg de conteúdo por porção (500 mg de pó por cápsula; cápsula vazia de 98,45 mg fora da porção). Sem mudança de porção proposta.
- **Público-alvo / grupo populacional dos Anexos III e IV:** adultos, coluna "> 19 anos" dos Anexos III e IV.
- **Porções por embalagem:** 30.

O slug `biotina-em-capsula` corresponde, pelo dossiê técnico de 14/09/2026 e pela planilha PROPOSTA, à fórmula multiativo 'cabelo, pele e unhas' do memorial BIO PRINCESS rev02 (21 constituintes) — não é biotina isolada. Há outro slug, `bioprincess`, fora deste grupo. A arte vigente (BioPrincess.pdf) ainda traz os valores anteriores às correções do rev02 (vitamina E 45 mg, B6 10 mg, cisteína 100 mg, B5 5,64 mg).

## 2. Antes — composição atual e veredito da auditoria por insumo

Fonte da tabela: composição impressa no rótulo (`composicoes_rotulo.json`, chave `bioprincess`, 21 itens), com o veredito da auditoria de 15/09/2026 (seção 4.6) e a observação do memorial rev02.

| # | Insumo (como está na fonte) | Quantidade | Veredito da auditoria (15/09/2026) e observação do memorial da fábrica |
|---|---|---|---|
| 1 | Vitamina C (ácido ascórbico) | 250 mg (556% VD) | CONFORME. Memorial: 251,26 mg a 99,5%. |
| 2 | Colágeno hidrolisado (Peptan) | 120 mg | ABAIXO DO MÍNIMO: única entrada do Anexo I é 'Gelatina hidrolisada/Colágeno hidrolisado' em Proteínas, mínimo 8,4 g (1,4% do mínimo). Já removido do cadastro em 14/09; o rótulo ainda imprime. |
| 3 | L-metionina | 110 mg | CONFORME. Memorial: 110,78 mg a 99,3% (lote 950347). |
| 4 | L-cisteína | 100 mg | CONFORME pelo número; MAS os 100 mg são massa do cloridrato anidro — entrega 76,44 mg de cisteína (memorial rev02); rótulo declara o sal como aminoácido. |
| 5 | Vitamina E (DL-α-tocoferol acetato) | 45 mg (450% VD) | CONFORME; MAS o rótulo declara os 45 mg de pó a 50% como vitamina pura — entrega real 15,29 mg de α-tocoferol (memorial rev02: 'o rótulo anuncia 4,4× o real'). |
| 6 | Metilsulfonilmetano (MSM) | 50 mg | CONFORME. Memorial: 50,41 mg a 99,19% (lote 222159) ou 950413 (99,93%). |
| 7 | Ácido hialurônico (hialuronato de sódio) | 50 mg | NÃO VERIFICADO (origem: fermentação por S. zooepidemicus não declarada no laudo HA2026022540X). |
| 8 | Silício orgânico (ácido ortossilícico) | 50 mg | CONFORME (0,715 mg de Si pelo laudo, 4,6% do teto); ressalva: rótulo deveria nomear a forma estabilizada e o elemento. |
| 9 | Vitamina B3 (nicotinamida) | 35 mg (219% VD) | CONFORME — igual ao máximo (35 mg NE). |
| 10 | Zinco (bisglicinato de zinco) | 15 mg (136% VD) | CONFORME. Memorial: 75,41 mg a 19,89%. |
| 11 | Vitamina B6 (cloridrato de piridoxina) | 10 mg (769% VD) | CONFORME pelo número; MAS 10 mg são massa do sal — entrega 8,22 mg (memorial rev02). |
| 12 | Vitamina B5 (D-pantotenato de cálcio) | 5,64 mg (113% VD) | CONFORME — igual ao máximo; o memorial rev02 já reduziu a massa (entrega 5,08 mg). |
| 13 | Vitamina B2 (riboflavina) | 2,74 mg (211% VD) | CONFORME — igual ao máximo. |
| 14 | Vitamina A (acetato de retinol) | 1.500 mcg (250% VD) | CONFORME. Memorial: 8,80 mg a 568.116 UI/g (rev00 pesava 1,5 mg — subdose de 5,86×, corrigida no rev01). |
| 15 | Cobre (cobre quelado) | 900 mcg (100% VD) | NÃO VERIFICADO (forma). Memorial: 'cobre aminoácido quelato 24%' (NaturalPRO) — não identificável no Anexo I; rev01 usara bisglicinato e rev02 regrediu. |
| 16 | Vitamina B9 (ácido fólico) | 400 mcg (167% VD) | CONFORME (666,7 µg DFE). |
| 17 | Iodo (iodeto de potássio) | 150 mcg (100% VD) | CONFORME. Memorial: 0,197 mg. |
| 18 | Selênio (selênio quelado) | 60 mcg (100% VD) | FORMA NÃO AUTORIZADA (glicinato de selênio, lote 044152). Rev01 usara L-selenometionina; rev02 regrediu. |
| 19 | Vitamina D3 (colecalciferol) | 50 mcg (333% VD) | CONFORME — igual ao máximo. |
| 20 | Biotina (D-biotina) | 45 mcg (150% VD) | CONFORME — igual ao máximo. |
| 21 | Vitamina B12 (metilcobalamina) | 9,94 mcg (414% VD) | CONFORME — igual ao máximo; memorial rev02 traz dois teores para o lote 219376. |

Soma impressa 846,49 mg; o memorial rev02 fecha em 999,995 mg com 39,01 mg de dióxido de silício. Seis constituintes cravados no teto (B3, B5, B2, D3, biotina, B12), um abaixo do mínimo (colágeno), duas formas não autorizadas/não identificadas (selênio, cobre), uma origem não declarada (hialuronato) e três declarações que tratam massa de sal/pó como ativo (vitamina E, B6, cisteína).

## 3. Depois — composição proposta, insumo a insumo

Grupo "> 19 anos". Doses do rótulo mantidas onde já estão na faixa com folga; as seis do teto reduzidas para ≤ 90%; três declarações corrigidas pelo teor real do insumo pesado. Massas do memorial rev02 mantidas quando a dose não muda.

| # | Constituinte (Anexo I) | Forma / insumo comercial | Massa do insumo (mg/porção) | Teor (% e fonte) | Ativo por porção | Mín. | Máx. | % do máx. | Linha do anexo | Laudo (lote · validade · vencido?) | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Vitamina C | Ácido ascórbico (CAS 50-81-7) | 251,256 | 99,5% — laudo lote 950467 | 250,000 mg | 13,50 mg | 1.916,02 mg | 13,0% | I·Ácido ascórbico/Ácido L-ascórbico; III/IV·Vitamina C | 950467 (Analitic, fabricante 250306-C01) · 05/03/2029 · em dia | mantido |
| 2 | Metionina | L-Metionina (CAS 63-68-3) | 110,775 | 99,3% — laudo lote 950347 | 110,000 mg | 105,00 mg | 1.530,00 mg | 7,2% | I·L-Metionina; III·Metionina 105 (nota ix: metionina + cisteína ≥ 157,5); IV·Metionina 1.530 | 950347 (Analitic, fabricante 20240502) · 01/05/2027 · em dia | mantido |
| 3 | Cisteína | Cloridrato de L-cisteína, anidro (CAS 52-89-1) | 100,000 | 76,44% de cisteína tal qual — laudo lote 218167 (100,22% b.s. × (1 − 0,78%) = 99,44%, conforme memorial rev02) × 76,87% (cisteína/cloridrato, estequiométrico) | 76,437 mg | 42,00 mg | 830,00 mg | 9,2% | I·Cloridrato de L-cisteína; III·Cisteína 42 (nota ix); IV·Cisteína 830 | 218167 (memorial rev02; arquivo 04_laudo_L-cisteina-HCl-anidra é digitalização, não relido). Alternativa em texto: SM 26F18-B023-224361, 100,61% b.s., val. 21/01/2028 · não relida · validade não relida | mantido (declaração corrigida) |
| 4 | Vitamina E | Acetato de DL-alfa-tocoferol, pó 50% (CAS 7695-91-2) | 45,000 | 50,7% de acetato — laudo lote 91320; × 0,67 (1 UI = 1 mg de acetato de rac-α-tocoferil; 1 mg de α-tocoferol = 1,49 UI) | 15,286 mg | 2,25 mg | 1.000,00 mg | 1,5% | I·Acetato de DL-alfa-tocoferol; III/IV·Vitamina E (como α-tocoferol) | 91320 (Analitic, fabricante 2025040605) · 05/04/2028 · em dia | mantido (declaração corrigida) |
| 5 | Metilsulfonilmetano | Metilsulfonilmetano (CAS 67-71-0) | 50,035 | 99,93% — laudo lote 950413 (o memorial cita também o lote 222159, 99,19%; conferir qual está em estoque) | 50,000 mg | NE | 900,00 mg | 5,6% | I·Metilsulfonilmetano (IN 76/2020); III·NE; IV·900 mg | 950413 (Analitic, fabricante 20241221) · 20/12/2029 · em dia | mantido |
| 6 | Ácido hialurônico | Hialuronato de sódio (CAS 9067-32-7) — forma do Anexo I: 'Hialuronato de Sódio obtido pela fermentação de Streptococcus zooepidemicus' | 52,247 | 95,7% — laudo lote HA2026022540X | 50,000 mg | 3,50 mg | 157,70 mg | 31,7% | I·Hialuronato de Sódio obtido pela fermentação de Streptococcus zooepidemicus (IN 76/2020); III·3,5 mg; IV·157,7 mg | HA2026022540X (Analitic, ref. 91465) · 24/02/2029 · em dia — não declara processo de fermentação nem a cepa Streptococcus zooepidemicus | mantido — PENDENTE declaração de origem |
| 7 | Silício | Ácido orto-silícico estabilizado com maltodextrina (Siliciumax, Fagron: maltodextrina 95% + gel de ácido silícico 5%) | 50,000 | 1,43% de Si — laudo lote 216957 (lido em 15/09 na auditoria, [F5]; especificação 1,5% ± 10%) | 0,715 mg | NE | 15,67 mg | 4,6% | I·Ácido orto-silícico estabilizado com maltodextrina (IN 102/2021); III·NE; IV·Silício 15,67 mg | 216957 (25L02-B003-216957, Fagron, fabricante OP25211) · 29/07/2029 · em dia | mantido (declaração corrigida) |
| 8 | Niacina | Nicotinamida/Niacinamida (CAS 98-92-0) | 31,285 | 99,09% tal qual — laudo lote 872226 | 31,000 mg NE | 2,40 mg NE | 35,00 mg NE | 88,6% | I·Nicotinamida/Niacinamida; III/IV·Niacina | 872226 (Alamar/INLAB, código 5710) · 09/2027 · em dia | dose ajustada |
| 9 | Zinco | Bisglicinato de zinco (CAS 14281-83-5) | 75,415 | 19,89% Zn tal qual — laudo lote 055-ZN/25 | 15,000 mg | 1,65 mg | 29,59 mg | 50,7% | I·Bisglicinato de zinco; III/IV·Zinco | 055-ZN/25 (Galena, CIQ 2505027507) · 06/05/2027 · em dia — resultado 20,00% no limite inferior da especificação 20,00–23,00% | mantido |
| 10 | Vitamina B6 | Cloridrato de piridoxina (CAS 58-56-0) | 10,000 | 99,9% — laudo lote 91188; × 82,27% (piridoxina/cloridrato) | 8,219 mg | 0,26 mg | 98,60 mg | 8,3% | I·Cloridrato de piridoxina; III/IV·Vitamina B6 | 91188 (Analitic, fabricante 241229T092) · 28/12/2027 · em dia | mantido (declaração corrigida) |
| 11 | Vitamina A | Acetato de retinol, pó (CAS 127-47-9) | 8,792 | 568.116 UI/g — potência conforme memorial rev02 (laudo lote 215230, digitalização não relida); 1 µg RAE = 3,33 UI | 1.500,000 µg RAE | 135,00 µg RAE | 2.623,61 µg RAE | 57,2% | I·Acetato de retinol/Acetato de retinila; III/IV·Vitamina A | 25I27-B017-215230 (potência conforme memorial rev02; o PDF é digitalização, não relido) · não relida · validade não relida | mantido |
| 12 | Ácido pantotênico | D-pantotenato de cálcio (CAS 137-08-6) | 5,534 | 98,2% — laudo lote 91186; × 92,01% (ácido pantotênico/sal de cálcio) | 5,000 mg | 0,75 mg | 5,64 mg | 88,7% | I·D-pantotenato de cálcio; III/IV·Ácido pantotênico | 91186 (Analitic, fabricante 241222X022) · 21/12/2027 · em dia | dose ajustada |
| 13 | Cobre | Bisglicinato de cobre (CAS 13479-54-4) — insumo a adquirir | 2,998 | 30,02% Cu — assumido (estequiométrico); sem laudo | 900,000 µg | 135,00 µg | 8.975,52 µg | 10,0% | I·Bisglicinato de cobre; III/IV·Cobre | sem laudo — insumo a adquirir | forma trocada |
| 14 | Riboflavina | Riboflavina (CAS 83-88-5) | 2,398 | 100,1% — laudo lote 91068 | 2,400 mg | 0,20 mg | 2,74 mg | 87,6% | I·Riboflavina; III/IV·Riboflavina | 91068 (Analitic, fabricante 2407332) · 04/07/2027 · em dia | dose ajustada |
| 15 | Ácido fólico | Ácido fólico/Ácido N-pteroil-L-glutâmico (CAS 59-30-3) | 0,441 | 90,67% tal qual — laudo lote AUTO039613 | 666,670 µg DFE | 60,00 µg DFE | 1.281,50 µg DFE | 52,0% | I·Ácido fólico; III/IV·Ácido fólico (1 DFE = 0,6 µg de ácido fólico) | AUTO039613 (Lepuge, fabricante 202406008) · 02/06/2027 · em dia | mantido |
| 16 | Iodo | Iodeto de potássio (CAS 7681-11-0) | 0,197 | 76,15% de I tal qual — laudo lote 210468 (99,77% b.s. × (1 − 0,16%) = 99,61%, conforme memorial) × 76,45% (I/KI, estequiométrico) | 150,000 µg | 22,50 µg | 919,02 µg | 16,3% | I·Iodeto de potássio; III/IV·Iodo | 210468 (memorial rev02; digitalização, não relida). Alternativa em texto: SM 26E04-B046-222493, 100,05% b.s., val. 30/11/2030 · não relida · validade não relida | mantido |
| 17 | Biotina | D-biotina (CAS 58-85-5) | 0,040 | 100,0% — laudo lote 91457 (Analitic, val. 19/12/2028; lote 25030042 do memorial rev02 é o nome do arquivo) | 40,000 µg | 4,50 µg | 45,00 µg | 88,9% | I·D-biotina; III/IV·Biotina | 91457 (Analitic, fabricante BN25121020; o arquivo está nomeado com o lote 25030042) · 19/12/2028 · em dia | dose ajustada |
| 18 | Selênio | Selenito de sódio (CAS 10102-18-8) — insumo a adquirir | 0,131 | 45,66% Se — assumido (estequiométrico); sem laudo | 60,000 µg | 8,25 µg | 319,75 µg | 18,8% | I·Selenito de sódio; III/IV·Selênio | sem laudo — insumo a adquirir | forma trocada |
| 19 | Vitamina D | Vitamina D3 (colecalciferol), pó 100.000 UI/g (CAS 67-97-0) | 13,913 | 115.000 UI/g — laudo lote 91408; 1 µg = 40 UI | 40,000 µg | 3,00 µg | 50,00 µg | 80,0% | I·Vitamina D3 (Colecalciferol); III/IV·Vitamina D | 91408 (Analitic, fabricante 2025111601) · 15/11/2028 · em dia | dose ajustada |
| 20 | Vitamina B12 | Metilcobalamina (CAS 13422-55-4) | 0,009 | 89,27% tal qual — laudo lote 219376 (98,17% b.a.; umidade 9,07% conforme memorial) | 8,000 µg | 0,36 µg | 9,94 µg | 80,5% | I·Metilcobalamina; III/IV·Vitamina B12 | 219376 (26B20-B032-219376, Fagron/SM, fabricante 032511057) · 14/11/2030 · em dia | dose ajustada |

**Excipientes e veículo (não são constituintes; conferidos contra a IN 211/2023 na auditoria de 15/09 apenas para o dióxido de silício, ácido cítrico, sucralose e corantes — os demais estão marcados como pendência de conferência):**

- Dióxido de silício (antiumectante) (INS 551) — 189,53 mg — q.s.p. 1.000 mg — quantum satis (IN 211/2023, 14.2). A maltodextrina da lista de ingredientes do rótulo é o carreador do Siliciumax (47,5 mg dos 50 mg), não um excipiente à parte.
- Cápsula: gelatina, água purificada, corante dióxido de titânio e lauril sulfato de sódio (INS 171) — q.s.p. — invólucro de 98,45 mg (Qualicaps/Genix, lote 2505380SA); o lauril sulfato de sódio consta do memorial rev02, item 13, 'a confirmar com o fabricante'; a arte vigente está truncada nesse trecho

**Soma da porção:** insumos 810,47 mg + excipientes 189,53 mg = **1.000,00 mg de 1.000 mg (100,0%)**. Cabe, com 18,9% de excipiente (a saída do colágeno liberou 120 mg; o selenito e o bisglicinato de cobre são muito menores que os quelatos que substituem).

**Retirados da fórmula:**

- **Colágeno hidrolisado (Peptan) 120 mg — retirado.** Única entrada do Anexo I é 'Gelatina hidrolisada/Colágeno hidrolisado' na categoria Proteínas, mínimo 8,4 g/dia (Anexo III); 120 mg são 1,4% do mínimo e 8,4 g não cabem em cápsula (princípio 6). O cadastro já o havia removido em 14/09; a arte ainda imprime. Se o dono quiser mantê-lo, só em pó/sachê a 8,4 g por porção (alternativa, seção 8).
- **Glicinato de selênio 21,47 mg** → selenito de sódio; **cobre aminoácido quelato 3,82 mg** → bisglicinato de cobre (formas não autorizadas — ver tabela).

## 4. Mudanças e motivos

- Colágeno hidrolisado 120 mg: retirado — motivo: mínimo de 8,4 g de proteínas (Anexo III), impossível em 1 g.
- Selênio: 'selênio quelado' (glicinato) → selenito de sódio, 60 µg — motivo: forma não listada no Anexo I. Insumo a adquirir.
- Cobre: 'cobre quelado' (aminoácido quelato NaturalPRO) → bisglicinato de cobre, 900 µg — motivo: forma não identificada entre as 5 do Anexo I. Insumo a adquirir.
- Ácido hialurônico: mantido a 50 mg, condicionado à declaração do fabricante de que é obtido por fermentação de Streptococcus zooepidemicus (nome exato do Anexo I).
- Silício: passa a ser declarado pelo elemento (0,715 mg) com a forma do Anexo I 'ácido orto-silícico estabilizado com maltodextrina' — motivo: o limite (15,67 mg) é do silício, não da massa do Siliciumax.
- Seis doses no teto exato reduzidas para ≤ 90%: niacina 35 → 31 mg NE; ácido pantotênico 5,64 → 5,0 mg; riboflavina 2,74 → 2,4 mg; vitamina D3 50 → 40 µg; biotina 45 → 40 µg; vitamina B12 9,94 → 8 µg — motivo: teto exato é impressão digital de cadastro fictício e não tem folga de fabricação.
- Três declarações do rótulo corrigidas sem mudar a pesagem: vitamina E 45 → 15 mg de α-tocoferol; vitamina B6 10 → 8,2 mg; L-cisteína 100 → 76 mg — motivo: o rótulo declarava massa do pó/sal como ativo (memorial rev02 e planilha PROPOSTA de 14/09 já apontavam).
- Vitamina C, metionina, MSM, zinco, vitamina A, ácido fólico e iodo: mantidos.

## 5. Tabela nutricional no padrão ANVISA vigente (RDC 429/2020 + IN 75/2020)

Coluna "> 19 anos" do Anexo VIII da IN 75/2020. Ácido hialurônico, MSM e silício sem VDR (células vazias). Metionina e cisteína aparecem como proteínas (soma dos aminoácidos livres) e como linhas próprias, sem VDR.

**INFORMAÇÃO NUTRICIONAL**

Porções por embalagem: 30
Porção: 1 g (2 cápsulas)

| Item | Quantidade por porção | %VD* (adultos) |
|---|---|---|
| Valor energético | 1,1 kcal = 4,8 kJ  | 0% |
| Carboidratos | 0,1 g | 0% |
| Açúcares totais | 0 g | 0% |
| Açúcares adicionados | 0 g | 0% |
| Proteínas | 0,2 g | 0% |
| Gorduras totais | 0 g | 0% |
| Gorduras saturadas | 0 g | 0% |
| Gorduras trans | 0 g | 0% |
| Fibras alimentares | 0 g | 0% |
| Sódio | 2,9 mg | 0% |
| Vitamina A | 1.500 µg RAE | 188% |
| Vitamina D | 40 µg | 267% |
| Vitamina E | 15 mg | 102% |
| Vitamina C | 250 mg | 250% |
| Riboflavina | 2,4 mg | 200% |
| Niacina | 31 mg NE | 207% |
| Vitamina B6 | 8,2 mg | 632% |
| Biotina | 40 µg | 133% |
| Ácido fólico | 667 µg DFE | 167% |
| Ácido pantotênico | 5 mg | 100% |
| Vitamina B12 | 8 µg | 333% |
| Cobre | 900 µg | 100% |
| Iodo | 150 µg | 100% |
| Selênio | 60 µg | 100% |
| Zinco | 15 mg | 136% |
| Metionina | 110 mg |  |
| Cisteína | 76 mg |  |
| Metilsulfonilmetano | 50 mg |  |
| Ácido hialurônico | 50 mg |  |
| Silício | 0,72 mg |  |

*Percentual de valores diários fornecidos pela porção

**Conta do valor energético e do sódio (calculado):** Valor energético calculado (fatores de Atwater da IN 75/2020, Anexo XXII: proteínas e carboidratos 4 kcal/g = 17 kJ/g; gorduras 9 kcal/g = 37 kJ/g): proteínas 186,4 mg → 0,75 kcal; carboidratos 97,5 mg → 0,39 kcal; gorduras 0,0 mg → 0,00 kcal; total 1,14 kcal = 4,83 kJ. Sódio calculado: 2,90 mg. Proteínas: metionina 110 mg + cisteína 76,4 mg = 186,4 mg (aminoácidos livres contados pelo fator das proteínas — assunção registrada; o rótulo vigente já declarava 0,3 g). Carboidratos: maltodextrina do Siliciumax (47,5 mg) e hialuronato de sódio (polissacarídeo, 50 mg) — 97,5 mg. Total 1,1 kcal, abaixo de 4 kcal (não significativo). Sódio: hialuronato de sódio (5,73% de Na) e selenito: 3,0 mg, abaixo de 5 mg.

**Regras aplicadas (gabarito de 16/09/2026):** título "INFORMAÇÃO NUTRICIONAL"; porção = recomendação diária (RDC 429/2020, art. 9º, VI); %VD pelo Anexo VIII da IN 75/2020 para o grupo do rótulo (art. 12, §4º); constituinte sem VDR fica com a célula de %VD vazia (art. 12, §1º); quantidade não significativa (Anexo IV da IN 75: ≤ 4 kcal, ≤ 0,5 g de carboidratos/açúcares/proteínas/gorduras totais, ≤ 0,1 g de saturadas/trans, ≤ 5 mg de sódio) recebe %VD zero (art. 12, §2º); arredondamento pelo Anexo III da IN 75 na paráfrase do gabarito — ≥ 10: inteiro; 1 a 10: uma casa (inteiro se a casa for 0); < 1 em g: uma casa; < 1 em mg/µg: duas casas (uma se a segunda for 0) — regra não confirmada literalmente, ver pendência do gabarito; %VD arredondado ao inteiro (convenção; a regra literal de arredondamento do %VD não consta do gabarito). O valor energético seguiu as mesmas faixas (o gabarito diz não haver linha própria, sem confirmação literal). Rodapé literal do art. 12, §5º da RDC 429/2020.

## 6. Lista de ingredientes proposta

Ordem decrescente de massa por porção (massa do insumo comercial, não do elemento), nomes técnicos e INS dos aditivos, seguida da declaração de alergênicos (RDC 26/2015).

> Ácido ascórbico (vitamina C), antiumectante dióxido de silício (INS 551), L-metionina, cloridrato de L-cisteína, bisglicinato de zinco, hialuronato de sódio, ácido orto-silícico estabilizado com maltodextrina (silício), metilsulfonilmetano (MSM), acetato de DL-alfa-tocoferol (vitamina E), nicotinamida (vitamina B3), colecalciferol (vitamina D3), cloridrato de piridoxina (vitamina B6), acetato de retinol (vitamina A), D-pantotenato de cálcio (vitamina B5), bisglicinato de cobre, riboflavina (vitamina B2), ácido fólico, iodeto de potássio, selenito de sódio, D-biotina, metilcobalamina (vitamina B12) e cápsula: gelatina, água purificada e corante dióxido de titânio (INS 171).

Nenhum insumo proposto deriva dos alergênicos da RDC 26/2015 (com a saída do colágeno hidrolisado, que é de origem animal mas não alergênico listado, e sem hialuronato de origem animal — a forma do Anexo I é fermentativa). Sem declaração de glúten até laudo do produto acabado.

## 7. Advertências obrigatórias

**Texto proposto para o rótulo e para o campo `warnings` (as frases do art. 14, I, c/d/e da RDC 243/2018 vão em destaque e negrito):**

> Este produto não é um medicamento.
> Não exceder a recomendação diária de consumo indicada na embalagem.
> Mantenha fora do alcance de crianças.
> Público indicado: adultos (19 anos ou mais). Ingerir 2 cápsulas ao dia.
> Este produto não deve ser consumido por gestantes, lactantes e crianças.
> Conservar o produto em local seco, fresco e arejado, ao abrigo da luz e do calor excessivo, em temperatura ambiente entre 15 °C e 30 °C. Após aberto, consumir em até 60 dias. Não consumir se o lacre de segurança estiver violado.

**Base de cada frase:**

- Três frases do art. 14, I, c/d/e da RDC 243/2018 (texto literal); grupo e frequência — art. 14, I, a/b; conservação — art. 14, II.
- "Este produto não deve ser consumido por gestantes, lactantes e crianças." — IN 28/2018, Anexo VI, exigida por três linhas: "Aminoácidos" (metionina, cisteína), "Ácido hialurônico / … / Metilsulfonilmetano / … / Silício" (IN 76/2020) e "Ácido orto-silícico estabilizado com maltodextrina" (IN 102/2021). Texto idêntico nas três.

**O que falta hoje no cadastro/rótulo:** nada falta em texto (o campo `warnings` já traz as frases). O rótulo impresso traz a frase de abertura 'Biohair reúne nutrientes…' — nome de outro produto — e a lista de ingredientes truncada pela caixa da tabela: refazer a arte.

## 8. Pendências e decisões do dono/RT

1. **Colágeno hidrolisado — decisão do dono:** retirado nesta proposta. Se quiser mantê-lo, só como produto em pó/sachê com 8,4 g por porção (não cabe em cápsula).
2. **Comprar selenito de sódio e bisglicinato de cobre** com laudo (o cobre NaturalPRO só serviria se o fabricante declarasse, por escrito, que é bisglicinato de cobre CAS 13479-54-4).
3. **Hialuronato de sódio:** obter do fabricante a declaração de obtenção por fermentação de Streptococcus zooepidemicus para o lote HA2026022540X (o laudo não diz; outro lote, 225412, já foi reprovado pela mesma falta em 28/08/2026). Sem isso, retirar.
4. **Vitamina A:** confirmar com o fornecedor a potência de 568.116 UI/g do lote 215230 (13,6% acima do nominal; laudo é digitalização).
5. **Vitamina B12:** o memorial rev02 traz dois teores para o lote 219376 (98,17% e 99,2% b.a.); o laudo lido em texto confirma 98,17% b.a. — usar 89,27% tal qual e conferir a umidade (9,07%) no corpo do laudo.
6. **MSM:** conferir qual lote está em estoque (950413 a 99,93% ou 222159 a 99,19%); a massa muda 0,4 mg.
7. **Rótulo:** retirar colágeno hidrolisado; corrigir vitamina E (15 mg), B6 (8,2 mg), L-cisteína (76 mg); trocar 'selênio quelado' por 'selenito de sódio' e 'cobre quelado' por 'bisglicinato de cobre'; declarar silício pelo elemento (0,72 mg) com a forma estabilizada; atualizar B3, B5, B2, D3, biotina e B12; corrigir o texto de abertura ('Biohair'); completar a lista de ingredientes truncada; definir se a cápsula tem lauril sulfato de sódio.
8. "Não contém glúten": só com laudo do produto acabado.

**Alternativas registradas (não são a proposta principal):**

- **Colágeno hidrolisado em pó (sachê):** 8,4 g/dia de Peptan (lote AUTO040177, proteína 91,51%, val. 23/04/2030 → 9,18 g de insumo para 8,4 g de proteína) como produto separado — única forma de manter o colágeno dentro da norma.
- **L-selenometionina** em vez de selenito de sódio (forma também autorizada): exige compra com laudo que declare a forma; o EXSELEN PLUS da máquina não declara.
- **Cianocobalamina** em vez de metilcobalamina: há laudos válidos em texto (Galena 2608027404, 99,20%, val. 30/05/2031; Analitic 91515, 98,9%, val. 21/05/2031) — troca possível se a fábrica preferir alinhar a outros produtos.

## 9. Veredito esperado após a reformulação

**CONFORME CONDICIONADO A (laudos de selenito de sódio e bisglicinato de cobre; declaração de origem fermentativa do hialuronato de sódio; confirmação da potência da vitamina A)**

Com a composição da seção 3 (20 constituintes), todas as formas são do Anexo I, nenhuma dose crava o teto (a mais alta é a biotina, 88,9%), o colágeno hidrolisado deixou de puxar a fórmula para baixo do mínimo de proteínas, e a porção fecha em 1.000 mg com 18,9% de excipiente. O CONFORME pleno depende de dois insumos a comprar com laudo (selenito, bisglicinato de cobre), da declaração de origem do hialuronato e da confirmação da potência da vitamina A.

---

**Arquivos-fonte (caminhos absolutos):**

- `/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/IN28-2018-ANEXO-I-LITERAL.md`
- `/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/IN28-2018-ANEXO-III-LITERAL.md`
- `/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/IN28-2018-ANEXOS-IV-V-VI-LITERAL.md`
- `/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/AUDITORIA-ROTULO-VS-ANVISA-2026-09-15.md (seção 4.6 e fonte [F5])`
- `/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/composicoes_rotulo.json (chave bioprincess)`
- `/private/tmp/claude-501/-Users-diegofrancisco-Downloads-erp-espa-o/c5ed6b00-4553-4992-b469-c649af084651/scratchpad/fase1/memoriais-formulacoes.json (chave biotina-em-capsula — MEMORIAL-CALCULO-BIO-PRINCESS-rev02.docx)`
- `/private/tmp/claude-501/-Users-diegofrancisco-Downloads-erp-espa-o/c5ed6b00-4553-4992-b469-c649af084651/scratchpad/fase1/laudos.json (índices 29, 50, 83, 86, 188, 189, 190, 191, 193, 197, 201, 203, 204, 205, 210, 213, 215, 176)`
- `/Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/04_MULTIVITAMINICO/ARQUIVOS-PDF/13_laudo_cobre-quelato-24_lote-NPT0325-404.pdf (lido por imagem em 16/09/2026)`
- `/Users/diegofrancisco/Documents/LAUDOS/SELENIOMETIONINA.pdf (texto extraído em 16/09/2026)`
- `/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/PADRAO-ANVISA-TABELA-NUTRICIONAL-2026-09-16.md e scratchpad/padrao-anvisa/vd.json`
- `cadastro vivo: formulas?slug=eq.biotina-em-capsula e formula_compositions (20 linhas ativas, lidas em 16/09/2026)`
