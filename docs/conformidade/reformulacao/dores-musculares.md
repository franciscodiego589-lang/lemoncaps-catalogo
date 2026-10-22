# Reformulação regulatória — DORES MUSCULARES (`dores-musculares`)

**Data:** 16/09/2026. **Fase 2 da conformidade do catálogo Lemon Caps** (ordem do dono: "altere os insumos para os permitidos; pode refazer as formulações para todas estarem dentro das normas"). Documento para o dono e para o RT (Anderson C. Barbosa, CRF/MT 5526). Nada foi gravado no banco; as três entregas deste produto são este memorial, o JSON `scratchpad/fase2/dores-musculares.json` e o fragmento SQL `scratchpad/fase2/dores-musculares.sql`, todos criados em disco e não aplicados.

**Fontes usadas (todas lidas nesta data, caminhos absolutos no rodapé):** IN 28/2018 nos anexos literais I, III, IV e VI (texto consolidado vigente até a IN 450/2026, lido em 16/09/2026); auditoria de 15/09/2026; composição do rótulo (`composicoes_rotulo.json`, extração de 13/09/2026); memorial de cálculo da fábrica (`memoriais-formulacoes.json`, 16/09/2026); inventário de laudos (`laudos.json`, 308 certificados, 16/09/2026); gabarito da tabela nutricional (RDC 429/2020 + IN 75/2020, 16/09/2026) e `vd.json`; cadastro vivo do catálogo (chave pública, lido em 16/09/2026).

**Convenção de procedência, em todo número deste documento:** *lido* = copiado da fonte nomeada; *calculado* = conta aritmética mostrada; *assumido* = marcado como tal ao lado do número (teor estequiométrico do sal puro quando não há laudo). Dado não confirmado fica marcado **PROVISÓRIO** ou **PENDENTE**.

## 1. Identificação

- **Nome:** DORES MUSCULARES (nome no rótulo/mercado: Nuviart (arte Nuviart.pdf)).
- **Slug:** `dores-musculares`.
- **Formato:** cápsula gelatinosa dura, tamanho 0 (memorial rev02).
- **Porção declarada:** 1 g (2 cápsulas) — 1.000 mg de conteúdo por porção (500 mg de pó por cápsula; cápsula vazia de 98,45 mg fora da porção). Sem mudança de porção proposta.
- **Público-alvo / grupo populacional dos Anexos III e IV:** adultos, coluna "> 19 anos" dos Anexos III e IV.
- **Porções por embalagem:** 30.

O rótulo vigente (Nuviart.pdf) se contradiz em sal × elemento (zinco e ferro), omite o cálcio da tabela, imprime a vitamina D como '50 mg' e não declara alergênicos. O memorial rev02 soma 1.235,84 mg para uma porção de 1.000 mg (123,6%) e pesa 350 mg de MSM onde o rótulo diz 250. Esta reformulação parte do rótulo para as doses declaradas e do memorial para massas e laudos.

## 2. Antes — composição atual e veredito da auditoria por insumo

Fonte da tabela: composição impressa no rótulo (`composicoes_rotulo.json`, chave `nuviart`, 14 itens), com o veredito da auditoria de 15/09/2026 (seção 4.14) e a observação do memorial rev02.

| # | Insumo (como está na fonte) | Quantidade | Veredito da auditoria (15/09/2026) e observação do memorial da fábrica |
|---|---|---|---|
| 1 | Metilsulfonilmetano (MSM) | 250 mg | CONFORME (27,8% do teto). Memorial rev02 pesa 352,86 mg (350 mg); cadastro: 480,5 mg. |
| 2 | Sulfato de glucosamina | 200 mg | NÃO VERIFICADO (forma incompleta no rótulo). Memorial e laudo 212517: 'sulfato de glucosamina com cloreto de potássio' — forma do Anexo I (IN 418/2025); alergênico crustáceo não declarado. |
| 3 | Ácido ascórbico | 140 mg (140% VD) | CONFORME. Memorial: 140,70 mg. |
| 4 | Colágeno hidrolisado | 100 mg | ABAIXO DO MÍNIMO (8,4 g de proteínas; 1,2% do mínimo). |
| 5 | Carbonato de cálcio (sal) | 100 mg | ABAIXO DO MÍNIMO: 40 mg de Ca no melhor caso (37,92% pelo laudo 950403 = 37,9 mg) contra 180 mg. Cálcio não declarado na tabela. |
| 6 | Bisglicinato de magnésio (sal) | 100 mg | ABAIXO DO MÍNIMO: 30,22 mg de Mg (memorial) contra 63 mg; laudo 90844 vencido. |
| 7 | Colágeno tipo II não desnaturado | 40 mg | CONFORME (≥ 1,2 mg) se for 'colágeno de frango… não desnaturado'; o laudo AUTO040251 não prova a identidade (bifurcação regulatória do próprio memorial) e declara 'pode conter leite, lactose e peixe'. |
| 8 | DL-alfa-tocoferol | 20 mg (133% VD) | CONFORME. Memorial: 60 mg de pó de acetato a 50,7% × 0,67 = 20,39 mg — nome do insumo errado no rótulo. |
| 9 | Bisglicinato de zinco 10 mg (composição) × Zinco 10 mg (tabela) | 10 mg | CONFORME nas duas leituras; contradição sal × elemento. Memorial: 50,28 mg de sal = 10 mg de Zn. |
| 10 | Bisglicinato de ferro 8 mg (composição) × Ferro 8 mg (tabela) | 8 mg | NÃO VERIFICADO (sal × elemento). Memorial: 39,80 mg de 'Quelato Ferro Bios 20%' = 8 mg de Fe; laudo sem identidade química. |
| 11 | Cloridrato de piridoxina | 1,3 mg (100% VD) | CONFORME. Memorial: 1,58 mg. |
| 12 | Selênio quelado | 100 mcg (167% VD) | FORMA NÃO AUTORIZADA (glicinato de selênio, lote 044152). |
| 13 | Colecalciferol | 50 mcg (1000% VD na tabela, impressa como '50 mg') | CONFORME — igual ao máximo; erro de unidade (mg × mcg) e %VD pelo VDR revogado na tabela do rótulo. |
| 14 | Metilcobalamina | 9,94 mcg (414% VD) | CONFORME — igual ao máximo. |

Soma impressa 969,46 mg; memorial rev02 1.235,84 mg (não cabe). Três constituintes abaixo do mínimo (colágeno hidrolisado, cálcio, magnésio), uma forma não autorizada (selênio), duas identidades não provadas (colágeno tipo II, ferro) e dois no teto exato (D3, B12).

## 3. Depois — composição proposta, insumo a insumo

Grupo "> 19 anos". Doses do rótulo mantidas onde já estão na faixa; magnésio levado ao mínimo com folga; cálcio e colágeno hidrolisado retirados por não chegarem ao mínimo em cápsula; D3 e B12 tiradas do teto.

| # | Constituinte (Anexo I) | Forma / insumo comercial | Massa do insumo (mg/porção) | Teor (% e fonte) | Ativo por porção | Mín. | Máx. | % do máx. | Linha do anexo | Laudo (lote · validade · vencido?) | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Metilsulfonilmetano | Metilsulfonilmetano (CAS 67-71-0) | 250,175 | 99,93% — laudo lote 950413 (o memorial pesa o lote 222159, 99,19% — conferir estoque) | 250,000 mg | NE | 900,00 mg | 27,8% | I·Metilsulfonilmetano (IN 76/2020); III·NE; IV·900 mg | 950413 (Analitic, fabricante 20241221) · 20/12/2029 · em dia | mantido (dose do rótulo) |
| 2 | Glucosamina | Sulfato de glucosamina com cloreto de potássio (CAS 1296149-08-0; fórmula (C6H14NO5)2SO4·2KCl) | 197,433 | 101,30% tal qual — laudo lote 25G03-B055-212517 (101,71% b.s., HPLC × (1 − 0,40%)), lido por imagem em 16/09; ativo = 59,18% de glucosamina no sal (estequiométrico) | 118,361 mg | NE | 750,00 mg | 15,8% | I·Sulfato de glucosamina com cloreto de potássio (IN 418/2025); III·Glucosamina NE; IV·750 mg | 25G03-B055-212517 (SM Empreendimentos, fabricante TSM-K-2504006) · 16/04/2028 · em dia | mantido (declaração corrigida) |
| 3 | Vitamina C | Ácido ascórbico (CAS 50-81-7) | 140,704 | 99,5% — laudo lote 950467 | 140,000 mg | 13,50 mg | 1.916,02 mg | 7,3% | I·Ácido ascórbico/Ácido L-ascórbico; III/IV·Vitamina C | 950467 (Analitic, fabricante 250306-C01) · 05/03/2029 · em dia | mantido |
| 4 | Magnésio | Óxido de magnésio (MgO, CAS 1309-48-4) — insumo a adquirir | 116,078 | 60,30% Mg — assumido (estequiométrico); sem laudo | 70,000 mg | 63,00 mg | 350,00 mg | 20,0% | I·Óxido de magnésio; III/IV·Magnésio | sem laudo — insumo a adquirir | forma trocada + dose ajustada |
| 5 | Vitamina E | Acetato de DL-alfa-tocoferol, pó 50% (CAS 7695-91-2) | 60,000 | 50,7% de acetato — laudo lote 91320; × 0,67 | 20,381 mg | 2,25 mg | 1.000,00 mg | 2,0% | I·Acetato de DL-alfa-tocoferol; III/IV·Vitamina E (como α-tocoferol) | 91320 (Analitic, fabricante 2025040605) · 05/04/2028 · em dia | mantido (nome corrigido) |
| 6 | Zinco | Bisglicinato de zinco (CAS 14281-83-5) | 50,277 | 19,89% Zn tal qual — laudo lote 055-ZN/25 | 10,000 mg | 1,65 mg | 29,59 mg | 33,8% | I·Bisglicinato de zinco; III/IV·Zinco | 055-ZN/25 (Galena, CIQ 2505027507) · 06/05/2027 · em dia — resultado 20,00% no limite inferior da especificação 20,00–23,00% | mantido (declaração corrigida) |
| 7 | Colágeno tipo II não desnaturado | Colágeno de frango com colágeno tipo II não desnaturado — PENDENTE ficha do fabricante (laudo Lepuge AUTO040251: 'COLAGENO T II', fermentação biológica, proteína 67,60%, sem doseamento) | 40,000 | nominal 1:1 — o laudo não traz doseamento de colágeno tipo II nem declara 'não desnaturado' nem 'frango' | 40,000 mg | 1,20 mg | NE | — | I·Colágeno de frango com colágeno tipo II não desnaturado (IN 76/2020); III·1,2 mg; IV·NE | AUTO040251 (Lepuge, fabricante CJ24110710) · 06/11/2026 · em dia — sem doseamento; sem nome do fabricante; 'forma de obtenção: fermentação biológica'; 'pode conter leite, lactose e peixe' | mantido — PENDENTE identidade |
| 8 | Ferro | Bisglicinato ferroso (CAS 20150-34-9) — PENDENTE: o insumo pesado é 'Quelato Ferro Bios 20%' (NaturalPRO NPT.0525/710), sem identidade química declarada | 39,801 | 20,1% Fe — laudo lote NPT.0525/710 (lido por imagem em 16/09: teor de ferro 20,1%, umidade 1,0%, val. 05/2027) — PROVISÓRIO quanto à forma | 8,000 mg | 2,70 mg | 34,31 mg | 23,3% | I·Bisglicinato ferroso; III/IV·Ferro | NPT.0525/710 (NaturalPRO) · 05/2027 · em dia — produto 'Quelato Ferro Bios 20%': identidade química (bisglicinato?) não declarada; sem CAS | mantido — PENDENTE identidade |
| 9 | Vitamina D | Vitamina D3 (colecalciferol), pó 100.000 UI/g (CAS 67-97-0) | 13,913 | 115.000 UI/g — laudo lote 91408; 1 µg = 40 UI | 40,000 µg | 3,00 µg | 50,00 µg | 80,0% | I·Vitamina D3 (Colecalciferol); III/IV·Vitamina D | 91408 (Analitic, fabricante 2025111601) · 15/11/2028 · em dia | dose ajustada |
| 10 | Vitamina B6 | Cloridrato de piridoxina (CAS 58-56-0) | 1,582 | 99,9% — laudo lote 91188; × 82,27% | 1,300 mg | 0,26 mg | 98,60 mg | 1,3% | I·Cloridrato de piridoxina; III/IV·Vitamina B6 | 91188 (Analitic, fabricante 241229T092) · 28/12/2027 · em dia | mantido |
| 11 | Selênio | Selenito de sódio (CAS 10102-18-8) — insumo a adquirir | 0,219 | 45,66% Se — assumido (estequiométrico); sem laudo | 100,000 µg | 8,25 µg | 319,75 µg | 31,3% | I·Selenito de sódio; III/IV·Selênio | sem laudo — insumo a adquirir | forma trocada |
| 12 | Vitamina B12 | Metilcobalamina (CAS 13422-55-4) | 0,009 | 89,27% tal qual — laudo lote 219376 | 8,000 µg | 0,36 µg | 9,94 µg | 80,5% | I·Metilcobalamina; III/IV·Vitamina B12 | 219376 (26B20-B032-219376, Fagron/SM, fabricante 032511057) · 14/11/2030 · em dia | dose ajustada |

**Excipientes e veículo (não são constituintes; conferidos contra a IN 211/2023 na auditoria de 15/09 apenas para o dióxido de silício, ácido cítrico, sucralose e corantes — os demais estão marcados como pendência de conferência):**

- Dióxido de silício (antiumectante) (INS 551) — 89,81 mg — q.s.p. 1.000 mg — quantum satis (IN 211/2023, 14.2). O memorial rev02 tinha 0,00 mg de espaço para excipiente (fórmula em 123,6% da porção).
- Cápsula: gelatina, água purificada e corante dióxido de titânio (INS 171) — q.s.p. — invólucro de 98,45 mg (Qualicaps/Genix, lote 2505380SA); não conta na porção

**Soma da porção:** insumos 910,19 mg + excipientes 89,81 mg = **1.000,00 mg de 1.000 mg (100,0%)**. Cabe, com 9,0% de excipiente — o memorial rev02 estava em 123,6% da porção.

**Retirados da fórmula:**

- **Colágeno hidrolisado (Peptan) 100 mg — retirado.** Única entrada do Anexo I é 'Gelatina hidrolisada/Colágeno hidrolisado' em Proteínas, mínimo 8,4 g (1,2% do mínimo); inviável em cápsula (princípio 6).
- **Carbonato de cálcio 100 mg — retirado.** Entrega 37,9 mg de Ca (laudo 950403: 37,92%), 21% do mínimo de 180 mg; para atingir o mínimo com folga (200 mg de Ca) seriam necessários 527 mg de carbonato — não cabem ao lado dos demais ativos. Retirado como insumo secundário (princípio 5); alternativa na seção 8.
- **Glicinato de selênio 35,79 mg** → selenito de sódio; **bisglicinato de magnésio 100 mg** (laudo vencido, abaixo do mínimo) → óxido de magnésio 70 mg de Mg.

## 4. Mudanças e motivos

- Colágeno hidrolisado 100 mg: retirado — mínimo de 8,4 g (Anexo III, Proteínas).
- Carbonato de cálcio 100 mg: retirado — 37,9 mg de Ca contra 180 mg de mínimo; a massa para o mínimo (≥ 475 mg de carbonato) não cabe em 1 g.
- Magnésio: bisglicinato 100 mg (30,22 mg de Mg, laudo vencido) → óxido de magnésio 116,08 mg (70 mg de Mg) — motivo: mínimo de 63 mg (Anexo III) com folga de 11%; o bisglicinato para 70 mg pesaria 231,6 mg e não caberia. Insumo a adquirir.
- Selênio: 'selênio quelado' (glicinato) → selenito de sódio, 100 µg — forma do Anexo I. Insumo a adquirir.
- Glucosamina: nome completo do Anexo I ('sulfato de glucosamina com cloreto de potássio') e declaração do ativo (118 mg de glucosamina); alergênico crustáceo declarado.
- Colágeno tipo II: mantido a 40 mg, condicionado à ficha do fabricante (origem frango, forma não desnaturada) — sem ela, retirar; alergênicos do laudo ('pode conter leite, lactose e peixe') declarados.
- Ferro: 8 mg de ferro elemento (declaração corrigida); insumo condicionado à declaração de identidade (bisglicinato ferroso) do fabricante NaturalPRO ou à compra de bisglicinato ferroso com laudo.
- Zinco: declarado como elemento (10 mg) — a composição dizia 'bisglicinato de zinco 10 mg'.
- MSM: fixado no valor do rótulo (250 mg) — o memorial pesa 350 e o cadastro diz 480,5.
- Vitamina D3 50 → 40 µg e vitamina B12 9,94 → 8 µg — teto exato sem folga; corrigir '50 mg'/'1000%' da tabela do rótulo.
- Vitamina E: nome do insumo corrigido para acetato de DL-alfa-tocoferol (20 mg de α-tocoferol).
- Vitamina C e B6: mantidas.

## 5. Tabela nutricional no padrão ANVISA vigente (RDC 429/2020 + IN 75/2020)

Coluna "> 19 anos" do Anexo VIII da IN 75/2020. MSM, glucosamina e colágeno tipo II sem VDR (células vazias).

**INFORMAÇÃO NUTRICIONAL**

Porções por embalagem: 30
Porção: 1 g (2 cápsulas)

| Item | Quantidade por porção | %VD* (adultos) |
|---|---|---|
| Valor energético | 0,1 kcal = 0,5 kJ  | 0% |
| Carboidratos | 0 g | 0% |
| Açúcares totais | 0 g | 0% |
| Açúcares adicionados | 0 g | 0% |
| Proteínas | 0 g | 0% |
| Gorduras totais | 0 g | 0% |
| Gorduras saturadas | 0 g | 0% |
| Gorduras trans | 0 g | 0% |
| Fibras alimentares | 0 g | 0% |
| Sódio | 0,06 mg | 0% |
| Vitamina D | 40 µg | 267% |
| Vitamina E | 20 mg | 136% |
| Vitamina C | 140 mg | 140% |
| Vitamina B6 | 1,3 mg | 100% |
| Vitamina B12 | 8 µg | 333% |
| Ferro | 8 mg | 57% |
| Magnésio | 70 mg | 17% |
| Selênio | 100 µg | 167% |
| Zinco | 10 mg | 91% |
| Metilsulfonilmetano | 250 mg |  |
| Glucosamina | 118 mg |  |
| Colágeno tipo II não desnaturado | 40 mg |  |

*Percentual de valores diários fornecidos pela porção

**Conta do valor energético e do sódio (calculado):** Valor energético calculado (fatores de Atwater da IN 75/2020, Anexo XXII: proteínas e carboidratos 4 kcal/g = 17 kJ/g; gorduras 9 kcal/g = 37 kJ/g): proteínas 27,0 mg → 0,11 kcal; carboidratos 0,0 mg → 0,00 kcal; gorduras 0,0 mg → 0,00 kcal; total 0,11 kcal = 0,46 kJ. Sódio calculado: 0,06 mg. Proteínas: colágeno tipo II 40 mg × 67,60% de proteína (laudo) = 27,0 mg — 0,1 kcal; glucosamina não contada como carboidrato (aminoaçúcar; assunção registrada). Sódio: só do selenito (0,06 mg).

**Regras aplicadas (gabarito de 16/09/2026):** título "INFORMAÇÃO NUTRICIONAL"; porção = recomendação diária (RDC 429/2020, art. 9º, VI); %VD pelo Anexo VIII da IN 75/2020 para o grupo do rótulo (art. 12, §4º); constituinte sem VDR fica com a célula de %VD vazia (art. 12, §1º); quantidade não significativa (Anexo IV da IN 75: ≤ 4 kcal, ≤ 0,5 g de carboidratos/açúcares/proteínas/gorduras totais, ≤ 0,1 g de saturadas/trans, ≤ 5 mg de sódio) recebe %VD zero (art. 12, §2º); arredondamento pelo Anexo III da IN 75 na paráfrase do gabarito — ≥ 10: inteiro; 1 a 10: uma casa (inteiro se a casa for 0); < 1 em g: uma casa; < 1 em mg/µg: duas casas (uma se a segunda for 0) — regra não confirmada literalmente, ver pendência do gabarito; %VD arredondado ao inteiro (convenção; a regra literal de arredondamento do %VD não consta do gabarito). O valor energético seguiu as mesmas faixas (o gabarito diz não haver linha própria, sem confirmação literal). Rodapé literal do art. 12, §5º da RDC 429/2020.

## 6. Lista de ingredientes proposta

Ordem decrescente de massa por porção (massa do insumo comercial, não do elemento), nomes técnicos e INS dos aditivos, seguida da declaração de alergênicos (RDC 26/2015).

> Metilsulfonilmetano (MSM), antiumectante dióxido de silício (INS 551), sulfato de glucosamina com cloreto de potássio, ácido ascórbico (vitamina C), óxido de magnésio, acetato de DL-alfa-tocoferol (vitamina E), bisglicinato de zinco, colágeno de frango com colágeno tipo II não desnaturado, bisglicinato ferroso, colecalciferol (vitamina D3), cloridrato de piridoxina (vitamina B6), selenito de sódio, metilcobalamina (vitamina B12) e cápsula: gelatina, água purificada e corante dióxido de titânio (INS 171). ALÉRGICOS: CONTÉM CRUSTÁCEOS (glucosamina). PODE CONTER LEITE E PEIXE (colágeno tipo II, conforme laudo do fornecedor). CONTÉM LACTOSE (a confirmar — ver alergênicos).

Alergênicos (RDC 26/2015): a glucosamina é de crustáceos segundo o memorial rev02 (o laudo SM não declara a origem; o dossiê IDNLABS de outro lote declara 'origem animal') — declarar "CONTÉM CRUSTÁCEOS" até prova de origem fermentativa. O laudo do colágeno tipo II (AUTO040251) diz literalmente "ALERGICOS, PODE CONTER LEITE, LACTOSE E PEIXE" — declarar "PODE CONTER LEITE E PEIXE"; a declaração de lactose (RDC 135/2017) depende do teor e não foi conferida nesta etapa — PENDENTE.

## 7. Advertências obrigatórias

**Texto proposto para o rótulo e para o campo `warnings` (as frases do art. 14, I, c/d/e da RDC 243/2018 vão em destaque e negrito):**

> Este produto não é um medicamento.
> Não exceder a recomendação diária de consumo indicada na embalagem.
> Mantenha fora do alcance de crianças.
> Público indicado: adultos (19 anos ou mais). Ingerir 2 cápsulas ao dia.
> Este produto não deve ser consumido por gestantes, lactantes e crianças. Pessoas com enfermidades e/ou sob o uso de medicamentos, consulte seu médico.
> Conservar o produto em local seco, fresco e arejado, ao abrigo da luz e do calor excessivo, em temperatura ambiente entre 15 °C e 30 °C. Após aberto, consumir em até 60 dias. Não consumir se o lacre de segurança estiver violado.

**Base de cada frase:**

- Três frases do art. 14, I, c/d/e da RDC 243/2018 (texto literal); grupo e frequência — art. 14, I, a/b; conservação — art. 14, II.
- "Este produto não deve ser consumido por gestantes, lactantes e crianças. Pessoas com enfermidades e/ou sob o uso de medicamentos, consulte seu médico." — IN 28/2018, Anexo VI, linha "Glucosamina" (IN 304/2024). A primeira oração é a mesma exigida pelas linhas "… Colágeno tipo II não desnaturado / … / Metilsulfonilmetano …" (IN 76/2020); a segunda oração ("Pessoas com enfermidades…") é exclusiva da glucosamina.

**O que falta hoje no cadastro/rótulo:** a segunda oração da advertência da glucosamina ("Pessoas com enfermidades e/ou sob o uso de medicamentos, consulte seu médico.") não está no campo `warnings` nem no rótulo; os alergênicos (crustáceos; leite/lactose/peixe) não estão declarados em lugar nenhum — o memorial rev02 classifica isso como a não conformidade mais grave do produto.

## 8. Pendências e decisões do dono/RT

1. **Colágeno tipo II — ficha do fabricante (via Lepuge):** origem (frango, esterno), forma não desnaturada, nome do fabricante e doseamento. Sem isso o constituinte não pode ser afirmado como 'colágeno de frango com colágeno tipo II não desnaturado' e deve sair. O laudo vence em 06/11/2026.
2. **Ferro — identidade química:** obter da NaturalPRO a declaração de que 'Quelato Ferro Bios 20%' é bisglicinato ferroso (CAS 20150-34-9); senão comprar bisglicinato ferroso com laudo (os da máquina venceram em 2022/2023).
3. **Comprar óxido de magnésio e selenito de sódio** com laudo; recalcular massas pelo teor.
4. **Cálcio — decisão do dono:** retirado nesta proposta. Alternativa: manter cálcio só se a porção subir para 3 cápsulas (ver alternativas).
5. **Glucosamina — origem:** pedir ao fabricante (TSM, via SM Empreendimentos) a declaração de origem (crustáceo ou fermentação); enquanto não vier, declarar 'contém crustáceos'.
6. **Lactose:** conferir com o RT a obrigação de declaração (RDC 135/2017) diante do 'pode conter lactose' do laudo do colágeno tipo II.
7. **MSM:** conferir lote em estoque (950413 ou 222159) — massa muda 1,9 mg.
8. **Rótulo:** corrigir 'colecalciferol 50 mg / 1000%' na tabela (correto: 40 µg / 267%); declarar magnésio (70 mg) e retirar cálcio e colágeno hidrolisado; nomear 'acetato de DL-alfa-tocoferol'; declarar glucosamina (118 mg) e a forma completa; declarar zinco e ferro como elementos; alergênicos; advertência completa da glucosamina.

**Alternativas registradas (não são a proposta principal):**

- **3 cápsulas por porção (1,5 g):** permitiria manter cálcio a 200 mg (527,4 mg de carbonato de cálcio a 37,92%, laudo válido 950403) com o óxido de magnésio — soma ≈ 1.438 mg + 62 mg de excipiente (4,2%). Com bisglicinato de magnésio no lugar do óxido (231,6 mg) a soma iria a ≈ 1.553 mg e não caberia nem em 3 cápsulas. Mudança de porção é decisão do dono.
- **Magnésio via bisglicinato em 2 cápsulas:** só cabe se o MSM cair para ~150 mg; não proposto porque muda o ativo principal.
- **L-selenometionina** em vez de selenito (forma também autorizada) — exige compra com laudo que declare a forma.

## 9. Veredito esperado após a reformulação

**CONFORME CONDICIONADO A (ficha do fabricante do colágeno tipo II; identidade do ferro; laudos de óxido de magnésio e selenito de sódio; declaração de origem da glucosamina)**

Com a composição da seção 3 (12 constituintes), nenhum fica abaixo do mínimo (o magnésio passou de 48% para 111% do mínimo; cálcio e colágeno hidrolisado, que nunca chegariam ao mínimo em cápsula, saíram), nenhum crava o teto (o mais alto é a vitamina B12, 80,5%), o selênio ganhou forma autorizada e a porção fecha em 1.000 mg com 9,0% de excipiente. Três identidades químicas dependem do fornecedor (colágeno tipo II, ferro, glucosamina-origem) e dois insumos precisam ser comprados com laudo (óxido de magnésio, selenito). Rotulagem: alergênicos e advertência da glucosamina são obrigatórios e hoje faltam.

---

**Arquivos-fonte (caminhos absolutos):**

- `/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/IN28-2018-ANEXO-I-LITERAL.md`
- `/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/IN28-2018-ANEXO-III-LITERAL.md`
- `/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/IN28-2018-ANEXOS-IV-V-VI-LITERAL.md`
- `/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/AUDITORIA-ROTULO-VS-ANVISA-2026-09-15.md (seção 4.14)`
- `/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/composicoes_rotulo.json (chave nuviart)`
- `/private/tmp/claude-501/-Users-diegofrancisco-Downloads-erp-espa-o/c5ed6b00-4553-4992-b469-c649af084651/scratchpad/fase1/memoriais-formulacoes.json (chave dores-musculares — MEMORIAL-CALCULO-NUVIART-rev02.docx)`
- `/private/tmp/claude-501/-Users-diegofrancisco-Downloads-erp-espa-o/c5ed6b00-4553-4992-b469-c649af084651/scratchpad/fase1/laudos.json (índices 8, 11, 36, 52, 134, 154, 189, 190, 197, 201, 203, 204, 210, 213)`
- `/Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/08_NUVIART/ARQUIVOS-PDF/09_laudo_quelato-ferro-bios-20_lote-NPT0525-710.pdf (lido por imagem em 16/09/2026: 'Quelato Ferro Bios 20%', teor de ferro 20,1%, val. 05/2027)`
- `/Users/diegofrancisco/Downloads/MEMORIAIS_2026 2/08_NUVIART/ARQUIVOS-PDF/02_laudo_glucosamina-sulf-potassio_lote-212517.pdf (lido por imagem em 16/09/2026: SM Empreendimentos, CAS 1296149-08-0, teor 101,71% b.s., val. 16/04/2028)`
- `/Users/diegofrancisco/Desktop/LAUDOS/VITAMINA D3 COLECALCIFEROL.pdf (compilação Lepuge; bloco COLAGENO T II lote AUTO040251: fermentação biológica, proteína 67,60%, 'PODE CONTER LEITE, LACTOSE E PEIXE')`
- `/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/PADRAO-ANVISA-TABELA-NUTRICIONAL-2026-09-16.md e scratchpad/padrao-anvisa/vd.json`
- `cadastro vivo: formulas?slug=eq.dores-musculares e formula_compositions (12 linhas ativas, lidas em 16/09/2026)`
