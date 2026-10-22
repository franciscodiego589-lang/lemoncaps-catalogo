# Tabelas de Informação Nutricional — fórmula REFORMULADA (24 produtos), versão final de 16/09/2026

**Uso:** arte futura. Decisão do dono (16/09/2026): o catálogo recebe agora as tabelas da fórmula **atual** (`TABELAS-NUTRICIONAIS-FORMULA-ATUAL-2026-09-16.md` e migration `20260921200000`); estas tabelas da reformulação **não vão para o banco** neste momento. Montadas sobre os memoriais de reformulação (`docs/conformidade/reformulacao/<slug>.md`) harmonizados na fase 3 (lotes de referência únicos por insumo — ver `scratchpad/fase3/_harmonizacao_gerada.md`), com o mesmo motor, as mesmas regras e o mesmo formato JSON das tabelas da fórmula atual. Cada tabela vem em dois blocos (Markdown e texto puro), com porção, porções por embalagem, grupo populacional, veredito esperado e as linhas PENDENTES/PROVISÓRIAS (⚠) com o motivo. As 24 tabelas estão também em `docs/conformidade/dados-2026-09-16/fase3/tabelas-nutricionais.json` (formato do schema zod de `lib/catalog/nutrition-table.ts`).

## Regras aplicadas (as mesmas das tabelas da fórmula atual; fontes lidas literalmente em 16/09/2026 no AnvisaLegis)

1. **Linhas, nomes, ordem, indentação e unidades:** dez linhas obrigatórias do art. 5º da RDC 429/2020 + todos os nutrientes e substâncias bioativas adicionados (§3º), na ordem do Anexo XI da IN 75/2020 (aminoácidos específicos no 1º nível sob Proteínas, em mg; poliois totais e específicos sob Carboidratos; ômega 3 no 2º nível sob gorduras poli-insaturadas, EPA/DHA no 3º; colina e taurina em linha própria; bioativos ao final com o nome do constituinte da IN 28/2018). Vitaminas do complexo B pelos nomes alternativos do Anexo XI (Tiamina, Riboflavina, Niacina, Ácido pantotênico, Biotina, Ácido fólico) e 'Vitamina B6'/'Vitamina B12'; vitamina A em µg RAE, ácido fólico em µg DFE, niacina em mg NE (bases dos VDR e dos limites).
2. **Cabeçalho e rodapé:** coluna de quantidade intitulada com a massa/volume da porção ('X g ou ml', Anexo XII); coluna '%VD*' (Multi Vitta: '%VD* gestantes' e '%VD* lactantes'); subtítulos 'Porções por embalagem:' e 'Porção: X g ou ml (medida caseira)'; rodapé literal da RDC 429/2020, art. 12, §5º.
3. **Quantidades:** ativo por porção do memorial harmonizado, arredondado pelo Anexo III da IN 75 (≥ 10 → inteiro; 1 a < 10 → uma casa; < 1 g → uma casa; < 1 mg/µg → duas casas). Creatina pela massa nominal de creatina monoidratada; cafeína como cafeína total (anidra + guaraná em pó pelo teor de metilxantinas totais), PROVISÓRIA.
4. **Valor energético e macronutrientes — critério único (decisão pendente do RT):** só entram itens com fator no Anexo XXII da IN 75 (carboidratos 4; proteínas 4; gorduras 9; ácidos orgânicos 3; sorbitol 2,6; maltitol 2,1; fibras solúveis 2): maltodextrina (inclusive o carreador do Siliciumax), sorbitol e maltitol (poliois, somados em Carboidratos), colágeno hidrolisado, gelatina e colágeno tipo II (fontes proteicas, pelo teor de proteína), óleo de peixe, ácido cítrico e pectina. Aminoácidos livres, creatina, taurina, L-carnitina, colina, inositol, glicerina, MSM, glucosamina e hialuronato **não** contam — são declarados só na própria linha (⚠). Energia e %VD em inteiros (art. 7º, §1º); kJ = kcal × 4,184 (o Anexo XXII não traz kJ). Quantidade não significativa (Anexo IV: ≤ 4 kcal; ≤ 0,5 g de carboidratos, açúcares, proteínas, gorduras e fibras; ≤ 0,1 g de saturadas e trans; ≤ 5 mg de sódio) expressa como '0' e %VD 0. Registro literal do Anexo IV que pesa na decisão do RT: a expressão '0' para proteínas só é admitida 'sem aminoácido naturalmente presente nas proteínas declarado com valor diferente de zero'.
5. **%VD:** Anexo VIII da IN 75 (adultos ≥ 19 anos; gestantes e lactantes no Multi Vitta — inclusive niacina 18/17 mg NE e macronutrientes por grupo, lidos em 16/09/2026), sobre a quantidade arredondada declarada, inteiro (meio para cima); sem VDR → célula vazia (art. 12, §1º).
6. **PENDENTE** = sem dado de fonte (massas dos excipientes das gomas de biotina e de melatonina; laudo do óleo de peixe; sódio das gomas de creatina e do colágeno; perfil de açúcares da maltodextrina). **PROVISÓRIA (⚠)** = número calculado com teor de laudo vencido, teor assumido, insumo a adquirir ou dependente do critério do RT. Nada foi preenchido com valor plausível.

**Legenda:** ⚠ = linha PROVISÓRIA ou dependente da decisão do RT; PENDENTE = sem dado.

---

## Multivitamínico (`multivitaminico`)

- **Fonte:** memorial de reformulação `docs/conformidade/reformulacao/multivitaminico.md`, harmonizado na fase 3 (JSON da fase 2 + 0 correção(ões) de harmonização)
- **Porção:** 1 g (2 cápsulas)
- **Porções por embalagem:** 30
- **Grupo populacional (%VD):** adultos (≥ 19 anos)
- **Veredito esperado da reformulação:** CONFORME CONDICIONADO A (laudo de óxido de magnésio; aquisição de fonte de boro autorizada com laudo; laudos de selenito de sódio e bisglicinato de cobre; laudo vigente da menaquinona-7 do lote em uso; confirmação da potência da vitamina A)

**INFORMAÇÃO NUTRICIONAL**

Porções por embalagem: 30  
Porção: 1 g (2 cápsulas)

| | 1 g | %VD* |
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
| Vitamina A | 1.300 µg RAE | 163% |
| Vitamina D | 40 µg | 267% |
| Vitamina E | 10 mg | 67% |
| Vitamina K ⚠ | 120 µg | 100% |
| Vitamina C | 100 mg | 100% |
| Tiamina | 1,2 mg | 100% |
| Riboflavina | 1,3 mg | 108% |
| Niacina | 16 mg NE | 107% |
| Ácido pantotênico | 5 mg | 100% |
| Vitamina B6 | 1,3 mg | 100% |
| Ácido fólico | 1.000 µg DFE | 250% |
| Vitamina B12 | 8 µg | 333% |
| Cobre ⚠ | 900 µg | 100% |
| Cromo | 35 µg | 100% |
| Magnésio ⚠ | 260 mg | 62% |
| Selênio ⚠ | 100 µg | 167% |
| Zinco | 15 mg | 136% |
| Boro ⚠ | 3 mg |  |

*Percentual de valores diários fornecidos pela porção

Bloco de texto para a arte:

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
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | 0 g | 0%
Sódio | 0 mg | 0%
Vitamina A | 1.300 µg RAE | 163%
Vitamina D | 40 µg | 267%
Vitamina E | 10 mg | 67%
Vitamina K | 120 µg | 100%
Vitamina C | 100 mg | 100%
Tiamina | 1,2 mg | 100%
Riboflavina | 1,3 mg | 108%
Niacina | 16 mg NE | 107%
Ácido pantotênico | 5 mg | 100%
Vitamina B6 | 1,3 mg | 100%
Ácido fólico | 1.000 µg DFE | 250%
Vitamina B12 | 8 µg | 333%
Cobre | 900 µg | 100%
Cromo | 35 µg | 100%
Magnésio | 260 mg | 62%
Selênio | 100 µg | 167%
Zinco | 15 mg | 136%
Boro | 3 mg | 
*Percentual de valores diários fornecidos pela porção
```

**Linhas PENDENTES / PROVISÓRIAS (⚠) e o motivo:**

- Vitamina K — PROVISÓRIA: PROVISÓRIO: teor de laudo VENCIDO (lote PURI011426 (Gemini/Purifarma, fabricante 2003D04) — único laudo de MK-7 na máquina, validade 24/03/2022) — pedir laudo novo e recalcular a massa
- Cobre — PROVISÓRIA: PROVISÓRIO — teor assumido (0,9 mg / 0,3002 = 2,998 mg (assumido))
- Magnésio — PROVISÓRIA: PROVISÓRIO — teor assumido (260 mg / 0,6030 = 431,15 mg de óxido de magnésio (assumido 60,30%))
- Selênio — PROVISÓRIA: PROVISÓRIO — teor assumido (0,1 mg / 0,4566 = 0,219 mg (assumido) — massa de microdose: exige pré-mistura/trituração definida pela fábrica)
- Boro — PROVISÓRIA: PROVISÓRIO — teor assumido (3 mg / 0,1134 = 26,46 mg (assumido))

Notas de linha:

- Valor energético: nenhum insumo com fator no Anexo XXII
- Sódio: calculado 3,2 mg ≤ 5 mg → não significativo, expresso como 0 (Anexo IV da IN 75)

Observações:

- Veredito esperado da reformulação: CONFORME CONDICIONADO A (laudo de óxido de magnésio; aquisição de fonte de boro autorizada com laudo; laudos de selenito de sódio e bisglicinato de cobre; laudo vigente da menaquinona-7 do lote em uso; confirmação da potência da vitamina A)
- Porção do memorial: 1 g (2 cápsulas); grupo populacional: adultos, coluna "> 19 anos" dos Anexos III e IV.

---

## ZMA (Zinco, Magnésio e Vitamina B6) (`zma-zinco-magnesio-e-vitamina-d`)

- **Fonte:** memorial de reformulação `docs/conformidade/reformulacao/zma-zinco-magnesio-e-vitamina-d.md`, harmonizado na fase 3 (JSON da fase 2 + 0 correção(ões) de harmonização)
- **Porção:** 1 g (2 cápsulas)
- **Porções por embalagem:** 30
- **Grupo populacional (%VD):** adultos (≥ 19 anos)
- **Veredito esperado da reformulação:** CONFORME CONDICIONADO A (laudo de origem Camellia sinensis da L-teanina nova; laudo novo do bisglicinato de magnésio; aquisição de tetraborato de sódio decahidratado ou frutoborato de cálcio com laudo)

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
| &nbsp;&nbsp;&nbsp;&nbsp;L-teanina ⚠ | 150 mg |  |
| Gorduras totais | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras saturadas | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras trans | 0 g | 0% |
| Fibras alimentares | 0 g | 0% |
| Sódio | 0 mg | 0% |
| Vitamina D | 25 µg | 167% |
| Vitamina B6 | 1,3 mg | 100% |
| Magnésio ⚠ | 151 mg | 36% |
| Zinco | 15 mg | 136% |
| Boro ⚠ | 3 mg |  |

*Percentual de valores diários fornecidos pela porção

Bloco de texto para a arte:

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
  L-teanina | 150 mg | 
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | 0 g | 0%
Sódio | 0 mg | 0%
Vitamina D | 25 µg | 167%
Vitamina B6 | 1,3 mg | 100%
Magnésio | 151 mg | 36%
Zinco | 15 mg | 136%
Boro | 3 mg | 
*Percentual de valores diários fornecidos pela porção
```

**Linhas PENDENTES / PROVISÓRIAS (⚠) e o motivo:**

- Valor energético — PROVISÓRIA: critério único (pendente do RT): só itens com fator no Anexo XXII — nenhum item com fator = 0 kcal; NÃO contados: L-teanina de folhas de Camellia sinensis
- Proteínas — PROVISÓRIA: critério único (pendente do RT): aminoácidos livres (L-teanina = 150 mg) não contam como proteína (se contassem: 0,15 g); Anexo IV da IN 75 (lido em 16/09/2026): a expressão '0' para proteínas só é admitida sem aminoácido declarado com valor diferente de zero — a redação final desta linha depende do critério do RT
- L-teanina — PROVISÓRIA: declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)
- Magnésio — PROVISÓRIA: PROVISÓRIO: teor de laudo VENCIDO (lote 90844 (Analitic, fabricante 66342023062230), validade 21/06/2025) — pedir laudo novo e recalcular a massa
- Boro — PROVISÓRIA: PROVISÓRIO — teor assumido (3 mg / 0,1134 = 26,46 mg (assumido))

Notas de linha:

- Sódio: calculado 3,2 mg ≤ 5 mg → não significativo, expresso como 0 (Anexo IV da IN 75)
- Magnésio: valor antes do arredondamento: 151,1 mg → declarado 151 mg (Anexo III da IN 75; %VD sobre o valor declarado)

Observações:

- Veredito esperado da reformulação: CONFORME CONDICIONADO A (laudo de origem Camellia sinensis da L-teanina nova; laudo novo do bisglicinato de magnésio; aquisição de tetraborato de sódio decahidratado ou frutoborato de cálcio com laudo)
- Porção do memorial: 1 g (2 cápsulas); grupo populacional: adultos, coluna "> 19 anos" dos Anexos III e IV.

---

## Biotina em Cápsula (`biotina-em-capsula`)

- **Fonte:** memorial de reformulação `docs/conformidade/reformulacao/biotina-em-capsula.md`, harmonizado na fase 3 (JSON da fase 2 + 0 correção(ões) de harmonização)
- **Porção:** 1 g (2 cápsulas)
- **Porções por embalagem:** 30
- **Grupo populacional (%VD):** adultos (≥ 19 anos)
- **Veredito esperado da reformulação:** CONFORME CONDICIONADO A (laudos de selenito de sódio e bisglicinato de cobre; declaração de origem fermentativa do hialuronato de sódio; confirmação da potência da vitamina A)

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
| &nbsp;&nbsp;&nbsp;&nbsp;L-metionina ⚠ | 110 mg |  |
| &nbsp;&nbsp;&nbsp;&nbsp;L-cisteína ⚠ | 76 mg |  |
| Gorduras totais | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras saturadas | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras trans | 0 g | 0% |
| Fibras alimentares | 0 g | 0% |
| Sódio | 0 mg | 0% |
| Vitamina A | 1.500 µg RAE | 188% |
| Vitamina D | 40 µg | 267% |
| Vitamina E | 15 mg | 100% |
| Vitamina C | 250 mg | 250% |
| Riboflavina | 2,4 mg | 200% |
| Niacina | 31 mg NE | 207% |
| Ácido pantotênico | 5 mg | 100% |
| Vitamina B6 | 8,2 mg | 631% |
| Biotina | 40 µg | 133% |
| Ácido fólico | 667 µg DFE | 167% |
| Vitamina B12 | 8 µg | 333% |
| Cobre ⚠ | 900 µg | 100% |
| Iodo | 150 µg | 100% |
| Selênio ⚠ | 60 µg | 100% |
| Zinco | 15 mg | 136% |
| Metilsulfonilmetano | 50 mg |  |
| Ácido hialurônico ⚠ | 50 mg |  |
| Silício | 0,72 mg |  |

*Percentual de valores diários fornecidos pela porção

Bloco de texto para a arte:

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
  L-metionina | 110 mg | 
  L-cisteína | 76 mg | 
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | 0 g | 0%
Sódio | 0 mg | 0%
Vitamina A | 1.500 µg RAE | 188%
Vitamina D | 40 µg | 267%
Vitamina E | 15 mg | 100%
Vitamina C | 250 mg | 250%
Riboflavina | 2,4 mg | 200%
Niacina | 31 mg NE | 207%
Ácido pantotênico | 5 mg | 100%
Vitamina B6 | 8,2 mg | 631%
Biotina | 40 µg | 133%
Ácido fólico | 667 µg DFE | 167%
Vitamina B12 | 8 µg | 333%
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

- Valor energético — PROVISÓRIA: critério único (pendente do RT): só itens com fator no Anexo XXII — maltodextrina (carreador do Siliciumax, 95 %) 0,048 g × 4 = 0,19 kcal; NÃO contados: Cloridrato de L-cisteína, anidro, Hialuronato de sódio, L-Metionina, Metilsulfonilmetano
- Proteínas — PROVISÓRIA: critério único (pendente do RT): aminoácidos livres (L-metionina, L-cisteína = 186,44 mg) não contam como proteína (se contassem: 0,186 g); Anexo IV da IN 75 (lido em 16/09/2026): a expressão '0' para proteínas só é admitida sem aminoácido declarado com valor diferente de zero — a redação final desta linha depende do critério do RT
- L-metionina — PROVISÓRIA: declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)
- L-cisteína — PROVISÓRIA: declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)
- Cobre — PROVISÓRIA: PROVISÓRIO — teor assumido (0,9 mg / 0,3002 = 2,998 mg (assumido))
- Selênio — PROVISÓRIA: PROVISÓRIO — teor assumido (0,06 mg / 0,4566 = 0,131 mg (assumido) — microdose: pré-mistura definida pela fábrica)
- Ácido hialurônico — PROVISÓRIA: mantido — PENDENTE declaração de origem: dose do rótulo (31,7% do teto). O laudo não declara processo de obtenção nem cepa; a Lemon Caps já reprovou outro lote (225412, parecer PAR-LAU-2026-003) pela mesma lacuna. Fica condicionado à declaração do fabricante.

Notas de linha:

- Valor energético: calculado 0,19 kcal ≤ 4 kcal → não significativo, expresso como 0 (Anexo IV da IN 75)
- Carboidratos: maltodextrina 0,048 g; calculado 0,048 g ≤ 0,5 g → não significativo, expresso como 0 (Anexo IV da IN 75)
- L-cisteína: valor antes do arredondamento: 76,44 mg → declarado 76 mg (Anexo III da IN 75; %VD sobre o valor declarado)
- Sódio: calculado 2,9 mg ≤ 5 mg → não significativo, expresso como 0 (Anexo IV da IN 75)
- Vitamina E: valor antes do arredondamento: 15,29 mg → declarado 15 mg (Anexo III da IN 75; %VD sobre o valor declarado)
- Vitamina B6: valor antes do arredondamento: 8,22 mg → declarado 8,2 mg (Anexo III da IN 75; %VD sobre o valor declarado)
- Ácido fólico: valor antes do arredondamento: 666,67 µg DFE → declarado 667 µg DFE (Anexo III da IN 75; %VD sobre o valor declarado)
- Silício: valor antes do arredondamento: 0,71 mg → declarado 0,72 mg (Anexo III da IN 75; %VD sobre o valor declarado)

Observações:

- Veredito esperado da reformulação: CONFORME CONDICIONADO A (laudos de selenito de sódio e bisglicinato de cobre; declaração de origem fermentativa do hialuronato de sódio; confirmação da potência da vitamina A)
- Porção do memorial: 1 g (2 cápsulas); grupo populacional: adultos, coluna "> 19 anos" dos Anexos III e IV.

---

## Dores Musculares (Nuviart) (`dores-musculares`)

- **Fonte:** memorial de reformulação `docs/conformidade/reformulacao/dores-musculares.md`, harmonizado na fase 3 (JSON da fase 2 + 0 correção(ões) de harmonização)
- **Porção:** 1 g (2 cápsulas)
- **Porções por embalagem:** 30
- **Grupo populacional (%VD):** adultos (≥ 19 anos)
- **Veredito esperado da reformulação:** CONFORME CONDICIONADO A (ficha do fabricante do colágeno tipo II; identidade do ferro; laudos de óxido de magnésio e selenito de sódio; declaração de origem da glucosamina)

**INFORMAÇÃO NUTRICIONAL**

Porções por embalagem: 30  
Porção: 1 g (2 cápsulas)

| | 1 g | %VD* |
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
| Sódio | 0 mg | 0% |
| Vitamina D | 40 µg | 267% |
| Vitamina E | 20 mg | 133% |
| Vitamina C | 140 mg | 140% |
| Vitamina B6 | 1,3 mg | 100% |
| Vitamina B12 | 8 µg | 333% |
| Ferro ⚠ | 8 mg | 57% |
| Magnésio ⚠ | 70 mg | 17% |
| Selênio ⚠ | 100 µg | 167% |
| Zinco | 10 mg | 91% |
| Metilsulfonilmetano | 250 mg |  |
| Glucosamina | 118 mg |  |
| Colágeno tipo II não desnaturado ⚠ | 40 mg |  |

*Percentual de valores diários fornecidos pela porção

Bloco de texto para a arte:

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
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | 0 g | 0%
Sódio | 0 mg | 0%
Vitamina D | 40 µg | 267%
Vitamina E | 20 mg | 133%
Vitamina C | 140 mg | 140%
Vitamina B6 | 1,3 mg | 100%
Vitamina B12 | 8 µg | 333%
Ferro | 8 mg | 57%
Magnésio | 70 mg | 17%
Selênio | 100 µg | 167%
Zinco | 10 mg | 91%
Metilsulfonilmetano | 250 mg | 
Glucosamina | 118 mg | 
Colágeno tipo II não desnaturado | 40 mg | 
*Percentual de valores diários fornecidos pela porção
```

**Linhas PENDENTES / PROVISÓRIAS (⚠) e o motivo:**

- Valor energético — PROVISÓRIA: critério único (pendente do RT): só itens com fator no Anexo XXII — colágeno tipo II (proteína 67,6 % do laudo) 0,027 g × 4 = 0,108 kcal; NÃO contados: Metilsulfonilmetano, Sulfato de glucosamina com cloreto de potássio
- Ferro — PROVISÓRIA: PROVISÓRIO — laudo
- Magnésio — PROVISÓRIA: PROVISÓRIO — teor assumido (70 mg / 0,6030 = 116,08 mg (assumido))
- Selênio — PROVISÓRIA: PROVISÓRIO — teor assumido (0,1 mg / 0,4566 = 0,219 mg (assumido) — microdose: pré-mistura definida pela fábrica)
- Colágeno tipo II não desnaturado — PROVISÓRIA: mantido — PENDENTE identidade: 40 mg (33× o mínimo). O Anexo I autoriza duas coisas distintas: 'Colágeno Tipo II' em Proteínas (mín. 8,4 g) e 'colágeno de frango com colágeno tipo II não desnaturado' (mín. 1,2 mg). O produto só é conforme no segundo enquadramento, e o la

Notas de linha:

- Valor energético: calculado 0,108 kcal ≤ 4 kcal → não significativo, expresso como 0 (Anexo IV da IN 75)
- Proteínas: colágeno tipo II (proteína 67,6 % do laudo) 0,027 g × 4; calculado 0,027 g ≤ 0,5 g → não significativo, expresso como 0 (Anexo IV da IN 75)
- Sódio: calculado 0,06 mg ≤ 5 mg → não significativo, expresso como 0 (Anexo IV da IN 75)
- Vitamina E: valor antes do arredondamento: 20,38 mg → declarado 20 mg (Anexo III da IN 75; %VD sobre o valor declarado)
- Glucosamina: valor antes do arredondamento: 118,36 mg → declarado 118 mg (Anexo III da IN 75; %VD sobre o valor declarado)

Observações:

- Veredito esperado da reformulação: CONFORME CONDICIONADO A (ficha do fabricante do colágeno tipo II; identidade do ferro; laudos de óxido de magnésio e selenito de sódio; declaração de origem da glucosamina)
- Porção do memorial: 1 g (2 cápsulas); grupo populacional: adultos, coluna "> 19 anos" dos Anexos III e IV.

---

## Focus Colina (`focus-colina`)

- **Fonte:** memorial de reformulação `docs/conformidade/reformulacao/focus-colina.md`, harmonizado na fase 3 (JSON da fase 2 + 6 correção(ões) de harmonização)
- **Porção:** 1 g (2 cápsulas)
- **Porções por embalagem:** 30
- **Grupo populacional (%VD):** adultos (≥ 19 anos)
- **Veredito esperado da reformulação:** CONFORME CONDICIONADO A (laudo de origem Camellia sinensis da L-teanina nova; laudo de óxido de magnésio) — com a decisão do dono sobre a dose de colina (130 mg em 2 cápsulas)

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
| &nbsp;&nbsp;&nbsp;&nbsp;L-tirosina ⚠ | 290 mg |  |
| &nbsp;&nbsp;&nbsp;&nbsp;L-teanina ⚠ | 115 mg |  |
| Gorduras totais | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras saturadas | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras trans | 0 g | 0% |
| Fibras alimentares | 0 g | 0% |
| Sódio | 0 mg | 0% |
| Vitamina D | 5 µg | 33% |
| Vitamina B6 | 1,3 mg | 100% |
| Vitamina B12 | 2,4 µg | 100% |
| Magnésio ⚠ | 70 mg | 17% |
| Colina | 130 mg | 24% |
| L-carnitina ⚠ | 95 mg |  |
| Inositol | 25 mg |  |

*Percentual de valores diários fornecidos pela porção

Bloco de texto para a arte:

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
  L-tirosina | 290 mg | 
  L-teanina | 115 mg | 
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | 0 g | 0%
Sódio | 0 mg | 0%
Vitamina D | 5 µg | 33%
Vitamina B6 | 1,3 mg | 100%
Vitamina B12 | 2,4 µg | 100%
Magnésio | 70 mg | 17%
Colina | 130 mg | 24%
L-carnitina | 95 mg | 
Inositol | 25 mg | 
*Percentual de valores diários fornecidos pela porção
```

**Linhas PENDENTES / PROVISÓRIAS (⚠) e o motivo:**

- Valor energético — PROVISÓRIA: critério único (pendente do RT): só itens com fator no Anexo XXII — nenhum item com fator = 0 kcal; NÃO contados: Bitartarato de colina/Hidrogênio tartarato de colina, Inositol, L-Tirosina, L-teanina de folhas de Camellia sinensis, Levocarnitina/L-carnitina
- Proteínas — PROVISÓRIA: critério único (pendente do RT): aminoácidos livres (L-tirosina, L-teanina = 405 mg) não contam como proteína (se contassem: 0,405 g); Anexo IV da IN 75 (lido em 16/09/2026): a expressão '0' para proteínas só é admitida sem aminoácido declarado com valor diferente de zero — a redação final desta linha depende do critério do RT
- L-tirosina — PROVISÓRIA: declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)
- L-teanina — PROVISÓRIA: declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)
- Magnésio — PROVISÓRIA: PROVISÓRIO — teor assumido (70 mg / 0,6030 = 116,08 mg (assumido))
- L-carnitina — PROVISÓRIA: declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)

Observações:

- Veredito esperado da reformulação: CONFORME CONDICIONADO A (laudo de origem Camellia sinensis da L-teanina nova; laudo de óxido de magnésio) — com a decisão do dono sobre a dose de colina (130 mg em 2 cápsulas)
- Porção do memorial: 1 g (2 cápsulas); grupo populacional: adultos, coluna "> 19 anos" dos Anexos III e IV.

---

## Multi Vitta — Gestante e Lactante em Cápsula (`multi-vitta-gestante-e-lactante-em-capsula`)

- **Fonte:** memorial de reformulação `docs/conformidade/reformulacao/multi-vitta-gestante-e-lactante-em-capsula.md`, harmonizado na fase 3 (JSON da fase 2 + 6 correção(ões) de harmonização)
- **Porção:** 1 g (2 cápsulas)
- **Porções por embalagem:** 30
- **Grupo populacional (%VD):** gestantes e lactantes (duas colunas)
- **Veredito esperado da reformulação:** CONFORME CONDICIONADO A (laudo novo do bisglicinato de magnésio; laudos de bisglicinato ferroso e bisglicinato de cobre; emissão do memorial de cálculo pelo RT) — e à decisão do dono sobre completar ou não os nutrientes citados sem dose

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
| Sódio | 0 mg | 0% | 0% |
| Vitamina D | 40 µg | 267% | 267% |
| Vitamina E | 5 mg | 33% | 33% |
| Vitamina C | 20 mg | 24% | 17% |
| Niacina | 8 mg NE | 44% | 47% |
| Ácido pantotênico | 4,5 mg | 75% | 64% |
| Ácido fólico | 833 µg DFE | 139% | 167% |
| Vitamina B12 | 8 µg | 308% | 286% |
| Cálcio | 215 mg | 17% | 17% |
| Cobre ⚠ | 900 µg | 90% | 69% |
| Ferro ⚠ | 8,1 mg | 30% | 81% |
| Magnésio ⚠ | 66 mg | 17% | 18% |

*Percentual de valores diários fornecidos pela porção

Bloco de texto para a arte:

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
Vitamina D | 40 µg | 267% | 267%
Vitamina E | 5 mg | 33% | 33%
Vitamina C | 20 mg | 24% | 17%
Niacina | 8 mg NE | 44% | 47%
Ácido pantotênico | 4,5 mg | 75% | 64%
Ácido fólico | 833 µg DFE | 139% | 167%
Vitamina B12 | 8 µg | 308% | 286%
Cálcio | 215 mg | 17% | 17%
Cobre | 900 µg | 90% | 69%
Ferro | 8,1 mg | 30% | 81%
Magnésio | 66 mg | 17% | 18%
*Percentual de valores diários fornecidos pela porção
```

**Linhas PENDENTES / PROVISÓRIAS (⚠) e o motivo:**

- Cobre — PROVISÓRIA: PROVISÓRIO — teor assumido (0,9 mg / 0,3002 = 2,998 mg (assumido))
- Ferro — PROVISÓRIA: PROVISÓRIO — laudo NaturalPRO NPT.0525/710 (Fe 20,1 %; identidade química não declarada) — harmonizado na fase 3 com o Dores Musculares
- Magnésio — PROVISÓRIA: PROVISÓRIO: teor de laudo VENCIDO (lote 90844 (Analitic, fabricante 66342023062230), validade 21/06/2025) — pedir laudo novo e recalcular a massa

Notas de linha:

- Valor energético: nenhum insumo com fator no Anexo XXII
- Ácido fólico: valor antes do arredondamento: 833,33 µg DFE → declarado 833 µg DFE (Anexo III da IN 75; %VD sobre o valor declarado)

Observações:

- Veredito esperado da reformulação: CONFORME CONDICIONADO A (laudo novo do bisglicinato de magnésio; laudos de bisglicinato ferroso e bisglicinato de cobre; emissão do memorial de cálculo pelo RT) — e à decisão do dono sobre completar ou não os nutrientes citados sem dose
- Porção do memorial: 1 g (2 cápsulas); grupo populacional: gestantes e lactantes — colunas "Gestantes" e "Lactantes" dos Anexos III e IV, aplicada a mais restritiva das duas a cada constituinte (mínimo = maior dos mínimos; máximo = menor dos máximos).

---

## Melatonina + Triptofanos (Encapsulados) (`melatonina-triptofanos-encapsulados`)

- **Fonte:** memorial de reformulação `docs/conformidade/reformulacao/melatonina-triptofanos-encapsulados.md`, harmonizado na fase 3 (JSON da fase 2 + 6 correção(ões) de harmonização)
- **Porção:** 1 g (2 cápsulas)
- **Porções por embalagem:** 30
- **Grupo populacional (%VD):** adultos (≥ 19 anos)
- **Veredito esperado da reformulação:** CONFORME CONDICIONADO A (laudo vigente de melatonina; laudo novo de bisglicinato de magnésio; laudo de ácido L-aspártico ou sua retirada; laudo de L-triptofano do lote a usar; emissão do memorial de cálculo pelo RT)

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
| &nbsp;&nbsp;&nbsp;&nbsp;L-triptofano ⚠ | 500 mg |  |
| &nbsp;&nbsp;&nbsp;&nbsp;L-glutamina ⚠ | 95 mg |  |
| &nbsp;&nbsp;&nbsp;&nbsp;Ácido L-aspártico ⚠ | 100 mg |  |
| Gorduras totais | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras saturadas | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras trans | 0 g | 0% |
| Fibras alimentares | 0 g | 0% |
| Sódio | 0 mg | 0% |
| Biotina | 40 µg | 133% |
| Magnésio ⚠ | 70 mg | 17% |
| Zinco | 10 mg | 91% |
| Melatonina ⚠ | 0,18 mg |  |

*Percentual de valores diários fornecidos pela porção

Bloco de texto para a arte:

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
  L-triptofano | 500 mg | 
  L-glutamina | 95 mg | 
  Ácido L-aspártico | 100 mg | 
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | 0 g | 0%
Sódio | 0 mg | 0%
Biotina | 40 µg | 133%
Magnésio | 70 mg | 17%
Zinco | 10 mg | 91%
Melatonina | 0,18 mg | 
*Percentual de valores diários fornecidos pela porção
```

**Linhas PENDENTES / PROVISÓRIAS (⚠) e o motivo:**

- Valor energético — PROVISÓRIA: critério único (pendente do RT): só itens com fator no Anexo XXII — nenhum item com fator = 0 kcal; NÃO contados: L-Glutamina, L-Triptofano, Ácido L-aspártico
- Proteínas — PROVISÓRIA: critério único (pendente do RT): aminoácidos livres (L-triptofano, Ácido L-aspártico, L-glutamina = 695 mg) não contam como proteína (se contassem: 0,695 g); Anexo IV da IN 75 (lido em 16/09/2026): a expressão '0' para proteínas só é admitida sem aminoácido declarado com valor diferente de zero — a redação final desta linha depende do critério do RT
- L-triptofano — PROVISÓRIA: declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)
- L-glutamina — PROVISÓRIA: declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)
- Ácido L-aspártico — PROVISÓRIA: declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)
- Magnésio — PROVISÓRIA: PROVISÓRIO: teor de laudo VENCIDO (lote 90844 (Analitic, fabricante 66342023062230), validade 21/06/2025) — pedir laudo novo e recalcular a massa
- Melatonina — PROVISÓRIA: PROVISÓRIO: teor de laudo VENCIDO (lote 950151 (Analitic, fabricante MCS211210) — os 5 laudos de melatonina da máquina estão vencidos, validade 09/12/2024) — pedir laudo novo e recalcular a massa

Observações:

- Veredito esperado da reformulação: CONFORME CONDICIONADO A (laudo vigente de melatonina; laudo novo de bisglicinato de magnésio; laudo de ácido L-aspártico ou sua retirada; laudo de L-triptofano do lote a usar; emissão do memorial de cálculo pelo RT)
- Porção do memorial: 1 g (2 cápsulas); grupo populacional: adultos, coluna "> 19 anos" dos Anexos III e IV (a melatonina é 'NA' em todos os outros grupos).

---

## Serena (`serena`)

- **Fonte:** memorial de reformulação `docs/conformidade/reformulacao/serena.md`, harmonizado na fase 3 (JSON da fase 2 + 0 correção(ões) de harmonização)
- **Porção:** 1 mL (20 gotas)
- **Porções por embalagem:** 30
- **Grupo populacional (%VD):** adultos (≥ 19 anos)
- **Veredito esperado da reformulação:** CONFORME CONDICIONADO A (laudo de origem Camellia sinensis da L-teanina nova; laudo vigente de melatonina; laudo novo de cloreto de magnésio; massas do veículo e dos aditivos registradas)

**INFORMAÇÃO NUTRICIONAL**

Porções por embalagem: 30  
Porção: 1 mL (20 gotas)

| | 1 mL | %VD* |
|---|---|---|
| Valor energético ⚠ | 0 kcal = 0 kJ | 0% |
| Carboidratos | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Açúcares totais | 0 g |  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Açúcares adicionados | 0 g | 0% |
| Proteínas ⚠ | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;L-teanina ⚠ | 60 mg |  |
| Gorduras totais | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras saturadas | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras trans | 0 g | 0% |
| Fibras alimentares | 0 g | 0% |
| Sódio | 0 mg | 0% |
| Vitamina B6 | 1,3 mg | 100% |
| Magnésio | 70 mg | 17% |
| Melatonina ⚠ | 0,18 mg |  |
| Inositol | 50 mg |  |

*Percentual de valores diários fornecidos pela porção

Bloco de texto para a arte:

```
INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 1 mL (20 gotas)
 | 1 mL | %VD*
Valor energético | 0 kcal = 0 kJ | 0%
Carboidratos | 0 g | 0%
  Açúcares totais | 0 g | 
    Açúcares adicionados | 0 g | 0%
Proteínas | 0 g | 0%
  L-teanina | 60 mg | 
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | 0 g | 0%
Sódio | 0 mg | 0%
Vitamina B6 | 1,3 mg | 100%
Magnésio | 70 mg | 17%
Melatonina | 0,18 mg | 
Inositol | 50 mg | 
*Percentual de valores diários fornecidos pela porção
```

**Linhas PENDENTES / PROVISÓRIAS (⚠) e o motivo:**

- Valor energético — PROVISÓRIA: critério único (pendente do RT): só itens com fator no Anexo XXII — nenhum item com fator = 0 kcal; NÃO contados: Glicerina vegetal, Inositol, L-teanina de folhas de Camellia sinensis
- Proteínas — PROVISÓRIA: critério único (pendente do RT): aminoácidos livres (L-teanina = 60 mg) não contam como proteína (se contassem: 0,06 g); Anexo IV da IN 75 (lido em 16/09/2026): a expressão '0' para proteínas só é admitida sem aminoácido declarado com valor diferente de zero — a redação final desta linha depende do critério do RT
- L-teanina — PROVISÓRIA: declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)
- Melatonina — PROVISÓRIA: PROVISÓRIO: teor de laudo VENCIDO (lote 950151 (Analitic, fabricante MCS211210) — os 5 laudos de melatonina da máquina estão vencidos, validade 09/12/2024) — pedir laudo novo e recalcular a massa

Notas de linha:

- Sódio: calculado 0,32 mg ≤ 5 mg → não significativo, expresso como 0 (Anexo IV da IN 75)

Observações:

- Veredito esperado da reformulação: CONFORME CONDICIONADO A (laudo de origem Camellia sinensis da L-teanina nova; laudo vigente de melatonina; laudo novo de cloreto de magnésio; massas do veículo e dos aditivos registradas)
- Porção do memorial: 1 mL (20 gotas); grupo populacional: adultos, coluna "> 19 anos" dos Anexos III e IV (a melatonina é 'NA' nos demais grupos).
- Itens com fator no Anexo XXII sem massa no memorial (não entram na conta): Citrato de sódio.

---

## Detox Matinal (Lemon Shot) 300 g (`detox-matinal-lemon-shot-300g`)

- **Fonte:** memorial de reformulação `docs/conformidade/reformulacao/detox-matinal-lemon-shot-300g.md`, harmonizado na fase 3 (JSON da fase 2 + 0 correção(ões) de harmonização)
- **Porção:** 10 g (1 dose)
- **Porções por embalagem:** 30
- **Grupo populacional (%VD):** adultos (≥ 19 anos)
- **Veredito esperado da reformulação:** CONFORME CONDICIONADO A (laudo válido do lote de café verde efetivamente usado; laudo novo da maltodextrina; identificação do corante; posição do RT sobre a exigência de fabricante do painel para café verde e laranja moro)

**INFORMAÇÃO NUTRICIONAL**

Porções por embalagem: 30  
Porção: 10 g (1 dose)

| | 10 g | %VD* |
|---|---|---|
| Valor energético | 29 kcal = 121 kJ | 1% |
| Carboidratos | 6,7 g | 2% |
| &nbsp;&nbsp;&nbsp;&nbsp;Açúcares totais | 0 g |  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Açúcares adicionados | 0 g | 0% |
| Proteínas | 0 g | 0% |
| Gorduras totais | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras saturadas | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras trans | 0 g | 0% |
| Fibras alimentares | 0 g | 0% |
| Sódio | 0 mg | 0% |
| Vitamina C | 1.600 mg | 1600% |
| Zinco | 2,2 mg | 20% |
| Ácido clorogênico | 256 mg |  |
| Antocianinas da laranja moro | 1,5 mg |  |

*Percentual de valores diários fornecidos pela porção

Bloco de texto para a arte:

```
INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 10 g (1 dose)
 | 10 g | %VD*
Valor energético | 29 kcal = 121 kJ | 1%
Carboidratos | 6,7 g | 2%
  Açúcares totais | 0 g | 
    Açúcares adicionados | 0 g | 0%
Proteínas | 0 g | 0%
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | 0 g | 0%
Sódio | 0 mg | 0%
Vitamina C | 1.600 mg | 1600%
Zinco | 2,2 mg | 20%
Ácido clorogênico | 256 mg | 
Antocianinas da laranja moro | 1,5 mg | 
*Percentual de valores diários fornecidos pela porção
```

Nenhuma linha pendente ou provisória.

Notas de linha:

- Carboidratos: maltodextrina 6,714 g; valor antes do arredondamento: 6,71 g → declarado 6,7 g (Anexo III da IN 75; %VD sobre o valor declarado)
- Açúcares totais: PROVISÓRIO — depende do laudo da maltodextrina (teor de mono e dissacarídeos)
- Ácido clorogênico: valor antes do arredondamento: 256,2 mg → declarado 256 mg (Anexo III da IN 75; %VD sobre o valor declarado)
- Antocianinas da laranja moro: valor antes do arredondamento: 1,47 mg → declarado 1,5 mg (Anexo III da IN 75; %VD sobre o valor declarado)

Observações:

- Veredito esperado da reformulação: CONFORME CONDICIONADO A (laudo válido do lote de café verde efetivamente usado; laudo novo da maltodextrina; identificação do corante; posição do RT sobre a exigência de fabricante do painel para café verde e laranja moro)
- Porção do memorial: 10 g (1 dose) diluída em 200 mL de água, 1 vez ao dia; grupo populacional: adultos (> 19 anos).

---

## Saúde Intestinal (Floravex) (`saude-intestinal`)

- **Fonte:** memorial de reformulação `docs/conformidade/reformulacao/saude-intestinal.md`, harmonizado na fase 3 (JSON da fase 2 + 0 correção(ões) de harmonização)
- **Porção:** 1 g (2 cápsulas)
- **Porções por embalagem:** 30
- **Grupo populacional (%VD):** adultos (≥ 19 anos)
- **Veredito esperado da reformulação:** CONFORME CONDICIONADO A (laudos novos de bisglicinato de magnésio e de quercetina; validade do laudo da vitamina A; definição do excipiente/cápsula pela fábrica)

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
| &nbsp;&nbsp;&nbsp;&nbsp;L-glutamina ⚠ | 135 mg |  |
| Gorduras totais | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras saturadas | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras trans | 0 g | 0% |
| Fibras alimentares | 0 g | 0% |
| Sódio | 0 mg | 0% |
| Vitamina A | 540 µg RAE | 68% |
| Vitamina B6 | 1,3 mg | 100% |
| Magnésio ⚠ | 90 mg | 21% |
| Zinco | 14 mg | 127% |
| Quercetina ⚠ | 69 mg |  |

*Percentual de valores diários fornecidos pela porção

Bloco de texto para a arte:

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
  L-glutamina | 135 mg | 
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | 0 g | 0%
Sódio | 0 mg | 0%
Vitamina A | 540 µg RAE | 68%
Vitamina B6 | 1,3 mg | 100%
Magnésio | 90 mg | 21%
Zinco | 14 mg | 127%
Quercetina | 69 mg | 
*Percentual de valores diários fornecidos pela porção
```

**Linhas PENDENTES / PROVISÓRIAS (⚠) e o motivo:**

- Valor energético — PROVISÓRIA: critério único (pendente do RT): só itens com fator no Anexo XXII — maltodextrina 0,417 g × 4 = 1,668 kcal; NÃO contados: L-glutamina, INLAB ref. A100020, lote interno 950334 Glutamina
- Proteínas — PROVISÓRIA: critério único (pendente do RT): aminoácidos livres (L-glutamina = 135 mg) não contam como proteína (se contassem: 0,135 g); Anexo IV da IN 75 (lido em 16/09/2026): a expressão '0' para proteínas só é admitida sem aminoácido declarado com valor diferente de zero — a redação final desta linha depende do critério do RT
- L-glutamina — PROVISÓRIA: declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)
- Magnésio — PROVISÓRIA: PROVISÓRIO: teor de laudo VENCIDO (lote 90844 (fabricante 66342023062230), validade 21/06/2025) — pedir laudo novo e recalcular a massa
- Quercetina — PROVISÓRIA: PROVISÓRIO: teor de laudo VENCIDO (lote 873635 (INLAB), validade 06/2026) — pedir laudo novo e recalcular a massa

Notas de linha:

- Valor energético: calculado 1,668 kcal ≤ 4 kcal → não significativo, expresso como 0 (Anexo IV da IN 75)
- Carboidratos: maltodextrina 0,417 g; calculado 0,417 g ≤ 0,5 g → não significativo, expresso como 0 (Anexo IV da IN 75)
- Vitamina A: valor antes do arredondamento: 540,3 µg RAE → declarado 540 µg RAE (Anexo III da IN 75; %VD sobre o valor declarado)
- Vitamina B6: valor antes do arredondamento: 1,26 mg → declarado 1,3 mg (Anexo III da IN 75; %VD sobre o valor declarado)
- Zinco: valor antes do arredondamento: 13,5 mg → declarado 14 mg (Anexo III da IN 75; %VD sobre o valor declarado)
- Quercetina: valor antes do arredondamento: 69,16 mg → declarado 69 mg (Anexo III da IN 75; %VD sobre o valor declarado)

Observações:

- Veredito esperado da reformulação: CONFORME CONDICIONADO A (laudos novos de bisglicinato de magnésio e de quercetina; validade do laudo da vitamina A; definição do excipiente/cápsula pela fábrica)
- Porção do memorial: 2 cápsulas (1 g), 1 vez ao dia; grupo populacional: adultos (> 19 anos).

---

## Moro Slim (`moro-slim`)

- **Fonte:** memorial de reformulação `docs/conformidade/reformulacao/moro-slim.md`, harmonizado na fase 3 (JSON da fase 2 + 0 correção(ões) de harmonização)
- **Porção:** 1 g (2 cápsulas)
- **Porções por embalagem:** 30
- **Grupo populacional (%VD):** adultos (≥ 19 anos)
- **Veredito esperado da reformulação:** CONFORME CONDICIONADO A (laudo válido do lote de café verde efetivamente usado; confirmação do insumo de laranja moro em estoque; validade do laudo da vitamina A; posição do RT sobre exigência de fabricante do painel; definição do excipiente)

**INFORMAÇÃO NUTRICIONAL**

Porções por embalagem: 30  
Porção: 1 g (2 cápsulas)

| | 1 g | %VD* |
|---|---|---|
| Valor energético | 0 kcal = 0 kJ | 0% |
| Carboidratos | 0,7 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Açúcares totais | 0 g |  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Açúcares adicionados | 0 g | 0% |
| Proteínas | 0 g | 0% |
| Gorduras totais | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras saturadas | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras trans | 0 g | 0% |
| Fibras alimentares | 0 g | 0% |
| Sódio | 0 mg | 0% |
| Vitamina A | 1.500 µg RAE | 188% |
| Cromo | 200 µg | 571% |
| Ácido clorogênico | 70 mg |  |
| Antocianinas da laranja moro | 2,6 mg |  |

*Percentual de valores diários fornecidos pela porção

Bloco de texto para a arte:

```
INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 1 g (2 cápsulas)
 | 1 g | %VD*
Valor energético | 0 kcal = 0 kJ | 0%
Carboidratos | 0,7 g | 0%
  Açúcares totais | 0 g | 
    Açúcares adicionados | 0 g | 0%
Proteínas | 0 g | 0%
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | 0 g | 0%
Sódio | 0 mg | 0%
Vitamina A | 1.500 µg RAE | 188%
Cromo | 200 µg | 571%
Ácido clorogênico | 70 mg | 
Antocianinas da laranja moro | 2,6 mg | 
*Percentual de valores diários fornecidos pela porção
```

Nenhuma linha pendente ou provisória.

Notas de linha:

- Valor energético: calculado 2,798 kcal ≤ 4 kcal → não significativo, expresso como 0 (Anexo IV da IN 75)
- Carboidratos: maltodextrina 0,7 g; valor antes do arredondamento: 0,7 g → declarado 0,7 g (Anexo III da IN 75; %VD sobre o valor declarado)
- Vitamina A: valor antes do arredondamento: 1.499,8 µg RAE → declarado 1.500 µg RAE (Anexo III da IN 75; %VD sobre o valor declarado)
- Cromo: valor antes do arredondamento: 199,9 µg → declarado 200 µg (Anexo III da IN 75; %VD sobre o valor declarado)
- Ácido clorogênico: valor antes do arredondamento: 70,45 mg → declarado 70 mg (Anexo III da IN 75; %VD sobre o valor declarado)
- Antocianinas da laranja moro: valor antes do arredondamento: 2,57 mg → declarado 2,6 mg (Anexo III da IN 75; %VD sobre o valor declarado)

Observações:

- Veredito esperado da reformulação: CONFORME CONDICIONADO A (laudo válido do lote de café verde efetivamente usado; confirmação do insumo de laranja moro em estoque; validade do laudo da vitamina A; posição do RT sobre exigência de fabricante do painel; definição do excipiente)
- Porção do memorial: 2 cápsulas (1 g), 1 vez ao dia; grupo populacional: adultos (> 19 anos).

---

## Pro Energy (`pro-energy`)

- **Fonte:** memorial de reformulação `docs/conformidade/reformulacao/pro-energy.md`, harmonizado na fase 3 (JSON da fase 2 + 5 correção(ões) de harmonização)
- **Porção:** 1 g (2 cápsulas)
- **Porções por embalagem:** 30
- **Grupo populacional (%VD):** adultos (≥ 19 anos)
- **Veredito esperado da reformulação:** CONFORME CONDICIONADO A (laudo de cafeína específica e identificação do fornecedor do guaraná em pó; cópias legíveis/válidas dos laudos de cafeína anidra, taurina e L-carnitina; definição do excipiente)

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
| &nbsp;&nbsp;&nbsp;&nbsp;L-arginina ⚠ | 62 mg |  |
| Gorduras totais | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras saturadas | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras trans | 0 g | 0% |
| Fibras alimentares | 0 g | 0% |
| Sódio | 0 mg | 0% |
| Vitamina B6 | 8,2 mg | 631% |
| Zinco | 4 mg | 36% |
| Taurina ⚠ | 199 mg |  |
| L-carnitina ⚠ | 89 mg |  |
| Cafeína ⚠ | 160 mg |  |

*Percentual de valores diários fornecidos pela porção

Bloco de texto para a arte:

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
  L-arginina | 62 mg | 
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | 0 g | 0%
Sódio | 0 mg | 0%
Vitamina B6 | 8,2 mg | 631%
Zinco | 4 mg | 36%
Taurina | 199 mg | 
L-carnitina | 89 mg | 
Cafeína | 160 mg | 
*Percentual de valores diários fornecidos pela porção
```

**Linhas PENDENTES / PROVISÓRIAS (⚠) e o motivo:**

- Valor energético — PROVISÓRIA: critério único (pendente do RT): só itens com fator no Anexo XXII — maltodextrina 0,25 g × 4 = 1 kcal; NÃO contados: L-arginina HCl, Lepuge, lote AUTO035918, L-carnitina base, lote 26H14-B025-226329, L-taurina, lote 214586 Taurina
- Proteínas — PROVISÓRIA: critério único (pendente do RT): aminoácidos livres (L-arginina = 61,64 mg) não contam como proteína (se contassem: 0,062 g); Anexo IV da IN 75 (lido em 16/09/2026): a expressão '0' para proteínas só é admitida sem aminoácido declarado com valor diferente de zero — a redação final desta linha depende do critério do RT
- L-arginina — PROVISÓRIA: declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)
- Taurina — PROVISÓRIA: declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)
- L-carnitina — PROVISÓRIA: declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)
- Cafeína — PROVISÓRIA: PROVISÓRIO — cafeína total: anidra 10,22 mg + guaraná em pó ≤ 149,82 mg (metilxantinas totais do laudo, limite superior; o laudo de cafeína específica do guaraná fixa o valor)

Notas de linha:

- Valor energético: calculado 1 kcal ≤ 4 kcal → não significativo, expresso como 0 (Anexo IV da IN 75)
- Carboidratos: maltodextrina 0,25 g; calculado 0,25 g ≤ 0,5 g → não significativo, expresso como 0 (Anexo IV da IN 75)
- L-arginina: valor antes do arredondamento: 61,64 mg → declarado 62 mg (Anexo III da IN 75; %VD sobre o valor declarado)
- Vitamina B6: valor antes do arredondamento: 8,22 mg → declarado 8,2 mg (Anexo III da IN 75; %VD sobre o valor declarado)
- Zinco: valor antes do arredondamento: 3,98 mg → declarado 4 mg (Anexo III da IN 75; %VD sobre o valor declarado)
- Taurina: valor antes do arredondamento: 198,92 mg → declarado 199 mg (Anexo III da IN 75; %VD sobre o valor declarado)
- L-carnitina: valor antes do arredondamento: 89,47 mg → declarado 89 mg (Anexo III da IN 75; %VD sobre o valor declarado)
- Cafeína: valor antes do arredondamento: 160,04 mg → declarado 160 mg (Anexo III da IN 75; %VD sobre o valor declarado)

Observações:

- Veredito esperado da reformulação: CONFORME CONDICIONADO A (laudo de cafeína específica e identificação do fornecedor do guaraná em pó; cópias legíveis/válidas dos laudos de cafeína anidra, taurina e L-carnitina; definição do excipiente)
- Porção do memorial: 2 cápsulas (1 g), 1 vez ao dia; grupo populacional: adultos (> 19 anos).

---

## Emagrecedor em Cápsula (`emagrecedor-em-capsula`)

- **Fonte:** memorial de reformulação `docs/conformidade/reformulacao/emagrecedor-em-capsula.md`, harmonizado na fase 3 (JSON da fase 2 + 0 correção(ões) de harmonização)
- **Porção:** 1 g (2 cápsulas)
- **Porções por embalagem:** 30
- **Grupo populacional (%VD):** adultos (≥ 19 anos)
- **Veredito esperado da reformulação:** CONFORME CONDICIONADO A (aprovação pelo dono/RT da fórmula reconstruída e emissão de memorial de cálculo pela fábrica; laudo válido do lote de café verde; validade do laudo da vitamina A; posição do RT sobre exigência de fabricante do painel)

**INFORMAÇÃO NUTRICIONAL**

Porções por embalagem: 30  
Porção: 1 g (2 cápsulas)

| | 1 g | %VD* |
|---|---|---|
| Valor energético | 0 kcal = 0 kJ | 0% |
| Carboidratos | 0,9 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Açúcares totais | 0 g |  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Açúcares adicionados | 0 g | 0% |
| Proteínas | 0 g | 0% |
| Gorduras totais | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras saturadas | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras trans | 0 g | 0% |
| Fibras alimentares | 0 g | 0% |
| Sódio | 0 mg | 0% |
| Vitamina A | 1.500 µg RAE | 188% |
| Cromo | 200 µg | 571% |
| Ácido clorogênico | 64 mg |  |
| Antocianinas da laranja moro | 0,07 mg |  |

*Percentual de valores diários fornecidos pela porção

Bloco de texto para a arte:

```
INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 1 g (2 cápsulas)
 | 1 g | %VD*
Valor energético | 0 kcal = 0 kJ | 0%
Carboidratos | 0,9 g | 0%
  Açúcares totais | 0 g | 
    Açúcares adicionados | 0 g | 0%
Proteínas | 0 g | 0%
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | 0 g | 0%
Sódio | 0 mg | 0%
Vitamina A | 1.500 µg RAE | 188%
Cromo | 200 µg | 571%
Ácido clorogênico | 64 mg | 
Antocianinas da laranja moro | 0,07 mg | 
*Percentual de valores diários fornecidos pela porção
```

Nenhuma linha pendente ou provisória.

Notas de linha:

- Valor energético: calculado 3,518 kcal ≤ 4 kcal → não significativo, expresso como 0 (Anexo IV da IN 75)
- Carboidratos: maltodextrina 0,88 g; valor antes do arredondamento: 0,88 g → declarado 0,9 g (Anexo III da IN 75; %VD sobre o valor declarado)
- Vitamina A: valor antes do arredondamento: 1.499,8 µg RAE → declarado 1.500 µg RAE (Anexo III da IN 75; %VD sobre o valor declarado)
- Cromo: valor antes do arredondamento: 199,9 µg → declarado 200 µg (Anexo III da IN 75; %VD sobre o valor declarado)
- Ácido clorogênico: valor antes do arredondamento: 64,05 mg → declarado 64 mg (Anexo III da IN 75; %VD sobre o valor declarado)
- Antocianinas da laranja moro: valor antes do arredondamento: 0,07 mg → declarado 0,07 mg (Anexo III da IN 75; %VD sobre o valor declarado)

Observações:

- Veredito esperado da reformulação: CONFORME CONDICIONADO A (aprovação pelo dono/RT da fórmula reconstruída e emissão de memorial de cálculo pela fábrica; laudo válido do lote de café verde; validade do laudo da vitamina A; posição do RT sobre exigência de fabricante do painel)
- Porção do memorial: 2 cápsulas (1 g), 1 vez ao dia; grupo populacional: adultos (> 19 anos).

---

## Slim Up — Emagrecimento em Gota (`slim-up-emagrecimento-em-gota`)

- **Fonte:** memorial de reformulação `docs/conformidade/reformulacao/slim-up-emagrecimento-em-gota.md`, harmonizado na fase 3 (JSON da fase 2 + 1 correção(ões) de harmonização)
- **Porção:** 1 mL (30 gotas)
- **Porções por embalagem:** 30
- **Grupo populacional (%VD):** adultos (≥ 19 anos)
- **Veredito esperado da reformulação:** CONFORME CONDICIONADO A (definição da porção pelo dono — 1 mL × 2 mL; viabilidade técnica da colina a 221,62 mg/mL confirmada pela fábrica; laudo válido do lote de café verde; laudo do sorbitol líquido e identidade do espessante; conferência dos aditivos para suplemento líquido)

**INFORMAÇÃO NUTRICIONAL**

Porções por embalagem: 30  
Porção: 1 mL (30 gotas)

| | 1 mL | %VD* |
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
| Sódio | 0 mg | 0% |
| Vitamina D | 45 µg | 300% |
| Vitamina B12 | 8 µg | 333% |
| Cromo | 31 µg | 89% |
| Colina | 90 mg | 16% |
| Ácido clorogênico | 32 mg |  |

*Percentual de valores diários fornecidos pela porção

Bloco de texto para a arte:

```
INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 1 mL (30 gotas)
 | 1 mL | %VD*
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
Vitamina D | 45 µg | 300%
Vitamina B12 | 8 µg | 333%
Cromo | 31 µg | 89%
Colina | 90 mg | 16%
Ácido clorogênico | 32 mg | 
*Percentual de valores diários fornecidos pela porção
```

**Linhas PENDENTES / PROVISÓRIAS (⚠) e o motivo:**

- Valor energético — PROVISÓRIA: critério único (pendente do RT): só itens com fator no Anexo XXII — sorbitol 0,047 g × 2,6; ácido cítrico 0,007 g × 3 = 0,141 kcal; NÃO contados: DL-bitartarato de colina, Analitic, lote 91442 Colina, Umectante glicerina

Notas de linha:

- Valor energético: calculado 0,141 kcal ≤ 4 kcal → não significativo, expresso como 0 (Anexo IV da IN 75)
- Carboidratos: poliois 0,047 g; valor antes do arredondamento: 0,05 g → declarado 0 g (Anexo III da IN 75; %VD sobre o valor declarado); sorbitol 0,047 g (poliol) — arredonda a 0 g, linhas de poliois omitidas
- Sódio: 0,27 mg do benzoato de sódio; ≤ 5 mg → %VD 0; calculado 0,27 mg ≤ 5 mg → não significativo, expresso como 0 (Anexo IV da IN 75)
- Cromo: valor antes do arredondamento: 30,85 µg → declarado 31 µg (Anexo III da IN 75; %VD sobre o valor declarado)
- Ácido clorogênico: valor antes do arredondamento: 32,02 mg → declarado 32 mg (Anexo III da IN 75; %VD sobre o valor declarado)

Observações:

- Veredito esperado da reformulação: CONFORME CONDICIONADO A (definição da porção pelo dono — 1 mL × 2 mL; viabilidade técnica da colina a 221,62 mg/mL confirmada pela fábrica; laudo válido do lote de café verde; laudo do sorbitol líquido e identidade do espessante; conferência dos aditivos para suplemento líquido)
- Porção do memorial: 1 mL (30 gotas), 1 vez ao dia — porção do memorial rev03; o cadastro diz 2 mL (decisão do dono, ver pendências); grupo populacional: adultos (> 19 anos).

---

## Shot + Colágeno 300 g (`shot-colageno-300-gramas`)

- **Fonte:** memorial de reformulação `docs/conformidade/reformulacao/shot-colageno-300-gramas.md`, harmonizado na fase 3 (JSON da fase 2 + 0 correção(ões) de harmonização)
- **Porção:** 10 g (1 dose)
- **Porções por embalagem:** 30
- **Grupo populacional (%VD):** adultos (≥ 19 anos)
- **Veredito esperado da reformulação:** CONFORME CONDICIONADO A (laudo de proteína do lote de colágeno em uso e origem animal; decisão do dono sobre a porção — 10 g com folga estreita ou 12 g; identificação do corante; laudo novo da maltodextrina)

**INFORMAÇÃO NUTRICIONAL**

Porções por embalagem: 30  
Porção: 10 g (1 dose)

| | 10 g | %VD* |
|---|---|---|
| Valor energético | 35 kcal = 147 kJ | 2% |
| Carboidratos | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Açúcares totais | 0 g |  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Açúcares adicionados | 0 g | 0% |
| Proteínas ⚠ | 8,6 g | 17% |
| Gorduras totais | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras saturadas | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras trans | 0 g | 0% |
| Fibras alimentares | 0 g | 0% |
| Sódio ⚠ | PENDENTE |  |
| Vitamina C | 200 mg | 200% |
| Zinco | 2,2 mg | 20% |

*Percentual de valores diários fornecidos pela porção

Bloco de texto para a arte:

```
INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 10 g (1 dose)
 | 10 g | %VD*
Valor energético | 35 kcal = 147 kJ | 2%
Carboidratos | 0 g | 0%
  Açúcares totais | 0 g | 
    Açúcares adicionados | 0 g | 0%
Proteínas | 8,6 g | 17%
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | 0 g | 0%
Sódio | PENDENTE | 
Vitamina C | 200 mg | 200%
Zinco | 2,2 mg | 20%
*Percentual de valores diários fornecidos pela porção
```

**Linhas PENDENTES / PROVISÓRIAS (⚠) e o motivo:**

- Proteínas — PROVISÓRIA: PROVISÓRIO — depende do laudo de proteína do lote de colágeno (91,0 % é o último teor conhecido, de laudo vencido)
- Sódio — PENDENTE: sódio do colágeno hidrolisado (8,4 g) desconhecido — laudo do insumo

Notas de linha:

- Carboidratos: maltodextrina 0,048 g; calculado 0,048 g ≤ 0,5 g → não significativo, expresso como 0 (Anexo IV da IN 75)
- Proteínas: colágeno hidrolisado (proteína 91 %) 8,599 g × 4; valor antes do arredondamento: 8,6 g → declarado 8,6 g (Anexo III da IN 75; %VD sobre o valor declarado)

Observações:

- Veredito esperado da reformulação: CONFORME CONDICIONADO A (laudo de proteína do lote de colágeno em uso e origem animal; decisão do dono sobre a porção — 10 g com folga estreita ou 12 g; identificação do corante; laudo novo da maltodextrina)
- Porção do memorial: 10 g (1 dose) diluída em 200 mL de água, 1 vez ao dia; grupo populacional: adultos (> 19 anos).

---

## Ômega Pró TG (`omega-pro-tg`)

- **Fonte:** memorial de reformulação `docs/conformidade/reformulacao/omega-pro-tg.md`, harmonizado na fase 3 (JSON da fase 2 + 0 correção(ões) de harmonização)
- **Porção:** 1 g (2 softgels)
- **Porções por embalagem:** 30
- **Grupo populacional (%VD):** adultos (≥ 19 anos)
- **Veredito esperado da reformulação:** NÃO RESOLVIDO (não existe laudo do óleo de peixe, memorial nem rótulo — a composição do cadastro não tem procedência; e a aplicação do mínimo de 5 g de lipídeos totais ao óleo de peixe depende de posição do RT). Se o laudo confirmar EPA 185,34 + DHA 123,56 mg por 2 softgels e o RT adotar a interpretação 2, a fórmula fica CONFORME (EPA + DHA = 308,9 mg, 15 % do teto)
- **TABELA INTEIRA PROVISÓRIA** — ver observações.

**INFORMAÇÃO NUTRICIONAL**

Porções por embalagem: 30  
Porção: 1 g (2 softgels)

| | 1 g | %VD* |
|---|---|---|
| Valor energético ⚠ | 9 kcal = 38 kJ | 0% |
| Carboidratos | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Açúcares totais | 0 g |  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Açúcares adicionados | 0 g | 0% |
| Proteínas | 0 g | 0% |
| Gorduras totais ⚠ | 1 g | 2% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras saturadas ⚠ | PENDENTE |  |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras trans ⚠ | PENDENTE |  |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras poli-insaturadas ⚠ | PENDENTE |  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ômega 3 ⚠ | 317 mg | 8% |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;EPA ⚠ | 185 mg |  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DHA ⚠ | 124 mg |  |
| &nbsp;&nbsp;&nbsp;&nbsp;Colesterol ⚠ | PENDENTE |  |
| Fibras alimentares | 0 g | 0% |
| Sódio | 0 mg | 0% |

*Percentual de valores diários fornecidos pela porção

Bloco de texto para a arte:

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

- Valor energético — PROVISÓRIA: PROVISÓRIO — 1 g de óleo de peixe × 9 kcal/g; sem laudo do óleo
- Gorduras totais — PROVISÓRIA: PROVISÓRIO — óleo declarado no cadastro, sem laudo; 1 g contra o mínimo de 5 g de lipídeos totais do Anexo III da IN 28 (interpretação pendente do RT/ANVISA — NÃO RESOLVIDO no memorial)
- Gorduras saturadas — PENDENTE: perfil de ácidos graxos do laudo do óleo
- Gorduras trans — PENDENTE: laudo do óleo
- Gorduras poli-insaturadas — PENDENTE: laudo do óleo (linha necessária para declarar ômega 3 no 2º nível, Anexo XI)
- Ômega 3 — PROVISÓRIA: PROVISÓRIO — 316,5 mg do cadastro (EPA 185,34 + DHA 123,56 + outros 7,6), sem laudo
- EPA — PROVISÓRIA: PROVISÓRIO — cadastro, sem laudo
- DHA — PROVISÓRIA: PROVISÓRIO — cadastro, sem laudo
- Colesterol — PENDENTE: laudo do óleo

Notas de linha:

- Ômega 3: valor antes do arredondamento: 316,5 mg → declarado 317 mg (Anexo III da IN 75; %VD sobre o valor declarado)
- EPA: valor antes do arredondamento: 185,34 mg → declarado 185 mg (Anexo III da IN 75; %VD sobre o valor declarado)
- DHA: valor antes do arredondamento: 123,56 mg → declarado 124 mg (Anexo III da IN 75; %VD sobre o valor declarado)

Observações:

- Veredito esperado da reformulação: NÃO RESOLVIDO (não existe laudo do óleo de peixe, memorial nem rótulo — a composição do cadastro não tem procedência; e a aplicação do mínimo de 5 g de lipídeos totais ao óleo de peixe depende de posição do RT). Se o laudo confirmar EPA 185,34 + DHA 123,56 mg por 2 softgels e o RT adotar a interpretação 2, a fórmula fica CONFORME (EPA + DHA = 308,9 mg, 15 % do teto)
- Porção do memorial: 2 softgels (1 g de óleo), 1 vez ao dia; grupo populacional: adultos (> 19 anos).
- TABELA INTEIRA PROVISÓRIA — montada sobre o cadastro do banco, sem laudo do óleo de peixe, memorial nem rótulo.

---

## Bella Gummy (Biotina em Gummy) (`bella-gummy-biotina-em-gummy`)

- **Fonte:** memorial de reformulação `docs/conformidade/reformulacao/bella-gummy-biotina-em-gummy.md`, harmonizado na fase 3 (JSON da fase 2 + 0 correção(ões) de harmonização)
- **Porção:** 6 g (2 gomas)
- **Porções por embalagem:** 30
- **Grupo populacional (%VD):** adultos (≥ 19 anos)
- **Veredito esperado da reformulação:** CONFORME CONDICIONADO A (laudo da vitamina A lote 215230 conferido; massas da matriz de goma para fechar a tabela nutricional; laudos vencidos/errados da base renovados)

**INFORMAÇÃO NUTRICIONAL**

Porções por embalagem: 30  
Porção: 6 g (2 gomas)

| | 6 g | %VD* |
|---|---|---|
| Valor energético ⚠ | PENDENTE |  |
| Carboidratos ⚠ | PENDENTE |  |
| &nbsp;&nbsp;&nbsp;&nbsp;Açúcares totais ⚠ | PENDENTE |  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Açúcares adicionados ⚠ | PENDENTE |  |
| &nbsp;&nbsp;&nbsp;&nbsp;Poliois totais ⚠ | PENDENTE |  |
| Proteínas ⚠ | PENDENTE |  |
| Gorduras totais | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras saturadas | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras trans | 0 g | 0% |
| Fibras alimentares ⚠ | PENDENTE |  |
| Sódio ⚠ | PENDENTE |  |
| Vitamina A | 1.022 µg RAE | 128% |
| Vitamina E | 5,7 mg | 38% |
| Vitamina C | 45 mg | 45% |
| Biotina | 40 µg | 133% |
| Zinco | 2,4 mg | 22% |

*Percentual de valores diários fornecidos pela porção

Bloco de texto para a arte:

```
INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 6 g (2 gomas)
 | 6 g | %VD*
Valor energético | PENDENTE | 
Carboidratos | PENDENTE | 
  Açúcares totais | PENDENTE | 
    Açúcares adicionados | PENDENTE | 
  Poliois totais | PENDENTE | 
Proteínas | PENDENTE | 
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | PENDENTE | 
Sódio | PENDENTE | 
Vitamina A | 1.022 µg RAE | 128%
Vitamina E | 5,7 mg | 38%
Vitamina C | 45 mg | 45%
Biotina | 40 µg | 133%
Zinco | 2,4 mg | 22%
*Percentual de valores diários fornecidos pela porção
```

**Linhas PENDENTES / PROVISÓRIAS (⚠) e o motivo:**

- Valor energético — PENDENTE: memorial não traz massa dos excipientes; rótulo/memorial imprimem 12 kcal = 50 kJ (não recalculável)
- Carboidratos — PENDENTE: rótulo/memorial: 4,8 g (não recalculável)
- Açúcares totais — PENDENTE: maltodextrina na base: fração de mono/dissacarídeos não quantificada
- Açúcares adicionados — PENDENTE: RDC 429 Art. 3 I inclui a fração de mono/dissacarídeos da maltodextrina
- Poliois totais — PENDENTE: base da goma sem massa no memorial
- Proteínas — PENDENTE: rótulo/memorial: 0,6 g (gelatina; massa não disponível)
- Fibras alimentares — PENDENTE: pectina e goma acácia são fibras; massas não disponíveis
- Sódio — PENDENTE: rótulo/memorial: 8 mg (citrato de sódio; massa não disponível)

Notas de linha:

- Vitamina A: valor antes do arredondamento: 1.021,9 µg RAE → declarado 1.022 µg RAE (Anexo III da IN 75; %VD sobre o valor declarado)
- Vitamina E: valor antes do arredondamento: 5,67 mg → declarado 5,7 mg (Anexo III da IN 75; %VD sobre o valor declarado)
- Vitamina C: valor antes do arredondamento: 45 mg → declarado 45 mg (Anexo III da IN 75; %VD sobre o valor declarado)
- Zinco: valor antes do arredondamento: 2,39 mg → declarado 2,4 mg (Anexo III da IN 75; %VD sobre o valor declarado)

Observações:

- Veredito esperado da reformulação: CONFORME CONDICIONADO A (laudo da vitamina A lote 215230 conferido; massas da matriz de goma para fechar a tabela nutricional; laudos vencidos/errados da base renovados)
- Porção do memorial: 6 g (2 gomas de 3,00 g) — 30 porções por embalagem (60 gomas, 180 g); grupo populacional: adultos (≥ 19 anos).
- Itens com fator no Anexo XXII sem massa no memorial (não entram na conta): Gelatina, Goma acácia, Maltitol, Maltodextrina, Pectina cítrica, Sorbitol líquido 70 %, Ácido cítrico.

---

## Creatina Monoidratada 150 g Solúvel (`creatina-monohidratada-150g-soluvel`)

- **Fonte:** memorial de reformulação `docs/conformidade/reformulacao/creatina-monohidratada-150g-soluvel.md`, harmonizado na fase 3 (JSON da fase 2 + 0 correção(ões) de harmonização)
- **Porção:** 4 g (1 dosador)
- **Porções por embalagem:** Cerca de 38
- **Grupo populacional (%VD):** adultos (≥ 19 anos)
- **Veredito esperado da reformulação:** CONFORME (com folga) — condicionado à validação gravimétrica do dosador

**INFORMAÇÃO NUTRICIONAL**

Porções por embalagem: Cerca de 38  
Porção: 4 g (1 dosador)

| | 4 g | %VD* |
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
| Sódio | 0 mg | 0% |
| Creatina ⚠ | 4.000 mg |  |

*Percentual de valores diários fornecidos pela porção

Bloco de texto para a arte:

```
INFORMAÇÃO NUTRICIONAL
Porções por embalagem: Cerca de 38
Porção: 4 g (1 dosador)
 | 4 g | %VD*
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
Creatina | 4.000 mg | 
*Percentual de valores diários fornecidos pela porção
```

**Linhas PENDENTES / PROVISÓRIAS (⚠) e o motivo:**

- Valor energético — PROVISÓRIA: critério único (pendente do RT): só itens com fator no Anexo XXII — nenhum item com fator = 0 kcal; NÃO contados: Creatina monoidratada
- Creatina — PROVISÓRIA: massa nominal de creatina monoidratada (lote 217949, teor 100,5 % b.s.; leitura A/B do limite é decisão do RT); declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)

Observações:

- Veredito esperado da reformulação: CONFORME (com folga) — condicionado à validação gravimétrica do dosador
- Porção do memorial: 4 g (1 dosador nivelado — validar gravimetricamente) — cerca de 38 porções em 150 g; grupo populacional: adultos (≥ 19 anos).

---

## Creatina Monoidratada 300 g Solúvel (`creatina-monohidratada-300g-soluvel`)

- **Fonte:** memorial de reformulação `docs/conformidade/reformulacao/creatina-monohidratada-300g-soluvel.md`, harmonizado na fase 3 (JSON da fase 2 + 0 correção(ões) de harmonização)
- **Porção:** 4 g (1 dosador)
- **Porções por embalagem:** 75
- **Grupo populacional (%VD):** adultos (≥ 19 anos)
- **Veredito esperado da reformulação:** CONFORME (com folga) — condicionado à validação gravimétrica do dosador e à documentação própria da apresentação de 300 g

**INFORMAÇÃO NUTRICIONAL**

Porções por embalagem: 75  
Porção: 4 g (1 dosador)

| | 4 g | %VD* |
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
| Sódio | 0 mg | 0% |
| Creatina ⚠ | 4.000 mg |  |

*Percentual de valores diários fornecidos pela porção

Bloco de texto para a arte:

```
INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 75
Porção: 4 g (1 dosador)
 | 4 g | %VD*
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
Creatina | 4.000 mg | 
*Percentual de valores diários fornecidos pela porção
```

**Linhas PENDENTES / PROVISÓRIAS (⚠) e o motivo:**

- Valor energético — PROVISÓRIA: critério único (pendente do RT): só itens com fator no Anexo XXII — nenhum item com fator = 0 kcal; NÃO contados: Creatina monoidratada
- Creatina — PROVISÓRIA: massa nominal de creatina monoidratada (lote 217949, teor 100,5 % b.s.; leitura A/B do limite é decisão do RT); declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)

Observações:

- Veredito esperado da reformulação: CONFORME (com folga) — condicionado à validação gravimétrica do dosador e à documentação própria da apresentação de 300 g
- Porção do memorial: 4 g (1 dosador nivelado — validar gravimetricamente) — 75 porções em 300 g; grupo populacional: adultos (≥ 19 anos).

---

## Creatina Gummy sabor Frutas Vermelhas (`creatina-gummy-sabor-frutas-vermelhas`)

- **Fonte:** memorial de reformulação `docs/conformidade/reformulacao/creatina-gummy-sabor-frutas-vermelhas.md`, harmonizado na fase 3 (JSON da fase 2 + 0 correção(ões) de harmonização)
- **Porção:** 6 g (2 gomas)
- **Porções por embalagem:** 30
- **Grupo populacional (%VD):** adultos (≥ 19 anos)
- **Veredito esperado da reformulação:** CONFORME NOS LIMITES (fórmula proposta) · NÃO RESOLVIDO na porção: CONDICIONADO A pesagem da goma acabada, doseamento de creatina/creatinina no produto acabado e estudo de estabilidade

**INFORMAÇÃO NUTRICIONAL**

Porções por embalagem: 30  
Porção: 6 g (2 gomas)

| | 6 g | %VD* |
|---|---|---|
| Valor energético ⚠ | 9 kcal = 39 kJ | 0% |
| Carboidratos | 2,5 g | 1% |
| &nbsp;&nbsp;&nbsp;&nbsp;Açúcares totais | 0 g |  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Açúcares adicionados | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Poliois totais | 2,5 g |  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Sorbitol | 1,2 g |  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Maltitol | 1,3 g |  |
| Proteínas | 0,7 g | 1% |
| Gorduras totais | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras saturadas | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras trans | 0 g | 0% |
| Fibras alimentares | 0 g | 0% |
| Sódio ⚠ | PENDENTE |  |
| Creatina ⚠ | 3.500 mg |  |

*Percentual de valores diários fornecidos pela porção

Bloco de texto para a arte:

```
INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 6 g (2 gomas)
 | 6 g | %VD*
Valor energético | 9 kcal = 39 kJ | 0%
Carboidratos | 2,5 g | 1%
  Açúcares totais | 0 g | 
    Açúcares adicionados | 0 g | 0%
  Poliois totais | 2,5 g | 
    Sorbitol | 1,2 g | 
    Maltitol | 1,3 g | 
Proteínas | 0,7 g | 1%
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | 0 g | 0%
Sódio | PENDENTE | 
Creatina | 3.500 mg | 
*Percentual de valores diários fornecidos pela porção
```

**Linhas PENDENTES / PROVISÓRIAS (⚠) e o motivo:**

- Valor energético — PROVISÓRIA: critério único (pendente do RT): só itens com fator no Anexo XXII — sorbitol 1,225 g × 2,6; maltitol 1,26 g × 2,1; gelatina (N 15,0 % × 6,25) 0,656 g × 4; ácido cítrico 0,168 g × 3; pectina (ácido galacturônico 90 %) 0,126 g × 2 = 9,212 kcal; NÃO contados: Creatina monoidratada, Glicerina vegetal
- Sódio — PENDENTE: citrato de sódio 14 mg → 3,3 a 3,7 mg de sódio conforme a forma do sal (anidro/di-hidratado, não informada no memorial); o rótulo atual imprime 10 mg sem lastro; PENDENTE análise de sódio no produto acabado
- Creatina — PROVISÓRIA: massa nominal de creatina monoidratada (lote 217949, teor 100,5 % b.s.; leitura A/B do limite é decisão do RT); declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)

Notas de linha:

- Carboidratos: poliois 2,485 g; valor antes do arredondamento: 2,48 g → declarado 2,5 g (Anexo III da IN 75; %VD sobre o valor declarado)
- Açúcares totais: sem açúcares na receita (polióis excluídos por definição, RDC 429 Art. 3 II)
- Poliois totais: valor antes do arredondamento: 2,48 g → declarado 2,5 g (Anexo III da IN 75; %VD sobre o valor declarado)
- Sorbitol: valor antes do arredondamento: 1,22 g → declarado 1,2 g (Anexo III da IN 75; %VD sobre o valor declarado)
- Maltitol: valor antes do arredondamento: 1,26 g → declarado 1,3 g (Anexo III da IN 75; %VD sobre o valor declarado)
- Proteínas: gelatina (N 15,0 % × 6,25) 0,656 g × 4; valor antes do arredondamento: 0,66 g → declarado 0,7 g (Anexo III da IN 75; %VD sobre o valor declarado)
- Fibras alimentares: pectina cítrica: 0,126 g de fibra (ácido galacturônico 90 %); calculado 0,126 g ≤ 0,5 g → não significativo, expresso como 0 (Anexo IV da IN 75)

Observações:

- Veredito esperado da reformulação: CONFORME NOS LIMITES (fórmula proposta) · NÃO RESOLVIDO na porção: CONDICIONADO A pesagem da goma acabada, doseamento de creatina/creatinina no produto acabado e estudo de estabilidade
- Porção do memorial: 2 gomas (rótulo: 6 g; massa real da porção PENDENTE de pesagem — os sólidos da receita somam 7.314 mg); grupo populacional: adultos (≥ 19 anos).

---

## Creatina em Gummy sabor Tutti-frutti (`creatina-em-gummy-sabor-tutti-frutti`)

- **Fonte:** memorial de reformulação `docs/conformidade/reformulacao/creatina-em-gummy-sabor-tutti-frutti.md`, harmonizado na fase 3 (JSON da fase 2 + 0 correção(ões) de harmonização)
- **Porção:** 6 g (2 gomas)
- **Porções por embalagem:** 30
- **Grupo populacional (%VD):** adultos (≥ 19 anos)
- **Veredito esperado da reformulação:** CONFORME NOS LIMITES (fórmula proposta) · NÃO RESOLVIDO na porção: CONDICIONADO A pesagem da goma acabada, doseamento de creatina/creatinina no produto acabado e estudo de estabilidade; e a documentação própria do sabor tutti-frutti (aroma, corante, laudos)

**INFORMAÇÃO NUTRICIONAL**

Porções por embalagem: 30  
Porção: 6 g (2 gomas)

| | 6 g | %VD* |
|---|---|---|
| Valor energético ⚠ | 9 kcal = 39 kJ | 0% |
| Carboidratos | 2,5 g | 1% |
| &nbsp;&nbsp;&nbsp;&nbsp;Açúcares totais | 0 g |  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Açúcares adicionados | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Poliois totais | 2,5 g |  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Sorbitol | 1,2 g |  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Maltitol | 1,3 g |  |
| Proteínas | 0,7 g | 1% |
| Gorduras totais | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras saturadas | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras trans | 0 g | 0% |
| Fibras alimentares | 0 g | 0% |
| Sódio ⚠ | PENDENTE |  |
| Creatina ⚠ | 3.500 mg |  |

*Percentual de valores diários fornecidos pela porção

Bloco de texto para a arte:

```
INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 6 g (2 gomas)
 | 6 g | %VD*
Valor energético | 9 kcal = 39 kJ | 0%
Carboidratos | 2,5 g | 1%
  Açúcares totais | 0 g | 
    Açúcares adicionados | 0 g | 0%
  Poliois totais | 2,5 g | 
    Sorbitol | 1,2 g | 
    Maltitol | 1,3 g | 
Proteínas | 0,7 g | 1%
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | 0 g | 0%
Sódio | PENDENTE | 
Creatina | 3.500 mg | 
*Percentual de valores diários fornecidos pela porção
```

**Linhas PENDENTES / PROVISÓRIAS (⚠) e o motivo:**

- Valor energético — PROVISÓRIA: critério único (pendente do RT): só itens com fator no Anexo XXII — sorbitol 1,225 g × 2,6; maltitol 1,26 g × 2,1; gelatina (N 15,0 % × 6,25) 0,656 g × 4; ácido cítrico 0,168 g × 3; pectina (ácido galacturônico 90 %) 0,126 g × 2 = 9,212 kcal; NÃO contados: Creatina monoidratada, Glicerina vegetal
- Sódio — PENDENTE: citrato de sódio 14 mg → 3,3 a 3,7 mg de sódio conforme a forma do sal (anidro/di-hidratado, não informada no memorial); o rótulo atual imprime 10 mg sem lastro; PENDENTE análise de sódio no produto acabado
- Creatina — PROVISÓRIA: massa nominal de creatina monoidratada (lote 217949, teor 100,5 % b.s.; leitura A/B do limite é decisão do RT); declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)

Notas de linha:

- Carboidratos: poliois 2,485 g; valor antes do arredondamento: 2,48 g → declarado 2,5 g (Anexo III da IN 75; %VD sobre o valor declarado)
- Açúcares totais: sem açúcares na receita (polióis excluídos por definição, RDC 429 Art. 3 II)
- Poliois totais: valor antes do arredondamento: 2,48 g → declarado 2,5 g (Anexo III da IN 75; %VD sobre o valor declarado)
- Sorbitol: valor antes do arredondamento: 1,22 g → declarado 1,2 g (Anexo III da IN 75; %VD sobre o valor declarado)
- Maltitol: valor antes do arredondamento: 1,26 g → declarado 1,3 g (Anexo III da IN 75; %VD sobre o valor declarado)
- Proteínas: gelatina (N 15,0 % × 6,25) 0,656 g × 4; valor antes do arredondamento: 0,66 g → declarado 0,7 g (Anexo III da IN 75; %VD sobre o valor declarado)
- Fibras alimentares: pectina cítrica: 0,126 g de fibra (ácido galacturônico 90 %); calculado 0,126 g ≤ 0,5 g → não significativo, expresso como 0 (Anexo IV da IN 75)

Observações:

- Veredito esperado da reformulação: CONFORME NOS LIMITES (fórmula proposta) · NÃO RESOLVIDO na porção: CONDICIONADO A pesagem da goma acabada, doseamento de creatina/creatinina no produto acabado e estudo de estabilidade; e a documentação própria do sabor tutti-frutti (aroma, corante, laudos)
- Porção do memorial: 2 gomas (rótulo: 6 g; massa real da porção PENDENTE de pesagem — os sólidos da receita somam 7.262 mg); grupo populacional: adultos (≥ 19 anos).

---

## Melatonina em Gummy sabor Uva (`melatonina-em-gummy-sabor-uva`)

- **Fonte:** memorial de reformulação `docs/conformidade/reformulacao/melatonina-em-gummy-sabor-uva.md`, harmonizado na fase 3 (JSON da fase 2 + 0 correção(ões) de harmonização)
- **Porção:** 6 g (2 gomas)
- **Porções por embalagem:** 30
- **Grupo populacional (%VD):** adultos (≥ 19 anos)
- **Veredito esperado da reformulação:** CONFORME CONDICIONADO A (laudo novo de melatonina; laudo completo/novo de L-triptofano; decisão versão A/B)

**INFORMAÇÃO NUTRICIONAL**

Porções por embalagem: 30  
Porção: 6 g (2 gomas)

| | 6 g | %VD* |
|---|---|---|
| Valor energético ⚠ | PENDENTE |  |
| Carboidratos ⚠ | PENDENTE |  |
| &nbsp;&nbsp;&nbsp;&nbsp;Açúcares totais ⚠ | PENDENTE |  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Açúcares adicionados ⚠ | PENDENTE |  |
| &nbsp;&nbsp;&nbsp;&nbsp;Poliois totais ⚠ | PENDENTE |  |
| Proteínas ⚠ | PENDENTE |  |
| &nbsp;&nbsp;&nbsp;&nbsp;L-triptofano ⚠ | 750 mg |  |
| Gorduras totais | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras saturadas | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras trans | 0 g | 0% |
| Fibras alimentares ⚠ | PENDENTE |  |
| Sódio ⚠ | PENDENTE |  |
| Melatonina ⚠ | 0,18 mg |  |

*Percentual de valores diários fornecidos pela porção

Bloco de texto para a arte:

```
INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 6 g (2 gomas)
 | 6 g | %VD*
Valor energético | PENDENTE | 
Carboidratos | PENDENTE | 
  Açúcares totais | PENDENTE | 
    Açúcares adicionados | PENDENTE | 
  Poliois totais | PENDENTE | 
Proteínas | PENDENTE | 
  L-triptofano | 750 mg | 
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | PENDENTE | 
Sódio | PENDENTE | 
Melatonina | 0,18 mg | 
*Percentual de valores diários fornecidos pela porção
```

**Linhas PENDENTES / PROVISÓRIAS (⚠) e o motivo:**

- Valor energético — PENDENTE: memorial sem massa dos excipientes; rótulo/memorial: 11 kcal = 46 kJ (não recalculável)
- Carboidratos — PENDENTE: rótulo/memorial: 4,5 g
- Açúcares totais — PENDENTE: maltodextrina na base — fração de mono/dissacarídeos não quantificada
- Açúcares adicionados — PENDENTE: base da goma sem massa no memorial
- Poliois totais — PENDENTE: base da goma sem massa no memorial
- Proteínas — PENDENTE: rótulo/memorial: 0,8 g (gelatina; massa não disponível)
- L-triptofano — PROVISÓRIA: declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)
- Fibras alimentares — PENDENTE: pectina/goma acácia; massas não disponíveis
- Sódio — PENDENTE: rótulo/memorial: 8 mg
- Melatonina — PROVISÓRIA: PROVISÓRIO: teor de laudo VENCIDO (lote 950151, validade 09/12/2024) — pedir laudo novo e recalcular a massa

Observações:

- Veredito esperado da reformulação: CONFORME CONDICIONADO A (laudo novo de melatonina; laudo completo/novo de L-triptofano; decisão versão A/B)
- Porção do memorial: 6 g (2 gomas de 3,00 g) — 30 porções (60 gomas, 180 g); a ficha "Suelen" da versão só-melatonina traz 7,0 g (2 gomas), 210 g; grupo populacional: adultos (≥ 19 anos).
- Itens com fator no Anexo XXII sem massa no memorial (não entram na conta): Gelatina, Goma acácia, Maltitol, Maltodextrina, Pectina cítrica, Sorbitol líquido 70 %, Ácido cítrico.

---

## Pré-treino 300 g (`pre-treino-300-g`)

- **Fonte:** memorial de reformulação `docs/conformidade/reformulacao/pre-treino-300-g.md`, harmonizado na fase 3 (JSON da fase 2 + 6 correção(ões) de harmonização)
- **Porção:** 10 g (1 dosador)
- **Porções por embalagem:** 30
- **Grupo populacional (%VD):** adultos (≥ 19 anos)
- **Veredito esperado da reformulação:** CONFORME (fórmula proposta, com folga em todos os constituintes) — condicionado a laudo novo de beta-alanina e à regularização do insumo controlado (cafeína)

**INFORMAÇÃO NUTRICIONAL**

Porções por embalagem: 30  
Porção: 10 g (1 dosador)

| | 10 g | %VD* |
|---|---|---|
| Valor energético ⚠ | 11 kcal = 44 kJ | 1% |
| Carboidratos | 1,8 g | 1% |
| &nbsp;&nbsp;&nbsp;&nbsp;Açúcares totais ⚠ | PENDENTE |  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Açúcares adicionados ⚠ | PENDENTE |  |
| Proteínas ⚠ | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;L-tirosina ⚠ | 400 mg |  |
| &nbsp;&nbsp;&nbsp;&nbsp;L-arginina ⚠ | 1.019 mg |  |
| &nbsp;&nbsp;&nbsp;&nbsp;Beta-alanina ⚠ | 297 mg |  |
| Gorduras totais | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras saturadas | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras trans | 0 g | 0% |
| Fibras alimentares | 0 g | 0% |
| Sódio | 0 mg | 0% |
| Vitamina B6 | 1,6 mg | 123% |
| Vitamina B12 | 8,5 µg | 354% |
| Taurina ⚠ | 895 mg |  |
| Creatina ⚠ | 3.500 mg |  |
| Cafeína | 175 mg |  |

*Percentual de valores diários fornecidos pela porção

Bloco de texto para a arte:

```
INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 10 g (1 dosador)
 | 10 g | %VD*
Valor energético | 11 kcal = 44 kJ | 1%
Carboidratos | 1,8 g | 1%
  Açúcares totais | PENDENTE | 
    Açúcares adicionados | PENDENTE | 
Proteínas | 0 g | 0%
  L-tirosina | 400 mg | 
  L-arginina | 1.019 mg | 
  Beta-alanina | 297 mg | 
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | 0 g | 0%
Sódio | 0 mg | 0%
Vitamina B6 | 1,6 mg | 123%
Vitamina B12 | 8,5 µg | 354%
Taurina | 895 mg | 
Creatina | 3.500 mg | 
Cafeína | 175 mg | 
*Percentual de valores diários fornecidos pela porção
```

**Linhas PENDENTES / PROVISÓRIAS (⚠) e o motivo:**

- Valor energético — PROVISÓRIA: critério único (pendente do RT): só itens com fator no Anexo XXII — ácido cítrico 1,1 g × 3; maltodextrina 1,825 g × 4 = 10,6 kcal; NÃO contados: Beta-alanina Beta-alanina, Cloridrato de L-arginina Arginina, Creatina monoidratada Creatina, L-tirosina Tirosina, Taurina Taurina
- Açúcares totais — PENDENTE: fração de mono/dissacarídeos da maltodextrina (DE 17,72 %) não quantificada — RDC 429 Art. 3 I/II
- Açúcares adicionados — PENDENTE: idem (maltodextrina conta como açúcar adicionado na fração de mono/dissacarídeos)
- Proteínas — PROVISÓRIA: critério único (pendente do RT): aminoácidos livres (Beta-alanina, L-arginina, L-tirosina = 1.716,1 mg) não contam como proteína (se contassem: 1,716 g); Anexo IV da IN 75 (lido em 16/09/2026): a expressão '0' para proteínas só é admitida sem aminoácido declarado com valor diferente de zero — a redação final desta linha depende do critério do RT
- L-tirosina — PROVISÓRIA: declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)
- L-arginina — PROVISÓRIA: declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)
- Beta-alanina — PROVISÓRIA: declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina); PROVISÓRIO: teor de laudo VENCIDO (lote AUTO033847, validade 03/08/2026) — pedir laudo novo e recalcular a massa
- Taurina — PROVISÓRIA: declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)
- Creatina — PROVISÓRIA: massa nominal de creatina monoidratada (lote 217949, teor 100,5 % b.s.; leitura A/B do limite é decisão do RT); declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)

Notas de linha:

- Carboidratos: maltodextrina 1,825 g; valor antes do arredondamento: 1,82 g → declarado 1,8 g (Anexo III da IN 75; %VD sobre o valor declarado)
- L-tirosina: valor antes do arredondamento: 399,6 mg → declarado 400 mg (Anexo III da IN 75; %VD sobre o valor declarado)
- L-arginina: valor antes do arredondamento: 1.019,2 mg → declarado 1.019 mg (Anexo III da IN 75; %VD sobre o valor declarado)
- Beta-alanina: valor antes do arredondamento: 297,3 mg → declarado 297 mg (Anexo III da IN 75; %VD sobre o valor declarado)
- Sódio: sem fonte de sódio na receita
- Vitamina B6: valor antes do arredondamento: 1,64 mg → declarado 1,6 mg (Anexo III da IN 75; %VD sobre o valor declarado)
- Taurina: valor antes do arredondamento: 895,1 mg → declarado 895 mg (Anexo III da IN 75; %VD sobre o valor declarado)
- Cafeína: valor antes do arredondamento: 174,8 mg → declarado 175 mg (Anexo III da IN 75; %VD sobre o valor declarado)

Observações:

- Veredito esperado da reformulação: CONFORME (fórmula proposta, com folga em todos os constituintes) — condicionado a laudo novo de beta-alanina e à regularização do insumo controlado (cafeína)
- Porção do memorial: 10 g (1 dosador) diluídos em 200 mL de água, 1 vez ao dia — 30 porções em 300 g; grupo populacional: adultos (≥ 19 anos).

---

## Pré-treino + Creatina sabor Limão 420 g (Césio 137) (`pre-treino-creatina-sabor-limao-420g`)

- **Fonte:** memorial de reformulação `docs/conformidade/reformulacao/pre-treino-creatina-sabor-limao-420g.md`, harmonizado na fase 3 (JSON da fase 2 + 19 correção(ões) de harmonização)
- **Porção:** 14 g (1 dosador)
- **Porções por embalagem:** 30
- **Grupo populacional (%VD):** adultos (≥ 19 anos)
- **Veredito esperado da reformulação:** CONFORME (fórmula proposta: cafeína total 81 % do teto, beta-alanina 300 mg/dose, 13 constituintes com folga, soma 14.000 mg) — condicionado a laudo de cafeína do guaraná, laudo válido de bisglicinato de magnésio e laudo novo de beta-alanina

**INFORMAÇÃO NUTRICIONAL**

Porções por embalagem: 30  
Porção: 14 g (1 dosador)

| | 14 g | %VD* |
|---|---|---|
| Valor energético ⚠ | 12 kcal = 52 kJ | 1% |
| Carboidratos | 2,3 g | 1% |
| &nbsp;&nbsp;&nbsp;&nbsp;Açúcares totais ⚠ | PENDENTE |  |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Açúcares adicionados ⚠ | PENDENTE |  |
| Proteínas ⚠ | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;L-tirosina ⚠ | 999 mg |  |
| &nbsp;&nbsp;&nbsp;&nbsp;L-arginina ⚠ | 1.019 mg |  |
| &nbsp;&nbsp;&nbsp;&nbsp;Beta-alanina ⚠ | 297 mg |  |
| Gorduras totais | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras saturadas | 0 g | 0% |
| &nbsp;&nbsp;&nbsp;&nbsp;Gorduras trans | 0 g | 0% |
| Fibras alimentares | 0 g | 0% |
| Sódio | 0 mg | 0% |
| Vitamina D | 40 µg | 267% |
| Niacina | 30 mg NE | 200% |
| Vitamina B6 | 74 mg | 5692% |
| Vitamina B12 | 8,5 µg | 354% |
| Magnésio ⚠ | 300 mg | 71% |
| Taurina ⚠ | 995 mg |  |
| Creatina ⚠ | 4.000 mg |  |
| L-carnitina ⚠ | 994 mg |  |
| Cafeína ⚠ | 163 mg |  |

*Percentual de valores diários fornecidos pela porção

Bloco de texto para a arte:

```
INFORMAÇÃO NUTRICIONAL
Porções por embalagem: 30
Porção: 14 g (1 dosador)
 | 14 g | %VD*
Valor energético | 12 kcal = 52 kJ | 1%
Carboidratos | 2,3 g | 1%
  Açúcares totais | PENDENTE | 
    Açúcares adicionados | PENDENTE | 
Proteínas | 0 g | 0%
  L-tirosina | 999 mg | 
  L-arginina | 1.019 mg | 
  Beta-alanina | 297 mg | 
Gorduras totais | 0 g | 0%
  Gorduras saturadas | 0 g | 0%
  Gorduras trans | 0 g | 0%
Fibras alimentares | 0 g | 0%
Sódio | 0 mg | 0%
Vitamina D | 40 µg | 267%
Niacina | 30 mg NE | 200%
Vitamina B6 | 74 mg | 5692%
Vitamina B12 | 8,5 µg | 354%
Magnésio | 300 mg | 71%
Taurina | 995 mg | 
Creatina | 4.000 mg | 
L-carnitina | 994 mg | 
Cafeína | 163 mg | 
*Percentual de valores diários fornecidos pela porção
```

**Linhas PENDENTES / PROVISÓRIAS (⚠) e o motivo:**

- Valor energético — PROVISÓRIA: critério único (pendente do RT): só itens com fator no Anexo XXII — ácido cítrico 1,1 g × 3; maltodextrina 2,275 g × 4 = 12,401 kcal; NÃO contados: Beta-alanina Beta-alanina, Cloridrato de L-arginina Arginina, Creatina monoidratada Creatina, L-carnitina base L-Carnitina, L-tirosina Tirosina, Taurina Taurina
- Açúcares totais — PENDENTE: fração de mono/dissacarídeos da maltodextrina não quantificada
- Açúcares adicionados — PENDENTE: —
- Proteínas — PROVISÓRIA: critério único (pendente do RT): aminoácidos livres (Beta-alanina, L-arginina, L-tirosina = 2.315,5 mg) não contam como proteína (se contassem: 2,316 g); Anexo IV da IN 75 (lido em 16/09/2026): a expressão '0' para proteínas só é admitida sem aminoácido declarado com valor diferente de zero — a redação final desta linha depende do critério do RT
- L-tirosina — PROVISÓRIA: declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)
- L-arginina — PROVISÓRIA: declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)
- Beta-alanina — PROVISÓRIA: declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina); PROVISÓRIO: teor de laudo VENCIDO (lote AUTO033847, validade 03/08/2026) — pedir laudo novo e recalcular a massa
- Magnésio — PROVISÓRIA: PROVISÓRIO: teor de laudo VENCIDO (lote 90844 (Analitic, fabricante 66342023062230), validade 21/06/2025) — pedir laudo novo e recalcular a massa
- Taurina — PROVISÓRIA: declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)
- Creatina — PROVISÓRIA: massa nominal de creatina monoidratada (lote 217949, teor 100,5 % b.s.; leitura A/B do limite é decisão do RT); declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)
- L-carnitina — PROVISÓRIA: declarado só nesta linha, em mg; não conta como proteína nem como energia (critério pendente do RT: o Anexo XXII da IN 75 não traz fator para aminoácidos livres, creatina, taurina e L-carnitina)
- Cafeína — PROVISÓRIA: PROVISÓRIO — cafeína total: anidra 149,8 mg + guaraná em pó ≤ 12,78 mg (metilxantinas totais do laudo, limite superior; o laudo de cafeína específica do guaraná fixa o valor)

Notas de linha:

- Carboidratos: maltodextrina 2,275 g; valor antes do arredondamento: 2,28 g → declarado 2,3 g (Anexo III da IN 75; %VD sobre o valor declarado)
- L-arginina: valor antes do arredondamento: 1.019,2 mg → declarado 1.019 mg (Anexo III da IN 75; %VD sobre o valor declarado)
- Beta-alanina: valor antes do arredondamento: 297,3 mg → declarado 297 mg (Anexo III da IN 75; %VD sobre o valor declarado)
- Niacina: valor antes do arredondamento: 29,73 mg NE → declarado 30 mg NE (Anexo III da IN 75; %VD sobre o valor declarado)
- Vitamina B6: valor antes do arredondamento: 73,97 mg → declarado 74 mg (Anexo III da IN 75; %VD sobre o valor declarado)
- Taurina: valor antes do arredondamento: 994,6 mg → declarado 995 mg (Anexo III da IN 75; %VD sobre o valor declarado)
- L-carnitina: valor antes do arredondamento: 994,1 mg → declarado 994 mg (Anexo III da IN 75; %VD sobre o valor declarado)
- Cafeína: valor antes do arredondamento: 162,58 mg → declarado 163 mg (Anexo III da IN 75; %VD sobre o valor declarado)

Observações:

- Veredito esperado da reformulação: CONFORME (fórmula proposta: cafeína total 81 % do teto, beta-alanina 300 mg/dose, 13 constituintes com folga, soma 14.000 mg) — condicionado a laudo de cafeína do guaraná, laudo válido de bisglicinato de magnésio e laudo novo de beta-alanina
- Porção do memorial: 14 g (1 dosador) diluídos em 200 mL de água, 1 vez ao dia — 30 porções em 420 g; grupo populacional: adultos (≥ 19 anos).

---

## Correções desta versão (contra o rascunho gerado antes do fim da harmonização)

Diferenças de conteúdo (item → quantidade | %VD) entre o bloco de texto de cada tabela nesta versão e no rascunho (`scratchpad/fase3/_rascunho_TABELAS-NUTRICIONAIS.md`, cópia do arquivo gerado em 16/09/2026 pela manhã). Causas, por código: **[cab]** cabeçalho da coluna passou de 'Quantidade por porção' para a massa da porção (Anexo XII); **[energia]** valor energético em inteiro (RDC 429, art. 7º, §1º) e quantidade não significativa expressa como '0' (Anexo IV) — o rascunho trazia '0,6 kcal', '1,1 kcal', '0,1 g' etc.; **[crit]** critério único de energia/proteína: aminoácidos livres, creatina, taurina, L-carnitina, colina, inositol, glicerina, MSM, glucosamina e hialuronato deixam de somar em Proteínas/Carboidratos/Valor energético (o rascunho mantinha o critério de cada grupo de trabalho); **[nome]** nome do item pelo Anexo XI/Anexo I (L-tirosina, L-teanina, L-carnitina, Ácido L-aspártico…); **[ordem]** posição pelo Anexo XI (L-teanina sob Proteínas; Ácido pantotênico antes de Vitamina B6; ômega 3 sob gorduras poli-insaturadas); **[quercetina]** a linha Quercetina do Saúde Intestinal faltava no rascunho (o mapeamento de insumos não reconhecia 'quercetina di-hidratada' — corrigido em `modelo.py`); **[niacina]** VD de niacina para gestantes e lactantes lido no Anexo VIII (18 e 17 mg NE) — as células PENDENTE do Multi Vitta viraram percentuais; **[pend]** linha marcada PENDENTE por falta de dado de fonte (sódio das gomas de creatina; sódio do colágeno; gorduras poli-insaturadas do Ômega); **[lote]** ativo recalculado com o lote de referência harmonizado; **[porc]** texto da porção encurtado para a medida caseira.

### Multivitamínico (`multivitaminico`) — 2 linha(s) alterada(s)

```
~ Sódio: 3,2 mg | 0%  →  0 mg | 0%
~ cabeçalho: 'Quantidade por porção | %VD*' → '| 1 g | %VD*'   [cab]
```

### ZMA (Zinco, Magnésio e Vitamina B6) (`zma-zinco-magnesio-e-vitamina-d`) — 6 linha(s) alterada(s)

```
~ Valor energético: 0,6 kcal = 2,5 kJ | 0%  →  0 kcal = 0 kJ | 0%
~ Proteínas: 0,2 g | 0%  →  0 g | 0%
+ L-teanina: 150 mg |    [linha nova]
~ Sódio: 3,2 mg | 0%  →  0 mg | 0%
- Teanina: 150 mg |    [linha removida ou renomeada]
~ cabeçalho: 'Quantidade por porção | %VD*' → '| 1 g | %VD*'   [cab]
```

### Biotina em Cápsula (`biotina-em-capsula`) — 9 linha(s) alterada(s)

```
~ Valor energético: 1,1 kcal = 4,8 kJ | 0%  →  0 kcal = 0 kJ | 0%
~ Carboidratos: 0,1 g | 0%  →  0 g | 0%
~ Proteínas: 0,2 g | 0%  →  0 g | 0%
+ L-metionina: 110 mg |    [linha nova]
+ L-cisteína: 76 mg |    [linha nova]
~ Sódio: 2,9 mg | 0%  →  0 mg | 0%
- Metionina: 110 mg |    [linha removida ou renomeada]
- Cisteína: 76 mg |    [linha removida ou renomeada]
~ cabeçalho: 'Quantidade por porção | %VD*' → '| 1 g | %VD*'   [cab]
```

### Dores Musculares (Nuviart) (`dores-musculares`) — 3 linha(s) alterada(s)

```
~ Valor energético: 0,1 kcal = 0,5 kJ | 0%  →  0 kcal = 0 kJ | 0%
~ Sódio: 0,06 mg | 0%  →  0 mg | 0%
~ cabeçalho: 'Quantidade por porção | %VD*' → '| 1 g | %VD*'   [cab]
```

### Focus Colina (`focus-colina`) — 9 linha(s) alterada(s)

```
~ Valor energético: 1,7 kcal = 7 kJ | 0%  →  0 kcal = 0 kJ | 0%
~ Proteínas: 0,4 g | 0%  →  0 g | 0%
+ L-tirosina: 290 mg |    [linha nova]
+ L-teanina: 115 mg |    [linha nova]
+ L-carnitina: 95 mg |    [linha nova]
- Tirosina: 290 mg |    [linha removida ou renomeada]
- L-Carnitina: 95 mg |    [linha removida ou renomeada]
- Teanina: 115 mg |    [linha removida ou renomeada]
~ cabeçalho: 'Quantidade por porção | %VD*' → '| 1 g | %VD*'   [cab]
```

### Multi Vitta — Gestante e Lactante em Cápsula (`multi-vitta-gestante-e-lactante-em-capsula`) — 2 linha(s) alterada(s)

```
~ Niacina: 8 mg NE | PENDENTE | PENDENTE  →  8 mg NE | 44% | 47%
~ cabeçalho: 'Quantidade por porção | %VD* gestantes | %VD* lactantes' → '| 1 g | %VD* gestantes | %VD* lactantes'   [cab]
```

### Melatonina + Triptofanos (Encapsulados) (`melatonina-triptofanos-encapsulados`) — 9 linha(s) alterada(s)

```
~ Valor energético: 2,8 kcal = 12 kJ | 0%  →  0 kcal = 0 kJ | 0%
~ Proteínas: 0,7 g | 1%  →  0 g | 0%
+ L-triptofano: 500 mg |    [linha nova]
+ L-glutamina: 95 mg |    [linha nova]
+ Ácido L-aspártico: 100 mg |    [linha nova]
- Triptofano: 500 mg |    [linha removida ou renomeada]
- Glutamina: 95 mg |    [linha removida ou renomeada]
- Aspartato: 100 mg |    [linha removida ou renomeada]
~ cabeçalho: 'Quantidade por porção | %VD*' → '| 1 g | %VD*'   [cab]
```

### Serena (`serena`) — 7 linha(s) alterada(s)

```
~ Valor energético: 1 kcal = 4,1 kJ | 0%  →  0 kcal = 0 kJ | 0%
~ Carboidratos: 0,2 g | 0%  →  0 g | 0%
~ Proteínas: 0,1 g | 0%  →  0 g | 0%
+ L-teanina: 60 mg |    [linha nova]
~ Sódio: 0,32 mg | 0%  →  0 mg | 0%
- Teanina: 60 mg |    [linha removida ou renomeada]
~ cabeçalho: 'Quantidade por porção | %VD*' → '| 1 mL | %VD*'   [cab]
```

### Detox Matinal (Lemon Shot) 300 g (`detox-matinal-lemon-shot-300g`) — 1 linha(s) alterada(s)

```
~ cabeçalho: 'Quantidade por porção | %VD*' → '| 10 g | %VD*'   [cab]
```

### Saúde Intestinal (Floravex) (`saude-intestinal`) — 6 linha(s) alterada(s)

```
~ Valor energético: 2,2 kcal = 9,2 kJ | 0%  →  0 kcal = 0 kJ | 0%
~ Carboidratos: 0,4 g | 0%  →  0 g | 0%
+ L-glutamina: 135 mg |    [linha nova]
+ Quercetina: 69 mg |    [linha nova]
- Glutamina: 135 mg |    [linha removida ou renomeada]
~ cabeçalho: 'Quantidade por porção | %VD*' → '| 1 g | %VD*'   [cab]
```

### Moro Slim (`moro-slim`) — 2 linha(s) alterada(s)

```
~ Valor energético: 2,8 kcal = 12 kJ | 0%  →  0 kcal = 0 kJ | 0%
~ cabeçalho: 'Quantidade por porção | %VD*' → '| 1 g | %VD*'   [cab]
```

### Pro Energy (`pro-energy`) — 7 linha(s) alterada(s)

```
~ Valor energético: 1 kcal = 4,2 kJ | 0%  →  0 kcal = 0 kJ | 0%
~ Carboidratos: 0,3 g | 0%  →  0 g | 0%
+ L-arginina: 62 mg |    [linha nova]
+ L-carnitina: 89 mg |    [linha nova]
- Arginina: 62 mg |    [linha removida ou renomeada]
- L-Carnitina: 89 mg |    [linha removida ou renomeada]
~ cabeçalho: 'Quantidade por porção | %VD*' → '| 1 g | %VD*'   [cab]
```

### Emagrecedor em Cápsula (`emagrecedor-em-capsula`) — 2 linha(s) alterada(s)

```
~ Valor energético: 3,5 kcal = 15 kJ | 0%  →  0 kcal = 0 kJ | 0%
~ cabeçalho: 'Quantidade por porção | %VD*' → '| 1 g | %VD*'   [cab]
```

### Slim Up — Emagrecimento em Gota (`slim-up-emagrecimento-em-gota`) — 3 linha(s) alterada(s)

```
~ Valor energético: 0,7 kcal = 2,8 kJ | 0%  →  0 kcal = 0 kJ | 0%
~ Sódio: 0,27 mg | 0%  →  0 mg | 0%
~ cabeçalho: 'Quantidade por porção | %VD*' → '| 1 mL | %VD*'   [cab]
```

### Shot + Colágeno 300 g (`shot-colageno-300-gramas`) — 2 linha(s) alterada(s)

```
~ Sódio: 0 mg | 0%  →  PENDENTE | 
~ cabeçalho: 'Quantidade por porção | %VD*' → '| 10 g | %VD*'   [cab]
```

### Ômega Pró TG (`omega-pro-tg`) — 2 linha(s) alterada(s)

```
+ Gorduras poli-insaturadas: PENDENTE |    [linha nova]
~ cabeçalho: 'Quantidade por porção | %VD*' → '| 1 g | %VD*'   [cab]
```

### Bella Gummy (Biotina em Gummy) (`bella-gummy-biotina-em-gummy`) — 3 linha(s) alterada(s)

```
+ Poliois totais: PENDENTE |    [linha nova]
- Polióis totais: PENDENTE |    [linha removida ou renomeada]
~ cabeçalho: 'Quantidade por porção | %VD*' → '| 6 g | %VD*'   [cab]
```

### Creatina Monoidratada 150 g Solúvel (`creatina-monohidratada-150g-soluvel`) — 1 linha(s) alterada(s)

```
~ cabeçalho: 'Quantidade por porção | %VD*' → '| 4 g | %VD*'   [cab]
```

### Creatina Monoidratada 300 g Solúvel (`creatina-monohidratada-300g-soluvel`) — 1 linha(s) alterada(s)

```
~ cabeçalho: 'Quantidade por porção | %VD*' → '| 4 g | %VD*'   [cab]
```

### Creatina Gummy sabor Frutas Vermelhas (`creatina-gummy-sabor-frutas-vermelhas`) — 5 linha(s) alterada(s)

```
~ Valor energético: 9,2 kcal = 39 kJ | 0%  →  9 kcal = 39 kJ | 0%
+ Poliois totais: 2,5 g |    [linha nova]
~ Sódio: 0 mg | 0%  →  PENDENTE | 
- Polióis totais: 2,5 g |    [linha removida ou renomeada]
~ cabeçalho: 'Quantidade por porção | %VD*' → '| 6 g | %VD*'   [cab]
```

### Creatina em Gummy sabor Tutti-frutti (`creatina-em-gummy-sabor-tutti-frutti`) — 5 linha(s) alterada(s)

```
~ Valor energético: 9,2 kcal = 39 kJ | 0%  →  9 kcal = 39 kJ | 0%
+ Poliois totais: 2,5 g |    [linha nova]
~ Sódio: 0 mg | 0%  →  PENDENTE | 
- Polióis totais: 2,5 g |    [linha removida ou renomeada]
~ cabeçalho: 'Quantidade por porção | %VD*' → '| 6 g | %VD*'   [cab]
```

### Melatonina em Gummy sabor Uva (`melatonina-em-gummy-sabor-uva`) — 5 linha(s) alterada(s)

```
+ Poliois totais: PENDENTE |    [linha nova]
+ L-triptofano: 750 mg |    [linha nova]
- Polióis totais: PENDENTE |    [linha removida ou renomeada]
- Triptofano: 750 mg |    [linha removida ou renomeada]
~ cabeçalho: 'Quantidade por porção | %VD*' → '| 6 g | %VD*'   [cab]
```

### Pré-treino 300 g (`pre-treino-300-g`) — 6 linha(s) alterada(s)

```
~ Valor energético: 17 kcal = 73 kJ | 1%  →  11 kcal = 44 kJ | 1%
+ L-tirosina: 400 mg |    [linha nova]
+ L-arginina: 1.019 mg |    [linha nova]
- Tirosina: 400 mg |    [linha removida ou renomeada]
- Arginina: 1.019 mg |    [linha removida ou renomeada]
~ cabeçalho: 'Quantidade por porção | %VD*' → '| 10 g | %VD*'   [cab]
```

### Pré-treino + Creatina sabor Limão 420 g (Césio 137) (`pre-treino-creatina-sabor-limao-420g`) — 8 linha(s) alterada(s)

```
~ Valor energético: 22 kcal = 91 kJ | 1%  →  12 kcal = 52 kJ | 1%
+ L-tirosina: 999 mg |    [linha nova]
+ L-arginina: 1.019 mg |    [linha nova]
+ L-carnitina: 994 mg |    [linha nova]
- Tirosina: 999 mg |    [linha removida ou renomeada]
- Arginina: 1.019 mg |    [linha removida ou renomeada]
- L-Carnitina: 994 mg |    [linha removida ou renomeada]
~ cabeçalho: 'Quantidade por porção | %VD*' → '| 14 g | %VD*'   [cab]
```

Total: 106 alterações de conteúdo nas 24 tabelas (inclui o cabeçalho da coluna, alterado em todas).

## Conferência automática

`scratchpad/fase3/tabelas.py` → `atual.verificar`: 827 conferências OK, 0 problema(s) — ordem do Anexo XI, cabeçalho e rodapé, arredondamento do Anexo III, %VD pelo Anexo VIII (recalculado de forma independente), célula vazia sem VDR, marcação de PENDENTE e presença das dez linhas obrigatórias, nas 24 tabelas.

Verificação dos JSONs de entrada (`scratchpad/fase3/verificar.py` → `verificacao.md`, 16/09/2026): 35 registros, todos de categoria justificada — 22 'representação' (o campo `teor_pct` traz o doseamento do laudo e o ativo aplica o fator sal→base/potência declarado na conta), 6 'critério' de base do %VD (resolvido pela regra 5), 5 'critério' de kJ (resolvido pela regra 4), 1 'alta' que é o NÃO RESOLVIDO do Ômega Pró TG (lipídeos totais 1 g contra mínimo de 5 g — interpretação pendente do RT) e 1 'baixa' (pct_do_maximo de uma linha isolada de cafeína no Pro Energy; a soma do constituinte é a que vale).
