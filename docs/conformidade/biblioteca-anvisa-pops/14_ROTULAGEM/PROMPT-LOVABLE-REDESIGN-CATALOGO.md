# Redesenho dos cards do catálogo — status de conformidade ANVISA

Usar os tokens que já existem em `:root` do projeto: `--foreground`, `--muted`, `--muted-foreground`, `--border`, `--accent`, `--accent-foreground`, `--primary`, `--primary-dark`, `--destructive`, `--radius`, `--glass-shadow`. Não criar cor nova fora das três de status definidas abaixo.

Três cores de status, para acrescentar ao `:root`:

```css
--status-ok: #4d7c0f;        --status-ok-bg: #eef7e0;
--status-atencao: #a16207;   --status-atencao-bg: #fbf3e0;
--status-bloqueado: var(--destructive);  --status-bloqueado-bg: #fdeced;
```

---

## 1. Selo de estado no card

Ao lado do badge "Alto Padrão", um segundo badge com o estado de conformidade do produto. Mesmo formato do "Alto Padrão" — pílula, `font-size: 11px`, `font-weight: 600`, `padding: 5px 11px` — com ícone de 12px à esquerda.

| Estado | Fundo · texto | Ícone | Quando |
| --- | --- | --- | --- |
| **Conforme** | `--status-ok-bg` · `--status-ok` | check | nenhum constituinte acima do máximo, nenhuma fonte não autorizada |
| **Atenção** | `--status-atencao-bg` · `--status-atencao` | círculo com "!" | algum constituinte no teto exato, abaixo do mínimo, ou fabricante restrito |
| **Bloqueado** | `--status-bloqueado-bg` · `--status-bloqueado` | triângulo de alerta | algum constituinte acima do máximo ou fonte não autorizada |

A faixa colorida do topo do card passa a refletir o estado, não a categoria: 4px de altura, gradiente da cor do estado.

## 2. Bloco de não conformidade

Só nos produtos **Bloqueado** ou **Atenção**, entre o cabeçalho e a composição. Caixa com `background: var(--status-bloqueado-bg)`, borda 1px em `#f6c9cc`, `border-radius: 12px`, `padding: 13px 15px`, ícone de alerta à esquerda e duas linhas:

- título em `font-weight: 600`, ex.: "1 não conformidade impede a fabricação"
- descrição em 12,5px, ex.: "Boro em 56,60 mg — 6,4× o teto de 8,866 mg, e 'quelato de boro' não é fonte autorizada."

## 3. Barra de ocupação do limite

Em cada linha da COMPOSIÇÃO POR DOSE, abaixo do nome e da quantidade, uma barra de 4px de altura mostrando quanto o constituinte ocupa do limite diário.

```
[nome do ingrediente]                    [quantidade]
[▬▬▬▬▬▬▬▬▬▬▬░░░░░░░░]  60%
```

- Trilho: `background: var(--muted)`, `border-radius: 999px`
- Preenchimento até 90%: `var(--primary-dark)`
- Entre 90% e 100%: `var(--status-atencao)`, com o rótulo "100% · teto" quando for exatamente o máximo
- Acima de 100%: barra hachurada `repeating-linear-gradient(115deg, var(--destructive) 0 7px, #f2565d 7px 14px)`, largura 100%, e a linha inteira ganha fundo `--status-bloqueado-bg` e borda-esquerda de 3px na cor do destructive
- Percentual à direita da barra, em fonte monoespaçada, 10,5px

Os itens da composição passam a ser separados por 1px de `var(--border)` dentro de um contêiner com `border-radius: 12px` e `overflow: hidden`, em vez de cartões soltos.

## 4. Bloco "O que pode ser dito"

Nos produtos **Conforme**, no lugar onde ficaria o bloco de não conformidade. Título "O QUE PODE SER DITO" em 11px, `letter-spacing: .09em`. Abaixo, até duas alegações autorizadas, cada uma numa caixa com `background: #f7fbee`, borda `#dcecc0`, `border-radius: 12px`, texto 12,5px em `#33500a`, entre aspas. Depois, uma linha "mais N alegações autorizadas · ver todas ›".

**A alegação é transcrita na redação exata da ANVISA — não reescrever, não resumir, não adaptar para marketing.**

## 5. Advertência obrigatória

Bloco em `background: var(--muted)`, `border-radius: 12px`, `padding: 12px 14px`, com o texto da advertência em 12,5px e, abaixo, em 11,5px e `var(--muted-foreground)`, a razão dela — ex.: "Exigida pela L-teanina, que o painel não autoriza para esses grupos."

## 6. Botão DOSSIÊ TÉCNICO e rodapé

Os dois botões ficam lado a lado, largura igual, `border-radius: 12px`, `padding: 12px`:

- **Benefícios** — borda `var(--border)`, fundo branco, texto `var(--foreground)`
- **Dossiê técnico** — fundo `var(--accent)`, texto `var(--accent-foreground)`, ícone de documento

Abaixo dos botões, uma linha de rodapé com `font-size: 10.5px`:

- à esquerda, em monoespaçada e `var(--muted-foreground)`: "Painel da ANVISA · 08/09/2026"
- à direita, em `font-weight: 600`: "Memorial de cálculo ›"

## 7. Topo da página: contadores e filtros

Acima da grade de produtos, quatro cartões numéricos lado a lado (`grid-template-columns: repeat(4, minmax(0, 1fr))`, `gap: 12px`), cada um com o número em 27px, monoespaçado, na cor do estado, e o rótulo abaixo em 11,5px:

| Número | Rótulo | Cor |
| --- | --- | --- |
| 17 | conformes | `--status-ok` |
| 2 | com ponto de atenção | `--status-atencao` |
| 1 | bloqueado | `--destructive` |
| 32 | constituintes no teto exato | `--foreground` |

Abaixo deles, uma linha de chips de filtro: **Todos · Conformes · Atenção · Bloqueados**, separador vertical, depois **Cápsula · Pó · Gotas · Goma**. Chip inativo: borda `var(--border)`, fundo branco, texto `var(--muted-foreground)`. Chip ativo: fundo `var(--accent)`, texto `var(--accent-foreground)`. Os chips de estado levam um ponto de 7px na cor correspondente.

## 8. Duas correções de layout

- **A porção aparece duas vezes** em vários cards — uma na TABELA NUTRICIONAL e outra dentro da COMPOSIÇÃO POR DOSE. Manter só a da tabela nutricional.
- **Texto de ícone cortado**: "Aromatizant e idên…" no Shot + Colágeno. Reduzir para uma palavra ou aumentar a largura do rótulo.

---

## Regras que valem para tudo acima

1. Não inventar dado de conformidade. Estado, percentual de ocupação, alegações e advertências vêm da conferência contra o painel da ANVISA — se o dado não existir para um produto, não exibir o elemento.
2. Não exibir alegação fora da redação exata autorizada.
3. Manter nome, categoria, ícones, tabela nutricional, modo de uso e o botão Benefícios como estão.
4. Manter a densidade e o espaçamento atuais: o card fica com a mesma largura, e os novos blocos entram no ritmo vertical que já existe.
