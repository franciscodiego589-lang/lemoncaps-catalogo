// Linhas (abas) que o dono pode ligar e desligar no admin. Só as em uso: a
// antiga Básica não tem fórmula nem aba (ver 20261021180000_linhas_do_catalogo.sql).
import type { ProductLine } from "./format-catalog";

export const TOGGLEABLE_LINES = ["premium", "essencial", "lemon_caps"] as const satisfies readonly ProductLine[];
export type ToggleableLine = (typeof TOGGLEABLE_LINES)[number];

export function isToggleableLine(value: unknown): value is ToggleableLine {
  return typeof value === "string" && (TOGGLEABLE_LINES as readonly string[]).includes(value);
}

// Tira do catálogo as fórmulas de linha desligada. Linha sem registro na tabela
// conta como ligada: é o comportamento de antes desta função, e o que vale se a
// tabela ainda não existir ou a leitura falhar.
export function withoutDisabledLines<T extends { readonly line: ProductLine }>(
  formulas: readonly T[],
  disabledLines: ReadonlySet<ProductLine>,
): T[] {
  if (disabledLines.size === 0) return [...formulas];
  return formulas.filter((formula) => !disabledLines.has(formula.line));
}

export function disabledLinesFromRows(
  rows: ReadonlyArray<{ readonly line: ProductLine; readonly enabled: boolean }> | null | undefined,
): Set<ProductLine> {
  return new Set((rows ?? []).filter((row) => !row.enabled).map((row) => row.line));
}
