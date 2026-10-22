# Composições: rótulo × cadastro — banco novo ao vivo (15/09/2026)

**Data desta conferência:** 15/09/2026.
**Banco lido:** projeto Supabase novo `zjryrmqtumvaxdytvbbv` (`https://zjryrmqtumvaxdytvbbv.supabase.co`), via PostgREST com a chave pública, em 15/09/2026. Com essa chave só aparecem linhas ativas: as políticas de leitura (`formula_compositions_select`, `formulas_select`) escondem tudo que tem `deleted_at` preenchido. Por isso este documento fala sempre de **24 fórmulas ativas, 172 linhas ativas de composição e 70 insumos ativos** — os registros excluídos logicamente (3 duplicatas de fórmula e os insumos removidos em 14/09) existem no banco, mas não são visíveis por esta via.
**Fonte do rótulo:** `docs/conformidade/composicoes_rotulo.json`, extraído em 13/09/2026 das 15 artes-finais em PDF (texto em curvas, renderizadas entre 462 e 1237 DPI e lidas visualmente). Esses PDFs não estão mais nesta máquina; o JSON é a única fonte deles, e o que nele está `null` ou em `nao_legivel` fica **PENDENTE** aqui. O levantamento anterior, feito contra o banco antigo, está em `docs/conformidade/divergencias.md` (13/09/2026). Um 16.º rótulo, que não está no JSON porque o produto foi criado no banco depois da extração, foi localizado por outra frente e lido por mim em 15/09/2026 direto do PDF: `/Users/diegofrancisco/Downloads/PRÉ TREINO_CÉSIO 137_420g.pdf` (arte da gráfica, BOPP 270 × 90 mm, texto extraível) — seção 4.15.
**Nada foi escrito no banco.** Este documento é leitura e cálculo; a proposta de correção é a migration `supabase/migrations/20260920000000_composicoes_conforme_rotulo.sql`, criada em disco e **não aplicada**.

Convenção de procedência usada em todo o texto: **lido** = copiado da fonte (JSON do rótulo ou banco ao vivo); **calculado** = conversão de unidade, razão ou soma feita sobre valores lidos; **assumido** = marcado como tal, sempre ao lado do dado.

---

## 1. Resumo em números

| item | valor |
|---|---|
| fórmulas ativas no banco novo | 24 (lido) |
| linhas ativas de composição | 172 (lido) |
| insumos ativos em `ingredients` | 70 (lido) |
| rótulos extraídos no JSON | 15 (lido) |
| rótulos com fórmula ativa correspondente | 15 — 14 do JSON (Lidema não tem fórmula) + 1 PDF lido direto (Pré-treino Césio 137, 420 g) |
| fórmulas cujo cadastro **bate integralmente em quantidade** com o rótulo | 6 — BELLA GUMMY, Creatina 150 g, Creatina Gummy frutas vermelhas, Melatonina em Gummy, Serena, Pré-treino Césio 137 (420 g) |
| fórmulas com pelo menos uma diferença de quantidade ou de insumo | 9 — Biotina em Cápsula (só o colágeno removido de propósito), Detox 300 g, Saúde Intestinal, Focus Colina, Moro Slim, Multivitamínico, Pro Energy, ZMA, Dores Musculares |
| fórmulas ativas **sem** rótulo | 9 |
| insumos do rótulo que **não existem** em `ingredients` | 5 (seção 5) |
| fórmulas que entram na migration | 12 (92 linhas novas) |
| fórmulas com rótulo que ficam **fora** da migration (PENDENTES) | 2 — Biotina em Cápsula e Dores Musculares (seção 8) |
| fórmulas com selo `compliance_verified_at` hoje | 12 (seção 10) |

O padrão descrito em 13/09 continua no banco novo, linha por linha: os valores divergentes do cadastro são os tetos da ANVISA (vitamina B6 98,60 mg, zinco 29,59 mg, magnésio 350 mg, cromo 250 mcg, vitamina A 1.500 mcg, vitamina D 50 mcg), não a formulação impressa. Nenhuma dessas linhas foi corrigida entre 13/09 e 15/09; o que mudou no banco desde então foi a saída das 3 duplicatas e a remoção de 4 linhas de insumo (seção 7).

---

## 2. Mapa rótulo → fórmula, confirmado um a um

O mapa recebido foi conferido comparando, para cada rótulo, o nome, a porção, o conteúdo da embalagem e a lista de ingredientes contra `formulas.name`, `nutritional_info`, `pote_contents_description`, `net_weight` e `ingredients_list` do banco novo. Todos os 14 pares do JSON se confirmam, e o 15.º (Pré-treino Césio 137, fora do JSON) foi confirmado direto no PDF; as ressalvas estão na última coluna e não invalidam o pareamento.

| chave no JSON | arquivo | nome no rótulo | porção no rótulo | slug no banco novo | nome no banco | o que confirma | ressalva |
|---|---|---|---|---|---|---|---|
| biogummy | BioGummy.pdf | Biogummy (PELE - CABELO - UNHA) | 6 g (2 gomas), 60 gomas, 180 g | `bella-gummy-biotina-em-gummy` | BELLA GUMMY (Biotina em Gummy) | porção "6 g (2 gomas)", pote "60 Gomas", lista de ingredientes idêntica, 5 insumos iguais | `net_weight` vazio no banco (rótulo: 180 g) |
| bioprincess | BioPrincess.pdf | BioPrincess | 1 g (2 cápsulas), 60 cápsulas, 30 g | `biotina-em-capsula` | Biotina em Cápsula | porção, pote "60 Cápsulas", peso 30 g e 20 insumos iguais insumo a insumo (a fórmula "BIOPRINCESS" do banco antigo saiu do catálogo em 14/09 como duplicata) | `ingredients_list` do banco omite 6 ingredientes que o rótulo lista (seção 7) |
| creatina_po_150g | CreatinaPo.pdf | CREATINA MONOHIDRATADA | 5 g (1 scoop), 30 doses, 150 g, sem sabor | `creatina-monohidratada-150g-soluvel` | CREATINA MONOIDRATADA 150 g SOLÚVEL | peso 150 g, 30 doses, sem sabor, creatina 5.000 mg | grafia monoidratada × monohidratada (pendência já aberta) |
| detox_300g | Detox.pdf | Detox | 10 g (1 dose), 30 doses, 300 g, limão | `detox-matinal-lemon-shot-300g` | Detox Matinal (Lemon Shot) - 300g | porção "10 g (1 dose)", pote "300 Gramas", mesmos ingredientes | — |
| dreamgummy | DreamGummy.pdf | Dream Gummy (melatonina em goma) | 6 g (2 gomas), 60 gomas, 180 g, uva | `melatonina-em-gummy-sabor-uva` | Melatonina em Gummy Sabor Uva | porção, pote "60 Gomas", sabor uva, 2 insumos iguais | `ingredients_list` vazio no banco |
| floravex | Floravex-intestino.pdf | Floravex | 1 g (2 cápsulas), 60 cápsulas, 30 g | `saude-intestinal` | Saúde Intestinal | `ingredients_list` do banco é idêntica, palavra por palavra, à lista do rótulo Floravex | nome comercial diferente (Floravex × Saúde Intestinal) |
| focus_colina | FocusColina.pdf | Focus Colina | 1 g (2 cápsulas), 60 cápsulas, 30 g | `focus-colina` | FOCUS COLINA | nome, porção, mesmos 9 insumos | — |
| moroslim | MoroSlim.pdf | Moro Slim | 1 g (2 cápsulas), 60 cápsulas, 30 g | `moro-slim` | MORO SLIM | nome, porção, peso 30 g | `ingredients_list` do banco cita guaraná, que o rótulo não traz (seção 7) |
| multivitaminico | multivitaminico.pdf | Multi vitaminico | 1 g (2 cápsulas), 60 cápsulas, 30 g | `multivitaminico` | Multivitamínico | lista de ingredientes idêntica | — |
| nuviart | Nuviart.pdf | Nuviart | 1 g (2 cápsulas), 60 cápsulas, 30 g | `dores-musculares` | DORES MUSCULARES | `ingredients_list` do banco idêntica à do rótulo Nuviart | nome comercial diferente |
| pro_energy | ProEnergy.pdf | Pro Energy | 1 g (2 cápsulas), 60 cápsulas, 30 g | `pro-energy` | Pro Energy | nome, peso 30 g, lista de ingredientes equivalente | — |
| serena | Serena.pdf | Serena | 1 mL (20 gotas), 30 doses, 30 mL | `serena` | Serena | nome, porção "1 mL (20 gotas)", pote "30 ml", lista idêntica | — |
| zma_complex | ZmaComplex.pdf | ZMA complex | 1 g (2 cápsulas), 60 cápsulas, 30 g | `zma-zinco-magnesio-e-vitamina-d` | ZMA (Zinco, Magnésio e Vitamina B6) | mesmos ingredientes (ordem diferente; ver seção 7) | `net_weight` vazio |
| creatina_gummy | creatina gummy.pdf | Creatina em goma | 6 g (2 gomas), 60 gomas, 180 g, frutas vermelhas | `creatina-gummy-sabor-frutas-vermelhas` | CREATINA GUMMY SABOR FRUTAS VERMELHAS | sabor, pote "60 Gomas", creatina 3.000 mg | `nutritional_info` do banco diz "3 g (2 gomas)"; o rótulo diz 6 g (2 gomas) — 60 gomas em 180 g dão 3 g por goma, 6 g por porção (calculado) |
| lidema | Lidema.pdf | Lidema | 1 g (2 cápsulas) | *nenhum* | — | nenhuma das 24 fórmulas ativas tem esses 13 insumos | produto descartado; fora deste diff |
| *(fora do JSON)* | PRÉ TREINO_CÉSIO 137_420g.pdf | PRÉ TREINO CÉSIO 137, 420 g, sabor limão | 14 g, 30 doses, 420 g | `pre-treino-creatina-sabor-limao-420g` | Pré-treino + Creatina Sabor Limão (420 g) | porção 14 g, 420 g, 30 doses, sabor limão, modo de uso idêntico ao do banco, 13 insumos iguais | produto criado no banco em 14/09/2026 (depois da extração do JSON); o PDF tem uma 2.ª página só com marcação de verniz e o texto de frente de uma versão "150 g, sem sabor", sem composição |

---

## 3. Como ler as tabelas

- **Quantidade e unidade** de cada lado são copiadas da fonte (lido). A coluna "diferença" compara as duas em mg (calculado); quando só a unidade muda (0,9 mg = 900 mcg; 1,6 g = 1.600 mg) o resultado é "igual (só a unidade difere)".
- **Sal × elemento.** O JSON marca `e_sal: true` quando o número impresso é a massa do sal (por exemplo "bisglicinato de zinco 20 mg") e registra em `elemento_equivalente_mg` o elemento declarado na tabela nutricional do mesmo rótulo (4 mg). Quando o rótulo declara o elemento ("Magnésio (de bisglicinato de magnésio) 260 mg"), a coluna diz "elemento". Comparar massa de sal com limite de elemento produz reprovação falsa — a separação é explícita por isso.
- **Insumo canônico** é o slug em `public.ingredients` ao qual a linha aponta (`ingredient_id`). Para as linhas do rótulo, é o slug ao qual a migration ligaria a linha nova; os marcados *(novo)* não existem hoje e seriam criados (seção 5).
- **"grafia/forma do nome difere"** significa que a quantidade bate, mas o texto do insumo não é o mesmo — às vezes só maiúscula ou ordem das palavras, às vezes a **forma química** (acetato de DL-alfa-tocoferol × DL-alfa-tocoferol; metilcobalamina × cianocobalamina; selênio quelado × selenito de sódio). Os casos de forma química estão destacados nas observações de cada fórmula, porque mudam a conta de conformidade.
- O texto do rótulo aparece **sem acentos**, exatamente como está no JSON (que foi gravado em ASCII). A migration restaura a acentuação normal do português e guarda o texto original em `metadata.insumo_json` — ver seção 9, item 3.

---

## 4. Diff por fórmula

As cinco primeiras batem em quantidade; da 4.6 em diante há divergência. A 4.6 (Biotina em Cápsula) e a 4.14 (Dores Musculares) ficam fora da migration — o motivo está na seção 8.

### 4.1 BELLA GUMMY (Biotina em Gummy) × BioGummy.pdf

Slug `bella-gummy-biotina-em-gummy` · cadastro com **5** linhas ativas · rótulo com **5** insumos · **bate integralmente em quantidade**.

| # | cadastro: insumo | qtd | un. | insumo canônico | rótulo: insumo | qtd | un. | sal / elemento | diferença |
|---|---|---|---|---|---|---|---|---|---|
| 1 | vitamina C (ácido ascórbico) | 45 | mg | `vitamina-c` | Vitamina C (acido ascorbico) | 45 | mg | — | igual |
| 2 | vitamina E (acetato de DL-alfa-tocoferol) | 16,7 | mg | `vitamina-e` | Vitamina E (DL-alfa-tocoferol) | 16,7 | mg | — | igual; grafia/forma do nome difere |
| 3 | zinco (bisglicinato de zinco) | 12 | mg | `zinco` | Zinco (bisglicinato de zinco) | 12 | mg | **sal** — elemento 2,4 mg | igual |
| 4 | vitamina A (acetato de retinol) | 1020 | mcg | `vitamina-a` | Vitamina A (acetato de retinol) | 1020 | mcg | — | igual |
| 5 | biotina (D-biotina) | 45 | mcg | `biotina` | Biotina (D-biotina) | 45 | mcg | — | igual |

Observações registradas no JSON de extração para este rótulo:

- O rotulo escreve textualmente: 'zinco (bisglicinato de zinco - equivalente a 2,4 mg de zinco) 12 mg'. Os 12 mg sao massa do SAL; a tabela nutricional declara Zinco 2,4 mg (22% VD), que e o ELEMENTO.

### 4.2 CREATINA MONOIDRATADA 150 g SOLÚVEL × CreatinaPo.pdf

Slug `creatina-monohidratada-150g-soluvel` · cadastro com **1** linhas ativas · rótulo com **1** insumos · **bate integralmente em quantidade**.

| # | cadastro: insumo | qtd | un. | insumo canônico | rótulo: insumo | qtd | un. | sal / elemento | diferença |
|---|---|---|---|---|---|---|---|---|---|
| 1 | creatina monoidratada | 5000 | mg | `creatina-monoidratada` | Creatina monohidratada | 5000 | mg | — | igual; grafia/forma do nome difere |

Observações registradas no JSON de extração para este rótulo:

- Tabela traz 'Creatina (mg) 5000 mg' com %VD marcado apenas com asterisco (VD nao estabelecido)

### 4.3 CREATINA GUMMY SABOR FRUTAS VERMELHAS × creatina gummy.pdf

Bate em quantidade, mas `nutritional_info` do banco diz "1 Porção: 3 g (2 gomas)" e o rótulo diz "6 g (2 gomas)" — campo de `formulas`, fora da composição (seção 7, item 6).

Slug `creatina-gummy-sabor-frutas-vermelhas` · cadastro com **1** linhas ativas · rótulo com **1** insumos · **bate integralmente em quantidade**.

| # | cadastro: insumo | qtd | un. | insumo canônico | rótulo: insumo | qtd | un. | sal / elemento | diferença |
|---|---|---|---|---|---|---|---|---|---|
| 1 | creatina monoidratada | 3000 | mg | `creatina-monoidratada` | Creatina monohidratada | 3000 | mg | — | igual; grafia/forma do nome difere |

Observações registradas no JSON de extração para este rótulo:

- Tabela marca (**) = Valor Diario nao estabelecido

### 4.4 Melatonina em Gummy Sabor Uva × DreamGummy.pdf

Slug `melatonina-em-gummy-sabor-uva` · cadastro com **2** linhas ativas · rótulo com **2** insumos · **bate integralmente em quantidade**.

| # | cadastro: insumo | qtd | un. | insumo canônico | rótulo: insumo | qtd | un. | sal / elemento | diferença |
|---|---|---|---|---|---|---|---|---|---|
| 1 | L-triptofano | 800 | mg | `l-triptofano` | L-triptofano | 800 | mg | — | igual |
| 2 | melatonina | 0,21 | mg | `melatonina` | Melatonina | 0,21 | mg | — | igual |

Observações registradas no JSON de extração para este rótulo:

- Consta da tabela nutricional como 'L-triptofano 800 mg', sem %VD impresso
- Tabela marca (**) = Valor Diario nao estabelecido

### 4.5 Serena × Serena.pdf

Slug `serena` · cadastro com **5** linhas ativas · rótulo com **5** insumos · **bate integralmente em quantidade**.

| # | cadastro: insumo | qtd | un. | insumo canônico | rótulo: insumo | qtd | un. | sal / elemento | diferença |
|---|---|---|---|---|---|---|---|---|---|
| 1 | magnésio (cloreto de magnésio) | 63 | mg | `magnesio` | Magnesio (de cloreto de magnesio) | 63 | mg | elemento | igual; grafia/forma do nome difere |
| 2 | L-teanina de folhas de Camellia sinensis | 50 | mg | `l-teanina` | L-teanina | 50 | mg | — | igual; grafia/forma do nome difere |
| 3 | inositol (mio-inositol) | 50 | mg | `inositol` | Mio-inositol | 50 | mg | — | igual; grafia/forma do nome difere |
| 4 | vitamina B6 (cloridrato de piridoxina) | 1,3 | mg | `vitamina-b6` | Vitamina B6 (cloridrato de piridoxina) | 1,3 | mg | — | igual |
| 5 | melatonina | 0,21 | mg | `melatonina` | Melatonina | 0,21 | mg | — | igual |

Observações registradas no JSON de extração para este rótulo:

- Valor do ELEMENTO magnesio; a tabela declara Magnesio 63 mg (15% VD)
- Tabela marca (**) = Valor Diario nao estabelecido

### 4.6 Biotina em Cápsula × BioPrincess.pdf

A única diferença é o colágeno hidrolisado 120 mg, que o rótulo declara e que foi **removido do cadastro em 14/09/2026** por estar abaixo do mínimo da ANVISA para colágeno hidrolisado (8,4 g por dia, valor da auditoria de 14/09, não relido no painel nesta sessão). As outras 20 linhas batem em quantidade. O JSON marca `nao_legivel` para o fim da lista de ingredientes (coberto pela caixa da tabela nutricional na própria arte), não para a composição. Fica fora da migration (seção 8).

Slug `biotina-em-capsula` · cadastro com **20** linhas ativas · rótulo com **21** insumos · **diverge**.

| # | cadastro: insumo | qtd | un. | insumo canônico | rótulo: insumo | qtd | un. | sal / elemento | diferença |
|---|---|---|---|---|---|---|---|---|---|
| 1 | vitamina C (ácido ascórbico) | 250 | mg | `vitamina-c` | Vitamina C (acido ascorbico) | 250 | mg | — | igual |
| 2 | *ausente* | — | — | `colageno-hidrolisado` | Colageno hidrolisado | 120 | mg | — | só no rótulo (falta no cadastro) |
| 3 | L-metionina | 110 | mg | `l-metionina` | L-metionina | 110 | mg | — | igual |
| 4 | L-cisteína | 100 | mg | `l-cisteina` | L-cisteina | 100 | mg | — | igual |
| 5 | vitamina E (acetato de DL-alfa-tocoferol) | 45 | mg | `vitamina-e` | Vitamina E (DL-a-tocoferol acetato) | 45 | mg | — | igual; grafia/forma do nome difere |
| 6 | metilsulfonilmetano (MSM) | 50 | mg | `metilsulfonilmetano` | Metilsulfonilmetano (MSM) | 50 | mg | — | igual |
| 7 | ácido hialurônico | 50 | mg | `acido-hialuronico` | Acido hialuronico | 50 | mg | — | igual |
| 8 | silício orgânico (ácido ortossilícico) | 50 | mg | `silicio-organico` | Silicio organico (acido ortossilicico) | 50 | mg | — | igual |
| 9 | vitamina B3 (nicotinamida) | 35 | mg | `vitamina-b3` | Vitamina B3 (nicotinamida) | 35 | mg | — | igual |
| 10 | zinco (bisglicinato de zinco) | 15 | mg | `zinco` | Zinco (bisglicinato de zinco) | 15 | mg | elemento | igual |
| 11 | vitamina B6 (cloridrato de piridoxina) | 10 | mg | `vitamina-b6` | Vitamina B6 (cloridrato de piridoxina) | 10 | mg | — | igual |
| 12 | vitamina B5 (D-pantotenato de cálcio) | 5,64 | mg | `vitamina-b5` | Vitamina B5 (D-pantotenato de calcio) | 5,64 | mg | — | igual |
| 13 | vitamina B2 (riboflavina) | 2,74 | mg | `vitamina-b2` | Vitamina B2 (riboflavina) | 2,74 | mg | — | igual |
| 14 | vitamina A (acetato de retinol) | 1500 | mcg | `vitamina-a` | Vitamina A (acetato de retinol) | 1500 | mcg | — | igual |
| 15 | cobre (cobre quelado) | 900 | mcg | `cobre` | Cobre (cobre quelado) | 900 | mcg | — | igual |
| 16 | vitamina B9 (ácido fólico) | 400 | mcg | `vitamina-b9` | Vitamina B9 (acido folico) | 400 | mcg | — | igual |
| 17 | iodo (iodeto de potássio) | 150 | mcg | `iodo` | Iodo (iodeto de potassio) | 150 | mcg | — | igual |
| 18 | selênio (selênio quelado) | 60 | mcg | `selenio` | Selenio (selenio quelado) | 60 | mcg | — | igual |
| 19 | vitamina D3 (colecalciferol) | 50 | mcg | `vitamina-d` | Vitamina D3 (colecalciferol) | 50 | mcg | — | igual |
| 20 | biotina (D-biotina) | 45 | mcg | `biotina` | Biotina (D-biotina) | 45 | mcg | — | igual |
| 21 | vitamina B12 (metilcobalamina) | 9,94 | mcg | `vitamina-b12` | Vitamina B12 (metilcobalamina) | 9,94 | mcg | — | igual |

Observações registradas no JSON de extração para este rótulo:

- Na lista de ingredientes aparece como hialuronato de sodio
- A composicao diz 'zinco (bisglicinato de zinco) 15 mg' e a tabela declara Zinco 15 mg (136% VD): o valor e do ELEMENTO zinco, com o sal apenas entre parenteses como fonte.

### 4.7 Detox Matinal (Lemon Shot) - 300g × Detox.pdf

Slug `detox-matinal-lemon-shot-300g` · cadastro com **5** linhas ativas · rótulo com **11** insumos · **diverge**.

| # | cadastro: insumo | qtd | un. | insumo canônico | rótulo: insumo | qtd | un. | sal / elemento | diferença |
|---|---|---|---|---|---|---|---|---|---|
| 1 | *ausente* | — | — | `maltodextrina` | Maltodextrina | 6,603 | g | — | só no rótulo (falta no cadastro) |
| 2 | vitamina C (ácido ascórbico) | 1600 | mg | `vitamina-c` | Acido ascorbico (vitamina C) | 1,6 | g | — | igual (só a unidade difere); grafia/forma do nome difere |
| 3 | *ausente* | — | — | `acido-citrico` | Acido citrico (INS 330) | 0,67 | g | — | só no rótulo (falta no cadastro) |
| 4 | extrato de café verde (Coffea arabica L., semente) | 400 | mg | `extrato-de-cafe-verde` | Extrato de cafe verde (Coffea arabica L.) | 0,4 | g | — | igual (só a unidade difere); grafia/forma do nome difere |
| 5 | *ausente* | — | — | `aromatizante-identico-ao-natural-de-limao` | Aromatizante identico ao natural de limao | 0,33 | g | — | só no rótulo (falta no cadastro) |
| 6 | extrato de rizomas de cúrcuma (Curcuma longa L.) | 84,21 | mg | `extrato-de-rizomas-de-curcuma` | Extrato de rizomas de Curcuma longa L. | 0,13 | g | — | cadastro 1,54× menor; grafia/forma do nome difere |
| 7 | extrato de laranja moro (Citrus sinensis (L.) Osbeck) | 100 | mg | `extrato-de-laranja-moro` | Extrato de laranja Moro (Citrus sinensis L. Osbeck) | 0,1 | g | — | igual (só a unidade difere); grafia/forma do nome difere |
| 8 | *ausente* | — | — | `dioxido-de-silicio` | Dioxido de silicio (INS 551) | 0,1 | g | — | só no rótulo (falta no cadastro) |
| 9 | *ausente* | — | — | `edulcorante-sucralose` | Edulcorante sucralose (INS 955) | 0,05 | g | — | só no rótulo (falta no cadastro) |
| 10 | *ausente* | — | — | `corante-verde` | Corantes tartrazina (INS 102) e azul brilhante FCF (INS 133) | 0,017 | g | — | só no rótulo (falta no cadastro) |
| 11 | zinco (bisglicinato de zinco) | 8,3 | mg | `zinco` | Bisglicinato de zinco | 1,45 | mg | **sal** — elemento 0,29 mg | cadastro 5,72× o rótulo; grafia/forma do nome difere |

Observações registradas no JSON de extração para este rótulo:

- Equivale a 1600 mg; a tabela declara Vitamina C 1600 mg (1600% VD)
- Valor conjunto dos dois corantes, como escrito no rotulo
- O rotulo escreve: 'bisglicinato de zinco 1,45 mg (equivalente a 0,29 mg de zinco)'. A tabela nutricional declara Zinco 0,29 mg (3% VD), que e o ELEMENTO.

### 4.8 Saúde Intestinal × Floravex-intestino.pdf

Slug `saude-intestinal` · cadastro com **7** linhas ativas · rótulo com **11** insumos · **diverge**.

| # | cadastro: insumo | qtd | un. | insumo canônico | rótulo: insumo | qtd | un. | sal / elemento | diferença |
|---|---|---|---|---|---|---|---|---|---|
| 1 | *ausente* | — | — | `psyllium` | Psyllium (Plantago ovata, casca da semente) | 342 | mg | — | só no rótulo (falta no cadastro) |
| 2 | *ausente* | — | — | `inulina-de-cichorium-intybus *(novo)*` | Inulina de Cichorium intybus | 135 | mg | — | só no rótulo (falta no cadastro) |
| 3 | L-glutamina | 110,31 | mg | `l-glutamina` | L-glutamina | 135 | mg | — | cadastro 1,22× menor |
| 4 | extrato de rizomas de cúrcuma (Curcuma longa L.) | 130 | mg | `extrato-de-rizomas-de-curcuma` | Extrato de rizomas de Curcuma longa L. | 117 | mg | — | cadastro 1,11× o rótulo; grafia/forma do nome difere |
| 5 | *ausente* | — | — | `frutooligossacarideos *(novo)*` | Frutooligossacarideos (FOS) | 90 | mg | — | só no rótulo (falta no cadastro) |
| 6 | magnésio (bisglicinato de magnésio) | 350 | mg | `magnesio` | Magnesio (de bisglicinato de magnesio) | 90 | mg | elemento | cadastro 3,89× o rótulo; grafia/forma do nome difere |
| 7 | quercetina | 280 | mg | `quercetina` | Quercetina | 72 | mg | — | cadastro 3,89× o rótulo |
| 8 | zinco (bisglicinato de zinco) | 29,59 | mg | `zinco` | Zinco (de bisglicinato de zinco) | 13,5 | mg | elemento | cadastro 2,19× o rótulo; grafia/forma do nome difere |
| 9 | *ausente* | — | — | `dioxido-de-silicio` | Dioxido de silicio (INS 551) | 4,7 | mg | — | só no rótulo (falta no cadastro) |
| 10 | vitamina B6 (cloridrato de piridoxina) | 98,6 | mg | `vitamina-b6` | Vitamina B6 (cloridrato de piridoxina) | 1,26 | mg | — | cadastro 78,25× o rótulo |
| 11 | vitamina A (acetato de retinol) | 1500 | mcg | `vitamina-a` | Vitamina A (acetato de retinila) | 540 | mcg | — | cadastro 2,78× o rótulo; grafia/forma do nome difere |

Observações registradas no JSON de extração para este rótulo:

- Valor do ELEMENTO magnesio; a tabela declara Magnesio 90 mg (21% VD)
- Valor do ELEMENTO zinco; a tabela declara Zinco 13,5 mg (123% VD)

### 4.9 FOCUS COLINA × FocusColina.pdf

Slug `focus-colina` · cadastro com **9** linhas ativas · rótulo com **9** insumos · **diverge**.

| # | cadastro: insumo | qtd | un. | insumo canônico | rótulo: insumo | qtd | un. | sal / elemento | diferença |
|---|---|---|---|---|---|---|---|---|---|
| 1 | colina (bitartarato de colina) | 438,1375 | mg | `colina` | Colina (bitartarato de colina) | 470 | mg | — | cadastro 1,07× menor |
| 2 | L-tirosina | 262,5 | mg | `l-tirosina` | L-tirosina | 220 | mg | — | cadastro 1,19× o rótulo |
| 3 | L-teanina de folhas de Camellia sinensis | 115 | mg | `l-teanina` | L-teanina | 115 | mg | — | igual; grafia/forma do nome difere |
| 4 | L-carnitina | 95 | mg | `l-carnitina` | L-carnitina | 95 | mg | — | igual |
| 5 | magnésio (bisglicinato de magnésio) | 63 | mg | `magnesio` | Magnesio (bisglicinato de magnesio) | 60 | mg | elemento | cadastro 1,05× o rótulo |
| 6 | inositol (mio-inositol) | 25 | mg | `inositol` | Inositol (mio-inositol) | 25 | mg | — | igual |
| 7 | vitamina B6 (cloridrato de piridoxina) | 1,3 | mg | `vitamina-b6` | Vitamina B6 (cloridrato de piridoxina) | 1,3 | mg | — | igual |
| 8 | vitamina D (colecalciferol) | 50 | mcg | `vitamina-d` | Vitamina D3 (colecalciferol) | 5 | mcg | — | cadastro 10× o rótulo; grafia/forma do nome difere |
| 9 | vitamina B12 (metilcobalamina) | 9,94 | mcg | `vitamina-b12` | Vitamina B12 (cianocobalamina) | 2,4 | mcg | — | cadastro 4,14× o rótulo; grafia/forma do nome difere |

Observações registradas no JSON de extração para este rótulo:

- Valor do ELEMENTO magnesio; a tabela declara Magnesio 60 mg (14% VD)

### 4.10 MORO SLIM × MoroSlim.pdf

A linha "só no cadastro" (feno-grego em pó 450 mg) é a contraparte do extrato seco de semente de feno-grego 220 mg do rótulo: pó e extrato seco são insumos diferentes, com massas diferentes.

Slug `moro-slim` · cadastro com **6** linhas ativas · rótulo com **11** insumos · **diverge**.

| # | cadastro: insumo | qtd | un. | insumo canônico | rótulo: insumo | qtd | un. | sal / elemento | diferença |
|---|---|---|---|---|---|---|---|---|---|
| 1 | *ausente* | — | — | `extrato-seco-de-semente-de-feno-grego *(novo)*` | Extrato seco de semente de feno-grego (Trigonella foenum-graecum L.) | 220 | mg | — | só no rótulo (falta no cadastro) |
| 2 | extrato de laranja moro (Citrus sinensis (L.) Osbeck) | 340,14 | mg | `extrato-de-laranja-moro` | Extrato seco de laranja Moro (Citrus sinensis (L.) Osbeck) | 175 | mg | — | cadastro 1,94× o rótulo; grafia/forma do nome difere |
| 3 | extrato de rizomas de cúrcuma (Curcuma longa L.) | 84,21 | mg | `extrato-de-rizomas-de-curcuma` | Extrato seco de rizoma de curcuma (Curcuma longa L.) | 135 | mg | — | cadastro 1,6× menor; grafia/forma do nome difere |
| 4 | *ausente* | — | — | `espirulina` | Espirulina (Arthrospira platensis) | 122 | mg | — | só no rótulo (falta no cadastro) |
| 5 | *ausente* | — | — | `quitosana *(novo)*` | Quitosana | 122 | mg | — | só no rótulo (falta no cadastro) |
| 6 | extrato de café verde (Coffea arabica L., semente) | 123,86 | mg | `extrato-de-cafe-verde` | Extrato seco de semente de cafe verde (Coffea arabica L.) | 110 | mg | — | cadastro 1,13× o rótulo; grafia/forma do nome difere |
| 7 | *ausente* | — | — | `psyllium` | Psyllium (Plantago ovata Forssk.) | 66 | mg | — | só no rótulo (falta no cadastro) |
| 8 | *ausente* | — | — | `inulina-de-cichorium-intybus *(novo)*` | Inulina de raiz de chicoria (Cichorium intybus L.) | 44 | mg | — | só no rótulo (falta no cadastro) |
| 9 | *ausente* | — | — | `dioxido-de-silicio` | Dioxido de silicio (INS 551) | 2,474 | mg | — | só no rótulo (falta no cadastro) |
| 10 | vitamina A (acetato de retinol) | 1500 | mcg | `vitamina-a` | Vitamina A (acetato de retinol) | 1500 | mcg | — | igual |
| 11 | cromo (picolinato de cromo) | 250 | mcg | `cromo` | Cromo (picolinato de cromo) | 250 | mcg | elemento | igual |
| 12 | feno-grego em pó (Trigonella foenum-graecum L., semente) | 450 | mg | `feno-grego-em-po` | *não está no rótulo* | — | — | — | só no cadastro |

Observações registradas no JSON de extração para este rótulo:

- Valor do ELEMENTO cromo; a tabela declara Cromo 250 mcg (714% VD)

### 4.11 Multivitamínico × multivitaminico.pdf

Slug `multivitaminico` · cadastro com **19** linhas ativas · rótulo com **20** insumos · **diverge**.

| # | cadastro: insumo | qtd | un. | insumo canônico | rótulo: insumo | qtd | un. | sal / elemento | diferença |
|---|---|---|---|---|---|---|---|---|---|
| 1 | magnésio (bisglicinato de magnésio) | 260 | mg | `magnesio` | Magnesio (de bisglicinato de magnesio) | 260 | mg | elemento | igual; grafia/forma do nome difere |
| 2 | L-teanina de folhas de Camellia sinensis | 150 | mg | `l-teanina` | L-teanina | 150 | mg | — | igual; grafia/forma do nome difere |
| 3 | vitamina C (ácido ascórbico) | 533,685 | mg | `vitamina-c` | Vitamina C (acido ascorbico) | 100 | mg | — | cadastro 5,34× o rótulo |
| 4 | zinco (bisglicinato de zinco) | 15 | mg | `zinco` | Zinco (de bisglicinato de zinco) | 15 | mg | elemento | igual; grafia/forma do nome difere |
| 5 | niacina (nicotinamida) | 16 | mg | `vitamina-b3` | Vitamina B3 (nicotinamida) | 16 | mg | — | igual; grafia/forma do nome difere |
| 6 | vitamina E (acetato de DL-alfa-tocoferol) | 10 | mg | `vitamina-e` | Vitamina E (acetato de tocoferol) | 10 | mg | — | igual; grafia/forma do nome difere |
| 7 | ácido pantotênico (D-pantotenato de cálcio) | 5 | mg | `vitamina-b5` | Vitamina B5 (pantotenato de calcio) | 5 | mg | — | igual; grafia/forma do nome difere |
| 8 | boro (quelato de boro) | 3 | mg | `boro` | Boro (de quelato de boro) | 3 | mg | — | igual; grafia/forma do nome difere |
| 9 | vitamina B6 (cloridrato de piridoxina) | 1,3 | mg | `vitamina-b6` | Vitamina B6 (cloridrato de piridoxina) | 1,3 | mg | — | igual |
| 10 | vitamina B1 (cloridrato de tiamina) | 1,2 | mg | `vitamina-b1` | Vitamina B1 (cloridrato de tiamina) | 1,2 | mg | — | igual |
| 11 | vitamina B2 (riboflavina) | 1,3 | mg | `vitamina-b2` | Vitamina B2 (riboflavina) | 1,3 | mg | — | igual |
| 12 | vitamina A (acetato de retinol) | 1300 | mcg | `vitamina-a` | Vitamina A (acetato de retinol) | 1300 | mcg | — | igual |
| 13 | ácido fólico | 750 | mcg | `vitamina-b9` | Vitamina B9 (acido folico) | 800 | mcg | — | cadastro 1,07× menor; grafia/forma do nome difere |
| 14 | cobre (cobre aminoácido quelato) | 900 | mcg | `cobre` | Cobre (de bisglicinato de cobre) | 0,9 | mg | — | igual (só a unidade difere); grafia/forma do nome difere |
| 15 | selênio (selênio quelado) | 100 | mcg | `selenio` | Selenio (de selenito de sodio) | 100 | mcg | — | igual; grafia/forma do nome difere |
| 16 | vitamina K (menaquinona-7) | 149 | mcg | `vitamina-k` | Vitamina K2 (menaquinona-7) | 149 | mcg | — | igual; grafia/forma do nome difere |
| 17 | vitamina D (colecalciferol) | 50 | mcg | `vitamina-d` | Vitamina D3 (colecalciferol) | 50 | mcg | — | igual; grafia/forma do nome difere |
| 18 | cromo (picolinato de cromo) | 250 | mcg | `cromo` | Cromo (de picolinato de cromo) | 35 | mcg | elemento | cadastro 7,14× o rótulo; grafia/forma do nome difere |
| 19 | vitamina B12 (metilcobalamina) | 9,94 | mcg | `vitamina-b12` | Vitamina B12 (cianocobalamina) | 9,94 | mcg | — | igual; grafia/forma do nome difere |
| 20 | *ausente* | — | — | `dioxido-de-silicio` | Dioxido de silicio (INS 551) | 10 | mg | — | só no rótulo (falta no cadastro) |

Observações registradas no JSON de extração para este rótulo:

- Valor do ELEMENTO magnesio; a tabela declara Magnesio 260 mg (62% VD)
- Consta da tabela como 'L-teanina 150 mg ()', com o campo de %VD impresso vazio
- Valor do ELEMENTO zinco; a tabela declara Zinco 15 mg (136% VD)
- Tabela marca (**) = Valor Diario nao estabelecido
- Composicao escreve 0,9 mg; a tabela declara Cobre 0,9 mg (100% VD). Equivale a 900 mcg.
- Tabela marca (**) = Valor Diario nao estabelecido
- Valor do ELEMENTO cromo; a tabela declara Cromo 35 mcg (100% VD)

### 4.12 Pro Energy × ProEnergy.pdf

As três linhas "só no cadastro" são as contrapartes das linhas do rótulo com outro insumo canônico: feno-grego em pó (cadastro) × extrato seco de semente de feno-grego (rótulo, 250 mg nos dois); cafeína 140 mg × cafeína anidra 150 mg; cloridrato de L-arginina 75 mg × L-Aspartato de L-arginina 75 mg. Massa igual em dois deles, insumo diferente nos três.

Slug `pro-energy` · cadastro com **8** linhas ativas · rótulo com **9** insumos · **diverge**.

| # | cadastro: insumo | qtd | un. | insumo canônico | rótulo: insumo | qtd | un. | sal / elemento | diferença |
|---|---|---|---|---|---|---|---|---|---|
| 1 | *ausente* | — | — | `extrato-seco-de-semente-de-feno-grego *(novo)*` | Extrato seco de semente de feno-grego (Trigonella foenum-graecum L.) | 250 | mg | — | só no rótulo (falta no cadastro) |
| 2 | taurina | 215 | mg | `taurina` | L-taurina | 200 | mg | — | cadastro 1,08× o rótulo; grafia/forma do nome difere |
| 3 | guaraná em pó (Paullinia cupana Kunth, semente) | 200 | mg | `guarana-em-po` | Guarana em po (Paullinia cupana Kunth, semente) | 200 | mg | — | igual |
| 4 | *ausente* | — | — | `cafeina-anidra` | Cafeina anidra | 150 | mg | — | só no rótulo (falta no cadastro) |
| 5 | L-carnitina | 90 | mg | `l-carnitina` | L-carnitina base | 90 | mg | — | igual; grafia/forma do nome difere |
| 6 | *ausente* | — | — | `l-aspartato-de-l-arginina *(novo)*` | L-Aspartato de L-arginina | 75 | mg | — | só no rótulo (falta no cadastro) |
| 7 | zinco (bisglicinato de zinco) | 20 | mg | `zinco` | Bisglicinato de zinco | 20 | mg | **sal** — elemento 4 mg | igual; grafia/forma do nome difere |
| 8 | vitamina B6 (cloridrato de piridoxina) | 10 | mg | `vitamina-b6` | Vitamina B6 (cloridrato de piridoxina) | 10 | mg | — | igual |
| 9 | *ausente* | — | — | `dioxido-de-silicio` | Dioxido de silicio (INS 551) | 5 | mg | — | só no rótulo (falta no cadastro) |
| 10 | feno-grego em pó (Trigonella foenum-graecum L., semente) | 250 | mg | `feno-grego-em-po` | *não está no rótulo* | — | — | — | só no cadastro |
| 11 | cafeína | 140 | mg | `cafeina` | *não está no rótulo* | — | — | — | só no cadastro |
| 12 | cloridrato de L-arginina | 75 | mg | `cloridrato-de-l-arginina` | *não está no rótulo* | — | — | — | só no cadastro |

Observações registradas no JSON de extração para este rótulo:

- Os 20 mg sao massa do SAL. A tabela nutricional declara Zinco 4 mg (36% VD), que e o ELEMENTO. O restante e massa do bisglicinato.

### 4.13 ZMA (Zinco, Magnésio e Vitamina B6) × ZmaComplex.pdf

O cadastro acertou a natureza dos números (sais, nomeados como sais) e errou as massas de magnésio e zinco; o rótulo traz também 217,1 mg de dióxido de silício que o cadastro não tem. O boro é declarado só como sal (56,6 mg) — o rótulo não traz boro elementar em lugar nenhum.

Slug `zma-zinco-magnesio-e-vitamina-d` · cadastro com **6** linhas ativas · rótulo com **7** insumos · **diverge**.

| # | cadastro: insumo | qtd | un. | insumo canônico | rótulo: insumo | qtd | un. | sal / elemento | diferença |
|---|---|---|---|---|---|---|---|---|---|
| 1 | bisglicinato de magnésio | 673,055 | mg | `magnesio` | Magnesio glicinato | 500 | mg | **sal** — elemento 152 mg | cadastro 1,35× o rótulo; grafia/forma do nome difere |
| 2 | *ausente* | — | — | `dioxido-de-silicio` | Dioxido de silicio (INS 551) | 217,1 | mg | — | só no rótulo (falta no cadastro) |
| 3 | L-teanina de folhas de Camellia sinensis | 150 | mg | `l-teanina` | L-teanina | 150 | mg | — | igual; grafia/forma do nome difere |
| 4 | bisglicinato de zinco | 119,02 | mg | `zinco` | Bisglicinato de zinco | 75 | mg | **sal** — elemento 15 mg | cadastro 1,59× o rótulo |
| 5 | boro (quelato de boro) | 56,6 | mg | `boro` | Quelato de boro (glicinato de boro) | 56,6 | mg | **sal** — elemento não declarado no rótulo | igual; grafia/forma do nome difere |
| 6 | vitamina B6 (cloridrato de piridoxina) | 1,3 | mg | `vitamina-b6` | Vitamina B6 (cloridrato de piridoxina) | 1,3 | mg | — | igual |
| 7 | vitamina D (colecalciferol) | 50 | mcg | `vitamina-d` | Vitamina D3 (colecalciferol) | 25 | mcg | — | cadastro 2× o rótulo; grafia/forma do nome difere |

Observações registradas no JSON de extração para este rótulo:

- Os 500 mg sao massa do SAL. A tabela nutricional declara Magnesio 152 mg (36% VD), que e o ELEMENTO.
- Os 75 mg sao massa do SAL. A tabela nutricional declara Zinco 15 mg (136% VD), que e o ELEMENTO.
- SAL. O boro elemento NAO e declarado na tabela nutricional deste rotulo.
- A tabela declara Vitamina D 25 mcg (167% VD)

### 4.14 DORES MUSCULARES × Nuviart.pdf

O rótulo se contradiz: a linha de composição declara **bisglicinato de zinco 10 mg** e **bisglicinato de ferro 8 mg** (massa de sal) e a tabela nutricional do mesmo rótulo declara **Zinco 10 mg (91 % VD)** e **Ferro 8 mg (57 % VD)** (elemento). O mesmo número não pode ser as duas coisas. Carbonato de cálcio 100 mg e bisglicinato de magnésio 100 mg aparecem só como sal, sem elemento em lugar nenhum. PENDENTE de ficha técnica; fica fora da migration (seção 8).

Slug `dores-musculares` · cadastro com **12** linhas ativas · rótulo com **14** insumos · **diverge**.

| # | cadastro: insumo | qtd | un. | insumo canônico | rótulo: insumo | qtd | un. | sal / elemento | diferença |
|---|---|---|---|---|---|---|---|---|---|
| 1 | metilsulfonilmetano (MSM) | 480,5 | mg | `metilsulfonilmetano` | Metilsulfonilmetano (MSM) | 250 | mg | — | cadastro 1,92× o rótulo |
| 2 | sulfato de glucosamina com cloreto de potássio | 200 | mg | `sulfato-de-glucosamina-com-cloreto-de-potassio` | Sulfato de glucosamina | 200 | mg | — | igual; grafia/forma do nome difere |
| 3 | vitamina C (ácido ascórbico) | 140 | mg | `vitamina-c` | Acido ascorbico | 140 | mg | — | igual; grafia/forma do nome difere |
| 4 | *ausente* | — | — | `colageno-hidrolisado` | Colageno hidrolisado | 100 | mg | — | só no rótulo (falta no cadastro) |
| 5 | *ausente* | — | — | `calcio-elementar` | Carbonato de calcio | 100 | mg | **sal** — elemento não declarado no rótulo | só no rótulo (falta no cadastro) |
| 6 | magnésio (bisglicinato de magnésio) | 100 | mg | `magnesio` | Bisglicinato de magnesio | 100 | mg | **sal** — elemento não declarado no rótulo | igual; grafia/forma do nome difere |
| 7 | colágeno tipo II não desnaturado | 40 | mg | `colageno-tipo-ii-nao-desnaturado` | Colageno tipo II nao desnaturado | 40 | mg | — | igual |
| 8 | vitamina E (acetato de DL-alfa-tocoferol) | 20 | mg | `vitamina-e` | DL-alfa-tocoferol | 20 | mg | — | igual; grafia/forma do nome difere |
| 9 | zinco (bisglicinato de zinco) | 10 | mg | `zinco` | Bisglicinato de zinco | 10 | mg | **sal** — elemento não declarado no rótulo | igual; grafia/forma do nome difere |
| 10 | ferro (ferro aminoácido quelato) | 8 | mg | `ferro` | Bisglicinato de ferro | 8 | mg | **sal** — elemento não declarado no rótulo | igual; grafia/forma do nome difere |
| 11 | vitamina B6 (cloridrato de piridoxina) | 1,3 | mg | `vitamina-b6` | Cloridrato de piridoxina | 1,3 | mg | — | igual; grafia/forma do nome difere |
| 12 | selênio (selênio quelado) | 100 | mcg | `selenio` | Selenio quelado | 100 | mcg | — | igual; grafia/forma do nome difere |
| 13 | vitamina D (colecalciferol) | 50 | mcg | `vitamina-d` | Colecalciferol | 50 | mcg | — | igual; grafia/forma do nome difere |
| 14 | vitamina B12 (metilcobalamina) | 9,94 | mcg | `vitamina-b12` | Metilcobalamina | 9,94 | mcg | — | igual; grafia/forma do nome difere |

Observações registradas no JSON de extração para este rótulo:

- A tabela declara Vitamina C 140 mg (140% VD)
- SAL. O rotulo NAO declara o calcio elemento nem na tabela nem entre parenteses. Nao ha como calcular sem premissa externa.
- SAL. O rotulo NAO declara o magnesio elemento nem na tabela nutricional.
- Rotulo escreve 'Colageno tipo II nao desnaturado (Colageno tipo II nao hidrolisado) 40 mg'
- A tabela declara Vitamina E 20 mg (133% VD)
- INCOERENCIA DO PROPRIO ROTULO: a composicao declara 10 mg do SAL bisglicinato de zinco, e a tabela declara Zinco 10 mg (91% VD) como ELEMENTO. O mesmo numero nao pode valer para sal e elemento. Confirmar com a ficha tecnica da fabrica antes de cadastrar.
- INCOERENCIA DO PROPRIO ROTULO: composicao declara 8 mg do SAL e a tabela declara Ferro 8 mg (57% VD) como ELEMENTO. Confirmar com a ficha tecnica.
- A tabela declara Vitamina B6 1,3 mg (100% VD)
- A tabela declara Selenio 100 mcg (167% VD)
- A tabela declara Vitamina D 50 mcg (1000% VD)
- A tabela declara Vitamina B12 9,94 mcg (414% VD)

### 4.15 Pré-treino + Creatina Sabor Limão (420 g) × PRÉ TREINO_CÉSIO 137_420g.pdf (rótulo da gráfica, fora do JSON)

Fonte: texto extraível do PDF `/Users/diegofrancisco/Downloads/PRÉ TREINO_CÉSIO 137_420g.pdf`, lido por mim em 15/09/2026 com PyMuPDF e conferido visualmente no recorte renderizado. A linha impressa é, verbatim: "COMPOSIÇÃO POR PORÇÃO (14 G): Creatina monohidratada 5 g; beta-alanina 2 g; L-arginina 3,810 g; taurina 1 g; L-tirosina 1 g; L-carnitina 1 g; cafeína anidra 200 mg; extrato de guaraná (Paullinia cupana) 515 mg; magnésio (de bisglicinato de magnésio) 350 mg; vitamina B3 (niacinamida) 35 mg; vitamina B6 (cloridrato de piridoxina) 90 mg; vitamina B12 (metilcobalamina) 9,94 mcg; vitamina D3 (colecalciferol) 50 mcg." Slug `pre-treino-creatina-sabor-limao-420g` · cadastro com **13** linhas ativas · rótulo com **13** insumos · **bate integralmente em quantidade**.

| # | cadastro: insumo | qtd | un. | insumo canônico | rótulo: insumo | qtd | un. | sal / elemento | diferença |
|---|---|---|---|---|---|---|---|---|---|
| 1 | creatina monoidratada | 5000 | mg | `creatina-monoidratada` | Creatina monohidratada | 5 | g | — | igual (só a unidade difere); grafia/forma do nome difere |
| 2 | beta-alanina | 2000 | mg | `beta-alanina` | beta-alanina | 2 | g | — | igual (só a unidade difere) |
| 3 | L-arginina | 3810 | mg | `l-arginina` | L-arginina | 3,810 | g | — | igual (só a unidade difere) |
| 4 | taurina | 1000 | mg | `taurina` | taurina | 1 | g | — | igual (só a unidade difere) |
| 5 | L-tirosina | 1000 | mg | `l-tirosina` | L-tirosina | 1 | g | — | igual (só a unidade difere) |
| 6 | L-carnitina | 1000 | mg | `l-carnitina` | L-carnitina | 1 | g | — | igual (só a unidade difere) |
| 7 | cafeína anidra | 200 | mg | `cafeina-anidra` | cafeína anidra | 200 | mg | — | igual |
| 8 | extrato de guaraná (Paullinia cupana) | 515 | mg | `guarana-em-po` | extrato de guaraná (Paullinia cupana) | 515 | mg | — | igual |
| 9 | magnésio (de bisglicinato de magnésio) | 350 | mg | `magnesio` | magnésio (de bisglicinato de magnésio) | 350 | mg | elemento | igual |
| 10 | vitamina B3 (niacinamida) | 35 | mg | `vitamina-b3` | vitamina B3 (niacinamida) | 35 | mg | — | igual |
| 11 | vitamina B6 (cloridrato de piridoxina) | 90 | mg | `vitamina-b6` | vitamina B6 (cloridrato de piridoxina) | 90 | mg | — | igual |
| 12 | vitamina B12 (metilcobalamina) | 9,94 | mcg | `vitamina-b12` | vitamina B12 (metilcobalamina) | 9,94 | mcg | — | igual |
| 13 | vitamina D3 (colecalciferol) | 50 | mcg | `vitamina-d` | vitamina D3 (colecalciferol) | 50 | mcg | — | igual |

Três coisas a registrar, nenhuma delas divergência entre cadastro e rótulo: (1) a soma dos 13 itens é **15.000,06 mg numa porção de 14 g** nos dois lados — o próprio rótulo declara 7,14 % a mais que a porção, antes dos 6 aditivos que ele lista; (2) o cadastro liga "extrato de guaraná" ao insumo canônico `guarana-em-po`, que é pó de semente, não extrato — mesma confusão de forma já apontada para o feno-grego; (3) segundo o parecer `docs/conformidade/PARECER-PRE-TREINO-CESIO-137-2026-09-15.md`, a ficha técnica de produção da fábrica (`FRM-PRETREINO-14G-001`, Rev.02 de 20/08/2026) traz três insumos com outros valores (L-arginina 1.000 mg, cafeína 150 mg, extrato de guaraná 224,5 mg) e fecha em 14.000 mg. Rótulo e ficha divergem; qual está em produção é **PENDENTE** da fábrica. Esta fórmula **não entra na migration**: o cadastro já é o rótulo, a fonte é outro PDF (não o JSON) e a ficha técnica não pode ser usada como fonte.

Notas sobre forma química, que não aparecem na coluna "diferença" porque a quantidade bate:

- **BELLA GUMMY (4.1):** o rótulo declara "Vitamina E (DL-alfa-tocoferol) 16,7 mg"; o cadastro diz "acetato de DL-alfa-tocoferol". O limite da ANVISA para vitamina E é em mg de α-tocoferol, não na massa do acetato (`LIMITES-ANVISA-POR-INSUMO.md`). Qual das duas formas está na fórmula real é dado de ficha técnica — PENDENTE.
- **Multivitamínico (4.11):** três formas químicas diferem sem mudar o número: vitamina B12 (rótulo cianocobalamina × cadastro metilcobalamina), selênio (rótulo selenito de sódio × cadastro selênio quelado) e cobre (rótulo bisglicinato de cobre × cadastro cobre aminoácido quelato). O caso do selênio importa: `LIMITES-ANVISA-POR-INSUMO.md` registra que "selênio quelado" não consta entre as fontes autorizadas, enquanto selenito de sódio consta. O rótulo, aqui, está na forma autorizada; o cadastro, não. O `divergencias.md` de 13/09 anotou só o cobre.
- **Focus Colina (4.9):** vitamina B12 cianocobalamina 2,4 mcg no rótulo × metilcobalamina 9,94 mcg no cadastro — forma e quantidade diferem (já anotado em 13/09).
- **Pro Energy (4.12):** "L-carnitina base" no rótulo × "L-carnitina" no cadastro (mesma base, o rótulo especifica a forma livre); "cafeína anidra 150 mg" × "cafeína 140 mg"; "L-Aspartato de L-arginina 75 mg" × "cloridrato de L-arginina 75 mg" — sais diferentes da mesma base, mesma massa.
- **Serena (4.5), Multivitamínico, Saúde Intestinal, Focus Colina:** o rótulo escreve "Magnésio (de bisglicinato de magnésio)" ou "(de cloreto de magnésio)", deixando claro que o número é do elemento; o cadastro escreve "magnésio (bisglicinato de magnésio)". Mesmo número, marcação mais explícita no rótulo.

---

## 5. Insumos do rótulo que não existem em `ingredients`, e os que existem com outro nome

### 5.1 Precisariam ser criados (5)

Conferido contra os 70 insumos ativos do banco novo. Nome exatamente como no rótulo que o traz; quando dois rótulos grafam o mesmo insumo de forma diferente, o nome é o do primeiro rótulo na ordem do JSON e as duas grafias entram em `synonyms`.

| slug proposto | nome proposto (texto do rótulo) | grafias nos rótulos | usado por | categoria proposta | por que é novo e não um existente |
|---|---|---|---|---|---|
| `inulina-de-cichorium-intybus` | Inulina de Cichorium intybus | "Inulina de Cichorium intybus" (Floravex); "Inulina de raiz de chicória (Cichorium intybus L.)" (Moro Slim) | Saúde Intestinal 135 mg; Moro Slim 44 mg | outro | não há inulina em `ingredients` |
| `frutooligossacarideos` | Frutooligossacarídeos (FOS) | "Frutooligossacarideos (FOS)" | Saúde Intestinal 90 mg | outro | não há FOS |
| `extrato-seco-de-semente-de-feno-grego` | Extrato seco de semente de feno-grego (Trigonella foenum-graecum L.) | mesma grafia em Moro Slim e Pro Energy; o Lidema grafa "Extrato seco de sementes de Trigonella foenum-graecum L. (feno grego)" | Moro Slim 220 mg; Pro Energy 250 mg | extrato_vegetal | o cadastro tem `feno-grego-em-po` (semente moída) e `extrato-fluido-de-semente-de-feno-grego` (fluido). Pó, extrato fluido e extrato seco não são o mesmo insumo nem têm a mesma concentração (`divergencias.md` 3.4); a IN 28/2018 só autoriza o extrato de semente (`LIMITES-ANVISA-POR-INSUMO.md`) |
| `quitosana` | Quitosana | "Quitosana" | Moro Slim 122 mg | outro | não há quitosana |
| `l-aspartato-de-l-arginina` | L-Aspartato de L-arginina | "L-Aspartato de L-arginina" | Pro Energy 75 mg | aminoacido | o cadastro tem `l-arginina` e `cloridrato-de-l-arginina` como insumos separados; o aspartato é um terceiro sal. Segue o precedente do próprio cadastro (sal separado da base) — se o dono preferir agrupar tudo em `l-arginina`, é só trocar o slug na migration |

### 5.2 Existem com outro nome (ligação proposta pela identidade do insumo, não pelo texto)

| texto do rótulo | slug existente | evidência da identidade |
|---|---|---|
| Corantes tartrazina (INS 102) e azul brilhante FCF (INS 133) | `corante-verde` | o insumo existente é "Corante verde (INS 102 e INS 133)": mesmos dois códigos INS |
| Vitamina A (acetato de retinila) | `vitamina-a` | mesmo composto: retinila é o radical do retinol, acetato de retinila = acetato de retinol (nomenclatura química, não dado de rótulo) |
| Extrato seco de laranja Moro (Citrus sinensis (L.) Osbeck) | `extrato-de-laranja-moro` | mesma espécie e mesma parte; o rótulo só especifica "seco" |
| Extrato seco de rizoma de cúrcuma (Curcuma longa L.) | `extrato-de-rizomas-de-curcuma` | idem |
| Extrato seco de semente de café verde (Coffea arabica L.) | `extrato-de-cafe-verde` | idem (o sinônimo existente já diz "semente") |
| Vitamina B12 (cianocobalamina) | `vitamina-b12` | mesma vitamina; o insumo canônico é a vitamina, a forma fica em `ingredient_name` (o sinônimo cadastrado hoje é só metilcobalamina) |
| Selênio (de selenito de sódio) | `selenio` | mesma lógica (sinônimo cadastrado: selênio quelato) |
| Cobre (de bisglicinato de cobre) | `cobre` | sinônimo "Cobre (bisglicinato de cobre)" já cadastrado |
| L-carnitina base | `l-carnitina` | forma livre da mesma molécula |
| L-taurina | `taurina` | sinônimo "L-taurina" já cadastrado |
| Mio-inositol | `inositol` | sinônimo cadastrado é "inositol (mio-inositol)"; mesma molécula |
| Cafeína anidra | `cafeina-anidra` | existe com este nome; o Pro Energy hoje aponta para `cafeina` (140 mg) — a linha nova apontaria para `cafeina-anidra` (150 mg), que é o que o rótulo escreve |
| Magnésio glicinato; Bisglicinato de magnésio; Magnésio (de cloreto de magnésio) | `magnesio` | "Bisglicinato de magnésio" e "Magnésio (cloreto de magnésio)" já são sinônimos cadastrados; "Magnésio glicinato" é grafia nova do mesmo sal |
| Bisglicinato de zinco; Zinco (de bisglicinato de zinco) | `zinco` | "bisglicinato de zinco" já é sinônimo cadastrado; a forma com "(de ...)" é grafia nova |
| Quelato de boro (glicinato de boro); Boro (de quelato de boro) | `boro` | sinônimo cadastrado é "boro (quelato de boro)"; grafias novas do mesmo quelato |
| Creatina monohidratada | `creatina-monoidratada` | o sinônimo "creatina monohidratada" já está cadastrado |
| Psyllium (Plantago ovata, casca da semente); Psyllium (Plantago ovata Forssk.) | `psyllium` | mesma espécie |
| Sulfato de glucosamina (Nuviart) | `sulfato-de-glucosamina-com-cloreto-de-potassio` | o rótulo não menciona o cloreto de potássio; o insumo cadastrado, sim. Fica registrado, mas o Nuviart está fora da migration |
| Carbonato de cálcio (Nuviart) | `calcio-elementar` | o insumo cadastrado chama-se "Cálcio elementar (carbonato de cálcio)"; o rótulo declara o sal sem o elemento. Fora da migration |

Efeito colateral a registrar: depois da troca, três insumos ficam sem nenhuma composição ativa apontando para eles — `feno-grego-em-po` (usado só por Moro Slim e Pro Energy), `cafeina` e `cloridrato-de-l-arginina` (usados só por Pro Energy). Hoje já existem cinco nessa situação (`cloridrato-de-l-cisteina`, `espirulina`, `hialuronato-de-sodio`, `psyllium`, `siliciumax`, sobras das exclusões de 14/09); `espirulina` e `psyllium` voltam a ter uso com a migration. A migration não desativa insumo nenhum — é decisão do dono (seção 9).

---

## 6. Soma de massa por porção, antes e depois

Soma aritmética das linhas de composição, convertidas para mg (calculado). Duas ressalvas de leitura, válidas para os dois lados: a linha de composição mistura massa de sal (bisglicinatos, no ZMA) com massa de elemento (magnésio, zinco, cromo declarados como elemento), então a soma não é um balanço físico de massa; e a "porção" de cápsula é o peso nominal arredondado ("1 g (2 cápsulas)"), o que explica excessos de fração de miligrama.

### 6.1 As 14 fórmulas com rótulo

| fórmula (slug) | porção do rótulo | soma do cadastro hoje | cadastro passa da porção? | soma pelo rótulo | rótulo passa da porção? |
|---|---|---|---|---|---|
| `bella-gummy-biotina-em-gummy` | 6 g (2 gomas) | 74,765 mg | não (1,2461 %) | 74,765 mg | não (1,2461 %) |
| `creatina-monohidratada-150g-soluvel` | 5 g (1 scoop) | 5000 mg | não (100 %) | 5000 mg | não (100 %) |
| `creatina-gummy-sabor-frutas-vermelhas` | 6 g (2 gomas) | 3000 mg | não (50 %) | 3000 mg | não (50 %) |
| `melatonina-em-gummy-sabor-uva` | 6 g (2 gomas) | 800,21 mg | não (13,3368 %) | 800,21 mg | não (13,3368 %) |
| `serena` | 1 mL (20 gotas) | 164,51 mg | porção em mL; massa da porção não declarada | 164,51 mg | porção em mL; massa da porção não declarada |
| `biotina-em-capsula` | 1 g (2 capsulas) | 726,49494 mg | não (72,6495 %) | 846,49494 mg | não (84,6495 %) |
| `detox-matinal-lemon-shot-300g` | 10 g (1 dose) | 2192,51 mg | não (21,9251 %) | 10001,45 mg | sim, +1,45 mg (100,0145 %) |
| `saude-intestinal` | 1 g (2 capsulas) | 1000 mg | não (100 %) | 1001 mg | sim, +1 mg (100,1 %) |
| `focus-colina` | 1 g (2 capsulas) | 999,99744 mg | não (99,9997 %) | 986,3074 mg | não (98,6307 %) |
| `moro-slim` | 1 g (2 capsulas) | 999,96 mg | não (99,996 %) | 998,224 mg | não (99,8224 %) |
| `multivitaminico` | 1 g (2 capsulas) | 999,99394 mg | não (99,9994 %) | 576,14394 mg | não (57,6144 %) |
| `pro-energy` | 1 g (2 capsulas) | 1000 mg | não (100 %) | 1000 mg | não (100 %) |
| `zma-zinco-magnesio-e-vitamina-d` | 1 g (2 capsulas) | 1000,025 mg | sim, +0,025 mg (100,0025 %) | 1000,025 mg | sim, +0,025 mg (100,0025 %) |
| `dores-musculares` | 1 g (2 capsulas) | 999,95994 mg | não (99,996 %) | 969,45994 mg | não (96,946 %) |

Leitura:

- No cadastro de hoje, entre as 14, só o **ZMA** passa da porção (1.000,025 mg em 1 g) — e o rótulo dele soma exatamente o mesmo (500 + 217,1 + 150 + 75 + 56,6 + 1,3 + 0,025), então o rótulo **não resolve** esse caso: os 25 mcg de excesso são a vitamina D, e o "1 g" é nominal.
- O rótulo **introduz** dois excessos que o cadastro não tinha: **Detox** (as dez linhas em gramas somam exatamente 10,000 g e o "bisglicinato de zinco 1,45 mg" vem por cima: 10.001,45 mg) e **Saúde Intestinal** (1.001 mg em 1 g). São fatos do próprio rótulo impresso, não do cadastro: a composição declarada excede a porção em 0,0145 % e 0,1 %. Fica registrado para o responsável técnico; a migration copia o rótulo como está.
- Sete fórmulas em cápsula somam, no cadastro, **exatamente ou quase exatamente 100 %** da porção (Saúde Intestinal 1.000,000 mg; Pro Energy 1.000,000; ZMA 1.000,025; Focus Colina 999,997; Multivitamínico 999,994; Moro Slim 999,96; Dores Musculares 999,96). Uma cápsula de 500 mg com ativos somando 500 mg não tem espaço para excipiente, o que indica números ajustados para fechar o peso nominal, não copiados de fórmula — o mesmo padrão dos tetos. (A Creatina 150 g também dá 100 %, mas aí é legítimo: o pó é só creatina.) Pelo rótulo, Multivitamínico cai para 57,6 %, Focus Colina para 98,6 %, Dores Musculares para 96,9 %; Saúde Intestinal, Pro Energy, Moro Slim e ZMA continuam em 100 % ou quase — só que agora com os excipientes declarados (dióxido de silício em todos os quatro).
- **Detox** sobe de 21,9 % para 100,01 %: o rótulo declara a maltodextrina (6,603 g, dois terços da dose), o ácido cítrico, o aroma, o antiumectante, o edulcorante e os corantes, que o cadastro não tinha.

### 6.2 As 9 fórmulas sem rótulo, mais o Pré-treino Césio 137 (só o cadastro)

| fórmula (slug) | porção no cadastro | linhas | soma do cadastro | passa da porção? |
|---|---|---|---|---|
| `creatina-em-gummy-sabor-tutti-frutti` | não declarada no cadastro ("3 g de creatina / Base da Gummy") | 1 | 3000 mg | não se aplica |
| `creatina-monohidratada-300g-soluvel` | 5 g (1 dose) — do modo de uso; `nutritional_info` não traz porção | 1 | 5000 mg | não (100 %) |
| `emagrecedor-em-capsula` | 1 g (2 cápsulas) | 1 | 0,25 mg | não (0,025 %) |
| `melatonina-triptofanos-encapsulados` | 1 g (2 cápsulas) | 9 | 1000,005 mg | sim, +0,005 mg (100,0005 %) |
| `multi-vitta-gestante-e-lactante-em-capsula` | 1 g (2 cápsulas) | 12 | 1000,00046 mg | sim, +0,00046 mg (100,00005 %) |
| `omega-pro-tg` | 1 g (2 softgels) | 5 | 1633 mg | sim, +633 mg (163,3 %) — declaração aninhada, ver nota |
| `pre-treino-300-g` | 10 g (1 dose) | 10 | 10000 mg | não (100 %) |
| `pre-treino-creatina-sabor-limao-420g` | 14 g | 13 | 15000,05994 mg | sim, +1000,05994 mg (107,1433 %) |
| `shot-colageno-300-gramas` | 10 g (1 dose) | 9 | 10000 mg | não (100 %) |
| `slim-up-emagrecimento-em-gota` | 2 mL (massa não declarada) | 5 | 126,20994 mg | não se aplica |


Quatro passam da porção: **Pré-treino + Creatina 420 g** (15.000,06 mg em 14 g — 7,14 % acima, o único caso relevante; e o rótulo da gráfica declara exatamente a mesma soma, seção 4.15), **Ômega Pró TG** (1.633 mg em 1 g, mas as linhas "ômega-3 total", "EPA", "DHA" e "outros ômega-3" são frações dos 1.000 mg de óleo de peixe — declaração aninhada, não excesso físico), e **Melatonina + Triptofanos** e **Multi Vitta** por frações de miligrama (vitaminas em mcg sobre um peso nominal de 1 g). Fora o Pré-treino 420 g, nada disso tem rótulo e nada pode ser corrigido com fonte; fica **PENDENTE** de arte ou ficha técnica.

---

## 7. Discrepâncias encontradas entre o JSON, o `divergencias.md` e o banco ao vivo

1. **Contagens.** `divergencias.md` (13/09) trabalhou com 213 linhas e 28 fórmulas do banco antigo. O banco novo mostra 172 linhas e 24 fórmulas ativas. A diferença de 41 linhas fecha exatamente (calculado a partir do seed `20260909210002_seed_catalogo.sql` e do banco vivo): 20 do BIOPRINCESS, 6 do ZMA Night, 6 do Slim Up Emagrecedor em Gota (as três duplicatas excluídas em 14/09), 5 do Detox 150 g (fórmula com exclusão lógica documentada em `ESTADO-14-09-2026.md`, seção 7) e 4 linhas soltas: colágeno hidrolisado 120 mg (Biotina em Cápsula), psyllium 250 mg e espirulina 320 mg (Emagrecedor) e extrato de cúrcuma 33,3 mg (Slim Up).
2. **Emagrecedor Em Cápsula perdeu duas linhas, não uma.** O contexto recebido dizia que só a espirulina havia sido removida por ficar abaixo do mínimo da ANVISA. No banco vivo a fórmula tem **uma** linha ativa (picolinato de cromo 250 mcg): psyllium 250 mg **e** espirulina 320 mg estão fora. O motivo da saída do psyllium não é visível pela chave pública (linhas excluídas não aparecem) — **PENDENTE** de conferência no `audit_logs` com o papel de serviço.
3. **Slugs que mudaram entre o seed e o banco novo:** `melatonina-em-gumy-sabor-uva` (seed, com "gumy") virou `melatonina-em-gummy-sabor-uva`; `pre-treino-creatina-sabor-limao-300g` (13 linhas, dose de 10 g) virou `pre-treino-creatina-sabor-limao-420g` (13 linhas com outras quantidades, dose de 14 g, soma 15,0 g). A migration usa os slugs do banco novo, lidos ao vivo.
4. **UUIDs.** Todas as 24 fórmulas têm UUID diferente do que as migrations `20260914000000`, `20260915140000`, `20260917000000` e `20260918000000` gravaram (por exemplo, BELLA GUMMY é `ceea244b-2a13-4b75-a493-ea65b7e2032c` no banco novo e `49c6fc44-ccdc-4c56-9e9b-81be4f509403` naquelas migrations). Qualquer migration nova que case por UUID não encontra nada — daí o casamento por slug. Os dados de conformidade, porém, estão no estado que a `20260917` deixou (12 selos visíveis, datas 12/09 00:00 e 20:00 −04:00, arrays de normas por fórmula), ou seja, a cópia para o projeto novo foi feita depois daquelas correções.
5. **`divergencias.md` marcou "5 de 5" e "16 dos outros batem" só pela quantidade.** Este diff acrescenta as diferenças de **forma química** com o mesmo número: vitamina E na BELLA GUMMY; B12, selênio e cobre no Multivitamínico (seção 4, notas). Não contradiz o documento de 13/09 — refina.
6. **Porção da Creatina Gummy frutas vermelhas.** `nutritional_info` no banco diz "1 Porção: 3 g (2 gomas)"; o rótulo diz "6 g (2 gomas)" com 60 gomas em 180 g. Três gramas é o peso de **uma** goma (calculado: 180 g ÷ 60). Campo de `formulas`, não de composição — a migration não o toca.
7. **`ingredients_list` da Biotina em Cápsula está incompleta** em relação ao rótulo BioPrincess: o texto do banco começa em "colágeno hidrolisado" e não cita ácido ascórbico, L-metionina, vitamina E, cloridrato de piridoxina, ácido fólico nem metilcobalamina, todos presentes na lista do rótulo (lido nos dois lados). A ordem também difere. Campo de `formulas` — fora da migration.
8. **`ingredients_list` do Moro Slim cita "extrato seco de semente de guaraná (Paullinia cupana)"**, que não aparece em lugar nenhum do rótulo MoroSlim.pdf (nem na composição, nem na lista de ingredientes). E o rótulo diz "extrato seco de **fruto** de laranja Moro", onde o banco diz só "extrato de laranja Moro". Fora da migration.
9. **Ordem da lista de ingredientes do ZMA.** O rótulo lista o dióxido de silício em segundo lugar (217,1 mg, segundo maior componente); o banco o lista quase no fim. A lista de ingredientes segue ordem decrescente de quantidade — a ordem do rótulo é coerente com os 217,1 mg que o cadastro não tinha.
10. **Detox:** `ingredients_list` do banco diz "aroma limão" e "corante verde (INS 102, INS 133)"; o rótulo, "aromatizante idêntico ao natural de limão" e "corantes tartrazina (INS 102) e azul brilhante FCF (INS 133)". Mesmos aditivos, redação diferente.
11. **Contradições internas do próprio rótulo** (não do cadastro): Nuviart (zinco e ferro como sal na composição e como elemento na tabela, com o mesmo número; cálcio e magnésio só como sal); Detox e Floravex com composição somando acima da porção (seção 6). A migration não tenta corrigir rótulo.
12. **Fora do escopo, mas visto de passagem:** a `ingredients_list` do PRÉ TREINO 300 G começa por "L-citrulina malato", que não existe em `ingredients` nem em `formula_compositions` — o mesmo ponto já registrado em `LIMITES-ANVISA-POR-INSUMO.md`. Sem rótulo extraído, fica como estava.
13. **O JSON não cobre o Pré-treino Césio 137 (420 g)** porque o produto só foi criado no banco em 14/09/2026 (o parecer registra `created_at` 20:52:50 UTC), um dia depois da extração. O rótulo real existe em `~/Downloads/PRÉ TREINO_CÉSIO 137_420g.pdf` (o nome do arquivo tem acentos, e por isso buscas por "pre-treino" sem acento não o encontram) e bate 13 de 13 com o cadastro (seção 4.15). **Mas a ficha técnica de produção da fábrica** (`~/Downloads/FRM-PRETREINO-14G-001_Formulas_Pre_Treino_Com_e_Sem_Creatina.pdf`, Rev.02 de 20/08/2026, lida pela outra frente, não por mim) diverge do rótulo em três insumos — L-arginina 1.000 mg, cafeína 150 mg, extrato de guaraná 224,5 mg — e fecha em 14.000 mg. Qual das duas fórmulas está em produção é **PENDENTE** da fábrica; a ficha não é fonte para o catálogo.
14. **`~/Downloads/RÓTULOS CÁPSULAS LEMON CAPS.pdf` (7 páginas) não é fonte de composição:** são layouts provisórios do designer, com marca d'água "TABELA PROVISÓRIA" e a mesma lista de ingredientes placeholder nas 7 páginas (lido pela outra frente). Servem só para nomes comerciais: p. 2 "Sonus" = melatonina + triptofano em cápsulas (60 cápsulas, 30 g — candidato a `melatonina-triptofanos-encapsulados`); p. 4 "Ômega-3, EPA 1000mg + DHA 400mg" soft gel (candidato a `omega-pro-tg`, mas a frente diverge do cadastro, que traz EPA 185,34 mg e DHA 123,56 mg — **PENDENTE**); p. 3 "Bella+" biotina + colágeno; p. 1 "Excita Pro"; p. 5 Focus Colina; p. 6 Lidema; p. 7 Moro Slim.
15. **Dois conjuntos de PDF que parecem fonte e não são:** `~/Desktop/Lemon Caps - Fichas de Enquadramento/Fichas por formula/` (28 PDFs, um por slug) foi gerado em 04/09/2026 a partir da própria tabela `public.formulas` — deriva do cadastro, não é fonte independente; `~/Desktop/FÓRMULAS LEMON CAPS/proposta_*.pdf` são propostas comerciais. Nenhum dos dois foi usado aqui.

---

## 8. O que a migration `20260920000000_composicoes_conforme_rotulo.sql` faz — e o que fica PENDENTE

Arquivo em `supabase/migrations/20260920000000_composicoes_conforme_rotulo.sql`, **criado em disco e não aplicado**. Casamento por slug. Em ordem: (0) guarda que aborta se não houver exatamente 12 fórmulas ativas com os slugs listados; (1) backup das linhas ativas atuais dessas fórmulas em `private.formula_compositions_backup_20260920` (schema `private`, fora da API, mesmo lugar das tabelas internas de rate limit); (2) inserção dos 5 insumos novos em `ingredients` com `on conflict (slug) do nothing`; (3) exclusão lógica das linhas antigas (`active = false`, `deleted_at = now()`, `reason_deleted = 'substituída pela composição do rótulo em 2026-09-20'`); (4) inserção das 92 linhas do rótulo, `ingredient_id` resolvido por slug, `metadata` com `fonte`, `arquivo`, `extraido_em`, `e_sal`, `elemento_equivalente_mg`, `vd_pct`, `insumo_json` (texto original do JSON) e `observacao`; (5) autocheck por fórmula (contagem exata), nenhuma linha antiga sobrevivente, nenhum `ingredient_id` nulo, total 92. Idempotente: rodar duas vezes não duplica.

Sintaxe conferida com o parser do PostgreSQL (`libpg_query`, via `pglast` 8.4): os 8 comandos e os 2 blocos PL/pgSQL passam. **Não foi executada** — não há Postgres local nem Docker em execução nesta máquina em 15/09/2026, e `supabase db` exige o Docker. Além da sintaxe, cada uma das 92 linhas foi reconferida contra o JSON (quantidade, unidade, `e_sal`, elemento, arquivo, `vd_pct`, texto): 0 divergências; e cada slug de insumo resolve para um dos 70 existentes ou um dos 5 novos.

**Entram (12 fórmulas, 92 linhas):** BELLA GUMMY (5), Creatina 150 g (1), Creatina Gummy frutas vermelhas (1), Melatonina em Gummy (2), Serena (5), Detox 300 g (11), Saúde Intestinal (11), Focus Colina (9), Moro Slim (11), Multivitamínico (20), Pro Energy (9), ZMA (7). As cinco primeiras já batiam em quantidade; entram para que o nome do insumo passe a ser o do rótulo e para que toda linha tenha procedência em `metadata`. Cada fórmula é um bloco separado no `VALUES`, para o dono poder retirar alguma antes de aplicar (basta apagar o bloco e o slug nas duas listas de guarda).

**Ficam fora — PENDENTES:**

| fórmula | motivo | o que destrava |
|---|---|---|
| `biotina-em-capsula` (BioPrincess.pdf) | o JSON marca item `nao_legivel` (fim da lista de ingredientes coberto pela caixa da tabela nutricional, defeito da própria arte). Além disso, o cadastro já bate em 20 de 20 linhas presentes; a única diferença é o "colágeno hidrolisado 120 mg", que o rótulo traz e que foi **removido de propósito** em 14/09 por estar abaixo do mínimo da ANVISA (8,4 g por dia, valor da auditoria de 14/09, não relido nesta sessão). Regravar o rótulo desfaria essa decisão sem ordem | decisão do dono sobre o colágeno (seção 9, item 4); a lista de ingredientes truncada só se resolve com a arte ou a ficha técnica |
| `dores-musculares` (Nuviart.pdf) | rótulo contraditório: "bisglicinato de zinco 10 mg" e "bisglicinato de ferro 8 mg" na composição (sal) contra "Zinco 10 mg" e "Ferro 8 mg" na tabela nutricional (elemento); carbonato de cálcio 100 mg e bisglicinato de magnésio 100 mg sem elemento declarado em lugar nenhum. O mesmo número não pode ser sal e elemento | ficha técnica da fábrica dizendo qual leitura é a certa |
| Lidema (Lidema.pdf) | rótulo sem fórmula no catálogo (produto descartado) | nada — registrado só para o inventário de rótulos fechar em 15 |
| `pre-treino-creatina-sabor-limao-420g` (PRÉ TREINO_CÉSIO 137_420g.pdf) | o cadastro já é igual ao rótulo (13 de 13); a fonte é outro PDF, não o JSON que esta migration declara como origem; e a ficha técnica da fábrica diverge do rótulo (seção 7, item 13). Não há o que gravar sem antes saber qual fórmula está em produção | resposta da fábrica sobre rótulo × ficha Rev.02; depois, se o dono quiser a procedência em `metadata`, um bloco próprio numa migration seguinte |
| as 9 fórmulas sem rótulo | sem fonte, nada a gravar | arte de rótulo ou ficha técnica de cada uma |

---

## 9. Decisões que só o dono pode tomar

Nenhum item abaixo foi decidido neste documento nem na migration; onde a migration precisou de um comportamento padrão, ele está indicado e é reversível antes de aplicar.

1. **Convenção sal × elemento no cadastro.** Hoje `formula_compositions.quantity` guarda o número impresso na linha de composição do rótulo — massa do sal quando o rótulo declara o sal (ZMA: magnésio glicinato 500 mg; Pro Energy: bisglicinato de zinco 20 mg), massa do elemento quando declara o elemento (Multivitamínico: magnésio 260 mg). A migration mantém essa convenção e grava `e_sal` e `elemento_equivalente_mg` em `metadata`, sem converter nada — coerente com a decisão registrada em `20260915140000_conformidade_laudos.sql` ("a quantidade exibida continua sendo a massa do sal"). A alternativa (guardar sempre o elemento, ou as duas colunas) muda o schema e o catálogo público, e é escolha do dono. Enquanto não houver coluna própria, quem calcula conformidade precisa ler `metadata.e_sal`.
2. **O caso Nuviart / Dores Musculares.** Sem ficha técnica, não há como saber se zinco e ferro são 10 mg e 8 mg de sal ou de elemento, nem quanto cálcio e magnésio elementares existem. A fórmula continua com o cadastro atual (MSM 480,5 mg, sem colágeno hidrolisado e sem carbonato de cálcio) **e com selo**. Fica: pedir a ficha técnica e, com ela, escrever o bloco do Nuviart numa migration seguinte.
3. **Acentuação dos nomes.** O JSON foi gravado sem acento (até o `_meta` diz "Renderizacao", "Composicao"); o PDF não existe mais para conferir a grafia impressa. A migration escreve `ingredient_name` com a ortografia normal do português ("Dióxido de silício (INS 551)", "Ácido cítrico (INS 330)") e guarda o texto do JSON, intacto, em `metadata.insumo_json`. É ortografia, não dado — mas é uma escolha. Se o dono preferir o texto do JSON tal qual, basta gravar `metadata->>'insumo_json'` em `ingredient_name`.
4. **Colágeno hidrolisado 120 mg na Biotina em Cápsula.** O rótulo impresso declara; o cadastro removeu em 14/09 por ficar abaixo do mínimo da ANVISA (8,4 g por dia, valor da auditoria de 14/09, não relido no painel nesta sessão). Ou o catálogo segue o rótulo (e a fórmula volta a ter um insumo abaixo do mínimo, visível ao cliente), ou segue a decisão de 14/09 (e o catálogo diverge do rótulo impresso). A migration não decide: deixa a fórmula de fora.
5. **Grafia monoidratada × monohidratada.** Pendência já aberta em `20260919000000_padroniza_modo_de_uso.sql` e em `ESTADO-14-09-2026.md` (item 6, com recomendação de seguir o rótulo). A migration escreve "Creatina monohidratada" (texto do rótulo) nas duas creatinas **com** rótulo; as outras duas (300 g e gummy tutti-frutti, sem rótulo) continuam "creatina monoidratada". Se o dono quiser as quatro iguais, é um UPDATE à parte — ou retirar as duas creatinas da migration.
6. **Composições das 9 fórmulas sem rótulo.** Continuam como estão, com os sinais do mesmo padrão (Melatonina + Triptofanos com zinco 29,59 mg = teto; Multi Vitta com dióxido de silício 592,14 mg como maior componente; Emagrecedor com um único insumo; Slim Up com composição que a ficha técnica de 30/07/2026 contradiz, segundo `correcoes-de-dados.md`). Nada disso tem fonte para correção. Opções: obter as artes, obter as fichas técnicas, ou marcar essas fórmulas no catálogo como "composição não conferida" — todas decisões do dono.
7. **Selos.** Quatro fórmulas com selo terão a composição trocada (Focus Colina, Multivitamínico, ZMA) ou já divergem do rótulo (Dores Musculares). A migration não mexe em `compliance_verified_at`; se o selo deve cair até a auditoria ser refeita sobre os números do rótulo, é um UPDATE à parte (seção 10).
8. **Versão da ficha técnica.** `formulas.technical_sheet_version` só é incrementada deliberadamente "quando a mudança é grande a ponto de exigir nova aprovação do responsável técnico" (comentário da coluna). Trocar a composição inteira de 12 fórmulas parece esse caso — mas hoje não há aprovação registrada (0 linhas em `formula_sheet_approvals` em 14/09) e a migration não altera a versão.
9. **Insumos que ficam sem uso** (`feno-grego-em-po`, `cafeina`, `cloridrato-de-l-arginina`, além dos que já estão sem uso hoje): desativar, manter ou fundir em `ingredients` é decisão de catálogo; a página `/insumos` os exibiria sem produto associado.
10. **Insumo canônico da L-arginina.** Criar `l-aspartato-de-l-arginina` como insumo próprio (padrão da migration, seguindo o precedente do cloridrato) ou apontar a linha do Pro Energy para `l-arginina`.
11. **Pré-treino Césio 137: rótulo × ficha técnica.** O catálogo hoje mostra a fórmula do rótulo (13 itens, 15.000,06 mg em 14 g). A ficha de produção Rev.02 diz outra coisa em três insumos e fecha em 14.000 mg. Se a fábrica confirmar que produz pela ficha, o rótulo impresso está errado e o catálogo também; se produz pelo rótulo, a ficha está desatualizada. Nenhuma das duas hipóteses pode virar cadastro sem a resposta — e o parecer próprio desse produto lista as não conformidades que impedem o selo em qualquer cenário.
12. **Campos de rótulo fora da composição** (seção 7, itens 6 a 10): porção da Creatina Gummy, `ingredients_list` da Biotina em Cápsula e do Moro Slim, redações do Detox. São campos de `formulas`; corrigi-los pelo rótulo é outro pedido.

---

## 10. Selos de conformidade

O banco tem hoje **12 fórmulas** com `compliance_verified_at` preenchido (lido ao vivo): 10 com a data `2026-09-12 00:00 −04:00` da migration `20260914000000` e 2 (Biotina em Cápsula e ZMA) com `2026-09-12 20:00 −04:00` da `20260915140000`. São as 14 autorizadas pela `20260917000000` menos BIOPRINCESS e ZMA Night, excluídas em 14/09. Um selo só se sustenta se (a) a composição foi conferida contra o rótulo e (b) auditada contra os limites da ANVISA. A auditoria de 12/09 foi feita **sobre o cadastro** — que, como este documento mostra, é o teto da ANVISA em várias fórmulas, não o rótulo.

Classificação, sem decidir nada:

- **Grupo A — selo sustentado pelo rótulo (6):** tem selo, tem rótulo e o cadastro auditado é, em quantidade, o que o rótulo imprime. A auditoria de 12/09 valeu, portanto, para os números do rótulo. Ressalva única: as diferenças de **forma química** com a mesma quantidade (vitamina E na BELLA GUMMY) precisam ser conferidas contra a conta da auditoria, porque o limite de vitamina E é em α-tocoferol. A Biotina em Cápsula entra aqui com a ressalva do colágeno (seção 8).
- **Grupo B — selo que fica sem lastro se a composição do rótulo for gravada (4):** tem selo, tem rótulo, e o cadastro auditado **não** é o do rótulo. Focus Colina (vitamina D 50 → 5 mcg, B12 9,94 → 2,4 mcg e forma, colina, tirosina, magnésio), Multivitamínico (vitamina C 533,685 → 100 mg, cromo 250 → 35 mcg, ácido fólico 750 → 800 mcg, mais 10 mg de dióxido de silício e três formas químicas), ZMA (magnésio glicinato 673,055 → 500 mg de sal, zinco 119,02 → 75 mg de sal, vitamina D 50 → 25 mcg, mais 217,1 mg de dióxido de silício) e Dores Musculares (MSM 480,5 → 250 mg, colágeno hidrolisado 100 mg e carbonato de cálcio 100 mg ausentes, rótulo contraditório). Nos três primeiros, a maioria dos números do rótulo é **menor** que a auditada — o que sugere que continuariam dentro do teto —, mas há números que **sobem** (colina 438,14 → 470 mg no Focus Colina; ácido fólico 750 → 800 mcg no Multivitamínico) e formas que mudam (B12, selênio, cobre), e "sugere" não é auditoria: o selo passaria a afirmar conformidade de uma composição que ninguém conferiu. No ZMA, a conta de 12/09 usou teor de laudo sobre 673,055 mg e 119,02 mg de bisglicinato; com 500 mg e 75 mg, e com o elemento agora declarado no próprio rótulo (152 mg e 15 mg), a conta muda de base.
- **Grupo C — sem rótulo, selo impossível de sustentar por enquanto (9, das quais 2 têm selo hoje):** Creatina 300 g e Creatina Gummy tutti-frutti têm selo e não têm rótulo extraído. A formulação é a mesma das irmãs com rótulo (5.000 mg e 3.000 mg de creatina, lido no cadastro), mas "mesma formulação" é inferência a partir do cadastro, não leitura de rótulo. As outras 7 não têm selo nem rótulo.
- **Grupo D — sem selo, com rótulo, cadastro divergente (4):** Detox 300 g, Saúde Intestinal, Moro Slim e Pro Energy. Depois de gravar o rótulo, são as candidatas naturais a uma auditoria nova; hoje não afirmam nada.
- **Grupo E — cadastro = rótulo, mas produto com não conformidades em parecer próprio (1):** Pré-treino + Creatina Sabor Limão (420 g), o "Césio 137". Sem selo hoje; o rótulo da gráfica bate 13 de 13 com o cadastro (seção 4.15); mas `docs/conformidade/PARECER-PRE-TREINO-CESIO-137-2026-09-15.md` registra não conformidades regulatórias do produto (entre elas, oito insumos exatamente no teto legal, soma acima da porção e cafeína total pendente de laudo do guaraná) e a divergência entre rótulo e ficha de produção. **O selo não deve voltar** — registrado aqui como está no parecer, sem decidir nada além disso.

| # | fórmula (slug) | selo hoje? | data do selo | tem rótulo extraído? | cadastro bate com o rótulo? | grupo |
|---|---|---|---|---|---|---|
| 1 | `bella-gummy-biotina-em-gummy` | sim | 12/09/2026 00:00 (-04:00) | sim (BioGummy.pdf) | sim, 5 de 5 em quantidade | A |
| 2 | `biotina-em-capsula` | sim | 12/09/2026 20:00 (-04:00) | sim (BioPrincess.pdf) | 20 de 20 linhas presentes batem; o rótulo traz também colágeno hidrolisado 120 mg, removido do cadastro em 14/09 | A |
| 3 | `creatina-gummy-sabor-frutas-vermelhas` | sim | 12/09/2026 00:00 (-04:00) | sim (creatina gummy.pdf) | sim, 1 de 1 em quantidade | A |
| 4 | `creatina-monohidratada-150g-soluvel` | sim | 12/09/2026 00:00 (-04:00) | sim (CreatinaPo.pdf) | sim, 1 de 1 em quantidade | A |
| 5 | `melatonina-em-gummy-sabor-uva` | sim | 12/09/2026 00:00 (-04:00) | sim (DreamGummy.pdf) | sim, 2 de 2 em quantidade | A |
| 6 | `serena` | sim | 12/09/2026 00:00 (-04:00) | sim (Serena.pdf) | sim, 5 de 5 em quantidade | A |
| 7 | `dores-musculares` | sim | 12/09/2026 00:00 (-04:00) | sim (Nuviart.pdf) | não — MSM 480,5 mg × 250 mg; faltam colágeno hidrolisado 100 mg e carbonato de cálcio 100 mg; rótulo contraditório (sal × elemento) | B |
| 8 | `focus-colina` | sim | 12/09/2026 00:00 (-04:00) | sim (FocusColina.pdf) | não — 5 diferença(s) em 9 linhas | B |
| 9 | `multivitaminico` | sim | 12/09/2026 00:00 (-04:00) | sim (multivitaminico.pdf) | não — 4 diferença(s) em 20 linhas | B |
| 10 | `zma-zinco-magnesio-e-vitamina-d` | sim | 12/09/2026 20:00 (-04:00) | sim (ZmaComplex.pdf) | não — 4 diferença(s) em 7 linhas | B |
| 11 | `creatina-em-gummy-sabor-tutti-frutti` | sim | 12/09/2026 00:00 (-04:00) | não | não conferível | C |
| 12 | `creatina-monohidratada-300g-soluvel` | sim | 12/09/2026 00:00 (-04:00) | não | não conferível | C |
| 13 | `emagrecedor-em-capsula` | não | — | não | não conferível | C |
| 14 | `melatonina-triptofanos-encapsulados` | não | — | não | não conferível | C |
| 15 | `multi-vitta-gestante-e-lactante-em-capsula` | não | — | não | não conferível | C |
| 16 | `omega-pro-tg` | não | — | não | não conferível | C |
| 17 | `pre-treino-300-g` | não | — | não | não conferível | C |
| 18 | `shot-colageno-300-gramas` | não | — | não | não conferível | C |
| 19 | `slim-up-emagrecimento-em-gota` | não | — | não | não conferível | C |
| 20 | `detox-matinal-lemon-shot-300g` | não | — | sim (Detox.pdf) | não — 8 diferença(s) em 11 linhas | D |
| 21 | `moro-slim` | não | — | sim (MoroSlim.pdf) | não — 10 diferença(s) em 11 linhas | D |
| 22 | `pro-energy` | não | — | sim (ProEnergy.pdf) | não — 8 diferença(s) em 9 linhas | D |
| 23 | `saude-intestinal` | não | — | sim (Floravex-intestino.pdf) | não — 11 diferença(s) em 11 linhas | D |
| 24 | `pre-treino-creatina-sabor-limao-420g` | não | — | sim (PRÉ TREINO_CÉSIO 137_420g.pdf, rótulo da gráfica; fora do JSON) | sim, 13 de 13 em quantidade — mas o produto tem não conformidades regulatórias em parecer próprio (PARECER-PRE-TREINO-CESIO-137-2026-09-15.md); selo não deve voltar | E |

Total: 6 + 4 + 9 + 4 + 1 = 24.
