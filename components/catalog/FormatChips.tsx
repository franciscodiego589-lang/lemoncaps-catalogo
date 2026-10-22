"use client";

import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

import { GlassSurface } from "@/components/glass/GlassSurface";
import type { FormatFilter, FormatTabOption } from "@/lib/catalog/catalog-filters";

interface FormatChipsProps {
  tabs: FormatTabOption[];
  selected: FormatFilter;
  onSelect: (format: FormatFilter) => void;
}

// Era uma faixa de pills rolável na horizontal (mesmo padrão de
// SegmentChips.tsx). Virou dropdown a pedido do dono (23/09/2026): com todos
// os formatos cadastrados a faixa ficava cortada/exigia arrastar no celular.
// <details>/<summary> nativo é o mesmo padrão já usado em
// RegulatoryRigor.tsx e app/catalogo/[slug]/page.tsx pra "revelar conteúdo
// abaixo ao clicar" — abre/fecha sem estado próprio em React, e já vem
// acessível por teclado e leitor de tela. O único JavaScript daqui é o que
// <details> não faz sozinho: fechar ao escolher uma opção e ao clicar fora.
export function FormatChips({ tabs, selected, onSelect }: FormatChipsProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const activeTab = tabs.find((tab) => tab.value === selected) ?? tabs[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const node = detailsRef.current;
      if (node && node.open && !node.contains(event.target as Node)) {
        node.open = false;
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(format: FormatFilter) {
    onSelect(format);
    if (detailsRef.current) detailsRef.current.open = false;
  }

  return (
    <GlassSurface as="nav" className="lc-chips-bar lc-format-bar" aria-label="Filtrar por formato">
      <details className="lc-format-details" ref={detailsRef}>
        <summary className="lc-format-trigger">
          <span>{activeTab ? `${activeTab.label} (${activeTab.count})` : "Todos"}</span>
          <ChevronDown className="lc-format-chevron" size={18} aria-hidden="true" />
        </summary>
        <GlassSurface as="div" className="lc-format-list">
          {tabs.map((tab) => {
            const isActive = selected === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                className={`lc-format-option ${isActive ? "is-active" : ""}`.trim()}
                onClick={() => handleSelect(tab.value)}
                aria-pressed={isActive}
              >
                {tab.label} ({tab.count})
              </button>
            );
          })}
        </GlassSurface>
      </details>
    </GlassSurface>
  );
}
