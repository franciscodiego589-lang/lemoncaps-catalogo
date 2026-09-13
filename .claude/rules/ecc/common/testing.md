---
paths:
  - "**/*.test.ts"
  - "**/*.test.tsx"
  - "**/*.spec.ts"
  - "**/*.spec.tsx"
  - "**/__tests__/**"
---
<!-- Vendored from ECC (github.com/affaan-m/ECC) @ ceca28852e5b31edbbf66ebccc8fd163dd14208e :: rules/common/testing.md. MIT (c) Affaan Mustafa. -->
<!-- Adapted for lemoncaps-catalogo (2026-09-13): this project has no test suite yet
(see AGENTS.md and docs/harness/strategies.md — "No test runner detected"), so the 80%
coverage bar and the "MANDATORY" TDD workflow below are reframed as a TARGET for once
Vitest is set up, not a rule that blocks work today. Also replaced the original ECC
file's TDD agent, which does not exist in this project, with `test-engineer`, the
closest real agent in `.claude/agents/` (TDD discipline, coverage analysis, edge-case
discovery). Added `paths:` frontmatter so this file only loads for test files instead
of every session. -->

# Testing Requirements

> **Current state:** no automated test suite exists in this project yet. The
> recommended runner is **Vitest** (see `AGENTS.md`); `/setup-testing` scaffolds it.
> Everything below is the TARGET to reach as the suite is built, not a gate blocking
> work today.

## Minimum Test Coverage: 80% (target, once a suite exists)

Test Types (ALL required, once a suite exists):
1. **Unit Tests** - Individual functions, utilities, components
2. **Integration Tests** - API endpoints, database operations
3. **E2E Tests** - Critical user flows (framework chosen per language)

## Test-Driven Development

TARGET workflow, to apply once a test suite exists:
1. Write test first (RED)
2. Run test - it should FAIL
3. Write minimal implementation (GREEN)
4. Run test - it should PASS
5. Refactor (IMPROVE)
6. Verify coverage (80%+)

## Troubleshooting Test Failures

1. Use **test-engineer** agent
2. Check test isolation
3. Verify mocks are correct
4. Fix implementation, not tests (unless tests are wrong)

## Agent Support

- **test-engineer** - Use PROACTIVELY for new features, enforces write-tests-first (TDD discipline) once a suite exists

## Test Structure (AAA Pattern)

Prefer Arrange-Act-Assert structure for tests:

```typescript
test('calculates similarity correctly', () => {
  // Arrange
  const vector1 = [1, 0, 0]
  const vector2 = [0, 1, 0]

  // Act
  const similarity = calculateCosineSimilarity(vector1, vector2)

  // Assert
  expect(similarity).toBe(0)
})
```

### Test Naming

Use descriptive names that explain the behavior under test:

```typescript
test('returns empty array when no markets match query', () => {})
test('throws error when API key is missing', () => {})
test('falls back to substring search when Redis is unavailable', () => {})
```
