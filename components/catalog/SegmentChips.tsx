"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

import { GlassSurface } from "@/components/glass/GlassSurface";
import { segmentVisual } from "@/lib/catalog/segment-visuals";
import type { SegmentDTO } from "@/lib/data/formulas";

export const ALL_SEGMENTS = "all" as const;
export type SegmentFilter = string | typeof ALL_SEGMENTS;

interface SegmentChipsProps {
  segments: SegmentDTO[];
  selected: SegmentFilter;
  onSelect: (segmentId: SegmentFilter) => void;
}

const EDGE_FADE_PX = 28;
// Só considera "encostado na borda" com folga de 1px: evita o fade tremer
// (aparecer/sumir) por causa de arredondamento de subpixel do navegador.
const EDGE_TOLERANCE_PX = 1;

// A faixa inteira é UMA superfície de vidro (um blur só, barato); os chips
// dentro dela não têm blur próprio — evita repetir backdrop-filter em cada
// chip de uma fileira com scroll, que é exatamente o padrão de travamento de
// rolagem documentado no guia (liquid-glass-guia.md, seção 4).
export function SegmentChips({ segments, selected, onSelect }: SegmentChipsProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  // Largura do fade em cada lado. Fica em 0 (sem fade) até a primeira medição
  // real do scroll — nunca aparece "no achismo" antes de saber se há conteúdo
  // além da borda.
  const [edgeFade, setEdgeFade] = useState({ left: 0, right: 0 });

  useEffect(() => {
    const node = scrollerRef.current;
    if (!node) return;

    function updateEdgeFade() {
      if (!node) return;
      const maxScrollLeft = node.scrollWidth - node.clientWidth;
      if (maxScrollLeft <= EDGE_TOLERANCE_PX) {
        setEdgeFade({ left: 0, right: 0 });
        return;
      }
      const hasMoreToLeft = node.scrollLeft > EDGE_TOLERANCE_PX;
      const hasMoreToRight = node.scrollLeft < maxScrollLeft - EDGE_TOLERANCE_PX;
      setEdgeFade({
        left: hasMoreToLeft ? EDGE_FADE_PX : 0,
        right: hasMoreToRight ? EDGE_FADE_PX : 0,
      });
    }

    updateEdgeFade();
    node.addEventListener("scroll", updateEdgeFade, { passive: true });
    window.addEventListener("resize", updateEdgeFade);
    return () => {
      node.removeEventListener("scroll", updateEdgeFade);
      window.removeEventListener("resize", updateEdgeFade);
    };
    // Recalcula quando a quantidade de segmentos muda (a lista de chips troca
    // de largura total sem o componente inteiro remontar).
  }, [segments.length]);

  const fadeStyle = {
    "--chip-fade-left": `${edgeFade.left}px`,
    "--chip-fade-right": `${edgeFade.right}px`,
  } as CSSProperties;

  return (
    <GlassSurface as="nav" className="lc-chips-bar" style={fadeStyle} aria-label="Filtrar por segmento">
      <div className="lc-chips" ref={scrollerRef}>
        <button
          type="button"
          className={`lc-chip ${selected === ALL_SEGMENTS ? "is-active" : ""}`.trim()}
          onClick={() => onSelect(ALL_SEGMENTS)}
          aria-pressed={selected === ALL_SEGMENTS}
        >
          Todos
        </button>
        {segments.map((segment) => {
          const visual = segmentVisual(segment.name, segment.sortOrder);
          const isActive = selected === segment.id;
          return (
            <button
              key={segment.id}
              type="button"
              className={`lc-chip ${isActive ? "is-active" : ""}`.trim()}
              style={
                {
                  "--chip-tint": `linear-gradient(135deg, ${visual.from}, ${visual.to})`,
                } as CSSProperties
              }
              onClick={() => onSelect(segment.id)}
              aria-pressed={isActive}
            >
              {segment.name}
            </button>
          );
        })}
      </div>
    </GlassSurface>
  );
}
