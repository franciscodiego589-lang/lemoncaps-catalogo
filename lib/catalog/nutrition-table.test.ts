import { describe, expect, it } from "vitest";

import type { Json } from "@/lib/supabase/database.types";
import {
  formatNutritionQuantity,
  formatNutritionVdCell,
  mergeNutritionTableMetadata,
  nutritionVdColumnLabel,
  rawNutritionTableSchema,
  readNutritionTable,
  renderNutritionTableText,
  toNutritionTable,
  type NutritionTableInput,
  type NutritionTableRow,
} from "./nutrition-table";

// Formato real de formulas.metadata->tabela_nutricional, conferido em
// 16/09/2026 em docs/conformidade/dados-2026-09-16/fase2/<slug>.json e em
// supabase/migrations/20260922000000_reformulacao_conforme_normas.sql (ver
// comentário de procedência no topo de ./nutrition-table.ts) - não é dado
// inventado para o teste, é o mesmo shape usado nos 24 produtos reais.
const METADATA_UM_GRUPO = {
  tabela_nutricional: {
    porcoes_por_embalagem: "30",
    porcao: "1 g (2 cápsulas)",
    grupos_vd: ["adultos_19_anos_ou_mais"],
    linhas: [
      {
        item: "Valor energético",
        quantidade: 0,
        unidade: "kcal",
        kj: 0,
        vd_pct: { adultos_19_anos_ou_mais: 0 },
        nivel: 0,
        nota: null,
        pendente: false,
        provisorio: false,
      },
      {
        item: "Carboidratos",
        quantidade: 0,
        unidade: "g",
        vd_pct: { adultos_19_anos_ou_mais: 0 },
        nivel: 0,
        nota: null,
        pendente: false,
        provisorio: false,
      },
      {
        item: "Açúcares totais",
        quantidade: 0,
        unidade: "g",
        vd_pct: null,
        nivel: 1,
        nota: null,
        pendente: false,
        provisorio: false,
      },
      {
        item: "Ferro",
        quantidade: 8.1,
        unidade: "mg",
        vd_pct: { adultos_19_anos_ou_mais: "PENDENTE" },
        nivel: 0,
        nota: "laudo vencido - pedir laudo novo",
        pendente: false,
        provisorio: true,
      },
    ],
    rodape: "*Percentual de valores diários fornecidos pela porção",
  },
};

const METADATA_DOIS_GRUPOS = {
  tabela_nutricional: {
    porcoes_por_embalagem: "30",
    porcao: "1 g (2 cápsulas)",
    grupos_vd: ["gestantes", "lactantes"],
    linhas: [
      {
        item: "Vitamina C",
        quantidade: 20,
        unidade: "mg",
        vd_pct: { gestantes: 24, lactantes: 17 },
        nivel: 0,
        nota: null,
        pendente: false,
        provisorio: false,
      },
    ],
    rodape: "*Percentual de valores diários fornecidos pela porção",
  },
};

describe("readNutritionTable", () => {
  it("devolve null quando metadata é null", () => {
    expect(readNutritionTable(null)).toBeNull();
  });

  it("devolve null quando metadata é undefined", () => {
    expect(readNutritionTable(undefined)).toBeNull();
  });

  it("devolve null quando metadata não tem a chave tabela_nutricional", () => {
    expect(readNutritionTable({})).toBeNull();
  });

  it("devolve null quando metadata não é um objeto (string)", () => {
    expect(readNutritionTable("tabela_nutricional")).toBeNull();
  });

  it("devolve null quando metadata não é um objeto (array)", () => {
    expect(readNutritionTable([1, 2, 3])).toBeNull();
  });

  it("devolve null quando tabela_nutricional está mal formado (faltam linhas)", () => {
    expect(readNutritionTable({ tabela_nutricional: { porcao: "1 g" } })).toBeNull();
  });

  it("devolve null quando tabela_nutricional tem linhas vazio", () => {
    expect(
      readNutritionTable({
        tabela_nutricional: {
          porcoes_por_embalagem: "30",
          porcao: "1 g",
          grupos_vd: ["adultos"],
          linhas: [],
          rodape: null,
        },
      }),
    ).toBeNull();
  });

  it("aceita item vazio numa linha e grava como PENDENTE (afrouxamento consciente, ordem do dono em 17/09/2026)", () => {
    const tabela = readNutritionTable({
      tabela_nutricional: {
        porcoes_por_embalagem: "30",
        porcao: "1 g",
        grupos_vd: ["adultos"],
        linhas: [{ item: "", quantidade: 1, unidade: "g", vd_pct: null, nivel: 0, provisorio: false }],
        rodape: null,
      },
    });

    expect(tabela).not.toBeNull();
    expect(tabela?.linhas[0]?.item).toBe("PENDENTE");
  });

  it("nunca lança exceção mesmo com metadata completamente disforme", () => {
    expect(() => readNutritionTable({ tabela_nutricional: "isso não é uma tabela" })).not.toThrow();
    expect(readNutritionTable({ tabela_nutricional: "isso não é uma tabela" })).toBeNull();
  });

  it("lê corretamente uma tabela válida de 1 grupo (adultos)", () => {
    const tabela = readNutritionTable(METADATA_UM_GRUPO);

    expect(tabela).not.toBeNull();
    expect(tabela?.porcoesPorEmbalagem).toBe("30");
    expect(tabela?.porcao).toBe("1 g (2 cápsulas)");
    expect(tabela?.gruposVd).toEqual(["adultos_19_anos_ou_mais"]);
    expect(tabela?.rodape).toBe("*Percentual de valores diários fornecidos pela porção");
    expect(tabela?.linhas).toHaveLength(4);
  });

  it("converte snake_case do banco para camelCase do DTO", () => {
    const tabela = readNutritionTable(METADATA_UM_GRUPO);
    const ferro = tabela?.linhas.find((linha) => linha.item === "Ferro");

    expect(ferro).toEqual<NutritionTableRow>({
      item: "Ferro",
      nivel: 0,
      quantidade: 8.1,
      unidade: "mg",
      kj: null,
      vdPct: { adultos_19_anos_ou_mais: "PENDENTE" },
      nota: "laudo vencido - pedir laudo novo",
      provisorio: true,
      quantidade100: null,
    });
  });

  it("preserva vd_pct null numa linha sem %VD (discriminação, ex.: Açúcares totais)", () => {
    const tabela = readNutritionTable(METADATA_UM_GRUPO);
    const acucares = tabela?.linhas.find((linha) => linha.item === "Açúcares totais");

    expect(acucares?.vdPct).toBeNull();
    expect(acucares?.nivel).toBe(1);
  });

  it("assume nivel 0 quando a linha não informa nivel", () => {
    const tabela = readNutritionTable({
      tabela_nutricional: {
        porcoes_por_embalagem: "30",
        porcao: "1 g",
        grupos_vd: ["adultos"],
        linhas: [{ item: "Zinco", quantidade: 15, unidade: "mg", vd_pct: { adultos: 100 } }],
        rodape: null,
      },
    });

    expect(tabela?.linhas[0]?.nivel).toBe(0);
    expect(tabela?.linhas[0]?.provisorio).toBe(false);
  });

  it("lê corretamente uma tabela válida de 2 grupos (Multi Vitta: gestantes/lactantes)", () => {
    const tabela = readNutritionTable(METADATA_DOIS_GRUPOS);

    expect(tabela?.gruposVd).toEqual(["gestantes", "lactantes"]);
    expect(tabela?.linhas[0]?.vdPct).toEqual({ gestantes: 24, lactantes: 17 });
  });
});

describe("nutritionVdColumnLabel", () => {
  it("usa '%VD*' enxuto quando há um grupo só", () => {
    expect(nutritionVdColumnLabel("adultos_19_anos_ou_mais", 1)).toBe("%VD*");
  });

  it("inclui o nome do grupo quando há mais de um grupo", () => {
    expect(nutritionVdColumnLabel("gestantes", 2)).toBe("%VD* gestantes");
    expect(nutritionVdColumnLabel("lactantes", 2)).toBe("%VD* lactantes");
  });

  it("troca underscore por espaço (formatação do identificador, nunca tradução)", () => {
    expect(nutritionVdColumnLabel("adultos_19_anos_ou_mais", 2)).toBe("%VD* adultos 19 anos ou mais");
  });
});

describe("formatNutritionQuantity", () => {
  const linhaBase: NutritionTableRow = {
    item: "Zinco",
    nivel: 0,
    quantidade: 15,
    unidade: "mg",
    kj: null,
    vdPct: { adultos: 136 },
    nota: null,
    provisorio: false,
    quantidade100: null,
  };

  it("formata número + unidade no padrão brasileiro", () => {
    expect(formatNutritionQuantity(linhaBase)).toBe("15 mg");
  });

  it("usa travessão quando quantidade é null (memorial não permite recalcular)", () => {
    expect(formatNutritionQuantity({ ...linhaBase, quantidade: null })).toBe("—");
  });

  it("combina kcal e kJ na linha de Valor energético, quando kj está presente", () => {
    expect(formatNutritionQuantity({ ...linhaBase, item: "Valor energético", quantidade: 22, unidade: "kcal", kj: 91 })).toBe(
      "22 kcal = 91 kJ",
    );
  });

  it("não usa unidade quando ela é null", () => {
    expect(formatNutritionQuantity({ ...linhaBase, unidade: null })).toBe("15");
  });
});

describe("formatNutritionVdCell", () => {
  const linhaComVd: NutritionTableRow = {
    item: "Vitamina D",
    nivel: 0,
    quantidade: 40,
    unidade: "µg",
    kj: null,
    vdPct: { gestantes: 267, lactantes: "PENDENTE" },
    nota: null,
    provisorio: false,
    quantidade100: null,
  };

  it("formata percentual numérico como 'NN%'", () => {
    expect(formatNutritionVdCell(linhaComVd, "gestantes")).toBe("267%");
  });

  it("mantém o literal PENDENTE quando o Anexo VIII não tem referência", () => {
    expect(formatNutritionVdCell(linhaComVd, "lactantes")).toBe("PENDENTE");
  });

  it("devolve vazio quando a linha inteira não tem %VD (vd_pct null)", () => {
    const semVd: NutritionTableRow = { ...linhaComVd, vdPct: null };
    expect(formatNutritionVdCell(semVd, "gestantes")).toBe("");
  });

  it("devolve vazio quando o grupo pedido não existe nesta linha", () => {
    expect(formatNutritionVdCell(linhaComVd, "grupo-inexistente")).toBe("");
  });
});

// ---------------------------------------------------------------------------
// renderNutritionTableText - as duas fórmulas reais exigidas pela tarefa,
// lidas AO VIVO pela chave pública do Supabase em 16/09/2026:
//   curl -s ".../formulas?select=slug,nutritional_info,metadata&slug=in.(zma-zinco-magnesio-e-vitamina-d,multi-vitta-gestante-e-lactante-em-capsula)"
// ZMA_RAW/MULTI_VITTA_RAW é o metadata.tabela_nutricional exatamente como
// veio (snake_case); *_TEXTO_ESPERADO é o nutritional_info gravado, byte a
// byte (array + join("\n") de propósito, e não um template literal com
// quebras de linha cruas - uma linha como "  Açúcares totais | 0 g | "
// termina em espaço, e um formatador que "limpa espaço em fim de linha"
// destruiria o fixture sem avisar; dentro de uma string entre aspas isso
// nunca acontece).
// ---------------------------------------------------------------------------
describe("renderNutritionTableText", () => {
  const ZMA_RAW: NutritionTableInput = rawNutritionTableSchema.parse({
    porcoes_por_embalagem: "30",
    porcao: "1 g (2 cápsulas)",
    grupos_vd: ["adultos_19_anos_ou_mais"],
    rodape: "*Percentual de valores diários fornecidos pela porção",
    linhas: [
      { item: "Valor energético", nivel: 0, quantidade: 4, unidade: "kcal", kj: 17, vd_pct: { adultos_19_anos_ou_mais: 0 }, provisorio: true },
      { item: "Carboidratos", nivel: 0, quantidade: 0.3, unidade: "g", vd_pct: { adultos_19_anos_ou_mais: 0 }, provisorio: true },
      { item: "Açúcares totais", nivel: 1, quantidade: 0, unidade: "g", vd_pct: null, provisorio: false },
      { item: "Açúcares adicionados", nivel: 2, quantidade: 0, unidade: "g", vd_pct: { adultos_19_anos_ou_mais: 0 }, provisorio: false },
      { item: "Proteínas", nivel: 0, quantidade: 0.3, unidade: "g", vd_pct: { adultos_19_anos_ou_mais: 0 }, provisorio: true },
      { item: "L-teanina", nivel: 1, quantidade: 150, unidade: "mg", vd_pct: null, provisorio: true },
      { item: "Gorduras totais", nivel: 0, quantidade: 0, unidade: "g", vd_pct: { adultos_19_anos_ou_mais: 0 }, provisorio: false },
      { item: "Gorduras saturadas", nivel: 1, quantidade: 0, unidade: "g", vd_pct: { adultos_19_anos_ou_mais: 0 }, provisorio: false },
      { item: "Gorduras trans", nivel: 1, quantidade: 0, unidade: "g", vd_pct: { adultos_19_anos_ou_mais: 0 }, provisorio: false },
      { item: "Fibras alimentares", nivel: 0, quantidade: 0, unidade: "g", vd_pct: { adultos_19_anos_ou_mais: 0 }, provisorio: false },
      { item: "Sódio", nivel: 0, quantidade: 0, unidade: "mg", vd_pct: { adultos_19_anos_ou_mais: 0 }, provisorio: false },
      { item: "Vitamina D", nivel: 0, quantidade: 25, unidade: "µg", vd_pct: { adultos_19_anos_ou_mais: 167 }, provisorio: false },
      { item: "Vitamina B6", nivel: 0, quantidade: 1.3, unidade: "mg", vd_pct: { adultos_19_anos_ou_mais: 100 }, provisorio: false },
      { item: "Magnésio", nivel: 0, quantidade: 152, unidade: "mg", vd_pct: { adultos_19_anos_ou_mais: 36 }, provisorio: false },
      { item: "Zinco", nivel: 0, quantidade: 15, unidade: "mg", vd_pct: { adultos_19_anos_ou_mais: 136 }, provisorio: false },
      { item: "Boro", nivel: 0, quantidade: 3.1, unidade: "mg", vd_pct: null, provisorio: true },
    ],
  });

  const ZMA_TEXTO_ESPERADO = [
    "INFORMAÇÃO NUTRICIONAL",
    "Porções por embalagem: 30",
    "Porção: 1 g (2 cápsulas)",
    " | 1 g | %VD*",
    "Valor energético | 4 kcal = 17 kJ | 0%",
    "Carboidratos | 0,3 g | 0%",
    "  Açúcares totais | 0 g | ",
    "    Açúcares adicionados | 0 g | 0%",
    "Proteínas | 0,3 g | 0%",
    "  L-teanina | 150 mg | ",
    "Gorduras totais | 0 g | 0%",
    "  Gorduras saturadas | 0 g | 0%",
    "  Gorduras trans | 0 g | 0%",
    "Fibras alimentares | 0 g | 0%",
    "Sódio | 0 mg | 0%",
    "Vitamina D | 25 µg | 167%",
    "Vitamina B6 | 1,3 mg | 100%",
    "Magnésio | 152 mg | 36%",
    "Zinco | 15 mg | 136%",
    "Boro | 3,1 mg | ",
    "*Percentual de valores diários fornecidos pela porção",
  ].join("\n");

  const MULTI_VITTA_RAW: NutritionTableInput = rawNutritionTableSchema.parse({
    porcoes_por_embalagem: "30",
    porcao: "1 g (2 cápsulas)",
    grupos_vd: ["gestantes", "lactantes"],
    rodape: "*Percentual de valores diários fornecidos pela porção",
    linhas: [
      { item: "Valor energético", nivel: 0, quantidade: 0, unidade: "kcal", kj: 0, vd_pct: { gestantes: 0, lactantes: 0 }, provisorio: false },
      { item: "Carboidratos", nivel: 0, quantidade: 0, unidade: "g", vd_pct: { gestantes: 0, lactantes: 0 }, provisorio: false },
      { item: "Açúcares totais", nivel: 1, quantidade: 0, unidade: "g", vd_pct: null, provisorio: false },
      { item: "Açúcares adicionados", nivel: 2, quantidade: 0, unidade: "g", vd_pct: { gestantes: 0, lactantes: 0 }, provisorio: false },
      { item: "Proteínas", nivel: 0, quantidade: 0, unidade: "g", vd_pct: { gestantes: 0, lactantes: 0 }, provisorio: false },
      { item: "Gorduras totais", nivel: 0, quantidade: 0, unidade: "g", vd_pct: { gestantes: 0, lactantes: 0 }, provisorio: false },
      { item: "Gorduras saturadas", nivel: 1, quantidade: 0, unidade: "g", vd_pct: { gestantes: 0, lactantes: 0 }, provisorio: false },
      { item: "Gorduras trans", nivel: 1, quantidade: 0, unidade: "g", vd_pct: { gestantes: 0, lactantes: 0 }, provisorio: false },
      { item: "Fibras alimentares", nivel: 0, quantidade: 0, unidade: "g", vd_pct: { gestantes: 0, lactantes: 0 }, provisorio: false },
      { item: "Sódio", nivel: 0, quantidade: 0, unidade: "mg", vd_pct: { gestantes: 0, lactantes: 0 }, provisorio: true },
      { item: "Vitamina D", nivel: 0, quantidade: 50, unidade: "µg", vd_pct: { gestantes: 333, lactantes: 333 }, provisorio: false },
      { item: "Vitamina E", nivel: 0, quantidade: 5, unidade: "mg", vd_pct: { gestantes: 33, lactantes: 33 }, provisorio: true },
      { item: "Vitamina C", nivel: 0, quantidade: 20, unidade: "mg", vd_pct: { gestantes: 24, lactantes: 17 }, provisorio: false },
      { item: "Niacina", nivel: 0, quantidade: 8, unidade: "mg NE", vd_pct: { gestantes: 44, lactantes: 47 }, provisorio: false },
      { item: "Ácido pantotênico", nivel: 0, quantidade: 5, unidade: "mg", vd_pct: { gestantes: 83, lactantes: 71 }, provisorio: false },
      { item: "Ácido fólico", nivel: 0, quantidade: 1333, unidade: "µg DFE", vd_pct: { gestantes: 222, lactantes: 267 }, provisorio: true },
      { item: "Vitamina B12", nivel: 0, quantidade: 10, unidade: "µg", vd_pct: { gestantes: 385, lactantes: 357 }, provisorio: true },
      { item: "Cálcio", nivel: 0, quantidade: 300, unidade: "mg", vd_pct: { gestantes: 23, lactantes: 23 }, provisorio: false },
      { item: "Cobre", nivel: 0, quantidade: 900, unidade: "µg", vd_pct: { gestantes: 90, lactantes: 69 }, provisorio: false },
      { item: "Ferro", nivel: 0, quantidade: 8.1, unidade: "mg", vd_pct: { gestantes: 30, lactantes: 81 }, provisorio: true },
      { item: "Magnésio", nivel: 0, quantidade: 60, unidade: "mg", vd_pct: { gestantes: 15, lactantes: 17 }, provisorio: true },
    ],
  });

  const MULTI_VITTA_TEXTO_ESPERADO = [
    "INFORMAÇÃO NUTRICIONAL",
    "Porções por embalagem: 30",
    "Porção: 1 g (2 cápsulas)",
    " | 1 g | %VD* gestantes | %VD* lactantes",
    "Valor energético | 0 kcal = 0 kJ | 0% | 0%",
    "Carboidratos | 0 g | 0% | 0%",
    "  Açúcares totais | 0 g |  | ",
    "    Açúcares adicionados | 0 g | 0% | 0%",
    "Proteínas | 0 g | 0% | 0%",
    "Gorduras totais | 0 g | 0% | 0%",
    "  Gorduras saturadas | 0 g | 0% | 0%",
    "  Gorduras trans | 0 g | 0% | 0%",
    "Fibras alimentares | 0 g | 0% | 0%",
    "Sódio | 0 mg | 0% | 0%",
    "Vitamina D | 50 µg | 333% | 333%",
    "Vitamina E | 5 mg | 33% | 33%",
    "Vitamina C | 20 mg | 24% | 17%",
    "Niacina | 8 mg NE | 44% | 47%",
    "Ácido pantotênico | 5 mg | 83% | 71%",
    "Ácido fólico | 1.333 µg DFE | 222% | 267%",
    "Vitamina B12 | 10 µg | 385% | 357%",
    "Cálcio | 300 mg | 23% | 23%",
    "Cobre | 900 µg | 90% | 69%",
    "Ferro | 8,1 mg | 30% | 81%",
    "Magnésio | 60 mg | 15% | 17%",
    "*Percentual de valores diários fornecidos pela porção",
  ].join("\n");

  it("reproduz byte a byte o nutritional_info gravado de zma-zinco-magnesio-e-vitamina-d", () => {
    expect(renderNutritionTableText(toNutritionTable(ZMA_RAW))).toBe(ZMA_TEXTO_ESPERADO);
  });

  it("reproduz byte a byte o nutritional_info gravado de multi-vitta-gestante-e-lactante-em-capsula (2 grupos)", () => {
    expect(renderNutritionTableText(toNutritionTable(MULTI_VITTA_RAW))).toBe(MULTI_VITTA_TEXTO_ESPERADO);
  });

  it("usa PENDENTE (nunca travessão) e força %VD em branco quando quantidade é null", () => {
    // Caso real (emagrecedor-em-capsula, conferido ao vivo em 16/09/2026): a
    // linha de Valor energético tem quantidade null E vd_pct com "PENDENTE"
    // por grupo, mas o texto gravado mostra a célula de %VD em BRANCO, não
    // "PENDENTE" - a ausência de quantidade invalida o %VD inteiro da linha.
    const tabela = toNutritionTable(
      rawNutritionTableSchema.parse({
        porcoes_por_embalagem: "30",
        porcao: "1 g (2 cápsulas)",
        grupos_vd: ["adultos_19_anos_ou_mais"],
        rodape: "*Percentual de valores diários fornecidos pela porção",
        linhas: [
          { item: "Valor energético", quantidade: null, unidade: "kcal", vd_pct: { adultos_19_anos_ou_mais: "PENDENTE" } },
          { item: "Cromo", quantidade: 250, unidade: "µg", vd_pct: { adultos_19_anos_ou_mais: 714 } },
        ],
      }),
    );

    expect(renderNutritionTableText(tabela)).toBe(
      [
        "INFORMAÇÃO NUTRICIONAL",
        "Porções por embalagem: 30",
        "Porção: 1 g (2 cápsulas)",
        " | 1 g | %VD*",
        "Valor energético | PENDENTE | ",
        "Cromo | 250 µg | 714%",
        "*Percentual de valores diários fornecidos pela porção",
      ].join("\n"),
    );
  });
});

// ---------------------------------------------------------------------------
// mergeNutritionTableMetadata - nunca sobrescreve o jsonb inteiro.
// ---------------------------------------------------------------------------
describe("mergeNutritionTableMetadata", () => {
  const TABELA_MINIMA: NutritionTableInput = rawNutritionTableSchema.parse({
    porcoes_por_embalagem: "30",
    porcao: "1 g",
    grupos_vd: ["adultos"],
    linhas: [{ item: "Sódio", quantidade: 0, unidade: "mg", vd_pct: { adultos: 0 } }],
  });

  it("preserva as outras chaves de metadata (ex.: nutritional_info_anterior_2026_09_16)", () => {
    const metadataAtual: Json = {
      nutritional_info_anterior_2026_09_16: "texto antigo",
      outra_chave: 42,
      tabela_nutricional: { linhas: "formato velho, será substituído" },
    };

    const resultado = mergeNutritionTableMetadata(metadataAtual, TABELA_MINIMA);

    expect(resultado.nutritional_info_anterior_2026_09_16).toBe("texto antigo");
    expect(resultado.outra_chave).toBe(42);
    expect(resultado.tabela_nutricional).toEqual(TABELA_MINIMA);
  });

  it("nunca muta o objeto de metadata recebido (imutabilidade)", () => {
    const metadataAtual: Json = { chave_preexistente: "valor" };
    const congelado = Object.freeze({ ...metadataAtual });

    expect(() => mergeNutritionTableMetadata(congelado, TABELA_MINIMA)).not.toThrow();
    expect(congelado).toEqual({ chave_preexistente: "valor" });
  });

  it("parte de objeto vazio quando metadata atual é null, undefined ou não é um objeto", () => {
    expect(mergeNutritionTableMetadata(null, TABELA_MINIMA)).toEqual({ tabela_nutricional: TABELA_MINIMA });
    expect(mergeNutritionTableMetadata(undefined, TABELA_MINIMA)).toEqual({ tabela_nutricional: TABELA_MINIMA });
    expect(mergeNutritionTableMetadata("texto solto" as unknown as Json, TABELA_MINIMA)).toEqual({ tabela_nutricional: TABELA_MINIMA });
  });
});

// ---------------------------------------------------------------------------
// rawNutritionTableSchema - validação que a Server Action updateNutritionTable
// (lib/actions/formulas.ts) usa antes de gravar qualquer coisa vinda do editor.
// ---------------------------------------------------------------------------
describe("rawNutritionTableSchema (validação da entrada do editor)", () => {
  const TABELA_VALIDA = {
    porcoes_por_embalagem: "30",
    porcao: "1 g",
    grupos_vd: ["adultos"],
    linhas: [{ item: "Sódio", quantidade: 0, unidade: "mg", vd_pct: { adultos: 0 } }],
  };

  it("aceita uma tabela mínima válida", () => {
    expect(rawNutritionTableSchema.safeParse(TABELA_VALIDA).success).toBe(true);
  });

  it("aceita linha com item vazio (string) e transforma em PENDENTE (afrouxamento consciente, 17/09/2026)", () => {
    const comItemVazio = { ...TABELA_VALIDA, linhas: [{ ...TABELA_VALIDA.linhas[0], item: "" }] };
    const resultado = rawNutritionTableSchema.safeParse(comItemVazio);

    expect(resultado.success).toBe(true);
    if (resultado.success) expect(resultado.data.linhas[0]?.item).toBe("PENDENTE");
  });

  it("rejeita linha sem item nenhum (chave ausente)", () => {
    const linhaSemItem: Record<string, unknown> = { ...TABELA_VALIDA.linhas[0] };
    delete linhaSemItem.item;
    const invalida = { ...TABELA_VALIDA, linhas: [linhaSemItem] };
    const resultado = rawNutritionTableSchema.safeParse(invalida);

    expect(resultado.success).toBe(false);
  });

  it("rejeita %VD inválido (nem número, nem 'PENDENTE')", () => {
    const invalida = {
      ...TABELA_VALIDA,
      linhas: [{ ...TABELA_VALIDA.linhas[0], vd_pct: { adultos: "quase pendente" } }],
    };
    const resultado = rawNutritionTableSchema.safeParse(invalida);

    expect(resultado.success).toBe(false);
  });

  it("rejeita tabela sem nenhuma linha", () => {
    const invalida = { ...TABELA_VALIDA, linhas: [] };
    expect(rawNutritionTableSchema.safeParse(invalida).success).toBe(false);
  });

  it("rejeita tabela sem nenhum grupo de %VD", () => {
    const invalida = { ...TABELA_VALIDA, grupos_vd: [] };
    expect(rawNutritionTableSchema.safeParse(invalida).success).toBe(false);
  });

  it("aceita e aplica default false a por_100 quando ausente (compatível com as 24 fórmulas atuais)", () => {
    const resultado = rawNutritionTableSchema.safeParse(TABELA_VALIDA);
    expect(resultado.success).toBe(true);
    if (resultado.success) expect(resultado.data.por_100).toBe(false);
  });

  it("aceita quantidade_100 numérico quando a linha declara por 100 g/ml", () => {
    const comPor100 = { ...TABELA_VALIDA, por_100: true, linhas: [{ ...TABELA_VALIDA.linhas[0], quantidade_100: 0 }] };
    const resultado = rawNutritionTableSchema.safeParse(comPor100);
    expect(resultado.success).toBe(true);
  });
});
