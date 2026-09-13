import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { DossieTopBar } from "@/components/catalog/DossieTopBar";
import { IngredientCard } from "@/components/catalog/IngredientCard";
import { hasContent, lineLabel, stripLeadingBulletMarker } from "@/lib/catalog/format-catalog";
import { getCatalogData, getFormulaBySlug } from "@/lib/data/formulas";

// Next 16: params de rota dinâmica são sempre Promise, sem exceção (mesma
// nota de app/catalogo/[slug]/page.tsx, que é a referência seguida aqui -
// conferido em lemoncaps-catalogo-planejamento/next16-o-que-muda.md, seção 2,
// e em node_modules/next/dist/docs/). Tipagem manual em vez do helper global
// PageProps<'/catalogo/[slug]/beneficios'> pelo mesmo motivo de lá: esse tipo
// só existe depois que next dev/build/typegen já rodou pelo menos uma vez
// para esta rota nova.
interface BeneficiosPageProps {
  params: Promise<{ slug: string }>;
}

// Mesmas 28 fórmulas de app/catalogo/[slug]/page.tsx, mesma fonte cacheada -
// as duas páginas do produto (dossiê e benefícios) nunca divergem entre si.
export async function generateStaticParams() {
  const { formulas } = await getCatalogData();
  return formulas.map((formula) => ({ slug: formula.slug }));
}

export async function generateMetadata({ params }: BeneficiosPageProps): Promise<Metadata> {
  const { slug } = await params;
  const formula = await getFormulaBySlug(slug);
  if (!formula) return {};

  const title = `${formula.name} - Benefícios | Lemon Caps`;
  // Mesma regra da dossiê: descrição genérica quando falta resumo próprio,
  // nunca inventando um benefício que o banco não confirma.
  const description = hasContent(formula.generalBenefitsSummary)
    ? formula.generalBenefitsSummary
    : `Benefícios e composição por insumo de ${formula.name}.`;

  return { title, description };
}

export default async function BeneficiosPage({ params }: BeneficiosPageProps) {
  const { slug } = await params;
  const formula = await getFormulaBySlug(slug);
  if (!formula) notFound();

  const hasBenefitsText = hasContent(formula.generalBenefitsSummary) || formula.benefits.length > 0;
  const subtitle = formula.segment ? `${formula.segment.name} · ${lineLabel(formula.line)}` : lineLabel(formula.line);

  return (
    <>
      {/* Mesmo topo do dossiê completo (marca + Voltar ao catálogo +
          carrinho): as duas páginas do produto compartilham o mesmo jeito de
          voltar, então reaproveitar em vez de duplicar. */}
      <DossieTopBar />
      <main className="lc-dossie-page">
        <div className="lc-dossie-head">
          <h1>Benefícios de {formula.name}</h1>
          <p className="lc-dossie-subtitle">{subtitle}</p>
          <div className="lc-dossie-toolbar">
            <Link href={`/catalogo/${formula.slug}`} className="lc-btn lc-btn-ghost">
              Ver dossiê técnico completo
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="lc-dossie-body">
          {hasBenefitsText && (
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

          <section className="lc-dossie-section">
            <h2>Insumos da fórmula</h2>
            {formula.compositions.length > 0 ? (
              <ul className="lc-ingredient-grid">
                {formula.compositions.map((composition) => (
                  <li key={composition.id}>
                    <IngredientCard composition={composition} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="lc-comp-empty">Composição não cadastrada.</p>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
