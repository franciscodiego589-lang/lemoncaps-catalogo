"use client";

import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";

import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { softDeleteLead } from "@/lib/actions/leads";
import type { AdminLeadDTO } from "@/lib/data/admin";
import { centsToBRL } from "@/lib/money";

interface LeadsTableProps {
  leads: AdminLeadDTO[];
}

function whatsappHref(whatsapp: string): string {
  return `https://wa.me/${whatsapp.replace(/\D/g, "")}`;
}

// Dado pessoal sob LGPD (item 7 da tarefa): nome, WhatsApp, retrato do
// carrinho, link direto pro WhatsApp e exclusão lógica com confirmação. Nada
// de exibir em massa sem necessidade - a lista mostra só o essencial; o
// carrinho completo fica visível na própria linha (é o mesmo dado que já ia
// para o vendedor via WhatsApp, não é exposição nova).
export function LeadsTable({ leads }: LeadsTableProps) {
  const router = useRouter();

  if (leads.length === 0) {
    return <p className="lc-admin-empty">Nenhum lead encontrado para este filtro.</p>;
  }

  return (
    <div className="lc-admin-table-wrap">
      <table className="lc-admin-table">
        <thead>
          <tr>
            <th scope="col">Nome</th>
            <th scope="col">WhatsApp</th>
            <th scope="col">Carrinho no momento</th>
            <th scope="col">Recebido em</th>
            <th scope="col" className="lc-admin-col-actions">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td>{lead.name}</td>
              <td>
                <a href={whatsappHref(lead.whatsapp)} target="_blank" rel="noreferrer" className="lc-admin-row-link lc-btn-icon-inline">
                  <MessageCircle size={14} aria-hidden="true" />
                  {lead.whatsapp}
                </a>
              </td>
              <td>
                {lead.cartSnapshot.length === 0 ? (
                  "-"
                ) : (
                  <ul className="lc-admin-panel-list">
                    {lead.cartSnapshot.map((item, index) => (
                      <li key={`${lead.id}-${index}`} className="lc-admin-panel-row-meta">
                        {item.quantityPotes}× {item.name} ({centsToBRL(item.unitPriceCents)}/pote)
                      </li>
                    ))}
                  </ul>
                )}
              </td>
              <td className="lc-admin-col-num">{new Date(lead.createdAt).toLocaleDateString("pt-BR")}</td>
              <td className="lc-admin-col-actions">
                <ConfirmButton
                  ariaLabel={`Excluir lead ${lead.name}`}
                  title="Excluir lead"
                  description={`Excluir o lead de "${lead.name}"? O dado sai da lista de administração (exclusão lógica, dado pessoal sob LGPD).`}
                  confirmLabel="Excluir"
                  onConfirm={() => softDeleteLead(lead.id)}
                  onSuccess={() => router.refresh()}
                >
                  Excluir
                </ConfirmButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
