import type { Metadata } from "next";

import { CatalogView } from "@/components/catalog/CatalogView";
import { getCatalogData } from "@/lib/data/formulas";

export const metadata: Metadata = {
  title: "Catálogo — Lemon Caps",
  description: "Catálogo de fórmulas Lemon Caps: composição, modo de uso e cotação por pote.",
};

// Server Component: busca segmentos + fórmulas + composições de uma vez só
// (ver lib/data/formulas.ts) e entrega pronto para o filtro/busca client-side
// em CatalogView. Nunca toca formula_costs.
export default async function CatalogoPage() {
  const { segments, formulas } = await getCatalogData();

  return <CatalogView segments={segments} formulas={formulas} />;
}
