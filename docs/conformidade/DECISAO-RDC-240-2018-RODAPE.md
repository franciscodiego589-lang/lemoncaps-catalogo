# Decisão pendente: a frase da RDC nº 240/2018 no rodapé de fabricante

**Para:** o dono do projeto e o farmacêutico responsável técnico (RT) da Lemon Caps.
**Preparado em:** 15/09/2026.
**Natureza deste documento:** só decisão preparada. Nenhum código, nenhuma linha de
banco de dados e nenhum arquivo do site foram alterados para produzi-lo — é leitura e
conferência apenas. A escolha entre as opções abaixo, e a palavra final sobre o texto
do rótulo, são do dono com o RT, nunca de quem escreveu este documento.

---

## 1. O fato

A frase **"Produto dispensado de registro conforme RDC nº 240/2018."** é o valor do
campo `registrationExemption` da constante `MANUFACTURER_INFO`, definida em:

- **`lib/catalog/regulatory-info.ts:109`** (valor da frase; o campo está declarado na
  interface em `lib/catalog/regulatory-info.ts:85`; o comentário que explica a
  procedência e a natureza da frase — transcrição literal do rótulo, não afirmação da
  empresa — está nas linhas `101-108` do mesmo arquivo).

Essa constante é única (não há uma cópia por produto, nem uma cópia por tela). Ela é
consumida em exatamente dois pontos do código, e só dois — conferido por busca de todas
as ocorrências de `MANUFACTURER_INFO` e de `registrationExemption` em `app/`,
`components/` e `lib/`:

| Onde | Arquivo:linha | Superfície |
|---|---|---|
| Página web do dossiê | `app/catalogo/[slug]/page.tsx:370` | seção "Fabricante e responsabilidade técnica" (título na linha 362, bloco todo nas linhas 358-374), presente em toda página `/catalogo/[slug]` |
| Texto compartilhado de PDF | `lib/pdf/formula-sections.ts:326`, dentro da função `addManufacturerSection` (linhas 321-329) | usado pelos dois PDFs abaixo |
| → chamada no dossiê técnico em PDF | `lib/catalog/dossie-pdf.ts:112` | um PDF por produto, sob demanda |
| → chamada no orçamento em PDF | `lib/cart/quote-pdf.ts:227` | um PDF por orçamento inteiro — a "Parte 3" do documento, **uma vez só**, não uma vez por item cotado (comentário explícito nas linhas 223-225 do próprio arquivo) |

Ou seja: **3 pontos de renderização, cobrindo 2 telas/documentos** — 1 tela web (o
dossiê de cada produto) e 2 tipos de PDF (dossiê técnico e orçamento) — todos
alimentados pela mesma constante. Não há uma quarta cópia escondida em algum outro
componente: `components/manufacturing/RegulatoryRigor.tsx`, `components/home/
CompanyClosing.tsx`, `components/manufacturing/ManufacturingContact.tsx` e a própria
página `app/documentacao/page.tsx` também importam `MANUFACTURER_INFO`, mas nenhum deles
lê o campo `registrationExemption` — só razão social, CNPJ, endereço, farmacêutico ou
SAC. `RegulatoryRigor.tsx` chega a comentar a frase (linha 39), mas é comentário de
código explicando uma mudança passada, não uma segunda renderização.

**A frase não está no banco de dados.** Conferido em 15/09/2026 por leitura direta via
a chave pública fornecida (`GET /rest/v1/formulas?select=slug,name,warnings,
storage_instructions,metadata,nutritional_info`, projeto `zjryrmqtumvaxdytvbbv`): as 24
linhas retornadas hoje não contêm as sequências "240", "dispensado" nem "240/2018" em
nenhum dos cinco campos de texto pedidos. Isso é consistente com o próprio comentário de
topo de `lib/catalog/regulatory-info.ts` (linhas 1-6): o arquivo é "conteúdo fixo (mesmo
texto em todo produto), por isso não mora no banco".

**Quantos produtos são atingidos.** A frase não depende de qual produto é — toda fórmula
com dossiê ativo carrega a mesma constante. A pergunta "quantos produtos hoje" tem duas
respostas que não batem, e registro as duas por exatidão, sem escolher uma para deixar a
outra de fora:

- **Conferido agora, 15/09/2026**, por `curl` direto na tabela `formulas` com a chave
  pública: **24** linhas, com `Content-Range: 0-23/24`, tanto filtrando `active=eq.true`
  quanto sem filtro nenhum — o mesmo número nos dois casos, porque a política de RLS
  `formulas_select` (`supabase/migrations/20260909210001_rls_policies.sql:110-114`) já
  restringe o papel `anon` a `active and deleted_at is null` antes de qualquer filtro
  extra da consulta.
- **Registrado em `docs/ESTADO-14-09-2026.md:281` e `docs/CONTEXTO-COMPLETO-PARA-
  RETOMAR.md:403-404`**, datados de 13-14/09/2026: 27 fórmulas ativas (28 no total, com
  1 excluída logicamente).

A diferença é de 3 fórmulas entre ontem e hoje. Não apurei a causa — foge do escopo
desta tarefa, que é a frase da RDC 240/2018, não uma nova auditoria de conformidade.
Fica **PENDENTE**: confirmar se 3 fórmulas foram desativadas ou excluídas entre 14 e
15/09, ou se a contagem de ontem já estava incorreta. Isso não muda nenhuma das opções
da seção 5 — a frase está em todo produto do catálogo público, seja esse total 24, 27
ou outro no dia em que este documento for lido.

---

## 2. O que a página `/documentacao` já apresenta

Lida por inteiro (`app/documentacao/page.tsx`, 350 linhas). A página **não contém** a
frase da RDC 240/2018 em nenhum lugar — as duas menções a "240/2018" ali (linhas 56 e
238) são comentários de código explicando por que ela foi deixada de fora, não texto
visível ao leitor.

O que a página mostra, na ordem:

1. Uma declaração institucional (`REGULATORY_DECLARATION`): a fábrica respeita limites
   mínimo/máximo da Anvisa, cumpre a legislação vigente, e tem responsável técnico
   farmacêutico nomeado — com um parágrafo de fronteira deixando claro que isso não é o
   selo de conformidade por produto.
2. Uma explicação de hierarquia normativa (RDC estabelece, IN detalha).
3. Seis Resoluções como lastro: RDC 243/2018 (norma-mãe dos suplementos), RDC 843/2024
   (como o produto entra no mercado), RDC 727/2022 (rotulagem), RDC 429/2020 (rotulagem
   nutricional), RDC 778/2023 (aditivos) e RDC 725/2022 (aromatizantes).
4. Quatro Instruções Normativas: IN 28/2018, IN 281/2024, IN 75/2020, IN 211/2023 — mais
   um histórico recolhido de 13 alterações da IN 28/2018.
5. Um card específico, **`REGISTRATION_REGIME`** (`lib/catalog/regulatory-info.ts:257-
   261`), com o texto: *"Suplemento alimentar é dispensado de registro sanitário
   prévio, mas está sujeito a notificação junto à Anvisa antes de ser ofertado. É o que
   determinam a RDC nº 843/2024 e a IN nº 281/2024."* — este é o regime que a seção 4
   abaixo confirma como correto, na fonte, hoje.
6. As licenças da fábrica (alvará sanitário, alvará de localização, CNPJ) e os dados do
   fabricante/RT.
7. Uma seção de procedência, dizendo onde cada norma foi conferida (AnvisaLegis, em
   13/09/2026) e um aviso de que a legislação muda e que a fonte oficial deve ser
   conferida antes de qualquer decisão baseada na página.

Ou seja: o projeto já resolveu, só na `/documentacao`, exatamente o problema que esta
tarefa trata — só que não tocou no rodapé do dossiê nem do PDF, por decisão consciente
registrada em comentário (não duplicar a frase do rótulo com uma afirmação
institucional divergente sem decisão do dono).

---

## 3. Metodologia desta verificação

Toda norma abaixo foi consultada de novo, hoje (15/09/2026), por mim, diretamente na
fonte oficial — não copiada do que já estava escrito no código ou nos documentos
internos do projeto (que, por sua vez, também citam ter ido à fonte em 13-14/09/2026;
tratei essas afirmações anteriores como hipótese a confirmar, não como fato).
A fonte oficial é o **AnvisaLegis** (`anvisalegis.datalegis.net`), o portal de
legislação consolidada da própria Anvisa — o mesmo que
`https://www.gov.br/anvisa/pt-br/assuntos/regulamentacao/legislacao` redireciona, e o
mesmo portal que o próprio código do projeto já usa como fonte única. A leitura foi
feita por busca automatizada de conteúdo (WebFetch), com instrução explícita de citar
o texto literal dos artigos — os trechos entre aspas abaixo são citações diretas
devolvidas dessa leitura, não paráfrase minha.

**Tentativas de outras fontes, como pedido, com o resultado exato de cada uma:**

- `https://antigo.anvisa.gov.br/legislacao` — tentei; **HTTP 403 Forbidden**. O acesso
  automatizado é bloqueado.
- `https://www.in.gov.br/web/dou/-/resolucao-rdc-n-843-de-22-de-fevereiro-de-2024` —
  tentei; erro de conexão (**"socket hang up"**, sem devolver nenhum código HTTP).
  Tentei de novo só com a página inicial do domínio (`https://www.in.gov.br/`), para
  saber se era bloqueio geral do domínio ou só daquela URL: mesmo erro. O próprio
  projeto já havia registrado o mesmo tipo de bloqueio para o D.O.U. em
  `docs/CONTEXTO-COMPLETO-PARA-RETOMAR.md:150-152` (lá, HTTP 403 num outro ato); hoje o
  resultado foi falha de conexão, não um 403 explícito, mas o efeito prático é o mesmo:
  **não consegui ler o texto no D.O.U. diretamente**, nem hoje nem, pelo relato do
  projeto, em tentativa anterior.
- Como reforço (não substituindo a fonte oficial, só cruzando a data do ato), busquei
  na web por "RDC 843/2024" fora do Anvisalegis: LegisWeb, RC Ambiental, Sindipi e o
  site da Vigilância Sanitária de Santa Catarina reproduzem o mesmo texto com a mesma
  data de ato, 22/02/2024 — nenhuma fonte alternativa contradisse o que o AnvisaLegis
  mostrou.

---

## 4. O estado da norma na fonte oficial, conferido em 15/09/2026

### 4.1 RDC nº 240/2018 — revogada

Consultado em: `https://anvisalegis.datalegis.net/action/ActionDatalegis.php?acao=abrirTextoAto&tipo=RDC&numeroAto=00000240&seqAto=000&valorAno=2018&orgao=RDC%2FDC%2FANVISA%2FMS&codTipo=&desItem=&desItemFim=&cod_menu=9434&cod_modulo=310&pesquisa=true`
(15/09/2026).

- **Selo de vigência exibido na página: "REVOGADO".**
- Ementa do próprio ato: "Altera a Resolução – RDC nº 27, de 6 de agosto de 2010, que
  dispõe sobre as categorias de alimentos e embalagens isentos e com obrigatoriedade de
  registro sanitário." — ou seja, mesmo antes de revogada, a RDC 240/2018 nunca foi, ela
  mesma, "a" norma de dispensa de registro: era um ato que alterava a RDC 27/2010, que
  era a norma de dispensa à época. As duas foram revogadas juntas.
- Revogada pela **RDC nº 843/2024**.

### 4.2 A norma revogadora e a data que realmente conta

Consultado em: `https://anvisalegis.datalegis.net/action/ActionDatalegis.php?acao=abrirTextoAto&tipo=RDC&numeroAto=00000843&seqAto=000&valorAno=2024&orgao=RDC%2FDC%2FANVISA%2FMS&codTipo=&desItem=&desItemFim=&cod_menu=9434&cod_modulo=310&pesquisa=true`
(15/09/2026).

- **Art. 40** revoga expressamente, entre outras normas, a **RDC nº 27/2010** e a
  **RDC nº 240/2018**.
- **Art. 41**: *"Esta Resolução entra em vigor no dia 1º de setembro de 2024."*
- **Data do ato: 22/02/2024. Data em que a revogação passou a valer: 01/09/2024**
  (vigência diferida — a resolução foi publicada em fevereiro, mas só entrou em vigor,
  e com ela as revogações do art. 40, em setembro). As duas datas são reais; são
  perguntas diferentes ("quando o ato foi assinado" vs. "quando ele passou a valer").
- Selo de vigência exibido hoje: **"Vigente com Alterações"** (alterada, depois de
  2024, pela RDC nº 983/2025 e pela RDC nº 990/2025 — achado novo, não citado em
  nenhum arquivo do projeto; ver observação na seção 6).

**Nota de exatidão sobre o próprio código do projeto:** o comentário em
`lib/catalog/regulatory-info.ts:58` e `:104-105` escreve que a RDC 240/2018 "está
REVOGADA desde 22/02/2024" — essa é a data do ato revogador, não a data em que a
revogação passou a produzir efeito (01/09/2024, por força do art. 41). Os dois
documentos internos `docs/ESTADO-14-09-2026.md:282` e `docs/CONTEXTO-COMPLETO-PARA-
RETOMAR.md:350` já usam a data certa, 01/09/2024, assim como o enunciado desta tarefa.
Não é uma divergência que o público vê (é comentário de código, não texto de tela), mas
vale corrigir da próxima vez que alguém mexer naquele arquivo, pela mesma régua de
exatidão que o arquivo inteiro se propõe a seguir.

### 4.3 Regime vigente hoje para suplemento alimentar

Consultado em: `https://anvisalegis.datalegis.net/action/ActionDatalegis.php?acao=abrirTextoAto&tipo=INM&numeroAto=00000281&seqAto=000&valorAno=2024&orgao=DC%2FANVISA%2FMS&codTipo=&desItem=&desItemFim=&cod_menu=9434&cod_modulo=310&pesquisa=true`
(15/09/2026) — **IN nº 281/2024**, selo "Vigente com Alterações" (alterada pela IN nº
368/2025), em vigor desde 01/09/2024 (mesma data da RDC 843/2024, que ela detalha).

- **Anexo II, item 8: "Suplementos alimentares"** — categoria sujeita a
  **NOTIFICAÇÃO** junto à Anvisa.
- **Anexo I** (categorias com obrigatoriedade de **registro**): suplemento alimentar
  **não consta** — só há 9 categorias, nenhuma delas suplemento (são fórmulas
  dietoterápicas, infantis e nutrição enteral).
- **Anexo IV** (categorias **dispensadas de qualquer regularização**): suplemento
  alimentar também **não consta**.

Isto **confirma, na fonte, hoje**, que o texto que a própria `/documentacao` já
publica (`REGISTRATION_REGIME`, seção 2 acima) está correto: suplemento alimentar é
dispensado de registro prévio, mas está sujeito a notificação — não está "dispensado de
tudo".

### 4.4 RDC nº 243/2018 e RDC nº 727/2022 — citar norma no rótulo

Esta é a pergunta mais específica do pedido, e a resposta direta é: **nenhuma das duas
normas trata expressamente do assunto** "citar número de norma/resolução no rótulo".

**RDC nº 243/2018** (suplementos alimentares) — consultada em
`https://anvisalegis.datalegis.net/action/ActionDatalegis.php?acao=abrirTextoAto&tipo=RDC&numeroAto=00000243&seqAto=000&valorAno=2018&orgao=RDC%2FDC%2FANVISA%2FMS&codTipo=&desItem=&desItemFim=&cod_menu=9434&cod_modulo=310&pesquisa=true`
(15/09/2026): selo **"Vigente com Alterações"**. Tem o parágrafo único do art. 11
revogado pela RDC 843/2024 (já refletido no comentário do projeto). Não há, no texto,
nenhum artigo que exija ou proíba citar número de registro, dispensa de registro ou
notificação no rótulo — o art. 12 trata só do nome "Suplemento Alimentar" e da forma de
apresentação.

**RDC nº 727/2022** (rotulagem geral) — consultada em
`https://anvisalegis.datalegis.net/action/ActionDatalegis.php?acao=abrirTextoAto&tipo=RDC&numeroAto=00000727&seqAto=002&valorAno=2022&orgao=RDC%2FDC%2FANVISA%2FMS&codTipo=&desItem=&desItemFim=&cod_menu=9434&cod_modulo=310&pesquisa=true`
(15/09/2026): selo **"Vigente"**. Também não tem dispositivo específico sobre citar (ou
sobre proibir citar) norma no rótulo, nem trata expressamente da hipótese "rótulo cita
norma já revogada". O único gancho é genérico — **art. 4º, inciso I**, que proíbe a
rotulagem de: *"conter vocábulos, sinais, denominações, símbolos, emblemas, ilustrações
ou outras representações gráficas que possam tornar a informação falsa, incorreta,
insuficiente, ou que possa induzir o consumidor a equívoco"*.

Registro isto como **leitura possível, não como conclusão fechada**: dá para argumentar
que citar uma norma morta, sem qualificação, tem o risco de "induzir a equívoco" sobre
qual é a regra vigente — mas a RDC 727/2022 não nomeia esse cenário, e não há vedação
específica e inequívoca. Se o dono quiser blindagem regulatória total sobre este ponto
exato, a palavra final é de um parecer jurídico ou do próprio RT, não desta leitura.

---

## 5. Observações adicionais, fora do escopo estrito, registradas por exatidão

Duas coisas apareceram na consulta de hoje que não faziam parte das quatro perguntas
pedidas, e que registro para não esconder o que vi, sem transformá-las em pauta desta
decisão:

- A RDC 243/2018 também teve os **incisos I a III do art. 15 revogados pela RDC
  429/2020** — o art. 15 é o dispositivo que `lib/catalog/regulatory-info.ts:48-51`
  cita como base da remissão que traz a RDC 429/2020 e a IN 75/2020 para a lista de
  normas da `/documentacao`. Não avaliei se a revogação parcial desses incisos muda a
  validade dessa remissão (o caput do artigo pode ter sido preservado) — fica como
  alerta para quem revisar aquele arquivo depois, não como parte desta decisão.
- A RDC 843/2024 (alterada por RDC 983/2025 e RDC 990/2025) e a IN 281/2024 (alterada
  por IN 368/2025) têm alterações posteriores que não estão no histórico rastreado por
  `REGULATORY_AMENDMENTS` em `lib/catalog/regulatory-info.ts` — essa lista hoje só
  rastreia alterações da IN 28/2018 e da IN 211/2023. Não é um erro (a lista nunca
  prometeu cobrir essas duas normas), só uma lacuna a considerar se o padrão de
  rastrear "toda alteração" for para valer também aqui.

---

## 6. As opções

As três pedidas, cada uma com o texto exato proposto e a lista de arquivos que
mudariam — nenhum foi alterado.

### Opção A — manter a transcrição literal, com marcação visível de que é dado de rótulo

**Texto proposto** (substitui o valor atual de `registrationExemption`, único lugar a
mudar):

> Dizeres de rotulagem impressos na embalagem física: "Produto dispensado de registro
> conforme RDC nº 240/2018."

**Consequência:** nenhuma divergência com o rótulo físico — continua sendo a mesma
frase, só que agora identificada como citação do que está impresso na caixa, não como
afirmação da empresa sobre a lei vigente. Reduz o risco de leitura como declaração
institucional (o ponto que a RDC 727/2022 art. 4º, I, poderia questionar — seção 4.4).
Não elimina a citação da norma morta: quem ler com atenção ainda vê "RDC nº 240/2018"
no meio da frase, só que agora com contexto.

**Arquivos que mudariam:**

- `lib/catalog/regulatory-info.ts:109` — novo valor da constante. Por ser fonte única,
  a mudança propaga sozinha para os outros dois pontos de renderização, sem editá-los:
  `app/catalogo/[slug]/page.tsx:370` e `lib/pdf/formula-sections.ts:326`.
- `lib/catalog/regulatory-info.ts:101-108` — o comentário que explica a frase, para
  não ficar descrevendo um texto que já mudou.

### Opção B — trocar no site pela norma vigente

**Texto proposto** — reaproveita, palavra por palavra, o texto que `REGISTRATION_REGIME`
já usa hoje na `/documentacao` e no card da home (`RegulatoryRigor.tsx`), confirmado
correto na fonte oficial nesta mesma tarefa (seção 4.3), em vez de redigir frase nova:

> Suplemento alimentar é dispensado de registro sanitário prévio, mas está sujeito a
> notificação junto à Anvisa antes de ser ofertado. É o que determinam a RDC nº
> 843/2024 e a IN nº 281/2024.

**Consequência:** o rodapé do dossiê e do orçamento passam a informar o regime
realmente em vigor — e ficam consistentes com o que a `/documentacao` já diz.
**Mas isso cria uma divergência nova**: o dossiê e o PDF (os documentos mais formais,
que o comprador profissional guarda e compara) passam a dizer uma coisa, e a embalagem
física que ele recebe continua impressa com a frase da RDC 240/2018, até a próxima
tiragem de rótulo. É exatamente o risco que o comentário do próprio código já
antecipava ("mudar apenas no site criaria divergência com o rótulo físico, o que seria
pior") — e é uma decisão sobre quanto esse risco pesa, não um erro técnico.

**Arquivos que mudariam:**

- `lib/catalog/regulatory-info.ts:109` — novo valor. Mesma propagação automática da
  opção A, para `app/catalogo/[slug]/page.tsx:370` e `lib/pdf/formula-sections.ts:326`.
- `lib/catalog/regulatory-info.ts:57-62` e `:101-108` — comentários, para não
  contradizerem o novo valor.
- Nada muda fisicamente: o rótulo impresso e o estoque de embalagem já produzidos
  permanecem como estão — é justamente aí que mora a divergência descrita acima.

### Opção C — remover a frase do site, manter só na `/documentacao`

**Texto proposto:** nenhum — a linha simplesmente sai, sem substituição no mesmo lugar.

**Consequência:** o dossiê web e os dois PDFs deixam de citar qualquer norma sobre
registro/dispensa no rodapé de fabricante — nem a revogada, nem a vigente. Quem quiser
saber o regime de regularização precisa visitar `/documentacao` (que já está correta,
seção 2). É a opção que menos risco de leitura equivocada carrega, mas troca "citar
norma morta" por "não dizer nada sobre o assunto" exatamente no documento mais formal
que o comprador leva para negociar — o que pode ler como omissão, não como correção,
para quem não sabe que `/documentacao` existe.

**Arquivos que mudariam:**

- `app/catalogo/[slug]/page.tsx:370` — remover a linha (e ajustar a quebra `<br />`
  vizinha, linha 369 ou 371, para não sobrar espaço em branco).
- `lib/pdf/formula-sections.ts:326` — remover o trecho
  `\n${MANUFACTURER_INFO.registrationExemption}` de dentro do template da função
  `addManufacturerSection`.
- `lib/catalog/regulatory-info.ts:85` e `:109` — o campo `registrationExemption`
  ficaria sem nenhum consumidor; pode ser removido da interface `ManufacturerInfo` e da
  constante, ou apenas deixado sem uso (decisão de limpeza, não obrigatória).
- Nenhuma mudança em `lib/catalog/dossie-pdf.ts` nem em `lib/cart/quote-pdf.ts`: os
  dois só chamam `addManufacturerSection`, que já muda por dentro.

---

## 7. Recomendação técnica

Entre as três, **recomendo a Opção A agora, como correção imediata**, e a Opção B como
alvo para quando o rótulo físico for reimpresso — não como escolha definitiva isolada.

Razão: a Opção B corrige o texto no site, mas cria uma divergência nova entre o
documento formal (dossiê/orçamento) e a caixa física que o cliente recebe no mesmo
pedido — o próprio risco que o código já registrava como pior do que o problema atual.
A Opção C apaga a citação sem substituí-la, deixando um vazio de informação
regulatória justamente no documento que o comprador profissional mais lê. A Opção A é a
única das três que corrige a leitura errada (a frase deixa de parecer afirmação da
empresa sobre lei vigente) sem inventar nenhuma divergência nova com o produto físico
que já está no estoque e sendo entregue — e é reversível a custo baixíssimo se o dono
decidir, depois, trocar por B.

O caminho que elimina o problema por completo — em vez de só mitigá-lo — é corrigir a
frase **no rótulo físico** (a próxima arte de embalagem citar a RDC 843/2024 e a IN
281/2024, ou nenhuma norma específica) e só então aplicar a Opção B no site, os dois em
sincronia. Isso depende de uma decisão de rotulagem e de arte gráfica que só o RT pode
autorizar, e está fora do que este documento resolve.

**Esta recomendação é técnica, não a decisão.** A palavra final sobre o texto do
rótulo — impresso ou digital — é do dono com o farmacêutico responsável técnico,
Anderson C. Barbosa (CRF/MT 5526), exatamente como o próprio código do projeto já
registra em `lib/catalog/regulatory-info.ts:105-106`.

---

## 8. Pendências desta verificação (nada aqui bloqueia a decisão da seção 6)

- **PENDENTE**: por que a contagem de fórmulas ativas hoje (24) diverge da contagem
  registrada ontem nos documentos internos do projeto (27). Não investigado — fora do
  escopo desta tarefa.
- **PENDENTE**: se a revogação parcial do art. 15 da RDC 243/2018 (incisos I a III,
  pela RDC 429/2020) afeta a remissão que a `/documentacao` faz àquele artigo para
  justificar a presença da RDC 429/2020 e da IN 75/2020 na lista de normas.
- **PENDENTE**: leitura do texto oficial da RDC 843/2024 diretamente no Diário Oficial
  da União (`in.gov.br`) — tentado duas vezes hoje, sem sucesso (erro de conexão nas
  duas). A confirmação usada neste documento vem do AnvisaLegis (a fonte que o próprio
  projeto adota) mais checagem cruzada em três fontes secundárias independentes que
  reproduzem o mesmo texto e a mesma data.
- Se o dono e o RT quiserem grau de certeza jurídica formal sobre a leitura do art. 4º,
  I, da RDC 727/2022 (seção 4.4), a recomendação é um parecer jurídico específico — o
  que está escrito aqui é leitura técnica de texto normativo, não parecer jurídico.
