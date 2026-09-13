---
paths:
  - ".claude/**"
---
<!-- Vendored from ECC (github.com/affaan-m/ECC) @ ceca28852e5b31edbbf66ebccc8fd163dd14208e :: rules/common/agents.md. MIT (c) Affaan Mustafa. -->
<!-- Adapted for lemoncaps-catalogo (2026-09-13): the "Available Agents" table and the
"Immediate Agent Usage" list were rewritten to match this project's real agent roster in
`.claude/agents/` (project root, not `~/.claude/agents/`). Several of the original ECC
agent names — including `planner`, `architect`, and five others covering TDD, build
fixing, E2E runs, dead-code cleanup, and doc updates — do not exist in this project and
calling them would fail. Entries with no close real equivalent were removed instead of
being mapped to an unrelated agent; the rest were mapped to the closest real agent in
the table below. Added `paths:` frontmatter so this file only loads when working inside
`.claude/` instead of on every session. -->

# Agent Orchestration

## Available Agents

Located in `.claude/agents/` at the project root:

| Agent | Purpose | When to Use |
|-------|---------|-------------|
| project-planner | Implementation planning | Complex features, refactoring |
| test-engineer | TDD discipline, coverage analysis, edge cases | New features, bug fixes |
| code-reviewer | Code review | After writing code |
| security-reviewer | Security analysis | Before commits |
| react-build-resolver | Fix build errors (React/Next.js) | When build fails |
| qa-automation-engineer | E2E testing (Playwright/Cypress) | Critical user flows |
| documentation-writer | Documentation | Updating docs |

The full roster has more agents than this shortlist (`frontend-specialist`,
`backend-specialist`, `database-architect`, `debugger`, `devops-engineer`,
`typescript-reviewer`, `react-reviewer`, and others) — check `.claude/agents/` directly
rather than assuming a name from another project applies here.

## Immediate Agent Usage

No user prompt needed:
1. Complex feature requests - Use **project-planner** agent
2. Code just written/modified - Use **code-reviewer** agent
3. Bug fix or new feature - Use **test-engineer** agent

## Parallel Task Execution

ALWAYS use parallel Task execution for independent operations:

```markdown
# GOOD: Parallel execution
Launch 3 agents in parallel:
1. Agent 1: Security analysis of auth module
2. Agent 2: Performance review of cache system
3. Agent 3: Type checking of utilities

# BAD: Sequential when unnecessary
First agent 1, then agent 2, then agent 3
```

## Multi-Perspective Analysis

For complex problems, use split role sub-agents:
- Factual reviewer
- Senior engineer
- Security expert
- Consistency reviewer
- Redundancy checker
