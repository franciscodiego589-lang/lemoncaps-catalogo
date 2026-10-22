// ============================================================================
// SEM ROTA ATIVA desde 13/09/2026 — computeCatalogStats() não é chamada por
// nenhuma página. Servia ao ProofStats da landing institucional que ficava em /;
// a raiz virou a apresentação da fábrica e passou a usar
// lib/catalog/manufacturing-stats.ts, que faz o mesmo com mais detalhe (e para
// onde a faixa de preço foi levada). Guardado por ordem do dono.
// O `export { joinPortugueseList }` no fim do arquivo NÃO está órfão: é um
// re-export de lib/format.ts, onde a função passou a morar.
// ============================================================================

// Números reais da landing (/) — sempre derivados do que getCatalogData()
// devolveu na mesma requisição, nunca digitados à mão. Função pura, testável,
// separada do componente que exibe (AGENTS.md, "Convenções de código").
//
// Rótulo de formato em português: cópia deliberadamente pequena e local do
// mapeamento do enum product_format (a fonte canônica dos ÍCONES por formato é
// lib/catalog/format-catalog.ts, fora do escopo desta tarefa — ver CLAUDE.md
// do dono, "NÃO altere"). Repetir 4 linhas aqui evita tocar um arquivo alheio
// só por causa de um rótulo textual.
import type { ProductFormat } from "@/lib/catalog/format-catalog";
import type { FormulaDTO, SegmentDTO } from "@/lib/data/formulas";

const FORMAT_LABELS: Record<ProductFormat, string> = {
  capsula: "cápsula",
  gummy: "goma",
  soluvel: "solúvel",
  liquido: "líquido",
};

// Ordem fixa de leitura (a mesma ordem das chaves acima), não a ordem em que
// os formatos aparecem nas fórmulas — assim o texto não muda de frase a cada
// build só porque o sort_order das fórmulas mudou no banco.
const FORMAT_ORDER = Object.keys(FORMAT_LABELS) as ProductFormat[];

export interface CatalogStats {
  totalFormulas: number;
  /** Nomes dos segmentos com pelo menos uma fórmula ativa, na ordem do catálogo. */
  segmentNames: string[];
  /** Rótulos em português dos formatos realmente em uso hoje (sem duplicar). */
  formatLabels: string[];
  /** Pedido mínimo por fórmula, em potes — menor valor encontrado entre as fórmulas ativas. */
  minimumOrderPotes: number | null;
  priceMinCents: number | null;
  priceMaxCents: number | null;
}

// Catálogo vazio é um estado real e possível (ver comentário sobre isso em
// lib/data/formulas.ts) — aqui vira zeros/null, nunca um número inventado no
// lugar. Quem exibe (ProofStats) decide como tratar visualmente.
export function computeCatalogStats(formulas: readonly FormulaDTO[], segments: readonly SegmentDTO[]): CatalogStats {
  const segmentIdsInUse = new Set(formulas.map((formula) => formula.segmentId));
  const segmentNames = segments.filter((segment) => segmentIdsInUse.has(segment.id)).map((segment) => segment.name);

  const formatsInUse = new Set(formulas.map((formula) => formula.format));
  const formatLabels = FORMAT_ORDER.filter((format) => formatsInUse.has(format)).map(
    (format) => FORMAT_LABELS[format],
  );

  const minimumOrders = formulas.map((formula) => formula.minimumOrderPotes);
  const minimumOrderPotes = minimumOrders.length > 0 ? Math.min(...minimumOrders) : null;

  const prices = formulas
    .map((formula) => formula.listPriceCents)
    .filter((cents): cents is number => cents != null);
  const priceMinCents = prices.length > 0 ? Math.min(...prices) : null;
  const priceMaxCents = prices.length > 0 ? Math.max(...prices) : null;

  return {
    totalFormulas: formulas.length,
    segmentNames,
    formatLabels,
    minimumOrderPotes,
    priceMinCents,
    priceMaxCents,
  };
}

// A implementação mudou de casa para lib/format.ts em 13/09/2026 (a página de
// apresentação passou a usar a mesma junção). O re-export continua aqui para
// quem já importava daqui — a função é uma só, em um lugar só.
export { joinPortugueseList } from "@/lib/format";
