import "server-only";

// Banco de matérias-primas cadastradas, contado direto de public.ingredients
// para a página de apresentação da fábrica (app/page.tsx, a raiz do site desde
// 13/09/2026). É o número que o cliente de marca própria pergunta
// quando quer fórmula desenvolvida do zero ("com o que vocês trabalham?"), e
// por isso NUNCA pode ser digitado à mão aqui: sai da mesma tabela que o admin
// edita, na mesma requisição.
//
// Só a CONTAGEM sai desta camada, nunca a lista de insumos: a página é pública
// e a relação completa de matérias-primas é informação comercial da fábrica.
// Contar por categoria já prova a diversidade sem entregar o cardápio.
import { unstable_cache } from "next/cache";

import { getAnonCatalogClient } from "@/lib/supabase/anon-catalog-client";
import type { Enums } from "@/lib/supabase/database.types";

export type IngredientCategory = Enums<"ingredient_category">;

export interface IngredientBankStats {
  total: number;
  /** Contagem por categoria do enum, só das categorias que têm pelo menos 1 insumo. */
  byCategory: { category: IngredientCategory; count: number }[];
}

// Ordem fixa de leitura, não a ordem em que o Postgres devolveu as linhas —
// assim o texto da página não muda de posição a cada build. Mesma decisão (e
// mesmo motivo) do FORMAT_ORDER em components/home/catalog-stats.ts.
const CATEGORY_ORDER: IngredientCategory[] = ["aminoacido", "vitamina", "mineral", "extrato_vegetal", "outro"];

export const INGREDIENT_BANK_CACHE_TAG = "ingredient-bank";
const INGREDIENT_BANK_REVALIDATE_SECONDS = 300;

async function fetchIngredientBankFromDatabase(): Promise<IngredientBankStats> {
  const supabase = getAnonCatalogClient();

  const { data, error } = await supabase
    .from("ingredients")
    .select("category")
    .eq("active", true)
    .is("deleted_at", null);

  if (error) {
    console.error("[getIngredientBankStats] falha ao consultar public.ingredients:", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
    throw new Error(`Falha ao carregar o banco de insumos: ${error.message}`);
  }

  const counts = new Map<IngredientCategory, number>();
  for (const row of data) {
    counts.set(row.category, (counts.get(row.category) ?? 0) + 1);
  }

  return {
    total: data.length,
    byCategory: CATEGORY_ORDER.filter((category) => counts.has(category)).map((category) => ({
      category,
      count: counts.get(category) ?? 0,
    })),
  };
}

const getCachedIngredientBank = unstable_cache(fetchIngredientBankFromDatabase, ["lemoncaps", "ingredient-bank"], {
  tags: [INGREDIENT_BANK_CACHE_TAG],
  revalidate: INGREDIENT_BANK_REVALIDATE_SECONDS,
});

// Mesmo contrato de resiliência do catálogo (lib/data/formulas.ts): a falha é
// registrada com contexto no log do servidor e relançada como mensagem sóbria —
// quem decide o que o visitante vê é o error boundary da rota. A página
// página de apresentação NUNCA mostra um número aproximado no lugar.
export async function getIngredientBankStats(): Promise<IngredientBankStats> {
  try {
    return await getCachedIngredientBank();
  } catch (error) {
    console.error("[getIngredientBankStats] banco de insumos indisponível:", error);
    throw new Error("Banco de insumos temporariamente indisponível.");
  }
}
