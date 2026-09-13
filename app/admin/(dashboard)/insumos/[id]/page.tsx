import { notFound } from "next/navigation";

import { IngredientForm } from "@/components/admin/IngredientForm";
import { getAdminIngredientById } from "@/lib/data/admin";

export const metadata = { title: "Editar insumo · Lemon Caps Admin" };

export default async function EditarInsumoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ingredient = await getAdminIngredientById(id);
  if (!ingredient) notFound();

  return (
    <>
      <div className="lc-admin-page-head">
        <div>
          <h1>{ingredient.name}</h1>
          <p>Editar ficha do insumo e alegação autorizada pela ANVISA.</p>
        </div>
      </div>
      <IngredientForm initial={ingredient} />
    </>
  );
}
