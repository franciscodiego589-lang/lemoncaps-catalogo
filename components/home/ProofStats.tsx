import { centsToBRL } from "@/lib/money";
import type { CatalogStats } from "./catalog-stats";
import { joinPortugueseList } from "./catalog-stats";

interface ProofStatsProps {
  stats: CatalogStats;
}

// ============================================================================
// SEM ROTA ATIVA desde 13/09/2026 — não é importado por nenhuma página.
// Era o "O catálogo hoje" da landing institucional que ficava em /. A raiz
// passou a ser a apresentação da fábrica, que mostra os mesmos números com mais
// detalhe e em lugares diferentes: a faixa da primeira dobra
// (components/manufacturing/KeyFigures.tsx), a divisão por formato
// (FormatCapabilities) e a lista de segmentos (SegmentsServed).
// A única informação daqui que não existia lá — a FAIXA DE PREÇO por pote —
// foi salva e hoje aparece em components/manufacturing/StartingPoint.tsx.
// Guardado no repositório em vez de apagado por ordem do dono.
// ============================================================================

// Prova concreta: só números que vieram de getCatalogData() nesta mesma
// requisição (ver app/page.tsx e catalog-stats.ts) — nenhum aqui é digitado
// à mão. Conteúdo (fato sobre o catálogo), por isso sempre sólido, nunca
// vidro, mesma regra do card de fórmula em app/globals.css.
export function ProofStats({ stats }: ProofStatsProps) {
  const { totalFormulas, segmentNames, formatLabels, minimumOrderPotes, priceMinCents, priceMaxCents } = stats;

  const priceRangeLabel =
    priceMinCents != null && priceMaxCents != null
      ? priceMinCents === priceMaxCents
        ? centsToBRL(priceMinCents)
        : `${centsToBRL(priceMinCents)} a ${centsToBRL(priceMaxCents)}`
      : "Sob consulta";

  return (
    <section className="lc-home-section" aria-labelledby="lc-home-stats-title">
      <div className="lc-home-section-head">
        <h2 id="lc-home-stats-title">O catálogo hoje</h2>
        <p>Direto do nosso catálogo vigente, sem estimativa.</p>
      </div>

      <div className="lc-home-stats-grid">
        <div className="lc-home-stat">
          <span className="lc-home-stat-value">{totalFormulas}</span>
          <span className="lc-home-stat-label">
            {totalFormulas === 1 ? "fórmula ativa no catálogo" : "fórmulas ativas no catálogo"}
          </span>
        </div>

        <div className="lc-home-stat">
          <span className="lc-home-stat-value">{segmentNames.length}</span>
          <span className="lc-home-stat-label">
            {segmentNames.length === 1 ? "segmento atendido" : "segmentos atendidos"}
          </span>
          {segmentNames.length > 0 && (
            <span className="lc-home-stat-detail">{joinPortugueseList(segmentNames)}</span>
          )}
        </div>

        <div className="lc-home-stat">
          <span className="lc-home-stat-value">
            {minimumOrderPotes != null ? minimumOrderPotes : "–"}
          </span>
          <span className="lc-home-stat-label">potes: pedido mínimo por fórmula</span>
        </div>

        <div className="lc-home-stat">
          <span className="lc-home-stat-value">{priceRangeLabel}</span>
          <span className="lc-home-stat-label">por pote, direto do catálogo</span>
        </div>
      </div>

      {formatLabels.length > 0 && (
        <p className="lc-home-stats-caption">Disponíveis em {joinPortugueseList(formatLabels)}.</p>
      )}
    </section>
  );
}
