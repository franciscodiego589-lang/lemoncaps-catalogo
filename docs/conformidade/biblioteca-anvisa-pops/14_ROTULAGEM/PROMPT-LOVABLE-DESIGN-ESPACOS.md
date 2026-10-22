# Design — eliminar o espaço vazio entre o conteúdo e o botão do card

Tarefa de design. Não altere composição, quantidades, nomes de produto nem textos de
apresentação.

## O problema

No grid, todos os cards de uma mesma linha assumem a altura do card mais alto, e o botão
"Cotar Fórmula" fica fixo no rodapé. Um produto com 21 ingredientes define a altura da
linha inteira, e os produtos com poucos ingredientes ficam com um vazio de várias centenas
de pixels entre o último bloco e o botão.

## A solução: preencher o vazio com conteúdo útil

Mantenha o alinhamento dos botões e ocupe o espaço com informação que hoje está escondida
ou ausente. Na ordem, dentro do card, depois de MODO DE USO:

### 1. Abrir os benefícios

O bloco "Benefícios" hoje é um botão fechado. Passe a exibi-lo **sempre aberto**, como uma
lista curta, com o ícone à esquerda de cada linha. É a informação que mais interessa a quem
está comparando produtos — não faz sentido escondê-la atrás de um clique.

### 2. Bloco de selos

Uma linha de etiquetas pequenas, discretas, com o que o produto tem de característico:
forma de apresentação, quantidade por embalagem, e quando aplicável "sem açúcares
adicionados", "não contém glúten", "sem lactose", "sabor". Estilo de chip com borda fina,
sem preenchimento chapado.

### 3. Tabela nutricional resumida

Quando houver espaço sobrando, mostre as três primeiras linhas da tabela nutricional com um
link "ver tabela completa". Hoje ela ocupa um bloco inteiro em alguns cards e falta em
outros.

### 4. Espaçador elástico com limite

Se ainda sobrar espaço depois disso, distribua o excedente **entre os blocos**, aumentando o
respiro de cada um proporcionalmente, em vez de acumular tudo num vão único antes do botão.
Limite o crescimento a 32 px por intervalo — passando disso, o card deve simplesmente
encurtar.

## Alternativa, se preferir cards de altura livre

Se a opção for deixar cada card com a altura do próprio conteúdo:

- no container do grid, use `align-items: start`, para que os cards não se estiquem;
- distribua os cards em **masonry de três colunas** no desktop, duas no tablet e uma no
  celular, para que as colunas fiquem com alturas parecidas;
- ordene os produtos de modo que os cards mais altos não caiam todos na mesma coluna;
- o botão "Cotar Fórmula" deixa de ficar alinhado entre cards vizinhos — é o custo dessa
  opção.

**As duas soluções não se combinam.** Escolha uma.

## Ajustes de espaçamento que valem em qualquer caso

- Espaço entre cards: 24 px no desktop, 16 px no celular.
- Espaço interno do card: 24 px, igual em todos os lados.
- Entre blocos internos (COMPOSIÇÃO, TABELA NUTRICIONAL, MODO DE USO, BENEFÍCIOS): 20 px.
- O botão "Cotar Fórmula" ocupa a largura do card, com 16 px de distância do bloco anterior.
- Nenhum intervalo vertical dentro do card deve passar de 40 px.

## O que não fazer

- Não estique a tabela de composição com linhas em branco para preencher altura.
- Não aumente a fonte para ocupar espaço.
- Não repita informação já mostrada em outro bloco do mesmo card.
- Não acrescente imagem de resultado, corpo, balança ou pessoa para preencher o vazio —
  vale a mesma regra do sistema de ilustrações: ilustre o ingrediente, nunca o efeito.
