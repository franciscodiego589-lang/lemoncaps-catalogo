// Abas de linha do catálogo: Premium | Essencial.
//
// Histórico: as abas Premium/Básicas saíram em 14/09/2026 (a divisão não
// sustentava preço e escondia três pares duplicados — ver a migration
// 20260918000000_linha_unica_e_duplicatas.sql). Voltaram em 23/09/2026, por
// ordem do dono, com outro sentido: a linha Premium é o catálogo que já existia
// e a Essencial é a linha nova, criada naquela data, "pra não ficar tudo
// misturado" (migration 20260923020000_linha_essencial.sql).
//
// As abas só aparecem quando existe fórmula ativa em mais de uma linha (quem
// decide é CatalogView, via availableLines) — nunca uma aba que abre vazia.

import { GlassSurface } from "@/components/glass/GlassSurface";
import { lineLabel, type ProductLine } from "@/lib/catalog/format-catalog";

interface LineTabsProps {
  lines: readonly ProductLine[];
  value: ProductLine;
  onChange: (value: ProductLine) => void;
}

export function LineTabs({ lines, value, onChange }: LineTabsProps) {
  const activeIndex = Math.max(0, lines.indexOf(value));
  return (
    <div className="lc-tabs-row">
      <GlassSurface className="lc-segmented" role="tablist" aria-label="Linha do catálogo">
        <div
          className="lc-segmented-thumb"
          style={{ transform: `translateX(${activeIndex * 100}%)` }}
          aria-hidden="true"
        />
        {lines.map((line) => {
          const isActive = line === value;
          return (
            <button
              key={line}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`lc-segmented-btn ${isActive ? "is-active" : ""}`.trim()}
              onClick={() => onChange(line)}
            >
              {lineLabel(line)}
            </button>
          );
        })}
      </GlassSurface>
    </div>
  );
}
