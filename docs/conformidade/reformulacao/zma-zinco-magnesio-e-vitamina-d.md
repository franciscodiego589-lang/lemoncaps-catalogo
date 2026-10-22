# Reformulação regulatória — ZMA (Zinco, Magnésio e Vitamina B6) (`zma-zinco-magnesio-e-vitamina-d`)

> **Nota de consolidação (fase 3, 16/09/2026).** Este memorial foi verificado (script `scratchpad/fase3/verificar.py`, resultado em `scratchpad/fase3/verificacao.md`) e harmonizado com os outros 23 produtos. O que vale para o catálogo é a versão consolidada: `docs/conformidade/REFORMULACAO-CONSOLIDADA-2026-09-16.md` (decisões, laudos e insumos), `docs/conformidade/TABELAS-NUTRICIONAIS-2026-09-16.md` (tabela pronta para a arte) e a migration `supabase/migrations/20260922000000_reformulacao_conforme_normas.sql` (não aplicada). As decisões técnicas deste memorial foram mantidas; a fase 3 corrigiu só o que segue.
>
> **Correções neste produto:** nenhum número, lote ou teor alterado (o kJ da tabela passa de 2,6 para 2,5 pelo critério abaixo).
>
> **Convenções harmonizadas (valem para os 24):**
> - kJ = kcal × 4,184 (o memorial usava 17 kJ/g; o Anexo XXII da IN 75/2020, lido no AnvisaLegis em 16/09/2026, só traz fatores em kcal/g).
> - %VD calculado sobre a quantidade declarada (arredondada), não sobre o ativo exato; célula de açúcares totais em branco (sem VDR).
> - Nomes na tabela: os do gabarito/Anexo XI (Tiamina, Riboflavina, Niacina, Biotina, Ácido fólico, Ácido pantotênico; aminoácidos com o nome do Anexo III, sob Proteínas).
> - Linhas de composição do catálogo: quantity = massa do insumo pesado (sal/forma comercial), como o dono decidiu em 20260915140000; o nome traz a forma do Anexo I e a equivalência em ativo ("Bisglicinato de zinco (equivalente a 15 mg de zinco)"); o fragmento SQL deste memorial gravava o elemento — a conta é a mesma, muda só a convenção da linha.
> - Campo `teor_pct` do JSON = doseamento do laudo; o teor efetivo (ativo ÷ massa, com o fator sal→base ou potência) é registrado à parte (`teor_efetivo_pct`) na migration.
> - Advertências gravadas na mesma ordem e com as mesmas frases literais em todos os produtos: art. 14 da RDC 243/2018 (c, d, e) → público (a) → modo de uso (b) → frases do Anexo VI da IN 28/2018 exigidas pelos constituintes presentes → alergênicos → conservação (inciso II).

**Data:** 16/09/2026. **Fase 2 da conformidade do catálogo Lemon Caps** (ordem do dono: "altere os insumos para os permitidos; pode refazer as formulações para todas estarem dentro das normas"). Documento para o dono e para o RT (Anderson C. Barbosa, CRF/MT 5526). Nada foi gravado no banco; as três entregas deste produto são este memorial, o JSON `scratchpad/fase2/zma-zinco-magnesio-e-vitamina-d.json` e o fragmento SQL `scratchpad/fase2/zma-zinco-magnesio-e-vitamina-d.sql`, todos criados em disco e não aplicados.

**Fontes usadas (todas lidas nesta data, caminhos absolutos no rodapé):** IN 28/2018 nos anexos literais I, III, IV e VI (texto consolidado vigente até a IN 450/2026, lido em 16/09/2026); auditoria de 15/09/2026; composição do rótulo (`composicoes_rotulo.json`, extração de 13/09/2026); memorial de cálculo da fábrica (`memoriais-formulacoes.json`, 16/09/2026); inventário de laudos (`laudos.json`, 308 certificados, 16/09/2026); gabarito da tabela nutricional (RDC 429/2020 + IN 75/2020, 16/09/2026) e `vd.json`; cadastro vivo do catálogo (chave pública, lido em 16/09/2026).

**Convenção de procedência, em todo número deste documento:** *lido* = copiado da fonte nomeada; *calculado* = conta aritmética mostrada; *assumido* = marcado como tal ao lado do número (teor estequiométrico do sal puro quando não há laudo). Dado não confirmado fica marcado **PROVISÓRIO** ou **PENDENTE**.

## 1. Identificação

- **Nome:** ZMA (Zinco, Magnésio e Vitamina B6) (nome no rótulo/mercado: ZMA complex (arte ZmaComplex.pdf)).
- **Slug:** `zma-zinco-magnesio-e-vitamina-d`.
- **Formato:** cápsula gelatinosa dura, tamanho 0 (memorial rev02).
- **Porção declarada:** 1 g (2 cápsulas) — 1.000 mg de conteúdo por porção (500 mg de pó por cápsula; cápsula vazia de 98,45 mg fora da porção). Sem mudança de porção proposta.
- **Público-alvo / grupo populacional dos Anexos III e IV:** adultos, coluna "> 19 anos" dos Anexos III e IV.
- **Porções por embalagem:** 30.

O nome do catálogo cita vitamina B6 e o slug cita vitamina D; a fórmula real tem as duas (memorial rev02). O cadastro vivo já reflete a planilha PROPOSTA rev01 (não assinada) — 673,055 mg de bisglicinato de magnésio, 119,02 mg de bisglicinato de zinco e 50 µg de D3 — que diverge do rótulo impresso (500 mg, 75 mg, 25 µg) e do memorial rev02. Esta reformulação parte do rótulo e do memorial rev02, que é o que a fábrica pesa.

## 2. Antes — composição atual e veredito da auditoria por insumo

Fonte da tabela: composição impressa no rótulo (`composicoes_rotulo.json`, chave `zma_complex`, 7 itens), com o veredito da auditoria de 15/09/2026 (seção 4.13) e a observação do memorial rev02.

| # | Insumo (como está na fonte) | Quantidade | Veredito da auditoria (15/09/2026) e observação do memorial da fábrica |
|---|---|---|---|
| 1 | Magnésio glicinato (sal) 500 mg — tabela: magnésio 152 mg (36% VD) | 500 mg de sal | CONFORME (152 mg; 63–350). Memorial: 500 mg × 30,22% = 151,1 mg; laudo lote 90844 VENCIDO (21/06/2025); segundo laudo (088629) também vencido. |
| 2 | Dióxido de silício (INS 551) | 217,1 mg | aditivo, quantum satis; a auditoria observou que 21,7% de antiumectante é 'dose de enchimento'. Memorial rev02: 207,47 mg q.s.p. |
| 3 | L-teanina | 150 mg | NÃO VERIFICADO (origem). Memorial: lote AUTO039250 (Lepuge), laudo lido em 16/09: 'SÍNTESE QUÍMICA' — forma não autorizada. |
| 4 | Bisglicinato de zinco (sal) 75 mg — tabela: zinco 15 mg (136% VD) | 75 mg de sal | CONFORME. Memorial: 75,41 mg a 19,89% (lote 055-ZN/25, válido). |
| 5 | Quelato de boro (glicinato de boro) 56,6 mg — elemento não declarado | 56,6 mg de sal | FORMA NÃO AUTORIZADA. Memorial: 57,36 mg a 5,23% = 3,0 mg de B (lote 044951, laudo lido por imagem: glicinato sintético). |
| 6 | Vitamina B6 (cloridrato de piridoxina) | 1,3 mg (100% VD) | CONFORME pelo número; MAS o rótulo declara a massa do sal como vitamina — entrega real 1,07 mg (82% VD), correção já apontada pelo memorial rev02. |
| 7 | Vitamina D3 (colecalciferol) | 25 mcg (167% VD) | CONFORME. Memorial: 8,70 mg de pó a 115.000 UI/g (lote 91408). |

Soma impressa: 1.000,025 mg (arredondamento do rótulo). O memorial rev02 fecha em 1.000,00 mg com 207,47 mg de dióxido de silício. Dois problemas de forma (boro e L-teanina), um de laudo (magnésio vencido) e um de rótulo (B6 declarada como massa do sal).

## 3. Depois — composição proposta, insumo a insumo

Grupo "> 19 anos". Mesmas doses do rótulo para magnésio, zinco, B6 e D3 (todas na faixa e com folga), formas trocadas para boro e L-teanina. Massas derivadas do teor do laudo do lote nomeado; onde não há laudo, teor estequiométrico assumido.

| # | Constituinte (Anexo I) | Forma / insumo comercial | Massa do insumo (mg/porção) | Teor (% e fonte) | Ativo por porção | Mín. | Máx. | % do máx. | Linha do anexo | Laudo (lote · validade · vencido?) | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Magnésio | Bisglicinato de magnésio (laudo: 'Magnésio Glicinato 30%', CAS 14783-68-7) | 500,000 | 30,22% Mg tal qual — laudo lote 90844 (30,38% base seca × (1 − 0,54%)), VENCIDO em 21/06/2025 — último teor conhecido | 151,100 mg | 63,00 mg | 350,00 mg | 43,2% | I·Bisglicinato de magnésio; III/IV·Magnésio | 90844 (Analitic, fabricante 66342023062230) · 21/06/2025 · VENCIDO — pedir laudo novo antes de pesar | mantido |
| 2 | Teanina | L-teanina de folhas de Camellia sinensis — insumo a adquirir (rota B) | 150,000 | 100% — assumido; o laudo do lote em estoque (AUTO039250) não serve: 'SÍNTESE QUÍMICA' | 150,000 mg | 50,00 mg | 250,00 mg | 60,0% | I·L-teanina de folhas de Camellia sinensis (IN 318/2024); III/IV·Teanina | AUTO039250 (Lepuge, fabricante 202408145) — SÍNTESE QUÍMICA, não serve · 13/08/2027 · em dia — laudo lido em 16/09/2026: 'Forma de Obtenção: SÍNTESE QUÍMICA'; a única forma autorizada é a de folhas de Camellia sinensis | forma trocada (origem) — PENDENTE laudo |
| 3 | Zinco | Bisglicinato de zinco (CAS 14281-83-5) | 75,415 | 19,89% Zn tal qual — laudo lote 055-ZN/25 (20,00% b.s. × (1 − 0,54%)) | 15,000 mg | 1,65 mg | 29,59 mg | 50,7% | I·Bisglicinato de zinco; III/IV·Zinco | 055-ZN/25 (Galena, CIQ 2505027507) · 06/05/2027 · em dia — resultado 20,00% no limite inferior da especificação 20,00–23,00% | mantido |
| 4 | Boro | Tetraborato de sódio decahidratado (CAS 1303-96-4) — insumo a adquirir | 26,459 | 11,34% B — assumido (estequiométrico, Na2B4O7·10H2O puro); sem laudo | 3,000 mg | NE | 8,87 mg | 33,8% | I·Tetraborato de sódio decahidratado (IN 76/2020); III·Boro NE; IV·Boro 8,866 mg | sem laudo — insumo a adquirir | forma trocada |
| 5 | Vitamina B6 | Cloridrato de piridoxina (CAS 58-56-0) | 1,582 | 99,9% — laudo lote 91188; × 82,27% (piridoxina/cloridrato, estequiométrico) | 1,300 mg | 0,26 mg | 98,60 mg | 1,3% | I·Cloridrato de piridoxina; III/IV·Vitamina B6 | 91188 (Analitic, fabricante 241229T092) · 28/12/2027 · em dia | mantido |
| 6 | Vitamina D | Vitamina D3 (colecalciferol), pó 100.000 UI/g (CAS 67-97-0) | 8,696 | 115.000 UI/g — laudo lote 91408 (potência ensaiada); 1 µg = 40 UI | 25,000 µg | 3,00 µg | 50,00 µg | 50,0% | I·Vitamina D3 (Colecalciferol); III/IV·Vitamina D | 91408 (Analitic, fabricante 2025111601) · 15/11/2028 · em dia | mantido |

**Excipientes e veículo (não são constituintes; conferidos contra a IN 211/2023 na auditoria de 15/09 apenas para o dióxido de silício, ácido cítrico, sucralose e corantes — os demais estão marcados como pendência de conferência):**

- Dióxido de silício (antiumectante) (INS 551) — 237,85 mg — q.s.p. 1.000 mg — quantum satis (IN 211/2023, 14.2, auditoria de 15/09). Continua sendo fração alta (a auditoria já apontou 21,7% como 'enchimento'); ver pendência 5.
- Cápsula: gelatina, água purificada, corante dióxido de titânio e lauril sulfato de sódio (INS 171) — q.s.p. — invólucro de 98,45 mg (Qualicaps/Genix, lote 2505380SA, val. 02/04/2030, memorial rev02); o rótulo omite o lauril sulfato de sódio que o memorial atribui à cápsula — confirmar com o fabricante da cápsula

**Soma da porção:** insumos 762,15 mg + excipientes 237,85 mg = **1.000,00 mg de 1.000 mg (100,0%)**. Cabe; o excipiente continua alto (23,8%) porque a fórmula de 5 ativos pequenos mais o magnésio não preenche 1 g — o mesmo desenho do rótulo vigente (21,7% de antiumectante).

**Retirados da fórmula:**

- **Glicinato de boro 56,6 mg** — substituído por tetraborato de sódio decahidratado (forma não autorizada; ver tabela). **L-teanina sintética (lote AUTO039250)** — substituída pela de folhas de Camellia sinensis (rota B); o lote em estoque não pode ser usado.

## 4. Mudanças e motivos

- Boro: 'quelato de boro (glicinato de boro)' 56,6 mg → tetraborato de sódio decahidratado 26,46 mg (3 mg de boro) — motivo: Anexo I só lista frutoborato de cálcio e tetraborato de sódio decahidratado; o rótulo passa a declarar o elemento (3 mg) na tabela.
- L-teanina: origem sintética (Lepuge, AUTO039250) → "L-teanina de folhas de Camellia sinensis", mesma dose de 150 mg — motivo: Anexo I (IN 318/2024) só autoriza a de folhas de Camellia sinensis; o laudo do lote em uso diz 'SÍNTESE QUÍMICA'. Insumo a adquirir (rota B, ver seção 8).
- Vitamina B6: massa 1,30 → 1,58 mg de cloridrato para entregar 1,3 mg de piridoxina — motivo: o rótulo tratava a massa do sal como vitamina (entrega real 1,07 mg), erro já apontado no memorial rev02.
- Magnésio: mantido (500 mg de bisglicinato = 151,1 mg de Mg) — condição: laudo novo, pois o lote 90844 venceu em 21/06/2025; a massa deve ser recalculada pelo teor do laudo novo.
- Zinco e vitamina D3: mantidos (laudos válidos; 50,7% e 50,0% dos tetos).
- Tabela nutricional: passa a declarar boro (3 mg, %VD vazio) e teanina (150 mg, %VD vazio), que o rótulo vigente omite embora o memorial rev02 já pedisse.

## 5. Tabela nutricional no padrão ANVISA vigente (RDC 429/2020 + IN 75/2020)

Coluna "> 19 anos" (adultos) do Anexo VIII da IN 75/2020. Boro e teanina não têm VDR — células de %VD vazias (RDC 429/2020, art. 12, §1º).

**INFORMAÇÃO NUTRICIONAL**

Porções por embalagem: 30
Porção: 1 g (2 cápsulas)

| Item | Quantidade por porção | %VD* (adultos) |
|---|---|---|
| Valor energético | 0,6 kcal = 2,6 kJ  | 0% |
| Carboidratos | 0 g | 0% |
| Açúcares totais | 0 g | 0% |
| Açúcares adicionados | 0 g | 0% |
| Proteínas | 0,2 g | 0% |
| Gorduras totais | 0 g | 0% |
| Gorduras saturadas | 0 g | 0% |
| Gorduras trans | 0 g | 0% |
| Fibras alimentares | 0 g | 0% |
| Sódio | 3,2 mg | 0% |
| Vitamina D | 25 µg | 167% |
| Vitamina B6 | 1,3 mg | 100% |
| Magnésio | 151 mg | 36% |
| Zinco | 15 mg | 136% |
| Teanina | 150 mg |  |
| Boro | 3 mg |  |

*Percentual de valores diários fornecidos pela porção

**Conta do valor energético e do sódio (calculado):** Valor energético calculado (fatores de Atwater da IN 75/2020, Anexo XXII: proteínas e carboidratos 4 kcal/g = 17 kJ/g; gorduras 9 kcal/g = 37 kJ/g): proteínas 150,0 mg → 0,60 kcal; carboidratos 0,0 mg → 0,00 kcal; gorduras 0,0 mg → 0,00 kcal; total 0,60 kcal = 2,55 kJ. Sódio calculado: 3,19 mg. A L-teanina (150 mg, aminoácido) é contada como proteína pelo fator 4 kcal/g — 0,6 kcal, abaixo de 4 kcal (não significativo, %VD zero). O sódio vem só do tetraborato (12,06% de Na): 3,19 mg, abaixo de 5 mg.

**Regras aplicadas (gabarito de 16/09/2026):** título "INFORMAÇÃO NUTRICIONAL"; porção = recomendação diária (RDC 429/2020, art. 9º, VI); %VD pelo Anexo VIII da IN 75/2020 para o grupo do rótulo (art. 12, §4º); constituinte sem VDR fica com a célula de %VD vazia (art. 12, §1º); quantidade não significativa (Anexo IV da IN 75: ≤ 4 kcal, ≤ 0,5 g de carboidratos/açúcares/proteínas/gorduras totais, ≤ 0,1 g de saturadas/trans, ≤ 5 mg de sódio) recebe %VD zero (art. 12, §2º); arredondamento pelo Anexo III da IN 75 na paráfrase do gabarito — ≥ 10: inteiro; 1 a 10: uma casa (inteiro se a casa for 0); < 1 em g: uma casa; < 1 em mg/µg: duas casas (uma se a segunda for 0) — regra não confirmada literalmente, ver pendência do gabarito; %VD arredondado ao inteiro (convenção; a regra literal de arredondamento do %VD não consta do gabarito). O valor energético seguiu as mesmas faixas (o gabarito diz não haver linha própria, sem confirmação literal). Rodapé literal do art. 12, §5º da RDC 429/2020.

## 6. Lista de ingredientes proposta

Ordem decrescente de massa por porção (massa do insumo comercial, não do elemento), nomes técnicos e INS dos aditivos, seguida da declaração de alergênicos (RDC 26/2015).

> Bisglicinato de magnésio, antiumectante dióxido de silício (INS 551), L-teanina de folhas de Camellia sinensis, bisglicinato de zinco, tetraborato de sódio decahidratado, colecalciferol (vitamina D3), cloridrato de piridoxina (vitamina B6) e cápsula: gelatina, água purificada e corante dióxido de titânio (INS 171).

Nenhum insumo deriva dos alergênicos da RDC 26/2015. Sem declaração de glúten até haver laudo do produto acabado.

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
- "Este produto não deve ser consumido por gestantes, lactantes e crianças." — IN 28/2018, Anexo VI: exigida duas vezes, pela linha "Aminoácidos" (L-teanina) e pela linha "Boro" (IN 76/2020). O texto é o mesmo nas duas linhas.

**O que falta hoje no cadastro/rótulo:** nada falta em texto: o campo `warnings` já traz as três frases do art. 14 e a frase genérica do Anexo VI.

## 8. Pendências e decisões do dono/RT

1. **Laudo novo de bisglicinato de magnésio** (lote em estoque 90844 venceu em 21/06/2025; o alternativo 088629 venceu em 12/01/2024). Sem laudo vigente, o insumo de maior massa da fórmula não pode ser pesado com teor confirmado. Recalcular 500 mg pelo teor do laudo novo (se o teor for 30,0%, a entrega cai para 150,0 mg — ainda conforme).
2. **L-teanina — decisão do dono:** rota B (proposta principal: comprar "L-teanina de folhas de Camellia sinensis", especificação Blue California, e obter laudo que declare a origem botânica) ou rota A (retirar; a chamada do rótulo perderia a L-teanina e sobrariam 388 mg de excipiente — ver alternativa). Em nenhuma rota o lote AUTO039250 pode ser usado.
3. **Fonte de boro:** comprar tetraborato de sódio decahidratado (26,46 mg para 3 mg de B, estequiométrico) ou frutoborato de cálcio (massa pelo laudo do fabricante). Alternativa: retirar o boro (o ZMA não depende dele; a advertência genérica continuaria exigida pela teanina).
4. **Rótulo:** declarar boro (3 mg) e L-teanina (150 mg) na tabela; corrigir vitamina B6 (o rótulo trata 1,3 mg de sal como vitamina); trocar 'quelato de boro (glicinato de boro)' por 'tetraborato de sódio decahidratado'; trocar 'L-teanina' por 'L-teanina de folhas de Camellia sinensis'; 'magnésio glicinato' pode permanecer como sinônimo comercial, mas a lista de ingredientes deve usar o nome do Anexo I (bisglicinato de magnésio); confirmar se a cápsula tem lauril sulfato de sódio.
5. **Excipiente:** 238 mg de dióxido de silício (23,8%) — decisão do RT entre manter (quantum satis) e usar agente de massa; ou subir o magnésio (alternativa abaixo).

**Alternativas registradas (não são a proposta principal):**

- **Rota A da L-teanina (retirar):** a fórmula fica com 5 constituintes (Mg, Zn, B, B6, D3) somando ~612 mg + 388 mg de excipiente; veredito condicionado só ao laudo de magnésio e à fonte de boro; a chamada do rótulo teria de mudar.
- **Subir o magnésio para 200 mg** (661,8 mg de bisglicinato a 30,22%): 57,1% do teto, reduz o excipiente a ~76 mg. A planilha PROPOSTA rev01 da própria fábrica (14–15/09/2026, não assinada) e o dossiê 'ZMA Night' já trazem 673,055 mg de sal (≈203 mg de Mg) — mas a regra desta fase é manter dose que já está na faixa com folga; fica como opção do dono.
- **Retirar o boro** em vez de comprar a fonte autorizada.

## 9. Veredito esperado após a reformulação

**CONFORME CONDICIONADO A (laudo de origem Camellia sinensis da L-teanina nova; laudo novo do bisglicinato de magnésio; aquisição de tetraborato de sódio decahidratado ou frutoborato de cálcio com laudo)**

Com a composição da seção 3, todas as formas são do Anexo I, todas as doses ficam entre o mínimo e 60% do teto (a mais alta é a teanina, 60,0%), e a porção fecha em 1.000 mg. Três condições impedem o CONFORME pleno hoje: a L-teanina autorizada ainda não foi comprada (todos os 5 laudos de L-teanina da máquina são sintéticos ou sem origem), o magnésio não tem laudo vigente e a fonte de boro autorizada não existe na máquina. Se o dono optar pela rota A (retirar a teanina), restam duas condições.

---

**Arquivos-fonte (caminhos absolutos):**

- `/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/IN28-2018-ANEXO-I-LITERAL.md`
- `/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/IN28-2018-ANEXO-III-LITERAL.md`
- `/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/IN28-2018-ANEXOS-IV-V-VI-LITERAL.md`
- `/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/AUDITORIA-ROTULO-VS-ANVISA-2026-09-15.md (seção 4.13)`
- `/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/composicoes_rotulo.json (chave zma_complex)`
- `/private/tmp/claude-501/-Users-diegofrancisco-Downloads-erp-espa-o/c5ed6b00-4553-4992-b469-c649af084651/scratchpad/fase1/memoriais-formulacoes.json (chave zma-zinco-magnesio-e-vitamina-d — MEMORIAL-CALCULO-ZMA-COMPLEX-rev02.docx)`
- `/private/tmp/claude-501/-Users-diegofrancisco-Downloads-erp-espa-o/c5ed6b00-4553-4992-b469-c649af084651/scratchpad/fase1/laudos.json (índices 19, 21, 37, 185, 197, 203, 210, 212)`
- `/Users/diegofrancisco/Desktop/LAUDOS/VITAMINA D3 COLECALCIFEROL.pdf (compilação Lepuge; bloco L-TEANINA lote AUTO039250: 'Forma de Obtenção: SÍNTESE QUÍMICA')`
- `/Users/diegofrancisco/Downloads/lemoncaps-catalogo/docs/conformidade/PADRAO-ANVISA-TABELA-NUTRICIONAL-2026-09-16.md e scratchpad/padrao-anvisa/vd.json`
- `cadastro vivo: formulas?slug=eq.zma-zinco-magnesio-e-vitamina-d e formula_compositions (6 linhas ativas, lidas em 16/09/2026 — cadastro já reflete a PROPOSTA rev01: 673,055 mg de bisglicinato, 119,02 mg de zinco, 50 µg de D3)`
