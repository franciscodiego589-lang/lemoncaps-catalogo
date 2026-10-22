import { describe, expect, it } from "vitest";

import { disabledLinesFromRows, isToggleableLine, withoutDisabledLines } from "./catalog-lines";

const formulas = [
  { slug: "a", line: "premium" as const },
  { slug: "b", line: "essencial" as const },
  { slug: "c", line: "premium" as const },
];

describe("withoutDisabledLines", () => {
  it("sem linha desligada, devolve tudo", () => {
    expect(withoutDisabledLines(formulas, new Set())).toHaveLength(3);
  });

  it("tira só as fórmulas da linha desligada", () => {
    expect(withoutDisabledLines(formulas, new Set(["essencial"])).map((f) => f.slug)).toEqual(["a", "c"]);
    expect(withoutDisabledLines(formulas, new Set(["premium"])).map((f) => f.slug)).toEqual(["b"]);
  });

  it("as duas desligadas deixam a lista vazia", () => {
    expect(withoutDisabledLines(formulas, new Set(["premium", "essencial"]))).toEqual([]);
  });
});

describe("disabledLinesFromRows", () => {
  it("só entram as linhas com enabled=false", () => {
    const rows = [
      { line: "premium" as const, enabled: true },
      { line: "essencial" as const, enabled: false },
    ];
    expect([...disabledLinesFromRows(rows)]).toEqual(["essencial"]);
  });

  it("sem registros (tabela vazia ou ausente), nada é desligado", () => {
    expect(disabledLinesFromRows(null).size).toBe(0);
    expect(disabledLinesFromRows([]).size).toBe(0);
  });
});

describe("isToggleableLine", () => {
  it("aceita premium e essencial; recusa o resto", () => {
    expect(isToggleableLine("premium")).toBe(true);
    expect(isToggleableLine("essencial")).toBe(true);
    expect(isToggleableLine("basica")).toBe(false);
    expect(isToggleableLine(undefined)).toBe(false);
  });
});
