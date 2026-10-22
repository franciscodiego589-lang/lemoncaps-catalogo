import Link from "next/link";
import { Suspense } from "react";
import { Star } from "lucide-react";

import { AdminFilterBar } from "@/components/admin/AdminFilterBar";
import { CatalogLinesPanel } from "@/components/admin/CatalogLinesPanel";
import { FormulaAdminTable } from "@/components/admin/FormulaAdminTable";
import { destaquesEmExcesso, limiteDeDestaques } from "@/lib/catalog/featured";
import { getAdminCatalogLines, getAdminFeaturedSummary, getAdminFormulas, getAdminSegments } from "@/lib/data/admin";

export const metadata = { title: "Catálogo · Lemon Caps Admin" };

interface CatalogoPageProps {
  searchParams: Promise<{ busca?: string; segmento?: string; situacao?: string }>;
}

export default async function AdminCatalogoPage({ searchParams }: CatalogoPageProps) {
  const params = await searchParams;
  const activeFilter = params.situacao === "active" || params.situacao === "inactive" ? params.situacao : "all";

  const [formulas, segments, destaques, catalogLines] = await Promise.all([
    getAdminFormulas({ search: params.busca, segmentId: params.segmento, activeFilter }),
    getAdminSegments(),
    getAdminFeaturedSummary(),
    getAdminCatalogLines(),
  ]);

  // Aviso, nunca trava (decisão do dono): destacar meia vitrine é uma escolha
  // legítima numa campanha, mas quem faz isso precisa ver escrito que o selo
  // parou de destacar coisa nenhuma. A régua vive em lib/catalog/featured.ts.
  const excessoDeDestaques = destaquesEmExcesso(destaques.featuredCount, destaques.activeCount);

  return (
    <>
      <div className="lc-admin-page-head">
        <div>
          <h1>Catálogo</h1>
          <p>{formulas.length} fórmula{formulas.length === 1 ? "" : "s"} encontrada{formulas.length === 1 ? "" : "s"} para este filtro.</p>
        </div>
        <Link href="/admin/catalogo/novo" className="lc-btn lc-btn-primary">
          Nova fórmula
        </Link>
      </div>

      <CatalogLinesPanel lines={catalogLines} />

      {excessoDeDestaques && (
        // role="status": o aviso pode nascer de um clique no botão de destaque
        // (a página se refaz), e quem usa leitor de tela precisa ouvir que ele
        // apareceu, sem perder o foco de onde estava.
        <div className="lc-admin-aviso-destaques" role="status">
          <Star size={17} aria-hidden="true" />
          <p>
            <strong>
              {destaques.featuredCount} de {destaques.activeCount} fórmulas ativas estão em destaque.
            </strong>{" "}
            Acima de {limiteDeDestaques(destaques.activeCount)}, o selo deixa de separar o que importa — se tudo é destaque, o cliente
            para de ver destaque nenhum. Nada foi bloqueado: é só um alerta.
          </p>
        </div>
      )}

      <Suspense fallback={null}>
        <AdminFilterBar
          searchParam="busca"
          searchLabel="Buscar por nome"
          searchPlaceholder="Ex.: Multivitamínico"
          selects={[
            {
              param: "segmento",
              label: "Segmento",
              options: [{ value: "", label: "Todos" }, ...segments.map((s) => ({ value: s.id, label: s.name }))],
            },
            {
              param: "situacao",
              label: "Situação",
              options: [
                { value: "all", label: "Todas" },
                { value: "active", label: "Ativas" },
                { value: "inactive", label: "Inativas" },
              ],
            },
          ]}
        />
      </Suspense>

      <FormulaAdminTable formulas={formulas} />
    </>
  );
}
