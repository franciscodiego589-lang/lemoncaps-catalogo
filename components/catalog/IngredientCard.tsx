import { Image as ImageIcon } from "lucide-react";

import { formatQuantity, hasContent, unitLabel } from "@/lib/catalog/format-catalog";
import type { FormulaCompositionDTO } from "@/lib/data/formulas";

interface IngredientCardProps {
  composition: FormulaCompositionDTO;
}

// Cartão de um insumo, dentro da página de benefícios (um por insumo da
// composição). Nome, quantidade e unidade são dado real, mesma fonte de
// CompositionTable. Imagem, descrição e alegação ANVISA ainda não existem no
// banco (ver comentário "LIGAÇÃO PENDENTE" em lib/data/formulas.ts) - por
// isso chegam sempre null hoje, e cada bloco correspondente simplesmente não
// aparece. Nunca texto inventado no lugar: dizer o que um insumo faz é
// alegação regulada pela ANVISA, e este projeto não escreve isso sem fonte
// confirmada (regra de exatidão, AGENTS.md).
export function IngredientCard({ composition }: IngredientCardProps) {
  const hasImage = hasContent(composition.ingredientImagePath);
  const hasDescription = hasContent(composition.ingredientDescription);
  const hasClaim = hasContent(composition.ingredientClaimText);

  return (
    <article className="lc-ingredient-card">
      <div className={`lc-ingredient-image ${hasImage ? "" : "lc-ingredient-image--empty"}`.trim()}>
        {hasImage ? (
          // Fonte é Supabase Storage; next.config.ts não tem domínio remoto
          // configurado ainda (fora do escopo desta tarefa). Caminho vem de
          // ingredients.image_path (ver comentário em lib/data/formulas.ts).
          // eslint-disable-next-line @next/next/no-img-element
          <img src={composition.ingredientImagePath ?? undefined} alt={composition.ingredientName} />
        ) : (
          <ImageIcon size={22} aria-hidden="true" />
        )}
      </div>

      <div className="lc-ingredient-body">
        <h3 className="lc-ingredient-name">{composition.ingredientName}</h3>
        <p className="lc-ingredient-qty">
          {formatQuantity(composition.quantity)} {unitLabel(composition.unit)}
        </p>

        {hasDescription && <p className="lc-ingredient-desc">{composition.ingredientDescription}</p>}

        {hasClaim && (
          <div className="lc-ingredient-claim">
            <span className="lc-ingredient-claim-label">Alegação</span>
            <p className="lc-ingredient-claim-text">{composition.ingredientClaimText}</p>
            {hasContent(composition.ingredientClaimSource) && (
              <p className="lc-ingredient-claim-source">Fonte: {composition.ingredientClaimSource}</p>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
