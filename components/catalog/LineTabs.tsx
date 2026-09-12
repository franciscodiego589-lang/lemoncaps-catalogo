import { GlassSurface } from "@/components/glass/GlassSurface";
import type { ProductLine } from "@/lib/catalog/format-catalog";

interface LineTabsProps {
  value: ProductLine;
  onChange: (value: ProductLine) => void;
}

export function LineTabs({ value, onChange }: LineTabsProps) {
  const isPremium = value === "premium";
  return (
    <div className="lc-tabs-row">
      <GlassSurface className="lc-segmented" role="tablist" aria-label="Linha do catálogo">
        <div
          className="lc-segmented-thumb"
          style={{ transform: isPremium ? "translateX(0)" : "translateX(100%)" }}
          aria-hidden="true"
        />
        <button
          type="button"
          role="tab"
          aria-selected={isPremium}
          className={`lc-segmented-btn ${isPremium ? "is-active" : ""}`.trim()}
          onClick={() => onChange("premium")}
        >
          Premium
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={!isPremium}
          className={`lc-segmented-btn ${!isPremium ? "is-active" : ""}`.trim()}
          onClick={() => onChange("basica")}
        >
          Básicas
        </button>
      </GlassSurface>
    </div>
  );
}
