# Inventário de divergências — Calculadora × Catálogo Lemon Caps

**Somente leitura nos dois bancos. Nada foi gravado em nenhum dos dois. Nenhum commit.**
Este documento é para o dono e para o RT decidirem, produto a produto, o que muda no
catálogo. Onde há dúvida real, a coluna "Decisão do dono" fica em branco, de propósito.

## 1. Cabeçalho — fontes, data, base e limites da leitura

| item | valor |
|---|---|
| Fonte 1 (verdade declarada) | Supabase `njfwoguvfozuaghufcgw` — "CALCULADORA LEMON JOÃO" (us-west-2), lido via Management API (`POST /v1/projects/.../database/query`, só `SELECT`) |
| Fonte 2 (site público) | Supabase `zjryrmqtumvaxdytvbbv` — catálogo, lido via PostgREST com a chave **anon** pública |
| Data/hora da leitura | 17/09/2026, a partir de 09:04 (horário local da máquina, `America/Cuiaba` UTC-4) |
| Tabelas lidas na calculadora | `information_schema.columns` (schema das 8 tabelas), `clientes`, `formulas` (com `itens`), `precificacoes` |
| Tabelas lidas no catálogo | `formulas` (colunas essenciais + 1 leitura de `metadata` para `biotina-em-capsula`), `formula_compositions`, `segments`; `formula_costs` **tentada e recusada** |
| Token/chave | PAT da calculadora lido em memória por script Python (`urllib`), nunca impresso nem gravado; chave anon do catálogo idem |

### O que não foi possível ler

- **`formula_costs` do catálogo**: `GET /rest/v1/formula_costs` com a chave anon devolveu HTTP 401 —
  `permission denied for table formula_costs` (RLS: só `staff`). Testado de fato, não presumido.
  Custo interno do catálogo **não é legível pela chave pública**; por isso a coluna de custo, no que
  segue, traz só o lado da calculadora, marcado como **candidato** a preencher
  `formula_costs.unit_cost_cents` (hoje vazio para as 24 fórmulas — o dono nunca preencheu).
- **Nenhuma outra tabela recusou acesso.**

### Base de quantidade usada — e por que essa, não outra

A base **não é 1 cápsula isolada nem o pote inteiro: é a PORÇÃO/DOSE declarada** — o mesmo
conceito que o catálogo usa em `serving_description` e em `nutritional_info`. Concluído assim,
com reconferência, não por suposição:

1. Para **Bio Princess = Biotina em Cápsula**: o memorial
   `docs/conformidade/reformulacao/biotina-em-capsula.md` (seção 1) diz "porção declarada: 1 g
   (2 cápsulas) — 1.000 mg de conteúdo por porção (500 mg de pó por cápsula)". O campo
   `formulas.metadata.tabela_nutricional` do próprio catálogo (lido agora, 17/09) traz `"porcao":
   "1 g (2 cápsulas)"` e os valores por porção (vitamina A 1.500 mcg, riboflavina 2,7 mg, zinco
   15 mg) **batem, sem multiplicar por 2**, com os itens brutos do card da calculadora
   ("Bio Princess (Cabelo, pele e unha)": vitamina A 1.500 mcg, zinco 15 mg — idênticos).
2. Confirmado de novo, de forma independente, no par Detox/Shot Matinal 300 g (seção 4): o card
   "Shot Matinal 300 gramas" traz vitamina C 1.600 mg — e o `nutritional_info` do catálogo (Detox,
   porção 10 g) também imprime "Vitamina C 1.600 mg". De novo, sem multiplicar.
3. Logo: **os valores de `itens[].qtd_informada` na calculadora já são "por porção"**; o campo
   `unidades_por_dose` **não é multiplicador** — é metadado de como aquela porção se reparte em
   unidades físicas (2 cápsulas de ~500 mg cada, ou N mL/g por dose de líquido/solúvel). **Este
   inventário não multiplica nenhum valor da calculadora por `unidades_por_dose`.** Onde a soma
   dos itens não fecha redondo (ex.: ArtFlex, Bio Princess = 1.000,00 mg exatos; alguns solúveis
   somam mais que a porção porque o item da calculadora não lista todo o veículo/excipiente), isso
   está registrado caso a caso, não escondido.
4. Para **Solúvel/Líquido**, a mesma regra (itens = por porção) foi reconferida com o próprio caso
   Detox (10 g = 1 dose, 30 doses/pote — bate com `quantidade_por_pote` 300.000 (mg) ÷
   `unidades_por_dose` 10.000 (mg) = 30). Ou seja, para Solúvel `unidades_por_dose` é a **massa da
   dose em mg**, não uma contagem — campo com semântica diferente da usada em Encapsulados (onde é
   contagem de cápsulas). Isso é uma inconsistência de modelagem da calculadora, registrada aqui
   para não ser confundida com divergência de fórmula.

### Observações de qualidade de dado (da própria calculadora, antes de qualquer comparação)

Acham-se aqui porque atrapalham a leitura de todo o resto — não são "achado ANVISA", são estado do
banco:

- **`quantidade_por_pote` muda de escala conforme o tipo de produto**: em Encapsulados é contagem
  de cápsulas (ex.: 60); em Solúvel/Gummy costuma vir em miligramas totais do pote (ex.: 300.000 =
  300 g) — mas há exceções no meio do caminho (`CREATINA MONOHIDRATADA (SOLÚVEL)`, cliente
  "CATÁLOGO - LEMON CAPS", grava `quantidade_por_pote = 300` com `unidade_soluvel = mg`, sem
  reescalar). Cada valor foi conferido pela soma real dos itens, não pelo campo isolado.
- **Linhas de item com quantidade não-numérica**: vários cards de Gummy trazem uma linha
  `"unidade"`/`"ui"` do tipo `2 unidade — Base de Gummy (Creatina)` ou, em "OMEGA 3 (Softgel)",
  `2 unidade — Omega 3 total 31,65% (185,34 mg EPA e 123,56 mg DHA) 0,58805` — os números vêm
  **dentro do texto do nome**, não em campos próprios. Onde isso aconteceu, extraí os números do
  texto (mostrando a conta) em vez de descartar a linha.
- **Duplicatas literais**: `"CREATINA EM GUMMY SABOR TUTFRUT"` existe 2× (mesmo `cliente`, mesmo
  conteúdo, 16 segundos de diferença no `updated_at`). `"SHOT + COLÁGENO"` (cliente "LEMON CAPS -
  CATÁLOGO") existe 2×, e a segunda cópia (`updated_at` 15:28:23, um minuto depois da primeira) tem
  itens visivelmente corrompidos/trocados ("Maltodextrina" com 2,547 mg em vez de 2.547 mg,
  "Ácido alfa-lipóico" e "Crambery" no lugar de vitamina C e colágeno) — **não foi usada** nesta
  comparação; usei a primeira cópia, cujo preço bate exato com o catálogo.
- **`"Multi Vita - GESTANTE E LACTANTE EM CÁPSULA LINHA ECONÔMICA FINAL"`** grava a linha
  "Vitamina B2 - Riboflavina 100%" **duas vezes**, com valores diferentes (1,6 mg e 10 mg).
- **A calculadora tem OITO variantes do texto livre `cliente`** que dizem "catálogo" de algum jeito
  — `Catálogo`, `CATÁLOGO - LEMON CAPS`, `CATÁLOGO - LEMON CAPS - `, `Catálogo Lemon`,
  `LEMON CAPS - CATÁLOGO`, `LEMON CAPS - FÓRMULA CATÁLOGO`, `LEMON CAPS - FÓRMULAS DO CATÁLOGO`,
  `LEMON CAPS - FÓRMULAS DO CATÁLOGO.` — nenhuma ligada por `cliente_id` (campo nulo nas 104
  linhas); é tudo texto solto. Ver seção 2.
- **O próprio catálogo diverge de si mesmo em pelo menos um caso**: para Detox Matinal, o campo
  `formulas.nutritional_info` (texto) imprime "Zinco | 0,29 mg", mas a tabela estruturada
  `formula_compositions` (a fonte pedida para este inventário) tem "zinco (bisglicinato de zinco)
  8,3 mg" — quase 30× mais. Registrado na seção do produto; não decidi qual dos dois campos do
  catálogo está certo.

## 2. Os clientes "catálogo" na calculadora — não é 1, são 8 rótulos de texto

A busca por `nome ilike '%cat%logo%' or nome ilike '%lemon%'` na tabela `clientes` devolveu 7
registros cadastrados (nenhum chamado exatamente como os three nomes que os cards mostravam), mas
**nenhuma fórmula usa `cliente_id`** — todas usam o campo de texto solto `formulas.cliente`. A
busca certa era ali. Resultado, com contagem de fórmulas por rótulo:

| `cliente` (texto exato) | nº de fórmulas |
|---|---|
| `Catálogo` | 1 |
| `CATÁLOGO - LEMON CAPS` | 21 |
| `CATÁLOGO - LEMON CAPS - ` (hífen e espaço sobrando) | 1 |
| `Catálogo Lemon` | 3 |
| `LEMON CAPS - CATÁLOGO` | 46 |
| `LEMON CAPS - FÓRMULA CATÁLOGO` | 4 |
| `LEMON CAPS - FÓRMULAS DO CATÁLOGO` | 4 |
| `LEMON CAPS - FÓRMULAS DO CATÁLOGO.` (ponto final) | 24 |
| **Total** | **104** |

Os três rótulos que o dono viu nos cards ("LEMON CAPS - CATÁLOGO", "CATÁLOGO - LEMON CAPS" e
"Catálogo Lemon") **existem, os três, mais cinco variantes que ninguém citou**. Nenhum é o cliente
"oficial" — é fragmentação de digitação ao longo do tempo, sem padronização. **Sim, há fórmulas do
catálogo em mais de um rótulo — em oito.** 104 registros de fórmula para 24 produtos vivos no
catálogo: a maior parte é rascunho superado, teste ou duplicata (ver seção 5).

## 3. Resumo executivo

- **Catálogo (site):** 24 fórmulas ativas.
- **Calculadora (clientes "catálogo"):** 104 registros de fórmula, em 8 rótulos de `cliente`
  diferentes (seção 2). Para as 24 fórmulas do catálogo, escolhi o melhor candidato dentre os 104
  (nome, formato, gramatura, composição e preço — nesta ordem de peso quando havia empate) e
  registrei os concorrentes descartados.
- **Mapeamento das 24:**
  - **CONFIRMADO pelo dono:** 3 — ArtFlex ↔ Dores Musculares; Bio Princess (Cabelo, pele e unha) ↔
    Biotina em Cápsula; Sono/Ansiedade - Melatonina+Triptofanos ↔ Melatonina + Triptofanos
    (Encapsulados).
  - **PROPOSTO, evidência forte** (nome quase idêntico e/ou preço idêntico e/ou várias linhas de
    composição batendo exatas): 19.
  - **AMBÍGUO** (o dono decide): 2 — Bella Gummy (os dois candidatos da calculadora são rascunhos
    igualmente incompletos) e Saúde Intestinal (o candidato mais parecido por nome tem um perfil
    de insumo **completamente diferente** do que o catálogo declara — risco real de troca de
    composição, não só de dose).
  - **SEM PAR:** nenhuma das 24 fórmulas do catálogo ficou sem candidato nenhum na calculadora
    (mesmo os fracos, contados acima). Do lado da calculadora, cerca de 80 dos 104 registros não
    foram escolhidos — ver seção 5.
- **Composição — idêntica vs. divergente** (comparando o candidato escolhido contra o catálogo,
  linha a linha, na base "por porção" da seção 1):
  - **Idêntica (0 linhas divergentes):** 5 — as duas Creatina Gummy (sabor Frutas Vermelhas e
    Tutti-Frutti), Creatina Monoidratada Solúvel 150 g e 300 g, e Melatonina em Gummy Sabor Uva.
  - **Divergente (≥ 1 linha):** 19 — de leve (Serena: 4 de 5 linhas exatas, 1 só na forma do
    insumo) a grave (Multi Vitta Gestante e Lactante: praticamente nenhuma linha bate em dose;
    Saúde Intestinal: nem os insumos dominantes coincidem).
- **Preço — venda (calculadora) × público (catálogo)**:
  - **Idêntico, ao centavo:** 11 de 24 — Detox (R$ 23,00), Moro Slim (R$ 19,50), Melatonina +
    Triptofanos (R$ 14,90), Ômega Pró TG (R$ 25,90), Shot + Colágeno (R$ 41,90), Creatina 150 g
    (R$ 20,00), Creatina 300 g (R$ 27,99), as duas Creatina Gummy (R$ 34,90), Melatonina Gummy
    Uva (R$ 31,90), Bella Gummy (R$ 32,90).
  - **Próximo (diferença ≤ R$ 2,20):** 7 — ArtFlex/Dores Musculares, Pré Treino 300 g,
    Multivitamínico, Focus Colina, Saúde Intestinal, Multi Vitta Gestante, ZMA.
  - **Divergente (diferença ≥ R$ 3,00):** 4 — Biotina em Cápsula (R$ 14,90 × R$ 8,90 — a
    calculadora é 67% mais cara), Pro Energy (R$ 11,20 × R$ 16,90), Slim Up (R$ 9,01 × R$ 12,80),
    Serena (R$ 8,06 × R$ 17,00 — mais que o dobro, apesar da composição bater quase toda).
  - **Sem precificação na calculadora:** 2 — Emagrecedor Em Cápsula, Pré-treino + Creatina
    Sabor Limão 420 g.
- **Custo de produção**: `formula_costs.unit_cost_cents` está vazio para as 24 fórmulas do
  catálogo. A calculadora tem `total_custos_producao` para 22 das 24 (faltam as mesmas duas acima)
  — candidatos ficam registrados em cada seção de produto; não gravei nada.

### Decisões que só o dono/RT pode tomar (lista curta)

1. **Biotina em Cápsula**: a fórmula que o dono confirmou hoje ("Bio Princess (Cabelo, pele e
   unha)") tem 8 dos 20 insumos do catálogo **ausentes** — inclusive a própria biotina, que dá
   nome ao produto. Existe outro memorial já pronto (`reformulacao/biotina-em-capsula.md`,
   16/09) com proposta de composição completa; conferir se é essa proposta que deve substituir o
   card da calculadora, ou se o card é que deveria ganhar os insumos que faltam.
2. **Saúde Intestinal**: nenhum rascunho testado na calculadora bate o perfil dominante do
   catálogo (catálogo é magnésio/quercetina em dose alta; os rascunhos da calculadora são
   fibra prebiótica — psyllium/inulina/FOS). Antes de publicar qualquer ajuste, confirmar qual dos
   dois é o produto real.
3. **Nomes com termo de alegação** vindos da calculadora que **não devem** ir para um card público
   sem passar pelo RT: "…ESTIMULANTE SEXUAL…" (candidato do Pro Energy), "…EMAGRECIMENTO…" (Moro
   Slim, Slim Up, Emagrecedor), e o codinome **"TIRZ"** (evoca tirzepatida, medicamento controlado —
   não pode aparecer em lugar nenhum voltado ao público, mesmo que hoje seja só um rascunho
   interno). Detalhe em cada seção.
4. **Preços que divergem forte** (Biotina, Pro Energy, Slim Up, Serena): decidir se o preço do
   catálogo muda, se o custo da calculadora está desatualizado, ou se são propositalmente
   diferentes (a calculadora pode estar cotando uma versão com mais insumo).
5. **As 5 fórmulas duplicadas/redundantes já citadas** (§ "qualidade de dado") merecem limpeza na
   calculadora, independente do catálogo.

## 4. Tabela-mestre

Preço em reais. "Linhas divergentes" conta linhas com quantidade diferente **mais** linhas que só
existem de um lado; não conta a linha de excipiente/veículo puro quando ela não corresponde a
nenhum insumo do catálogo. "Nome: adotar?" avalia o nome **da calculadora**, não o nome atual do
catálogo.

| # | Produto (calculadora — escolhido) | Produto (catálogo) | Mapeamento | Composição | Preço calc × catálogo | Nome: adotar? | Ação proposta | Decisão do dono |
|---|---|---|---|---|---|---|---|---|
| 1 | Bella Gummy (BIOTINA EM GOMA) *(ou "Força e Disposição" — idênticas)* | BELLA GUMMY (Biotina em Gummy) | AMBÍGUO | DIVERGE — 4 linhas só no catálogo (rascunho da calc só tem biotina) | R$ 32,90 = R$ 32,90 | ok | Completar o card da calculadora (falta vit. C, E, zinco, A) antes de comparar de verdade | |
| 2 | Bio Princess (Cabelo, pele e unha) | Biotina em Cápsula | **CONFIRMADO (dono)** | DIVERGE — 4 linhas de dose + 8 só no catálogo | R$ 14,90 × R$ 8,90 | ok (nome já neutro) | Decidir entre o card atual e o memorial de reformulação de 16/09 | |
| 3 | CREATINA EM GUMMY FRUTAS VERMELHAS | CREATINA GUMMY SABOR FRUTAS VERMELHAS | PROPOSTO forte | **BATE — idêntica** | R$ 34,90 = R$ 34,90 | ok | Nenhuma — já bate | |
| 4 | CREATINA EM GUMMY SABOR TUTFRUT | CREATINA EM GUMMY SABOR TUTTI-FRUTTI | PROPOSTO forte | **BATE — idêntica** | R$ 34,90 = R$ 34,90 | ok | Apagar a cópia duplicada na calculadora | |
| 5 | Creatina Monohidratada Solúvel - Pote com 150 gramas | CREATINA MONOIDRATADA 150 g SOLÚVEL | PROPOSTO forte | **BATE — idêntica** | R$ 20,00 = R$ 20,00 | ok | Nenhuma — já bate | |
| 6 | Creatina Monohidratada Solúvel - Pote com 300 gramas | CREATINA MONOIDRATADA 300 g SOLÚVEL | PROPOSTO forte | **BATE — idêntica** | R$ 27,99 = R$ 27,99 | ok | Nenhuma — já bate | |
| 7 | Shot Matinal 300 gramas | Detox Matinal (Lemon Shot) - 300g | PROPOSTO forte | DIVERGE — 2 linhas (cúrcuma; zinco — ver nota de inconsistência interna do catálogo) | R$ 23,00 = R$ 23,00 | ok | Resolver a divergência interna do catálogo (zinco 0,29 × 8,3 mg) antes de tudo | |
| 8 | ArtFlex | DORES MUSCULARES | **CONFIRMADO (dono)** | DIVERGE — 6 linhas de dose + 4 só no catálogo + 1 só na calc | R$ 13,80 × R$ 14,00 | ok | Selênio quelado já sinalizado (auditoria 15/09) — não repito aqui | |
| 9 | Emagrecedor em Cápsula (Linha Standart - 18/05) | Emagrecedor Em Cápsula | PROPOSTO moderado | DIVERGE — catálogo só declara 1 de 13 insumos | não precificada na calc × R$ 11,90 | ok | Catálogo parece incompleto — conferir antes de qualquer alegação de "conforme" | |
| 10 | FOCO 60 CÁPSULAS - LEMON CAPS PREMIUM | FOCUS COLINA | PROPOSTO forte | DIVERGE — 5 de 9 linhas | R$ 16,88 × R$ 18,90 | ok | Conferir as 5 doses divergentes | |
| 11 | Sono/Ansiedade - Melatonina+Triptofanos | Melatonina + Triptofanos (Encapsulados) | **CONFIRMADO (dono)** | DIVERGE — 3 linhas de dose + 2 só no catálogo | R$ 14,90 = R$ 14,90 | **alegação — decisão do dono/RT** | Bloqueado na conferência ANVISA de hoje (zinco quelado, Mg abaixo do mínimo) — não repito | |
| 12 | Melatonina em Gummy Sabor Uva | Melatonina em Gummy Sabor Uva | PROPOSTO forte | **BATE — idêntica** | R$ 31,90 = R$ 31,90 | ok | Nenhuma — já bate | |
| 13 | Moro Slim (Emagrecimento em Cápsula - Premium) | MORO SLIM | PROPOSTO forte | DIVERGE — 4 linhas de dose + 5 só na calc | R$ 19,50 = R$ 19,50 | **alegação ("Emagrecimento") — decisão do dono/RT** | Conferir os 5 insumos extras da calc antes de considerar "igual" | |
| 14 | Multi Vita - GESTANTE E LACTANTE EM CÁPSULA LINHA ECONÔMICA FINAL | Multi Vitta - Gestante e Lactante em Cápsula | PROPOSTO moderado | DIVERGE — 6 linhas de dose + 9 só na calc (com bug de duplicata) + 1 só no catálogo (dióxido de silício 592 mg) | R$ 12,32 × R$ 13,80 | ok | Divergência ampla — recomendo conferência completa antes de publicar qualquer alteração | |
| 15 | MULTIVITAMINICO | Multivitamínico | PROPOSTO forte | DIVERGE — 3 de 19 linhas | R$ 16,38 × R$ 18,20 | ok | O melhor casamento de todo o inventário (16/19 exatas) — só ajustar vit. C, ác. fólico e cromo | |
| 16 | OMEGA 3 (Softgel) | Ômega Pró TG | PROPOSTO forte | DIVERGE — 1 linha só no catálogo (EPA/DHA/total batem, mas via texto livre) | R$ 25,90 = R$ 25,90 | ok | Corrigir a linha de item da calc para campos numéricos (hoje é texto) | |
| 17 | FICHA TÉCNICA PRÉ TREINO + CREATINA 300 G SABOR LIMÃO - LEMONCAPS PREMIUM | Pré-treino + Creatina Sabor Limão (420 g) | PROPOSTO moderado | DIVERGE — 5 linhas de dose + 6 só na calc + 4 só no catálogo | não precificada na calc × R$ 40,00 | ok | **Gramatura do nome diverge (300 g × 420 g)** — mesmo padrão do par Detox 150×300 g; conferir se são o mesmo produto | |
| 18 | PRÉ TREINO | PRÉ TREINO 300 G | PROPOSTO forte | DIVERGE — 4 linhas de dose + 1 só na calc + 1 só no catálogo | R$ 44,00 × R$ 43,00 | ok | Ajustar creatina (2.000×5.000 mg) e beta-alanina | |
| 19 | PRO ENERGY (ESTIMULANTE SEXUAL - Encapsulado - PREMIUM) | Pro Energy | PROPOSTO forte | DIVERGE — 4 linhas de dose + 1 só na calc + 2 só no catálogo | R$ 11,20 × R$ 16,90 | **alegação ("ESTIMULANTE SEXUAL") — decisão do dono/RT** | Nome da calc não pode ir ao card assim; preço também diverge bastante | |
| 20 | INTESTINO | Saúde Intestinal | **AMBÍGUO** | DIVERGE — as 7 linhas do catálogo divergem; nenhum insumo dominante da calc aparece no catálogo | R$ 20,67 × R$ 22,90 | ok | **Confirmar identidade do produto antes de qualquer outra ação** | |
| 21 | SONO EM LÍQUIDO FRASCO COM 30 MLS *(ou "SERENA (30/06)" — quase idêntica)* | Serena | PROPOSTO forte | DIVERGE — 1 linha (forma do magnésio: cloreto × quelato, mesma dose) | R$ 12,84 (ou R$ 8,06) × R$ 17,00 | ok | Composição praticamente pronta; só falta decidir o preço | |
| 22 | SHOT + COLÁGENO *(cópia de 19/08 15:27 — a outra está corrompida)* | SHOT + COLÁGENO 300 GRAMAS | PROPOSTO forte | DIVERGE — 6 de 9 linhas | R$ 41,90 = R$ 41,90 | ok | Apagar a cópia corrompida da calculadora (ver § qualidade de dado) | |
| 23 | Slim Up - EMAGRECIMENTO EM GOTAS LINHA ECONÔMICA FINAL | Slim Up - EMAGRECIMENTO EM GOTA | PROPOSTO forte | DIVERGE — 3 linhas de dose + 1 só no catálogo | R$ 9,01 × R$ 12,80 | **alegação ("Emagrecimento") — decisão do dono/RT** | "TIRZ" (outro candidato, descartado) nunca deve virar nome público | |
| 24 | ZMA | ZMA (Zinco, Magnésio e Vitamina B6) | PROPOSTO moderado | DIVERGE — 4 de 6 linhas | R$ 14,80 × R$ 16,50 | ok | Conferir magnésio, zinco e boro (as 3 maiores diferenças) | |

## 5. Comparação produto a produto (insumo a insumo)

Ordem alfabética pelo nome do catálogo. Em cada tabela: quantidade já **por porção/dose** (seção
1); "Veredito" é só de correspondência de cadastro (bate/diverge/só de um lado) — **não** é
veredito ANVISA (isso já foi feito, ou está sendo feito, nos documentos citados). Onde a forma do
insumo (ex.: "quelato" × "bisglicinato") difere mas a dose bate, registrei como observação, não
como linha divergente de dose.

---

### 5.1 Bella Gummy (Biotina em Gummy)

**Calculadora:** dois candidatos, `LEMON CAPS - CATÁLOGO`, **idênticos** entre si: "Bella Gummy
(BIOTINA EM GOMA)" (atualizado 05/08 17:16) e "Bella Gummy (Força e Disposição - Gummy - Premium)"
(05/08 03:20). Preço de venda: R$ 32,90 nos dois (a segunda não tem `precificacoes`).

| Insumo (catálogo) | Qtd. catálogo | Insumo (calculadora) | Qtd. calc | Veredito |
|---|---|---|---|---|
| vitamina C (ácido ascórbico) | 45,0 mg | — | — | SÓ NO CATÁLOGO |
| vitamina E (acetato de DL-alfa-tocoferol) | 16,7 mg | — | — | SÓ NO CATÁLOGO |
| zinco (bisglicinato de zinco) | 12,0 mg | — | — | SÓ NO CATÁLOGO |
| vitamina A (acetato de retinol) | 1.020 mcg | — | — | SÓ NO CATÁLOGO |
| biotina (D-biotina) | 45,0 mcg | Biotina - Vitamina 7 (H) | 45 mcg | **BATE** |
| — | — | Base de Gummy (Biotina) — "2 unidade" | não numérico | placeholder, sem massa declarada |

**Observação:** os dois cards da calculadora são rascunhos-esqueleto (1 insumo real cada, mais uma
linha de "base de gummy" sem massa). Não dá para dizer que a calculadora "diverge" do catálogo em
vitamina C/E/zinco/A — ela simplesmente não os tem cadastrados ainda. **AMBÍGUO**: nome bate
(preço idêntico, R$ 32,90 = R$ 32,90), mas não há card completo para comparar de verdade.

---

### 5.2 Biotina em Cápsula

**Calculadora — escolhida (dono, hoje):** "Bio Princess (Cabelo, pele e unha)", cliente
`Catálogo Lemon`, id `54328370…`, atualizada 14/09/2026. Soma dos itens: 689,80 mg de ativos +
310,20 mg de excipiente sem nome = 1.000,00 mg por porção (2 cápsulas) — fecha exato.

| Insumo (catálogo) | Qtd. catálogo | Insumo (calculadora) | Qtd. calc | Veredito |
|---|---|---|---|---|
| vitamina C (ácido ascórbico) | 250,0 mg | Vitamina C - Ácido Ascórbico 99% | 250 mg | **BATE** |
| L-metionina | 110,0 mg | L-metionina | 110 mg | **BATE** |
| L-cisteína | 100,0 mg | — | — | SÓ NO CATÁLOGO |
| vitamina E (acetato de DL-alfa-tocoferol) | 45,0 mg | Vitamina E - DL-alfa-tocoferol 50% | 100 mg | DIVERGE (calc é mais que o dobro) |
| metilsulfonilmetano (MSM) | 50,0 mg | Metilsulfonilmetano (MSM) | 45 mg | DIVERGE (próximo) |
| ácido hialurônico | 50,0 mg | Ácido Hialurônico oral | 50 mg | **BATE** |
| silício orgânico (ácido ortossilícico) | 50,0 mg | Silicio Organico (Silicium Max) | 50 mg | **BATE** |
| vitamina B3 (nicotinamida) | 35,0 mg | Vitamina B3 - Nicotinamida 99% | 50 mg | DIVERGE |
| zinco (bisglicinato de zinco) | 15,0 mg | Bisglicinato de zinco | 15 mg | **BATE** |
| vitamina B6 (cloridrato de piridoxina) | 10,0 mg | Vitamina B6 - Cloridrato de Piridoxina 99% | 10 mg | **BATE** |
| vitamina B5 (D-pantotenato de cálcio) | 5,64 mg | Vitamina B5 - D-Pantotenato de Cálcio 98% | 5,56 mg | DIVERGE (quase igual) |
| vitamina B2 (riboflavina) | 2,74 mg | Vitamina B2 - Riboflavina 100% | 2,74 mg | **BATE** |
| vitamina A (acetato de retinol) | 1.500 mcg | Vitamina A - Acetato de Retinol | 1.500 mcg | **BATE** |
| cobre (cobre quelado) | 900 mcg | — | — | SÓ NO CATÁLOGO |
| vitamina B9 (ácido fólico) | 400 mcg | — | — | SÓ NO CATÁLOGO |
| iodo (iodeto de potássio) | 150 mcg | — | — | SÓ NO CATÁLOGO |
| selênio (selênio quelado) | 60 mcg | — | — | SÓ NO CATÁLOGO |
| vitamina D3 (colecalciferol) | 50 mcg | — | — | SÓ NO CATÁLOGO |
| biotina (D-biotina) | 45 mcg | — | — | SÓ NO CATÁLOGO |
| vitamina B12 (metilcobalamina) | 9,94 mcg | — | — | SÓ NO CATÁLOGO |

**Conta:** 8 BATE, 4 DIVERGE, 8 SÓ NO CATÁLOGO. A fórmula que o dono apontou hoje como "esta é a
Biotina em Cápsula" **não tem biotina** entre os itens, nem cisteína, cobre, ácido fólico, iodo,
selênio, vitamina D3 ou B12 — 8 dos 20 insumos do card público. Existe um memorial de reformulação
completo e datado de 16/09 (`docs/conformidade/reformulacao/biotina-em-capsula.md`) com uma
proposta de composição de 20 insumos, tetos ajustados e pendências (selenito de sódio e
bisglicinato de cobre a comprar, origem do ácido hialurônico a confirmar) — **achado já existente,
não refeito aqui**, só citado porque decide o que fazer com esta divergência. Achados adicionais
recebidos para incorporar (não eram meus, vieram da auditoria em andamento, registro sem
reauditar): B3/nicotinamida 50 mg na calculadora excede o máximo de 35 mg NE por porção; ácido
hialurônico sem laudo de origem fermentativa; riboflavina no card do catálogo (2,74 mg) já no teto;
zinco e vitamina E com forma/convenção a confirmar; a linha "Excipiente" da calculadora não tem
nome (deveria discriminar dióxido de silício, cápsula etc., como o memorial já faz).

**Preço:** calculadora R$ 14,90 × catálogo R$ 8,90 — diferença de R$ 6,00 (67% mais caro na
calculadora). Custo de produção candidato: R$ 9,82 (`total_custos_producao`).

**Outros candidatos descartados** (mesma família de nome, compostos diferentes, registrados para
não se perderem): "CABELO PELE E UNHA - BIOPRINCESS" (17 itens, cliente `CATÁLOGO - LEMON CAPS`);
"Bio Princess (Saúde e bem estar - Encapsulado - Premium)" (9 itens, tem colágeno hidrolisado 500 mg
e biotina 45 mcg — mais próxima do rótulo impresso "antigo" descrito no memorial, mas sem os
minerais/vitaminas do B-complex).

---

### 5.3 Creatina em Gummy Sabor Frutas Vermelhas

**Calculadora:** "CREATINA EM GUMMY FRUTAS VERMELHAS", cliente `LEMON CAPS - CATÁLOGO`.

| Insumo (catálogo) | Qtd. catálogo | Insumo (calculadora) | Qtd. calc | Veredito |
|---|---|---|---|---|
| creatina monoidratada | 3.000 mg | Creatina Monohidratada | 3.000 mg | **BATE** |

Composição idêntica. Preço idêntico (R$ 34,90 = R$ 34,90). Nome adota sem problema. A calculadora
também tem uma linha "Base de Gummy (Creatina) — 2 unidade" sem massa declarada (placeholder,
mesmo padrão do item 5.1).

---

### 5.4 Creatina em Gummy Sabor Tutti-Frutti

**Calculadora:** "CREATINA EM GUMMY SABOR TUTFRUT", cliente `LEMON CAPS - CATÁLOGO` — **existe em
duplicata exata** (dois registros, mesmo conteúdo, `updated_at` 16 segundos de diferença).

| Insumo (catálogo) | Qtd. catálogo | Insumo (calculadora) | Qtd. calc | Veredito |
|---|---|---|---|---|
| creatina monoidratada | 3.000 mg | Creatina Monohidratada | 3.000 mg | **BATE** |

Composição idêntica. Preço idêntico (R$ 34,90 = R$ 34,90). Ação: apagar uma das duas cópias
duplicadas na calculadora (limpeza, não é conformidade).

---

### 5.5 Creatina Monoidratada 150 g Solúvel

**Calculadora:** "Creatina Monohidratada Solúvel - Pote com 150 gramas", cliente
`LEMON CAPS - FÓRMULAS DO CATÁLOGO.`.

| Insumo (catálogo) | Qtd. catálogo | Insumo (calculadora) | Qtd. calc | Veredito |
|---|---|---|---|---|
| creatina monoidratada | 5.000 mg | Creatina Monohidratada | 5.000 mg | **BATE** |

Composição idêntica. Preço idêntico (R$ 20,00 = R$ 20,00). Nome adota sem problema. (Existem mais
2 rascunhos de creatina solúvel na calculadora com o mesmo valor mas nome genérico — "CREATINA
MONOHIDRATADA (SOLÚVEL)" e "CREATINA (Força e Disposição - Solúvel - Premium)" — não escolhidos por
terem nome menos específico; ver seção 6.)

---

### 5.6 Creatina Monoidratada 300 g Solúvel

**Calculadora:** "Creatina Monohidratada Solúvel - Pote com 300 gramas", cliente
`LEMON CAPS - CATÁLOGO`.

| Insumo (catálogo) | Qtd. catálogo | Insumo (calculadora) | Qtd. calc | Veredito |
|---|---|---|---|---|
| creatina monoidratada | 5.000 mg | Creatina Monohidratada | 5.000 mg | **BATE** |

Composição idêntica. Preço idêntico (R$ 27,99 = R$ 27,99). Nome adota sem problema.

---

### 5.7 Detox Matinal (Lemon Shot) - 300g

**Calculadora — escolhida:** "Shot Matinal 300 gramas", cliente `LEMON CAPS - CATÁLOGO`,
atualizada 28/08/2026 (a mais recente dos candidatos de shot).

| Insumo (catálogo) | Qtd. catálogo | Insumo (calculadora) | Qtd. calc | Veredito |
|---|---|---|---|---|
| vitamina C (ácido ascórbico) | 1.600,0 mg | Vitamina C - Ácido Ascórbico 99% | 1.600 mg | **BATE** |
| extrato de café verde | 400,0 mg | Café Verde (35% ácido clorogênico) | 400 mg | **BATE** |
| extrato de laranja moro | 100,0 mg | Citrus sinensis (Laranja Moro 08%) | 100 mg | **BATE** |
| extrato de rizomas de cúrcuma | 84,21 mg | Curcuma | 130 mg | DIVERGE |
| zinco (bisglicinato de zinco) | **8,3 mg** (`formula_compositions`) — mas **0,29 mg** em `nutritional_info` do próprio catálogo | Bisglicinato de zinco | 0,29 mg | BATE com `nutritional_info`; DIVERGE (28×) com `formula_compositions` |

**A divergência de zinco é, antes de mais nada, do próprio catálogo consigo mesmo** — os dois
campos do catálogo (`formula_compositions`, a tabela estruturada, e `nutritional_info`, o texto
impresso) não concordam entre si. Isso precisa de correção **dentro do catálogo**,
independentemente do que a calculadora diz.

**Preço:** idêntico, R$ 23,00 = R$ 23,00. Custo de produção candidato: R$ 12,18.

**Achado à parte, resolvendo o par suspeito do enunciado:** "Detox (Shot Matinal) - 150g"
(cliente `LEMON CAPS - CATÁLOGO`, atualizada 18/08 — dez dias **antes** da versão de 300 g) **não é
a mesma fórmula em outro tamanho**: Laranja Moro 400 mg, vitamina C 500 mg, Café Verde 150 mg,
Curcuma 80 mg, zinco 7 mg — nem de longe metade dos valores da versão de 300 g (que seria o
esperado numa mesma receita em pote menor). É um rascunho anterior e abandonado, com receita
diferente, que por acaso ficou com nome quase igual ao produto certo. **Risco de confusão real**
se alguém pegar esse card por engano — recomendo arquivar/renomear na calculadora.

---

### 5.8 Dores Musculares

**Calculadora (dono, hoje):** "ArtFlex", cliente `LEMON CAPS - CATÁLOGO`, atualizada 12/08/2026.
Soma: 985,06 mg de ativos + 14,94 mg de excipiente = 1.000,00 mg por porção — fecha exato.

| Insumo (catálogo) | Qtd. catálogo | Insumo (calculadora) | Qtd. calc | Veredito |
|---|---|---|---|---|
| metilsulfonilmetano (MSM) | 480,5 mg | Metilsulfonilmetano (MSM) | 300 mg | DIVERGE |
| sulfato de glucosamina com cloreto de potássio | 200,0 mg | — | — | SÓ NO CATÁLOGO |
| vitamina C (ácido ascórbico) | 140,0 mg | Vitamina C - Ácido Ascórbico 99% | 120 mg | DIVERGE |
| magnésio (bisglicinato de magnésio) | 100,0 mg | Bisglicinato Magnésio | 350 mg | DIVERGE (calc é 3,5×) |
| colágeno tipo II não desnaturado | 40,0 mg | Colageno Tipo II | 40 mg | **BATE** |
| vitamina E (acetato de DL-alfa-tocoferol) | 20,0 mg | Vitamina E - DL-alfa-tocoferol 50% | 20 mg | **BATE** |
| zinco (bisglicinato de zinco) | 10,0 mg | Bisglicinato de zinco | 15 mg | DIVERGE |
| ferro (ferro aminoácido quelato) | 8,0 mg | Bisglicinato Ferroso H 20% | 10 mg | DIVERGE (próximo) |
| vitamina B6 (cloridrato de piridoxina) | 1,3 mg | — | — | SÓ NO CATÁLOGO |
| selênio (selênio quelado) | 100 mcg | Selenio Quelado 0,2% | 60 mcg | DIVERGE — **forma já sinalizada como não autorizada na auditoria de 15/09** |
| vitamina D (colecalciferol) | 50 mcg | — | — | SÓ NO CATÁLOGO |
| vitamina B12 (metilcobalamina) | 9,94 mcg | — | — | SÓ NO CATÁLOGO |
| — | — | Curcuma | 130 mg | SÓ NA CALCULADORA |

**Conta:** 2 BATE, 6 DIVERGE, 4 SÓ NO CATÁLOGO, 1 SÓ NA CALCULADORA. O selênio quelado (achado já
existente, `AUDITORIA-ROTULO-VS-ANVISA-2026-09-15.md`) aparece nos dois lados, com doses diferentes
— não é só um problema de forma, é também de dose.

**Preço:** próximo, R$ 13,80 × R$ 14,00 (diferença de R$ 0,20). Custo de produção candidato:
R$ 8,12.

---

### 5.9 Emagrecedor Em Cápsula

**Catálogo:** **1 único insumo declarado** — picolinato de Cromo, 250 mcg.

**Calculadora — escolhida:** "Emagrecedor em Cápsula (Linha Standart - 18/05)", cliente
`LEMON CAPS - CATÁLOGO`.

| Insumo (catálogo) | Qtd. catálogo | Insumo (calculadora) | Qtd. calc | Veredito |
|---|---|---|---|---|
| picolinato de Cromo | 250 mcg | Picolinato de Cromo 98-99% | 250 mcg | **BATE** |
| — | — | Spirulina (Arthrospira platensis) | 100 mg | SÓ NA CALCULADORA |
| — | — | Psyllium (Plantago ovatae) pó | 70 mg | SÓ NA CALCULADORA |
| — | — | Curcuma | 70 mg | SÓ NA CALCULADORA |
| — | — | Quitosana | 50 mg | SÓ NA CALCULADORA |
| — | — | Inulina 90% | 35 mg | SÓ NA CALCULADORA |
| — | — | Vitamina C - Ácido Ascórbico 99% | 30 mg | SÓ NA CALCULADORA |
| — | — | Vitamina A - Acetato de Retinol | 30 mg | SÓ NA CALCULADORA |
| — | — | Guaraná em Pó | 15 mg | SÓ NA CALCULADORA |
| — | — | Citrus sinensis (Laranja Moro) | 0,05 mg | SÓ NA CALCULADORA |
| — | — | Feno Grego extrato seco | 0,5 mg | SÓ NA CALCULADORA |
| — | — | Café Verde (35% ácido clorogênico) | 0,5 mg | SÓ NA CALCULADORA |

**A única linha do card público bate exata com a calculadora — mas o catálogo declara só 1 de 13
insumos.** Isto tem cara de cadastro incompleto no catálogo, não de fórmula realmente diferente:
o nome ("Emagrecedor Em Cápsula") promete um produto multi-insumo que a página não está
mostrando. Não decido — registro para o dono/RT completarem o card antes de qualquer selo de
conformidade.

**Preço:** a calculadora não tem `precificacoes` para esta fórmula nem para a variante "Emagrecimento
Em Cápsula" — não dá para comparar. Catálogo: R$ 11,90.

---

### 5.10 Focus Colina

**Calculadora — escolhida:** "FOCO 60 CÁPSULAS - LEMON CAPS PREMIUM", cliente
`LEMON CAPS - CATÁLOGO`.

| Insumo (catálogo) | Qtd. catálogo | Insumo (calculadora) | Qtd. calc | Veredito |
|---|---|---|---|---|
| colina (bitartarato de colina) | 438,14 mg | Colina Bitartarato | 470 mg | DIVERGE (próximo) |
| L-tirosina | 262,5 mg | L-Tirosina | 220 mg | DIVERGE |
| L-teanina | 115,0 mg | L-Teanina | 115 mg | **BATE** |
| L-carnitina | 95,0 mg | L-Carnitina | 95 mg | **BATE** |
| magnésio (bisglicinato de magnésio) | 63,0 mg | Bisglicinato Magnésio | 60 mg | DIVERGE (próximo) |
| inositol (mio-inositol) | 25,0 mg | Inositol | 25 mg | **BATE** |
| vitamina B6 (cloridrato de piridoxina) | 1,3 mg | Vitamina B6 - Cloridrato de Piridoxina 99% | 1,3 mg | **BATE** |
| vitamina D (colecalciferol) | 50 mcg | Vitamina D3 - Colecalciferol 100% | 5 mcg | DIVERGE (calc é 10× menor) |
| vitamina B12 (metilcobalamina) | 9,94 mcg | Vitamina B12 – Cianocobalamina | 2,4 mcg | DIVERGE (**forma também diferente**: metilcobalamina × cianocobalamina) |

**Conta:** 4 BATE, 5 DIVERGE. Preço próximo: R$ 16,88 × R$ 18,90. Custo de produção candidato:
R$ 7,35.

---

### 5.11 Melatonina + Triptofanos (Encapsulados)

**Calculadora (dono, hoje):** "Sono/Ansiedade - Melatonina+Triptofanos", cliente
`CATÁLOGO - LEMON CAPS`, atualizada **hoje** (17/09, 11:56 — a fórmula mais recentemente mexida de
toda a calculadora). Soma: 551,58 mg de ativos + 446,42 mg de amido de milho (excipiente) =
998,00 mg por porção (2 cápsulas) — 2 mg de folga sobre os 1.000 mg, dentro de arredondamento.

| Insumo (catálogo) | Qtd. catálogo | Insumo (calculadora) | Qtd. calc | Veredito |
|---|---|---|---|---|
| L-triptofano | 572,38 mg | L-Triptofano | 200 mg | DIVERGE (catálogo é quase 3×) |
| ácido L-aspártico | 150,0 mg | Ácido Aspártico | 150 mg | **BATE** |
| L-glutamina | 94,77 mg | L-Glutamina | 94,77 mg | **BATE** |
| fosfatidilserina | 70,0 mg | Fosfatidilserina 50% | 70 mg | **BATE** |
| magnésio (bisglicinato de magnésio) | 63,0 mg | Bisglicinato Magnésio | 12,6 mg | DIVERGE (calc é 5× menor) |
| zinco (bisglicinato de zinco) | 29,59 mg | Zinco QUELATO | 24 mg | DIVERGE (também forma: "quelato" × "bisglicinato") |
| dióxido de silício (INS 551) | 20,01 mg | — | — | SÓ NO CATÁLOGO |
| melatonina | 0,21 mg | Melatonina | 0,21 mg | **BATE** |
| biotina (D-biotina) | 45 mcg | — | — | SÓ NO CATÁLOGO |
| — | — | Amido de Milho (excipiente) | 446,42 mg | SÓ NA CALCULADORA (veículo) |

**Conta:** 4 BATE, 3 DIVERGE, 2 SÓ NO CATÁLOGO. **Achado já existente, só registrado aqui, sem
reauditar**: este card foi **bloqueado hoje na conferência ANVISA** — "zinco quelato" não é forma
autorizada (o Anexo I da IN 28/2018 lista 19 formas; bisglicinato de zinco é uma delas, quelato
genérico não), magnésio 12,6 mg fica abaixo do mínimo de 63 mg/porção mesmo na base "por porção"
usada aqui (não é erro de multiplicação — está mesmo abaixo), e a fosfatidilserina não declara
origem "de lecitina de soja". Ou seja: **o card não bate com o catálogo E, independente disso, o
card já está reprovado por conta própria.**

**Preço:** idêntico, R$ 14,90 = R$ 14,90. Custo de produção candidato: R$ 5,08 (o mais barato entre
os produtos com preço batendo — margem de 53,9%, a maior do lote).

**Nome:** "Sono/Ansiedade" é alegação de saúde (trata condição), não pode ir para o nome público —
já é caso conhecido, decisão do dono/RT.

---

### 5.12 Melatonina em Gummy Sabor Uva

**Calculadora:** "Melatonina em Gummy Sabor Uva", cliente `LEMON CAPS - CATÁLOGO`, atualizada
**hoje** (17/09, 12:01).

| Insumo (catálogo) | Qtd. catálogo | Insumo (calculadora) | Qtd. calc | Veredito |
|---|---|---|---|---|
| L-triptofano | 800,0 mg | L-Triptofano | 800 mg | **BATE** |
| melatonina | 0,21 mg | Melatonina | 0,21 mg | **BATE** |

Composição idêntica. Preço idêntico (R$ 31,90 = R$ 31,90). Nome adota sem problema (não promete
tratar nada, só descreve sabor e ingredientes). A calculadora tem também uma linha "Base de Gummy
(Melatonina) — 2 unidade" sem massa (mesmo padrão de placeholder já citado).

---

### 5.13 Moro Slim

**Calculadora — escolhida:** "Moro Slim (Emagrecimento em Cápsula - Premium)", cliente
`LEMON CAPS - CATÁLOGO`. Soma: 1.000,00 mg exatos por porção.

| Insumo (catálogo) | Qtd. catálogo | Insumo (calculadora) | Qtd. calc | Veredito |
|---|---|---|---|---|
| feno-grego em pó | 450,0 mg | Feno Grego extrato seco | 200 mg | DIVERGE — **e a forma também diverge**: catálogo diz "em pó", calculadora usa extrato seco (forma diferente do Anexo I, já sinalizado em `LIMITES-ANVISA-POR-INSUMO.md`: só extrato de semente é autorizado) |
| extrato de laranja moro | 340,14 mg | Citrus sinensis (Laranja Moro 08%) | 158,25 mg | DIVERGE (catálogo é mais que o dobro) |
| extrato de café verde | 123,86 mg | Café Verde (35% ácido clorogênico) | 100 mg | DIVERGE (próximo) |
| extrato de rizomas de cúrcuma | 84,21 mg | Curcuma | 120 mg | DIVERGE |
| vitamina A (acetato de retinol) | 1.500 mcg | Vitamina A - Acetato de Retinol | 1.500 mcg | **BATE** |
| cromo (picolinato de cromo) | 250 mcg | Picolinato de Cromo 98-99% | 250 mcg | **BATE** |
| — | — | Spirulina (Arthrospira platensis) | 110 mg | SÓ NA CALCULADORA |
| — | — | Quitosana | 110 mg | SÓ NA CALCULADORA |
| — | — | Psyllium (Plantago ovatae) pó | 60 mg | SÓ NA CALCULADORA |
| — | — | Inulina 90% | 40 mg | SÓ NA CALCULADORA |
| — | — | Guaraná em Pó | 100 mg | SÓ NA CALCULADORA |

**Conta:** 2 BATE, 4 DIVERGE, 5 SÓ NA CALCULADORA. O card da calculadora tem cinco insumos inteiros
(spirulina, quitosana, psyllium, inulina, guaraná) que **não aparecem no catálogo** — mais da
metade dos itens do card. Preço idêntico (R$ 19,50 = R$ 19,50), o que é forte indício de que é
mesmo o produto certo, só com o cadastro do catálogo desatualizado/incompleto.

**Nome:** o nome completo da calculadora traz "Emagrecimento" explícito — mais forte que "Slim" do
nome atual do catálogo. Adotar o nome da calculadora pioraria a exposição a alegação; decisão do
dono/RT.

**Descartado por nome menos específico, mesmo com maior pontuação de ingrediente:**
"emagrecimento caio em capsulas 16/09" (cliente `Catálogo Lemon`, atualizada 16/09) — parece um
ajuste feito para um cliente chamado Caio, não o produto de catálogo; composição parecida por
coincidência de categoria (mesmo grupo "emagrecedor termogênico").

---

### 5.14 Multi Vitta - Gestante e Lactante em Cápsula

**Calculadora — escolhida:** "Multi Vita - GESTANTE E LACTANTE EM CÁPSULA LINHA ECONÔMICA FINAL",
cliente `LEMON CAPS - CATÁLOGO`. **Tem um bug próprio**: a linha "Vitamina B2 - Riboflavina 100%"
aparece duas vezes, com 1,6 mg e 10 mg — contei as duas na soma, mas nenhuma das duas é comparável
de forma limpa com o catálogo.

| Insumo (catálogo) | Qtd. catálogo | Insumo (calculadora) | Qtd. calc | Veredito |
|---|---|---|---|---|
| dióxido de silício (INS 551) | 592,14 mg | — | — | SÓ NO CATÁLOGO (quase 60% da porção) |
| cálcio elementar (carbonato de cálcio) | 300,0 mg | calcio elementar | 10 mg | DIVERGE (catálogo é 30×) |
| magnésio (bisglicinato de magnésio) | 60,0 mg | Bisglicinato Magnésio | 10 mg | DIVERGE (catálogo é 6×) |
| vitamina C (ácido ascórbico) | 20,0 mg | Vitamina C - Ácido Ascórbico 99% | 20 mg | **BATE** |
| ferro (bisglicinato ferroso) | 8,1 mg | Bisglicinato Ferroso H 20% | 7 mg | DIVERGE (próximo) |
| vitamina B3 (nicotinamida) | 8,0 mg | Vitamina B3 - Nicotinamida 99% | 8 mg | **BATE** |
| vitamina B5 (D-pantotenato de cálcio) | 5,0 mg | Vitamina B5 - D-Pantotenato de Cálcio 98% | 5 mg | **BATE** |
| vitamina E (acetato de DL-alfa-tocoferol) | 5,0 mg | Vitamina E - DL-alfa-tocoferol 50% | 5 mg | **BATE** |
| cobre (bisglicinato de cobre) | 900 mcg | Cobre Bios 24% | 1.000 mcg | DIVERGE (próximo; forma também diferente) |
| ácido fólico | 800 mcg | Vitamina B9 - Ácido Fólico | 600 mcg | DIVERGE |
| vitamina D (colecalciferol) | 50 mcg | Vitamina D3 - Colecalciferol 100% | 50 mcg | **BATE** |
| vitamina B12 (metilcobalamina) | 10,46 mcg | Vitamina B12 – Metilcobalamina | 9,9 mcg | DIVERGE (quase igual) |
| — | — | Vitamina A - Acetato de Retinol | 800 mcg | SÓ NA CALCULADORA |
| — | — | Vitamina K2 (MK7) | 125 mcg | SÓ NA CALCULADORA |
| — | — | Vitamina B1 – Tiamina | 1,5 mg | SÓ NA CALCULADORA |
| — | — | Vitamina B2 - Riboflavina (2 linhas, bug) | 1,6 mg + 10 mg | SÓ NA CALCULADORA |
| — | — | Vitamina B6 - Cloridrato de Piridoxina 99% | 0,3 mg | SÓ NA CALCULADORA |
| — | — | Biotina - Vitamina 7 (H) | 45 mcg | SÓ NA CALCULADORA |
| — | — | Picolinato de Cromo 98-99% | 250 mcg | SÓ NA CALCULADORA |
| — | — | Selenio Quelado 0,2% | 10 mcg | SÓ NA CALCULADORA |

**Conta:** 5 BATE, 6 DIVERGE, 1 SÓ NO CATÁLOGO (mas é 592 mg de 1.000 — quase 60% da porção),
8 linhas SÓ NA CALCULADORA. Este é o par com a maior divergência estrutural do inventário depois
de Saúde Intestinal. Preço próximo: R$ 12,32 × R$ 13,80.

---

### 5.15 Multivitamínico

**Calculadora — escolhida:** "MULTIVITAMINICO", cliente `LEMON CAPS - CATÁLOGO`. **O melhor
casamento de composição de todo o inventário.**

| Insumo (catálogo) | Qtd. catálogo | Insumo (calculadora) | Qtd. calc | Veredito |
|---|---|---|---|---|
| vitamina C (ácido ascórbico) | 533,685 mg | Vitamina C - Ácido Ascórbico 99% | 100 mg | DIVERGE (catálogo é 5×) |
| magnésio (bisglicinato de magnésio) | 260,0 mg | Bisglicinato Magnésio | 260 mg | **BATE** |
| L-teanina | 150,0 mg | L-Teanina | 150 mg | **BATE** |
| niacina (nicotinamida) | 16,0 mg | Vitamina B3 - Nicotinamida 99% | 16 mg | **BATE** |
| zinco (bisglicinato de zinco) | 15,0 mg | Bisglicinato de zinco | 15 mg | **BATE** |
| vitamina E (acetato de DL-alfa-tocoferol) | 10,0 mg | Vitamina E - DL-alfa-tocoferol 50% | 10 mg | **BATE** |
| ácido pantotênico (D-pantotenato de cálcio) | 5,0 mg | Vitamina B5 - D-Pantotenato de Cálcio 98% | 5 mg | **BATE** |
| boro (quelato de boro) | 3,0 mg | Boro Quelado 55 | 3 mg | **BATE** |
| vitamina B6 (cloridrato de piridoxina) | 1,3 mg | Vitamina B6 - Cloridrato de Piridoxina 99% | 1,3 mg | **BATE** |
| vitamina B2 (riboflavina) | 1,3 mg | Vitamina B2 - Riboflavina 100% | 1,3 mg | **BATE** |
| vitamina A (acetato de retinol) | 1.300 mcg | Vitamina A - Acetato de Retinol | 1.300 mcg | **BATE** |
| vitamina B1 (cloridrato de tiamina) | 1,2 mg | Vitamina B1 – Tiamina | 1,2 mg | **BATE** |
| cobre (cobre aminoácido quelato) | 900 mcg | Cobre Bios 24% | 900 mcg | **BATE** |
| ácido fólico | 750 mcg | Vitamina B9 – Ácido Fólico | 800 mcg | DIVERGE (próximo) |
| cromo (picolinato de cromo) | 250 mcg | Picolinato de Cromo 98-99% | 35 mcg | DIVERGE (catálogo é 7×) |
| vitamina K (menaquinona-7) | 149 mcg | Vitamina K2 (MK7) | 149 mcg | **BATE** |
| selênio (selênio quelado) | 100 mcg | Selenio Quelado 0,2% | 100 mcg | **BATE** |
| vitamina D (colecalciferol) | 50 mcg | Vitamina D3 - Colecalciferol 100% | 50 mcg | **BATE** |
| vitamina B12 (metilcobalamina) | 9,94 mcg | Vitamina B12 – Cianocobalamina | 9,9 mcg | **BATE** (forma diferente: metilcobalamina × cianocobalamina, dose igual) |

**Conta:** 16 BATE, 3 DIVERGE (vitamina C, ácido fólico, cromo). Também tem "Dióxido de Silício
10 mg" só na calculadora. Preço próximo: R$ 16,38 × R$ 18,20. Custo de produção candidato: R$ 9,93.
Este é o par que eu recomendaria fechar primeiro — a divergência é pequena e concentrada em 3
linhas.

---

### 5.16 Ômega Pró TG

**Calculadora — escolhida:** "OMEGA 3 (Softgel)", cliente `LEMON CAPS - CATÁLOGO`. Cadastro em só
2 linhas: "Omega 3 total 31,65% (185,34 mg EPA e 123,56 mg DHA) 0,58805" (quantidade "2 unidade",
sem campo numérico próprio) e "Excipiente 1 g".

| Insumo (catálogo) | Qtd. catálogo | Correspondente na calculadora (extraído do texto do item) | Veredito |
|---|---|---|---|
| óleo de peixe TG | 1.000,0 mg | "Excipiente" 1.000 mg (mesma massa, mas tratado como veículo, não como ativo) | **BATE** na massa, observação na etiqueta |
| ômega-3 total | 316,5 mg | 31,65% de 1.000 mg = 316,5 mg (dentro do texto do item) | **BATE** |
| EPA (ácido eicosapentaenoico) | 185,34 mg | "185,34 mg EPA" (texto do item) | **BATE** |
| DHA (ácido docosaexaenoico) | 123,56 mg | "123,56 mg DHA" (texto do item) | **BATE** |
| outros ácidos graxos ômega-3 | 7,6 mg | — (implícito no total, sem linha própria) | SÓ NO CATÁLOGO (linha própria) |

**Os números batem** — mas só porque estão escritos dentro do NOME do item, não em campos de
quantidade/unidade. Isso é um problema de cadastro na calculadora (a linha devia ser 3-4 itens
numéricos: óleo base, EPA, DHA, outros), não uma divergência de fórmula. Preço idêntico:
R$ 25,90 = R$ 25,90 — é o único produto de ômega-3 dos dois lados, então o nome também não tem
concorrente.

---

### 5.17 Pré-treino + Creatina Sabor Limão (420 g)

**Calculadora — escolhida:** "FICHA TÉCNICA PRÉ TREINO + CREATINA 300 G SABOR LIMÃO -
LEMONCAPS PREMIUM", cliente `LEMON CAPS - CATÁLOGO`. **O nome da própria calculadora já diz "300 G"
para o que o catálogo vende como "420 g"** — o mesmo padrão de gramatura inconsistente do par
Detox 150×300 g (seção 5.7); pode ser o mesmo produto com o texto do nome desatualizado, ou pode
ser produto diferente. Não decido.

| Insumo (catálogo) | Qtd. catálogo | Insumo (calculadora) | Qtd. calc | Veredito |
|---|---|---|---|---|
| creatina monoidratada | 5.000 mg | Creatina Monohidratada | 2.000 mg | DIVERGE (catálogo é 2,5×) |
| beta-alanina | 2.000 mg | Beta Alanina | 2.000 mg | **BATE** |
| L-arginina | 3.810 mg | Arginina HCL (800 mg) + L-Citrulina malato (1.400 mg) — formas diferentes, "depende" de qual conta como equivalente | não comparável direto — formas diferentes de arginina |
| taurina | 1.000 mg | L-Taurina | 900 mg | DIVERGE (próximo) |
| L-tirosina | 1.000 mg | L-Tirosina | 400 mg | DIVERGE (catálogo é 2,5×) |
| L-carnitina | 1.000 mg | — | — | SÓ NO CATÁLOGO |
| cafeína anidra | 200 mg | Cafeina Anidra | 200 mg | **BATE** |
| extrato de guaraná | 515 mg | — | — | SÓ NO CATÁLOGO |
| magnésio (de bisglicinato de magnésio) | 350 mg | — | — | SÓ NO CATÁLOGO |
| vitamina B3 (niacinamida) | 35 mg | — | — | SÓ NO CATÁLOGO |
| vitamina B6 (cloridrato de piridoxina) | 90 mg | Vitamina B6 - Cloridrato de Piridoxina 99% | 2 mg | DIVERGE (catálogo é 45×) |
| vitamina B12 (metilcobalamina) | 9,94 mcg | Vitamina B12 – Metilcobalamina | 9,9 mcg | **BATE** |
| vitamina D3 (colecalciferol) | 50 mcg | — | — | SÓ NO CATÁLOGO |
| — | — | Maltodextrina | 600 mg | SÓ NA CALCULADORA |
| — | — | Ácido Cítrico | 1.100 mg | SÓ NA CALCULADORA |
| — | — | Aroma limão Siciliano líquido | 0,035 ml | SÓ NA CALCULADORA |
| — | — | Dióxido de Silício | 118 mg | SÓ NA CALCULADORA |
| — | — | Edulcorante sucralose | 90 mg | SÓ NA CALCULADORA |

**Conta:** 3 BATE, 5 DIVERGE (+ 1 não comparável pela forma), 4 SÓ NO CATÁLOGO, 5 SÓ NA
CALCULADORA. É o par mais divergente entre os "PROPOSTO" (não cheguei a AMBÍGUO porque o nome é
quase idêntico — "Pré Treino + Creatina ... Sabor Limão" nos dois — só a gramatura diverge).
Recomendo conferência direta antes de qualquer atualização. Não precificada na calculadora;
catálogo R$ 40,00.

---

### 5.18 Pré Treino 300 G

**Calculadora — escolhida:** "PRÉ TREINO", cliente `LEMON CAPS - CATÁLOGO`.

| Insumo (catálogo) | Qtd. catálogo | Insumo (calculadora) | Qtd. calc | Veredito |
|---|---|---|---|---|
| creatina monoidratada | 5.000 mg | Creatina Monohidratada | 2.000 mg | DIVERGE (catálogo é 2,5×) |
| L-taurina | 2.000 mg | L-Taurina | 800 mg | DIVERGE (catálogo é 2,5×) |
| ácido cítrico (INS 330) | 1.100 mg | Acido citrico | 1.100 mg | **BATE** |
| L-tirosina | 500 mg | L-Tirosina | 300 mg | DIVERGE |
| aromatizante idêntico ao natural de limão | 350 mg | FRESH DRINK LIMAO | 350 mg | **BATE** (nome genérico × nome comercial, mesma massa) |
| maltodextrina | 342 mg | — | — | SÓ NO CATÁLOGO |
| beta-alanina | 300 mg | Beta Alanina | 2.000 mg | DIVERGE (calc é quase 7× mais) |
| cafeína anidra | 200 mg | Cafeina Anidra | 200 mg | **BATE** |
| dióxido de silício (INS 551) | 118 mg | Dióxido de Silício | 118 mg | **BATE** |
| edulcorante sucralose (INS 955) | 90 mg | Sucralose edulcorante | 90 mg | **BATE** |
| — | — | L-Citrulina malato | 2.500 mg | SÓ NA CALCULADORA |

**Conta:** 5 BATE, 4 DIVERGE, 1 SÓ NO CATÁLOGO, 1 SÓ NA CALCULADORA. Preço quase idêntico:
R$ 44,00 × R$ 43,00. Custo de produção candidato: R$ 25,31 (o mais caro do lote).

---

### 5.19 Pro Energy

**Calculadora — escolhida:** "PRO ENERGY (ESTIMULANTE SEXUAL - Encapsulado - PREMIUM)", cliente
`LEMON CAPS - CATÁLOGO`. Soma: 959 mg de ativos + 41 mg de excipiente = 1.000 mg por porção.

| Insumo (catálogo) | Qtd. catálogo | Insumo (calculadora) | Qtd. calc | Veredito |
|---|---|---|---|---|
| feno-grego em pó | 250,0 mg | Feno Grego extrato seco | 250 mg | **BATE** na massa (forma diverge: pó × extrato) |
| taurina | 215,0 mg | L-Taurina | 200 mg | DIVERGE (próximo) |
| guaraná em pó | 200,0 mg | Guaraná em Pó | 180 mg | DIVERGE (próximo) |
| cafeína | 140,0 mg | Cafeina Anidra | 150 mg | DIVERGE (próximo) |
| L-carnitina | 90,0 mg | — | — | SÓ NO CATÁLOGO |
| cloridrato de L-arginina | 75,0 mg | — | — | SÓ NO CATÁLOGO |
| zinco (bisglicinato de zinco) | 20,0 mg | Bisglicinato de zinco | 20 mg | **BATE** |
| vitamina B6 (cloridrato de piridoxina) | 10,0 mg | Vitamina B6 - Cloridrato de Piridoxina 99% | 9 mg | DIVERGE (próximo) |
| — | — | L-Teanina | 150 mg | SÓ NA CALCULADORA |

**Conta:** 2 BATE, 4 DIVERGE, 2 SÓ NO CATÁLOGO, 1 SÓ NA CALCULADORA.

**Nome:** o nome da calculadora traz "ESTIMULANTE SEXUAL" entre parênteses — alegação funcional que
não está no nome atual do catálogo ("Pro Energy", neutro). Adotar o nome completo da calculadora
introduziria uma alegação nova; decisão do dono/RT.

**Preço:** diverge — R$ 11,20 × R$ 16,90 (catálogo é 51% mais caro). Custo de produção candidato:
R$ 7,11.

---

### 5.20 Saúde Intestinal

**Catálogo (7 insumos):** magnésio 350 mg, quercetina 280 mg, extrato de cúrcuma 130 mg,
L-glutamina 110,31 mg, vitamina B6 98,6 mg (nota: dose alta para B6 — não é objeto deste
inventário, só registro o número lido), zinco 29,59 mg, vitamina A 1.500 mcg.

**Calculadora — candidato mais próximo por nome:** "INTESTINO", cliente `LEMON CAPS - CATÁLOGO"
(quase idêntica a "Melhora Intestinal Em Cápsula" e "BIOGUT - INTESTINO...", que têm a mesma
fórmula-base).

| Insumo (catálogo) | Qtd. catálogo | Insumo (calculadora, "INTESTINO") | Qtd. calc | Veredito |
|---|---|---|---|---|
| magnésio (bisglicinato de magnésio) | 350,0 mg | Bisglicinato Magnésio | 90 mg | DIVERGE (catálogo é quase 4×) |
| quercetina | 280,0 mg | Quercetina | 72 mg | DIVERGE (catálogo é quase 4×) |
| extrato de rizomas de cúrcuma | 130,0 mg | Curcuma | 117 mg | DIVERGE (próximo) |
| L-glutamina | 110,31 mg | L-Glutamina | 135 mg | DIVERGE (próximo) |
| vitamina B6 (cloridrato de piridoxina) | 98,6 mg | Vitamina B6 – Cloridrato de Piridoxina 99% | 1,26 mg | DIVERGE (78×) |
| zinco (bisglicinato de zinco) | 29,59 mg | Bisglicinato de zinco | 13,5 mg | DIVERGE (2×) |
| vitamina A (acetato de retinol) | 1.500 mcg | Vitamina A - Acetato de Retinol | 540 mcg | DIVERGE (quase 3×) |
| — | — | Psyllium (Plantago ovatae) pó | 342 mg | SÓ NA CALCULADORA (maior insumo do card) |
| — | — | Inulina 90% | 135 mg | SÓ NA CALCULADORA |
| — | — | Frutooligossacarídeos FOS | 90 mg | SÓ NA CALCULADORA |
| — | — | Dióxido de Silício | 3 mg | SÓ NA CALCULADORA |

**Conta: 0 BATE, 7 DIVERGE, 3 SÓ NA CALCULADORA.** Nenhuma linha bate exata, e — mais importante —
os insumos que **dominam a massa** de cada lado são diferentes: no catálogo é magnésio (350 mg) e
quercetina (280 mg); na calculadora é psyllium (342 mg), a fibra prebiótica que não aparece no
catálogo **em nenhuma quantidade**. Isso não parece ajuste de dose — parece produto diferente, ou
composição trocada entre dois cadastros do catálogo (o "Saúde Intestinal" pode ter herdado a
composição de outra fórmula por engano). **Marco AMBÍGUO, não PROPOSTO**: antes de comparar dose a
dose, o dono/RT precisa confirmar qual das duas composições é a intenção real do produto.

**Preço:** próximo — R$ 20,67 × R$ 22,90.

---

### 5.21 Serena

**Calculadora — escolhida:** "SONO EM LÍQUIDO FRASCO COM 30 MLS", cliente `LEMON CAPS - CATÁLOGO`
(a fórmula "SERENA (30/06)", mesmo cliente, tem exatamente os mesmos 5 insumos e mesmas doses —
citada como alternativa idêntica).

| Insumo (catálogo) | Qtd. catálogo | Insumo (calculadora) | Qtd. calc | Veredito |
|---|---|---|---|---|
| magnésio (cloreto de magnésio) | 63,0 mg | magnésio quelato | 63 mg | DIVERGE **só na forma do sal** (cloreto × quelato) — mesma dose |
| inositol (mio-inositol) | 50,0 mg | Mio-inositol | 50 mg | **BATE** |
| L-teanina | 50,0 mg | L-Teanina | 50 mg | **BATE** |
| vitamina B6 (cloridrato de piridoxina) | 1,3 mg | Vitamina B6 - Cloridrato de Piridoxina 99% | 1,3 mg | **BATE** |
| melatonina | 0,21 mg | Melatonina | 0,21 mg | **BATE** |

**Conta:** 4 BATE, 1 DIVERGE (só a forma do magnésio, a dose bate). É a segunda melhor composição
do inventário, atrás só do Multivitamínico.

**Preço diverge bastante:** calculadora R$ 12,84 (ou R$ 8,06 na variante "SERENA (30/06)") ×
catálogo R$ 17,00. Vale conferir se a precificação da calculadora está desatualizada, já que a
composição está praticamente pronta.

---

### 5.22 Shot + Colágeno 300 Gramas

**Calculadora — escolhida:** "SHOT + COLÁGENO", cliente `LEMON CAPS - CATÁLOGO`, registro de
19/08 15:27 (o de 15:28, um minuto depois, tem itens corrompidos — ver § qualidade de dado — e
**não foi usado**).

| Insumo (catálogo) | Qtd. catálogo | Insumo (calculadora) | Qtd. calc | Veredito |
|---|---|---|---|---|
| colágeno hidrolisado | 8.400 mg | Colageno Hidrolisado | 5.000 mg | DIVERGE (catálogo é 68% maior) |
| vitamina C (ácido ascórbico) | 800 mg | Vitamina C - Ácido Ascórbico 99% | 1.100 mg | DIVERGE |
| ácido cítrico (INS 330) | 400 mg | Acido citrico | 670 mg | DIVERGE |
| aromatizante idêntico ao natural de limão | 200 mg | FRESH DRINK LIMAO | 330 mg | DIVERGE |
| dióxido de silício (INS 551) | 100 mg | Dióxido de Silício | 100 mg | **BATE** |
| edulcorante sucralose (INS 955) | 50 mg | Sucralose edulcorante | 50 mg | **BATE** |
| maltodextrina | 31,35 mg | Maltodextrina | 2.547 mg | DIVERGE (a calc usa 80× mais maltodextrina — provável papel de veículo/enchimento diferente) |
| corante verde (INS 102 e INS 133) | 17,0 mg | Corante Verde Folha pó | 17 mg | **BATE** |
| zinco (bisglicinato de zinco) | 1,65 mg | Bisglicinato de zinco | 0,29 mg | DIVERGE |
| — | — | Curcuma | 130 mg | SÓ NA CALCULADORA |
| — | — | Café Verde (35% ácido clorogênico) | 50 mg | SÓ NA CALCULADORA |
| — | — | Citrus sinensis (Laranja Moro) | 5 mg | SÓ NA CALCULADORA |

**Conta:** 3 BATE, 6 DIVERGE, 3 SÓ NA CALCULADORA. Preço idêntico: R$ 41,90 = R$ 41,90. Custo de
produção candidato: R$ 24,28.

---

### 5.23 Slim Up - Emagrecimento em Gota

**Calculadora — escolhida:** "Slim Up - EMAGRECIMENTO EM GOTAS LINHA ECONÔMICA FINAL", cliente
`LEMON CAPS - CATÁLOGO`.

| Insumo (catálogo) | Qtd. catálogo | Insumo (calculadora) | Qtd. calc | Veredito |
|---|---|---|---|---|
| extrato de café verde | 92,9 mg | Café Verde (35% ácido clorogênico) | 4 mg | DIVERGE (catálogo é 23×) |
| extrato fluido de semente de feno-grego | 33,0 mg | FENO GREGO EXT FLUIDO | 0,01 ml | não comparável (unidades diferentes: mg × mL) |
| cromo (picolinato de cromo) | 250 mcg | Picolinato de Cromo 98-99% | 250 mcg | **BATE** |
| vitamina D (colecalciferol) | 50 mcg | Vitamina D3 - Colecalciferol 100% | 50 mcg | **BATE** |
| vitamina B12 (metilcobalamina) | 9,94 mcg | Vitamina B12 – Metilcobalamina | 0,072 mg (72 mcg) | DIVERGE (calc é 7×) |
| — | — | Curcuma, Colina Bitartarato, Inulina, Goma Xantana, Ácido cítrico, Benzoato sódio, Sorbato de Potássio, Sorbitol líquido, Água purificada | várias | SÓ NA CALCULADORA (9 itens, a maioria excipiente/conservante) |

**Conta:** 2 BATE, 2 DIVERGE (+ 1 não comparável), 1 SÓ NO CATÁLOGO (feno-grego, se contarmos a
unidade incompatível como ausência), vários SÓ NA CALCULADORA.

**Nome:** "Slim Up" e "Emagrecimento" — alegação de saúde, já reconhecido pelo enunciado; decisão
do dono/RT.

**Atenção à parte, sem ligação com este produto específico:** entre os candidatos descartados para
este mesmo card estava "TIRZ" (cliente `LEMON CAPS - CATÁLOGO`) — nome que evoca **tirzepatida**,
princípio ativo de medicamento controlado para emagrecimento. Mesmo sendo hoje só um codinome
interno de rascunho, **nunca deve chegar a um card público**. Não é o produto escolhido aqui, mas
registro porque apareceu na mesma busca.

**Preço:** diverge — R$ 9,01 × R$ 12,80.

---

### 5.24 ZMA (Zinco, Magnésio e Vitamina B6)

**Calculadora — escolhida:** "ZMA", cliente `LEMON CAPS - CATÁLOGO` (troquei o candidato de maior
pontuação de texto, "ZMA Night", para este, porque "ZMA Night" usa doses de magnésio/zinco/teanina
10-20× menores — parece uma variante "dose baixa" — e o preço de "ZMA" é o que mais se aproxima do
catálogo; ver nota).

| Insumo (catálogo) | Qtd. catálogo | Insumo (calculadora, "ZMA") | Qtd. calc | Veredito |
|---|---|---|---|---|
| bisglicinato de magnésio | 673,055 mg | Bisglicinato Magnésio | 260 mg | DIVERGE (catálogo é 2,6×) |
| L-teanina | 150,0 mg | L-Teanina | 150 mg | **BATE** |
| bisglicinato de zinco | 119,02 mg | Bisglicinato de zinco | 15 mg | DIVERGE (catálogo é 8×) |
| boro (quelato de boro) | 56,6 mg | Boro Quelado 55 | 3 mg | DIVERGE (catálogo é 19×) |
| vitamina B6 (cloridrato de piridoxina) | 1,3 mg | Vitamina B6 - Cloridrato de Piridoxina 99% | 1,3 mg | **BATE** |
| vitamina D (colecalciferol) | 50 mcg | Vitamina D3 - Colecalciferol 100% | 25 mcg | DIVERGE (2×) |
| — | — | Dióxido de Silício | 20 mg | SÓ NA CALCULADORA |

**Conta:** 2 BATE, 4 DIVERGE, 1 SÓ NA CALCULADORA. Preço próximo: R$ 14,80 × R$ 16,50.

**Candidatos descartados:** "ZMA Night - EM CÁPSULAS LINHA ECONÔMICA FINAL" (magnésio 20 mg, zinco
10 mg, teanina 10 mg — todos muito abaixo mesmo do catálogo) e as duas cópias de "ZMA"/"ZMA Em
Cápsula" no rótulo `LEMON CAPS - FÓRMULAS DO CATÁLOGO` (mesma composição da escolhida).

---

## 6. Fórmulas sem par

### 6.1 Do lado do catálogo

Nenhuma. As 24 fórmulas ativas do catálogo tiveram pelo menos um candidato na calculadora —
inclusive as duas marcadas AMBÍGUO (Bella Gummy, Saúde Intestinal), que têm candidato, só não um
candidato satisfatório.

### 6.2 Do lado da calculadora

Dos 104 registros em rótulos "catálogo" (seção 2), 24 foram escolhidos e outros ~14 foram citados
como candidatos descartados nas seções 5.1–5.24. Os cerca de **66 restantes** não correspondem a
nenhuma das 24 fórmulas hoje ativas no catálogo — são rascunhos de produtos que o catálogo não tem
(pedidos avulsos de cliente, testes pessoais do Diego, ou versões de produtos já descontinuados).
Lista por rótulo de `cliente`, só pelo nome (sem reabrir composição — não são objeto deste
inventário):

- **`Catálogo`** (1 registro, todo usado): nenhum sobra.
- **`CATÁLOGO - LEMON CAPS`** (21): sobraram, sem uso — CABELO PELE E UNHA - BIOPRINCESS; Cabelo,
  Pele e Unha - 01; CREATINA MONOHIDRATADA (SOLÚVEL); EMAGRECEDOR - SOLÚVEL; EMAGRECEDOR SOLÚVEL;
  EMAGRECIMENTO - EMAGRECEDOR; EMAGRECIMENTO - LÍQUIDO; EMAGRECIMENTO - MOROSLIM; ESTIMULANTE
  SEXUAL; ESTIMULANTE SEXUAL - LIBIDO; ESTIMULANTE SEXUAL - LINHA PREMIUM; ESTIMULANTE SEXUAL -
  LÍQUIDO; FOCO E MEMÓRIA - 01; LIPEDEMA - LINHA PREMIUM; POLIVITAMÍNICO; PRÉ TREINO - PRÓ ENERGY;
  PRÉ TREINO - SEM CAFEÍNA; PRÉ TREINO - SOLÚVEL; SHOT MATINAL - SOLÚVEL; SONO - LÍQUIDO (usada só
  "Sono/Ansiedade...").
- **`CATÁLOGO - LEMON CAPS - `** (1): DORES ARTICULARES — sobra (não usada; "Dores Musculares" usou
  o ArtFlex do outro rótulo).
- **`Catálogo Lemon`** (3, 1 usado): sobraram "emagrecimento caio em capsulas 16/09" (citada como
  descartada em 5.13) e "TESTE 1" (2 itens, claramente um teste, sem relação com produto nenhum).
- **`LEMON CAPS - CATÁLOGO`** (46, 13 usados diretamente + vários citados como descartados):
  sobraram sem qualquer uso — LIPEDEMA 60 CÁPSULAS - LEMONCAPS PREMIUM; Bio Princess (Saúde e bem
  estar); BIOGUT - INTESTINO (citada em 5.20); CABELO PELE E UNHA EM CÁPSULAS LINHA ECONÔMICA
  FINAL; CREATINA (Força e Disposição - Solúvel); CREATINA MONOHIDRATADA EM GUMMY; DORES
  ARTICULARES 60 CÁPSULAS (citada em 5.8); Emagrecimento em Gotas (Linha Standart); EMAGRECIMENTO
  EM CÁPSULAS - LINHA ECONÔMICA FINAL; Flex Move (citada em 5.8); Foco e Concentração - Linha
  Econômica (citada em 5.10); Foco e Concentração (Linha Standart); halito manel; Inibidor de
  Apetite; Multi Vita (usada em 5.14, é a mesma); Premium Capilar com Creatina (23 itens, sem
  produto correspondente óbvio no catálogo hoje); SHOT 300 GRAMAS - LEMONCAPS PREMIUM; Slim Fit;
  SONO EM LÍQUIDO FRASCO (usada em 5.21); TADALA AFRICANO (sem produto correspondente no catálogo);
  ZMA Night (citada em 5.24).
- **`LEMON CAPS - FÓRMULA CATÁLOGO`** (4, 0 usados diretamente): CABELO PELE E UNHA EM CÁPSULAS -
  Standard; DORES ARTICULARES EM CÁPSULAS - Standard; ESTIMULANTE SEXUAL 60 CÁPSULAS - Standard;
  SONO EM LÍQUIDO - Standard — todas com composição igual ou muito parecida às versões escolhidas
  de outro rótulo; ficam de reserva.
- **`LEMON CAPS - FÓRMULAS DO CATÁLOGO`** (4, 0 usados diretamente): Lipedema pote C/60 Cápsulas
  (sem produto "Lipedema" no catálogo hoje — possível produto descontinuado); MULTIVITAMÍNICO; ZMA;
  ZMA Em Cápsula — reserva de outro rótulo com composição igual.
- **`LEMON CAPS - FÓRMULAS DO CATÁLOGO.`** (24, 3 usados): sobraram — CABELO, PELE E UNHA EM GUMMY
  e a variante "(60 GOMAS)" (candidatas fracas para Bella Gummy, não usadas por serem tão
  incompletas quanto as escolhidas); CREATINA EM GUMMY (genérica, sem sabor); Emagrecimento Em
  Cápsula (citada em 5.9); EMAGRECIMENTO EM GOTAS (30ML); EXTIMULANTE SEXUAL EM CÁPSULA (citada em
  5.19); Foco e Concentração em Cápsula (citada em 5.10); Lemon Shot - Standard (citada em 5.7);
  **Lipedema Em Cápsula (sem produto "Lipedema" no catálogo hoje — mesmo caso do rótulo anterior:
  o catálogo parece ter descontinuado um produto de lipedema que a calculadora ainda guarda em
  pelo menos 2 rótulos diferentes)**; Melatonina + Triptofanos EM GUMMY (15 itens — não é a mesma
  fórmula usada para "Melatonina em Gummy Sabor Uva", que é mais simples); Qualidade de Sono em
  Líquido (citada em 5.21, mesma composição); as quatro variantes de "Pré-Treino Solúvel 300g"
  (base, "THE BEST", "-> Premium.", "-> Standard.") — nenhuma foi o candidato escolhido para os
  dois produtos de pré-treino do catálogo, mas ficam de reserva, já com composição extraída caso
  seja útil depois.

**Padrão a destacar**: pelo menos dois rótulos diferentes da calculadora guardam uma fórmula de
"Lipedema" que **não existe mais como produto ativo no catálogo** — pode ser produto
descontinuado (não decido) ou um produto que deveria voltar a existir.

---

*Nada foi gravado em nenhum banco. Nenhum commit foi feito. Este arquivo é a única saída desta
tarefa.*
