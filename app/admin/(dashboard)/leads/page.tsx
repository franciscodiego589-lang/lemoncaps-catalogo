import { Suspense } from "react";

import { AdminFilterBar } from "@/components/admin/AdminFilterBar";
import { LeadsTable } from "@/components/admin/LeadsTable";
import { getAdminLeads } from "@/lib/data/admin";

export const metadata = { title: "Leads · Lemon Caps Admin" };

export default async function AdminLeadsPage({ searchParams }: { searchParams: Promise<{ busca?: string }> }) {
  const params = await searchParams;
  const leads = await getAdminLeads(params.busca);

  return (
    <>
      <div className="lc-admin-page-head">
        <div>
          <h1>Leads</h1>
          <p>Nome, WhatsApp e carrinho de quem converteu no site. Dado pessoal sob LGPD.</p>
        </div>
      </div>

      <Suspense fallback={null}>
        <AdminFilterBar searchParam="busca" searchLabel="Buscar por nome ou WhatsApp" searchPlaceholder="Ex.: Maria ou 65999990000" />
      </Suspense>

      <LeadsTable leads={leads} />
    </>
  );
}
