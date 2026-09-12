"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import type { ProductLine } from "@/lib/catalog/format-catalog";
import { DEFAULT_BACKGROUND, segmentVisual } from "@/lib/catalog/segment-visuals";
import type { FormulaDTO, SegmentDTO } from "@/lib/data/formulas";
import { AnimatedBackground } from "./AnimatedBackground";
import { CartFab } from "./CartFab";
import { EmptyState } from "./EmptyState";
import { FormulaCard } from "./FormulaCard";
import { GlassTopBar } from "./GlassTopBar";
import { LineTabs } from "./LineTabs";
import { QuoteModal } from "./QuoteModal";
import { ALL_SEGMENTS, SegmentChips, type SegmentFilter } from "./SegmentChips";
import { TechnicalSheetModal } from "./TechnicalSheetModal";

interface CatalogViewProps {
  segments: SegmentDTO[];
  formulas: FormulaDTO[];
}

// Nomes dos query params na URL — o vendedor manda pro cliente o link já
// filtrado, e o botão Voltar do navegador desfaz o filtro (Web Interface
// Guidelines: estado de filtro/busca pertence à URL, nunca só à memória).
const SEGMENT_PARAM = "segmento";
const LINE_PARAM = "linha";
const SEARCH_PARAM = "busca";
const DEFAULT_LINE: ProductLine = "premium";
// Só adia a escrita na URL durante a digitação; clique em chip/aba é imediato.
const SEARCH_URL_DEBOUNCE_MS = 300;

// A URL carrega o SLUG do segmento ("emagrecimento"), não o id interno: é o
// link que o vendedor manda pro cliente, precisa ser legível e estável. O
// estado local continua trabalhando com o id.
function readSegmentParam(params: URLSearchParams, segments: SegmentDTO[]): SegmentFilter {
  const slug = params.get(SEGMENT_PARAM)?.trim();
  if (!slug) return ALL_SEGMENTS;
  return segments.find((segment) => segment.slug === slug)?.id ?? ALL_SEGMENTS;
}

function readLineParam(params: URLSearchParams): ProductLine {
  return params.get(LINE_PARAM) === "basica" ? "basica" : DEFAULT_LINE;
}

function readSearchParam(params: URLSearchParams): string {
  return params.get(SEARCH_PARAM) ?? "";
}

// Orquestrador client-side: os 28 itens já chegam prontos do servidor (ver
// app/catalogo/page.tsx). Filtro por segmento, busca por nome e abas
// Premium/Básicas rodam todos em memória, sem novo pedido ao banco — e ficam
// espelhados na URL (?segmento=&linha=&busca=) pra dar link compartilhável e
// Voltar/Avançar funcionando de verdade.
export function CatalogView({ segments, formulas }: CatalogViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedSegment, setSelectedSegment] = useState<SegmentFilter>(() => readSegmentParam(searchParams, segments));
  const [line, setLine] = useState<ProductLine>(() => readLineParam(searchParams));
  const [search, setSearch] = useState<string>(() => readSearchParam(searchParams));

  const [quoteFormula, setQuoteFormula] = useState<FormulaDTO | null>(null);
  const [isQuoteOpen, setQuoteOpen] = useState(false);
  const [dossieFormula, setDossieFormula] = useState<FormulaDTO | null>(null);
  const [isDossieOpen, setDossieOpen] = useState(false);

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
    setSelectedSegment(readSegmentParam(searchParams, segments));
    setLine(readLineParam(searchParams));
    setSearch(readSearchParam(searchParams));
  }

  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, []);

  // `mode` decide o que o botão Voltar faz. Clique em chip ou aba é uma escolha
  // deliberada: entra no histórico (push), então Voltar desfaz o filtro. Já a
  // digitação na busca usa replace, senão cada tecla viraria uma entrada e o
  // usuário teria que apertar Voltar dez vezes pra sair da página.
  function pushQueryParams(
    next: { segmento?: SegmentFilter; linha?: ProductLine; busca?: string },
    mode: "push" | "replace" = "push",
  ) {
    const params = new URLSearchParams(searchParams.toString());
    const nextSegment = next.segmento ?? selectedSegment;
    const nextLine = next.linha ?? line;
    const nextSearch = next.busca ?? search;

    const nextSlug = segments.find((segment) => segment.id === nextSegment)?.slug;
    if (nextSegment === ALL_SEGMENTS || !nextSlug) params.delete(SEGMENT_PARAM);
    else params.set(SEGMENT_PARAM, nextSlug);

    if (nextLine === DEFAULT_LINE) params.delete(LINE_PARAM);
    else params.set(LINE_PARAM, nextLine);

    if (nextSearch.trim() === "") params.delete(SEARCH_PARAM);
    else params.set(SEARCH_PARAM, nextSearch);

    const query = params.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    if (mode === "push") router.push(url, { scroll: false });
    else router.replace(url, { scroll: false });
  }

  function handleSelectSegment(segmentId: SegmentFilter) {
    setSelectedSegment(segmentId);
    pushQueryParams({ segmento: segmentId });
  }

  function handleChangeLine(nextLine: ProductLine) {
    setLine(nextLine);
    pushQueryParams({ linha: nextLine });
  }

  function handleChangeSearch(value: string) {
    setSearch(value);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      pushQueryParams({ busca: value }, "replace");
    }, SEARCH_URL_DEBOUNCE_MS);
  }

  const segmentsById = useMemo(() => {
    const map = new Map<string, SegmentDTO>();
    for (const segment of segments) map.set(segment.id, segment);
    return map;
  }, [segments]);

  const filteredFormulas = useMemo(() => {
    const term = search.trim().toLowerCase();
    return formulas.filter((formula) => {
      const matchesSegment = selectedSegment === ALL_SEGMENTS || formula.segmentId === selectedSegment;
      const matchesLine = formula.line === line;
      const matchesSearch = term === "" || formula.name.toLowerCase().includes(term);
      return matchesSegment && matchesLine && matchesSearch;
    });
  }, [formulas, selectedSegment, line, search]);

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

  function handleViewDossie(formula: FormulaDTO) {
    setDossieFormula(formula);
    setDossieOpen(true);
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
      <main>
        <div className="lc-page-head">
          <h1>Catálogo de fórmulas</h1>
          <p>Composição, modo de uso e preço direto do nosso catálogo vigente.</p>
        </div>

        <div className="lc-filters">
          <SegmentChips segments={segments} selected={selectedSegment} onSelect={handleSelectSegment} />
          <LineTabs value={line} onChange={handleChangeLine} />
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
            <EmptyState />
          ) : (
            <div className="lc-grid">
              {filteredFormulas.map((formula) => (
                <FormulaCard
                  key={formula.id}
                  formula={formula}
                  segment={segmentsById.get(formula.segmentId)}
                  onQuote={handleQuote}
                  onViewDossie={handleViewDossie}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="lc-footer">
        © 2026 <span translate="no">Lemon Caps</span> - Indústria de Suplementos e Nutracêuticos
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
      <TechnicalSheetModal
        formula={dossieFormula}
        segment={dossieFormula ? segmentsById.get(dossieFormula.segmentId) : undefined}
        isOpen={isDossieOpen}
        onClose={() => setDossieOpen(false)}
      />
    </>
  );
}
