import { describe, expect, it } from "vitest";

import type { AdminQuoteExportRowDTO, QuoteStatus } from "@/lib/data/admin";

import { buildQuotesCsv } from "./quotes-csv";

// BOM UTF-8 que o Excel em português exige para não abrir o CSV com acento
// quebrado (ver comentário de CSV_BOM em lib/export/quotes-csv.ts).
const BOM = "﻿";

// Mesmo NBSP de lib/money.ts (centsToBRL) - "R$" e o valor são separados por
// U+00A0, não por espaço comum.
const NBSP = " ";

function buildRow(overrides: Partial<AdminQuoteExportRowDTO> = {}): AdminQuoteExportRowDTO {
  const base: AdminQuoteExportRowDTO = {
    quoteNumber: 42,
    customerName: "Cliente Teste",
    customerWhatsapp: "+5565992768964",
    createdAt: "2026-09-14T15:30:00.000Z",
    status: "aprovado" as QuoteStatus,
    quoteTotalPotes: 10,
    quoteTotalCents: 150000,
    quoteTotalProfitCents: 30000,
    itemFormulaName: "Fórmula X",
    itemPresentation: "Cápsula 500mg",
    itemQuantityPotes: 10,
    itemUnitPriceCents: 15000,
    itemLineTotalCents: 150000,
  };
  return { ...base, ...overrides };
}

// quoteExportRowToCsvRow usa toLocaleDateString/toLocaleTimeString("pt-BR")
// sem fuso horário explícito - o resultado depende do TZ do processo (tanto
// aqui no teste quanto em produção). Para o teste não quebrar num CI com TZ
// diferente desta máquina, a data/hora esperada é calculada do mesmo jeito
// que a função usa, nunca digitada como string fixa.
function dataEHoraEsperadas(isoString: string): { data: string; hora: string } {
  const createdAt = new Date(isoString);
  return {
    data: createdAt.toLocaleDateString("pt-BR"),
    hora: createdAt.toLocaleTimeString("pt-BR"),
  };
}

describe("buildQuotesCsv", () => {
  it("começa com o BOM UTF-8 seguido do cabeçalho fixo", () => {
    const csv = buildQuotesCsv([]);

    expect(csv.startsWith(BOM)).toBe(true);
    expect(csv).toContain(
      "Número do orçamento;Data;Hora;Status;Cliente;WhatsApp;Fórmula;Apresentação;" +
        "Quantidade de potes (item);Preço por pote;Subtotal do item;Total de potes (orçamento);" +
        "Total geral (orçamento);Lucro estimado (orçamento)",
    );
  });

  it("gera só o cabeçalho, terminado em CRLF, quando não há orçamentos", () => {
    const csv = buildQuotesCsv([]);
    const linhas = csv.slice(BOM.length).split("\r\n");

    expect(linhas).toHaveLength(2); // header + string vazia depois do \r\n final
    expect(linhas[1]).toBe("");
  });

  it("neutraliza nome de cliente que começa com = para não executar fórmula no Excel/LibreOffice", () => {
    // Caso obrigatório desta auditoria: o nome vem do formulário público do
    // carrinho, onde isValidCustomerName só exige que não seja vazio - nada
    // impede o visitante de digitar um payload de fórmula como nome.
    const linhaMaliciosa = "=cmd|'/c calc'!A1";

    const csv = buildQuotesCsv([buildRow({ customerName: linhaMaliciosa })]);

    expect(csv).toContain(`;'${linhaMaliciosa};`);
  });

  it.each(["+55 65 99999-0000", "-1", "@example", "\tTabulado"])(
    "neutraliza campo que começa com prefixo de fórmula: %s",
    (valorPerigoso) => {
      const csv = buildQuotesCsv([buildRow({ customerName: valorPerigoso })]);
      expect(csv).toContain(`'${valorPerigoso}`);
    },
  );

  it("não mexe em nome que não começa com caractere de fórmula", () => {
    const csv = buildQuotesCsv([buildRow({ customerName: "Cliente Normal" })]);
    expect(csv).toContain(";Cliente Normal;");
  });

  it("envolve em aspas e escapa aspas internas quando o campo contém aspas", () => {
    const csv = buildQuotesCsv([buildRow({ customerName: 'Nome com "aspas"' })]);
    expect(csv).toContain('"Nome com ""aspas"""');
  });

  it("envolve em aspas quando o campo contém o próprio separador (;)", () => {
    const csv = buildQuotesCsv([buildRow({ customerName: "Nome; com ponto e vírgula" })]);
    expect(csv).toContain('"Nome; com ponto e vírgula"');
  });

  it("grava campo nulo do item como célula vazia, nunca como 'null' ou 'não informado'", () => {
    const linhaSemItem = buildRow({
      itemFormulaName: null,
      itemPresentation: null,
      itemQuantityPotes: null,
      itemUnitPriceCents: null,
      itemLineTotalCents: null,
    });

    const csv = buildQuotesCsv([linhaSemItem]);

    expect(csv).not.toContain("null");
    expect(csv).not.toContain("não informado");
  });

  it("grava 'desconhecido' quando o lucro do orçamento é null (nunca zero disfarçado)", () => {
    const csv = buildQuotesCsv([buildRow({ quoteTotalProfitCents: null })]);
    expect(csv).toContain(";desconhecido");
  });

  it("formata os valores monetários em reais (centsToBRL), nunca em centavos crus", () => {
    const csv = buildQuotesCsv([buildRow({ itemUnitPriceCents: 1690 })]);

    expect(csv).toContain(`R$${NBSP}16,90`);
    expect(csv).not.toContain(";1690;");
  });

  it("usa a mesma data/hora locais que toLocaleDateString/toLocaleTimeString('pt-BR') produzem", () => {
    const isoCriacao = "2026-09-14T15:30:00.000Z";
    const { data, hora } = dataEHoraEsperadas(isoCriacao);

    const csv = buildQuotesCsv([buildRow({ createdAt: isoCriacao })]);

    expect(csv).toContain(`;${data};${hora};`);
  });

  it.each([
    ["aberto", "Aberto"],
    ["aprovado", "Aprovado"],
    ["recusado", "Recusado"],
    ["expirado", "Expirado"],
  ] satisfies [QuoteStatus, string][])("traduz o status %s para o rótulo em português %s", (status, rotulo) => {
    const csv = buildQuotesCsv([buildRow({ status })]);
    expect(csv).toContain(`;${rotulo};`);
  });

  it("gera uma linha por item, repetindo os dados do orçamento em cada uma", () => {
    const csv = buildQuotesCsv([
      buildRow({ quoteNumber: 1, itemFormulaName: "Fórmula A" }),
      buildRow({ quoteNumber: 1, itemFormulaName: "Fórmula B" }),
    ]);
    const linhasDeDados = csv.slice(BOM.length).split("\r\n").slice(1, -1);

    expect(linhasDeDados).toHaveLength(2);
    expect(linhasDeDados[0]).toContain("Fórmula A");
    expect(linhasDeDados[1]).toContain("Fórmula B");
  });

  it("termina o arquivo em CRLF, não em LF sozinho - formato que o Excel espera", () => {
    const csv = buildQuotesCsv([buildRow()]);

    expect(csv.endsWith("\r\n")).toBe(true);
    expect(csv.replace(/\r\n/g, "")).not.toContain("\n");
  });
});
