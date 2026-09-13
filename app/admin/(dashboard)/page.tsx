import Link from "next/link";

import { getAdminDashboard, requireStaffPage } from "@/lib/data/admin";
import { centsToBRL } from "@/lib/money";

export const metadata = { title: "Visão geral · Lemon Caps Admin" };

export default async function AdminHomePage() {
  const session = await requireStaffPage();
  const dashboard = await getAdminDashboard(session);

  return (
    <>
      <div className="lc-admin-page-head">
        <div>
          <h1>Visão geral</h1>
          <p>Resumo do catálogo e dos leads recentes{session.canManageQuotes ? ", e dos orçamentos recentes" : ""}.</p>
        </div>
      </div>

      <div className="lc-admin-stats-grid">
        <div className="lc-admin-stat-tile">
          <span className="lc-admin-stat-value">{dashboard.activeFormulasCount}</span>
          <span className="lc-admin-stat-label">Fórmulas ativas</span>
        </div>
        <div className="lc-admin-stat-tile">
          <span className="lc-admin-stat-value">{dashboard.inactiveFormulasCount}</span>
          <span className="lc-admin-stat-label">Fórmulas inativas</span>
        </div>
      </div>

      <section className="lc-admin-panel">
        <h2>Leads recentes</h2>
        {dashboard.recentLeads.length === 0 ? (
          <p className="lc-admin-empty">Nenhum lead ainda.</p>
        ) : (
          <div className="lc-admin-panel-list">
            {dashboard.recentLeads.map((lead) => (
              <div key={lead.id} className="lc-admin-panel-row">
                <div>
                  <div className="lc-admin-panel-row-title">{lead.name}</div>
                  <div className="lc-admin-panel-row-meta">{lead.whatsapp}</div>
                </div>
                <span className="lc-admin-panel-row-meta">{new Date(lead.createdAt).toLocaleDateString("pt-BR")}</span>
              </div>
            ))}
          </div>
        )}
        <div className="lc-admin-form-actions lc-admin-panel-footer">
          <Link href="/admin/leads" className="lc-btn lc-btn-ghost">
            Ver todos os leads
          </Link>
        </div>
      </section>

      {session.canManageQuotes ? (
        <section className="lc-admin-panel">
          <h2>Orçamentos recentes</h2>
          {(dashboard.recentQuotes ?? []).length === 0 ? (
            <p className="lc-admin-empty">Nenhum orçamento ainda.</p>
          ) : (
            <div className="lc-admin-panel-list">
              {(dashboard.recentQuotes ?? []).map((quote) => (
                <div key={quote.id} className="lc-admin-panel-row">
                  <div className="lc-admin-panel-row-title">
                    #{quote.quoteNumber} · {quote.customerName}
                  </div>
                  <span className="lc-admin-panel-row-meta">{centsToBRL(quote.totalCents)}</span>
                </div>
              ))}
            </div>
          )}
          <div className="lc-admin-form-actions lc-admin-panel-footer">
            <Link href="/admin/orcamentos" className="lc-btn lc-btn-ghost">
              Ver todos os orçamentos
            </Link>
          </div>
        </section>
      ) : null}

      <div className="lc-admin-form-actions">
        <Link href="/admin/catalogo/novo" className="lc-btn lc-btn-primary">
          Nova fórmula
        </Link>
        <Link href="/admin/catalogo" className="lc-btn lc-btn-ghost">
          Gerenciar catálogo
        </Link>
      </div>
    </>
  );
}
