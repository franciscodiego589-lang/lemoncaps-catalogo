import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { NutritionTable as NutritionTableData } from "@/lib/catalog/nutrition-table";
import { NutritionTable } from "./NutritionTable";

// Componente de servidor puro (sem estado, sem efeito) - renderToStaticMarkup
// basta para conferir o HTML gerado, sem precisar de jsdom/testing-library
// (o projeto não usa nenhum dos dois hoje; vitest.config.ts roda em
// environment "node").
//
// Modelo vertical da Anvisa (IN 75/2020, Anexo XII - ver comentário de
// procedência no topo de NutritionTable.tsx): item carrega a unidade entre
// parênteses no NOME, a célula de valor mostra só o número, e não existe
// kJ em lugar nenhum do modelo vigente.
const TABELA_UM_GRUPO: NutritionTableData = {
  porcoesPorEmbalagem: "30",
  porcao: "1 g (2 cápsulas)",
  gruposVd: ["adultos_19_anos_ou_mais"],
  rodape: "*Percentual de valores diários fornecidos pela porção",
  por100: false,
  linhas: [
    {
      item: "Valor energético",
      nivel: 0,
      quantidade: 22,
      unidade: "kcal",
      kj: 91,
      vdPct: { adultos_19_anos_ou_mais: 1 },
      nota: null,
      provisorio: false,
      quantidade100: null,
    },
    {
      item: "Açúcares totais",
      nivel: 1,
      quantidade: 0,
      unidade: "g",
      kj: null,
      vdPct: null,
      nota: null,
      provisorio: false,
      quantidade100: null,
    },
    {
      item: "Ferro",
      nivel: 0,
      quantidade: 8.1,
      unidade: "mg",
      kj: null,
      vdPct: { adultos_19_anos_ou_mais: "PENDENTE" },
      nota: "laudo vencido",
      provisorio: true,
      quantidade100: null,
    },
  ],
};

const TABELA_DOIS_GRUPOS: NutritionTableData = {
  porcoesPorEmbalagem: "30",
  porcao: "1 g (2 cápsulas)",
  gruposVd: ["gestantes", "lactantes"],
  rodape: "*Percentual de valores diários fornecidos pela porção",
  por100: false,
  linhas: [
    {
      item: "Vitamina C",
      nivel: 0,
      quantidade: 20,
      unidade: "mg",
      kj: null,
      vdPct: { gestantes: 24, lactantes: 17 },
      nota: null,
      provisorio: false,
      quantidade100: null,
    },
  ],
};

const TABELA_POR_100: NutritionTableData = {
  porcoesPorEmbalagem: "30",
  porcao: "10 g (1 dose)",
  gruposVd: ["adultos_19_anos_ou_mais"],
  rodape: "*Percentual de valores diários fornecidos pela porção",
  por100: true,
  linhas: [
    {
      item: "Sódio",
      nivel: 0,
      quantidade: 5,
      unidade: "mg",
      kj: null,
      vdPct: { adultos_19_anos_ou_mais: 0 },
      nota: null,
      provisorio: false,
      quantidade100: 50,
    },
  ],
};

describe("NutritionTable", () => {
  it("renderiza caption, as duas linhas de meta-informação e 1 coluna de %VD", () => {
    const html = renderToStaticMarkup(<NutritionTable table={TABELA_UM_GRUPO} />);

    expect(html).toContain("Informação nutricional");
    expect(html).toContain("Porções por embalagem");
    expect(html).toContain("Porção");
    expect(html).toContain("1 g (2 cápsulas)");
    // Um grupo só -> cabeçalho enxuto, sem sufixo de grupo.
    expect(html).toContain("%VD*");
    expect(html).not.toContain("%VD* adultos");

    // Uma coluna de %VD -> exatamente 1 <th> com a classe lc-nutri-vd no cabeçalho de colunas.
    const colunasVdNoCabecalho = html.match(/<th scope="col" class="lc-nutri-vd">/g) ?? [];
    expect(colunasVdNoCabecalho).toHaveLength(1);
  });

  it("cabeçalho de coluna usa a porção resumida (corta a partir do primeiro ' (')", () => {
    const html = renderToStaticMarkup(<NutritionTable table={TABELA_UM_GRUPO} />);

    // "1 g" aparece como título de coluna (centralizado, th próprio) -
    // distinto da linha de meta "Porção: 1 g (2 cápsulas)" (texto completo).
    expect(html).toMatch(/<tr class="lc-nutri-col-headers">[\s\S]*?<th scope="col" class="lc-nutri-qty">1 g<\/th>/);
  });

  it("o nome do item carrega a unidade entre parênteses, e a célula de valor mostra só o número (sem kJ)", () => {
    const html = renderToStaticMarkup(<NutritionTable table={TABELA_UM_GRUPO} />);

    expect(html).toContain("Valor energético (kcal)");
    // A célula de valor é só "22" - nunca "22 kcal" nem "22 kcal = 91 kJ" (a
    // norma vigente, IN 75/2020 + RDC 429/2020, não menciona kJ em lugar
    // nenhum - ver comentário de procedência no topo de NutritionTable.tsx).
    expect(html).toContain('<td class="lc-nutri-qty">22</td>');
    expect(html).not.toContain("kJ");
    expect(html).not.toContain("91");
  });

  it("renderiza uma coluna de %VD por grupo quando a tabela tem 2 grupos (Multi Vitta)", () => {
    const html = renderToStaticMarkup(<NutritionTable table={TABELA_DOIS_GRUPOS} />);

    expect(html).toContain("%VD* gestantes");
    expect(html).toContain("%VD* lactantes");
    expect(html).toContain("24%");
    expect(html).toContain("17%");

    const colunasVdNoCabecalho = html.match(/<th scope="col" class="lc-nutri-vd">/g) ?? [];
    expect(colunasVdNoCabecalho).toHaveLength(2);
  });

  it("deixa a célula de %VD vazia quando a linha não tem %VD (ex.: Açúcares totais)", () => {
    const html = renderToStaticMarkup(<NutritionTable table={TABELA_UM_GRUPO} />);

    expect(html).toContain("Açúcares totais (g)");
    const linha = html.match(/Açúcares totais \(g\)<\/th>(<td[^>]*>[^<]*<\/td>)(<td[^>]*>[^<]*<\/td>)/);

    expect(linha).not.toBeNull();
    expect(linha?.[1]).toBe('<td class="lc-nutri-qty">0</td>');
    expect(linha?.[2]).toBe('<td class="lc-nutri-vd"></td>');
  });

  it("marca linha provisória com título discreto, sem nunca esconder o dado real", () => {
    const html = renderToStaticMarkup(<NutritionTable table={TABELA_UM_GRUPO} />);

    expect(html).toContain("lc-nutri-row--provisorio");
    expect(html).toContain('title="laudo vencido"');
    expect(html).toContain("(dado provisório: laudo vencido)");
    // O dado em si continua exibido por inteiro - "discreto" não é "escondido".
    expect(html).toContain('<td class="lc-nutri-qty">8,1</td>');
    expect(html).toContain("PENDENTE");
  });

  it("não marca como provisória uma linha comum", () => {
    const html = renderToStaticMarkup(<NutritionTable table={TABELA_DOIS_GRUPOS} />);

    expect(html).not.toContain("lc-nutri-row--provisorio");
  });

  it("sem por100, não mostra a coluna nem a célula de 100 g/ml", () => {
    const html = renderToStaticMarkup(<NutritionTable table={TABELA_UM_GRUPO} />);

    expect(html).not.toContain(">100 g<");
  });

  it("com por100 ligado, mostra a coluna '100 g' antes da porção e a célula com o valor por 100 g", () => {
    const html = renderToStaticMarkup(<NutritionTable table={TABELA_POR_100} />);

    expect(html).toMatch(
      /<tr class="lc-nutri-col-headers">[\s\S]*?<th scope="col" class="lc-nutri-qty">100 g<\/th>[\s\S]*?<th scope="col" class="lc-nutri-qty">10 g<\/th>/,
    );
    // Sódio: quantidade (por porção) 5, quantidade100 50 - as duas aparecem,
    // a de 100 g primeiro (mesma ordem das colunas do cabeçalho).
    expect(html).toContain('<td class="lc-nutri-qty">50</td><td class="lc-nutri-qty">5</td>');
  });

  it("a ordem visual é: meta (porções/porção) antes do cabeçalho de colunas, antes das linhas de nutriente", () => {
    const html = renderToStaticMarkup(<NutritionTable table={TABELA_UM_GRUPO} />);

    const indicePorcoes = html.indexOf("Porções por embalagem");
    const indicePorcao = html.indexOf(">Porção<");
    const indiceCabecalhoColunas = html.indexOf('class="lc-nutri-col-headers"');
    const indicePrimeiroNutriente = html.indexOf("Valor energético (kcal)");

    expect(indicePorcoes).toBeGreaterThan(-1);
    expect(indicePorcao).toBeGreaterThan(indicePorcoes);
    expect(indiceCabecalhoColunas).toBeGreaterThan(indicePorcao);
    expect(indicePrimeiroNutriente).toBeGreaterThan(indiceCabecalhoColunas);
  });
});
