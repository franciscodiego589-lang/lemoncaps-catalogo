# Design do catálogo — ilustrações de insumo e reorganização dos cards

Tarefa de design. Não altere composição, quantidades, nomes de produto nem textos.

## O problema

Os cards de produto são blocos de texto empilhados. Um produto com 21 constituintes, como o
BioPrincess, vira uma parede de linhas sem hierarquia, e o cliente não distingue o que
importa. Falta respiro, contraste e um elemento visual que identifique o produto de relance.

## O que fazer

### 1. Sistema de ilustrações de insumo

Crie um conjunto de **ícones vetoriais SVG inline**, monocromáticos, traço de 1,5 px, cantos
arredondados, desenhados no mesmo estilo entre si. Um ícone por família de constituinte:

| Família | Desenho | Onde aparece |
|---|---|---|
| Rizoma | rizoma de cúrcuma em corte | cúrcuma |
| Grão de café | grão com sulco central | café verde, cafeína anidra |
| Semente | semente alongada, três nervuras | feno-grego, guaraná, psyllium |
| Cítrico | meia laranja com gomos | laranja Moro, vitamina C |
| Raiz | raiz de chicória com radículas | inulina |
| Folha | folha de chá com nervura | L-teanina |
| Mineral | cristal hexagonal facetado | zinco, magnésio, selênio, cobre, cromo, boro, iodo |
| Vitamina | gota com a letra da vitamina dentro | A, D3, E, B2, B3, B5, B6, B9, B12, biotina |
| Aminoácido | cadeia de três elos | taurina, carnitina, arginina, metionina, cisteína, triptofano |
| Molécula | anel hexagonal com duas ligações | MSM, ácido hialurônico, silício orgânico, creatina |
| Fibra proteica | tripla hélice curta | colágeno hidrolisado |
| Lua | lua crescente | melatonina |

Regras do sistema:

- **um único traço, sem preenchimento**, na cor de acento do produto;
- todos os ícones desenhados na mesma caixa de 24 × 24, para alinharem entre si;
- nada de emoji, nada de imagem rasterizada, nada de biblioteca externa;
- se um constituinte não se encaixar em nenhuma família, use o ícone Molécula.

### 2. Onde as ilustrações entram

**No topo do card**, uma faixa horizontal com os **quatro ativos principais** do produto —
os de maior quantidade —, cada um com o ícone a 48 px e o nome curto embaixo, em duas
palavras no máximo. É o que identifica o produto de relance.

**Na tabela de composição**, o ícone a 24 px na frente do nome do ingrediente, na mesma
célula, com 8 px de respiro entre ícone e texto.

### 3. Reorganização do card

- A tabela de composição passa a ter **linhas zebradas**, com a coluna de quantidade
  alinhada à direita e em fonte tabular, para os números alinharem casa com casa.
- Acima de doze linhas, a tabela abre **recolhida nos oito primeiros itens**, com um botão
  "ver composição completa". O BioPrincess tem 21 linhas e é o caso que motiva isso.
- Os blocos **COMPOSIÇÃO POR DOSE**, **TABELA NUTRICIONAL** e **MODO DE USO** ganham um
  título com linha de base na cor de acento, e 24 px de espaço entre blocos.
- Cada produto tem uma **cor de acento própria**, usada nos ícones, nos títulos e na borda
  superior do card. Fundo do card sempre neutro — a cor entra só em detalhe.

### 4. Cor de acento por produto

| Produto | Acento |
|---|---|
| Pro Energy | #C1121F |
| BIOPRINCESS | #D94F72 |
| ZMA | #2B4C7E |
| BELLA GUMMY | #D6336C |
| Melatonina em Gumy | #1B2A5B |
| Serena | #23407A |
| Slim Up | #E07A1F |
| Detox Matinal | #2E5B1F |

### 5. Responsivo e legibilidade

- No celular, a faixa de ícones do topo passa de quatro colunas para duas.
- A tabela de composição nunca rola a página inteira na horizontal: ela rola dentro do
  próprio bloco.
- Contraste mínimo de 4,5:1 entre texto e fundo, inclusive nos nomes sob os ícones.
- Cada SVG leva `aria-label` com o nome do insumo, e a faixa de ícones é decorativa para
  leitor de tela — o conteúdo verdadeiro é a tabela.

## O que não fazer

**Nada de imagem que sugira resultado.** Sem corpo, sem barriga, sem fita métrica, sem
músculo, sem balança, sem antes e depois, sem pessoa dormindo, sem cabelo brilhando. Em
suplemento alimentar a imagem comunica tanto quanto a frase, e ilustração de efeito é
alegação de propriedade funcional — que só é permitida com texto aprovado e requisito de
composição atendido.

A regra é simples: **ilustre o ingrediente, nunca o efeito.**

Também não use:

- foto de cápsula, comprimido, jaleco, laboratório ou frasco de medicamento;
- fundo com gradiente forte atrás de texto;
- ícone diferente para o mesmo constituinte em produtos diferentes — o zinco é o mesmo
  cristal no Pro Energy e no Detox.
