import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CompositionTable } from "@/components/catalog/CompositionTable";
import { DossiePdfButton } from "@/components/catalog/DossiePdfButton";
import { DossieTopBar } from "@/components/catalog/DossieTopBar";
import { hasContent, lineLabel, stripLeadingBulletMarker } from "@/lib/catalog/format-catalog";
import { getCatalogData, getFormulaBySlug, type FormulaDetailDTO } from "@/lib/data/formulas";
import { centsToBRL } from "@/lib/money";

// Next 16: params de rota dinâmica são sempre Promise, sem exceção e sem
// janela de compatibilidade síncrona (lemoncaps-catalogo-planejamento/
// next16-o-que-muda.md, seção 2). Tipagem manual em vez do helper global
// PageProps<'/catalogo/[slug]'>: esse tipo só existe depois que next
// dev/build/typegen já rodou pelo menos uma vez para esta rota nova — tipar à
// mão elimina essa dependência de ordem sem abrir mão de nada (a própria doc
// chama o helper de conveniente, nunca de obrigatório).
interface DossiePageProps {
  params: Promise<{ slug: string }>;
}

// Pré-gera as 28 fórmulas em build time (bom para velocidade e para busca) —
// reaproveita getCatalogData(), já cacheado, a mesma fonte de /catalogo.
export async function generateStaticParams() {
  const { formulas } = await getCatalogData();
  return formulas.map((formula) => ({ slug: formula.slug }));
}

export async function generateMetadata({ params }: DossiePageProps): Promise<Metadata> {
  const { slug } = await params;
  const formula = await getFormulaBySlug(slug);
  if (!formula) return {};

  const title = `${formula.technicalSheetTitle ?? formula.name} - Dossiê Técnico | Lemon Caps`;
  // Descrição genérica só cita o que existe em praticamente toda fórmula
  // (composição, modo de uso, condições comerciais) — nunca "benefícios" ou
  // "advertências" aqui, porque nem toda fórmula tem esses campos preenchidos
  // (ver dossies-o-que-falta.md) e a meta description não pode prometer o que
  // a página pode não ter.
  const description = hasContent(formula.description)
    ? formula.description
    : `Dossiê técnico completo de ${formula.name}: composição, modo de uso e condições comerciais.`;

  return { title, description };
}

// Fatos de identificação como definição (dt/dd): cada um só entra se tiver
// conteúdo real no banco, nunca "não informado" no lugar de campo vazio
// (regra de exatidão do projeto, AGENTS.md). "Nome" sempre entra, mesmo já
// aparecendo no <h1> (que prioriza technical_sheet_title quando existe) — é
// o jeito de o nome real do produto continuar visível caso o título da ficha
// técnica algum dia divirja dele no banco.
function buildIdentityFacts(formula: FormulaDetailDTO): Array<{ label: string; value: string }> {
  return [
    { label: "Nome", value: formula.name },
    formula.segment ? { label: "Segmento", value: formula.segment.name } : null,
    { label: "Linha", value: lineLabel(formula.line) },
    formula.regulatoryProductType ? { label: "Tipo regulatório", value: formula.regulatoryProductType } : null,
    formula.poteContentsDescription ? { label: "Apresentação", value: formula.poteContentsDescription } : null,
    formula.netWeight ? { label: "Peso líquido", value: formula.netWeight } : null,
  ].filter((fact): fact is { label: string; value: string } => fact !== null);
}

export default async function DossiePage({ params }: DossiePageProps) {
  const { slug } = await params;
  const formula = await getFormulaBySlug(slug);
  if (!formula) notFound();

  const identityFacts = buildIdentityFacts(formula);
  const hasBenefits = hasContent(formula.generalBenefitsSummary) || formula.benefits.length > 0;
  const subtitle = formula.segment ? `${formula.segment.name} · ${lineLabel(formula.line)}` : lineLabel(formula.line);

  // Mesmo padrão usado nas outras seções desta página: monta com "?? ''" pra
  // manter o tipo `string` (não `string | null`) e filtra por hasContent
  // depois. Só entra na lista quem tem conteúdo de verdade.
  const textSections: Array<{ title: string; content: string }> = [
    { title: "Informação nutricional", content: formula.nutritionalInfo ?? "" },
    { title: "Ingredientes", content: formula.ingredientsList ?? "" },
    { title: "Modo de uso", content: formula.usageInstructions ?? "" },
  ].filter((section) => hasContent(section.content));

  return (
    <>
      <DossieTopBar />
      <main className="lc-dossie-page">
        <div className="lc-dossie-head">
          <h1>{formula.technicalSheetTitle ?? formula.name}</h1>
          <p className="lc-dossie-subtitle">{subtitle}</p>
          <div className="lc-dossie-toolbar">
            <DossiePdfButton formula={formula} />
            {/* Recíproco do link "Ver dossiê técnico completo" da página de
                benefícios: as duas páginas do produto se acham uma à outra,
                sem precisar voltar ao catálogo no meio do caminho. */}
            {hasBenefits && (
              <Link href={`/catalogo/${formula.slug}/beneficios`} className="lc-modal-link">
                Ver benefícios
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>

        <div className="lc-dossie-body">
          <section className="lc-dossie-section">
            <h2>Identificação</h2>
            <dl className="lc-dossie-facts">
              {identityFacts.map((fact) => (
                <div className="lc-dossie-fact" key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="lc-dossie-section">
            <h2>Composição por dose</h2>
            <CompositionTable compositions={formula.compositions} maxHeightPx={null} />
          </section>

          {textSections.map((section) => (
            <section className="lc-dossie-section" key={section.title}>
              <h2>{section.title}</h2>
              <p className="lc-dossie-text">{section.content}</p>
            </section>
          ))}

          {hasBenefits && (
            <section className="lc-dossie-section">
              <h2>Benefícios</h2>
              {hasContent(formula.generalBenefitsSummary) && (
                <p className="lc-dossie-text">{formula.generalBenefitsSummary}</p>
              )}
              {formula.benefits.length > 0 && (
                <ul className="lc-dossie-benefits-list">
                  {formula.benefits.map((benefit, index) => (
                    <li key={`${index}-${benefit}`}>{stripLeadingBulletMarker(benefit)}</li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {hasContent(formula.targetAudience) && (
            <section className="lc-dossie-section">
              <h2>Público-alvo</h2>
              <p className="lc-dossie-text">{formula.targetAudience}</p>
            </section>
          )}

          {hasContent(formula.warnings) && (
            <section className="lc-dossie-section lc-dossie-warning">
              <h2>Advertências e restrições</h2>
              <p className="lc-dossie-text">{formula.warnings}</p>
            </section>
          )}

          {hasContent(formula.storageInstructions) && (
            <section className="lc-dossie-section">
              <h2>Conservação</h2>
              <p className="lc-dossie-text">{formula.storageInstructions}</p>
            </section>
          )}

          <section className="lc-dossie-section">
            <h2>Condições comerciais</h2>
            <dl className="lc-dossie-facts">
              <div className="lc-dossie-fact">
                <dt>Preço por pote</dt>
                <dd>{formula.listPriceCents != null ? centsToBRL(formula.listPriceCents) : "Sob consulta"}</dd>
              </div>
              <div className="lc-dossie-fact">
                <dt>Pedido mínimo</dt>
                <dd>{formula.minimumOrderPotes} potes</dd>
              </div>
            </dl>
          </section>
        </div>
      </main>
    </>
  );
}
