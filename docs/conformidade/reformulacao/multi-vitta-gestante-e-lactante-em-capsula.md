# Reformulação regulatória — Multi Vitta — Gestante e Lactante em Cápsula (`multi-vitta-gestante-e-lactante-em-capsula`)

**Data:** 16/09/2026. **Fase 2 da conformidade do catálogo Lemon Caps** (ordem do dono: "altere os insumos para os permitidos; pode refazer as formulações para todas estarem dentro das normas"). Documento para o dono e para o RT (Anderson C. Barbosa, CRF/MT 5526). Nada foi gravado no banco; as três entregas deste produto são este memorial, o JSON `scratchpad/fase2/multi-vitta-gestante-e-lactante-em-capsula.json` e o fragmento SQL `scratchpad/fase2/multi-vitta-gestante-e-lactante-em-capsula.sql`, todos criados em disco e não aplicados.

**Fontes usadas (todas lidas nesta data, caminhos absolutos no rodapé):** IN 28/2018 nos anexos literais I, III, IV e VI (texto consolidado vigente até a IN 450/2026, lido em 16/09/2026); auditoria de 15/09/2026; composição do rótulo (`composicoes_rotulo.json`, extração de 13/09/2026); memorial de cálculo da fábrica (`memoriais-formulacoes.json`, 16/09/2026); inventário de laudos (`laudos.json`, 308 certificados, 16/09/2026); gabarito da tabela nutricional (RDC 429/2020 + IN 75/2020, 16/09/2026) e `vd.json`; cadastro vivo do catálogo (chave pública, lido em 16/09/2026).

**Convenção de procedência, em todo número deste documento:** *lido* = copiado da fonte nomeada; *calculado* = conta aritmética mostrada; *assumido* = marcado como tal ao lado do número (teor estequiométrico do sal puro quando não há laudo). Dado não confirmado fica marcado **PROVISÓRIO** ou **PENDENTE**.

## 1. Identificação

- **Nome:** Multi Vitta — Gestante e Lactante em Cápsula (nome no rótulo/mercado: Multi Vitta (sem arte de rótulo; sem memorial; sem ficha técnica — a única composição é o cadastro)).
- **Slug:** `multi-vitta-gestante-e-lactante-em-capsula`.
- **Formato:** cápsula (sem memorial: tamanho e capacidade não registrados; assumida a mesma cápsula tamanho 0 de 500 mg de pó dos demais produtos da linha).
- **Porção declarada:** 1 g (2 cápsulas) — 1.000 mg de conteúdo por porção (o cadastro diz 'Porção: 1 g (2 cápsulas)', 'Peso líquido: 30 g', '60 cápsulas'). Sem mudança de porção proposta.
- **Público-alvo / grupo populacional dos Anexos III e IV:** gestantes e lactantes — colunas "Gestantes" e "Lactantes" dos Anexos III e IV, aplicada a mais restritiva das duas a cada constituinte (mínimo = maior dos mínimos; máximo = menor dos máximos).
- **Porções por embalagem:** 30.

Não existe rótulo, memorial de cálculo, ficha técnica nem dossiê deste produto em nenhuma das pastas varridas em 16/09 — a composição de 12 linhas do cadastro (com 592 mg de dióxido de silício) é a única fonte, e ela é impossível na porção (o carbonato de cálcio para 300 mg de Ca pesa sozinho 791 mg). Público real: gestantes e lactantes (nome do produto), embora o cadastro diga 'adultos'.

## 2. Antes — composição atual e veredito da auditoria por insumo

Fonte da tabela: cadastro vivo do catálogo (`formula_compositions`, 12 linhas, lidas em 16/09/2026), com o veredito da auditoria de 15/09/2026 (Parte II, seção II.5), que já usou as colunas Gestantes e Lactantes.

| # | Insumo (como está na fonte) | Quantidade | Veredito da auditoria (15/09/2026) e observação do memorial da fábrica |
|---|---|---|---|
| 1 | Dióxido de silício (INS 551) | 592,14 mg | aditivo, quantum satis — 59,2% da cápsula, implausível como antiumectante (auditoria). |
| 2 | Cálcio elementar (carbonato de cálcio) | 300 mg | CONFORME (195–2.015); MAS 300 mg de Ca são 791 mg de carbonato (37,92%) — impossível na porção (auditoria: 144,9% a 161,0%). |
| 3 | Magnésio (bisglicinato de magnésio) | 60 mg | CONFORME — igual ao mínimo de gestantes (leitura como elemento); laudo do bisglicinato vencido. |
| 4 | Vitamina C (ácido ascórbico) | 20 mg | CONFORME (12,75/18 – 1.723/1.727). |
| 5 | Ferro (bisglicinato ferroso) | 8,1 mg | CONFORME como elemento; nenhum laudo vigente de bisglicinato ferroso na máquina. |
| 6 | Vitamina B3 (nicotinamida) | 8 mg | CONFORME (2,7/2,55 – 30). |
| 7 | Vitamina B5 (D-pantotenato de cálcio) | 5 mg | CONFORME, mas 91,1% do teto de lactantes (5,49) — acima da folga de 90%. |
| 8 | Vitamina E (acetato de DL-alfa-tocoferol) | 5 mg | CONFORME por 0,5 mg: 5 × 0,67 = 3,35 mg de α-tocoferol contra mínimo de 2,85 (lactantes). |
| 9 | Cobre (bisglicinato de cobre) | 900 mcg | CONFORME; sem laudo da forma. |
| 10 | Ácido fólico | 800 mcg | ACIMA DO MÁXIMO nos dois grupos: 1.333,3 µg DFE > 1.138,3 (gest.) e 1.162,3 (lact.). |
| 11 | Vitamina D (colecalciferol) | 50 mcg | CONFORME — igual ao máximo. |
| 12 | Vitamina B12 (metilcobalamina) | 10,46 mcg | gestantes: igual ao máximo; LACTANTES: ACIMA DO MÁXIMO (10,07). |

Soma como escrita: 1.000,0 mg; soma com os sais que entregam os elementos: 1.449 a 1.610 mg (144,9% a 161,0%). Dois constituintes acima do máximo (ácido fólico nos dois grupos; B12 em lactantes), dois no limite (magnésio no mínimo de gestantes; D3 no teto), um por 0,5 mg (vitamina E) e três sem laudo válido (magnésio, ferro, cobre).

## 3. Depois — composição proposta, insumo a insumo

Limites: para cada constituinte, o maior dos mínimos e o menor dos máximos entre Gestantes e Lactantes (Anexos III e IV). %VD nas duas colunas do Anexo VIII da IN 75/2020. Só os 11 constituintes que o cadastro quantifica entram.

| # | Constituinte (Anexo I) | Forma / insumo comercial | Massa do insumo (mg/porção) | Teor (% e fonte) | Ativo por porção | Mín. | Máx. | % do máx. | Linha do anexo | Laudo (lote · validade · vencido?) | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Cálcio | Carbonato de cálcio, grau DC (CAS 471-34-1) | 566,983 | 37,92% Ca — laudo lote 950403 (carbonato de cálcio 94,80%) | 215,000 mg | gest. 195,00 / lact. 195,00 mg | gest. 2.015,51 / lact. 2.082,58 mg | 10,7% | I·Carbonato de cálcio; III·Cálcio gest. 195 / lact. 195; IV·gest. 2.015,51 / lact. 2.082,58 | 950403 (Analitic, fabricante 241029) · 28/10/2029 · em dia | dose ajustada |
| 2 | Magnésio | Bisglicinato de magnésio (CAS 14783-68-7) | 218,398 | 30,22% Mg tal qual — laudo lote 90844, VENCIDO (21/06/2025) — último teor conhecido | 66,000 mg | gest. 60,00 / lact. 54,00 mg | gest. 350,00 / lact. 350,00 mg | 18,9% | I·Bisglicinato de magnésio; III·Magnésio gest. 60 / lact. 54; IV·350 / 350 | 90844 (Analitic, fabricante 66342023062230) · 21/06/2025 · VENCIDO — pedir laudo novo antes de pesar | dose ajustada |
| 3 | Vitamina C | Ácido ascórbico (CAS 50-81-7) | 20,101 | 99,5% — laudo lote 950467 | 20,000 mg | gest. 12,75 / lact. 18,00 mg | gest. 1.723,43 / lact. 1.726,73 mg | 1,2% | I·Ácido ascórbico/Ácido L-ascórbico; III·Vitamina C gest. 12,75 / lact. 18; IV·1.723,43 / 1.726,73 | 950467 (Analitic, fabricante 250306-C01) · 05/03/2029 · em dia | mantido |
| 4 | Ferro | Bisglicinato ferroso (CAS 20150-34-9) — insumo a adquirir com laudo (todos os laudos de bisglicinato ferroso da máquina estão vencidos) | 40,299 (a fase 2 propôs 39,980 com 20,26%) | 20,1% Fe — laudo NaturalPRO NPT.0525/710 ('Quelato Ferro Bios 20%', val. 05/2027; identidade química PENDENTE), **harmonizado na fase 3** (16/09/2026) com o Dores Musculares, único produto com referência de ferro não vencida; a fase 2 usava 20,26% do laudo SM 22A19-B061-087921 (VENCIDO em 18/11/2023); estequiométrico do sal puro seria 27,38% — PROVISÓRIO | 8,100 mg | gest. 4,05 / lact. 1,50 mg | gest. 34,71 / lact. 34,96 mg | 23,3% | I·Bisglicinato ferroso; III·Ferro gest. 4,05 / lact. 1,5; IV·34,71 / 34,96 | NPT.0525/710 · 05/2027 · em dia — identidade química PENDENTE; comprar bisglicinato ferroso com laudo | mantido — PENDENTE laudo |
| 5 | Niacina | Nicotinamida/Niacinamida (CAS 98-92-0) | 8,073 | 99,09% tal qual — laudo lote 872226 | 8,000 mg NE | gest. 2,70 / lact. 2,55 mg NE | gest. 30,00 / lact. 30,00 mg NE | 26,7% | I·Nicotinamida/Niacinamida; III·Niacina gest. 2,7 / lact. 2,55; IV·30 / 30 | 872226 (Alamar/INLAB, código 5710) · 09/2027 · em dia | mantido |
| 6 | Ácido pantotênico | D-pantotenato de cálcio (CAS 137-08-6) | 4,980 | 98,2% — laudo lote 91186; × 92,01% | 4,500 mg | gest. 0,90 / lact. 1,05 mg | gest. 5,83 / lact. 5,49 mg | 82,0% | I·D-pantotenato de cálcio; III·gest. 0,9 / lact. 1,05; IV·gest. 5,83 / lact. 5,49 | 91186 (Analitic, fabricante 241222X022) · 21/12/2027 · em dia | dose ajustada |
| 7 | Vitamina E | Acetato de DL-alfa-tocoferol, pó 50% (CAS 7695-91-2) | 14,719 | 50,7% de acetato — laudo lote 91320; × 0,67 | 5,000 mg | gest. 2,25 / lact. 2,85 mg | gest. 800,00 / lact. 800,00 mg | 0,6% | I·Acetato de DL-alfa-tocoferol; III·Vitamina E gest. 2,25 / lact. 2,85; IV·800 / 800 | 91320 (Analitic, fabricante 2025040605) · 05/04/2028 · em dia | dose ajustada |
| 8 | Cobre | Bisglicinato de cobre (CAS 13479-54-4) — insumo a adquirir | 2,998 | 30,02% Cu — assumido (estequiométrico); sem laudo | 900,000 µg | gest. 150,00 / lact. 195,00 µg | gest. 6.935,01 / lact. 7.036,33 µg | 13,0% | I·Bisglicinato de cobre; III·Cobre gest. 150 / lact. 195; IV·6.935,01 / 7.036,33 | sem laudo — insumo a adquirir | mantido — PENDENTE laudo |
| 9 | Ácido fólico | Ácido fólico/Ácido N-pteroil-L-glutâmico (CAS 59-30-3) | 0,551 | 90,67% tal qual — laudo lote AUTO039613 | 833,330 µg DFE | gest. 666,60 / lact. 75,00 µg DFE | gest. 1.138,30 / lact. 1.162,30 µg DFE | 73,2% | I·Ácido fólico; III·gest. 666,6 / lact. 75 µg DFE; IV·gest. 1.138,3 / lact. 1.162,3 µg DFE (nota iv) | AUTO039613 (Lepuge, fabricante 202406008) · 02/06/2027 · em dia | dose ajustada |
| 10 | Vitamina D | Vitamina D3 (colecalciferol), pó 100.000 UI/g (CAS 67-97-0) | 13,913 | 115.000 UI/g — laudo lote 91408; 1 µg = 40 UI | 40,000 µg | gest. 2,25 / lact. 2,25 µg | gest. 50,00 / lact. 50,00 µg | 80,0% | I·Vitamina D3 (Colecalciferol); III·Vitamina D 2,25 / 2,25; IV·50 / 50 | 91408 (Analitic, fabricante 2025111601) · 15/11/2028 · em dia | dose ajustada |
| 11 | Vitamina B12 | Metilcobalamina (CAS 13422-55-4) | 0,009 | 89,27% tal qual — laudo lote 219376 | 8,000 µg | gest. 0,39 / lact. 0,42 µg | gest. 10,46 / lact. 10,07 µg | 79,4% | I·Metilcobalamina; III·Vitamina B12 gest. 0,39 / lact. 0,42; IV·gest. 10,46 / lact. 10,07 | 219376 (26B20-B032-219376, Fagron/SM, fabricante 032511057) · 14/11/2030 · em dia | dose ajustada |

**Excipientes e veículo (não são constituintes; conferidos contra a IN 211/2023 na auditoria de 15/09 apenas para o dióxido de silício, ácido cítrico, sucralose e corantes — os demais estão marcados como pendência de conferência):**

- Dióxido de silício (antiumectante) (INS 551) — 108,97 mg (a fase 2 tinha 109,29 mg; recalculado na fase 3 após a massa harmonizada do ferro) — q.s.p. 1.000 mg — quantum satis (IN 211/2023, 14.2). O cadastro trazia 592,14 mg (59% da cápsula), valor sem fonte.
- Cápsula: gelatina, água purificada e corante dióxido de titânio (INS 171) — q.s.p. — assumida a mesma cápsula dos demais produtos (Qualicaps/Genix, 98,45 mg) — não há memorial deste produto

**Soma da porção:** insumos 891,03 mg + excipientes 108,97 mg = **1.000,00 mg de 1.000 mg (100,0%)**. Cabe, com 10,9% de excipiente — o cálcio precisou cair de 300 para 215 mg para isso.

**Retirados da fórmula:**

- Nenhum constituinte retirado. **Não foram acrescentados** os nutrientes que a lista de ingredientes do cadastro cita sem quantidade (vitamina A, vitamina K2, 'complexo B' além de B3/B5/B12, biotina, cromo, selênio): não há fonte para as doses e inventá-las seria preencher lacuna com valor plausível — ver pendência 1.

## 4. Mudanças e motivos

- Grupo populacional: o cadastro dizia 'Adultos com 19 anos ou mais'; passa a 'Gestantes e lactantes', com limites e %VD das colunas próprias (nome do produto, RDC 243/2018, art. 14, I, a).
- Cálcio: 300 → 215 mg (carbonato 791 → 567,0 mg) — motivo: a porção não comporta 791 mg de carbonato; 215 mg = 110% do mínimo (195 mg nos dois grupos).
- Magnésio: 60 → 66 mg (218,40 mg de bisglicinato a 30,22%) — motivo: 60 mg cravava o mínimo de gestantes; laudo novo obrigatório.
- Ácido fólico: 800 → 500 µg (1.333,3 → 833,3 µg DFE) — motivo: acima dos dois tetos (1.138,3 / 1.162,3 µg DFE) e mínimo de gestantes de 666,6 µg DFE.
- Vitamina B12: 10,46 → 8 µg — motivo: acima do teto de lactantes (10,07) e no teto de gestantes.
- Vitamina D3: 50 → 40 µg — teto exato.
- Ácido pantotênico: 5 → 4,5 mg — 91% do teto de lactantes (5,49).
- Vitamina E: 3,35 → 5,0 mg de α-tocoferol (14,72 mg de pó) — margem de 0,5 mg sobre o mínimo de lactantes era insuficiente.
- Dióxido de silício: 592,14 mg (sem fonte) → q.s.p.
- Vitamina C, ferro, niacina, cobre: mantidos (ferro e cobre condicionados a laudo).

## 5. Tabela nutricional no padrão ANVISA vigente (RDC 429/2020 + IN 75/2020)

Duas colunas de %VD (gestantes e lactantes — Anexo VIII da IN 75/2020, RDC 429/2020, art. 12, §4º). Niacina: VDR dos dois grupos não extraído (pendência do gabarito) — célula marcada como PENDENTE no texto, não vazia. Vitamina E em α-tocoferol; ácido fólico em µg DFE.

**INFORMAÇÃO NUTRICIONAL**

Porções por embalagem: 30
Porção: 1 g (2 cápsulas)

| Item | Quantidade por porção | %VD* (gestantes) | %VD* (lactantes) |
|---|---|---|---|
| Valor energético | 0 kcal = 0 kJ  | 0% | 0% |
| Carboidratos | 0 g | 0% | 0% |
| Açúcares totais | 0 g | 0% | 0% |
| Açúcares adicionados | 0 g | 0% | 0% |
| Proteínas | 0 g | 0% | 0% |
| Gorduras totais | 0 g | 0% | 0% |
| Gorduras saturadas | 0 g | 0% | 0% |
| Gorduras trans | 0 g | 0% | 0% |
| Fibras alimentares | 0 g | 0% | 0% |
| Sódio | 0 mg | 0% | 0% |
| Vitamina D | 40 µg | 267% | 267% |
| Vitamina E | 5 mg | 33% | 33% |
| Vitamina C | 20 mg | 24% | 17% |
| Niacina | 8 mg NE | PENDENTE | PENDENTE |
| Ácido fólico | 833 µg DFE | 139% | 167% |
| Ácido pantotênico | 4,5 mg | 75% | 64% |
| Vitamina B12 | 8 µg | 308% | 286% |
| Cálcio | 215 mg | 17% | 17% |
| Cobre | 900 µg | 90% | 69% |
| Ferro | 8,1 mg | 30% | 81% |
| Magnésio | 66 mg | 17% | 18% |

*Percentual de valores diários fornecidos pela porção

**Conta do valor energético e do sódio (calculado):** Valor energético calculado (fatores de Atwater da IN 75/2020, Anexo XXII: proteínas e carboidratos 4 kcal/g = 17 kJ/g; gorduras 9 kcal/g = 37 kJ/g): proteínas 0,0 mg → 0,00 kcal; carboidratos 0,0 mg → 0,00 kcal; gorduras 0,0 mg → 0,00 kcal; total 0,00 kcal = 0,00 kJ. Sódio calculado: 0,00 mg. Nenhum insumo aporta proteína, carboidrato ou gordura (a glicina dos bisglicinatos não foi contada — assunção). Sódio zero.

**Regras aplicadas (gabarito de 16/09/2026):** título "INFORMAÇÃO NUTRICIONAL"; porção = recomendação diária (RDC 429/2020, art. 9º, VI); %VD pelo Anexo VIII da IN 75/2020 para o grupo do rótulo (art. 12, §4º); constituinte sem VDR fica com a célula de %VD vazia (art. 12, §1º); quantidade não significativa (Anexo IV da IN 75: ≤ 4 kcal, ≤ 0,5 g de carboidratos/açúcares/proteínas/gorduras totais, ≤ 0,1 g de saturadas/trans, ≤ 5 mg de sódio) recebe %VD zero (art. 12, §2º); arredondamento pelo Anexo III da IN 75 na paráfrase do gabarito — ≥ 10: inteiro; 1 a 10: uma casa (inteiro se a casa for 0); < 1 em g: uma casa; < 1 em mg/µg: duas casas (uma se a segunda for 0) — regra não confirmada literalmente, ver pendência do gabarito; %VD arredondado ao inteiro (convenção; a regra literal de arredondamento do %VD não consta do gabarito). O valor energético seguiu as mesmas faixas (o gabarito diz não haver linha própria, sem confirmação literal). Rodapé literal do art. 12, §5º da RDC 429/2020.

## 6. Lista de ingredientes proposta

Ordem decrescente de massa por porção (massa do insumo comercial, não do elemento), nomes técnicos e INS dos aditivos, seguida da declaração de alergênicos (RDC 26/2015).

> Carbonato de cálcio, bisglicinato de magnésio, antiumectante dióxido de silício (INS 551), bisglicinato ferroso, ácido ascórbico (vitamina C), acetato de DL-alfa-tocoferol (vitamina E), colecalciferol (vitamina D3), nicotinamida (vitamina B3), D-pantotenato de cálcio (vitamina B5), bisglicinato de cobre, ácido fólico, metilcobalamina (vitamina B12) e cápsula: gelatina, água purificada e corante dióxido de titânio (INS 171).

Nenhum insumo deriva dos alergênicos da RDC 26/2015. Sem declaração de glúten até laudo do produto acabado.

## 7. Advertências obrigatórias

**Texto proposto para o rótulo e para o campo `warnings` (as frases do art. 14, I, c/d/e da RDC 243/2018 vão em destaque e negrito):**

> Este produto não é um medicamento.
> Não exceder a recomendação diária de consumo indicada na embalagem.
> Mantenha fora do alcance de crianças.
> Público indicado: gestantes e lactantes. Ingerir 2 cápsulas ao dia, sob orientação de médico ou nutricionista.
> Conservar o produto em local seco, fresco e arejado, ao abrigo da luz e do calor excessivo, em temperatura ambiente entre 15 °C e 30 °C. Após aberto, consumir em até 60 dias. Não consumir se o lacre de segurança estiver violado.

**Base de cada frase:**

- Três frases do art. 14, I, c/d/e da RDC 243/2018 (texto literal); grupo populacional (gestantes e lactantes) e frequência — art. 14, I, a/b; conservação — art. 14, II.
- Nenhum constituinte desta fórmula consta do Anexo VI da IN 28/2018 — não há frase complementar exigida. A frase 'Este produto não deve ser consumido por gestantes, lactantes e crianças' NÃO pode aparecer (o produto é para gestantes e lactantes). A orientação 'sob orientação de médico ou nutricionista' já constava do cadastro e é mantida como boa prática, não como exigência normativa.

**O que falta hoje no cadastro/rótulo:** o campo `warnings` do banco já traz as três frases do art. 14; o campo `target_audience` está errado ('Adultos com 19 anos ou mais') e o SQL o corrige para 'Gestantes e lactantes.'; a lista de ingredientes cita nutrientes sem quantidade e sem fonte — corrigida para o que a composição realmente tem.

## 8. Pendências e decisões do dono/RT

1. **Composição — decisão do dono:** a lista de ingredientes do cadastro cita vitamina A, K2, complexo B, biotina, cromo e selênio que não têm quantidade em lugar nenhum (nem memorial, nem ficha, nem rótulo existem). Esta proposta só formula o que está cadastrado com quantidade. Se o dono quiser completar o multivitamínico pré-natal, as faixas a respeitar (mais restritiva entre gestantes e lactantes, Anexos III/IV) são: vitamina A 195–2.414,35 µg RAE (só pré-formada; o iodo, importante para o grupo, teria faixa 43,5–717,56 µg); vitamina K 13,5–126,02 µg; tiamina 0,21–1,93 mg; riboflavina 0,24–2,66 mg; B6 0,3–78,59 mg; biotina 5,25–45 µg; cromo 6,75–45 µg; selênio 10,5–309,65 µg; zinco 1,95–23,50 mg; iodo 43,5–717,56 µg. Manganês e boro são 'NA' para os dois grupos — não podem entrar.
2. **Laudo novo de bisglicinato de magnésio** (ou trocar por óxido de magnésio, 109,5 mg para 66 mg, insumo a adquirir).
3. **Comprar bisglicinato ferroso e bisglicinato de cobre com laudo** — nenhum laudo vigente dessas formas existe na máquina; a massa do ferro (39,98 mg) usa o último teor conhecido de um laudo vencido.
4. **Memorial de cálculo e ficha técnica inexistentes** — este produto é vendido sem nenhum documento de fabricação (achado do inventário de 16/09). O RT precisa emitir o memorial a partir desta proposta antes de qualquer produção.
5. **Cápsula:** confirmar tamanho e capacidade (assumida a cápsula 0 de 500 mg dos outros produtos).
6. **VDR de niacina para gestantes e lactantes** não foi extraído do Anexo VIII (pendência do gabarito) — a célula de %VD da niacina fica PENDENTE, não vazia por falta de VDR.
7. **Rótulo (a criar):** designação 'Suplemento alimentar em cápsulas', público 'gestantes e lactantes', tabela com as duas colunas de %VD, sem a frase genérica de gestantes.

**Alternativas registradas (não são a proposta principal):**

- **Óxido de magnésio** no lugar do bisglicinato (109,5 mg para 66 mg; a adquirir) — reduz a dependência do laudo vencido e libera 109 mg.
- **Cálcio a 300 mg com 3 cápsulas por porção** (791 mg de carbonato) — só com mudança de porção, decisão do dono.

## 9. Veredito esperado após a reformulação

**CONFORME CONDICIONADO A (laudo novo do bisglicinato de magnésio; laudos de bisglicinato ferroso e bisglicinato de cobre; emissão do memorial de cálculo pelo RT) — e à decisão do dono sobre completar ou não os nutrientes citados sem dose**

Com a composição da seção 3 (11 constituintes), o ácido fólico e a B12 saem de cima dos tetos, cálcio, magnésio e vitamina E ganham folga sobre os mínimos, nenhuma dose crava teto (a mais alta é o ácido pantotênico, 82,0% do teto de lactantes) e a porção — que no cadastro estava entre 144,9% e 161,0% — fecha em 1.000 mg com 10,9% de excipiente. Três insumos precisam de laudo (magnésio, ferro, cobre) e o produto precisa nascer documentalmente (memorial). Este é o único produto do grupo cuja composição não tem nenhuma fonte de fábrica: tudo aqui parte do cadastro.

---

**Arquivos-fonte (caminhos absolutos):**

- `/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/IN28-2018-ANEXO-I-LITERAL.md`
- `/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/IN28-2018-ANEXO-III-LITERAL.md (colunas Gestantes e Lactantes)`
- `/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/IN28-2018-ANEXOS-IV-V-VI-LITERAL.md (colunas Gestantes e Lactantes)`
- `/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/AUDITORIA-ROTULO-VS-ANVISA-2026-09-15.md (seção II.5)`
- `/private/tmp/claude-501/-Users-diegofrancisco-Downloads-erp-espa-o/c5ed6b00-4553-4992-b469-c649af084651/scratchpad/fase1/memoriais-formulacoes.json (chave multi-vitta-gestante-e-lactante-em-capsula — NÃO ENCONTRADO: sem memorial, ficha ou dossiê)`
- `/private/tmp/claude-501/-Users-diegofrancisco-Downloads-erp-espa-o/c5ed6b00-4553-4992-b469-c649af084651/scratchpad/fase1/laudos.json (índices 8, 19, 50, 134, 154, 190, 193, 197, 201, 204)`
- `/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/PADRAO-ANVISA-TABELA-NUTRICIONAL-2026-09-16.md e scratchpad/padrao-anvisa/vd.json (colunas gestantes e lactantes)`
- `cadastro vivo: formulas?slug=eq.multi-vitta-gestante-e-lactante-em-capsula e formula_compositions (12 linhas ativas, lidas em 16/09/2026)`
