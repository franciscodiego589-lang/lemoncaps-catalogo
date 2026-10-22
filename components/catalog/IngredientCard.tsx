import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";

import { formatQuantity, hasContent, unitLabel } from "@/lib/catalog/format-catalog";
import type { FormulaCompositionDTO } from "@/lib/data/formulas";

interface IngredientCardProps {
  composition: FormulaCompositionDTO;
  // Posição do cartão na grade (0-based) - decide a estratégia de
  // carregamento da foto: os primeiros ficam acima da dobra na maioria dos
  // layouts (grade larga ou estreita) e carregam imediatamente; o resto usa
  // loading="lazy" (regra do levantamento de imagens). Opcional por
  // compatibilidade; sem índice, assume acima da dobra (comportamento antigo).
  index?: number;
}

// Cartão de um insumo, dentro da página de benefícios (um por insumo da
// composição). Nome, quantidade e unidade são dado real, mesma fonte de
// CompositionTable. Descrição e alegação ANVISA ainda não existem no banco
// (ver comentário "LIGAÇÃO PENDENTE" em lib/data/formulas.ts) - por isso
// chegam sempre null hoje, e cada bloco correspondente simplesmente não
// aparece. Nunca texto inventado no lugar: dizer o que um insumo faz é
// alegação regulada pela ANVISA, e este projeto não escreve isso sem fonte
// confirmada (regra de exatidão, AGENTS.md).
//
// Duas variantes, sem meio-termo:
// - COM imagem (ingredientImagePath preenchido, licença conferida - ver
//   public/insumos/CREDITOS.md): vira vidro-líquido de verdade. A foto
//   preenche o quadro (object-fit: cover) e nome+quantidade ficam numa faixa
//   de vidro sobre a base da própria foto - mesma receita de backdrop-filter
//   do resto do projeto (.lc-glass, app/globals.css), com um véu escuro atrás
//   só da faixa para o contraste do texto não depender da foto por baixo
//   (medido ao vivo, nunca estimado - ver relatório da tarefa).
// - SEM imagem: o cartão sólido original, pixel a pixel igual a antes. Nunca
//   um buraco visual no lugar da foto que ainda não existe.
// Primeiras posições da grade que carregam a foto imediatamente (acima da
// dobra na maioria dos layouts, de celular a desktop largo); da posição 4 em
// diante entra loading="lazy".
const EAGER_LOAD_COUNT = 4;

export function IngredientCard({ composition, index = 0 }: IngredientCardProps) {
  const hasImage = hasContent(composition.ingredientImagePath);
  const hasDescription = hasContent(composition.ingredientDescription);
  const hasClaim = hasContent(composition.ingredientClaimText);
  const hasExtra = hasDescription || hasClaim;
  const loading = index < EAGER_LOAD_COUNT ? undefined : "lazy";

  const nameEl = <h3 className="lc-ingredient-name">{composition.ingredientName}</h3>;
  const qtyEl = (
    <p className="lc-ingredient-qty">
      {formatQuantity(composition.quantity)} {unitLabel(composition.unit)}
    </p>
  );
  const extraEl = hasExtra ? (
    <div className="lc-ingredient-body lc-ingredient-body--extra">
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
  ) : null;

  if (hasImage) {
    return (
      <article className="lc-ingredient-card lc-ingredient-card--photo">
        <div className="lc-ingredient-photo">
          {/* Fonte é public/insumos (arquivo local, licença conferida por insumo —
              ver public/insumos/CREDITOS.md). Passou a usar next/image em
              14/09/2026: a justificativa anterior ("sem domínio remoto para
              configurar") estava errada — next/image não exige domínio nenhum para
              imagem local, é o caso mais simples dele. Medido antes da troca: os
              arquivos são 800x600 JPG servidos num espaço de 229x229 CSS px, e
              quatro deles (460,8 KB) chegavam já na página de produto por prefetch.
              Com next/image o servidor entrega WebP no tamanho pedido. */}
          {composition.ingredientImagePath ? (
            <Image
              src={composition.ingredientImagePath}
              alt={composition.ingredientImageAlt ?? composition.ingredientName}
              width={480}
              height={480}
              sizes="(max-width: 640px) 45vw, 240px"
              loading={loading}
              className="lc-ingredient-photo-img"
            />
          ) : null}
          <div className="lc-ingredient-caption">
            <div className="lc-ingredient-caption-glass">
              {nameEl}
              {qtyEl}
            </div>
          </div>
        </div>

        {extraEl}
      </article>
    );
  }

  return (
    <article className="lc-ingredient-card">
      <div className="lc-ingredient-image lc-ingredient-image--empty">
        <ImageIcon size={22} aria-hidden="true" />
      </div>

      <div className="lc-ingredient-body">
        {nameEl}
        {qtyEl}

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
