@AGENTS.md

## Comandos canônicos

Use exatamente estes comandos — não adivinhe variações:

| O quê | Comando |
|---|---|
| Instalar dependências | `npm install` |
| Lint | `npm run lint` |
| Checagem de tipos | `npx tsc --noEmit` |
| Build de produção | `npm run build` |
| Servidor de desenvolvimento | `npm run dev` |

Testes com Vitest: `npm test` roda a suíte, `npm run test:watch` acompanha
enquanto você edita. Hoje são 107 testes sobre a lógica que dói quando quebra —
dinheiro (`lib/money.ts`), geração do CSV de orçamentos, validação de URL externa,
validação do formulário do carrinho e formatação de quantidade.

**Ao trocar um arquivo de imagem mantendo o mesmo nome**, apague `.next`
inteiro antes de conferir o resultado. Apagar só `.next/cache/images` não
invalida o otimizador do `next/image`, e a versão antiga continua sendo
servida — em 13/09/2026 isso fez os mockups recortados aparecerem com o fundo
branco de volta e mandou a investigação para o rumo errado.

## Biblioteca local de normas ANVISA / POPs / rotulagem

Antes de pesquisar ao vivo (WebSearch/WebFetch) qualquer coisa sobre RDC, IN,
limite de insumo, rotulagem ou POP — **primeiro** olhe aqui, é local e não
gasta token de busca:

- **Biblioteca completa e com grafo:** `~/Desktop/catalogo lemon atualizado /anvisa/`
  (o nome da pasta termina com espaço) — 557 constituintes do painel oficial em
  `.md` por categoria (título = nome, CAS, limite >19 anos), 21 RDC/IN baixadas
  do AnvisaLegis com situação vigente/revogada, e grafo do graphify
  (`cd` na pasta e `graphify query "..."`). Montada em 23/09/2026. Ver o
  `CLAUDE.md` de lá.

- `docs/conformidade/IN28-2018-ANEXO-I-LITERAL.md` — Anexo I (lista de
  constituintes autorizados, com número CAS), transcrição literal do texto
  consolidado, com URL/data/hash de proveniência.
- `docs/conformidade/IN28-2018-ANEXO-III-LITERAL.md` — Anexo III (limites
  mínimos diários).
- `docs/conformidade/IN28-2018-ANEXOS-IV-V-VI-LITERAL.md` — Anexo IV (limites
  máximos), V (alegações) e VI (rotulagem complementar/advertências).
- `docs/conformidade/LIMITES-ANVISA-POR-INSUMO.md` e
  `docs/conformidade/VERIFICACAO-LIMITES-ANVISA-2026-09-23.pdf` — auditorias
  já feitas, com data de verificação.
- `docs/conformidade/biblioteca-anvisa-pops/` — cópia dentro do próprio
  projeto (não link pra fora) de POPs internos (`01_POPS/`), rotulagem por
  produto (`14_ROTULAGEM/`), normas de referência (`17_REFERENCIAS_ANVISA/`,
  `RDC_IN_PADRAO_ANVISA/`, `NORMAS_ANVISA_geral/`,
  `GUIAS_ROTULAGEM_ANVISA/`) e matrizes de avaliação (`06_MATRIZES_AVALIACAO/`).
  Trazidos de `~/Desktop/POPS/` (projeto próprio da fábrica, com `.git`
  próprio) em 23/09/2026 — só o subconjunto de referência regulatória; POPS
  também tem ordens de produção e exame de cliente, que ficaram de fora de
  propósito (dado sensível/operacional, não pertence a este repositório).
- **`docs/conformidade/biblioteca-anvisa-pops/consultar_painel_anvisa.py`** —
  script Python que baixa a lista de constituintes **direto da API do Power BI
  oficial da ANVISA** (não do PDF, que fica desatualizado — ver aviso abaixo).
  Uso: `python3 consultar_painel_anvisa.py "creatina" "biotina"` (consulta,
  usa cache local) ou `--atualizar` (rebaixa da API). Salva em
  `PAINEL-ANVISA-CONSTITUINTES.json`, no mesmo diretório do script — **use
  isto antes de WebSearch/WebFetch** para qualquer pergunta de limite/CAS de
  insumo, é local e não gasta token de busca. Validado ao vivo em 23/09/2026
  (557 constituintes; creatina 3.000–5.000 mg e vitamina D3 3–50 µg batendo
  exatamente com a verificação independente do mesmo dia em
  `VERIFICACAO-LIMITES-ANVISA-2026-09-23.pdf`). O JSON é cache que envelhece
  — rode `--atualizar` antes de qualquer decisão que reprove lote ou vá pra
  vigilância sanitária.
- Sem grafo semântico do graphify ainda (falta chave de API — GEMINI_API_KEY,
  ANTHROPIC_API_KEY, OPENAI_API_KEY, MOONSHOT_API_KEY ou DEEPSEEK_API_KEY;
  nenhuma configurada em 23/09/2026) — buscar por nome/grep nessas pastas.

**Os arquivos `*-LITERAL.md` datam de 16/09/2026** (citam alterações até a IN
nº 450/2026). Uma verificação ao vivo em 23/09/2026 já achou referência a uma
IN nº 470/2026 mais recente — para qualquer decisão que bloqueie/aprove lote,
reconferir a fonte ao vivo (AnvisaLegis) antes de confiar cegamente nesses
arquivos como estando 100% atualizados.

## graphify
<!-- aia-harness:graphify-root — knowledge-graph usage; merged section, do not remove -->

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:

- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- Investigating code (file search, implementations, call sites, "where is X"): alongside graphify, dispatch specialist subagents (`model: haiku`) in parallel — never one at a time, never generic-only. Cuts investigation time.
