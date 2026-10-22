import { describe, expect, it } from "vitest";

import type { ProductFormat } from "./format-catalog";
import {
  ALL_FORMATS,
  availableLines,
  deriveFormatTabs,
  filterCatalogFormulas,
  type FilterableFormula,
} from "./catalog-filters";

describe("availableLines", () => {
  it("põe Premium antes de Essencial, independente da ordem das fórmulas", () => {
    expect(availableLines([{ line: "essencial" }, { line: "premium" }, { line: "essencial" }])).toEqual([
      "premium",
      "essencial",
    ]);
  });

  it("põe Lemon Caps depois de Premium e Econômica", () => {
    expect(availableLines([{ line: "lemon_caps" }, { line: "essencial" }, { line: "premium" }])).toEqual([
      "premium",
      "essencial",
      "lemon_caps",
    ]);
  });

  it("devolve uma linha só quando todas as fórmulas são da mesma linha (sem abas)", () => {
    expect(availableLines([{ line: "premium" }, { line: "premium" }])).toEqual(["premium"]);
  });

  it("não esconde fórmula de linha fora da ordem: 'basica' ativa aparece no fim", () => {
    expect(availableLines([{ line: "basica" }, { line: "premium" }])).toEqual(["premium", "basica"]);
  });

  it("catálogo vazio não gera aba nenhuma", () => {
    expect(availableLines([])).toEqual([]);
  });
});

// Rótulos mínimos para o teste — não importa o arquivo real de
// components/admin/enum-labels.ts de propósito: mantém este módulo puro
// desacoplado de qualquer coisa fora de lib/catalog.
const LABELS: Record<ProductFormat, string> = {
  capsula: "Cápsula",
  soluvel: "Solúvel",
  gummy: "Gummy",
  liquido: "Líquido",
};

// Cinco fórmulas fictícias, três segmentos, quatro formatos — o suficiente
// para exercitar segmento×formato×busca sem repetir a mesma combinação duas
// vezes. Nomes cobrem o caso de acento (Colágeno), já testado em
// normalizarBusca (format-catalog.test.ts); aqui o que importa é a
// integração dentro do filtro combinado, não a normalização em si.
const FORMULAS: FilterableFormula[] = [
  { segmentId: "emagrecimento", format: "capsula", name: "Moro Slim" },
  { segmentId: "emagrecimento", format: "liquido", name: "Shot Detox" },
  { segmentId: "imunidade", format: "capsula", name: "Vitamina C" },
  { segmentId: "imunidade", format: "gummy", name: "Gummy Imuno" },
  { segmentId: "pele", format: "soluvel", name: "Colágeno Puro" },
];

describe("filterCatalogFormulas", () => {
  it("sem nenhum critério ativo devolve todas as fórmulas", () => {
    const resultado = filterCatalogFormulas(FORMULAS, { segmentId: null, format: ALL_FORMATS, searchTerm: "" });
    expect(resultado).toHaveLength(5);
  });

  it("filtra só por segmento quando formato é Todos e busca está vazia", () => {
    const resultado = filterCatalogFormulas(FORMULAS, { segmentId: "emagrecimento", format: ALL_FORMATS, searchTerm: "" });
    expect(resultado.map((f) => f.name).sort()).toEqual(["Moro Slim", "Shot Detox"]);
  });

  it("filtra só por formato quando segmento é null e busca está vazia", () => {
    const resultado = filterCatalogFormulas(FORMULAS, { segmentId: null, format: "capsula", searchTerm: "" });
    expect(resultado.map((f) => f.name).sort()).toEqual(["Moro Slim", "Vitamina C"]);
  });

  it("filtra só por busca, achando nome acentuado a partir de termo sem acento", () => {
    const resultado = filterCatalogFormulas(FORMULAS, { segmentId: null, format: ALL_FORMATS, searchTerm: "colageno" });
    expect(resultado.map((f) => f.name)).toEqual(["Colágeno Puro"]);
  });

  it("combina segmento e formato (interseção real, ambos com produto)", () => {
    const resultado = filterCatalogFormulas(FORMULAS, { segmentId: "imunidade", format: "gummy", searchTerm: "" });
    expect(resultado.map((f) => f.name)).toEqual(["Gummy Imuno"]);
  });

  it("combina segmento e formato sem produto correspondente e devolve lista vazia", () => {
    const resultado = filterCatalogFormulas(FORMULAS, { segmentId: "emagrecimento", format: "gummy", searchTerm: "" });
    expect(resultado).toEqual([]);
  });

  it("combina os três filtros ao mesmo tempo (segmento + formato + busca)", () => {
    const resultado = filterCatalogFormulas(FORMULAS, { segmentId: "imunidade", format: "capsula", searchTerm: "vitamina" });
    expect(resultado.map((f) => f.name)).toEqual(["Vitamina C"]);
  });

  it("três filtros combinados sem interseção real devolvem lista vazia", () => {
    const resultado = filterCatalogFormulas(FORMULAS, { segmentId: "imunidade", format: "capsula", searchTerm: "colageno" });
    expect(resultado).toEqual([]);
  });
});

describe("deriveFormatTabs", () => {
  it("gera a aba Todos com a contagem do contexto atual (sem segmento nem busca)", () => {
    const tabs = deriveFormatTabs(FORMULAS, { segmentId: null, searchTerm: "" }, LABELS);
    expect(tabs[0]).toEqual({ value: "all", label: "Todos", count: 5 });
  });

  it("gera uma aba por formato existente nos dados, na ordem cápsula, gummy, solúvel, líquido", () => {
    const tabs = deriveFormatTabs(FORMULAS, { segmentId: null, searchTerm: "" }, LABELS);
    expect(tabs.slice(1).map((tab) => tab.value)).toEqual(["capsula", "gummy", "soluvel", "liquido"]);
    expect(tabs.slice(1).map((tab) => tab.label)).toEqual(["Cápsula", "Gummy", "Solúvel", "Líquido"]);
  });

  it("não gera aba para um formato sem nenhum produto no catálogo inteiro", () => {
    const semLiquido = FORMULAS.filter((f) => f.format !== "liquido");
    const tabs = deriveFormatTabs(semLiquido, { segmentId: null, searchTerm: "" }, LABELS);
    expect(tabs.map((tab) => tab.value)).not.toContain("liquido");
  });

  it("a contagem de cada aba reflete o segmento selecionado, mas a aba continua visível mesmo com contagem zero", () => {
    const tabs = deriveFormatTabs(FORMULAS, { segmentId: "imunidade", searchTerm: "" }, LABELS);
    const porValor = Object.fromEntries(tabs.map((tab) => [tab.value, tab.count]));
    expect(porValor).toEqual({ all: 2, capsula: 1, gummy: 1, soluvel: 0, liquido: 0 });
    // As quatro abas de formato continuam presentes (o catálogo inteiro tem
    // produto em cada uma) — é isto que permite a interseção
    // segmento×formato zerada acontecer de verdade (estado vazio da UI).
    expect(tabs.map((tab) => tab.value)).toEqual(["all", "capsula", "gummy", "soluvel", "liquido"]);
  });

  it("a contagem também reflete o termo de busca atual", () => {
    const tabs = deriveFormatTabs(FORMULAS, { segmentId: null, searchTerm: "colageno" }, LABELS);
    const porValor = Object.fromEntries(tabs.map((tab) => [tab.value, tab.count]));
    expect(porValor).toEqual({ all: 1, capsula: 0, gummy: 0, soluvel: 1, liquido: 0 });
  });

  it("formato fora do rótulo mapeado usa o próprio valor do enum como rótulo (drift de schema)", () => {
    // Simula o dia em que o banco tiver um formato novo antes do rótulo em
    // português existir — nunca deve quebrar nem inventar um nome bonito, só
    // mostrar o valor cru como está no banco (regra de exatidão: nunca supor).
    const comFormatoEstranho: FilterableFormula[] = [
      ...FORMULAS,
      { segmentId: "novidade", format: "spray" as ProductFormat, name: "Spray Nasal" },
    ];
    const tabs = deriveFormatTabs(comFormatoEstranho, { segmentId: null, searchTerm: "" }, LABELS);
    const abaEstranha = tabs.find((tab) => (tab.value as string) === "spray");
    expect(abaEstranha).toEqual({ value: "spray", label: "spray", count: 1 });
    // E aparece depois das quatro abas conhecidas, nunca embaralhada entre elas.
    expect(tabs.map((tab) => tab.value)).toEqual(["all", "capsula", "gummy", "soluvel", "liquido", "spray"]);
  });
});
