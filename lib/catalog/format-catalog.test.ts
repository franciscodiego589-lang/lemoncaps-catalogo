import { describe, expect, it } from "vitest";

import {
  FORMAT_ICONS,
  composicaoEmTexto,
  formatQuantity,
  hasContent,
  hasItems,
  lineLabel,
  stripLeadingBulletMarker,
  unitLabel,
} from "./format-catalog";

describe("composicaoEmTexto", () => {
  it("monta texto corrido, igual aos ingredientes, com a mesma formatação da tabela", () => {
    expect(
      composicaoEmTexto([
        { ingredientName: "Metilsulfonilmetano", quantity: 250.1751, unit: "mg" },
        { ingredientName: "Vitamina B12", quantity: 9.9, unit: "mcg" },
        { ingredientName: "Vitamina D3", quantity: 2000, unit: "ui" },
      ]),
    ).toBe("Metilsulfonilmetano 250,18 mg, Vitamina B12 9,9 mcg, Vitamina D3 2000 UI.");
  });

  it("devolve vazio quando não há composição (a tela mostra o aviso próprio)", () => {
    expect(composicaoEmTexto([])).toBe("");
  });

});

describe("unitLabel", () => {
  it("mantém g em minúsculo", () => {
    expect(unitLabel("g")).toBe("g");
  });

  it("mantém mg em minúsculo", () => {
    expect(unitLabel("mg")).toBe("mg");
  });

  it("mantém mcg em minúsculo", () => {
    expect(unitLabel("mcg")).toBe("mcg");
  });

  it("mantém ml em minúsculo", () => {
    expect(unitLabel("ml")).toBe("ml");
  });

  it("converte l (como o banco grava) para L maiúsculo na exibição", () => {
    expect(unitLabel("l")).toBe("L");
  });

  it("converte ui (como o banco grava) para UI maiúsculo na exibição", () => {
    expect(unitLabel("ui")).toBe("UI");
  });

  it("mantém kg em minúsculo", () => {
    expect(unitLabel("kg")).toBe("kg");
  });
});

describe("formatQuantity", () => {
  it("arredonda para 2 casas quando o valor é maior ou igual a 1", () => {
    // Arranjar
    const quantidade = 438.1375;

    // Agir
    const resultado = formatQuantity(quantidade);

    // Conferir
    expect(resultado).toBe("438,14");
  });

  it("mantém 2 casas quando o valor já tem exatamente 2", () => {
    expect(formatQuantity(9.94)).toBe("9,94");
  });

  it("usa até 4 casas quando o valor é menor que 1, para não perder precisão de microdose", () => {
    expect(formatQuantity(0.011)).toBe("0,011");
  });

  it("distingue microdoses próximas em vez de arredondar as duas para o mesmo número", () => {
    // Caso real do dono (14/09/2026): 0,011 e 0,010082 não podem virar "0,01"
    // e "0,01" ao mesmo tempo - são dois insumos diferentes, com 9% de
    // diferença real entre si.
    expect(formatQuantity(0.010082)).toBe("0,0101");
    expect(formatQuantity(0.010082)).not.toBe(formatQuantity(0.011));
  });

  it("não usa separador de milhar", () => {
    expect(formatQuantity(5000)).toBe("5000");
  });

  it("formata zero sem casas decimais forçadas", () => {
    expect(formatQuantity(0)).toBe("0");
  });

  it("mantém o sinal de negativo", () => {
    expect(formatQuantity(-438.1375)).toBe("-438,14");
  });

  it("formata número inteiro maior ou igual a 1 sem decimais soltos", () => {
    expect(formatQuantity(1)).toBe("1");
  });
});

describe("lineLabel", () => {
  it("traduz premium", () => {
    expect(lineLabel("premium")).toBe("Premium");
  });

  it("traduz basica para Básica, com acento", () => {
    expect(lineLabel("basica")).toBe("Básica");
  });

  it("traduz essencial para Econômica (rótulo desde 21/10/2026)", () => {
    expect(lineLabel("essencial")).toBe("Econômica");
    expect(lineLabel("lemon_caps")).toBe("Lemon Caps");
  });
});

describe("hasContent", () => {
  it("aceita string com texto", () => {
    expect(hasContent("texto")).toBe(true);
  });

  it("recusa string vazia", () => {
    expect(hasContent("")).toBe(false);
  });

  it("recusa string só com espaços", () => {
    expect(hasContent("   ")).toBe(false);
  });

  it("recusa null", () => {
    expect(hasContent(null)).toBe(false);
  });

  it("recusa undefined", () => {
    expect(hasContent(undefined)).toBe(false);
  });
});

describe("hasItems", () => {
  it("aceita array com pelo menos um item", () => {
    expect(hasItems([1])).toBe(true);
  });

  it("recusa array vazio", () => {
    expect(hasItems([])).toBe(false);
  });

  it("recusa null", () => {
    expect(hasItems(null)).toBe(false);
  });

  it("recusa undefined", () => {
    expect(hasItems(undefined)).toBe(false);
  });
});

describe("stripLeadingBulletMarker", () => {
  it("remove o marcador • do início do texto", () => {
    expect(stripLeadingBulletMarker("• Contribui para algo")).toBe("Contribui para algo");
  });

  it("remove hífen usado como marcador", () => {
    expect(stripLeadingBulletMarker("- item")).toBe("item");
  });

  it("remove asterisco usado como marcador", () => {
    expect(stripLeadingBulletMarker("* item")).toBe("item");
  });

  it("não altera texto que já vem sem marcador", () => {
    expect(stripLeadingBulletMarker("sem marcador")).toBe("sem marcador");
  });

  it("remove espaços entre o marcador e o texto", () => {
    expect(stripLeadingBulletMarker("   • espaços antes")).toBe("espaços antes");
  });

  it("remove marcadores duplicados no início", () => {
    expect(stripLeadingBulletMarker("•• duplo")).toBe("duplo");
  });
});

describe("FORMAT_ICONS", () => {
  it("tem um ícone mapeado para cada formato de produto conhecido", () => {
    expect(Object.keys(FORMAT_ICONS).sort()).toEqual(["capsula", "gummy", "liquido", "soluvel"].sort());
  });
});
