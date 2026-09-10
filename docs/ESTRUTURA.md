# Catálogo Lemon Caps — Estrutura do Projeto

Documento único de planejamento do novo catálogo público da Lemon Caps. Consolida
o organograma do dono, os dados reais extraídos do site em produção, o desenho do
banco de dados e a linguagem visual escolhida. É a planta que guia a construção —
nenhuma tela é escrita antes deste documento ser aprovado.

Data: 2026-09-09.

---

## 1. Resumo executivo

O catálogo atual (`catalogo.lemoncaps.com.br`) foi feito na plataforma Lovable e roda
sobre um Supabase gerenciado por ela. Estamos reconstruindo do zero, saindo do Lovable,
com três objetivos:

1. **Dono do próprio código.** Projeto Next.js + Supabase próprio, sem depender de
   crédito nem de plataforma de terceiros.
2. **Visual de outro nível.** Linguagem "Liquid Glass" da Apple — a mesma que ela usa
   no iPhone e no Mac — aplicada com a técnica correta, não um vidro chapado genérico.
3. **Segurança que o sistema atual não tem.** Fecha o vazamento de margem de lucro
   descoberto durante o levantamento (detalhe na seção 7) e substitui a senha fixa no
   código por autenticação de verdade.

O comportamento é o mesmo do organograma que o dono desenhou: visitante navega o
catálogo, monta um pedido de potes (mínimo 100), copia o pedido ou baixa PDF, e fala
com o consultor no WhatsApp; um administrador gerencia catálogo, leads e orçamentos.

---

## 2. Stack e onde cada coisa vive

| Camada | Tecnologia | Observação |
|---|---|---|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript | Já criado em `~/Downloads/lemoncaps-catalogo` |
| Estilo | Tailwind CSS v4 + CSS próprio para o material de vidro | |
| Banco, Auth, Realtime | Supabase (PostgreSQL 17) | Projeto "Catalogo lemon" (`yyiykuffhuxaqiysgekv`), hoje vazio |
| Estado do cliente | Zustand | Carrinho e sessão de lead |
| Ícones e avisos | lucide-react, sonner | |
| Publicação | Vercel ou Netlify no domínio `catalogo.lemoncaps.com.br` | A definir |

O projeto Supabase de destino já existe e está saudável. As credenciais estão gravadas
em `.env.local` (fora do git), com a chave secreta separada da pública para nunca chegar
ao navegador.

---

## 3. Mapa de rotas e componentes

Baseado no organograma do dono e no que o site em produção realmente faz hoje.

### Rotas (App Router)

| Rota | O que é |
|---|---|
| `/` | Landing: jornada da marca, card "Escolha a categoria" que leva ao catálogo filtrado |
| `/catalogo` | Grade de cards, busca, filtro por segmento (chips), abas Premium/Básicas, ordenação |
| `/catalogo/[slug]` | Página individual da fórmula (novo — hoje o site não tem URL por produto) |
| `/carrinho` | Resumo do pedido, etapas, "Copiar Pedido", "Baixar PDF", link para o WhatsApp |
| `/admin` | Área administrativa, protegida por login de verdade |
| `/admin/catalogo` | Criar / editar / excluir fórmula; editor de composição |
| `/admin/leads` | Nome + WhatsApp + carrinho; busca; link WhatsApp; excluir |
| `/admin/orcamentos` | Editar quantidade e preço; margem e lucro em tempo real; histórico. Exige permissão extra |

### Componentes centrais

- **FormulaCard** — o cartão de fórmula: nome, segmento, descrição, tabela de composição
  por dose (aberta por padrão), modo de uso e informação nutricional, botão "Benefícios"
  (popup), botão "Dossiê Técnico" (painel com os textos técnicos que já existem — não é
  um PDF à parte), botão "Cotar Fórmula" (modal com quantidade de potes, mínimo 100).
- **SegmentChips** — filtro por segmento.
- **LineTabs** — abas Premium / Básicas.
- **CartSheet / CartSummary** — carrinho.
- **GlassBar, GlassButton, GlassModal, GlassChip** — os componentes de vidro reutilizáveis
  (ver seção 4).
- **CompositionTable** — a tabela de composição por dose, sólida e legível (ver seção 4).

---

## 4. Design system — Liquid Glass aplicado com a técnica certa

O pedido é o visual "Liquid Glass" da Apple. O levantamento das fontes primárias (as
Human Interface Guidelines da Apple e as sessões da WWDC 2025) trouxe uma regra que muda
o desenho ingênuo de "vidro em tudo", e que é melhor seguir do que descobrir na prática:

**A própria Apple diz para NÃO usar vidro na camada de conteúdo e para NÃO empilhar vidro
sobre vidro.** Um card de produto com uma tabela de composição dentro é camada de conteúdo.
Além disso:

- `backdrop-filter` (o efeito de vidro) repetido em dezenas de cards, rolando no celular,
  é o caso com travamento de rolagem documentado.
- Texto pequeno e denso sobre vidro chega a 1,5:1 de contraste medido no próprio Liquid
  Glass nativo — a norma de acessibilidade (WCAG) exige 4,5:1. A tabela de composição é
  exatamente texto pequeno e denso.
- A refração de verdade (filtro SVG) não roda no Safari do iPhone, que é onde a maioria
  dos clientes vai abrir.
- Vidro sobre fundo branco liso não refrata nada — o efeito simplesmente desaparece.

### A estratégia: vidro no cromo, sólido no conteúdo

É exatamente o que a Apple faz no iPhone. O material de vidro fica nos elementos de
navegação e ação, que flutuam sobre o conteúdo; o conteúdo em si é sólido e legível.

**Recebe Liquid Glass de verdade** (borda especular, material que reage ao que passa
por baixo, adaptação claro/escuro):
- Barra de topo (logo, busca, carrinho).
- Chips de segmento e abas Premium/Básicas.
- Botão flutuante do carrinho.
- Modais "Benefícios" e "Cotar Fórmula".

**Fica sólido, elevado por sombra** (nunca vidro):
- O card da fórmula.
- A tabela de composição por dose.
- Qualquer texto denso.

**O fundo** que faz o vidro funcionar: um gradiente vivo, com cor variando por segmento
(cada categoria com seu tom), dando ao vidro algo real para refratar. Nada de branco liso.

### Acessibilidade (obrigatória)

- Respeitar `prefers-reduced-transparency` e `prefers-contrast` onde o navegador suporta,
  e oferecer um controle manual de "reduzir efeitos" no próprio site, porque o Safari do
  iPhone não respeita essas preferências sozinho.
- Todo texto sobre qualquer superfície passa em 4,5:1 de contraste.

O resultado tem cara de iPhone e continua legível e rápido com 29 fórmulas na tela,
inclusive no celular.

---

## 5. Banco de dados

Desenho completo em `../lemoncaps-catalogo-planejamento/schema.sql` (estrutura),
`rls-policies.sql` (quem acessa o quê) e `schema-notas.md` (decisões e porquês). Resumo:

### Tabelas

| Tabela | Papel |
|---|---|
| `segments` | Segmentos do catálogo (chips de filtro) |
| `formulas` | O catálogo público — só dados públicos, nenhum número financeiro interno |
| `formula_compositions` | Composição por dose: insumo + quantidade numérica + unidade, uma linha por insumo |
| `formula_costs` | Custo real de produção e notas internas — tabela **100% privada**, o público nunca acessa |
| `staff_profiles` | Quem é admin e quem enxerga margem (substitui a senha fixa "0212") |
| `leads` | Nome + WhatsApp + retrato do carrinho de quem converteu (dado pessoal, LGPD) |
| `quotes` / `quote_items` | Orçamentos gerados; margem e lucro são calculados pelo próprio banco |
| `audit_logs` | Trilha de auditoria de tudo — alimenta o "histórico de alterações" do orçamento |

### Três decisões que sustentam o resto

1. **Dinheiro em centavos (número inteiro), não decimal.** Toda conta de preço, custo e
   margem fica em aritmética inteira até a única divisão (o percentual), que roda dentro
   do Postgres. O erro de ponto flutuante que o dono exige evitar fica impossível por
   construção.
2. **Preço público separado do custo real, em tabelas diferentes.** É o que corrige o
   vazamento do sistema atual (seção 7) e o que permite a aba Orçamentos calcular margem.
   **Esta é a decisão que mais precisa do aval do dono** — ver seção 8.
3. **Margem e lucro são colunas geradas pelo Postgres**, recalculadas no banco a cada
   alteração. Nunca dependem de o front acertar a conta, e ficam em branco (nunca "0%"
   inventado) enquanto o custo real não for cadastrado.

---

## 6. Dados reais já levantados

Extraídos da fonte primária (a tabela `formulas` do banco em produção), não digitados à mão:

- **29 fórmulas** — 22 Premium, 7 Básicas.
- **8 segmentos com produto** (Emagrecimento 8, Energia 7, Beleza 6, Sono 3, Imunidade 2,
  e um cada de Articulações, Foco, Digestivo) + 2 no filtro sem produto hoje (Libido, Pele).
- **Formatos**: cápsula, solúvel, gummy, pó, líquido, softgel.
- **Preço por pote** de R$ 8,90 a R$ 43,00; pedido mínimo sempre 100 potes.
- **228 ingredientes** já separados em insumo + quantidade + unidade, com a vírgula
  decimal conferida um a um (nenhum "16,7" virou "167").

Arquivos: `dados-catalogo-atual.json`, `composicao-estruturada.json` na pasta de
planejamento.

### Dois pontos que exigem revisão do dono antes de publicar

- **"LIDEMA"** parece rascunho: criado e nunca mais editado, preço R$ 0, quase tudo vazio.
  Entra como inativo até o dono confirmar se é produto de verdade.
- **Iodo e selênio** aparecem com o mesmo número mas unidades diferentes em produtos
  distintos (`mg` num, `mcg` noutro). 150 mg de iodo seria dose absurda — cheira a erro
  de digitação `mg`×`mcg` no cadastro antigo. O dado foi transcrito fiel ao original e
  marcado para conferência; não foi "consertado" por conta própria.

---

## 7. Segurança — o que este projeto corrige do atual

Durante o levantamento, a leitura da fonte primária expôs dois problemas reais no
sistema atual (que continua no ar, na plataforma Lovable):

1. **Margem de lucro vazando.** A tabela pública do catálogo atual tem uma coluna de
   anotações onde a margem de lucro foi escrita em texto livre ("margem de 22,8%"). Ela
   não aparece em tela, mas está na mesma tabela que qualquer visitante lê com a chave
   pública embutida no site. Confirmado: **9 das 29 fórmulas expõem a margem** a quem
   abrir as ferramentas de desenvolvedor do navegador.
2. **Senha de administrador no código do navegador.** A senha "0212" é validada no
   front-end, o que significa que ela trafega para qualquer visitante.

No projeto novo:
- Custo e margem vivem numa tabela que o público **não tem nem permissão de ler** — não é
  só uma regra, é ausência de permissão. O tipo de vazamento fica impossível de repetir
  por engano.
- Administração passa por login de verdade (Supabase Auth); nenhuma senha no código do
  cliente.
- A autorização mora no banco (RLS), não em esconder botão na tela.

**Recomendação separada (sistema atual):** vale fechar a permissão de leitura pública do
catálogo antigo enquanto ele estiver no ar, porque os leads (nome e WhatsApp de clientes)
podem estar igualmente expostos. Esse projeto antigo está em outra conta Supabase, não na
mesma do catálogo novo.

---

## 8. Decisões que dependem do dono

Estas mudam a estrutura ou o que vai ao ar, então são perguntadas antes de construir:

1. **Foto de produto.** Nem o organograma nem o site atual têm foto de produto. Para o
   visual Liquid Glass isso importa muito: com foto, o vidro repousa sobre a imagem do
   produto; sem foto, cada segmento ganha um gradiente de cor próprio (também bonito, e o
   caminho seguro para e-commerce). Precisa haver foto?
2. **Preço × custo (a decisão de maior impacto).** Hoje existe UM número por pote (o preço
   público). O desenho novo cria DOIS: preço público (todos veem) e custo real de produção
   (só staff, para calcular margem). Está certo separar? Ou o número que o cliente vê já é
   o mesmo que a Lemon Caps usa internamente, sem segredo de custo?
3. **LIDEMA** é produto de verdade ou rascunho para descartar?
4. **Começar zerado ou migrar histórico.** As 29 fórmulas vêm migradas. Existem leads e
   orçamentos antigos no sistema atual que precisam vir junto, ou o novo começa zerado
   nessas duas tabelas?
5. **Retenção de leads (LGPD).** Por quanto tempo guardar nome/WhatsApp de um lead sem
   contato antes de anonimizar? (decisão de negócio, não técnica)
6. **Nomes exatos** dos segmentos "Libido" e "Pele" (não há produto hoje para conferir).

---

## 9. Plano de construção (depois do aval)

Ordem proposta, em fases entregáveis:

1. **Fundação** — aplicar o schema no Supabase da Lemon Caps, ligar o cliente Supabase no
   Next, criar o design system de vidro (tokens, componentes Glass base).
2. **Migração dos dados** — script revisado que carrega as 29 fórmulas + 228 ingredientes,
   com relatório de conferência antes do INSERT (LIDEMA inativo, iodo/selênio sinalizado).
3. **Catálogo público** — `/catalogo`, FormulaCard, filtros, busca, página por fórmula.
4. **Carrinho** — montagem do pedido, mínimo 100 potes, copiar pedido, PDF, WhatsApp.
5. **Landing** — `/`, jornada da marca.
6. **Admin** — login, gestão de catálogo, leads e orçamentos (com margem em tempo real).
7. **Acessibilidade e desempenho** — controle de "reduzir efeitos", conferência de
   contraste, teste no Safari do iPhone.
8. **Publicação** — deploy no domínio.
