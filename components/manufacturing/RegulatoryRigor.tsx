import Link from "next/link";
import {
  ChevronDown,
  ClipboardCheck,
  FileCheck2,
  ScrollText,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

import {
  REGISTRATION_REGIME,
  REGULATORY_CONSOLIDATION_NOTE,
  REGULATORY_DECLARATION,
  REGULATORY_FRAMEWORK,
  REGULATORY_INSTRUCTIONS,
  REGULATORY_RESOLUTIONS,
  REGULATORY_SOURCE,
} from "@/lib/catalog/regulatory-info";

// O rigor regulatório é o diferencial desta página que NÃO depende de nenhum
// dado novo: tudo aqui já está conferido linha a linha em
// lib/catalog/regulatory-info.ts, onde a procedência de cada norma está
// documentada (cada uma aberta individualmente no AnvisaLegis em 13/09/2026).
//
// ---------------------------------------------------------------------------
// O QUE MUDOU EM 13/09/2026, e por quê
// ---------------------------------------------------------------------------
// Antes, a seção era uma LISTA DE ALTERAÇÕES NORMATIVAS: cada Instrução
// Normativa com o detalhe do que ela mudou ("incluiu no Anexo IV os limites de
// boro, silício, MSM..."). Isso é registro técnico de legislação, não
// interessa a quem compra fabricação e transformava a seção em nota de rodapé.
// Ordem do dono: no lugar disso, uma DECLARAÇÃO institucional — a fábrica
// respeita os limites mínimos e máximos da Anvisa, cumpre a legislação
// sanitária vigente e opera com responsável técnico farmacêutico. As normas
// continuam, como LASTRO da declaração, recolhidas e com uma linha cada.
//
// O card "Dispensa de registro" também mudou. Ele exibia a frase do rótulo
// ("Produto dispensado de registro conforme RDC nº 240/2018") como se fosse
// afirmação institucional — e essa RDC está REVOGADA desde 22/02/2024 pela
// RDC 843/2024. Agora exibe o regime que está de fato em vigor
// (REGISTRATION_REGIME). A frase do rótulo continua onde é dado de rótulo: no
// rodapé de fabricante do dossiê, que reproduz o que está impresso no produto.
// ---------------------------------------------------------------------------
//
// O que esta seção afirma, e só isto: sob qual disciplina a fábrica trabalha,
// quem é o responsável técnico e como o produto é regularizado. Ela NÃO afirma
// certificação (BPF, ISO, HACCP, nenhuma) porque nenhuma está confirmada em
// documento — ver as pendências em app/page.tsx. E declarar que a fábrica
// respeita os limites da norma NUNCA é o mesmo que afirmar que uma fórmula
// específica foi conferida: essa afirmação vive só no selo por fórmula do
// catálogo, condicionada a complianceVerifiedAt. É o que diz o parágrafo
// `boundary`, exibido abaixo, e ele não sai.

// Um ícone por afirmação, na ordem em que REGULATORY_DECLARATION.statements as
// declara: limites por dose, legislação vigente, responsável técnico.
const CLAIM_ICONS = [ClipboardCheck, ShieldCheck, UserCheck] as const;

export function RegulatoryRigor() {
  return (
    <section className="lc-home-section" aria-labelledby="lc-fab-regulatory-title">
      <div className="lc-home-section-head">
        <h2 id="lc-fab-regulatory-title">{REGULATORY_DECLARATION.headline}</h2>
        <p>{REGULATORY_DECLARATION.intro}</p>
      </div>

      <div className="lc-fab-regulatory-grid">
        {REGULATORY_DECLARATION.statements.map((statement, index) => {
          const Icon = CLAIM_ICONS[index] ?? ShieldCheck;
          return (
            <article className="lc-fab-regulatory-card" key={statement.title}>
              <span className="lc-fab-path-icon" aria-hidden="true">
                <Icon size={22} />
              </span>
              <h3>{statement.title}</h3>
              <p>{statement.text}</p>
            </article>
          );
        })}

        {/* Quarto card: como o produto é regularizado. Regime VIGENTE, não a
            frase do rótulo — ver o comentário de topo. */}
        <article className="lc-fab-regulatory-card">
          <span className="lc-fab-path-icon" aria-hidden="true">
            <FileCheck2 size={22} />
          </span>
          <h3>{REGISTRATION_REGIME.headline}</h3>
          <p>{REGISTRATION_REGIME.detail}</p>
        </article>
      </div>

      <p className="lc-regulatory-boundary">{REGULATORY_DECLARATION.boundary}</p>

      {/* As normas ficam dentro de um <details>: quem compra fabricação quer
          poder conferir a lista inteira, mas ela afogaria a declaração se
          viesse aberta. O <details> nativo resolve sem JavaScript e já é
          acessível por teclado e leitor de tela.

          O <summary> é ESTILIZADO como botão de destaque, mas continua sendo
          um <summary> — trocar por <button> com estado em JavaScript custaria
          o funcionamento sem script e a semântica de "revela este conteúdo"
          que o leitor de tela já anuncia sozinho. Conformidade é o argumento
          mais forte de quem vende fabricação, e no formato anterior (linha de
          texto com o triângulo nativo, cartão branco sobre fundo branco) ela
          passava despercebida. */}
      <details className="lc-fab-norms">
        <summary className="lc-norms-cta">
          <span className="lc-norms-cta-icon" aria-hidden="true">
            <ShieldCheck size={20} />
          </span>
          <span className="lc-norms-cta-text">
            <strong>Ver as {REGULATORY_FRAMEWORK.length} normas que a fábrica segue</strong>
            {/* Diz de onde veio o dado sem prometer conformidade de fórmula
                — essa afirmação é do selo por produto, nunca daqui. */}
            <span>
              Resoluções e Instruções Normativas da Anvisa, conferidas na fonte oficial em{" "}
              {REGULATORY_SOURCE.consultedAtLabel}
            </span>
          </span>
          <ChevronDown className="lc-norms-cta-chevron" size={20} aria-hidden="true" />
        </summary>
        <dl className="lc-fab-norms-list">
          {/* Número da norma como link para o texto oficial no AnvisaLegis
              (pedido do dono, 14/09/2026). Mesma âncora .lc-norm-link da
              página /documentacao e do dossiê em /catalogo/[slug] - título e
              aria-label porque o texto visível do link é só o número. */}
          {REGULATORY_RESOLUTIONS.map((item) => (
            <div className="lc-fab-norm" key={item.norm}>
              <dt>
                <a className="lc-norm-link" href={item.url} target="_blank" rel="noreferrer noopener" title={`Abre o texto oficial de ${item.norm} no AnvisaLegis, em nova guia`} aria-label={`Abre o texto oficial de ${item.norm} no AnvisaLegis, em nova guia`}>{item.norm}</a>, de {item.date}
              </dt>
              <dd>{item.summary}</dd>
            </div>
          ))}
          {REGULATORY_INSTRUCTIONS.map((item) => (
            <div className="lc-fab-norm" key={item.norm}>
              <dt>
                <a className="lc-norm-link" href={item.url} target="_blank" rel="noreferrer noopener" title={`Abre o texto oficial de ${item.norm} no AnvisaLegis, em nova guia`} aria-label={`Abre o texto oficial de ${item.norm} no AnvisaLegis, em nova guia`}>{item.norm}</a>, de {item.date}
              </dt>
              <dd>{item.summary}</dd>
            </div>
          ))}
        </dl>
        <p className="lc-doc-note lc-fab-norms-note">
          {REGULATORY_CONSOLIDATION_NOTE} Fonte: {REGULATORY_SOURCE.label}, consultada em{" "}
          {REGULATORY_SOURCE.consultedAtLabel}.
        </p>
        <p className="lc-fab-norms-note">
          <Link href="/documentacao" className="lc-fab-norms-link">
            <ScrollText size={15} aria-hidden="true" />
            Ver a documentação regulatória completa
          </Link>
        </p>
      </details>
    </section>
  );
}
