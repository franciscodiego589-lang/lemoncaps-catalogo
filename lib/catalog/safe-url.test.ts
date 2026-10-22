import { describe, expect, it } from "vitest";

import { safeExternalUrl } from "./safe-url";

describe("safeExternalUrl", () => {
  it("aceita URL http e devolve o href normalizado", () => {
    // Arranjar
    const url = "http://example.com";

    // Agir
    const resultado = safeExternalUrl(url);

    // Conferir
    expect(resultado).toBe("http://example.com/");
  });

  it("aceita URL https e preserva path e query string", () => {
    expect(safeExternalUrl("https://example.com/x?y=1")).toBe("https://example.com/x?y=1");
  });

  it("remove espaços nas pontas antes de validar", () => {
    expect(safeExternalUrl("  https://example.com  ")).toBe("https://example.com/");
  });

  it("normaliza o protocolo para minúsculo", () => {
    expect(safeExternalUrl("HTTPS://EXAMPLE.COM")).toBe("https://example.com/");
  });

  it.each([
    ["javascript:alert(1)"],
    ["data:text/html,<script>alert(1)</script>"],
    ["file:///etc/passwd"],
    ["vbscript:msgbox(1)"],
  ])("recusa (devolve null) o protocolo perigoso %s", (valorPerigoso) => {
    // Caso obrigatório desta auditoria: compliance_source vem digitado no
    // admin e vira href na página pública e no PDF do dossiê.
    expect(safeExternalUrl(valorPerigoso)).toBeNull();
  });

  it("devolve null para string vazia", () => {
    expect(safeExternalUrl("")).toBeNull();
  });

  it("devolve null para null", () => {
    expect(safeExternalUrl(null)).toBeNull();
  });

  it("devolve null para undefined", () => {
    expect(safeExternalUrl(undefined)).toBeNull();
  });

  it("devolve null para texto que não é URL", () => {
    expect(safeExternalUrl("not a url")).toBeNull();
  });

  it("devolve null para URL relativa ao protocolo (//host, sem esquema)", () => {
    expect(safeExternalUrl("//example.com")).toBeNull();
  });

  it("devolve null para caminho relativo", () => {
    expect(safeExternalUrl("/relative/path")).toBeNull();
  });

  it("nunca devolve string vazia nem #, mesmo recusando - o link deve sumir, não quebrar", () => {
    const resultado = safeExternalUrl("javascript:alert(1)");
    expect(resultado).not.toBe("");
    expect(resultado).not.toBe("#");
    expect(resultado).toBeNull();
  });
});
