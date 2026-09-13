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

Ainda não há teste automatizado neste projeto. A recomendação é Vitest; o
esqueleto sai de `/setup-testing`.

**Ao trocar um arquivo de imagem mantendo o mesmo nome**, apague `.next`
inteiro antes de conferir o resultado. Apagar só `.next/cache/images` não
invalida o otimizador do `next/image`, e a versão antiga continua sendo
servida — em 13/09/2026 isso fez os mockups recortados aparecerem com o fundo
branco de volta e mandou a investigação para o rumo errado.

## graphify
<!-- aia-harness:graphify-root — knowledge-graph usage; merged section, do not remove -->

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:

- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- Investigating code (file search, implementations, call sites, "where is X"): alongside graphify, dispatch specialist subagents (`model: haiku`) in parallel — never one at a time, never generic-only. Cuts investigation time.
