---
paths:
  - ".github/**"
  - "CHANGELOG.md"
---
<!-- Vendored from ECC (github.com/affaan-m/ECC) @ ceca28852e5b31edbbf66ebccc8fd163dd14208e :: rules/common/git-workflow.md. MIT (c) Affaan Mustafa. -->
<!-- Adapted for lemoncaps-catalogo (2026-09-13): corrected the attribution note below —
this project's commits currently use ACTIVE attribution, not disabled attribution. Added
`paths:` frontmatter so this file only loads around PR/release files instead of every
session. -->

# Git Workflow

## Commit Message Format
```
<type>: <description>

<optional body>
```

Types: feat, fix, refactor, docs, test, chore, perf, ci

Note: Attribution is ACTIVE for this project's commits and PRs (a Co-Authored-By
trailer is appended per the current repo/session instructions) — confirm the exact
trailer text in force before committing; do not assume attribution is disabled.

## Pull Request Workflow

When creating PRs:
1. Analyze full commit history (not just latest commit)
2. Use `git diff [base-branch]...HEAD` to see all changes
3. Draft comprehensive PR summary
4. Include test plan with TODOs
5. Push with `-u` flag if new branch

> For the full development process (planning, TDD, code review) before git operations,
> see [development-workflow.md](./development-workflow.md).
