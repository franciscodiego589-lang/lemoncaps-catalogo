import type { ReactNode } from "react";

import { requireQuoteManagerPage } from "@/lib/data/admin";

// Trava extra da aba Orçamentos (item 8 da tarefa): só quem tem
// can_manage_quotes acessa qualquer página abaixo de /admin/orcamentos -
// checada aqui UMA VEZ para todo o subgrupo de rotas, e de novo, independente
// disto, dentro de cada Server Action (lib/actions/quotes.ts,
// requireQuoteManagerAction) - nunca confia só no layout.
export default async function OrcamentosLayout({ children }: { children: ReactNode }) {
  await requireQuoteManagerPage();
  return children;
}
