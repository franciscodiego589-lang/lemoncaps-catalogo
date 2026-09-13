import type { CompositionUnit, IngredientCategory, ProductFormat, ProductLine } from "@/lib/data/admin";

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

export function toSelectOptions<T extends string>(labels: Record<T, string>): { value: T; label: string }[] {
  return (Object.keys(labels) as T[]).map((value) => ({ value, label: labels[value] }));
}
