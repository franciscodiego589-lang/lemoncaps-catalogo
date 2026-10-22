import { describe, expect, it } from "vitest";

import { brlStringToCents, centsToBRL, centsToPlain } from "./money";

// Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }) separa
// "R$" do valor com um espaço fino invisível (U+00A0, NBSP), não um espaço
// comum (U+0020) - confirmado rodando a função de verdade antes de escrever
// este arquivo. Usar " " explícito evita um teste que parece certo no
// editor e falha sempre, por um caractere que não aparece na tela.
const NBSP = " ";

describe("centsToBRL", () => {
  it("formata centavos positivos como reais com vírgula decimal", () => {
    // Arranjar
    const centavos = 1690;

    // Agir
    const resultado = centsToBRL(centavos);

    // Conferir
    expect(resultado).toBe(`R$${NBSP}16,90`);
  });

  it("formata zero centavos como R$ 0,00", () => {
    const resultado = centsToBRL(0);
    expect(resultado).toBe(`R$${NBSP}0,00`);
  });

  it("formata centavos negativos com o sinal antes do R$, não depois", () => {
    const resultado = centsToBRL(-1690);
    expect(resultado).toBe(`-R$${NBSP}16,90`);
  });

  it("usa separador de milhar no padrão brasileiro para valores grandes", () => {
    const resultado = centsToBRL(100000);
    expect(resultado).toBe(`R$${NBSP}1.000,00`);
  });
});

describe("centsToPlain", () => {
  it("converte centavos positivos em string com vírgula, sem símbolo de moeda", () => {
    expect(centsToPlain(1690)).toBe("16,90");
  });

  it("converte zero centavos em 0,00", () => {
    expect(centsToPlain(0)).toBe("0,00");
  });

  it("mantém o sinal de negativo na conversão", () => {
    expect(centsToPlain(-1690)).toBe("-16,90");
  });

  it("preenche com zero à esquerda quando o valor é menor que 10 centavos", () => {
    expect(centsToPlain(5)).toBe("0,05");
  });
});

describe("brlStringToCents", () => {
  it("converte string com vírgula decimal em centavos", () => {
    expect(brlStringToCents("16,90")).toBe(1690);
  });

  it("converte string com ponto decimal em centavos", () => {
    expect(brlStringToCents("16.90")).toBe(1690);
  });

  it("aceita o prefixo R$ com espaço", () => {
    expect(brlStringToCents("R$ 16,90")).toBe(1690);
  });

  it("remove o separador de milhar antes de converter", () => {
    expect(brlStringToCents("1.234,56")).toBe(123456);
  });

  it("completa com zero quando falta a segunda casa decimal", () => {
    expect(brlStringToCents("16,9")).toBe(1690);
  });

  it("preserva o sinal negativo", () => {
    expect(brlStringToCents("-16,90")).toBe(-1690);
  });

  it("devolve null (nunca zero) para string vazia", () => {
    expect(brlStringToCents("")).toBeNull();
  });

  it("devolve null para texto que não é número", () => {
    expect(brlStringToCents("abc")).toBeNull();
  });

  it.each([
    ["8,165", "8.165 * 100 dá 816.4999999999999 em ponto flutuante"],
    ["4,205", "4.205 * 100 dá 420.50000000000006 em ponto flutuante"],
    ["1,005", "arredondamento perderia meio centavo"],
    ["4,999", "virava R$ 5,00 em silêncio antes desta função"],
  ])("recusa (devolve null) valor com três ou mais casas decimais: %s (%s)", (valorComTresCasas) => {
    // Caso real documentado em lib/money.ts: converter por multiplicação
    // flutuante arredondava errado sem avisar. A função atual recusa em vez
    // de arredondar, para nunca gravar um centavo que ninguém digitou.
    expect(brlStringToCents(valorComTresCasas)).toBeNull();
  });
});
