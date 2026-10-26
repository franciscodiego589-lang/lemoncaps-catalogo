"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { ShieldCheck, Star } from "lucide-react";

import { centsToBRL } from "@/lib/money";
import { ROTULO_DESTAQUE } from "@/lib/catalog/featured";
import { FORMAT_ICONS, hasContent, lineLabel } from "@/lib/catalog/format-catalog";
import { formatComplianceDate } from "@/lib/catalog/regulatory-info";
import { segmentVisual } from "@/lib/catalog/segment-visuals";
import type { FormulaDTO, SegmentDTO } from "@/lib/data/formulas";
import { CompositionTable } from "./CompositionTable";
import { ProductMockup } from "./ProductMockup";

interface FormulaCardProps {
  formula: FormulaDTO;
  segment: SegmentDTO | undefined;
  onQuote: (formula: FormulaDTO) => void;
}

const COMPOSITION_PREVIEW_LIMIT = 5;

// O card é CONTEÚDO — sempre sólido, nunca vidro, nunca backdrop-filter (ver
// regra central em app/globals.css). Todo texto vem exato do DTO; campo
// vazio/nulo esconde o elemento correspondente, nunca mostra "null".
export function FormulaCard({ formula, segment, onQuote }: FormulaCardProps) {
  const visual = segment ? segmentVisual(segment.name, segment.sortOrder) : segmentVisual("", 0);
  const FormatIcon = FORMAT_ICONS[formula.format];
  const hasBenefitsContent = hasContent(formula.generalBenefitsSummary) || formula.benefits.length > 0;
  const hasDossieContent =
    formula.compositions.length > 0 ||
    hasContent(formula.technicalSheetTitle) ||
    hasContent(formula.usageInstructions) ||
    hasContent(formula.nutritionalInfo) ||
    hasContent(formula.ingredientsList) ||
    hasContent(formula.targetAudience) ||
    hasContent(formula.storageInstructions) ||
    hasContent(formula.warnings);
  const hasFormatRow = hasContent(formula.regulatoryProductType) || hasContent(formula.poteContentsDescription);

  // As quatro variáveis de cor do segmento vivem no card inteiro (não só na
  // faixa de mídia): a cor do rótulo de segmento (.lc-card-segment, com troca
  // clara/escura já definida em globals.css) lê --seg-text-light/dark daqui.
  const cardStyle = {
    "--seg-c1": visual.from,
    "--seg-c2": visual.to,
    "--seg-text-light": visual.textLight,
    "--seg-text-dark": visual.textDark,
  } as CSSProperties;

  const hasMockup = hasContent(formula.mockupPath);

  return (
    <article className="lc-card" style={cardStyle}>
      {/* O gradiente do segmento continua sendo o fundo da faixa nos dois
          casos (--seg-c1/--seg-c2, definidos acima) - com mockup, o pote
          aparece por cima dele; sem mockup, o ícone de traço continua exatamente
          como antes (produto sem foto nunca fica com buraco). */}
      {/* Clique na foto do pote abre as informações do produto (pedido do dono,
          23/09/2026) — mesmo destino do título. Fora da ordem de Tab e oculto do
          leitor de tela: o título logo abaixo já é esse mesmo link com nome, e
          dois links iguais seguidos só atrapalham quem navega por teclado. */}
      <Link
        href={`/catalogo/${formula.slug}`}
        className={`lc-card-media${hasMockup ? " lc-card-media--mockup" : ""}`}
        tabIndex={-1}
        aria-hidden="true"
      >
        <span className="lc-tier-badge">{lineLabel(formula.line)}</span>
        {hasMockup ? (
          <ProductMockup
            src={formula.mockupPath as string}
            alt={`Pote de ${formula.name}`}
            width={240}
            height={240}
            variant="card"
          />
        ) : (
          // 48px, e não os 26px de quando a faixa media 76px: a faixa agora
          // tem a mesma altura em todo card (ver .lc-card-media), e um ícone
          // pequeno demais no meio dela pareceria imagem que não carregou.
          <FormatIcon className="lc-icon" size={48} aria-hidden="true" />
        )}
      </Link>
      <div className="lc-card-body">
        {/* Selo de destaque (formulas.featured_at, migration 20260916143000).
            Conteúdo, logo sólido - nunca vidro. Três decisões deliberadas:

            1. O rótulo é "Destaque", e não "Mais vendido" nem "Recomendado":
               não existe dado de venda neste sistema que sustente as outras
               duas frases. "Destaque" descreve o que de fato aconteceu - a
               fábrica escolheu este produto para a frente da vitrine.
            2. Nunca é só cor: estrela (forma) + a palavra escrita (texto).
               Quem não distingue a cor lê o selo do mesmo jeito.
            3. Produto sem destaque não ganha nada no lugar - nenhum espaço
               vazio, nenhum "sem destaque". */}
        {formula.featuredAt !== null && (
          <div className="lc-featured-badge">
            <Star className="lc-icon" size={13} aria-hidden="true" fill="currentColor" strokeWidth={1.5} />
            <span>{ROTULO_DESTAQUE}</span>
          </div>
        )}
        {hasContent(segment?.name) && <div className="lc-card-segment">{segment?.name}</div>}
        <h2 className="lc-card-title">
          {/* Navegação de verdade (não div clicável): leva ao dossiê completo
              da fórmula em /catalogo/[slug] — diretrizes de interface pedem
              <Link>, nunca onClick num elemento não-interativo. */}
          <Link href={`/catalogo/${formula.slug}`} className="lc-card-title-link" title={formula.name}>
            {formula.name}
          </Link>
        </h2>
        {formula.complianceVerifiedAt && (
          // Selo é CONTEÚDO (fato verificado sobre o produto), por isso sempre
          // sólido — nunca reaproveita a classe .lc-tier-badge (essa é vidro,
          // ver "vidro no cromo" em globals.css). Só renderiza quando
          // complianceVerifiedAt não é nulo; produto sem selo não ganha aviso
          // negativo nem espaço vazio no lugar (regra do dono).
          //
          // Acessibilidade: texto visível (não é só ícone/cor) + tabIndex para
          // foco por teclado/toque + aria-describedby aponta pro texto
          // completo (normas + data), sempre no DOM e sempre lido por leitor
          // de tela, revelado visualmente ao passar o mouse ou focar/tocar
          // (CSS :hover/:focus em .lc-compliance-badge, globals.css).
          <div className="lc-compliance-badge" tabIndex={0} aria-describedby={`compliance-detail-${formula.id}`}>
            <ShieldCheck className="lc-icon" size={14} aria-hidden="true" />
            <span>Composição conferida</span>
            <span id={`compliance-detail-${formula.id}`} role="tooltip" className="lc-compliance-tooltip">
              {formula.complianceNorms.join(", ")} · verificado em {formatComplianceDate(formula.complianceVerifiedAt)}
            </span>
          </div>
        )}
        {/* A descrição comercial saiu do card por ordem do dono (13/09/2026):
            no espaço de duas linhas ela sempre aparecia cortada com reticências
            ("...uma fórmula avançada desenvolvida para pessoas que…"), o que não
            informa nada e ainda desalinhava a altura dos cards entre si. O texto
            completo continua no dossiê do produto, em /catalogo/[slug]. O campo
            segue no banco e na página de edição do admin — só não é exibido
            aqui. */}
        {hasFormatRow && (
          <div className="lc-card-format">
            <span>{formula.regulatoryProductType ?? ""}</span>
            <span>{formula.poteContentsDescription ?? ""}</span>
          </div>
        )}

        <CompositionTable
          compositions={formula.compositions}
          limit={COMPOSITION_PREVIEW_LIMIT}
          viewAllHref={`/catalogo/${formula.slug}`}
        />

        {hasContent(formula.usageInstructions) && (
          <p className="lc-card-usage">
            <b>Modo de uso:</b> {formula.usageInstructions}
          </p>
        )}

        {/* Rodapé ancorado na base do card (margin-top: auto dentro do flex
            column de .lc-card-body): preço, pedido mínimo e ações ficam
            alinhados entre cards da mesma linha da grade, mesmo com corpos de
            altura diferente. */}
        <div className="lc-card-footer">
          {formula.listPriceCents != null ? (
            <div className="lc-price-row">
              <span className="lc-price">
                {centsToBRL(formula.listPriceCents)}
                <small> / pote</small>
              </span>
            </div>
          ) : (
            // Sem preço cadastrado: o card mantém o lugar do preço ("R$ -- / pote") e o
            // valor aparece sozinho quando o dono salva o preço no admin (pedido do dono,
            // 26/10/2026). O aria-label diz por extenso o que os tracinhos significam.
            <div className="lc-price-row">
              <span className="lc-price" aria-label="Preço sob consulta">
                R$ --
                <small> / pote</small>
              </span>
            </div>
          )}
          <span className="lc-min-note">Pedido mínimo: {formula.minimumOrderPotes} potes</span>

          <div className="lc-card-actions">
            {/* Link navega, botão age (diretrizes de interface): Benefícios e
                Dossiê Técnico só trocam de página, então são <Link> de
                verdade, não onClick fingindo navegação. Cotar Fórmula é a
                única ação real do card (abre o modal de cotação). */}
            {hasBenefitsContent && (
              <Link href={`/catalogo/${formula.slug}/beneficios`} className="lc-btn lc-btn-ghost">
                Benefícios
              </Link>
            )}
            {hasDossieContent && (
              <Link href={`/catalogo/${formula.slug}`} className="lc-btn lc-btn-ghost">
                Dossiê técnico
              </Link>
            )}
            {/* Em todos os cards, com ou sem preço (pedido do dono, 21/10/2026):
                sem preço, a cotação sai como "Preço sob consulta". */}
            <button type="button" className="lc-btn lc-btn-primary" onClick={() => onQuote(formula)}>
              Cotar fórmula
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
