import type { IngredientCategory } from "@/lib/data/ingredient-bank";

// Rótulo de categoria de insumo na voz do site público, e no PLURAL correto.
// Não reaproveita components/admin/enum-labels.ts de propósito: lá os rótulos
// são singulares e de formulário ("Extrato vegetal", "Outro"), pensados para
// caber num <select>. Aqui eles entram numa frase contada — "13 aminoácidos",
// "4 extratos vegetais", "30 outras matérias-primas" — e "30 Outro" ficaria
// errado em português.
//
// A função recebe a contagem porque o plural do português depende dela: uma
// categoria pode ter 1 insumo hoje e 13 amanhã, e o texto tem que continuar
// certo sem ninguém revisar.
export const INGREDIENT_CATEGORY_LABELS: Record<IngredientCategory, (count: number) => string> = {
  aminoacido: (count) => (count === 1 ? "aminoácido" : "aminoácidos"),
  vitamina: (count) => (count === 1 ? "vitamina" : "vitaminas"),
  mineral: (count) => (count === 1 ? "mineral" : "minerais"),
  extrato_vegetal: (count) => (count === 1 ? "extrato vegetal" : "extratos vegetais"),
  // "outro" é a categoria de tudo que não cai nas quatro acima (creatina,
  // colágeno, probiótico, cafeína...). Dizer só "outros" deixaria o visitante
  // sem saber outros o quê; "matérias-primas" é o termo que a própria seção
  // usa no título.
  outro: (count) => (count === 1 ? "outra matéria-prima" : "outras matérias-primas"),
};
