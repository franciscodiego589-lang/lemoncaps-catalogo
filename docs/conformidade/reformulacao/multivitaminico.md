# Reformulação regulatória — Multivitamínico (`multivitaminico`)

> **Nota de consolidação (fase 3, 16/09/2026).** Este memorial foi verificado (script `scratchpad/fase3/verificar.py`, resultado em `scratchpad/fase3/verificacao.md`) e harmonizado com os outros 23 produtos. O que vale para o catálogo é a versão consolidada: `docs/conformidade/REFORMULACAO-CONSOLIDADA-2026-09-16.md` (decisões, laudos e insumos), `docs/conformidade/TABELAS-NUTRICIONAIS-2026-09-16.md` (tabela pronta para a arte) e a migration `supabase/migrations/20260922000000_reformulacao_conforme_normas.sql` (não aplicada). As decisões técnicas deste memorial foram mantidas; a fase 3 corrigiu só o que segue.
>
> **Correções neste produto:** nenhum número, lote ou teor alterado.
>
> **Convenções harmonizadas (valem para os 24):**
> - kJ = kcal × 4,184 (o memorial usava 17 kJ/g; o Anexo XXII da IN 75/2020, lido no AnvisaLegis em 16/09/2026, só traz fatores em kcal/g).
> - %VD calculado sobre a quantidade declarada (arredondada), não sobre o ativo exato; célula de açúcares totais em branco (sem VDR).
> - Nomes na tabela: os do gabarito/Anexo XI (Tiamina, Riboflavina, Niacina, Biotina, Ácido fólico, Ácido pantotênico; aminoácidos com o nome do Anexo III, sob Proteínas).
> - Linhas de composição do catálogo: quantity = massa do insumo pesado (sal/forma comercial), como o dono decidiu em 20260915140000; o nome traz a forma do Anexo I e a equivalência em ativo ("Bisglicinato de zinco (equivalente a 15 mg de zinco)"); o fragmento SQL deste memorial gravava o elemento — a conta é a mesma, muda só a convenção da linha.
> - Campo `teor_pct` do JSON = doseamento do laudo; o teor efetivo (ativo ÷ massa, com o fator sal→base ou potência) é registrado à parte (`teor_efetivo_pct`) na migration.
> - Advertências gravadas na mesma ordem e com as mesmas frases literais em todos os produtos: art. 14 da RDC 243/2018 (c, d, e) → público (a) → modo de uso (b) → frases do Anexo VI da IN 28/2018 exigidas pelos constituintes presentes → alergênicos → conservação (inciso II).

**Data:** 16/09/2026. **Fase 2 da conformidade do catálogo Lemon Caps** (ordem do dono: "altere os insumos para os permitidos; pode refazer as formulações para todas estarem dentro das normas"). Documento para o dono e para o RT (Anderson C. Barbosa, CRF/MT 5526). Nada foi gravado no banco; as três entregas deste produto são este memorial, o JSON `scratchpad/fase2/multivitaminico.json` e o fragmento SQL `scratchpad/fase2/multivitaminico.sql`, todos criados em disco e não aplicados.

**Fontes usadas (todas lidas nesta data, caminhos absolutos no rodapé):** IN 28/2018 nos anexos literais I, III, IV e VI (texto consolidado vigente até a IN 450/2026, lido em 16/09/2026); auditoria de 15/09/2026; composição do rótulo (`composicoes_rotulo.json`, extração de 13/09/2026); memorial de cálculo da fábrica (`memoriais-formulacoes.json`, 16/09/2026); inventário de laudos (`laudos.json`, 308 certificados, 16/09/2026); gabarito da tabela nutricional (RDC 429/2020 + IN 75/2020, 16/09/2026) e `vd.json`; cadastro vivo do catálogo (chave pública, lido em 16/09/2026).

**Convenção de procedência, em todo número deste documento:** *lido* = copiado da fonte nomeada; *calculado* = conta aritmética mostrada; *assumido* = marcado como tal ao lado do número (teor estequiométrico do sal puro quando não há laudo). Dado não confirmado fica marcado **PROVISÓRIO** ou **PENDENTE**.

## 1. Identificação

- **Nome:** Multivitamínico (nome no rótulo/mercado: Multi vitamínico (arte multivitaminico.pdf)).
- **Slug:** `multivitaminico`.
- **Formato:** cápsula gelatinosa dura, tamanho 0 (memorial rev02).
- **Porção declarada:** 1 g (2 cápsulas) — 1.000 mg de conteúdo por porção (o memorial rev02 registra 500 mg de pó por cápsula; a cápsula vazia, 98,45 mg, não entra na porção). Sem mudança de porção proposta.
- **Público-alvo / grupo populacional dos Anexos III e IV:** adultos, coluna "> 19 anos" dos Anexos III e IV.
- **Porções por embalagem:** 30.

O produto tem três fontes de composição que não batem entre si: o rótulo impresso (20 itens, lido em 13/09), o cadastro do catálogo (19 linhas, com vitamina C 533,685 mg e cromo 250 µg no teto — padrão de cadastro fictício já provado) e o memorial de cálculo rev02 da fábrica (13/08/2026), que é o que a fábrica pesa. Esta reformulação parte do **rótulo** para as doses e do **memorial rev02** para as massas e os laudos, e registra cada divergência.

## 2. Antes — composição atual e veredito da auditoria por insumo

Fonte da tabela: composição impressa no rótulo (`composicoes_rotulo.json`, chave `multivitaminico`, 20 itens), com o veredito da auditoria de 15/09/2026 (seção 4.11) e a observação do memorial rev02 quando o insumo pesado difere do impresso.

| # | Insumo (como está na fonte) | Quantidade | Veredito da auditoria (15/09/2026) e observação do memorial da fábrica |
|---|---|---|---|
| 1 | Magnésio (de bisglicinato de magnésio) | 260 mg (62% VD) | CONFORME (63–350). Memorial: 860,36 mg de sal a 30,22% — laudo lote 90844 VENCIDO (21/06/2025); é o insumo que faz a fórmula somar 1.365,77 mg. |
| 2 | L-teanina | 150 mg | NÃO VERIFICADO (origem). Memorial: lote AUTO039250, laudo lido em 16/09: 'SÍNTESE QUÍMICA' — forma não autorizada. |
| 3 | Vitamina C (ácido ascórbico) | 100 mg (100% VD) | CONFORME. Memorial: 100,50 mg a 99,5% (lote 950467). |
| 4 | Zinco (de bisglicinato de zinco) | 15 mg (136% VD) | CONFORME. Memorial: 75,41 mg a 19,89% (lote 055-ZN/25). |
| 5 | Vitamina B3 (nicotinamida) | 16 mg (100% VD) | CONFORME. Memorial: 16,14 mg a 99,09% (lote 872226). |
| 6 | Vitamina E (acetato de tocoferol) | 10 mg (67% VD) | CONFORME. Memorial: 30 mg de pó 50,7% × 0,67 = 10,19 mg (lote 91320). |
| 7 | Vitamina B5 (pantotenato de cálcio) | 5 mg (100% VD) | CONFORME (88,7% do teto). Memorial: 5,00 mg pesados entregam 4,51 mg pelo fator 92% — o rótulo declara 5 mg; aqui a massa sobe para 5,53 mg para entregar 5,0. |
| 8 | Boro (de quelato de boro) | 3 mg | FORMA NÃO AUTORIZADA. Memorial: 57,36 mg de glicinato de boro 5,23% (lote 044951, laudo lido por imagem: sintético, CAS 'NA'). |
| 9 | Vitamina B6 (cloridrato de piridoxina) | 1,3 mg (100% VD) | CONFORME. Memorial: 1,58 mg (lote 91188). |
| 10 | Vitamina B1 (cloridrato de tiamina) | 1,2 mg (100% VD) | CONFORME no rótulo. Memorial: pesa 2,400 mg para '2,0 mg' com teor 'a confirmar' — com o teor real (99,8%, lote 91454) entregaria 2,395 mg > teto 2,02. |
| 11 | Vitamina B2 (riboflavina) | 1,3 mg (100% VD) | CONFORME. Memorial: 1,30 mg a 100,1% (lote 91068). |
| 12 | Vitamina A (acetato de retinol) | 1.300 mcg (217% VD) | CONFORME. Memorial: 7,63 mg a 568.116 UI/g (lote 215230). |
| 13 | Vitamina B9 (ácido fólico) | 800 mcg (200% VD) | ACIMA DO MÁXIMO: 800 µg = 1.333,3 µg DFE > 1.281,5. Memorial: 0,882 mg a 90,67% (lote AUTO039613); o documento POPS já baixara para 750 µg. |
| 14 | Cobre (de bisglicinato de cobre) | 0,9 mg (100% VD) | CONFORME pelo rótulo; MAS o memorial pesa 'cobre aminoácido quelato 24%' (NaturalPRO NPT.0325/404) — forma não identificada no Anexo I. |
| 15 | Selênio (de selenito de sódio) | 100 mcg (167% VD) | CONFORME pelo rótulo; MAS o memorial pesa glicinato de selênio 0,2794% (lote 044152) — forma não autorizada. |
| 16 | Vitamina K2 (menaquinona-7) | 149 mcg | CONFORME (99,96% do teto — sem folga). Memorial: 0,150 mg tratados como MK-7 ~100% pura, sem lote nem laudo; único laudo de MK-7 na máquina é um pré-mix a 1,48%, vencido em 2022. |
| 17 | Vitamina D3 (colecalciferol) | 50 mcg (333% VD) | CONFORME — igual ao máximo. Memorial: 17,39 mg de pó a 115.000 UI/g (lote 91408). |
| 18 | Cromo (de picolinato de cromo) | 35 mcg (100% VD) | CONFORME. Memorial: 0,284 mg a 12,34% (lote 91190). |
| 19 | Vitamina B12 (cianocobalamina) | 9,94 mcg (414% VD) | CONFORME — igual ao máximo. Memorial pesa METILCOBALAMINA (lote 219376), não cianocobalamina. |
| 20 | Dióxido de silício (INS 551) | 10 mg | aditivo, quantum satis (IN 211/2023, 14.2). Memorial: 0,00 mg de espaço para excipiente. |

Soma dos itens impressos: 576,14 mg; convertendo os elementos em sais, a auditoria estimou mais de 1.400 mg — e o memorial rev02 confirma: 1.365,77 mg de insumos para uma porção de 1.000 mg (136,6%), sem nenhum espaço para excipiente. Além do que a auditoria viu, o memorial mostra que a fábrica pesa **glicinato de selênio** (rótulo diz selenito de sódio), **cobre aminoácido quelato** (rótulo diz bisglicinato), **metilcobalamina** (rótulo diz cianocobalamina), e que a vitamina K2 é pesada como se fosse MK-7 pura (0,150 mg), sem laudo.

## 3. Depois — composição proposta, insumo a insumo

Grupo populacional "> 19 anos". Alvo de cada dose: entre o mínimo e 90% do máximo. Massa do insumo = ativo ÷ teor (laudo do lote nomeado, ou estequiométrico assumido quando não há laudo). A ordem da tabela é a ordem de massa decrescente dos insumos, que é a ordem da lista de ingredientes.

| # | Constituinte (Anexo I) | Forma / insumo comercial | Massa do insumo (mg/porção) | Teor (% e fonte) | Ativo por porção | Mín. | Máx. | % do máx. | Linha do anexo | Laudo (lote · validade · vencido?) | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Magnésio | Óxido de magnésio (MgO, CAS 1309-48-4) — insumo a adquirir | 431,148 | 60,30% Mg — assumido (estequiométrico, MgO puro: 24,305/40,304); sem laudo | 260,000 mg | 63,00 mg | 350,00 mg | 74,3% | I·Óxido de magnésio; III/IV·Magnésio | sem laudo — insumo a adquirir | forma trocada |
| 2 | Vitamina C | Ácido ascórbico (CAS 50-81-7) | 100,503 | 99,5% — laudo lote 950467 | 100,000 mg | 13,50 mg | 1.916,02 mg | 5,2% | I·Ácido ascórbico/Ácido L-ascórbico; III/IV·Vitamina C | 950467 (Analitic, fabricante 250306-C01) · 05/03/2029 · em dia | mantido |
| 3 | Zinco | Bisglicinato de zinco (CAS 14281-83-5) | 75,415 | 19,89% Zn tal qual — laudo lote 055-ZN/25 (20,00% base seca × (1 − 0,54% de perda por secagem)) | 15,000 mg | 1,65 mg | 29,59 mg | 50,7% | I·Bisglicinato de zinco; III/IV·Zinco | 055-ZN/25 (Galena, CIQ 2505027507) · 06/05/2027 · em dia — resultado 20,00% no limite inferior da especificação 20,00–23,00% | mantido |
| 4 | Niacina | Nicotinamida/Niacinamida (CAS 98-92-0) | 16,147 | 99,09% tal qual — laudo lote 872226 (99,5% b.s.; umidade 0,41% conforme memorial) | 16,000 mg NE | 2,40 mg NE | 35,00 mg NE | 45,7% | I·Nicotinamida/Niacinamida; III/IV·Niacina (nota ix: 1 mg NE = 1 mg de niacina) | 872226 (Alamar/INLAB, código 5710) · 09/2027 · em dia | mantido |
| 5 | Vitamina E | Acetato de DL-alfa-tocoferol, pó 50% (CAS 7695-91-2) | 29,439 | 50,7% de acetato — laudo lote 91320; × 0,67 (nota v do Anexo III / nota iii do Anexo IV: 1 UI = 1 mg de acetato de rac-α-tocoferil, atividade 0,67 × RRR; coincide com 1 mg de α-tocoferol = 1,49 UI do Anexo XXIII da IN 75) | 10,000 mg | 2,25 mg | 1.000,00 mg | 1,0% | I·Acetato de DL-alfa-tocoferol; III/IV·Vitamina E (como α-tocoferol) | 91320 (Analitic, fabricante 2025040605) · 05/04/2028 · em dia | mantido |
| 6 | Ácido pantotênico | D-pantotenato de cálcio (CAS 137-08-6) | 5,534 | 98,2% — laudo lote 91186; × 92,01% (fração de ácido pantotênico no sal de cálcio, estequiométrica) | 5,000 mg | 0,75 mg | 5,64 mg | 88,7% | I·D-pantotenato de cálcio; III/IV·Ácido pantotênico | 91186 (Analitic, fabricante 241222X022) · 21/12/2027 · em dia | mantido |
| 7 | Boro | Tetraborato de sódio decahidratado (CAS 1303-96-4) — insumo a adquirir | 26,459 | 11,34% B — assumido (estequiométrico, Na2B4O7·10H2O puro); sem laudo | 3,000 mg | NE | 8,87 mg | 33,8% | I·Tetraborato de sódio decahidratado (IN 76/2020); III·Boro NE; IV·Boro 8,866 mg | sem laudo — insumo a adquirir | forma trocada |
| 8 | Vitamina B6 | Cloridrato de piridoxina (CAS 58-56-0) | 1,582 | 99,9% — laudo lote 91188; × 82,27% (piridoxina/cloridrato, estequiométrico) | 1,300 mg | 0,26 mg | 98,60 mg | 1,3% | I·Cloridrato de piridoxina; III/IV·Vitamina B6 | 91188 (Analitic, fabricante 241229T092) · 28/12/2027 · em dia | mantido |
| 9 | Tiamina | Cloridrato de tiamina (CAS 67-03-8) | 1,528 | 99,8% — laudo lote 91454; × 78,68% (tiamina/cloridrato, estequiométrico) | 1,200 mg | 0,18 mg | 2,02 mg | 59,4% | I·Cloridrato de tiamina; III/IV·Tiamina | 91454 (Analitic, fabricante 260224T132) · 23/02/2029 · em dia | dose ajustada |
| 10 | Riboflavina | Riboflavina (CAS 83-88-5) | 1,299 | 100,1% — laudo lote 91068 | 1,300 mg | 0,20 mg | 2,74 mg | 47,4% | I·Riboflavina; III/IV·Riboflavina | 91068 (Analitic, fabricante 2407332) · 04/07/2027 · em dia | mantido |
| 11 | Vitamina A | Acetato de retinol, pó (CAS 127-47-9) | 7,620 | 568.116 UI/g — potência lida no memorial rev02 (laudo lote 215230, digitalização não relida); 1 µg RAE = 3,33 UI (nota ii do Anexo III) | 1.300,000 µg RAE | 135,00 µg RAE | 2.623,61 µg RAE | 49,6% | I·Acetato de retinol/Acetato de retinila; III/IV·Vitamina A | 25I27-B017-215230 (potência conforme memorial rev02; o PDF é digitalização, não relido) · não relida · validade não relida | mantido |
| 12 | Ácido fólico | Ácido fólico/Ácido N-pteroil-L-glutâmico (CAS 59-30-3) | 0,662 | 90,67% tal qual — laudo lote AUTO039613 (98,95% b.a.; água 8,36% conforme memorial) | 1.000,000 µg DFE | 60,00 µg DFE | 1.281,50 µg DFE | 78,0% | I·Ácido fólico; III/IV·Ácido fólico (nota iv/vi: 1 DFE = 0,6 µg de ácido fólico de suplemento) | AUTO039613 (Lepuge, fabricante 202406008) · 02/06/2027 · em dia | dose ajustada |
| 13 | Cobre | Bisglicinato de cobre (CAS 13479-54-4) — insumo a adquirir | 2,998 | 30,02% Cu — assumido (estequiométrico); sem laudo | 900,000 µg | 135,00 µg | 8.975,52 µg | 10,0% | I·Bisglicinato de cobre; III/IV·Cobre | sem laudo — insumo a adquirir | forma trocada |
| 14 | Selênio | Selenito de sódio (CAS 10102-18-8) — insumo a adquirir | 0,219 | 45,66% Se — assumido (estequiométrico); sem laudo | 100,000 µg | 8,25 µg | 319,75 µg | 31,3% | I·Selenito de sódio; III/IV·Selênio | sem laudo — insumo a adquirir | forma trocada |
| 15 | Vitamina K | Menaquinona-7 (CAS 2124-57-4), pré-mistura em carreador | 8,108 | 1,48% de MK-7 — último teor conhecido (laudo lote PURI011426, VENCIDO em 24/03/2022) — PROVISÓRIO | 120,000 µg | 18,00 µg | 149,06 µg | 80,5% | I·Menaquinona-7; III/IV·Vitamina K | PURI011426 (Gemini/Purifarma, fabricante 2003D04) — único laudo de MK-7 na máquina · 24/03/2022 · VENCIDO | dose ajustada |
| 16 | Vitamina D | Vitamina D3 (colecalciferol), pó 100.000 UI/g (CAS 67-97-0) | 13,913 | 115.000 UI/g — laudo lote 91408 (potência ensaiada; nominal 100.000); 1 µg = 40 UI (nota iii do Anexo III) | 40,000 µg | 3,00 µg | 50,00 µg | 80,0% | I·Vitamina D3 (Colecalciferol); III/IV·Vitamina D | 91408 (Analitic, fabricante 2025111601) · 15/11/2028 · em dia | dose ajustada |
| 17 | Cromo | Picolinato de cromo (CAS 14639-25-9) | 0,284 | 12,34% Cr — laudo lote 91190 | 35,000 µg | 5,25 µg | 250,00 µg | 14,0% | I·Picolinato de cromo; III/IV·Cromo | 91190 (Analitic, fabricante 2024122501) · 24/12/2027 · em dia | mantido |
| 18 | Vitamina B12 | Metilcobalamina (CAS 13422-55-4) | 0,009 | 89,27% tal qual — laudo lote 219376 (98,17% b.a., HPLC; umidade 9,07% conforme Tabela 18 do memorial rev02) | 8,000 µg | 0,36 µg | 9,94 µg | 80,5% | I·Metilcobalamina; III/IV·Vitamina B12 | 219376 (26B20-B032-219376, Fagron/SM, fabricante 032511057) · 14/11/2030 · em dia | dose ajustada |

**Excipientes e veículo (não são constituintes; conferidos contra a IN 211/2023 na auditoria de 15/09 apenas para o dióxido de silício, ácido cítrico, sucralose e corantes — os demais estão marcados como pendência de conferência):**

- Dióxido de silício (antiumectante) (INS 551) — 277,14 mg — q.s.p. 1.000 mg — quantum satis na categoria 14.2 da IN 211/2023 (auditoria de 15/09). Fração alta de excipiente (ver pendência 7): o RT pode preferir um agente de massa e deixar o antiumectante em 1–2%.
- Cápsula: gelatina, água purificada e corante dióxido de titânio (INS 171) — q.s.p. — invólucro, 98,45 mg por cápsula (Qualicaps/Genix, lote 2505380SA, val. 02/04/2030, conforme memorial); não conta na porção

**Soma da porção:** insumos 722,86 mg + excipientes 277,14 mg = **1.000,00 mg de 1.000 mg (100,0%)**. Cabe, com 27,7% de excipiente — folga bem acima dos 2% mínimos. Sem os 149,76 mg de L-teanina (rota A) e com o óxido no lugar do bisglicinato, a fórmula passou de 136,6% para 72,3% da porção em ativos.

**Retirados da fórmula:**

- **L-teanina 150 mg — retirada (rota A).** O Anexo I só autoriza "L-teanina de folhas de Camellia sinensis" (IN 318/2024). O laudo do lote em uso (AUTO039250, Lepuge) diz literalmente "Forma de Obtenção: SÍNTESE QUÍMICA" (lido em 16/09/2026); os outros 4 laudos de L-teanina da máquina também são sintéticos ou sem origem declarada. Num multivitamínico a teanina é acessória e sua saída libera 149,76 mg da cápsula. Rota B (manter como "L-teanina de folhas de Camellia sinensis — insumo a adquirir") está registrada na seção 8.
- **Glicinato de boro 57,36 mg** (substituído por tetraborato de sódio decahidratado) e **glicinato de selênio 35,79 mg** (substituído por selenito de sódio) e **cobre aminoácido quelato 3,82 mg** (substituído por bisglicinato de cobre) — formas não autorizadas, ver tabela.

## 4. Mudanças e motivos

- Magnésio: bisglicinato de magnésio (860,36 mg, laudo vencido) → óxido de magnésio 431,15 mg, mesma dose de 260 mg — motivo: a porção de 1 g não comporta 860 mg de sal (Anexo I autoriza "Óxido de magnésio", CAS 1309-48-4). Insumo a adquirir, laudo pendente.
- Boro: 'quelato de boro (glicinato)' → tetraborato de sódio decahidratado, 3 mg de boro — motivo: forma não listada no Anexo I (linhas "Frutoborato de cálcio" e "Tetraborato de sódio decahidratado" são as únicas). Insumo a adquirir.
- Selênio: glicinato de selênio (pesado) → selenito de sódio (que o rótulo já imprime), 100 µg — motivo: forma não listada no Anexo I (linha "Selenito de sódio"). Insumo a adquirir.
- Cobre: 'cobre aminoácido quelato 24%' → bisglicinato de cobre (que o rótulo já imprime), 900 µg — motivo: forma não identificada entre as 5 do Anexo I. Insumo a adquirir.
- Ácido fólico: 800 → 600 µg (1.333 → 1.000 µg DFE) — motivo: Anexo IV, teto 1.281,5 µg DFE (nota iv), com folga de 22%.
- Vitamina K2: 149 → 120 µg — motivo: 149 µg cravava o teto de 149,06 µg; e a massa passa a considerar o teor real do pré-mix (1,48%), não 100%.
- Vitamina D3: 50 → 40 µg — motivo: teto exato de 50 µg sem folga de fabricação.
- Vitamina B12: 9,94 → 8 µg — motivo: teto exato de 9,94 µg; insumo real é metilcobalamina (rótulo diz cianocobalamina — corrigir).
- Vitamina B1: fixada em 1,2 mg (rótulo) com massa recalculada pelo teor real do laudo 91454 (99,8%) e fator sal→base — motivo: o memorial rev02 pesava 2,4 mg com teor 'a confirmar', o que entregaria 2,395 mg, acima do teto de 2,02 mg.
- L-teanina: retirada (rota A) — motivo: só a de folhas de Camellia sinensis é autorizada e o laudo do lote em uso prova síntese química.
- Vitamina C, zinco, niacina, vitamina E, ácido pantotênico, B6, B2, vitamina A e cromo: mantidos nas doses do rótulo (todos entre o mínimo e 90% do teto; laudos válidos, exceto vitamina A cujo laudo é digitalização lida só pelo memorial).

## 5. Tabela nutricional no padrão ANVISA vigente (RDC 429/2020 + IN 75/2020)

Coluna "> 19 anos" (adultos) do Anexo VIII da IN 75/2020 para o %VD. Vitamina E declarada como α-tocoferol (30 mg de pó × 50,7% × 0,67); vitamina A em µg RAE; ácido fólico em µg DFE; niacina em mg NE. Boro e vitamina K2 têm VDR (K: 120 µg) — o boro não tem VDR e fica com a célula vazia.

**INFORMAÇÃO NUTRICIONAL**

Porções por embalagem: 30
Porção: 1 g (2 cápsulas)

| Item | Quantidade por porção | %VD* (adultos) |
|---|---|---|
| Valor energético | 0 kcal = 0 kJ  | 0% |
| Carboidratos | 0 g | 0% |
| Açúcares totais | 0 g | 0% |
| Açúcares adicionados | 0 g | 0% |
| Proteínas | 0 g | 0% |
| Gorduras totais | 0 g | 0% |
| Gorduras saturadas | 0 g | 0% |
| Gorduras trans | 0 g | 0% |
| Fibras alimentares | 0 g | 0% |
| Sódio | 3,2 mg | 0% |
| Vitamina A | 1.300 µg RAE | 163% |
| Vitamina D | 40 µg | 267% |
| Vitamina E | 10 mg | 67% |
| Vitamina K | 120 µg | 100% |
| Vitamina C | 100 mg | 100% |
| Tiamina | 1,2 mg | 100% |
| Riboflavina | 1,3 mg | 108% |
| Niacina | 16 mg NE | 107% |
| Vitamina B6 | 1,3 mg | 100% |
| Ácido fólico | 1.000 µg DFE | 250% |
| Ácido pantotênico | 5 mg | 100% |
| Vitamina B12 | 8 µg | 333% |
| Cobre | 900 µg | 100% |
| Cromo | 35 µg | 100% |
| Magnésio | 260 mg | 62% |
| Selênio | 100 µg | 167% |
| Zinco | 15 mg | 136% |
| Boro | 3 mg |  |

*Percentual de valores diários fornecidos pela porção

**Conta do valor energético e do sódio (calculado):** Valor energético calculado (fatores de Atwater da IN 75/2020, Anexo XXII: proteínas e carboidratos 4 kcal/g = 17 kJ/g; gorduras 9 kcal/g = 37 kJ/g): proteínas 0,0 mg → 0,00 kcal; carboidratos 0,0 mg → 0,00 kcal; gorduras 0,0 mg → 0,00 kcal; total 0,00 kcal = 0,00 kJ. Sódio calculado: 3,25 mg. Nenhum insumo proposto aporta proteína, carboidrato ou gordura em quantidade mensurável (o ácido ascórbico não é contado como fonte de energia; a glicina dos bisglicinatos de zinco e cobre não foi contada — assunção registrada). O sódio vem do tetraborato (12,06% de Na) e do selenito (26,6% de Na): 3,25 mg, abaixo do limiar de 5 mg — %VD zero.

**Regras aplicadas (gabarito de 16/09/2026):** título "INFORMAÇÃO NUTRICIONAL"; porção = recomendação diária (RDC 429/2020, art. 9º, VI); %VD pelo Anexo VIII da IN 75/2020 para o grupo do rótulo (art. 12, §4º); constituinte sem VDR fica com a célula de %VD vazia (art. 12, §1º); quantidade não significativa (Anexo IV da IN 75: ≤ 4 kcal, ≤ 0,5 g de carboidratos/açúcares/proteínas/gorduras totais, ≤ 0,1 g de saturadas/trans, ≤ 5 mg de sódio) recebe %VD zero (art. 12, §2º); arredondamento pelo Anexo III da IN 75 na paráfrase do gabarito — ≥ 10: inteiro; 1 a 10: uma casa (inteiro se a casa for 0); < 1 em g: uma casa; < 1 em mg/µg: duas casas (uma se a segunda for 0) — regra não confirmada literalmente, ver pendência do gabarito; %VD arredondado ao inteiro (convenção; a regra literal de arredondamento do %VD não consta do gabarito). O valor energético seguiu as mesmas faixas (o gabarito diz não haver linha própria, sem confirmação literal). Rodapé literal do art. 12, §5º da RDC 429/2020.

## 6. Lista de ingredientes proposta

Ordem decrescente de massa por porção (massa do insumo comercial, não do elemento), nomes técnicos e INS dos aditivos, seguida da declaração de alergênicos (RDC 26/2015).

> Óxido de magnésio, antiumectante dióxido de silício (INS 551), ácido ascórbico (vitamina C), bisglicinato de zinco, acetato de DL-alfa-tocoferol (vitamina E), tetraborato de sódio decahidratado, nicotinamida (vitamina B3), colecalciferol (vitamina D3), menaquinona-7 (vitamina K2), acetato de retinol (vitamina A), D-pantotenato de cálcio (vitamina B5), bisglicinato de cobre, cloridrato de piridoxina (vitamina B6), cloridrato de tiamina (vitamina B1), riboflavina (vitamina B2), ácido fólico, picolinato de cromo, selenito de sódio, metilcobalamina (vitamina B12) e cápsula: gelatina, água purificada e corante dióxido de titânio (INS 171). NÃO CONTÉM GLÚTEN (declaração condicionada a laudo de glúten do produto acabado — ver pendência 9).

Nenhum dos insumos propostos deriva dos alergênicos da RDC 26/2015 (leite, ovos, peixes, crustáceos, soja, trigo, amendoim, castanhas, látex). A frase "Não contém glúten" só pode ir ao rótulo com laudo de glúten do produto acabado (Lei 10.674/2003; conferir método com o RT).

## 7. Advertências obrigatórias

**Texto proposto para o rótulo e para o campo `warnings` (as frases do art. 14, I, c/d/e da RDC 243/2018 vão em destaque e negrito):**

> Este produto não é um medicamento.
> Não exceder a recomendação diária de consumo indicada na embalagem.
> Mantenha fora do alcance de crianças.
> Público indicado: adultos (19 anos ou mais). Ingerir 2 cápsulas ao dia.
> Este produto não deve ser consumido por gestantes, lactantes e crianças.
> Conservar o produto em local seco, fresco e arejado, ao abrigo da luz e do calor excessivo, em temperatura ambiente entre 15 °C e 30 °C. Após aberto, consumir em até 60 dias. Não consumir se o lacre de segurança estiver violado.

**Base de cada frase:**

- "Este produto não é um medicamento" / "Não exceder a recomendação diária de consumo indicada na embalagem" / "Mantenha fora do alcance de crianças" — RDC 243/2018, art. 14, I, c/d/e (texto literal, gabarito de 16/09/2026).
- Grupo populacional e quantidade/frequência de consumo — RDC 243/2018, art. 14, I, a/b.
- "Este produto não deve ser consumido por gestantes, lactantes e crianças." — IN 28/2018, Anexo VI, linha "Ácido hialurônico / Boro / Colágeno tipo II não desnaturado / Hidroximetilbutirato / Metilsulfonilmetano / Palmitoiletanolamida / Silício" (IN 76/2020): exigida pelo boro. Com a L-teanina retirada, a linha "Aminoácidos" deixa de se aplicar, mas a frase continua obrigatória pelo boro.
- Conservação, inclusive após aberta — RDC 243/2018, art. 14, II.

**O que falta hoje no cadastro/rótulo:** o campo `warnings` do banco já traz as três frases do art. 14 e a frase genérica do Anexo VI; nada falta em texto. O que muda é o lastro: hoje a frase genérica se apoia em boro e teanina, depois só em boro.

## 8. Pendências e decisões do dono/RT

1. Comprar **óxido de magnésio** (grau alimentício/USP) e obter laudo com teor de Mg antes de pesar — a massa de 431,15 mg foi calculada com 60,30% (MgO puro) e deve ser recalculada pelo teor do laudo.
2. Comprar a **fonte de boro** autorizada: tetraborato de sódio decahidratado (massa estequiométrica 26,46 mg para 3 mg de B) ou frutoborato de cálcio (massa a definir pelo teor do laudo do fabricante). Nenhum laudo de nenhuma das duas existe na máquina. Decisão do dono: a alternativa é retirar o boro (o Multivitamínico não depende dele).
3. Comprar **selenito de sódio** e **bisglicinato de cobre** com laudo (ou ficha do fabricante NaturalPRO declarando que o 'cobre aminoácido quelato' é bisglicinato de cobre, CAS 13479-54-4 — sem isso não serve). Microdoses de selenito (0,22 mg) exigem pré-mistura definida pela fábrica.
4. Obter **laudo vigente da menaquinona-7** realmente em uso (lote não identificado no memorial rev02). A massa de 8,11 mg é provisória, calculada com o único teor conhecido (1,48%, laudo vencido). Sem laudo, a vitamina K2 não pode ser declarada.
5. **L-teanina — decisão do dono:** rota A (retirar, proposta principal deste memorial) ou rota B (manter 150 mg comprando "L-teanina de folhas de Camellia sinensis" — especificação aprovada: fabricante Blue California, segundo o painel da ANVISA lido em 15/09 — como insumo a adquirir). O lote AUTO039250 em estoque não pode ser usado em nenhuma das rotas.
6. **Vitamina A:** o laudo do lote 215230 é digitalização; a potência de 568.116 UI/g vem do memorial rev02 e é 13,6% acima do nominal (500.000 UI/g) — confirmar com o fornecedor antes de fixar a massa.
7. **Excipiente:** com a teanina fora e o óxido no lugar do bisglicinato, o dióxido de silício q.s.p. chega a 277 mg (27,7% da porção). Decisão do RT: manter (quantum satis) ou usar agente de massa (ex.: celulose microcristalina, já declarada no rótulo do Focus Colina) com antiumectante em 1–2% — a conferência do agente de massa na IN 211/2023 não foi feita nesta etapa.
8. **Rótulo:** trocar 'bisglicinato de magnésio' por 'óxido de magnésio' (inclusive na chamada principal da arte, que hoje diz 'magnésio bisglicinato'); trocar 'quelato de boro' por 'tetraborato de sódio decahidratado'; 'cianocobalamina' por 'metilcobalamina'; retirar 'L-teanina'; atualizar ácido fólico (600 µg), K2 (120 µg), D3 (40 µg) e B12 (8 µg); refazer a tabela nutricional conforme a seção 5.
9. "Não contém glúten": manter só com laudo de glúten do produto acabado.
10. Vitamina B1: confirmar com o RT a convenção de declaração (tiamina base, como proposto, ou como cloridrato); as duas leituras ficam dentro da faixa 0,18–2,02 mg.

**Alternativas registradas (não são a proposta principal):**

- **Magnésio via bisglicinato, dose reduzida:** manter bisglicinato de magnésio 30% (laudo novo do lote em estoque ou lote novo) e baixar o Mg para 150 mg (496,4 mg de sal a 30,22%); a fórmula fecha em ~787 mg + excipiente. Mantém a chamada 'bisglicinato' do rótulo, mas muda o número de 260 para 150 mg.
- **Rota B da L-teanina:** manter 150 mg como "L-teanina de folhas de Camellia sinensis" (insumo a adquirir); a soma sobe para ~872 mg + excipiente e a advertência genérica ganha o lastro adicional da linha "Aminoácidos" do Anexo VI. Veredito ficaria condicionado também a esse laudo de origem.
- **Retirar o boro** em vez de comprar a fonte autorizada: elimina uma aquisição e a advertência do Anexo VI passaria a não ser exigida por nenhum constituinte (a frase poderia sair do rótulo).

## 9. Veredito esperado após a reformulação

**CONFORME CONDICIONADO A (laudo de óxido de magnésio; aquisição de fonte de boro autorizada com laudo; laudos de selenito de sódio e bisglicinato de cobre; laudo vigente da menaquinona-7 do lote em uso; confirmação da potência da vitamina A)**

Com a composição da seção 3, nenhum constituinte fica em forma não autorizada, nenhum fica abaixo do mínimo nem acima do máximo do grupo "> 19 anos", nenhum crava o teto (o mais alto é o ácido pantotênico, a 88,7%) e a porção fecha em 1.000 mg com 27,7% de excipiente. O veredito só passa a CONFORME quando os cinco insumos sem laudo válido (óxido de magnésio, fonte de boro, selenito de sódio, bisglicinato de cobre e menaquinona-7) tiverem certificado lido e as massas forem recalculadas pelo teor de cada laudo. Se o dono escolher a rota B da L-teanina, soma-se a condição do laudo de origem Camellia sinensis.

---

**Arquivos-fonte (caminhos absolutos):**

- `/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/IN28-2018-ANEXO-I-LITERAL.md`
- `/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/IN28-2018-ANEXO-III-LITERAL.md`
- `/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/IN28-2018-ANEXOS-IV-V-VI-LITERAL.md`
- `/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/AUDITORIA-ROTULO-VS-ANVISA-2026-09-15.md (seção 4.11)`
- `/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/composicoes_rotulo.json (chave multivitaminico)`
- `/private/tmp/claude-501/-Users-diegofrancisco-Downloads-erp-espa-o/c5ed6b00-4553-4992-b469-c649af084651/scratchpad/fase1/memoriais-formulacoes.json (chave multivitaminico — MEMORIAL-CALCULO-MULTIVITAMINICO-rev02.docx)`
- `/private/tmp/claude-501/-Users-diegofrancisco-Downloads-erp-espa-o/c5ed6b00-4553-4992-b469-c649af084651/scratchpad/fase1/laudos.json (índices 21, 50, 191, 192, 193, 196, 197, 201, 203, 204, 208, 210, 212, 213, 176)`
- `/Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/04_MULTIVITAMINICO/ARQUIVOS-PDF/13_laudo_cobre-quelato-24_lote-NPT0325-404.pdf (lido por imagem em 16/09/2026)`
- `/Users/diegofrancisco/Documents/LAUDOS/SELENIOMETIONINA.pdf (texto extraído em 16/09/2026: EXSELEN PLUS, DCB/DCI/CAS em branco, teor de selênio 0,97%, validade 30/04/2023)`
- `/Users/diegofrancisco/Desktop/LAUDOS/VITAMINA D3 COLECALCIFEROL.pdf (compilação Lepuge; bloco L-TEANINA lote AUTO039250, 'Forma de Obtenção: SÍNTESE QUÍMICA', doseamento 100,16% b.a.)`
- `/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/PADRAO-ANVISA-TABELA-NUTRICIONAL-2026-09-16.md e scratchpad/padrao-anvisa/vd.json`
- `cadastro vivo: https://zjryrmqtumvaxdytvbbv.supabase.co/rest/v1/formulas?slug=eq.multivitaminico e formula_compositions (19 linhas ativas, lidas em 16/09/2026)`
