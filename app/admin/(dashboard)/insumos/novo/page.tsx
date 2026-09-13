import { IngredientForm } from "@/components/admin/IngredientForm";

export const metadata = { title: "Novo insumo · Lemon Caps Admin" };

export default function NovoInsumoPage() {
  return (
    <>
      <div className="lc-admin-page-head">
        <div>
          <h1>Novo insumo</h1>
          <p>Cadastre o insumo canônico. A ligação com linhas de composição existentes é feita na tela de cada fórmula.</p>
        </div>
      </div>
      <IngredientForm />
    </>
  );
}
