import Link from "next/link";
import { ArrowRight, FileText, FlaskConical, Package, Plus, Users, Wallet } from "lucide-react";

import { DashboardMetricas } from "@/components/admin/DashboardMetricas";
import { DashboardPendencias } from "@/components/admin/DashboardPendencias";
import { QUOTE_STATUS_BADGE_VARIANT, QUOTE_STATUS_LABELS } from "@/components/admin/enum-labels";
import { getAdminDashboard, requireStaffPage } from "@/lib/data/admin";
import { dataRelativa } from "@/lib/format/data-relativa";
import { centsToBRL } from "@/lib/money";

export const metadata = { title: "Visão geral · Lemon Caps Admin" };

// Ordem da página, de cima para baixo, e o porquê dela:
//
//   1. indicadores  - onde o catálogo está agora, com um número em destaque;
//   2. pendências   - o que está faltando, que é a razão de existir do painel;
//   3. últimos      - o que chegou (leads e orçamentos), lado a lado;
//   4. ações        - os caminhos do dia a dia, juntos e visíveis.
//
// Pendência vem ANTES das listas de propósito: lead novo dá para ver na aba de
// leads, mas fórmula ativa sem advertência de rótulo não aparece em lugar
// nenhum - se não gritar aqui, não grita nunca.
export default async function AdminHomePage() {
  const session = await requireStaffPage();
  const dashboard = await getAdminDashboard(session);

  return (
    <>
      <div className="lc-admin-page-head">
        <div>
          <h1>Visão geral</h1>
          <p>Estado do catálogo, o que falta cadastrar e o que chegou por último.</p>
        </div>
        <Link href="/admin/catalogo/novo" className="lc-btn lc-btn-primary lc-admin-acao-principal">
          <Plus size={16} aria-hidden="true" />
          Nova fórmula
        </Link>
      </div>

      <DashboardMetricas dashboard={dashboard} />

      <DashboardPendencias pendencias={dashboard.pendencias} />

      <div className="lc-admin-duas-colunas">
        <section className="lc-admin-panel" aria-labelledby="lc-admin-leads-titulo">
          <div className="lc-admin-panel-head">
            <h2 id="lc-admin-leads-titulo">Leads recentes</h2>
            <Link href="/admin/leads" className="lc-admin-panel-head-link">
              Ver todos
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>

          {dashboard.recentLeads.length === 0 ? (
            <p className="lc-admin-empty">Nenhum lead ainda.</p>
          ) : (
            <ul className="lc-admin-lista">
              {dashboard.recentLeads.map((lead) => (
                <li key={lead.id} className="lc-admin-lista-item">
                  <div className="lc-admin-lista-texto">
                    <p className="lc-admin-lista-titulo">{lead.name}</p>
                    <p className="lc-admin-lista-meta">{lead.whatsapp}</p>
                  </div>
                  {/* Data relativa em vez de dd/mm/aaaa: num painel, "hoje" e
                      "há 2 dias" respondem na hora o que a data seca obriga a
                      calcular de cabeça. Acima de uma semana volta a ser data
                      absoluta (ver lib/format/data-relativa.ts). */}
                  <span className="lc-admin-lista-quando">{dataRelativa(lead.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {dashboard.recentQuotes !== null ? (
          <section className="lc-admin-panel" aria-labelledby="lc-admin-orcamentos-titulo">
            <div className="lc-admin-panel-head">
              <h2 id="lc-admin-orcamentos-titulo">Orçamentos recentes</h2>
              <Link href="/admin/orcamentos" className="lc-admin-panel-head-link">
                Ver todos
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>

            {dashboard.recentQuotes.length === 0 ? (
              <p className="lc-admin-empty">Nenhum orçamento ainda.</p>
            ) : (
              <ul className="lc-admin-lista">
                {dashboard.recentQuotes.map((quote) => (
                  <li key={quote.id} className="lc-admin-lista-item">
                    <div className="lc-admin-lista-texto">
                      <p className="lc-admin-lista-titulo">
                        <Link href={`/admin/orcamentos/${quote.id}`} className="lc-admin-row-link">
                          #{quote.quoteNumber}
                        </Link>{" "}
                        · {quote.customerName}
                      </p>
                      <p className="lc-admin-lista-meta">
                        <span className={`lc-admin-badge lc-admin-badge--${QUOTE_STATUS_BADGE_VARIANT[quote.status]}`}>
                          {QUOTE_STATUS_LABELS[quote.status]}
                        </span>
                        <span>{dataRelativa(quote.createdAt)}</span>
                      </p>
                    </div>
                    <span className="lc-admin-lista-valor">{centsToBRL(quote.totalCents)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ) : null}
      </div>

      <section className="lc-admin-panel" aria-labelledby="lc-admin-atalhos-titulo">
        <div className="lc-admin-panel-head">
          <h2 id="lc-admin-atalhos-titulo">Ações rápidas</h2>
        </div>
        <div className="lc-admin-atalhos">
          <Link href="/admin/catalogo" className="lc-admin-atalho">
            <Package size={17} aria-hidden="true" />
            Gerenciar catálogo
          </Link>
          <Link href="/admin/insumos/novo" className="lc-admin-atalho">
            <FlaskConical size={17} aria-hidden="true" />
            Novo insumo
          </Link>
          <Link href="/admin/custos" className="lc-admin-atalho">
            <Wallet size={17} aria-hidden="true" />
            Lançar custos
          </Link>
          <Link href="/admin/leads" className="lc-admin-atalho">
            <Users size={17} aria-hidden="true" />
            Ver leads
          </Link>
          {session.canManageQuotes ? (
            <Link href="/admin/orcamentos" className="lc-admin-atalho">
              <FileText size={17} aria-hidden="true" />
              Ver orçamentos
            </Link>
          ) : null}
        </div>
      </section>
    </>
  );
}
