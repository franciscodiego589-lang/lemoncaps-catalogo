import Link from "next/link";
import { Suspense } from "react";

import { AdminFilterBar } from "@/components/admin/AdminFilterBar";
import { FormulaAdminTable } from "@/components/admin/FormulaAdminTable";
import { getAdminFormulas, getAdminSegments } from "@/lib/data/admin";

export const metadata = { title: "Catálogo · Lemon Caps Admin" };

interface CatalogoPageProps {
  searchParams: Promise<{ busca?: string; segmento?: string; situacao?: string }>;
}

export default async function AdminCatalogoPage({ searchParams }: CatalogoPageProps) {
  const params = await searchParams;
  const activeFilter = params.situacao === "active" || params.situacao === "inactive" ? params.situacao : "all";

  const [formulas, segments] = await Promise.all([
    getAdminFormulas({ search: params.busca, segmentId: params.segmento, activeFilter }),
    getAdminSegments(),
  ]);

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
