"use client";

import type { CSSProperties } from "react";
import Link from "next/link";

import { centsToBRL } from "@/lib/money";
import { FORMAT_ICONS, hasContent, lineLabel } from "@/lib/catalog/format-catalog";
import { segmentVisual } from "@/lib/catalog/segment-visuals";
import type { FormulaDTO, SegmentDTO } from "@/lib/data/formulas";
import { CompositionTable } from "./CompositionTable";

interface FormulaCardProps {
  formula: FormulaDTO;
  segment: SegmentDTO | undefined;
  onQuote: (formula: FormulaDTO) => void;
}

const COMPOSITION_PREVIEW_LIMIT = 5;

// O card é CONTEÚDO — sempre sólido, nunca vidro, nunca backdrop-filter (ver
// regra central em app/globals.css). Todo texto vem exato do DTO; campo
// vazio/nulo esconde o elemento correspondente, nunca mostra "null".
export function FormulaCard({ formula, segment, onQuote }: FormulaCardProps) {
  const visual = segment ? segmentVisual(segment.name, segment.sortOrder) : segmentVisual("", 0);
  const FormatIcon = FORMAT_ICONS[formula.format];
  const hasBenefitsContent = hasContent(formula.generalBenefitsSummary) || formula.benefits.length > 0;
  const hasDossieContent =
    formula.compositions.length > 0 ||
    hasContent(formula.technicalSheetTitle) ||
    hasContent(formula.usageInstructions) ||
    hasContent(formula.nutritionalInfo) ||
    hasContent(formula.ingredientsList) ||
    hasContent(formula.targetAudience) ||
    hasContent(formula.storageInstructions) ||
    hasContent(formula.warnings);
  const hasFormatRow = hasContent(formula.regulatoryProductType) || hasContent(formula.poteContentsDescription);

  // As quatro variáveis de cor do segmento vivem no card inteiro (não só na
  // faixa de mídia): a cor do rótulo de segmento (.lc-card-segment, com troca
  // clara/escura já definida em globals.css) lê --seg-text-light/dark daqui.
  const cardStyle = {
    "--seg-c1": visual.from,
    "--seg-c2": visual.to,
    "--seg-text-light": visual.textLight,
    "--seg-text-dark": visual.textDark,
  } as CSSProperties;

  return (
    <article className="lc-card" style={cardStyle}>
      <div className="lc-card-media">
        <span className="lc-tier-badge">{lineLabel(formula.line)}</span>
        <FormatIcon className="lc-icon" size={26} aria-hidden="true" />
      </div>
      <div className="lc-card-body">
        {hasContent(segment?.name) && <div className="lc-card-segment">{segment?.name}</div>}
        <h2 className="lc-card-title">
          {/* Navegação de verdade (não div clicável): leva ao dossiê completo
              da fórmula em /catalogo/[slug] — diretrizes de interface pedem
              <Link>, nunca onClick num elemento não-interativo. */}
          <Link href={`/catalogo/${formula.slug}`} className="lc-card-title-link" title={formula.name}>
            {formula.name}
          </Link>
        </h2>
        {hasContent(formula.description) && (
          <p className="lc-card-desc" title={formula.description ?? undefined}>
            {formula.description}
          </p>
        )}
        {hasFormatRow && (
          <div className="lc-card-format">
            <span>{formula.regulatoryProductType ?? ""}</span>
            <span>{formula.poteContentsDescription ?? ""}</span>
          </div>
        )}

        <CompositionTable
          compositions={formula.compositions}
          limit={COMPOSITION_PREVIEW_LIMIT}
          viewAllHref={`/catalogo/${formula.slug}`}
        />

        {hasContent(formula.usageInstructions) && (
          <p className="lc-card-usage">
            <b>Modo de uso:</b> {formula.usageInstructions}
          </p>
        )}

        {/* Rodapé ancorado na base do card (margin-top: auto dentro do flex
            column de .lc-card-body): preço, pedido mínimo e ações ficam
            alinhados entre cards da mesma linha da grade, mesmo com corpos de
            altura diferente. */}
        <div className="lc-card-footer">
          {formula.listPriceCents != null ? (
            <div className="lc-price-row">
              <span className="lc-price">
                {centsToBRL(formula.listPriceCents)}
                <small> / pote</small>
              </span>
            </div>
          ) : (
            <div className="lc-price-row">
              <span className="lc-price-tbd">Preço sob consulta</span>
            </div>
          )}
          <span className="lc-min-note">Pedido mínimo: {formula.minimumOrderPotes} potes</span>

          <div className="lc-card-actions">
            {/* Link navega, botão age (diretrizes de interface): Benefícios e
                Dossiê Técnico só trocam de página, então são <Link> de
                verdade, não onClick fingindo navegação. Cotar Fórmula é a
                única ação real do card (abre o modal de cotação). */}
            {hasBenefitsContent && (
              <Link href={`/catalogo/${formula.slug}/beneficios`} className="lc-btn lc-btn-ghost">
                Benefícios
              </Link>
            )}
            {hasDossieContent && (
              <Link href={`/catalogo/${formula.slug}`} className="lc-btn lc-btn-ghost">
                Dossiê Técnico
              </Link>
            )}
            {formula.listPriceCents != null && (
              <button type="button" className="lc-btn lc-btn-primary" onClick={() => onQuote(formula)}>
                Cotar Fórmula
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
