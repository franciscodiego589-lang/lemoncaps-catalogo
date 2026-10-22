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
    // Motivo em branco não trava mais a exclusão (ordem do dono, 18/09/2026 - ver
    // lib/actions/formulas.ts): a Server Action grava "PENDENTE" sozinha.
    setPending(true);
    setError(null);
    // try/catch (achado A2 da auditoria de 14/09/2026): sem isto, uma
    // rejeição de softDeleteFormula virava erro não tratado no cliente e o
    // modal ficava travado em "Excluindo…".
    try {
      const result = await softDeleteFormula(formulaId, reason);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      toast.success("Fórmula excluída.");
      router.push("/admin/catalogo");
    } catch (caught) {
      console.error("[DeleteFormulaButton] falha ao excluir fórmula:", caught);
      toast.error("Não foi possível excluir a fórmula agora. Tente novamente.");
    } finally {
      setPending(false);
    }
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
              aria-describedby="delete-formula-reason-hint"
            />
            <p id="delete-formula-reason-hint" className="lc-field-hint">
              Em branco grava como PENDENTE. A exclusão é lógica e reversível diretamente no banco, se necessário.
            </p>
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
