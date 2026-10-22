# Reformulação regulatória — FOCUS COLINA (`focus-colina`)

**Data:** 16/09/2026. **Fase 2 da conformidade do catálogo Lemon Caps** (ordem do dono: "altere os insumos para os permitidos; pode refazer as formulações para todas estarem dentro das normas"). Documento para o dono e para o RT (Anderson C. Barbosa, CRF/MT 5526). Nada foi gravado no banco; as três entregas deste produto são este memorial, o JSON `scratchpad/fase2/focus-colina.json` e o fragmento SQL `scratchpad/fase2/focus-colina.sql`, todos criados em disco e não aplicados.

**Fontes usadas (todas lidas nesta data, caminhos absolutos no rodapé):** IN 28/2018 nos anexos literais I, III, IV e VI (texto consolidado vigente até a IN 450/2026, lido em 16/09/2026); auditoria de 15/09/2026; composição do rótulo (`composicoes_rotulo.json`, extração de 13/09/2026); memorial de cálculo da fábrica (`memoriais-formulacoes.json`, 16/09/2026); inventário de laudos (`laudos.json`, 308 certificados, 16/09/2026); gabarito da tabela nutricional (RDC 429/2020 + IN 75/2020, 16/09/2026) e `vd.json`; cadastro vivo do catálogo (chave pública, lido em 16/09/2026).

**Convenção de procedência, em todo número deste documento:** *lido* = copiado da fonte nomeada; *calculado* = conta aritmética mostrada; *assumido* = marcado como tal ao lado do número (teor estequiométrico do sal puro quando não há laudo). Dado não confirmado fica marcado **PROVISÓRIO** ou **PENDENTE**.

## 1. Identificação

- **Nome:** FOCUS COLINA (nome no rótulo/mercado: Focus Colina (arte FocusColina.pdf)).
- **Slug:** `focus-colina`.
- **Formato:** cápsula gelatinosa dura, tamanho 0 (memorial rev02).
- **Porção declarada:** 1 g (2 cápsulas) — 1.000 mg de conteúdo por porção (500 mg de pó por cápsula; cápsula vazia de 98,45 mg fora da porção). Proposta principal mantém 2 cápsulas; alternativas de 3 e 4 cápsulas na seção 8 (mudança de porção é decisão do dono).
- **Público-alvo / grupo populacional dos Anexos III e IV:** adultos, coluna "> 19 anos" dos Anexos III e IV.
- **Porções por embalagem:** 30.

O memorial rev02 admite que a fórmula da cápsula soma 1.818,30 mg para uma porção de 1.000 mg (181,8%): o bitartarato de colina necessário para 470 mg de colina (1.157,35 mg) sozinho ultrapassa as duas cápsulas. Não há como manter 470 mg de colina em 2 cápsulas; a proposta principal reduz a colina, e as alternativas mudam a porção.

## 2. Antes — composição atual e veredito da auditoria por insumo

Fonte da tabela: composição impressa no rótulo (`composicoes_rotulo.json`, chave `focus_colina`, 9 itens), com o veredito da auditoria de 15/09/2026 (seção 4.9) e a observação do memorial rev02.

| # | Insumo (como está na fonte) | Quantidade | Veredito da auditoria (15/09/2026) e observação do memorial da fábrica |
|---|---|---|---|
| 1 | Colina (bitartarato de colina) | 470 mg | CONFORME (82,5–3.235). Memorial: 1.157,35 mg de bitartarato a 40,61% — sozinho ultrapassa a porção; fórmula em 1.818,30 mg (181,8%). |
| 2 | L-tirosina | 220 mg | ABAIXO DO MÍNIMO (262,5 mg, nota viii; 83,8% do mínimo). Memorial: 220,22 mg a 99,9% (lote 91382); versão solúvel já usa 262,76 mg. |
| 3 | L-teanina | 115 mg | NÃO VERIFICADO (origem). Memorial: lote AUTO039250, laudo lido em 16/09: 'SÍNTESE QUÍMICA'. |
| 4 | L-carnitina | 95 mg | CONFORME. Memorial: 99,01 mg a 95,95% (lote 216523). |
| 5 | Magnésio (bisglicinato de magnésio) | 60 mg (14% VD) | ABAIXO DO MÍNIMO (63 mg; 95,2%). Memorial: 198,54 mg de sal a 30,22%; laudo 90844 VENCIDO. |
| 6 | Inositol (mio-inositol) | 25 mg | CONFORME. Memorial: 25,04 mg (lote 950479). |
| 7 | Vitamina B6 (cloridrato de piridoxina) | 1,3 mg (100% VD) | CONFORME. Memorial: 1,58 mg. |
| 8 | Vitamina D3 (colecalciferol) | 5 mcg (33% VD) | CONFORME. Memorial: 1,74 mg de pó a 115.000 UI/g. |
| 9 | Vitamina B12 (cianocobalamina) | 2,4 mcg (100% VD) | CONFORME; MAS o insumo do memorial é metilcobalamina (lote 219376) e o §6.1 usa teor de outro lote (94,54%) — inconsistência interna. |

Soma impressa 986,31 mg (98,6%), mas com o magnésio como sal e a colina como bitartarato a fórmula real é de 1.818,30 mg. Dois constituintes abaixo do mínimo (tirosina, magnésio), uma origem não autorizada (teanina) e um nome de insumo errado (B12).

## 3. Depois — composição proposta, insumo a insumo

Grupo "> 19 anos". Tirosina e magnésio levados a 110% do mínimo; colina reduzida ao que cabe; teanina com origem trocada (rota B); demais doses do rótulo mantidas.

| # | Constituinte (Anexo I) | Forma / insumo comercial | Massa do insumo (mg/porção) | Teor (% e fonte) | Ativo por porção | Mín. | Máx. | % do máx. | Linha do anexo | Laudo (lote · validade · vencido?) | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Colina | Bitartarato de colina/Hidrogênio tartarato de colina (CAS 87-67-2) | 320,118 | 40,61% de colina — laudo lote 91442 (teor do sal 99,60%; colina 40,61%) | 130,000 mg | 82,50 mg | 3.235,15 mg | 4,0% | I·Bitartarato de colina/Hidrogênio tartarato de colina; III·Colina 82,5 mg; IV·3.235,15 mg | 91442 (Analitic, fabricante CA26010402USPS) · 03/01/2029 · em dia | dose ajustada |
| 2 | Tirosina | L-Tirosina (CAS 60-18-4) | 290,290 | 99,9% — laudo lote 91382 (L-tirosina vegetal) | 290,000 mg | 262,50 mg | 2.750,00 mg | 10,5% | I·L-Tirosina; III·Tirosina 262,5 (nota viii: fenilalanina + tirosina ≥ 262,5 mg); IV·2.750 mg | 91382 (Analitic, fabricante 20250508) · 07/05/2028 · em dia | dose ajustada |
| 3 | Teanina | L-teanina de folhas de Camellia sinensis — insumo a adquirir (rota B) | 115,000 | 100% — assumido; o laudo do lote em uso (AUTO039250, Lepuge) não serve: 'SÍNTESE QUÍMICA' | 115,000 mg | 50,00 mg | 250,00 mg | 46,0% | I·L-teanina de folhas de Camellia sinensis (IN 318/2024); III/IV·Teanina | AUTO039250 (Lepuge, fabricante 202408145) — SÍNTESE QUÍMICA, não serve · 13/08/2027 · em dia — laudo lido em 16/09/2026: 'Forma de Obtenção: SÍNTESE QUÍMICA'; a única forma autorizada é a de folhas de Camellia sinensis | forma trocada (origem) — PENDENTE laudo |
| 4 | L-Carnitina | Levocarnitina/L-carnitina (CAS 541-15-1) | 95,564 (a fase 2 propôs 99,010 com o lote 216523) | 99,41% — laudo lote 26H14-B025-226329 (SM Empreendimentos, lido em texto), **harmonizado na fase 3** (16/09/2026): laudo válido mais recente de L-carnitina base, o mesmo adotado no Pré-treino 420 g e no Pro Energy; o lote 216523 (95,95%, val. 18/08/2027) só existe em digitalização não relida | 95,000 mg | NE | 2.000,00 mg | 4,8% | I·Levocarnitina/L-carnitina; III·NE; IV·2.000 mg | 26H14-B025-226329 (SM Empreendimentos, fabricante A2605097) · 20/05/2028 · em dia | mantido |
| 5 | Magnésio | Óxido de magnésio (MgO, CAS 1309-48-4) — insumo a adquirir | 116,078 | 60,30% Mg — assumido (estequiométrico); sem laudo | 70,000 mg | 63,00 mg | 350,00 mg | 20,0% | I·Óxido de magnésio; III/IV·Magnésio | sem laudo — insumo a adquirir | forma trocada + dose ajustada |
| 6 | Inositol | Inositol (Mio-inositol/Meso-inositol) (CAS 87-89-8) | 25,035 | 99,86% — laudo lote 950479 (conforme memorial; digitalização) | 25,000 mg | NE | 2.000,00 mg | 1,2% | I·Inositol (Mio-inositol/Meso-inositol) (IN 76/2020); III·NE; IV·2 g | 950479 (memorial rev02; digitalização, não relida). Alternativa em texto: IDNLABS YW20241103, 99,61%, val. 11/2028 · não relida · validade não relida | mantido |
| 7 | Vitamina D | Vitamina D3 (colecalciferol), pó 100.000 UI/g (CAS 67-97-0) | 1,739 | 115.000 UI/g — laudo lote 91408; 1 µg = 40 UI | 5,000 µg | 3,00 µg | 50,00 µg | 10,0% | I·Vitamina D3 (Colecalciferol); III/IV·Vitamina D | 91408 (Analitic, fabricante 2025111601) · 15/11/2028 · em dia | mantido |
| 8 | Vitamina B6 | Cloridrato de piridoxina (CAS 58-56-0) | 1,582 | 99,9% — laudo lote 91188; × 82,27% | 1,300 mg | 0,26 mg | 98,60 mg | 1,3% | I·Cloridrato de piridoxina; III/IV·Vitamina B6 | 91188 (Analitic, fabricante 241229T092) · 28/12/2027 · em dia | mantido |
| 9 | Vitamina B12 | Metilcobalamina (CAS 13422-55-4) | 0,003 | 89,27% tal qual — laudo lote 219376 (98,17% b.a.; umidade 9,07%) | 2,400 µg | 0,36 µg | 9,94 µg | 24,1% | I·Metilcobalamina; III/IV·Vitamina B12 | 219376 (26B20-B032-219376, Fagron/SM, fabricante 032511057) · 14/11/2030 · em dia | mantido (nome corrigido) |

**Excipientes e veículo (não são constituintes; conferidos contra a IN 211/2023 na auditoria de 15/09 apenas para o dióxido de silício, ácido cítrico, sucralose e corantes — os demais estão marcados como pendência de conferência):**

- Dióxido de silício (antiumectante) (INS 551) — 34,59 mg (a fase 2 tinha 31,14 mg; recalculado na fase 3 após a troca do lote de L-carnitina) — q.s.p. 1.000 mg — quantum satis (IN 211/2023, 14.2). O rótulo vigente declara também 'agente de massa celulose microcristalina', sem massa possível na fórmula atual (181,8%); com esta reformulação o agente de massa não é necessário.
- Cápsula: gelatina, água purificada e corante dióxido de titânio (INS 171) — q.s.p. — invólucro de 98,45 mg (Qualicaps/Genix, lote 2505380SA); o memorial atribui lauril sulfato de sódio à cápsula e o rótulo omite — confirmar

**Soma da porção:** insumos 965,41 mg + excipientes 34,59 mg = **1.000,00 mg de 1.000 mg (100,0%)**. Cabe, com 3,5% de excipiente — o limite prático de 2 cápsulas com estes ativos.

**Retirados da fórmula:**

- **L-teanina sintética (lote AUTO039250)** — substituída pela de folhas de Camellia sinensis (rota B); **bisglicinato de magnésio** (laudo vencido, abaixo do mínimo) → óxido de magnésio; **celulose microcristalina** (agente de massa do rótulo) — desnecessária, sai.

## 4. Mudanças e motivos

- Colina: 470 → 130 mg (bitartarato 1.157,35 → 320,12 mg) — motivo: a fórmula do memorial soma 1.818,30 mg para uma porção de 1.000 mg; só a colina em bitartarato já ultrapassa a porção. 130 mg é o máximo que cabe em 2 cápsulas com os demais ativos e 3% de excipiente; continua acima do mínimo de 82,5 mg (Anexo III).
- L-tirosina: 220 → 290 mg — motivo: mínimo de 262,5 mg (Anexo III, nota viii), com folga de 10%.
- Magnésio: bisglicinato 198,54 mg (60 mg de Mg, laudo vencido) → óxido de magnésio 116,08 mg (70 mg de Mg) — motivo: mínimo de 63 mg com folga; o bisglicinato não cabe. Insumo a adquirir.
- L-teanina: origem sintética → "L-teanina de folhas de Camellia sinensis", 115 mg — motivo: Anexo I (IN 318/2024). Insumo a adquirir (rota B).
- Vitamina B12: nome corrigido para metilcobalamina (insumo pesado) e massa recalculada com o teor do lote 219376 (89,27%) — motivo: o §6.1 do memorial usou 94,54%, de outro lote.
- L-carnitina, inositol, B6 e D3: mantidos.
- Celulose microcristalina (agente de massa do rótulo): retirada — sem função com a fórmula em 96,9% da porção.

## 5. Tabela nutricional no padrão ANVISA vigente (RDC 429/2020 + IN 75/2020)

Coluna "> 19 anos" do Anexo VIII da IN 75/2020. Colina tem VDR (550 mg); tirosina, teanina, carnitina e inositol não têm (células vazias).

**INFORMAÇÃO NUTRICIONAL**

Porções por embalagem: 30
Porção: 1 g (2 cápsulas)

| Item | Quantidade por porção | %VD* (adultos) |
|---|---|---|
| Valor energético | 1,7 kcal = 7,3 kJ  | 0% |
| Carboidratos | 0 g | 0% |
| Açúcares totais | 0 g | 0% |
| Açúcares adicionados | 0 g | 0% |
| Proteínas | 0,4 g | 0% |
| Gorduras totais | 0 g | 0% |
| Gorduras saturadas | 0 g | 0% |
| Gorduras trans | 0 g | 0% |
| Fibras alimentares | 0 g | 0% |
| Sódio | 0 mg | 0% |
| Vitamina D | 5 µg | 33% |
| Vitamina B6 | 1,3 mg | 100% |
| Vitamina B12 | 2,4 µg | 100% |
| Magnésio | 70 mg | 17% |
| Colina | 130 mg | 24% |
| Tirosina | 290 mg |  |
| Teanina | 115 mg |  |
| L-Carnitina | 95 mg |  |
| Inositol | 25 mg |  |

*Percentual de valores diários fornecidos pela porção

**Conta do valor energético e do sódio (calculado):** Valor energético calculado (fatores de Atwater da IN 75/2020, Anexo XXII: proteínas e carboidratos 4 kcal/g = 17 kJ/g; gorduras 9 kcal/g = 37 kJ/g): proteínas 405,0 mg → 1,62 kcal; carboidratos 25,0 mg → 0,10 kcal; gorduras 0,0 mg → 0,00 kcal; total 1,72 kcal = 7,31 kJ. Sódio calculado: 0,00 mg. Proteínas: aminoácidos livres (tirosina 290 + teanina 115 = 405 mg; a L-carnitina não é aminoácido proteico e não foi contada) — 1,6 kcal. Carboidratos: inositol (25 mg, poliol contado como carboidrato — assunção) — 0,1 kcal. Total 1,7 kcal, abaixo de 4 kcal.

**Regras aplicadas (gabarito de 16/09/2026):** título "INFORMAÇÃO NUTRICIONAL"; porção = recomendação diária (RDC 429/2020, art. 9º, VI); %VD pelo Anexo VIII da IN 75/2020 para o grupo do rótulo (art. 12, §4º); constituinte sem VDR fica com a célula de %VD vazia (art. 12, §1º); quantidade não significativa (Anexo IV da IN 75: ≤ 4 kcal, ≤ 0,5 g de carboidratos/açúcares/proteínas/gorduras totais, ≤ 0,1 g de saturadas/trans, ≤ 5 mg de sódio) recebe %VD zero (art. 12, §2º); arredondamento pelo Anexo III da IN 75 na paráfrase do gabarito — ≥ 10: inteiro; 1 a 10: uma casa (inteiro se a casa for 0); < 1 em g: uma casa; < 1 em mg/µg: duas casas (uma se a segunda for 0) — regra não confirmada literalmente, ver pendência do gabarito; %VD arredondado ao inteiro (convenção; a regra literal de arredondamento do %VD não consta do gabarito). O valor energético seguiu as mesmas faixas (o gabarito diz não haver linha própria, sem confirmação literal). Rodapé literal do art. 12, §5º da RDC 429/2020.

## 6. Lista de ingredientes proposta

Ordem decrescente de massa por porção (massa do insumo comercial, não do elemento), nomes técnicos e INS dos aditivos, seguida da declaração de alergênicos (RDC 26/2015).

> Bitartarato de colina, L-tirosina, óxido de magnésio, L-teanina de folhas de Camellia sinensis, L-carnitina, antiumectante dióxido de silício (INS 551), mio-inositol, colecalciferol (vitamina D3), cloridrato de piridoxina (vitamina B6), metilcobalamina (vitamina B12) e cápsula: gelatina, água purificada e corante dióxido de titânio (INS 171).

Nenhum insumo deriva dos alergênicos da RDC 26/2015 (a L-tirosina em uso é declarada 'vegetal' no laudo 91382; a L-tirosina alternativa da Lepuge, AUTO039445, é de 'extração animal' — se for usada, verificar a fonte). Sem declaração de glúten até laudo do produto acabado.

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
- "Este produto não deve ser consumido por gestantes, lactantes e crianças." — IN 28/2018, Anexo VI, exigida pelas linhas "Aminoácidos" (tirosina, teanina), "Carnitina" e "Inositol" (IN 102/2021). Texto idêntico.

**O que falta hoje no cadastro/rótulo:** nada falta em texto; o campo `warnings` do banco traz a frase genérica e as três do art. 14, mais uma frase não obrigatória ('O consumo deste produto deve ser acompanhado da ingestão de hábitos alimentares saudáveis') que pode ficar.

## 8. Pendências e decisões do dono/RT

1. **Porção — decisão do dono:** com 2 cápsulas, a colina cai de 470 para 130 mg (o nome do produto é 'Focus Colina'). Alternativas: 3 cápsulas (colina ≈ 290 mg) ou 4 cápsulas (colina 470 mg, como o rótulo) — ver alternativas. A fábrica já desenhou uma versão em pó solúvel (5 g e 10 g por dose) com tirosina e magnésio nos mínimos exatos — outra saída.
2. **L-teanina — decisão do dono:** rota B (proposta: comprar a de folhas de Camellia sinensis, especificação Blue California, com laudo de origem) ou rota A (retirar; libera 115 mg para a colina, que subiria para ~180 mg).
3. **Comprar óxido de magnésio** com laudo (recalcular 116,08 mg pelo teor).
4. **Vitamina B12:** confirmar no corpo do laudo 219376 a umidade (9,07%) que o memorial usa; o rótulo deve passar de 'cianocobalamina' para 'metilcobalamina'.
5. **Rótulo:** atualizar colina (130 mg), tirosina (290 mg), magnésio (70 mg, óxido); nomear 'L-teanina de folhas de Camellia sinensis'; retirar 'celulose microcristalina'; declarar colina, tirosina, teanina, carnitina e inositol na tabela nutricional (o rótulo vigente só lista Mg, B6, B12 e D); confirmar lauril sulfato de sódio na cápsula.

**Alternativas registradas (não são a proposta principal):**

- **3 cápsulas por porção (1,5 g):** mesmos ativos com colina 290 mg (714,1 mg de bitartarato); soma ≈ 1.363 mg + 137 mg de excipiente. Mudança de porção é decisão do dono.
- **4 cápsulas por porção (2 g):** colina 470 mg como no rótulo (1.157,35 mg de bitartarato); soma ≈ 1.806 mg + 194 mg de excipiente — a única forma de manter os 470 mg em cápsula.
- **Magnésio via bisglicinato de magnésio** (231,6 mg a 30,22%, laudo novo) em vez do óxido: cabe só se a colina cair para ~90 mg em 2 cápsulas.
- **Rota A da L-teanina (retirar):** colina sobe para ~180 mg em 2 cápsulas (446 mg de bitartarato); veredito condicionado só ao óxido de magnésio.

## 9. Veredito esperado após a reformulação

**CONFORME CONDICIONADO A (laudo de origem Camellia sinensis da L-teanina nova; laudo de óxido de magnésio) — com a decisão do dono sobre a dose de colina (130 mg em 2 cápsulas)**

Com a composição da seção 3, tirosina e magnésio saem de baixo do mínimo (290 mg e 70 mg, 110% e 111% dos mínimos), nenhuma dose crava o teto (a mais alta é a teanina, 46%), e a porção — que no memorial estava em 181,8% — fecha em 1.000 mg com 3,1% de excipiente, ao custo de reduzir a colina para 130 mg. Duas condições de laudo restam (teanina de origem vegetal, óxido de magnésio). A dose de colina é decisão do dono, com as alternativas de 3 e 4 cápsulas registradas.

---

**Arquivos-fonte (caminhos absolutos):**

- `/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/IN28-2018-ANEXO-I-LITERAL.md`
- `/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/IN28-2018-ANEXO-III-LITERAL.md`
- `/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/IN28-2018-ANEXOS-IV-V-VI-LITERAL.md`
- `/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/AUDITORIA-ROTULO-VS-ANVISA-2026-09-15.md (seção 4.9)`
- `/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/composicoes_rotulo.json (chave focus_colina)`
- `/private/tmp/claude-501/-Users-diegofrancisco-Downloads-erp-espa-o/c5ed6b00-4553-4992-b469-c649af084651/scratchpad/fase1/memoriais-formulacoes.json (chave focus-colina — MEMORIAL-CALCULO-FOCUS-COLINA-rev02.docx)`
- `/private/tmp/claude-501/-Users-diegofrancisco-Downloads-erp-espa-o/c5ed6b00-4553-4992-b469-c649af084651/scratchpad/fase1/laudos.json (índices 6, 17, 30, 37, 49, 190, 197, 203)`
- `/Users/diegofrancisco/Desktop/LAUDOS/VITAMINA D3 COLECALCIFEROL.pdf (compilação Lepuge; bloco L-TEANINA lote AUTO039250: 'SÍNTESE QUÍMICA')`
- `/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/PADRAO-ANVISA-TABELA-NUTRICIONAL-2026-09-16.md e scratchpad/padrao-anvisa/vd.json`
- `cadastro vivo: formulas?slug=eq.focus-colina e formula_compositions (9 linhas ativas, lidas em 16/09/2026 — cadastro-teto: tirosina 262,5, Mg 63, D3 50, B12 9,94)`
