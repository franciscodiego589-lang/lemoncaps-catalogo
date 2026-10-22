import { describe, expect, it } from "vitest";

import { lineAllowsActiveWithoutPrice, violatesActiveRequiresPrice } from "./price-rule";

describe("violatesActiveRequiresPrice", () => {
  it("aceita ativar fórmula Premium sem preço (desde 21/10/2026)", () => {
    expect(violatesActiveRequiresPrice({ active: true }, null, "premium")).toBe(false);
  });

  it("recusa ativar fórmula Básica sem preço", () => {
    expect(violatesActiveRequiresPrice({ active: true }, null, "basica")).toBe(true);
  });

  it("aceita ativar fórmula Essencial sem preço (Preço sob consulta, decisão de 23/09/2026)", () => {
    expect(violatesActiveRequiresPrice({ active: true }, null, "essencial")).toBe(false);
  });

  it("usa a linha do patch quando ele troca de linha", () => {
    expect(violatesActiveRequiresPrice({ active: true, line: "basica" }, null, "essencial")).toBe(true);
    expect(violatesActiveRequiresPrice({ active: true, line: "essencial" }, null, "basica")).toBe(false);
  });

  it("usa o preço do patch quando ele traz preço", () => {
    expect(violatesActiveRequiresPrice({ active: true, listPriceCents: 1990 }, null, "basica")).toBe(false);
    expect(violatesActiveRequiresPrice({ active: true, listPriceCents: null }, 1990, "basica")).toBe(true);
  });

  it("não se aplica quando o patch não ativa", () => {
    expect(violatesActiveRequiresPrice({ active: false }, null, "premium")).toBe(false);
    expect(violatesActiveRequiresPrice({ listPriceCents: null }, null, "premium")).toBe(false);
  });

  it("criação sem linha conhecida continua exigindo preço", () => {
    expect(violatesActiveRequiresPrice({ active: true }, null, null)).toBe(true);
  });
});

describe("lineAllowsActiveWithoutPrice", () => {
  it("Essencial e Premium dispensam preço; Básica não", () => {
    expect(lineAllowsActiveWithoutPrice("essencial")).toBe(true);
    expect(lineAllowsActiveWithoutPrice("premium")).toBe(true);
    expect(lineAllowsActiveWithoutPrice("lemon_caps")).toBe(true);
    expect(lineAllowsActiveWithoutPrice("basica")).toBe(false);
    expect(lineAllowsActiveWithoutPrice(null)).toBe(false);
  });
});
