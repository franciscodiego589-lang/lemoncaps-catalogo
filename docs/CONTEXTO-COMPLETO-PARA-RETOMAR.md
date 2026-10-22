# Catálogo Lemon Caps — contexto completo para retomar

> **Para o Claude que está lendo isto:** este documento é o repasse integral de um
> trabalho em andamento. Ele é autossuficiente — assuma que você não tem nenhum
> outro contexto além do que está aqui. Leia inteiro antes de tocar em qualquer
> arquivo. As regras da seção 2 são invioláveis e valem a partir da sua primeira
> resposta.
>
> Documento escrito em **14/09/2026**. O projeto está aberto, funcionando e **não
> publicado**.

---

## 1. O que é este projeto

Catálogo público de fórmulas da **Lemon Caps**, indústria de suplementos
alimentares e nutracêuticos de Cuiabá-MT, com área administrativa. Substitui um
catálogo anterior feito na plataforma Lovable.

O site tem duas faces:

- **Pública**: a home apresenta a fabricação em marca própria (private label), o
  `/catalogo` lista as fórmulas com composição, preço e dossiê técnico, e o
  visitante monta uma cotação no carrinho e recebe um orçamento em PDF.
- **Administrativa** (`/admin`): cadastro de fórmulas, insumos, custos, orçamentos
  e leads.

**Caminho do projeto:** `/Users/diegofrancisco/Downloads/lemoncaps-catalogo`

**Dono do projeto:** Diego. Toda decisão de negócio, de dado regulatório e de
publicação é dele.

**Dados da empresa** (já cadastrados, conferidos):
- Razão social: Lemoncaps Indústria Comércio LTDA
- CNPJ: 55.836.075/0001-07
- Endereço: Rua Érico Veríssimo, Quadra 05, Lote 10, Santa Cruz, Cuiabá - MT, CEP 78068-190
- Farmacêutico responsável: Anderson C. Barbosa - CRF/MT 5526
- SAC: sac@lemoncaps.com.br

---

## 2. AS REGRAS — leis do projeto, não preferências

### 2.1 Idioma (regra e lei)

Responda **sempre em português do Brasil**, com acentuação correta — toda mensagem,
explicação, pergunta, opção de escolha e comentário. **O dono não lê inglês.**
Nunca escreva uma pergunta ou um menu de opções em inglês. A primeira palavra de
toda resposta já deve estar em português.

Permanecem no original apenas identificadores de código, comandos, caminhos de
arquivo e termos técnicos consagrados. Texto visível ao usuário final do site
também é em português do Brasil.

### 2.2 Exatidão (a regra acima de todas as outras)

> **NUNCA SUPONHA. NUNCA ACHE. NUNCA ENTREGUE NADA COM DÚVIDA OU ACHISMO.
> LEIA, CONFIRA, RECONFIRA — E SÓ ENTÃO RESPONDA.**

Este catálogo publica **composição de suplemento alimentar**: insumo, quantidade,
unidade, modo de uso e alegações. Número errado aqui não é defeito de software — é
desvio regulatório perante a ANVISA, e custa lote parado e credibilidade.

Na prática:

1. **Vá à fonte primária e vigente.** Não responda de memória nem de fonte
   secundária quando a primária existe. Para norma da ANVISA, a fonte é o
   **AnvisaLegis** (`anvisalegis.datalegis.net`), que mostra o texto consolidado e
   o selo de vigência — nunca PDF compilado, blog ou resumo.
2. **Reconfira antes de afirmar.** Leia o valor duas vezes, na fonte, e refaça a
   conta.
3. **Marque a procedência** de todo dado sensível: de onde veio e em que data foi
   consultado. Dado não confirmado nasce marcado como **PROVISÓRIO**, por escrito,
   ao lado do próprio número.
4. **Pare quando a conclusão depender de dado não confirmado.** Não conclua e avise
   depois: pergunte antes.
5. **Nunca preencha lacuna com valor plausível.** Escreva `NÃO CONFIRMADO` ou
   "PENDENTE — depende de X". Campo vazio não vira "não informado".
6. **Não afirme limitação sem testar.** Antes de dizer "não consigo acessar",
   tente de verdade e relate o que aconteceu (inclusive o código de erro).
7. **Distinga sempre** o que foi lido na fonte, o que foi calculado e o que foi
   assumido. Nunca apresente os três com a mesma confiança.

**Por que esta regra existe:** o dono afirmou certa vez que o limite máximo de
creatina era 3.000 mg, extraído de um PDF consolidado parado numa IN antiga, e
concluiu que um produto de 5.000 mg estava acima do teto e devia ser bloqueado. O
painel oficial e atualizado da ANVISA traz **5.000 mg** — o produto estava
conforme. O número existia na fonte lida; a fonte é que estava velha. Um erro
desses, num documento que vai para a vigilância sanitária, custa caro.

### 2.3 Publicação (ordem expressa do dono)

> **"nada de deploy sem antes eu autorizar"**

Nada de deploy, nada de publicar, nada de trocar DNS sem o "pode subir" dele, na
hora. Prepare tudo e **pare**. Isso vale também para qualquer escrita em banco de
produção que mude o que o cliente vê.

### 2.4 Git

**Não commite sem o dono pedir.** Em 14/09/2026 ele pediu explicitamente para não
commitar ainda. Há 73 arquivos alterados sem commit — ver seção 7.

### 2.5 graphify — consultar antes, atualizar depois

O projeto é indexado num grafo de código (`graphify-out/`), que mostra **quem
depende de quem** — coisa que o `grep` não mostra.

```bash
export PATH="$HOME/.local/bin:$PATH"   # o binário vive aqui e some do PATH às vezes
graphify query "<o assunto que vou mexer>"     # subgrafo do tema
graphify explain "<função/tabela/arquivo>"     # o nó e a vizinhança dele
graphify path "<A>" "<B>"                      # como dois pontos se ligam
```

Consulte **antes** do `grep`, antes do `Read` e antes da primeira edição. Se a
consulta não devolver nada útil, aí sim siga com `grep`/`Read`.

Depois de alterar código: `graphify update .` (roda em segundos, é AST local, não
gasta API). Grafo desatualizado é pior que grafo nenhum, porque quem consulta
confia nele.

---

## 3. Stack e comandos

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Estilo | Tailwind CSS v4 + CSS próprio (efeito "Liquid Glass") |
| Banco, Auth | Supabase (PostgreSQL + RLS) |
| Estado do cliente | Zustand (carrinho e sessão de lead) |
| PDF | jspdf + jspdf-autotable |
| Ícones e avisos | lucide-react, sonner |

**Comandos canônicos — use exatamente estes, não invente variações:**

| O quê | Comando |
|---|---|
| Instalar dependências | `npm install` |
| Lint | `npm run lint` |
| Checagem de tipos | `npx tsc --noEmit` |
| Build de produção | `npm run build` |
| Servidor de produção | `npm start` (depois do build), em `http://localhost:3000` |
| Servidor de desenvolvimento | `npm run dev` |

Não há teste automatizado no projeto. A recomendação é Vitest.

**Login do admin:** `tech@lemoncaps.com.br`

### O banco

O banco é **exclusivo deste projeto** — projeto Supabase chamado **"Catalogo lemon"**.

> **ARMADILHA GRAVE:** o servidor **MCP do Supabase** configurado nesta máquina
> aponta para **outro sistema** (um ERP de clínica de estética). **Nenhuma
> migration deste catálogo pode ser aplicada por ele.** Se você usar o MCP para
> rodar SQL, vai escrever no banco errado.
>
> Para aplicar migration, use a **Management API**, confirmando antes o nome do
> projeto:
> ```bash
> set -a; source .env.local; set +a
> curl -s "https://api.supabase.com/v1/projects/$SUPABASE_PROJECT_REF" \
>   -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN"   # deve dizer "Catalogo lemon"
> ```
> e então `POST /v1/projects/{ref}/database/query` com `{"query": "<sql>"}`.
>
> Para **ler** dados, a REST API com a chave secreta resolve:
> ```bash
> curl -s "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/<tabela>?select=..." \
>   -H "apikey: $SUPABASE_SECRET_KEY" -H "Authorization: Bearer $SUPABASE_SECRET_KEY"
> ```

As credenciais estão em `.env.local` na raiz do projeto (`NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`,
`SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_REF`). **Nunca imprima o valor dessas
chaves em resposta, log ou relatório.**

### Regras de dados

- Composição guarda **quantidade numérica e unidade em campos separados**. Nunca
  texto solto. Unidades aceitas: `g`, `mg`, `mcg`, `ml`, `L`, `UI`, `kg`.
- A entrada aceita decimal com vírgula (padrão brasileiro) e converte antes de gravar.
- Pedido mínimo do catálogo: **100 potes**.
- Valores monetários nunca usam ponto flutuante binário para cálculo de margem.
- Exclusão é **lógica** (`deleted_at`), nunca física. Toda leitura pública filtra
  excluídos.

### Segurança

- **Nenhuma senha no código do cliente.** O sistema anterior usava a senha fixa
  `0212` validada no front; isso não se repete. Administração passa por Supabase Auth.
- A chave `service_role` nunca chega ao browser, nem em variável `NEXT_PUBLIC_*`,
  nem em Server Component que serialize props.
- Autorização vive em RLS no banco, não em condicional de interface. Esconder botão
  não é controle de acesso.
- Leads guardam nome e WhatsApp de pessoas reais: dado pessoal sob LGPD.

### Convenções de código

- Componentes e tipos em `PascalCase`; funções e variáveis em `camelCase`;
  constantes em `UPPER_SNAKE_CASE`; booleanos com prefixo `is`, `has`, `should`, `can`.
- Arquivos pequenos e coesos, por domínio. Regra de negócio em função pura,
  separada do componente que a exibe.
- Sem mutação de objeto existente: cria-se cópia nova.
- Erro tratado explicitamente, com mensagem compreensível para quem está na tela.
- Nada de `console.log` esquecido.
- O projeto **documenta a decisão dentro do próprio código** — comentários longos,
  em português, explicando o *porquê* (inclusive migrations). Siga esse estilo.

---

## 4. Estrutura

```
app/
  page.tsx              → home: fabricação em marca própria (a porta de entrada)
  catalogo/             → /catalogo, /catalogo/[slug] (dossiê), .../beneficios
  documentacao/         → /documentacao (normas da ANVISA que a fábrica segue)
  carrinho/             → carrinho e fechamento da cotação
  admin/                → área administrativa (dashboard, catálogo, custos,
                          insumos, orçamentos, leads)
  login/
components/
  manufacturing/        → seções da home (herói, números, formatos, processo…)
  catalog/              → grade, card de fórmula, barras de topo
  cart/                 → carrinho, formulário do cliente, tela de sucesso
  admin/                → tabelas e formulários do admin
  glass/                → superfície de vidro reaproveitada
  home/                 → barra de topo e rodapé (alguns arquivos órfãos, ver 7.3)
lib/
  catalog/              → regulatory-info.ts (normas), featured.ts, gtin.ts,
                          packaging.ts, manufacturing-stats.ts, dossie-pdf.ts
  data/                 → acesso ao banco (formulas, admin, quotes, ingredientes)
  cart/                 → carrinho, snapshot da cotação, PDF e texto do orçamento
  pdf/                  → formula-sections.ts (seções compartilhadas), layout, tema
  actions/              → Server Actions (fórmulas, custos, aprovação de ficha)
  supabase/             → clientes e tipos gerados
supabase/migrations/    → fonte da verdade do schema (18 migrations)
docs/                   → estado, conformidade, estrutura
graphify-out/           → grafo do código (artefato derivado, não versionar)
```

**Rotas geradas no build (72 páginas):** `/`, `/catalogo`, `/catalogo/[slug]` (27
produtos), `/catalogo/[slug]/beneficios`, `/documentacao`, `/carrinho`, `/login`,
`/admin/*`. A rota `/fabricacao` **não existe mais** — virou redirecionamento 308
para `/`, configurado em `next.config.ts`.

---

## 5. O que está pronto e funcionando

Verificado em 13-14/09/2026 no código, no banco e na tela renderizada.

### Saúde do projeto
- `npx tsc --noEmit`: **0 erros**
- `npm run lint`: **0 erros** (3 avisos, todos em `.claude/hooks/verify-on-stop.mjs`, fora do app)
- `npm run build`: **exit 0**, 72 páginas

### Porta de entrada
A home (`/`) é a página de fabricação em marca própria. O caminho para o catálogo
aparece em quatro pontos: barra fixa do topo, herói, meio da página e rodapé. O
item "Fabricação" saiu de todos os menus; nas telas internas, a marca no topo virou
o link para `/`. Todos os números da home saem do banco em tempo real (27 fórmulas,
4 formatos, 70 matérias-primas, lote mínimo de 100 potes) — nenhum digitado no JSX.

### Documentação regulatória (`/documentacao`)
Declaração institucional em três afirmações (limites mínimos e máximos respeitados,
legislação sanitária vigente, responsável técnico farmacêutico). Hierarquia correta:
as Resoluções (RDC) vêm primeiro e as Instruções Normativas (IN) depois,
subordinadas — porque a RDC estabelece requisitos e a IN detalha. O detalhe de
"qual IN incluiu qual insumo" foi removido a pedido do dono, e não só da tela: o
tipo `RegulatoryAmendment` não tem mais campo para guardá-lo.

Nenhuma certificação (BPF, GMP, ISO, HACCP), licença ou AFE é afirmada ou sugerida
— ausência deliberada, porque nenhuma está confirmada em documento.

### Orçamento em PDF
Documento técnico completo: por produto cotado, identificação, composição por dose,
informação nutricional, ingredientes, modo de uso, benefícios, público-alvo,
advertências, conservação e conformidade. Os blocos institucionais aparecem uma vez
só, no fim. As seções vivem em `lib/pdf/formula-sections.ts` e são usadas pelo
dossiê **e** pelo orçamento — os dois documentos não podem divergir.

### Tela de sucesso do orçamento — o defeito do F5, corrigido
O retrato da cotação é gravado em `sessionStorage` (chave
`lemoncaps-quote-success`), com o número do orçamento na URL como marcador e
validade de 2 horas. É gravado **antes** de o carrinho ser esvaziado e lido na
montagem do componente, então recarregar a página devolve número, itens e os três
botões (copiar, PDF, WhatsApp). Não sobrevive a outra aba nem a fechar o navegador
— deliberado, para não deixar nome e telefone gravados no aparelho. Todas as
operações de storage estão em `try/catch`.

### Destaque de produtos
Coluna `featured_at` em `formulas` (NULL = não é destaque), com índice parcial.
Botão no admin via Server Action com dupla trava (sessão de staff na ação + RLS no
banco); a data é sempre calculada no servidor, para ninguém antedatar e furar a
fila. Limite de `max(3, um terço das ativas)` — hoje 9 — que **avisa sem bloquear**.
Ordenação da vitrine: `featured_at desc nulls last, sort_order asc, name asc`.
Selo com ícone **e** texto (nunca só cor), contraste ≈15:1.
Hoje **nenhum** produto está marcado como destaque.

### Custos em lote
Tela única em `/admin/custos`, todas as fórmulas de uma vez, margem calculada ao
vivo em reais e em percentual. Aceita "8,50", "12", "1.234,56". Campo vazio
continua nulo, nunca zero.

### Pacote técnico e assinatura de ficha
Doze campos de embalagem e logística (EAN-13, DUN-14, validade, pesos, dimensões) e
a tabela `formula_sheet_approvals`. Duas travas que valem lembrar:
- EAN/DUN inválido é **barrado no banco**, por função que implementa o algoritmo da
  GS1. E os dois são únicos.
- **Aprovação não se edita nem se apaga** — não existe permissão de UPDATE nem
  DELETE, nem para usuário autenticado. Aprova-se de novo. Histórico editável não
  prova nada em auditoria.

Todos os campos estão vazios: quem preenche é a fábrica.

### Vocabulário padronizado
O documento é **orçamento** (não "proposta" nem "pedido"); a ficha é **dossiê
técnico** (não "ficha técnica"). "Cotação" foi mantido de propósito: em B2B,
cotação é o processo e orçamento é o documento.

---

## 6. O marco regulatório — conferido na fonte oficial

Todas as normas citadas no site foram conferidas em 13-14/09/2026 no **AnvisaLegis**.

**Vigentes** (são as citadas em `/documentacao`):

| Norma | O que rege |
|---|---|
| RDC 243/2018 | requisitos sanitários dos suplementos — a norma-mãe da categoria |
| RDC 843/2024 | como o produto entra legalmente no mercado |
| RDC 727/2022 | rotulagem, incluindo declaração de alergênicos |
| RDC 429/2020 | rotulagem nutricional |
| RDC 778/2023 | aditivos alimentares |
| RDC 725/2022 | aromatizantes |
| IN 28/2018 | listas de constituintes, limites de uso e alegações — **consolidada até a IN 450/2026, de 10/06/2026** |
| IN 281/2024 | forma de regularização |
| IN 75/2020 | rotulagem nutricional (detalha a RDC 429/2020) |
| IN 211/2023 | aditivos — **consolidada até a IN 466/2026, de 20/08/2026** |

A RDC 243/2018 está **vigente**, com o parágrafo único do art. 11 revogado pela
RDC 843/2024.

**Revogadas — não citar como vigentes:**
- **RDC 240/2018** e **RDC 27/2010** — revogadas pela RDC 843/2024, desde 01/09/2024.
- **RDC 26/2015** (alergênicos) — revogada pela RDC 727/2022.

O regime atual: suplemento alimentar é **dispensado de registro**, mas sujeito a
**notificação** junto à ANVISA antes de ser ofertado (RDC 843/2024 + IN 281/2024).

---

## 7. Estado atual — o que está no meio do caminho

### 7.1 O episódio do selo de conformidade (resolvido em 14/09, com ressalva)

O catálogo exibe o selo **"Composição conferida"** por produto. Quem pode ter esse
selo é definido por migration, com autocheck que aborta se a contagem não bater:

- `20260914000000_conformidade.sql` → 10 fórmulas
- `20260915140000_conformidade_laudos.sql` → mais 4 (total **14**)

A primeira registra a decisão que originou tudo: *"o dono pediu para publicar no
catálogo 'todos os produtos estão dentro dos limites da ANVISA'. Isso foi RECUSADO
por ser falso"*. O acordo foi selo por produto, só nos 100% conformes.

**O que tinha acontecido:** em 13/09 às 15:54:28 UTC, um UPDATE em massa feito por
fora do aplicativo (chave de serviço, autor nulo na auditoria) carimbou 19 fórmulas
de uma vez. Efeito duplo: **9 fórmulas ganharam selo sem lastro** e as **10
legítimas perderam a procedência** (data e arrays de normas específicos por fórmula
trocados por texto genérico).

As 9 estão nominalmente listadas no documento de auditoria
(`lemoncaps-catalogo-planejamento/conformidade-anvisa.md`, seção 6) entre as que têm
"pelo menos um insumo NÃO VERIFICADO" — o grupo que não deveria receber selo.

**Corrigido em 14/09**, com autorização expressa do dono, pela migration
`20260917000000_corrige_selo_conformidade.sql`, já **aplicada**: 23 selos → **14**,
procedência restaurada, e a inconsistência residual do Pré-treino Césio 137
(normas preenchidas sem selo) eliminada. Backup do estado anterior em
`~/Downloads/lemoncaps-BACKUP-conformidade-20260914.json`.

**A ressalva que continua aberta:** as normas gravadas naquele UPDATE **existem e
estão corretas** (IN 450/2026 e IN 466/2026 foram confirmadas no AnvisaLegis como as
alterações mais recentes). Quem rodou aquilo consultou fontes reais e atualizadas.
O que não existe é **registro da análise**. Então a pergunta para o dono é: *aquela
reconferência aconteceu de verdade?* Se aconteceu, os nove podem voltar a ter selo
— mas por uma migration que registre análise, fonte e data, como as duas anteriores
fizeram.

**Dois casos são indefensáveis em qualquer cenário:** **Ômega Pró TG** e
**Melatonina + Triptofanos** tinham selo de composição conferida e têm **lista de
ingredientes e advertências vazias** no cadastro. Não se confere o que não está
declarado.

### 7.2 Norma revogada citada ao público (pendente de decisão)

A frase **"Produto dispensado de registro conforme RDC nº 240/2018."** aparece no
rodapé de fabricante do dossiê de **cada um dos 27 produtos** e no PDF do orçamento.
A RDC 240/2018 está revogada desde 01/09/2024.

A frase é transcrição literal dos Dizeres de Rotulagem impressos, e o código
documenta isso: é reproduzida como dado de rótulo, nunca como afirmação da empresa
sobre norma vigente. A `/documentacao` não a contém e apresenta o regime correto.

**Não altere isso por conta própria.** Mudar o texto só no site criaria divergência
com o rótulo físico impresso, o que é pior. É decisão do dono com o farmacêutico
responsável.

### 7.3 Trabalho não commitado — risco real

**73 arquivos alterados sem commit** (39 modificados, 34 novos). Último commit:
`e51a73b`, de 13/09 às 12:59, na branch `main`. Um `git clean` ou descarte de
alterações leva tudo.

O dono pediu em 14/09 para **não commitar ainda**. Não commite sem ele mandar.

Entre os arquivos novos não versionados: `app/documentacao/`,
`components/manufacturing/`, `lib/cart/quote-snapshot.ts`, `lib/catalog/featured.ts`,
`lib/pdf/formula-sections.ts`, `lib/data/ingredient-bank.ts`, as três migrations mais
recentes e 8 imagens de produto.

**Arquivos órfãos preservados de propósito** (não apague): `components/home/Hero.tsx`,
`HowItWorks.tsx`, `ProofStats.tsx` e `components/manufacturing/MinimumBatch.tsx`
ficaram sem rota ativa quando a home virou a página de fabricação. Foram mantidos
por ordem do dono.

### 7.4 Estado do banco (conferido em 14/09)

| item | estado |
|---|---|
| fórmulas | 28 (27 ativas + 1 com exclusão lógica documentada) |
| fórmulas com selo de conformidade | **14** (o correto) |
| orçamentos | 9 (4 ativos, 5 com exclusão lógica e motivo registrado) |
| leads | 13 (4 ativos, 9 com exclusão lógica) |
| custos preenchidos | **0** de 28 |
| assinaturas de ficha técnica | **0** — vazio, como deveria |
| EAN-13 / DUN-14 preenchidos | **0** — vazio, como deveria |
| produtos em destaque | **0** |
| insumos | 70 |
| composições | 213 |

Os 4 orçamentos e 4 leads ativos estão em nome do próprio dono, criados em 13/09,
sem rótulo de teste — precisam de confirmação dele. O rastro de teste mais antigo
(cerca de 40 registros) já foi apagado fisicamente e não existe mais.

Observação: a exclusão lógica de `quotes` não se propaga para `quote_items`. Hoje
não vaza em relatório, porque a view `quote_summaries` filtra pelo registro pai.

---

## 8. O que depende de decisão do dono

Em ordem de urgência. **Nada disso deve ser decidido por você sozinho.**

1. **A reconferência dos 9 produtos** (seção 7.1): aconteceu de verdade? Se sim,
   documentar em migration própria; se não, fica como está.
2. **A frase da RDC 240/2018** (seção 7.2), com o responsável técnico.
3. **Commitar o trabalho** (seção 7.3).
4. **Seis produtos sem lista de ingredientes e sem advertências** — lacuna
   regulatória: Creatina Tutti-Frutti, Creatina Frutas Vermelhas, Creatina 300 g,
   Melatonina + Triptofanos, Melatonina em Gummy e Ômega Pró TG.
5. **A grafia: monoidratada ou monohidratada.** O cadastro usa uma, os rótulos
   impressos usam a outra. Uma correção automática chegou a ser cancelada por causa
   disso. Recomendação: seguir o rótulo.
6. **Custos: 28 linhas, nenhuma preenchida.** Sem isso, todo orçamento exporta
   "lucro desconhecido". A ferramenta de lançamento em lote já existe.
7. **As 68 fotos de insumo** em `public/insumos/`: licença correta, mas associação
   frouxa e imprópria para catálogo industrial — L-triptofano é uma foto caseira de
   peru numa travessa de ceia; melatonina é uma cerejeira num quintal com sacos de
   entulho; sucralose é um ímã; ferro é uma caixa de ovos; cálcio é uma loja de
   queijos; ácido hialurônico e extrato de café verde usam a mesma imagem; o
   psyllium mostra a embalagem de outra marca, com o logotipo visível. Remover ou
   substituir.
8. **Três pares premium × básica são o mesmo produto**, confirmado insumo a insumo:
   Slim Up EMAGRECIMENTO (R$ 12,80) × Slim Up Emagrecedor (R$ 16,10); ZMA Night
   (R$ 13,80) × ZMA (R$ 16,50); Biotina em Cápsula (R$ 8,90) × BioPrincess
   (R$ 13,90). **Os três pares apontam para o mesmo arquivo de foto** — o cliente vê
   o mesmo pote com dois preços. No par da biotina, o registro **mais caro é o
   errado**. Unificar, e decidir se a divisão em linhas continua existindo.
9. **Peso impossível**: Slim Up com `net_weight` de "0,45g" num frasco de 30 mL.
10. **O caso do Pré-treino Césio 137** (seção 9), com o responsável técnico.
11. **Os 4 orçamentos e 4 leads** em nome do dono (seção 7.4).
12. **Preço do carrinho × preço do banco** (pré-existente): o carrinho vive em
    `localStorage` e pode durar dias; a RPC relê o preço do banco ao gerar o
    orçamento. Se o preço mudar nesse intervalo, o banco grava o novo e a tela, o
    PDF e o texto de WhatsApp mostram o antigo, sem reconciliação.
13. **Falta a foto** da Creatina em Gummy Tutti-Frutti (26 de 27 têm). Pote de goma
    é transparente e a cor da goma denuncia o sabor — a foto disponível tem goma
    vermelha, de frutas vermelhas.
14. **Dados que faltam para a home vender**: prazo de produção, capacidade mensal,
    certificações (nenhuma confirmada em documento) e autorização para citar as
    marcas atendidas.

---

## 9. Parecer regulatório em aberto — Pré-treino Césio 137

Nome no cadastro: **"Pré-treino + Creatina Sabor Limão (420 g)"**. Parecer emitido
contra o rótulo oficial da gráfica:

- **Cafeína provavelmente acima do teto.** Os 200 mg de cafeína anidra já esgotam
  100% do limite; o extrato de guaraná (515 mg) é, pelo Anexo I, outra fonte do
  **mesmo nutriente regulado**. O valor exato depende do laudo do fornecedor.
- **Beta-alanina em regime não permitido**: 2.000 mg em tomada única, contra o
  Anexo VI, que exige doses fracionadas de no máximo 300 mg com 2 h de intervalo.
- **Oito insumos exatamente no teto** (creatina, beta-alanina, arginina, cafeína,
  magnésio, B3, B12 e D3) — sem margem para variação de fabricação.
- **Advertência mais fraca que a norma**: o rótulo diz "não recomendado" onde o
  Anexo VI exige "não deve ser consumido por gestantes, lactantes e crianças".
- **Guaraná com três nomes**: "extrato de guaraná" no rótulo, "guaraná em pó" no
  cadastro, e o Anexo I autoriza "extrato fluido de guaraná" ou "guaraná em pó".
- **A soma da fórmula dá 15,000 g numa porção declarada de 14 g** — antes dos
  aditivos que o próprio rótulo lista.

Por isso o selo desse produto foi **removido e não voltou**. Não o recoloque.

---

## 10. Histórico de achados graves (para não repetir)

- **Alegações terapêuticas proibidas estavam publicadas** e foram removidas dos
  benefícios: Ômega Pró TG ("reduz triglicerídeos e protege o coração", "controle do
  colesterol", "ação anti-inflamatória"); Pro Energy ("aumento da libido", "suporte
  à produção de testosterona"); Serena ("diminui ansiedade e estresse", "facilita o
  início do sono"); Biotina em Cápsula ("redução de linhas finas", "redução da
  queda", "detox celular"); Dores Musculares ("redução da dor e inflamação",
  "regeneração da cartilagem"). O texto novo é alegação oficial do Anexo V ou
  descrição de função fisiológica, sem prometer efeito.
- **Textos descreviam produto que não existe**: o Emagrecedor prometia "bloqueio de
  gordura com quitosana" e citava inulina, cúrcuma, café verde e laranja moro — a
  composição cadastrada tem **três** insumos: psyllium, espirulina e cromo. O Shot +
  Colágeno dizia "5 g de colágeno"; o cadastro diz 8.400 mg.
- **Um erro de unidade** (mg no lugar de mcg) na Biotina em Cápsula fez iodo e
  selênio aparecerem 163× e 188× acima do limite. Já corrigido no banco.
- **Segurança**: RLS ativo nas 10 tabelas, chave anônima não lê orçamento, lead,
  custo nem margem (testado, não deduzido), preço não pode ser forjado (a RPC relê
  o valor do banco), rate limit resistiu a 8 chamadas simultâneas. Continuam em
  aberto, em nível médio: injeção de fórmula no CSV pelo nome do cliente e falta de
  CSP e HSTS.

---

## 11. Armadilhas de ambiente (custaram tempo de verdade)

- **O MCP do Supabase aponta para o banco errado** (ERP de clínica). Ver seção 3.
- **Apague o `.next` inteiro** antes de um build de conferência. Builds concorrentes
  deixam cache que produz resultado enganoso. E ao trocar uma imagem mantendo o
  mesmo nome, apagar só `.next/cache/images` **não** invalida o otimizador do
  `next/image` — a versão antiga continua sendo servida. Em 13/09 isso fez mockups
  recortados aparecerem com fundo branco de volta e mandou a investigação para o
  rumo errado.
- **Vários agentes em paralelo no mesmo repositório causam atrito real**: build
  concorrente corrompe o `.next`, e dois agentes editando `app/globals.css` ao mesmo
  tempo exigem usar edição pontual, nunca reescrita do arquivo inteiro.
- **Todo teste que cria orçamento ou lead precisa limpar o que criou.** Vários
  registros de teste foram removidos, e mais de uma vez isso quase passou batido.
- **O Playwright não está instalado como pacote**, mas os navegadores estão na
  máquina. Para capturar tela:
  ```bash
  ~/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell \
    --headless --disable-gpu --hide-scrollbars --no-sandbox \
    --screenshot=saida.png --window-size=1440,2600 --virtual-time-budget=9000 \
    "http://localhost:3000/catalogo"
  ```
- **O `/catalogo` monta os cards no cliente.** O HTML servido traz só os dados no
  payload do React — procurar o texto do selo com `grep` no HTML dá zero. Para
  conferir o que o visitante vê, é preciso renderizar com JavaScript (captura de
  tela).
- **Olhar a página renderizada encontra o que a leitura de código não encontra.**
  Em 14/09, a página de documentação publicava *"Rege detalha a RDC nº 243/2018…"* —
  o componente prefixava "Rege" num texto que já começava com "detalha". Passou por
  uma auditoria de código inteira sem ser visto, e apareceu na primeira captura de
  tela. Já corrigido: o verbo agora vem da hierarquia da norma, via
  `regulatoryScopeSentence()` em `lib/catalog/regulatory-info.ts` — Resolução
  **rege**, Instrução Normativa **detalha**.

---

## 12. Onde estão os documentos de apoio

Dentro do projeto:
- `docs/ESTADO-14-09-2026.md` — retrato mais recente (a origem deste documento)
- `docs/ESTADO-13-09-2026.md` — retrato anterior
- `docs/ESTRUTURA.md` — mapa de rotas e componentes
- `docs/conformidade/LIMITES-ANVISA-POR-INSUMO.md` — limites lidos na fonte vigente
- `docs/conformidade/divergencias.md` — cadastro × rótulo real, produto a produto
- `docs/conformidade/composicoes_rotulo.json` — composições transcritas dos rótulos

Fora do projeto, em `/Users/diegofrancisco/Downloads/lemoncaps-catalogo-planejamento/`:
- `conformidade-anvisa.md` — **a auditoria completa** (731 linhas). É a fonte que as
  migrations de conformidade citam. A seção 6 tem a classificação de cada fórmula:
  10 conformes, 4 acima do limite, 14 não verificadas.
- `revisao-alegacoes.md`, `alegacoes-anvisa.md` — alegações permitidas e proibidas
- `fichas-oficiais-encontradas.md`, `teor-quelatos.md`, `correcoes-de-dados.md`
- `auditoria-interface.md`, `dossies-o-que-falta.md`, `dados-catalogo-atual.md`

---

## 13. Resumo para começar

1. Leia este documento inteiro. As regras da seção 2 valem desde a primeira resposta.
2. Rode `export PATH="$HOME/.local/bin:$PATH"` e consulte o grafo antes de mexer em
   código.
3. Confirme o estado atual você mesmo antes de afirmar qualquer coisa — o banco
   muda, e este documento é de 14/09/2026.
4. **Não publique, não commite e não escreva no banco de produção** sem o dono
   autorizar na hora.
5. Quando terminar de alterar código, rode `graphify update .`.

O projeto está saudável: compila, passa no lint, builda e roda. O que falta é, em
boa parte, **decisão do dono e dado que só a fábrica tem** — não código.
