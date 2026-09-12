import type { Metadata } from "next";
import { Suspense } from "react";

import { CatalogView } from "@/components/catalog/CatalogView";
import { getCatalogData } from "@/lib/data/formulas";

export const metadata: Metadata = {
  title: "Catálogo - Lemon Caps",
  description: "Catálogo de fórmulas Lemon Caps: composição, modo de uso e cotação por pote.",
};

// Server Component: busca segmentos + fórmulas + composições de uma vez só
// (ver lib/data/formulas.ts) e entrega pronto para o filtro/busca client-side
// em CatalogView. Nunca toca formula_costs.
//
// O Suspense aqui é exigência do Next para quem usa useSearchParams (dentro
// de CatalogView, para refletir segmento/linha/busca na URL) — nada nesta
// página depende de um carregamento assíncrono de verdade além da busca dos
// dados acima, que já é aguardada antes de chegar ao client component.
//
// Resiliência: getCatalogData() já cacheia os dados (5 min, ver lib/data/formulas.ts)
// e relança qualquer falha de leitura como erro sóbrio; quem trata isso para o
// visitante é o error boundary da rota (./error.tsx — convenção do Next App
// Router, pega qualquer throw daqui para baixo automaticamente, sem precisar de
// try/catch nesta página). Catálogo genuinamente vazio (zero fórmulas ativas)
// não é erro: chega aqui como `formulas: []` normalmente, e é o EmptyState
// dentro de CatalogView (components/catalog/EmptyState.tsx) quem mostra esse
// estado — nunca a tela de erro.
export default async function CatalogoPage() {
  const { segments, formulas } = await getCatalogData();

  return (
    <Suspense fallback={null}>
      <CatalogView segments={segments} formulas={formulas} />
    </Suspense>
  );
}
