"use client";

import { useState, type ReactNode } from "react";

import { ModalShell } from "@/components/glass/ModalShell";

interface ConfirmButtonProps {
  children: ReactNode;
  ariaLabel?: string;
  confirmLabel?: string;
  title: string;
  description: string;
  triggerClassName?: string;
  onConfirm: () => Promise<{ ok: boolean; error?: string }>;
  onSuccess?: () => void;
}

// Botão de ação destrutiva com confirmação (regra de design da tarefa: "ação
// destrutiva com confirmação ou desfazer"). Reaproveita o ModalShell já usado
// no catálogo público - variant="solid" porque é conteúdo denso (aviso +
// botões), nunca vidro.
export function ConfirmButton({
  children,
  ariaLabel,
  confirmLabel = "Confirmar",
  title,
  description,
  triggerClassName,
  onConfirm,
  onSuccess,
}: ConfirmButtonProps) {
  const [isOpen, setOpen] = useState(false);
  const [isPending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    setPending(true);
    setError(null);
    try {
      const result = await onConfirm();
      if (!result.ok) {
        setError(result.error ?? "Não foi possível concluir agora.");
        setPending(false);
        return;
      }
      setPending(false);
      setOpen(false);
      onSuccess?.();
    } catch (caught) {
      console.error("[ConfirmButton] falha ao confirmar ação:", caught);
      setError("Não foi possível concluir agora.");
      setPending(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className={triggerClassName ?? "lc-admin-icon-btn lc-admin-icon-btn--danger"}
        aria-label={ariaLabel}
        onClick={() => {
          setError(null);
          setOpen(true);
        }}
      >
        {children}
      </button>
      <ModalShell isOpen={isOpen} onClose={() => !isPending && setOpen(false)} variant="solid" title={title}>
        <div className="lc-admin-confirm-body">
          <p>{description}</p>
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
              {isPending ? "Aguarde…" : confirmLabel}
            </button>
          </div>
        </div>
      </ModalShell>
    </>
  );
}
