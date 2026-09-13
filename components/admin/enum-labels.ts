import type { CompositionUnit, IngredientCategory, ProductFormat, ProductLine, QuoteStatus } from "@/lib/data/admin";

// Rótulos em português dos enums do banco, só para exibição no admin - os
// valores gravados continuam exatamente os do enum (nunca traduzidos no
// banco). "l" e "ui" exibem maiúsculo (Litro/UI), mesma convenção do catálogo
// público (ver comentário do enum composition_unit em
// supabase/migrations/20260909210000_schema.sql).

export const PRODUCT_LINE_LABELS: Record<ProductLine, string> = {
  premium: "Premium",
  basica: "Básica",
};

export const PRODUCT_FORMAT_LABELS: Record<ProductFormat, string> = {
  capsula: "Cápsula",
  soluvel: "Solúvel",
  gummy: "Gummy",
  liquido: "Líquido",
};

export const COMPOSITION_UNIT_LABELS: Record<CompositionUnit, string> = {
  g: "g",
  mg: "mg",
  mcg: "mcg",
  ml: "ml",
  l: "L",
  ui: "UI",
  kg: "kg",
};

export const INGREDIENT_CATEGORY_LABELS: Record<IngredientCategory, string> = {
  vitamina: "Vitamina",
  mineral: "Mineral",
  aminoacido: "Aminoácido",
  extrato_vegetal: "Extrato vegetal",
  outro: "Outro",
};

export const QUOTE_STATUS_LABELS: Record<QuoteStatus, string> = {
  aberto: "Aberto",
  aprovado: "Aprovado",
  recusado: "Recusado",
  expirado: "Expirado",
};

// Modificador do selo visual (classe .lc-admin-badge--x) por status - reaproveita
// a mesma paleta de active/inactive/warning já usada para outros selos (ver
// ActiveToggle, IngredientAdminTable) em vez de inventar uma cor por valor.
export const QUOTE_STATUS_BADGE_VARIANT: Record<QuoteStatus, "info" | "active" | "warning" | "inactive"> = {
  aberto: "info",
  aprovado: "active",
  recusado: "warning",
  expirado: "inactive",
};

export function toSelectOptions<T extends string>(labels: Record<T, string>): { value: T; label: string }[] {
  return (Object.keys(labels) as T[]).map((value) => ({ value, label: labels[value] }));
}
