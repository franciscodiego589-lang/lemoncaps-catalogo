"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { updateFormula } from "@/lib/actions/formulas";

interface ActiveToggleProps {
  formulaId: string;
  initialActive: boolean;
  hasPrice: boolean;
}

// Ativar/desativar é reversível (o contrário de excluir) - por isso usa
// confirmação leve via toast com "Desfazer", em vez do modal de confirmação
// reservado para ações realmente destrutivas (regra de design da tarefa:
// "ação destrutiva com confirmação OU desfazer").
export function ActiveToggle({ formulaId, initialActive, hasPrice }: ActiveToggleProps) {
  const [active, setActive] = useState(initialActive);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function applyChange(next: boolean, { silent = false }: { silent?: boolean } = {}) {
    startTransition(async () => {
      const result = await updateFormula(formulaId, { active: next });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      setActive(next);
      router.refresh();
      if (!silent) {
        toast.success(next ? "Fórmula ativada." : "Fórmula desativada.", {
          action: {
            label: "Desfazer",
            onClick: () => applyChange(!next, { silent: true }),
          },
        });
      }
    });
  }

  function handleClick() {
    const next = !active;
    if (next && !hasPrice) {
      toast.error("Defina o preço por pote antes de ativar esta fórmula.");
      return;
    }
    applyChange(next);
  }

  return (
    <button
      type="button"
      className={`lc-admin-badge lc-admin-badge--${active ? "active" : "inactive"}`}
      onClick={handleClick}
      disabled={isPending}
      aria-pressed={active}
      aria-label={`Fórmula ${active ? "ativa" : "inativa"}. Clique para ${active ? "desativar" : "ativar"}.`}
    >
      {active ? "Ativo" : "Inativo"}
    </button>
  );
}
