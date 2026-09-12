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

// A faixa inteira é UMA superfície de vidro (um blur só, barato); os chips
// dentro dela não têm blur próprio — evita repetir backdrop-filter em cada
// chip de uma fileira com scroll, que é exatamente o padrão de travamento de
// rolagem documentado no guia (liquid-glass-guia.md, seção 4).
export function SegmentChips({ segments, selected, onSelect }: SegmentChipsProps) {
  return (
    <GlassSurface as="nav" className="lc-chips-bar" aria-label="Filtrar por segmento">
      <div className="lc-chips">
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
