// Filtro combinado do catálogo público: segmento × formato × busca. Extraído
// de CatalogView.tsx para virar função pura testável — pedido do dono
// (17/09/2026) de uma barra de abas por FORMATO (líquido/solúvel/gummy/
// cápsula), combinável com o filtro de segmento que já existia. Contagem
// errada num filtro combinado é o tipo de bug que só aparece depois de
// publicado, por isso mora aqui, testado, e não solto dentro do componente.
import { normalizarBusca, type ProductFormat, type ProductLine } from "./format-catalog";

// Abas de LINHA (Premium | Essencial), de volta em 23/09/2026 por ordem do
// dono: a linha nova fica separada da que já existia, "pra não ficar tudo
// misturado". Premium vem primeiro porque é o catálogo original. Lemon Caps
// (22/10/2026, pedido do dono) entra no fim: as fórmulas do Word técnico e da
// planilha de memorial, que vão para o teste de estabilidade.
export const LINE_TAB_ORDER: readonly ProductLine[] = ["premium", "essencial", "lemon_caps"];

// Linhas que têm pelo menos uma fórmula — só elas viram aba. Uma linha fora da
// ordem acima (ex.: "basica", encerrada em 14/09/2026) que volte a ter fórmula
// ativa aparece no fim, com o próprio rótulo, em vez de a fórmula sumir da
// vitrine sem aviso.
export function availableLines(formulas: readonly { readonly line: ProductLine }[]): ProductLine[] {
  const present = new Set(formulas.map((formula) => formula.line));
  const extra = [...present].filter((line) => !LINE_TAB_ORDER.includes(line)).sort();
  return [...LINE_TAB_ORDER.filter((line) => present.has(line)), ...extra];
}

export const ALL_FORMATS = "all" as const;
export type FormatFilter = ProductFormat | typeof ALL_FORMATS;

// Ordem pedida pelo dono: Cápsulas, Gomas, Solúveis, Líquidos — não é a ordem
// alfabética nem a ordem do enum no banco (essa é capsula/soluvel/gummy/liquido).
export const FORMAT_TAB_ORDER: readonly ProductFormat[] = ["capsula", "gummy", "soluvel", "liquido"];

export interface FilterableFormula {
  readonly segmentId: string;
  readonly format: ProductFormat;
  readonly name: string;
}

export interface CatalogFilterCriteria {
  readonly segmentId: string | null; // null = todos os segmentos
  readonly format: FormatFilter;
  readonly searchTerm: string;
}

export function filterCatalogFormulas<T extends FilterableFormula>(
  formulas: readonly T[],
  criteria: CatalogFilterCriteria,
): T[] {
  const term = normalizarBusca(criteria.searchTerm);
  return formulas.filter((formula) => {
    const matchesSegment = criteria.segmentId === null || formula.segmentId === criteria.segmentId;
    const matchesFormat = criteria.format === ALL_FORMATS || formula.format === criteria.format;
    const matchesSearch = term === "" || normalizarBusca(formula.name).includes(term);
    return matchesSegment && matchesFormat && matchesSearch;
  });
}

export interface FormatTabOption {
  readonly value: FormatFilter;
  readonly label: string;
  readonly count: number;
}

// O CONJUNTO de abas nasce do catálogo inteiro (`allFormulas`) — um formato
// sem nenhum produto ativo nunca vira aba. A CONTAGEM de cada aba já reflete
// o segmento e a busca atuais (nunca o próprio formato, senão toda aba não
// selecionada zeraria) — é o número que aquela aba mostraria se fosse
// clicada agora, inclusive quando dá zero: a aba continua visível, e é esse
// zero que liga o estado vazio "segmento × formato sem produto" na tela.
export function deriveFormatTabs<T extends FilterableFormula>(
  allFormulas: readonly T[],
  criteria: Pick<CatalogFilterCriteria, "segmentId" | "searchTerm">,
  formatLabels: Record<ProductFormat, string>,
): FormatTabOption[] {
  const contextFormulas = filterCatalogFormulas(allFormulas, { ...criteria, format: ALL_FORMATS });
  const knownFormats = new Set(allFormulas.map((formula) => formula.format));
  const extraFormats = [...knownFormats].filter((format) => !FORMAT_TAB_ORDER.includes(format)).sort();
  const orderedFormats = [...FORMAT_TAB_ORDER.filter((format) => knownFormats.has(format)), ...extraFormats];

  return [
    { value: ALL_FORMATS, label: "Todos", count: contextFormulas.length },
    ...orderedFormats.map((format) => ({
      value: format,
      // formatLabels[format] pode faltar na prática se o banco ganhar um
      // valor de enum novo antes do rótulo em português existir — nesse caso
      // mostra o valor cru (nunca inventa um nome bonito; regra de exatidão).
      label: formatLabels[format] ?? format,
      count: contextFormulas.filter((formula) => formula.format === format).length,
    })),
  ];
}
