"use client";

import { useState } from "react";
import type { CSSProperties } from "react";

import { centsToBRL } from "@/lib/money";
import { formatIcon, hasContent, lineLabel } from "@/lib/catalog/format-catalog";
import { segmentVisual } from "@/lib/catalog/segment-visuals";
import type { FormulaDTO, SegmentDTO } from "@/lib/data/formulas";
import { BenefitsPanel } from "./BenefitsPanel";
import { CompositionTable } from "./CompositionTable";

interface FormulaCardProps {
  formula: FormulaDTO;
  segment: SegmentDTO | undefined;
  onQuote: (formula: FormulaDTO) => void;
  onViewDossie: (formula: FormulaDTO) => void;
}

// O card é CONTEÚDO — sempre sólido, nunca vidro, nunca backdrop-filter (ver
// regra central em app/globals.css). Todo texto vem exato do DTO; campo
// vazio/nulo esconde o elemento correspondente, nunca mostra "null".
export function FormulaCard({ formula, segment, onQuote, onViewDossie }: FormulaCardProps) {
  const [isBenefitsOpen, setBenefitsOpen] = useState(false);

  const visual = segment ? segmentVisual(segment.name, segment.sortOrder) : segmentVisual("", 0);
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
        <span className="lc-icon" aria-hidden="true">
          {formatIcon(formula.format)}
        </span>
      </div>
      <div className="lc-card-body">
        {hasContent(segment?.name) && <div className="lc-card-segment">{segment?.name}</div>}
        <h3 className="lc-card-title">{formula.name}</h3>
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

        <CompositionTable compositions={formula.compositions} />

        {hasContent(formula.usageInstructions) && (
          <p className="lc-card-usage">
            <b>Modo de uso:</b> {formula.usageInstructions}
          </p>
        )}

        {hasBenefitsContent && (
          <BenefitsPanel
            isOpen={isBenefitsOpen}
            summary={formula.generalBenefitsSummary}
            benefits={formula.benefits}
          />
        )}

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
          {hasBenefitsContent && (
            <button
              type="button"
              className="lc-btn lc-btn-ghost"
              aria-expanded={isBenefitsOpen}
              onClick={() => setBenefitsOpen((current) => !current)}
            >
              Benefícios
            </button>
          )}
          {hasDossieContent && (
            <button type="button" className="lc-btn lc-btn-ghost" onClick={() => onViewDossie(formula)}>
              Dossiê Técnico
            </button>
          )}
          {formula.listPriceCents != null && (
            <button type="button" className="lc-btn lc-btn-primary" onClick={() => onQuote(formula)}>
              Cotar Fórmula
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
