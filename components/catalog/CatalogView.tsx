"use client";

// Rótulos em português dos formatos: fonte única é components/admin/enum-labels.ts
// (o mesmo texto que o admin já mostra) — o catálogo público reaproveita em vez
// de duplicar "Cápsula"/"Gummy"/... aqui.
import { PRODUCT_FORMAT_LABELS } from "@/components/admin/enum-labels";
import {
  ALL_FORMATS,
  availableLines,
  deriveFormatTabs,
  filterCatalogFormulas,
  type FormatFilter,
} from "@/lib/catalog/catalog-filters";
import type { ProductLine } from "@/lib/catalog/format-catalog";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { CATALOG_FOOTER_COMPLIANCE_NOTE } from "@/lib/catalog/regulatory-info";
import { DEFAULT_BACKGROUND, segmentVisual } from "@/lib/catalog/segment-visuals";
import type { FormulaDTO, SegmentDTO } from "@/lib/data/formulas";
import { AnimatedBackground } from "./AnimatedBackground";
import { CartFab } from "./CartFab";
import { EmptyState } from "./EmptyState";
import { FormatChips } from "./FormatChips";
import { FormulaCard } from "./FormulaCard";
import { GlassTopBar } from "./GlassTopBar";
import { LineTabs } from "./LineTabs";
import { QuoteModal } from "./QuoteModal";
import { ALL_SEGMENTS, SegmentChips, type SegmentFilter } from "./SegmentChips";
import { DeveloperCredit } from "@/components/common/DeveloperCredit";

interface CatalogViewProps {
  segments: SegmentDTO[];
  formulas: FormulaDTO[];
}

// Nomes dos query params na URL — o vendedor manda pro cliente o link já
// filtrado, e o botão Voltar do navegador desfaz o filtro (Web Interface
// Guidelines: estado de filtro/busca pertence à URL, nunca só à memória).
const LINE_PARAM = "linha";
const SEGMENT_PARAM = "segmento";
const FORMAT_PARAM = "formato";
const SEARCH_PARAM = "busca";
// Só adia a escrita na URL durante a digitação; clique em chip é imediato.
const SEARCH_URL_DEBOUNCE_MS = 300;

// A URL carrega o SLUG do segmento ("emagrecimento"), não o id interno: é o
// link que o vendedor manda pro cliente, precisa ser legível e estável. O
// estado local continua trabalhando com o id.
function readSegmentParam(params: URLSearchParams, segments: SegmentDTO[]): SegmentFilter {
  const slug = params.get(SEGMENT_PARAM)?.trim();
  if (!slug) return ALL_SEGMENTS;
  return segments.find((segment) => segment.slug === slug)?.id ?? ALL_SEGMENTS;
}

// O valor do formato JÁ é o enum do banco ("gummy", "capsula"...) — ao
// contrário do segmento, não existe slug separado, então a URL guarda o
// próprio valor. Só aceita um valor que exista de fato entre as fórmulas
// recebidas; qualquer outra coisa (link velho, digitado à mão) cai para
// "todos" em vez de filtrar por um formato que não existe.
function readFormatParam(params: URLSearchParams, formulas: FormulaDTO[]): FormatFilter {
  const value = params.get(FORMAT_PARAM)?.trim();
  if (!value) return ALL_FORMATS;
  return formulas.some((formula) => formula.format === value) ? (value as FormatFilter) : ALL_FORMATS;
}

function readSearchParam(params: URLSearchParams): string {
  return params.get(SEARCH_PARAM) ?? "";
}

function subtituloDaLinha(formulas: readonly FormulaDTO[]): string {
  const comPreco = formulas.filter((formula) => formula.listPriceCents != null).length;
  if (comPreco === formulas.length) return "Composição, modo de uso e preço direto do nosso catálogo vigente.";
  if (comPreco === 0) return "Composição e modo de uso de cada fórmula. Preço sob consulta.";
  return "Composição, modo de uso e preço de cada fórmula. As que não mostram preço são sob consulta.";
}

// Linha vem de ?linha= quando o valor é uma linha com fórmula. Sem o
// parâmetro, um link que só traz ?segmento= (ex.: "diabetes") abre na linha
// onde aquele segmento tem produto — senão o cliente cairia na Premium e o
// filtro de segmento seria descartado em silêncio. Sem nada, a primeira aba.
function readLineParam(
  params: URLSearchParams,
  lines: readonly ProductLine[],
  segments: SegmentDTO[],
  formulas: FormulaDTO[],
): ProductLine {
  const fallback = lines[0] ?? "premium";
  const value = params.get(LINE_PARAM)?.trim();
  if (value) return lines.includes(value as ProductLine) ? (value as ProductLine) : fallback;
  const segmentSlug = params.get(SEGMENT_PARAM)?.trim();
  const segmentId = segments.find((segment) => segment.slug === segmentSlug)?.id;
  const lineOfSegment = formulas.find((formula) => formula.segmentId === segmentId)?.line;
  return lineOfSegment && lines.includes(lineOfSegment) ? lineOfSegment : fallback;
}

// Orquestrador client-side: os itens já chegam prontos do servidor (ver
// app/catalogo/page.tsx). Filtro por segmento e busca por nome rodam em
// memória, sem novo pedido ao banco — e ficam espelhados na URL
// (?segmento=&busca=) pra dar link compartilhável e Voltar/Avançar funcionando
// de verdade.
//
// Abas de linha: as Premium/Básicas saíram em 14/09/2026 (a divisão não
// sustentava preço e escondia três pares duplicados — migration
// 20260918000000_linha_unica_e_duplicatas.sql). Em 23/09/2026 o dono pediu uma
// linha nova, Essencial, separada da Premium "pra não ficar tudo misturado"
// (migration 20260923020000_linha_essencial.sql). A aba escolhida vai para
// ?linha=, e segmentos, formatos e cards passam a olhar só as fórmulas dela.
// Com uma linha só, nenhuma aba aparece.
export function CatalogView({ segments, formulas }: CatalogViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const lines = useMemo(() => availableLines(formulas), [formulas]);
  const [selectedLine, setSelectedLine] = useState<ProductLine>(() =>
    readLineParam(searchParams, lines, segments, formulas),
  );
  const [selectedSegment, setSelectedSegment] = useState<SegmentFilter>(() => readSegmentParam(searchParams, segments));
  const [selectedFormat, setSelectedFormat] = useState<FormatFilter>(() => readFormatParam(searchParams, formulas));
  const [search, setSearch] = useState<string>(() => readSearchParam(searchParams));

  const [quoteFormula, setQuoteFormula] = useState<FormulaDTO | null>(null);
  const [isQuoteOpen, setQuoteOpen] = useState(false);

  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fonte da verdade é a URL: quando ela muda por fora (Voltar/Avançar do
  // navegador, ou um link colado com filtro), o estado local se realinha.
  // Ajuste feito durante o render (comparando com a última URL vista), nunca
  // num useEffect — mesmo padrão já usado em QuoteModal para resetar estado a
  // partir de uma prop, é o jeito recomendado pelo React e o único que não
  // dispara um re-render em cascata a cada navegação. Nas mudanças que partem
  // daqui (clique em chip, digitação), a função abaixo já escreve essa mesma
  // URL, então esta comparação só confirma o que já está certo.
  const searchParamsKey = searchParams.toString();
  const [lastSyncedParamsKey, setLastSyncedParamsKey] = useState(searchParamsKey);
  if (searchParamsKey !== lastSyncedParamsKey) {
    setLastSyncedParamsKey(searchParamsKey);
    setSelectedLine(readLineParam(searchParams, lines, segments, formulas));
    setSelectedSegment(readSegmentParam(searchParams, segments));
    setSelectedFormat(readFormatParam(searchParams, formulas));
    setSearch(readSearchParam(searchParams));
  }

  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, []);

  // `mode` decide o que o botão Voltar faz. Clique em chip é uma escolha
  // deliberada: entra no histórico (push), então Voltar desfaz o filtro. Já a
  // digitação na busca usa replace, senão cada tecla viraria uma entrada e o
  // usuário teria que apertar Voltar dez vezes pra sair da página.
  function pushQueryParams(
    next: { linha?: ProductLine; segmento?: SegmentFilter; formato?: FormatFilter; busca?: string },
    mode: "push" | "replace" = "push",
  ) {
    const params = new URLSearchParams(searchParams.toString());
    const nextLine = next.linha ?? selectedLine;
    // A primeira aba é o padrão: não precisa ir para a URL.
    if (nextLine === lines[0]) params.delete(LINE_PARAM);
    else params.set(LINE_PARAM, nextLine);

    const nextSegment = next.segmento ?? selectedSegment;
    const nextFormat = next.formato ?? selectedFormat;
    const nextSearch = next.busca ?? search;

    const nextSlug = segments.find((segment) => segment.id === nextSegment)?.slug;
    if (nextSegment === ALL_SEGMENTS || !nextSlug) params.delete(SEGMENT_PARAM);
    else params.set(SEGMENT_PARAM, nextSlug);

    if (nextFormat === ALL_FORMATS) params.delete(FORMAT_PARAM);
    else params.set(FORMAT_PARAM, nextFormat);

    if (nextSearch.trim() === "") params.delete(SEARCH_PARAM);
    else params.set(SEARCH_PARAM, nextSearch);

    const query = params.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    if (mode === "push") router.push(url, { scroll: false });
    else router.replace(url, { scroll: false });
  }

  // Trocar de linha zera segmento e formato: o segmento escolhido quase nunca
  // existe na outra linha, e manter o filtro abriria a aba já vazia. A busca
  // continua — é texto do usuário, vale nas duas linhas.
  function handleSelectLine(line: ProductLine) {
    setSelectedLine(line);
    setSelectedSegment(ALL_SEGMENTS);
    setSelectedFormat(ALL_FORMATS);
    pushQueryParams({ linha: line, segmento: ALL_SEGMENTS, formato: ALL_FORMATS });
  }

  function handleSelectSegment(segmentId: SegmentFilter) {
    setSelectedSegment(segmentId);
    pushQueryParams({ segmento: segmentId });
  }

  function handleSelectFormat(format: FormatFilter) {
    setSelectedFormat(format);
    pushQueryParams({ formato: format });
  }

  function handleChangeSearch(value: string) {
    setSearch(value);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      pushQueryParams({ busca: value }, "replace");
    }, SEARCH_URL_DEBOUNCE_MS);
  }

  // "Limpar filtros" do estado vazio (segmento × formato sem produto): some
  // com os três critérios de uma vez e limpa a URL, em vez de pedir três
  // cliques separados.
  function handleClearFilters() {
    setSelectedSegment(ALL_SEGMENTS);
    setSelectedFormat(ALL_FORMATS);
    setSearch("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete(SEGMENT_PARAM);
    params.delete(FORMAT_PARAM);
    params.delete(SEARCH_PARAM);
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  const segmentsById = useMemo(() => {
    const map = new Map<string, SegmentDTO>();
    for (const segment of segments) map.set(segment.id, segment);
    return map;
  }, [segments]);

  // Critério de segmento traduzido de "sentinela de UI" (ALL_SEGMENTS) para o
  // "null = sem filtro" que a função pura de lib/catalog/catalog-filters.ts
  // espera — mantém aquele módulo sem precisar conhecer o valor "all" usado
  // aqui (mesma ideia de ALL_FORMATS ser deste componente pra baixo, nunca
  // subindo pro módulo de filtro).
  const segmentCriteria = selectedSegment === ALL_SEGMENTS ? null : selectedSegment;

  // Tudo abaixo olha só a linha da aba ativa: cards, contagem dos formatos e
  // chips de segmento (segmento sem produto nesta linha não vira chip).
  const lineFormulas = useMemo(
    () => formulas.filter((formula) => formula.line === selectedLine),
    [formulas, selectedLine],
  );
  const lineSegments = useMemo(
    () => segments.filter((segment) => lineFormulas.some((formula) => formula.segmentId === segment.id)),
    [segments, lineFormulas],
  );

  const filteredFormulas = useMemo(
    () => filterCatalogFormulas(lineFormulas, { segmentId: segmentCriteria, format: selectedFormat, searchTerm: search }),
    [lineFormulas, segmentCriteria, selectedFormat, search],
  );

  // Abas de formato: contagem por segmento+busca atuais, sem o próprio
  // formato (ver comentário em deriveFormatTabs) — é o que permite a aba
  // continuar visível com "(0)" quando a combinação não tem produto, em vez
  // de sumir e confundir quem está filtrando.
  const formatTabs = useMemo(
    () => deriveFormatTabs(lineFormulas, { segmentId: segmentCriteria, searchTerm: search }, PRODUCT_FORMAT_LABELS),
    [lineFormulas, segmentCriteria, search],
  );

  const hasActiveFilters = selectedSegment !== ALL_SEGMENTS || selectedFormat !== ALL_FORMATS || search.trim() !== "";

  const backgroundColors = useMemo((): readonly [string, string, string] => {
    if (selectedSegment === ALL_SEGMENTS) return DEFAULT_BACKGROUND;
    const segment = segmentsById.get(selectedSegment);
    if (!segment) return DEFAULT_BACKGROUND;
    const visual = segmentVisual(segment.name, segment.sortOrder);
    return [visual.from, visual.to, visual.from];
  }, [selectedSegment, segmentsById]);

  function handleQuote(formula: FormulaDTO) {
    setQuoteFormula(formula);
    setQuoteOpen(true);
  }

  return (
    <>
      <AnimatedBackground colors={backgroundColors} />
      <GlassTopBar searchValue={search} onSearchChange={handleChangeSearch} />

      {/* header/main/nav de verdade: título, filtros e grade viviam soltos
          como filhos do fragment (achado de auditoria "region" — leitor de
          tela pula esse conteúdo por não pertencer a landmark nenhum). Este
          <main> não carrega classe própria de propósito: só dá o landmark,
          sem tocar no layout visual de cada filho (cada um já tinha seu
          próprio max-width/padding calibrado, inclusive a faixa de filtros
          de ponta a ponta no mobile). */}
      <main id="main-content">
        <div className="lc-page-head">
          <h1>Catálogo de fórmulas</h1>
          {/* O subtítulo só promete preço quando a aba tem preço: a linha
              Essencial pode estar no ar com "Preço sob consulta" (decisão do
              dono de 23/09/2026). */}
          <p>{subtituloDaLinha(lineFormulas)}</p>
        </div>

        {lines.length > 1 && <LineTabs lines={lines} value={selectedLine} onChange={handleSelectLine} />}

        <div className="lc-filters">
          <SegmentChips segments={lineSegments} selected={selectedSegment} onSelect={handleSelectSegment} />
          <FormatChips tabs={formatTabs} selected={selectedFormat} onSelect={handleSelectFormat} />
        </div>

        {/* Região visualmente oculta, anunciada a cada filtragem — mesmo
            padrão do aviso de pedido mínimo em QuoteModal (role="status").
            Sem isto, quem usa leitor de tela não sabe quantas fórmulas
            apareceram nem que o filtro zerou a lista. */}
        <p className="lc-sr-only" role="status" aria-live="polite">
          {filteredFormulas.length === 0
            ? "Nenhuma fórmula encontrada para este filtro."
            : `${filteredFormulas.length} ${filteredFormulas.length === 1 ? "fórmula encontrada" : "fórmulas encontradas"}.`}
        </p>

        <div className="lc-container">
          {filteredFormulas.length === 0 ? (
            <EmptyState onClear={hasActiveFilters ? handleClearFilters : undefined} />
          ) : (
            <div className="lc-grid">
              {filteredFormulas.map((formula) => (
                <FormulaCard
                  key={formula.id}
                  formula={formula}
                  segment={segmentsById.get(formula.segmentId)}
                  onQuote={handleQuote}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="lc-footer">
        {/* Nota sóbria e honesta sobre o critério do selo (texto centralizado
            em lib/catalog/regulatory-info.ts, junto da procedência exata) -
            nunca afirma nem sugere que todo produto do catálogo está
            conforme, porque não está: só os que exibem o selo. */}
        <p className="lc-footer-compliance-note">{CATALOG_FOOTER_COMPLIANCE_NOTE}</p>
        <p>
          © 2026 <span translate="no">Lemon Caps</span> - Indústria de Suplementos e Nutracêuticos
        </p>
        <DeveloperCredit />
      </footer>

      <nav aria-label="Ações">
        <CartFab />
      </nav>

      <QuoteModal
        formula={quoteFormula}
        segment={quoteFormula ? segmentsById.get(quoteFormula.segmentId) : undefined}
        isOpen={isQuoteOpen}
        onClose={() => setQuoteOpen(false)}
      />
    </>
  );
}
