# Cadastro do catálogo × artes de rótulo — Lemon Caps

**Data da conferência:** 13/09/2026
**Fonte do rótulo:** artes-finais em PDF (texto em curvas) da pasta `drive-pdfs`, renderizadas com PyMuPDF entre 462 e 1237 DPI e lidas visualmente. Extração completa em `composicoes_rotulo.json`.
**Fonte do cadastro:** tabela `public.formula_compositions` do projeto `lemoncaps-catalogo`, consultada ao vivo em 13/09/2026 (213 linhas, 28 fórmulas).
**Nada foi alterado no banco.** Este documento é só o levantamento.

---

## 1. Resumo

| situação | fórmulas |
|---|---|
| Rótulo lido por completo | 15 de 15 |
| Fórmulas do cadastro com rótulo correspondente | 16 (duas delas são duplicatas) |
| Fórmulas em que cadastro e rótulo batem integralmente | 6 |
| Fórmulas com pelo menos uma divergência numérica | 10 |
| Fórmulas do cadastro sem rótulo na pasta | 12 |
| Rótulos sem fórmula correspondente no cadastro | 1 (Lidema) |

O padrão descrito na abertura da apuração se confirma: os valores divergentes do cadastro repetem os
**tetos máximos da ANVISA** — vitamina B6 98,60 mg, zinco 29,59 mg, magnésio 350 mg, cromo 250 mcg,
vitamina A 1.500 mcg, vitamina D 50 mcg — e não as quantidades realmente formuladas.

### Convenção de leitura das tabelas

Cada tabela abaixo traz, por insumo: o que está no cadastro, o que está no rótulo e a diferença.
Quando o rótulo declara o **sal** (por exemplo "bisglicinato de zinco 20 mg") e o **elemento**
(por exemplo "Zinco 4 mg" na tabela nutricional), as duas grandezas aparecem, identificadas.
Comparar massa de sal contra limite de elemento produz reprovação falsa — por isso a separação é explícita.

---

## 2. Fórmulas que batem integralmente com o rótulo

Nenhuma ação necessária nestas seis.

| fórmula no cadastro | rótulo | insumos conferidos |
|---|---|---|
| BELLA GUMMY (Biotina em Gummy) | BioGummy.pdf | 5 de 5 |
| Biotina em Cápsula | BioPrincess.pdf | 21 de 21 |
| CREATINA GUMMY SABOR FRUTAS VERMELHAS | creatina gummy.pdf | 1 de 1 |
| CREATINA MONOIDRATADA 150 g SOLÚVEL | CreatinaPo.pdf | 1 de 1 |
| Melatonina em Gummy Sabor Uva | DreamGummy.pdf | 2 de 2 |
| Serena | Serena.pdf | 5 de 5 |

Observação sobre a BELLA GUMMY: os 12 mg cadastrados em "zinco (bisglicinato de zinco)" são a massa
do **sal**, e o rótulo diz isso com todas as letras — "equivalente a 2,4 mg de zinco". O elemento é
2,4 mg (22% VD). O número do cadastro está certo; o que falta é a marcação de que ele é sal.

---

## 3. Fórmulas com divergência

### 3.1 Saúde Intestinal × Floravex — **a mais grave**

Sete insumos cadastrados, **sete divergentes**. Quatro ingredientes do rótulo não existem no cadastro.

| insumo | cadastro | rótulo | diferença |
|---|---|---|---|
| vitamina B6 (cloridrato de piridoxina) | 98,60 mg | **1,26 mg** (97% VD) | **78× maior no cadastro** |
| magnésio (bisglicinato de magnésio) | 350,00 mg | **90 mg** (21% VD) — elemento | 3,89× maior |
| zinco (bisglicinato de zinco) | 29,59 mg | **13,5 mg** (123% VD) — elemento | 2,19× maior |
| vitamina A (acetato de retinol) | 1.500 mcg | **540 mcg** (90% VD) | 2,78× maior |
| quercetina | 280,00 mg | **72 mg** | 3,89× maior |
| extrato de rizomas de cúrcuma | 130,00 mg | **117 mg** | 1,11× maior |
| L-glutamina | 110,31 mg | **135 mg** | 1,22× **menor** no cadastro |
| psyllium (Plantago ovata, casca da semente) | ausente | **342 mg** | falta no cadastro |
| inulina de Cichorium intybus | ausente | **135 mg** | falta no cadastro |
| frutooligossacarídeos (FOS) | ausente | **90 mg** | falta no cadastro |
| dióxido de silício (INS 551) | ausente | **4,7 mg** | falta no cadastro |

Os valores de B6 (98,60), magnésio (350) e zinco (29,59) são exatamente os tetos regulatórios.
O psyllium, que é o ingrediente de maior massa da fórmula real (342 mg de 1 g), simplesmente não
está cadastrado.

### 3.2 Multivitamínico

Dezenove insumos cadastrados, três divergentes, um ausente.

| insumo | cadastro | rótulo | diferença |
|---|---|---|---|
| vitamina C (ácido ascórbico) | 533,685 mg | **100 mg** (100% VD) | 5,34× maior |
| cromo (picolinato de cromo) | 250 mcg | **35 mcg** (100% VD) — elemento | 7,14× maior |
| ácido fólico (vitamina B9) | 750 mcg | **800 mcg** (200% VD) | 1,07× menor no cadastro |
| dióxido de silício (INS 551) | ausente | **10 mg** | falta no cadastro |

Os outros 16 insumos batem, inclusive magnésio 260 mg, zinco 15 mg, boro 3 mg e vitamina K2 149 mcg.
Nota: o cadastro grafa cobre como "cobre aminoácido quelato" e o rótulo como "bisglicinato de cobre";
a quantidade é a mesma (900 mcg = 0,9 mg), só o nome da fonte diverge.

### 3.3 FOCUS COLINA

| insumo | cadastro | rótulo | diferença |
|---|---|---|---|
| vitamina D3 (colecalciferol) | 50 mcg | **5 mcg** (33% VD) | **10× maior** |
| vitamina B12 | 9,94 mcg (metilcobalamina) | **2,4 mcg** (cianocobalamina, 100% VD) | 4,14× maior — **e a forma química diverge** |
| L-tirosina | 262,50 mg | **220 mg** | 1,19× maior |
| colina (bitartarato de colina) | 438,1375 mg | **470 mg** | 1,07× menor no cadastro |
| magnésio (bisglicinato de magnésio) | 63 mg | **60 mg** (14% VD) — elemento | 1,05× maior |

Batem: L-teanina 115 mg, L-carnitina 95 mg, inositol 25 mg, vitamina B6 1,3 mg.

### 3.4 MORO SLIM

Seis insumos cadastrados, quatro divergentes; cinco ingredientes do rótulo não estão no cadastro.

| insumo | cadastro | rótulo | diferença |
|---|---|---|---|
| feno-grego (Trigonella foenum-graecum L.) | 450,00 mg | **220 mg** | 2,05× maior |
| extrato de laranja Moro | 340,14 mg | **175 mg** | 1,94× maior |
| extrato de café verde | 123,86 mg | **110 mg** | 1,13× maior |
| extrato de rizomas de cúrcuma | 84,21 mg | **135 mg** | 1,60× **menor** no cadastro |
| vitamina A (acetato de retinol) | 1.500 mcg | 1.500 mcg (250% VD) | igual |
| cromo (picolinato de cromo) | 250 mcg | 250 mcg (714% VD) — elemento | igual |
| espirulina (Arthrospira platensis) | ausente | **122 mg** | falta no cadastro |
| quitosana | ausente | **122 mg** | falta no cadastro |
| psyllium (Plantago ovata Forssk.) | ausente | **66 mg** | falta no cadastro |
| inulina de raiz de chicória | ausente | **44 mg** | falta no cadastro |
| dióxido de silício (INS 551) | ausente | **2,474 mg** | falta no cadastro |

O cadastro também chama de "feno-grego em pó" o que o rótulo declara como "extrato seco de semente
de feno-grego" — pó e extrato seco não são o mesmo insumo e não têm a mesma concentração.

### 3.5 Detox Matinal (Lemon Shot) - 300g × Detox

| insumo | cadastro | rótulo | diferença |
|---|---|---|---|
| zinco (bisglicinato de zinco) | 8,30 mg | **1,45 mg de bisglicinato de zinco**, equivalente a **0,29 mg de zinco** (3% VD) | **5,72× maior que o sal; 28,6× maior que o elemento** |
| extrato de rizomas de cúrcuma | 84,21 mg | **0,13 g = 130 mg** | 1,54× menor no cadastro |
| vitamina C (ácido ascórbico) | 1.600 mg | 1,6 g = 1.600 mg (1600% VD) | igual |
| extrato de café verde | 400 mg | 0,4 g = 400 mg | igual |
| extrato de laranja Moro | 100 mg | 0,1 g = 100 mg | igual |
| maltodextrina | ausente | **6,603 g** | falta no cadastro |
| ácido cítrico (INS 330) | ausente | **0,67 g** | falta no cadastro |
| aromatizante idêntico ao natural de limão | ausente | **0,33 g** | falta no cadastro |
| dióxido de silício (INS 551) | ausente | **0,1 g** | falta no cadastro |
| edulcorante sucralose (INS 955) | ausente | **0,05 g** | falta no cadastro |
| corantes tartrazina (INS 102) e azul brilhante FCF (INS 133) | ausente | **0,017 g** (valor conjunto) | falta no cadastro |

Este rótulo é o exemplo mais didático da distinção sal/elemento: ele escreve textualmente
"bisglicinato de zinco 1,45 mg (equivalente a 0,29 mg de zinco)". Os 8,3 mg do cadastro não
correspondem a nenhuma das duas grandezas.

A maltodextrina (6,603 g de uma dose de 10 g) é dois terços do produto e não está cadastrada.

### 3.6 DORES MUSCULARES × Nuviart

| insumo | cadastro | rótulo | diferença |
|---|---|---|---|
| metilsulfonilmetano (MSM) | 480,50 mg | **250 mg** | 1,92× maior |
| colágeno hidrolisado | ausente | **100 mg** | falta no cadastro |
| carbonato de cálcio | ausente | **100 mg** (sal; cálcio elemento não declarado) | falta no cadastro |

Os outros doze insumos batem: sulfato de glucosamina 200 mg, ácido ascórbico 140 mg,
bisglicinato de magnésio 100 mg, colágeno tipo II não desnaturado 40 mg, DL-alfa-tocoferol 20 mg,
bisglicinato de zinco 10 mg, bisglicinato de ferro 8 mg, cloridrato de piridoxina 1,3 mg,
selênio quelado 100 mcg, colecalciferol 50 mcg, metilcobalamina 9,94 mcg.

**Alerta sobre o próprio rótulo, não sobre o cadastro:** a linha de composição do Nuviart declara
"bisglicinato de zinco 10 mg" e "bisglicinato de ferro 8 mg" (massas de **sal**), enquanto a tabela
nutricional do mesmo rótulo declara "Zinco 10 mg (91% VD)" e "Ferro 8 mg (57% VD)" (massas de
**elemento**). O mesmo número não pode valer para as duas coisas. Antes de gravar qualquer valor
de zinco e ferro desta fórmula no catálogo, é preciso confirmar com a ficha técnica da fábrica
qual das duas leituras é a correta. O mesmo vale para o carbonato de cálcio e o bisglicinato de
magnésio, que aparecem na composição mas não na tabela nutricional — o elemento não é declarado
em lugar nenhum do rótulo.

### 3.7 ZMA (Zinco, Magnésio e Vitamina B6) × ZMA complex

| insumo | cadastro | rótulo | diferença |
|---|---|---|---|
| bisglicinato de magnésio | 673,055 mg | **500 mg de magnésio glicinato** (sal), equivalente a **152 mg de magnésio** (36% VD) | 1,35× maior que o sal |
| bisglicinato de zinco | 119,02 mg | **75 mg** (sal), equivalente a **15 mg de zinco** (136% VD) | 1,59× maior que o sal |
| vitamina D3 (colecalciferol) | 50 mcg | **25 mcg** (167% VD) | 2× maior |
| dióxido de silício (INS 551) | ausente | **217,1 mg** | falta no cadastro |
| L-teanina | 150 mg | 150 mg | igual |
| quelato de boro (glicinato de boro) | 56,60 mg | 56,6 mg (sal) | igual |
| vitamina B6 (cloridrato de piridoxina) | 1,30 mg | 1,3 mg (100% VD) | igual |

Neste rótulo o cadastro acertou a natureza dos números (são sais, e o cadastro os nomeia como sais),
mas errou as massas de magnésio e zinco. O boro é declarado só como sal — o rótulo não traz o boro
elemento em nenhum lugar.

### 3.8 Pro Energy

| insumo | cadastro | rótulo | diferença |
|---|---|---|---|
| cafeína | 140 mg | **150 mg** (cafeína anidra) | 1,07× menor no cadastro |
| taurina | 215 mg | **200 mg** (L-taurina) | 1,08× maior |
| dióxido de silício (INS 551) | ausente | **5 mg** | falta no cadastro |
| zinco (bisglicinato de zinco) | 20 mg | **20 mg de bisglicinato** (sal), equivalente a **4 mg de zinco** (36% VD) | quantidade igual, mas é sal |

Batem em quantidade: feno-grego 250 mg, guaraná 200 mg, L-carnitina 90 mg, arginina 75 mg,
vitamina B6 10 mg.

Duas observações de nomenclatura: o cadastro registra "cloridrato de L-arginina" e o rótulo declara
"L-Aspartato de L-arginina" — são sais diferentes da mesma base. E o cadastro não marca que os 20 mg
de zinco são massa de sal; o elemento é 4 mg. Esta é exatamente a armadilha que já causou reprovação
falsa nesta fábrica.

### 3.9 BIOPRINCESS — cadastro duplicado, uma das cópias errada

Há **duas fórmulas no cadastro para o mesmo rótulo** (`BioPrincess.pdf`): "BIOPRINCESS" e
"Biotina em Cápsula". A segunda bate 21 de 21 com o rótulo. A primeira diverge:

| insumo | cadastro "BIOPRINCESS" | rótulo | diferença |
|---|---|---|---|
| vitamina C (ácido ascórbico) | 508,91 mg | **250 mg** (556% VD) | 2,04× maior |
| zinco (bisglicinato de zinco) | 29,59 mg | **15 mg** (136% VD) | 1,97× maior — 29,59 é o teto ANVISA |
| colágeno hidrolisado | ausente | **120 mg** | falta no cadastro |

Os outros dezoito insumos de "BIOPRINCESS" batem. O provável caminho de correção é consolidar as
duas fórmulas numa só, mantendo os valores de "Biotina em Cápsula", que são os do rótulo — mas essa
é decisão do dono, não desta apuração.

### 3.10 ZMA Night — duplicata idêntica de ZMA

"ZMA Night (Zinco + Magnésio + Vitamina B6)" tem composição byte a byte igual à de
"ZMA (Zinco, Magnésio e Vitamina B6)": mesmos seis insumos, mesmas quantidades. Herda portanto
as mesmas três divergências do item 3.7. Só existe um rótulo de ZMA na pasta.

---

## 4. Fórmulas do cadastro sem rótulo correspondente na pasta

Doze fórmulas não têm arte de rótulo entre os 15 PDFs. Nenhuma delas pôde ser conferida.

| fórmula | insumos cadastrados | observação |
|---|---|---|
| CREATINA MONOIDRATADA 300g SOLÚVEL | 1 | mesma formulação da de 150 g (5.000 mg/dose), que foi conferida e bate |
| CREATINA EM GUMMY SABOR TUTTI-FRUTTI | 1 | mesma formulação da gummy de frutas vermelhas (3.000 mg), que foi conferida e bate |
| Detox (Shot Matinal) - 150g | 5 | composição idêntica à do Detox 300 g cadastrado, que **diverge** do rótulo — provável mesma contaminação |
| Emagrecedor Em Cápsula | 3 | — |
| Melatonina + Triptofanos (Encapsulados) | 9 | traz zinco 29,59 mg — o teto ANVISA; suspeito pelo mesmo padrão |
| Multi Vitta - Gestante e Lactante em Cápsula | 12 | traz dióxido de silício 592,14 mg como maior componente; suspeito |
| Ômega Pró TG | 5 | — |
| PRÉ TREINO 300 G | 10 | — |
| Pré-treino + Creatina Sabor Limão (300g) | 13 | — |
| SHOT + COLÁGENO 300 GRAMAS | 9 | — |
| Slim Up - Emagrecedor em Gota | 6 | duplicata de "Slim Up - EMAGRECIMENTO EM GOTA" |
| Slim Up - EMAGRECIMENTO EM GOTA | 6 | duplicata de "Slim Up - Emagrecedor em Gota" |

Para corrigir estas doze é preciso obter as artes de rótulo correspondentes, ou a ficha técnica
de fábrica. Nenhum valor delas deve ser tratado como confirmado.

---

## 5. Rótulo sem fórmula no catálogo

**Lidema** (`Lidema.pdf`) não corresponde a nenhuma das 28 fórmulas cadastradas. É um produto em
cápsula, 60 cápsulas, 30 g, porção de 1 g (2 cápsulas), com treze insumos quantificados:

| insumo | quantidade | %VD |
|---|---|---|
| vitamina C (ácido ascórbico) | 236 mg | 236% |
| L-carnitina | 160 mg | — |
| extrato seco de sementes de Trigonella foenum-graecum L. (feno grego) | 160 mg | — |
| extrato seco de rizomas de Curcuma longa L. | 130 mg | — |
| magnésio (de bisglicinato de magnésio) — elemento | 110 mg | 26% |
| vitamina B3 (nicotinamida) | 21 mg | 131% |
| zinco (de bisglicinato de zinco) — elemento | 12 mg | 109% |
| vitamina E (DL-alfa-tocoferol) | 10 mg | 67% |
| inositol (mio-inositol) | 10 mg | — |
| vitamina B6 (cloridrato de piridoxina) | 1,3 mg | 100% |
| ácido fólico | 400 mcg | 417% |
| cromo (de picolinato de cromo) — elemento | 200 mcg | 571% |
| vitamina D3 (colecalciferol) | 25 mcg | 167% |

---

## 6. O que não foi possível ler

Um único item, e o problema está na arte, não na renderização:

- **BioPrincess** — a lista de ingredientes em texto corrido termina em "…metilcobalamina e cápsula:
  gelatina, água" e o restante da frase fica **coberto pela caixa da tabela nutricional** no próprio
  arquivo de arte. Foi verificado em recorte a 516 DPI da faixa exata: não é limitação de resolução,
  é sobreposição de elementos no layout. Por comparação com os rótulos irmãos, a frase presumivelmente
  terminaria em "purificada e corante dióxido de titânio (INS 171)" — **mas isso é presunção e não foi
  registrado como leitura**. O campo permanece marcado como truncado no JSON.

Todos os demais 14 rótulos foram lidos por completo: tabela nutricional, composição por porção,
lista de ingredientes, porção, porções por embalagem e peso líquido.
