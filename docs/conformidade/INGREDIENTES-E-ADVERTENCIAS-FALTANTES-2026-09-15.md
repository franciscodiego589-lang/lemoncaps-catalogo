# Ingredientes e advertências faltantes — auditoria de 2026-09-15

## Contexto e método

Seis fórmulas ativas do banco de produção (`https://zjryrmqtumvaxdytvbbv.supabase.co`) estão com
`ingredients_list` e `warnings` vazios — confirmado ao vivo em 15/09/2026 pela leitura direta da
tabela `formulas` via a chave pública de leitura. Esta auditoria buscou, para cada uma das seis,
uma fonte com procedência clara (rótulo lido ou documento da fábrica) para propor o texto de
`ingredients_list` e de `warnings`. Nenhuma gravação foi feita no banco: leitura foi livre, escrita
nenhuma.

Fontes consultadas, além do banco:

1. `docs/conformidade/composicoes_rotulo.json` — 15 rótulos lidos visualmente de artes-finais em
   curvas da Lemon Caps (PyMuPDF, alta resolução), extraídos em 13/09/2026.
2. A tabela `formula_compositions` do próprio banco (join `formulas → formula_compositions`), para
   comparar a composição realmente registrada de cada fórmula-alvo.
3. Nove documentos indicados no pedido, em `~/Downloads/`, mais uma busca própria por nome de
   arquivo (creatina, melatonina, ômega, gummy) que trouxe dezenas de documentos adicionais.
4. Duas pastas fora do projeto que se mostraram centrais depois de uma pista encontrada no próprio
   código do catálogo (`lib/catalog/regulatory-info.ts`, que cita como fonte primária um documento
   de Dizeres de Rotulagem da fábrica): `~/Desktop/POPS/19_SISTEMA_MEMORIAIS/` e, a partir daí, a
   árvore inteira de `~/Desktop/POPS/` (Procedimentos Operacionais Padrão da Lemon Caps — fichas
   técnicas, ordens de produção, memoriais de cálculo, rotulagem, referências ANVISA). Esta árvore
   é vasta (dezenas de subpastas); esta auditoria não a esgotou — foram lidos os documentos mais
   diretamente relevantes aos seis alvos, não todo arquivo existente.
5. Tentativa real de acesso ao AnvisaLegis (`https://anvisalegis.datalegis.net`), via WebFetch, para
   a RDC 243/2018 e a IN 28/2018 — relatado em detalhe na seção final. Duas tentativas com URL
   adivinhada falharam (busca do Google bloqueada; URL direta devolveu 404). Uma terceira tentativa,
   usando a URL já verificada e registrada em `lib/catalog/regulatory-info.ts` (aberta e conferida
   por outra sessão de trabalho neste mesmo projeto em 13/09/2026), **funcionou** e trouxe texto
   literal do Art. 14 da RDC 243/2018 — ver seção "Advertências obrigatórias por norma", ao final.

**Regra seguida em toda esta auditoria**: só chega a "PRONTO PARA GRAVAR" o que vem de rótulo lido
ou de documento da fábrica com procedência clara. Onde a evidência era forte mas indireta (mesma
fórmula, sabor ou pote diferente), ela fica registrada como inferência e a fórmula fica PENDENTE.
Onde dois documentos de procedência semelhante se contradisseram sobre um fato central (não sobre
redação, mas sobre a presença de um ativo), a fórmula também fica PENDENTE — por mais completo que
um dos dois documentos pareça.

---

## 1. `creatina-em-gummy-sabor-tutti-frutti` — CREATINA EM GUMMY SABOR TUTTI-FRUTTI

**O banco hoje**: formato goma, 60 gomas por pote, público-alvo "Adultos (19 anos ou mais)",
conservação "Conservar abaixo de 26 °C", modo de uso "Consumir 2 gomas ao dia, ou conforme
orientação de profissional de saúde", informação nutricional "3 g de creatina / Base da Gummy".
Composição registrada em `formula_compositions`: **creatina monoidratada, 3000 mg** — único item.

**Fontes encontradas**:

- `dossie-tecnico-creatina-em-gummy-sabor-tutti-frutti.pdf` (Lemon Caps, datado 12/09/2026) — bate
  linha a linha com todos os campos já preenchidos no banco (nome, composição, informação
  nutricional, modo de uso, público-alvo, conservação). É um dossiê comercial (tem preço por pote e
  pedido mínimo), sem seção de INGREDIENTES nem de ADVERTÊNCIAS — não serve de fonte para os dois
  campos que faltam, só confirma que os campos já preenchidos vieram dele.
- `OP_Completa_Gummy_Creatina_Tutti_Frutti_130_Potes.pdf` — Ordem de Produção real, com cliente
  (Ingridy Taques), vendedor, número de pedido e campos de assinatura (Operador/Conferente/CQ/RT).
  Produto: "**Creatina Astryx** Tutti Frutti Gummy" — é a mesma receita-base fabricada sob uma marca
  de cliente ("Astryx"), não o item "Lemon Caps Premium" do catálogo. Traz a receita completa em
  matéria-prima: creatina monohidratada 34,703%, sorbitol líquido 70% 26,031%, maltitol cristal
  18,742%, gelatina em pó 10,412%, água purificada 4,810%, glicerina vegetal 3,644%, aroma tutti
  frutti 0,783%, ácido cítrico anidro 0,250%, pectina cítrica ATM 0,208%, citrato de sódio 0,208%,
  sorbato de potássio 0,104%, corante rosa 0,064%, sucralose 0,040%.
- `Ficha_Tecnica_Resumida_Gummy_Creatina_Tutti_Frutti_150_Potes.pdf` — sem nome de cliente, mesma
  receita, mesmos percentuais (escalados para 150 potes), mesma ressalva.
- Não encontrei nenhuma ficha técnica oficial Lemon Caps (padrão "FT-...", com CNPJ e assinatura do
  RT) nem nenhum Dizer de Rotulagem específico para o sabor tutti-frutti — o que existe nesse
  padrão é `FT-CREATINA-GUMMY_Ficha_Tecnica_Creatina_Gummy_Lemoncaps.pdf` e o
  `DRT_GUMMY_CREATINA.html` (`~/Desktop/POPS/19_SISTEMA_MEMORIAIS/`), mas ambos são explicitamente
  do sabor **frutas vermelhas** (ver item 2), não tutti-frutti.

**A fórmula 1 e a 2 são o mesmo produto em sabores diferentes?** Sim, na composição: as duas têm
exatamente 3000 mg de creatina monoidratada por porção, mesmo formato (goma), mesmo pote (60
gomas), segundo o próprio banco. As duas Ordens de Produção de creatina em gummy (tutti-frutti e —
ver item 2 — frutas vermelhas) usam a mesma base de goma nos mesmos percentuais, mudando só aroma e
corante. É evidência forte, mas continua sendo **inferência**: não achei um documento que declare
o texto de rótulo (INGREDIENTES) especificamente para o sabor tutti-frutti com a nomenclatura
técnica exigida (INS do corante, tipo do aromatizante). A Ordem de Produção chama o corante de
"Corante Rosa" e o aroma de "Aroma Tutti Frutti" — nomes internos de compra, não o dizer que vai no
rótulo (que precisa do nome técnico e do INS, como "corante vermelho ponceau (INS 124)" no sabor
frutas vermelhas).

**Texto proposto (derivado, não pronto)**: por inferência a partir da receita-base confirmada em
duas Ordens de Produção e trocando só os itens de sabor:

> Creatina monoidratada, maltitol, sorbitol líquido, gelatina (agente de textura), água purificada,
> glicerina vegetal (umectante), ácido cítrico (INS 330), pectina cítrica (espessante), aroma tutti
> frutti, citrato de sódio (INS 331), corante [nome técnico e INS do "corante rosa" — não
> confirmado], conservador sorbato de potássio (INS 202) e edulcorante sucralose (INS 955).

O corante entre colchetes é o ponto que impede classificar como pronto: "rosa" pode ser mais de um
corante autorizado (carmim, vermelho 40, ponceau, ou uma mistura) e a lista de ingredientes é dizer
de rotulagem — não entra com lacuna.

**Classificação final: PENDENTE.**
**Pedir à fábrica**: arte-final do rótulo (PDF em curvas) do produto CREATINA EM GUMMY SABOR
TUTTI-FRUTTI, versão vigente, marca Lemon Caps Premium (não a versão de cliente/Astryx) — ou, na
falta dela, a Ficha Técnica de Produto no mesmo padrão de `FT-CREATINA-GUMMY_...pdf`, com a seção 3
(INGREDIENTES) e a 9 (ADVERTÊNCIAS OBRIGATÓRIAS) preenchidas para este sabor especificamente.

---

## 2. `creatina-gummy-sabor-frutas-vermelhas` — CREATINA GUMMY SABOR FRUTAS VERMELHAS

**O banco hoje**: formato goma, 60 gomas por pote, público-alvo "Adultos (19 anos ou mais)",
conservação "Conservar em temperatura abaixo de 26 °C", modo de uso igual ao item 1, informação
nutricional "Porções por embalagem: 30 / 1 Porção: 3 g (2 gomas)" — **nota**: esse "3 g" por porção
de 2 gomas é, em si, uma inconsistência do próprio banco frente a praticamente toda fonte externa
(ver "Achados e contradições", abaixo); não mexi nesse campo porque está fora do pedido. Composição
registrada: **creatina monoidratada, 3000 mg** — único item.

**Fontes encontradas, da mais para a menos forte**:

1. `~/Desktop/POPS/19_SISTEMA_MEMORIAIS/DRT_GUMMY_CREATINA.html` — os **Dizeres de Rotulagem**
   oficiais da fábrica para este produto. É a mesma fonte primária que o próprio código do
   catálogo já usa e documenta (`lib/catalog/regulatory-info.ts`, comentário de topo: "lido de
   .../DRT_GUMMY_CREATINA.html ..., conferido linha a linha em 12/09/2026. Fonte primária da
   própria fábrica, não resumo de terceiro."). Painel Lateral Esquerdo declara sabor "Frutas
   Vermelhas", ingredientes e advertências completos (texto abaixo).
2. `docs/conformidade/composicoes_rotulo.json`, chave `creatina_gummy` — leitura visual da
   arte-final em curvas `creatina gummy.pdf`, 13/09/2026, confiança "alta". Mesmo conjunto de
   ingredientes, mesmo corante (vermelho ponceau, INS 124). **Correção de procedência**: abri o
   arquivo-fonte `~/Downloads/creatina gummy.pdf` diretamente (1 página, arte 220×90 mm, texto
   extraível) e confirmo que é um rótulo real, fabricado pela Lemoncaps (mesmo CNPJ e mesmo RT das
   outras fontes) — mas para a marca de terceiro **"Ultra Life & Co"** (@ultra.e.life), não para a
   marca "Lemon Caps Premium" do catálogo. Isso não invalida o conteúdo (ingrediente, dose e
   advertência são dado de composição, não de marca, e a receita bate com as outras três fontes),
   mas registro a ressalva: esta fonte específica é de rótulo de cliente, não do item genérico do
   catálogo.
3. `FT-CREATINA-GUMMY_Ficha_Tecnica_Creatina_Gummy_Lemoncaps.pdf` — ficha técnica oficial Lemon
   Caps, CNPJ 55.836.075/0001-07, assinada pelo Farm. Resp. Anderson C. Barbosa (CRF/MT 5526),
   datada 27/07/2026, com citação explícita "RDC 243/2018 e IN 28/2018 (ANVISA)". Mesmo conjunto de
   ingredientes e mesmo corante das duas fontes acima.
4. `~/Desktop/POPS/03_FICHAS_TECNICAS/FICHA-TECNICA-CREATINA-GUMMY-FRUTAS-VERMELHAS-SUELEN.docx` —
   variante de cliente ("Suelen"), mesmo conjunto de ingredientes (com "corante" sem nome técnico) e
   texto de advertências praticamente idêntico ao do DRT — inclusive a frase sobre efeito laxativo.

As quatro fontes concordam no **conjunto de ingredientes** e no **teor de advertências**. Divergem
entre si só no peso do pote e no tamanho da porção (180 g/6 g nas fontes 2 e 3; 210 g/7 g na fonte
1; 90 g/3 g na fonte 4) — isso é ruído de variante comercial (mesmo miolo de receita, pote/goma de
tamanhos diferentes para clientes diferentes) e **não faz parte deste pedido** (só `ingredients_list`
e `warnings`), por isso não influenciou a classificação. Fica registrado como achado, abaixo.

**Texto proposto para `ingredients_list`** (fonte: DRT_GUMMY_CREATINA.html, ordem ajustada — ver
nota):

> Creatina monoidratada, maltitol, sorbitol líquido, gelatina (agente de textura), água purificada,
> glicerina vegetal (umectante), ácido cítrico (INS 330), pectina cítrica (espessante), aroma de
> frutas vermelhas, citrato de sódio (INS 331), corante vermelho ponceau (INS 124), conservador
> sorbato de potássio (INS 202) e edulcorante sucralose (INS 955).

Nota sobre a ordem: o DRT lista "maltitol, sorbitol líquido, creatina monoidratada..." — creatina em
terceiro lugar. As outras três fontes (composicoes_rotulo.json, a ficha técnica oficial e a versão
Suelen) listam creatina em primeiro lugar, o que bate com a exigência de ordem decrescente de
quantidade (creatina é 34,7% da receita bruta, o maior item, segundo a Ordem de Produção 526) e com
o próprio DRT sendo, por definição do arquivo, um documento "editável" ainda em rascunho ("clique em
qualquer texto para editar"). Por isso segui a ordem das outras três fontes, e não a do DRT — é
ajuste de sequência, nenhuma palavra do dizer foi trocada ou inventada.

**Texto proposto para `warnings`** (fonte: DRT_GUMMY_CREATINA.html, "Público indicado" +
"ADVERTÊNCIAS" + conservação do Painel Lateral Direito; corroborado quase palavra por palavra pela
ficha técnica da Suelen):

> Este produto não é um medicamento.
> Público indicado: Adultos (19 anos ou mais).
> O consumo excessivo pode ter efeito laxativo (contém polióis).
> Não exceder a recomendação diária de consumo indicada na embalagem.
> Mantenha fora do alcance de crianças.
> Não deve ser consumido por gestantes, lactantes e crianças.
> Conservar o produto em local seco, fresco e arejado, ao abrigo da luz e do calor excessivo, em
> temperatura ambiente entre 15 °C e 30 °C.
> Após aberto, consumir em até 60 dias.
> Não consumir se o lacre de segurança estiver violado.

As três primeiras frases (não é medicamento / não exceder / fora do alcance de crianças) são texto
literal do Art. 14, I, "c", "d" e "e" da RDC 243/2018 — conferido ao vivo no AnvisaLegis nesta
mesma tarefa (ver seção final). A frase do efeito laxativo é dizer de rotulagem real dos polióis
(maltitol e sorbitol), presente em duas fontes de procedência distinta (DRT e ficha da Suelen) e
ausente só na ficha técnica FT-CREATINA-GUMMY de 27/07/2026 — mais um indício de que essa ficha é
uma versão anterior, menos completa, do dizer.

**Classificação final: PRONTO PARA GRAVAR.** Quatro fontes independentes convergem no conteúdo; as
três primeiras frases de advertência são texto legal conferido ao vivo.

---

## 3. `creatina-monohidratada-300g-soluvel` — CREATINA MONOIDRATADA 300 g SOLÚVEL

**O banco hoje**: formato solúvel, `net_weight` **vazio** (o pote de 150 g tem "150 g" preenchido; o
de 300 g, não — inconsistência do próprio cadastro, fora do pedido), pote "300 Gramas", conservação
"Conservar em temperatura média entre 20 °C e 28 °C" (redação diferente da do pote de 150 g),
modo de uso **idêntico, palavra por palavra**, ao do pote de 150 g: "Diluir 5 g (1 dose) em 200 mL
de água e consumir 1 vez ao dia, ou conforme orientação de profissional de saúde" — essa igualdade
não é acaso: a migration `supabase/migrations/20260919000000_padroniza_modo_de_uso.sql` (14/09/2026)
registra, no próprio comentário, que o dono conferiu e confirmou que os dois potes de creatina
solúvel têm a mesma dose (5 g) e devem ter o mesmo modo de uso. Composição registrada em
`formula_compositions`: **creatina monoidratada, 5000 mg** — mesmo valor do pote de 150 g.

**A 3 e a `creatina-monohidratada-150g-soluvel` são o mesmo produto em potes diferentes?** Pela
dose ativa (5000 mg/porção) e pelo modo de uso (idêntico, e confirmado como intencional pelo dono na
migration de 19/09), sim. O pote de 150 g tem rótulo lido com ingrediente único: "Creatina
monoidratada." (`composicoes_rotulo.json`, chave `creatina_po_150g`, fonte `CreatinaPo.pdf`, sabor
"sem sabor", confiança alta). Por não ter sabor, esse produto não tem aroma nem corante — os únicos
itens que mudam com o sabor entre variantes de um mesmo produto — o que reduz bastante o risco de o
pote de 300 g ter uma lista de ingredientes diferente da do pote de 150 g. Ainda assim, continua
sendo **inferência** (mesmo raciocínio do item 1): não é o mesmo documento, é o mesmo produto por
dedução.

**Achado que impede até essa inferência de virar "pronto"**: existe um arquivo de arte de rótulo,
`~/Downloads/CREATINA MONOHIDRATADA 300 GRAMAS.svg`, com o painel de INFORMAÇÃO NUTRICIONAL de um
produto de 300 g — e ele descreve uma estrutura de porção **diferente** da que está no banco:
"Porções por embalagem: 100 | Porção: 3.000 mg (1 dosador)" — ou seja, dose de 3 g (não 5 g) e 100
doses no pote (não as ~60 que uma dose de 5 g daria em 300 g). A tabela desse SVG também traz
"Creatina Monohidratada 3000 mg" como único item de composição, o que ainda aponta para um produto
de ingrediente único — mas com dose e contagem de doses diferentes do que está cadastrado. Não dá
para saber, só com os arquivos disponíveis nesta tarefa, se esse SVG é uma versão descontinuada, uma
arte de um cliente diferente, ou se é o SVG que está certo e o cadastro do banco (5000 mg, herdado
do pote de 150 g) é que está desatualizado para o pote de 300 g especificamente.

**Mais uma fonte, a favor da dose de 5 g**: `~/Desktop/FÓRMULAS LEMON CAPS/proposta_CREATINA_EM_PÓ_POTE_COM_300_GRAMAS_60_DOSES_C_5_GRAMAS_CADA_20260214 (1) (1).pdf`
— proposta comercial interna da própria Lemon Caps (cliente listado como "LEMON CAPS", não um
cliente externo), de 14/02/2026 — a mais antiga encontrada nesta auditoria inteira. Declara "Dose
Sugerida: 5000 g" e "Doses por Frasco: 60", batendo com o que está hoje no banco (5000 mg/dose) e
não com o SVG (3 g/100 doses). É um documento comercial genérico, sem lista de ingredientes, e não
muda a classificação — mas inclina o peso da evidência a favor do valor que já está cadastrado, não
do SVG.

**Classificação final: PENDENTE** — mesmo com ingrediente único bem confirmado no pote-irmão, e com
uma segunda fonte agora a favor da dose de 5 g, a existência de uma arte de rótulo com estrutura de
dose diferente para o próprio pote de 300 g é contradição real demais para gravar por inferência sem
que alguém da fábrica confirme qual arte está vigente.
**Pedir à fábrica**: (1) confirmar qual é a dose e a contagem de doses vigente do pote de 300 g —
5 g × ~60 doses (como está no banco hoje) ou 3 g × 100 doses (como está no SVG); (2) depois de
resolvido isso, a arte-final do rótulo em curvas do produto CREATINA MONOIDRATADA 300 g SOLÚVEL,
versão vigente, para conferir se, como no pote de 150 g, o único ingrediente é "Creatina
monoidratada." sem mais nada.

---

## 4. `melatonina-em-gummy-sabor-uva` — Melatonina em Gummy Sabor Uva

**O banco hoje**: formato goma, 60 gomas por pote, público-alvo **vazio**, conservação **vazia**
(dois campos a mais faltando, fora do pedido), modo de uso "Consumir 2 gomas ao dia, ou conforme
orientação de profissional de saúde", informação nutricional "Porções por embalagem: 30 / Porção:
6 g (2 gomas)". Composição registrada em `formula_compositions`: **L-triptofano 800 mg + melatonina
0,21 mg**.

### O achado mais importante desta auditoria: dois grupos de documentos se contradizem sobre um ativo inteiro

**Grupo A — leva L-triptofano** (bate com o que o banco tem hoje):

- `FT-DREAM-GUMMY_Ficha_Tecnica_Dream_Gummy_Lemoncaps.pdf` — ficha técnica oficial Lemon Caps (CNPJ,
  RT Anderson C. Barbosa, revisão controlada), datada 27/07/2026. Nome comercial: **"Dream Gummy"**.
  Composição declarada: L-triptofano 800 mg + melatonina 0,21 mg por porção de 6 g (2 gomas) — bate
  exatamente com o banco. A própria ficha traz uma nota da época: "Confirmar também o teor de
  L-triptofano (800 mg) frente ao limite da norma antes da impressão definitiva do rótulo" — ou
  seja, o próprio documento se registra como não fechado.
- `docs/conformidade/composicoes_rotulo.json`, chave `dreamgummy` — leitura visual da arte-final em
  curvas `DreamGummy.pdf`, 13/09/2026 (dois dias antes desta auditoria), confiança alta. Mesma
  composição: L-triptofano 800 mg + melatonina 0,21 mg, sabor uva, 6 g/2 gomas, 30 porções.

**Grupo B — só melatonina, sem triptofano** (contradiz o banco):

- `~/Downloads/Relatorio_Rotulos_Melatonina_Creatina.pdf` — mostra a arte final (renderizada, com
  ilustração de uva e elementos de marca) de um rótulo "**Melatonina em Gummy**", sabor uva, 180 g,
  60 gomas. A lista de INGREDIENTES e a composição por porção declaram só **melatonina 0,21 mg**,
  sem qualquer menção a triptofano. Arquivo sem data interna visível; data de modificação no disco:
  14/05/2026.
- `~/Desktop/POPS/FICHA-TECNICA-MELATONINA-GUMMY-UVA-SUELEN.docx` — ficha técnica com o nome do
  produto escrito exatamente como no banco, **"MELATONINA EM GUMMY — SABOR UVA"** (e não "Dream
  Gummy"), com CNPJ e RT idênticos aos da fábrica. Porção 7,0 g (2 gomas), 30 porções. Composição:
  só **melatonina 0,21 mg**, descrita como "teto diário autorizado pelo painel de Constituintes
  Autorizados da ANVISA para maiores de 19 anos (CAS 73-31-4, especificação USP-NF, consultado em
  27/08/2026)" — sem triptofano em nenhum lugar do documento. Data de modificação no disco:
  28/08/2026 — mais recente que a ficha "Dream Gummy" do Grupo A.

O nome do produto nos dois documentos do Grupo B ("Melatonina em Gummy", "MELATONINA EM GUMMY —
SABOR UVA") bate literalmente com o nome cadastrado no banco para este slug; os dois documentos do
Grupo A chamam o produto de "Dream Gummy" — um nome comercial diferente. Isso pesa a favor do Grupo
B ser o produto certo para *este* slug especificamente. Mas a arte-final mais recente de todas
(`DreamGummy.pdf`, lida em 13/09/2026, a dois dias desta auditoria) é do Grupo A. Não há, entre os
documentos revisados nesta tarefa, nenhum que diga explicitamente "Dream Gummy foi renomeado para
Melatonina em Gummy Sabor Uva" ou equivalente — a contradição não se resolve com o que existe.

**Achado que esclarece a origem da divergência, sem resolvê-la**: `~/Desktop/FÓRMULAS LEMON CAPS/`
guarda duas propostas comerciais internas da Lemon Caps, **do mesmo dia**, 19/02/2026 — a mais
antiga referência a este produto encontrada nesta auditoria:

- `proposta_GUMMYS_MELATONINA_60_UNIDADES_20260219 (1).pdf` — produto "GUMMYS MELATONINA 60
  UNIDADES", composição só com "Melatonina 0,21 mg" (sem triptofano).
- `proposta_MELATONINA_+_TRIPTOFANO_POTE_COM_60_GUMMYS_20260219 (2).pdf` — produto "MELATONINA +
  TRIPTOFANO POTE COM 60 GUMMYS", composição com "L-Triptofano 250 mg" + "Melatonina 0,21 mg" (uma
  terceira dose de triptofano, diferente das 800 mg do Grupo A e das 860 mg da ficha Capleev citada
  no item 5).

Ou seja: "melatonina só" e "melatonina + triptofano" não são uma versão que substituiu a outra no
tempo — são **dois produtos deliberadamente distintos**, propostos lado a lado desde o início do
catálogo (fevereiro de 2026). A pergunta certa não é "qual documento é mais novo", é "qual desses
dois produtos o slug `melatonina-em-gummy-sabor-uva` deveria representar" — e, por nome, os dois
documentos que chamam o produto exatamente como o banco chama ("Melatonina em Gummy", sem
"triptofano" no nome) são os dois do Grupo B. Isso é análise minha, não fato lido — por isso a
fórmula continua PENDENTE, e não viro a classificação sozinho.

Isso não é uma diferença de redação: é a diferença entre o produto ter ou não ter um segundo
ingrediente ativo (triptofano, 800 mg). Errar para qualquer lado é declarar uma composição que o
produto físico não tem, ou deixar de declarar uma que tem.

**Classificação final: PENDENTE — por decisão, não por falta de texto candidato.** Tenho texto de
sobra dos dois lados; o que falta é saber qual dos dois é o produto real. Não vou propor um valor
"mais provável" como se fosse fato.

**Pedir à fábrica/à dona/ao responsável técnico** (pergunta objetiva, não uma lista de documentos):
o pote de "Melatonina em Gummy Sabor Uva" hoje em produção leva L-triptofano (800 mg por porção,
como a ficha "Dream Gummy" e a arte-final DreamGummy.pdf) ou é só melatonina 0,21 mg (como o
Relatório de Rótulos e a ficha da Suelen)? A resposta decide não só `ingredients_list`, mas também
se `formula_compositions` está certo hoje — o que está fora do alcance desta tarefa, mas precisa ir
para quem cuida do cadastro de composição.

Se a resposta vier a ser "só melatonina", o texto abaixo (fonte: ficha técnica Suelen, que é a mais
recente e mais detalhada do Grupo B) fica pronto para uso imediato:

> `ingredients_list` candidato: Melatonina, sorbitol líquido, maltitol, gelatina, água purificada,
> glicerina vegetal, ácido cítrico, pectina cítrica, aromatizante idêntico ao natural de uva,
> citrato de sódio, conservador sorbato de potássio (INS 202), edulcorante sucralose (INS 955) e
> corante [nome técnico e INS não declarados nesta ficha — mais uma lacuna a fechar].
>
> `warnings` candidato: Este produto não é um medicamento. Público indicado: Adultos (19 anos ou
> mais). Não autorizada alegação de propriedade funcional e/ou de saúde para a melatonina. Este
> produto não deve ser consumido por gestantes, lactantes, crianças e pessoas envolvidas em
> atividades que requerem atenção constante. Pessoas com enfermidades e/ou sob uso de medicamentos,
> consulte seu médico. O consumo excessivo pode ter efeito laxativo (contém polióis). Não exceder a
> recomendação diária de consumo indicada na embalagem. Mantenha fora do alcance de crianças.
> Conservar o produto em local seco, fresco e arejado, ao abrigo da luz e do calor excessivo, em
> temperatura ambiente entre 15 °C e 30 °C. Após aberto, consumir em até 60 dias. Não consumir se o
> lacre de segurança estiver violado.

Se a resposta vier a ser "leva triptofano", o texto de `ingredients_list` da ficha "Dream Gummy"
(seção 3, já com todos os INS) está pronto para uso, mas o `warnings` dessa mesma ficha é mais curto
(não traz a frase do efeito laxativo nem as duas frases mais específicas de melatonina que aparecem
na ficha da Suelen) — precisaria de nova conferência antes de gravar.

---

## 5. `melatonina-triptofanos-encapsulados` — Melatonina + Triptofanos (Encapsulados)

**O banco hoje**: formato cápsula, 60 cápsulas por pote, público-alvo "Adultos (19 anos ou mais)",
conservação **vazia**, modo de uso "Ingerir 2 cápsulas ao dia, ou conforme orientação de
profissional de saúde", informação nutricional "Porções por embalagem: 30 / Porção: 1g (2
Cápsulas)". Composição registrada em `formula_compositions` (9 itens): L-triptofano 572,38 mg;
ácido L-aspártico 150 mg; L-glutamina 94,77 mg; fosfatidilserina 70 mg; magnésio (bisglicinato de
magnésio) 63 mg; zinco (bisglicinato de zinco) 29,59 mg; dióxido de silício (INS 551) 20,01 mg;
melatonina 0,21 mg; biotina (D-biotina) 45 mcg.

**A composição de 9 itens está confirmada como correta e deliberada** —
`~/Desktop/POPS/14_ROTULAGEM/PROMPT-LOVABLE-CATALOGO-6-PRODUTOS.md` (08/09/2026, uma semana antes
desta auditoria) é uma instrução explícita de atualização de catálogo, título "Atualização do
catálogo — 6 produtos ajustados aos limites diários da ANVISA", e o item 5 dessa lista traz a
tabela de composição por porção **idêntica, valor por valor**, à que está hoje em
`formula_compositions` para este slug. Ou seja: os números batem porque foram ajustados de
propósito para caber nos limites da ANVISA, não por acaso ou por sobra de outro produto.

O que esse documento **não traz** é o dizer de rotulagem (`ingredients_list` com nome técnico e INS
de cada excipiente, nem `warnings`) — só a tabela de composição por dose.

**Outras fontes encontradas, nenhuma com o dizer de rotulagem certo para esta composição
específica**:

- `dossie-tecnico-melatonina-triptofanos-encapsulados.pdf` (e a cópia "(1)") — dossiê comercial
  Lemon Caps, 12/09/2026, composição batendo com os 9 itens acima (inclusive as casas decimais:
  572,38 / 94,77 / 29,59 / 20,01), mas sem seção de INGREDIENTES nem ADVERTÊNCIAS — mesmo formato
  do dossiê do item 1, feito para orçamento, não para rótulo.
- `Ordem_de_Producao_Melatonina_Triptofano_OP_586_layout_corrigido.pdf` — Ordem de Produção real,
  cliente "Exclusiva Nutri Ltda.", **mas é uma fórmula diferente**: triptofano 800 mg + melatonina
  0,21 mg só, sem os outros 7 itens (ácido aspártico, glutamina, fosfatidilserina, magnésio, zinco,
  biotina). Descartada por não ser a mesma receita.
- `FICHA TÉCNICA MELATONINA + TRIPTOFANO CAPLEEV.docx` — também é outra fórmula: é um produto em
  **goma** (não cápsula), sabor frutas vermelhas, com 860 mg de triptofano por porção — nem o
  formato nem a dose batem com o alvo. Descartada.
- `~/Downloads/Guilherme-Magano-Maik (4).pdf` (orçamento comercial ORC-327, cliente "Maik") — item 8
  da lista, "Sono/Ansiedade - Melatonina+Triptofanos", cápsulas: usa os mesmos seis nomes de insumo
  (fosfatidilserina, ácido aspártico, glutamina, magnésio, zinco, biotina, triptofano, melatonina),
  mas com **doses diferentes** em quase todos eles (triptofano 200 mg em vez de 572,38 mg; biotina 2
  mg em vez de 45 mcg — 44 vezes mais; magnésio 12,6 mg em vez de 63 mg). É claramente uma versão
  anterior ou paralela da mesma família de fórmula, não a mesma composição. Descartada como fonte de
  texto, mas serve de evidência de que essa família de fórmula (melatonina + triptofano + aminoácidos
  + minerais em cápsula) já circulou em mais de uma dosagem — reforça que "usar o texto de qualquer
  documento parecido" seria arriscado aqui.
- `melatonina + triptofano em gummy 60.svg` (um dos nove documentos indicados no pedido) — painel de
  informação nutricional de um produto em **goma** (6 g, 2 gomas, 30 porções), não em cápsula, e não
  traz nenhuma linha de melatonina ou triptofano no próprio painel (só macronutrientes). Confirma
  mais uma vez que existe uma família "melatonina+triptofano" em goma, separada da família em
  cápsula que é o nosso alvo. Não é fonte utilizável para este slug.

**Nome comercial provável**: `~/Downloads/RÓTULOS CÁPSULAS LEMON CAPS.pdf` (7 páginas, layouts de
designer com marca d'água "TABELA PROVISÓRIA") traz, na página 2, a frente de rótulo "**sonus**"
rotulada no rodapé como "melatonina + triptofano", 60 cápsulas, peso líquido 30 g — mesma
apresentação do slug. **A tabela nutricional e a lista de INGREDIENTES dessa página são placeholder
copiado de outro produto** (diidrocapsiato, extrato de laranja moro, extrato de cúrcuma, café verde,
inulina, colina, cromo — nada disso é da fórmula de melatonina/triptofano; a mesma tabela aparece
idêntica nas 7 páginas do arquivo, cada uma com um nome de produto diferente na capa). Não é fonte
de composição nem de dizer de rotulagem — só confirma um nome comercial candidato ("Sonus") e a
apresentação (60 cápsulas, 30 g).

**Histórico de variantes anteriores desta mesma família de fórmula** (contexto, não fonte de
texto): `~/Desktop/FÓRMULAS LEMON CAPS/proposta_SONO___ANSIEDADE_20260214 (1).pdf` (14/02/2026, a
mais antiga) já propunha um "Sono / Ansiedade" com magnésio, glutamina, triptofano (160 mg — uma
quarta dose diferente), inositol, zinco, biotina (2 mg) e melatonina; e o orçamento ao cliente Maik
(`Guilherme-Magano-Maik (4).pdf`, 12/08/2026) trazia o mesmo conceito com triptofano a 200 mg e
biotina a 2 mg. A composição que está hoje em `formula_compositions` (triptofano 572,38 mg, biotina
45 mcg, mais ácido aspártico e fosfatidilserina) é a versão mais recente e mais elaborada — e a que
o `PROMPT-LOVABLE-CATALOGO-6-PRODUTOS.md` de 08/09/2026 confirma como a vigente, ajustada aos
limites da ANVISA. Isso mostra uma fórmula em evolução ativa ao longo do ano, não um valor
abandonado por engano.

**Classificação final: PENDENTE.** A composição (o que entra em `formula_compositions`) está
verificada e correta; o dizer de rotulagem (o texto que vai em `ingredients_list` e `warnings`) não
tem, entre os documentos revisados, nenhuma fonte que descreva estes 9 itens específicos com nome
técnico, INS e advertências completas.
**Pedir à fábrica**: ficha técnica de rotulagem (padrão FT-ROT, como as da pasta
`~/Desktop/POPS/14_ROTULAGEM/`) ou arte-final do rótulo em curvas do produto Melatonina +
Triptofanos (Encapsulados), 60 cápsulas, com a composição de 9 itens já ajustada aos limites da
ANVISA (a mesma do `PROMPT-LOVABLE-CATALOGO-6-PRODUTOS.md` de 08/09/2026) — com a lista de
ingredientes (nome técnico de cada excipiente e agente de cápsula, com INS) e as advertências
obrigatórias.

---

## 6. `omega-pro-tg` — Ômega Pró TG

**O banco hoje**: formato cápsula, 60 softgels por pote, público-alvo "Adultos (19 anos ou mais)",
conservação **vazia**, modo de uso "Ingerir 2 softgels ao dia, ou conforme orientação de
profissional de saúde", informação nutricional "Porções por embalagem: 30 / Porção: 1 g (2
softgels)". Composição registrada em `formula_compositions` (5 itens): óleo de peixe TG 1000 mg;
ômega-3 total 316,5 mg; EPA 185,34 mg; DHA 123,56 mg; outros ácidos graxos ômega-3 7,6 mg.

**A composição também está confirmada como correta e deliberada** pelo mesmo
`PROMPT-LOVABLE-CATALOGO-6-PRODUTOS.md` (08/09/2026) — item 6 da lista, tabela idêntica, valor por
valor, à de `formula_compositions` hoje.

**Dois dos nove documentos indicados no pedido pareciam candidatos óbvios e os dois são de outro
produto — a maior armadilha de nomenclatura desta auditoria**:

- `FT-OSPECTRA-OM3-001_Ficha_Tecnica_Ospectra_Omega3_Lemoncaps.pdf` — ficha técnica oficial Lemon
  Caps completíssima (8 páginas, CNPJ, RT, RDC/IN citadas, especificações microbiológicas,
  alergênicos, processo de fabricação). Mas o produto é **"Ospectra Ômega 3 em GOTAS"** — solução
  oral, frasco conta-gotas de 30 mL, porção de 1 mL (20 gotas), com óleo de peixe purificado (só
  0,262 mL por dose), TCM, vitamina E, inulina, goma guar, conservadores e aromatizante — nenhum
  desses componentes aparece na composição registrada para "Ômega Pró TG", que é cápsula (softgel)
  e não tem TCM, inulina nem goma guar. É outro produto, da linha de gotas (confirmado também pela
  existência da pasta `~/Desktop/POPS/20_LINHA_GOTAS_VSPECTRA_OSPECTRA/`, dedicada só a essa linha).
  Usar este documento para "Ômega Pró TG" declararia ingredientes que a cápsula não tem.
- `NPT-0226141 - Nanomega 3 - Aprovado nº141 (1).pdf` — **não é documento da Lemon Caps**: é um
  Certificado de Análise da empresa terceira "NaturalPRO / Natural Products & Technologies Ltda"
  (Rafard-SP, CNPJ 04.480.530/0001-35), fornecedora de matéria-prima. O produto certificado,
  "Nanomega 3", é um **pó** (insolúvel em água, 15,3% de ômega-3 por peso) — muito diferente de um
  óleo de peixe TG líquido como o declarado para "Ômega Pró TG" (que, a 1000 mg de óleo com 316,5 mg
  de ômega-3, tem concentração de ~31,6%, o dobro do Nanomega 3). Se o Nanomega 3 fosse o insumo do
  Ômega Pró TG, precisaria de mais de 2 g de pó por porção para chegar a 316,5 mg de ômega-3 — não
  bate com os 1000 mg declarados. Descartado.
- `MAN-OSPECTRA-OM3-001_Manual_Ilustrado_Ospectra_Omega3_Lemoncaps.pdf` — manual da mesma linha de
  gotas Ospectra; mesmo descarte do primeiro item, não lido em detalhe por já estar claro o
  descompasso de formato.

Não encontrei, na busca feita, nenhuma ficha técnica, dossiê ou Dizer de Rotulagem com o nome
"Ômega Pró TG" ou com esta composição específica de 5 itens (óleo de peixe TG / EPA / DHA
separados).

**Outro achado, também sem virar fonte de texto**: a mesma página 4 de
`~/Downloads/RÓTULOS CÁPSULAS LEMON CAPS.pdf` citada no item 5 traz a frente de rótulo "Ômega-3",
60 cápsulas soft gel, 30 g — apresentação batendo com o slug — mas com o rodapé (também sob a marca
d'água "TABELA PROVISÓRIA") dizendo "**EPA 1000mg + DHA 400mg**". Esse valor **não bate** com o que
está em `formula_compositions` hoje (EPA 185,34 mg + DHA 123,56 mg por 1000 mg de óleo de peixe TG,
já confirmado correto e deliberado pelo `PROMPT-LOVABLE-CATALOGO-6-PRODUTOS.md`) — para chegar a
1000 mg de EPA sozinho seria preciso um óleo muito mais concentrado do que o triglicerídeo padrão
declarado. Como a tabela de ingredientes dessa mesma página é comprovadamente placeholder (a mesma
lista de diidrocapsiato/laranja moro/cúrcuma da página 2), trato "EPA 1000mg + DHA 400mg" como uma
meta comercial provisória de design, não como composição real — mas registro a divergência para
quem for aprovar a arte final não confundir os dois números.

**Classificação final: PENDENTE.**
**Pedir à fábrica**: ficha técnica de rotulagem ou arte-final do rótulo em curvas do produto
**Ômega Pró TG em softgel** (não confundir com a linha Ospectra/Vspectra em gotas), com a composição
de óleo de peixe TG já ajustada aos limites da ANVISA (mesma do `PROMPT-LOVABLE-CATALOGO-6-PRODUTOS.md`
de 08/09/2026) — com lista de ingredientes (incluindo a cápsula de softgel e a declaração de
alergênico a peixe, que certamente se aplica) e advertências obrigatórias.

---

## Resumo por fórmula

| Fórmula | Classificação | Fonte principal | O que falta |
|---|---|---|---|
| creatina-em-gummy-sabor-tutti-frutti | **PENDENTE** | Ordens de Produção (cliente Astryx) + Ficha Técnica Resumida — inferência | Arte-final ou ficha técnica do sabor tutti-frutti com nome técnico do corante |
| creatina-gummy-sabor-frutas-vermelhas | **PRONTO PARA GRAVAR** | DRT_GUMMY_CREATINA.html (fábrica) + composicoes_rotulo.json + FT-CREATINA-GUMMY.pdf | — |
| creatina-monohidratada-300g-soluvel | **PENDENTE** | Inferência do pote de 150 g — contradita por um SVG com dose diferente | Confirmar dose real do pote de 300 g (5 g×~60 ou 3 g×100) antes de tudo |
| melatonina-em-gummy-sabor-uva | **PENDENTE** | Dois grupos de documentos oficiais se contradizem sobre a presença de L-triptofano | Decisão do dono/RT: leva triptofano ou não |
| melatonina-triptofanos-encapsulados | **PENDENTE** | Composição confirmada (PROMPT-LOVABLE-CATALOGO-6-PRODUTOS.md); dizer de rotulagem, não | Ficha técnica de rotulagem com nome técnico dos excipientes e advertências |
| omega-pro-tg | **PENDENTE** | Composição confirmada (mesmo documento acima); os dois "candidatos" achados são de outro produto (linha de gotas Ospectra) | Ficha técnica de rotulagem do softgel Ômega Pró TG (não confundir com a linha de gotas) |

Das seis, **uma** chega a PRONTO PARA GRAVAR.

---

## O que pedir à fábrica — lista consolidada

1. Arte-final do rótulo (PDF em curvas), versão vigente, do produto **CREATINA EM GUMMY SABOR
   TUTTI-FRUTTI**, marca Lemon Caps Premium (não a versão fabricada para o cliente Astryx) — ou, na
   falta dela, uma ficha técnica de produto no padrão `FT-CREATINA-GUMMY_...` com as seções de
   INGREDIENTES e ADVERTÊNCIAS OBRIGATÓRIAS preenchidas para este sabor.
2. Confirmação objetiva: o pote de **CREATINA MONOIDRATADA 300 g SOLÚVEL** vigente usa dose de 5 g
   (como o pote de 150 g, e como está no banco hoje) ou de 3 g com 100 doses (como o arquivo
   `CREATINA MONOHIDRATADA 300 GRAMAS.svg`)? Depois disso, a arte-final do rótulo em curvas.
3. Decisão do dono/responsável técnico: o produto **Melatonina em Gummy Sabor Uva** leva
   L-triptofano (800 mg por porção, como a ficha "Dream Gummy") ou é só melatonina 0,21 mg (como o
   Relatório de Rótulos e a ficha da Suelen)? Os dois são produtos legítimos e distintos, propostos
   lado a lado desde fevereiro de 2026 — a pergunta é qual dos dois este slug específico do catálogo
   deveria representar. Essa resposta também deveria ir para quem mantém `formula_compositions`, que
   hoje registra a versão com triptofano.
4. Ficha técnica de rotulagem (ou arte-final) do produto **Melatonina + Triptofanos (Encapsulados)**
   (nome comercial candidato: "Sonus") com a composição de 9 itens já vigente (a mesma do
   `PROMPT-LOVABLE-CATALOGO-6-PRODUTOS.md` de 08/09/2026) — precisa do nome técnico e INS de cada
   excipiente e das advertências obrigatórias.
5. Ficha técnica de rotulagem (ou arte-final) do produto **Ômega Pró TG em softgel** — atenção
   explícita para não reaproveitar nenhum documento da linha de gotas Ospectra/Vspectra, que é outro
   produto, outro formato e outra composição.

---

## Achados e contradições (surpresas)

**A mais grave**: a fórmula `melatonina-em-gummy-sabor-uva` tem dois grupos de documentos —
ambos com aparência de documento oficial da fábrica (CNPJ, farmacêutico responsável, formato de
ficha técnica) — que se contradizem sobre a existência de um ingrediente ativo inteiro (L-triptofano,
800 mg por porção). Isso não é erro de redação: é a diferença entre o rótulo declarar ou não um
segundo ativo. Detalhado no item 4, acima.

**A segunda mais grave**: o arquivo `~/Desktop/POPS/14_ROTULAGEM/Lemoncaps_Analise_Rotulagem_Creatina150g.docx`
(um dos documentos revisados na tentativa de achar referência ANVISA) **se declara, no próprio
texto, uma simulação**: "Elaborado por: Análise simulando perspectiva de auditoria sênior de
rotulagem ANVISA" e "Esta análise não substitui a validação final por Responsável Técnico e por
consultoria regulatória especializada". Ele afirma, com grande confiança e citando norma por
número, que "a IN 28/2018 teve seu limite de creatina ampliado de 3 g/dia para 5 g/dia pela IN
373/2025" — uma afirmação de limite legal que **não foi conferida por mim na fonte primária** (não
tentei abrir a IN 373/2025 no AnvisaLegis nesta tarefa, por não ser um dos seis alvos) e que vem de
um documento que se autodeclara simulado. Registro isto porque é exatamente o tipo de erro que já
custou caro neste projeto antes (limite de creatina, fonte desatualizada) — este documento específico
não deveria ser tratado como fonte de limite legal sem conferência direta na norma.

**Terceira**: dois dos nove documentos indicados no pedido (`FT-OSPECTRA-OM3-001...pdf` e
`NPT-0226141 - Nanomega 3...pdf`) parecem, pelo nome e pelo contexto ("ômega"), candidatos óbvios
para `omega-pro-tg` — e os dois são de outro produto (linha de gotas Ospectra e matéria-prima em pó
de outro fornecedor, respectivamente). Detalhado no item 6.

**Quarta**: para a fórmula `creatina-gummy-sabor-frutas-vermelhas`, encontrei **quatro** pesos de
pote e tamanhos de porção diferentes em documentos que concordam entre si em tudo o mais (mesmo
ingrediente, mesma dose de creatina, mesmas advertências): 180 g/6 g (composicoes_rotulo.json e a
ficha técnica oficial), 210 g/7 g (o Dizer de Rotulagem oficial da fábrica e o Relatório de Rótulos),
e 90 g/3 g (a versão de cliente "Suelen"). O próprio banco tem um quinto valor no campo
`nutritional_info` ("1 Porção: 3 g"), que não bate exatamente com nenhum dos quatro documentos.
Nada disso entrou nesta tarefa (só toca `ingredients_list` e `warnings`), mas é uma inconsistência
real que vale a pena alguém revisar separadamente.

**Quinta**: o Certificado de Análise `NPT-0226141` não é documento da Lemon Caps — é de uma empresa
terceira (NaturalPRO), fornecedora de matéria-prima. Isso por si só não é irregular (é normal um
fabricante guardar o laudo do fornecedor do insumo), mas ele não serve como fonte de dizer de
rotulagem do produto acabado, e não corresponde à matéria-prima realmente usada em Ômega Pró TG (ver
item 6).

**Sexta**: existe uma pasta inteira de documentos **derivados do próprio banco**, não fontes
independentes: `~/Desktop/Lemon Caps - Fichas de Enquadramento/Fichas por formula/` tem 28 PDFs, um
por fórmula do catálogo (ex.: `03-creatina-em-gummy-sabor-tutti-frutti.pdf`,
`09-melatonina-triptofanos-encapsulados.pdf`, `10-melatonina-em-gumy-sabor-uva.pdf`,
`14-omega-pro-tg.pdf`, `25-creatina-monohidratada-300g-soluvel.pdf`), gerados em 04/09/2026 a partir
da própria tabela `public.formulas`. Não os usei como fonte de nada nesta auditoria — usá-los seria
circular (confirmariam só o que já está, ou não está, no banco).

**Sétima**: `~/Downloads/RÓTULOS CÁPSULAS LEMON CAPS.pdf` é um arquivo de 7 páginas de layout de
designer, cada página com a marca d'água "TABELA PROVISÓRIA" e "IMAGENS MERAMENTE ILUSTRATIVAS", e
as 7 páginas trazem **a mesma tabela nutricional e a mesma lista de ingredientes** (de um produto de
foco/energia com diidrocapsiato, laranja moro e cúrcuma), mudando só o nome na capa e uma frase de
rodapé com o nome real pretendido do produto daquela página (entre eles, "melatonina + triptofano"
na página 2 e "EPA 1000mg + DHA 400mg" na página 4). É evidência de que a arte de rótulo de mais de
um produto do catálogo ainda está em memória-de-conteúdo, não fechada — útil para nome comercial e
apresentação, inútil e potencialmente perigoso como fonte de ingredientes se alguém copiar a tabela
sem notar a marca d'água.

---

## Advertências obrigatórias por norma — o que consegui confirmar ao vivo

Duas tentativas de acesso ao AnvisaLegis com URL adivinhada falharam de fato (não é alegação sem
teste): uma busca do Google devolveu uma página de erro sem link nenhum; uma tentativa direta a
`https://www.gov.br/anvisa/pt-br/assuntos/regulamentacao/legislacao/resolucoes/2018/rdc-243`
devolveu HTTP 404.

Uma terceira tentativa, usando a URL exata já verificada e registrada em
`lib/catalog/regulatory-info.ts` deste mesmo projeto (aberta e conferida por outra sessão de
trabalho em 13/09/2026), **funcionou**. Consegui, ao vivo, nesta tarefa:

- Confirmar que a RDC 243/2018 é mesmo a norma-mãe dos suplementos alimentares, e que as três frases
  centrais de advertência — "Este produto não é um medicamento.", "Não exceder a recomendação
  diária de consumo indicada na embalagem." e "Mantenha fora do alcance de crianças." — são texto
  **literal** do Art. 14, inciso I, alíneas "c", "d" e "e" da própria norma (transcrito pelo modelo
  que processou a página, a partir do texto oficial). O mesmo artigo exige, em outras alíneas,
  indicação de público/faixa etária (inciso I, "a") e instruções de conservação (inciso II) — o que
  bate com o restante do texto-padrão já usado nas outras 18 fórmulas do catálogo e no que propus
  para a fórmula 2, acima.
- Confirmar que a melatonina consta da lista de constituintes autorizados da IN 28/2018 (incluída
  pela IN 102/2021, CAS 73-31-4) e que **não há**, no texto que consegui abrir, nenhuma frase de
  advertência complementar obrigatória exclusiva para melatonina além das gerais da RDC 243/2018.
  **Não consegui**, nesta mesma consulta, ver o Anexo IV (limites máximos) para confirmar o número
  exato de 0,21 mg/dia — o valor de 0,21 mg aparece de forma consistente em toda fonte interna da
  Lemon Caps revisada nesta tarefa (composicoes_rotulo.json, as fichas técnicas, o Dizer de
  Rotulagem), inclusive uma delas citando explicitamente ter consultado "o painel de Constituintes
  Autorizados da ANVISA... em 27/08/2026" — mas o número em si fica **PROVISÓRIO, sem reconferência
  minha direta no Anexo IV**, distinto do que consegui de fato ler no Art. 14.

Isso quer dizer que o texto-padrão de advertências já usado pelas outras 18 fórmulas do catálogo, e
o que proponho para a fórmula 2 acima, tem lastro direto e conferido na norma para o núcleo
(as três frases centrais), e lastro só documental interno (não legal direto, mas consistente e
datado) para os complementos específicos de cada categoria de produto (efeito laxativo dos polióis,
cautelas de melatonina).

---

## Caminhos criados nesta tarefa

- `docs/conformidade/INGREDIENTES-E-ADVERTENCIAS-FALTANTES-2026-09-15.md` (este arquivo).
- `supabase/migrations/20260920100000_ingredientes_e_advertencias_do_rotulo.sql` — em disco, não
  aplicada, só com a fórmula 2 (a única PRONTA).
