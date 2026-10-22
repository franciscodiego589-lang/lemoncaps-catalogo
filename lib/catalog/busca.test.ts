import { describe, expect, it } from "vitest";

import { normalizarBusca } from "@/lib/catalog/format-catalog";

// Bug encontrado exercitando o site em 14/09/2026: quem digitava "colageno" sem
// acento não achava o Colágeno — e digitar sem acento é o normal de quem tem
// pressa, ainda mais no celular.
describe("normalizarBusca", () => {
  it("tira o acento para o termo sem acento achar a palavra acentuada", () => {
    expect(normalizarBusca("Colágeno")).toBe("colageno");
    expect(normalizarBusca("colageno")).toBe("colageno");
  });

  it("acha a fórmula acentuada quando o visitante digita sem acento", () => {
    const nome = "SHOT + COLÁGENO 300 GRAMAS";
    expect(normalizarBusca(nome).includes(normalizarBusca("colageno"))).toBe(true);
  });

  it("continua achando quando o visitante digita COM acento", () => {
    const nome = "SHOT + COLÁGENO 300 GRAMAS";
    expect(normalizarBusca(nome).includes(normalizarBusca("colágeno"))).toBe(true);
  });

  it("cobre os acentos do português, não só o agudo", () => {
    expect(normalizarBusca("Múltiplas Ações Não-Cítricas")).toBe("multiplas acoes nao-citricas");
  });

  it("ignora caixa e espaço nas pontas", () => {
    expect(normalizarBusca("  CREATINA  ")).toBe("creatina");
  });

  it("aceita texto vazio sem quebrar", () => {
    expect(normalizarBusca("")).toBe("");
  });
});
