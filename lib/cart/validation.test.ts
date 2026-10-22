import { describe, expect, it } from "vitest";

import { isValidCustomerName, isValidWhatsapp, normalizeWhatsapp } from "./validation";

describe("normalizeWhatsapp", () => {
  it("remove parênteses, traço e espaço do número digitado com máscara", () => {
    // Arranjar
    const digitado = "(65) 99276-8964";

    // Agir
    const resultado = normalizeWhatsapp(digitado);

    // Conferir
    expect(resultado).toBe("65992768964");
  });

  it("preserva o + na frente quando já vem com DDI", () => {
    expect(normalizeWhatsapp("+55 (65) 99276-8964")).toBe("+5565992768964");
  });

  it("adiciona nada além do que já existe quando digitado só com dígitos", () => {
    expect(normalizeWhatsapp("65992768964")).toBe("65992768964");
  });

  it("remove letras misturadas no meio do número", () => {
    expect(normalizeWhatsapp("65-9927-8964abc")).toBe("6599278964");
  });

  it("reduz para string vazia quando não há nenhum dígito", () => {
    expect(normalizeWhatsapp("abcdefghij")).toBe("");
  });

  it("reduz espaços em branco para string vazia", () => {
    expect(normalizeWhatsapp("   ")).toBe("");
  });
});

describe("isValidWhatsapp", () => {
  it.each(["65992768964", "+5565992768964", "6599278964"])(
    "aceita %s (entre 10 e 15 dígitos, com ou sem +55)",
    (numeroNormalizado) => {
      expect(isValidWhatsapp(numeroNormalizado)).toBe(true);
    },
  );

  it.each(["123", "", "+55", "5565992768964999999"])(
    "recusa %s (menos de 10 ou mais de 15 dígitos)",
    (numeroNormalizado) => {
      expect(isValidWhatsapp(numeroNormalizado)).toBe(false);
    },
  );

  it("recusa valor com letra, mesmo com quantidade de caracteres correta", () => {
    // isValidWhatsapp assume que o valor já passou por normalizeWhatsapp; se
    // chegar direto com letra, tem de recusar - a regra é ^\+?[0-9]{10,15}$.
    expect(isValidWhatsapp("6599276896a")).toBe(false);
  });
});

describe("isValidCustomerName", () => {
  it("aceita nome comum", () => {
    expect(isValidCustomerName("Diego")).toBe(true);
  });

  it("aceita nome com espaços nas pontas (ignorados pelo trim)", () => {
    expect(isValidCustomerName("  Diego  ")).toBe(true);
  });

  it("aceita nome de uma letra só", () => {
    expect(isValidCustomerName("A")).toBe(true);
  });

  it("recusa string vazia", () => {
    expect(isValidCustomerName("")).toBe(false);
  });

  it("recusa string só com espaços", () => {
    expect(isValidCustomerName("   ")).toBe(false);
  });
});
