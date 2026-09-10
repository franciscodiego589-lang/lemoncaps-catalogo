<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Catálogo Lemon Caps — Diretrizes do Projeto

Catálogo público de fórmulas da Lemon Caps (indústria de suplementos e nutracêuticos),
com área administrativa. Substitui o catálogo anterior, que era feito na plataforma
Lovable e rodava sobre Lovable Cloud.

## Idioma

Toda comunicação com o dono do projeto é em **português do Brasil**, com acentuação
correta. Identificadores de código, comandos e termos técnicos consagrados permanecem
no original. Texto visível ao usuário final do site também é em português do Brasil.

## Exatidão (regra acima de todas as outras)

Este catálogo publica **composição de suplemento alimentar**: insumo, quantidade,
unidade, modo de uso e alegações. Número errado aqui não é defeito de software — é
desvio regulatório perante a ANVISA, e custa lote parado e credibilidade.

- Nunca inventar, nunca deduzir, nunca arredondar para "ficar redondo".
- Nunca preencher lacuna com valor plausível. Campo sem origem confirmada fica
  escrito como `NÃO CONFIRMADO` e aparece assim na revisão, nunca no site publicado.
- Toda quantidade tem procedência: veio do banco, do dossiê técnico ou da ficha
  técnica do produto. Dado sem procedência não entra no catálogo.
- Distinguir sempre o que foi lido na fonte, o que foi calculado e o que foi assumido.

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Estilo | Tailwind CSS v4 + CSS próprio para o material de vidro |
| Banco, Auth, Realtime | Supabase (PostgreSQL + RLS) |
| Estado do cliente | Zustand (carrinho e sessão de lead) |
| Ícones e avisos | lucide-react, sonner |

O banco é **exclusivo deste projeto**. O servidor MCP de Supabase configurado nesta
máquina aponta para outro sistema (ERP de clínica de estética) — nenhuma migration
deste catálogo pode ser aplicada por ele.

## Regras de dados

- Composição guarda **quantidade numérica e unidade em campos separados**. Nunca
  texto solto. Unidades aceitas: `g`, `mg`, `mcg`, `ml`, `L`, `UI`, `kg`.
- A entrada aceita decimal com vírgula (padrão brasileiro) e converte antes de gravar.
- Pedido mínimo do catálogo: **100 potes**.
- Valores monetários nunca usam ponto flutuante binário para cálculo de margem.
- Exclusão é lógica (`deleted_at`), não física. Toda leitura pública filtra excluídos.

## Segurança

- **Nenhuma senha no código do cliente.** O sistema anterior usava a senha fixa
  `0212` validada no front; isso não se repete. Administração passa por Supabase Auth.
- A chave `service_role` do Supabase nunca chega ao browser, nem em variável
  `NEXT_PUBLIC_*`, nem em Server Component que serialize props.
- Autorização vive em RLS no banco, não em condicional de interface. Esconder botão
  não é controle de acesso.
- Leads guardam nome e WhatsApp de pessoas reais: dado pessoal sob LGPD, com acesso
  restrito e retenção definida.

## Convenções de código

- Componentes e tipos em `PascalCase`; funções e variáveis em `camelCase`; constantes
  em `UPPER_SNAKE_CASE`; booleanos com prefixo `is`, `has`, `should` ou `can`.
- Arquivos pequenos e coesos, organizados por domínio. Regra de negócio fica em
  função pura, testável, separada do componente que a exibe.
- Sem mutação de objeto existente: cria-se cópia nova.
- Erro é tratado explicitamente e com mensagem compreensível para quem está na tela.
- Nada de `console.log` esquecido em código publicado.
