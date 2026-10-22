// Assinatura da ficha técnica no dossiê público: quem respondeu por esta ficha, com
// qual registro profissional, quando e em que versão
// (public.formula_sheet_approvals, migration 20260916000000).
//
// Fica colado ao bloco de Conformidade da página e com o mesmo destaque verde
// (.lc-dossie-compliance) porque é o complemento dele: a conformidade diz QUANDO a
// composição foi conferida contra a norma da ANVISA, a assinatura diz QUEM assumiu
// isso. Ainda assim é seção separada, e não um pedaço daquela, porque as duas são
// independentes no banco - existe ficha assinada sem selo de conformidade e selo sem
// ficha assinada.
//
// Sem nenhuma aprovação registrada o componente não renderiza NADA (nem título, nem
// aviso): "sem responsável técnico" numa página de produto se leria como denúncia
// contra o próprio produto, e o que existe aqui é ausência de cadastro, não ausência
// de RT. Mesma regra de exatidão do resto do dossiê.
//
// Componente de servidor (sem "use client"): é só leitura e marcação, nada de estado
// nem de evento - não há por que mandar isto para o navegador.
import { ShieldCheck } from "lucide-react";

import type { FormulaSheetApprovalDTO } from "@/lib/data/formulas";
import { formatComplianceDate } from "@/lib/catalog/regulatory-info";

interface SheetSignatureProps {
  /** Da mais recente para a mais antiga - a primeira é a assinatura vigente. */
  approvals: readonly FormulaSheetApprovalDTO[];
}

export function SheetSignature({ approvals }: SheetSignatureProps) {
  const [current, ...previous] = approvals;
  if (!current) return null;

  return (
    <section className="lc-dossie-section lc-dossie-compliance lc-dossie-signature">
      <h2>
        <ShieldCheck size={15} aria-hidden="true" />
        Assinatura da ficha técnica
      </h2>
      <dl className="lc-dossie-facts">
        <div className="lc-dossie-fact">
          <dt>Responsável técnico</dt>
          <dd>
            {current.approvedByName} · {current.approvedByLicense}
          </dd>
        </div>
        <div className="lc-dossie-fact">
          <dt>Versão da ficha</dt>
          <dd>{current.sheetVersion}</dd>
        </div>
        <div className="lc-dossie-fact">
          <dt>Aprovada em</dt>
          <dd>{formatComplianceDate(current.approvedAt)}</dd>
        </div>
      </dl>

      {/* Histórico: aprovação nunca é editada nem apagada (o banco não permite),
          então o que existe é uma fila de assinaturas. Mostrar as anteriores é o
          ponto do recurso para uma auditoria de fornecedor. */}
      {previous.length > 0 && (
        <>
          <p className="lc-dossie-legal-note">Aprovações anteriores:</p>
          <ul className="lc-dossie-legal-list">
            {previous.map((approval) => (
              <li key={approval.id}>
                <b>Versão {approval.sheetVersion}</b> - {formatComplianceDate(approval.approvedAt)} ·{" "}
                {approval.approvedByName} · {approval.approvedByLicense}
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
