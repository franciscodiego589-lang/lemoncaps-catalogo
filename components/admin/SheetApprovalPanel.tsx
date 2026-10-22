"use client";

// Assinatura da ficha técnica pelo responsável técnico: registrar uma aprovação nova e
// ver o histórico inteiro.
//
// A tela deixa óbvio o que o banco já obriga: APROVAÇÃO NÃO SE EDITA NEM SE APAGA. Não
// existe botão de editar, não existe botão de excluir, e não é omissão - é o desenho.
// Assinatura de RT é ato com valor legal; corrigir a linha anterior apagaria justamente
// o que uma auditoria de fornecedor vem conferir. Errou, mudou de RT, mudou a ficha?
// Aprova de novo, e as duas linhas ficam à vista na ordem em que aconteceram.
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";

import { NumberField, TextAreaField, TextField } from "@/components/admin/FormFields";
import { registerSheetApproval } from "@/lib/actions/sheet-approvals";
import type { AdminSheetApprovalDTO } from "@/lib/data/admin";
import { formatComplianceDate } from "@/lib/catalog/regulatory-info";

interface SheetApprovalPanelProps {
  formulaId: string;
  /** Versão em que a ficha está agora - é o que a nova aprovação carimba por padrão. */
  currentSheetVersion: number;
  initialApprovals: AdminSheetApprovalDTO[];
}

interface DraftState {
  sheetVersion: number | "";
  approvedByName: string;
  approvedByLicense: string;
  approvedAtDate: string;
  notes: string;
}

function emptyDraft(currentSheetVersion: number): DraftState {
  return {
    sheetVersion: currentSheetVersion,
    approvedByName: "",
    approvedByLicense: "",
    approvedAtDate: "",
    notes: "",
  };
}

export function SheetApprovalPanel({ formulaId, currentSheetVersion, initialApprovals }: SheetApprovalPanelProps) {
  const [approvals, setApprovals] = useState(initialApprovals);
  const [draft, setDraft] = useState<DraftState>(() => emptyDraft(currentSheetVersion));
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<string, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, setPending] = useState(false);

  function set<K extends keyof DraftState>(key: K, value: DraftState[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
    if (fieldErrors[key as string]) setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isPending) return;

    setFormError(null);
    setPending(true);
    // try/catch (achado A2 da auditoria de 14/09/2026): sem isto, uma
    // rejeição de registerSheetApproval virava erro não tratado no cliente e
    // o botão ficava travado em "Registrando…".
    try {
      const result = await registerSheetApproval({
        formulaId,
        sheetVersion: draft.sheetVersion === "" ? currentSheetVersion : draft.sheetVersion,
        approvedByName: draft.approvedByName,
        approvedByLicense: draft.approvedByLicense,
        approvedAtDate: draft.approvedAtDate === "" ? null : draft.approvedAtDate,
        notes: draft.notes === "" ? null : draft.notes,
      });

      if (!result.ok) {
        setFieldErrors(result.fieldErrors ?? {});
        setFormError(result.error);
        return;
      }

      // A lista em tela reflete o que o servidor confirmou (id e instante vieram de
      // lá), nunca um otimismo local - e a nova entra no topo, que é a ordem do
      // histórico (mais recente primeiro).
      setApprovals((prev) => [
        {
          id: result.data.id,
          sheetVersion: draft.sheetVersion === "" ? currentSheetVersion : draft.sheetVersion,
          approvedByName: draft.approvedByName.trim(),
          approvedByLicense: draft.approvedByLicense.trim(),
          approvedAt: result.data.approvedAt,
          notes: draft.notes.trim() === "" ? null : draft.notes.trim(),
        },
        ...prev,
      ]);
      setDraft(emptyDraft(currentSheetVersion));
      toast.success("Aprovação registrada. Este registro não pode ser alterado nem excluído.");
    } catch (caught) {
      console.error("[SheetApprovalPanel] falha ao registrar aprovação:", caught);
      toast.error("Não foi possível registrar a aprovação agora. Tente novamente.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="lc-admin-approvals">
      <p className="lc-admin-approvals-warning" role="note">
        <ShieldCheck size={16} aria-hidden="true" />
        <span>
          <b>Aprovação é registro histórico: depois de gravada, não se edita nem se apaga.</b> Para corrigir, trocar de
          responsável técnico ou aprovar uma versão nova da ficha, registre uma aprovação nova — as duas ficam no
          histórico, na ordem em que aconteceram. A trava é do banco, não desta tela.
        </span>
      </p>

      <form className="lc-admin-form-grid" onSubmit={handleSubmit} noValidate>
        <TextField
          id="approval-approvedByName"
          label="Responsável técnico (nome)"
          value={draft.approvedByName}
          onChange={(v) => set("approvedByName", v)}
          error={fieldErrors.approvedByName}
          hint="Quem assina a ficha. Em branco grava como PENDENTE — a aprovação fica registrada sem responsável técnico definido."
        />
        <TextField
          id="approval-approvedByLicense"
          label="Registro profissional"
          value={draft.approvedByLicense}
          onChange={(v) => set("approvedByLicense", v)}
          error={fieldErrors.approvedByLicense}
          hint="Como consta no conselho. Ex.: CRF/MT 5526. Em branco grava como PENDENTE."
        />
        <NumberField
          id="approval-sheetVersion"
          label="Versão da ficha aprovada"
          value={draft.sheetVersion}
          onChange={(v) => set("sheetVersion", v)}
          error={fieldErrors.sheetVersion}
          min={1}
          // Aviso, não erro: aprovar uma versão diferente da atual é caso legítimo
          // (registrar em atraso a assinatura de uma versão anterior). Mas assinar a
          // versão errada por descuido é grave, e o número sozinho não denuncia isso
          // - o aviso denuncia.
          hint={
            draft.sheetVersion !== "" && draft.sheetVersion !== currentSheetVersion
              ? `Atenção: você está registrando aprovação da versão ${draft.sheetVersion}, mas a ficha desta fórmula está na versão ${currentSheetVersion}.`
              : `A ficha desta fórmula está na versão ${currentSheetVersion}.`
          }
        />
        <TextField
          id="approval-approvedAtDate"
          label="Data da aprovação"
          type="date"
          value={draft.approvedAtDate}
          onChange={(v) => set("approvedAtDate", v)}
          error={fieldErrors.approvedAtDate}
          hint="Deixe em branco para registrar agora. Preencha quando a ficha foi assinada antes de ser lançada aqui."
        />
        <TextAreaField
          id="approval-notes"
          label="Observação (interna)"
          value={draft.notes}
          onChange={(v) => set("notes", v)}
          error={fieldErrors.notes}
          rows={2}
          hint="Ex.: o que mudou desde a versão anterior. Não aparece no catálogo público."
          full
        />

        {formError ? (
          <p className="lc-field-error lc-field--full" role="alert">
            {formError}
          </p>
        ) : null}

        <div className="lc-admin-form-actions lc-field--full">
          <button type="submit" className="lc-btn lc-btn-primary" disabled={isPending} aria-busy={isPending}>
            {isPending ? "Registrando…" : "Registrar aprovação"}
          </button>
        </div>
      </form>

      <h3 className="lc-admin-approvals-title">Histórico de aprovações</h3>
      {approvals.length === 0 ? (
        <p className="lc-admin-empty">
          Esta ficha ainda não foi aprovada por nenhum responsável técnico. Enquanto não houver aprovação, o catálogo
          público não mostra assinatura nenhuma — nunca um aviso no lugar dela.
        </p>
      ) : (
        <div className="lc-admin-table-wrap">
          <table className="lc-admin-table">
            <thead>
              <tr>
                <th scope="col">Data</th>
                <th scope="col">Versão</th>
                <th scope="col">Responsável técnico</th>
                <th scope="col">Registro</th>
                <th scope="col">Observação</th>
              </tr>
            </thead>
            <tbody>
              {approvals.map((approval) => (
                <tr key={approval.id}>
                  <td>{formatComplianceDate(approval.approvedAt)}</td>
                  <td className="lc-admin-col-num">{approval.sheetVersion}</td>
                  <td>{approval.approvedByName}</td>
                  <td>{approval.approvedByLicense}</td>
                  {/* Sem observação não vira "-" nem "não informado": célula vazia. */}
                  <td>{approval.notes ?? ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
