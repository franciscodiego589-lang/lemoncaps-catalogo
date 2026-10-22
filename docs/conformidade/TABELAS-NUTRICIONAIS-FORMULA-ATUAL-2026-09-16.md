# Tabelas de Informação Nutricional — FÓRMULA ATUAL (24 produtos), 16/09/2026

Decisão do dono (16/09/2026): as tabelas que entram no catálogo são as da fórmula **atual** — o que a fábrica entrega hoje —, não as da reformulação. Este documento traz as 24 tabelas no padrão vigente (RDC 429/2020 + IN 75/2020), cada uma em dois blocos (Markdown para leitura e texto puro para o banco/arte), com porção, porções por embalagem, grupo populacional, veredito da auditoria de 15/09/2026, linhas PENDENTES/PROVISÓRIAS (⚠) com o motivo e observações. As mesmas 24 tabelas estão em `docs/conformidade/dados-2026-09-16/fase3/tabelas-nutricionais-atual.json` (formato combinado com o componente do site) e na migration em disco `supabase/migrations/20260921200000_tabelas_nutricionais_formula_atual.sql` (não aplicada).

## Fontes

- **Composição das 15 fórmulas com rótulo:** `docs/conformidade/composicoes_rotulo.json` (14 artes-finais em PDF lidas em 13/09/2026, com a linha 'Composição por porção', a tabela nutricional impressa e os %VD impressos) e, para o Pré-treino Césio 137 (420 g), o PDF da gráfica `/Users/diegofrancisco/Downloads/PRÉ TREINO_CÉSIO 137_420g.pdf`, cujo texto extraí com PyMuPDF e conferi visualmente no recorte renderizado em 16/09/2026. Mapa rótulo → slug conferido em `COMPOSICOES-ROTULO-VS-CADASTRO-2026-09-15.md` (seção 2).
- **Composição das 9 fórmulas sem rótulo:** cadastro ativo de `public.formulas`, `public.formula_compositions` e `public.ingredients` do banco vivo `zjryrmqtumvaxdytvbbv`, lido pela chave pública em 16/09/2026 (24 fórmulas ativas, 172 linhas ativas; cópias em `scratchpad/fase3/_formulas_live.json`, `_composicoes_live.json`, `_formulas_uso_live.json`).
- **Normas, lidas literalmente em 16/09/2026** no texto consolidado do AnvisaLegis (baixado com curl em 16/09/2026 e guardado, sem edição, em `docs/conformidade/dados-2026-09-16/fase3/IN75-2020-consolidada-anvisalegis-2026-09-16.txt` e `RDC429-2020-consolidada-anvisalegis-2026-09-16.txt`): RDC 429/2020 arts. 5º (conteúdo da tabela; §3º para suplementos), 7º (declaração numérica; §1º energia e %VD em inteiros), 8º (§1º: suplemento dispensa a coluna por 100 g), 12 (%VD sobre a quantidade arredondada declarada; §1º célula vazia sem VDR; §2º não significativo → zero; §4º Anexo VIII para suplementos; §5º rodapé) e 15 (§3º: declaração simplificada facultativa); IN 75/2020 Anexos II (VDR geral), III (arredondamento), IV (quantidades não significativas e forma de expressão '0', com as condições por constituinte), VIII (VDR por grupo — inclusive energia e macronutrientes por grupo e niacina 18/17 mg NE para gestantes/lactantes, que resolvem as pendências 3 e 4 do gabarito), X (declaração simplificada), XI (nomes, ordem, indentação e unidades), XII (tipografia: subtítulos 'Porções por embalagem:' e 'Porção: X g ou ml (medida caseira)', títulos das colunas '100 g', 'X g ou ml' e '%VD*', rodapé), XXII (fatores kcal/g) e XXIII (conversões).
- **Conformidade da composição atual:** `docs/conformidade/AUDITORIA-ROTULO-VS-ANVISA-2026-09-15.md` (Parte I, rótulos; Parte II, cadastro das 9 sem rótulo) e `PARECER-PRE-TREINO-CESIO-137-2026-09-15.md`. A tabela **não corrige a fórmula**: declara o que está no produto e marca ⚠ com o motivo onde a auditoria apontou constituinte fora da faixa ou forma não autorizada.

## Regras aplicadas nas 24 tabelas

1. **Linhas e ordem:** as dez linhas obrigatórias do art. 5º da RDC 429 (valor energético, carboidratos, açúcares totais, açúcares adicionados, proteínas, gorduras totais, gorduras saturadas, gorduras trans, fibras alimentares, sódio) mais todos os nutrientes e substâncias bioativas adicionados (art. 5º, §3º), na ordem, indentação e unidades do Anexo XI da IN 75 (aminoácidos específicos no 1º nível sob Proteínas, em mg; poliois no 1º nível sob Carboidratos; ômega 3 no 2º nível sob gorduras poli-insaturadas, com EPA e DHA no 3º; taurina e colina em linha própria; substâncias bioativas ao final, com o nome do constituinte da IN 28/2018). Vitaminas do complexo B pelos nomes alternativos do Anexo XI que coincidem com os Anexos II/VIII e com a IN 28 (Tiamina, Riboflavina, Niacina, Ácido pantotênico, Biotina, Ácido fólico) e 'Vitamina B6'/'Vitamina B12'; vitamina A em µg RAE, ácido fólico em µg DFE e niacina em mg NE (bases dos VDR e dos limites — escolha de grafia registrada; o Anexo XI traz só 'µg'/'mg'). Colágeno hidrolisado e espirulina não recebem linha própria: são fontes de Proteínas no Anexo I da IN 28 e entram na linha Proteínas, com ⚠ quando abaixo do mínimo.
2. **Cabeçalho:** coluna de quantidade intitulada com a massa (ou volume) da porção, como a tipografia do Anexo XII ('X g ou ml'); coluna '%VD*'; no Multi Vitta, uma coluna de %VD por grupo ('%VD* gestantes' e '%VD* lactantes'). Subtítulos 'Porções por embalagem:' e 'Porção: X g ou ml (medida caseira)'. Rodapé literal da RDC 429/2020, art. 12, §5º: '*Percentual de valores diários fornecidos pela porção' (a tipografia do Anexo XII o mostra com ponto final; o texto da RDC, sem).
3. **Macronutrientes e energia nas 15 com rótulo:** os valores **impressos** na tabela do rótulo (dado lido) — inclusive os kJ impressos, mesmo onde 4,184 × kcal dá outro número (registrado na linha). Onde a conta pelos insumos, com os fatores do Anexo XXII e o critério único do item 5, diverge do impresso, a linha leva ⚠ e o motivo traz a conta. Quantidades não significativas impressas com número (ex.: 'Carboidratos 0,3 g') foram mantidas como impressas; a norma vigente manda expressá-las como '0' quando as condições do Anexo IV se cumprem (art. 7º, II) — isso é ajuste de arte, anotado aqui, não mudança de dado. As linhas que o rótulo não imprime (açúcares totais, açúcares adicionados, gorduras saturadas e trans, fibras) foram derivadas da composição quando a derivação é exata (ex.: açúcares ≤ carboidratos impressos ≤ 0,5 g → 0; gorduras saturadas ≤ gorduras totais 0 g → 0; sem fonte de fibra → 0; lista de ingredientes sem açúcar → açúcares adicionados 0) e ficaram PENDENTES quando não é (base das gomas, extratos sem laudo, maltodextrina sem perfil de açúcares). No Césio 137 a frase impressa 'não contém quantidades significativas de açúcares adicionados, gorduras saturadas, gorduras trans e fibras alimentares' vale como dado lido.
4. **Macronutrientes e energia nas 9 sem rótulo:** calculados pelos insumos cadastrados com os fatores do Anexo XXII (carboidratos 4; proteínas 4; gorduras 9; ácidos orgânicos 3; sorbitol 2,6; maltitol 2,1; fibras solúveis 2), kJ = kcal × 4,184 (o Anexo XXII não traz kJ), energia e %VD em inteiros (art. 7º, §1º); quantidade não significativa expressa como '0' (Anexo IV) e %VD 0. O que depende de dado ausente ficou PROVISÓRIO (⚠) ou PENDENTE: sódio das cápsulas/softgels (cápsula e excipientes fora do cadastro), sódio do colágeno hidrolisado, teor proteico do colágeno (último teor conhecido 91,0 %, laudo vencido), base das gomas e veículo líquido não cadastrados, extratos sem laudo, composições incompletas.
5. **Critério único para aminoácidos livres, creatina, taurina e L-carnitina (decisão pendente do RT):** não contam como proteína nem como energia — o Anexo XXII não traz fator para eles; são declarados só na própria linha, em mg, com ⚠ e a nota 'critério pendente do RT'. Onde o rótulo impresso os somou (Césio 137: 'Proteínas 8 g'; Dream Gummy: 'Proteínas 0,8 g'), a linha impressa foi mantida e marcada ⚠ com a conta alternativa. Registro literal do Anexo IV da IN 75 que pesa nessa decisão: a expressão '0' para proteínas só é admitida 'sem aminoácido naturalmente presente nas proteínas declarado com valor diferente de zero' — nas tabelas sem rótulo que declaram aminoácidos, a linha Proteínas traz 0 g com ⚠ e o valor alternativo.
6. **%VD:** recalculado com os VDR vigentes do Anexo VIII da IN 75 (adultos ≥ 19 anos: coluna '≥ 19 anos'; Multi Vitta: colunas 'Gestantes' e 'Lactantes'), sobre a quantidade arredondada declarada (art. 12, caput), em inteiro (meio para cima); quantidade não significativa → 0 % (art. 12, §2º); constituinte sem VDR (aminoácidos, creatina, cafeína, melatonina, poliois, açúcares totais, bioativos) → célula vazia (art. 12, §1º), sem '**'. **Toda diferença entre o %VD impresso no rótulo e o vigente está listada na seção 'Diferenças de %VD' no fim** — os rótulos usaram VDR da norma revogada (RDC 360/2003: vitamina C 45 mg, vitamina E 10 mg, vitamina A 600 µg, niacina 16 mg, riboflavina 1,3 mg, vitamina D 5 µg) ou marcaram '**' em constituintes que hoje têm VDR (vitamina K, colina).
7. **Arredondamento:** Anexo III da IN 75, lido literalmente: ≥ 10 → inteiro; de 1 a menos de 10 → uma casa (inteiro se a casa for 0); < 1 g → uma casa; < 1 mg/µg → duas casas (uma se a segunda for 0). Milhar com ponto, decimal com vírgula. Aplicado também aos valores impressos ('3,0 g' → '3 g'; 1,65 mg → 1,7 mg; 29,59 mg → 30 mg — anotado quando muda a leitura contra o limite).
8. **Sal × elemento:** a tabela declara o elemento (magnésio, zinco, ferro, cálcio, cromo, cobre, boro, silício). Nos rótulos que declaram só o sal sem o elemento (Nuviart: carbonato de cálcio, bisglicinato de magnésio; ZMA: quelato de boro), a linha fica PENDENTE ou PROVISÓRIA com a conta estequiométrica/de laudo no motivo. Nos cadastros sem rótulo, a convenção do catálogo ('magnésio (bisglicinato de magnésio) 63 mg' = 63 mg de elemento) foi assumida e marcada ⚠ onde a leitura alternativa muda o veredito.
9. **Vitamina E:** os rótulos declaram a massa do insumo (DL-alfa-tocoferol ou seu acetato). A IN 75 (Anexo XXIII) expressa vitamina E em mg de alfa-tocoferol ('1 mg de alfa-tocoferol = 2 mg de alfa-tocoferol sintético') e a IN 28 (nota iii do Anexo IV) usa 0,67 para o rac-α-tocoferil; as duas normas dão equivalências diferentes. A linha mantém o número impresso/cadastrado com ⚠ e as duas leituras — decisão do RT. Vitamina A: os rótulos tratam a massa do acetato de retinol como RAE (os %VD impressos mostram isso); mantido, com a leitura alternativa anotada.
10. **Aditivos** (ácido cítrico, dióxido de silício, sucralose, aromas, corantes, conservantes) não são constituintes e não entram na tabela; o ácido cítrico entra só na conta de energia (3 kcal/g).

**Legenda:** ⚠ = linha PROVISÓRIA (número calculado com dado incompleto, leitura ambígua ou dependente do critério do RT) ou com constituinte fora da faixa/forma não autorizada (a tabela declara o que existe; o motivo diz o problema); PENDENTE = sem dado de fonte. Nada foi preenchido com valor plausível.

---

## BELLA GUMMY (Biotina em Gummy) (`bella-gummy-biotina-em-gummy`)

- **Fonte da composição:** rótulo BioGummy.pdf (JSON de extração de 13/09/2026)
- **Porção:** 6 g (2 gomas)
- **Porções por embalagem:** 30
- **Grupo populacional (%VD):** adultos (≥ 19 anos)
- **Veredito da auditoria de 15/09/2026 (composição atual):** 100% CONFORME (auditoria 4.1)

**INFORMAÇÃO NUTRICIONAL**

Porções por embalagem: 30  
Porção: 6 g (2 gomas)

| | 6 g | %VD* |
|---|---|---|
| Valor energético | 12 kcal = 50 kJ | 1% |
| Carboidratos | 4,8 g | 2% |
| &nbsp;&nbsp;&nbsp;&nbsp;Açúcares totais ⚠ | PENDENTE |  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Açúcares adicionados | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Poliois totais | 3,4 g |  |
| Proteínas | 0,6 g | 1% |
| Gorduras totais | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras saturadas | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras trans | 0 g | 0% |
| Fibras alimentares ⚠ | PENDENTE |  |
| Sódio | 8 mg | 0% |
| Vitamina A | 1.020 µg RAE | 128% |
| Vitamina E ⚠ | 17 mg | 113% |
| Vitamina C | 45 mg | 45% |
| Biotina | 45 µg | 150% |
| Zinco | 2,4 mg | 22% |

*Percentual de valores diários fornecidos pela porção

Bloco de texto puro (vai para `formulas.nutritional_info`):

```
INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 6 g (2 gomas)
 | 6 g | %VD*
Valor energético | 12 kcal = 50 kJ | 1%
Carboidratos | 4,8 g | 2%
  Açúcares totais | PENDENTE | 
    Açúcares adicionados | 0 g | 0%
  Poliois totais | 3,4 g | 
Proteínas | 0,6 g | 1%
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | PENDENTE | 
Sódio | 8 mg | 0%
Vitamina A | 1.020 µg RAE | 128%
Vitamina E | 17 mg | 113%
Vitamina C | 45 mg | 45%
Biotina | 45 µg | 150%
Zinco | 2,4 mg | 22%
*Percentual de valores diários fornecidos pela porção
```

**Linhas PENDENTES / PROVISÓRIAS (⚠) e o motivo:**

- Açúcares totais — PENDENTE: rótulo não imprime a linha; carboidratos 4,8 g − poliois 3,4 g = 1,4 g de outros carboidratos (maltodextrina/base) sem perfil de açúcares — pode passar de 0,5 g
- Fibras alimentares — PENDENTE: pectina cítrica e goma acácia na base da goma, sem quantidade no rótulo; o rótulo não imprime a linha
- Vitamina E — PROVISÓRIA: DL-alfa-tocoferol 16,7 mg — a fonte declara a massa do insumo; a IN 75 (Anexo XXIII) expressa vitamina E em mg de alfa-tocoferol (1 mg de alfa-tocoferol = 2 mg de alfa-tocoferol sintético) e a IN 28 (nota iii do Anexo IV) usa 0,67 para o rac-α-tocoferil — em equivalentes a linha e o %VD mudam; decisão do RT

Notas de linha:

- Valor energético: base da goma (sorbitol, maltitol, gelatina, maltodextrina, pectina, goma acácia) não quantificada no rótulo — a conta pelos insumos não é possível; valor impresso mantido
- Açúcares adicionados: lista de ingredientes do rótulo sem açúcar adicionado (sorbitol, maltitol, gelatina, água, glicerina, maltodextrina, pectina, goma acácia, ácido cítrico, citrato de sódio, aroma, sucralose)
- Proteínas: gelatina da base, não quantificada no rótulo
- Gorduras saturadas: gorduras totais impressas 0 g
- Gorduras trans: gorduras totais impressas 0 g
- Vitamina A: acetato de retinol 1.020 mcg; o %VD impresso (170 % de 600) trata o número como RAE
- Vitamina E: valor antes do arredondamento: 16,7 mg → declarado 17 mg (Anexo III da IN 75; %VD sobre o valor declarado)
- Biotina: igual ao máximo do Anexo IV da IN 28 (45 µg)
- Zinco: rótulo: 'bisglicinato de zinco 12 mg (equivalente a 2,4 mg de zinco)'; a tabela declara o elemento

Diferenças entre o %VD impresso no rótulo e o vigente (Anexo VIII da IN 75):

- Vitamina A (1.020 µg RAE): impresso 170 → vigente 128%
- Vitamina E (17 mg): impresso 111 → vigente 113%

Observações:

- Composição-fonte: rótulo BioGummy.pdf (5 insumos), idêntica ao cadastro ativo do banco. Auditoria de 15/09/2026: 100 % CONFORME.

---

## Biotina em Cápsula (`biotina-em-capsula`)

- **Fonte da composição:** rótulo BioPrincess.pdf (JSON de extração de 13/09/2026)
- **Porção:** 1 g (2 cápsulas)
- **Porções por embalagem:** 30
- **Grupo populacional (%VD):** adultos (≥ 19 anos)
- **Veredito da auditoria de 15/09/2026 (composição atual):** NÃO CONFORME (auditoria 4.6: colágeno hidrolisado abaixo do mínimo; selênio em forma não autorizada)

**INFORMAÇÃO NUTRICIONAL**

Porções por embalagem: 30  
Porção: 1 g (2 cápsulas)

| | 1 g | %VD* |
|---|---|---|
| Valor energético | 2 kcal = 6 kJ | 0% |
| Carboidratos | 0,1 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Açúcares totais | 0 g |  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Açúcares adicionados | 0 g | 0% |
| Proteínas ⚠ | 0,3 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;L-metionina ⚠ | 110 mg |  |
| &nbsp;&nbsp;&nbsp;&nbsp;L-cisteína ⚠ | 100 mg |  |
| Gorduras totais | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras saturadas | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras trans | 0 g | 0% |
| Fibras alimentares | 0 g | 0% |
| Sódio | 0 mg | 0% |
| Vitamina A | 1.500 µg RAE | 188% |
| Vitamina D | 50 µg | 333% |
| Vitamina E ⚠ | 45 mg | 300% |
| Vitamina C | 250 mg | 250% |
| Riboflavina | 2,7 mg | 225% |
| Niacina | 35 mg NE | 233% |
| Ácido pantotênico | 5,6 mg | 112% |
| Vitamina B6 | 10 mg | 769% |
| Biotina | 45 µg | 150% |
| Ácido fólico | 667 µg DFE | 167% |
| Vitamina B12 | 9,9 µg | 413% |
| Cobre | 900 µg | 100% |
| Iodo | 150 µg | 100% |
| Selênio ⚠ | 60 µg | 100% |
| Zinco | 15 mg | 136% |
| Metilsulfonilmetano | 50 mg |  |
| Ácido hialurônico | 50 mg |  |
| Silício ⚠ | 0,72 mg |  |

*Percentual de valores diários fornecidos pela porção

Bloco de texto puro (vai para `formulas.nutritional_info`):

```
INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 1 g (2 cápsulas)
 | 1 g | %VD*
Valor energético | 2 kcal = 6 kJ | 0%
Carboidratos | 0,1 g | 0%
  Açúcares totais | 0 g | 
    Açúcares adicionados | 0 g | 0%
Proteínas | 0,3 g | 0%
  L-metionina | 110 mg | 
  L-cisteína | 100 mg | 
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | 0 g | 0%
Sódio | 0 mg | 0%
Vitamina A | 1.500 µg RAE | 188%
Vitamina D | 50 µg | 333%
Vitamina E | 45 mg | 300%
Vitamina C | 250 mg | 250%
Riboflavina | 2,7 mg | 225%
Niacina | 35 mg NE | 233%
Ácido pantotênico | 5,6 mg | 112%
Vitamina B6 | 10 mg | 769%
Biotina | 45 µg | 150%
Ácido fólico | 667 µg DFE | 167%
Vitamina B12 | 9,9 µg | 413%
Cobre | 900 µg | 100%
Iodo | 150 µg | 100%
Selênio | 60 µg | 100%
Zinco | 15 mg | 136%
Metilsulfonilmetano | 50 mg | 
Ácido hialurônico | 50 mg | 
Silício | 0,72 mg | 
*Percentual de valores diários fornecidos pela porção
```

**Linhas PENDENTES / PROVISÓRIAS (⚠) e o motivo:**

- Proteínas — PROVISÓRIA: valor impresso 0,3 g (colágeno hidrolisado 120 mg + gelatina da cápsula); L-metionina 110 mg e L-cisteína 100 mg não somadas (critério pendente do RT); o colágeno hidrolisado é fonte de proteínas do Anexo I e está ABAIXO DO MÍNIMO de 8,4 g (auditoria 4.6); %VD vigente 0 (≤ 0,5 g) contra 1 % impresso
- L-metionina — PROVISÓRIA: declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)
- L-cisteína — PROVISÓRIA: declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)
- Vitamina E — PROVISÓRIA: acetato de DL-alfa-tocoferol 45 mg — a fonte declara a massa do insumo; a IN 75 (Anexo XXIII) expressa vitamina E em mg de alfa-tocoferol (1 mg de alfa-tocoferol = 2 mg de alfa-tocoferol sintético) e a IN 28 (nota iii do Anexo IV) usa 0,67 para o rac-α-tocoferil — em equivalentes a linha e o %VD mudam; decisão do RT (22,5 mg = 150 % pela IN 75; 30,15 mg = 201 % pela IN 28)
- Selênio — PROVISÓRIA: FORMA NÃO AUTORIZADA: 'selênio quelado' não consta das fontes de selênio do Anexo I da IN 28 (auditoria 4.6); a tabela declara o que o rótulo diz existir
- Silício — PROVISÓRIA: PROVISÓRIO — rótulo declara 'silício orgânico (ácido ortossilícico) 50 mg' (massa do insumo); silício elementar calculado com o laudo Fagron lote 216957 (Si 1,43 %): 50 × 0,0143 = 0,715 mg; se o lote em uso for outro, o número muda

Notas de linha:

- Valor energético: conta pelos insumos (critério único): colágeno hidrolisado 0,12 g × 4 = 0,5 kcal + maltodextrina e cápsula de gelatina sem quantidade no rótulo — não significativo nas duas leituras; kJ impresso 6 (2 kcal × 4,184 = 8)
- Carboidratos: maltodextrina (excipiente) sem quantidade no rótulo
- Açúcares totais: ≤ carboidratos impressos (0,1 g) → não significativo (Anexo IV)
- Açúcares adicionados: sem açúcar na lista de ingredientes; ≤ 0,1 g
- Gorduras saturadas: gorduras totais impressas 0 g
- Gorduras trans: gorduras totais impressas 0 g
- Fibras alimentares: sem fonte de fibra na composição do rótulo
- Vitamina A: acetato de retinol 1.500 mcg; %VD impresso (250 % de 600) trata como RAE
- Vitamina D: igual ao máximo (50 µg)
- Riboflavina: igual ao máximo (2,74 mg); valor antes do arredondamento: 2,74 mg → declarado 2,7 mg (Anexo III da IN 75; %VD sobre o valor declarado)
- Niacina: nicotinamida 35 mg = 35 mg NE; igual ao máximo
- Ácido pantotênico: igual ao máximo (5,64 mg); valor antes do arredondamento: 5,64 mg → declarado 5,6 mg (Anexo III da IN 75; %VD sobre o valor declarado)
- Biotina: igual ao máximo (45 µg)
- Ácido fólico: rótulo imprime 400 mcg de ácido fólico; em DFE (Anexo XXIII: 1 µg DFE = 0,6 µg de ácido fólico) = 400 / 0,6 = 666,67 → 667 µg DFE; o %VD impresso (167 %) já usa a conversão; valor antes do arredondamento: 666,67 µg DFE → declarado 667 µg DFE (Anexo III da IN 75; %VD sobre o valor declarado)
- Vitamina B12: metilcobalamina; igual ao máximo (9,94 µg); valor antes do arredondamento: 9,94 µg → declarado 9,9 µg (Anexo III da IN 75; %VD sobre o valor declarado)
- Cobre: 'cobre quelado' não identifica nenhuma das cinco formas do Anexo I — NÃO VERIFICADO (auditoria 4.6)
- Zinco: valor do elemento (tabela do rótulo: 136 % VD)
- Ácido hialurônico: lista de ingredientes: hialuronato de sódio; origem (fermentação de Streptococcus zooepidemicus) não declarada — NÃO VERIFICADO
- Silício: valor antes do arredondamento: 0,71 mg → declarado 0,72 mg (Anexo III da IN 75; %VD sobre o valor declarado)

Diferenças entre o %VD impresso no rótulo e o vigente (Anexo VIII da IN 75):

- Proteínas (0,3 g): impresso 1 → vigente 0%
- Vitamina A (1.500 µg RAE): impresso 250 → vigente 188%
- Vitamina E (45 mg): impresso 450 → vigente 300%
- Vitamina C (250 mg): impresso 556 → vigente 250%
- Riboflavina (2,7 mg): impresso 211 → vigente 225%
- Niacina (35 mg NE): impresso 219 → vigente 233%
- Ácido pantotênico (5,6 mg): impresso 113 → vigente 112%
- Vitamina B12 (9,9 µg): impresso 414 → vigente 413%

Observações:

- Composição-fonte: rótulo BioPrincess.pdf (21 itens, inclusive colágeno hidrolisado 120 mg que o cadastro do banco removeu em 14/09). Auditoria de 15/09/2026: NÃO CONFORME.
- Colágeno hidrolisado 120 mg não recebe linha própria: é fonte de Proteínas (Anexo I da IN 28) e entra na linha Proteínas (ver ⚠).
- Seis constituintes exatamente no máximo do Anexo IV da IN 28 (riboflavina, niacina, ácido pantotênico, vitamina D, biotina, vitamina B12) — sem margem de fabricação (observação da auditoria).

---

## CREATINA MONOIDRATADA 150 g SOLÚVEL (`creatina-monohidratada-150g-soluvel`)

- **Fonte da composição:** rótulo CreatinaPo.pdf (JSON de extração de 13/09/2026)
- **Porção:** 5 g (1 scoop)
- **Porções por embalagem:** 30
- **Grupo populacional (%VD):** adultos (≥ 19 anos)
- **Veredito da auditoria de 15/09/2026 (composição atual):** 100% CONFORME (auditoria 4.2)

**INFORMAÇÃO NUTRICIONAL**

Porções por embalagem: 30  
Porção: 5 g (1 scoop)

| | 5 g | %VD* |
|---|---|---|
| Valor energético | 0 kcal = 0 kJ | 0% |
| Carboidratos | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Açúcares totais | 0 g |  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Açúcares adicionados | 0 g | 0% |
| Proteínas | 0 g | 0% |
| Gorduras totais | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras saturadas | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras trans | 0 g | 0% |
| Fibras alimentares | 0 g | 0% |
| Sódio | 0 mg | 0% |
| Creatina ⚠ | 5.000 mg |  |

*Percentual de valores diários fornecidos pela porção

Bloco de texto puro (vai para `formulas.nutritional_info`):

```
INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 5 g (1 scoop)
 | 5 g | %VD*
Valor energético | 0 kcal = 0 kJ | 0%
Carboidratos | 0 g | 0%
  Açúcares totais | 0 g | 
    Açúcares adicionados | 0 g | 0%
Proteínas | 0 g | 0%
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | 0 g | 0%
Sódio | 0 mg | 0%
Creatina | 5.000 mg | 
*Percentual de valores diários fornecidos pela porção
```

**Linhas PENDENTES / PROVISÓRIAS (⚠) e o motivo:**

- Creatina — PROVISÓRIA: creatina monoidratada 5.000 mg (massa nominal do insumo, como impresso: 'Creatina (mg) 5000 mg'); igual ao máximo de 5.000 mg (IN 373/2025); declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)

Notas de linha:

- Valor energético: creatina sem fator no Anexo XXII (critério único) — coincide com o impresso
- Fibras alimentares: composição: só creatina monoidratada

Observações:

- Composição-fonte: rótulo CreatinaPo.pdf (1 insumo), idêntica ao cadastro. Auditoria de 15/09/2026: 100 % CONFORME.

---

## Detox Matinal (Lemon Shot) 300 g (`detox-matinal-lemon-shot-300g`)

- **Fonte da composição:** rótulo Detox.pdf (JSON de extração de 13/09/2026)
- **Porção:** 10 g (1 dose)
- **Porções por embalagem:** 30
- **Grupo populacional (%VD):** adultos (≥ 19 anos)
- **Veredito da auditoria de 15/09/2026 (composição atual):** NÃO CONFORME (auditoria 4.7: zinco abaixo do mínimo; três extratos sem laudo)

**INFORMAÇÃO NUTRICIONAL**

Porções por embalagem: 30  
Porção: 10 g (1 dose)

| | 10 g | %VD* |
|---|---|---|
| Valor energético ⚠ | 34 kcal = 143 kJ | 2% |
| Carboidratos ⚠ | 8,5 g | 3% |
| &nbsp;&nbsp;&nbsp;&nbsp;Açúcares totais ⚠ | PENDENTE |  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Açúcares adicionados | 0 g | 0% |
| Proteínas | 0 g | 0% |
| Gorduras totais | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras saturadas | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras trans | 0 g | 0% |
| Fibras alimentares ⚠ | PENDENTE |  |
| Sódio | 5 mg | 0% |
| Vitamina C | 1.600 mg | 1600% |
| Zinco ⚠ | 0,29 mg | 3% |
| Ácido clorogênico ⚠ | PENDENTE |  |
| Curcumina ⚠ | PENDENTE |  |
| Antocianinas da laranja moro ⚠ | PENDENTE |  |

*Percentual de valores diários fornecidos pela porção

Bloco de texto puro (vai para `formulas.nutritional_info`):

```
INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 10 g (1 dose)
 | 10 g | %VD*
Valor energético | 34 kcal = 143 kJ | 2%
Carboidratos | 8,5 g | 3%
  Açúcares totais | PENDENTE | 
    Açúcares adicionados | 0 g | 0%
Proteínas | 0 g | 0%
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | PENDENTE | 
Sódio | 5 mg | 0%
Vitamina C | 1.600 mg | 1600%
Zinco | 0,29 mg | 3%
Ácido clorogênico | PENDENTE | 
Curcumina | PENDENTE | 
Antocianinas da laranja moro | PENDENTE | 
*Percentual de valores diários fornecidos pela porção
```

**Linhas PENDENTES / PROVISÓRIAS (⚠) e o motivo:**

- Valor energético — PROVISÓRIA: valor impresso (34 kcal); conta pelos insumos (critério único): maltodextrina 6,603 g × 4 + ácido cítrico 0,67 g × 3 = 28,4 kcal (+ carreadores dos extratos, desconhecidos) — diverge do impresso; kJ impresso 143 (34 × 4,184 = 142)
- Carboidratos — PROVISÓRIA: valor impresso (8,5 g); conta pelos insumos: maltodextrina 6,603 g (+ carreadores dos extratos, desconhecidos) — diverge do impresso
- Açúcares totais — PENDENTE: maltodextrina 6,603 g sem perfil de açúcares (laudo); o rótulo não imprime a linha
- Fibras alimentares — PENDENTE: extratos de café verde (400 mg), cúrcuma (130 mg) e laranja moro (100 mg) sem laudo de composição; o rótulo não imprime a linha
- Zinco — PROVISÓRIA: ABAIXO DO MÍNIMO: 0,29 mg de zinco (rótulo: 'bisglicinato de zinco 1,45 mg (equivalente a 0,29 mg de zinco)') contra mínimo de 1,65 mg do Anexo III da IN 28 (auditoria 4.7)
- Ácido clorogênico — PENDENTE: extrato de café verde (Coffea arabica L.) 0,4 g sem laudo de padronização — teor de ácido clorogênico e de cafeína desconhecidos (auditoria 4.7)
- Curcumina — PENDENTE: extrato de rizomas de Curcuma longa L. 0,13 g sem laudo de curcuminoides (faixa da IN 28: 80 a 130 mg)
- Antocianinas da laranja moro — PENDENTE: extrato de laranja moro 0,1 g sem laudo de antocianinas (máximo 5 mg)

Notas de linha:

- Açúcares adicionados: sem açúcar na lista de ingredientes
- Sódio: 5 mg ≤ 5 mg → não significativo (Anexo IV) → %VD 0
- Vitamina C: rótulo: 1,6 g = 1.600 mg

Observações:

- Composição-fonte: rótulo Detox.pdf (11 itens). Auditoria de 15/09/2026: NÃO CONFORME. Aditivos (ácido cítrico 0,67 g, aroma 0,33 g, dióxido de silício 0,1 g, sucralose 0,05 g, corantes 0,017 g) não são constituintes e não entram na tabela; o ácido cítrico entra na conta de energia (3 kcal/g).

---

## Melatonina em Gummy Sabor Uva (`melatonina-em-gummy-sabor-uva`)

- **Fonte da composição:** rótulo DreamGummy.pdf (JSON de extração de 13/09/2026)
- **Porção:** 6 g (2 gomas)
- **Porções por embalagem:** 30
- **Grupo populacional (%VD):** adultos (≥ 19 anos)
- **Veredito da auditoria de 15/09/2026 (composição atual):** 100% CONFORME (auditoria 4.4)

**INFORMAÇÃO NUTRICIONAL**

Porções por embalagem: 30  
Porção: 6 g (2 gomas)

| | 6 g | %VD* |
|---|---|---|
| Valor energético | 11 kcal = 46 kJ | 1% |
| Carboidratos | 4,5 g | 2% |
| &nbsp;&nbsp;&nbsp;&nbsp;Açúcares totais ⚠ | PENDENTE |  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Açúcares adicionados | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Poliois totais | 3,4 g |  |
| Proteínas ⚠ | 0,8 g | 2% |
| &nbsp;&nbsp;&nbsp;&nbsp;L-triptofano ⚠ | 800 mg |  |
| Gorduras totais | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras saturadas | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras trans | 0 g | 0% |
| Fibras alimentares ⚠ | PENDENTE |  |
| Sódio | 8 mg | 0% |
| Melatonina | 0,21 mg |  |

*Percentual de valores diários fornecidos pela porção

Bloco de texto puro (vai para `formulas.nutritional_info`):

```
INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 6 g (2 gomas)
 | 6 g | %VD*
Valor energético | 11 kcal = 46 kJ | 1%
Carboidratos | 4,5 g | 2%
  Açúcares totais | PENDENTE | 
    Açúcares adicionados | 0 g | 0%
  Poliois totais | 3,4 g | 
Proteínas | 0,8 g | 2%
  L-triptofano | 800 mg | 
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | PENDENTE | 
Sódio | 8 mg | 0%
Melatonina | 0,21 mg | 
*Percentual de valores diários fornecidos pela porção
```

**Linhas PENDENTES / PROVISÓRIAS (⚠) e o motivo:**

- Açúcares totais — PENDENTE: rótulo não imprime a linha; carboidratos 4,5 g − poliois 3,4 g = 1,1 g de outros carboidratos sem perfil de açúcares
- Proteínas — PROVISÓRIA: valor impresso 0,8 g; L-triptofano 800 mg (= 0,8 g) não conta como proteína pelo critério único (pendente do RT) — o impresso parece somar o triptofano; gelatina da base não quantificada
- L-triptofano — PROVISÓRIA: declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)
- Fibras alimentares — PENDENTE: base da goma (pectina, goma) sem quantidade no rótulo; o rótulo não imprime a linha

Notas de linha:

- Valor energético: base da goma não quantificada no rótulo; valor impresso mantido
- Açúcares adicionados: lista de ingredientes do rótulo sem açúcar adicionado (conferido no JSON de extração)
- Melatonina: igual ao máximo (0,21 mg)

Observações:

- Composição-fonte: rótulo DreamGummy.pdf (2 insumos), idêntica ao cadastro. Auditoria de 15/09/2026: 100 % CONFORME. Ressalva da auditoria: documentos da fábrica divergem sobre este slug (Dream Gummy × Melatonina em Gummy só com melatonina).

---

## Saúde Intestinal (Floravex) (`saude-intestinal`)

- **Fonte da composição:** rótulo Floravex-intestino.pdf (JSON de extração de 13/09/2026)
- **Porção:** 1 g (2 cápsulas)
- **Porções por embalagem:** 30
- **Grupo populacional (%VD):** adultos (≥ 19 anos)
- **Veredito da auditoria de 15/09/2026 (composição atual):** NÃO CONFORME (auditoria 4.8: fibras abaixo do mínimo)

**INFORMAÇÃO NUTRICIONAL**

Porções por embalagem: 30  
Porção: 1 g (2 cápsulas)

| | 1 g | %VD* |
|---|---|---|
| Valor energético ⚠ | 4 kcal = 17 kJ | 0% |
| Carboidratos ⚠ | 0,3 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Açúcares totais | 0 g |  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Açúcares adicionados | 0 g | 0% |
| Proteínas ⚠ | 0,3 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;L-glutamina ⚠ | 135 mg |  |
| Gorduras totais | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras saturadas | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras trans | 0 g | 0% |
| Fibras alimentares ⚠ | PENDENTE |  |
| Sódio | 0 mg | 0% |
| Vitamina A | 540 µg RAE | 68% |
| Vitamina B6 | 1,3 mg | 100% |
| Magnésio | 90 mg | 21% |
| Zinco | 14 mg | 127% |
| Curcumina ⚠ | PENDENTE |  |
| Quercetina | 72 mg |  |

*Percentual de valores diários fornecidos pela porção

Bloco de texto puro (vai para `formulas.nutritional_info`):

```
INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 1 g (2 cápsulas)
 | 1 g | %VD*
Valor energético | 4 kcal = 17 kJ | 0%
Carboidratos | 0,3 g | 0%
  Açúcares totais | 0 g | 
    Açúcares adicionados | 0 g | 0%
Proteínas | 0,3 g | 0%
  L-glutamina | 135 mg | 
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | PENDENTE | 
Sódio | 0 mg | 0%
Vitamina A | 540 µg RAE | 68%
Vitamina B6 | 1,3 mg | 100%
Magnésio | 90 mg | 21%
Zinco | 14 mg | 127%
Curcumina | PENDENTE | 
Quercetina | 72 mg | 
*Percentual de valores diários fornecidos pela porção
```

**Linhas PENDENTES / PROVISÓRIAS (⚠) e o motivo:**

- Valor energético — PROVISÓRIA: valor impresso (4 kcal); conta pelos insumos (critério único): inulina 135 mg + FOS 90 mg + psyllium 342 mg como fibras solúveis × 2 kcal/g = 1,1 kcal (+ extrato de cúrcuma e cápsula sem quantidade); L-glutamina não conta — não significativo nas duas leituras
- Carboidratos — PROVISÓRIA: valor impresso (0,3 g); psyllium, inulina e FOS são fibras, não carboidratos disponíveis; extrato de cúrcuma 117 mg com carreador desconhecido — a conta não reproduz o impresso
- Proteínas — PROVISÓRIA: valor impresso 0,3 g (gelatina da cápsula, não quantificada); L-glutamina 135 mg não somada (critério pendente do RT)
- L-glutamina — PROVISÓRIA: declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)
- Fibras alimentares — PENDENTE: ABAIXO DO MÍNIMO e sem laudo: psyllium 342 mg + inulina 135 mg + FOS 90 mg = 567 mg de fontes de fibra (teor de fibra de cada insumo sem laudo) contra mínimo de 5,7 g do Anexo III da IN 28 (auditoria 4.8); o rótulo não imprime a linha
- Curcumina — PENDENTE: extrato de rizomas de Curcuma longa L. 117 mg sem laudo de curcuminoides (faixa 80 a 130 mg)

Notas de linha:

- Açúcares totais: ≤ carboidratos impressos (0,3 g) → não significativo
- Açúcares adicionados: sem açúcar na lista de ingredientes
- Vitamina A: acetato de retinila 540 mcg; %VD impresso (90 % de 600) trata como RAE
- Vitamina B6: valor antes do arredondamento: 1,26 mg → declarado 1,3 mg (Anexo III da IN 75; %VD sobre o valor declarado)
- Magnésio: valor do elemento ('de bisglicinato de magnésio')
- Zinco: valor do elemento; valor antes do arredondamento: 13,5 mg → declarado 14 mg (Anexo III da IN 75; %VD sobre o valor declarado)

Diferenças entre o %VD impresso no rótulo e o vigente (Anexo VIII da IN 75):

- Vitamina A (540 µg RAE): impresso 90 → vigente 68%
- Vitamina B6 (1,3 mg): impresso 97 → vigente 100%
- Zinco (14 mg): impresso 123 → vigente 127%

Observações:

- Composição-fonte: rótulo Floravex-intestino.pdf (11 itens). Auditoria de 15/09/2026: NÃO CONFORME; a fórmula impressa (1.001 mg + sais dos elementos) não cabe em 1 g — ponto para a fábrica.

---

## FOCUS COLINA (`focus-colina`)

- **Fonte da composição:** rótulo FocusColina.pdf (JSON de extração de 13/09/2026)
- **Porção:** 1 g (2 cápsulas)
- **Porções por embalagem:** 30
- **Grupo populacional (%VD):** adultos (≥ 19 anos)
- **Veredito da auditoria de 15/09/2026 (composição atual):** NÃO CONFORME (auditoria 4.9: magnésio e tirosina abaixo do mínimo)

**INFORMAÇÃO NUTRICIONAL**

Porções por embalagem: 30  
Porção: 1 g (2 cápsulas)

| | 1 g | %VD* |
|---|---|---|
| Valor energético ⚠ | 4 kcal = 17 kJ | 0% |
| Carboidratos ⚠ | 0,3 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Açúcares totais | 0 g |  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Açúcares adicionados | 0 g | 0% |
| Proteínas ⚠ | 0,3 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;L-tirosina ⚠ | 220 mg |  |
| &nbsp;&nbsp;&nbsp;&nbsp;L-teanina ⚠ | 115 mg |  |
| Gorduras totais | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras saturadas | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras trans | 0 g | 0% |
| Fibras alimentares | 0 g | 0% |
| Sódio | 0 mg | 0% |
| Vitamina D | 5 µg | 33% |
| Vitamina B6 | 1,3 mg | 100% |
| Vitamina B12 | 2,4 µg | 100% |
| Magnésio ⚠ | 60 mg | 14% |
| Colina | 470 mg | 85% |
| L-carnitina ⚠ | 95 mg |  |
| Inositol | 25 mg |  |

*Percentual de valores diários fornecidos pela porção

Bloco de texto puro (vai para `formulas.nutritional_info`):

```
INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 1 g (2 cápsulas)
 | 1 g | %VD*
Valor energético | 4 kcal = 17 kJ | 0%
Carboidratos | 0,3 g | 0%
  Açúcares totais | 0 g | 
    Açúcares adicionados | 0 g | 0%
Proteínas | 0,3 g | 0%
  L-tirosina | 220 mg | 
  L-teanina | 115 mg | 
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | 0 g | 0%
Sódio | 0 mg | 0%
Vitamina D | 5 µg | 33%
Vitamina B6 | 1,3 mg | 100%
Vitamina B12 | 2,4 µg | 100%
Magnésio | 60 mg | 14%
Colina | 470 mg | 85%
L-carnitina | 95 mg | 
Inositol | 25 mg | 
*Percentual de valores diários fornecidos pela porção
```

**Linhas PENDENTES / PROVISÓRIAS (⚠) e o motivo:**

- Valor energético — PROVISÓRIA: valor impresso (4 kcal); conta pelos insumos (critério único): 0 kcal — colina, aminoácidos, L-carnitina e inositol sem fator no Anexo XXII; cápsula sem quantidade — não significativo nas duas leituras
- Carboidratos — PROVISÓRIA: valor impresso (0,3 g); conta pelos insumos: 0 g (nenhuma fonte de carboidrato na composição; a lista de ingredientes cita celulose microcristalina, sem quantidade)
- Proteínas — PROVISÓRIA: valor impresso 0,3 g; L-tirosina 220 mg, L-teanina 115 mg e L-carnitina 95 mg não somadas (critério pendente do RT); gelatina da cápsula não quantificada
- L-tirosina — PROVISÓRIA: ABAIXO DO MÍNIMO: 220 mg contra 262,5 mg (nota viii do Anexo III da IN 28: soma de fenilalanina e tirosina; não há fenilalanina na fórmula) — auditoria 4.9; declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)
- L-teanina — PROVISÓRIA: declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina); origem (folhas de Camellia sinensis, única forma autorizada) não declarada no rótulo — NÃO VERIFICADO
- Magnésio — PROVISÓRIA: ABAIXO DO MÍNIMO: 60 mg de magnésio (elemento, tabela do rótulo 14 % VD) contra mínimo de 63 mg (auditoria 4.9)
- L-carnitina — PROVISÓRIA: declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)

Notas de linha:

- Açúcares totais: ≤ carboidratos impressos (0,3 g)
- Açúcares adicionados: sem açúcar na lista de ingredientes
- Fibras alimentares: sem fonte de fibra na composição do rótulo
- Vitamina B12: cianocobalamina 2,4 mcg (o cadastro do banco diz metilcobalamina 9,94 mcg — divergência já registrada)
- Colina: rótulo: 'Colina (bitartarato de colina) 470 mg' — lido como colina (mesma convenção do magnésio no mesmo rótulo); se fosse massa do bitartarato (41 % de colina) seriam 193 mg; a tabela impressa não traz a linha

Observações:

- Composição-fonte: rótulo FocusColina.pdf (9 insumos). Auditoria de 15/09/2026: NÃO CONFORME. Cadastro do banco difere do rótulo em colina (438,14 mg), tirosina (262,5), magnésio (63), vitamina D (50 mcg) e B12 (metilcobalamina 9,94 mcg) — valores-teto, não a fórmula impressa.

---

## MORO SLIM (`moro-slim`)

- **Fonte da composição:** rótulo MoroSlim.pdf (JSON de extração de 13/09/2026)
- **Porção:** 1 g (2 cápsulas)
- **Porções por embalagem:** 30
- **Grupo populacional (%VD):** adultos (≥ 19 anos)
- **Veredito da auditoria de 15/09/2026 (composição atual):** NÃO CONFORME (auditoria 4.10: espirulina e fibras abaixo do mínimo; quatro extratos sem laudo)

**INFORMAÇÃO NUTRICIONAL**

Porções por embalagem: 30  
Porção: 1 g (2 cápsulas)

| | 1 g | %VD* |
|---|---|---|
| Valor energético ⚠ | 3 kcal = 12 kJ | 0% |
| Carboidratos ⚠ | 0,2 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Açúcares totais | 0 g |  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Açúcares adicionados | 0 g | 0% |
| Proteínas ⚠ | 0 g | 0% |
| Gorduras totais | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras saturadas | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras trans | 0 g | 0% |
| Fibras alimentares ⚠ | PENDENTE |  |
| Sódio | 0 mg | 0% |
| Vitamina A | 1.500 µg RAE | 188% |
| Cromo | 250 µg | 714% |
| Ácido clorogênico ⚠ | PENDENTE |  |
| Curcumina ⚠ | PENDENTE |  |
| Antocianinas da laranja moro ⚠ | PENDENTE |  |
| Saponinas de glicosídeos de furostanol ⚠ | PENDENTE |  |

*Percentual de valores diários fornecidos pela porção

Bloco de texto puro (vai para `formulas.nutritional_info`):

```
INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 1 g (2 cápsulas)
 | 1 g | %VD*
Valor energético | 3 kcal = 12 kJ | 0%
Carboidratos | 0,2 g | 0%
  Açúcares totais | 0 g | 
    Açúcares adicionados | 0 g | 0%
Proteínas | 0 g | 0%
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | PENDENTE | 
Sódio | 0 mg | 0%
Vitamina A | 1.500 µg RAE | 188%
Cromo | 250 µg | 714%
Ácido clorogênico | PENDENTE | 
Curcumina | PENDENTE | 
Antocianinas da laranja moro | PENDENTE | 
Saponinas de glicosídeos de furostanol | PENDENTE | 
*Percentual de valores diários fornecidos pela porção
```

**Linhas PENDENTES / PROVISÓRIAS (⚠) e o motivo:**

- Valor energético — PROVISÓRIA: valor impresso (3 kcal); conta pelos insumos: inulina 44 mg e psyllium 66 mg como fibras solúveis × 2 = 0,2 kcal; espirulina 122 mg e quitosana 122 mg sem laudo de proteína/fibra; extratos secos 640 mg sem laudo — não reproduzível; kJ impresso 12 (3 × 4,184 = 13)
- Carboidratos — PROVISÓRIA: valor impresso (0,2 g); carreadores dos quatro extratos secos (640 mg) desconhecidos — não reproduzível
- Proteínas — PROVISÓRIA: valor impresso 0 g; espirulina (Arthrospira platensis) 122 mg é fonte de Proteínas no Anexo I e está ABAIXO DO MÍNIMO de 8,4 g (auditoria 4.10); teor proteico do insumo sem laudo
- Fibras alimentares — PENDENTE: ABAIXO DO MÍNIMO e sem laudo: quitosana 122 mg + psyllium 66 mg + inulina 44 mg = 232 mg de fontes de fibra contra mínimo de 5,7 g (auditoria 4.10); extratos secos de composição desconhecida; o rótulo não imprime a linha
- Ácido clorogênico — PENDENTE: extrato seco de café verde 110 mg sem laudo de padronização (ácido clorogênico e cafeína)
- Curcumina — PENDENTE: extrato seco de cúrcuma 135 mg sem laudo de curcuminoides (faixa 80 a 130 mg)
- Antocianinas da laranja moro — PENDENTE: extrato seco de laranja moro 175 mg sem laudo de antocianinas (máximo 5 mg)
- Saponinas de glicosídeos de furostanol — PENDENTE: extrato seco de feno-grego 220 mg sem laudo de saponinas (máximo 450 mg)

Notas de linha:

- Açúcares totais: ≤ carboidratos impressos (0,2 g)
- Açúcares adicionados: sem açúcar na lista de ingredientes
- Vitamina A: acetato de retinol 1.500 mcg; %VD impresso (250 % de 600) trata como RAE
- Cromo: valor do elemento (picolinato de cromo); igual ao máximo (250 µg)

Diferenças entre o %VD impresso no rótulo e o vigente (Anexo VIII da IN 75):

- Vitamina A (1.500 µg RAE): impresso 250 → vigente 188%

Observações:

- Composição-fonte: rótulo MoroSlim.pdf (11 itens). Auditoria de 15/09/2026: NÃO CONFORME. O cadastro do banco cita guaraná na lista de ingredientes; o rótulo não traz guaraná (por isso não há linha de cafeína).

---

## Multivitamínico (`multivitaminico`)

- **Fonte da composição:** rótulo multivitaminico.pdf (JSON de extração de 13/09/2026)
- **Porção:** 1 g (2 cápsulas)
- **Porções por embalagem:** 30
- **Grupo populacional (%VD):** adultos (≥ 19 anos)
- **Veredito da auditoria de 15/09/2026 (composição atual):** NÃO CONFORME (auditoria 4.11: boro em forma não autorizada; ácido fólico acima do máximo na leitura literal)

**INFORMAÇÃO NUTRICIONAL**

Porções por embalagem: 30  
Porção: 1 g (2 cápsulas)

| | 1 g | %VD* |
|---|---|---|
| Valor energético ⚠ | 4 kcal = 17 kJ | 0% |
| Carboidratos ⚠ | 0,3 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Açúcares totais | 0 g |  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Açúcares adicionados | 0 g | 0% |
| Proteínas ⚠ | 0,3 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;L-teanina ⚠ | 150 mg |  |
| Gorduras totais | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras saturadas | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras trans | 0 g | 0% |
| Fibras alimentares | 0 g | 0% |
| Sódio | 0 mg | 0% |
| Vitamina A | 1.300 µg RAE | 163% |
| Vitamina D | 50 µg | 333% |
| Vitamina E ⚠ | 10 mg | 67% |
| Vitamina K | 149 µg | 124% |
| Vitamina C | 100 mg | 100% |
| Tiamina | 1,2 mg | 100% |
| Riboflavina | 1,3 mg | 108% |
| Niacina | 16 mg NE | 107% |
| Ácido pantotênico | 5 mg | 100% |
| Vitamina B6 | 1,3 mg | 100% |
| Ácido fólico ⚠ | 1.333 µg DFE | 333% |
| Vitamina B12 | 9,9 µg | 413% |
| Cobre | 900 µg | 100% |
| Cromo | 35 µg | 100% |
| Magnésio | 260 mg | 62% |
| Selênio | 100 µg | 167% |
| Zinco | 15 mg | 136% |
| Boro ⚠ | 3 mg |  |

*Percentual de valores diários fornecidos pela porção

Bloco de texto puro (vai para `formulas.nutritional_info`):

```
INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 1 g (2 cápsulas)
 | 1 g | %VD*
Valor energético | 4 kcal = 17 kJ | 0%
Carboidratos | 0,3 g | 0%
  Açúcares totais | 0 g | 
    Açúcares adicionados | 0 g | 0%
Proteínas | 0,3 g | 0%
  L-teanina | 150 mg | 
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | 0 g | 0%
Sódio | 0 mg | 0%
Vitamina A | 1.300 µg RAE | 163%
Vitamina D | 50 µg | 333%
Vitamina E | 10 mg | 67%
Vitamina K | 149 µg | 124%
Vitamina C | 100 mg | 100%
Tiamina | 1,2 mg | 100%
Riboflavina | 1,3 mg | 108%
Niacina | 16 mg NE | 107%
Ácido pantotênico | 5 mg | 100%
Vitamina B6 | 1,3 mg | 100%
Ácido fólico | 1.333 µg DFE | 333%
Vitamina B12 | 9,9 µg | 413%
Cobre | 900 µg | 100%
Cromo | 35 µg | 100%
Magnésio | 260 mg | 62%
Selênio | 100 µg | 167%
Zinco | 15 mg | 136%
Boro | 3 mg | 
*Percentual de valores diários fornecidos pela porção
```

**Linhas PENDENTES / PROVISÓRIAS (⚠) e o motivo:**

- Valor energético — PROVISÓRIA: valor impresso (4 kcal); conta pelos insumos (critério único): 0 kcal — nenhum insumo com fator; cápsula sem quantidade — não significativo nas duas leituras
- Carboidratos — PROVISÓRIA: valor impresso (0,3 g); conta pelos insumos: 0 g
- Proteínas — PROVISÓRIA: valor impresso 0,3 g (gelatina da cápsula, não quantificada); L-teanina 150 mg não somada (critério pendente do RT)
- L-teanina — PROVISÓRIA: declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina); origem (Camellia sinensis) não declarada — NÃO VERIFICADO
- Vitamina E — PROVISÓRIA: 'acetato de tocoferol' 10 mg (D ou DL não especificado) — a fonte declara a massa do insumo; a IN 75 (Anexo XXIII) expressa vitamina E em mg de alfa-tocoferol (1 mg de alfa-tocoferol = 2 mg de alfa-tocoferol sintético) e a IN 28 (nota iii do Anexo IV) usa 0,67 para o rac-α-tocoferil — em equivalentes a linha e o %VD mudam; decisão do RT
- Ácido fólico — PROVISÓRIA: PROVISÓRIO — contradição interna do rótulo: a composição diz 'ácido fólico 800 mcg' (leitura literal: 800 / 0,6 = 1.333,33 → 1.333 µg DFE = 333 % VD, ACIMA DO MÁXIMO de 1.281,5 µg DFE, auditoria 4.11); o %VD impresso (200 % de 400) só fecha se o 800 já for DFE (= 480 mcg de ácido fólico, conforme). A fábrica precisa dizer qual é
- Boro — PROVISÓRIA: FORMA NÃO AUTORIZADA: 'quelato de boro' não consta do Anexo I da IN 28 (formas: frutoborato de cálcio; tetraborato de sódio decahidratado) — auditoria 4.11; 3 mg de boro (elemento, declarado) abaixo do máximo de 8,866 mg; sem VDR → célula vazia

Notas de linha:

- Açúcares totais: ≤ carboidratos impressos (0,3 g)
- Açúcares adicionados: sem açúcar na lista de ingredientes
- Fibras alimentares: sem fonte de fibra na composição
- Vitamina A: acetato de retinol 1.300 mcg; %VD impresso (217 % de 600) trata como RAE
- Vitamina D: igual ao máximo (50 µg)
- Vitamina K: menaquinona-7 149 mcg; o rótulo marca '**' (VD não estabelecido); VDR vigente do Anexo VIII: 120 µg → 124 %
- Niacina: nicotinamida 16 mg = 16 mg NE
- Ácido fólico: valor antes do arredondamento: 1.333,33 µg DFE → declarado 1.333 µg DFE (Anexo III da IN 75; %VD sobre o valor declarado)
- Vitamina B12: cianocobalamina; igual ao máximo (9,94 µg); valor antes do arredondamento: 9,94 µg → declarado 9,9 µg (Anexo III da IN 75; %VD sobre o valor declarado)
- Cobre: rótulo: 0,9 mg = 900 µg (bisglicinato de cobre)
- Magnésio: valor do elemento
- Selênio: selenito de sódio (forma autorizada no rótulo; o cadastro do banco diz 'selênio quelado')
- Zinco: valor do elemento

Diferenças entre o %VD impresso no rótulo e o vigente (Anexo VIII da IN 75):

- Vitamina A (1.300 µg RAE): impresso 217 → vigente 163%
- Vitamina K (149 µg): impresso ** (VD não estabelecido) → vigente 124%
- Riboflavina (1,3 mg): impresso 100 → vigente 108%
- Niacina (16 mg NE): impresso 100 → vigente 107%
- Ácido fólico (1.333 µg DFE): impresso 200 → vigente 333%
- Vitamina B12 (9,9 µg): impresso 414 → vigente 413%

Observações:

- Composição-fonte: rótulo multivitaminico.pdf (20 itens). Auditoria de 15/09/2026: NÃO CONFORME. A fórmula impressa, com os sais que entregam os elementos, passa de 1.400 mg — não cabe em 1 g (ponto para a fábrica).

---

## DORES MUSCULARES (Nuviart) (`dores-musculares`)

- **Fonte da composição:** rótulo Nuviart.pdf (JSON de extração de 13/09/2026)
- **Porção:** 1 g (2 cápsulas)
- **Porções por embalagem:** 30
- **Grupo populacional (%VD):** adultos (≥ 19 anos)
- **Veredito da auditoria de 15/09/2026 (composição atual):** NÃO CONFORME (auditoria 4.14: colágeno hidrolisado, cálcio e magnésio abaixo do mínimo; selênio em forma não autorizada)

**INFORMAÇÃO NUTRICIONAL**

Porções por embalagem: 30  
Porção: 1 g (2 cápsulas)

| | 1 g | %VD* |
|---|---|---|
| Valor energético ⚠ | 4 kcal = 17 kJ | 0% |
| Carboidratos ⚠ | 0,3 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Açúcares totais | 0 g |  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Açúcares adicionados | 0 g | 0% |
| Proteínas ⚠ | 0,4 g | 0% |
| Gorduras totais | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras saturadas | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras trans | 0 g | 0% |
| Fibras alimentares | 0 g | 0% |
| Sódio | 0 mg | 0% |
| Vitamina D | 50 µg | 333% |
| Vitamina E ⚠ | 20 mg | 133% |
| Vitamina C | 140 mg | 140% |
| Vitamina B6 | 1,3 mg | 100% |
| Vitamina B12 | 9,9 µg | 413% |
| Cálcio ⚠ | PENDENTE |  |
| Ferro ⚠ | 8 mg | 57% |
| Magnésio ⚠ | PENDENTE |  |
| Selênio ⚠ | 100 µg | 167% |
| Zinco ⚠ | 10 mg | 91% |
| Metilsulfonilmetano | 250 mg |  |
| Sulfato de glucosamina | 200 mg |  |
| Colágeno tipo II não desnaturado | 40 mg |  |

*Percentual de valores diários fornecidos pela porção

Bloco de texto puro (vai para `formulas.nutritional_info`):

```
INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 1 g (2 cápsulas)
 | 1 g | %VD*
Valor energético | 4 kcal = 17 kJ | 0%
Carboidratos | 0,3 g | 0%
  Açúcares totais | 0 g | 
    Açúcares adicionados | 0 g | 0%
Proteínas | 0,4 g | 0%
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | 0 g | 0%
Sódio | 0 mg | 0%
Vitamina D | 50 µg | 333%
Vitamina E | 20 mg | 133%
Vitamina C | 140 mg | 140%
Vitamina B6 | 1,3 mg | 100%
Vitamina B12 | 9,9 µg | 413%
Cálcio | PENDENTE | 
Ferro | 8 mg | 57%
Magnésio | PENDENTE | 
Selênio | 100 µg | 167%
Zinco | 10 mg | 91%
Metilsulfonilmetano | 250 mg | 
Sulfato de glucosamina | 200 mg | 
Colágeno tipo II não desnaturado | 40 mg | 
*Percentual de valores diários fornecidos pela porção
```

**Linhas PENDENTES / PROVISÓRIAS (⚠) e o motivo:**

- Valor energético — PROVISÓRIA: valor impresso (4 kcal); conta pelos insumos (critério único): colágeno hidrolisado 0,1 g × 4 + colágeno tipo II 0,04 g × 0,676 × 4 = 0,5 kcal; cápsula sem quantidade — não significativo nas duas leituras
- Carboidratos — PROVISÓRIA: valor impresso (0,3 g); conta pelos insumos: 0 g
- Proteínas — PROVISÓRIA: valor impresso 0,4 g (colágeno hidrolisado 100 mg + colágeno tipo II 40 mg + gelatina da cápsula); o colágeno hidrolisado é fonte de Proteínas do Anexo I e está ABAIXO DO MÍNIMO de 8,4 g (auditoria 4.14); %VD vigente 0 (≤ 0,5 g) contra 1 % impresso
- Vitamina E — PROVISÓRIA: DL-alfa-tocoferol 20 mg — a fonte declara a massa do insumo; a IN 75 (Anexo XXIII) expressa vitamina E em mg de alfa-tocoferol (1 mg de alfa-tocoferol = 2 mg de alfa-tocoferol sintético) e a IN 28 (nota iii do Anexo IV) usa 0,67 para o rac-α-tocoferil — em equivalentes a linha e o %VD mudam; decisão do RT
- Cálcio — PENDENTE: rótulo declara 'carbonato de cálcio 100 mg' (sal) e não declara o cálcio elementar em lugar nenhum; estequiometria (Ca/CaCO3 = 40,04 %) dá no máximo 40 mg — ABAIXO DO MÍNIMO de 180 mg em qualquer leitura (auditoria 4.14)
- Ferro — PROVISÓRIA: PROVISÓRIO — incoerência do próprio rótulo: a composição declara 'bisglicinato de ferro 8 mg' (sal → 2,19 mg de ferro, ABAIXO DO MÍNIMO de 2,7 mg) e a tabela nutricional declara 'Ferro 8 mg (57 %)' como elemento; mantida a tabela impressa (auditoria 4.14: só a ficha técnica resolve)
- Magnésio — PENDENTE: rótulo declara 'bisglicinato de magnésio 100 mg' (sal) e não declara o magnésio elementar; 14,1 mg (estequiométrico) a 30,4 mg (laudo INLAB 30,38 %) — ABAIXO DO MÍNIMO de 63 mg nas duas leituras (auditoria 4.14)
- Selênio — PROVISÓRIA: FORMA NÃO AUTORIZADA: 'selênio quelado' não consta das fontes do Anexo I (auditoria 4.14)
- Zinco — PROVISÓRIA: PROVISÓRIO — incoerência do rótulo: composição 'bisglicinato de zinco 10 mg' (sal → 2,0 a 3,1 mg de zinco) × tabela 'Zinco 10 mg (91 %)' (elemento); mantida a tabela impressa; conforme nas duas leituras

Notas de linha:

- Açúcares totais: ≤ carboidratos impressos (0,3 g)
- Açúcares adicionados: sem açúcar na lista de ingredientes
- Fibras alimentares: sem fonte de fibra na composição
- Vitamina D: igual ao máximo (50 µg); o rótulo imprime 1000 % (VD antigo de 5 µg)
- Vitamina B12: igual ao máximo (9,94 µg); valor antes do arredondamento: 9,94 µg → declarado 9,9 µg (Anexo III da IN 75; %VD sobre o valor declarado)
- Sulfato de glucosamina: massa do sal, como impresso; a norma limita a glucosamina (base); a forma (sulfato com cloreto de potássio, IN 418/2025) não está completa no rótulo — NÃO VERIFICADO

Diferenças entre o %VD impresso no rótulo e o vigente (Anexo VIII da IN 75):

- Proteínas (0,4 g): impresso 1 → vigente 0%
- Vitamina D (50 µg): impresso 1000 → vigente 333%
- Vitamina B12 (9,9 µg): impresso 414 → vigente 413%

Observações:

- Composição-fonte: rótulo Nuviart.pdf (14 itens). Auditoria de 15/09/2026: NÃO CONFORME. O cadastro do banco (MSM 480,5 mg, sem colágeno hidrolisado, sem carbonato de cálcio, magnésio 100 mg como elemento) não é o rótulo.
- Colágeno hidrolisado 100 mg não recebe linha própria: é fonte de Proteínas (Anexo I) e entra na linha Proteínas (ver ⚠).

---

## Pro Energy (`pro-energy`)

- **Fonte da composição:** rótulo ProEnergy.pdf (JSON de extração de 13/09/2026)
- **Porção:** 1 g (2 cápsulas)
- **Porções por embalagem:** 30
- **Grupo populacional (%VD):** adultos (≥ 19 anos)
- **Veredito da auditoria de 15/09/2026 (composição atual):** NÃO VERIFICÁVEL (auditoria 4.12: cafeína total e saponinas dependem de laudo)

**INFORMAÇÃO NUTRICIONAL**

Porções por embalagem: 30  
Porção: 1 g (2 cápsulas)

| | 1 g | %VD* |
|---|---|---|
| Valor energético ⚠ | 4 kcal = 17 kJ | 0% |
| Carboidratos ⚠ | 0,3 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Açúcares totais | 0 g |  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Açúcares adicionados | 0 g | 0% |
| Proteínas ⚠ | 0,3 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;L-aspartato de L-arginina ⚠ | 75 mg |  |
| Gorduras totais | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras saturadas | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras trans | 0 g | 0% |
| Fibras alimentares | 0 g | 0% |
| Sódio | 0 mg | 0% |
| Vitamina B6 | 10 mg | 769% |
| Zinco | 4 mg | 36% |
| Taurina ⚠ | 200 mg |  |
| L-carnitina ⚠ | 90 mg |  |
| Cafeína ⚠ | PENDENTE |  |
| Saponinas de glicosídeos de furostanol ⚠ | PENDENTE |  |

*Percentual de valores diários fornecidos pela porção

Bloco de texto puro (vai para `formulas.nutritional_info`):

```
INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 1 g (2 cápsulas)
 | 1 g | %VD*
Valor energético | 4 kcal = 17 kJ | 0%
Carboidratos | 0,3 g | 0%
  Açúcares totais | 0 g | 
    Açúcares adicionados | 0 g | 0%
Proteínas | 0,3 g | 0%
  L-aspartato de L-arginina | 75 mg | 
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | 0 g | 0%
Sódio | 0 mg | 0%
Vitamina B6 | 10 mg | 769%
Zinco | 4 mg | 36%
Taurina | 200 mg | 
L-carnitina | 90 mg | 
Cafeína | PENDENTE | 
Saponinas de glicosídeos de furostanol | PENDENTE | 
*Percentual de valores diários fornecidos pela porção
```

**Linhas PENDENTES / PROVISÓRIAS (⚠) e o motivo:**

- Valor energético — PROVISÓRIA: valor impresso (4 kcal); conta pelos insumos (critério único): 0 kcal — taurina, cafeína, L-carnitina e aspartato de arginina sem fator; guaraná em pó 200 mg e extrato de feno-grego 250 mg sem laudo de composição — não significativo nas duas leituras
- Carboidratos — PROVISÓRIA: valor impresso (0,3 g); guaraná em pó e extrato de feno-grego sem laudo de carboidratos — não reproduzível
- Proteínas — PROVISÓRIA: valor impresso 0,3 g (gelatina da cápsula); taurina 200 mg, L-carnitina 90 mg e L-aspartato de L-arginina 75 mg não somados (critério pendente do RT); %VD vigente 0 (≤ 0,5 g) contra 1 % impresso
- L-aspartato de L-arginina — PROVISÓRIA: 75 mg do sal (L-arginina e ácido aspártico, cada um abaixo de 75 mg), como impresso; declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)
- Taurina — PROVISÓRIA: declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)
- L-carnitina — PROVISÓRIA: declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)
- Cafeína — PENDENTE: cafeína total desconhecida: cafeína anidra 150 mg (impresso) + cafeína do guaraná em pó 200 mg (teor sem laudo); o total ultrapassa o máximo de 200 mg se o guaraná tiver mais de 25 % de cafeína (auditoria 4.12) — só o laudo do lote de guaraná fixa a linha
- Saponinas de glicosídeos de furostanol — PENDENTE: extrato seco de feno-grego 250 mg sem laudo de saponinas (máximo 450 mg)

Notas de linha:

- Açúcares totais: ≤ carboidratos impressos (0,3 g)
- Açúcares adicionados: sem açúcar na lista de ingredientes
- Fibras alimentares: guaraná em pó 200 mg + extrato de feno-grego 250 mg = 450 mg < 0,5 g → não significativo mesmo se fossem 100 % fibra
- Zinco: rótulo: bisglicinato de zinco 20 mg (sal); a tabela declara Zinco 4 mg (elemento)

Diferenças entre o %VD impresso no rótulo e o vigente (Anexo VIII da IN 75):

- Proteínas (0,3 g): impresso 1 → vigente 0%

Observações:

- Composição-fonte: rótulo ProEnergy.pdf (9 itens). Auditoria de 15/09/2026: NÃO VERIFICÁVEL. Cadastro do banco difere em taurina (215 mg), cafeína (140 mg, 'cafeína') e cloridrato de L-arginina 75 mg.

---

## Serena (`serena`)

- **Fonte da composição:** rótulo Serena.pdf (JSON de extração de 13/09/2026)
- **Porção:** 1 mL (20 gotas)
- **Porções por embalagem:** 30
- **Grupo populacional (%VD):** adultos (≥ 19 anos)
- **Veredito da auditoria de 15/09/2026 (composição atual):** NÃO VERIFICÁVEL (auditoria 4.5: origem da L-teanina)

**INFORMAÇÃO NUTRICIONAL**

Porções por embalagem: 30  
Porção: 1 mL (20 gotas)

| | 1 mL | %VD* |
|---|---|---|
| Valor energético ⚠ | 1 kcal = 4 kJ | 0% |
| Carboidratos ⚠ | 0,3 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Açúcares totais | 0 g |  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Açúcares adicionados | 0 g | 0% |
| Proteínas | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;L-teanina ⚠ | 50 mg |  |
| Gorduras totais | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras saturadas | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras trans | 0 g | 0% |
| Fibras alimentares | 0 g | 0% |
| Sódio | 0 mg | 0% |
| Vitamina B6 | 1,3 mg | 100% |
| Magnésio | 63 mg | 15% |
| Melatonina | 0,21 mg |  |
| Inositol | 50 mg |  |

*Percentual de valores diários fornecidos pela porção

Bloco de texto puro (vai para `formulas.nutritional_info`):

```
INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 1 mL (20 gotas)
 | 1 mL | %VD*
Valor energético | 1 kcal = 4 kJ | 0%
Carboidratos | 0,3 g | 0%
  Açúcares totais | 0 g | 
    Açúcares adicionados | 0 g | 0%
Proteínas | 0 g | 0%
  L-teanina | 50 mg | 
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | 0 g | 0%
Sódio | 0 mg | 0%
Vitamina B6 | 1,3 mg | 100%
Magnésio | 63 mg | 15%
Melatonina | 0,21 mg | 
Inositol | 50 mg | 
*Percentual de valores diários fornecidos pela porção
```

**Linhas PENDENTES / PROVISÓRIAS (⚠) e o motivo:**

- Valor energético — PROVISÓRIA: valor impresso (1 kcal); conta pelos insumos (critério único): 0 kcal — L-teanina, inositol e sais sem fator; veículo (glicerina vegetal, água) sem quantidade no rótulo e sem fator no Anexo XXII — não significativo nas duas leituras
- Carboidratos — PROVISÓRIA: valor impresso (0,3 g); nenhuma fonte de carboidrato quantificada (glicerina não é carboidrato) — não reproduzível
- L-teanina — PROVISÓRIA: declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina); igual ao mínimo (50 mg); origem (Camellia sinensis) não declarada — NÃO VERIFICADO

Notas de linha:

- Açúcares totais: ≤ carboidratos impressos (0,3 g)
- Açúcares adicionados: sem açúcar na lista de ingredientes (glicerina, água, sais, aroma, conservantes)
- Proteínas: 0 g impresso; L-teanina 50 mg não conta pelo critério único (não é aminoácido das proteínas) — coincide
- Fibras alimentares: sem fonte de fibra na composição
- Sódio: 0 mg impresso; a lista de ingredientes traz citrato de sódio e benzoato de sódio sem quantidade — valor impresso mantido
- Magnésio: valor do elemento ('de cloreto de magnésio'); igual ao mínimo (63 mg)
- Melatonina: igual ao máximo (0,21 mg)

Observações:

- Composição-fonte: rótulo Serena.pdf (5 insumos), idêntica ao cadastro. Auditoria de 15/09/2026: NÃO VERIFICÁVEL.

---

## ZMA (Zinco, Magnésio e Vitamina B6) (`zma-zinco-magnesio-e-vitamina-d`)

- **Fonte da composição:** rótulo ZmaComplex.pdf (JSON de extração de 13/09/2026)
- **Porção:** 1 g (2 cápsulas)
- **Porções por embalagem:** 30
- **Grupo populacional (%VD):** adultos (≥ 19 anos)
- **Veredito da auditoria de 15/09/2026 (composição atual):** NÃO CONFORME (auditoria 4.13: boro em forma não autorizada)

**INFORMAÇÃO NUTRICIONAL**

Porções por embalagem: 30  
Porção: 1 g (2 cápsulas)

| | 1 g | %VD* |
|---|---|---|
| Valor energético ⚠ | 4 kcal = 17 kJ | 0% |
| Carboidratos ⚠ | 0,3 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Açúcares totais | 0 g |  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Açúcares adicionados | 0 g | 0% |
| Proteínas ⚠ | 0,3 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;L-teanina ⚠ | 150 mg |  |
| Gorduras totais | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras saturadas | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras trans | 0 g | 0% |
| Fibras alimentares | 0 g | 0% |
| Sódio | 0 mg | 0% |
| Vitamina D | 25 µg | 167% |
| Vitamina B6 | 1,3 mg | 100% |
| Magnésio | 152 mg | 36% |
| Zinco | 15 mg | 136% |
| Boro ⚠ | 3,1 mg |  |

*Percentual de valores diários fornecidos pela porção

Bloco de texto puro (vai para `formulas.nutritional_info`):

```
INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 1 g (2 cápsulas)
 | 1 g | %VD*
Valor energético | 4 kcal = 17 kJ | 0%
Carboidratos | 0,3 g | 0%
  Açúcares totais | 0 g | 
    Açúcares adicionados | 0 g | 0%
Proteínas | 0,3 g | 0%
  L-teanina | 150 mg | 
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | 0 g | 0%
Sódio | 0 mg | 0%
Vitamina D | 25 µg | 167%
Vitamina B6 | 1,3 mg | 100%
Magnésio | 152 mg | 36%
Zinco | 15 mg | 136%
Boro | 3,1 mg | 
*Percentual de valores diários fornecidos pela porção
```

**Linhas PENDENTES / PROVISÓRIAS (⚠) e o motivo:**

- Valor energético — PROVISÓRIA: valor impresso (4 kcal); conta pelos insumos (critério único): 0 kcal — L-teanina e sais sem fator; cápsula sem quantidade — não significativo nas duas leituras
- Carboidratos — PROVISÓRIA: valor impresso (0,3 g); conta pelos insumos: 0 g
- Proteínas — PROVISÓRIA: valor impresso 0,3 g (gelatina da cápsula); L-teanina 150 mg não somada (critério pendente do RT); %VD vigente 0 (≤ 0,5 g) contra 1 % impresso
- L-teanina — PROVISÓRIA: declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina); origem (Camellia sinensis) não declarada — NÃO VERIFICADO
- Boro — PROVISÓRIA: PROVISÓRIO e FORMA NÃO AUTORIZADA: rótulo declara 'quelato de boro (glicinato de boro) 56,6 mg' (sal) e não declara o boro elementar; 56,6 × 5,43 % (laudo Analitic/INLAB lote 91125, citado na migration 20260915140000, não relido) = 3,07 mg; 'quelato de boro' não consta do Anexo I (auditoria 4.13)

Notas de linha:

- Açúcares totais: ≤ carboidratos impressos (0,3 g)
- Açúcares adicionados: sem açúcar na lista de ingredientes
- Fibras alimentares: sem fonte de fibra na composição
- Magnésio: rótulo: magnésio glicinato 500 mg (sal); a tabela declara Magnésio 152 mg (elemento)
- Zinco: rótulo: bisglicinato de zinco 75 mg (sal); a tabela declara Zinco 15 mg (elemento)
- Boro: valor antes do arredondamento: 3,07 mg → declarado 3,1 mg (Anexo III da IN 75; %VD sobre o valor declarado)

Diferenças entre o %VD impresso no rótulo e o vigente (Anexo VIII da IN 75):

- Proteínas (0,3 g): impresso 1 → vigente 0%

Observações:

- Composição-fonte: rótulo ZmaComplex.pdf (7 itens). Auditoria de 15/09/2026: NÃO CONFORME. Dióxido de silício 217,1 mg (21,7 % da cápsula) é aditivo e não entra na tabela.

---

## CREATINA GUMMY SABOR FRUTAS VERMELHAS (`creatina-gummy-sabor-frutas-vermelhas`)

- **Fonte da composição:** rótulo creatina gummy.pdf (JSON de extração de 13/09/2026)
- **Porção:** 6 g (2 gomas)
- **Porções por embalagem:** 30
- **Grupo populacional (%VD):** adultos (≥ 19 anos)
- **Veredito da auditoria de 15/09/2026 (composição atual):** 100% CONFORME (auditoria 4.3)

**INFORMAÇÃO NUTRICIONAL**

Porções por embalagem: 30  
Porção: 6 g (2 gomas)

| | 6 g | %VD* |
|---|---|---|
| Valor energético | 9 kcal = 38 kJ | 0% |
| Carboidratos | 3 g | 1% |
| &nbsp;&nbsp;&nbsp;&nbsp;Açúcares totais ⚠ | PENDENTE |  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Açúcares adicionados | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Poliois totais | 2,7 g |  |
| Proteínas | 0,4 g | 0% |
| Gorduras totais | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras saturadas | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras trans | 0 g | 0% |
| Fibras alimentares ⚠ | PENDENTE |  |
| Sódio | 10 mg | 1% |
| Creatina ⚠ | 3.000 mg |  |

*Percentual de valores diários fornecidos pela porção

Bloco de texto puro (vai para `formulas.nutritional_info`):

```
INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 6 g (2 gomas)
 | 6 g | %VD*
Valor energético | 9 kcal = 38 kJ | 0%
Carboidratos | 3 g | 1%
  Açúcares totais | PENDENTE | 
    Açúcares adicionados | 0 g | 0%
  Poliois totais | 2,7 g | 
Proteínas | 0,4 g | 0%
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | PENDENTE | 
Sódio | 10 mg | 1%
Creatina | 3.000 mg | 
*Percentual de valores diários fornecidos pela porção
```

**Linhas PENDENTES / PROVISÓRIAS (⚠) e o motivo:**

- Açúcares totais — PENDENTE: rótulo não imprime a linha; carboidratos 3 g − poliois 2,7 g = 0,3 g de outros carboidratos sem perfil (≤ 0,5 g, mas a base não está quantificada)
- Fibras alimentares — PENDENTE: base da goma (pectina, goma) sem quantidade; o rótulo não imprime a linha
- Creatina — PROVISÓRIA: creatina monoidratada 3.000 mg (massa nominal, como impresso); igual ao mínimo de 3.000 mg; declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)

Notas de linha:

- Valor energético: base da goma não quantificada no rótulo; valor impresso mantido (creatina sem fator)
- Carboidratos: rótulo imprime '3,0 g'; Anexo III: primeira casa decimal 0 → declarar em número inteiro (3 g)
- Açúcares adicionados: sem açúcar na lista de ingredientes (conferido no JSON de extração)
- Proteínas: gelatina da base; creatina não conta (critério único); %VD vigente 0 (≤ 0,5 g) contra 1 % impresso
- Sódio: 10 mg > 5 mg → significativo; 10 / 2.000 = 0,5 % → 1 % (arredondamento para inteiro); o rótulo imprime 0 %

Diferenças entre o %VD impresso no rótulo e o vigente (Anexo VIII da IN 75):

- Proteínas (0,4 g): impresso 1 → vigente 0%
- Sódio (10 mg): impresso 0 → vigente 1%

Observações:

- Composição-fonte: rótulo creatina gummy.pdf (1 insumo), idêntica ao cadastro. Auditoria de 15/09/2026: 100 % CONFORME. O `nutritional_info` do banco diz 'Porção: 3 g (2 gomas)'; o rótulo diz 6 g (2 gomas) — a tabela segue o rótulo.

---

## Pré-treino + Creatina Sabor Limão (420 g) — Césio 137 (`pre-treino-creatina-sabor-limao-420g`)

- **Fonte da composição:** rótulo PRÉ TREINO_CÉSIO 137_420g.pdf (texto extraído e conferido visualmente em 16/09/2026)
- **Porção:** 14 g (1 dose)
- **Porções por embalagem:** 30
- **Grupo populacional (%VD):** adultos (≥ 19 anos)
- **Veredito da auditoria de 15/09/2026 (composição atual):** NÃO CONFORME (auditoria 4.15 / parecer de 15/09/2026: cafeína total acima do máximo; extrato de guaraná em forma não autorizada; soma 107 % da porção)

**INFORMAÇÃO NUTRICIONAL**

Porções por embalagem: 30  
Porção: 14 g (1 dose)

| | 14 g | %VD* |
|---|---|---|
| Valor energético ⚠ | 45 kcal = 189 kJ | 2% |
| Carboidratos ⚠ | 3 g | 1% |
| &nbsp;&nbsp;&nbsp;&nbsp;Açúcares totais ⚠ | PENDENTE |  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Açúcares adicionados | 0 g | 0% |
| Proteínas ⚠ | 8 g | 16% |
| &nbsp;&nbsp;&nbsp;&nbsp;L-tirosina ⚠ | 1.000 mg |  |
| &nbsp;&nbsp;&nbsp;&nbsp;L-arginina ⚠ | 3.810 mg |  |
| &nbsp;&nbsp;&nbsp;&nbsp;Beta-alanina ⚠ | 2.000 mg |  |
| Gorduras totais | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras saturadas | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras trans | 0 g | 0% |
| Fibras alimentares | 0 g | 0% |
| Sódio | 0 mg | 0% |
| Vitamina D | 50 µg | 333% |
| Niacina | 35 mg NE | 233% |
| Vitamina B6 | 90 mg | 6923% |
| Vitamina B12 | 9,9 µg | 413% |
| Magnésio | 350 mg | 83% |
| Taurina ⚠ | 1.000 mg |  |
| Creatina ⚠ | 5.000 mg |  |
| L-carnitina ⚠ | 1.000 mg |  |
| Cafeína ⚠ | 200 mg |  |
| Extrato de guaraná (Paullinia cupana) ⚠ | 515 mg |  |

*Percentual de valores diários fornecidos pela porção

Bloco de texto puro (vai para `formulas.nutritional_info`):

```
INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 14 g (1 dose)
 | 14 g | %VD*
Valor energético | 45 kcal = 189 kJ | 2%
Carboidratos | 3 g | 1%
  Açúcares totais | PENDENTE | 
    Açúcares adicionados | 0 g | 0%
Proteínas | 8 g | 16%
  L-tirosina | 1.000 mg | 
  L-arginina | 3.810 mg | 
  Beta-alanina | 2.000 mg | 
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | 0 g | 0%
Sódio | 0 mg | 0%
Vitamina D | 50 µg | 333%
Niacina | 35 mg NE | 233%
Vitamina B6 | 90 mg | 6923%
Vitamina B12 | 9,9 µg | 413%
Magnésio | 350 mg | 83%
Taurina | 1.000 mg | 
Creatina | 5.000 mg | 
L-carnitina | 1.000 mg | 
Cafeína | 200 mg | 
Extrato de guaraná (Paullinia cupana) | 515 mg | 
*Percentual de valores diários fornecidos pela porção
```

**Linhas PENDENTES / PROVISÓRIAS (⚠) e o motivo:**

- Valor energético — PROVISÓRIA: valor impresso (45 kcal); conta pelos insumos (critério único): 0 kcal — creatina, aminoácidos, taurina, L-carnitina e cafeína sem fator no Anexo XXII e nenhuma fonte de carboidrato/proteína/gordura na composição; o impresso corresponde a 8 g de 'proteínas' × 4 + 3 g de carboidratos × 4 (o rótulo soma os aminoácidos como proteína); kJ impresso 189 (45 × 4,184 = 188)
- Carboidratos — PROVISÓRIA: valor impresso (3 g); conta pelos insumos: 0 g — nenhuma fonte de carboidrato na composição impressa (ácido cítrico é ácido orgânico; extrato de guaraná sem laudo)
- Açúcares totais — PENDENTE: carboidratos impressos 3 g sem origem identificada na composição; o rótulo não imprime a linha
- Proteínas — PROVISÓRIA: valor impresso (8 g = 16 %); pelo critério único (pendente do RT) os aminoácidos livres não contam como proteína → 0 g; o rótulo soma beta-alanina 2 g + L-arginina 3,81 g + L-tirosina 1 g + L-carnitina 1 g (= 7,81 → 8 g)
- L-tirosina — PROVISÓRIA: declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)
- L-arginina — PROVISÓRIA: igual ao máximo exato (3.810 mg); declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)
- Beta-alanina — PROVISÓRIA: 2 g em dose única; igual ao máximo diário de 2 g (IN 102/2021); a advertência VI·18 exige doses de no máximo 300 mg com 2 h de intervalo (parecer NC2); declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)
- Taurina — PROVISÓRIA: declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)
- Creatina — PROVISÓRIA: creatina monoidratada 5.000 mg (massa nominal, como impresso); igual ao máximo (IN 373/2025); declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)
- L-carnitina — PROVISÓRIA: declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)
- Cafeína — PROVISÓRIA: ACIMA DO MÁXIMO: 200 mg de cafeína anidra (impresso, já igual ao máximo de 200 mg) + a cafeína do extrato de guaraná 515 mg (sem laudo) → cafeína total > 200 mg em qualquer cenário (parecer NC1 / auditoria 4.15); a linha declara só a cafeína anidra impressa
- Extrato de guaraná (Paullinia cupana) — PROVISÓRIA: FORMA NÃO AUTORIZADA: 'extrato de guaraná' (seco) não é nenhuma das formas do Anexo I — 'guaraná em pó (Paullinia cupana)' e 'extrato fluido de guaraná' (IN 450/2026) — parecer NC5; linha mantida como impressa no rótulo

Notas de linha:

- Açúcares adicionados: frase impressa: 'não contém quantidades significativas de açúcares adicionados…'
- Gorduras saturadas: frase impressa de quantidade não significativa
- Gorduras trans: frase impressa
- Fibras alimentares: frase impressa: 'não contém quantidades significativas de … fibras alimentares'
- Vitamina D: colecalciferol; igual ao máximo (50 µg)
- Niacina: niacinamida 35 mg = 35 mg NE; igual ao máximo
- Vitamina B6: cloridrato de piridoxina 90 mg (91,3 % do máximo de 98,60 mg); 90 / 1,3 = 6.923 %
- Vitamina B12: metilcobalamina; igual ao máximo; valor antes do arredondamento: 9,94 µg → declarado 9,9 µg (Anexo III da IN 75; %VD sobre o valor declarado)
- Magnésio: valor do elemento ('de bisglicinato de magnésio'); igual ao máximo (350 mg)

Diferenças entre o %VD impresso no rótulo e o vigente (Anexo VIII da IN 75):

- Niacina (35 mg NE): impresso 219 → vigente 233%
- Vitamina B12 (9,9 µg): impresso 414 → vigente 413%

Observações:

- Composição-fonte: rótulo da gráfica PRÉ TREINO_CÉSIO 137_420g.pdf (13 itens), idêntica ao cadastro do banco. Auditoria/parecer de 15/09/2026: NÃO CONFORME (sete não conformidades). A soma dos 13 itens é 15.000,06 mg numa porção de 14 g (107,1 %).
- O rótulo usa a nota de rodapé da RDC 360/2003 ('*% Valores diários de referência com base em uma dieta de 2.000 kcal ou 8.400 kJ' e '** Valor diário não estabelecido'), revogada; esta tabela usa o rodapé da RDC 429/2020 e deixa a célula vazia onde não há VDR.
- A ficha técnica de produção da fábrica (FRM-PRETREINO-14G-001, Rev.02 de 20/08/2026) traz L-arginina 1.000 mg, cafeína 150 mg e extrato de guaraná 224,5 mg — diverge do rótulo; qual está em produção é PENDENTE da fábrica (parecer).

---

## Multi Vitta — Gestante e Lactante em Cápsula (`multi-vitta-gestante-e-lactante-em-capsula`)

- **Fonte da composição:** cadastro ativo do banco vivo (public.formula_compositions, lido pela chave pública em 16/09/2026)
- **Porção:** 1 g (2 cápsulas)
- **Porções por embalagem:** 30
- **Grupo populacional (%VD):** gestantes e lactantes (duas colunas)
- **Veredito da auditoria de 15/09/2026 (composição atual):** NÃO CONFORME e COMPOSIÇÃO IMPOSSÍVEL NA PORÇÃO (auditoria II.5)

**INFORMAÇÃO NUTRICIONAL**

Porções por embalagem: 30  
Porção: 1 g (2 cápsulas)

| | 1 g | %VD* gestantes | %VD* lactantes |
|---|---|---|---|
| Valor energético | 0 kcal = 0 kJ | 0% | 0% |
| Carboidratos | 0 g | 0% | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Açúcares totais | 0 g |  |  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Açúcares adicionados | 0 g | 0% | 0% |
| Proteínas | 0 g | 0% | 0% |
| Gorduras totais | 0 g | 0% | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras saturadas | 0 g | 0% | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras trans | 0 g | 0% | 0% |
| Fibras alimentares | 0 g | 0% | 0% |
| Sódio ⚠ | 0 mg | 0% | 0% |
| Vitamina D | 50 µg | 333% | 333% |
| Vitamina E ⚠ | 5 mg | 33% | 33% |
| Vitamina C | 20 mg | 24% | 17% |
| Niacina | 8 mg NE | 44% | 47% |
| Ácido pantotênico | 5 mg | 83% | 71% |
| Ácido fólico ⚠ | 1.333 µg DFE | 222% | 267% |
| Vitamina B12 ⚠ | 10 µg | 385% | 357% |
| Cálcio | 300 mg | 23% | 23% |
| Cobre | 900 µg | 90% | 69% |
| Ferro ⚠ | 8,1 mg | 30% | 81% |
| Magnésio ⚠ | 60 mg | 15% | 17% |

*Percentual de valores diários fornecidos pela porção

Bloco de texto puro (vai para `formulas.nutritional_info`):

```
INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 1 g (2 cápsulas)
 | 1 g | %VD* gestantes | %VD* lactantes
Valor energético | 0 kcal = 0 kJ | 0% | 0%
Carboidratos | 0 g | 0% | 0%
  Açúcares totais | 0 g |  | 
    Açúcares adicionados | 0 g | 0% | 0%
Proteínas | 0 g | 0% | 0%
Gorduras totais | 0 g | 0% | 0%
  Gorduras saturadas | 0 g | 0% | 0%
  Gorduras trans | 0 g | 0% | 0%
Fibras alimentares | 0 g | 0% | 0%
Sódio | 0 mg | 0% | 0%
Vitamina D | 50 µg | 333% | 333%
Vitamina E | 5 mg | 33% | 33%
Vitamina C | 20 mg | 24% | 17%
Niacina | 8 mg NE | 44% | 47%
Ácido pantotênico | 5 mg | 83% | 71%
Ácido fólico | 1.333 µg DFE | 222% | 267%
Vitamina B12 | 10 µg | 385% | 357%
Cálcio | 300 mg | 23% | 23%
Cobre | 900 µg | 90% | 69%
Ferro | 8,1 mg | 30% | 81%
Magnésio | 60 mg | 15% | 17%
*Percentual de valores diários fornecidos pela porção
```

**Linhas PENDENTES / PROVISÓRIAS (⚠) e o motivo:**

- Sódio — PROVISÓRIA: PROVISÓRIO — nenhuma fonte de sódio na composição cadastrada; a cápsula e os excipientes não estão no cadastro
- Vitamina E — PROVISÓRIA: acetato de DL-alfa-tocoferol 5 mg (cadastro) — a fonte declara a massa do insumo; a IN 75 (Anexo XXIII) expressa vitamina E em mg de alfa-tocoferol (1 mg de alfa-tocoferol = 2 mg de alfa-tocoferol sintético) e a IN 28 (nota iii do Anexo IV) usa 0,67 para o rac-α-tocoferil — em equivalentes a linha e o %VD mudam; decisão do RT; pela IN 28 (0,67) 3,35 mg, acima do mínimo de lactantes (2,85 mg) por 0,5 mg
- Ácido fólico — PROVISÓRIA: ACIMA DO MÁXIMO nos dois grupos na leitura literal: cadastro 'ácido fólico 800 mcg' → 800 / 0,6 = 1.333 µg DFE contra máximos de 1.138,3 (gestantes) e 1.162,3 µg DFE (lactantes) — auditoria II.5; se o cadastro já estivesse em DFE (800 µg DFE = 133 % / 160 %) seria conforme
- Vitamina B12 — PROVISÓRIA: ACIMA DO MÁXIMO de lactantes: 10,46 µg contra 10,07 µg (gestantes: igual ao máximo de 10,46) — auditoria II.5
- Ferro — PROVISÓRIA: PROVISÓRIO — convenção do cadastro assumida (8,1 mg de ferro elementar de bisglicinato ferroso); se fosse massa do sal (27,38 %), 2,22 mg — ABAIXO DO MÍNIMO de gestantes (4,05 mg) — auditoria II.5
- Magnésio — PROVISÓRIA: PROVISÓRIO — convenção do cadastro assumida (60 mg de magnésio elementar = mínimo exato de gestantes); se fosse massa do sal (30,38 %), 18,2 mg — ABAIXO DO MÍNIMO — auditoria II.5

Notas de linha:

- Valor energético: nenhum insumo com fator no Anexo XXII na composição cadastrada
- Vitamina D: igual ao máximo (50 µg) nos dois grupos
- Niacina: nicotinamida 8 mg = 8 mg NE; VDR do Anexo VIII: 18 mg NE (gestantes) e 17 mg NE (lactantes), lidos em 16/09/2026 (resolve a pendência 4 do gabarito)
- Ácido fólico: valor antes do arredondamento: 1.333,33 µg DFE → declarado 1.333 µg DFE (Anexo III da IN 75; %VD sobre o valor declarado)
- Vitamina B12: valor antes do arredondamento: 10,46 µg → declarado 10 µg (Anexo III da IN 75; %VD sobre o valor declarado)
- Cálcio: cadastro: 'cálcio elementar (carbonato de cálcio) 300 mg'
- Cobre: bisglicinato de cobre; valor lido como elemento (convenção do cadastro)

Observações:

- Composição-fonte: cadastro ativo (12 linhas). Dióxido de silício 592,14 mg (59,2 % da cápsula) é aditivo e não entra na tabela. Auditoria II.5 (15/09/2026): NÃO CONFORME e COMPOSIÇÃO IMPOSSÍVEL NA PORÇÃO (144,9 % a 161,0 % com os sais dos elementos).
- A lista de ingredientes cadastrada declara vitamina A, vitamina K2, 'complexo B', biotina, cromo e selênio sem quantidade na composição — cadastro incompleto; a tabela declara só o que tem quantidade cadastrada.
- Grupos populacionais: gestantes e lactantes (nome do produto e advertências); `target_audience` do banco diz 'Adultos com 19 anos ou mais' — erro de cadastro. %VD pelas colunas Gestantes e Lactantes do Anexo VIII da IN 75 (inclusive energia e macronutrientes, que o Anexo VIII traz por grupo: lido em 16/09/2026).

---

## Melatonina + Triptofanos (Encapsulados) (`melatonina-triptofanos-encapsulados`)

- **Fonte da composição:** cadastro ativo do banco vivo (public.formula_compositions, lido pela chave pública em 16/09/2026)
- **Porção:** 1 g (2 cápsulas)
- **Porções por embalagem:** 30
- **Grupo populacional (%VD):** adultos (≥ 19 anos)
- **Veredito da auditoria de 15/09/2026 (composição atual):** COMPOSIÇÃO IMPOSSÍVEL NA PORÇÃO (auditoria II.4)

**INFORMAÇÃO NUTRICIONAL**

Porções por embalagem: 30  
Porção: 1 g (2 cápsulas)

| | 1 g | %VD* |
|---|---|---|
| Valor energético ⚠ | 0 kcal = 0 kJ | 0% |
| Carboidratos | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Açúcares totais | 0 g |  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Açúcares adicionados | 0 g | 0% |
| Proteínas ⚠ | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;L-triptofano ⚠ | 572 mg |  |
| &nbsp;&nbsp;&nbsp;&nbsp;L-glutamina ⚠ | 95 mg |  |
| &nbsp;&nbsp;&nbsp;&nbsp;Ácido L-aspártico ⚠ | 150 mg |  |
| Gorduras totais | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras saturadas | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras trans | 0 g | 0% |
| Fibras alimentares | 0 g | 0% |
| Sódio ⚠ | 0 mg | 0% |
| Biotina | 45 µg | 150% |
| Magnésio ⚠ | 63 mg | 15% |
| Zinco ⚠ | 30 mg | 273% |
| Melatonina | 0,21 mg |  |
| Fosfatidilserina | 70 mg |  |

*Percentual de valores diários fornecidos pela porção

Bloco de texto puro (vai para `formulas.nutritional_info`):

```
INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 1 g (2 cápsulas)
 | 1 g | %VD*
Valor energético | 0 kcal = 0 kJ | 0%
Carboidratos | 0 g | 0%
  Açúcares totais | 0 g | 
    Açúcares adicionados | 0 g | 0%
Proteínas | 0 g | 0%
  L-triptofano | 572 mg | 
  L-glutamina | 95 mg | 
  Ácido L-aspártico | 150 mg | 
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | 0 g | 0%
Sódio | 0 mg | 0%
Biotina | 45 µg | 150%
Magnésio | 63 mg | 15%
Zinco | 30 mg | 273%
Melatonina | 0,21 mg | 
Fosfatidilserina | 70 mg | 
*Percentual de valores diários fornecidos pela porção
```

**Linhas PENDENTES / PROVISÓRIAS (⚠) e o motivo:**

- Valor energético — PROVISÓRIA: critério único (pendente do RT): fosfatidilserina 70 mg como lipídeo × 9 = 0,63 kcal; aminoácidos livres 817,15 mg não somados (se somados, + 3,3 kcal = 3,9 kcal — ainda não significativo)
- Proteínas — PROVISÓRIA: critério único (pendente do RT): L-triptofano 572,38 mg, ácido L-aspártico 150 mg e L-glutamina 94,77 mg não contam como proteína (se contassem: 0,817 g → 0,8 g = 2 % VD); Anexo IV da IN 75 (lido em 16/09/2026): a expressão '0' para proteínas só é admitida sem aminoácido declarado com valor diferente de zero — a redação final desta linha depende do critério do RT
- L-triptofano — PROVISÓRIA: declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)
- L-glutamina — PROVISÓRIA: declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)
- Ácido L-aspártico — PROVISÓRIA: declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)
- Sódio — PROVISÓRIA: PROVISÓRIO — nenhuma fonte de sódio na composição cadastrada; a cápsula e os excipientes não estão no cadastro
- Magnésio — PROVISÓRIA: PROVISÓRIO — convenção do cadastro assumida (63 mg de magnésio elementar = mínimo exato); se fosse massa do bisglicinato, 8,9 a 19,1 mg — ABAIXO DO MÍNIMO (auditoria II.4)
- Zinco — PROVISÓRIA: cadastro 29,59 mg (= máximo exato do Anexo IV); o arredondamento do Anexo III (≥ 10 → inteiro) leva a 30 mg impressos, acima do máximo no papel; convenção elemento × sal assumida (auditoria II.4)

Notas de linha:

- Valor energético: calculado 0,63 kcal ≤ 4 kcal → não significativo, expresso como 0 (Anexo IV da IN 75)
- L-triptofano: valor antes do arredondamento: 572,38 mg → declarado 572 mg (Anexo III da IN 75; %VD sobre o valor declarado)
- L-glutamina: valor antes do arredondamento: 94,77 mg → declarado 95 mg (Anexo III da IN 75; %VD sobre o valor declarado)
- Gorduras totais: fosfatidilserina 70 mg = 0,07 g de lipídeo; calculado 0,07 g ≤ 0,5 g → não significativo, expresso como 0 (Anexo IV da IN 75)
- Gorduras saturadas: ≤ gorduras totais 0,07 g ≤ 0,1 g
- Biotina: igual ao máximo (45 µg)
- Zinco: valor antes do arredondamento: 29,59 mg → declarado 30 mg (Anexo III da IN 75; %VD sobre o valor declarado)
- Melatonina: igual ao máximo (0,21 mg)
- Fosfatidilserina: origem (lecitina de soja) não declarada no cadastro — NÃO VERIFICADO

Observações:

- Composição-fonte: cadastro ativo (9 linhas; dióxido de silício 20,01 mg é aditivo e não entra). Auditoria II.4 (15/09/2026): COMPOSIÇÃO IMPOSSÍVEL NA PORÇÃO (126,3 % com os sais dos elementos). `warnings` e `ingredients_list` vazios no banco.

---

## Emagrecedor Em Cápsula (`emagrecedor-em-capsula`)

- **Fonte da composição:** cadastro ativo do banco vivo (public.formula_compositions, lido pela chave pública em 16/09/2026)
- **Porção:** 1 g (2 cápsulas)
- **Porções por embalagem:** 30
- **Grupo populacional (%VD):** adultos (≥ 19 anos)
- **Veredito da auditoria de 15/09/2026 (composição atual):** NÃO VERIFICÁVEL — cadastro incompleto (auditoria II.3)

**INFORMAÇÃO NUTRICIONAL**

Porções por embalagem: 30  
Porção: 1 g (2 cápsulas)

| | 1 g | %VD* |
|---|---|---|
| Valor energético ⚠ | PENDENTE |  |
| Carboidratos ⚠ | PENDENTE |  |
| &nbsp;&nbsp;&nbsp;&nbsp;Açúcares totais ⚠ | PENDENTE |  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Açúcares adicionados ⚠ | PENDENTE |  |
| Proteínas ⚠ | PENDENTE |  |
| Gorduras totais ⚠ | PENDENTE |  |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras saturadas ⚠ | PENDENTE |  |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras trans ⚠ | PENDENTE |  |
| Fibras alimentares ⚠ | PENDENTE |  |
| Sódio ⚠ | PENDENTE |  |
| Vitamina A ⚠ | PENDENTE |  |
| Vitamina C ⚠ | PENDENTE |  |
| Cromo ⚠ | 250 µg | 714% |
| Cafeína ⚠ | PENDENTE |  |
| Ácido clorogênico ⚠ | PENDENTE |  |
| Curcumina ⚠ | PENDENTE |  |
| Antocianinas da laranja moro ⚠ | PENDENTE |  |
| Saponinas de glicosídeos de furostanol ⚠ | PENDENTE |  |

*Percentual de valores diários fornecidos pela porção

Bloco de texto puro (vai para `formulas.nutritional_info`):

```
INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 1 g (2 cápsulas)
 | 1 g | %VD*
Valor energético | PENDENTE | 
Carboidratos | PENDENTE | 
  Açúcares totais | PENDENTE | 
    Açúcares adicionados | PENDENTE | 
Proteínas | PENDENTE | 
Gorduras totais | PENDENTE | 
  Gorduras saturadas | PENDENTE | 
  Gorduras trans | PENDENTE | 
Fibras alimentares | PENDENTE | 
Sódio | PENDENTE | 
Vitamina A | PENDENTE | 
Vitamina C | PENDENTE | 
Cromo | 250 µg | 714%
Cafeína | PENDENTE | 
Ácido clorogênico | PENDENTE | 
Curcumina | PENDENTE | 
Antocianinas da laranja moro | PENDENTE | 
Saponinas de glicosídeos de furostanol | PENDENTE | 
*Percentual de valores diários fornecidos pela porção
```

**Linhas PENDENTES / PROVISÓRIAS (⚠) e o motivo:**

- Valor energético — PENDENTE: cadastro incompleto: a composição tem uma única linha (picolinato de cromo 250 mcg) e a lista de ingredientes declara spirulina, psyllium, cúrcuma, quitosana, inulina, vitamina C, vitamina A, guaraná em pó, laranja moro, feno-grego e café verde sem quantidade — não há como calcular
- Carboidratos — PENDENTE: cadastro incompleto: a composição tem uma única linha (picolinato de cromo 250 mcg) e a lista de ingredientes declara spirulina, psyllium, cúrcuma, quitosana, inulina, vitamina C, vitamina A, guaraná em pó, laranja moro, feno-grego e café verde sem quantidade — não há como calcular
- Açúcares totais — PENDENTE: cadastro incompleto: a composição tem uma única linha (picolinato de cromo 250 mcg) e a lista de ingredientes declara spirulina, psyllium, cúrcuma, quitosana, inulina, vitamina C, vitamina A, guaraná em pó, laranja moro, feno-grego e café verde sem quantidade — não há como calcular
- Açúcares adicionados — PENDENTE: cadastro incompleto: a composição tem uma única linha (picolinato de cromo 250 mcg) e a lista de ingredientes declara spirulina, psyllium, cúrcuma, quitosana, inulina, vitamina C, vitamina A, guaraná em pó, laranja moro, feno-grego e café verde sem quantidade — não há como calcular
- Proteínas — PENDENTE: cadastro incompleto: a composição tem uma única linha (picolinato de cromo 250 mcg) e a lista de ingredientes declara spirulina, psyllium, cúrcuma, quitosana, inulina, vitamina C, vitamina A, guaraná em pó, laranja moro, feno-grego e café verde sem quantidade — não há como calcular
- Gorduras totais — PENDENTE: cadastro incompleto: a composição tem uma única linha (picolinato de cromo 250 mcg) e a lista de ingredientes declara spirulina, psyllium, cúrcuma, quitosana, inulina, vitamina C, vitamina A, guaraná em pó, laranja moro, feno-grego e café verde sem quantidade — não há como calcular
- Gorduras saturadas — PENDENTE: cadastro incompleto: a composição tem uma única linha (picolinato de cromo 250 mcg) e a lista de ingredientes declara spirulina, psyllium, cúrcuma, quitosana, inulina, vitamina C, vitamina A, guaraná em pó, laranja moro, feno-grego e café verde sem quantidade — não há como calcular
- Gorduras trans — PENDENTE: cadastro incompleto: a composição tem uma única linha (picolinato de cromo 250 mcg) e a lista de ingredientes declara spirulina, psyllium, cúrcuma, quitosana, inulina, vitamina C, vitamina A, guaraná em pó, laranja moro, feno-grego e café verde sem quantidade — não há como calcular
- Fibras alimentares — PENDENTE: cadastro incompleto: a composição tem uma única linha (picolinato de cromo 250 mcg) e a lista de ingredientes declara spirulina, psyllium, cúrcuma, quitosana, inulina, vitamina C, vitamina A, guaraná em pó, laranja moro, feno-grego e café verde sem quantidade — não há como calcular
- Sódio — PENDENTE: cadastro incompleto: a composição tem uma única linha (picolinato de cromo 250 mcg) e a lista de ingredientes declara spirulina, psyllium, cúrcuma, quitosana, inulina, vitamina C, vitamina A, guaraná em pó, laranja moro, feno-grego e café verde sem quantidade — não há como calcular
- Vitamina A — PENDENTE: declarada na lista de ingredientes (acetato de retinol) sem quantidade na composição
- Vitamina C — PENDENTE: declarada na lista de ingredientes (ácido ascórbico) sem quantidade na composição
- Cromo — PROVISÓRIA: PROVISÓRIO — cadastro 'picolinato de Cromo 250 mcg': se é cromo elementar, 250 µg = máximo exato; se é massa do picolinato (12,43 % de Cr), 31,1 µg — auditoria II.3
- Cafeína — PENDENTE: guaraná em pó declarado na lista de ingredientes sem quantidade nem laudo de cafeína
- Ácido clorogênico — PENDENTE: extrato de café verde declarado na lista de ingredientes sem quantidade
- Curcumina — PENDENTE: cúrcuma declarada na lista de ingredientes sem quantidade
- Antocianinas da laranja moro — PENDENTE: laranja moro declarada na lista de ingredientes sem quantidade
- Saponinas de glicosídeos de furostanol — PENDENTE: extrato seco de feno-grego declarado na lista de ingredientes sem quantidade

Observações:

- Composição-fonte: cadastro ativo (1 linha = 0,25 mg numa porção de 1.000 mg; 99,97 % da massa sem declaração). Auditoria II.3 (15/09/2026): NÃO VERIFICÁVEL. A tabela declara o que o cadastro diz existir; quase tudo fica PENDENTE até a ficha técnica ou a arte do rótulo com a composição completa.

---

## Slim Up — EMAGRECIMENTO EM GOTA (`slim-up-emagrecimento-em-gota`)

- **Fonte da composição:** cadastro ativo do banco vivo (public.formula_compositions, lido pela chave pública em 16/09/2026)
- **Porção:** 2 mL
- **Porções por embalagem:** PENDENTE
- **Grupo populacional (%VD):** adultos (≥ 19 anos)
- **Veredito da auditoria de 15/09/2026 (composição atual):** NÃO VERIFICÁVEL (auditoria II.9: extratos sem laudo; cadastro contraditório)

**INFORMAÇÃO NUTRICIONAL**

Porções por embalagem: PENDENTE  
Porção: 2 mL

| | 2 mL | %VD* |
|---|---|---|
| Valor energético ⚠ | PENDENTE |  |
| Carboidratos ⚠ | PENDENTE |  |
| &nbsp;&nbsp;&nbsp;&nbsp;Açúcares totais ⚠ | PENDENTE |  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Açúcares adicionados ⚠ | PENDENTE |  |
| &nbsp;&nbsp;&nbsp;&nbsp;Poliois totais ⚠ | PENDENTE |  |
| Proteínas ⚠ | PENDENTE |  |
| Gorduras totais ⚠ | PENDENTE |  |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras saturadas ⚠ | PENDENTE |  |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras trans ⚠ | PENDENTE |  |
| Fibras alimentares ⚠ | PENDENTE |  |
| Sódio ⚠ | PENDENTE |  |
| Vitamina D | 50 µg | 333% |
| Vitamina B12 | 9,9 µg | 413% |
| Cromo ⚠ | 250 µg | 714% |
| Colina ⚠ | PENDENTE |  |
| Ácido clorogênico ⚠ | PENDENTE |  |
| Curcumina ⚠ | PENDENTE |  |
| Saponinas de glicosídeos de furostanol ⚠ | PENDENTE |  |

*Percentual de valores diários fornecidos pela porção

Bloco de texto puro (vai para `formulas.nutritional_info`):

```
INFORMAÇÃO NUTRICIONAL
Porções por embalagem: PENDENTE
Porção: 2 mL
 | 2 mL | %VD*
Valor energético | PENDENTE | 
Carboidratos | PENDENTE | 
  Açúcares totais | PENDENTE | 
    Açúcares adicionados | PENDENTE | 
  Poliois totais | PENDENTE | 
Proteínas | PENDENTE | 
Gorduras totais | PENDENTE | 
  Gorduras saturadas | PENDENTE | 
  Gorduras trans | PENDENTE | 
Fibras alimentares | PENDENTE | 
Sódio | PENDENTE | 
Vitamina D | 50 µg | 333%
Vitamina B12 | 9,9 µg | 413%
Cromo | 250 µg | 714%
Colina | PENDENTE | 
Ácido clorogênico | PENDENTE | 
Curcumina | PENDENTE | 
Saponinas de glicosídeos de furostanol | PENDENTE | 
*Percentual de valores diários fornecidos pela porção
```

**Linhas PENDENTES / PROVISÓRIAS (⚠) e o motivo:**

- Valor energético — PENDENTE: veículo líquido (sorbitol líquido, goma xantana, ácido cítrico, conservantes, água — declarados na lista de ingredientes) sem quantidade no cadastro; sorbitol tem fator 2,6 kcal/g e é poliol — sem a massa não há como calcular
- Carboidratos — PENDENTE: veículo líquido (sorbitol líquido, goma xantana, ácido cítrico, conservantes, água — declarados na lista de ingredientes) sem quantidade no cadastro; sorbitol tem fator 2,6 kcal/g e é poliol — sem a massa não há como calcular
- Açúcares totais — PENDENTE: veículo líquido (sorbitol líquido, goma xantana, ácido cítrico, conservantes, água — declarados na lista de ingredientes) sem quantidade no cadastro; sorbitol tem fator 2,6 kcal/g e é poliol — sem a massa não há como calcular
- Açúcares adicionados — PENDENTE: veículo líquido (sorbitol líquido, goma xantana, ácido cítrico, conservantes, água — declarados na lista de ingredientes) sem quantidade no cadastro; sorbitol tem fator 2,6 kcal/g e é poliol — sem a massa não há como calcular
- Poliois totais — PENDENTE: veículo líquido (sorbitol líquido, goma xantana, ácido cítrico, conservantes, água — declarados na lista de ingredientes) sem quantidade no cadastro; sorbitol tem fator 2,6 kcal/g e é poliol — sem a massa não há como calcular
- Proteínas — PENDENTE: veículo líquido (sorbitol líquido, goma xantana, ácido cítrico, conservantes, água — declarados na lista de ingredientes) sem quantidade no cadastro; sorbitol tem fator 2,6 kcal/g e é poliol — sem a massa não há como calcular
- Gorduras totais — PENDENTE: veículo líquido (sorbitol líquido, goma xantana, ácido cítrico, conservantes, água — declarados na lista de ingredientes) sem quantidade no cadastro; sorbitol tem fator 2,6 kcal/g e é poliol — sem a massa não há como calcular
- Gorduras saturadas — PENDENTE: veículo líquido (sorbitol líquido, goma xantana, ácido cítrico, conservantes, água — declarados na lista de ingredientes) sem quantidade no cadastro; sorbitol tem fator 2,6 kcal/g e é poliol — sem a massa não há como calcular
- Gorduras trans — PENDENTE: veículo líquido (sorbitol líquido, goma xantana, ácido cítrico, conservantes, água — declarados na lista de ingredientes) sem quantidade no cadastro; sorbitol tem fator 2,6 kcal/g e é poliol — sem a massa não há como calcular
- Fibras alimentares — PENDENTE: inulina declarada na lista de ingredientes sem quantidade; extratos sem laudo
- Sódio — PENDENTE: veículo líquido (sorbitol líquido, goma xantana, ácido cítrico, conservantes, água — declarados na lista de ingredientes) sem quantidade no cadastro; sorbitol tem fator 2,6 kcal/g e é poliol — sem a massa não há como calcular
- Cromo — PROVISÓRIA: PROVISÓRIO — 250 mcg lidos como cromo elementar (convenção do cadastro; = máximo exato); se fosse massa do picolinato, 31,1 µg — auditoria II.9
- Colina — PENDENTE: bitartarato de colina declarado na lista de ingredientes sem quantidade na composição
- Ácido clorogênico — PENDENTE: extrato de café verde 92,9 mg sem laudo de padronização (ácido clorogênico e cafeína)
- Curcumina — PENDENTE: cúrcuma declarada na lista de ingredientes sem quantidade na composição
- Saponinas de glicosídeos de furostanol — PENDENTE: extrato fluido de feno-grego 33 mg sem laudo de saponinas

Notas de linha:

- Vitamina D: igual ao máximo (50 µg)
- Vitamina B12: metilcobalamina; igual ao máximo (9,94 µg); valor antes do arredondamento: 9,94 µg → declarado 9,9 µg (Anexo III da IN 75; %VD sobre o valor declarado)

Observações:

- Composição-fonte: cadastro ativo (5 linhas). Porção cadastrada: 2 mL ('Ingerir 2 mL ao dia'); porções por embalagem: 'Conforme apresentação comercial' — frasco não cadastrado (PENDENTE). O memorial da fábrica (Slim Up rev03, lido na fase 1) fala em frasco de 30 mL e porção de 1 mL (30 gotas): divergência entre cadastro e memorial, sem rótulo para decidir.
- Auditoria II.9 (15/09/2026): NÃO VERIFICÁVEL. A lista de ingredientes declara cúrcuma, bitartarato de colina e inulina que não estão na composição (cadastro contraditório).

---

## SHOT + COLÁGENO 300 GRAMAS (`shot-colageno-300-gramas`)

- **Fonte da composição:** cadastro ativo do banco vivo (public.formula_compositions, lido pela chave pública em 16/09/2026)
- **Porção:** 10 g (1 dose)
- **Porções por embalagem:** 30
- **Grupo populacional (%VD):** adultos (≥ 19 anos)
- **Veredito da auditoria de 15/09/2026 (composição atual):** NÃO VERIFICÁVEL (auditoria II.8: teor proteico do colágeno; zinco no mínimo exato)

**INFORMAÇÃO NUTRICIONAL**

Porções por embalagem: 30  
Porção: 10 g (1 dose)

| | 10 g | %VD* |
|---|---|---|
| Valor energético ⚠ | 32 kcal = 133 kJ | 2% |
| Carboidratos | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Açúcares totais | 0 g |  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Açúcares adicionados | 0 g | 0% |
| Proteínas ⚠ | 7,6 g | 15% |
| Gorduras totais | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras saturadas | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras trans | 0 g | 0% |
| Fibras alimentares | 0 g | 0% |
| Sódio ⚠ | PENDENTE |  |
| Vitamina C | 800 mg | 800% |
| Zinco ⚠ | 1,7 mg | 15% |
| Ácido clorogênico ⚠ | PENDENTE |  |
| Curcumina ⚠ | PENDENTE |  |
| Antocianinas da laranja moro ⚠ | PENDENTE |  |

*Percentual de valores diários fornecidos pela porção

Bloco de texto puro (vai para `formulas.nutritional_info`):

```
INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 10 g (1 dose)
 | 10 g | %VD*
Valor energético | 32 kcal = 133 kJ | 2%
Carboidratos | 0 g | 0%
  Açúcares totais | 0 g | 
    Açúcares adicionados | 0 g | 0%
Proteínas | 7,6 g | 15%
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | 0 g | 0%
Sódio | PENDENTE | 
Vitamina C | 800 mg | 800%
Zinco | 1,7 mg | 15%
Ácido clorogênico | PENDENTE | 
Curcumina | PENDENTE | 
Antocianinas da laranja moro | PENDENTE | 
*Percentual de valores diários fornecidos pela porção
```

**Linhas PENDENTES / PROVISÓRIAS (⚠) e o motivo:**

- Valor energético — PROVISÓRIA: PROVISÓRIO — colágeno hidrolisado 8.400 mg × 91,0 % de proteína (último teor conhecido: Verisol lote 10.236, laudo vencido em 15/05/2026; o Peptan AUTO040177 válido não tem doseamento) × 4 = 30,58 kcal + ácido cítrico 400 mg × 3 = 1,2 kcal + maltodextrina 31,35 mg × 4 = 0,125 kcal = 31,9 kcal; se o colágeno fosse 100 % proteína: 34,9 kcal
- Proteínas — PROVISÓRIA: PROVISÓRIO — 8.400 mg de colágeno hidrolisado × 91,0 % (último teor conhecido, laudo vencido; lote em uso sem laudo) = 7,644 g; a 100 % seriam 8,4 g (= mínimo exato de proteínas do Anexo III da IN 28); qualquer teor abaixo de 100 % deixa ABAIXO DO MÍNIMO (auditoria II.8)
- Sódio — PENDENTE: sódio do colágeno hidrolisado (8,4 g) desconhecido — depende do laudo do insumo; pode passar de 5 mg; corante e aditivos sem laudo
- Zinco — PROVISÓRIA: PROVISÓRIO — cadastro 1,65 mg (= mínimo exato) lido como elemento (convenção do cadastro); se fosse massa do bisglicinato, 0,33 a 0,51 mg — ABAIXO DO MÍNIMO; Anexo III arredonda 1,65 → 1,7 mg (auditoria II.8)
- Ácido clorogênico — PENDENTE: extrato de café verde declarado na lista de ingredientes sem quantidade na composição (cadastro contraditório)
- Curcumina — PENDENTE: extrato de Curcuma longa declarado na lista de ingredientes sem quantidade na composição
- Antocianinas da laranja moro — PENDENTE: extrato de laranja moro declarado na lista de ingredientes sem quantidade na composição

Notas de linha:

- Carboidratos: maltodextrina 31,35 mg = 0,031 g; calculado 0,031 g ≤ 0,5 g → não significativo, expresso como 0 (Anexo IV da IN 75)
- Açúcares totais: ≤ 0,03 g de maltodextrina → não significativo
- Açúcares adicionados: sem açúcar na lista de ingredientes (sucralose não é açúcar)
- Proteínas: valor antes do arredondamento: 7,64 g → declarado 7,6 g (Anexo III da IN 75; %VD sobre o valor declarado)
- Fibras alimentares: sem fonte de fibra na composição
- Zinco: valor antes do arredondamento: 1,65 mg → declarado 1,7 mg (Anexo III da IN 75; %VD sobre o valor declarado)

Observações:

- Composição-fonte: cadastro ativo (9 linhas; aromatizante 200 mg, dióxido de silício 100 mg, sucralose 50 mg e corante 17 mg são aditivos e não entram; o ácido cítrico entra só na energia). Auditoria II.8 (15/09/2026): NÃO VERIFICÁVEL.

---

## Ômega Pró TG (`omega-pro-tg`)

- **Fonte da composição:** cadastro ativo do banco vivo (public.formula_compositions, lido pela chave pública em 16/09/2026)
- **Porção:** 1 g (2 softgels)
- **Porções por embalagem:** 30
- **Grupo populacional (%VD):** adultos (≥ 19 anos)
- **Veredito da auditoria de 15/09/2026 (composição atual):** NÃO VERIFICÁVEL (auditoria II.6: mínimo de 5 g de lipídeos totais — interpretação pendente)
- **TABELA INTEIRA PROVISÓRIA** — ver observações.

**INFORMAÇÃO NUTRICIONAL**

Porções por embalagem: 30  
Porção: 1 g (2 softgels)

| | 1 g | %VD* |
|---|---|---|
| Valor energético ⚠ | 9 kcal = 38 kJ | 0% |
| Carboidratos ⚠ | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Açúcares totais | 0 g |  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Açúcares adicionados | 0 g | 0% |
| Proteínas ⚠ | 0 g | 0% |
| Gorduras totais ⚠ | 1 g | 2% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras saturadas ⚠ | PENDENTE |  |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras trans ⚠ | PENDENTE |  |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras poli-insaturadas ⚠ | PENDENTE |  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ômega 3 ⚠ | 317 mg | 8% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;EPA ⚠ | 185 mg |  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DHA ⚠ | 124 mg |  |
| &nbsp;&nbsp;&nbsp;&nbsp;Colesterol ⚠ | PENDENTE |  |
| Fibras alimentares | 0 g | 0% |
| Sódio ⚠ | 0 mg | 0% |

*Percentual de valores diários fornecidos pela porção

Bloco de texto puro (vai para `formulas.nutritional_info`):

```
INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 1 g (2 softgels)
 | 1 g | %VD*
Valor energético | 9 kcal = 38 kJ | 0%
Carboidratos | 0 g | 0%
  Açúcares totais | 0 g | 
    Açúcares adicionados | 0 g | 0%
Proteínas | 0 g | 0%
Gorduras totais | 1 g | 2%
  Gorduras saturadas | PENDENTE | 
  Gorduras trans | PENDENTE | 
  Gorduras poli-insaturadas | PENDENTE | 
    Ômega 3 | 317 mg | 8%
      EPA | 185 mg | 
      DHA | 124 mg | 
  Colesterol | PENDENTE | 
Fibras alimentares | 0 g | 0%
Sódio | 0 mg | 0%
*Percentual de valores diários fornecidos pela porção
```

**Linhas PENDENTES / PROVISÓRIAS (⚠) e o motivo:**

- Valor energético — PROVISÓRIA: PROVISÓRIO — tabela inteira montada sobre o cadastro, sem laudo do óleo de peixe: óleo de peixe 1.000 mg × 9 kcal/g = 9 kcal
- Carboidratos — PROVISÓRIA: PROVISÓRIO — tabela inteira montada sobre o cadastro, sem laudo do óleo de peixe
- Proteínas — PROVISÓRIA: PROVISÓRIO — tabela inteira montada sobre o cadastro, sem laudo do óleo de peixe (cápsula de gelatina não cadastrada)
- Gorduras totais — PROVISÓRIA: PROVISÓRIO — tabela inteira montada sobre o cadastro, sem laudo do óleo de peixe; 1 g de lipídeos contra o mínimo de 5 g de lipídeos totais do Anexo III da IN 28 — se o mínimo se aplica ao óleo de peixe como fonte de EPA/DHA é interpretação pendente do RT/ANVISA (auditoria II.6)
- Gorduras saturadas — PENDENTE: perfil de ácidos graxos do laudo do óleo
- Gorduras trans — PENDENTE: laudo do óleo
- Gorduras poli-insaturadas — PENDENTE: laudo do óleo (linha necessária para declarar ômega 3 no 2º nível, Anexo XI)
- Ômega 3 — PROVISÓRIA: PROVISÓRIO — tabela inteira montada sobre o cadastro, sem laudo do óleo de peixe: ômega-3 total 316,5 mg do cadastro (EPA 185,34 + DHA 123,56 + outros 7,6)
- EPA — PROVISÓRIA: PROVISÓRIO — tabela inteira montada sobre o cadastro, sem laudo do óleo de peixe
- DHA — PROVISÓRIA: PROVISÓRIO — tabela inteira montada sobre o cadastro, sem laudo do óleo de peixe
- Colesterol — PENDENTE: laudo do óleo
- Sódio — PROVISÓRIA: PROVISÓRIO — nenhuma fonte de sódio na composição cadastrada; a softgel e os excipientes não estão no cadastro

Notas de linha:

- Ômega 3: valor antes do arredondamento: 316,5 mg → declarado 317 mg (Anexo III da IN 75; %VD sobre o valor declarado)
- EPA: valor antes do arredondamento: 185,34 mg → declarado 185 mg (Anexo III da IN 75; %VD sobre o valor declarado)
- DHA: valor antes do arredondamento: 123,56 mg → declarado 124 mg (Anexo III da IN 75; %VD sobre o valor declarado)

Observações:

- TABELA INTEIRA PROVISÓRIA: montada sobre o cadastro do banco (óleo de peixe TG 1.000 mg; ômega-3 total 316,5 mg; EPA 185,34 mg; DHA 123,56 mg; outros ômega-3 7,6 mg — as linhas 2 a 5 são componentes do óleo, não massa adicional), sem laudo do óleo, memorial nem rótulo. Auditoria II.6 (15/09/2026): NÃO VERIFICÁVEL; EPA + DHA = 308,9 mg, dentro de 37,5 a 2.000 mg.

---

## CREATINA MONOIDRATADA 300 g SOLÚVEL (`creatina-monohidratada-300g-soluvel`)

- **Fonte da composição:** cadastro ativo do banco vivo (public.formula_compositions, lido pela chave pública em 16/09/2026)
- **Porção:** 5 g (1 dose)
- **Porções por embalagem:** 60
- **Grupo populacional (%VD):** adultos (≥ 19 anos)
- **Veredito da auditoria de 15/09/2026 (composição atual):** 100% CONFORME PELO CADASTRO (auditoria II.2)

**INFORMAÇÃO NUTRICIONAL**

Porções por embalagem: 60  
Porção: 5 g (1 dose)

| | 5 g | %VD* |
|---|---|---|
| Valor energético ⚠ | 0 kcal = 0 kJ | 0% |
| Carboidratos | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Açúcares totais | 0 g |  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Açúcares adicionados | 0 g | 0% |
| Proteínas | 0 g | 0% |
| Gorduras totais | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras saturadas | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras trans | 0 g | 0% |
| Fibras alimentares | 0 g | 0% |
| Sódio ⚠ | 0 mg | 0% |
| Creatina ⚠ | 5.000 mg |  |

*Percentual de valores diários fornecidos pela porção

Bloco de texto puro (vai para `formulas.nutritional_info`):

```
INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 60
Porção: 5 g (1 dose)
 | 5 g | %VD*
Valor energético | 0 kcal = 0 kJ | 0%
Carboidratos | 0 g | 0%
  Açúcares totais | 0 g | 
    Açúcares adicionados | 0 g | 0%
Proteínas | 0 g | 0%
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | 0 g | 0%
Sódio | 0 mg | 0%
Creatina | 5.000 mg | 
*Percentual de valores diários fornecidos pela porção
```

**Linhas PENDENTES / PROVISÓRIAS (⚠) e o motivo:**

- Valor energético — PROVISÓRIA: critério único (pendente do RT): creatina sem fator no Anexo XXII → 0 kcal (a irmã de 150 g com rótulo imprime 0 kcal)
- Sódio — PROVISÓRIA: PROVISÓRIO — cadastro sem fonte de sódio (só creatina monoidratada); a irmã de 150 g com rótulo imprime 0 mg
- Creatina — PROVISÓRIA: creatina monoidratada 5.000 mg (massa nominal do cadastro); igual ao máximo (IN 373/2025); declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)

Observações:

- Composição-fonte: cadastro ativo (1 linha). Porção: 5 g (1 dose), do modo de uso cadastrado ('Diluir 5 g (1 dose) em 200 mL de água'); porções por embalagem: 300 g ÷ 5 g = 60 (calculado — o cadastro não declara). Auditoria II.2 (15/09/2026): 100 % CONFORME PELO CADASTRO (selo condicionado à confirmação escrita do dono).

---

## CREATINA EM GUMMY SABOR TUTTI-FRUTTI (`creatina-em-gummy-sabor-tutti-frutti`)

- **Fonte da composição:** cadastro ativo do banco vivo (public.formula_compositions, lido pela chave pública em 16/09/2026)
- **Porção:** 2 gomas (massa da porção não cadastrada)
- **Porções por embalagem:** 30
- **Grupo populacional (%VD):** adultos (≥ 19 anos)
- **Veredito da auditoria de 15/09/2026 (composição atual):** 100% CONFORME PELO CADASTRO (auditoria II.1)

**INFORMAÇÃO NUTRICIONAL**

Porções por embalagem: 30  
Porção: 2 gomas (massa da porção não cadastrada)

| | 2 gomas | %VD* |
|---|---|---|
| Valor energético ⚠ | PENDENTE |  |
| Carboidratos ⚠ | PENDENTE |  |
| &nbsp;&nbsp;&nbsp;&nbsp;Açúcares totais ⚠ | PENDENTE |  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Açúcares adicionados ⚠ | PENDENTE |  |
| &nbsp;&nbsp;&nbsp;&nbsp;Poliois totais ⚠ | PENDENTE |  |
| Proteínas ⚠ | PENDENTE |  |
| Gorduras totais ⚠ | PENDENTE |  |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras saturadas ⚠ | PENDENTE |  |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras trans ⚠ | PENDENTE |  |
| Fibras alimentares ⚠ | PENDENTE |  |
| Sódio ⚠ | PENDENTE |  |
| Creatina ⚠ | 3.000 mg |  |

*Percentual de valores diários fornecidos pela porção

Bloco de texto puro (vai para `formulas.nutritional_info`):

```
INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 2 gomas (massa da porção não cadastrada)
 | 2 gomas | %VD*
Valor energético | PENDENTE | 
Carboidratos | PENDENTE | 
  Açúcares totais | PENDENTE | 
    Açúcares adicionados | PENDENTE | 
  Poliois totais | PENDENTE | 
Proteínas | PENDENTE | 
Gorduras totais | PENDENTE | 
  Gorduras saturadas | PENDENTE | 
  Gorduras trans | PENDENTE | 
Fibras alimentares | PENDENTE | 
Sódio | PENDENTE | 
Creatina | 3.000 mg | 
*Percentual de valores diários fornecidos pela porção
```

**Linhas PENDENTES / PROVISÓRIAS (⚠) e o motivo:**

- Valor energético — PENDENTE: base da goma não cadastrada (o `nutritional_info` do banco diz só '3 g de creatina / Base da Gummy'); a irmã Frutas Vermelhas com rótulo imprime 9 kcal, 3 g de carboidratos (2,7 g de poliois), 0,4 g de proteínas, 0 g de gorduras e 10 mg de sódio — não copiado, porque não é dado deste produto
- Carboidratos — PENDENTE: base da goma não cadastrada (o `nutritional_info` do banco diz só '3 g de creatina / Base da Gummy'); a irmã Frutas Vermelhas com rótulo imprime 9 kcal, 3 g de carboidratos (2,7 g de poliois), 0,4 g de proteínas, 0 g de gorduras e 10 mg de sódio — não copiado, porque não é dado deste produto
- Açúcares totais — PENDENTE: base da goma não cadastrada (o `nutritional_info` do banco diz só '3 g de creatina / Base da Gummy'); a irmã Frutas Vermelhas com rótulo imprime 9 kcal, 3 g de carboidratos (2,7 g de poliois), 0,4 g de proteínas, 0 g de gorduras e 10 mg de sódio — não copiado, porque não é dado deste produto
- Açúcares adicionados — PENDENTE: base da goma não cadastrada (o `nutritional_info` do banco diz só '3 g de creatina / Base da Gummy'); a irmã Frutas Vermelhas com rótulo imprime 9 kcal, 3 g de carboidratos (2,7 g de poliois), 0,4 g de proteínas, 0 g de gorduras e 10 mg de sódio — não copiado, porque não é dado deste produto
- Poliois totais — PENDENTE: base da goma não cadastrada (o `nutritional_info` do banco diz só '3 g de creatina / Base da Gummy'); a irmã Frutas Vermelhas com rótulo imprime 9 kcal, 3 g de carboidratos (2,7 g de poliois), 0,4 g de proteínas, 0 g de gorduras e 10 mg de sódio — não copiado, porque não é dado deste produto
- Proteínas — PENDENTE: base da goma não cadastrada (o `nutritional_info` do banco diz só '3 g de creatina / Base da Gummy'); a irmã Frutas Vermelhas com rótulo imprime 9 kcal, 3 g de carboidratos (2,7 g de poliois), 0,4 g de proteínas, 0 g de gorduras e 10 mg de sódio — não copiado, porque não é dado deste produto
- Gorduras totais — PENDENTE: base da goma não cadastrada (o `nutritional_info` do banco diz só '3 g de creatina / Base da Gummy'); a irmã Frutas Vermelhas com rótulo imprime 9 kcal, 3 g de carboidratos (2,7 g de poliois), 0,4 g de proteínas, 0 g de gorduras e 10 mg de sódio — não copiado, porque não é dado deste produto
- Gorduras saturadas — PENDENTE: base da goma não cadastrada (o `nutritional_info` do banco diz só '3 g de creatina / Base da Gummy'); a irmã Frutas Vermelhas com rótulo imprime 9 kcal, 3 g de carboidratos (2,7 g de poliois), 0,4 g de proteínas, 0 g de gorduras e 10 mg de sódio — não copiado, porque não é dado deste produto
- Gorduras trans — PENDENTE: base da goma não cadastrada (o `nutritional_info` do banco diz só '3 g de creatina / Base da Gummy'); a irmã Frutas Vermelhas com rótulo imprime 9 kcal, 3 g de carboidratos (2,7 g de poliois), 0,4 g de proteínas, 0 g de gorduras e 10 mg de sódio — não copiado, porque não é dado deste produto
- Fibras alimentares — PENDENTE: base da goma não cadastrada (o `nutritional_info` do banco diz só '3 g de creatina / Base da Gummy'); a irmã Frutas Vermelhas com rótulo imprime 9 kcal, 3 g de carboidratos (2,7 g de poliois), 0,4 g de proteínas, 0 g de gorduras e 10 mg de sódio — não copiado, porque não é dado deste produto
- Sódio — PENDENTE: base da goma não cadastrada (o `nutritional_info` do banco diz só '3 g de creatina / Base da Gummy'); a irmã Frutas Vermelhas com rótulo imprime 9 kcal, 3 g de carboidratos (2,7 g de poliois), 0,4 g de proteínas, 0 g de gorduras e 10 mg de sódio — não copiado, porque não é dado deste produto
- Creatina — PROVISÓRIA: creatina monoidratada 3.000 mg (massa nominal do cadastro); igual ao mínimo (3.000 mg); declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)

Observações:

- Composição-fonte: cadastro ativo (1 linha). Porção: 2 gomas ('Consumir 2 gomas ao dia'); a massa da porção não está cadastrada (a irmã Frutas Vermelhas tem 6 g por 2 gomas) — PENDENTE; porções por embalagem: 60 gomas ÷ 2 = 30 (calculado). Auditoria II.1 (15/09/2026): 100 % CONFORME PELO CADASTRO (selo condicionado à confirmação escrita do dono).

---

## PRÉ TREINO 300 G (`pre-treino-300-g`)

- **Fonte da composição:** cadastro ativo do banco vivo (public.formula_compositions, lido pela chave pública em 16/09/2026)
- **Porção:** 10 g (1 dose)
- **Porções por embalagem:** 30
- **Grupo populacional (%VD):** adultos (≥ 19 anos)
- **Veredito da auditoria de 15/09/2026 (composição atual):** NÃO VERIFICÁVEL (auditoria II.7: cadastro contraditório — L-citrulina malato na lista de ingredientes)

**INFORMAÇÃO NUTRICIONAL**

Porções por embalagem: 30  
Porção: 10 g (1 dose)

| | 10 g | %VD* |
|---|---|---|
| Valor energético ⚠ | 5 kcal = 20 kJ | 0% |
| Carboidratos | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Açúcares totais | 0 g |  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Açúcares adicionados | 0 g | 0% |
| Proteínas ⚠ | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;L-tirosina ⚠ | 500 mg |  |
| &nbsp;&nbsp;&nbsp;&nbsp;Beta-alanina ⚠ | 300 mg |  |
| &nbsp;&nbsp;&nbsp;&nbsp;L-citrulina malato ⚠ | PENDENTE |  |
| Gorduras totais | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras saturadas | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras trans | 0 g | 0% |
| Fibras alimentares | 0 g | 0% |
| Sódio ⚠ | 0 mg | 0% |
| Taurina ⚠ | 2.000 mg |  |
| Creatina ⚠ | 5.000 mg |  |
| Cafeína | 200 mg |  |

*Percentual de valores diários fornecidos pela porção

Bloco de texto puro (vai para `formulas.nutritional_info`):

```
INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 10 g (1 dose)
 | 10 g | %VD*
Valor energético | 5 kcal = 20 kJ | 0%
Carboidratos | 0 g | 0%
  Açúcares totais | 0 g | 
    Açúcares adicionados | 0 g | 0%
Proteínas | 0 g | 0%
  L-tirosina | 500 mg | 
  Beta-alanina | 300 mg | 
  L-citrulina malato | PENDENTE | 
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | 0 g | 0%
Sódio | 0 mg | 0%
Taurina | 2.000 mg | 
Creatina | 5.000 mg | 
Cafeína | 200 mg | 
*Percentual de valores diários fornecidos pela porção
```

**Linhas PENDENTES / PROVISÓRIAS (⚠) e o motivo:**

- Valor energético — PROVISÓRIA: critério único (pendente do RT): ácido cítrico 1.100 mg × 3 = 3,3 kcal + maltodextrina 342 mg × 4 = 1,368 kcal = 4,668 kcal → 5 kcal; aminoácidos livres (800 mg), taurina (2.000 mg), creatina e cafeína não somados (se aminoácidos e taurina contassem, + 11,2 kcal)
- Proteínas — PROVISÓRIA: critério único (pendente do RT): L-tirosina 500 mg e beta-alanina 300 mg não contam como proteína (se contassem: 0,8 g = 2 % VD); Anexo IV da IN 75 (lido em 16/09/2026): a expressão '0' para proteínas só é admitida sem aminoácido declarado com valor diferente de zero — a redação final desta linha depende do critério do RT
- L-tirosina — PROVISÓRIA: declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)
- Beta-alanina — PROVISÓRIA: 300 mg por dose única (dentro da advertência VI·18: doses de no máximo 300 mg); declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)
- L-citrulina malato — PENDENTE: declarada em primeiro lugar na lista de ingredientes cadastrada, sem quantidade na composição (que já soma 10.000 mg); L-citrulina não consta do Anexo I da IN 28 — se existir no produto, é FORMA NÃO AUTORIZADA (auditoria II.7)
- Sódio — PROVISÓRIA: PROVISÓRIO — nenhuma fonte de sódio na composição cadastrada (sem citrato de sódio); aditivos e corante sem laudo
- Taurina — PROVISÓRIA: igual ao máximo (2.000 mg); declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)
- Creatina — PROVISÓRIA: creatina monoidratada 5.000 mg (massa nominal do cadastro); igual ao máximo (IN 373/2025); declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)

Notas de linha:

- Carboidratos: maltodextrina 342 mg = 0,342 g; açúcares totais ≤ 0,342 g; calculado 0,342 g ≤ 0,5 g → não significativo, expresso como 0 (Anexo IV da IN 75)
- Açúcares totais: ≤ maltodextrina 0,342 g → não significativo
- Açúcares adicionados: sem açúcar na lista de ingredientes
- Fibras alimentares: sem fonte de fibra na composição
- Cafeína: cafeína anidra 200 mg = máximo exato (não há guaraná nem café verde na composição)

Observações:

- Composição-fonte: cadastro ativo (10 linhas; aromatizante 350 mg, dióxido de silício 118 mg e sucralose 90 mg são aditivos e não entram; o ácido cítrico entra só na energia). Auditoria II.7 (15/09/2026): NÃO VERIFICÁVEL (cadastro contraditório: L-citrulina malato e corante na lista de ingredientes sem massa na composição, que já fecha em 10.000 mg).

---

## Resumo: quantas tabelas têm ⚠ / PENDENTE e por quê

| # | produto | fonte | linhas | ⚠ PROVISÓRIAS | PENDENTES | motivos principais |
|---|---|---|---|---|---|---|
| 1 | BELLA GUMMY (Biotina em Gummy) | rótulo | 16 | 1 | 2 | linha não impressa no rótulo; equivalência da vitamina E |
| 2 | Biotina em Cápsula | rótulo | 30 | 6 | 0 | abaixo do mínimo; forma não autorizada; critério do RT (aminoácidos/creatina/taurina/carnitina); equivalência da vitamina E; conta ≠ impresso |
| 3 | CREATINA MONOIDRATADA 150 g SOLÚVEL | rótulo | 11 | 1 | 0 | critério do RT (aminoácidos/creatina/taurina/carnitina) |
| 4 | Detox Matinal (Lemon Shot) 300 g | rótulo | 15 | 3 | 5 | abaixo do mínimo; laudo ausente; linha não impressa no rótulo; conta ≠ impresso |
| 5 | Melatonina em Gummy Sabor Uva | rótulo | 13 | 2 | 2 | critério do RT (aminoácidos/creatina/taurina/carnitina); linha não impressa no rótulo; conta ≠ impresso |
| 6 | Saúde Intestinal (Floravex) | rótulo | 17 | 4 | 2 | abaixo do mínimo; critério do RT (aminoácidos/creatina/taurina/carnitina); laudo ausente; linha não impressa no rótulo; conta ≠ impresso |
| 7 | FOCUS COLINA | rótulo | 19 | 7 | 0 | abaixo do mínimo; critério do RT (aminoácidos/creatina/taurina/carnitina); conta ≠ impresso |
| 8 | MORO SLIM | rótulo | 16 | 3 | 5 | abaixo do mínimo; laudo ausente; linha não impressa no rótulo; conta ≠ impresso |
| 9 | Multivitamínico | rótulo | 29 | 7 | 0 | acima do máximo; forma não autorizada; critério do RT (aminoácidos/creatina/taurina/carnitina); equivalência da vitamina E; conta ≠ impresso |
| 10 | DORES MUSCULARES (Nuviart) | rótulo | 23 | 7 | 2 | abaixo do mínimo; forma não autorizada; laudo ausente; equivalência da vitamina E; conta ≠ impresso |
| 11 | Pro Energy | rótulo | 17 | 6 | 2 | critério do RT (aminoácidos/creatina/taurina/carnitina); laudo ausente; conta ≠ impresso |
| 12 | Serena | rótulo | 15 | 3 | 0 | critério do RT (aminoácidos/creatina/taurina/carnitina); conta ≠ impresso |
| 13 | ZMA (Zinco, Magnésio e Vitamina B6) | rótulo | 16 | 5 | 0 | forma não autorizada; critério do RT (aminoácidos/creatina/taurina/carnitina); conta ≠ impresso |
| 14 | CREATINA GUMMY SABOR FRUTAS VERMELHAS | rótulo | 12 | 1 | 2 | critério do RT (aminoácidos/creatina/taurina/carnitina); linha não impressa no rótulo |
| 15 | Pré-treino + Creatina Sabor Limão (420 g) — Césio 137 | rótulo | 23 | 11 | 1 | acima do máximo; forma não autorizada; critério do RT (aminoácidos/creatina/taurina/carnitina); linha não impressa no rótulo; conta ≠ impresso |
| 16 | Multi Vitta — Gestante e Lactante em Cápsula | cadastro | 21 | 6 | 0 | abaixo do mínimo; acima do máximo; equivalência da vitamina E |
| 17 | Melatonina + Triptofanos (Encapsulados) | cadastro | 18 | 8 | 0 | abaixo do mínimo; critério do RT (aminoácidos/creatina/taurina/carnitina) |
| 18 | Emagrecedor Em Cápsula | cadastro | 18 | 1 | 17 | laudo ausente; cadastro incompleto |
| 19 | Slim Up — EMAGRECIMENTO EM GOTA | cadastro | 18 | 1 | 15 | laudo ausente; cadastro incompleto |
| 20 | SHOT + COLÁGENO 300 GRAMAS | cadastro | 15 | 3 | 4 | abaixo do mínimo; laudo ausente; cadastro incompleto |
| 21 | Ômega Pró TG | cadastro | 15 | 8 | 4 | laudo ausente |
| 22 | CREATINA MONOIDRATADA 300 g SOLÚVEL | cadastro | 11 | 3 | 0 | critério do RT (aminoácidos/creatina/taurina/carnitina) |
| 23 | CREATINA EM GUMMY SABOR TUTTI-FRUTTI | cadastro | 12 | 1 | 11 | critério do RT (aminoácidos/creatina/taurina/carnitina); cadastro incompleto |
| 24 | PRÉ TREINO 300 G | cadastro | 16 | 7 | 1 | forma não autorizada; critério do RT (aminoácidos/creatina/taurina/carnitina); cadastro incompleto |

## Diferenças de %VD: impresso no rótulo × vigente (Anexo VIII da IN 75/2020)

Só as 15 tabelas com rótulo têm %VD impresso. Lista completa (item, quantidade declarada, %VD impresso → %VD vigente):

- **BELLA GUMMY (Biotina em Gummy)** (`bella-gummy-biotina-em-gummy`): Vitamina A 1.020 µg RAE: 170 → 128%; Vitamina E 17 mg: 111 → 113%
- **Biotina em Cápsula** (`biotina-em-capsula`): Proteínas 0,3 g: 1 → 0%; Vitamina A 1.500 µg RAE: 250 → 188%; Vitamina E 45 mg: 450 → 300%; Vitamina C 250 mg: 556 → 250%; Riboflavina 2,7 mg: 211 → 225%; Niacina 35 mg NE: 219 → 233%; Ácido pantotênico 5,6 mg: 113 → 112%; Vitamina B12 9,9 µg: 414 → 413%
- **Saúde Intestinal (Floravex)** (`saude-intestinal`): Vitamina A 540 µg RAE: 90 → 68%; Vitamina B6 1,3 mg: 97 → 100%; Zinco 14 mg: 123 → 127%
- **MORO SLIM** (`moro-slim`): Vitamina A 1.500 µg RAE: 250 → 188%
- **Multivitamínico** (`multivitaminico`): Vitamina A 1.300 µg RAE: 217 → 163%; Vitamina K 149 µg: ** → 124%; Riboflavina 1,3 mg: 100 → 108%; Niacina 16 mg NE: 100 → 107%; Ácido fólico 1.333 µg DFE: 200 → 333%; Vitamina B12 9,9 µg: 414 → 413%
- **DORES MUSCULARES (Nuviart)** (`dores-musculares`): Proteínas 0,4 g: 1 → 0%; Vitamina D 50 µg: 1000 → 333%; Vitamina B12 9,9 µg: 414 → 413%
- **Pro Energy** (`pro-energy`): Proteínas 0,3 g: 1 → 0%
- **ZMA (Zinco, Magnésio e Vitamina B6)** (`zma-zinco-magnesio-e-vitamina-d`): Proteínas 0,3 g: 1 → 0%
- **CREATINA GUMMY SABOR FRUTAS VERMELHAS** (`creatina-gummy-sabor-frutas-vermelhas`): Proteínas 0,4 g: 1 → 0%; Sódio 10 mg: 0 → 1%
- **Pré-treino + Creatina Sabor Limão (420 g) — Césio 137** (`pre-treino-creatina-sabor-limao-420g`): Niacina 35 mg NE: 219 → 233%; Vitamina B12 9,9 µg: 414 → 413%

## Conferência automática

`scratchpad/fase3/atual.py` → função `verificar`: 805 conferências OK, 0 problema(s) — ordem do Anexo XI, cabeçalho e rodapé, arredondamento do Anexo III, %VD pelo Anexo VIII (recalculado de forma independente sobre a quantidade impressa), célula vazia sem VDR, marcação de PENDENTE e presença das dez linhas obrigatórias, nas 24 tabelas.

Validação da migration `20260921200000_tabelas_nutricionais_formula_atual.sql`: ver `scratchpad/fase3/validacao_migration_atual.md` (pglast).
