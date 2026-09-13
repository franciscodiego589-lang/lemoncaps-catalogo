"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { ModalShell } from "@/components/glass/ModalShell";
import { softDeleteFormula } from "@/lib/actions/formulas";

interface DeleteFormulaButtonProps {
  formulaId: string;
  formulaName: string;
}

// Exclusão de fórmula é sempre lógica (deleted_at) e pede um motivo - dado
// que alimenta a trilha de auditoria (public.audit_logs). Ação realmente
// destrutiva (some da lista de administração, não só do catálogo público) -
// por isso confirmação com modal, nunca instantânea.
export function DeleteFormulaButton({ formulaId, formulaName }: DeleteFormulaButtonProps) {
  const router = useRouter();
  const [isOpen, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setPending] = useState(false);

  async function handleConfirm() {
    if (reason.trim() === "") {
      setError("Informe o motivo da exclusão.");
      return;
    }
    setPending(true);
    setError(null);
    const result = await softDeleteFormula(formulaId, reason);
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    toast.success("Fórmula excluída.");
    router.push("/admin/catalogo");
  }

  return (
    <>
      <button type="button" className="lc-btn lc-btn-ghost" onClick={() => setOpen(true)}>
        Excluir fórmula
      </button>
      <ModalShell isOpen={isOpen} onClose={() => !isPending && setOpen(false)} variant="solid" title="Excluir fórmula">
        <div className="lc-admin-confirm-body">
          <p>
            Excluir <strong>{formulaName}</strong>? Ela some do catálogo público e da lista de administração. A exclusão é lógica - o dado
            continua na trilha de auditoria e pode ser restaurado diretamente no banco, se necessário.
          </p>
          <div className="lc-field">
            <label className="lc-field-label" htmlFor="delete-formula-reason">
              Motivo da exclusão
            </label>
            <input
              id="delete-formula-reason"
              className={`lc-field-input${error ? " is-invalid" : ""}`}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              aria-invalid={Boolean(error)}
            />
          </div>
          {error ? (
            <p className="lc-field-error" role="alert">
              {error}
            </p>
          ) : null}
          <div className="lc-modal-actions">
            <button type="button" className="lc-btn lc-btn-ghost" onClick={() => setOpen(false)} disabled={isPending}>
              Cancelar
            </button>
            <button type="button" className="lc-btn lc-btn-primary" onClick={handleConfirm} disabled={isPending} aria-busy={isPending}>
              {isPending ? "Excluindo…" : "Excluir"}
            </button>
          </div>
        </div>
      </ModalShell>
    </>
  );
}
