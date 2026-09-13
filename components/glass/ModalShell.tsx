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

// Elementos que um teclado realmente alcança dentro do painel — mesma lista
// de qualquer focus trap padrão (WAI-ARIA Authoring Practices). `[tabindex]`
// só exclui o -1 explícito (âncora de foco programático do próprio painel,
// nunca uma parada de Tab de verdade).
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function ModalShell({ isOpen, onClose, variant = "glass", title, subtitle, children }: ModalShellProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  // Quem tinha o foco antes de abrir (o botão "Cotar Fórmula" do card, por
  // exemplo). Esc ou Cancelar devolvem o foco exatamente ali — achado de
  // acessibilidade: sem isto, document.activeElement virava <body> ao fechar
  // e quem navega por teclado "perdia o lugar" na página.
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    triggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    // Foco preso no modal: Tab/Shift+Tab nunca escapam para trás do véu.
    // Achado de acessibilidade: sem isto, Shift+Tab a partir da abertura ia
    // parar no botão flutuante do carrinho (.lc-fab), que fica atrás do véu
    // escuro — incoerente com aria-modal="true" no painel.
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;
      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (el) => el.offsetParent !== null,
      );
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey) {
        if (active === first || active === panel) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last || active === panel) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    panelRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus();
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
            {/* H1 da página > H2 nos títulos dos cards (FormulaCard) > H3 aqui:
                o modal abre a partir de um card, então o título dele é
                subordinado ao H2 do card que o abriu. */}
            <h3>{title}</h3>
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
