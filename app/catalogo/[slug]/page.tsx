import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

import { CompositionTable } from "@/components/catalog/CompositionTable";
import { DossiePdfButton } from "@/components/catalog/DossiePdfButton";
import { DossieTopBar } from "@/components/catalog/DossieTopBar";
import { ProductMockup } from "@/components/catalog/ProductMockup";
import { hasContent, lineLabel } from "@/lib/catalog/format-catalog";
import { getCatalogData, getFormulaBySlug, type FormulaDetailDTO } from "@/lib/data/formulas";
import { centsToBRL } from "@/lib/money";
import {
  formatComplianceDate,
  MANUFACTURER_INFO,
  REGULATORY_FRAMEWORK,
  REGULATORY_SOURCE,
} from "@/lib/catalog/regulatory-info";

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
          {/* Mockup em destaque - mesmo efeito de inclinação do card do
              catálogo, só que maior (ver ProductMockup e .lc-mockup-dossie em
              globals.css). Fórmula sem mockup_path não perde nada aqui: a
              seção some inteira, sem espaço vazio (regra do dono). */}
          {hasContent(formula.mockupPath) && (
            <div className="lc-dossie-mockup">
              <ProductMockup
                src={formula.mockupPath}
                alt={`Pote de ${formula.name}`}
                width={480}
                height={480}
                variant="dossie"
              />
            </div>
          )}
          <h1>{formula.technicalSheetTitle ?? formula.name}</h1>
          <p className="lc-dossie-subtitle">{subtitle}</p>
          <div className="lc-dossie-toolbar">
            <DossiePdfButton formula={formula} />
            {/* Recíproco do link "Ver dossiê técnico completo" da página de
                benefícios: as duas páginas do produto se acham uma à outra,
                sem precisar voltar ao catálogo no meio do caminho. */}
            {hasBenefits && (
              <Link href={`/catalogo/${formula.slug}/beneficios`} className="lc-btn lc-btn-ghost">
                Ver benefícios
                <ArrowRight size={16} aria-hidden="true" />
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

          {/* A seção "Benefícios" (resumo + lista) foi removida DAQUI de
              propósito - achado do dono em 13/09/2026: o mesmo texto
              (generalBenefitsSummary + benefits) aparecia duas vezes, aqui no
              dossiê e em app/catalogo/[slug]/beneficios/page.tsx, que existe
              porque foi pedido que benefícios abrissem em página própria, não
              expandindo o card. O botão "Ver benefícios" do toolbar acima
              (controlado por hasBenefits, mantido) já leva para lá - esse
              conteúdo agora vive só naquela página, nunca duplicado. */}

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

          {/* Conformidade é uma AFIRMAÇÃO sobre ESTA fórmula específica - só
              existe quando complianceVerifiedAt não é nulo (ver
              supabase/migrations/20260914000000_conformidade.sql). Nunca
              confundir com a seção seguinte ("Marco regulatório aplicável"),
              que é informação institucional igual em todo produto e não
              afirma conformidade de ninguém - separação pedida pelo dono
              para o layout nunca sugerir que citar a norma é o mesmo que
              cumpri-la. */}
          {formula.complianceVerifiedAt && (
            <section className="lc-dossie-section lc-dossie-compliance">
              <h2>
                <ShieldCheck size={15} aria-hidden="true" />
                Conformidade
              </h2>
              <p className="lc-dossie-text">
                Composição conferida contra os limites vigentes da ANVISA em{" "}
                {formatComplianceDate(formula.complianceVerifiedAt)}.
              </p>
              <dl className="lc-dossie-facts">
                <div className="lc-dossie-fact">
                  <dt>Normas conferidas</dt>
                  <dd>{formula.complianceNorms.join(", ")}</dd>
                </div>
                {formula.complianceSource && (
                  <div className="lc-dossie-fact">
                    <dt>Fonte consultada</dt>
                    <dd>
                      <a href={formula.complianceSource} target="_blank" rel="noopener noreferrer">
                        Texto consolidado da norma
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </section>
          )}

          {/* Marco regulatório aplicável: mesmo texto em TODO produto do
              catálogo (não é dado de banco, é lei/norma - ver
              lib/catalog/regulatory-info.ts para a procedência de cada
              item). Citar a norma que rege esta categoria de produto não é
              o mesmo que afirmar que ESTA fórmula específica a cumpre -
              essa afirmação só está na seção "Conformidade" acima, quando
              existir. */}
          <section className="lc-dossie-section lc-dossie-legal">
            <h2>Marco regulatório aplicável</h2>
            <p className="lc-dossie-text">
              Suplementos alimentares da Lemon Caps são fabricados sob o seguinte marco regulatório da ANVISA:
            </p>
            <ul className="lc-dossie-legal-list">
              {REGULATORY_FRAMEWORK.map((item) => (
                <li key={item.norm}>
                  <b>{item.norm}</b> - {item.description}
                </li>
              ))}
            </ul>
            <p className="lc-dossie-legal-note">
              Fonte consultada: {REGULATORY_SOURCE.label}, conferida em {REGULATORY_SOURCE.consultedAtLabel}.
            </p>
          </section>

          {/* Rodapé institucional: mesmo dado de fabricante em TODO produto,
              vindo dos Dizeres de Rotulagem oficiais da fábrica (ver
              lib/catalog/regulatory-info.ts para a procedência exata). */}
          <section className="lc-dossie-section lc-dossie-legal">
            <h2>Fabricante e responsabilidade técnica</h2>
            <p className="lc-dossie-legal-note">
              Fabricado e envasado por {MANUFACTURER_INFO.companyName}, CNPJ {MANUFACTURER_INFO.cnpj}.
              <br />
              {MANUFACTURER_INFO.address}.
              <br />
              Farmacêutico responsável: {MANUFACTURER_INFO.pharmacist}.
              <br />
              {MANUFACTURER_INFO.registrationExemption}
              <br />
              SAC: {MANUFACTURER_INFO.sac}
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
