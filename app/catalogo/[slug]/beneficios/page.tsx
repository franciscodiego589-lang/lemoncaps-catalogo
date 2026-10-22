import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { DossieTopBar } from "@/components/catalog/DossieTopBar";
import { IngredientCard } from "@/components/catalog/IngredientCard";
import { ProductMockup } from "@/components/catalog/ProductMockup";
import { FORMAT_ICONS, hasContent, lineLabel, stripLeadingBulletMarker } from "@/lib/catalog/format-catalog";
import { segmentVisual } from "@/lib/catalog/segment-visuals";
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

  // Pedido do dono (14/09/2026): esta página também mostra a foto do
  // produto, não só texto. mockupPath já vem no FormulaDetailDTO devolvido
  // por getFormulaBySlug (o mesmo objeto que o dossiê completo usa) - nada
  // de buscar de novo, nada de supor caminho de arquivo.
  const hasMockup = hasContent(formula.mockupPath);
  // Mesmo cálculo de FormulaCard.tsx: cor do gradiente do segmento (curada
  // por nome, com ciclo de reserva por sort_order quando o segmento não tem
  // par curado) para o ladrilho da foto nunca ficar branco/vazio quando a
  // fórmula não tem mockup_path - mesma regra de "nunca um buraco" do card
  // da vitrine.
  const visual = formula.segment ? segmentVisual(formula.segment.name, formula.segment.sortOrder) : segmentVisual("", 0);
  const FormatIcon = FORMAT_ICONS[formula.format];
  const headingStyle = { "--seg-c1": visual.from, "--seg-c2": visual.to } as CSSProperties;

  return (
    <>
      {/* Mesmo topo do dossiê completo (marca + Voltar ao catálogo +
          carrinho): as duas páginas do produto compartilham o mesmo jeito de
          voltar, então reaproveitar em vez de duplicar. */}
      <DossieTopBar />
      <main className="lc-dossie-page" id="main-content">
        <div className="lc-dossie-head">
          {/* Foto do pote ao lado do título (.lc-beneficios-heading, CSS
              enviado ao dono para entrar em globals.css). Reaproveita o MESMO
              ProductMockup do dossiê completo e do card da vitrine, aqui na
              variante "card" (loading="lazy", palco de 136px já testado no
              card, ver ProductMockup.tsx e .lc-mockup-card em globals.css) -
              nunca a variante "dossie" (preload): esta página é de LEITURA do
              texto de benefício, a foto é apoio ao título e não é o maior
              elemento visível da página (o texto é), então não faz sentido
              competir por banda com prioridade de carregamento (o dossiê
              completo já cobre o tratamento de "foto em destaque" para quem
              quer ver o pote grande).

              Empilhada ACIMA do título em telas estreitas e ao LADO dele a
              partir de 680px (mesmo ponto de corte já usado por
              .lc-dossie-toolbar acima nesta folha de estilo) - decisão
              deliberada: o h1 (que já é um texto longo, "Benefícios de" +
              nome da fórmula) continua ocupando a largura CHEIA da coluna de
              leitura (760px) nas telas estreitas, em vez de dividir espaço
              com a foto - se a foto ficasse do lado do título também a
              320-480px, o mesmo texto quebraria em MAIS linhas do que quebra
              hoje sem foto nenhuma, o contrário do que se quer. O ladrilho da
              foto tem altura fixa e pequena (148px, o mesmo número já usado
              em .lc-card-media/.lc-mockup-card), então o acréscimo antes do
              primeiro benefício é previsível e comprovadamente menor do que a
              foto de 220px que o dossiê completo já mostra no topo (página
              vizinha, mesmo padrão, já aprovada pelo dono).

              Fórmula sem mockup_path (regra de exatidão em mockupPath, ver
              lib/data/formulas.ts: nunca supor qual pote é aquele) cai no
              MESMO ícone de formato + gradiente do segmento que o card da
              vitrine usa em FormulaCard.tsx - nunca um buraco vazio no lugar
              da foto. */}
          <div className="lc-beneficios-heading" style={headingStyle}>
            <div className={`lc-beneficios-media${hasMockup ? " lc-beneficios-media--mockup" : ""}`}>
              {hasMockup ? (
                <ProductMockup
                  src={formula.mockupPath as string}
                  alt={`Pote de ${formula.name}`}
                  width={240}
                  height={240}
                  variant="card"
                />
              ) : (
                <FormatIcon className="lc-icon" size={40} aria-hidden="true" />
              )}
            </div>
            <div className="lc-beneficios-heading-text">
              <h1>Benefícios de {formula.name}</h1>
              <p className="lc-dossie-subtitle">{subtitle}</p>
            </div>
          </div>
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
                {formula.compositions.map((composition, index) => (
                  <li key={composition.id}>
                    <IngredientCard composition={composition} index={index} />
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
