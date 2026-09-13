---
paths:
  - ".claude/**"
  - "package.json"
  - "next.config.*"
  - "tsconfig.json"
---
<!-- Vendored from ECC (github.com/affaan-m/ECC) @ ceca28852e5b31edbbf66ebccc8fd163dd14208e :: rules/common/performance.md. MIT (c) Affaan Mustafa. -->
<!-- Adapted for lemoncaps-catalogo (2026-09-13): replaced the original ECC file's
build-fixing agent name, which does not exist in this project, with
`react-build-resolver`, the real build-fixing agent in `.claude/agents/` for this
Next.js/React stack. This file is about AI agent/model strategy and build
troubleshooting, not application code performance, so its `paths:` frontmatter targets
this project's own Claude Code config and build config files instead of `**/*.ts` — and
instead of loading on every session as before. -->

# Performance Optimization

## Model Selection Strategy

**Haiku** (90% of Sonnet capability, 3x cost savings):
- Lightweight agents with frequent invocation
- Pair programming and code generation
- Worker agents in multi-agent systems

**Sonnet** (Best coding model):
- Main development work
- Orchestrating multi-agent workflows
- Complex coding tasks

**Opus** (Deepest reasoning):
- Complex architectural decisions
- Maximum reasoning requirements
- Research and analysis tasks

## Context Window Management

Avoid last 20% of context window for:
- Large-scale refactoring
- Feature implementation spanning multiple files
- Debugging complex interactions

Lower context sensitivity tasks:
- Single-file edits
- Independent utility creation
- Documentation updates
- Simple bug fixes

## Extended Thinking + Plan Mode

Extended thinking is enabled by default, reserving up to 31,999 tokens for internal reasoning.

Control extended thinking via:
- **Toggle**: Option+T (macOS) / Alt+T (Windows/Linux)
- **Config**: Set `alwaysThinkingEnabled` in `~/.claude/settings.json`
- **Budget cap**: `export MAX_THINKING_TOKENS=10000` (bash) or `$env:MAX_THINKING_TOKENS = "10000"` (PowerShell)
- **Verbose mode**: Ctrl+O to see thinking output

For complex tasks requiring deep reasoning:
1. Ensure extended thinking is enabled (on by default)
2. Enable **Plan Mode** for structured approach
3. Use multiple critique rounds for thorough analysis
4. Use split role sub-agents for diverse perspectives

## Build Troubleshooting

If build fails:
1. Use **react-build-resolver** agent
2. Analyze error messages
3. Fix incrementally
4. Verify after each fix
