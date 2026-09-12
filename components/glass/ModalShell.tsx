"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { X } from "lucide-react";

// Casca compartilhada de todo modal do catálogo: overlay, fecha no Esc, fecha
// clicando fora, trava o scroll da página atrás e leva o foco pro painel ao
// abrir. `variant` decide só a pele (vidro para ação — Cotar Fórmula; sólido
// para conteúdo denso — Dossiê Técnico), nunca a mecânica.
interface ModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  variant?: "glass" | "solid";
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function ModalShell({ isOpen, onClose, variant = "glass", title, subtitle, children }: ModalShellProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    panelRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  const variantClass = variant === "glass" ? "lc-modal-glass lc-glass" : "lc-modal-solid";

  return (
    <div
      className={`lc-overlay ${isOpen ? "is-open" : ""}`.trim()}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      aria-hidden={!isOpen}
      inert={!isOpen}
    >
      <div
        ref={panelRef}
        className={`lc-modal ${variantClass}`.trim()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
      >
        <div className="lc-modal-head">
          <div>
            <h2>{title}</h2>
            {subtitle ? <div className="lc-seg-tag">{subtitle}</div> : null}
          </div>
          <button type="button" className="lc-modal-close" onClick={onClose} aria-label="Fechar">
            <X size={16} aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
