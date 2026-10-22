"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { PRODUCT_LINE_LABELS } from "@/components/admin/enum-labels";
import { updateFormula } from "@/lib/actions/formulas";
import type { ProductLine } from "@/lib/data/admin";

interface LineSwitchProps {
  formulaId: string;
  formulaName: string;
  initialLine: ProductLine;
}

const OPTIONS = ["premium", "essencial", "lemon_caps"] as const;

// Troca o produto de aba (Premium, Econômica, Lemon Caps) direto da lista, sem abrir o
// editor (pedido do dono, 21/10/2026). Usa a mesma action do editor
// (updateFormula), então a trava de preço e o cache do catálogo seguem iguais.
// Reversível: toast com "Desfazer". Produto de linha antiga (Básica) aparece só
// como rótulo, sem controle.
export function LineSwitch({ formulaId, formulaName, initialLine }: LineSwitchProps) {
  const [line, setLine] = useState<ProductLine>(initialLine);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function applyChange(next: ProductLine, { silent = false }: { silent?: boolean } = {}) {
    startTransition(async () => {
      try {
        const result = await updateFormula(formulaId, { line: next });
        if (!result.ok) {
          toast.error(result.error);
          return;
        }
        const previous = line;
        setLine(next);
        router.refresh();
        if (!silent) {
          toast.success(`"${formulaName}" agora está na ${PRODUCT_LINE_LABELS[next]}.`, {
            action: { label: "Desfazer", onClick: () => applyChange(previous, { silent: true }) },
          });
        }
      } catch (caught) {
        console.error("[LineSwitch] falha ao trocar a linha:", caught);
        toast.error("Não foi possível trocar a linha agora. Tente novamente.");
      }
    });
  }

  if (!OPTIONS.includes(line as (typeof OPTIONS)[number])) {
    return <span>{PRODUCT_LINE_LABELS[line]}</span>;
  }

  return (
    <div className="lc-admin-line-switch" role="group" aria-label={`Linha de ${formulaName}`}>
      {OPTIONS.map((option) => (
        <button
          key={option}
          type="button"
          className={`lc-admin-line-switch-btn${line === option ? " is-active" : ""}`}
          aria-pressed={line === option}
          disabled={isPending || line === option}
          onClick={() => applyChange(option)}
        >
          {PRODUCT_LINE_LABELS[option]}
        </button>
      ))}
    </div>
  );
}
