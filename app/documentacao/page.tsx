import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  ChevronDown,
  FileCheck2,
  History,
  ScrollText,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

import { GlassSurface } from "@/components/glass/GlassSurface";
import {
  COMPANY_LICENSES,
  MANUFACTURER_INFO,
  REGISTRATION_REGIME,
  REGULATORY_AMENDMENTS,
  REGULATORY_CONSOLIDATION_NOTE,
  REGULATORY_DECLARATION,
  REGULATORY_HIERARCHY_NOTE,
  REGULATORY_INSTRUCTIONS,
  REGULATORY_RESOLUTIONS,
  REGULATORY_SOURCE,
  regulatoryScopeSentence,
  type RegulatoryFrameworkItem,
} from "@/lib/catalog/regulatory-info";

export const metadata: Metadata = {
  title: "Documentação regulatória - Lemon Caps",
  description:
    "As normas da Anvisa e da vigilância sanitária que a Lemon Caps segue para fabricar suplementos alimentares: Resoluções, Instruções Normativas, regime de regularização e responsabilidade técnica.",
};

// ---------------------------------------------------------------------------
// Página pedida pelo dono em 13/09/2026: "coloca um botão de documentação, por
// exemplo, de todas as normas que seguimos da ANVISA e vigilância sanitária".
//
// A página reúne num só lugar o que antes só existia recolhido no fim do
// dossiê. A ordem é a do pedido posterior dele, no mesmo dia: DECLARAÇÃO
// institucional em destaque primeiro, normas como lastro depois - e sem
// miudeza de anexo ("incluiu o limite de boro, silício, MSM..."), que é
// registro técnico de alteração normativa e não interessa a quem compra.
//
// ---------------------------------------------------------------------------
// PROCEDÊNCIA DE TUDO QUE ESTÁ AQUI
// ---------------------------------------------------------------------------
// Nenhum texto desta página é digitado no JSX: tudo vem de
// lib/catalog/regulatory-info.ts, onde a procedência de cada norma está
// documentada linha a linha. Cada uma das dez normas principais foi aberta
// individualmente no AnvisaLegis (o portal oficial de legislação consolidada
// da Anvisa) em 13/09/2026, e a ementa exibida é a LITERAL do cabeçalho do
// ato. Duas normas que o catálogo citava ou quase citou saíram porque estão
// revogadas - RDC 240/2018 e RDC 26/2015; o motivo de cada uma está no
// comentário de topo daquele arquivo.
//
// ---------------------------------------------------------------------------
// O QUE NÃO ENTRA NESTA PÁGINA - e por quê
// ---------------------------------------------------------------------------
// - Certificações (BPF/GMP, ISO, HACCP): NENHUMA está confirmada em documento.
//   Não aparecem, não são sugeridas e não ficam subentendidas. Uma página de
//   documentação regulatória que insinua certificado que não existe destrói
//   exatamente a credibilidade que ela deveria construir.
// - Autorização de Funcionamento de Empresa (AFE): continua fora. Não foi
//   fornecido documento, e suplemento alimentar não é categoria que a exija -
//   afirmar que a fábrica a possui, sem o papel, seria o mesmo erro das
//   certificações acima.
//
// JÁ NÃO SE APLICA - licença sanitária e alvará de funcionamento: o dono
// forneceu os três documentos em 14/09/2026 e eles entraram, na seção
// "Licenças da fábrica". Entraram como DADO VERIFICÁVEL (número, validade,
// órgão, onde conferir) e não como PDF: o arquivo inteiro carrega e-mail
// financeiro, telefones, CPF parcial e assinaturas de servidores, que não têm
// por que circular em página pública. A procedência de cada campo e as
// divergências entre os próprios documentos oficiais estão no comentário de
// COMPANY_LICENSES, em lib/catalog/regulatory-info.ts.
// - Afirmação de que qualquer fórmula específica cumpre a norma: isso é o selo
//   de conformidade, individual, com data, condicionado a
//   complianceVerifiedAt. A declaração institucional NUNCA o substitui - é o
//   que diz o parágrafo `boundary`, exibido em destaque próprio abaixo.
// ---------------------------------------------------------------------------

function NormList({ items }: { items: RegulatoryFrameworkItem[] }) {
  return (
    <dl className="lc-doc-norm-list">
      {items.map((item) => (
        <div className="lc-doc-norm" key={item.norm}>
          <dt>
            {/* Número da norma como link para o texto oficial no AnvisaLegis
                (pedido do dono, 14/09/2026 - url vem de lib/catalog/regulatory-info.ts,
                conferida norma a norma, nunca digitada aqui). O texto visível é só o
                número, por isso title/aria-label dizem por extenso para onde o link
                leva - "clique aqui" genérico não seria um nome acessível válido.
                target="_blank" + rel="noreferrer noopener": mesmo tratamento do link
                do AnvisaLegis na seção "De onde vieram estas informações", abaixo. */}
            <a
              className="lc-doc-norm-id lc-norm-link"
              href={item.url}
              target="_blank"
              rel="noreferrer noopener"
              title={`Abre o texto oficial de ${item.norm} no AnvisaLegis, em nova guia`}
              aria-label={`Abre o texto oficial de ${item.norm} no AnvisaLegis, em nova guia`}
            >
              {item.norm}
            </a>
            <span className="lc-doc-norm-date">de {item.date}</span>
            <span className="lc-doc-norm-status">{item.status}</span>
          </dt>
          <dd>
            {item.summary}{" "}
            <span className="lc-doc-norm-scope">{regulatoryScopeSentence(item)}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}

export default function DocumentacaoPage() {
  return (
    <>
      <header className="lc-topbar">
        <GlassSurface as="nav" className="lc-topbar-inner" aria-label="Principal">
          <Link href="/" className="lc-brand lc-brand-link">
            <span className="lc-brand-dot" aria-hidden="true" />
            <span translate="no">Lemon Caps</span>
          </Link>
          <Link href="/catalogo" className="lc-btn lc-btn-primary lc-btn-icon-inline lc-home-topbar-cta">
            Ver catálogo
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </GlassSurface>
      </header>

      <main className="lc-doc-main" id="main-content">
        {/* 1. A declaração, em destaque. É o que o dono quis que o comprador
            leia primeiro: postura, não lista de lei. */}
        <section className="lc-doc-hero" aria-labelledby="lc-doc-title">
          <span className="lc-doc-eyebrow">
            <ShieldCheck size={15} aria-hidden="true" />
            Documentação regulatória
          </span>
          <h1 id="lc-doc-title">{REGULATORY_DECLARATION.headline}</h1>
          <p className="lc-doc-lead">{REGULATORY_DECLARATION.intro}</p>

          <ul className="lc-doc-claims">
            {REGULATORY_DECLARATION.statements.map((statement) => (
              <li key={statement.title}>
                <h2>{statement.title}</h2>
                <p>{statement.text}</p>
              </li>
            ))}
          </ul>

          {/* A fronteira. Fica em destaque próprio, e não em letra miúda, de
              propósito: é o que separa "a fábrica trabalha assim" de "este
              produto foi conferido". */}
          <p className="lc-doc-boundary">{REGULATORY_DECLARATION.boundary}</p>
        </section>

        {/* 2. RDC x IN explicado em uma frase - o comprador não sabe a
            diferença, e saber disso é o que faz a lista abaixo ter sentido. */}
        <section className="lc-doc-section" aria-labelledby="lc-doc-hierarchy-title">
          <h2 id="lc-doc-hierarchy-title">
            <ScrollText size={18} aria-hidden="true" />
            Como a norma se organiza
          </h2>
          <p className="lc-doc-text">{REGULATORY_HIERARCHY_NOTE}</p>
        </section>

        {/* 3. O lastro: as normas, uma linha cada, Resoluções primeiro. */}
        <section className="lc-doc-section" aria-labelledby="lc-doc-rdc-title">
          <h2 id="lc-doc-rdc-title">Resoluções da Diretoria Colegiada (RDC)</h2>
          <p className="lc-doc-text">
            São as normas que estabelecem os requisitos sanitários. Vêm primeiro na hierarquia.
          </p>
          <NormList items={REGULATORY_RESOLUTIONS} />
        </section>

        <section className="lc-doc-section" aria-labelledby="lc-doc-in-title">
          <h2 id="lc-doc-in-title">Instruções Normativas (IN)</h2>
          <p className="lc-doc-text">
            Detalham as Resoluções. É nelas que estão as listas de constituintes autorizados e os limites de uso
            por dose diária.
          </p>
          <NormList items={REGULATORY_INSTRUCTIONS} />

          {/* As alterações da IN 28/2018 vêm recolhidas: são treze atos que se
              exaurem ao alterar, e abertas afogariam as normas que importam.
              Ficam como prova de que a fábrica acompanha a norma viva. */}
          <details className="lc-doc-amendments">
            <summary className="lc-norms-cta">
              <span className="lc-norms-cta-icon" aria-hidden="true">
                <History size={20} />
              </span>
              <span className="lc-norms-cta-text">
                <strong>
                  Histórico de atualizações da IN 28/2018 ({REGULATORY_AMENDMENTS.length}{" "}
                  alterações)
                </strong>
                <span>
                  Os atos que alteraram a norma desde 2018, o mais recente em{" "}
                  {REGULATORY_AMENDMENTS[REGULATORY_AMENDMENTS.length - 1]?.date}
                </span>
              </span>
              <ChevronDown className="lc-norms-cta-chevron" size={20} aria-hidden="true" />
            </summary>
            <div className="lc-doc-amendments-body">
              <p className="lc-doc-note">{REGULATORY_CONSOLIDATION_NOTE}</p>
              <ul className="lc-doc-amendment-list">
                {REGULATORY_AMENDMENTS.map((amendment) => (
                  <li key={amendment.norm}>
                    {/* Era <b>, sem link - troca pela mesma âncora .lc-norm-link das
                        outras três listas de norma da página, para as quatro não
                        divergirem na próxima alteração de estilo (mesmo motivo do
                        .lc-norms-cta compartilhado pelos três <details>). */}
                    <a
                      className="lc-norm-link"
                      href={amendment.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      title={`Abre o texto oficial de ${amendment.norm} no AnvisaLegis, em nova guia`}
                      aria-label={`Abre o texto oficial de ${amendment.norm} no AnvisaLegis, em nova guia`}
                    >
                      {amendment.norm}
                    </a>
                    <span>de {amendment.date}</span>
                  </li>
                ))}
              </ul>
            </div>
          </details>
        </section>

        {/* 4. Regularização: o regime VIGENTE, não a frase do rótulo. A frase
            impressa no rótulo cita a RDC 240/2018, revogada em 22/02/2024 -
            ver o comentário em regulatory-info.ts. Aqui vale o que está em
            vigor hoje. */}
        <section className="lc-doc-section" aria-labelledby="lc-doc-reg-title">
          <h2 id="lc-doc-reg-title">
            <FileCheck2 size={18} aria-hidden="true" />
            Como o produto é regularizado
          </h2>
          <div className="lc-doc-card">
            <h3>{REGISTRATION_REGIME.headline}</h3>
            <p>{REGISTRATION_REGIME.detail}</p>
          </div>
        </section>

        {/* 5. As licenças da própria fábrica. Vem depois da regularização do
            PRODUTO e antes de quem assina, porque responde a outra pergunta:
            não "este produto pode ser vendido", mas "esta fábrica pode
            fabricar". Cada item traz onde conferir - o PDF não é publicado, e
            o porquê está no comentário de COMPANY_LICENSES. */}
        <section className="lc-doc-section" aria-labelledby="lc-doc-lic-title">
          <h2 id="lc-doc-lic-title">
            <Building2 size={18} aria-hidden="true" />
            Licenças da fábrica
          </h2>
          <p className="lc-doc-text">
            Os documentos que habilitam a Lemon Caps a fabricar, conferidos nos originais em 14/09/2026. O número
            de cada um está aqui para que possa ser verificado no órgão que o expediu.
          </p>
          <dl className="lc-doc-norm-list">
            {COMPANY_LICENSES.map((license) => (
              <div className="lc-doc-norm" key={license.number}>
                <dt>
                  <span className="lc-doc-norm-id">{license.name}</span>
                  <span className="lc-doc-norm-date">nº {license.number}</span>
                  <span className="lc-doc-norm-status">
                    {license.validUntil ? `válido até ${license.validUntil}` : `expedido em ${license.issuedAt}`}
                  </span>
                </dt>
                <dd>
                  {license.scope}{" "}
                  <span className="lc-doc-norm-scope">
                    Expedido por {license.issuer}. {license.verification}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* 6. Responsabilidade técnica: quem assina a produção. */}
        <section className="lc-doc-section" aria-labelledby="lc-doc-rt-title">
          <h2 id="lc-doc-rt-title">
            <UserCheck size={18} aria-hidden="true" />
            Fabricante e responsabilidade técnica
          </h2>
          <dl className="lc-doc-facts">
            <div>
              <dt>Razão social</dt>
              <dd>{MANUFACTURER_INFO.companyName}</dd>
            </div>
            <div>
              <dt>CNPJ</dt>
              <dd>{MANUFACTURER_INFO.cnpj}</dd>
            </div>
            <div>
              <dt>Endereço</dt>
              <dd>{MANUFACTURER_INFO.address}</dd>
            </div>
            <div>
              <dt>Farmacêutico responsável</dt>
              <dd>{MANUFACTURER_INFO.pharmacist}</dd>
            </div>
            <div>
              <dt>SAC</dt>
              <dd>
                <a href={`mailto:${MANUFACTURER_INFO.sac}`}>{MANUFACTURER_INFO.sac}</a>
              </dd>
            </div>
          </dl>
        </section>

        {/* 7. A procedência. É o que torna a página verificável em vez de
            declaratória: qualquer um pode abrir a fonte e conferir. */}
        <section className="lc-doc-section lc-doc-source" aria-labelledby="lc-doc-source-title">
          <h2 id="lc-doc-source-title">De onde vieram estas informações</h2>
          <p className="lc-doc-text">
            Cada norma desta página foi aberta individualmente no{" "}
            <a href={REGULATORY_SOURCE.url} target="_blank" rel="noreferrer noopener">
              {REGULATORY_SOURCE.label}
            </a>{" "}
            em {REGULATORY_SOURCE.consultedAtLabel}, e a descrição exibida é a ementa oficial do próprio ato. A
            situação de vigência é a que o portal informa na data da consulta.
          </p>
          <p className="lc-doc-note">
            A legislação sanitária muda. Antes de usar esta página como base para uma decisão, confira a norma na
            fonte oficial.
          </p>
        </section>

        <nav className="lc-doc-back" aria-label="Continuar navegando">
          <Link href="/catalogo" className="lc-btn lc-btn-primary lc-btn-icon-inline">
            Ver o catálogo de fórmulas
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <Link href="/" className="lc-btn lc-btn-icon-inline lc-doc-back-home">
            <ArrowLeft size={16} aria-hidden="true" />
            Voltar para a página inicial
          </Link>
        </nav>
      </main>
    </>
  );
}
