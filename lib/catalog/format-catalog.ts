// Helpers de apresentação específicos do catálogo público. Ficam separados de
// lib/format.ts (que não pode ser alterado) porque são regra de domínio do
// catálogo, não utilidade genérica do projeto.
import { Candy, CupSoda, Droplet, Pill, type LucideIcon } from "lucide-react";

import type { Enums } from "@/lib/supabase/database.types";

export type ProductLine = Enums<"product_line">;
export type ProductFormat = Enums<"product_format">;
export type CompositionUnit = Enums<"composition_unit">;

// Rótulo de exibição de cada unidade aceita (AGENTS.md): banco grava em
// minúsculo ("l", "ui"), mas o texto correto para o cliente final é "L"/"UI".
const UNIT_LABELS: Record<CompositionUnit, string> = {
  g: "g",
  mg: "mg",
  mcg: "mcg",
  ml: "ml",
  l: "L",
  ui: "UI",
  kg: "kg",
};

export function unitLabel(unit: CompositionUnit): string {
  return UNIT_LABELS[unit];
}

// Formata a quantidade numérica no padrão brasileiro (vírgula decimal), sem
// arredondar e sem inventar casas decimais que o banco não gravou. O valor já
// vem exato da coluna `numeric` — aqui só troca "." por "," para exibição.
export function formatQuantity(quantity: number): string {
  return String(quantity).replace(".", ",");
}

const LINE_LABELS: Record<ProductLine, string> = {
  premium: "Premium",
  basica: "Básica",
};

export function lineLabel(line: ProductLine): string {
  return LINE_LABELS[line];
}

// Ícone só decorativo (não é dado do banco, é mapeamento fixo de formato ->
// componente de ícone de traço da lucide-react — chaves batem com o enum real
// product_format, não com os apelidos em português usados na prévia estática).
// Antes era emoji 3D; trocado por ícone de traço para um catálogo de indústria.
//
// Exportado como tabela (não como função) de propósito: quem usa isto em JSX
// precisa indexar o mapa diretamente (`FORMAT_ICONS[formula.format]`) pra não
// disparar o aviso do React Compiler de "componente criado durante o render"
// — uma chamada de função no meio do JSX parece, pra aquela análise estática,
// fábrica de componente novo a cada render, mesmo devolvendo sempre a mesma
// referência estável.
export const FORMAT_ICONS: Record<ProductFormat, LucideIcon> = {
  capsula: Pill,
  soluvel: CupSoda,
  gummy: Candy,
  liquido: Droplet,
};

// Campo nulo ou vazio nunca aparece na tela como "null"/"undefined" — o
// elemento correspondente é escondido. Este helper centraliza a checagem.
export function hasContent(value: string | null | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function hasItems<T>(value: readonly T[] | null | undefined): value is readonly T[] {
  return Array.isArray(value) && value.length > 0;
}

// Alguns benefícios já vêm do banco com marcador de lista embutido no próprio
// texto ("• Contribui para..."), herdado da fonte original em texto livre. O
// ✓ mostrado antes de cada item é CSS (::before em .lc-dossie-benefits-list,
// app/globals.css) - sem esta limpeza os dois marcadores aparecem juntos
// ("✓ • Contribui..."). Remove só o marcador do começo da string (bullet,
// hífen, asterisco e os espaços ao redor); o dado no banco continua intacto,
// isto muda apenas a exibição. Função pura: mesma entrada, mesma saída,
// nenhum efeito colateral - testável isoladamente.
const LEADING_BULLET_MARKER = /^\s*[•*-]+\s*/;

export function stripLeadingBulletMarker(text: string): string {
  return text.replace(LEADING_BULLET_MARKER, "");
}
