import { describe, expect, it } from "vitest";

import type { FormulaDTO, SegmentDTO } from "@/lib/data/formulas";
import { computeManufacturingStats } from "./manufacturing-stats";

// Só os campos que a função lê — o resto do DTO não importa aqui.
function formula(partial: Partial<FormulaDTO>): FormulaDTO {
  return {
    segmentId: "s1",
    line: "premium",
    format: "capsula",
    poteContentsDescription: "60 Cápsulas",
    listPriceCents: 1000,
    minimumOrderPotes: 100,
    ...partial,
  } as FormulaDTO;
}

const SEGMENTS: SegmentDTO[] = [
  { id: "s1", slug: "energia", name: "Energia", sortOrder: 10 },
  { id: "s2", slug: "diabetes", name: "Diabetes", sortOrder: 110 },
];

describe("computeManufacturingStats", () => {
  it("não conta fórmula no ar sem preço (linha Essencial com Preço sob consulta)", () => {
    const stats = computeManufacturingStats(
      [
        formula({ listPriceCents: 1200 }),
        formula({ listPriceCents: 1900, format: "liquido", poteContentsDescription: "30 ml" }),
        formula({ line: "essencial", listPriceCents: null, segmentId: "s2" }),
        formula({ line: "essencial", listPriceCents: null, segmentId: "s2", format: "liquido", poteContentsDescription: "30 ml" }),
      ],
      SEGMENTS,
    );
    expect(stats.totalFormulas).toBe(2);
    expect(stats.formats.map((f) => [f.format, f.formulaCount])).toEqual([
      ["capsula", 1],
      ["liquido", 1],
    ]);
    expect(stats.segmentNames).toEqual(["Energia"]);
    expect([stats.priceMinCents, stats.priceMaxCents]).toEqual([1200, 1900]);
  });

  it("fórmula Essencial entra na conta quando ganha preço", () => {
    const stats = computeManufacturingStats(
      [formula({}), formula({ line: "essencial", listPriceCents: 990, segmentId: "s2" })],
      SEGMENTS,
    );
    expect(stats.totalFormulas).toBe(2);
    expect(stats.segmentNames).toEqual(["Energia", "Diabetes"]);
  });
});
