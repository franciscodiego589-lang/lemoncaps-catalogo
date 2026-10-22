# Manual de Uso e Guia de Funcionamento — Catálogo Lemon Caps

> Documento escrito em 14/09/2026, navegando o sistema em funcionamento e conferindo
> o banco de dados diretamente. Sempre que este manual cita um número (quantas
> fórmulas, quantos insumos, etc.), esse número é uma **fotografia do dia em que foi
> escrito** — o sistema muda conforme a equipe usa. Para o número de agora, veja a
> tela indicada (o painel "Pendências do cadastro", dentro de Visão geral, é o lugar
> certo para isso). Nada neste manual descreve um botão ou uma tela que não existe de
> verdade: tudo foi conferido navegando o sistema ou lendo o código por trás dele.

---

## Índice

1. [O que é o sistema](#1-o-que-é-o-sistema)
2. [A área pública, tela por tela](#2-a-área-pública-tela-por-tela)
   - 2.1 [Página inicial](#21-página-inicial)
   - 2.2 [Catálogo de fórmulas](#22-catálogo-de-fórmulas)
   - 2.3 [Dossiê técnico do produto](#23-dossiê-técnico-do-produto)
   - 2.4 [Página de benefícios](#24-página-de-benefícios)
   - 2.5 [Carrinho e a cotação](#25-carrinho-e-a-cotação)
   - 2.6 [Documentação regulatória](#26-documentação-regulatória)
3. [A área administrativa, tela por tela](#3-a-área-administrativa-tela-por-tela)
   - 3.1 [Como entrar](#31-como-entrar)
   - 3.2 [O menu e a Visão geral](#32-o-menu-e-a-visão-geral)
   - 3.3 [Catálogo (cadastro de fórmulas)](#33-catálogo-cadastro-de-fórmulas)
   - 3.4 [Insumos](#34-insumos)
   - 3.5 [Custos](#35-custos)
   - 3.6 [Leads](#36-leads)
   - 3.7 [Orçamentos](#37-orçamentos)
   - 3.8 [Produto em destaque](#38-produto-em-destaque)
4. [Conceitos que a equipe precisa entender](#4-conceitos-que-a-equipe-precisa-entender)
5. [Perguntas frequentes e problemas comuns](#5-perguntas-frequentes-e-problemas-comuns)
6. [O que ainda não funciona / está pendente](#6-o-que-ainda-não-funciona--está-pendente)

---

## 1. O que é o sistema

O catálogo Lemon Caps é o site onde a fábrica mostra suas fórmulas de suplemento —
com composição, modo de uso e preço — para quem quer comprar fabricação com a própria
marca (o chamado "marca própria" ou "private label"). O visitante não compra um pote
avulso: ele monta um pedido de vários potes (sempre em lote, com mínimo de 100 potes
por fórmula) e recebe um **orçamento**.

O sistema tem duas partes:

- **A parte pública** — qualquer visitante acessa sem login. É onde ele conhece a
  fábrica, navega o catálogo, lê o dossiê técnico de cada fórmula, monta uma cotação
  no carrinho e sai com um orçamento (em texto para copiar, em PDF ou, quando o
  WhatsApp da fábrica estiver configurado, direto numa conversa).
- **A parte administrativa** (`/admin`) — só quem tem login. É onde a equipe cadastra
  fórmulas, insumos e custos, e acompanha quem entrou em contato (leads) e os
  orçamentos gerados.

### O que o cliente consegue fazer sozinho

- Ver todas as fórmulas, com composição completa, modo de uso, benefícios e preço.
- Montar uma cotação com uma ou várias fórmulas, ajustando a quantidade de potes.
- Informar nome e WhatsApp e gerar um orçamento com número próprio.
- Copiar o texto do orçamento, baixar o PDF completo, e (quando configurado) abrir
  uma conversa de WhatsApp já com um resumo do que cotou.
- Ler a documentação regulatória: quais normas a fábrica segue e como o produto é
  regularizado.

### O que depende da equipe

- **Nada é aprovado nem confirmado automaticamente.** Quando o cliente gera um
  orçamento, ele fica registrado com status "Aberto" — é a equipe que precisa entrar
  no sistema, ver o orçamento (ou o lead) e entrar em contato pelo WhatsApp para
  seguir a negociação. **Hoje o sistema não avisa ninguém automaticamente** quando
  chega um lead ou orçamento novo (nem e-mail, nem notificação) — é preciso ter o
  hábito de checar a tela de Visão geral ou as telas de Leads/Orçamentos.
- Cadastrar e manter as fórmulas, os insumos, os preços e os custos reais de produção
  (sem custo lançado, o sistema não calcula margem nem lucro em lugar nenhum).
- Decidir quais produtos entram em destaque na vitrine e quais fórmulas recebem o
  selo de composição conferida (ver [seção 4](#4-conceitos-que-a-equipe-precisa-entender)).
- Mudar o status de um orçamento (Aberto, Aprovado, Recusado, Expirado) conforme a
  negociação avança — isso também é manual, ninguém muda sozinho.

---

## 2. A área pública, tela por tela

> Nesta seção, os endereços entre barras (como `/catalogo`) são a parte final do
> link do site — o que vem depois do nome do site na barra de endereço do navegador.
> O site ainda não foi publicado num endereço definitivo (ver [seção 6](#6-o-que-ainda-não-funciona--está-pendente));
> quando for, o Diego vai divulgar o endereço completo, mas os caminhos abaixo de cada
> tela continuam os mesmos.

### 2.1 Página inicial

**Endereço:** `/` (a própria raiz do site).

**Para que serve:** é a porta de entrada institucional — apresenta a Lemon Caps como
fábrica de suplementos em marca própria (a fábrica produz para outras marcas, não só
a própria). Não é o catálogo em si; é a página que explica o que a fábrica faz e leva
o visitante para o catálogo ou para o contato.

**O que a pessoa vê, de cima para baixo:**

1. **Abertura:** o título principal explica a proposta ("A Lemon Caps fabrica a sua
   linha de suplementos em marca própria"), com o caminho para o catálogo sempre à
   vista (a barra fixa no topo da tela também leva para lá, então esse link está
   disponível em toda a página, não só no início).
2. **"Por onde começar"** — os dois caminhos que a fábrica oferece:
   - **Adotar uma fórmula do catálogo**: fórmulas já desenvolvidas e em produção,
     prontas para saírem com o rótulo do cliente. A página já mostra a faixa de preço
     praticada hoje (do mais barato ao mais caro por pote) e leva direto para o
     catálogo.
   - **Desenvolver a sua fórmula**: quando o cliente quer um produto que não existe
     ainda no catálogo, desenhado a partir do banco de matérias-primas com que a
     fábrica trabalha (a página mostra a divisão: quantos aminoácidos, vitaminas,
     minerais, extratos vegetais e outras matérias-primas a fábrica tem disponíveis).
     Esse caminho leva para o WhatsApp — que hoje ainda está sem número configurado
     (ver [seção 6](#6-o-que-ainda-não-funciona--está-pendente)).
3. **"Formatos que produzimos"** — mostra, para cada formato de produto (Cápsula, Pó
   solúvel, Goma, Líquido), quantas fórmulas do catálogo saem naquele formato e quais
   apresentações já existem em linha (por exemplo, "60 cápsulas", "150 gramas").
4. **"Segmentos que já atendemos"** — a lista dos segmentos (categorias, como
   Emagrecimento, Energia e disposição, Beleza e bem-estar, etc.) que hoje têm pelo
   menos uma fórmula ativa no catálogo.
5. **"Como funciona"** — o passo a passo de uma encomenda, em cinco etapas:
   1. Escolha da fórmula (do catálogo, ou desenvolvida do zero).
   2. Definição da apresentação (formato, quantidade por pote e sabor).
   3. Arte do rótulo (com a marca do cliente e os dizeres exigidos por lei).
   4. Produção (o lote é fabricado sob responsabilidade do farmacêutico da fábrica).
   5. Entrega (o lote pronto e rotulado é enviado para o endereço indicado).
6. **"A Lemon Caps fabrica dentro da norma sanitária brasileira"** — um resumo em
   quatro pontos (limites respeitados, legislação em dia, farmacêutico responsável,
   regime de notificação — não de registro) e um link para a página completa de
   [documentação regulatória](#26-documentação-regulatória). É aqui também que o
   site já avisa, na própria página institucional, a regra do selo: "a conferência da
   composição é feita produto a produto... quando uma fórmula foi conferida... ela
   recebe o selo 'Composição conferida'... nem todo produto tem o selo".
7. **"Vamos conversar sobre a sua linha"** — o convite final para contato, com o botão
   de WhatsApp (inerte enquanto o número não for cadastrado).

**Como se chega nela:** é a página que abre quando alguém digita o endereço do site,
sem nada depois da barra. De qualquer outra tela pública, clicar na marca "Lemon
Caps" no topo volta para aqui.

**Como foi verificado:** navegado de verdade (o servidor local respondeu e o texto
acima foi lido na página renderizada, não só no código).

---

### 2.2 Catálogo de fórmulas

**Endereço:** `/catalogo`.

**Para que serve:** é a vitrine — a lista de todas as fórmulas que a fábrica oferece
hoje, com busca e filtro, de onde o cliente entra em cada produto ou já cotiza direto.

**O que a pessoa vê:**

- Uma barra de busca no topo, para procurar fórmula pelo nome.
- Uma fileira de "chips" (botões redondos) para filtrar por segmento — "Todos" mais um
  botão por segmento (Emagrecimento, Energia, Beleza, etc.). É possível rolar essa
  fileira para os lados se não couber tudo na tela.
- Uma grade de cartões, um por fórmula. **Não existem mais abas separando "Premium" e
  "Básica"** — essa divisão existiu num momento anterior do projeto e foi retirada por
  decisão do dono: ela não refletia preço de verdade e escondia produtos duplicados.
  Hoje toda fórmula ativa aparece junto, na mesma grade.
- Um botão flutuante do carrinho, sempre visível, que mostra quantos itens já foram
  cotados.
- No rodapé, uma frase fixa que explica com honestidade o critério do selo de
  conformidade (ver [seção 4.1](#41-o-selo-composição-conferida)) — a mesma ideia da
  página inicial, repetida aqui.

**O que cada cartão mostra:**

| Elemento do cartão | O que é |
|---|---|
| Foto do pote (ou uma faixa colorida do segmento, se não houver foto) | Identifica visualmente o produto |
| Selo "Destaque" (estrela) | Só aparece nos produtos que a equipe marcou como destaque (ver [seção 3.8](#38-produto-em-destaque)) |
| Nome do segmento | Ex.: "Emagrecimento" |
| Nome da fórmula (é um link) | Leva para o dossiê técnico completo |
| Selo "Composição conferida" (escudo verde) | Só aparece nas fórmulas cuja composição já foi conferida contra a norma — ver [seção 4.1](#41-o-selo-composição-conferida). Passar o mouse (ou tocar, no celular) mostra quais normas foram conferidas e em que data |
| Tipo regulatório e apresentação | Ex.: "SUPLEMENTO ALIMENTAR EM CÁPSULA · 60 cápsulas" |
| Tabela de composição (resumida) | As 5 primeiras linhas da composição por dose, com um link para ver a tabela completa |
| Modo de uso | Quando cadastrado |
| Preço por pote | Ou "Preço sob consulta", se o preço ainda não foi cadastrado |
| "Pedido mínimo: X potes" | Sempre aparece — é a quantidade mínima daquela fórmula |
| Botão **Benefícios** | Só aparece se a fórmula tiver benefício cadastrado; leva para a página de benefícios |
| Botão **Dossiê técnico** | Só aparece se houver conteúdo; leva para a página completa do produto |
| Botão **Cotar fórmula** | Só aparece se houver preço cadastrado; abre a janela de cotação (ver abaixo) |

**A janela "Cotar fórmula":** ao clicar, abre um pequeno painel com o preço por pote,
um campo de quantidade (que já começa no pedido mínimo daquela fórmula e sobe/desce de
50 em 50 potes, mas nunca abaixo do mínimo), o subtotal calculado na hora, e o botão
**Adicionar à cotação** (fica desabilitado se a quantidade estiver abaixo do mínimo).
Ao confirmar, o item entra no carrinho e a janela fecha.

**Como se chega nela:** pelo link "Ver o catálogo de fórmulas" na página inicial, pela
barra fixa do topo em qualquer tela pública, ou digitando `/catalogo` direto.

**Como foi verificado:** o endereço foi acessado e respondeu normalmente; a lista de
cartões é montada no navegador do visitante (não aparece pronta no primeiro pedaço de
código que o servidor manda), então a conferência de cada botão e campo foi feita lendo
o código da tela — não uma captura de tela do cartão renderizado.

---

### 2.3 Dossiê técnico do produto

**Endereço:** `/catalogo/` seguido do nome da fórmula (ex.: `/catalogo/multivitaminico-adulto`).

**Para que serve:** é a ficha completa de uma única fórmula — o documento que qualquer
comprador profissional (ou a vigilância sanitária) precisaria para entender o produto
de cima a baixo.

**As seções, na ordem em que aparecem** (cada uma só aparece se houver conteúdo
cadastrado — nunca um título vazio ou um "não informado" no lugar):

1. **Foto do produto** (se houver) e o título — o nome do dossiê técnico ou, na
   ausência dele, o nome comercial da fórmula.
2. **Identificação** — nome, segmento, linha, tipo regulatório, apresentação e peso
   líquido.
3. **Composição por dose** — a tabela completa de insumos, com a quantidade exata e a
   unidade de cada um (mg, mcg, g, ml, UI etc.).
4. **Informação nutricional**, **Ingredientes** (a declaração de ingredientes do
   rótulo) e **Modo de uso** — cada uma na sua própria seção, quando cadastrada.
5. **Público-alvo** — para quem o produto é indicado.
6. **Advertências e restrições** — os avisos obrigatórios de rótulo.
7. **Conservação** — como guardar o produto.
8. **Especificação de embalagem e logística** — código de barras (EAN-13 do pote e
   DUN-14 da caixa), validade, peso e dimensões da unidade e da caixa, unidades por
   caixa. Só aparece o que estiver de fato preenchido; hoje, nenhuma fórmula tem esses
   dados completos (ver [seção 6](#6-o-que-ainda-não-funciona--está-pendente)).
9. **Condições comerciais** — preço por pote (ou "Sob consulta") e pedido mínimo.
10. **Conformidade** — só aparece nas fórmulas com o selo: mostra a frase "Composição
    conferida contra os limites vigentes da ANVISA em [data]", as normas específicas
    conferidas para aquele produto, e um link para o texto oficial da norma.
11. **Assinatura da ficha técnica** — só aparece se algum responsável técnico já tiver
    registrado uma aprovação daquela ficha (ver [seção 3.3](#33-catálogo-cadastro-de-fórmulas)).
    Hoje nenhuma fórmula tem essa assinatura registrada ainda.
12. **Marco regulatório aplicável** — um texto institucional, igual em todo produto:
    a postura da fábrica sobre a norma sanitária, seguida (recolhida, para quem quiser
    abrir) da lista das normas que ela segue, cada uma com link para o texto oficial.
    Esta seção deixa claro, por escrito, que seguir a norma como fábrica **não é a
    mesma coisa** que ter aquele produto específico conferido — essa afirmação só
    existe na seção "Conformidade", acima, quando ela aparece.
13. **Fabricante e responsabilidade técnica** — razão social, CNPJ, endereço,
    farmacêutico responsável e e-mail do SAC. Esta seção também repete a frase de
    dispensa de registro que vem impressa no rótulo físico do produto — ver a
    observação sobre essa frase na [seção 6](#6-o-que-ainda-não-funciona--está-pendente).

**Botões no topo da página:** "Baixar PDF" (gera um PDF com o dossiê completo, pronto
para enviar a um comprador) e, se houver conteúdo de benefício, "Ver benefícios"
(leva para a página da [seção 2.4](#24-página-de-benefícios)).

**Como se chega nela:** clicando no nome de qualquer fórmula no catálogo, ou no botão
"Dossiê técnico" do cartão.

**Como foi verificado:** lendo o código da tela por completo (a tela é gerada com o
nome do produto na própria URL; para conferir uma fórmula específica seria preciso
saber o nome exato dela na barra de endereço — a estrutura das seções, porém, é a
mesma para qualquer fórmula, e foi essa estrutura que foi conferida).

---

### 2.4 Página de benefícios

**Endereço:** `/catalogo/` seguido do nome da fórmula, seguido de `/beneficios`.

**Para que serve:** existe como página separada (e não uma parte a mais do dossiê)
porque foi pedido que os benefícios abrissem numa tela própria, com espaço para
detalhar cada insumo.

**O que a pessoa vê:**

- A foto do produto ao lado do título "Benefícios de [nome da fórmula]".
- Um link para voltar ao dossiê técnico completo.
- A seção **Benefícios** — um resumo em texto corrido e/ou uma lista de benefícios,
  quando cadastrados.
- A seção **Insumos da fórmula** — um cartão para cada insumo que compõe a fórmula
  (com o nome, e a descrição/alegação daquele insumo quando já estiver cadastrada no
  banco de insumos). Se a fórmula ainda não tiver composição cadastrada, aparece o
  aviso "Composição não cadastrada" em vez de uma lista vazia.

**Como se chega nela:** pelo botão "Benefícios" do cartão no catálogo, ou pelo link
"Ver benefícios" no topo do dossiê técnico.

**Como foi verificado:** lendo o código da tela por completo.

---

### 2.5 Carrinho e a cotação

**Endereço:** `/carrinho`.

**Para que serve:** é onde o cliente revisa tudo que separou, informa quem ele é, e
transforma a cotação (o processo de montar o pedido) num orçamento (o documento final,
com número). Ver a diferença exata entre os dois termos na [seção 4.4](#44-cotação-×-orçamento).

**Passo a passo de como o cliente monta e envia:**

1. No catálogo, clica em **Cotar fórmula** em cada produto que quer, escolhe a
   quantidade (sempre em múltiplos de 50 potes, nunca abaixo do pedido mínimo daquela
   fórmula) e confirma. O item entra no carrinho.
2. Abre o carrinho (pelo botão flutuante, em qualquer tela do catálogo, ou pelo
   endereço `/carrinho` direto).
3. Na tela do carrinho, para cada item cotado ele vê o nome, o preço por pote, o
   pedido mínimo, pode ajustar a quantidade (com os botões de mais/menos ou digitando
   direto) e pode remover o item (com a opção de desfazer, caso remova por engano).
4. Vê o resumo: total de potes e valor total.
5. Preenche dois campos: **Nome completo** e **WhatsApp (com DDD)** — a validação
   exige só números, com DDD, entre 10 e 15 dígitos.
6. Clica em **Gerar orçamento**.
7. O sistema grava o pedido (primeiro registra o contato como um lead, depois cria o
   orçamento) e devolve um **número de orçamento sequencial** — é esse número, e não
   nenhum código interno, que identifica o pedido para o cliente e para a equipe.
8. A tela muda para a confirmação: "Orçamento gerado com sucesso", com o número em
   destaque, e três botões:
   - **Copiar orçamento** — copia para a área de transferência um texto com cliente,
     WhatsApp, número do orçamento, cada item com quantidade e subtotal, e o total —
     pronto para colar numa conversa.
   - **Baixar PDF** — gera um PDF completo, com o mesmo nível de detalhe do dossiê
     técnico de cada fórmula cotada (identificação, composição, modo de uso,
     benefícios, advertências, conformidade e dados do fabricante).
   - **Falar no WhatsApp** — abre uma conversa de WhatsApp já com uma mensagem curta
     citando o número do orçamento, a quantidade de potes e o total. **Este botão só
     funciona depois que o número oficial de WhatsApp da fábrica for cadastrado no
     sistema** — enquanto isso, ele aparece desabilitado (ver [seção 5](#5-perguntas-frequentes-e-problemas-comuns)
     e [seção 6](#6-o-que-ainda-não-funciona--está-pendente)).

**Um detalhe importante para explicar ao cliente, se perguntarem:** se ele atualizar a
página (F5) enquanto ainda está na tela de sucesso, o número, os itens e os três
botões voltam exatamente como estavam — isso funciona por até 2 horas. Só não
funciona se ele fechar o navegador ou abrir em outra aba, porque essa informação (que
contém nome e WhatsApp) foi guardada de um jeito que se apaga sozinho — de propósito,
para não deixar dado pessoal do cliente salvo no aparelho por tempo indefinido.

**Um limite de segurança:** o sistema recusa mais de 5 tentativas de gerar orçamento
com o mesmo WhatsApp em 10 minutos, com um aviso explicando o motivo — é uma proteção
contra uso indevido, não um erro do sistema.

**Como se chega nela:** pelo botão flutuante do carrinho, em qualquer tela pública.

**Como foi verificado:** navegado de verdade até a tela vazia (o carrinho é montado no
aparelho de quem está navegando, então uma cotação de teste completa não foi simulada
nesta sessão); o fluxo de preenchimento, envio e a tela de sucesso foram conferidos
lendo o código correspondente por completo.

---

### 2.6 Documentação regulatória

**Endereço:** `/documentacao`.

**Para que serve:** reúne, num só lugar, as normas sanitárias que a fábrica segue —
pensada para responder à pergunta "vocês têm isso documentado?" sem precisar abrir o
dossiê de cada produto.

**O que a pessoa vê, de cima para baixo:**

1. Uma declaração institucional em destaque, com três afirmações centrais: os limites
   mínimos e máximos por dose são respeitados, a legislação sanitária vigente é
   seguida, e a produção tem farmacêutico responsável nomeado. Logo abaixo, uma frase
   separada e visível deixa claro o limite dessa declaração: ela fala de como a
   fábrica trabalha — **não afirma, por si só, que um produto específico foi
   conferido**. Essa afirmação individual só existe no dossiê de cada fórmula, no selo
   de conformidade, quando ele existir.
2. Uma explicação simples de como a norma se organiza: as Resoluções (RDC) estabelecem
   os requisitos; as Instruções Normativas (IN) detalham esses requisitos (por
   exemplo, trazendo a lista de insumos permitidos e os limites de cada um).
3. A lista das Resoluções (6, hoje) e das Instruções Normativas (4, hoje) que a
   fábrica segue, cada uma com data, situação e um link direto para o texto oficial
   no portal de legislação da própria ANVISA. Um bloco recolhido mostra também o
   histórico de alterações de uma das normas mais importantes (a que traz a lista de
   insumos e limites), para quem quiser ver que a fábrica acompanha a norma viva.
4. Como o produto é regularizado hoje: suplemento alimentar é dispensado de registro
   prévio, mas precisa de notificação junto à ANVISA antes de ser vendido.
5. Os dados do fabricante e do responsável técnico (razão social, CNPJ, endereço,
   farmacêutico, e-mail do SAC).
6. De onde vieram essas informações: a página diz explicitamente que cada norma foi
   conferida individualmente na fonte oficial da ANVISA, e avisa que a legislação
   muda — recomendando conferir a fonte oficial antes de qualquer decisão que dependa
   disso.

**O que esta página propositalmente não afirma:** nenhuma certificação (como BPF,
ISO ou HACCP), licença sanitária ou Autorização de Funcionamento de Empresa — porque
nenhum desses documentos foi confirmado ainda. Antes de dizer a um cliente que a
fábrica tem uma certificação específica, confirme com o Diego.

**Como se chega nela:** por um link na página inicial (na seção sobre a norma
sanitária) e pelo rodapé do dossiê técnico de cada produto.

**Como foi verificado:** navegado de verdade (endereço respondeu normalmente) e o
código da tela foi lido por completo.

---

## 3. A área administrativa, tela por tela

> Esta seção foi conferida lendo o código das telas por completo. **Não foi possível
> entrar de fato na área administrativa nesta sessão**, porque isso exige a senha de
> uma conta de acesso, que não estava disponível — ver a nota de verificação no fim
> da seção 3.1, logo abaixo. Nenhum botão aqui descrito é suposição: cada um foi lido
> no código que desenha a tela.

### 3.1 Como entrar

**Endereço:** `/admin`. Se não houver login, o sistema redireciona automaticamente
para a tela de entrada.

1. Acesse `/admin` (ou o endereço de login direto).
2. Informe o **e-mail** e a **senha** da conta de acesso.
3. Clique em **Entrar**.

Se o e-mail ou a senha estiverem errados, a mensagem é sempre a mesma ("E-mail ou
senha inválidos") — de propósito, para não dar pista de qual dos dois está errado. Se
o login e a senha estiverem certos, mas aquela conta não tiver acesso à área
administrativa, a mensagem avisa exatamente isso.

**Importante para quem for treinar gente nova:** hoje **não existe, dentro do próprio
sistema, uma tela para criar conta de acesso nova**. Criar uma conta para um novo
membro da equipe é tarefa de quem administra o sistema por fora (hoje, o Diego) — ver
[seção 6](#6-o-que-ainda-não-funciona--está-pendente).

##### Como entrar — nota de verificação

Ao consultar o cadastro de contas de acesso diretamente no banco de dados (leitura,
sem alterar nada), em 14/09/2026 existia **exatamente uma conta de acesso cadastrada**,
em nome de Diego Francisco, com permissão de orçamentos habilitada. Ou seja: hoje, na
prática, só o Diego consegue entrar na área administrativa. Isso é relevante para este
manual porque significa que qualquer outra pessoa da equipe **ainda precisa de uma
conta própria antes de conseguir usar qualquer tela desta seção 3**.

### 3.2 O menu e a Visão geral

Depois de entrar, o menu lateral aparece em três grupos:

| Grupo | Telas |
|---|---|
| (sem título, fica sozinho no topo) | Visão geral |
| Cadastro | Catálogo · Insumos · Custos |
| Comercial | Leads · Orçamentos (só aparece para quem tem a permissão extra de orçamentos) |

No topo do menu há sempre um link **Voltar ao catálogo** (não desconecta a conta, só
leva para a vitrine pública), e no fim, o nome de quem está logado e o botão **Sair**.

**A tela de Visão geral (`/admin`)** é a primeira coisa que aparece depois do login.
Ela tem, de cima para baixo:

1. **Indicadores** — números clicáveis (cada um leva direto para a tela correspondente):
   quantas fórmulas estão no ar (com uma nota dizendo quantas estão cadastradas no
   total e quantas estão inativas, só quando existe alguma inativa), quantos insumos
   existem, quantos leads chegaram, e — só para quem tem a permissão extra — quantos
   orçamentos existem (com a contagem por status), o valor total já cotado e o valor
   médio por orçamento. Esses dois últimos só aparecem quando o cálculo puder ser feito
   por completo; se faltar dado, o bloco simplesmente não aparece — nunca com um
   número pela metade.
2. **Pendências do cadastro** — o painel mais importante para o dia a dia. Mostra, em
   uma lista, tudo que está faltando no cadastro **hoje**, cada linha com: um ícone,
   a palavra "Urgente" ou "Atenção" escrita (a gravidade nunca é só uma cor), a
   contagem exata ("X de Y") e um link direto para resolver. As cinco pendências
   possíveis são:
   - Custo de produção não lançado
   - Fórmulas ativas sem foto do pote
   - Fórmulas ativas sem lista de ingredientes
   - Fórmulas ativas sem advertências
   - Fórmulas ativas sem selo de conformidade

   Uma pendência só é tratada como "Urgente" quando afeta metade ou mais do universo
   medido; do contrário é "Atenção". E uma pendência zerada simplesmente desaparece da
   lista — **é aqui que a equipe deve olhar para saber o estado real do catálogo hoje**,
   em vez de confiar num número escrito num documento antigo (inclusive este manual).
3. **Leads recentes** e **Orçamentos recentes**, lado a lado — os últimos que chegaram,
   com data relativa ("hoje", "há 2 dias") e link para ver todos.
4. **Ações rápidas** — atalhos para as tarefas mais comuns (Gerenciar catálogo, Novo
   insumo, Lançar custos, Ver leads e, se houver permissão, Ver orçamentos).

### 3.3 Catálogo (cadastro de fórmulas)

**Endereço:** `/admin/catalogo`.

**A lista:** uma tabela com todas as fórmulas cadastradas (não só as ativas), com
busca por nome e filtros por segmento e por situação (Todas / Ativas / Inativas). Se
a proporção de produtos em destaque estiver alta demais, aparece um aviso no topo
explicando por quê (ver [seção 3.8](#38-produto-em-destaque)) — é só um aviso, nunca um
bloqueio. Cada linha mostra:

| Coluna | O que mostra |
|---|---|
| Produto | Foto (ou o ícone do formato, se não houver foto), nome (é um link para editar), e uma linha pequena com segmento, linha e formato |
| Pendências | Chips com o que falta naquele produto: Sem foto, Sem preço, Sem ingredientes, Sem advertências, Sem selo — ou um traço, se não faltar nada dessas cinco coisas |
| Preço | O preço por pote, ou um traço se ainda não tiver sido definido |
| Destaque | Botão de alternar destaque (ver [seção 3.8](#38-produto-em-destaque)) |
| Situação | Botão **Ativo**/**Inativo** — clicar alterna na hora (com opção de desfazer). Não é possível ativar uma fórmula sem preço cadastrado |
| Ações | Link **Editar** |

Um botão **Nova fórmula**, no topo, cria um cadastro do zero.

**A tela de criar/editar uma fórmula** é dividida em blocos:

1. **Identificação** — nome, slug (a parte do endereço que identifica o produto na
   internet — só letras minúsculas, números e hífen), segmento, linha, formato, tipo
   regulatório (o texto do rótulo, ex.: "SUPLEMENTO ALIMENTAR EM CÁPSULA"), e a caixa
   **Ativo** (só pode ser marcada se já houver preço definido).
2. **Apresentação** — apresentação do pote (ex.: "60 cápsulas"), peso líquido, e o
   título que aparece no dossiê técnico.
3. **Conteúdo** — descrição, informação nutricional, declaração de ingredientes (o
   texto completo do rótulo — diferente da composição por dose, que é a tabela
   estruturada, vista abaixo), modo de uso, público-alvo, conservação e advertências.
4. **Benefícios** — a lista de benefícios (um por linha) e um resumo em texto corrido.
5. **Pacote técnico** — os dados de embalagem e logística: código de barras do pote
   (EAN-13) e da caixa (DUN-14) — ambos com o dígito verificador checado
   automaticamente, então um código digitado errado é recusado na hora —, validade em
   meses, peso e dimensões da unidade e da caixa, e quantas unidades cabem numa caixa.
6. **Ficha técnica e responsabilidade** — a versão da ficha técnica. Só deve subir
   quando a mudança for grande a ponto de exigir nova aprovação do responsável
   técnico (um ajuste simples de preço não é "ficha nova").
7. **Comercial** — preço por pote, pedido mínimo (em potes) e a ordem de exibição no
   catálogo.
8. **Composição por dose** — uma lista de insumos, cada um com nome, quantidade e
   unidade (mg, mcg, g, ml, UI, L, kg). É possível ligar cada linha a um insumo já
   cadastrado no banco de insumos (isso traz a foto e a descrição daquele insumo para
   o site público), adicionar linha nova, e reordenar com setas de subir/descer.
9. **Assinatura da ficha técnica** — o histórico de aprovações do responsável técnico:
   nome de quem assinou, registro profissional (ex.: "CRF/MT 5526"), versão da ficha
   aprovada, data e uma observação interna. **Uma aprovação, depois de registrada, não
   pode ser editada nem apagada** — se algo precisar mudar, registra-se uma aprovação
   nova, e as duas ficam visíveis na ordem em que aconteceram. Isso é proposital: é um
   registro de responsabilidade legal, e um histórico que pudesse ser editado não
   provaria nada para uma auditoria.

   Os três campos que definem o **selo de conformidade** (composição conferida) **não
   aparecem em lugar nenhum deste formulário** — não existe uma caixinha para marcar
   "colocar selo". Isso é proposital: o selo representa uma conferência de composição
   feita e documentada à parte, não uma opinião marcada na tela de cadastro. Quem
   decide e registra isso é um processo específico de auditoria de composição, fora
   desta tela — ver [seção 4.1](#41-o-selo-composição-conferida).
10. **Zona de risco** — o botão **Excluir fórmula**, que pede um motivo por escrito
    antes de confirmar (ver [seção 4.5](#45-exclusão-lógica)).

Há também um link **Ver custo (interno)**, que leva direto para o custo daquela
fórmula específica (ver próxima seção).

### 3.4 Insumos

**Endereço:** `/admin/insumos`.

**Para que serve:** o cadastro de cada matéria-prima (insumo) que entra em alguma
fórmula — nome, categoria, imagem e a alegação funcional autorizada pela ANVISA para
aquele insumo (o texto que explica o que ele faz, quando já foi conferido).

**A lista** mostra nome (link para editar), categoria (Vitamina, Mineral, Aminoácido,
Extrato vegetal ou Outro), se a alegação já foi conferida ("Conferida" ou "Pendente")
e se o insumo está ativo. Tem busca por nome e filtro por categoria, e um botão
**Novo insumo**.

**A tela de criar/editar um insumo:**

1. **Identificação** — nome, slug, categoria e a caixa Ativo.
2. **Ficha pública** — descrição e o caminho/link da imagem que aparece no site.
3. **Alegação autorizada pela ANVISA** — o texto da alegação, a fonte da norma
   consultada (o link da IN/RDC vigente), a quantidade mínima por porção que justifica
   a alegação, e a data em que essa alegação foi conferida. **A orientação do próprio
   sistema é deixar esse texto em branco enquanto a alegação não tiver sido conferida
   contra a norma vigente** — nunca preencher por suposição.

### 3.5 Custos

**Endereço:** `/admin/custos`.

**Para que serve:** é onde a fábrica lança o custo real de produção de cada fórmula —
**informação 100% interna**, que o público nunca vê (nem mesmo um visitante que abra
as ferramentas de desenvolvedor do navegador consegue ler essa informação; a tela
avisa isso explicitamente). É esse custo que permite calcular a margem e o lucro dos
orçamentos.

**A tela é uma tabela única, com todas as fórmulas de uma vez** (antes existia uma
edição fórmula por fórmula, mas com muitos produtos e nenhum custo lançado, ninguém
usava). Um resumo no topo mostra: quantos custos já foram definidos ("X de Y"), a
margem média entre os que já têm custo, e quantos estão com margem negativa (o custo
maior que o preço de venda — um alerta em vermelho).

Cada linha tem: nome da fórmula, preço público, um campo para digitar o **custo real
por pote** (aceita vírgula: "8,50", "12", "1.234,56" — e reformata sozinho ao saltar
para o próximo campo, assim quem digitou confirma visualmente o valor certo), a
margem calculada em reais e em porcentagem (aparece na hora, sem precisar salvar
antes), um campo de observação interna, e um link **Editar** para abrir a tela
individual daquela fórmula (útil para escrever uma nota mais longa).

**Um campo de custo em branco significa "não definido" — nunca é tratado como zero.**
Isso é proposital: um custo zero e um custo desconhecido são coisas muito diferentes
para decidir preço.

Os botões **Salvar alterações** e **Descartar alterações** ficam no topo e no fim da
tabela; o sistema avisa antes de sair da página se houver algo digitado e não salvo.

### 3.6 Leads

**Endereço:** `/admin/leads`.

**Para que serve:** é a lista de todo mundo que chegou a preencher nome e WhatsApp no
carrinho — mesmo que não tenha, por algum motivo, chegado a gerar um orçamento
completo. É dado pessoal (nome, WhatsApp), então cabe na lei de proteção de dados
(LGPD).

**A lista** mostra nome, WhatsApp (um link que já abre a conversa no WhatsApp), o
carrinho que aquela pessoa tinha montado no momento (quantidade e preço de cada
item), a data em que chegou, e um botão **Excluir** (pede confirmação antes, porque é
dado pessoal). Tem busca por nome ou WhatsApp.

Esta tela **não exige a permissão extra de orçamentos** — qualquer conta de acesso
enxerga os leads.

### 3.7 Orçamentos

**Endereço:** `/admin/orcamentos`. **Só aparece no menu, e só pode ser aberta, por
quem tem a permissão extra de orçamentos** — hoje, só o Diego.

**A lista** tem busca (por cliente, WhatsApp ou número do orçamento), filtro por
status (Todos, Aberto, Aprovado, Recusado, Expirado) e filtro por período (data
inicial/final). Um botão **Exportar planilha** baixa em CSV exatamente o que está
sendo mostrado na tela (respeitando os filtros aplicados) — uma linha por item de
orçamento, incluindo o lucro estimado de cada linha.

Cada linha da lista mostra: número do orçamento (link para abrir), cliente e
WhatsApp, status (com selo colorido), quantidade de itens, valor total, lucro
estimado (ou "desconhecido", quando o custo daquela fórmula ainda não foi lançado) e
data.

**Ao abrir um orçamento específico:**

- Um painel **Status e observação interna** — troca o status (Aberto / Aprovado /
  Recusado / Expirado) e escreve uma observação que **só a equipe vê** (nunca aparece
  para o cliente nem entra no PDF do orçamento).
- Uma tabela com cada item do orçamento: fórmula, quantidade de potes (editável),
  preço por pote (editável), total da linha, margem em porcentagem (ou "desconhecida"),
  e um botão **Salvar** por linha.

**Não existe, nesta tela, um botão para gerar de novo o PDF ou reenviar o orçamento
ao cliente** — ver a pergunta correspondente na [seção 5](#5-perguntas-frequentes-e-problemas-comuns).

### 3.8 Produto em destaque

Não é uma tela própria — é um botão dentro da lista de catálogo (coluna "Destaque",
[seção 3.3](#33-catálogo-cadastro-de-fórmulas)): um botão com uma estrela e a palavra
"Destaque". Clicar liga ou desliga o destaque daquele produto na hora (com opção de
desfazer pelo aviso que aparece).

Detalhes que valem saber:

- Marcar destaque num produto que está **inativo** não dá erro, mas avisa: o destaque
  só vai aparecer na vitrine quando aquele produto for reativado.
- Existe um limite recomendado de quantos produtos podem estar em destaque ao mesmo
  tempo (ver a explicação completa na [seção 4.3](#43-produto-em-destaque-e-o-limite)).
  Passar do limite **nunca bloqueia** — só aparece um aviso no topo da lista de
  catálogo.
- Na vitrine pública, os produtos em destaque aparecem primeiro (o destacado mais
  recentemente, na frente dos outros), e o resto do catálogo continua na ordem manual
  de sempre.

---

## 4. Conceitos que a equipe precisa entender

### 4.1 O selo "Composição conferida"

**O que é:** um selo (ícone de escudo verde + o texto "Composição conferida") que
aparece no cartão do produto no catálogo e no dossiê técnico de algumas fórmulas.

**O que ele realmente significa:** que **a composição daquela fórmula específica foi
conferida, insumo por insumo, contra as listas e os limites da norma da ANVISA em
vigor numa certa data** — e essa data e as normas conferidas ficam registradas e
visíveis (passando o mouse sobre o selo, ou na seção "Conformidade" do dossiê).

**O que ele NÃO significa:**

- **Não é** "este produto foi aprovado pela ANVISA". Suplemento alimentar não passa
  por aprovação prévia da ANVISA (ver [seção 2.6](#26-documentação-regulatória)) — o
  regime é de notificação, não de registro/aprovação.
- **Não é** uma afirmação de que "todo o catálogo está dentro da norma". O próprio
  site é explícito sobre isso, no rodapé do catálogo e na página inicial: nem todo
  produto tem o selo, e é assim de propósito.

**Por que alguns produtos não têm o selo:** porque a composição daquele produto ainda
não passou por essa conferência específica, ou porque falta algum dado essencial para
fazer a conferência (por exemplo, uma fórmula sem lista de ingredientes cadastrada não
tem como ter a composição conferida — não existe o que conferir). Não ter o selo **não
quer dizer que o produto está fora da norma** — quer dizer apenas que aquela
verificação específica, documentada, ainda não foi feita para aquele produto.

**Quem coloca o selo:** este é um ponto importante para quem administra o cadastro —
**não existe um botão "colocar selo" na tela normal de editar uma fórmula**
([seção 3.3](#33-catálogo-cadastro-de-fórmulas)). O selo é resultado de um processo de
auditoria de composição feito e documentado à parte, não uma opção de formulário do
dia a dia. Se um cliente ou um membro da equipe achar que uma fórmula deveria ter o
selo e não tem (ou vice-versa), a resposta é levar a pergunta ao Diego — não marcar
nem desmarcar por conta própria em lugar nenhum da tela de cadastro (porque, hoje, não
haveria nem onde marcar).

### 4.2 Pedido mínimo e como o preço é exibido

Toda fórmula tem um **pedido mínimo em potes** (o padrão do catálogo é 100 potes, mas
cada fórmula pode ter o seu próprio mínimo cadastrado). O visitante nunca consegue
cotar uma quantidade menor que esse mínimo — os campos de quantidade, tanto na janela
de cotação quanto dentro do carrinho, recusam (e avisam) qualquer valor abaixo dele.

O preço sempre aparece **por pote**, nunca um valor fechado do lote inteiro — quem
quer saber o total multiplica a quantidade pelo preço unitário, e o próprio sistema já
mostra esse subtotal calculado, tanto na janela de cotação quanto no carrinho.

Se uma fórmula não tiver preço cadastrado, ela aparece no catálogo com "Preço sob
consulta" e **sem o botão de cotar** — não é possível montar uma cotação de um produto
sem preço.

### 4.3 Produto em destaque e o limite

"Destaque" é a fábrica escolhendo, deliberadamente, quais produtos aparecem primeiro
na vitrine — **não é** "mais vendido" nem "recomendado" (o sistema não tem, hoje,
nenhum dado de venda que sustentasse essas outras duas frases; por isso o selo usado é
sempre "Destaque").

Existe um número recomendado de quantos produtos podem estar em destaque ao mesmo
tempo, calculado automaticamente: **o maior valor entre 3 e um terço do total de
fórmulas ativas**. A lógica por trás: numa vitrine de três colunas, destacar mais de
um terço do catálogo já é mais do que cabe na primeira tela — nesse ponto, "destaque"
deixa de separar qualquer coisa do resto. Com o catálogo de hoje (poucas dezenas de
fórmulas ativas), esse limite fica na casa de 8 a 9 produtos — o número exato sobe e
desce conforme quantas fórmulas estão ativas, então confira o aviso na tela de
catálogo em vez de memorizar um número fixo.

Passar desse limite **nunca impede** de marcar mais destaques — é uma decisão do dono
do catálogo, e uma campanha pode, de propósito, querer destacar meia vitrine por uma
semana. O sistema só avisa.

### 4.4 Cotação × orçamento

Os dois termos aparecem juntos o tempo todo, mas significam coisas diferentes:

- **Cotação** é o **processo**: o cliente escolhendo fórmulas e quantidades no
  carrinho, ainda podendo mudar de ideia, ainda não confirmado.
- **Orçamento** é o **documento final**: o que existe depois que o cliente preenche
  nome e WhatsApp e confirma. Tem um número sequencial próprio, pode ser copiado,
  baixado em PDF, e é o que a equipe acompanha na tela de Orçamentos.

Por isso o sistema nunca chama o documento final de "pedido" — "pedido" já tem outro
significado dentro do próprio catálogo (o pedido mínimo de potes de cada fórmula), e
usar a mesma palavra para as duas coisas confundiria o cliente.

### 4.5 Exclusão lógica

Quando um produto (ou um lead, ou um orçamento) é "excluído" no sistema, ele nunca é
apagado de verdade do banco de dados — ele só **sai de circulação**, e o registro
continua guardado, para histórico e auditoria (quem excluiu, quando e por quê).

Para fórmulas especificamente, existem **dois botões diferentes**, e a equipe precisa
saber a diferença entre eles:

| Ação | Onde fica | O que faz | É reversível? |
|---|---|---|---|
| **Ativo / Inativo** (o botão de alternar situação) | Coluna "Situação", na lista de catálogo | Tira o produto só da vitrine pública. O produto continua na lista de administração, pronto para ser reativado | Sim, com um clique — e sem precisar dar motivo |
| **Excluir fórmula** | Dentro da tela de editar, no bloco "Zona de risco" | Tira o produto da vitrine pública **e** da lista de administração. Pede um motivo por escrito antes de confirmar | Só voltando direto no banco de dados — não existe, hoje, um botão de "restaurar" dentro das telas do sistema |

Use **Ativo/Inativo** para uma pausa temporária (por exemplo, produto fora de linha
por um tempo). Use **Excluir** só quando o produto realmente não deveria existir mais
no cadastro — como aconteceu recentemente com alguns produtos duplicados (dois
registros para o mesmo produto, com preços diferentes), que foram removidos por essa
via depois de confirmado que eram a mesma coisa.

O mesmo princípio (nunca apagar de verdade) vale para leads e para orçamentos: os
botões **Excluir** dessas duas telas também são exclusão lógica.

---

## 5. Perguntas frequentes e problemas comuns

| Situação | O que fazer |
|---|---|
| **O cliente diz que perdeu o orçamento.** | Peça o nome, o WhatsApp ou o número do orçamento (se ele lembrar) e procure em `/admin/orcamentos` na busca. Lá aparecem os itens, quantidades, preços e o total. **Hoje não existe um botão para gerar de novo o PDF direto dessa tela** — o jeito prático é repassar as informações manualmente pelo WhatsApp (por exemplo, copiando os dados da tabela). Se o cliente ainda estiver na mesma aba do navegador onde gerou o orçamento (e não tiverem passado mais de 2 horas), basta ele apertar F5 na própria tela do carrinho — o orçamento reaparece sozinho, com os três botões. |
| **Um produto não aparece no catálogo.** | Primeiro, confira se ele está marcado como **Inativo** em `/admin/catalogo` (ver [seção 4.5](#45-exclusão-lógica)) — se estiver, é só reativar (precisa ter preço cadastrado para conseguir). Se ele não aparecer nem na lista de administração, é porque foi **excluído**; confira o motivo lendo o histórico do produto ou pergunte ao Diego, já que restaurar um excluído exige acesso direto ao banco de dados. Também vale conferir se o filtro de busca ou de segmento da tela não está, sem querer, escondendo o produto. |
| **O preço está errado.** | O preço que aparece para o cliente é sempre o cadastrado no bloco "Comercial" da tela de editar a fórmula (`/admin/catalogo`). Corrija ali. Lembre-se: o custo de produção (em `/admin/custos`) é uma informação totalmente separada e privada — mudar o custo não muda o preço que o cliente vê, e vice-versa. Uma causa possível de "o cliente viu um preço, mas o orçamento saiu com outro": se o preço da fórmula foi alterado enquanto o cliente já tinha o item parado no carrinho por um tempo, o orçamento final sempre usa o preço mais atual do cadastro no momento em que ele confirma — então a tela do carrinho pode, por um instante, mostrar um preço que já ficou desatualizado (ver [seção 6](#6-o-que-ainda-não-funciona--está-pendente)). |
| **O botão de WhatsApp não funciona.** | É esperado, hoje: o número oficial de WhatsApp da fábrica ainda não foi cadastrado no sistema. O botão continua visível (com a aparência de WhatsApp), mas fica desligado de propósito — para nunca virar um link quebrado. Assim que o número for cadastrado, ele passa a funcionar em todos os lugares onde aparece, sem precisar de mais nenhuma alteração. Enquanto isso, use os botões "Copiar orçamento" ou "Baixar PDF", que não dependem disso. |
| **A margem/lucro aparece como "desconhecida" ou "desconhecido".** | Não é erro — significa que o custo real de produção daquela fórmula ainda não foi lançado em `/admin/custos`. Sem custo, não existe conta de margem para fazer (o sistema propositalmente não inventa "0%" no lugar). Lance o custo, e o número passa a aparecer, recalculado automaticamente. |
| **Não consigo entrar na área administrativa.** | Confirme e-mail e senha. Se o problema persistir, pode ser que essa conta ainda não tenha sido criada como conta de acesso — hoje só existe uma conta cadastrada (ver [seção 3.1](#31-como-entrar)). Peça ao Diego para criar a sua. |
| **Um insumo ou fórmula de teste ficou no cadastro por engano.** | Use a exclusão lógica (o botão Excluir da tela correspondente, sempre pedindo o motivo) em vez de tentar apagar de outra forma — é o jeito correto e seguro de tirar algo de circulação sem perder o rastro do que aconteceu. |
| **Quero saber quantas fórmulas/insumos/segmentos existem agora.** | Não confie num número escrito neste manual (ele é de 14/09/2026) nem em conversa antiga — veja o painel de indicadores em `/admin` (Visão geral), que sempre mostra a contagem do momento. |

---

## 6. O que ainda não funciona / está pendente

Lista honesta do que falta, conferida no código e no banco de dados em 14/09/2026.
Cada item diz o efeito prático para quem usa o sistema no dia a dia.

| Pendência | Efeito prático | Situação conferida |
|---|---|---|
| **Número oficial de WhatsApp não cadastrado no sistema.** | Todos os botões "Falar no WhatsApp" do site público (na página inicial, no carrinho e na tela de erro do catálogo) ficam desligados. | Confirmado no código: a variável que guarda o número está prevista em cinco telas diferentes, e nenhuma delas encontra um valor hoje. |
| **Nenhum custo de produção lançado.** | Toda margem e todo lucro do sistema (painel de Visão geral, tela de Custos, lista e detalhe de Orçamentos, planilha exportada) aparece como "desconhecido" em vez de um número. | Confirmado direto no banco: nenhuma das linhas de custo cadastradas tem valor preenchido. |
| **Só existe uma conta de acesso à área administrativa hoje.** | Ninguém da equipe de vendas/administrativo, além do Diego, consegue entrar em `/admin` até que uma conta seja criada para essa pessoa — e não existe, hoje, uma tela dentro do sistema para o próprio time criar essa conta. | Confirmado direto no banco: uma única conta cadastrada. |
| **Não existe aviso automático de lead ou orçamento novo.** | A equipe precisa ter o hábito de entrar em `/admin` e checar — nada chega por e-mail, WhatsApp ou qualquer outro aviso quando um cliente gera um orçamento. | Confirmado: não há nenhum mecanismo de envio de e-mail/notificação nesta parte do sistema. |
| **Nenhum código de barras cadastrado (EAN-13 do pote, DUN-14 da caixa).** | A seção de embalagem e logística não aparece em nenhum dossiê técnico hoje. | Confirmado direto no banco: nenhuma fórmula tem esses campos preenchidos. |
| **Nenhuma assinatura de ficha técnica registrada.** | A seção "Assinatura da ficha técnica" não aparece em nenhum dossiê ainda, embora a página institucional já afirme que a produção tem farmacêutico responsável de forma geral. | Confirmado direto no banco: nenhum registro de aprovação. |
| **Algumas fórmulas ativas ainda sem lista de ingredientes ou sem advertências cadastradas.** | Essas seções simplesmente não aparecem no dossiê daquelas fórmulas — e são campos que, por lei de rotulagem, deveriam existir. Consulte o número exato de hoje no painel "Pendências do cadastro" (`/admin`), porque ele muda conforme o cadastro é completado. | Confirmado direto no banco (contagem exata no momento da consulta; ver observação abaixo). |
| **Fórmulas sem foto de produto.** | O cartão e o dossiê mostram uma faixa colorida do segmento no lugar da foto. Hoje afeta uma pequena minoria das fórmulas ativas — confira o número atual no mesmo painel de pendências. | Confirmado direto no banco. |
| **Fotos de insumo com qualidade ou associação questionável.** | Pode haver fotos de matéria-prima que não representam bem o insumo. **Não confirmei pessoalmente, foto por foto** — registros internos do projeto apontam isso, mas eu não vistoriei as imagens uma a uma nesta sessão. **PENDENTE — verificar com o Diego.** | Não verificado por mim. |
| **Preço do carrinho pode ficar desatualizado por alguns instantes.** | O carrinho vive guardado no aparelho do próprio cliente e pode durar bastante tempo aberto; se o preço de uma fórmula mudar nesse intervalo, o orçamento final sempre é gerado com o preço mais atual do cadastro (isso está certo), mas a tela do carrinho, o PDF e o texto de WhatsApp de um orçamento já fechado não se atualizam sozinhos depois — não há hoje uma reconciliação automática desse tipo de divergência. | Confirmado no código (comportamento documentado como conhecido, não corrigido). |
| **Sem botão de reemitir/reenviar PDF de um orçamento já existente, dentro da área administrativa.** | Um pedido de "reenvia meu orçamento" precisa ser respondido manualmente (ver [seção 5](#5-perguntas-frequentes-e-problemas-comuns)) — a tela de detalhe do orçamento não tem essa opção hoje. | Confirmado lendo a tela por completo. |
| **Endereço final do site ainda não definido / site não publicado.** | O sistema está de pé e funcionando, mas só para uso e teste internos — ainda não está no ar num endereço que um cliente de fato acesse. | Este manual descreve o sistema em funcionamento hoje; a publicação depende de autorização do Diego. |

**Sobre os números de pendência de dado (ingredientes, advertências, foto, selo,
etc.):** eles têm data de validade curta — mudam a cada cadastro que a equipe
completa. Por isso, em vez de fixar aqui um número que ficaria errado em poucos dias,
a orientação deste manual é: **confie no painel "Pendências do cadastro" da tela de
Visão geral, sempre**. Ele foi feito para ser a fonte viva desse controle — atualizada
a cada consulta, nunca escrita à mão.
