import { FORMAT_ICONS } from "@/lib/catalog/format-catalog";
import type { FormatCapability } from "@/lib/catalog/manufacturing-stats";

interface FormatCapabilitiesProps {
  formats: FormatCapability[];
}

// Prova concreta do que a fábrica domina: cada formato com a contagem real de
// fórmulas ativas e as apresentações que já saem da linha hoje. Conteúdo (fato
// sobre a fábrica), por isso sempre sólido, nunca vidro — mesma regra do card
// de fórmula em app/globals.css.
//
// A soma das contagens é exatamente o total de fórmulas ativas (14+6+4+3 = 27):
// softgel NÃO entra como quinto formato, porque no banco a única fórmula em
// softgel é uma cápsula com apresentação "60 Softgels" — o porquê completo está
// em lib/catalog/manufacturing-stats.ts. Ela aparece na lista de apresentações
// de cápsula, que é o lugar honesto dela.
export function FormatCapabilities({ formats }: FormatCapabilitiesProps) {
  if (formats.length === 0) return null;

  return (
    <section className="lc-home-section" aria-labelledby="lc-fab-formats-title">
      <div className="lc-home-section-head">
        <h2 id="lc-fab-formats-title">Formatos que produzimos</h2>
        {/* A contagem total de fórmulas NÃO se repete aqui: ela já é o primeiro
            número da faixa do herói (KeyFigures). O que esta seção acrescenta é
            a divisão — quantas fórmulas em cada formato e quais apresentações
            já saem da linha. */}
        <p>Quantas fórmulas o catálogo tem em cada formato, e as apresentações que já estão em linha.</p>
      </div>

      <ul className="lc-fab-format-grid">
        {formats.map((capability) => {
          const Icon = FORMAT_ICONS[capability.format];
          return (
            <li className="lc-fab-format" key={capability.format}>
              <span className="lc-fab-format-icon" aria-hidden="true">
                <Icon size={22} />
              </span>
              <h3 className="lc-fab-format-name">{capability.label}</h3>
              <p className="lc-fab-format-count">
                <strong>{capability.formulaCount}</strong>{" "}
                {capability.formulaCount === 1 ? "fórmula no catálogo" : "fórmulas no catálogo"}
              </p>
              {capability.presentations.length > 0 && (
                <>
                  <p className="lc-fab-format-legend" id={`lc-fab-pres-${capability.format}`}>
                    Já em linha:
                  </p>
                  <ul className="lc-fab-presentations" aria-labelledby={`lc-fab-pres-${capability.format}`}>
                    {capability.presentations.map((presentation) => (
                      <li key={presentation}>{presentation}</li>
                    ))}
                  </ul>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
