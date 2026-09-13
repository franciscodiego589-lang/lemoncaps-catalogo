import Link from "next/link";
import { Suspense } from "react";

import { AdminFilterBar } from "@/components/admin/AdminFilterBar";
import { INGREDIENT_CATEGORY_LABELS } from "@/components/admin/enum-labels";
import { IngredientAdminTable } from "@/components/admin/IngredientAdminTable";
import { getAdminIngredients, type IngredientCategory } from "@/lib/data/admin";

export const metadata = { title: "Insumos · Lemon Caps Admin" };

interface InsumosPageProps {
  searchParams: Promise<{ busca?: string; categoria?: string }>;
}

const CATEGORY_VALUES = Object.keys(INGREDIENT_CATEGORY_LABELS) as IngredientCategory[];

export default async function AdminInsumosPage({ searchParams }: InsumosPageProps) {
  const params = await searchParams;
  const category = CATEGORY_VALUES.includes(params.categoria as IngredientCategory) ? (params.categoria as IngredientCategory) : undefined;

  const ingredients = await getAdminIngredients({ search: params.busca, category });

  return (
    <>
      <div className="lc-admin-page-head">
        <div>
          <h1>Insumos</h1>
          <p>{ingredients.length} insumo{ingredients.length === 1 ? "" : "s"} encontrado{ingredients.length === 1 ? "" : "s"}.</p>
        </div>
        <Link href="/admin/insumos/novo" className="lc-btn lc-btn-primary">
          Novo insumo
        </Link>
      </div>

      <Suspense fallback={null}>
        <AdminFilterBar
          searchParam="busca"
          searchLabel="Buscar por nome"
          searchPlaceholder="Ex.: Vitamina C"
          selects={[
            {
              param: "categoria",
              label: "Categoria",
              options: [{ value: "", label: "Todas" }, ...CATEGORY_VALUES.map((value) => ({ value, label: INGREDIENT_CATEGORY_LABELS[value] }))],
            },
          ]}
        />
      </Suspense>

      <IngredientAdminTable ingredients={ingredients} />
    </>
  );
}
