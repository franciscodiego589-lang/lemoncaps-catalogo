"use client";

import { useMemo, useState } from "react";

import type { ProductLine } from "@/lib/catalog/format-catalog";
import { DEFAULT_BACKGROUND, segmentVisual } from "@/lib/catalog/segment-visuals";
import type { FormulaDTO, SegmentDTO } from "@/lib/data/formulas";
import { AnimatedBackground } from "./AnimatedBackground";
import { CartFab } from "./CartFab";
import { EmptyState } from "./EmptyState";
import { FormulaCard } from "./FormulaCard";
import { GlassTopBar } from "./GlassTopBar";
import { LineTabs } from "./LineTabs";
import { QuoteModal } from "./QuoteModal";
import { ALL_SEGMENTS, SegmentChips, type SegmentFilter } from "./SegmentChips";
import { TechnicalSheetModal } from "./TechnicalSheetModal";

interface CatalogViewProps {
  segments: SegmentDTO[];
  formulas: FormulaDTO[];
}

// Orquestrador client-side: os 28 itens já chegam prontos do servidor (ver
// app/catalogo/page.tsx). Filtro por segmento, busca por nome e abas
// Premium/Básicas rodam todos em memória, sem novo pedido ao banco.
export function CatalogView({ segments, formulas }: CatalogViewProps) {
  const [selectedSegment, setSelectedSegment] = useState<SegmentFilter>(ALL_SEGMENTS);
  const [line, setLine] = useState<ProductLine>("premium");
  const [search, setSearch] = useState("");

  const [quoteFormula, setQuoteFormula] = useState<FormulaDTO | null>(null);
  const [isQuoteOpen, setQuoteOpen] = useState(false);
  const [dossieFormula, setDossieFormula] = useState<FormulaDTO | null>(null);
  const [isDossieOpen, setDossieOpen] = useState(false);

  const segmentsById = useMemo(() => {
    const map = new Map<string, SegmentDTO>();
    for (const segment of segments) map.set(segment.id, segment);
    return map;
  }, [segments]);

  const filteredFormulas = useMemo(() => {
    const term = search.trim().toLowerCase();
    return formulas.filter((formula) => {
      const matchesSegment = selectedSegment === ALL_SEGMENTS || formula.segmentId === selectedSegment;
      const matchesLine = formula.line === line;
      const matchesSearch = term === "" || formula.name.toLowerCase().includes(term);
      return matchesSegment && matchesLine && matchesSearch;
    });
  }, [formulas, selectedSegment, line, search]);

  const backgroundColors = useMemo((): readonly [string, string, string] => {
    if (selectedSegment === ALL_SEGMENTS) return DEFAULT_BACKGROUND;
    const segment = segmentsById.get(selectedSegment);
    if (!segment) return DEFAULT_BACKGROUND;
    const visual = segmentVisual(segment.name, segment.sortOrder);
    return [visual.from, visual.to, visual.from];
  }, [selectedSegment, segmentsById]);

  function handleQuote(formula: FormulaDTO) {
    setQuoteFormula(formula);
    setQuoteOpen(true);
  }

  function handleViewDossie(formula: FormulaDTO) {
    setDossieFormula(formula);
    setDossieOpen(true);
  }

  return (
    <>
      <AnimatedBackground colors={backgroundColors} />
      <GlassTopBar searchValue={search} onSearchChange={setSearch} />

      <div className="lc-page-head">
        <h1>Catálogo de fórmulas</h1>
        <p>Composição, modo de uso e preço direto do nosso catálogo vigente.</p>
      </div>

      <div className="lc-filters">
        <SegmentChips segments={segments} selected={selectedSegment} onSelect={setSelectedSegment} />
        <LineTabs value={line} onChange={setLine} />
      </div>

      <main className="lc-container">
        {filteredFormulas.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="lc-grid">
            {filteredFormulas.map((formula) => (
              <FormulaCard
                key={formula.id}
                formula={formula}
                segment={segmentsById.get(formula.segmentId)}
                onQuote={handleQuote}
                onViewDossie={handleViewDossie}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="lc-footer">© 2026 Lemon Caps — Indústria de Suplementos e Nutracêuticos</footer>

      <CartFab />

      <QuoteModal
        formula={quoteFormula}
        segment={quoteFormula ? segmentsById.get(quoteFormula.segmentId) : undefined}
        isOpen={isQuoteOpen}
        onClose={() => setQuoteOpen(false)}
      />
      <TechnicalSheetModal
        formula={dossieFormula}
        segment={dossieFormula ? segmentsById.get(dossieFormula.segmentId) : undefined}
        isOpen={isDossieOpen}
        onClose={() => setDossieOpen(false)}
      />
    </>
  );
}
