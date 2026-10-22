"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { PRODUCT_LINE_LABELS } from "@/components/admin/enum-labels";
import { setCatalogLineEnabled } from "@/lib/actions/catalog-lines";
import type { AdminCatalogLineDTO } from "@/lib/data/admin";

interface CatalogLinesPanelProps {
  lines: AdminCatalogLineDTO[];
}

// Liga/desliga cada aba do catálogo público (pedido do dono, 21/10/2026).
// Desligar esconde a aba e as fórmulas dela do site, sem mexer em nenhuma
// fórmula; religar traz tudo de volta como estava. Reversível, então segue o
// padrão do ActiveToggle: toast com "Desfazer", sem modal de confirmação.
export function CatalogLinesPanel({ lines }: CatalogLinesPanelProps) {
  const [state, setState] = useState(() => new Map(lines.map((item) => [item.line, item.enabled] as const)));
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function applyChange(line: AdminCatalogLineDTO["line"], next: boolean, { silent = false }: { silent?: boolean } = {}) {
    startTransition(async () => {
      try {
        const result = await setCatalogLineEnabled(line, next);
        if (!result.ok) {
          toast.error(result.error);
          return;
        }
        setState((prev) => new Map(prev).set(line, next));
        router.refresh();
        if (!silent) {
          toast.success(next ? `${PRODUCT_LINE_LABELS[line]} ligada no site.` : `${PRODUCT_LINE_LABELS[line]} desligada no site.`, {
            action: { label: "Desfazer", onClick: () => applyChange(line, !next, { silent: true }) },
          });
        }
      } catch (caught) {
        console.error("[CatalogLinesPanel] falha ao alterar a linha:", caught);
        toast.error("Não foi possível alterar a linha agora. Tente novamente.");
      }
    });
  }

  const allOff = lines.every((item) => state.get(item.line) === false);

  return (
    <section className="lc-admin-linhas" aria-labelledby="lc-admin-linhas-titulo">
      <h2 id="lc-admin-linhas-titulo" className="lc-admin-linhas-titulo">
        Linhas no site
      </h2>
      <p className="lc-admin-linhas-ajuda">
        Liga ou desliga a aba inteira no catálogo público. Os produtos não são alterados: ao religar, tudo volta como estava.
      </p>
      <div className="lc-admin-linhas-grid">
        {lines.map((item) => {
          const enabled = state.get(item.line) ?? true;
          const label = PRODUCT_LINE_LABELS[item.line];
          return (
            <div key={item.line} className="lc-admin-linha-card">
              <div>
                <strong>{label}</strong>
                <span className="lc-admin-linha-meta">
                  {item.activeCount} produto{item.activeCount === 1 ? "" : "s"} ativo{item.activeCount === 1 ? "" : "s"}
                </span>
              </div>
              <button
                type="button"
                className={`lc-admin-badge lc-admin-badge--${enabled ? "active" : "inactive"}`}
                onClick={() => applyChange(item.line, !enabled)}
                disabled={isPending}
                aria-pressed={enabled}
                aria-label={`Linha ${label} ${enabled ? "no ar" : "oculta"}. Clique para ${enabled ? "ocultar" : "mostrar"} no site.`}
              >
                {enabled ? "No ar" : "Oculta"}
              </button>
            </div>
          );
        })}
      </div>
      {allOff && (
        <p className="lc-admin-linhas-aviso" role="status">
          As duas linhas estão ocultas: o catálogo público fica vazio até você ligar uma delas.
        </p>
      )}
    </section>
  );
}
