import Link from "next/link";

import { getAdminFormulaCostsList } from "@/lib/data/admin";
import { centsToBRL } from "@/lib/money";

export const metadata = { title: "Custos (interno) · Lemon Caps Admin" };

export default async function AdminCustosPage() {
  const rows = await getAdminFormulaCostsList();

  return (
    <>
      <div className="lc-admin-page-head">
        <div>
          <h1>Custos</h1>
          <p>Custo real de produção por pote. Nunca aparece no catálogo público.</p>
        </div>
      </div>

      <div className="lc-admin-internal-banner" role="note">
        Informação 100% interna - a tabela de custos não tem nenhuma permissão de leitura para o público, nem para visitantes anônimos.
      </div>

      <div className="lc-admin-table-wrap">
        <table className="lc-admin-table">
          <thead>
            <tr>
              <th scope="col">Fórmula</th>
              <th scope="col">Preço público</th>
              <th scope="col">Custo real</th>
              <th scope="col" className="lc-admin-col-actions">
                Ação
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.formulaId}>
                <td>{row.formulaName}</td>
                <td className="lc-admin-col-num">{row.listPriceCents !== null ? centsToBRL(row.listPriceCents) : "-"}</td>
                <td className="lc-admin-col-num">{row.unitCostCents !== null ? centsToBRL(row.unitCostCents) : "não definido"}</td>
                <td className="lc-admin-col-actions">
                  <Link href={`/admin/custos/${row.formulaId}`} className="lc-btn lc-btn-ghost">
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
