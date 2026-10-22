interface SegmentsServedProps {
  segmentNames: string[];
}

// Os segmentos que a fábrica já atende — cada um existe porque tem pelo menos
// uma fórmula ativa no catálogo (o filtro está em
// lib/catalog/manufacturing-stats.ts). Nenhum segmento "que poderíamos
// atender" entra nesta lista: o valor dela é justamente ser o histórico real.
//
// Lista sólida, nunca vidro: é conteúdo, não cromo de navegação. Os chips de
// vidro do catálogo (.lc-chip) são controles de filtro — aqui não há nada para
// filtrar, então a forma é parecida mas a superfície é sólida, seguindo a
// regra central de app/globals.css.
export function SegmentsServed({ segmentNames }: SegmentsServedProps) {
  if (segmentNames.length === 0) return null;

  return (
    <section className="lc-home-section" aria-labelledby="lc-fab-segments-title">
      <div className="lc-home-section-head">
        <h2 id="lc-fab-segments-title">Segmentos que já atendemos</h2>
        <p>
          {segmentNames.length === 1
            ? "Um segmento com fórmula ativa hoje no catálogo."
            : `${segmentNames.length} segmentos com fórmula ativa hoje no catálogo.`}
        </p>
      </div>

      <ul className="lc-fab-segment-list">
        {segmentNames.map((name) => (
          <li className="lc-fab-segment" key={name}>
            {name}
          </li>
        ))}
      </ul>
    </section>
  );
}
