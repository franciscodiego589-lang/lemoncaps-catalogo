# Reformulação regulatória — Serena (`serena`)

**Data:** 16/09/2026. **Fase 2 da conformidade do catálogo Lemon Caps** (ordem do dono: "altere os insumos para os permitidos; pode refazer as formulações para todas estarem dentro das normas"). Documento para o dono e para o RT (Anderson C. Barbosa, CRF/MT 5526). Nada foi gravado no banco; as três entregas deste produto são este memorial, o JSON `scratchpad/fase2/serena.json` e o fragmento SQL `scratchpad/fase2/serena.sql`, todos criados em disco e não aplicados.

**Fontes usadas (todas lidas nesta data, caminhos absolutos no rodapé):** IN 28/2018 nos anexos literais I, III, IV e VI (texto consolidado vigente até a IN 450/2026, lido em 16/09/2026); auditoria de 15/09/2026; composição do rótulo (`composicoes_rotulo.json`, extração de 13/09/2026); memorial de cálculo da fábrica (`memoriais-formulacoes.json`, 16/09/2026); inventário de laudos (`laudos.json`, 308 certificados, 16/09/2026); gabarito da tabela nutricional (RDC 429/2020 + IN 75/2020, 16/09/2026) e `vd.json`; cadastro vivo do catálogo (chave pública, lido em 16/09/2026).

**Convenção de procedência, em todo número deste documento:** *lido* = copiado da fonte nomeada; *calculado* = conta aritmética mostrada; *assumido* = marcado como tal ao lado do número (teor estequiométrico do sal puro quando não há laudo). Dado não confirmado fica marcado **PROVISÓRIO** ou **PENDENTE**.

## 1. Identificação

- **Nome:** Serena (nome no rótulo/mercado: Serena (arte Serena.pdf)).
- **Slug:** `serena`.
- **Formato:** solução oral em gotas (frasco conta-gotas de 30 mL).
- **Porção declarada:** 1 mL (20 gotas) — 1.000 mg de conteúdo por porção (1 mL tratado como 1.000 mg, como faz o memorial rev02 — a densidade da solução glicerina/água não foi medida). Sem mudança de porção proposta.
- **Público-alvo / grupo populacional dos Anexos III e IV:** adultos, coluna "> 19 anos" dos Anexos III e IV (a melatonina é 'NA' nos demais grupos).
- **Porções por embalagem:** 30.

Único produto líquido do grupo. O memorial rev02 fecha 1 mL em 1.000 mg (352,55 mg de sólidos + 647,45 mg de veículo) e já recomenda subir magnésio para 70 mg, teanina para 60 mg e baixar melatonina para 0,19 mg — esta reformulação adota os dois primeiros e leva a melatonina a 0,18 mg (≤ 90% do teto).

## 2. Antes — composição atual e veredito da auditoria por insumo

Fonte da tabela: composição impressa no rótulo (`composicoes_rotulo.json`, chave `serena`, 5 itens), com o veredito da auditoria de 15/09/2026 (seção 4.5) e a observação do memorial rev02.

| # | Insumo (como está na fonte) | Quantidade | Veredito da auditoria (15/09/2026) e observação do memorial da fábrica |
|---|---|---|---|
| 1 | Magnésio (de cloreto de magnésio) | 63 mg (15% VD) | CONFORME — igual ao mínimo. Memorial: 246,77 mg de cloreto anidro a 25,53% (sem descontar 99,4% do laudo → 62,6 mg reais); laudo 950301 vence 08/11/2026. |
| 2 | L-teanina | 50 mg | NÃO VERIFICADO (origem) — igual ao mínimo. Memorial: lote AUTO039250, laudo lido em 16/09: 'SÍNTESE QUÍMICA'; INLAB não comercializa L-teanina. |
| 3 | Mio-inositol | 50 mg | CONFORME. Memorial: 50,07 mg (lote 950479). |
| 4 | Vitamina B6 (cloridrato de piridoxina) | 1,3 mg (100% VD) | CONFORME. Memorial: 1,58 mg (lote 91188). |
| 5 | Melatonina | 0,21 mg | CONFORME — igual ao máximo. Laudo lote 950151 VENCIDO em 09/12/2024 (lote de 12/2021); todos os laudos de melatonina da máquina vencidos. |

Nenhum constituinte fora da faixa, mas três cravados em limites, uma origem não autorizada (teanina) e o laudo de melatonina vencido há 21 meses. A auditoria classificou como NÃO VERIFICÁVEL só pela teanina.

## 3. Depois — composição proposta, insumo a insumo

Grupo "> 19 anos". Folga criada nos três limites cravados; origem da teanina corrigida (rota B); demais doses mantidas.

| # | Constituinte (Anexo I) | Forma / insumo comercial | Massa do insumo (mg/porção) | Teor (% e fonte) | Ativo por porção | Mín. | Máx. | % do máx. | Linha do anexo | Laudo (lote · validade · vencido?) | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Magnésio | Cloreto de magnésio, anidro (CAS 7786-30-3) | 275,852 | 25,38% Mg tal qual — laudo lote 950301 (teor de MgCl2 99,4%) × 25,53% (Mg/MgCl2, estequiométrico); o memorial rev02 usou 25,53% sem descontar os 99,4% | 70,000 mg | 63,00 mg | 350,00 mg | 20,0% | I·Cloreto de magnésio; III/IV·Magnésio | 950301 (Analitic, fabricante 23110901) · 08/11/2026 · em dia — vence em cerca de 7 semanas | dose ajustada |
| 2 | Teanina | L-teanina de folhas de Camellia sinensis — insumo a adquirir (rota B) | 60,000 | 100% — assumido; o laudo do lote em uso (AUTO039250, Lepuge) não serve: 'SÍNTESE QUÍMICA' | 60,000 mg | 50,00 mg | 250,00 mg | 24,0% | I·L-teanina de folhas de Camellia sinensis (IN 318/2024); III·Teanina 50 mg; IV·250 mg | AUTO039250 (Lepuge, fabricante 202408145) — SÍNTESE QUÍMICA, não serve · 13/08/2027 · em dia — laudo lido em 16/09/2026: 'Forma de Obtenção: SÍNTESE QUÍMICA'; a única forma autorizada é a de folhas de Camellia sinensis | forma trocada (origem) + dose ajustada — PENDENTE laudo |
| 3 | Inositol | Inositol (Mio-inositol/Meso-inositol) (CAS 87-89-8) | 50,070 | 99,86% — laudo lote 950479 (conforme memorial; alternativa IDNLABS YW20241103, 99,61%, val. 11/2028) | 50,000 mg | NE | 2.000,00 mg | 2,5% | I·Inositol (Mio-inositol/Meso-inositol) (IN 76/2020); III·NE; IV·2 g | 950479 (memorial rev02; digitalização, não relida). Alternativa em texto: IDNLABS YW20241103, 99,61%, val. 11/2028 · não relida · validade não relida | mantido |
| 4 | Vitamina B6 | Cloridrato de piridoxina (CAS 58-56-0) | 1,582 | 99,9% — laudo lote 91188; × 82,27% | 1,300 mg | 0,26 mg | 98,60 mg | 1,3% | I·Cloridrato de piridoxina; III/IV·Vitamina B6 | 91188 (Analitic, fabricante 241229T092) · 28/12/2027 · em dia | mantido |
| 5 | Melatonina | Melatonina (CAS 73-31-4) | 0,181 | 99,33% tal qual — laudo lote 950151 (99,5% b.s. × (1 − 0,17%)), VENCIDO em 09/12/2024 — último teor conhecido | 0,180 mg | NE | 0,21 mg | 85,7% | I·Melatonina (IN 102/2021); III·NE; IV·0,21 mg | 950151 (Analitic, fabricante MCS211210) — os 5 laudos de melatonina da máquina estão vencidos · 09/12/2024 · VENCIDO | dose ajustada — PENDENTE laudo |

**Excipientes e veículo (não são constituintes; conferidos contra a IN 211/2023 na auditoria de 15/09 apenas para o dióxido de silício, ácido cítrico, sucralose e corantes — os demais estão marcados como pendência de conferência):**

- Glicerina vegetal (glicerol, umectante/veículo) e água purificada — q.s.p. 1 mL (INS 422) — 608,32 mg — o memorial rev02 registra 647,45 mg de veículo sem desmembrar; o documento POPS desmembra em glicerina 133,33 mg + água q.s.p. — a massa de glicerina (que entra no valor energético) é PROVISÓRIA
- Sorbato de potássio (conservador) (INS 202) — 2,00 mg — laudo lote 91202 (100,30%, val. 05/01/2028)
- Benzoato de sódio (conservador) (INS 211) — 2,00 mg — laudo lote 950430 (99,77%, val. 25/04/2028)
- Citrato de sódio (regulador de acidez) e ácido cítrico (acidulante) (INS 331 / 330) — q.s.p. — constam do rótulo; massas não registradas no memorial rev02 — PENDENTE (o citrato de sódio também aporta sódio, não contado)
- Aromatizante idêntico ao natural — q.s.p. — consta do rótulo; massa não registrada — PENDENTE

**Soma da porção:** insumos 387,68 mg + excipientes 612,32 mg = **1.000,00 mg de 1.000 mg (100,0%)**. Os sólidos somam 391,7 mg (constituintes + conservantes); o veículo (glicerina + água) completa 1 mL — cabe com folga. O memorial rev02 observa que, se o cloreto fosse o hexaidratado, seriam ~530 mg/mL só de sal (inviável); a forma anidra (laudo 950301) é a que viabiliza a solução.

**Retirados da fórmula:**

- **L-teanina sintética (lote AUTO039250)** — substituída pela de folhas de Camellia sinensis (rota B); o lote em estoque não pode ser usado.

## 4. Mudanças e motivos

- Magnésio: 63 → 70 mg (cloreto anidro 246,77 → 275,8 mg) — motivo: mínimo exato sem folga; e a massa do memorial, com o teor real do laudo (99,4% de MgCl2), entrega 62,6 mg. Pedir laudo novo antes de 08/11/2026.
- L-teanina: 50 → 60 mg e origem sintética → "L-teanina de folhas de Camellia sinensis" — motivos: mínimo exato sem folga; e só a de Camellia sinensis é autorizada (Anexo I, IN 318/2024). Insumo a adquirir (rota B).
- Melatonina: 0,21 → 0,18 mg — motivo: teto exato (Anexo IV: 0,21 mg); laudo vigente obrigatório.
- Mio-inositol e vitamina B6: mantidos.
- Advertência específica da melatonina (Anexo VI) acrescentada — hoje falta no cadastro e no rótulo.
- Valor energético refeito a partir dos insumos (o memorial já apontava que '1 kcal com 0,5 g de carboidratos' não fechava).

## 5. Tabela nutricional no padrão ANVISA vigente (RDC 429/2020 + IN 75/2020)

Coluna "> 19 anos" do Anexo VIII da IN 75/2020. Teanina, inositol e melatonina sem VDR (células vazias).

**INFORMAÇÃO NUTRICIONAL**

Porções por embalagem: 30
Porção: 1 mL (20 gotas)

| Item | Quantidade por porção | %VD* (adultos) |
|---|---|---|
| Valor energético | 1,0 kcal = 4,1 kJ  | 0% |
| Carboidratos | 0,2 g | 0% |
| Açúcares totais | 0 g | 0% |
| Açúcares adicionados | 0 g | 0% |
| Proteínas | 0,1 g | 0% |
| Gorduras totais | 0 g | 0% |
| Gorduras saturadas | 0 g | 0% |
| Gorduras trans | 0 g | 0% |
| Fibras alimentares | 0 g | 0% |
| Sódio | 0,32 mg | 0% |
| Vitamina B6 | 1,3 mg | 100% |
| Magnésio | 70 mg | 17% |
| Teanina | 60 mg |  |
| Inositol | 50 mg |  |
| Melatonina | 0,18 mg |  |

*Percentual de valores diários fornecidos pela porção

**Conta do valor energético e do sódio (calculado):** Valor energético calculado (fatores de Atwater da IN 75/2020, Anexo XXII: proteínas e carboidratos 4 kcal/g = 17 kJ/g; gorduras 9 kcal/g = 37 kJ/g): proteínas 60,0 mg → 0,24 kcal; carboidratos 183,3 mg → 0,73 kcal; gorduras 0,0 mg → 0,00 kcal; total 0,97 kcal = 4,14 kJ. Sódio calculado: 0,32 mg. Carboidratos: glicerina 133,33 mg (massa PROVISÓRIA, do documento POPS; contada como carboidrato a 4 kcal/g — assunção, pois o Anexo XXII lido no gabarito não traz fator próprio para glicerol) + inositol 50 mg. Proteínas: L-teanina 60 mg. Total 1,0 kcal, abaixo de 4 kcal (não significativo). Sódio: benzoato de sódio 2 mg (15,95% de Na) = 0,32 mg — o citrato de sódio não foi contado (massa PENDENTE); se ultrapassar 5 mg, o %VD deixa de ser zero.

**Regras aplicadas (gabarito de 16/09/2026):** título "INFORMAÇÃO NUTRICIONAL"; porção = recomendação diária (RDC 429/2020, art. 9º, VI); %VD pelo Anexo VIII da IN 75/2020 para o grupo do rótulo (art. 12, §4º); constituinte sem VDR fica com a célula de %VD vazia (art. 12, §1º); quantidade não significativa (Anexo IV da IN 75: ≤ 4 kcal, ≤ 0,5 g de carboidratos/açúcares/proteínas/gorduras totais, ≤ 0,1 g de saturadas/trans, ≤ 5 mg de sódio) recebe %VD zero (art. 12, §2º); arredondamento pelo Anexo III da IN 75 na paráfrase do gabarito — ≥ 10: inteiro; 1 a 10: uma casa (inteiro se a casa for 0); < 1 em g: uma casa; < 1 em mg/µg: duas casas (uma se a segunda for 0) — regra não confirmada literalmente, ver pendência do gabarito; %VD arredondado ao inteiro (convenção; a regra literal de arredondamento do %VD não consta do gabarito). O valor energético seguiu as mesmas faixas (o gabarito diz não haver linha própria, sem confirmação literal). Rodapé literal do art. 12, §5º da RDC 429/2020.

## 6. Lista de ingredientes proposta

Ordem decrescente de massa por porção (massa do insumo comercial, não do elemento), nomes técnicos e INS dos aditivos, seguida da declaração de alergênicos (RDC 26/2015).

> Glicerina vegetal (glicerol – INS 422), água purificada, cloreto de magnésio, L-teanina de folhas de Camellia sinensis, mio-inositol, citrato de sódio (INS 331), ácido cítrico (INS 330), conservador sorbato de potássio (INS 202), conservador benzoato de sódio (INS 211), cloridrato de piridoxina (vitamina B6), melatonina e aromatizante idêntico ao natural.

Nenhum insumo deriva dos alergênicos da RDC 26/2015. Sem declaração de glúten até laudo do produto acabado. Conferência dos aditivos (sorbato, benzoato, citrato, ácido cítrico, aromatizante) na IN 211/2023 para a categoria de suplementos LÍQUIDOS não foi feita nesta etapa — a auditoria de 15/09 conferiu só a categoria 14.2 (sólidos) — PENDENTE.

## 7. Advertências obrigatórias

**Texto proposto para o rótulo e para o campo `warnings` (as frases do art. 14, I, c/d/e da RDC 243/2018 vão em destaque e negrito):**

> Este produto não é um medicamento.
> Não exceder a recomendação diária de consumo indicada na embalagem.
> Mantenha fora do alcance de crianças.
> Público indicado: adultos (19 anos ou mais). Ingerir 20 gotas (1 mL) ao dia, preferencialmente à noite.
> Este produto não deve ser consumido por gestantes, lactantes, crianças e pessoas envolvidas em atividades que requerem atenção constante. Pessoas com enfermidades e/ou sob o uso de medicamentos, consulte seu médico.
> Conservar o produto em local seco, fresco e arejado, ao abrigo da luz e do calor excessivo, em temperatura ambiente entre 15 °C e 30 °C. Após aberto, consumir em até 60 dias. Não consumir se o lacre de segurança estiver violado.

**Base de cada frase:**

- Três frases do art. 14, I, c/d/e da RDC 243/2018 (texto literal); grupo e frequência — art. 14, I, a/b; conservação — art. 14, II.
- "Este produto não deve ser consumido por gestantes, lactantes, crianças e pessoas envolvidas em atividades que requerem atenção constante. Pessoas com enfermidades e/ou sob o uso de medicamentos, consulte seu médico." — IN 28/2018, Anexo VI, linha "Melatonina" (IN 102/2021), texto literal. A primeira oração cobre também as linhas "Aminoácidos" (L-teanina) e "Inositol" (IN 102/2021), que exigem a frase genérica.

**O que falta hoje no cadastro/rótulo:** a segunda oração da advertência da melatonina ("…pessoas envolvidas em atividades que requerem atenção constante. Pessoas com enfermidades e/ou sob o uso de medicamentos, consulte seu médico.") não está no campo `warnings` nem no rótulo (auditoria de 15/09, seção 4.5).

## 8. Pendências e decisões do dono/RT

1. **Laudo vigente de melatonina** do lote a pesar — o laudo em uso (950151) venceu em 09/12/2024 e é o mais antigo da linha; os outros quatro laudos de melatonina da máquina também venceram.
2. **L-teanina — decisão do dono:** rota B (proposta principal: comprar "L-teanina de folhas de Camellia sinensis", especificação Blue California, com laudo de origem — o fornecedor atual não a tem) ou rota A (retirar; Serena ficaria com magnésio, inositol, B6 e melatonina — ainda um produto de sono, mas com a chamada do rótulo alterada).
3. **Laudo novo de cloreto de magnésio anidro** antes de 08/11/2026 (o lote 950301 vence em ~7 semanas); recalcular 275,8 mg pelo teor.
4. **Massas do veículo e dos aditivos:** registrar no memorial a glicerina (POPS: 133,33 mg — provisória), o citrato de sódio, o ácido cítrico e o aromatizante; o valor energético e o sódio da tabela dependem disso.
5. **Aditivos em suplemento líquido:** conferir sorbato de potássio, benzoato de sódio, citrato de sódio, ácido cítrico e aromatizante na categoria de suplementos líquidos da IN 211/2023 (não conferida; a auditoria só leu a 14.2).
6. **Conta-gotas:** o memorial aponta que Serena declara 1 mL = 20 gotas e o Slim Up 1 mL = 30 gotas para o mesmo tipo de frasco — confirmar com o fornecedor da embalagem; e o laudo do frasco de 30 mL não foi localizado.
7. **Rótulo:** atualizar magnésio (70 mg), L-teanina (60 mg, com a origem no nome), melatonina (0,18 mg); acrescentar a advertência específica da melatonina; refazer a tabela (o rótulo declara 1 kcal / 0,3 g de carboidratos sem conta).

**Alternativas registradas (não são a proposta principal):**

- **Rota A da L-teanina (retirar):** 4 constituintes; veredito condicionado só aos laudos de melatonina e cloreto de magnésio.
- **Melatonina a 0,19 mg** (90,5% do teto), como o memorial rev02 recomenda — ligeiramente acima da folga de 10% desta fase; fica como opção do RT.
- **Cloreto de magnésio hexaidratado** (laudo SM 26D28-B047-221936, 99,9%, val. 07/12/2028): entregaria 70 mg de Mg em 586 mg/mL (11,955% de Mg estequiométrico × 99,9%) — o memorial considera inviável para a solução; registrado apenas porque é a única fonte de magnésio com laudo longo.

## 9. Veredito esperado após a reformulação

**CONFORME CONDICIONADO A (laudo de origem Camellia sinensis da L-teanina nova; laudo vigente de melatonina; laudo novo de cloreto de magnésio; massas do veículo e dos aditivos registradas)**

Com a composição da seção 3, os três constituintes cravados em limites (magnésio e teanina no mínimo; melatonina no máximo) ganham folga (magnésio 111% do mínimo, teanina 120%, melatonina 85,7% do teto), a L-teanina passa à única origem autorizada, e a porção de 1 mL comporta os 391,7 mg de sólidos com veículo q.s.p. Restam três laudos (teanina de origem vegetal, melatonina, cloreto de magnésio) e o registro das massas do veículo — sem eles, o veredito não passa de condicionado.

---

**Arquivos-fonte (caminhos absolutos):**

- `/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/IN28-2018-ANEXO-I-LITERAL.md`
- `/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/IN28-2018-ANEXO-III-LITERAL.md`
- `/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/IN28-2018-ANEXOS-IV-V-VI-LITERAL.md`
- `/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/AUDITORIA-ROTULO-VS-ANVISA-2026-09-15.md (seção 4.5)`
- `/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/composicoes_rotulo.json (chave serena)`
- `/private/tmp/claude-501/-Users-diegofrancisco-Downloads-erp-espa-o/c5ed6b00-4553-4992-b469-c649af084651/scratchpad/fase1/memoriais-formulacoes.json (chave serena — MEMORIAL-CALCULO-SERENA-rev02.docx)`
- `/private/tmp/claude-501/-Users-diegofrancisco-Downloads-erp-espa-o/c5ed6b00-4553-4992-b469-c649af084651/scratchpad/fase1/laudos.json (índices 6, 37, 82, 194, 199, 200, 203, 207, 40, 41, 163)`
- `/Users/diegofrancisco/Desktop/LAUDOS/VITAMINA D3 COLECALCIFEROL.pdf (compilação Lepuge; bloco L-TEANINA lote AUTO039250: 'Forma de Obtenção: SÍNTESE QUÍMICA', doseamento 100,16% b.a., perda por secagem 0,37%, val. 13/08/27)`
- `/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/PADRAO-ANVISA-TABELA-NUTRICIONAL-2026-09-16.md e scratchpad/padrao-anvisa/vd.json`
- `cadastro vivo: formulas?slug=eq.serena e formula_compositions (5 linhas ativas, lidas em 16/09/2026)`
